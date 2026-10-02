/* =========================================================================
   Danh mục nghề (ApisNhanSu) — loại nghề · nhóm nghề · nhóm chức danh · cấp bậc nghề · nghề nghiệp
   Bản gốc: ApisNhanSu/Modules/cocautochuc/html/danhmucnghe.html + script/danhmucnghe.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc: dải NĂM tab, mỗi tab một khung (từ khoá + trạng thái + ô lọc riêng, nút Xóa / Thêm mới, bảng có
   cột Sửa + ô đánh dấu), mỗi tab một hộp biểu mẫu (#modalLoaiNghe, #modalNhomNghe, #modalChucDanh, #modalBacNghe,
   #modalNgheNghiep). Bản mới: ums.pat.sections — mỗi tab một ums.crud, biểu mẫu thay chỗ danh sách (BO-CUC luật 1).

   Lời gọi (NS_HoSoNhanSu3_MH · PKG_CORE_HOSONHANSU_03 — chép nguyên, strNguoiThucHien_Id tự điền):
     Loại nghề     LayDSCore_Job_CateGory {}                      · Them_/Sua_Core_Job_CateGory · Xoa_Core_Job_CateGory
     Nhóm nghề     LayDSCore_Job_Family { strCateGory_Id }        · Them_/Sua_Core_Job_Family   · Xoa_Core_Job_Family
     Chức danh     LayDSCore_Job_Group  { strFamily_Id }          · Them_/Sua_Core_Job_Group    · Xoa_Core_Job_Group
     Cấp bậc nghề  LayDSCore_Job_Level  {}                        · Them_/Sua_Core_Job_Level    · Xoa_Core_Job_Level
     Nghề nghiệp   LayDSCore_Job { strJob_Group_Id, strJob_Level_Id } · Them_/Sua_Core_Job      · Xoa_Core_Job
     Lưu: strId (sửa) + strCode, strName (nghề nghiệp: strJob_Code, strJob_Name, strJob_Group_Id, strJob_Level_Id;
          nhóm nghề: strCateGory_Id; chức danh: strFamily_Id), dSort_Order, strStart_Date, strEnd_Date, dIs_Active,
          strDescription. Xoá: strId — mỗi dòng một lời gọi.
   Giữ nghiệp vụ của gốc:
     · Từ khoá (Mã / Tên) và Trạng thái lọc ở MÁY KHÁCH (procedure không nhận); danh sách xếp theo SORT_ORDER rồi
       tên; tab Nhóm nghề chưa chọn loại thì xếp theo loại nghề trước (sortNhomNgheByCategoryAndSortOrder).
     · Dời thứ tự (_shiftSortOrdersIfNeeded): lưu một dòng với Thứ tự = n thì mọi dòng CÙNG PHẠM VI có thứ tự ≥ n
       (trừ chính nó) được đẩy +1 bằng lời gọi Sua_* TRƯỚC khi lưu (nhóm nghề: cùng loại; chức danh: cùng nhóm nghề;
       nghề nghiệp: cùng chức danh + bậc; loại nghề / bậc nghề: toàn bộ). Lỗi từng dòng bỏ qua như gốc.
     · Ô "Nhóm nghề" lọc theo "Loại nghề", ô "Chức danh" lọc theo "Nhóm nghề" (lọc trên danh sách đã tải — gốc
       applyFilter_*); chỉ Nhóm nghề (tab chức danh) và Chức danh + Bậc nghề (tab nghề nghiệp) gửi vào procedure.
   Khác gốc:
     · Ô cha → con Loại nghề → Nhóm nghề (→ Chức danh) ở thanh lọc nay theo luật chung: chưa chọn cha thì KHOÁ con,
       đổi / xoá cha thì xoá trắng con (ums.pat.chain).
     · Biểu mẫu Loại nghề / Nghề nghiệp không có ô Thứ tự (html gốc thiếu txtThuTu_LN / txtThuTu_DM) → dSort_Order
       gửi rỗng như gốc.
     · Nhãn "Thuộc loại nghề nghiệp" của biểu mẫu Chức danh thực chất là ô NHÓM NGHỀ (strFamily_Id) — đổi nhãn
       thành "Thuộc nhóm nghề" cho đúng dữ liệu.
   Cố ý bỏ: khối "Danh mục nghề KLGD" (getList_DanhMucNghe / save_DanhMucNghe / delete_DanhMucNghe,
     getList_ThoiGian / KeHoachTongHop / KeHoachChiTiet — PKG_KLGV_V2_*) — chép từ màn khác, html không có vùng
     tblDanhMucNghe / nút btnAdd_DanhMucNghe nên không bao giờ chạy.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-danhmucnghe');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    var H3 = 'NS_HoSoNhanSu3_MH/', P3 = 'PKG_CORE_HOSONHANSU_03.';

    /* Mã hoá action của từng thủ tục (chép nguyên gốc) */
    var A = {
        LayCate: 'DSA4BRICLjMkHgsuIx4CIDUkBi4zOAPP', ThemCate: 'FSkkLB4CLjMkHgsuIx4CIDUkBi4zOAPP', SuaCate: 'EjQgHgIuMyQeCy4jHgIgNSQGLjM4', XoaCate: 'GS4gHgIuMyQeCy4jHgIgNSQGLjM4',
        LayFam: 'DSA4BRICLjMkHgsuIx4HICwoLTgP', ThemFam: 'FSkkLB4CLjMkHgsuIx4HICwoLTgP', SuaFam: 'EjQgHgIuMyQeCy4jHgcgLCgtOAPP', XoaFam: 'GS4gHgIuMyQeCy4jHgcgLCgtOAPP',
        LayGrp: 'DSA4BRICLjMkHgsuIx4GMy40MQPP', ThemGrp: 'FSkkLB4CLjMkHgsuIx4GMy40MQPP', SuaGrp: 'EjQgHgIuMyQeCy4jHgYzLjQx', XoaGrp: 'GS4gHgIuMyQeCy4jHgYzLjQx',
        LayLvl: 'DSA4BRICLjMkHgsuIx4NJDckLQPP', ThemLvl: 'FSkkLB4CLjMkHgsuIx4NJDckLQPP', SuaLvl: 'EjQgHgIuMyQeCy4jHg0kNyQt', XoaLvl: 'GS4gHgIuMyQeCy4jHg0kNyQt',
        LayJob: 'DSA4BRICLjMkHgsuIwPP', ThemJob: 'FSkkLB4CLjMkHgsuIwPP', SuaJob: 'EjQgHgIuMyQeCy4j', XoaJob: 'GS4gHgIuMyQeCy4j'
    };
    function goi(ma, ham, them) {
        var o = { action: H3 + A[ma], func: P3 + ham, strNguoiThucHien_Id: '' };
        Object.keys(them || {}).forEach(function (k) { o[k] = them[k]; });
        return o;
    }

    /* ---------- Xếp thứ tự (sortBySortOrder / sortNhomNgheByCategoryAndSortOrder) ---------- */
    function so(v) { if (v === null || v === undefined || v === '') return null; var n = parseInt(v, 10); return isNaN(n) ? null : n; }
    function xep(rows) {
        return (rows || []).slice().sort(function (a, b) {
            var x = so(a.SORT_ORDER), y = so(b.SORT_ORDER);
            x = x === null ? 999999999 : x; y = y === null ? 999999999 : y;
            if (x !== y) return x - y;
            return e(a.NAME).localeCompare(e(b.NAME));
        });
    }
    function xepTheoLoai(rows, loai) {
        var meta = {};
        (loai || []).forEach(function (c) { var s = so(c.SORT_ORDER); meta[c.ID] = { so: s === null ? 999999999 : s, ten: e(c.NAME) }; });
        return (rows || []).slice().sort(function (a, b) {
            var ma = meta[a.CATEGORY_ID], mb = meta[b.CATEGORY_ID];
            var sa = ma ? ma.so : 999999999, sb = mb ? mb.so : 999999999;
            if (sa !== sb) return sa - sb;
            var c = (ma ? ma.ten : e(a.CORE_JOB_CATEGORY_NAME)).localeCompare(mb ? mb.ten : e(b.CORE_JOB_CATEGORY_NAME));
            if (c) return c;
            var x = so(a.SORT_ORDER), y = so(b.SORT_ORDER);
            x = x === null ? 999999999 : x; y = y === null ? 999999999 : y;
            if (x !== y) return x - y;
            return e(a.NAME).localeCompare(e(b.NAME));
        });
    }
    /* Lọc máy khách: từ khoá trên Mã / Tên, trạng thái 1/0 trên IS_ACTIVE */
    function loc(rows, f, ma, ten) {
        var q = e(f.q).toLowerCase();
        return rows.filter(function (x) {
            if (q && e(x[ma]).toLowerCase().indexOf(q) < 0 && e(x[ten]).toLowerCase().indexOf(q) < 0) return false;
            if (f.tt !== '' && f.tt !== undefined && (!!x.IS_ACTIVE) !== (f.tt === '1')) return false;
            return true;
        });
    }

    /* ---------- Danh sách "toàn bộ" cho ô chọn và cho việc dời thứ tự (loadFilterCombos) ---------- */
    var TOAN = {};
    function taiToan(k) {
        var p;
        if (k === 'cate') p = ums.api.call(goi('LayCate', 'LayDSCore_Job_CateGory')).then(function (r) { return xep(C.rows(r)); });
        else if (k === 'fam') p = ums.api.call(goi('LayFam', 'LayDSCore_Job_Family', { strCateGory_Id: '' }))
            .then(function (r) { return Promise.resolve(TOAN.cate).then(function (cate) { return xepTheoLoai(C.rows(r), cate); }); });
        else if (k === 'grp') p = ums.api.call(goi('LayGrp', 'LayDSCore_Job_Group', { strFamily_Id: '' })).then(function (r) { return xep(C.rows(r)); });
        else p = ums.api.call(goi('LayLvl', 'LayDSCore_Job_Level')).then(function (r) { return xep(C.rows(r)); });
        TOAN[k] = p.catch(function (err) { ums.api.handle(err, 'danh mục ' + k); return []; });
        return TOAN[k];
    }
    ['cate', 'fam', 'grp', 'lvl'].forEach(taiToan);
    /* Nguồn ô chọn của ums.crud: đặt sẵn _p (loadSource dùng lại) để có đúng thứ tự như gốc */
    var SRC = {
        cate: { call: {}, name: 'NAME' }, fam: { call: {}, name: 'NAME' }, grp: { call: {}, name: 'NAME' }, lvl: { call: {}, name: 'NAME' }
    };
    Object.keys(SRC).forEach(function (k) { SRC[k]._p = TOAN[k]; });

    /* _shiftSortOrdersIfNeeded + _updateSortOrderRow */
    var SUA = {
        cate: ['SuaCate', 'Sua_Core_Job_CateGory', function (r) { return {}; }],
        fam: ['SuaFam', 'Sua_Core_Job_Family', function (r) { return { strCateGory_Id: r.CATEGORY_ID }; }],
        grp: ['SuaGrp', 'Sua_Core_Job_Group', function (r) { return { strFamily_Id: r.FAMILY_ID }; }],
        lvl: ['SuaLvl', 'Sua_Core_Job_Level', function (r) { return {}; }],
        job: ['SuaJob', 'Sua_Core_Job', function (r) { return { strJob_Group_Id: r.JOB_GROUP_ID, strJob_Level_Id: r.JOB_LEVEL_ID, strJob_Code: r.JOB_CODE, strJob_Name: r.JOB_NAME }; }]
    };
    function doiThuTu(k, nguon, muon, idHienTai, phamVi) {
        var n = so(muon);
        if (n === null) return Promise.resolve();
        return Promise.resolve(nguon).then(function (ds) {
            var bi = (ds || []).filter(function (x) {
                if (!x || !x.ID || (idHienTai && x.ID === idHienTai)) return false;
                if (phamVi && !phamVi(x)) return false;
                var s = so(x.SORT_ORDER);
                return s !== null && s >= n;
            }).sort(function (a, b) { var x = so(a.SORT_ORDER), y = so(b.SORT_ORDER); if (x !== y) return y - x; return e(b.NAME).localeCompare(e(a.NAME)); });
            var da = {};
            bi.forEach(function (x) { var t = so(x.SORT_ORDER) + 1; while (da[t]) t++; x.__moi = t; da[t] = true; });
            var s = SUA[k];
            return bi.reduce(function (p, x) {
                return p.then(function () {
                    if (x.__moi === so(x.SORT_ORDER)) return;
                    var o = goi(s[0], s[1], { strId: x.ID, dSort_Order: x.__moi, strStart_Date: x.START_DATE, strEnd_Date: x.END_DATE,
                        dIs_Active: x.IS_ACTIVE, strDescription: x.DESCRIPTION });
                    if (k !== 'job') { o.strCode = x.CODE; o.strName = x.NAME; }
                    var t = s[2](x); Object.keys(t).forEach(function (kk) { o[kk] = t[kk]; });
                    o.silent = true;
                    return ums.api.call(o).catch(function () { /* gốc: bỏ qua, không chặn việc lưu */ });
                });
            }, Promise.resolve());
        });
    }

    var pg;   // ums.pat.sections — gán sau
    /* Lưu xong: nạp lại danh sách "toàn bộ" của loại vừa sửa rồi đổ lại ô chọn mọi tab (gốc: getList_*({forCombo})) */
    function lamMoi(k) {
        if (k && TOAN[k]) { taiToan(k); SRC[k]._p = TOAN[k]; if (k === 'cate') { taiToan('fam'); SRC.fam._p = TOAN.fam; } }
        ['loai', 'nhom', 'chucdanh', 'bac', 'nghe'].forEach(function (t) { var c = pg && pg.crud(t); if (c) c.fillSources(); });
        napLocCon();
    }
    /* save() chạy dời thứ tự TRƯỚC khi lưu → tự lưu rồi làm đúng việc của ums.crud (thông báo, về danh sách, nạp lại) */
    function luuSau(crud, k, nguon, v, row, phamVi, call) {
        doiThuTu(k, nguon, v.dSort_Order, row && row.ID, phamVi).then(function () { return ums.api.call(call); }).then(function () {
            ui.toast(row ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            crud.showList();
            crud.load();
            lamMoi(k);
        }).catch(function (err) { ums.api.handle(err, call.func); });
        return null;
    }

    var TT_ITEMS = { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] };
    function locTT() { return { key: 'tt', type: 'select', label: 'Trạng thái', source: TT_ITEMS }; }
    function cotChung(tenMa, tenTen, ma, ten, them, ttKieu) {
        return [
            { title: tenMa, prop: ma, cls: 'is-nowrap' },
            { title: tenTen, prop: ten }
        ].concat(them.truoc || []).concat([
            { title: 'Ngày hiệu lực', prop: 'START_DATE', cls: 'is-nowrap' },
            { title: 'Ngày hết hiệu lực', prop: 'END_DATE', cls: 'is-nowrap' },
            { title: 'Mô tả', prop: 'DESCRIPTION' }
        ]).concat(them.sau || []).concat([
            { title: 'Tình trạng', cls: 'is-center', render: function (x) {
                return x.IS_ACTIVE ? (ttKieu === 'rong' ? '' : ui.badge('Hiệu lực', 'ok')) : ui.badge('Hết hiệu lực', 'mute');
            } }
        ]);
    }
    function truongChung(them, coThuTu) {
        return (them.truoc || []).concat([
            { key: 'strStart_Date', col: 'START_DATE', label: 'Ngày hiệu lực', type: 'date' },
            { key: 'strEnd_Date', col: 'END_DATE', label: 'Ngày hết hiệu lực', type: 'date' },
            { key: 'strDescription', col: 'DESCRIPTION', label: 'Mô tả', type: 'textarea', span: true },
            { key: 'dIs_Active', col: 'IS_ACTIVE', label: 'Tình trạng', type: 'select', source: TT_ITEMS, value: '1', required: true }
        ]).concat(coThuTu ? [{ key: 'dSort_Order', col: 'SORT_ORDER', label: 'Thứ tự', type: 'number' }] : []);
    }
    function xoaNhieu(ma, ham) { return function (ids) { return ids.map(function (id) { return goi(ma, ham, { strId: id }); }); }; }

    pg = pat.sections({
        el: root, title: 'Danh mục nghề',
        tabs: [
            { key: 'loai', text: 'Danh mục loại nghề nghiệp', icon: 'fa-briefcase', sections: [{
                title: 'Danh mục loại nghề nghiệp', formTitle: 'loại nghề', icon: 'fa-list-timeline',
                filters: [{ key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' }, locTT()],
                list: {
                    call: function () { return goi('LayCate', 'LayDSCore_Job_CateGory'); },
                    rows: function (d, r) { return xep(loc(C.rows(r), pg.crud('loai').filterValues(), 'CODE', 'NAME')); }
                },
                columns: cotChung('Mã', 'Tên', 'CODE', 'NAME', {}),
                fields: [{ key: 'strCode', col: 'CODE', label: 'Mã nghề' }, { key: 'strName', col: 'NAME', label: 'Tên nghề' }].concat(truongChung({}, false)),
                rowDelete: false,
                save: function (v, row, crud) {
                    v.dSort_Order = '';   // txtThuTu_LN không có trên màn gốc
                    var c = goi(row ? 'SuaCate' : 'ThemCate', row ? 'Sua_Core_Job_CateGory' : 'Them_Core_Job_CateGory', {
                        strId: row ? row.ID : '', strCode: v.strCode, strName: v.strName, dSort_Order: v.dSort_Order,
                        strStart_Date: v.strStart_Date, strEnd_Date: v.strEnd_Date, dIs_Active: v.dIs_Active, strDescription: v.strDescription });
                    return luuSau(crud, 'cate', TOAN.cate, v, row, null, c);
                },
                remove: xoaNhieu('XoaCate', 'Xoa_Core_Job_CateGory')
            }] },
            { key: 'nhom', text: 'Danh mục nhóm nghề', icon: 'fa-people-group', sections: [{
                title: 'Danh mục nhóm nghề', formTitle: 'nhóm nghề', icon: 'fa-list-timeline',
                filters: [{ key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' }, locTT(), { key: 'loai', type: 'select', label: 'Chọn loại nghề', source: SRC.cate }],
                list: {
                    call: function (f) { return goi('LayFam', 'LayDSCore_Job_Family', { strCateGory_Id: f.loai }); },
                    rows: function (d, r) {
                        var f = pg.crud('nhom').filterValues(), ds = loc(C.rows(r), f, 'CODE', 'NAME');
                        return f.loai ? xep(ds) : ds;   // chưa chọn loại: xếp theo loại (chờ danh sách loại — xem onLoad)
                    }
                },
                onLoad: function (rows, crud) {
                    if (crud.filterValues().loai) return;
                    TOAN.cate.then(function (cate) { crud.rows = xepTheoLoai(crud.rows, cate); crud.draw(); });
                },
                columns: cotChung('Mã', 'Tên', 'CODE', 'NAME', { sau: [{ title: 'Thuộc loại nghề', prop: 'CORE_JOB_CATEGORY_NAME' }] }),
                fields: truongChung({ truoc: [
                    { key: 'strCateGory_Id', col: 'CATEGORY_ID', label: 'Thuộc loại nghề nghiệp', type: 'select', source: SRC.cate, placeholder: 'Chọn loại nghề', span: true },
                    { key: 'strCode', col: 'CODE', label: 'Mã' }, { key: 'strName', col: 'NAME', label: 'Tên' }] }, true),
                rowDelete: false,
                save: function (v, row, crud) {
                    var c = goi(row ? 'SuaFam' : 'ThemFam', row ? 'Sua_Core_Job_Family' : 'Them_Core_Job_Family', {
                        strId: row ? row.ID : '', strCateGory_Id: v.strCateGory_Id, strCode: v.strCode, strName: v.strName, dSort_Order: v.dSort_Order,
                        strStart_Date: v.strStart_Date, strEnd_Date: v.strEnd_Date, dIs_Active: v.dIs_Active, strDescription: v.strDescription });
                    return luuSau(crud, 'fam', TOAN.fam, v, row, function (x) { return x.CATEGORY_ID == v.strCateGory_Id; }, c);
                },
                remove: xoaNhieu('XoaFam', 'Xoa_Core_Job_Family')
            }] },
            { key: 'chucdanh', text: 'Danh mục nhóm chức danh', icon: 'fa-address-card', sections: [{
                title: 'Danh mục nhóm chức danh', formTitle: 'chức danh', icon: 'fa-list-timeline',
                filters: [{ key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' }, locTT(),
                    { key: 'loai', type: 'select', label: 'Chọn loại nghề', source: SRC.cate }, { key: 'nhom', type: 'select', label: 'Chọn nhóm nghề' }],
                list: {
                    call: function (f) { return goi('LayGrp', 'LayDSCore_Job_Group', { strFamily_Id: f.nhom }); },
                    rows: function (d, r) { return xep(loc(C.rows(r), pg.crud('chucdanh').filterValues(), 'CODE', 'NAME')); }
                },
                columns: cotChung('Mã', 'Tên', 'CODE', 'NAME', { sau: [{ title: 'Thuộc nhóm nghề', prop: 'CORE_JOB_FAMILY_NAME' }] }),
                fields: truongChung({ truoc: [
                    { key: 'strFamily_Id', col: 'FAMILY_ID', label: 'Thuộc nhóm nghề', type: 'select', source: SRC.fam, placeholder: 'Chọn nhóm nghề', span: true },
                    { key: 'strCode', col: 'CODE', label: 'Mã' }, { key: 'strName', col: 'NAME', label: 'Tên' }] }, true),
                rowDelete: false,
                save: function (v, row, crud) {
                    var c = goi(row ? 'SuaGrp' : 'ThemGrp', row ? 'Sua_Core_Job_Group' : 'Them_Core_Job_Group', {
                        strId: row ? row.ID : '', strFamily_Id: v.strFamily_Id, strCode: v.strCode, strName: v.strName, dSort_Order: v.dSort_Order,
                        strStart_Date: v.strStart_Date, strEnd_Date: v.strEnd_Date, dIs_Active: v.dIs_Active, strDescription: v.strDescription });
                    return luuSau(crud, 'grp', TOAN.grp, v, row, function (x) { return x.FAMILY_ID == v.strFamily_Id; }, c);
                },
                remove: xoaNhieu('XoaGrp', 'Xoa_Core_Job_Group')
            }] },
            { key: 'bac', text: 'Danh mục cấp bậc nghề', icon: 'fa-sitemap', sections: [{
                title: 'Danh mục cấp bậc nghề', formTitle: 'bậc nghề', icon: 'fa-list-timeline',
                filters: [{ key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' }, locTT()],
                list: {
                    call: function () { return goi('LayLvl', 'LayDSCore_Job_Level'); },
                    rows: function (d, r) { return xep(loc(C.rows(r), pg.crud('bac').filterValues(), 'CODE', 'NAME')); }
                },
                columns: cotChung('Mã', 'Tên', 'CODE', 'NAME', {}, 'rong'),
                fields: [{ key: 'strCode', col: 'CODE', label: 'Mã' }, { key: 'strName', col: 'NAME', label: 'Tên' }].concat(truongChung({}, true)),
                rowDelete: false,
                save: function (v, row, crud) {
                    var c = goi(row ? 'SuaLvl' : 'ThemLvl', row ? 'Sua_Core_Job_Level' : 'Them_Core_Job_Level', {
                        strId: row ? row.ID : '', strCode: v.strCode, strName: v.strName, dSort_Order: v.dSort_Order,
                        strStart_Date: v.strStart_Date, strEnd_Date: v.strEnd_Date, dIs_Active: v.dIs_Active, strDescription: v.strDescription });
                    return luuSau(crud, 'lvl', TOAN.lvl, v, row, null, c);
                },
                remove: xoaNhieu('XoaLvl', 'Xoa_Core_Job_Level')
            }] },
            { key: 'nghe', text: 'Danh mục nghề nghiệp', icon: 'fa-briefcase', sections: [{
                title: 'Danh mục nghề nghiệp', formTitle: 'nghề nghiệp', icon: 'fa-list-timeline',
                filters: [{ key: 'q', type: 'text', label: 'Từ khóa tìm kiếm' }, locTT(),
                    { key: 'loai', type: 'select', label: 'Chọn loại nghề', source: SRC.cate }, { key: 'nhom', type: 'select', label: 'Chọn nhóm nghề' },
                    { key: 'chucdanh', type: 'select', label: 'Chọn chức danh' }, { key: 'bac', type: 'select', label: 'Chọn bậc nghề', source: SRC.lvl }],
                list: {
                    call: function (f) { return goi('LayJob', 'LayDSCore_Job', { strJob_Group_Id: f.chucdanh, strJob_Level_Id: f.bac }); },
                    rows: function (d, r) { return xep(loc(C.rows(r), pg.crud('nghe').filterValues(), 'JOB_CODE', 'JOB_NAME')); }
                },
                columns: [
                    { title: 'Mã nghề', prop: 'JOB_CODE', cls: 'is-nowrap' }, { title: 'Tên nghề', prop: 'JOB_NAME' },
                    { title: 'Nhóm chức danh', prop: 'CORE_JOB_GROUP_NAME' }, { title: 'Cấp bậc nghề', prop: 'CORE_JOB_LEVEL_NAME' },
                    { title: 'Ngày hiệu lực', prop: 'START_DATE', cls: 'is-nowrap' }, { title: 'Ngày hết hiệu lực', prop: 'END_DATE', cls: 'is-nowrap' },
                    { title: 'Mô tả', prop: 'DESCRIPTION' },
                    { title: 'Tình trạng', cls: 'is-center', render: function (x) { return x.IS_ACTIVE ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute'); } }
                ],
                fields: [
                    { key: 'strJob_Code', col: 'JOB_CODE', label: 'Mã nghề' }, { key: 'strJob_Name', col: 'JOB_NAME', label: 'Tên nghề' },
                    { key: 'strJob_Group_Id', col: 'JOB_GROUP_ID', label: 'Nhóm chức danh', type: 'select', source: SRC.grp, placeholder: 'Chọn chức danh' },
                    { key: 'strJob_Level_Id', col: 'JOB_LEVEL_ID', label: 'Cấp bậc nghề', type: 'select', source: SRC.lvl, placeholder: 'Chọn bậc nghề' }
                ].concat(truongChung({}, false)),
                rowDelete: false,
                save: function (v, row, crud) {
                    v.dSort_Order = '';   // txtThuTu_DM không có trên màn gốc
                    var c = goi(row ? 'SuaJob' : 'ThemJob', row ? 'Sua_Core_Job' : 'Them_Core_Job', {
                        strId: row ? row.ID : '', strJob_Group_Id: v.strJob_Group_Id, strJob_Level_Id: v.strJob_Level_Id,
                        strJob_Code: v.strJob_Code, strJob_Name: v.strJob_Name, dSort_Order: v.dSort_Order,
                        strStart_Date: v.strStart_Date, strEnd_Date: v.strEnd_Date, dIs_Active: v.dIs_Active, strDescription: v.strDescription });
                    return luuSau(crud, 'job', crud.rows, v, row, function (x) { return x.JOB_GROUP_ID == v.strJob_Group_Id && x.JOB_LEVEL_ID == v.strJob_Level_Id; }, c);
                },
                remove: xoaNhieu('XoaJob', 'Xoa_Core_Job')
            }] }
        ]
    });

    /* ---------- Ô lọc cha → con: Loại nghề → Nhóm nghề (→ Chức danh) — applyFilter_* của gốc ---------- */
    function oLoc(tab, k) { var c = pg.crud(tab); return c.root.querySelector('[data-cf="' + c.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }
    function napLocCon() {
        Promise.all([TOAN.fam, TOAN.grp]).then(function (x) {
            [['chucdanh', 'loai', 'nhom'], ['nghe', 'loai', 'nhom']].forEach(function (t) {
                var cha = oLoc(t[0], t[1]).value;
                var dsNhom = cha ? x[0].filter(function (r) { return r.CATEGORY_ID == cha; }) : [];
                pat.fill(oLoc(t[0], t[2]), dsNhom, { name: 'NAME', head: 'Chọn nhóm nghề' });
            });
            var nhom = oLoc('nghe', 'nhom').value;
            pat.fill(oLoc('nghe', 'chucdanh'), nhom ? x[1].filter(function (r) { return r.FAMILY_ID == nhom; }) : [], { name: 'NAME', head: 'Chọn chức danh' });
        });
    }
    ['chucdanh', 'nghe'].forEach(function (tab) {
        var loai = oLoc(tab, 'loai'), nhom = oLoc(tab, 'nhom'), cd = tab === 'nghe' ? oLoc(tab, 'chucdanh') : null;
        jQuery(loai).on('change', function () { napLocCon(); });
        if (cd) jQuery(nhom).on('change', function () { napLocCon(); });
        pat.chain(cd ? [loai, nhom, cd] : [loai, nhom], { phatLai: false });
    });
    napLocCon();

    /* Gõ từ khoá là lọc (gốc: debounce 250 ms trên sự kiện input) */
    ['loai', 'nhom', 'chucdanh', 'bac', 'nghe'].forEach(function (t) {
        var o = oLoc(t, 'q'), hen = 0;
        o.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { pg.crud(t).load(1); }, 250); });
    });
})();
