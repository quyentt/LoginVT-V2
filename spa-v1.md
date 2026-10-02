# SPA-V1 — lột da màn cũ bằng bộ class `ums-`

Tài liệu bàn giao cho phiên làm tiếp. Đọc hết trước khi sửa màn nào.
Bắt đầu: 2026-10-01. Màn mẫu đã xong: **Quản lý bộ đề** (`quanlybode.html`).

---

## 1. Việc này là gì

Màn **cũ** vẫn chạy trong vỏ cũ (`indexi.aspx`, `Corei/`, JS gốc của màn), chỉ **dựng lại khung HTML** bằng bộ class
`ums-` của `_v2` (panel, field, button, table, tabs) và một tệp CSS riêng.

- **CHỈ markup + CSS. KHÔNG thêm, KHÔNG sửa một dòng JS nào** (kể cả JS của màn, Corei, vỏ).
- Không đụng `_v2/` (đó là bộ giao diện mới hoàn toàn, việc khác).
- Người dùng chọn: bộ class của `_v2`; CSS + nguồn đặt trong `App_Themes/Cms/Custom_V1/ums/`.

## 2. Danh sách màn cần chuyển

Phân hệ **Quản lý thi trắc nghiệm** (`ApisQuanLyThiTracNghiem`, vai trò harness `0DD9E9FAF61D4616BE322318368FF15D`) — theo
menu người dùng gửi. Số liệu đo bằng `skin.py` ngày 1/10: dòng html, số `id` phải giữ, class móc JS ngoài bộ chung
(`btn form-control lang myModalLabel zone-bus select-opt btnClose btnAdd`).

Cột **Vỏ (host kiểm)** = theo bản xuất CSDL host đang kiểm (26/9). Trên host Phenikaa mục có thể khác — xem mục 8.

| # | Menu | Tệp (dưới `ApisQuanLyThiTracNghiem/modules/`) | html | id | Móc đặc biệt / lưu ý | Vỏ (host kiểm) | Trạng thái |
|---|---|---|---:|---:|---|---|---|
| 1 | Quản lý bộ đề | `quanlybode/html/quanlybode.html` | 566 | 85 | tab BS3, `chosen-select` | index (Phenikaa: indexi) | **XONG** — chờ người dùng xem trên host |
| 2 | Quản lý đơn vị | `quanlydonvi/html/quanlydonvi.html` | 137 | 13 | `btnSearch_DonVi` | indexi | **XONG** (1/10) — chờ người dùng xem trên host. ⚠ Nguồn `html/` + `goc/` của màn này nằm trong `_harness/skin-nguon.zip` (phiên đám mây không ghi được thư mục sâu 9 cấp) — GIẢI NÉN vào `App_Themes/Cms/Custom_V1/ums/` TRƯỚC khi chạy `skin.py` lần kế tiếp |
| 3 | Phân quyền phê duyệt dữ liệu điểm, NHCH | `phanquyendulieu/html/phanquyenpheduyetdiem.html` | 187 | 19 | `btnExtend_Search`, `btnThem_PhanQuyen`, `btnThem_Muc_DonVi_PhanQuyen` | indexi | **XONG** (1/10) — chờ người dùng xem trên host. Hai cột `skin-2cot` (cột trái danh sách người dùng: luật `.table-img` / `.btn-circle` / `tr-bg` / `.skin-timkiem` thêm vào `cau-noi.css`); hai bảng đã / chưa phân quyền `ums-grid--2` như gốc. Nguồn `html/` + `goc/` trong `_harness/skin-nguon.zip` |
| 4 | Quản lý đợt thi | `quanlydotthi/html/quanlydotthi.html` | 244 | 23 | `btnSearch_DotThi` | indexi | **XONG** (1/10) — 23/23 id, 12/12 lang, 0 lỗi JS, đã chụp kiểm sau spa, chờ người dùng xem trên host |
| 5 | Quản lý phúc tra, phúc khảo | `quanlyphuctraphuckhao/html/quanlyphuctraphuckhao.html` | 304 | 34 | `input-datepicker`, `chosen-select` | indexi | **XONG** (1/10) — 34/34 id, 8/8 lang, 0 lỗi JS, đã chụp kiểm sau spa, chờ người dùng xem trên host |
| 6 | Quản lý thi tự luận | `quanlythi/html/quanlythituluan.html` | 321 | 36 | `input-datepicker`, `chosen-select` | indexi | chưa |
| 7 | Tạo đề thủ công | `quanlybode/html/taodethucong.html` | 437 | 48 | tab BS3, `btnSearch_DeThiThuCong` | indexi | chưa |
| 8 | Giám sát thi | `quanlythi/html/giamsatthi.html` ⚠ | 787 | 85 | `input-datepicker` | (ngoài menu host kiểm) | chưa — xác nhận tệp (mục 8) |
| 9 | Duyệt điểm thi trắc nghiệm | `pheduyetdiem/html/pheduyetdiem.html` ⚠ | 676 | 73 | 5 tab, `btnSearch_PhongThi_Tab2…5`, `input-datepicker` | (ngoài menu host kiểm) | chưa — xác nhận tệp (mục 8) |
| 10 | Nhập ngân hàng câu hỏi | `nhapnganhangcauhoi/html/nhapnganhangcauhoi.html` | 851 | 94 | **CKEditor + CKFinder**, **modal BS3**, tab | index | chưa |
| 11 | Quản lý ngân hàng câu hỏi | `quanlynganhangcauhoi/html/quanlynganhangcauhoi.html` | 1687 | 175 | CKEditor, modal, tab, `btnEdit`, `btnThaoTac`, nhiều `btnClose_*` | indexi | **XONG** (2/10) — 175/175 id, 0 lỗi JS; bỏ các nút Đóng thừa bên trong (chỉ giữ Đóng ngoài cùng); badge số đếm đặt cạnh tiêu đề panel; bỏ toàn bộ class fix cứng `skin-w-...`/`skin-max-...`; toolbar và filter responsive không đè nút, padding/margin thoáng đẹp |
| 12 | Quản lý thi | `quanlythi/html/quanlythi.html` | 2318 | 231 | modal, tab, `btnCloseSubDetail`, `btnClose_CBCT`… — LỚN NHẤT | indexi | **XONG** (1/10) — 231/231 id, 18 zone/modal, 0 lỗi JS, đã chụp kiểm sau spa, chờ người dùng xem trên host |

Tệp khác trong phân hệ, KHÔNG thấy trên menu (hỏi người dùng có làm không):
`phanquyendulieu/html/phanquyendulieu.html` (166 / 16), `phanquyendulieu/html/phanquyendulieugroupquestion.html` (174 / 17),
`quanlythi/html/duyetdiemthituluan.html` (299 / 35), `quanlynganhangcauhoi/html/viewquanlynganhangcauhoi.html` (1670 / 163 — gần
trùng `quanlynganhangcauhoi.html`, dùng CHUNG tệp JS `quanlynganhangcauhoi.js`).

Thứ tự đề xuất: 2 → 3 → 4 → 5 → 6 → 7 (nhỏ, cùng khuôn "tìm kiếm + danh sách + biểu mẫu" như màn mẫu) → 8, 9 → 10, 11, 12
(có modal, CKEditor — làm sau khi đã quen). **Mỗi màn xong thì DỪNG cho người dùng xem trên host** rồi mới sang màn kế.

## 3. Nơi để các thứ

```
App_Themes/Cms/Custom_V1/ums/          ← thư mục MỚI, kho gốc không có → pull không bao giờ đè
├── ums-skin.css                        tự sinh (skin.py css) — ĐỪNG sửa tay. Màn nạp bằng <link> đầu tệp html
├── cau-noi.css                         viết tay: luật riêng của bộ lột da + vẽ lại markup do JS gốc sinh
├── html/<đường dẫn màn>                bản lột da — NGUỒN để sửa
└── goc/<đường dẫn màn>                 bản gốc của kho lúc bắt đầu lột da — MỐC so sánh
_harness/skin.py                        công cụ (css / them / kiem / ap / nhan / dong-goi)
_harness/skin-chup.js                   chụp kiểm trong vỏ indexi trên máy
_v1_deploy/                             gói lên host (tự dựng, .gitignore chặn)
```

Tệp html ở **vị trí gốc** (vd `ApisQuanLyThiTracNghiem/modules/quanlybode/html/quanlybode.html`) bị chép đè bằng bản lột
da (`skin.py ap`). Đây là NGOẠI LỆ của luật "tệp gốc luôn theo kho gốc" (CLAUDE.md mục 9).

## 4. Quy trình một màn — làm đúng thứ tự

```bash
# 0. máy chủ tĩnh (để chạy nền)
powershell -ExecutionPolicy Bypass -File _harness\serve.ps1

# 1. đăng ký màn: chép bản gốc vào goc/ và html/
python _harness/skin.py them ApisQuanLyThiTracNghiem/Modules/quanlydonvi/html/quanlydonvi.html

# 2. đọc bản gốc + JS của màn, biết cái gì JS bám vào
python _harness/skin.py kiem          # in danh sách "class móc" của màn — những class này PHẢI giữ

# 3. sửa App_Themes/Cms/Custom_V1/ums/html/<đường dẫn> theo mục 5–6
#    (dòng chú thích đầu tệp + thẻ <link> lấy y nguyên từ màn mẫu quanlybode.html)

# 4. gộp CSS (cập nhật ?v= trên thẻ link) → áp → kiểm
python _harness/skin.py css
python _harness/skin.py ap
python _harness/skin.py kiem          # phải "OK … đang áp", không dòng lỗi nào

# 5. chụp kiểm trong vỏ indexi — mở QUA MENU, chụp từng vùng .zone-bus
node _harness/skin-chup.js 0DD9E9FAF61D4616BE322318368FF15D ApisQuanLyThiTracNghiem quanlydonvi/html/quanlydonvi.html donvi-
#    ảnh ở %TEMP%/ums-skin-chup/ — MỞ XEM TỪNG ẢNH. So với bản gốc: chép goc/… đè tệp gốc, chụp tiền tố khác, rồi `skin.py ap`.

# 6. đóng gói → báo người dùng chép _v1_deploy lên gốc ứng dụng (cùng cấp indexi.aspx)
python _harness/skin.py dong-goi
```

Tên màn trong `them`: đường dẫn từ gốc dự án; chữ hoa / thường không quan trọng (Windows) — `dong-goi` tự lấy đúng cách
viết trên đĩa (`modules` viết thường).

## 5. Luật bắt buộc (người dùng đã chốt)

1. **KHÔNG thêm / sửa JS.** Chỉ đổi markup + class + CSS.
2. **Giữ nguyên mọi `id`, `name`**, kể cả id TRÙNG của bản gốc (vd `lblGroupQuestionDetail` hai chỗ) — JS có thể đang dựa vào.
3. **Giữ mọi class móc JS** mà `skin.py kiem` in ra (`zone-bus`, `btnClose`, `select-opt`, `chosen-select`, `input-datepicker`,
   `tab-pane`, `tab-content`, `active`, `lang`, `myModalLabel`, `modal*`, `btnSearch_*`, `btnAdd`…). `btn` / `form-control` phải
   còn trên MỌI phần tử CÓ id (Corei `showAllId`, phím Ctrl+Y, đọc id theo hai class này); phần tử trang trí không id thì bỏ được.
4. **GIỮ NGUYÊN khung ngoài của vỏ:** `section.content` > `div.col-lg-12` … `div.clear` y như gốc. Gắn `ums-skin` lên CHÍNH
   `section.content` (`<section class="content ums-skin">`), KHÔNG chèn thẻ bọc mới. Vỏ indexi định kiểu theo chuỗi
   `#main-content-wrapper .content …` và `.content-header` (breadcrumb) nằm ngoài màn — đừng động.
5. **`.zone-bus` là lớp bọc TRONG SUỐT** (luật `!important` trong `cau-noi.css`). Khung trắng là `div.ums-panel` nằm BÊN TRONG:
   ```html
   <div class="zone-bus" id="zoneExamStruct" style="display: none">
       <div class="ums-panel"> … </div>
   </div>
   ```
   `id`, `zone-bus`, `style="display:none"` ở lớp ngoài như gốc (JS ẩn / hiện bằng `edu.util.toggle_overide`).
6. **Khung bộ lọc KHÔNG có dòng tiêu đề** ("Tìm kiếm") — chỉ `ums-panel > ums-panel__body > ums-filter`.
7. **Bảng KHÔNG sát mép khung** (khác `_v2`): `div.ums-tablewrap` đặt thẳng trong `ums-panel`, CSS tự cách mép bằng padding
   và kẻ đường cuối.
8. **Bám bố cục gốc**: một cột vẫn một cột, hai cột (`col-sm-3` | `col-sm-9`) vẫn hai cột (`skin-2cot`). Không thêm tiêu đề,
   khối, nút nào bản gốc không có.
9. Nút **"Đóng" ngoài cùng bên TRÁI** nhóm nút. Nút "Xóa" (xoá dòng đã chọn) dùng `ums-btn--delsel` (tự dạt cuối nhóm).
10. **Biểu tượng vẫn là Font Awesome 4** (vỏ cũ chỉ nạp FA4): thêm `fa-plus`, lưu `fa-floppy-o`, xoá `fa-trash-o`, tìm
    `fa-search`, đóng `fa-times`, sửa `fa-pencil-square-o`, xem `fa-eye`, tải `fa-download`, in `fa-print`.
11. Bỏ `for="…"` trỏ vào id không tồn tại (gốc hay có) — không phải móc, và làm bấm chữ không chọn được ô.
12. **KHÔNG gán độ rộng cố định (`skin-w-...`, `skin-max-...`) trên input/select.** Toàn bộ input, select trong bộ lọc phải tuân theo hệ flex/grid responsive của `ums-filter`, `ums-field` (`flex: 1 1 180px; min-width: 130px;`), tự co giãn theo độ rộng màn hình/cột, không tràn và không để khoảng trắng vô lý.
13. **Thanh công cụ tác vụ (`.skin-toolbar`) & nhóm nút (`.skin-toolbar-group`)**: Luôn có `flex-wrap: wrap; gap: var(--ums-sp-2);`. Không dùng `flex-wrap: nowrap` khiến các nút bị đè chồng lên nhau khi màn hình hẹp hay khi đặt trong cột con của `skin-2cot`. Các select/chosen trong toolbar khống chế `min-width: 160px; max-width: 260px; width: auto !important`.
14. **Số đếm (Badge) trong tiêu đề Panel**: Đặt badge số đếm (`span.ums-badge.ums-badge--info`) **ngay bên trong** thẻ `<h3 class="ums-panel__title">`, liền kề sau chữ tiêu đề (vd: `<h3 class="ums-panel__title"><i class="fa fa-hdd-o"></i> Danh sách <span class="ums-badge ums-badge--info"><span id="..."></span></span></h3>`). **KHÔNG** đặt vào `.ums-panel__tools` vì `justify-content: space-between` của panel head sẽ đẩy badge dạt sang tận mép phải.
15. **Nút Đóng (`.btnClose`) của panel/modal**: Ở các màn hình chi tiết nhiều tầng/tab (như `zoneGroupQuestionDetail`), chỉ giữ duy nhất nút Đóng ngoài cùng của panel lớn. **KHÔNG** để lặp lại các nút Đóng con thừa thãi ở panel con hoặc toolbar bên trong.
16. **Thanh phân trang bảng ("Hiển thị [ 10 ] dữ liệu")**: Markup do JS gốc (`systemroot.js`) sinh ra dạng `[class*="zone-pag-header"]` chèn ngay trước thẻ `<table>`. Phải có khoảng cách (margin) tách rời khỏi bảng: `margin-bottom: var(--ums-sp-3) !important` và `margin-top: var(--ums-sp-3) !important` trên bảng. Ô chọn số lượng (`.aps-hienthi-input .select2-container` / `select`) phải nhỏ gọn: chiều cao `24px !important`, cỡ chữ `12px`, padding `0 18px 0 6px`, độ rộng `62px` để cân xứng với nhãn nghiêng *"Hiển thị"* và *"dữ liệu"*.
17. **Luôn bọc `ums-panel__body` đầy đủ**: Bất kỳ panel nào chứa bộ lọc, thanh tác vụ, bảng dữ liệu đều phải bọc trong `<div class="ums-panel__body">`. Thiếu thẻ này sẽ làm nội dung mất padding, dính sát vào mép đường viền của panel.

## 6. Bảng đổi class (cũ → mới)

| Bản gốc | Bản lột da |
|---|---|
| `box box-solid` (khung) | `ums-panel` |
| `box-header with-border` | `ums-panel__head` |
| `h3.box-title` | `h3.ums-panel__title` (giữ `<i class="fa …">` đầu) |
| `box-tools pull-right`, `pull-right title-note` | `ums-panel__tools` |
| `box-body` | `ums-panel__body` |
| `box-footer` | `ums-panel__foot` (thêm `ums-row--end` nếu chỉ có nút bên phải) |
| `row` + `col-sm-2` (nhãn) + `col-sm-10` (ô) | `ums-field ums-field--inline` > `label.ums-field__label` + `div.ums-field__control` |
| hàng ô lọc `col-sm-3 item-search` | `ums-filter` > `ums-field` (nút Tìm kiếm: `ums-field ums-field--fit`) |
| `input.form-control` | `input.form-control.ums-input` (ô số ngắn: thêm `ums-input--so`) |
| `select.select-opt` | giữ nguyên `select-opt` (Corei bọc select2; CSS tự cho đầy ô) |
| `select.chosen-select` | `chosen-select ums-select` (Corei KHÔNG bọc plugin nào — ô chọn thường) |
| `btn btn-primary` | `btn ums-btn ums-btn--primary` |
| nút Lưu / Cập nhật | `btn ums-btn ums-btn--save` |
| `btn btn-default` Xóa | `btn ums-btn ums-btn--delsel` |
| `btn btn-default` Đóng / Tải file | `btn ums-btn ums-btn--ghost` (Đóng chỉ biểu tượng ở đầu khung: giữ `title="Đóng"`) |
| `table.table.table-hover.table-bordered` (trong `row` / `scroll-table-x`) | `div.ums-tablewrap` > `table.ums-table` (giữ `id`, `thead`, `tfoot`, class `td-center`/`td-fixed` trên `th`) |
| `span.badge.bg-light-blue` (đếm) | `span.ums-badge.ums-badge--info` (tự ẩn khi rỗng) |
| `ul.nav.nav-tabs` > `li.active` > `a[data-toggle=tab]` | `ul.ums-tabs` > `li.ums-tabs__item.active` > `a[data-toggle=tab]` — GIỮ `li.active`, `data-toggle`, `href` (JS tab của BS3) |
| `div.tab-content` > `div.tab-pane.active` | giữ nguyên (Bootstrap ẩn / hiện tab bằng hai class này) |
| `label style="color:#0073b7"` (giá trị chỉ xem) | `label.skin-gt` |
| `label style="color:red"` (cảnh báo / số đếm đỏ) | `label.skin-canh` |
| hai cột `col-sm-3` + `col-sm-9` | `div.skin-2cot` > hai khối |
| vùng in / xem trước (`float:left; background:#fff; margin:20px`) | `div.skin-xemin` |
| khối nút in lớn (`fa-4x`, div có id làm nút) | div ĐÓ mang `ums-btn ums-btn--save` / `--ghost`, `role="button"` (giữ id — JS gắn click vào div) |

Markup do **JS gốc sinh** (nút `btn btn-default` trong ô bảng, `td-center`, phân trang `zone-pag-*`, `light-pagination`) KHÔNG
sửa được (cấm sửa JS) → đã vẽ lại trong `cau-noi.css` dưới `.ums-skin`. Màn mới sinh kiểu markup khác thì THÊM luật vào
`cau-noi.css` (luôn bắt đầu bằng `.ums-skin`), không sửa `_v2/assets/css`.

## 7. Kiểm trước khi báo xong

- `skin.py kiem` = **OK … đang áp**, không dòng "thiếu id / name / class móc / mất khung ngoài".
- `skin-chup.js`: `breadcrumb` có chữ, `khung` bắt đầu `#main-content-wrapper > section.content.ums-skin > div.col-lg-12`,
  `cssLotDa: true`, `traRaNgoai: []`, **Lỗi JS: không**. Mở XEM mọi ảnh vùng (form, tab, bảng).
- Màn có tab: bấm từng tab (thêm lệnh `$('a[href="#tab_2"]').click()` như trong lịch sử quanlybode) — tab BS3 phải chuyển.
- Màn có modal: mở modal bằng `$('#<idModal>').modal('show')` trong trang, chụp. Giữ khung `.modal > .modal-dialog >
  .modal-content > .modal-header / .modal-body / .modal-footer` (JS Bootstrap + `modal*` là móc); chỉ lột da BÊN TRONG body / footer.
- Màn có CKEditor: `textarea` / `div` mang id mà `CKEDITOR.replace('<id>')` dùng phải giữ id và giữ LOẠI thẻ.
- Harness không có dữ liệu: bảng trống. Muốn thấy dòng thì chèn tay vài `<tr>` đúng chuỗi mà `mRender` của màn sinh (xem JS).

## 8. Bẫy đã gặp — đừng lặp lại

1. **Vỏ của một màn KHÁC NHAU giữa các host.** Chọn vỏ theo cột `TENANH` của chức năng trong CSDL TỪNG host: bắt đầu `"fa "` →
   `indexi.aspx`, rỗng / kiểu khác → `index.aspx` ([Core/systemroot.js:856](Core/systemroot.js#L856)). Cùng ID `C9A37C62…`
   "Quản lý bộ đề": host Phenikaa `TENANH = fa …` → indexi; host đang kiểm `TENANH` rỗng → index. Kiểm trên host:
   `edu.system.dtChucNang.find(x => /quanlybode\.html/.test(x.DUONGDANFILE)).TENANH` (F12 → Console). Bộ lột da mới chỉ
   kiểm trong **indexi**; muốn đưa về indexi trên host kiểm: CMS → `chucnang` → đặt icon `fa fa-angle-double-right` (ghi CSDL —
   người dùng quyết). Chưa kiểm trong `index.aspx` (Bootstrap 5, `Core/`).
2. **Nạp màn thẳng bằng `edu.system.loadFunctionPath` là MẤT breadcrumb** (breadcrumb do `initMain` điền `#lblPath_ChucNang`).
   Người dùng đã tưởng lỗi. Luôn mở QUA MENU (`skin-chup.js` làm sẵn). `loadFunctionPath` tự thêm appCode: truyền `/Modules/…`.
3. **Lần đầu đã bỏ `div.col-lg-12` và chèn `div.ums-skin`** → lệch khung vỏ. Nay `skin.py kiem` báo "mất khung ngoài".
4. `.zone-bus` bị vỏ tô nền / bóng → phải `!important` (đã có trong `cau-noi.css`), và khung trắng phải là `ums-panel` bên trong.
5. `ums-stack` (flex) trên vùng `zone-bus`: jQuery `slideDown` đặt `display:block` nội tuyến → mất flex. Vùng zone-bus để
   block thường, khoảng cách giữa khung do luật `.ums-panel + .ums-panel`.
6. Luật "dải tab chỉ một tab thì ẩn" của `_v2` nhắm `.ums-tabs__item` con TRỰC TIẾP — vì thế class đặt lên `li`, không đặt lên `a`.
7. Sửa `cau-noi.css` / CSS `_v2` mà quên `skin.py css` → host dùng CSS cũ; `css` tự đổi `?v=` trên thẻ link của mọi màn → phải
   `ap` lại rồi `dong-goi`.
8. Harness Edge để lại hồ sơ trăm MB — `skin-chup.js` tự xoá; script tự viết thì nhớ xoá (`%TEMP%/ums-edge-*`).
9. Máy chủ tĩnh chạy nền bị dừng khi hết giờ — chạy lại `serve.ps1` nếu `skin-chup.js` treo ở bước đầu.
10. **Gán cứng pixel (`skin-w-...`, `skin-max-...`)** trên input, select làm vỡ layout responsive khi thay đổi kích cỡ màn hình hoặc trong cột hẹp (`skin-2cot`). Đã bỏ toàn bộ, chuyển sang flex của `ums-field`.
11. **Bỏ sót `<div class="ums-panel__body">`** trong các panel con làm mất padding (gặp ở `zonebatdauGroupQuestionDetail`), khiến bộ lọc và bảng bị dính sát mép viền. Luôn bọc body.
12. **Nút đè nhau trong thanh tác vụ (`.skin-toolbar`)**: nếu để `nowrap` và `justify-content: space-between`, hai nhóm nút hai đầu sẽ va vào nhau trên màn hình hẹp. Phải luôn có `flex-wrap: wrap; gap: var(--ums-sp-2)` cho cả toolbar và từng nhóm.

## 9. Sau MỖI lần pull kho gốc

```bash
python _harness/skin.py kiem      # "chưa áp" = pull đã đè bằng bản gốc → chạy ap
python _harness/skin.py ap        # "kho gốc đã đổi" → ap DỪNG, kiem in diff mốc → gốc hiện tại
# kho gốc đổi màn đã lột da: chuyển thay đổi đó vào html/<màn> (id / nút / ô mới…), rồi
python _harness/skin.py nhan <đường dẫn màn>   # lấy gốc hiện tại làm mốc mới
python _harness/skin.py ap && python _harness/skin.py dong-goi
```

## 10. Git

Chưa commit gì của việc này (người dùng chưa duyệt màn mẫu trên host). Khi người dùng báo ổn: commit `App_Themes/Cms/Custom_V1/ums/`,
`_harness/skin.py`, `_harness/skin-chup.js`, tệp html màn đã áp, `spa-v1.md`, CLAUDE.md; KHÔNG commit `_v1_deploy/`.
