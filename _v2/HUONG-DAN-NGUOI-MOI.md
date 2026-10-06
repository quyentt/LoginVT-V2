# Hướng dẫn người mới — tiếp quản, chuyển màn cũ, viết màn mới trên `_v2`

Đọc tệp này **đầu tiên**. Mọi chữ ký hàm dưới đây đối chiếu trực tiếp với mã trong `assets/js/` ngày 2026-10-06;
chỗ nào nghi khác thì tin mã, rồi sửa tệp này. Tài liệu khác chỉ mở khi tệp này trỏ tới.

| Bạn cần | Mở |
|---|---|
| Chữ ký một hàm tầng chung | [API.md](API.md) — tra theo tên (`python _harness\sinh-api.py` để sinh lại) |
| Tên lớp CSS có thật | [CLASS.md](CLASS.md) |
| Luật bố cục, lỗi vặt đã gặp | [BO-CUC.md](BO-CUC.md) "Quy ước bắt buộc"; [components.html](components.html) mục 0 "Khuôn màn hình" |
| Quy trình chuyển một màn, bảng đổi `edu.*` → `ums.*` | [CHUYEN-DOI.md](CHUYEN-DOI.md) |
| Kiến trúc, hai chế độ chạy, triển khai | [TRAINING.md](TRAINING.md), [TRIEN-KHAI.md](TRIEN-KHAI.md) |
| Lịch sử từng phân hệ, điểm đã chốt, việc dữ liệu | [NHAT-KY-CHUYEN.md](NHAT-KY-CHUYEN.md), [CAN-QUYET-DA-CHOT.md](CAN-QUYET-DA-CHOT.md), `assets/js/can-quyet.js` |
| Toàn cảnh hệ cũ (shell, API, bẫy) | `../CLAUDE.md` mục 3, 5, 8 |

---

## 1. Mười lăm phút đầu

```
powershell -ExecutionPolicy Bypass -File _harness\serve.ps1      # máy chủ tĩnh cổng 8787
http://localhost:8787/_v2/index.html?demo                        # chạy bằng dữ liệu mẫu, không gọi mạng
```

Chọn một vai trò → menu → bấm một màn. Bạn vừa đi qua ba tầng điều hướng `#/` → `#/r/<vaiTrò>` → `#/r/<vaiTrò>/<chứcNăng>`.

**Một màn = hai tệp, đặt đúng cây thư mục của bản gốc:**

```
_v2/<ApisXxx>/Modules/<module>/html/<tên>.html      vỏ: <div id="<tên>"></div> + <script src="../script/<tên>.js">
_v2/<ApisXxx>/Modules/<module>/script/<tên>.js      IIFE, root = document.getElementById('<tên>')
_v2/<ApisXxx>/Modules/<module>/script/<tên>.demo.js dữ liệu mẫu (tùy chọn), nạp trước tệp chính
```

Có tệp là màn **tự bật** (bộ định tuyến ghép `MAUNGDUNG` + `DUONGDANFILE` từ bảng chức năng); chưa có thì hiện "chưa chuyển đổi".
Không khai báo gì thêm ở `app.js`. `src` tính từ vị trí tệp HTML.

Màn nhỏ nhất đang chạy thật, 36 dòng, đọc để thấy hình dạng chuẩn:
[ApisCongCanBo/Modules/luong/script/quatrinhluong.js](ApisCongCanBo/Modules/luong/script/quatrinhluong.js).

---

## 2. Tầng chung — chọn đúng tầng

Thứ tự ưu tiên khi dựng: **có khuôn thì dùng khuôn, không tự dựng `<table>`, `<select>`, hộp thoại, CSS riêng.**

| Tầng | Việc | Hàm hay dùng |
|---|---|---|
| `ums.api` | Gọi máy chủ | `call({ action, func, …tham số, method, silent })` → Promise `{ data, pager, raw }`; `dm('MA.BANG')` danh mục dùng chung |
| `ums.crud` | Danh sách + lọc + biểu mẫu thêm / sửa / xoá | `ums.crud(cfg)` — mục 3 |
| `ums.ui` | Mảnh giao diện | `table`, `btn`, `iconBtn`, `badge`, `toast`, `confirm`, `dialog`, `options`, `pager`, `file`, `xoaChon`, `batch`, `select2`, `datepicker`, `money`, `swap`, `xuatXls` |
| `ums.pat` | Bố cục cả màn | `formTrang`, `chain`, `master`, `matrix`, `pivot`, `cards`, `sections`, `rows`, `page / panel / filterBar`, `pickNhanSu`, `pickSinhVien`, `boLocNguoiHoc`, `cotTrai`, `phamVi`, `diaChi` |
| `ums.ref` | Danh mục đào tạo | `heDaoTao()`, `khoaDaoTao()`, `chuongTrinh()`, `lopQuanLy()`, `hocPhan()`, `thoiGianDaoTao()`, `coCauToChuc()`, `sinhVien()` — Promise mảng dòng |
| `ums.report` | Nút Xuất báo cáo / Import theo mẫu | `mount(host, { collect, tables })` thay `getList_MauImport` |
| `ums.lamTruoc` | Khung "Cần làm trước" khi thiếu dữ liệu | tự chạy; màn đặc thù gọi `can()` / `neuRong()` |
| `ums.editor` | CKEditor + MathJax, lùi về textarea | `tao`, `toan`, `html` |

Quy ước dữ liệu của hệ: cột trả về viết **HOA** (`ID`, `TEN`, `MA`), khoá chính GUID 32 hex, ngày chuỗi `dd/MM/yyyy`,
phân trang đẩy `pageIndex` / `pageSize` xuống thủ tục. `strChucNang_Id`, `strNguoiThucHien_Id`, `strVaiTroDangNhap_Id` **không truyền**, `api.js` tự chèn.

### `ums.api.call` — ba hình dạng lời gọi

```js
// 1. action kiểu cũ, không mã hoá (đa số màn nghiệp vụ)
ums.api.call({ action: 'NS_QT_Luong/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: id })
// 2. action mã hoá + func = tên thủ tục thật → payload tự bọc {A: AE(...)}
ums.api.call({ action: 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4SNCAP', func: 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Sua', strId: id })
// 3. danh mục dùng chung (CMS_DanhMucDuLieu) — thêm danh mục mới KHÔNG cần tạo bảng
ums.api.dm('KLGD.HOATDONG').then(function (rows) { /* … */ })
```

Lỗi → `.catch(function (err) { ums.api.handle(err, 'tên việc'); })`: câu ORA-20000…20999 hiện gọn, câu gốc ở `err.goc`.

---

## 3. `ums.crud(cfg)` — khuôn dùng cho 160 màn

Mẫu đủ các khối, chép rồi sửa (đối chiếu `assets/js/crud.js`):

```js
(function () {
    'use strict';
    var ui = ums.ui, P = 'LVLA_DuLieu/';

    var crud = ums.crud({
        root: document.getElementById('dulieu'),
        title: 'Dữ liệu', listTitle: 'Danh sách', formTitle: 'dữ liệu', icon: 'fa-table-list',

        filters: [                                             // cột lọc; gõ là tự tìm, KHÔNG có nút Tìm
            { key: 'q',  type: 'text',   label: 'Nhập từ khóa tìm kiếm' },
            { key: 'tg', type: 'select', label: 'Thời gian',
              source: { call: { action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', pageIndex: 1, pageSize: 1000000 }, name: 'DAOTAO_THOIGIANDAOTAO' } }
        ],
        list: { paged: true, call: function (f) {              // f = giá trị các ô lọc theo key
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strDaoTao_ThoiGianDaoTao_Id: f.tg || '' };
        } },
        columns: [
            { title: 'Hoạt động', prop: 'HOATDONG_TEN' },
            { title: 'Số giờ', prop: 'SOGIO', cls: 'is-center is-nowrap' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return Number(r.HIEULUC) ? '' : ui.badge('Hết hiệu lực', 'mute'); } }
        ],
        fields: [                                              // ô ngắn tự xếp 2 ô một hàng; span: true = cả hàng
            { key: 'strHoatDong_Id', col: 'HOATDONG_ID', label: 'Hoạt động', type: 'select', required: true, source: { dm: 'KLGD.HOATDONG' } },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select',
              source: { call: { action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', pageIndex: 1, pageSize: 1000000 }, name: 'DAOTAO_THOIGIANDAOTAO' } },
            { key: 'dSoGio', col: 'SOGIO', label: 'Số giờ', type: 'number', required: true },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Mô tả', type: 'textarea', span: true }
        ],
        detail: function (row) { return { action: P + 'LayChiTiet', method: 'GET', strId: row.ID }; },   // tùy chọn: GET trước khi mở sửa
        save: function (v, row) {                              // v = giá trị ô theo key; row = null khi thêm
            return { action: P + 'ThemMoi', method: 'POST', strId: row ? row.ID : '',
                     strHoatDong_Id: v.strHoatDong_Id, strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                     dSoGio: v.dSoGio, strNgayBatDau: v.strNgayBatDau, strGhiChu: v.strGhiChu };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); },
        onForm: function (row, c, extra) {                     // sau khi biểu mẫu dựng: nối cha → con, vẽ khung phụ vào `extra`
            var o = function (k) { return c.z('form').querySelector('[data-k="' + k + '"]'); };   // ô biểu mẫu mang data-k="<key>"
            ums.pat.chain([o('strHeDaoTao_Id'), o('strDaoTao_ThoiGianDaoTao_Id')]);
        }
    });
})();
```

**Các khoá `cfg` thật sự được đọc** (tên khác là bị bỏ qua âm thầm):

| Nhóm | Khoá |
|---|---|
| Khung | `root`, `title`, `listTitle`, `formTitle`, `icon`, `empty`, `embedded` (màn con trong `formTrang`), `back` (có nút Đóng tầng ngoài), `master` (hai cột, mục cột trái) |
| Danh sách | `filters[]`, `list { paged, call(f) }` hoặc `list { rows }`, `columns[]`, `rowActions[]` (nút thêm trên dòng), `rowDelete`, `multi` (xoá nhiều), `toolbar[]` (nút đầu khung), `onLoad(rows, me)` |
| Biểu mẫu | `fields[]`, `formCols` 1 / 2, `formMotCot`, `detail(row)`, `save(v, row)`, `saveAgain` ("Lưu và nhập tiếp"), `saveFail`, `onSaved(me, result, isEdit)`, `onForm(row, me, extra)` |
| Xoá | `remove(ids)` → mảng lời gọi, `removeConfirm`, `removeText`, `formRemove`, `formRemoveText`, `formDelete`, `onRemoved` |
| Quyền | `canAdd`, `canEdit` (mặc định có khi có `save`), `addText` |

**`columns[]`:** `title`, `prop` hoặc `render(row)`, `cls` (`is-center`, `is-nowrap`, `is-right`), `lookup` (đổi mã → tên theo nguồn).
**`fields[]`:** `key` (tên tham số gửi lên), `col` hoặc `get(row)` (cột đọc về khi sửa), `label`, `type`, `required`, `placeholder`, `span`, `hint`, `value` (mặc định khi thêm), `readonlyEdit`, `width`, `source`.
**`type`:** mặc định text · `number` · `date` · `textarea` · `select` · `checks` · `files` (`api` đính kèm) · `avatar` · `hidden` · `static` · `legend` (tiêu đề nhóm) · `note` · `gap`.
**`source` của ô chọn / ô lọc:** `{ items: [...] }` cứng · `{ dm: 'MA.BANG' }` danh mục chung · `{ call: {...}, id: 'ID', name: 'TEN' | fn, sort }` gọi API.
Mọi ô `select` của biểu mẫu crud tự có select2 (`allowClear` khi không `required`); ô ít mục trong **bảng** tự vẽ thì không select2.

Đối tượng trả về (`crud`): `load(page)`, `draw()`, `rows`, `total`, `pickedRows()`, `filterValues()`, `formValues()`, `showForm(row)`, `showList()`,
`z('<vùng>')` lấy phần tử theo tên vùng (`list`, `form`, `notify`, `extra`). Bảng tuỳ chọn gọn: [CHUYEN-DOI.md](CHUYEN-DOI.md) mục 4 "ums.crud".

---

## 4. Màn KHÔNG phải danh sách + biểu mẫu

- **Biểu mẫu thay chỗ màn** (thêm / sửa luôn trong trang, không hộp thoại — luật 2026-09-30):
  `ums.pat.formTrang({ host, title, icon, body, cols, buttons: [{ text, kind, onClick(api) }], xoa, flush, onClose })` → `{ body, close() }`.
  Nhận đúng cấu hình của `ui.dialog` nên màn đang dùng hộp thoại chỉ đổi tên hàm. Tự lo một nút Đóng.
- **Hộp thoại** `ui.dialog(...)` chỉ cho việc phụ: chọn, xem, xác nhận, hàng loạt trên dòng đã đánh dấu, tiến độ, gửi email, kế thừa, nhập từ tệp.
- **Bảng tự vẽ:** `ui.table({ el, rows, columns, stt, empty, pager })` — sinh cả `<table>`, `<thead>`, phân trang; không nối chuỗi `<tr>` tay.
- **Cha → con:** `ums.pat.chain([cha, con, cháu])` **sau** khi gắn trình xử lý của màn. Chưa chọn cha thì con khoá; chọn / xoá cha thì xoá trắng con. Bắt buộc cho mọi màn, kể cả ô trong hộp thoại.
- **Nút:** `ui.btn(kind, { text, icon, cls, attr })`, kind ∈ `add edit del view save close reload confirm history attach report importer print search`.
  Chữ nút giữ như gốc, biểu tượng theo kind (một hành động = một biểu tượng). `ui.btn('close')` luôn ngoài cùng **trái**.
- **Hai cột (danh sách trái, nội dung phải):** `ums.pat.master` hoặc `ums.crud({ master: {...} })`; danh sách DANH MỤC vẽ kiểu cây (`side.kieu: 'danhmuc'`).
- **Lưới nhập theo cột thời gian / bảng xoay:** `ums.pat.matrix`, `ums.pat.pivot` — xem [BO-CUC.md](BO-CUC.md) mục 2, 3.

---

## 5. Dữ liệu mẫu và menu mẫu

```js
// script/<tên>.demo.js — khoá là action (hoặc tên thủ tục nếu gọi có func)
ums.demo.add({
    'LVLA_DuLieu/LayDanhSach': [{ ID: 'D1', HOATDONG_TEN: 'Hướng dẫn', SOGIO: '12' }],
    'LVLA_DuLieu/ThemMoi': { rows: [], raw: { Id: 'MOI' } }
});
```

Menu mẫu: `assets/js/demo-data.js` → `ums.demo.menus[R..] = buildMenu([['<module>', 'Tên nhóm', 'fa fa-…', [['<tệp>', 'Tên màn']]]], null, { prefix, app })`;
ID chức năng = `<TIỀN TỐ>-<module>-<tệp>`. **Không sắp xếp lại**, thứ tự chép theo menu host. Không đưa dữ liệu thật vào dữ liệu mẫu.
Chạy API thật thì bảng mẫu không được đọc, nạp `.demo.js` lên host vô hại (gói deploy vẫn bỏ nó).

---

## 6. Lối A — chuyển một màn cũ

1. **Tóm tắt gốc, không đọc nguyên văn:** `PYTHONIOENCODING=utf-8 python _harness\tom-tat-goc.py <html gốc>`.
   Mục 4 cho mọi action kèm tham số (chép nguyên văn). **Mục 7** trả lời ngay: màn gốc khác trùng ≥ 85% đã chuyển → tạo vỏ 8 dòng nạp chéo
   script đó (mẫu [ApisTotNghiep/Modules/danhmuc/html/danhmucdulieu.html](ApisTotNghiep/Modules/danhmuc/html/danhmucdulieu.html)), xong;
   không trùng → từng action / danh mục đã chuyển ở `tệp:dòng` nào để mở đúng chỗ mà chép; hàm `edu.*` → hàm `ums.*` thay.
2. **Bám bố cục gốc:** một cột vẫn một cột, hai cột vẫn hai cột. Đổi cách dựng, không đổi bố cục. Chỗ nên đổi thì hỏi, trừ các luật đã chốt ở mục 4.
3. Viết hai tệp (+ `.demo.js`) theo mục 3 / 4. Mã chết của gốc (id không có trong HTML) → bỏ, ghi "Cố ý bỏ" ở chú thích đầu tệp; gốc lỗi rõ → làm theo ý định, ghi "Khác gốc".
4. Thêm màn vào menu mẫu, mở `index.html?demo`, bấm Thêm / Sửa: `document.querySelectorAll('dialog[open]').length` phải bằng 0.
5. Kiểm (mục 9). Việc dữ liệu / backend ghi `assets/js/can-quyet.js`; câu cần chốt về cách màn chạy tự chốt vào `CAN-QUYET-DA-CHOT.md`.
6. Xong một **phân hệ**: thêm tên vào `THU_TU` của `_harness/tien-do.py`, ghi mục mới trong `NHAT-KY-CHUYEN.md`, `python _harness\dong-goi.py`, rồi **dừng** để người dùng kiểm.
   Không tự sang phân hệ khác.

Luật bắt buộc rút gọn (vi phạm là làm lại): class tiền tố `ums-`, không Bootstrap · biểu mẫu trong trang · Đóng ngoài cùng trái, mỗi lúc một nút Đóng ·
cha → con khoá / xoá trắng · bảng sát mép khung, có kẻ cuối · ô ngắn hai ô một hàng · cột trái = Tải lại + Bộ lọc nâng cao, gõ tự tìm ·
icon qua `ui.btn` / `ums.iconFA4` · không sửa `assets/**` khi chuyển một màn, thiếu gì thì tự xử trong màn và báo.

---

## 7. Lối B — viết màn mới (không có bản gốc)

Khác lối A ở ba điểm. **Bố cục** tự chọn theo bảng tra nhanh [BO-CUC.md](BO-CUC.md): có danh sách + biểu mẫu → `ums.crud`; nhiều khung → `pat.sections`; nhập theo cột → `matrix`.
**API** phải có thủ tục PL/SQL thật phía Oracle và controller ở microservice — repo này chỉ có frontend, tên action / tham số lấy từ người làm backend, không bịa.
**Chức năng** phải được khai ở màn CMS `chucnang` với `DUONGDANFILE` đúng đường dẫn tệp và `TENANH` là icon FA (cột này kiêm bộ định tuyến shell cũ — xem `../CLAUDE.md` mục 5).
Còn lại y lối A: hai tệp, dữ liệu mẫu, menu mẫu, kiểm, đóng gói.

---

## 8. Lối C — tiếp quản

Sổ sách phải biết, mỗi thứ một việc:

| Tệp | Trả lời câu |
|---|---|
| `_harness/tien-do.html` (sinh bởi `tien-do.py`) | Màn nào đã / chưa chuyển, theo phân hệ |
| `NHAT-KY-CHUYEN.md` | Phân hệ này đã làm thế nào, vai trò mẫu nào, nợ gì |
| `CHO-CHUYEN-SAU-PULL.md` | Tệp gốc kéo về còn "chưa xem" — chỉ mở diff khi tới lượt làm đúng màn đó |
| `assets/js/can-quyet.js` | Việc dữ liệu / backend đang treo (hiện trên màn) |
| `_harness/kiem-host/da-kiem.json`, `loi-code.js`, `VIEC-PHIEN-SAU.md` | Phân hệ nào đã kiểm trên host, lỗi mã treo, việc phiên sau |
| `_harness/.moc-da-up.json`, `_v2_bo_xung_deploy/` | Host đang ở bản nào; còn gì chưa up (`_KHONG-CON-GI-DE-UP.txt` = sạch) |

Git: kho này **không chung gốc** với kho gốc `quyentt/loginVT-main`; kéo bằng `git fetch origin` + `git checkout origin/main -- <tệp>` từng tệp, không `pull` / `merge`.
Đẩy lên `LoginVT-V2`, không bao giờ tới kho gốc. Đóng gói: `python _harness\dong-goi.py` → `_v2_deploy/` + gói bổ sung; người dùng báo "đã up" → `--da-up`.
Trên host `_v2` nằm ngay dưới gốc ứng dụng (dùng `../Config.js`, phiên đăng nhập, `Scripts/` của ứng dụng cha); thiếu `_v2/web.config` thì icon thành ô vuông.
Kiểm host: `_harness/kiem-host/` (đọc `README` ở đó), luật ở `../CLAUDE.md` mục 9.

---

## 9. Kiểm trước khi báo xong (bắt buộc, Git Bash)

```
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/do-man.html?vt=<R..>&man=<ID>&sau=1&tho=1" 9411
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/kiem-dong-bo.html?vt=<R..>&tien=<TIỀN TỐ>&coTep=1" 9421
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/thu-crud.html?vt=<R..>&tien=<TIỀN TỐ>" 9422
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/kiem-cot-trai.html?vt=<R..>&tien=<TIỀN TỐ>" 9423
PYTHONIOENCODING=utf-8 python _harness/kiem-icon-chuan.py
```

`do-man` dò một màn (bấm mọi nút, đếm dialog, lỗi console). Ba trang sau kiểm cả vai trò theo luật bố cục, thử thêm / sửa / xoá bằng dữ liệu mẫu, kiểm cột trái.
`chay-cdp.js` tự xoá hồ sơ Edge sau khi chạy (hồ sơ để lại hàng trăm MB). Sửa `assets/css` thì `python _harness\gop-css.py`; sửa `assets/js` thì `sinh-api.py`.

---

## 10. Lỗi người mới hay mắc

- Chép mẫu CRUD cũ (khoá `api`, `columns[].key`) — không phải chữ ký thật, xem mục 3.
- Đoán tên cột trả về theo tên tham số gửi lên. Cột là HOA và thường khác (`strHoatDong_Id` ↔ `HOATDONG_ID`, nhãn `HOATDONG_TEN`); xem bản trả thật hoặc màn gốc.
- Tự truyền `strNguoiThucHien_Id`, `strChucNang_Id` — hệ tự chèn, truyền thêm gây lệch.
- Mở biểu mẫu bằng `ui.dialog` — phải `ums.crud` hoặc `pat.formTrang`.
- Gọi `pat.chain` trước khi gắn trình xử lý của màn, hoặc quên `preventDefault()` khi màn tự dùng Esc (Esc sẽ đóng cả màn).
- Nạp màn cũ vào `_v2` khi chưa chuyển — không bao giờ; thiếu tệp thì hiện "chưa chuyển đổi".
- Sửa tay trong `_v2_deploy/` — chỉ sửa `_v2/` rồi đóng gói lại.
- Đưa mã sinh viên / điểm thật vào `.demo.js` hoặc đẩy `Upload/` (695 MB dữ liệu thật) đi đâu.
