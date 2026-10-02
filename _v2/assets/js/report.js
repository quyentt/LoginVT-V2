/* =========================================================================
   ums.report / ums.upload / ums.queue — báo cáo, import, tải tệp, hàng đợi
   =========================================================================
   HỢP ĐỒNG GIAO DIỆN — các màn hình gọi đúng những hàm dưới đây. Chữ ký đã
   chốt, đừng đổi. Khoá đánh dấu (+) là khoá tuỳ chọn thêm vào sau.

   ums.report.mount(host, opts) → { reload(), templates }
       Thay edu.system.getList_MauImport(zoneId, callback) (Core/systemroot.js:6670).
       Nạp danh sách mẫu của chức năng đang mở (pkg_phanquyen_dulieu.
       LayDS_PhanQuyen_MauImport), vẽ nút "Xuất báo cáo" và "Import" dạng thả
       xuống vào `host`. Không có mẫu nào thì host để trống.
       opts.collect(add, tpl)   add(khoá, giá trị) như addKeyValue của bản gốc;
                                trả false để huỷ. tpl = dòng mẫu đang chọn.
       opts.tables()            mảng <table> cho mẫu REPORTALLTABLE / REPORTALLINPUT
                                / IMPORTALLINPUT (mặc định: các bảng đang hiện
                                trong #screen)
       opts.onImported(rows)    gọi sau khi import thành công
       (+) opts.importValues    giá trị cho tham số import (xem importChung)
       (+) opts.onLoad(rows)    gọi sau khi nạp xong danh sách mẫu
       (+) opts.import = false   không vẽ nút Import (màn gốc không có vùng <zone>_Import → mẫu import không bao giờ hiện)
       (+) opts.reportText / opts.importText   đổi chữ trên hai nút khi màn gốc
                                dùng chữ khác — KHÔNG tự đổi chữ của bản gốc

   ums.report.run(code, opts) → Promise<{ id, url } | null>
       Chạy thẳng một mẫu báo cáo theo mã (bản gốc: edu.system.report(code, duongDan, callback)).
       opts.collect(add, tpl), opts.duongDan
       (+) opts.tpl       dòng mẫu (mặc định tra trong danh sách mẫu đã nạp)
       Không bao giờ reject: lỗi đã được báo bằng toast, kết quả là null.

   ums.report.importChung(title, maDanhMuc, opts) → { close() }
       Hộp import chung (edu.system.showImportChung, Core/systemroot.js:7600).
       opts.onDone(rows)  thay thuộc tính callback="…" (eval) của bản gốc
       (+) opts.values    { MA | idÔ: giá trị } hoặc function(MA, biểuThức, dòng)
                          → giá trị cho các tham số THONGTIN5 (xem getData bên dưới)

   ums.files.mount(host, { api }) → { load(id), save(id), clear() }
   ums.files.avatar(host, { width, height }) → { set(p), get(), finalize(id) }
       Tệp đính kèm của một bản ghi (uploadFiles/viewFiles/saveFiles gốc).

   ums.upload(files, opts) → Promise<string>
       Tải tệp lên máy chủ như edu.system.uploadImport, trả đường dẫn tệp.
       (+) opts.outFolderPath  mặc định 'Upload/File/'
       (+) opts.raw            true = trả nguyên văn, không nhân đôi dấu \ như bản gốc

   ums.queue.mount(host, { strLoaiNhiemVu, … }) → { reload(strLoaiNhiemVu?) }
       Hàng đợi tác vụ (edu.system.createHangDoi / getList_HangDoi).
       opts.strLoaiNhiemVu      chuỗi, hoặc hàm trả chuỗi (đọc lại mỗi lần nạp —
                                bản gốc đọc một lần lúc khởi tạo nên luôn rỗng phần đuôi)
       (+) opts.onDone()        = objHangDoi.callback của bản gốc, gọi khi chạy xong
       (+) opts.history         false = không vẽ bảng lịch sử; hoặc phần tử/selector
                                để vẽ lịch sử ở chỗ khác (bản gốc: #tblHistory_<strName>)
       (+) opts.concurrency     số lời gọi song song khi chạy (mặc định 10 = giới hạn
                                luồng của makeRequest bản gốc)
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});

    /* =====================================================================
       Tiện ích chung
       ===================================================================== */
    function esc(s) { return ums.ui.esc(s); }
    function toast(m, t, o) { return ums.ui.toast(m, t, o); }
    function node(x) { return typeof x === 'string' ? document.querySelector(x) : x; }
    function S() { return ums.session || {}; }
    function st() { return ums.state || {}; }
    function isDemo() { return st().mode === 'demo'; }
    function userId() { return S().userId || ''; }
    function roleId() { return st().roleId || S().appId || ''; }
    function chucNangId() { return st().chucNangId || ''; }
    function empty(v) { return v === null || v === undefined || v === ''; }

    /** Địa chỉ gốc — me.strhost của bản gốc. Dựng thử thì session chưa init. */
    function host() { return S().host || location.origin; }

    /** edu.util.uuid (Core/util.js:1676) — 32 ký tự hex, không gạch */
    function uuid() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /** Mở URL báo cáo. Bản gốc: location.href = url. Dựng thử: chỉ báo. */
    function openUrl(url) {
        if (isDemo()) {
            toast('Dựng thử — trên máy chủ thật sẽ mở: ' + url, 'info', { title: 'Mở báo cáo', timeout: 9000 });
            return;
        }
        R.navigate(url);
    }

    /**
     * Gốc URL báo cáo. Bản gốc gán me.rootPathReport = TENFILEDINHKEM của vai
     * trò khi chọn vai trò (Core:5060), rồi ĐÈ bằng TENFILEDINHKEM của chức
     * năng khi mở chức năng (Core:811) — kể cả khi cột đó rỗng (ra
     * "undefined?id=…"). Ở đây: chức năng → vai trò → blob phiên, bỏ qua giá
     * trị rỗng. app.js hiện chưa giữ TENFILEDINHKEM của chức năng (normChucNang
     * không chép cột này) nên tạm đọc `report` nếu có.
     */
    function rootPathReport() {
        var s = st();
        var cn = (s.menu || []).filter(function (c) { return c.id === s.chucNangId; })[0];
        if (cn && cn.report) return cn.report;
        var role = (s.roles || []).filter(function (r) { return r.id === s.roleId; })[0];
        if (role && role.report) return role.report;
        return S().rootPathReport || '';
    }

    /* =====================================================================
       Dữ liệu dựng thử — đăng ký lười, KHÔNG đè khoá màn hình đã khai
       ===================================================================== */
    var demoReady = false;
    function ensureDemo() {
        if (demoReady || !isDemo() || !ums.demo || typeof ums.demo.add !== 'function') return;
        demoReady = true;
        var have = ums.demo.fixtures || {};
        var fx = {
            'pkg_phanquyen_dulieu.LayDS_PhanQuyen_MauImport': [
                { MAUIMPORT_MA: 'TC_BAOCAO_TONGHOPKHOANTHU', MAUIMPORT_TENFILEMAU: 'Tổng hợp khoản thu theo khoá', MAUIMPORT_DUONGDAN: '' },
                { MAUIMPORT_MA: 'TC_BAOCAO_XEMTRUOC_BIENLAI', MAUIMPORT_TENFILEMAU: 'Xem trước biên lai (xem tệp)', MAUIMPORT_DUONGDAN: '/reportcms/Modules/Common/XemFile.aspx', XEMFILE: 1 },
                { MAUIMPORT_MA: 'REPORTALLTABLE_tblDanhSach', MAUIMPORT_TENFILEMAU: 'Xuất bảng đang hiển thị', MAUIMPORT_DUONGDAN: '' },
                { MAUIMPORT_MA: 'REPORTALLINPUT_tblDanhSach', MAUIMPORT_TENFILEMAU: 'Xuất bảng nhập liệu' },
                { MAUIMPORT_MA: 'IMPORTALLINPUT_tblDanhSach', MAUIMPORT_TENFILEMAU: 'Nhập lại bảng từ tệp' },
                { MAUIMPORT_MA: 'IMPORTWITHPROC.TAICHINH.KHOANTHU', MAUIMPORT_TENFILEMAU: 'Import khoản thu' }
            ],
            'SYS_Report/ThemMoi': function () {
                return { rows: null, message: uuid().toUpperCase() };
            },
            'SYS_Report/AllTable_Element': { rows: null, message: '' },
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#IMPORTWITHPROC.TAICHINH.KHOANTHU': [
                { ID: 'D1', MA: 'strNguoiThucHien_Id', TEN: 'Người thực hiện', THONGTIN5: 'edu.system.userId' },
                { ID: 'D2', MA: 'strGhiChu', TEN: 'Ghi chú', THONGTIN5: "'Nhập từ giao diện mới'" },
                { ID: 'D3', MA: 'strMaSV', TEN: 'Mã sinh viên', THONGTIN5: '' }
            ],
            'SYS_Import/SImport': [
                { KEY: 'Dòng 2 — SV0001', VALUE: '' },
                { KEY: 'Dòng 3 — SV0002', VALUE: '' },
                { KEY: 'Dòng 4 — SV0003', VALUE: 'Không tìm thấy mã sinh viên' },
                { KEY: 'Dòng 5 — SV0004', VALUE: 'Số tiền không hợp lệ: "12.5OO"' }
            ],
            'SYS_Import/Import_AllTable': { rows: { coltable: -1, lKeyValue: [], strTable_Id: '' } },
            'CMS_HangDoiTuTao/LayDanhSach': [
                { ID: 'HD01', TEN: 'Tính học phí HK1 2026-2027', TONGDULIEUCANTHUCHIEN: 240, TONGDULIEUDAHOANTHANH: 60,
                  NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Hoa', NGAYTAO_DD_MM_YYYY_HHMMSS: '16/09/2026 08:12:40', TAICHINH_CACKHOANTHU_TEN: 'Học phí' },
                { ID: 'HD02', TEN: 'Tính học phí HK2 2025-2026', TONGDULIEUCANTHUCHIEN: 180, TONGDULIEUDAHOANTHANH: 180,
                  NGUOITHUCHIEN_TENDAYDU: 'Trần Văn Nam', NGAYTAO_DD_MM_YYYY_HHMMSS: '02/03/2026 14:05:11', TAICHINH_CACKHOANTHU_TEN: 'Học phí' }
            ],
            'CMS_HangDoiTuTao/LayDSXuLyNhiemVu_HangDoi': function () {
                var r = [];
                for (var i = 0; i < 12; i++) r.push({ ID: 'NV' + (100 + i) });
                return r;
            },
            'CMS_HangDoiTuTao/XuLyNhiemVu_HangDoi': []
        };
        var add = {};
        Object.keys(fx).forEach(function (k) { if (!have.hasOwnProperty(k)) add[k] = fx[k]; });
        ums.demo.add(add);
    }

    /* =====================================================================
       Thả xuống — đóng khi bấm ra ngoài / Esc. Một trình nghe duy nhất cho
       cả trang, gắn một lần khi nạp tệp (không gắn theo từng màn hình).
       ===================================================================== */
    function closeDrops(except) {
        var open = document.querySelectorAll('.ums-drop.is-open');
        for (var i = 0; i < open.length; i++) {
            if (open[i] === except) continue;
            open[i].classList.remove('is-open');
            var m = open[i].querySelector('.ums-drop__menu');
            if (m) m.hidden = true;
            var t = open[i].querySelector('.ums-drop__toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    }
    document.addEventListener('click', function (e) {
        var d = e.target.closest ? e.target.closest('.ums-drop') : null;
        closeDrops(d);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDrops(null);
    });

    function toggleDrop(drop, focusFirst) {
        var menu = drop.querySelector('.ums-drop__menu');
        var btn = drop.querySelector('.ums-drop__toggle');
        var on = !drop.classList.contains('is-open');
        closeDrops(drop);
        drop.classList.toggle('is-open', on);
        menu.hidden = !on;
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        if (on) {
            // Mặc định canh phải (nút nằm ở góc phải đầu trang); tràn trái thì canh trái
            drop.classList.remove('is-left');
            var r = menu.getBoundingClientRect();
            if (r.left < 8) drop.classList.add('is-left');
            var first = menu.querySelector('.ums-drop__item');
            if (first && focusFirst) first.focus();
        }
    }

    /* =====================================================================
       REPORT
       ===================================================================== */
    var R = {};
    var lastTemplates = [];

    /** Chuyển trang tới báo cáo — tách riêng để trang dò thay tạm được */
    R.navigate = function (url) { location.href = url; };      // = edu.system.dtMauBaoCao (mẫu nạp lần gần nhất)

    /** Phân loại mẫu — cbGenCombo_MauImport (Core:6768). Mã ≤ 14 ký tự là mẫu thường. */
    function kindOf(code) {
        code = code || '';
        var k = code.length > 14 ? code.substring(0, 14).toUpperCase() : '';
        switch (k) {
            case 'REPORTALLTABLE': return 'alltable';
            case 'REPORTALLINPUT': return 'allinput';
            case 'IMPORTALLINPUT': return 'importall';
            case 'IMPORTWITHPROC': return 'importproc';
            default: return 'report';
        }
    }

    function findTpl(code) {
        return lastTemplates.filter(function (t) { return t.MAUIMPORT_MA === code; })[0];
    }

    /**
     * ums.report.mount — getList_MauImport (Core:6670) + cbGenCombo_MauImport (Core:6768)
     *
     * Bản gốc vẽ hai vùng: #<zone> (báo cáo) và #<zone>_Import. Ở đây cả hai
     * nút nằm chung trong `host`. Số thứ tự "1., 2., …" đánh trên TOÀN danh
     * sách như bản gốc (nên mục Import có thể bắt đầu từ số lớn).
     *
     * Bản gốc có lối tắt "chỉ một mẫu thì bấm nút là chạy luôn" (Core:6698),
     * nhưng so `attr("class") == "btnBaoCao_LHD"` trong khi lớp thật là
     * "dropdown-item btnBaoCao_LHD" nên lối tắt đó chưa bao giờ chạy. Không chép.
     */
    R.mount = function (hostEl, opts) {
        opts = opts || {};
        hostEl = node(hostEl);
        ensureDemo();
        var inst = { templates: [], reload: load };
        if (!hostEl) return inst;

        hostEl.addEventListener('click', function (e) {
            var tog = e.target.closest('.ums-drop__toggle');
            // detail = 0: bấm bằng bàn phím → đưa tiêu điểm vào mục đầu
            if (tog && hostEl.contains(tog)) { toggleDrop(tog.closest('.ums-drop'), e.detail === 0); return; }
            var it = e.target.closest('.ums-drop__item');
            if (!it || !hostEl.contains(it)) return;
            e.preventDefault();
            closeDrops(null);
            var tpl = inst.templates[Number(it.getAttribute('data-rp'))];
            if (tpl) runTemplate(tpl, opts);
        });
        hostEl.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
            var it = e.target.closest('.ums-drop__item');
            if (!it) return;
            e.preventDefault();
            var sib = e.key === 'ArrowDown' ? it.nextElementSibling : it.previousElementSibling;
            if (sib) sib.focus();
        });

        function load() {
            return ums.api.call({
                action: 'CMS_PhanQuyen_MH/DSA4BRIeESkgLxA0OCQvHgwgNAgsMS4zNQPP',
                func: 'pkg_phanquyen_dulieu.LayDS_PhanQuyen_MauImport',
                strTuKhoa: '',
                strNguoiTao_Id: '',
                strUngDung_Id: roleId(),          // me.appId — chính là VaiTro_Id
                strChucNang_Id: chucNangId(),
                strNguoiDung_Id: userId(),
                strMauImport_Id: '',
                pageIndex: 1,
                pageSize: 100000,
                silent: true
            }).then(function (r) {
                var rows = r.data || [];
                inst.templates = rows;
                lastTemplates = rows;
                draw(rows);
                if (opts.onLoad) opts.onLoad(rows);
                return rows;
            }, function (err) {
                ums.api.handle(err, 'Danh sách mẫu báo cáo');
                return [];
            });
        }

        function draw(rows) {
            var rep = '', imp = '';
            rows.forEach(function (t, i) {
                var k = kindOf(t.MAUIMPORT_MA);
                var icon = k === 'alltable' || k === 'allinput' ? 'fa-eye'
                         : k === 'importall' ? 'fa-cloud-arrow-up' : '';
                var h = '<button type="button" class="ums-drop__item" role="menuitem" data-rp="' + i + '" data-kind="' + k + '">' +
                    '<span class="ums-drop__no">' + (i + 1) + '.</span>' +
                    '<span class="ums-drop__text">' + esc(t.MAUIMPORT_TENFILEMAU) + '</span>' +
                    (icon ? '<i class="fa-light ' + icon + ' ums-drop__mark"></i>' : '') + '</button>';
                if (k === 'importall' || k === 'importproc') imp += h; else rep += h;
            });
            /* Nhãn hai nút lấy ĐÚNG CHỮ CỦA VỎ indexi (Corei/systemroot.js:6945 và
               :6977) — "Xuất báo cáo" / "Import". Mọi màn đang chuyển đều là màn
               của indexi (TENANH kiểu "fa …"), nên không dùng chữ "Báo cáo" của
               vỏ index (Core:6798). Không đổi chữ của bản gốc. */
            hostEl.innerHTML =
                (rep ? dropHtml('report', 'fa-file-chart-column', opts.reportText || 'Xuất báo cáo', rep) : '') +
                (imp && opts.import !== false ? dropHtml('import', 'fa-cloud-arrow-up', opts.importText || 'Import', imp) : '');
        }

        load();
        return inst;
    };

    function dropHtml(key, icon, text, items) {
        return '<div class="ums-drop" data-drop="' + key + '">' +
            '<button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span>' +
            '<i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items + '</div></div>';
    }

    /** Bấm một mục — các nhánh delegate của getList_MauImport (Core:6673-6696) */
    function runTemplate(tpl, opts) {
        var code = tpl.MAUIMPORT_MA;
        switch (kindOf(code)) {
            case 'alltable':
                return reportAllTable(pickTable(code.substring(15), opts), code.substring(15), code, tpl.MAUIMPORT_DUONGDAN, opts, tpl);
            case 'allinput':
                return reportAllInput(pickTable(code.substring(15), opts), code.substring(15));
            case 'importall':
                return showReportAndImportTable(opts);
            case 'importproc':
                return R.importChung(tpl.MAUIMPORT_TENFILEMAU, code, { onDone: opts.onImported, values: opts.importValues });
            default:
                return R.run(code, { collect: opts.collect, duongDan: tpl.MAUIMPORT_DUONGDAN, tpl: tpl });
        }
    }

    /**
     * ums.report.run — edu.system.report (Core:6847)
     *
     * Gửi SYS_Report/ThemMoi thân JSON { arrTuKhoa, arrDuLieu, strNguoiThucHien_Id },
     * máy chủ trả id báo cáo ở Message, rồi mở trang báo cáo với ?id=.
     * Bốn cặp đầu luôn có, đúng thứ tự bản gốc: strTable_Id (null khi báo cáo
     * thường — bản gốc cũng gửi undefined → null), strLoaiBaoCao, strReportCode,
     * strNguoiThucHien_Id; rồi saveFile nếu mẫu có XEMFILE; rồi các cặp của collect.
     *
     * Khác bản gốc: bản gốc gọi me.dtMauBaoCao.find(...).XEMFILE không kiểm
     * tra — gọi report() với mã không có trong danh sách mẫu (hoặc trước khi
     * danh sách nạp xong) là TypeError. Ở đây thiếu mẫu thì coi như không XEMFILE.
     */
    R.run = function (code, opts) {
        opts = opts || {};
        ensureDemo();
        var tpl = opts.tpl || findTpl(code);
        var keys = [], vals = [];
        function add(k, v) { keys.push(k); vals.push(v); }

        add('strTable_Id', opts.tableId);
        add('strLoaiBaoCao', code);
        add('strReportCode', code);
        add('strNguoiThucHien_Id', userId());
        if (tpl && tpl.XEMFILE) add('saveFile', tpl.XEMFILE);

        if (typeof opts.collect === 'function' && opts.collect(add, tpl) === false) {
            return Promise.resolve(null);
        }

        var duongDan = opts.duongDan !== undefined ? opts.duongDan : (tpl ? tpl.MAUIMPORT_DUONGDAN : '');

        return ums.api.json('SYS_Report/ThemMoi', {
            arrTuKhoa: keys,
            arrDuLieu: vals,
            strNguoiThucHien_Id: userId()
        }).then(function (r) {
            var id = r.message;
            if (empty(id)) {
                toast('Chưa lấy được dữ liệu báo cáo!', 'warn');
                return null;
            }
            var url = rootPathReport() + '?id=' + id;
            if (!empty(duongDan) && duongDan !== 'undefined') {
                url = duongDan + '?id=' + id;
                if (duongDan.indexOf('http') === -1) url = host() + url;
            }
            if (tpl && tpl.XEMFILE) viewFile(url, tpl);
            else openUrl(url);
            return { id: id, url: url };
        }, function (err) {
            if (err.expired) ums.api.handle(err);
            else {
                console.error('[ums.report] SYS_Report/ThemMoi', err);
                toast('Có lỗi xảy ra vui lòng thử lại! ' + (err.message || ''), 'bad');
            }
            return null;
        });
    };

    /**
     * Xem tệp báo cáo trong hộp thoại — getList_BaoCao bên trong report (Core:6915).
     * GET <url báo cáo> (không header xác thực, chống cache như cache:false),
     * trả { Success, Data: đường dẫn tệp }, ghép host rồi đặt vào <iframe>.
     */
    function viewFile(url, tpl) {
        var title = (tpl && tpl.MAUIMPORT_TENFILEMAU) || 'Báo cáo';
        var fileUrl = '';
        var dlg = ums.ui.dialog({
            title: title, icon: 'fa-file-chart-column', size: 'xl',
            body: '<div class="ums-rp-view"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang lấy tệp báo cáo…</div></div>',
            buttons: [{
                text: 'Tải về', kind: 'excel', mod: 'primary',
                onClick: function () {
                    if (!fileUrl) { toast('Chưa có tệp để tải.', 'warn'); return false; }
                    var a = document.createElement('a');
                    a.href = fileUrl; a.target = '_blank'; a.rel = 'noopener'; a.download = '';
                    document.body.appendChild(a); a.click(); a.parentNode.removeChild(a);
                    return false;
                }
            }]
        });
        var box = dlg.body.querySelector('.ums-rp-view');

        if (isDemo()) {
            box.innerHTML = ums.ui.empty('Dựng thử — trên máy chủ thật sẽ GET ' + url +
                ' rồi hiện tệp trả về (Data) ở đây.', 'fa-file-chart-column');
            toast('Dựng thử — sẽ lấy tệp từ: ' + url, 'info', { title: 'Xem tệp báo cáo', timeout: 9000 });
            return dlg;
        }

        fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + '_=' + Date.now(), { cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) throw new Error('Máy chủ trả mã ' + res.status);
                return res.json();
            })
            .then(function (d) {
                if (dlg.closed) return;
                if (!d || !d.Success) throw new Error((d && d.Message) || 'Không lấy được tệp báo cáo');
                fileUrl = host() + d.Data;
                box.innerHTML = '';
                var f = document.createElement('iframe');
                f.className = 'ums-rp-view__frame';
                f.title = title;
                box.appendChild(f);
                f.src = fileUrl;
            })
            .catch(function (err) {
                if (dlg.closed) return;
                box.innerHTML = '<div class="ums-rp-msg">' + '<i class="fa-light fa-triangle-exclamation"></i>' + esc(err.message) + '</div>';
            });
        return dlg;
    }

    /* ---------------------------------------------------------------------
       Chọn bảng cho các mẫu REPORTALL* — mã mẫu là "REPORTALLTABLE_<idBảng>".
       Màn hình mới không còn id bảng cũ, nên: bảng có id trùng → bảng đó;
       không có thì bảng đầu tiên trong danh sách ứng viên.
       --------------------------------------------------------------------- */
    function candidateTables(opts) {
        var list;
        if (opts && typeof opts.tables === 'function') list = opts.tables();
        else {
            var scr = document.getElementById('screen') || document.body;
            list = scr.querySelectorAll('table');
        }
        if (!list) return [];
        if (list.nodeType === 1) list = [list];
        return Array.prototype.filter.call(list, function (t) {
            return t && t.tagName === 'TABLE' && t.getClientRects().length > 0;   // = :visible
        });
    }

    function pickTable(name, opts) {
        var c = candidateTables(opts);
        return c.filter(function (t) { return name && t.id === name; })[0] || c[0] || null;
    }

    /* ---------------------------------------------------------------------
       Bảng → mảng ô — addValueV2 (Core:6989 / 7139)

       Bản gốc chèn <td class="tdhidden"> vào DOM thật để "trải phẳng"
       rowspan/colspan rồi lấy chỉ số ô làm iCol. Cách đó sai trong hai
       trường hợp (đã dựng lại để kiểm):
         · ô vừa rowspan vừa colspan chỉ chèn MỘT ô ẩn ở các dòng dưới,
           nên mọi ô bên phải ở dòng dưới lệch trái (colspan−1) cột;
         · dòng dưới có colspan đứng trước cột bị rowspan phủ thì ô ẩn bị
           chèn sai chỗ, ô phía sau lệch cột.
       Ở đây dùng lưới chiếm chỗ chuẩn: iCol = cột logic đầu tiên còn trống.
       Với bảng mà bản gốc làm đúng thì kết quả giống hệt. Không động vào DOM.

       Giữ nguyên các chi tiết lạ của bản gốc:
         · chỉ xét các dòng TRƯỚC dòng rỗng đầu tiên (innerHTML === "");
           iRowMinus = số dòng từ dòng rỗng đó đến hết, và mọi rowspan > 1
           bị trừ đi iRowMinus;
         · bỏ ô có style.display = "none" (chỉ xét style nội tuyến);
         · tfoot mang strData_Align = "HEAD" như thead;
         · iRow cộng dồn qua thead → tbody → tfoot.
       Khác: bản gốc chỉ lấy tbody ĐẦU TIÊN; ở đây lấy mọi tbody.
       --------------------------------------------------------------------- */
    function tableCells(table, cfg) {
        var out = [];
        var iRow = 0;
        var sections = [];
        if (table.tHead) sections.push([table.tHead, 'HEAD']);
        Array.prototype.forEach.call(table.tBodies, function (b) { sections.push([b, 'BODY']); });
        if (table.tFoot) sections.push([table.tFoot, 'HEAD']);

        sections.forEach(function (s) { iRow += section(s[0], s[1], iRow); });
        return out;

        function section(sec, type, rowStart) {
            var rows = sec.rows;
            var lhang = 0;
            while (lhang < rows.length && rows[lhang].innerHTML !== '') lhang++;
            var iRowMinus = rows.length - lhang;
            var taken = [];      // taken[r][c] = true khi ô logic đã bị chiếm

            for (var r = 0; r < lhang; r++) {
                taken[r] = taken[r] || [];
                var col = 0;
                var oGoc = ums.ui.oTheoGoc(rows[r]);   // ô chọn dòng đã dời xuống cuối → về vị trí gốc
                for (var j = 0; j < oGoc.length; j++) {
                    var cell = oGoc[j];
                    while (taken[r][col]) col++;
                    var rs = cell.rowSpan > 1 ? cell.rowSpan - iRowMinus : cell.rowSpan;
                    var cs = cell.colSpan;
                    for (var a = 0; a < Math.max(rs, 1); a++) {
                        if (r + a >= lhang) break;
                        taken[r + a] = taken[r + a] || [];
                        for (var b = 0; b < cs; b++) taken[r + a][col + b] = true;
                    }
                    if (cell.style.display !== 'none') {
                        var o = {
                            strTable_Id: cfg.uuid,
                            strTable: cfg.name,
                            iRow: r + rowStart,
                            iCol: col,
                            iRowSpan: rs,
                            iColSpan: cs
                        };
                        if (cfg.input) {
                            var v = cellInputs(cell);
                            o.strData_Cell = v.value;
                            o.strData_TempId = v.tempId;
                        } else {
                            o.strData_Cell = cellText(cell);
                        }
                        o.strData_Align = type;
                        out.push(o);
                    }
                    col += cs;
                }
            }
            return lhang;
        }
    }

    /** Chữ của ô selected option — $(sel).val() != "" ? option:selected.text() : "" */
    function selectText(sel) {
        if (sel.value === '' && !sel.multiple) return '';
        var t = '';
        Array.prototype.forEach.call(sel.options, function (o) { if (o.selected) t += o.text; });
        if (sel.multiple && !t) return '';
        return t;
    }

    /**
     * Chữ của một ô cho REPORTALLTABLE (Core:6961-6974 + $(cell).text()).
     * Bản gốc THAY select/input bằng chữ ngay trên trang (người dùng mất ô
     * nhập sau khi xuất). Ở đây làm trên bản sao của ô; giá trị đọc từ phần tử
     * thật (cloneNode không giữ lựa chọn hiện tại của select). Bỏ thêm khung
     * .select2-container để chữ của select2 không bị đếm hai lần.
     */
    function cellText(cell) {
        var live = cell.querySelectorAll('select, input');
        if (!live.length && !cell.querySelector('.select2-container')) return cell.textContent;
        var copy = cell.cloneNode(true);
        Array.prototype.forEach.call(copy.querySelectorAll('.select2-container'), function (x) { x.parentNode.removeChild(x); });
        var dup = copy.querySelectorAll('select, input');
        for (var i = 0; i < dup.length; i++) {
            var src = live[i];
            var txt = src.tagName === 'SELECT' ? selectText(src) : src.value;
            dup[i].parentNode.replaceChild(document.createTextNode(txt), dup[i]);
        }
        return copy.textContent;
    }

    /** Giá trị ô cho REPORTALLINPUT (Core:7182-7201): select trước, input sau, nối bằng ";" */
    function cellInputs(cell) {
        var value = '', tempId = '';
        Array.prototype.forEach.call(cell.querySelectorAll('select'), function (s) {
            value += ';' + selectText(s);
            tempId += ';' + s.id + '#select';
        });
        Array.prototype.forEach.call(cell.querySelectorAll('input'), function (x) {
            value += ';' + x.value;
            tempId += ';' + x.id + '#input';
        });
        if (value !== '') value = value.substring(1);
        else value = cell.textContent;
        if (tempId !== '') tempId = tempId.substring(1);
        return { value: value, tempId: tempId };
    }

    /**
     * Lưu mảng ô. Bản gốc gọi báo cáo trong `complete` — chạy cả khi lời gọi
     * lỗi (nhiều khả năng vì máy chủ trả thân rỗng, jQuery coi là lỗi phân
     * tích JSON). Ở đây: lỗi HTTP ≥ 400 / hết phiên thì dừng và báo; còn lại
     * (kể cả thân không phải JSON) thì đi tiếp như bản gốc.
     */
    function saveCells(cells) {
        return ums.api.json('SYS_Report/AllTable_Element', cells).then(function () { return true; }, function (err) {
            if (err.expired || err.status >= 400) { ums.api.handle(err, 'SYS_Report/AllTable_Element'); return false; }
            console.warn('[ums.report] SYS_Report/AllTable_Element', err.message, '— vẫn mở báo cáo như bản gốc');
            return true;
        });
    }

    /** REPORTALLTABLE — reportAllTable (Core:6957) */
    function reportAllTable(table, name, code, duongDan, opts, tpl) {
        if (!table) { toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); return Promise.resolve(null); }
        var id = uuid();
        var cells = tableCells(table, { uuid: id, name: name, input: false });
        return saveCells(cells).then(function (ok) {
            if (!ok) return null;
            if (!empty(duongDan)) {
                return R.run(code, { collect: opts && opts.collect, duongDan: duongDan, tableId: id, tpl: tpl });
            }
            var url = host() + '/reportcms/Modules/Common/BaoCao.aspx?id=' + id + '&table=' + name;
            openUrl(url);
            return { id: id, url: url };
        });
    }

    /** REPORTALLINPUT — reportAllTable_Input (Core:7124) */
    function reportAllInput(table, name) {
        if (!table) { toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); return Promise.resolve(null); }
        var id = uuid();
        var cells = tableCells(table, { uuid: id, name: name, input: true });
        return saveCells(cells).then(function (ok) {
            if (!ok) return null;
            var colreport = table.getAttribute('colreport') || '';
            var url = host() + '/reportcms/Modules/Common/BaoCao.aspx?id=' + id + '&type=input&table=' + name + '&colreport=' + colreport;
            openUrl(url);
            return { id: id, url: url };
        });
    }

    /**
     * IMPORTALLINPUT — showReportAndImportTable (Core:7527) + importAllTable_Input (Core:7317)
     *
     * Hộp: chọn bảng để tải (View = REPORTALLTABLE, Input = REPORTALLINPUT),
     * và ô tải tệp để nạp giá trị ngược vào các ô nhập của bảng.
     * Bản gốc chỉ liệt kê bảng CÓ id; bảng của ums.ui.table không có id nên
     * ở đây bảng không id vẫn được liệt kê ("Bảng n") để xuất được — nhưng
     * nạp ngược cần id ô nhập (strData_TempId) nên chỉ chạy với bảng có id
     * và ô nhập có id, như bản gốc.
     */
    function showReportAndImportTable(opts) {
        var tables = candidateTables(opts);
        if (!tables.length) { toast('Bạn cần hiện thị dữ liệu trước khi thao tác!', 'warn'); return null; }

        var optHtml = '<option value="">-- Chọn bảng --</option>';
        tables.forEach(function (t, i) {
            var label = t.id || ('Bảng ' + (i + 1));
            optHtml += '<option value="' + i + ':view">' + esc(label) + ' - View</option>';
            optHtml += '<option value="' + i + ':input">' + esc(label) + ' - Input</option>';
        });

        var dlg = ums.ui.dialog({
            title: 'Xuất / nhập bảng', icon: 'fa-table', size: 'md',
            body:
                '<div class="ums-rp-form">' +
                ums.ui.field('Tải xuống', '<select class="ums-select" data-rp="table">' + optHtml + '</select>') +
                ums.ui.field('Tải lên', '<div data-rp="up"></div>') +
                '<div class="ums-u-fz13 ums-u-muted"><i>Chú ý: Cần hiển thị bảng trước khi xuất và import</i></div>' +
                '</div>'
        });

        var sel = dlg.body.querySelector('[data-rp="table"]');
        sel.addEventListener('change', function () {
            if (!sel.value) return;
            var p = sel.value.split(':');
            var t = tables[Number(p[0])];
            var name = t.id || '';
            // Bản gốc gọi reportAllTable(id) chỉ một tham số → không mẫu, không đường dẫn → BaoCao.aspx
            if (p[1] === 'input') reportAllInput(t, name);
            else reportAllTable(t, name, undefined, '', null, null);
        });

        uploader(dlg.body.querySelector('[data-rp="up"]'), function (path) {
            if (path) importAllTableInput(path);
        });
        return dlg;
    }

    /** importAllTable_Input (Core:7317) — GET SYS_Import/Import_AllTable rồi điền ngược */
    function importAllTableInput(path) {
        return ums.api.call({
            action: 'SYS_Import/Import_AllTable',
            method: 'GET',
            strPath: path,
            strNguoiThucHien_Id: userId(),
            timeout: 3000000
        }).then(function (r) {
            var d = r.data || {};
            var coltable = d.coltable;
            var list = d.lKeyValue || [];
            if (coltable !== null && coltable !== undefined && coltable !== -1) {
                var t = document.getElementById(d.strTable_Id);
                if (!t || !t.tBodies[0]) { toast('Không tìm thấy bảng ' + d.strTable_Id + ' trên màn hình.', 'warn'); return; }
                Array.prototype.forEach.call(t.tBodies[0].rows, function (row) {
                    var c = ums.ui.oTheoGoc(row)[coltable];
                    if (!c) return;
                    var key = c.innerText;
                    fillBack(list.filter(function (e) { return e.strTemp === key; }), row.id);
                });
            } else {
                fillBack(list);
            }
            toast('Đã nạp dữ liệu từ tệp vào bảng.', 'ok');
        }, function (err) { ums.api.handle(err, 'SYS_Import/Import_AllTable'); });
    }

    /** Xeload (Core:7366) — đặt giá trị theo id "<idÔ>#input|select" */
    function fillBack(arr, rowId) {
        arr.forEach(function (a) {
            var parts = String(a.strKey || '').split('#');
            var id = parts[0];
            if (rowId) {
                var n = document.getElementById(id);
                while (n && n.nodeName !== 'TR') n = n.parentNode;
                if (n && n.id) id = id.replace(n.id, rowId);
            }
            var el = id ? document.getElementById(id) : null;
            if (!el) return;
            if (parts[1] === 'input') {
                el.value = a.strValue;
            } else {
                Array.prototype.forEach.call(el.options || [], function (o) {
                    if (o.text === a.strValue) {
                        el.value = o.value;
                        if (global.jQuery) jQuery(el).trigger('change');
                        else el.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            }
        });
    }

    /* =====================================================================
       Ô TẢI TỆP — phần giao diện của uploadImport (Core:1160-1394)
       onChange(đườngDẫn) gọi sau khi tải xong, và gọi với '' khi gỡ tệp.
       ===================================================================== */
    function uploader(box, onChange, opts) {
        opts = opts || {};
        box.innerHTML =
            '<div class="ums-upload">' +
            '<label class="ums-upload__pick">' +
            '<input type="file" class="ums-upload__input" accept=".xls,.xlsx,.doc,.docx">' +
            '<i class="fa-light fa-file-arrow-up"></i><span>Chọn tệp (.xls, .xlsx, .doc, .docx)</span></label>' +
            '<div class="ums-upload__files" data-up="files"></div>' +
            '<div class="ums-upload__state" data-up="state" hidden></div>' +
            '</div>';
        var input = box.querySelector('input[type=file]');
        var files = box.querySelector('[data-up="files"]');
        var state = box.querySelector('[data-up="state"]');
        var ctl = { busy: false, path: '' };

        function setState(html) { state.hidden = !html; state.innerHTML = html || ''; }

        input.addEventListener('change', function () {
            var f = input.files;
            if (!f || !f.length) return;
            ctl.busy = true;
            box.querySelector('.ums-upload').classList.add('is-busy');
            setState('<i class="fa-light fa-spinner fa-spin"></i> Đang tải tệp lên máy chủ…');
            var names = Array.prototype.map.call(f, function (x) { return x.name; });
            ums.upload(f, opts).then(function (path) {
                ctl.path = path;
                setState('');
                files.innerHTML = names.map(function (n) {
                    return '<span class="ums-upload__file"><i class="fa-light fa-file-excel"></i>' +
                        '<span class="ums-upload__name">' + esc(n) + '</span>' +
                        '<button type="button" class="ums-upload__del" title="Gỡ tệp"><i class="fa-light fa-xmark"></i></button></span>';
                }).join('');
                onChange(path);
            }, function (err) {
                setState('<span class="ums-u-danger"><i class="fa-light fa-triangle-exclamation"></i> ' + esc(err.message) + '</span>');
            }).then(function () {
                ctl.busy = false;
                box.querySelector('.ums-upload').classList.remove('is-busy');
                input.value = '';       // chọn lại đúng tệp cũ vẫn bắn change
            });
        });

        files.addEventListener('click', function (e) {
            if (!e.target.closest('.ums-upload__del')) return;
            files.innerHTML = '';
            ctl.path = '';
            onChange('');
        });
        return ctl;
    }

    /* =====================================================================
       IMPORT CHUNG — showImportChung (Core:7600)
       ===================================================================== */

    /**
     * Giá trị tham số import từ cột THONGTIN5 ("GetData" ở màn hình
     * ApisCMS › danhmucimport). Bản gốc eval() nguyên văn chuỗi này — một biểu
     * thức JS do quản trị viên gõ, đọc giá trị từ trang đang mở, kiểu:
     *     edu.util.getValById('dropHocKy')   $('#dropHocKy').val()
     *     edu.system.userId                   'hằng số'
     * Không eval nữa. Thứ tự tìm giá trị:
     *   1. opts.values của màn hình (theo MA, hoặc theo id ô trong biểu thức,
     *      hoặc hàm values(MA, biểuThức, dòng) trả khác undefined)
     *   2. hằng chuỗi / số
     *   3. biến phiên: edu.system.userId | appId | strChucNang_Id | langId
     *   4. đọc ô theo id với các mẫu getValById / $('#x').val() /
     *      document.getElementById('x').value — nếu ô có trên trang
     * Không khớp mẫu nào, hoặc ô không có trên trang (id cũ không còn ở màn
     * hình mới) → KHÔNG import, báo rõ tham số nào thiếu. Bản gốc trong trường
     * hợp ô thiếu sẽ lặng lẽ gửi chuỗi rỗng — dễ ghi sai dữ liệu hàng loạt.
     */
    function getData(row, values) {
        var ma = row.MA, expr = String(row.THONGTIN5).trim();
        if (typeof values === 'function') {
            var fv = values(ma, expr, row);
            if (fv !== undefined) return { ok: true, v: fv };
        } else if (values && values.hasOwnProperty(ma)) {
            return { ok: true, v: values[ma] };
        }
        var s = expr.replace(/;+\s*$/, '').trim();
        var m;
        if ((m = /^(['"])([\s\S]*)\1$/.exec(s)) && m[2].indexOf(m[1]) < 0) return { ok: true, v: m[2] };
        if (/^-?\d+(\.\d+)?$/.test(s)) return { ok: true, v: s };

        var sys = {
            'edu.system.userId': userId(),
            'edu.system.appId': roleId(),
            'edu.system.strChucNang_Id': chucNangId(),
            'edu.system.langId': S().langId || 'VI'
        };
        if (sys.hasOwnProperty(s)) return { ok: true, v: sys[s] };

        var id = null;
        var pats = [
            /^edu\.util\.getValById\(\s*(['"])([\w\-]+)\1\s*\)$/,
            /^\$\(\s*(['"])#([\w\-]+)\1\s*\)\.val\(\s*\)$/,
            /^document\.getElementById\(\s*(['"])([\w\-]+)\1\s*\)\.value$/
        ];
        for (var i = 0; i < pats.length && !id; i++) {
            m = pats[i].exec(s);
            if (m) id = m[2];
        }
        if (id) {
            if (values && typeof values === 'object' && values.hasOwnProperty(id)) return { ok: true, v: values[id] };
            var el = document.getElementById(id);
            if (el) return { ok: true, v: valById(el) };
            return { ok: false, why: ma + ' ← ' + expr + ' (không có ô #' + id + ' trên màn hình)' };
        }
        return { ok: false, why: ma + ' ← ' + expr + ' (biểu thức không hỗ trợ)' };
    }

    /** edu.util.getValById (Core/util.js:1267) — trim, ô chọn nhiều bỏ SELECTALL */
    function valById(el) {
        var v;
        if (el.tagName === 'SELECT' && el.multiple) {
            v = Array.prototype.filter.call(el.options, function (o) { return o.selected; })
                .map(function (o) { return o.value; }).join(',');
        } else {
            v = el.value;
        }
        if (v && typeof v === 'string') v = v.trim();
        if (v && el.id.indexOf('drop') === 0 && el.multiple) {
            v = v.replace('SELECTALL,', '');
            if (v.indexOf(',') === 0) v = v.substr(1);
        }
        return v === undefined || v === null ? '' : v;
    }

    /**
     * ums.report.importChung — showImportChung (Core:7600) + GetDuLieuDanhMuc + ImportData
     *
     * Luồng: chọn tệp → ums.upload → (có mã danh mục) lấy cấu hình tham số
     * (CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM, dTrangThai 995) →
     * SYS_Import/SImport (form-urlencoded, lKeyVal là mảng { strKey, strVal })
     * → bảng lỗi + opts.onDone(rows). Lỗi kết nối thì thử lại tối đa 2 lần,
     * cách nhau 1 giây, như bản gốc.
     *
     * Thời gian chờ: bản gốc để 3.000.000 ms (50 phút) cho mọi lời gọi;
     * ums.api.call mặc định 2 phút — import tệp lớn sẽ bị cắt, nên truyền lại
     * đúng 3.000.000 ms.
     */
    /**
     * Hai nút của màn nhập điểm (edu.system.reportAllTable_User / showReportAndImportTable_User(true),
     * Core:7392 / Core:7557):
     *   R.taiBangNhap(table)   — "Tải bảng điểm": lưu từng ô (kèm id ô nhập) rồi mở BaoCao.aspx?type=input
     *   R.nhapBangTuTep(opts)  — "Nhập điểm qua file": hộp chỉ có ô tải tệp; nạp giá trị NGƯỢC vào các ô
     *                            nhập theo id rồi opts.onDone(). KHÔNG lưu — người dùng bấm Lưu sau.
     * Bảng phải có id (và thuộc tính colreport nếu có), ô nhập phải có id — tệp tải ra mang id đó,
     * nạp ngược dựa vào id đó (như bản gốc).
     */
    R.taiBangNhap = function (table) { return reportAllInput(table, table && table.id); };
    R.nhapBangTuTep = function (opts) {
        opts = opts || {};
        var dlg = ums.ui.dialog({ title: opts.title || 'Nhập điểm qua file', icon: 'fa-file-arrow-up', size: 'md',
            body: '<div class="ums-rp-form">' + ums.ui.field('Thực hiện import', '<div data-rp="up"></div>') +
                '<div class="ums-u-fz13 ums-u-muted"><i>Dùng tệp tải về từ nút "Tải bảng điểm" của chính bảng này.</i></div></div>' });
        uploader(dlg.body.querySelector('[data-rp="up"]'), function (path) {
            if (!path) return;
            importAllTableInput(path).then(function () { dlg.close(); if (opts.onDone) opts.onDone(); });
        });
        return dlg;
    };

    R.importChung = function (title, maDanhMuc, opts) {
        opts = opts || {};
        ensureDemo();
        title = title === undefined || title === null ? '' : String(title);
        var hasMa = !empty(maDanhMuc);
        var mauUrl = hasMa ? host() + '/reportcms/Modules/Common/MauImport.aspx?Ma=' + maDanhMuc : '';

        var dlg = ums.ui.dialog({
            title: 'Import ' + title, icon: 'fa-cloud-arrow-up', size: 'xl',
            body:
                '<div class="ums-rp-form">' +
                ums.ui.field('Tải lên ' + title, '<div data-im="up"></div>') +
                (hasMa ? ums.ui.field('Mẫu ' + title,
                    '<a class="ums-rp-link" href="' + esc(mauUrl) + '" data-im="mau">' +
                    '<i class="fa-light fa-file-import"></i><span>Tải tệp mẫu</span></a>') : '') +
                '</div>' +
                '<div class="ums-rp-progress" data-im="prog" hidden>' +
                '  <div class="ums-rp-progress__head"><i class="fa-light fa-spinner fa-spin"></i><b data-im="lbl">Đang import…</b></div>' +
                '  <div class="ums-meter ums-meter--busy"><div class="ums-meter__track"><div class="ums-meter__fill"></div></div></div>' +
                '  <div class="ums-rp-progress__hint">Máy chủ đang xử lý toàn bộ tệp. Vui lòng không đóng cửa sổ này.</div>' +
                '  <div class="ums-rp-progress__note" data-im="note"></div>' +
                '</div>' +
                '<div class="ums-rp-msg" data-im="msg" hidden></div>' +
                '<div class="ums-rp-result" data-im="result"></div>',
            onClose: function () { stopProgress(); closed = true; }
        });

        var $ = function (k) { return dlg.body.querySelector('[data-im="' + k + '"]'); };
        var closed = false, running = false, retry = 0, timer = null;

        if (hasMa && isDemo()) {
            $('mau').addEventListener('click', function (e) { e.preventDefault(); openUrl(mauUrl); });
        }

        function showMsg(t) { var m = $('msg'); m.hidden = false; m.innerHTML = '<i class="fa-light fa-triangle-exclamation"></i><span>' + esc(t) + '</span>'; }
        function hideMsg() { var m = $('msg'); m.hidden = true; m.innerHTML = ''; }

        function startProgress() {
            var t0 = Date.now();
            running = true;
            $('note').innerHTML = '';
            $('result').innerHTML = '';
            $('prog').hidden = false;
            var tick = function () {
                var s = Math.floor((Date.now() - t0) / 1000);
                $('lbl').textContent = 'Đang import — đã chạy ' + ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
            };
            tick();
            if (timer) clearInterval(timer);
            timer = setInterval(tick, 1000);
        }
        function stopProgress() {
            running = false;
            if (timer) { clearInterval(timer); timer = null; }
            if (!closed) { $('note').innerHTML = ''; $('prog').hidden = true; }
        }

        uploader($('up'), function (path) {
            if (running) return;
            if (!path) { hideMsg(); $('result').innerHTML = ''; return; }
            hideMsg();
            retry = 0;
            startProgress();
            var body = {
                action: 'SYS_Import/SImport',
                strPath: path,
                strApp_Id: roleId(),                // edu.system.appId = VaiTro_Id
                strMaDanhMuc: maDanhMuc,
                strChucNang_Id: chucNangId(),
                strNguoiThucHien_Id: userId(),
                lKeyVal: []
            };
            if (!hasMa) { importData(body); return; }

            ums.api.call({
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                method: 'GET',
                strMaBangDanhMuc: maDanhMuc,
                strTieuChiSapXep: '',
                dTrangThai: 995,
                timeout: 3000000
            }).then(function (r) { return r.data || []; }, function (err) {
                if (err.status === 200) return [];          // Success=false: bản gốc vẫn import với lKeyVal rỗng
                throw err;
            }).then(function (rows) {
                var lKeyVal = [], miss = [];
                rows.forEach(function (row) {
                    if (empty(row.THONGTIN5)) return;
                    var g = getData(row, opts.values);
                    if (g.ok) lKeyVal.push({ strKey: row.MA, strVal: g.v });
                    else miss.push(g.why);
                });
                if (miss.length) {
                    stopProgress();
                    console.warn('[ums.report.importChung] thiếu giá trị tham số', miss);
                    showMsg('Chưa import: mẫu cần giá trị mà màn hình này chưa cung cấp — ' + miss.join('; ') +
                        '. Màn hình cần truyền opts.values cho ums.report.importChung / importValues cho ums.report.mount.');
                    return;
                }
                body.lKeyVal = lKeyVal;
                importData(body);
            }, function (err) {
                stopProgress();
                if (err.expired) return ums.api.handle(err);
                showMsg('Không lấy được cấu hình danh mục import. Vui lòng thử lại.');
            });
        });

        function importData(body) {
            var call = { method: 'POST', timeout: 3000000 };
            Object.keys(body).forEach(function (k) { call[k] = body[k]; });
            ums.api.call(call).then(function (r) {
                stopProgress();
                if (closed) { if (opts.onDone) opts.onDone(r.data || []); return; }
                var rows = r.data || [];
                if (rows.length) $('result').innerHTML = resultTable(rows);
                if (opts.onDone) opts.onDone(rows);
            }, function (err) {
                if (err.expired) { stopProgress(); return ums.api.handle(err); }
                if (err.status === 200) {                 // Success=false
                    stopProgress();
                    if (!closed) showMsg('Import không thực hiện được: ' + (err.message || ''));
                    return;
                }
                retry++;
                if (retry <= 2 && !closed) {
                    $('note').innerHTML = '<i class="fa-light fa-rotate-right"></i> Kết nối lỗi, đang thử lại lần ' + retry + '/2...';
                    setTimeout(function () { if (!closed) importData(body); }, 1000);
                    return;
                }
                stopProgress();
                if (!closed) showMsg('Import thất bại: không gọi được máy chủ sau 3 lần thử. Vui lòng kiểm tra lại tệp rồi thực hiện lại.');
            });
        }

        return { close: dlg.close };
    };

    /** Bảng kết quả import — ImportData (Core:7760). VALUE khác rỗng = dòng lỗi. */
    function resultTable(rows) {
        var ok = 0, bad = 0, body = '';
        rows.forEach(function (d) {
            if (empty(d.VALUE)) { ok++; return; }
            bad++;
            body += '<tr><td>' + esc(d.KEY) + '</td><td>' + esc(d.VALUE) + '</td></tr>';
        });
        return '<div class="ums-rp-sum">' +
            '<span class="ums-badge ums-badge--ok">Thành công ' + ok + '</span>' +
            '<span class="ums-badge ums-badge--' + (bad ? 'bad' : 'mute') + '">Thất bại ' + bad + '</span></div>' +
            (bad ? '<div class="ums-tablewrap"><table class="ums-table ums-table--lined"><thead><tr>' +
                '<th style="width:40%">Dữ liệu</th><th>Lỗi</th></tr></thead><tbody>' + body + '</tbody></table></div>' : '');
    }

    /* =====================================================================
       UPLOAD — uploadImport (Core:1115), phần gửi tệp upLoadFiles (Core:1213)
       ===================================================================== */

    /** checkFileImport (Core:1396). Bản gốc so bằng indexOf trong ".xls.xlsx.doc.docx"
        nên "x", "xl", "do", "doc" … cũng lọt; ở đây so khớp đúng đuôi. */
    var IMPORT_EXT = ['xls', 'xlsx', 'doc', 'docx'];

    /**
     * ums.upload(files, opts) → Promise<đường dẫn>
     *
     * POST <rootPath>/Handler/up_fileImport.ashx?outFolderPath=Upload/File/
     *   thân multipart: mỗi tệp một trường, TÊN TRƯỜNG = TÊN TỆP (formData.append(name, file))
     *   không header Authorization (bản gốc dùng $.ajax trần), cookie cùng nguồn như $.ajax
     * Máy chủ trả chữ thuần: đường dẫn tệp đã lưu; nhiều tệp thì nối bằng ",".
     * Chứa "Loi System" = lỗi.
     *
     * Kết quả giống hệt chuỗi callback của uploadImport nhận được: các đường
     * dẫn nối bằng "," và MỌI dấu "\" bị nhân đôi (outThongTinDinhKem, Core:1379,
     * ghi chú "Khac ban chinh"). SYS_Import/* nhận đúng chuỗi đó. opts.raw = true
     * để lấy nguyên văn.
     */
    ums.upload = function (files, opts) {
        opts = opts || {};
        var list = !files ? [] : (files.length !== undefined ? Array.prototype.slice.call(files) : [files]);
        if (!list.length) return Promise.reject(new Error('Bạn chưa chọn file nào!'));

        for (var i = 0; i < list.length; i++) {
            var n = list[i].name || '';
            var ext = n.substring(n.lastIndexOf('.') + 1).toLowerCase();
            if (IMPORT_EXT.indexOf(ext) < 0) return Promise.reject(new Error('File ' + n + ' không hợp lệ!'));
        }
        var names = list.map(function (f) { return f.name; });

        function finish(text) {
            if (text.indexOf('Loi System') !== -1) throw new Error(text);
            var paths = names.length > 1 ? text.split(',') : [text];
            if (paths.length !== names.length) throw new Error('File đính kèm không hợp lệ. Vui lòng thử lại');
            var out = paths.join(',');
            return opts.raw ? out : out.replace(/\\/g, '\\\\');
        }

        if (isDemo()) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(finish(names.map(function (x) { return 'Upload/File/' + uuid().substring(0, 8) + '_' + x; }).join(',')));
                }, 400);
            });
        }

        var fd = new FormData();
        list.forEach(function (f) { fd.append(f.name, f); });
        var url = (S().rootPath || host()) + '/Handler/up_fileImport.ashx?outFolderPath=' + (opts.outFolderPath || 'Upload/File/');

        return fetch(url, { method: 'POST', body: fd, cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) throw new Error(res.statusText || ('Máy chủ trả mã ' + res.status));
                return res.text();
            })
            .then(finish);
    };

    /* =====================================================================
       HÀNG ĐỢI — createHangDoi (Core:3395), getList_HangDoi (Core:3205),
       excuteHangDoi (Core:3541), taskControl (Core:6283)
       ===================================================================== */
    var Q = {};

    /**
     * Vẽ các hàng đợi CHƯA xong (TONGDULIEUDAHOANTHANH ≠ TONGDULIEUCANTHUCHIEN)
     * kèm thanh tiến độ và nút "Bắt đầu", cùng bảng lịch sử mọi hàng đợi.
     *
     * Khác bản gốc:
     *  · bản gốc chỉ gọi callback khi bộ đếm tiến độ chạm ĐÚNG tổng (bắt đầu
     *    từ số đã hoàn thành trước đó) — số nhiệm vụ còn lại lệch một chút là
     *    không bao giờ báo xong. Ở đây báo xong khi mọi lời gọi đã trả về.
     *  · lỗi kết nối của từng nhiệm vụ bản gốc chỉ alert, không tính là thất
     *    bại; ở đây tính là thất bại để còn hỏi "chạy lại".
     *  · nút Huỷ (.btnCancle) của bản gốc không làm gì — không vẽ.
     *  · taskControl (thanh tác vụ ở đầu trang, #sysTask_Content) không chép:
     *    updateStatus_Task dùng biến `me` chưa khai báo nên sẽ ném lỗi nếu
     *    có lúc chạy tới; màn hình Tài chính cũng không dùng.
     */
    Q.mount = function (hostEl, opts) {
        opts = opts || {};
        hostEl = node(hostEl);
        ensureDemo();
        var inst = { reload: load, rows: [] };
        if (!hostEl) return inst;

        var histEl = null;
        if (opts.history !== false) {
            histEl = opts.history && opts.history !== true ? node(opts.history) : null;
        }
        hostEl.innerHTML = '<div class="ums-queue" data-q="list"></div>' +
            (opts.history !== false && !histEl ? '<div class="ums-queue__history" data-q="hist"></div>' : '');
        var listEl = hostEl.querySelector('[data-q="list"]');
        if (opts.history !== false && !histEl) histEl = hostEl.querySelector('[data-q="hist"]');
        var runningIds = {};

        function loai() {
            var v = typeof opts.strLoaiNhiemVu === 'function' ? opts.strLoaiNhiemVu() : opts.strLoaiNhiemVu;
            return v === undefined || v === null ? '' : v;
        }

        function load(newLoai) {
            if (newLoai !== undefined) opts.strLoaiNhiemVu = newLoai;
            return ums.api.call({
                action: 'CMS_HangDoiTuTao/LayDanhSach',
                method: 'GET',
                strLoaiNhiemVu_Id: loai(),
                strNguoiThucHien_Id: userId(),
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 1000
            }).then(function (r) {
                inst.rows = r.data || [];
                drawList(inst.rows);
                drawHistory(inst.rows);
                return inst.rows;
            }, function (err) {
                ums.api.handle(err, 'CMS_HangDoiTuTao/LayDanhSach');
                listEl.innerHTML = ums.ui.fail(err.message);
                return [];
            });
        }

        function num(v) { var n = Number(v); return isNaN(n) ? 0 : n; }   // edu.util.returnZero

        function drawList(rows) {
            var open = rows.filter(function (d) { return num(d.TONGDULIEUCANTHUCHIEN) !== num(d.TONGDULIEUDAHOANTHANH); });
            if (!open.length) {
                listEl.innerHTML = '<div class="ums-queue__none"><i class="fa-light fa-circle-check"></i>Không có tiến trình nào cần xử lý!</div>';
                return;
            }
            listEl.innerHTML = open.map(function (d) {
                var total = num(d.TONGDULIEUCANTHUCHIEN), done = num(d.TONGDULIEUDAHOANTHANH);
                return '<div class="ums-queue__item" data-qid="' + esc(d.ID) + '">' +
                    '<div class="ums-queue__name">Thanh tiến trình ' + esc(d.TEN) + '</div>' +
                    '<div class="ums-queue__bar">' + meter(done, total) + '</div>' +
                    '<button type="button" class="ums-btn ums-btn--primary ums-btn--sm" data-qstart="' + esc(d.ID) + '">' +
                    '<i class="fa-light fa-play"></i><span>Bắt đầu</span></button></div>';
            }).join('');
        }

        function meter(done, total) {
            var p = total ? Math.round(done / total * 100) : 0;
            return '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" style="width:' + p + '%"></div></div>' +
                '<b class="ums-queue__count">' + done + '/' + total + ' (' + p + '%)</b></div>';
        }

        function drawHistory(rows) {
            if (!histEl) return;
            ums.ui.table({
                el: histEl,
                rows: rows,
                empty: 'Chưa có lần chạy nào',
                columns: [
                    { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TENDAYDU' },
                    { title: 'Ngày thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                    { title: 'Tổng thực hiện', prop: 'TONGDULIEUCANTHUCHIEN', cls: 'is-center' },
                    { title: 'Tổng hoàn thành', prop: 'TONGDULIEUDAHOANTHANH', cls: 'is-center' },
                    // Bản gốc đổ cột này nhưng thiếu tiêu đề (4 <th> cho 5 cột dữ liệu)
                    { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' }
                ]
            });
        }

        listEl.addEventListener('click', function (e) {
            var b = e.target.closest('[data-qstart]');
            if (!b) return;
            execute(b.getAttribute('data-qstart'));
        });

        /** excuteHangDoi (Core:3541) */
        function execute(id) {
            if (runningIds[id]) return;
            var item = listEl.querySelector('[data-qid="' + cssEsc(id) + '"]');
            var row = inst.rows.filter(function (d) { return String(d.ID) === String(id); })[0] || {};
            var btn = item && item.querySelector('[data-qstart]');
            runningIds[id] = true;
            if (btn) btn.disabled = true;
            if (item) item.classList.add('is-running');

            ums.api.call({
                action: 'CMS_HangDoiTuTao/LayDSXuLyNhiemVu_HangDoi',
                method: 'GET',
                dTinhTrang: 0,
                strHangDoi_Id: id,
                strNguoiThucHien_Id: userId(),
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 1000000,
                timeout: 3000000
            }).then(function (r) {
                var tasks = r.data || [];
                var total = num(row.TONGDULIEUCANTHUCHIEN) || tasks.length;
                var before = num(row.TONGDULIEUDAHOANTHANH);
                var ok = 0, bad = 0, n = 0;
                if (!tasks.length) { finish(); toast('Hàng đợi không còn nhiệm vụ nào cần xử lý.', 'info'); return; }

                var idx = 0, conc = Math.max(1, opts.concurrency || 10);
                function worker() {
                    if (idx >= tasks.length) return Promise.resolve();
                    var t = tasks[idx++];
                    return ums.api.call({
                        action: 'CMS_HangDoiTuTao/XuLyNhiemVu_HangDoi',
                        method: 'POST',
                        silent: true,
                        strNguoiThucHien_Id: userId(),
                        strId: t.ID,
                        timeout: 3000000
                    }).then(function () { ok++; }, function (e) {
                        bad++;
                        if (e.expired) { idx = tasks.length; ums.api.handle(e); }
                    }).then(function () {
                        n++;
                        var bar = item && item.querySelector('.ums-queue__bar');
                        if (bar) bar.innerHTML = meter(Math.min(before + n, total), total);
                        return worker();
                    });
                }
                var pool = [];
                for (var k = 0; k < conc; k++) pool.push(worker());
                return Promise.all(pool).then(function () {
                    finish();
                    if (typeof opts.onDone === 'function') opts.onDone();
                    toast('Tổng dữ liệu: ' + tasks.length + '. Tiến trình đã xử lý: ' + ok, bad ? 'warn' : 'ok');
                    if (bad) {
                        return ums.ui.confirm('Có ' + bad + ' nhiệm vụ lỗi. Bạn có muốn chạy lại không?', { ok: 'Chạy lại' })
                            .then(function (yes) { if (yes) execute(id); });
                    }
                    if (item && item.parentNode) item.parentNode.removeChild(item);
                    if (!listEl.querySelector('.ums-queue__item')) drawList([]);
                });
            }, function (err) {
                finish();
                ums.api.handle(err, 'CMS_HangDoiTuTao/LayDSXuLyNhiemVu_HangDoi');
            });

            function finish() {
                delete runningIds[id];
                if (btn) btn.disabled = false;
                if (item) item.classList.remove('is-running');
            }
        }

        load();
        return inst;
    };

    function cssEsc(s) { return global.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); }

    /* ---------- Xuất ra ngoài -------------------------------------------- */
    /* =====================================================================
       TỆP ĐÍNH KÈM CỦA MỘT BẢN GHI — edu.system.uploadFiles / viewFiles /
       saveFiles (Corei/systemroot.js:1017, 1405, 1536) + UploadFile
       (<RootPathUpload>/Core/uploadfile.js)
       ---------------------------------------------------------------------
           var f = ums.files.mount(hostEl, { api: 'NS_Files' });
           f.load(duLieuId)      mở biểu mẫu sửa: <api>/LayDanhSach   (rỗng = xoá trắng)
           f.save(duLieuId)      sau khi lưu bản ghi: chép + <api>/ThemMoi cho tệp MỚI
           f.clear()             biểu mẫu thêm mới

       Đúng trình tự bản gốc:
         1. Chọn tệp → tải NGAY lên <RootPathUpload>/Handler/up_files_v2.ashx
            ?outFolderPath=<MAUNGDUNG>/<folderDoc>/<folder>/&userId=…
            máy chủ trả tên tệp tạm (nhiều tệp: nối dấu phẩy).
         2. Lưu bản ghi xong → với mỗi tệp chưa lưu: copyfile.ashx?sourceFile=
            &strId=<id bản ghi>&userId= (trả đường dẫn chính thức; "Sys_error…"
            thì giữ tên tạm, như copyFile gốc) → <api>/ThemMoi.
         3. Xoá tệp đã lưu → hỏi → <api>/Xoa { strIds }.
       Tệp mở bằng <RootPathUpload>/<FILEMINHCHUNG> (getRootPathImg gốc).

       Khác bản gốc:
         · bản gốc gắn `$(document).delegate('.btnDelUploadedFile')` MỖI LẦN
           viewFiles chạy → mở biểu mẫu N lần thì một cú bấm xoá hỏi N lần.
           Ở đây mỗi khung một trình xử lý.
         · copyFile gốc gọi ajax ĐỒNG BỘ (treo trang); ở đây tuần tự bằng Promise.
       ===================================================================== */
    var FILE_EXT = '.csv.doc.docx.djvu.odp.ods.odt.pps.ppsx.ppt.pptx.pdf.ps.eps.rtf.txt.wks.wps.xls.xlsx.xps.svg.7z.zip.rar.jar.tar.tar.gz.cab.bmp.exr.gif.ico.jp2.jpeg.pbm.pcx.pgm.png.ppm.psd.tiff.tga.jpg.3gp.avi.flv.m4v.mkv.mov.mp4.mpeg.ogv.wmv.webm.aac.ac3.aiff.amr.ape.au.flac.m4a.mka.mp3.mpc.ogg.ra.wav.wma.chm.epub.fb2.lit.lrf.mobi.pdb.rb.tcr';
    var FILE_ICON = {
        jpg: ['fa-file-image', 'img'], jpeg: ['fa-file-image', 'img'], png: ['fa-file-image', 'img'], gif: ['fa-file-image', 'img'],
        doc: ['fa-file-word', 'doc'], docx: ['fa-file-word', 'doc'],
        xls: ['fa-file-excel', 'xls'], xlsx: ['fa-file-excel', 'xls'],
        pdf: ['fa-file-pdf', 'pdf'],
        zip: ['fa-file-zipper', ''], rar: ['fa-file-zipper', ''], '7z': ['fa-file-zipper', '']
    };
    function fileUrl(path) {
        var base = S().rootPathUpload || '';
        return path ? base + '/' + String(path).replace(/^\/+/, '') : '';
    }
    function appCode() {
        var st_ = st(), id = st_.roleId;
        var r = (st_.roles || []).filter(function (x) { return x.id === id; })[0];
        return (r && r.code) || S().appCode || '';
    }

    var FL = {};
    FL.mount = function (hostEl, o) {
        o = o || {};
        hostEl = node(hostEl);
        var api = o.api || '';
        var saved = [];     // [{ id, path, name }]  đã có trong CSDL
        var pending = [];   // [{ path, name }]      đã tải lên, chưa gắn bản ghi
        var busy = 0;

        hostEl.innerHTML =
            '<div class="ums-files">' +
            (o.readonly ? '' :
            '<label class="ums-btn ums-btn--out-primary ums-btn--sm ums-files__pick">' +
            '<input type="file" multiple hidden><i class="fa-light fa-paperclip"></i><span>Chọn tệp</span></label>') +
            '<div class="ums-files__list"></div>' +
            '</div>';
        var elList = hostEl.querySelector('.ums-files__list');
        var elInput = hostEl.querySelector('input[type="file"]');

        function item(f, isNew, i) {
            var ext = String(f.path || f.name).split('.').pop().toLowerCase();
            var ic = FILE_ICON[ext] || ['fa-file', ''];
            var name = String(f.name || f.path).split('/').pop();
            return '<div class="ums-files__item' + (isNew ? ' is-new' : '') + '">' +
                '<i class="fa-light ' + ic[0] + ' ums-files__ic' + (ic[1] ? ' ums-files__ic--' + ic[1] : '') + '"></i>' +
                (isNew || isDemo()
                    ? '<span class="ums-files__name">' + esc(name) + '</span>'
                    : '<a class="ums-files__name" href="' + esc(fileUrl(f.path)) + '" target="_blank" rel="noopener">' + esc(name) + '</a>') +
                (isNew ? '<span class="ums-files__tag">chưa lưu</span>' : '') +
                (o.readonly ? '' : '<button type="button" class="ums-iconbtn ums-files__del" title="Xoá tệp" data-fdel="' +
                    (isNew ? 'n' : 's') + i + '"><i class="fa-light fa-xmark"></i></button>') +
                '</div>';
        }
        function draw() {
            var h = saved.map(function (f, i) { return item(f, false, i); }).join('') +
                pending.map(function (f, i) { return item(f, true, i); }).join('');
            elList.innerHTML = h || (busy ? '' : '<span class="ums-files__empty">Chưa có tệp đính kèm</span>');
            if (busy) elList.insertAdjacentHTML('beforeend', '<span class="ums-files__empty"><i class="fa-light fa-spinner fa-spin"></i> Đang tải tệp lên…</span>');
        }

        function upload(list) {
            var names = saved.map(function (f) { return f.name; }).concat(pending.map(function (f) { return f.name; }));
            var chon = [];
            for (var i = 0; i < list.length; i++) {
                var n = list[i].name;
                if (names.indexOf(n) >= 0) continue;              // trùng tên: bỏ qua như bản gốc
                var ext = n.substring(n.lastIndexOf('.') + 1).toLowerCase();
                if (FILE_EXT.indexOf('.' + ext) < 0) { toast('File ' + n + ' không hợp lệ!', 'warn'); return Promise.resolve(); }
                chon.push(list[i]);
            }
            if (!chon.length) return Promise.resolve();
            busy++; draw();
            var p;
            if (isDemo()) {
                p = new Promise(function (ok) {
                    setTimeout(function () { ok(chon.map(function (f) { return 'unsave_' + uuid().substring(0, 8) + '_' + f.name; }).join(',')); }, 300);
                });
            } else {
                var fd = new FormData();
                chon.forEach(function (f) { fd.append(f.name, f); });
                var out = [appCode(), S().folderDoc, o.folder].filter(function (x) { return x; })
                    .map(function (x) { return x + '/'; }).join('');
                p = fetch(S().rootPathUpload + '/Handler/up_files_v2.ashx?outFolderPath=' + out + '&userId=' + userId(),
                    { method: 'POST', body: fd, cache: 'no-store' })
                    .then(function (res) {
                        if (!res.ok) throw new Error(res.statusText || ('Máy chủ tệp trả mã ' + res.status));
                        return res.text();
                    });
            }
            return p.then(function (text) {
                if (text.indexOf('Sys_error: ') >= 0) throw new Error(text);
                var paths = chon.length > 1 ? text.split(',') : [text];
                if (paths.length !== chon.length) throw new Error('File đính kèm không hợp lệ. Vui lòng thử lại');
                paths.forEach(function (path, k) { pending.push({ path: path, name: chon[k].name }); });
            }).catch(function (err) { ums.api.handle(err, 'tải tệp lên'); })
              .then(function () { busy--; draw(); });
        }

        function copyFile(src, id) {
            if (isDemo()) return Promise.resolve(src.replace(/^unsave_/, id + '_'));
            return fetch(S().rootPathUpload + '/Handler/copyfile.ashx?sourceFile=' + encodeURIComponent(src) +
                '&strId=' + encodeURIComponent(id) + '&userId=' + userId(), { method: 'POST', cache: 'no-store' })
                .then(function (res) { return res.text(); })
                .then(function (t) { return t.indexOf('Sys_error') !== 0 ? t : src; }, function () { return src; });
        }

        if (elInput) elInput.addEventListener('change', function () {
            var list = Array.prototype.slice.call(elInput.files || []);
            elInput.value = '';
            if (!list.length) { toast('Bạn chưa chọn file nào!', 'warn'); return; }
            upload(list);
        });
        elList.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-fdel]');
            if (!b) return;
            var k = b.getAttribute('data-fdel'), i = Number(k.slice(1));
            if (k[0] === 'n') { pending.splice(i, 1); draw(); return; }
            var f = saved[i];
            ums.ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { title: 'Xoá tệp' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: api + '/Xoa', strIds: f.id }).then(function () {
                    saved.splice(saved.indexOf(f), 1); draw();
                    toast('Xóa dữ liệu thành công!', 'ok');
                });
            }).catch(function (err) { ums.api.handle(err, 'xoá tệp'); });
        });

        var ctl = {
            clear: function () { saved = []; pending = []; draw(); },
            load: function (id) {
                saved = []; pending = []; draw();
                if (!id || !api) return Promise.resolve();
                return ums.api.call({ action: api + '/LayDanhSach', method: 'GET', silent: true, strDuLieu_Id: id })
                    .then(function (r) {
                        saved = (Array.isArray(r.data) ? r.data : []).filter(function (x) { return x.FILEMINHCHUNG; })
                            .map(function (x) { return { id: x.ID, path: x.FILEMINHCHUNG, name: x.TENHIENTHI || String(x.FILEMINHCHUNG).split('/').pop() }; });
                        draw();
                    }).catch(function (err) { ums.api.handle(err, 'nạp tệp đính kèm'); });
            },
            /** Gắn các tệp mới vào bản ghi — gọi SAU khi lưu bản ghi có id */
            save: function (id) {
                if (!pending.length || !id || !api) return Promise.resolve();
                var ds = pending.slice();
                return ds.reduce(function (p, f) {
                    return p.then(function () { return copyFile(f.path, id); }).then(function (path) {
                        return ums.api.call({
                            action: api + '/ThemMoi',
                            strDuLieu_Id: id,
                            strTenHienThi: f.name,
                            strThongTinMinhChung: '',
                            strFileMinhChung: path,
                            strNguoiThucHien_Id: '',
                            keyVals: [{ strKey: path, strVal: f.name }]
                        });
                    }).then(function () { pending.splice(pending.indexOf(f), 1); });
                }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu tệp đính kèm'); });
            },
            /** Chép các tệp ĐÃ LƯU (của bản ghi nguồn vừa load) thành tệp chờ gắn: lưu bản ghi mới
                thì copyfile sang id mới — như bcheckTimKiem của các màn sản phẩm khoa học gốc */
            chep: function () {
                pending = pending.concat(saved.map(function (f) { return { path: f.path, name: f.name }; }));
                saved = []; draw();
            },
            pending: function () { return pending.length; },
            busy: function () { return busy > 0; }
        };
        draw();
        return ctl;
    };

    /* ---------------------------------------------------------------------
       ẢNH ĐẠI DIỆN — edu.system.uploadAvatar + getImage (Corei/systemroot.js:1045,
       1572) + UploadAvatar (<RootPathUpload>/Core/uploadavatar.js)
           var a = ums.files.avatar(hostEl, { width: 336, height: 448 });
           a.set(duongDan)            đổ ảnh đang có (cột ANH)
           a.finalize(id) → Promise<duongDan>   gọi khi LƯU: ảnh vừa tải lên
                                      (tên chứa "unsave_") được chép sang tên
                                      chính thức qua copyfile.ashx, như getImage
       Bấm vào ảnh → chọn tệp ảnh → up_file_v2.ashx?iWidth&iHeight&outFolderPath=
       <MAUNGDUNG>/<folderAvatar>/ ; ảnh tạm trước đó (nếu có) xoá bằng del_file_v2.ashx.
       --------------------------------------------------------------------- */
    var ANH_EXT = '.bmp.exr.gif.ico.jp2.jpeg.pbm.pcx.pgm.png.ppm.psd.tiff.tga.jpg';
    /** Đường dẫn đầy đủ của tệp trên máy chủ tệp (edu.system.getRootPathImg) */
    FL.url = fileUrl;

    FL.avatar = function (hostEl, o) {
        o = o || {};
        hostEl = node(hostEl);
        var duong = '', tam = '';
        // Chưa có ảnh (hoặc ảnh hỏng) thì hiện hình người vẽ sẵn — không phụ
        // thuộc no-avatar.png trên máy chủ tệp (thiếu tệp đó là ra ảnh vỡ).
        hostEl.innerHTML = '<label class="ums-avatar is-empty" title="Bấm để đổi ảnh">' +
            '<img alt=""><i class="fa-light ' + (o.icon || 'fa-user') + ' ums-avatar__none"></i><input type="file" accept="image/*" hidden>' +
            '<span class="ums-avatar__hint"><i class="fa-light fa-camera"></i> Đổi ảnh</span></label>';
        var box = hostEl.querySelector('.ums-avatar'), img = hostEl.querySelector('img'), inp = hostEl.querySelector('input');
        img.onerror = function () { box.classList.add('is-empty'); };
        img.onload = function () { box.classList.remove('is-empty'); };
        function ve() {
            if (!duong || isDemo()) { box.classList.add('is-empty'); img.removeAttribute('src'); return; }
            img.src = fileUrl(duong);
        }
        inp.addEventListener('change', function () {
            var f = inp.files && inp.files[0];
            inp.value = '';
            if (!f) return;
            var ext = f.name.substring(f.name.indexOf('.') + 1).toLowerCase();
            if (ANH_EXT.indexOf('.' + ext) < 0) { toast('Avatar không hỗ trợ định dạng trên', 'warn'); return; }
            var p;
            /* Hiện NGAY ảnh vừa chọn từ máy (không chờ máy chủ tệp): trước đây chỉ nạp lại từ đường
               dẫn tạm trên máy chủ, nạp hỏng là ô quay về hình trống → người dùng tưởng không đổi được. */
            var xem = '';
            try { xem = URL.createObjectURL(f); img.src = xem; } catch (e) { /* không xem trước được thì thôi */ }
            if (isDemo()) {
                p = Promise.resolve('unsave_' + uuid().substring(0, 8) + '_' + f.name);
            } else {
                var fd = new FormData(); fd.append(f.name, f);
                var out = [appCode(), S().folderAvatar, o.folder].filter(function (x) { return x; }).map(function (x) { return x + '/'; }).join('');
                p = fetch(S().rootPathUpload + '/Handler/up_file_v2.ashx?iWidth=' + (o.width || 336) + '&iHeight=' + (o.height || 448) +
                    '&outFolderPath=' + out + '&userId=' + userId(), { method: 'POST', body: fd, cache: 'no-store' })
                    .then(function (res) { if (!res.ok) throw new Error('Máy chủ tệp trả mã ' + res.status); return res.text(); });
            }
            p.then(function (t) {
                if (t.indexOf('Sys_error: ') >= 0) throw new Error(t);
                if (tam && !isDemo()) fetch(S().rootPathUpload + '/Handler/del_file_v2.ashx?strFileDel=' + encodeURIComponent(tam), { method: 'POST' }).catch(function () {});
                t = String(t).trim();
                tam = t; duong = t;
                if (!xem) ve();                       // không xem trước được thì nạp từ máy chủ như gốc
            }).catch(function (err) { ve(); ums.api.handle(err, 'tải ảnh lên'); });   // lỗi: về ảnh cũ
        });
        return {
            set: function (p) { duong = p || ''; tam = ''; ve(); },
            get: function () { return duong; },
            finalize: function (id) {
                if (!duong || duong.indexOf('unsave_') < 0) return Promise.resolve(duong);
                if (isDemo()) return Promise.resolve(duong.replace('unsave_', id + '_'));
                return fetch(S().rootPathUpload + '/Handler/copyfile.ashx?sourceFile=' + encodeURIComponent(duong) +
                    '&strId=' + encodeURIComponent(id) + '&userId=' + userId(), { method: 'POST', cache: 'no-store' })
                    .then(function (r) { return r.text(); })
                    .then(function (t) { return t.indexOf('Sys_error') !== 0 ? t : duong; }, function () { return duong; });
            }
        };
    };

    R._tableCells = tableCells;          // để trang dò kiểm mảng ô
    ums.files = FL;
    ums.report = R;
    ums.queue = Q;

})(window);
