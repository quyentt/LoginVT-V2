/* =========================================================================
   Import trúng tuyển
   Bản gốc: ApisNhapHoc/Modules/trungtuyen/html/import.html + scripts/import.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     Kế hoạch   SV_Core_NhapHoc_ThuTien_MH / PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc
                (strNguoiThucHien_Id = người đăng nhập — chỉ kế hoạch được phân quyền; cột TENKEHOACH)
     Import     NH_NguoiHoc_ThongTinTuyenSinh/Import — GET, versionAPI v1.0:
                urlfile (đường dẫn tệp đã tải lên, ums.upload = edu.system.uploadImport),
                strKeHoachNhapHoc_Id, strNguoiThucHien_Id.
                Kết quả: Pager = "thànhCông@tổng", Message = các dòng thông báo nối bằng "@".
     Xoá        NH_NguoiHoc_ThongTinTuyenSinh/Xoa_QLSV_NGUOIHOC_TTTS_KeHoach — GET, versionAPI v1.0:
                strTAICHINH_KeHoach_Id, dGioiHanSoLuongCanhBao, strNguoiThucHien_Id
     "Import ▾ → 1. Import Nhập học" = .btnImportWithProce name="IMPORTWITHPROC_NHTT"
                → ums.report.importChung('Import Nhập học', 'IMPORTWITHPROC_NHTT')
   Bố cục như gốc: hai cột — trái "Import tuyển sinh" + "Xóa dữ liệu tuyển sinh", phải "Kết quả import".
   Lỗi gốc đã sửa: điều kiện Xoá `checkValue(txtSoLuongCanhBao) <= 100` so một giá trị ĐÚNG/SAI với 100
     nên LUÔN qua (ô định mức bỏ trống hay 5.000 đều xoá được) → nay bắt nhập số lượng định mức là số
     nguyên dương không quá 100, đúng chữ gợi ý "Không vượt quá 100 bản ghi" của ô.
   Cố ý bỏ: hàm popup() / #btnAddnew_KHNH / #myModal_KHNH (không có trên html), slimScroll.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('importtrungtuyen');
    if (!root) return;


    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Import trúng tuyển</h1><div class="ums-page__actions"></div></div>' +
        '<div class="ums-grid ums-grid--2 ums-cols">' +
            '<div>' +
                pat.panel({
                    title: 'Import tuyển sinh', icon: 'fa-calendar-users',
                    tools:
                        '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
                            '<i class="fa-light fa-cloud-arrow-up"></i><span>Import</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
                            '<div class="ums-drop__menu" role="menu" hidden>' +
                                '<button type="button" class="ums-drop__item" role="menuitem" data-i="proc" title="Import Nhập học">' +
                                '<span class="ums-drop__no">1.</span><span class="ums-drop__text">Import Nhập học</span></button>' +
                            '</div></div>' +
                        ui.btn('importer', { text: 'Import', mod: 'primary', attr: { 'data-i': 'import' } }),
                    body:
                        '<div class="ums-grid">' +
                            ui.field('Kế hoạch', '<select class="ums-select" data-i="kh" data-ph="Chọn kế hoạch nhập học"><option value=""></option></select>') +
                            ui.field('Chọn file import', ui.file({ accept: '.xls,.xlsx', attr: { 'data-i': 'tep' } }),
                                { hint: 'Chọn tệp Excel từ máy tính rồi bấm Import để thực thi import vào hệ thống.' }) +
                        '</div>' +
                        '<details class="ums-u-mt-4"><summary class="ums-u-fz13"><i class="fa-light fa-circle-question"></i> Hướng dẫn sử dụng tính năng import dữ liệu</summary>' +
                            '<div class="ums-u-fz13 ums-u-muted ums-u-mt-2">A. Thực hiện Import dữ liệu<br>' +
                            '1. Chọn file excel cần import bằng nút "Chọn tệp"<br>' +
                            '2. Nhấp chuột vào nút "Import" để thực thi import vào hệ thống</div>' +
                        '</details>'
                }) +
                pat.panel({
                    title: 'Xóa dữ liệu tuyển sinh', icon: 'fa-trash-arrow-up',
                    tools: ui.btn('del', { text: 'Xóa', attr: { 'data-i': 'xoa' } }),
                    body:
                        '<div class="ums-grid">' +
                            ui.field('Kế hoạch', '<select class="ums-select" data-i="khxoa" data-ph="Chọn kế hoạch nhập học"><option value=""></option></select>') +
                            ui.field('Số lượng định mức', '<input class="ums-input" data-i="soluong" inputmode="numeric" placeholder="Không vượt quá 100 bản ghi" autocomplete="off">') +
                        '</div>'
                }) +
            '</div>' +
            pat.panel({
                title: 'Kết quả import', icon: 'fa-file-import', flush: true,
                tools: '<span class="ums-u-fz13">Thành công/tổng số: <b class="ums-u-blue" data-i="tinhtrang"></b></span>',
                body: '<div data-i="ketqua"></div>'
            }) +
        '</div>';

    function f(k) { return root.querySelector('[data-i="' + k + '"]'); }
    ui.enhance(root);

    function veKetQua(ds) {
        ui.table({
            el: f('ketqua'), rows: ds.map(function (x) { return { ND: x }; }), empty: 'Không có dữ liệu tìm thấy!',
            columns: [{ title: 'Nội dung', prop: 'ND' }]
        });
    }
    veKetQua([]);

    /* getList_KeHoachNhapHoc_NhanSu (bản ép gói mới trong import.js gốc) */
    ums.api.call({
        action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
        func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
        strNguoiThucHien_Id: (ums.session && ums.session.userId) || '',
        silent: true
    }).then(function (r) {
        var d = r.data, rows = Array.isArray(d) ? d : (d && d.rs) || [];
        pat.fill(f('kh'), rows, { name: 'TENKEHOACH' });
        pat.fill(f('khxoa'), rows, { name: 'TENKEHOACH' });
    }).catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('button');
        if (!b || !root.contains(b)) return;
        if (b.classList.contains('ums-drop__toggle')) { batDrop(b.closest('.ums-drop')); return; }
        var k = b.getAttribute('data-i');
        if (k === 'proc') {
            dongDrop();
            ums.report.importChung('Import Nhập học', 'IMPORTWITHPROC_NHTT');
        } else if (k === 'import') importTT(b);
        else if (k === 'xoa') xoaTT();
    });

    /* Thả xuống tự dựng (Import ▾ viết cứng trong html gốc) — bấm ra ngoài thì report.js tự đóng */
    function batDrop(d) {
        var m = d.querySelector('.ums-drop__menu'), on = !d.classList.contains('is-open');
        d.classList.toggle('is-open', on);
        m.hidden = !on;
        d.querySelector('.ums-drop__toggle').setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function dongDrop() {
        var d = root.querySelector('.ums-drop');
        if (d && d.classList.contains('is-open')) batDrop(d);
    }

    /* import_TrungTuyen */
    function importTT(btn) {
        var tep = f('tep').files;
        if (!tep || !tep.length) { ui.toast('Vui lòng chọn file trước khi thực hiện import dữ liệu!', 'warn'); return; }
        btn.disabled = true;
        ums.upload(tep).then(function (urlfile) {
            return ums.api.call({
                action: 'NH_NguoiHoc_ThongTinTuyenSinh/Import', method: 'GET', versionAPI: 'v1.0',
                urlfile: urlfile,
                strKeHoachNhapHoc_Id: f('kh').value,
                strNguoiThucHien_Id: ''
            });
        }).then(function (r) {
            var dem = String(r.pager === undefined || r.pager === null ? '' : r.pager).split('@');
            f('tinhtrang').textContent = '(' + (dem[0] || '') + '/' + (dem[1] || '') + ')';
            veKetQua(String(r.message || '').split('@').filter(function (x) { return x !== ''; }));
        }).catch(function (err) {
            ums.api.handle(err, 'NH_NguoiHoc_ThongTinTuyenSinh.Import');
        }).then(function () { btn.disabled = false; });
    }

    /* Xoa_QLSV_NGUOIHOC_TTTS_KeHoach */
    function xoaTT() {
        var kh = f('khxoa').value;
        var sl = (f('soluong').value || '').trim();
        if (!kh || !/^\d+$/.test(sl) || Number(sl) < 1 || Number(sl) > 100) {
            ui.toast('Dữ liệu không hợp lệ: chọn kế hoạch và nhập số lượng định mức từ 1 đến 100.', 'warn');
            return;
        }
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu Người học không?', { tone: 'bad', ok: 'Xoá', title: 'Xóa dữ liệu tuyển sinh' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({
                action: 'NH_NguoiHoc_ThongTinTuyenSinh/Xoa_QLSV_NGUOIHOC_TTTS_KeHoach', method: 'GET', versionAPI: 'v1.0',
                strTAICHINH_KeHoach_Id: kh,
                dGioiHanSoLuongCanhBao: sl,
                strNguoiThucHien_Id: ''
            }).then(function () { ui.toast('Xóa thành công!', 'ok'); });
        }).catch(function (err) { ums.api.handle(err, 'NH_NguoiHoc_ThongTinTuyenSinh.Xoa_QLSV_NGUOIHOC_TTTS_KeHoach'); });
    }

})();
