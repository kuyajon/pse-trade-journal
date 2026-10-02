# Tests

Headless-Chrome checks that drive the app's own functions (`db`, `validateDoc`, `derive`, `VIEWS`, `ACTS`, ...).
Nothing here changes `index.html`: each run appends the test to a temporary copy of it.

    tests/run.sh money.js                 # prints PASS / FAIL / INFO lines, ends with "DONE n checks, m failed"
    NOVT=1 tests/run.sh perf-and-timezones.js America/Los_Angeles
    NOVT=1 tests/run.sh layout.js Asia/Manila 899    # try 899 and 900

Needs `google-chrome` and `python3`. Files: `harness.js` (helpers), `money.js` (calculations and totals),
`hostile-input.js` (escaping, CSV), `prompts-and-parsers.js` (AI prompts and reply parsers),
`file-save-and-perf.js` (mocked linked file, 3,000 trades), `backup-and-storage-events.js`,
`regressions.js` (one check per bug fixed in the code review; all should PASS). Some INFO lines are
observations, not assertions.
