/* Dữ liệu mẫu cho thu hồ sơ (_thuhoso.js) — cả bản mới (PKG_CORE_NhapHoc_ThuTien.*) và bản cũ (NH_*). */
(function () {
    'use strict';
    function khoan() {
        return [
            { TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí học kỳ 1', SOTIENDINHMUC_CHUNG: 7500000, SOTIENDINHMUC: 7500000, SOTIENDATHU: 7500000 },
            { TAICHINH_CACKHOANTHU_ID: 'KT2', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', SOTIENDINHMUC_CHUNG: 884520, SOTIENDINHMUC: 884520, SOTIENDATHU: 0 },
            { TAICHINH_CACKHOANTHU_ID: 'KT3', TAICHINH_CACKHOANTHU_TEN: 'Khám sức khoẻ đầu khoá', SOTIENDINHMUC_CHUNG: 150000, SOTIENDINHMUC: 150000, SOTIENDATHU: 200000 },
            { TAICHINH_CACKHOANTHU_ID: 'KT4', TAICHINH_CACKHOANTHU_TEN: 'Ký túc xá (4 tháng)', SOTIENDINHMUC_CHUNG: 1200000, SOTIENDINHMUC: 1000000, SOTIENDATHU: 500000 }
        ];
    }
    function loai(o) {
        var sv = o.strQLSV_NguoiHoc_TTTS_Id;
        return [
            { ID: 'HS1' + sv, QLSV_NGUOIHOC_ID: sv, LOAIHOSO_ID: 'L1', NHOMHOSO_TEN: 'Giấy tờ tuỳ thân', LOAIHOSO_TEN: 'Giấy khai sinh (bản sao)', SOLUONGQUYDINH: 1, SOLUONGTHUCTE: 1, KIEUDULIEU_MA: 'NUMBER', NHAPHOC_XACMINH_LOAIHOSO: 1 },
            { ID: 'HS2' + sv, QLSV_NGUOIHOC_ID: sv, LOAIHOSO_ID: 'L2', NHOMHOSO_TEN: 'Giấy tờ tuỳ thân', LOAIHOSO_TEN: 'Căn cước công dân (bản sao)', SOLUONGQUYDINH: 2, SOLUONGTHUCTE: null, KIEUDULIEU_MA: 'NUMBER' },
            { ID: 'HS3' + sv, QLSV_NGUOIHOC_ID: sv, LOAIHOSO_ID: 'L3', NHOMHOSO_TEN: 'Giấy tờ tuỳ thân', LOAIHOSO_TEN: 'Ảnh 3x4', SOLUONGQUYDINH: 4, SOLUONGTHUCTE: 4, KIEUDULIEU_MA: 'NUMBER' },
            { ID: 'HS4' + sv, QLSV_NGUOIHOC_ID: sv, LOAIHOSO_ID: 'L4', NHOMHOSO_TEN: 'Học vấn', LOAIHOSO_TEN: 'Học bạ THPT (bản sao)', SOLUONGQUYDINH: 1, SOLUONGTHUCTE: 0, KIEUDULIEU_MA: 'NUMBER', NHAPHOC_XACMINH_LOAIHOSO: 1 },
            { ID: 'HS5' + sv, QLSV_NGUOIHOC_ID: sv, LOAIHOSO_ID: 'L5', NHOMHOSO_TEN: 'Học vấn', LOAIHOSO_TEN: 'Giấy chứng nhận tốt nghiệp tạm thời', SOLUONGQUYDINH: 1, SOLUONGTHUCTE: 1, KIEUDULIEU_MA: 'CHECK' },
            { ID: 'HS6' + sv, QLSV_NGUOIHOC_ID: sv, LOAIHOSO_ID: 'L6', NHOMHOSO_TEN: 'Khác', LOAIHOSO_TEN: 'Giấy xác nhận ưu tiên', SOLUONGQUYDINH: 1, SOLUONGTHUCTE: null, KIEUDULIEU_MA: 'CHECK' }
        ];
    }
    function minhChung(o) {
        return [
            { TRUONGTHONGTIN_TEN: 'Số hiệu văn bản', TRUONGTHONGTIN_GIATRI: 'KS-2007/0512' },
            { TRUONGTHONGTIN_TEN: 'Nơi cấp', TRUONGTHONGTIN_GIATRI: 'UBND xã Quyết Thắng' },
            { TRUONGTHONGTIN_TEN: 'Tệp minh chứng', TRUONGTHONGTIN_GIATRI: 'SV_Files/' + o.strLoaiHoSo_Id + '_giayto.pdf' }
        ];
    }
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc': khoan,
        'PKG_CORE_NhapHoc_ThuTien.LayDSCacHoSoNhapHoc': loai,
        'PKG_CORE_NhapHoc_ThuTien.LayDSThongTinHoSoMinhChung': minhChung,
        'PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuHoSo': { rows: [], message: '' },
        'NH_DinhMuc_Chung/LayDSCacKhoanNhapHoc': khoan,
        'NH_ThongTin/LayDSCacHoSoNhapHoc': loai,
        'NH_ThongKe/LayDSThongTinHoSoMinhChung': minhChung,
        'NH_ThongTin/NhapHoc_ThuHoSo': { rows: [], message: '' }
    });
})();
