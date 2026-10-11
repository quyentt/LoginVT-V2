/* =========================================================================
   Luận văn — Bảo vệ cấp trường
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/html/baovecaptruong.html + script/baovecaptruong.js
   Dùng khung chung ums.lvBaoVe.man (_lv_baove.js) — xem chú thích đầu tệp đó: lời gọi, tham số hoá, khác bản gốc.
   Riêng màn này: hội đồng LVLA_BaoVe_Truong_HoiDong_ThanhVien KHÔNG có cột Điểm (gốc comment cột, dDiem gửi rỗng),
   lịch LVLA_BaoVe_Truong_Lich, đề tài sau bảo vệ Sua_LVLA_Truong_DeTaiSauBaoVe, chọn người = hộp LLKH (genModal_LLKH).
   Khác bản gốc: tiêu đề khung chi tiết gốc chép nhầm "Bảo vệ luận văn" → ghi đúng "Bảo vệ cấp trường".
   ========================================================================= */
(function () {
    var r = document.getElementById('lvla-luanvan-baovecaptruong');
    if (!r) return;
    ums.lvBaoVe.man(r, {
        tieuDe: 'Bảo vệ cấp trường', nhomHD: 'Danh sách hướng dẫn chính thức',
        tv: 'LVLA_BaoVe_Truong_HoiDong_ThanhVien', lich: 'LVLA_BaoVe_Truong_Lich', suaDeTai: 'Sua_LVLA_Truong_DeTaiSauBaoVe',
        sanPham: 'LVLA_BaoVe_Truong_HoiDong_TV', coDiem: false, picker: 'llkh'
    });
})();
