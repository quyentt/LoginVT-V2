// KIỂM THỬ TRỰC TIẾP TRÊN HOST — lái Edge CÓ CỬA SỔ (toàn màn hình, hồ sơ riêng, cổng 9333)
// qua DevTools Protocol. CHỈ ĐỌC: không bấm Thêm/Lưu/Xoá/Cập nhật/Duyệt/Gửi/Import.
//   node dangnhap.js                        mở Edge (nếu chưa mở), đăng nhập, in vai trò
//   node menu.js <roleId>                   in cây chức năng của vai trò
//   node man.js <roleId> <cnId>             thử một màn
//   node chay-vaitro.js <roleId> [tuCnId]   chạy mọi màn của vai trò → ketqua-<role>.json
// Tài khoản: tk.md (dòng 1 có URL trong ngoặc tròn, dòng "user:" và "pass:") đặt ở thư mục
// này hoặc _v2/tk.md. Kết quả + ảnh (CÓ DỮ LIỆU THẬT) ghi ra %TEMP%/ums-kiem-host, ngoài dự án.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const DIR = path.join(os.tmpdir(), 'ums-kiem-host');
const SHOT = path.join(DIR, 'anh');
fs.mkdirSync(SHOT, { recursive: true });
const LOG = path.join(DIR, 'nhatky.txt');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function coEdge() { try { await fetch('http://127.0.0.1:9333/json/version'); return true; } catch (e) { return false; } }
async function ensureEdge(url) {
  if (await coEdge()) return;
  spawn(EDGE, ['--remote-debugging-port=9333', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--user-data-dir=' + path.join(DIR, 'edge-profile'),
    '--no-first-run', '--start-maximized', url || 'about:blank'], { detached: true, stdio: 'ignore' }).unref();
  for (let i = 0; i < 30; i++) { if (await coEdge()) return; await new Promise(r => setTimeout(r, 500)); }
  throw new Error('Không mở được Edge ở cổng 9333');
}

function readTk() {
  const f = [path.join(__dirname, 'tk.md'), path.join(__dirname, '../../_v2/tk.md')].find(x => fs.existsSync(x));
  if (!f) throw new Error('Thiếu tk.md (tài khoản host)');
  const t = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  const url = (t[0].match(/\((https?:[^)]+)\)/) || [])[1];
  const get = k => { const l = t.find(x => x.trim().toLowerCase().startsWith(k + ':')); return l ? l.slice(l.indexOf(':') + 1).trim() : ''; };
  return { url, user: get('user'), pass: get('pass') };
}

async function connect() {
  await ensureEdge();
  const list = await (await fetch('http://127.0.0.1:9333/json')).json();
  // CHỈ bám thẻ đang ở trên HOST của tk.md; không có thì mở thẻ MỚI. Trước 2026-09-28 lấy thẻ đầu tiên bất kể trang nào
  // → từng bám nhầm thẻ trang khác người dùng đang mở trong cùng cửa sổ Edge (localhost:3001) và điều hướng nó.
  const gocHost = ((readTk().url || '').match(/^https?:\/\/[^/]+/) || [''])[0];
  let pg = list.find(x => x.type === 'page' && gocHost && x.url.indexOf(gocHost) === 0);
  if (!pg) pg = await (await fetch('http://127.0.0.1:9333/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(pg.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const wait = {};
  const loiJS = [];
  ws.onmessage = m => {
    const d = JSON.parse(m.data);
    if (d.id && wait[d.id]) { wait[d.id](d); delete wait[d.id]; return; }
    if (d.method === 'Runtime.exceptionThrown') { const x = d.params.exceptionDetails; loiJS.push((x.exception && x.exception.description || x.text || '').split('\n').slice(0, 2).join(' ') + ' @' + (x.url || '').split('/').pop() + ':' + x.lineNumber); }
    if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') loiJS.push('[' + d.params.entry.source + '] ' + d.params.entry.text.slice(0, 200) + ' ' + (d.params.entry.url || '').split('/').pop());
  };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) throw new Error('JS: ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text));
    return r.result?.result?.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let n = 0;
  const api = {
    send, ev, sleep,
    log(s) { const l = new Date().toLocaleTimeString('vi-VN') + '  ' + s; console.log(l); fs.appendFileSync(LOG, l + '\n'); },
    // Dòng chữ ở góc màn cho người xem biết đang làm gì
    async say(s) {
      api.log(s);
      await ev(`(function(){var b=document.getElementById('__buoc');if(!b){b=document.createElement('div');b.id='__buoc';b.style.cssText='position:fixed;z-index:2147483647;right:12px;bottom:12px;max-width:460px;background:#b00020;color:#fff;font:600 14px/1.4 system-ui;padding:8px 12px;border-radius:6px;box-shadow:0 2px 8px #0005;pointer-events:none';document.body.appendChild(b);}b.textContent=${JSON.stringify('🤖 ' + s)};})()`).catch(() => {});
    },
    async goto(url) { await send('Page.navigate', { url }); await sleep(1500); await api.waitFor('document.readyState==="complete"', 30000); },
    async waitFor(expr, ms = 20000) {
      const t = Date.now();
      while (Date.now() - t < ms) { try { if (await ev(expr)) return true; } catch (e) {} await sleep(300); }
      return false;
    },
    // Viền đỏ phần tử rồi mới bấm
    async click(sel, s) {
      if (s) await api.say(s);
      const ok = await ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return false;e.scrollIntoView({block:'center'});e.style.outline='3px solid #e00';e.style.outlineOffset='2px';return true;})()`);
      if (!ok) throw new Error('Không thấy ' + sel);
      await sleep(250);
      await ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});e.style.outline='';e.click();})()`);
      await sleep(200);
    },
    async shot(name) {
      const r = await send('Page.captureScreenshot', { format: 'png' });
      const f = path.join(SHOT, String(++n).padStart(3, '0') + '_' + name.replace(/[^\w\-]+/g, '_') + '.png');
      fs.writeFileSync(f, Buffer.from(r.result.data, 'base64'));
      return f;
    },
    // Bộ ghi lời gọi: bọc ums.api.call / ums.api.json, đếm số dòng trả về
    async hook() {
      return ev(`(function(){
        if (!window.ums || !ums.api || ums.api.__hook) return !!(window.ums&&ums.api&&ums.api.__hook);
        window.__nk = []; window.__bay = 0; var A = ums.api;
        function rec(o, r, err) {
          var d = r && r.data, n = Array.isArray(d) ? d.length : (d && Array.isArray(d.rs) ? d.rs.length : (d == null ? 0 : (typeof d === 'object' ? 'obj' : 1)));
          var p = {}; Object.keys(o || {}).forEach(function (k) { if (!/^(action|func|iM|method|silent|timeout|strChucNang_Id|strNguoiThucHien_Id|strVaiTroDangNhap_Id|strChucNangHeThong_Id|strNguoiThucVai_Id)$/.test(k)) p[k] = o[k]; });
          __nk.push({ t: Date.now(), hash: location.hash, action: o.action, func: o.func || '', p: p, n: err ? 'LOI' : n, loi: err ? String(err.message) : '', cot: (Array.isArray(d) && d[0]) ? Object.keys(d[0]).join(',') : '' });
        }
        var c = A.call; A.call = function (o) { __bay++; return c.apply(this, arguments).then(function (r) { __bay--; rec(o, r); return r; }, function (e) { __bay--; rec(o, null, e); throw e; }); };
        var j = A.json; A.json = function (a, b, o) { __bay++; return j.apply(this, arguments).then(function (r) { __bay--; rec({ action: a }, r); return r; }, function (e) { __bay--; rec({ action: a }, null, e); throw e; }); };
        A.__hook = 1; return true;
      })()`);
    },
    // Chờ tới khi không còn lời gọi nào đang bay (liền 250ms), tối đa ms
    async idle(ms = 10000) {
      const t = Date.now(); let yen = 0;
      while (Date.now() - t < ms) { const n = await ev('window.__bay||0').catch(() => 0); if (!n) { if (++yen >= 2) return true; } else yen = 0; await sleep(150); }
      return false;
    },
    takeErrors() { return loiJS.splice(0); },
    takeLog() { return ev(`(function(){var x=window.__nk||[];window.__nk=[];return x;})()`); },
    close() { ws.close(); }
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  // Thẻ bị che / cửa sổ thu nhỏ / có DevTools mở cạnh → trình duyệt BÓP đồng hồ (setTimeout mỗi phút một lần), màn đứng im như treo
  // (gặp 29/9). Đưa thẻ lên trước + giả lập luôn có tiêu điểm để đồng hồ chạy bình thường.
  await Promise.race([send('Page.bringToFront'), new Promise(r => setTimeout(r, 3000))]);
  await Promise.race([send('Emulation.setFocusEmulationEnabled', { enabled: true }), new Promise(r => setTimeout(r, 3000))]);
  return api;
}
module.exports = { connect, readTk, ensureEdge, DIR };
