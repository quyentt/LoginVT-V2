# API tầng chung `_v2` — SINH TỰ ĐỘNG từ chú thích trong mã

Chạy lại: `python _harness\sinh-api.py` (sau mỗi lần sửa `_v2/assets/js/*.js`). KHÔNG sửa tay tệp này — sửa chú thích đầu hàm trong mã.
Chuyển màn: đọc tệp này (tìm theo tên hàm) thay vì mở mã tầng chung. Tuỳ chọn của `ums.crud` nằm ở khối đầu `crud.js`.
Lớp CSS có sẵn: `_v2/CLASS.md`. Tóm tắt màn gốc: `python _harness\tom-tat-goc.py <html> [js]`.

## Mục lục

- **api.js** (4 hàm): `ums.util.xorB64`, `ums.util.unXor`, `ums.util.ngaySinh`, `ums.util.uuid`
- **ui.js** (43 hàm): `ums.ui.escBr`, `ums.ui.money`, `ums.ui.so`, `ums.ui.docSo`, `ums.ui.truot`, `ums.ui.moDetails`, `ums.ui.ngayGio`, `ums.ui.empty`, `ums.ui.btn`, `ums.ui.iconBtn`, `ums.ui.actions`, `ums.ui.badge`, `ums.ui.chips`, `ums.ui.tabs`, `ums.ui.tabsActive`, `ums.ui.tile`, `ums.ui.cell`, `ums.ui.meter`, `ums.ui.table`, `ums.ui.oTheoGoc`, `ums.ui.pagerBind`, `ums.ui.pager`, `ums.ui.options`, `ums.ui.filterInput`, `ums.ui.filterSelect`, `ums.ui.field`, `ums.ui.toast`, `ums.ui.confirm`, `ums.ui.xoaChon`, `ums.ui.dialog`, `ums.ui.batch`, `ums.ui.print`, `ums.ui.fail`, `ums.ui.datepicker`, `ums.ui.select2`, `ums.ui.hoverCard`, `ums.ui.file`, `ums.ui.enhance`, `ums.ui.chart`, `ums.ui.reveal`, `ums.ui.swap`, `ums.ui.taiTep`, `ums.ui.xuatXls`
- **crud.js** (1 hàm): `ums.crud`
- **patterns.js** (0 hàm): 
- **ref.js** (0 hàm): 
- **report.js** (1 hàm): `ums.upload`
- **editor.js** (5 hàm): `ums.editor.sanSang`, `ums.editor.tao`, `ums.editor.donDep`, `ums.editor.toan`, `ums.editor.html`
- **lamtruoc.js** (7 hàm): `ums.lamTruoc.batDau`, `ums.lamTruoc.danhMucRong`, `ums.lamTruoc.sauGoi`, `ums.lamTruoc.can`, `ums.lamTruoc.neuRong`, `ums.lamTruoc.layDanhMucCho`, `ums.lamTruoc.giuViTri`
- **app.js** (0 hàm): 
- **session.js** (0 hàm): 
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

### `ums.ui.oTheoGoc(row)`  <sub>ui.js:438</sub>

```text
 Các ô của một dòng theo thứ tự cột GỐC: các ô đã dời xuống cuối bảng (ô chọn dòng, Thao tác —
data-cot-goc) được đặt lại về vị trí màn khai. Dùng ở nơi đọc ô theo chỉ số. 
```

### `ums.ui.pagerBind(host, page)`  <sub>ui.js:451</sub>

```text
 Gắn sự kiện cho thanh phân trang vừa vẽ — số trang (data-go) và số dòng
mỗi trang (data-size). Mọi nơi vẽ ums.ui.pager đều gọi hàm này để không
chỗ nào quên gắn một trong hai. 
```

### `ums.ui.pager(page, shown)`  <sub>ui.js:477</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.options(data, cfg)`  <sub>ui.js:550</sub>

```text
 ---------- Biểu mẫu --------------------------------------------------- 
```

### `ums.ui.filterInput(label, opts)`  <sub>ui.js:581</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.filterSelect(label, data, opts)`  <sub>ui.js:591</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.field(label, control, opts)`  <sub>ui.js:602</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.toast(msg, tone, opts)`  <sub>ui.js:639</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.confirm(msg, opts)`  <sub>ui.js:699</sub>

```text
 ---------- Hộp xác nhận ------------------------------------------------
Thay cho edu.system.confirm + $("#btnYes").click(...) của hệ cũ — cách
cũ gắn thêm một trình xử lý mỗi lần mở hộp, bấm lần thứ ba là xoá ba
lần. Ở đây trả Promise<boolean>, mỗi lần mở là một hộp mới.

ums.ui.confirm('Xoá 3 dòng đã chọn?', { tone: 'bad', ok: 'Xoá' })
.then(function (yes) { if (yes) … });                        
```

### `ums.ui.xoaChon(chon, o)`  <sub>ui.js:767</sub>

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

### `ums.ui.dialog(o)`  <sub>ui.js:842</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.batch(calls, opts)`  <sub>ui.js:903</sub>

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

### `ums.ui.print(what, opts)`  <sub>ui.js:957</sub>

```text
 ---------- In ----------------------------------------------------------
Thay edu.util.printHTML(divId) (Core/util.js:40): mở cửa sổ mới chỉ
chứa nội dung cần in. Nhận id, phần tử, hoặc chuỗi HTML.
`css` thêm kiểu riêng cho bản in (mẫu phiếu thu, hoá đơn…).          
```

### `ums.ui.fail(msg, retryAttr)`  <sub>ui.js:981</sub>

```text
 Khối báo lỗi đặt trong vùng nội dung, kèm nút thử lại 
```

### `ums.ui.datepicker(sel, opts)`  <sub>ui.js:992</sub>

```text
 ---------- Gắn thư viện ngoài ----------------------------------------- 
```

### `ums.ui.select2(sel, opts)`  <sub>ui.js:1076</sub>

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

### `ums.ui.hoverCard(khung, chon, dung)`  <sub>ui.js:1212</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.file(opts)`  <sub>ui.js:1267</sub>

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

### `ums.ui.enhance(root)`  <sub>ui.js:1281</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.chart(canvas, cfg)`  <sub>ui.js:1350</sub>

_(chưa có chú thích trong mã)_

### `ums.ui.reveal(el, opts)`  <sub>ui.js:1371</sub>

```text
 Hiện một vùng đang ẩn, kèm hiệu ứng trượt lên 
```

### `ums.ui.swap(out, into, opts)`  <sub>ui.js:1398</sub>

```text
 Ẩn vùng này, hiện vùng kia kèm hiệu ứng. Trả về vùng vừa hiện. 
```

### `ums.ui.taiTep(ten, kieu, noiDung)`  <sub>ui.js:1476</sub>

```text
 ---------- Tải tệp dựng ở máy khách -----------------------------------
ums.ui.taiTep('ten.csv', 'text/csv;charset=utf-8', noiDung)
ums.ui.xuatXls('DSSV_20260922.xls', { tieuDe, cot: [{ title, get(dòng) }], dong })
Excel ở đây là BẢNG HTML lưu đuôi .xls (Excel mở được, không cần thư viện
SheetJS tải từ CDN như vài màn gốc — _v2 không phụ thuộc CDN).        
```

### `ums.ui.xuatXls(ten, o)`  <sub>ui.js:1481</sub>

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

### `ums.crud(cfg)`  <sub>crud.js:946</sub>

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

### `ums.upload(files, opts)`  <sub>report.js:1097</sub>

```text
ghi chú "Khac ban chinh"). SYS_Import/* nhận đúng chuỗi đó. opts.raw = true
để lấy nguyên văn.
```


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

   Tắt: site.config.js → behavior.lamTruoc = false. Chế độ dữ liệu mẫu chỉ bật
   khi URL có `lamtruoc` (dữ liệu mẫu thiếu nhiều danh mục → báo nhiễu).
   Bấm × : ẩn khung của MÀN đó tới hết phiên (sessionStorage), mục mới phát sinh
   sau đó vẫn hiện lại.
```

</details>

### `ums.lamTruoc.batDau(host, url, cn)`  <sub>lamtruoc.js:60</sub>

```text
 Vỏ gọi mỗi lần mở một chức năng (app.js openFunction) — xoá khung cũ, bắt đầu gom cho màn mới. 
```

### `ums.lamTruoc.danhMucRong(ma)`  <sub>lamtruoc.js:79</sub>

```text
 api.js gọi khi một danh mục dùng chung trả 0 dòng 
```

### `ums.lamTruoc.sauGoi(opts)`  <sub>lamtruoc.js:101</sub>

```text
 api.js gọi khi MỌI lời gọi trả 0 dòng 
```

### `ums.lamTruoc.can(o)`  <sub>lamtruoc.js:111</sub>

```text
 Màn tự khai 
```

### `ums.lamTruoc.neuRong(rows, o)`  <sub>lamtruoc.js:112</sub>

_(chưa có chú thích trong mã)_

### `ums.lamTruoc.layDanhMucCho()`  <sub>lamtruoc.js:115</sub>

```text
 Màn Danh mục dữ liệu đọc một lần sau khi nạp cây danh mục 
```

### `ums.lamTruoc.giuViTri()`  <sub>lamtruoc.js:166</sub>

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

### `ums.canQuyetKhoa(url)`  <sub>can-quyet.js:293</sub>

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

