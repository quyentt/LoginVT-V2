/* Dữ liệu mẫu cho 6 màn danh mục đào tạo (tochucchuongtrinh) — chỉ dùng ở chế độ dựng thử.
   Dùng chung vì các màn đọc danh sách của nhau (Hệ → Khoá, Năm học, Chương trình). */
(function () {
    'use strict';
    var D = ums.demo;
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    function loc(rows, o, cot) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) {
            return Object.keys(cot || {}).every(function (k) {
                var v = o[k];
                if (!v) return true;
                return String(v).split(',').indexOf(String(r[cot[k]])) >= 0;
            }) && (!q || JSON.stringify(r).toLowerCase().indexOf(q) >= 0);
        });
    }

    var HTDT = [dm('HT1', 'CQ', 'Chính quy', 'Hình thức đào tạo'), dm('HT2', 'VLVH', 'Vừa làm vừa học', 'Hình thức đào tạo'),
        dm('HT3', 'TX', 'Đào tạo từ xa', 'Hình thức đào tạo')];
    var BAC = [dm('BAC1', 'DH', 'Đại học', 'Bậc đào tạo'), dm('BAC2', 'THS', 'Thạc sĩ', 'Bậc đào tạo'), dm('BAC3', 'TS', 'Tiến sĩ', 'Bậc đào tạo')];
    var PLDT = [dm('PL1', 'VN', 'Người Việt Nam', 'Phân loại đối tượng'), dm('PL2', 'NN', 'Lưu học sinh', 'Phân loại đối tượng')];

    var HE = [
        { ID: 'HE1', MAHEDAOTAO: 'DHCQ', TENHEDAOTAO: 'Đại học chính quy', DAOTAO_HINHTHUCDAOTAO_ID: 'HT1', DAOTAO_HINHTHUCDAOTAO_TEN: 'Chính quy',
            DAOTAO_BACDAOTAO_ID: 'BAC1', DAOTAO_BACDAOTAO_TEN: 'Đại học', PHANLOAIDOITUONG_ID: 'PL1', PHANLOAIDOITUONG_TEN: 'Người Việt Nam' },
        { ID: 'HE2', MAHEDAOTAO: 'DHVLVH', TENHEDAOTAO: 'Đại học vừa làm vừa học', DAOTAO_HINHTHUCDAOTAO_ID: 'HT2', DAOTAO_HINHTHUCDAOTAO_TEN: 'Vừa làm vừa học',
            DAOTAO_BACDAOTAO_ID: 'BAC1', DAOTAO_BACDAOTAO_TEN: 'Đại học', PHANLOAIDOITUONG_ID: 'PL1', PHANLOAIDOITUONG_TEN: 'Người Việt Nam' },
        { ID: 'HE3', MAHEDAOTAO: 'THS', TENHEDAOTAO: 'Thạc sĩ', DAOTAO_HINHTHUCDAOTAO_ID: 'HT1', DAOTAO_HINHTHUCDAOTAO_TEN: 'Chính quy',
            DAOTAO_BACDAOTAO_ID: 'BAC2', DAOTAO_BACDAOTAO_TEN: 'Thạc sĩ', PHANLOAIDOITUONG_ID: 'PL1', PHANLOAIDOITUONG_TEN: 'Người Việt Nam' },
        { ID: 'HE4', MAHEDAOTAO: 'LHS', TENHEDAOTAO: 'Đại học — lưu học sinh', DAOTAO_HINHTHUCDAOTAO_ID: 'HT1', DAOTAO_HINHTHUCDAOTAO_TEN: 'Chính quy',
            DAOTAO_BACDAOTAO_ID: 'BAC1', DAOTAO_BACDAOTAO_TEN: 'Đại học', PHANLOAIDOITUONG_ID: 'PL2', PHANLOAIDOITUONG_TEN: 'Lưu học sinh' }
    ];
    var tenHe = function (id) { var h = HE.filter(function (x) { return x.ID === id; })[0]; return h ? h.TENHEDAOTAO : ''; };

    var KHOA = [
        { ID: 'K16', MAKHOA: 'K16', TENKHOA: 'Khóa 16 (2023–2027)', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', NAMNHAPHOC: '2023', NAMKETTHUCTHEOKEHOACH: '2027', SONAMDAOTAO: '4' },
        { ID: 'K17', MAKHOA: 'K17', TENKHOA: 'Khóa 17 (2024–2028)', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', NAMNHAPHOC: '2024', NAMKETTHUCTHEOKEHOACH: '2028', SONAMDAOTAO: '4' },
        { ID: 'K18', MAKHOA: 'K18', TENKHOA: 'Khóa 18 (2025–2029)', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', NAMNHAPHOC: '2025', NAMKETTHUCTHEOKEHOACH: '2029', SONAMDAOTAO: '4' },
        { ID: 'KV10', MAKHOA: 'VL10', TENKHOA: 'Vừa làm vừa học khóa 10', DAOTAO_HEDAOTAO_ID: 'HE2', DAOTAO_HEDAOTAO_TEN: 'Đại học vừa làm vừa học', NAMNHAPHOC: '2024', NAMKETTHUCTHEOKEHOACH: '2028', SONAMDAOTAO: '4' },
        { ID: 'KT32', MAKHOA: 'CH32', TENKHOA: 'Cao học khóa 32', DAOTAO_HEDAOTAO_ID: 'HE3', DAOTAO_HEDAOTAO_TEN: 'Thạc sĩ', NAMNHAPHOC: '2025', NAMKETTHUCTHEOKEHOACH: '2027', SONAMDAOTAO: '2' }
    ];

    var NAM = [
        { ID: 'N2023', NAMHOC: '2023' }, { ID: 'N2024', NAMHOC: '2024' }, { ID: 'N2025', NAMHOC: '2025' }, { ID: 'N2026', NAMHOC: '2026' }
    ];
    var tenNam = function (id) { var n = NAM.filter(function (x) { return x.ID === id; })[0]; return n ? n.NAMHOC : ''; };

    var TGDT = [
        { ID: 'TG1', HOCKY: '1', NAMHOC: '2025', DAOTAO_THOIGIANDAOTAO_NAM_ID: 'N2025', DOTHOC: '1', THANG: '9', LOAIHOCKY: '1', NGAYBATDAU: '08/09/2025', NGAYKETTHUC: '18/01/2026' },
        { ID: 'TG2', HOCKY: '2', NAMHOC: '2025', DAOTAO_THOIGIANDAOTAO_NAM_ID: 'N2025', DOTHOC: '1', THANG: '2', LOAIHOCKY: '1', NGAYBATDAU: '09/02/2026', NGAYKETTHUC: '21/06/2026' },
        { ID: 'TG3', HOCKY: '3', NAMHOC: '2025', DAOTAO_THOIGIANDAOTAO_NAM_ID: 'N2025', DOTHOC: '1', THANG: '7', LOAIHOCKY: '2', NGAYBATDAU: '29/06/2026', NGAYKETTHUC: '16/08/2026' },
        { ID: 'TG4', HOCKY: '1', NAMHOC: '2026', DAOTAO_THOIGIANDAOTAO_NAM_ID: 'N2026', DOTHOC: '1', THANG: '9', LOAIHOCKY: '1', NGAYBATDAU: '07/09/2026', NGAYKETTHUC: '17/01/2027' }
    ];

    var CT = [
        { ID: 'CT1', MACHUONGTRINH: '7480201', TENCHUONGTRINH: 'Công nghệ thông tin', TENCHUONGTRINHTA: 'Information Technology',
            LOAICHUONGTRINH_ID: 'LCT1', LOAICHUONGTRINH_TEN: 'Chuẩn', NGANHTUYENSINH_ID: 'NTS1', NGANHTUYENSINH_TEN: 'Công nghệ thông tin',
            DAOTAO_KHOADAOTAO_ID: 'K17', DAOTAO_KHOADAOTAO_TEN: 'Khóa 17 (2024–2028)', DAOTAO_HEDAOTAO_ID: 'HE1',
            DAOTAO_KHOAQUANLY_ID: 'KQL1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_N_CN_ID: 'NCN1', DAOTAO_N_CN_TEN: 'Công nghệ thông tin',
            TONGSOTINCHIQUYDINH: 130, THOIGIANDAOTAO: 4, DSLOPQUANLY: 'CNTT17.1, CNTT17.2', MOTA: 'Chương trình chuẩn 4 năm', COSODAOTAO_ID: 'CS1',
            TRINHDO_ID: 'TD1', PHANLOAI_N_CN: '1', DAOTAO_TOCHUCCT_CHA_ID: '' },
        { ID: 'CT2', MACHUONGTRINH: '7340301', TENCHUONGTRINH: 'Kế toán', TENCHUONGTRINHTA: 'Accounting',
            LOAICHUONGTRINH_ID: 'LCT1', LOAICHUONGTRINH_TEN: 'Chuẩn', NGANHTUYENSINH_ID: 'NTS2', NGANHTUYENSINH_TEN: 'Kế toán',
            DAOTAO_KHOADAOTAO_ID: 'K17', DAOTAO_KHOADAOTAO_TEN: 'Khóa 17 (2024–2028)', DAOTAO_HEDAOTAO_ID: 'HE1',
            DAOTAO_KHOAQUANLY_ID: 'KQL2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_N_CN_ID: 'NCN2', DAOTAO_N_CN_TEN: 'Kế toán',
            TONGSOTINCHIQUYDINH: 125, THOIGIANDAOTAO: 4, DSLOPQUANLY: 'KT17.1', MOTA: '', COSODAOTAO_ID: 'CS1', TRINHDO_ID: 'TD1' },
        { ID: 'CT3', MACHUONGTRINH: '7480201-CLC', TENCHUONGTRINH: 'Công nghệ thông tin (chất lượng cao)', TENCHUONGTRINHTA: 'Information Technology (High quality)',
            LOAICHUONGTRINH_ID: 'LCT2', LOAICHUONGTRINH_TEN: 'Chất lượng cao', NGANHTUYENSINH_ID: 'NTS1', NGANHTUYENSINH_TEN: 'Công nghệ thông tin',
            DAOTAO_KHOADAOTAO_ID: 'K18', DAOTAO_KHOADAOTAO_TEN: 'Khóa 18 (2025–2029)', DAOTAO_HEDAOTAO_ID: 'HE1',
            DAOTAO_KHOAQUANLY_ID: 'KQL1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_N_CN_ID: 'NCN1', DAOTAO_N_CN_TEN: 'Công nghệ thông tin',
            TONGSOTINCHIQUYDINH: 140, THOIGIANDAOTAO: 4, DSLOPQUANLY: '', MOTA: '', COSODAOTAO_ID: 'CS2', TRINHDO_ID: 'TD1' },
        { ID: 'CT4', MACHUONGTRINH: '8340301', TENCHUONGTRINH: 'Thạc sĩ Kế toán', TENCHUONGTRINHTA: 'Master of Accounting',
            LOAICHUONGTRINH_ID: 'LCT1', LOAICHUONGTRINH_TEN: 'Chuẩn', NGANHTUYENSINH_ID: 'NTS2', NGANHTUYENSINH_TEN: 'Kế toán',
            DAOTAO_KHOADAOTAO_ID: 'KT32', DAOTAO_KHOADAOTAO_TEN: 'Cao học khóa 32', DAOTAO_HEDAOTAO_ID: 'HE3',
            DAOTAO_KHOAQUANLY_ID: 'KQL2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_N_CN_ID: 'NCN2', DAOTAO_N_CN_TEN: 'Kế toán',
            TONGSOTINCHIQUYDINH: 60, THOIGIANDAOTAO: 2, DSLOPQUANLY: 'CH32KT', MOTA: '', COSODAOTAO_ID: 'CS1', TRINHDO_ID: 'TD2' }
    ];

    var NDCT = [
        { ID: 'ND1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_MA: '7480201', NOIDUNG: 'Khối kiến thức giáo dục đại cương 32 tín chỉ; cơ sở ngành 40 tín chỉ.' },
        { ID: 'ND2', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_MA: '7480201', NOIDUNG: 'Thực tập tốt nghiệp 8 tuần tại doanh nghiệp.' },
        { ID: 'ND3', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_CHUONGTRINH_MA: '7340301', NOIDUNG: 'Chuẩn đầu ra tiếng Anh B1.' }
    ];

    D.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.HTDT': HTDT,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.BACDAOTAO': BAC,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHDT.PHANLOAIDOITUONGDAOTAO': PLDT,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.LOAICHUONGTRINH': [dm('LCT1', 'CHUAN', 'Chuẩn', 'Loại chương trình'),
            dm('LCT2', 'CLC', 'Chất lượng cao', 'Loại chương trình')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TUYENSINH.NGANHNGHE': [dm('NTS1', '7480201', 'Công nghệ thông tin', 'Ngành nghề'),
            dm('NTS2', '7340301', 'Kế toán', 'Ngành nghề')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KHCT.NCN': [dm('NCN1', 'CNTT', 'Công nghệ thông tin', 'Ngành/chuyên ngành'),
            dm('NCN2', 'KT', 'Kế toán', 'Ngành/chuyên ngành')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DAOTAO.CHUONGTRINH.TRINHDO': [dm('TD1', 'CN', 'Cử nhân / Kỹ sư', 'Loại bằng'),
            dm('TD2', 'THS', 'Thạc sĩ', 'Loại bằng')],
        'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao': [{ ID: 'CS1', TEN: 'Cơ sở chính — Hà Nội' }, { ID: 'CS2', TEN: 'Phân hiệu Đồng Nai' }],
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': [{ ID: 'KQL1', MA: 'CNTT', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', MA: 'KT', TEN: 'Khoa Kinh tế' }],
        'KHCT_ToChucChuongTrinh/KeThua': []
    });

    D.crudStore('KHCT_HeDaoTao', HE, {
        list: function (rows, o) { return loc(rows, o, { strDaoTao_HinhThucDaoTao_Id: 'DAOTAO_HINHTHUCDAOTAO_ID', strDaoTao_BacDaoTao_Id: 'DAOTAO_BACDAOTAO_ID' }); },
        map: function (o) {
            return { MAHEDAOTAO: o.strMaHeDaoTao, TENHEDAOTAO: o.strTenHeDaoTao, DAOTAO_HINHTHUCDAOTAO_ID: o.strDaoTao_HinhThucDaoTao_Id,
                DAOTAO_BACDAOTAO_ID: o.strDaoTao_BacDaoTao_Id, PHANLOAIDOITUONG_ID: o.strPhanLoaiDoiTuong_Id };
        }
    });
    D.crudStore('KHCT_KhoaDaoTao', KHOA, {
        list: function (rows, o) { return loc(rows, o, { strDaoTao_HeDaoTao_Id: 'DAOTAO_HEDAOTAO_ID' }); }
    });
    D.crudStore('KHCT_NamHoc', NAM, {
        list: function (rows, o) { return loc(rows, o, {}); },
        map: function (o) { return { NAMHOC: o.dNamHoc }; }
    });
    D.crudStore('KHCT_ThoiGianDaoTao', TGDT, {
        list: function (rows, o) { return loc(rows, o, { strDAOTAO_NAM_Id: 'DAOTAO_THOIGIANDAOTAO_NAM_ID' }); }
    });
    D.crudStore('KHCT_ToChucChuongTrinh', CT, {
        list: function (rows, o) { return loc(rows, o, { strDaoTao_HeDaoTao_Id: 'DAOTAO_HEDAOTAO_ID', strDaoTao_KhoaDaoTao_Id: 'DAOTAO_KHOADAOTAO_ID' }); }
    });
    D.crudStore('KHCT_NoiDungChuongTrinh', NDCT, {
        list: function (rows, o) { return loc(rows, o, { strDaoTao_ToChucCT_Id: 'DAOTAO_TOCHUCCHUONGTRINH_ID' }); },
        map: function (o) { return { DAOTAO_TOCHUCCHUONGTRINH_ID: o.strDaoTao_ToChucCT_Id, NOIDUNG: o.strNoiDung }; }
    });

    /* Lời gọi ghi kiểu procedure / KHCT_ThongTin (không theo khuôn crudStore) */
    function upsert(rows, o, map) {
        var r = null;
        if (o.strId) r = rows.filter(function (x) { return x.ID === o.strId; })[0];
        if (!r) { r = { ID: 'M' + Date.now() }; rows.push(r); }
        var m = map(o); Object.keys(m).forEach(function (k) { r[k] = m[k]; });
        return { rows: [], raw: { Id: r.ID } };
    }
    function khoaMap(o) {
        return { MAKHOA: o.strMaKhoa, TENKHOA: o.strTenKhoa, NAMNHAPHOC: o.strNamNhapHoc, NAMKETTHUCTHEOKEHOACH: o.strNamKetThucTheoKeHoach,
            SONAMDAOTAO: o.strSoNamDaoTao, DAOTAO_HEDAOTAO_ID: o.strDaoTao_HeDaoTao_Id, DAOTAO_HEDAOTAO_TEN: tenHe(o.strDaoTao_HeDaoTao_Id) };
    }
    function tgMap(o) {
        return { HOCKY: o.dHocKy, THANG: o.dThang, DOTHOC: o.dDotHoc, LOAIHOCKY: o.dLoaiHocKy, DAOTAO_THOIGIANDAOTAO_NAM_ID: o.strDaoTao_Nam_Id,
            NAMHOC: tenNam(o.strDaoTao_Nam_Id), NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc };
    }
    function ctMap(o) {
        return { MACHUONGTRINH: o.strMaChuongTrinh, TENCHUONGTRINH: o.strTenChuongTrinh, TENCHUONGTRINHTA: o.strTenChuongTrinhTA,
            LOAICHUONGTRINH_ID: o.strLoaiChuongTrinh_Id, NGANHTUYENSINH_ID: o.strNganhTuyenSinh_Id, DAOTAO_KHOADAOTAO_ID: o.strDaoTao_KhoaDaoTao_Id,
            DAOTAO_KHOAQUANLY_ID: o.strDaoTao_KhoaQuanLy_Id, DAOTAO_N_CN_ID: o.strDaoTao_N_CN_Id, TONGSOTINCHIQUYDINH: o.dTongSoTinChiQuyDinh,
            THOIGIANDAOTAO: o.dThoiGianDaoTao, MOTA: o.strMoTa, COSODAOTAO_ID: o.strDaoTao_CoSoDaoTao_Id, TRINHDO_ID: o.strTrinhDo_Id };
    }
    D.add({
        'pkg_kehoach_thongtin.Them_DaoTao_KhoaDaoTao': function (o) { return upsert(KHOA, o, khoaMap); },
        'pkg_kehoach_thongtin.Sua_DaoTao_KhoaDaoTao': function (o) { return upsert(KHOA, o, khoaMap); },
        'KHCT_ThongTin/Them_DaoTao_ThoiGianDaoTao': function (o) { return upsert(TGDT, o, tgMap); },
        'KHCT_ThongTin/Sua_DaoTao_ThoiGianDaoTao': function (o) { return upsert(TGDT, o, tgMap); },
        'pkg_kehoach_thongtin.Them_DaoTao_ToChucCT': function (o) { return upsert(CT, o, ctMap); },
        'pkg_kehoach_thongtin.Sua_DaoTao_ToChucCT': function (o) { return upsert(CT, o, ctMap); }
    });
})();
