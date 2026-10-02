/* Dữ liệu mẫu cho biendong — chỉ dùng ở chế độ dựng thử. */
(function () {
    var TK = [{ TUKHOA: '#NGAYCONG#', TENTUKHOA: 'Ngày công' }, { TUKHOA: '#TRUYLINH#', TENTUKHOA: 'Truy lĩnh' }, { TUKHOA: '#TAMUNG#', TENTUKHOA: 'Tạm ứng' }];
    var DONG = [
        { ID: 'BD1', NHANSU_HOSOCANBO_ID: 'NS1', NHANSU_HOSOCANBO_MASO: 'CB001', NHANSU_HOSOCANBO_HODEM: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NGAYAPDUNG: '01/09/2026' },
        { ID: 'BD2', NHANSU_HOSOCANBO_ID: 'NS2', NHANSU_HOSOCANBO_MASO: 'CB015', NHANSU_HOSOCANBO_HODEM: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Mai', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế', NGAYAPDUNG: '01/09/2026' },
        { ID: 'BD3', NHANSU_HOSOCANBO_ID: 'NS3', NHANSU_HOSOCANBO_MASO: 'CB102', NHANSU_HOSOCANBO_HODEM: 'Lê Quang', NHANSU_HOSOCANBO_TEN: 'Minh', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', NGAYAPDUNG: '15/09/2026' }
    ];
    var GT = { 'NS1|#NGAYCONG#': ['G1', '22'], 'NS2|#NGAYCONG#': ['G2', '20'], 'NS1|#TRUYLINH#': ['G3', '350000'], 'NS3|#TAMUNG#': ['G4', '1000000'] };
    ums.demo.add({
        'L_TuKhoa_GiaTri/LayDSNhanSu_L_TuKhoa': TK,
        'L_TuKhoa_GiaTri/LayDanhSach': function (o) { return DONG.filter(function (r) { return !o.strNhanSu_HoSoCanBo_Id || r.NHANSU_HOSOCANBO_ID === o.strNhanSu_HoSoCanBo_Id; }); },
        'L_TuKhoa_GiaTri/LayGiaTriNhanSu_L_TuKhoa': function (o) {
            var g = GT[o.strNhanSu_HoSoCanBo_Id + '|' + o.strTuKhoa];
            return g ? [{ ID: g[0], TUKHOA: o.strTuKhoa, TUKHOA_GIATRI: g[1] }] : [];
        },
        'L_TuKhoa_GiaTri/ThemMoi': [],
        'L_TuKhoa_GiaTri/CapNhat': [],
        'L_TuKhoa_GiaTri/Xoa': [],
        'L_TuKhoa_GiaTri/KeThua': []
    });
})();
