// node tom-tat.js <6 ký tự vai trò> [...]  — tóm tắt kết quả đọc sâu: CHỈ in màn có lỗi (lời gọi lỗi, lỗi JS, không nạp được,
// chưa chuyển). Gộp lỗi trùng trong một màn. Dùng để đọc kết quả mà không phải mở cả tệp JSON.
const fs = require('fs');
const path = require('path');
const { DIR } = require('./cdp');
const ds = process.argv.slice(2);
const tep = ds.length ? ds.map(x => `ketqua-${x.slice(0, 6)}-sau.json`) : fs.readdirSync(DIR).filter(x => /^ketqua-.*-sau\.json$/.test(x));
const gon = a => Object.entries(a.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {})).map(([k, n]) => (n > 1 ? n + '× ' : '') + k);
tep.forEach(t => {
  const f = path.join(DIR, t);
  if (!fs.existsSync(f)) return console.log('?? thiếu ' + t);
  const kq = JSON.parse(fs.readFileSync(f, 'utf8'));
  const dem = {};
  const dong = [];
  kq.forEach(r => {
    dem[r.trangThai] = (dem[r.trangThai] || 0) + 1;
    const loi = [], js = [];
    (r.goi || []).filter(x => x.n === 'LOI').forEach(x => loi.push(x.action + (x.func ? ' ' + x.func.split('.').pop() : '') + ' → ' + String(x.loi || '').split('\n')[0].slice(0, 160)));
    (r.loiJS || []).forEach(x => js.push(x.slice(0, 200)));
    (r.sau || []).forEach(s => {
      (s.loi || []).forEach(x => loi.push('[' + s.buoc.split(' — ').pop() + '] ' + x.slice(0, 200)));
      (s.loiJS || []).forEach(x => js.push('[' + s.buoc.split(' — ').pop() + '] ' + x.slice(0, 200)));
    });
    if ((r.zkt || []).length) js.push('CÒN DẤU THỬ: ' + r.zkt.join(', '));
    if (r.trangThai !== 'DA_CHAY' || loi.length || js.length) {
      dong.push(`  [${r.stt}] ${r.trangThai} ${r.ten} | ${r.path}${r.ghiChu ? ' | ' + r.ghiChu : ''}`);
      gon(loi).forEach(x => dong.push('      GỌI: ' + x));
      gon(js).forEach(x => dong.push('      JS : ' + x));
    }
  });
  console.log(`\n=== ${t}: ${kq.length} màn ${JSON.stringify(dem)} — ${dong.filter(x => /^  \[/.test(x)).length} màn cần xem`);
  dong.forEach(x => console.log(x));
});
