/* =========================================================================
   Quản lý số vào sổ (văn bằng tốt nghiệp)
   Bản gốc: ApisTotNghiep/Modules/kehoach/html/quanlysovaso.html + script/quanlysovaso.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): thanh tìm kiếm (Quy tắc sinh số · Năm thực hiện · Thông tin tìm kiếm · Xem)
   → khung "Danh sách số vào sổ (n)" (Thêm mới) với bảng STT · Chỉ số · Số vào sổ · Quy tắc · Ngày thực hiện ·
   Năm · Tự động · Tình trạng sử dụng · Chi tiết · Thao tác. Hộp "Thêm mới / Sửa thủ công" → ở đây là biểu mẫu
   của ums.crud THAY CHỖ danh sách (BO-CUC luật 1); hộp "Chi tiết số vào sổ" (chỉ xem) giữ hộp thoại.

   Lời gọi (chép nguyên, mọi lời gọi POST, có func nên tự kèm iM):
       Quy tắc: TN_VanBang_ChungChi_Chung_MH/DSA4BRIVDx4QNDgVICISKC8pHhIuFyAuEi4eACUP
                · PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad (strNguoiThucHien_Id) → ID / TEN
       Danh sách: TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0Hg0gOAUgLykSICIp · PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_LayDanhSach
                strTN_HeThongChungTu_Ad_Id, strNamThucHien, strSoChungTu, strNguoiThucHien_Id, pageIndex, pageSize
                → CHISO, SOCHUNGTU, HETHONGCHUNGTU_MA, NGAYTHUCHIEN, NAMTHUCHIEN, IS_NHAP_THUCONG, DA_SU_DUNG
       Chi tiết / mở Sửa: TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0Hg0gOBUpJC4IJQPP · PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_LayTheoId (strId)
       Thêm: TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0HhUpJCwMLigeFSk0Ai4vJgPP · PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_ThemMoi_ThuCong
       Sửa:  TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0HhI0IB4VKTQCLi8m · PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_Sua_ThuCong
                strId, strSoChungTu, dChiSo, strTN_HeThongChungTu_Ad_Id, strNamThucHien, strNguoiThucHien_Id
                (ô Quy tắc đọc HETHONGCHUNGTU_AD_ID, không có thì TN_HETHONGCHUNGTU_AD_ID — như gốc)
       Xoá: TN_VanBang_ChungChi_Chung_MH/Ei4CKTQvJhU0HhkuIB4VKTQCLi8m · PKG_VANBANG_CHUNGCHI_CHUNG.SoChungTu_Xoa_ThuCong (strId)
   Sửa / Xoá chỉ có ở dòng NHẬP THỦ CÔNG (IS_NHAP_THUCONG = 1) — dòng tự động hiện "-" như gốc.

   Khác gốc:
     · Bốn ô của biểu mẫu bắt buộc (gốc báo "Vui lòng nhập đầy đủ thông tin." khi thiếu một ô) — ums.crud tự báo.
     · Mở màn là tải danh sách, đổi ô lọc là tải lại (gốc chỉ tải khi bấm "Xem") — khuôn chung của ums.crud.
     · Lỗi gốc: renderDetail_SoVaoSo gọi this.getNhapThuCongLabel trong $.each — `this` là giá trị ô nên có cột
       IS_NHAP_THUCONG / DA_SU_DUNG là TypeError, hộp chi tiết không mở. Bản mới đổi đúng sang chữ.
     · Hộp "Chi tiết" liệt kê mọi cột máy chủ trả (như gốc), dạng khối "nhãn : giá trị".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, esc = ui.esc;
    var root = document.getElementById('tn-quanlysovaso');
    if (!root) return;

    var A = 'TN_VanBang_ChungChi_Chung_MH/', P = 'PKG_VANBANG_CHUNGCHI_CHUNG.';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function thuCong(r) { return String(r.IS_NHAP_THUCONG) === '1'; }
    function nhanThuCong(v) { return String(v) === '1' ? 'Thủ công' : 'Tự động'; }
    function nhanSuDung(v) { return String(v) === '1' ? 'Đã sử dụng' : 'Chưa sử dụng'; }

    var QUYTAC = { call: { action: A + 'DSA4BRIVDx4QNDgVICISKC8pHhIuFyAuEi4eACUP', func: P + 'LayDSTN_QuyTacSinh_SoVaoSo_Ad',
        strNguoiThucHien_Id: uid() }, id: 'ID', name: 'TEN' };
    function layTheoId(id) {
        return { action: A + 'Ei4CKTQvJhU0Hg0gOBUpJC4IJQPP', func: P + 'SoChungTu_LayTheoId', strId: id, strNguoiThucHien_Id: uid() };
    }

    var crud = ums.crud({
        root: root,
        title: 'Quản lý số vào sổ',
        formTitle: 'số vào sổ (thủ công)',
        listTitle: 'Danh sách số vào sổ',
        icon: 'fa-book-open-reader',
        filters: [
            { key: 'qt', type: 'select', label: '--Chọn quy tắc sinh số--', source: QUYTAC },
            { key: 'nam', type: 'text', label: 'Năm thực hiện' },
            { key: 'q', type: 'text', label: 'Thông tin tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: A + 'Ei4CKTQvJhU0Hg0gOAUgLykSICIp', func: P + 'SoChungTu_LayDanhSach',
                    strTN_HeThongChungTu_Ad_Id: f.qt || '', strNamThucHien: f.nam || '', strSoChungTu: f.q || '',
                    strNguoiThucHien_Id: uid() };
            }
        },
        columns: [
            { title: 'Chỉ số', prop: 'CHISO', cls: 'is-center' },
            { title: 'Số vào sổ', prop: 'SOCHUNGTU', cls: 'is-center' },
            { title: 'Quy tắc', prop: 'HETHONGCHUNGTU_MA' },
            { title: 'Ngày thực hiện', prop: 'NGAYTHUCHIEN', cls: 'is-center is-nowrap' },
            { title: 'Năm', prop: 'NAMTHUCHIEN', cls: 'is-center' },
            { title: 'Tự động', cls: 'is-center', render: function (r) { return esc(nhanThuCong(r.IS_NHAP_THUCONG)); } },
            { title: 'Tình trạng sử dụng', cls: 'is-center', render: function (r) {
                return String(r.DA_SU_DUNG) === '1' ? ui.badge('Đã sử dụng', 'info') : ui.badge('Chưa sử dụng', 'ok');
            } },
            { title: 'Chi tiết', cls: 'is-center', width: '72px', render: function (r, i) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-xem="' + i + '" title="Chi tiết">' +
                    '<i class="fa-light fa-eye"></i></button>';
            } },
            /* Thao tác — chỉ dòng nhập thủ công; nút mang data-c của ums.crud nên crud tự mở biểu mẫu / tự xoá */
            { title: 'Thao tác', cls: 'is-actions', width: '96px', render: function (r, i) {
                if (!thuCong(r)) return '<span class="ums-u-faint">-</span>';
                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-c="' + crud.uid + ':edit" data-i="' + i + '" title="Sửa">' +
                    '<i class="fa-light fa-pen-to-square"></i></button>' +
                    '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-c="' + crud.uid + ':del" data-i="' + i + '" title="Xóa">' +
                    '<i class="fa-light fa-trash-can"></i></button>';
            } }
        ],
        fields: [
            { key: 'strTN_HeThongChungTu_Ad_Id', label: 'Quy tắc sinh số', type: 'select', required: true, source: QUYTAC,
                placeholder: '--Chọn quy tắc sinh số--',
                get: function (r) { return e(r.HETHONGCHUNGTU_AD_ID) || e(r.TN_HETHONGCHUNGTU_AD_ID); } },
            { key: 'dChiSo', col: 'CHISO', label: 'Chỉ số', type: 'number', required: true },
            { key: 'strSoChungTu', col: 'SOCHUNGTU', label: 'Số vào sổ', required: true },
            { key: 'strNamThucHien', col: 'NAMTHUCHIEN', label: 'Năm thực hiện', required: true }
        ],
        canEdit: false,          // cột Sửa / Xoá tự vẽ ở trên (chỉ dòng thủ công)
        rowDelete: false,
        multi: false,
        formDelete: false,
        detail: function (row) { return layTheoId(row.ID); },
        save: function (v, row) {
            var sua = !!row;
            return {
                action: A + (sua ? 'Ei4CKTQvJhU0HhI0IB4VKTQCLi8m' : 'Ei4CKTQvJhU0HhUpJCwMLigeFSk0Ai4vJgPP'),
                func: P + (sua ? 'SoChungTu_Sua_ThuCong' : 'SoChungTu_ThemMoi_ThuCong'),
                strId: sua ? e(row.ID) : '',
                strSoChungTu: (v.strSoChungTu || '').trim(),
                dChiSo: (v.dChiSo || '').trim(),
                strTN_HeThongChungTu_Ad_Id: v.strTN_HeThongChungTu_Ad_Id,
                strNamThucHien: (v.strNamThucHien || '').trim(),
                strNguoiThucHien_Id: uid()
            };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: A + 'Ei4CKTQvJhU0HhkuIB4VKTQCLi8m', func: P + 'SoChungTu_Xoa_ThuCong', strId: id, strNguoiThucHien_Id: uid() };
            });
        },
        removeConfirm: function () { return 'Bạn có chắc chắn xóa số vào sổ này không?'; }
    });

    /* Nút tìm của thanh lọc mang đúng chữ gốc "Xem" */
    var nutXem = root.querySelector('[data-c="' + crud.uid + ':search"] span');
    if (nutXem) nutXem.textContent = 'Xem';

    /* Hộp "Chi tiết số vào sổ" — chỉ xem, liệt kê mọi cột như renderDetail_SoVaoSo gốc */
    function xemChiTiet(row) {
        var dlg = ui.dialog({ title: 'Chi tiết số vào sổ', icon: 'fa-book-open-reader', size: 'lg',
            body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        ums.api.call(layTheoId(row.ID)).then(function (r) {
            var d = Array.isArray(r.data) ? (r.data[0] || {}) : (r.data || {});
            var keys = Object.keys(d);
            dlg.body.innerHTML = keys.length ? keys.map(function (k) {
                var v = k === 'IS_NHAP_THUCONG' ? nhanThuCong(d[k]) : k === 'DA_SU_DUNG' ? nhanSuDung(d[k]) : e(d[k]);
                return '<div class="ums-kv"><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>';
            }).join('') : ui.empty('Không có dữ liệu');
        }).catch(function (err) {
            dlg.body.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'SoChungTu_LayTheoId');
        });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xem]');
        if (!b || !root.contains(b)) return;
        var row = crud.rows[Number(b.getAttribute('data-xem'))];
        if (row) xemChiTiet(row);
    });
})();
