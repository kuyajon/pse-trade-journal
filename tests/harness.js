const R = document.getElementById('results');
const T = { n: 0, fail: 0 };
function out(s) { R.textContent += s + '\n'; }
function ok(name, cond, detail) { T.n++; if (!cond) T.fail++; out((cond ? 'PASS ' : 'FAIL ') + name + (detail !== undefined && !cond ? '  => ' + detail : (detail !== undefined ? '  [' + detail + ']' : ''))); }
function info(s) { out('INFO ' + s); }
function eq(name, a, b) { const x = JSON.stringify(a), y = JSON.stringify(b); ok(name, x === y, 'got ' + x + ' expected ' + y); }
window.addEventListener('error', e => out('ERROR ' + e.message));
function reset() { localStorage.clear(); loadAll(); loadFailed = false; storageError = null; db = emptyDb(); meta = defaultMeta(); rev++; logState = { kind: 'trade', editId: null, side: 'buy' }; }
function mk(o) { // build a validated doc from compact pieces
  const raw = Object.assign(emptyDb(), o); raw.app = APP;
  const v = validateDoc(raw); if (!v.ok) throw new Error('mk: ' + v.error); return v.doc;
}
const tr = (id, date, side, ticker, shares, price, net, extra) => Object.assign({ id, date, side, ticker, shares, price, net_amount: net, note: '' }, side === 'sell' ? { sell_reason: 'other' } : {}, extra || {});
const dep = (id, date, amount) => ({ id, date, type: 'deposit', amount, note: '' });
const plan = (id, trade_id, horizon, extra) => Object.assign({ id, trade_id, date: '2026-01-01', horizon, buy_reason: 'dividend', thesis: '', target: null, stop: null, review_by: null, off_list: false }, extra || {});
function setv(f, name, val) { const el = f.elements[name]; if (!el) throw new Error('no field ' + name); el.value = val; }
function openLog(kind, editId, side) { logState = { kind, editId: editId || null, side: side || 'buy' }; view = 'log'; render(); return $(kind === 'trade' ? '#f-trade' : kind === 'dividend' ? '#f-div' : '#f-cash'); }
function submit(f) { f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }
function fire(el, type) { el.dispatchEvent(new Event(type, { bubbles: true })); }
// fill + save a trade through the real form
function saveTrade(o, editId) {
  const f = openLog('trade', editId, o.side);
  if (o.side) { f.elements.side.value = o.side; $$('input[name=side]', f).forEach(r => r.checked = r.value === o.side); }
  setv(f, 'date', o.date); f.elements.ticker.value = o.ticker; $('.pk-in', f).value = o.ticker;
  setv(f, 'shares', o.shares); setv(f, 'price', o.price); setv(f, 'net', o.net == null ? '' : o.net); fire(f, 'input');
  const g = $('#f-trade');
  if (o.horizon && g.elements.horizon) { setv(g, 'horizon', o.horizon); fire(g.elements.horizon, 'change'); }
  if (o.buy_reason && $('#f-trade').elements.buy_reason) setv($('#f-trade'), 'buy_reason', o.buy_reason);
  if (o.sell_reason && $('#f-trade').elements.sell_reason) setv($('#f-trade'), 'sell_reason', o.sell_reason);
  if (o.note != null) setv(g, 'note', o.note);
  if (o.thesis != null && g.elements.thesis) setv(g, 'thesis', o.thesis);
  submit(g);
  return $('#trade-warn') ? $('#trade-warn').textContent : '';
}
const T1 = () => ({ id: 'a', date: '2026-01-01', side: 'buy', ticker: 'BDO', shares: 1, price: 1, net_amount: 1 });
