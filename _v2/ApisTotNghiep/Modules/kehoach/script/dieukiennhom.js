/* =========================================================================
   Điều kiện nhóm (Xét tốt nghiệp — nhóm "Thiết lập điều kiện")
   Bản gốc: ApisTotNghiep/Modules/kehoach/html/dieukiennhom.html (1.178 dòng) + script/dieukiennhom.js (4.218 dòng)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT CỘT, ba khung xếp dọc dưới một thanh tìm kiếm chung:
     1. "Danh sách" nhóm điều kiện (phạm vi áp dụng) — ums.crud; cột "Điều kiện áp dụng - xếp loại" → nút
        "Điều kiện xét" mở vùng điều kiện của nhóm thay chỗ cả màn (_tndkn_dieukien.js).
     2. "Xem danh sách các lệnh ĐIỀU KIỆN"  3. "Xem danh sách các lệnh XẾP LOẠI" — _tndkn_lenh.js.
     Thanh tìm kiếm: Phân loại (TN.PHANLOAI) + từ khoá + "Tìm kiếm" (nạp lại khung 1) + hai nút "Xem danh sách các lệnh …"
     (nạp lại khung 2 / 3 theo CÙNG ô từ khoá, như gốc).

   Lời gọi khung 1 (chép nguyên):
     TN_ThamSo_MH/… PKG_TOTNGHIEP_THAMSO.LayDSTN_PhamVi_ApDung   strTuKhoa · strPhanLoai_Id (không phân trang máy chủ)
     PKG_TOTNGHIEP_THAMSO.Them_TN_PhamVi_ApDung | Sua_TN_PhamVi_ApDung (có strId)
         strId · strMa · strTen · strMoTa · strPhanLoai_Id · dHieuLuc
     PKG_TOTNGHIEP_THAMSO.Xoa_TN_PhamVi_ApDung   strId — mỗi dòng đã chọn một lời gọi
     Cột: MA · TEN · PHANLOAI_TEN · HIEULUC ("Hết hiệu lực" khi 0) · MOTA · NGAYTAO_DD_MM_YYYY_HHMMSS · NGUOITAO_TAIKHOAN
     Danh mục: TN.PHANLOAI (ô lọc + ô Phân loại của biểu mẫu).

   Khác gốc:
     · Thêm / sửa nhóm: hộp #myModalDieuKienNhom → biểu mẫu thay chỗ danh sách (ums.crud). Lưu xong về danh sách — gốc để hộp
       mở và không nhận id mới, bấm Lưu lần hai là THÊM TRÙNG nhóm.
     · SỬA nhóm không hiện "Mô tả": gốc đổ vào #txtMoTa trong khi ô thật là #txtMota → ô trống, Lưu là XOÁ mô tả cũ. Nay đổ đúng.
     · "Mã", "Tên" bắt buộc (gốc kiểm #txtDieuKienNhom_So — ô không tồn tại nên không kiểm gì).
     · Ba nút gõ cửa hai khung lệnh nằm trong thanh tìm kiếm như gốc; Enter trong ô từ khoá chỉ nạp lại khung 1 (như gốc).
   Mã chết của gốc, KHÔNG chuyển (không có lối vào trên màn):
     · .btnXacNhan + hộp #modal_XacNhan (getList/save_XacNhanSanPham — Them/LayDSTN_KeHoach_XacNhan): bảng không vẽ nút này;
       dải nút xác nhận đã chú thích bỏ.
     · Kế thừa theo hệ / theo nhóm (#btnAdd_KeThua, #btnAdd_KeThua2, #btnAdd_KeThuaTheoNhom bị chú thích trong html).
     · Cả khối chép từ màn kế hoạch: phân công / thành viên / sinh viên / học phần / quân số theo lớp / hộp chọn sinh viên
       (TN_KeHoach_NhanSu/*, TN_KeHoach_PhamVi/*, TN_KeHoach_HocPhan/*, DKH_Chung/*, KHCT_*, TN_Chung/LayDSPhanLoaiTheoNguoiDung,
       edu.extend.genBoLoc_HeKhoa("_KT")) — không phần tử nào trên màn gọi tới.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('tn-dieukiennhom');
    if (!root) return;
    var ui = ums.ui, N = ums.tndkn, e = N.e;
    var TS = 'TN_ThamSo_MH/', PS = 'PKG_TOTNGHIEP_THAMSO.';

    function hetHieuLuc(r) { return !r.HIEULUC || String(r.HIEULUC) === '0'; }

    var lenh = {};
    var chinh = ums.crud({
        root: root,
        title: 'Điều kiện nhóm',
        formTitle: 'điều kiện nhóm',
        icon: 'fa-layer-group',
        filters: [
            { key: 'pl', type: 'select', label: 'Chọn phân loại', source: { dm: 'TN.PHANLOAI' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return {
                    action: TS + 'DSA4BRIVDx4RKSAsFygeADEFNC8m', func: PS + 'LayDSTN_PhamVi_ApDung',
                    strTuKhoa: f.q, strPhanLoai_Id: f.pl, strNguoiThucHien_Id: ''
                };
            }
        },
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN', cls: 'tndkn-dai' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
            { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: function (r) {
                return hetHieuLuc(r) ? ui.badge('Hết hiệu lực', 'bad') : '';
            } },
            { title: 'Điều kiện áp dụng - xếp loại', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('view', { text: 'Điều kiện xét', cls: 'ums-btn--sm', attr: { 'data-tndkn-dkx': e(r.ID), title: 'Chi tiết' } });
            } },
            { title: 'Mô tả', prop: 'MOTA', cls: 'tndkn-dai' },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-nowrap' }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', source: { dm: 'TN.PHANLOAI' } },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] }, placeholder: 'Chọn hiệu lực' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }
        ],
        save: function (v, row) {
            return {
                action: TS + (row ? 'EjQgHhUPHhEpICwXKB4AMQU0LyYP' : 'FSkkLB4VDx4RKSAsFygeADEFNC8m'),
                func: PS + (row ? 'Sua_TN_PhamVi_ApDung' : 'Them_TN_PhamVi_ApDung'),
                strId: row ? row.ID : undefined,          // gốc: me.strDieuKienNhom_Id = undefined khi thêm
                strMa: v.strMa, strTen: v.strTen, strMoTa: v.strMoTa,
                strPhanLoai_Id: v.strPhanLoai_Id, dHieuLuc: v.dHieuLuc, strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: TS + 'GS4gHhUPHhEpICwXKB4AMQU0LyYP', func: PS + 'Xoa_TN_PhamVi_ApDung', strId: id, strNguoiThucHien_Id: '' };
            });
        }
    });

    /* Hai nút "Xem danh sách các lệnh …" đứng cạnh "Tìm kiếm" trong thanh tìm kiếm (như gốc) */
    var nutTim = root.querySelector('[data-c="' + chinh.uid + ':search"]');
    if (nutTim && nutTim.parentNode) {
        nutTim.parentNode.insertAdjacentHTML('afterend',
            '<div class="ums-field ums-field--fit">' +
                ui.btn('search', { text: 'Xem danh sách các lệnh ĐIỀU KIỆN', mod: 'out-primary', attr: { 'data-tndkn-xem': 'dk' } }) + '</div>' +
            '<div class="ums-field ums-field--fit">' +
                ui.btn('search', { text: 'Xem danh sách các lệnh XẾP LOẠI', mod: 'out-primary', attr: { 'data-tndkn-xem': 'xl' } }) + '</div>');
    }

    /* Hai khung lệnh nằm TRONG vùng danh sách của crud → biểu mẫu nhóm mở là chúng ẩn theo, đóng là hiện lại */
    var vung = chinh.z('list');
    vung.insertAdjacentHTML('beforeend', '<div class="ums-u-mt-4" data-tndkn-lenh="dk"></div><div class="ums-u-mt-4" data-tndkn-lenh="xl"></div>');
    ['dk', 'xl'].forEach(function (loai) {
        lenh[loai] = N.lenh(vung.querySelector('[data-tndkn-lenh="' + loai + '"]'), {
            loai: loai, man: root,
            tuKhoa: function () { return chinh.filterValues().q || ''; },
            phanLoai: function () { return chinh.filterValues().pl || ''; }
        });
    });

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('.ums-formtrang')) return;          // nút của màn con (điều kiện xét / tham số) không thuộc màn chính
        var x = ev.target.closest('[data-tndkn-xem]');
        if (x) { lenh[x.getAttribute('data-tndkn-xem')].load(1); return; }
        var b = ev.target.closest('[data-tndkn-dkx]');
        if (!b) return;
        var id = b.getAttribute('data-tndkn-dkx');
        var r = chinh.rows.filter(function (y) { return e(y.ID) === id; })[0];
        if (!r) return;
        // Đóng vùng điều kiện thì nạp lại danh sách nhóm (toggle_form của gốc)
        N.dieuKien(root, r, { onClose: function () { chinh.load(); } });
    });
})();
