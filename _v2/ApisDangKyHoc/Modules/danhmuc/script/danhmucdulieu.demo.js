/* Dữ liệu mẫu cho danhmucdulieu (Đăng ký học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var BANG = [
        { ID: 'DKB1', TENDANHMUC: 'Đăng ký học', MADANHMUC: 'DKH', CHUNG_TENDANHMUC_CHA_ID: '' },
        { ID: 'DKB2', TENDANHMUC: 'Loại đăng ký', MADANHMUC: 'DKH.LOAIDANGKY', CHUNG_TENDANHMUC_CHA_ID: 'DKB1' },
        { ID: 'DKB3', TENDANHMUC: 'Trạng thái đăng ký', MADANHMUC: 'DKH.TRANGTHAI', CHUNG_TENDANHMUC_CHA_ID: 'DKB1' },
        { ID: 'DKB4', TENDANHMUC: 'Đợt đăng ký học', MADANHMUC: 'DKH.DOTDANGKY', CHUNG_TENDANHMUC_CHA_ID: '' },
        { ID: 'DKB5', TENDANHMUC: 'Hình thức học', MADANHMUC: 'DKH.HINHTHUCHOC', CHUNG_TENDANHMUC_CHA_ID: '' }
    ];

    var THUOCTINH = {
        DKB2: [
            { TENTRUONGDULIEU: 'Ma', MOTA: 'Mã loại' },
            { TENTRUONGDULIEU: 'Ten', MOTA: 'Tên loại đăng ký' },
            { TENTRUONGDULIEU: 'HeSo1', MOTA: 'Số tín chỉ tối đa' },
            { TENTRUONGDULIEU: 'ThongTin1', MOTA: 'Ghi chú' },
            { TENTRUONGDULIEU: 'ThongTin5', MOTA: 'Màu hiển thị' }
        ],
        DKB3: [
            { TENTRUONGDULIEU: 'Ma', MOTA: '' },
            { TENTRUONGDULIEU: 'Ten', MOTA: '' }
        ],
        DKB4: [
            { TENTRUONGDULIEU: 'Ma', MOTA: 'Mã đợt' },
            { TENTRUONGDULIEU: 'Ten', MOTA: 'Tên đợt' },
            { TENTRUONGDULIEU: 'ThongTin1', MOTA: 'Học kỳ' }
        ],
        DKB1: [], DKB5: []
    };

    var DULIEU = [
        { ID: 'DKD1', CHUNG_TENDANHMUC_ID: 'DKB2', MA: 'CHINH', TEN: 'Đăng ký học chính', HESO1: 25, THONGTIN1: 'Áp dụng mọi hệ', THONGTIN5: '#1d6fe0', MOTA: '', QUANHECHA_ID: '' },
        { ID: 'DKD2', CHUNG_TENDANHMUC_ID: 'DKB2', MA: 'HOCLAI', TEN: 'Đăng ký học lại', HESO1: 10, THONGTIN1: 'Chỉ học phần đã trượt', THONGTIN5: '#e0781d', MOTA: '', QUANHECHA_ID: 'DKD1' },
        { ID: 'DKD3', CHUNG_TENDANHMUC_ID: 'DKB2', MA: 'CAITHIEN', TEN: 'Đăng ký học cải thiện', HESO1: 8, THONGTIN1: '', THONGTIN5: '#7a3fd1', MOTA: '', QUANHECHA_ID: 'DKD1' },
        { ID: 'DKD4', CHUNG_TENDANHMUC_ID: 'DKB2', MA: 'HE', TEN: 'Đăng ký học kỳ hè', HESO1: '', THONGTIN1: 'Mở theo thông báo', THONGTIN5: '', MOTA: '', QUANHECHA_ID: '' },
        { ID: 'DKD5', CHUNG_TENDANHMUC_ID: 'DKB3', MA: 'CHO', TEN: 'Chờ duyệt', MOTA: '', QUANHECHA_ID: '' },
        { ID: 'DKD6', CHUNG_TENDANHMUC_ID: 'DKB3', MA: 'DUYET', TEN: 'Đã duyệt', MOTA: '', QUANHECHA_ID: '' },
        { ID: 'DKD7', CHUNG_TENDANHMUC_ID: 'DKB4', MA: 'D1-2026', TEN: 'Đợt 1 năm học 2026-2027', THONGTIN1: 'Học kỳ 1', MOTA: '', QUANHECHA_ID: '' },
        { ID: 'DKD8', CHUNG_TENDANHMUC_ID: 'DKB4', MA: 'D2-2026', TEN: 'Đợt 2 năm học 2026-2027', THONGTIN1: 'Học kỳ 2', MOTA: '', QUANHECHA_ID: '' }
    ];

    ums.demo.add({
        'CMS_DanhMucTenBang/LayDanhSach': { rows: BANG, pager: BANG.length },
        'CMS_DanhMucThuocTinh/LayDanhSach': function (o) { return THUOCTINH[o.strCHUNG_TENDANHMUC_Id] || []; },
        'CMS_DanhMucDuLieu/LayDanhSach': function (o) {
            return DULIEU.filter(function (r) { return r.CHUNG_TENDANHMUC_ID === o.strCHUNG_TENDANHMUC_Id; });
        },
        'CMS_DanhMucDuLieu/LayChiTiet': function (o) {
            return DULIEU.filter(function (r) { return r.ID === o.strId; });
        }
    });
})();
