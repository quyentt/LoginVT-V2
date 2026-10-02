/* =========================================================================
   Nghỉ phép — số ngày phép năm của từng nhân sự, khai phép hàng loạt
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/nghiphep.html + script/nghiphep.js
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái "Danh sách nhân sự" (từ khoá + Cơ cấu → Bộ môn,
   ums.nsCham.dsNhanSu); phải ba khung đổi chỗ nhau như gốc:
     "Thông tin chung" (nút Thêm) · "Chi tiết nghỉ phép <tên>" (bấm một người) ·
     biểu mẫu "Nghỉ phép" (Thêm: kèm khối "Đối tượng áp dụng"; Sửa: ẩn khối đó).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_NghiPhepCaNhan/LayDanhSach  GET  strTuKhoa '', strNhanSu_HoSoCanBo_Id, strNguoiThucHien_Id '',
                                      pageIndex 1, pageSize 10000
       NS_NghiPhepCaNhan/ThemMoi      strId '', strNhanSu_HoSoCanBo_Id = "ALL" (ô Tất cả) hoặc các id nối
                                      bằng "#", strNgayBatDau, strNgayKetThuc, strNamApDung,
                                      dSoNgayDuocNghi, dSoNgayNghiThamNien, strNguoiThucHien_Id
       NS_NghiPhepCaNhan/CapNhat      strId, strNhanSu_HoSoCanBo_Id = người đang xem, (các ô như trên)
   Chọn người: edu.extend.genModal_NhanSu → ums.pat.pickNhanSu.
   Năm áp dụng: dateYearToCombo một ô (năm nay + 5 lùi về 1994); Thêm mới để trống như gốc (rewrite).

   Khác gốc (ghi lại):
     · Thêm mới mà chưa đánh dấu "Tất cả" và chưa chọn ai → báo, không gửi (gốc gửi
       strNhanSu_HoSoCanBo_Id rỗng).
     · Thêm xong quay về khung trước đó (chi tiết của người đang xem, hoặc Thông tin
       chung); gốc ở lại biểu mẫu với danh sách người đã chọn → bấm Lưu lần hai là
       khai phép TRÙNG cho cả nhóm.
     · Nút "Viết lại" (#btnRefreshNghiPhep) gốc không gắn xử lý → bỏ (Thêm luôn mở
       biểu mẫu trống).
     · Ảnh ở cột trái: gốc đọc data.ANH (cả mảng) → luôn ảnh mặc định; ở đây đọc ANH từng dòng.
   Không chuyển: delete_NghiPhep — gốc không có nút nào gọi tới.
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e, C = 'NS_NghiPhepCaNhan';
    var root = document.getElementById('nghiphep');

    var m = pat.master({
        el: root,
        title: 'Nghỉ phép',
        side: { title: 'Danh sách nhân sự', icon: 'fa-list', search: 'Nhập từ khóa tìm kiếm', filter: S.locHtml() },
        main: { title: false }
    });

    function o(key, label, ctl) { return ui.field(label, ctl.replace('%', 'data-np="' + key + '"')); }
    var namOpt = '<option value=""></option>' + S.nam(1993, true).map(function (y) { return '<option value="' + y.ID + '">' + y.TEN + '</option>'; }).join('');

    m.mainBody.innerHTML =
        '<div data-z="tt">' + pat.panel({
            title: 'Thông tin chung', icon: 'fa-circle-info',
            tools: ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'them' } }),
            body: '<p class="ums-u-mb-0">- Không có gì mới</p>'
        }) + '</div>' +
        '<div data-z="ct" hidden>' + pat.panel({
            title: 'Chi tiết nghỉ phép', icon: 'fa-file-lines', count: 'ten', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } })
        }) + '</div>' +
        '<div data-z="form" hidden>' + pat.panel({
            title: 'Nghỉ phép', icon: 'fa-pen-to-square', count: 'ftieude',
            tools: ui.btn('close', { attr: { 'data-a': 'huy' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
            body:
                '<div class="ums-legend">Quy định nghỉ phép</div>' +
                '<div class="ums-grid ums-grid--2">' +
                    o('bd', 'Ngày bắt đầu', '<input class="ums-input" data-date placeholder="dd/mm/yyyy" autocomplete="off" %>') +
                    o('kt', 'Ngày kết thúc', '<input class="ums-input" data-date placeholder="dd/mm/yyyy" autocomplete="off" %>') +
                    o('so', 'Số ngày nghỉ', '<input class="ums-input" autocomplete="off" %>') +
                    o('tn', 'Thâm niên', '<input class="ums-input" autocomplete="off" %>') +
                    o('nam', 'Năm áp dụng', '<select class="ums-select" data-ph="Chọn năm áp dụng" %>' + namOpt + '</select>') +
                '</div>' +
                '<div data-z="dt">' +
                    '<div class="ums-legend ums-legend--cach">Đối tượng áp dụng</div>' +
                    '<div class="nscham-hang">' +
                        '<label class="ums-check"><input type="checkbox" data-np="all"> <span>Tất cả</span></label>' +
                        ui.btn('search', { text: 'Chọn', mod: 'out-primary', attr: { 'data-a': 'chon' } }) +
                    '</div>' +
                    '<div data-z="dsns"></div>' +
                '</div>'
        }) + '</div>';

    var Z = {};
    ['tt', 'ct', 'form', 'bang', 'ten', 'ftieude', 'dt', 'dsns'].forEach(function (k) { Z[k] = m.mainBody.querySelector('[data-z="' + k + '"]'); });
    function np(k) { return m.mainBody.querySelector('[data-np="' + k + '"]'); }
    ui.enhance(m.mainBody);

    var st = { ns: null, rows: [], sua: null, chon: [], truoc: 'tt' };
    function hien(k) {
        ['tt', 'ct', 'form'].forEach(function (x) { if (x !== k && !Z[x].hidden) ui.swap(Z[x], Z[k], { top: false }); });
    }

    /* ---------- Chi tiết nghỉ phép của một người --------------------------- */
    function taiCT() {
        Z.bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: C + '/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNhanSu_HoSoCanBo_Id: st.ns ? st.ns.ID : '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000
        }).then(function (r) {
            st.rows = S.rows(r);
            ui.table({
                el: Z.bang, rows: st.rows,
                columns: [
                    { title: 'Thời gian', prop: 'NAMAPDUNG', cls: 'is-center' },
                    { title: 'Ngày nghỉ quy định', prop: 'SONGAYDUOCNGHI', cls: 'is-center' },
                    { title: 'Ngày nghỉ thâm niên', prop: 'SONGAYNGHITHAMNIEN', cls: 'is-center' },
                    { title: 'Số ngày nghỉ còn lại', prop: 'SONGAYNGHICONLAI', cls: 'is-center' },
                    { title: 'Sửa', cls: 'is-center is-actions', width: '64px', render: function (x) { return ui.iconBtn('edit', x.ID); } }
                ]
            });
        }).catch(function (err) { Z.bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nghỉ phép'); });
    }

    var ds = S.dsNhanSu(m, {
        dong: function (r) { return esc(e(r.MASO)); },
        onPick: function (r) {
            st.ns = r;
            Z.ten.innerHTML = '<i>' + esc(e(r.HODEM) + ' ' + e(r.TEN)) + '</i>';
            hien('ct');
            taiCT();
        }
    });

    /* ---------- Biểu mẫu --------------------------------------------------- */
    function veDS() {
        ui.table({
            el: Z.dsns, rows: st.chon, empty: 'Không tìm thấy dữ liệu!',
            columns: [
                { title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (r) { return S.anh(r.ANH); } },
                { title: 'Họ tên', render: function (r) { return esc(e(r.HOTEN || (e(r.HODEM) + ' ' + e(r.TEN)))) + ' - ' + esc(e(r.MASO)); } },
                { title: 'Năm sinh', render: function (r) { return esc(r.NGAYSINHDAYDU || [r.NGAYSINH, r.THANGSINH, r.NAMSINH].filter(function (x) { return x !== null && x !== undefined && x !== ''; }).join('/')); } },
                { title: '', cls: 'is-center is-actions', width: '96px', render: function (r) {
                    return '<button type="button" class="ums-btn ums-btn--out-danger ums-btn--sm" data-bo="' + esc(r.ID) + '"><i class="fa-light fa-xmark"></i><span>Bỏ chọn</span></button>';
                } }
            ]
        });
    }
    function moForm(row) {
        st.sua = row || null;
        st.truoc = !Z.ct.hidden ? 'ct' : 'tt';
        Z.ftieude.textContent = row ? '— Chỉnh sửa' : '— Thêm mới';
        np('bd').value = row ? e(row.NGAYBATDAU) : '';
        np('kt').value = row ? e(row.NGAYKETTHUC) : '';
        np('so').value = row ? e(row.SONGAYDUOCNGHI) : '';
        np('tn').value = row ? e(row.SONGAYNGHITHAMNIEN) : '';
        np('nam').value = row ? e(row.NAMAPDUNG) : '';
        if (window.jQuery) jQuery(np('nam')).trigger('change.select2');
        ['bd', 'kt'].forEach(function (k) { var el = np(k); if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y'); });
        np('all').checked = false;
        st.chon = [];
        veDS();
        Z.dt.hidden = !!row;
        hien('form');
    }

    function luu() {
        var sua = st.sua;
        var call = {
            action: C + (sua ? '/CapNhat' : '/ThemMoi'),
            strId: sua ? sua.ID : '',
            strNhanSu_HoSoCanBo_Id: '',
            strNgayBatDau: np('bd').value,
            strNgayKetThuc: np('kt').value,
            strNamApDung: np('nam').value,
            dSoNgayDuocNghi: np('so').value,
            dSoNgayNghiThamNien: np('tn').value,
            strNguoiThucHien_Id: S.uid()
        };
        if (sua) call.strNhanSu_HoSoCanBo_Id = st.ns ? st.ns.ID : '';
        else if (np('all').checked) call.strNhanSu_HoSoCanBo_Id = 'ALL';
        else call.strNhanSu_HoSoCanBo_Id = st.chon.map(function (r) { return r.ID; }).join('#');
        if (!sua && !call.strNhanSu_HoSoCanBo_Id) { ui.toast('Vui lòng chọn đối tượng áp dụng (Tất cả hoặc chọn nhân sự)', 'warn'); return; }
        var b = m.mainBody.querySelector('[data-a="luu"]');
        b.disabled = true;
        ums.api.call(call).then(function () {
            ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            hien(sua ? 'ct' : st.truoc);
            if (st.ns) taiCT();
        }).catch(function (err) { ums.api.handle(err, 'lưu nghỉ phép'); })
            .then(function () { b.disabled = false; });
    }

    m.mainBody.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        var bo = ev.target.closest('[data-bo]');
        var sua = ev.target.closest('[data-act="edit"]');
        if (bo) {
            var id = bo.getAttribute('data-bo');
            st.chon = st.chon.filter(function (r) { return String(r.ID) !== id; });
            veDS();
            return;
        }
        if (sua) {
            var row = st.rows.filter(function (r) { return String(r.ID) === sua.getAttribute('data-id'); })[0];
            if (row) moForm(row);
            return;
        }
        if (!a) return;
        switch (a.getAttribute('data-a')) {
            case 'them': moForm(null); break;
            case 'dong': st.ns = null; ds.boChon(); hien('tt'); break;
            case 'huy': hien(st.sua ? 'ct' : st.truoc); break;
            case 'luu': luu(); break;
            case 'chon':
                pat.pickNhanSu({
                    title: 'Chọn nhân sự',
                    onPick: function (rows) {
                        var co = {}, them = 0;
                        st.chon.forEach(function (r) { co[r.ID] = 1; });
                        rows.forEach(function (r) { if (!co[r.ID]) { st.chon.push(r); co[r.ID] = 1; them++; } });
                        if (them < rows.length) ui.toast('Đã bỏ qua ' + (rows.length - them) + ' người đã có trong danh sách', 'warn');
                        veDS();
                    }
                });
                break;
        }
    });
})();
