# Rà hộp thoại — đưa thêm / sửa về MỘT chuẩn

Lập 2026-09-30 theo yêu cầu người dùng: "rà toàn bộ và ghi chú chuyển đổi, chuyển phải về một chuẩn nhất định".

## Chuẩn (BO-CUC luật 1)

- **Thêm / sửa một BẢN GHI lưu xuống máy chủ = biểu mẫu NGAY TRONG TRANG**, thay chỗ danh sách / lưới / bảng con. Áp cho cả bản ghi con trong
  màn chi tiết và hộp chỉ có một ô giá trị. Màn dựng bằng `ums.crud` đã đúng sẵn; màn tự dựng dùng `ums.pat.formTrang({ host, title, body, buttons })`
  (patterns.js) — nhận cấu hình như `ui.dialog`, trả `{ body, close() }`, bấm nút xong tự đóng trừ khi `onClick` trả `false` / nút có `keepOpen`.
- **Hộp thoại (`ums.ui.dialog`) chỉ cho VIỆC PHỤ:** chọn (sinh viên, học phần, lớp, nhân sự, phạm vi), xem chi tiết / danh sách chỉ đọc, xem trước / in,
  xác nhận / phê duyệt (kể cả có ô ghi chú), tiến độ, gửi email, kế thừa / sao chép, nhập từ tệp, lịch sử, chạy công cụ.
- Đầu khung biểu mẫu: **Đóng** (trái) → **Xoá** (chỉ khi sửa) → các nút khác → **Lưu**. Ô ngắn hai ô một hàng.

Ký hiệu: **BM** = biểu mẫu thêm / sửa đang bật hộp thoại (SAI chuẩn, phải chuyển) · **?** = lưỡng tính, quyết định ghi ở cột cuối · **PHU** = việc phụ, giữ hộp thoại.
Cột "Tình trạng": `xong 30/9` = đã chuyển sang biểu mẫu trong trang · `giữ` = quyết định giữ hộp thoại (nêu lý do).

## Tổng hợp

Rà 2026-09-30: **384 hộp thoại** trong mã màn của 17 phân hệ (không tính hộp chọn / xác nhận dùng chung ở `assets/js`).

| Phân hệ | Hộp đã xem | Phải chuyển (BM + lưới nhập + màn con) | Giữ hộp thoại |
|---|---:|---:|---:|
| Cổng cán bộ | 84 | 22 | 62 |
| Tài chính | 50 (+11 đã chuyển) | 15 | 35 |
| Đăng ký học | 46 | 5 | 41 |
| Cổng sinh viên | 34 | 5 | 29 |
| Tuyển sinh | 24 | 10 | 14 |
| Nhập học | 23 | 5 | 18 |
| Quản lý điểm | 22 | 4 | 18 |
| Sinh viên | 20 | 2 | 18 |
| Quản trị hệ thống | 15 | 4 | 11 |
| Kế hoạch chương trình | 11 | 3 | 8 |
| Nghiên cứu khoa học | 11 | 0 | 11 |
| Thi phách | 10 | 3 | 7 |
| Nhân sự | 10 | 1 | 9 |
| Học bổng | 8 | 0 | 8 |
| Xử lý học vụ | 6 | 3 | 3 |
| Học lại thi lại, Chuyên cần, Rèn luyện | 3 | 0 | 3 |
| **Cộng** | **384** | **82** | **302** |

**Tình trạng 2026-09-30: cả 82 hộp + 11 màn lưới nhập Tài chính ĐÃ CHUYỂN** (93 hộp vào trang). Đã dò từng biểu mẫu trên máy bằng dữ liệu mẫu
(không còn `dialog[open]`, đúng một nút Đóng, đóng thì vùng cũ hiện lại, không lỗi JS). CHƯA dò: nhánh máy chủ từ chối khi Lưu (dữ liệu mẫu luôn trả
thành công), vài đường Thêm bị dữ liệu mẫu chặn (Tài chính `donviphilop`, `mucmiengiammoi`; Sinh viên `tonghopdoituong`), các nút Xoá trong biểu mẫu
Tài chính, Cập nhật / Xoá trong "Thông tin quá trình" và "Chi tiết thanh toán" (KLGD), khung lỗi khi import hồ sơ Tuyển sinh. **Chưa kiểm trên host.**

**Cách xếp loại mục lưỡng tính (áp giống nhau cho mọi phân hệ):**
1. Hộp mà nội dung chính là Ô NHẬP rồi Lưu thành bản ghi — một bản ghi, một ô giá trị, hay LƯỚI nhập nhiều dòng — → **chuyển** vào trang.
2. Hộp là MÀN CON quản lý bảng con (danh sách + thêm / sửa / xoá) → **chuyển** vào trang.
3. Hộp CHỌN từ danh sách rồi gán (kể cả gán quyền bằng ô đánh dấu), hộp XÁC NHẬN / phê duyệt (kể cả có lý do), THAO TÁC HÀNG LOẠT đặt một giá trị cho
   các dòng đã đánh dấu, hộp XEM (kể cả có một ô phụ) → **giữ** hộp thoại.
4. Biểu mẫu mở TỪ một hộp danh sách được giữ: đóng hộp danh sách, mở biểu mẫu trong trang, đóng biểu mẫu thì mở lại hộp danh sách.

## Quản lý điểm — 22 hộp: 4 BM, 1 ?, 17 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `congthucdiem/script/hinhthucthi.js:89` | Sửa hình thức thi | ô học phần × kỳ (`_congthuc.js:238` gọi `cfg.sua`) | `Them_Diem_HinhThucThi_AD` | `root` của `C.man` — `cfg.sua` chưa nhận root | thêm tham số vùng gốc vào `cfg.sua` | **xong 30/9** |
| `congthucdiem/script/hocphan.js:84` | Sửa công thức | như trên | `Them_Diem_CongThucDiem_AD` | như trên | hộp một ô (textarea) | **xong 30/9** |
| `kehoach/script/_qld_quyetdinh.js:127` | Nhập mới quyết định | nút "Tạo mới quyết định" | `Them_QLSV_QuyetDinh` | `zone` | `zone` đã là khung thay chỗ → biểu mẫu là tầng hai | **xong 30/9** |
| `kehoach/script/_qld_ketqua.js:174` | Xem thông tin đăng ký công nhận điểm | nút bút trong dòng | `Them_Diem_NguoiHoc_HocPhan_Cap` + tệp | `zone` | có Xoá; lưu xong KHÔNG đóng; nạp dữ liệu sau khi mở | **xong 30/9** |
| `canhan/script/_chitiet.js:174` | Kết quả — <SV> | cột "Xem" | lô `XuLyKhongTinhDiem` | (không có) | **?** bảng sửa cờ nhiều bản ghi, không phải biểu mẫu một bản ghi | giữ (bảng xem có ô đánh dấu, cùng họ ba hộp chỉ xem) |

## Quản trị hệ thống (CMS) — 15 hộp: 4 BM, 2 ?, 9 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `chucnang/script/chucnang.js:466` | Quyền | "Thêm mới" khối Quyền + nút bút | `Them_Core_Quyen` / `Sua_Core_Quyen` (lô) | `root`, bảng ở `z('quyen')` | nút Lưu không trả false → hộp đóng trước khi lô xong | **xong 30/9** |
| `baocao/script/kehoach.js:218` | Phân quyền | nút bút trong dòng | `CMS_BaoCao_CoSo/CapNhat` | `elPq` | chỉ sửa (Thêm đã trong trang); có Xoá | **xong 30/9** |
| `baocao/script/khaibao.js:207` | Cấu trúc chính / phụ | nút thêm + bấm đầu cột / dòng | `CMS_BaoCao_CauTruc_*_G/ThemMoi·CapNhat` | `elCt` | có Xoá khi sửa | **xong 30/9** |
| `phanquyen/script/baocaoimport.js:107` | Gán quyền báo cáo | nút thêm | `CMS_PhanQuyen_MauImport/ThemMoi` | `root` | lưu xong KHÔNG đóng để gán tiếp | **xong 30/9** |
| `baocao/script/khaibao.js:230` | Thành phần | bấm ô `[data-tp]` | lô `CMS_CauTruc_DuLieu_G/ThemMoi` | `elCt` | **?** chọn nhiều mục từ danh mục + thứ tự | giữ (bản chất là hộp CHỌN) |
| `nguoidung/script/nguoidung.js:331` | Cài lại mật khẩu | nút trong chi tiết người dùng | `CMS_Custom/ResetPassword` | `root` | **?** thao tác trên tài khoản | giữ (thao tác, không phải bản ghi) |

## Nghiên cứu khoa học — 11 hộp: 0 BM, 11 PHU

Thêm / sửa sản phẩm đã là biểu mẫu trong trang (`ums.crud`, khung `ums.nckh`). 10 hộp xác nhận kê khai + 1 hộp chọn đề tài — giữ.

## Thi phách — 10 hộp: 3 BM, 1 ?, 6 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `kehoach/script/phuckhao.js:245` | Thời hạn phúc khảo theo đợt thi | nút thêm + nút bút | `Them_Thi_PhucKhao_TG_Ad` (thêm = lô) | `root`, vùng `z('th')` | `z('th')` đã là khung thay chỗ → tầng hai; hộp đóng TRƯỚC khi lô chạy | **xong 30/9** |
| `kehoach/script/_tp_tui_tui.js:147` | Thêm mới - Túi | nút Thêm trong "Đánh túi bài thi" | `TP_TuiBai/ThemMoi` + lô DST | `V = ctx.z('view')` | `V` đã là khung thay chỗ; có nút thứ hai "Tạo túi tự động" | **xong 30/9** |
| `kehoach/script/_tp_tui_tui.js:222` | Danh sách sinh viên trong túi bài | bấm tên túi | `TP_TuiBai/CapNhat` (chỉ khi `ctx.tc`) | `V` | màn `tuibai` cũ thì chỉ xem; mở hộp con dòng 274; có `onClose` | **xong 30/9** |
| `kehoach/script/_tp_tui_tui.js:274` | Danh sách cần thêm | "Thêm vào túi" trong hộp trên | lô `Them_Thi_Tui_NH_ThuCong` | (không) | **?** chọn SV thêm vào túi | giữ (hộp CHỌN) |

## Cổng sinh viên — 34 hộp: 4 BM, 1 ?, 29 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `dangkyhoc/script/_congnhandiem.js:171` (`ums.cnd.bangDiem`) | Đăng ký công nhận từ bảng điểm | nút "Từ bảng điểm" trong dòng | `Them_Diem_NguoiHoc_Diem_CN` + từng dòng `…_CN_HP` + tệp | hàm chung không có root, nơi gọi có | dùng cho `congnhandiem.js:152`, `congnhandiemv3.js:392`; lưu xong ở lại; nút huỷ ẩn / hiện qua `dlg.el.querySelector('[data-dlg="0"]')`; hàm trả `dlg` | **xong 30/9** |
| `dangkyhoc/script/congnhandiem.js:65` | Đăng ký công nhận từ chứng chỉ | nút "Từ chứng chỉ" | `Them_Diem_NguoiHoc_Diem_CN` + lô `…_CN_CC` + tệp | `root` | lưu xong ở lại; cũng dùng `[data-dlg="0"]` | **xong 30/9** |
| `hoctap/script/congnhandiem.js:264` | Xem thông tin đăng ký công nhận điểm | liên kết trong ô | `Them_Diem_NguoiHoc_HocPhan_Cap` | `root` | nút Xoá khoá qua `[data-dlg="0"]`; màn đã có vùng thay chỗ `vungKhai` ↔ `vungDS` | **xong 30/9** |
| `hoctap/script/hoantotnghiep.js:227` | Khai chứng chỉ đã có (Minh chứng) | nút "khai" ở dòng + "Chi tiết" trong hộp danh sách | `Them_TN_NguoiHoc_HocPhan_Cap` | `root` | đường sửa mở TỪ hộp danh sách `hopKetQua` (:183) → phải đóng hộp danh sách trước khi mở biểu mẫu | **xong 30/9** |
| `thanhtoanonline/script/thanhtoanonline.js:533` | Thêm khoản Nộp trước | nút trên màn | `Them_TaiChinh_PhaiNop_NopTruoc` | `root` | hàm lưu nhận `dlg`, tự `dlg.close()` | **xong 30/9** |
| `hoctap/script/hoantotnghiep.js:152` | Xác nhận theo kế hoạch | nút ở dòng kế hoạch | `Them_TN_KeHoach_DangKy` | `root` | **?** tình trạng + lý do | giữ (hộp XÁC NHẬN) |

## Sinh viên — 20 hộp: 2 BM, 5 ?, 13 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `chinhsach/script/goihotro.js:308` | Chi tiết gói hỗ trợ | nút thêm + nút bút bảng chi tiết | `SV_GoiHoTro_ChiTiet/ThemMoi·CapNhat` | `root` | bản ghi con; màn đã có hai biểu mẫu trong trang (`ui.swap`); có Xoá | **xong 30/9** |
| `chinhsach/script/_chinhsach.js:562` | Chỉnh sửa - Gói hỗ trợ | liên kết trong ô lưới | lô `SV_KetQua_ChinhSach/CapNhat` | `root` của `C.man` | lưới sửa nhiều bản ghi; nút Lưu không trả false → hộp đóng trước khi lô xong | **xong 30/9** |
| `quyetdinh/script/quyetdinh.js:352` · `:365` · `:395` · `:406` | Chọn trạng thái / Chọn lớp / Nhập % tính phí / Thêm học kỳ | nút thanh công cụ bảng SV của quyết định | lô `CapNhat_*_QD_NH`, `Them_QLSV_QD_ThoiGian` | `root` | **?** ×4 — chọn MỘT giá trị rồi áp cho các SV đã đánh dấu | giữ (THAO TÁC HÀNG LOẠT trên dòng đã chọn) |
| `thutuchanhchinh/script/canboxuly.js:208` | <họ tên SV> | nút trao đổi | `Them_MotCua_NH_YC_XL_PhanHoi` | `root` | **?** khung trao đổi kiểu chat | giữ (xem + trao đổi) |

## Nhân sự — 10 hộp: 1 BM, 9 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `luong/script/_luongA.js:360` (`hopDM` trong `A.cauTruc`) | Thêm mới / Chỉnh sửa danh mục dữ liệu | "Thêm mới" + nút bút khung "Danh mục thành phần công thức" | `CMS_DanhMucDuLieu/ThemMoi` | `cfg.root`; khối `khoi3`, bảng `[data-z="dm"]` | 3 màn (`cautrucbangluong`, `cautrucbangluongnam`, `dieukienxetnangluong`); thân hộp là PHẦN TỬ; nằm trong vùng `extra` của biểu mẫu crud → biểu mẫu con | **xong 30/9** |

## Đăng ký học — 46 hộp: 4 BM, 8 ?, 34 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `kehoachdangkymuabaohiem/script/kehoachmua.js:268` | Loại khoản và đơn giá | "Xem chi tiết" trên dòng kế hoạch | `Pr_TC_KH_MH_DG_Them·Sua` | `root` | hộp chứa cả một `ums.crud({ embedded })` → đưa khối crud con ra trang | **xong 30/9** |
| `thilai/script/_tl_vung.js:115` | Phí | "Thêm" + nút bút khung Phí | `Them·Sua_DangKy_Thi_Hp_Kh_MucPhi` | `host` của `T.vungPhi` | — | **xong 30/9** |
| `thilai/script/_tl_hop.js:116` · `:187` | Thêm (lớp học phần / lớp quản lý sử dụng) | "Thêm" ở chân hộp danh sách `hopDs` (:89) | `Them_DangKy_Thi_LopHocPhan` / `…_LopQuanLy` | (mở từ hộp `hopDs`) | hộp lồng trong hộp: phải đưa cả danh sách `hopDs` ra trang trước | **xong 30/9** |
| `kehoachdangky/script/_khdk_xuly.js:72` | Thiết đặt thêm xử lý lớp HP | nút trên dòng kế hoạch | `Pr_DangKy_KH_LopHp_DacThu_Ins` / `_Del` | màn `kehoachdangky.js` | **?** lưới nhập bản ghi con (thêm lớp, chọn xử lý, Lưu); dùng `xoa:` ở chân + hộp chọn lồng | **xong 30/9** |
| `kehoachdangkymuabaohiem/script/kehoachmua.js:471` | Thêm mới phạm vi đối tượng | "Thêm mới" trong hộp phạm vi | lô `Pr_TC_KH_MH_PV_Them` | (hộp lồng) | **?** chọn phạm vi rồi lưu | giữ (hộp CHỌN) |
| `nganh2/script/kehoach.js:395` | Giới hạn | "Thêm" vùng Giới hạn | lô `Them_QLSV_DangKy_Nganh_GioiHan` | `elCt` | **?** chọn lớp + đánh dấu chương trình | giữ (hộp CHỌN) |
| `kehoachdangky/script/_hp.js:216` | Rút học phần / áp phí | "Thực hiện" | N lời | `root` | **?** xác nhận kèm % và ghi chú từng dòng | giữ (hộp XÁC NHẬN) |
| `kehoachdangky/script/_lhp_hop.js:176` · `:256` · `:295` | Danh sách sinh viên / Thuộc tính tính khối lượng / Chế độ tính phí | nút trên dòng + thanh công cụ | N lời | `root` của `lophocphan.js` | **?** ×3 đặt một giá trị cho các dòng đã đánh dấu | giữ (THAO TÁC HÀNG LOẠT) |
| `kehoachdangky/script/quanlytoanbo.js:219` | Chuyển lớp | nút sau khi đánh dấu SV | N lời `ThucThi_ChuyenLop_TrucTiep` | `root` | **?** | giữ (THAO TÁC HÀNG LOẠT) |

## Kế hoạch chương trình — 11 hộp: 2 BM, 3 ?, 6 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `chuongtrinhhocphan/script/cthp.js:375` | Sửa thời gian | ô / nút trong dòng học phần | `Sua_DaoTao_ThoiGian_KH_CT` | `V` / `root` | một ô; nút Lưu không trả false → lưu lỗi là mất ô đang nhập | **xong 30/9** |
| `tochucchuongtrinh/script/_dinhhuong.js:351` | Nhóm | "Thêm" + nút bút bảng nhóm | `Them·Sua_DaoTao_CT_DH_Nhom` | `dz('nhom')` | bản ghi con; thân đã tự bọc lưới → `cols: 1` | **xong 30/9** |
| `chuongtrinhhocphan/script/cthp.js:418` | Thứ tự học phần | nút thanh công cụ | `Sua_DaoTao_HocPhan_CT_ThuTu` (ô đã đổi) | `V` / `root` | **?** lưới sửa một cột của nhiều bản ghi; có `keydown` + kiểm `dlg.closed` | **xong 30/9** |
| `chuongtrinhhocphan/script/cthp.js:401` | Sửa thời gian (nhiều học phần) | nút sau khi đánh dấu | lô cùng lời gọi | `V` / `root` | **?** | giữ (THAO TÁC HÀNG LOẠT) |
| `lophoc/script/lophoc.js:238` | Phân nhóm lớp | nút sau khi đánh dấu lớp | N lời | `root` | **?** | giữ (THAO TÁC HÀNG LOẠT) |

## Tuyển sinh — 24 hộp: 9 BM (5 là MÀN CON trong hộp), 2 ?, 13 PHU

"Màn con" = hộp chứa cả danh sách + biểu mẫu (đa số `ums.crud({ embedded: true })` dựng trong thân hộp). Chuẩn: màn con cũng mở TRONG TRANG
(`pat.formTrang` với thân là vùng chứa màn con, không có nút ngoài "Đóng").

| Tệp:dòng (`tuyensinh/script/`) | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `_khtsc_dot.js:145` | Lớp dự kiến | "Thêm mới" + nút bút | `Them_·Sua_TS_Dot_DoiTuong_LopHoc` | `host` của `K.dot` (đã là vùng thay chỗ) | dễ: 2 ô | **xong 30/9** |
| `_khtsc_cauhinh.js:132` · `:240` | Trường thông tin (Mẫu / Cấu trúc hiển thị) | "Thêm mới" | `Them_TS_HoSo_MoRong` / `Them_TS_CauTrucHienThiHoSo` | `host` | dễ: 1–2 ô | **xong 30/9** |
| `_khtsn_dot.js:32` (`T.moDot`) | Các đợt tuyển sinh | "Xem" cột Đợt | `Pr_Ts_Kh_Ts_Dot_Ins·Upd·Del` | `root` | MÀN CON; từ đây mở tiếp 4 hộp → chuyển cả cụm | **xong 30/9** |
| `_khtsn_daura.js:68` (`T.moDauRa`) | Kế hoạch đầu ra | "Xem" (dòng kế hoạch + dòng đợt) | `Pr_Ts_Kh_Dau_Ra_*` | `root` | MÀN CON; hai lối vào | **xong 30/9** |
| `_khtsn_kqdk.js:224` (`T.moKQDK`) | Kết quả đăng ký | nhiều lối | `Them_·Sua_·Xoa_HoSo_TS` | `root` | MÀN CON lớn nhất; trạng thái ở biến `Q` bám `Q.dlg` / `Q.body`; `_khtsn_khai.js`, `_khtsn_import.js` cùng bám | **xong 30/9** |
| `_khtsn_qdhs.js:31` (`T.moQDHS`) | Khai danh mục hồ sơ giấy tờ | "Khai" trên dòng đợt | `Them_·Sua_·Xoa_TS_QuyDinhHoSo` | `B = dlg.body` | lưới nhập nhiều dòng; lồng trong `moDot` | **xong 30/9** |
| `_khtsn_phancong.js:29` | Phân công nhân sự | "Xem" cột Nhân sự | `Pr_Ts_Kh_Ns_PhanCong_*` | — | đi qua `ums.khts.phanCong` của Nhập học | **xong 30/9** |
| `xettuyen.js:524` | Ngành xét tuyển | nút thanh công cụ | lô `Sua_TS_KeHoachXet_ChiTieu` | `root` | lưới sửa hàng loạt 2 ô / dòng | **xong 30/9** |
| `_khtsc_dot.js:300` | Tổ hợp ngành nghề | nút mắt trên dòng ngành | Xoá ở chân; thêm qua hộp chọn :343 | `host` | **?** quản lý bảng con (danh sách + thêm + xoá) | **xong 30/9** |
| `_khtsc_dot.js:255` | Ngành nghề | "Thêm mới" khung Ngành nghề | lô `TS_Dot_DT_NganhNghe/ThemMoi` | `host` | **?** chọn từ danh mục + mã từng dòng | giữ (hộp CHỌN) |

## Nhập học — 23 hộp: 3 BM (2 là MÀN CON), 3 ?, 17 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `trungtuyen/scripts/_khts.js:211` (`K.phanCong`) | Bố trí / Phân công nhân sự | "Xem" cột nhân sự | `cfg.them·sua·xoa` | `root` | MÀN CON; dùng chung Nhập học + Tuyển sinh — sửa một chỗ được cả hai | **xong 30/9** |
| `taichinh/scripts/_kmp_cauhinh.js:55` (`K.khoanThu`) | Cấu hình các khoản thu của nhóm | nút trên dòng nhóm | `Them_·Sua_·Xoa_NhapHoc_CauHinh_TC` | `root` | MÀN CON | **xong 30/9** |
| `taichinh/scripts/_kmp_cauhinh.js:363` | Thêm mới đối tượng | trong hộp `K.dauVao` | `Them_NH_CauHinh_TC_Nhom_DT` | hộp cha | lồng trong hộp | **xong 30/9** |
| `taichinh/scripts/_kmp_cauhinh.js:206` · `:308` | Cấu hình ngành đầu ra / Trường hợp đầu vào | nút trên dòng nhóm | xoá nhiều; thêm qua hộp chọn | `root` | **?** ×2 quản lý bảng con | **xong 30/9** |
| `quydinh/scripts/hoso.js:161` | Phân quyền | nút thanh công cụ | N lời `Them_NhapHoc_QuyDinhHoSo_Quyen` | `root` | **?** gán quyền bằng ô đánh dấu | giữ (hộp CHỌN) |

## Tài chính — 50 hộp (chưa tính 11 màn lưới nhập đã chuyển 30/9): 15 BM, 2 ?, 33 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `danhmucheso/scripts/_chung_a.js` (`A.dvp`), `_chung_b.js` (`B.mucPhi`), `hocphansotienmoi.js`, `hesohocphanmoi.js`, `apdungcongthucphi.js` | Thêm / Sửa đơn vị phí, mức phí, số tiền, hệ số, công thức | "Thêm mới" + nút bút ô lưới | — | `root` | 11 màn | **xong 30/9** |
| `danhmucheso/scripts/hesohocphan.js:295` · `hesolophocphan.js:305` · `hocphansotien.js:288` | Hệ số học phần / Hệ số lớp học phần / Học phần số tiền | nút bút ô bảng xoay | `…/CapNhat` | `root` | qua `A.dialog` → đổi `A.form` + `host: root` | **xong 30/9** |
| `danhmucheso/scripts/mucdonviphi.js:228` | Mức đơn vị phí | nút bút ô bảng xoay | `TC_DonViPhi_SoTien/CapNhat` | `root` | thân là phần tử; giữ `inp.focus()` | **xong 30/9** |
| `danhmucheso/scripts/sothangkhonghoc.js:289` | Sinh viên - tháng không học | `onEdit` lưới | `saveCall` + Xoá | `root` | thân là phần tử; Thêm đã trong trang | **xong 30/9** |
| `khaidonviphi/scripts/_chung.js:193` | Thêm / Sửa đơn vị phí | "Thêm mới" + `onEdit` | `TC_DonViPhi_SoTien/*` | `cfg.root` | qua `M.formDialog`; 2 màn `donviphikhoa`, `donviphilop` | **xong 30/9** |
| `miengiam/scripts/mucmiengiammoi.js:163` · `_doituong.js:266` · `_svmien.js:197` | Định mức miễn giảm / ô bảng xoay đối tượng / SV miễn giảm | "Thêm" + `onEdit` | `TC_MucMienGiam/*`, `TC_DoiTuong_*`, `TC_SoTienMien/*` | `cfg.root` | đều qua `M.formDialog` (`miengiam/scripts/_chung.js:181`) — đổi MỘT chỗ + 4 nơi gọi truyền `host` là được 7 màn; sửa chú thích "BO-CUC cho phép hộp thoại" | **xong 30/9** |
| `giahanthu/script/kehoach.js:380` | Thêm Khoản thu - thời gian | "Thêm dòng mới" khung chi tiết kế hoạch | `Them_TaiChinh_KeHoach_Khoan` (mỗi khoản một lời) | `elMain` | bản ghi con; nhánh lưu không trả false | **xong 30/9** |
| `baocao/scripts/baocao.js:594` | Cấu hình năm tài chính | nút thanh công cụ | `Them_TaiChinh_Nam_Thang_BC`, `…_Nam_BaoCao`, Xoá | `root` | MÀN CON (bảng + thêm dòng + lưu + xoá) | **xong 30/9** |
| `baocao/scripts/baocao.js:809` | Khai báo mã khách hàng | nút thanh công cụ | `Them_TC_BC_KyHieu_KhoaNganh`, Xoá | `root` | MÀN CON; dùng `xoa:` ở chân; mở hộp chọn hệ – khoá (:861, giữ) | **xong 30/9** |
| `phieuthu/scripts/thutienkhac.js:1077` · `:1109` | Khoản phải nộp / Khoản đã nộp | nút Sửa bảng chi tiết | `TC_KhoanPhaiNop/CapNhat`, `TC_KhoanDaNop/CapNhat` | `root` | bảng chi tiết nằm TRONG hộp `PK.tinhHinh` (`_chung_khac.js:269`) → lồng hộp; bỏ `dropdownParent: jQuery(dlg.el)` | **xong 30/9** |
| `phieuthu/scripts/_chung_thutien.chitiet.js:304` | Chỉnh sửa khoản phải nộp / miễn / đã nộp / rút | nút Sửa trong bảng | `TC_ThongTin/Sua_TaiChinh_*` | `c.root` | mở từ hộp chi tiết (:211) VÀ từ tab 8 trong trang | **xong 30/9** |
| `baocao/scripts/baocao.js:563` | Tạo chứng từ | nút sau khi đánh dấu dòng | lô `CapNhatDuLieuNhomAPI` | `root` | **?** một số chứng từ cho N dòng đã chọn | giữ (THAO TÁC HÀNG LOẠT) |
| `giahanthu/script/kehoach.js:626` | Chế độ | nút thanh công cụ | `CapNhatThamSoChanThanhToan` | `elMain` | **?** một tham số toàn hệ thống | giữ (thao tác cấu hình một ô) |

## Xử lý học vụ — 6 hộp: 3 BM, 3 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `kehoachxuly/script/_khxl_dieukien.js:140` | Xâu điều kiện | nút bút trong dòng | `Sua_XLHV_DieuKien*_AD` + Xoá | `zone` | `ums.khxl` còn được QLD, Học bổng nạp chéo | **xong 30/9** |
| `raquyetdinh/script/raquyetdinh.js:87` | Nhập mới quyết định | nút `taoqd` | `Them_QLSV_QuyetDinh` | `root` | — | **xong 30/9** |
| `thuchienxulyhocvu/script/_ketqua.js:181` (`K.hopDoiMuc`) | Thay đổi mức cảnh cáo | nút sửa trong dòng | `XLHV_KetQuaXuLy/CapNhat` | chưa có — thêm tham số | thân là phần tử; gọi từ `tracuuketqua.js:85`, `_xlhv.js:93` | **xong 30/9** |

## Chuyên cần (1), Học lại thi lại (2), Học bổng (8), Rèn luyện (0)

Không có hộp thêm / sửa bản ghi nào — toàn bộ là xác nhận, danh sách, kế thừa. Giữ.

## Cổng cán bộ — 84 hộp: 12 BM + 7 lưới / màn con, 7 ?, 58 PHU

| Tệp:dòng | Hộp | Mở từ | Lời gọi ghi | Vùng gốc | Ghi chú khi chuyển | Tình trạng |
|---|---|---|---|---|---|---|
| `hoatdong/script/dukienhocphan.js:155` | Thời gian đề xuất | nút trong ô bảng dự kiến | `Sua_KH_HocPhan_DuKien` | `root` | một ô; nút không trả false | **xong 30/9** |
| `hoatdong/script/_qhht_hoso.js:32` (`qhht.moHoSo`) | Hồ sơ sinh viên | nút Xem trong dòng | `UpdateCorePerson`, `*_Person_Profile`, quá trình | `root` (`DaQHHT.js:39`) | MÀN CON lớn (tổng quan, bảng điểm, chỉnh sửa hồ sơ); Sinh viên `hoso/DaQHHT` nạp chung | **xong 30/9** |
| `hoatdong/script/phangiangvien.js:135` | Phân giảng viên | "Chi tiết" trong ô | `Them_·Xoa_KH_PhanCong_GiangVien_TH` | `root` | lưới + Thêm (mở `pickNhanSu`) + Xoá + Lưu | **xong 30/9** |
| `phanlichgiang/script/_moigiang.js:30` (`plg.moiGiang`) | Tìm kiếm nhân sự ngoài trường | nút đầu trang | `Them_NhanSu_HoSo_v2` | `root` của `plg.man` | MÀN CON (tìm + biểu mẫu + bảng); KHCT nạp chung | **xong 30/9** |
| `khaosat/script/phieu.js:209` | Nhóm câu hỏi | "Thêm nhóm" + bấm tên nhóm | `Them_·Sua_·Xoa_KS_NhomKhaoSat` | vùng soạn phiếu | host là vùng soạn phiếu, không phải cả `root`; màn gán `dlg._f` | **xong 30/9** |
| `lichgiang/script/lichgiangphonghoc.js:143` | Đăng ký sử dụng phòng | nút đầu trang | `Pr_Tkb_Dk_Phong_Tg_Ins` | `root` | hai nút (kiểm trùng, gửi) | **xong 30/9** |
| `lichgiang/script/_lichgiang_doilich.js:133` (`lg.doiLich.khoiTao`) | Yêu cầu đổi lịch | "Đổi lịch" trên buổi; ô trống lưới phòng | `GuiYeuCauDoiLich` | chưa có — thêm tham số | 3 màn dùng chung; có `onClose` | **xong 30/9** |
| `lichgiang/script/_lichgiang_cacbuoi.js:31` (`lg.xemCacBuoi`) | Các buổi học theo thời khoá biểu | "Các buổi" trên lớp | `CC_NguoiHoc_ChuyenCan/ThemMoi`… | chưa có — thêm tham số | MÀN CON (bảng điểm danh + danh sách buổi); `o.chiXem` thì chỉ đọc → khi đó GIỮ hộp | **xong 30/9** |
| `luanvan/script/_hoidong.js:157` · `:174` | Lập hội đồng mới / Thành viên hội đồng | nút trong khung chi tiết | `Them_BV_HoiDong`, `Them_·Sua_BV_KeHoach_NH_GiaoDT_BV` + tệp | `khung.host` | — | **xong 30/9** |
| `luanvan/script/_detai.js:41` + `:63` | Danh sách đề tài (kho) + Đề tài | "Thêm đề tài" đầu trang; Thêm / bút trong kho | `Them_·Sua_·Xoa_BV_KeHoach_DeTai` | `ctx.root` | MÀN CON + biểu mẫu lồng → đưa cả kho ra trang | **xong 30/9** |
| `luanvan/script/_detai.js:140` · `:165` | Người hướng dẫn / Giao đề tài | nút trong dòng + đầu khung | `Sua_·Them_BV_KH_NG_GiaoDeTai` | `khung.host` | :165 lưu xong ở lại để giao tiếp | **xong 30/9** |
| `luanvan/script/_luanvan.js:292` (`L.hopQuyetDinh`) | Tạo quyết định | nút "QĐ" trong dòng | (nút Lưu đang khoá) | `khung.host` | **?** hình dạng biểu mẫu, chưa ghi gì | **xong 30/9** |
| `thi/script/_chung.js:69` + `:98` (`thi.canBo`) | Cán bộ coi / chấm thi + Danh sách nhân sự sẽ phân | "Phân công" sau khi chọn dòng | `o.them`, `o.xoa` | chưa có — thêm tham số | **?** MÀN CON quản lý bảng con (thêm = chọn nhân sự, xoá) + lưới thứ tự / số lượng; 5 màn | **xong 30/9** |
| `nhapdiem/script/tuibai.js:74` | Đánh túi bài thi của đợt phách | nút mở trong dòng | `CapNhat_DiemPhachTheoTuiBai` | `root` | MÀN CON nhập điểm; có `onClose`; mã tìm `id="tblTuiThi"` | **xong 30/9** |
| `nhapdiem/script/_dst.js:147` | Thông tin danh sách thi | nút mở trong dòng | `CapNhat_DiemPhachTheoDST` | `root` của `nd.dst` | MÀN CON nhập điểm; mở `nd.viPham` lồng (giữ) | **xong 30/9** |
| `klgd/script/thanhtoangiangday.js:94` | Chi tiết thanh toán | nút chi tiết trong dòng | `CapNhatTienDaThanhToan`, `DeleteTienThanhToan` | `root` | lưới 3 ô / dòng; dùng `xoa:` | **xong 30/9** |
| `klgd/script/_dinhmuc.js:108` | Thông tin quá trình | nút chi tiết trong dòng | `UpdateDinhMuc`, `UpdateMienGiam`… | `root` của `K.dinhMucMG` | MÀN CON ba bảng con; 2 màn | **xong 30/9** |
| `klgd/script/_nhapkl.js:39` (`K.themLop`) | Thêm lớp | "Thêm" | `UpdateKhoiLuong_Nhap` | chưa có — thêm tham số | ~22 ô; "Lưu và Nhập tiếp" | **xong 30/9** |
| `thoikhoabieusinhvien/script/_lichhocsv.js:139` | Học phần: … (buổi học) | bấm một buổi trên lịch | `Them_QLSV_NguoiHoc_TuGhiNhan` | `root` | **?** xem danh sách lớp + một ô từ khoá điểm danh | giữ (hộp XEM) |
| `coithi/script/coithi.js:186` | Xử lý tình huống thi | nút sau khi chọn thí sinh | `XulyTinhHuongThi`… | `host` | **?** | giữ (THAO TÁC trên dòng đã chọn) |
| `klgd/script/_phancong.js:150` · `_tachlop.js:248` | Thực hiện phân giảng | nút "BM khác" / nút trong dòng | `PhanCongGiangDay`, `CapNhatPhanCongBMKhac` | `root` | **?** ×2 chọn Bộ môn → Giảng viên | giữ (hộp CHỌN) |
