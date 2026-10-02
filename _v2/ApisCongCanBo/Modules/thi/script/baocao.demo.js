/* Dữ liệu mẫu cho thi/baocao — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LS = [];
    ums.demo.add({
        'pkg_thi_phach_chung.LayThoiGian': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'pkg_thi_phach_chung.LayLoaiDiem': function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi cuối kỳ' }] : []; },
        'pkg_thi_phach_chung.LayHinhThucThi': function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Tự luận' }, { ID: 'HT2', TEN: 'Vấn đáp' }] : []; },
        'pkg_thi_phach_chung.LayDotThi': [{ ID: 'DOT1', TEN: 'Đợt 1 HK1 2026-2027', DOTHOC: 1, NGAYBATDAU: '05/01/2027', NGAYKETTHUC: '20/01/2027' },
            { ID: 'DOT2', TEN: 'Đợt 2 HK1 2026-2027', DOTHOC: 2, NGAYBATDAU: '01/02/2027', NGAYKETTHUC: '10/02/2027' }],
        'PKG_THI_PHANCONG.LayDSPhanLoaiCoiThi_ChamThi': [{ ID: 'PL1', TEN: 'Hoàn thành chấm thi' }],
        'PKG_THI_PHANCONG.LayDSHanhDongCoiThi_ChamThi': function (o) { return o.strPhanLoai_Id ? [{ ID: 'HD1', TEN: 'Đã hoàn thành' }, { ID: 'HD2', TEN: 'Chưa hoàn thành' }] : []; },
        'PKG_THI_PHANCONG.Them_QLTHI_CoiThi_ChamThi': function (o) { LS.unshift({ TINHTRANG_TEN: o.strTinhTrang_Id === 'HD1' ? 'Đã hoàn thành' : 'Chưa hoàn thành', NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Phòng Khảo thí', NGAYTAO_DD_MM_YYYY: '22/09/2026' }); return []; },
        'PKG_THI_PHANCONG.LayDSQLTHI_CoiThi_ChamThi': function () { return LS; }
    });
})();
