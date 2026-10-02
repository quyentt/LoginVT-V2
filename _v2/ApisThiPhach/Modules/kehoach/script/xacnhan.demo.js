/* Dữ liệu mẫu cho xacnhan (Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function d(id, ma, ho, ten, lop, tp, tt, sbd) {
        return { ID: id, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: ho, QLSV_NGUOIHOC_TEN: ten, DAOTAO_LOPQUANLY_TEN: lop, DIEM_THANHPHANDIEM_TEN: tp,
            LANHOC: 1, LANTHI: 1, SOBAODANH: sbd, TRANGTHAI_TEN: tt };
    }
    var DS = [
        d('XN01', 'BIT230101', 'Nguyễn Hoàng', 'An', 'CNTT23A', 'Điểm thi kết thúc học phần', 'Vắng thi có phép', '001'),
        d('XN02', 'BIT230145', 'Trần Thị Minh', 'Châu', 'CNTT23A', 'Điểm thi kết thúc học phần', 'Vắng thi không phép', '002'),
        d('XN03', 'BBA230212', 'Lê Quốc', 'Dũng', 'QTKD23B', 'Điểm thi kết thúc học phần', 'Đình chỉ thi', '014'),
        d('XN04', 'BBA230260', 'Phạm Thu', 'Hà', 'QTKD23B', 'Điểm thi lại', 'Khiển trách', '027'),
        d('XN05', 'BFL230033', 'Vũ Ngọc', 'Lan', 'NNA23A', 'Điểm thi kết thúc học phần', 'Vắng thi không phép', '031')
    ];
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#THI.TINHTRANGVANGTHI_VIPHAMQUYCHETHI': [
            { ID: 'VT1', MA: 'VANGCOPHEP', TEN: 'Vắng thi có phép' }, { ID: 'VT2', MA: 'VANGKHONGPHEP', TEN: 'Vắng thi không phép' },
            { ID: 'VT3', MA: 'KHIENTRACH', TEN: 'Khiển trách' }, { ID: 'VT4', MA: 'DINHCHI', TEN: 'Đình chỉ thi' }],
        'TP_Chung/LayThoiGian': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'TP_Chung/LayDotThi': [{ ID: 'DT1', TEN: 'Đợt thi chính học kỳ 1' }, { ID: 'DT2', TEN: 'Đợt thi phụ học kỳ 1' }],
        'TP_Chung/LayHocPhan': [{ ID: 'HP1', TEN: 'Cấu trúc dữ liệu và giải thuật', MA: 'IT2030' }, { ID: 'HP2', TEN: 'Toán cao cấp 2', MA: 'MA1020' }],
        'TP_Chung/LayDSThiTheoDotThi': [{ ID: 'DST1', THOIGIAN: 'DST-IT2030-01 (12/01/2027)' }, { ID: 'DST2', THOIGIAN: 'DST-MA1020-01 (14/01/2027)' }],
        'TP_XacNhanSauThi/LayDSVangThiViPhamQuyChe': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return DS.filter(function (x) { return !q || (x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0; });
        },
        'TN_XacNhan/LayDSTinhTrangXacNhan': [{ ID: 'TX1', TEN: 'Xác nhận', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #2e7d32' },
            { ID: 'TX2', TEN: 'Không xác nhận', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #c62828' }],
        'TP_XacNhanSauThi/LayDanhSach': [
            { ID: 'LS1', TINHTRANG_TEN: 'Xác nhận', NOIDUNG: 'Đã đối chiếu biên bản phòng thi', NGUOIXACNHAN_TENDAYDU: 'Đỗ Thị Hạnh', NGAYTAO_DD_MM_YYYY: '13/01/2027' }],
        'TP_XacNhanSauThi/ThemMoi': []
    });
})();
