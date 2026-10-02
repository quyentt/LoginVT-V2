/* =========================================================================
   Danh sách giảm trừ gia cảnh — người phụ thuộc của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/danhsachgiamtrugiacanh.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_GiamTruGiaCanh/LayDanhSach  GET  strNhanSu_HoSoCanBo_Id = userId, strNguoiTao_Id '',
                                          strTuKhoa '', pageIndex, pageSize
       L_GiamTruGiaCanh/LayChiTiet   GET  strId
       L_GiamTruGiaCanh/ThemMoi | CapNhat, Xoa (strIds)
   Tệp đính kèm: NS_Files. Bảng có tiêu đề ba tầng (giấy khai sinh → nơi đăng ký).

   Không chuyển (bản gốc giấu bằng display:none): cột trái "Danh sách cán
   bộ" (tìm cán bộ theo khoa/bộ môn/tình trạng) và nút "Kế thừa sang năm
   khác" (L_GiamTruGiaCanh/KeThua) nằm trong đó.

   Khác bản gốc (chờ nghiệp vụ xác nhận):
     · Bản gốc chú thích bỏ TOÀN BỘ phần nạp danh mục (page_load rỗng) → trên
       hệ cũ các ô Quốc tịch, Quan hệ, Quốc gia luôn trống, không chọn được;
       khung tệp đính kèm cũng không bật (uploadFiles bị chú thích). Ở đây nạp
       lại đúng các lời gọi đã chú thích: CHUN.CHLU (quốc tịch, quốc gia),
       NS.QHGD (quan hệ), và bật tệp đính kèm.
     · Tỉnh/Huyện/Xã: đoạn chú thích đổ TOÀN BỘ danh mục CHUN.DMTT vào cả ba ô
       (không lọc cha–con) — có lẽ vì nặng nên bị tắt. Giữ như hệ đang chạy:
       ba ô không có danh sách.
     · Danh sách: bản gốc chỉ nạp trang đầu (10 dòng), không có thanh phân
       trang. Ở đây phân trang đầy đủ, cùng tham số.
     · Bản gốc chú thích bỏ ThietLapQuaTrinhCuoiCung — không gọi.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    var C = 'L_GiamTruGiaCanh';
    var CHLU = { dm: 'CHUN.CHLU' };
    var GKS = 'Thông tin trên giấy khai sinh của người phụ thuộc (Nếu người phụ thuộc không có MST, CMND và Hộ chiếu)';
    var NOI = [GKS, 'Nơi đăng ký'];
    var TG = ['Thời gian tính giảm trừ'];

    ums.crud({
        root: document.getElementById('danhsachgiamtrugiacanh'),
        title: 'Danh sách giảm trừ gia cảnh',
        listTitle: 'Danh sách giảm trừ gia cảnh',
        formTitle: 'người phụ thuộc',
        icon: 'fa-people-roof',
        formCols: 12,
        saveAgain: 'Lưu và nhập tiếp',
        pageSize: 10,

        list: {
            paged: true,
            call: function () {
                return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: uid(), strNguoiTao_Id: '', strTuKhoa: '' };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Họ tên người nộp thuế', render: function (r) { return esc(e(r.NHANSU_HOSOCANBO_HODEM) + ' ' + e(r.NHANSU_HOSOCANBO_TEN)); } },
            { title: 'MST của người nộp thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
            { title: 'Họ tên người phụ thuộc', prop: 'HOTEN' },
            { title: 'Ngày sinh người phụ thuộc', cls: 'is-center is-nowrap', render: function (r) { return esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
            { title: 'MST của người phụ thuộc', prop: 'MASOTHUENGUOIPHUTHUOC' },
            { title: 'Mã quốc tịch của người phụ thuộc', prop: 'QUOCTICH_MA', cls: 'is-center' },
            { title: 'Quốc tịch của người phụ thuộc', prop: 'QUOCTICH_TEN' },
            { title: 'CMND/Hộ chiếu của người phụ thuộc', render: function (r) { return esc(e(r.CMTND) + '/' + e(r.THECANCUOC) + '/' + e(r.HOCHIEU)); } },
            { title: 'Mã quan hệ với người nộp thuế', prop: 'QUANHE_MA', cls: 'is-center' },
            { title: 'Quan hệ với người nộp thuế', prop: 'QUANHE_TEN' },
            { title: 'Số', prop: 'GIAYKHAISINH_SO', group: [GKS] },
            { title: 'Quyển số', prop: 'GIAYKHAISINH_QUYEN', group: [GKS] },
            { title: 'Mã quốc gia', prop: 'GIAYKHAISINH_QUOCGIA_MA', group: NOI },
            { title: 'Quốc gia', prop: 'GIAYKHAISINH_QUOCGIA_TEN', group: NOI },
            { title: 'Mã Tỉnh/Thành phố', prop: 'GIAYKHAISINH_TINHTHANH_MA', group: NOI },
            { title: 'Tỉnh/Thành phố', prop: 'GIAYKHAISINH_TINHTHANH_TEN', group: NOI },
            { title: 'Mã Quận/Huyện', prop: 'GIAYKHAISINH_QUANHUYEN_MA', group: NOI },
            { title: 'Quận/Huyện', prop: 'GIAYKHAISINH_QUANHUYEN_TEN', group: NOI },
            { title: 'Mã Phường/Xã', prop: 'GIAYKHAISINH_PHUONGXA_MA', group: NOI },
            { title: 'Phường/Xã', prop: 'GIAYKHAISINH_PHUONGXA_TEN', group: NOI },
            { title: 'Từ tháng', cls: 'is-center is-nowrap', group: TG, render: function (r) { return esc(e(r.TUTHANG) + '/' + e(r.TUNAM)); } },
            { title: 'Đến tháng', cls: 'is-center is-nowrap', group: TG, render: function (r) { return esc(e(r.DENTHANG) + '/' + e(r.DENNAM)); } }
        ],

        fields: [
            { key: 'strMaSoThue', col: 'NHANSU_HOSOCANBO_MASOTHUE', label: 'Mã số thuế', span: true },
            { key: 'strHoTen', col: 'HOTEN', label: 'Họ tên', span: true },
            { key: 'strNgaySinh', col: 'NGAYSINH', label: 'Ngày sinh', cols: 4 },
            { key: 'strThangSinh', col: 'THANGSINH', label: 'Tháng sinh', cols: 4 },
            { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm sinh', cols: 4 },
            { key: 'strCMTND', col: 'CMTND', label: 'CMND', cols: 4 },
            { key: 'strTheCanCuoc', col: 'THECANCUOC', label: 'Thẻ căn cước', cols: 4 },
            { key: 'strHoChieu', col: 'HOCHIEU', label: 'Hộ chiếu', cols: 4 },
            { key: 'strQuocTich_Id', col: 'QUOCTICH_ID', label: 'Quốc tịch', type: 'select', source: CHLU, cols: 4 },
            { key: 'strQuanHeVoiNguoiNopThue_Id', col: 'QUANHEVOINGUOINOPTHUE_ID', label: 'Quan hệ với người nộp thuế', type: 'select',
              source: { dm: 'NS.QHGD' }, placeholder: 'Chọn quan hệ với người nộp thuế', cols: 4 },
            { key: 'strMaSoThueNguoiPhuThuoc', col: 'MASOTHUENGUOIPHUTHUOC', label: 'Mã số thuế người phụ thuộc', cols: 4 },
            { key: '_gks', type: 'legend', label: 'Giấy khai sinh' },
            { key: 'strGiayKhaiSinh_So', col: 'GIAYKHAISINH_SO', label: 'Giấy khai sinh số', cols: 4 },
            { key: 'strGiayKhaiSinh_Quyen', col: 'GIAYKHAISINH_QUYEN', label: 'Giấy khai sinh quyển', cols: 4 },
            { key: 'strGiayKhaiSinh_QuocGia_Id', col: 'GIAYKHAISINH_QUOCGIA_ID', label: 'Quốc gia', type: 'select', source: CHLU, cols: 4 },
            { key: 'strGiayKhaiSinh_TinhThanh_Id', col: 'GIAYKHAISINH_TINHTHANH_ID', label: 'Tỉnh/ Thành phố', type: 'select', source: { items: [] }, cols: 4 },
            { key: 'strGiayKhaiSinh_QuanHuyen_Id', col: 'GIAYKHAISINH_QUANHUYEN_ID', label: 'Quận/ Huyện', type: 'select', source: { items: [] }, cols: 4 },
            { key: 'strGiayKhaiSinh_PhuongXa_Id', col: 'GIAYKHAISINH_PHUONGXA_ID', label: 'Phường/ Xã', type: 'select', source: { items: [] }, cols: 4 },
            { key: 'strTuThang', col: 'TUTHANG', label: 'Từ tháng', cols: 3 },
            { key: 'strTuNam', col: 'TUNAM', label: 'Năm', cols: 3 },
            { key: 'strDenThang', col: 'DENTHANG', label: 'Đến tháng', cols: 3 },
            { key: 'strDenNam', col: 'DENNAM', label: 'Năm', cols: 3 },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' }
        ],

        save: function (v, row) {
            var x = { action: C + (row ? '/CapNhat' : '/ThemMoi'), strId: row ? row.ID : '' };
            ['strMaSoThue', 'strHoTen', 'strNgaySinh', 'strThangSinh', 'strNamSinh', 'strQuocTich_Id', 'strCMTND', 'strHoChieu',
             'strTheCanCuoc', 'strMaSoThueNguoiPhuThuoc', 'strQuanHeVoiNguoiNopThue_Id', 'strGiayKhaiSinh_So', 'strGiayKhaiSinh_Quyen',
             'strGiayKhaiSinh_QuocGia_Id', 'strGiayKhaiSinh_TinhThanh_Id', 'strGiayKhaiSinh_QuanHuyen_Id', 'strGiayKhaiSinh_PhuongXa_Id',
             'strTuThang', 'strTuNam', 'strDenThang', 'strDenNam'].forEach(function (k) { x[k] = v[k]; });
            x.strNhanSu_HoSoCanBo_Id = uid();
            x.strNguoiThucHien_Id = uid();
            return x;
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });
})();
