/* Dữ liệu mẫu cho kehoachdangky/donlop — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LHP = [
        ['LHP1', 'IT3080.01', 'Lập trình Web - Nhóm 1', 'Thứ 3, tiết 1-3, P.402<br>Từ 08/09/2026 đến 20/12/2026', 42, 45, 'HP1'],
        ['LHP2', 'IT3080.02', 'Lập trình Web - Nhóm 2', 'Thứ 5, tiết 4-6, P.305<br>Từ 10/09/2026 đến 22/12/2026', 18, 45, 'HP1'],
        ['LHP3', 'IT3080.03', 'Lập trình Web - Nhóm 3', 'Thứ 6, tiết 7-9, P.307', 9, 45, 'HP1'],
        ['LHP4', 'IT3090.01', 'Cơ sở dữ liệu - Nhóm 1', 'Thứ 2, tiết 1-3, P.201', 0, 50, 'HP2'],
        ['LHP5', 'EC2010.01', 'Kinh tế vi mô - Nhóm 1', 'Thứ 4, tiết 1-3, P.210', 55, 60, 'HP3']
    ].map(function (x) {
        return { ID: x[0], MALOP: x[1], TENLOP: x[2], THOIGIANCHITIET: x[3], SOSVDADANGKY: x[4], SOLUONGDUKIENHOC: x[5],
            DAOTAO_HOCPHAN_ID: x[6], DAOTAO_THOIGIANDAOTAO_ID: 'TG2' };
    });
    var SV = [
        ['NH1', 'BIT220263', 'Nguyễn Văn', 'An', 'K67-KTPM1'],
        ['NH2', 'BIT220271', 'Trần Thị', 'Bình', 'K67-KTPM1'],
        ['NH3', 'BIT220288', 'Lê Hoàng', 'Cường', 'K67-KTPM1'],
        ['NH6', 'BIT230210', 'Vũ Ngọc', 'Hà', 'K68-HTTT1']
    ];
    var DK = {};   // lớp → danh sách đăng ký
    function dong(lhp, x, i) {
        return { ID: 'DK' + lhp + '_' + x[0], QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_NGAYSINH: '12/03/2004', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: x[4],
            DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM',
            DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy',
            NGAYTAO_DD_MM_YYYY_HHMMSS: '0' + (5 + i) + '/08/2026 08:1' + i + ':00', SOLUONGDUKIENHOC: 45,
            DAOTAO_HOCPHAN_ID: 'HP1', DANGKY_LOPHOCPHAN_ID: lhp, DANGKY_KEHOACHDANGKY_ID: 'KH1' };
    }
    DK.LHP1 = SV.map(function (x, i) { return dong('LHP1', x, i); });
    DK.LHP2 = SV.slice(0, 2).map(function (x, i) { return dong('LHP2', x, i); });
    DK.LHP3 = SV.slice(3).map(function (x, i) { return dong('LHP3', x, i); });
    ums.demo.add({
        'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }],
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }] : [];
        },
        'DKH_PhanCong_LopHP/LayDSHocPhan': [{ ID: 'HP1', MA: 'IT3080', TEN: 'Lập trình Web' }, { ID: 'HP2', MA: 'IT3090', TEN: 'Cơ sở dữ liệu' }, { ID: 'HP3', MA: 'EC2010', TEN: 'Kinh tế vi mô' }],
        'pkg_dangkyhoc_thongtin.LayDSLopHocPhan': function (o) {
            var hp = o.strDaoTao_HocPhan_Id ? String(o.strDaoTao_HocPhan_Id).split(',') : [];
            var r = LHP.filter(function (x) { return !hp.length || hp.indexOf(x.DAOTAO_HOCPHAN_ID) >= 0; });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        },
        'DKH_PhanCong_LopHP/LayDanhSach': function (o) {
            return o.strDangKy_LopHocPhan_Id === 'LHP4' ? [] : [
                { ID: 'PV1', PHAMVIAPDUNG_TEN: 'Khóa 67 - Kỹ thuật phần mềm', PHANCAPAPDUNG_TEN: 'Chương trình' },
                { ID: 'PV2', PHAMVIAPDUNG_TEN: 'K67-KTPM1', PHANCAPAPDUNG_TEN: 'Lớp' }
            ];
        },
        'DKH_PhanCong_LopHP/LayDSDangKyHoc': function (o) { return DK[o.strDaoTao_LopHocPhan_Id] || []; },
        'DKH_PhanCong_LopHP/LayDSLopHocPhan': function (o) { return LHP.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; }); },
        'DKH_DangKy/ThucHienDonLopDangKyHoc': function (o) {
            var cu = DK[o.strDangKy_LopHocPhan_Cu_Ids] || [], moi = DK[o.strDangKy_LopHocPhan_Moi_Ids] || (DK[o.strDangKy_LopHocPhan_Moi_Ids] = []);
            var r = cu.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; })[0];
            if (r) {
                cu.splice(cu.indexOf(r), 1);
                moi.push(Object.assign({}, r, { ID: 'DK' + o.strDangKy_LopHocPhan_Moi_Ids + '_' + r.QLSV_NGUOIHOC_ID, DANGKY_LOPHOCPHAN_ID: o.strDangKy_LopHocPhan_Moi_Ids }));
            }
            return { rows: [], message: '' };
        },
        'DKH_DangKy/ThucHienHuyDangKyHocHocPhan': function (o) {
            Object.keys(DK).forEach(function (k) { DK[k] = DK[k].filter(function (x) { return x.QLSV_NGUOIHOC_ID !== o.strQLSV_NguoiHoc_Id || x.DAOTAO_HOCPHAN_ID !== o.strDaoTao_HocPhan_Id || k !== 'LHP1'; }); });
            return { rows: [], message: '' };
        },
        'D_PhanQuyen/TaoDuLieuNhapDiem': { rows: [], message: '' }
    });
})();
