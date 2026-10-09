/* =========================================================================
   Nhân sự không tính lương
   Bản gốc: ApisNhanSu/Modules/heso/html/khongtinhluong.html + script/khongtinhluong.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Quy định lương · Loại bảng lương · Đơn vị → Cán bộ → Danh sách
   (Mã cán bộ · Họ tên · Thành phần lương · Từ ngày · Đến ngày) → biểu mẫu Đơn vị · Cán bộ ·
   Thành phần lương (CHỌN NHIỀU) · Từ ngày · Đến ngày. (Gốc chép từ xulybietle.js.)
   Khung chung: ums.nsHeSo.man + N.ganCanBo (../script/_heso.js).

   Lời gọi (chép nguyên):
       L_KhongTinh/LayDanhSach GET — strTuKhoa '' (txtAAAA), strDaoTao_CoCauToChuc_Id,
           strNhanSu_HoSoCanBo_Id, strNhanSu_BangQuyDinh_Id, strLoaiBangLuong_Id,
           strLoaiKhongTinhLuong_Id '' / strThanhPhan_Id '' / strNam '' / strThang '' (gốc đọc các ô
           dropSearch_LoaiXuLy, dropSearch_ThanhPhanLuong, txtSearch_Nam, txtSearch_Thang — không có
           trên màn này), strNguoiTao_Id '', pageIndex, pageSize
       L_KhongTinh/ThemMoi | CapNhat POST — MỖI thành phần lương đã chọn MỘT lời gọi: strId,
           strChucNang_Id, strNhanSu_HoSoCanBo_Id, strNhanSu_BangQuyDinh_Id '', strLoaiBangLuong_Id
           (= id thành phần, như gốc), strLoaiKhongTinhLuong_Id '' (dropLoaiXuLy không có),
           strThanhPhan_Id, strNam '', strThang '' (txtNam/txtThang không có), strTuNgay,
           strDenNgay, strGhiChu '', strNguoiThucHien_Id
       L_KhongTinh/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
       L_BangQuyDinhLuong/LayDanhSach GET (MUCLUONGCOBAN) · NS_HoSoV2/LayDanhSach GET (cán bộ)
   Danh mục: NHANSU.THANHPHANLUONG, NHANSU.LOAIBANGLUONG.

   Khác gốc:
     · Thành phần lương bắt buộc: chưa chọn thì báo, không gửi (gốc: .val() null → lỗi JS, không làm gì).
     · Lưu xong (hết mọi lời gọi) về danh sách, nạp lại.
   Giữ như gốc (ghi sổ): SỬA một dòng mà chọn NHIỀU thành phần → gửi CapNhat cùng strId cho
     từng thành phần (chỉ thành phần cuối có hiệu lực).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, ui = ums.ui, esc = ui.esc, $ = window.jQuery;
    var thanhPhan = N.dm('NHANSU.THANHPHANLUONG'), loaiBL = N.dm('NHANSU.LOAIBANGLUONG'),
        donVi = N.donVi(), cb = null;

    N.man('ns-khongtinhluong', {
        ctl: 'L_KhongTinh',
        title: 'Nhân sự không tính lương',
        filters: [
            { key: 'qd', type: 'select', label: 'Chọn quy định lương', source: N.quyDinhLuong() },
            { key: 'lbl', type: 'select', label: 'Chọn loại bảng lương', source: loaiBL },
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: donVi },
            { key: 'cb', type: 'select', label: 'Chọn cán bộ' }
        ],
        list: function (f) {
            return {
                strTuKhoa: '', strDaoTao_CoCauToChuc_Id: f.dv, strNhanSu_HoSoCanBo_Id: f.cb,
                strNhanSu_BangQuyDinh_Id: f.qd, strLoaiBangLuong_Id: f.lbl, strLoaiKhongTinhLuong_Id: '',
                strThanhPhan_Id: '', strNam: '', strThang: '', strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Mã cán bộ', prop: 'NHANSU_HOSOCANBO_MA', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc((r.NHANSU_HOSOCANBO_HODEM || '') + ' ' + (r.NHANSU_HOSOCANBO_TEN || '')); } },
            { title: 'Thành phần lương', prop: 'THANHPHAN_TEN' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: '_donVi', label: 'Đơn vị', type: 'select', source: donVi, placeholder: 'Chọn đơn vị', tuLoc: 'dv',
                hint: 'Chỉ để thu hẹp danh sách cán bộ' },
            { key: 'strNhanSu_HoSoCanBo_Id', col: 'NHANSU_HOSOCANBO_ID', label: 'Cán bộ', type: 'select', placeholder: 'Chọn cán bộ' },
            { key: 'strThanhPhan_Id', col: 'THANHPHAN_ID', label: 'Thành phần lương', type: 'select', source: thanhPhan,
                placeholder: 'Chọn thành phần lương', span: true, required: true },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' }
        ],
        sauKhiTao: function (crud) {
            cb = N.ganCanBo(crud);
            /* Ô Thành phần lương của gốc là select multiple — crud chỉ dựng ô chọn một,
               đổi sang chọn nhiều tại đây (Nợ tầng chung: trường chọn nhiều của ums.crud). */
            var el = N.o(crud, 'form', 'strThanhPhan_Id');
            if ($ && el.classList.contains('select2-hidden-accessible')) $(el).select2('destroy');
            el.multiple = true;
            ui.select2(el, { placeholder: 'Chọn thành phần lương' });
            crud.sourcesReady.then(function () {
                var rong = el.querySelector('option[value=""]');
                if (rong) rong.remove();
                if ($) $(el).val([]).trigger('change.select2').trigger('ums:refresh');
            });
        },
        onForm: function (row) { if (cb) cb.moForm(row); },
        save: function (v, row, crud) {
            var el = N.o(crud, 'form', 'strThanhPhan_Id');
            var ds = $ ? ($(el).val() || []) : [el.value];
            ds = ds.filter(Boolean);
            if (!ds.length) { ui.toast('Chọn thành phần lương', 'warn'); return null; }
            var calls = ds.map(function (tp) {
                return {
                    action: row ? 'L_KhongTinh/CapNhat' : 'L_KhongTinh/ThemMoi',
                    strId: row ? row.ID : '', strChucNang_Id: '',
                    strNhanSu_HoSoCanBo_Id: v.strNhanSu_HoSoCanBo_Id, strNhanSu_BangQuyDinh_Id: '',
                    strLoaiBangLuong_Id: tp, strLoaiKhongTinhLuong_Id: '', strThanhPhan_Id: tp,
                    strNam: '', strThang: '', strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay,
                    strGhiChu: '', strNguoiThucHien_Id: ''
                };
            });
            ui.batch(calls, { title: 'Đang lưu', okText: row ? 'Cập nhật thành công' : 'Thêm mới thành công', show: true })
                .then(function (r) { if (r.ok) crud.showList(); crud.load(); });
            return null;          // crud không tự gửi — đã gửi hàng loạt ở trên
        }
    });
})();
