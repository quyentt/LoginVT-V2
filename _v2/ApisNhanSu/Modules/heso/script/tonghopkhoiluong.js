/* =========================================================================
   Kế hoạch tổng hợp khối lượng
   Bản gốc: ApisNhanSu/Modules/heso/html/tonghopkhoiluong.html + script/tonghopkhoiluong.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Thời gian · Từ khoá → Danh sách (Tên · Từ ngày · Đến ngày ·
   Thời gian · Kế hoạch NCKH · Hiệu lực) → biểu mẫu Tên · Thời gian · Từ ngày · Đến ngày ·
   Kế hoạch NCKH · Hiệu lực · Nội dung. Khung chung: ums.nsHeSo.man (../script/_heso.js).

   Lời gọi (chép nguyên):
       KHCT_KeHoachTongHop_V2/LayDanhSach GET — strTuKhoa, strNguoiTao_Id '', pageIndex, pageSize
           (gốc KHÔNG gửi ô lọc Thời gian — giữ nguyên, xem dưới)
       KHCT_KeHoachTongHop_V2/ThemMoi | CapNhat POST — strId, strChucNang_Id, strTuNgay,
           strDenNgay, strMa '' (gốc đọc txtAAAA), strTen, strDaoTao_ThoiGianDaoTao_Id,
           strNCKH_TinhDiem_KeHoach_Id, dHieuLuc, strNoiDung, strNguoiThucHien_Id
       KHCT_KeHoachTongHop_V2/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
       NCKH_TinhDiem_KeHoach/LayDanhSach GET — strTuKhoa '', strNguoiThucHien_Id, pageIndex 1,
           pageSize 10000 (ô Kế hoạch NCKH, tên hiện = MOTA)
       KHCT_ThoiGianDaoTao/LayDanhSach GET — thời gian đào tạo
   Cột Thời gian ghép NAM_DOT_KY như gốc.

   Lỗi gốc đã sửa:
     · Lưu gửi strDaoTao_ThoiGianDaoTao_Id đọc Ô LỌC Thời gian (dropSearch_ThoiGian), không
       phải ô Thời gian của biểu mẫu; resetPopup lại chép NGƯỢC ô biểu mẫu sang ô lọc → chọn
       Thời gian trong biểu mẫu không có tác dụng, sửa một dòng là ghi đè thời gian bằng ô lọc.
       Nay gửi ô Thời gian của biểu mẫu; Thêm mới điền sẵn từ ô lọc.
   Giữ như gốc (ghi sổ):
     · Ô lọc Thời gian không được gửi vào LayDanhSach (gốc không gửi) — chỉ còn dùng để điền
       sẵn khi thêm mới.
     · Hiệu lực: gốc là ô chọn 2 mục (Hiệu lực = 1 / Hết hiệu lực = 0); mặc định "Hiệu lực".
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, thoiGian = N.thoiGian();
    var keHoach = {
        call: {
            action: 'NCKH_TinhDiem_KeHoach/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000
        },
        id: 'ID', name: 'MOTA'
    };

    N.man('ns-tonghopkhoiluong', {
        ctl: 'KHCT_KeHoachTongHop_V2',
        title: 'Kế hoạch tổng hợp khối lượng',
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: thoiGian },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: function (f) {
            return { strTuKhoa: f.q, strNguoiTao_Id: '' };
        },
        columns: [
            { title: 'Tên', prop: 'TEN' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) { return ums.ui.esc(N.thoiGianCot(r, '_', ['NAM', 'DOT', 'KY'])); } },
            { title: 'Kế hoạch NCKH', prop: 'NCKH_TINHDIEM_KEHOACH_TEN' },
            { title: 'Hiệu lực', prop: 'HIEULUC_TEN', cls: 'is-center' }
        ],
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên', span: true },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', source: thoiGian, placeholder: 'Chọn thời gian', tuLoc: 'tg' },
            { key: 'gap1', type: 'gap' },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
            { key: 'strNCKH_TinhDiem_KeHoach_Id', col: 'NCKH_TINHDIEM_KEHOACH_ID', label: 'Kế hoạch NCKH', type: 'select', source: keHoach, placeholder: 'Chọn kế hoạch' },
            { key: 'dHieuLuc', col: 'HIEULUC_ID', label: 'Hiệu lực', type: 'select', required: true, value: '1',
                source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', span: true }
        ],
        save: function (v) {
            return {
                strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strMa: '', strTen: v.strTen,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strNCKH_TinhDiem_KeHoach_Id: v.strNCKH_TinhDiem_KeHoach_Id,
                dHieuLuc: v.dHieuLuc, strNoiDung: v.strNoiDung
            };
        }
    });
})();
