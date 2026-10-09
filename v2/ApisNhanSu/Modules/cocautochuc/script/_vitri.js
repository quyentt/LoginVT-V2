/* =========================================================================
   ApisNhanSu / cocautochuc — khung chung "cây đơn vị → vị trí công việc" (ums.nsViTri)
   Dùng ở: vitricongviec (Vị trí công việc) và vaitrovitri (Khai vai trò theo vị trí công việc — tab 1).
   Hai tệp gốc chép nhau phần này (vitricongviec.js ↔ vaitrovitri..js).
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột col-sm-3 | col-sm-9):
     trái  — Loại đơn vị (CORE.DONVI.LOAIQUANHE), Trạng thái, "Xem cấu trúc tại ngày", Từ khoá (gợi ý tự
             động theo LayDSCore_Org_Unit), nút Tìm kiếm;
     phải  — "Danh sách đơn vị hành chính" (số lượng) + cây jstree.
   Bấm nút cây → hộp #modalCongViec "Chi tiết vị trí công việc — <đơn vị>" (bảng vị trí + Xóa / Thêm mới)
   → hộp #modalAddCongViec (biểu mẫu vị trí). Bản vaitrovitri thêm cột "Vai trò" (tên vai trò đã gán + nút
   "Điều chỉnh" → hộp #modalDieuChinhRole → hộp #modalAddRole).
   Bản mới: các "hộp" đó thành khung THAY CHỖ nhau ngay trong cột phải (BO-CUC luật 1): cây → vị trí →
   biểu mẫu vị trí / vai trò của vị trí → biểu mẫu thêm vai trò; mỗi khung có nút Đóng quay lại khung trước.

   Lời gọi (chép nguyên):
     NS_CoCauToChuc/LayDanhSach   GET  dTrangThai = ô Trạng thái || 1, strLoaiCoCauToChuc_Id = ô Loại đơn vị,
                                       strCoCauToChucCha_Id ''
     NS_HoSoNhanSu3_MH · PKG_CORE_HOSONHANSU_03
       LayDSCore_PositionByUnit   strOrg_Unit_Id = nút cây
       Them_Core_Position | Sua_Core_Position (có strId)
                                  strId, strPosition_Code, strPosition_Name, strPosition_Short_Name,
                                  strPosition_Type_Code (CORE.DONVI.LOAIVITRI), strOrg_Unit_Id, dMax_HeadCount,
                                  dIs_Key_Position, dIs_Active, strStart_Date, strEnd_Date, strDescription,
                                  strJob_Ids (ô chọn nhiều, nối dấu phẩy), strNguoiThucHien_Id
       Xoa_Core_Position          strId (mỗi dòng một lời gọi)
       LayDSCore_Job              strJob_Group_Id '', strJob_Level_Id '' (ô dropAAAA) → ô "chức danh nghề nghiệp" (JOB_NAME)
     (vaitrovitri) CMS_QuanTri03_MH · PKG_CORE_QUANTRI_03
       Pr_Core_Position_Role_Map_Gets  strTuKhoa '', strPosition_Id, strRole_Id '', dIs_Active '', strNguoiThucHien_Id,
                                       strVaiTroDangNhap_Id '', strChucNangHeThong_Id '', strHanhDong_Code ''
       Pr_Core_Position_Role_Map_In    strPosition_Id, strRole_Id, strStart_Date, strEnd_Date, dIs_Active, strNote, (+ 4 như trên)
     CMS_VaiTro/LayDanhSach  GET  strLoaiVaiTro_Id '', strTuKhoa '', pageIndex 1, pageSize 1000, dTrangThai 1 (TENVAITRO)

   ums.nsViTri.man(host, { tieuDe (tiêu đề trang — bỏ trống khi màn đã có tiêu đề), vaiTro: true|false })
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    var TT = '<option value="1">Hiệu lực</option><option value="0">Hết hiệu lực</option>';
    var H3 = 'NS_HoSoNhanSu3_MH/', P3 = 'PKG_CORE_HOSONHANSU_03.';
    var Q3 = 'CMS_QuanTri03_MH/', PQ3 = 'PKG_CORE_QUANTRI_03.';

    var V = ums.nsViTri = {};

    /* CMS_VaiTro/LayDanhSach — ô "Chọn vai trò" (dùng ở cả ba tab của vaitrovitri) */
    var vaiTroP = null;
    V.vaiTro = function () {
        if (vaiTroP) return vaiTroP;
        vaiTroP = ums.api.call({ action: 'CMS_VaiTro/LayDanhSach', method: 'GET', strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 })
            .then(C.rows, function (err) { vaiTroP = null; ums.api.handle(err, 'CMS_VaiTro/LayDanhSach'); return []; });
        return vaiTroP;
    };
    V.TT = TT;
    V.badgeTT = function (x) { return x.IS_ACTIVE == 1 ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute'); };
    V.tenVaiTro = function (x) { return e(x.ROLE_NAME || x.TENVAITRO || x.TEN); };
    V.o = function (label, ctl, op) { return '<div' + (op && op.rong ? ' class="nscc-span"' : '') + '>' + ui.field(label, ctl, op) + '</div>'; };
    V.ngay = function (k) {
        return '<div class="ums-inputwrap"><input class="ums-input" data-scope="form" data-type="date" data-k="' + k + '" autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>';
    };
    V.dat = function (host, k, v) {
        var el = host.querySelector('[data-k="' + k + '"]');
        if (!el) return;
        if (el.multiple) jQuery(el).val(v || []).trigger('change.select2').trigger('ums:refresh');
        else { el.value = e(v); if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2'); }
        if (el._flatpickr) el._flatpickr.setDate(v || null, false, 'd/m/Y');
        el.classList.remove('is-invalid');
    };
    V.lay = function (host, k) {
        var el = host.querySelector('[data-k="' + k + '"]');
        if (!el) return '';
        if (el.multiple) return (jQuery(el).val() || []).filter(function (x) { return x && x !== 'SELECTALL'; }).join(',');
        return e(el.value).trim();
    };

    V.man = function (host, cfg) {
        var vaiTro = !!cfg.vaiTro;
        var mst = pat.master({
            el: host,
            title: cfg.tieuDe,
            side: {
                title: 'Tìm kiếm', icon: 'fa-filter', search: false,
                /* Luật cột trái (BO-CUC 12): ô tìm chuẩn trên cùng, còn lại vào Bộ lọc nâng cao (pat.cotTrai) */
                filter: '<div class="ums-master__search"><div class="ums-searchbar ums-searchbar--sm">' +
                    '<span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                    '<input class="ums-searchbar__input" data-a="q" autocomplete="off" placeholder="Từ khóa tìm kiếm"></div></div>' +
                    '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-a="loai" data-ph="Loại đơn vị"><option value="">Loại đơn vị</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-a="tt" data-ph="Trạng thái"><option value="">Trạng thái</option>' + TT + '</select></div>' +
                    '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-a="ngay" autocomplete="off" placeholder="Xem cấu trúc tại ngày dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div></div>' +
                    '<div class="ums-field">' + ui.btn('search', { attr: { 'data-a': 'tim' }, cls: 'ums-u-w100' }) + '</div>' +
                    '</div>'
            },
            main: { title: false }
        });
        mst.sideBody.hidden = true;
        mst.sideFoot.hidden = true;
        var root = mst.el;
        var sLoai = root.querySelector('[data-a="loai"]'), sTT = root.querySelector('[data-a="tt"]');
        var iNgay = root.querySelector('[data-a="ngay"]'), iQ = root.querySelector('[data-a="q"]');
        iNgay.value = C.homNay();

        var o = V.o, ngay = V.ngay;
        mst.mainBody.innerHTML =
            '<div data-z="ds">' + pat.panel({ title: 'Danh sách đơn vị hành chính', icon: 'fa-sitemap', count: 'dem', flush: true,
                body: '<div class="nscc-cay ums-master--danhmuc"><div class="ums-master__list" data-z="cay"></div></div>' }) + '</div>' +
            '<div data-z="vt" hidden>' + pat.panel({ title: 'Chi tiết vị trí công việc', icon: 'fa-user-tie', count: 'vtDem', flush: true, zone: 'vtBang',
                tools: ui.btn('close', { attr: { 'data-a': 'dongvt' } }) +
                    ui.xoaChon('input[data-vtck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoavt' } }) +
                    ui.btn('add', { attr: { 'data-a': 'themvt' } }) }) + '</div>' +
            '<div data-z="form" hidden>' + pat.panel({ title: 'Vị trí', icon: 'fa-pen-to-square', zone: 'formBody',
                tools: ui.btn('close', { attr: { 'data-a': 'dongform' } }) + ui.btn('save', { attr: { 'data-a': 'luuvt' } }),
                body: '<div class="ums-legend">Thông tin vị trí công việc</div><div class="ums-grid ums-grid--2">' +
                    o('Mã vị trí', '<input class="ums-input" data-scope="form" data-k="ma" autocomplete="off">') +
                    o('Tên vị trí', '<input class="ums-input" data-scope="form" data-k="ten" autocomplete="off">') +
                    o('Tên viết tắt', '<input class="ums-input" data-scope="form" data-k="tenviettat" autocomplete="off">') +
                    o('Kiểu/Phân loại', '<select class="ums-select" data-scope="form" data-k="phanloai" data-ph="Chọn kiểu/phân loại"><option value="">Chọn kiểu/phân loại</option></select>') +
                    o('Là vị trí chủ chốt', '<select class="ums-select" data-scope="form" data-k="chuchot" data-required><option value="1">Chủ chốt</option><option value="0">Không phải chủ chốt</option></select>') +
                    o('Headcount tối đa', '<input class="ums-input" data-scope="form" data-k="headcount" inputmode="numeric" autocomplete="off">') +
                    o('Bao gồm các chức danh nghề nghiệp', '<select class="ums-select" data-scope="form" data-k="chucdanh" multiple data-ph="Chọn chức danh"></select>', { rong: true }) +
                    o('Ngày bắt đầu hiệu lực', ngay('hieuluc')) + o('Ngày kết thúc hiệu lực', ngay('hethieuluc')) +
                    o('Mô tả', '<textarea class="ums-textarea" data-scope="form" data-k="mota"></textarea>', { rong: true }) +
                    o('Tình trạng', '<select class="ums-select" data-scope="form" data-k="tt" data-required>' + TT + '</select>') +
                    '</div>' }) + '</div>' +
            (vaiTro ?
                '<div data-z="vr" hidden>' + pat.panel({ title: 'Vai trò đã gán cho vị trí', icon: 'fa-user-shield', flush: true, zone: 'vrBang',
                    tools: ui.btn('close', { attr: { 'data-a': 'dongvr' } }) +
                        ui.xoaChon('input[data-vrck]', { goc: '.ums-panel', text: 'Xóa', attr: { title: 'Bản gốc chưa có xử lý xoá vai trò của vị trí' } }) +
                        ui.btn('add', { text: 'Thêm vai trò', attr: { 'data-a': 'themvr' } }) }) + '</div>' +
                '<div data-z="vrform" hidden>' + pat.panel({ title: 'Thêm vai trò cho vị trí', icon: 'fa-plus', zone: 'vrBody',
                    tools: ui.btn('close', { attr: { 'data-a': 'dongvrform' } }) + ui.btn('save', { attr: { 'data-a': 'luuvr' } }),
                    body: '<div class="ums-grid ums-grid--2">' +
                        o('Chọn vai trò', '<select class="ums-select" data-scope="form" data-k="role" data-ph="Chọn vai trò"><option value="">Chọn vai trò</option></select>', { rong: true }) +
                        o('Ngày hiệu lực', ngay('rtu')) + o('Ngày hết hiệu lực', ngay('rden')) +
                        o('Tình trạng', '<select class="ums-select" data-scope="form" data-k="rtt" data-required>' + TT + '</select>') +
                        o('Ghi chú', '<textarea class="ums-textarea" data-scope="form" data-k="rghichu"></textarea>', { rong: true }) +
                        '</div>' }) + '</div>' : '');

        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        var fBody = z('formBody'), vrBody = z('vrBody');
        var elCay = z('cay');
        var S = { ds: [], dv: null, vt: [], sua: null, vtChon: null, role: [] };
        var vung = 'ds';
        function sang(k) {
            if (k === vung) return;
            ui.swap(z(vung), z(k), { top: false });
            vung = k;
        }

        /* ---------- Danh mục ---------- */
        ums.api.dm('CORE.DONVI.LOAIQUANHE').then(function (r) { pat.fill(sLoai, r, { head: 'Loại đơn vị' }); })
            .catch(function (err) { ums.api.handle(err, 'CORE.DONVI.LOAIQUANHE'); });
        ums.api.dm('CORE.DONVI.LOAIVITRI').then(function (r) { pat.fill(fBody.querySelector('[data-k="phanloai"]'), r, { head: 'Chọn kiểu/phân loại' }); })
            .catch(function (err) { ums.api.handle(err, 'CORE.DONVI.LOAIVITRI'); });
        ums.api.call({ action: H3 + 'DSA4BRICLjMkHgsuIwPP', func: P3 + 'LayDSCore_Job', strJob_Group_Id: '', strJob_Level_Id: '', strNguoiThucHien_Id: '' })
            .then(function (r) { pat.fill(fBody.querySelector('[data-k="chucdanh"]'), C.rows(r), { name: 'JOB_NAME' }); })
            .catch(function (err) { ums.api.handle(err, 'LayDSCore_Job'); });

        /* ---------- Cây ---------- */
        function napCay() {
            elCay.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return C.coCau({ dTrangThai: sTT.value || 1, strLoaiCoCauToChuc_Id: sLoai.value }).then(function (rows) {
                S.ds = rows;
                z('dem').textContent = '(' + rows.length + ')';
                C.cay(elCay, rows, { chon: S.dv && S.dv.ID });
                C.loc(elCay, iQ.value);
            }).catch(function (err) { elCay.innerHTML = ui.fail(err.message); ums.api.handle(err, 'NS_CoCauToChuc/LayDanhSach'); });
        }

        /* ---------- Vị trí của đơn vị ---------- */
        function napViTri() {
            var dv = S.dv;
            if (!dv) return Promise.resolve();
            z('vtBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return C.viTri(dv.ID).then(function (rows) {
                if (S.dv !== dv) return;
                S.vt = rows;
                z('vtDem').textContent = '(' + rows.length + ')';
                var cot = [
                    { title: 'Mã vị trí', prop: 'POSITION_CODE', cls: 'is-nowrap' },
                    { title: 'Tên vị trí', prop: 'POSITION_NAME' },
                    { title: 'Tên viết tắt', prop: 'POSITION_SHORT_NAME' },
                    { title: 'Kiểu/Phân loại', prop: 'POSITION_TYPE_CODE_NAME' },
                    { title: 'Là vị trí chủ chốt', cls: 'is-center', render: function (x) { return x.IS_KEY_POSITION == 1 ? ui.badge('Chủ chốt', 'info') : ''; } },
                    { title: 'Chức danh nghề nghiệp', prop: 'JOB' },
                    { title: 'Headcount tối đa', prop: 'MAX_HEADCOUNT', cls: 'is-right' },
                    { title: 'Ngày bắt đầu hiệu lực', prop: 'START_DATE', cls: 'is-nowrap' },
                    { title: 'Ngày kết thúc hiệu lực', prop: 'END_DATE', cls: 'is-nowrap' },
                    { title: 'Mô tả', prop: 'DESCRIPTION' },
                    { title: 'Tình trạng', cls: 'is-center', render: vaiTro ? V.badgeTT : function (x) { return x.IS_ACTIVE ? '' : ui.badge('Hết hiệu lực', 'mute'); } }
                ];
                if (vaiTro) cot.push({ title: 'Vai trò', cls: 'is-center', render: function (x) {
                    return '<span class="nscc-vaitro" data-vtrole="' + ui.esc(x.ID) + '"></span>' +
                        ui.btn('edit', { text: 'Điều chỉnh', cls: 'ums-btn--sm', attr: { 'data-dieuchinh': x.ID } });
                } });
                else cot.push({ title: 'Sửa', cls: 'is-center is-actions', render: function (x) { return ui.iconBtn('edit', x.ID); } });
                cot.push({ head: '<input type="checkbox" data-vtall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (x) { return '<input type="checkbox" data-vtck="' + ui.esc(x.ID) + '">'; } });
                ui.table({ el: z('vtBang'), rows: rows, columns: cot, empty: 'Đơn vị chưa khai vị trí công việc' });
                if (vaiTro) rows.forEach(function (x) { tenVaiTroCuaViTri(x.ID); });
            });
        }
        function moViTri(dv) {
            S.dv = dv;
            C.chon(elCay, dv.ID);
            z('vt').querySelector('.ums-panel__title').firstChild.nextSibling.textContent = ' Chi tiết vị trí công việc — ' + e(dv.TEN) + ' ';
            sang('vt');
            napViTri();
        }

        /* Vai trò đã gán của một vị trí → ô "Vai trò" (getRoles_ByPosition — mỗi dòng một lời gọi như gốc) */
        function goiVaiTro(posId) {
            return ums.api.call({
                action: Q3 + 'ETMeAi4zJB4RLjIoNSguLx4TLi0kHgwgMR4GJDUy', func: PQ3 + 'Pr_Core_Position_Role_Map_Gets',
                strTuKhoa: '', strPosition_Id: posId, strRole_Id: '', dIs_Active: '', strNguoiThucHien_Id: '',
                strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '', silent: true
            }).then(C.rows);
        }
        function tenVaiTroCuaViTri(posId) {
            goiVaiTro(posId).then(function (ds) {
                var o2 = z('vtBang').querySelector('[data-vtrole="' + posId + '"]');
                if (o2) o2.textContent = ds.map(V.tenVaiTro).filter(Boolean).join(', ');
            }).catch(function () { /* gốc im lặng khi lỗi */ });
        }

        /* ---------- Biểu mẫu vị trí ---------- */
        function moForm(row) {
            S.sua = row || null;
            var d = function (k, v) { V.dat(fBody, k, v); };
            d('ma', row ? row.POSITION_CODE : ''); d('ten', row ? row.POSITION_NAME : ''); d('tenviettat', row ? row.POSITION_SHORT_NAME : '');
            d('phanloai', row ? row.POSITION_TYPE_CODE : ''); d('chuchot', row && row.IS_KEY_POSITION !== null && row.IS_KEY_POSITION !== undefined ? row.IS_KEY_POSITION : '1');
            d('chucdanh', row && row.JOB_ID ? String(row.JOB_ID).split(',') : []);
            d('headcount', row ? row.MAX_HEADCOUNT : ''); d('hieuluc', row ? row.START_DATE : ''); d('hethieuluc', row ? row.END_DATE : '');
            d('mota', row ? row.DESCRIPTION : ''); d('tt', row && row.IS_ACTIVE !== null && row.IS_ACTIVE !== undefined ? row.IS_ACTIVE : '1');
            z('form').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light ' + (row ? 'fa-pen-to-square' : 'fa-plus') + '"></i> Vị trí — ' + ui.esc(e(S.dv && S.dv.TEN));
            sang('form');
        }
        function luuViTri() {
            var sua = S.sua, L = function (k) { return V.lay(fBody, k); };
            var c = {
                action: sua ? H3 + 'EjQgHgIuMyQeES4yKDUoLi8P' : H3 + 'FSkkLB4CLjMkHhEuMig1KC4v',
                func: sua ? P3 + 'Sua_Core_Position' : P3 + 'Them_Core_Position',
                strId: sua ? sua.ID : '',
                strPosition_Code: L('ma'), strPosition_Name: L('ten'), strPosition_Short_Name: L('tenviettat'),
                strPosition_Type_Code: L('phanloai'), strOrg_Unit_Id: S.dv ? S.dv.ID : '',
                dMax_HeadCount: L('headcount'), dIs_Key_Position: L('chuchot'), dIs_Active: L('tt'),
                strStart_Date: L('hieuluc'), strEnd_Date: L('hethieuluc'), strDescription: L('mota'),
                strJob_Ids: L('chucdanh'), strNguoiThucHien_Id: ''
            };
            ums.api.call(c).then(function () {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                sang('vt');
                napViTri();
            }).catch(function (err) { ums.api.handle(err, c.func); });
        }
        function xoaViTri() {
            var ids = Array.prototype.map.call(z('vtBang').querySelectorAll('input[data-vtck]:checked'), function (c) { return c.getAttribute('data-vtck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: H3 + 'GS4gHgIuMyQeES4yKDUoLi8P', func: P3 + 'Xoa_Core_Position', strId: id, strNguoiThucHien_Id: '' };
                }), { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công!' }).then(napViTri);
            });
        }

        /* ---------- Vai trò của vị trí (vaitrovitri) ---------- */
        function moVaiTro(pos) {
            S.vtChon = pos;
            z('vr').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-user-shield"></i> Vai trò đã gán cho vị trí: ' + ui.esc(e(pos.POSITION_NAME));
            sang('vr');
            napVaiTro();
        }
        function napVaiTro() {
            var pos = S.vtChon;
            z('vrBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            goiVaiTro(pos.ID).then(function (ds) {
                if (S.vtChon !== pos) return;
                S.role = ds;
                ui.table({
                    el: z('vrBang'), rows: ds, empty: 'Vị trí chưa được gán vai trò nào',
                    columns: [
                        { title: 'Vị trí', render: function (x) { return ui.esc(e(x.POSITION_NAME) || e(pos.POSITION_NAME)); } },
                        { title: 'Vai trò', prop: 'ROLE_NAME' },
                        { title: 'Ngày hiệu lực', prop: 'START_DATE', cls: 'is-nowrap is-center' },
                        { title: 'Ngày hết hiệu lực', prop: 'END_DATE', cls: 'is-nowrap is-center' },
                        { title: 'Tình trạng', cls: 'is-center', render: V.badgeTT },
                        { title: 'Ghi chú', prop: 'NOTE' }
                    ]
                });
            }).catch(function (err) { z('vrBang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'Pr_Core_Position_Role_Map_Gets'); });
        }
        function moFormVaiTro() {
            ['role', 'rtu', 'rden', 'rghichu'].forEach(function (k) { V.dat(vrBody, k, ''); });
            V.dat(vrBody, 'rtt', '1');
            V.vaiTro().then(function (rows) { pat.fill(vrBody.querySelector('[data-k="role"]'), rows, { name: 'TENVAITRO', head: 'Chọn vai trò' }); });
            sang('vrform');
        }
        function luuVaiTro() {
            var L = function (k) { return V.lay(vrBody, k); };
            var pos = S.vtChon;
            ums.api.call({
                action: Q3 + 'ETMeAi4zJB4RLjIoNSguLx4TLi0kHgwgMR4ILwPP', func: PQ3 + 'Pr_Core_Position_Role_Map_In',
                strPosition_Id: pos.ID, strRole_Id: L('role'), strStart_Date: L('rtu'), strEnd_Date: L('rden'),
                dIs_Active: L('rtt'), strNote: L('rghichu'), strNguoiThucHien_Id: '',
                strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
            }).then(function () {
                ui.toast('Thêm vai trò thành công!', 'ok');
                sang('vr');
                napVaiTro();
                tenVaiTroCuaViTri(pos.ID);
            }).catch(function (err) { ums.api.handle(err, 'Pr_Core_Position_Role_Map_In'); });
        }

        /* ---------- Sự kiện ---------- */
        iQ.addEventListener('input', function () { C.loc(elCay, iQ.value); });
        iQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napCay(); } });
        jQuery(sLoai).on('select2:select', function () { napCay(); });
        ums.pat.cotTrai({ side: mst.side, search: iQ }, { tai: function () { napCay(); }, tuTim: false });   // gõ = lọc cây tại chỗ
        elCay.addEventListener('click', function (ev) {
            var b = ev.target.closest('.nscc-node');
            if (!b) return;
            var dv = S.ds.filter(function (r) { return r.ID === b.getAttribute('data-id'); })[0];
            if (dv) moViTri(dv);
        });
        root.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-vtall')) {
                Array.prototype.forEach.call(z('vtBang').querySelectorAll('input[data-vtck]'), function (c) { c.checked = ev.target.checked; });
            }
        });
        root.addEventListener('click', function (ev) {
            var ed = ev.target.closest('[data-act="edit"]');
            if (ed && z('vtBang').contains(ed)) {
                var r = S.vt.filter(function (x) { return x.ID === ed.getAttribute('data-id'); })[0];
                if (r) moForm(r);
                return;
            }
            var dc = ev.target.closest('[data-dieuchinh]');
            if (dc && root.contains(dc)) {
                var p = S.vt.filter(function (x) { return x.ID === dc.getAttribute('data-dieuchinh'); })[0];
                if (p) moVaiTro(p);
                return;
            }
            var b = ev.target.closest('button[data-a]');
            if (!b || !root.contains(b)) return;
            switch (b.getAttribute('data-a')) {
                case 'tim': napCay(); break;
                case 'dongvt': sang('ds'); break;
                case 'themvt': moForm(null); break;
                case 'xoavt': xoaViTri(); break;
                case 'luuvt': luuViTri(); break;
                case 'dongform': sang('vt'); break;
                case 'dongvr': sang('vt'); break;
                case 'themvr': moFormVaiTro(); break;
                case 'dongvrform': sang('vr'); break;
                case 'luuvr': luuVaiTro(); break;
            }
        });

        ui.enhance(root);
        ui.datepicker(iNgay);
        Array.prototype.forEach.call(root.querySelectorAll('[data-type="date"]'), function (x) { ui.datepicker(x); });
        napCay();
        return mst;
    };
})();
