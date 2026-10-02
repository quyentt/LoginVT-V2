/* Dữ liệu mẫu cho lophocphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    function lop(id, ma, ten, hp, loai, tc, lich, gvMa, gv, dk, dukien, chot, ct, rieng, kt, tien) {
        return {
            ID: id, MALOP: ma, TENLOP: ten, DAOTAO_HOCPHAN_MA: hp, HINHTHUCHOC_TEN: loai, SOTINCHI: tc, THONGTINPHANBO: '1',
            THOIGIANCHITIET: lich, GIANGVIEN_MASO: gvMa, CHUDANHGIANGVIEN: 'ThS.', GIANGVIEN: gv, SOSVDADANGKY: dk,
            SOLUONGDUKIENHOC: dukien, SOSVCHOT: chot, DAOTAO_CHUONGTRINH: ct, HOCPHITINHRIENG: rieng,
            TAICHINH_CACKHOANTHU_TEN: kt, TONGSOTIEN: tien
        };
    }
    var ROWS = [
        lop('LHP1', 'INT3306-01', 'Phát triển ứng dụng Web 01', 'INT3306', 'Lý thuyết', 3, 'Thứ 2 (1-3), P.301-G2; 08/09–15/12/2025', 'GV0112', 'Nguyễn Văn Hải', 42, 45, 42, 'Kỹ thuật phần mềm K67', 1, 'Học phí', 18900000),
        lop('LHP2', 'INT3306-02', 'Phát triển ứng dụng Web 02', 'INT3306', 'Lý thuyết', 3, 'Thứ 4 (7-9), P.305-G2; 08/09–15/12/2025', 'GV0112', 'Nguyễn Văn Hải', 38, 45, '', 'Kỹ thuật phần mềm K67', 1, 'Học phí', ''),
        lop('LHP3', 'BSA2002-01', 'Nguyên lý marketing 01', 'BSA2002', 'Lý thuyết', 3, 'Thứ 3 (4-6), P.201-E4', 'GV0340', 'Trần Thị Mai', 55, 60, 55, 'Quản trị kinh doanh K67', 0, '', ''),
        lop('LHP4', 'FLF1107-05', 'Tiếng Anh B1 05', 'FLF1107', 'Thực hành', 5, 'Thứ 5 (1-4), P.102-A1', 'GV0521', 'Lê Thu Hà', 0, 30, '', 'Ngôn ngữ Anh K69', 1, 'Học phí học lại', 7500000)
    ];
    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }],
        'DKH_PhanCong_LopHP/LayDSKhoaToChuc': B.demo.khoa,
        'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc': B.demo.ct,
        'DKH_PhanCong_LopHP/LayDSHocPhan': [
            { ID: 'HP1', MA: 'INT3306', TEN: 'Phát triển ứng dụng Web' }, { ID: 'HP2', MA: 'BSA2002', TEN: 'Nguyên lý marketing' }, { ID: 'HP3', MA: 'FLF1107', TEN: 'Tiếng Anh B1' }
        ],
        'DKH_ThongTin/LayDSDangKy_KeHoachDangKy': [{ ID: 'KHD1', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2025–2026' }],
        'DKH_ThongTin/LayDSLopHocPhanRieng': function (o) {
            var s = o.pageSize || 10, i = o.pageIndex || 1;
            return { rows: ROWS.slice((i - 1) * s, i * s), pager: ROWS.length };
        },
        'DKH_PhanCong_LopHP/LayDanhSach': [
            { ID: 'PV1', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm K67', PHANCAPAPDUNG_TEN: 'Chương trình' },
            { ID: 'PV2', PHAMVIAPDUNG_TEN: 'KTPM01-K67', PHANCAPAPDUNG_TEN: 'Lớp quản lý' }
        ],
        'DKH_PhanCong_LopHP/LayDSDangKyHoc': [
            { ID: 'DK1', QLSV_NGUOIHOC_MASO: 'BIT220101', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_NGAYSINH: '12/03/2004', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'KTPM01-K67', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa CNTT', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' },
            { ID: 'DK2', QLSV_NGUOIHOC_MASO: 'BIT220102', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bình', QLSV_NGUOIHOC_NGAYSINH: '05/11/2004', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'KTPM01-K67', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', KHOAQUANLY_TEN: 'Khoa CNTT', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy' }
        ]
    });
})();
