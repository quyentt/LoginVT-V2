/* =========================================================================
   Số tín kế hoạch — số tín chỉ quy định theo từng phạm vi áp dụng của quỹ học bổng
   Bản gốc: ApisHocBong/Modules/kehoach/html/sotinkehoach.html + script/sotinkehoach.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung "Tìm kiếm" (Quỹ học bổng · Thời gian · từ khoá · Tìm kiếm) →
   khung "Danh sách (n)" — đầu khung có ô "Quy tắc khởi tạo" + nút "Khởi tạo dữ liệu"; bảng Phạm vi áp dụng
   · Phân loại · Thời gian · Số tín quy định (ô nhập sửa ngay trong bảng); nút "Lưu" dưới bảng.

   Lời gọi (chép nguyên, đều POST, có func):
       XLHV_HB_ThongTin_MH · pkg_hocbong_thongtin.LayDSHB_QuyHocBong — ô quỹ (strTuKhoa '' · strNguoiTao_Id ''
            (gốc đọc txtAAAA/dropAAAA) · pageIndex 1 · pageSize 10000)
       XLHV_HB_Chung_MH · pkg_hocbong_chung.LayDSThoiGianTheoKeHoach — ô thời gian (cột THOIGIAN)
       Danh mục HB.QUYTAC.TINHSOTINCHITOITHIEU — ô quy tắc khởi tạo
       XLHV_HB_ThongTin_MH · pkg_hocbong_thongtin.LayDSHB_QuyDinh_SoTinChi — danh sách (strTuKhoa,
            strHB_QuyHocBong_Id, strDaoTao_ThoiGianDaoTao_Id), KHÔNG phân trang (gốc chú thích bPaginate);
            số ở đầu khung = Pager.
       XLHV_HB_TinhToan_MH · pkg_hocbong_tinhtoan.KhoiTaoDuLieuTinhSoTinChi — "Khởi tạo dữ liệu"
            (strHB_QuyHocBong_Id, strDaoTao_ThoiGianDaoTao_Id, strQuyTacTinhSoTin_Id) — gốc không hỏi lại,
            xong (kể cả lỗi) nạp lại danh sách.
       XLHV_HB_ThongTin_MH · pkg_hocbong_thongtin.Sua_HB_QuyDinh_SoTinDangKy — "Lưu": mỗi ô đã đổi một lời
            gọi (strId = ID dòng, dSoQuyDinh = giá trị ô); hỏi lại "lưu N dữ liệu", xong nạp lại.
   Khác gốc: mở màn KHÔNG tự nạp danh sách (gốc chú thích getList_SoTinKeHoach trong init) — giữ như gốc.
   Cố ý bỏ: cột ô đánh dấu + ô "chọn tất cả" (không nút nào đọc: #btnXoaSoTinKeHoach không có trên
     html gốc, hàm delete_SoTinKeHoach không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('hb-sotinkehoach');
    if (!root) return;

    var TT = 'XLHV_HB_ThongTin_MH/';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    root.innerHTML = pat.page('Số tín kế hoạch', '') +
        pat.panel({ title: 'Tìm kiếm', icon: 'fa-window-restore', cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="quy" data-ph="Chọn quỹ học bổng"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="tg" data-ph="Chọn thời gian"><option value=""></option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-list', count: 'n', flush: true, zone: 'bang',
            tools: '<div class="ums-field hbth-quytac"><select class="ums-select" data-f="qt" data-ph="Chọn quy tắc"><option value=""></option></select></div>' +
                ui.btn('search', { text: 'Khởi tạo dữ liệu', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'khoitao' } }),
            foot: '<div class="hbth-chan">' + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) + '</div>' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    z('bang').innerHTML = ui.empty('Chọn quỹ học bổng, thời gian rồi bấm Tìm kiếm');

    ums.api.call({ action: TT + 'DSA4BRIJAx4QNDgJLiIDLi8m', func: 'pkg_hocbong_thongtin.LayDSHB_QuyHocBong', silent: true,
        strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 })
        .then(function (r) { pat.fill(f('quy'), arr(r.data), { name: 'TEN', head: 'Chọn quỹ học bổng' }); })
        .catch(function (err) { ums.api.handle(err, 'quỹ học bổng'); });
    ums.api.call({ action: 'XLHV_HB_Chung_MH/DSA4BRIVKS4oBiggLxUpJC4KJAkuICIp', func: 'pkg_hocbong_chung.LayDSThoiGianTheoKeHoach',
        silent: true, strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); })
        .catch(function (err) { ums.api.handle(err, 'thời gian'); });
    ums.api.dm('HB.QUYTAC.TINHSOTINCHITOITHIEU').then(function (d) {
        pat.fill(f('qt'), d, { head: pat.dmTitle(d) || 'Chọn quy tắc' });
    }).catch(function (err) { ums.api.handle(err, 'quy tắc khởi tạo'); });

    var luot = 0;
    function tai() {
        var sh = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: TT + 'DSA4BRIJAx4QNDgFKC8pHhIuFSgvAiko', func: 'pkg_hocbong_thongtin.LayDSHB_QuyDinh_SoTinChi',
            strTuKhoa: (f('q').value || '').trim(), strHB_QuyHocBong_Id: f('quy').value,
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                if (sh !== luot) return;
                var rs = arr(r.data);
                ui.table({ el: z('bang'), rows: rs, empty: 'Không có dữ liệu', columns: [
                    { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
                    { title: 'Phân loại', prop: 'PHANCAPPHAMVI_TEN' },
                    { title: 'Thời gian', prop: 'THOIGIAN' },
                    { title: 'Số tín quy định', cls: 'is-center', width: '160px', render: function (x) {
                        return '<input class="ums-input ums-input--sm hbth-so" inputmode="decimal" data-st="' + esc(x.ID) + '" value="' +
                            esc(e(x.SOQUYDINH)) + '" data-cu="' + esc(e(x.SOQUYDINH)) + '" autocomplete="off">';
                    } }
                ] });
                z('n').textContent = '(' + (r.pager !== undefined && r.pager !== null && r.pager !== '' ? r.pager : rs.length) + ')';
            })
            .catch(function (err) {
                if (sh !== luot) return;
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách số tín');
            });
    }

    function luu() {
        var doi = Array.prototype.filter.call(z('bang').querySelectorAll('input[data-st]'), function (i) {
            return i.value !== i.getAttribute('data-cu');
        });
        if (!doi.length) { ui.toast('Không có thay đổi để lưu', 'info'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { ok: 'Lưu' }).then(function (ok) {
            if (!ok) return;
            ui.batch(doi.map(function (i) {
                return { action: TT + 'EjQgHgkDHhA0OAUoLykeEi4VKC8FIC8mCjgP', func: 'pkg_hocbong_thongtin.Sua_HB_QuyDinh_SoTinDangKy',
                    strId: i.getAttribute('data-st'), dSoQuyDinh: i.value, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang lưu', okText: 'Thực hiện thành công' }).then(tai);
        });
    }

    function khoiTao(b) {
        b.disabled = true;
        ums.api.call({ action: 'XLHV_HB_TinhToan_MH/CikuKBUgLgU0DSgkNBUoLykSLhUoLwIpKAPP', func: 'pkg_hocbong_tinhtoan.KhoiTaoDuLieuTinhSoTinChi',
            strHB_QuyHocBong_Id: f('quy').value, strDaoTao_ThoiGianDaoTao_Id: f('tg').value,
            strQuyTacTinhSoTin_Id: f('qt').value, strNguoiThucHien_Id: uid() })
            .then(function () { ui.toast('Thực hiện thành công', 'ok'); }, function (err) { ums.api.handle(err, 'khởi tạo dữ liệu'); })
            .then(function () { b.disabled = false; tai(); });      // gốc: xong (cả khi lỗi) nạp lại danh sách
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'luu') luu();
        else if (a === 'khoitao') khoiTao(b);
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
