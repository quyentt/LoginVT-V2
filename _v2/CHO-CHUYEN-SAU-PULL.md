# Thay đổi của kho gốc CHỜ chuyển sang `_v2`

Mỗi lần kéo mã gốc về mà **chưa** chuyển thay đổi sang `_v2` thì ghi vào đây. Phiên chuyển đổi kế tiếp đọc tệp này
trước, làm xong mục nào thì xoá mục đó (ghi điều đã chốt vào `CAN-QUYET-DA-CHOT.md`, việc dữ liệu vào `can-quyet.js`).

Xem lại đúng thay đổi của một tệp: `git diff -w <từ>..<đến> -- <đường dẫn tệp gốc>`.

**Từ 6/10: lúc kéo CHỈ ghi tên tệp + trạng thái "chưa xem", KHÔNG mở diff** (người dùng: "diff như vậy quá tốn"). Diff mở khi tới lượt làm đúng màn đó
(kiểm host / chuyển phân hệ ấy, hoặc đang sửa màn ấy) rồi đổi thành "đã chuyển". Phân hệ chưa chuyển: không bao giờ mở.

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
