/* Dữ liệu mẫu cho dieukienxet — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var CHUNG = [
        { ID: 'DKX1', HB_QUYHOCBONG_ID: 'Q1', XEPLOAI_ID: 'HXL1', XEPLOAI_TEN: 'Xuất sắc',
          XAUDIEUKIEN: '[DTBHK] >= 3.6 AND [DRL] >= 90', MOTA: 'Điểm TB học kỳ từ 3,6 và rèn luyện từ 90' },
        { ID: 'DKX2', HB_QUYHOCBONG_ID: 'Q1', XEPLOAI_ID: 'HXL2', XEPLOAI_TEN: 'Giỏi',
          XAUDIEUKIEN: '[DTBHK] >= 3.2 AND [DRL] >= 80', MOTA: 'Điểm TB học kỳ từ 3,2 và rèn luyện từ 80' },
        { ID: 'DKX3', HB_QUYHOCBONG_ID: 'Q2', XEPLOAI_ID: 'HXL3', XEPLOAI_TEN: 'Khá',
          XAUDIEUKIEN: '[DTBHK] >= 2.5 AND [SOTCNO] = 0', MOTA: 'Không nợ tín chỉ' }
    ];
    var RIENG = [
        { ID: 'DKXR1', HB_QUYHOCBONG_ID: 'Q1', PHANCAPAPDUNG_ID: 'PC2', PHAMVIAPDUNG_ID: 'K67', PHAMVIAPDUNG_TEN: 'Khóa 67',
          XEPLOAI_ID: 'HXL1', XEPLOAI_TEN: 'Xuất sắc', XAUDIEUKIEN: '[DTBHK] >= 3.7', MOTA: 'Riêng khóa 67' },
        { ID: 'DKXR2', HB_QUYHOCBONG_ID: 'Q1', PHANCAPAPDUNG_ID: 'PC1', PHAMVIAPDUNG_ID: 'H2', PHAMVIAPDUNG_TEN: 'Liên thông',
          XEPLOAI_ID: 'HXL2', XEPLOAI_TEN: 'Giỏi', XAUDIEUKIEN: '[DTBHK] >= 3.4', MOTA: 'Riêng hệ liên thông' }
    ];
    ums.demo.add({
        'HB_QuyHocBong/LayDanhSach': [
            { ID: 'Q1', TEN: 'Quỹ học bổng khuyến khích học tập' }, { ID: 'Q2', TEN: 'Quỹ học bổng doanh nghiệp tài trợ' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#HOCBONG.XEPLOAI': [
            dm('HXL1', 'XS', 'Xuất sắc'), dm('HXL2', 'G', 'Giỏi'), dm('HXL3', 'K', 'Khá')
        ],
        'HB_XetDuyet_DieuKien/LayDanhSach': function (o) {
            return CHUNG.filter(function (r) { return !o.strHB_QuyHocBong_Id || r.HB_QUYHOCBONG_ID === o.strHB_QuyHocBong_Id; });
        },
        'HB_XetDuyet_DieuKien_Ad/LayDanhSach': function (o) {
            return RIENG.filter(function (r) { return r.PHANCAPAPDUNG_ID === o.strPhanCapApDung_Id; });
        },
        'HB_XepLoai_TuKhoa/LayDanhSach': [
            { ID: 'TK1', TUKHOA: '[DTBHK]', TENTUKHOA: 'Điểm trung bình học kỳ', MOTA: 'Thang điểm 4' },
            { ID: 'TK2', TUKHOA: '[DRL]', TENTUKHOA: 'Điểm rèn luyện', MOTA: 'Điểm rèn luyện học kỳ xét' },
            { ID: 'TK3', TUKHOA: '[SOTCNO]', TENTUKHOA: 'Số tín chỉ nợ', MOTA: '' }
        ]
    });
})();
