/* =========================================================================
   Luận án — Bảo vệ luận văn
   Bản gốc: ApisLuanVanLuanAn/Modules/luanan/html/baoveluanvan.html + script/baoveluanvan.js
   Dùng khung chung ums.lvBaoVe.man (module luanvan/script/_lv_baove.js) — xem chú thích đầu tệp đó: lời gọi, tham số hoá, khác bản gốc.
   Riêng màn này (so với luanvan/baoveluanvan): hội đồng LVLA_BaoVe_HoiDong_KetQua (có Điểm), lịch LVLA_BaoVe_Lich KHÔNG có cột Phút,
   vai trò lấy danh mục LVLA.VTHD, KHÔNG có Đánh giá chung / Tổng điểm / tệp khoá luận / nút báo cáo / khối Đề tài sau bảo vệ,
   chọn người = hộp LLKH.
   Khác bản gốc: tiêu đề ô lọc gốc ghi "Tìm kiếm 2" → "Tìm kiếm".
   ========================================================================= */
(function () {
    var r = document.getElementById('lvla-luanan-baoveluanvan');
    if (!r) return;
    ums.lvBaoVe.man(r, {
        tieuDe: 'Bảo vệ luận văn', nhomHD: 'Danh sách hướng dẫn',
        tv: 'LVLA_BaoVe_HoiDong_KetQua', lich: 'LVLA_BaoVe_Lich',
        sanPham: 'LVLA_BaoVe_HoiDong_KQ', coDiem: true, picker: 'llkh',
        dmVaiTro: 'LVLA.VTHD', xacNhan: false, deTai: false
    });
})();
