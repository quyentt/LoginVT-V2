/* =========================================================================
   Danh mục dữ liệu — bản của phân hệ Tài chính
   Bản gốc: ApisTaiChinh/Modules/danhmuc/script/danhmucdulieu.js
   (CLAUDE.md mục 8 bẫy 10: repo có 21 bản danhmucdulieu.js — đây CHỈ là
   bản của ApisTaiChinh, không gộp hành vi của các bản khác.)
   ---------------------------------------------------------------------------
   Lời gọi (đều là action kiểu cũ, không func, không mã hoá):
       CMS_DanhMucTenBang/LayDanhSach     GET  danh sách bảng danh mục.
           strNhomDanhMuc_Id = edu.system.appId, mà appId chính là VaiTro_Id
           (CLAUDE.md mục 4) → ums.state.roleId.
           strTuKhoa cố định "VNPAY.NGANHANG" — bản gốc viết cứng như vậy,
           nên màn Tài chính chỉ thấy bảng khớp từ khoá đó. Giữ nguyên.
       CMS_DanhMucThuocTinh/LayDanhSach   GET  thuộc tính (cột) của bảng
       CMS_DanhMucDuLieu/LayDanhSach      GET  dữ liệu, pageSize 1000000
                                               (cũng dùng nạp ô "dữ liệu cha")
       CMS_DanhMucDuLieu/LayChiTiet       GET  trước khi sửa
       CMS_DanhMucDuLieu/ThemMoi|CapNhat  POST
       CMS_DanhMucDuLieu/Xoa              POST strId = "id1,id2," (một lời gọi)

   Giữ nguyên hành vi bản gốc:
     · Chỉ những trường có trong thuộc tính của bảng mới đọc từ ô nhập;
       trường khác gửi "" (ThongTinX) hoặc 0 (HeSoX). HeSo trống gửi 0.
     · Lưu luôn gửi dTrangThai = 1 (kể cả khi sửa — bản gốc tính
       iTrangThai từ ô lọc nhưng không dùng).
     · Bảng chỉ hiện ThongTin1–6; ThongTin7–8 chỉ có trong biểu mẫu.

   Cố ý bỏ:
     · updateStatus_DMDL (CMS_DanhMucDuLieu/ChuyenTrangThai): mã chết, không
       nơi nào gọi, lại gọi me.loadDatasysDanhMucDuLieu không tồn tại.
     · Lọc tại chỗ khi gõ vào ô từ khoá (keyup ẩn dòng + tô đỏ). Ô từ khoá
       gửi strTuKhoa lên máy chủ như nút Tìm kiếm của bản gốc; Enter = tìm.

   Dùng lại cho phân hệ khác (bản gốc của họ lệch vài chỗ) — thuộc tính trên thẻ gốc #danhmucdulieu:
       data-tu-khoa="…"   strTuKhoa của danh sách bảng (không đặt = "VNPAY.NGANHANG" như Tài chính)
       data-tu-chon="0"   không tự mở bảng đầu tiên (Tài chính tự mở)
       data-loc="q"       ô lọc dữ liệu hiện ra, trong số cha / tt / q (không đặt = cả ba).
                          Không có ô tt thì gửi dTrangThai "" (bản gốc đọc ô không tồn tại).
       data-trang-thai="1" không có ô tt thì gửi giá trị này thay cho "" (gốc viết cứng iTrangThai = 1).
       Đang dùng: ApisChuyenCan/Modules/danhmuc/html/danhmucdulieu.html,
                  ApisKeHoachChuongTrinh/Modules/danhmuc/html/danhmucdulieu.html
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('danhmucdulieu');
    if (!root) return;
    var CFG = {
        tuKhoa: root.hasAttribute('data-tu-khoa') ? root.getAttribute('data-tu-khoa') : 'VNPAY.NGANHANG',
        tuChon: root.getAttribute('data-tu-chon') !== '0',
        loc: (root.getAttribute('data-loc') || 'cha tt q').split(/[\s,]+/),
        trangThai: root.getAttribute('data-trang-thai') || ''
    };

    /* Bố cục hai cột dùng chung — ums.pat.master (BO-CUC mục 4).
       Cột trái là CÂY (lồng theo CHUNG_TENDANHMUC_CHA_ID) nên mỗi nút là một
       .ums-master__item đặt trong <ul> lồng nhau. */
    var mst = ums.pat.master({
        el: root,
        title: 'Danh mục dữ liệu',
        side: { title: 'Danh sách danh mục', kieu: 'danhmuc', search: 'Nhập từ khoá tìm kiếm' },
        main: { title: false }
    });
    var elTree = mst.sideBody;
    var elData = mst.mainBody;
    var elSearch = mst.search;
    var elCount = mst.sideCount;

    var tables = [];
    var current = null;

    /* Trường dữ liệu bản gốc biết — thứ tự trong switch của bản gốc */
    var KNOWN = {
        Ten:       { key: 'strTen', col: 'TEN', required: true },
        Ma:        { key: 'strMa', col: 'MA', required: true },
        HeSo1:     { key: 'dHeSo1', col: 'HESO1', num: true, cls: 'is-center' },
        HeSo2:     { key: 'dHeSo2', col: 'HESO2', num: true, cls: 'is-center' },
        HeSo3:     { key: 'dHeSo3', col: 'HESO3', num: true, cls: 'is-center' },
        ThongTin1: { key: 'strThongTin1', col: 'THONGTIN1' },
        ThongTin2: { key: 'strThongTin2', col: 'THONGTIN2' },
        ThongTin3: { key: 'strThongTin3', col: 'THONGTIN3' },
        ThongTin4: { key: 'strThongTin4', col: 'THONGTIN4' },
        ThongTin5: { key: 'strThongTin5', col: 'THONGTIN5' },
        ThongTin6: { key: 'strThongTin6', col: 'THONGTIN6' },
        ThongTin7: { key: 'strThongTin7', col: 'THONGTIN7', formOnly: true },
        ThongTin8: { key: 'strThongTin8', col: 'THONGTIN8', formOnly: true }
    };

    function e(v) { return v === undefined || v === null ? '' : v; }
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }

    /* ---------- Danh sách bảng danh mục -------------------------------- */
    function loadTables() {
        elTree.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_DanhMucTenBang/LayDanhSach',
            method: 'GET',
            strPhanCapDanhMuc_Id: '',
            strChung_TenDanhMuc_Cha_Id: '',
            strNhomDanhMuc_Id: ums.state.roleId || '',
            strTuKhoa: CFG.tuKhoa,
            pageIndex: 1,
            pageSize: 100000,
            dTrangThai: 1,
            strTieuChiSapXep: ''
        }).then(function (r) {
            tables = rowsOf(r);
            elCount.textContent = String(r.pager || tables.length);
            drawTree();
            if (moSanDanhMuc()) return;
            if (tables.length && CFG.tuChon) pick(tables[0].ID);
            else if (tables.length) elData.innerHTML = '<div class="ums-panel">' + ui.empty('Chọn một danh mục ở cột trái', 'fa-hand-pointer') + '</div>';
            else elData.innerHTML = '<div class="ums-panel">' + ui.empty('Chưa có bảng danh mục nào') + '</div>';
        }).catch(function (err) {
            elTree.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách bảng danh mục');
        });
    }

    /* Mở từ khung "Cần làm trước" (lamtruoc.js): chọn sẵn danh mục đang thiếu giá trị; không thuộc nhóm của vai trò này thì báo */
    function moSanDanhMuc() {
        var ma = ums.lamTruoc && ums.lamTruoc.layDanhMucCho();
        if (!ma) return false;
        var t = tables.filter(function (x) { return String(x.MADANHMUC || '').toUpperCase() === ma.toUpperCase(); })[0];
        if (t) { pick(t.ID); return true; }
        ui.toast('Danh mục ' + ma + ' không có trong danh sách của vai trò này — mở Quản trị hệ thống → Danh mục dữ liệu để khai.', 'warn');
        return false;
    }

    /** Cây theo CHUNG_TENDANHMUC_CHA_ID, tên hiện "TENDANHMUC - MADANHMUC" */
    function drawTree() {
        var ids = {};
        tables.forEach(function (t) { ids[t.ID] = true; });
        function branch(parent) {
            var kids = tables.filter(function (t) {
                var p = t.CHUNG_TENDANHMUC_CHA_ID || '';
                return parent ? p === parent : (!p || !ids[p]);
            });
            if (!kids.length) return '';
            return '<ul class="dmdl-tree">' + kids.map(function (t) {
                return '<li data-text="' + ui.esc(String(e(t.TENDANHMUC) + ' ' + e(t.MADANHMUC)).toLowerCase()) + '">' +
                    '<button type="button" class="ums-master__item dmdl-node' + (current && current.ID === t.ID ? ' is-active' : '') +
                    '" data-id="' + ui.esc(t.ID) + '">' + ui.esc(t.TENDANHMUC) +
                    (t.MADANHMUC ? ' <small>- ' + ui.esc(t.MADANHMUC) + '</small>' : '') + '</button>' +
                    branch(t.ID) + '</li>';
            }).join('') + '</ul>';
        }
        elTree.innerHTML = branch('') || ui.empty('Không có dữ liệu');
        filterTree();
    }

    function filterTree() {
        var v = (elSearch.value || '').trim().toLowerCase();
        Array.prototype.forEach.call(elTree.querySelectorAll('li'), function (li) {
            li.hidden = !!v && (li.getAttribute('data-text') || '').indexOf(v) < 0 && !li.querySelector('li[data-text*="' + v.replace(/"/g, '') + '"]');
        });
    }

    elSearch.addEventListener('input', filterTree);
    elTree.addEventListener('click', function (ev) {
        var b = ev.target.closest('.dmdl-node');
        if (b) pick(b.getAttribute('data-id'));
    });

    /* ---------- Chọn một bảng: nạp thuộc tính rồi dựng khung dữ liệu --- */
    function pick(id) {
        current = tables.filter(function (t) { return t.ID === id; })[0] || null;
        Array.prototype.forEach.call(elTree.querySelectorAll('.dmdl-node'), function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-id') === id);
        });
        if (!current) return;
        var token = pick.token = {};
        elData.innerHTML = '<div class="ums-panel">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>';

        ums.api.call({
            action: 'CMS_DanhMucThuocTinh/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            strCHUNG_TENDANHMUC_Id: id,
            pageIndex: 1,
            pageSize: 100,
            dTrangThai: 1
        }).then(function (r) {
            if (pick.token !== token) return;
            var attrs = rowsOf(r);
            if (!attrs.length) {
                elData.innerHTML = '<div class="ums-panel">' +
                    ui.empty('Bảng chưa được khai báo tham số thuộc tính!', 'fa-circle-info') + '</div>';
                return;
            }
            build(current, attrs);
        }).catch(function (err) {
            if (pick.token !== token) return;
            elData.innerHTML = '<div class="ums-panel">' + ui.fail(err.message) + '</div>';
            ums.api.handle(err, 'thuộc tính danh mục');
        });
    }

    function build(table, attrs) {
        var tableId = table.ID;
        var defs = [];
        attrs.forEach(function (a) {
            var k = KNOWN[a.TENTRUONGDULIEU];
            if (!k) return;
            defs.push({ name: a.TENTRUONGDULIEU, label: e(a.MOTA) || e(a.TENTRUONGDULIEU), k: k });
        });

        // Nguồn "dữ liệu cha": toàn bộ dữ liệu đang hoạt động của bảng (getList_DMDL_Cha)
        var CHA = {
            call: {
                action: 'CMS_DanhMucDuLieu/LayDanhSach',
                method: 'GET',
                strCha_Id: '',
                strTuKhoa: '',
                strCHUNG_TENDANHMUC_Id: tableId,
                strTieuChiSapXep: '',
                pageIndex: 1,
                pageSize: 1000000,
                dTrangThai: 1,
                strQUANHECHA_Id: ''
            },
            id: 'ID',
            name: function (r) { return e(r.TEN) + ' - ' + e(r.MA); }
        };

        var columns = defs.filter(function (d) { return !d.k.formOnly; }).map(function (d) {
            return {
                title: d.label,
                cls: d.k.cls || '',
                render: d.k.num
                    ? function (r) { return ui.esc(r[d.k.col] === null || r[d.k.col] === undefined || r[d.k.col] === '' ? 0 : r[d.k.col]); }
                    : function (r) { return ui.esc(r[d.k.col]); }
            };
        });

        var fields = defs.map(function (d) {
            return { key: d.k.key, col: d.k.col, label: d.label, required: !!d.k.required, type: d.k.num ? 'number' : 'text' };
        });
        fields.push({ key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true });
        fields.push({ key: 'strQuanHeCha_Id', col: 'QUANHECHA_ID', label: 'Dữ liệu cha', type: 'select', source: CHA, placeholder: 'Chọn quan hệ cha', span: true });

        elData.innerHTML = '';
        ums.crud({
            root: elData,
            embedded: true,
            title: 'Dữ liệu danh mục — ' + e(table.TENDANHMUC),
            formTitle: 'dữ liệu danh mục',
            icon: 'fa-circle-info',
            addText: 'Tạo mới',
            empty: 'Không tìm thấy dữ liệu!',

            filters: [
                { key: 'cha', type: 'select', label: 'Chọn quan hệ cha', source: CHA },
                { key: 'tt', type: 'select', label: 'Đang hoạt động', source: { items: [{ ID: '0', TEN: 'Dừng hoạt động' }] } },
                { key: 'q', type: 'text', label: 'Nhập từ khoá' }
            ].filter(function (x) { return CFG.loc.indexOf(x.key) >= 0; }),

            list: {
                call: function (f) {
                    return {
                        action: 'CMS_DanhMucDuLieu/LayDanhSach',
                        method: 'GET',
                        strCha_Id: e(f.cha),
                        strTuKhoa: f.q,
                        strCHUNG_TENDANHMUC_Id: tableId,
                        strTieuChiSapXep: '',
                        pageIndex: 1,
                        pageSize: 1000000,
                        // Bản gốc: ô chọn chỉ có 1/0, mặc định 1. Ở đây mục đầu (trống) = đang hoạt động.
                        dTrangThai: CFG.loc.indexOf('tt') < 0 ? CFG.trangThai : (f.tt === '' ? 1 : f.tt),
                        strQUANHECHA_Id: e(f.cha)
                    };
                }
            },

            columns: columns,

            detail: function (row) {
                return { action: 'CMS_DanhMucDuLieu/LayChiTiet', method: 'GET', strId: row.ID };
            },

            fields: fields,

            save: function (v, row) {
                var o = {
                    action: row ? 'CMS_DanhMucDuLieu/CapNhat' : 'CMS_DanhMucDuLieu/ThemMoi',
                    strMa: '', strTen: '', strQuanHeCha_Id: v.strQuanHeCha_Id,
                    strChung_TenDanhMuc_Id: tableId,
                    dHeSo1: 0, dHeSo2: 0, dHeSo3: 0,
                    strThongTin1: '', strThongTin2: '', strThongTin3: '', strThongTin4: '',
                    strThongTin5: '', strThongTin6: '', strThongTin7: '', strThongTin8: '',
                    strMoTa: v.strMoTa,
                    strId: row ? row.ID : '',
                    dTrangThai: 1,
                    strNguoiThucHien_Id: ''
                };
                defs.forEach(function (d) {
                    var val = v[d.k.key];
                    o[d.k.key] = d.k.num ? (val === '' || val === undefined ? 0 : val) : val;
                });
                return o;
            },

            remove: function (ids) {
                return {
                    action: 'CMS_DanhMucDuLieu/Xoa',
                    strId: ids.join(',') + ',',
                    strNguoiThucHien_Id: '',
                    dTrangThai: 1
                };
            },

            // Thêm/sửa làm thay đổi danh sách "dữ liệu cha" — nạp lại nguồn
            onSaved: function (crud) { delete CHA._p; crud.fillSources(); }
        });
    }

    loadTables();
})();
