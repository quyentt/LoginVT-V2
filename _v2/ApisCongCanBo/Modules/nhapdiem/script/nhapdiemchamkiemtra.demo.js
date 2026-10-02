/* Dữ liệu mẫu cho nhapdiemchamkiemtra / nhapdiemphuckhao — chỉ dùng ở chế độ dựng thử. */
(function () {
    function sv(i, pl) {
        return { ID: 'R' + i, QLSV_NGUOIHOC_ID: 'SV' + i, QLSV_NGUOIHOC_MASO: 'SV220' + i, QLSV_NGUOIHOC_HODEM: ['Trần Minh', 'Lê Thu', 'Phạm Quốc', 'Ngô Bảo'][i % 4], QLSV_NGUOIHOC_TEN: ['Anh', 'Hà', 'Bảo', 'Châu'][i % 4],
            DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_LOPHOCPHAN_TEN: 'IT3100.01', DIEM: 6.25 + i, DIEMBANDAU: '',
            PHANLOAI: pl, NGAYTHI: '06/01/2027', CATHI_TEN: 'Ca 2', PHONGTHI_TEN: 'A2-301', SOBAODANH: '0' + i, TUI: 'Túi ' + i, SOPHACH: 'P' + (100 + i) };
    }
    var DS = [sv(1, null), sv(2, 'DST'), sv(3, 'DST'), sv(4, 'TUI')], KQ = { R2: 7.5 };
    ums.demo.add({
        'TP_PhucKhao/LayThoiGianTheoDotThi': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }],
        'TP_PhucKhao/LayHocPhanPhucKhao': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'IT3100 - Lập trình HĐT' }] : []; },
        'PKG_THI_PHACH_PHUCKHAO.LayHocPhanPhucKhaoDuyet': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'IT3100 - Lập trình HĐT' }] : []; },
        'TP_ChamKiemTra/LayDSThiChamKTNhapDiem': function () { return DS.slice(0, 3).map(function (x) { var y = Object.assign({}, x); y.PHANLOAI = null; return y; }); },
        'TP_PhucKhao/LayDSThiPhucKhaoNhapDiem': function () { return DS; },
        'TP_ChamKiemTra/LayDiemChamKT': function (o) { return KQ[o.strThi_DanhSachThi_TuiBai_Id] !== undefined ? [{ DIEM: KQ[o.strThi_DanhSachThi_TuiBai_Id] }] : []; },
        'TP_PhucKhao/LayDiemPhucKhao': function (o) { return KQ[o.strThi_DanhSachThi_TuiBai_Id] !== undefined ? [{ DIEM: KQ[o.strThi_DanhSachThi_TuiBai_Id] }] : []; },
        'TP_ChamKiemTra/CapNhatThi_ChamKT_KetQua': function (o) { KQ[o.strThi_DanhSachThi_TuiBai_Id] = o.strDiem; return []; },
        'TP_PhucKhao/CapNhatThi_PhucKhao_KetQua': function (o) { KQ[o.strThi_DanhSachThi_TuiBai_Id] = o.strDiem; return []; },
        'D_HanhDongXacNhan/LayDanhSach': [{ ID: 'HDX1', TEN: 'Hoàn thành' }],
        'D_XacNhan/LayDSDiem_XacNhan': function (o) { return o.strDuLieuXacNhan === 'R1' ? [{ TEN: 'Hoàn thành', NGUOIXACNHAN_TENDAYDU: 'Giảng viên', NGAYTAO_DD_MM_YYYY: '20/09/2026' }] : []; },
        'D_XacNhan/Them_Diem_XacNhan': []
    });
})();
