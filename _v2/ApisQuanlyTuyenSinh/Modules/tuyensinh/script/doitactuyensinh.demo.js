/* Dữ liệu mẫu cho Đối tác tuyển sinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var rows = [
        { ID: 'DTTS1', HODEM: 'Trung tâm GDNN -', TEN: 'GDTX Cầu Giấy', SODIENTHOAI: '0243 7931 234', EMAIL: 'gdnn.caugiay@hanoi.edu.vn',
          CMT_HOCHIEU: '', DIACHI: 'Số 2 Trần Quốc Vượng, Cầu Giấy, Hà Nội', GHICHU: 'Liên kết tuyển sinh từ 2024' },
        { ID: 'DTTS2', HODEM: 'Nguyễn Văn', TEN: 'Toàn', SODIENTHOAI: '0912 345 678', EMAIL: 'toan.nv@gmail.com',
          CMT_HOCHIEU: '001089012345', DIACHI: 'Phường Hưng Dũng, TP Vinh, Nghệ An', GHICHU: 'Cộng tác viên' },
        { ID: 'DTTS3', HODEM: 'Trần Thị', TEN: 'Hoa', SODIENTHOAI: '0987 111 222', EMAIL: 'hoa.tt@yahoo.com',
          CMT_HOCHIEU: '038190004567', DIACHI: 'TP Thanh Hoá, Thanh Hoá', GHICHU: '' },
        { ID: 'DTTS4', HODEM: 'Trường THPT', TEN: 'Kim Liên', SODIENTHOAI: '0243 8522 100', EMAIL: 'c3kimlien@hanoi.edu.vn',
          CMT_HOCHIEU: '', DIACHI: 'Ngõ 4C Đặng Văn Ngữ, Đống Đa, Hà Nội', GHICHU: 'Tư vấn hướng nghiệp' }
    ];
    ums.demo.crudStore('TS_DoiTacTuyenSinh', rows, {
        map: function (o) {
            return { HODEM: o.strHoDem, TEN: o.strTen, SODIENTHOAI: o.strSoDienThoai, EMAIL: o.strEmail,
                CMT_HOCHIEU: o.strCMT_HoChieu, DIACHI: o.strDiaChi, GHICHU: o.strGhiChu };
        },
        list: function (rs, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return rs.filter(function (r) { return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.EMAIL + ' ' + r.SODIENTHOAI).toLowerCase().indexOf(q) >= 0; });
        }
    });
})();
