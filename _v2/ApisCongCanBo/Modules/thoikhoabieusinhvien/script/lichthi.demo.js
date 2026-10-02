/* Dữ liệu mẫu cho thoikhoabieusinhvien/lichthi — chỉ dùng ở chế độ dựng thử. */
(function () {
    function thi(ma, ten, lan, ngay, g1, p1, g2, p2, lop, phong, sbd) {
        return { MAHOCPHAN: ma, TENHOCPHAN: ten, LANTHI: lan, NGAYHOC: ngay, GIOBATDAU: g1, PHUTBATDAU: p1, GIOKETTHUC: g2, PHUTKETTHUC: p2,
            DANGKY_LOPHOCPHAN_TEN: lop, PHONGHOC_TEN: phong, SOBAODANH: sbd, QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', QLSV_NGUOIHOC_MASO: 'BIT220101' };
    }
    ums.demo.add({
        'SV_ThongTin/LayDSThoiGianLichThi': [{ ID: 'HK1', THOIGIAN: '2026_2027_1' }, { ID: 'HK2', THOIGIAN: '2025_2026_2' }],
        'SV_ThongTin/LayDSHocPhanLichThi': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng' },
                { ID: 'HP2', DAOTAO_HOCPHAN_MA: 'IT3200', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu' }] : [];
        },
        'SV_ThongTin/LayDSLichThi_KeHoachThi': function () {
            return { rsLichThiCaNhan: [thi('IT3100', 'Lập trình hướng đối tượng', 1, '05/01/2027', 7, 30, 9, 0, 'IT3100.01', 'A2-301', '012')],
                     rsKeHoachThiChung: [thi('IT3200', 'Cơ sở dữ liệu', 1, '08/01/2027', 13, 30, 15, 0, 'IT3200.02', 'A1-205', '')] };
        },
        'SV_ThongTin/LayDSLichThi_KeHoachThi_LichSu': function () {
            return { rsLichThiCaNhan: [thi('IT2000', 'Nhập môn lập trình', 2, '12/06/2026', 7, 0, 8, 30, 'IT2000.03', 'B1-101', '044')], rsKeHoachThiChung: [] };
        }
    });
})();
