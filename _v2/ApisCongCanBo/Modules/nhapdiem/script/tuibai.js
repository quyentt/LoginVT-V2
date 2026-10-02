/* =========================================================================
   tuibai — Nhập điểm theo phách: danh sách đợt phách → màn con "Đánh túi bài thi của đợt phách" mở TRONG TRANG,
   thay chỗ danh sách (pat.formTrang — BO-CUC luật 1; bản gốc là modal): chọn túi, nhập điểm từng số phách.
   Ba luồng xác nhận: theo đợt / theo túi / từng phách (hộp thoại — việc phụ).
   Bản gốc: nhapdiem/script/tuibai.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       Bộ lọc ums.nd.locThi — TP_Chung/LayThoiGian (tự chọn mục đầu) → LayLoaiDiem → LayHinhThucThi → LayDotThi → LayHocPhan
       TP_Chung/LayDotTaoPhach (strDotThi_Id, strDaoTao_HocPhan_Id) · TP_Chung/LayDSTuiTheoDotPhach (strThi_DotPhach_Id) — tự chọn túi đầu
       TP_XuLy/LayDSPhachTheoTui (strThi_TuiBai_Id) · Lưu POST TP_XuLy/CapNhat_DiemPhachTheoTuiBai mỗi dòng đã sửa
         (strUngDung_Id = vai trò, strThi_TuiBai_NguoiHoc_Id, strSoPhach, strDiem)
       Xác nhận (ums.nd.* của _xacnhan.js; D_HanhDongXacNhan · D_XacNhan):
         theo ĐỢT   XACNHAN_HOANTHANH_DIEMTUIBAI — mỗi đợt đánh dấu một lời gọi (trạng thái + lịch sử theo đợt ĐẦU, như gốc)
         theo TÚI   XACNHAN_HOANTHANH_DIEM_TUIBAI — một lời gọi với id túi (danh sách trạng thái nạp với id '' như gốc)
         từng PHÁCH XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC — id = id túi + QLSV_NGUOIHOC_ID (ghép như gốc)
       Báo cáo: danh sách — strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDanhSachThi_Id (đợt đang mở) + một strDanhSachThi_Id mỗi
         đợt đánh dấu (như gốc); trong hộp — strThi_TuiBai_Id. Tải bảng điểm / Nhập điểm qua file: ums.report.taiBangNhap / nhapBangTuTep.
   Không chép (lỗi rõ của bản gốc):
     · Ô từ khoá không được gửi → lọc ngay trên danh sách (tên đợt phách).
     · "Đồng ý" của hộp "Xác nhận từng phách" đọc NHẦM ô trạng thái của hộp kia → đọc ô của chính hộp.
     · Mở hộp từng phách N lần thì một lần bấm dòng gọi N lần; đổi túi làm nạp lại danh sách phía sau (mất ô đánh dấu).
     · Xác nhận xong không cập nhật lịch sử / tình trạng; lọc nối tầng chạy song song đọc giá trị cũ.
   Chờ nghiệp vụ: hai mã XACNHAN_HOANTHANH_DIEMTUIBAI / XACNHAN_HOANTHANH_DIEM_TUIBAI chỉ khác dấu gạch — giữ nguyên.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd;
    var root = document.getElementById('nd-tuibai');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML = pat.page('Nhập điểm theo phách', '<span data-z="bc"></span>' + ui.btn('save', { text: 'Xác nhận', icon: 'fa-circle-check', attr: { 'data-a': 'xacnhan' } })) +
        pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'ld', type: 'select', label: 'Chọn loại điểm' },
            { key: 'ht', type: 'select', label: 'Chọn hình thức thi' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' },
            { key: 'mon', type: 'select', label: 'Chọn môn thi' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
        pat.panel({ title: 'Danh sách bảng điểm', icon: 'fa-file-lines', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    var ds = [], hien = [], moDot = null;
    nd.locThi({ f: f, chonDau: true, tenMon: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, onDoi: function () { tai(); } }).xong.then(tai);

    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return get('TP_Chung/LayDotTaoPhach', { strDotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon') })
            .then(function (r) { ds = arr(r.data); ve(); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đợt phách'); });
    }
    function ve() {
        var q = v('q').toLowerCase();
        hien = q ? ds.filter(function (x) { return e(x.TEN).toLowerCase().indexOf(q) >= 0; }) : ds;
        z('n').textContent = '(' + hien.length + ')';
        ui.table({ el: z('bang'), rows: hien, empty: 'Không có đợt phách', columns: [
            { title: 'Đợt phách', render: function (x, i) { return '<a href="javascript:void(0)" class="nd-lk" data-mo="' + i + '" title="Chi tiết">' + esc(e(x.TEN)) + '</a>'; } },
            { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '50px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }] });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return hien[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }
    ums.report.mount(z('bc'), { reportText: 'Báo cáo', import: false, collect: function (add) {
        add('strThi_DotThi_Id', v('dot')); add('strDaoTao_HocPhan_Id', v('mon')); add('strDanhSachThi_Id', moDot ? moDot.ID : '');
        daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
    } });

    /* ---------- Màn con đánh túi (trong trang, thay chỗ danh sách) ---------- */
    function moHop(dot) {
        moDot = dot;
        var NH = [];
        var dlg = pat.formTrang({ host: root, title: 'Đánh túi bài thi của đợt phách - ' + e(dot.TEN), icon: 'fa-album-collection', cols: 1,
            body: '<div class="nd-thanh nd-thanh--hop"><div class="nd-thanh__trai"><div class="ums-field"><select class="ums-select" data-h="tui" data-ph="Chọn túi"><option value=""></option></select></div></div>' +
                '<div class="nd-thanh__phai">' + ui.btn('save', { text: 'Xác nhận theo túi', icon: 'fa-circle-check', mod: 'out-primary', attr: { 'data-h': 'xntui' } }) +
                    ui.btn('save', { text: 'Xác nhận từng phách', icon: 'fa-circle-check', mod: 'out-success', attr: { 'data-h': 'xnphach' } }) + '<span data-h="bc"></span>' +
                    ui.btn('excel', { text: 'Tải bảng điểm', icon: 'fa-file-arrow-down', mod: 'out-warn', attr: { 'data-h': 'tai' } }) +
                    ui.btn('search', { text: 'Nhập điểm qua file', icon: 'fa-file-arrow-up', mod: 'out-danger', attr: { 'data-h': 'nhap' } }) + '</div></div><div data-h="bang"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }], onClose: function () { moDot = null; } });
        function q(k) { return dlg.body.querySelector('[data-h="' + k + '"]'); }
        var h = q('bang');
        nd.phim(h);
        function tui() { return q('tui').value; }
        function tai2() {
            if (!tui()) { h.innerHTML = ui.empty('Đợt phách chưa có túi', 'fa-box-open'); NH = []; return Promise.resolve(); }
            h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return get('TP_XuLy/LayDSPhachTheoTui', { strThi_TuiBai_Id: tui() }).then(function (r) {
                NH = arr(r.data);
                ui.table({ el: h, rows: NH, empty: 'Túi chưa có phách', columns: [{ title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' },
                    { title: 'Điểm', cls: 'is-center', render: function (x, i) { var g = esc(e(x.DIEMBANDAU));
                        return '<input class="ums-input ums-input--sm nd-o" id="txtDiem' + esc(x.ID) + '" data-r="' + i + '" data-c="0" data-goc="' + g + '" value="' + g + '" autocomplete="off">'; } },
                    { title: 'Mức vi phạm', prop: 'THONGTINXULY' }] });
                var t = h.querySelector('table');
                if (t) { t.id = 'tblTuiThi'; t.setAttribute('colreport', '1'); t.classList.add('nd-luoi'); Array.prototype.forEach.call(t.tBodies[0].rows, function (tr, i) { if (NH[i]) tr.id = NH[i].ID; }); }
            }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phách'); });
        }
        get('TP_Chung/LayDSTuiTheoDotPhach', { strThi_DotPhach_Id: dot.ID }).then(function (r) {
            var d = arr(r.data);
            pat.fill(q('tui'), d, { head: 'Chọn túi' });
            if (d.length) { q('tui').value = d[0].ID; if (window.jQuery) jQuery(q('tui')).trigger('change.select2'); }
            tai2();
        }).catch(function (err) { ums.api.handle(err, 'túi'); });
        if (window.jQuery) jQuery(q('tui')).on('select2:select select2:clear', tai2);
        ums.report.mount(q('bc'), { reportText: 'Báo cáo', import: false, collect: function (add) { add('strThi_TuiBai_Id', tui()); } });
        function luu() {
            var doi = nd.oDoi(h);
            if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
            ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Lưu điểm' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (i) {
                    var x = NH.filter(function (n) { return 'txtDiem' + n.ID === i.id; })[0] || {};
                    return { action: 'TP_XuLy/CapNhat_DiemPhachTheoTuiBai', method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strNguoiThucHien_Id: uid(),
                        strThi_TuiBai_NguoiHoc_Id: x.ID, strSoPhach: e(x.SOPHACH), strDiem: i.value.trim() };
                }), { title: 'Đang lưu điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai2);
            });
        }
        function tungPhach() {
            if (!tui()) { ui.toast('Chọn túi', 'warn'); return; }
            var LOAI = 'XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC', TT = {};
            function khoa(x) { return tui() + e(x.QLSV_NGUOIHOC_ID); }
            var d2 = ui.dialog({ title: 'Xác nhận hoàn thành — từng phách', icon: 'fa-check-to-slot', size: 'lg',
                body: ui.field('Trạng thái', '<select class="ums-select" data-p="tt" data-ph="Chọn xác nhận"><option value=""></option></select>', { required: true }) +
                    '<div class="ums-legend ums-legend--cach">Danh sách xác nhận</div><div data-p="ds"></div><div class="ums-legend ums-legend--cach">Lịch sử <span data-p="lsnhan" class="ums-u-faint"></span></div><div data-p="ls">' +
                    ui.empty('Bấm một dòng để xem lịch sử', 'fa-hand-pointer') + '</div>',
                buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                    var tt = p('tt').value;
                    var chon = Array.prototype.filter.call(p('ds').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                        .map(function (c) { return NH[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
                    if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return false; }
                    if (!tt) { ui.toast('Chọn trạng thái xác nhận', 'warn'); return false; }
                    nd.luuXacNhan(chon.map(khoa), tt, LOAI).then(veDS);
                    return false;
                } }] });
            function p(k) { return d2.body.querySelector('[data-p="' + k + '"]'); }
            ui.enhance(d2.body);
            nd.hanhDong(LOAI, '').then(function (d) { pat.fill(p('tt'), d, { head: 'Chọn xác nhận' }); nd.chonMot(p('tt'), d); }).catch(function () {});
            function veDS() {
                p('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return nd.pool(NH, function (x) { return nd.trangThai(khoa(x), LOAI).then(function (t) { TT[x.ID] = t; }); }, 10).then(function () {
                    ui.table({ el: p('ds'), rows: NH, empty: 'Túi chưa có phách', columns: [{ title: 'Số phách', render: function (x, i) { return '<a href="javascript:void(0)" data-ls="' + i + '">' + esc(e(x.SOPHACH)) + '</a>'; } },
                        { title: 'Tình trạng', render: function (x) { return esc(TT[x.ID] || ''); } },
                        { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }] });
                });
            }
            veDS();
            d2.body.addEventListener('change', function (ev) {
                if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(p('ds').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            });
            d2.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-ls]'); if (!b) return;
                var x = NH[Number(b.getAttribute('data-ls'))];
                p('lsnhan').textContent = '— phách ' + e(x.SOPHACH);
                nd.lichSu(khoa(x), LOAI).then(function (d) {
                    ui.table({ el: p('ls'), rows: d, empty: 'Chưa có lịch sử', columns: [{ title: 'Trạng thái', prop: 'TEN' }, { title: 'Người thực hiện', prop: 'NGUOIXACNHAN_TENDAYDU' },
                        { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }] });
                }).catch(function (err) { p('ls').innerHTML = ui.fail(err.message); });
            });
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-h]'); if (!b || b.tagName === 'SELECT') return;
            var a = b.getAttribute('data-h'), t = document.getElementById('tblTuiThi');
            if (a === 'xntui') { if (!tui()) { ui.toast('Chọn túi', 'warn'); return; }
                nd.xacNhan({ loai: 'XACNHAN_HOANTHANH_DIEM_TUIBAI', tieuDe: 'Xác nhận hoàn thành', chuDe: 'Theo túi', id: tui(), idHanhDong: '', onDone: tai2 }); }
            else if (a === 'xnphach') tungPhach();
            else if (a === 'tai') { if (t) ums.report.taiBangNhap(t); }
            else if (a === 'nhap') { if (t) ums.report.nhapBangTuTep({ onDone: function () { nd.danhDau(h); } }); }
        });
    }

    root.addEventListener('change', function (ev) {
        if (!z('bang').contains(ev.target)) return;   // màn con đánh túi cũng nằm trong root — ô "chọn tất cả" của nó tự lo
        if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-mo]'); if (b) { moHop(hien[Number(b.getAttribute('data-mo'))]); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'xacnhan') {
            var chon = daChon();
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
            nd.xacNhan({ loai: 'XACNHAN_HOANTHANH_DIEMTUIBAI', tieuDe: 'Xác nhận hoàn thành', chuDe: 'Đợt phách', id: chon[0].ID, ids: chon.map(function (x) { return x.ID; }), onDone: tai });
        }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (ds.length) ve(); else tai(); } });
})();
