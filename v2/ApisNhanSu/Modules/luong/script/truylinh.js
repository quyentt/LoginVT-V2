/* =========================================================================
   Truy lĩnh
   Bản gốc: ApisNhanSu/Modules/luong/script/truylinh.js
   ---------------------------------------------------------------------------
   MỘT CỘT như bản gốc: thanh lọc + "Danh sách khoản truy lĩnh" (Thêm mới, Xoá
   nhiều dòng, Sửa từng dòng). Biểu mẫu THÊM hai cột (col-sm-6 | col-sm-6 gốc):
   thông tin chung | "Danh sách nhân sự kèm theo" (chọn giảng viên, mỗi người
   một ô Số tiền, dòng "Tổng tiền"); biểu mẫu SỬA một dòng.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_TruyLinh/LayDanhSach   GET  strTuKhoa, strDaoTao_CoCauToChuc_Id, strNgayPhatSinh_TuNgay,
                                     strNgayPhatSinh_DenNgay, strNhanSu_HoSoCanBo_Id (ô Thành viên),
                                     strNguoiTao_Id '', pageIndex, pageSize
       L_TruyLinh/LayChiTiet    GET  strId (mở sửa)
       L_TruyLinh/ThemMoi       POST MỖI nhân sự một lời gọi: strId '', dNam '', dThang '' (ô
                                     txtNam / txtThang không có trên màn), strSoTien (ô của người đó,
                                     bỏ dấu phẩy), strChungTu, strNgayPhatSinh, strMoTa, strLoaiKhoan_Id,
                                     strNhanSu_HoSoCanBo_Id
       L_TruyLinh/CapNhat       POST strId, dNam '', dThang '', strSoTien, strChungTu, strNgayPhatSinh,
                                     strMoTa, strLoaiKhoan_Id, strNhanSu_HoSoCanBo_Id (của dòng)
       L_TruyLinh/Xoa           POST strIds, strNguoiThucHien_Id
   Ô lọc: Đơn vị (getList_CoCauToChuc) → Thành viên (NS_HoSoV2/LayDanhSach GET, dLaCanBoNgoaiTruong 0).
   Danh mục: NHANSU.LOAIKHOAN.

   Lỗi gốc đã sửa theo ý định:
     · Sửa gửi strId = me.strIds (biến KHÔNG tồn tại → undefined): CapNhat chưa bao
       giờ nhắm đúng dòng. Nay gửi ID dòng đang sửa.
     · Xoá nhiều: gốc gọi Xoa song song rồi nạp lại sau 1 giây (hên xui) — nay chạy
       hàng loạt có tiến độ, xong mới nạp lại.
   Khác bản gốc (luật chung): Thành viên KHOÁ tới khi chọn Đơn vị (gốc nạp sẵn toàn
   bộ nhân sự). Lưu biểu mẫu thêm khi chưa chọn nhân sự thì báo (gốc im lặng).
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui, pat = ums.pat;
    var C = 'L_TruyLinh';
    var uid = L.uid;
    var luoi = null;

    var crud = ums.crud({
        root: document.getElementById('truylinh'),
        title: 'Truy lĩnh',
        listTitle: 'Danh sách khoản truy lĩnh',
        formTitle: 'khoản truy lĩnh',
        icon: 'fa-money-bill-transfer',

        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị' },
            { key: 'tv', type: 'select', label: 'Chọn thành viên' },
            { key: 'tuNgay', type: 'text', label: 'Tìm kiếm từ ngày' },
            { key: 'denNgay', type: 'text', label: 'Tìm kiếm đến ngày' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strDaoTao_CoCauToChuc_Id: f.dv,
                    strNgayPhatSinh_TuNgay: f.tuNgay, strNgayPhatSinh_DenNgay: f.denNgay, strNhanSu_HoSoCanBo_Id: f.tv, strNguoiTao_Id: '' };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        columns: [
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
            { title: 'Họ tên', render: function (r) { return ui.esc(L.hoTen(r)); } },
            { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
            { title: 'Chứng từ', prop: 'CHUNGTU', cls: 'is-center' },
            { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN); } },
            { title: 'Nội dung', prop: 'MOTA' },
            { title: 'Khoản được nhận', prop: 'LOAIKHOAN_TEN', cls: 'is-center' }
        ],

        fields: [
            { key: '_canBo', label: 'Cán bộ', type: 'static', span: true, get: function (r) { return L.hoTen(r) + ' - Mã cán bộ: ' + L.e(r.NHANSU_HOSOCANBO_MASO); } },
            { key: 'strLoaiKhoan_Id', col: 'LOAIKHOAN_ID', label: 'Loại khoản', type: 'select', source: { dm: 'NHANSU.LOAIKHOAN' }, placeholder: '-- Chọn loại khoản --' },
            { key: 'strSoTien', col: 'SOTIEN', label: 'Số tiền', get: function (r) { return pat.money(r.SOTIEN); } },
            { key: 'strChungTu', col: 'CHUNGTU', label: 'Chứng từ' },
            { key: 'strNgayPhatSinh', col: 'NGAYPHATSINH', label: 'Ngày phát sinh', type: 'date' },
            { key: 'strMoTa', col: 'MOTA', label: 'Nội dung', span: true }
        ],

        onForm: function (row, c) {
            L.tienForm(c, ['strSoTien']);
            luoi = L.formNhanSu(c, row, {
                hai: 6, chiSua: ['_canBo'],
                title: 'Danh sách nhân sự kèm theo', chon: 'Chọn giảng viên', tong: 'tien',
                ghiChu: 'Chú ý: Nhập đầy đủ thông tin bên trên. Sau đó chọn nhân sự',
                cot: [{ key: 'tien', title: 'Số tiền', kieu: 'tien', width: '200px',
                        macDinh: function () { var el = L.oForm(c, 'strSoTien'); return el ? el.value : ''; } }]
            });
        },

        save: function (v, row, c) {
            if (row) {
                return {
                    action: C + '/CapNhat', strId: row.ID, dNam: '', dThang: '',
                    strSoTien: pat.num(v.strSoTien), strChungTu: v.strChungTu, strNgayPhatSinh: v.strNgayPhatSinh,
                    strMoTa: v.strMoTa, strLoaiKhoan_Id: v.strLoaiKhoan_Id,
                    strNhanSu_HoSoCanBo_Id: row.NHANSU_HOSOCANBO_ID, strNguoiThucHien_Id: uid()
                };
            }
            var ds = luoi ? luoi.ds() : [];
            if (!ds.length) { ui.toast('Nhập đầy đủ thông tin bên trên. Sau đó chọn nhân sự', 'warn'); return null; }
            ui.batch(ds.map(function (x) {
                return {
                    action: C + '/ThemMoi', strId: '', dNam: '', dThang: '',
                    strSoTien: pat.num(x.v.tien), strChungTu: v.strChungTu, strNgayPhatSinh: v.strNgayPhatSinh,
                    strMoTa: v.strMoTa, strLoaiKhoan_Id: v.strLoaiKhoan_Id,
                    strNhanSu_HoSoCanBo_Id: x.ns.ID, strNguoiThucHien_Id: uid()
                };
            }), { title: 'Thêm khoản truy lĩnh' }).then(function (r) {
                if (r.ok) { c.showList(); c.load(); }
            });
            return null;
        },

        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });

    L.ngayLoc(crud, ['tuNgay', 'denNgay']);
    L.donViThanhVien(L.oLoc(crud, 'dv'), L.oLoc(crud, 'tv'), { la: 0 });
})();
