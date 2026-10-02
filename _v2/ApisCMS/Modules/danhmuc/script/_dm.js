/* =========================================================================
   ApisCMS / danhmuc — phần DÙNG CHUNG của bảy màn khai báo danh mục
   (danhmucdulieu, danhmucthuoctinh, danhmuctenbang, danhmuctukhoa,
    danhmucimport, danhmucexport, import). Đặt ở ums.cmsDm.
   (Các màn còn lại của module — mauphoiin, comparetable… — KHÔNG dùng tệp này.)
   ---------------------------------------------------------------------------
   ums.cmsDm.ungDung()        → Promise<[{ ID, TENUNGDUNG }]>
       = edu.extend.getList_UngDung({ iTrangThai: 1, strTuKhoa: "", pageIndex: 1, pageSize: 10000 })
         (Corei/systemextend.js:2793): CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m
         func pkg_chung_quanlynguoidung.LayDanhSachUngDung. Năm màn gốc cùng gọi.
   ums.cmsDm.locHtml(ph) / ganLoc(host, onDoi)
       Cụm lọc ở đầu cột trái của năm màn hai cột: ô "Chọn ứng dụng" rồi ô từ
       khoá + kính lúp (btnExtend_Search), đúng thứ tự bản gốc. Enter / bấm kính
       lúp / chọn hoặc xoá ứng dụng → onDoi().
   ums.cmsDm.cay(master, { them, onPick })
       Cây BẢNG DANH MỤC ở cột trái của danhmucdulieu + danhmucthuoctinh
       (getList_DMTB + loadToTree_DMTB của hai bản gốc — chép nhau từng dòng):
       pkg_chung_danhmuc.LayDanhSachDanhMuc, dTrangThai 1. Chưa chọn ứng dụng
       → phân trang máy chủ 10 dòng (pageSize_default); đã chọn ứng dụng →
       pageSize 100000, không phân trang (như gốc). Cây lồng theo
       CHUNG_TENDANHMUC_CHA_ID, nhãn TENDANHMUC.
   ums.cmsDm.moBaoCao(đuôi)   = location.href = edu.system.rootPathReport + đuôi
   ums.cmsDm.moGoc(đuôi)      = location.href = edu.system.rootPath + đuôi
       Dựng thử: chỉ báo đường dẫn, không rời trang.
   ums.cmsDm.tachSQL(sql)     = SeaGate_BackEnd(sql) của script/cutsouresql.js
       — chỉ phần hai màn Danh mục import/export dùng (strPackage,
         strFunctionName, arrThamSo); phần sinh mã C# đã chú thích bỏ ở gốc.
   ums.cmsDm.hamMan(root, cfg) Khung chung của danhmucimport + danhmucexport
       (hai tệp .js gốc chép nhau, lệch ở các điểm khai trong cfg — xem đầu
        tệp danhmucimport.js / danhmucexport.js).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var D = ums.cmsDm = {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function rowsOf(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function gop() {
        var o = {};
        for (var i = 0; i < arguments.length; i++) {
            var x = arguments[i] || {};
            Object.keys(x).forEach(function (k) { o[k] = x[k]; });
        }
        return o;
    }
    D.e = e;
    D.rows = rowsOf;
    D.gop = gop;

    /* ---------- Ứng dụng ------------------------------------------------- */
    var pUng = null;
    D.ungDung = function () {
        if (!pUng) {
            pUng = ums.api.call({
                action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
                func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
                dTrangThai: 1,
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 10000,
                silent: true
            }).then(rowsOf, function (err) {
                pUng = null;
                ums.api.handle(err, 'danh sách ứng dụng');
                return [];
            });
        }
        return pUng;
    };

    /* ---------- Cụm lọc cột trái ----------------------------------------- */
    D.locHtml = function (ph) {
        return '<div class="ums-field dm-loc__ung"><select class="ums-select" data-dm="ung" data-ph="Chọn ứng dụng">' +
            '<option value="">Chọn ứng dụng</option></select></div>' +
            '<div class="ums-master__search ums-u-mt-2"><div class="ums-searchbar ums-searchbar--sm">' +
            '<span class="ums-searchbar__icon dm-loc__tim" data-dm="tim" title="Tìm kiếm"><i class="fa-light fa-magnifying-glass"></i></span>' +
            '<input class="ums-searchbar__input" data-dm="q" type="text" autocomplete="off" placeholder="' +
            ui.esc(ph || 'Nhập từ khóa tìm kiếm') + '"></div></div>';
    };

    D.ganLoc = function (host, onDoi) {
        var ung = host.querySelector('[data-dm="ung"]');
        var q = host.querySelector('[data-dm="q"]');
        D.ungDung().then(function (rows) {
            ums.pat.fill(ung, rows, { name: 'TENUNGDUNG' });
        });
        // select2 bắn 'change' (jQuery) khi người dùng chọn / xoá; pat.fill chỉ bắn 'change.select2'
        if (window.jQuery) jQuery(ung).on('change', function () { onDoi(); });
        q.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); onDoi(); }
        });
        host.querySelector('[data-dm="tim"]').addEventListener('click', function () { onDoi(); });
        /* Luật cột trái (BO-CUC 12): ô chọn ứng dụng vào Bộ lọc nâng cao, nút Tải lại, gõ là tự tìm */
        ums.pat.cotTrai({ side: host.querySelector('.ums-master__side'), search: q }, { tai: onDoi, tuTaiLoc: false });
        return {
            ung: ung, q: q,
            val: function () { return { ung: ung.value || '', q: (q.value || '').trim() }; }
        };
    };

    /* ---------- Cây bảng danh mục ---------------------------------------- */
    D.cay = function (m, o) {
        o = o || {};
        var st = { page: 1, rows: [], cur: null };
        var SIZE = 10;                               // edu.system.pageSize_default
        var loc = D.ganLoc(m.el, function () { load(1); });

        function load(p) {
            st.page = p || 1;
            var v = loc.val();
            var coUng = !!v.ung;
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(gop({
                action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
                func: 'pkg_chung_danhmuc.LayDanhSachDanhMuc'
            }, o.them, {
                strPhanCapDanhMuc_Id: '',
                strChung_TenDanhMuc_Cha_Id: '',
                strNhomDanhMuc_Id: v.ung,
                strTuKhoa: v.q,
                pageIndex: coUng ? 1 : st.page,
                pageSize: coUng ? 100000 : SIZE,
                dTrangThai: 1,
                strTieuChiSapXep: ''
            })).then(function (r) {
                st.rows = rowsOf(r);
                var tong = coUng ? st.rows.length : (Number(r.pager) || st.rows.length);
                m.sideCount.textContent = String(tong);
                draw();
                if (!coUng && tong > SIZE) {
                    m.setPage({ index: st.page, size: SIZE, total: tong, sizes: false, onChange: function (pg) {
                        if (pg >= 1 && pg <= Math.ceil(tong / SIZE)) load(pg);
                    } });
                } else {
                    m.sideFoot.innerHTML = '';
                }
            }).catch(function (err) {
                m.sideBody.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách bảng danh mục');
            });
        }

        function draw() {
            var rows = st.rows, ids = {};
            rows.forEach(function (t) { ids[t.ID] = true; });
            function nhanh(cha) {
                var con = rows.filter(function (t) {
                    var p = t.CHUNG_TENDANHMUC_CHA_ID || '';
                    return cha ? p === cha : (!p || !ids[p]);
                });
                if (!con.length) return '';
                return '<ul>' + con.map(function (t) {
                    return '<li><button type="button" class="ums-master__item dm-node' +
                        (st.cur && st.cur.ID === t.ID ? ' is-active' : '') + '" data-id="' + ui.esc(t.ID) +
                        '" title="' + ui.esc(e(t.MADANHMUC)) + '">' + ui.esc(e(t.TENDANHMUC)) + '</button>' +
                        nhanh(t.ID) + '</li>';
                }).join('') + '</ul>';
            }
            m.sideBody.innerHTML = nhanh('') || ui.empty('Không có dữ liệu');
        }

        m.sideBody.addEventListener('click', function (ev) {
            var b = ev.target.closest('.dm-node');
            if (!b) return;
            var id = b.getAttribute('data-id');
            st.cur = st.rows.filter(function (t) { return t.ID === id; })[0] || null;
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.dm-node'), function (x) {
                x.classList.toggle('is-active', x === b);
            });
            if (st.cur && o.onPick) o.onPick(st.cur);
        });

        load(1);
        return { load: load, cur: function () { return st.cur; }, rows: function () { return st.rows; } };
    };

    /* ---------- Mở đường dẫn báo cáo / máy chủ ---------------------------- */
    /* Gốc URL báo cáo — cùng thứ tự với report.js (rootPathReport): chức năng →
       vai trò → blob phiên (hàm đó không công khai nên chép lại ở đây). */
    function rootReport() {
        var s = ums.state || {};
        var cn = (s.menu || []).filter(function (c) { return c.id === s.chucNangId; })[0];
        if (cn && cn.report) return cn.report;
        var role = (s.roles || []).filter(function (r) { return r.id === s.roleId; })[0];
        if (role && role.report) return role.report;
        return (ums.session && ums.session.rootPathReport) || '';
    }
    function mo(url, tieuDe) {
        if (ums.state && ums.state.mode === 'demo') {
            ui.toast('Dựng thử — trên máy chủ thật sẽ mở: ' + url, 'info', { title: tieuDe || 'Mở báo cáo', timeout: 9000 });
            return;
        }
        ums.report.navigate(url);
    }
    D.moBaoCao = function (duoi) { mo(rootReport() + duoi, 'Mở báo cáo'); };
    D.moGoc = function (duoi) { mo(((ums.session && ums.session.rootPath) || '') + duoi, 'Mở đường dẫn'); };

    /* ---------- Tách tham số từ mã nguồn procedure (SeaGate_BackEnd) ------ */
    function kieuThamSo(s) {
        //1. paramdb 2. paramexcel 3. dulieumacdinh 4. kieu chu(0), kieu so(1) 5. In(0), Out(1), InOut(10)
        if (s.indexOf('ParamErr ') >= 0) return 'ParamErr, , , 0, 1';
        if (s.indexOf('ParamTuKhoa ') >= 0) return 'ParamTuKhoa, TuKhoa, ,0, 0';
        if (s.indexOf('PageNumber ') >= 0) return 'PageNumber, Index, 1, 1, 10';
        if (s.indexOf('ItemPerPage ') >= 0) return 'ItemPerPage, pageSize, 100000, 1, 0';
        if (s.indexOf('ParamTrangThai ') >= 0 && s.indexOf(' number') >= 0) return 'ParamTrangThai, iTrangThai, 1, 1, 0';
        if (s.indexOf('ParamThuTu ') >= 0 && s.indexOf(' number') >= 0) return 'ParamThuTu, iThuTu, 1, 1, 0';
        if (s.indexOf('ParamTinhTrang ') >= 0 && s.indexOf(' number') >= 0) return 'ParamTinhTrang, iTinhTrang, 1, 1, 0';
        if (s.indexOf('TotalPage ') >= 0) return 'TotalPage, , 0, 1, 10';
        if (s.indexOf('TotalItem ') >= 0) return 'TotalItem, , 0, 1, 10';
        if (s.indexOf('Param') >= 0) {
            var cuoi = (s.indexOf(' out ') >= 0 || s.indexOf(' OUT ') >= 0) ? ', 1' : ', 0';
            var so = s.indexOf(' number') >= 0 || s.indexOf(' NUMBER') >= 0;
            var t = s.substring(s.indexOf('Param') + 5);
            t = t.substring(0, t.indexOf(' '));
            return so ? 'Param' + t + ', d' + t + ', , 1' + cuoi : 'Param' + t + ', ' + t + ', , 0' + cuoi;
        }
        if (s.indexOf(' refcur') >= 0) {
            return s.substring(s.indexOf('rs'), s.indexOf(' ', s.indexOf('rs') + 2)) + ', , , 10, 1';
        }
        return '';
    }
    D.tachSQL = function (sql) {
        var s = String(sql || '');
        // cutcomment: bỏ "-- …" tới hết dòng (gốc dừng khi chú thích nằm ở dòng cuối không có xuống dòng)
        while (s.indexOf('--') >= 0) {
            var a = s.indexOf('--'), b = s.indexOf('\n', a);
            if (b < a) break;
            s = s.replace(s.substring(a, b), '');
        }
        var pkg = '';
        var vt = s.indexOf('create or replace package ');
        if (vt > -1 && vt < 10) {
            vt += 26;
            if (s.indexOf('create or replace package body') >= 0) vt += 5;
            pkg = s.substring(vt, s.indexOf(' ', vt));
        }
        if (s.indexOf('procedure') >= 0) s = s.substring(s.indexOf('procedure') + 9);
        var mo = s.indexOf('('), dong = s.indexOf(')');
        var ham = s.substring(0, mo).replace(/\n/g, '').replace(/ /g, '');
        var ts = s.substring(mo + 1, dong).replace(/\n/g, '').split(',').map(kieuThamSo);
        return { strPackage: pkg, strFunctionName: ham, arrThamSo: ts };
    };

    /* =====================================================================
       KHUNG CHUNG: Danh mục import / Danh mục export
       ---------------------------------------------------------------------
       Trái: danh sách HÀM (bảng danh mục dTrangThai 995 / 985) + nút "+" tạo
       hàm, mỗi mục có nút thao tác (hiện khi rê chuột như gốc).
       Phải: bảng THAM SỐ của hàm đang chọn (CMS_DanhMucDuLieu/LayDanhSach),
       thêm / sửa thay chỗ bảng (ums.crud nhúng); biểu mẫu "Tạo hàm" cũng thay
       chỗ khung bên phải.

       cfg = {
           tieuDe, dTrangThai, loai: 'import' | 'export',
           tieuDeHam, macDinh: { ten, ma, sql } | null, thuTu (dThuTu khi tạo hàm),
           kiemSQL(sql) → true = hợp lệ,
           tachTruoc(sql) → sql đưa vào tachSQL,
           idMoi(result) → id hàm mới,
           nhan(row) → chữ một mục,  act: ['mau'|'dulieu'|'sua'|'tai'|'xoa'],
           thamSo: { sapXep, columns, fields, luu(v, row, funcId) → call, tuDong(p, i, pkgHam, funcId, form) → call },
           sauTuDong(form) (tuỳ chọn), toolbar (tuỳ chọn), sua(form, row) → call (tuỳ chọn)
       }
       ===================================================================== */
    var ACT = {
        mau:    { icon: 'fa-file-arrow-down', title: 'Tải file mẫu import' },
        dulieu: { icon: 'fa-download', title: 'Tải dữ liệu danh mục' },
        tai:    { icon: 'fa-download', title: 'Tải file export' },
        sua:    { icon: 'fa-pen-to-square', title: 'Sửa', cls: 'ums-iconbtn--edit' },
        xoa:    { icon: 'fa-trash-can', title: 'Xoá', cls: 'ums-iconbtn--del' }
    };

    D.hamMan = function (root, cfg) {
        var DTT = cfg.dTrangThai;
        var st = { rows: [], funcId: '', sua: null };

        var m = ums.pat.master({
            el: root,
            title: cfg.tieuDe,
            side: {
                title: 'Danh sách', icon: cfg.iconDs || 'fa-list-timeline', kieu: 'danhmuc', search: false,
                filter: D.locHtml(),
                tools: '<button type="button" class="ums-iconbtn" data-dm="themham" title="' + ui.esc(cfg.tieuDeHam) + '">' +
                    '<i class="fa-light fa-plus"></i></button>'
            },
            main: { title: false }
        });
        m.side.classList.add('dm-ham');
        var loc = D.ganLoc(m.el, function () { loadHam(); });

        m.mainBody.innerHTML =
            '<div class="ums-panel ums-u-mb-4" data-dm="hamBar" hidden><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-folder-open"></i> <span data-dm="hamTen"></span></div>' +
            '<div class="ums-panel__tools">' + cfg.act.map(function (k) {
                var a = ACT[k];
                if (k === 'sua') return ui.btn('edit', { text: 'Sửa', attr: { 'data-hact': k } });
                if (k === 'xoa') return ui.btn('del', { text: 'Xoá', attr: { 'data-hact': k } });
                return '<button type="button" class="ums-btn ums-btn--out-primary" data-hact="' + k + '"><i class="fa-light ' + a.icon + '"></i><span>' +
                    ui.esc(a.title) + '</span></button>';
            }).join('') + '</div></div></div>' +
            '<div data-dm="ts"></div><div data-dm="fham" hidden></div>';
        var zTs = m.mainBody.querySelector('[data-dm="ts"]');
        var zHam = m.mainBody.querySelector('[data-dm="fham"]');

        /* ---------- Danh sách hàm ---------- */
        function loadHam(chon) {
            var v = loc.val();
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
                func: 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
                strPhanCapDanhMuc_Id: '',
                strChung_TenDanhMuc_Cha_Id: '',
                strNhomDanhMuc_Id: v.ung,
                strTuKhoa: v.q,
                pageIndex: 1,
                pageSize: 1000000,
                dTrangThai: DTT,
                strTieuChiSapXep: ''
            }).then(function (r) {
                st.rows = rowsOf(r);
                m.sideCount.textContent = String(st.rows.length);
                if (chon) st.funcId = chon;
                veHam();
                hamBar();
            }).catch(function (err) {
                m.sideBody.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách hàm');
            });
        }
        function veHam() {
            if (!st.rows.length) { m.sideBody.innerHTML = ui.empty('Không có dữ liệu'); return; }
            m.sideBody.innerHTML = st.rows.map(function (r) {
                /* Mục chỉ để CHỌN — các nút (tải mẫu, dữ liệu, sửa, xoá…) nằm trên TIÊU ĐỀ khung phải cho mục đang chọn
                   (người dùng 2026-09-26: bỏ nút trong danh sách, đưa về tiêu đề) */
                return '<button type="button" class="ums-master__item dm-ham__item' + (r.ID === st.funcId ? ' is-active' : '') +
                    '" data-id="' + ui.esc(r.ID) + '" title="' + ui.esc(e(r.MADANHMUC)) + '">' +
                    '<span class="ums-master__item__main">' + ui.esc(cfg.nhan(r)) + '</span></button>';
            }).join('');
        }

        m.el.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-dm="themham"]')) { moHam(null); return; }
            var b = ev.target.closest('[data-hact]');
            if (b) {
                var row = st.rows.filter(function (r) { return r.ID === st.funcId; })[0];
                if (!row) return;
                var k = b.getAttribute('data-hact');
                if (k === 'mau') D.moBaoCao('/Modules/Common/MauImport.aspx?Ma=' + e(row.MADANHMUC));
                else if (k === 'dulieu') D.moBaoCao('/Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=' + e(row.MADANHMUC));
                else if (k === 'tai') D.moBaoCao('/Modules/Common/ExportDataInFunction.aspx?Ma=' + e(row.MADANHMUC));
                else if (k === 'sua') moHam(row);
                else if (k === 'xoa') xoaHam(row);
                return;
            }
            var it = ev.target.closest('.dm-ham__item');
            if (!it || !m.sideBody.contains(it)) return;
            chonHam(it.getAttribute('data-id'));
        });

        function hamBar() {
            var bar = m.mainBody.querySelector('[data-dm="hamBar"]');
            var row = st.rows.filter(function (r) { return r.ID === st.funcId; })[0];
            bar.hidden = !row;
            if (row) m.mainBody.querySelector('[data-dm="hamTen"]').textContent = cfg.nhan(row);
        }
        function chonHam(id) {
            st.funcId = id;
            hamBar();
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.dm-ham__item'), function (x) {
                x.classList.toggle('is-active', x.getAttribute('data-id') === id);
            });
            if (!zHam.hidden) dongHam();
            if (crud.editing || !crud.z('form').hidden) crud.showList();
            crud.load(1);
        }

        function xoaHam(row) {
            ui.confirm('Xoá "' + e(row.TENDANHMUC) + '"? Thao tác này không hoàn tác được.', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' })
                .then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({
                        action: 'CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP',
                        func: 'pkg_chung_danhmuc.XoaDanhMuc',
                        strId: row.ID,
                        strNguoiThucHien_Id: '',
                        dTrangThai: DTT
                    }).then(function () {
                        ui.toast('Xóa dữ liệu thành công!', 'ok');
                        if (st.funcId === row.ID) { st.funcId = ''; hamBar(); crud.load(1); veTrong(); }
                        loadHam();
                    });
                }).catch(function (err) { ums.api.handle(err, 'xoá hàm'); });
        }

        /* ---------- Bảng tham số (ums.crud nhúng) ---------- */
        var T = cfg.thamSo;
        var crud = ums.crud({
            root: zTs,
            embedded: true,
            title: 'Dữ liệu',
            icon: 'fa-database',
            formTitle: 'tham số',
            addText: 'Tạo mới tham số',
            empty: 'Không có dữ liệu',
            autoload: false,
            multi: false,
            toolbar: cfg.toolbar || [],
            list: {
                call: function () {
                    if (!st.funcId) return null;
                    return {
                        action: 'CMS_DanhMucDuLieu/LayDanhSach',
                        method: 'GET',
                        type: 'GET',                         // bản gốc đặt cả 'type' vào tham số gửi đi
                        strTuKhoa: '',
                        strCHUNG_TENDANHMUC_Id: st.funcId,
                        strTieuChiSapXep: T.sapXep,
                        strQUANHECHA_Id: '',
                        dTrangThai: DTT,
                        pageIndex: 1,
                        pageSize: 100000
                    };
                }
            },
            columns: T.columns,
            fields: T.fields,
            save: function (v, row) {
                if (!st.funcId) { ui.toast('Hãy chọn hàm bên tay trái', 'warn'); return null; }
                return T.luu(v, row, st.funcId);
            },
            remove: function (ids) {
                return ids.map(function (id) {
                    return { action: 'CMS_DanhMucDuLieu/Xoa', strId: id, dTrangThai: DTT, strNguoiThucHien_Id: '' };
                });
            }
        });
        function veTrong() {
            var t = crud.z('table');
            if (t && !st.funcId) t.innerHTML = ui.empty('Vui lòng chọn tên bảng để bắt đầu nhập dữ liệu!', 'fa-hand-pointer');
        }
        veTrong();

        /* ---------- Biểu mẫu "Tạo hàm" (thay chỗ khung bên phải) ---------- */
        zHam.innerHTML =
            '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-file-' + (cfg.loai === 'import' ? 'import' : 'export') + '"></i> <span data-dm="fhamt"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-dm': 'hdong' } }) +
                ui.btn('save', { attr: { 'data-dm': 'hluu' } }) + '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-grid ums-grid--1">' +
            '<div>' + ui.field('Chọn ứng dụng', '<select class="ums-select" data-h="ung" data-ph="Chọn ứng dụng"><option value="">Chọn ứng dụng</option></select>') + '</div>' +
            '<div>' + ui.field('Tên hàm', '<input class="ums-input" data-h="ten" autocomplete="off">') + '</div>' +
            '<div>' + ui.field('Mã hàm', '<input class="ums-input" data-h="ma" autocomplete="off">') + '</div>' +
            '<div>' + ui.field('Mã nguồn procedure', '<textarea class="ums-textarea dm-sql" data-h="sql" spellcheck="false" placeholder="' +
                ui.esc('create or replace package pkg_htqte_thongtin is\n procedure Sua_SinhVienQuocTe(ParamTruong_Id varchar2)\nChú ý: Nếu nhập trường này phải có tên package và 1 procedure như ví dụ trên') +
                '"></textarea>') + '</div>' +
            '</div></div></div>';
        ui.enhance(zHam);
        function h(k) { return zHam.querySelector('[data-h="' + k + '"]'); }
        D.ungDung().then(function (rows) { ums.pat.fill(h('ung'), rows, { name: 'TENUNGDUNG' }); });

        function moHam(row) {
            st.sua = row || null;
            zHam.querySelector('[data-dm="fhamt"]').textContent = row ? 'Sửa hàm' : cfg.tieuDeHam;
            var md = cfg.macDinh || {};
            h('ung').value = row ? e(row.NHOMDANHMUC_ID) : loc.val().ung;
            if (window.jQuery) jQuery(h('ung')).trigger('change.select2');
            h('ten').value = row ? e(row.TENDANHMUC) : e(md.ten);
            h('ma').value = row ? e(row.MADANHMUC) : e(md.ma);
            h('sql').value = row ? e(row.MOTA) : e(md.sql);
            if (zHam.hidden) ui.swap(zTs, zHam);
            h('ten').focus();
        }
        function dongHam() { if (!zHam.hidden) ui.swap(zHam, zTs); }

        zHam.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-dm="hdong"]')) dongHam();
            else if (ev.target.closest('[data-dm="hluu"]')) luuHam();
        });

        function luuHam() {
            var f = { ung: h('ung').value || '', ten: h('ten').value.trim(), ma: h('ma').value.trim(), sql: h('sql').value };
            if (!cfg.kiemSQL(f.sql)) {
                ui.toast('Bạn nhập thiếu!', 'warn');
                h('sql').value = '';
                return;
            }
            var sua = st.sua;
            var call = {
                action: 'CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi',
                func: 'pkg_chung_danhmuc.ThemBangDanhMuc',
                strId: '',
                strNguoiThucHien_Id: '',
                strMaDanhMuc: f.ma,
                strTenDanhMuc: f.ten,
                strNhomDanhMuc_Id: f.ung,
                strMoTa: f.sql,
                dThuTu: cfg.thuTu,
                dTrangThai: DTT,
                strPhanCapDanhMuc_Id: '',
                strChung_TenDanhMuc_Cha_Id: ''
            };
            if (sua) {
                // Sửa hàm (chỉ bản export có nút): gốc vẫn gửi strId "" nên TẠO hàm trùng mà báo
                // "Cập nhật thành công!" — làm theo ý định: gửi id + action cập nhật như danhmuctenbang.
                call.strId = sua.ID;
                call.action = 'CMS_DanhMuc_MH/EjQgAyAvJgUgLykMNCIP';
            }
            var btn = zHam.querySelector('[data-dm="hluu"]');
            btn.disabled = true;
            ums.api.call(call).then(function (r) {
                if (sua) {
                    ui.toast('Cập nhật thành công!', 'ok');
                    dongHam();
                    return loadHam();
                }
                ui.toast('Thêm mới thành công!', 'ok');
                var id = cfg.idMoi(r);
                dongHam();
                st.funcId = id || '';
                var job = f.sql !== '' && id ? tuDong(f, id) : Promise.resolve();
                return job.then(function () {
                    loadHam(id);
                    crud.load(1);
                    if (!id) veTrong();
                });
            }).catch(function (err) {
                ums.api.handle(err, 'lưu hàm');
            }).then(function () { btn.disabled = false; });
        }

        /* preSave_Func_*: tách tham số từ mã nguồn, mỗi tham số một lời gọi lưu.
           Gốc bắn cách nhau 300 ms bằng setTimeout; ở đây chạy tuần tự có tiến độ. */
        function tuDong(f, funcId) {
            var p = D.tachSQL(cfg.tachTruoc ? cfg.tachTruoc(f.sql) : f.sql);
            var pkgHam = p.strPackage + '.' + p.strFunctionName;
            var calls = [];
            p.arrThamSo.forEach(function (s, i) {
                // Tham số không nhận ra kiểu (getTypeSup trả "") làm gốc lỗi JS ở dòng đó — bỏ qua
                if (!s) return;
                calls.push(T.tuDong(s.replace(/ /g, '').split(','), i, pkgHam, funcId, f));
            });
            return ui.batch(calls, { title: 'Đang tạo tham số', okText: 'Đã tạo tham số' }).then(function () {
                if (cfg.sauTuDong) cfg.sauTuDong(f);
            });
        }

        loadHam();
        return { crud: crud, master: m, funcId: function () { return st.funcId; } };
    };
})();
