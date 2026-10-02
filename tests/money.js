try {
// ---------- helpers
const S = sampleData(); const v = validateDoc(S); ok('sample passes validateDoc', v.ok, v.error);
db = v.doc; rev++; let D = derive();
// invariants on sample
const sumPos = sum(D.positions, p => p.totalC), unl = sum(D.unlinked, d => C(d.net_amount));
ok('sum(position totals)+unlinked divs == Summary gain', sumPos + unl === D.gain, sumPos + ' + ' + unl + ' vs ' + D.gain);
ok('cash identity', D.cash === D.netContrib - sum(db.trades.filter(t => t.side === 'buy'), t => C(t.net_amount)) + sum(db.trades.filter(t => t.side === 'sell'), t => C(t.net_amount)) + D.divTotal);
for (const p of D.positions) { const rem = p.buyC - p.costC; if (p.realizedC !== p.sellC - rem) ok('realized identity ' + p.ticker, false); }
ok('closed: realized == sell - buy', D.closed.every(p => p.realizedC === p.sellC - p.buyC));
ok('open positions all priced in sample?', D.missing === 0, 'missing ' + D.missing);
const A = allocActual(D); info('sample alloc % ' + JSON.stringify(Object.fromEntries(Object.entries(A.v).map(([k, x]) => [k, (x / A.total * 100).toFixed(1)]))));
info('sample trades=' + db.trades.length + ' closed=' + D.closed.length + ' open=' + D.open.map(p => p.ticker + ':' + p.horizon).join(','));
info('trading closed positions=' + D.closed.filter(p => p.horizon === 'trading' || (p.origPlan && p.origPlan.horizon === 'trading')).length);
info('early exits: ' + D.closed.filter(p => p.badges.includes('early')).map(p => p.ticker).join(',') + ' overstayed: ' + D.positions.filter(p => p.badges.includes('overstayed')).map(p => p.ticker + (p.isOpen ? '(open)' : '')).join(','));
info('losslong: ' + D.positions.filter(p => p.badges.includes('losslong')).map(p => p.ticker + (p.isOpen ? '(open)' : '')).join(','));
info('cash% ' + (Math.max(0, D.cash) / A.total * 100).toFixed(1) + ' cash=' + D.cash);
info('unlinked divs in sample: ' + D.unlinked.length);
// ---------- fee estimate
const e1 = feeEstimate('buy', 100, 142.5, '2026-03-02', 0);
eq('fee buy 100@142.50', [e1.gross, e1.comm, e1.vat, e1.pse, e1.sccp, e1.stt, e1.net], [1425000, 3563, 428, 71, 143, 0, 1429205]);
const s0 = feeEstimate('sell', 1000, 10, '2025-06-30', 0), s1 = feeEstimate('sell', 1000, 10, '2025-07-01', 0);
eq('stt 0.6% on 2025-06-30', s0.stt, 6000); eq('stt 0.1% on 2025-07-01', s1.stt, 1000);
ok('stt with empty date defaults to 0.1%', feeEstimate('sell', 1000, 10, '', 0).stt === 1000);
const em = feeEstimate('buy', 10, 10, '2026-01-01', 50); eq('min commission applies', em.comm, 5000);
// ---------- parseNum
const pn = { '12': 12, '12.5': 12.5, '.5': .5, '1,234.50': 1234.5, '₱ 1,000': 1000, '12.': 12, '-1': NaN, '1e3': NaN, '0x10': NaN, 'Infinity': NaN, '1,23': NaN, '': NaN, '1000000000001': NaN, '1000000000000': 1e12, '1 2': 12, '1,234,5': NaN, '0,000': 0 };
for (const [k, x] of Object.entries(pn)) { const r = parseNum(k); ok('parseNum(' + JSON.stringify(k) + ')', Object.is(r, x) || (r === x), r); }
// ---------- hand-built scenario: partial sell then rebuy; avg cost
db = mk({ trades: [tr('a1', '2026-01-02', 'buy', 'BDO', 100, 100, 10010), tr('a2', '2026-01-03', 'buy', 'BDO', 100, 110, 11011), tr('a3', '2026-01-10', 'sell', 'BDO', 50, 120, 5990), tr('a4', '2026-01-11', 'buy', 'BDO', 50, 90, 4505)], cash: [dep('c1', '2026-01-01', 30000)], dividends: [{ id: 'd1', date: '2026-01-05', ticker: 'BDO', net_amount: 90, note: '' }, { id: 'd0', date: '2025-12-01', ticker: 'BDO', net_amount: 45, note: '' }], prices: { BDO: { price: 100, as_of: '2026-09-30' } } }); rev++;
D = derive(); let p = D.positions[0];
eq('avg after trim: cost remaining', p.costC, 2102100 - 0 - Math.round(2102100 * 50 / 200) + 450500);
eq('realized of trim', p.sells[0].realizedC, 599000 - Math.round(2102100 * 50 / 200));
ok('unlinked dividend before first buy', D.unlinked.length === 1 && D.divTotal === 13500);
ok('linked dividend on position', p.divC === 9000);
ok('gain = sum(pos totals)+unlinked', sum(D.positions, x => x.totalC) + 4500 === D.gain);
// sell-then-rebuy same day: stored order matters
db = mk({ trades: [tr('b1', '2026-02-01', 'buy', 'ALI', 100, 10, 1005), tr('b2', '2026-02-02', 'buy', 'ALI', 100, 20, 2010), tr('b3', '2026-02-02', 'sell', 'ALI', 100, 15, 1490)], cash: [dep('c', '2026-01-01', 10000)] }); rev++; D = derive();
info('same-day buy-before-sell: positions=' + D.positions.length + ' closed=' + D.closed.length + ' open held=' + (D.open[0] && D.open[0].held));
db = mk({ trades: [tr('b1', '2026-02-01', 'buy', 'ALI', 100, 10, 1005), tr('b3', '2026-02-02', 'sell', 'ALI', 100, 15, 1490), tr('b2', '2026-02-02', 'buy', 'ALI', 100, 20, 2010)], cash: [dep('c', '2026-01-01', 10000)] }); rev++; D = derive();
info('same-day sell-before-buy: positions=' + D.positions.length + ' closed=' + D.closed.length + ' realized=' + D.realized);
// zero/negative cash, unpriced
db = mk({ trades: [tr('z1', '2026-02-01', 'buy', 'ALI', 100, 10, 1005)] }); rev++; D = derive();
ok('negative cash derived', D.cash === -100500 && D.pv === -100500 && D.missing === 1, D.cash + ' ' + D.pv);
const html = VIEWS.summary(D); ok('summary renders w/ negative cash+unpriced no NaN', !/NaN|undefined|Infinity/.test(html));
// ---------- smoke: all views, various datasets
function smoke(label) { for (const k of Object.keys(VIEWS)) { view = k; try { const h = VIEWS[k](getD()); const m = h.match(/NaN|undefined|Infinity|\[object/); if (m) ok('smoke ' + label + ' ' + k, false, m[0] + ' near ' + h.slice(Math.max(0, h.indexOf(m[0]) - 80), h.indexOf(m[0]) + 40)); } catch (e) { ok('smoke ' + label + ' ' + k, false, e.message); } } }
db = emptyDb(); rev++; smoke('empty');
db = validateDoc(sampleData()).doc; rev++; smoke('sample');
// ---------- closed-stats cross-checks on sample
D = getD(); const gs = groupStats(D.closed);
ok('closed total == sum realized+divs', gs.total === sum(D.closed, x => x.realizedC + x.divC));
const yrs = {}; D.closed.forEach(x => yrs[x.closeDate.slice(0, 4)] = (yrs[x.closeDate.slice(0, 4)] || 0) + x.totalC);
ok('by-year totals add to closed total', sum(Object.values(yrs)) === gs.total);
const byH = HORIZONS.map(h => groupStats(D.closed.filter(x => x.horizon === h)).total).concat(groupStats(D.closed.filter(x => !x.horizon)).total);
ok('by-horizon totals add up', sum(byH) === gs.total);
// streaks: same-day closes
const mkp = (id, d, tot) => ({ id, closeDate: d, totalC: tot });
const list = [mkp('a', '2026-01-01', 5), mkp('b', '2026-01-02', -5), mkp('c', '2026-01-02', 5), mkp('d', '2026-01-02', 5)];
info('streaks(storedOrder)=' + JSON.stringify(streaks(list)) + ' streaks(as Closed screen sorts desc)=' + JSON.stringify(streaks(list.slice().sort((a, b) => a.closeDate < b.closeDate ? 1 : -1))));
// profit factor/edge
eq('groupStats empty', groupStats([]).n, 0);
eq('pf infinite', groupStats([{ totalC: 5, buyC: 10, days: 1 }]).pfInf, true);
// xirr
eq('xirr 10% over 1y', Math.round(xirr([['2025-01-01', -100000], ['2026-01-01', 110000]], '2026-01-01') * 1000), 100);
ok('xirr null when no sign change', xirr([['2025-01-01', -100], ['2026-01-01', -50]], '2026-01-01') === null);
// fmtHeld
eq('fmtHeld', [fmtHeld(30), fmtHeld(59.6), fmtHeld(60), fmtHeld(364), fmtHeld(365), fmtHeld(730)], ['30 days', '60 days', '2m', '12m', '1y 0m', '2y 0m']);
// addMonths / dates
eq('addMonths leap', [addMonths('2024-02-29', 12), addMonths('2024-02-29', -12), addMonths('2026-01-31', 1), addMonths('2024-03-31', -1), addMonths('2026-12-31', 2), addMonths('2026-01-15', -13)], ['2025-02-28', '2023-02-28', '2026-02-28', '2024-02-29', '2027-02-28', '2024-12-15']);
eq('daysBetween across DST', daysBetween('2026-03-07', '2026-03-09'), 2);
eq('pct', [pct(-0.00001), pct(0.00001, true), pct(0.043, true), pct(-0.02)], ['0.0%', '+0.0%', '+4.3%', '−2.0%']);
eq('money', [money(-123400), money(5, true), money(0, true), money(NaN)], ['−₱1,234.00', '+₱0.05', '₱0.00', '—']);
} catch (e) { out('EXC ' + e.stack); }
out('DONE ' + T.n + ' checks, ' + T.fail + ' failed');
