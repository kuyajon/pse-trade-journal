//NOFILEINIT
(async () => { try {
const sleep = ms => new Promise(r => setTimeout(r, ms)); const waitModal = async () => { for (let i = 0; i < 300 && !modalEl; i++) await sleep(20); };
reset(); db = validateDoc(sampleData()).doc; rev++; meta.sample = false;
let fileText = null, writesN = 0;
fileHandle = { name: 'Backup.json', queryPermission: async () => 'granted', createWritable: async () => ({ write: async t => { fileText = t; }, close: async () => { writesN++; } }) }; filePerm = 'granted';
persist(); await sleep(600); ok('file initially has the real log (96 trades)', fileText && JSON.parse(fileText).trades.length === 96);
// Erase everything
ACTS.erase(); const m = modalEl; info('erase dialog text: ' + m.textContent.replace(/\s+/g, ' '));
$('#erase-in', m).value = 'ERASE'; fire($('#erase-in', m), 'input'); $('#erase-go', m).click(); await sleep(700);
info('after Erase: linked file now has trades=' + JSON.parse(fileText).trades.length + ', writes=' + writesN);
ok('Erase overwrote the linked backup file with an empty log', JSON.parse(fileText).trades.length === 0);
info('Summary backup line after erase: ' + backupLine().replace(/<[^>]+>/g, '') + '  | Data card: ' + (VIEWS.data(getD()).match(/Last backup[^<]*/) || [''])[0]);
// sample over a linked file
reset(); db = validateDoc(sampleData()).doc; rev++; meta.sample = false; fileText = null; persist(); await sleep(600); const before = JSON.parse(fileText).trades.length;
db = mk({ cash: [dep('c', '2026-01-01', 5)] }); rev++; // user's "real" small log
fileText = null; ACTS.sample(); const m2 = modalEl; info('sample dialog: ' + m2.textContent.replace(/\s+/g, ' ')); $('#sample-in', m2).value = 'replace'; fire($('#sample-in', m2), 'input'); $('#sample-go', m2).click(); await sleep(700);
info('after sample: linked file has trades=' + (fileText && JSON.parse(fileText).trades.length)); await sleep(100);
// import preview text + counts
reset(); db = validateDoc(sampleData()).doc; rev++; fileHandle = null; filePerm = 'none';
const doc = JSON.parse(JSON.stringify(exportDoc())); importFile(new File([JSON.stringify(doc)], 'b.json')); await waitModal(); info('import dialog: ' + modalEl.textContent.replace(/\s+/g, ' ')); modalEl.querySelector('[data-r="0"]').click(); await sleep(20); closeModal();
importFile(new File(['not json'], 'b.json')); await waitModal(); info('import junk dialog: ' + modalEl.textContent.replace(/\s+/g, ' ')); closeModal();
importFile(new File([JSON.stringify({ app: APP, version: 1, trades: [{ id: 'a', date: '2026-01-01', side: 'sell', ticker: 'BDO', shares: 1, price: 1, net_amount: 1 }] })], 'b.json')); await waitModal(); info('import invalid dialog: ' + modalEl.textContent.replace(/\s+/g, ' ')); closeModal();
// import with garbage exported_at -> backup line
reset(); importFile(new File([JSON.stringify({ app: APP, version: 1, exported_at: 'yesterday-ish', cash: [dep('c', '2026-01-01', 5)] })], 'b.json')); await waitModal(); modalEl.querySelector('[data-r="1"]').click(); await sleep(100);
info('after import of file with exported_at="yesterday-ish": backup line: ' + backupLine().replace(/<[^>]+>/g, ''));
// storage event
reset(); db = mk({ cash: [dep('c', '2026-01-01', 5)] }); rev++; persist();
const other = JSON.parse(localStorage.getItem(STORE_KEY)); other.cash.push(dep('c2', '2026-01-02', 7)); localStorage.setItem(STORE_KEY, JSON.stringify(other));
view = 'summary'; window.dispatchEvent(new StorageEvent('storage', { key: STORE_KEY })); ok('storage event reloads db', db.cash.length === 2);
view = 'log'; render(); const tb = $('#f-trade'); setv(tb, 'shares', '12'); localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(other, { cash: [] }))); window.dispatchEvent(new StorageEvent('storage', { key: STORE_KEY })); ok('log view: half-typed form kept', $('#f-trade').elements.shares.value === '12' && db.cash.length === 0);
// storage event with a modal open
view = 'open'; db = mk({ cash: [dep('c', '2026-01-01', 99999)], trades: [tr('b1', '2026-01-02', 'buy', 'BDO', 10, 100, 1003)], plans: [plan('p1', 'b1', 'long')] }); rev++; persist(); render(); planModal('b1', 'edit');
localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign(JSON.parse(localStorage.getItem(STORE_KEY)), { trades: [], plans: [] }))); window.dispatchEvent(new StorageEvent('storage', { key: STORE_KEY }));
info('modal still open after other tab deleted the position: ' + !!modalEl); if (modalEl) { $('#f-plan').dispatchEvent(new Event('submit', { cancelable: true })); info('stale plan modal save created orphan plan: plans=' + JSON.stringify(db.plans.map(p => p.trade_id)) + ' trades=' + db.trades.length); }
} catch (e) { out('EXC ' + e.stack); }
out('DONE ' + T.n + ' checks, ' + T.fail + ' failed');
})();
