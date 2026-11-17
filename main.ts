// cbBTC breakout bot for make.fun btc-race-24h-20261117-0603.
// Strategy: 24-bar breakout, long only, hold the trend.
// - Entry: the close makes a new 24-bar high (breakout) and we hold nothing. Buy 100% equity.
// - Exit (whole position): the close makes a new 24-bar low (breakdown), or the close falls
//   5% under the highest close since entry (wide trailing stop, catastrophic protection only).
// - No trading during warmup. One position at a time. Deterministic: floats only, no clock,
//   no randomness. Max slippage 100 bps per order.
// - Rationale: on 1-minute bars the dev window is choppy with a slight upward drift; active
//   EMA trading whipsaws (house ema-cross lost $106 on dev). A breakout entry buys the trend
//   once and holds it, paying the ~26 bps round trip only once or twice.
import { runBars, type BarsState, type Bar } from './vendor/makefun-bars.ts';

const LOOKBACK = 24;
const TRAIL_BPS = 500; // trailing stop: 5% under peak since entry
const MAX_SLIPPAGE_BPS = 100;

const closes: number[] = [];
let peakSinceEntry = 0;

await runBars({
  onBatch(state: BarsState, batch: { bars: Bar[] }) {
    for (const bar of batch.bars) closes.push(Number(bar.c));
    if (state.warmingUp) return [];
    if (closes.length <= LOOKBACK) return [];
    const close = closes[closes.length - 1];
    const window = closes.slice(-LOOKBACK - 1, -1);
    let hi = -Infinity;
    let lo = Infinity;
    for (const c of window) {
      if (c > hi) hi = c;
      if (c < lo) lo = c;
    }
    const held = state.positions.get('CBBTC');
    const orders: { side: 'buy' | 'sell'; symbol: string; notional_quote_units?: bigint; qty?: bigint; max_slippage_bps: number }[] = [];

    if (held !== undefined) {
      if (close > peakSinceEntry) peakSinceEntry = close;
      const trailHit = close * 10000 <= peakSinceEntry * (10000 - TRAIL_BPS);
      if (trailHit) {
        orders.push({ side: 'sell', symbol: 'CBBTC', qty: held.qty, max_slippage_bps: MAX_SLIPPAGE_BPS });
        peakSinceEntry = 0;
      }
    } else if (close > hi) {
      const slice = state.cash;
      if (slice > 0n) {
        orders.push({ side: 'buy', symbol: 'CBBTC', notional_quote_units: slice, max_slippage_bps: MAX_SLIPPAGE_BPS });
        peakSinceEntry = close;
      }
    }
    return orders;
  },
});
