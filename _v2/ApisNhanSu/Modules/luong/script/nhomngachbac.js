/* =========================================================================
   Nhóm ngạch - bậc
   Bản gốc: ApisNhanSu/Modules/luong/script/nhomngachbac.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc: cột trái cây "Nhóm ngạch - bậc" (jstree của danh mục
   NS.NHNG theo QUANHECHA_ID) → ums.pat.master kiểu 'danhmuc'; cột phải bảng
   bậc của nhóm ngạch đang chọn + biểu mẫu (ums.crud lồng).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       CMS danh mục NS.NHNG (getList_DanhMucDulieu iTrangThai 1) — cây + ô "Nhóm ngạch"
       danh mục NS.BALU — ô "Bậc"
       NS_NhomNgachBac/LayDanhSach  GET  strTuKhoa '', strBac_Id '', strNhomNgach_Id,
                                         strNguoiThucHien_Id '', pageIndex 1, pageSize 10
       NS_NhomNgachBac/ThemMoi | CapNhat  POST
           strId, strBac_Id, strNhomNgach_Id, dThoiHanNangLuong, strGhiChu
       NS_NhomNgachBac/Xoa          POST strIds, strNguoiThucHien_Id
   Sửa lấy dòng từ danh sách (gốc không có LayChiTiet). Cột: Nhóm ngạch
   (NHOMNGACH_TEN), Bậc (BAC_TEN), Hệ số (gốc luôn để trống).

   Giữ như bản gốc: ô "Hệ số" và "Thời gian áp dụng" có trên biểu mẫu nhưng
   gốc KHÔNG gửi đi (và luôn đổ trống khi sửa) — giữ ô, không gửi.
   Danh sách chỉ lấy trang đầu 10 dòng (pageSize 10 cứng như gốc).
   Nút "Viết lại" (btnRefresh_NNB) gốc không có xử lý → giữ nút, khoá.
   Khác bản gốc: gốc mở màn gọi danh sách với strNhomNgach_Id = "xxx" (trống);
   ở đây cột phải chờ chọn nhóm ngạch. Ô từ khoá trên cây gốc không có xử lý
   (nút ▼ chỉ mở/đóng vùng lọc) → lọc TẠI CHỖ trên cây.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc;
    var C = 'NS_NhomNgachBac';
    function e(v) { return v === undefined || v === null ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    var root = document.getElementById('nhomngachbac');
    var mst = ums.pat.master({
        el: root,
        title: 'Nhóm ngạch - bậc',
        side: { title: 'Nhóm ngạch - bậc', kieu: 'danhmuc', search: 'Nhập từ khóa tìm kiếm' },
        main: { title: false }
    });
    var cay = [], chon = '';
    var NHOM = { dm: 'NS.NHNG', name: 'TEN' };

    function veCay() {
        var ids = {};
        cay.forEach(function (x) { ids[x.ID] = 1; });
        function nhanh(cha) {
            var con = cay.filter(function (x) {
                var p = x.QUANHECHA_ID || '';
                return cha ? p === cha : (!p || !ids[p]);
            });
            if (!con.length) return '';
            return '<ul>' + con.map(function (x) {
                return '<li><button type="button" class="ums-master__item' + (x.ID === chon ? ' is-active' : '') + '" data-nnb="' + esc(x.ID) + '">' +
                    esc(x.TEN) + '</button>' + nhanh(x.ID) + '</li>';
            }).join('') + '</ul>';
        }
        mst.sideBody.innerHTML = nhanh('') || ui.empty('Không có dữ liệu');
        mst.sideCount.textContent = String(cay.length);
        loc();
    }
    function loc() {
        var v = (mst.search.value || '').trim().toLowerCase();
        Array.prototype.forEach.call(mst.sideBody.querySelectorAll('li'), function (li) {
            li.hidden = !!v && li.textContent.toLowerCase().indexOf(v) < 0;
        });
    }
    mst.search.addEventListener('input', loc);

    mst.mainBody.innerHTML = '<div class="ums-panel"><div class="ums-panel__body">' +
        ui.empty('Chọn một nhóm ngạch ở cây bên trái để xem các bậc', 'fa-hand-pointer') + '</div></div>';

    ums.api.dm('NS.NHNG').then(function (r) { cay = r || []; veCay(); })
        .catch(function (err) { mst.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhóm ngạch'); });

    mst.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-nnb]');
        if (!b) return;
        chon = b.getAttribute('data-nnb');
        Array.prototype.forEach.call(mst.sideBody.querySelectorAll('[data-nnb]'), function (x) { x.classList.toggle('is-active', x === b); });
        moBang();
    });

    var crud = null;
    function moBang() {
        if (crud) {
            if (crud.z('form') && !crud.z('form').hidden) crud.showList();
            crud.load(1);
            return;
        }
        mst.mainBody.innerHTML = '';
        crud = ums.crud({
            root: mst.mainBody,
            embedded: true,
            title: 'Nhóm ngạch bậc',
            listTitle: 'Thông tin chung',
            formTitle: 'nhóm ngạch bậc',
            icon: 'fa-layer-group',
            addText: 'Thêm',
            multi: false,

            list: {
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strBac_Id: '', strNhomNgach_Id: chon,
                        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10 };
                }
            },

            columns: [
                { title: 'Nhóm ngạch', prop: 'NHOMNGACH_TEN' },
                { title: 'Bậc', prop: 'BAC_TEN' },
                { title: 'Hệ số', cls: 'is-center', render: function () { return ''; } }
            ],

            fields: [
                { key: 'strNhomNgach_Id', col: 'NHOMNGACH_ID', label: 'Nhóm ngạch', type: 'select', source: NHOM, placeholder: '-- Chọn nhóm ngạch --' },
                { key: 'strBac_Id', col: 'BAC_ID', label: 'Bậc', type: 'select', source: { dm: 'NS.BALU' }, placeholder: '-- Chọn bậc --' },
                { key: '_heSo', label: 'Hệ số', get: function () { return ''; } },
                { key: 'dThoiHanNangLuong', col: 'THOIHANNANGLUONG', label: 'Thời hạn nâng bậc' },
                { key: '_thoiGian', label: 'Thời gian áp dụng', type: 'date', span: true, get: function () { return ''; } },
                { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', span: true }
            ],

            onForm: function (row, c) {
                // Thêm mới: ô Nhóm ngạch lấy nút cây đang chọn (select_node.jstree gốc đặt dropNNB_NhomNgach)
                if (!row) {
                    var el = c.root.querySelector('[data-cf="' + c.uid + '"][data-scope="form"][data-k="strNhomNgach_Id"]');
                    if (el) { el.value = chon; if (window.jQuery) jQuery(el).trigger('change.select2'); }
                }
                var tools = c.z('form').querySelector('.ums-panel__tools');
                if (tools && !tools.querySelector('[data-nnb-vl]')) {
                    var dong = tools.querySelector('[data-c="' + c.uid + ':back"]');
                    var b = document.createElement('span');
                    b.innerHTML = ui.btn('reload', { text: 'Viết lại', attr: { 'data-nnb-vl': '1', disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } });
                    tools.insertBefore(b.firstChild, dong ? dong.nextSibling : tools.firstChild);
                }
            },

            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strBac_Id: v.strBac_Id,
                    strNhomNgach_Id: v.strNhomNgach_Id,
                    dThoiHanNangLuong: v.dThoiHanNangLuong,
                    strNguoiThucHien_Id: uid(),
                    strGhiChu: v.strGhiChu
                };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        });
    }
})();
