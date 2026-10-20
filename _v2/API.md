# API tầng chung `_v2` — SINH TỰ ĐỘNG từ chú thích trong mã

Chạy lại: `python _harness\sinh-api.py` (sau mỗi lần sửa `_v2/assets/js/*.js`). KHÔNG sửa tay tệp này — sửa chú thích đầu hàm trong mã.
Chuyển màn: đọc tệp này (tìm theo tên hàm) thay vì mở mã tầng chung. Tuỳ chọn của `ums.crud` nằm ở khối đầu `crud.js`.
Lớp CSS có sẵn: `_v2/CLASS.md`. Tóm tắt màn gốc: `python _harness\tom-tat-goc.py <html> [js]`.

## Mục lục

- **api.js** (10 hàm): `ums.api.call`, `ums.api.json`, `ums.api.call`, `ums.api.all`, `ums.api.dm`, `ums.api.handle`, `ums.util.xorB64`, `ums.util.unXor`, `ums.util.ngaySinh`, `ums.util.uuid`
- **ui.js** (46 hàm): `ums.ui.escBr`, `ums.ui.money`, `ums.ui.so`, `ums.ui.docSo`, `ums.ui.truot`, `ums.ui.moDetails`, `ums.ui.ngayGio`, `ums.ui.empty`, `ums.ui.btn`, `ums.ui.iconBtn`, `ums.ui.actions`, `ums.ui.badge`, `ums.ui.chips`, `ums.ui.tabs`, `ums.ui.tabsActive`, `ums.ui.tile`, `ums.ui.cell`, `ums.ui.meter`, `ums.ui.table`, `ums.ui.sortRows`, `ums.ui.oTheoGoc`, `ums.ui.pagerBind`, `ums.ui.pager`, `ums.ui.options`, `ums.ui.filterInput`, `ums.ui.filterSelect`, `ums.ui.field`, `ums.ui.toast`, `ums.ui.confirm`, `ums.ui.xoaChon`, `ums.ui.dialog`, `ums.ui.batch`, `ums.ui.print`, `ums.ui.fail`, `ums.ui.datepicker`, `ums.ui.select2`, `ums.ui.hoverCard`, `ums.ui.file`, `ums.ui.enhance`, `ums.ui.khoangNgay`, `ums.ui.chart`, `ums.ui.reveal`, `ums.ui.swap`, `ums.ui.taiTep`, `ums.ui.xuatXls`, `ums.ui.napXLSX`
- **crud.js** (1 hàm): `ums.crud`
- **patterns.js** (46 hàm): `ums.pat.num`, `ums.pat.money`, `ums.pat.page`, `ums.pat.panel`, `ums.pat.filterBar`, `ums.pat.fill`, `ums.pat.chain`, `ums.pat.haiLuoi`, `ums.pat.loc`, `ums.pat.dmTitle`, `ums.pat.val`, `ums.pat.checks`, `ums.pat.matrix`, `ums.pat.formTrang`, `ums.pat.pivot`, `ums.pat.master`, `ums.pat.masterItem`, `ums.pat.cards`, `ums.pat.groupTable`, `ums.pat.footSum`, `ums.pat.cardRow`, `ums.pat.pickSinhVien`, `ums.pat.pickSinhVienNganh`, `ums.pat.pickNhanSu`, `ums.pat.xacNhanChiTiet`, `ums.pat.sections`, `ums.pat.rows`, `ums.pat.phamVi`, `ums.pat.diaChi`, `ums.pat.chonPhamVi`, `ums.pat.emailHopLe`, `ums.pat.guiEmail`, `ums.pat.soDo`, `ums.pat.anhNguoi`, `ums.pat.dsNhanSuLoc`, `ums.pat.dsNhanSu`, `ums.pat.cotTrai`, `ums.pat.noCo`, `ums.pat.dauDoiTuong`, `ums.pat.datNoCo`, `ums.pat.datDau`, `ums.pat.thanhThu`, `ums.pat.datDaChon`, `ums.pat.datTongTab`, `ums.pat.masterNhanSu`, `ums.pat.boLocNguoiHoc`
- **ref.js** (18 hàm): `ums.ref.heDaoTao`, `ums.ref.khoaDaoTao`, `ums.ref.chuongTrinh`, `ums.ref.lopQuanLy`, `ums.ref.hocPhan`, `ums.ref.thoiGianDaoTao`, `ums.ref.khoaQuanLy`, `ums.ref.coCauToChuc`, `ums.ref.nhanSu`, `ums.ref.nhanSuPage`, `ums.ref.tenNhanSu`, `ums.ref.xoaQuyetDinhKem`, `ums.ref.quaTrinhCuoiCung`, `ums.ref.sinhVien`, `ums.ref.sinhVienPage`, `ums.ref.dm`, `ums.ref.cascade`, `ums.ref.cascadeQuyen`
- **report.js** (10 hàm): `ums.report.navigate`, `ums.report.mount`, `ums.report.run`, `ums.report.taiBangNhap`, `ums.report.nhapBangTuTep`, `ums.report.importChung`, `ums.upload`, `ums.queue.mount`, `ums.files.mount`, `ums.files.avatar`
- **editor.js** (5 hàm): `ums.editor.sanSang`, `ums.editor.tao`, `ums.editor.donDep`, `ums.editor.toan`, `ums.editor.html`
- **lamtruoc.js** (7 hàm): `ums.lamTruoc.batDau`, `ums.lamTruoc.danhMucRong`, `ums.lamTruoc.sauGoi`, `ums.lamTruoc.can`, `ums.lamTruoc.neuRong`, `ums.lamTruoc.layDanhMucCho`, `ums.lamTruoc.giuViTri`
- **app.js** (6 hàm): `ums.app.openPath`, `ums.app.openHash`, `ums.app.timManTheoDuongDan`, `ums.app.hrefChucNang`, `ums.app.soanBaiChoPhep`, `ums.app.xuatMapping`
- **session.js** (2 hàm): `ums.session.init`, `ums.session.logout`
- **can-quyet.js** (1 hàm): `ums.canQuyetKhoa`
- **diemhoc.js** (0 hàm): 
- **lich.js** (0 hàm): 
- **phieu.js** (2 hàm): `ums.phieu.neutral`, `ums.phieu.viewer`
- **thuvai.js** (6 hàm): `ums.thuVai.hienTai`, `ums.thuVai.ap`, `ums.thuVai.bo`, `ums.thuVai.chon`, `ums.thuVai.theHtml`, `ums.thuVai.tuDong`
- **scroll.js** (1 hàm): `ums.scroll.refresh`
- **icon-fa4.js** (1 hàm): `ums.iconFA4`

---

## api.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.api — tầng gọi API
   Bản viết lại của `edu.system.makeRequest` (Core/systemroot.js:577), giữ
   NGUYÊN giao thức để nói chuyện được với các microservice đang chạy:

     · action dạng  <PREFIX>_<Controller>/<method đã mã hoá>
       PREFIX tra trong Init_API() ra base URL của microservice
     · func là tên procedure PL/SQL, gửi trong payload
     · khi có iM: body bọc thành { A: AE(json, <phần sau dấu / của action>) }
       và kết quả trả về ở dạng { Data: { B: <chuỗi mã hoá> } }, giải bằng AD
     · xác thực bằng header Authorization: Bearer <tokenJWT>
     · tự chèn strChucNang_Id, strNguoiThucHien_Id, strVaiTroDangNhap_Id,
       strChucNangHeThong_Id, strNguoiThucVai_Id — chỉ khi màn hình để trống
       (bản gốc kiểm tra `if (!x)`, nên chuỗi rỗng cũng bị thay)
     · thân request là form-urlencoded, đúng như $.ajax({ data: {...} }) của
       bản gốc — KHÔNG phải JSON
     · chỉ mã hoá khi lời gọi có `func` (kiểu procedure). Action kiểu cũ như
       `TC_HoaDon/LayDanhSach` đi thẳng, không bọc { A: … } — bản gốc cũng
       chỉ mã hoá khi màn hình tự truyền iM, và toàn bộ lời gọi có func
       trong ApisTaiChinh đều truyền iM.

   Khác bản gốc ở ba điểm, đều có chủ đích:
     1. Trả Promise thay vì callback lồng nhau
     2. Không có hàng đợi tự chế (bản gốc chặn khi quá 10 request đồng thời)
     3. Lỗi ném ra ngoài để màn hình tự quyết, không tự bật alert

   Chế độ dữ liệu dựng thử (ums.state.mode = 'demo'): không gọi mạng, tra
   `ums.demo.fixtures` theo `func`, rồi theo `action`, rồi theo
   `action#strMaBangDanhMuc`. Không có thì trả mảng rỗng.
```

</details>

### `ums.api.call(opts)`  <sub>api.js:74</sub>

```text
ums.api.call({ action, func, ...tham số })

Trả Promise:
  resolve → { data, pager, raw }
  reject  → Error kèm .status, .action, .payload

Tuỳ chọn thêm (không gửi lên máy chủ):
  method   'POST' | 'GET'   mặc định POST
  silent   true = không hiện chỉ báo đang tải
  timeout  mili giây, mặc định 120000
```

### `ums.api.json(action, body, opts)`  <sub>api.js:216</sub>

```text
Gửi THÂN JSON nguyên văn — dùng cho các API nhận JSON của bản gốc
(`contentType2: 'application/json', data: JSON.stringify(obj)`), vd
SYS_Report/ThemMoi, SYS_Report/AllTable_Element, SYS_Import/SImport.
Bản gốc gán tham số hệ thống lên một CHUỖI nên không có tác dụng — ở
đây cũng không chèn gì, không mã hoá. Trả { data, pager, message, raw }.
    ums.api.json('SYS_Report/ThemMoi', { arrTuKhoa: [...], … })
```

### `ums.api.call(opts)`  <sub>api.js:252</sub>

_(chưa có chú thích trong mã)_

### `ums.api.all(list)`  <sub>api.js:263</sub>

```text
 Gọi nhiều lời gọi song song, trả mảng kết quả theo đúng thứ tự 
```

### `ums.api.dm(code, sortBy)`  <sub>api.js:274</sub>

_(chưa có chú thích trong mã)_

### `ums.api.handle(err, where)`  <sub>api.js:385</sub>

_(chưa có chú thích trong mã)_

### `ums.util.xorB64(chuoi, khoa)`  <sub>api.js:421</sub>

_(chưa có chú thích trong mã)_

### `ums.util.unXor(b64, khoa)`  <sub>api.js:427</sub>

_(chưa có chú thích trong mã)_

### `ums.util.ngaySinh(ngay, thang, nam, maMuc)`  <sub>api.js:440</sub>

```text
 NGÀY SINH ba ô Ngày / Tháng / Năm (+ mức độ chính xác) — KIỂM TRƯỚC KHI GỬI (người dùng 2026-09-30; bản gốc ghép thẳng
"ngày/tháng/năm", ô trống thành "//" và máy chủ trả ORA-20001).
ums.util.ngaySinh(ngay, thang, nam, maMuc) → { loi, chuoi, ngay, thang, nam }
maMuc  'EXACT' | 'MONTH_ONLY' | 'YEAR_ONLY' | 'UNKNOWN' | '' (không rõ mức: suy theo ô nào có giá trị)
loi    '' nếu hợp lệ, không thì câu báo cho người nhập
chuoi  'dd/mm/yyyy' khi đủ ngày-tháng-năm; các trường hợp khác là '' (KHÔNG gửi "//2000")
ngay / thang / nam  số đã chuẩn hoá; phần không thuộc mức độ đang chọn trả '' (ô đang ẩn không gửi giá trị cũ)
Không nhập gì cả là hợp lệ (ngày sinh không bắt buộc). 
```

### `ums.util.uuid()`  <sub>api.js:466</sub>

_(chưa có chú thích trong mã)_


---

## ui.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.ui — tầng component cho JavaScript
   Mọi chỗ sinh markup đều đi qua đây, để giao diện không rã ra theo thời
   gian. Hàm trả về CHUỖI nên dùng được ngay bên trong hàm render của bảng.

   Không phụ thuộc jQuery (trừ hai hàm gắn select2), không phụ thuộc lớp
   class nào của giao diện cũ.
```

</details>

### `ums.ui.escBr(v)`  <sub>ui.js:30</sub>

```text
 Nhiều cột của hệ cũ chứa sẵn thẻ <br> trong DỮ LIỆU (vd THOIGIANCHITIET
của lớp học phần: "Tu 29/06 den 12/07:<br>Thu 3 tiet 4,5,6…"). Bản gốc
trả thẳng vào HTML nên xuống dòng; ở đây escape hết nên người dùng nhìn
thấy chữ "<br>". Hàm này escape như thường rồi TRẢ LẠI đúng thẻ <br> —
không mở cửa cho HTML tuỳ ý từ máy chủ. 
```

### `ums.ui.money(n, o)`  <sub>ui.js:51</sub>

```text
 Số tiền hiển thị — theo site.config.js `money` (chốt 2026-09-26: dấu PHẨY ngăn nghìn, 0 số lẻ; đổi sang
USD thì sửa cấu hình, xem ghi chú ở đó). Mọi chỗ hiện tiền dùng hàm này, không tự toLocaleString. 
```

### `ums.ui.so(n)`  <sub>ui.js:60</sub>

```text
 Số đếm (sinh viên, lớp, bản ghi…) — cùng kiểu ngăn nghìn với tiền cho thống nhất, không số lẻ 
```

### `ums.ui.docSo(n)`  <sub>ui.js:70</sub>

```text
 Đọc số tiền thành chữ — thư viện n2vi của chính dự án gốc, nay nạp ở
assets/vendor/n2vi. Hệ cũ gọi to_vietnamese(n) rồi viết hoa chữ đầu và
thêm dấu chấm; giữ đúng vậy để bản in không lệch với hệ đang chạy. 
```

### `ums.ui.truot(el, mo, xong)`  <sub>ui.js:85</sub>

```text
 ---------- MỞ / ĐÓNG CÓ TRƯỢT --------------------------------------
ums.ui.truot(el, mo, xong)  — trượt mở (mo = true) hoặc trượt đóng.
Đo chiều cao thật rồi chạy bằng Web Animations nên không phải khai
max-height ước lượng trong CSS (ước lượng sai thì hoặc giật, hoặc cắt
mất nội dung). Tôn trọng prefers-reduced-motion: tắt hiệu ứng thì đổi
trạng thái ngay. Hàm gọi tự lo việc thêm / bỏ lớp mở:
el.classList.add('is-open'); ui.truot(el, true);
ui.truot(el, false, function () { el.classList.remove('is-open'); });  
```

### `ums.ui.moDetails(det, mo)`  <sub>ui.js:108</sub>

```text
 ---------- <details> : trượt + đàn xếp ------------------------------
Mọi vùng thu gọn viết bằng <details><summary> (bảng điểm theo học kỳ,
nhóm trong màn…) đều đi qua đây:
· mở / đóng có trượt như nhóm menu ở cột trái;
· behavior.accordion (mặc định bật): mở một cái thì đóng các <details>
CÙNG CẤP; tắt trong Cài đặt giao diện thì mở được nhiều cái.
Gắn một trình xử lý ở document nên màn hình không phải khai gì thêm. 
```

### `ums.ui.ngayGio(v, o)`  <sub>ui.js:147</sub>

```text
 ---------- NGÀY GIỜ ------------------------------------------------
ums.ui.ngayGio(v) → "dd/MM/yyyy HH:mm" (bỏ phần giờ khi không có).
Máy chủ trả ngày ở nhiều dạng tuỳ procedure: "13/09/2026",
"13/09/2026 09:12:33", ISO "2026-09-13T09:12:00", hoặc đã là chữ
("vừa xong"). Hàm này chỉ CHUẨN HOÁ những dạng nhận ra được và trả
nguyên văn khi không nhận ra — không bao giờ làm mất dữ liệu gốc. 
```

### `ums.ui.empty(msg, icon)`  <sub>ui.js:163</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.btn(kind, opts)`  <sub>ui.js:198</sub>

```text
 ums.ui.btn('add', { text: 'Mở kế hoạch mới', attr: {...} }) 
```

### `ums.ui.iconBtn(kind, id)`  <sub>ui.js:240</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.actions(id, kinds)`  <sub>ui.js:248</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.badge(text, tone)`  <sub>ui.js:253</sub>

```text
 ---------- Nhãn trạng thái ------------------------------------------ 
```

### `ums.ui.chips(list, activeKey)`  <sub>ui.js:259</sub>

```text
 ---------- Chip lọc -------------------------------------------------- 
```

### `ums.ui.tabs(list, active, attr)`  <sub>ui.js:272</sub>

```text
 ---------- Dải tab --------------------------------------------------
ums.ui.tabs([{ key, text, icon }], 'keyĐangMở', 'data-ktab')
→ '<div class="ums-tabs">…</div>'; màn tự nghe click trên [data-ktab]
và gọi ums.ui.tabsActive(host, key) để đổi tab đang sáng. 
```

### `ums.ui.tabsActive(host, key, attr)`  <sub>ui.js:279</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.tile(t)`  <sub>ui.js:287</sub>

```text
 ---------- Thẻ vai trò / phân hệ ------------------------------------- 
```

### `ums.ui.cell(title, sub)`  <sub>ui.js:297</sub>

```text
 ---------- Ô trong bảng ---------------------------------------------- 
```

### `ums.ui.meter(value, max, label)`  <sub>ui.js:302</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.table(cfg)`  <sub>ui.js:316</sub>

```text
 ---------- BẢNG ------------------------------------------------------
Sinh cả <table>, <thead>, <tbody> và phân trang, nên đổi giao diện
bảng cho toàn hệ thống chỉ cần sửa hàm này.

cfg = { el, columns:[{title, prop|render(row,i), cls, width, group?:[…]}], rows,
stt, page:{index,size,total,onChange}, empty, tableCls }
```

### `ums.ui.sortRows(rows, c, dir)`  <sub>ui.js:459</sub>

```text
 Sắp xếp mảng dòng theo một cột của ums.ui.table (đi cùng cfg.sort). Giá trị so: c.sortVal(row) nếu có, không thì
row[c.prop], không nữa thì chữ thuần của c.render(row). Ô trống luôn cuối; cột toàn số so theo số; còn lại so chữ
tiếng Việt, số tự nhiên (CE1.2 < CE1.10). Ổn định: bằng nhau giữ thứ tự gốc. col < 0 → trả bản sao nguyên thứ tự. 
```

### `ums.ui.oTheoGoc(row)`  <sub>ui.js:481</sub>

```text
 Các ô của một dòng theo thứ tự cột GỐC: các ô đã dời xuống cuối bảng (ô chọn dòng, Thao tác —
data-cot-goc) được đặt lại về vị trí màn khai. Dùng ở nơi đọc ô theo chỉ số. 
```

### `ums.ui.pagerBind(host, page)`  <sub>ui.js:494</sub>

```text
 Gắn sự kiện cho thanh phân trang vừa vẽ — số trang (data-go) và số dòng
mỗi trang (data-size). Mọi nơi vẽ ums.ui.pager đều gọi hàm này để không
chỗ nào quên gắn một trong hai. 
```

### `ums.ui.pager(page, shown)`  <sub>ui.js:520</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.options(data, cfg)`  <sub>ui.js:593</sub>

```text
 ---------- Biểu mẫu --------------------------------------------------- 
```

### `ums.ui.filterInput(label, opts)`  <sub>ui.js:624</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.filterSelect(label, data, opts)`  <sub>ui.js:634</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.field(label, control, opts)`  <sub>ui.js:645</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.toast(msg, tone, opts)`  <sub>ui.js:682</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.confirm(msg, opts)`  <sub>ui.js:742</sub>

```text
 ---------- Hộp xác nhận ------------------------------------------------
Thay cho edu.system.confirm + $("#btnYes").click(...) của hệ cũ — cách
cũ gắn thêm một trình xử lý mỗi lần mở hộp, bấm lần thứ ba là xoá ba
lần. Ở đây trả Promise<boolean>, mỗi lần mở là một hộp mới.

ums.ui.confirm('Xoá 3 dòng đã chọn?', { tone: 'bad', ok: 'Xoá' })
.then(function (yes) { if (yes) … });                        
```

### `ums.ui.xoaChon(chon, o)`  <sub>ui.js:810</sub>

```text
 ---------- Nút "Xoá đã chọn" cho mọi chỗ xoá NHIỀU dòng ------------------
Cùng vẻ với nút của ums.crud (.ums-btn--delsel): chưa chọn gì thì mờ và
khoá; có dòng được đánh dấu thì viền đỏ + chữ "Xoá N dòng đã chọn".
Nút tự đếm — màn không phải gắn gì:

ums.ui.xoaChon('input[data-ck]', { attr: { 'data-a': 'xoa' } })

chon  bộ chọn các ô đánh dấu dòng (ô trong <thead> — "chọn tất cả" — không tính)
o.goc    bộ chọn KHUNG chứa gần nhất làm gốc đếm (vd '.ums-panel' khi nút nằm ở
đầu một khung có bảng riêng)
o.trong  bộ chọn vùng chứa bảng (tìm từ gốc) khi một gốc có nhiều bảng cùng kiểu ô
o.text   chữ nút (mặc định "Xoá đã chọn"; có số thì "<text> (N)")
Gốc đếm = hộp thoại chứa nút, không thì phần tử gần nhất có id (gốc màn).
Xoá MỘT dòng (thùng rác trên dòng, Xoá trong biểu mẫu) giữ nút đỏ thường. 
```

### `ums.ui.dialog(o)`  <sub>ui.js:885</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.batch(calls, opts)`  <sub>ui.js:946</sub>

```text
 ---------- Chạy hàng loạt kèm tiến độ -----------------------------------
Thay cặp edu.system.genHTML_Progress(zone, n) + start_Progress(zone, cb)
của hệ cũ (hệ cũ bắn n request cùng lúc rồi đếm complete). Ở đây chạy
tuần tự (hoặc `concurrency` luồng), hiện hộp tiến độ, cuối cùng báo gộp.

ums.ui.batch(calls, { title: 'Đang lưu hệ số' })
.then(function (r) { r.ok, r.fail, r.errors; me.reload(); });

`calls` là mảng tham số cho ums.api.call, hoặc mảng hàm trả Promise.
Không bao giờ reject — lỗi từng lời gọi nằm trong r.errors. Hết phiên
(401) thì dừng và đăng xuất như ums.api.handle.                        
```

### `ums.ui.print(what, opts)`  <sub>ui.js:1009</sub>

```text
 ---------- In ----------------------------------------------------------
Thay edu.util.printHTML(divId) (Core/util.js:40): mở cửa sổ mới chỉ
chứa nội dung cần in. Nhận id, phần tử, hoặc chuỗi HTML.
`css` thêm kiểu riêng cho bản in (mẫu phiếu thu, hoá đơn…).          
```

### `ums.ui.fail(msg, retryAttr)`  <sub>ui.js:1033</sub>

```text
 Khối báo lỗi đặt trong vùng nội dung, kèm nút thử lại 
```

### `ums.ui.datepicker(sel, opts)`  <sub>ui.js:1044</sub>

```text
 ---------- Gắn thư viện ngoài ----------------------------------------- 
```

### `ums.ui.select2(sel, opts)`  <sub>ui.js:1128</sub>

```text
 ---------- Ô CHỌN — MỘT KIỂU DUY NHẤT CHO CẢ HỆ -------------------------
Mọi <select> trong vùng màn hình đều đi qua đây. Màn hình KHÔNG được
để ô chọn trần (ô chọn gốc của trình duyệt trông khác hẳn select2 —
nhìn ra thành "hai kiểu ô chọn").

Không cần gọi tay: `ui.enhance` chạy tự động cho mọi ô chọn mới xuất
hiện trong `#screen` và trong hộp thoại. Muốn giữ ô chọn gốc thì đánh
dấu `data-no-s2` trên chính thẻ <select>.

Ô chọn NHIỀU: chọn từ 2 mục trở lên thì ô chỉ hiện MỘT dòng tóm tắt
("Tất cả (12)" / "3 mục đã chọn") kèm nút xoá hết, thay vì gim từng
thẻ làm ô cao lên và vỡ hàng lọc.                                     
```

### `ums.ui.hoverCard(khung, chon, dung)`  <sub>ui.js:1264</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.file(opts)`  <sub>ui.js:1319</sub>

```text
 ---------- Ô CHỌN TỆP ----------------------------------------------
Trình duyệt tự vẽ <input type="file"> thành "Choose file / No file chosen":
chữ tiếng Anh (CSS không đổi được), nền xám, cao thấp hơn ô nhập — đặt
cạnh một ô chọn là thấy lệch ngay. Ở đây bọc trong <label>: ô thật vẫn
nằm trong (ẩn đi), phần nhìn thấy là một nút + tên tệp, vẽ bằng
.ums-file ở components/field.css cho khớp ô nhập.

ums.ui.file({ key: 'file', accept: '.xls,.xlsx' })

Tên tệp do ums.ui.enhance tự cập nhật — màn hình không phải gắn gì,
và `[data-k]` vẫn nằm trên chính <input> nên mã cũ tìm ô không đổi. 
```

### `ums.ui.enhance(root)`  <sub>ui.js:1333</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.khoangNgay(root)`  <sub>ui.js:1446</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.chart(canvas, cfg)`  <sub>ui.js:1489</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.reveal(el, opts)`  <sub>ui.js:1510</sub>

```text
 Hiện một vùng đang ẩn, kèm hiệu ứng trượt lên 
```

### `ums.ui.swap(out, into, opts)`  <sub>ui.js:1537</sub>

```text
 Ẩn vùng này, hiện vùng kia kèm hiệu ứng. Trả về vùng vừa hiện. 
```

### `ums.ui.taiTep(ten, kieu, noiDung)`  <sub>ui.js:1615</sub>

```text
 ---------- Tải tệp dựng ở máy khách -----------------------------------
ums.ui.taiTep('ten.csv', 'text/csv;charset=utf-8', noiDung)
ums.ui.xuatXls('DSSV_20260922.xls', { tieuDe, cot: [{ title, get(dòng) }], dong })
Excel ở đây là BẢNG HTML lưu đuôi .xls (Excel mở được, không cần thư viện
SheetJS tải từ CDN như vài màn gốc — _v2 không phụ thuộc CDN).        
```

### `ums.ui.xuatXls(ten, o)`  <sub>ui.js:1620</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.napXLSX()`  <sub>ui.js:1637</sub>

_(chưa có chú thích trong mã)_


---

## crud.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.crud — khung màn hình DANH SÁCH + LỌC + BIỂU MẪU THÊM/SỬA/XOÁ
   Phần lớn màn hình khai báo của hệ cũ là cùng một khuôn: một bảng, một
   thanh lọc, một biểu mẫu, ba lời gọi Lấy/Lưu/Xoá. Hệ cũ chép tay khuôn đó
   vào từng tệp (mỗi tệp 300–1.500 dòng). Ở đây màn hình chỉ KHAI BÁO:

       ums.crud({
           root: document.getElementById('screen'),
           title: 'Hệ thống hoá đơn',
           filters: [{ key: 'q', type: 'text', label: 'Nhập từ khoá' }],
           list:   { paged: true, call: function (f) { return { action: …, strTuKhoa: f.q }; } },
           columns:[ … cột của ums.ui.table … ],
           fields: [{ key: 'strMauso', col: 'MAUSO', label: 'Mẫu số', required: true }],
           save:   function (v, row) { return { action: row ? 'X/CapNhat' : 'X/ThemMoi', strId: row ? row.ID : '', … }; },
           remove: function (ids) { return ids.map(function (id) { return { action: 'X/Xoa', strId: id }; }); }
       });

   Mọi lời gọi đi qua ums.api.call nên giữ nguyên giao thức cũ. Tên tham số
   và tên cột lấy NGUYÊN từ tệp .js gốc — đừng "chuẩn hoá" lại, procedure
   phía Oracle đọc đúng những tên đó.

   Nguồn dữ liệu cho ô chọn (`source`):
       { dm: 'TAICHINH.MAUIN' }                          danh mục dùng chung
       { call: { action, func, … }, id: 'ID', name: 'TEN' }  gọi API
       { items: [{ ID: '1', TEN: 'Hoạt động' }] }         liệt kê sẵn
   `name` có thể là hàm (row) → chuỗi. Một nguồn dùng ở nhiều ô chỉ tải một lần.

   saveFail(err, laSua) → chuỗi: câu báo thay cho câu lỗi của máy chủ khi lưu hỏng (máy chủ chỉ trả
   "Du lieu da ton tai" / "Du lieu khong hop le"; màn biết trùng cái gì, thiếu cái gì thì nói rõ).
```

</details>

### `ums.crud(cfg)`  <sub>crud.js:951</sub>

_(chưa có chú thích trong mã)_


---

## patterns.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.pat — BỘ BỐ CỤC DÙNG CHUNG
   Sổ đăng ký bố cục: _v2/BO-CUC.md — ĐỌC TRƯỚC KHI DỰNG MÀN HÌNH MỚI.

   Lý do có tệp này: cùng một dạng màn hình ở hệ cũ (vd "lưới nhập theo cột
   thời gian") xuất hiện ở hàng chục chỗ, trải khắp các phân hệ. Nếu mỗi màn
   tự dựng lại thì mỗi màn một kiểu — đúng chuyện đã xảy ra ở đợt chuyển
   ApisTaiChinh. Ở đây mỗi bố cục có MỘT bản dựng, màn hình chỉ khai báo dữ
   liệu và lời gọi.

   Bố cục hiện có
   ums.crud(...)          danh sách + lọc + biểu mẫu   (assets/js/crud.js)
   ums.pat.matrix(...)    lưới nhập: dòng × cột thời gian, sửa ngay trong ô
   ums.pat.pivot(...)     bảng xoay, tiêu đề hai tầng, sửa ngay trong ô
   ums.pat.master(...)    hai cột: danh sách bên trái, nội dung bên phải
   ums.pat.sections(...)  nhiều tab × nhiều khung danh sách (hồ sơ cán bộ)
   ums.pat.rows(...)      lưới dòng nhập có nút "Thêm dòng mới" trong biểu mẫu
   ums.pat.diaChi(...)    ô địa chỉ Tỉnh/Huyện/Xã (setTinhThanh của hệ cũ)
   ums.pat.cards(...)     lưới thẻ (tra cứu số phiếu, hoá đơn) + phân trang
   ums.pat.page/panel/filterBar   khung trang, khung nội dung, thanh lọc
   ums.pat.checks(...)    nhóm ô đánh dấu có ô "Tất cả"
   ums.pat.pickSinhVien(...)       hộp chọn sinh viên (gọn / đầy đủ)
   ums.pat.pickSinhVienNganh(...)  hộp chọn sinh viên bản nhiều ngành
   ums.pat.pickNhanSu(...)         hộp chọn nhân sự (genModal_NhanSu)
   ums.pat.phamVi(...)    khối "Phạm vi áp dụng" (chọn SV / khoá / CT / lớp, lưu cùng kế hoạch)

   QUY TẮC CHUNG (xem BO-CUC.md mục "Quy ước")
     · Thêm/sửa luôn hiện biểu mẫu THAY CHỖ danh sách trong trang
       (ums.crud lo sẵn). Hộp thoại chỉ dành cho việc phụ: chọn sinh viên,
       xem phiếu, xem trước, tiến độ.
     · Không màn nào tự dựng <table>, dòng tổng, ô chọn, hay CSS riêng khi
       bố cục ở đây đã có.
```

</details>

### `ums.pat.num(v)`  <sub>patterns.js:48</sub>

```text
 Bỏ dấu phẩy ngăn nghìn để lấy số thật (bản gốc: edu.util.convertStrToNum) 
```

### `ums.pat.money(v)`  <sub>patterns.js:53</sub>

```text
 Tiền trong Ô NHẬP: dấu phẩy ngăn nghìn, đúng như edu.util.formatCurrency của hệ cũ — đọc ngược ra số
được (pat.num). Giữ phần thập phân sau dấu chấm (dùng được cho USD). Hiển thị chỉ đọc: ums.ui.money —
cùng kiểu dấu phẩy (site.config.js `money`, chốt 2026-09-26). 
```

### `ums.pat.page(title, actionsHtml)`  <sub>patterns.js:65</sub>

```text
 Đầu trang: tiêu đề + vùng nút (nút dính đỉnh khi cuộn, xem shell.css) 
```

### `ums.pat.panel(o)`  <sub>patterns.js:76</sub>

```text
Khung nội dung.
o = { title, icon, tools, body (HTML), zone (data-z của phần thân),
      count (data-z của ô đếm), flush (bỏ đệm thân), cls, foot }
```

### `ums.pat.filterBar(fields, opts)`  <sub>patterns.js:97</sub>

```text
Thanh lọc. fields = [{ key, label, type: 'select'|'text'|'date', multiple, value }]
Ô chọn để trống, màn hình tự đổ dữ liệu vào bằng pat.fill.
Nút tìm kiếm mang data-a="search".
```

### `ums.pat.fill(el, rows, o)`  <sub>patterns.js:120</sub>

```text
 Đổ dữ liệu vào một ô chọn; giữ giá trị đang chọn nếu còn trong danh sách 
```

### `ums.pat.chain(list, o)`  <sub>patterns.js:161</sub>

```text
Nối tầng Hệ → Khoá → Chương trình → Lớp
ums.pat.chain([F.he, F.khoa, F.ct, F.lop]);

Ba luật (luật 1 và 2 người dùng yêu cầu 2026-09-21, bản gốc KHÔNG có):
1. Tầng trên chưa chọn → mọi tầng dưới bị KHOÁ (disabled). Bản gốc
nạp sẵn toàn bộ Khoá nên chọn được Khoá khi chưa có Hệ.
2. Chọn hoặc XOÁ một tầng → xoá trắng mọi tầng dưới. Bản gốc chỉ bắt
'select2:select', và pat.fill giữ giá trị cũ nếu còn trong danh
sách mới — bỏ Hệ thì Khoá cũ vẫn nằm nguyên.
3. Xoá một tầng (trừ tầng cuối) → phát lại 'select2:select' để trình
xử lý sẵn có của màn nạp lại tầng con. Màn / bộ nối tầng đã tự nghe
lúc xoá thì truyền { phatLai: false } để khỏi nạp hai lần.

Bốn bộ nối tầng dùng chung (ums.ref.cascade, ums.ref.cascadeQuyen,
ums.dmhsB.cascadeQuyen, ums.dmhsB.mucPhi) đã tự gọi hàm này. Màn tự viết
nối tầng thì gọi thêm một dòng SAU KHI gắn trình xử lý của nó.
```

### `ums.pat.haiLuoi(host, o)`  <sub>patterns.js:246</sub>

```text
KHUNG "CHƯA đăng ký / ĐÃ đăng ký" — ums.pat.haiLuoi
Hai bảng xếp dọc: bảng trên có ô đánh dấu + nút "Đăng ký", bảng dưới có
ô đánh dấu + nút "Hủy đăng ký".
Dùng ở: dangkyhoc/nguyenvong, dangkyhoc/thilai, sukien/sukien,
xebus/vethang (trước 2026-09-23 nằm ở dangkyhoc/script/_hailuoi.js,
hai màn sau phải với sang thư mục module khác để nạp).
Bản gốc mỗi màn tự dựng hai <table> + ô "chọn tất cả" (checkedAll_BgRow /
lớp chkSystemSelectAll) + hai nút đặt dưới bảng. Ở đây:
· bảng qua ums.ui.table, cột ô đánh dấu do khung tự thêm ở CUỐI (như gốc);
· nút "Đăng ký" (xanh lá như btn-success gốc) ở đầu khung bảng trên;
· "Hủy đăng ký" là nút xoá nhiều dòng chuẩn (ums.ui.xoaChon) ở đầu khung
bảng dưới — tự đếm, khoá khi chưa chọn (luật chung 2026-09-22);
· `nhom: 'COT'` — đánh dấu một dòng thì đánh dấu mọi dòng cùng giá trị
cột đó (thilai: các thành phần điểm của cùng một học phần — gốc làm
bằng lớp CSS = DAOTAO_HOCPHAN_ID).

var hl = ums.pat.haiLuoi(host, {
chua: { title, icon, columns, empty, nut: { text, icon }, canChon: 'Vui lòng chọn…', onDangKy(rows),
kiemTra() → false thì dừng (chạy TRƯỚC khi đếm dòng chọn, như gốc nguyenvong) },
da:   { title, icon, columns, empty, nut: { text },                                 onHuy(rows) },
nhom: 'DAOTAO_HOCPHAN_ID'            // tuỳ chọn
});
hl.ve('chua' | 'da', rows, cột?)  vẽ lại bảng   hl.nhac(k, chữ)  khung lời nhắc
(cột truyền vào thay cho cfg[k].columns — dùng khi số cột đổi theo dữ liệu)
hl.dang(k)                   "Đang tải…"        hl.loi(k, chữ)   khung lỗi
hl.bang(k)                   phần tử chứa bảng (đọc ô chọn trong dòng)
```

### `ums.pat.loc(rows, q, cols)`  <sub>patterns.js:344</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.dmTitle(rows)`  <sub>patterns.js:352</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.val(el)`  <sub>patterns.js:358</sub>

```text
 Giá trị một ô lọc: ô chọn nhiều trả "a,b" như edu.util.getValCombo 
```

### `ums.pat.checks(host, rows, o)`  <sub>patterns.js:397</sub>

```text
Nhóm ô đánh dấu có ô "Tất cả"
Hệ cũ: genList_TrangThaiSV / genList_DMLKT. Đợt chuyển Tài chính sinh
ra NĂM bản chép tay, mỗi bản một tên thuộc tính nên không dùng lại
được của nhau: hoadon/_chung.js H.checks (data-all + value),
phieuthu/_chung_khac.js PK.checks (data-id), sinhviennotien.js
checklist (data-ck), dulieuhocphi/_chung.js checkGroup (data-tt),
danhmucheso/khongbatno.js (data-tt, dựng thẳng trong hộp chọn SV).
Nay một bản.

pat.checks(host, rows, {
all: 'Tất cả' | false,    ô "Tất cả" ở đầu (mặc định có)
checked: true,            đánh dấu sẵn (mặc định có)
id: 'ID', name: 'TEN',    cột lấy giá trị / nhãn (name nhận hàm)
cols: 3,                  số cột lưới (mặc định 2 = .ums-checkgrid)
cls: '',                  lớp thêm cho lưới
empty: 'Không có dữ liệu',
onChange(input)
})
`rows` là mảng HOẶC Promise — Promise thì hiện "Đang tải…" rồi tự vẽ,
lỗi thì báo bằng toast và để trống.

trả { ids()  → mảng id đang đánh dấu, đúng thứ tự trên màn
(= edu.extend.getCheckedCheckBoxByClassName)
val()  → chuỗi "a,b"
picked() → chính các DÒNG đang đánh dấu (khỏi nhét dữ liệu vào
data-* rồi đọc ngược như bản hoadon cũ)
set(ids) | setAll(on) | draw(rowsMới) | el }
```

### `ums.pat.matrix(o)`  <sub>patterns.js:492</sub>

```text
BỐ CỤC: lưới nhập (dòng × cột)
Thay các lưới nhập hệ số / đơn giá / mức phí của hệ cũ, nơi mỗi ô là
một bản ghi và người dùng sửa thẳng trong ô rồi bấm "Cập nhật".

o = {
el, rows, cols,                    dòng và cột
rowKey(row) → id, colKey(col) → id, colTitle(col) → chữ
cells: [],  cellKey(rec) → { r, c } để ghép ô ↔ bản ghi
value(rec) → giá trị trong ô
lead: [{ title, prop | render(row), cls, width }]   các cột đầu
money: true,                        ô tiền (định dạng lúc rời ô)
onEdit(rec, row, col),              nút sửa trong ô (bỏ thì không có nút)
readonly: true                      chỉ xem
}
trả { dirty() → [{ row, col, rec, value, old }], el }
```

### `ums.pat.formTrang(o)`  <sub>patterns.js:614</sub>

```text
BỐ CỤC: biểu mẫu THAY CHỖ màn — cho màn KHÔNG dựng bằng ums.crud
BO-CUC luật 1: thêm / sửa bản ghi chính là biểu mẫu ngay trong trang, KHÔNG bật hộp thoại (người dùng nhắc lại 2026-09-30 với
các màn lưới nhập Tài chính: "màn hình thêm mới hiện bật modal"). Hàm này nhận đúng cấu hình của ui.dialog và trả đúng hình
dạng { body, close() } nên màn đang dùng hộp thoại chỉ phải đổi tên hàm gọi.

o = { host: vùng gốc của màn (mọi phần tử con đang hiện sẽ ẩn đi, đóng thì hiện lại),
title, icon, body: HTML | phần tử, cols: 1 | 2 (mặc định 2 — ô ngắn hai ô một hàng),
buttons: [{ text, kind, mod, icon, keepOpen, onClick(api) }]   — Y HỆT ui.dialog: bấm xong tự đóng, trừ khi onClick trả false
hoặc nút có keepOpen (lưu bất đồng bộ: trả false rồi tự gọi api.close())
xoa: { chon, trong, text, onClick(api) }   — nút "Xoá đã chọn" (ui.xoaChon) như tuỳ chọn cùng tên của ui.dialog
flush: true    — thân sát mép (bảng / màn con chiếm hết bề ngang khung)
onClose() }
Cũng dùng cho MÀN CON (danh sách + biểu mẫu của bản ghi con, vd ums.crud({ embedded: true })): truyền thân là vùng chứa, không cần buttons.
host là vùng sẽ bị thay chỗ: cả màn (root) hoặc một khung con đang mở (khi đó biểu mẫu là tầng hai, nút Đóng của khung ngoài tự ẩn).
Nút: "Đóng" ngoài cùng bên trái, rồi Xoá, rồi các nút còn lại (Lưu cuối) — đầu khung dính khi cuộn như biểu mẫu crud.
```

### `ums.pat.pivot(o)`  <sub>patterns.js:709</sub>

```text
BỐ CỤC: bảng xoay, tiêu đề hai tầng
Dùng cho "học kỳ × khoản thu × kiểu học" và các bảng chéo khác: tầng
trên gom nhóm, tầng dưới là cột con. Ô hiện giá trị; rê chuột vào ô
mới hiện nút sửa/xoá nên bảng không rối.

o = {
el,
groups: [{ title, cols: [{ title, key }] }],   hai tầng tiêu đề
lead:   [{ title, prop | render(row), cls, width }],
rows,
value(row, col) → chuỗi đã sẵn sàng hiển thị (hoặc '' nếu trống)
has(row, col)   → có bản ghi hay không (quyết định hiện nút sửa/xoá)
onEdit(row, col), onDelete(row, col)
}
```

### `ums.pat.master(o)`  <sub>patterns.js:796</sub>

```text
BỐ CỤC: hai cột — danh sách bên trái, nội dung bên phải
Dùng cho: chọn sinh viên rồi thu tiền, chọn chương trình rồi xem học
phần, chọn đối tượng rồi xem định mức…

o = { el, title, actions,
side: { title, icon, tools: HTML (nút ở đầu khung trái),
search: 'chữ gợi ý' | false, filter: HTML (tự có đệm),
footer: HTML (phân trang dưới danh sách), width,
kieu: 'danhmuc' — danh sách là DANH MỤC: vẽ kiểu cây thư mục
(đường chấm, biểu tượng thư mục, số lượng thành nhãn tròn).
Cây lồng: <ul><li><button class="ums-master__item">…</li></ul> },
main: { title, icon, tools } }
trả { el, side, main, sideBody, sideFoot, sideCount, mainBody, search }

Mục trong danh sách trái: `<button class="ums-master__item">` — mục có
nút thao tác riêng thì dùng `<div class="ums-master__item">` (nút lồng
nút là HTML sai) và đặt nút trong `<span class="ums-master__item__act">`.
```

### `ums.pat.masterItem(o)`  <sub>patterns.js:867</sub>

```text
Một mục trong danh sách bên trái của pat.master.
o = { text, sub, active, id, act: HTML nút thao tác }
Có `act` thì dựng bằng <div> (không lồng nút trong nút).
```

### `ums.pat.cards(o)`  <sub>patterns.js:892</sub>

```text
BỐ CỤC: lưới thẻ
Tra cứu số phiếu / hoá đơn: mỗi bản ghi là một thẻ bấm được, phân
trang phía dưới.

o = { el, items, render(item, i) → HTML bên trong thẻ, tone(item) →
'' | 'ok' | 'bad' | 'warn' | 'mute' | 'info', onPick(item, i),
title(item) / attrs(item) → thuộc tính đặt lên thẻ,
actions(item, i) → HTML nút trong thẻ (khi có: thẻ dựng bằng
<div>, vì nút lồng trong nút là HTML sai; phần nội dung vẫn
bấm được nếu có onPick),
page: { index, size, total, onChange } }
```

### `ums.pat.groupTable(o)`  <sub>patterns.js:953</sub>

```text
BỐ CỤC: bảng gộp ô theo nhóm
Thay `edu.system.actionRowSpan` của hệ cũ: mỗi nhóm (khối kiến thức,
đợt, loại…) chiếm một khối dòng, các cột của NHÓM gộp lại bằng
rowspan, các cột của DÒNG liệt kê bình thường.

o = {
el, groups: [{ row: <dòng nhóm>, rows: [<dòng con>] }],
head: [[{ title, colspan }], …]        tiêu đề nhiều tầng (tuỳ chọn)
groupCols: [{ title, prop | render(g), cls, width }]   cột của nhóm
cols:      [{ title, prop | render(row, i), cls, width }]  cột của dòng
stt: true      thêm cột Stt đánh số trong từng nhóm
foot: HTML     nội dung vùng ums-tablefoot dưới bảng
empty
}
```

### `ums.pat.footSum(label, value)`  <sub>patterns.js:1003</sub>

```text
 Một ô tổng trong ums-tablefoot: nhãn + số 
```

### `ums.pat.cardRow(label, value)`  <sub>patterns.js:1008</sub>

```text
 Một dòng trong thẻ: nhãn trái, giá trị phải 
```

### `ums.pat.pickSinhVien(o)`  <sub>patterns.js:1037</sub>

```text
BỐ CỤC: hộp chọn sinh viên
Thay edu.extend.genModal_SinhVien. Ba module từng tự viết ba bản —
nay dùng chung một bản.

Hai kiểu, chọn bằng `filters`:

a) GỌN (mặc định) — ô tìm + bảng, mỗi dòng một nút "Chọn":
o = { params() → tham số lọc lúc mở,
searchParams() → tham số khi bấm Tìm (mặc định = params),
isPicked(id), onPick(row) → false nếu không nhận,
title, size, multi: false → chọn xong đóng hộp }

b) ĐẦY ĐỦ — `filters: true`: thêm bộ lọc nối tầng Hệ → Khoá → Chương
trình → Lớp (chọn nhiều), khối trạng thái người học, ô đánh dấu
chọn nhiều dòng, nút "Chọn sinh viên" ở chân hộp:
o = { filters: true, status: fn(el) → { ids() }, columns: [...],
call(p, page, size) → tham số lời gọi (mặc định
pkg_hosohocvien.LayDanhSachHoSo),
group: { khoa(), chuongTrinh(), lop() }  → nút "Thêm từng…",
onPick(rows) }

Trả về hộp thoại (ums.ui.dialog) — gọi .close() khi cần.
```

### `ums.pat.pickSinhVienNganh(opts)`  <sub>patterns.js:1125</sub>

```text
Hộp chọn sinh viên — bản NHIỀU NGÀNH
Hệ cũ: edu.extend.genModal_SinhVien (Core/systemextend.js:918). Khác
pat.pickSinhVien ở nguồn: pkg_hosohocvien.LayDanhSachHoSoNhieuNganh
(một người học nhiều ngành → mỗi ngành một dòng), nên cột và tên khoá
cũng khác (QLSV_NGUOIHOC_*). Đây là bản dùng ở dulieuhocphi,
giahanthu và danhmucheso/khongbatno — trước có hai bản chép tay.

ums.pat.pickSinhVienNganh({
onPick:  function (rows) { … },       // nút "Chọn sinh viên"
onGroup: function (kind, ids, names) { … }   // "Thêm từng khoá/chương trình/lớp"
});                                        //  (chỉ hiện khi có onGroup; names = chữ các mục đã chọn)

rows là dòng của LayDanhSachHoSoNhieuNganh (ID, QLSV_NGUOIHOC_ID,
DAOTAO_TOCHUCCHUONGTRINH_ID, QLSV_NGUOIHOC_MASO…). Chọn giữ qua các
trang (bản gốc chỉ lấy trang đang hiện).
```

### `ums.pat.pickNhanSu(o)`  <sub>patterns.js:1201</sub>

```text
Hộp chọn NHÂN SỰ — ums.pat.pickNhanSu
Thay edu.extend.genModal_NhanSu + getList_NhanSu (Core/systemextend.js:67,
186) — hơn 100 màn gốc dùng. Bộ lọc: Đơn vị (cơ cấu tổ chức, chọn nhiều),
Cán bộ trong / ngoài trường (-1 / 0 / 1), từ khoá; phân trang ở máy chủ.
Lời gọi: ums.ref.nhanSuPage (pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2).

ums.pat.pickNhanSu({
title: 'Tìm kiếm giảng viên',        // chữ bản gốc
onPick: function (rows, hop) { … },   // dòng máy chủ: ID, MASO, HOTEN, HODEM, TEN…
footExtra: HTML,                      // tuỳ chọn — ô thêm ở chân hộp
loaiCanBo: '1'                        // tuỳ chọn — đặt sẵn ô Trong/ngoài trường ('-1' | '0' | '1')
});

Khác bản gốc: "Chọn nhân sự" khi chưa đánh dấu ai thì báo (bản gốc vẫn
gọi callback với mảng rỗng rồi đóng hộp); chọn giữ qua các trang (bản
gốc chỉ lấy trang đang hiện). "Thêm từng đơn vị" bản gốc không có xử lý
→ giữ nút, đặt disabled.
```

### `ums.pat.xacNhanChiTiet(o)`  <sub>patterns.js:1476</sub>

```text
HỎI LẠI KÈM CHI TIẾT — ums.pat.xacNhanChiTiet(o) → Promise<boolean>
Bản viết lại của showFancyConfirm (hoatdong/DaQHHT.js) — hộp hỏi lại
liệt kê đúng những gì sắp ghi, người dùng đánh dấu "đã kiểm tra" mới
bấm được. Dùng khi một lần bấm ghi nhiều trường khó hoàn tác.

ums.pat.xacNhanChiTiet({
title, subTitle, icon, okText, tone: 'bad' (nút đỏ),
warning: 'chữ cảnh báo',
subject: { name, extra: [{ label, value }] },
sections: [{ title, tone: 'blue'|'green'|'orange'|'red', rows: [[nhãn, giá trị], …] }],
requireCheckbox: true (mặc định)
}).then(function (dongY) { … });
Ô trống hiện "— chưa nhập —" như gốc.
```

### `ums.pat.sections(o)`  <sub>patterns.js:1532</sub>

```text
NHIỀU TAB × NHIỀU DANH SÁCH — ums.pat.sections
Dạng màn hồ sơ của Cổng cán bộ / Nhân sự (vd quatrinhdaotao): một dải
tab, mỗi tab một hay vài khung "danh sách + nút Thêm mới + Tải lại",
mỗi khung một biểu mẫu riêng. Bản gốc: Bootstrap tab + panel collapse,
nạp dữ liệu khi mở tab lần đầu; mở biểu mẫu thì
edu.util.toggle_overide("zonecontent", …) giấu CẢ vùng tab, chỉ còn
biểu mẫu. Ở đây giữ đúng hai hành vi đó.

var pg = ums.pat.sections({
el: root, title: 'Quá trình đào tạo',
tabs: [
{ key: 'daotao', text: 'Quá trình đào tạo', icon: 'fa-graduation-cap',
sections: [cfgDaoTao, cfgBoiDuong] },     // cfg của ums.crud
{ key: 'hocvi', text: 'Học vị', sections: [cfgHocVi] }
]
});
pg.crud('daotao', 0) · pg.show('hocvi')

Mỗi khung là ums.crud({ embedded: true, autoload: false, … }) — cfg của
màn truyền nguyên, khung tự thêm hai cờ đó. Chỉ MỘT tab thì không vẽ
dải tab (bản gốc có dải tab một mục chỉ để làm tiêu đề — tiêu đề trang
đã nói điều đó).
```

### `ums.pat.rows(hostEl, o)`  <sub>patterns.js:1631</sub>

```text
LƯỚI DÒNG NHẬP (nằm trong biểu mẫu) — ums.pat.rows
Dạng "bảng có nút Thêm dòng mới" của hệ cũ (vd Gia hạn / Tiến độ học
tập trong quatrinhdaotao): mỗi dòng là một bản ghi con của bản ghi
đang sửa, lưu từng dòng SAU khi bản ghi cha đã có id.

var g = ums.pat.rows(host, {
title: 'Tiến độ học tập', icon: 'fa-list-check',
columns: [
{ key: 'strNgayBaoCao', col: 'NGAYBAOCAO', title: 'Ngày', type: 'date' },
{ key: 'strTienDo_Id', col: 'TIENDO_ID', title: 'Tình trạng', type: 'select',
source: { dm: 'NS.TIENDOHOCTAP' }, placeholder: 'Chọn tình trạng' },
{ key: 'strMoTa', col: 'MOTA', title: 'Mô tả' },
{ key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
],
minRows: 4,                       // bản gốc luôn vẽ đủ 4 dòng
minRowsNew: 4,                    // (tuỳ chọn) số dòng trống khi bản ghi cha mới thêm
list: function (parentId) → lời gọi lấy các dòng đã lưu,
filled: function (v) → true thì mới lưu dòng đó (bản gốc bỏ qua dòng trống),
save: function (v, row, parentId) → lời gọi ThemMoi/CapNhat,
remove: function (row) → lời gọi xoá dòng đã lưu
});
g.load(parentId) · g.clear() · g.save(parentId) → Promise · g.addNew(dòngNguồn)

Ô chọn trong lưới là ô gốc (BO-CUC luật 2 — ít mục, không select2);
danh sách dài thì đặt `s2: true` trên cột. Thêm nữa:
group: 'Thời gian bắt đầu'   cột liền nhau cùng group → tiêu đề hai tầng
source: { load: fn → Promise<dòng>, name: 'TEN' | fn(dòng) }
tools: '<button…>'          nút thêm ở đầu khung, trước "Thêm dòng mới"
type: 'static'              cột chỉ hiện (vd Ngày tạo, Người tạo), không gửi khi lưu
Tệp đính kèm của dòng gắn vào id máy chủ trả cho CHÍNH dòng đó.
```

### `ums.pat.phamVi(hostEl, o)`  <sub>patterns.js:1812</sub>

```text
PHẠM VI ÁP DỤNG — ums.pat.phamVi
Khối "Phạm vi áp dụng" trong biểu mẫu kế hoạch của hệ cũ (sukien/kehoach,
sukien/sukien, khaosat/kehoach…): bảng tên phạm vi, nút Thêm mở
edu.extend.genModal_SinhVien, nút Xóa xoá các dòng ĐÃ LƯU được đánh
dấu. Dòng mới chỉ nằm trên màn, bấm Lưu kế hoạch xong mới gửi — mỗi
phạm vi một lời gọi, gắn vào id kế hoạch máy chủ trả.

var pv = ums.pat.phamVi(host, {
list:   function (id)       { return { action: 'X/LayDS…PhamVi', … }; },
save:   function (pvId, id) { return { action: 'X/Them…PhamVi', strPhamViApDung_Id: pvId, … }; },
remove: function (rowId)    { return { action: 'X/Xoa…PhamVi', strId: rowId, … }; },
name:   function (row) { … }            // mặc định PHAMVIAPDUNG_TEN
});
pv.load(idKeHoach) · pv.clear() · pv.save(idKeHoach) → Promise

Chọn sinh viên → gửi QLSV_NGUOIHOC_ID (save_SinhVien của bản gốc đổi
id dòng hộp chọn sang id người học). "Thêm từng khóa / chương trình /
lớp" → gửi thẳng id khoá/CT/lớp; bấm lại cùng loại thì THAY danh sách
cũ (bản gốc gán đè edu.extend.arrKhoa…), hiện dòng "Áp dụng cho …".
```

### `ums.pat.diaChi(input, o)`  <sub>patterns.js:1953</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.chonPhamVi(o)`  <sub>patterns.js:2048</sub>

```text
Chọn phạm vi thao tác hàng loạt — "chỉ dòng đã đánh dấu" / "toàn bộ"
(bản gốc: hộp #myModalChonPhamVi của sinhviennotien, inbangdiem…)
pat.chonPhamVi({ title, icon, soChon, daChon, tatCa, warn }) → Promise<'daChon' | 'tatCa' | null>
soChon = 0 thì nút "đã đánh dấu" bị khoá.
```

### `ums.pat.emailHopLe(s)`  <sub>patterns.js:2083</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.guiEmail(o)`  <sub>patterns.js:2084</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.soDo(host, rows, o)`  <sub>patterns.js:2146</sub>

```text
SƠ ĐỒ CÂY kiểu sơ đồ tổ chức (cha ở trên, các con dàn ngang bên dưới, nối bằng đường kẻ)
pat.soDo(host, rows, {
id: 'ID', cha: 'CHA_ID',          // tên cột khoá / khoá cha
nhan: function (r, laCha) → html,  // nội dung một ô (đã tự thoát ký tự thì trả html)
attr: function (r) → { tên: giá trị } // thuộc tính gắn lên nút (vd data-c / data-i của ums.crud)
})
Dòng mồ côi (cha không có trong danh sách) và vòng cha–con của dữ liệu hỏng → vẽ ở tầng trên cùng,
không treo. Rộng hơn khung thì cuộn ngang (kéo chuột như bảng). Mỗi ô là <button class="ums-sodo__nut">
— màn tự nghe click. CSS: components/sodo.css. Dùng ở ApisRenLuyen tieuchidiem (2026-09-25). 
```

### `ums.pat.anhNguoi(path)`  <sub>patterns.js:2209</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.dsNhanSuLoc(o)`  <sub>patterns.js:2214</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.dsNhanSu(m, o)`  <sub>patterns.js:2228</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.cotTrai(m, o)`  <sub>patterns.js:2368</sub>

```text
ÁP LUẬT CỘT TRÁI (BO-CUC luật 12) lên một pat.master ĐÃ DỰNG — cho màn tự dựng cột trái
pat.cotTrai(m, { tai: function () {…nạp lại trang 1…}, moSan: false, tuTaiLoc: true })
m = kết quả pat.master, hoặc { side, search } khi ô tìm tự dựng; tuTaiLoc: false khi màn ĐÃ tự tải lúc đổi ô lọc
tuTim: false khi ô tìm ĐÃ tự lọc tại chỗ lúc gõ (vd lọc cây) — khỏi nạp lại từ máy chủ mỗi lần gõ.
Phần tử con của vùng lọc mang data-cot-giu (vd nhãn "Hệ / Khoá" đang lọc) thì giữ nguyên, luôn hiện.
· nút trên tiêu đề cột: kính lúp → Tải lại (giữ nguyên thuộc tính data-* nên trình xử lý cũ vẫn chạy);
chưa có nút Tải lại thì thêm (gọi o.tai); có ô lọc thì thêm nút "Bộ lọc nâng cao" (fa-sliders)
· mọi ô chọn / ô chữ lọc trong .ums-master__filter (trừ ô tìm) dồn vào khung .ums-master__adv ẨN SẴN
ngay dưới ô tìm (moSan: true = mở sẵn — dùng khi ô lọc bắt buộc chọn trước)
· ẩn nút "Tìm kiếm" trong cột; gõ ô tìm là tự tìm sau 400ms; đổi ô lọc là tự tải
Gộp 2026-09-26: 18 màn tự dựng vi phạm (người dùng: "kiểm toàn bộ chưa") — gọi MỘT dòng sau khi dựng xong.
Kiểm: _harness/kiem-cot-trai.html.
```

### `ums.pat.noCo(so, chuaRo)`  <sub>patterns.js:2478</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.dauDoiTuong(o)`  <sub>patterns.js:2485</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.datNoCo(khung, so, chuaRo)`  <sub>patterns.js:2497</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.datDau(panel, o)`  <sub>patterns.js:2501</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.thanhThu(o)`  <sub>patterns.js:2511</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.datDaChon(vung, so)`  <sub>patterns.js:2524</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.datTongTab(vung, so)`  <sub>patterns.js:2528</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.masterNhanSu(o)`  <sub>patterns.js:2533</sub>

_(chưa có chú thích trong mã)_

### `ums.pat.boLocNguoiHoc(host, o)`  <sub>patterns.js:2671</sub>

_(chưa có chú thích trong mã)_


---

## ref.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.ref — danh mục dùng chung của đào tạo
   Bản viết lại của các hàm edu.system.getList_* trong Core/systemroot.js.
   Tham số và procedure giữ NGUYÊN bản gốc (số dòng ghi cạnh từng hàm).
   Mọi hàm trả Promise<mảng dòng>, lỗi thì ném ra.

       ums.ref.heDaoTao()                              → TENHEDAOTAO
       ums.ref.khoaDaoTao({ strHeDaoTao_Id })           → TENKHOA, MAKHOA
       ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id, strKhoaDaoTao_Id })
                                                       → TENCHUONGTRINH, MACHUONGTRINH
       ums.ref.lopQuanLy({ strDaoTao_HeDaoTao_Id, strKhoaDaoTao_Id, strToChucCT_Id })
                                                       → TEN, MA
       ums.ref.hocPhan({ strChuongTrinh_Id })           → DAOTAO_HOCPHAN_ID, TEN
       ums.ref.thoiGianDaoTao({ strNam_Id })            → DAOTAO_THOIGIANDAOTAO
       ums.ref.khoaQuanLy()
       ums.ref.sinhVien({ strTuKhoa, strHeDaoTao_Id, …, pageIndex, pageSize })
       ums.ref.dm('MA.BANG')                            = ums.api.dm

   Chọn nối tầng Hệ → Khoá → Chương trình → Lớp (dùng ở ~45 màn hình gốc):

       var cas = ums.ref.cascade({
           he:   '#fHe',  khoa: '#fKhoa',  ct: '#fCT',  lop: '#fLop',   // ô nào không có thì bỏ
           onChange: function (v) { … }      // v = { he, khoa, ct, lop }
       });
       cas.values()   → { he, khoa, ct, lop }
       cas.ready      → Promise, xong khi đã nạp danh sách Hệ

   Đổi Hệ thì nạp lại Khoá, Chương trình, Lớp; đổi Khoá thì nạp lại
   Chương trình và Lớp; đổi Chương trình thì nạp lại Lớp. Ô cha để trống
   thì ô con vẫn nạp (theo đúng cách procedure gốc hiểu tham số rỗng = tất cả).
```

</details>

### `ums.ref.heDaoTao(o)`  <sub>ref.js:51</sub>

```text
 Core/systemroot.js:3714 
```

### `ums.ref.khoaDaoTao(o)`  <sub>ref.js:66</sub>

```text
 Core/systemroot.js:3792 
```

### `ums.ref.chuongTrinh(o)`  <sub>ref.js:81</sub>

```text
 Core/systemroot.js:3868 
```

### `ums.ref.lopQuanLy(o)`  <sub>ref.js:99</sub>

```text
 Core/systemroot.js:4035 
```

### `ums.ref.hocPhan(o)`  <sub>ref.js:118</sub>

```text
 Core/systemroot.js:4332 
```

### `ums.ref.thoiGianDaoTao(o)`  <sub>ref.js:132</sub>

```text
 Core/systemroot.js:3638 
```

### `ums.ref.khoaQuanLy()`  <sub>ref.js:146</sub>

```text
 Core/systemroot.js:4186 
```

### `ums.ref.coCauToChuc(o)`  <sub>ref.js:160</sub>

```text
 edu.system.getList_CoCauToChuc (Corei/systemroot.js:4455). Bản gốc hay
tách kết quả thành cha (không có DAOTAO_COCAUTOCHUC_CHA_ID) và con. 
```

### `ums.ref.nhanSu(o)`  <sub>ref.js:189</sub>

_(chưa có chú thích trong mã)_

### `ums.ref.nhanSuPage(o)`  <sub>ref.js:191</sub>

```text
 Bản có phân trang — hộp chọn nhân sự (ums.pat.pickNhanSu) → { rows, total } 
```

### `ums.ref.tenNhanSu(r)`  <sub>ref.js:198</sub>

_(chưa có chú thích trong mã)_

### `ums.ref.xoaQuyetDinhKem(ids)`  <sub>ref.js:212</sub>

```text
 XOÁ QUYẾT ĐỊNH SINH KÈM (người dùng quyết 2026-09-30). Thêm kỷ luật / khen thưởng / danh hiệu / học hàm có số quyết định thì máy chủ tự
sinh một quyết định (NS_ThongTinQuyetDinh, NGUONDULIEU_ID = id dòng); xoá dòng thì quyết định ở lại, mồ côi. Màn gọi hàm này SAU khi xoá
dòng thành công. CHỈ xoá quyết định có NGUONDULIEU_ID ĐÚNG BẰNG id vừa xoá (phòng khi máy chủ bỏ qua tham số lọc mà trả mọi quyết định).
Lỗi khi dọn không chặn màn — dòng chính đã xoá xong.
Kiểm host 2026-09-30: kỷ luật / khen thưởng / danh hiệu máy chủ nay tự xoá quyết định kèm; HỌC HÀM thì không — hàm này dọn. Quyết định
sinh kèm khen thưởng mang TRANGTHAI = 0 nên tìm ở CẢ HAI trạng thái (danh sách chỉ trả một trạng thái mỗi lần gọi). 
```

### `ums.ref.quaTrinhCuoiCung(strMaBang)`  <sub>ref.js:235</sub>

_(chưa có chú thích trong mã)_

### `ums.ref.sinhVien(o)`  <sub>ref.js:246</sub>

```text
 Core/systemroot.js:4783 — bản gốc lấy phân trang mặc định của hệ 
```

### `ums.ref.sinhVienPage(o)`  <sub>ref.js:266</sub>

```text
 Như ref.sinhVien nhưng trả kèm tổng số dòng — cần cho hộp chọn có phân trang 
```

### `ums.ref.dm(code, sortBy)`  <sub>ref.js:290</sub>

_(chưa có chú thích trong mã)_

### `ums.ref.cascade(o)`  <sub>ref.js:310</sub>

_(chưa có chú thích trong mã)_

### `ums.ref.cascadeQuyen(o)`  <sub>ref.js:409</sub>

_(chưa có chú thích trong mã)_


---

## report.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.report / ums.upload / ums.queue — báo cáo, import, tải tệp, hàng đợi
   HỢP ĐỒNG GIAO DIỆN — các màn hình gọi đúng những hàm dưới đây. Chữ ký đã
   chốt, đừng đổi. Khoá đánh dấu (+) là khoá tuỳ chọn thêm vào sau.

   ums.report.mount(host, opts) → { reload(), templates }
       Thay edu.system.getList_MauImport(zoneId, callback) (Core/systemroot.js:6670).
       Nạp danh sách mẫu của chức năng đang mở (pkg_phanquyen_dulieu.
       LayDS_PhanQuyen_MauImport), vẽ nút "Xuất báo cáo" và "Import" dạng thả
       xuống vào `host`. Không có mẫu nào thì host để trống.
       opts.collect(add, tpl)   add(khoá, giá trị) như addKeyValue của bản gốc;
                                trả false để huỷ. tpl = dòng mẫu đang chọn.
       opts.tables()            mảng <table> cho mẫu REPORTALLTABLE / REPORTALLINPUT
                                / IMPORTALLINPUT (mặc định: các bảng đang hiện
                                trong #screen)
       opts.onImported(rows)    gọi sau khi import thành công
       (+) opts.importValues    giá trị cho tham số import (xem importChung)
       (+) opts.onLoad(rows)    gọi sau khi nạp xong danh sách mẫu
       (+) opts.import = false   không vẽ nút Import (màn gốc không có vùng <zone>_Import → mẫu import không bao giờ hiện)
       (+) opts.reportText / opts.importText   đổi chữ trên hai nút khi màn gốc
                                dùng chữ khác — KHÔNG tự đổi chữ của bản gốc

   ums.report.run(code, opts) → Promise<{ id, url } | null>
       Chạy thẳng một mẫu báo cáo theo mã (bản gốc: edu.system.report(code, duongDan, callback)).
       opts.collect(add, tpl), opts.duongDan
       (+) opts.tpl       dòng mẫu (mặc định tra trong danh sách mẫu đã nạp)
       Không bao giờ reject: lỗi đã được báo bằng toast, kết quả là null.

   ums.report.importChung(title, maDanhMuc, opts) → { close() }
       Hộp import chung (edu.system.showImportChung, Core/systemroot.js:7600).
       opts.onDone(rows)  thay thuộc tính callback="…" (eval) của bản gốc
       (+) opts.values    { MA | idÔ: giá trị } hoặc function(MA, biểuThức, dòng)
                          → giá trị cho các tham số THONGTIN5 (xem getData bên dưới)

   ums.files.mount(host, { api }) → { load(id), save(id), clear() }
   ums.files.avatar(host, { width, height }) → { set(p), get(), finalize(id) }
       Tệp đính kèm của một bản ghi (uploadFiles/viewFiles/saveFiles gốc).

   ums.upload(files, opts) → Promise<string>
       Tải tệp lên máy chủ như edu.system.uploadImport, trả đường dẫn tệp.
       (+) opts.outFolderPath  mặc định 'Upload/File/'
       (+) opts.raw            true = trả nguyên văn, không nhân đôi dấu \ như bản gốc

   ums.queue.mount(host, { strLoaiNhiemVu, … }) → { reload(strLoaiNhiemVu?) }
       Hàng đợi tác vụ (edu.system.createHangDoi / getList_HangDoi).
       opts.strLoaiNhiemVu      chuỗi, hoặc hàm trả chuỗi (đọc lại mỗi lần nạp —
                                bản gốc đọc một lần lúc khởi tạo nên luôn rỗng phần đuôi)
       (+) opts.onDone()        = objHangDoi.callback của bản gốc, gọi khi chạy xong
       (+) opts.history         false = không vẽ bảng lịch sử; hoặc phần tử/selector
                                để vẽ lịch sử ở chỗ khác (bản gốc: #tblHistory_<strName>)
       (+) opts.concurrency     số lời gọi song song khi chạy (mặc định 10 = giới hạn
                                luồng của makeRequest bản gốc)
```

</details>

### `ums.report.navigate(url)`  <sub>report.js:210</sub>

```text
 Chuyển trang tới báo cáo — tách riêng để trang dò thay tạm được 
```

### `ums.report.mount(hostEl, opts)`  <sub>report.js:240</sub>

```text
ums.report.mount — getList_MauImport (Core:6670) + cbGenCombo_MauImport (Core:6768)

Bản gốc vẽ hai vùng: #<zone> (báo cáo) và #<zone>_Import. Ở đây cả hai
nút nằm chung trong `host`. Số thứ tự "1., 2., …" đánh trên TOÀN danh
sách như bản gốc (nên mục Import có thể bắt đầu từ số lớn).

Bản gốc có lối tắt "chỉ một mẫu thì bấm nút là chạy luôn" (Core:6698),
nhưng so `attr("class") == "btnBaoCao_LHD"` trong khi lớp thật là
"dropdown-item btnBaoCao_LHD" nên lối tắt đó chưa bao giờ chạy. Không chép.
```

### `ums.report.run(code, opts)`  <sub>report.js:356</sub>

```text
ums.report.run — edu.system.report (Core:6847)

Gửi SYS_Report/ThemMoi thân JSON { arrTuKhoa, arrDuLieu, strNguoiThucHien_Id },
máy chủ trả id báo cáo ở Message, rồi mở trang báo cáo với ?id=.
Bốn cặp đầu luôn có, đúng thứ tự bản gốc: strTable_Id (null khi báo cáo
thường — bản gốc cũng gửi undefined → null), strLoaiBaoCao, strReportCode,
strNguoiThucHien_Id; rồi saveFile nếu mẫu có XEMFILE; rồi các cặp của collect.

Khác bản gốc: bản gốc gọi me.dtMauBaoCao.find(...).XEMFILE không kiểm
tra — gọi report() với mã không có trong danh sách mẫu (hoặc trước khi
danh sách nạp xong) là TypeError. Ở đây thiếu mẫu thì coi như không XEMFILE.
```

### `ums.report.taiBangNhap(table)`  <sub>report.js:909</sub>

```text
Hai nút của màn nhập điểm (edu.system.reportAllTable_User / showReportAndImportTable_User(true),
Core:7392 / Core:7557):
  R.taiBangNhap(table)   — "Tải bảng điểm": lưu từng ô (kèm id ô nhập) rồi mở BaoCao.aspx?type=input
  R.nhapBangTuTep(opts)  — "Nhập điểm qua file": hộp chỉ có ô tải tệp; nạp giá trị NGƯỢC vào các ô
                           nhập theo id rồi opts.onDone(). KHÔNG lưu — người dùng bấm Lưu sau.
Bảng phải có id (và thuộc tính colreport nếu có), ô nhập phải có id — tệp tải ra mang id đó,
nạp ngược dựa vào id đó (như bản gốc).
```

### `ums.report.nhapBangTuTep(opts)`  <sub>report.js:910</sub>

_(chưa có chú thích trong mã)_

### `ums.report.importChung(title, maDanhMuc, opts)`  <sub>report.js:922</sub>

_(chưa có chú thích trong mã)_

### `ums.upload(files, opts)`  <sub>report.js:1097</sub>

```text
ghi chú "Khac ban chinh"). SYS_Import/* nhận đúng chuỗi đó. opts.raw = true
để lấy nguyên văn.
```

### `ums.queue.mount(hostEl, opts)`  <sub>report.js:1159</sub>

```text
Vẽ các hàng đợi CHƯA xong (TONGDULIEUDAHOANTHANH ≠ TONGDULIEUCANTHUCHIEN)
kèm thanh tiến độ và nút "Bắt đầu", cùng bảng lịch sử mọi hàng đợi.

Khác bản gốc:
 · bản gốc chỉ gọi callback khi bộ đếm tiến độ chạm ĐÚNG tổng (bắt đầu
   từ số đã hoàn thành trước đó) — số nhiệm vụ còn lại lệch một chút là
   không bao giờ báo xong. Ở đây báo xong khi mọi lời gọi đã trả về.
 · lỗi kết nối của từng nhiệm vụ bản gốc chỉ alert, không tính là thất
   bại; ở đây tính là thất bại để còn hỏi "chạy lại".
 · nút Huỷ (.btnCancle) của bản gốc không làm gì — không vẽ.
 · taskControl (thanh tác vụ ở đầu trang, #sysTask_Content) không chép:
   updateStatus_Task dùng biến `me` chưa khai báo nên sẽ ném lỗi nếu
   có lúc chạy tới; màn hình Tài chính cũng không dùng.
```

### `ums.files.mount(hostEl, o)`  <sub>report.js:1375</sub>

_(chưa có chú thích trong mã)_

### `ums.files.avatar(hostEl, o)`  <sub>report.js:1539</sub>

_(chưa có chú thích trong mã)_


---

## editor.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.editor — trình soạn thảo văn bản (CKEditor 4 của ứng dụng cha) + dàn công thức toán (MathJax)
   Bản gốc (indexi.aspx:1879-1886) nạp SẴN cho mọi màn: Scripts/ckeditor/ckeditor.js, Scripts/ckfinder/ckfinder.js,
   Scripts/ckeditor/plugins/ckeditor_wiris/integration/WIRISplugins.js và MathJax; màn gọi thẳng
   CKEDITOR.replace('id') / MathJax.typesetPromise([el]). Thư mục Scripts/ KHÔNG có trong kho (chỉ có trên host),
   _v2 nằm ngay dưới gốc ứng dụng nên ở đây nạp LÚC CHẠY bằng đường dẫn `../Scripts/…` (như index.aspx lùi về
   ../Config.js), CHỈ khi màn cần và chỉ MỘT lần cho cả phiên.

   Hợp đồng (các màn Quản lý thi trắc nghiệm, Bộ đề… gọi — GIỮ ĐÚNG TÊN):
       ums.editor.tao(textarea, { cao, congCu })  → Promise<{ get(): html, set(html), destroy(), loai: 'ck' | 'textarea' }>
           cao     chiều cao vùng soạn (px, mặc định 220)
           congCu  mảng toolbar CKEditor 4 (bỏ trống = cấu hình mặc định của host Scripts/ckeditor/config.js —
                   đúng như bản gốc gọi CKEDITOR.replace không kèm config, nên WIRIS / CKFinder theo config đó)
       ums.editor.toan(el)                        → Promise<boolean>  dàn công thức toán trong el; không có MathJax thì không làm gì
       ums.editor.sanSang()                       → Promise<boolean>  CKEditor đã nạp được chưa (nạp nếu chưa)
       ums.editor.html(chuoi)                     → chuỗi HTML máy chủ trả (nội dung CKEditor) đã bỏ <script>, thuộc tính on*,
                                                     javascript: — dùng khi hiện nội dung câu hỏi / đáp án
       ums.editor.donDep()                        huỷ các trình soạn thảo mà ô nhập không còn trong trang (tự gọi khi đổi màn)

   Lùi về <textarea> thường (KHÔNG lỗi, cùng get/set) khi: chế độ dữ liệu mẫu (không gọi mạng), tệp ../Scripts/… 404,
   CKEDITOR.replace ném lỗi, hoặc ô nhập đã bị gỡ khỏi trang trước khi CKEditor về.

   Đường dẫn mặc định ở ums.editor.DUONG_DAN; host đặt khác thì khai `editor: { ckeditor, ckfinder, wiris, mathjax }` trong
   site.config.js (tuỳ chọn, không bắt buộc; `editor.tat = true` = luôn dùng textarea). MathJax: bản gốc indexi nạp
   v2 từ cdn.mathjax.org (CDN đã ngừng) nhưng mã màn lại gọi API v3 (typesetPromise) → ở đây nạp bản v3 trong ứng dụng cha
   `../Scripts/MathJax/es5/tex-mml-chtml.js` (đường dẫn index.aspx:1868 từng khai); không có tệp → không dàn công thức,
   không lỗi. Không dùng CDN (bẫy số 4 CLAUDE.md).
```

</details>

### `ums.editor.sanSang()`  <sub>editor.js:63</sub>

```text
 ---------- CKEditor -------------------------------------------------- 
```

### `ums.editor.tao(ta, o)`  <sub>editor.js:141</sub>

```text
ums.editor.tao(textarea, { cao, congCu }) → Promise<{ get, set, destroy, loai }>
`textarea` là phần tử <textarea> ĐÃ nằm trong trang (hoặc id của nó).
```

### `ums.editor.donDep()`  <sub>editor.js:154</sub>

```text
 Huỷ trình soạn thảo của ô nhập đã rời khỏi trang (đổi màn, đóng biểu mẫu mà màn quên destroy) 
```

### `ums.editor.toan(el)`  <sub>editor.js:186</sub>

```text
ums.editor.toan(el) → Promise<boolean>: dàn công thức toán ($…$, \(…\), MathML) trong el.
Không có MathJax (dữ liệu mẫu, host không có tệp) → không làm gì, không lỗi.
```

### `ums.editor.html(s)`  <sub>editor.js:204</sub>

```text
 Bỏ <script>, thuộc tính on*, href/src javascript: — phần còn lại giữ nguyên (định dạng, ảnh, công thức) 
```


---

## lamtruoc.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.lamTruoc — khung "Cần làm trước" (người dùng chốt 2026-10-05)
   Màn thiếu DỮ LIỆU NGHIỆP VỤ mà người dùng tự khai được ở một màn khác
   (danh mục chưa có giá trị, chưa có bản ghi cha, mẫu import chưa phân quyền…)
   thì KHÔNG phải lỗi backend: vỏ TỰ PHÁT HIỆN lúc nạp màn và bật một khung
   ngay dưới khung "Ghi chú chuyển đổi": việc cần làm + liên kết mở thẳng màn
   khai + dấu × để tắt.

   Phát hiện:
     · TỰ ĐỘNG — mọi danh mục dùng chung (ums.api.dm) trả 0 dòng trong lúc màn
       đang mở → "Danh mục <MÃ> chưa có giá trị". Liên kết: màn Danh mục dữ liệu
       của vai trò đang mở, không có thì bản Quản trị hệ thống (CMS) ở vai trò
       khác; mở xong tự chọn đúng danh mục (bản DKH / Tài chính đọc
       ums.lamTruoc.layDanhMucCho()).
     · BẢNG NGUỒN (L.NGUON) — lời gọi khác trả rỗng mà đã biết phải khai ở màn
       nào (hệ thống biên lai, mẫu hồ sơ…): khai một dòng, mọi màn dùng nguồn đó
       tự có thông báo.
     · MÀN TỰ KHAI — nguồn khác trả rỗng mà màn biết phải khai ở đâu:
           ums.lamTruoc.can({
               o: 'Kế hoạch tuyển dụng',            // ô / vùng đang thiếu
               viec: 'Thêm ít nhất một kế hoạch',    // cần làm gì
               man: '/Modules/kehoach/html/kehoach.html',   // ĐUÔI đường dẫn màn khai (tuỳ chọn)
               tenMan: 'Kế hoạch tuyển dụng'         // tên hiện khi chưa tìm được màn
           });
       hoặc gọn trong .then của lời gọi nạp:  rows = ums.lamTruoc.neuRong(rows, { … })
     Trùng (cùng danh mục / cùng ô) chỉ hiện một lần.

   Tắt: site.config.js → behavior.lamTruoc = false, hoặc Cài đặt → Hành vi (ghi đè localStorage). Chế độ dữ liệu mẫu chỉ bật
   khi URL có `lamtruoc` (dữ liệu mẫu thiếu nhiều danh mục → báo nhiễu).
   Bấm × : ẩn khung của MÀN đó tới hết phiên (sessionStorage), mục mới phát sinh
   sau đó vẫn hiện lại.
```

</details>

### `ums.lamTruoc.batDau(host, url, cn)`  <sub>lamtruoc.js:60</sub>

```text
 Vỏ gọi mỗi lần mở một chức năng (app.js openFunction) — xoá khung cũ, bắt đầu gom cho màn mới. 
```

### `ums.lamTruoc.danhMucRong(ma)`  <sub>lamtruoc.js:80</sub>

```text
 api.js gọi khi một danh mục dùng chung trả 0 dòng 
```

### `ums.lamTruoc.sauGoi(opts)`  <sub>lamtruoc.js:102</sub>

```text
 api.js gọi khi MỌI lời gọi trả 0 dòng 
```

### `ums.lamTruoc.can(o)`  <sub>lamtruoc.js:112</sub>

```text
 Màn tự khai 
```

### `ums.lamTruoc.neuRong(rows, o)`  <sub>lamtruoc.js:113</sub>

_(chưa có chú thích trong mã)_

### `ums.lamTruoc.layDanhMucCho()`  <sub>lamtruoc.js:116</sub>

```text
 Màn Danh mục dữ liệu đọc một lần sau khi nạp cây danh mục 
```

### `ums.lamTruoc.giuViTri()`  <sub>lamtruoc.js:167</sub>

```text
 Khung Ghi chú vẽ SAU khung này (veCanQuyet chèn lên đầu) → giữ khung này ngay dưới Ghi chú 
```


---

## app.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   Khung ứng dụng — điều hướng ba tầng trong một trang
       #/                          trang chủ, lưới vai trò
       #/r/<vaiTroId>              chọn vai trò, đổ cây chức năng ra cột trái
       #/r/<vaiTroId>/<chucNangId> mở một chức năng vào vùng nội dung

   Khác hệ hiện hành ở chỗ tầng 3 KHÔNG rời trang: không còn
   `location.href = "./indexi.aspx"`, không còn cột TENANH làm router.

   Hai chế độ, chọn bằng `api.dataSource` trong site.config.js:
       api   — gọi microservice thật (chạy trên máy chủ, mở index.aspx)
       demo  — dữ liệu dựng thử, không gọi mạng (mở index.html trên máy)
       auto  — có AXYZCLRVN() thì api, không thì demo
```

</details>

### `ums.app.openPath(path)`  <sub>app.js:824</sub>

_(chưa có chú thích trong mã)_

### `ums.app.openHash(ma)`  <sub>app.js:837</sub>

```text
 Mở chức năng theo MÃ HIỂN THỊ (DUONGDANHIENTHI, vd "#tintuc") — thay
edu.system.triggerChucNang_MaHienThi (Core/systemroot.js:6514). 
```

### `ums.app.timManTheoDuongDan(duoi)`  <sub>app.js:847</sub>

```text
 Tìm màn theo ĐUÔI đường dẫn (đầy đủ, có tiền tố phân hệ như screenUrl — vd 'apiscms/modules/danhmuc/html/danhmucdulieu.html'
hoặc chỉ '/danhmuc/html/danhmucdulieu.html') cho khung "Cần làm trước" (lamtruoc.js). Trả Promise<mảng { r, rn, id, n, url, hash }>:
màn của vai trò đang mở trước, sau đó chỉ mục mọi vai trò của ô tìm màn (nạp một lần mỗi phiên). Không kiểm tệp có trong _v2 —
lamtruoc.js tự kiểm trước khi nhảy. 
```

### `ums.app.hrefChucNang(id)`  <sub>app.js:863</sub>

```text
 Đường dẫn hash mở một chức năng theo id — cho thẻ <a> (lối tắt ở bảng điều khiển) 
```

### `ums.app.soanBaiChoPhep()`  <sub>app.js:870</sub>

_(chưa có chú thích trong mã)_

### `ums.app.xuatMapping(onTienDo)`  <sub>app.js:891</sub>

```text
 Xuất MAPPING chức năng (màn Cài đặt, nút "Xuất mapping" — 2026-09-26). Danh mục Function ID chuẩn để nạp vào
Cổng Help (tài liệu _v2/docs: STR-03 / STR-05 import danh mục chức năng, HELP-08 / CTX-01 mapping Function ID ↔ bài
Help) và để theo dõi chuyển đổi (cờ `converted`).
NGUỒN = TOÀN BỘ CSDL (người dùng: "phải lấy đủ trong csdl vì sẽ phải chuyển hết"), KHÔNG theo menu của tài khoản:
CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachUngDung → với TỪNG ứng dụng LayDanhSachChucNang
(đúng lời gọi của màn Quản trị → Chức năng, ApisCMS/chucnang). Tài khoản xuất phải có quyền gọi hai thủ tục đó.
Chế độ dựng thử: không có CSDL → lấy cây menu mẫu của mọi vai trò (source "demo").
converted: tệp màn đã có trong _v2 chưa (GET đúng đường dẫn vỏ nạp — screenUrl). onTienDo(chữ). 
```


---

## session.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.session — khôi phục phiên đăng nhập từ vỏ ASPX
   Đây là bản viết lại sạch của hàm `AFG()` nằm trong
   `assets/pagination/jquery.simplePagination.min.js` của hệ hiện hành.

   Chuỗi khởi tạo thật của hệ thống:

       <script>AXYZCLRVN = () => "<%= lblXYZCLRVN %>"</script>   ← máy chủ bơm
       assets/js/crypto-js.js        → cung cấp AE() và AD()
       Config.js                     → cung cấp Init_API() (29 base URL)

   Blob do máy chủ bơm ra là JSON đã mã hoá bằng khoá "AzzS", giải ra được:
       rootPath · rootPathUpload · rootPathReport · rootPathAPI
       folderAvatar · folderDoc · clientIP
       userId · appId · langId · tokenJWT · raven · avatar

   Module này CHỈ giải mã và cất giữ. Không dựng menu, không gọi API —
   khác với AFG() bản gốc vốn làm cả ba việc trong một hàm.
```

</details>

### `ums.session.init()`  <sub>session.js:93</sub>

```text
 ---------- Khởi tạo -------------------------------------------------- 
```

### `ums.session.logout()`  <sub>session.js:133</sub>

```text
 ---------- Kết thúc phiên -------------------------------------------- 
```


---

## can-quyet.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.canQuyet — sổ những điểm CẦN NGHIỆP VỤ QUYẾT / CẦN KIỂM TRÊN HOST của từng màn đã chuyển.
   Vỏ (app.js) hiện một khung thu gọn "Cần quyết" ở đầu màn có mục trong sổ này.
   Tắt hẳn: site.config.js → behavior.canQuyet = false (khi giao cho người dùng thật).
   Khoá = "<Phân hệ>/Modules/<module>/<tệp html không đuôi>". Mỗi mục:
       q    câu hỏi / điểm cần quyết (bắt buộc)
       now  bản mới đang làm gì trong lúc chờ (tuỳ chọn)
       host true = không phải câu hỏi, chỉ cần KIỂM TRÊN HOST (đường ghi chưa từng chạy, tên cột đoán…)
       ben  'oracle' | 'nghiepvu' = việc giao NGƯỜI KHÁC xử lý (rút từ kiểm thử trực tiếp trên host,
            _harness/kiem-host). Khung hiện nhóm riêng; nút "Xuất việc cần xử lý" gom mọi màn, chia nhóm.
   Quyết xong một mục thì XOÁ mục đó ở đây (và sửa màn theo quyết định), ghi câu + quyết định vào
   _v2/CAN-QUYET-DA-CHOT.md. Chốt hàng loạt: node _harness/chot-can-quyet.js (đã chạy 2026-09-24).
   Hằng CCB / TC / CSV dùng khi thêm câu mới: them(TC + 'module/tep', [{ q: '…', now: '…' }]).
```

</details>

### `ums.canQuyetKhoa(url)`  <sub>can-quyet.js:313</sub>

_(chưa có chú thích trong mã)_


---

## diemhoc.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.diemHoc — bảng điểm & học tập chi tiết của MỘT người học (dùng chung)
   Bản viết lại của lớp DiemHoc (Cổng sinh viên "diemhoc", chép nguyên vào
   hoatdong/DaQHHT.html của Cổng cán bộ). Một khung, gọi bằng id người học:

       var dh = ums.diemHoc.mount(host, { nguoiHocId: 'QLSV_NGUOIHOC_ID' });
       dh.destroy()

   Bố cục bản gốc: cột trái (col-3) ô Chương trình, thông tin người học,
   "Điểm mới", "Tổng điểm"; cột phải (col-9) tám tab: Bảng điểm · Học phần nợ ·
   Khối kiến thức · Kết quả đăng ký học · Quyết định · Văn bằng - chứng chỉ ·
   Cảnh báo học vụ · Điểm rèn luyện.
   Lời gọi (chép nguyên, mã hoá) — SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.*:
       LayThongTinChuongTrinhHoc      ô Chương trình (tự chọn mục đầu)
       KetQuaHocTapCaNhan             thông tin, điểm mới, tổng điểm, bảng điểm, học phần nợ
       LayKetQuaTichLuyTheoKhoi       khối kiến thức (rsTongHop, rsChiTiet)
       LayDSKetQuaXuLyHocVu           cảnh báo học vụ
       LayDSThoiGianLichHoc / LayKetQuaDangKyHocCaNhan   kết quả đăng ký + lịch sử
       LayDSDiemThanhPhanTheoTKHP     hộp "Chi tiết điểm thành phần"
       LayDSQDCaNhan · LayDSTN_KetQua_CongNhan_VB · LayKQRenLuyenCaNhan
   Khác bản gốc (lỗi rõ):
     · Mỗi lần mở gắn thêm trình xử lý → N lần mở thì một bấm gọi N lần. Ở đây
       mỗi khung một bộ trình xử lý, gỡ khi destroy.
     · Dòng "Điểm trung bình hệ 10" của từng học kỳ lấy nhầm điểm TÍCH LUỸ.
     · Điểm rèn luyện nạp một lần theo chương trình lúc mở (có khi của người học
       trước) — ở đây nạp lại khi đổi chương trình.
   Nút "Điểm quá trình": trang gốc của Cổng SV CÓ hộp nên nút mở hộp thật
   (LatKetQuaDiemQuaTrinh). Màn chép lại mà không có nguồn thì truyền
   o.diemQuaTrinh = false để giữ nút khoá như trước.
   Kéo gốc 30/9 (Cổng SV hoctap/diemhoc):
     · Bấm CẢ DÒNG bảng điểm là mở "Chi tiết điểm thành phần" (gốc: tr.row-diem), không
       chỉ nút Chi tiết — veBangDiem gắn data-tp lên <tr> khi có cột Chi tiết (chiTiet !== false),
       nên mọi nơi có nút Chi tiết đều được; nơi tắt cột (In bảng điểm, QLD) không đổi.
     · Tổng điểm thêm dòng "Tổng số tín chỉ chương trình" ← TONGSOTINCHICTDT và đổi chữ hai
       dòng tín chỉ ("đã học", "đã tích lũy") — QUA TUỲ CHỌN veTongKet(el, lay, { ctdt: true }) /
       mount(host, { ctdt: true }); mặc định giữ sáu dòng cũ (bản chép ở CCB DaQHHT không đổi).
       mount(host, { ctdt: true }) = "khuôn Cổng SV mới": có cả dòng CTDT lẫn bấm cả dòng (XLHV nhúng
       CHÍNH trang Cổng SV nên bật); không có ctdt (CCB DaQHHT) thì bảng điểm chỉ mở bằng nút Chi tiết như cũ.
       Gọi thẳng veBangDiem mặc định BẬT bấm cả dòng (Cổng SV diemhoc); tắt bằng { bamDong: false }.
     · Bảng rỗng: câu "chưa có …" riêng từng bảng như gốc (showEmptyState), trong khung
       rỗng chuẩn của ums.ui.table (biểu tượng chuẩn, không chép biểu tượng riêng từng bảng).
     · Gốc đổi resolveNguoiHocId: khi nhúng chỉ lấy main_doc.LichGiang.strSinhVien_Id (bỏ
       window._embeddedSinhVien_Id — trang XLHV gốc nhúng bằng biến đó nay rơi về id CÁN BỘ, lỗi của gốc).
       Ở đây id người học luôn truyền vào mount (o.nguoiHocId) nên không đổi, không lặp lỗi đó.
```

</details>


---

## lich.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.lich — lịch tuần theo giờ + lịch tháng nhỏ (dùng chung)
   Bản viết lại của cụm genHtml_Month / genTable_ThongTin trong
   lichgiang.js (Cổng cán bộ) — cùng một khuôn chép ở lichgiang, lichgiangadmin,
   lichgiangphonghoc và thoikhoabieusinhvien/lichhoc.

       var L = ums.lich.tao({
           thang: hostLichThang,          // lịch tháng nhỏ (cột phải của bản gốc)
           tuan:  hostLichTuan,           // lưới tuần theo giờ
           load:  function (tuan) → Promise<dòng>,   // tuan = { ngay, batdau, ketthuc, days[7] } (dd/mm/yyyy)
           mau:   'IDLOPHOCPHAN',         // cùng giá trị → cùng màu (bảng 5 màu của bản gốc)
           noiDung: function (dòng) → HTML thân ô lịch,
           onClick: function (dòng, phầnTửBấm),
           danhDau: function (dòng[]) → [số ngày trong tháng có lịch]   (DSNGAYCOLICH), tuỳ chọn
           sauKhiVe: function (dòng[], hostTuan)                          tuỳ chọn (vd nạp cảm xúc)
           ngayNgan: true                  đầu cột ngày chỉ hiện số ngày (ngày đủ ở title), tuỳ chọn
       });
       L.reload() · L.tuan · L.xoaDanhDau() · L.coLich([dd/mm/yyyy…])

   Dòng dữ liệu dùng các cột của bản gốc: NGAYHOC (dd/mm/yyyy), GIOBATDAU,
   PHUTBATDAU, GIOKETTHUC, PHUTKETTHUC. 1 phút = 1px, mỗi giờ 60px như bản gốc.

   Khác bản gốc (ghi lại):
     · Ô trùng giờ xếp CẠNH NHAU (bản gốc chồng khít lên nhau, ô sau che ô trước).
     · Tuần không có lịch vẫn vẽ 7:00–17:00 (bản gốc lichgiang vậy; bản
       lichhoc / phonghoc vẽ lưới trống không một dòng giờ).
     · Năm nhuận tính đúng (bản gốc chỉ xét chia hết cho 4).
     · Tiêu đề cột ngày dùng "Thứ 2 … CN" (bản gốc "Mon … Sun").
     · Ô bị cắt chữ thì rê chuột là mở rộng (bản gốc bật popover chép cả ô giờ).
```

</details>


---

## phieu.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   Xem / in chứng từ đã lưu — dùng chung cho thutienkhac, pos_thutien
   (phieuthu) và ruttien (phieurut)
   Bản gốc: edu.extend.getData_Phieu (Core/systemextend.js:2815) và các hàm
   nó gọi: getData_PhieuThu / getData_HoaDon / genData_PhieuThu /
   genData_HoaDon / genChonLien / remove_PhoiIn.

   Lời gọi (chép nguyên văn):
       TC_PhieuThu/LayTTPhieuThu_Rut      GET  strPhieuThu_Rut_Id    (PHIEUTHU, BIENLAI, BIENLAIRUT)
       TC_HoaDon/LayTTHoaDonThu_Rut       GET  strHoaDonThu_Rut_Id   (HOADON)
       HDDT_HoaDon/GetFiles               GET  (hoá đơn điện tử — lấy đường dẫn tệp)
       TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT  POST (lưu lại đường dẫn tệp vừa lấy)

   Mẫu in: tệp HTML của từng trường ở <rootPath>/Upload/Files/PrintTemplate/
   <MAUIN_MASO>.html (MAUIN_MASO có dấu phẩy = nhiều mẫu, lấy mẫu đầu, cho
   chuyển mẫu). Mẫu mặc định theo loại:
       PHIEUTHU   DHTL_PHIEUTHU_NHAPHOC_2018
       BIENLAI    DHGTVT_PHIEUTHU_2018
       BIENLAIRUT DHCNTTTN_BIENLAIRUT_2018
       HOADON     HOADONDHLUAT

   Đổ dữ liệu vào mẫu — bản gốc có 21 hàm genKhoanThu_<MẪU> cho phiếu và 9
   hàm cho hoá đơn. Đã đối chiếu từng hàm (diff): 9 hàm phiếu giống hệt nhau
   trừ vài dòng, gộp thành fillPhieu() với tuỳ chọn ở bảng FILL_PHIEU. Hoá
   đơn chỉ chuyển HOADONDHLUAT (mẫu mặc định). Mẫu chưa chuyển thì làm đúng
   như nhánh `default:` của bản gốc: nạp lại MẪU MẶC ĐỊNH — kèm thông báo.

   Khác bản gốc, có chủ đích:
     · Mẫu in có <style> toàn cục (body, .bold, .text-center…). Bản gốc nạp
       thẳng vào trang nên kiểu của mẫu đè lên cả giao diện. Ở đây mẫu được
       dựng tách rời rồi hiện trong <iframe>, không rò kiểu ra ngoài.
     · Giá trị đổ vào mẫu đi qua textContent (bản gốc .html() — chèn HTML
       thô từ máy chủ).
     · Mã QR của HOADONDHLUAT: vẽ bằng qrcode.min.js (nếu trang có nạp)
       rồi đổi canvas thành ảnh để in được.
```

</details>

### `ums.phieu.neutral(rs, dt, loai)`  <sub>phieu.js:303</sub>

_(chưa có chú thích trong mã)_

### `ums.phieu.viewer(host, opts)`  <sub>phieu.js:351</sub>

```text
Khung xem chứng từ
var v = ums.phieu.viewer(hostEl, { tools: elCôngCụ })
v.show({ id, loai })            thay nội dung (xem 1 chứng từ)
v.add({ id, loai })             nối thêm, ngắt trang (in theo lô)
v.clear() · v.print() · v.count()
show/add trả Promise<dòng rs[0] | null> — tương đương callback bản gốc
```


---

## thuvai.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   Thủ vai — cán bộ vào một vai trò CHOPHEPTHUVAI = 1 (vd "Cổng sinh viên - thủ vai")
   dưới danh nghĩa một người học: ums.thuVai.*
   Bản viết lại của Core/systemroot.js: khối '.ungdung' click (hộp "Nhập thông tin
   định danh", Core:232-420), _saveThuVaiSession / _restoreThuVaiSession / _thoatThuVai
   (Core:92-123), thẻ "Đang xem — …" đầu cột trái (Core:6436) và _autoThuVaiSV (Core:4985).
   Giống bản gốc:
     · Tìm bằng PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh (ID / MSSV / họ tên / email),
       gợi ý khi gõ (≥ 2 ký tự, trễ 350 ms), một kết quả thì vào luôn, nhiều thì bấm chọn.
     · Vào vai: userId của phiên = ID người học (mọi màn Cổng SV đọc edu.system.userId làm
       strSinhVien_Id / strNguoiThucHien_Id), strNguoiThucVai_Id = ID cán bộ thật — api.js
       gửi kèm MỌI lời gọi qua ums.state.thuVaiId.
     · Giữ qua F5 bằng sessionStorage (mỗi tab riêng, đóng tab là mất).
     · localStorage.pendingThuVaiSV = { strMSSV } (tab mở từ màn cán bộ) → tự vào vai.
   Khác bản gốc (sửa lỗi):
     · Rời vai (nút × trên thẻ, về trang chủ, chọn vai trò khác) TRẢ LẠI userId cán bộ. Gốc
       chọn vai trò khác ngay trong trang thì userId vẫn là ID sinh viên, và sessionStorage
       không xoá nên F5 lại rơi vào thủ vai.
```

</details>

### `ums.thuVai.hienTai(roleId)`  <sub>thuvai.js:38</sub>

```text
 Thủ vai đang giữ cho vai trò roleId (null nếu không) 
```

### `ums.thuVai.ap(tv)`  <sub>thuvai.js:43</sub>

```text
 Áp thủ vai vào phiên: userId = người học, thuVaiId = cán bộ thật 
```

### `ums.thuVai.bo()`  <sub>thuvai.js:49</sub>

```text
 Rời vai: trả userId cán bộ, xoá khỏi sessionStorage 
```

### `ums.thuVai.chon(role, goiSan)`  <sub>thuvai.js:76</sub>

```text
 Hộp "Nhập thông tin định danh" → Promise<tv> (reject khi đóng hộp mà chưa chọn) 
```

### `ums.thuVai.theHtml(tv)`  <sub>thuvai.js:146</sub>

```text
 Thẻ "Đang xem — …" đặt đầu cột trái 
```

### `ums.thuVai.tuDong(roles)`  <sub>thuvai.js:158</sub>

```text
 Tab mở từ màn cán bộ: localStorage.pendingThuVaiSV = { strMSSV } → tự tìm rồi vào vai.
roles: danh sách vai trò đã chuẩn hoá; trả Promise<{ role, tv }> hoặc null khi không có yêu cầu. 
```


---

## scroll.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.scroll — thanh trượt tự vẽ, đặt chồng lên nội dung
   Thanh trượt của trình duyệt chiếm chỗ thật trong bố cục (thường 9–17px),
   làm nội dung hẹp lại và để hở một dải trống bên phải. Module này ẩn thanh
   trượt gốc và vẽ lại một thanh nổi phía trên nội dung.

   Dùng:
       ums.scroll.attach('#navScroll');     // hoặc truyền thẳng phần tử
       ums.scroll.refresh(el);              // gọi lại khi nội dung đổi

   Tự theo dõi thay đổi nội dung bằng MutationObserver và ResizeObserver nên
   phần lớn trường hợp không cần gọi refresh thủ công.
```

</details>

### `ums.scroll.refresh(target)`  <sub>scroll.js:114</sub>

_(chưa có chú thích trong mã)_


---

## icon-fa4.js

<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>

```text
   ums.iconFA4(tên) — đổi tên icon Font Awesome 4 (TENANH của bảng chức năng, vd "fa fa-money") sang Font Awesome 7.
   TỰ SINH bởi _harness/sinh-fa4.py (đối chiếu mã ký tự FA4 / v4-shims FA 6.4.2 / FA7) — đừng sửa tay, chạy lại script.
   ums.iconFA4('fa fa-bar-chart')  -> 'fa-light fa-chart-bar'
   ums.iconFA4('fa fa-facebook')   -> 'fa-brands fa-facebook'
   Tên đã là cú pháp FA6/7 (fa-light …, fa-solid …) thì giữ nguyên.
```

</details>

### `ums.iconFA4(t, kieu)`  <sub>icon-fa4.js:206</sub>

_(chưa có chú thích trong mã)_

