/* Dữ liệu mẫu cho canbonhaphososinhvien — chỉ dùng ở chế độ dựng thử. Cây: khoa → lớp (lá). */
(function () {
    ums.demo.add({
        'pkg_hosohocvien_quyen.LayDSTruongThongTinTheoPhamVi': [
            { ID: 'TTS01', TEN: 'Họ tên', NHOM: 'Thông tin chung' },
            { ID: 'TTS02', TEN: 'Ngày sinh', NHOM: 'Thông tin chung' },
            { ID: 'TTS03', TEN: 'Số điện thoại', NHOM: 'Liên hệ' },
            { ID: 'TTS04', TEN: 'Địa chỉ liên hệ', NHOM: 'Liên hệ' },
            { ID: 'TTS05', TEN: 'Số tài khoản ngân hàng', NHOM: 'Tài chính' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSCauTrucQuyenCBNhapHoSoSV': [
            { THANHPHAN_ID: 'KH1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Công nghệ thông tin' },
            { THANHPHAN_ID: 'L1', THANHPHAN_CHA_ID: 'KH1', THANHPHAN_TEN: 'K67-KTPM1' },
            { THANHPHAN_ID: 'L3', THANHPHAN_CHA_ID: 'KH1', THANHPHAN_TEN: 'K68-HTTT1' },
            { THANHPHAN_ID: 'KH2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Khoa Kinh tế' },
            { THANHPHAN_ID: 'L2', THANHPHAN_CHA_ID: 'KH2', THANHPHAN_TEN: 'K67-QTKD2' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSQuyenNhanSuNhapHoSoSV': function (o) {
            return ums.demo.pqKho.dong(ums.demo.pqNguoiDung.map(function (x) { return x.ID; }), function (nd) {
                return ums.demo.pqKho.co(nd, o.strDaoTaoLopQuanLy_Id + (o.strTruongThongTin_Id || ''), o.strHanhDong_Id);
            });
        }
    });
})();
