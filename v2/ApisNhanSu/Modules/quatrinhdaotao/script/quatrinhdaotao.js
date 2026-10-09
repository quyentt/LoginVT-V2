/* =========================================================================
   Quá trình đào tạo — bản QUẢN TRỊ (cán bộ nhân sự chọn một người rồi xem/sửa)
   Bản gốc: ApisNhanSu/Modules/quatrinhdaotao/script/quatrinhdaotao.js (4.798 dòng —
   ~3.000 dòng là mã chết chép từ màn hồ sơ: tiểu sử, quan hệ gia đình, Đảng, Đoàn,
   công đoàn, học hàm, danh hiệu… không có trên màn này).
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái ums.nsCanBo (getList_NhanSu dLaCanBoNgoaiTruong 0, lọc
   Khoa/Viện/Phòng ban → Bộ môn, Tình trạng làm việc); cột phải DÙNG LẠI khung Cổng
   cán bộ ums.ccbQtDaoTao (năm tab, sáu khung: Đào tạo + Gia hạn / Tiến độ, Bồi dưỡng,
   Học vị, Trình độ chính trị / tin học / ngoại ngữ) với:
     · strNhanSu_HoSoCanBo_Id = người ĐANG CHỌN (me.strNhanSu_Id) — mọi LayDanhSach /
       ThemMoi / CapNhat, cả lưới Gia hạn / Tiến độ;
     · cờ quanTri: nhãn tab đánh số như gốc NS; khung Bồi dưỡng bản NS (có Loại QĐ,
       Ngày áp dụng / hiệu lực / hết hiệu lực, id quyết định ẩn — xem quatrinhdaotao.js CCB).
   Lời gọi và điểm đã sửa lỗi gốc: chú thích đầu tệp CCB (giống hệt bản NS).

   Không chuyển: khung "Danh sách dự kiến sắp hết hạn đào tạo"
   (NS_QT_BoiDuong/LocDSNhanSu_QT_DATO_DenHan) — bản gốc nạp lúc mở màn nhưng
   toggle_notify ẩn mọi .zone-bus (khung đích zone_notify_HetHanDaoTao không tồn tại)
   và không có nút nào mở lại → KHÔNG BAO GIỜ HIỆN.
   ========================================================================= */
(function () {
    'use strict';

    ums.nsCanBo.man(document.getElementById('nsquatrinhdaotao'), {
        tieuDe: 'Quá trình đào tạo',
        onChon: function (row, host) {
            ums.ccbQtDaoTao.mount(host, {
                tieuDe: false,
                quanTri: true,
                nhanSuId: function () { return row.ID; }
            });
        }
    });
})();
