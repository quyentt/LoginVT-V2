/* Dữ liệu mẫu dùng chung cho 6 màn Nội dung đào tạo — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';

    var HE = [
        { ID: 'HE1', MAHEDAOTAO: 'DHCQ', TENHEDAOTAO: 'Đại học chính quy' },
        { ID: 'HE2', MAHEDAOTAO: 'DTK', TENHEDAOTAO: 'Đào tạo khác' }
    ];
    var KHOA = [
        { ID: 'K1', MAKHOA: 'K15', TENKHOA: 'Khóa 15', HE: 'HE1' },
        { ID: 'K2', MAKHOA: 'K16', TENKHOA: 'Khóa 16', HE: 'HE1' },
        { ID: 'K3', MAKHOA: 'K01', TENKHOA: 'Khóa 01', HE: 'HE2' }
    ];
    var CT = [
        { ID: 'CT1', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin K15', HE: 'HE1', KHOA: 'K1' },
        { ID: 'CT2', MACHUONGTRINH: '7340101', TENCHUONGTRINH: 'Quản trị kinh doanh K15', HE: 'HE1', KHOA: 'K1' },
        { ID: 'CT3', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin K16', HE: 'HE1', KHOA: 'K2' },
        { ID: 'CT4', MACHUONGTRINH: '7340301', TENCHUONGTRINH: 'Kế toán K01', HE: 'HE2', KHOA: 'K3' }
    ];
    var MONHOC = [
        { ID: 'MH1', MA: 'TIN', TEN: 'Tin học', THUOCBOMON_ID: 'CC2', THUOCBOMON_TEN: 'Bộ môn Hệ thống thông tin', HOCTRINH: 3, KYHIEU: 'TH' },
        { ID: 'MH2', MA: 'CSDL', TEN: 'Cơ sở dữ liệu', THUOCBOMON_ID: 'CC2', THUOCBOMON_TEN: 'Bộ môn Hệ thống thông tin', HOCTRINH: 3, KYHIEU: 'CSDL' },
        { ID: 'MH3', MA: 'KTVM', TEN: 'Kinh tế vi mô', THUOCBOMON_ID: 'CC3', THUOCBOMON_TEN: 'Khoa Kinh tế', HOCTRINH: 2, KYHIEU: 'KTVM' }
    ];
    var HOCPHAN = [
        { ID: 'HP1', MA: 'INT1001', TEN: 'Tin học đại cương', TENTA: 'Introduction to Informatics', THUOCBOMON_ID: 'CC2', THUOCBOMON_TEN: 'Bộ môn Hệ thống thông tin',
          HOCPHANSUDUNGTRONGCTDT: 'Công nghệ thông tin K15; Quản trị kinh doanh K15', DAOTAO_MONHOC_ID: 'MH1', DAOTAO_MONHOC_TEN: 'Tin học',
          THUOCTINHHOCPHAN_ID: 'TT1', THUOCTINHHOCPHAN_TEN: 'Bắt buộc', HOCTRINH: 3, HOCTRINHTINHPHI: 3, KYHIEU: 'THDC', LAMONTINHDIEM: 1, LOAIHOCPHAN_ID: 'LHP1' },
        { ID: 'HP2', MA: 'INT2002', TEN: 'Cơ sở dữ liệu', TENTA: 'Databases', THUOCBOMON_ID: 'CC2', THUOCBOMON_TEN: 'Bộ môn Hệ thống thông tin',
          HOCPHANSUDUNGTRONGCTDT: 'Công nghệ thông tin K15', DAOTAO_MONHOC_ID: 'MH2', DAOTAO_MONHOC_TEN: 'Cơ sở dữ liệu',
          THUOCTINHHOCPHAN_ID: 'TT1', THUOCTINHHOCPHAN_TEN: 'Bắt buộc', HOCTRINH: 3, HOCTRINHTINHPHI: 3, KYHIEU: 'CSDL', LAMONTINHDIEM: 1, LOAIHOCPHAN_ID: 'LHP1' },
        { ID: 'HP3', MA: 'ECO1001', TEN: 'Kinh tế vi mô', TENTA: 'Microeconomics', THUOCBOMON_ID: 'CC3', THUOCBOMON_TEN: 'Khoa Kinh tế',
          HOCPHANSUDUNGTRONGCTDT: 'Quản trị kinh doanh K15; Kế toán K01', DAOTAO_MONHOC_ID: 'MH3', DAOTAO_MONHOC_TEN: 'Kinh tế vi mô',
          THUOCTINHHOCPHAN_ID: 'TT2', THUOCTINHHOCPHAN_TEN: 'Tự chọn', HOCTRINH: 2, HOCTRINHTINHPHI: 2, KYHIEU: 'KTVM', LAMONTINHDIEM: 1, LOAIHOCPHAN_ID: 'LHP1' },
        { ID: 'HP4', MA: 'PE1001', TEN: 'Giáo dục thể chất 1', TENTA: 'Physical Education 1', THUOCBOMON_ID: 'CC4', THUOCBOMON_TEN: 'Phòng Đào tạo',
          HOCPHANSUDUNGTRONGCTDT: 'Công nghệ thông tin K15', DAOTAO_MONHOC_ID: '', DAOTAO_MONHOC_TEN: '',
          THUOCTINHHOCPHAN_ID: 'TT1', THUOCTINHHOCPHAN_TEN: 'Bắt buộc', HOCTRINH: 1, HOCTRINHTINHPHI: 1, KYHIEU: 'GDTC1', LAMONTINHDIEM: 0, LOAIHOCPHAN_ID: 'LHP2' }
    ];
    // Học phần trong chương trình (KHCT_HocPhan_ChuongTrinh)
    var HPCT = { CT1: ['HP1', 'HP2', 'HP4'], CT2: ['HP1', 'HP3'], CT3: ['HP1', 'HP2'], CT4: ['HP3'] };
    function hpTheoId(id) { return HOCPHAN.filter(function (h) { return h.ID === id; })[0] || {}; }
    function ctTheoId(id) { return CT.filter(function (c) { return c.ID === id; })[0] || {}; }
    function khop(q, r, cot) {
        q = String(q || '').toLowerCase();
        return !q || cot.some(function (c) { return String(r[c] || '').toLowerCase().indexOf(q) >= 0; });
    }

    var fx = {};
    fx['KHCT_HeDaoTao/LayDanhSach'] = HE;
    fx['KHCT_KhoaDaoTao/LayDanhSach'] = function (o) { return KHOA.filter(function (k) { return !o.strDaoTao_HeDaoTao_Id || k.HE === o.strDaoTao_HeDaoTao_Id; }); };
    fx['KHCT_ToChucChuongTrinh/LayDanhSach'] = function (o) {
        return CT.filter(function (c) {
            return (!o.strDaoTao_HeDaoTao_Id || c.HE === o.strDaoTao_HeDaoTao_Id) && (!o.strDaoTao_KhoaDaoTao_Id || c.KHOA === o.strDaoTao_KhoaDaoTao_Id);
        });
    };
    fx['KHCT_HocPhan_ChuongTrinh/LayDanhSach'] = function (o) {
        return (HPCT[o.strDaoTao_ChuongTrinh_Id] || []).map(function (id, i) {
            var h = hpTheoId(id);
            return { ID: o.strDaoTao_ChuongTrinh_Id + '_' + i, DAOTAO_HOCPHAN_ID: h.ID, DAOTAO_HOCPHAN_MA: h.MA, DAOTAO_HOCPHAN_TEN: h.TEN };
        });
    };
    fx[DM + 'KHCT.TTHP'] = [dm('TT1', 'BB', 'Bắt buộc'), dm('TT2', 'TC', 'Tự chọn')];
    fx[DM + 'KHCT.LOAIPHANBO'] = [dm('PB1', 'LT', 'Lý thuyết'), dm('PB2', 'TH', 'Thực hành'), dm('PB3', 'BT', 'Bài tập')];
    fx[DM + 'DAOTAO.LOAIHOCPHAN'] = [dm('LHP1', 'CB', 'Học phần chính'), dm('LHP2', 'DK', 'Học phần điều kiện')];
    fx[DM + 'KHCT.LQH'] = [dm('QH1', 'TQ', 'Tiên quyết'), dm('QH2', 'HT', 'Học trước'), dm('QH3', 'SH', 'Song hành')];
    ums.demo.add(fx);

    /* ---- Môn học ---- */
    ums.demo.crudStore('KHCT_MonHoc', MONHOC, {
        list: function (rows, o) {
            return rows.filter(function (r) { return (!o.strThuocBoMon_Id || r.THUOCBOMON_ID === o.strThuocBoMon_Id) && khop(o.strTuKhoa, r, ['MA', 'TEN']); });
        },
        map: function (o) { return { MA: o.strMa, TEN: o.strTen, HOCTRINH: o.dHocTrinh, THUOCBOMON_ID: o.strThuocBoMon_Id, KYHIEU: o.strKyHieu }; }
    });

    /* ---- Học phần (danh sách kiểu cũ, lưu qua pkg_kehoach_thongtin) ---- */
    function mapHP(o) {
        return { MA: o.strMa, TEN: o.strTen, TENTA: o.strTenTA, DAOTAO_MONHOC_ID: o.strDaoTao_MonHoc_Id, HOCTRINH: o.dHocTrinh,
                 THUOCBOMON_ID: o.strThuocBoMon_Id, THUOCTINHHOCPHAN_ID: o.strThuocTinhHocPhan_Id, KYHIEU: o.strKyHieu,
                 LAMONTINHDIEM: o.dLaMonTinhDiem, HOCTRINHTINHPHI: o.dHocTrinhTinhPhi, LOAIHOCPHAN_ID: o.strLoaiHocPhan_Id };
    }
    ums.demo.crudStore('KHCT_HocPhan', HOCPHAN, {
        list: function (rows, o) {
            return rows.filter(function (r) {
                return (!o.strThuocBoMon_Id || r.THUOCBOMON_ID === o.strThuocBoMon_Id) && (!o.strDaoTao_MonHoc_Id || r.DAOTAO_MONHOC_ID === o.strDaoTao_MonHoc_Id) &&
                    (!o.strThuocTinhHocPhan_Id || r.THUOCTINHHOCPHAN_ID === o.strThuocTinhHocPhan_Id) && khop(o.strTuKhoa, r, ['MA', 'TEN']);
            });
        },
        map: mapHP
    });
    var seqHP = 10;
    ums.demo.add({
        'pkg_kehoach_thongtin.Them_DaoTao_HocPhan': function (o) {
            var r = mapHP(o); r.ID = 'HP' + (seqHP++); HOCPHAN.push(r);
            return { rows: [], raw: { Id: r.ID } };
        },
        'pkg_kehoach_thongtin.Sua_DaoTao_HocPhan': function (o) {
            HOCPHAN.forEach(function (r) { if (r.ID === o.strId) { var m = mapHP(o); Object.keys(m).forEach(function (k) { r[k] = m[k]; }); } });
            return { rows: [], raw: { Id: o.strId } };
        }
    });
    ums.demo.crudStore('KHCT_HocPhan_PhanBo', [
        { ID: 'PB_1', DAOTAO_HOCPHAN_ID: 'HP1', LOAIPHANBO_ID: 'PB1', LOAIPHANBO_TEN: 'Lý thuyết', SOTIET: 30 },
        { ID: 'PB_2', DAOTAO_HOCPHAN_ID: 'HP1', LOAIPHANBO_ID: 'PB2', LOAIPHANBO_TEN: 'Thực hành', SOTIET: 15 },
        { ID: 'PB_3', DAOTAO_HOCPHAN_ID: 'HP2', LOAIPHANBO_ID: 'PB1', LOAIPHANBO_TEN: 'Lý thuyết', SOTIET: 45 }
    ], {
        list: function (rows, o) { return rows.filter(function (r) { return r.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; }); },
        map: function (o) { return { DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, LOAIPHANBO_ID: o.strLoaiPhanBo_Id, SOTIET: o.dSoTiet }; }
    });

    /* ---- Học phần tương đương (KHCT_ThongTin/*) ---- */
    var HPTD = [
        { ID: 'TD1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin K15', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương',
          DAOTAO_TOCHUCCHUONGTRINH_TD_ID: 'CT2', DAOTAO_CHUONGTRINH_TD_TEN: 'Quản trị kinh doanh K15', DAOTAO_HOCPHAN_TD_ID: 'HP1', DAOTAO_HOCPHAN_TD_TEN: 'Tin học đại cương', NHOM: '1' },
        { ID: 'TD2', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin K15', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu',
          DAOTAO_TOCHUCCHUONGTRINH_TD_ID: 'CT3', DAOTAO_CHUONGTRINH_TD_TEN: 'Công nghệ thông tin K16', DAOTAO_HOCPHAN_TD_ID: 'HP2', DAOTAO_HOCPHAN_TD_TEN: 'Cơ sở dữ liệu', NHOM: '2' },
        { ID: 'TD3', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh K15', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô',
          DAOTAO_TOCHUCCHUONGTRINH_TD_ID: 'CT4', DAOTAO_CHUONGTRINH_TD_TEN: 'Kế toán K01', DAOTAO_HOCPHAN_TD_ID: 'HP3', DAOTAO_HOCPHAN_TD_TEN: 'Kinh tế vi mô', NHOM: '' }
    ];
    function mapTD(o) {
        return { DAOTAO_TOCHUCCHUONGTRINH_ID: o.strDaoTao_ToChucCT_Id, DAOTAO_CHUONGTRINH_TEN: ctTheoId(o.strDaoTao_ToChucCT_Id).TENCHUONGTRINH,
                 DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, DAOTAO_HOCPHAN_TEN: hpTheoId(o.strDaoTao_HocPhan_Id).TEN,
                 DAOTAO_TOCHUCCHUONGTRINH_TD_ID: o.strDaoTao_ToChucCT_TD_Id, DAOTAO_CHUONGTRINH_TD_TEN: ctTheoId(o.strDaoTao_ToChucCT_TD_Id).TENCHUONGTRINH,
                 DAOTAO_HOCPHAN_TD_ID: o.strDaoTao_HocPhan_TD_Id, DAOTAO_HOCPHAN_TD_TEN: hpTheoId(o.strDaoTao_HocPhan_TD_Id).TEN, NHOM: o.strNhom };
    }
    var seqTD = 10;
    ums.demo.add({
        'KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD': function (o) {
            return HPTD.filter(function (r) {
                var c = ctTheoId(r.DAOTAO_TOCHUCCHUONGTRINH_ID);
                return (!o.strDaoTao_ToChucCT_Id || r.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ToChucCT_Id) &&
                    (!o.strDaoTao_HeDaoTao_Id || c.HE === o.strDaoTao_HeDaoTao_Id) && (!o.strDaoTao_KhoaDaoTao_Id || c.KHOA === o.strDaoTao_KhoaDaoTao_Id) &&
                    khop(o.strTuKhoa, r, ['DAOTAO_HOCPHAN_TEN', 'DAOTAO_HOCPHAN_TD_TEN']);
            });
        },
        'KHCT_ThongTin/LayTTDaoTao_HocPhanTuongDuong': function (o) { return HPTD.filter(function (r) { return r.ID === o.strId; }); },
        'KHCT_ThongTin/Them_DaoTao_HocPhanTuongDuong': function (o) { var r = mapTD(o); r.ID = 'TD' + (seqTD++); HPTD.push(r); return { rows: [], raw: { Id: r.ID } }; },
        'KHCT_ThongTin/Sua_DaoTao_HocPhanTuongDuong': function (o) {
            HPTD.forEach(function (r) { if (r.ID === o.strId) { var m = mapTD(o); Object.keys(m).forEach(function (k) { r[k] = m[k]; }); } });
            return [];
        },
        'KHCT_ThongTin/Xoa_DaoTao_HocPhanTuongDuong': function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = HPTD.length - 1; i >= 0; i--) if (ids.indexOf(HPTD[i].ID) >= 0) HPTD.splice(i, 1);
            return [];
        },
        'D_XuLyDiem/Tinh_HocPhan_TuongDuong_PhamVi': []
    });

    /* ---- Quan hệ học phần ---- */
    ums.demo.crudStore('KHCT_QuanHeHocPhan', [
        { ID: 'QH_1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_MA: '7480201', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu',
          LOAIQUANHE_ID: 'QH1', LOAIQUANHE_TEN: 'Tiên quyết', DAOTAO_HOCPHAN_QUANHE_ID: 'HP1', DAOTAO_HOCPHAN_QUANHE_TEN: 'Tin học đại cương', GIATRIDIEUKIEN: '>= 4' },
        { ID: 'QH_2', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_CHUONGTRINH_MA: '7340101', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô',
          LOAIQUANHE_ID: 'QH2', LOAIQUANHE_TEN: 'Học trước', DAOTAO_HOCPHAN_QUANHE_ID: 'HP1', DAOTAO_HOCPHAN_QUANHE_TEN: 'Tin học đại cương', GIATRIDIEUKIEN: '' }
    ], {
        list: function (rows, o) { return rows.filter(function (r) { return khop(o.strTuKhoa, r, ['DAOTAO_HOCPHAN_TEN', 'DAOTAO_HOCPHAN_QUANHE_TEN']); }); },
        map: function (o) {
            return { DAOTAO_TOCHUCCHUONGTRINH_ID: o.strDaoTao_ToChucCT_Id, DAOTAO_CHUONGTRINH_MA: ctTheoId(o.strDaoTao_ToChucCT_Id).MACHUONGTRINH,
                     DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, DAOTAO_HOCPHAN_TEN: hpTheoId(o.strDaoTao_HocPhan_Id).TEN, LOAIQUANHE_ID: o.strLoaiQuanHe_Id,
                     DAOTAO_HOCPHAN_QUANHE_ID: o.strDaoTao_HocPhan_QuanHe_Id, DAOTAO_HOCPHAN_QUANHE_TEN: hpTheoId(o.strDaoTao_HocPhan_QuanHe_Id).TEN,
                     GIATRIDIEUKIEN: o.strXauDieuKien };
        }
    });

    /* ---- Bài học ---- */
    ums.demo.crudStore('KHCT_BaiHoc', [
        { ID: 'BH_1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương', TENBAI: 'Bài 1. Tổng quan về máy tính',
          KYHIEUBAI: 'B1', SOTIET: 3, NOIDUNG: 'Lịch sử phát triển, cấu trúc máy tính, hệ đếm.' },
        { ID: 'BH_2', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương', TENBAI: 'Bài 2. Hệ điều hành',
          KYHIEUBAI: 'B2', SOTIET: 6, NOIDUNG: 'Khái niệm hệ điều hành, quản lý tệp và thư mục.' },
        { ID: 'BH_3', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', TENBAI: 'Bài 1. Mô hình quan hệ',
          KYHIEUBAI: 'B1', SOTIET: 6, NOIDUNG: 'Quan hệ, khoá, phụ thuộc hàm.' }
    ], {
        list: function (rows, o) {
            return rows.filter(function (r) {
                return (!o.strDaoTao_HocPhan_Id || r.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id) &&
                    (!o.strDaoTao_ToChucCT_Id || r.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ToChucCT_Id) && khop(o.strTuKhoa, r, ['TENBAI', 'NOIDUNG']);
            });
        },
        map: function (o) {
            return { DAOTAO_TOCHUCCHUONGTRINH_ID: o.strDaoTao_ToChucCT_Id, DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, DAOTAO_HOCPHAN_TEN: hpTheoId(o.strDaoTao_HocPhan_Id).TEN,
                     TENBAI: o.strTenBai, KYHIEUBAI: o.strKyHieu, SOTIET: o.dSoTiet, NOIDUNG: o.strNoiDung };
        }
    });
    ums.demo.add({ 'KHCT_BaiHoc/Import': { rows: [], message: '' } });

    /* ---- Đề cương học tập ---- */
    ums.demo.crudStore('KHCT_DeCuongHocTap', [
        { ID: 'DC_1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin K15', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương',
          NOIDUNG: 'Chương 1: Máy tính. Chương 2: Hệ điều hành. Chương 3: Soạn thảo văn bản.', MOTA: 'Đề cương áp dụng từ học kỳ 1 năm học 2025-2026.' },
        { ID: 'DC_2', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh K15', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô',
          NOIDUNG: 'Cung cầu, hành vi người tiêu dùng, thị trường.', MOTA: '' }
    ], {
        list: function (rows, o) {
            return rows.filter(function (r) {
                return (!o.strDaoTao_HocPhan_Id || r.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id) &&
                    (!o.strDaoTao_ToChucCT_Id || r.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ToChucCT_Id) && khop(o.strTuKhoa, r, ['NOIDUNG', 'DAOTAO_HOCPHAN_TEN']);
            });
        },
        map: function (o) {
            return { DAOTAO_TOCHUCCHUONGTRINH_ID: o.strDaoTao_ToChucCT_Id, DAOTAO_CHUONGTRINH_TEN: ctTheoId(o.strDaoTao_ToChucCT_Id).TENCHUONGTRINH,
                     DAOTAO_HOCPHAN_ID: o.strDaoTao_HocPhan_Id, DAOTAO_HOCPHAN_TEN: hpTheoId(o.strDaoTao_HocPhan_Id).TEN, NOIDUNG: o.strNoiDung, MOTA: o.strMoTa };
        }
    });
})();
