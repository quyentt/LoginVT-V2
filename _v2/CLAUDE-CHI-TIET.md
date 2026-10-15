# CLAUDE — chi tiết (chuyển ra từ CLAUDE.md ngày 11/10)

Nguyên văn các mục dài, chỉ đọc khi tới việc liên quan.


---

## Tiến độ chuyển đổi + việc đã xong

### Tiến độ chuyển đổi (chi tiết từng phân hệ: [_v2/NHAT-KY-CHUYEN.md](_v2/NHAT-KY-CHUYEN.md); trang `_harness/tien-do.html`)

**"Đã chuyển" KHÔNG có nghĩa "chạy được trên host"** (việc H đánh giá 14/10, ghi 15/10): đã chuyển = có tệp cùng đường dẫn trong `_v2` (810/837 màn); chạy được = đã mở thật trên host bằng `_harness/kiem-host` (401 màn = 50% màn đã chuyển, sổ `da-kiem.json`), và trong đó còn màn mang lỗi mã treo / việc backend (`ben`). Số đúng từng phân hệ: cột "Đã đọc sâu / Đã CRUD / Chưa kiểm / Tình trạng" ở `_harness/tien-do.html` (`python _harness	ien-do.py`); 49 việc backend treo ở `can-quyet.js`.

| Phân hệ | Màn | Vai trò mẫu | Xong | Kiểm host |
|---|---|---|---|---|
| Tài chính `ApisTaiChinh` | 72/73 | R33 `TC-` | 19/9 | đọc sâu + thử ghi xong |
| Cổng cán bộ `ApisCongCanBo` | 152/152 | R02 `CCB-` | 22/9 | 6/10: **87/152 màn có trên menu host** đọc sâu sạch (6 lỗi backend đã có sổ), thử ghi 17 màn sạch; **65 màn KHÔNG có trên menu host, chưa kiểm được** (sổ `khong-tren-menu`: klgd 28, dashboardv2 9, thi 7, coithi 3…) |
| Cổng sinh viên `ApisCongSinhVien` | 36/36 | R04 `CSV-` (thủ vai) | 23/9 | **6/10 hoàn thiện:** 22/22 màn trên menu host đọc sâu sạch, thử ghi `dongphuc` sạch, 21 màn không thử có lý do trong sổ; 15 màn ngoài menu = host chưa khai chức năng |
| Chuyên cần `ApisChuyenCan` | 5/5 | R07 `CC-` | 25/9 | **6/10 xong 3/3 màn trên menu host**: đọc sâu sạch, thử ghi `nhaptheolop` sạch, `khongdiemdanh` thêm/xoá sạch sau sửa mã (đã up, kiểm lại đạt), sửa + `tonghoptheongay` lỗi backend (ben); 2 màn host chưa khai chức năng |
| Quản trị hệ thống `ApisCMS` | 46 | R44 `CMS-` | 25/9 | đọc sâu, thử ghi dở |
| Đăng ký học `ApisDangKyHoc` | 24 | R19 `DKH-` | 25/9 | đọc sâu |
| Học lại thi lại `ApisHocLaiThiLai` | 6/6 | R09 `HLTL-` | 25/9 | đọc sâu |
| Điểm rèn luyện `ApisRenLuyen` | 8/8 | R18 `RL-` | 25/9 | xong |
| Xử lý học vụ `ApisXuLyHocVu` | 8/8 | R17 `XLHV-` | 25/9 | xong |
| Xét học bổng `ApisHocBong` | 12/12 | R35 `HB-` | 25/9 | đọc sâu (host thiếu API `HB`) |
| Quản lý điểm `ApisQuanLyDiem` | 42/42 | R13 `QLD-` | 25/9 | đọc sâu, thử ghi dở |
| Nhân sự `ApisNhanSu` | 121/121 | R36 `NS-` | 26/9 | xong |
| Sinh viên `ApisSinhVien` | 35/35 | R38 `SV-` | 26/9 | **12/10 (host mới): 27/27 màn trên menu đọc sâu 0 lỗi JS; thử ghi Vé xe tháng / Xe buýt / Gói hỗ trợ sạch; 4 màn (chế độ chính sách, quyết định, giấy tờ, yêu cầu) thiếu `required` → đã sửa, up, kiểm lại ĐẠT (Quyết định cần đủ 5 ô) — **ĐÃ HOÀN THIỆN**; 3 màn Nhập chế độ chính sách lỗi backend ORA-24338 (`ben`); 8 màn ngoài menu = host chưa khai |
| Kế hoạch chương trình `ApisKeHoachChuongTrinh` | 28/28 | R21 `KHCT-` | 27/9 | chưa |
| Nhập học `ApisNhapHoc` | 31/31 | R24 `NH-` | 27/9 | chưa |
| Tuyển sinh `ApisQuanlyTuyenSinh` | 15/15 | R31 `TS-` | 27/9 | chưa |
| Nghiên cứu khoa học `ApisNCKH` | 55/55 | R23 `NCKH-` | 27/9 | chưa |
| Thi phách `ApisThiPhach` | 18/18 | R14 `TP-` | 29/9 | chưa |
| Tốt nghiệp `ApisTotNghiep` | 13/13 | R16 `TN-` | 5/10 | chưa (đã up) |
| Quản lý thi trắc nghiệm `ApisQuanLyThiTracNghiem` | 16/16 | R12 `QLTTN-` | 5/10 | chưa (gói bổ sung chưa up) |
| Thi trắc nghiệm `ApisThiTracNghiem` (trang làm bài .aspx) | 0 | — | DỪNG (5/10, xác nhận lại 6/10 sau khảo sát: trang ASPX độc lập 3.202 dòng, cổng thí sinh `eIndex.aspx` + `eassets/` không có trong kho, 2 trang thiếu HTML, kiểm host = làm bài thật) | — |
| Tin tức `ApisTinTuc` | 4/4 | R46 `TT-` | 5/10 | chưa |
| Thống kê giờ giảng `ApisTKGG` | 12/12 màn host dùng (11 màn kho hoãn — host chưa khai chức năng) | R39 `TKGG-` | 6/10 | chưa |
| Luận văn, luận án `ApisLuanVanLuanAn` | 17/17 (khung `_lv_chung.js` / `_lv_baove.js`, luanan nạp chéo luanvan) | R22 `LVLA-` | 12/10 | chưa |
| Ký túc xá `ApisKyTucXa` | 26/31 (còn 5: quanlythietbi, kehoachdangky, phanphongdangky, xepphongdangky, xacnhandangkyphong — người dùng 12/10 bảo dừng) | R32 `KTX-` | 12/10 (dở) | chưa |
| Danh hiệu `ApisDanhHieu` | 3/3 (kehoach / thuchienxet dùng khung Học bổng `ums.hbKh` + bộ lời gọi riêng `_dh_chung.js`; danhmucdulieu nạp chéo ĐKH) | R49 `DH-` | 12/10 | chưa (host 26/9 chưa khai chức năng phân hệ này) |
| Còn lại: — (Thi trắc nghiệm trang làm bài DỪNG) | — | — | — | — |

**HEMIS (đồng bộ dữ liệu lên Bộ GD&ĐT, tài liệu người dùng đưa 7/10):** ghi chú đầy đủ ở [HEMIS.md](HEMIS.md) — quy trình 4 bước
(token → 175 danh mục → ký số XML `db16` → JSON `db1…db13`), trường có / thiếu dữ liệu nhóm nào, lệch kỹ thuật (GUID có gạch, ngày
`yyyy-MM-dd`, địa giới mới, CCCD bắt buộc), thứ tự việc. **Chưa làm gì**, chủ yếu là việc backend; `_v2` chỉ làm màn ánh xạ / đồng bộ / nhật ký sau.

**Đã xong 6/10:** TKGG 12/12 (chỉ màn host đang dùng — người dùng 6/10; 11 màn kho không có chức năng → trạng thái "hoãn" mới trên tien-do, `HOAN` trong tien-do.py);
bẫy jQuery `trigger('change.select2')` không gọi handler `on('change')` trơn → ô phụ thuộc phải nghe `'change change.select2'`; `thu-crud` điền hai lượt.
**Đã xong 5/10 tối:** Tin tức 4/4 (`tintuc` 3.017 dòng gốc → ums.crud + hai khung formTrang Phạm vi / Gửi email + hộp Quản lý chuyên mục & Import Excel;
`guithongbaoappsinhvien`; `vanban`; `danhmucdulieu` nạp chéo ĐKH); ba trang kiểm 4/4; chốt ở `CAN-QUYET-DA-CHOT.md` mục "Tin tức"; kéo gốc lần 7 (mốc `1680e53d`).
Hai tác tử con bị cắt vì hết hạn mức giữa chừng — phần dở tự làm nốt; `kiem-icon-chuan.py` chạy với `PYTHONIOENCODING=utf-8` (cp1252 lỗi).
**Đã xong 5/10:** QLTTN 16/16 (ba màn cuối `quanlybode`, `taodethucong`, `quanlythi` tự làm, không tác tử); chốt ở `CAN-QUYET-DA-CHOT.md`; ApisThiTracNghiem DỪNG.
Việc kế: người dùng up gói bổ sung → `--da-up`; phân hệ mới chỉ làm khi người dùng gọi tên.
Tầng chung mới 5/10: `ums.editor` (`assets/js/editor.js`). **Giao việc: tối đa 2 tác tử con một lúc (người dùng 5/10); mỗi tác tử chỉ đọc đúng mục cần (không "đọc hết"
CLAUDE.md / BO-CUC), grep hàm trong tệp gốc lớn thay vì đọc nguyên tệp, lưu tệp sớm.**


---

## Điểm cần nhớ của _v2

### Điểm cần nhớ (tóm tắt — bản đầy đủ: [_v2/GHI-NHO-TANG-CHUNG.md](_v2/GHI-NHO-TANG-CHUNG.md))

- `api.dataSource = 'auto'`: có `AXYZCLRVN()` (vỏ ASPX) → API thật, không → `demo-data.js`. `index.html?demo` ép dữ liệu mẫu; `index.html` tự sang `index.aspx` ngoài localhost.
- **Màn mới đặt đúng cây thư mục gốc trong `_v2/`** (`_v2/<MAUNGDUNG><DUONGDANFILE>`); có tệp là tự bật, chưa có thì hiện "chưa chuyển đổi" — không nạp màn cũ.
- `api.js` gửi form-urlencoded; chỉ mã hoá `{A: AE(...)}` khi có `func`; action kiểu cũ đi thẳng. Màn danh sách + biểu mẫu = `ums.crud`; tên tham số / cột chép nguyên gốc.
- **Menu: không sắp xếp** (thứ tự = procedure trả); vẽ ĐỦ mọi tầng (theo indexi); mục mồ côi gom nhóm "Khác" (`behavior.menuOrphans`); `#dashboard` ẩn; `TENANH` FA4 → `ums.iconFA4`.
- **select2 bắn `change` bằng jQuery** → `ums.ui.select2` bắn thêm một `change` thật; màn nghe kiểu nào cũng chạy đúng một lần.
- Phân trang: `ums.ui.pager` có số dòng / trang (`page.sizes`, `page.onSize`, ô `data-no-s2`). Thông báo nổi 6 / 9 / 12 giây + 60 ms mỗi ký tự dư (`behavior.toastMs`).
- Ô chọn tệp dùng `ums.ui.file`. Một tab thì KHÔNG vẽ dải tab (bỏ hẳn khung tab trong mã). Xoá nhiều dòng = `ums.ui.xoaChon`; trong hộp thoại nút Xoá ở chân, dạt trái.
- **Nút "Đóng" luôn ngoài cùng BÊN TRÁI nhóm nút**, không mũi tên ←; `kiem-dong-bo` báo nếu sai. Màu nút chép gốc; chữ nút giữ gốc (vỏ indexi: "Xuất báo cáo"); nút gốc không có xử lý thì giữ + `disabled`.
- JS chung trong `index.aspx` phải kèm `?v=<%= V("…") %>`; **sửa CSS xong chạy `python _harness\gop-css.py`** (vỏ `.aspx` nạp bản gộp).
- **Khung "Cần làm trước"** (`assets/js/lamtruoc.js`, `ums.lamTruoc`, 2026-10-05): mọi lời gọi trả 0 dòng qua `ums.api.call` → `sauGoi`: danh mục dùng chung trống →
  "Danh mục X chưa có giá trị" + nút mở Danh mục dữ liệu (vai trò đang mở → bản CMS → phân hệ khác; `ums.app.timManTheoDuongDan`, kiểm tệp có trong `_v2`;
  màn đích tự chọn sẵn danh mục); **bảng nguồn `ums.lamTruoc.NGUON`** (action / tên thủ tục → ô, việc, đuôi đường dẫn màn khai); màn tự khai `lamTruoc.can()` / `neuRong()`.
  Nằm ngay dưới khung Ghi chú, dấu × ẩn tới hết phiên, giữ khi giao người dùng thật (tắt: `behavior.lamTruoc = false`); dữ liệu mẫu chỉ bật khi URL có `lamtruoc`.
- **Khung "Ghi chú chuyển đổi"** (`can-quyet.js`, `behavior.canQuyet`): CHỈ giữ việc dữ liệu / backend (`ben: 'oracle'` = "Lỗi đã kiểm trên hệ thống thật — yêu cầu backend",
  `nghiepvu`); câu cần quyết cách màn chạy thì TỰ CHỐT vào `CAN-QUYET-DA-CHOT.md`. **Bảng "Màn đang có lỗi backend"** ở trang vai trò + nút tổng ở trang chủ
  (`behavior.loiBackend`); phân hệ chưa kiểm host khai ở `ums.canQuyetChuaKiem` — kiểm xong thì gỡ tiền tố.
- Ô tìm duy nhất trên thanh trên (`timMan`: lọc menu vai trò đang dùng, rồi mọi vai trò; chỉ mục sessionStorage `ums.timMan.*` v4 có đường dẫn `p`); Ctrl K hoặc `/`.
- Khối chung hay dùng: `pat.cotTrai`, `pat.dsNhanSu` / `masterNhanSu`, `pat.boLocNguoiHoc`, `pat.dauDoiTuong`, `pat.anhNguoi`, `pat.formTrang`, `pat.chain`, `pat.haiLuoi`,
  `ui.btn('reload')`, `ui.money`, `ums.editor` (`tao` / `toan` / `html` — CKEditor + MathJax nạp từ `../Scripts/` của ứng dụng cha, không có thì lùi về textarea). Bảng tra nhanh: `_v2/BO-CUC.md`.
- **Cổng Help:** nút "?" mọi màn theo `site.config.js → help.url` (mẫu `{functionId}`…), xuất mapping ở màn Cài đặt (`ums.app.xuatMapping`) hoặc gõ `<ứng dụng>/mapping.aspx` (bản sao ở gốc, trường chỉ chạy v1 cũng tải được; `?xem=1` xem ngay); SSO soạn bài `_v2/help-sso.aspx` +
  `help-jwks.aspx` (bản sao ở gốc dự án; `App_Data/help-sso/`; đã chạy `?xem=1` trên host, chưa gửi thật). Bẫy ASPX: không viết nguyên thẻ đóng script trong khối `runat="server"`.
- Dính đỉnh bằng `:has()` (`objects/shell.css`); đổi vùng có hiệu ứng `ums.ui.swap` (`animation-fill-mode: backwards` để không phá sticky); thanh trượt cột trái tự vẽ (`scroll.js`).


---

## Kiểm host (quy trình đầy đủ)

**Kiểm host** (`_harness/kiem-host/`, Edge có cửa sổ qua DevTools cổng 9333, tài khoản `tk.md`, kết quả ở `%TEMP%/ums-kiem-host`):
- **Host từ 12/10/2026: `https://qldt.eaut.edu.vn/qtdh/_v2/index.aspx`** (gốc ứng dụng `/qtdh/`; host thử cũ `con98.api-apis.com/qtdhgit` không dùng nữa). Địa chỉ chỉ khai ở dòng 1 `tk.md`,
  mọi script đọc từ đó. Sổ `da-kiem.json`, mốc up `.moc-da-up.json` là của host cũ → lần đầu kiểm host mới chạy `dong-goi.py --moc-tu-host` để biết host đang ở bản nào.
`node dangnhap.js` → `menu.js <roleId>` → `SAU=1 CHI="id1,id2" node chay-vaitro.js <roleId>` (đọc sâu; `THUVAI="Đặng Bác Ái"` cho Cổng SV)
→ `thu-ghi.js` / `thu-ghi-ui.js` (`TIM="Kadara" FULL=1`) → lái tay `node chay.js <role> <cnId|-> '<thân hàm>'` (nháy ĐƠN; có `nut() os() s2() go() bang() bao()`)
→ `va-tam.js` chạy mã vừa sửa trên host trước khi up → `tom-tat.js <6 ký tự>`. Mẫu lệnh lái tay: `kiem-host/mau-lenh/`.
- **Sổ:** đã kiểm `da-kiem.json` (ghi: `TU=<ngày> node ghi-da-kiem.js <ApisXxx> <roleId…>`, mục tay đặt `"tay": true`); **màn đã chuyển mà không kiểm PHẢI có lý do** (người dùng 6/10) →
  `python _harness/kiem-host/xep-loai-chua-kiem.py --ghi` (đối chiếu bản xuất mapping host: chưa khai chức năng / có chức năng chưa gán vai trò), trang tiến độ hiện dropdown "Chưa kiểm (lý do)", màn thiếu lý do hiện "CHƯA XẾP LOẠI"; lỗi mã `loi-code.js them|da-sua|xong|ds`
  (khoá = đường dẫn màn TRÊN MENU HOST); việc phiên sau `VIEC-PHIEN-SAU.md`; nhật ký từng ngày `LICH-SU.md`; lỗi backend → mục `ben` trong `_v2/assets/js/can-quyet.js`.
- **Khi người dùng bảo "kiểm host" / "chuyển": `git fetch origin` + THÔNG BÁO TRƯỚC** rồi mới chạy: (1) lỗi mã treo (`loi-code.js ds`); (2) gói bổ sung đã up chưa
  (`_v2_bo_xung_deploy` còn tệp khác `_KHONG-CON-GI-DE-UP.txt` = chưa up); (3) phân hệ đã / dở / chưa kiểm (`da-kiem.json`); (4) bản ghi thử còn sót;
  (5) lượt này làm gì, thứ tự; (6) tệp gốc mới kéo về còn "chưa xem" trong `CHO-CHUYEN-SAU-PULL.md` — CHỈ mở diff của tệp thuộc phân hệ đang kiểm lượt này,
  chuyển sang `_v2` trước khi thử màn đó (mục 11, luật kéo gốc); tệp phân hệ khác chỉ nêu số lượng. Phân hệ MỚI chỉ kiểm khi người dùng gọi tên.
- **Cách làm: CUỐN CHIẾU từng phân hệ, MỘT màn = MỘT lượt** (người dùng 12/10: "đọc 1 màn thì phải đọc hết các thao tác có trên màn, có crud thì làm luôn,
  không phải đọc → đọc sâu → crud, rất mất thời gian") — mở màn là đi hết mọi tab / trang / nút trên dòng / Thêm mới, có thêm-sửa-xoá thì thử ghi ngay
  (thêm thì xoá, đối chứng `LayChiTiet`) → sửa mã / ghi backend → ghi sổ → DỪNG báo cáo. Không chạy riêng lượt mở, lượt `SAU=1`, lượt `thu-ghi.js`.
  Ưu tiên thay đổi (kéo gốc / sửa mã) ở phân hệ ĐÃ hoàn thành trong sổ trước. Sau mỗi lượt thử ghi quét dấu `ZKT` (`chay-vaitro.js` in "!! CÒN DẤU THỬ").
- **Cặp Từ ngày / Đến ngày (người dùng 12/10): màn nào có cặp ngày (Từ–Đến, Ngày đi–Ngày về, Bắt đầu–Kết thúc…) thì kiểm `ums.ui.khoangNgay` có ghép đúng không**
  (chọn Đến < Từ → tự thành Từ). Không tự ghép (nhãn lạ, hai ô không liền nhau) → thêm `data-range="k:tu"` / `"k:den"` ngay trong lượt kiểm, ghi sổ lỗi mã. Luật 22 `BO-CUC.md`.
- **(A) Frontend khắc phục được thì PHẢI sửa `_v2` + ghi sổ lỗi mã, KHÔNG báo backend.** (Sai định dạng, ô trống thành `//`, thiếu kiểm bắt buộc / số, câu lỗi thô,
  thiếu GET, gửi ô ẩn, lưu lần hai thêm trùng…). Chỉ ghi `ben` khi mã không làm gì được: thiếu / sai chữ ký thủ tục, gói lỗi, dịch vụ không chạy, cấu hình host,
  thủ tục làm sai. Trước khi ghi backend: so tham số với màn khác gọi cùng controller (bài học `dTrangThai` ↔ `iTrangThai`).
  **Thiếu dữ liệu người dùng tự khai được ở màn khác (danh mục trống, chưa có bản ghi cha, mẫu import) → KHÔNG phải backend: khung "Cần làm trước" tự bắt**
  (mục 10) — thêm dòng vào `ums.lamTruoc.NGUON` nếu cần.
- **(B) Mục `ben` do người kiểm VIẾT THẲNG**: bấm gì / ở đâu → thấy gì → ảnh hưởng → ai làm gì (chi tiết kỹ thuật trong ngoặc). Không bê câu lỗi thô.
  Mọi màn `doc: loi-may-chu` / `ghi: tu-choi` / `con-sot` trong sổ phải có mục `ben` cùng khoá; từ chối do dữ liệu thử sai ghi `ghi: hop-le`.
- **(C) Thiếu dữ liệu đầu vào mà tạo được trong ứng dụng** thì sang màn đó tạo (dấu ZKT), thử, rồi xoá cả bản ghi thử lẫn dữ liệu phụ (con trước cha). Làm đến đâu sạch đến đó.
- **Quyền thử ghi (người dùng 30/9): thêm / sửa / xoá TẤT CẢ miễn xoá lại được**, kể cả dữ liệu người học thật (kỳ xa `2031_2032_2`, một ô / một dòng, xoá ngay).
  KHÔNG bấm thao tác không hoàn lại: tổng hợp / xếp loại / tính phí hàng loạt, chốt, xuất hoá đơn – biên lai, gạch nợ, gửi thư, nhập từ tệp, thứ máy chủ chặn gỡ.
  Phạm vi thử an toàn đã dùng: hệ "Đào tạo khác" → khoá Tập huấn / Bổ sung kiến thức, khoản "Võ phục", kỳ `2031_2032_2`.
- **Bản ghi thử còn sót (cần CSDL xoá tay):** `quatrinhcongtac/nhiemvuchienluoc` id `71F5751A5EA94D4983F8E45EB1B95456`; `D_CongThucDiem_ApDung` id
  `4084811E199B4D1EB4478890442FCE91` (lớp `TTKT.03.K11.01.LH.C04BS.1_LT`); CCB `khaosat/phieu` nhóm câu hỏi `ZKT0119` id `D3D0DA37A248400BAB4FDC2A8B6D532D`
  trên phiếu `AF61B8BE…` (6/10 — thủ tục xoá nhóm từ chối vì còn liên kết phiếu–nhóm, đã ghi `ben`). Đừng thử ghi ba chỗ đó tới khi sửa.
- **Ngày sinh ba ô** Ngày / Tháng / Năm: kiểm trước khi gửi bằng `ums.util.ngaySinh(ngay, thang, nam, maMuc)` (api.js) — sai thì báo, không gửi `//`.
  Câu ORA-20000…20999 hiện gọn (`cauKiem`, câu gốc ở `err.goc`).
- Bẫy bộ thử: Edge bị che / có DevTools cạnh → trình duyệt bóp đồng hồ (màn "đứng im" > 25 giây, 0 lời gọi → chạy lại bằng `CHI=`); hộp thoại đã `.close()`
  vẫn trong DOM và vùng "Khai nhanh" ẩn cùng `data-k` → gắn id theo đúng vùng đang mở.


---

## Giao diện quản trị CMS + Mức tập trung markup

## 6. Giao diện quản trị (ApisCMS — 18 module, 49 màn hình)

| Nhóm | Màn hình | Làm được gì |
|---|---|---|
| Người dùng | `nguoidung`, `nguoidungvaitro`, `nguoidungchucnang`, `canbochucnang` | Tạo/sửa tài khoản, đặt lại mật khẩu, gán vai trò, gán chức năng riêng ngoài vai trò |
| Vai trò | `vaitro`, `vaitrochucnang`, `vaitronguoidung` | Tạo/sửa/xoá vai trò, gán chức năng, gán quyền thêm/sửa/xoá/xem |
| Chức năng & ứng dụng | `chucnang`, `configurechucnang`, `sodoquytrinh`, `testchucnang`, `ungdung`, `ungdungchucnang`, `filebaocao` | Khai báo mã, tên, **icon (= `TENANH`, kiêm router)**, đường dẫn hiển thị/tệp/thư mục/hướng dẫn, chức năng cha, thứ tự, phạm vi truy cập |
| Phân quyền dữ liệu | `quantriquyendulieu` (3 bản), `diem`, `baocaoimport`, `canbonhaphoso*`, `sinhvientunhap`, `canhantunhaphoso` | Gán phạm vi dữ liệu theo chiều; phân quyền tới mức người dùng × vai trò × chức năng; quy định trường nào cán bộ nhập, trường nào SV tự nhập |
| Danh mục & công cụ DB | `danhmucdulieu`, `danhmucthuoctinh`, `danhmuctenbang`, `danhmuctukhoa`, `danhmucimport/export`, `mauphoiin`, `comparetable`, `exporttable`, `upcode`, `cloudupdate`, `autologdb` | Danh mục nghiệp vụ **và** công cụ tác động cấu trúc DB: so sánh bảng, xuất bảng, cập nhật code từ cloud |
| Hệ thống | `config_app`, `crypto`, `guiemail`, `accessedhistory`, `chuyendulieu`, `quanlytientrinhguiemail` | Cấu hình, mã hoá, gửi email hàng loạt + theo dõi tiến trình, lịch sử truy cập |

Lưu ý: người quản trị có thể **vô tình đổi shell của một chức năng** chỉ bằng
cách đổi icon ở màn hình `chucnang`.

---

## 7. Mức tập trung của markup — quan trọng khi đổi giao diện

| | Số liệu |
|---|---:|
| `loadToTable_data` (dựng bảng chung) | **1.876** lời gọi — nhưng **chỉ sinh `<tr>/<td>`**; `<table>`, `<thead>`, wrapper nằm rải rác trong 859 tệp HTML |
| `loadToCombo_data` | 3.477 lời gọi |
| Tệp JS tự dựng `<tr>/<td>` bằng tay | **382** |
| `makeRequest` | 8.664 lời gọi (~1 lời gọi / 39 dòng JS) |
| Dòng nối chuỗi HTML trong JS | 23.471 |
| Dòng có `class=` trong JS | **17.336** |
| Thẻ `<div>` trong 859 màn hình | 68.294 (79 div/màn) |
| CSS: `App_Themes` + `assets/css` + `assets/css-new` + CSS module | 117 tệp, **228.197 dòng** |

Class cũ xuất hiện nhiều nhất **trong JS**: `td-center` 2.795 · `btn` 1.871 ·
`td-left` 1.528 · `form-control` 1.521 · `btn-default` 1.296 · `select-opt` 653.

Không có helper sinh nút trong `Core`/`Corei` — mỗi `mRender` tự viết chuỗi tay
(369 chỗ `btn btn-default btnEdit`, 87 chỗ `btnDelete`…).

→ **Đổi CSS mà bỏ quên 17.336 dòng JS này thì mọi bảng và mọi nút trong ô bảng
sẽ vỡ.**

---
