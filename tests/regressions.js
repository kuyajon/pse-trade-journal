//NOFILEINIT
(async () => { try {
const sleep = ms => new Promise(r => setTimeout(r, ms));
// F1 dates
reset(); db = mk({ cash: [dep('c1', '2026-01-01', 50000)] }); rev++;
let msg = saveTrade({ date: '0026-03-05', side: 'buy', ticker: 'BDO', shares: 10, price: 100, net: 1003, horizon: 'long', buy_reason: 'dividend' });
ok('F1 trade 0026 rejected', db.trades.length === 0 && /valid date/.test(msg), msg);
let f = openLog('dividend'); setv(f, 'date', '0026-05-01'); f.elements.ticker.value = 'BDO'; setv(f, 'net', '5'); submit(f); ok('F1 dividend rejected', db.dividends.length === 0);
f = openLog('cash'); setv(f, 'date', '0099-01-01'); setv(f, 'amount', '5'); submit(f); ok('F1 cash rejected', db.cash.length === 1);
ok('F1 isRealDate table', isRealDate('2026-02-28') && !isRealDate('2026-02-30') && !isRealDate('0999-01-01') && isRealDate('1000-01-01') && !isRealDate('2026-13-01'));
// F6
const rows = parsePricesReply('BEGIN_PSE_PRICES\nBDO,1,2026-02-30,1,2\nALI,1,0026-09-29,1,2\nEND_PSE_PRICES', '2026-10-01', new Set(['BDO', 'ALI']));
ok('F6 bad AI dates blocked', rows.every(r => r.block.includes('No valid date')), JSON.stringify(rows.map(r => r.block)));
// md table header
const mt = parsePricesReply('| TICKER | price | as_of | low52 | high52 |\n|---|---|---|---|---|\n| BDO | 152.5 | 2026-09-29 | 128 | 165 |', '2026-10-01', new Set(['BDO']));
ok('md header skipped', mt.length === 1 && mt[0].t === 'BDO' && !mt[0].block.length, JSON.stringify(mt.map(r => r.t)));
// F2 export blocked
reset(); localStorage.setItem(STORE_KEY, '{bad'); loadAll(); const dl = []; const oc = URL.createObjectURL; URL.createObjectURL = b => { dl.push(b); return 'blob:x'; };
exportJSON(); exportCSV(); await shareJSON(); ok('F2 no export while load failed', dl.length === 0 && db.last_backup_at === null, $('.toast').textContent);
saveTrade({ date: '2026-01-02', side: 'buy', ticker: 'BDO', shares: 1, price: 1, net: 1, horizon: 'long', buy_reason: 'tip' }); ok('F2 toast says not saved', /not saved/.test($('.toast').textContent), $('.toast').textContent);
view = 'summary'; render(); ok('banner has download button', !!$('[data-act=dl-unreadable]')); ACTS['dl-unreadable'](); ok('damaged copy downloadable', dl.length === 1 && (await dl[0].text()) === '{bad'); URL.createObjectURL = oc;
// F5
reset(); localStorage.setItem(STORE_KEY, JSON.stringify(validateDoc(sampleData()).doc)); const proto = Object.getPrototypeOf(localStorage), go_ = proto.getItem;
proto.getItem = function () { const e = new Error('d'); e.name = 'SecurityError'; throw e; }; loadAll(); proto.getItem = go_;
db.cash.push(dep('x', '2026-01-02', 5)); persist(); ok('F5 stored log survives read error', JSON.parse(localStorage.getItem(STORE_KEY)).trades.length === 96);
// F4
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-02', 'buy', 'BDO', 10, 100, 1003)], plans: [plan('p1', 'b1', 'long')] }); rev++;
ACTS.edit({ dataset: { k: 'trade', id: 'b1' } }); location.hash = '#log'; await sleep(30); location.hash = '#history'; await sleep(30); ok('F4 leaving Log clears edit', logState.editId === null, JSON.stringify(logState));
logState.editId = 'gone'; msg = saveTrade({ date: '2026-02-02', side: 'buy', ticker: 'ALI', shares: 5, price: 10, net: 51 }, 'gone'); ok('F4 stale edit refused, not silent', /no longer exists/.test(msg), msg);
// F7 CSV
reset(); db = mk({ cash: [{ id: 'c1', date: '2026-01-01', type: 'deposit', amount: 5, note: '=1+1' }, { id: 'c2', date: '2026-01-01', type: 'deposit', amount: 5, note: '@SUM(1)' }, { id: 'c3', date: '2026-01-01', type: 'deposit', amount: 5, note: '-2+3' }, { id: 'c4', date: '2026-01-01', type: 'deposit', amount: 5, note: 'fine, ok' }] }); rev++;
const b = []; URL.createObjectURL = x => { b.push(x); return 'blob:x'; }; exportCSV(); URL.createObjectURL = oc; const csv = await b[0].text();
ok('F7 csv neutralised', /,'=1\+1\r/.test(csv) && /,'@SUM/.test(csv) && /,'-2\+3/.test(csv) && /,"fine, ok"/.test(csv), csv.split('\r\n').slice(1, 5).join(' | '));
// F8
let r = validateDoc({ app: APP, version: 1, plans: [{ id: 'p', date: '2026-01-01', horizon: 'long', target: 0, stop: 0 }], exported_at: 'garbage', universe: ['x'], prices: [{ price: 1, as_of: '2026-01-01' }], cash: [{ id: 'c', date: '2026-01-01', type: 'deposit', amount: 1e30 }] });
ok('F8f huge amount rejected', !r.ok, r.error);
r = validateDoc({ app: APP, version: 1, plans: [{ id: 'p', date: '2026-01-01', horizon: 'long', target: 0, stop: 0 }], exported_at: 'garbage', universe: ['x'], prices: [{ price: 1, as_of: '2026-01-01' }] });
ok('F8 repairs', r.ok && r.doc.plans[0].target === null && r.doc.plans[0].stop === null && r.doc.exported_at === null && !Object.keys(r.doc.universe).length && !Object.keys(r.doc.prices).length, JSON.stringify(r.doc));
ok('F8 ticker msg not pre-escaped', /"<img/.test(validateDoc({ app: APP, version: 1, trades: [Object.assign(T1(), { ticker: '<img src=x>' })] }).error));
location.hash = '#__proto__'; await sleep(30); ok('F8 #__proto__ falls back to summary', view === 'summary');
const list = [{ id: 'a', closeDate: '2026-01-01', totalC: 5 }, { id: 'b', closeDate: '2026-01-02', totalC: -5 }, { id: 'c', closeDate: '2026-01-02', totalC: 5 }, { id: 'd', closeDate: '2026-01-02', totalC: 5 }];
const desc = list.slice().sort((a, b) => a.closeDate < b.closeDate ? 1 : a.closeDate > b.closeDate ? -1 : 0); eq('F8d streak same either way', streaks(desc), streaks(list));
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-02', 'buy', 'BDO', 1, 1, 1), tr('b2', '2026-01-02', 'buy', 'ALI', 1, 1, 1)] }); rev++; histTicker = 'BDO'; db.trades = db.trades.filter(t => t.ticker !== 'BDO'); rev++; view = 'history'; render(); ok('F8e history filter resets', !/No entries/.test(main.textContent));
view = 'data'; render(); { const s = $('#f-settings'); s.elements.a_long.value = '0x32'; s.elements.a_mid.value = '0'; s.elements.a_trading.value = '0'; s.elements.a_cash.value = '50'; s.dispatchEvent(new Event('submit', { cancelable: true })); ok('F8 hex allocation rejected', /whole percentages/.test($('#set-msg').textContent)); }
// F3 dialogs + F9 serialisation
reset(); db = validateDoc(sampleData()).doc; rev++; meta.sample = false;
let texts = [], order = [], delay = 0; fileHandle = { name: 'Backup.json', queryPermission: async () => 'granted', createWritable: async () => { const my = delay; let t = ''; return { write: async x => { t = x; }, close: async () => { await sleep(my); order.push(JSON.parse(t).cash.length); } }; } }; filePerm = 'granted';
ACTS.erase(); ok('F3 erase dialog warns about file', /Backup\.json.*overwritten/.test(modalEl.textContent)); closeModal();
ACTS.sample(); ok('F3 sample dialog warns about file', /Backup\.json.*overwritten/.test(modalEl.textContent)); closeModal();
db.cash.push(dep('y1', '2026-09-02', 1)); delay = 700; persist(); await sleep(450); delay = 0; db.cash.push(dep('y2', '2026-09-02', 2)); persist(); await sleep(2500);
ok('F9 last write is newest', order[order.length - 1] === db.cash.length, JSON.stringify(order) + ' want last ' + db.cash.length);
db = emptyDb(); rev++; persist(); await sleep(700); ok('F3 empty write does not count as a backup', meta.file_written_at === null, meta.file_written_at);
// ---- review 3 ----
// R3-01 half-typed date (Chrome reports '' mid-typing) must not tear down the plan / sell-reason fields
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-02', 'buy', 'BDO', 100, 1, 100), tr('s1', '2026-01-03', 'sell', 'BDO', 10, 1, 10, { sell_reason: 'take_profit' })], plans: [plan('p1', 'b1', 'long')] }); rev++;
f = openLog('trade', 's1', 'sell'); setv(f, 'sell_reason', 'cut_loss'); setv(f, 'date', ''); fire(f, 'input'); setv(f, 'date', '2026-01-05'); fire(f, 'input');
ok('R3-01 edited sell reason survives retyping the date', $('#f-trade').elements.sell_reason.value === 'cut_loss', $('#f-trade').elements.sell_reason.value);
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)] }); rev++; f = openLog('trade'); f.elements.ticker.value = 'BDO'; $('.pk-in', f).value = 'BDO'; setv(f, 'shares', '1'); setv(f, 'price', '1'); fire(f, 'input');
setv($('#f-trade'), 'horizon', 'long'); fire($('#f-trade').elements.horizon, 'change'); setv($('#f-trade'), 'date', ''); fire($('#f-trade'), 'input'); setv($('#f-trade'), 'date', '2026-03-05'); fire($('#f-trade'), 'input');
ok('R3-01 plan horizon survives retyping the date', $('#f-trade').elements.horizon.value === 'long');
// R3-02 back-filling an earlier buy keeps the position's plan
reset(); db = mk({ cash: [dep('c', '2026-01-01', 999999)] }); rev++;
saveTrade({ side: 'buy', date: '2026-03-01', ticker: 'BDO', shares: 100, price: 100, net: 10030, horizon: 'long', buy_reason: 'dividend', thesis: 'ORIG' });
f = openLog('trade'); setv(f, 'date', '2026-02-01'); f.elements.ticker.value = 'BDO'; $('.pk-in', f).value = 'BDO'; setv(f, 'shares', '20'); setv(f, 'price', '95'); fire(f, 'input');
ok('R3-02 earlier buy asks for no new plan', !$('#f-trade fieldset') && /earlier than your existing/.test($('#trade-ctx').textContent), $('#trade-ctx').textContent);
saveTrade({ side: 'buy', date: '2026-02-01', ticker: 'BDO', shares: 20, price: 95, net: 1910 });
{ const P = getD().positions[0]; ok('R3-02 position keeps its original plan and horizon', db.trades.length === 2 && P.horizon === 'long' && P.plans.length === 1 && P.origPlan.thesis === 'ORIG', JSON.stringify(P.plans.map(x => x.thesis))); }
// R3-03 delete uses the log as it is after the confirm box
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-02', 'buy', 'BDO', 10, 100, 1003), tr('b2', '2026-01-03', 'buy', 'ALI', 10, 100, 1003)], plans: [plan('p1', 'b1', 'long'), plan('p2', 'b2', 'long')] }); rev++; persist(); view = 'history'; render();
{ const pr = ACTS.del({ dataset: { k: 'trade', id: 'b1' } }); await Promise.resolve(); const o = JSON.parse(localStorage.getItem(STORE_KEY)); o.trades.push(tr('b3', '2026-01-04', 'buy', 'SM', 5, 10, 51)); localStorage.setItem(STORE_KEY, JSON.stringify(o)); window.dispatchEvent(new StorageEvent('storage', { key: STORE_KEY }));
  modalEl.querySelector('[data-r="1"]').click(); await pr; ok('R3-03 other tab\'s trade survives a delete', db.trades.some(t => t.id === 'b3') && !db.trades.some(t => t.id === 'b1'), JSON.stringify(db.trades.map(t => t.id))); }
// R3-04 amounts that round to zero are refused
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)] }); rev++;
saveTrade({ side: 'buy', date: '2026-02-02', ticker: 'BDO', shares: 1, price: 0.001, net: '0.004', horizon: 'long', buy_reason: 'tip' });
f = openLog('dividend'); setv(f, 'date', '2026-02-03'); f.elements.ticker.value = 'BDO'; setv(f, 'net', '0.004'); submit(f);
f = openLog('cash'); setv(f, 'date', '2026-02-03'); setv(f, 'amount', '0.003'); submit(f);
persist(); loadAll(); ok('R3-04 sub-centavo entries refused, log stays readable', !loadFailed && !db.trades.length && !db.dividends.length && db.cash.length === 1, storageError);
// R3-05 prototype-like ids and sector names
for (const id of ['constructor', '__proto__', 'toString']) { reset(); const v = validateDoc({ app: APP, version: 1, cash: [dep('c', '2026-01-01', 9999)], trades: [tr(id, '2026-01-02', 'buy', 'BDO', 1, 1, 1)], plans: [plan('p1', id, 'long'), plan('p2', 'toString', 'mid')] }); db = v.doc; rev++; let err = ''; try { const D = derive(); prunePlans(); ok('R3-05 id ' + id + ' derives', D.positions[0].plan !== null && typeof db.plans[0].trade_id === 'string'); } catch (e) { ok('R3-05 id ' + id + ' derives', false, e.message); } }
{ reset(); const mkp = (i, tk) => [tr('b' + i, '2026-01-0' + i, 'buy', tk, 10, 100, 1003), tr('s' + i, '2026-02-0' + i, 'sell', tk, 10, 110, 1090)];
  db = validateDoc({ app: APP, version: 1, cash: [dep('c', '2026-01-01', 99999)], custom_symbols: [{ ticker: 'ZZZ', name: 'Z', sector: '__proto__' }], trades: [...mkp(1, 'ZZZ'), ...mkp(2, 'BDO'), ...mkp(3, 'ALI')], plans: [plan('p1', 'b1', 'long'), plan('p2', 'b2', 'long'), plan('p3', 'b3', 'long')] }).doc; rev++;
  for (const vn of ['closed', 'ai']) { let okv = true; try { view = vn; render(); } catch (e) { okv = false; } ok('R3-05 sector "__proto__" renders ' + vn, okv); } }
// R3-06 a later damaged log is not lost behind the first one
reset(); localStorage.setItem(STORE_KEY, '{"n":1'); loadAll(); db = mk({}); loadFailed = false; persist(); localStorage.setItem(STORE_KEY, '{"n":2'); loadAll();
{ const dls = []; const oc2 = URL.createObjectURL; URL.createObjectURL = b => { dls.push(b); return 'blob:x'; }; ACTS['dl-unreadable'](); URL.createObjectURL = oc2; ok('R3-06 download gives the latest damaged copy', (await dls[0].text()) === '{"n":2'); }
// R3-07 a second submit of an already-saved edit does nothing
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-02', 'buy', 'BDO', 10, 100, 1003), tr('s1', '2026-01-03', 'sell', 'BDO', 5, 100, 495)], plans: [plan('p1', 'b1', 'long')], dividends: [{ id: 'd1', date: '2026-02-01', ticker: 'BDO', net_amount: 9, note: '' }] }); rev++;
f = openLog('trade', 's1', 'sell'); setv(f, 'shares', '4'); setv(f, 'net', '396'); submit(f); submit(f); ok('R3-07 trade edit submitted twice stays one entry', db.trades.length === 2, db.trades.length);
f = openLog('dividend', 'd1'); setv(f, 'net', '10'); submit(f); submit(f); ok('R3-07 dividend edit submitted twice stays one entry', db.dividends.length === 1);
f = openLog('cash', 'c'); setv(f, 'amount', '5000'); submit(f); submit(f); ok('R3-07 cash edit submitted twice stays one entry', db.cash.length === 1);
// R3-08 / R3-09 validation
r = validateDoc(JSON.parse('{"app":"pinoy-trade-journal","version":1,"settings":{"min_commission":1e999},"reviews":[{"id":"r","date":"2026-01-01","text":"x","snap":{"n":1,"winRate":1e999}}]}'));
ok('R3-08 non-finite numbers dropped', r.ok && r.doc.settings.min_commission === 0 && r.doc.reviews[0].snap.winRate === null, JSON.stringify(r.doc && r.doc.settings));
ok('R3-09 loose / future timestamps dropped', ['1', '2026', '12/31/2099', '2099-01-01T00:00:00Z', 'Sep'].every(x => validateDoc({ app: APP, version: 1, last_backup_at: x, exported_at: x }).doc.last_backup_at === null) && validateDoc({ app: APP, version: 1, exported_at: '2026-09-21T09:02:00+08:00' }).doc.exported_at === '2026-09-21T09:02:00+08:00');
// R3-10 long whitespace in a pasted price reply
{ const t0 = performance.now(); parsePricesReply('BEGIN_PSE_PRICES\nBDO' + ' '.repeat(60000) + 'x,1,2026-09-29,1,2', '2026-10-01', new Set(['BDO'])); ok('R3-10 60k spaces parse quickly', performance.now() - t0 < 300, Math.round(performance.now() - t0) + ' ms'); }
// R3-11 focus stays in a modal and returns afterwards
view = 'summary'; render(); { const btn = $('[data-act=log-trade]'); btn.focus(); openModal('<input id="a"><button id="b">x</button>'); $('#b').focus(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })); ok('R3-11 Tab wraps inside the modal', document.activeElement.id === 'a', document.activeElement.tagName); closeModal(); ok('R3-11 focus returns after closing', document.activeElement === btn); }
// R4-01 an earlier buy joining a position keeps the plan the form promised (not whichever plan group is first in the list)
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-28', 'buy', 'BDO', 300, 10, 3000), tr('b2', '2026-03-03', 'buy', 'BDO', 400, 10, 4000)], plans: [plan('x2', 'b2', 'trading'), plan('x1', 'b1', 'mid')] }); rev++;
saveTrade({ date: '2026-01-15', side: 'buy', ticker: 'BDO', shares: 100, price: 10, net: 1000 });
ok('R4-01 absorbing buy keeps the old opener\'s plan', db.trades.length === 3 && getD().positions.length === 1 && getD().positions[0].horizon === 'mid', JSON.stringify(getD().positions.map(p => p.plans.map(x => x.horizon))));
// R4-02 browser storage unavailable: typed entries can still be exported, and the damaged-copy button is not offered
reset(); { const g = Storage.prototype.getItem; Storage.prototype.getItem = () => { throw new DOMException('x', 'SecurityError'); }; loadAll(); Storage.prototype.getItem = g; }
{ const dl2 = []; const oc3 = URL.createObjectURL; URL.createObjectURL = b => { dl2.push(b); return 'blob:x'; };
  ok('R4-02 blocked storage is not a load failure', storageBlocked && !loadFailed);
  f = openLog('cash'); setv(f, 'amount', '50'); submit(f); exportJSON(); ok('R4-02 export works with blocked storage', dl2.length === 1 && db.cash.length === 1, $('.toast').textContent);
  view = 'summary'; render(); ok('R4-02 no damaged-copy button, banner stays', !$('[data-act=dl-unreadable]') && /not available/.test($('.banner.bad').textContent));
  ok('R4-02 nothing was written', localStorage.getItem(STORE_KEY) === null); URL.createObjectURL = oc3; storageBlocked = false; }
// R4-03 deleting the sell between two positions warns about the merge
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-05', 'buy', 'BDO', 10, 100, 1000), tr('s1', '2026-02-05', 'sell', 'BDO', 10, 120, 1200), tr('b2', '2026-03-05', 'buy', 'BDO', 10, 110, 1100)], plans: [plan('p1', 'b1', 'long'), plan('p2', 'b2', 'trading')] }); rev++;
deleteEntry('trade', 's1'); ok('R4-03 merge warning shown, with the hidden plan', /separates two BDO positions/.test($('.modal').textContent) && /hidden/.test($('.modal').textContent)); $('.modal [data-r="0"]').click();
deleteEntry('trade', 'b2'); ok('R4-03 no merge warning for an ordinary delete', !/separates/.test($('.modal').textContent)); $('.modal [data-r="0"]').click();
// R4-04 plan target / stop capped like other prices
r = validateDoc({ app: APP, version: 1, trades: [tr('a', '2026-01-01', 'buy', 'BDO', 1, 1, 1)], plans: [plan('p', 'a', 'mid', { target: 1e15 })] }); ok('R4-04 plan target above 1e12 refused', !r.ok, r.error);
// R4-05 a price dated in the future is refused (it would never go stale)
reset(); db = mk({ trades: [tr('a', '2026-01-01', 'buy', 'BDO', 1, 1, 1)] }); rev++; priceModal('BDO'); { const pf = $('#f-price'); setv(pf, 'price', '5'); setv(pf, 'as_of', '2099-01-01'); submit(pf); }
ok('R4-05 future price date refused (modal)', !db.prices.BDO && /future/.test($('.toast').textContent)); closeModal();
reset(); db = mk({ universe: { BDO: ['long'] } }); rev++; view = 'prices'; render(); { const pf = $('#f-prices'); setv(pf, 'as_of', '2099-01-01'); $('input[data-t=BDO]', pf).value = '5'; submit(pf); }
ok('R4-05 future price date refused (bulk form)', !db.prices.BDO && /future/.test($('.toast').textContent));
// R4-06 plans never move on their own: deleting the opening buy removes its plan, the position then has none
reset(); db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-05', 'buy', 'BDO', 10, 100, 1000), tr('b2', '2026-02-05', 'buy', 'BDO', 10, 100, 1000)], plans: [plan('p1', 'b1', 'long')] }); rev++;
deleteEntry('trade', 'b1'); ok('R4-06 delete warns the position will have no plan', /No plan/.test($('.modal').textContent)); $('.modal [data-r="1"]').click(); await sleep(20);
ok('R4-06 plan deleted with its trade, position shows no plan', db.plans.length === 0 && getD().positions.length === 1 && getD().positions[0].plan === null);
} catch (e) { out('EXC ' + e.stack); }
out('DONE ' + T.n + ' checks, ' + T.fail + ' failed');
})();
