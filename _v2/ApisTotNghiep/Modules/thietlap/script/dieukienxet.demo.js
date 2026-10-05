/* Dữ liệu mẫu cho dieukienxet (Tốt nghiệp) — chỉ dùng ở chế độ dựng thử.
   Phân loại, phân cấp, kế hoạch, mô hình, học viên: dữ liệu mẫu chung của ums.hbDk (Học bổng _dk.demo.js). */
(function () {
    'use strict';
    var CHUNG = [
        { ID: 'TNDK1', PHANLOAI_ID: 'PL1', XEPLOAI_TEN: 'Giỏi', XAUDIEUKIEN: '[DTBTL] >= 2.0 AND [TCNO] = 0', MOTA: 'Đủ điều kiện tốt nghiệp: tích lũy đủ, không nợ học phần' },
        { ID: 'TNDK2', PHANLOAI_ID: 'PL1', XEPLOAI_TEN: 'Khá', XAUDIEUKIEN: '[CHUANDAURA] = 1', MOTA: 'Đạt chuẩn đầu ra ngoại ngữ, tin học' }
    ];
    var RIENG = [
        { ID: 'TNDKR1', PHANLOAI_ID: 'PL1', PHANCAPAPDUNG_ID: 'PC2', PHAMVIAPDUNG_ID: 'K67', PHAMVIAPDUNG_TEN: 'Khóa 67',
          XAUDIEUKIEN: '[DTBTL] >= 2.2', MOTA: 'Riêng khóa 67' }
    ];
    ums.demo.add({
        'TN_XepLoai_DieuKien/LayDanhSach': function (o) {
            return CHUNG.filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; });
        },
        'TN_XetDuyet_DieuKien_Ad/LayDanhSach': function (o) {
            return RIENG.filter(function (r) { return r.PHANCAPAPDUNG_ID === o.strPhanCapApDung_Id; });
        },
        'TN_XetDuyet_DieuKien_Ad/ThemMoi': { rows: [], raw: { Id: 'MOI07' } },
        'TN_XetDuyet_TuKhoa/LayDanhSach': [
            { ID: 'TTK1', TUKHOA: '[DTBTL]', TENTUKHOA: 'Điểm trung bình tích lũy', MOTA: 'Thang điểm 4' },
            { ID: 'TTK2', TUKHOA: '[TCNO]', TENTUKHOA: 'Số tín chỉ còn nợ', MOTA: '' },
            { ID: 'TTK3', TUKHOA: '[CHUANDAURA]', TENTUKHOA: 'Đạt chuẩn đầu ra', MOTA: '1 = đạt' }
        ]
    });
})();
