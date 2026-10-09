/* =========================================================================
   Import — tải file mẫu theo chức năng import và nạp tệp Excel qua Handler/Import.aspx
   Bản gốc: ApisCMS/Modules/danhmuc/html/import.html + script/import.js
   Hai cột như gốc: trái = danh sách chức năng import (bấm một mục = tải file mẫu),
   phải = "Lịch sử import"; nút "Import dữ liệu" đổi khung phải sang vùng nạp tệp
   (#zone_import của gốc) — chọn tệp → xem từng sheet → "Import" từng sheet.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn, kiểu cũ không func):
     CMS_DanhMucImport/LayDanhSachHam  GET  strPhanCap_Id "", strCha_Id "", strUngDung_Id, strTuKhoa,
                                            pageIndex 1, pageSize 1000000
     Ứng dụng: pkg_chung_quanlynguoidung.LayDanhSachUngDung (ums.cmsDm.ungDung)
     Tải lên:  edu.system.uploadImport → ums.upload (Handler/up_fileImport.ashx)
     SYS_Import/getDataFormFileImport  GET  strPath → Id = "Sheet1$Sheet2$…", Data = { Table1, Table2… }
     Tải mẫu:  rootPathReport + /Modules/Common/MauImport.aspx?Ma=<MADANHMUC>
     Import 1 sheet: rootPath + /Handler/Import.aspx?fileName=<đường dẫn, bỏ nhân đôi "\">&sheetName=<sheet>

   Khác gốc / lỗi gốc:
     · Bảng "Lịch sử import" gốc KHÔNG có lời gọi nào nạp dữ liệu → giữ khung, luôn trống.
     · Hai ô lọc cột trái không gắn xử lý ở gốc (nghe #dropDMIP_UngDung_Search / #btnSearch /
       #txtSearch_TuKhoa_DMIP — không tồn tại) → nay chọn ứng dụng / Enter / kính lúp nạp lại.
     · Xem sheet: gốc dùng eval('data.Data.Table' + n) → đọc thẳng Data['Table' + n].
     · Bỏ mã chết (không nút nào của màn gọi tới): tạo hàm / tham số (CMS_DanhMucImport/ThemMoiHam,
       XoaHam, ThemMoiThamSo, LayDanhSachThamSo, XoaThamSo) và khối tab hồ sơ cán bộ mẫu trong html.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('import');
    if (!root) return;
    var D = ums.cmsDm, e = D.e;

    var m = ums.pat.master({
        el: root,
        title: 'Import',
        side: { title: 'Danh sách chức năng', kieu: 'danhmuc', search: false, filter: D.locHtml() },
        main: { title: false }
    });
    m.side.classList.add('dm-ham');
    var loc = D.ganLoc(m.el, function () { loadHam(); });

    m.mainBody.innerHTML =
        '<div data-dm="ls">' + ums.pat.panel({
            title: 'Lịch sử import', icon: 'fa-clock-rotate-left', flush: true,
            tools: ui.btn('importer', { text: 'Import dữ liệu', attr: { 'data-dm': 'moim' } }),
            zone: 'lsbang'
        }) + '</div>' +
        '<div data-dm="im" hidden>' + ums.pat.panel({
            title: 'Import', icon: 'fa-file-import',
            tools: ui.btn('close', { attr: { 'data-dm': 'dongim' } }),
            body: '<div data-dm="chon">' + ui.field('Chọn file excel', ui.file({ accept: '.xls,.xlsx', attr: { 'data-dm': 'tep' } })) +
                '<div class="ums-u-fz13 ums-u-muted ums-u-mt-2" data-dm="tt"></div></div>' +
                '<div data-dm="xem" hidden></div>'
        }) + '</div>';
    ui.enhance(m.mainBody);
    function z(k) { return m.mainBody.querySelector('[data-dm="' + k + '"]'); }

    ui.table({
        el: m.mainBody.querySelector('[data-z="lsbang"]'),
        rows: [],
        empty: 'Chưa có lịch sử import',
        columns: [
            { title: 'Chức năng import' }, { title: 'Người thực hiện' },
            { title: 'Số thành công', cls: 'is-center' }, { title: 'Số lỗi', cls: 'is-center' },
            { title: 'File import', cls: 'is-center' }, { title: 'File lỗi', cls: 'is-center' }
        ]
    });

    /* ---------- Danh sách chức năng import ---------- */
    var ds = [];
    function loadHam() {
        var v = loc.val();
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_DanhMucImport/LayDanhSachHam',
            method: 'GET',
            strPhanCap_Id: '',
            strCha_Id: '',
            strUngDung_Id: v.ung,
            strTuKhoa: v.q,
            pageIndex: 1,
            pageSize: 1000000
        }).then(function (r) {
            ds = D.rows(r);
            m.sideCount.textContent = String(ds.length);
            m.sideBody.innerHTML = ds.length ? ds.map(function (x) {
                return '<div class="ums-master__item dm-ham__item" data-id="' + ui.esc(x.ID) + '" title="Tải file mẫu: ' + ui.esc(e(x.MADANHMUC)) + '">' +
                    '<span class="ums-master__item__main">' + ui.esc(e(x.TENDANHMUC)) + '</span>' +
                    '<span class="ums-master__item__act"><span class="ums-iconbtn" aria-hidden="true"><i class="fa-light fa-download"></i></span></span></div>';
            }).join('') : ui.empty('Không có dữ liệu');
        }).catch(function (err) {
            m.sideBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách chức năng import');
        });
    }
    // Gốc: cả mục mang lớp btnDownload_Func → bấm mục là tải file mẫu
    m.sideBody.addEventListener('click', function (ev) {
        var it = ev.target.closest('.dm-ham__item');
        if (!it) return;
        var row = ds.filter(function (x) { return x.ID === it.getAttribute('data-id'); })[0];
        if (!row) return;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.dm-ham__item'), function (x) { x.classList.toggle('is-active', x === it); });
        D.moBaoCao('/Modules/Common/MauImport.aspx?Ma=' + e(row.MADANHMUC));
    });

    /* ---------- Vùng import ---------- */
    var duongDan = '';
    m.mainBody.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-dm="moim"]')) {
            z('chon').hidden = false; z('xem').hidden = true; z('xem').innerHTML = ''; z('tt').textContent = '';
            ui.swap(z('ls'), z('im'));
            return;
        }
        if (ev.target.closest('[data-dm="dongim"]')) { ui.swap(z('im'), z('ls')); return; }
        var tab = ev.target.closest('[data-sheet]');
        if (tab) { hienSheet(tab.getAttribute('data-sheet')); return; }
        var nut = ev.target.closest('[data-imsheet]');
        if (nut) {
            D.moGoc('/Handler/Import.aspx?fileName=' + duongDan.replace(/\\\\/g, '\\') + '&sheetName=' + nut.getAttribute('data-imsheet'));
        }
    });

    z('tep').addEventListener('change', function () {
        var f = z('tep').files;
        if (!f || !f.length) return;
        z('tt').innerHTML = '<i class="fa-light fa-spinner fa-spin"></i> Đang tải tệp lên máy chủ…';
        ums.upload(f).then(function (path) {
            duongDan = path;
            return ums.api.call({ action: 'SYS_Import/getDataFormFileImport', method: 'GET', strPath: path });
        }).then(function (r) {
            z('tt').textContent = '';
            xemImport(r);
        }).catch(function (err) {
            z('tt').textContent = '';
            ums.api.handle(err, 'đọc tệp import');
        }).then(function () { z('tep').value = ''; });
    });

    var bangSheet = {}, dsSheet = [];
    function xemImport(r) {
        var ten = String((r.raw && r.raw.Id) || '').replace(/'/g, '').replace(/"/g, '');
        dsSheet = ten.split('$');
        dsSheet = dsSheet.slice(0, Math.max(0, dsSheet.length - 1));      // gốc lặp tới length - 1
        bangSheet = (r.data && !Array.isArray(r.data)) ? r.data : {};
        if (!dsSheet.length) { ui.toast('Tệp không có sheet nào để import', 'warn'); return; }
        z('chon').hidden = true;
        z('xem').hidden = false;
        hienSheet(dsSheet[0]);
    }
    function hienSheet(ten) {
        var i = dsSheet.indexOf(ten);
        var rows = bangSheet['Table' + (i + 1)] || [];
        var cot = rows.length ? Object.keys(rows[0]) : [];
        z('xem').innerHTML =
            ui.tabs(dsSheet.map(function (s, k) { return { key: s, text: (k + 1) + '. ' + s }; }), ten, 'data-sheet') +
            '<div class="dm-im__bar">' + ui.btn('importer', { text: 'Import', attr: { 'data-imsheet': ten } }) + '</div>' +
            '<div data-dm="sb"></div>';
        ui.table({
            el: z('sb'),
            rows: rows,
            empty: 'Sheet không có dữ liệu',
            columns: cot.map(function (c) {
                return { title: c, cls: 'is-center', render: function (x) { return ui.esc(e(x[c])); } };
            })
        });
    }

    loadHam();
})();
