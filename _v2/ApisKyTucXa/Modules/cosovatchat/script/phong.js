/* =========================================================================
   Phòng & công tơ (Ký túc xá / Cơ sở vật chất) — gắn công tơ điện / nước cho từng phòng
   Bản gốc: ApisKyTucXa/Modules/cosovatchat/html/phong.html + script/phong.js (858 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       KTX_ToaNha/LayDanhSach            GET   ô chọn toà nhà (ums.ktx.toaNha; bản gốc pageSize_default 10 — xem Khác gốc)
       KTX_Phong/LayDanhSach             GET   strTuKhoa, strKTX_ToaNha_Id, còn lại "", pageIndex, pageSize 10 (phân trang máy chủ)
       KTX_CongToDien_Phong/LayDanhSach  GET   strTuKhoa "", strKTX_Phong_Id, strKTX_CongToDien_Id "", pageIndex 1, pageSize 10000
       KTX_CongToDien_Phong/ThemMoi      POST  strId "", strKTX_Phong_Id, strKTX_CongToDien_Id
       KTX_CongToDien_Phong/Xoa          POST  strIds
       KTX_CongToNuoc_Phong/…            cùng dạng, tham số strKTX_CongToNuoc_Id
       KTX_CongToDien/LayDanhSach · KTX_CongToNuoc/LayDanhSach   GET   ô chọn công tơ (ums.ktx.congTo)
   Bố cục bản gốc: HAI cột — trái: ô từ khoá + ô chọn toà nhà, "Danh sách phòng" (mỗi dòng "Tên - Loại phòng
   - Tính chất" + nút mắt, phân trang); phải (ẩn tới khi chọn phòng): hai tab "1) Công tơ điện" /
   "2) Công tơ nước", mỗi tab một khung có nút Thêm mới + bảng (Stt | Công tơ | Xóa); Thêm mới → khung
   nhập một ô chọn công tơ thay chỗ bảng.
   Ở đây: ums.pat.master + ums.pat.cotTrai; mỗi tab một ums.crud nhúng (biểu mẫu thay chỗ bảng như gốc).

   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Ô chọn toà nhà: bản gốc gọi với pageSize_default (10) → chỉ 10 toà đầu; ở đây lấy hết (100000)
       như các màn khác của module.
     · Bản gốc nạp danh sách công tơ MỘT lần lúc mở màn → công tơ vừa khai ở màn Công tơ điện không
       hiện cho tới khi tải lại trang. Ở đây nạp lại mỗi lần mở biểu mẫu Thêm.
     · Xoá: bản gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → ui.confirm.
   Cố ý bỏ: khối dropPhong_ToaNha / arrValid_Phong (ô không có trong HTML); hai trình xử lý
     #zoneBox_CongToDien / #zoneBox_CongToNuoc (vùng không có — chép từ màn công tơ); các id txtChucNang_* /
     dropChucNang_* trong rewrite (chép từ màn chức năng, mã chết).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, K = ums.ktx, e = K.e;
    var root = document.getElementById('ktx-phong');
    if (!root) return;

    var SIZE = 10;                              // edu.system.pageSize_default
    var st = { page: 1, rows: [], total: 0, phong: null, tab: 'dien' };

    var m = pat.master({
        el: root, title: 'Phòng & công tơ',
        side: {
            title: 'Danh sách phòng', icon: 'fa-door-open', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-field"><select class="ums-select" data-f="toa" data-ph="Chọn tòa nhà"><option value="">Chọn tòa nhà</option></select></div>'
        },
        main: { title: false }
    });
    var selToa = m.el.querySelector('[data-f="toa"]');
    K.toaNha().then(function (rs) { pat.fill(selToa, rs, { name: 'TEN' }); });
    if (window.jQuery) jQuery(selToa).on('change', function () { load(1); });
    pat.cotTrai(m, { tai: function () { load(1); }, tuTaiLoc: false });

    /* ---------- Cột trái: phòng ---------- */
    function load(p) {
        st.page = p || 1;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return K.phong({
            strTuKhoa: m.search ? (m.search.value || '').trim() : '', strKTX_ToaNha_Id: selToa.value || '',
            pageIndex: st.page, pageSize: SIZE
        }).then(function (kq) {
            st.rows = kq.rows; st.total = kq.total;
            m.sideCount.textContent = String(st.total);
            veTrai();
            m.setPage({ index: st.page, size: SIZE, total: st.total, sizes: false, shown: st.rows.length, onChange: function (pg) {
                if (pg >= 1 && pg <= Math.max(1, Math.ceil(st.total / SIZE))) load(pg);
            } });
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách phòng');
        });
    }
    function veTrai() {
        if (!st.rows.length) { m.sideBody.innerHTML = ui.empty('Không có dữ liệu'); return; }
        m.sideBody.innerHTML = st.rows.map(function (r) {
            return '<button type="button" class="ums-master__item' + (st.phong && st.phong.ID === r.ID ? ' is-active' : '') +
                '" data-id="' + ui.esc(r.ID) + '">' +
                '<span class="ums-master__item__main">' + ui.esc(e(r.TEN)) + ' - ' + ui.esc(e(r.LOAIPHONG_TEN)) + ' - ' + ui.esc(e(r.TINHCHAT_TEN)) + '</span>' +
                (e(r.KTX_TOANHA_TEN) ? '<span class="ums-master__item__sub">' + ui.esc(r.KTX_TOANHA_TEN) + '</span>' : '') +
                '</button>';
        }).join('');
    }
    m.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('.ums-master__item');
        if (!b || !m.sideBody.contains(b)) return;
        var id = b.getAttribute('data-id');
        st.phong = st.rows.filter(function (r) { return r.ID === id; })[0] || null;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) { x.classList.toggle('is-active', x === b); });
        moPhong();
    });

    /* ---------- Cột phải: hai tab công tơ ---------- */
    m.mainBody.innerHTML =
        '<div data-z="trong">' + ui.empty('Chọn phòng ở danh sách bên trái để xem công tơ', 'fa-hand-pointer') + '</div>' +
        '<div data-z="ct" hidden>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-door-open"></i> <span data-z="tenPhong"></span></div></div></div>' +
        ui.tabs([{ key: 'dien', text: '1) Công tơ điện', icon: 'fa-bolt' }, { key: 'nuoc', text: '2) Công tơ nước', icon: 'fa-droplet' }], 'dien', 'data-ktab') +
        '<div data-z="dien" class="ums-u-mt-4"></div><div data-z="nuoc" class="ums-u-mt-4" hidden></div></div>';
    var zTrong = m.mainBody.querySelector('[data-z="trong"]');
    var zCt = m.mainBody.querySelector('[data-z="ct"]');
    var zTen = m.mainBody.querySelector('[data-z="tenPhong"]');

    function crudCongTo(loai) {
        var ctrl = loai === 'nuoc' ? 'KTX_CongToNuoc_Phong' : 'KTX_CongToDien_Phong';
        var ten = loai === 'nuoc' ? 'Công tơ nước' : 'Công tơ điện';
        var thuong = loai === 'nuoc' ? 'công tơ nước' : 'công tơ điện';
        var kCongTo = loai === 'nuoc' ? 'strKTX_CongToNuoc_Id' : 'strKTX_CongToDien_Id';
        var colTen = loai === 'nuoc' ? 'KTX_CONGTONUOC_TEN' : 'KTX_CONGTODIEN_TEN';
        var p = {};
        var c = ums.crud({
            root: m.mainBody.querySelector('[data-z="' + loai + '"]'),
            embedded: true, autoload: false, multi: false, canEdit: false,
            title: ten, icon: loai === 'nuoc' ? 'fa-droplet' : 'fa-bolt', formTitle: thuong, addText: 'Thêm mới',
            empty: 'Phòng chưa gắn ' + thuong,
            list: { call: function () {
                if (!st.phong) return null;
                p = { action: ctrl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_Phong_Id: st.phong.ID, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 };
                p[kCongTo] = '';
                return p;
            } },
            columns: [{ title: 'Công tơ', prop: colTen }],
            fields: [{ key: kCongTo, label: ten, type: 'select', required: true, placeholder: 'Chọn ' + thuong, source: { call: {
                action: (loai === 'nuoc' ? 'KTX_CongToNuoc' : 'KTX_CongToDien') + '/LayDanhSach', method: 'GET',
                strTuKhoa: '', strHangSanXuat_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, name: function (r) { return e(r.TEN) || e(r.MA); } } }],
            onForm: function (row, me) {
                /* Nạp lại danh sách công tơ mỗi lần mở Thêm (bản gốc nạp một lần lúc mở màn) */
                var sel = me.z('form').querySelector('[data-k="' + kCongTo + '"]');
                K.congTo(loai).then(function (rs) { if (sel) pat.fill(sel, rs, { name: function (r) { return e(r.TEN) || e(r.MA); } }); });
            },
            save: function (v) {
                if (!st.phong) { ui.toast('Hãy chọn phòng bên tay trái', 'warn'); return null; }
                var q = { action: ctrl + '/ThemMoi', method: 'POST', strId: '', strKTX_Phong_Id: st.phong.ID };
                q[kCongTo] = v[kCongTo];
                return q;
            },
            remove: function (ids) { return ids.map(function (id) { return { action: ctrl + '/Xoa', method: 'POST', strIds: id }; }); }
        });
        return c;
    }
    var crud = { dien: crudCongTo('dien'), nuoc: crudCongTo('nuoc') };

    zCt.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-ktab]');
        if (!a) return;
        ev.preventDefault();
        st.tab = a.getAttribute('data-ktab');
        ui.tabsActive(zCt, st.tab, 'data-ktab');
        ['dien', 'nuoc'].forEach(function (k) { m.mainBody.querySelector('[data-z="' + k + '"]').hidden = k !== st.tab; });
    });

    function moPhong() {
        if (!st.phong) return;
        zTrong.hidden = true; zCt.hidden = false;
        zTen.textContent = (e(st.phong.KTX_TOANHA_TEN) ? e(st.phong.KTX_TOANHA_TEN) + ' - ' : '') + e(st.phong.TEN);
        ['dien', 'nuoc'].forEach(function (k) {
            if (!crud[k].z('form').hidden) crud[k].showList();
            crud[k].load(1);
        });
    }

    load(1);
})();
