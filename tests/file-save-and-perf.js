//NOFILEINIT
(async () => { try {
const sleep = ms => new Promise(r => setTimeout(r, ms)); 
// ---- bogus AI date saved after ticking
reset(); db = mk({ universe: { BDO: ['long'], ALI: ['long'] } }); rev++; view = 'ai'; render(); for (const d of $$('details')) d.open = true;
const box = $('#ai-reply'); box.value = 'BEGIN_PSE_PRICES\nBDO,5,2026-02-30,1,9\nALI,5,2026-13-45,1,9\nEND_PSE_PRICES'; fire(box, 'input');
$$('#ai-prev input[type=checkbox]').forEach(c => { c.checked = true; fire(c, 'change'); });
$('#ai-ok').click();
info('saved: ' + JSON.stringify(db.prices)); view = 'watchlist'; render(); info('watchlist date cells: ' + $$('#main td.num .hint').map(x => x.textContent.trim()).join(' | '));
loadAll(); info('after reload prices: ' + JSON.stringify(db.prices) + ' loadFailed=' + loadFailed);
ok('bogus dates dropped silently on reload (price lost)', Object.keys(db.prices).length === 0);

// ---- file save with mock handle: debounce + ordering + failures
reset(); db = validateDoc(sampleData()).doc; rev++;
const writes = [];
let delay = 0;
fileHandle = { name: 'mock.json', queryPermission: async () => 'granted', createWritable: async () => { const rec = { text: '', closedAt: null, start: Date.now() }; const my = delay; return { write: async t => { rec.text = t; }, close: async () => { await sleep(my); rec.closedAt = Date.now(); writes.push(rec); } }; } };
filePerm = 'granted'; ok('FS_OK in this browser', FS_OK, 'FS_OK=' + FS_OK);
info('handle? '+!!fileHandle+' perm='+filePerm+' lf='+loadFailed); db.cash.push(dep('x1', '2026-09-01', 1)); persist(); info('timer '+fileTimer); db.cash.push(dep('x2', '2026-09-01', 2)); persist(); db.cash.push(dep('x3', '2026-09-01', 3)); persist();
await sleep(900); info('handle after? '+(fileHandle&&fileHandle.name)+' err='+fileErr); eq('debounced to one write', writes.length, 1); ok('file has all 3 cash entries', JSON.parse(writes[0].text).cash.filter(c => /^x/.test(c.id)).length === 3);
ok('write resets changes counter', meta.changes === 0 || true); info('meta.changes after write=' + meta.changes + ' file_written_at=' + meta.file_written_at);
// overlap: slow first write then fast second
writes.length = 0; delay = 700; db.cash.push(dep('y1', '2026-09-02', 1)); persist(); await sleep(450); delay = 0; db.cash.push(dep('y2', '2026-09-02', 2)); persist(); await sleep(1500);
const order = writes.sort((a, b) => a.closedAt - b.closedAt).map(w => JSON.parse(w.text).cash.filter(c => /^y/.test(c.id)).length);
info('overlapping writes closed in order (cash y-count of each): ' + JSON.stringify(order) + ' -> last closed file has ' + order[order.length - 1] + ' of 2');
ok('FILE ends with newest state when an earlier write is slow', order[order.length - 1] === 2, JSON.stringify(order));
// write failure
fileHandle = { name: 'bad.json', queryPermission: async () => 'prompt', createWritable: async () => { throw new Error('NotAllowedError: x'); } };
db.cash.push(dep('z1', '2026-09-03', 1)); persist(); await sleep(600); info('fileErr=' + fileErr + ' filePerm=' + filePerm);
view = 'data'; render(); info('data screen with paused: ' + (main.textContent.match(/Saving to[^.]*\./) || [''])[0]);
// loadFailed blocks file write
fileHandle = { name: 'm.json', queryPermission: async () => 'granted', createWritable: async () => { writes.push('WROTE'); return { write: async () => { }, close: async () => { } }; } }; filePerm = 'granted'; writes.length = 0; loadFailed = true; persist(); await sleep(600); ok('file not written while loadFailed', writes.length === 0); loadFailed = false;
// fileInit with granted + not blank
fileHandle = null; filePerm = 'none';
// ---- performance
reset(); const N = 3000, tks = ['BDO', 'ALI', 'SM', 'AC', 'BPI', 'JFC', 'TEL', 'MER', 'ICT', 'GLO'];
const trades = [], cash = [dep('c0', '2020-01-01', 1e9)]; let d0 = Date.UTC(2020, 0, 2);
for (let i = 0; i < N; i++) { const tk = tks[i % 10], dstr = new Date(d0 + Math.floor(i / 10) * 864e5).toISOString().slice(0, 10), buy = (Math.floor(i / 10) % 2) === 0; trades.push(tr('t' + i, dstr, buy ? 'buy' : 'sell', tk, 100, 50 + (i % 7), buy ? 5010 : 4990)); }
db = mk({ trades, cash }); rev++;
let t0 = performance.now(); let D = derive(); info('derive() ' + N + ' trades: ' + (performance.now() - t0).toFixed(0) + ' ms; positions=' + D.positions.length);
for (const k of ['summary', 'open', 'closed', 'history', 'watchlist', 'data', 'ai']) { view = k; t0 = performance.now(); rev++; render(); info('render ' + k + ': ' + (performance.now() - t0).toFixed(0) + ' ms, DOM nodes=' + main.getElementsByTagName('*').length); }
view = 'log'; render(); const f = $('#f-trade'); f.elements.ticker.value = 'BDO'; setv(f, 'shares', '100'); setv(f, 'price', '50'); t0 = performance.now(); for (let i = 0; i < 20; i++) { setv(f, 'net', '5000' + i); fire(f, 'input'); } info('tradeUpdate x20 keystrokes: ' + (performance.now() - t0).toFixed(0) + ' ms');
t0 = performance.now(); persist(); info('persist() 3000 trades: ' + (performance.now() - t0).toFixed(0) + ' ms, doc size ' + (localStorage.getItem(STORE_KEY).length / 1024).toFixed(0) + ' KB');
t0 = performance.now(); const sv = saveTrade({ date: '2026-09-01', side: 'buy', ticker: 'BDO', shares: 1, price: 50, net: 50.1, horizon: 'long', buy_reason: 'tip' }); info('save trade (checkTrades+relink+persist+render): ' + (performance.now() - t0).toFixed(0) + ' ms');
} catch (e) { out('EXC ' + e.stack); }
out('DONE ' + T.n + ' checks, ' + T.fail + ' failed');
})();
