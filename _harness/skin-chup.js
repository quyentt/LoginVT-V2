// Chụp kiểm một màn LỘT DA (xem spa-v1.md) trong vỏ indexi chạy trên máy (index-old.html), mở QUA MENU như người dùng
// (initMain → có breadcrumb). Chụp từng vùng .zone-bus, đo chuỗi thẻ khung ngoài, tràn ngang, lỗi JS.
//
//   node _harness/skin-chup.js <appId vai trò> <MAUNGDUNG> <mẫu đường dẫn tệp> [tiền tố ảnh]
//   vd: node _harness/skin-chup.js 0DD9E9FAF61D4616BE322318368FF15D ApisQuanLyThiTracNghiem quanlybode/html/quanlybode.html bode-
//
// Cần máy chủ tĩnh đang chạy: powershell -ExecutionPolicy Bypass -File _harness\serve.ps1 (cổng 8787).
// appId lấy trong _harness/old-data.js (mỗi ỨNG DỤNG một vai trò). Ảnh ra %TEMP%/ums-skin-chup/.
// Mục mà CSDL bản xuất ghi mở ở index.aspx thì harness chặn chuyển vỏ → script đặt TENANH = 'fa …' cho mục đó trước khi bấm.
// So với bản gốc: chép goc/… đè lên tệp gốc, chạy với tiền tố khác, rồi `python _harness/skin.py ap`.
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const [APP_ID, APP_CODE, MAU, TT = ''] = process.argv.slice(2);
if (!MAU) { console.log('Thiếu tham số — xem đầu tệp.'); process.exit(1); }
const OUT = path.join(os.tmpdir(), 'ums-skin-chup');
fs.mkdirSync(OUT, { recursive: true });
const port = 9393;
const E = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const prof = path.join(os.tmpdir(), 'ums-edge-' + port);
const p = spawn(E, ['--headless=new', '--disable-gpu', '--user-data-dir=' + prof, '--window-size=1920,1000',
    '--remote-debugging-port=' + port, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

function MO(mau) {
    var re = new RegExp(mau.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    var c = edu.system.dtChucNang.find(function (x) { return re.test(x.DUONGDANFILE || ''); });
    if (!c) return 'KHÔNG thấy chức năng có DUONGDANFILE khớp "' + mau + '"';
    if (!c.TENANH || c.TENANH.indexOf('fa ') !== 0) c.TENANH = 'fa fa-angle-double-right';
    var a = document.querySelector('[id="' + c.ID + '"]') ||
        document.querySelector('#chucnang' + c.ID + ' a') ||
        document.querySelector('#chucnang' + c.ID) ||
        Array.prototype.find.call(document.querySelectorAll('#sidebar-menu a, .sidebar-menu a'), function (x) { return x.textContent.trim() === c.TENCHUCNANG.trim(); }) ||
        Array.prototype.find.call(document.querySelectorAll('#sidebar-menu a, .sidebar-menu a'), function (x) { return x.textContent.trim().indexOf(c.TENCHUCNANG.trim()) === 0; });
    if (!a) return 'KHÔNG thấy mục menu "' + c.TENCHUCNANG + '"';
    a.click();
    return 'mở ' + c.TENCHUCNANG + ' — ' + c.DUONGDANFILE;
}
function DO() {
    var sec = document.querySelector('#main-content-wrapper > section, #main-content-wrapper > *');
    var z = document.querySelector('#main-content-wrapper .zone-bus'), chuoi = [];
    for (var n = z; n && n.id !== 'main-content-wrapper'; n = n.parentElement)
        chuoi.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className ? '.' + String(n.className).trim().split(/\s+/).join('.') : ''));
    var tran = [];
    document.querySelectorAll('#main-content-wrapper *').forEach(function (e) {
        var cs = getComputedStyle(e);
        if (e.scrollWidth > e.clientWidth + 1 && cs.overflowX === 'visible' && e.clientWidth > 0 && e.getBoundingClientRect().right > innerWidth)
            tran.push((e.id || String(e.className)).slice(0, 40));
    });
    return JSON.stringify({
        breadcrumb: (document.getElementById('lblPath_ChucNang') || {}).textContent.trim().replace(/\s+/g, ' '),
        khung: '#main-content-wrapper > ' + chuoi.join(' > '),
        cssLotDa: Array.prototype.some.call(document.styleSheets, function (s) { return /ums-skin\.css/.test(s.href || ''); }),
        ngangTrang: document.documentElement.scrollWidth + '/' + document.documentElement.clientWidth,
        traRaNgoai: tran.slice(0, 8),
        vung: Array.prototype.map.call(document.querySelectorAll('#main-content-wrapper .zone-bus[id]'), function (e) { return e.id; })
    });
}

(async () => {
    let ws;
    for (let i = 0; i < 60 && !ws; i++) {
        await sleep(500);
        try { const l = await (await fetch('http://127.0.0.1:' + port + '/json')).json(); const pg = l.find(x => x.type === 'page'); if (pg) ws = new WebSocket(pg.webSocketDebuggerUrl); } catch (e) {}
    }
    await new Promise(r => ws.onopen = r);
    let id = 0; const wait = {}; const errs = [];
    ws.onmessage = m => { const d = JSON.parse(m.data);
        if (d.method === 'Runtime.exceptionThrown') { const x = d.params.exceptionDetails; errs.push(x.exception ? x.exception.description : x.text); }
        if (d.id && wait[d.id]) { wait[d.id](d); delete wait[d.id]; } };
    const cmd = (method, params) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
    const ev = async expr => { const r = await cmd('Runtime.evaluate', { expression: expr, returnByValue: true });
        if (r.result && r.result.exceptionDetails) return 'LỖI: ' + JSON.stringify(r.result.exceptionDetails.exception && r.result.exceptionDetails.exception.description);
        return r.result && r.result.result && r.result.result.value; };
    const shot = async ten => {
        const h = await ev('Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)');
        await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: Math.min(Math.max(h || 1000, 1000), 4000), deviceScaleFactor: 1, mobile: false });
        await sleep(400);
        const r = await cmd('Page.captureScreenshot', { format: 'png' });
        const f = path.join(OUT, TT + ten + '.png');
        fs.writeFileSync(f, Buffer.from(r.result.data, 'base64'));
        await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1000, deviceScaleFactor: 1, mobile: false });
        console.log('ảnh:', f);
    };
    try {
        await cmd('Runtime.enable'); await cmd('Page.enable');
        await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1000, deviceScaleFactor: 1, mobile: false });
        await cmd('Page.navigate', { url: 'http://localhost:8787/index-old.html' }); await sleep(2500);
        await ev(`sessionStorage.setItem('strChucNang', JSON.stringify({appId:${JSON.stringify(APP_ID)}, appCode:${JSON.stringify(APP_CODE)}, rootPathReport:''})); sessionStorage.setItem('strChucNang_Id','HARNESS'); location.reload(); 1`);
        await sleep(4500);
        console.log(await ev('(' + MO + ')(' + JSON.stringify(MAU) + ')'));
        await sleep(4000);
        const d = JSON.parse(await ev('(' + DO + ')()'));
        console.log(JSON.stringify(d, null, 1));
        await shot('0-mo-man');
        for (const v of d.vung) {                        // hiện lần lượt từng vùng như JS gốc làm
            await ev(`edu.util.toggle_overide("zone-bus", ${JSON.stringify(v)}); 1`);
            await sleep(900);
            await shot('vung-' + v);
        }
    } finally {
        console.log('Lỗi JS:', errs.length ? JSON.stringify(errs.slice(0, 10)) : 'không');
        ws.close(); p.kill();
        await new Promise(r => p.once('exit', r)).catch(() => {}); await sleep(800);
        try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}   // hồ sơ Edge trăm MB — luôn xoá
    }
})();
