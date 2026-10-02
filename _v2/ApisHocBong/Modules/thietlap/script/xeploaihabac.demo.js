/* Dữ liệu mẫu cho xeploaihabac — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var CHUNG = [
        { ID: 'XLC1', PHANLOAI_ID: 'PL1', XEPLOAI_TEN: 'Giỏi', XAUDIEUKIEN: '[SOLANTHILAI] > 0', MOTA: 'Có học phần thi lại thì hạ một bậc' },
        { ID: 'XLC2', PHANLOAI_ID: 'PL1', XEPLOAI_TEN: 'Xuất sắc', XAUDIEUKIEN: '[KYLUAT] >= 1', MOTA: 'Bị kỷ luật từ mức khiển trách' }
    ];
    var RIENG = [
        { ID: 'XLR1', PHANLOAI_ID: 'PL2', PHANCAPAPDUNG_ID: 'PC3', PHAMVIAPDUNG_ID: 'CTKTPM', PHAMVIAPDUNG_TEN: 'Kỹ thuật phần mềm',
          XEPLOAI_TEN: 'Khá', XAUDIEUKIEN: '[DTBTL] < 2.5', MOTA: 'Riêng chương trình KTPM' }
    ];
    ums.demo.add({
        'TN_XepLoai_DieuKien/LayDanhSach': function (o) {
            return CHUNG.filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; });
        },
        'TN_XepLoai_DieuKien_Ad/LayDanhSach': function (o) {
            return RIENG.filter(function (r) { return r.PHANCAPAPDUNG_ID === o.strPhanCapApDung_Id; });
        },
        'TN_XepLoai_DieuKien_HaBac/LayDanhSach': function (o) {
            return o.strTn_XepLoai_DieuKien_Id === 'XLC1' ? [
                { ID: 'HB1', XAUDIEUKIEN: '[SOLANTHILAI] > 2', XEPLOAI_ID: 'XL4' },
                { ID: 'HB2', XAUDIEUKIEN: '[SOLANTHILAI] > 0', XEPLOAI_ID: 'XL3' }
            ] : [];
        },
        'TN_XepLoai_DieuKien_GH/LayDanhSach': function (o) {
            return o.strTn_XepLoai_DieuKien_Id === 'XLC1' ? [{ ID: 'GH1', XAUDIEUKIEN: '[KYLUAT] >= 1', XEPLOAI_ID: 'XL3' }] : [];
        },
        'TN_XetDuyet_TuKhoa/LayDanhSach': [
            { ID: 'TTK1', TUKHOA: '[SOLANTHILAI]', TENTUKHOA: 'Số lần thi lại', MOTA: 'Tính trên toàn khóa' },
            { ID: 'TTK2', TUKHOA: '[KYLUAT]', TENTUKHOA: 'Mức kỷ luật cao nhất', MOTA: '' },
            { ID: 'TTK3', TUKHOA: '[DTBTL]', TENTUKHOA: 'Điểm trung bình tích lũy', MOTA: 'Thang điểm 4' }
        ]
    });
})();
