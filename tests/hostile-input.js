window.__xss = 0;
const PAY = ['<img src=x onerror="window.__xss++">', '"><img src=x onerror="window.__xss++">', "'><svg onload=\"window.__xss++\">", '</textarea><img src=x onerror="window.__xss++">', '&lt;b&gt;&amp;'];
(async () => { try {
reset();
const H = PAY[0], Q = PAY[1];
const raw = { app: APP, version: 1, exported_at: H, last_backup_at: Q,
  trades: [tr('t1', '2026-01-02', 'buy', 'BDO', 10, 100, 1003, { note: H }), tr('t2', '2026-02-02', 'sell', 'BDO', 10, 110, 1090, { note: Q, sell_reason: H }), tr('t3', '2026-01-03', 'buy', 'ALI', 10, 10, 101, { note: Q })],
  plans: [plan('p1', 't1', 'long', { thesis: H, buy_reason: H, target: 150, stop: 90 }), plan('p3', 't3', 'mid', { thesis: Q, review_by: H })],
  universe: { BDO: ['long'], NEWCO: ['mid'] },
  custom_symbols: [{ ticker: 'NEWCO', name: H, sector: Q, withholding: 15 }, { ticker: 'XCUST', name: Q, sector: H }],
  dividends: [{ id: 'd1', date: '2026-01-20', ticker: 'NEWCO', net_amount: 5, note: H }, { id: 'd2', date: '2026-01-20', ticker: 'ALI', net_amount: 5, note: Q }],
  cash: [dep('c1', '2026-01-01', 99999), { id: 'c2', date: '2026-01-02', type: 'withdrawal', amount: 1, note: H }],
  prices: { ALI: { price: 11, as_of: '2026-09-29', low52: 9, high52: 12 }, NEWCO: { price: 3, as_of: '2026-09-29' } },
  research: { BDO: { buy_below: 90, reasons: ['dividend', H], notes: H + Q } },
  reviews: [{ id: 'r1', kind: 'closed', date: '2026-03-01', text: '## ' + H + '\n- **' + Q + '**\n*' + H + '*\n<script>window.__xss++<\/script>\n[x](javascript:window.__xss++)\n1. ' + PAY[2], snap: { n: 1, winRate: 1, retPct: 0.1 } }, { id: 'r2', kind: 'open', date: '2026-03-02', text: H }] };
const v = validateDoc(raw); ok('hostile doc validates (strings are data)', v.ok, v.error);
// real import path
const file = new File([JSON.stringify(raw)], 'x.json', { type: 'application/json' });
importFile(file); await new Promise(r => setTimeout(r, 100));
info('import dialog text: ' + (modalEl && modalEl.textContent));
ok('import dialog has no injected img', !(modalEl && modalEl.querySelector('img')));
modalEl.querySelector('[data-r="1"]').click(); await new Promise(r => setTimeout(r, 50));
// render every view, expanded
function sweep(label) {
  for (const k of Object.keys(VIEWS)) { view = k; render(); for (const d of $$('tr.detail')) d.hidden = false; for (const dt of $$('details')) dt.open = true; }
  view = 'summary'; render();
}
closedPeriod = 'all'; sweep('hostile');
await new Promise(r => setTimeout(r, 100));
ok('no injected elements after rendering all views', $$('img,svg,script', main).length === 0 && window.__xss === 0, 'xss=' + window.__xss + ' imgs=' + document.querySelectorAll('img').length);
// modals
const openers = [() => priceModal('ALI'), () => planModal('t3', 'edit'), () => planModal('t3', 'horizon'), () => researchModal('BDO'), () => symbolModal('NEWCO'), () => symbolModal('XCUST'), () => importListModal()];
for (const o of openers) { o(); await new Promise(r => setTimeout(r, 20)); ok('modal clean', !modalEl.querySelector('img,svg,script') && window.__xss === 0); closeModal(); }
// log forms with hostile stored values (edit)
for (const [k, id] of [['trade', 't1'], ['trade', 't2'], ['dividend', 'd1'], ['cash', 'c2']]) { const f = openLog(k, id); await new Promise(r => setTimeout(r, 10)); ok('edit form ' + id + ' clean', !$$('img,svg', main).length && window.__xss === 0); }
// hostile typed text into forms  (note, thesis) then render history/open/closed
let msg = saveTrade({ date: '2026-03-01', side: 'buy', ticker: 'AC', shares: 1, price: 10, net: 10.1, horizon: 'long', buy_reason: 'tip', note: Q, thesis: H });
view = 'history'; render(); view = 'open'; render(); for (const d of $$('tr.detail')) d.hidden = false;
ok('typed hostile note/thesis rendered inert', !$$('img', main).length && window.__xss === 0);
// raw HTML check: element injected in innerHTML?
ok('main.innerHTML has no raw payload', !/<img src=x/.test(main.innerHTML));
// CSV
let blobs = []; const oc = URL.createObjectURL; URL.createObjectURL = b => { blobs.push(b); return 'blob:x'; };
db.trades.push(tr('tf', '2026-03-05', 'buy', 'SM', 1, 1, 1, { note: '=HYPERLINK("http://evil","click")' })); db.cash.push({ id: 'cf1', date: '2026-03-05', type: 'deposit', amount: 5, note: '@SUM(1+1)' }, { id: 'cf2', date: '2026-03-05', type: 'deposit', amount: 5, note: '+cmd|calc' }, { id: 'cf3', date: '2026-03-05', type: 'deposit', amount: 5, note: '-2+3' }, { id: 'cf4', date: '2026-03-05', type: 'deposit', amount: 5, note: '\t=1+1' }, { id: 'cf5', date: '2026-03-05', type: 'deposit', amount: 5, note: 'a,"b"\nc' }); rev++;
exportCSV(); URL.createObjectURL = oc; const csv = await blobs[0].text();
const lines = csv.split('\r\n');
info('CSV notes: ' + lines.filter(l => /HYPERLINK|SUM|cmd|-2\+3|=1\+1|"a,/.test(l)).map(l => l.split(',').slice(-1)[0]).join(' | '));
ok('CSV: cell starting with = is neutralised', !lines.some(l => /,=HYPERLINK/.test(l)));
ok('CSV: cell starting with @ is neutralised', !lines.some(l => /,@SUM/.test(l)));
// mdLite direct
const md = mdLite('**bold** and *it* <b>raw</b> `code` ```js\nx\n``` # not heading\n## Head\n- a\n* b\n• c\n1) one\n2. two\n\n* not italic* **a**b**');
info('mdLite: ' + md);
ok('mdLite escapes tags', !/<b>raw/.test(md));
// validateDoc error with hostile ticker
const bad = validateDoc({ app: APP, version: 1, trades: [Object.assign(T1(), { ticker: '<img src=x onerror="window.__xss++">' })] });
info('error text: ' + bad.error);
// AI price reply parser with hostile content
const reply = 'BEGIN_PSE_PRICES\nTICKER,price,as_of,low52,high52\n<img src=x onerror="window.__xss++">,1,2026-09-29,1,2\nBDO,<b>12</b>,"><img src=x onerror=window.__xss++>,1,2\nEND_PSE_PRICES';
view = 'ai'; render(); for (const d of $$('details')) d.open = true; const box = $('#ai-reply'); box.value = reply; fire(box, 'input');
ok('AI preview inert', !$$('#ai-prev img').length && window.__xss === 0, $('#ai-prev').innerHTML.slice(0, 300));
box.value = '```\n' + PAY.join('\n') + '\n```'; fire(box, 'input'); ok('AI preview inert 2', !$$('#ai-prev img').length && window.__xss === 0);
// import list preview
importListModal(); const ta = $('#f-imp textarea'); ta.value = PAY.join(' ,') + ', BDO, <img src=x onerror=window.__xss++>'; fire($('#f-imp'), 'input'); ok('import-list preview inert', !$$('#imp-prev img, #imp-prev svg').length && window.__xss === 0); closeModal();
// review save through UI
view = 'ai'; render(); for (const d of $$('details')) d.open = true; const rv = $('#rv-reply'); if (rv) { rv.value = PAY[0]; fire(rv, 'input'); ok('review preview inert', !$$('#rv-prev img').length && window.__xss === 0); }
await new Promise(r => setTimeout(r, 100));
ok('FINAL no script ran', window.__xss === 0, window.__xss);
// ===== storage banner with hostile error
storageError = 'x<img src=x onerror="window.__xss++">'; render(); ok('banner inert', !$$('.banner img').length);
// meta file_written_at (not validated; local storage only)
storageError = null; meta.file_written_at = H; fileHandle = { name: H, queryPermission: async () => 'granted' }; filePerm = 'granted'; view = 'data'; render(); info('meta.file_written_at raw html injected: ' + (!!$$('#main img').length) + ' (needs same-origin write access to localStorage; not reachable from an imported file)'); fileHandle = null; filePerm = 'none';
} catch (e) { out('EXC ' + e.stack); }
out('DONE ' + T.n + ' checks, ' + T.fail + ' failed');
})();
