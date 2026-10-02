/* Dữ liệu mẫu cho dangkyhoc/nganh2 — chỉ dùng ở chế độ dựng thử. */
(function () {
    var P = 'pkg_dangkyhoc_nganh2.', seq = 10, KQ = [], fx = {};
    var MO = [
        { ID: 'M1', DAOTAO_KHOADAOTAO_ID: 'K16', DAOTAO_KHOADAOTAO_TEN: 'Khóa 16', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTQTKD',
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2)', DAOTAO_LOPQUANLY_ID: 'L2', DAOTAO_LOPQUANLY_TEN: 'QTKD.16.N2',
            TINHTRANGDUDIEUKIEN: 'Đủ điều kiện', KETQUADUYET: '' },
        { ID: 'M2', DAOTAO_KHOADAOTAO_ID: 'K16', DAOTAO_KHOADAOTAO_TEN: 'Khóa 16', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTNNA',
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Ngôn ngữ Anh (ngành 2)', DAOTAO_LOPQUANLY_ID: 'L9', DAOTAO_LOPQUANLY_TEN: 'NNA.16.N2',
            TINHTRANGDUDIEUKIEN: 'Chưa đủ (điểm trung bình < 2.5)', KETQUADUYET: '' },
        { ID: 'M3', DAOTAO_KHOADAOTAO_ID: 'K16', DAOTAO_KHOADAOTAO_TEN: 'Khóa 16', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKT',
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kế toán (ngành 2)', DAOTAO_LOPQUANLY_ID: 'L5', DAOTAO_LOPQUANLY_TEN: 'KT.16.N2',
            TINHTRANGDUDIEUKIEN: 'Đủ điều kiện', KETQUADUYET: '' }
    ];
    fx[P + 'LayDSChuongTrinhNguoiHoc'] = function (o) {
        return o.strQLSV_NguoiHoc_Id ? [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTOTO16', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô' }] : [];
    };
    fx[P + 'LayDSKeHoachTheoNguoiHoc'] = function (o) {
        return o.strDaoTao_ChuongTrinh_Id
            ? [{ ID: 'KHN2A', TENKEHOACH: 'Đăng ký ngành 2 đợt 1 năm 2026' }, { ID: 'KHN2B', TENKEHOACH: 'Đăng ký ngành 2 đợt 2 năm 2026' }] : [];
    };
    fx[P + 'LayDSNganhMoDangKy'] = function (o) {
        return o.strQLSV_NguoiHoc_Id && o.strQLSV_DangKy_Nganh_Tiep_Id ? { rsNganhMo: MO, rsKetQua: KQ } : { rsNganhMo: [], rsKetQua: [] };
    };
    fx[P + 'Them_DangKy_Nganh_Tiep_KetQua'] = function (o) {
        var m = MO.filter(function (x) { return x.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ChuongTrinh_DK_Id; })[0];
        if (m) KQ.push(Object.assign({}, m, { ID: 'KQ' + (seq++), KETQUADUYET: 'Chờ duyệt' }));
        return [];
    };
    fx[P + 'Xoa_DangKy_Nganh_Tiep_KetQua'] = function (o) {
        KQ = KQ.filter(function (x) { return x.ID !== o.strId; });
        return [];
    };
    ums.demo.add(fx);
})();
