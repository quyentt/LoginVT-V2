/* Dữ liệu mẫu cho thoikhoabieu/lichthi (Cổng sinh viên) — chỉ dùng ở chế độ dựng thử.
   "Xem lịch" và "Xem lịch sử" gửi cùng func, chỉ khác action → phân biệt bằng o.action. */
(function () {
    function thi(ma, ten, lan, ngay, g1, p1, g2, p2, lop, phong, sbd) {
        return { MAHOCPHAN: ma, TENHOCPHAN: ten, LANTHI: lan, NGAYHOC: ngay, GIOBATDAU: g1, PHUTBATDAU: p1,
            GIOKETTHUC: g2, PHUTKETTHUC: p2, DANGKY_LOPHOCPHAN_TEN: lop, PHONGHOC_TEN: phong, SOBAODANH: sbd,
            QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', QLSV_NGUOIHOC_MASO: '25001029' };
    }
    var LICHSU = /DSgiKRI0$/;          // action "Xem lịch sử"

    ums.demo.add({
        'pkg_congthongtin_hssv_thongtin.LayDSThoiGianLichThi': [
            { ID: 'HK1', THOIGIAN: 'Học kỳ 1 - Năm học 2026-2027' },
            { ID: 'HK2', THOIGIAN: 'Học kỳ 2 - Năm học 2025-2026' }
        ],
        'pkg_congthongtin_hssv_thongtin.LayDSHocPhanLichThi': function (o) {
            if (!o.strDaoTao_ThoiGianDaoTao_Id) return [];
            return [
                { ID: 'HP1', DAOTAO_HOCPHAN_MA: 'IT4040', DAOTAO_HOCPHAN_TEN: 'Nguyên lý hệ điều hành' },
                { ID: 'HP2', DAOTAO_HOCPHAN_MA: 'IT4080', DAOTAO_HOCPHAN_TEN: 'Trí tuệ nhân tạo' },
                { ID: 'HP3', DAOTAO_HOCPHAN_MA: 'IT3010', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật' }
            ];
        },
        'pkg_congthongtin_hssv_thongtin.LayDSLichThi_KeHoachThi': function (o) {
            if (LICHSU.test(o.action || '')) {
                return {
                    rsLichThiCaNhan: [
                        thi('IT2000', 'Nhập môn lập trình', 2, '12/06/2026', 7, 0, 8, 30, 'Thi trên máy', 'C1-101', '044'),
                        thi('MI1110', 'Giải tích 1', 1, '05/01/2026', 13, 30, 15, 0, 'Thi viết', 'D3-302', '112')
                    ],
                    rsKeHoachThiChung: []
                };
            }
            return {
                rsLichThiCaNhan: [
                    thi('IT3010', 'Cấu trúc dữ liệu và giải thuật', 1, '08/01/2027', 9, 30, 11, 0, 'Thi trên máy', 'C1-102', '018'),
                    thi('IT4040', 'Nguyên lý hệ điều hành', 1, '12/01/2027', 14, 0, 15, 30, 'Thi viết', 'C1-205', '077')
                ],
                rsKeHoachThiChung: [
                    thi('IT4080', 'Trí tuệ nhân tạo', 1, '15/01/2027', 7, 30, 9, 0, 'Thi vấn đáp', 'B3-205', ''),
                    thi('EM1010', 'Kinh tế học đại cương', 1, '18/01/2027', 13, 0, 14, 30, 'Thi trắc nghiệm', 'D5-401', '')
                ]
            };
        }
    });
})();
