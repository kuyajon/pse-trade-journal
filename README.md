# Pinoy Trade Journal

A free, open-source trading journal for Philippine Stock Exchange (PSE) investors.

You log what you actually did (deposits, buys, sells, dividends) and it shows
you, without flattery, how you're really doing. Before each new position you
choose a horizon (Long term, Mid term or Trading) and write down a plan. When
you sell, you give a reason. Afterwards you can see whether you followed the plan.

**Open it:** https://kuyajon.github.io/pse-trade-journal/ · [Source code on GitHub](https://github.com/kuyajon/pse-trade-journal)

**Who it's for**

- **New investors** who want to build good habits from the first trade.
- **Experienced investors** who want hard numbers on their own behavior: which
  buy reasons pay, whether they cut losers or hold them, whether breaking their
  own rules cost them.

**What it is not:** a trading platform, a price feed, a screener or a source of
advice. It doesn't connect to your broker. You type every number yourself, and
it runs as one HTML file in your browser with no server and no account.

New to investing? Unfamiliar words are explained in the [Glossary](#glossary).

**Why track at all?** You improve by measuring what you actually do, not what
you remember doing. Your own record can show things like "my tip-from-a-friend
buys lose money on average" or "my winners reach target but I sell them early."
Every win and mistake teaches something, but without data it's hard to learn
from either.

**Why not just a spreadsheet?** A spreadsheet works, and you can use one. This
app adds things a spreadsheet won't do on its own: it asks for a plan before you
buy and a reason when you sell, keeps the original plan when you change it, and
turns your history into a discipline report (see [Closed](#closed)).

> **Back up early.** Your entries live in your browser's storage on this device.
> The browser, or you, can clear it, and Safari deletes it after about 7 days
> without a visit. Use **Export** in Data & settings from time to time. See
> [Backups](#backups).

> **Please read:** this app was vibe coded. The idea and design are mine and the
> code was written with Claude Code (an AI coding assistant from Anthropic). It is
> meant as an example and an inspiration, not a finished product. I tried to check
> that it is correct, but there can still be issues, especially in how well it
> fits what you need. Use it as it is, play with it, track in Excel or Google
> Sheets instead, or build your own. See also [Not financial advice](#not-financial-advice).

**Contents**

- [Privacy](#your-data-never-leaves-your-device)
- [Getting started](#getting-started): [open it](#open-it), [sample data](#look-around-first), [beginner path](#the-journey-for-a-beginner), [experienced path](#the-path-for-an-experienced-investor), [first five minutes](#your-first-five-minutes)
- [The idea](#the-idea)
- [Using it](#using-it)
- [Backups](#backups)
- [Limits](#limits)
- [Not financial advice](#not-financial-advice)
- [Glossary](#glossary)

## Your data never leaves your device

Everything you enter is stored in your browser on this device. Nothing is
uploaded anywhere. You don't have to take that on trust: near the top of
[`index.html`](index.html) is this line:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'">
```

It tells the browser to block the page from loading or sending anything in the
background: no scripts or fonts from elsewhere, no fetch or XHR, no images, no
form posts. The page has no code that sends your data anywhere, and the browser
enforces that for everything except you clicking a link (such as Chart ↗). The whole app is that
one file, with no build step, so "view source" shows you exactly what runs.

## Getting started

### Open it

- **Any browser:** go to https://kuyajon.github.io/pse-trade-journal/. Current Chrome, Edge, Safari and
  Firefox all work, on a computer or a phone.
- **iPhone or iPad:** open the link in Safari, tap **Share**, then
  **Add to Home Screen**, and from then on open the journal from that icon.
  Safari deletes a website's saved data after about 7 days without a visit.
  An app added to the Home Screen keeps it.
  (The Home Screen app keeps its own copy, separate from the Safari tab. If you
  already logged entries in Safari, Export there and Import in the Home Screen
  app.)
- **Offline from disk:** download `index.html` from the
  [latest release](https://github.com/kuyajon/pse-trade-journal/releases/latest)
  and open it in your browser.

### Look around first

Before you enter anything of your own, load the sample data and look at every
screen. **Data & settings → Load sample portfolio** loads a simulated portfolio (real
PSE prices and dividends since 2021; the trades and notes are made up) so you can
look around every screen. If you already have data, it asks you to type a
confirmation first, because it replaces everything. When you're done, press
**Clear sample data** in the banner at the top, before you start your own log.

### The journey for a beginner

First, you need an account with a PSE-licensed stockbroker. This app doesn't
buy or sell anything; it only records what you did at your broker.

Don't start by buying. Start by deciding what you are willing to buy.

1. **Choose your universe.** Don't invest in just any stock. Pick a short list
   (5 to 10 is plenty to start) of companies you are willing to own, and tag
   them **Long**, **Mid** or **Trading** on the Universe screen. A short list
   is easier to follow and study. Not sure which horizon? Start with **Long**;
   Trading is the hardest and fees eat into it the most. See [The idea](#the-idea).
   Optional: **AI Help → Find stocks to research** writes a prompt you paste into
   your favorite AI (ChatGPT, Claude, Gemini or any other), then you paste its
   list back into **Import list**. You can also just type the tickers yourself.
2. **Study each stock you like.** Open it on the Watchlist and tap **Research**.
   Record your own reasons and notes. If you don't know how to study a company,
   **AI Help → Research one stock** writes a starter prompt for you.
3. **Set a buy-below price.** Decide the price at or under which you would buy.
   It tells you whether it's time to buy or to wait for the price to come down.
   The Watchlist shows **In buy zone** when you get there.
4. **Log your buy** (Log → Trade) with your horizon and plan.
5. **Keep prices current.** The app has no price feed: there is no reliable
   source of data and PSE has no API to fetch from. Type prices yourself (Update
   prices), or use **AI Help → Update all prices** to write a prompt for your AI
   and paste the reply back.
6. **Log what happens next.** Log a sell when you exit a position, with the
   reason, and log any dividend you receive.
7. **Check your progress.** **Open** shows the positions you still hold.
   **Closed** shows the positions you have fully sold and how those trades
   turned out. Both are explained under [Using it](#using-it).

### The path for an experienced investor

You can skip the universe and research steps and go straight to logging.

1. **Load the sample** (see above) for two minutes to see the screens, then clear it.
2. **Enter your history:** Log → Cash for deposits, then Log → Trade and
   Dividend for what you've done. Type the net amounts from your broker's
   confirmations. Backdated entries are allowed; each one still asks for a plan
   when it opens a position.
3. **Tag your universe** with **Import list** (paste tickers such as `BDO, ALI, SM`),
   or leave it empty. Buying outside a horizon's universe is allowed and is
   tracked as **off-list**.
4. **Go to Closed.** The most useful parts are **Discipline** and **Plan check**.
   They show whether your rules earned or cost you money.
5. **Read how the numbers work** in [Limits](#limits) and [Glossary](#glossary),
   and in [SPEC.md](SPEC.md) for every formula.

### Your first five minutes

1. **Log a deposit:** the money you put into your broker account (Log → Cash).
2. **Log a buy:** Log → Trade. Pick the stock, type the date, shares and price,
   then type the **net amount** from your broker's confirmation. (The app's
   **Use estimate** button guesses the fees, but your broker's number is the
   one to use.) Because it's a new position you'll be asked for a plan: see
   [The idea](#the-idea).
3. **Type a price** for the stock now and then (Open → tap the price) so the app
   can show where you stand.
4. **Back up** once you have some entries (see [Backups](#backups)).

## The idea

The journal is built around three habits.

**1. Pick a horizon before you buy.** Your horizon is how long you intend to hold,
and it decides what kind of plan makes sense. Every position is one of:

| Horizon | You intend to hold | What to write in the plan |
|---|---|---|
| **Trading** | under 1 month | a target and, above all, a stop |
| **Mid term** | 1 to 12 months | a target and a stop |
| **Long term** | over a year | why you'd hold it; a "review by" date |

**2. Write a plan.** (Example: *Mid term, buy reason "undervalued", target ₱120, stop ₱90.*) For each new position you choose the horizon and a buy
reason (dividend income, undervalued, growth story, chart/technical, tip from
someone, news or hype, other), and you can add a thesis, a **target** (where you'd
take profit) and a **stop** (where you'd admit you were wrong). A tip from a
friend is a fine reason. The journal just records it, then shows you later
how those trades did.

**3. Give a reason when you sell.** Hit my target, cut loss, thesis weakened, lost
conviction, rotate, rebalance, need the cash or other. The app warns you if you sell
below your stop without choosing *Cut loss*.

The plan is a history: if you change it later (move a stop, switch horizon), the
change is added, and the original stays. Nobody can quietly rewrite what they
originally intended, including you.

**Universe and off-list.** Each horizon has its own universe: the stocks you are
watching for it. Buying a stock that isn't in that horizon's universe is allowed,
but the position is marked **off-list**, and the Closed screen later shows how
off-list buys did compared with the rest.

## Using it

The menu is on the left on a computer and along the bottom on a phone (tap
**More** for the rest).

### Summary

Your portfolio at a glance: **portfolio value**, cash, how much you've put in, and
**total gain** split into realized (sold), unrealized (still held) and dividends.
Below that:

- **Allocation:** how your money is split between Long term, Mid term, Trading and
  cash, against your own targets. Rows turn amber when you drift more than the
  band (±5 points by default). Change the targets in Data & settings. The app
  never tells you what to buy or sell to rebalance.
- **Reminders:** positions at or below their stop or past their target, Long-term
  positions due for review, positions held longer than their horizon, missing or
  out-of-date prices, and when you last backed up.
- **Dividends by year:** gross, tax withheld and net.

### Log

Three kinds of entry:

- **Trade:** buy or sell. The form shows what you currently hold in that stock and
  warns you (but never blocks you) about things like buying off-list, buying
  without a target or stop, or a buy that pushes a horizon past its target share.
  A sell must have a reason and can't be bigger than what you hold.
- **Dividend:** type the **net** amount that reached your broker account. The app
  works out the gross and the tax withheld (10%, 15% for a few foreign companies).
- **Cash:** a deposit or a withdrawal.

Anything can be changed or deleted later from **History**. The app checks that your
trades still add up (you can't sell shares you didn't have).

### Open

Your current positions, grouped by horizon. For each: shares, average cost, price,
market value, gain, days held, and badges such as **Hit stop**, **Past target**,
**Overstayed**, **Review due**, **Off-list**. Tap a row to see the details, your
plan and its history, and what you did in that stock. From there you can **Buy
more**, **Sell**, **Edit plan** or **Change horizon**.

Prices are never fetched: tap a price to type it (or use **Update prices**). The
app uses your last typed price for market value, and marks a price **stale** after
7 days. Each group shows how you're doing as a whole, including how much of the
gain came from dividends.

Moving a losing Trading or Mid-term position to Long term is allowed, but the app
asks for the current price and flags it ("Loss → Long term"). It's an easy way to
turn a bad trade into a "long-term investment" without admitting it.

### Closed

How your finished trades turned out, and the part most worth reading. Filter by
period (all time, last 12 months, this year) and by horizon.

- **Scorecard:** win rate, total return, average win versus average loss, profit
  factor (pesos won ÷ pesos lost), best and worst, streaks, fees paid.
- **Positions:** every closed position. Tap a row for its trades and plan history.
  **R** is your gain measured in units of the risk you accepted at the stop: if
  you risked ₱10 a share (entry to stop) and made ₱20, that's +2R.
- **By year closed:** are you improving?
- **By horizon, by sector, by buy reason, by sell reason:** where your results
  actually come from.
- **Discipline:** did you follow your own rules, and what did it cost or earn?
  On-list versus off-list buys, losers moved to Long term, overstaying, exiting
  early. If breaking a rule did worse than your overall average, the rule was
  worth keeping.
- **Plan check:** how often you exited at your target, at your stop, or in between,
  and what happened when you moved a stop or target.

### Watchlist and Universe

**Universe** lists every PSE stock (common shares, REITs and ETFs). Tap **Long**,
**Mid** or **Trading** next to a stock to add it to that watchlist; a stock can be
in several. You can search, filter by sector, and **Add symbol** for a new listing
that isn't in the list yet. **Import list** tags many at once: paste tickers such
as `BDO, ALI, SM`, choose the horizons, check the preview and confirm. Nothing is
saved until you confirm, and importing never removes tags.

**Watchlist** shows the stocks you've tagged, with their last price, a
52-week-range slider, and your own **buy-below** price (you'll see "In buy zone"
when the price is at or below it). Tap **Research** on a stock to record your
buy-below price, **why it interests you** (qualities of the business, never the
price) and notes. There is also a **Chart ↗** link on each stock that opens
TradingView in a new tab. The app loads nothing from it.

### Update prices

One list with every stock on your watchlist and every stock you hold. Type the
prices from your broker app, pick the date and save. Empty boxes keep the old
price. You can also get prices from your own AI, see below.

### AI Help (optional)

The app never goes online and has no AI inside it. **AI Help** writes prompts that
you copy into your own AI chat (ChatGPT, Gemini, Claude, whatever you use), and for
some of them you paste the reply back. You always see a preview first, and nothing
is saved until you confirm. An AI can be wrong, so check what it tells you. It is
never advice from this app.

- **Update all prices and 52-week ranges:** the prompt lists your watchlist tickers
  and points your AI at PSE's own daily report. Use an AI that can open web pages.
  Paste the reply back; rows with a problem start unticked.
- **Find stocks to research:** choose which PSE indices to look in (and optionally
  a minimum dividend yield). Paste the AI's list into **Import list** on the
  Universe screen.
- **Review closed positions / Review open positions:** your AI reads a summary of your
  trades and tells you what the pattern says. The summary has **no stock names, no
  peso amounts and no notes**: only percentages, days held and reasons. Paste the
  reply back to save it; it appears at the top of Closed or Open, and next time's
  prompt includes the last review so the AI can check whether you followed it.
- **Research one stock** (on the Watchlist, under **Research**): a strong starter
  prompt that includes the stock, your buy-below and notes. It asks the AI to score
  business qualities and estimate a fair value. It's a starting point for your own
  research; keep asking follow-up questions, check the numbers yourself, and then
  record your own buy-below, reasons and notes.

### History

Every trade, dividend and cash entry, newest first. Filter by type or stock. This
is where you **Edit** or **Delete** an entry.

### Data & settings

Backups, import, CSV export, saving to a file, the minimum commission your broker
charges (default none), your allocation targets, loading or clearing the sample
portfolio, and **Erase everything**.

## Backups

Your browser's storage is the working copy. The browser or you can clear it,
so keep backups:

- **Export** (Data & settings) downloads `pinoy-trade-journal-YYYY-MM-DD.json`.
  On phones you can **Share** it straight to Google Drive, Messenger or email.
- **Import** reads a backup, shows what's in it, and replaces your current
  data only after you confirm. There's no merge.
- The Summary shows when you last backed up and how many entries have changed
  since. It turns amber after 7 days with unsaved changes.
- **Export CSV** gives you trades, dividends and cash for Excel or Google
  Sheets. It's one-way; CSV can't be imported back.
- **Save to a file** (Chrome or Edge on a computer): pick a file once, for
  example in Documents, and every change is written there too. If that folder
  syncs to OneDrive or Google Drive, that's a free cloud backup.
- If the app can't read what's stored, it tells you, keeps a copy and refuses to
  overwrite it. Import your latest backup to continue.

### A downloaded copy keeps separate data

The GitHub Pages link and a downloaded `index.html` are different places to your
browser, so each keeps its own data. To move from one to the other, Export
in one and Import in the other. The same goes for Safari versus the Home Screen app
on an iPhone, and for two different browsers.

## Limits

What the app does and doesn't do, so you know before you commit your records to it:

- **One portfolio per browser copy**, in Philippine pesos, in English.
- **No price feed, no broker sync.** Every trade, price and dividend is typed (or
  pasted from your own AI) and previewed first.
- **Average-cost method.** Your cost per share is a running average of what you paid,
  fees included. Selling doesn't change it; later buys blend in. It does not track
  separate lots (like FIFO) for tax.
- **Return % is simple, not time-weighted.** A position's return is its total gain
  (realized, unrealized and dividends) divided by the total you paid in buys. For
  Long term and Mid term groups held about a year or more, the Open screen also shows an
  annualized return (XIRR).
- **Dividends** are linked to the latest position in that stock opened on or before
  the dividend date, even a closed one, since payments often arrive after a sale.
- **No special handling for corporate actions** such as stock splits or rights offerings,
  and no comparison with the PSEi or any other benchmark.
- **A break-even position counts as a loss** in win rate.
- **Not a tax tool.** It tracks dividend tax withheld and estimates fees, but your
  broker's statements are the official record.

[SPEC.md](SPEC.md) has every formula and message.

## Not financial advice

This is a personal log. It gives no buy or sell signals, screeners or advice.
Your broker's statements are the official record. The fee estimate is only a
hint based on the standard PSE schedule (commission 0.25%, 12% VAT on it, PSE and
SCCP fees, and a 0.1% stock transaction tax on sells from 1 July 2025, 0.6% before).
Fees and taxes change, so always type the net amount from your broker's confirmation.
AI Help prompts and replies come from your own AI, not from this app, and can be wrong.

The bundled PSE symbol list was compiled from PSE's public company
listing and may be out of date. Use **Add symbol** for anything missing.

## Glossary

Terms the app and this guide use. Words in the app's own labels are in **bold**.

### Basics

- **PSE:** the Philippine Stock Exchange. **PSEi** is its main index of 30 large companies.
- **Broker:** the licensed company through which you buy and sell PSE stocks.
- **Common share, REIT, ETF:** the three kinds of listing in the Universe. A REIT is a property-owning fund that pays out most of its income; an ETF is a fund that tracks a basket of stocks.
- **Sector:** the industry group of a company, such as Financials or Property.
- **Dividend:** a cash payment a company makes to its shareholders. **Dividend yield** is the yearly dividend as a percentage of the share price.
- **Gross / net:** gross is before fees or tax, net is after. For a trade, gross = shares × price, and your **net amount** is the exact peso figure on your broker's confirmation (what you paid for a buy, what you received for a sell). For a dividend, net is what reached your account after tax.
- **Withholding tax:** tax taken from a dividend before you receive it (10%, or 15% for a few foreign companies).
- **Fees:** commission, VAT on the commission, PSE and SCCP (clearing) fees, and a stock transaction tax on sells. The **Use estimate** button guesses them; your broker's number is the real one.
- **52-week range:** the lowest and highest price of the past year.

### Positions

- **Position:** the shares you hold in one stock. It opens with a buy and closes when you've sold everything.
- **Open position:** a position you still hold. Shown on **Open**.
- **Closed position:** a position you have fully sold. Shown on **Closed**. A later buy of the same stock opens a new position.
- **Trim:** selling some, but not all, of a position. It stays open.
- **Average cost:** what you paid per share on average, fees included.
- **Market value:** shares × your last typed price.
- **Realized gain:** profit or loss locked in by selling. **Unrealized gain:** profit or loss on shares you still hold, at your last typed price.
- **Total gain / total return:** realized + unrealized + dividends. **Return %** is that as a share of what you paid in buys.
- **Portfolio value:** market value of everything you hold plus cash.
- **Cash:** the money in your broker account: deposits, minus buys, plus sells and dividends, minus withdrawals. It should match your broker's cash balance.
- **Deposit / withdrawal:** money you put into or take out of your broker account (**Log → Cash**).
- **Days held:** days from the date a position opened to the date it closed (or today).
- **Unlinked dividend:** a dividend dated before you held any position in that stock. It counts in cash but in no position.
- **Stale price:** a price you last typed more than 7 days ago.
- **Custom symbol:** a stock you added yourself because it isn't in the bundled list.

### Planning

- **Horizon:** how long you intend to hold: **Trading** (under 1 month), **Mid term** (1 to 12 months) or **Long term** (over a year).
- **Universe:** the PSE stocks listed in the app. **Watchlist:** the ones you've tagged for a horizon.
- **Off-list:** a buy of a stock that wasn't tagged for that horizon.
- **Plan:** what you write down before a new position: horizon, buy reason, optional thesis, target and stop. **Plan history** is the record of changes to it; the original is never overwritten.
- **Thesis:** your reason for owning the stock, in your own words.
- **Buy-below price:** the price at or under which you'd be happy to buy. **In buy zone** means the price is at or below it.
- **Target / stop:** the price where you'd take profit / where you'd admit you were wrong and sell.
- **Review by:** the date you'll re-check a Long term holding.
- **Buy reasons:** why you bought. *Dividend income*, *Undervalued* (you think the price is below the company's worth), *Growth story*, *Chart/technical* (based on price patterns), *Tip from someone*, *News or hype*, *Other*.
- **Sell reasons:** why you sold. *Hit my target*; *Cut loss*; *Thesis weakened* (specific new information changed your view); *Lost conviction* (doubt, but no specific reason); *Rotate* (move the money to a better idea); *Rebalance* (the position grew too big); *Need the cash*; *Other*.
- **Allocation:** how your money is split between Long term, Mid term, Trading and cash. **Target** allocation is your own goal; **band** is how many percentage points you can drift from it before the row turns amber. **Rebalance** means bringing it back toward your targets.

### Badges and flags

- **Hit stop / Past target:** the price is at or below your stop / at or above your target.
- **Overstayed:** held longer than the horizon allows (Trading over 1 month, Mid term over 12 months).
- **Early exit:** sold sooner than the horizon intends (a Long term position in under 12 months, or a Mid term one in under 1 month).
- **Review due:** a Long term position past its review-by date.
- **Horizon changed:** the horizon was changed after buying.
- **Loss → Long term:** a losing Trading or Mid term position moved to Long term.
- **No plan:** a position with no plan recorded.
- **Not in current PSE list:** the ticker isn't in the app's bundled list, which may be out of date.

### Statistics

- **Win rate:** share of closed positions that made money. A break-even counts as a loss.
- **Average win / average loss:** the average return of the winners / of the losers.
- **Profit factor:** total pesos won ÷ total pesos lost. Above 1 means winners outweighed losers.
- **R:** your gain measured in units of the risk you accepted at your stop (+2R = made twice what you risked). Only shown when the original plan had a stop.
- **Streak:** the longest run of wins or of losses in a row.
- **Median days held:** the middle holding time: half your trades were shorter, half longer.
- **Discipline:** how trades that broke your own rules (off-list, overstayed, early exit, loss → Long term) did compared with the rest.
- **Plan check:** whether you exited at target, at stop or in between, and how it went when you moved a stop or target.
- **XIRR:** a yearly return that accounts for when each peso went in and came out. Shown as "/yr" on the Open screen for groups held about a year or longer (not Trading).

## For developers

The source is at https://github.com/kuyajon/pse-trade-journal.
[SPEC.md](SPEC.md) describes every behaviour, formula and screen in detail, and holds
the bundled data, so the app can be rebuilt from it alone. Exports are plain JSON
(the format is documented there), so your data isn't locked in.

## License

[MIT](LICENSE)
