# Lớp CSS `_v2` — SINH TỰ ĐỘNG (`python _harness\sinh-class.py`)

Chỉ những lớp có ở đây mới tồn tại. Tiền tố: `ums-u-*` tiện ích (lề, cỡ chữ, màu nhạt), `ums-grid--N` lưới N cột, `is-*` trạng thái (xem CSS).
Màn KHÔNG tự đặt tên lớp mới trong JS; cần lớp mới → thêm vào CSS nguồn + chạy lại tệp này + `gop-css.py`.

| Nhóm | Các lớp | Tệp | Chú thích gần nhất trong CSS |
|---|---|---|---|
| `ums-app` | `ums-app` | objects/shell.css | 5. OBJECTS — khung ứng dụng Thanh trên cố định + cột trái cố định + vùng nội dung cuộn. Toàn bộ điều hướng nằm trong một trang: chọn chức nă |
| `ums-ava` | `ums-ava` | components/patterns.css | ---------- Danh sách cán bộ (ums.pat.dsNhanSu / masterNhanSu) + ảnh người tròn (ums.pat.anhNguoi) ---------- |
| `ums-avatar` | `ums-avatar` `ums-avatar__hint` `ums-avatar__none` | components/field.css | Ảnh đại diện (ums.files.avatar) — tỉ lệ 3:4 như ảnh hồ sơ 336×448 |
| `ums-badge` | `ums-badge` `ums-badge--bad` `ums-badge--info` `ums-badge--mute` `ums-badge--ok` `ums-badge--plain` `ums-badge--warn` | components/chip.css | ---------- Nhãn trạng thái ------------------------------------------------ |
| `ums-btn` | `ums-btn` `ums-btn--add` `ums-btn--block` `ums-btn--danger` `ums-btn--del` `ums-btn--delsel` `ums-btn--dong` `ums-btn--ghost` `ums-btn--navy` `ums-btn--out-danger` `ums-btn--out-info` `ums-btn--out-primary` `ums-btn--out-success` `ums-btn--out-warn` `ums-btn--primary` `ums-btn--quiet` `ums-btn--save` `ums-btn--sm` `ums-btn--tailai` `ums-btn--warn` | components/button.css, components/dialog.css, components/thuvai.css, objects/shell.css | 6. COMPONENTS — nút |
| `ums-busy` | `ums-busy` | components/toast.css | ---------- Chỉ báo đang tải ----------------------------------------- Vạch chạy mảnh ở mép trên. Không chặn thao tác, không che nội dung — k |
| `ums-canquyet` | `ums-canquyet` `ums-canquyet__foot` `ums-canquyet__luu` `ums-canquyet__nhom` `ums-canquyet__now` `ums-canquyet__so` `ums-canquyet__tl` | components/patterns.css | ---------- Khung "Ghi chú chuyển đổi" (app.js veCanQuyet, sổ assets/js/can-quyet.js) ---------- |
| `ums-card` | `ums-card` `ums-card--acts` `ums-card--bad` `ums-card--mute` `ums-card--ok` `ums-card--warn` `ums-card__acts` `ums-card__body` `ums-card__no` `ums-card__row` | components/patterns.css | Thẻ tra cứu chứng từ — DỰNG THEO BẢN GỐC: nền xám nhạt, mép trái răng cưa như cuống biên lai, mỗi dòng "nhãn : giá trị" ngăn nhau bằng vạch  |
| `ums-cards` | `ums-cards` | components/patterns.css | ---------- Lưới thẻ (ums.pat.cards) ------------------------------------- |
| `ums-cell` | `ums-cell__sub` `ums-cell__title` | components/patterns.css, components/table.css | Mục đang chọn: MỌI chữ bên trong đều trắng. Các lớp như .ums-cell__title tự đặt màu xanh than nên không thừa kế được màu của mục — phải nói  |
| `ums-cellbox` | `ums-cellbox` `ums-cellbox__text` | components/patterns.css | ---------- Lưới nhập: dòng × cột (ums.pat.matrix) ----------------------- |
| `ums-check` | `ums-check` | components/field.css, components/patterns.css, components/table.css | Đánh dấu một phần (chọn tất cả khi mới chọn vài dòng) → gạch ngang |
| `ums-checkgrid` | `ums-checkgrid` `ums-checkgrid--3` | components/field.css, components/patterns.css | Hai ô đánh dấu đứng CÙNG MỘT HÀNG thì cách nhau; đứng theo CỘT thì không. Trước đây luật này không phân biệt, nên mọi danh sách dọc tự dựng  |
| `ums-checklist` | `ums-checklist` | components/field.css | Hai ô đánh dấu đứng CÙNG MỘT HÀNG thì cách nhau; đứng theo CỘT thì không. Trước đây luật này không phân biệt, nên mọi danh sách dọc tự dựng  |
| `ums-chip` | `ums-chip` `ums-chip__count` | components/chip.css | ---------- Chip lọc ------------------------------------------------------ |
| `ums-chips` | `ums-chips` | components/chip.css | ---------- Chip lọc ------------------------------------------------------ |
| `ums-code` | `ums-code` | components/settings.css | ---------- Khối mã xuất ra --------------------------------------------- |
| `ums-color` | `ums-color` `ums-color__hex` `ums-color__swatch` | components/settings.css | ---------- Ô chọn màu ------------------------------------------------- |
| `ums-cols` | `ums-cols` | components/panel.css | … TRỪ khi hai khung nằm trong một khung XẾP CỘT (grid / flex): ở đó khoảng cách đã do `gap` lo, cộng thêm lề trên là cột phải bị tụt xuống m |
| `ums-crumb` | `ums-crumb` `ums-crumb__cur` `ums-crumb__help` `ums-crumb__link` `ums-crumb__sep` | components/crumb.css | 6. COMPONENTS — đường dẫn phân cấp Bắt đầu bằng biểu tượng nhà, kết thúc bằng nút dấu hỏi hướng dẫn nằm sát mép phải. |
| `ums-dh` | `ums-dh` `ums-dh__dong` `ums-dh__ky` `ums-dh__moi` `ums-dh__nhom` `ums-dh__pane` `ums-dh__phai` `ums-dh__tg` `ums-dh__tk` `ums-dh__tk--ky` `ums-dh__trai` `ums-dh__tt` | components/diemhoc.css, components/table.css | Chiều rộng cột y như màn Đăng ký học (ums.pat.master): cột trái CỐ ĐỊNH --ums-master-side, phần còn lại cho nội dung — người dùng chốt 2026- |
| `ums-diachi` | `ums-diachi__btn` | components/field.css | Ô địa chỉ (ums.pat.diaChi): nút kính lúp bấm được, khác biểu tượng trang trí |
| `ums-dialog` | `ums-dialog` `ums-dialog--bad` `ums-dialog--content` `ums-dialog--lg` `ums-dialog--md` `ums-dialog--sm` `ums-dialog--xl` `ums-dialog__body` `ums-dialog__content` `ums-dialog__extra` `ums-dialog__foot` `ums-dialog__head` `ums-dialog__icon` `ums-dialog__msg` `ums-dialog__title` | components/button.css, components/dialog.css | 6. COMPONENTS — hộp xác nhận (ums.ui.confirm) Dùng thẻ <dialog> gốc của trình duyệt: tự bẫy tiêu điểm, tự đóng bằng Esc, tự có lớp nền — khô |
| `ums-drop` | `ums-drop` `ums-drop__caret` `ums-drop__item` `ums-drop__mark` `ums-drop__menu` `ums-drop__no` `ums-drop__text` `ums-drop__toggle` | components/report.css, objects/shell.css | ---------- Nút thả xuống "Báo cáo" / "Import" ---------------------------- |
| `ums-dsl` | `ums-dsl` `ums-dsl__dau` | components/table.css | Danh sách lịch trong ô (ums.ui.escBr tự dựng từ "Tu … den …:<br>Thu 3 tiet …"): mỗi khoảng thời gian một mục có dấu đầu dòng, luôn căn trái  |
| `ums-dsns` | `ums-dsns__dau` `ums-dsns__ghichu` `ums-dsns__item` `ums-dsns__loc` `ums-dsns__nut` | components/patterns.css | Nút biểu tượng đang bật (bộ lọc nâng cao mở / đang có điều kiện lọc) |
| `ums-dtg` | `ums-dtg__name` `ums-dtg__noco` `ums-dtg__ten` | components/patterns.css | ---------- Khung đối tượng đang chọn (pat.dauDoiTuong) + thanh thao tác tab (pat.thanhThu) ---------- |
| `ums-empty` | `ums-empty` | components/panel.css | Trạng thái rỗng |
| `ums-fail` | `ums-fail` `ums-fail__msg` | components/toast.css | ---------- Khối rỗng khi lỗi ----------------------------------------- |
| `ums-field` | `ums-field` `ums-field--fit` `ums-field--inline` `ums-field__control` `ums-field__error` `ums-field__hint` `ums-field__label` `ums-field__req` | components/field.css, components/patterns.css, objects/grid.css | ---------- Dòng biểu mẫu: nhãn trên, ô dưới ----------------------------- |
| `ums-file` | `ums-file` `ums-file__btn` `ums-file__input` `ums-file__name` | components/field.css | Ô CHỌN TỆP — ums.ui.file Nhìn như một ô nhập có nút ở đầu: cùng chiều cao, cùng viền, cùng bo góc với .ums-input / select2 nên đứng cạnh nha |
| `ums-files` | `ums-files` `ums-files__del` `ums-files__empty` `ums-files__ic` `ums-files__ic--doc` `ums-files__ic--img` `ums-files__ic--pdf` `ums-files__ic--xls` `ums-files__item` `ums-files__list` `ums-files__name` `ums-files__pick` `ums-files__tag` | components/field.css | ---------- Tệp đính kèm của bản ghi (ums.files) ------------------------- Nút "Chọn tệp" + danh sách tệp: tệp đã lưu là liên kết mở tab mới, |
| `ums-filter` | `ums-filter` `ums-filter--stack` | components/patterns.css, objects/grid.css | Cột trái 320px: nhóm ô đánh dấu luôn MỘT CỘT và mỗi mục MỘT DÒNG — hai cột thì tên dài ("Phòng ĐT không QL") bị bẻ đôi, nhìn như hai mục khá |
| `ums-fontwarn` | `ums-fontwarn` `ums-fontwarn__x` | components/toast.css | Băng cảnh báo thiếu phông biểu tượng (app.js: kiemPhongBieuTuong) |
| `ums-formtrang` | `ums-formtrang` | components/patterns.css | ---------- Biểu mẫu / màn con THAY CHỖ màn (ums.pat.formTrang) ------------------------------------------------ host mang data-ft-mo khi đan |
| `ums-grid` | `ums-grid` `ums-grid--12` `ums-grid--2` `ums-grid--3` `ums-grid--4` `ums-grid--cards` `ums-grid--main-aside` `ums-grid--tiles` | components/panel.css, objects/grid.css | … TRỪ khi hai khung nằm trong một khung XẾP CỘT (grid / flex): ở đó khoảng cách đã do `gap` lo, cộng thêm lề trên là cột phải bị tụt xuống m |
| `ums-gsearch` | `ums-gsearch` `ums-gsearch__dang` `ums-gsearch__icon` `ums-gsearch__input` `ums-gsearch__item` `ums-gsearch__kbd` `ums-gsearch__list` `ums-gsearch__more` `ums-gsearch__nhom` `ums-gsearch__state` `ums-gsearch__state--tai` `ums-gsearch__sub` `ums-gsearch__ten` | objects/shell.css | Nút Menu + logo: tối thiểu bằng cột trái (trừ đệm trái của thanh và khoảng cách) → ô tìm bắt đầu THẲNG MÉP cột trái khi logo ngắn; logo dài  |
| `ums-gtable` | `ums-gtable` `ums-gtable__g` | components/patterns.css | ---------- Bảng gộp ô theo nhóm (ums.pat.groupTable) -------------------- |
| `ums-hovercard` | `ums-hovercard` `ums-hovercard__ava` `ums-hovercard__in` `ums-hovercard__row` `ums-hovercard__rows` | components/toast.css | THẺ THÔNG TIN KHI RÊ CHUỘT (ums.ui.hoverCard) Giữ đúng dáng popover của hệ cũ: thẻ trắng bo góc, ảnh bên trái, các dòng "biểu tượng · nhãn : |
| `ums-iconbtn` | `ums-iconbtn` `ums-iconbtn--del` `ums-iconbtn--edit` `ums-iconbtn--view` | components/button.css, components/lich.css, components/patterns.css | Lưới an toàn: nút ↻ tự vẽ dạng .ums-iconbtn trong nhóm nút của KHUNG / đầu trang cũng xếp CUỐI (trừ đầu cột trái — ở đó ↻ đứng trước nút Bộ  |
| `ums-in-fade` | `ums-in-fade` | generic/motion.css | `backwards` chứ không phải `both`: giữ trạng thái ĐẦU trong lúc chờ độ trễ, nhưng chạy xong thì KHÔNG giữ trạng thái cuối. Giữ lại thì phần  |
| `ums-in-up` | `ums-in-up` `ums-in-up--2` `ums-in-up--3` `ums-in-up--4` `ums-in-up--5` `ums-in-up--6` | generic/motion.css | `backwards` chứ không phải `both`: giữ trạng thái ĐẦU trong lúc chờ độ trễ, nhưng chạy xong thì KHÔNG giữ trạng thái cuối. Giữ lại thì phần  |
| `ums-input` | `ums-input` `ums-input--sm` | components/dialog.css, components/field.css, components/lich.css, components/login.css, components/patterns.css, components/thuvai.css | Ô thêm ở chân hộp (pickNhanSu footExtra) — dạt trái, nút giữ bên phải |
| `ums-inputwrap` | `ums-inputwrap` | components/field.css | Ô nhập có biểu tượng bên phải |
| `ums-kv` | `ums-kv` `ums-kv--dam` `ums-kv--thuong` | components/patterns.css | ---------- Khối xem chỉ đọc "nhãn : giá trị" (.ums-kv) -------------------- Dùng cho khung chi tiết chỉ xem (vd hoso/quyetdinh): nhãn cố địn |
| `ums-lamtruoc` | `ums-lamtruoc` `ums-lamtruoc__dau` `ums-lamtruoc__mo` `ums-lamtruoc__phu` `ums-lamtruoc__x` | components/lamtruoc.css | Khung "Cần làm trước" (assets/js/lamtruoc.js) — ngay dưới khung Ghi chú chuyển đổi. Màu lưu ý (vàng đậm hơn khung Ghi chú) để người dùng thậ |
| `ums-lb` | `ums-lb` `ums-lb__chan` `ums-lb__goi` `ums-lb__man` `ums-lb__phu` | components/patterns.css | ---------- Bảng "Màn đang có lỗi backend" (trang vai trò / trang chủ — app.js lbBang) ---------- |
| `ums-legend` | `ums-legend` `ums-legend--bad` `ums-legend--cach` `ums-legend--ok` `ums-legend--warn` | components/panel.css, components/patterns.css | Tiêu đề nhóm bên trong biểu mẫu / khung xem Biểu mẫu dài gồm nhiều nhóm (thông tin chung, người nộp, chi tiết khoản thu…). Trước đây tiêu đề |
| `ums-lich-dd` | `ums-lich-dd__bar` `ums-lich-dd__o` `ums-lich-dd__sub` | components/lich.css | ---------- Hộp điểm danh một buổi (ums.lich.diemDanh) -------------------- |
| `ums-link` | `ums-link` | elements/base.css | LIÊN KẾT TRONG NỘI DUNG — nhìn là biết bấm được Dùng cho chỗ mở khung chi tiết, mở hồ sơ… việc đó không đáng một cái nút nhưng phải thấy đượ |
| `ums-login` | `ums-login` `ums-login__art` `ums-login__box` `ums-login__eye` `ums-login__field` `ums-login__field--pass` `ums-login__foot` `ums-login__form` `ums-login__ico` `ums-login__main` `ums-login__notify` `ums-login__or` `ums-login__sso` `ums-login__submit` `ums-login__svg` `ums-login__svg--off` `ums-login__svg--on` `ums-login__title` | components/login.css | 6. COMPONENTS — trang đăng nhập (_v2/login.aspx) Bám bố cục bản gốc: một thẻ trắng NẰM GIỮA, chia hai cột — biểu mẫu bên trái, ảnh minh hoạ  |
| `ums-logopreview` | `ums-logopreview` `ums-logopreview__box` `ums-logopreview__name` | components/settings.css | ---------- Xem trước logo --------------------------------------------- |
| `ums-lthang` | `ums-lthang` `ums-lthang__head` `ums-lthang__ngay` `ums-lthang__o` `ums-lthang__thu` | components/lich.css | ---------- Lịch tháng nhỏ ------------------------------------------------ |
| `ums-ltuan` | `ums-ltuan` `ums-ltuan__act` `ums-ltuan__body` `ums-ltuan__cot` `ums-ltuan__cotgio` `ums-ltuan__cx` `ums-ltuan__ev` `ums-ltuan__gio` `ums-ltuan__goc` `ums-ltuan__head` `ums-ltuan__ngay` `ums-ltuan__o` `ums-ltuan__tg` `ums-ltuan__trong` | components/lich.css | ---------- Lưới tuần ----------------------------------------------------- |
| `ums-main` | `ums-main` | objects/shell.css | ---------- Vùng nội dung ------------------------------------------------- |
| `ums-master` | `ums-master` `ums-master--danhmuc` `ums-master__adv` `ums-master__advtitle` `ums-master__filter` `ums-master__foot` `ums-master__item` `ums-master__item__act` `ums-master__item__main` `ums-master__item__sub` `ums-master__list` `ums-master__main` `ums-master__search` `ums-master__side` `ums-master__tt` | components/button.css, components/pager.css, components/panel.css, components/patterns.css | … TRỪ khi hai khung nằm trong một khung XẾP CỘT (grid / flex): ở đó khoảng cách đã do `gap` lo, cộng thêm lề trên là cột phải bị tụt xuống m |
| `ums-matrix` | `ums-matrix` `ums-matrix--text` `ums-matrix__cell` `ums-matrix__col` | components/patterns.css | Ô đã sửa nhưng chưa lưu |
| `ums-meter` | `ums-meter` `ums-meter--busy` `ums-meter__fill` `ums-meter__track` | components/report.css, components/table.css | Ô có thanh tỉ lệ |
| `ums-nav` | `ums-nav__caret` `ums-nav__empty` `ums-nav__group` `ums-nav__group--sub` `ums-nav__head` `ums-nav__head--sub` `ums-nav__icon` `ums-nav__label` `ums-nav__link` `ums-nav__single` `ums-nav__sub` | components/nav.css | ---------- Mục cha -------------------------------------------------------- |
| `ums-page` | `ums-page` `ums-page__actions` `ums-page__greet` `ums-page__head` `ums-page__title` `ums-page__when` | components/button.css, objects/shell.css | Thu cột trái trên màn hình rộng — bấm nút Menu ở thanh trên. Màn hình hẹp dùng kiểu ngăn kéo, xử lý ở khối thu hẹp bên dưới. |
| `ums-pager` | `ums-pager` `ums-pager__btn` `ums-pager__info` `ums-pager__list` `ums-pager__size` `ums-pager__sizelb` `ums-pager__sizesel` | components/pager.css, components/patterns.css, components/table.css | 6. COMPONENTS — phân trang |
| `ums-panel` | `ums-panel` `ums-panel__body` `ums-panel__body--flush` `ums-panel__foot` `ums-panel__head` `ums-panel__head--chinut` `ums-panel__title` `ums-panel__tools` | components/button.css, components/panel.css, components/patterns.css, components/table.css, components/tabs.css, objects/shell.css | 6. COMPONENTS — khung nội dung Thay cho .box của giao diện cũ, tên và định nghĩa đều mới. |
| `ums-pivot` | `ums-pivot` `ums-pivot__acts` `ums-pivot__cell` `ums-pivot__col` | components/patterns.css | ---------- Bảng xoay (ums.pat.pivot) ------------------------------------ |
| `ums-queue` | `ums-queue` `ums-queue__count` `ums-queue__history` `ums-queue__item` `ums-queue__name` `ums-queue__none` | components/report.css | ---------- Hàng đợi --------------------------------------------------- |
| `ums-radios` | `ums-radios` | components/patterns.css | Nhóm nút chọn MỘT (radio) ngắn trong khung lọc — "Đã nhập / Chưa nhập / Toàn bộ": xếp NGANG, xuống dòng thì thẳng mép trái, không thụt (ngườ |
| `ums-rolebar` | `ums-rolebar` `ums-rolebar__doi` `ums-rolebar__icon` `ums-rolebar__txt` | components/nav.css | ---------- Vai trò đang dùng (thay ô tìm chức năng cũ — tìm nay ở ô trên thanh trên, người dùng 2026-09-26) ---------- |
| `ums-row` | `ums-row` `ums-row--between` `ums-row--end` `ums-row--top` | objects/grid.css | Hàng ngang tự xuống dòng |
| `ums-rp-form` | `ums-rp-form` | components/report.css | ---------- Biểu mẫu trong hộp import ---------------------------------- |
| `ums-rp-link` | `ums-rp-link` | components/report.css | ---------- Biểu mẫu trong hộp import ---------------------------------- |
| `ums-rp-msg` | `ums-rp-msg` | components/report.css | ---------- Báo lỗi trong hộp + kết quả -------------------------------- |
| `ums-rp-progress` | `ums-rp-progress` `ums-rp-progress__head` `ums-rp-progress__hint` `ums-rp-progress__note` | components/report.css | ---------- Tiến trình import ----------------------------------------- |
| `ums-rp-result` | `ums-rp-result` | components/report.css | ---------- Báo lỗi trong hộp + kết quả -------------------------------- |
| `ums-rp-sum` | `ums-rp-sum` | components/report.css | ---------- Báo lỗi trong hộp + kết quả -------------------------------- |
| `ums-rp-view` | `ums-rp-view` `ums-rp-view__frame` | components/report.css | ---------- Xem tệp báo cáo ------------------------------------------- |
| `ums-scroll` | `ums-scroll` `ums-scroll--light` `ums-scroll__bar` `ums-scroll__thumb` `ums-scroll__view` | components/scroll.css | 6. COMPONENTS — vùng cuộn có thanh trượt tự vẽ Thanh trượt của trình duyệt chiếm chỗ thật trong bố cục, đẩy nội dung hẹp lại và để hở một dả |
| `ums-searchbar` | `ums-searchbar` `ums-searchbar--sm` `ums-searchbar__clear` `ums-searchbar__icon` `ums-searchbar__input` | components/patterns.css, components/searchbar.css | 6. COMPONENTS — ô tìm kiếm lớn trên trang Nền trắng, bo tròn nhiều, biểu tượng bên trái, nút xoá bên phải. |
| `ums-searchline` | `ums-searchline` `ums-searchline__count` | components/searchbar.css | Dòng chứa ô tìm kiếm + bộ đếm bên phải |
| `ums-section` | `ums-section` `ums-section__count` `ums-section__name` | objects/shell.css | Tiêu đề nhóm trong danh sách |
| `ums-sections` | `ums-sections` `ums-sections__sec` `ums-sections__tabs` | components/patterns.css | ---------- Nhiều tab × nhiều khung danh sách (ums.pat.sections) --------- Mở biểu mẫu ở một khung thì chỉ còn biểu mẫu đó: giấu dải tab và m |
| `ums-select` | `ums-select` | components/field.css, components/patterns.css | ---------- Ô nhập ------------------------------------------------------- |
| `ums-setgrid` | `ums-setgrid` | components/settings.css | 6. COMPONENTS — màn hình cài đặt |
| `ums-sidebar` | `ums-sidebar` `ums-sidebar__body` `ums-sidebar__foot` `ums-sidebar__top` | objects/shell.css | ---------- Cột trái ------------------------------------------------------ |
| `ums-sodo` | `ums-sodo` `ums-sodo__diem` `ums-sodo__khung` `ums-sodo__ma` `ums-sodo__nut` | components/sodo.css | Sơ đồ cây kiểu sơ đồ tổ chức — ums.pat.soDo (patterns.js) Cha ở trên, các con dàn ngang bên dưới; đường nối vẽ bằng ::before/::after của <li |
| `ums-stack` | `ums-stack` `ums-stack--tight` | objects/grid.css | Xếp dọc |
| `ums-stat` | `ums-stat` `ums-stat--amber` `ums-stat--green` `ums-stat--purple` `ums-stat--red` `ums-stat__icon` `ums-stat__label` `ums-stat__links` `ums-stat__main` `ums-stat__value` | components/stat.css | 6. COMPONENTS — thẻ số liệu |
| `ums-table` | `ums-table` `ums-table--lined` `ums-table--tight` `ums-table__grp` | components/button.css, components/field.css, components/patterns.css, components/table.css | Nút HÀNH ĐỘNG nằm trong Ô BẢNG luôn mang màu đã quy định, không để trung tính như chữ: kiểu mờ (ghost / quiet) trong bảng hiện màu xanh hành |
| `ums-tablefoot` | `ums-tablefoot` `ums-tablefoot__sum` | components/patterns.css, components/table.css | ---------- Vùng dưới bảng: tổng, chú thích, thanh thao tác -------------- |
| `ums-tablewrap` | `ums-tablewrap` `ums-tablewrap--tall` | components/diemhoc.css, components/patterns.css, components/table.css | Bảng SÁT MÉP khung trắng (quy ước bảng sát mép): bảng nằm thẳng trong khung tab thì tràn qua lề trong hai bên; bảng trong ô "kỳ học" có viền |
| `ums-tabs` | `ums-tabs` `ums-tabs__item` | components/tabs.css | 6. COMPONENTS — tab |
| `ums-textarea` | `ums-textarea` | components/field.css | ---------- Ô nhập ------------------------------------------------------- |
| `ums-thanhthu` | `ums-thanhthu` `ums-thanhthu__chon` `ums-thanhthu__ghichu` `ums-thanhthu__l` `ums-thanhthu__r` `ums-thanhthu__tong` | components/patterns.css | ---------- Khung đối tượng đang chọn (pat.dauDoiTuong) + thanh thao tác tab (pat.thanhThu) ---------- |
| `ums-tile` | `ums-tile` `ums-tile--amber` `ums-tile--blue` `ums-tile--green` `ums-tile--purple` `ums-tile--red` `ums-tile--slate` `ums-tile__body` `ums-tile__group` `ums-tile__icon` `ums-tile__name` | components/tile.css | 6. COMPONENTS — thẻ vai trò / phân hệ Ô vuông biểu tượng nền nhạt bên trái, tên đậm, nhãn nhóm màu theo nhóm. Màu nhóm đặt bằng biến cục bộ  |
| `ums-toast` | `ums-toast` `ums-toast--bad` `ums-toast--info` `ums-toast--ok` `ums-toast--warn` `ums-toast__body` `ums-toast__close` `ums-toast__icon` `ums-toast__msg` `ums-toast__title` | components/toast.css | Khi đang có hộp thoại, ums.ui.toast gắn hộp này VÀO hộp thoại (xem chú thích ở đó) — vẫn position:fixed nên chỗ đứng không đổi, vẫn góc dưới |
| `ums-toasts` | `ums-toasts` | components/toast.css | Khi đang có hộp thoại, ums.ui.toast gắn hộp này VÀO hộp thoại (xem chú thích ở đó) — vẫn position:fixed nên chỗ đứng không đổi, vẫn góc dưới |
| `ums-tonerow` | `ums-tonerow` `ums-tonerow__demo` `ums-tonerow__fields` `ums-tonerow__name` | components/settings.css | ---------- Xem trước tông màu nhóm ------------------------------------ |
| `ums-topbar` | `ums-topbar` `ums-topbar__avatar` `ums-topbar__brand` `ums-topbar__divider` `ums-topbar__dot` `ums-topbar__icon` `ums-topbar__left` `ums-topbar__logo` `ums-topbar__spacer` `ums-topbar__toggle` `ums-topbar__tools` `ums-topbar__user` | objects/shell.css | ---------- Thanh trên --------------------------------------------------- |
| `ums-tv-bao` | `ums-tv-bao` `ums-tv-bao--info` `ums-tv-bao--warn` | components/thuvai.css | ---------- Hộp tìm người học ------------------------------------------ |
| `ums-tv-dong` | `ums-tv-dong` | components/thuvai.css | ---------- Hộp tìm người học ------------------------------------------ |
| `ums-tv-hop` | `ums-tv-hop__goiy` `ums-tv-hop__ic` `ums-tv-hop__muc` `ums-tv-hop__nhan` `ums-tv-hop__o` | components/thuvai.css | ---------- Hộp tìm người học ------------------------------------------ |
| `ums-tv-the` | `ums-tv-the` `ums-tv-the__ma` `ums-tv-the__nhan` `ums-tv-the__ten` `ums-tv-the__x` | components/thuvai.css | ---------- Thẻ người đang thủ vai (đầu cột trái) ----------------------- |
| `ums-u-block` | `ums-u-block` | utilities/utilities.css | Hiển thị |
| `ums-u-blue` | `ums-u-blue` | utilities/utilities.css | Chữ |
| `ums-u-bold` | `ums-u-bold` | utilities/utilities.css | Chữ |
| `ums-u-center` | `ums-u-center` | utilities/utilities.css | Chữ |
| `ums-u-danger` | `ums-u-danger` | utilities/utilities.css | Chữ |
| `ums-u-ellipsis` | `ums-u-ellipsis` | utilities/utilities.css | Chữ |
| `ums-u-faint` | `ums-u-faint` | components/patterns.css, utilities/utilities.css | Mục đang chọn: MỌI chữ bên trong đều trắng. Các lớp như .ums-cell__title tự đặt màu xanh than nên không thừa kế được màu của mục — phải nói  |
| `ums-u-flex1` | `ums-u-flex1` | utilities/utilities.css | Hiển thị |
| `ums-u-fz12` | `ums-u-fz12` | utilities/utilities.css | Chữ |
| `ums-u-fz13` | `ums-u-fz13` | utilities/utilities.css | Chữ |
| `ums-u-hide` | `ums-u-hide` | utilities/utilities.css | Hiển thị |
| `ums-u-hide-md` | `ums-u-hide-md` | utilities/utilities.css | Hiển thị |
| `ums-u-hide-sm` | `ums-u-hide-sm` | utilities/utilities.css | Hiển thị |
| `ums-u-mb-0` | `ums-u-mb-0` | utilities/utilities.css | Khoảng cách |
| `ums-u-mb-2` | `ums-u-mb-2` | utilities/utilities.css | Khoảng cách |
| `ums-u-mb-4` | `ums-u-mb-4` | utilities/utilities.css | Khoảng cách |
| `ums-u-mb-6` | `ums-u-mb-6` | utilities/utilities.css | Khoảng cách |
| `ums-u-mt-0` | `ums-u-mt-0` | utilities/utilities.css | Khoảng cách |
| `ums-u-mt-2` | `ums-u-mt-2` | utilities/utilities.css | Khoảng cách |
| `ums-u-mt-3` | `ums-u-mt-3` | utilities/utilities.css | Khoảng cách |
| `ums-u-mt-4` | `ums-u-mt-4` | utilities/utilities.css | Khoảng cách |
| `ums-u-mt-5` | `ums-u-mt-5` | utilities/utilities.css | Khoảng cách |
| `ums-u-mt-6` | `ums-u-mt-6` | utilities/utilities.css | Khoảng cách |
| `ums-u-muted` | `ums-u-muted` | components/patterns.css, utilities/utilities.css | Mục đang chọn: MỌI chữ bên trong đều trắng. Các lớp như .ums-cell__title tự đặt màu xanh than nên không thừa kế được màu của mục — phải nói  |
| `ums-u-navy` | `ums-u-navy` | utilities/utilities.css | Chữ |
| `ums-u-nowrap` | `ums-u-nowrap` | utilities/utilities.css | Chữ |
| `ums-u-p-0` | `ums-u-p-0` | utilities/utilities.css | Khoảng cách |
| `ums-u-right` | `ums-u-right` | utilities/utilities.css | Chữ |
| `ums-u-semi` | `ums-u-semi` | utilities/utilities.css | Chữ |
| `ums-u-sr` | `ums-u-sr` | utilities/utilities.css | Chỉ dành cho trình đọc màn hình |
| `ums-u-w100` | `ums-u-w100` | utilities/utilities.css | Hiển thị |
| `ums-upload` | `ums-upload` `ums-upload__del` `ums-upload__file` `ums-upload__files` `ums-upload__input` `ums-upload__name` `ums-upload__pick` `ums-upload__state` | components/report.css | ---------- Ô tải tệp ------------------------------------------------- |
| `ums-usermenu` | `ums-usermenu` `ums-usermenu__item` `ums-usermenu__item--out` `ums-usermenu__sep` | objects/shell.css | ---------- Menu người dùng (vỏ cũ: .box-acc-user) ----------------------- |
| `ums-veil` | `ums-veil` | objects/shell.css | ---------- Màn che khi thu hẹp -------------------------------------------- |
| `ums-xnct` | `ums-xnct__canh` `ums-xnct__sec` `ums-xnct__sechead` `ums-xnct__sub` | components/patterns.css | ---------- Hỏi lại kèm chi tiết (ums.pat.xacNhanChiTiet) --------------- |
