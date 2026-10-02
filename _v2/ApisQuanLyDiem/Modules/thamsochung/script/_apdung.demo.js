/* Dữ liệu mẫu dùng chung cho họ màn "… áp dụng" (ums.qldAD) — chỉ dùng ở chế độ dựng thử.
   ums.qldADDemo(ctl, cotKhoa, mau) dựng kho nhớ cho một controller <ctl>_ApDung:
     LayDanhSach lọc theo strPhamViApDung_Id, ThemMoi / CapNhat / Xoa sửa kho. */
(function () {
    var HE = [
        { ID: 'HE1', MAHEDAOTAO: 'DHCQ', TENHEDAOTAO: 'Đại học chính quy' },
        { ID: 'HE2', MAHEDAOTAO: 'LT', TENHEDAOTAO: 'Liên thông đại học' }
    ];
    var KHOA = [
        { ID: 'K15', MAKHOA: 'K15', TENKHOA: 'Khóa 15 (2021-2025)', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
        { ID: 'K16', MAKHOA: 'K16', TENKHOA: 'Khóa 16 (2022-2026)', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
        { ID: 'K17', MAKHOA: 'K17', TENKHOA: 'Khóa 17 (2023-2027)', DAOTAO_HEDAOTAO_ID: 'HE1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
        { ID: 'LT8', MAKHOA: 'LT8', TENKHOA: 'Liên thông khóa 8', DAOTAO_HEDAOTAO_ID: 'HE2', DAOTAO_HEDAOTAO_TEN: 'Liên thông đại học' }
    ];
    var NGANH = ['Kế toán', 'Quản trị kinh doanh', 'Công nghệ thông tin', 'Ngôn ngữ Anh', 'Tài chính - Ngân hàng', 'Luật kinh tế'];
    var CT = [];
    KHOA.forEach(function (k, i) {
        NGANH.forEach(function (n, j) {
            if ((i + j) % 4 === 3) return;
            CT.push({ ID: 'CT' + k.ID + j, MACHUONGTRINH: k.MAKHOA + '.' + (7340100 + j), TENCHUONGTRINH: n + ' - ' + k.MAKHOA,
                DAOTAO_KHOADAOTAO_ID: k.ID, DAOTAO_KHOADAOTAO_TEN: k.TENKHOA, DAOTAO_HEDAOTAO_ID: k.DAOTAO_HEDAOTAO_ID });
        });
    });
    var TG = [];
    ['2023-2024', '2024-2025', '2025-2026'].forEach(function (nam, i) {
        [1, 2].forEach(function (hk) {
            TG.push({ ID: 'TG' + i + hk, DAOTAO_THOIGIANDAOTAO: 'Học kỳ ' + hk + ' năm ' + nam });
        });
    });
    var HP = [
        ['HP01', 'Toán cao cấp 1'], ['HP02', 'Kinh tế vi mô'], ['HP03', 'Nguyên lý kế toán'],
        ['HP04', 'Tiếng Anh 1'], ['HP05', 'Tin học đại cương'], ['HP06', 'Pháp luật đại cương'],
        ['HP07', 'Xác suất thống kê'], ['HP08', 'Kinh tế lượng']
    ];

    ums.demo.add({
        'KHCT_HeDaoTao/LayDanhSach': HE,
        'KHCT_KhoaDaoTao/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return KHOA.filter(function (k) {
                return (!o.strDaoTao_HeDaoTao_Id || k.DAOTAO_HEDAOTAO_ID === o.strDaoTao_HeDaoTao_Id) &&
                    (!q || k.TENKHOA.toLowerCase().indexOf(q) >= 0);
            });
        },
        'KHCT_ToChucChuongTrinh/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var ds = CT.filter(function (c) {
                return (!o.strDaoTao_HeDaoTao_Id || c.DAOTAO_HEDAOTAO_ID === o.strDaoTao_HeDaoTao_Id) &&
                    (!o.strDaoTao_KhoaDaoTao_Id || c.DAOTAO_KHOADAOTAO_ID === o.strDaoTao_KhoaDaoTao_Id) &&
                    (!q || c.TENCHUONGTRINH.toLowerCase().indexOf(q) >= 0);
            });
            var sz = Number(o.pageSize) || 10, i = Number(o.pageIndex) || 1;
            return { rows: ds.slice((i - 1) * sz, i * sz), pager: ds.length };
        },
        'KHCT_ThoiGianDaoTao/LayDanhSach': TG,
        'KHCT_HocPhan_ChuongTrinh/LayDanhSach': function (o) {
            return HP.map(function (h, i) {
                return { ID: 'HPC' + i, DAOTAO_HOCPHAN_ID: h[0], DAOTAO_HOCPHAN_MA: h[0], DAOTAO_HOCPHAN_TEN: h[0] + ' - ' + h[1], DAOTAO_CHUONGTRINH_ID: o.strDaoTao_ChuongTrinh_Id };
            });
        }
    });

    /* Phần THÊM 2026-09-25 — tab người học (Q.cap.nguoiHocLop / Q.con.nguoiHoc) và hộp
       Kế thừa CTĐT (Q.hopKeThuaCTDT) của bốn màn thamsotinhdiem / thamsodanhgiaketqua /
       thamsoquydoithangdiem / congthucdiem. */
    var SV = [
        ['SV01', 'BIT220101', 'Nguyễn Văn', 'An'], ['SV02', 'BIT220102', 'Trần Thị', 'Bình'],
        ['SV03', 'BIT220103', 'Lê Minh', 'Châu'], ['SV04', 'BIT220104', 'Phạm Thu', 'Dung']
    ];
    ums.demo.add({
        'SV_HoSoNhieuNganh/LayDanhSach': function (o) {
            return SV.map(function (x) {
                return { ID: x[0] + o.strChuongTrinh_Id, QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3] };
            });
        },
        'SV_ThongTin/LayDSThoiGianLichHoc': [{ ID: 'TG11', THOIGIAN: '2024_2025_1' }, { ID: 'TG12', THOIGIAN: '2024_2025_2' }],
        'SV_ThongTin/LayKetQuaDangKyHocCaNhan': function (o) {
            if (o.strDaoTao_ThoiGianDaoTao_Id === 'TG12') return { rows: { rsKetQuaDangKy: [] } };
            return { rows: { rsKetQuaDangKy: [
                { DANGKY_LOPHOCPHAN_ID: 'LHP1', DANGKY_LOPHOCPHAN_TEN: 'Toán cao cấp 1 - 01' },
                { DANGKY_LOPHOCPHAN_ID: 'LHP2', DANGKY_LOPHOCPHAN_TEN: 'Kinh tế vi mô - 03' }
            ] } };
        },
        'pkg_kehoach_thongtin.LayDSDaoTao_NamHoc': [{ ID: 'N2324', NAMHOC: '2023-2024' }, { ID: 'N2425', NAMHOC: '2024-2025' }],
        'PKG_DIEM_THONGTIN2.LayDSKeThuaCungCTDT': function (o) {
            return CT.filter(function (c) { return !o.strDaoTao_KhoaDaoTao_Id || c.DAOTAO_KHOADAOTAO_ID === o.strDaoTao_KhoaDaoTao_Id; }).slice(0, 6).map(function (c, i) {
                return { ID: 'KT' + i, DAOTAO_KHOADAOTAO_TEN: c.DAOTAO_KHOADAOTAO_TEN, CHUONGTRINH: c.TENCHUONGTRINH, DAOTAO_TOCHUCCHUONGTRINH_ID: c.ID,
                    DAOTAO_HOCPHAN_ID: 'HP01', DAOTAO_HOCPHAN_MA: 'HP01', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp 1' };
            });
        },
        'PKG_DIEM_THONGTIN2.KeThuaDiem_TSDanhGiaKetQua_AD': [],
        'PKG_DIEM_THONGTIN2.KeThuaDiem_QuyDoiThangDiem_AD': [],
        'D_ThongTin/KeThua_CongThucDiem_HP_CT_AD': []
    });

    var n = 0;
    ums.qldADDemo = function (ctl, mau) {
        var kho = {};   // strPhamViApDung_Id → [dòng]
        function ds(pv) {
            if (!kho[pv]) kho[pv] = (mau(pv) || []).map(function (r, i) {
                return Object.assign({ ID: ctl + '_' + (++n), LADULIEUKHOITAO: i === 0 ? '1' : '0' }, r);
            });
            return kho[pv];
        }
        function tuThamSo(o) {
            var r = {};
            Object.keys(o).forEach(function (k) { r[k] = o[k]; });
            return r;
        }
        var fx = {};
        fx[ctl + '/LayDanhSach'] = function (o) { return ds(o.strPhamViApDung_Id).slice(); };
        function ghi(o) {
            var list = ds(o.strPhamViApDung_Id);
            var r = o.strId ? list.filter(function (x) { return x.ID === o.strId; })[0] : null;
            if (!r) { r = { ID: ctl + '_' + (++n), LADULIEUKHOITAO: '0' }; list.push(r); }
            Object.assign(r, mau.map ? mau.map(tuThamSo(o)) : {});
            return { rows: [], raw: { Id: r.ID } };
        }
        fx[ctl + '/ThemMoi'] = ghi;
        fx[ctl + '/CapNhat'] = ghi;
        fx[ctl + '/Xoa'] = function (o) {
            Object.keys(kho).forEach(function (pv) { kho[pv] = kho[pv].filter(function (x) { return x.ID !== o.strIds; }); });
            return [];
        };
        fx[ctl + '/KeThua'] = [];
        ums.demo.add(fx);
    };
})();
