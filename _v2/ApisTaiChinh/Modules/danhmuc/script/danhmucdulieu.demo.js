/* Dữ liệu mẫu cho danhmucdulieu — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var BANG = [
        { ID: 'B1', TENDANHMUC: 'Ngân hàng liên kết VNPAY', MADANHMUC: 'VNPAY.NGANHANG', CHUNG_TENDANHMUC_CHA_ID: '' },
        { ID: 'B2', TENDANHMUC: 'Ngân hàng nội địa', MADANHMUC: 'VNPAY.NGANHANG.NOIDIA', CHUNG_TENDANHMUC_CHA_ID: 'B1' },
        { ID: 'B3', TENDANHMUC: 'Ví điện tử', MADANHMUC: 'VNPAY.NGANHANG.VI', CHUNG_TENDANHMUC_CHA_ID: 'B1' }
    ];

    var THUOCTINH = {
        B1: [
            { TENTRUONGDULIEU: 'Ma', MOTA: 'Mã ngân hàng' },
            { TENTRUONGDULIEU: 'Ten', MOTA: 'Tên ngân hàng' },
            { TENTRUONGDULIEU: 'ThongTin1', MOTA: 'Mã BIN' },
            { TENTRUONGDULIEU: 'HeSo1', MOTA: 'Phí giao dịch (%)' },
            { TENTRUONGDULIEU: 'ThongTin7', MOTA: 'Ghi chú nội bộ' }
        ],
        B2: [
            { TENTRUONGDULIEU: 'Ma', MOTA: '' },
            { TENTRUONGDULIEU: 'Ten', MOTA: '' }
        ],
        B3: []
    };

    var DULIEU = [
        { ID: 'D1', CHUNG_TENDANHMUC_ID: 'B1', MA: 'VCB', TEN: 'Ngân hàng TMCP Ngoại thương Việt Nam', THONGTIN1: '970436', HESO1: 0.8, THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D2', CHUNG_TENDANHMUC_ID: 'B1', MA: 'BIDV', TEN: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', THONGTIN1: '970418', HESO1: 0.8, THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D3', CHUNG_TENDANHMUC_ID: 'B1', MA: 'CTG', TEN: 'Ngân hàng TMCP Công thương Việt Nam', THONGTIN1: '970415', HESO1: 0.9, THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D4', CHUNG_TENDANHMUC_ID: 'B1', MA: 'TCB', TEN: 'Ngân hàng TMCP Kỹ thương Việt Nam', THONGTIN1: '970407', HESO1: 1.1, THONGTIN7: 'Tạm dừng liên kết', MOTA: '', QUANHECHA_ID: 'D1', TRANGTHAI: 0 },
        { ID: 'D5', CHUNG_TENDANHMUC_ID: 'B1', MA: 'AGR', TEN: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn', THONGTIN1: '970405', HESO1: '', THONGTIN7: '', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 },
        { ID: 'D6', CHUNG_TENDANHMUC_ID: 'B2', MA: 'MB', TEN: 'Ngân hàng TMCP Quân đội', MOTA: '', QUANHECHA_ID: '', TRANGTHAI: 1 }
    ];

    function norm(s) {
        return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }

    ums.demo.add({
        'CMS_DanhMucTenBang/LayDanhSach': { rows: BANG, pager: BANG.length },
        'CMS_DanhMucThuocTinh/LayDanhSach': function (o) { return THUOCTINH[o.strCHUNG_TENDANHMUC_Id] || []; },
        'CMS_DanhMucDuLieu/LayDanhSach': function (o) {
            var q = norm(o.strTuKhoa);
            return DULIEU.filter(function (r) {
                return r.CHUNG_TENDANHMUC_ID === o.strCHUNG_TENDANHMUC_Id &&
                    String(r.TRANGTHAI) === String(o.dTrangThai) &&
                    (!o.strCha_Id || r.QUANHECHA_ID === o.strCha_Id) &&
                    (!q || norm(r.MA + ' ' + r.TEN).indexOf(q) >= 0);
            });
        },
        'CMS_DanhMucDuLieu/LayChiTiet': function (o) {
            return DULIEU.filter(function (r) { return r.ID === o.strId; });
        }
    });
})();
