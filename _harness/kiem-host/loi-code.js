// SỔ LỖI MÃ (_v2) phát hiện khi kiểm host — nằm trong da-kiem.json, trường "loiCode" của từng màn.
//   node loi-code.js ds                                       — danh sách còn treo, XẾP ƯU TIÊN: chờ kiểm lại trước, rồi tới cần sửa
//   node loi-code.js them   <ApisXxx> <module/tep> "<mô tả>"   — ghi lỗi mới, tình trạng "cần sửa"
//   node loi-code.js da-sua <ApisXxx> <module/tep> ["<đã sửa gì>"] — đã sửa mã, CHỜ up + kiểm lại trên host
//   node loi-code.js xong   <ApisXxx> <module/tep>             — kiểm lại trên host ĐẠT → gỡ khỏi sổ (ghi một dòng vào "lichSu")
// Luật (người dùng 2026-09-29): màn lỗi mã phải ghi chú + yêu cầu sửa; lần kiểm host sau làm các màn trong "ds" TRƯỚC;
// kiểm thành công thì gỡ. Trang tien-do.html hiện cột "Lỗi mã" từ sổ này (chạy lại python _harness/tien-do.py).
const fs = require('fs');
const path = require('path');
const tep = path.join(__dirname, 'da-kiem.json');
const so = fs.existsSync(tep) ? JSON.parse(fs.readFileSync(tep, 'utf8')) : {};
const [lenh, app, k0, moTa] = process.argv.slice(2);
const homNay = new Date().toISOString().slice(0, 10);
const luu = () => fs.writeFileSync(tep, JSON.stringify(so, null, 1) + '\n');
const TT = { 'cho-kiem': 'ĐÃ SỬA — chờ kiểm lại', 'can-sua': 'CẦN SỬA' };

if (lenh === 'ds' || !lenh) {
  const ds = [];
  Object.keys(so).forEach(a => Object.keys(so[a].man || {}).forEach(k => (so[a].man[k].loiCode || []).forEach(l => ds.push({ a, k, ten: so[a].man[k].ten || '', vaiTro: (so[a].vaiTro || [])[0] || '', l }))));
  ds.sort((x, y) => (x.l.tt === 'cho-kiem' ? 0 : 1) - (y.l.tt === 'cho-kiem' ? 0 : 1) || x.a.localeCompare(y.a));
  if (!ds.length) console.log('Không còn lỗi mã nào treo.');
  ds.forEach(x => console.log(`[${TT[x.l.tt]}] ${x.a} ${x.k} (${x.ten}) · vai trò ${x.vaiTro.slice(0, 6)} · ghi ${x.l.ngay}\n    Lỗi: ${x.l.moTa}${x.l.sua ? '\n    Đã sửa: ' + x.l.sua + ' (' + x.l.ngaySua + ')' : ''}`));
  process.exit(0);
}
if (!app || !k0) { console.error('Thiếu <ApisXxx> <module/tep>'); process.exit(1); }
const k = k0.toLowerCase();
const p = so[app] = so[app] || { man: {}, ngay: homNay };
const m = p.man[k] = p.man[k] || { ten: '', doc: '', ghi: '', ghiChu: '' };
m.loiCode = m.loiCode || [];
if (lenh === 'them') {
  if (!moTa) { console.error('Thiếu mô tả lỗi'); process.exit(1); }
  m.loiCode.push({ ngay: homNay, moTa, tt: 'can-sua' });
} else if (lenh === 'da-sua') {
  const l = m.loiCode.filter(x => x.tt === 'can-sua');
  if (!l.length) { console.error('Màn này không có lỗi nào đang "cần sửa"'); process.exit(1); }
  l.forEach(x => { x.tt = 'cho-kiem'; x.ngaySua = homNay; if (moTa) x.sua = moTa; });
} else if (lenh === 'xong') {
  if (!m.loiCode.length) { console.error('Màn này không có lỗi mã nào trong sổ'); process.exit(1); }
  m.lichSu = (m.lichSu || []).concat(m.loiCode.map(x => `${x.ngay} lỗi mã: ${x.moTa} → sửa ${x.ngaySua || '?'}, kiểm lại đạt ${homNay}`));
  delete m.loiCode;
} else { console.error('Lệnh không rõ: ' + lenh); process.exit(1); }
luu();
console.log('Đã ghi:', app, k, lenh);
