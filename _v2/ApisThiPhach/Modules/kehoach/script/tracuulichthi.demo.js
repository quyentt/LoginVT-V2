/* Dữ liệu mẫu cho kehoach/tracuulichthi (Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        { MAHOCPHAN: 'KT2101', TENHOCPHAN: 'Nguyên lý kế toán', NGAYHOC: '05/01/2027', GIOBATDAU: 7, PHUTBATDAU: 0, GIOKETTHUC: 9, PHUTKETTHUC: 0,
            DANGKY_LOPHOCPHAN_TEN: 'Tự luận', PHONGHOC_TEN: 'A2-301', CATHI: 'Ca 1', TENDOTTHI: 'Đợt 1 HK1 2026-2027', SOBAODANH: '012', SOPHACH: 'P0457',
            DIEM: 7.5, NGAYNHAPDIEM: '15/01/2027', TUIBAI_TEN: 'Túi 03', LOPTINCHI_TEN: 'KT2101.K14.01', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị Thu', QLSV_NGUOIHOC_TEN: 'Hà', QLSV_NGUOIHOC_MASO: 'DCQT.14.420233101', TG: 'TG1' },
        { MAHOCPHAN: 'CT1102', TENHOCPHAN: 'Triết học Mác - Lênin', NGAYHOC: '07/01/2027', GIOBATDAU: 9, PHUTBATDAU: 30, GIOKETTHUC: 11, PHUTKETTHUC: 0,
            DANGKY_LOPHOCPHAN_TEN: 'Tự luận', PHONGHOC_TEN: 'B1-204', CATHI: 'Ca 2', TENDOTTHI: 'Đợt 1 HK1 2026-2027', SOBAODANH: '045', SOPHACH: 'P1120',
            DIEM: 8, NGAYNHAPDIEM: '18/01/2027', TUIBAI_TEN: 'Túi 11', LOPTINCHI_TEN: 'CT1102.K14.05', QLSV_NGUOIHOC_HODEM: 'Nguyễn Thị Thu', QLSV_NGUOIHOC_TEN: 'Hà', QLSV_NGUOIHOC_MASO: 'DCQT.14.420233101', TG: 'TG1' },
        { MAHOCPHAN: 'TA1203', TENHOCPHAN: 'Tiếng Anh 3', NGAYHOC: '09/01/2027', GIOBATDAU: 13, PHUTBATDAU: 30, GIOKETTHUC: 15, PHUTKETTHUC: 0,
            DANGKY_LOPHOCPHAN_TEN: 'Trắc nghiệm', PHONGHOC_TEN: 'PM-02', CATHI: 'Ca 3', TENDOTTHI: 'Đợt 1 HK1 2026-2027', SOBAODANH: '027', SOPHACH: '',
            DIEM: '', NGAYNHAPDIEM: '', TUIBAI_TEN: '', LOPTINCHI_TEN: 'TA1203.K14.02', QLSV_NGUOIHOC_HODEM: 'Trần Văn', QLSV_NGUOIHOC_TEN: 'Minh', QLSV_NGUOIHOC_MASO: 'DCQT.14.420233145', TG: 'TG1' },
        { MAHOCPHAN: 'TC2204', TENHOCPHAN: 'Tài chính doanh nghiệp', NGAYHOC: '12/06/2026', GIOBATDAU: 7, PHUTBATDAU: 0, GIOKETTHUC: 9, PHUTKETTHUC: 0,
            DANGKY_LOPHOCPHAN_TEN: 'Tự luận', PHONGHOC_TEN: 'A2-105', CATHI: 'Ca 1', TENDOTTHI: 'Đợt 1 HK2 2025-2026', SOBAODANH: '033', SOPHACH: 'P0912',
            DIEM: 6.5, NGAYNHAPDIEM: '25/06/2026', TUIBAI_TEN: 'Túi 07', LOPTINCHI_TEN: 'TC2204.K13.01', QLSV_NGUOIHOC_HODEM: 'Lê Hoàng', QLSV_NGUOIHOC_TEN: 'Nam', QLSV_NGUOIHOC_MASO: 'DCTC.13.420223058', TG: 'TG2' }
    ];
    ums.demo.add({
        'SV_ThongTin/LayDSThoiGianLichThi': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'SV_ThongTin/LayDSLichThi_Phach': function (o) {
            var q = String(o.strQLSV_NguoiHoc || '').toLowerCase();
            return DS.filter(function (x) {
                if (o.strDaoTao_ThoiGianDaoTao_Id && x.TG !== o.strDaoTao_ThoiGianDaoTao_Id) return false;
                return !q || (x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN + ' ' + x.QLSV_NGUOIHOC_MASO).toLowerCase().indexOf(q) >= 0;
            });
        }
    });
})();
