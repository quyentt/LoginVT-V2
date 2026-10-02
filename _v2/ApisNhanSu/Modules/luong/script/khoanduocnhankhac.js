/* =========================================================================
   Khoản được nhận khác — các khoản thu nhập khác của từng cán bộ
   Bản gốc: ApisNhanSu/Modules/luong/script/khoanduocnhankhac.js
   Hai cột như gốc: trái = "Danh sách cán bộ" (ums.luongA.dsCanBo — getList_NhanSu, thêm
   hai ô ngày phát sinh của khung tìm kiếm gốc), phải = khoản của cán bộ đang chọn
   (ums.crud nhúng, biểu mẫu thay chỗ bảng).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_DuocNhan/LayDanhSach   GET  strTuKhoa (ô từ khoá cột trái), strDaoTao_CoCauToChuc_Id (ô Khoa),
                                     strNgayPhatSinh_TuNgay / _DenNgay, strNhanSu_HoSoCanBo_Id,
                                     strNguoiTao_Id '', pageIndex, pageSize
       L_DuocNhan/LayChiTiet    GET  strId
       L_DuocNhan/ThemMoi | CapNhat  strId, dNam '', dThang '' (ô txtNam/txtThang không có trên màn gốc),
                                     strSoTien, strChungTu, strNgayPhatSinh, strLoaiKhoan_Id,
                                     strNhanSu_HoSoCanBo_Id, strNguoiThucHien_Id
       L_DuocNhan/Xoa           strIds
   Danh mục: NHANSU.LOAIKHOAN.
   Giữ như gốc: cột "Nội dung" đọc CHUNGTU (trùng cột Chứng từ — biểu mẫu không có ô nội dung);
   Enter ở ô ngày phát sinh nạp lại danh sách bên phải.
   Khác gốc: bỏ dải tab một tab; phân trang đầy đủ; đổi ô ngày thì bấm Tìm kiếm cũng nạp lại
   danh sách bên phải (gốc chỉ Enter).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, A = ums.luongA;
    var root = document.getElementById('khoanduocnhankhac');
    if (!root) return;
    function esc(s) { return ui.esc(s); }
    var e = A.e;
    var C = 'L_DuocNhan';
    var canBo = null, crud = null;

    var ds = A.dsCanBo({
        root: root,
        tieuDe: 'Khoản được nhận khác',
        locThem:
            '<div class="ums-field"><input class="ums-input" data-f="tuNgay" data-date placeholder="Nhập ngày bắt đầu" autocomplete="off"></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="denNgay" data-date placeholder="Nhập ngày kết thúc" autocomplete="off"></div>',
        nhac: 'Chọn một cán bộ ở danh sách bên trái để xem các khoản được nhận khác',
        onPick: function (r) { canBo = r; dung(); }
    });
    ui.enhance(root);

    function dung() {
        ds.m.mainBody.innerHTML = '';
        crud = ums.crud({
            root: ds.m.mainBody,
            embedded: true,
            title: 'Khoản được nhận khác — ' + e(canBo.HOTEN || (e(canBo.HODEM) + ' ' + e(canBo.TEN))) + ' - Mã cán bộ: ' + e(canBo.MASO),
            formTitle: 'khoản được nhận khác',
            icon: 'fa-hand-holding-dollar',
            formCols: 1,
            saveAgain: 'Lưu và nhập tiếp',
            pageSize: 10,
            multi: false,
            list: {
                paged: true,
                call: function () {
                    return {
                        action: C + '/LayDanhSach', method: 'GET',
                        strTuKhoa: ds.m.search.value.trim(),
                        strDaoTao_CoCauToChuc_Id: ds.loc('khoa').value,
                        strNgayPhatSinh_TuNgay: ds.loc('tuNgay').value.trim(),
                        strNgayPhatSinh_DenNgay: ds.loc('denNgay').value.trim(),
                        strNhanSu_HoSoCanBo_Id: canBo.ID,
                        strNguoiTao_Id: ''
                    };
                }
            },
            detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },
            columns: [
                { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
                { title: 'Họ tên', cls: 'is-center', render: function (r) { return esc(e(r.HODEM) + ' ' + e(r.TEN)); } },
                { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE', cls: 'is-center' },
                { title: 'Chứng từ', prop: 'CHUNGTU' },
                { title: 'Số tiền', cls: 'is-right', render: function (r) { return r.SOTIEN === null || r.SOTIEN === undefined || r.SOTIEN === '' ? '' : ui.money(r.SOTIEN); } },
                { title: 'Nội dung', prop: 'CHUNGTU' },
                { title: 'Khoản được nhận', prop: 'LOAIKHOAN_TEN' },
                { title: 'Ngày phát sinh', prop: 'NGAYPHATSINH', cls: 'is-center', width: '120px' }
            ],
            fields: [
                { key: 'strLoaiKhoan_Id', col: 'LOAIKHOAN_ID', label: 'Loại khoản', type: 'select', source: { dm: 'NHANSU.LOAIKHOAN' }, placeholder: '-- Chọn loại khoản --' },
                { key: 'strSoTien', col: 'SOTIEN', label: 'Số tiền' },
                { key: 'strChungTu', col: 'CHUNGTU', label: 'Chứng từ' },
                { key: 'strNgayPhatSinh', col: 'NGAYPHATSINH', label: 'Ngày phát sinh', type: 'date' }
            ],
            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    dNam: '',
                    dThang: '',
                    strSoTien: v.strSoTien,
                    strChungTu: v.strChungTu,
                    strNgayPhatSinh: v.strNgayPhatSinh,
                    strLoaiKhoan_Id: v.strLoaiKhoan_Id,
                    strNhanSu_HoSoCanBo_Id: canBo.ID,
                    strNguoiThucHien_Id: A.uid()
                };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: A.uid() }; }); }
        });
    }

    /* Enter ở ô ngày phát sinh = nạp lại danh sách bên phải (gốc); nút Tìm kiếm của cột trái cũng vậy */
    root.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter' || !ev.target.matches || !ev.target.matches('[data-f="tuNgay"], [data-f="denNgay"]')) return;
        ev.preventDefault();
        if (crud) crud.load(1);
    });
    root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="timCB"]') && crud) crud.load(1); });
})();
