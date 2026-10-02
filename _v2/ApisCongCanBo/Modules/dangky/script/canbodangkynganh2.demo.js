/* Dữ liệu mẫu cho dangky/canbodangkynganh2 — chỉ dùng ở chế độ dựng thử. */
(function () {
    var N = 'DKH_Nganh2/', fx = {}, seq = 10;
    var KQ = [];
    var MO = [
        { ID: 'M1', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTQTKD', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2)', DAOTAO_LOPQUANLY_ID: 'L2', DAOTAO_LOPQUANLY_TEN: 'K67-QTKD2', TINHTRANGDUDIEUKIEN: 'Đủ điều kiện', KETQUADUYET: '' },
        { ID: 'M2', DAOTAO_KHOADAOTAO_ID: 'K67', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTNNA', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Ngôn ngữ Anh (ngành 2)', DAOTAO_LOPQUANLY_ID: 'L9', DAOTAO_LOPQUANLY_TEN: 'K67-NNA1', TINHTRANGDUDIEUKIEN: 'Chưa đủ (GPA < 2.5)', KETQUADUYET: '' }
    ];
    fx['SV_HoSo/LayDanhSach'] = function (o) { return /220101/.test(o.strTuKhoa || '') ? [{ ID: 'NH01', MASO: 'BIT220101', HODEM: 'Nguyễn Văn', TEN: 'An', LOP: 'K67-KTPM1', QLSV_NGUOIHOC_TRANGTHAI: 'Đang học', NGANH: 'Kỹ thuật phần mềm', KHOADAOTAO: 'Khóa 67', HEDAOTAO: 'Đại học chính quy' }] : []; };
    fx[N + 'LayDSChuongTrinhNguoiHoc'] = function (o) { return o.strQLSV_NguoiHoc_Id ? [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' }] : []; };
    fx[N + 'LayDSKeHoachTheoNguoiHoc'] = function (o) { return o.strDaoTao_ChuongTrinh_Id ? [{ ID: 'KHN2', TENKEHOACH: 'Đăng ký ngành 2 đợt 1 năm 2026' }] : []; };
    fx[N + 'LayDSNganhMoDangKy'] = function (o) { return o.strQLSV_NguoiHoc_Id ? { rsNganhMo: MO, rsKetQua: KQ } : { rsNganhMo: [], rsKetQua: [] }; };
    fx[N + 'Them_DangKy_Nganh_Tiep_KetQua'] = function (o) {
        var m = MO.filter(function (x) { return x.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ChuongTrinh_DK_Id; })[0];
        if (m) KQ.push(Object.assign({}, m, { ID: 'KQ' + (seq++), KETQUADUYET: 'Chờ duyệt' }));
        return [];
    };
    fx[N + 'Xoa_DangKy_Nganh_Tiep_KetQua'] = function (o) { KQ = KQ.filter(function (x) { return x.ID !== o.strId; }); return []; };
    ums.demo.add(fx);
})();
