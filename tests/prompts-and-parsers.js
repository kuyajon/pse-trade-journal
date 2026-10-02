(async () => { try {
// CSV BOM bytes
reset(); db = validateDoc(sampleData()).doc; rev++;
let blobs = []; const oc = URL.createObjectURL; URL.createObjectURL = b => { blobs.push(b); return 'blob:x'; }; exportCSV(); URL.createObjectURL = oc;
const ab = new Uint8Array(await blobs[0].arrayBuffer()); ok('CSV starts with UTF-8 BOM bytes', ab[0] === 0xEF && ab[1] === 0xBB && ab[2] === 0xBF);
// ===== prompt leakage on sample, with notes seeded with distinctive text
db = validateDoc(sampleData()).doc;
db.trades.forEach((t, i) => { if (i % 3 === 0) t.note = 'SECRETNOTE' + i; }); db.plans.forEach(p => p.thesis = 'SECRETTHESIS'); db.reviews.push({ id: 'prev1', kind: 'closed', date: '2026-09-01', text: 'prev review text', snap: { n: 3, winRate: 0.5, retPct: 0.1 } }, { id: 'prev2', kind: 'open', date: '2026-09-01', text: 'prev open review', snap: { n: 3, winRate: null, retPct: 0.1 } }); rev++;
const D = getD();
const tick = [...new Set([...db.trades.map(t => t.ticker), ...db.dividends.map(t => t.ticker), ...Object.keys(db.universe)])];
const names = [...new Set(tick.map(t => symInfo(t).name).filter(Boolean))];
const cp = reviewPrompt(D.closed, D.today, latestReview('closed')), op = openReviewPrompt(D, latestReview('open'));
for (const [label, p] of [['closed review', cp], ['open review', op]]) {
  const hits = tick.filter(t => new RegExp('\\b' + t + '\\b').test(p));
  ok(label + ': no ticker', hits.length === 0, hits.join(','));
  ok(label + ': no company name', !names.some(n => p.includes(n)));
  ok(label + ': no notes/thesis', !/SECRET/.test(p));
  ok(label + ': no peso sign / amounts', !/₱|PHP|\d,\d{3}/.test(p), (p.match(/₱[^ ]*|\d,\d{3}[^ ]*/g) || []).join(' '));
  ok(label + ': includes prev review', /prev (open )?review/.test(p));
}
const dateLeak = cp.match(/\d{4}-\d{2}-\d{2}/g); info('closed review dates in prompt: ' + JSON.stringify(dateLeak));
const od = op.match(/\d{4}-\d{2}-\d{2}/g); info('open review dates in prompt: ' + JSON.stringify(od));
info('open prompt sample lines:\n' + op.split('\n').slice(4, 30).join('\n'));
info('closed prompt first 40 lines:\n' + cp.split('\n').slice(0, 40).join('\n'));
// quirks: unique-position counts (n of positions small) etc
// ===== placeholders with empty/odd data
db = emptyDb(); rev++; let E = getD();
const cps = [() => reviewPrompt([], E.today, null), () => openReviewPrompt(E, null), () => pricesPrompt([], E.today), () => candidatesPrompt({ psei: true }, 0, [], E.today), () => candidatesPrompt({}, 5, ['A', 'B'], E.today), () => researchPrompt('ZZZ', { reasons: [], notes: '', buy_below: null }, E.today)];
cps.forEach((f, i) => { try { const p = f(); const m = p.match(/NaN|undefined|Infinity|\[object|null/); ok('empty-data prompt #' + i + ' clean', !m, m && p.slice(p.indexOf(m[0]) - 60, p.indexOf(m[0]) + 40)); } catch (e) { ok('empty-data prompt #' + i + ' throws', false, e.message); } });
// 3 closed with no plan, no prices, unpriced open positions
db = mk({ cash: [dep('cc', '2026-01-01', 99999)], trades: [tr('a', '2026-01-02', 'buy', 'BDO', 1, 100, 100.5), tr('b', '2026-01-03', 'sell', 'BDO', 1, 100, 99, { sell_reason: 'cut_loss' }), tr('c', '2026-01-04', 'buy', 'ALI', 1, 10, 10.1), tr('d', '2026-01-05', 'sell', 'ALI', 1, 10, 10, { sell_reason: 'rotate' }), tr('e', '2026-01-06', 'buy', 'AC', 1, 10, 10.1), tr('f', '2026-01-07', 'sell', 'AC', 1, 10, 10.2), tr('g', '2026-01-08', 'buy', 'SM', 1, 10, 10.1)] }); rev++; E = getD();
let p = reviewPrompt(E.closed, E.today, null); ok('closed review, no plans: clean', !/NaN|undefined|Infinity|\[object/.test(p), (p.match(/.{30}(NaN|undefined|Infinity).{20}/) || [])[0]);
p = openReviewPrompt(E, null); ok('open review, unpriced: clean', !/NaN|undefined|Infinity|\[object/.test(p), (p.match(/.{30}(NaN|undefined|Infinity).{20}/) || [])[0]); info('open (unpriced, no plan):\n' + p.split('\n').slice(5, 22).join('\n'));
// win rate 0 closed (all null win rate impossible with >=3)
// ===== price reply parser
const wanted = new Set(['BDO', 'ALI', 'SM', 'AC']); const today = '2026-10-01';
const cases = {
  'clean': 'BEGIN_PSE_PRICES\nTICKER,price,as_of,low52,high52\nBDO,152.5,2026-09-29,128,165\nEND_PSE_PRICES',
  'fenced+prose': 'Sure! Here you go:\n```\nBEGIN_PSE_PRICES\nTICKER,price,as_of,low52,high52\nBDO,152.5,2026-09-29,128,165\nEND_PSE_PRICES\n```\nHope that helps',
  'no end marker': 'BEGIN_PSE_PRICES\nBDO,152.5,2026-09-29,128,165',
  'lowercase markers': 'begin_pse_prices\nBDO,152.5,2026-09-29,128,165\nend_pse_prices',
  'md table': '| TICKER | price | as_of | low52 | high52 |\n|---|---|---|---|---|\n| BDO | 152.5 | 2026-09-29 | 128 | 165 |',
  'NA values': 'BEGIN_PSE_PRICES\nBDO,NA,NA,NA,NA\nALI,12,2026-09-29,N/A,—\nEND_PSE_PRICES',
  'thousands sep': 'BEGIN_PSE_PRICES\nAC,"1,234.50",2026-09-29,900,1500\nEND_PSE_PRICES',
  'peso sign': 'BEGIN_PSE_PRICES\nBDO,₱152.50,2026-09-29,128,165\nEND_PSE_PRICES',
  'pipes': 'BDO|152.5|2026-09-29|128|165',
  'tabs': 'BDO\t152.5\t2026-09-29\t128\t165',
  'PSE: prefix & .PS': 'PSE:BDO,1,2026-09-29,1,2\nALI.PS,1,2026-09-29,1,2',
  'dup': 'BEGIN_PSE_PRICES\nBDO,1,2026-09-29,1,2\nBDO.PS,2,2026-09-29,1,3\nEND_PSE_PRICES',
  'feb 30': 'BEGIN_PSE_PRICES\nBDO,1,2026-02-30,1,2\nEND_PSE_PRICES',
  'month 13': 'BEGIN_PSE_PRICES\nBDO,1,2026-13-01,1,2\nEND_PSE_PRICES',
  'month 00': 'BEGIN_PSE_PRICES\nBDO,1,2026-00-10,1,2\nEND_PSE_PRICES',
  'year 0026': 'BEGIN_PSE_PRICES\nBDO,1,0026-09-29,1,2\nEND_PSE_PRICES',
  'future': 'BEGIN_PSE_PRICES\nBDO,1,2026-12-01,1,2\nEND_PSE_PRICES',
  'old': 'BEGIN_PSE_PRICES\nBDO,1,2026-09-01,1,2\nEND_PSE_PRICES',
  'price 0': 'BEGIN_PSE_PRICES\nBDO,0,2026-09-29,1,2\nEND_PSE_PRICES', 'price 1e3': 'BEGIN_PSE_PRICES\nBDO,1e3,2026-09-29,1,2\nEND_PSE_PRICES', 'price 1e6': 'BEGIN_PSE_PRICES\nBDO,1000000,2026-09-29,1,2\nEND_PSE_PRICES', 'price text': 'BEGIN_PSE_PRICES\nBDO,abc,2026-09-29,1,2\nEND_PSE_PRICES',
  'range low>high': 'BEGIN_PSE_PRICES\nBDO,5,2026-09-29,9,2\nEND_PSE_PRICES', 'price outside range': 'BEGIN_PSE_PRICES\nBDO,50,2026-09-29,1,2\nEND_PSE_PRICES', 'incomplete range': 'BEGIN_PSE_PRICES\nBDO,5,2026-09-29,1,NA\nEND_PSE_PRICES',
  'extra col': 'BEGIN_PSE_PRICES\nBDO,5,2026-09-29,1,2,extra\nEND_PSE_PRICES', 'no markers 4 cols': 'BDO,5,2026-09-29,1', 'empty': '', 'prose only': 'I could not open the page.',
  'unwanted': 'BEGIN_PSE_PRICES\nZZZ,5,2026-09-29,1,9\nEND_PSE_PRICES', 'CRLF': 'BEGIN_PSE_PRICES\r\nBDO,5,2026-09-29,1,9\r\nEND_PSE_PRICES\r\n',
  'bold': '**BDO**,5,2026-09-29,1,9', 'two blocks': 'BEGIN_PSE_PRICES\nBDO,5,2026-09-29,1,9\nEND_PSE_PRICES\nblah\nBEGIN_PSE_PRICES\nALI,5,2026-09-29,1,9\nEND_PSE_PRICES',
  'date w/ time': 'BEGIN_PSE_PRICES\nBDO,5,2026-09-29T00:00,1,9\nEND_PSE_PRICES', 'date slashes': 'BEGIN_PSE_PRICES\nBDO,5,09/29/2026,1,9\nEND_PSE_PRICES',
  'unicode minus/arrow header only': 'TICKER,price,as_of,low52,high52'
};
for (const [k, txt] of Object.entries(cases)) { const rows = parsePricesReply(txt, today, wanted); info('PARSE ' + k + ' => ' + JSON.stringify(rows.map(r => ({ t: r.t, p: r.price, d: r.as_of, block: r.block, warn: r.warn, note: r.note, range: r.range })))); }
// saving a "feb 30" row end-to-end and reload
view = 'ai'; db = mk({ universe: { BDO: ['long'] } }); rev++; render(); for (const d of $$('details')) d.open = true;
const box = $('#ai-reply'); box.value = cases['feb 30']; fire(box, 'input'); info('feb30 row ticked? ' + ($('#ai-prev input[type=checkbox]') && $('#ai-prev input[type=checkbox]').checked));
$('#ai-ok').click(); info('saved price entry: ' + JSON.stringify(db.prices.BDO)); view = 'watchlist'; render(); info('watchlist shows date: ' + (main.textContent.match(/\w+ \d+, 2026|undefined[^ ]* \d+, 2026/g) || []).join('|'));
loadAll(); info('after reload price entry: ' + JSON.stringify(db.prices.BDO));
// ===== ticker list parser
for (const s of ['BDO, ALI; SM\nAC', '```\nBDO, ALI\n```', 'PSE:BDO, ALI.PS, bdo', 'DMCI Holdings, BDO', 'A-B, C D', ' ,, ;; ', 'BDO ALI', 'ＢＤＯ']) info('LIST ' + JSON.stringify(s) + ' => ' + JSON.stringify(parseTickerList(s)));
} catch (e) { out('EXC ' + e.stack); }
out('DONE ' + T.n + ' checks, ' + T.fail + ' failed');
})();
