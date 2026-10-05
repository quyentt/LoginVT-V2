# Chuyển một màn hình cũ sang giao diện mới

Tài liệu cho người (hoặc agent) chuyển màn hình của `ApisTaiChinh` (và các
phân hệ khác sau này) sang bộ giao diện `_v2`. Đọc hết trước khi viết dòng
đầu tiên. Sáu màn mẫu đã chuyển nằm ở
`_v2/ApisTaiChinh/Modules/danhmucheso/scripts/` — đọc
`khoanthu.js` và `taikhoanno.js` trước.

---

## 1. Mục tiêu và nguyên tắc

Màn hình mới phải làm **đúng những gì màn hình cũ làm với dữ liệu thật**:
cùng lời gọi, cùng tham số, cùng thứ tự thao tác. Chỉ đổi phần giao diện.

1. **Lời gọi API chép nguyên văn** từ tệp .js gốc: `action` (chuỗi mã hoá),
   `func`, tên từng tham số (kể cả chỗ viết hoa/thường lạ như `strMauso`,
   `strcanboquanly_id`), giá trị cố định (`dTrangThai: -1`, `pageSize: 1000000`).
   Không "chuẩn hoá", không đổi tên, không bỏ tham số. Procedure phía Oracle
   đọc đúng những tên đó.
2. **Tên cột trả về chép nguyên văn** từ `genTable_*`, `viewForm_*`,
   `viewEdit_*`, `mDataProp`, `aData.X` của bản gốc. Không đoán tên cột.
   Cột nào bản gốc không dùng thì đừng giả định nó tồn tại.
3. **Giữ nghiệp vụ, bỏ rác.** Giữ: kiểm tra hợp lệ, điều kiện bật/tắt nút,
   thứ tự gọi (lưu xong mới nạp lại…), tính toán tiền. Bỏ: mã chết, khối
   comment cũ, `fakedb`, ô `txtAAAA`/`dropAAAA` không tồn tại (thay bằng
   chuỗi rỗng — đó là giá trị thật bản gốc đang gửi).
4. **Lỗi của bản gốc**: nếu bản gốc rõ ràng sai (gọi nhầm procedure, lưu
   với id rỗng…), KHÔNG chép lỗi đó. Bỏ tính năng đó, ghi rõ trong chú
   thích đầu tệp .js và trong báo cáo. Nếu chỉ nghi ngờ thì giữ nguyên hành
   vi và ghi chú.
5. Không sửa bất cứ thứ gì trong thư mục gốc `ApisTaiChinh/`, `Core/`,
   `Corei/` — đó là hệ đang chạy.
6. **⚠ Ô chọn CHA → CON: BẮT BUỘC khoá con khi chưa chọn cha** (người dùng
   yêu cầu 2026-09-21 — KHÁC bản gốc, áp cho MỌI màn chuyển đổi từ nay).
   Cha → con là khi chọn ô A thì danh sách ô B nạp lại theo A: Hệ → Khoá →
   Chương trình → Lớp, Thời gian → Kế hoạch, Đơn vị tính → Thời gian,
   Nghiệp vụ → Khoản thu… Ba luật:
   - chưa chọn cha → con bị KHOÁ (bản gốc nạp sẵn nên chọn được con khi
     chưa có cha — không chép cái đó);
   - chọn hoặc XOÁ cha → xoá trắng con (bản gốc chỉ bắt `select2:select`,
     xoá cha thì con cũ vẫn nằm đó; `pat.fill` còn giữ giá trị cũ nếu nó có
     trong danh sách mới);
   - xoá cha thì khung dữ liệu đang hiện theo con phải về lời nhắc ban đầu,
     không để dữ liệu của lựa chọn cũ.

   Cách làm — MỘT dòng, đặt SAU các trình xử lý của màn:
   ```js
   ums.pat.chain([F.he, F.khoa, F.ct, F.lop]);             // màn nghe select2:select như bản gốc
   ums.pat.chain([F.tg, F.kh], { phatLai: false });        // màn đã tự nghe lúc xoá / nghe 'change'
   ```
   Dùng `ums.ref.cascade`, `ums.ref.cascadeQuyen`, `ums.dmhsB.cascadeQuyen`,
   `ums.dmhsB.mucPhi`, `A.boLoc` thì ĐÃ có sẵn, không gọi thêm. Ô nhiều cha
   (vd Học phần lọc theo cả Hệ, Khoá, CT) là lọc TUỲ CHỌN — không khoá, hỏi
   nếu không chắc. Ô mang nhãn "Tất cả …" cũng là lọc tuỳ chọn — hỏi trước.
   Ô trong HỘP THOẠI cũng phải theo luật này.
   Mẫu đầy đủ (kèm đưa khung về lời nhắc): `danhmucheso/scripts/khongbatno.js`.
   Kiểm: `_harness/do-phu-thuoc.html` in mọi cặp cha → con kèm KHOÁ/MỞ.
7. **Ô chọn trong BẢNG ít mục thì KHÔNG dùng select2** (người dùng chốt
   2026-09-22). Vẽ bảng qua `ums.ui.table` là tự đúng — `enhance` bỏ qua ô
   trong `.ums-table`, ô gốc đã vẽ giống hệt select2. Đừng tự dựng `<table>`,
   đừng tự gọi `ums.ui.select2()` cho ô trong bảng, và chỉ gắn `data-s2` khi
   danh sách dài tới mức phải gõ để tìm. Chi tiết: `BO-CUC.md` luật 2.

8. **⚠ Bốn luật giao diện người dùng chốt 2026-09-26 — màn nào vi phạm là phải sửa lại** (chi tiết `BO-CUC.md`
   luật 11–14; đã sửa khắp các phân hệ, đừng tạo lại lỗi cũ):
   - **Biểu mẫu: ô NGẮN hai ô một hàng, ô DÀI cả dòng.** `ums.crud` tự lo (bỏ qua `span` của ô ngắn, `formCols: 1` → 2 cột).
     Biểu mẫu tự dựng: `ums-grid ums-grid--2`, chỉ ô dài (mô tả, ghi chú, nội dung, ô nhiều dòng…) mới `grid-column: 1 / -1`.
     KHÔNG làm biểu mẫu một cột kéo dài hết khung, KHÔNG giới hạn bề ngang cho có (đã thử, người dùng bác).
   - **Cột trái (danh sách + ô tìm):** trên tiêu đề cột CHỈ có nút **Tải lại** (`fa-rotate-right`) + nút **Bộ lọc nâng cao**
     (`fa-sliders`, khi có ô lọc) — KHÔNG nút kính lúp; ô chọn lọc nằm trong `.ums-master__adv` ẨN SẴN ngay dưới ô tìm;
     KHÔNG nút "Tìm kiếm"; **gõ là tự tìm sau 400ms** (Enter tìm ngay), đổi ô chọn là tự tải. Dùng sẵn: `ums.pat.dsNhanSu` /
     `masterNhanSu` (danh sách cán bộ), `ums.crud` có `master`. Tự dựng bằng `pat.master` thì tự làm đủ 4 ý trên.
     KHÔNG tự chọn khi còn một kết quả; mục danh sách KHÔNG có nút sửa / xoá / xem (thao tác lên tiêu đề khung phải).
     Thanh lọc ĐẦU TRANG (có nút Tìm kiếm, nhiều ô) không thuộc luật này.
   - **Khung chi tiết của người / đối tượng đang chọn:** tên + trạng thái + tổng nợ / dư trên TIÊU ĐỀ khung, nút (Sửa, Đóng) ở
     tools; "Tổng tiền đã chọn" đặt NGAY TRƯỚC nút thao tác (Thu tiền / Rút tiền) của tab, không ở đầu khung; nút "Chi tiết" /
     thẻ số liệu mở HỘP THOẠI (ui.dialog), không đổ bảng xuống dưới hay nhảy tab.
   - **Nhóm nút:** nút chức năng → "Xoá đã chọn" (`ui.xoaChon`) → "Tải lại" (`ui.btn('reload')`, chỉ biểu tượng ↻) ở CUỐI;
     Tải lại / Xoá là nút nhẹ, nhỏ. Không viết tay nút Tải lại, không tô màu riêng. Ô chọn tệp `ui.file` viền như ô nhập.
   - **Số tiền: DẤU PHẨY ngăn nghìn, 0 số lẻ** (chốt 2026-09-26 — tiền Việt không có hàng lẻ). Hiển thị qua `ums.ui.money`,
     số đếm qua `ums.ui.so`, ô nhập qua `ums.pat.money`; KHÔNG tự `toLocaleString('vi-VN')` / `toLocaleString()` (ra dấu chấm trên
     máy tiếng Việt). Cấu hình ở `site.config.js` → `money`; nếu có lúc là USD thì đổi `decimals: 2`, `unit` — xem ghi chú ở đó.
   - **Khung "Chi tiết" chỉ xem (`.ums-kv`):** chỉ TÊN in đậm (dòng đầu tự đậm, dòng khác `.ums-kv--dam`), còn lại chữ thường.
   - **Hai cột theo người đang chọn:** mở biểu mẫu có nút Đóng riêng thì ẩn cả dòng tên phía trên (`pat.masterNhanSu` tự lo).
   - Danh sách trùng nhiều bản (cột cán bộ, ảnh người tròn, bộ lọc người học, màn trùng) → **tự gộp** lên tầng chung, không hỏi
     (người dùng: "giống nhau thì tự quyết gộp, đặt mình vào người dùng"). Có sẵn: `ums.pat.anhNguoi`, `pat.boLocNguoiHoc`.

9. **⚠ THÊM / SỬA LUÔN LÀ BIỂU MẪU TRONG TRANG — một chuẩn duy nhất cho mọi màn** (người dùng chốt 2026-09-30: "chuyển phải về một chuẩn
   nhất định"; chi tiết `BO-CUC.md` luật 1, danh sách đã rà ở `RA-HOP-THOAI.md`). Bản gốc mở `myModal…` để thêm / sửa thì bản mới KHÔNG bật
   hộp thoại:
   - Màn danh sách dựng bằng `ums.crud` → biểu mẫu của crud (đã đúng sẵn).
   - Màn tự dựng (lưới nhập, bảng xoay, bảng con trong màn chi tiết, màn con "danh sách + biểu mẫu") → `ums.pat.formTrang({ host, title, body, buttons })`.
   - Hộp thoại (`ums.ui.dialog`) CHỈ cho việc phụ: chọn (sinh viên, học phần, lớp, nhân sự, phạm vi, gán quyền bằng ô đánh dấu), xem chi tiết / danh
     sách chỉ đọc, xem trước / in, xác nhận / phê duyệt (kể cả có ô lý do), thao tác hàng loạt đặt một giá trị cho các dòng đã đánh dấu, tiến độ,
     gửi email, kế thừa / sao chép, nhập từ tệp, lịch sử.
   - Nút Lưu phải trả `false` rồi tự đóng khi máy chủ trả thành công — không để biểu mẫu đóng trước khi lưu xong.
   Kiểm: mở từng nút Thêm / Sửa của màn, `document.querySelectorAll('dialog[open]').length` phải bằng 0.

## 2. Đặt tệp ở đâu

Soi gương đúng cây thư mục gốc, bên trong `_v2/`:

```
Gốc:  ApisTaiChinh/Modules/<module>/html/<tên>.html
      ApisTaiChinh/Modules/<module>/scripts/<tên>.js     (hoặc script/ — giữ đúng tên thư mục gốc)

Mới:  _v2/ApisTaiChinh/Modules/<module>/html/<tên>.html
      _v2/ApisTaiChinh/Modules/<module>/scripts/<tên>.js
      _v2/ApisTaiChinh/Modules/<module>/scripts/<tên>.demo.js   (dữ liệu mẫu, mục 6)
```

Vỏ tự tìm tệp theo `MAUNGDUNG + DUONGDANFILE` của chức năng — có tệp là
chức năng tự bật, không khai báo ở đâu cả.

Tệp HTML tối giản, mọi markup do JS dựng qua `ums.crud` / `ums.ui`:

```html
<!--
    <Tên màn hình>
    Bản gốc: ApisTaiChinh/Modules/<module>/html/<tên>.html + scripts/<tên>.js
-->
<link rel="stylesheet" href="../css/<tên>.css">      ← chỉ khi màn có kiểu riêng
<div id="<tên>"></div>
<script src="../scripts/_chung.js"></script>          ← chỉ khi dùng tệp chung của module
<script src="../scripts/<tên>.js"></script>
```

**Trong tệp HTML chỉ có đúng ba loại dòng:** `<link>` tới tệp .css, một
`<div>` gốc, và `<script src>`. KHÔNG có khối `<style>`, KHÔNG có
`<script>` nội tuyến, KHÔNG có thẻ `.demo.js`.

- `src` / `href` tính theo vị trí tệp HTML. Script chạy tuần tự theo thứ tự trong tệp.
- **CSS** đặt ở `Modules/<module>/css/` (thư mục `css/` giống bản gốc):
  `css/<tên>.css` cho kiểu riêng của màn, `css/_chung*.css` cho kiểu dùng
  chung của module. Cũng KHÔNG chèn CSS bằng JS (`createElement('style')`,
  `'<style>' + …`). Nhiều màn cùng kiểu thì dùng chung một tệp, đừng chép.
  Ngoại lệ duy nhất: CSS nằm trong một tài liệu riêng (cửa sổ in, iframe
  mẫu in tải từ máy chủ). Cửa sổ in dùng `ums.ui.print(el, { cssHref: '…' })`.
- **Dữ liệu mẫu** không ghi trong HTML. Ở chế độ dựng thử, với mỗi `x.js`
  được nạp, vỏ tự nạp `x.demo.js` cùng thư mục nếu có (ngay trước `x.js`).
  Dữ liệu mẫu dùng chung cho nhiều màn thì đặt tên theo tệp chung:
  `_chung.demo.js` đi với `_chung.js`. Trên máy chủ thật không tệp mẫu nào bị tải.
Mỗi tệp .js bọc trong `(function () { 'use strict'; … })();` — **không tạo
biến toàn cục**, không gắn sự kiện lên `document`/`window` (màn hình bị thay
khi người dùng chuyển chức năng; sự kiện gắn lên document sẽ rò rỉ). Gắn sự
kiện lên phần tử gốc của màn hình.

Dùng chung giữa các màn trong một module: `scripts/_chung.js` của module đó,
đặt `ums.<module> = {…}`, nạp bằng thẻ `<script>` trong từng HTML cần dùng.

## 3. Những tệp CẤM sửa

`_v2/assets/**` (css, js, config, vendor), `_v2/index.*`,
`_v2/screens/**`, các module của người khác. Cần thay đổi tầng chung thì
viết tạm trong module của mình và **ghi yêu cầu vào báo cáo** (mục 9).

## 4. Tầng chung có sẵn

> **Tra chữ ký đầy đủ ở [API.md](API.md)** (sinh tự động từ chú thích trong mã, `python _harness\sinh-api.py`) và tên lớp CSS ở [CLASS.md](CLASS.md).
> Tóm tắt màn gốc trước khi đọc: `python _harness	om-tat-goc.py <html gốc>`. Mục này chỉ là bản rút gọn.

### ums.api

```js
ums.api.call({ action, func, …tham số, method: 'GET'|'POST', silent: true })
    → Promise<{ data, pager, message, raw }>   // reject khi Success=false, Error.message = Message
ums.api.json(action, bodyObj)   // gửi thân JSON nguyên văn (SYS_Report/*, SYS_Import/*)
ums.api.dm('TAICHINH.MAUIN')    // = loadToCombo_DanhMucDuLieu → Promise<[{ID, TEN, MA…}]>
ums.api.handle(err, 'nơi xảy ra') // hiện toast lỗi, hết phiên thì đăng xuất
```

- Tự chèn `strChucNang_Id`, `strNguoiThucHien_Id` (= userId),
  `strVaiTroDangNhap_Id`, `strChucNangHeThong_Id`, `strNguoiThucVai_Id` khi
  màn hình để trống — y như bản gốc. Tham số bản gốc ghi
  `'strNguoiThucHien_Id': edu.system.userId` thì cứ để trống, hệ tự điền.
- Có `func` thì tự thêm `iM` và mã hoá — không cần tự truyền.
- Một số lời gọi kiểu cũ **không có `func` nhưng bản gốc vẫn truyền `iM`**
  (vd `KHCT_ThongTin/*`, `TC_ThuChi2/*`) nên thân vẫn bị mã hoá. Với những
  lời gọi đó, truyền `iM: ums.session.iM` tường minh — đó là cách đúng, không
  phải mẹo. Lời gọi bản gốc không có `iM` thì tuyệt đối không thêm.
- `n2vi.min.js` (đọc số thành chữ) KHÔNG rỗng — nó là một dòng 1.351 byte,
  `wc -l` ra 0. Đã có bản chép trong `phieuthu/scripts/` và `hoadon/scripts/`.
- `type: "GET"` của bản gốc → `method: 'GET'`. Không ghi thì là POST.
- `data.Pager` = tổng số dòng khi phân trang máy chủ.
- Cần `userId` tường minh (vd `strNguoiTao_Id`): `ums.session.userId`.
- Id chức năng / vai trò đang mở: `ums.state.chucNangId`, `ums.state.roleId`.

### ums.crud — màn danh sách + lọc + biểu mẫu

Đọc chú thích đầu `assets/js/crud.js`. Tuỳ chọn:

| Tuỳ chọn | Ý nghĩa |
|---|---|
| `root` | phần tử gốc |
| `title`, `formTitle`, `icon`, `listTitle`, `addText`, `empty` | chữ hiển thị (`icon` là tên FA không kèm `fa-light`) |
| `embedded: true`, `back()` | khung lồng (không có tiêu đề trang), nút quay lại |
| `filters: [{ key, type: 'text'\|'select', label, source, value }]` | thanh lọc; `f.<key>` trong `list.call` |
| `list: { paged, call(f, page) → call, rows(data, r) }` | `paged: true` → tự thêm pageIndex/pageSize, dùng Pager |
| `columns` | cột của `ums.ui.table` (dưới) + `lookup: source` để đổi mã → tên |
| `rowActions: [{ icon, title, onClick(row, crud) }]` | nút thêm trên mỗi dòng |
| `toolbar: [{ text, icon, mod, onClick(crud) }]` | nút thêm trên đầu trang |
| `fields` | xem bảng dưới |
| `formCols` | số cột biểu mẫu (mặc định 2) |
| `detail(row) → call` | lấy chi tiết trước khi sửa (vd `LayChiTiet`) |
| `save(values, row, crud) → call` | `row` null = thêm mới; trả null để huỷ |
| `remove(ids, rows) → call \| [calls]` | có thì hiện xoá dòng + xoá nhiều |
| `canAdd`, `canEdit`, `rowDelete`, `multi`, `formDelete` | tắt từng chức năng (`false`) |
| `onLoad(rows, crud)`, `onForm(row, crud, extraEl)`, `onSaved(crud)` | móc |
| `pageSize`, `autoload: false` | |

Trường biểu mẫu `fields: [{ … }]`:

| Khoá | Ý nghĩa |
|---|---|
| `key` | tên tham số gửi lên (chép từ bản gốc) |
| `col` hoặc `get(row)` | cột đọc ra khi sửa |
| `label`, `required`, `hint`, `placeholder`, `span: true` (chiếm cả hàng) | |
| `type` | `text` · `number` · `select` · `textarea` · `date` (dd/mm/yyyy) · `static` (chỉ hiện) · `legend` (tiêu đề nhóm) · `checks` (nhóm ô đánh dấu, `items: [{key, col, label, on, off}]`) |
| `source` | nguồn ô chọn: `{ dm: 'MA.BANG' }` · `{ call: {…}, id, name }` · `{ items: [...] }`; `name` có thể là hàm |
| `value` | giá trị mặc định khi thêm |
| `readonlyEdit` | khoá khi sửa |

Phương thức: `crud.load(page)`, `crud.rows`, `crud.filterValues()`,
`crud.formValues()`, `crud.showForm(row)`, `crud.showList()`,
`crud.pickedRows()`, `crud.draw()`.

`ums.crud` KHÔNG phải cái búa cho mọi thứ. Màn hình dạng lưới nhập liệu
(sửa trực tiếp trong ô bảng rồi "Lưu tất cả"), thu tiền, xuất hoá đơn… thì
tự dựng bằng `ums.ui`. Đừng vặn vẹo `ums.crud`.

### ums.ui

```js
ums.ui.table({ el, columns, rows, stt, page: {index, size, total, onChange}, empty, tableCls, sumAll })
    // cột: { title | head (HTML), prop | render(row, i), cls: 'is-center is-right is-nowrap is-actions', width, sum: true | fn(rows), sumProp }
    // sum thay edu.system.insertSumAfterTable
ums.ui.btn('add'|'save'|'search'|'close'|'excel'|'print', { text, mod, id, attr, cls })
ums.ui.iconBtn('view'|'edit'|'del', id) · ums.ui.actions(id, kinds)
ums.ui.badge(text, 'ok'|'warn'|'bad'|'mute'|'info') · ums.ui.cell(title, sub) · ums.ui.money(n)
ums.ui.field(label, controlHtml, { required, hint, inline }) · ums.ui.options(rows, { id, name, title })
ums.ui.filterInput(label, { id }) · ums.ui.filterSelect(label, rows, { id })
ums.ui.select2(el, opts) · ums.ui.datepicker(el, opts)
ums.ui.toast(msg, 'ok'|'warn'|'bad'|'info')                  // thay edu.system.alert
ums.ui.confirm(msg, { tone: 'bad', ok: 'Xoá', title }) → Promise<boolean>   // thay confirm + #btnYes
ums.ui.dialog({ title, icon, size: 'sm'|'md'|'lg'|'xl', body, buttons: [{ text, kind, mod, onClick(dlg) }], onClose })
    // thay modal Bootstrap; dlg.body, dlg.close(); onClick trả false thì không đóng
ums.ui.batch(calls, { title, concurrency, okText }) → Promise<{ ok, fail, errors, results }>
    // thay genHTML_Progress + start_Progress khi lưu/xoá hàng loạt
ums.ui.print(idHoặcPhầnTửHoặcHTML, { title, css })            // thay edu.util.printHTML
ums.ui.swap(vùngCũ, vùngMới) · ums.ui.reveal(vùng)              // đổi vùng có hiệu ứng
ums.ui.empty(msg, icon) · ums.ui.fail(msg) · ums.ui.esc(s)
ums.ui.chips(list, activeKey) · ums.ui.chart(canvas, cfgChartJs)
```

Tab (`edu.system.switchTab`): dựng bằng `.ums-tabs` (xem
`assets/css/components/tabs.css` và `screens/danh-muc.html`).

### ums.ref — danh mục đào tạo

```js
ums.ref.heDaoTao() · khoaDaoTao({ strHeDaoTao_Id }) · chuongTrinh({ strDaoTao_HeDaoTao_Id, strKhoaDaoTao_Id })
ums.ref.lopQuanLy({ … }) · hocPhan({ strChuongTrinh_Id }) · thoiGianDaoTao() · khoaQuanLy() · sinhVien({ … })
var cas = ums.ref.cascade({ he: el, khoa: el, ct: el, lop: el, onChange(v) }); cas.values(); cas.ready
```

Tham số giống hệt `edu.system.getList_*` (đọc `assets/js/ref.js`). Bản gốc
truyền `pageSize: 1000000` thì truyền y như vậy.

> **⚠ Phân quyền dữ liệu.** `ums.ref.*` là bản KHÔNG lọc quyền — chỉ dùng
> khi bản gốc gọi `edu.system.getList_*`. Nếu bản gốc dựng bộ lọc bằng
> `edu.extend.genBoLoc_HeKhoa` (`Core/systemextend.js:6713`) thì nó gọi các
> procedure `…HeDaoTaoQuyen` / `…KhoaDaoTaoQuyen` / `…ToChucCTQuyen` — phải
> dùng đúng các lời gọi đó (có sẵn: `ums.dmhsB.cascadeQuyen` trong
> `danhmucheso/scripts/_chung_b.js`), nếu không người dùng sẽ thấy dữ liệu
> ngoài phạm vi được phép.

### ums.report / ums.upload / ums.queue

```js
ums.report.mount(hostEl, { collect(add, tpl), tables(), onImported() })  // = edu.system.getList_MauImport(zone, cb)
ums.report.run(code, { collect(add), duongDan })                         // = edu.system.report(code, duongDan, cb)
ums.report.importChung(title, maDanhMuc, { onDone })                     // = edu.system.showImportChung
ums.upload(files) → Promise<đường dẫn>                                    // = edu.system.uploadImport
ums.queue.mount(hostEl, { strLoaiNhiemVu, … })                            // = createHangDoi / getList_HangDoi
```

`collect(add)` nhận đúng những cặp `addKeyValue(k, v)` mà callback bản gốc
thêm. Đặt nút báo cáo ở `.ums-page__actions` hoặc `.ums-panel__tools`.

## 5. Bảng đổi nhanh

| Bản gốc | Bản mới |
|---|---|
| `edu.util.getValById('x')` | giá trị trong `f.<key>` / `values.<key>` của crud, hoặc `el.value` |
| `edu.system.loadToCombo_data({data, renderInfor, renderPlace})` | `source` của crud, hoặc `el.innerHTML = ums.ui.options(rows, {id, name})` + `ums.ui.select2(el)` |
| `edu.system.loadToTable_data(jsonForm)` | `ums.ui.table` hoặc `ums.crud` |
| `edu.system.alert(msg, 's'\|'w')` | `ums.ui.toast(msg, 'ok'\|'warn')` |
| `edu.system.confirm` + `$("#btnYes").click` | `ums.ui.confirm(msg).then(yes => …)` |
| `$("#myModal").modal("show")` | `ums.ui.dialog({...})` |
| `edu.util.toggle_overide("zone-bus", "zone_input")` | `ums.ui.swap(list, form)` |
| `edu.system.genHTML_Progress` + `start_Progress` | `ums.ui.batch(calls)` |
| `edu.system.insertSumAfterTable(tbl, [cols])` | `sum: true` trên cột |
| `edu.util.formatCurrency(x)` | `ums.ui.money(x)` |
| `edu.util.getArrCheckedIds(tbl, 'checkX')` | `crud.pickedRows()` hoặc tự đọc checkbox |
| `edu.system.getList_HeDaoTao(...)`… | `ums.ref.*` |
| `edu.system.getList_MauImport('zone', cb)` | `ums.report.mount(el, { collect: cb })` |
| `edu.system.pageIndex_default / pageSize_default` | `list.paged: true` của crud |
| `edu.util.returnEmpty(x)` | `x == null ? '' : x` |
| `edu.util.printHTML('id')` | `ums.ui.print('id')` |

## 6. Dữ liệu mẫu (để chạy thử trên máy)

Mỗi màn có `scripts/<tên>.demo.js` — vỏ tự nạp khi chạy dựng thử (mục 2),
không ghi thẻ trong HTML:

```js
/* Dữ liệu mẫu cho <tên> — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'pkg_taichinh_ketoan.LayDSAPI_KeToan_Khoan_HT': [ { ID: 'A1', … } ],
    'TC_HoaDon/LayDanhSach': function (o) { return [...]; },          // o = tham số gửi lên
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.HTTHU': [ … ],
    'pkg_x.Them_Y': { rows: [], message: 'ID_MOI' }                   // khi cần Message
});
```

Khoá tra theo `func`, rồi `action#strMaBangDanhMuc`, rồi `action`. Lời
gọi không có dữ liệu mẫu trả mảng rỗng (không lỗi). Dữ liệu mẫu phải có
**đúng tên cột** mà màn hình đọc, giá trị trông như thật (tiếng Việt, số
tiền hợp lý, ngày dd/mm/yyyy), 3–8 dòng là đủ. Danh mục đào tạo dùng chung
(`pkg_kehoach_thongtin.*`) cũng khai ở đây nếu màn hình cần.

## 7. Chạy thử

Máy chủ tĩnh đang chạy ở `http://localhost:8787` (web root là thư mục dự án).
Mở chức năng bằng id `TC-<module>-<tên>`:

```
http://localhost:8787/_v2/index.html#/r/R33/TC-<module>-<tên>
```

Không có Chrome; dùng Edge headless, **mỗi người một `--user-data-dir`
riêng** (dùng chung sẽ khoá hồ sơ) và **xoá hồ sơ khi xong** (mỗi hồ sơ hàng trăm MB). Chụp ảnh một màn:

```powershell
$e = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
Start-Process -Wait -FilePath $e -ArgumentList "--headless=new","--disable-gpu",
  "--user-data-dir=$env:TEMP\edge-<tên-bạn>","--window-size=1440,900",
  "--virtual-time-budget=8000","--screenshot=<đường dẫn>.png","<url>"
```

`--dump-dom` thay `--screenshot` để đọc DOM (ghi ra tệp bằng
`-RedirectStandardOutput`). Muốn bấm nút / bắt lỗi JS: dựng trang dò tạm
`_harness/probe-<tên-bạn>.html` nạp `_v2/index.html` vào `<iframe>`, gắn
`contentWindow.addEventListener('error', …)`, thao tác rồi ghi kết quả vào
một `<pre>` để `--dump-dom` đọc. **Xoá trang dò khi xong.**
Đọc ảnh chụp để soát giao diện — đừng chỉ tin DOM.

**Chạy các trang kiểm bằng `_harness/chay-cdp.js`** (Edge thời gian thật, tự xoá hồ sơ khi xong — `--virtual-time-budget`
treo sau màn đầu; hồ sơ Edge để lại từng làm đầy ổ C). Chạy từ gốc repo; với `MSYS_NO_PATHCONV=1` gọi tệp bằng đường dẫn
tương đối hoặc `D:/…`, không `/d/…`:

```bash
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/kiem-dong-bo.html?vt=R33&tien=TC&coTep=1" 9401
```

**Ba trang kiểm BẮT BUỘC trước khi báo xong một phân hệ** (cùng tham số `vt`, `tien`, `s`):
- `kiem-dong-bo.html` — chuẩn giao diện chung;
- `thu-crud.html` — bấm Thêm / Sửa / Lưu thật;
- `kiem-cot-trai.html` — cột trái đúng luật 12 (nút Tải lại, gõ tự tìm, không nút Tìm kiếm, ô chọn trong Bộ lọc nâng cao).

Mỗi màn tối thiểu phải kiểm: mở không lỗi JS, bảng có dữ liệu mẫu, lọc
chạy, **mọi ô con bị khoá khi chưa chọn cha và bị xoá khi xoá cha** (mục 1
luật 6 — chạy `_harness/do-phu-thuoc.html`), mở biểu mẫu thêm/sửa đổ đúng
giá trị (ô con phải MỞ khi biểu mẫu sửa đã có giá trị cha), bấm Lưu gửi đúng tham số (thay
tạm `ums.api.call` trong trang dò để bắt payload rồi so với bản gốc).

## 8. Văn phong mã

- Chú thích tiếng Việt, đầu mỗi tệp .js liệt kê: bản gốc ở đâu, các lời
  gọi (func/action), những gì cố ý bỏ và vì sao. Xem `khoanthu.js`.
- ES5 (`var`, `function`) cho khớp phần còn lại; không dùng module/bundler.
- Không nối chuỗi HTML chưa qua `ums.ui.esc` với dữ liệu từ máy chủ.
- Không `eval`. Bản gốc có `eval(...)` thì ghi chú và tìm cách thay.
- Không lớp CSS cũ (`btn`, `form-control`, `td-center`…), không Bootstrap.
  Chỉ lớp `ums-*`. Cần kiểu riêng thật sự thì viết vào `css/<tên>.css` của
  module (mục 2), tiền tố lớp theo tên màn hình. Thuộc tính `style="…"` trong
  chuỗi HTML chỉ dùng cho giá trị động (độ rộng tính ra lúc chạy…).

## 9. Báo cáo khi xong

Với từng màn hình:
- **Trạng thái**: xong / xong một phần / chưa làm được — và vì sao.
- **Đã kiểm gì** (mở, lọc, sửa, lưu…) và kết quả.
- **Cố ý bỏ** chức năng nào của bản gốc, lý do.
- **Lỗi bản gốc** phát hiện được.
- **Các cặp ô cha → con** của màn và đã khoá chưa (cặp nào để mở vì là lọc
  tuỳ chọn thì nói rõ).
- **Cần tầng chung bổ sung gì** (nếu đã viết tạm trong module thì nói ở đâu).
