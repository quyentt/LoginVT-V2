/* Dữ liệu mẫu cho nhapdiemchamkiemtra (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function sv(i) {
        return { ID: 'R' + i, QLSV_NGUOIHOC_ID: 'SV' + i, QLSV_NGUOIHOC_MASO: 'SV220' + i, QLSV_NGUOIHOC_HODEM: ['Trần Minh', 'Lê Thu', 'Phạm Quốc', 'Ngô Bảo'][i % 4],
            QLSV_NGUOIHOC_TEN: ['Anh', 'Hà', 'Bảo', 'Châu'][i % 4], DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DAOTAO_HOCPHAN_MA: 'IT3100', DIEMBANDAU: '' };
    }
    var DS = [sv(1), sv(2), sv(3), sv(4)], KQ = { R2: 7.5 };
    var HP = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'Lập trình hướng đối tượng', MA: 'IT3100' }, { ID: 'HP2', TEN: 'Cơ sở dữ liệu', MA: 'IT3200' }] : []; };
    var LS = [];
    ums.demo.add({
        'TP_PhucKhao/LayThoiGianTheoDotThi': [{ ID: 'TG1', THOIGIAN: '2026_2027_1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }],
        'TP_PhucKhao/LayHocPhanPhucKhao': HP,
        'PKG_THI_PHACH_CHAMKT.LayHocPhanChamKT': HP,
        'TP_ChamKiemTra/LayDSThiChamKTNhapDiem': function () { return DS; },
        'TP_PhucKhao/LayDSThiPhucKhaoNhapDiem': function () { return DS; },
        'TP_ChamKiemTra/LayDiemChamKT': function (o) { return KQ[o.strThi_DanhSachThi_TuiBai_Id] !== undefined ? [{ DIEM: KQ[o.strThi_DanhSachThi_TuiBai_Id] }] : []; },
        'TP_PhucKhao/LayDiemPhucKhao': function (o) { return KQ[o.strThi_DanhSachThi_TuiBai_Id] !== undefined ? [{ DIEM: KQ[o.strThi_DanhSachThi_TuiBai_Id] }] : []; },
        'TP_ChamKiemTra/CapNhatThi_ChamKT_KetQua': function (o) { KQ[o.strThi_DanhSachThi_TuiBai_Id] = o.strDiem; return []; },
        'TP_PhucKhao/CapNhatThi_PhucKhao_KetQua': function (o) { KQ[o.strThi_DanhSachThi_TuiBai_Id] = o.strDiem; return []; },
        'D_HanhDongXacNhan/LayDanhSach': [{ ID: 'HDX1', TEN: 'Hoàn thành', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #198754' },
            { ID: 'HDX2', TEN: 'Hủy hoàn thành', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc3545' }],
        'D_XacNhan/LayDSDiem_XacNhan': function (o) { return LS.filter(function (x) { return x.id === o.strDuLieuXacNhan; }); },
        'D_XacNhan/Them_Diem_XacNhan': function (o) { LS.unshift({ id: o.strDuLieuXacNhan, TEN: o.strHanhDong_Id === 'HDX1' ? 'Hoàn thành' : 'Hủy hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Văn Quản', NGAYTAO_DD_MM_YYYY: '25/09/2026' }); return []; }
    });
})();
