/* =========================================================================
   Luận văn — Bảo vệ luận văn
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/html/baoveluanvan.html + script/baoveluanvan.js
   Dùng khung chung ums.lvBaoVe.man (_lv_baove.js) — xem chú thích đầu tệp đó: lời gọi, tham số hoá, khác bản gốc.
   Riêng màn này: hội đồng LVLA_BaoVe_HoiDong_KetQua (có Điểm), lịch LVLA_BaoVe_Lich (thêm cột Phút), Tổng điểm
   (Sua_LVLA_DeCuong_CT_Diem, khoá khi VMACACHLAY = TUNGTHANHVIEN), tệp khoá luận bản cuối (LVLA_Files),
   nút báo cáo của chức năng (ums.report.mount, không có vùng Import như gốc), chọn người = hộp LLKH.
   ========================================================================= */
(function () {
    var r = document.getElementById('lvla-luanvan-baoveluanvan');
    if (!r) return;
    ums.lvBaoVe.man(r, {
        tieuDe: 'Bảo vệ luận văn', nhomHD: 'Danh sách hướng dẫn',
        tv: 'LVLA_BaoVe_HoiDong_KetQua', lich: 'LVLA_BaoVe_Lich', suaDeTai: 'Sua_LVLA_DeTaiSauBaoVe',
        sanPham: 'LVLA_BaoVe_HoiDong_KQ', coDiem: true, coPhut: true, tongDiem: true, coTep: true, mauImport: true, picker: 'llkh'
    });
})();
