/* Dữ liệu mẫu chung cho Quyết định / Thực thi quyết định — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var QD = [
        { ID: 'QD1', LOAIQUYETDINH_ID: 'LQD1', LOAIQUYETDINH_TEN: 'Chuyển lớp', CAPQUYETDINH_ID: 'CQD1', CAPQUYETDINH_TEN: 'Cấp trường',
          SOQUYETDINH: '215/QĐ-ĐHCN', NGAYQUYETDINH: '10/02/2026', NGAYHIEULUC: '15/02/2026', NGAYHETHIEULUC: '',
          NGUYENNHAN_LYDO: 'Chuyển lớp theo nguyện vọng cá nhân sau khi hoàn thành học kỳ 1', SOLUONG: 3,
          DAOTAO_THOIGIANDAOTAO_ID: 'HK2', THOIGIAN: 'Học kỳ 2 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_NAM: 2025, DAOTAO_THOIGIANDAOTAO_KY: 2, DAOTAO_THOIGIANDAOTAO_DOT: 1,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '10/02/2026 14:02:11', NGUOITAO_TAIKHOAN: 'ctsv.lan', HINHTHUCQUYETDINH_ID: 'HT1' },
        { ID: 'QD2', LOAIQUYETDINH_ID: 'LQD2', LOAIQUYETDINH_TEN: 'Bảo lưu kết quả học tập', CAPQUYETDINH_ID: 'CQD1', CAPQUYETDINH_TEN: 'Cấp trường',
          SOQUYETDINH: '318/QĐ-ĐHCN', NGAYQUYETDINH: '03/03/2026', NGAYHIEULUC: '03/03/2026', NGAYHETHIEULUC: '03/03/2027',
          NGUYENNHAN_LYDO: 'Bảo lưu do đi nghĩa vụ quân sự', SOLUONG: 1,
          DAOTAO_THOIGIANDAOTAO_ID: 'HK2', THOIGIAN: 'Học kỳ 2 năm học 2025-2026', DAOTAO_THOIGIANDAOTAO_NAM: 2025, DAOTAO_THOIGIANDAOTAO_KY: 2, DAOTAO_THOIGIANDAOTAO_DOT: 1,
          NGAYTAO_DD_MM_YYYY_HHMMSS: '03/03/2026 09:40:00', NGUOITAO_TAIKHOAN: 'ctsv.lan' },
        { ID: 'QD3', LOAIQUYETDINH_ID: 'LQD3', LOAIQUYETDINH_TEN: 'Công nhận điểm', CAPQUYETDINH_ID: 'CQD2', CAPQUYETDINH_TEN: 'Cấp khoa',
          SOQUYETDINH: '402/QĐ-ĐT', NGAYQUYETDINH: '20/03/2026', NGAYHIEULUC: '20/03/2026', NGAYHETHIEULUC: '',
          NGUYENNHAN_LYDO: 'Công nhận kết quả học tập tại trường đối tác', SOLUONG: 0,
          DAOTAO_THOIGIANDAOTAO_ID: 'HK1', THOIGIAN: 'Học kỳ 1 năm học 2025-2026', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/03/2026 16:25:30', NGUOITAO_TAIKHOAN: 'daotao.minh' }
    ];
    function sv(id, ma, hd, ten, lop, thucThi, them) {
        var r = { ID: 'QDNH' + id, QLSV_NGUOIHOC_ID: 'NH' + id, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: hd, QLSV_NGUOIHOC_TEN: ten, ANH: '',
            DAOTAO_LOPQUANLY_ID: 'L1', DAOTAO_LOPQUANLY_TEN: lop, NHOMLOP_TEN: '', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM',
            DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
            DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', TRANGTHAINGUOIHOC_TEN: 'Đang học',
            QLSV_QUYETDINH_THUCTHI_ID: thucThi || null };
        Object.keys(them || {}).forEach(function (k) { r[k] = them[k]; });
        return r;
    }
    var SV = [
        sv(1, 'BIT220101', 'Nguyễn Văn', 'An', 'K67-KTPM1', null, { TRANGTHAINGUOIHOC_MOI_TEN: 'Đang học', DAOTAO_LOPQUANLY_MOI_TEN: 'K67-KTPM2', PHAMTRAMTINHPHI: 100, DSKETQUANHIEUKY: 'HK2 2025-2026' }),
        sv(2, 'BIT220102', 'Trần Thị', 'Bình', 'K67-KTPM1', 'TTH2', { DAOTAO_LOPQUANLY_MOI_TEN: 'K67-KTPM2', DSKETQUANHIEUKY: '' }),
        sv(3, 'BIT220117', 'Lê Minh', 'Châu', 'K67-KTPM2', null, { DAOTAO_LOPQUANLY_N2_TEN: 'K67-QTKD2', PHAMTRAMTINHPHI: 50 })
    ];
    var x = {
        'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh': { rows: QD, pager: QD.length },
        'SV_QuyetDinh/LayDanhSach': { rows: QD, pager: QD.length },
        'PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh': { rows: [], raw: { Id: 'QD9' } },
        'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh': [{ ID: 'LQD1', TEN: 'Chuyển lớp' }, { ID: 'LQD2', TEN: 'Bảo lưu kết quả học tập' }, { ID: 'LQD3', TEN: 'Công nhận điểm' }],
        'SV_QuyetDinh_ThucThi/LayDSHinhThucQuyetDinh': function (o) {
            return o.strLoaiQuyetDinh_Id === 'LQD1' ? [{ ID: 'HT1', TEN: 'Chuyển trong ngành' }, { ID: 'HT2', TEN: 'Chuyển sang ngành khác' }] : [];
        },
        'SV_QuyetDinh_NguoiHoc/LayDanhSach': function (o) { return o.strQLSV_QuyetDinh_Id === 'QD1' ? SV : o.strQLSV_QuyetDinh_Id === 'QD2' ? [SV[1]] : []; },
        'SV_Files/LayDanhSach': function (o) { return o.strDuLieu_Id === 'QD1' ? [{ ID: 'F1', FILEMINHCHUNG: 'SV/Files/QD1_215.pdf', TENHIENTHI: 'QD215-chuyenlop.pdf' }] : []; },
        'SV_QuyetDinh_HocPhan/LayDSQLSV_QuyetDinh_HocPhan': function (o) {
            return o.strQLSV_QuyetDinh_Id === 'QD1' ? [{ ID: 'QDHP1', THOIGIAN: 'Học kỳ 2 năm học 2025-2026', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_MA: 'IT3090' }] : [];
        },
        'SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh': [{ ID: 'HPA', MA: 'IT3090', TEN: 'Cơ sở dữ liệu' }, { ID: 'HPB', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }],
        'D_CoSoCongNhanDiem/LayKQCongNhanHocPhan': function (o) {
            return o.strQLSV_NguoiHoc_Id === 'NH1' ? [{ ID: 'KQ1', DAOTAO_HOCPHAN_ID: 'HPA', DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS1' }] : [];
        },
        'D_CoSoCongNhanDiem/LayDSDiem_CoSoCongNhanDiem': [
            { ID: 'CS1', MA: 'DHBK', TEN: 'Đại học Bách khoa Hà Nội', PHANLOAI_ID: 'PLCS1', PHANLOAI_TEN: 'Trong nước', DIACHI: 'Số 1 Đại Cồ Việt, Hà Nội' },
            { ID: 'CS2', MA: 'KYUSHU', TEN: 'Kyushu University', PHANLOAI_ID: 'PLCS2', PHANLOAI_TEN: 'Nước ngoài', DIACHI: 'Fukuoka, Nhật Bản' }
        ],
        'pkg_hososinhvien_thongtin.LayDSKetQuaNhieuKy': [{ ID: 'QDTG1', THOIGIAN: 'Học kỳ 2 năm học 2025-2026' }],
        'SV_HoSo_ThongTinHienTai/LayDSLopHienTai': [{ DAOTAO_LOPQUANLY_ID: 'L1', DAOTAO_LOPQUANLY_TEN: 'K67-KTPM1' }],
        'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc': function () {
            var r = [['NH11', 'BIT230210', 'Phạm Thu', 'Dung', 'K68-HTTT1'], ['NH1', 'BIT220101', 'Nguyễn Văn', 'An', 'K67-KTPM1']].map(function (a) {
                return { ID: 'X' + a[0], QLSV_NGUOIHOC_ID: a[0], QLSV_NGUOIHOC_MASO: a[1], QLSV_NGUOIHOC_HODEM: a[2], QLSV_NGUOIHOC_TEN: a[3],
                    QLSV_NGUOIHOC_NGAYSINH: '02/01/2005', DAOTAO_LOPQUANLY_TEN: a[4], DAOTAO_LOPQUANLY_ID: 'L3', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTHTTT',
                    DAOTAO_CHUONGTRINH_TEN: 'Hệ thống thông tin', DAOTAO_KHOADAOTAO_TEN: 'Khóa 68', QLSV_TRANGTHAINGUOIHOC_ID: 'TT1',
                    QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', TRACK_ID: 'TR1', ANH: '' };
            });
            return { rows: r, pager: r.length };
        },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan': { rows: [
            { ID: 'HPX1', DAOTAO_HOCPHAN_ID: 'HP1', MA: 'IT3020', TEN: 'Toán rời rạc', HOCTRINH: 3 },
            { ID: 'HPX2', DAOTAO_HOCPHAN_ID: 'HP2', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', HOCTRINH: 3 }
        ], pager: 2 }
    };
    x[D + 'QLSV.CQD'] = [{ ID: 'CQD1', MA: 'TRUONG', TEN: 'Cấp trường', CHUNG_TENDANHMUC_TEN: 'Cấp quyết định' },
        { ID: 'CQD2', MA: 'KHOA', TEN: 'Cấp khoa', CHUNG_TENDANHMUC_TEN: 'Cấp quyết định' }];
    x[D + 'QLSV.LQD'] = [{ ID: 'LQD1', MA: 'CL', TEN: 'Chuyển lớp', CHUNG_TENDANHMUC_TEN: 'Loại quyết định' },
        { ID: 'LQD2', MA: 'BL', TEN: 'Bảo lưu kết quả học tập', CHUNG_TENDANHMUC_TEN: 'Loại quyết định' }];
    x[D + 'DIEM.PHANLOAI.COSODAOTAO'] = [{ ID: 'PLCS1', MA: 'TN', TEN: 'Trong nước', CHUNG_TENDANHMUC_TEN: 'Phân loại cơ sở' },
        { ID: 'PLCS2', MA: 'NN', TEN: 'Nước ngoài', CHUNG_TENDANHMUC_TEN: 'Phân loại cơ sở' }];
    ums.demo.add(x);
})();
