/* Dữ liệu mẫu cho canhantunhaphoso — chỉ dùng ở chế độ dựng thử. Cây: đơn vị → bộ môn → cán bộ (lá). */
(function () {
    var CAY = [
        { THANHPHAN_ID: 'DV1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Công nghệ thông tin' },
        { THANHPHAN_ID: 'BM1', THANHPHAN_CHA_ID: 'DV1', THANHPHAN_TEN: 'Bộ môn Hệ thống thông tin' },
        { THANHPHAN_ID: 'CB01', THANHPHAN_CHA_ID: 'BM1', THANHPHAN_TEN: 'CB001 - Nguyễn Văn Hùng' },
        { THANHPHAN_ID: 'CB02', THANHPHAN_CHA_ID: 'BM1', THANHPHAN_TEN: 'CB015 - Trần Thị Mai' },
        { THANHPHAN_ID: 'BM2', THANHPHAN_CHA_ID: 'DV1', THANHPHAN_TEN: 'Bộ môn Kỹ thuật phần mềm' },
        { THANHPHAN_ID: 'CB03', THANHPHAN_CHA_ID: 'BM2', THANHPHAN_TEN: 'CB102 - Lê Quang Minh' },
        { THANHPHAN_ID: 'DV2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Phòng Đào tạo' },
        { THANHPHAN_ID: 'CB04', THANHPHAN_CHA_ID: 'DV2', THANHPHAN_TEN: 'CB210 - Phạm Thu Hà' }
    ];
    ums.demo.add({
        'CMS_PhanQuyenDuLieu/LayDSCauTrucPhanQuyenCNNhapHS': CAY,
        'CMS_PhanQuyenDuLieu/LayDSQuyenNhanSuTuNhapHoSo': function (o) {
            return ums.demo.pqKho.dong(['TT01', 'TT02', 'TT03', 'TT04'], function (tt) { return ums.demo.pqKho.co(o.strNguoiDung_Id, tt, o.strHanhDong_Id); });
        }
    });
})();
