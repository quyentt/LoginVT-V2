/* Dữ liệu mẫu cho canbonhaphosocanbo — chỉ dùng ở chế độ dựng thử. Cây: đơn vị → bộ môn → cán bộ (lá). */
(function () {
    ums.demo.add({
        'CMS_PhanQuyenDuLieu/LayDSCauTrucPhanQuyenCBNhapHS': [
            { THANHPHAN_ID: 'DV1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Công nghệ thông tin' },
            { THANHPHAN_ID: 'BM1', THANHPHAN_CHA_ID: 'DV1', THANHPHAN_TEN: 'Bộ môn Hệ thống thông tin' },
            { THANHPHAN_ID: 'CB01', THANHPHAN_CHA_ID: 'BM1', THANHPHAN_TEN: 'CB001 - Nguyễn Văn Hùng' },
            { THANHPHAN_ID: 'CB02', THANHPHAN_CHA_ID: 'BM1', THANHPHAN_TEN: 'CB015 - Trần Thị Mai' },
            { THANHPHAN_ID: 'DV2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Kinh tế' },
            { THANHPHAN_ID: 'CB03', THANHPHAN_CHA_ID: 'DV2', THANHPHAN_TEN: 'CB102 - Lê Quang Minh' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSQuyenNhanSuNhapHoSoCB': function (o) {
            return ums.demo.pqKho.dong(ums.demo.pqNguoiDung.map(function (x) { return x.ID; }), function (nd) {
                return ums.demo.pqKho.co(nd, o.strNguoiDung_Id + (o.strTruongThongTin_Id || ''), o.strHanhDong_Id);
            });
        }
    });
})();
