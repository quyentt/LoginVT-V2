/* nhapdiemchamkiemtra — khung chung: _kiemtra.js (bản gốc: nhapdiemchamkiemtra.js) */
(function () {
    ums.nd.kiemTra(document.getElementById('nd-nhapdiemchamkiemtra'), {
        tieuDe: 'Nhập điểm chấm kiểm tra', loai: 'XACNHAN_HOANTHANH_CHAMKIEMTRA',
        hocPhan: { action: 'TP_PhucKhao/LayHocPhanPhucKhao', method: 'GET' },
        dsAction: 'TP_ChamKiemTra/LayDSThiChamKTNhapDiem', diemAction: 'TP_ChamKiemTra/LayDiemChamKT', luuAction: 'TP_ChamKiemTra/CapNhatThi_ChamKT_KetQua'
    });
})();
