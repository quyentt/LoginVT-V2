/* Dữ liệu mẫu cho Thực hiện xét tốt nghiệp — chỉ dùng ở chế độ dựng thử. Mã sinh viên / cán bộ là mã bịa.
   (Danh mục học kỳ, học phần không đạt dùng dữ liệu mẫu chung của Học bổng — _kh_chung.demo.js.) */
(function () {
    function boDau(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function like(rows, q, cols) {
        q = boDau(q).trim();
        if (!q) return rows.slice();
        return rows.filter(function (r) { return cols.some(function (c) { return boDau(r[c]).indexOf(q) >= 0; }); });
    }
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }
    var PL = [{ ID: 'PL1', TEN: 'Xét tốt nghiệp đại học' }, { ID: 'PL2', TEN: 'Xét tốt nghiệp sớm' }];
    var KH = [
        { ID: 'TNKH01', TEN: 'Xét tốt nghiệp đợt 1 năm 2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026',
          NGAYBATDAU: '01/06/2026', NGAYKETTHUC: '30/06/2026', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Xét tốt nghiệp đại học',
          DIEUKIENXET: 'Tích luỹ đủ tín chỉ; điểm TB tích luỹ ≥ 2,0; hoàn thành chuẩn đầu ra', TONGSOXET: 6, TONGSODAT: 4, TONGSOKHONGDAT: 2,
          TONGSODACONGNHANCHINHTHUC: 4, KETQUACHINHTHUC: 1, NGAYTAO_DD_MM_YYYY_HHMMSS: '20/05/2026 08:15:00', NGUOICUOI_TAIKHOAN: 'cb.lan' },
        { ID: 'TNKH02', TEN: 'Xét tốt nghiệp sớm học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026',
          NGAYBATDAU: '05/01/2026', NGAYKETTHUC: '20/01/2026', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Xét tốt nghiệp sớm',
          DIEUKIENXET: 'Hoàn thành chương trình trước hạn', TONGSOXET: 6, TONGSODAT: 0, TONGSOKHONGDAT: 0,
          TONGSODACONGNHANCHINHTHUC: 0, KETQUACHINHTHUC: 0, NGAYTAO_DD_MM_YYYY_HHMMSS: '02/01/2026 14:02:11', NGUOICUOI_TAIKHOAN: 'cb.minh' }
    ];
    var SV = [
        ['NH01', 'SV22001', 'Nguyễn Văn', 'An', 'K22-CNTT1', 'Công nghệ thông tin', 'Khóa 2022', 'Giỏi', ''],
        ['NH02', 'SV22017', 'Trần Thị', 'Bình', 'K22-CNTT1', 'Công nghệ thông tin', 'Khóa 2022', 'Khá', ''],
        ['NH03', 'SV22045', 'Lê Hoàng', 'Cường', 'K22-QTKD2', 'Quản trị kinh doanh', 'Khóa 2022', 'Xuất sắc', 'Giỏi'],
        ['NH04', 'SV22058', 'Phạm Minh', 'Đức', 'K22-QTKD2', 'Quản trị kinh doanh', 'Khóa 2022', 'Khá', ''],
        ['NH05', 'SV22110', 'Vũ Ngọc', 'Hà', 'K22-KT1', 'Kế toán', 'Khóa 2022', 'Trung bình', ''],
        ['NH06', 'SV22131', 'Đỗ Thanh', 'Hương', 'K22-KT1', 'Kế toán', 'Khóa 2022', 'Trung bình', '']
    ];
    function svCua(kh, tien, tu, den) {
        var k = KH.filter(function (x) { return x.ID === kh; })[0] || KH[0];
        return SV.slice(tu || 0, den || SV.length).map(function (x, i) {
            return { ID: tien + kh + '_' + i, QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
                QLSV_NGUOIHOC_HOTEN: x[2] + ' ' + x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
                DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_CHUONGTRINH_TEN: x[5], DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT' + i, DAOTAO_KHOADAOTAO_TEN: x[6],
                KHOAQUANLY_TEN: 'Khoa ' + x[5], DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', XEPLOAI_TEN: x[7], XEPLOAI_THAYDOI_TEN: x[8],
                TN_KEHOACH_ID: kh, PHANLOAI_ID: k.PHANLOAI_ID, THUCHIENXET: i < 3 ? 1 : null, TINHTRANG_TEN: i % 2 ? 'Xét sớm' : 'Hoãn xét' };
        });
    }
    var daXet = {};
    function pv(kh) {
        return svCua(kh, 'PV').map(function (r) { if (daXet[r.ID]) r.THUCHIENXET = 1; return r; });
    }
    function kq(kh, tien, tu, den, cot) {
        var d = [];
        svCua(kh, tien, tu, den).forEach(function (r, i) {
            cot.forEach(function (c, j) { d.push({ TN_KETQUA_ID: r.ID, ID: c.ID, GIATRI: c.gt(i, j) }); });
        });
        return d;
    }
    var COT_DAT = [{ ID: 'C1', TEN: 'Điểm TB tích luỹ', gt: function (i) { return (3.6 - i * 0.3).toFixed(2); } },
        { ID: 'C2', TEN: 'Số tín chỉ tích luỹ', gt: function () { return '130'; } }];
    var COT_LOI = [{ ID: 'L1', TEN: 'Lý do không đạt', gt: function () { return 'Còn học phần chưa đạt'; } }];

    ums.demo.add({
        'TN_KeHoach/LayDSPhanLoaiXetTheoND1': PL,
        'TN_ThongTin/LayDSTN_KeHoach': function (o) {
            return trang(like(KH, o.strTuKhoa, ['TEN']).filter(function (x) {
                return (!o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id) &&
                    (!o.strDaoTao_ThoiGianDaoTao_Id || x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id);
            }), o);
        },
        'TN_KeHoach_NhanSu/LayDanhSach': function (o) {
            return o.strTN_KeHoach_Id === 'TNKH01' ? [{ ID: 'PC1', NGUOICUOI_TENDAYDU: 'Nguyễn Thị Lan' }, { ID: 'PC2', NGUOICUOI_TENDAYDU: 'Trần Quang Minh' }] : [];
        },
        'TN_ThongTin/LayDSKhoaHocTheoKeHoach': [{ ID: 'K22', TEN: 'Khóa 2022' }, { ID: 'K21', TEN: 'Khóa 2021' }],
        'pkg_totnghiep_thongtin.LayDSLopQuanLyTheoKeHoach': [{ ID: 'L1', TEN: 'K22-CNTT1' }, { ID: 'L2', TEN: 'K22-QTKD2' }, { ID: 'L3', TEN: 'K22-KT1' }],
        'TN_HangDoi/TaoHangDoi_TN_TuDong': [],
        'TN_KetQua_CongNhan/ThemMoi': [],
        'TN_KetQua_CongNhan/Xoa': [],
        'TN_KeHoach_PhamVi/LayDanhSach': function (o) {
            return trang(like(pv(o.strTN_KeHoach_Id), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'TN_ThongTin/LayDSTN_KeHoach_PhamVi_ChuaXet': function (o) {
            return pv(o.strTN_KeHoach_Id).filter(function (r) { return !r.THUCHIENXET; });
        },
        'TN_KeHoach_PhamVi/ThietLap_Xet_TN_KeHoach_PhamVi': function (o) { daXet[o.strTN_KeHoach_PhamVi_Id] = 1; return []; },
        'TN_KetQua/LayChiTiet': function (o) {
            return { rows: { rsCot: COT_DAT, rsDuLieu: kq(o.strTN_KeHoach_Id, 'KQ', 0, 4, COT_DAT) } };
        },
        'TN_KetQua/LayDanhSach': function (o) {
            return trang(like(svCua(o.strTN_KeHoach_Id, 'KQ', 0, 4), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'TN_KetQua_Loi/LayChiTiet': function (o) {
            return { rows: { rsCot: COT_LOI, rsDuLieu: kq(o.strTN_KeHoach_Id, 'KL', 4, 6, COT_LOI) } };
        },
        'TN_KetQua_Loi/LayDanhSach': function (o) {
            return trang(like(svCua(o.strTN_KeHoach_Id, 'KL', 4), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'TN_KetQuaHocPhan/LayDanhSach': [
            { DAOTAO_HOCPHAN_MA: 'KT201', DAOTAO_HOCPHAN_TEN: 'Nguyên lý kế toán', DIEM: '3,5', DANHGIA_TEN: 'Chưa đạt', MOTA: 'Thi lại' },
            { DAOTAO_HOCPHAN_MA: 'TO102', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp 2', DIEM: '7,0', DANHGIA_TEN: 'ĐẠT', MOTA: '' },
            { DAOTAO_HOCPHAN_MA: 'TA301', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh chuyên ngành', DIEM: '', DANHGIA_TEN: 'Chưa học', MOTA: '' }
        ],
        'pkg_totnghiep_thongtin.LayDSTN_KetQua_CongNhan': function (o) {
            return like(svCua(o.strTN_KeHoach_Id, 'CN', 0, 4), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']);
        },
        'TN_DangKy/LayDSTN_KeHoach_DangKy': function (o) { return svCua(o.strTN_KeHoach_Id, 'DK', 0, 2); }
    });
})();
