/* =========================================================================
   Danh sách phép — tra cứu phép năm theo đơn vị / thành viên / năm, "Kế thừa"
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/danhsachphep.html + script/danhsachphep.js
   ---------------------------------------------------------------------------
   Một cột như gốc: khung "Tìm kiếm" (Đơn vị, Thành viên, Năm áp dụng, từ khoá)
   + khung "Danh sách phép" (nút Kế thừa, bảng có ô đánh dấu ở cột cuối,
   phân trang máy chủ).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_NghiPhepCaNhan/LayDanhSach  GET  strTuKhoa, strNhanSu_HoSoCanBo_Id (ô Thành viên),
            strDaoTao_CoCauToChuc_Id (ô Đơn vị), strNamApDung, strNguoiThucHien_Id, pageIndex, pageSize
       NS_HoSoV2/LayDanhSach  GET  strTuKhoa '', pageIndex 1, pageSize 100000,
            strDaoTao_CoCauToChuc_Id (ô Đơn vị), strNguoiThucHien_Id '', dLaCanBoNgoaiTruong 0
            → ô "Chọn thành viên" (HOTEN - MASO)
       NS_NghiPhepCaNhan/KeThua  POST  strDaoTao_CoCauToChuc_Id = DAOTAO_COCAUTOCHUC_ID của dòng,
            strNhanSu_HoSoNhanSu_Id = NHANSU_HOSOCANBO_ID, strNamKeThua (ô trong hộp),
            strNamApDung = NAMAPDUNG của dòng — mỗi dòng đánh dấu một lời gọi
       Đơn vị: edu.system.getList_CoCauToChuc (= ums.ref.coCauToChuc), MỌI cơ cấu (không tách cha/con).
   Năm áp dụng / Năm kế thừa: dateYearToCombo cho HAI ô → năm nay lùi về 1994, không chọn sẵn.

   Giữ như gốc: danh sách trả về có Message thì hiện Message và KHÔNG vẽ bảng
   (gốc: `if (data.Message) { alert(Message); return; }`).
   Khác gốc (ghi lại):
     · Đơn vị → Thành viên theo luật cha → con: chưa chọn Đơn vị thì khoá ô Thành
       viên (gốc nạp sẵn toàn bộ hồ sơ khi mở màn); xoá Đơn vị thì xoá Thành viên.
     · Ô lọc chọn / xoá đều nạp lại (gốc chỉ bắt select2:select); Enter ở ô từ khoá
       nạp lại danh sách (gốc còn nạp lại ô Thành viên — không cần, ô đó không lọc theo từ khoá).
     · Kế thừa: hỏi lại một lần rồi chạy hàng loạt có tiến độ (ums.ui.batch) —
       gốc đóng hộp, confirm, genHTML_Progress.
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e, C = 'NS_NghiPhepCaNhan';
    var root = document.getElementById('danhsachphep');

    root.innerHTML = pat.page('Danh sách phép', '') +
        pat.panel({
            title: 'Tìm kiếm', icon: 'fa-window-restore', cls: 'ums-u-mb-4',
            body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="dv" data-ph="Chọn đơn vị"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="tv" data-ph="Chọn thành viên"><option value=""></option></select></div>' +
                '<div class="ums-field"><select class="ums-select" data-f="nam" data-ph="Chọn năm áp dụng"><option value=""></option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                '</div>'
        }) +
        pat.panel({
            title: 'Danh sách phép', icon: 'fa-building', count: 'tong', flush: true, zone: 'bang',
            tools: ui.btn('add', { text: 'Kế thừa', mod: 'primary', attr: { 'data-a': 'kethua' } })
        });

    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var bang = root.querySelector('[data-z="bang"]'), tong = root.querySelector('[data-z="tong"]');
    var st = { page: 1, size: 10, total: 0, rows: [] };
    var NAM = S.nam(1993);

    ui.enhance(root);
    pat.fill(F('nam'), NAM, { head: 'Chọn năm áp dụng' });
    ums.ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
        .then(function (r) { pat.fill(F('dv'), r, { head: 'Chọn đơn vị' }); }, function (err) { ums.api.handle(err, 'đơn vị'); });

    function taiTV() {
        var dv = F('dv').value;
        if (!dv) { pat.fill(F('tv'), [], { head: 'Chọn thành viên' }); return; }
        ums.api.call({
            action: 'NS_HoSoV2/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', pageIndex: 1, pageSize: 100000, strDaoTao_CoCauToChuc_Id: dv, strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0
        }).then(function (r) {
            pat.fill(F('tv'), S.rows(r), { head: 'Chọn thành viên', name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } });
        }).catch(function (err) { ums.api.handle(err, 'thành viên'); });
    }

    function tai(page) {
        st.page = page || 1;
        bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: C + '/LayDanhSach', method: 'GET',
            strTuKhoa: F('q').value.trim(),
            strNhanSu_HoSoCanBo_Id: F('tv').value,
            strDaoTao_CoCauToChuc_Id: F('dv').value,
            strNamApDung: F('nam').value,
            strNguoiThucHien_Id: S.uid(),
            pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            if (r.message) { ui.toast(r.message, 'warn'); bang.innerHTML = ui.empty(r.message); return; }
            st.rows = S.rows(r);
            st.total = Number(r.pager) || st.rows.length;
            tong.textContent = '(' + st.total + ')';
            ui.table({
                el: bang, rows: st.rows,
                columns: [
                    { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', width: '220px' },
                    { title: 'Năm', prop: 'NAMAPDUNG', cls: 'is-center' },
                    { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.NHANSU_HOSOCANBO_HODEM) + ' ' + e(x.NHANSU_HOSOCANBO_TEN)); } },
                    { title: 'Ngày sinh', prop: 'NGAYSINHDAYDU', cls: 'is-center is-nowrap' },
                    { title: 'Số ngày nghỉ quy định', prop: 'SONGAYDUOCNGHI', cls: 'is-center' },
                    { title: 'Số ngày nghỉ thâm niên', prop: 'SONGAYNGHITHAMNIEN', cls: 'is-center' },
                    { title: 'Số ngày đã nghỉ', prop: 'SONGAYPHEPDASUDUNG', cls: 'is-center' },
                    { title: 'Số ngày phép còn lại', prop: 'SONGAYNGHICONLAI', cls: 'is-center' },
                    { head: '<input type="checkbox" data-ckall title="Chọn tất cả">', cls: 'is-center', width: '48px',
                      render: function (x) { return '<input type="checkbox" data-ck="' + esc(x.ID) + '">'; } }
                ],
                page: { index: st.page, size: st.size, total: st.total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) tai(p); },
                    onSize: function (v) { st.size = v; tai(1); } }
            });
        }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phép'); });
    }

    function daChon() {
        var ids = [].map.call(bang.querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck'); });
        return st.rows.filter(function (r) { return ids.indexOf(String(r.ID)) >= 0; });
    }

    function keThua() {
        if (!daChon().length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Kế thừa', icon: 'fa-copy', size: 'sm',
            body: ui.field('Năm kế thừa', '<select class="ums-select" data-kt="nam" data-ph="Chọn năm áp dụng"><option value=""></option>' +
                NAM.map(function (y) { return '<option value="' + y.ID + '">' + y.TEN + '</option>'; }).join('') + '</select>'),
            buttons: [{ text: 'Lưu kế thừa', kind: 'save', onClick: function (h) {
                var chon = daChon();
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                var nam = h.body.querySelector('[data-kt="nam"]').value;
                h.close();
                ui.confirm('Bạn có chắc chắn muốn kế thừa không?', { title: 'Kế thừa', ok: 'Kế thừa' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(chon.map(function (x) {
                        return { action: C + '/KeThua', strDaoTao_CoCauToChuc_Id: x.DAOTAO_COCAUTOCHUC_ID, strNhanSu_HoSoNhanSu_Id: x.NHANSU_HOSOCANBO_ID,
                            strNamKeThua: nam, strNamApDung: x.NAMAPDUNG, strNguoiThucHien_Id: S.uid() };
                    }), { title: 'Kế thừa', okText: 'Kế thừa thành công' }).then(function () { tai(st.page); });
                });
                return false;
            } }]
        });
        ui.enhance(dlg.body);
    }

    if (window.jQuery) {
        jQuery(F('dv')).on('select2:select select2:clear', function () { taiTV(); tai(1); });
        jQuery(F('tv')).add(F('nam')).on('select2:select select2:clear', function () { tai(1); });
    }
    pat.chain([F('dv'), F('tv')], { phatLai: false });
    F('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-a]');
        if (a && a.getAttribute('data-a') === 'tim') tai(1);
        if (a && a.getAttribute('data-a') === 'kethua') keThua();
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.matches('input[data-ckall]')) return;
        var on = ev.target.checked;
        [].forEach.call(bang.querySelectorAll('input[data-ck]'), function (c) {
            c.checked = on;
            var tr = c.closest('tr'); if (tr) tr.classList.toggle('is-selected', on);
        });
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.matches('input[data-ck]')) return;
        var tr = ev.target.closest('tr'); if (tr) tr.classList.toggle('is-selected', ev.target.checked);
    });

    tai(1);
})();
