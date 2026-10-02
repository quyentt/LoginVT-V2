/* =========================================================================
   Vai trò - chức năng
   Bản gốc: ApisCMS/Modules/vaitro/html/vaitrochucnang.html + script/vaitrochucnang.js
   ---------------------------------------------------------------------------
   Bố cục như bản gốc: cây vai trò (col-sm-3) | khung phải gồm danh sách ỨNG
   DỤNG của vai trò (col-sm-3) + bảng chức năng (col-sm-9). Nút "Chỉnh sửa
   quyền" thay bảng bằng khung chọn chức năng (cây ô đánh dấu) — đúng cặp
   zone_list_vtcnv4 / zone_input_vtcn của bản gốc. Bấm một ô chức năng trong
   bảng → hộp "Các quyền chức năng" (modalSuaQuyen).

   Lời gọi (chép nguyên văn):
       pkg_chung_quanlynguoidung.LayDanhSachVaiTro      CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P
           strLoaiVaiTro_Id "", strTuKhoa "", pageIndex 1, pageSize 1000, dTrangThai 1
       pkg_chung_quanlynguoidung.LayDanhSachUngDung     CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m
           strTuKhoa "", pageIndex 1, pageSize 10000, dTrangThai 1        → ô "Ứng dụng"
       PKG_CORE_QUANTRI_01.LayDSUngDungTheoVaiTro       CMS_QuanTri01_MH/DSA4BRIULyYFNC8mFSkkLhcgKBUzLgPP
           strVaiTro_Id                                                  → danh sách ứng dụng
       PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro    CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJhUpJC4UBRcgKBUzLgPP
           strUngDung_Id, strVaiTro_Id                                   → bảng chức năng
       PKG_CORE_QUANTRI_01.LayDSQuyenTheoUngDung        CMS_QuanTri01_MH/DSA4BRIQNDgkLxUpJC4ULyYFNC8m
           strUngDung_Id, strVaiTro_Id   cột CHUCNANG_ID, HANHDONG_TEN, DAPHAN, ID
       pkg_chung_quanlynguoidung.LayDanhSachChucNang    CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP
           versionAPI v1.0, strTuKhoa "", strChung_UngDung_Id, strCha_Id "", pageIndex 1,
           pageSize 1000, strPhamViTruyCap_Id "", dTrangThai 1           → cây chọn chức năng
       PKG_CORE_QUANTRI_02.LayDSCore_Quyen              CMS_QuanTri02_MH/DSA4BRICLjMkHhA0OCQv
           strChucNang_Id               cột ID, CHUCNANG_TEN, HANHDONG_TEN, HANHDONG_ID
       PKG_CORE_QUANTRI_02.Them_Core_VaiTro_Quyen       CMS_QuanTri02_MH/FSkkLB4CLjMkHhcgKBUzLh4QNDgkLwPP
           strCore_Quyen_Id, strVaiTro_Id, dHieuLuc 1
       PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen        CMS_QuanTri02_MH/GS4gHgIuMyQeFyAoFTMuHhA0OCQv
           strId = ID quyền (dòng LayDSCore_Quyen) — không gửi vai trò, như gốc
       PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen2       CMS_QuanTri02_MH/GS4gHgIuMyQeFyAoFTMuHhA0OCQvcwPP
           strVaiTro_Id, strChucNang_Id
       Danh mục CHUNG.HANHDONG                           ô "Quyền (chỉ tính khi thêm)"

   Luồng giữ như gốc:
     · Chọn vai trò → nạp ứng dụng của vai trò, tự mở ứng dụng ĐẦU; đang ở
       khung chỉnh sửa thì quay về bảng.
     · Bảng: cột ứng dụng gộp dòng, chức năng cha gộp dòng theo số chức năng
       con (insertHeaderTable); mỗi ô kèm danh sách quyền đã phân của vai trò.
     · Lưu ở khung chỉnh sửa: so cây đã đánh dấu (đủ + lưng chừng) với chức
       năng đã gán → thêm cái mới đánh dấu, xoá cái bị bỏ. Thêm = lấy quyền của
       chức năng (LayDSCore_Quyen) rồi gán những quyền có HANHDONG_ID nằm trong
       ô "Quyền"; chức năng chưa tạo quyền / không có quyền khớp thì báo.
       "Chưa có thay đổi" / "Khi thêm cần chọn quyền" / hỏi "thêm X và xóa Y".
     · Cây đánh dấu sẵn như jstree: mục đã gán mà không có con nào đã gán →
       đánh dấu cả mục lẫn các con.
     · Hộp "Các quyền chức năng": ô đánh dấu sẵn theo DAPHAN = 1; "Thêm quyền"
       gán mọi quyền đang đánh dấu, "Xóa" (ở chân hộp) xoá mọi quyền đang đánh
       dấu, "Xóa vai trò chức năng" gỡ cả chức năng khỏi vai trò.

   Khác gốc:
     · Đổi ô "Ứng dụng" sang ứng dụng khác với ứng dụng đang mở: bản gốc vẫn so
       với chức năng đã gán của ứng dụng CŨ (dtVaiTroChucNang) → gán lại cái đã
       có, không bao giờ xoá được. Ở đây nạp thêm LayDSChucNangTheoUDVaiTro của
       ứng dụng vừa chọn để so cho đúng (đường gọi có sẵn của bản gốc).
     · Ô "Check All" chỉ đổi lớp hiển thị của jstree (mục lưng chừng vẫn bị
       tính); ở đây đánh dấu / bỏ hết thật.
     · Lưu xong ở lại khung chỉnh sửa như gốc, nhưng vẽ lại cây theo dữ liệu mới
       (gốc để nguyên cây cũ, bấm Lưu lần hai là thêm trùng).
     · Hai lượt thêm / xoá chạy tuần tự qua ums.ui.batch (gốc bắn cùng lúc).
     · Mục mồ côi (cha không có trong danh sách) vẫn hiện ở gốc bảng — gốc bỏ mất.
   Cố ý bỏ (mã chết của bản gốc — vùng ẩn hoặc bảng không tồn tại):
     khung "Quyền chức năng" (tblQuyenCN, display:none), bảng
     tableVaiTroChucNang_VTCN / tblChucNang_VTCN, nút đồng bộ btnSync_VTCN,
     btnChucNangV2, lọc rdLoaiVaiTro_ChucNang.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, C = ums.cmsCay;
    var root = document.getElementById('cms-vaitrochucnang');
    if (!root) return;

    var m = pat.master({
        el: root,
        title: 'Vai trò - chức năng',
        actions: ui.btn('edit', { text: 'Chỉnh sửa quyền', attr: { 'data-a': 'sua' } }),
        side: { title: 'Danh sách vai trò', icon: 'fa-users-gear', search: 'Tìm tên vai trò...' },
        main: { title: false }
    });

    // Khung phải: danh sách ứng dụng của vai trò | bảng chức năng / khung chỉnh sửa
    var n = pat.master({
        el: m.mainBody,
        side: { title: 'Danh sách ứng dụng', icon: 'fa-hard-drive', search: false, width: '260px' },
        main: { title: false }
    });
    n.el.querySelector('.ums-master').classList.add('cmsvtcn-trong');
    n.mainBody.innerHTML =
        '<div data-z="ds">' + pat.panel({ title: 'Danh sách chức năng', icon: 'fa-gear', flush: true, body: '<div data-z="bang"></div>' }) + '</div>' +
        '<div data-z="sua" hidden>' + pat.panel({
            title: 'Thêm Vai trò - Chức năng', icon: 'fa-plus', count: 'suaCount',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
            body:
                '<div class="ums-grid ums-grid--2">' +
                    ui.field('Ứng dụng', '<select class="ums-select" data-a="ud" data-ph="Chọn ứng dụng"><option value="">Chọn ứng dụng</option></select>') +
                    ui.field('Quyền (chỉ tính khi thêm)', '<select class="ums-select" multiple data-a="quyen" data-ph="Chọn quyền"></select>') +
                    '<div style="grid-column:1 / -1"><label class="ums-check"><input type="checkbox" data-a="tatca"> Check All</label></div>' +
                '</div>' +
                '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-folder-gear"></i> Danh sách chức năng</div>' +
                '<div data-z="cay"></div>'
        }) + '</div>';

    function $(s) { return root.querySelector(s); }
    var elDs = $('[data-z="ds"]'), elSua = $('[data-z="sua"]'), elBang = $('[data-z="bang"]'), elCay = $('[data-z="cay"]');
    var elUD = $('[data-a="ud"]'), elQuyen = $('[data-a="quyen"]'), elTatCa = $('[data-a="tatca"]');
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function e(v) { return v === undefined || v === null ? '' : v; }

    var S = {
        vaiTro: '',          // strVaiTro_Id
        ungDung: '',         // strUngDung_Id — ứng dụng đang mở ở danh sách giữa
        dsVaiTro: [],
        dsUngDungVT: [],     // dtUngDung2
        daGan: [],           // dtVaiTroChucNang — chức năng đã gán (ứng dụng đang mở)
        quyen: [],           // dtQuyenCN
        cayUD: '',           // ứng dụng của cây chỉnh sửa
        cayDs: [],           // dtVaiTroChucNang2 — mọi chức năng của ứng dụng đó
        cayGan: [],          // chức năng đã gán của ứng dụng đó
        cay: null
    };

    /* ---------- Cây vai trò ---------------------------------------------- */
    function napVaiTro() {
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
            strLoaiVaiTro_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 1000,
            dTrangThai: 1
        }).then(function (r) {
            S.dsVaiTro = rowsOf(r);
            m.sideCount.textContent = '(' + (r.pager || S.dsVaiTro.length) + ')';
            m.sideBody.innerHTML = C.html(S.dsVaiTro, { cha: 'CHUNG_VAITRO_CHA_ID', ten: 'TENVAITRO', icon: 'fa-user', active: S.vaiTro });
            C.loc(m.sideBody, m.search.value);
            napUngDungTatCa();
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách vai trò');
        });
    }

    function napUngDungTatCa() {
        ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000,
            dTrangThai: 1
        }).then(function (r) {
            pat.fill(elUD, rowsOf(r), { name: 'TENUNGDUNG', head: 'Chọn ứng dụng' });
        }).catch(function (err) { ums.api.handle(err, 'danh sách ứng dụng'); });
    }

    m.search.addEventListener('input', function () { C.loc(m.sideBody, m.search.value); });
    m.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('.cmsc-cay__node[data-id]');
        if (!b) return;
        S.vaiTro = b.getAttribute('data-id');
        C.active(m.sideBody, S.vaiTro);
        napUngDungVT();
    });

    /* ---------- Ứng dụng của vai trò ------------------------------------ */
    function napUngDungVT(giu) {
        if (!giu) n.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRIULyYFNC8mFSkkLhcgKBUzLgPP',
            func: 'PKG_CORE_QUANTRI_01.LayDSUngDungTheoVaiTro',
            strVaiTro_Id: S.vaiTro,
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            S.dsUngDungVT = rowsOf(r);
            n.sideCount.textContent = '(' + S.dsUngDungVT.length + ')';
            if (giu && S.dsUngDungVT.some(function (u) { return u.ID === S.ungDung; })) { veUngDung(); return; }
            if (!giu && !elSua.hidden) hienDs();
            S.ungDung = S.dsUngDungVT.length ? S.dsUngDungVT[0].ID : '';
            veUngDung();
            napBang();
        }).catch(function (err) {
            n.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'ứng dụng của vai trò');
        });
    }
    function veUngDung() {
        n.sideBody.innerHTML = S.dsUngDungVT.length ? S.dsUngDungVT.map(function (u) {
            return pat.masterItem({ id: u.ID, text: e(u.TENUNGDUNG), active: u.ID === S.ungDung });
        }).join('') : ui.empty('Vai trò chưa có ứng dụng');
    }
    n.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('.ums-master__item[data-id]');
        if (!b) return;
        S.ungDung = b.getAttribute('data-id');
        Array.prototype.forEach.call(n.sideBody.querySelectorAll('.ums-master__item'), function (x) { x.classList.toggle('is-active', x === b); });
        napBang();
    });

    /* ---------- Bảng chức năng đã gán + quyền --------------------------- */
    function layGan(ud) {
        return ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJhUpJC4UBRcgKBUzLgPP',
            func: 'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro',
            strUngDung_Id: ud,
            strVaiTro_Id: S.vaiTro,
            strNguoiThucHien_Id: ''
        }).then(rowsOf);
    }
    function napQuyen() {
        return ums.api.call({
            action: 'CMS_QuanTri01_MH/DSA4BRIQNDgkLxUpJC4ULyYFNC8m',
            func: 'PKG_CORE_QUANTRI_01.LayDSQuyenTheoUngDung',
            strUngDung_Id: S.ungDung,
            strVaiTro_Id: S.vaiTro,
            strNguoiThucHien_Id: ''
        }).then(function (r) { S.quyen = rowsOf(r); veBang(); });
    }
    function napBang() {
        if (!S.vaiTro || !S.ungDung) {
            S.daGan = [];
            elBang.innerHTML = ui.empty(S.vaiTro ? 'Vai trò chưa có ứng dụng nào' : 'Chọn một vai trò ở cây bên trái', 'fa-hand-pointer');
            return Promise.resolve();
        }
        elBang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tok = napBang.tok = {};
        return layGan(S.ungDung).then(function (rows) {
            if (napBang.tok !== tok) return;
            S.daGan = rows;
            return napQuyen();
        }).catch(function (err) {
            elBang.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'chức năng của vai trò');
        });
    }
    function veBang() {
        var nhom = S.dsUngDungVT.map(function (u) {
            return { ten: e(u.TENUNGDUNG), rows: S.daGan.filter(function (c) { return c.CHUNG_UNGDUNG_ID === u.ID; }) };
        });
        C.bang(elBang, nhom, {
            cha: 'CHUCNANGCHA_ID',
            empty: 'Vai trò chưa được phân chức năng nào của ứng dụng này',
            attr: function (r) { return ' data-cn="' + ui.esc(r.ID) + '" title="Xem các quyền"'; },
            o: function (r) {
                var q = S.quyen.filter(function (x) { return x.CHUCNANG_ID === r.ID; }).map(function (x) { return e(x.HANHDONG_TEN); });
                return '<span class="cmsvtcn-ten">' + ui.esc(e(r.TENCHUCNANG)) + '</span>' +
                    (q.length ? '<span class="cmsvtcn-quyen">(' + ui.esc(q.join(', ')) + ')</span>' : '');
            }
        });
    }
    elBang.addEventListener('click', function (ev) {
        var td = ev.target.closest('[data-cn]');
        if (td) moQuyen(td.getAttribute('data-cn'));
    });

    /* ---------- Hộp "Các quyền chức năng" ------------------------------- */
    function moQuyen(cnId) {
        var dlg = ui.dialog({
            title: 'Các quyền chức năng', icon: 'fa-server', size: 'md',
            body: '<div data-z="q">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            xoa: { chon: 'input[data-qcn]', text: 'Xóa', onClick: function () { chay('xoa'); } },
            buttons: [
                { text: 'Xóa vai trò chức năng', kind: 'del', keepOpen: true, onClick: function () { xoaCN(); } },
                { text: 'Thêm quyền', kind: 'add', keepOpen: true, onClick: function () { chay('them'); } }
            ]
        });
        var host = dlg.body.querySelector('[data-z="q"]');
        var ds = [];

        function nap() {
            return ums.api.call({
                action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHhA0OCQv',
                func: 'PKG_CORE_QUANTRI_02.LayDSCore_Quyen',
                strChucNang_Id: cnId,
                strNguoiThucHien_Id: ''
            }).then(function (r) { ds = rowsOf(r); ve(); })
              .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'quyền của chức năng'); });
        }
        function ve() {
            ui.table({
                el: host, rows: ds, empty: 'Chức năng chưa được tạo quyền',
                columns: [
                    { title: 'Tên chức năng', prop: 'CHUCNANG_TEN' },
                    { title: 'Quyền', prop: 'HANHDONG_TEN' },
                    { head: '<input type="checkbox" data-qcn-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (x) {
                          var o = S.quyen.filter(function (q) { return q.ID === x.ID; })[0];
                          return '<input type="checkbox" data-qcn="' + ui.esc(x.ID) + '"' + (o && String(o.DAPHAN) === '1' ? ' checked' : '') + '>';
                      } }
                ]
            });
        }
        host.addEventListener('change', function (ev) {
            if (!ev.target.hasAttribute('data-qcn-all')) return;
            Array.prototype.forEach.call(host.querySelectorAll('tbody input[data-qcn]'), function (x) { x.checked = ev.target.checked; });
        });
        function chon() {
            return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-qcn]'), function (x) { return x.checked; })
                .map(function (x) { return x.getAttribute('data-qcn'); });
        }
        function chay(kieu) {
            var ids = chon();
            if (!ids.length) { ui.toast(kieu === 'xoa' ? 'Vui lòng chọn đối tượng cần xóa?' : 'Vui lòng chọn đối tượng ?', 'warn'); return; }
            var hoi = kieu === 'xoa'
                ? ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' })
                : ui.confirm('Bạn có chắc chắn lưu dữ liệu không?');
            hoi.then(function (ok) {
                if (!ok) return;
                ui.batch(ids.map(function (id) {
                    return kieu === 'xoa'
                        ? { action: 'CMS_QuanTri02_MH/GS4gHgIuMyQeFyAoFTMuHhA0OCQv', func: 'PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen',
                            strId: id, strNguoiThucHien_Id: '' }
                        : themQuyen(id);
                }), { title: kieu === 'xoa' ? 'Đang xoá quyền' : 'Đang thêm quyền',
                      okText: kieu === 'xoa' ? 'Xóa dữ liệu thành công!' : 'Thêm mới thành công!' })
                  .then(function () { return napQuyen(); })
                  .then(function () { if (!dlg.closed) ve(); });
            });
        }
        function xoaCN() {
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (ok) {
                if (!ok) return;
                ums.api.call(xoaVTCN(cnId)).then(function () {
                    ui.toast('Xóa thành công!', 'ok');
                    dlg.close();
                    napBang();
                }).catch(function (err) { ums.api.handle(err, 'xoá vai trò chức năng'); });
            });
        }
        nap();
    }

    function themQuyen(quyenId) {
        return {
            action: 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhcgKBUzLh4QNDgkLwPP',
            func: 'PKG_CORE_QUANTRI_02.Them_Core_VaiTro_Quyen',
            strCore_Quyen_Id: quyenId,
            strVaiTro_Id: S.vaiTro,
            dHieuLuc: 1,
            strNguoiThucHien_Id: ''
        };
    }
    function xoaVTCN(cnId) {
        return {
            action: 'CMS_QuanTri02_MH/GS4gHgIuMyQeFyAoFTMuHhA0OCQvcwPP',
            func: 'PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen2',
            strVaiTro_Id: S.vaiTro,
            strChucNang_Id: cnId,
            strNguoiThucHien_Id: ''
        };
    }

    /* ---------- Khung "Chỉnh sửa quyền" --------------------------------- */
    function hienDs() {
        m.formMode(false);
        ui.swap(elSua, elDs);
    }
    function hienSua() {
        m.formMode(true);
        ui.swap(elDs, elSua);
    }

    function napCay(ud) {
        S.cayUD = ud;
        S.cay = null;
        elTatCa.checked = false;
        if (!ud) { elCay.innerHTML = ui.empty('Chọn ứng dụng để xem chức năng', 'fa-hand-pointer'); $('[data-z="suaCount"]').textContent = ''; return Promise.resolve(); }
        elCay.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var tok = napCay.tok = {};
        var ganP = ud === S.ungDung ? Promise.resolve(S.daGan) : layGan(ud);
        var dsP = ums.api.call({
            action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP',
            func: 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
            versionAPI: 'v1.0',
            strTuKhoa: '',
            strChung_UngDung_Id: ud,
            strCha_Id: '',
            pageIndex: 1,
            pageSize: 1000,
            strPhamViTruyCap_Id: '',
            dTrangThai: 1
        }).then(rowsOf);
        return Promise.all([dsP, ganP]).then(function (x) {
            if (napCay.tok !== tok) return;
            S.cayDs = x[0];
            S.cayGan = x[1] || [];
            var gan = S.cayGan.map(function (g) { return g.ID; });
            // Như loadToTree_VaiTroUngDung2: chỉ đánh dấu mục đã gán mà KHÔNG có con đã gán
            var da = S.cayDs.filter(function (c) {
                return gan.indexOf(c.ID) >= 0 && !S.cayGan.some(function (g) { return g.CHUCNANGCHA_ID === c.ID; });
            }).map(function (c) { return c.ID; });
            S.cay = C.chon(elCay, S.cayDs, { cha: 'CHUCNANGCHA_ID', ten: 'TENCHUCNANG', icon: 'fa-gear', da: da });
            $('[data-z="suaCount"]').textContent = '(' + S.cayDs.length + ')';
        }).catch(function (err) {
            elCay.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'chức năng của ứng dụng');
        });
    }

    function luu() {
        if (!S.cay) { ui.toast('Chọn ứng dụng để xem chức năng', 'warn'); return; }
        var chon = S.cay.ids();
        var gan = S.cayGan.map(function (g) { return g.ID; });
        var them = [], xoa = [];
        S.cayDs.forEach(function (c) {
            var da = gan.indexOf(c.ID) >= 0, co = chon.indexOf(c.ID) >= 0;
            if (da && !co) xoa.push(c.ID);
            if (!da && co) them.push(c.ID);
        });
        if (!them.length && !xoa.length) { ui.toast('Chưa có thay đổi', 'warn'); return; }
        var quyen = (window.jQuery ? jQuery(elQuyen).val() : null) || [];
        if (!quyen.length && them.length) { ui.toast('Khi thêm cần chọn quyền', 'warn'); return; }

        ui.confirm('Bạn có chắc chắn thêm ' + them.length + ' và xóa ' + xoa.length + ' dữ liệu không?').then(function (ok) {
            if (!ok) return;
            var ten = {};
            S.cayDs.forEach(function (c) { ten[c.ID] = e(c.TENCHUCNANG); });
            var viec = them.map(function (id) {
                return function () {
                    return ums.api.call({
                        action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHhA0OCQv',
                        func: 'PKG_CORE_QUANTRI_02.LayDSCore_Quyen',
                        strChucNang_Id: id,
                        strNguoiThucHien_Id: ''
                    }).then(function (r) {
                        var ds = rowsOf(r);
                        if (!ds.length) throw new Error(ten[id] + ': Chức năng này chưa được tạo quyền. Vui lòng vào trang Chức năng để thêm quyền (thêm, sửa, xóa...) trước khi gán cho vai trò!');
                        var khop = ds.filter(function (q) { return quyen.indexOf(q.HANHDONG_ID) >= 0; });
                        if (!khop.length) throw new Error(ten[id] + ': Không có quyền nào phù hợp để gán. Vui lòng kiểm tra lại quyền đã tạo cho chức năng này!');
                        return khop.reduce(function (p, q) {
                            return p.then(function () { return ums.api.call(themQuyen(q.ID)); });
                        }, Promise.resolve());
                    });
                };
            }).concat(xoa.map(function (id) { return xoaVTCN(id); }));
            ui.batch(viec, { title: 'Đang lưu vai trò - chức năng', okText: 'Hoàn thành' }).then(function () {
                var ud = S.cayUD;
                return napUngDungVT(true).then(function () {
                    return napBang();
                }).then(function () {
                    return napCay(ud);
                });
            });
        });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.tagName === 'SELECT' || b.tagName === 'INPUT') return;
        var a = b.getAttribute('data-a');
        if (a === 'sua') {
            if (!S.vaiTro) { ui.toast('Vui lòng chọn Vai trò cần phân Chức năng!', 'warn'); return; }
            hienSua();
            if (S.ungDung) {
                elUD.value = S.ungDung;
                if (window.jQuery) jQuery(elUD).trigger('change.select2');
            }
            napCay(elUD.value);
        }
        else if (a === 'dong') { hienDs(); napBang(); }
        else if (a === 'luu') luu();
    });
    elTatCa.addEventListener('change', function () { if (S.cay) S.cay.tatCa(elTatCa.checked); });
    if (window.jQuery) {
        jQuery(elUD).on('select2:select select2:clear', function () { napCay(elUD.value); });
    }

    ums.api.dm('CHUNG.HANHDONG').then(function (rows) {
        pat.fill(elQuyen, rows);
    }).catch(function (err) { ums.api.handle(err, 'danh mục quyền'); });

    napVaiTro();
    napBang();
})();
