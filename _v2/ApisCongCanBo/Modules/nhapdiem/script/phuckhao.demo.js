/* Dữ liệu mẫu cho phuckhao — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [{ ID: 'PK1', QLSV_NGUOIHOC_MASO: 'SV2201', QLSV_NGUOIHOC_HODEM: 'Trần Minh', QLSV_NGUOIHOC_TEN: 'Anh', SOBAODANH: '015', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100',
        DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ', HINHTHUCTHI_TEN: 'Viết', NGAYTHI: '06/01/2027', CATHI_TEN: 'Ca 2', PHONGTHI_TEN: 'A2-301', DIEM: 4.5, NGAYXACNHANHOANTHANHDIEMTHI: '15/01/2027',
        NGAYDANGKYPHUCKHAO: '17/01/2027', NGAYHETHANDANGKYPHUCKHAO: '22/01/2027', PHIPHUCKHAO: '30.000', TINHTRANGNOPPHI: 'Đã nộp', TINHTRANG_TEN: 'Đã duyệt', KETQUAPHUCKHAO: 5.5 }];
    ums.demo.add({
        'TP_PhucKhao/LayThoiGianTheoDotThi': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }],
        'TP_PhucKhao/LayHocPhanPhucKhao': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', TEN: 'IT3100 - Lập trình HĐT' }] : []; },
        'TP_PhucKhao/LayDSThiPhucKhaoNhapDiem': function (o) { return !o.strDaoTao_HocPhan_Id || o.strDaoTao_HocPhan_Id === 'HP1' ? DS : []; },
        'pkg_thi_phach_phuckhao.LayDSLichSuPhucKhao': function () { return { rows: { rsKetQuaDangKy: [{ NGAYTHUCHIEN_DD_MM_YYYY: '17/01/2027', HANHDONG: 'Đăng ký', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100',
            DIEM_THANHPHANDIEM_TEN: 'Cuối kỳ', HINHTHUCTHI_TEN: 'Viết', NGAYTHI: '06/01/2027', CATHI_TEN: 'Ca 2', PHONGTHI_TEN: 'A2-301' }] } }; }
    });
})();
