// Xuất MAPPING chức năng trên host (ums.app.xuatMapping — nút "Xuất mapping" ở màn Cài đặt) và lưu tệp JSON.
// CHỈ ĐỌC: gọi LayDanhSachUngDung / LayDanhSachChucNang + GET tệp màn. Không bấm nút ghi nào.
//   node dangnhap.js           (đăng nhập trước)
//   node xuat-mapping.js       → _harness/gui-help/mapping-chuc-nang_<ngày>.json (danh mục chức năng, không có dữ liệu SV)
//   KIEM=1 node xuat-mapping.js  chỉ kiểm host đã có bản app.js mới chưa
const fs = require('fs');
const path = require('path');
const { connect, readTk } = require('./cdp');
(async () => {
  const tk = readTk();
  const base = tk.url.replace(/index\.aspx.*$/, '');
  const b = await connect();
  await b.goto(base + 'index.aspx#/cai-dat');
  await b.send('Page.reload', { ignoreCache: true });   // bỏ bộ nhớ đệm — trang cũ trong hồ sơ Edge còn giữ app.js bản trước
  await b.sleep(2000);
  await b.waitFor('window.ums && ums.app && document.readyState==="complete"', 30000);
  await b.sleep(2000);
  const coBanMoi = await b.ev(`!!(ums.app.xuatMapping && String(ums.app.xuatMapping).indexOf('LayDanhSachUngDung') >= 0)`);
  b.log('Host có app.js bản xuất từ CSDL: ' + (coBanMoi ? 'CÓ' : 'CHƯA'));
  if (process.env.KIEM) { b.close(); return; }
  if (!coBanMoi) { b.log('Tải _v2_capnhat lên host rồi chạy lại.'); b.close(); process.exitCode = 1; return; }
  await b.say('Xuất mapping toàn bộ chức năng trong CSDL');
  const s = await b.ev(`new Promise(function (res) {
      ums.app.xuatMapping(function (t) { window.__tienDo = t; })
        .then(function (m) { res(JSON.stringify(m, null, 2)); }, function (e) { res('LOI: ' + ((e && e.message) || e)); });
    })`, 600000);
  if (!s || s.indexOf('LOI: ') === 0) { b.log('Không xuất được: ' + s); b.close(); process.exitCode = 1; return; }
  const m = JSON.parse(s);
  const out = path.join(__dirname, '..', 'gui-help');
  fs.mkdirSync(out, { recursive: true });
  const d = new Date(), p2 = n => String(n).padStart(2, '0');
  const f = path.join(out, 'mapping-chuc-nang_' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '.json');
  fs.writeFileSync(f, s, 'utf8');
  b.log('Nguồn: ' + m.source + ' | ' + JSON.stringify(m.counts) + ' | lỗi ứng dụng: ' + m.errors.length);
  const trong = m.functions.filter(x => !x.file || !x.subsystem).length;
  b.log('Chức năng thiếu file/subsystem: ' + trong);
  b.log('Đã lưu: ' + f);
  b.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
