/* =========================================================================
   Xử lý biệt lệ (lương)
   Bản gốc: ApisNhanSu/Modules/heso/html/xulybietle.html + script/xulybietle.js
   ---------------------------------------------------------------------------
   Một cột như gốc: lọc Quy định lương · Loại bảng lương · Tháng · Năm · Đơn vị → Cán bộ ·
   Loại xử lý · Thành phần lương → Danh sách (Mã cán bộ · Họ tên · Năm · Tháng · Loại xử lý
   biệt lệ · Thành phần lương) với Kế thừa · Thêm mới · Xóa → biểu mẫu Đơn vị · Cán bộ ·
   Loại xử lý · Thành phần lương · Năm · Tháng. Khung chung: ums.nsHeSo.man + N.ganCanBo.

   Lời gọi (chép nguyên):
       L_XuLyBietLe/LayDanhSach GET — strTuKhoa '' (gốc đọc txtAAAA), strDaoTao_CoCauToChuc_Id,
           strNhanSu_HoSoCanBo_Id, strNhanSu_BangQuyDinh_Id, strLoaiBangLuong_Id,
           strLoaiXuLyBietLe_Id, strThanhPhan_Id, strNam, strThang, strNguoiTao_Id '', pageIndex, pageSize
       L_XuLyBietLe/ThemMoi | CapNhat POST — strId, strChucNang_Id, strNhanSu_HoSoCanBo_Id,
           strNhanSu_BangQuyDinh_Id '' (dropAAAA), strLoaiBangLuong_Id (= ô Thành phần lương, như gốc),
           strLoaiXuLyBietLe_Id, strThanhPhan_Id, strNam, strThang, strGhiChu '', strNguoiThucHien_Id
       L_XuLyBietLe/Xoa POST — strIds (từng dòng), strChucNang_Id, strNguoiThucHien_Id
       Kế thừa: L_XuLyBietLe/ThemMoi cho MỖI dòng đánh dấu × MỖI tháng chọn — cán bộ / loại xử lý /
           thành phần lấy từ dòng, strNam = ô "Nhập năm" của hộp, strThang = tháng.
       L_BangQuyDinhLuong/LayDanhSach GET (MUCLUONGCOBAN) · NS_HoSoV2/LayDanhSach GET (cán bộ theo đơn vị)
   Danh mục: "NHANSU.LUONG,LOAIXULYBIETLE" (chép nguyên — mã có DẤU PHẨY, nghi gõ sai),
   NHANSU.THANHPHANLUONG, NHANSU.LOAIBANGLUONG.
   Thêm mới điền sẵn Đơn vị / Cán bộ / Loại xử lý / Thành phần lương từ ô lọc (resetPopup gốc).

   Lỗi gốc đã sửa:
     · Kế thừa gửi strId = id dòng vừa MỞ SỬA gần nhất (me.strXuLyBietLe_Id không được xoá sau
       khi sửa) → ThemMoi mang strId cũ. Nay luôn strId rỗng (đúng ý "thêm mới").
     · Đơn vị lọc / Đơn vị biểu mẫu cùng đổ vào HAI ô Cán bộ — nay tách riêng (xem N.ganCanBo).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nsHeSo, ui = ums.ui, esc = ui.esc;
    var loaiXL = N.dm('NHANSU.LUONG,LOAIXULYBIETLE'), thanhPhan = N.dm('NHANSU.THANHPHANLUONG'),
        loaiBL = N.dm('NHANSU.LOAIBANGLUONG'), donVi = N.donVi(), cb = null;

    N.man('ns-xulybietle', {
        ctl: 'L_XuLyBietLe',
        title: 'Xử lý biệt lệ',
        filters: [
            { key: 'qd', type: 'select', label: 'Chọn quy định lương', source: N.quyDinhLuong() },
            { key: 'lbl', type: 'select', label: 'Chọn loại bảng lương', source: loaiBL },
            { key: 'thang', label: 'Tháng' },
            { key: 'nam', label: 'Năm' },
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: donVi },
            { key: 'cb', type: 'select', label: 'Chọn cán bộ' },
            { key: 'lxl', type: 'select', label: 'Chọn loại xử lý', source: loaiXL },
            { key: 'tp', type: 'select', label: 'Chọn thành phần lương', source: thanhPhan }
        ],
        list: function (f) {
            return {
                strTuKhoa: '', strDaoTao_CoCauToChuc_Id: f.dv, strNhanSu_HoSoCanBo_Id: f.cb,
                strNhanSu_BangQuyDinh_Id: f.qd, strLoaiBangLuong_Id: f.lbl, strLoaiXuLyBietLe_Id: f.lxl,
                strThanhPhan_Id: f.tp, strNam: f.nam, strThang: f.thang, strNguoiTao_Id: ''
            };
        },
        columns: [
            { title: 'Mã cán bộ', prop: 'NHANSU_HOSOCANBO_MA', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc((r.NHANSU_HOSOCANBO_HODEM || '') + ' ' + (r.NHANSU_HOSOCANBO_TEN || '')); } },
            { title: 'Năm', prop: 'NAM', cls: 'is-center' },
            { title: 'Tháng', prop: 'THANG', cls: 'is-center' },
            { title: 'Loại xử lý biệt lệ', prop: 'LOAIXULYBIETLE_TEN' },
            { title: 'Thành phần lương', prop: 'THANHPHAN_TEN' }
        ],
        fields: [
            { key: '_donVi', label: 'Đơn vị', type: 'select', source: donVi, placeholder: 'Chọn đơn vị', tuLoc: 'dv',
                hint: 'Chỉ để thu hẹp danh sách cán bộ' },
            { key: 'strNhanSu_HoSoCanBo_Id', col: 'NHANSU_HOSOCANBO_ID', label: 'Cán bộ', type: 'select', placeholder: 'Chọn cán bộ' },
            { key: 'strLoaiXuLyBietLe_Id', col: 'LOAIXULYBIETLE_ID', label: 'Loại xử lý', type: 'select', source: loaiXL, placeholder: 'Chọn loại xử lý', tuLoc: 'lxl' },
            { key: 'strThanhPhan_Id', col: 'THANHPHAN_ID', label: 'Thành phần lương', type: 'select', source: thanhPhan, placeholder: 'Chọn thành phần lương', tuLoc: 'tp' },
            { key: 'strNam', col: 'NAM', label: 'Năm', type: 'number' },
            { key: 'strThang', col: 'THANG', label: 'Tháng', type: 'number' }
        ],
        toolbar: [{ text: 'Kế thừa', icon: 'fa-copy', onClick: keThua }],
        sauKhiTao: function (crud) { cb = N.ganCanBo(crud); },
        onForm: function (row) { if (cb) cb.moForm(row); },
        save: function (v) {
            return {
                strNhanSu_HoSoCanBo_Id: v.strNhanSu_HoSoCanBo_Id, strNhanSu_BangQuyDinh_Id: '',
                strLoaiBangLuong_Id: v.strThanhPhan_Id, strLoaiXuLyBietLe_Id: v.strLoaiXuLyBietLe_Id,
                strThanhPhan_Id: v.strThanhPhan_Id, strNam: v.strNam, strThang: v.strThang, strGhiChu: ''
            };
        }
    });

    /* btnKeThua — hộp "Nhập năm" + "Chọn tháng kế thừa" (chọn nhiều 1..12) */
    function keThua(crud) {
        var rows = crud.pickedRows();
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var thang = '';
        for (var i = 1; i <= 12; i++) thang += '<option value="' + i + '">' + i + '</option>';
        var dlg = ui.dialog({
            title: 'Kế thừa xử lý biệt lệ', icon: 'fa-copy', size: 'sm',
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-3">Kế thừa ' + rows.length + ' dòng đã chọn sang năm / tháng dưới đây.</div>' +
                ui.field('Nhập năm', '<input class="ums-input" data-k="nam" inputmode="numeric" autocomplete="off" value="' +
                    esc(crud.filterValues().nam || '') + '">') +
                ui.field('Chọn tháng kế thừa', '<select class="ums-select" data-k="thang" multiple data-ph="Chọn tháng">' + thang + '</select>'),
            buttons: [{
                text: 'Kế thừa', kind: 'confirm', icon: 'fa-copy',
                onClick: function (d) {
                    var nam = d.body.querySelector('[data-k="nam"]').value.trim();
                    var ds = window.jQuery ? (jQuery(d.body.querySelector('[data-k="thang"]')).val() || []) : [];
                    if (!ds.length) { ui.toast('Chọn tháng kế thừa', 'warn'); return false; }
                    var calls = [];
                    rows.forEach(function (r) {
                        ds.forEach(function (t) {
                            calls.push({
                                action: 'L_XuLyBietLe/ThemMoi', strId: '', strChucNang_Id: '',
                                strNhanSu_HoSoCanBo_Id: r.NHANSU_HOSOCANBO_ID, strNhanSu_BangQuyDinh_Id: '',
                                strLoaiBangLuong_Id: r.THANHPHAN_ID, strLoaiXuLyBietLe_Id: r.LOAIXULYBIETLE_ID,
                                strThanhPhan_Id: r.THANHPHAN_ID, strNam: nam, strThang: t, strGhiChu: '',
                                strNguoiThucHien_Id: ''
                            });
                        });
                    });
                    ui.batch(calls, { title: 'Đang kế thừa', okText: 'Kế thừa thành công', show: true })
                        .then(function () { crud.load(); });
                }
            }]
        });
        ui.enhance(dlg.body);
    }
})();
