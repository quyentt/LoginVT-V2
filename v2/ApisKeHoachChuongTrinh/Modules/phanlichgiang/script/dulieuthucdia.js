/* =========================================================================
   Dữ liệu thực địa — cán bộ đi thực địa theo học phần (số giờ, thời gian, số học viên)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/phanlichgiang/html/dulieuthucdia.html + script/dulieuthucdia.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc: hai cột — trái (col-3) bộ lọc (từ khoá · Thời gian · Hệ · Bộ môn, hai nút "Tìm không
   theo lịch giảng" / "Tìm theo lịch giảng", Import) + "Danh sách học phần"; phải (col-9, hiện khi bấm một
   học phần) "Danh sách cán bộ" — bảng nhập trong ô, nút Lưu, "Thêm dòng mới" (hộp chọn nhân sự).
   Bản mới: ums.pat.master + ums.pat.cotTrai (luật cột trái 26/9) — hai nút tìm của gốc thành ô chọn
   "Cách tìm" trong Bộ lọc nâng cao (chữ giữ nguyên), đổi ô / gõ từ khoá là tự tải; Import lên đầu trang.

   Lời gọi (kiểu cũ, không func; chép nguyên):
       KHCT_ThoiGianDaoTao/LayDanhSach GET strTuKhoa '', strDAOTAO_NAM_Id '', pageIndex 1, pageSize 1000000
       KHCT_LichGiang/LayDSHeDaoTao GET strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HeDaoTao_Id
       ums.ref.coCauToChuc (iTrangThai 1) → Bộ môn
       "Tìm theo lịch giảng"       KHCT_LichGiang/LayDSHocPhan GET strDaoTao_CoCauToChuc_Id, strDaoTao_HeDaoTao_Id,
                                   dToanBo 1, strDaoTao_ThoiGianDaoTao_Id, strChucNang_Id (không gửi từ khoá — lọc tại chỗ)
       "Tìm không theo lịch giảng" KHCT_HocPhan/LayDanhSach GET strTuKhoa, strDaoTao_MonHoc_Id '', strThuocBoMon_Id (Bộ môn),
                                   strThuocTinhHocPhan_Id '', strNguoiThucHien_Id '', pageIndex 1, pageSize 100000
       KHCT_DuLieuThucDiaCD_v2/LayDanhSach GET strTuKhoa, strDaoTao_HocPhan_Id, strDaoTao_ThoiGianDaoTao_Id,
                                   strNhanSu_HoSoCanBo_Id '', strNguoiTao_Id '' (ô dropAAAA không tồn tại), pageIndex 1, pageSize 100000
       KHCT_DuLieuThucDiaCD_v2/ThemMoi | CapNhat POST strId ('' khi dòng mới), strChucNang_Id, strNhanSu_HoSoCanBo_Id,
                                   strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, dSoLuong (Số giờ), strNgayBatDau,
                                   strNgayKetThuc, dSoLuongHSSV, strGhiChu (cột "Đối tượng")
       KHCT_DuLieuThucDiaCD_v2/Xoa POST strChucNang_Id, strIds (ID dòng)
       Import: ums.report.importChung('Dữ liệu', 'IMPORTWITHPROC_DLTD') (gốc: mục "1. Import Dữ liệu thực địa",
               title "Dữ liệu" → showImportChungV2)
       Thêm dòng mới: ums.pat.pickNhanSu (edu.extend.genModal_NhanSu)
   Khác gốc (lỗi rõ):
     · Danh sách cán bộ gửi strTuKhoa '' — gốc gửi CHÍNH ô từ khoá dùng để tìm học phần → gõ mã học phần để tìm
       rồi bấm vào là danh sách cán bộ lọc theo mã học phần đó (thường trống).
     · Lưu xong nạp lại (gốc không nạp → dòng mới vẫn mang id tạm, bấm Lưu lần hai là THÊM TRÙNG); một thông
       báo tổng thay một thông báo mỗi dòng.
     · Chọn trùng cán bộ: so với mọi dòng đang có (gốc so id cán bộ với danh sách lẫn ID DÒNG của dòng đã lưu →
       chọn lại cán bộ đã lưu vẫn thêm được).
     · Ô Số giờ / Số lượng học viên hiện "null" khi rỗng (gốc không returnEmpty) → để trống.
     · getList_MauImport("zonebtnDLTD") trỏ vùng không tồn tại → bỏ (không có nút báo cáo nào được dựng).
   Cha → con: Thời gian → Hệ (khoá). Bộ môn là lọc thêm (không khoá).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('khct-dulieuthucdia');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function esc(s) { return ui.esc(s); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', silent: true, strNguoiThucHien_Id: uid() }, o)); }
    var TD = 'KHCT_DuLieuThucDiaCD_v2/';

    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }
    var m = pat.master({
        el: root, title: 'Dữ liệu thực địa',
        actions: ui.btn('importer', { attr: { 'data-a': 'import' } }),
        side: { title: 'Danh sách học phần', icon: 'fa-list-timeline', search: 'Nhập từ khóa tìm kiếm',
            filter: sel('tg', 'Chọn thời gian đào tạo') + sel('he', 'Chọn hệ đào tạo') + sel('bm', 'Chọn bộ môn') +
                '<div class="ums-field"><select class="ums-select" data-f="cach" data-no-s2>' +
                '<option value="lich">Tìm theo lịch giảng</option><option value="all">Tìm không theo lịch giảng</option></select></div>' },
        main: { title: 'Danh sách cán bộ', icon: 'fa-building', count: true,
            tools: ui.btn('save', { attr: { 'data-a': 'luu' } }) }
    });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var dsHP = [], hp = null, dong = [];
    var mainPanel = m.main.querySelector('.ums-panel');
    var mainTools = mainPanel.querySelector('.ums-panel__tools');

    /* ---------- Bộ lọc ------------------------------------------------ */
    get('KHCT_ThoiGianDaoTao/LayDanhSach', { strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); })
        .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(f('bm'), d, { name: 'TEN', head: 'Chọn đơn vị' }); })
        .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    function napHe() {
        if (!v('tg')) { pat.fill(f('he'), [], { head: 'Chọn hệ đào tạo' }); return; }
        get('KHCT_LichGiang/LayDSHeDaoTao', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he') })
            .then(function (r) { pat.fill(f('he'), arr(r.data), { name: 'TEN', head: 'Chọn hệ đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
    }
    pat.chain([f('tg'), f('he')], { phatLai: false });
    jQuery(f('tg')).on('select2:select select2:clear', napHe);

    /* ---------- Danh sách học phần ------------------------------------- */
    var luot = 0;
    function taiHP() {
        var sh = ++luot, q = (m.search.value || '').trim();
        datHP(null);
        if (v('cach') === 'lich' && !v('tg')) { dsHP = []; m.sideCount.textContent = ''; m.sideBody.innerHTML = ui.empty('Chọn thời gian đào tạo', 'fa-hand-pointer'); return; }
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var p = v('cach') === 'all'
            ? get('KHCT_HocPhan/LayDanhSach', { strTuKhoa: q, strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: v('bm'), strThuocTinhHocPhan_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            : get('KHCT_LichGiang/LayDSHocPhan', { strDaoTao_CoCauToChuc_Id: v('bm'), strDaoTao_HeDaoTao_Id: v('he'), dToanBo: 1, strDaoTao_ThoiGianDaoTao_Id: v('tg'), strChucNang_Id: cn() });
        p.then(function (r) {
            if (sh !== luot) return;
            dsHP = arr(r.data);
            if (v('cach') !== 'all' && q) { var t = q.toLowerCase(); dsHP = dsHP.filter(function (x) { return (e(x.MA) + ' ' + e(x.TEN)).toLowerCase().indexOf(t) >= 0; }); }
            m.sideCount.textContent = '(' + dsHP.length + ')';
            veHP();
        }).catch(function (err) { if (sh === luot) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); } });
    }
    function veHP() {
        m.sideBody.innerHTML = dsHP.length ? dsHP.map(function (x) {
            return pat.masterItem({ id: x.ID, text: e(x.MA) + ' - ' + e(x.TEN), sub: 'Tín chỉ: ' + e(x.SOTC), active: hp && String(hp.ID) === String(x.ID) });
        }).join('') : ui.empty('Không có học phần', 'fa-inbox');
    }
    pat.cotTrai(m, { tai: taiHP, moSan: true });

    /* ---------- Danh sách cán bộ --------------------------------------- */
    function tenHP() { return hp ? e(hp.MA) + ' - ' + e(hp.TEN) : ''; }
    function datHP(x) {
        hp = x; dong = [];
        mainTools.hidden = !hp;
        var t = mainPanel.querySelector('.ums-panel__title');
        t.innerHTML = '<i class="fa-light fa-building"></i> Danh sách cán bộ' + (hp ? ' — <span class="khct-td-hp">' + esc(tenHP()) + '</span>' : '') +
            ' <span class="ums-u-faint ums-u-fz13" data-z="mainCount"></span>';
        m.mainCount = t.querySelector('[data-z="mainCount"]');
        if (!hp) m.mainBody.innerHTML = ui.empty('Chọn một học phần ở cột trái', 'fa-hand-pointer');
    }
    function taiTV() {
        m.mainBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        get(TD + 'LayDanhSach', { strTuKhoa: '', strDaoTao_HocPhan_Id: hp.ID, strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNhanSu_HoSoCanBo_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                dong = arr(r.data).map(function (x) {
                    return { id: x.ID, ns: e(x.NHANSU_HOSOCANBO_ID), dv: e(x.DAOTAO_COCAUTOCHUC_TEN), ma: e(x.NHANSU_HOSOCANBO_MASO),
                        ten: (e(x.NHANSU_HOSOCANBO_HODEM) + ' ' + e(x.NHANSU_HOSOCANBO_TEN)).trim(), hp: e(x.DAOTAO_HOCPHAN_TEN),
                        sl: e(x.SOLUONG), tu: e(x.NGAYBATDAU), den: e(x.NGAYKETTHUC), slhv: e(x.SOLUONGHSSV), gc: e(x.GHICHU) };
                });
                veTV();
            }).catch(function (err) { m.mainBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'dữ liệu thực địa'); });
    }
    function o(k, r, kieu) {
        return '<input class="ums-input ums-input--sm" data-o="' + k + '" value="' + esc(r[k]) + '"' + (kieu === 'ngay' ? ' data-date placeholder="dd/mm/yyyy"' : '') +
            (kieu === 'so' ? ' inputmode="decimal"' : '') + ' autocomplete="off">';
    }
    function docO() {
        Array.prototype.forEach.call(m.mainBody.querySelectorAll('tbody tr[data-i]'), function (tr) {
            var r = dong[Number(tr.getAttribute('data-i'))];
            if (r) Array.prototype.forEach.call(tr.querySelectorAll('[data-o]'), function (el) { r[el.getAttribute('data-o')] = el.value.trim(); });
        });
    }
    function veTV() {
        m.mainCount.textContent = '(' + dong.length + ')';
        m.mainBody.innerHTML = '<div data-k="bang"></div><div class="ums-row ums-row--end khct-td-them">' +
            ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-primary', attr: { 'data-a': 'them' } }) + '</div>';
        var h = m.mainBody.querySelector('[data-k="bang"]');
        ui.table({ el: h, rows: dong, empty: 'Chưa có cán bộ', tableCls: 'ums-table--lined khct-td-bang', columns: [
            { title: 'Đơn vị', prop: 'dv' }, { title: 'Mã cán bộ', prop: 'ma', cls: 'is-nowrap' }, { title: 'Họ tên', prop: 'ten' }, { title: 'Học phần', prop: 'hp' },
            { title: 'Số giờ', cls: 'is-center', render: function (r) { return o('sl', r, 'so'); } },
            { title: 'Ngày bắt đầu', cls: 'is-center', render: function (r) { return o('tu', r, 'ngay'); } },
            { title: 'Ngày kết thúc', cls: 'is-center', render: function (r) { return o('den', r, 'ngay'); } },
            { title: 'Số lượng học viên', cls: 'is-center', render: function (r) { return o('slhv', r, 'so'); } },
            { title: 'Đối tượng', render: function (r) { return o('gc', r); } },
            { title: 'Xóa', cls: 'is-center', width: '56px', render: function (r, i) { return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoa="' + i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>'; } }
        ] });
        Array.prototype.forEach.call(h.querySelectorAll('tbody tr'), function (tr, i) { if (dong[i]) tr.setAttribute('data-i', i); });
        ui.enhance(h);
    }
    function them() {
        pat.pickNhanSu({ title: 'Tìm kiếm nhân sự', onPick: function (rows) {
            docO();
            var trung = 0;
            (rows || []).forEach(function (x) {
                if (dong.some(function (r) { return String(r.ns) === String(x.ID); })) { trung++; return; }
                dong.push({ id: ums.util.uuid().replace(/-/g, '').substr(2, 30), moi: true, ns: x.ID, dv: e(x.DAOTAO_COCAUTOCHUC_TEN), ma: e(x.MASO),
                    ten: e(x.HOTEN) || (e(x.HODEM) + ' ' + e(x.TEN)).trim(), hp: e(hp.TEN), sl: '', tu: '', den: '', slhv: '', gc: '' });
            });
            if (trung) ui.toast(trung + ' cán bộ đã tồn tại trong danh sách', 'warn');
            veTV();
        } });
    }
    function luu() {
        docO();
        if (!dong.length) { ui.toast('Chưa có cán bộ để lưu', 'warn'); return; }
        var calls = dong.map(function (r) {
            return { action: TD + (r.moi ? 'ThemMoi' : 'CapNhat'), method: 'POST', strId: r.moi ? '' : r.id, strChucNang_Id: cn(), strNhanSu_HoSoCanBo_Id: r.ns,
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: hp.ID, dSoLuong: r.sl, strNgayBatDau: r.tu, strNgayKetThuc: r.den,
                dSoLuongHSSV: r.slhv, strGhiChu: r.gc, strNguoiThucHien_Id: uid() };
        });
        ui.batch(calls, { title: 'Đang lưu', okText: 'Lưu' }).then(function (kq) {
            if (kq && !kq.fail) ui.toast('Cập nhật thành công (' + calls.length + ')', 'ok');
            taiTV();
        });
    }
    function xoa(i) {
        var r = dong[i];
        if (!r) return;
        if (r.moi) { docO(); dong.splice(i, 1); veTV(); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            docO();
            ums.api.call({ action: TD + 'Xoa', method: 'POST', strChucNang_Id: cn(), strIds: r.id, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); taiTV(); }).catch(function (err) { ums.api.handle(err, 'xoá'); });
        });
    }

    datHP(null);
    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('.ums-master__item[data-id]'))) {
            var x = dsHP.filter(function (h) { return String(h.ID) === b.getAttribute('data-id'); })[0];
            if (x) { datHP(x); veHP(); taiTV(); }
            return;
        }
        if ((b = ev.target.closest('[data-xoa]'))) { xoa(Number(b.getAttribute('data-xoa'))); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'luu') luu();
        else if (a === 'them') them();
        else if (a === 'import') ums.report.importChung('Dữ liệu', 'IMPORTWITHPROC_DLTD', { onDone: function () { if (hp) taiTV(); } });
    });
    taiHP();
})();
