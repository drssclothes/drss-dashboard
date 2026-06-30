// Скрипт для GitHub Actions: читает лист LOG в Google Sheets (изменения цен)
// и дописывает цену за сегодняшний день в данные текущей недели в Supabase.
//
// Запускается по расписанию (09:00 / 15:00 / 21:00 МСК) — см. .github/workflows/sync-prices.yml
//
// Требуемые переменные окружения (GitHub Secrets):
//   GOOGLE_SERVICE_ACCOUNT_JSON — содержимое JSON-ключа сервисного аккаунта
//   SUPABASE_URL, SUPABASE_KEY — те же значения, что в background.js

import { createSign } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iamxvwptmhbxphtvtnpv.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_jZaXuH6bXs1Se7U_Wev7kg_BYWu6jdA';
const SPREADSHEET_ID = '1fOMErsWDCnJemVFIXGp7rMYDEw7WHhBTotSppjs60z8';
const LOG_SHEET_NAME = 'LOG';

function todayMoscow() {
  const now = new Date();
  const moscow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return moscow.toISOString().slice(0, 10);
}

function getCurrentWeekRange(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  const dayOfWeek = d.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - daysSinceMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const start = monday.toISOString().slice(0, 10);
  const end = sunday.toISOString().slice(0, 10);

  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  const fmt = dt => dt.getUTCDate() + ' ' + months[dt.getUTCMonth()];
  const label = fmt(monday) + ' – ' + fmt(sunday) + ' ' + sunday.getUTCFullYear();

  return { start, end, label };
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getGoogleAccessToken(serviceAccount) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const unsigned = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(claims));
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer.sign(serviceAccount.private_key);
  const jwt = unsigned + '.' + signature.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!resp.ok) {
    throw new Error('Google token error: ' + resp.status + ' ' + (await resp.text()));
  }
  const data = await resp.json();
  return data.access_token;
}

async function fetchPriceChangesToday(accessToken, todayStr) {
  const range = `${LOG_SHEET_NAME}!C:F`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
  const resp = await fetch(url, { headers: { Authorization: 'Bearer ' + accessToken } });
  if (!resp.ok) {
    throw new Error('Sheets read error: ' + resp.status + ' ' + (await resp.text()));
  }
  const data = await resp.json();
  const rows = data.values || [];

  function parseDate(raw) {
    if (!raw) return null;
    raw = raw.trim();
    let m = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    return null;
  }

  const priceByVc = {};
  rows.forEach(row => {
    const [vc, , newPriceRaw, dateRaw] = row;
    if (!vc || newPriceRaw == null || newPriceRaw === '') return;
    const dateKey = parseDate(dateRaw);
    if (dateKey !== todayStr) return;
    const price = parseFloat(String(newPriceRaw).replace(',', '.').replace(/[^\d.]/g, ''));
    if (!isNaN(price)) priceByVc[vc.trim()] = price;
  });

  return priceByVc;
}

async function updateWeekPrices(weekRange, todayStr, priceByVc) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
  };

  const checkResp = await fetch(
    `${SUPABASE_URL}/rest/v1/weeks?period=eq.${encodeURIComponent(weekRange.label)}`,
    { headers }
  );
  if (!checkResp.ok) throw new Error('Supabase read error: ' + checkResp.status);
  const existing = await checkResp.json();

  if (!existing.length) {
    console.log('Текущая неделя ещё не создана в Supabase (расширение ещё не запускалось) — пропускаем.');
    return { updated: 0, skipped: true };
  }

  const week = existing[0];
  const products = week.products || [];
  let updatedCount = 0;

  products.forEach(p => {
    const newPrice = priceByVc[p.vc];
    if (newPrice == null) return;
    if (!p.byDay) p.byDay = {};
    if (!p.byDay[todayStr]) p.byDay[todayStr] = { orders: 0, buyouts: 0, revenue: 0 };
    p.byDay[todayStr].price = newPrice;
    updatedCount++;
  });

  if (updatedCount === 0) {
    console.log('Изменений цены для артикулов из текущей недели не найдено.');
    return { updated: 0, skipped: false };
  }

  const updateResp = await fetch(
    `${SUPABASE_URL}/rest/v1/weeks?period=eq.${encodeURIComponent(weekRange.label)}`,
    {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ products }),
    }
  );
  if (!updateResp.ok) throw new Error('Supabase update error: ' + updateResp.status + ' ' + (await updateResp.text()));

  return { updated: updatedCount, skipped: false };
}

async function main() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.error('GOOGLE_SERVICE_ACCOUNT_JSON не задан');
    process.exit(1);
  }
  const serviceAccount = JSON.parse(serviceAccountJson);

  const todayStr = todayMoscow();
  const weekRange = getCurrentWeekRange(todayStr);
  console.log('Дата (МСК):', todayStr, '| Текущая неделя:', weekRange.label);

  const accessToken = await getGoogleAccessToken(serviceAccount);
  console.log('Google токен получен');

  const priceByVc = await fetchPriceChangesToday(accessToken, todayStr);
  console.log('Изменений цены за сегодня в LOG:', Object.keys(priceByVc).length);
  if (Object.keys(priceByVc).length) {
    console.log(JSON.stringify(priceByVc, null, 2));
  }

  if (!Object.keys(priceByVc).length) {
    console.log('Нет изменений цены за сегодня — завершаем без записи.');
    return;
  }

  const result = await updateWeekPrices(weekRange, todayStr, priceByVc);
  console.log('Готово. Обновлено артикулов:', result.updated);
}

main().catch(e => {
  console.error('Ошибка:', e.message);
  process.exit(1);
});
