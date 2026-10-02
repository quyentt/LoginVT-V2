// node ghi-da-kiem.js <ApisXxx> <roleId> [roleId…]   (TU=2026-09-29 — chỉ lấy kết quả thử ghi từ ngày này)
// Ghi SỔ ĐÃ KIỂM HOST: _harness/kiem-host/da-kiem.json — để lần sau KHÔNG kiểm lại và để tien-do.py hiện lên trang tiến độ.
// Nguồn: %TEMP%/ums-kiem-host/ketqua-<6 ký tự>-sau.json (đọc sâu) + thu-ghi.json, thu-ghi-ui.json (thử ghi).
// Sổ chỉ chứa tình trạng từng màn, KHÔNG chứa dữ liệu thật. Ghi chú tay: sửa thẳng "ghiChu" / "ghi" trong sổ rồi đặt "tay": true
// (chạy lại script không ghi đè mục "tay").
//   doc: ok | loi-may-chu | loi-v2-da-sua | chua-chuyen | loi-nap
//   ghi: sach | tu-choi (máy chủ từ chối, không tạo gì) | chan (màn bắt chọn trước / kiểm ô) | khong-xoa (không có đường xoá → không thử)
//        | khong-crud (màn không dựng bằng crud — xem ghiChu) | khong-thu (cố ý, xem ghiChu) | con-sot | '' (chưa thử)
const fs = require('fs');
const path = require('path');
const { DIR } = require('./cdp');
const [app, ...roles] = process.argv.slice(2);
if (!app || !roles.length) { console.error('Thiếu tham số'); process.exit(1); }
const TU = process.env.TU || new Date().toISOString().slice(0, 10);
const tep = path.join(__dirname, 'da-kiem.json');
const so = fs.existsSync(tep) ? JSON.parse(fs.readFileSync(tep, 'utf8')) : {};
const doc = j => fs.existsSync(path.join(DIR, j)) ? JSON.parse(fs.readFileSync(path.join(DIR, j), 'utf8')) : [];
const ghi = {};
doc('thu-ghi.json').concat(doc('thu-ghi-ui.json')).filter(r => (r.luc || '') >= TU).forEach(r => { ghi[r.id] = r; });

const p = so[app] = so[app] || { man: {} };
p.ngay = process.env.NGAY || new Date().toISOString().slice(0, 10);   // NGAY=2026-09-26 — ghi bù đợt kiểm cũ
p.vaiTro = Array.from(new Set((p.vaiTro || []).concat(roles)));
roles.forEach(role => doc(`ketqua-${role.slice(0, 6)}-sau.json`).forEach(r => {
  const m = /\/modules\/([^/]+)\/html\/([^/.]+)\.html/i.exec(r.path || '');
  if (!m) return;
  const k = (m[1] + '/' + m[2]).toLowerCase();
  // Vai trò có thể gồm màn của phân hệ khác (vd Chuyên cần chứa Cổng cán bộ) → chỉ nhận màn có tệp trong _v2/<app>
  if (!fs.existsSync(path.join(__dirname, '../../_v2', app, 'Modules', m[1], 'html', m[2] + '.html'))) return;
  const cu = p.man[k] || {};
  if (cu.tay) return;
  const loi = (r.goi || []).filter(x => x.n === 'LOI').map(x => x.action + ' → ' + String(x.loi || '').split('\n').slice(0, 2).join(' ').slice(0, 120));
  (r.sau || []).forEach(s => (s.loi || []).forEach(x => loi.push(x.slice(0, 160))));
  const js = (r.loiJS || []).concat(...(r.sau || []).map(s => s.loiJS || []));
  const x = { ten: r.ten, doc: r.trangThai === 'CHUA_CHUYEN' ? 'chua-chuyen' : r.trangThai === 'LOI_NAP' ? 'loi-nap' : loi.length ? 'loi-may-chu' : js.length ? 'loi-js' : 'ok', ghi: cu.ghi || '', ghiChu: cu.ghiChu || '' };
  if (cu.loiCode) x.loiCode = cu.loiCode;   // lỗi mã còn treo (loi-code.js) — giữ nguyên qua các lần ghi sổ
  if (cu.lichSu) x.lichSu = cu.lichSu;
  if (loi.length) x.loi = Array.from(new Set(loi));
  if (js.length) x.loiJS = Array.from(new Set(js.map(t => t.slice(0, 160))));
  const g = ghi[r.id];
  if (g) {
    const b = (g.buoc || []).join(' § ');
    x.ghi = g.conSot ? 'con-sot' : /Đã xoá/.test(b) ? 'sach' : g.khongXoa || /không khai remove/.test(b) ? 'khong-xoa' : /LỖI thêm/.test(b) ? 'tu-choi'
      : /Lưu không gửi/.test(b) ? 'chan' : /danh sách người/.test(b) ? 'khong-thu' : /Không có khung crud|không có nút/i.test(b) ? 'khong-crud' : (x.ghi || '');
    if (x.ghi === 'sach') x.thaoTac = /OK sửa/.test(b) ? 'thêm, sửa, xoá' : 'thêm, xoá';
    if (x.ghi === 'tu-choi') x.ghiChu = x.ghiChu || (b.match(/LỖI thêm: ([^§]*)/) || ['', ''])[1].trim().slice(0, 200);
    if (x.ghi === 'chan') x.ghiChu = x.ghiChu || (b.match(/toast: ([^§]*)/) || ['', ''])[1].trim().slice(0, 200);
  }
  p.man[k] = x;
}));
fs.writeFileSync(tep, JSON.stringify(so, null, 1) + '\n');
const dem = {};
Object.values(p.man).forEach(x => { dem['doc:' + x.doc] = (dem['doc:' + x.doc] || 0) + 1; dem['ghi:' + (x.ghi || 'chua')] = (dem['ghi:' + (x.ghi || 'chua')] || 0) + 1; });
console.log(app, Object.keys(p.man).length, 'màn', JSON.stringify(dem));
