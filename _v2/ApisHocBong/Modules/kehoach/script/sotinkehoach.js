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
   Kéo gốc lần 12–13 (7/11): "Lưu" chạy qua form tiến trình chung ums.process.run (mỗi dòng đã đổi một bản ghi: Phạm vi /
   Phân cấp / Thời gian / Số tín cũ / Số tín mới), "Khởi tạo dữ liệu" qua ums.process.runJob (Bước 1 hiện điều kiện Quỹ ·
   Thời gian · Quy tắc + lưu ý chưa chọn quỹ / quy tắc; xong — cả khi lỗi — nạp lại như gốc), nút "Xuất Excel" cạnh Lưu
   (gốc edu.exporter.attachTable tblSoTinKeHoach) = ums.ui.xuatBang, cột Số tín lấy giá trị đang nhập.
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
            foot: '<div class="hbth-chan">' + ui.btn('excel', { attr: { 'data-a': 'xuat' } }) + ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }) + '</div>' });
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

    function dieuKien() { return [['Quỹ học bổng', f('quy')], ['Thời gian', f('tg')]]; }
    var luot = 0, dsST = [];
    function tai() {
        var sh = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: TT + 'DSA4BRIJAx4QNDgFKC8pHhIuFSgvAiko', func: 'pkg_hocbong_thongtin.LayDSHB_QuyDinh_SoTinChi',
            strTuKhoa: (f('q').value || '').trim(), strHB_QuyHocBong_Id: f('quy').value,
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                if (sh !== luot) return;
                var rs = dsST = arr(r.data);
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
        var map = {};
        dsST.forEach(function (r) { map[r.ID] = r; });
        ums.process.run({
            title: 'Lưu số tín tối thiểu của kế hoạch', unit: 'dòng', fileName: 'KetQuaLuuSoTinKeHoach', dieuKien: dieuKien(),
            items: doi.map(function (i) { var id = i.getAttribute('data-st'); return { ID: id, row: map[id] || {}, cu: i.getAttribute('data-cu'), moi: i.value }; }),
            columns: [
                { header: 'Phạm vi áp dụng', render: function (it) { return it.row.PHAMVIAPDUNG_TEN || it.ID; } },
                { header: 'Phân cấp', render: function (it) { return e(it.row.PHANCAPPHAMVI_TEN); } },
                { header: 'Thời gian', render: function (it) { return e(it.row.THOIGIAN); } },
                { header: 'Số tín cũ', render: function (it) { return e(it.cu); } },
                { header: 'Số tín mới', render: function (it) { return e(it.moi); } }
            ],
            okMessage: 'Thực hiện thành công',
            request: function (it) {
                return { action: TT + 'EjQgHgkDHhA0OAUoLykeEi4VKC8FIC8mCjgP', func: 'pkg_hocbong_thongtin.Sua_HB_QuyDinh_SoTinDangKy',
                    strId: it.ID, dSoQuyDinh: it.moi, strNguoiThucHien_Id: uid() };
            },
            refresh: tai
        });
    }

    function khoiTao() {
        var notes = [];
        if (!f('quy').value) notes.push('Chưa chọn quỹ học bổng.');
        if (!f('qt').value) notes.push('Chưa chọn quy tắc khởi tạo.');
        ums.process.runJob({
            title: 'Khởi tạo số tín tối thiểu', what: 'Khởi tạo dữ liệu số tín tối thiểu theo điều kiện đang chọn', fileName: 'KetQuaKhoiTaoSoTin',
            notes: notes, dieuKien: dieuKien().concat([['Quy tắc khởi tạo', f('qt')]]), okMessage: 'Thực hiện thành công',
            request: function () {
                return { action: 'XLHV_HB_TinhToan_MH/CikuKBUgLgU0DSgkNBUoLykSLhUoLwIpKAPP', func: 'pkg_hocbong_tinhtoan.KhoiTaoDuLieuTinhSoTinChi',
                    strHB_QuyHocBong_Id: f('quy').value, strDaoTao_ThoiGianDaoTao_Id: f('tg').value,
                    strQuyTacTinhSoTin_Id: f('qt').value, strNguoiThucHien_Id: uid() };
            },
            onClose: function (sum) { if (sum.ok || sum.err) tai(); }      // gốc: xong (cả khi lỗi) nạp lại danh sách
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'luu') luu();
        else if (a === 'khoitao') khoiTao();
        else if (a === 'xuat') ui.xuatBang(z('bang'), { ten: 'SoTinToiThieuKeHoach', tieuDe: 'SỐ TÍN TỐI THIỂU CỦA KẾ HOẠCH', phu: [ums.process.dieuKien(dieuKien())].filter(Boolean) });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
