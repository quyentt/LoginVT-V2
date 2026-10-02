# Sổ cần quyết — đã chốt

Các mục đã gỡ khỏi `assets/js/can-quyet.js` kèm quyết định. Muốn mở lại một mục thì chép câu hỏi về sổ.

## Chốt ngày 2026-09-24 — theo phương án tạm (người dùng giao)

327 mục.

### apiscongcanbo/modules/coithi/chamthituluan

- **[Kiểm trên host]** "Thực hiện tác vụ" Mở/Đóng phòng thi chưa từng chạy ở bản gốc (gọi hàm không tồn tại) — bản mới gọi ThaoTacPhongThi_PhongThi_GST như màn Coi thi. Thử trên host; màn chấm thi có nên được mở/đóng phòng không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Công nhận điểm tự luận: gốc so với MARK và đọc ô theo STUDENTEXAMROOMPARTID (lệch với ô đang hiện) — bản mới so với MARKTULUAN đang hiện, strId như gốc. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/coithi/coithi

- **[Cần quyết]** Công nhận điểm: bản mới lưu cả dòng chỉ đổi ghi chú và nạp lại sau khi lưu (gốc bỏ qua / không nạp lại). Đúng ý không?
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** "Chi tiết bài thi" chưa làm ở bản gốc (hàm dừng ngay dòng đầu). Có cần làm không?
  - → Làm như hiện tại: Giữ nút, đang khoá.

### apiscongcanbo/modules/coithi/duyetdiemthitracnghiem

- **[Cần quyết]** Bảng thí sinh ở bản gốc có ô nhập Điểm công nhận / Ghi chú nhưng KHÔNG có nút lưu — bản mới hiện dạng chữ. Có cần cho sửa điểm ở bước duyệt không?
  - → Làm như hiện tại: Chỉ xem.
- **[Cần quyết]** Học kỳ → Đợt thi nay khoá theo luật cha → con (gốc cho chọn đợt thi khi chưa chọn học kỳ). Đồng ý?
  - → Làm như hiện tại: Đang khoá.

### apiscongcanbo/modules/coithi/gv-5-quanlythi-01

- **[Cần quyết]** Bản gốc chỉ là trang HTML MẪU tĩnh (không mã nghiệp vụ, không gọi API), trùng bố cục với "Giám sát thi". Giữ mục menu này (trùng màn) hay gỡ?
  - → Làm như hiện tại: Mục menu mở CHÍNH màn "Giám sát thi" đã chuyển (dữ liệu thật). Cột "Tình trạng (Ẩn/Hiện)" / nút "Sửa" của mẫu GV-5 không có API nên không có.

### apiscongcanbo/modules/coithi/gv-7-pheduyetdiem

- **[Cần quyết]** Bản gốc chỉ là trang HTML MẪU tĩnh (không mã nghiệp vụ, không gọi API), trùng bố cục với "Duyệt điểm thi trắc nghiệm". Giữ mục menu này (trùng màn) hay gỡ?
  - → Làm như hiện tại: Mục menu mở CHÍNH màn "Duyệt điểm thi trắc nghiệm" đã chuyển (dữ liệu thật). Cột "Tình trạng (Ẩn/Hiện)" / nút "Sửa" của mẫu GV-5 không có API nên không có.

### apiscongcanbo/modules/dashboard/dashboard

- **[Cần quyết]** Khối "Bạn bè" và "Dịch vụ" bản gốc chỉ có tiêu đề (nội dung bị chú thích bỏ, không có lời gọi API) → bản mới không vẽ. Có cần hai khối này (cần nguồn dữ liệu)?
  - → Làm như hiện tại: Không vẽ.
- **[Kiểm trên host]** Lối tắt lấy ảnh từ CHUCNANG_TENANH: nếu là lớp Font Awesome thì vẽ biểu tượng, nếu là đường dẫn ảnh tương đối thì thêm "../" (bản mới nằm trong _v2/). Kiểm ảnh lối tắt / logo trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Bấm một tin mở chức năng có mã hiển thị "#tintuc" — vai trò phải được cấp chức năng đó (như gốc). Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/dashboardv2/bgh

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Bộ lọc Năm học / Bậc đào tạo không làm đổi số liệu (gốc để TODO). Giữ, bỏ, hay chờ API?
  - → Làm như hiện tại: Giữ như gốc — Áp dụng chỉ vẽ lại.

### apiscongcanbo/modules/dashboardv2/giang-vien

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").

### apiscongcanbo/modules/dashboardv2/giao-vu-khoa

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Màu "Nguy cơ học vụ" ở biểu đồ cột chồng là XANH LÁ (như gốc). Đổi sang đỏ?
  - → Làm như hiện tại: Giữ như gốc.

### apiscongcanbo/modules/dashboardv2/lanh-dao-khoa

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Bộ lọc Năm học / Ngành không làm đổi số liệu (gốc chỉ có TODO). Khi nối API có cần số liệu theo bộ lọc?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** "SV đang học" / "SV tốt nghiệp" có 7 / 6 giá trị cho 5 năm (chỉ vẽ 5 điểm đầu). Dải năm đúng là bao nhiêu?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Chú giải có Kịch bản 3 "Mở rộng nhanh" và 4 "Tắc nghẽn đầu ra" nhưng phần phân tích chỉ tính kịch bản 1, 2 (như gốc). Luật cho kịch bản 3, 4?
  - → Giữ như bản gốc (chỉ tính kịch bản 1, 2).

### apiscongcanbo/modules/dashboardv2/lanh-dao-phong-ctsv

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Hai biểu đồ hoạt động / học bổng có trong mã gốc nhưng html đang dùng không có chỗ vẽ (bản nháp cũ script/lanh-dao-phong-ctsv.html có) → không vẽ. Có cần hai biểu đồ này?
  - → Làm như hiện tại: Không vẽ, như html gốc.

### apiscongcanbo/modules/dashboardv2/lanh-dao-phong-dt

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Bộ lọc không làm đổi số liệu (như gốc). Có cần số liệu theo bộ lọc?
  - → Làm như hiện tại: Giữ như gốc. Khoa → Ngành nay khoá theo luật cha → con (gốc hiện ngành CNTT cả khi chọn "Toàn trường").

### apiscongcanbo/modules/dashboardv2/lanh-dao-phong-khao-thi

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Bộ lọc không làm đổi số liệu (gốc chỉ ghi console). Có cần số liệu theo bộ lọc?
  - → Làm như hiện tại: Giữ như gốc.

### apiscongcanbo/modules/dashboardv2/lanh-dao-phong-tckt

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").
- **[Cần quyết]** Bộ lọc không làm đổi số liệu; KPI ghi cứng "năm 2024 / so với 2023" không theo ô Năm học. Xác nhận khi nối dữ liệu thật.
  - → Làm như hiện tại: Giữ như gốc.

### apiscongcanbo/modules/dashboardv2/sinh-vien

- **[Cần quyết]** Bản gốc là trang MẪU TĨNH: mọi số liệu viết cứng trong mã, KHÔNG có lời gọi API, biểu đồ nạp Chart.js 2.9 từ CDN. Gỡ khỏi menu, hay dựng thật (cần danh sách API / procedure cho từng chỉ số)?
  - → Làm như hiện tại: Chuyển nguyên TRANG MẪU: cùng bộ lọc, KPI, biểu đồ, bảng; số liệu vẫn sinh bằng mã như gốc (đầu trang ghi "Trang mẫu — số liệu dựng thử").

### apiscongcanbo/modules/dgplnguoilaodong/ketqua

- **[Cần quyết]** Tệp gốc là đoạn thử CSRF ("You Are a Winner!"), không phải màn. Gỡ khỏi menu? Nên xoá luôn tệp gốc trên host.
  - → Làm như hiện tại: KHÔNG chép đoạn đó — chỉ hiện khung báo "chưa có nội dung".

### apiscongcanbo/modules/dgplnguoilaodong/phieudanhgia

- **[Kiểm trên host]** Bản gốc chưa từng chạy (lỗi JS ngay khi mở) — bản mới làm theo ý định, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/dgplnguoilaodong/phieudanhgiacanbo

- **[Kiểm trên host]** Bản gốc chưa từng chạy (lỗi JS ngay khi mở) — bản mới làm theo ý định, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/danhmucdinhmuc

- **[Cần quyết]** Lưu xong bản mới quay về danh sách (gốc giữ hộp mở, bấm "Cập nhật" lần nữa là SỬA bản ghi vừa thêm). Đồng ý?
  - → Làm như hiện tại: Về danh sách.

### apiscongcanbo/modules/klgd/danhmucmiengiam

- **[Cần quyết]** Lưu xong bản mới quay về danh sách (gốc giữ hộp mở, bấm "Cập nhật" lần nữa là SỬA bản ghi vừa thêm). Đồng ý?
  - → Làm như hiện tại: Về danh sách.
- **[Cần quyết]** Thêm mới gốc KHÔNG đặt lại hai ô "Kiểu" (giữ giá trị lần sửa trước) → nay để trống bắt chọn. Đồng ý?
  - → Làm như hiện tại: Bắt chọn.

### apiscongcanbo/modules/klgd/dinhmucmiengiam

- **[Cần quyết]** Dòng thêm mới (định mức / miễn giảm / đơn giá) xoá trắng sau khi thêm; nút thêm đơn giá gốc báo nhầm "Bạn chưa chọn miễn giảm" → nay "đơn giá".
  - → Làm như hiện tại: Đã sửa.
- **[Kiểm trên host]** Nút "Chi tiết" bản gốc CHƯA TỪNG chạy (tra dòng theo cột ID trong khi nút mang STAFFID → lỗi JS, ba bảng không nạp, không thêm được) → nay tra theo STAFFID như bản QL. Đường GHI mới — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** GetDonGia gửi năm dưới tên "Nienhoc" (như gốc) — kiểm procedure.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/donvigiangvien

- **[Cần quyết]** Đổi năm học nay xoá đơn vị đang chọn + bảng giảng viên (gốc giữ → "Thêm mới" được vào đơn vị của năm cũ). Đồng ý?
  - → Làm như hiện tại: Xoá khi đổi năm.
- **[Cần quyết]** Ô Học hàm / Học vị bản gốc sửa được nhưng KHÔNG có nút lưu → bản mới khoá (chỉ xem). Có cần lưu học hàm/học vị ở màn này (như bản QL)?
  - → Làm như hiện tại: Chỉ xem.

### apiscongcanbo/modules/klgd/duyetdulieutach

- **[Cần quyết]** Phân giảng (PC) một lớp tách nay BẮT chọn giảng viên (gốc gửi được rỗng); lưu xong đóng hộp.
  - → Làm như hiện tại: Bắt chọn.
- **[Cần quyết]** Nhãn "tổng tối đa" gốc lấy dòng ĐẦU bảng trái (không phải lớp đang chọn) → nay lấy đúng lớp. Dòng tổng KHÔNG cộng Sỹ số (như gốc) — có cần cộng?
  - → Làm như hiện tại: Không cộng.
- **[Cần quyết]** Nút "Không duyệt" gốc giống hệt nút Duyệt (chữ hỏi, màu, biểu tượng) → nay có chữ / màu riêng.
  - → Làm như hiện tại: Đã tách.

### apiscongcanbo/modules/klgd/khoiluongnckh

- **[Cần quyết]** strHocKy gốc đọc ô KHÔNG tồn tại → luôn rỗng; bản mới gửi rỗng. Có cần lọc theo học kỳ không?
  - → Làm như hiện tại: Gửi rỗng.

### apiscongcanbo/modules/klgd/phanconggiangday

- **[Cần quyết]** Ô cha → con khoá theo luật (Năm → Kỳ → Đợt, Hệ → Khoá, Năm → Bộ môn → Giảng viên); bảng nạp SAU khi đã nạp lại ô con (gốc nạp song song → theo giá trị cũ).
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Ô "chọn tất cả" của bảng trong hộp "Phân công BM khác" gốc trùng id → tích nhầm bảng "chưa phân công". Bản mới tích đúng bảng.
  - → Làm như hiện tại: Đã sửa.

### apiscongcanbo/modules/klgd/qlklgd_danhmucdinhmuc

- **[Cần quyết]** Lưu xong bản mới quay về danh sách (gốc giữ hộp mở, bấm "Cập nhật" lần nữa là SỬA bản ghi vừa thêm). Đồng ý?
  - → Làm như hiện tại: Về danh sách.

### apiscongcanbo/modules/klgd/qlklgd_danhmucmiengiam

- **[Cần quyết]** Lưu xong bản mới quay về danh sách (gốc giữ hộp mở, bấm "Cập nhật" lần nữa là SỬA bản ghi vừa thêm). Đồng ý?
  - → Làm như hiện tại: Về danh sách.

### apiscongcanbo/modules/klgd/qlklgd_dinhmucmiengiam

- **[Cần quyết]** Dòng thêm mới (định mức / miễn giảm / đơn giá) xoá trắng sau khi thêm; nút thêm đơn giá gốc báo nhầm "Bạn chưa chọn miễn giảm" → nay "đơn giá".
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** Xoá miễn giảm gửi strNguoiDungId, hai loại xoá kia gửi strNguoiThucHienId (lệch như gốc). Giữ?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Bảng trong hộp nạp danh mục MỘT lần cho mọi dòng (gốc mỗi dòng một lời gọi → ô chưa nạp kịp bị coi là "đã đổi" và gửi rỗng).
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** Nút Import gốc ghi "Import khối lượng" nhưng mở hộp import định mức / miễn giảm / đơn giá → nay ghi "Import". Import xong nạp lại bảng (gốc không).
  - → Làm như hiện tại: Như trên.

### apiscongcanbo/modules/klgd/qlklgd_dongia

- **[Cần quyết]** Lưu xong bản mới quay về danh sách (gốc giữ hộp mở, bấm "Cập nhật" lần nữa là SỬA bản ghi vừa thêm). Đồng ý?
  - → Làm như hiện tại: Về danh sách.
- **[Kiểm trên host]** Ô "Hình thức giảng" gốc mang value = TÊN (NAME) nhưng khi sửa đặt theo HINHTHUCGIANGDAYID (không bao giờ khớp → lưu lại là mất). Bản mới gửi ID (cột ID của GetHinhThucGiang). Đúng tham số strHinhThucGiangId cần ID?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Thêm và sửa dùng CHUNG action CapNhatDonGia (strId rỗng = thêm) như gốc.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/qlklgd_donvigiangvien

- **[Cần quyết]** Đổi năm học nay xoá đơn vị đang chọn + bảng giảng viên (gốc giữ → "Thêm mới" được vào đơn vị của năm cũ). Đồng ý?
  - → Làm như hiện tại: Xoá khi đổi năm.
- **[Cần quyết]** Cập nhật học hàm/học vị chỉ gửi dòng ĐÃ ĐỔI, báo đúng kết quả (gốc báo "thành công" trước khi xong). Dòng đã chốt vẫn sửa được (như gốc) — có cần khoá dòng đã chốt?
  - → Làm như hiện tại: Không khoá.

### apiscongcanbo/modules/klgd/qlklgd_duyetdulieutach

- **[Cần quyết]** Phân giảng (PC) một lớp tách nay BẮT chọn giảng viên (gốc gửi được rỗng); lưu xong đóng hộp.
  - → Làm như hiện tại: Bắt chọn.
- **[Kiểm trên host]** Xoá lớp tách ở bản gốc CHƯA TỪNG CHẠY (biến chưa khai báo → lỗi JS) → nay làm theo bản tách lớp QL. Đường GHI mới — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Không ô lọc nào tự nạp bảng — phải bấm "Danh sách" (như gốc).
  - → Làm như hiện tại: Như gốc.

### apiscongcanbo/modules/klgd/qlklgd_hesolopdong

- **[Cần quyết]** Lưu xong bản mới quay về danh sách (gốc giữ hộp mở, bấm "Cập nhật" lần nữa là SỬA bản ghi vừa thêm). Đồng ý?
  - → Làm như hiện tại: Về danh sách.
- **[Kiểm trên host]** Thêm và sửa dùng CHUNG action CapNhatHeSoLopDong (strId rỗng = thêm) như gốc — kiểm procedure phân biệt được.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/qlklgd_nhapkhoiluong

- **[Cần quyết]** Đổi ô lọc thì XOÁ bảng, bấm "Danh sách" mới nạp (như gốc). Cập nhật chỉ gửi dòng đã sửa; TRONGTRUONG rỗng không còn bị coi là "đã sửa".
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Danh sách GetKhoiLuongNhap gốc KHÔNG gửi Năm học và Kiểu lớp (hai ô đó chỉ xoá bảng) — giữ. Có cần lọc theo hai ô này?
  - → Làm như hiện tại: Không gửi (như gốc).
- **[Cần quyết]** Cập nhật gốc gửi strHeSoTinChi từ ô KHÔNG có trên lưới (luôn rỗng → xoá hệ số) → bản mới gửi lại giá trị của dòng. Đồng ý?
  - → Làm như hiện tại: Gửi giá trị dòng.
- **[Cần quyết]** Thêm lớp gửi strHeSoTinChi "1.1" CỨNG (như gốc). Đúng?
  - → Làm như hiện tại: Giữ 1.1.
- **[Cần quyết]** Thêm lớp: "Lưu" đóng hộp; "Lưu và Nhập tiếp" xoá ô số liệu để thêm lớp khác (gốc: Lưu lần 2 là SỬA lớp vừa thêm). Chưa chọn đợt thì gửi rỗng (gốc gửi chữ "Chọn đợt").
  - → Làm như hiện tại: Như trên.

### apiscongcanbo/modules/klgd/qlklgd_phanconggiangday

- **[Cần quyết]** Ô cha → con khoá theo luật (Năm → Kỳ → Đợt, Hệ → Khoá, Năm → Bộ môn → Giảng viên); bảng nạp SAU khi đã nạp lại ô con (gốc nạp song song → theo giá trị cũ).
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Ô "chọn tất cả" của bảng trong hộp "Phân công BM khác" gốc trùng id → tích nhầm bảng "chưa phân công". Bản mới tích đúng bảng.
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** "Toàn bộ phân giảng" gốc lấy bộ môn khác / giảng viên từ ô của HỘP BM khác (chép nhầm) → bản mới gửi rỗng. Có cần lọc theo giảng viên ở thanh lọc chính?
  - → Làm như hiện tại: Gửi rỗng.

### apiscongcanbo/modules/klgd/qlklgd_quanlydongbodulieu

- **[Kiểm trên host]** "Gửi lại" gửi các GIATRI đã chọn nối ";" dưới tên strKhoiLuongThoiKhoaBieuId (tên lệch nghĩa, như gốc). Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/qlklgd_taclop

- **[Cần quyết]** Phân giảng (PC) một lớp tách nay BẮT chọn giảng viên (gốc gửi được rỗng); lưu xong đóng hộp.
  - → Làm như hiện tại: Bắt chọn.
- **[Kiểm trên host]** Hệ "NCS" được tách tự do (bỏ luật loại lớp) — dựa theo CHỮ đang hiện của ô Hệ = "NCS" như gốc. Đúng?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Xoá gửi strHocKy kiểu ghép "<năm>_<kỳ>" (khác mọi lời gọi khác của bản QL) như gốc. Kiểm procedure.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Xoá gốc báo NGƯỢC (thành công → hiện như lỗi; lỗi → "Cập nhật thành công") → nay báo đúng.
  - → Làm như hiện tại: Đã sửa.

### apiscongcanbo/modules/klgd/qlklgd_thietlapthoigian

- **[Kiểm trên host]** Lưu gửi strDotHoc = CHỮ của đợt và strDaoTao_ThoiGianDaoTao_Id = id đợt (như gốc). Đúng?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/qlklgd_tonghopkhoiluong

- **[Cần quyết]** Năm → Bộ môn → Giảng viên khoá theo luật cha → con; bảng chỉ nạp khi đã chọn giảng viên (như gốc). "Tổng hợp" thiếu năm học nay DỪNG (gốc báo rồi vẫn chạy); chờ tính xong mới nạp lại bảng.
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Danh sách GetDanhSachPhanCong bản gốc KHÔNG gửi năm học (bảng không lọc theo năm) — giữ. Có cần gửi năm?
  - → Làm như hiện tại: Không gửi (như gốc).
- **[Cần quyết]** Tiêu đề cột gốc lệch dữ liệu ("Loại" hiện cơ sở đào tạo, "Kiểu lớp" hiện hình thức học) → bản mới đặt tiêu đề theo dữ liệu: "Cơ sở đào tạo", "Hình thức học". Đồng ý?
  - → Làm như hiện tại: Đặt theo dữ liệu.

### apiscongcanbo/modules/klgd/qlklgd_tonghopkhoiluong_giangvien

- **[Kiểm trên host]** strStaffId = mã NGƯỜI DÙNG đăng nhập (userId) như gốc — kiểm có khớp mã cán bộ (STAFFID) không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Bản mới nạp thông tin giảng viên TRƯỚC rồi mới nạp bảng (gốc làm ngược → lần đầu luôn gửi bộ môn "#@").
  - → Làm như hiện tại: Nạp thông tin trước.

### apiscongcanbo/modules/klgd/qlklgd_tuychinhkhoiluong

- **[Cần quyết]** Đổi ô lọc thì XOÁ bảng, bấm "Danh sách" mới nạp (như gốc). Cập nhật chỉ gửi dòng đã sửa; TRONGTRUONG rỗng không còn bị coi là "đã sửa".
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Ô Hình thức giảng gốc CHƯA TỪNG chọn sẵn được (tra cột ID không có) → bấm Cập nhật là XOÁ hình thức giảng của mọi dòng. Rà dữ liệu hình thức giảng trên hệ đang chạy?
  - → Làm như hiện tại: Bản mới chọn sẵn đúng.
- **[Kiểm trên host]** Cập nhật gửi strTongSoTiet / strThoiKhoaBieu / strSoTietTheoKeHoach RỖNG (như gốc) — kiểm procedure không ghi đè thành rỗng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Cột cuối đổi tên "Chọn" (gốc "Xóa" nhưng dùng chung cho nút "Cập nhập phân bổ tiết theo CTĐT"). Đồng ý?
  - → Làm như hiện tại: Đổi tên.

### apiscongcanbo/modules/klgd/taclop

- **[Cần quyết]** Phân giảng (PC) một lớp tách nay BẮT chọn giảng viên (gốc gửi được rỗng); lưu xong đóng hộp.
  - → Làm như hiện tại: Bắt chọn.
- **[Cần quyết]** "Toàn bộ phân giảng": tiêu đề cột gốc lệch dữ liệu ("Sỹ số" hiện đợt, "Số tiết" hiện sỹ số) → đặt đúng; không có cột số tiết thật. Cần cột số tiết?
  - → Làm như hiện tại: Đặt đúng, không số tiết.

### apiscongcanbo/modules/klgd/thanhtoangiangday

- **[Cần quyết]** Gốc chỉ gửi dòng có SỐ TIỀN đổi (đổi riêng Nội dung / Ngày TT không lưu) → nay gửi dòng đổi bất kỳ ô nào. Số tiền gửi đi bỏ dấu phẩy ngăn nghìn. Đồng ý?
  - → Làm như hiện tại: Gửi dòng đổi bất kỳ ô.
- **[Cần quyết]** Gốc: bấm "Thanh toán" lần 2 gửi 2 lần → tạo TRÙNG thanh toán. Rà dữ liệu thanh toán trùng đã có trên hệ đang chạy?
  - → Làm như hiện tại: Bản mới gửi một lần.

### apiscongcanbo/modules/klgd/thietlapthoigian

- **[Cần quyết]** Ô Hệ đào tạo và Khoá của bản gốc KHÔNG được gửi vào lời gọi nào (ô "chết") → bản mới bỏ hai ô. Đồng ý, hay cần lọc theo hệ/khoá?
  - → Làm như hiện tại: Bỏ hai ô.

### apiscongcanbo/modules/klgd/tonghopkhoiluong

- **[Cần quyết]** Năm → Bộ môn → Giảng viên khoá theo luật cha → con; bảng chỉ nạp khi đã chọn giảng viên (như gốc). "Tổng hợp" thiếu năm học nay DỪNG (gốc báo rồi vẫn chạy); chờ tính xong mới nạp lại bảng.
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Chọn Hệ đào tạo ở bản gốc gọi hàm KHÔNG tồn tại (lỗi JS). Bản mới dùng hệ để lọc lại bảng. Đúng ý?
  - → Làm như hiện tại: Lọc lại bảng.
- **[Kiểm trên host]** Tổng hợp gửi strHocKy = "<năm>_" (ghép với ô học kỳ KHÔNG có trên màn) như gốc. Kiểm procedure.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/klgd/tuychinhkhoiluong

- **[Cần quyết]** Đổi ô lọc thì XOÁ bảng, bấm "Danh sách" mới nạp (như gốc). Cập nhật chỉ gửi dòng đã sửa; TRONGTRUONG rỗng không còn bị coi là "đã sửa".
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Sửa riêng "Hệ số TC" gốc KHÔNG lưu (thiếu trong phép so) → nay lưu. KIEUHOC gốc đọc mà không gửi — có cần gửi?
  - → Làm như hiện tại: Lưu hệ số TC; không gửi KIEUHOC.

### apiscongcanbo/modules/lichgiang/lichgiangnhieuphonghoc

- **[Cần quyết]** Chia buổi 7-12 / 13-15 và bỏ Chủ nhật; màn "theo giảng viên" chia 7-10 / 11-15 và tính Chủ nhật. Bên nào đúng?
  - → Làm như hiện tại: Giữ như bản gốc từng màn.

### apiscongcanbo/modules/lichgiang/lichgiangnhieuphonghocgiangvien

- **[Cần quyết]** Chia buổi 7-10 / 11-15 và tính Chủ nhật; màn "nhiều phòng học" chia 7-12 / 13-15 và bỏ Chủ nhật. Bên nào đúng?
  - → Làm như hiện tại: Giữ như bản gốc từng màn.

### apiscongcanbo/modules/luanvan/dexuathoidong

- **[Cần quyết]** Hộp thành viên: Đơn vị chỉ để LỌC danh sách cán bộ (gốc cho chọn thành viên khi chưa có đơn vị) → KHÔNG khoá theo luật cha → con. Đồng ý?
  - → Làm như hiện tại: Không khoá.
- **[Kiểm trên host]** "Lưu toàn bộ" gửi kết quả chỉ với strId / đánh giá / điểm / nhận xét (như gốc) — kiểm procedure Sua_BV_KeHoach_NH_GiaoDT_BV không xoá trắng vai trò, thành viên.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/luanvan/duyetdetai

- **[Cần quyết]** Nút "Xóa" / "Thêm" ở chi tiết không chạy ở bản gốc (bảng không có ô đánh dấu; hộp Thêm không có nút lưu). Có cần không?
  - → Làm như hiện tại: Giữ nút, đang khoá.

### apiscongcanbo/modules/luanvan/duyetdexuat

- **[Kiểm trên host]** Mở chi tiết nay nạp ngay danh sách phản biện đã đề xuất (bản gốc không nạp, bảng trống) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/luanvan/duyethoidong

- **[Cần quyết]** Lịch sử xác nhận lấy theo mã KHÔNG có đề tài nhưng lưu theo mã CÓ đề tài (lệch như gốc) → lịch sử có thể luôn trống. Sửa cho khớp không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Màn DUYỆT vẫn cho "Lập hội đồng mới" / "Xóa hội đồng" (bản gốc không ẩn hai nút này). Có ẩn đi không?
  - → Làm như hiện tại: Giữ như gốc.

### apiscongcanbo/modules/luanvan/giaodetai

- **[Cần quyết]** Cột "Học phần đã đăng ký" ở bản gốc hiện TÊN ĐỀ TÀI (BV_KEHOACH_DETAI_TEN). Đúng cột chưa?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** "Tải file" ở chi tiết đề tài: bản gốc gắn ô tải nhưng không có lời lưu. Có cần không?
  - → Làm như hiện tại: Giữ nút, đang khoá.
- **[Cần quyết]** Đề tài chưa giao lấy theo kế hoạch ĐANG CHỌN ở thanh lọc (không theo kế hoạch của người học) — như gốc. Đúng ý không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Lưu người hướng dẫn cho NHIỀU đề tài cùng lúc: lưới được lưu vào từng đề tài (như gốc) — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/luanvan/gvhdxacnhan

- **[Kiểm trên host]** Bảng "Thành viên" bản gốc đổ tên NGƯỜI HỌC (QLSV_NGUOIHOC_HODEM/TEN) — bản mới hiện tên người hướng dẫn (NGUOIDUNG_HODEM/TEN, thiếu thì tra danh sách cán bộ). Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/luanvan/khoaphanbien

- **[Kiểm trên host]** Nút "Xác nhận" ở bản gốc mở hộp KHÔNG có trong html (bấm không hiện gì) — nay chạy thật (Them_BV_XacNhan_PhanBienQ). Đường ghi mới, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Mở "Đề xuất phản biện" nay nạp ngay các phản biện đã có (bản gốc chỉ nạp sau khi Lưu) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/luanvan/pbxacnhan

- **[Cần quyết]** Nút "Thêm dòng" ở hai bảng Hướng dẫn / Phản biện bản gốc không lưu được (không có nút lưu, không tải tệp) — bản mới chỉ xem. Đúng ý không?
  - → Làm như hiện tại: Chỉ xem.

### apiscongcanbo/modules/nhapdiem/duyetchuyendiem

- **[Cần quyết]** strLoaiXacNhan_Id gửi chữ cố định "BangDiem"/"ChungChi" hay giá trị ô "Loại công nhận" (như màn ApisQuanLyDiem/kehoach)?
  - → Làm như hiện tại: Gửi chữ cố định như bản gốc.

### apiscongcanbo/modules/nhapdiem/inbangdiem

- **[Cần quyết]** Phạm vi tổng hợp "Năm học" đang đổ danh sách NĂM NHẬP HỌC; "Đợt học" dùng chung danh sách với "Học kỳ". Đúng chưa?
  - → Làm như hiện tại: Giữ như bản gốc.
- **[Cần quyết]** Lọc "Chỉ SV còn nợ tài chính", Xuất Excel, Gửi email chỉ tính TRANG đang xem. Có lấy toàn bộ kết quả lọc không?
  - → Làm như hiện tại: Giữ như bản gốc.
- **[Kiểm trên host]** Tên cột email của danh sách chưa rõ (đang dò EMAIL, TTLL_EMAILCANHAN…) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Báo cáo gửi strQlsv_NguoiHoc_Id = ID DÒNG (không phải id người học) như gốc — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/nhapdiem/lichhoc

- **[Cần quyết]** Mục menu này ở bản gốc lỗi khi mở từ menu (chỉ là trang con của In bảng điểm). Giữ mục menu hay gỡ?
  - → Làm như hiện tại: Giữ, thêm ô tra mã sinh viên.
- **[Cần quyết]** Danh sách lớp của buổi học gửi strNguoiThucHien_Id = id CÁN BỘ (bản thời khoá biểu sinh viên gửi id SINH VIÊN). Bên nào đúng?
  - → Giữ id CÁN BỘ (người đang dùng màn cán bộ).

### apiscongcanbo/modules/nhapdiem/nhapdiem

- **[Cần quyết]** Quy tắc hệ 10: gõ 200 → 10 (mọi bội của 100). Giữ quy tắc này?
  - → Làm như hiện tại: Giữ như gốc (đã sửa: "12.5" không còn thành 1.2).
- **[Cần quyết]** Sau khi lưu, tính lại MỌI dòng (không chỉ dòng đã sửa). Giữ?
  - → Làm như hiện tại: Giữ như bản gốc.
- **[Cần quyết]** Cột "File" bản gốc tải tệp lên nhưng không lưu, không hiện — đã bỏ. Có cần cột này?
  - → Giữ đã bỏ (bản gốc không lưu, không hiện).
- **[Cần quyết]** "Lấy điểm lại theo Rubric" nay hỏi lại trước khi chạy (bản gốc không hỏi). Đồng ý?
  - → Giữ hỏi lại (tránh ghi đè điểm do bấm nhầm).

### apiscongcanbo/modules/nhapdiem/nhapdiemchamkiemtra

- **[Cần quyết]** Bộ lọc Thời gian / Học phần dùng hàm của PHÚC KHẢO (TP_PhucKhao/…). Đúng hàm chưa?
  - → Làm như hiện tại: Giữ như bản gốc.

### apiscongcanbo/modules/nhapdiem/nhapdiemrenluyen

- **[Kiểm trên host]** strId gửi ĐIỂM CŨ của ô (bản gốc) chứ không phải id bản ghi — procedure đọc strId thế nào?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Danh sách Thời gian đào tạo gồm cả năm lẫn kỳ (bản ApisRenLuyen chỉ lấy kỳ). Lấy loại nào?
  - → Làm như hiện tại: Giữ như bản này.

### apiscongcanbo/modules/nhapdiem/phuckhao

- **[Kiểm trên host]** Lịch sử phúc khảo dựng theo bản cổng sinh viên (XLHV_TP_PhucKhao_MH) — tài khoản cán bộ có gọi được không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/phanlichgiang/dulieuchamthi

- **[Cần quyết]** Số lượng hiện từ SOLUONG nhưng lưu vào dSoBaiCham; học phần gửi IDHOCPHAN. Cột nào đúng?
  - → Giữ đúng cột như bản gốc.

### apiscongcanbo/modules/phanlichgiang/dulieuchamthiv2

- **[Cần quyết]** Số bài đọc SOBAICHAM; học phần gửi DAOTAO_HOCPHAN_ID (bản kia gửi IDHOCPHAN). Cột nào đúng?
  - → Giữ đúng cột như bản gốc.

### apiscongcanbo/modules/phanlichgiang/phanlichgiang

- **[Kiểm trên host]** Mời giảng: khi SỬA vẫn gửi func Them_NhanSu_HoSo_v2 (như gốc) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/quatrinhcongtac/huongnghiencuuchinh

- **[Cần quyết]** Bản gốc gọi nhầm NS_QT_KhamSucKhoe — cần controller đúng để lưu hướng nghiên cứu.
  - → Làm như hiện tại: Có khung, nút lưu đang khoá.

### apiscongcanbo/modules/sanphamkhoahoc/detai

- **[Cần quyết]** Bản gốc gửi Kinh phí / Nguồn kinh phí / Thời gian báo cáo tiến độ lấy từ Ô ĐANG GÕ DỞ của bảng con, và Đơn vị tính / Tình trạng / Số QĐ phê duyệt / Ngày phê duyệt từ ô không tồn tại — bản mới gửi rỗng. Các cột này của đề tài có cần không?
  - → Làm như hiện tại: Gửi rỗng.
- **[Cần quyết]** "Cấp quản lý khác" có ô nhập nhưng bản gốc KHÔNG gửi đi. Có gửi không (cần tên tham số)?
  - → Làm như hiện tại: Giữ như gốc (không gửi).
- **[Kiểm trên host]** Mở đề tài đã có: ô "Danh mục đề tài" bản gốc không đổ lại; bản mới đọc cột NCKH_SP_DANHMUCDETAI_ID (đoán). Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tên cột trả về của Sản phẩm ứng dụng / Đơn vị hợp tác / Tiến độ (LOAISANPHAM_ID, DOITAC, QUOCTICH_ID, THOIGIAN, SOTIENTHANHTOAN, SOTIENCONLAI) đoán theo tham số lưu — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/sanphamkhoahoc/detaisinhvien

- **[Kiểm trên host]** Xoá giảng viên đã lưu ở bản gốc lỗi JS (chưa từng chạy) — nay chạy được. Đường ghi mới, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Ô "Mô tả" ẩn bị bản gốc ghi đè bằng "Tên sinh viên" (strMoTa khai hai lần) → chỉ còn ô Tên sinh viên. Đúng ý không?
  - → Làm như hiện tại: Chỉ ô Tên sinh viên.

### apiscongcanbo/modules/sanphamkhoahoc/giangdaysaudaihoc

- **[Cần quyết]** Bản gốc TRÁO strNoiDung ↔ strThoiGian khi lưu (và tráo lại khi hiện). Có sửa cho đúng tên không? Sửa là dữ liệu cũ bị lệch.
  - → Làm như hiện tại: Giữ như gốc.

### apiscongcanbo/modules/sanphamkhoahoc/hoidongxetchucdanh

- **[Cần quyết]** Biểu mẫu thêm/sửa của bản gốc KHÔNG mở được (không có nút Thêm; nút xem trỏ tới khung không tồn tại). Bản mới CHỈ XEM chi tiết. Cán bộ có cần tự kê khai hồ sơ xét chức danh không?
  - → Làm như hiện tại: Chỉ xem.
- **[Kiểm trên host]** Ô từ khoá bản gốc không được gửi; bản mới gửi strTuKhoa — kiểm procedure có nhận không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/sanphamkhoahoc/hoinghihoithao

- **[Cần quyết]** Ô "Tháng tổ chức" bản gốc lưu vào strNamBaoCao (NĂM báo cáo). Đúng tham số chưa?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Chọn từ "Tìm hội nghị": bản gốc không chép được kinh phí (lỗi id) — bản mới chép cả kinh phí. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/sanphamkhoahoc/hoithaoquocte

- **[Cần quyết]** Bản gốc là bản chép HỎNG của "Hội nghị/hội thảo" (nạp chính hoinghihoithao.js trên html thiếu id, không lưu được). Giữ mục menu (trùng màn) hay gỡ? Nếu "Hội thảo quốc tế" cần lọc riêng phạm vi quốc tế thì cho biết mã phạm vi.
  - → Làm như hiện tại: Dựng lại y như Hội nghị hội thảo: cùng controller NCKH_HoiNghiHoiThao, cùng danh sách, không lọc riêng phạm vi quốc tế.

### apiscongcanbo/modules/sanphamkhoahoc/kyyeuhoinghi

- **[Kiểm trên host]** Hộp "Tìm bài báo": cột Lĩnh vực đọc THUOCLINHVUCNAO (có thể sai tên cột) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/sanphamkhoahoc/sangkien

- **[Cần quyết]** Bản gốc RỖNG (html trống, .js 0 byte). Gỡ khỏi menu, hay mô tả nghiệp vụ Sáng kiến để dựng?
  - → Làm như hiện tại: Khung báo "chưa có nội dung", không gọi API.

### apiscongcanbo/modules/sanphamkhoahoc/tapchiquocgia

- **[Cần quyết]** "Tên tạp chí" bản gốc bị ẨN khi chưa chọn danh mục (không nhập được) — bản mới chỉ ẩn khi đã chọn tạp chí có sẵn trong danh mục. Đồng ý?
  - → Làm như hiện tại: Hiện khi chưa chọn / chọn "khác".

### apiscongcanbo/modules/sanphamkhoahoc/tapchiquocte

- **[Cần quyết]** "Tên tạp chí" bản gốc bị ẨN khi chưa chọn danh mục (không nhập được) — bản mới chỉ ẩn khi đã chọn tạp chí có sẵn trong danh mục. Đồng ý?
  - → Làm như hiện tại: Hiện khi chưa chọn / chọn "khác".

### apiscongcanbo/modules/sanphamkhoahoc/thongtinsach

- **[Kiểm trên host]** Sửa sách: bản gốc không đổ ô "Thành viên khác" nên lưu là xoá trắng — bản mới đổ đúng. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/thi/baocao

- **[Cần quyết]** Ô từ khoá chỉ gửi vào báo cáo, KHÔNG gửi vào danh sách (như gốc). Có thêm vào danh sách không?
  - → Làm như hiện tại: Giữ như bản gốc.

### apiscongcanbo/modules/thi/chamthi

- **[Cần quyết]** Đổi ô lọc có tự tải lại danh sách không? (bản gốc phải bấm "Danh sách")
  - → Làm như hiện tại: Giữ như bản gốc.
- **[Kiểm trên host]** Bảng đọc cột GIANGVIENCOITHI_* và gửi tham số tên "CoiThi" như gốc — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/thi/chamtui

- **[Cần quyết]** Đổi ô lọc có tự tải lại danh sách không? (bản gốc phải bấm "Danh sách")
  - → Làm như hiện tại: Giữ như bản gốc.
- **[Kiểm trên host]** Bảng đọc cột GIANGVIENCOITHI_* như gốc; vùng báo cáo gốc không nạp mẫu nên không có nút báo cáo — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/thi/coithi

- **[Cần quyết]** Đổi ô lọc có tự tải lại danh sách không? (bản gốc phải bấm "Danh sách")
  - → Làm như hiện tại: Giữ như bản gốc.

### apiscongcanbo/modules/thi/phanchamtui

- **[Kiểm trên host]** Id TÚI được gửi qua tham số tên "…DanhSachThi / GV_ChamThi" như gốc — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/thi/phanphuckhao

- **[Cần quyết]** Lọc Khoa theo CHUỖI tên (khớp cả "Khoa Kinh tế và …") như gốc. Có đổi sang so đúng tên / id không?
  - → Làm như hiện tại: Giữ như bản gốc.

### apiscongcanbo/modules/thi/sotheodoiphancoithi

- **[Cần quyết]** Tên màn là "phân COI thi" nhưng mã gốc đang chạy làm phân CHẤM thi. Làm theo tên hay theo mã?
  - → Làm như hiện tại: Theo mã đang chạy (phân chấm thi).

### apiscongcanbo/modules/thongke/nhapdiemlichthi

- **[Kiểm trên host]** Bấm một dòng → các lớp học phần: chưa từng chạy ở bản gốc — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/tintuc/tintuc

- **[Cần quyết]** Thêm đường BỎ LƯU cho tin đã đánh dấu (bản gốc có nút "Đã lưu" nhưng không xử lý, lời gọi xoá bị chú thích). Đồng ý?
  - → Làm như hiện tại: Nút "Bỏ lưu" ở khung xem tin và trên từng thẻ đã lưu, hỏi lại trước khi bỏ.
- **[Kiểm trên host]** Bỏ lưu gọi TT_LuuTru/Xoa theo quy ước CRUD của hệ (LayDanhSach · ThemMoi · Xoa) — bản gốc không có lời gọi này. ĐƯỜNG GHI MỚI, thử trên host trước khi giao.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/congnhandiem

- **[Cần quyết]** Lưu / Huỷ chứng chỉ gửi strDiem_TT_CC_CapDo_Id = ID DÒNG học phần, trong khi bản v3 gửi ID cấp độ — bên nào đúng?
  - → Làm như hiện tại: Gửi ID dòng như gốc.
- **[Cần quyết]** strLoai gửi RỖNG (gốc đọc ô txtAAAA không tồn tại; v3 gửi "CC"/"DIEM") — có cần điền không?
  - → Làm như hiện tại: Gửi rỗng như gốc.
- **[Cần quyết]** strDiem_ThanhPhanDiem_Id gửi ID dòng đầu điểm (v3 gửi DIEM_THANHPHANDIEM_ID) — cột nào đúng?
  - → Làm như hiện tại: Gửi ID dòng như gốc.
- **[Cần quyết]** Ghi chú từng đầu điểm hiện ra nhưng không gửi đi (như gốc) — có cần lưu không?
  - → Làm như hiện tại: Không gửi.
- **[Cần quyết]** Nút "Kết quả" (đầu trang) và "Xem kết quả" (trong hộp) gốc không có xử lý — gỡ hay nối vào LayGiaTriNguoiHoc_Diem_CN_CC?
  - → Làm như hiện tại: Giữ nút, đặt khoá.
- **[Cần quyết]** "Xác nhận hủy kết quả đăng ký" ở hộp bảng điểm: gốc lấy Ngày cấp / Nơi cấp / Ngày hết hạn từ hộp CHỨNG CHỈ (hai hộp cùng nằm trên trang) — nay gửi rỗng. Đồng ý?
  - → Làm như hiện tại: Gửi rỗng.
- **[Kiểm trên host]** Đường lưu chứng chỉ (Them_Diem_NguoiHoc_Diem_CN + …_CN_CC) CHƯA TỪNG CHẠY ở bản gốc (gốc gọi hàm thiếu tham số) — thử trên host trước khi giao.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Xoá dòng học phần nay gọi Xoa_Diem_NguoiHoc_Diem_CN_HP (gốc gọi nhầm procedure của màn sự kiện) — kiểm quyền và kết quả.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Danh sách học phần tự nhập nạp bằng LayDSDiem_NguoiHoc_Diem_CN_HP: bản cũ đọc Data.rsHocPhanDuDK, v3 đọc thẳng mảng — xác nhận hình dạng trả về.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/congnhandiemv3

- **[Cần quyết]** "Lưu thông tin" gửi strDaoTao_HocPhan_Id = học phần của dòng "Từ bảng điểm" mở gần nhất (gốc dùng chung biến; tab chứng chỉ không có chỗ chọn học phần) nên thường rỗng — đúng không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Nơi cấp / Ngày cấp có dấu (*) nhưng gốc chỉ kiểm minh chứng, và thiếu minh chứng vẫn lưu tiếp phần "thông tin phải nhập" (gốc thiếu return) — giữ hay chặn hẳn?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Ghi chú đầu điểm không gửi đi (như gốc) — có cần lưu không?
  - → Làm như hiện tại: Không gửi.
- **[Cần quyết]** Hai bảng "Xem kết quả" bỏ cột "Chọn" (ô đánh dấu không nơi nào đọc); tiêu đề bảng kết quả từ bảng điểm xếp lại theo dữ liệu (Phí → Khoa → Đào tạo). Đồng ý?
  - → Làm như hiện tại: Đã bỏ / xếp lại.
- **[Cần quyết]** Loại chứng chỉ → Tên chứng chỉ → Cấp độ nay KHOÁ theo tầng (gốc mở sẵn). Đồng ý?
  - → Làm như hiện tại: Đã khoá.
- **[Kiểm trên host]** Minh chứng "từ bảng điểm" trong hộp Xem kết quả: gốc tra khoá có KẾ HOẠCH trong khi lúc lưu dùng khoá có CƠ SỞ đào tạo → luôn rỗng; giữ nguyên, cần chốt khoá đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Trường "thông tin phải nhập" kiểu FILE: gốc gửi giá trị rỗng và luôn báo thiếu; bản mới kiểm bằng SỐ TỆP đã tải lên — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Ô Tỉnh / Huyện / Xã dựng lại bằng danh mục CHUN.DMTT (thay edu.extend.genDropTinhThanh) — kiểm giá trị lưu xuống.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/dangky

- **[Cần quyết]** Đổi lịch lớp thuộc NHÓM: bản gốc gửi ID lớp đang đổi cho MỌI dòng cùng nhóm (Cũ "X,X,X" / Mới "X,Y,X"). Phải gửi ID của từng lớp trong nhóm chứ?
  - → Làm như hiện tại: Giữ y bản gốc — chưa sửa vì là đường ghi dữ liệu thật.
- **[Cần quyết]** Hộp "Chọn thêm … lớp" không bắt buộc chọn đủ nhóm lớp (LT/TH) trước khi Đăng ký (như gốc). Có cần bắt buộc?
  - → Làm như hiện tại: Tự chọn sẵn lớp còn chỗ, vẫn cho đăng ký thiếu như gốc.
- **[Cần quyết]** Bản gốc CHÚ THÍCH BỎ lời gọi tài chính lúc mở màn nên Số dư / Số phát sinh để trống tới khi bấm, và rê chuột không hiện gì. Bản mới nạp ngay khi chọn kế hoạch (một lời gọi) để ba con số hiện sẵn và rê chuột có dữ liệu. Đồng ý?
  - → Làm như hiện tại: Nạp sẵn theo kế hoạch đang chọn; bấm vào dòng vẫn mở hộp chi tiết đầy đủ.
- **[Cần quyết]** Hai hộp "Điểm danh" / "Điểm quá trình" ở màn này bản gốc không có nút nào mở (và đảo tiêu đề cột). Có cần thêm nút trên thẻ lớp?
  - → Làm như hiện tại: Bỏ ở màn Đăng ký học; vẫn có ở màn Kết quả đăng ký học.
- **[Cần quyết]** Nút × trang trí trên thẻ lớp (gốc không có xử lý) đã bỏ. Đồng ý?
  - → Làm như hiện tại: Đã bỏ.
- **[Cần quyết]** Thẻ rê chuột của Số phát sinh: bản gốc là bảng 10 cột (không đọc được trong thẻ nổi) nên thẻ rút còn tên lớp · khoản thu · số tín chỉ + tiền phải nộp; bấm vào dòng mới mở bảng đủ 10 cột. Đồng ý?
  - → Làm như hiện tại: Cả ba dòng đều có thẻ rê chuột.
- **[Kiểm trên host]** Đăng ký chỉ báo thành công khi máy chủ trả Id (Success mà rỗng Id thì màn im lặng, như gốc). Kiểm phản hồi thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Sau Hủy / Đổi lịch bản mới nạp lại hộp kết quả (gốc giữ danh sách cũ nên bấm Hủy lần hai là lỗi). Xác nhận đúng nghiệp vụ.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/dangkycosodaotao

- **[Cần quyết]** Bảng "Lịch sử thay đổi lựa chọn" chưa có procedure (bản gốc đã chú thích bỏ). Có bổ sung API không?
  - → Làm như hiện tại: Không vẽ bảng lịch sử.
- **[Cần quyết]** Thông tin người học lấy từ chính dòng kế hoạch (DS_KH_NH) vì cổng SV chưa có API hồ sơ; thiếu họ tên thì lấy tên người đang thủ vai. Đồng ý?
  - → Làm như hiện tại: Giữ cách của gốc.
- **[Cần quyết]** "Còn hạn" tính ở máy trạm theo ngày kết thúc kế hoạch; hết hạn thì khoá mọi lựa chọn (như gốc). Đồng ý?
  - → Làm như hiện tại: Không đọc được ngày thì coi là còn hạn.
- **[Kiểm trên host]** Tên cột trả về của DS_KH_NH / DS_KHCS chưa chốt (gốc khai mỗi trường một danh sách tên dò) — đối chiếu tên thật trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Cờ "đang đăng ký" (DADANGKY/DACHON/ISCHON/DALUACHON/TRANGTHAIDANGKY) và NGAYXACNHAN do DS_KHCS trả; procedure không trả cờ thì nạp lại màn về "chưa đăng ký" (như gốc) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Xoa_KQ chỉ gửi strNguoiThucHien_Id + strCorePerson_Id, không gửi kế hoạch / cơ sở (như gốc) — xác nhận hủy đúng bản ghi của kế hoạch đang xem.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/dangkymonthi

- **[Cần quyết]** Tiêu đề đổi từ "Gia hạn thanh toán" (breadcrumb gốc ghi nhầm) sang "Đăng ký môn thi"; nút "Quay lại" từng thẻ gộp thành một nút "Đóng". Đồng ý?
  - → Làm như hiện tại: Đã đổi.
- **[Cần quyết]** Sau Đăng ký / Hủy có cần nạp lại danh sách không?
  - → Làm như hiện tại: Chỉ quay về lưới kế hoạch — đúng như gốc, vì đường nạp lại của gốc gọi hàm không tồn tại.
- **[Kiểm trên host]** ThucHienHuyDangKy ở màn này KHÔNG gửi strId (như gốc), trong khi màn thi lại có gửi — kiểm procedure.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/dinhhuong

- **[Cần quyết]** Mở màn chưa nạp danh sách, phải bấm "Xem định hướng" (kể cả danh sách đã đăng ký) — giữ như gốc hay tự nạp?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** strSoQuyetDinh / strNgayQuyetDinh / strMoTa bản gốc đọc ô txtAAAA không tồn tại nên luôn rỗng. Có cần nhập thật không?
  - → Làm như hiện tại: Gửi rỗng, đúng giá trị gốc đang gửi.
- **[Cần quyết]** Cột "Chế độ đăng ký" chỉ hiện, không chặn đăng ký (như gốc). Đồng ý?
  - → Làm như hiện tại: Chỉ hiện.
- **[Kiểm trên host]** Xoá gửi strIds = MỘT id mỗi lời gọi (như gốc), nay chạy tuần tự — procedure có nhận danh sách id ngăn cách không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/nganh2

- **[Cần quyết]** Chưa chọn Chương trình thì khoá Kế hoạch; xoá Chương trình thì xoá Kế hoạch và hai bảng về trống (gốc để mở). Đồng ý?
  - → Làm như hiện tại: Đã khoá.
- **[Cần quyết]** Bấm "Đăng ký" khi chưa chọn dòng: gốc lỗi JS, nay báo "Vui lòng chọn đối tượng?". Đồng ý?
  - → Làm như hiện tại: Báo nhắc.
- **[Kiểm trên host]** "Hủy đăng ký" gửi strId = ID dòng của rsKetQua (như gốc) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/nguyenvong

- **[Cần quyết]** Kế hoạch → Kiểu học nay KHOÁ; đổi Kế hoạch thì xoá trắng Kiểu học. Đồng ý?
  - → Làm như hiện tại: Lần nạp "chưa đăng ký" ngay sau khi đổi kế hoạch gửi strKieuHoc_Id RỖNG (gốc gửi kiểu học CŨ).
- **[Cần quyết]** Xoá Kế hoạch thì hai bảng về lời nhắc, không gọi API (gốc giữ dữ liệu cũ). Đồng ý?
  - → Làm như hiện tại: Về lời nhắc.
- **[Cần quyết]** "Mức phí dự kiến" (PHIPHAIDONG − PHIDUOCMIEN) nay định dạng tiền (1.350.000). Đồng ý?
  - → Làm như hiện tại: Định dạng tiền.
- **[Cần quyết]** Đăng ký / Hủy nhiều dòng chạy TUẦN TỰ có tiến độ rồi nạp lại MỘT lần (gốc bắn N lời gọi song song, nạp lại sau mỗi lời gọi). Đồng ý?
  - → Làm như hiện tại: Tuần tự.
- **[Kiểm trên host]** Mỗi dòng một lời gọi LayDSPhiTheoHocPhan (như gốc) — kiểm tốc độ khi danh sách dài; kiểm Quy mô / Hình thức học có dữ liệu thật (không có thì cột tự ẩn như gốc).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/thilai

- **[Cần quyết]** Chương trình → Kế hoạch nay KHOÁ; mở màn nạp tuần tự CT → KH → hai bảng (gốc gọi song song lúc ô chương trình còn rỗng). Đồng ý?
  - → Làm như hiện tại: Tự chọn chương trình đầu → kế hoạch đầu → nạp hai bảng.
- **[Kiểm trên host]** Hủy gửi cả strId lẫn strDangKy_Thi_HocPhan_KQ_Id cùng bằng ID dòng (như gốc) — procedure có cần cả hai?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/tracuu

- **[Cần quyết]** Ô đánh dấu từng môn mặc định CHỌN HẾT (như gốc) nên "Xác nhận tất cả" xác nhận mọi môn. Giữ?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Nút "Đồng ý" không bắt buộc chọn Trạng thái xác nhận (như gốc, gửi rỗng). Có chặn không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Lịch sử xác nhận nạp với strLoaiXacNhan_Id là giá trị ô đang chọn (lần mở đầu rỗng, như gốc) — procedure có trả đủ lịch sử khi rỗng?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Bấm tên lớp nay gửi DANGKY_LOPHOCPHAN_ID (gốc gửi id thẻ <a> nên hộp Chi tiết chưa bao giờ có dữ liệu) — kiểm trên dữ liệu thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Sau khi xác nhận, bản mới nạp lại danh sách (gốc gọi hàm không tồn tại) — kiểm trạng thái sau xác nhận.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dangkyhoc/xacnhannhaphoc

- **[Cần quyết]** "Lịch sử xác nhận của bạn" chưa có endpoint (LayDS_LichSu_XacNhanCoSo) nên bảng luôn rỗng. Có bổ sung API không?
  - → Làm như hiện tại: Bảng "Không có dữ liệu".
- **[Cần quyết]** Mở màn chỉ nạp Kế hoạch; danh sách cơ sở chỉ nạp khi bấm "Xem thông tin" hoặc đổi kế hoạch (như gốc). Có nạp luôn khi mở màn?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Sua_CoSoNhapHoc dùng cho cả xác nhận lần đầu và đổi cơ sở — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/dashboard/dashboard

- **[Cần quyết]** Hai khối "Bạn bè" và "Dịch vụ" của bản gốc chỉ có tiêu đề + nút "Xem tất cả" href="#" (nội dung bị chú thích bỏ, không lời gọi, nút không xử lý) → bản mới không vẽ. Bỏ hẳn hay dựng thật (cần API)?
  - → Làm như hiện tại: Không vẽ.
- **[Cần quyết]** Dải tin của bản gốc là băng trượt (slick) → bản mới là dải cuộn ngang. Đồng ý?
  - → Làm như hiện tại: Dải cuộn ngang.
- **[Kiểm trên host]** Lối tắt chức năng ở bản gốc KHÔNG bấm được (lớp .chucnang không nơi nào gắn xử lý) → bản mới bấm là mở đúng chức năng. Kiểm đường dẫn từng lối tắt trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/hoctap/chuontrinhhoc

- **[Cần quyết]** Bản gốc chọn sẵn chương trình CUỐI danh sách khi mở màn (selectOne). Nên chọn chương trình chính / đầu tiên không?
  - → Làm như hiện tại: Giữ như gốc — chọn mục cuối.
- **[Cần quyết]** Số tiết theo loại phân bổ gọi LayDSKS_DaoTao_HocPhan_CT_PB MỘT LẦN CHO MỖI học phần (100 học phần = 100 lời gọi). Có procedure trả cho cả chương trình trong một lần không?
  - → Làm như hiện tại: Giữ lời gọi từng dòng, chạy tối đa 6 lời gọi cùng lúc.
- **[Cần quyết]** Bảng học phần không còn cuộn trong khung (gốc ép chiều cao theo màn hình) mà cuộn cả trang. Đồng ý?
  - → Làm như hiện tại: Cuộn cả trang; cuộn ngang vẫn giữ.
- **[Cần quyết]** Tên tệp gốc lệch nhau: html là chuontrinhhoc.html còn script là chuongtrinhhoc.js — bản mới đặt cả hai theo tên html. Có sửa tên trong DB không?
  - → Làm như hiện tại: Theo tên html (DUONGDANFILE).

### apiscongsinhvien/modules/hoctap/congnhandiem

- **[Cần quyết]** Bản gốc LỖI CÚ PHÁP (thiếu dấu phẩy) nên màn CHƯA BAO GIỜ chạy — bản mới dựng theo ý định đọc trong mã (cột "Tình trạng" ẩn chữ "Hết hiệu lực"; học phần đã đăng ký thì bỏ ô đánh dấu). Xác nhận nghiệp vụ đúng chưa?
  - → Làm như hiện tại: Làm theo ý định.
- **[Cần quyết]** Lưu hàng loạt KHÔNG gửi strId (gốc chú thích dòng đó) nên bấm "Đăng ký" lần hai là THÊM TRÙNG. Có sửa thành cập nhật không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Khoá tệp minh chứng là "CongNhan" + kế hoạch + người học, dùng chung cho MỌI học phần (không tách theo học phần) — như gốc. Đúng ý không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Ô "Loại chứng chỉ" ở khung khai hàng loạt để MỞ (lọc tuỳ chọn); ba ô trong hộp chi tiết (Loại chứng chỉ → Loại công nhận → Cơ sở) đã KHOÁ theo luật cha → con. Đồng ý?
  - → Làm như hiện tại: Như trên.
- **[Cần quyết]** Gốc có HAI nút "Đăng ký" giống hệt trong khung khai; bản mới còn MỘT ở đầu khung. Đồng ý?
  - → Làm như hiện tại: Còn một nút.
- **[Kiểm trên host]** Hai đường LƯU (khai hàng loạt và hộp chi tiết) của gốc không bao giờ chạy tới lời gọi (kiểm tệp sai) — bản mới bắt buộc có ít nhất một tệp minh chứng rồi mới gửi. Đường GHI chưa từng chạy trên hệ thật, thử trên host trước khi giao.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** LayDSChuongTrinhHoc ở màn này CHỈ gửi strDaoTao_ChuongTrinh_Id (không gửi kế hoạch), khác màn cùng tên hàm bên Đăng ký học — kiểm dữ liệu trả về.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/hoctap/diemhoc

- **[Cần quyết]** Nút "Điểm quá trình" ở tab Kết quả đăng ký học: bản gốc Cổng SV chạy được (có hộp), bản chép ở Cổng cán bộ (DaQHHT) không có hộp. Bật ở cả hai nơi hay chỉ Cổng SV?
  - → Làm như hiện tại: Cổng SV BẬT (mở hộp LatKetQuaDiemQuaTrinh); DaQHHT giữ nút khoá như gốc.
- **[Cần quyết]** Điểm rèn luyện: gốc nạp MỘT lần lúc mở màn với strDaoTao_ChuongTrinh_Id RỖNG và không nạp lại khi đổi chương trình. Đồng ý sửa?
  - → Làm như hiện tại: Nạp lại theo chương trình đang chọn.
- **[Cần quyết]** Ô "Thời gian" ở tab Kết quả đăng ký học là lọc tuỳ chọn (trống = mọi học kỳ) nên KHÔNG khoá theo luật cha → con. Đồng ý?
  - → Làm như hiện tại: Để mở như gốc.
- **[Kiểm trên host]** Thông tin người học đọc cột QLSV_NGUOIHOC_HODEM / _TEN / _NGAYSINH / _GIOITINH (theo gốc; tầng chung trước đây đọc sai tên nên DaQHHT trống 4 dòng) — kiểm tên cột thật của KetQuaHocTapCaNhan.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Hộp "Điểm quá trình" và "Chi tiết điểm thành phần": kiểm cột trả về (DIEM_THANHPHANDIEM_TEN, DIEM, LANHOC, LANTHI).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/hoctap/diemrenluyen

- **[Cần quyết]** Hai cột "HĐ cấp khoa đánh giá" / "HĐ cấp trường đánh giá" bản gốc KHÔNG đổ dữ liệu. Có nguồn không?
  - → Làm như hiện tại: Để trống như gốc.
- **[Cần quyết]** Tờ phiếu viết cứng "Bộ giáo dục và đào tạo" và "Quyết định số 10/QĐ-ĐHCMC-CTSN ngày 10/10/2023" — mang tên trường khác (ĐHCMC). Cần số quyết định và tên trường thật.
  - → Làm như hiện tại: Giữ nguyên chữ gốc.
- **[Cần quyết]** Mở màn tự nạp phiếu theo kế hoạch đầu tiên (gốc chọn sẵn kế hoạch nhưng bắt bấm "Xem"). Đồng ý?
  - → Làm như hiện tại: Nạp sẵn, nút "Xem" vẫn giữ.
- **[Cần quyết]** Gốc giới hạn tệp minh chứng .pdf; tầng chung ums.files dùng danh sách đuôi chung. Có cần giữ giới hạn .pdf?
  - → Làm như hiện tại: Không giới hạn .pdf.
- **[Kiểm trên host]** Lưu điểm gửi strPhamViApDung_Id = ID người học (như gốc); tệp lưu theo khoá ghép người học + kế hoạch + thành phần — kiểm procedure và SV_Files trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Mỗi dòng của phiếu gọi một SV_Files/LayDanhSach (như gốc) — phiếu nhiều tiêu chí thì số lời gọi bằng số dòng; kiểm tải trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/hoctap/hoantotnghiep

- **[Cần quyết]** Tệp minh chứng lưu theo khoá "CongNhan" + kế hoạch + người học, tức MỌI chứng chỉ trong cùng đợt xét dùng CHUNG một bộ tệp (như gốc). Có cần tách theo từng chứng chỉ?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Bản gốc luôn cho bấm "Xóa" kể cả khi đang khai mới (gửi Xoa với strId rỗng); bản mới khoá nút khi chưa có bản ghi. Đồng ý?
  - → Làm như hiện tại: Khoá nút.
- **[Cần quyết]** save_XacNhan của gốc không bao giờ vào nhánh cập nhật (thiếu strId) nên xác nhận lần hai vẫn gọi Them_TN_KeHoach_DangKy và báo "Thêm mới thành công!". Máy chủ có tự cập nhật khi đã có bản ghi?
  - → Làm như hiện tại: Giữ nguyên như gốc.
- **[Cần quyết]** Nút "Xét" gửi 5 tham số RỖNG (lớp quản lý, chương trình, trạng thái người học, thời gian đào tạo, phân loại) vì gốc đọc ô không tồn tại. Procedure có cần các giá trị này?
  - → Làm như hiện tại: Gửi rỗng như gốc.
- **[Cần quyết]** strGhiChu luôn gửi rỗng (gốc đọc txtGhiChu không có trong màn). Có cần thêm ô "Ghi chú" vào hộp khai minh chứng?
  - → Làm như hiện tại: Gửi rỗng.
- **[Cần quyết]** Trong hộp minh chứng, Loại chứng chỉ → Loại công nhận → Cơ sở đào tạo nay KHOÁ ô con khi chưa chọn cha (khác gốc). Đồng ý?
  - → Làm như hiện tại: Đã khoá.
- **[Cần quyết]** Vạch ngăn ghi "Kết quả" nằm ngay trên ô "Minh chứng" (gốc đặt vậy, chữ không khớp nội dung bên dưới). Giữ hay đổi thành "Minh chứng"?
  - → Làm như hiện tại: Giữ chữ gốc.
- **[Kiểm trên host]** Nhánh CẬP NHẬT chứng chỉ gửi action của controller TN_DangKy (không có hậu tố _MH như mọi lời gọi khác của màn) — bấm Lưu một chứng chỉ đã có trên host xem có lỗi không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/hoctap/phuckhao

- **[Cần quyết]** "Hủy đăng ký" chỉ hiện khi ĐÃ đăng ký VÀ ĐÃ có tình trạng nộp phí (chép đúng gốc) — nghe ngược với thực tế. Giữ hay đổi?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Lý do đăng ký / lý do huỷ gửi RỖNG (gốc đọc ô txtAAAA không có trong màn). Có cần thêm ô nhập lý do?
  - → Làm như hiện tại: Gửi rỗng.
- **[Cần quyết]** Cột KETQUAPHUCKHAO1 ở gốc nằm dưới một ô tiêu đề TRỐNG — tên cột đúng là gì?
  - → Làm như hiện tại: Giữ cột, tiêu đề để trống.
- **[Cần quyết]** Bản mới hỏi lại trước khi Hủy đăng ký (gốc huỷ ngay khi bấm). Đồng ý?
  - → Làm như hiện tại: Có hỏi lại.
- **[Kiểm trên host]** Nút "Nộp phí" đã bị chú thích trong html gốc (chỉ còn mã bật/tắt) nên bản mới không dựng — có cần khôi phục?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/profile/hoso

- **[Cần quyết]** Bản gốc khai hai obj_save chồng nhau nên CHỈ cặp pkg_hosohocvien_quyen.* chạy được (LayDSHoSoChoPhepCBNhap = danh sách trường CHO CÁN BỘ nhập). Màn của SINH VIÊN có đúng là dùng danh sách này không, hay phải là …_kehoach.LayDSHoSoChoPhepSVNhap như màn Tự nhập hồ sơ?
  - → Làm như hiện tại: Giữ đúng cặp đang chạy ở bản gốc (…_quyen.*).
- **[Cần quyết]** Ảnh đại diện ở bản gốc KHÔNG bao giờ hiện (đổ vào phần tử chỉ có khi gọi uploadAvatar, mà màn này không gọi). Bản mới hiện ảnh dạng CHỈ XEM — đúng ý không?
  - → Làm như hiện tại: Hiện ảnh, không cho đổi.

### apiscongsinhvien/modules/profile/minhchung

- **[Kiểm trên host]** strLoaiHoSo_SoLuong_s đếm SỐ TỆP đang hiện ở ô (kể cả tệp chưa lưu) như bản gốc — kiểm số lưu xuống trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Khối ảnh đại diện bị chú thích bỏ trong html gốc → bản mới không vẽ. Có cần hiện ảnh ở màn này không?
  - → Làm như hiện tại: Không vẽ ảnh.

### apiscongsinhvien/modules/profile/tunhaphoso

- **[Cần quyết]** Bản gốc bấm Lưu là ĐỨNG (kiểm ràng buộc duyệt cả trường của tab KHÔNG mở → TypeError). Bản mới kiểm và lưu đúng các trường của TAB ĐANG MỞ (chính là tập bản gốc đem đi lưu). Xác nhận: lưu theo từng tab, không phải lưu cả hồ sơ một lần?
  - → Làm như hiện tại: Lưu theo tab đang mở.
- **[Cần quyết]** Cột dữ liệu đọc TRUONGTHONGTIN_GIATRI hay THONGTINXACMINH là do XACNHANTHONGTIN của KẾ HOẠCH đang chọn; bản gốc bật một chiều (đổi kế hoạch vẫn giữ cột cũ) → bản mới tính lại theo kế hoạch đang chọn. Đúng ý không?
  - → Làm như hiện tại: Tính lại theo kế hoạch đang chọn.
- **[Kiểm trên host]** strDaoTao_ChuongTrinh_Id và strHanhDong_Id gửi RỖNG (bản gốc đọc ô dropAAAA không tồn tại). Procedure có cần hai tham số này không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/sukien/sukien

- **[Cần quyết]** Bảng "Sự kiện đã đăng ký" của bản gốc gọi dịch vụ VÉ THÁNG (pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy, tham số strQLSV_KeHoach_DichVu_Ve_Id) — chép nhầm từ màn vé xe buýt. Cần action/func đúng của "sự kiện đã đăng ký".
  - → Làm như hiện tại: Giữ nguyên lời gọi gốc (không có mã action khác để thay).
- **[Kiểm trên host]** Xoá đăng ký ở bản gốc KHÔNG gửi id nào (hàm nhận strId rồi bỏ quên) → chưa từng chạy; bản mới gửi strId = ID dòng đã đăng ký. Kiểm tên tham số trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Bảng "đã tham gia" ở bản gốc chưa từng hiện (biến strQLSV_NguoiHoc_Id không tồn tại → ReferenceError); cột "Điểm" không lời gọi nào đổ dữ liệu. Cột nào là điểm sự kiện?
  - → Làm như hiện tại: Nạp bảng theo đúng ý định; cột Điểm để trống.

### apiscongsinhvien/modules/thanhtoanonline/thanhtoanonline

- **[Cần quyết]** Khối QR VietinBank chép cứng cấu hình đơn vị khác: providerId / merchantName "DHLAMNGHIEP", merchantId "0500465853", terminalId "TDHLAMNGHIEP" và một chữ ký cố định — cần đối tác xác nhận trước khi giao (cùng điểm với ApisCongCanBo/thongtinsinhvien/thanhtoanonline).
  - → Làm như hiện tại: Giữ nguyên như gốc.
- **[Cần quyết]** VTB gửi transactionDate lấy NĂM + 1 trong khi transTime lấy năm hiện tại — đúng hay lỗi gõ của bản gốc?
  - → Làm như hiện tại: Giữ y bản gốc.
- **[Cần quyết]** "Nộp trước" gửi dSoTien là chuỗi có dấu phẩy ngăn nghìn ("1,500,000") vì bản gốc định dạng ô rồi gửi thẳng — procedure có nhận được không?
  - → Làm như hiện tại: Gửi nguyên chuỗi như gốc.
- **[Cần quyết]** Nút "Hủy nộp trước" xoá MỌI dòng đang đánh dấu của bảng (mở màn mọi dòng đã đánh dấu sẵn), không riêng dòng nộp trước. Có nên chỉ cho xoá dòng nộp trước?
  - → Làm như hiện tại: Xoá đúng các dòng đang đánh dấu như gốc, có hỏi lại.
- **[Cần quyết]** Tiêu đề hộp chi tiết của bản gốc là "Danh sách <span id=lblXacNhanChiTiet>" mà không chỗ nào điền span; nút "Thanh Toán đơn chi tiết" chưa chọn dòng thì báo "Vui lòng chọn đối tượng cần xóa?" (chữ sai ngữ cảnh của gốc). Đặt lại chữ cho đúng?
  - → Làm như hiện tại: Giữ nguyên chữ bản gốc.
- **[Cần quyết]** Danh mục VNPAY.CAUHINHTHANHTOAN / KHONGCHOPHEPSUASOTIEN được nạp nhưng bản gốc không dùng (ô tiền mở/khoá theo DUOCSUASOTIENCHITIET). Còn cần không?
  - → Làm như hiện tại: Vẫn nạp, không áp dụng.
- **[Kiểm trên host]** Đường lấy mã QR của từng ngân hàng (BIDV / VTB / VTB2 / VIB / mặc định) và vòng hỏi gạch nợ (KiemTraGachNoTheoDonHang sau 30 giây, lặp 10 giây) chỉ chạy được với dịch vụ thật — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Nhánh báo lỗi của VIB nay đọc obj.Result.STATUSCODE (bản gốc đọc obj.status.STATUSCODE → lỗi JS, không hiện gì) — xác nhận tên trường trong phản hồi thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Ô "chọn tất cả" của hộp "Danh sách" nay chạy thật (bản gốc không gắn xử lý) và CTT_ThongTinKetNoi/KetNoiVNPAY chuyển trang sang data.Data — kiểm trên cổng VNPAY thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/thoikhoabieu/lichhoc

- **[Cần quyết]** Nút Import của mẫu báo cáo: bản gốc không có vùng "#…_Import" nên nút chưa bao giờ hiện. Có bật import cho màn này không?
  - → Làm như hiện tại: Ẩn nút Import, chỉ còn "Báo cáo".
- **[Cần quyết]** Ô cảm xúc gửi strDaoTao_ChuongTrinh_Id RỖNG (gốc đọc ô không tồn tại). Có cần gửi chương trình đang học không?
  - → Làm như hiện tại: Gửi rỗng như gốc.
- **[Kiểm trên host]** "Từ khóa điểm danh" + Lưu ghi kèm IP và strNguoiThucHien_Id của người đang đăng nhập; ở vai trò thủ vai đó là ID sinh viên, cán bộ thật nằm ở strNguoiThucVai_Id — kiểm procedure ghi nhận đúng ai.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Danh sách lớp của buổi học gửi strNguoiThucHien_Id = userId (bản Cổng cán bộ gửi id sinh viên) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/thoikhoabieu/lichthi

- **[Cần quyết]** Anh/chị hỏi lại (23/09/2026): "lịch thi của các môn sinh viên vẫn đang học có hiện ra không?" — bảng "Lịch thi cá nhân" chỉ hiện lịch của HỌC KỲ đang chọn, đúng như bản gốc; muốn thấy cả môn đang học ở học kỳ khác thì phải bỏ lọc học kỳ. Giữ theo học kỳ, hay hiện tất cả rồi mới lọc?
  - → Làm như hiện tại: Theo học kỳ đang chọn; xoá ô Học kỳ thì hai bảng về rỗng.

### apiscongsinhvien/modules/thutuchanhchinh/xinxacnhan

- **[Cần quyết]** Sáu ô bản gốc gửi RỖNG vì đọc phần tử không tồn tại: dSoLuong, strMoTa, strDanhGiaChatLuong_Id, strSoDienThoaiNguoiNhan, strDiaChiNguoiNhan, strEmailNguoiNhan (và strNhanXet của đánh giá). Có cần mở ô nhập cho các trường này không?
  - → Làm như hiện tại: Gửi rỗng đúng như bản gốc.
- **[Kiểm trên host]** Lưu ô tự nhập luôn dùng action "Thêm" (bản gốc đọc strId ở ô txtAAAA không tồn tại nên không bao giờ vào nhánh Sửa) → sửa lại giấy tờ cũ có sinh bản ghi trùng không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Mở biểu mẫu bằng nút biểu tượng trên thẻ (Sửa / Xem) thay vì bấm cả dải tiêu đề thẻ như gốc — vì trong thẻ có ô nhập của khối trao đổi. Đồng ý?
  - → Làm như hiện tại: Bấm nút trên thẻ.
- **[Cần quyết]** Thẻ bỏ 8 màu nền luân phiên của bản gốc (arrMau), chỉ còn tiêu đề đậm như mọi lưới thẻ khác. Đồng ý?
  - → Làm như hiện tại: Bỏ màu nền luân phiên.

### apiscongsinhvien/modules/thutuchanhchinh/yeucau

- **[Cần quyết]** Nút "Hủy" của bản gốc XOÁ luôn yêu cầu (kể cả khi đang sửa yêu cầu cũ) rồi mới quay lại. Bản mới giữ hành vi đó nhưng HỎI LẠI trước. Giữ hay đổi thành "chỉ thoát, không xoá"?
  - → Làm như hiện tại: Vẫn xoá, có hỏi lại.
- **[Kiểm trên host]** Ô "Địa chỉ nhận mong muốn" ở bản gốc không có id nên luôn gửi rỗng — bản mới nối đúng ô vào strDiaChiNhanMongMuon. Kiểm dữ liệu lưu trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Ô kiểu LIST của biểu mẫu động ở bản gốc không bao giờ có lựa chọn (đổ danh mục vào ô khác, lại chỉ nạp khi đã có dữ liệu cũ) — bản mới luôn nạp danh mục rồi chọn giá trị đã lưu. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Cột "Xem" của bản gốc làm đúng việc của cột "Sửa" (mở biểu mẫu khai); "Thời gian nhận dự kiến" không nguồn dữ liệu. Có cần một chế độ CHỈ XEM thật không?
  - → Làm như hiện tại: Giữ như bản gốc.
- **[Cần quyết]** Mở biểu mẫu là TẠO NGAY một bản ghi yêu cầu (dHanhDong = 0), "Gửi yêu cầu" mới cập nhật (dHanhDong = 1) — như gốc, nên mở rồi bỏ đi sẽ để lại bản ghi dở. Có cần dọn không?
  - → Làm như hiện tại: Giữ đúng thứ tự gốc.

### apiscongsinhvien/modules/tinhhinhhocphi/dongphuc

- **[Cần quyết]** Bản gốc gửi strMinhChung = đường dẫn giả "C:\fakepath\<tên tệp>" và KHÔNG có đường tải tệp lên. Cần API tải tệp minh chứng không?
  - → Làm như hiện tại: Gửi tên tệp đã chọn, không tải lên.
- **[Kiểm trên host]** "Hủy đăng ký" nay hỏi lại một lần rồi chạy tuần tự kèm tiến độ — kiểm số bản ghi bị xoá trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/tinhhinhhocphi/quyettoan

- **[Cần quyết]** Dòng lưu ý dưới bảng lấy từ MOTA của đợt; đợt không có MOTA thì để TRỐNG (như gốc — câu lưu ý viết cứng trong html chỉ hiện trước khi chọn đợt đầu tiên). Có giữ câu mặc định khi MOTA rỗng không?
  - → Làm như hiện tại: Để trống.

### apiscongsinhvien/modules/tinhhinhhocphi/thuhocphi

- **[Cần quyết]** Bản gốc CHƯA TỪNG CHẠY: html gọi new ThuHocPhi() nhưng tệp .js khai lớp TinhHinhHocPhi, và html là trang mẫu tĩnh (dữ liệu viết cứng). Bản mới dựng lại theo bố cục trang mẫu, dữ liệu lấy từ LayThongTinChiTietHoSo + LayDSTinhTrangTaiChinh + LayDSKhoanNoChung. Xác nhận bảng "Thông tin thanh toán" đúng là khoản nợ chung?
  - → Làm như hiện tại: Dựng theo trang mẫu.
- **[Cần quyết]** Ô "Chọn hình thức thanh toán" và nút "Thực hiện thanh toán" không có nguồn dữ liệu / không có xử lý ở bản gốc. Nối vào cổng thanh toán nào?
  - → Làm như hiện tại: Giữ, đặt khoá.
- **[Cần quyết]** Cột "Ghi chú" đọc GHICHU — procedure có thể không trả cột này; trang mẫu còn có ô "Khóa" mà procedure hồ sơ không trả.
  - → Làm như hiện tại: Thiếu thì để trống; không vẽ ô "Khóa".

### apiscongsinhvien/modules/tinhhinhhocphi/tinhhinhhocphi

- **[Cần quyết]** Hai nút "Chi tiết" ở danh sách phiếu đã thu / phiếu đã rút: bản gốc KHÔNG có xử lý. Có mở xem phiếu (ums.phieu.viewer — PHIEUTHU / BIENLAIRUT) không?
  - → Làm như hiện tại: Giữ nút, đặt khoá.
- **[Cần quyết]** Ba thẻ bản gốc ẩn cứng (Tổng nợ riêng · Tổng dư riêng · Khoản đã nộp chưa xuất hóa đơn) — có cần hiện lại không? Thẻ cuối là lối vào duy nhất của bảng xuất hoá đơn ở màn này nên ở gốc bảng đó không với tới được.
  - → Làm như hiện tại: Không vẽ; bảng xuất hoá đơn nằm ở màn Xuất hoá đơn.
- **[Cần quyết]** Mã QR thanh toán để cứng ngân hàng 970418 và accountName "LU A TUAN" (giống phieuthu/thutien của Tài chính).
  - → Làm như hiện tại: Giữ nguyên như gốc.

### apiscongsinhvien/modules/tinhhinhhocphi/xuathoadon

- **[Cần quyết]** Nút "Xem hóa đơn nháp" bản gốc không có xử lý và còn bị đoạn nạp danh mục ghi đè mất. Bỏ hẳn hay nối vào HDDT_HoaDon/ThemMoi_Nhap?
  - → Làm như hiện tại: Giữ nút, đặt khoá.
- **[Kiểm trên host]** Bản gốc đổi base URL dịch vụ HĐĐT theo THONGTIN4 của từng nút; bản mới gọi thẳng theo tiền tố HDDT trong Config.js — kiểm trên host xem có trường nào dùng địa chỉ riêng theo nút.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Gốc gửi strDaoTao_ToChucCT_Id = thuộc tính chưa bao giờ được gán (undefined) → bản mới gửi rỗng. Procedure có cần chương trình đào tạo không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/tintuc/tintuc

- **[Kiểm trên host]** ĐÃ LÀM nút "Bỏ lưu" (anh/chị chốt 23/09/2026). Còn thiếu ENDPOINT: mã gốc chỉ có Thêm và Lấy danh sách — cần chuỗi action thật của pkg_tintuc.Xoa_TinTuc_BangTin_LuuTru để điền vào ACT.xoaLuu trong tintuc/script/_tintuc.js; chưa có thì nút báo "chưa có endpoint" (chế độ dựng thử vẫn chạy để xem cách hoạt động).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Khối thông báo đầu lưới tin nay LẤY TỪ API (LayDSTinTuc_BangTin_NguoiDung với dTinQuanTrong = 1) thay cho chữ viết cứng của bản gốc; lưới tin thường lọc bỏ tin quan trọng để không hiện hai lần. Kiểm cờ tin quan trọng trên dữ liệu thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Tin không có ảnh: bỏ ảnh mặc định Core/images/thongbao.jpg của bản gốc, để biểu tượng tờ báo như bản dựng (anh/chị chốt 23/09/2026). Đồng ý?
  - → Làm như hiện tại: Hiện biểu tượng.
- **[Kiểm trên host]** Ngày giờ của bình luận nay đưa qua bộ định dạng chung ums.ui.ngayGio → luôn hiện dd/MM/yyyy HH:mm dù máy chủ trả ISO hay kiểu khác. Kiểm dạng ngày thật trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/tintuc/vanban

- **[Cần quyết]** Bỏ cột "Files" (tiêu đề đã bị chú thích sẵn trong html gốc, không dòng nào đổ dữ liệu). Đồng ý?
  - → Làm như hiện tại: Đã bỏ.
- **[Kiểm trên host]** Mỗi dòng gọi riêng TT_Files/LayDanhSach để lấy tệp cho cột "Số kí hiệu" (như gốc) — danh sách dài thì bằng N lời gọi; kiểm số lượng văn bản thật trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/xebus/vethang

- **[Cần quyết]** Ô "Loại xe" trong bảng KHÔNG bọc select2 nữa (luật chung 2026-09-22: ô chọn ít mục trong bảng dùng ô gốc). Đồng ý?
  - → Làm như hiện tại: Dùng ô chọn gốc.
- **[Cần quyết]** strTuKhoa gửi rỗng như bản gốc (đọc ô txtAAAA không tồn tại) — màn này có cần ô tìm kiếm không?
  - → Làm như hiện tại: Không vẽ ô tìm.

### apiscongsinhvien/modules/xebus/xebus

- **[Cần quyết]** "Phí phải nộp" bản gốc viết cứng "00.00đ" — không lời gọi nào lấy số tiền. Lấy phí từ đâu?
  - → Làm như hiện tại: Hiện 0.
- **[Cần quyết]** Nút "Thanh toán" bản gốc không có xử lý → giữ nút, đặt khoá. Nối vào cổng thanh toán nào?
  - → Làm như hiện tại: Giữ nút, đặt khoá.
- **[Kiểm trên host]** Ảnh cá nhân khi lưu vẫn gửi đường dẫn TẠM (unsave_…) mà không gọi copyfile, đúng như gốc — kiểm ảnh có lưu được trên host không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Bản gốc bấm "Cập nhật" lần thứ hai là gửi Thêm lần nữa cho cùng tháng / tuyến (đăng ký TRÙNG, vì không nạp lại trạng thái). Bản mới nạp lại sau khi lưu nên hết trùng — có cần rà dữ liệu trùng cũ trên hệ đang chạy không?
  - → Làm như hiện tại: Đã sửa.

### apistaichinh/modules/chungtu/chungtu

- **[Cần quyết]** VAT hoá đơn (bản gốc thêm 2026-09-22): mã gốc không gán strVAT nên luôn gửi rỗng, báo "VAT khác nhau" ở mọi dòng có VAT mà VẪN lưu. Bản mới gửi VAT dòng đầu và CHẶN khi các khoản khác VAT. Đúng ý không?
  - → Làm như hiện tại: Làm theo ý định: một VAT / hoá đơn, khác nhau thì dừng.

### apistaichinh/modules/danhmucheso/hesolophocphan

- **[Kiểm trên host]** Xoá nay gửi ID bản ghi (bản gốc gửi chuỗi ghép). Đúng ý procedure không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apistaichinh/modules/danhmucheso/kehoachthuchi

- **[Cần quyết]** Đã bỏ phần "thêm cán bộ sử dụng" (bản gốc lỗi JS, ghi rác). Có cần làm lại chức năng này?
  - → Không làm lại (bản gốc lỗi JS, chưa từng chạy).

### apistaichinh/modules/hoadon/hoadonnhap

- **[Cần quyết]** Bản nháp của người học gửi strLoaiDoiTuong = DOITUONGKHAC (gốc so indexOf ngược). Giữ hay sửa?
  - → Làm như hiện tại: Giữ như bản gốc.

### apistaichinh/modules/hoadon/tracuusohoadon

- **[Kiểm trên host]** "Đồng bộ hoá đơn điện tử" chưa từng chạy ở bản gốc — bản mới làm theo đúng ý định. Thử trên host trước khi giao.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apistaichinh/modules/hoadon/xuathoadon

- **[Cần quyết]** Ô tiền không kiểm định dạng — gõ "1.500.000" bị hiểu là 1,5. Có thêm kiểm tra không?
  - → Làm như hiện tại: Giữ như bản gốc.

### apistaichinh/modules/hoadon/xuatlohoadon

- **[Kiểm trên host]** Xem nháp gửi thêm strTaiChinh_SoTien_TruocThue_s / strVat (cột SOTIENTRUOCVAT, VAT của danh sách xem trước) — kiểm cột có trả về.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apistaichinh/modules/khaidonviphi/dongiatheodai

- **[Cần quyết]** Nút Xoá đã bỏ (bản gốc gọi nhầm TN_KeHoach/Xoa); thiếu nguồn "phạm vi áp dụng". Xoá bằng hàm nào?
  - → Giữ không có nút Xoá; màn không có trên menu Tài chính của host.
- **[Cần quyết]** "Kiểu học" có thật sự phụ thuộc "Thời gian" không? (để khoá cha → con)
  - → Làm như hiện tại: Chưa khoá.

### apistaichinh/modules/khaidonviphi/donviphikhoa

- **[Cần quyết]** Bản gốc chưa từng vẽ được bảng — đã dựng lại theo donviphimoict. Màn này còn dùng hay đã thay bằng donviphimoi*?
  - → Giữ bản dựng lại; màn KHÔNG có trên menu Tài chính của host (host dùng donviphimoi*).

### apistaichinh/modules/khaidonviphi/donviphilop

- **[Cần quyết]** Bản gốc chưa từng vẽ được bảng — đã dựng lại theo donviphimoict. Màn này còn dùng hay đã thay bằng donviphimoi*?
  - → Giữ bản dựng lại; màn KHÔNG có trên menu Tài chính của host (host dùng donviphimoi*).

### apistaichinh/modules/miengiam/dinhmucmiengiam

- **[Cần quyết]** Danh sách đối tượng (khung chung _doituong) có vẽ kiểu CÂY DANH MỤC không?
  - → Giữ kiểu bảng như hiện tại; màn không có trên menu Tài chính của host.

### apistaichinh/modules/miengiam/hesodoituong

- **[Cần quyết]** Danh sách đối tượng (khung chung _doituong) có vẽ kiểu CÂY DANH MỤC không?
  - → Giữ kiểu bảng như hiện tại; màn không có trên menu Tài chính của host.

### apistaichinh/modules/phieuthu/pos_thutien

- **[Cần quyết]** "Xuất biên lai" — bản gốc gửi sai cột lên TC_DaNop/ThemMoi; bản mới đã gửi đúng cột. Giữ bản sửa hay tắt nút?
  - → Làm như hiện tại: Đã sửa.

### apistaichinh/modules/phieuthu/thutien

- **[Cần quyết]** Mã QR VietQR đang chép cứng accountName = "LU A TUAN". Lấy từ cấu hình nào?
  - → Làm như hiện tại: Giữ như bản gốc.

### apistaichinh/modules/phieuthu/thutienkhac

- **[Cần quyết]** "Xuất hoá đơn" (tab nộp trước) — bản gốc gửi sai cột lên TC_DaNop/ThemMoi; bản mới đã gửi đúng. Giữ bản sửa hay tắt nút?
  - → Làm như hiện tại: Đã sửa.

### apistaichinh/modules/thongke/theodoicongno

- **[Kiểm trên host]** Bản mới gửi giá trị ô lọc mà bản gốc bỏ quên — kiểm kết quả trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

## Gỡ nhóm Dev — 2026-09-24 (người dùng: "dev chỉ chuyển cũ sang mới")

- **apistaichinh/modules/apdungrieng/dongialoprieng** — Menu (chức năng, MAUNGDUNG = ApisTaiChinh) trỏ tới tệp màn KHÔNG tồn tại — bản cũ trên host trả 404; đã dò cả 26 phân hệ trên host và toàn bộ repo loginVT-main, không có. Dev có mã màn này không? Không có thì gỡ khỏi menu.
  - → Gỡ khỏi sổ. Màn vẫn hiện "chưa chuyển đổi" (bản cũ cũng 404).
- **apistaichinh/modules/apdungrieng/dongiasinhvien** — Menu (chức năng, MAUNGDUNG = ApisTaiChinh) trỏ tới tệp màn KHÔNG tồn tại — bản cũ trên host trả 404; đã dò cả 26 phân hệ trên host và toàn bộ repo loginVT-main, không có. Dev có mã màn này không? Không có thì gỡ khỏi menu.
  - → Gỡ khỏi sổ. Màn vẫn hiện "chưa chuyển đổi" (bản cũ cũng 404).
- **apistaichinh/modules/apdungrieng/xacdinhloprieng** — Menu (chức năng, MAUNGDUNG = ApisTaiChinh) trỏ tới tệp màn KHÔNG tồn tại — bản cũ trên host trả 404; đã dò cả 26 phân hệ trên host và toàn bộ repo loginVT-main, không có. Dev có mã màn này không? Không có thì gỡ khỏi menu.
  - → Gỡ khỏi sổ. Màn vẫn hiện "chưa chuyển đổi" (bản cũ cũng 404).
- **apistaichinh/modules/dulieuhocphi/chuyendulieudkh** — Menu (chức năng, MAUNGDUNG = ApisTaiChinh) trỏ tới tệp màn KHÔNG tồn tại — bản cũ trên host trả 404; đã dò cả 26 phân hệ trên host và toàn bộ repo loginVT-main, không có. Dev có mã màn này không? Không có thì gỡ khỏi menu.
  - → Gỡ khỏi sổ. Màn vẫn hiện "chưa chuyển đổi" (bản cũ cũng 404).
- **apistaichinh/modules/hoadon/phanbo_khoanthu** — Menu (chức năng, MAUNGDUNG = ApisTaiChinh) trỏ tới tệp màn KHÔNG tồn tại — bản cũ trên host trả 404; đã dò cả 26 phân hệ trên host và toàn bộ repo loginVT-main, không có. Dev có mã màn này không? Không có thì gỡ khỏi menu.
  - → Gỡ khỏi sổ. Màn vẫn hiện "chưa chuyển đổi" (bản cũ cũng 404).
- Câu cấu hình VTB "DHLAMNGHIEP" (`thongtinsinhvien/thanhtoanonline`) → CHUYỂN sang nhóm Quản trị Oracle / cấu hình (thông tin cổng thanh toán thật).

## Chốt ngày 2026-09-26 — theo phương án tạm (người dùng giao)

438 mục.

### apischuyencan/modules/nhapchuyencan/khongdiemdanh

- **[Kiểm trên host]** Dòng thêm từ hộp chọn sinh viên (PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc): bản gốc đọc cột MASO / HODEM / TEN / LOP / LOP_ID mà nguồn này trả QLSV_NGUOIHOC_* / DAOTAO_LOPQUANLY_* → bản mới đọc cả hai. Kiểm tên cột và strQLSV_NguoiHoc_Id = ID dòng hộp chọn.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apischuyencan/modules/nhapchuyencan/nhapchuyencan

- **[Cần quyết]** Ô đã có chuyên cần mà chỉ đổi SỐ BUỔI rồi Lưu: bản gốc gọi lại Them_QLSV_NguoiHoc_ChuyenCan (strId rỗng), không gọi Sửa — máy chủ ghi đè hay tạo bản ghi trùng?
  - → Làm như hiện tại: Giữ như gốc (luôn Thêm). Màn "theo danh sách học" thì gọi Sửa với ID bản ghi.

### apischuyencan/modules/nhapchuyencan/nhaptheolop

- **[Cần quyết]** Ô lọc Loại danh sách → Thời gian → Lớp quản lý → Học phần nay nối tầng (chưa chọn ô trên thì khoá ô dưới). Bản gốc cho chọn tự do.
  - → Làm như hiện tại: Khoá theo luật chung cha → con.
- **[Kiểm trên host]** Sửa ô đã có gửi strId = cột ID của CC_NguoiHoc_ChuyenCan/LayKetQuaChuyenCanTheoNgay (như gốc) — kiểm có đúng ID bản ghi chuyên cần.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apischuyencan/modules/tonghop/tonghoptheongay

- **[Kiểm trên host]** Bỏ đánh dấu một ô rồi Lưu: bản gốc gửi RỖNG mã người học / kiểu / lớp / ngày (khai trùng khoá) nên chưa từng xoá đúng ô. Bản mới gửi đủ — đường xoá chưa từng chạy, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Xuất báo cáo chưa từng chạy ở gốc (gọi hàm không tồn tại). Bản mới gửi đủ tham số lọc; strDiem_DanhSachHoc_Id vẫn mang giá trị ô "Từ ngày" như gốc — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Lưu không gửi số buổi (dSoLuong) — như gốc. Ô số ở màn này chỉ để xem, hay phải lưu như màn Nhập chuyên cần?
  - → Làm như hiện tại: Giữ như gốc (không gửi).

### apiscms/modules/baocao/kehoach

- **[Cần quyết]** Lưu kế hoạch gửi strTrangThai_Id = giá trị ô LỌC trạng thái (biểu mẫu không có ô trạng thái) — đúng ý nghiệp vụ?
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Xoá kế hoạch: nếu máy chủ trả Message kèm (gốc hiện Message thay câu "thành công") thì bản mới không hiện Message đó.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/baocao/khaibao

- **[Cần quyết]** strTuKhoa gốc đọc ô txtAAAA không tồn tại → luôn rỗng; ô từ khoá chỉ lọc trang đang hiện.
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Ô "Trực thuộc" khi sửa cấu trúc nay đổ khoá cha của cây (gốc đổ THANHPHAN_CHA_ID nên lưu là mất cha) — kiểm sửa cột chính/phụ giữ đúng cha.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/baocao/thuchien

- **[Kiểm trên host]** Cấu trúc lấy theo ID dòng danh sách, dữ liệu dòng lấy theo THBC_HETHONGBAOCAO_ID (hai khoá khác nhau như gốc) — kiểm lưới ra đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Cột phụ có MABANGDM_THANHPHAN_DULIEU nay là ô chọn danh mục (gốc lỗi nên luôn là ô chữ) — kiểm giá trị lưu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút "Sửa" mỗi dòng không có xử lý ở gốc → đang khoá. Có cần chức năng này không?
  - → Làm như hiện tại: Khoá

### apiscms/modules/chucnang/chucnang

- **[Cần quyết]** Sửa chức năng: bản gốc luôn để trống ô "Phạm vi" (không đọc cột từ dữ liệu), nên lưu mà không chọn lại là gửi strNGUONTRUYCAP_Id rỗng, xoá mất phạm vi cũ. Giữ như gốc hay nạp lại giá trị cũ (cần biết tên cột phạm vi trả về)?
  - → Làm như hiện tại: Giữ như gốc: ô Phạm vi trống mỗi lần mở Sửa.
- **[Cần quyết]** Xoá chức năng: bản gốc XOÁ NGAY khi bấm "Xóa", không hỏi lại. Bản mới hỏi lại trước khi gọi XoaChucNang. Đồng ý?
  - → Làm như hiện tại: Hỏi lại rồi mới xoá; lỗi thì ở lại vùng "nội dung liên quan".
- **[Cần quyết]** Vùng xoá: "Vai trò thuộc chức năng" chỉ lấy 10 dòng đầu (pageSize mặc định của gốc). Có cần lấy đủ?
  - → Làm như hiện tại: Giữ 10 dòng như gốc.
- **[Cần quyết]** Nút "Tải file" chỉ hiện với tài khoản 4038E6FD0FFA4D339FA991E740348F01 và ghép câu SQL vào URL ExportDataInTable.aspx. Giữ hay bỏ?
  - → Làm như hiện tại: Giữ nguyên điều kiện và URL như gốc.
- **[Kiểm trên host]** Xoá chức năng khỏi mọi người dùng (XoaChucNangTheoNguoiDung) gửi ID chức năng dưới tên tham số strUngDung_Id (như gốc) — kiểm procedure có xoá đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Quyền: đang sửa một dòng mà chọn thêm hành động thì mỗi hành động một lời gọi Sua_Core_Quyen trên CÙNG strId (như gốc) — kiểm kết quả trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/chucnang/configurechucnang

- **[Cần quyết]** Công cụ sinh mã của lập trình viên (chạy SQL tự do từ trình duyệt, eval, cấu hình trong localStorage; bản gốc lỗi ngay khi mở nếu thiếu cấu hình). Gỡ khỏi menu hay giữ làm công cụ nội bộ?
  - → Làm như hiện tại: Không dựng lại — chỉ khung giải thích.

### apiscms/modules/chucnang/sodoquytrinh

- **[Cần quyết]** Bản gốc chưa bao giờ hiện nội dung (bấm chức năng gọi hàm không tồn tại → lỗi JS, khung phải trống). Bản mới chỉ có ứng dụng + cây. Màn này cần hiện "sơ đồ quy trình" gì — hay gỡ khỏi menu?
  - → Làm như hiện tại: Hiện cây, khung phải báo "chưa có nội dung, chờ nghiệp vụ".

### apiscms/modules/chucnang/testchucnang

- **[Cần quyết]** Trang thử nội bộ (bảng 10 dòng viết cứng + mã thử ký số MISA không dùng). Gỡ khỏi menu?
  - → Làm như hiện tại: Không dựng lại — chỉ khung giải thích.

### apiscms/modules/danhmuc/autologdb

- **[Cần quyết]** Update ghi đè package body lên CSDL đang chạy (chèn insert into bot). Khung "Code update" nay chỉ đọc (gốc cho gõ nhưng gửi mã tự sinh).
  - → Làm như hiện tại: Chỉ đọc
- **[Kiểm trên host]** Kiểm SeaGate_CommentSQL trên package thật (nhiều procedure, chú thích, OUT) trước khi dùng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/cautrucnoidungguiemail

- **[Cần quyết]** CKEditor → ô mã HTML + khung xem trước (sandbox). Có cần trình soạn thảo trực quan không?
  - → Làm như hiện tại: Ô mã HTML + xem trước

### apiscms/modules/danhmuc/cloudupdate

- **[Kiểm trên host]** Máy chủ khác HIENTAI: GET cross-domain không token tới <MA>/CMSAPI/api/CMS_UpCode/CloudUpdate — cần CORS phía máy chủ đích.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Gốc gọi CloudUpdate N lần (N = số project) và báo lỗi thành "Update thành công" — nay gọi một lần, báo lỗi thật.
  - → Làm như hiện tại: Đã sửa

### apiscms/modules/danhmuc/comparetable

- **[Cần quyết]** Không chép chuỗi kết nối CSDL mã hoá viết cứng làm mặc định; nhận giá trị hệ cũ đã nhớ ở localStorage "connectString" nếu cùng tên miền. Có cần mặc định không (nên để ở cấu hình, không để trong mã)?
  - → Làm như hiện tại: Ô trống
- **[Cần quyết]** Lệnh sinh ra luôn viết KIEU(DO_DAI) kể cả DATE/NUMBER (vd NUMBER(22)), CREATE kết thúc " /" — y như gốc. Oracle có thể từ chối DATE(7).
  - → Làm như hiện tại: Giữ nguyên chuỗi gốc
- **[Kiểm trên host]** Khung Package: mã pin nhập ở hộp riêng, chép spec rồi body lần lượt (gốc song song, pin rỗng). Thử trên CSDL thử.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/danhmucdulieu

- **[Cần quyết]** Bản CMS chuyển riêng (không dùng tệp Tài chính) vì dùng action mã hoá + func, lọc ứng dụng, cây phân trang, Export. Nguồn "Dữ liệu cha" gốc dựng từ kết quả ĐÃ LỌC rồi tự xoá ô lọc.
  - → Làm như hiện tại: Chỉ dựng lại danh sách cha khi nạp không lọc (cha và từ khoá trống); không thêm lời gọi.
- **[Cần quyết]** Tiêu đề bảng gốc có ThongTin7/8 nhưng thân bảng không vẽ (lệch cột).
  - → Làm như hiện tại: ThongTin7/8 chỉ có trong biểu mẫu, như bản Tài chính.
- **[Kiểm trên host]** Lưu (ThemMoi/CapNhat mã hoá, không func, gửi iM tường minh) và Export ExportDataInDanhMuc.aspx — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/danhmucexport

- **[Cần quyết]** "Tạo mới tham số" gốc không bao giờ lưu được (resetPopup xoá id hàm → luôn báo "Hãy chọn hàm").
  - → Làm như hiện tại: Giữ hàm đang chọn, lưu qua CMS_DanhMucExport/ThemMoiThamSo.
- **[Cần quyết]** "Sửa hàm" gốc gửi strId rỗng → tạo hàm TRÙNG mà báo cập nhật thành công.
  - → Làm như hiện tại: Gửi strId + action cập nhật CMS_DanhMuc_MH/EjQgAyAvJgUgLykMNCIP (như danhmuctenbang).
- **[Cần quyết]** Nhãn biểu mẫu "Kiểu số(0), Kiểu chữ(1)" ngược với cột "Kiểu chữ(0), Kiểu số(1)".
  - → Làm như hiện tại: Giữ cả hai như gốc.
- **[Kiểm trên host]** Sửa hàm (đường GHI mới) và id hàm mới đọc ở data.Message — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/danhmucimport

- **[Cần quyết]** Ô chọn ứng dụng và ô từ khoá ở cột trái gốc không gắn xử lý (id sai).
  - → Làm như hiện tại: Cho chạy: chọn ứng dụng / Enter / kính lúp thì nạp lại danh sách hàm.
- **[Cần quyết]** Tham số tách từ SQL mà không nhận ra kiểu thì gốc lỗi JS; SQL viết HOA "CREATE OR REPLACE" thì tên package rỗng (như gốc).
  - → Làm như hiện tại: Bỏ qua dòng không nhận ra kiểu; giữ nguyên cách tách tên package.
- **[Kiểm trên host]** Tạo hàm có SQL: ThemBangDanhMuc (dTrangThai 995) rồi từng CMS_DanhMucDuLieu/ThemMoi — kiểm data.Id trả về và thứ tự HESO1.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/danhmuctenbang

- **[Cần quyết]** Ô "Quan hệ cha" gốc không bao giờ được nạp → luôn gửi "" → sửa bảng là mất quan hệ cha.
  - → Làm như hiện tại: Nạp danh sách bảng (LayDanhSachDanhMuc dTrangThai 1, pageSize 100000) cho ô này và giữ giá trị cũ khi sửa.
- **[Cần quyết]** Chi tiết gốc đọc ứng dụng ở cột UNGDUNG_ID (các màn khác đọc NHOMDANHMUC_ID).
  - → Làm như hiện tại: Đọc UNGDUNG_ID, trống thì NHOMDANHMUC_ID.
- **[Cần quyết]** Ô "Ứng dụng" có (*) nhưng gốc không kiểm.
  - → Làm như hiện tại: Bắt buộc.
- **[Kiểm trên host]** Sửa bảng: action cập nhật EjQgAyAv… vẫn kèm func ThemBangDanhMuc như gốc — kiểm có cập nhật đúng (không tạo trùng).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/danhmucthuoctinh

- **[Cần quyết]** Nút sửa gốc gọi LayThongTinDanhMucTheoId (procedure lấy thông tin BẢNG, không phải thuộc tính).
  - → Làm như hiện tại: Vẫn gọi, nhưng chỉ đổ vào biểu mẫu khi kết quả có cột TENTRUONGDULIEU; không có thì giữ giá trị dòng.
- **[Kiểm trên host]** Mở sửa một thuộc tính: kiểm LayThongTinDanhMucTheoId trả gì với id thuộc tính.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/danhmuctukhoa

- **[Cần quyết]** Ứng dụng → Chức năng chỉ dùng gán cho dòng MỚI; danh sách không lọc theo hai ô này (gốc không gửi).
  - → Làm như hiện tại: Giữ như gốc; chưa chọn ứng dụng thì khoá Chức năng (luật cha → con).
- **[Kiểm trên host]** Dòng mới chưa chọn chức năng thì strChucNang_Id rỗng và hệ tự điền id chức năng của màn đang mở (như makeRequest gốc) — kiểm dữ liệu ghi ra.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/exporttable

- **[Kiểm trên host]** Tải file mở <rootPathReport>/Modules/Common/ExportDataInTable.aspx — kiểm rootPathReport của chức năng này trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Import chỉ chạy khi bấm Upload + hỏi lại (gốc import ngay khi chọn tệp).
  - → Làm như hiện tại: Bấm Upload mới chạy

### apiscms/modules/danhmuc/import

- **[Cần quyết]** Bảng "Lịch sử import" gốc không có lời gọi nạp nào.
  - → Làm như hiện tại: Giữ khung, luôn trống — cần chỉ ra nguồn nếu muốn hiện.
- **[Kiểm trên host]** Import từng sheet mở Handler/Import.aspx?fileName=…&sheetName=… — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/danhmuc/mauphoiin

- **[Kiểm trên host]** Sửa mẫu gửi func "CMS_BaoCao_ThongTin_MH/Sua_MauPhoiIn" (không phải tên procedure) — chép nguyên của gốc.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Lưu phôi luôn gửi strTenPhoi rỗng (ô txtTenBang đã bị bỏ trong html gốc) — ghi đè TENPHOI mỗi lần lưu. Có cần ô Tên phôi?
  - → Làm như hiện tại: Giữ như gốc: gửi rỗng
- **[Kiểm trên host]** Ảnh scan: getDimensions.ashx + copyfile với strId = <userId>_<rộng>_<cao>; khổ trang tách từ tên tệp theo "_". Kiểm ảnh và khổ trang trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nội dung phôi hiện dạng chữ thuần; lưu gửi textContent (gốc gửi innerHTML). Nội dung có thẻ HTML sẽ hiện nguyên chữ.
  - → Làm như hiện tại: Chữ thuần

### apiscms/modules/danhmuc/upcode

- **[Kiểm trên host]** Tải gói .zip lên <rootPathUpload>/Handler/deploycode.ashx rồi CMS_UpCode/UpCode — đường GHI triển khai mã, thử trên host thử.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Hai ảnh hướng dẫn nằm ở apis.com.vn — để thành liên kết, không nhúng. Có muốn chép ảnh vào dự án không?
  - → Làm như hiện tại: Liên kết ngoài

### apiscms/modules/hangdoi/quanlytientrinhguiemail

- **[Cần quyết]** Mở màn không tự nạp danh sách (như gốc) — có muốn tự nạp không?
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Lịch sử gửi dùng chung ô từ khoá của thanh lọc làm strTuKhoa (như gốc) — kiểm lịch sử không bị lọc mất.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/hethong/accessedhistory

- **[Kiểm trên host]** "Tất cả chức năng" (lọc rỗng) thì makeRequest gốc và ums.api đều tự điền strChucNang_Id = id của chính màn này → có thể chỉ ra lịch sử của màn này. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút "Test connect" bắn 1.000 lời gọi danh sách (nay có hỏi lại) — có giữ nút này trên hệ thật không?
  - → Làm như hiện tại: Giữ, có hỏi lại

### apiscms/modules/hethong/config_app

- **[Cần quyết]** Bản gốc chưa từng chạy (lỗi cú pháp + return sớm). Bản mới dựng theo ý định: danh sách ứng dụng từ tệp XML, sửa từng thông số có hỏi lại.
  - → Làm như hiện tại: Đã dựng lại theo ý định
- **[Cần quyết]** Mã gốc config_app.js chứa TOKEN API Freshworks CRM viết cứng và POST dữ liệu cá nhân mẫu ra ngoài — nên gỡ khỏi mã gốc và thu hồi token.
  - → Làm như hiện tại: Bản mới không chép
- **[Kiểm trên host]** SYS_Xml/EditNode: strNode có đoạn "nghiệp vụ" luôn rỗng (Root##UngDung#ThamSo) như gốc — kiểm máy chủ ghi đúng nút.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/hethong/crypto

- **[Cần quyết]** Gốc điền sẵn chuỗi kết nối CSDL (User ID/Password) và mã bí mật mặc định vào ô nhập. Bản mới để trống. Có cần giá trị mặc định không?
  - → Làm như hiện tại: Để trống

### apiscms/modules/hethong/guiemail

- **[Cần quyết]** strTuKhoa gốc đọc ô txtAAAA không tồn tại → luôn rỗng; ô từ khoá chỉ lọc trên danh sách đã tải.
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Chọn N người gửi ở "Danh mục người gửi" thì MỖI thư gửi N lần (mỗi người gửi một lần) — đúng ý nghiệp vụ hay nên chọn ngẫu nhiên một người gửi?
  - → Làm như hiện tại: Giữ như gốc (gửi N lần)
- **[Cần quyết]** "Sử dụng người gửi này" lưu cả MẬT KHẨU email vào localStorage trình duyệt như gốc — có giữ không?
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Tệp đính kèm tải lên Handler/up_fileImport.ashx (không giới hạn đuôi) và arrFileDinhKem khi không có tệp là [""] như gốc — kiểm gửi thư có/không có tệp.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/nguoidung/canbochucnang

- **[Cần quyết]** Bản gốc nạp danh sách ứng dụng bằng hai lời gọi song song cùng đổ vào hai ô. Bản mới tách: ô "Chọn ứng dụng" bên trái lấy danh sách theo quyền người đăng nhập, ô Ứng dụng trong khung Thêm lấy toàn bộ. Đúng ý nghiệp vụ không?
  - → Làm như hiện tại: Tách như trên
- **[Cần quyết]** "Thêm cán bộ" / xoá cán bộ gửi strUngDung_Id theo ô "Chọn ứng dụng" kể cả khi ô trống. Có bắt chọn ứng dụng trước không?
  - → Làm như hiện tại: Không bắt (như gốc)
- **[Kiểm trên host]** Cây chức năng lấy theo strNguoiDung_Id = người đăng nhập (chỉ thấy chức năng mình có); cùng luật đánh dấu con → tự đánh dấu cha như màn Người dùng - chức năng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/nguoidung/nguoidung

- **[Cần quyết]** Mở màn gửi strPhanLoaiDoiTuong rỗng (tất cả) dù html gốc tích sẵn "Cán bộ". Bản mới giữ lời gọi rỗng và không tô sẵn loại nào. Có nên mặc định "Cán bộ" không?
  - → Làm như hiện tại: Gửi rỗng, chưa chọn loại nào
- **[Cần quyết]** Nút "Chi tiết" của Nghiên cứu sinh / Phụ huynh / Đối tác ở bản gốc không làm gì. Có cần danh sách khởi tạo cho ba loại này không?
  - → Làm như hiện tại: Giữ nút, khoá lại
- **[Kiểm trên host]** Tạo mới tài khoản gửi strFirstName = Tên, strLastName = Họ; còn Kích hoạt lại gửi strFirstName = HODEM, strLastName = TEN (ngược nhau). Procedure hiểu thế nào? (chép nguyên cả hai)
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** "Xác nhận kế thừa" ghi quyền cho nhiều người mà không hỏi lại (giống gốc). Có cần thêm bước hỏi lại không?
  - → Làm như hiện tại: Không hỏi lại
- **[Kiểm trên host]** CMS_Custom/ResetPassword gửi strNguoiThucHienId (không có dấu gạch dưới) — kiểm máy chủ có nhận người thực hiện không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/nguoidung/nguoidungchucnang

- **[Cần quyết]** Cây chức năng: đánh dấu chức năng con thì bản mới tự đánh dấu chức năng cha (bản gốc jstree để cha lưng chừng và không gửi → mục mồ côi bị ẩn khỏi menu). Đồng ý không?
  - → Làm như hiện tại: Tự đánh dấu cha
- **[Cần quyết]** Ô "Vai trò" trong khung Thêm chưa từng được nạp ở bản gốc. Có cần lọc chức năng theo vai trò không?
  - → Làm như hiện tại: Giữ ô, khoá lại
- **[Kiểm trên host]** Thêm / xoá chức năng (CMS_QuanLyNguoiDung/ThemNguoiDungChucNang, XoaChucNangTheoNguoiDung với strUngDung_Id = ID chức năng) — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/nguoidung/nguoidungvaitro

- **[Kiểm trên host]** Xoa_Core_NhanSu_VaiTro chỉ gửi strId = ID dòng của LayDSVaiTroNguoiDung (bản gốc coi ID này là ID vai trò) mà không gửi id người dùng. Cần kiểm trên host: xoá có đúng một người không, hay gỡ vai trò của nhiều người?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/baocaoimport

- **[Cần quyết]** Ô "Quyền cần thiết lập" bị chú thích bỏ khỏi html gốc → strHanhDong_Id luôn gửi rỗng; bỏ luôn lời gọi LayDSHanhDongTheo (không nơi nào đọc).
  - → Làm như hiện tại: Gửi rỗng như gốc
- **[Cần quyết]** Ứng dụng → Chức năng nay KHOÁ (gốc nạp sẵn chức năng với ứng dụng rỗng).
  - → Làm như hiện tại: Khoá
- **[Kiểm trên host]** Kiểm trên host: ô "Cán bộ" của hộp Thêm mẫu chỉ có dữ liệu sau khi Tìm kiếm (như gốc).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/canbonhaphosocanbo

- **[Cần quyết]** Không chọn Trường thông tin thì strToHopBoDuLieuQuyen chỉ còn ID cán bộ (gốc vẫn gửi như vậy) — có nên bắt buộc chọn Trường thông tin?
  - → Làm như hiện tại: Giữ như gốc, không bắt buộc
- **[Kiểm trên host]** Kiểm trên host: LayDSQuyenNhanSuNhapHoSoCB đánh dấu đúng ô sau khi Phân quyền (ToHop = ID cán bộ + ID trường thông tin).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/canbonhaphososinhvien

- **[Cần quyết]** Không chọn Trường thông tin thì strToHopBoDuLieuQuyen chỉ còn ID lớp (như gốc) — có nên bắt buộc?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Hệ → Khoá → CT → Lớp (gốc "Tất cả …", chọn nhiều) nay KHOÁ theo luật cha → con; muốn chọn lớp phải chọn CT trước.
  - → Làm như hiện tại: Khoá như các màn Tài chính
- **[Kiểm trên host]** Kiểm trên host: "Phân quyền mở rộng" xoá bằng pkg_chung_phanquyendulieu.Xoa_PhanQuyen_DuLieu (theo tổ hợp) — chưa có dữ liệu thử.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/canhantunhaphoso

- **[Cần quyết]** LayDSHanhDongTheo gửi tên tham số lạ "strPhanQuyenCNTNHS_ChucNang_Id" (màn anh em gửi strPhanQuyen_ChucNang_Id) — có vẻ lỗi đổi tên hàng loạt. Đang GIỮ như gốc; sửa thì danh sách quyền có thể đổi.
  - → Làm như hiện tại: Giữ nguyên tên gốc
- **[Cần quyết]** Chưa chọn chức năng / quyền thì nay CHẶN nút Phân quyền (gốc vẫn gửi strLoaiQuyen_Id / strHanhDong_Id rỗng).
  - → Làm như hiện tại: Chặn và nhắc
- **[Kiểm trên host]** Kiểm trên host: Thêm quyền ghi ID cán bộ (lá) vào strNguoiDung_Id, ID trường thông tin vào strToHopBoDuLieuQuyen — đúng chiều procedure đọc?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/diem

- **[Cần quyết]** Hệ → Khoá → CT → Lớp nay KHOÁ; Học phần và Cán bộ là lọc tuỳ chọn nhiều cha — KHÔNG khoá.
  - → Làm như hiện tại: Như trên
- **[Cần quyết]** Phân quyền tự động theo TKB chạy ngay không hỏi lại (như gốc) — có cần hỏi lại?
  - → Làm như hiện tại: Không hỏi, như gốc
- **[Kiểm trên host]** Kiểm trên host: Tạo dữ liệu cache gửi strChucNang_Id = CHỨC NĂNG PHÂN QUYỀN và tham số "type" (như gốc); xoá quyền dùng Xoa_PhanQuyen_DuLieu theo tổ hợp Quyền × Thành phần.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/quantriquyendulieu

- **[Cần quyết]** Hộp "Thêm quyền" đánh dấu SẴN mọi giá trị đã có quyền; nút "Xóa" trong hộp xoá mọi ô đã có quyền đang được đánh dấu ở trang đang xem — mở hộp rồi bấm Xóa ngay là xoá HẾT quyền của trang đó (như gốc). Nút nay ghi rõ "Xóa (N)". Có muốn đổi thành mặc định KHÔNG đánh dấu, hoặc chuyển nút xoá sang hộp "Xem kết quả" như M1/M2?
  - → Làm như hiện tại: Giữ như gốc: đánh dấu sẵn, nút Xóa ở hộp Thêm quyền, đếm số dòng sẽ xoá.
- **[Cần quyết]** Hộp "Xem kết quả" ghi "Chỉ xem, không thể chỉnh sửa" và không có nút xoá (như gốc). M1/M2 thì có xoá ở hộp này.
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Thứ tự cột chiều dữ liệu: gốc xếp theo lời gọi nào về trước (mỗi lần một kiểu); nay theo thứ tự LayDSCore_Data_Dimension trả về.
  - → Làm như hiện tại: Theo thứ tự danh sách chiều.
- **[Kiểm trên host]** Them_Core_User_Data_Scope gửi strUserId / LayDSCore_D_Value_U_Data_Scope gửi strCore_Person_Id = ID của pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2 (ID hồ sơ nhân sự). Kiểm trên host: procedure hiểu đó là ID người dùng (Core_Person) hay ID hồ sơ?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Khoa/Đơn vị lấy NS_CoCauToChuc/LayDanhSach dựng cây theo cột PARENT — đơn vị có PARENT không nằm trong danh sách bị ẩn (như gốc). Kiểm trên host cột PARENT có thật và cây đủ.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/quantriquyendulieum1

- **[Cần quyết]** Chưa chọn chức năng thì strChucNang_Id = '' — makeRequest gốc (và ums.api) tự thay bằng ID CHỨC NĂNG ĐANG MỞ (chính màn quản trị này) ở Pr_Core_Person_Get_By_R_F_Emp và LayDSCore_D_V_URF_Data_Scope. Lọc "chỉ theo vai trò" vì vậy thực chất là vai trò × chức năng màn quản trị. Có phải ý định?
  - → Làm như hiện tại: Giữ như gốc (nghi ngờ nhưng không đổi vì là màn phân quyền).
- **[Cần quyết]** Gán / đọc / xoá quyền chỉ dùng vai trò đang chọn và chức năng ĐẦU TIÊN đang chọn (chọn nhiều chức năng thì các chức năng sau bị bỏ qua khi gán). Có cần gán cho mọi chức năng đã chọn?
  - → Làm như hiện tại: Giữ như gốc — chức năng đầu tiên, chụp lúc mở hộp.
- **[Cần quyết]** Vai trò → Chức năng khoá theo luật cha → con; bỏ Đơn vị thì xoá trắng cả Vai trò và Chức năng (gốc xoá Vai trò nhưng Chức năng cũ vẫn lọc).
  - → Làm như hiện tại: Đã khoá / xoá trắng.
- **[Kiểm trên host]** strVaiTroDangNhap_Id gửi '' (gốc đọc edu.system.strVaiTro_Id — không tồn tại) → được điền vai trò đang đăng nhập; strUngDung_Id của LayDSChucNangTheoUDVaiTro = vai trò đang đăng nhập (appId). Kiểm trên host danh sách chức năng đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** LayDSCore_D_V_URF_Data_Scope không trả khoá quyền — có cột giá trị là coi như đã gán; xoá theo tổ hợp user/role/function/dimension/value (Pr_Co_U_R_F_Da_Sc_De_By_URFDV). Kiểm trên host thêm rồi xoá một quyền.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/quantriquyendulieum2

- **[Cần quyết]** Vai trò có vai trò cha KHÔNG nằm trong danh sách (cha ngừng hoạt động…) bị ẩn khỏi lưới (gốc chỉ đi cây từ gốc) → không phân quyền dữ liệu được cho các vai trò đó. Có nên hiện chúng như vai trò gốc?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Nút "Lưu phân quyền" + ô Chiều dữ liệu / Từ khoá / Tìm kiếm của gốc bị ẩn ngay khi nạp (và nút Lưu không còn tác dụng) → đã bỏ.
  - → Làm như hiện tại: Đã bỏ.
- **[Kiểm trên host]** Them_Core_Role_Data_Scope gửi dPriorityNo: 1 (bản theo nhân sự gửi 100) — chép nguyên. Kiểm trên host thêm/xoá một quyền vai trò và thứ tự ưu tiên.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/phanquyen/sinhvientunhap

- **[Cần quyết]** LayDSHanhDongTheo gửi tên lạ "strPhanQuyenSVTN_ChucNang_Id" (như gốc).
  - → Làm như hiện tại: Giữ nguyên tên gốc
- **[Cần quyết]** Hệ → Khoá → CT → Lớp nay KHOÁ theo luật cha → con (gốc "Tất cả …").
  - → Làm như hiện tại: Khoá

### apiscms/modules/ungdung/filebaocao

- **[Kiểm trên host]** Thay tệp báo cáo: tải lên Upload/File/ rồi gọi CMS_UpCode/UpFileBaoCao với dấu \ nhân đôi ở cả hai tham số (như gốc). Đây là đường GHI đè tệp trên máy chủ.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Download mở strhost + "/" + (đường dẫn bỏ phần Pager). Đường dẫn còn dấu \ — kiểm tra IIS có trả tệp không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/vaitro/vaitrochucnang

- **[Kiểm trên host]** Hộp "Các quyền chức năng" → nút Xóa gửi Xoa_Core_VaiTro_Quyen chỉ với strId = ID quyền (dòng LayDSCore_Quyen), KHÔNG gửi vai trò. Nếu procedure xoá theo ID quyền thì có thể gỡ quyền đó khỏi MỌI vai trò. (Giữ nguyên như gốc.)
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Nhãn quyền dưới tên chức năng liệt kê MỌI dòng LayDSQuyenTheoUngDung trả về cho chức năng đó, không lọc DAPHAN = 1 (hộp quyền thì đánh dấu theo DAPHAN). Nếu procedure trả cả quyền chưa phân thì nhãn hiện sai. (Giữ như gốc.)
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Cây chỉnh sửa đánh dấu sẵn như jstree: chức năng cha đã gán mà chưa có con nào được gán thì đánh dấu luôn mọi con — bấm Lưu ngay sẽ THÊM các con đó (câu hỏi lại có nêu số lượng).
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Đổi ô "Ứng dụng" trong khung chỉnh sửa nay nạp thêm LayDSChucNangTheoUDVaiTro của ứng dụng mới (gốc so nhầm với ứng dụng cũ).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscms/modules/vaitro/vaitronguoidung

- **[Kiểm trên host]** Xoá người dùng khỏi vai trò gửi strCore_NhanSu_Id = ID dòng của LayDSNguoiDungVaiTro (như gốc); đúng chỉ khi ID dòng là ID người dùng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongcanbo/modules/sanphamkhoahoc/tapchiquocte

- **[Kiểm trên host]** Thêm bài báo: id máy chủ trả về sau NCKH_TapChiQuocTe/ThemMoi (bản gốc lẫn bản mới dùng làm strSanPham_Id để gắn tác giả qua NCKH_ThanhVien/ThemMoi) KHÁC cột ID của dòng đó trong LayDanhSach (thử ngày 26/9: trả 74D7…, danh sách hiện AD35…). Nếu hai id là hai bản ghi khác nhau thì tác giả bị gắn sai sản phẩm. Host chưa có bài báo thật nào để đối chiếu — kiểm lại khi có dữ liệu thật (cùng khung với 10 màn sản phẩm khoa học khác).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apiscongsinhvien/modules/thanhtoanonline/thanhtoanonline

- **[Cần quyết]** Các khoản phải nộp được ĐÁNH DẤU SẴN khi mở màn (như gốc chọn sẵn khoản thanh toán) nên nút "Hủy nộp trước" đã bật (đỏ) ngay khi chưa bấm gì — lệch quy ước xoaChon. Hai hướng: (1) bỏ đánh dấu sẵn (đổi lựa chọn thanh toán mặc định), (2) nút chỉ đếm dòng người dùng tự bấm.
  - → Làm như hiện tại: Để nguyên như hiện tại; kiem-dong-bo CSV báo 35/36 là ĐÃ BIẾT

### apisdangkyhoc/modules/canbodangky/dangky

- **[Cần quyết]** "Xóa dữ liệu import" gốc xoá ngay không hỏi — bản mới hỏi lại.
  - → Làm như hiện tại: Có hỏi
- **[Cần quyết]** "Đã đăng ký HP" khoá khi đăng ký cho MỘT SV (gốc chỉ khi đúng 1 ô đánh dấu, mở từ Mã số thì không khoá).
  - → Làm như hiện tại: Khoá khi 1 SV
- **[Kiểm trên host]** Đăng ký nhiều SV: CT gửi = NGANH_ID từng SV, kế hoạch/học phần/lớp theo SV ĐẦU — kiểm nghiệp vụ.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Đổi lịch lớp thuộc NHÓM đẩy ID lớp đang đổi cho mọi lớp cùng nhóm (giữ gốc, như bản Cổng SV).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Đăng ký theo nhóm chờ SOGIAYCHO giây trước khi gửi (runAA) — giữ.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Mẫu import theo quyền (nếu có) ở gốc vẽ đè nút Import viết tay; bản mới luôn giữ 2 mục viết tay.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/canbodangky/khongdangky

- **[Cần quyết]** Báo cáo/Import gốc gắn nhầm zonebtnKDD nên không bao giờ hiện — bản mới gắn đúng chỗ (có Import).
  - → Làm như hiện tại: Đã gắn
- **[Kiểm trên host]** Sửa lý do dòng cũ gọi Them_DangKy_NguoiHoc_Chan KHÔNG gửi strId (như gốc) — procedure cập nhật hay thêm trùng?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tên cột hộp chọn SV (QLSV_NGUOIHOC_ID / DAOTAO_LOPQUANLY_ID của LayDSNguoiHoc) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/danhmuc/danhmucdulieu

- **[Cần quyết]** Gốc mở sửa chỉ đổ ThongTin1–3 nên bấm Lưu là xoá trắng ThongTin4–6. Bản mới đổ đủ 1–6.
  - → Làm như hiện tại: Đổ đủ.
- **[Kiểm trên host]** Tham số lưu strChung_TenDanhMuc_Cha_Id / strCHUNG_TENDANHMUC_Id (khác bản Tài chính strQuanHeCha_Id / strChung_TenDanhMuc_Id) — kiểm CMS_DanhMucDuLieu/ThemMoi|CapNhat nhận đúng quan hệ cha trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/apphihocphan

- **[Cần quyết]** Gốc khoá dòng theo DAOTAO_HOCPHAN_ID nên hai SV cùng học phần chỉ trúng dòng đầu — bản mới khoá theo dòng, tham số gửi như gốc.
  - → Làm như hiện tại: Đã sửa
- **[Kiểm trên host]** Áp phí/Xóa/Thực hiện KHÔNG gửi strDangKy_KeHoachDangKy_Id (bản Rút có gửi) — procedure DKH_ApPhiHocPhan có cần không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** strMoTa khi Lưu % mức phí luôn rỗng (gốc đọc txtAAAA).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/baocaodangkyhoc

- **[Cần quyết]** Tiêu đề cột gốc lệch một cột ("Đã phân công" hiện số SV đăng ký…) — bản mới đặt theo dữ liệu: Số sv đã đăng ký · Số sv dự kiến · Lớp riêng.
  - → Làm như hiện tại: Theo dữ liệu
- **[Cần quyết]** Khối "Chọn trạng thái sinh viên" gốc để trống (không nạp) — bản mới nạp QLSV.TRANGTHAI, đánh dấu tất cả, gửi strTrangThaiNguoiHoc_Id khi xuất báo cáo.
  - → Làm như hiện tại: Nạp như lophocphan
- **[Kiểm trên host]** Kiểm báo cáo nhận đủ strTrangThaiNguoiHoc_Id (lặp khoá) và strHoTenNguoiDung (lấy từ tên trên thanh trên).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/donlop

- **[Cần quyết]** Nút "Xóa" trong hộp Danh sách phạm vi không có xử lý ở bản gốc → giữ nút, khoá. Có cần xoá phạm vi ở đây không?
  - → Làm như hiện tại: Khoá nút.
- **[Cần quyết]** Nút "Xóa" ở vùng dồn lớp gọi DKH_DangKy/ThucHienHuyDangKyHocHocPhan (HỦY đăng ký của sinh viên) — đúng nghiệp vụ mong muốn?
  - → Làm như hiện tại: Giữ lời gọi như gốc, hỏi lại trước khi xoá.
- **[Cần quyết]** Dồn lớp khi chưa chọn lớp cuối: gốc gửi strDangKy_LopHocPhan_Moi_Ids rỗng; bản mới báo và dừng.
  - → Làm như hiện tại: Báo "Vui lòng chọn lớp cuối".
- **[Kiểm trên host]** Hộp phạm vi gửi pageIndex 1 / pageSize 1000000 (gốc gửi trang đang xem của danh sách lớp, 10 dòng) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tô hồng sinh viên vừa dồn theo QLSV_NGUOIHOC_ID (gốc tô theo ID dòng đăng ký cũ nên thường không tô được) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/kehoachdangky

- **[Cần quyết]** Ô lọc "Thời gian" ở danh sách: bản gốc KHÔNG BAO GIỜ có dữ liệu (đổ nhầm id) và không được gửi đi; LayDanhSach không có tham số thời gian. Bản mới cho chọn và lọc ở máy khách (tải hết rồi lọc theo năm/kỳ/đợt của kế hoạch). Giữ, hay bỏ ô này?
  - → Làm như hiện tại: Lọc ở máy khách
- **[Cần quyết]** Lưu kế hoạch xong bản mới về danh sách (gốc ở lại biểu mẫu nhưng không nhớ ID mới → Lưu lần hai thêm trùng, Phân công gửi ID rỗng). Bốn nút Phân công / Chuyển dữ liệu khoá khi đang Thêm mới.
  - → Làm như hiện tại: Lưu xong về danh sách; phải mở lại kế hoạch để phân công
- **[Cần quyết]** Thiết đặt xử lý lớp HP: đổi "Xử lý đặc thù" của dòng ĐÃ LƯU không được lưu (chỉ có procedure Ins/Del, gốc báo "Các dòng đã lưu trước đó không thay đổi"). Có cần sửa được không?
  - → Làm như hiện tại: Giữ như gốc — muốn đổi thì xoá dòng rồi thêm lại
- **[Kiểm trên host]** "Chọn những nguyện vọng cần ưu tiên cho kế hoạch" chưa từng hiện ở gốc (lỗi JS) nên strDSNguyenVongLuaChon_Id luôn rỗng; nay đã hiện (DKH_Chung/LayDSKeHoachDKNV, nhãn cột TEN) và gửi ID đã chọn — kiểm tên cột + dữ liệu lưu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Phân quyền cán bộ: 4 ô "Không cần kiểm tra…" là ô chữ tự do, gửi chuỗi rỗng khi để trống (như gốc) — kiểm procedure nhận rỗng không lỗi, và giá trị đúng là 1/0.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Ô "Ngày bắt đầu/kết thúc cho phép sv xác nhận đăng ký" là ô chữ tự do như gốc (không có lịch) — kiểm định dạng máy chủ cần.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/lichsu

- **[Cần quyết]** Cột "Kỳ": bảng lịch sử ghép NAMHOC_HOCKY_DOTHOC, bảng kết quả ghép NAMHOC_HOCKY,DOTHOC (gốc khác nhau) — thống nhất một kiểu?
  - → Làm như hiện tại: Giữ như gốc.

### apisdangkyhoc/modules/kehoachdangky/lophoc

- **[Cần quyết]** Ô Thời gian chỉ nạp MỘT lần lúc mở màn (D_ThoiGian/LayDanhSach với strLoaiDanhSach_Id rỗng); đổi Loại danh sách không nạp lại Thời gian — giữ như gốc. Có cần nạp lại theo Loại danh sách không?
  - → Làm như hiện tại: Nạp một lần như gốc.
- **[Cần quyết]** Lưu thêm sinh viên xong chỉ nạp lại bảng "đã thêm", bảng "chưa thêm" giữ nguyên (như gốc) — sinh viên vừa thêm vẫn nằm ở bảng dưới.
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Import: gốc gọi getList_MauImport("zonebtnLopHoc") nhưng html chỉ có vùng _Import → chỉ hiện nút Import; kiểm mẫu import của chức năng trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/lophocphan

- **[Cần quyết]** "Thiết đặt lớp không tín phí": bản gốc đặt hai nút radio khác tên, mã đọc name="ThietLapLopRieng" → chọn "Lớp không tính phí" gửi dKhongTinhPhi RỖNG. Bản mới gửi đúng lựa chọn (1 = không tính phí, 0 = tính phí); ba hộp thiết lập bắt buộc chọn một lựa chọn.
  - → Làm như hiện tại: Đã sửa theo ý định — đổi dữ liệu thật gửi đi
- **[Cần quyết]** Bảng "Xem kết quả đăng ký chi tiết (cán bộ đăng ký)": gốc bấm sang trang / đổi Loại lớp / tìm trong bảng thì nạp nhầm danh sách ĐĂNG KÝ CHI TIẾT. Bản mới giữ danh sách cán bộ; sau Công nợ / Cân bằng nợ / Rút thì nạp lại đúng danh sách đang xem. Riêng hai ô "chưa nộp tiền / đã chuyển kế toán" vẫn chuyển sang Đăng ký chi tiết như gốc.
  - → Làm như hiện tại: Giữ danh sách đang xem
- **[Cần quyết]** Hộp "Danh sách phạm vi": gốc gửi pageIndex = trang đang xem của bảng ngoài, pageSize 10, không có phân trang → chỉ thấy tối đa 10 phạm vi. Bản mới gửi trang 1 × 1000000.
  - → Làm như hiện tại: Hiện đủ phạm vi
- **[Cần quyết]** Dồn lớp: danh sách "lớp cuối" chỉ gồm các lớp CÙNG học phần trên TRANG đang xem của bảng lớp học phần (như gốc) — lớp ở trang khác không chọn được. Có cần nạp mọi lớp cùng học phần không?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Dồn lớp khi chưa chọn lớp cuối: gốc vẫn gửi strDangKy_LopHocPhan_Moi_Ids rỗng. Bản mới chặn và báo "Vui lòng chọn lớp cuối?".
  - → Làm như hiện tại: Chặn
- **[Cần quyết]** Tô hồng SV vừa dồn ở bảng lớp cuối: gốc so ID bản ghi đăng ký của lớp CŨ với ID dòng lớp MỚI — gần như không bao giờ khớp. Bản mới giữ cách so như gốc.
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Lưu chế độ tính phí cho SV (hộp "Danh sách sinh viên"): gốc không bắt chọn chế độ, để trống vẫn gửi strCheDoTinhPhi_Id rỗng.
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Xuất Excel "Danh sách không đăng ký": gốc tải xlsx-js-style từ CDN (.xlsx có tô màu tiêu đề); bản mới xuất .xls dạng bảng HTML (ums.ui.xuatXls), đúng cột và dữ liệu đang lọc, không tô màu.
  - → Làm như hiện tại: Không phụ thuộc CDN
- **[Kiểm trên host]** Dồn nhóm lớp (Them_DangKy_DonLop_LichSu → LayThongTinChuanBiDonLop → LayDSLopMoiTheo → ThucHienDonLopDangKyHocNhom) gửi iM với action kiểu cũ như gốc — kiểm chuỗi 4 bước và dữ liệu rsLopBanDau / rsLopMoi.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Thực hiện rút học phần (PKG_DANGKYHOC_RUTHOCPHAN.ThucHienRut) lấy DAOTAO_THOIGIANDAOTAO_ID, DANGKY_KEHOACHDANGKY_ID từ dòng đăng ký chi tiết / rút — kiểm hai cột này có trong dữ liệu trả về.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Xoá chế độ tính phí lớp dùng CHEDOTINHPHI_ID của dòng lớp học phần làm strId — kiểm LayDSLopHocPhanPhanTrang có trả cột này.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/phanconglop

- **[Cần quyết]** Lưu nay bắt chọn cả lớp học phần lẫn phạm vi (gốc kiểm ngược: không chọn phạm vi vẫn hỏi "lưu 0 dữ liệu").
  - → Làm như hiện tại: Đã sửa.
- **[Kiểm trên host]** LayDSLopHocPhan gửi strDaoTao_KhoaDaoTao_Id = Khóa của bộ lọc quyền (khoá khai hai lần trong gốc, khoá sau thắng), KHÔNG phải Khóa tổ chức — kiểm có đúng ý nghiệp vụ.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Hai hộp "Chi tiết" nay có thanh phân trang máy chủ (gốc lấy 10 dòng đầu, hộp phạm vi không có thanh phân trang).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/phancongphamvi

- **[Cần quyết]** Lưu thêm xong nay quay về danh sách (gốc để nguyên biểu mẫu, bấm lần hai thêm TRÙNG). Ô "Số tín tối thiểu N2" nay gửi đúng giá trị (gốc đọc nhầm id nên luôn rỗng).
  - → Làm như hiện tại: Đã sửa theo ý định.
- **[Cần quyết]** Muốn thêm phạm vi Lớp nay phải chọn Chương trình trước (gốc chọn Khóa là nạp Lớp) — nối tầng chặt theo luật cha → con.
  - → Làm như hiện tại: Khoá chặt Hệ → Khóa → CT → Lớp → Người học.
- **[Kiểm trên host]** "Thêm Khoa quản lý - khóa học" gửi id phạm vi = id khoa quản lý GHÉP id khóa (64 ký tự) như gốc — kiểm procedure có hiểu không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tính toán dữ liệu: gọi TaoDuLieuTamTheoNguoiHoc cho từng người học (4 luồng song song, gốc bắn tất cả một lúc) — thử trên kế hoạch có dữ liệu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/quanlytoanbo

- **[Cần quyết]** Vùng "Chỉnh sửa hồ sơ" và hai hộp Quyết định / Chuyển lớp KHÔNG có đường vào ở bản gốc (nút đã bị chú thích bỏ) → không dựng. Có cần mở lại không?
  - → Làm như hiện tại: Không dựng.
- **[Cần quyết]** Ô Thời gian chỉ gửi vào báo cáo, KHÔNG gửi vào danh sách (như gốc).
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** strNguoiDangNhap_Id = userId đăng nhập; lần nạp đầu gửi trạng thái đã đánh dấu (gốc thường gửi rỗng do nạp song song) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangky/ruthocphan

- **[Cần quyết]** Thực hiện rút xong nạp lại CẢ HAI bảng (gốc chỉ nạp "Học phần đã rút").
  - → Làm như hiện tại: Nạp cả hai
- **[Cần quyết]** Nút "Khôi phục" (HuyRut) hỏi "Bạn có chắc chắn xóa dữ liệu không?" như gốc — đổi chữ hỏi?
  - → Làm như hiện tại: Giữ chữ gốc
- **[Kiểm trên host]** Import IMPORTWITHPROC_RHP / IMPORTWITHPROC_HRHP (showImportChungV2 → importChung) — thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/kehoachdangkymuabaohiem/kehoachmua

- **[Cần quyết]** Lưu phạm vi chỉ gửi strPhamViApDung_Id, không gửi loại phạm vi (KHOAQUANLY/HEDAOTAO/KHOADAOTAO/CHUONGTRINH/LOP/NGUOIHOC) — như gốc. Procedure có tự nhận ra loại từ id không?
  - → Làm như hiện tại: Giữ như gốc, chỉ gửi id.
- **[Cần quyết]** Gốc mở màn không nạp danh sách (phải bấm Tìm kiếm). Bản mới nạp ngay khi mở.
  - → Làm như hiện tại: Nạp ngay khi mở.
- **[Cần quyết]** Hộp Thêm phạm vi: gốc nạp sẵn MỌI lớp khi mở hộp; bản mới khoá Lớp tới khi chọn Hệ → Khoá → Chương trình (luật cha → con).
  - → Làm như hiện tại: Khoá theo luật cha → con.
- **[Kiểm trên host]** Tên cột trả về chưa xác nhận — gốc dò nhiều tên dự phòng (TEN_KHOANTHU|LOAIKHOAN_TEN, TINHTRANGDANGKY_CODE_NAME|…, SOTIEN_PHAINOP, PHAMVIAPDUNG_TEN, TAICHINH_CACKHOANTHU_ID…). Kiểm từng cột hiện đúng trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Minh chứng (MINHCHUNG) mở thẳng làm đường dẫn — kiểm giá trị thật là URL đầy đủ hay đường dẫn tương đối.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/nganh2/kehoach

- **[Kiểm trên host]** Duyệt: gốc luôn gửi strTinhTrang_Id rỗng; bản mới gửi ID nút đã bấm (đường GHI mới)
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** "Cập nhật điều kiện" gửi Sua_DK_Nganh_Tiep_PV_MoNganh với Hệ/Khoá/CT/Lớp RỖNG (như gốc) — kiểm có xoá mất dữ liệu cũ không
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Bảng "Lịch sử xác nhận" trong hộp Duyệt gốc không bao giờ được nạp
  - → Làm như hiện tại: Giữ khung trống
- **[Cần quyết]** Nút "Lưu" ở vùng Kết quả và Giới hạn gốc không có xử lý
  - → Làm như hiện tại: Giữ, khoá

### apisdangkyhoc/modules/nguyenvongdangky/kehoachdangky

- **[Cần quyết]** Nút Xoá kế hoạch (DKH_KeHoachDangKyNV/Xoa) gốc để ẩn vĩnh viễn — có mở chức năng xoá không?
  - → Làm như hiện tại: Không dựng nút xoá
- **[Kiểm trên host]** Ô Quy mô của dòng đã lưu đọc cột QUYMOLOP_ID (tên đoán; gốc dùng ID dòng nên luôn trống)
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Phạm vi học phần chỉ thêm được khi kế hoạch đã lưu (gốc gửi id rỗng)
  - → Làm như hiện tại: Chặn, nhắc lưu trước

### apisdangkyhoc/modules/nguyenvongdangky/ketqua

- **[Cần quyết]** Gốc gọi LayDSHocPhanDaDangKy cho MỌI người học × học phần; bản mới chỉ gọi cho trang đang hiện
  - → Làm như hiện tại: Phân trang máy khách, 6 luồng
- **[Kiểm trên host]** LayDSKetQuaDangKy_NguyenVong không gửi pageIndex/pageSize (như gốc) — kiểm máy chủ trả hết
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/nguyenvongdangky/lichsudangky

- **[Kiểm trên host]** Chọn kế hoạch khi chưa tìm ra người học: gửi strQLSV_NguoiHoc_Id rỗng (như gốc) — kiểm procedure trả gì
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/nguyenvongdangky/phancongphamvi

- **[Cần quyết]** Dùng chung khung với kehoachdangky/phancongphamvi; cùng hai sửa lỗi (lưu xong về danh sách, ô tối thiểu N2).
  - → Làm như hiện tại: Đã sửa theo ý định.
- **[Kiểm trên host]** Sửa gửi strKeHoachNguyenVong_Id = cột DANGKY_KEHOACHDANGKY_ID của dòng (như gốc) — kiểm tên cột thật của DKH_NguyenVong_PhamVi/LayDanhSach.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/phancongchuongtrinh/phancongchuongtrinh

- **[Kiểm trên host]** Thanh "Tìm kế hoạch" gốc chết hẳn. Nay nạp Năm → Học kỳ → Đợt, Tìm kiếm gửi từ khoá, rồi lọc thẻ tại máy theo CHỮ đã chọn so với DAOTAO_THOIGIANDAOTAO_NAM/_KY/_DOT — cách so là đoán.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Khung phải nay hiện chương trình đã phân công, khung trái bỏ chúng đi — so khớp theo DAOTAO_CHUONGTRINH_ID (tên cột đoán) hoặc MACHUONGTRINH.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** "Bỏ Chọn" chương trình đã lưu gọi Xoa với ID dòng (gốc gửi MACHUONGTRINH) và có hỏi lại. Lưu chỉ gọi ThemMoi, bỏ CapNhat (gốc nhét MAKEHOACH vào ngày / số tín chỉ).
  - → Làm như hiện tại: Đã sửa theo ý định.
- **[Cần quyết]** Nút sửa chương trình (cột "Chi tiết") và "Tải lại" để KHOÁ vì gốc lỗi hoặc không có xử lý; bỏ cột "Số sinh viên" (không có dữ liệu). Có cần dựng lại biểu mẫu sửa chương trình không?
  - → Làm như hiện tại: Khoá nút, bỏ cột.

### apisdangkyhoc/modules/sinhviendangky/autopk

- **[Cần quyết]** Công cụ GHI đăng ký thật hàng loạt (gốc không hỏi lại). Có giữ trên menu cho người dùng nghiệp vụ?
  - → Làm như hiện tại: Giữ, thêm hỏi lại màu đỏ trước khi chạy
- **[Kiểm trên host]** Gốc lấy sinh viên theo SV_HoSo/LayDanhSach với pageIndex = "từ số", pageSize = đến − từ; ô ID nay đọc đúng txtSinhVien — kiểm lượt chạy và kết quả trên host
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisdangkyhoc/modules/sinhviendangky/dangky

- **[Cần quyết]** Bản gốc là trang dựng thử (dữ liệu viết cứng, không API). Giữ làm trang mẫu hay gỡ khỏi menu / dựng thật theo Cổng SV dangkyhoc/dangky?
  - → Làm như hiện tại: Trang mẫu, gắn nhãn "Trang mẫu — số liệu dựng thử"

### apisdangkyhoc/modules/thilai/kehoach

- **[Cần quyết]** Lưu kế hoạch xong về danh sách (bản gốc ở lại biểu mẫu nhưng không nhận id mới nên thêm lại là TRÙNG). Muốn thêm đợt thi / học phần cho kế hoạch mới phải mở Sửa — có cần tự mở lại biểu mẫu sau khi Thêm không?
  - → Làm như hiện tại: Về danh sách; khối Đợt thi / Học phần báo "lưu kế hoạch trước" khi chưa có id.
- **[Cần quyết]** Phạm vi: Them_DangKy_Thi_HP_KH_PhamVi gửi strId = id phạm vi (trùng strPhamViApDung_Id) dù là lời gọi THÊM.
  - → Làm như hiện tại: Giữ nguyên như gốc.
- **[Cần quyết]** Hộp chọn phạm vi (ums.pat.phamVi) chưa có "Thêm từng hệ" (gốc có btnAdd_He).
  - → Làm như hiện tại: Chỉ có khoá / chương trình / lớp / sinh viên.
- **[Cần quyết]** Hộp "Chưa đăng ký": nút Xóa / Thêm của gốc trùng id với hộp Lớp quản lý nên chưa bao giờ chạy; "Xóa tên khỏi danh sách" (Danh sách nhập điểm) không có xử lý.
  - → Làm như hiện tại: Giữ nút, disabled.
- **[Cần quyết]** Ô "Phí" gửi dSoTien đúng chữ người dùng gõ (không bỏ dấu phân cách) như gốc.
  - → Làm như hiện tại: Giữ nguyên.
- **[Kiểm trên host]** Mã sản phẩm xác nhận = ID + QLSV_NGUOIHOC_ID + DAOTAO_HOCPHAN_ID + DAOTAO_THOIGIANDAOTAO_ID (cột rỗng thành "null"); lịch sử lấy theo dòng đầu tiên được chọn.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Import thực hiện / hủy đăng ký (IMPORTWITHPROC_MTTHUCHIENDANGKY / _MTHUYDANGKY) dùng ums.report.importChung — bản V2 của gốc có thêm ô chọn sheet.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Hộp "Tìm kiếm học phần" / "Tìm kiếm nhân sự" (người dùng) nạp trang 1 ngay khi mở (gốc chờ bấm Tìm kiếm) — kiểm tốc độ trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apishocbong/modules/kehoach/kehoach

- **[Cần quyết]** Danh sách cán bộ phân công trong biểu mẫu gửi strDaoTao_ThoiGianDaoTao_Id = ô Học kỳ của THANH LỌC (như gốc) — chọn học kỳ khác ở thanh lọc có thể làm mất cán bộ khỏi biểu mẫu. Giữ hay gửi rỗng?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Mỗi lần Lưu kế hoạch, gốc gửi lại HB_KeHoach_NhanSu/CapNhat cho MỌI cán bộ đã lưu. Có bỏ không?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Nút "Kế thừa mặc định từ điều kiện chuẩn" không có xử lý ở bản gốc.
  - → Làm như hiện tại: Giữ nút, khoá
- **[Cần quyết]** Hộp chọn sinh viên thiếu "Thêm Khoa quản lý - khóa học" và ô lọc Khoa quản lý (hộp chung chưa có).
  - → Làm như hiện tại: Chưa làm
- **[Kiểm trên host]** Cột "Nhân sự phân công xét" đọc NGUOICUOI_TENDAYDU (tên cột của gốc) — kiểm có dữ liệu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Lưu kế hoạch mới: ID đọc từ data.Id để hiện khối sinh viên — kiểm máy chủ có trả Id.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apishocbong/modules/kehoach/thuchienxet

- **[Cần quyết]** Danh sách kế hoạch gửi strNguoiDung_Id / strNguoiTao_Id rỗng (màn Kế hoạch gửi userId) — như gốc.
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Hộp "không đạt" → Chi tiết học phần gọi TN_KetQuaHocPhan (tham số TN_KEHOACH_ID, PHANLOAI_ID chép từ màn Tốt nghiệp) — kiểm cột trả về.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Cột động của hộp đạt / không đạt (rsCot, rsDuLieu khớp theo HB_KETQUA_ID = ID dòng).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apishocbong/modules/kehoach/tonghop

- **[Kiểm trên host]** Gốc không gửi từ khoá (đọc txtAAAA). Bản mới gửi strTuKhoa = ô từ khoá — procedure có lọc theo từ khoá không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Gốc không nối tầng nên ô CT / Lớp luôn trống. Bản mới nối Hệ → Khoá → CT → Lớp (chọn nhiều) và khoá tầng dưới tới khi chọn tầng trên.
  - → Làm như hiện tại: Nối tầng như quanlythongtin / phanbohocbong

### apishocbong/modules/kehoach/xacnhan

- **[Kiểm trên host]** Ô từ khoá: gốc không gửi (đọc txtAAAA), nay gửi strTuKhoa — kiểm procedure nhận.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** LayDSTinhTrangXacNhan gửi strHB_QuyHocBong_Id rỗng (gốc đọc ô không tồn tại). Có nên gửi ô Quỹ đang chọn?
  - → Làm như hiện tại: Gửi rỗng như gốc

### apishocbong/modules/thietlap/dieukienxet

- **[Cần quyết]** Tab 2: gốc mở màn là nạp phân cấp KHÔNG theo quỹ rồi chọn sẵn mục đầu; nay phải chọn Quỹ trước (luật cha → con).
  - → Làm như hiện tại: Khoá Phân cấp tới khi chọn Quỹ
- **[Kiểm trên host]** HB_PhanCapApDung/LayDanhSach nhận Quỹ học bổng qua tham số tên strPhanLoai_Id (như gốc) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút "Xóa" trong biểu mẫu: gốc có trình xử lý nhưng nút luôn display:none (không xoá được gì). Nay hiện khi Sửa — có giữ không?
  - → Làm như hiện tại: Hiện khi Sửa, hỏi lại trước khi xoá

### apishocbong/modules/thietlap/phanbohocbong

- **[Cần quyết]** Gốc: "Cách lưu" chọn gì cũng GỘP NHÓM (chuỗi "0" luôn đúng). Bản mới: "Từng bản ghi" gửi mỗi lớp một lời gọi — đổi dữ liệu thật gửi đi.
  - → Làm như hiện tại: Làm theo ô Cách lưu

### apishocbong/modules/thietlap/thamsochung

- **[Kiểm trên host]** Lưu điều kiện RIÊNG: gốc chỉ gửi Mô tả + phạm vi, bỏ mất 8 thông số "Thông tin áp dụng" dù biểu mẫu hiện và bảng đọc lại chúng. Nay gửi thêm strHT_* như điều kiện chung — procedure TN_XetDuyet_ThamSo_Ad có nhận các tham số này không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Lưu điều kiện CHUNG: gốc không gửi Mô tả (ô có trên biểu mẫu, cột có trên bảng). Nay gửi strMoTa — kiểm TN_XetDuyet_ThamSo/ThemMoi|CapNhat có ghi Mô tả không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** "Lưu tham số" (Khai báo tham số) chưa từng chạy ở gốc (ReferenceError) — đường GHI mới vào TN_PhanLoai_XepLoai / TN_NguoiDung_TinhTrang / TN_XacNhan_TinhTrang, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút "Xóa" trong biểu mẫu: gốc có trình xử lý nhưng nút luôn display:none (không xoá được gì). Nay hiện khi Sửa — có giữ không?
  - → Làm như hiện tại: Hiện khi Sửa, hỏi lại trước khi xoá

### apishocbong/modules/thietlap/xeploaihabac

- **[Kiểm trên host]** Hai lưới Xếp loại hạ bậc / giới hạn: gốc chưa từng nạp dòng đã lưu và luôn gửi xếp loại rỗng. Nay nạp khi Sửa và gửi xếp loại đang chọn — kiểm dữ liệu cũ (xếp loại rỗng) trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Dòng lưới của điều kiện RIÊNG vẫn gắn qua strTN_XepLoai_DieuKien_Id = id điều kiện riêng (như gốc) — procedure có phân biệt chung/riêng không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút "Xóa" trong biểu mẫu: gốc có trình xử lý nhưng nút luôn display:none (không xoá được gì). Nay hiện khi Sửa — có giữ không?
  - → Làm như hiện tại: Hiện khi Sửa, hỏi lại trước khi xoá

### apishocbong/modules/vanbang/quanlythongtin

- **[Kiểm trên host]** Sửa chưa từng chạy ở gốc. Các ô tiếng Anh (HoDem_TA, Ten_TA, Ngày/Tháng/Năm sinh TA, Giới tính TA, Career) và Xếp loại / Graduation grade không biết tên cột nên để trống — Lưu sẽ gửi rỗng, có thể ghi đè dữ liệu đang có. Cần tên cột thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tên controller TS_QuanLyThongTinQuanLyThongTin/ThemMoi và TN_QuanLyThongTin/LayDSTinhTrangQuanLyThongTin trông như do thay chữ hàng loạt (vd từ XacNhan). Kiểm trên host có tồn tại không (có thể 404).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** "Sinh tự động số hiệu / số vào sổ" gửi strPhanLoai_Id = giá trị ô ĐỐI TƯỢNG (-1/0/1), như gốc — đúng ý nghiệp vụ không?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** strDuongDanCaNhan: gốc luôn gửi rỗng (đọc một div). Bản mới gửi lại đường dẫn ảnh đang có; không cho đổi ảnh.
  - → Làm như hiện tại: Gửi ảnh đang có

### apishoclaithilai/modules/chotdanhsach/chotdanhsach

- **[Cần quyết]** Ô "Học phần" (nút Xem học phần) và ô "Trạng thái đăng ký" có trên màn nhưng bản gốc KHÔNG gửi vào danh sách (cả hai đọc dropAAAA). Có nên gửi không?
  - → Làm như hiện tại: Giữ như gốc: gửi rỗng
- **[Cần quyết]** Bảng có cột ô đánh dấu + chọn tất cả nhưng bản gốc không có nút "Chốt" hay nút nào dùng các dòng đã chọn. Chức năng chốt cần gọi procedure nào?
  - → Làm như hiện tại: Giữ cột đánh dấu, không có thao tác

### apishoclaithilai/modules/dangky/dangky

- **[Cần quyết]** Ô "Trạng thái đăng ký" có trên thanh lọc nhưng bản gốc KHÔNG gửi đi (strTinhTrangXacNhan_Id đọc ô dropAAAA). Có nên gửi giá trị ô này không?
  - → Làm như hiện tại: Giữ như gốc: gửi rỗng
- **[Cần quyết]** Lịch sử trong hộp "Đăng ký" lấy với strsanpham_Id rỗng (như gốc), tức là không lọc theo sinh viên đang chọn.
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** HLTL_XacNhanDangKy/ThemMoi gửi strSanPham_Id = ID dòng danh sách. Kiểm trên host rằng ID đó đúng là mã "sản phẩm" procedure cần và cột "Kết quả" (KETQUAXACNHAN_TEN) cập nhật sau khi lưu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apishoclaithilai/modules/dangky/lophocphan

- **[Cần quyết]** "Tạo dữ liệu thi lại": bản gốc chưa từng chạy (tra dòng chi tiết trong dữ liệu bảng lớp → lỗi JS). Bản mới gửi QLSV_NGUOIHOC_ID + DANGKY_LOPHOCPHAN_ID (làm strDiem_DanhSach_Id) của dòng chi tiết đã đánh dấu — đúng ý định?
  - → Làm như hiện tại: Mỗi dòng chi tiết đã đánh dấu một lời gọi HLTL_ThongTin/LapDSNguoiHocHocLaiThiLai
- **[Cần quyết]** strDanhGia_Id, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id của "Tạo dữ liệu thi lại" gốc đọc #dropAAAA (không tồn tại) → gửi rỗng. Có nên lấy ô lọc Đánh giá / Thời gian / Học phần (hoặc cột của dòng)?
  - → Làm như hiện tại: Gửi rỗng như gốc
- **[Cần quyết]** Tạo dữ liệu thi lại xong gốc nạp lại danh sách LỚP HỌC PHẦN (màn rời bảng chi tiết) — giữ?
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Đường GHI "Tạo dữ liệu thi lại" chưa từng chạy ở gốc — thử trên host với một dòng thử.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tham số `type` trong dữ liệu gửi đi của danh sách đăng ký chi tiết: dangky gửi "GET", lapdanhsach gửi "POST" (HTTP vẫn GET cả hai) — kiểm máy chủ có đọc tham số này.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tên cột của DKH_ThongTin2/LayDSDangKyHocKetQuaHocTap (MALOP, TENLOP, THOIGIANCHITIET, SOSVDADANGKY, SOLUONGDUKIENHOC, HOCPHITINHRIENG) chép theo genTable gốc — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apishoclaithilai/modules/lapdanhsach/lapdanhsach

- **[Cần quyết]** Khối "Thực hiện xử lý" (D_HangDoi/TaoHangDoi_LapDSHLTL_TuDong, hàng đợi LAPDSHLTL) bị ẩn ở bản gốc (display:none) nên bản mới không vẽ. Có cần mở lại không?
  - → Làm như hiện tại: Không hiện, như bản gốc
- **[Cần quyết]** Ô "Học phần" ẩn (dropSearch_DMHocPhan, nạp theo Khoa QL từ KHCT_ThongTin/LayDSKS_DaoTao_HocPhan) đã bỏ, vì người dùng không chọn được. "Lấy học phần" luôn gửi strDaoTao_HocPhan_Id rỗng.
  - → Làm như hiện tại: Bỏ ô, gửi rỗng như giá trị thật của bản gốc
- **[Kiểm trên host]** Mỗi ô sinh viên × học phần gọi LayKQNguoiHocHocLaiThiLai một lần (N × M lời gọi); ô trả rỗng thì ẩn cả dòng sinh viên. Kiểm tốc độ và số dòng bị ẩn với dữ liệu thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Bản gốc có thể lỗi JS khi chưa chọn "Đánh giá" (ô chọn nhiều, jQuery 2.2 trả null). Bản mới gửi chuỗi rỗng — kiểm procedure có hiểu rỗng là tất cả không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apishoclaithilai/modules/lapdanhsach/lophocphan

- **[Cần quyết]** Cùng khung với dangky/lophocphan (ums.hltlLhp): khác ở chỗ danh sách lớp gửi POST và chi tiết gửi type="POST" như gốc. Mọi điểm cần quyết giống bản dangky.
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** Danh sách lớp học phần gửi POST (bản dangky gửi GET) — kiểm máy chủ nhận POST cho DKH_ThongTin2/LayDSDangKyHocKetQuaHocTap.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/canhan/inbangdiem

- **[Cần quyết]** Hệ → Khóa → Chương trình → Lớp ở bản gốc là lọc "Tất cả …" (chọn lớp không cần chọn hệ/khóa); Loại xét → Kế hoạch gốc nạp sẵn MỌI kế hoạch.
  - → Làm như hiện tại: Khoá theo luật cha → con như mọi màn (Khoa quản lý là cha tuỳ chọn của Chương trình + Lớp).
- **[Cần quyết]** Báo cáo gửi strKhoaQuanLy_Id RỖNG (gốc đọc ô dropAAAA không tồn tại) dù màn có ô Khoa quản lý — có gửi giá trị ô Khoa quản lý không?
  - → Làm như hiện tại: Giữ rỗng như gốc.
- **[Cần quyết]** Phạm vi "Năm học" đổ danh sách NĂM NHẬP HỌC (gửi năm làm strDaoTao_ThoiGianDaoTao_Id); "Đợt học" dùng chung danh sách với "Học kỳ".
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Điểm kết thúc: dòng có KHONGTINHDIEM rỗng — gốc để ô trống và coi là "đã đổi" nên mỗi lần Lưu gửi dKhongTinhDiem rỗng cho mọi dòng đó.
  - → Làm như hiện tại: Hiện "Tính điểm" (0), chỉ gửi dòng người dùng thật sự đổi.
- **[Cần quyết]** Kết quả đăng ký học: dòng Tổng số tín cộng MỘT lần cho mỗi mã học phần (như gốc).
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Lưu "Không tính điểm" (pkg_diem_tonghop_xuly.XuLyKhongTinhDiem) — gốc lưu xong lỗi JS nên bảng không nạp lại; bản mới nạp lại đúng người học.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tên cột chỉ bản QLĐ dùng: DAOTAO_HOCPHAN_SOTC (Điểm toàn bộ), DAOTAO_KHOAMOLOPHP_TEN + THONGTINGIANGVIEN (Kết quả đăng ký), PHANLOAI_TEN / XEPLOAI_TEN (chứng chỉ) — kiểm có dữ liệu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Báo cáo: strQlsv_NguoiHoc_Id gửi ID DÒNG của LayDanhSachHoSoNhieuNganh (như gốc) — kiểm mẫu báo cáo nhận đúng người học.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/cauhinhhienthi/cauhinhhienthi

- **[Cần quyết]** strChiXem bản gốc gửi giá trị ô "Hiển thị" (đọc nhầm cùng một ô) → bản mới gửi ô "Chỉ xem". ĐỔI dữ liệu ghi đi.
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** Dòng MỚI không lưu được ở bản người dùng (gốc báo "Dữ liệu hệ thống chỉ có thể sửa") — nút "Thêm dòng mới" vẫn giữ như gốc. Có nên ẩn nút?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Ô màu: bỏ plugin bootstrap-colorselector, dùng ô chọn 10 màu của gốc kèm ô màu xem trước; màu ngoài 10 màu vẫn giữ nguyên khi lưu.
  - → Làm như hiện tại: Đã đổi cách dựng.
- **[Kiểm trên host]** CM_ChucNang/LayDanhSach từng lỗi PLS-00306 trên host (kiểm host 24/9) — ô Chức năng có thể trống.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/cauhinhhienthi/cauhinhhienthichung

- **[Cần quyết]** Bản gốc: strKichThuocFontChu đọc nhầm ô Độ rộng; strChiXem đọc ô Hiển thị; strThuTu gửi RỖNG (ô ẩn không giá trị) đè thứ tự cũ; dòng mới lệch một cột ở mọi tham số. Bản mới gửi đúng từng ô, thứ tự giữ THUTU của dòng. ĐỔI dữ liệu ghi đi.
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** Lưu xong bản mới NẠP LẠI (gốc không nạp lại → bấm Lưu lần hai THÊM TRÙNG các dòng mới).
  - → Làm như hiện tại: Đã sửa.
- **[Cần quyết]** Thêm dòng mới khi chưa chọn Chức năng thì gửi strChucNang_Id rỗng (như gốc). Có nên bắt chọn chức năng?
  - → Làm như hiện tại: Giữ như gốc.

### apisquanlydiem/modules/congthucdiem/congthucdiemapdung

- **[Cần quyết]** Tab học phần gửi dThuTu, tab 1 và 3 gửi iThuTu (chép nguyên); strNgayApDung luôn rỗng vì màn gốc không có ô ngày.
  - → Làm như hiện tại: Chép nguyên.
- **[Cần quyết]** Kế thừa học phần (D_ThongTin/KeThua_CongThucDiem_HP_CT_AD) cho phép đánh dấu cả chính học phần đang chọn (gốc không chặn).
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Tab người học: phạm vi = ID người học NỐI ID lớp học phần; chưa có lớp học phần thì về lời nhắc (gốc vẫn nạp/lưu với chỉ ID người học).
  - → Làm như hiện tại: Khoá theo luật cha → con.
- **[Kiểm trên host]** Kiểm cột chỉ xem "Thành phần điểm" / "Mô hình xử lý" (DIEM_THANHPHANDIEM_TEN, MOHINHXULY_TEN) có dữ liệu trên host; dòng mới hai cột này trống tới khi Lưu.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/congthucdiem/hinhthucthi

- **[Cần quyết]** Ô "Chọn thuộc tính học phần" ở bản gốc KHÔNG BAO GIỜ lọc được (html đặt id dropSearch_ThuocTinhHinhThucThi, mã đọc dropSearch_ThuocTinhHocPhan). Bản mới nạp KHCT.TTHP và gửi strThuocTinhHocPhan_Id như ý định.
  - → Làm như hiện tại: Đã sửa theo ý định — lọc thuộc tính học phần nay có tác dụng.
- **[Cần quyết]** Khung "Khai hình thức thi mới": bản mới BẮT chọn kỳ, đợt áp dụng trước khi Lưu (bản gốc gửi strDaoTao_ThoiGianDaoTao_Id rỗng).
  - → Làm như hiện tại: Bắt chọn kỳ.
- **[Cần quyết]** Xoá theo danh sách chọn: bản gốc gửi cả ô TRỐNG (strIds rỗng); bản mới chỉ gửi ô đã có bản ghi.
  - → Làm như hiện tại: Bỏ qua ô trống.
- **[Cần quyết]** Bộ môn → Môn học: chưa chọn bộ môn thì KHOÁ môn học (luật cha → con). Bản gốc cho chọn môn học khi chưa chọn bộ môn.
  - → Làm như hiện tại: Khoá theo luật chung.
- **[Kiểm trên host]** Mỗi ô học phần × kỳ gọi LayTTDiem_HTTHI_AD_PhamVi một lần (10 học phần × N kỳ = 10N lời gọi mỗi trang) — kiểm tốc độ trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Mẫu import của chức năng hiện ở nút "Import" của khung danh sách; khung Thêm mới luôn giữ nút Import cố định IMPORTWITHPROC_HTTHP — kiểm mẫu tải về đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/congthucdiem/hocphan

- **[Cần quyết]** Bấm ô TRỐNG rồi Lưu: bản gốc gửi strDiem_ThanhPhanDiem_Id rỗng (không biết loại điểm) — bản mới giữ như gốc. Có nên thêm ô chọn Loại điểm vào hộp sửa khi ô trống?
  - → Làm như hiện tại: Giữ như gốc (gửi rỗng).
- **[Cần quyết]** Mỗi ô chỉ hiện MỘT công thức (bản ghi cuối máy chủ trả), dù một học phần × kỳ có thể có nhiều loại điểm — như gốc. Có cần hiện tất cả?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Khung "Khai công thức mới": bản mới BẮT chọn kỳ trước khi Lưu (gốc gửi rỗng); không bắt chọn Loại điểm (như gốc).
  - → Làm như hiện tại: Bắt chọn kỳ, loại điểm để tự do.
- **[Kiểm trên host]** Lọc "môn chưa khai công thức" (dMonChuaKhaiCongThuc) — kiểm procedure PKG_KEHOACH_THONGTIN2.LayDSKS_DaoTao_HocPhan lọc đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/congthucdiem/lophocphan

- **[Cần quyết]** Lưu công thức: bản mới BẮT chọn Loại điểm (gốc gửi strDiem_ThanhPhanDiem_Id rỗng).
  - → Làm như hiện tại: Bắt chọn loại điểm.
- **[Cần quyết]** Hộp Kế thừa: đổi Thời gian TRONG hộp ở bản gốc không nạp lại gì (gắn nhầm vào ô của khung tìm kiếm) — bản mới nạp lại Khoá/CT/Học phần theo Thời gian của hộp. Hệ → Khoá → CT khoá theo luật cha → con.
  - → Làm như hiện tại: Đã sửa theo ý định.
- **[Cần quyết]** Hộp Kế thừa gửi dChiLayCacLopChuaPhanCong theo ô đánh dấu của KHUNG TÌM KIẾM (như gốc) và strDaoTao_KhoaQuanLy_Id rỗng — có đúng ý nghiệp vụ?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Hộp "Mở khóa sửa": cột Lý do gốc đổ SOQUYDINH vào ô nhập không bao giờ lưu → nay hiện LYDOMOCHANSUA (chỉ đọc). Kiểm tên cột trả về của LayDSDiem_CTD_MoChanSua.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Khung "Dồn lớp" (#zoneEdit) và "Thiết lập lớp riêng" có mã nhưng KHÔNG có lối vào trên màn gốc → không chuyển. Cần thì báo.
  - → Làm như hiện tại: Bỏ.
- **[Cần quyết]** "Lọc lớp thiếu công thức" lọc trên TRANG vừa nạp (như gốc) — trang có thể ít hơn 10 dòng dù còn lớp thiếu ở trang sau.
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** D_ThongTin/KeThucCongThucDiemTheoLopHP và D_CongThucDiem_ApDung/ThemMoi (không mã hoá, không iM) — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/diemdacbiet/diemdacbietapdung

- **[Cần quyết]** Ô "Giá trị xử lý" (dGiaTriXuLy) là ô chữ tự do, không kiểm số (như gốc). Có cần chặn chữ?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Lưu gửi D_DiemDacBiet_ApDung/ThemMoi cho cả dòng cũ (strId = ID) — gốc chú thích bỏ CapNhat. Kiểm máy chủ cập nhật đúng dòng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Lưu xong nạp lại bảng (gốc không nạp → Lưu lần hai thêm trùng).
  - → Làm như hiện tại: Đã sửa theo ý định.

### apisquanlydiem/modules/kehoach/kehoach

- **[Cần quyết]** Lưu kế hoạch MỚI: gốc giữ ID rỗng nên bấm Lưu lần hai là thêm trùng, các dòng phạm vi "chưa lưu" cũng bị thêm lại. Bản mới nhớ ID máy chủ trả (raw.Id), đổi sang "Sửa" và ở lại biểu mẫu.
  - → Làm như hiện tại: Nhớ ID mới, lần Lưu sau gọi Sua_Diem_KeHoachCongNhanDiem; phạm vi lưu xong nạp lại bảng.
- **[Cần quyết]** Hộp Xác nhận (Kết quả công nhận): gốc gửi strLoaiXacNhan_Id = ô "Loại công nhận" của HỘP SỬA (ô khác hộp) và strNoiDung = ô #strNoiDung không tồn tại. Bản mới gửi ô "Hành động Xác nhận" (danh sách loại công nhận) và ô "Nội dung Xác nhận" của chính hộp Xác nhận. Màn anh em CCB/nhapdiem/duyetchuyendiem gửi chữ cố định "BangDiem"/"ChungChi" cho cùng procedure — bên nào đúng?
  - → Làm như hiện tại: Gửi giá trị ô loại công nhận của hộp Xác nhận + nội dung đã nhập.
- **[Cần quyết]** Hộp sửa công nhận điểm: gốc bật tải tệp minh chứng nhưng Lưu không gắn tệp (saveFiles) → tệp mất. Bản mới Lưu xong gắn tệp mới vào khoá "CongNhan" + ID kế hoạch + ID người học (SV_Files/ThemMoi).
  - → Làm như hiện tại: Đường GHI mới — gắn tệp sau khi lưu.
- **[Cần quyết]** Hộp sửa công nhận điểm: gốc không xoá trắng biểu mẫu và giữ ID chi tiết của lần mở trước khi LayTTDiem_NguoiHoc_HocPhan_Cap không trả dòng → Lưu ghi đè bản ghi của sinh viên khác.
  - → Làm như hiện tại: Xoá trắng, strId rỗng khi không có chi tiết.
- **[Cần quyết]** Thông tin quyết định: "Thêm SV vào quyết định", "Thực hiện tạo danh sách điểm", "Chuyển điểm" gốc chạy với Quyết định rỗng. Bản mới bắt chọn Quyết định trước; bốn thao tác ghi hàng loạt (tạo DS điểm, chuyển điểm, tính phí, hủy tính phí) có hỏi lại.
  - → Làm như hiện tại: Bắt chọn quyết định + hỏi lại; tính phí xong nạp lại danh sách.
- **[Kiểm trên host]** Danh sách phân nhân sự: tên tham số strDiem_KeHoach_NhanSu_Id mang ID KẾ HOẠCH (như gốc) cả khi lấy danh sách lẫn khi thêm — kiểm procedure đọc đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tính phí / Hủy tính phí đọc NGHIEPVUAPDUNG_ID, KIEUHOC_ID, TAICHINH_CACKHOANTHU_ID, DAOTAO_THOIGIANDAOTAO_ID, DAOTAO_CHUONGTRINH_ID từ dòng LayDSKH_NguoiHoc_HP_Cap_QD — bảng gốc không hiện các cột này, chưa rõ máy chủ có trả không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Cột "Files" và nút "Tải file": mỗi dòng một lời gọi SV_Files/LayDanhSach (như gốc); Tải file gọi CMS_Files/GopFile với mảng đường dẫn / tên — kiểm tệp .zip mở được trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Mở "Nộp hồ sơ" bản mới nạp luôn cả hai tab (gốc để bảng của kế hoạch mở lần trước tới khi bấm Tìm kiếm).
  - → Làm như hiện tại: Nạp ngay khi mở.

### apisquanlydiem/modules/kehoach/quydoichungchi

- **[Cần quyết]** Gốc KHÔNG BAO GIỜ gửi strId khi lưu (cả quy đổi lẫn bảng chi tiết) → bấm Sửa rồi Lưu là thêm dòng mới. Bản mới sửa gửi strId + Sua_Diem_TT_CC_CapDo / Sua_Diem_CC_CapDo_QuyDoi_DK (tên action có sẵn trong gốc nhưng chưa từng chạy).
  - → Làm như hiện tại: Sửa gọi action Sua_… kèm strId — đường GHI mới.
- **[Kiểm trên host]** Mở Sửa: gốc đổ ô bằng cột chép từ màn kế hoạch (MA, TENKEHOACH, MOHINHDANGKY_ID, HIEULUC). Bản mới đọc PHANLOAICC_ID và DIEM_THONGTIN_CHUNGCHI_ID — tên cột ĐOÁN, kiểm máy chủ có trả.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Bảng quy đổi chi tiết: nút Sửa gốc không có xử lý; Thêm/Xoá xong gốc nạp lại danh sách chính. Bản mới mở biểu mẫu sửa và nạp lại bảng chi tiết. Công thức tính của chi tiết đọc cột DIEM_CONGTHUCDIEM_ID (đoán).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Sửa một dòng chi tiết mà không bấm "Chọn" phạm vi: bản mới gửi strPhamViApDung_Id rỗng (gốc cũng vậy nếu mở được Sửa) — procedure có xoá phạm vi cũ không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Ô Đơn vị của biểu mẫu chi tiết được nạp nhưng KHÔNG gửi đi (như gốc). Ô Đầu điểm nạp theo cấp độ RỖNG (gốc đọc ô dropAAAA). Có cần lọc Đầu điểm theo cấp độ đang xem không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Phạm vi công nhận chỉ nhận theo hệ / khóa / chương trình / lớp (gốc không xử lý chọn từng sinh viên); "Thêm từng hệ" gốc hỏng (kiểm nhầm mảng khoá) nay nhận được; bấm nhiều lần thì CỘNG DỒN như gốc.
  - → Làm như hiện tại: Cộng dồn, nhãn hiện đủ.
- **[Cần quyết]** Ô từ khoá của thanh lọc gốc không gửi đi → bản mới lọc tại chỗ trên các dòng đã tải.
  - → Làm như hiện tại: Lọc tại chỗ.

### apisquanlydiem/modules/nhapdiem/mien

- **[Kiểm trên host]** Gốc gửi strTuKhoa từ ô không tồn tại (luôn rỗng) dù có ô "Nhập từ khóa tìm kiếm" + Enter để tìm → bản mới gửi ô từ khoá. Kiểm procedure có lọc theo từ khoá.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Lưu không bắt chọn "Đánh giá" (gửi strDanhGia_Id rỗng nếu chưa chọn) — như gốc. Có cần bắt chọn không?
  - → Làm như hiện tại: Không bắt, như gốc
- **[Cần quyết]** Danh sách không phân trang (gốc tắt bPaginate) — quyết định lớn có thể rất dài.
  - → Làm như hiện tại: Không phân trang, như gốc
- **[Kiểm trên host]** Kiểm D_Mien/LayDSNguoiHocTheoQuyetDinh trả { rs, rsKetQua } và các cột DAOTAO_TOCHUCCHUONGTRINH_*, NGAYTAO_DD_MM_YYYY_HHMMSS, NGUOITAO_TAIKHOAN trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/nhapdiem/nhapdiem

- **[Cần quyết]** Ô "Lớp quản lý" lọc danh sách học phần nhưng KHÔNG khoá ô Học phần (lọc tuỳ chọn — bỏ trống là mọi học phần của thời gian). Có cần bắt chọn lớp trước không?
  - → Làm như hiện tại: Không khoá, như gốc
- **[Cần quyết]** Báo cáo ở đầu danh sách (vùng DiemNgoai) gửi strDangKy_KeHoachDangKy_Id RỖNG, còn báo cáo trong lưới gửi ô kế hoạch đăng ký học — gốc khác nhau ở hai vùng. Giữ như gốc?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** "Xác nhận điểm thành phần" / "Xác nhận điểm danh" ở đầu danh sách xác nhận THEO BỘ LỌC (D_NguoiHoc/XacNhanDiem_DanhSachHoc) — gửi strNguoiDung_Id và kế hoạch đăng ký học RỖNG, không gửi nội dung (gốc có ô nội dung nhưng không gửi). Bản mới bỏ ô nội dung khỏi hộp.
  - → Làm như hiện tại: Giữ lời gọi như gốc, bỏ ô nội dung không gửi
- **[Cần quyết]** "Nhập điểm mặc định" không kiểm ô điểm (để trống vẫn gửi strDiemCanNhapMacDinh rỗng) — như gốc. Có cần bắt nhập không?
  - → Làm như hiện tại: Không kiểm, như gốc
- **[Cần quyết]** "Xác nhận từng sinh viên" lấy 3 cột thông tin người học thứ 2–4 của công thức (gốc chép ô cột 1,2,3 của tiêu đề) — nếu cột đầu công thức không phải STT thì sẽ thiếu Mã số.
  - → Làm như hiện tại: Cột 2–4 như gốc
- **[Cần quyết]** Cột "Files" gốc tải tệp lên là LƯU NGAY; bản mới mở hộp "Tệp đính kèm", bấm Lưu mới ghi (ums.files, NS_Files).
  - → Làm như hiện tại: Hộp tệp + nút Lưu
- **[Cần quyết]** Không có quy tắc hệ 10 (gõ 85 → 8.5) như bản Cổng cán bộ — gốc Quản lý điểm không có.
  - → Làm như hiện tại: Không đổi, như gốc
- **[Kiểm trên host]** Xác nhận / Công bố / Xác nhận từng SV: kiểm D_HanhDongXacNhan/LayDanhSach KHÔNG gửi strDiem_DanhSachHoc_Id trả đúng các nút hành động; lịch sử từng SV tra theo id ghép "id bảng điểm + QLSV_NGUOIHOC_ID".
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Nhập điểm qua file (đầu danh sách): kiểm ums.upload + D_Hoc_NguoiHoc_Diem_Import/Import (GET strPath) — thông báo "Đã import dữ liệu: …".
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Bảng điểm cột "Thời gian học" đọc NGAYBATDAU / NGAYKETTHUC, hai cột "Đã xác nhận" đọc XACNHANHOANTHANHNHAPDIEM / XACNHANHOANTHANHDIEMDANH (= 1) — kiểm tên cột trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/nhapdiem/nhapdiemchamkiemtra

- **[Kiểm trên host]** Thời gian lấy từ TP_PhucKhao/LayThoiGianTheoDotThi (hàm của PHÚC KHẢO) và đọc cột DAOTAO_THOIGIANDAOTAO (bản phúc khảo đọc THOIGIAN) — kiểm tên cột trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Gốc không tự chọn thời gian đầu; mở màn nạp danh sách với thời gian rỗng. Giữ như gốc?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Ô "Nhập từ khóa tìm kiếm" gốc không gửi đi ở bất cứ lời gọi nào → bỏ ô (như bản Cổng cán bộ).
  - → Làm như hiện tại: Bỏ ô

### apisquanlydiem/modules/nhapdiem/nhapdiemphuckhao

- **[Cần quyết]** Bản Quản lý điểm vẽ MỘT bảng, không chia ba bảng theo PHANLOAI như bản Cổng cán bộ; điểm hiện / gửi nguyên văn (không đổi "7,5"). Nếu máy chủ trả dòng DST / TUI thì các cột ngày thi / túi / phách không hiện.
  - → Làm như hiện tại: Một bảng, như gốc
- **[Cần quyết]** Ô "Nhập từ khóa tìm kiếm" gốc không gửi đi → bỏ ô.
  - → Làm như hiện tại: Bỏ ô

### apisquanlydiem/modules/phanquyen/diem

- **[Kiểm trên host]** Gốc: Thêm quyền đọc biến dApDungQuyenChoCaLHP không tồn tại → lỗi JS, nút "Phân quyền" (phần thêm) và "Lưu" của biểu mẫu CHƯA TỪNG ghi được. Bản mới gửi đúng ô "Áp dụng cho cả lớp học phần" (1/0) — đường GHI mới, thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút "Tìm kiếm" trong biểu mẫu Thêm mới (#btnSearch2) gốc không có xử lý → giữ nút, khoá. Nút này định tìm gì?
  - → Làm như hiện tại: Khoá nút
- **[Cần quyết]** Tiêu đề biểu mẫu gốc ghi "Thêm mới - Kế hoạch" (chép từ màn khác) → "Thêm mới - Phân quyền".
  - → Làm như hiện tại: Đổi tiêu đề
- **[Cần quyết]** Lưu biểu mẫu Thêm mới không hỏi lại và ở lại biểu mẫu (như gốc); nay bắt có ít nhất một cán bộ, một phạm vi, một quyền (gốc bấm là không làm gì).
  - → Làm như hiện tại: Giữ, thêm nhắc chọn
- **[Cần quyết]** Ô Hệ đào tạo dùng danh sách KHÔNG lọc quyền (edu.system.getList_HeDaoTao) như gốc — màn phân quyền của quản trị nên có lẽ đúng.
  - → Làm như hiện tại: Không lọc quyền, như gốc
- **[Kiểm trên host]** Đổi "Áp dụng cho cả lớp học phần" của một dòng thì gửi lại Them_… cho mọi quyền đã có của dòng (gốc làm vậy để cập nhật cờ) — kiểm procedure Them cập nhật được bản ghi đã có (không báo trùng).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsochung/khaibaothamsochung

- **[Cần quyết]** Gốc: nút "Lưu và Nhập tiếp" chưa từng chạy (gắn #btnReWrite, nút chỉ có class). Bản mới cho chạy như các màn anh em: lưu xong xoá trắng biểu mẫu để nhập tiếp.
  - → Làm như hiện tại: Cho chạy
- **[Cần quyết]** Gốc khai ô bắt buộc (Số lần học, Số lần thi, Ngày áp dụng) nhưng KHÔNG kiểm — bản mới cũng không bắt buộc ô nào. Có cần bắt buộc không?
  - → Làm như hiện tại: Không bắt buộc, như gốc

### apisquanlydiem/modules/thamsochung/thamsochungapdung

- **[Kiểm trên host]** Lưu gửi D_ThamSoHocTapChung_ApDung/ThemMoi cho MỌI dòng, kể cả dòng đã lưu (strId = ID) — bản gốc chú thích bỏ nhánh CapNhat. Máy chủ có cập nhật đúng dòng theo strId, hay tạo dòng mới?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Bản gốc lưu xong KHÔNG nạp lại bảng nên bấm Lưu lần hai là thêm trùng; bản mới lưu xong nạp lại (dòng mới nhận id thật).
  - → Làm như hiện tại: Đã sửa theo ý định — lưu xong nạp lại bảng.
- **[Cần quyết]** Tab chương trình gửi cả dòng chưa chọn "Tham số học tập" (gốc bỏ kiểm tra); tab học phần thì bỏ qua dòng đó. Có cần chặn dòng trống ở tab chương trình không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Phạm vi áp dụng tab học phần = ID học phần NỐI ID chương trình (chuỗi ghép 64 ký tự, strPhamViApDung_Id) — kiểm máy chủ đọc đúng chuỗi ghép này.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Nút Xóa ở dòng có LADULIEUKHOITAO khác "0" chỉ gỡ dòng khỏi màn, không gọi Xoa (như gốc). Dòng khởi tạo có được phép xoá thật không?
  - → Làm như hiện tại: Giữ như gốc (chỉ gỡ khỏi màn).
- **[Cần quyết]** "Kế thừa cho tất cả chương trình trong khóa" nay hỏi lại trước khi gửi D_ThamSoHocTapChung_ApDung/KeThua (gốc gửi ngay).
  - → Làm như hiện tại: Hỏi lại (đường ghi hàng loạt).
- **[Kiểm trên host]** Kế thừa xong bản gốc không nạp lại gì — kiểm các chương trình khác cùng khoá đã nhận tham số.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsodanhgiaketqua/thamsodanhgiaketqua

- **[Cần quyết]** Gốc đổ THUTUUUTIEN vào ô #txtThuTuUuTien không có trên màn; Lưu luôn gửi iThuTu rỗng. Có cần ô "Thứ tự ưu tiên" không?
  - → Làm như hiện tại: Không hiện, gửi rỗng như gốc

### apisquanlydiem/modules/thamsodanhgiaketqua/thamsodanhgiaketquaapdung

- **[Cần quyết]** Tab người học: danh sách SV lọc theo ô Hệ đào tạo đang chọn ở cột trái (strHeDaoTao_Id) — gốc làm vậy, có đúng ý không?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Tab người học: phạm vi = ID người học + ID chương trình + ID học phần ở ô "Tất cả học phần" (trống thì chỉ người học + chương trình).
  - → Làm như hiện tại: Chép nguyên chuỗi ghép; ô học phần là lọc tuỳ chọn, không khoá.
- **[Cần quyết]** Tab 2, 3 gửi cả strDiem_ThamSoDanhGia_Id lẫn strDiem_ThamSoDanhGiaKQ_Id cùng giá trị; tab 1 chỉ gửi KQ.
  - → Làm như hiện tại: Chép nguyên.
- **[Kiểm trên host]** Hộp "Kế thừa cho các chương trình cùng học HP này" (PKG_DIEM_THONGTIN2.KeThuaDiem_TSDanhGiaKetQua_AD): chạy thử trên host — dòng chưa chọn Thời gian áp dụng vẫn gửi rỗng như gốc.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsolamtron/thamsolamtronapdung

- **[Cần quyết]** Tab chương trình luôn gửi D_ThamSoLamTron_ApDung/ThemMoi (kể cả dòng cũ có strId), còn tab học phần gửi CapNhat cho dòng cũ — hai tab cùng màn xử lý khác nhau (chép nguyên gốc). Có nên thống nhất dùng CapNhat?
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Ô "Có làm tròn" không có dòng trống: dòng cũ có COLAMTRON rỗng nay hiện "Không" và Lưu gửi dCoLamTron = 0 (gốc để ô trống → gửi rỗng).
  - → Làm như hiện tại: Hiện "Không" / gửi 0.
- **[Cần quyết]** Lưu xong nạp lại bảng (gốc không nạp → Lưu lần hai thêm trùng).
  - → Làm như hiện tại: Đã sửa theo ý định.
- **[Kiểm trên host]** Kiểm CapNhat tab học phần với strPhamViApDung_Id ghép (ID học phần + ID chương trình).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsoquydoithangdiem/thamsoquydoithangdiem

- **[Kiểm trên host]** Gốc: "Lưu và Nhập tiếp" khi đang SỬA gọi hàm không tồn tại (lỗi JS, không lưu). Bản mới gọi CapNhat như nút Lưu — đường GHI này chưa từng chạy ở gốc.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsoquydoithangdiem/thamsoquydoithangdiemapdung

- **[Kiểm trên host]** Tab người học: gốc Lưu đọc nhầm id ô của tab học phần → mọi dòng gửi RỖNG. Bản mới gửi đúng giá trị trên dòng — đây là đường GHI chưa từng chạy đúng ở gốc.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Tab người học: phạm vi = ID người học NỐI ID lớp học phần (không có ID chương trình). Chưa có lớp học phần thì bản mới về lời nhắc; gốc vẫn nạp/lưu với phạm vi = chỉ ID người học.
  - → Làm như hiện tại: Khoá theo luật cha → con (Thời gian → Lớp học phần).
- **[Cần quyết]** Không tab nào kiểm dòng trống khi Lưu (như gốc) — có cần bắt buộc chọn "Tham số quy đổi điểm"?
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Hộp Kế thừa (PKG_DIEM_THONGTIN2.KeThuaDiem_QuyDoiThangDiem_AD): chạy thử trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsotinhdiem/khaibaothamsotinhdiem

- **[Kiểm trên host]** Gốc: sau khi mở Sửa một dòng, bấm "Thêm mới" rồi Lưu lại GHI ĐÈ dòng vừa sửa (rewrite xoá nhầm biến). Bản mới "Thêm mới" luôn tạo bản ghi mới. Có bản ghi nào trên host từng bị ghi đè kiểu này cần rà lại không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thamsotinhdiem/thamsotinhdiemapdung

- **[Cần quyết]** Kế thừa (tab 1) gửi D_ThamSoTongHop_ApDung/KeThua với strDaoTao_KhoaDaoTao_Id = ID KHOÁ (các màn anh em gửi strDaoTao_ChuongTrinh_Id). Nút gốc ghi "Kế thừa cho tất cả chương trình trong hệ đào tạo" — thực chất là trong KHOÁ?
  - → Làm như hiện tại: Giữ đúng tham số và chữ của gốc; gốc không hỏi lại, bản mới hỏi lại trước khi chạy.
- **[Cần quyết]** Tab 2 bỏ qua dòng chưa chọn Quy chế khi Lưu, tab 1 gửi cả dòng trống (như gốc).
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Kiểm Lưu / Xoá / Kế thừa trên host (phạm vi tab 2 = ID chương trình NỐI ID khoá).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thanhphandiem/khaibaothanhphandiem

- **[Cần quyết]** Lưu gửi dThuTu rỗng — gốc đọc ô #txtThuTu nhưng ô đó không có trên màn (bảng cũng không hiện thứ tự). Có cần thêm ô Thứ tự không?
  - → Làm như hiện tại: Gửi rỗng, như gốc
- **[Kiểm trên host]** Cột "Cho phép lập ds thi" hiện theo CHOPHEPLAPDANHSACHTHI khác 0 / rỗng (như gốc). Nếu máy chủ trả chuỗi "0" thì sẽ hiện nhầm "Cho phép" — kiểm kiểu dữ liệu trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thanhphandiem/khaibaothanhphandiemapdung

- **[Kiểm trên host]** Lưu gửi D_ThanhPhanDiem_ApDung/ThemMoi kèm 9 tham số cố định rỗng (strMa, strTen, dCoChoPhepThiLai, strThangDiem_Id, strKyHieu, dLaDiemTongKet, dLaThanhPhanDiemCuoi, iThuTu, strPhanCapApDung_Id) — kiểm máy chủ không ghi đè thông tin thành phần điểm bằng giá trị rỗng khi strId có giá trị.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Gốc: "Thêm dòng" ở tab chương trình chèn 2 ô trống thừa (lệch cột), ô chọn có thẻ <option> không đóng (thêm dòng trống thừa).
  - → Làm như hiện tại: Đã sửa — dòng mới đúng cột, mỗi ô một dòng "-- Chọn --".
- **[Kiểm trên host]** Ô "Giá trị mặc định" đọc cột GIATRIMACDINHKHICHUACODIEM nhưng gửi tham số strGiaTriMacDinhChuaCoDiem (tên khác nhau, chép nguyên) — kiểm giá trị lưu xong hiện lại đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Lưu xong nạp lại bảng (gốc không nạp → Lưu lần hai thêm trùng).
  - → Làm như hiện tại: Đã sửa theo ý định.

### apisquanlydiem/modules/thongke/diemhocphan

- **[Cần quyết]** Gốc: nút Xuất báo cáo đọc edu.DiemHocPhan.strPhamViMa (biến không tồn tại) → lỗi JS, báo cáo chưa từng chạy. Bản mới gửi strDaoTao_ThoiGianDaoTao_Id = ô "Nhiều kỳ" (ô thời gian duy nhất trên màn). Đúng ý nghiệp vụ không?
  - → Làm như hiện tại: Gửi ô Nhiều kỳ
- **[Cần quyết]** Tiêu đề bảng gốc có cột "Điểm trung bình" nhưng không đổ dữ liệu (chỉ Mã SV + Họ tên). Bản mới bỏ cột trống. Máy chủ có trả cột điểm nào cần hiện không?
  - → Làm như hiện tại: Chỉ Mã SV + Họ tên
- **[Cần quyết]** Đơn vị → Học phần nay KHOÁ tới khi chọn Đơn vị (gốc nạp sẵn mọi học phần). Có cần chọn học phần không theo đơn vị không?
  - → Làm như hiện tại: Khoá theo luật cha → con
- **[Kiểm trên host]** "Thực hiện" (D_TongHop_XuLy/ThucHien_ThongKe_DHP) ghi ra bảng dữ liệu theo tên nhập ở ô "LIST BẢNG DỮ LIỆU"; không kiểm ô nào (như gốc). Thử trên host: tên bảng rỗng thì máy chủ làm gì?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thongke/diemtrungbinh

- **[Cần quyết]** Gốc: báo cáo đọc edu.DiemTrungBinh.strPhamViMa (không tồn tại) → lỗi JS. Bản mới đọc ô thời gian của phạm vi đang chọn.
  - → Làm như hiện tại: Đọc phạm vi đang chọn
- **[Kiểm trên host]** "Thuộc tính điểm" gửi CHỮ "Lần 1" / "Cao nhất" vào dThuocTinhDiem (tham số kiểu số) — như gốc. Kiểm procedure ThucHien_ThongKe_DTB trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Tiêu đề bảng gốc có cột "Điểm trung bình" nhưng không đổ dữ liệu → bản mới bỏ cột trống.
  - → Làm như hiện tại: Chỉ Mã SV + Họ tên

### apisquanlydiem/modules/thongke/nhapdiemhocphan

- **[Kiểm trên host]** Gốc gửi dLocKhongHoanThanhNhapDiem = ô "txtAAAA" (không tồn tại → không gửi) nên ô "Chọn lọc" trên màn không có tác dụng (chỉ vào báo cáo). Bản mới gửi giá trị ô Chọn lọc như màn "khoá học" cùng phân hệ. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thongke/nhapdiemkhoahoc

- **[Cần quyết]** Thời gian → Khoa quản lý / Học phần nay KHOÁ tới khi chọn Thời gian (gốc nạp sẵn khi mở màn). Khoa quản lý → Học phần chỉ lọc thêm, không khoá.
  - → Làm như hiện tại: Khoá theo luật cha → con
- **[Kiểm trên host]** Ô tiến độ gửi strDangKy_KeHoachDangKy_Id rỗng (màn không có ô Kế hoạch — như gốc). Kiểm số SL / Tỷ lệ % có ra trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thongke/nhapdiemlichthi

- **[Cần quyết]** Gốc chia id đã chọn thành lô bằng slice(0,100), slice(101,200)… → bỏ sót dòng thứ 101, 201, …; bản mới chia đúng. Quá 1.000 dòng vẫn chỉ gửi 1.000 đầu (như gốc) nhưng có báo.
  - → Làm như hiện tại: Sửa cách chia lô
- **[Cần quyết]** Tab "Thống kê điểm chữ" chỉ đếm theo học phần (ba tab kia đếm theo học phần + khoa quản lý) — giữ như gốc. Học phần mở ở hai khoa thì số của tab 1 bị đếm gộp. Có cần lọc thêm khoa quản lý không?
  - → Làm như hiện tại: Giữ như gốc
- **[Kiểm trên host]** "Thống kê" (PKG_DIEM_THONGKE.ThongHocTapTheoDST) — kiểm tên cột trả về (rsThongTinHocPhan, rsDuLieuDiemHe10.DIEM …) trên host; gốc đặt ô theo ID dòng nhưng đổ theo DAOTAO_HOCPHAN_ID, bản mới tính thẳng từng dòng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thongke/nhapdiemlophocphan

- **[Kiểm trên host]** Gốc gửi dLocKhongHoanThanhNhapDiem = ô không tồn tại → ô "Chọn lọc" không có tác dụng. Bản mới gửi giá trị ô Chọn lọc. Kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Đợt thi nạp theo strDaoTao_ThoiGianDaoTao_Id = id KẾ HOẠCH (chép nguyên gốc — tên tham số là thời gian) → nay khoá Đợt thi tới khi chọn Kế hoạch. Kiểm danh sách đợt thi trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thongke/thongkediemchu

- **[Cần quyết]** Mọi ô lọc là ô CHỌN NHIỀU mang nhãn "Tất cả …" (lọc tuỳ chọn) → KHÔNG khoá ô con theo luật cha → con; đổi / xoá ô cha thì nạp lại ô con như gốc. Có cần khoá không?
  - → Làm như hiện tại: Không khoá (lọc tuỳ chọn)
- **[Kiểm trên host]** Bảng kết quả vẽ cột ĐỘNG theo khoá của dòng đầu (tên cột = tên khoá bỏ gạch dưới) — kiểm tên cột máy chủ trả trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/thongke/tonghopketqua

- **[Cần quyết]** html gốc nạp modules/TINHDIEM/script/tonghopketqua.js, không phải tệp thongke cùng tên — bản mới chuyển theo tệp đang chạy (tinhdiem). Màn này có phải bản trùng của Tính điểm → Tổng hợp kết quả không; còn giữ mục menu?
  - → Làm như hiện tại: Chuyển theo tệp tinhdiem
- **[Cần quyết]** Khung "Tính chất lọc dữ liệu" gốc có 7 ô nhưng chỉ Thang điểm được gửi đi (Tính chất lọc, Loại danh sách, Số lượng, Thành phần điểm, Đơn vị, Học phần không vào lời gọi nào, phần lớn còn không có dữ liệu) → bản mới chỉ giữ Thang điểm.
  - → Làm như hiện tại: Chỉ giữ Thang điểm
- **[Cần quyết]** Ba nút Xuất báo cáo · Xem danh sách · Tính điểm gốc nằm cuối khung trái (và lặp lại ở khung phải, bản lặp không có xử lý) → bản mới một bộ ở đầu trang.
  - → Làm như hiện tại: Một bộ ở đầu trang
- **[Kiểm trên host]** "Tính điểm" tạo hàng đợi TINHDIEMTUDONG (D_HangDoi/TaoHangDoi_TinhDiem_TuDong) — thử trên host: hàng đợi hiện, chạy xong tự nạp lại danh sách.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/tinhdiem/inbangdiem

- **[Cần quyết]** Bản gốc là TRANG MẪU tĩnh (bảng thử cột cố định "Normal Header / Info Long"), .js đi kèm là bản chép cũ của Tổng hợp kết quả và không gắn được vào trang. Gỡ khỏi menu hay mô tả nghiệp vụ để dựng thật?
  - → Làm như hiện tại: Khung "chưa có nội dung", không gọi API.

### apisquanlydiem/modules/tinhdiem/tonghopketqua

- **[Cần quyết]** Hai hàng đợi (Tính điểm TINHDIEMTUDONG, Xếp loại TINHDIEMTUDONG_XEPLOAI) cùng strName nên gốc vẽ ĐÈ nhau vào một chỗ.
  - → Làm như hiện tại: Vẽ cả hai: tiến trình dưới khối điều kiện, lịch sử thành hai khối ở cột phải.
- **[Cần quyết]** Danh sách Lớp gửi strDaoTao_Nganh_Id = Khoa quản lý và strDaoTao_KhoaQuanLy_Id rỗng (gốc truyền nhầm tên tham số) — nghi lỗi gốc.
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Hộp chọn sinh viên (tab 2 "Thêm") thiếu hai nút của gốc: "Thêm từng hệ", "Thêm Khoa quản lý - khóa học" (hộp chung ums.pat.pickSinhVienNganh chưa có).
  - → Làm như hiện tại: Có Chọn sinh viên + Thêm từng khóa / chương trình / lớp.
- **[Cần quyết]** Tab 2 "Thêm" không bắt chọn Phạm vi tổng hợp / Thời gian trước khi lưu (như gốc).
  - → Làm như hiện tại: Giữ như gốc.
- **[Kiểm trên host]** Thêm sinh viên: strPhamViApDung_Id = QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID GHÉP CHUỖI (như gốc) — kiểm procedure hiểu đúng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tính điểm (GET D_HangDoi/TaoHangDoi_TinhDiem_TuDong) · Xếp loại (POST diem_nhiemvu_hangdoi.TaoHangDoi_XepLoai_TuDong) · chạy hàng đợi với "Số luồng" — kiểm trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisquanlydiem/modules/tracuudiem/tracuudiem

- **[Cần quyết]** Ô "Thông tin tìm kiếm" và "Thang điểm" không gửi vào lời gọi nào (như gốc — Enter ở ô tìm chỉ nạp lại học phần của lớp).
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Hệ → Khóa → Chương trình → Lớp: gốc chọn Lớp chỉ cần Hệ; nay Lớp mở khi đã chọn Chương trình (luật cha → con). Khoa quản lý là cha tuỳ chọn.
  - → Làm như hiện tại: Khoá theo luật cha → con.
- **[Cần quyết]** "Nhiều kỳ" chọn MỘT, "Năm học" / "Học kỳ" chọn NHIỀU (như html gốc); chọn nhiều gửi chuỗi "a,b".
  - → Làm như hiện tại: Giữ như gốc.
- **[Cần quyết]** Thống kê: "Số - Xem" mở danh sách từ kết quả của lời gọi đếm (gốc gọi lại y hệt lần nữa).
  - → Làm như hiện tại: Dùng lại kết quả đếm.
- **[Kiểm trên host]** Bảng điểm: LayChiTiet_Post + mỗi cột lá một lời gọi LayGiaTriDiemTheoLopQuanLy (tối đa 10 cùng lúc) — kiểm tốc độ với lớp đông / nhiều học phần.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Thống kê theo ngành / CTĐT: mỗi (ngành|CTĐT × khóa × xếp loại) một lời gọi; strVaiTroDangNhap_Id để hệ tự điền (= vai trò đang mở, như makeRequest gốc).
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Export (reportAllTable_User → ums.report.taiBangNhap) của ba bảng — kiểm tệp tải về.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisrenluyen/modules/khaibaoheso/hesoapdung

- **[Kiểm trên host]** Khung năm học: cột "Năm học" đọc DAOTAO_THOIGIANDAOTAO_KY như gốc — có thể trống với dòng theo năm; cần tên cột năm thật.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Ô "Năm học" trong biểu mẫu HỌC KỲ không gửi đi (như gốc) — giữ, bỏ, hay dùng lọc Thời gian theo năm?
  - → Làm như hiện tại: Giữ, chỉ để xem

### apisrenluyen/modules/nhapdiemrenluyen/nhapdiemrenluyen

- **[Cần quyết]** strId gửi ĐIỂM CŨ của ô (gốc gán name = DIEM rồi gửi làm strId) — procedure đọc strId thế nào?
  - → Làm như hiện tại: Giữ như gốc
- **[Cần quyết]** Tổng hợp gốc không hỏi lại, có thể tổng hợp cả trường khi bộ lọc trống
  - → Làm như hiện tại: Hỏi lại trước khi tổng hợp

### apisrenluyen/modules/tieuchidiem/tieuchidiem

- **[Kiểm trên host]** Xoá tiêu chí (người dùng yêu cầu 2026-09-25, gốc chưa từng xoá được): xoá cha thì xoá MỌI con cháu, con cháu trước rồi cha, mỗi id một lời gọi RL_TieuChiDanhGia/Xoa (strIds) — đường GHI mới: thử trên host với tiêu chí thử; kiểm procedure có tự xoá con / có chặn khi tiêu chí đã được áp dụng hoặc đã có điểm không.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Gốc lấy danh sách tiêu chí với pageSize = pageSize_default (10) nên cây bị cắt; bản mới gửi pageSize 10000.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisrenluyen/modules/tieuchidiem/tieuchidiemapdung

- **[Cần quyết]** "Tiêu chí chung" nay nạp theo đối tượng/khoá/thời gian ĐANG LỌC mỗi lần mở biểu mẫu (gốc nạp một lần với tham số rỗng).
  - → Làm như hiện tại: Theo phạm vi đang lọc
- **[Kiểm trên host]** Sửa: bốn ô phạm vi lấy từ cột PHAMVIAPDUNG_ID / DAOTAO_THOIGIANDAOTAO_NAM_ID / _KY_ID của dòng (đoán theo bản xếp loại) — kiểm procedure có trả các cột này.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Tiêu chí cha của tiêu chí chung (DRL_TIEUCHIDANHGIA_CHA_ID của danh mục chung) được đặt vào ô "Tiêu chí cha" vốn liệt kê ID bản ghi ÁP DỤNG — hai loại id có khớp không?
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisrenluyen/modules/tieuchixeploai/tieuchixeploai

- **[Cần quyết]** Ô lọc/biểu mẫu "Tiêu chí" liệt kê MỌI tiêu chí (cả cha lẫn con, gốc cũng vậy). Có nên chỉ lấy tiêu chí gốc/tổng không?
  - → Làm như hiện tại: Liệt kê tất cả như gốc

### apisrenluyen/modules/tieuchixeploai/tieuchixeploaiapdung

- **[Cần quyết]** Chọn tiêu chuẩn chung: chỉ đè Khoá/Năm/Học kỳ khi dòng danh mục có giá trị (gốc đè cả khi rỗng, xoá mất phạm vi đang chọn).
  - → Làm như hiện tại: Chỉ đè khi có giá trị
- **[Kiểm trên host]** Tên cột của tiêu chuẩn chung đang áp dụng khi sửa chưa rõ — ô hiện "Tiêu chuẩn đang áp dụng" nếu mục đó không có trong danh sách chưa dùng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisrenluyen/modules/tonghopdiem/tonghopdiem

- **[Kiểm trên host]** Import dùng hộp import chung (thanh chờ chung) thay bản chép riêng có thanh % giả — kiểm import IMPORTWITHPROC_RLTK tệp lớn
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Ô từ khoá gốc không gửi lên máy chủ — nay lọc tại chỗ theo mã số / họ tên
  - → Làm như hiện tại: Lọc tại chỗ

### apisxulyhocvu/modules/dieukienxuly/dieukienapdung

- **[Cần quyết]** Gốc cho Kế thừa / Xóa toàn bộ theo "năm học HOẶC thời gian", nhưng màn không có ô năm học. Bản mới bắt chọn thời gian đào tạo. Có cần thêm ô năm học không?
  - → Làm như hiện tại: Bắt chọn khoá + thời gian
- **[Cần quyết]** Ô "Danh mục xử lý" gốc chỉ nạp 10 điều kiện đầu (pageSize 10). Bản mới nạp tới 10000.
  - → Làm như hiện tại: Nạp hết
- **[Kiểm trên host]** Sửa một dòng: hệ suy từ cột DAOTAO_HEDAOTAO_ID của danh sách khoá (LayDSKS_DaoTao_KhoaDaoTao) — kiểm cột này có trả về
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Kế thừa / Xóa toàn bộ (Xoa_XLHV_DieuKienXuLy_AD_Tat) chưa thử trên hệ thật — thử với khoá/kỳ không dùng
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisxulyhocvu/modules/dieukienxuly/khaibaodieukien

- **[Cần quyết]** Gốc không kiểm ô nào (kiểm ô không tồn tại). Có cần bắt buộc Loại / Mức xử lý / Xâu điều kiện không?
  - → Làm như hiện tại: Không bắt buộc, như gốc

### apisxulyhocvu/modules/kehoachxuly/kehoachxuly

- **[Cần quyết]** Lưu kế hoạch xong vẫn ở lại biểu mẫu (như gốc, để thêm cán bộ / sinh viên ngay). Có muốn đóng về danh sách như các màn khác?
  - → Làm như hiện tại: Ở lại, kế hoạch mới đổi sang "Chỉnh sửa".
- **[Cần quyết]** "Danh sách xét" mở ra chưa nạp (gốc bỏ lời gọi khi mở), phải bấm Tìm kiếm. Có nạp ngay khi mở?
  - → Làm như hiện tại: Chờ bấm Tìm kiếm.
- **[Cần quyết]** Hộp chọn sinh viên chưa có ô "Khoa quản lý" và nút "Thêm Khoa quản lý - khóa học" (gốc gửi ID khoá + ID khoa QL ghép liền).
  - → Làm như hiện tại: Chưa có, chờ tầng chung.
- **[Kiểm trên host]** Xét xử lý học vụ gửi strXLHV_KeHoachXuLy_Id / LOAIXULY_ID / DAOTAO_THOIGIANDAOTAO_ID đọc từ dòng sinh viên (như gốc): kiểm LayDanhSach của DanhSachKhongXuLy và DSXLHV_DanhSachKhongXuLy có trả đủ các cột này.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Thêm sinh viên đọc QLSV_NGUOIHOC_ID / DAOTAO_TOCHUCCHUONGTRINH_ID / QLSV_TRANGTHAINGUOIHOC_ID từ dòng của LayDSNguoiHoc: kiểm tên cột trên host.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Kiểm trên host]** Thêm cán bộ phân công dùng hộp người dùng (pkg_chung_quanlynguoidung.LayDanhSachNguoiDung, nạp chéo từ thilai): kiểm strNguoiDung_Id = ID người dùng.
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisxulyhocvu/modules/pheduyetketqua/pheduyetketqua

- **[Kiểm trên host]** Đổi mức cảnh cáo: gốc gọi nhầm RL_TieuChiDanhGia/CapNhat (controller Rèn luyện) nên chưa bao giờ lưu được; bản mới gọi XLHV_KetQuaXuLy/CapNhat — kiểm lưu thật trên host
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Cột "Ngày điều chỉnh" gốc đổ MUCXULY_THAYDOI_LYDO (lý do), còn "Kết quả điều chỉnh" hiện lại MUCXULY_TEN (trùng cột "tự động") — có cột ngày / mức mới thật không?
  - → Làm như hiện tại: Giữ đúng cột như gốc
- **[Cần quyết]** Hộp Xác nhận: gốc có bảng "Lịch sử xác nhận" nhưng không bao giờ nạp (lời gọi bị chú thích, gọi nhầm KHCT_XacNhanPhanGiang)
  - → Làm như hiện tại: Không vẽ bảng lịch sử

### apisxulyhocvu/modules/raquyetdinh/raquyetdinh

- **[Kiểm trên host]** Hộp "Thay đổi mức cảnh cáo" CHƯA TỪNG chạy ở gốc (ReferenceError aData, nút Lưu gắn id không tồn tại); bản mới bật theo ý định (XLHV_KetQuaXuLy/CapNhat) — đường GHI mới
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Them_QLSV_QuyetDinh / LayDSQLSV_QuyetDinh gửi strNguonDuLieu_Id rỗng (gốc đọc biến không bao giờ gán) — có nên gắn kế hoạch xử lý đang chọn?
  - → Làm như hiện tại: Gửi rỗng như gốc
- **[Kiểm trên host]** Thêm SV vào quyết định: kiểm cột QLSV_QUYETDINH_ID / QLSV_TRANGTHAINGUOIHOC_ID có trong XLHV_KetQuaXuLy/LayDanhSach
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).

### apisxulyhocvu/modules/thuchienxulyhocvu/thuchienxulyhocvu

- **[Kiểm trên host]** Năm nhập học gọi KHCT_NamNhapHoc/LayDanhSach — lần kiểm host trước lời gọi này trả 404 (màn henganh)
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).
- **[Cần quyết]** Kế hoạch xử lý chỉ nạp một lần lúc mở màn (Học kỳ lúc đó còn trống), đổi Học kỳ không nạp lại — như gốc. Có cần lọc kế hoạch theo học kỳ?
  - → Làm như hiện tại: Giữ như gốc

### apisxulyhocvu/modules/tracuuketqua/tracuuketqua

- **[Cần quyết]** Cột "Ngày điều chỉnh" của gốc hiện MUCXULY_THAYDOI_LYDO (lý do); dữ liệu không có cột ngày nào. Có cần cột ngày không (tên cột?)
  - → Làm như hiện tại: Đổi tiêu đề thành "Lý do điều chỉnh", hiện lý do
- **[Cần quyết]** "Kết quả điều chỉnh" và "Kết quả xử lý tự động" cùng hiện MUCXULY_TEN (như gốc) — có cột riêng cho mức sau điều chỉnh không?
  - → Làm như hiện tại: Giữ như gốc: hai cột cùng MUCXULY_TEN, ô điều chỉnh bấm được
- **[Kiểm trên host]** Lưu "Thay đổi mức cảnh cáo" chưa từng chạy ở gốc (sai nút, action RL_TieuChiDanhGia) — nay gọi XLHV_KetQuaXuLy/CapNhat
  - → Chấp nhận hành vi hiện tại (chưa kiểm trên host).


## Chốt ngày 2026-09-26 — Nhân sự (ApisNhanSu, lúc chuyển đổi)

262 mục — tự chốt theo phương án tạm lúc chuyển (sổ trên màn chỉ giữ việc dữ liệu).

### apisnhansu/modules/hoso/capnhatv2
- **[Cần quyết]** Ảnh hồ sơ: gốc `getImage('uploadPicture_HS', edu.system.userId)` chép ảnh sang tên theo id người ĐĂNG NHẬP (không phải người đang sửa).
  - → Làm như hiện tại: giữ như gốc (`anh.finalize(uid())`).
- **[Cần quyết]** Ô Đơn vị có `readonly` trên `<select>` ở gốc (trình duyệt bỏ qua, vẫn đổi được) — quản trị có cần sửa đơn vị ở màn này không.
  - → Làm như hiện tại: khoá thật như bản Cổng cán bộ, giá trị vẫn gửi.
- **[Kiểm trên host]** Bản quản trị gửi giá trị thật cho Mã số / Họ đệm / Tên / Ngày-Tháng-Năm sinh / Tình trạng / Loại đối tượng / Loại giảng viên (Cổng cán bộ gửi "#"); ba ô chọn đọc cột TINHTRANGNHANSU_ID / LOAIDOITUONG_ID / LOAIGIANGVIEN_ID.
  - → Làm như hiện tại: đúng như gốc NS; kiểm LayChiTiet có trả ba cột _ID này.

### apisnhansu/modules/hoso/qtthongtin
- **[Cần quyết]** Danh mục hoạt động (`LayDM_NhanSu_HoatDong`) gốc NS gọi lúc mở màn, khi CHƯA chọn cán bộ → `strNhanSu_HoSoCanBo_Id` rỗng.
  - → Làm như hiện tại: giữ rỗng như gốc (nạp một lần khi mở khung cán bộ).
- **[Cần quyết]** Trường tự nhập kiểu TINH / HUYEN / XA: gốc vẽ ô chọn nhưng không nạp nguồn nào (luôn trống).
  - → Làm như hiện tại: giữ như gốc (ô chọn trống; chỉ LIST nạp MABANGDANHMUC).
- **[Cần quyết]** Trường tự nhập kiểu FILE: tệp gắn vào id TRƯỜNG thông tin (`saveFiles("m"+ID, aData.ID)`), không theo cán bộ / bản ghi hoạt động — mọi cán bộ dùng chung một bộ tệp.
  - → Làm như hiện tại: giữ như gốc (ums.files load/save theo id trường).
- **[Kiểm trên host]** Trường tự nhập TEXT/NUMBER có DORONG: gốc đặt `value=` trên `<textarea>` nên giá trị cũ không bao giờ hiện — bản mới đổ đúng giá trị.
  - → Làm như hiện tại: hiện giá trị TRUONGTHONGTIN_GIATRI trong ô nhiều dòng.
- **[Kiểm trên host]** Nút "Tìm kiếm" của danh sách cán bộ gốc gọi `getList_TuNhapHoSo` (lỗi) — bản mới tìm cán bộ (Enter ở ô từ khoá).
  - → Làm như hiện tại: tìm cán bộ.

### apisnhansu/modules/quatrinhdaotao/quatrinhdaotao
- **[Kiểm trên host]** Khung Bồi dưỡng bản NS gửi thêm strLoaiQuyetDinh_Id / strNgayApDung / strNgayHieuLuc / strNgayHetHieuLuc + id quyết định ẩn, đọc cột NHANSU_TTQUYETDINH_NGAYQD/AD/HL/HHL (khác bản Cổng cán bộ). Phép kiểm "ngày ký QĐ ≤ hôm nay" gốc đọc ô không tồn tại (txtBB_NgayKy) — bản mới kiểm trên ô Ngày quyết định (như bản CCB đã sửa).
  - → Làm như hiện tại: dùng cờ quanTri của khung CCB.
- **[Cần quyết]** Khung "Danh sách dự kiến sắp hết hạn đào tạo" (`NS_QT_BoiDuong/LocDSNhanSu_QT_DATO_DenHan`) gốc nạp nhưng không bao giờ hiện (toggle ẩn mọi zone-bus, không có nút mở).
  - → Làm như hiện tại: không chuyển.

### apisnhansu/modules/quatrinh/chucvu
- **[Cần quyết]** Khung "Danh sách dự kiến sắp hết nhiệm kỳ" (`NS_QT_ChucVu/LocDSNhanSu_QT_ChucVu_DenHan`, dSoNgayQuyDinh 90) gốc nạp nhưng không bao giờ hiện (nút `#btnViewChucVu_DuBao` không có trên màn).
  - → Làm như hiện tại: không chuyển.
- **[Cần quyết]** Import: gốc có dropdown tĩnh "1. Import chức vụ" (IMPORTWITHPROC_CHUCVU); `getList_MauImport` có thể thay nội dung dropdown bằng mẫu import phân quyền.
  - → Làm như hiện tại: nút "Import chức vụ" cố định (importChung) + "Xuất báo cáo" theo mẫu (`report.mount`, import: false).

### apisnhansu/modules/hoso/khoitao
- **[Cần quyết]** `strLaCanBoNgoaiTruong` đọc ô `dropNS_LaCanBo` KHÔNG có trên màn → gửi rỗng (cả ThemMoi lẫn CapNhat). Màn "khởi tạo" cán bộ trong trường có lẽ phải là 0.
  - → Làm như hiện tại: gửi rỗng như gốc.
- **[Cần quyết]** Ảnh: gốc gửi thẳng đường dẫn tạm vừa tải (`getValById('txtNS_Anh')`, không getImage/copyfile).
  - → Làm như hiện tại: gửi đường dẫn ảnh như gốc.
- **[Kiểm trên host]** Biểu mẫu không mở sẵn lúc vào màn (gốc hiện sẵn khung "Khởi tạo"); "Viết lại" / "Tạo mới" thay bằng Đóng → Thêm mới.
  - → Làm như hiện tại: theo BO-CUC luật 1.

### apisnhansu/modules/hoso/nhansungoaitruong
- **[Cần quyết]** "Đơn vị công tác" hiện cột HKTT_DIACHI nhưng lưu `strDonViCongTac`; "Địa chỉ" hiện DIACHI, lưu vào cả `strNoiSinh_DiaChi` và `strDiaChi`; "Học hàm" đọc CHUCDANH_ID.
  - → Làm như hiện tại: giữ như gốc.

### apisnhansu/modules/hoso/cauhinhhoso
- **[Kiểm trên host]** Xoá một trường thông tin đã lưu: gốc gọi `NCKH_ThongTin/Xoa` (chép nhầm từ màn NCKH) — bản mới gọi `NS_HoSoMoRong/Xoa`.
  - → Làm như hiện tại: `NS_HoSoMoRong/Xoa` strIds — kiểm controller có action Xoa.
- **[Kiểm trên host]** Tìm kiếm: gốc gửi strTuKhoa rỗng (đọc txtAAAA) — bản mới gửi ô từ khoá.
  - → Làm như hiện tại: gửi từ khoá (cả cauhinhhopdong).
- **[Kiểm trên host]** Lưu "Cấu hình thông tin" lần hai ở gốc thêm TRÙNG (không nạp lại) — bản mới nạp lại sau khi lưu.
  - → Làm như hiện tại: lưu xong nạp lại bảng (cả cauhinhhopdong).

### apisnhansu/modules/hoso/cauhinhhopdong
- **[Cần quyết]** Biểu mẫu không có ô Mã / Tên (gốc gửi txtMa/txtTen không có → rỗng); bảng hiện HOATDONGNHANSU_MA/TEN do máy chủ trả.
  - → Làm như hiện tại: gửi strMa / strTen rỗng như gốc.

### apisnhansu/modules/quatrinhcongtac/_canbo (khung chung ums.nsQT)
- **[Cần quyết]** Bộ môn ở cột trái: bản gốc nạp sẵn mọi bộ môn khi chưa chọn Khoa (lọc tuỳ chọn). Có khoá theo luật cha → con không?
  - → Làm như hiện tại: Bộ môn KHOÁ tới khi chọn Khoa, chỉ liệt kê bộ môn của Khoa đó (`pat.chain`); bỏ Khoa thì xoá Bộ môn.
- **[Cần quyết]** Khối "điều kiện tìm kiếm" gốc giấu sau nút "Kéo xuống"; danh sách cán bộ gốc là bảng có nút xem, vài màn có popover khi rê chuột.
  - → Làm như hiện tại: ô lọc luôn hiện; danh sách là các mục bấm được (ảnh · họ tên · mã · ngày sinh), không popover.

### apisnhansu/modules/quatrinhcongtac/quatrinhcongtac
- **[Cần quyết]** Điều chuyển: Thêm mới gửi strNgayHieuLuc = strNgayChuyen = ô "Ngày áp dụng", còn Sửa gửi ô "Ngày hiệu lực" / "Ngày chuyển" (hai hàm gốc lệch nhau).
  - → Làm như hiện tại: chép nguyên, Thêm và Sửa khác nhau như gốc.
- **[Cần quyết]** Nhãn Loại QĐ / Số QĐ / Ngày áp dụng có (*) nhưng bản gốc đã tắt kiểm tra (`if (true)`).
  - → Làm như hiện tại: không bắt buộc.
- **[Cần quyết]** Chọn cả đơn vị "Trong trường" lẫn "Ngoài trường" thì gốc chỉ gửi Trong trường.
  - → Làm như hiện tại: giữ như gốc.
- **[Kiểm trên host]** Nút gạt "Điều chuyển gần nhất" gọi ThietLapQuaTrinhCuoiCung "NHANSU_QT_TCCB". Gốc chỉ gửi mã bảng, không gửi id dòng.
  - → Làm như hiện tại: gửi như gốc (sau khi hỏi lại) rồi nạp lại bảng.
- **[Kiểm trên host]** Import "1. Import thuyên chuyển cán bộ" (IMPORTWITHPROC_TCCB) và danh sách mẫu báo cáo của chức năng.
  - → Làm như hiện tại: `ums.report.importChung('TCCB', …)`; `ums.report.mount` với `import: false`, vì nút Import tĩnh đã có sẵn.
- **[Cần quyết]** Ba bộ kiểm tra ngày của tab 1 đọc ô txtTSBT_TuNgay / _DenNgay không có trên màn nên gốc không bao giờ chặn.
  - → Làm như hiện tại: bỏ, không chặn.

### apisnhansu/modules/quatrinhcongtac/cachinhthuchopdong
- **[Cần quyết]** Bản gốc chưa từng chạy: hàm getList/getDetail/delete_HopDongLaoDong không tồn tại, còn nút Lưu gọi save_ThuyenChuyen (điều chuyển).
  - → Làm như hiện tại: CHỈ XEM danh sách `NS_ThongTinHopDong/LayDanhSach` của cán bộ đang chọn (như Cổng cán bộ); không chuyển biểu mẫu; nút Thêm mới giữ nhưng khoá.
- **[Kiểm trên host]** Cột "Đơn vị tuyển dụng" chưa rõ tên cột máy chủ.
  - → Làm như hiện tại: đọc `DIEU1_DONVITUYENDUNG_TEN` (đoán); sai tên thì cột trống.

### apisnhansu/modules/quatrinhcongtac/huongnghiencuuchinh
- **[Cần quyết]** Tệp .js gốc 0 byte, không có API cho hướng nghiên cứu (bản Cổng cán bộ gọi nhầm NS_QT_KhamSucKhoe).
  - → Làm như hiện tại: danh sách cán bộ chạy; cột phải là khung "Tóm tắt hướng nghiên cứu chính" với Thêm mới / Tải lại khoá, kèm lời nhắc.

### apisnhansu/modules/quatrinhcongtac/thongtinhuu
- **[Cần quyết]** Bản gốc là trang trống (html rỗng, .js 0 byte). Có gỡ khỏi menu không?
  - → Làm như hiện tại: khung "chưa có nội dung".

### apisnhansu/modules/quatrinhcongtac/dinuocngoai
- **[Cần quyết]** Bản Nhân sự sửa bằng LayChiTiet; bản Cổng cán bộ lấy dòng từ danh sách.
  - → Làm như hiện tại: bản Nhân sự gọi `NS_QT_CongTacNuocNgoai/LayChiTiet` (cờ P.ns); Cổng cán bộ giữ như cũ.

### apisnhansu/modules/quatrinhcongtac/nhiemvuchienluoc
- **[Kiểm trên host]** Xoá: `NS_QT_NhiemVuChienLuoc/Xoa` (strIds). Bản gốc NS gọi y hệt Cổng cán bộ, mà kiểm host 25/9 cho thấy máy chủ trả Success nhưng không xoá.
  - → Làm như hiện tại: gọi như gốc (xem mục Việc dữ liệu).

### apisnhansu/modules/nghithaisan/nghithaisan
- **[Cần quyết]** "Danh sách dự kiến sắp hết nghỉ thai sản" chưa từng hiện ở bản gốc: page_load chuyển sang vùng "zone_notify_…" không tồn tại, và nút mở lại cũng không có.
  - → Làm như hiện tại: hiện ở cột phải khi chưa chọn cán bộ (LocDSNhanSu_QT_THSA_DenHan, dSoNgayQuyDinh 10); bỏ nút "Đóng" của khung này.
- **[Cần quyết]** Nút "Xuất excel" (#btnPrint_DuKien) không có xử lý ở bản gốc.
  - → Làm như hiện tại: giữ nút, khoá.
- **[Cần quyết]** Bản NS bắt buộc Ngày hiệu lực + Ngày hết hiệu lực và chặn khi hiệu lực > hết hiệu lực; bản Cổng cán bộ không bắt.
  - → Làm như hiện tại: chỉ bản Nhân sự bắt và chặn (cờ P.ns).

### apisnhansu/modules/quanhegiadinh/quanhegiadinh
- **[Cần quyết]** Bản NS gửi "Địa chỉ thường trú" của khung "Về bản thân" vào strQueQuan (Cổng cán bộ gửi strNoiO), và strNoiO đọc ô không có trên màn.
  - → Làm như hiện tại: Nhân sự gửi strQueQuan / đọc QUEQUAN, strNoiO rỗng; Cổng cán bộ giữ strNoiO / NOIO. Hai màn đọc/ghi hai cột khác nhau cho cùng một bảng, cần nghiệp vụ chọn một.
- **[Kiểm trên host]** Thêm "Về bản thân" gọi ThietLapQuaTrinhCuoiCung "NHANSU_QT_GD_QHGD" (chỉ bản NS có).
  - → Làm như hiện tại: bản Nhân sự gọi, Cổng cán bộ không.
- **[Cần quyết]** Danh mục quan hệ: bản NS không sắp theo HESO1; bảng thân nhân nước ngoài có thêm cột "Năm định cư".
  - → Làm như hiện tại: như gốc từng bản (cờ P.ns).

### apisnhansu/modules/khenthuongkyluat/khenthuongkyluat
- **[Cần quyết]** Sửa khen thưởng chưa từng lưu được: save_KhenThuong có `return;` trước lời gọi CapNhat.
  - → Làm như hiện tại: Sửa gọi `NS_QT_KhenThuong/CapNhat` cho đúng dòng.
- **[Cần quyết]** Thêm mới gửi MỘT ThemMoi cho MỖI người trong "Danh sách kèm theo"; danh sách trống thì gốc im lặng không làm gì.
  - → Làm như hiện tại: danh sách mở sẵn với chính cán bộ đang chọn (gỡ được); "Thêm thành viên" dùng `pat.pickNhanSu`; danh sách trống thì báo lỗi. Khối chỉ hiện khi Thêm mới.
- **[Kiểm trên host]** Thêm theo danh sách: gọi ThietLapQuaTrinhCuoiCung "NHANSU_QT_KHTT" một lần (nhánh gốc đang chạy không gọi); tệp đính kèm chỉ gắn vào bản ghi của thành viên đầu tiên.
  - → Làm như hiện tại: như mô tả.
- **[Cần quyết]** strNhanSu_ThongTinQD_Id gốc không đặt lại khi Thêm mới (còn mang id của lần sửa trước); "Hình thức khen thưởng khác" gốc gửi rỗng.
  - → Làm như hiện tại: Thêm gửi rỗng, Sửa gửi id của dòng; gửi giá trị ô "khác" (như Cổng cán bộ).
- **[Cần quyết]** Ngày quyết định khen thưởng: bản NS không bắt buộc (arrValid trỏ ô không có); bản Cổng cán bộ bắt.
  - → Làm như hiện tại: Nhân sự không bắt (cờ P.ns).

### apisnhansu/modules/danhhieuhocham/danhhieuhocham
- **[Cần quyết]** Danh hiệu, khi mở Sửa, gốc đổ Ngày áp dụng / hiệu lực / hết hiệu lực / Mô tả đều từ NGAYQD, và id quyết định ẩn từ NOIPHONG.
  - → Làm như hiện tại: đổ từ NHANSU_TTQUYETDINH_NGAYAD / _NGAYHL / _NGAYHHL, MOTA, NHANSU_THONGTINQUYETDINH_ID, LOAIQUYETDINH_ID.
- **[Kiểm trên host]** Lưới "Thông tin quyết định" của học hàm: ô Ngày áp dụng đọc cột NGAYAPDUNG (gốc đổ nhầm từ NGAYQUYETDINH).
  - → Làm như hiện tại: đọc NGAYAPDUNG và gửi strNgayApDung.
- **[Cần quyết]** Bản NS không gửi versionAPI 'v1.0' (Cổng cán bộ gửi); chặn "Ngày phong không được lớn hơn ngày hiện tại" (bản mới Cổng cán bộ chưa có dù gốc có).
  - → Làm như hiện tại: theo từng bản gốc, sau cờ P.ns; Cổng cán bộ giữ nguyên.
- **[Cần quyết]** Nhãn "Loại quyết định (*)" của danh hiệu có dấu * nhưng arrValid gốc không bắt.
  - → Làm như hiện tại: không bắt buộc.

### apisnhansu/modules/luong/bangtinhluongvaphucap
- **[Cần quyết]** Đơn vị → Thành viên mang nhãn "Tất cả …" (lọc tuỳ chọn) nên KHÔNG khoá ô Thành viên khi chưa chọn đơn vị.
  - → Làm như hiện tại: ô Thành viên mở sẵn (nạp toàn bộ như gốc); chọn/xoá Đơn vị thì nạp lại và xoá trắng Thành viên.
- **[Kiểm trên host]** "Tính lương" (L_BangLuong/ThucHienTinhLuong) không hỏi lại trước khi chạy — như gốc.
  - → Làm như hiện tại: bấm là chạy ngay, báo "Thực hiện tính lương thành công".
- **[Kiểm trên host]** Ô bảng lương tra theo NHANSU_HOSOCANBO_ID × THANHPHAN_ID (như lbl… của gốc), cột lá theo thứ tự cây máy chủ trả.
  - → Làm như hiện tại: tiêu đề nhiều tầng qua `group` của ums.ui.table, ô định dạng tiền, dòng tổng mọi cột thành phần.
- **[Cần quyết]** Nút báo cáo: gốc chỉ có vùng "Xuất báo cáo" → tắt nút Import.
  - → Làm như hiện tại: `ums.report.mount({ import: false })`.

### apisnhansu/modules/luong/bangtinhluongnam
- **[Kiểm trên host]** Bản năm hiện số THÔ (không định dạng tiền), không dòng tổng, không ô Tháng; Tính lương gửi strThang "" — như gốc.
  - → Làm như hiện tại: giữ nguyên các điểm lệch với bản tháng.
- **[Cần quyết]** Đơn vị → Thành viên "Tất cả …" không khoá (như bản tháng).
  - → Làm như hiện tại: như bangtinhluongvaphucap.

### apisnhansu/modules/luong/cautrucbangluong
- **[Cần quyết]** Ô "Thành phần" / "Thứ tự hiển thị" mang (*) ở gốc nhưng gốc không kiểm.
  - → Làm như hiện tại: bắt buộc thật (không cho lưu khi trống).
- **[Kiểm trên host]** Danh mục thành phần: sửa cũng gọi CMS_DanhMucDuLieu/ThemMoi kèm strId (như gốc); strCHUNG_TENDANHMUC_Id lấy từ dòng đầu danh mục.
  - → Làm như hiện tại: chép nguyên; danh mục rỗng thì strCHUNG_TENDANHMUC_Id rỗng (như gốc).
- **[Cần quyết]** Loại bảng lương: gốc `selectOne` → chỉ tự chọn khi danh mục có đúng một mục.
  - → Làm như hiện tại: nhiều mục thì để trống, danh sách thành phần gửi strLoaiBangLuong_Id rỗng.

### apisnhansu/modules/luong/cautrucbangluongnam
- **[Cần quyết]** Gốc lỗi bố cục: khối cấu trúc đặt ngay vùng đầu thay bảng "Chọn bảng quy định lương" + bản trùng id ở vùng chi tiết; một quy định thì gốc chuyển vùng và màn trống.
  - → Làm như hiện tại: hiện thẳng khối cấu trúc (không bước chọn); quy định = ID khi máy chủ trả ĐÚNG một dòng, không thì rỗng.
- **[Kiểm trên host]** Xoá danh mục thành phần gọi L_LuongNam_TuKhoa_ThamSo/Xoa trong khi thêm gọi CMS_DanhMucDuLieu/ThemMoi (nghi lệch cặp).
  - → Làm như hiện tại: giữ nguyên hai action như gốc.

### apisnhansu/modules/luong/dieukienxetnangluong
- **[Cần quyết]** Gốc đọc/ghi công thức ở ô `txtNL_CongThuc` không tồn tại (html là `txtBL_CongThuc`) → gốc luôn gửi strXauCongThucTinh rỗng.
  - → Làm như hiện tại: gửi đúng công thức người dùng nhập; sửa hiện lại công thức (đường GHI đổi so với hệ đang chạy).
- **[Cần quyết]** Gốc `me = DieuKienXetNangLuong` (hàm tạo) → chỉ một kế hoạch là lỗi JS.
  - → Làm như hiện tại: một kế hoạch thì tự chọn như hai màn anh em.
- **[Kiểm trên host]** Cột "Ghi chú" gốc đọc GHICHUGHICHU (gõ nhầm).
  - → Làm như hiện tại: đọc GHICHU, dự phòng GHICHUGHICHU.

### apisnhansu/modules/luong/danhsachgiamtrugiacanh
- **[Cần quyết]** Tỉnh / Huyện / Xã: gốc NS đổ TOÀN BỘ danh mục CHUN.DMTT vào cả ba ô, không lọc cha–con.
  - → Làm như hiện tại: giữ như gốc (ba ô cùng danh sách, không khoá nối tầng — không phải cặp cha → con thật).
- **[Cần quyết]** Khoa / Bộ môn ở cột trái không nối tầng (gốc đổ mọi đơn vị con vào Bộ môn; gửi Khoa nếu có, không thì Bộ môn); ô "Tình trạng làm việc" gốc không nạp, không gửi.
  - → Làm như hiện tại: giữ độc lập hai ô; bỏ ô tình trạng.
- **[Kiểm trên host]** "Kế thừa sang năm khác" (L_GiamTruGiaCanh/KeThua strNamNguon/strNamDich) — gốc để dưới danh sách cán bộ.
  - → Làm như hiện tại: nút ở đầu trang, hộp hỏi hai năm (bắt nhập đủ như gốc).
- **[Cần quyết]** Danh sách giảm trừ gốc chỉ trang đầu, không phân trang.
  - → Làm như hiện tại: phân trang đầy đủ cùng tham số.

### apisnhansu/modules/luong/khoanduocnhankhac
- **[Kiểm trên host]** Cột "Nội dung" gốc đọc CHUNGTU (trùng cột Chứng từ); dNam/dThang gửi rỗng (ô txtNam/txtThang không có trên màn gốc).
  - → Làm như hiện tại: giữ nguyên.
- **[Cần quyết]** Ô từ khoá / Khoa / ngày phát sinh của cột trái đồng thời lọc danh sách khoản bên phải (như gốc).
  - → Làm như hiện tại: nút Tìm kiếm nạp lại cả danh sách cán bộ lẫn danh sách khoản; Enter ở ô ngày nạp lại danh sách khoản.

### apisnhansu/modules/luong/cosoapdung
- **[Cần quyết]** Đơn vị → Thành viên: gốc nạp sẵn toàn bộ thành viên (nhãn "Chọn thành viên").
  - → Làm như hiện tại: khoá Thành viên khi chưa chọn đơn vị, chọn/xoá đơn vị thì xoá trắng (luật chung).
- **[Cần quyết]** Thêm mới khi chưa chọn nhân sự: gốc im lặng.
  - → Làm như hiện tại: báo "Chưa chọn nhân sự nào".
- **[Kiểm trên host]** Thêm mới gửi strDaoTao_CoCauToChuc_Id rỗng (gốc đọc dropAAAA); Sửa gửi đơn vị của dòng — như gốc.
  - → Làm như hiện tại: chép nguyên.
- **[Kiểm trên host]** Báo cáo: gốc đọc các ô không có trên màn (từ khoá riêng, ngày, năm…) và ô đánh dấu `checkHS` không tồn tại.
  - → Làm như hiện tại: gửi đủ khoá, giá trị rỗng; không gửi strNhanSu_HoSoCanBo_Id.

### apisnhansu/modules/luong/khoankhongtinh
- **[Cần quyết]** Màn gốc là bản sao y hệt "Cơ sở áp dụng" (cùng tệp .js, cùng procedure L_NhanSu_LuongCoSo_ApDung) — có thể là màn chưa làm xong.
  - → Làm như hiện tại: dùng chung `cosoapdung.js`, chỉ đổi tiêu đề "Khoản không tính".

### apisnhansu/modules/luong/biendong
- **[Kiểm trên host]** Giá trị mỗi ô = một lời gọi LayGiaTriNhanSu_L_TuKhoa (versionAPI v1.0) — N cán bộ × M từ khoá lời gọi.
  - → Làm như hiện tại: tối đa 6 lời gọi cùng lúc; ô khoá tới khi nạp xong.
- **[Cần quyết]** "Thêm mới" gốc là hộp thoại, lưu xong ở lại hộp, không nạp lại lưới.
  - → Làm như hiện tại: biểu mẫu thay chỗ danh sách; lưu xong đóng và nạp lại lưới (nếu đã tìm).
- **[Kiểm trên host]** Báo cáo gốc gửi khoá của màn Tài chính (strKhoaQuanLy_Id, strHeDaoTao_Id…) đọc ô không có trên màn.
  - → Làm như hiện tại: giữ khoá, giá trị rỗng.
- **[Cần quyết]** Đơn vị → Thành viên (lọc) và Đơn vị → Cán bộ (Thêm mới).
  - → Làm như hiện tại: khoá con khi chưa chọn cha, chọn/xoá cha xoá trắng con.

### apisnhansu/modules/luong/dstinhluongtheothang
- **[Cần quyết]** Gốc làm dở: hai danh sách đổ nhầm vào ô chọn thành viên (hai khung luôn trống); gán/bỏ gán không có (hàm lưu/xoá gọi KHCT_HocPhan_KhoiTuChon_Don chép từ màn khác, không nơi nào gọi; hàm thả không tồn tại).
  - → Làm như hiện tại: vẽ hai danh sách vào đúng hai khung (dòng "HOTEN - MASO"), ô từ khoá lọc tại chỗ; CHỈ XEM, không gán.
- **[Kiểm trên host]** Tên cột trả về của L_BangLuong_NhanSu/LayDanhSach và LayDSNNhanSu_Luong_ConLai chưa xác nhận (đoán theo Render gốc: HOTEN, MASO).
  - → Làm như hiện tại: hiện "HOTEN - MASO".

### apisnhansu/modules/luong/hangchucdanh
- **[Cần quyết]** Ô từ khoá cột trái gốc gọi danh sách với strTuKhoa rỗng và bỏ nhóm đang chọn.
  - → Làm như hiện tại: lọc CÂY nhóm ngạch tại chỗ.
- **[Kiểm trên host]** "Chi tiết" hiện ngạch bậc của NHÓM đang chọn ở cây (không theo dòng bấm), cột Hệ số luôn trống — như gốc.
  - → Làm như hiện tại: giữ nguyên.
- **[Cần quyết]** Nút "Viết lại" trong biểu mẫu gốc không có xử lý; "Tải lại" gốc không có xử lý.
  - → Làm như hiện tại: bỏ "Viết lại"; "Tải lại" = nút tải lại chung của khung.

### apisnhansu/modules/luong/hesoluong
- **[Cần quyết]** Nút "Tìm kiếm" gốc gọi hàm không tồn tại (lỗi JS).
  - → Làm như hiện tại: tìm như Enter (nạp lại quy định theo từ khoá).
- **[Cần quyết]** "Thêm mới" (khởi tạo ngạch bậc) gốc là hộp thoại, lưu xong ở lại hộp.
  - → Làm như hiện tại: biểu mẫu thay chỗ lưới; lưu xong về lưới và nạp lại. Message khác rỗng vẫn coi là cảnh báo (như gốc).
- **[Kiểm trên host]** Ô chỉ có ô nhập khi đã có bản ghi hệ số; lưu gửi CapNhat khi ID dài 32 ký tự, không thì ThemMoi — như gốc.
  - → Làm như hiện tại: giữ nguyên.

### apisnhansu/modules/luong/kehoachxetnangluong
- **[Cần quyết]** Nút xoá trên từng mục cột trái gốc → khung hai cột chung không đặt nút trong mục.
  - → Làm như hiện tại: xoá bằng nút "Xoá" trong biểu mẫu.
- **[Cần quyết]** Thêm mới xong gốc hỏi "tiếp tục thêm không?" và ở lại biểu mẫu.
  - → Làm như hiện tại: đóng biểu mẫu; nhập tiếp dùng "Lưu và Nhập tiếp".

### apisnhansu/modules/luong/mucluongcoban
- **[Cần quyết]** Gốc sau khi nạp danh sách gán id đang sửa = MẢNG dữ liệu (Lưu lần hai trên biểu mẫu thêm gọi CapNhat với id rác). Có giữ hành vi đó không?
  - → Làm như hiện tại: sửa theo ý định — ums.crud giữ đúng dòng đang sửa; thêm mới luôn ThemMoi.
- **[Cần quyết]** Nút Xoá gốc nằm trên từng mục ở cột trái; bản mới đặt nút Xoá trong biểu mẫu sửa (mục trái là nút bấm, không lồng nút).
  - → Làm như hiện tại: Xoá trong biểu mẫu sửa (áp cho cả 6 màn quy định hai cột).

### apisnhansu/modules/luong/quydinhgiamtru
- **[Kiểm trên host]** Cột "Với người phụ thuộc" đọc `VOIMOINGUOIPHUTHUOC` (có chữ MOI) như gốc — xác nhận tên cột máy chủ trả.
  - → Làm như hiện tại: đọc đúng tên gốc.

### apisnhansu/modules/luong/quydinhtinhthuethunhapcanhan
- **[Kiểm trên host]** Mở sửa bằng L_QuyDinh_ThueThuNhapCaNhan/LayChiTiet (GET) — xác nhận trả MUCCANDUOI / MUCCANTREN / PHANTRAMTHUE / NGAYAPDUNG.
  - → Làm như hiện tại: đổ theo bốn cột đó; bỏ MOTA (ô txtMoTa không có trên màn).

### apisnhansu/modules/luong/quydinhnangluong
- **[Cần quyết]** Nhãn "Nhóm (*)" có dấu bắt buộc nhưng arrValid gốc không kiểm ô Nhóm.
  - → Làm như hiện tại: không bắt buộc Nhóm; bắt buộc Thời hạn, Bảng quy định lương, Loại.

### apisnhansu/modules/luong/quydinhphucap
- **[Cần quyết]** Danh sách gốc gửi strLoaiPhuCap_Id = ô "Loại phụ cấp" của BIỂU MẪU → lưu xong danh sách chỉ còn quy định cùng loại.
  - → Làm như hiện tại: danh sách gửi strLoaiPhuCap_Id '' (đầy đủ).

### apisnhansu/modules/luong/quydinhdongbaohiem
- **[Cần quyết]** Hai nhóm ô đánh dấu (Loại khoản / Loại phụ cấp tính bảo hiểm) gốc nạp CÙNG danh mục NHANSU.LOAIKHOAN, song song còn gọi DKH.TTSV (trạng thái sinh viên) chạy đua. Nhóm "phụ cấp" có nên là LUONG.LOAIPHUCAP?
  - → Làm như hiện tại: cả hai nhóm dùng NHANSU.LOAIKHOAN; bỏ DKH.TTSV.
- **[Cần quyết]** Ô tìm kiếm gốc không có tác dụng (danh sách luôn gửi strTuKhoa '').
  - → Làm như hiện tại: gửi từ khoá đã gõ.

### apisnhansu/modules/luong/nhomngachbac
- **[Cần quyết]** Ô "Hệ số" và "Thời gian áp dụng" có trên biểu mẫu nhưng gốc không gửi (và luôn đổ trống khi sửa); cột "Hệ số" của bảng luôn trống.
  - → Làm như hiện tại: giữ ô, không gửi.
- **[Cần quyết]** Nút "Viết lại" gốc không có xử lý.
  - → Làm như hiện tại: giữ nút, khoá (disabled).
- **[Kiểm trên host]** Danh sách bậc gửi pageSize 10 cứng như gốc — nhóm ngạch có hơn 10 bậc sẽ thiếu.
  - → Làm như hiện tại: giữ pageSize 10; ô từ khoá trên cây lọc tại chỗ (gốc không có xử lý).

### apisnhansu/modules/luong/phucap
- **[Cần quyết]** Biểu mẫu Thêm/Sửa phụ cấp gốc là hộp thoại.
  - → Làm như hiện tại: biểu mẫu thay chỗ khung loại phụ cấp (BO-CUC luật 1).
- **[Kiểm trên host]** Mỗi khung loại phụ cấp gọi L_QT_ThongTinPhuCap/LayDanhSach một lần (gốc: một lần rồi chia theo LOAIPHUCAP_ID).
  - → Làm như hiện tại: N lời gọi cùng tham số, lọc LOAIPHUCAP_ID tại chỗ.

### apisnhansu/modules/luong/quatrinhluong
- **[Cần quyết]** Gốc khai khoá `strLoaiChucDanhNgheNghiep_Id` hai lần (lần sau rỗng thắng) → chức danh nghề nghiệp chưa từng được lưu.
  - → Làm như hiện tại: gửi giá trị ô Chức danh nghề nghiệp.
- **[Cần quyết]** Thêm mới gốc lưu quyết định với strNguonDuLieu_Id rỗng (quyết định mồ côi).
  - → Làm như hiện tại: gắn vào id máy chủ trả (data.Id).
- **[Kiểm trên host]** "Mốc nâng bậc lương lần sau" (BACLUONG_TIEPTHEO) và "Ngày xét tăng lương dự kiến" (NGAYHUONGLUONG_TIEPTHEO) chỉ đổ khi sửa, gốc không gửi.
  - → Làm như hiện tại: giữ ô, không gửi.

### apisnhansu/modules/luong/truylinh
- **[Cần quyết]** Sửa gốc gửi strId = me.strIds (biến không tồn tại) → CapNhat không nhắm dòng nào.
  - → Làm như hiện tại: gửi ID dòng đang sửa.
- **[Cần quyết]** Thành viên gốc nạp sẵn toàn bộ nhân sự (chọn được khi chưa chọn Đơn vị).
  - → Làm như hiện tại: khoá Thành viên tới khi chọn Đơn vị (luật cha → con; áp cả luongduocnhankhac, thamnien, luongvathunhapkhac).

### apisnhansu/modules/luong/luongduocnhankhac
- **[Kiểm trên host]** Xuất báo cáo gửi mỗi dòng đang đánh dấu thành strNhanSu_HoSoCanBo_Id = ID DÒNG (L_DuocNhan), không phải ID hồ sơ — như gốc.
  - → Làm như hiện tại: gửi ID dòng.
- **[Kiểm trên host]** Import viết cứng hai mục (IMPORTWITHPROC_LUONGDUOCNHAN, IMPORTWITHPROC_SSCT); có mẫu import phân quyền thì mẫu đó thay chỗ (như cbGenCombo_MauImport).
  - → Làm như hiện tại: như trên, gọi ums.report.importChung.
- **[Cần quyết]** Dòng tóm tắt gốc cộng hai tổng bằng `+=` trên giá trị máy chủ (chuỗi thì nối chuỗi).
  - → Làm như hiện tại: cộng theo số.

### apisnhansu/modules/luong/thamnien
- **[Cần quyết]** Ô đánh dấu dòng là "checkX…" nhưng Xoá / báo cáo đọc "checkHS…" → gốc chưa từng xoá được.
  - → Làm như hiện tại: xoá đúng dòng đã chọn; báo cáo gửi ID dòng như luongduocnhankhac.
- **[Kiểm trên host]** Gốc gửi khoá `type` ('GET'/'POST') trong dữ liệu và tham số danh sách `strNhansu_HoSoCanBo_Id` (chữ s thường).
  - → Làm như hiện tại: chép nguyên.

### apisnhansu/modules/luong/luongvathunhapkhac
- **[Cần quyết]** Ô "Nhập từ khóa tìm kiếm" có trên màn nhưng L_KetQuaLuong/LayDanhSach không nhận từ khoá.
  - → Làm như hiện tại: giữ ô (Enter tải lại), không gửi.

### apisnhansu/modules/luong/thuchienxetnangluong
- **[Cần quyết]** Gốc "Xem" gọi hàm không tồn tại (getList_DuLieuBangLuong) → bảng chỉ có tiêu đề; nút "Xét nâng lương" không gắn xử lý nào.
  - → Làm như hiện tại: Xem = cấu trúc (L_XetLuong_CauTruc/LayDanhSach) + dữ liệu (LayDSDuLieuXetLuong GET, hàm gốc getList_XetNangLuong); Xét nâng lương = hàm gốc XetNangLuong (POST cùng action) rồi nạp lại.
- **[Kiểm trên host]** "Xét nâng lương" là đường GHI mới chưa từng chạy ở gốc; báo cáo gửi strLoaiBangLuong_Id / strNhanSu_QuyDinhLuong_Id / dNam / dThang rỗng (các ô gốc đã bị chú thích).
  - → Làm như hiện tại: như trên; ẩn nút Import (gốc không có vùng _Import).

### apisnhansu/modules/heso/khoanchucvu
- **[Cần quyết]** Ô "Đơn vị tính" gốc không nạp danh mục nào nên luôn trống, và gốc gửi `strDonViTinh_Id` rỗng mỗi lần lưu (sửa là xoá mất giá trị cũ). Ô này dùng danh mục nào?
  - → Làm như hiện tại: giữ ô nhưng khoá, ghi chú "Bản gốc chưa nạp danh mục". Thêm mới gửi rỗng. Sửa thì gửi lại `DONVITINH_ID` của dòng để không mất dữ liệu.
- **[Kiểm trên host]** Gốc gửi `strTuKhoa` từ ô `txtAAAA` (không tồn tại), nên ô từ khoá chưa từng có tác dụng. Bản mới gửi giá trị ô từ khoá, cần xem procedure có lọc đúng không.
  - → Làm như hiện tại: gửi `strTuKhoa` = ô "Nhập từ khóa tìm kiếm".

### apisnhansu/modules/heso/quydoigio
- **[Cần quyết]** Ô "Đơn vị tính" gốc không nạp danh mục, giống khoanchucvu.
  - → Làm như hiện tại: giữ ô, khoá lại. Sửa thì gửi lại `DONVITINH_ID` của dòng, thêm mới gửi rỗng.
- **[Kiểm trên host]** Ô lọc "Phân loại địa điểm" ở gốc luôn trống (KHCT.DDPG đổ nhầm vào ô `dropSearch_PhanLoai` không tồn tại). Bản mới nạp KHCT.DDPG vào ô lọc và gửi `strPhanLoaiDiaDiem_Id`.
  - → Làm như hiện tại: ô lọc có danh mục KHCT.DDPG. Thêm mới điền sẵn ô Phân loại của biểu mẫu từ ô lọc này.

### apisnhansu/modules/heso/tangthem
- **[Cần quyết]** Ô "Đơn vị tính" gốc không nạp danh mục.
  - → Làm như hiện tại: giữ ô, khoá lại. Sửa thì gửi lại `DONVITINH_ID` của dòng.
- **[Kiểm trên host]** Ô lọc "Phân loại địa điểm" gốc không được nạp, nay nạp KHCT.DDPG. Cột cuối gốc ghi tiêu đề "Lý do" nhưng thực ra hiện Năm - Kỳ - Đợt.
  - → Làm như hiện tại: ô lọc có danh mục. Tiêu đề cột đổi thành "Thời gian áp dụng".

### apisnhansu/modules/heso/tonghopkhoiluong
- **[Cần quyết]** Gốc lưu `strDaoTao_ThoiGianDaoTao_Id` lấy từ Ô LỌC Thời gian chứ không phải ô trong biểu mẫu. `resetPopup` còn chép ngược ô biểu mẫu sang ô lọc. Hệ quả: sửa một dòng là ghi đè thời gian của nó bằng giá trị ô lọc.
  - → Làm như hiện tại: gửi ô Thời gian của biểu mẫu; Thêm mới điền sẵn từ ô lọc.
- **[Cần quyết]** Ô lọc Thời gian không được gửi vào `KHCT_KeHoachTongHop_V2/LayDanhSach` (gốc cũng không gửi).
  - → Làm như hiện tại: giữ nguyên như gốc. Ô lọc chỉ còn dùng để điền sẵn khi thêm mới.
- **[Kiểm trên host]** Hiệu lực mặc định "Hiệu lực" (1). Gốc đặt rỗng lúc thêm nên thực tế có thể gửi null.
  - → Làm như hiện tại: `dHieuLuc` bắt buộc, mặc định 1.

### apisnhansu/modules/heso/khongtinhluong
- **[Cần quyết]** Sửa một dòng mà chọn NHIỀU thành phần lương thì gốc gửi CapNhat cùng `strId` cho từng thành phần, nên chỉ thành phần cuối có hiệu lực.
  - → Làm như hiện tại: giữ như gốc, mỗi thành phần một lời gọi CapNhat cùng id.
- **[Cần quyết]** Ô Đơn vị trong biểu mẫu không được gửi đi, chỉ để thu hẹp danh sách cán bộ. Để trống thì hiện mọi cán bộ. Gốc để ô Cán bộ trống tới khi chọn Đơn vị ở màn Thêm; ở màn Sửa thì nạp mọi cán bộ.
  - → Làm như hiện tại: không khoá Cán bộ theo Đơn vị trong biểu mẫu (lọc tuỳ chọn, cùng cách gốc mở màn Sửa). Chọn hoặc xoá Đơn vị thì xoá trắng Cán bộ. Riêng ô lọc thì khoá theo `pat.chain`.
- **[Kiểm trên host]** Các tham số `strLoaiKhongTinhLuong_Id`, `strNam`, `strThang` (lưu và danh sách) đều gửi rỗng, vì gốc đọc những ô không có trên màn này (màn chép từ xulybietle).
  - → Làm như hiện tại: gửi rỗng như gốc.

### apisnhansu/modules/heso/xulybietle
- **[Kiểm trên host]** Mã danh mục loại xử lý là `"NHANSU.LUONG,LOAIXULYBIETLE"` (có dấu phẩy), nghi gõ sai.
  - → Làm như hiện tại: chép nguyên mã.
- **[Kiểm trên host]** Kế thừa ở gốc gửi `strId` = id dòng vừa mở Sửa gần nhất.
  - → Làm như hiện tại: luôn gửi `strId` rỗng (thêm mới), cho mỗi dòng đánh dấu × mỗi tháng chọn.
- **[Cần quyết]** Cặp Đơn vị → Cán bộ trong biểu mẫu xử lý giống khongtinhluong.
  - → Làm như hiện tại: Đơn vị là lọc tuỳ chọn, không khoá Cán bộ; ô lọc thì khoá theo `pat.chain`.

### apisnhansu/modules/heso/chedomien
- **[Kiểm trên host]** Gốc `resetPopup` điền Chức vụ từ ô `dropSearch_Vu` (gõ sai). Danh sách gửi `strLoaiGiangVien_Id` rỗng (ô lọc không có).
  - → Làm như hiện tại: Thêm mới điền sẵn Chức vụ từ ô lọc Chức vụ; `strLoaiGiangVien_Id` của danh sách gửi rỗng như gốc.

### apisnhansu/modules/heso/chedomienrieng
- **[Kiểm trên host]** Giống chedomien (`dropSearch_Vu`, `strLoaiGiangVien_Id` rỗng). Cột Chức vụ gốc đã chú thích bỏ, nhưng biểu mẫu vẫn còn ô Chức vụ.
  - → Làm như hiện tại: giữ ô Chức vụ trong biểu mẫu, bảng không có cột Chức vụ (như gốc).

### apisnhansu/modules/heso/khungdinhmuc
- **[Kiểm trên host]** Lưu gửi `strTrinhDoChuyenMon_Id` = ô Chức danh (cùng giá trị với `strChucDanh_Id`), và `strPhamViApDung_Id` rỗng (gốc đọc `dropAAAA`).
  - → Làm như hiện tại: chép nguyên.

### apisnhansu/modules/heso/khungdinhmucrieng
- **[Kiểm trên host]** `strTrinhDoChuyenMon_Id` = ô Chức danh (như gốc). Hai cột Chức danh / Học hàm gốc đã chú thích bỏ, nhưng biểu mẫu vẫn có hai ô này.
  - → Làm như hiện tại: chép nguyên; bảng không có hai cột đó.

### apisnhansu/modules/heso/hesongach
- **[Kiểm trên host]** Chung cho cả module heso: lưu xong quay về danh sách và nạp lại (gốc để hộp mở). Không có nút xoá trên từng dòng hay trong biểu mẫu; nút Xóa trong hộp gốc để `display:none`.
  - → Làm như hiện tại: chỉ có "Xóa" nhiều dòng (hỏi lại một lần, gửi `Xoa` tuần tự từng dòng).

### apisnhansu/modules/dubao/nangluongtruocthoihan
- **[Kiểm trên host]** Màn TRƯỚC THỜI HẠN gọi action `NS_DuBao/NangLuongVuotKhung` (giống màn vượt khung) nhưng đọc cột của nâng lương trước hạn (`SOTHANGNANGLUONGTRUOCHAN`, `THANHTICHDUOCGHINHANTRUOCHAN`, `LOAIHOCVI`…). Nhiều khả năng chép nhầm action.
  - → Làm như hiện tại: giữ nguyên action như gốc.
- **[Kiểm trên host]** Trình xử lý chọn Cơ cấu ở gốc gắn nhầm id (`dropSearchNLTTH_…`), nên Bộ môn chưa từng lọc theo Cơ cấu.
  - → Làm như hiện tại: Bộ môn lọc theo Cơ cấu đã chọn (luật cha → con).

### apisnhansu/modules/dubao/nangluongthuongxuyen
- **[Cần quyết]** Nút "Xuất excel ▾" của gốc chưa từng chạy: danh sách báo cáo từ danh mục `SYS.RP.NLTX` (NLTH, NLVK ở hai màn kia) gọi `me.report_InHoSo`, một hàm không tồn tại. Mục "Import dữ liệu" và "Export file" bị thay mất ngay khi nạp.
  - → Làm như hiện tại: nút "Xuất excel" xuất chính bảng đang xem ra .xls ở máy khách (`ums.ui.xuatXls`), không dùng danh mục báo cáo. Áp dụng cho cả ba màn dự báo.
- **[Kiểm trên host]** Cặp Cơ cấu → Bộ môn theo luật cha → con: chưa chọn Cơ cấu thì Bộ môn khoá (gốc đổ sẵn mọi bộ môn). Chỉ tải khi bấm Tìm kiếm. Không phân trang máy chủ (gốc cũng không gửi pageIndex).
  - → Làm như hiện tại: đúng như mô tả, phân trang ở máy khách.

### apisnhansu/modules/dubao/hethanhopdong
- **[Cần quyết]** Bản gốc rỗng (html trống, .js 0 byte). Có cần gỡ khỏi menu, hay chờ nghiệp vụ mô tả?
  - → Làm như hiện tại: hiện khung "Chức năng chưa có nội dung", không gọi API.

### apisnhansu/modules/dubao/nghihuu
- **[Cần quyết]** Bản gốc rỗng (html trống, .js 0 byte).
  - → Làm như hiện tại: hiện khung "Chức năng chưa có nội dung", không gọi API.

### apisnhansu/modules/chamcongphep/chamcongvaora
- **[Kiểm trên host]** Hai cột bảng chi tiết ("Ngày chấm công", "Thời gian chấm công") cùng đọc cột `DIADIEMCCVaoRa` như mDataProp gốc — tên cột không khớp tiêu đề, nhiều khả năng chép nhầm; bảng có thể luôn trống.
  - → Làm như hiện tại: giữ nguyên tên cột gốc, không đoán tên cột thật.
- **[Cần quyết]** Nút "Import" (khung Thông tin chung) và "Export" (khung chi tiết) gốc là liên kết không gắn xử lý.
  - → Làm như hiện tại: giữ nút, đặt disabled.
- **[Cần quyết]** Cơ cấu → Bộ môn: gốc nạp sẵn mọi bộ môn, chọn được khi chưa chọn Cơ cấu.
  - → Làm như hiện tại: luật cha → con (khoá Bộ môn tới khi chọn Cơ cấu, xoá Cơ cấu thì xoá Bộ môn) — áp chung cho chamcongvaora, nghiphep, nghihuu, hopdongcanbo.

### apisnhansu/modules/chamcongphep/danhsachphep
- **[Cần quyết]** Đơn vị → Thành viên: gốc nạp toàn bộ hồ sơ vào ô Thành viên lúc mở màn.
  - → Làm như hiện tại: khoá ô Thành viên tới khi chọn Đơn vị (luật cha → con), chọn/xoá Đơn vị là nạp lại Thành viên + danh sách.
- **[Kiểm trên host]** Kế thừa gửi `strDaoTao_CoCauToChuc_Id`/`strNhanSu_HoSoNhanSu_Id`/`strNamApDung` lấy từ DÒNG đánh dấu và `strNamKeThua` từ ô trong hộp (có thể để trống như gốc).
  - → Làm như hiện tại: chép nguyên; chạy hàng loạt có tiến độ (ui.batch) rồi nạp lại.
- **[Kiểm trên host]** Danh sách trả Success kèm Message thì gốc chỉ báo Message, không vẽ bảng.
  - → Làm như hiện tại: giữ nguyên (báo Message, không vẽ).

### apisnhansu/modules/chamcongphep/dimuonvesom
- **[Cần quyết]** Gốc gửi LayDanhSach trang 1 / 10 dòng mà KHÔNG vẽ phân trang → quá 10 dòng là mất (cùng lỗi ở giolamviec, ngaylamviectuan, nghichedo).
  - → Làm như hiện tại: phân trang máy chủ (ums.crud `paged`, đọc Pager).
- **[Cần quyết]** Nút "Viết lại" trong biểu mẫu trùng id với "Tải lại" nên chưa từng chạy (cùng ở ngaylamviectuan, nghichedo, giolamviec; nghile/nghiphep: id riêng nhưng không gắn xử lý).
  - → Làm như hiện tại: bỏ nút; Thêm luôn mở biểu mẫu trống.
- **[Cần quyết]** Gốc lưu xong ở lại biểu mẫu với id cũ (bấm Lưu lần hai lại thêm dòng mới) — cùng ở các màn quy định.
  - → Làm như hiện tại: lưu xong về danh sách (ums.crud).

### apisnhansu/modules/chamcongphep/ngaylamviectuan
- **[Kiểm trên host]** CapNhat gốc không gửi `strNguoiThucHien_Id`.
  - → Làm như hiện tại: không gửi; api.js tự điền người đăng nhập khi tham số vắng (như mọi lời gọi).
- **[Cần quyết]** Nhãn nhóm biểu mẫu "Nhóm thời gian theo mùa" (cả nghichedo) không khớp nội dung.
  - → Làm như hiện tại: giữ đúng chữ gốc.

### apisnhansu/modules/chamcongphep/nghile
- **[Cần quyết]** Ô lọc "Năm áp dụng" chọn sẵn năm nay khi mở màn (gốc dateYearToCombo mặc định năm nay) → mở màn chỉ thấy ngày lễ năm nay.
  - → Làm như hiện tại: giữ như gốc; ô lọc chọn hoặc xoá đều nạp lại.

### apisnhansu/modules/chamcongphep/nghiphep
- **[Cần quyết]** Thêm mới mà không đánh dấu "Tất cả" và không chọn ai: gốc gửi `strNhanSu_HoSoCanBo_Id` rỗng.
  - → Làm như hiện tại: báo "Vui lòng chọn đối tượng áp dụng", không gửi.
- **[Cần quyết]** Gốc thêm xong ở lại biểu mẫu với danh sách người đã chọn → Lưu lần hai khai phép TRÙNG cả nhóm.
  - → Làm như hiện tại: thêm xong quay về khung trước (chi tiết của người đang xem hoặc Thông tin chung).
- **[Kiểm trên host]** Thêm hàng loạt gửi id nối "#" hoặc "ALL" (chép nguyên); Sửa gửi `strNhanSu_HoSoCanBo_Id` = người đang xem ở cột trái.
  - → Làm như hiện tại: chép nguyên.

### apisnhansu/modules/chamcongphep/tonghopcongthang
- **[Kiểm trên host]** Gốc đổ kết quả vào ô bằng id ghép `ID_` + parseInt(ngày đầy đủ bỏ "/") trong khi ô mang id `ID_` + CHAMCONG_NGAY + tháng + năm → lệch khi CHAMCONG_NGAY có số 0 đầu (ngày 1–9 có thể không bao giờ hiện kết quả).
  - → Làm như hiện tại: đổ theo NHANSU_HOSOCANBO_ID + CHAMCONG_NGAYDAYDU; id ô vẫn giữ công thức gốc cho báo cáo/import theo ô.
- **[Kiểm trên host]** Lưu gửi `strId` rỗng (gốc đọc ô txtAAAA không có) → luôn ThemMoi, kể cả ô đã có kết quả.
  - → Làm như hiện tại: chép nguyên (chỉ gửi ô đã đổi, như gốc).
- **[Kiểm trên host]** Lịch sử xác nhận gửi `strsanpham_Id` = ID cán bộ + tháng + năm (ghép chuỗi).
  - → Làm như hiện tại: chép nguyên.
- **[Cần quyết]** Tiêu đề lưới ba tầng: gốc NGÀY / TUẦN / THỨ; bản mới TUẦN / NGÀY / THỨ (tuần gộp nhiều ngày không nằm dưới một ô ngày được).
  - → Làm như hiện tại: TUẦN trên cùng.
- **[Cần quyết]** Xuất báo cáo: có mẫu theo quyền thì dùng mẫu; không có thì giữ ba mục viết cứng của gốc (1. Chấm công, 2. File Chấm công, 3. Import); mẫu import theo quyền không hiện (gốc không có vùng _Import).
  - → Làm như hiện tại: như trên.
- **[Cần quyết]** Lưới gốc cuộn dọc trong khung cao (cửa sổ − 150px).
  - → Làm như hiện tại: không cuộn trong khung riêng (luật chung), cuộn ngang giữ nguyên.

### apisnhansu/modules/hopdong/hopdongcanbo
- **[Cần quyết]** "Xem" danh sách sắp hết hạn: gốc gọi hàm KHÔNG tồn tại (genTable_HetHanChucVu) → bảng chưa từng hiện, số "Hiện có N" luôn 0.
  - → Làm như hiện tại: vẽ bảng và cập nhật số sau khi bấm Xem; không tự gọi `LapDSSapHetHanHD` lúc mở màn (tên thủ tục là "Lập" danh sách).
- **[Cần quyết]** Dải tab một tab "Hợp đồng cán bộ" + khung thu gọn "Hợp đồng lao động".
  - → Làm như hiện tại: bỏ dải tab; khung hợp đồng mở thẳng, có nút Đóng về khung đầu (gốc không có lối về).
- **[Cần quyết]** "Xuất excel" (DS dự kiến) không có xử lý.
  - → Làm như hiện tại: giữ nút, disabled (cả nghihuu).
- **[Kiểm trên host]** Bảng hợp đồng gốc không phân trang (trang 1/10) và nếu Success kèm Message thì chỉ báo Message.
  - → Làm như hiện tại: phân trang máy chủ; ums.crud vẽ bảng bình thường.

### apisnhansu/modules/hopdong/hopdongdukien
- **[Cần quyết]** Ô bắt buộc (Họ tên, CMND/CCCD, Số HĐ, Ngày sinh, Ngày BĐ hiệu lực, Loại HĐ, Đơn vị) gốc chỉ kiểm khi bấm "Lưu và Nhập tiếp", nút Lưu không kiểm.
  - → Làm như hiện tại: kiểm cho cả hai nút.
- **[Cần quyết]** Danh sách lấy MỌI hợp đồng (strNhanSu_HoSoCanBo_Id rỗng), kể cả hợp đồng của cán bộ đã có hồ sơ.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Xoá: thùng rác trên từng mục của gốc.
  - → Làm như hiện tại: nút "Xoá" trong biểu mẫu (ums.crud master), cùng ở quyetdinh.

### apisnhansu/modules/quyetdinh/quyetdinh
- **[Cần quyết]** Lọc: gốc đọc ô không tồn tại (txtSearch_TuKhoa, dropSearch_PhanLoai) → không lọc được.
  - → Làm như hiện tại: lọc thật theo từ khoá + loại quyết định; strNgayHieuLuc_Den gửi rỗng như cũ.
- **[Cần quyết]** Sửa gốc gửi `strNguoiKyQuyetDinh` = ô "Chữ ký" (luôn bị đặt trống khi mở sửa) → Sửa là xoá người ký.
  - → Làm như hiện tại: gửi ô "Người ký"; ô "Chữ ký" giữ trên biểu mẫu nhưng không gửi (gốc Thêm cũng không gửi).
- **[Kiểm trên host]** Thêm thành viên khi SỬA: gốc mất người chọn thêm (CapNhat gửi rỗng, add_QuyetDinh_ThanhVien không nơi nào gọi).
  - → Làm như hiện tại: sau CapNhat gọi `NS_QuyetDinhNhanSu/ThemMoi` (strNhanSu_ThongTinQD_Id, strNhanSu_HoSoCanBo_Id = id nối "#", dThuTu '', strTrangThai 1, strTinhtrang 1) — đường GHI mới.
- **[Kiểm trên host]** `strThongTinDinhKem` gốc đọc ô tải tệp; tệp lưu qua NS_Files theo id quyết định.
  - → Làm như hiện tại: gửi rỗng, tệp qua trường files NS_Files của ums.crud (như các màn hồ sơ CCB).

### apisnhansu/modules/nghihuu/nghihuu
- **[Cần quyết]** NS_DuBao/NghiHuu gửi tuổi Nam 55 / Nữ 50 trong khi tiêu đề ghi "Nam tuổi 60; Nữ tuổi 55".
  - → Làm như hiện tại: chép nguyên tham số và tiêu đề.
- **[Cần quyết]** Khung "Chi tiết quyết định nghỉ hưu" gốc trống (getList_NghiHuu không nơi nào gọi).
  - → Làm như hiện tại: chỉ hiện khung + lời nhắc, không gọi thêm.
- **[Cần quyết]** Số "Hiện có N nhân sự sắp đến hạn nghỉ hưu" gốc luôn 0.
  - → Làm như hiện tại: cập nhật theo số dòng dự kiến sau khi bấm Xem.

### apisnhansu/modules/chamcongphep/dimuonvesom (lịch âm – dương, dùng ở 4 màn)
- **[Cần quyết]** Gốc nhúng iframe `App_Themes/Plugins/amlich-js/currentmonth.html` (trỏ ra ngoài _v2, giao diện cũ).
  - → Làm như hiện tại: vẽ lại bằng thuật toán của chính amlich-hnd.js (ums.nsCham.amLich), thêm nút tháng trước/sau.

### apisnhansu/modules/cocautochuc/cocautochuc
- **[Cần quyết]** "Lưu và nhập tiếp" gốc gọi lưu bất đồng bộ rồi xoá trắng ngay (khi đang sửa thì strId mất trước khi lời gọi đi); Lưu thêm mới gốc ở lại biểu mẫu với strId rỗng (bấm lại là thêm trùng).
  - → Làm như hiện tại: lưu xong mới xoá trắng (Lưu và nhập tiếp); Lưu thường xong về khung Chi tiết / lời nhắc, cây nạp lại.
- **[Cần quyết]** arrValid_CCTC (Tên, Mã, Loại bắt buộc) gốc khai nhưng không gọi.
  - → Làm như hiện tại: bản mới kiểm ba ô đó trước khi lưu.

### apisnhansu/modules/cocautochuc/cocautochucngoaitruong
- **[Cần quyết]** strThongTinNguoiDungDau, strFax, strWebSite gốc đều gửi giá trị ô Ghi chú (chép nhầm id; biểu mẫu không có ba ô đó).
  - → Làm như hiện tại: giữ như gốc (gửi Ghi chú cho cả ba).
- **[Cần quyết]** Nút "Viết lại" gốc gắn nhầm id nên bấm không có gì.
  - → Làm như hiện tại: nay xoá trắng biểu mẫu (đúng tên nút).

### apisnhansu/modules/cocautochuc/cocautochucv2
- **[Cần quyết]** Khối "quan hệ cha - con": nút "Thêm mới quan hệ", "Xóa quan hệ", hộp #modalQuanHe không có trình xử lý; save_QuanHe / getList_QuanHe / delete_QuanHe không nơi nào gọi; ô "Loại quan hệ" không nạp danh mục.
  - → Làm như hiện tại: giữ hai nút nhưng KHOÁ; lịch sử quan hệ nay được ĐỌC (PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Relation) và hiện bảng; bốn ô "hiện tại" hiện chỉ đọc từ dòng quan hệ đầu; ô "Đơn vị cha" vẫn là strDaoTao_CoCau_Cha_Id của bản ghi đơn vị như gốc.
- **[Cần quyết]** Ngày bắt đầu / kết thúc hiệu lực của đơn vị gốc luôn đặt rỗng và không gửi; "Xem cấu trúc tại ngày" không gửi vào LayDanhSach.
  - → Làm như hiện tại: giữ các ô, không gửi đi (như gốc).
- **[Cần quyết]** Hộp #modalDonVi (biểu mẫu đơn vị) là hộp thoại ở gốc.
  - → Làm như hiện tại: biểu mẫu thay chỗ khung cây trong trang (BO-CUC luật 1); nút Thêm lên đầu trang.

### apisnhansu/modules/cocautochuc/danhmucnghe
- **[Cần quyết]** Ô lọc Loại nghề → Nhóm nghề (→ Chức danh) ở gốc là lọc tuỳ chọn (nạp sẵn toàn bộ).
  - → Làm như hiện tại: theo luật chung cha → con (khoá con khi chưa chọn cha, đổi/xoá cha thì xoá con).
- **[Cần quyết]** Biểu mẫu Loại nghề và Nghề nghiệp không có ô Thứ tự (html gốc thiếu txtThuTu_LN / txtThuTu_DM) nên dSort_Order gửi rỗng và việc "dời thứ tự" không chạy cho hai loại này.
  - → Làm như hiện tại: giữ như gốc (gửi rỗng).
- **[Cần quyết]** Nhãn "Thuộc loại nghề nghiệp" của biểu mẫu Chức danh thực chất là ô Nhóm nghề (strFamily_Id).
  - → Làm như hiện tại: đổi nhãn thành "Thuộc nhóm nghề".
- **[Kiểm trên host]** Dời thứ tự (_shiftSortOrdersIfNeeded): lưu với Thứ tự = n thì các dòng cùng phạm vi có thứ tự ≥ n được đẩy +1 bằng Sua_* trước khi lưu.
  - → Làm như hiện tại: chép nguyên luật (phạm vi: nhóm nghề theo loại, chức danh theo nhóm nghề, nghề nghiệp theo chức danh + bậc); lỗi từng dòng bỏ qua như gốc.

### apisnhansu/modules/cocautochuc/khungcocaunhansu
- **[Kiểm trên host]** Tệp đính kèm: gốc gọi uploadFiles nhưng không gọi saveFiles nên tệp không bao giờ gắn vào bản ghi.
  - → Làm như hiện tại: dùng ums.files (NS_Files), gắn tệp vào Id máy chủ trả sau khi thêm quá trình điều chuyển — đường GHI mới.
- **[Cần quyết]** Lưu xong gốc ở lại biểu mẫu (bấm lại là thêm trùng); ảnh cán bộ gốc đọc data.ANH của mảng (luôn ảnh mặc định).
  - → Làm như hiện tại: lưu xong về danh sách nhân sự; ảnh đọc ANH từng dòng.

### apisnhansu/modules/cocautochuc/vitricongviec
- **[Cần quyết]** Cây gốc đổi dữ liệu sang PARENT_ORG_ID = item.PARENT (cột không có trong NS_CoCauToChuc/LayDanhSach) nên cây thành một tầng phẳng.
  - → Làm như hiện tại: lồng theo DAOTAO_COCAUTOCHUC_CHA_ID như các màn anh em.
- **[Cần quyết]** Ô Từ khoá gốc gợi ý tự động (LayDSCore_Org_Unit) nhưng từ khoá không gửi vào LayDanhSach nên không lọc được gì.
  - → Làm như hiện tại: gõ là lọc cây tại chỗ, Enter / Tìm kiếm nạp lại; bỏ khung gợi ý.
- **[Cần quyết]** Hai hộp #modalCongViec / #modalAddCongViec.
  - → Làm như hiện tại: khung "vị trí của đơn vị" và biểu mẫu vị trí thay chỗ khung cây trong trang (nút Đóng quay lại).

### apisnhansu/modules/cocautochuc/vaitrovitri
- **[Cần quyết]** Nút "Xóa" ở bảng vai trò của vị trí gốc chỉ hỏi lại rồi không làm gì (không có thủ tục xoá Position_Role_Map).
  - → Làm như hiện tại: giữ nút, KHOÁ; bỏ cột ô đánh dấu không còn việc.
- **[Kiểm trên host]** Tên vai trò ở cột "Vai trò" lấy bằng một lời gọi Pr_Core_Position_Role_Map_Gets cho MỖI vị trí (như gốc).
  - → Làm như hiện tại: giữ như gốc.

### apisnhansu/modules/cocautochuc/phanconglaodong
- **[Cần quyết]** Ô "Loại phân công" gốc nạp chồng hai danh mục (CORE.QUANHELAODONG.LOAI rồi CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE).
  - → Làm như hiện tại: chỉ ASSIGNMENT_TYPE_CODE (như quanhelaodong).
- **[Kiểm trên host]** strVaiTro_Id gốc = edu.system.strVaiTro_Id || appId; strChucNang_Id gửi tường minh.
  - → Làm như hiện tại: strVaiTro_Id = vai trò đang mở (ums.state.roleId), strChucNang_Id = chức năng đang mở.
- **[Cần quyết]** Hộp #modalNhiemVu / #modalAddNhiemVu.
  - → Làm như hiện tại: bảng phân công và biểu mẫu thay chỗ danh sách nhân sự trong trang; hộp chọn QHLĐ giữ là hộp thoại (việc chọn).

### apisnhansu/modules/cocautochuc/quanhelaodong
- **[Kiểm trên host]** Máy chủ không trả MANAGING_ORG_ID nên gốc cất "đơn vị đang làm việc" vào localStorage (QHLD_MANAGING_ORG_<id>) lúc lưu, đọc lại lúc sửa.
  - → Làm như hiện tại: giữ như gốc (chỉ trình duyệt đã lưu mới thấy).
- **[Cần quyết]** Ô "Quyết định" gốc không nạp danh sách nào (gửi rỗng cho strSource_Event_Id / strDecision_Id); nhãn hai ô đơn vị ("biên chế / gốc" ↔ strOrg_Id, "đang làm việc" ↔ strManaging_Org_Id) giữ đúng gốc.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Khối phân công chỉ hiện khi mở từ tab "Có quan hệ lao động còn hiệu lực" (như gốc).
  - → Làm như hiện tại: giữ như gốc (tab khác chỉ một cột QHLĐ).

### apisnhansu/modules/tracuuinan/hosolylich
- **[Cần quyết]** Hai khung "Mẫu lý lịch 2C-BNV" / "2C-TW" trong html gốc không bao giờ hiện (hàm toggle không nơi nào gọi).
  - → Làm như hiện tại: không chép; in lý lịch qua các nút mẫu CCB.BCTK (ums.report.run).
- **[Cần quyết]** Bấm nút in khi chưa chọn nhân sự gốc gửi strNhanSu_Id rỗng; strOutputType đọc radio không có trên màn.
  - → Làm như hiện tại: nhắc chọn nhân sự trước; strOutputType gửi rỗng như gốc.

### apisnhansu/modules/tracuuinan/nhansutuychon
- **[Cần quyết]** Bảng xem trước gốc gửi strDaoTao_CoCauToChuc_Id rỗng (biến đặt nhầm) nên không lọc theo cơ cấu.
  - → Làm như hiện tại: gửi Bộ môn || Cơ cấu đã chọn; các ô lọc khác chỉ vào tệp Excel (NhanSuTuyChon) như gốc.
- **[Cần quyết]** Ô "Nơi sinh" = đơn vị CON của tỉnh chọn ở "Quê quán" (genCombo_DMDL_TheoCha); ô "Loại cán bộ" không nạp danh mục nào.
  - → Làm như hiện tại: giữ như gốc.

### apisnhansu/modules/baocao/chatluongnhanluc
- **[Cần quyết]** Đếm "Anh văn — chứng chỉ" bằng TRINHDONGOAINGU_MA != "" nên dòng null cũng được đếm; ba ô ngoại ngữ còn lại luôn 0.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Nút "Xuất excel" gốc không có trình xử lý.
  - → Làm như hiện tại: xuất bảng đang hiện bằng ums.ui.xuatXls.

### apisnhansu/modules/baocao/tongquannhanluc
- **[Cần quyết]** Gốc lặp theo hai mảng không bao giờ được điền nên bảng luôn rỗng.
  - → Làm như hiện tại: chưa chọn đơn vị → mỗi dòng một đơn vị cha (gồm đơn vị con); đã chọn → Bộ môn đã chọn, hoặc cơ cấu cha + các bộ môn của nó.
- **[Cần quyết]** TUOI / giờ giảng / bài báo rỗng gốc vẫn đếm (NaN làm hỏng Max/Min/TB); KL giờ NCKH gốc không tính (luôn 0); nút Xuất excel không có xử lý.
  - → Làm như hiện tại: bỏ qua giá trị không phải số; KL NCKH giữ 0; xuất bằng ums.ui.xuatXls.

### apisnhansu/modules/dashboard/dashboard
- **[Cần quyết]** Trang gốc là mẫu tĩnh (5 thẻ ảnh "Dashboard Mod điểm", nút Chi tiết trỏ trang không tồn tại); dashboard.js (biểu đồ nhân sự) chưa từng chạy vì html gọi `new DashBoard()` còn tệp khai `Dashboard`.
  - → Làm như hiện tại: chép trang mẫu, nút Chi tiết KHOÁ, đầu trang ghi "Trang mẫu".

### apisnhansu/modules/dashboard/modul
- **[Kiểm trên host]** Mở chức năng của ứng dụng khác: bản mới chuyển sang #/r/<CHUNG_UNGDUNG_ID>/<ID> (coi CHUNG_UNGDUNG_ID là vai trò như appId của hệ).
  - → Làm như hiện tại: như trên; chức năng không có DUONGDANFILE mở chức năng con đầu (như gốc).
- **[Cần quyết]** Bỏ yêu thích xong gốc gọi hàm không tồn tại (getList_ChucNangTheoPhanLoai) → lỗi JS.
  - → Làm như hiện tại: nạp lại danh sách chức năng như khi thêm yêu thích.

### apisnhansu/modules/dashboard/trangchu
- **[Kiểm trên host]** Bấm ô yêu thích chuyển sang #/r/<CHUNG_UNGDUNG_ID>/<ID>.
  - → Làm như hiện tại: như trên; danh sách rỗng hiện câu dẫn (gốc bấm hộ #menuChucNang của vỏ cũ).

### apisnhansu/modules/dgplnguoilaodong/anhxa
- **[Cần quyết]** Nút Lưu gốc LUÔN gọi `NS_PLDG_NLD_AnhXa/ThemMoi`, nên sửa một dòng lại thành thêm dòng mới. Nút "Tìm kiếm" gốc gắn vào Lưu/Cập nhật; Enter ở ô từ khoá gọi hàm không tồn tại; danh sách gửi `strTuKhoa` rỗng.
  - → Làm như hiện tại: Lưu gọi ThemMoi hoặc CapNhat tuỳ đang thêm hay sửa (giống bản LTT). Tìm kiếm và Enter nạp lại danh sách và gửi từ khoá.
- **[Cần quyết]** Danh sách gốc không phân trang, chỉ hiện 10 dòng đầu.
  - → Làm như hiện tại: có phân trang máy chủ (pageIndex/pageSize).
- **[Cần quyết]** Biểu mẫu gốc có nút "Viết lại".
  - → Làm như hiện tại: bỏ nút này. Biểu mẫu Thêm của `ums.crud` luôn mở trắng. Xoá thực hiện bằng nút Xoá trong biểu mẫu (khung hai cột của crud), không có thùng rác trên từng mục như gốc.

### apisnhansu/modules/dgplluongtangthem/anhxa
- **[Cần quyết]** Ô Kế hoạch của bản LTT gốc nạp từ `NS_PLDG_NLD_KeHoach` (kế hoạch người lao động) nhưng lưu vào `strNhanSu_DGPL_LTT_KH_Id`.
  - → Làm như hiện tại: giữ như gốc, vẫn nạp kế hoạch NLD.
- **[Kiểm trên host]** Khi sửa, ô Kế hoạch đọc cột `NHANSU_DGPL_NAM_KEHOACH_ID` (cả hai bản gốc đều đọc cột này).
  - → Làm như hiện tại: đọc cột đó; nếu rỗng thì lấy dự phòng `NHANSU_DGPL_LTT_KEHOACH_ID`.

### apisnhansu/modules/dgplnguoilaodong/phancap
- **[Cần quyết]** Nút Xoá ở mỗi người đánh giá (cột trái) gốc gửi `strIds = "view_<id>"` (sai tiền tố), nên không xoá được gì. Không có lời gọi nào xoá theo người đánh giá.
  - → Làm như hiện tại: giữ nút nhưng khoá (disabled), kèm chú thích. Xoá từng người được đánh giá ở bảng bên phải vẫn chạy.
- **[Cần quyết]** Từ khoá, Cơ cấu, Bộ môn ở cột trái gốc KHÔNG được gửi đi (`LayDanhSachLanhDao` chỉ nhận kế hoạch). Nút "Tìm kiếm" gốc không có xử lý.
  - → Làm như hiện tại: giữ các ô và không gửi. Nút Tìm kiếm và Enter nạp lại cột trái. Cơ cấu → Bộ môn khoá theo luật cha → con.
- **[Cần quyết]** Lưu gốc không kiểm tra gì và ở lại biểu mẫu, nên bấm Lưu lần nữa là thêm TRÙNG. Mở "Thêm" khi đang xem một người thì gốc ngầm lấy người đó làm người đánh giá mà không hiện ra.
  - → Làm như hiện tại: điền sẵn và hiện người đang xem. Báo nếu thiếu người đánh giá hoặc người được đánh giá. Lưu xong quay về danh sách của người vừa lưu. Hộp chọn nhân sự cho chọn nhiều; ô "đối tượng đánh giá" lấy người đầu tiên và báo cho người dùng.
- **[Kiểm trên host]** Ảnh đại diện gốc đọc `data.ANH` của cả mảng nên luôn rỗng.
  - → Làm như hiện tại: đọc cột `ANH` của từng dòng, hiện qua `ums.files.url`. Chưa kiểm cột này có thật trong `LayDanhSachLanhDao` / `LayDanhSachNhanVien` hay không.

### apisnhansu/modules/dgplluongtangthem/phancap
- **[Kiểm trên host]** Lưu dùng tham số `strNhanSu_DGPL_ltt_KH_Id` (chữ "ltt" viết thường), trong khi danh sách dùng `strNhanSu_DGPL_LTT_KH_Id`.
  - → Làm như hiện tại: chép nguyên cả hai tên như gốc. Các điểm còn lại giống bản NLD.

### apisnhansu/modules/dgplnguoilaodong/tieuchi
- **[Cần quyết]** Ô Kế hoạch gốc nạp với pageSize mặc định (10), nên chỉ có 10 kế hoạch đầu. Danh sách gửi `strLoaiDoiTuong_Id` và `strNhomTieuChi_Id` rỗng (gốc đọc ô không tồn tại).
  - → Làm như hiện tại: nạp 10000 kế hoạch; hai tham số lọc vẫn gửi rỗng như gốc.

### apisnhansu/modules/dgplnguoilaodong/sinhphieu
- **[Cần quyết]** Nút Tìm kiếm gốc không có xử lý, Enter không làm gì, phân trang gọi `main_doc.KeHoach` không tồn tại (lỗi JS). `KhoiTao` gửi `strLoaiDoiTuong_Id` rỗng.
  - → Làm như hiện tại: Tìm kiếm, Enter và phân trang đều chạy. `strLoaiDoiTuong_Id` vẫn gửi rỗng như gốc. Hai khung chết ("Chi tiết sản phẩm", "Lập kế hoạch") đã bỏ.

### apisnhansu/modules/dgplnguoilaodong/ketqua
- **[Cần quyết]** Html gốc "KẾT QUẢ PHÂN LOẠI ĐÁNH GIÁ CÔNG CHỨC & NGƯỜI LAO ĐỘNG" (bảng 10 cột) lại nạp mã báo cáo Chất lượng nhân lực. Mã này đếm ra 28 ô số và nhét vào bảng 10 cột, nên cột bị lệch. Cả phân hệ không có API trả kết quả phân loại. Cần chọn: hiện báo cáo chất lượng nhân lực ở đây, hay chờ có API kết quả phân loại.
  - → Làm như hiện tại: dựng đủ khung (tiêu đề, ghi chú, ô Loại cán bộ, bảng 10 cột), khoá nút Tìm kiếm, hiện dòng "chưa có nguồn dữ liệu", không gọi API.

### apisnhansu/modules/dgplluongtangthem/ketqua
- **[Cần quyết]** Menu ghi "Kết quả" nhưng màn gốc là "BÁO CÁO CHẤT LƯỢNG NHÂN LỰC" (không liên quan lương tăng thêm) và trùng với `baocao/chatluongnhanluc`.
  - → Làm như hiện tại: chuyển đúng báo cáo đó. Giữ nguyên chỗ gốc chỉ lấy 1000 hồ sơ đầu, ba cột Ngoại ngữ luôn bằng 0, và mọi `TRINHDONGOAINGU_MA` khác "" (kể cả null) đều tính vào "Anh văn — Chứng chỉ".
- **[Kiểm trên host]** Nút "Xuất excel" gọi `edu.system.report("ChatLuongNhanLuc")`.
  - → Làm như hiện tại: gọi `ums.report.run('ChatLuongNhanLuc', { duongDan: '', collect: NS_LoaiCanBo })`.

### apisnhansu/modules/dgplluongtangthem/kehoach
- **[Cần quyết]** Khối lọc "Danh mục kế hoạch / Lĩnh vực" của gốc ẩn sẵn, không được nạp, không được gửi.
  - → Làm như hiện tại: bỏ khối này. Bản LTT không có ô Năm (đúng như gốc).

### apisnhansu/modules/dgplluongtangthem/quydinh
- **[Cần quyết]** Danh sách gốc gửi `strNhanSu_DGPL_LTT_KH_Id` bằng `getValById("")`, tức là rỗng. Ô lọc Xếp loại không có tham số tương ứng.
  - → Làm như hiện tại: gửi ô Kế hoạch ở cột trái. Ô Xếp loại vẫn hiện nhưng không gửi.

### apisnhansu/modules/dgplluongtangthem/tieuchitru
- **[Kiểm trên host]** Mở Sửa ở bản gốc chỉ đổ Loại áp dụng, không đổ Tiêu chí và Phương thức lấy tin, nên bấm Lưu là ghi rỗng hai cột này.
  - → Làm như hiện tại: đổ lại từ cột `NHANSU_DGPL_LTT_TC_ID` và `PHUONGTHUCLAYTHONGTIN_ID`. Hai tên cột này là ĐOÁN theo tên tham số. Ô Loại áp dụng chỉ dùng để lọc ô Tiêu chí, không gửi đi (như gốc).

### apisnhansu/modules/dgplluongtangthem/tieuchithuong_cvql
- **[Cần quyết]** Bản gốc là trang trống.
  - → Làm như hiện tại: khung "chưa có nội dung", không gọi API. Cần hỏi nên gỡ khỏi menu hay chờ nghiệp vụ mô tả.

### apisnhansu/modules/nhansu/kehoach
- **[Cần quyết]** Xoá ĐỢT tuyển dụng: gốc gọi `Xoa_NS_TD_KeHoach` với id đợt (xoá nhầm kế hoạch / không xoá gì). 
  - → Làm như hiện tại: gọi `pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach_Dot` (action `NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikeBS41`, mã hoá theo đúng quy tắc tên — gốc chưa từng gọi).
- **[Kiểm trên host]** Procedure `Xoa_NS_TD_KeHoach_Dot` có tồn tại / đúng chữ ký (strId) không.
  - → Làm như hiện tại: gọi thủ tục trên; lỗi thì hiện Message máy chủ.
- **[Cần quyết]** "Tổng hợp đề xuất" / "Đề xuất của các đơn vị theo đợt": gốc gọi `LayDSNS_TD_KeHoach_Dot` (trả ĐỢT) mà đọc cột đề xuất → bảng luôn trống.
  - → Làm như hiện tại: gọi `LayDSNS_TD_KeHoach_DeXuat` (strTuKhoa '', strNS_TD_KeHoach_Id, strNS_TD_KeHoach_Dot_Id — rỗng khi mở từ kế hoạch) như màn Đề xuất tuyển dụng.
- **[Cần quyết]** Nút "Hội đồng" của đợt: gốc mở thẳng khung Thành viên (bảng trùng id nên không hiện gì); khung "Thông tin hội đồng" không có lối vào; hộp Thêm/Sửa hội đồng sai id nên chưa từng mở.
  - → Làm như hiện tại: Đợt → Hội đồng (thêm / sửa / xoá `Them_/Sua_/Xoa_NS_TD_KeHoach_HD`) → Thành viên hội đồng. Đường GHI hội đồng là mới — chưa từng chạy ở gốc.
- **[Cần quyết]** Ô "Loại hội đồng" (gửi `strLoaiHopDong_Id`): gốc không nạp danh mục nào cho ô này.
  - → Làm như hiện tại: ô trống kèm gợi ý "Bản gốc chưa nạp danh mục", gửi rỗng; strNgayQD / strSoQD / dThuTu gửi rỗng như gốc (txtAAAA).
- **[Cần quyết]** Đơn vị → Thành viên (hộp thành viên hội đồng): Đơn vị chỉ để lọc danh sách, không gửi đi, gốc để chọn thành viên khi chưa chọn đơn vị.
  - → Làm như hiện tại: lọc TUỲ CHỌN, không khoá; đổi / xoá đơn vị thì nạp lại danh sách và xoá trắng Thành viên; mở biểu mẫu sửa thì nạp lại toàn bộ cán bộ.
- **[Cần quyết]** Nút "Nhân sự" (xử lý bị chú thích), "Kết quả tuyển dụng", "Kết quả đánh giá của hội đồng", "Duyệt" (không có xử lý), "Tổng hợp kết quả" (mở khung mẫu tiêu đề viết cứng "Nguyễn Văn X", thân trống).
  - → Làm như hiện tại: giữ nút, khoá (title nêu lý do).
- **[Cần quyết]** Lưu kế hoạch / đợt / hội đồng / thành viên: modal gốc lưu xong vẫn mở.
  - → Làm như hiện tại: lưu xong quay về danh sách và nạp lại (khuôn ums.crud).
- **[Cần quyết]** Thêm/Sửa: gốc là modal chồng modal.
  - → Làm như hiện tại: các danh sách con là vùng thay chỗ trong trang (nút Đóng quay về tầng trên), biểu mẫu thay chỗ danh sách.

### apisnhansu/modules/kehoach/kehoach
- **[Cần quyết]** html gốc giống hệt `nhansu/kehoach` và nạp chính `modules/nhansu/script/kehoach.js`; `kehoach/script/kehoach.js` (màn phạm vi / quyền cũ) không được nạp.
  - → Làm như hiện tại: dùng chung tệp `nhansu/script/kehoach.js`, không chuyển `kehoach/script/kehoach.js`. Hỏi: có cần giữ hai mục menu cùng một màn không.

### apisnhansu/modules/nhansu/dexuattuyendung
- **[Cần quyết]** Lưu đề xuất khi chưa chọn đợt: gốc gửi strNS_TD_KeHoach_Dot_Id rỗng (khi SỬA còn ghi đè đợt của đề xuất thành rỗng).
  - → Làm như hiện tại: báo "Vui lòng chọn Các đợt trong kế hoạch…" và không lưu (cả thêm lẫn sửa).
- **[Cần quyết]** Xoá hồ sơ ứng viên: gốc gọi `Xoa_NS_TD_KeHoach_DeXuat` với id hồ sơ (xoá nhầm ĐỀ XUẤT).
  - → Làm như hiện tại: gọi `Xoa_NS_TD_KeHoach_DeXuat_HS` (action `…/GS4gHg8SHhUFHgokCS4gIikeBSQZNCA1HgkS`, mã hoá theo quy tắc tên, gốc chưa từng gọi).
- **[Kiểm trên host]** Procedure `Xoa_NS_TD_KeHoach_DeXuat_HS` có tồn tại / đúng chữ ký không.
  - → Làm như hiện tại: gọi thủ tục trên.
- **[Kiểm trên host]** Đợt trong ô lọc hiện cột `NS_TD_KEHOACH_TEN` (tên kế hoạch?) như gốc — kiểm có phân biệt được các đợt không.
  - → Làm như hiện tại: giữ tên cột gốc.
- **[Cần quyết]** Mã hồ sơ: ô bị khoá, gốc gửi `strMaHoSo` rỗng.
  - → Làm như hiện tại: hiện chỉ đọc, gửi rỗng.

### apisnhansu/modules/nhansu/nhansu
- **[Cần quyết]** Gốc là trang mẫu tĩnh của màn tuyển dụng (không gọi máy chủ); nội dung thật nằm ở "Kế hoạch nhân sự".
  - → Làm như hiện tại: khung "chưa có nội dung" + nút mở Kế hoạch nhân sự. Hỏi: gỡ khỏi menu?

### apisnhansu/modules/kehoach/canhan
- **[Cần quyết]** Gốc là trang mẫu tĩnh (id chép từ Tài chính) + script chép màn phạm vi coi thi, không chạy được.
  - → Làm như hiện tại: khung "chưa có nội dung", không gọi API. Hỏi: gỡ khỏi menu hay dựng thật.

### apisnhansu/modules/kehoach/dexuathoso
- **[Cần quyết]** Lưu hồ sơ gửi MỌI dòng định danh / liên hệ bắt buộc, kể cả dòng để trống (InsertPersonIdentifier với số rỗng) — như gốc.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Lưu xong gốc ở lại biểu mẫu và không nhớ id các dòng định danh / liên hệ vừa thêm (bấm Lưu lần hai là thêm trùng).
  - → Làm như hiện tại: ở lại biểu mẫu, lần sau là SỬA người vừa lưu; nạp lại id dòng định danh / liên hệ nên lần Lưu sau gọi Update….
- **[Cần quyết]** Kiểm tra định danh: gốc chỉ chặn khi thiếu CẢ HAI ô (&&) mà câu báo "cần điền đủ".
  - → Làm như hiện tại: chặn khi thiếu một trong hai ô.
- **[Cần quyết]** Sửa hồ sơ: gốc đọc biến `strChinhXac_Id` chưa khai → lỗi JS, ô ngày/tháng/năm không ẩn/hiện theo mức độ.
  - → Làm như hiện tại: ẩn/hiện theo mức độ đang lưu (EXACT / MONTH_ONLY / YEAR_ONLY / UNKNOWN).
- **[Cần quyết]** Ngày ở các tab chi tiết: gốc dùng ô type=date (gửi yyyy-mm-dd) ở Địa chỉ / Gia đình / TK ngân hàng / Chứng chỉ / Tài liệu / Học hàm, riêng Học vấn đổi sang dd/mm/yyyy (ghi chú gốc: "Oracle parse DD/MM/YYYY").
  - → Làm như hiện tại: gửi dd/mm/yyyy ở mọi tab; đổ ngày đọc được cả hai dạng.
- **[Kiểm trên host]** Các thủ tục Ins_/Upd_Person_* (trừ Education) nhận ngày dd/mm/yyyy đúng không.
  - → Làm như hiện tại: gửi dd/mm/yyyy.
- **[Cần quyết]** Tệp đính kèm Chứng chỉ / Tài liệu: gốc gửi giá trị ô file ("C:\fakepath\…") vào strFile_Id — chưa có luồng tải tệp thật.
  - → Làm như hiện tại: không có ô chọn tệp; strFile_Id giữ FILE_ID đang có (thêm mới: rỗng).
- **[Cần quyết]** Nút "Chi tiết" ở Học vấn / Chứng chỉ / Tài liệu / Học hàm: gốc có hàm hiển thị nhưng không gắn vào nút (nút chết).
  - → Làm như hiện tại: mở hộp chi tiết (By_Id; rỗng hoặc {DUMMY} thì dùng dòng đang có).
- **[Kiểm trên host]** `Get_Person_Education_By_Id` / `_Certificate_By_Id` trả đủ dữ liệu chưa (ghi chú gốc: "hiện trả DUMMY").
  - → Làm như hiện tại: Sửa Học vấn / Chứng chỉ dùng dòng của danh sách (như gốc); Tài liệu / Học hàm nạp By_Id rồi mới mở biểu mẫu (như gốc), rỗng thì dùng dòng.
- **[Cần quyết]** Ô "Ngành" (dropNganh) của Học vấn bị ẩn ở gốc; strMajor_Id suy từ Mã / Tên ngành trong nhóm ngành.
  - → Làm như hiện tại: không vẽ ô Ngành; suy strMajor_Id như gốc (khớp MA rồi TEN trong nhóm, không ra thì giữ MAJOR_ID cũ nếu mã ngành không đổi); nhóm suy từ ngành nếu thiếu.
- **[Cần quyết]** Danh sách các tab lọc IS_ACTIVE = 1 (trừ Tài liệu) → bỏ đánh dấu "Hiệu lực" rồi lưu là bản ghi biến mất khỏi danh sách.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Xoá: gốc chỉ có Xoá trên dòng (tab chi tiết) và ô đánh dấu + Xoá (danh sách chính); biểu mẫu không có Xoá.
  - → Làm như hiện tại: giống gốc (tab: chỉ thùng rác trên dòng; danh sách chính: dòng + "Xoá đã chọn"; biểu mẫu không có nút Xoá).
- **[Kiểm trên host]** Báo cáo gửi `dHieuLuc` rỗng (ô dropSearch_HieuLuc không có trên trang) và `strDiem_DeXuatHoSoCongNhan_Id` (tên chép từ màn khác) cho mỗi hồ sơ đánh dấu.
  - → Làm như hiện tại: giữ tên tham số gốc.
- **[Kiểm trên host]** Xoá vĩnh viễn gửi `bPermanent: true` cho DeleteCorePerson (ghi chú gốc: "có thể cần API khác").
  - → Làm như hiện tại: gửi như gốc.


## Chốt ngày 2026-09-26 — Sinh viên (ApisSinhVien, lúc chuyển đổi)

113 mục — tự chốt theo phương án tạm lúc chuyển. `hoso/yeucau` gộp vào `thutuchanhchinh/yeucau` (cùng một màn) nên dùng các mục của màn đó.

### apissinhvien/modules/hoso/_hsA
- **[Cần quyết]** Kiểm tra trùng (KiemTraThongTinDinhDanh/LienHe) báo trùng với hồ sơ KHÁC → không lưu gì cả. Gốc (inject 11/09) vẫn lưu riêng hoá đơn / ngân hàng / địa chỉ dù banner báo "toàn bộ nội dung KHÔNG được ghi lại".
  - → Làm như hiện tại: chặn cả lượt Lưu, banner đỏ trên biểu mẫu + tô đỏ ô trùng (cả ô tab 1 lẫn ô bảng).
- **[Cần quyết]** Ô Quốc tịch hiện và chọn được nhưng KHÔNG lưu đi đâu (gốc không có tham số nhận — UpdateCorePerson / Person_Profile đều không có quốc tịch).
  - → Làm như hiện tại: giữ như gốc (hiện, không lưu).
- **[Cần quyết]** Hoá đơn cá nhân (không MST): gốc đổ BUYER_NAME vào ô "Tên đơn vị"; bản vá inject điền thêm "Họ tên người mua". Nay: không MST → ô Họ tên người mua; có MST → ô Tên đơn vị. Gửi strBuyer_Name = Tên đơn vị, trống thì Họ tên người mua (như bản vá "mượn ô").
  - → Làm như hiện tại: như trên.
- **[Kiểm trên host]** BUYER_TYPE_LOAI: gửi ID danh mục TS.DOITUONGHOADON; máy chủ chê đúng cột này thì gửi lại MỘT lần bằng mã (MA, không có thì chữ hiển thị) — như inject 16/09 (Them_ đòi mã chữ, Sua_ nhận GUID).
  - → Làm như hiện tại: giữ cơ chế thử lại; không ghi nhớ kiểu giữa các lần (mỗi lần Lưu tự thử).
- **[Kiểm trên host]** Người dùng tự xoá trắng một liên hệ đã có bản ghi → UpdatePersonContact giữ giá trị cũ + dIsPrimary 0, dIsActive 0, dIs_Active 0 (xoá mềm của inject; CONTACT_VALUE NOT NULL, không có proc xoá). Nạp lại lọc IS_ACTIVE = 0. Chưa rõ máy chủ có nhận cờ này.
  - → Làm như hiện tại: gửi như gốc; áp cho mọi dòng liên hệ (gốc chỉ Email / Điện thoại ở tab 1).
- **[Cần quyết]** Số CCCD / Ngày cấp / Nơi cấp / Email / Điện thoại ở tab 1 và dòng tương ứng ở bảng tab 2 đồng bộ ngay khi gõ (gốc: "cầu nối" ghi đè lúc Lưu, ô sửa sau thắng — nhiều lớp vá vì mất dữ liệu).
  - → Làm như hiện tại: một giá trị, hai chỗ nhập.
- **[Kiểm trên host]** Nhận diện loại CCCD (MA = CCCD / tên chứa CCCD, CĂN CƯỚC) và loại Email / Điện thoại (chấm điểm theo từ khoá + giá trị đang có, như inject `_zeChonLoaiLienHe`) — cần đúng với danh mục LayDSLoai*BatBuoc thật.
  - → Làm như hiện tại: như gốc.
- **[Cần quyết]** Hai bảng "Thông tin định danh" | "Thông tin liên hệ" xếp DỌC (gốc cạnh nhau col-lg-6) — cột phải của màn hai cột hẹp, ô nhập bị bóp còn vài ký tự.
  - → Làm như hiện tại: xếp dọc (cờ `motCot` của X.ddlh).
- **[Cần quyết]** Màn hai cột: chưa chọn SV thì cột phải là lời dẫn (gốc hiện biểu mẫu trống → lưu ra ORA-01400 / tạo hồ sơ rác); biểu mẫu trong trang có thêm nút Đóng (gốc inline ẩn Đóng).
  - → Làm như hiện tại: như trên.
- **[Cần quyết]** Lưu xong báo MỘT câu "Cập nhật thành công!"; phần phụ lỗi gom vào banner "Đã lưu thông tin cơ bản nhưng chưa lưu được: …"; nạp lại Id bản ghi con (lần sau là Update), giữ nguyên giá trị vừa nhập và tab đang mở.
  - → Làm như hiện tại: như trên.
- **[Kiểm trên host]** Địa chỉ Nơi sinh / Hộ khẩu: loại lấy theo tên / mã danh mục PERSON_ADDRESS.ADDRESS_TYPE_CODE (NOI SINH|BIRTH, HO KHAU|THUONG TRU|PERMANENT); tỉnh 2 cấp (con của tỉnh không có cháu) → khoá Quận/Huyện, Xã treo vào Tỉnh, gửi strDistrict_Id rỗng; danh mục CHUN.DMTT (ums.pat.dmTinhThanh, cùng bảng genDropTinhThanh gốc).
  - → Làm như hiện tại: như gốc; thiếu loại trong danh mục → báo lỗi phần địa chỉ.
- **[Cần quyết]** Mức độ ngày sinh luôn đặt "EXACT" khi mở hồ sơ (gốc openEditByPerson) — không đọc mức độ đang lưu.
  - → Làm như hiện tại: giữ như gốc.

### apissinhvien/modules/hoso/xemhoso
- **[Cần quyết]** Màn tên "Xem hồ sơ" nhưng gốc mở CHÍNH biểu mẫu sửa (có nút Lưu) — xemhoso.js là bản chép hosodanhsach.js.
  - → Làm như hiện tại: giữ như gốc (sửa được); dùng chung khung với hoso_danhsach.

### apissinhvien/modules/hoso/hoso_capnhat
- **[Kiểm trên host]** Gốc đọc từ khoá từ ô `txtSearchSinhVien_TuKhoa_DS` không có trên trang → gõ từ khoá chưa từng lọc được. Nay gửi đúng ô từ khoá (bốn ô Hệ/Khoá/Ngành/Lớp không có → rỗng như gốc).
  - → Làm như hiện tại: gửi từ khoá.

### apissinhvien/modules/hoso/hoso_taomoi
- **[Cần quyết]** Nút "Lưu": gốc gọi SV_HoSo/ThemMoi với biểu mẫu khởi tạo đang ẨN (ẩn theo yêu cầu 2026-08-21) → tạo hồ sơ RỖNG rồi mới hiện biểu mẫu, mà nút lưu biểu mẫu ("Cập nhật") đã bị chú thích bỏ.
  - → Làm như hiện tại: giữ nút, KHOÁ (không dựng lại biểu mẫu ẩn, không tạo hồ sơ rỗng).
- **[Cần quyết]** Bấm sinh viên: gốc mở hộp nổi phủ trang; nay biểu mẫu thay chỗ khung "Khởi tạo hồ sơ" ở cột phải; Đóng → về khung khởi tạo + nạp lại danh sách trái (như gốc).
  - → Làm như hiện tại: như trên.
- **[Kiểm trên host]** Import: phân quyền có mẫu import thì dùng các mẫu đó, không có thì hai mục viết cứng IMPORTWITHPROC_HSSV ("hồ sơ") / IMPORTWITHPROC_HSDD ("hồ sơ đầy đủ") như html gốc; nút Báo cáo không vẽ (vùng #zonebtnHSSV gốc không tồn tại).
  - → Làm như hiện tại: như gốc.

### apissinhvien/modules/hoso/quanlytoanbo
- **[Cần quyết]** Danh sách: strKhoaQuanLy_Id và strNamNhapHoc bị gán hai lần trong obj_save gốc, lần sau là txtAAAA / dropAAAA → luôn RỖNG; hai ô lọc này chỉ tác dụng với báo cáo. Ô Học kỳ có mà không gửi đi đâu.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Cột "Hộ khẩu thường trú" đổ TTLL_KHICANBAOTINCHOAI_ODAU (khi cần báo tin cho ai).
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Biểu mẫu hồ sơ (gốc hộp nổi) và "Thông tin lưu ý" (gốc vùng thay chỗ + hộp Nội dung) nay đều thay chỗ danh sách; nút Thêm mới đầu trang ẩn khi đang ở hai vùng đó.
  - → Làm như hiện tại: như trên.
- **[Kiểm trên host]** "Thêm mới" nhảy sang màn Tạo mới hồ sơ (`ums.app.openPath('/modules/hoso/html/hoso_taomoi.html')`, gốc initMain) — vai trò không có chức năng đó thì báo.
  - → Làm như hiện tại: như gốc.
- **[Kiểm trên host]** Chi tiết tài chính dùng `ums.ibd.taiChinh` (8 lời gọi TC_ThongTinChung/LayDSKhoan*, versionAPI v1.0) — tiêu đề mục là chữ thường (gốc nút "ẩn/hiện" không bấm được).
  - → Làm như hiện tại: như trên.

### apissinhvien/modules/hoso/hosotaomoi_cu
- **[Cần quyết]** Khung thông tin sinh viên (bấm dòng) không có nút lưu trong html gốc (btnSave, .ThemMoiSinhVien không tồn tại) → save_HS (SV_HoSo/ThemMoi|CapNhat) không có lối vào.
  - → Làm như hiện tại: khung CHỈ XEM (nhãn : giá trị), bỏ save_HS.
- **[Cần quyết]** Thẻ chương trình / lớp: gốc nạp MỌI chương trình / MỌI lớp thành thẻ lúc mở; ô Lớp bên trái nạp một lần, không theo CT.
  - → Làm như hiện tại: luật cha → con — thẻ CT hiện khi đã chọn Khoá, thẻ lớp khi đã chọn CT; mở bước thì điền sẵn Hệ/Khoá/CT theo sinh viên (ý định của viewForm_HS, điều kiện gốc viết ngược).
- **[Cần quyết]** "Lưu" khi chưa chọn thẻ: gốc gửi thẻ chọn của sinh viên trước (biến không đặt lại) hoặc rỗng.
  - → Làm như hiện tại: báo "Vui lòng chọn …"; đổi sinh viên xoá lựa chọn cũ.
- **[Kiểm trên host]** Ô "Số hộ chiếu" gốc đọc cột `HO` (không giống tên cột hộ chiếu); GanLopQuanLy gửi `strQLSV_TrangThaiNguoiHoc_Id` = trạng thái HIỆN CÓ (thường rỗng ở bước 2) như gốc.
  - → Làm như hiện tại: giữ nguyên như gốc.

### apissinhvien/modules/hoso/hoso_sua
- **[Cần quyết]** Bản gốc bỏ dở (tìm kiếm gọi `CM_NhanSu/LayDanhSach_RutGon` — danh sách CÁN BỘ; getList_LoaiKhoanThu không tồn tại; "Cập nhật" không lưu; viewForm đổ cột hồ sơ cán bộ).
  - → Làm như hiện tại: khung giải thích + nút "Mở màn Cập nhật hồ sơ"; đề nghị gỡ khỏi menu.

### apissinhvien/modules/hoso/hoso_in
- **[Cần quyết]** html và hosoin.js gốc đều rỗng.
  - → Làm như hiện tại: khung "chưa có nội dung"; đề nghị gỡ khỏi menu hoặc nghiệp vụ mô tả.

### apissinhvien/modules/hoso/quahan
- **[Kiểm trên host]** Báo cáo gửi `strNguoiHoc_ThanhPhan_Ids_0x` = ID DÒNG sinh viên đã đánh dấu (khối chép từ Tìm kiếm sinh viên, nơi ô đánh dấu là trường thông tin).
  - → Làm như hiện tại: giữ như gốc.
- **[Kiểm trên host]** N×M lời gọi `LayKQTienDoTheoPhanLoai` (mỗi SV × mỗi phân loại) như gốc; nay chạy 6 luồng, lỗi báo một lần.
  - → Làm như hiện tại.
- **[Cần quyết]** Ô Học kỳ có trên thanh lọc nhưng gốc không gửi đi đâu.
  - → Làm như hiện tại: giữ ô, không gửi. Mã chết bỏ: #btnDeleteQuaHan (gọi delete_HSSV không tồn tại).

### apissinhvien/modules/hoso/timkiemsinhvien
- **[Cần quyết]** Nút "Tìm kiếm" chỉ nạp lại danh sách trường thông tin (SV_TP_NguoiDung/LayDanhSach, không gửi ô lọc) — ô lọc chỉ dùng cho báo cáo / hàng đợi.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** "Tạo hàng đợi" khi chưa đánh dấu trường nào: gốc vẫn gửi.
  - → Làm như hiện tại: hỏi lại trước khi gửi.

### apissinhvien/modules/hoso/daqhht
- **[Kiểm trên host]** Dùng chung mã với `ApisCongCanBo/hoatdong/DaQHHT` — mọi điểm cần quyết của bản đó áp cho màn này.
  - → Làm như hiện tại.

### apissinhvien/modules/chinhsach/_chinhsach (chung sáu màn lưới)
- **[Cần quyết]** Ô Đối tượng lấy giá trị cột `ID` của LayDS_DoiTuong_CheDo (lọc lưới, báo cáo, kế thừa, "Nhập theo lớp" gửi `strQLSV_DoiTuong_Id` = ID này), còn ô lưới gửi `DOITUONG_ID`.
  - → Làm như hiện tại: giữ đúng gốc (hai cột khác nhau).
- **[Cần quyết]** Lọc (học kỳ, kiểu học, khoản thu, chế độ) chụp lại lúc bấm Tìm kiếm và dùng cho Lưu; gốc đọc lại ô lọc lúc Lưu.
  - → Làm như hiện tại: dùng giá trị lúc tìm (tránh ghi nhầm học kỳ).
- **[Cần quyết]** Chế độ → Đối tượng, Hệ → Khoá → CT → Lớp: khoá con khi chưa chọn cha (gốc nạp sẵn mọi tầng).
  - → Làm như hiện tại: theo luật cha → con.
- **[Kiểm trên host]** Mỗi ô lưới một lời gọi (N người học × M đối tượng) như gốc — trang "Tất cả" có thể rất nhiều lời gọi.
  - → Làm như hiện tại: hàng đợi 6 luồng, bỏ lượt cũ khi tìm lại.
- **[Kiểm trên host]** Bản chính sách (3 màn) dùng chung `LayDSSV_ChinhSach_PhanTram` và đọc cột HEDAOTAO/…/LOP_ID/CHUONGTRINH_ID/QLSV_NGUOIHOC_TRANGTHAI_ID (tên gốc).
  - → Làm như hiện tại: giữ nguyên tên cột gốc.

### apissinhvien/modules/chinhsach/chinhsachphantram
- **[Kiểm trên host]** "Xem" gửi `strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID` của dòng — danh sách bản chính sách có thể không trả cột này (gốc vậy).
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** "Xóa" dòng đã chọn gọi `Xoa_TaiChinh_DT_MienGiam` với strId = ID DÒNG người học (không phải ID bản ghi miễn giảm).
  - → Làm như hiện tại: giữ như gốc, có hỏi lại.
- **[Cần quyết]** Html gốc có HAI nút "Nhập theo lớp" trùng id.
  - → Làm như hiện tại: giữ một nút (đỏ như gốc).

### apissinhvien/modules/chinhsach/chinhsachsotien
- **[Cần quyết]** Báo cáo mount vào zonebtnBaoCao_CSST nhưng html chỉ có zonebtnBaoCao_CSQS_Import → mẫu Import không bao giờ hiện.
  - → Làm như hiện tại: chỉ nút Xuất báo cáo, như gốc.

### apissinhvien/modules/chinhsach/chinhsachdoituong
- **[Cần quyết]** Nút "Kế thừa" + hộp kế thừa có trong html nhưng .js không gắn xử lý.
  - → Làm như hiện tại: giữ nút, khoá (disabled).
- **[Cần quyết]** Lỗi gốc: nút Lưu "Nhập cho nhiều lớp" gắn thêm xử lý gọi SV_KetQua_ChinhSach/CapNhat cho MỌI dòng sinh viên (ghi rác).
  - → Làm như hiện tại: bỏ xử lý thừa, chỉ lưu theo lớp.
- **[Cần quyết]** Import tĩnh IMPORTWITHPROC_CSDT: gốc sẽ bị mẫu import theo quyền ghi đè nếu có.
  - → Làm như hiện tại: luôn hiện nút tĩnh, vùng báo cáo không vẽ Import.

### apissinhvien/modules/chinhsach/tonghopdoituong
- **[Cần quyết]** Lỗi gốc: "Gói hỗ trợ" chưa từng mở được (tra người học bằng QLSV_NGUOIHOC_ID trong cột ID → lỗi JS).
  - → Làm như hiện tại: tra đúng dòng, hộp chạy (đường GHI SV_KetQua_ChinhSach/CapNhat mới).
- **[Cần quyết]** Bản tổng hợp gốc không gửi dSoThang khi lưu, ô số tháng chỉ hiện.
  - → Làm như hiện tại: giữ như gốc.
- **[Kiểm trên host]** Kế thừa (KeThua_DoiTuong_Goi_Thang/_Ky) gửi cả tham số `type=POST` như gốc.
  - → Làm như hiện tại: giữ như gốc.

### apissinhvien/modules/chinhsach/tonghopphantram
- **[Kiểm trên host]** "Thống kê khai > 1 đối tượng": tên cột chưa chốt, gốc dò nhiều tên.
  - → Làm như hiện tại: giữ danh sách dò của gốc.
- **[Cần quyết]** Hai nút Import (theo quyền + tĩnh DCDTMG / XOATCMG) như gốc.
  - → Làm như hiện tại: giữ cả hai.

### apissinhvien/modules/chinhsach/tonghopsotien
- **[Kiểm trên host]** Import tĩnh IMPORTWITHPROC_XOATCSTM "Import xóa".
  - → Làm như hiện tại: giữ như gốc.

### apissinhvien/modules/chinhsach/chedochinhsach
- **[Cần quyết]** Biểu mẫu thay chỗ danh sách (gốc hộp thoại); cột Hiệu lực hiện Có/Không (gốc in 1/0).
  - → Làm như hiện tại: theo quy ước chung.

### apissinhvien/modules/chinhsach/goihotro
- **[Cần quyết]** Lỗi gốc: sửa chính sách–gói gửi strId = ID chi tiết gói đang nhớ (tạo trùng / sửa nhầm dòng).
  - → Làm như hiện tại: gửi ID dòng đang sửa.
- **[Cần quyết]** Lỗi gốc: ba nút Xóa (gói, chính sách–gói, chi tiết) luôn ẩn → chưa từng xoá được.
  - → Làm như hiện tại: hiện khi đang sửa (đường GHI xoá mới — SV_GoiHoTro/Xoa, SV_CS_DoiTuong/Xoa, SV_GoiHoTro_ChiTiet/Xoa).
- **[Cần quyết]** Lỗi gốc: thêm gói xong không nhớ Id → Lưu lần hai thêm trùng; lưu chi tiết xong bảng chi tiết không nạp lại.
  - → Làm như hiện tại: nhớ `data.Id`, chuyển sang Sửa + mở khối chi tiết; nạp lại bảng chi tiết.
- **[Cần quyết]** Ô "Ghi chú" của chính sách–gói hiện nhưng không gửi (save gốc thiếu strGhiChu).
  - → Làm như hiện tại: giữ như gốc.
- **[Kiểm trên host]** Chi tiết gói giữ hộp thoại (bản ghi con trong biểu mẫu gói); bỏ ảnh minh hoạ img-support.svg.
  - → Làm như hiện tại.

### apissinhvien/modules/kehoach/kehoach
- **[Cần quyết]** Nút "Xóa" ở danh sách kế hoạch của gốc gọi `SV_KeHoach_PhamVi/Xoa` với ID KẾ HOẠCH (xoá phạm vi, không xoá kế hoạch; vẫn báo "Xóa thành công"). Gốc không có lời gọi xoá kế hoạch nào.
  - → Làm như hiện tại: bỏ nút xoá kế hoạch (không đoán action). Có procedure xoá kế hoạch thì thêm `remove` vào crud.
- **[Cần quyết]** Khối "Cán bộ phân công xét": gốc cho chọn cán bộ nhưng lời gọi lưu / nạp (`TN_KeHoach_NhanSu/*`) đều bị chú thích → chọn xong không lưu.
  - → Làm như hiện tại: giữ khối (bảng trống), nút "Thêm cán bộ" disabled kèm lời giải thích.
- **[Cần quyết]** Lưu kế hoạch MỚI: gốc đứng lại biểu mẫu với ID rỗng → Lưu lần hai thêm trùng.
  - → Làm như hiện tại: lưu xong về danh sách (ums.crud), SV / khoá / CT / lớp mới lưu sau bằng ID máy chủ trả.
- **[Cần quyết]** Cột "Xác nhận thông tin" đọc `KETQUACHINHTHUC` (như gốc) trong khi lưu luôn gửi `dXacNhanThongTin` = 1.
  - → Làm như hiện tại: giữ cả hai như gốc.
- **[Kiểm trên host]** Phân quyền nhập thông tin: lưu xong nạp lại (gốc giữ id tạm → Lưu lần hai thêm trùng); ô trường thông tin không lọc bỏ trường đã chọn ở dòng khác (gốc có lọc khi thêm dòng).
  - → Làm như hiện tại.
- **[Kiểm trên host]** SV thêm từ hộp chọn (LayDSNguoiHoc) gửi `DAOTAO_TOCHUCCHUONGTRINH_ID` / `DAOTAO_LOPQUANLY_ID` / `DAOTAO_KHOADAOTAO_ID` của dòng hộp — kiểm hộp có đủ các cột này.
  - → Làm như hiện tại (tên cột chép gốc).

### apissinhvien/modules/kehoach/xacnhanketqua
- **[Kiểm trên host]** Danh sách gửi `strNamNhapHoc` / `strKhoaQuanLy_Id` theo ô lọc (gốc gửi rỗng — đọc txtAAAA / dropAAAA dù hai ô có trên màn).
  - → Làm như hiện tại (theo ý định).
- **[Kiểm trên host]** Báo cáo: callback gốc đọc id ô không tồn tại (chép từ màn Tài chính) → mọi khoá rỗng. Nay Hệ / Khoá / CT / Lớp / Khoa QL gửi giá trị ô; các khoá còn lại rỗng như gốc.
  - → Làm như hiện tại.
- **[Cần quyết]** Giá trị hiển thị: gốc bật cờ "thông tin xác minh" một lần rồi không tắt (đổi sang "Dữ liệu gốc" vẫn hiện THONGTINXACMINH_KQ).
  - → Làm như hiện tại: theo kế hoạch đang chọn (XACNHANTHONGTIN khác 0).
- **[Cần quyết]** Khối "Lịch sử xác nhận" của hộp duyệt không bao giờ được nạp (không có lời gọi).
  - → Làm như hiện tại: bỏ khối.
- **[Cần quyết]** Xuất Excel: gốc tải SheetJS từ CDN, ghi `.xlsx`.
  - → Làm như hiện tại: `ums.ui.xuatXls` (tệp `.xls`, không CDN), cùng luồng lấy dữ liệu / 6 luồng / hủy / đếm.
- **[Kiểm trên host]** Import trường thông tin: phiên import tự sinh, trả cho tham số THONGTIN5 có chữ `strPhien_Id`; `importChung` không gửi `strSheet` (gốc gửi rỗng do lỗi bộ chọn). Nếu THONGTIN5 dùng biểu thức khác, hộp sẽ báo thiếu tham số.
  - → Làm như hiện tại.
- **[Kiểm trên host]** Tải file: đường dẫn = `FILEMINHCHUNG` của `SV_Files/LayDanhSach` (gốc lấy thuộc tính name do viewFiles vẽ); không có tệp thì báo, không gửi mảng rỗng.
  - → Làm như hiện tại.

### apissinhvien/modules/quyetdinh/quyetdinh
- **[Cần quyết]** Lưu quyết định MỚI: gốc đứng lại biểu mẫu, ID rỗng → Lưu lần hai THÊM TRÙNG quyết định kèm SV, học phần.
  - → Làm như hiện tại: lưu xong về danh sách; tệp → SV mới → học phần mới gắn vào ID máy chủ trả.
- **[Kiểm trên host]** Học phần mới gửi `DAOTAO_HOCPHAN_ID` của dòng hộp tìm học phần (`LayDSKS_DaoTao_HocPhan`) như gốc — thiếu cột thì gửi rỗng.
  - → Làm như hiện tại.
- **[Kiểm trên host]** `strTrack_Id` = `TRACK_ID` của dòng hộp chọn SV (lời gọi mã hoá: không có cột thì không gửi — như gốc).
  - → Làm như hiện tại.
- **[Kiểm trên host]** Khối "Chọn trạng thái sinh viên" ở thanh lọc hiện nhưng KHÔNG gửi (`strTrangThaiNguoiHoc_Id` "" như gốc) — cả màn Thực thi.
  - → Làm như hiện tại.
- **[Cần quyết]** Vùng công nhận điểm: gốc chỉ nạp lại bảng khi CHỌN thêm học phần; bỏ bớt thì cột cũ còn.
  - → Làm như hiện tại: nạp lại cả khi bỏ.
- **[Kiểm trên host]** `LayKQCongNhanHocPhan` gửi `strDaoTao_HocPhan_Id` "" (gốc gọi thiếu đối số → rỗng); ô khớp theo `DAOTAO_HOCPHAN_ID` = `ID` học phần của `LayDSHocPhanTheoQuyetDinh`.
  - → Làm như hiện tại.
- **[Cần quyết]** Cơ sở công nhận điểm: gốc sửa trong hộp thoại; nay biểu mẫu thay chỗ danh sách (luật chung), đóng về vùng công nhận và nạp lại ô "Chọn cơ sở".
  - → Làm như hiện tại.
- **[Kiểm trên host]** Nút Import: có mẫu IMPORTWITHPROC thì dùng mẫu (report.mount), không có thì hiện hai mục cứng của html gốc (IMPORTWITHPROC_SVQD, IMPORTWITHPROC_QDHC) — đúng cách getList_MauImport ghi đè vùng `_Import`.
  - → Làm như hiện tại.

### apissinhvien/modules/quyetdinh/thucthiquyetdinh
- **[Cần quyết]** Ô "Loại quyết định" của biểu mẫu: gốc đổ hai nguồn đè nhau (danh mục QLSV.LQD và LayDSLoaiQuyetDinh — cái về sau thắng).
  - → Làm như hiện tại: LayDSLoaiQuyetDinh như màn Quyết định.
- **[Cần quyết]** Lưu thông tin quyết định (`SV_QuyetDinh/CapNhat`): gốc đứng lại biểu mẫu.
  - → Làm như hiện tại: về danh sách.
- **[Kiểm trên host]** Chuyển lớp: Lớp theo Khoá (chọn Khoá) hoặc theo CT (chọn CT, khoá rỗng), không gửi Hệ — đúng tham số gốc; khối chuyển lớp không còn đổ lại ô lọc tìm kiếm (lỗi dùng chung renderPlace của gốc).
  - → Làm như hiện tại.
- **[Kiểm trên host]** "Thực thi theo danh sách" chạy lại cả dòng ĐÃ thực thi được chọn (như gốc ghi chú "cho phép chạy lại").
  - → Làm như hiện tại.
- **[Cần quyết]** Khối "Chuyển chương trình học" và "Chuyển trạng thái" đã bị chú thích ẩn trong html gốc ("quy hết về Chuyển lớp").
  - → Làm như hiện tại: không chuyển hai khối (mã gốc còn để mở lại).

### apissinhvien/modules/tinhtrangquanso/tinhtrangquanso
- **[Cần quyết]** Bảng cây cấu trúc: gốc để colspan 1 cho nút GỐC không con (lệch cột); tổng dòng / cột tính một lần khi mọi lời gọi xong.
  - → Làm như hiện tại: ô lá phủ hết cột cây; tổng tính lại mỗi khi có số; tìm lại thì bỏ lượt cũ; hàng đợi 6 luồng.
- **[Kiểm trên host]** Chế độ "theo đăng ký-chuyên cần": ô khớp theo `ID` trả về của `LayDSQuanSoTheoKy` (= ID kỳ) như gốc.
  - → Làm như hiện tại.
- **[Kiểm trên host]** Không có mẫu báo cáo thì hiện mục cứng "1. Bảng quân số" (`BangQuanSo`) → `ums.report.run` với đúng cặp khoá của callback gốc.
  - → Làm như hiện tại.

### apissinhvien/modules/thutuchanhchinh/giayto
- **[Cần quyết]** Ngày làm việc: nút "Sửa" gốc hỏng (đọc dòng từ mảng danh mục chung) và không có thủ tục sửa (lưu luôn ThemMoi → thêm trùng).
  - → Làm như hiện tại: bỏ nút Sửa; đổi ngày = xoá rồi thêm; bỏ ô "Danh mục" không nạp/không gửi của hộp gốc.
- **[Cần quyết]** Biểu mẫu danh mục chung gốc không có ô Mô tả (save đọc nhầm ô Mô tả của hộp Phí, cùng id) trong khi bảng có cột Mô tả.
  - → Làm như hiện tại: thêm ô "Mô tả" vào biểu mẫu danh mục (đúng ý định).
- **[Kiểm trên host]** Trường cần khai: gốc gửi `strTruongThongTin_Id = "undefined<ID>"` (replace thiếu đối số) — chưa từng lưu đúng.
  - → Làm như hiện tại: gửi đúng ID trường; thêm/xoá theo phần chênh lệch sau khi lưu danh mục.
- **[Kiểm trên host]** Phân công — ô Cán bộ chọn nhiều: gốc gửi thẳng giá trị ô (mảng).
  - → Làm như hiện tại: nối dấu phẩy vào `strNguoiDung_Id`.
- **[Cần quyết]** Phân công — Sửa: gốc chỉ đổ id phạm vi vào ô Lớp (ô trên trống, ô Lớp chưa nạp → không hiện gì).
  - → Làm như hiện tại: hiện "Phạm vi hiện tại"; không chọn lại Hệ/Khoá/CT/Lớp thì giữ phạm vi cũ khi lưu. Đơn vị → Cán bộ không khoá (đơn vị trống = mọi cán bộ, như gốc).
- **[Kiểm trên host]** Lưới "Người dùng × Trạng thái" (SV_MotCua_TT_NguoiDung) là cấu hình CHUNG, gốc gửi `strQLSV_KeHoach_NguoiHoc_Id` = biến không tồn tại; CapNhat gốc không gửi strId.
  - → Làm như hiện tại: giữ lưới dưới bảng phân công, `strQLSV_KeHoach_NguoiHoc_Id` rỗng; CapNhat gửi strId của dòng (sửa lỗi).
- **[Kiểm trên host]** Cột Hiệu lực gốc in số thô.
  - → Làm như hiện tại: 0 → Không, còn lại → Có.

### apissinhvien/modules/thutuchanhchinh/yeucau
- **[Kiểm trên host]** "Đường dẫn mẫu": gốc biến CÙNG một ô thành ô tải tệp (uploadFiles) và đọc giá trị của nó làm `strDuongDanMauDon`.
  - → Làm như hiện tại: tách ô chữ "Đường dẫn mẫu" (gửi strDuongDanMauDon) + khung tệp SV_Files gắn vào id loại yêu cầu.
- **[Kiểm trên host]** Ảnh minh hoạ gửi đường dẫn tạm (unsave_…) như gốc, không gọi copyfile.
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Thêm / sửa cấu trúc: gốc là hộp modal.
  - → Làm như hiện tại: biểu mẫu một cột thay chỗ danh sách (luật chung BO-CUC 1); chưa chọn Yêu cầu thì khung Thông tin yêu cầu khoá.

### apissinhvien/modules/thutuchanhchinh/canboxuly
- **[Kiểm trên host]** Khung trao đổi ("Tình trạng hiện tại") gốc CHƯA TỪNG hiện (#zoneChat không có trong html → TypeError).
  - → Làm như hiện tại: mở hộp trao đổi bằng ums.ttc.binhLuan (LayDS/Them/Xoa_MotCua_NH_YC_XL_PhanHoi), đường GHI mới.
- **[Kiểm trên host]** Hộp Lịch sử: cột ngày gửi gốc đọc `NGAYTAO_DD_MM_YYY` (thiếu Y).
  - → Làm như hiện tại: đọc cả hai tên cột.
- **[Kiểm trên host]** Cột "File": LayDSDanhMucMoRong trả đường dẫn ở `Id` → mở `rootPathUpload/<Id>`.
  - → Làm như hiện tại: `ums.files.url(Id)` mở tab mới; không có Id thì báo "Không có tệp".
- **[Cần quyết]** Bộ lọc Hệ/Khoá/CT/Lớp gốc nhãn "Tất cả …" (lọc tuỳ chọn), bản KHÔNG lọc quyền.
  - → Làm như hiện tại: ums.ref.cascade (khoá tầng dưới tới khi chọn tầng trên), giữ nhãn "Tất cả …". Hộp Xử lý bắt chọn tình trạng.

### apissinhvien/modules/vexe/xebus
- **[Kiểm trên host]** "Chi tiết" kết quả đăng ký gốc CHƯA TỪNG hiện (ReferenceError); thead có "Điện thoại" nhưng không cột nào đổ; hai cột Tuyến/Tháng đã đăng ký luôn trống.
  - → Làm như hiện tại: hộp thoại bảng LayDSKeHoach_XeBus_DangKy, Điện thoại = DIENTHOAILIENHE, hai cột Tuyến/Tháng để trống.
- **[Kiểm trên host]** Them_QLSV_XeBus_TuyenXe gốc không gửi id kế hoạch (tuyến mới có thể không hiện lại trong kế hoạch).
  - → Làm như hiện tại: giữ như gốc.
- **[Cần quyết]** Tháng áp dụng: dòng đã lưu sửa trên màn không được gửi (gốc chỉ gửi dòng mới); nút "Xóa" chung của khối không có xử lý.
  - → Làm như hiện tại: giữ như gốc; bỏ nút Xóa chung (mỗi dòng có nút xoá). Lưu tuần tự: kế hoạch → phạm vi → tháng → tuyến.
- **[Kiểm trên host]** Bảng danh sách gốc lệch cột Hiệu lực so với tiêu đề.
  - → Làm như hiện tại: xếp theo tiêu đề (Tên, Hiệu lực, Ngày BĐ, Ngày KT).

### apissinhvien/modules/vexe/vethang
- **[Kiểm trên host]** Loại vé gửi `dThang` và `strThang` cùng một ô; thủ tục xoá mức phí tên `Xoa_Sua_KeHoach_DichVu_Phi`.
  - → Làm như hiện tại: chép nguyên.
- **[Cần quyết]** Loại vé / Mức phí: dòng đã lưu luôn gửi Sua_ khi lưu kế hoạch (cả khi không đổi) — như gốc.
  - → Làm như hiện tại: giữ như gốc.

### apissinhvien/modules/dicvusinhvien/nguoihocxacnhanthanhtoan
- **[Kiểm trên host]** `strNguoiThuVai_Id` (tên gốc thiếu "c") không được api.js tự điền.
  - → Làm như hiện tại: gửi tường minh = `ums.state.thuVaiId` (ID cán bộ đang thủ vai).
- **[Cần quyết]** Gốc nạp danh sách Hành động cả khi Loại xác nhận trống.
  - → Làm như hiện tại: Loại → Hành động là cặp cha → con (khoá tới khi chọn loại); một mục thì chọn sẵn như gốc.

### apissinhvien/modules/hoctructuyen/thongtindayhoc
- **[Cần quyết]** Học phần lọc theo cả Thời gian và Giảng viên (nhiều cha).
  - → Làm như hiện tại: chỉ khoá theo Thời gian; đổi/xoá Giảng viên thì xoá trắng và nạp lại Học phần. Nút "Chi tiết" dùng biểu tượng xem (gốc là bút Sửa).

### apissinhvien/modules/hoctructuyen/giangviendayhoc
- **[Kiểm trên host]** "Xác nhận vào lớp" (SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_Lich_GV_2) gốc gọi start_Progress khi chưa dựng thanh tiến độ.
  - → Làm như hiện tại: hỏi lại → gọi → nạp lại bảng ngày.
- **[Cần quyết]** Lưu không có dòng đổi: gốc bật thông báo rỗng.
  - → Làm như hiện tại: báo "Không có thay đổi"; chỉ gửi dòng có ô đổi (như gốc).

### apissinhvien/modules/dashboard/dashboard
- **[Cần quyết]** Trang mẫu tĩnh; biểu đồ gốc `labels: []` nên không vẽ điểm nào.
  - → Làm như hiện tại: giữ số liệu viết cứng; đánh nhãn trục 1, 2, 3 để thấy điểm; đầu trang ghi "Trang mẫu — số liệu dựng thử".


## Chốt ngày 2026-09-27 — Kế hoạch chương trình (tự chốt khi chuyển, chưa kiểm trên host)

### apiskehoachchuongtrinh/modules/chuongtrinhhocphan/cthp

- **[Cần quyết]** "Xem CTDT" thiếu lớp `btnViewCT` nên gốc mở vùng soạn. → Mở vùng xem.
- **[Cần quyết]** Ô "Học kỳ dự kiến" không có trình xử lý. → Đổi ô là tải lại.
- **[Cần quyết]** Lưu khối bắt buộc / tự chọn / học phần của chương trình không gắn id → lưu lần hai thêm trùng. → Lưu xong nạp lại, lần sau thành Cập nhật.
- **[Cần quyết]** Định hướng thêm mới không nhớ id → lưu lần hai trùng. → Nhớ id.
- **[Cần quyết]** Xoá người học của định hướng gọi `getList_SinhVien` không tồn tại. → Nạp lại đúng bảng.
- **[Cần quyết]** "Bỏ Chọn" học phần đã lưu xoá không hỏi. → Hỏi lại.
- **[Cần quyết]** "Tìm theo chương trình" gửi rỗng khi chưa chọn chương trình. → Bắt chọn chương trình.
- **[Kiểm trên host]** Số tín khi thêm học phần "theo chương trình": gốc tra nhầm trong kết quả "từ danh mục", không thấy thì gửi 0. → Gửi số tín học tập / học phí / tính điểm của chính dòng.
- **[Cần quyết]** Phân bổ học phần lưu cả dòng trống. → Chỉ lưu dòng đã chọn loại phân bổ.
- **[Cần quyết]** Kế thừa quan hệ báo "chọn đối tượng" mà vẫn mở hộp; hộp Kế thừa học phần hỏi xong mới kiểm dòng. → Kiểm trước, không mở.
- **[Cần quyết]** Xoá nhiều học phần. → `ui.batch` tuần tự, tải lại một lần.
- **[Cần quyết]** Mã / Tên học phần ở biểu mẫu sửa là ô nhập nhưng không gửi. → Chỉ đọc.
- **[Cần quyết]** Tên / Mã định hướng mang (*) nhưng gốc không kiểm. → Bắt nhập.
- **[Cần quyết]** Nút "Lưu" hộp Khối kiến thức trùng id, không có xử lý. → Giữ nút, khoá. Ảnh trang trí `img-edu-05.png` bỏ.
- **[Cần quyết]** Import: 4 mục cứng (`IMPORTWITHPROC_HPCT/_KCT/_KKTDH/_HPTD`) qua `importChung`; vai trò có mẫu import phân quyền thì ẩn mục cứng (như gốc).
- **[Kiểm trên host]** Lọc hộp Kế thừa quan hệ dùng bản KHÔNG lọc quyền (`bKoCheckQuyen`); kỳ của hộp Kế thừa lấy theo chương trình ĐÍCH — như gốc.
- **[Kiểm trên host]** Đường GHI: `KeThua_DaoTao_HocPhan_CT`, Kế thừa quan hệ, "Ánh xạ theo thứ tự kỳ", học phần thay thế (`pkg_kehoach_thongtin2`); `Them/Sua_DaoTao_KhoiBatBuoc` không gửi iM (như gốc).

### apiskehoachchuongtrinh/modules/tochucchuongtrinh/dinhhuong

- **[Kiểm trên host]** Gốc CHƯA TỪNG CHẠY: html nạp `modules/tuyensinh/script/dinhhuong.js` (404), `.js` trong thư mục là bản chép dở Kế hoạch tuyển sinh (`TS_DinhHuong/*`), Thêm mới không gắn. → Dựng lại trên khung `hoatdong/dinhhuong` (`KHCT_ThongTin …DaoTao_CT_DinhHuong`), có Thêm mới; bỏ phần tuyển sinh và "Gắn khối kiến thức / học phần" (không có API). Đường GHI mới.

### apiskehoachchuongtrinh/modules/hoatdong/dinhhuong

- **[Cần quyết]** Ô từ khoá đọc `txtAAAA` nên không bao giờ gửi. → Gửi `strTuKhoa`.
- **[Cần quyết]** Lưu / Xoá định hướng không nạp lại, ở lại biểu mẫu. → Về danh sách, nạp lại.
- **[Cần quyết]** Hộp Nhóm lưu xong vẫn mở với id rỗng → lưu lần hai trùng. → Đóng hộp, nạp lại nhóm.
- **[Cần quyết]** Đóng "Sinh viên thuộc nhóm" nhảy thẳng về danh sách định hướng. → Về "Chia nhóm định hướng", nạp lại (cột Số SV cập nhật).
- **[Cần quyết]** Mã chết (`getList_KhoanThu`, `getList_DoiTac`, "Thêm thành viên" đã chú thích, `Them_XLHV_DSKhongXuLy_PhamVi` bị ghi đè). → Bỏ. Lời gọi `KHCT_ThongTin/…` kiểu cũ chép nguyên.

### apiskehoachchuongtrinh/modules/hoatdong/dukienhocphan

- **[Cần quyết]** Html gốc không có ô Năm / KH năm / KH chi tiết mà gửi `strKH_Nam_ChiTiet_Id` (luôn rỗng → thêm học phần vào kế hoạch rỗng). → Thêm ba ô như `molop`, bắt chọn KH chi tiết trước khi Thêm.
- **[Cần quyết]** Tiêu đề thiếu 4 cột thân bảng có. → Thêm "Khoa đề xuất tăng/giảm", "Duyệt tăng/giảm khoa đề xuất", "Khoa xác nhận", "Đào tạo xác nhận".
- **[Cần quyết]** Danh sách dự kiến gửi thời gian rỗng (`dropAAAA`), thêm gửi thời gian của ô lọc chính. → Giữ như gốc.
- **[Cần quyết]** Lưu ở khung "theo CTDT" nạp lại danh sách "theo đơn vị"; Đóng / Duyệt không nạp lại. → Nạp đúng danh sách.
- **[Cần quyết]** Bỏ phần không có lối vào: Xác nhận, Duyệt tăng/giảm, mẫu báo cáo, hộp rỗng. Ô tăng/giảm phải số nguyên (âm được); ô `HESO3 = 1` không có ô nhập.

### apiskehoachchuongtrinh/modules/hoatdong/hocphan

- **[Kiểm trên host]** Xác nhận chưa từng lưu (đọc `#tblXacNhan`, `#txtNoiDungXacNhan` không tồn tại). → Dùng dòng đánh dấu + ô Nội dung; `strDuLieuXacNhan` = `DAOTAO_HOCPHAN_ID` (gốc `ID`); bắt chọn Phân loại lớp. Đường GHI mới.
- **[Cần quyết]** "Số tiết phân bổ" có mã lưu nhưng không nút; Xoá học phần không nút. → Chỉ xem / bỏ.
- **[Cần quyết]** Enter ô tìm thứ hai gọi hàm không tồn tại. → Lọc theo chương trình. Lưu quy mô nạp lại đúng kiểu danh sách đang xem; đổi Phân loại lớp vẽ lại ngay.

### apiskehoachchuongtrinh/modules/hoatdong/molop

- **[Kiểm trên host]** Cột thao tác chưa từng hiện (ReferenceError `strDaoTao_HocPhan_Id`, so `=` thay `==`). → Sửa.
- **[Cần quyết]** Mỗi lần nạp quy mô gọi `start_Progress` nạp lại cả danh sách. → Bỏ.
- **[Cần quyết]** Lịch sử xác nhận gửi `DAOTAO_HOCPHAN_ID` (gốc ID dòng), pageSize 100000 (gốc 10); bắt chọn Phân loại lớp. "Tính lớp mở theo quy mô" / "Lấy quy mô từ CSDL Học phần" giữ hỏi lại, chạy xong nạp lại; thời gian gửi rỗng (ô bị chú thích ở gốc). Mẫu báo cáo gửi `strDaoTao_ThoiGianDaoTao_Id` = ID năm (như gốc). Mỗi ô một lời gọi, nay qua hàng đợi 6 luồng.

### apiskehoachchuongtrinh/modules/hoatdongchung/kehoach

- **[Cần quyết]** Ô từ khoá không gửi đi (`LayDSKH_Nam_TongHop` chỉ nhận strNam). → Lọc tại chỗ.
- **[Cần quyết]** Cột "Khóa dữ liệu" đọc nhầm `HIEULUC`. → Đọc `KHOADULIEU` (cả `kehoachchitiet`).
- **[Cần quyết]** Lưu mới không nhớ ID → lưu lần hai trùng (cả dòng Thời gian). → Nhớ ID, đổi sang Sửa, nạp lại Thời gian.
- **[Cần quyết]** Dòng Thời gian đã lưu không có lời gọi sửa. → Khoá; muốn đổi thì xoá rồi thêm lại.
- **[Cần quyết]** Ô Năm biểu mẫu đổ `NAM` vào ô giá trị ID. → Khớp theo chữ. Bỏ cột ô đánh dấu (không nút dùng), hộp Xác nhận bị ẩn và vùng báo cáo trống.
- **[Kiểm trên host]** `Them_KH_Nam_ThoiGian` ngay sau thêm kế hoạch mới dùng `data.Id` máy chủ trả.

### apiskehoachchuongtrinh/modules/hoatdongchung/kehoachchitiet

- **[Cần quyết]** Thêm mới khi chưa chọn Kế hoạch năm gửi rỗng. → Chặn, nhắc chọn. Lưu mới nhớ ID.
- **[Kiểm trên host]** Khi Sửa, `strNam` vẫn lấy ô Năm ở thanh lọc (như gốc).
- **[Cần quyết]** Ba nút Xóa/Thêm/Lưu khung Học phần đề xuất trùng id, chưa từng chạy. → Giữ, khoá. `LayDSKH_HocPhan_DuKien/DeXuat` đọc `txtAAAA` → gửi rỗng mọi lọc.

### apiskehoachchuongtrinh/modules/thietlapcaclophocphan/thietlapcaclophocphan

- **[Cần quyết]** Nút Tìm kiếm chưa từng chạy (`.btnSearch` ↔ `#btnSearch`). → Nạp lại danh sách. Hai cặp nút trên/dưới gộp một cặp đầu khung.
- **[Cần quyết]** Cập nhật báo "thành công" bằng setTimeout trước khi lời gọi xong. → `ui.batch` rồi nạp lại.
- **[Cần quyết]** Cập nhật khi chưa chọn Phân loại / Phạm vi gửi rỗng. → Giữ, hỏi lại rõ là sẽ xoá trắng.
- **[Kiểm trên host]** `Sua_ThongTinLopHocPhan`, `Sua_PhamViLopHocPhan`; `LayDSLopHocPhan` trả mảng hay `.rs`.

### apiskehoachchuongtrinh/modules/lophoc/lophoc

- **[Kiểm trên host]** `strDaoTao_CoSoDaoTao_Id` khai hai lần, lần sau đọc `dropAAAA` → lọc Cơ sở chưa từng có tác dụng. → Gửi giá trị ô Cơ sở.
- **[Cần quyết]** Nút Xóa gắn hai trình xử lý (một không hỏi, một gửi "One&lt;ID&gt;") — cả `covanlop`. → Hỏi một lần, MỘT lời gọi `Xoa` `strIds` nối phẩy.
- **[Cần quyết]** "Lớp mở ngành 1/2" không có mục trống → luôn gửi 0/1. Phân nhóm: kiểm dòng đánh dấu trước khi mở hộp; nhóm trống vẫn gửi. Thêm điền sẵn từ ô lọc; bỏ ảnh trang trí.

### apiskehoachchuongtrinh/modules/lophoc/covanlop

- **[Cần quyết]** Gốc nạp TOÀN BỘ cán bộ vào hai ô Giảng viên khi mở màn. → Nạp sau khi chọn Bộ môn (Bộ môn → Giảng viên khoá); Hệ → Khóa → CT → Lớp khoá. Bộ môn trong biểu mẫu chỉ để lọc, không gửi (như gốc).

### apiskehoachchuongtrinh/modules/lophoc/quanlytoanbo

- **[Kiểm trên host]** Chuyển lớp: gốc cho chuyển sang lớp rỗng, `#btnYes` gắn mỗi lần bấm. → Bắt chọn lớp, hỏi một lần. Đường GHI vào quyết định SV thật (`ThucThi_ChuyenLop_TrucTiep`).
- **[Cần quyết]** Bỏ `save_ChuyenNguyenVong` (không nút gọi, đọc ô không có).

### apiskehoachchuongtrinh/modules/noidungdaotao/*

- **[Cần quyết]** Cả 6 màn: chỉ nút Sửa trên dòng + ô đánh dấu xoá nhiều (một lời gọi `strIds`) như gốc; thêm xong về danh sách ("Lưu và Nhập tiếp" để nhập tiếp).
- **[Cần quyết]** `hocphan`: ô Bộ môn nạp hai nguồn đè nhau → chỉ cơ cấu tổ chức; ô Môn học biểu mẫu nạp mọi môn; lưới phân bổ chỉ lưu dòng có loại; "Import ▾" → một nút `importChung('Học phần','IMPORTWITHPROC_HP')`.
- **[Kiểm trên host]** `hocphantuongduong`: Sửa gọi `Them_…` kèm strId (gán nhầm `me.action`) → gọi `Sua_DaoTao_HocPhanTuongDuong`. Đường GHI mới.
- **[Kiểm trên host]** `quanhehocphan`: id ô Học phần gốc là cột `ID` (dòng CT–HP), Sửa đổ `DAOTAO_HOCPHAN_ID` → không khớp. → Dùng `DAOTAO_HOCPHAN_ID` (ĐỔI giá trị gửi).
- **[Cần quyết]** `baihoc`, `decuonghoctap`: ô Học phần gửi `strThuocBoMon_Id` = id CT (nhầm) → gửi `''`; `baihoc` xoá gọi `Xoa` N lần cùng chuỗi → một lần.

### apiskehoachchuongtrinh/modules/tochucchuongtrinh/*

- **[Kiểm trên host]** `chuongtrinh`: `strPhanLoai_N_CN`, `strDaoTao_ToChucCT_Cha_Id` đọc ô không có → Sửa xoá mất giá trị. → Sửa gửi lại giá trị đang có của bản ghi.
- **[Cần quyết]** `chuongtrinh`: gốc không tải danh sách khi mở → tải sẵn; Khóa biểu mẫu liệt kê mọi khoá; bỏ nút "Danh mục dữ liệu" (ẩn sẵn); Kế thừa qua `ui.batch`.
- **[Cần quyết]** `thoigiandaotao`: Sửa không đổ ô Tháng → Lưu xoá trắng Tháng. → Đổ `THANG`. `namhoc`: Tìm kiếm gọi `getList_NamHoc()()` lỗi → chỉ tải lại.
- **[Kiểm trên host]** `namhoc`, `thoigiandaotao`: xoá gửi `strId` mang nhiều id nối phẩy (như gốc).
- **[Cần quyết]** 6 màn: thêm mới điền sẵn từ ô lọc; không đánh dấu bắt buộc; `LayChiTiet` có Message vẫn đổ biểu mẫu. `khoahoc` `strDaoTao_CoSoDaoTao_Id` luôn rỗng, `noidungchuongtrinh` cột "Tên chương trình" hiện mã — như gốc.

### apiskehoachchuongtrinh/modules/phanlichgiang/*

- **[Cần quyết]** `quantri_phanlichgiang`: dùng giao diện CCB (`ums.plg`, cờ `dToanBo 1`, `ngoaiTruong -1`, bỏ cột Số tiết bài học).
- **[Cần quyết]** `phanquyen`: gốc cho Tìm kiếm / Phân quyền khi chưa chọn chức năng hoặc quyền, `#btnYes` gửi đôi. → Chặn, hỏi một lần.
- **[Cần quyết]** `dulieuthucdia`: hai nút tìm cột trái → ô "Cách tìm" trong Bộ lọc nâng cao; từ khoá học phần không gửi làm strTuKhoa cán bộ; Lưu cả loạt rồi nạp lại (gốc lưu lần hai trùng); kiểm trùng theo `NHANSU_HOSOCANBO_ID`; chế độ không theo lịch giảng lưu với thời gian rỗng như gốc.
- **[Kiểm trên host]** `dulieuthucdia` Import `IMPORTWITHPROC_DLTD` qua `importChung` (gốc bản V2).

## Chốt ngày 2026-09-27 — chuyển thay đổi sau lần kéo mã gốc (merge 86a41b08)

- **KHCT `chuongtrinhhocphan/cthp` — hộp "Phạm vi áp dụng" (gốc mới thêm):** tiêu đề hộp ở gốc là chữ mẫu ("Tiêu đề - hiện thông tin
  quan hệ tương đương - Môn gốc … - Môn tương đương (Môn chọn)") → làm theo ý định: ghi thật "Môn gốc: <mã - tên học phần đang sửa> ·
  Môn tương đương/thay thế: <tên>". Hai bảng chưa gán / đã gán đặt CẠNH NHAU như gốc; Huỷ phạm vi hỏi lại như gốc. Tên cột người học
  chưa rõ → dò như gốc (QLSV_NGUOIHOC_* / MASO / HOTEN / LOP…). ĐƯỜNG GHI MỚI — thử trên host.
- **KHCT `cthp` — phân bổ học phần:** thêm cột Số tín chỉ (`dSoTin`), lưu / xoá đổi sang `pkg_kehoach_thongtin.Them_/Sua_/Xoa_DaoTao_HocPhan_CT_PhanBo`
  như gốc; danh sách vẫn `KHCT_HocPhan_TietHoc/LayDanhSach` (gốc không đổi). Hai bảng tương đương / thay thế thêm cột Số tín chỉ.
- **SV `hoso` (_hsA) — lưu Thông tin hoá đơn:** thử lại cả hai kiểu mã vẫn bị từ chối → báo rõ mục đang chọn ở "Đối tượng xuất hoá đơn"
  và gợi ý CA_NHAN / TO_CHUC (chép câu báo của gốc).
- Không chuyển (phân hệ chưa sang _v2): Tuyển sinh `kehoachtuyensinhnew`, Thi phách `phanquyenlophocphan` (sửa action Huỷ tạo dữ liệu
  nhập điểm), Tốt nghiệp `quanlysovaso` (màn mới), `index.aspx` (vỏ cũ).

## Chốt ngày 2026-09-27 — Nhập học (ApisNhapHoc, 31 màn, 8 tác tử con)

Mỗi nhóm: tệp — kết quả kiểm — điểm tự chốt — lỗi gốc đã sửa — việc dữ liệu / cần kiểm trên host (việc dữ liệu rõ ràng đã vào can-quyet.js).

## Nhóm C (checkinnhaphoc, hethong/dongbodulieu, tracuuphieuthu, tracuuphieurut) — 4/4, 4/4, 1/1
Tự chốt:
- checkinnhaphoc: khối "Tài chính" ẩn (display:none) KHÔNG chuyển (không gọi LayDSCacKhoanNhapHoc, NhapHoc_ThuTien, SuaPhieuThu, HuyPhieuNhapHoc, TC_HoaDon…).
- checkinnhaphoc: không tự chọn khi còn một người (luật cột trái); "Tổng đã thu" chỉ hiện khi đã chọn; "Tiếp nhận" khoá khi chưa chọn thí sinh/kế hoạch; sau tiếp nhận điền Mã tiếp nhận + Thời gian, đóng hộp tải lại giữ người chọn; Xuất báo cáo/Import lên đầu trang, strPhieuThu_Id gửi rỗng.
- tracuuphieuthu: bỏ chọn kế hoạch cũng nạp lại nhân sự (gộp trùng); ô nhân sự không khoá (lọc tuỳ chọn); nút Tải lại chạy được; bỏ ảnh bien-lai.png; không dùng khung ums.tcTraCuu (khác nhiều) — dựng bằng pat.cards.
- dongbodulieu: "Lịch sử đồng bộ" bảng rỗng tĩnh như gốc; nút Thực hiện lên đầu khung.
- tracuuphieurut: gốc rỗng → khung "chưa có nội dung".
Lỗi gốc sửa: dongbodulieu gắn chồng trình xử lý nút Có (gọi nhiều lần); tracuuphieuthu thẻ rỗng "Số: #"; checkin hai ô không bao giờ điền.
Việc dữ liệu: checkinnhaphoc QR VietQR cứng 970418 / JIzXIaG / "TRUONG DAI HOC CMC", mã vạch barcode.tec-it.com — xác nhận tài khoản trường; tracuuphieuthu ô nhân sự trống → mặc định chỉ thấy phiếu mình thu (như gốc) — nghiệp vụ xác nhận.

## Nhóm A (taichinh/khaimucphinhaphoc) — 1/1, 1/1 (không bấm được gì do phải chọn kế hoạch + nút "Thêm nhóm"), 0/0; trang dò 17/17 bước
Tự chốt:
- Ba hộp cấu hình (khoản thu / ngành đầu ra / đầu vào) giữ hộp lớn như DKH kehoachmua; biểu mẫu khoản thu thay chỗ bảng trong hộp (không chồng hộp).
- "Mức phí đã gán", "Danh sách nhập học & thu tiền" giữ hộp lớn như gốc.
- Ô Từ khoá lọc danh sách KẾ HOẠCH (400 ms) như gốc, không lọc bảng nhóm.
- Nút "Tải lại" đầu trang gộp vào ↻ của bảng (tải cả kế hoạch + nhóm).
- Nút "Sửa" cạnh Tổng phí phải nộp (hộp chỉ xem) → "Chi tiết" + fa-eye.
- "Thêm mới người học" (gốc chỉ báo sẽ làm) → nút khoá kèm gợi ý.
- Ctrl+G Xuất Excel gắn lên hộp; dùng ui.xuatXls thay SheetJS CDN.
- Tạo mức phí: ui.batch tuần tự, nhật ký ở hộp kết quả cuối.
- Chọn tất cả bảng ngành đã cấu hình = trang đang xem; hộp chọn ngành để thêm chọn mọi trang như gốc.
- Chọn kế hoạch tự tải nhóm; không tự chọn kế hoạch trừ sessionStorage KHTSN_preselect_KHNH_Id (bắt tay Kế hoạch tuyển sinh new).
- Hai danh sách thí sinh lọc / chia trang tại máy như gốc; dòng tổng ở chân bảng (gốc ở đầu).
Bỏ: modal showModal_Xem không nơi gọi; nhánh _genFrom_MucPhiDaGan (mã chết); vá z-index / cuộn giả / log.
Việc dữ liệu (host): tên cột LayDSMucPhiDaGanNhapHoc / LayDSThiSinhNhapHoc / LayDS_PhaiNop_TheoIntake chưa xác nhận (giữ danh sách dò như gốc).

## Nhóm B (taichinh/taichinhnew + taichinh bản cũ) — 2/2, 2/2, 2/2; dò trọn luồng 0 lỗi; phôi thật DHTL_PHIEUTHU_NHAPHOC_2018, Edit_DHCNTTTN_HOADON_2018
Khung chung ums.nhThu.man(root, { cu }) (_thu_chung.js); bản cũ khác 5 lời gọi kiểu cũ NH_* / SV_CORE_*. Không dùng _chung_thutien Tài chính (nghiệp vụ khác).
Tự chốt:
- Đổi kế hoạch/điều kiện: đóng khung phải, tải lại danh sách (gốc giữ khung đang mở).
- Thu tiền xong: KHÔNG xoá ô tìm (gốc xoá chữ mà không tải lại → lệch).
- Kế hoạch nhập học chọn sẵn mục đầu như gốc, không cho xoá trắng; Bộ lọc nâng cao mở sẵn.
- Chọn liên hoá đơn chỉ khi xem HĐĐT đã lưu (phôi nháp một liên).
- Xem phiếu dưới khung Hồ sơ/Tài chính như gốc; ẩn nút Thu tiền khi đang mở phiếu.
- Bản cũ xuất hoá đơn khi phiếu không có khoản: giữ như gốc (không mở khung); bản mới mở kèm thông báo.
Lỗi gốc sửa: HĐ giấy không giữ id trả về → Huỷ/In gửi id rỗng; Huỷ HĐ gọi hàm không tồn tại (TypeError); Huỷ phiếu không nạp lại; popover người học gắn lớp không tồn tại (không chép).
Việc dữ liệu: strHinhThucThu_Id của HĐ giấy gửi rỗng như gốc (ô không có trên phôi).

## Nhóm H (quydinh 2, thongke 5, baocaothongke 2) — 9/9, 9/9 (quydinh "~" vì nút "Tạo mới"), 0/0; dò riêng đủ 9 màn
Khung: quydinh/_chung.js ums.nhQD; thongke/_chung.js ums.nhTk, _mau.js ums.nhMau (trang mẫu); baocaothongke/_chung.js ums.nhBc.man (nạp chéo thongke/_chung.js).
Màn mẫu: loaikhoan, nguoithu = HTML tĩnh số liệu cứng → trang mẫu có nhãn "Trang mẫu — số liệu dựng thử", nút Chi tiết khoá; ngaythu = trang trống → "chưa có nội dung".
Tự chốt:
- sinhviennhaphoc: strTuKhoa gửi ô từ khoá (gốc gửi nhầm ô Lớp), lớp đi qua strLopQuanLy_Id.
- lephinhaphoc: nút Tải lại (gốc không xử lý) = chạy lại thống kê.
- hoso: Phân quyền bắt chọn kế hoạch trước (gốc ghi quyền với kế hoạch rỗng); danh sách người dùng nạp lại mỗi lần mở hộp; bảng Loại hồ sơ trong hộp gộp theo LOAIHOSO_ID; cột Họ tên = NGUOIDUNG_TENDAYDU, trống thì ghép như gốc.
- Giữ chữ "Tạo mới"; bỏ nút "Viết lại" và ảnh ho-so.svg; vùng Phân quyền / Hồ sơ người dùng → hộp thoại.
- quydinh: có cả cột Stt (ums.crud chưa tắt được) lẫn cột Thứ tự như gốc.
- baocao/baocaosinhvien: Kế hoạch chọn nhiều → chương trình theo kế hoạch đầu còn chọn (cả khi bỏ bớt); strKeHoach_Id "a,b"; chuỗi Kế hoạch → CT → Lớp khoá theo cha→con.
- baocaosinhvien: strLoaiKhoan_Id không gửi như gốc dù có ô Khoản thu.
- hoso / hoso_apdung: lần đầu gửi kế hoạch rỗng; sau đó ô trống thì gửi id người dùng — như gốc.
Lỗi gốc sửa: hoso_apdung Phân cấp luôn gửi rỗng; sửa thì 3 ô Tính chất/Phân cấp/Phạm vi luôn trống (nay đọc TINHCHATHOSO_ID, PHANCAPAPDUNG_ID, PHAMVIAPDUNG_ID — 2 tên sau ĐOÁN); tiêu đề bảng lệch; phân trang trỏ sai đối tượng; ô tìm hộp "Tìm kiếm kế hoạch" không xử lý; lephinhaphoc một SV hai dòng cùng khoản vẽ hai ô (nay cộng dồn).
Việc dữ liệu (host): tên cột PHANCAPAPDUNG_ID, PHAMVIAPDUNG_ID của NH_QuyDinhHoSo_ApDung/LayChiTiet.

## Nhóm G (kehoach/nhaphoc, nhansu, dinhmuc x2, quytacsinhma) — 5/5, 5/5 (chỉ Sửa; "Tạo mới"), 0/0; dò riêng thêm/sửa/xoá
Khung: kehoach/_chung.js ums.nhKH (kế hoạch NH dùng chung, dinhmuc + quytacsinhma nạp chéo); dinhmuc/_chung.js ums.nhDm.man; nhansu nạp chéo ums.tlKh.hopChon (DKH thilai).
Tự chốt:
- nhaphoc: lưới "Ca nhập học" (gốc cột phải 4|8) đặt dưới biểu mẫu bằng pat.rows; ô Hệ không gửi như gốc (sửa lấy DAOTAO_HEDAOTAO_ID, thiếu thì tra theo khoá); "Là ca đang chạy" trống = 1; "Truy/xuất" không xử lý → disabled; "Tên kế hoạch" bắt buộc.
- Ô "Kế hoạch nhập học" (định mức, quy tắc sinh mã): gốc ô chữ chỉ đọc + hộp tìm (ô tìm không xử lý) → ô chọn gõ tìm; kế hoạch ngoài danh sách tự thêm để hiện tên.
- Định mức: "Tạo mới" lấy sẵn kế hoạch + khoản đang lọc; khoản ngoài 100 khoản đầu tự thêm; dinhmucchung ô thứ hai trùng nhãn "Tùy chọn" → "Cân đối khoản phải nộp"; "Chi tiết" khoản riêng: thẻ rê chuột → hộp thoại, lấy mọi dòng (gốc 10 dòng), cột "Loại khoản" → "Đối tượng".
- nhansu: hộp chọn người dùng ums.tlKh.hopChon + lọc Khoa/Bộ môn gửi strChung_DonVi_Id (gốc luôn trống); chọn nhiều; bỏ hộp "Tìm kiếm kế hoạch" không có lối mở.
- Mọi màn: lưu xong về danh sách; bỏ tham số 'type' gốc nhét nhầm vào thân lời gọi ca nhập học; bỏ ảnh minh hoạ.
Lỗi gốc sửa: thêm xong ở lại biểu mẫu id rỗng → Lưu lần hai thêm trùng (nhaphoc, 2 định mức, quytacsinhma); dinhmucrieng lấy id khoản thu làm id kế hoạch; quytacsinhma ô Độ dài chép nhầm "Thứ tự" → dDoDai luôn rỗng; quytacsinhma chưa từng Sửa được (nay LayChiTiet → CapNhat); lần tìm đầu gửi kế hoạch rỗng (thống nhất, kế hoạch bắt buộc).
Việc dữ liệu (host): quytacsinhma cột khi sửa THANHPHANCAUTRUCMA_ID, MUCAPDUNG_ID (suy đoán), TAICHINH_KEHOACHNHAPHOC_ID; nhaphoc chi tiết có DAOTAO_HEDAOTAO_ID?; ô phiếu thu/rút pageSize 10 như gốc (chỉ 10 phiếu); nhansu CMS_NguoiDung/LayDanhSach lọc strChung_DonVi_Id được không.

## Nhóm F (thuhoso new+cũ, ruttien new+cũ) — 4/4, 4/4, 4/4 (cột trái đạt trên danh sách trống); dò riêng đủ luồng
Khung: thuhoso/_dsnh.js ums.nhDs (cột trái người học theo kế hoạch + khối Hồ sơ, css _nhaphoc.css), _thuhoso.js ums.nhThuHoSo.man({cu}), ruttien/_ruttien.js ums.nhRutTien.man({cu}) (html nạp chéo thuhoso). Bản cũ: NH_* (GET), danh sách SV_CORE_NhapHoc_ThuTien_MH. Không dùng TC phieurut (rút theo lô, khác nghiệp vụ).
Tự chốt:
- Cột trái: Kế hoạch + Điều kiện trong Bộ lọc nâng cao, mở sẵn; chưa chọn kế hoạch → lời nhắc, không gửi "xxx"; đổi kế hoạch/điều kiện bỏ người đang chọn; không tự chọn khi một kết quả.
- Thu hồ sơ: cột "Cần nộp" (gốc ô nhập không gửi, gọi main_doc.ThuTien không tồn tại) → chỉ hiện số = định mức − đã thu (âm = 0); số lượng thực thu không chặn trần (hàm kiểm gốc chưa chạy), chỉ nhận số, tải tệp xong số lượng = số tệp; gắn tệp rồi mới lưu, lưu xong nạp lại; bỏ vùng chết (Sửa số phiếu, Xuất hoá đơn, số phiếu đã thu/huỷ, nút Thu hs, LayDSNhapHoc_HoSo chỉ console.log, nút Xem Hồ sơ cột trái không xử lý).
- Rút tiền: hỏi lại + khoá nút khi gửi; chưa mở phiếu / tổng 0 → báo; nút Rút tiền cạnh "Tổng tiền đã chọn"; Huỷ phiếu xong đóng tờ + nạp lại; nút "Lịch sử" từng khoản khoá (gốc không xử lý).
- Phiếu rút: mẫu rút gọn ums.phieu.neutral (dữ liệu từ LayDSKhoanDaThuNhapHoc) → trên host chưa in theo phôi riêng.
Lỗi gốc sửa: ruttiennew getList_KhoanDaThu_Rut gọi 2 hàm không tồn tại → TypeError, bảng khoản không hiện, Rút tiền gửi rỗng, không xem phiếu rút (nay theo bản cũ); ruttiennew + thuhoso cũ đọc ô kế hoạch không tồn tại → gửi rỗng; checkValid_RutTien thiếu '#' không chặn số tiền; ô số lượng hiện "null"; nút Xoá dòng ô đánh dấu nay bỏ đánh dấu; nút tìm gửi rỗng thay "xxx".
Việc dữ liệu (host): cột tra khoản theo id phiếu rút SOCHUNGTU, MAUIN_MASO, SOTIENDATHU (theo genDetail_PhieuRut gốc).

## Nhóm E (trungtuyen: danhsach, import, kehoachtuyensinhnew) — 3/3, 2/3 (kehoachtuyensinhnew đúng thiết kế: Đợt khoá tới khi chọn Kế hoạch TS, harness không bắn select2:select), 0/0
Khung: trungtuyen/_khts.js ums.khts (dùng lại cho Tuyển sinh). themmoi.js gốc không chuyển (không html nào nạp, là trang thử).
Tự chốt:
- danhsach: chưa chọn kế hoạch bấm tìm → gửi ID người dùng (nhánh "theo user" gốc); lần đầu gửi rỗng như gốc; chuyển trang giữ lọc; cập nhật xong đóng khung sửa + nạp lại; ô trống khi sửa giữ giá trị cũ như gốc; chọn bản Corei PKG_CORE_NhapHoc_ThuTien; Chi tiết = hộp thoại, Thêm = biểu mẫu thay chỗ.
- kehoachtuyensinhnew: mở màn nạp luôn; ô "Hiệu lực" gốc không có lựa chọn → Còn/Hết hiệu lực mặc định 1; "Kết quả nhập học" khoá (gốc báo sẽ bổ sung); "Khai mức phí" → ums.app.openPath + sessionStorage KHTSN_preselect_KHNH_Id; "Viết lại" khi sửa về giá trị đang lưu; bỏ ô Hiệu lực ở Thêm nhân sự (gốc không gửi); picker ums.pat.pickNhanSu; Đầu ra + Bố trí nhân sự = hộp thoại lớn.
- import: "Import ▾" nút thả xuống → importChung('Import Nhập học','IMPORTWITHPROC_NHTT').
Lỗi gốc sửa: danhsach Thêm gửi nhầm ô "Tổng điểm xét" làm dDiemTS_TongDiem; Dân tộc/Tôn giáo/Thành phần xuất thân không gửi (nay gửi); Chi tiết thiếu Hạnh kiểm 12, bỏ dòng Mã ngành luôn rỗng; import Xoá điều kiện luôn đúng (nay 1–100); kehoachtuyensinhnew "Viết lại" xoá trắng biểu mẫu sửa; đổi Hiệu lực Đợt cũ còn (nay xoá theo cha).
Giữ như gốc: "Trạng thái phân công" không gửi; LayDS_NH_KeHoach_NhanSu thiếu tên → bù từ LayDSNhanSu_HoSo_v2; ô …_Id ở danhsach là ô chữ.
Việc dữ liệu: PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhanSu JOIN sai (PERSON_HOTEN/PERSON_MA/DONVI_TEN rỗng); danh mục có thể chưa khai: NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE, .STA, NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE, .PHANCONG_STATUS_CODE; xác nhận API Thêm/Sửa nhân sự nhận trạng thái phân công + hiệu lực.
Tuyển sinh: bản TS (13.832 dòng, PKG_CORE_TS_*) khác thực thể chính; dùng lại _khts: K.dsKeHoachTS/dsDotTS, noiKHDot, donVi/nguonDonVi, ngay/ngayGio, dmDuPhong, vietLai, co, tenMa, pick, K.phanCong(kh,cfg) (Pr_Ts_Kh_Ns_PhanCong_Get_Ds/Ins/Upd/Del).

## Nhóm D (phanlop: phanlop, chuyenlopnhaphoc, hosotuyensinh) — 3/3, 3/3, 1/1
Khung: phanlop/_chung.js ums.nhPhanLop (kế hoạch NH, lớp QL bản Corei, cột ô đánh dấu, nút thả xuống, guiEmailDanhMuc thay reportDanhMuc không eval).
Tự chốt:
- phanlop: Kế hoạch + Điều kiện trong Bộ lọc nâng cao mở sẵn; không tự chọn khi một người; nút "Chọn" → bấm cả mục; nút nổi "Phân lớp" lên đầu trang; "Rút hồ sơ" + "Tổng số đã phân lớp" lên tiêu đề khung Hồ sơ; bỏ cột ô đánh dấu bảng "đã rút"; nút "Tìm kiếm" khung lớp (gốc không xử lý) nạp lại lớp; lưu xong giữ từ khoá; chưa có mẫu báo cáo phân quyền → mục cứng "1. Phiếu phân lớp" (PHIEUPHANLOP).
- chuyenlopnhaphoc: bắt chọn lớp (gốc gửi rỗng); Hệ nạp khi mở hộp; hai mục Import cứng (IMPORTWITHPROC_CLNH, _CDMS) bị thay khi có mẫu import phân quyền như gốc.
- hosotuyensinh: ums.crud chỉ sửa; lưu xong về danh sách, bản ghi con lưu sau như gốc; Họ đệm/Tên/Ngành nghề (*) bắt buộc thật; hộp Chuyển nguyện vọng kiểm đánh dấu lúc mở, bắt chọn lớp, gửi hàng loạt; nút Xoá chân biểu mẫu khoá (gốc không xử lý); ẩn "Thêm dòng mới" lưới giấy tờ (gốc chú thích), loại hồ sơ dòng đã lưu chỉ đọc; cột ô đánh dấu trước cột Thao tác.
Lỗi gốc sửa: chuyenlopnhaphoc từ khoá đọc ô txtAAAA không tồn tại; phanlop Rút hồ sơ gọi edu.system.aler (TypeError); hộp Chi tiết lớp đọc sai cột (nay thêm QLSV_NGUOIHOC_*); hosotuyensinh ảnh chép tạm sang tên chính thức trước khi lưu.
Việc dữ liệu (host): biểu thức THONGTIN3/4/5 + TEN danh mục NH.GNH (gốc eval; bản mới chỉ hiểu 'chữ' + aData.COT); Huỷ phân lớp gọi NH_NguoiHoc_ThongTinTuyenSinh/Xoa như gốc.

## Chốt ngày 2026-09-27 — Tuyển sinh (ApisQuanlyTuyenSinh, 15 màn, 7 tác tử con)

Mỗi nhóm: tệp — kết quả kiểm — điểm tự chốt — lỗi gốc đã sửa — việc dữ liệu / cần kiểm trên host (việc dữ liệu rõ ràng đã vào can-quyet.js).
Thư viện Excel của kehoachtuyensinhnew: gốc nạp từ CDN → nay bản cục bộ `assets/vendor/xlsx/xlsx.bundle.js` (xlsx-js-style 1.2.0, Apache-2.0).

## Nhóm F (tuyensinh/ingiaytrungtuyen, danhmuc/danhmucdulieu) — 2/2, 2/2, 1/1; dò riêng
danhmucdulieu nạp CHÍNH tệp DKH (gốc chỉ khác dòng page_load). ingiaytrungtuyen: ums.crud một cột, 12 ô lọc, "Xuất báo cáo ▾" ums.report.mount, Chi tiết = khung xem chỉ đọc 8 nhóm thay chỗ danh sách; nạp chéo ums.nhPhanLop.cotChon (NH phanlop) cho cột ô đánh dấu.
Tự chốt:
- ingiaytrungtuyen chỉ xem (gốc không có Lưu, save_HS không tồn tại, Thêm dòng/Xoá lưới không xử lý).
- Hai nút "In giấy báo" gốc không xử lý → khoá, chú thích "in qua Xuất báo cáo"; mục cứng "1. Giấy báo nhập học" không dựng.
- Năm → Kế hoạch → Hệ → Khoá và Tỉnh → Huyện → Xã theo cha→con; đổi Năm tải lại danh sách.
- Ô Đối tác gốc chữ gợi ý nhầm "Chọn ngành nghề" → "Chọn nguồn tuyển sinh".
- Không chuyển mã chết (.btnAdd, #btnHS_In 2C_2008, rewrite/save_/delete_).
Lỗi gốc sửa: kế hoạch đọc ô txtAAAA không tồn tại (gửi rỗng, như cũ); lưới THPT dùng trang hiện tại của danh sách chính → cố định 1/10.
Việc dữ liệu: không.

## Nhóm E (tuyensinh/duyethoso, doitactuyensinh) — 2/2, 2/2 (duyethoso không có Thêm mới — dò riêng), 0/0
duyethoso nạp chéo (chỉ đọc) ums.nhPhanLop (cột ô đánh dấu) + ApisChuyenCan nhapchuyencan/css/_chung.css (.cc-xn nút lớn).
Tự chốt:
- duyethoso: khung "DUYỆT HỒ SƠ" chỉ xem (gốc không có đường lưu: #btnHS_Save không có, save_/delete_ không nơi gọi); nút Duyệt đầu khung, Đóng trái; chi tiết đọc từ dòng danh sách như gốc (getDetail_HoSo không dùng); hộp duyệt: lịch sử chỉ khi đánh dấu đúng 1 hồ sơ, duyệt nhiều ui.batch có tiến độ rồi nạp lại; giữ 1 nút "Duyệt hồ sơ" đầu trang (gốc 2); Năm → Kế hoạch TS → Hệ → Khoá, Tỉnh → Huyện → Xã theo cha→con (kế hoạch khoá tới khi chọn Năm); "Tình trạng hồ sơ" tra tên danh mục TUYENSINH.TINHTRANGHOSO.
- doitactuyensinh: Họ đệm / Tên bắt buộc (gốc khai kiểm không gọi); chỉ "Xoá đã chọn" (strIds nối phẩy) + Xoá trong biểu mẫu; hỏi "tiếp tục thêm?" → nút "Lưu và nhập tiếp".
Lỗi gốc sửa (duyethoso): ô Học lực / Hạnh kiểm không bao giờ có danh mục (nạp vào ô không tồn tại); ô Đối tác option không có value → gửi họ tên thay ID; ô Đối tác chỉ 10 dòng; mở hồ sơ khác còn đọng điểm/trường/giấy tờ hồ sơ trước.
Việc dữ liệu: không.

## Nhóm B (tuyensinh/kehoachtuyensinh — bản cũ TS_*) — 1/1, 1/1, 0/0; dò CDP riêng
Không dùng ums.khts (bảng TS_KeHoachTuyenSinh… khác PKG_CORE_TS_*). Khung: _khtsc.js (ums.khtsc), _khtsc_dot.js (vùng Đợt + hộp ngành nghề/tổ hợp/lớp dự kiến), _khtsc_cauhinh.js (Mẫu hồ sơ, Cấu trúc hiển thị — sửa trong ô, Lưu dòng đã đổi).
Tự chốt:
- Thêm mới xong về danh sách (gốc hỏi tiếp tục + ở lại, biểu mẫu thêm 5 ô); Lưu kế hoạch đang sửa: lưu các khối con đúng thứ tự gốc rồi về danh sách.
- Cột "Ngành nghề dự kiến mở" (nút Sửa thứ hai) giữ, cùng mở đợt.
- Danh sách con (hệ khoá, hồ sơ, tổ hợp môn) lấy một trang lớn (gốc pageSize mặc định có thể thiếu).
- Hồ sơ giấy tờ / Tổ hợp môn: dòng mới gửi strId rỗng (gốc chuỗi ngẫu nhiên 30 ký tự), dòng trống không gửi; dòng đã có giữ ThemMoi kèm strId như gốc.
- Nhân sự kiểm trùng theo ID người dùng (gốc so sai nên không bao giờ phát hiện).
- Lớp dự kiến: đợt chưa lưu thì chặn Thêm; Mẫu hồ sơ "Thêm mới" khoá khi chưa chọn mẫu; Lưu khi không đổi gì → "Chưa có dòng nào thay đổi"; Cấu trúc xoá lọc cha → hiện lại mọi dòng; Tổ hợp ngành nghề ô "Chọn ngành nghề" trang trí → chữ chỉ đọc.
- Bỏ mã chết: nút xoá bảng kế hoạch, zone_input_HoSo, LayDSNamTuyenSinhTheoKeHoach (đổ vào ô không tồn tại).
Lỗi gốc sửa: Sửa khoản phí action Sua_ mà func Them_ (nay func Sua_TS_KeHoach_Phi_Dot); Sửa lớp dự kiến func ghi tên controller (nay pkg_tuyensinh_thongtin.Sua_TS_Dot_DoiTuong_LopHoc); thêm đợt giữ id rỗng → Lưu lần hai thêm trùng; lưu khoản phí nạp nhầm Tổ hợp môn.
Việc dữ liệu: không.

## Nhóm D (tuyensinh/hosotuyensinh, khaibaothongtin) — 2/2, 2/2, 0/0; hồi quy NH phanlop-hosotuyensinh 1/1 + 1/1
Khung chung MỚI: _v2/ApisNhapHoc/Modules/phanlop/scripts/_hosots.js (ums.hoSoTS.man(root,o); không cờ = bản NH cũ, {ts:true} bật phần TS). NH hosotuyensinh.js nay chỉ gọi khung; NH html thêm thẻ nạp _hosots.js. Hộp "Chuyển lớp" + "Lịch sử" của NH chưa chạy thử riêng sau khi dời (logic giữ nguyên).
khaibaothongtin: TRANG MẪU (gốc không gọi máy chủ, dữ liệu trong bộ nhớ) — đầu trang "Trang mẫu — dữ liệu dựng thử".
Tự chốt:
- hosotuyensinh: Năm là cha của Kế hoạch (khoá tới khi chọn Năm; đổi Năm nạp lại danh sách); Lớp khoá tới khi chọn Hệ, nạp theo Hệ + Khoá; "Thêm mới từ Đào tạo" chọn nhiều bằng ô đánh dấu rồi lưu một lượt, bắt chọn Kế hoạch trước; Chuyển nguyện vọng kiểm đánh dấu khi mở + bắt chọn Kế hoạch + tiến độ; lưu xong về danh sách; Họ đệm/Tên/Ngành nghề bắt buộc; không có nút Xoá chân biểu mẫu (gốc chú thích bỏ); nhiều dòng lớp 9–12: TS lấy dòng đầu, NH dòng cuối (đúng gốc từng bên); Xã lớp 9/11 hiện không gửi như gốc; "Thêm dòng mới" Hồ sơ giấy tờ hiện ở TS (NH vẫn ẩn).
- khaibaothongtin: biểu mẫu thay chỗ danh sách (gốc hộp thoại), nút Thêm đầu trang giữ chữ theo tab; ô (*) kiểm khi Lưu; bỏ chế độ Xem + "Chuyển sang sửa" (không lối vào); Có/Không + viên chọn module → ô đánh dấu; nút Chi tiết dùng fa-eye.
Lỗi gốc sửa: diện ưu tiên của hồ sơ MỚI chưa bao giờ lưu được (gửi id rỗng; nay id máy chủ trả); tên môn Điểm thi cuối kỳ bị ghi đè bằng tên môn THPT (nay MON1HOCTAP_TEN — cột ĐOÁN); lớp 10 đọc DiemTNCN lẫn hoa thường (nay DIEMTNCN).
Kiểm trên host: TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach có dữ liệu?; danh mục TS.DOITUONGUUTIEN, TS.XEPLOAITN; cột MON*HOCTAP_TEN.

## Nhóm G (hoso: quanlyhoso, quanlyhosomorong, tochucthinhapdiem) — 3/3, 1/3 (2 màn QL hồ sơ: "Thêm mới" mở trang nhập hồ sơ NGOÀI UMS bằng vé — đúng thiết kế), 0/0; dò riêng đủ luồng
Khung: hoso/_chung.js ums.tsHoSo (thanh lọc + nối tầng, nguồn Năm/KH TS/Hệ/Khoá/Đợt/Hình thức kiểu cũ TS_*, cột ô đánh dấu, hàng đợi N luồng, tệp SV_Files chỉ xem, nút sửa liên kết tuyensinh.aspx, "Thêm mới" CMS_Token/CreateTicket, xoá, gộp tệp CMS_Files/GopFile). Không dùng ums.khts (API kiểu cũ).
Tự chốt:
- Cả 3: Kế hoạch → Hệ → Khoá, Kế hoạch → Đợt, Kế hoạch → Hình thức khoá theo cha; chọn Hệ nạp lại Khoá (gốc không). quanlyhosomorong: Năm → Kế hoạch khoá; hai màn kia Năm độc lập như gốc.
- quanlyhoso: vẽ bảng sau khi có danh sách trường thông tin; chọn Đợt nạp lại cả bảng (gốc chỉ vẽ lại tiêu đề → lệch cột); mỗi ô nạp 6 luồng, bỏ lượt cũ.
- "Thêm mới" (2 màn QL hồ sơ): mở tab trống ngay khi bấm rồi gán địa chỉ khi có vé (tránh chặn cửa sổ).
- quanlyhosomorong: nguồn API ngoài — gốc viết cứng tài khoản/mật khẩu/token CRM cmcu, tuyensinh.uhd, hrm.phenikaa → KHÔNG chép bí mật (tiền lệ CMS config_app), giữ địa chỉ + cách chọn nguồn theo tên máy chủ, thiếu bí mật thì báo không gửi; "Duyệt" dữ liệu nguồn bắt chọn Kế hoạch, 4 luồng có tiến độ; "Tổng hợp dữ liệu" hỏi lại; bỏ hai nút mũi tên cuộn bảng; không chuyển mã chết.
- tochucthinhapdiem: "Quy tắc sinh số" không nguồn → khoá, gửi rỗng; tạo tự động bắt chọn môn, số thí sinh nguyên, mở vùng tạo nạp lại môn; thêm/xoá thí sinh + tạo SBD hàng loạt có tiến độ, xong nạp lại.
- Giữ như gốc (nghi ngờ): D_Hoc/LayDanhSach gửi strDaoTao_LopQuanLy_Id = ô Hình thức, strDangKy_KeHoachDangKy_Id = ô Kế hoạch; cột "Duyệt hồ sơ" đọc TONGTIENDANOP1.
Lỗi gốc sửa: quanlyhosomorong "Tổng hợp dữ liệu" gửi đảo strDoiTuongDuTuyen_Id/strDotTuyenSinh_Id; getUrl_NguyenVong báo lỗi bằng biến không tồn tại (ReferenceError); hộp nguyện vọng lỗi khi DSMONTHITHEOTOHOPNGANH_ID rỗng; tochucthinhapdiem ô từ khoá đọc txtAAAA (nay gửi); báo nhầm "Cập nhật thành công" khi tạo danh sách; ô trống gửi '' cho khớp gốc.
Việc dữ liệu / cấu hình: quản trị cấp mã xác thực nguồn API ngoài (nên cấu hình phía máy chủ; tạm: bảng NGUON / NGUON_MAC_DINH đầu quanlyhosomorong.js); NÊN THU HỒI token/mật khẩu lộ trong JS gốc (CRM Basic, "Bearer HaiDuong@2025", mật khẩu hrm.phenikaa); configTS().path đọc từ Config.js trên host — kiểm.

## Nhóm C (xettuyen, chitieutuyensinh, diachitruong, nhapdiem) — 4/4, 4/4 (không có Thêm mới — dò riêng), 0/0
Nạp chéo (chỉ đọc): ums.nhPhanLop cột ô đánh dấu; css .nd-xn (CCB nhapdiem). Không dùng ums.khts.
Sửa phân hệ khác (cờ, mặc định giữ hành vi): CCB nhapdiem/_chung.js nd.bangDiem({chon:false}) bỏ cột Chọn; _xacnhan.js nd.xacNhanNut({idHanhDong}) gửi strDiem_DanhSachHoc_Id. Hồi quy QLD nhapdiem* 3/3, CCB nhapdiem/tuibai/nhapdiemdst 3/3.
Tự chốt:
- xettuyen: bốn nút xét bắt chọn kế hoạch (gốc gửi rỗng); "Tạo dữ liệu xét" hỏi lại; "Xét tự động theo chỉ tiêu" một lời gọi strNganhNghe_Id rỗng như gốc; "Theo điểm chuẩn" từng ngành qua ui.batch rồi nạp lại; hộp xét tuyển/tiếp sinh lịch sử chỉ khi đánh dấu 1 hồ sơ; lưu hồ sơ về danh sách; Họ đệm/Tên/Ngành nghề bắt buộc; mỗi nút một chỗ ở đầu trang.
- nhapdiem: dùng lưới ums.nd.bangDiem (bản QLD mới hơn) → lưu xong tự tính lại; Tính lại gửi strDiem_DanhSach_NguoiHoc_Id = ID dòng; giữ như gốc: mở màn tải, đổi lọc tải lại, một bảng điểm thì tự mở.
- chitieutuyensinh: lưu hàng loạt có tiến độ rồi nạp lại; dòng tổng chỉ ở cuối (gốc chép thêm dưới tiêu đề); giữ tiêu đề "Danh sách hồ sơ thí sinh"; một kế hoạch thì tự chọn; đổi kế hoạch tự tải lại.
- diachitruong: biểu mẫu thay chỗ danh sách (gốc hộp thoại); chỉ sửa, không thêm như gốc.
Lỗi gốc sửa: diachitruong ô tìm đọc txtAAAA (nay gửi); xettuyen "Danh sách ngành xét" lưu xong gọi hàm không tồn tại (lỗi JS); hộp tiếp sinh đổ lịch sử nhầm bảng + id hồ sơ cũ; nhapdiem khung "Chỉnh sửa thông tin hiển thị" (colorselector) không lối mở + hàm không tồn tại → bỏ; bảng "Lịch sử xác nhận" không nơi nạp → bỏ; mã chết xettuyen (#myModalNganhXet, save_ChuyenNguyenVong, delete_HS, btnAdd/btnDelete, "Phiếu tiếp nhận" cứng), nhapdiem #btnBaoCao.
Kiểm trên host: tên cột CHOTIEUCONSOVOITRUNGTUYEN (gốc gõ "CHO…").

## Nhóm A (tuyensinh/kehoachtuyensinhnew — 13.8k dòng) — 1/1, thu-crud "!!" báo nhầm (Lưu gọi Pr_Ts_KeHoach_TuyenSinh_Create / _Update, harness chỉ nhận ThemMoi/CapNhat), 0/0; NH trungtuyen-kehoachtuyensinhnew 1/1 sau khi sửa _khts.js
Tệp: kehoachtuyensinhnew.js (ums.crud) + _khtsn_chung.js (ums.khtsn), _khtsn_excel.js, _khtsn_dot/qdhs/daura/phancong/kqdk/import/khai/khaiphu/docapi/tracuu.js, _khtsn_chung.demo.js, css/_khtsn.css; html nạp chéo ApisNhapHoc trungtuyen/_khts.js.
Sửa _khts.js (NH, cờ mặc định giữ hành vi): K.dsDotTS(khId, dIsActive, {tatCa:true}) gửi dIs_Active rỗng; K.phanCong cfg.detail(row,kh) gọi Get_By_Id trước Xem-sửa.
Tự chốt:
- Biểu mẫu kế hoạch: "Còn hiệu lực" Create/Update không gửi → chỉ xem; Mã + Tên bắt buộc, Mã khoá khi Sửa; nút "Quy định phí", "Mẫu khai hồ sơ", "Phương thức tuyển" trỏ hộp không tồn tại → khoá; "Mẫu hồ sơ" để trống như gốc.
- Đợt: Thêm gửi dSo_Da_* = 0, Sửa không gửi.
- Đọc từ API: KHÔNG chép token CMC, mật khẩu HRM Phenikaa, Bearer UHD → địa chỉ API + mã xác thực thành ô nhập (địa chỉ nhớ theo máy, mã không lưu); bỏ "Tự động ghép" (gốc ẩn), ô Đối tượng (gốc hidden).
- Khai hồ sơ (8 bước): ô ngày lịch dd/mm/yyyy, ngày cấp CCCD vẫn gửi yyyy-mm-dd như gốc; bỏ nút "Khổ vừa/rộng"; thông báo sau lưu gộp một toast; hoá đơn chỉ nhắc không chặn (như gốc).
- KQĐK: bỏ thanh cuộn giả; lọc kiểu Excel = khung nổi trong hộp. Import: đối chiếu CCCD tự nạp danh sách hệ thống khi trống; xuất Excel .xls (ui.xuatXls).
- Phân công: hộp chọn nhân sự thiếu "Thêm từng đơn vị".
Lỗi gốc sửa: Quy định hồ sơ / danh mục hồ sơ trong khai lưu lần hai thêm trùng (nay chỉ gửi dòng mới có nhập / dòng cũ có đổi); Sua_HoSo_TS ô trống ghi đè rỗng (nay không), strExtra_Data cắt ≤ 990 byte; sau Them_HoSo_TS tra lại id người mới (thử 3 nhịp) rồi mới ghi bảng phụ; nút "Đóng" khi vào từ danh sách lùi về danh sách.
Việc dữ liệu: cấu hình khoá xác thực / địa chỉ nguồn "Đọc từ API" (CMC, UHD, Phenikaa) nên đưa về máy chủ; THU HỒI token CMC + mật khẩu HRM Phenikaa viết cứng trong mã gốc; LayDS_HoSo_TS so khớp phân biệt hoa thường → sửa procedure dùng UPPER().

---

# Chốt ngày 2026-09-27 — Nghiên cứu khoa học (ApisNCKH, 55 màn)

8 tác tử con (A–H). Kiểm toàn phân hệ `vt=R23&tien=NCKH`: kiem-dong-bo 55/55; thu-crud 54/55 (`tinhdiem/phanbo` — "Thêm" mở khung chọn
sản phẩm chưa phân bổ như gốc, đúng thiết kế); kiem-cot-trai 34/34; biểu tượng 0 lệch. Hồi quy CCB 152/152, NS 121/121, DKH 24/24, TS 15/15.
**Thống nhất sau khi gom (người điều phối):** mọi màn NCKH có ô Đơn vị → Thành viên đều KHOÁ Thành viên tới khi chọn Đơn vị
(luật cha → con) — đã sửa `_hd_xacnhan.js` (nhóm C), `_dt_detai.js` bản quản trị + `quanlyduan.js` (nhóm D, `{ khoa: true }`).
Nhóm B sửa `_harness/kiem-dong-bo.html`: ô lọc trong `.ums-master__adv` không còn tính là "biểu mẫu hiện sẵn".
Kiểm trên host (tự chốt, không để sổ): tên cột `KETQUAXACNHAN_*`, `CAPQUANLY_TEN`, `VAITRO_TEN`, `rsNhanSu`/`rsLoaiSanPham`;
đường GHI `NCKH_SP_XacNhanKeKhai/ThemMoi`; id `ThemMoi` trả ≠ cột ID danh sách (đã biết ở CCB) ảnh hưởng gắn thành viên/tệp bản quản trị.

## Nhóm H — danh mục (4), tracuuinan (2), lylichkhoahoc, dashboard — 8/8
Kiểm: kiem-dong-bo 8/8, thu-crud 8/8, cột trái 5/5, icon 0 lệch.
Tệp: danhmuc/_tapchi.js (ums.nckhTapChi.man) + tentapchiquocte/quocgia; danhmucdetai (ums.nckh.man nạp chéo CCB _sanpham.js + sanpham.css, thanhVien NCKH.VTDT, tepRieng); danhmucdulieu nạp DKH; tracuuinan chỉ html nạp NS; lylichkhoahoc khung chưa có nội dung (gốc trống); dashboard ums.ui.chart (giữ strNamKeThuc).
Tự chốt:
- Tạp chí: bỏ ô "Chọn thời gian" cột trái (gốc không nạp/gửi); xoá chuyển vào biểu mẫu (luật 12); QT gửi strTenTapChiDang_Id rỗng như gốc; QG bỏ khung Chi tiết + update_DMTCQG (không nơi gọi).
- Danh mục đề tài: xoá vào biểu mẫu; bỏ "Nhập tiếp" (gốc gắn #btnReWrite không tồn tại); bỏ mã chết CapMa, NCKH.TTDT, ô thành viên đăng ký, hộp tìm; không tự thêm người đăng nhập; lưu thành viên gửi thêm strNCKH_TinhDiem_KeHoach_Id rỗng + strChucNang_Id (khối chung CCB); mục trái 3 dòng Tên/Mã/Phân loại.
- Hồ sơ lý lịch: dùng bản NS → in gửi strOutputType rỗng thay strNguoiDangNhap_Id của gốc NCKH (strNguoiThucHien_Id cùng giá trị vẫn đi kèm).
- Dashboard: không dùng ums.dbv2 (API thật); lỗi hiện "—" + báo trong khung biểu đồ (gốc chỉ console.log).
Lỗi gốc đã sửa: danh mục đề tài thêm xong giữ biểu mẫu không id → Lưu lần hai tạo trùng; nay về danh sách.
Dữ liệu: không.
Nợ: cờ strNguoiDangNhap_Id cho NS hosolylich nếu mẫu in cần; ums.nckh.man cần khai item nhiều dòng, saveAgain, tắt strNCKH_TinhDiem_KeHoach_Id khi nam:false → ums.pat; crud hai cột nút xoá trên mục.

## Nhóm G — baocao 10/10
Kiểm: kiem-dong-bo 10/10, thu-crud 10/10, cột trái 9/9, icon 0 lệch.
Tệp: baocao/script/_chung.js (ums.nckhBc.man — cột trái chỉ lọc pat.master+cotTrai, cột phải ums.crud embedded chỉ đọc) + _chung.demo.js + 10 cấu hình; baocao/baocao khung chưa có nội dung (gốc trống).
Tự chốt:
- 9 màn "Xuất excel": gốc gọi me.report_<X> không tồn tại → xuất Excel máy khách TOÀN BỘ theo lọc (pageSize 1000000); bỏ nạp SYS.RP.*.
- detai: strNCKH_ThanhVien_Id = người đăng nhập khi ô Nhân sự trống, người chọn khi có; ô thời gian giữ + khoá (không nguồn); bỏ radio Tình trạng (trống).
- hoinghihoithao: ô thời gian khoá; ô cơ cấu gửi vào strDonViCuaThanhVien_Id (gốc gửi rỗng).
- vanbangsangche: ô cơ cấu khoá (procedure không nhận đơn vị).
- sach: gửi strVaiTro_Id theo ô NCKH.VTVS (gốc luôn rỗng).
- hoidongxetchucdanh: radio thêm "Tất cả"; bỏ radio QLCB.CHDA (không gửi); cột đọc như gốc.
Lỗi gốc sửa: tapchiquocte từ khoá đọc nút + Enter sai id; tapchiquocgia nút tìm sai id, từ khoá ô không tồn tại; ô Nhân sự chỉ HODEM → họ tên; detai tìm/Enter không gắn, từ khoá/đơn vị đọc ô hộp khác, loại đề tài không gửi → nay strTuKhoaText, strDonVi_Id_CuaThanhVien_Id, strPhanLoaiDeTai_Id.
Dữ liệu (nghiệp vụ/oracle): hoidongxetchucdanh tên cột "Họ tên ứng viên"/"Đơn vị" chưa rõ (đọc DOITUONGDEXUAT_TEN, Đơn vị/Ghi chú rỗng); ô thời gian detai/hoinghihoithao chưa có nguồn; văn bằng sáng chế chưa lọc theo đơn vị.
Nợ: ums.crud locTrai (cột trái chỉ lọc); pat.cotTrai/danhDau không xét checked của radio; crud xuất Excel toàn bộ; ui.table minWidth.

## Nhóm E — hội đồng (4), quanlyhoso — 5/5
Kiểm: kiem-dong-bo 5/5, thu-crud 5/5, cột trái 5/5, icon 0 lệch.
Tệp: QLSP+XNKK hoidongxetchucdanh.html nạp CHÍNH CCB _sanpham.js + hoidongxetchucdanh.js (gốc NCKH = bản CCB, nút Thêm/Sửa không có trên html → chỉ xem); quanlysanpham/_hdg_daoduc.js (ums.nckh.man nam:false) + XNKK hoidongdaoduc nạp chéo; quanlyhoso/quanlyhoso.js+css (bản cán bộ của CSV tunhaphoso, nạp chéo css _profile.css, hai cột).
Tự chốt:
- HDDD: strMa ← Mã SP; strNamBaoCao+strNamHoanThanh ← Năm tham gia; Số hội đồng/Trạng thái/Mô tả hiện nhưng chưa lưu (không có tham số ở gốc); bỏ ô lọc Thành viên/Cán bộ nhập (gốc không nạp), strCanBoNhap_Id rỗng; bỏ khung chi tiết + 3 nút dòng (luật 12).
- QLHS: Thêm SV = biểu mẫu khung phải (gốc hộp thoại); Sửa gọi SV_KeHoach_HoSo/CapNhat strId=ID người học (gốc luôn ThemMoi → trùng) — đường GHI mới; hiện Xoá trong biểu mẫu Sửa; khoá tệp = ID người học + ID trường (gốc chỉ ID trường → mọi SV chung tệp; tệp cũ không còn hiện); ảnh chỉ xem (save_Anh không gọi, lỗi); chưa chọn kế hoạch không gọi danh sách.
Lỗi gốc sửa: HDDD lưu đọc ô màn hội nghị (mọi tham số rỗng), dòng thành viên giả; QLHS từ khoá không gửi (txtAAAA), Lưu gửi undefined trường tab khác (xoá trắng) → chỉ lưu trường đang hiện, bcheck không tắt, dải tab nhân đôi, textarea value; lưu xong ở lại tab đang mở.
Dữ liệu (oracle): tham số thật NCKH_SP_HoiDongDaoDuc cho Số hội đồng/Trạng thái/Mô tả/Năm tham gia; SV_KeHoach_HoSo/CapNhat có tồn tại không; SV_KeHoach_HoSo/Xoa nhận ID người học hay ID dòng phạm vi; tệp SV_Files gắn theo khoá cũ (chỉ ID trường).
Nợ: .ums-master__adv minmax(0,1fr) (vá tạm quanlyhoso.css); ums.csvProfile.manHoSo nhận ID người học/action cũ/ô lọc ngoài/cột File → gộp quanlyhoso; ums.nckh.man ô lọc thêm + chi tiết chỉ xem.

## Nhóm C — đề tài SV, giảng dạy/hướng dẫn SĐH, hướng dẫn giảng dạy — 7/7
Kiểm: kiem-dong-bo 7/7, thu-crud 7/7, cột trái 4/4, icon 0 lệch.
Tệp: quanlysanpham/_hd_chung.js (ums.nckhHD, H.man bản rút gọn N.man, dùng N.kinhPhi/N.nguoi + sanpham.css) + css/_hd_.css + huongdangiangday.js (bản 2018 chưa tách, NCKH_SP_HuongDan_GiangDay); xacnhankekhai/_hd_xacnhan.js (ums.nckhHDxn — một cột, lọc Đơn vị/Thành viên/Tình trạng, bảng + xác nhận nhanh, chi tiết chỉ xem + hộp nút lớn) + css.
Tự chốt:
- Quản trị không dùng N.man (cứng năm đánh giá + lọc người đăng nhập): H.man lấy mọi bản ghi, không tự thêm người đăng nhập, không khối "SP thuộc đề tài"/hộp Tìm.
- giangdaysaudaihoc: Tên lớp dạy gửi strMoTa + dSoTacGia_n=1 như CCB (gốc gửi vào dSoTacGia_n).
- Hai màn giảng dạy: giữ tráo Thời gian/Nội dung khi lưu, hiện theo chỗ tráo (như CCB).
- huongdangiangday: mở mục → chi tiết như gốc + thêm nút Sửa/Xoá (gốc không có lối vào); nhận mã HD/GD lẫn GIANGDAY/HUONGDAN (gốc luôn báo lỗi); khối ẩn không lưu; Tên đề tài bắt buộc; Năm nghiệm thu thành ô chữ (gốc gắn lịch → 20/06/2026).
- XNKK đề tài SV / giảng dạy: nạp NCKH.XNKK cho ô Tình trạng (gốc chú thích bỏ).
- XNKK Đơn vị → Thành viên: không khoá (lọc tuỳ chọn), đổi đơn vị xoá + nạp lại thành viên.
- XNKK chi tiết chỉ xem; nạp lại sau khi máy chủ trả (gốc chờ cứng 500ms).
- Quản trị: bỏ thùng rác mục trái → Xoá trong biểu mẫu; bỏ "Viết lại".
Lỗi gốc sửa: hai màn SĐH save_SinhVien gửi id SV làm id SP → học viên chưa từng lưu được; mọi màn quản trị gửi lại mọi dòng GV/SV → trùng, nay chỉ dòng mới; XNKK đề tài SV hai cột GVHD/SV đổ nhầm NAMNGHIEMTHU → nạp tên từng dòng (4 luồng).
Dữ liệu: không (nếu mã NCKH.VTHDGD khác GIANGDAY/HUONGDAN thì lọc rỗng như gốc).
Cờ đề xuất _sanpham.js: N.man cfg.loc, cfg.tuThem, tắt N.item tình trạng, cfg.luuKhoi(k); N.nguoi nutText + placeholder.
Nợ: hộp Xác nhận nút lớn bản thứ bảy (.hdxn-nut) → nd.xacNhanNut nhận nut Promise + lichSu; Đơn vị→Thành viên thêm bản → ums.ref.thanhVien; crud hai cột chế độ mở mục → chi tiết chỉ xem; ums-link trong ô bảng canh giữa/bẻ chữ; vỏ không đóng hộp thoại khi đổi màn.

## Nhóm F — phiếu đánh giá (2), tinhdiem (3), quanlydiem — 6/6
Kiểm: kiem-dong-bo 6/6, thu-crud 5/6 (phanbo "Thêm" mở khung chọn SP chưa phân bổ — đúng thiết kế), cột trái 0/0 (một cột), icon 0 lệch.
Tệp: xacnhankekhai/_pdg_chung.js (ums.nckhPdg, cùng cấu trúc dòng CCB dgpl nhưng tự dựng — ums.dgpl.phieu cứng master+Lưu+#dg-phieu) + css _pdg_phieu.css; tinhdiem/{tinhdiem,tinhdiemsanpham,phanbo}.js; quanlydiem.js+css.
Tự chốt:
- Hai phiếu: chỉ xem (gốc không có đường lưu); xác nhận dùng strSanPham_Id = ID dòng; từ khoá lọc tại chỗ (gốc không gửi); Đơn vị → Thành viên khoá; bỏ ô "Điểm" sáng kiến + cột "Điểm thi đua" (không có dữ liệu); nút Kê khai giữ đường dẫn gốc qua openPath.
- tinhdiemsanpham: bắt chọn Kế hoạch trước Tìm/Tính; Tính hỏi lại; N×M LayKQCaNhan qua ui.batch 6 luồng.
- phanbo: bắt chọn Kế hoạch; gửi từ khoá (gốc đọc txtAAAA).
- quanlydiem: Tính điểm hỏi lại; cột phân loại hiện tên; bỏ ghi chú/nút không có trên màn.
- tinhdiem: hiện Xoá trong biểu mẫu Sửa (gốc display:none).
Lỗi gốc sửa: jquery.knob 0 byte → màn chết (thay CSS); hộp Xác nhận gọi edu.extend.save_XacNhanGiangVien không tồn tại + tra sai cột; bản cán bộ lưu NHANSU_HOSOCANBO_ID lệch ID dòng; ý kiến Giảng dạy ĐH/SĐH đổ ô không tồn tại; báo cáo đọc đơn vị ô không tồn tại; Điểm chuyên môn cộng chuỗi; bỏ mã chết.
Dữ liệu: không (kiểm host tên cột KETQUAXACNHAN_*, rsNhanSu/rsLoaiSanPham).
Cờ đề xuất CCB dgpl/_chung.js: ums.dgpl.bangPhieu(host,{nhanSuId,chiXem,side:false,tools}), xuất cauHinh.giangVien/canBo, bỏ ràng buộc id phieu.css.
Nợ: hộp Xác nhận nút lớn thêm .pdg-xn; ums.pat.xacNhanSanPham (NCKH_SP_XacNhanKeKhai ThemMoi/LayDanhSach) cho mọi màn XNKK; ui.table minWidth, cột ô đánh dấu, dòng tổng số lẻ; thu-crud nhận khung chọn để thêm.

## Nhóm B — giải thưởng, văn bằng sáng chế, hội nghị hội thảo (QT + XNKK) — 6/6
Kiểm: kiem-dong-bo 6/6, thu-crud 6/6, cột trái 3/3, icon 0 lệch.
Tệp: quanlysanpham/_gt_sanpham.js (ums.nckhGT: quanTri hai cột + lọc Đơn vị→Thành viên/Đề tài; xacNhan một cột bảng+tệp+nút nhỏ+chi tiết chỉ xem+hộp xác nhận+GopFile+Xuất báo cáo; thanhVien có ảnh; deTai; noiDonVi) + _gt_cauhinh.js + css; XNKK html nạp chéo quanlysanpham.
Sửa ngoài: _harness/kiem-dong-bo.html dòng 118 — ô lọc trong .ums-master__adv không tính "biểu mẫu hiện sẵn".
Tự chốt:
- Cả 6: Thành viên KHOÁ tới khi chọn Đơn vị (luật cha→con) — nhóm C chọn không khoá → THỐNG NHẤT khoá.
- QT: bắt buộc chỉ ô gốc thật sự kiểm (arrValid_*); xoá trong biểu mẫu; Văn bằng không có khối thành viên (html gốc không có); Văn bằng gửi Số QĐ/Ngày ký theo CCB (gốc hiện mà không gửi); tệp nhóm Thông tin gốc chết → tệp QĐ <id>_QD như CCB; HNHT nút "Tìm hội nghị" disabled (không xử lý).
- XNKK: chi tiết chỉ xem; ô tình trạng nạp LayDMXacNhanTheoNguoiDung (gốc không nạp); Xuất báo cáo ums.report.run mã GiaiThuong/VanBangSangChe/HoiThaoHoiNghi; HNHT báo cáo gửi strNhanSu_TDKT_KeHoach_Id rỗng + iTrangThai như gốc.
Lỗi gốc sửa: QT GT sau thêm gọi me.getList_VBSC không tồn tại; XNKK VBSC cột Nội dung xác nhận đổ nhầm KETQUAXACNHAN_TEN; XNKK GT tên SP lấy HINHTHUC → NOIDUNGGIAITHUONG; nạp lại khi máy chủ trả (gốc chờ 500ms).
Dữ liệu: không.
Cờ đề xuất _sanpham.js: N.man cfg.locThem/filters + xoaKhoa tham số phụ; N.thanhVien anh/nam:false/xem; N.deTai src/tatCa; nghi lỗi CCB N.deTai.nap đặt giá trị trước khi nguồn nạp xong.
Nợ: khung xác nhận kê khai NCKH ≥2 bản (nckhGT.xacNhan, nckhHDxn, + pdg) → ums.pat; hộp nút lớn .gtxn-lon; ums.ref.thanhVien; ums.files.mount trả danh sách tệp; ui.btn loại "tải về"; chay-cdp.js thoát im lặng khi Edge treo.

## Nhóm D — đề tài (QT + XNKK), quản lý dự án — 3/3
Kiểm: kiem-dong-bo 3/3, thu-crud 3/3, cột trái 2/2, icon 0 lệch (chạy lại sau khi tôi bật khoá Thành viên cho bản QT + quanlyduan).
Tệp: quanlysanpham/_dt_muon.js (mượn khối con CCB detai.js không sửa tệp: phần tử tạm #sanphamkhoahoc-detai + bọc ums.nckh.man lấy cfgCCB); _dt_detai.js (ums.nckhDt.man(root,{xacNhan}), ganDonVi, thamSoDs, srcNam) + css + demo; detai.js hai module chỉ gọi man; quanlyduan.js hai cột (N.thanhVien + D.ganDonVi).
Tự chốt:
- Đề tài QT: bỏ thùng rác mục trái (luật 12); "Nhập tiếp" (gốc nút chết #btnReWrite) = lưu rồi xoá trắng; bắt buộc Tên TV + Mã đề tài; chọn từ danh mục không tự thêm người đăng nhập; lưới Quyết định mượn CCB (2 dòng trống, tiêu đề "Quyết định phê duyệt - nghiệm thu"), thành viên gửi strNCKH_TinhDiem_KeHoach_Id rỗng; dKinhPhi_n/strNguonKinhPhi_Id/strThoiGianBaoCaoTienDo_Id rỗng như CCB; khối "Nội dung minh chứng" giữa Tiến độ và QĐ; hộp Tìm đề tài NCKH_DanhMucDeTai.
- Đề tài XNKK: khung chỉ xem; ô Tình trạng nạp mục xác nhận theo người dùng; hiện Loại/Lĩnh vực/Cấp QL (gốc ẩn); ô ngày trống thay "//".
- Đơn vị → Thành viên: KHOÁ ở mọi màn (thống nhất 27/9).
- Quản lý dự án: "Lưu và Nhập tiếp" lưu rồi xoá trắng (gốc chỉ xoá); thành viên ngoài trường hiện chung bảng; bắt buộc Tên dự án (gốc kiểm nhầm ô màn HNHT).
Lỗi gốc sửa: đề tài QT sửa đọc TENDETAI → TENDETAITIENGVIET; hộp Tìm đề tài gửi strPhanLoaiDeTai_Id = từ khoá → ô Phân loại; QLDA CapNhat không gửi strId, từ khoá txtAAAA; XNKK bỏ getList_SPKH (ReferenceError).
Dữ liệu (oracle, kiểm host): tên cột CAPQUANLY_TEN, VAITRO_TEN khung xem XNKK (đoán, tra danh mục trước); KETQUAXACNHAN_THONGTIN1.
Cờ đề xuất CCB: detai.js xuất ums.nckh.deTaiKhoi({minRowsKQ,tieuDeKQ}) để bỏ _dt_muon.js; N.thanhVien namKey:false.
Nợ: ums.files.mount lấy danh sách tệp; ums.ref.thanhVien (bản thứ tư); hộp nút lớn bản thứ bảy (.cc-xn); crud khung chỉ xem thay chỗ bảng; thu-crud bấm chi tiết màn chỉ xem; hợp nhất khung XNKK với ums.nckhGT.xacNhan.

## Nhóm A — bài báo / kỷ yếu / sách (QT 6 + XNKK 4) — 10/10
Kiểm: kiem-dong-bo 10/10, thu-crud 10/10, cột trái 6/6, icon 0 lệch, hồi quy CCB sanphamkhoahoc 2/2.
Tệp: quanlysanpham/_bb_chung.js (ums.nckhBB: SP cấu hình 4 sản phẩm, man hai cột bản chỉnh N.man, thanhVien/deTai bọc CCB, ganDonVi chain, xemMan bản 2018) + demo; xacnhankekhai/_bb_xacnhan.js (xnMan một cột, hopXacNhan) + css _bb.css; baibaoquocte/baibaotrongnuoc = màn XEM 2018 (controller *_ThanhVien, chỉ đọc) dùng chung BB.xemMan.
Tự chốt:
- XNKK: khung chỉ xem + nút "Xác nhận sản phẩm" (gốc không có Lưu).
- Đơn vị → Thành viên khoá (mọi màn).
- QT ghi thành viên gửi thêm strNCKH_TinhDiem_KeHoach_Id rỗng + strChucNang_Id (khối CCB).
- QT Thêm mới lưu xong về danh sách (gốc hỏi "tiếp tục thêm?" không giữ id).
- QT TCQT Hệ số IF dấu phẩy → chấm như CCB.
- Thông tin sách: ISBN không bắt buộc (gốc không kiểm).
- XNKK Tải file gộp tệp các dòng trang đang xem.
- baibaoquocte bỏ ô "Tất cả thời gian" (không nạp/gửi).
Lỗi gốc sửa: QT TCQT sửa đổ cột ISI vào "Số tác giả trong trường"; hộp Tìm bài báo gọi getList_TCQG_Full không tồn tại; Thông tin sách ô Vai trò không gửi → strVaiTro_Id, "Lưu và Nhập tiếp" chỉ xoá trắng → lưu rồi xoá; XNKK ô Tình trạng không nạp → NCKH.XNKK; baibaotrongnuoc ô lọc nạp id không tồn tại, lĩnh vực đổ nhầm nhãn, ảnh thành viên đọc data.ANH.
Dữ liệu: nhắc lại id ThemMoi ≠ cột ID danh sách (ảnh hưởng gắn thành viên/tệp) — đã có ở CCB.
Cờ đề xuất _sanpham.js: N.man cfg.loc, nam:false + ds(f) mọi ô lọc, cfg.viet, saveAgain, item chỉ tên; N.thanhVien guiKeHoach:false, tuThemKhiChep; N.deTai nguon; công khai themNutTim.
Nợ: khung XNKK ≥4 bản (_bb_xacnhan, nckhGT.xacNhan, _hd_xacnhan, _dt_detai) → gộp; hộp nút lớn .bb-xn; ums.ref.thanhVien; ums.files liệt kê tệp; crud master ô lọc phụ thuộc + nút Viết lại.

# Chốt ngày 2026-09-29 — Thi phách (ApisThiPhach, 18 màn)

7 tác tử con (A–G), mọi màn `kehoach/*` chung MỘT module nên tệp chung đặt tiền tố theo nhóm (`_tp_duyet`, `_tp_tui`, `_tp_nd`, `_tp_pq`,
`_tp_cham`, `_tp_kt`, `_tp_tk`). Kiểm toàn phân hệ `vt=R14&tien=TP`: kiem-dong-bo 18/18; thu-crud 16/18 (`tuibaitc`, `tuibai` — "Thêm mới"
bị chặn tới khi chọn Môn thi ở bộ lọc như gốc, đúng thiết kế; 16 màn còn lại harness báo "ok []" = KHÔNG bấm được thao tác nào vì không
phải màn crud — luồng ghi dò riêng bằng trang dò); kiem-cot-trai 1/1 (chỉ danh mục có cột trái); biểu tượng 0 lệch / 1404 tệp.
Hồi quy sau khi nhóm C thêm tuỳ chọn `them(k)` vào CCB `nhapdiem/_chung.js` (`ums.nd.locThi`): CCB 152/152, QLD 41/41, TS 15/15, DKH 24/24.
CHƯA kiểm host. Ba màn không có trên menu host vẫn chuyển: `baocaothi`, `tuibai`, `xacnhan`. Tệp gốc `kehoach/script/lophocphan.js`
không html nào nạp — không chuyển.
Kiểm trên host (tự chốt, không để sổ): lọc theo Hệ ở `duyetdulieuthi` (khoá tham số gốc có hai dấu cách cuối); tên cột "Đơn vị" bảng cán bộ
ở ba màn phân quyền (`COCAUTOCHUC_TEN` ‖ `DAOTAO_COCAUTOCHUC_TEN`); danh mục `CHUNG.HANHDONG`, `THI.PHACH.QUYTACTAOTUI`, `THI.PHACH.QUYTACTAOPHACH`
có dữ liệu; `LayDotTaoPhach` với bộ lọc rỗng trả gì; `raw.Id` sau `TP_DotPhach/ThemMoi`, `TP_TuiBai/ThemMoi`; ID dòng ở chế độ "Xem kết quả" của chấm
kiểm tra có đúng ID mà Xoa chờ; lời ĐỌC mới lịch sử `TP_XacNhanSauThi/LayDanhSach` (xacnhan); `strNguoiThuVai_Id` của thống kê.

## Nhóm A — duyetdulieuthi, hannhapdiem — 2/2
Tệp: `_tp_duyet.js` (`ums.tpDuyet.man(root, { kieu: 'duyet' | 'han' })`) + demo + css; hai tệp màn mỏng. Nạp chéo css `.nd-xn` của CCB nhapdiem.
Tự chốt:
- Khoá tham số `strDaoTao_HeDaoTao_Id` kèm hai dấu cách cuối của `LayDSLopHocPhan`: giữ nguyên văn như gốc (sửa là đổi dữ liệu trả về).
- Công bố lịch thi: thêm hỏi lại trước khi ghi; xác nhận trạng thái SV không hỏi thêm (hộp đã ghi "Áp dụng cho N mục").
- "Tạo dữ liệu xếp lịch thi", "Công bố lịch thi" giữ trong thanh lọc như gốc; "Hủy dữ liệu xếp lịch thi" = `ui.xoaChon`.
- Nút "Xóa" khung "Thông tin danh sách" (gốc không xử lý): giữ, khoá. Ô "Hạn nộp" giữ ô chữ thường; ô đã sửa tô nền; chỉ gửi ô đã đổi.
- Nút "Xem" luôn hiện, nạp xong thành "Xem N" (đỏ khi N ≠ Số SV); công thức đầy đủ ở `title` thay popover.
- Một nút "Import Vi phạm điều kiện thi" thay ô thả xuống một mục; mở màn không tự tải; đếm người học mỗi lớp một lời gọi, 6 luồng.
- `hannhapdiem`: không dựng vùng "Công bố thi" (html gốc không có nút mở), không ô đánh dấu cột thành phần.
- Hệ → Khoá ("Tất cả …"), Loại điểm → Đợt thi (hai cha): lọc tuỳ chọn, không khoá; Thời gian → Kế hoạch → Học phần, Thời gian → Đợt thi → Học phần: khoá.
Lỗi gốc đã sửa: công bố xong gọi `me.getList_KhaoThi()` không tồn tại (TypeError) → nạp lại danh sách thi; `hannhapdiem` thân bảng vẽ thừa SOSV
(lệch một cột); câu hỏi lại ghi ngược "tạo N và hủy 0"; tiêu đề "Thông tin danh sách - " trống tên; `actionTable` lỗi JS mỗi lần cuộn.
Đường ghi mới: không. Chưa kiểm: chia lô 30 / ngưỡng 500, tải tệp import, ảnh soát mắt.

## Nhóm B — tuibaitc, tuibai — 2/2
Tệp: `_tp_tui.js` (`ums.tpTui`: bộ lọc, danh sách + biểu mẫu đợt phách) + `_tp_tui_tui.js` (vùng đánh túi + 4 hộp) + demo + css; cờ `kieu: 'tc' | 'cu'`.
Tự chốt:
- `tuibaitc` Lưu đợt phách vẫn gọi `TP_QuyTacTu_SoPhach/ThemMoi` với quy tắc / bước nhẩy RỖNG như gốc (có thể xoá trắng quy tắc của đợt tạo từ màn cũ).
- `TP_QuyTacTu_SoPhach` luôn `ThemMoi` kể cả khi sửa; `CapNhat` đợt phách gửi Đợt thi / Thời gian theo BỘ LỌC như gốc.
- DS "chưa gán đợt" / "chưa gán túi": bộ lọc trống thì dùng `THI_DOTTHI_ID` của đợt phách đang sửa (gốc gửi rỗng).
- "Xóa đợt phách" gọi `TP_DotPhach/Xoa` (nút gốc đang chạy); `TP_ThongTin/Xoa_Thi_DotPhach` không nút nào gọi → không dùng.
- Đổi Môn thi tự tải danh sách; mọi nút ghi hỏi lại; Sinh số phách chạy TUẦN TỰ từng túi (gốc bắn song song).
- Ô phân đoạn hộp Thêm túi (gốc luôn ẩn) nay hiện khi có quy tắc phân đoạn, mặc định rỗng = giá trị gốc đang gửi.
- Hệ → Đợt thi: lọc tuỳ chọn, không khoá; chuỗi Thời gian → Loại điểm → Hình thức → Đợt thi → Môn thi: khoá.
Lỗi gốc đã sửa: biểu mẫu tc ô "Đợt thi" đổ tên MÔN THI; ô từ khoá không gửi → lọc tại chỗ; thêm/xoá DST nạp lại 3 lần (một lần id rỗng đổ nhầm bảng);
thêm mới / lưu túi quay về trước khi gán DST xong; xoá túi nhảy về danh sách đợt phách; `arrValid` kiểm ô không tồn tại. Bỏ `btnSearchTest` (gọi 1000 lần).
Đường ghi mới: không. Chưa kiểm: báo cáo / import thật, ảnh soát mắt.

## Nhóm D — phanquyennhapdiem, phanquyennhapdiemdst, phanquyennhapdiemlhp — 3/3
Tệp: `_tp_pq.js` (`ums.tpPq.man`) + `_tp_pq_nhap.js` (vùng nhập điểm + xác nhận) + `_tp_pq_lhp.js` (lọc + hộp SV bản Lớp HP) + demo + css; ba tệp cấu hình.
Nạp chéo CCB `ums.nd` (`locThi`, `xacNhanNut`…), DKH `ums.lhp.hopPhamVi`.
Tự chốt:
- Màn phân quyền Túi / DST gốc là bản chép màn nhập điểm → bấm dòng vẫn mở lưới NHẬP ĐIỂM: giữ như gốc.
- Ba vùng (chi tiết / Phân quyền / DS quyền) THAY CHỖ cả trang như gốc (bản CCB dùng hộp thoại).
- Lưu phân quyền: hỏi lại kèm tổng số lượt ghi, `ui.batch` 5 luồng; lưu xong ở lại vùng Phân quyền; đổi Đơn vị bỏ dấu cán bộ đã chọn (như gốc).
- Hộp Xác nhận = `ums.nd.xacNhanNut`; hai mã `XACNHAN_HOANTHANH_DIEMTUIBAI` / `…DIEM_TUIBAI` giữ nguyên.
- Báo cáo gửi `strDanhSachThi_Id` = dòng mở gần nhất kể cả sau khi Đóng (như gốc).
- Lớp HP: ô chọn nhiều gửi chuỗi nối phẩy; "Hủy danh sách nhập điểm" = `ui.xoaChon`; Tạo / Hủy có hỏi lại; Hệ, Khoá, CT, Học phần ("Tất cả …") không khoá,
  Thời gian → Kế hoạch khoá; nút "Thêm" ở DS phân quyền (gốc không xử lý) giữ, khoá; bỏ vùng "Dồn lớp" (mã chết).
Lỗi gốc đã sửa: bảng trái vùng Phân quyền bản DST / Lớp HP luôn trống (Lưu đọc ô đánh dấu danh sách ngoài đang ẩn) → hiện đúng dòng đã chọn;
`#btnYes` gắn thêm trình xử lý mỗi lần bấm; phân trang bảng cán bộ trỏ hàm màn khác; ô "Số đã đăng ký" gõ chữ gửi NaN → -1.
Đường ghi mới: không. Chưa kiểm: bấm chạy nút báo cáo.

## Nhóm E — chamkiemtradst, champhach — 2/2
Tệp: `_tp_cham.js` (`ums.tpCham.man`, `COT.dst / .tui`) + demo + css; nạp chéo `ums.nd.locThi`.
Tự chốt:
- Cột "Điểm" của `chamkiemtradst` gốc vẽ ô nhập nhưng Lưu chỉ gửi `strId` → hiện chữ; `champhach` bỏ ô từ khoá (không lời gọi nào gửi).
- Lưu / Xóa dùng được ở cả ba chế độ như gốc; tiêu đề ghi tên chế độ đang xem; đổi ô lọc thì bảng về lời nhắc.
- Ba nút: Lấy ngẫu nhiên (primary), Lấy theo danh sách, Xem kết quả (bỏ màu đỏ của gốc); ô phần trăm trống gửi -1 như gốc; báo cáo lên đầu trang.
Lỗi gốc đã sửa: `#btnYes` gắn lại mỗi lần (lần n gửi n lượt); nạp lại sau mỗi dòng → một lần sau cả lô. Bỏ mã chết `D_XacNhan/*`, `getList_TuiThi`.
Đường ghi mới: không. Chưa kiểm: Xuất báo cáo / Import; ảnh `champhach`.

## Nhóm F — phuckhao, khaothicapnhat, xacnhan — 3/3
Tệp: ba tệp màn + demo; `_tp_kt.js` (`ums.tpKt`: `cotChon`, `xacNhan` hộp nút lớn…) + css. Khung Học bổng `ums.hbKh` KHÔNG dùng lại được (không trùng lời gọi).
Tự chốt:
- `phuckhao`: ô từ khoá (gốc không gửi) lọc tại chỗ; sửa thời hạn chỉ hiện tên đợt thi; thêm thời hạn bỏ khoá `strId` như gốc; nút Xóa thời hạn giữ, khoá (sổ dữ liệu).
- `khaothicapnhat`: Công bố lịch có hỏi lại; hai hộp vi phạm gửi ID dòng dưới tên `strThi_DanhSachThi_Id`, cột "Hình thức" đổ `TRANGTHAI` — giữ như gốc;
  Import = một nút cố định `IMPORTWITHPROC_VPQCT`; Loại điểm / Học phần / Ca thi là cha tuỳ chọn (không khoá), Thời gian → Đợt thi → (Học phần, Ca thi, DS thi) khoá.
- `xacnhan`: chuyển đúng theo mã đang có (nút tình trạng từ `TN_XacNhan`); ô từ khoá nay gửi `strTuKhoa`; lịch sử nạp `TP_XacNhanSauThi/LayDanhSach` (lời ĐỌC mới);
  "Hủy xác nhận tình trạng" giữ, khoá (gốc không gọi máy chủ); không cặp cha → con (gốc nạp bốn ô với tham số rỗng).
Lỗi gốc đã sửa: `phuckhao` bảng thời hạn đổ MA / TEN ngược tiêu đề, biểu đồ vẽ vào vùng không tồn tại (bỏ), nút Tìm gắn hai trình xử lý;
`khaothicapnhat` thiếu tiêu đề "Hình thức thi" (lệch cột), xác nhận một dòng lỗi JS (`i` chưa khai báo); `xacnhan` lệch cột, bỏ mã chết `TN_KeHoach/*`.
Đường ghi mới: không. Chưa kiểm: báo cáo / import, thống kê theo khoa QLHP, chọn nhiều đợt thi, đổi trang `xacnhan`.

## Nhóm G — tracuulichthi, thongketinhtrangtochucthi, baocaothi, danhmuc/danhmucdulieu — 4/4
Tệp: ba màn + demo, css `_tp_tk.css`; danh mục chỉ html nạp CHÍNH tệp Đăng ký học (gốc lệch lớp CSS).
Tự chốt:
- `thongke`: ô "Từ khóa" (gốc vô tác dụng) lọc tại chỗ theo mã / tên học phần; bỏ cột ô đánh dấu (không thao tác nào đọc); không vẽ nút báo cáo (js gốc không nạp mẫu);
  `strNguoiThuVai_Id` gửi `ums.session.userId`.
- `baocaothi`: ô Bộ môn giữ như gốc, không gửi; không phân trang; mở màn không tự tải; viết riêng bản nối tầng (nguồn thời gian `LayThoiGianTatCa`).
- `tracuulichthi`: giờ thi "07:00 -> 09:00"; tên cột lệch tiêu đề chép nguyên; `strDaoTao_HocPhan_Id` rỗng như gốc.
Lỗi gốc đã sửa: `baocaothi` danh sách học phần đổ vào ô không tồn tại → ô Học phần luôn rỗng; nay đổ đúng ô (lọc và báo cáo nhận được học phần — KHÁC hệ đang chạy).
Đường ghi mới: không. Chưa kiểm: chạy một mẫu báo cáo; Sửa / Xoá danh mục (tệp DKH đã kiểm ở phân hệ khác).

## Nợ tầng chung (gom từ các nhóm)
- Bộ lọc `TP_Chung` năm tầng: `ums.nd.locThi` (CCB, nay có `them(k)`), `ums.thi.loc`, `ums.tpTui.boLoc`, bản trong `baocaothi.js` → gộp một bản có cờ nguồn thời gian + Hệ.
- Hộp tình trạng nút lớn + nội dung + lịch sử: thêm `ums.tpDuyet` `hopTinhTrang`, `ums.tpKt.xacNhan` → mở rộng `ums.nd.xacNhanNut` nhận `nut()` / `lichSu()` / `luu()`.
- Vùng nhập điểm theo túi / theo DST: `_tp_pq_nhap.js` ≈ CCB `tuibai.js` + `_dst.js` ≈ hai màn nhập điểm Thi phách → gộp một khung (hộp thoại hay thay chỗ trang là cờ).
- `ui.table`: cột ô đánh dấu + chọn tất cả (thêm 5 bản tự viết), phân trang máy khách; lọc dòng tại chỗ không dấu → `ums.ui.locBang`.
- `pat.filterBar`: nhiều nút trên một hàng, ô chọn có lựa chọn tĩnh, lưới 4 ô / hàng; hàng đợi N luồng + gọi theo lô → `ums.util`.
- Khối "hai bảng chọn × danh mục quyền" (QLD `phanquyen/diem`, CMS `ums.pq`, `ums.tpPq`) → `ums.pat`; `ui.dialog` chưa có nút khoá.
- Harness: `thu-crud` báo "ok []" ở màn không crud (dễ hiểu nhầm là đã thử); `kiem-dong-bo` / `kiem-icon-chuan` cần thuộc tính đánh dấu nút hỏng-cố-ý.

## Nhóm C — nhapdiem (theo phách), nhapdiemdst — 2/2
Tệp: `_tp_nd.js` (`ums.tpNd`: `man`, `tungDong`, `canBoCham`, `cotChon`…) + ba tệp demo + css; hai tệp màn. Nạp chéo CCB `ums.nd` (`locThi`, `phim`, `oDoi`, `pool`,
`xacNhanNut`, `luuXacNhan`, `trangThai`). Sửa CCB `nhapdiem/_chung.js`: thêm tuỳ chọn `them(k)` cho `ums.nd.locThi` (mặc định không đổi gì).
Không dùng `ums.nd.bangDiem` (lưới theo công thức; hai màn này là bảng một cột điểm gọi `TP_XuLy`).
Tự chốt:
- Khung chi tiết THAY CHỖ danh sách như gốc (bản CCB dùng hộp thoại); Đóng khi còn điểm chưa lưu thì hỏi lại; đóng xong nạp lại danh sách.
- Nút Xóa trong hộp cán bộ chấm thi: giữ, khoá (gốc gọi `Xoa_Thi_GiaoVien_CoiThi` — thủ tục phân COI thi — và chưa từng chạy).
- Hộp cán bộ vẽ cột theo dữ liệu trả (có `CANBOCHAMTHI_HOTEN` thì Túi bài / Cán bộ chấm thi / Số bài); ô Ngày nhận bài đổ `NGAYNHANBAI` nếu có (tên cột theo màn Phân chấm thi).
- `strThi_GV_ChamThi_Id` của Ngày nhận bài = id đợt phách / id DST, báo cáo gửi `strDanhSachThi_Id` = dòng mở gần nhất — giữ như gốc.
- `nhapdiemdst`: đổi ô lọc không tự nạp (phải Tìm kiếm); lọc trạng thái nhập điểm tại chỗ theo `XACNHANHOANTHANHDIEMTHI`; `dLocKhongHoanThanhNhapDiem` cố định '0' như gốc.
- Dòng cấm thi (`CAMTHI_DUYETDKTHI` / `CAMTHI_VIPHAMQUYCHE` = 1) để trống ô điểm như gốc.
- Khoa quản lý → Môn thi: lọc tuỳ chọn, không khoá; chuỗi năm tầng `TP_Chung`: khoá.
Lỗi gốc đã sửa: bảng đợt phách lệch cột (3 tiêu đề / 5 cột); Ngày nhận bài lưu ở MỌI lần rời ô → chỉ khi đổi; hộp cán bộ chấm thi luôn trống (đổ vào bảng không có);
tình trạng từng bản ghi DST không bao giờ hiện (tra bằng ô không tồn tại); "Xác nhận theo túi" khi chưa có túi gửi id rỗng; xác nhận xong không nạp lại.
Đường ghi mới: không. Chưa kiểm: payload Báo cáo / Import, phân trang DST trên 10 dòng, ô chọn ngày thật.

---

# Chốt ngày 2026-09-29 — thay đổi của kho gốc (pull lần 3, merge `5018e138`)

18 tệp gốc đổi; xem `git diff 017d9453 5018e138 -- <tệp>`. Không sửa tệp gốc nào.

## Không chuyển (và vì sao)
- `Core/systemroot.js`, `Corei/systemroot.js`: tự tải lại trang khi có bản JS mới (bật cho mọi địa chỉ https), bật lại ghi log request ra console — việc của vỏ cũ. Nút "?" Cổng Help (`strHelpUrl`, `btnCongHelp`) còn nguyên sau gộp.
- `index.aspx`: CSS trang chọn vai trò của vỏ cũ (thẻ gọn hơn, bỏ nhãn nhóm).
- DKH `kehoachdangky/html/lophocphan.html`: vá CSS riêng của vỏ `indexi` (`.scroll-table-x` đè `display:none`) — `_v2` không có lớp này.
- TC `phieuthu/scripts/thutien.js`: hiện khung chứng từ ngay khi bấm, không chờ phôi tải — `_v2` vốn đã vậy (`TT.phieu.xem` đổi vùng trước khi nạp).

## SV hồ sơ — `hoso/script/_hsA.js` (4 màn: hoso_capnhat, hoso_danhsach, quanlytoanbo, xemhoso)
- Tự cắt khoảng trắng thừa ở mọi ô nhập của biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất": lúc rời ô và lần nữa ngay trước khi Lưu (bỏ hai đầu, gom
  nhiều khoảng trắng kể cả U+00A0 thành một). Bỏ qua ô đánh dấu, ô chỉ đọc / khoá, ô gắn `data-ze-khong-trim` — như gốc.
- Khác gốc: cắt xong ba ô Họ / Đệm / Tên thì ghép lại ô Họ tên đầy đủ (gốc gán `.value` không bắn sự kiện nên ô ghép giữ bản cũ).

## CCB Nhập điểm theo danh sách thi — `nhapdiem/script/_dst.js`
- Thêm cột "Xuất Excel" từng danh sách thi → `DSThi_<mã danh sách>.xlsx`, 12 cột, ba dòng thông tin gộp ngang như gốc; gọi riêng
  `TP_Chung/LayDSNguoiHocTheoDST`. Thư viện `assets/vendor/xlsx` thay ba địa chỉ CDN của gốc.
- Chỉ bản nhập có cột này; `nhapdiemdstbc` không (html gốc của nó không đổi, gốc vẽ cột thừa không tiêu đề).
- Cột ô đánh dấu vẫn là cột cuối, "Xuất Excel" đứng ngay trước.

## KHCT Chương trình – học phần — `chuongtrinhhocphan/script/cthp.js`
- Hai ô "Có áp dụng khai tương đương / khai thay thế theo từng sinh viên": đổi ô là lưu ngay, không hỏi lại (như gốc);
  `PKG_KEHOACH_THONGTIN2.CapNhat_MoHinh_ChuongTrinh`. ĐƯỜNG GHI MỚI, chưa chạy trên host.
- Xếp lại hàng nút như gốc (Xóa học phần dạt trái; kỳ dự kiến ┃ Import · Kế thừa · Chỉnh sửa thứ tự · Thêm học phần); riêng Tải lại vẫn là ↻ cuối nhóm.
- Dòng chương trình không có hai cột mô hình thì thêm cột sau khi lưu (gốc chỉ cập nhật khi đã có cột → đóng mở lại hiện sai).
- Đổi sang chương trình khác khi lời gọi đang chờ thì kết quả không ghi đè ô của chương trình mới.
- Tệp chung `ApisTaiChinh/Modules/hoatdong/script/cthp.js` KHÔNG sửa → Tài chính, Cổng cán bộ không đổi.
- Việc dữ liệu (đã ghi `can-quyet.js`): máy chủ có trả hai cột `MOHINH…THEOPHAMVI` chưa; cột thay thế "Có" là 1 hay 2.

## TS Kế hoạch tuyển sinh (new) — hộp "Kết quả đăng ký", `tuyensinh/script/_khtsn_kqdk.js`
- Chế độ Đầy đủ thêm 17 cột (nhóm "Hồ sơ & kế hoạch" 14 cột, "Hóa đơn (bổ sung)" 3 cột); tệp xuất thêm 17 cột.
- "Xuất kết quả" xuất đúng danh sách đang thấy; lọc ra 0 dòng thì xuất toàn bộ (như gốc).
- Phễu lọc khi đang gõ tìm: Đồng ý chỉ tính dòng đang hiện, nhãn "(Chọn tất cả kết quả tìm)" — bản `_v2` trước mắc đúng lỗi gốc vừa sửa.
- Thanh công cụ ghim khi cuộn (`.khtsn-kq__dinh`). Tệp xuất vẫn là `.xls` (`ums.ui.xuatXls`).
- Không có thông tin bí mật mới trong diff.

## CCB Lịch giảng đường (nhiều phòng học) — `lichgiang/script/lichgiangnhieuphonghoc.js` + `_nhieu.js`
- Bố cục gọn, ô lọc "Sức chứa (chỗ)", nhãn "N chỗ", lưới chia 5 module 3 tiết (ô không lịch hiện "Trống"), lịch tháng thành hộp thả,
  lật tháng không đổi tuần; mỗi lượt 10 phòng, tối đa 5 lời gọi cùng lúc, nhớ lịch 5 phút.
- Đổi lịch ngay trên màn (bấm ô "Trống" hoặc thẻ lịch của mình): dùng HỘP ĐỔI LỊCH CHUNG `_lichgiang_doilich.js` — chữ nút "Kiểm tra lịch trùng",
  kết quả hiện bằng thông báo nổi, bố cục cột cũ | cột "Đổi sang", `HOPLE` "0" = không hợp lệ (gốc mới coi chuỗi "0" là hợp lệ).
- Chỉ đổi sang phòng cùng loại LT / TH; ô "Trống" ai cũng bấm được — giữ như gốc.
- Xuất Excel / CSV theo module (5 dòng / phòng, gộp ô, tô màu ô có lịch).
- Tòa nhà → Phòng học vẫn không khoá (đã chốt từ trước). Mọi tuỳ chọn mới của `_nhieu.js` không truyền thì như cũ → màn giảng viên không đổi.
- Việc dữ liệu (đã ghi `can-quyet.js`): tên cột sức chứa của `LayDSPhongHoc`; `LayLichPhongHoc` có trả `IDLICHHOC` không.
- Chưa làm: bấm thử "Yêu cầu đổi lịch" trên 4 màn Lịch giảng dùng chung hộp sau khi hộp nhận thêm tuỳ chọn (mới kiểm mở màn không lỗi).

## Bộ thử
- `_harness/thu-crud.html` nhận thêm tên thủ tục `…_Create` / `…_Ins` (thêm) và `…_Update` / `…_Upd` (sửa) — trước báo nhầm màn Kế hoạch tuyển sinh.

## Nợ tầng chung (gom)
`ums.pat.panel` cần `headExtra`; ô bật / tắt lưu ngay kèm chữ Có / Không; `ums.lich.tao` cần "lật tháng không đổi tuần"; lớp cảnh báo chung
(`.lg-canhbao`); `ui.dialog` nút ẩn sẵn; hàng đợi N luồng thêm một bản (`chayNhom`); `_lichgiang_doilich.js` gắn `click` lên `document` mỗi lần nạp.

## Gỡ ngày 2026-09-30 — đã kiểm trên host, không còn là việc dữ liệu

- **Nhân sự → Tra cứu, in ấn → Nhân sự tuỳ chọn**: mục nhờ kiểm danh mục BACO.HTQT.NHSU và mẫu báo cáo. Kiểm host: danh mục có 30 dòng, màn hiện 31 cột, 960 cán bộ, có nút "Xuất excel". Gỡ khỏi sổ (chưa bấm xuất tệp; mẫu báo cáo lỗi thì khung "Lỗi máy chủ vừa gặp" tự hiện).
- **Nhân sự → Tra cứu, in ấn → Hồ sơ lý lịch**: mục nhờ kiểm danh mục CCB.BCTK. Kiểm host: danh mục có 6 dòng, chọn cán bộ là hiện nút in (Sơ yếu lý lịch, SYLL_2C_TUD, Lý lịch khoa học). Gỡ khỏi sổ.
- **Nhân sự → Quản lý quyết định**: mục "thêm quyết định báo thành công nhưng không hiện" từng giao quản lý CSDL. Kiểm host 30/9: máy chủ đọc tham số `iTrangThai` / `iThuTu`, bản gốc chỉ gửi `dTrangThai` / `dThuTu` nên lưu trạng thái 0. Sửa bằng MÃ: màn gửi cả hai tên (thử lời gọi trên host: lưu đúng trạng thái 1, đã xoá bản ghi thử). Gỡ khỏi sổ, ghi sổ lỗi mã chờ kiểm lại.
- **Tài chính → Khai định mức phí - áp dụng theo chương trình**: mục "Không thêm được mức phí (Du lieu khai khong hop le)" của 24/9. Kiểm host 30/9: thêm / sửa / xoá chạy đúng ở hệ Đào tạo khác và cả đúng tổ hợp cũ (Đại học chính quy, Khoá 17, Đợt học, Lệ phí tổ chức Lễ tốt nghiệp) — không tái hiện. Gỡ khỏi sổ. Câu từ chối đó máy chủ trả khi thiếu ô (chưa chọn chương trình / khoản / thời gian); màn nay kiểm ô bắt buộc trước khi gửi.
- **Tài chính → Khai báo phân bổ Doanh thu**: mục "mở màn là báo lỗi CSDL (ORA-24338)". Kiểm host 30/9: thủ tục danh sách chỉ lỗi khi CHƯA chọn Hệ đào tạo lẫn Chương trình. Sửa bằng MÃ: chưa chọn thì màn không gọi, nhắc chọn; bốn ô năm / kỳ / tháng kiểm là số trước khi gửi (gõ chữ là ORA-01722). Thêm + xoá một dòng khai phân bổ thử: sạch. Gỡ khỏi sổ, ghi sổ lỗi mã chờ kiểm lại.
- **Nhân sự → Quy định đóng bảo hiểm / Quy định nâng lương**: mục "không thêm được vì chưa có Bảng quy định lương, menu không có màn khai" (29/9) là SAI — màn "Bảng quy định lương" (`luong/mucluongcoban`) có trên menu host. Kiểm host 30/9 theo quy ước tự tạo dữ liệu phụ: tạo một bảng quy định lương thử → hai màn thêm / sửa / xoá sạch → xoá bảng thử. Gỡ khỏi sổ. Quy định phụ cấp thì máy chủ lỗi PLS-00306 (giữ mục, viết lại).
- **Nhân sự → Thiết lập bảng lương / bảng lương năm / điều kiện xét nâng lương — khối "Danh mục thành phần công thức"**: kiểm host 30/9 thấy (1) thêm xong bảng không hiện dòng mới vì danh sách theo mã bảng được máy chủ nhớ tạm ~20 giây; (2) Sửa báo thành công nhưng không đổi gì (bản gốc gọi ThemMoi kèm strId). Sửa bằng MÃ: nạp bằng danh sách theo ID bảng, Sửa dùng lời gọi sửa của màn Danh mục dữ liệu (đã thử trên host: đổi đúng). Ghi sổ lỗi mã chờ kiểm lại.

---

# Chốt ngày 2026-10-01 — thay đổi của kho gốc (pull lần 4 + 5, merge `cffda56e` + `c6886b05`)

Khoảng diff `fed68f6e..c6886b05`. 20 màn chạm tới: CCB 1, Cổng SV 18 (kể cả `profile/hoso` chỉ đổi chữ câu lỗi — `_v2` không có câu đó), 1 màn mới.
Không sửa tệp gốc nào. Kiểm (dữ liệu mẫu): CSV `kiem-dong-bo` 36/37 (lỗi đã biết "Hủy nộp trước" thanhtoanonline), `thu-crud` 37/37; CCB `kiem-dong-bo` 152/152.
CHƯA kiểm host.

## Vỏ — F5 khi đang thủ vai
- Gốc (`Core/systemroot.js`) nay F5 là THOÁT vai. `_v2` GIỮ vai qua F5 (`assets/js/thuvai.js` đặt lại `userId` đúng nên không gặp lỗi "Ma sinh vien khong ton tai" mà gốc tránh) — giữ cách `_v2`.

## CCB Lịch giảng đường (nhiều phòng học) — lọc phòng trống (`lichgiangnhieuphonghoc.js`, `_nhieu.js`, `_lichgiang_doilich.js`)
- Theo bản gốc MỚI NHẤT (khoảng ngày + thứ + tiết); ô một ngày `dropLoc_NgayTrong` của lần kéo 4 không chuyển (gốc đã thay).
- Ô Thứ và ô Tiết là ô chọn thường (danh sách ngắn), gốc dùng select2.
- Câu báo lọc (khoảng ngày không có thứ đã chọn, tối đa 31 ngày, máy chủ lỗi) hiện bằng thông báo nổi, chỉ khi còn phòng để hiện — như điều kiện `alert` của gốc.
- Lọc khoảng ngày: mỗi ngày một lời gọi, nhớ 5 phút theo ngày | tiết | loại phòng, tối đa 5 lời gọi cùng lúc; hộp đổi lịch hỏi phòng trống mỗi lần, không nhớ.
- Nút "Bỏ lọc" biểu tượng `fa-filter-circle-xmark` (không lẫn nút Đóng). Nhiều lượt tải chồng nhau: chỉ lượt mới nhất cập nhật kết quả (như `iLoadToken`).
- Chưa kiểm host: cột ID của `LAYPHONGHOCTRONG` (dò `ID` / `IDPHONGHOC` / `TKB_PHONGHOC_ID` như gốc).

## Cổng SV Lịch học (`thoikhoabieu/lichhoc`, khung chung `ums.tkbSV` + `ums.lich`)
- Đầu cột ngày chỉ số ngày (tuỳ chọn mới `ngayNgan`, CHỈ Cổng SV bật; CCB giữ ngày đủ vì gốc CCB không đổi).
- Ô lịch KHÔNG dịch 30px như gốc (gốc bù hàng tiêu đề nằm trong cột; lưới `ums.lich` không cần).
- Dãy tên cột bảng lớp không có lịch chi tiết: tên thật `MALOP` / `TENLOP` / `TENHINHTHUCHOC` lên đầu, giữ tên cũ phía sau.

## Cổng SV Đăng ký cơ sở đào tạo (`dangkyhoc/dangkycosodaotao`)
- Nhãn "Sang" khi đã bỏ chọn về rỗng hiện "Chưa chọn" (gốc rỗng). "Bỏ chọn" / "Hoàn tác" là nút thường (không mang lớp nút Đóng → Esc không bấm nhầm).
- Không có hồ sơ người học thì lùi về tên người đang thủ vai (như bản `_v2` cũ).
- Chưa kiểm host: tên cột `rsThongTinCoBan` / `rsDanhSachQHHT`; `DS_KH_NH` có trả `DA_DANGKY`, `COSODAOTAO_ID_DACHON` không.
- `congnhandiem` / `congnhandiemv3`: gốc chỉ bỏ bản vá select2 trong modal của vỏ cũ → `_v2` không cần đổi.

## Cổng SV Tự nhập hồ sơ (`profile/tunhaphoso`, `_profile.js` cờ `tuLuuAnh` / `theoNhom` / `tabCoTruong` / `locTren` — `hoso` không bật)
- Ô con của chuỗi `THONGTIN5` / `THONGTIN3` theo luật cha → con (đổi cha xoá trắng con, chưa chọn cha khoá con); gốc giữ giá trị cũ nếu còn trong danh sách lọc.
- "Lưu thông tin" vẫn lưu ảnh trước như gốc nhưng không báo riêng "Đã lưu ảnh đại diện" (bảng tiến độ đã báo).
- Nhận biết tải ảnh xong: bắt sự kiện chọn tệp rồi chờ đường dẫn ảnh đổi (tối đa 120 giây) — `ums.files.avatar` chưa có móc `onChange` (nợ tầng chung).
- Cột "Xác nhận" luôn có (gốc chỉ hiện khi có giá trị).

## Cổng SV Tin tức + Trang chính (`tintuc/_tintuc.js` xuất `ums.csvTinTuc.phanNhom / chiaNhom / nhomHtml / moRong`; dashboard nạp dùng lại)
- Không chép `crypto-js.js` / `jsaes.js`: `tintuc.js` gốc chỉ dùng AES trong đoạn đã chú thích bỏ.
- Dashboard phân nhóm tin theo bản `classify_TinTuc` của Tin tức (ưu tiên chuyên mục, sau mới đoán theo tên đơn vị).
- Chi tiết tin trả rỗng / lỗi: hiện dòng tin có sẵn (gốc để trống). Khối TIN QUAN TRỌNG (từ dữ liệu) giữ lại.
- Dashboard bỏ hẳn lưới lối tắt theo phân loại + khối "Giới thiệu" (gốc nay giấu mà vẫn gọi máy chủ) và không gọi hai lời gọi đó; khối "Sự kiện sắp tới" tĩnh không vẽ.
- Họ tên dải chào: người đang thủ vai → tên đăng nhập → "Sinh viên". Lối tắt vai trò chưa được cấp → câu báo "chưa được cấp".

## Cổng SV — 10 màn khác + màn mới (rà lại, đủ)
- `ums.diemHoc`: bấm cả dòng bảng điểm chỉ bật cho Cổng SV `diemhoc` và XLHV `kehoachxuly` (`ctdt: true`); CCB `DaQHHT` giữ nút Chi tiết. Câu "chưa có …" mới hiện ở mọi nơi dùng `mount`.
- Gốc đổi `resolveNguoiHocId` (khi nhúng chỉ đọc `main_doc.LichGiang.strSinhVien_Id`) → trang XLHV gốc rơi về id CÁN BỘ — lỗi gốc, `_v2` vẫn truyền id người học.
- `nguyenvong` chọn sẵn ngành đầu, Ngành bắt buộc, `pat.chain` Ngành → Kế hoạch → Kiểu học. `xacnhannhaphoc` đọc thêm tên cột VIẾT HOA của lịch sử.
- `tinhhinhhocphi` lùi về `QLSV_TRANGTHAINGUOIHOC_*` khi chưa có cột `TRANGTHAINGUOIHOC_N1_*`. `chuontrinhhoc` nhớ số tiết, không gọi lại mỗi lần gõ.
- Màn mới `dicvusinhvien/nguoihocxacnhanthanhtoan` (Cổng SV) nạp chéo tệp `_v2` phân hệ Sinh viên với `data-kieu="csv"`; bản Sinh viên giữ hành vi cũ.
- Chưa kiểm host: tên cột thật của `LayDS_LichSu_XacNhanCoSo` (gốc viết `ThoiGianThucHien`).
