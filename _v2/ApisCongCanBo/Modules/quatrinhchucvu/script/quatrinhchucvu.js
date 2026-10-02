/* =========================================================================
   Quá trình chức vụ — hồ sơ cá nhân của cán bộ đang đăng nhập
   Bản gốc: ApisCongCanBo/Modules/quatrinhchucvu/script/quatrinhchucvu.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_ChucVu/LayDanhSach   GET   iTrangThai 1, strNhanSu_HoSoCanBo_Id = userId
       NS_QT_ChucVu/LayChiTiet    GET   strId
       NS_QT_ChucVu/ThemMoi | CapNhat   (cùng bộ tham số, CapNhat thêm strId)
       NS_QT_ChucVu/Xoa                 strIds
   Sau khi THÊM: edu.extend.ThietLapQuaTrinhCuoiCung(…, "NHANSU_QT_CHUVU")
       → ums.ref.quaTrinhCuoiCung. Tệp đính kèm lưu vào NS_Files (cả thêm lẫn sửa).
   Danh mục: NS.QUDI (loại quyết định), NS.DMCV (chức vụ cũ + mới),
       cơ cấu tổ chức (đơn vị cũ + mới) — edu.system.getList_CoCauToChuc.

   Khác bản gốc:
     · Ô bắt buộc: bản gốc khai sáu ô, ba ô không tồn tại (dropChucVu,
       txtNgayKy, txtNgayHieuLuc) nên thực tế chỉ bắt ba ô có dấu (*):
       Loại quyết định, Số quyết định, Ngày bắt đầu — ở đây bắt đúng ba ô đó.
     · So ngày: bản gốc đọc txtNgayKetThuc (không tồn tại) nên phép kiểm
       "ngày bắt đầu không được lớn hơn ngày kết thúc" không bao giờ chạy.
       Ở đây so với ô thật "Ngày kết thúc nhiệm kỳ", đúng câu báo của bản gốc.
     · page_load nạp năm ô chọn không có trên màn (dropSearch_*, dropTSBT_*,
       dropNS_CoCauToChuc) — bỏ.

   DÙNG LẠI ở bản quản trị của Nhân sự (ApisNhanSu/Modules/quatrinh/chucvu — cán bộ
   nhân sự chọn một người rồi xem/sửa): ums.ccbQtChucVu.mount(root, { nhanSuId, embedded }).
     nhanSuId()  → id hồ sơ đang xem (strNhanSu_HoSoCanBo_Id); mặc định = người đăng nhập.
     embedded    → khung lồng (không vẽ đầu trang); listTitle → tên khung danh sách.
   Mặc định giữ nguyên hành vi Cổng cán bộ: tự dựng vào #quatrinhchucvu nếu có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }

    /* dd/mm/yyyy → số so sánh được; ô trống → null */
    function ngay(s) {
        var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim());
        return m ? Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]) : null;
    }

    var CCTC = { call: {
        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P',
        func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
    }, name: 'TEN' };
    var CHUCVU = { dm: 'NS.DMCV' };

    function mount(root, o) {
        o = o || {};
        function ns() { return o.nhanSuId ? o.nhanSuId() : uid(); }
        return ums.crud({
            root: root,
            embedded: !!o.embedded,
            title: 'Quá trình chức vụ',
            listTitle: o.listTitle || 'Tóm tắt quá trình chức vụ',
            formTitle: 'quá trình chức vụ',
            icon: 'fa-id-badge',
            saveAgain: true,

            list: {
                call: function () {
                    return {
                        action: 'NS_QT_ChucVu/LayDanhSach',
                        method: 'GET',
                        iTrangThai: 1,
                        strNhanSu_HoSoCanBo_Id: ns()
                    };
                }
            },

            columns: [
                { title: 'Tên chức vụ', prop: 'CHUCVU_TEN' },
                { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                { title: 'Hệ số', prop: 'HESO', cls: 'is-center' },
                { title: 'Số QĐ bổ nhiệm', prop: 'NHANSU_TTQUYETDINH_SOQD', cls: 'is-center' },
                { title: 'Ngày quyết định', prop: 'NHANSU_TTQUYETDINH_NGAYQD', cls: 'is-center is-nowrap' },
                { title: 'Ngày bắt đầu áp dụng', prop: 'NHANSU_TTQUYETDINH_NGAYAD', cls: 'is-center is-nowrap' },
                { title: 'Ngày kết thúc nhiệm kỳ', prop: 'NHANSU_TTQUYETDINH_NGAYHHL', cls: 'is-center is-nowrap' }
            ],

            detail: function (row) {
                return { action: 'NS_QT_ChucVu/LayChiTiet', method: 'GET', strId: row.ID };
            },

            fields: [
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select',
                  source: { dm: 'NS.QUDI' }, required: true, span: true },
                { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định', required: true },
                { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date' },
                { key: 'strNgayBatDauApDung', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày bắt đầu', type: 'date', required: true },
                { key: 'strNgayKetThucNhiemKy', col: 'NHANSU_TTQUYETDINH_NGAYHHL', label: 'Ngày kết thúc nhiệm kỳ', type: 'date' },
                { key: 'dHeSo', col: 'HESO', label: 'Hệ số', type: 'number' },
                { key: '_trong', type: 'gap' },
                { key: 'strChucVu_Cu_Id', col: 'CHUCVU_CU_ID', label: 'Chức vụ cũ', type: 'select', source: CHUCVU },
                { key: 'strChucVu_Id', col: 'CHUCVU_ID', label: 'Chức vụ mới', type: 'select', source: CHUCVU },
                { key: 'strDaoTao_CoCauToChuc_Cu_Id', col: 'DAOTAO_COCAUTOCHUC_CU_ID', label: 'Đơn vị cũ', type: 'select', source: CCTC },
                { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Đơn vị mới', type: 'select', source: CCTC },
                { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', type: 'textarea', span: true },
                { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' },
                // txtQuyetDinh_ID của bản gốc: ô ẩn giữ id thông tin quyết định khi sửa
                { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' }
            ],

            save: function (v, row) {
                var bd = ngay(v.strNgayBatDauApDung), kt = ngay(v.strNgayKetThucNhiemKy);
                if (bd !== null && kt !== null && bd > kt) {
                    ui.toast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warn');
                    return null;
                }
                return {
                    action: row ? 'NS_QT_ChucVu/CapNhat' : 'NS_QT_ChucVu/ThemMoi',
                    strId: row ? row.ID : '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayHieuLuc: v.strNgayBatDauApDung,          // bản gốc gửi ngày bắt đầu vào cả hai
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strChucVu_Id: v.strChucVu_Id,
                    strChucVu_Cu_Id: v.strChucVu_Cu_Id,
                    dHeSo: v.dHeSo,
                    strNgayBatDauApDung: v.strNgayBatDauApDung,
                    strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                    strDaoTao_CoCauToChuc_Id: v.strDaoTao_CoCauToChuc_Id,
                    strDaoTao_CoCauToChuc_Cu_Id: v.strDaoTao_CoCauToChuc_Cu_Id,
                    strThongTinDinhKem: '',
                    strNgayKetThucNhiemKy: v.strNgayKetThucNhiemKy,
                    strGhiChu: v.strGhiChu,
                    iTrangThai: 1,
                    iThuTu: 0,
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strNguoiThucHien_Id: uid()
                };
            },

            onSaved: function (crud, result, isEdit) {
                if (!isEdit) ums.ref.quaTrinhCuoiCung('NHANSU_QT_CHUVU');
            },

            remove: function (ids) {
                return ids.map(function (id) { return { action: 'NS_QT_ChucVu/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; });
            }
        });
    }

    ums.ccbQtChucVu = { mount: mount };
    var goc = document.getElementById('quatrinhchucvu');
    if (goc) mount(goc);
})();
