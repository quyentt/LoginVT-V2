/* Dữ liệu mẫu cho dangkymonthi (Đăng ký môn thi) — chỉ dùng ở chế độ dựng thử. Người học mẫu: SV0001.
   Cùng procedure với thilai (pkg_dangkythi_monthi_*), dữ liệu mẫu theo nghĩa "thi chứng chỉ ngoại ngữ". */
(function () {
    var fx = {};
    fx['pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc'] = [
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 16' },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2) - Khóa 16' }
    ];
    var KH = {
        CT01: [
            { ID: 'MT01', TENKEHOACH: 'Thi chuẩn đầu ra ngoại ngữ đợt 3/2026', TUNGAY: '15/09/2026', DENNGAY: '05/10/2026', MUCPHIDANGKY: 1200000, NGAYHANNOPPHI: '10/10/2026' },
            { ID: 'MT02', TENKEHOACH: 'Thi chuẩn đầu ra tin học đợt 3/2026', TUNGAY: '15/09/2026', DENNGAY: '30/09/2026', MUCPHIDANGKY: 600000, NGAYHANNOPPHI: '05/10/2026' },
            { ID: 'MT03', TENKEHOACH: 'Thi chuẩn đầu ra ngoại ngữ đợt 2/2026', TUNGAY: '01/06/2026', DENNGAY: '20/06/2026', MUCPHIDANGKY: 1200000, NGAYHANNOPPHI: '25/06/2026' }
        ],
        CT02: [
            { ID: 'MT11', TENKEHOACH: 'Thi chuẩn đầu ra ngoại ngữ ngành 2 - đợt 3/2026', TUNGAY: '20/09/2026', DENNGAY: '10/10/2026', MUCPHIDANGKY: 1200000, NGAYHANNOPPHI: '15/10/2026' }
        ]
    };
    fx['pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc'] = function (o) { return KH[o.strDaoTao_ChuongTrinh_Id] || []; };

    function mon(id, kh, ten, td, ngay, dd, phi, han) {
        return { ID: id, DANGKY_THI_HP_KEHOACH_ID: kh, DANGKY_THI_HOCPHAN_KEHOACH_ID: 'HPKH_' + id, DAOTAO_HOCPHAN_TEN: ten, TRINHDO: td,
            THOIGIANTHIDUKIEN: ngay, DIADIEMTHI: dd, MUCPHIDANGKY: phi, NGAYHANNOPPHI: han };
    }
    var MON = {
        MT01: [mon('M1', 'MT01', 'Tiếng Anh', 'Bậc 3 (B1)', '18/10/2026', 'Phòng 301 - Nhà A2', 1200000, '10/10/2026'),
               mon('M2', 'MT01', 'Tiếng Anh', 'Bậc 4 (B2)', '19/10/2026', 'Phòng 302 - Nhà A2', 1500000, '10/10/2026'),
               mon('M3', 'MT01', 'Tiếng Trung', 'HSK 3', '25/10/2026', 'Phòng 205 - Nhà B1', 1300000, '10/10/2026')],
        MT02: [mon('M4', 'MT02', 'Tin học ứng dụng cơ bản', 'Cơ bản', '12/10/2026', 'Phòng máy 4 - Nhà C', 600000, '05/10/2026')],
        MT03: [mon('M5', 'MT03', 'Tiếng Anh', 'Bậc 3 (B1)', '05/07/2026', 'Phòng 301 - Nhà A2', 1200000, '25/06/2026')],
        MT11: [mon('M6', 'MT11', 'Tiếng Anh', 'Bậc 3 (B1)', '20/10/2026', 'Phòng 303 - Nhà A2', 1200000, '15/10/2026')]
    };
    var DA = { M5: true, M4: true };   // ID môn đã đăng ký (M4: đợt tin học đã đăng ký hết → "Đã đăng ký")
    fx['pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy'] = function (o) {
        var ds = MON[o.strDangKy_Thi_HP_KeHoach_Id] || [];
        return { rows: { rsHocPhanDuDK: ds.filter(function (x) { return !DA[x.ID]; }), rsKetQua: ds.filter(function (x) { return DA[x.ID]; }) } };
    };
    fx['pkg_dangkythi_monthi_thongtin.ThucHienDangKy'] = function (o) { DA[o.strQLHLTL_NguoiHoc_Id] = true; return []; };
    fx['pkg_dangkythi_monthi_thongtin.ThucHienHuyDangKy'] = function (o) { delete DA[o.strDangKy_Thi_HocPhan_KQ_Id]; return []; };
    ums.demo.add(fx);
})();
