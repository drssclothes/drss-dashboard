const STORE = 'drss-weeks';
let weeks = [], sortKey = 'views', sortAsc = false, activeWeek = null, activeCategory = 'all';
let charts = {};

const BUYOUT = {
  'DRSSFutGrey':69,'DRSSFutDarkGrey':61,'DRSSFutBlack':73,'DRSSFutPink':52,
  'DRSSFutPrintHD':50,'DRSSFut3Black':38,'DRSSFut3White':44,
  'DRSSBody2Black':41,'DRSSBody2White':49,'DRSSBody3Grey':41,'DRSSBody6Black':39,
  'DRSSBody11Grey':60,'DRSSBody16Black':49,'DRSSBody16White':40,
  'DRSSBody018Black':36,'DRSSBody019Black':27,'DRSSBody17Grey':51,
  'DRSSBody22Black':44,'DRSSBody22White':46,'DRSSBody32Black':39,
  'DRSSFut5Black':36,'DRSSFut5White':45,'DRSSFut5Bordo':36,'DRSSFut5Brown':34,
  'DRSSFut5Pink':36,'DRSSFut5Cream':36,'DRSSFut4Black':41,'DRSSFut4White':44,
  'DRSSFut4Bordo':41,'DRSSFut4Brown':38,'DRSSFut4Pink':36,'DRSSFut4Cream':36,
  'DRSSTShirtBlack':35,'DRSSTShirtWhite':44,'DRSSTShirtBrown':33,
  'DRSSTShirtBordo':31,'DRSSTShirtPink':33,'DRSSTShirtCream':33,
  'DRSSTShirt2Black':38,'DRSSTShirt2White':36,'DRSSTShirt2Brown':29,
  'DRSSTShirt2Bordo':39,'DRSSTShirt2Pink':38,'DRSSTShirt2Cream':38,
  'DRSSTShirt3Black':40,'DRSSTShirt3White':43,'DRSSTShirt3Bordo':38,
  'DRSSTShirt3Brown':38,'DRSSTShirt3Pink':38,'DRSSTShirt3Cream':38,
  'DRSSBody3Black':44,'DRSSBody3White':44,'DRSSBody3Brown':47,
  'DRSSBody5Black':34,'DRSSBody5White':42,'DRSSBody5Brown':31,'DRSSBody5Bordo':34,
  'DRSSBody7Black':39,'DRSSBody7White':42,
  'DRSSBody9Black':50,'DRSSBody9White':32,'DRSSBody9Bordo':32,'DRSSBody9Brown':32,'DRSSBody9Pink':50,
  'DRSSBody10Black':38,'DRSSBody10White':41,
  'DRSSBody11Black':46,'DRSSBody11White':47,'DRSSBody11Brown':43,'DRSSBody11Bordo':46,'DRSSBody11Pink':46,'DRSSBody11Cream':46,
  'DRSSBody13Black':41,'DRSSBody13White':49,'DRSSBody13Brown':38,'DRSSBody13Bordo':34,'DRSSBody13Pink':38,'DRSSBody13Cream':38,
  'DRSSBody15Grey':33,'DRSSBody15White':36,'DRSSBody15Brown':36,'DRSSBody15Black':33,'DRSSBody15Bordo':33,'DRSSBody15Pink':33,'DRSSBody15Cream':33,
  'DRSSBody17Black':48,'DRSSBody17White':48,'DRSSBody17Brown':41,'DRSSBody17Bordo':40,'DRSSBody17Pink':40,'DRSSBody17Cream':40,
  'DRSSBody20White':44,'DRSSBody20Black':42,'DRSSBody20Brown':37,'DRSSBody20Bordo':37,'DRSSBody20Pink':37,'DRSSBody20Cream':37,
  'DRSSBody21Black':49,'DRSSBody21White':46,'DRSSBody21Brown':40,'DRSSBody21Bordo':52,'DRSSBody21Pink':46,'DRSSBody21Cream':46,
  'DRSSBody23Black':25,'DRSSBody23White':34,'DRSSBody23Brown':24,'DRSSBody23Bordo':28,'DRSSBody23Cherny':30,'DRSSBody23Pink':30,'DRSSBody23Cream':30,
  'DRSSBody24Black':25,'DRSSBody24White':37,'DRSSBody24Brown':23,'DRSSBody24Bordo':25,
  'DRSSBody25White':45,'DRSSBody25Black':34,'DRSSBody25Brown':41,
  'DRSSBody33Black':57,'DRSSBody33White':36,'DRSSBody33Brown':36,
  'DRSSBody34Black':42,'DRSSBody34Bordo':47,'DRSSBody35Brown':33,'DRSSBody36Brown':44,
  'DRSSBody036Black':46,'DRSSBody026Black':63,'DRSSBody40Brown':36,
  'DRSSLong1Black':29,'DRSSLong1White':37,'DRSSLong1Brown':34,'DRSSLong1Bordo':27,
  'DRSSLong2Black':32,'DRSSLong2White':39,'DRSSLong2Brown':32,'DRSSLong2Bordo':25,
  'DRSSLong4Black':35,'DRSSLong5Black':41,'DRSSLong6Black':35,'DRSSLong7Brown':26,'DRSSLong8Black':47,'DRSSLong00Black':40,
  'DRSSTopWhite':35,'DRSSTopBrown':29,'DRSSTopBlack':33,
  'DRSSTop5White':42,'DRSSTop5Brown':32,'DRSSTop6Black':40,'DRSSTop7Beige':40,'DRSSTopBlack2':40,
  'DRSSBody42White':36,'DRSSBody41Black':36,
};

const CATEGORIES_MAP = {
  'DRSSFutGrey':'Футболки','DRSSFutDarkGrey':'Футболки','DRSSFutBlack':'Футболки','DRSSFutPink':'Футболки',
  'DRSSFutPrintHD':'Футболки','DRSSFut3Black':'Футболки','DRSSFut3White':'Футболки',
  'DRSSFut5Black':'Футболки','DRSSFut5White':'Футболки','DRSSFut5Bordo':'Футболки','DRSSFut5Brown':'Футболки','DRSSFut5Pink':'Футболки','DRSSFut5Cream':'Футболки',
  'DRSSFut4Black':'Футболки','DRSSFut4White':'Футболки','DRSSFut4Bordo':'Футболки','DRSSFut4Brown':'Футболки','DRSSFut4Pink':'Футболки','DRSSFut4Cream':'Футболки',
  'DRSSTShirtBlack':'Майки','DRSSTShirtWhite':'Майки','DRSSTShirtBrown':'Майки','DRSSTShirtBordo':'Майки','DRSSTShirtPink':'Майки','DRSSTShirtCream':'Майки',
  'DRSSTShirt2Black':'Майки','DRSSTShirt2White':'Майки','DRSSTShirt2Brown':'Майки','DRSSTShirt2Bordo':'Майки','DRSSTShirt2Pink':'Майки','DRSSTShirt2Cream':'Майки',
  'DRSSTShirt3Black':'Майки','DRSSTShirt3White':'Майки','DRSSTShirt3Bordo':'Майки','DRSSTShirt3Brown':'Майки','DRSSTShirt3Pink':'Майки','DRSSTShirt3Cream':'Майки',
  'DRSSBody2Black':'Боди','DRSSBody2White':'Боди','DRSSBody3Grey':'Боди','DRSSBody6Black':'Боди',
  'DRSSBody11Grey':'Боди','DRSSBody16Black':'Боди','DRSSBody16White':'Боди','DRSSBody018Black':'Боди','DRSSBody019Black':'Боди','DRSSBody17Grey':'Боди',
  'DRSSBody22Black':'Боди','DRSSBody22White':'Боди','DRSSBody32Black':'Боди',
  'DRSSBody3Black':'Боди','DRSSBody3White':'Боди','DRSSBody3Brown':'Боди',
  'DRSSBody5Black':'Боди','DRSSBody5White':'Боди','DRSSBody5Brown':'Боди','DRSSBody5Bordo':'Боди',
  'DRSSBody7Black':'Боди','DRSSBody7White':'Боди',
  'DRSSBody9Black':'Боди','DRSSBody9White':'Боди','DRSSBody9Bordo':'Боди','DRSSBody9Brown':'Боди','DRSSBody9Pink':'Боди',
  'DRSSBody10Black':'Боди','DRSSBody10White':'Боди',
  'DRSSBody11Black':'Боди','DRSSBody11White':'Боди','DRSSBody11Brown':'Боди','DRSSBody11Bordo':'Боди','DRSSBody11Pink':'Боди','DRSSBody11Cream':'Боди',
  'DRSSBody13Black':'Боди','DRSSBody13White':'Боди','DRSSBody13Brown':'Боди','DRSSBody13Bordo':'Боди','DRSSBody13Pink':'Боди','DRSSBody13Cream':'Боди',
  'DRSSBody15Grey':'Боди','DRSSBody15White':'Боди','DRSSBody15Brown':'Боди','DRSSBody15Black':'Боди','DRSSBody15Bordo':'Боди','DRSSBody15Pink':'Боди','DRSSBody15Cream':'Боди',
  'DRSSBody17Black':'Боди','DRSSBody17White':'Боди','DRSSBody17Brown':'Боди','DRSSBody17Bordo':'Боди','DRSSBody17Pink':'Боди','DRSSBody17Cream':'Боди',
  'DRSSBody20White':'Боди','DRSSBody20Black':'Боди','DRSSBody20Brown':'Боди','DRSSBody20Bordo':'Боди','DRSSBody20Pink':'Боди','DRSSBody20Cream':'Боди',
  'DRSSBody21Black':'Боди','DRSSBody21White':'Боди','DRSSBody21Brown':'Боди','DRSSBody21Bordo':'Боди','DRSSBody21Pink':'Боди','DRSSBody21Cream':'Боди',
  'DRSSBody23Black':'Боди','DRSSBody23White':'Боди','DRSSBody23Brown':'Боди','DRSSBody23Bordo':'Боди','DRSSBody23Cherny':'Боди','DRSSBody23Pink':'Боди','DRSSBody23Cream':'Боди',
  'DRSSBody24Black':'Боди','DRSSBody24White':'Боди','DRSSBody24Brown':'Боди','DRSSBody24Bordo':'Боди',
  'DRSSBody25White':'Боди','DRSSBody25Black':'Боди','DRSSBody25Brown':'Боди',
  'DRSSBody33Black':'Боди','DRSSBody33White':'Боди','DRSSBody33Brown':'Боди',
  'DRSSBody34Black':'Боди','DRSSBody34Bordo':'Боди','DRSSBody35Brown':'Боди','DRSSBody36Brown':'Боди',
  'DRSSBody036Black':'Боди','DRSSBody026Black':'Боди','DRSSBody40Brown':'Боди',
  'DRSSBody42White':'Боди','DRSSBody41Black':'Боди',
  'DRSSLong1Black':'Лонгсливы','DRSSLong1White':'Лонгсливы','DRSSLong1Brown':'Лонгсливы','DRSSLong1Bordo':'Лонгсливы',
  'DRSSLong2Black':'Лонгсливы','DRSSLong2White':'Лонгсливы','DRSSLong2Brown':'Лонгсливы','DRSSLong2Bordo':'Лонгсливы',
  'DRSSLong4Black':'Лонгсливы','DRSSLong5Black':'Лонгсливы','DRSSLong6Black':'Лонгсливы','DRSSLong7Brown':'Лонгсливы','DRSSLong8Black':'Лонгсливы','DRSSLong00Black':'Лонгсливы',
  'DRSSTopWhite':'Топы','DRSSTopBrown':'Топы','DRSSTopBlack':'Топы',
  'DRSSTop5White':'Топы','DRSSTop5Brown':'Топы','DRSSTop6Black':'Топы','DRSSTop7Beige':'Топы','DRSSTopBlack2':'Топы',
};

function getCategory(vc) {
  return CATEGORIES_MAP[vc] || 'Другое';
}

const CATEGORIES = ['all','Боди','Майки','Футболки','Лонгсливы','Топы'];
const CAT_LABELS = {all:'Все',Боди:'Боди',Майки:'Майки',Футболки:'Футболки',Лонгсливы:'Лонгсливы',Топы:'Топы'};

function getBuyoutPct(p) {
  if (p.wb_buyout_pct != null) return p.wb_buyout_pct;
  if (p.sheet_buyout_pct != null) return p.sheet_buyout_pct;
  return BUYOUT[p.vc] || null;
}

function calcDrrBuyout(p) {
  if (p.wb_revenue && p.wb_revenue > 0 && p.sum > 0) {
    return (p.sum / p.wb_revenue) * 100;
  }
  const pct = p.sheet_buyout_pct != null ? p.sheet_buyout_pct : BUYOUT[p.vc];
  if (!pct || !p.sum_price || !p.sum) return null;
  return (p.sum / (p.sum_price * pct / 100)) * 100;
}

function calcAvgDrrBuyout(products, wbTotalRevenue) {
  const totalSpend = products.reduce((s, p) => s + (p.sum || 0), 0);
  if (wbTotalRevenue && wbTotalRevenue > 0) {
    return (totalSpend / wbTotalRevenue) * 100;
  }
  let totalRevenue = 0;
  products.forEach(p => {
    const pct = getBuyoutPct(p);
    if (p.wb_revenue && p.wb_revenue > 0) totalRevenue += p.wb_revenue;
    else if (pct && p.sum_price > 0) totalRevenue += p.sum_price * pct / 100;
  });
  return totalRevenue > 0 ? (totalSpend / totalRevenue) * 100 : null;
}

// Определяем где хранить — chrome.storage или localStorage
const IS_EXT = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

// Supabase — читаем все недели для веб-версии
const SB_URL = 'https://iamxvwptmhbxphtvtnpv.supabase.co';
const SB_KEY = 'sb_publishable_jZaXuH6bXs1Se7U_Wev7kg_BYWu6jdA';

if (!IS_EXT) {
  window.storageGetOverride = async () => {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/weeks?select=*&order=id.asc`, {
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
      });
      if (!r.ok) return [];
      const rows = await r.json();
      // Каждая строка Supabase: { id, period, date, totals, products }
      return rows.map(row => ({
        id: row.id,
        period: row.period,
        date: row.date,
        totals: typeof row.totals === 'string' ? JSON.parse(row.totals) : (row.totals || {}),
        products: typeof row.products === 'string' ? JSON.parse(row.products) : (row.products || []),
      }));
    } catch(e) {
      console.error('Supabase load error:', e);
      return [];
    }
  };
}

function storageGet(cb) {
  // Веб-версия — читаем из Supabase
  if (window.storageGetOverride) {
    window.storageGetOverride().then(data => cb(data));
    return;
  }
  if (IS_EXT) {
    chrome.storage.local.get(STORE, d => cb(d[STORE] || []));
  } else {
    try { cb(JSON.parse(localStorage.getItem(STORE) || '[]')); } catch(e) { cb([]); }
  }
}

function storageSet(data, cb) {
  if (IS_EXT) {
    chrome.storage.local.set({[STORE]: data}, cb);
  } else {
    localStorage.setItem(STORE, JSON.stringify(data));
    if (cb) cb();
  }
}

function load() {
  storageGet(data => { weeks = data; init(); });
  if (IS_EXT) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[STORE]) { weeks = changes[STORE].newValue || []; init(); }
    });
  }
}

function saveWeekManual() {
  const period = document.getElementById('period')?.value?.trim();
  const raw = document.getElementById('json-in')?.value?.trim();
  const msg = document.getElementById('save-msg');
  if (!period) { if(msg) { msg.textContent='Укажи период'; msg.className='msg-err'; } return; }
  if (!raw) { if(msg) { msg.textContent='Вставь JSON'; msg.className='msg-err'; } return; }
  let data;
  try { data = JSON.parse(raw); } catch(e) { if(msg) { msg.textContent='Ошибка JSON'; msg.className='msg-err'; } return; }
  const t = data.totals || {};
  const pw = data.products_wb || {};
  const CAT = {
    404324:'DRSSTShirtBlack',404292:'DRSSBody3White',404338:'DRSSBody15White',
    404314:'DRSSBody11Black',404284:'DRSSBody3Black',404276:'DRSSBody21Black',
    404286:'DRSSBody13White',404369:'DRSSTShirtWhite',404295:'DRSSTShirt2White',
    404336:'DRSSBody17Black',404352:'DRSSTShirt3Black',404327:'DRSSBody23White',
    404322:'DRSSBody21White',404315:'DRSSBody17White',404350:'DRSSFut5White',
    404302:'DRSSTShirt3White',404357:'DRSSBody2White',404361:'DRSSBody20White',
    404332:'DRSSBody23Black',404371:'DRSSBody32Black',404283:'DRSSFut4White',
    404275:'DRSSFut5Black',404323:'DRSSFut4Black',448946:'DRSSTShirt2Black',
    404300:'DRSSBody9White',404370:'DRSSBody33Black',406620:'DRSSBody9Black',
    406559:'DRSSBody11White',448904:'DRSSBody15Grey',404340:'DRSSBody6Black',
    404335:'DRSSBody5White',404359:'DRSSFutPink',404281:'DRSSBody5Black',
    404311:'DRSSLong1Black',404333:'DRSSBody7White',404316:'DRSSBody24Black',
    404304:'DRSSLong2Black',404303:'DRSSLong1White',404365:'DRSSBody10Black',
    404345:'DRSSBody25Black',404299:'DRSSBody24White',404368:'DRSSBody20Black',
    404353:'DRSSBody10White',409803:'DRSSLong2White',515808:'DRSSLong5Black',
    617880:'DRSSLong8Black',617883:'DRSSLong7Brown',564913:'DRSSLong00Black',
    617887:'DRSSTop5White',617888:'DRSSTop6Black',617886:'DRSSTop7Beige',617889:'DRSSTopBlack2',
  };
  const products = Object.values(pw).map(p => {
    const s = p.stat || {};
    return { id:p.id, vc:CAT[p.id]||String(p.id), views:s.views||0, CTR:s.CTR, CR:s.CR,
      CPO:s.CPO, cpo_as:s.CPO_with_rel, DRR:s.DRR||0, sum:s.sum||0, orders:s.orders||0, sum_price:s.ordered_sum_report||0 };
  }).filter(p => p.views > 50 || p.orders > 0);
  const week = {
    id: Date.now(), period, date: new Date().toLocaleDateString('ru-RU'),
    totals: { views:t.views||0, ctr:t.ctr||0, cr:t.cr||0, cpo:t.cpo||0, drr:t.drr||0, sum:t.sum||0, orders:t.orders||0 },
    products,
  };
  const idx = weeks.findIndex(w => w.period === period);
  if (idx >= 0) weeks[idx] = week; else weeks.push(week);
  weeks.sort((a,b) => a.id - b.id);
  storageSet(weeks, () => {
    if(msg) { msg.textContent='✓ Сохранено: '+period; msg.className='msg-ok'; }
    if(document.getElementById('json-in')) document.getElementById('json-in').value='';
    if(document.getElementById('period')) document.getElementById('period').value='';
    init();
  });
}

function init() {
  if (!activeWeek && weeks.length) activeWeek = weeks[weeks.length-1].id;
  renderKPI(); renderCategoryBar(); renderWeekBar(); renderHistTable(); renderTable();
  if (weeks.length >= 2) { document.getElementById('charts-grid').style.display=''; renderCharts(); }
  else document.getElementById('charts-grid').style.display='none';
  document.getElementById('hist-section').style.display = weeks.length ? '' : 'none';
  document.getElementById('header-meta').textContent = weeks.length
    ? 'Последнее: ' + weeks[weeks.length-1].period
    : 'Загрузи данные из Xway';
  // Показываем/скрываем форму ввода (только на веб-версии)
  const uploadPanel = document.getElementById('upload-panel');
  if (uploadPanel) uploadPanel.style.display = IS_EXT ? 'none' : '';
}

function fmtV(n) { return n>=1e6?(n/1e6).toFixed(1)+'М':n>=1000?(n/1000).toFixed(0)+'К':String(n); }
function fmtR(n) { return Math.round(n).toLocaleString('ru'); }
function delta(cur, prev, lib) {
  if (!prev || cur == null) return '';
  const d = ((cur-prev)/Math.abs(prev)*100).toFixed(0);
  const better = lib ? cur<prev : cur>prev;
  return '<span class="'+(better?'up':'down')+'">'+(cur>prev?'↑':'↓')+Math.abs(d)+'%</span>';
}

function renderKPI() {
  const w = weeks.find(w=>w.id===activeWeek); if(!w) return;
  const t = w.totals, prev = weeks[weeks.indexOf(w)-1]?.totals;
  document.getElementById('k-views').textContent = fmtV(t.views);
  document.getElementById('k-ctr').textContent = t.ctr.toFixed(1)+'%';
  document.getElementById('k-cr').textContent = t.cr.toFixed(1)+'%';
  document.getElementById('k-cpo').textContent = Math.round(t.cpo)+'₽';
  document.getElementById('k-drr').textContent = t.drr.toFixed(1)+'%';
  document.getElementById('k-sum').textContent = fmtR(Math.round(t.sum))+'₽';
  const wbRevenue = (w.products||[]).reduce((s,p) => s+(p.wb_revenue||0), 0);
  const drrBuyout = calcAvgDrrBuyout(w.products||[], wbRevenue);
  const el = document.getElementById('k-drr-buyout');
  if (el) el.textContent = drrBuyout != null ? drrBuyout.toFixed(1)+'%' : '—';
  if (prev) {
    document.getElementById('kd-views').innerHTML = delta(t.views,prev.views,false);
    document.getElementById('kd-ctr').innerHTML = delta(t.ctr,prev.ctr,false);
    document.getElementById('kd-cr').innerHTML = delta(t.cr,prev.cr,false);
    document.getElementById('kd-cpo').innerHTML = delta(t.cpo,prev.cpo,true);
    document.getElementById('kd-drr').innerHTML = delta(t.drr,prev.drr,true);
    document.getElementById('kd-sum').innerHTML = delta(t.sum,prev.sum,false);
    const prevW = weeks[weeks.indexOf(w)-1];
    const prevWbRev = (prevW?.products||[]).reduce((s,p) => s+(p.wb_revenue||0), 0);
    const prevDrr = calcAvgDrrBuyout(prevW?.products||[], prevWbRev);
    const elD = document.getElementById('kd-drr-buyout');
    if (elD && drrBuyout != null && prevDrr != null) elD.innerHTML = delta(drrBuyout, prevDrr, true);
  }
}

function renderCategoryBar() {
  const bar = document.getElementById('category-bar'); if(!bar) return;
  bar.innerHTML = CATEGORIES.map(c =>
    '<button class="cat-btn'+(activeCategory===c?' active':'')+'" data-cat="'+c+'">'+CAT_LABELS[c]+'</button>'
  ).join('');
  bar.querySelectorAll('.cat-btn').forEach(b => b.addEventListener('click', () => {
    activeCategory = b.dataset.cat; renderTable();
    bar.querySelectorAll('.cat-btn').forEach(x => x.classList.toggle('active', x.dataset.cat===activeCategory));
  }));
}

function renderWeekBar() {
  const bar = document.getElementById('week-bar'); if(!bar) return;
  if (!weeks.length) { bar.innerHTML=''; return; }
  bar.innerHTML = '<span class="week-label">Период:</span>' +
    weeks.map(w=>'<button class="week-btn'+(w.id===activeWeek?' active':'')+'" data-id="'+w.id+'">'+w.period+'</button>').join('');
  bar.querySelectorAll('.week-btn').forEach(b => b.addEventListener('click', () => {
    activeWeek = Number(b.dataset.id); init();
  }));
}

function renderHistTable() {
  const body = document.getElementById('hist-body'); if(!body) return;
  body.innerHTML = weeks.map((w,i) => {
    const t = w.totals, prev = weeks[i-1]?.totals;
    return '<tr>'+
      '<td><span class="vc">'+w.period+'</span><br><span style="font-size:10px;color:var(--text3)">'+w.date+'</span></td>'+
      '<td class="num">'+fmtV(t.views)+'</td>'+
      '<td class="num">'+t.ctr.toFixed(1)+'% '+(prev?delta(t.ctr,prev.ctr,false):'')+'</td>'+
      '<td class="num">'+t.cr.toFixed(1)+'% '+(prev?delta(t.cr,prev.cr,false):'')+'</td>'+
      '<td class="num">'+Math.round(t.cpo)+'₽ '+(prev?delta(t.cpo,prev.cpo,true):'')+'</td>'+
      '<td class="num">'+t.drr.toFixed(1)+'% '+(prev?delta(t.drr,prev.drr,true):'')+'</td>'+
      '<td class="num">'+fmtR(Math.round(t.sum))+'₽</td>'+
      '<td class="num">'+t.orders.toLocaleString('ru')+'</td>'+
      '<td><button style="background:none;border:none;color:var(--text3);cursor:pointer" data-del="'+w.id+'">✕</button></td>'+
    '</tr>';
  }).join('');
  body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    weeks = weeks.filter(w => w.id !== Number(b.dataset.del));
    storageSet(weeks, () => init());
  }));
}

function renderTable() {
  const w = weeks.find(w=>w.id===activeWeek);
  const body = document.getElementById('main-body'); if(!body) return;

  const q = document.getElementById('search')?.value?.toLowerCase() || '';

  // Полный список артикулов из каталога — всегда показываем все
  const allVcs = Object.keys(CATEGORIES_MAP);

  // Данные из текущей недели по vc
  const weekData = {};
  (w?.products || []).forEach(p => { weekData[p.vc] = p; });

  // Данные предыдущей недели для сравнения
  const wIdx = weeks.findIndex(ww=>ww.id===activeWeek);
  const prevW2 = wIdx > 0 ? weeks[wIdx-1] : null;
  const prevWeekData = {};
  (prevW2?.products || []).forEach(p => { prevWeekData[p.vc] = p; });

  // Строим список строк: если есть данные — используем, иначе заглушка
  let rows = allVcs
    .filter(vc => {
      if (q && !vc.toLowerCase().includes(q)) return false;
      if (activeCategory !== 'all' && getCategory(vc) !== activeCategory) return false;
      return true;
    })
    .map(vc => weekData[vc] ? { ...weekData[vc], _hasData: true } : { vc, _hasData: false });

  // Сортировка: по названию модели (убираем цветовой суффикс — последнее слово с заглавной)
  function modelKey(vc) {
    // DRSSBody11Black → DRSSBody11, DRSSLong1White → DRSSLong1
    return vc.replace(/(Black|White|Brown|Bordo|Pink|Cream|Grey|Beige|Cherny|Beige|Green|\d*$)$/, '');
  }
  // Цветовой приоритет внутри модели
  const colorOrder = ['Black','White','Brown','Bordo','Pink','Cream','Grey','Beige'];
  function colorIdx(vc) {
    for (let i=0; i<colorOrder.length; i++) if (vc.endsWith(colorOrder[i])) return i;
    return 99;
  }

  if (sortKey === 'vc' || sortKey === 'views' && !w) {
    rows.sort((a,b) => {
      const mk = modelKey(a.vc).localeCompare(modelKey(b.vc));
      if (mk !== 0) return mk;
      return colorIdx(a.vc) - colorIdx(b.vc);
    });
  } else {
    // Сначала сортируем по выбранному ключу (только строки с данными наверх),
    // но внутри одной модели держим вместе
    rows.sort((a,b) => {
      const mk = modelKey(a.vc).localeCompare(modelKey(b.vc));
      if (mk !== 0) return mk;
      return colorIdx(a.vc) - colorIdx(b.vc);
    });
  }

  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="10"><div class="empty-state"><div class="empty-big">📊</div>Нет артикулов</div></td></tr>';
    return;
  }

  const maxV = Math.max(...rows.filter(r=>r._hasData).map(r=>r.views||0), 1);
  const catColors = {Боди:'#ff5c6a',Майки:'#6c63ff',Футболки:'#22d3a3',Лонгсливы:'#fbbf24',Топы:'#a78bfa',Другое:'#4a4a66'};

  function getPrev(vc) { return prevWeekData[vc] || null; }

  function trendCell(cur, prevVal, lowerBetter, fmt) {
    if (cur == null) return '—';
    let str = fmt(cur);
    if (prevVal != null && prevVal !== 0) {
      const pct = ((cur - prevVal) / Math.abs(prevVal) * 100);
      const better = lowerBetter ? cur < prevVal : cur > prevVal;
      const cls = better ? 'up' : 'down';
      const arrow = cur > prevVal ? '↑' : '↓';
      str += ' <span class="'+cls+'" style="font-size:9px">'+arrow+Math.abs(pct).toFixed(0)+'%</span>';
    }
    return str;
  }

  body.innerHTML = rows.map(p => {
    const cat = getCategory(p.vc);
    const cc = catColors[cat]||'#4a4a66';
    const catBadge = '<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:'+cc+'22;color:'+cc+';margin-right:5px">'+cat+'</span>';

    // Артикул без данных за неделю — серая строка с прочерками
    if (!p._hasData) {
      return '<tr style="opacity:0.35">'+
        '<td>'+catBadge+'<span class="vc" data-vc="'+p.vc+'">'+p.vc+'</span></td>'+
        '<td class="num" colspan="9" style="color:var(--text3);text-align:left;font-size:11px">нет рекламы</td>'+
      '</tr>';
    }

    const buyoutPct = getBuyoutPct(p);
    const lowSpend = p.sum < 1000;
    const drrBuyout = lowSpend ? null : calcDrrBuyout(p);
    const bad = !lowSpend && ((p.CPO&&p.CPO>400)||(p.DRR&&p.DRR>10)||(p.CTR!=null&&p.CTR<1&&p.views>10000));
    const good = !lowSpend && p.CTR!=null&&p.CTR>=4&&p.CPO!=null&&p.CPO<80;
    const bw = Math.round((p.views||0)/maxV*60);
    const prev = getPrev(p.vc);
    const prevDrrBuyout = prev ? calcDrrBuyout(prev) : null;

    return '<tr class="'+(bad?'row-bad':good?'row-good':'')+'">'+
      '<td>'+catBadge+'<span class="vc" data-vc="'+p.vc+'">'+p.vc+'</span>'+(bad?'<span class="badge-bad">!</span>':'')+(good?'<span class="badge-good">✓</span>':'')+'</td>'+
      '<td class="num"><span class="views-bar" style="width:'+bw+'px"></span>'+trendCell(p.views, prev?.views, false, v=>fmtV(v))+'</td>'+
      '<td class="num">'+(lowSpend?'<span style="color:var(--text3)">—</span>':trendCell(p.CTR, prev?.CTR, false, v=>v.toFixed(1)+'%'))+'</td>'+
      '<td class="num">'+(lowSpend?'<span style="color:var(--text3)">—</span>':trendCell(p.CR, prev?.CR, false, v=>v.toFixed(1)+'%'))+'</td>'+
      '<td class="num '+((!lowSpend&&p.CPO>400)?'down':(!lowSpend&&p.CPO<80)?'up':'')+'">'+( lowSpend?'<span style="color:var(--text3)">—</span>':trendCell(p.CPO, prev?.CPO, true, v=>Math.round(v)+'₽'))+'</td>'+
      '<td class="num">'+( lowSpend?'<span style="color:var(--text3)">—</span>':trendCell(p.cpo_as, prev?.cpo_as, true, v=>Math.round(v)+'₽'))+'</td>'+
      '<td class="num '+((!lowSpend&&p.DRR>10)?'down':(!lowSpend&&p.DRR<2)?'up':'')+'">'+( lowSpend?'<span style="color:var(--text3)">—</span>':trendCell(p.DRR, prev?.DRR, true, v=>v.toFixed(1)+'%'))+'</td>'+
      '<td class="num '+(drrBuyout!=null&&drrBuyout>15?'down':drrBuyout!=null&&drrBuyout<5?'up':'')+'">'+trendCell(drrBuyout, prevDrrBuyout, true, v=>v.toFixed(1)+'%')+'</td>'+
      '<td class="num" style="color:var(--text3)">'+(buyoutPct?buyoutPct+'%':'—')+'</td>'+
      '<td class="num">'+trendCell(p.sum, prev?.sum, false, v=>fmtR(Math.round(v))+'₽')+'</td>'+
    '</tr>';
  }).join('');
}

// ── Модальное окно с разбивкой по размерам ──
function openSizeModal(vc) {
  const w = weeks.find(w=>w.id===activeWeek);
  const p = w?.products?.find(p => p.vc === vc);
  const modal = document.getElementById('size-modal');
  const title = document.getElementById('size-modal-title');
  const body = document.getElementById('size-modal-body');
  if (!modal || !title || !body) return;

  title.textContent = vc;

  const sizes = p?.sizes;
  if (!sizes || !Object.keys(sizes).length) {
    body.innerHTML = '<div class="size-empty">Нет данных по размерам для этого артикула за выбранную неделю</div>';
  } else {
    const entries = Object.entries(sizes);
    const totalOrders = entries.reduce((s,[,v])=>s+(v.orders||0),0) || 1;

    // Темп выкупов за неделю → приводим к 5 дням для оборачиваемости
    // buyouts за 7 дней / 7 * 5 = buyouts * 5/7
    entries.sort((a,b) => (b[1].orders||0) - (a[1].orders||0));

    const rows = entries.map(([size, v]) => {
      const orders = v.orders || 0;
      const buyouts = v.buyouts || 0;
      const stock = v.stock;
      const pctDemand = Math.round(orders / totalOrders * 100);
      const pctBuyout = orders > 0 ? Math.round(buyouts / orders * 100) : null;

      // Оборачиваемость = остаток / темп выкупов за 5 дней
      // темп = buyouts_за_неделю / 7 * 5 (ср. за 5 дней)
      let turnover = null;
      let turnoverHtml = '—';
      if (stock != null && buyouts > 0) {
        const dailyRate = buyouts / 7;
        turnover = Math.round(stock / dailyRate);
        const color = turnover < 14 ? '#ff5c6a' : turnover > 90 ? '#fbbf24' : '#22d3a3';
        const warn = turnover < 14 ? ' ⚠' : '';
        turnoverHtml = '<span style="color:'+color+';font-weight:500">'+turnover+' дн'+warn+'</span>';
      } else if (stock != null && buyouts === 0) {
        turnoverHtml = stock > 0 ? '<span style="color:var(--text3)">∞</span>' : '<span style="color:var(--text3)">0</span>';
      }

      const stockHtml = stock != null ? stock+' шт' : '—';

      return '<div class="size-row" style="display:grid;grid-template-columns:52px 1fr 60px 52px 60px 80px;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">'+
        '<div style="font-size:13px;font-weight:500">'+size+'</div>'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<div class="size-bar-track" style="flex:1"><div class="size-bar-fill" style="width:'+pctDemand+'%"></div></div>'+
          '<span style="font-size:11px;color:var(--text2);width:28px;text-align:right">'+pctDemand+'%</span>'+
        '</div>'+
        '<div style="font-size:11px;color:var(--text2);text-align:right">'+orders+' зак</div>'+
        '<div style="font-size:11px;text-align:right;color:'+(pctBuyout!=null&&pctBuyout<40?'#ff5c6a':pctBuyout!=null&&pctBuyout>=55?'#22d3a3':'var(--text2)')+'">'+
          (pctBuyout!=null?pctBuyout+'%':'—')+
        '</div>'+
        '<div style="font-size:11px;color:var(--text2);text-align:right">'+stockHtml+'</div>'+
        '<div style="font-size:11px;text-align:right">'+turnoverHtml+'</div>'+
      '</div>';
    }).join('');

    // Шапка
    const header = '<div style="display:grid;grid-template-columns:52px 1fr 60px 52px 60px 80px;gap:8px;padding:4px 0 8px;border-bottom:1px solid var(--border2);font-size:10px;color:var(--text3)">'+
      '<div>Размер</div><div>Спрос</div><div style="text-align:right">Заказы</div>'+
      '<div style="text-align:right">Выкуп%</div><div style="text-align:right">Остаток</div>'+
      '<div style="text-align:right">Оборач.</div></div>';

    const note = '<div style="margin-top:10px;font-size:10px;color:var(--text3)">'+
      'Оборачиваемость = остаток / темп выкупов за неделю. Красный &lt;14 дн, жёлтый &gt;90 дн.</div>';

    body.innerHTML = header + rows + note;
  }

  modal.classList.add('open');
}

function closeSizeModal() {
  document.getElementById('size-modal')?.classList.remove('open');
}

document.getElementById('main-body')?.addEventListener('click', (e) => {
  const el = e.target.closest('.vc');
  if (el && el.dataset.vc) openSizeModal(el.dataset.vc);
});
document.getElementById('size-modal-close')?.addEventListener('click', closeSizeModal);
document.getElementById('size-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'size-modal') closeSizeModal();
});

function renderCharts() {
  const labels = weeks.map(w=>w.period.replace(' 2026',''));
  const mk = (id, data, color) => {
    if (charts[id]) charts[id].destroy();
    const el = document.getElementById(id); if(!el) return;
    el.width = el.offsetWidth||200; el.height = el.offsetHeight||120;
    charts[id] = new Chart(el, {data:{labels,datasets:[{data,borderColor:color}]}});
  };
  mk('c-views', weeks.map(w=>Math.round(w.totals.views/1000)), '#6c63ff');
  mk('c-ctr', weeks.map(w=>w.totals.ctr), '#22d3a3');
  mk('c-cpo', weeks.map(w=>Math.round(w.totals.cpo)), '#ff5c6a');
  mk('c-sum', weeks.map(w=>Math.round(w.totals.sum/1000)), '#a78bfa');
}

document.querySelectorAll('thead th[data-k]').forEach(th => {
  th.addEventListener('click', () => {
    const k = th.dataset.k;
    if (sortKey===k) sortAsc=!sortAsc; else { sortKey=k; sortAsc=false; }
    renderTable();
  });
});

const searchEl = document.getElementById('search');
if (searchEl) searchEl.addEventListener('input', renderTable);

const saveBtn = document.getElementById('btn-save');
if (saveBtn) saveBtn.addEventListener('click', saveWeekManual);

load();
