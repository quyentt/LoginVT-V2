/* =========================================================================
   Luận văn — Bảo vệ cấp cơ sở
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/html/baovecapcoso.html + script/baovecapcoso.js
   Dùng khung chung ums.lvBaoVe.man (_lv_baove.js) — xem chú thích đầu tệp đó: lời gọi, tham số hoá, khác bản gốc.
   Riêng màn này: hội đồng LVLA_BaoVe_CoSo_HoiDong_ThanhVien (có cột Điểm), lịch LVLA_BaoVe_CoSo_Lich (Ngày · Giờ · Địa điểm),
   đề tài sau bảo vệ Sua_LVLA_CS_DeTaiSauBaoVe, chọn người = ums.pat.pickNhanSu, không Tổng điểm / tệp / báo cáo.
   ========================================================================= */
(function () {
    var r = document.getElementById('lvla-luanvan-baovecapcoso');
    if (!r) return;
    ums.lvBaoVe.man(r, {
        tieuDe: 'Bảo vệ cấp cơ sở', nhomHD: 'Danh sách hướng dẫn chính thức',
        tv: 'LVLA_BaoVe_CoSo_HoiDong_ThanhVien', lich: 'LVLA_BaoVe_CoSo_Lich', suaDeTai: 'Sua_LVLA_CS_DeTaiSauBaoVe',
        sanPham: 'LVLA_BaoVe_CoSo_HoiDong_TV', coDiem: true, picker: 'nhanSu'
    });
})();
