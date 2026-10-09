/* nhapdiemphuckhao — khung chung: _kiemtra.js (bản gốc: nhapdiemphuckhao.js). Ba bảng theo PHANLOAI: rỗng / DST / TUI. */
(function () {
    ums.nd.kiemTra(document.getElementById('nd-nhapdiemphuckhao'), {
        tieuDe: 'Nhập điểm phúc khảo', loai: 'XACNHAN_HOANTHANH_PHUCKHAO', chia: true, dinhDang: true, baoCao: true,
        hocPhan: { action: 'XLHV_TP_PhucKhao_MH/DSA4CS4iESkgLxEpNCIKKSAuBTQ4JDUP', func: 'PKG_THI_PHACH_PHUCKHAO.LayHocPhanPhucKhaoDuyet' },
        dsAction: 'TP_PhucKhao/LayDSThiPhucKhaoNhapDiem', diemAction: 'TP_PhucKhao/LayDiemPhucKhao', luuAction: 'TP_PhucKhao/CapNhatThi_PhucKhao_KetQua'
    });
})();
