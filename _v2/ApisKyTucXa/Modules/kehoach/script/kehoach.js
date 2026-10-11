/* =========================================================================
   Kế hoạch đăng ký ký túc xá (gốc: "Kế hoạch tổ chức" / "Lập kế hoạch đăng ký ký túc xá")
   Bản gốc: ApisKyTucXa/Modules/kehoach/script/kehoach.js (375 dòng) + html/kehoach.html
   ---------------------------------------------------------------------------
   Bố cục gốc HAI CỘT: trái ô từ khoá + danh sách kế hoạch (mỗi mục: tên + nút Xoá / Sửa / Xem),
   phải ba vùng đổi chỗ nhau: "Kế hoạch đang triển khai đăng ký" (nút Thêm) / chi tiết / biểu mẫu.
   → ums.crud({ master }) : cột trái ô tìm chuẩn (gõ tự tìm) + danh sách, cột phải khung giới thiệu ↔ biểu mẫu.

   Lời gọi (kiểu cũ, không mã hoá, tham số chép nguyên văn):
       KTX_KeHoachDangKy/LayDanhSach   GET   strTuKhoa, strLoaiKeHoach_Id '' (gốc gửi rỗng), strNguoiThucHien_Id '', pageIndex, pageSize
       KTX_KeHoachDangKy/ThemMoi       POST  strId '', strTenKeHoach, strTuNgay, strDenNgay, strLoaiKeHoach_Id, dSoNgayHieuLucGiuCho
       KTX_KeHoachDangKy/CapNhat       POST  như ThemMoi, strId = id đang sửa
       KTX_KeHoachDangKy/Xoa           POST  strIds
       Danh mục: KTX.LKH0 (constant.setting.CATOR.KTX.LKH0 — loại kế hoạch)
   Cột trả về: ID, TENKEHOACH, TUNGAY, DENNGAY, LOAIKEHOACH_ID, LOAIKEHOACH_TEN, SONGAYHIEULUCGIUCHO.

   Khác gốc (ghi lại):
     · Khung "Chi tiết" chỉ đọc (nút Xem) gộp vào biểu mẫu sửa: bấm mục ở cột trái mở biểu mẫu có đủ 5 ô, Xoá nằm trong
       biểu mẫu (khuôn ums.crud master — cùng cách các màn hai cột khác đã chuyển).
     · Gốc không kiểm ô nào khi lưu → ở đây bắt buộc Tên kế hoạch (lưu tên rỗng là sinh dòng trống ở cột trái).
   Cố ý bỏ (mã chết ở gốc): #btnSearch_KeHoach, #btnYes (không có trong html); dateYearToCombo vào #dropKeHoach_Nam
   (ô không tồn tại); nút kính lúp btnExtend_Search bật/tắt .box-sub-search (không có vùng đó).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, esc = ui.esc, P = 'KTX_KeHoachDangKy/';
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    ums.crud({
        root: document.getElementById('ktx-kehoach'),
        title: 'Kế hoạch đăng ký',
        formTitle: 'kế hoạch đăng ký ký túc xá',
        icon: 'fa-calendar-check',
        master: {
            title: 'Kế hoạch tổ chức', icon: 'fa-calendar-check',
            empty: 'Kế hoạch đang triển khai đăng ký: chọn một kế hoạch ở cột trái để xem / sửa, hoặc bấm Thêm mới ở đầu trang.',
            item: function (r) {
                return '<b>' + esc(e(r.TENKEHOACH)) + '</b>' +
                    '<div class="ums-u-faint ums-u-fz13">' + esc(e(r.TUNGAY)) + (e(r.DENNGAY) ? ' – ' + esc(e(r.DENNGAY)) : '') +
                    (e(r.LOAIKEHOACH_TEN) ? ' · ' + esc(e(r.LOAIKEHOACH_TEN)) : '') + '</div>';
            }
        },
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strLoaiKeHoach_Id: '', strNguoiThucHien_Id: '' };
            }
        },
        fields: [
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', required: true, span: true, placeholder: 'Nhập tên kế hoạch' },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
            { key: 'strLoaiKeHoach_Id', col: 'LOAIKEHOACH_ID', label: 'Loại kế hoạch', type: 'select', source: { dm: 'KTX.LKH0' }, placeholder: 'Chọn loại kế hoạch' },
            { key: 'dSoNgayHieuLucGiuCho', col: 'SONGAYHIEULUCGIUCHO', label: 'Ngày giữ chỗ', type: 'number', hint: 'Số ngày hiệu lực giữ chỗ' }
        ],
        save: function (v, row) {
            return {
                action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST',
                strId: row ? row.ID : '',
                strTenKeHoach: v.strTenKeHoach,
                strTuNgay: v.strTuNgay,
                strDenNgay: v.strDenNgay,
                strLoaiKeHoach_Id: v.strLoaiKeHoach_Id,
                dSoNgayHieuLucGiuCho: v.dSoNgayHieuLucGiuCho
            };
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; });
        }
    });
})();
