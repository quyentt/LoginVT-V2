/* Dữ liệu mẫu cho quyetdinh — chỉ dùng ở chế độ dựng thử. NS.QUDI, NS_Files có sẵn. */
(function () {
    var QD = [
        { ID: 'QDA1', THONGTINQUYETDINH: 'Quyết định bổ nhiệm Phó trưởng khoa Công nghệ thông tin', LOAIQUYETDINH_ID: 'QD1', LOAIQUYETDINH: 'Bổ nhiệm',
          SOQUYETDINH: '88/QĐ-ĐHHN', NGAYQUYETDINH: '20/06/2025', NGAYHIEULUC: '01/07/2025', NGAYHETHIEULUC: '30/06/2030',
          NGUOIKYQUYETDINH: 'Hiệu trưởng', CANBONHAP_TENDAYDU: 'Phòng Tổ chức cán bộ' },
        { ID: 'QDA2', THONGTINQUYETDINH: 'Quyết định cử đi công tác tại Nhật Bản', LOAIQUYETDINH_ID: 'QD2', LOAIQUYETDINH: 'Cử đi công tác',
          SOQUYETDINH: '512/QĐ-ĐHHN', NGAYQUYETDINH: '01/06/2024', NGAYHIEULUC: '10/06/2024', NGAYHETHIEULUC: '20/06/2024',
          NGUOIKYQUYETDINH: 'Phó hiệu trưởng', CANBONHAP_TENDAYDU: 'Phòng Hợp tác quốc tế' }
    ];
    ums.demo.add({
        'NS_ThongTinQuyetDinh/LayDanhSach': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            return QD.filter(function (r) {
                return (!o.strLoaiQuyetDinh_Id || r.LOAIQUYETDINH_ID === o.strLoaiQuyetDinh_Id) &&
                       (!q || r.THONGTINQUYETDINH.toLowerCase().indexOf(q) >= 0);
            });
        },
        'NS_QuyetDinhNhanSu/LayDanhSach': function (o) {
            return o.strNhanSu_ThongTinQD_Id === 'QDA2' ? [
                { ID: 'NSQ1', HOTEN: 'Nguyễn Văn An', MACANBO: 'CB0123', LOAICHUCDANH_MA: 'PGS', LOAIHOCVI_MA: 'TS', NGAYSINHDAYDU: '12/03/1986', ANH: '' },
                { ID: 'NSQ2', HOTEN: 'Trần Thị Bình', MACANBO: 'CB0456', LOAICHUCDANH_MA: '', LOAIHOCVI_MA: 'ThS', NGAYSINHDAYDU: '05/11/1990', ANH: '' }
            ] : [{ ID: 'NSQ1', HOTEN: 'Nguyễn Văn An', MACANBO: 'CB0123', LOAICHUCDANH_MA: 'PGS', LOAIHOCVI_MA: 'TS', NGAYSINHDAYDU: '12/03/1986', ANH: '' }];
        }
    });
})();
