/* =========================================================================
   Quản lý vai trò
   Bản gốc: ApisCMS/Modules/vaitro/html/vaitro.html + script/vaitro.js
   ---------------------------------------------------------------------------
   Hai cột như bản gốc (col-sm-3 cây vai trò | col-sm-9 biểu mẫu): ums.crud
   bố cục master, cột trái vẽ thành CÂY (ums.cmsCay — thay jstree) theo
   CHUNG_VAITRO_CHA_ID thay cho danh sách phẳng của crud.

   Lời gọi (chép nguyên văn):
       pkg_chung_quanlynguoidung.LayDanhSachVaiTro   CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P
           versionAPI v1.0, strLoaiVaiTro_Id "", strTuKhoa "", pageIndex 1,
           pageSize 1000, dTrangThai 1, strChung_VaiTro_Cha_Id "" (gốc đọc ô dropAAAA không tồn tại)
       CMS_QuanLyNguoiDung/ThemMoiVaiTro | SuaVaiTro  (action kiểu cũ, không func)
           versionAPI, strMaVaiTro, strTenVaiTro, strMoTa, dThuTu, dTrangThai 1,
           strLoaiVaiTro_Id, strChung_VaiTro_Cha_Id, strNguoiThucHien_Id, strId
       CMS_QuanLyNguoiDung/XoaVaiTro   versionAPI, strIds = id vai trò, strNguoiThucHien_Id
       Danh mục QLTC.LOVT              ô "Loại vai trò"

   Giữ như gốc:
     · Bắt buộc Tên, Mã, Thứ tự (số), Loại vai trò (arrValid_VaiTro).
     · "Vai trò cha không được trùng với chính vai trò đang chỉnh sửa!".
     · Sửa lấy luôn dòng của danh sách (không gọi chi tiết) — viewForm_VaiTro.
     · Ô "Vai trò cha" liệt kê cả cây, thụt đầu dòng theo tầng (loadToCombo_data
       type 'unorder'); phá vòng cha-con như genCombo_VaiTro.
     · Tìm vai trò lọc TẠI CHỖ trên cây đã tải, tô từ khoá (filterTree_VaiTro) —
       không gửi từ khoá lên máy chủ (gốc gửi strTuKhoa "").

   Khác gốc / cố ý bỏ:
     · Bản gốc đẩy biểu mẫu "Thêm mới" ra sẵn khi mở màn; ở đây cột phải là
       khung giới thiệu, bấm "Thêm mới vai trò" hoặc chọn một vai trò mới hiện
       biểu mẫu (BO-CUC luật 1).
     · Nút "Khôi phục" (btnUndo — đổ lại giá trị trước khi sửa, không lưu): lưu
       xong biểu mẫu đóng về danh sách nên nút không còn chỗ dùng.
     · Khối "Thông tin người tạo": bản gốc chỉ có tiêu đề, không có nội dung.
     · Lưu thêm mới xong bản gốc để nguyên biểu mẫu với id rỗng — bấm Lưu lần
       nữa là thêm TRÙNG. Ở đây lưu xong đóng biểu mẫu, nạp lại cây.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, C = ums.cmsCay;
    var root = document.getElementById('cms-vaitro');
    if (!root) return;

    var CHA = 'CHUNG_VAITRO_CHA_ID';

    var crud = ums.crud({
        root: root,
        title: 'Quản lý vai trò',
        formTitle: 'vai trò',
        icon: 'fa-users-gear',
        addText: 'Thêm mới vai trò',
        autoload: false,
        pageSize: ui.PAGE_ALL,
        master: {
            title: 'Danh sách vai trò',
            icon: 'fa-users-gear',
            empty: 'Chọn một vai trò ở cây bên trái để sửa, hoặc bấm "Thêm mới vai trò" ở đầu trang.'
        },
        filters: [{ key: 'q', type: 'text', label: 'Tìm tên vai trò...' }],

        list: {
            call: function () {
                return {
                    action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
                    func: 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
                    versionAPI: 'v1.0',
                    strLoaiVaiTro_Id: '',
                    strTuKhoa: '',
                    pageIndex: 1,
                    pageSize: 1000,
                    dTrangThai: 1,
                    strChung_VaiTro_Cha_Id: ''
                };
            }
        },

        fields: [
            { type: 'legend', label: 'Thông tin vai trò' },
            { key: 'strTenVaiTro', col: 'TENVAITRO', label: 'Tên vai trò', required: true, span: true },
            { key: 'strMaVaiTro', col: 'MAVAITRO', label: 'Mã vai trò', required: true, span: true },
            { key: 'dThuTu', col: 'THUTU', label: 'Thứ tự hiển thị', type: 'number', required: true, span: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true },
            { key: 'strChung_VaiTro_Cha_Id', col: CHA, label: 'Vai trò cha', type: 'select', placeholder: 'Chọn vai trò' },
            { key: 'strLoaiVaiTro_Id', col: 'LOAIVAITRO_ID', label: 'Loại vai trò', type: 'select', required: true,
              source: { dm: 'QLTC.LOVT' }, placeholder: 'Chọn loại vai trò' }
        ],

        save: function (v, row) {
            var id = row ? row.ID : '';
            if (id && v.strChung_VaiTro_Cha_Id === id) {
                ui.toast('Vai trò cha không được trùng với chính vai trò đang chỉnh sửa!', 'warn');
                return null;
            }
            return {
                action: id ? 'CMS_QuanLyNguoiDung/SuaVaiTro' : 'CMS_QuanLyNguoiDung/ThemMoiVaiTro',
                versionAPI: 'v1.0',
                strMaVaiTro: v.strMaVaiTro,
                strTenVaiTro: v.strTenVaiTro,
                strMoTa: v.strMoTa,
                dThuTu: v.dThuTu,
                dTrangThai: 1,
                strLoaiVaiTro_Id: v.strLoaiVaiTro_Id,
                strChung_VaiTro_Cha_Id: v.strChung_VaiTro_Cha_Id,
                strNguoiThucHien_Id: '',
                strId: id
            };
        },

        formRemoveText: 'Xóa',
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'CMS_QuanLyNguoiDung/XoaVaiTro', versionAPI: 'v1.0', strIds: id, strNguoiThucHien_Id: '' };
            });
        },

        onLoad: function (rows) {
            // Ô "Vai trò cha": cả cây, thụt đầu dòng theo tầng
            var el = root.querySelector('select[data-scope="form"][data-k="strChung_VaiTro_Cha_Id"]');
            if (!el) return;
            var giu = el.value;
            el.innerHTML = '<option value="">Chọn vai trò</option>' + C.thuTu(rows, { cha: CHA }).map(function (x) {
                return '<option value="' + ui.esc(x.r.ID) + '">' + ui.esc(new Array(x.sau + 1).join('— ') + (x.r.TENVAITRO || '') +
                    (x.r.MAVAITRO ? ' - ' + x.r.MAVAITRO : '')) + '</option>';
            }).join('');
            el.value = giu;
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }
    });

    /* Cột trái: vẽ CÂY thay danh sách phẳng. Nút mang data-c="<uid>:edit"
       để bấm vẫn đi đường mở biểu mẫu của crud. */
    var timEl = root.querySelector('[data-cf="' + crud.uid + '"][data-k="q"]');
    crud.drawMaster = function () {
        var host = crud.z('table');
        var dang = crud.editing && crud.editing.ID;
        host.innerHTML = C.html(crud.rows, {
            cha: CHA, ten: 'TENVAITRO', icon: 'fa-user', active: dang,
            attr: function (r, i) { return ' data-c="' + crud.uid + ':edit" data-i="' + i + '" title="' + ui.esc(r.TENVAITRO || '') + '"'; }
        });
        crud.z('foot').innerHTML = '';
        C.loc(host, timEl ? timEl.value : '');
    };
    if (timEl) timEl.addEventListener('input', function () { C.loc(crud.z('table'), timEl.value); });

    crud.load();
})();
