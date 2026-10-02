/* =========================================================================
   Đối tác tuyển sinh
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/doitactuyensinh.html + script/doitactuyensinh.js (476 dòng)
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (từ khoá + Tìm kiếm) → "Danh sách đối tác tuyển sinh (n)" + Thêm mới / Xóa
   (xoá các dòng đã đánh dấu): Họ đệm · Tên · Số điện thoại · Email · CMT · Địa chỉ · Ghi chú · Chi tiết (sửa) · ô đánh dấu.
   Thêm / sửa → biểu mẫu "Đối tác tuyển sinh" thay chỗ danh sách (zone_input): Họ đệm · Tên · Địa chỉ · Email ·
   Số điện thoại · Số CMT/CCCD · Ghi chú.  → khuôn A (ums.crud).

   Lời gọi (chép nguyên, GET/POST như gốc):
     TS_DoiTacTuyenSinh/LayDanhSach  GET   strTuKhoa, strNguoiTao_Id '', pageIndex/pageSize (phân trang máy chủ)
     TS_DoiTacTuyenSinh/LayChiTiet   GET   strId                                   → HODEM, TEN, DIACHI, EMAIL, SODIENTHOAI,
                                                                                   CMT_HOCHIEU, GHICHU
     TS_DoiTacTuyenSinh/ThemMoi      POST  strId '', strChucNang_Id, strCMT_HoChieu, strHoDem, strTen, strSoDienThoai,
                                           strEmail, strDiaChi, strGhiChu, strNguoiThucHien_Id
     TS_DoiTacTuyenSinh/CapNhat      POST  như ThemMoi, strId = id đang sửa
     TS_DoiTacTuyenSinh/Xoa          POST  strIds (nối dấu phẩy các dòng đánh dấu), strNguoiThucHien_Id

   Khác gốc / tự chốt:
     · Họ đệm / Tên bắt buộc: gốc khai arrValiD_DoiTacTuyenSinh (EM) nhưng không gọi kiểm → nay kiểm thật.
     · Xoá: gốc chỉ có nút "Xóa" đầu danh sách (xoá các dòng đánh dấu, gửi MỘT lời gọi strIds nối dấu phẩy) —
       trình xử lý xoá TỪNG dòng (.btnDelete) có trong js nhưng không nút nào vẽ ra → bỏ xoá từng dòng (rowDelete: false),
       giữ "Xoá đã chọn" + nút Xoá trong biểu mẫu sửa.
     · Thêm mới xong gốc ở lại biểu mẫu và hỏi "Bạn có muốn tiếp tục thêm không?" → nay có nút "Lưu và nhập tiếp"
       (cùng ý: lưu rồi xoá trắng để nhập tiếp); nút Lưu thường về danh sách.
     · Nút #btnReWrite, #btnRefresh trong js gốc không có trên html → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ts-doitactuyensinh');
    if (!root) return;
    function uid() { return ums.session.userId; }
    function cn() { return ums.state.chucNangId; }

    ums.crud({
        root: root,
        title: 'Đối tác tuyển sinh',
        formTitle: 'đối tác tuyển sinh',
        listTitle: 'Danh sách đối tác tuyển sinh',
        icon: 'fa-handshake',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TS_DoiTacTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiTao_Id: '' };
            }
        },
        columns: [
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Số điện thoại', prop: 'SODIENTHOAI', cls: 'is-center is-nowrap', width: '150px' },
            { title: 'Email', prop: 'EMAIL' },
            { title: 'CMT', prop: 'CMT_HOCHIEU', cls: 'is-nowrap', width: '150px' },
            { title: 'Địa chỉ', prop: 'DIACHI' },
            { title: 'Ghi chú', prop: 'GHICHU' }
        ],
        detail: function (row) {
            return { action: 'TS_DoiTacTuyenSinh/LayChiTiet', method: 'GET', strId: row.ID };
        },
        fields: [
            { type: 'legend', label: 'Thông tin đối tác tuyển sinh' },
            { key: 'strHoDem', col: 'HODEM', label: 'Họ đệm', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ', span: true },
            { key: 'strEmail', col: 'EMAIL', label: 'Email' },
            { key: 'strSoDienThoai', col: 'SODIENTHOAI', label: 'Số điện thoại' },
            { key: 'strCMT_HoChieu', col: 'CMT_HOCHIEU', label: 'Số CMT/CCCD' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', span: true }
        ],
        saveAgain: 'Lưu và nhập tiếp',
        save: function (v, row) {
            return {
                action: row ? 'TS_DoiTacTuyenSinh/CapNhat' : 'TS_DoiTacTuyenSinh/ThemMoi',
                strId: row ? row.ID : '',
                strChucNang_Id: cn(),
                strCMT_HoChieu: v.strCMT_HoChieu,
                strHoDem: v.strHoDem,
                strTen: v.strTen,
                strSoDienThoai: v.strSoDienThoai,
                strEmail: v.strEmail,
                strDiaChi: v.strDiaChi,
                strGhiChu: v.strGhiChu,
                strNguoiThucHien_Id: uid()
            };
        },
        rowDelete: false,
        remove: function (ids) {
            return { action: 'TS_DoiTacTuyenSinh/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: uid() };
        }
    });
})();
