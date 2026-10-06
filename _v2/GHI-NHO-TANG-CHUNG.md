# Ghi nhớ tầng chung `_v2` — bản đầy đủ (chuyển nguyên văn từ CLAUDE.md mục 10 "Điểm cần nhớ" ngày 2026-10-05)

CLAUDE.md mục 10 chỉ còn bản tóm tắt; chi tiết từng khối (menu, select2, phân trang, Cổng Help, SSO, bảng lỗi backend, khung Cần làm trước…) ở đây.

### Điểm cần nhớ

- `api.dataSource = 'auto'` — có `AXYZCLRVN()` thì gọi API thật, không thì dùng
  dữ liệu dựng thử. Không phải sửa mã khi chuyển qua lại.
- **Màn hình mới đặt đúng cây thư mục gốc** bên trong `_v2/`: vỏ nạp
  `_v2/<MAUNGDUNG><DUONGDANFILE>`, vd
  `_v2/ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html` +
  `scripts/hethonghoadon.js`. Có tệp là tự bật, không khai báo ở đâu. Chưa có
  tệp thì hiện "chưa chuyển đổi" kèm đường dẫn cần đặt — **không nạp màn hình cũ**.
- `api.demoScreens` (màn mẫu dữ liệu cứng trong `screens/`) chỉ dùng ở chế độ
  dựng thử; chạy API thật thì bỏ qua.
- Màn danh sách + biểu mẫu viết bằng `assets/js/crud.js` (`ums.crud({...})`):
  chỉ khai action/func, cột, trường. Tên tham số/cột chép nguyên từ .js gốc.
- `api.js` gửi **form-urlencoded** như `$.ajax` cũ (không phải JSON), và chỉ
  mã hoá `{A: AE(...)}` khi lời gọi có `func` — action kiểu cũ
  (`TC_HoaDon/LayDanhSach`) đi thẳng, đúng như bản gốc.
- `index.html` tự chuyển sang `index.aspx` khi không chạy trên localhost (IIS
  xếp index.html trước index.aspx nên mở `…/_v2/` từng rơi vào dữ liệu mẫu).
  Ép xem dữ liệu mẫu: `index.html?demo`.
- `TENANH` kiểu Font Awesome 4 (`fa fa-x`) được đổi sang `fa-light fa-x` khi
  vẽ menu, để hiện đúng với FA Pro 7.
- **Thứ tự menu: hệ cũ KHÔNG sắp xếp gì cả.** `genHTML_MenuVertical`
  ([Core/systemroot.js:6391](Core/systemroot.js#L6391)) duyệt mảng theo chỉ
  số, mục con lấy bằng `data.filter` — tức thứ tự hiển thị chính là thứ tự
  `PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung` trả ra (ORDER BY trong
  procedure, theo `THUTUHIENTHI`). Sắp lại theo tên là sai trật tự nghiệp vụ.
  Ba luật ẩn hiện của hệ cũ, đều có thật:
  1. `index.aspx` chỉ vẽ **2 tầng**; mục tầng 3 mất hẳn. `indexi.aspx`
     (`genHTML_MenuVertical_Recusive`, Corei:6622) lại vẽ đệ quy nhiều tầng —
     cùng một vai trò, hai vỏ hiện menu khác nhau. Bản mới vẽ ĐỦ MỌI TẦNG
     (theo bản `indexi`), nhóm lồng dùng lớp `ums-nav__group--sub`.
  2. Mục **mồ côi** (cha không nằm trong danh sách được cấp quyền) bị bỏ hẳn
     → người dùng mất chức năng dù đã được cấp. Bản mới gom vào nhóm "Khác"
     (`behavior.menuOrphans`, đặt `'hide'` để giống hệt hệ cũ).
  3. Mục `DUONGDANHIENTHI = "#dashboard"` bị `display:none`.
- **select2 bắn `change` bằng jQuery, không phải sự kiện DOM thật** — đo được:
  `addEventListener('change')` nhận 0, `jQuery(…).on('change')` nhận 1. Đó là
  nguyên nhân "đổi ô chọn mà màn hình đứng im". Từ 2026-09-21 `ums.ui.select2`
  bắn thêm một `change` THẬT (đặt `jQuery.event.triggered` quanh lúc bắn nên
  trình xử lý jQuery không chạy hai lần) — cả hai kiểu gắn đều chạy đúng một lần.
- **Số dòng mỗi trang có ở MỌI thanh phân trang** (mặc định 10/15/25/50/Tất cả,
  `ums.ui.PAGE_SIZES`). Màn chỉ cần truyền `page.onSize(v)`; tự ẩn khi tổng số
  dòng ≤ mục nhỏ nhất (màn ít bản ghi) hoặc khi đặt `sizes: false`.
- **Thông báo nổi hiện lâu hơn** (người dùng 2026-09-30): nền 6 giây (thành công / thông tin), 9 giây (lưu ý), 12 giây (lỗi), cộng 60 ms mỗi ký tự vượt 60,
  trần 20 giây; rê chuột vào thì không tự đóng. Mức nền ở `site.config.js` → `behavior.toastMs`; màn truyền `timeout` riêng thì theo màn.
- **Ô chọn tệp**: `ums.ui.file({ key, accept })`, không để `<input type="file">` trần
  (trình duyệt vẽ "Choose file / No file chosen", CSS không đổi được chữ).
- **Trang chỉ có MỘT tab thì không vẽ dải tab** (người dùng yêu cầu 2026-09-22). Nhiều màn gốc từng
  thiết kế nhiều tab rồi GOM về một trang nhưng html/js vẫn giữ khung `nav-tabs` (một `<li>`, hoặc tab
  động trỏ tới `#tab_2…` không có trên màn — vd `hoso/qtthongtin`) → khi chuyển thì **BỎ HẲN khung tab
  trong mã**, không chỉ ẩn. Đã bỏ ở `qtthongtin`; đã rà 18 màn gốc cùng kiểu, bản mới đều không vẽ tab.
  Lưới an toàn: luật CSS `components/tabs.css` ẩn mọi `.ums-tabs` có dưới 2 tab đang hiện.
- **Xoá NHIỀU dòng = `ums.ui.xoaChon(bộChọnÔĐánhDấu, { attr })`** (người dùng chốt 2026-09-22): nút "Xoá đã
  chọn" tự đếm, khoá khi chưa chọn, dòng đang chọn tô sáng. Trong hộp thoại: nút xoá ở CHÂN hộp —
  `ui.dialog({ xoa: { chon, onClick } })`. Tiêu đề hộp thoại cùng màu biểu tượng (xanh). Xem BO-CUC bảng tra nhanh.
- **Đóng khung chi tiết bằng nút "Đóng"** trong `.ums-panel__tools`, không dùng
  mũi tên ← (đã gỡ hết 13 chỗ ngày 2026-09-21). 2026-09-25 người dùng bắt được mũi tên còn sót do
  TẦNG CHUNG sinh: `ums.crud` có `back()` tự vẽ ← ở đầu khung (khoanthu → "Kế hoạch xuất hoá đơn",
  `_chung_khac.js`) → nay `crud.js` vẽ `ui.btn('close')` cuối vùng nút; `_chung_a.js` khai nhanh "Quay lại ←"
  → "Đóng". `kiem-dong-bo.html` nay báo "!!" nếu màn còn `.fa-arrow-left`.
  **Nút "Đóng" luôn NGOÀI CÙNG BÊN TRÁI nhóm nút** (đầu trang / đầu khung / chân khung) — người dùng nhắc
  2026-09-25 (đã là quy ước: biểu mẫu crud và hộp thoại đều dựng Đóng trước). Đã sửa ~25 chỗ đặt Đóng ở cuối
  (crud `back`, luận văn `L.nut` chèn trước Đóng, hoá đơn, phiếu thu, khảo sát, tin tức, CMS/DKH mới…).
  Riêng chân hộp thoại: nút Xoá dạt trái (quyết định 2026-09-22). `kiem-dong-bo` báo "nút Đóng không ngoài cùng bên trái".
- **Màu nút chép đúng bản gốc**: `primary` / `save` (btn-success) / `warn`
  (btn-warning) / `danger`; đổi biểu tượng bằng `ums.ui.btn(kind, { icon })`.
- **Số dòng mỗi trang**: truyền `page.sizes` + `page.onSize` cho `ums.ui.pager` —
  chữ "Hiển thị" + ô chọn ở đầu thanh phân trang, đúng chỗ bản gốc đặt nó
  (`beginLoadPag`, Core:1739). Ô mang `data-no-s2` nên không bị select2 bọc;
  kiểu "giống hệt select2" ở `components/field.css` nay áp cho mọi ô `data-no-s2`.
- **Chữ trên nút giữ đúng bản gốc**: màn đang chuyển là màn của vỏ `indexi`
  nên nút mẫu báo cáo là "Xuất báo cáo" (Corei:6945), không phải "Báo cáo"
  của vỏ `index`. Nút bản gốc có mà không có xử lý thì giữ nút, đặt `disabled`.
- **JS dùng chung trong `index.aspx` mang `?v=<%= V("…") %>`** (số = lần sửa
  cuối của tệp, hàm `V` ở khối `<script runat="server">` đầu tệp). Trước
  2026-09-21 không có số này → đẩy `ref.js`/`patterns.js` mới lên host mà
  trình duyệt vẫn chạy bản cũ ("sửa rồi mà vẫn vậy"). Thêm tệp JS chung mới
  vào vỏ thì nhớ kèm `?v=`. JS của từng màn tự có `?v=` (app.js `inject`).
- **Sửa CSS xong phải chạy `python _harness\gop-css.py`.** Hai vỏ `.aspx` nạp
  bản GỘP (`assets/css/main.bundle.css`, `login-page.bundle.css`); `index.html`
  vẫn nạp bản @import nên trên máy sửa là thấy ngay. Không gộp thì host vẫn
  chạy CSS cũ. Lý do phải gộp: tệp chỉ gồm @import bị trình duyệt coi là tải
  xong rồi vẽ trang ngay → vào lần đầu trơ chữ / mất hết biểu tượng, F5 mới
  đúng (đã gặp thật trên host 2026-09-21).
- **Khung "Cần làm trước"** (2026-10-05, người dùng: thiếu dữ liệu nghiệp vụ mà người dùng tự khai được ở màn khác thì KHÔNG đưa xuống backend) —
  `assets/js/lamtruoc.js` (`ums.lamTruoc`) + `components/lamtruoc.css`. Vỏ TỰ PHÁT HIỆN lúc nạp màn: mọi lời gọi trả 0 dòng đi qua `ums.api.call`
  → `lamTruoc.sauGoi(opts)`: (1) danh mục dùng chung (`CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM`, cả qua `api.dm` lấy từ bộ nhớ phiên) →
  "Danh mục <MÃ> chưa có giá trị" + nút "Mở Danh mục dữ liệu" (màn của vai trò đang mở, không có thì bản CMS ở vai trò khác — tìm bằng
  `ums.app.timManTheoDuongDan`, chỉ mục ô tìm màn nay `v: 3` có `p` = đường dẫn); màn đích tự chọn sẵn danh mục (DKH / Tài chính
  `moSanDanhMuc`, CMS `_dm.js` `D.cay` tìm theo mã); (2) **BẢNG NGUỒN `ums.lamTruoc.NGUON`** (action hoặc tên thủ tục → ô / việc / ĐUÔI đường dẫn
  màn khai) — hiện có hệ thống biên lai / phiếu thu / hoá đơn, mẫu hồ sơ NS; bỏ qua khi lời gọi có `strTuKhoa` và khi đang ở chính màn khai;
  (3) màn tự khai `ums.lamTruoc.can({ o, viec, man, tenMan })` / `neuRong(rows, cfg)`. Khung nằm NGAY DƯỚI khung Ghi chú (`giuViTri`), dấu × ẩn
  khung của màn đó tới hết phiên. Bật cả khi giao người dùng thật; tắt: `behavior.lamTruoc = false`. Dữ liệu mẫu chỉ bật khi URL có `lamtruoc`.
  **Kiểm host gặp "thiếu dữ liệu khai được ở màn khác" → thêm dòng vào `NGUON` (hoặc để danh mục tự bắt), KHÔNG ghi mục `ben` vào `can-quyet.js`.**
  Đã gỡ 16 mục cũ khỏi sổ (danh mục TC / NS / SV một cửa, hệ thống biên lai, mẫu hồ sơ).
- **Bảng "Màn đang có lỗi backend"** (2026-09-30, người dùng: để bộ phận backend nhìn trực quan trước khi hoàn thiện sản phẩm, sau thì tắt). Trang một vai
  trò khi chưa chọn chức năng (`#/r/<vai trò>`) liệt kê các màn CỦA VAI TRÒ ĐÓ có mục `ben: 'oracle'` trong `can-quyet.js` (mục nghiệp vụ `nghiepvu` KHÔNG tính):
  tên màn là liên kết mở thẳng màn, cột lỗi, cột tình trạng (đọc câu trả lời ở khung "Ghi chú chuyển đổi"). Vai trò không có lỗi → vẫn là ô "Chọn một chức năng ở cột
  bên trái". Trang chủ có nút "Xem màn có lỗi backend của mọi vai trò" (bấm mới nạp menu mọi vai trò — dùng chung chỉ mục của ô tìm màn, `tmNap` cache `v: 2` thêm
  trường `q`). Mã: app.js `veTrangVaiTro`, `lbBang`, `lbVeNutTong`; CSS `.ums-lb*` (patterns.css). **Tắt:** Cài đặt → Hành vi → "Hiện danh sách màn có lỗi backend"
  (từng trình duyệt) hoặc `site.config.js` → `behavior.loiBackend = false` (mọi người); `behavior.canQuyet = false` cũng tắt luôn. Phân hệ CHƯA kiểm host khai ở
  `ums.canQuyetChuaKiem` (cuối can-quyet.js) → dòng mang nhãn "chưa kiểm trên host"; kiểm xong phân hệ nào thì gỡ tiền tố của nó khỏi mảng. Thêm / gỡ mục `ben: 'oracle'`
  là bảng tự đổi — không phải sửa gì khác.
- **Ô tìm DUY NHẤT trên thanh trên** (2026-09-26 — ô "Tìm kiếm chức năng" ở cột trái ĐÃ BỎ, thay bằng thanh "Vai trò"
  đang dùng `#roleBar` + nút đổi vai trò, app.js `datVaiTro`). Đang ở một vai trò: gõ là lọc cây menu trái (filterNav) và thả
  xuống màn của vai trò đó TRƯỚC ("(đang dùng)"), cuối có nút "Tìm trong mọi vai trò"; không khớp thì tự tìm mọi vai trò.
  Thả xuống (chốt 2026-09-26): tối đa 3 dòng của vai trò đang dùng (nền xanh, nhãn "đang dùng", dư thì báo "+ n màn nữa — xem
  cây menu trái"), NGAY DƯỚI ~5 dòng của vai trò khác (không bấm thêm; vai trò đang dùng không khớp thì hiện tới 50). Dòng phụ
  CHỈ tên vai trò (bỏ nhóm menu). Gõ trong một vai trò là nạp danh sách mọi vai trò (1 lời gọi / vai trò, nhớ theo phiên).
  Nút Menu + logo bọc `.ums-topbar__left` rộng tối thiểu bằng cột trái → ô tìm bắt đầu thẳng mép cột trái. Màn hẹp vẫn hiện ô.
- **Tìm màn hình trong MỌI vai trò** — ô tìm trên thanh trên (`#gSearchInput`, app.js `timMan`, CSS `objects/shell.css` .ums-gsearch;
  người dùng 2026-09-26). Lần đầu bấm vào ô: nạp `loadRoles` rồi `loadMenu` (LayDSChucNangNguoiDung) cho TỪNG vai trò, 4 lời gọi
  cùng lúc (48 vai trò = 48 lời gọi một lần mỗi phiên), nhớ trong sessionStorage `ums.timMan.<userId>.<mode>`. Chỉ mục có
  DUONGDANFILE. Gõ không dấu; kết quả = tên màn + dòng nhỏ "vai trò · nhóm menu"; Enter/bấm → `#/r/<vai trò>/<chức năng>`.
  Ctrl K hoặc / để vào ô. Màn hẹp (<768px) ẩn ô. Kiểm trên host: số lời gọi / thời gian nạp lần đầu.
- **Khối chung mới 2026-09-26 (dùng thay vì tự dựng):** `ums.pat.cotTrai(m, { tai, tuTaiLoc, tuTim, moSan })` áp luật cột trái lên
  pat.master đã dựng; `pat.dsNhanSu` / `masterNhanSu` (danh sách cán bộ); `pat.boLocNguoiHoc` (thanh lọc người học nhiều tầng);
  `pat.dauDoiTuong` + `pat.datNoCo` (đầu khung người/đối tượng đang chọn: tên, nhãn, viên tổng nợ, nút) và `pat.thanhThu` +
  `datDaChon` / `datTongTab` (thanh thao tác tab thu tiền) — 9 màn Tài chính đã dùng; `pat.anhNguoi` (ảnh người tròn);
  `ui.btn('reload')` = nút ↻ nhẹ, luôn cuối nhóm; `ui.money` / `ui.so` theo `site.config.js` → `money` (dấu phẩy, 0 số lẻ).
  Trang kiểm bắt buộc thứ ba: `_harness/kiem-cot-trai.html`; trình chạy chuẩn `_harness/chay-cdp.js`.
- **Xuất mapping cho Cổng Help** (2026-09-26): màn Cài đặt (`screens/cai-dat.html`) nút "Xuất mapping" → `ums.app.xuatMapping()`
  (app.js) đọc TOÀN BỘ chức năng trong CSDL (LayDanhSachUngDung → LayDanhSachChucNang từng ứng dụng, như màn CMS chucnang —
  không theo vai trò; người dùng: "phải lấy đủ trong csdl vì sẽ phải chuyển hết"), kiểm tệp `_v2` từng màn → tải
  `mapping-chuc-nang_<ngày>_<giờ>.json` (schema `ums-help-mapping/1`: applications, modules, menuGroups, functions[functionId,
  code, file, subsystem, module, menuPath, legacyShell, helpUrl, converted, icon (ĐÃ chuẩn hoá FA7 như menu _v2, không bao
  giờ "fa …"), iconRaw, dataIssues[code-trung / thieu-route / duong-dan-file-khong-hop-le / icon-mac-dinh / icon-khong-hop-le]]).
  Chạy trên host: `node _harness/kiem-host/xuat-mapping.js` → `_harness/gui-help/`.
- **Nút "?" Cổng Help — MỌI màn** (2026-09-26, bên Help chọn cách A = một mẫu link): `site.config.js` → `help.url` (mẫu có
  `{functionId}` `{code}` `{app}` `{subsystem}` `{module}` `{screen}` `{version}` `{lang}`), `help.app` / `version` / `lang` / `target`.
  app.js `helpLink(cn)`: có `url` → ghép mẫu (ưu tiên); không → link riêng DUONGDANHUONGDANSUDUNG; không có gì → "?" dạng nút
  `data-help-cho`, bấm báo "đang xây dựng". **Khi Help gửi URL: chỉ điền `help.url` (+ `version`) rồi dựng gói — không sửa mã.** Functions ID = ID CSDL, CHUNG cho vỏ cũ và `_v2`
  → một tệp phục vụ cả màn chưa chuyển. Chế độ dựng thử lấy menu mẫu (source "demo"). Nhánh CSDL CHƯA chạy thử trên host.
  Yêu cầu Cổng Help: `_v2/docs/Yeu_cau_Cong_Help_*.docx` (Function ID + Help Version là hai khoá tích hợp).
- **SSO sang Cổng Help để SOẠN bài** (2026-09-27, yêu cầu `yeu-cau-sso-cho-doi-app.md` — KHÁC việc nút "?"): `_v2/help-sso.aspx`
  (kế thừa `Apis.LoginVT.Index` → `user_id` / `fullname` / `tokenjwt` / `app_id`; người đăng nhập = `HttpContext.User` kiểu `CustomPrincipal`,
  có `Username`) phát JWT RS256 90 giây tự dựng rồi tự POST sang Help; `_v2/help-jwks.aspx` = khoá công khai (trang công khai, đăng ký với
  Help). Cấu hình + khoá RSA ở `App_Data/help-sso/` của ứng dụng cha (tự tạo lần đầu; `iss` = mã trường `ums-qtdh`, `helpUrl` =
  `https://con98.api-apis.com/help-master` — Help dùng chung nhiều trường, phân biệt bằng `iss`). Mục menu người dùng "Soạn bài hướng dẫn":
  `site.config.js` `help.sso`, `chrome.js` + `app.js soanBaiChoPhep`. **ĐÃ CHẠY ĐÚNG trên host ở chế độ `?xem=1`** (48 mã `MAVAITRO`, email,
  tên); CHƯA gửi thật sang Help (Help chưa triển khai). Kiểm: `node _harness/kiem-host/sso-xem.js` (chỉ đọc). Bảng mã vai trò gửi Help:
  `_harness/gui-help/bang-ma-vai-tro.md`. Hướng dẫn: `_v2/TRIEN-KHAI.md` mục 9. **Bài học đã trả giá (đừng lặp lại):**
  **Bản sao ở GỐC dự án (2026-09-28):** `help-sso.aspx` + `help-jwks.aspx` y hệt bản `_v2` (dong-goi.py tự chép lại, nguồn sửa là `_v2`);
  địa chỉ khai bên Help nên là bản ở gốc (`<ứng dụng>/help-sso.aspx`) — không phụ thuộc v1 / v2, trường chỉ chạy v1 chép hai tệp là
  dùng được. Người dùng tự chép hai tệp gốc lên host (không nằm trong gói `_v2`).
  · **`bin` nối CSDL KHÁC:** `Apis.Login.BO` / `OraDB` dùng kết nối `OraMainDb` (enum = 4) → schema `CMCDB`, còn microservice (`Config.js`:
    `https://qldt.eaut.edu.vn/…api`) chạy CSDL khác — cùng ID người dùng mà tên / email / vai trò lệch (CMCDB 34 vai trò, API 48). Dữ liệu
    nghiệp vụ phải lấy qua API. Trang gọi API phía máy chủ: Bearer `tokenjwt`, body `A=AE(json, phần sau "/" của action)`, `Data.B` giải
    bằng `AD(…, "AzzSystem")`; **`AE`/`AD` chỉ là XOR từng ký tự với khoá rồi base64** (crypto-js.js:6192). API TỪ CHỐI payload không mã
    hoá (500 "Value cannot be null"). Base URL: host KHÔNG khai appSettings `CMS`… mà chỉ có trong `Config.js` → trang tự đọc `~/Config.js`.
  · Không có API lấy người dùng theo ID: tìm `LayDanhSachNguoiDung` theo tài khoản (chuỗi con) rồi khớp ID, lật tới 10 × 500 dòng. Bản ghi
    phía API không có email → lấy email tài khoản ở CSDL đăng nhập (`UserBo.GetDetail`, hàm STATIC), tắt bằng `emailFromLoginDb`.
  · **Bẫy ASPX:** không viết nguyên thẻ đóng script trong khối `runat="server"`, kể cả trong chuỗi hay CHÚ THÍCH → khối C# bị cắt, host
    chỉ hiện "Runtime Error" (customErrors RemoteOnly) và `Page_Error` không bắt được. Tách `"</scr" + "ipt>"`; kiểm `grep -c "</script"` = 2.
  · Hàm BO trong `bin` là static; OUT kiểu chuỗi của Oracle phải khai size; máy này không biên dịch thử được C# (csc bị chặn) → soi DLL
    bằng phản chiếu PowerShell (tên hàm, chuỗi trong IL) trước khi viết.
  · `bin/Apis.Login.BO.dll` có khoá RSA riêng viết cứng trong `loadRsaPrivateKeyPem` (không dùng, nên báo đội backend).
- Thanh trượt cột trái do JS tự vẽ (`assets/js/scroll.js`), đè lên nội dung
  nên không chiếm chiều ngang.
- **Dính đỉnh:** ở đâu có nút thao tác thì ở đó dính khi cuộn — `.ums-page__head`
  (cạnh tiêu đề) hoặc `.ums-panel__head` (trong biểu mẫu), nhưng không bao giờ
  cả hai cùng lúc. Điều kiện viết bằng `:has()` nên tự đổi khi nút ẩn/hiện, xem
  `objects/shell.css`.
- **Đổi vùng có hiệu ứng:** `ums.ui.swap(vùngCũ, vùngMới)` cho vùng mới trượt
  lên 14px trong 240ms (`generic/motion.css`). Dùng `animation-fill-mode:
  backwards` để chạy xong không đọng `transform` — đọng lại là phá `sticky` của
  đầu khung nằm bên trong. Tôn trọng `prefers-reduced-motion`.


- **Đầu khung nhiều nút (6/10, người dùng: "hệ thống action lớn phải xuống dòng, title không được co cụm")** — `components/panel.css`: `.ums-panel__head` `flex-wrap: wrap`, tiêu đề `flex: 0 0 auto; white-space: nowrap`, `.ums-panel__tools` `flex: 1 1 auto; flex-wrap: wrap; justify-content: flex-end`. Dãy nút dài hơn chỗ còn lại thì cả dãy xuống dòng dưới tiêu đề, nút trong dãy tự xuống dòng tiếp; khung ít nút không đổi (đo: lophocphan đầu khung 139px, tiêu đề 1 dòng; vanban / congthuctinh giữ 63px).

- **Hộp tiến độ `ui.batch` chỉ hiện khi việc kéo dài > 300 ms** (6/10, người dùng: "bấm Lưu hiện modal nhưng tắt ngay lập tức" ở phạm vi chấm thi với dữ liệu mẫu). Lô xong trước 300 ms thì không bật hộp, chỉ còn thông báo nổi; lô dài vẫn có thanh tiến độ như trước.
