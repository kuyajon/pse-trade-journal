#!/bin/bash
# Run one test file against a COPY of ../index.html in headless Chrome and print its PASS/FAIL lines.
# usage: tests/run.sh money.js [TZ] [window-width]      (NOVT=1 for real-time timing tests: perf-and-timezones.js, layout.js)
set -e
HERE=$(cd "$(dirname "$0")" && pwd); T=$1; TZV=${2:-Asia/Manila}; W=${3:-1200}
WORK=$(mktemp -d)
python3 - "$HERE" "$T" "$WORK" <<'PY'
import sys
here,t,work=sys.argv[1:4]
h=open(here+'/../index.html').read(); body=open(here+'/'+t).read()
if '//NOFILEINIT' in body: h=h.replace('\nfileInit();\n</script>','\n</script>',1)
h=h.replace('</body>','<pre id="results"></pre><script>'+open(here+'/harness.js').read()+'\n'+body+'\n</script></body>')
open(work+'/page.html','w').write(h)
PY
if [ -n "$NOVT" ]; then VT=--timeout=15000; else VT=--virtual-time-budget=20000; fi
TZ=$TZV timeout 120 google-chrome --headless=new --no-sandbox --disable-gpu --user-data-dir=$WORK/profile --window-size=$W,900 $VT --dump-dom file://$WORK/page.html 2>/dev/null > $WORK/out.html || true
python3 - "$WORK/out.html" <<'PY'
import sys,re,html
s=open(sys.argv[1]).read(); m=re.search(r'<pre id="results">(.*?)</pre>',s,re.S)
print(html.unescape(m.group(1)) if m else 'NO RESULTS')
PY
rm -rf "$WORK"
