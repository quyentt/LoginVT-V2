/* =========================================================================
   Kế hoạch xét nâng lương — danh sách kế hoạch (trái) + biểu mẫu (phải)
   Bản gốc: ApisNhanSu/Modules/luong/script/kehoachxetnangluong.js
   Hai cột như gốc: ums.crud({ master }) — ô Loại xét nâng lương + ô từ khoá ở đầu cột trái.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_KeHoachXetLuong/LayDanhSach   GET  strTuKhoa, strLoaiXetLuong_Id, strNguoiTao_Id '', 1/100000
       L_KeHoachXetLuong/LayChiTiet    GET  strId
       L_KeHoachXetLuong/ThemMoi | CapNhat  strId, strLoaiXetLuong_Id, strNgayBatDau, strNgayKetThuc,
                                            strGhiChu, strNguoiThucHien_Id
       L_KeHoachXetLuong/Xoa           strIds (gốc không gửi strNguoiThucHien_Id — tầng API tự điền)
   Danh mục: LUONG.LOAIXETNANGLUONG. Bắt buộc: Loại xét nâng lương (validInputForm gốc).
   Khác gốc:
     · Nút xoá trên từng mục cột trái → nút "Xoá" trong biểu mẫu (khung hai cột chung
       không đặt nút trong mục).
     · Thêm mới xong gốc hỏi "Bạn có muốn tiếp tục thêm không?" và ở lại biểu mẫu; bản mới
       đóng biểu mẫu, muốn nhập tiếp dùng nút "Lưu và Nhập tiếp" (gốc cũng có).
     · Đổi ô Loại nạp lại ngay (gốc chỉ Enter / bấm kính lúp).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('kehoachxetnangluong');
    if (!root) return;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'L_KeHoachXetLuong';
    var LOAI = { dm: 'LUONG.LOAIXETNANGLUONG' };

    ums.crud({
        root: root,
        title: 'Kế hoạch xét nâng lương',
        formTitle: 'kế hoạch xét nâng lương',
        icon: 'fa-chart-line-up',
        saveAgain: 'Lưu và Nhập tiếp',
        formCols: 1,
        filters: [
            { key: 'loai', type: 'select', label: 'Chọn loại xét nâng lương', source: LOAI },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        master: {
            title: 'Danh sách kế hoạch xét nâng lương',
            icon: 'fa-list-ul',
            empty: 'Hôm nay bạn có kế hoạch xét nâng lương mới không? Bấm Thêm mới ở đầu trang để tạo.',
            item: function (r) {
                return '<span class="ums-master__item__main">Kế hoạch xét nâng lương: ' + ui.esc(e(r.LOAIXETLUONG_TEN)) +
                    '<span class="ums-master__item__sub">Thời gian: ' + ui.esc(e(r.NGAYBATDAU) + '-' + e(r.NGAYKETTHUC)) + '</span></span>';
            }
        },
        list: {
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strLoaiXetLuong_Id: f.loai, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { key: '_tt', type: 'legend', label: 'Thông tin' },
            { key: 'strLoaiXetLuong_Id', col: 'LOAIXETLUONG_ID', label: 'Loại xét nâng lương', type: 'select', required: true, source: LOAI, placeholder: '--Chọn loại xét nâng lương--' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú' }
        ],
        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strLoaiXetLuong_Id: v.strLoaiXetLuong_Id,
                strNgayBatDau: v.strNgayBatDau,
                strNgayKetThuc: v.strNgayKetThuc,
                strGhiChu: v.strGhiChu,
                strNguoiThucHien_Id: uid()
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id }; }); }
    });
})();
