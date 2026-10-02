// node _harness/chay-cdp.js "<url>" [cổng] — chạy một trang kiểm (_harness/kiem-*.html, thu-crud.html, trang dò) bằng
// Edge headless THỜI GIAN THẬT qua DevTools, đợi #out có chữ DONE rồi in #out.
// Vì sao không dùng --virtual-time-budget: đồng hồ ảo treo sau màn đầu khi máy chủ tĩnh bận (gặp 2026-09-26).
// Mỗi cổng một hồ sơ Edge riêng (chạy song song được) và XOÁ hồ sơ khi xong — để lại là đầy ổ C (26/9: hơn 100 hồ sơ).
// Trên Git Bash nhớ MSYS_NO_PATHCONV=1 (không thì '#/r/…' trong URL bị đổi thành đường dẫn Windows) — và khi đó gọi tệp này
// bằng đường dẫn TƯƠNG ĐỐI (_harness/chay-cdp.js) hoặc D:/…, KHÔNG dùng /d/… (không còn được đổi → MODULE_NOT_FOUND).
const { spawn } = require('child_process');
const url = process.argv[2];
const port = Number(process.argv[3] || 9377);
const E = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const prof = require('path').join(require('os').tmpdir(), 'ums-edge-' + port);
const PROF = prof;
const p = spawn(E, ['--headless=new', '--disable-gpu', '--user-data-dir=' + prof, '--window-size=1440,900',
    '--remote-debugging-port=' + port, url], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    let ws, t0 = Date.now();
    for (let i = 0; i < 60; i++) {
        await sleep(500);
        try {
            const l = await (await fetch('http://127.0.0.1:' + port + '/json')).json();
            const pg = l.find(x => x.type === 'page');
            if (pg) { ws = new WebSocket(pg.webSocketDebuggerUrl); break; }
        } catch (e) {}
    }
    await new Promise(r => ws.onopen = r);
    let id = 0; const wait = {};
    ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait[d.id]) { wait[d.id](d); delete wait[d.id]; } };
    const ev = expr => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } })); });
    let out = '';
    while (Date.now() - t0 < 600000) {
        await sleep(2000);
        const r = await ev("(document.getElementById('out')||{}).textContent||''");
        out = (r.result && r.result.result && r.result.result.value) || '';
        if (/DONE/.test(out)) break;
    }
    console.log(out);
    ws.close(); p.kill();
  /* Xoá hồ sơ Edge tạm — mỗi hồ sơ hàng trăm MB, để lại là đầy ổ (đã gặp 2026-09-26) */
  await new Promise(r => p.once('exit', r)).catch(() => {}); await new Promise(r => setTimeout(r, 800));
  try { require('fs').rmSync(PROF, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) {}
    process.exit(0);
})();
