/* =========================================================================
   Nghỉ lễ — danh sách ngày nghỉ lễ theo năm
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/nghile.html + script/nghile.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Ngày lễ trong năm" (bảng danh mục NS.NNL0) + "Lịch âm -
   dương"; phải danh sách (lọc Năm áp dụng + Loại nghỉ lễ, phân trang máy chủ) +
   biểu mẫu (ums.crud nhúng).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  strMaBangDanhMuc NS.NNL0
            (edu.system.getList_DanhMucDulieu = ums.api.dm) — đổ ô "Ngày lễ" + bảng cột trái
       NS_QuyDinhNghiLe/LayDanhSach  GET  strTuKhoa '', strNguoiThucHien_Id '', strDanhMucNghiLe_Id,
                                     strNamApDung, pageIndex, pageSize
       NS_QuyDinhNghiLe/ThemMoi | CapNhat  strId, strDanhMucNghiLe_Id, strNgayNghi, strNamApDung
       NS_QuyDinhNghiLe/Xoa          strIds
   Năm áp dụng: dateYearToCombo cho HAI ô → năm nay lùi về 1994, ô lọc chọn sẵn
   năm nay (gốc đặt activeOption mặc định = năm nay) nên mở màn là lọc năm nay.

   Khác gốc: lưu xong về danh sách; bỏ "Viết lại" (#btnRefreshNghiLe không có
   trình xử lý nào). Ô lọc chọn / xoá đều nạp lại (gốc chỉ bắt select2:select).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, C = 'NS_QuyDinhNghiLe';
    var root = document.getElementById('nghile');
    var dmLe = { dm: 'NS.NNL0' };

    var k = S.khung(root, {
        title: 'Nghỉ lễ',
        trai: [
            { title: 'Ngày lễ trong năm', icon: 'fa-gift', ve: function (h) {
                h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                ums.api.dm('NS.NNL0').then(function (rows) {
                    ui.table({ el: h, rows: rows, columns: [{ title: 'Ngày lễ', prop: 'TEN' }], empty: 'Chưa khai danh mục ngày lễ' });
                }, function (err) { h.innerHTML = ui.fail(err.message); });
            } },
            { title: 'Lịch âm - dương', icon: 'fa-calendar', ve: function (h) { h.classList.add('nscham-pad'); S.amLich(h); } }
        ],
        crud: {
            title: 'Danh sách ngày nghỉ lễ',
            formTitle: 'nghỉ lễ',
            icon: 'fa-file-lines',
            addText: 'Thêm',
            autoload: false,
            filters: [
                { key: 'nam', type: 'select', label: 'Chọn năm áp dụng', source: { items: S.nam(1993) }, value: S.namNay() },
                { key: 'loai', type: 'select', label: 'Chọn loại nghỉ lễ', source: dmLe }
            ],
            list: {
                paged: true,
                call: function (f) {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '',
                        strDanhMucNghiLe_Id: f.loai, strNamApDung: f.nam };
                }
            },
            columns: [
                { title: 'Ngày lễ', prop: 'DANHMUCNGHILE_TEN' },
                { title: 'Ngày nghỉ', prop: 'NGAYNGHI', cls: 'is-center is-nowrap' },
                { title: 'Năm áp dụng', prop: 'NAMAPDUNG', cls: 'is-center' },
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TENDAYDU' }
            ],
            fields: [
                { type: 'legend', label: 'Quy định nghỉ lễ' },
                { key: 'strDanhMucNghiLe_Id', col: 'DANHMUCNGHILE_ID', label: 'Ngày lễ', type: 'select', source: dmLe },
                { key: 'strNgayNghi', col: 'NGAYNGHI', label: 'Ngày nghỉ', type: 'date' },
                { key: 'strNamApDung', col: 'NAMAPDUNG', label: 'Năm áp dụng', type: 'select', source: { items: S.nam(1993) }, placeholder: 'Chọn năm áp dụng' }
            ],
            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strDanhMucNghiLe_Id: v.strDanhMucNghiLe_Id,
                    strNgayNghi: v.strNgayNghi,
                    strNamApDung: v.strNamApDung,
                    strNguoiThucHien_Id: S.uid()
                };
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
            }
        }
    });
    k.crud.sourcesReady.then(function () { k.crud.load(1); });
})();
