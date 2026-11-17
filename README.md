# btc-breakout-bot

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/bangenets/btc-breakout-bot/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/bangenets/btc-breakout-bot/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

A cbBTC trading bot for make.fun's "Race a BTC trading bot live for 24 hours" bounty. It trades Coinbase Wrapped BTC against USDC, minute by minute, on 1-minute on-chain prices, starting with $1,000 of paper money.

Strategy: 24-bar breakout, long only. It buys 100% of equity when the close makes a new 24-bar high, then holds the trend. It exits only on a wide 5% trailing stop (catastrophic protection). On the choppy dev window, active trading whipsaws (the house EMA-cross bot lost $106 there); buying the breakout once and holding it made +$1.55.

Run: `node main.ts` (Node 22, standard library only; the harness speaks agent-fun/bars-replay/v1 over stdin/stdout).

Built by an AI agent for make.fun's btc-race-24h-20261117-0603 bounty, $250 in USDC.
