/* Dữ liệu mẫu cho sinhvientunhap — chỉ dùng ở chế độ dựng thử. Cây: khoa → khoá → lớp (lá). */
(function () {
    ums.demo.add({
        'CMS_PhanQuyenDuLieu/LayDSCauTrucQuyenChoSVNhapHoSo': [
            { THANHPHAN_ID: 'KH1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Công nghệ thông tin' },
            { THANHPHAN_ID: 'K67', THANHPHAN_CHA_ID: 'KH1', THANHPHAN_TEN: 'Khóa 67' },
            { THANHPHAN_ID: 'L1', THANHPHAN_CHA_ID: 'K67', THANHPHAN_TEN: 'K67-KTPM1' },
            { THANHPHAN_ID: 'L3', THANHPHAN_CHA_ID: 'K67', THANHPHAN_TEN: 'K67-HTTT1' },
            { THANHPHAN_ID: 'KH2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Kinh tế' },
            { THANHPHAN_ID: 'K67B', THANHPHAN_CHA_ID: 'KH2', THANHPHAN_TEN: 'Khóa 67' },
            { THANHPHAN_ID: 'L2', THANHPHAN_CHA_ID: 'K67B', THANHPHAN_TEN: 'K67-QTKD2' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSQuyenChoPhepSVNhapHoSo': function (o) {
            return ums.demo.pqKho.dong(['TTS01', 'TTS02', 'TTS03', 'TTS04'], function (tt) { return ums.demo.pqKho.co(o.strLopQuanLy_Id, tt, o.strHanhDong_Id); });
        }
    });
})();
