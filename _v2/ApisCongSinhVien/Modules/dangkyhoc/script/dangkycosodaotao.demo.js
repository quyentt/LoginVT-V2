/* Dữ liệu mẫu cho dangkyhoc/dangkycosodaotao — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DK = {};    // kế hoạch → { cs, ngay } (cơ sở người học đang đăng ký)
    function bayGio() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
    /* Hồ sơ người học — HOSO_TQ (PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan) trả nhiều khối.
       Dòng kế hoạch DS_KH_NH chỉ mang các id Them_KQ cần + cờ đã đăng ký (DA_DANGKY, COSODAOTAO_ID_DACHON). */
    var HS = {
        rsThongTinCoBan: [{ FULL_NAME: 'Lăng Văn Huy', MA_SINHVIEN: '25001029', LOP_HIENTAI_TEN: 'DCOT.16.2', KHOA_TEN: 'Khoa Công nghệ ô tô' }],
        rsDanhSachQHHT: [
            { STUDY_ID: 'PS0002', IS_PRIMARY: 0, NGANH_TEN: 'Quản trị kinh doanh (song ngành)', TENKHOA: 'Đại học Chính quy Khóa 16' },
            { STUDY_ID: 'PS0001', IS_PRIMARY: 1, NGANH_TEN: 'Công nghệ kỹ thuật ô tô', TENKHOA: 'Đại học Chính quy Khóa 16' }
        ]
    };
    var NH = { DAOTAO_TOCHUCCT_ID: 'CTOTO16', DAOTAO_LOPQUANLY_ID: 'LDCOT162' };
    function keHoach(o) { return Object.assign({}, NH, o); }
    var KH = [
        keHoach({ ID: 'KHCS2026', TENKEHOACH: 'Đăng ký cơ sở đào tạo năm học 2026 - 2027', TUNGAY: '01/09/2026', DENNGAY: '31/12/2026',
            DOITUONG: 'Sinh viên khóa 16 các ngành kỹ thuật', HIEULUC: 1 }),
        keHoach({ ID: 'KHCS2025', TENKEHOACH: 'Đăng ký cơ sở đào tạo năm học 2025 - 2026', TUNGAY: '01/08/2025', DENNGAY: '30/09/2025',
            DOITUONG: 'Sinh viên khóa 15, khóa 16', HIEULUC: 1 })
    ];
    var CS = [
        { COSODAOTAO_ID: 'CS01', COSODAOTAO_TEN: 'Cơ sở Hà Nội', COSODAOTAO_MA: 'HN', DIACHI: '218 Lĩnh Nam, Hoàng Mai, Hà Nội', CHITIEU: 450, MOTA: 'Cơ sở chính — đầy đủ xưởng thực hành ô tô.' },
        { COSODAOTAO_ID: 'CS02', COSODAOTAO_TEN: 'Cơ sở Nam Định', COSODAOTAO_MA: 'ND', DIACHI: '353 Trần Hưng Đạo, TP. Nam Định', CHITIEU: 200, MOTA: 'Có ký túc xá cho sinh viên năm thứ nhất.' },
        { COSODAOTAO_ID: 'CS03', COSODAOTAO_TEN: 'Cơ sở Hải Dương', COSODAOTAO_MA: 'HD', DIACHI: 'Khu đô thị Tuệ Tĩnh, TP. Hải Dương', CHITIEU: 120, MOTA: '' }
    ];
    ums.demo.add({
        'PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan': function (o) { return { rows: o.strCorePerson_Id ? HS : {} }; },
        'PKG_CORE_DK_COSO.DS_KH_NH': function (o) {
            if (!o.strCore_Person_Id) return [];
            return KH.map(function (k) {
                var dk = DK[k.ID];
                return Object.assign({}, k, { DA_DANGKY: dk ? 1 : 0, COSODAOTAO_ID_DACHON: dk ? dk.cs : '' });
            });
        },
        /* Máy chủ thật: dòng cơ sở KHÔNG mang cờ đã đăng ký; ID = id dòng kế hoạch–cơ sở (khác COSODAOTAO_ID) */
        'PKG_CORE_DK_COSO.DS_KHCS': function (o) {
            return CS.map(function (c, i) { return Object.assign({ ID: o.strKeHoach_Id + '_' + i }, c); });
        },
        'PKG_CORE_DK_COSO.Them_KQ': function (o) { DK[o.strKeHoach_Id] = { cs: o.strCoSoDaoTao_Id, ngay: bayGio() }; return []; },
        'PKG_CORE_DK_COSO.Xoa_KQ': function () { DK = {}; return []; }
    });
})();
