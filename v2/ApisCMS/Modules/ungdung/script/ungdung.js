/* =========================================================================
   Quản lý ứng dụng
   Bản gốc: ApisCMS/Modules/ungdung/html/ungdung.html + script/ungdung.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc: ô từ khoá + Tìm kiếm, bảng phân trang máy chủ, nút
   Tải lại / Xóa / Tạo mới. Biểu mẫu bản gốc mở trong hộp thoại (#myModal);
   ở đây thay chỗ bảng (BO-CUC luật 1).

   Lời gọi (chép nguyên văn):
       pkg_chung_quanlynguoidung.LayDanhSachUngDung   CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m
           strTuKhoa, pageIndex, pageSize, dTrangThai 1
       pkg_chung_quanlynguoidung.LayThongTinUngDung   CMS_QuanLyNguoiDung_MH/DSA4FSkuLyYVKC8ULyYFNC8m
           strId                                        — trước khi sửa
       CMS_QuanLyNguoiDung/ThemMoiUngDung | SuaUngDung  (action kiểu cũ, không func)
           versionAPI v1.0, strId, strNguoiThucHien_Id, strMaUngDung, strTenUngDung,
           strMoTa, dThuTu, dTrangThai, dSuDungDaNgonNgu, strNoiDung "" (gốc đọc
           getValById("")), strTenAnh, strTenFileDinhKem = ô "Báo cáo",
           strDuongDanSSO, strDuongDanTruyCapBaoCao = ô "Báo cáo"
       CMS_QuanLyNguoiDung/XoaUngDung   strIds "id1,id2," (một lời gọi), strNguoiThucHien_Id

   Giữ như gốc: bắt buộc Tên, Mã, Thứ tự, Đường dẫn SSO; ô "Báo cáo" gửi hai
   tham số và đọc lại từ TENFILEDINHKEM; cột Tình trạng: 1 Đang hoạt động,
   2 Dừng hoạt động, còn lại "Đang hoạt động" màu cảnh báo; Đa ngôn ngữ: 1 Có,
   còn lại Không. Biểu tượng ở cột Icon là TENANH (Font Awesome 4) — đổi qua
   ums.iconFA4, bấm vào mở đường dẫn SSO như gốc.

   Khác gốc / cố ý bỏ:
     · Nút "Truy/xuất" (Import / Export / …): cả ba mục không có xử lý (btnExport
       không được gắn sự kiện) → giữ nút, khoá.
     · So trạng thái / ngôn ngữ theo chuỗi (gốc so === với số — máy chủ trả
       chuỗi thì mọi dòng rơi vào nhánh mặc định).
     · Mã sửa lỗi select2 trong hộp thoại (gắn lên document) — không còn hộp thoại.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('cms-ungdung');
    if (!root) return;

    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var crud = ums.crud({
        root: root,
        title: 'Quản lý ứng dụng',
        formTitle: 'ứng dụng',
        icon: 'fa-laptop-code',
        addText: 'Tạo mới',
        toolbar: [{ text: 'Truy/xuất', icon: 'fa-file-excel', mod: 'out-info', onClick: function () {} }],

        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
                    func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
                    strTuKhoa: f.q,
                    dTrangThai: 1
                };
            }
        },

        columns: [
            { title: 'Icon', cls: 'is-center', width: '64px', render: function (r) {
                var link = e(r.DUONGDANTRUYCAPSSO);
                var ic = ums.iconFA4 ? ums.iconFA4(e(r.TENANH)) : e(r.TENANH);
                return ic ? '<a href="' + ui.esc(link || '#') + '" title="' + ui.esc(link) + '" target="_blank" rel="noopener">' +
                    '<i class="' + ui.esc(ic) + '"></i></a>' : '';
            } },
            { title: 'Mã', prop: 'MAUNGDUNG', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TENUNGDUNG' },
            { title: 'Đường dẫn login', render: function (r) {
                var link = e(r.DUONGDANTRUYCAPSSO);
                return link ? '<a href="' + ui.esc(link) + '" target="_blank" rel="noopener">' + ui.esc(link) + '</a>' : '';
            } },
            { title: 'Hiển thị', prop: 'THUTU', cls: 'is-center' },
            { title: 'Đa ngôn ngữ', render: function (r) { return e(r.COSUDUNGDANGONNGU) === '1' ? 'Có' : 'Không'; } },
            { title: 'Tình trạng', render: function (r) {
                var t = e(r.TRANGTHAI);
                if (t === '1') return ui.badge('Đang hoạt động', 'ok');
                if (t === '2') return ui.badge('Dừng hoạt động', 'bad');
                return ui.badge('Đang hoạt động', 'warn');
            } }
        ],

        detail: function (row) {
            return {
                action: 'CMS_QuanLyNguoiDung_MH/DSA4FSkuLyYVKC8ULyYFNC8m',
                func: 'pkg_chung_quanlynguoidung.LayThongTinUngDung',
                strId: row.ID
            };
        },

        formCols: 1,
        fields: [
            { key: 'strTenUngDung', col: 'TENUNGDUNG', label: 'Tên', required: true, placeholder: 'Nhập tên ứng dụng' },
            { key: 'strMaUngDung', col: 'MAUNGDUNG', label: 'Mã', required: true },
            { key: 'dThuTu', col: 'THUTU', label: 'Thứ tự', required: true, type: 'number' },
            { key: 'strTenAnh', col: 'TENANH', label: 'Icon', hint: 'Tên lớp biểu tượng Font Awesome, vd: fa fa-users' },
            { key: 'strDuongDanSSO', col: 'DUONGDANTRUYCAPSSO', label: 'Đường dẫn SSO', required: true },
            { key: 'strDuongDanTruyCapBaoCao', col: 'TENFILEDINHKEM', label: 'Báo cáo' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' },
            { key: 'dSuDungDaNgonNgu', col: 'COSUDUNGDANGONNGU', label: 'Ngôn ngữ', type: 'select',
              placeholder: '-- Cho phép đa ngôn ngữ trong ứng dụng --',
              source: { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] } },
            { key: 'dTrangThai', col: 'TRANGTHAI', label: 'Trạng thái', type: 'select', placeholder: '-- Chọn trạng thái --',
              source: { items: [{ ID: '1', TEN: 'Đang hoạt động' }, { ID: '2', TEN: 'Dừng hoạt động' }] } }
        ],

        save: function (v, row) {
            var id = row ? row.ID : '';
            return {
                action: id ? 'CMS_QuanLyNguoiDung/SuaUngDung' : 'CMS_QuanLyNguoiDung/ThemMoiUngDung',
                versionAPI: 'v1.0',
                strId: id,
                strNguoiThucHien_Id: '',
                strMaUngDung: v.strMaUngDung,
                strTenUngDung: v.strTenUngDung,
                strMoTa: v.strMoTa,
                dThuTu: v.dThuTu,
                dTrangThai: v.dTrangThai,
                dSuDungDaNgonNgu: v.dSuDungDaNgonNgu,
                strNoiDung: '',
                strTenAnh: v.strTenAnh,
                strTenFileDinhKem: v.strDuongDanTruyCapBaoCao,
                strDuongDanSSO: v.strDuongDanSSO,
                strDuongDanTruyCapBaoCao: v.strDuongDanTruyCapBaoCao
            };
        },

        formDelete: false,          // hộp thoại gốc không có nút xoá
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) {
            return { action: 'CMS_QuanLyNguoiDung/XoaUngDung', strIds: ids.join(',') + ',', strNguoiThucHien_Id: '' };
        }
    });

    // "Truy/xuất": bản gốc không gắn xử lý cho mục nào → giữ nút, khoá
    var tx = root.querySelector('[data-c="' + crud.uid + ':tool0"]');
    if (tx) { tx.disabled = true; tx.title = 'Bản gốc chưa có chức năng'; }
})();
