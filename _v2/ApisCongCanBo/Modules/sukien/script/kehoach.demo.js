/* Dữ liệu mẫu cho sukien/kehoach — chỉ dùng ở chế độ dựng thử. Hộp chọn sinh viên dùng mẫu chung ở demo-data.js. */
(function () {
    var C = 'SV_SuKien/';
    var KH = [
        { ID: 'SKH1', TENKEHOACH: 'Tuần sinh hoạt công dân đầu khoá 2026', HIEULUC: 1, NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '15/09/2026', NGUOITAO_TAIKHOAN: 'ctsv01' },
        { ID: 'SKH2', TENKEHOACH: 'Ngày hội việc làm 2026', HIEULUC: 1, NGAYBATDAU: '10/10/2026', NGAYKETTHUC: '12/10/2026', NGUOITAO_TAIKHOAN: 'ctsv02' },
        { ID: 'SKH3', TENKEHOACH: 'Hội thao sinh viên 2025', HIEULUC: 0, NGAYBATDAU: '01/11/2025', NGAYKETTHUC: '30/11/2025', NGUOITAO_TAIKHOAN: 'ctsv01' }
    ];
    var PV = [
        { ID: 'PV1', QLSV_SUKIEN_KEHOACH_ID: 'SKH1', PHAMVIAPDUNG_ID: 'K68', PHAMVIAPDUNG_TEN: 'Khóa 68' },
        { ID: 'PV2', QLSV_SUKIEN_KEHOACH_ID: 'SKH2', PHAMVIAPDUNG_ID: 'NH01', QLSV_NGUOIHOC_ID: 'NH01', PHAMVIAPDUNG_TEN: 'Nguyễn Văn An' }
    ];
    var SV = [
        { QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOAHOC_TEN: 'Khóa 67' },
        { QLSV_NGUOIHOC_MASO: 'BBA220561', QLSV_NGUOIHOC_HODEM: 'Lê Minh', QLSV_NGUOIHOC_TEN: 'Châu', DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh', DAOTAO_KHOAHOC_TEN: 'Khóa 67' }
    ];
    var seq = 10, fx = {};
    fx[C + 'LayDSQLSV_SuKien_KeHoach'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        return KH.filter(function (k) { return !q || k.TENKEHOACH.toLowerCase().indexOf(q) >= 0; });
    };
    function luu(o) {
        var r = o.strId ? KH.filter(function (k) { return k.ID === o.strId; })[0] : null;
        if (!r) { r = { ID: 'SKH' + (seq++), NGUOITAO_TAIKHOAN: 'admin' }; KH.push(r); }
        r.TENKEHOACH = o.strTenKeHoach; r.HIEULUC = Number(o.dHieuLuc); r.NGAYBATDAU = o.strNgayBatDau; r.NGAYKETTHUC = o.strNgayKetThuc;
        return { rows: [], raw: { Id: r.ID } };
    }
    fx[C + 'Them_QLSV_SuKien_KeHoach'] = luu;
    fx[C + 'Sua_QLSV_SuKien_KeHoach'] = luu;
    fx[C + 'Xoa_QLSV_SuKien_KeHoach'] = function (o) { KH = KH.filter(function (k) { return k.ID !== o.strId; }); return []; };
    fx[C + 'LayDSSuKien_KeHoach_PhamVi'] = function (o) { return PV.filter(function (p) { return p.QLSV_SUKIEN_KEHOACH_ID === o.strQLSV_SuKien_KeHoach_Id; }); };
    fx[C + 'Them_SuKien_KeHoach_PhamVi'] = function (o) {
        PV.push({ ID: 'PV' + (seq++), QLSV_SUKIEN_KEHOACH_ID: o.strQLSV_SuKien_KeHoach_Id, PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, PHAMVIAPDUNG_TEN: 'Phạm vi ' + o.strPhamViApDung_Id });
        return [];
    };
    fx[C + 'Xoa_SuKien_KeHoach_PhamVi'] = function (o) { PV = PV.filter(function (p) { return p.ID !== o.strId; }); return []; };
    fx[C + 'LayDSSuKien_KeHoach_DangKy'] = function () { return SV; };
    fx[C + 'LayDSSuKien_KeHoach_ThamGia'] = function () { return SV.slice(0, 1); };
    ums.demo.add(fx);
})();
