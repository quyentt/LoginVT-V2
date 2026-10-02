/* Dữ liệu mẫu cho thilai (Đăng ký thi lại) — chỉ dùng ở chế độ dựng thử. Người học mẫu: SV0001. */
(function () {
    var fx = {};
    fx['pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc'] = [
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT01', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ kỹ thuật ô tô - Khóa 16' },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT02', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2) - Khóa 16' }
    ];
    var KH = {
        CT01: [{ ID: 'TL261', TENKEHOACH: 'Đăng ký thi lại học kỳ 2 năm học 2025-2026', TUNGAY: '15/09/2026', DENNGAY: '30/09/2026', MOHINHDANGKY_TEN: 'Thi lại' },
               { ID: 'TL262', TENKEHOACH: 'Đăng ký thi cải thiện học kỳ hè 2026', TUNGAY: '01/08/2026', DENNGAY: '15/08/2026', MOHINHDANGKY_TEN: 'Thi cải thiện điểm' }],
        CT02: [{ ID: 'TL271', TENKEHOACH: 'Đăng ký thi lại ngành 2 - học kỳ 2 năm học 2025-2026', TUNGAY: '20/09/2026', DENNGAY: '05/10/2026', MOHINHDANGKY_TEN: 'Thi lại' }]
    };
    fx['pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc'] = function (o) { return KH[o.strDaoTao_ChuongTrinh_Id] || []; };

    function hp(id, ma, ten, tc, tp, diem, dg, tien) {
        return { ID: id, DAOTAO_HOCPHAN_ID: 'HP_' + ma, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, HOCTRINH: tc, DIEM_THANHPHANDIEM_TEN: tp,
            DIEM: diem, DANHGIA_TEN: dg, THOIGIAN: 'Học kỳ 2 - 2025-2026', SOTIEN: tien, SOTIENDANOP: id === 'R6' ? tien : 0, QLSV_NGUOIHOC_ID: 'SV0001', DIEM_DANHSACHHOC_ID: 'DSH_' + ma };
    }
    var POOL = [
        hp('R1', 'OTO2031', 'Động cơ đốt trong', 3, 'Điểm thi kết thúc học phần', 3.5, 'Không đạt', 450000),
        hp('R2', 'OTO2031', 'Động cơ đốt trong', 3, 'Điểm tổng kết học phần', 3.9, 'Không đạt', 450000),
        hp('R3', 'OTO2045', 'Hệ thống điện - điện tử ô tô', 3, 'Điểm thi kết thúc học phần', 4.0, 'Không đạt', 450000),
        hp('R4', 'MAT1012', 'Giải tích 2', 2, 'Điểm thi kết thúc học phần', 2.5, 'Không đạt', 300000),
        hp('R5', 'ENG1102', 'Tiếng Anh cơ sở 2', 3, 'Điểm thi kết thúc học phần', 5.5, 'Đạt', 450000),
        hp('R6', 'PHY1003', 'Vật lý đại cương', 3, 'Điểm thi kết thúc học phần', 3.0, 'Không đạt', 450000)
    ];
    var DA = { R6: true };   // ID dòng đã đăng ký
    fx['pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy'] = function (o) {
        if (!o.strDangKy_Thi_HP_KeHoach_Id) return { rows: { rsHocPhanDuDK: [], rsKetQua: [] } };
        var kh = o.strDangKy_Thi_HP_KeHoach_Id;
        var ds = POOL.map(function (x) { return Object.assign({}, x, { DANGKY_THI_HP_KEHOACH_ID: kh }); });
        return { rows: { rsHocPhanDuDK: ds.filter(function (x) { return !DA[x.ID]; }), rsKetQua: ds.filter(function (x) { return DA[x.ID]; }) } };
    };
    fx['pkg_dangkythi_monthi_thongtin.ThucHienDangKy'] = function (o) { DA[o.strQLHLTL_NguoiHoc_Id] = true; return []; };
    fx['pkg_dangkythi_monthi_thongtin.ThucHienHuyDangKy'] = function (o) { delete DA[o.strDangKy_Thi_HocPhan_KQ_Id]; return []; };
    fx['pkg_congthongtin_hssv_thongtin.LatKetQuaDiemCaNhanTheoLop'] = function () {
        return { rows: {
            rsTP: [
                { DIEM_THANHPHANDIEM_TEN: 'Chuyên cần', LANHOC: 1, LANTHI: 1, DIEM: 8, DANHGIA_TEN: 'Đạt', DIEMQUYDOI_SO: '', DIEMQUYDOI_CHU: '', GHICHU: '' },
                { DIEM_THANHPHANDIEM_TEN: 'Giữa kỳ', LANHOC: 1, LANTHI: 1, DIEM: 5.5, DANHGIA_TEN: 'Đạt', DIEMQUYDOI_SO: '', DIEMQUYDOI_CHU: '', GHICHU: '' },
                { DIEM_THANHPHANDIEM_TEN: 'Thi kết thúc học phần', LANHOC: 1, LANTHI: 1, DIEM: 2.5, DANHGIA_TEN: 'Không đạt', DIEMQUYDOI_SO: '', DIEMQUYDOI_CHU: '', GHICHU: 'Dưới điểm sàn' }],
            rsTKHP: [
                { DIEM_THANHPHANDIEM_TEN: 'Tổng kết học phần', LANHOC: 1, LANTHI: 1, DIEM: 3.9, DANHGIA_TEN: 'Không đạt', DIEMQUYDOI_SO: 0.0, DIEMQUYDOI_CHU: 'F', GHICHU: '' }]
        } };
    };
    ums.demo.add(fx);
})();
