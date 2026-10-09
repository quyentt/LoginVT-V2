/* =========================================================================
   Hạng chức danh — cây Nhóm ngạch (trái) + danh sách hạng chức danh của nhóm (phải)
   Bản gốc: ApisNhanSu/Modules/luong/script/hangchucdanh.js
   Hai cột như gốc: ums.pat.master (side.kieu 'danhmuc' — cây thư mục thay jstree),
   bên phải ums.crud nhúng; "Chi tiết" (nhóm ngạch bậc) thay chỗ danh sách.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       Danh mục NS.NHNG (nhóm ngạch, cây theo QUANHECHA_ID), NS.CDNN, NS.HACD, NS.NGLU
       NS_HangChucDanh/LayDanhSach   GET  strTuKhoa '', strLoaiChucDanhNgheNghiep_Id '', strNgach_Id '',
                                          strNhomNgach_Id, strHang_Id '', strNguoiThucHien_Id '', pageIndex, pageSize
       NS_HangChucDanh/ThemMoi | CapNhat  strId, strLoaiChucDanhNgheNghiep_Id, strHang_Id, strNhomNgach_Id,
                                          dThoiHanNangLuong '', strThoiGianApDung '', strNgach_Id,
                                          strNguoiThucHien_Id, strGhiChu
       NS_HangChucDanh/Xoa           strIds
       NS_NhomNgachBac/LayDanhSach   GET  strTuKhoa '', strBac_Id '', strNhomNgach_Id (nhóm đang chọn ở cây),
                                          strNguoiThucHien_Id '', pageIndex 1, pageSize 10
   Giữ như gốc: mở màn danh sách rỗng (gốc gọi với strNhomNgach_Id "xxx"); "Chi tiết" hiện ngạch bậc
   của NHÓM đang chọn ở cây (không theo dòng bấm); cột "Hệ số" của chi tiết luôn trống; sửa đổ
   biểu mẫu từ dòng danh sách (gốc không gọi chi tiết); chọn nhóm ở cây thì ô Nhóm ngạch của
   biểu mẫu thêm mới đặt sẵn nhóm đó.
   Khác gốc:
     · Ô từ khoá đầu cột trái: gốc gọi danh sách với strTuKhoa luôn rỗng và bỏ nhóm đang chọn →
       bản mới lọc CÂY nhóm ngạch tại chỗ theo từ khoá.
     · Danh sách phân trang đầy đủ (gốc chỉ trang đầu 10 dòng, không thanh phân trang).
     · Nút "Tải lại" (gốc không có xử lý) → nút tải lại chung của khung; "Viết lại" trong biểu mẫu
       (gốc không có xử lý) bỏ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('hangchucdanh');
    if (!root) return;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var C = 'NS_HangChucDanh';
    var nhom = { ID: 'xxx', TEN: '' }, nhoms = [];

    var m = pat.master({
        el: root,
        title: 'Hạng chức danh',
        side: { title: 'Nhóm ngạch', kieu: 'danhmuc', search: 'Nhập từ khóa tìm kiếm' },
        main: { title: false }
    });
    m.mainBody.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var zDs = m.mainBody.querySelector('[data-z="ds"]'), zCt = m.mainBody.querySelector('[data-z="ct"]');

    var crud = ums.crud({
        root: zDs,
        embedded: true,
        autoload: false,
        title: 'Thông tin chung',
        formTitle: 'hạng chức danh',
        icon: 'fa-circle-info',
        addText: 'Thêm',
        multi: false,
        pageSize: 10,
        list: {
            paged: true,
            call: function () {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strLoaiChucDanhNgheNghiep_Id: '', strNgach_Id: '',
                    strNhomNgach_Id: nhom.ID, strHang_Id: '', strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Nhóm ngạch', prop: 'NHOMNGACH_TEN' },
            { title: 'Ngạch công chức', render: function (r) {
                var cd = e(r.LOAICHUCDANHNGHENGHIEP_TEN), h = e(r.HANG_TEN);
                return esc(h ? cd + ' - ' + h : cd); } },
            { title: 'Mã ngạch', prop: 'NGACH_TEN' }
        ],
        rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function () { chiTiet(); } }],
        fields: [
            { key: 'strLoaiChucDanhNgheNghiep_Id', col: 'LOAICHUCDANHNGHENGHIEP_ID', label: 'Loại chức danh', type: 'select', source: { dm: 'NS.CDNN' } },
            { key: 'strHang_Id', col: 'HANG_ID', label: 'Hạng', type: 'select', source: { dm: 'NS.HACD' } },
            { key: 'strNgach_Id', col: 'NGACH_ID', label: 'Ngạch', type: 'select', source: { dm: 'NS.NGLU' } },
            { key: 'strNhomNgach_Id', col: 'NHOMNGACH_ID', label: 'Nhóm ngạch', type: 'select', source: { dm: 'NS.NHNG' } },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', span: true }
        ],
        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strLoaiChucDanhNgheNghiep_Id: v.strLoaiChucDanhNgheNghiep_Id,
                strHang_Id: v.strHang_Id,
                strNhomNgach_Id: v.strNhomNgach_Id,
                dThoiHanNangLuong: '',
                strThoiGianApDung: '',
                strNgach_Id: v.strNgach_Id,
                strNguoiThucHien_Id: uid(),
                strGhiChu: v.strGhiChu
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });

    /* ---- Chi tiết: ngạch bậc của nhóm đang chọn ------------------------- */
    function chiTiet() {
        if (!nhom.ID || nhom.ID === 'xxx') { ui.toast('Vui lòng chọn nhóm ngạch', 'warn'); return; }
        zCt.innerHTML = pat.panel({ title: 'Nhóm ngạch bậc' + (nhom.TEN ? ' — ' + nhom.TEN : ''), icon: 'fa-layer-group', flush: true, zone: 'ctBang',
            tools: ui.btn('close', { attr: { 'data-a': 'dongCt' } }), body: '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>' });
        ui.swap(zDs, zCt, { top: false });
        ums.api.call({ action: 'NS_NhomNgachBac/LayDanhSach', method: 'GET', strTuKhoa: '', strBac_Id: '', strNhomNgach_Id: nhom.ID,
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10 })
            .then(function (r) {
                ui.table({ el: zCt.querySelector('[data-z="ctBang"]'), rows: Array.isArray(r.data) ? r.data : [], empty: 'Không có dữ liệu',
                    columns: [{ title: 'Nhóm ngạch', prop: 'NHOMNGACH_TEN' }, { title: 'Bậc', prop: 'BAC_TEN' },
                        { title: 'Hệ số', cls: 'is-center', render: function () { return ''; } }] });
            })
            .catch(function (err) { zCt.querySelector('[data-z="ctBang"]').innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhóm ngạch bậc'); });
    }
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="dongCt"]')) { ui.swap(zCt, zDs, { top: false }); return; }
        var b = ev.target.closest('.hcd-node');
        if (!b || !m.sideBody.contains(b)) return;
        nhom = nhoms.filter(function (x) { return x.ID === b.getAttribute('data-id'); })[0] || nhom;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.hcd-node'), function (x) { x.classList.toggle('is-active', x === b); });
        var f = crud.fieldDef('strNhomNgach_Id');
        if (f) f.value = nhom.ID;                   // $("#dropHCD_NhomNgach").val(nhóm) của gốc
        if (!zCt.hidden) ui.swap(zCt, zDs, { top: false });
        if (crud.z('form') && !crud.z('form').hidden) crud.showList();
        crud.load(1);
    });

    /* ---- Cây nhóm ngạch (NS.NHNG, cha = QUANHECHA_ID) --------------------- */
    function veCay() {
        var ids = {};
        nhoms.forEach(function (t) { ids[t.ID] = true; });
        function nhanh(cha) {
            var kids = nhoms.filter(function (t) { var p = t.QUANHECHA_ID || ''; return cha ? p === cha : (!p || !ids[p]); });
            if (!kids.length) return '';
            return '<ul class="hcd-tree">' + kids.map(function (t) {
                return '<li data-text="' + esc(String(e(t.TEN) + ' ' + e(t.MA)).toLowerCase()) + '">' +
                    '<button type="button" class="ums-master__item hcd-node' + (nhom.ID === t.ID ? ' is-active' : '') + '" data-id="' + esc(t.ID) + '">' +
                    esc(t.TEN) + '</button>' + nhanh(t.ID) + '</li>';
            }).join('') + '</ul>';
        }
        m.sideBody.innerHTML = nhanh('') || ui.empty('Không có dữ liệu');
        m.sideCount.textContent = '(' + nhoms.length + ')';
        loc();
    }
    function loc() {
        var q = (m.search.value || '').trim().toLowerCase();
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('li'), function (li) {
            li.hidden = !!q && (li.getAttribute('data-text') || '').indexOf(q) < 0 &&
                !Array.prototype.some.call(li.querySelectorAll('li'), function (c) { return (c.getAttribute('data-text') || '').indexOf(q) >= 0; });
        });
    }
    m.search.addEventListener('input', loc);
    m.sideBody.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
    ums.api.dm('NS.NHNG').then(function (rows) { nhoms = rows || []; veCay(); })
        .catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhóm ngạch'); });
    crud.load(1);
})();
