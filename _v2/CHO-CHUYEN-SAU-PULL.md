# Thay đổi của kho gốc CHỜ chuyển sang `_v2`

Mỗi lần kéo mã gốc về mà **chưa** chuyển thay đổi sang `_v2` thì ghi vào đây. Phiên chuyển đổi kế tiếp đọc tệp này
trước, làm xong mục nào thì xoá mục đó (ghi điều đã chốt vào `CAN-QUYET-DA-CHOT.md`, việc dữ liệu vào `can-quyet.js`).

Xem lại đúng thay đổi của một tệp: `git diff -w <từ>..<đến> -- <đường dẫn tệp gốc>`.

**Từ 6/10: lúc kéo CHỈ ghi tên tệp + trạng thái "chưa xem", KHÔNG mở diff** (người dùng: "diff như vậy quá tốn"). Diff mở khi tới lượt làm đúng màn đó
(kiểm host / chuyển phân hệ ấy, hoặc đang sửa màn ấy) rồi đổi thành "đã chuyển". Phân hệ chưa chuyển: không bao giờ mở.

---

## Lần kéo 11 (20/10) — mốc gốc nay là `ab5b4f19` (gốc lại force-push; mốc cũ `2254204a`) — 3 màn lớn ĐÃ CHUYỂN 20/10, còn lại chưa xem

Lần sau so: `git diff --name-status ab5b4f19 origin/main`. 32 tệp gốc đổi (bỏ `.claude/settings.local.json` của gốc — không lấy), đã ghi đè bằng
`git checkout origin/main -- <tệp>`; `skin.py kiem` 11/11 OK. **Cả 29 tệp màn đều thuộc màn ĐÃ chuyển** — không có màn mới, không có phân hệ chưa chuyển.
3 tệp vỏ cũ (`Corei/systemroot.js` +13 dòng, `index.aspx` +12, `indexi.aspx` +12) — chưa xem, mở khi làm tầng chung `_v2`.
**20/10 (người dùng: "chuyển 3 màn trước"):** 3 màn đổi lớn nhất đã chuyển — CCB `khaosat/kehoach`, SV `quyetdinh`, KHCT `cthp` (7 tệp). Tầng chung thêm `ums.ui.napXLSX` (gộp 4 bản chép tay), `ui.table` cfg.sort + `ums.ui.sortRows`. CHƯA kiểm host. 21/10: 3 tệp vỏ cũ đã xem, không cần chuyển. **21/10 (người dùng: "chuyển thêm 2 màn"):** Tuyển sinh `kehoachtuyensinhnew` (2 tệp) + CCB `nhapdiem/inbangdiem` (2 tệp) đã chuyển, Tài chính `thutienkhac.html` chỉ CSS vỏ cũ → không chuyển; dò Edge đạt, không lỗi JS. CHƯA kiểm host. **21/10 ("chuyển thêm 2 màn nữa"):** CCB `lichgiang/lichgiang` (+ `nguoihoctheokhoa.js` 1 dòng) và KHCT `phanlichgiang/phanquyen` đã chuyển — hai việc vào tầng chung (`lich.js` / `lich.css` thẻ ngắn `is-ngan`; `_pq.js` cfg.cao). **21/10 ("chuyển nốt"):** 12 tệp còn lại đã xem / chuyển — ĐKH `dangky` (đổi chương trình → nạp lại thông tin SV, kế hoạch rỗng → xoá vùng), ĐKH `ketqua` (gửi pageIndex/pageSize, giữ phân trang máy), SV `tinhtrangquanso` (ô Ngành học KHCT.NCN chọn nhiều ≤ 100 → strNganhDT_Id), TN `quanlythongtin` (Họ tên TA cho sửa), TC 4 màn import (đọc tệp lỗi thử lại 2 lần — khung `_chung_tracuu.js`), XLHV `kehoachxuly` (SV áp dụng phân trang máy chủ), TC `tinhhocphi.js` không cần. **Hết tệp chưa xem — lần kéo 11 xong 32/32.** **Kiểm host 21/10 (phân hệ đã kiểm đạt): 14 màn — SV 3, XLHV 1, CCB 4, TC 4 import, ĐKH 2 — 13 ĐẠT; Quân số lọc Ngành học máy chủ bỏ qua `strNganhDT_Id` → `ben` (LICH-SU 21/10). CHƯA kiểm host: KHCT `cthp` / `phanquyen`, TS `kehoachtuyensinhnew`, TN `quanlythongtin` (phân hệ chưa kiểm).** **Sửa thêm 20/10 (người dùng báo trên màn cthp):** Đóng / Esc ở vùng con (Chi tiết, Tình trạng học, Chọn học phần, Khối, Định hướng) nhảy thẳng ra danh sách — gốc màn Tài chính bắt nhầm `data-a="dong"` nổi bọt; nay chỉ nhận nút vùng list / view. Hệ nút vùng con: Đóng → Xoá → Lưu ở đầu khung, bỏ chân khung; "Thêm tất cả" của khung ghép lên đầu khung. Đo lại 9 lối vào: mỗi tầng một Đóng, Esc về đúng một lớp.
Số theo phân hệ: Cổng cán bộ 7 · Tài chính 6 · Sinh viên 5 · KHCT 4 · ĐKH 3 · Tuyển sinh 2 · Tốt nghiệp 1 · Xử lý học vụ 1 · Vỏ cũ 3.

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển) | `khaosat/kehoach` | `ApisCongCanBo/Modules/khaosat/html/kehoach.html` | **đã chuyển 20/10** — nút "Xuất Excel" ở tab Kết quả chi tiết (gốc nạp SheetJS từ CDN → `_v2` dùng `ums.ui.napXLSX` bản cục bộ) |
| Cổng cán bộ (đã chuyển) | `khaosat/kehoach` | `ApisCongCanBo/Modules/khaosat/script/kehoach.js` | **đã chuyển 20/10** → `_v2/…/khaosat/script/_kehoach_xuat.js` (+559 dòng gốc): xuất TOÀN BỘ kết quả chi tiết — hộp ba pha tải danh sách → tuỳ chọn (lọc phiếu / trạng thái, phạm vi dòng, chọn câu hỏi, số luồng 4–48) → tiến độ (đổi luồng khi chạy, "Dừng & xuất phần đã tải", Đóng = huỷ) → tệp 2 sheet; mỗi ô một lời gọi `KS_TaoPhieu/LayDSKetQuaTraLoiTheo` (máy chủ chưa có API gộp). Dò Edge: chạy hết, tệp tạo được, đóng giữa chừng sạch |
| Cổng cán bộ (đã chuyển) | `lichgiang/lichgiang` | `ApisCongCanBo/Modules/lichgiang/html/lichgiang.html` | **đã chuyển 21/10** — gốc 13/10 (sếp: "phóng to lên thì mất cột"): (1) lưới tuần luôn đủ 7 cột chia đều (gốc bị ép 1680px) → tầng chung `.ums-ltuan` đã là 7 cột `1fr` min 110px / 840px, không sửa; (2) thẻ 1 tiết (< 70px) kiểu gọn: nút ⋮ góc phải trên, tên / giờ một dòng → tầng chung `lich.css` `.ums-ltuan__ev.is-ngan`; (3) tiêu đề thẻ dạng khối + container query co chữ khi cột < 150px → vỏ cũ, bỏ |
| Cổng cán bộ (đã chuyển) | `lichgiang/lichgiang` | `ApisCongCanBo/Modules/lichgiang/script/lichgiang.js` | **đã chuyển 21/10** — gắn `.task-compact` khi thẻ < 70px → tầng chung `lich.js` gắn `is-ngan` (mọi lịch tuần dùng `ums.lich.tuan` đều hưởng) |
| Cổng cán bộ (đã chuyển) | `lichgiang/nguoihoctheokhoa` | `ApisCongCanBo/Modules/lichgiang/script/nguoihoctheokhoa.js` | **đã chuyển 21/10** — mẫu báo cáo gửi thêm `strDangKy_LopHocPhan_Id` (cùng giá trị lớp đã chọn) → khung `_nguoihoc.js` cờ `dangKyLop` (nguoihoc gốc không đổi → mặc định giữ) |
| Cổng cán bộ (đã chuyển) | `nhapdiem/inbangdiem` | `ApisCongCanBo/Modules/nhapdiem/html/inbangdiem.html` | **đã chuyển 21/10** — gốc thêm nhãn "Học kỳ, đợt" cho ô chọn thời gian ở hộp Kết quả đăng ký → `_ibd_chitiet.js` thêm nhãn; 168 dòng CSS hộp `#myModal_KetQuaDangKy` (tiêu đề, thead dính, màu dòng) là vỏ cũ → bỏ |
| Cổng cán bộ (đã chuyển) | `nhapdiem/inbangdiem` | `ApisCongCanBo/Modules/nhapdiem/script/inbangdiem.js` | **đã chuyển 21/10** — (1) dòng tổng "Số tín" ở Kết quả đăng ký cộng theo HỌC PHẦN (một học phần nhiều lớp HP chỉ tính một lần, khoá DAOTAO_HOCPHAN_ID → MA) → `_ibd_chitiet.js` `tongTinChi` qua `ui.table` cfg `sum` hàm; dữ liệu mẫu 3 dòng (3+3+4 → tổng 7, không phải 10); (2) dấu cách họ đệm – tên: `_v2` có sẵn |
| Đăng ký học (đã chuyển) | `canbodangky/dangky` | `ApisDangKyHoc/Modules/canbodangky/script/dangky.js` | **đã chuyển 21/10** — (1) `showThongTinSinhVien`: mỗi chương trình có hồ sơ riêng → bấm chip chương trình nạp lại tên / mã số / ảnh theo dòng đó (`hienSV`); (2) chương trình không có kế hoạch → xoá trắng vùng học phần / lớp HP / thu / GV / phương án, không gọi LayDSHocPhanDangToChuc |
| Đăng ký học (đã chuyển) | `nguyenvongdangky/ketqua` | `ApisDangKyHoc/Modules/nguyenvongdangky/html/ketqua.html` | **đã xem 21/10** — chỉ đổi version script |
| Đăng ký học (đã chuyển) | `nguyenvongdangky/ketqua` | `ApisDangKyHoc/Modules/nguyenvongdangky/script/ketqua.js` | **đã chuyển 21/10** — gốc chuyển LayDSKetQuaDangKy_NguyenVong sang phân trang máy chủ (pageIndex về 1 khi Tìm). Bản này giữ phân trang máy khách (đã chốt: chỉ gọi LayDSHocPhanDaDangKy cho dòng đang hiện) nhưng gửi tường minh pageIndex 1 / pageSize 100000 |
| KHCT (đã chuyển) | `chuongtrinhhocphan/cthp` | `ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/html/cthp.html` | **đã chuyển 20/10** — (1) tab "Dạng thẻ \| Dạng cây" trên danh sách chương trình; (2) CSS sắp xếp cột → tầng chung `table.css` (`is-sortable`, `is-sort-asc/desc`); (3) CSS nhãn học kỳ dự kiến ở hộp Khối bắt buộc → `ui.badge`; cột "Thứ tự" gốc vẫn ẩn → không có gì |
| KHCT (đã chuyển) | `chuongtrinhhocphan/cthp` | `ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/script/cthp.js` | **đã chuyển 20/10** — (1) Dạng cây Khoa quản lý → Ngành → Chuyên ngành (QUANHECHA_*) → Chương trình, nguồn `ums.ref.chuongTrinh` cùng bộ lọc; Mở rộng / Thu gọn tất cả; mã khoa thiếu tra `ums.ref.coCauToChuc`; CT không có trong danh sách thẻ → toast — dựng ở tệp dùng chung Tài chính `hoatdong/script/cthp.js` chế độ KHCT (Tài chính không đổi, do-man đạt); (2) sắp xếp theo cột bảng học phần: tăng → giảm → gốc, giữ khi Tải lại, về gốc khi mở CT khác — TẦNG CHUNG `ui.table` cfg.sort + `ums.ui.sortRows` (kiểm 30/30); (3) nhãn "Học kỳ dự kiến" đi theo học phần ở hai danh sách hộp Khối bắt buộc (`K.ghep` cfg.hocKy, `_khoi.js` m.ky từ K.dsHP) |
| KHCT (đã chuyển) | `phanlichgiang/phanquyen` | `ApisKeHoachChuongTrinh/Modules/phanlichgiang/html/phanquyen.html` | **đã chuyển 21/10** — 59 dòng CSS: khung bảng cuộn cao max(320px, 100vh − 330px) + thead dính → `_pq.js` cfg `cao` + `_pq.css` `.pq-bang--cao` (thead dính sẵn ở tầng chung); min-width cột giảng viên / ô lá → `_pq.css` đã có; thanh cuộn ngang giả phía trên → không chép (tầng chung vuốt ngang) |
| KHCT (đã chuyển) | `phanlichgiang/phanquyen` | `ApisKeHoachChuongTrinh/Modules/phanlichgiang/script/phanquyen.js` | **đã chuyển 21/10** — `initScrollTop` / `updateScrollTop` (thanh cuộn giả) + class `td-thanhphan` cho ô cây → không chép, xem dòng trên |
| Tuyển sinh (đã chuyển) | `tuyensinh/kehoachtuyensinhnew` | `ApisQuanlyTuyenSinh/Modules/tuyensinh/html/kehoachtuyensinhnew.html` | **đã chuyển 21/10** — (1) ba hộp giữ chỗ "Chức năng đang phát triển" cho nút Xem Quy định phí / Mẫu khai hồ sơ / Phương thức tuyển (trước đó hộp không tồn tại; `_v2` từng khoá nút) → `T.nutXem` khoa gắn `data-xem-dev`, `T.dangPhatTrien` mở `ui.dialog` (`_khtsn_chung.js`; hai trình xử lý bấm ở `kehoachtuyensinhnew.js`, `_khtsn_dot.js`); (2) dải "Đang sửa hồ sơ" nêu ô CHƯA lưu được: Số QĐ trúng tuyển, Mã/Loại đợt nhập học, tab Xét tuyển (nguyện vọng đầu ra / cơ sở đào tạo / lớp dự kiến nay lưu được) → `_khtsn_khai.js` |
| Tuyển sinh (đã chuyển) | `tuyensinh/kehoachtuyensinhnew` | `ApisQuanlyTuyenSinh/Modules/tuyensinh/script/kehoachtuyensinhnew.js` | **đã chuyển 21/10** — (1) một hồ sơ nhiều dòng nguyện vọng: dòng + nút Sửa / Xoá mang `data-nv` = TS_HOSO_NGUYENVONG_ID (`T.nvId`, không phân biệt hoa thường); Sửa mở đúng dòng được bấm; Xoa_HoSo_TS và Sua_HoSo_TS gửi thêm `strTS_HoSo_NV_Id` (`_khtsn_kqdk.js`, `_khtsn_khai.js`); (2) Sua_HoSo_TS gửi thêm `strDaoTao_LopQuanLy_Id_DK` (+ `_DuKien` tên đoán cũ như gốc) — BE mở 4 tham số; (3) Phân lớp tự động: MỘT action `SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYP`, bỏ ba action thử lần lượt, bỏ hai tham số vai trò / chức năng như gốc. Dữ liệu mẫu hồ sơ thêm TS_HOSO_NGUYENVONG_ID |
| Sinh viên (đã chuyển, kiểm host 12/10) | `quyetdinh/quyetdinh` | `ApisSinhVien/Modules/quyetdinh/html/quyetdinh.html` | **đã chuyển 20/10** — dải tab "Danh sách \| Danh sách chi tiết" + nút "Xuất báo cáo" cạnh Thêm mới (CSS gốc 127 dòng → `_quyetdinh.css` 12 dòng theo token) |
| Sinh viên (đã chuyển, kiểm host 12/10) | `quyetdinh/quyetdinh` | `ApisSinhVien/Modules/quyetdinh/script/quyetdinh.js` | **đã chuyển 20/10** → `_v2/…/quyetdinh/script/_qd_chitiet.js` (+345 dòng gốc): tab chi tiết lấy TOÀN BỘ quyết định theo bộ lọc lần tìm gần nhất rồi mỗi quyết định một lời gọi `SV_QuyetDinh_NguoiHoc/LayDanhSach` (6 luồng, tiến độ + Hủy, hỏi khi > 500 QĐ); dòng nhóm bấm thu / mở; cache tới khi danh sách đổi (crud.onLoad → CT.cu()); Xuất báo cáo = 1 sheet mỗi dòng một sinh viên kèm thông tin QĐ (SheetJS cục bộ). Dò Edge đạt |
| Sinh viên (đã chuyển, kiểm host 12/10) | `quyetdinh/thucthiquyetdinh` | `ApisSinhVien/Modules/quyetdinh/script/thucthiquyetdinh.js` | **đã chuyển 20/10** — Thực thi DS: `strTrangThaiNguoiHoc_Id` lấy `TRANGTHAINGUOIHOC_ID` (cột thật của `SV_QuyetDinh_NguoiHoc/LayDanhSach`), rơi về `QLSV_…` nếu có |
| Sinh viên (đã chuyển, kiểm host 12/10) | `tinhtrangquanso/tinhtrangquanso` | `ApisSinhVien/Modules/tinhtrangquanso/html/tinhtrangquanso.html` | **đã chuyển 21/10** — thêm ô "Ngành học" chọn nhiều (`dropSearch_NganhHoc_IHD`) ở hàng hai thanh lọc → `_v2` thêm ô `data-f="nganh"` trước Từ ngày |
| Sinh viên (đã chuyển, kiểm host 12/10) | `tinhtrangquanso/tinhtrangquanso` | `ApisSinhVien/Modules/tinhtrangquanso/script/tinhtrangquanso.js` | **đã chuyển 21/10** — danh mục KHCT.NCN hiện "TEN (MA)", tối đa 100 ngành (BE nhận chuỗi Id VARCHAR2; quá → cắt bớt + toast, chọn tất cả cũng bị chặn), `strNganhDT_Id` gửi ở LayDanhSach, LayDSKyTheoCauTruc và mẫu báo cáo; dữ liệu mẫu thêm 3 ngành |
| Tài chính (đã chuyển) | `dulieuhocphi/tinhhocphi` | `ApisTaiChinh/Modules/dulieuhocphi/scripts/tinhhocphi.js` | **đã xem 21/10 — không chuyển**: `e.stopImmediatePropagation()` trên nút Tính học phí chống trình xử lý `#btnYes` chồng của vỏ cũ; `_v2` dùng `ui.confirm` trả Promise, không có lỗi này |
| Tài chính (đã chuyển) | `phieuthu/thutienkhac` | `ApisTaiChinh/Modules/phieuthu/html/thutienkhac.html` | **đã xem 21/10 — không chuyển**: 217 dòng CSS vỏ cũ (nút "Thêm đối tượng" trên header xanh, chân form Thêm/Sửa đối tượng, thẻ Báo cáo + menu mẫu) + bỏ `bg-green` hai thẻ tổng Khoản phải nộp / được miễn (màu thẻ vỏ cũ) + đổi version script |
| Tài chính (đã chuyển) | `phieuthu/import_danop` | `ApisTaiChinh/Modules/phieuthu/scripts/import_danop.js` | **đã chuyển 21/10** — đọc tệp (`SYS_Import/getDataFormFileImport`) lỗi → thử lại sau 1 giây, tối đa 2 lần, rồi nhắc "Hãy tối ưu lại file up load…" → khung chung 4 màn `_chung_tracuu.js` `docFile(lanLoi)` (gốc quên `endLoading` khi thử lại — bản này không mắc) |
| Tài chính (đã chuyển) | `phieuthu/import_phainop` | `ApisTaiChinh/Modules/phieuthu/scripts/import_phainop.js` | **đã chuyển 21/10** — cùng thay đổi, cùng khung `_chung_tracuu.js` |
| Tài chính (đã chuyển) | `phieuthu/import_phantrammiengiam` | `ApisTaiChinh/Modules/phieuthu/scripts/import_phantrammiengiam.js` | **đã chuyển 21/10** — cùng thay đổi, cùng khung `_chung_tracuu.js` |
| Tài chính (đã chuyển) | `phieuthu/import_sotienmiengiam` | `ApisTaiChinh/Modules/phieuthu/scripts/import_sotienmiengiam.js` | **đã chuyển 21/10** — cùng thay đổi, cùng khung `_chung_tracuu.js` |
| Tốt nghiệp (đã chuyển) | `vanbang/quanlythongtin` | `ApisTotNghiep/Modules/vanbang/html/quanlythongtin.html` | **đã chuyển 21/10** — ô Họ đệm TA / Tên TA bỏ `readonly` → `cap('Họ và tên TA', …, false)` (Sua đã gửi hai tham số này sẵn) |
| Xử lý học vụ (đã chuyển) | `kehoachxuly/kehoachxuly` | `ApisXuLyHocVu/Modules/kehoachxuly/script/kehoachxuly.js` | **đã chuyển 21/10** — danh sách SV áp dụng (`XLHV_DanhSachKhongXuLy/LayDanhSach`) phân trang máy chủ (pageIndex / pageSize mặc định + Pager) thay 1 / 1000000 → `_khxl_form.js` `taiSV(p)` có `page`; lọc tại chỗ và "Xét" chỉ trong trang đang hiện; gốc bỏ cột ảnh (vẽ rỗng) — bản này giữ ảnh |
| Vỏ cũ | — | `Corei/systemroot.js` (+13 dòng) | đã xem 21/10 — `makeRequest` đối chiếu `func` với `action`: phần mã hoá của action = `AE(tên thủ tục sau dấu chấm, "A")` thay `=` → `P`; lệch thì gắn cờ "Sai hàm" (chỉ theo dõi, không chặn). Không cần chuyển; ghi cách sinh action vào CLAUDE.md mục 3 |
| Vỏ cũ | — | `index.aspx` (+12 dòng) | đã xem 21/10 — chatbot CMC, chỉ bật khi `DONVI == CMC` hoặc tên miền `*.cmcu.edu.vn`; host EAUT không ảnh hưởng → không chuyển (muốn thì chép khối có điều kiện vào `_v2/index.aspx`) |
| Vỏ cũ | — | `indexi.aspx` (+12 dòng) | đã xem 21/10 — như `index.aspx` (chatbot CMC) → không chuyển |

## Lần kéo 10 (12/10 tối) — mốc gốc nay là `2254204a` (gốc lại force-push; mốc cũ `c42e11e1`)

Lần sau so: `git diff --name-status 2254204a origin/main`. 11 tệp gốc đổi, đã ghi đè bằng `git checkout origin/main -- <tệp>`. **ĐÃ CHUYỂN HẾT 12/10 tối** (người dùng bảo "chuyển"), do-man 4 màn sạch. **Kiểm host 12/10 (host mới):** CCB `lichgiangnhieuphonghoc` ĐẠT; TC `hopdong` host không khai chức năng → không mở được; 7 tệp Sinh viên kiểm host 12/10 chiều: `_hsA.js` chặn thiếu giới tính ĐẠT, `tinhtrangquanso` tổng đúng (danh mục mở rộng host trống).
Số theo phân hệ: Sinh viên 7 · Cổng cán bộ 2 · Tài chính 2. **Cả 11 tệp đều của màn ĐÃ chuyển** — không có màn mới, không có phân hệ chưa chuyển.

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển, đã kiểm host 6/10) | `lichgiang/lichgiangnhieuphonghoc` | `ApisCongCanBo/Modules/lichgiang/html/lichgiangnhieuphonghoc.html` | **đã chuyển 12/10, kiểm host 12/10 ĐẠT** — thêm 2 mục ô Tiết: "Sáng + chiều (T1-12)", "Cả ngày (T1-15)" (+ đổi version script, bỏ); host: hai mục gọi LAYPHONGHOCTRONG 06:45–18:25 / 06:45–21:10 đúng |
| Cổng cán bộ (đã chuyển, đã kiểm host 6/10) | `lichgiang/lichgiangnhieuphonghoc` | `ApisCongCanBo/Modules/lichgiang/script/lichgiangnhieuphonghoc.js` | **đã chuyển 12/10** — gốc: đang lọc phòng trống theo khoảng ngày thì mọi lần vẽ lại (đổi cách tính, tải thêm phòng) đều vẽ bảng phòng × ngày; `_v2` đã đúng sẵn (khung `_nhieu.veLai` luôn hỏi `veThay` trước) → không sửa |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/hoso_capnhat` | `ApisSinhVien/Modules/hoso/html/hoso_capnhat.html` | **đã chuyển 12/10** — chỉ đổi version `zoneEditModal_inject.js?v=…73`, không có gì chuyển |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/hoso_danhsach` | `ApisSinhVien/Modules/hoso/html/hoso_danhsach.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/quanlytoanbo` | `ApisSinhVien/Modules/hoso/html/quanlytoanbo.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/xemhoso` | `ApisSinhVien/Modules/hoso/html/xemhoso.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/zoneEditModal_inject` | `ApisSinhVien/Modules/hoso/script/zoneEditModal_inject.js` | **đã chuyển 12/10** → `_v2/…/hoso/script/_hsA.js`: (1) Giới tính trống thì KHÔNG lưu, tô đỏ ô + mở tab Thông tin cơ bản (gốc 09/10: ô không có dòng trống nên rơi về "Nam" rồi ghi đè; `_v2` đã có dòng trống sẵn, chỉ thêm chặn lưu); (2) tab Xuất hoá đơn: ô bỏ trống mà người dùng không tự gõ thì lấp lại giá trị bản ghi hiện hành (`st.hdCham`, `giuHoaDonCu`), không ghi rỗng đè |
| Sinh viên (đã chuyển, kiểm host 12/10) | `tinhtrangquanso/tinhtrangquanso` | `ApisSinhVien/Modules/tinhtrangquanso/html/tinhtrangquanso.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, kiểm host 12/10) | `tinhtrangquanso/tinhtrangquanso` | `ApisSinhVien/Modules/tinhtrangquanso/script/tinhtrangquanso.js` | **đã chuyển 12/10** — cột tiêu chí mở rộng (Nữ, DTTS…) là tập con của trạng thái → KHÔNG cộng vào "Tổng số" dòng và tổng chung (cờ `moRong` trên cột, hàm `tong()`); tổng từng cột vẫn hiện |
| Tài chính (đã chuyển, đã kiểm host 30/9) | `dulieuhocphi/hopdong` | `ApisTaiChinh/Modules/dulieuhocphi/html/hopdong.html` | **đã chuyển 12/10** — nút "Xoá đã chọn" + cột ô đánh dấu (chọn tất cả) ở bảng sinh viên, thanh nút đặt trên bảng. Host 12/10: màn không có trên menu / mapping (host chưa khai) → chưa kiểm được |
| Tài chính (đã chuyển, đã kiểm host 30/9) | `dulieuhocphi/hopdong` | `ApisTaiChinh/Modules/dulieuhocphi/scripts/hopdong.js` | **đã chuyển 12/10** — `delSvChon`: dòng mới chỉ gỡ khỏi danh sách, dòng đã lưu xoá `TC_NguoiHoc_QuanLy/Xoa` từng Id qua `ui.batch` 5 luồng, báo gộp, nạp lại; nút = `ui.xoaChon` (tự đếm, mờ khi chưa chọn) |

---

## Lần kéo 9 (12/10) — mốc gốc nay là `c42e11e1` (gốc force-push; `origin/main` cũ trên máy là `df26f98b`)

Lần sau so: `git diff --name-status c42e11e1 origin/main`. 46 tệp gốc đổi, đã ghi đè bằng `git checkout origin/main -- <tệp>`, CHƯA mở diff.
Số theo phân hệ: Ký túc xá 34 (đang chuyển 12/10: 28 tệp của màn đã chuyển, 5 của màn chưa làm, 1 CSS không chép) · Sinh viên 7 · Tài chính 3 · Cổng cán bộ 2.
Không chép `ApisKyTucXa.zip` (gói nén, 285 KB, gốc thêm mới).

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển, đã kiểm host) | `lichgiang/lichgiang` | `ApisCongCanBo/Modules/lichgiang/html/lichgiang.html` | **đã chuyển 12/10** |
| Cổng cán bộ (đã chuyển, đã kiểm host) | `lichgiang/lichgiang` | `ApisCongCanBo/Modules/lichgiang/script/lichgiang.js` | **đã chuyển 12/10** |
| Ký túc xá (đang chuyển 12/10) | `common/ktx-ui` | `ApisKyTucXa/Modules/common/ktx-ui.css` | **không chép** — CSS vỏ cũ, chỉ bám bố cục (12/10) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtodien` | `ApisKyTucXa/Modules/cosovatchat/html/congtodien.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtonuoc` | `ApisKyTucXa/Modules/cosovatchat/html/congtonuoc.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/phong` | `ApisKyTucXa/Modules/cosovatchat/html/phong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/quanlythietbi` | `ApisKyTucXa/Modules/cosovatchat/html/quanlythietbi.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/thietbi` | `ApisKyTucXa/Modules/cosovatchat/html/thietbi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/toanha` | `ApisKyTucXa/Modules/cosovatchat/html/toanha.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtodien` | `ApisKyTucXa/Modules/cosovatchat/script/congtodien.js` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtonuoc` | `ApisKyTucXa/Modules/cosovatchat/script/congtonuoc.js` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/toanha` | `ApisKyTucXa/Modules/cosovatchat/script/toanha.js` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `danhmuc/danhmucdulieu` | `ApisKyTucXa/Modules/danhmuc/html/danhmucdulieu.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `diennuoc/diennuoc` | `ApisKyTucXa/Modules/diennuoc/html/diennuoc.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/chinhsach` | `ApisKyTucXa/Modules/hopdong/html/chinhsach.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/chuacohopdong` | `ApisKyTucXa/Modules/hopdong/html/chuacohopdong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/dacohopdong` | `ApisKyTucXa/Modules/hopdong/html/dacohopdong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/miengiam` | `ApisKyTucXa/Modules/hopdong/html/miengiam.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/dangkynguoio` | `ApisKyTucXa/Modules/hoso/html/dangkynguoio.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/hoso` | `ApisKyTucXa/Modules/hoso/html/hoso.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/khongtinhmien` | `ApisKyTucXa/Modules/hoso/html/khongtinhmien.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/khongtinhphi` | `ApisKyTucXa/Modules/hoso/html/khongtinhphi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/taomoihoso` | `ApisKyTucXa/Modules/hoso/html/taomoihoso.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/kehoach` | `ApisKyTucXa/Modules/kehoach/html/kehoach.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/kehoachdangky` | `ApisKyTucXa/Modules/kehoach/html/kehoachdangky.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/phanphongdangky` | `ApisKyTucXa/Modules/kehoach/html/phanphongdangky.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/xepphongdangky` | `ApisKyTucXa/Modules/kehoach/html/xepphongdangky.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/apdungcongthucphi` | `ApisKyTucXa/Modules/taichinh/html/apdungcongthucphi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/chuyendulieuketoan` | `ApisKyTucXa/Modules/taichinh/html/chuyendulieuketoan.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/khoanthu` | `ApisKyTucXa/Modules/taichinh/html/khoanthu.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/mucluyke` | `ApisKyTucXa/Modules/taichinh/html/mucluyke.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/phidichvu` | `ApisKyTucXa/Modules/taichinh/html/phidichvu.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/phitheoloaiphong` | `ApisKyTucXa/Modules/taichinh/html/phitheoloaiphong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/phitheophong` | `ApisKyTucXa/Modules/taichinh/html/phitheophong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/tinhphi` | `ApisKyTucXa/Modules/taichinh/html/tinhphi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `xacnhandangkyphong/xacnhandangkyphong` | `ApisKyTucXa/Modules/xacnhandangkyphong/html/xacnhandangkyphong.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/hoso_capnhat` | `ApisSinhVien/Modules/hoso/html/hoso_capnhat.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/hoso_danhsach` | `ApisSinhVien/Modules/hoso/html/hoso_danhsach.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/quanlytoanbo` | `ApisSinhVien/Modules/hoso/html/quanlytoanbo.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/xemhoso` | `ApisSinhVien/Modules/hoso/html/xemhoso.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, kiểm host 12/10) | `hoso/zoneEditModal_inject` | `ApisSinhVien/Modules/hoso/script/zoneEditModal_inject.js` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, kiểm host 12/10) | `quyetdinh/quyetdinh` | `ApisSinhVien/Modules/quyetdinh/html/quyetdinh.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, kiểm host 12/10) | `quyetdinh/quyetdinh` | `ApisSinhVien/Modules/quyetdinh/script/quyetdinh.js` | **đã chuyển 12/10** |
| Tài chính (đã chuyển, đã kiểm host) | `danhmucheso/taikhoanno` | `ApisTaiChinh/Modules/danhmucheso/html/taikhoanno.html` | **đã chuyển 12/10** |
| Tài chính (đã chuyển, đã kiểm host) | `danhmucheso/taikhoanno` | `ApisTaiChinh/Modules/danhmucheso/scripts/taikhoanno.js` | **đã chuyển 12/10** |
| Tài chính (đã chuyển, đã kiểm host) | `phieuthu/thutienkhac` | `ApisTaiChinh/Modules/phieuthu/scripts/thutienkhac.js` | **đã chuyển 12/10** |

---

## Lần kéo 8 (6/10) — mốc gốc nay là `3c3b2d70` (gốc lại force-push; `origin/main` trên máy từng bị lệnh push ghi đè thành commit của mình, fetch đã sửa)

Lần sau so: `git diff --name-status 3c3b2d70 origin/main`. Bốn tệp gốc đổi (hai màn), đã ghi đè bằng `git checkout origin/main -- <tệp>`, CHƯA mở diff.

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển, đã kiểm host) | `lichgiang/lichgiangnhieuphonghoc` | html + js | **đã chuyển 6/10 chiều**: tìm phòng trống (lọc + hộp đổi lịch) không gửi `strKieuPhong` nữa (gốc: gửi 'LT'/'TH' thì thủ tục trả 0 phòng; loại đã lọc ở máy khách) → `goiTrong` gửi rỗng. Bỏ: đổi version script html, console.warn. **Kiểm lại trên host 6/10 tối ĐẠT** (thủ tục trả 242–250 phòng / ngày với `strKieuPhong` rỗng; lọc LT / TH ở máy khách 235 / 217 ô; hộp đổi lịch mở – đóng sạch). Sửa thêm: khoá nhớ kết quả bỏ loại phòng (đổi loại không gọi lại) — gói bổ sung chờ up |
| Quản lý tuyển sinh (đã chuyển, chưa kiểm host) | `tuyensinh/kehoachtuyensinhnew` | html + js | **chưa xem** — mở diff khi kiểm host Tuyển sinh |

## Lần kéo 7 (5/10 tối) — ĐÃ CHUYỂN HẾT, mốc gốc đã chuyển nay là `1680e53d` (gốc bị force-push từ `0551deba`)

Lần sau so: `git diff --name-status 1680e53d origin/main`. Ba tệp gốc đổi, đã ghi đè bằng `git checkout origin/main -- <tệp>`.

| Tệp gốc | Gốc đổi gì | `_v2` |
|---|---|---|
| KHCT `danhmuc/danhmucdulieu.html` | Mở lại ba ô lọc Dữ liệu cha / Trạng thái / Từ khoá + nút Tìm kiếm (script gốc vốn đã gắn sẵn, html trước chỉ có ô từ khoá) | ĐÃ CHUYỂN: bỏ `data-loc="q"` ở bản nạp chéo → hiện cả ba ô như Tài chính |
| `Core/systemroot.js`, `Corei/systemroot.js` | `randomInt(4)` → `randomInt(32)` cho `?v=` chống cache khi nạp html / js / Config.js | Vỏ cũ — `_v2` có cơ chế `?v=` riêng, không chuyển |

## Lần kéo 6 (5/10) — ĐÃ CHUYỂN HẾT 5/10, CHƯA kiểm host — 13 commit gốc `88f37941..0551deba` (1/10 → 5/10), mốc gốc đã chuyển nay là `0551deba`

Kho máy là bản GỘP một commit (`20b5dbe6`, 2/10) — không chung gốc với kho gốc → KHÔNG `git merge` được; đã ghi đè 20 tệp gốc bằng
`git checkout origin/main -- <tệp>` (mọi tệp trên máy đúng là bản gốc cũ, chỉ khác CRLF). Lần sau so: `git diff --name-status 0551deba origin/main`.

| Tệp gốc | Gốc đổi gì | `_v2` |
|---|---|---|
| CCB / QLD / TP `nhapdiem*`, `tuibai`, `phanquyennhapdiem*` (10 tệp) | Câu báo lỗi bỏ tiền tố "XLHV_NhapDiem/ThemMoi (er):" | Không cần — `_v2` vốn không có tiền tố này |
| TC `dulieuhocphi/tinhhocphi` | Bỏ chọn Lớp → nạp lại sinh viên (khi vùng SV mở); SV nạp khi mở vùng | ĐÃ CHUYỂN: thêm `select2:unselect/clear` |
| TC `phieuthu/thutien` | QR thanh toán mở `Init_API().TSV` nếu có | ĐÃ CHUYỂN (`_chung_thutien.js` `taoQR`) |
| NH `phanlop/phanlop` | Chương trình chỉ nạp khi có kế hoạch; khoá lùi `KHOADAOTAO_ID` / `DAOTAO_KHOAHOC_ID`; nhãn "Tên - Mã" | ĐÃ CHUYỂN (`taiCT`, `tenCT`; chặn khi chưa có kế hoạch vốn đã có) |
| TN `kehoach/xacnhan` (html + js) | Nút "Hạ bậc trực tiếp" (hộp Xếp loại + Lý do, mỗi người một lời gọi `pkg_totnghiep_tinhtoan.HaBacTrucTiep`); còn lại CSS | ĐÃ CHUYỂN — hộp thoại (thao tác hàng loạt), hỏi lại, chạy tuần tự; đường GHI mới, chưa thử host |
| TN `vanbang/quanlythongtin` (html + js) | Nút "Gán số vào sổ" (một SV → hộp chọn số chưa dùng theo quy tắc / năm → `PKG_VANBANG_CHUNGCHI.GanSoVaoSoTrucTiep`); còn lại CSS | ĐÃ CHUYỂN — hộp chọn, hỏi lại; đường GHI mới, chưa thử host |
| TS `tuyensinh/kehoachtuyensinhnew.js` (+540/−363) | Nguồn khai thác (đối tác TS): tra lùi `LayDS_TS_HoSo_DoiTacTS` (vì `Them_TS_HoSo_DoiTacTS` lưu IS_ACTIVE NULL), cột "Nguồn khai thác", tham số mới `strTS_DoiTacTuyenSinh_Id/_id/_Khac` cho Them/Sua_HoSo_TS; chặn trùng CCCD, khoá nút Lưu khi đang lưu; chọn ô theo chữ lỏng; danh sách mới nhất lên đầu (hai commit 1/10 tên "popup … pvp" thật ra là màn này) | ĐÃ CHUYỂN (`_khtsn_chung/khaiphu/khai/kqdk.js`) — bỏ khai báo trùng `_hsDotHienTai/_nvDauRaHienTai` (lỗi lùi của gốc 2/10) |
| `Core/systemroot.js`, `Corei/systemroot.js` | Gốc nay CÓ SẴN nút "?" Cổng Help (y bản máy); Core đổi hẹn giờ kiểm phiên bản 20 s → 300 s | Vỏ cũ — không chuyển; ghi đè theo gốc (ngoại lệ "nút ?" không còn cần) |
| `help-sso.aspx`, `help-jwks.aspx` | Gốc nay có hai tệp (y bản máy) | Không đổi |
| QLTTN + `App_Themes/Cms/Custom_V1/ums/` (lột da) | Gốc nhận phần lột da của máy (+ `modules.rar`, `ums.rar`, `quanlythi.css`, `giamsatthi.js`) | Trên máy đã trùng gốc mới; phân hệ chưa sang `_v2` |

## Trước lần kéo 6

Lần kéo 4 (30/9, merge `cffda56e`) + lần kéo 5 (1/10, merge `c6886b05`) — ĐÃ CHUYỂN 1/10: 20 màn (CCB `lichgiangnhieuphonghoc`, Cổng SV 18 màn,
màn mới Cổng SV `dicvusinhvien/nguoihocxacnhanthanhtoan`). Điều đã chốt: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-01". **CHƯA kiểm host, CHƯA commit** — danh sách màn cần kiểm: `_harness/kiem-host/VIEC-PHIEN-SAU.md` mục 1 (nhắc đầu tiên khi người dùng bảo "chuyển" / "kiểm").

Còn ghi nhớ (không phải việc chuyển lúc này): kho gốc có phân hệ mới `ApisThiTracNghiem/` và thay đổi `ApisQuanLyThiTracNghiem/` —
hai phân hệ chưa chuyển sang `_v2`, khi chuyển thì theo bản gốc mới nhất.
