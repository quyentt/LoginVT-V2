/* Dữ liệu mẫu cho Kế hoạch xét tốt nghiệp (kehoach.js + _tnkh_*.js) — chỉ dùng ở chế độ dựng thử.
   Học kỳ, hộp chọn sinh viên (PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc) lấy từ dữ liệu mẫu của Học bổng (_kh_chung.demo.js).
   Mã sinh viên / cán bộ là mã bịa. */
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
    function dm(id, ma, ten, t1, t2) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: t1 || '', THONGTIN2: t2 || '' }; }

    var PL = [dm('PL1', 'DAIHOC', 'Xét tốt nghiệp đại học'), dm('PL2', 'CAOHOC', 'Xét tốt nghiệp thạc sĩ')];
    var KH = [
        { ID: 'TNKH01', MA: 'TN-2526-1', TEN: 'Xét tốt nghiệp đợt 1 năm 2026 - Đại học chính quy', DAOTAO_THOIGIANDAOTAO_ID: 'TG252',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026', NGAYBATDAU: '01/06/2026', NGAYKETTHUC: '30/06/2026',
          PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Xét tốt nghiệp đại học', MOCHONGUOIHOCDANGKY: 1, COTINHLAIDIEMTKHP: 1,
          PHOI_TN_QUYTACSINHSOHIEU_AD_ID: 'QSH1', PHOI_TN_QUYTACSINHSOVSO_AD_ID: 'QVS1', TINHTRANG_KHOA_TEN: 'Đã khóa dữ liệu',
          NGAYTAO_DD_MM_YYYY_HHMMSS: '15/05/2026 09:12:40', NGUOICUOI_TAIKHOAN: 'cb.lan' },
        { ID: 'TNKH02', MA: 'TN-2526-2', TEN: 'Xét tốt nghiệp đợt 2 năm 2026 - Đại học chính quy', DAOTAO_THOIGIANDAOTAO_ID: 'TG252',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026', NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '30/09/2026',
          PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Xét tốt nghiệp đại học', MOCHONGUOIHOCDANGKY: 0, COTINHLAIDIEMTKHP: 0,
          TINHTRANG_KHOA_TEN: '', NGAYTAO_DD_MM_YYYY_HHMMSS: '20/08/2026 14:03:11', NGUOICUOI_TAIKHOAN: 'cb.minh' },
        { ID: 'TNKH03', MA: 'TN-TS-2026', TEN: 'Xét tốt nghiệp thạc sĩ năm 2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
          DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026', NGAYBATDAU: '10/01/2026', NGAYKETTHUC: '31/01/2026',
          PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Xét tốt nghiệp thạc sĩ', MOCHONGUOIHOCDANGKY: 1, COTINHLAIDIEMTKHP: 0,
          TINHTRANG_KHOA_TEN: 'Mở dữ liệu', NGAYTAO_DD_MM_YYYY_HHMMSS: '02/01/2026 08:30:00', NGUOICUOI_TAIKHOAN: 'cb.hoa' }
    ];
    var NS = {
        TNKH01: [['PC1', 'ND01', 'cb.lan', 'Nguyễn Thị Lan'], ['PC2', 'ND02', 'cb.minh', 'Trần Quang Minh']],
        TNKH02: [['PC3', 'ND03', 'cb.hoa', 'Lê Thu Hoà']],
        TNKH03: []
    };
    var SV = [
        ['NH11', 'SV22101', 'Nguyễn Văn', 'An', 'K22-CNTT1', 'L11', 'Công nghệ thông tin', 'CT11', 'Khóa 2022', 'K22'],
        ['NH12', 'SV22117', 'Trần Thị', 'Bình', 'K22-CNTT1', 'L11', 'Công nghệ thông tin', 'CT11', 'Khóa 2022', 'K22'],
        ['NH13', 'SV22145', 'Lê Hoàng', 'Cường', 'K22-QTKD2', 'L12', 'Quản trị kinh doanh', 'CT12', 'Khóa 2022', 'K22'],
        ['NH14', 'SV22158', 'Phạm Minh', 'Đức', 'K22-QTKD2', 'L12', 'Quản trị kinh doanh', 'CT12', 'Khóa 2022', 'K22'],
        ['NH15', 'SV21110', 'Vũ Ngọc', 'Hà', 'K21-KT1', 'L13', 'Kế toán', 'CT13', 'Khóa 2021', 'K21'],
        ['NH16', 'SV21131', 'Đỗ Thanh', 'Hương', 'K21-KT1', 'L13', 'Kế toán', 'CT13', 'Khóa 2021', 'K21']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_HOTEN: x[2] + ' ' + x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004', QLSV_NGUOIHOC_ANH: '', ANH: '',
            DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: x[5], DAOTAO_CHUONGTRINH_TEN: x[6], DAOTAO_TOCHUCCHUONGTRINH_ID: x[7],
            DAOTAO_KHOADAOTAO_TEN: x[8], DAOTAO_KHOADAOTAO_ID: x[9], KHOAQUANLY_TEN: 'Khoa ' + x[6],
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' };
    });
    function svCua(kh, tien, tu, den) {
        return SV.slice(tu || 0, den || SV.length).map(function (s, i) {
            var r = { ID: tien + kh + '_' + i, TN_KEHOACH_ID: kh };
            Object.keys(s).forEach(function (c) { r[c] = s[c]; });
            return r;
        });
    }
    var HP = [
        { ID: 'HP01', MA: 'TN401', TEN: 'Khoá luận tốt nghiệp' }, { ID: 'HP02', MA: 'TN402', TEN: 'Thực tập tốt nghiệp' },
        { ID: 'HP03', MA: 'GDTC1', TEN: 'Giáo dục thể chất 1' }, { ID: 'HP04', MA: 'QPAN1', TEN: 'Giáo dục quốc phòng - an ninh 1' },
        { ID: 'HP05', MA: 'TA301', TEN: 'Tiếng Anh chuẩn đầu ra' }
    ];
    var HPKH = { TNKH01: [['KHP1', 'HP01'], ['KHP2', 'HP02']], TNKH02: [['KHP3', 'HP01']], TNKH03: [] };
    function hpCua(kh) {
        return (HPKH[kh] || []).map(function (x) {
            var h = HP.filter(function (y) { return y.ID === x[1]; })[0];
            return { ID: x[0], DAOTAO_HOCPHAN_ID: h.ID, DAOTAO_HOCPHAN_MA: h.MA, DAOTAO_HOCPHAN_TEN: h.TEN };
        });
    }

    ums.demo.add({
        'TN_Chung/LayDSPhanLoaiTheoNguoiDung': PL,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TN.PHANLOAI': PL,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.THANGDIEM': [dm('TD4', 'HE4', 'Thang điểm 4'), dm('TD10', 'HE10', 'Thang điểm 10')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TN.KHOA.MO.DULIEU': [
            dm('KHOA', 'KHOA', 'Khóa dữ liệu', 'fa fa-lock'), dm('MO', 'MO', 'Mở dữ liệu', 'fa fa-unlock', 'color:#198754')
        ],
        'TN_ThongTin/LayDSTN_KeHoach': function (o) {
            var r = like(KH, o.strTuKhoa, ['TEN', 'MA']).filter(function (x) {
                return (!o.strDaoTao_ThoiGianDaoTao_Id || x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id);
            });
            return trang(r, o);
        },
        'pkg_totnghiep_thongtin.Them_TN_KeHoach': { rows: [], raw: { Id: 'TNKH99' } },
        'PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoHieu_Ad': [{ ID: 'QSH1', TEN: 'TN-{NAM}-{STT:5}' }, { ID: 'QSH2', TEN: 'Số hiệu theo hệ đào tạo' }],
        'PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad': [{ ID: 'QVS1', TEN: 'VS/{NAM}/{STT:4}' }],
        'TN_KeHoach_NhanSu/LayDanhSach': function (o) {
            return (NS[o.strTN_KeHoach_Id] || []).map(function (x) {
                return { ID: x[0], NGUOIDUNG_ID: x[1], NGUOIDUNG_TAIKHOAN: x[2], NGUOIDUNG_TENDAYDU: x[3], NGUOICUOI_TENDAYDU: x[3] };
            });
        },
        'TN_KeHoach_PhamVi/LayDanhSach': function (o) {
            return trang(like(svCua(o.strTN_KeHoach_Id, 'PV', 0, o.strTN_KeHoach_Id === 'TNKH03' ? 2 : 6), o.strTuKhoa,
                ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'TN_KeHoach_HocPhan/LayDSTN_KeHoach_HocPhan': function (o) { return trang(hpCua(o.strTN_KeHoach_Id), o); },
        'pkg_totnghiep_thongtin.LayDSTN_KeHoach_HocPhan': function (o) { return trang(hpCua(o.strTN_KeHoach_Id), o); },
        'KHCT_HocPhan/LayDanhSach': function (o) { return trang(like(HP, o.strTuKhoa, ['MA', 'TEN']), o); },
        'TN_ThongTin/LayDSTN_XetDuyet_DieuKien_Ad': function (o) {
            return o.strPhamViApDung_Id === 'TNKH03' ? [] : [{ ID: 'XD_' + o.strPhamViApDung_Id, PHANLOAI_ID: 'PL1', PHAMVIAPDUNG_ID: o.strPhamViApDung_Id,
                DAOTAO_THOIGIANDAOTAO_ID: 'TG252', XAUDIEUKIEN: 'TBCTL_HE4 >= 2.0\nAND SOTC_TICHLUY >= SOTC_CTDT\nAND CHUANDAURA_NGOAINGU = 1\nAND KHONG_KYLUAT = 1' }];
        },
        'TN_ThongTin/LayDSTN_XepLoai_DieuKien_Ad': function (o) {
            return o.strPhamViApDung_Id === 'TNKH03' ? [] : [
                { ID: 'XL1', XEPLOAI_ID: 'XS', XEPLOAI_TEN: 'Xuất sắc', THOIGIAN: 'Học kỳ 2 - 2025-2026', PHANLOAI_ID: 'PL1', THUTU: 1, MOTA: '',
                  PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, DAOTAO_THOIGIANDAOTAO_ID: 'TG252', XAUDIEUKIEN: 'TBCTL_HE4 >= 3.6' },
                { ID: 'XL2', XEPLOAI_ID: 'G', XEPLOAI_TEN: 'Giỏi', THOIGIAN: 'Học kỳ 2 - 2025-2026', PHANLOAI_ID: 'PL1', THUTU: 2, MOTA: '',
                  PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, DAOTAO_THOIGIANDAOTAO_ID: 'TG252', XAUDIEUKIEN: 'TBCTL_HE4 >= 3.2 AND TBCTL_HE4 < 3.6' },
                { ID: 'XL3', XEPLOAI_ID: 'K', XEPLOAI_TEN: 'Khá', THOIGIAN: 'Học kỳ 2 - 2025-2026', PHANLOAI_ID: 'PL1', THUTU: 3, MOTA: '',
                  PHAMVIAPDUNG_ID: o.strPhamViApDung_Id, DAOTAO_THOIGIANDAOTAO_ID: 'TG252', XAUDIEUKIEN: 'TBCTL_HE4 >= 2.5 AND TBCTL_HE4 < 3.2' }
            ];
        },
        'pkg_totnghiep_thongtin.LayDSTN_XepLoai_DieuKien_HaBac': [
            { ID: 'HB1', XAUDIEUKIEN: 'SOTC_HOCLAI > 5% SOTC_CTDT', XEPLOAI_TEN: 'Hạ một bậc' },
            { ID: 'HB2', XAUDIEUKIEN: 'BI_KYLUAT_MUC_CANHCAO = 1', XEPLOAI_TEN: 'Hạ một bậc' }
        ],
        'TN_ThongTin/LayDSTN_PhamVi_ApDung': [
            { ID: 'NHOM1', TEN: 'Điều kiện chuẩn đại học chính quy' }, { ID: 'NHOM2', TEN: 'Điều kiện chuẩn liên thông' }
        ],
        'pkg_totnghiep_thongtin.LayDSTN_KH_DTB_HocPhan_Tam': function (o) {
            return like(svCua(o.strTN_KeHoach_Id, 'DTB', 0, 4), o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']).map(function (r, i) {
                r.DAOTAO_TOCHUCCHUONGTRINH_TEN = r.DAOTAO_CHUONGTRINH_TEN; r.DAOTAO_TOCHUCCHUONGTRINH_MA = r.DAOTAO_TOCHUCCHUONGTRINH_ID;
                r.DTB = (3.4 - i * 0.3).toFixed(2); r.CHITIETKETQUAHOCPHAN = 'TN401: 8,5; TN402: 9,0'; r.THANGDIEM_TEN = 'Thang điểm 4';
                return r;
            });
        },
        'pkg_totnghiep_thongtin.LayDSTN_KeHoach_XacNhan': [
            { TINHTRANG_TEN: 'Khóa dữ liệu', NOIDUNG: 'Chốt danh sách xét đợt 1', NGUOIXACNHAN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY: '20/06/2026' }
        ],
        /* Hộp "Thêm từ đăng ký học" */
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG252', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - Năm học 2025-2026' }, { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - Năm học 2025-2026' }],
        'DKH_Chung/LayHeDaoTaoTheoDangKy': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'DKH_Chung/LayKhoaHocTheoDangKy': [{ ID: 'K22', TENKHOA: 'Khóa 2022' }, { ID: 'K21', TENKHOA: 'Khóa 2021' }],
        'DKH_Chung/LayChuongTrinhTheoDangKy': [{ ID: 'CT11', TENCHUONGTRINH: 'Công nghệ thông tin' }, { ID: 'CT12', TENCHUONGTRINH: 'Quản trị kinh doanh' }],
        'DKH_Chung/LayLopQuanLyTheoDangKy': [{ ID: 'L11', TEN: 'K22-CNTT1' }, { ID: 'L12', TEN: 'K22-QTKD2' }],
        'DKH_Chung/LayDanhSachHoSoTheoDangKy': function (o) {
            var moi = { QLSV_NGUOIHOC_ID: 'NH17', QLSV_NGUOIHOC_MASO: 'SV22190', QLSV_NGUOIHOC_HODEM: 'Hoàng Gia', QLSV_NGUOIHOC_TEN: 'Khánh',
                QLSV_NGUOIHOC_NGAYSINH: '03/09/2004', QLSV_NGUOIHOC_ANH: '', DAOTAO_LOPQUANLY_TEN: 'K22-CNTT2', DAOTAO_LOPQUANLY_ID: 'L14',
                DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT11', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2022', DAOTAO_KHOADAOTAO_ID: 'K22' };
            var r = [moi].concat(SV).map(function (s) { var x = { ID: 'DKH_' + s.QLSV_NGUOIHOC_ID }; Object.keys(s).forEach(function (c) { x[c] = s[c]; }); return x; });
            return trang(like(r, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        }
    });
})();
