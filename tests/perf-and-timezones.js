try {
const N = 3000, tks = ['BDO', 'ALI', 'SM', 'AC', 'BPI', 'JFC', 'TEL', 'MER', 'ICT', 'GLO'];
const trades = [], cash = [dep('c0', '2020-01-01', 1e9)]; const d0 = Date.UTC(2020, 0, 2);
for (let i = 0; i < N; i++) { const tk = tks[i % 10], dstr = new Date(d0 + Math.floor(i / 10) * 864e5).toISOString().slice(0, 10), buy = (Math.floor(i / 10) % 2) === 0; trades.push(tr('t' + i, dstr, buy ? 'buy' : 'sell', tk, 100, 50 + (i % 7), buy ? 5010 : 4990)); }
reset(); db = mk({ trades, cash, dividends: Array.from({ length: 500 }, (_, i) => ({ id: 'dv' + i, date: '2021-01-0' + (1 + i % 9), ticker: tks[i % 10], net_amount: 5, note: '' })) }); rev++;
let t0 = performance.now(); let D = derive(); info('derive() ' + N + ' trades: ' + (performance.now() - t0).toFixed(1) + ' ms; positions=' + D.positions.length);
for (const k of ['summary', 'open', 'closed', 'history', 'watchlist', 'data', 'ai']) { view = k; t0 = performance.now(); rev++; render(); info('render ' + k + ': ' + (performance.now() - t0).toFixed(0) + ' ms, DOM nodes=' + main.getElementsByTagName('*').length); }
view = 'log'; render(); const f = $('#f-trade'); f.elements.ticker.value = 'BDO'; setv(f, 'shares', '100'); setv(f, 'price', '50'); t0 = performance.now(); for (let i = 0; i < 20; i++) { setv(f, 'net', '5000' + i); fire(f, 'input'); } info('tradeUpdate x20 keystrokes: ' + (performance.now() - t0).toFixed(0) + ' ms');
t0 = performance.now(); persist(); info('persist(): ' + (performance.now() - t0).toFixed(0) + ' ms, stored ' + (localStorage.getItem(STORE_KEY).length / 1024).toFixed(0) + ' KB');
t0 = performance.now(); saveTrade({ date: '2026-09-01', side: 'buy', ticker: 'BDO', shares: 1, price: 50, net: 50.1, horizon: 'long', buy_reason: 'tip' }); info('save trade (check+relink+persist+render): ' + (performance.now() - t0).toFixed(0) + ' ms');
t0 = performance.now(); loadAll(); info('loadAll/validate 3000: ' + (performance.now() - t0).toFixed(0) + ' ms');
// month-end/DST/timezone
info('TZ=' + Intl.DateTimeFormat().resolvedOptions().timeZone + ' offset=' + new Date().getTimezoneOffset() + ' todayStr=' + todayStr() + ' isoLocal=' + isoLocal());
eq('daysBetween spring-forward week', daysBetween('2026-03-06', '2026-03-13'), 7); eq('daysBetween fall-back week', daysBetween('2026-10-30', '2026-11-06'), 7); eq('daysBetween across year', daysBetween('2025-12-31', '2026-01-01'), 1);
// daysAgo around midnight / DST: 23-hour day
const fake = ms => { const iso = new Date(Date.now() - ms).toISOString(); return daysAgo(iso); };
eq('daysAgo 23h => 0 (today)', fake(23 * 3600e3), 0); eq('daysAgo 24h => 1', fake(24 * 3600e3 + 1000), 1);
// "today" derived value vs a trade logged late in day: local date
const d = new Date(); ok('todayStr equals local date parts', todayStr() === d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
const iso = isoLocal(new Date(2026, 5, 15, 23, 59, 30)); info('isoLocal 23:59:30 => ' + iso + ' ; parse back ms diff=' + (Date.parse(iso) - new Date(2026, 5, 15, 23, 59, 30).getTime()));
} catch (e) { out('EXC ' + e.stack); }
out('DONE');
