/* =========================================================================
   Phân công chương trình
   Bản gốc: ApisDangKyHoc/Modules/phancongchuongtrinh/html/phancongchuongtrinh.html
            + script/phancongchuongtrinh.js (lớp PhanCongChuongTrinh, vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột, ba vùng thay nhau — toggle_overide "zone-content"):
     1. "Tìm kế hoạch" (Năm học · Học kỳ · Đợt học · từ khoá · Tìm kiếm) +
        "Danh sách kế hoạch" dạng hộp (Tên, Mã, năm học, Học kỳ, Đợt học,
        nút "Xem chương trình") → ums.pat.cards.
     2. "Nội dung chương trình theo kế hoạch: <tên>" (Đóng) + "Danh sách chương
        trình" (Thêm chương trình) — bảng Khóa · Chương trình · Chi tiết, dưới
        bảng "Tổng số chương trình".
     3. "Chọn chương trình cho kế hoạch: <tên>" — hai khung: "Xác định chương
        trình cho kế hoạch" (tìm nhanh, mỗi dòng nút Chọn, "Thêm tất cả") |
        "Danh sách kết quả chương trình thuộc kế hoạch" (tìm nhanh, nút Bỏ Chọn,
        "Tải lại") · Đóng · Lưu.
   Lời gọi (chép nguyên):
       DKH_KeHoachDangKy/LayDanhSach        GET  strTuKhoa, pageSize 100000
       KHCT_ToChucChuongTrinh/LayDanhSach   GET  mọi tham số lọc '', pageSize 10000000 (nạp một lần)
       DKH_PhanCong_ChuongTrinh/LayDanhSach GET  strDangKy_KeHoachDangKy_Id, pageSize 100000000
       DKH_PhanCong_ChuongTrinh/ThemMoi     POST strId '', kế hoạch, strDaoTao_ChuongTrinh_Id,
                                                 strNgayBatDau/KetThuc '', dSoTinChiToiDa/ToiThieu ''
       DKH_PhanCong_ChuongTrinh/Xoa         POST strIds
       KHCT_NamHoc/LayDanhSach              GET  (NAMHOC)
       KHCT_ThoiGianDaoTao/LayDanhSach      GET  strDAOTAO_NAM_Id, pageSize mặc định 10 như gốc (HOCKY)
       KHCT_DotHoc/LayDanhSach_RutGon       GET  strDaoTao_HocKy_Id (DOTHOC)

   Bản gốc hỏng nhiều chỗ — đã làm theo ý định (ghi can-quyet):
     · Thanh "Tìm kế hoạch" KHÔNG chạy: getList_NamHoc không nơi nào gọi (ô Năm
       học trống, kéo theo Học kỳ / Đợt học trống), Tìm kiếm gửi strTuKhoa "".
       Nay: nạp Năm học → Học kỳ → Đợt học (nối tầng, khoá con), Tìm kiếm gửi từ
       khoá, rồi lọc hộp kế hoạch tại máy theo CHỮ đã chọn so với
       DAOTAO_THOIGIANDAOTAO_NAM / _KY / _DOT — cách so này là ĐOÁN, kiểm trên host.
     · Chương trình đã phân công không bao giờ hiện ở khung phải (gốc vẽ vào
       #zoneChuongTrinh_Selected — không tồn tại) nên khung trái luôn đủ mọi
       chương trình, thêm lại được → trùng. Nay khung phải hiện chương trình đã
       lưu, khung trái bỏ chúng đi. So khớp theo DAOTAO_CHUONGTRINH_ID (tên cột
       ĐOÁN) hoặc MACHUONGTRINH (cột gốc dùng) — kiểm trên host.
     · "Bỏ Chọn" chương trình đã lưu → Xoa với strIds = ID dòng phân công (gốc
       gửi MACHUONGTRINH lấy từ thuộc tính name — sai). Nay HỎI LẠI trước khi xoá
       (gốc xoá ngay).
     · Lưu chỉ THÊM chương trình mới chọn. Gốc gọi CapNhat cho dòng đã lưu với
       MAKEHOACH nhét vào ngày bắt đầu / kết thúc / số tín chỉ → bỏ.
     · Ô tìm nhanh khung phải gốc lọc vùng không tồn tại → nay lọc đúng khung.
   Cố ý bỏ / để khoá:
     · Cột "Chi tiết" (sửa chương trình): vùng "Chỉnh sửa chương trình" của gốc
       không mở được (đọc biến không có → lỗi JS), Lưu / Xóa gọi hàm không tồn
       tại → giữ nút, KHOÁ. Cột "Số sinh viên" gốc không có dữ liệu (lệch cột:
       nút sửa rơi vào đó) → bỏ.
     · "Nâng cao" (ô Khóa đào tạo + Tìm kiếm): nút Tìm kiếm gắn vào id không có,
       ô Khóa không lọc gì → bỏ.
     · "Tải lại" khung phải: gốc không có xử lý → giữ nút, KHOÁ.
     · Kéo – thả (dragenter/dragleave gắn lên document, drop_handler không gắn
       vào đâu) và hộp #myModal "Tổ chức chương trình" (không mở từ đâu) → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dkh-phancongchuongtrinh');
    if (!root) return;

    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === undefined || v === null ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : ((d && d.rs) || []); }
    function jq(el) { return window.jQuery ? jQuery(el) : null; }
    function boDau(s) { return String(e(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    var P = 'DKH_PhanCong_ChuongTrinh/';

    var dsKH = [], dsCT = [], daLuu = [], moi = [], keHoach = null;

    function sel(k, ph) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select></div>';
    }

    root.innerHTML =
        pat.page('Phân công chương trình', '') +
        '<div data-z="kh">' +
            pat.panel({ title: 'Tìm kế hoạch', icon: 'fa-window-restore', cls: 'ums-u-mb-4', body:
                '<div class="ums-filter">' +
                    sel('nam', 'Chọn năm học') + sel('hk', 'Chọn học kỳ') + sel('dot', 'Chọn đợt học') +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timKH' } }) + '</div>' +
                '</div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-calendar-check', zone: 'cards' }) +
        '</div>' +
        '<div data-z="ct" hidden>' +
            pat.panel({ title: 'Nội dung chương trình theo kế hoạch', icon: 'fa-book', count: 'tenKH1', cls: 'ums-u-mb-4 pcct-dau',
                tools: ui.btn('close', { attr: { 'data-a': 'dongCT' } }) }) +
            pat.panel({ title: 'Danh sách chương trình', icon: 'fa-book', flush: true, zone: 'bangCT',
                tools: ui.btn('add', { text: 'Thêm chương trình', attr: { 'data-a': 'themCT' } }) }) +
        '</div>' +
        '<div data-z="chon" hidden>' +
            pat.panel({ title: 'Chọn chương trình cho kế hoạch', icon: 'fa-pen', count: 'tenKH2',
                tools: ui.btn('close', { attr: { 'data-a': 'dongChon' } }),
                body: '<div class="pcct-cols ums-cols">' +
                    pat.panel({ title: 'Xác định chương trình cho kế hoạch', icon: 'fa-book', flush: true,
                        body: '<div class="pcct-tim"><input class="ums-input" data-f="qTrai" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div><div data-z="trai"></div>',
                        foot: '<div class="ums-u-flex1"></div>' + ui.btn('add', { text: 'Thêm tất cả', mod: 'out-success', icon: 'fa-window-restore', attr: { 'data-a': 'themTatCa' } }) }) +
                    pat.panel({ title: 'Danh sách kết quả chương trình thuộc kế hoạch', icon: 'fa-files', flush: true,
                        body: '<div class="pcct-tim"><input class="ums-input" data-f="qPhai" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div><div data-z="phai"></div>',
                        foot: '<div class="ums-u-flex1"></div>' + ui.btn('reload', { attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } }) }) +
                    '</div>',
                foot: '<div class="ums-u-flex1"></div>' + ui.btn('close', { attr: { 'data-a': 'dongChon' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luu' } }) }) +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { var x = f(k); return x ? x.value : ''; }
    function chu(k) { var s = f(k), o = s && s.options[s.selectedIndex]; return o && o.value ? o.text.trim() : ''; }
    function hien(k) {
        var cur = ['kh', 'ct', 'chon'].filter(function (x) { return !z(x).hidden; })[0];
        if (cur !== k) ui.swap(z(cur), z(k));
    }

    /* ---------- 1. Kế hoạch ---------- */
    function veKH() {
        var nam = chu('nam'), hk = chu('hk'), dot = chu('dot');
        var rows = dsKH.filter(function (r) {
            return (!nam || String(e(r.DAOTAO_THOIGIANDAOTAO_NAM)).trim() === nam) &&
                (!hk || String(e(r.DAOTAO_THOIGIANDAOTAO_KY)).trim() === hk) &&
                (!dot || String(e(r.DAOTAO_THOIGIANDAOTAO_DOT)).trim() === dot);
        });
        pat.cards({
            el: z('cards'), items: rows, empty: 'Không có kế hoạch',
            render: function (r) {
                return '<b class="ums-card__no">' + esc(e(r.TENKEHOACH)) + '</b>' +
                    pat.cardRow('Mã kế hoạch', r.MAKEHOACH) + pat.cardRow('Năm học', r.DAOTAO_THOIGIANDAOTAO_NAM) +
                    pat.cardRow('Học kỳ', r.DAOTAO_THOIGIANDAOTAO_KY) + pat.cardRow('Đợt học', r.DAOTAO_THOIGIANDAOTAO_DOT);
            },
            actions: function (r) {
                return ui.btn('view', { text: 'Xem chương trình', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-xemct': e(r.ID) } });
            },
            onPick: moKH
        });
    }
    function taiKH() {
        z('cards').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'DKH_KeHoachDangKy/LayDanhSach', method: 'GET',
            strTuKhoa: v('q').trim(), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) { dsKH = arr(r.data); veKH(); })
            .catch(function (err) { z('cards').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải danh sách kế hoạch'); });
    }
    function napNam() {
        ums.api.call({ action: 'KHCT_NamHoc/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strNguoiThucHien_Id: '', strCanBoNhapDeTai_Id: '', pageIndex: 1, pageSize: 10000000 })
            .then(function (r) { pat.fill(f('nam'), arr(r.data), { name: 'NAMHOC', head: 'Chọn năm học' }); })
            .catch(function (err) { ums.api.handle(err, 'nạp năm học'); });
    }
    function napHK() {
        if (!v('nam')) { pat.fill(f('hk'), [], { head: 'Chọn học kỳ' }); return; }
        ums.api.call({ action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strDAOTAO_NAM_Id: v('nam'), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10 })
            .then(function (r) { pat.fill(f('hk'), arr(r.data), { name: 'HOCKY', head: 'Chọn học kỳ' }); })
            .catch(function (err) { ums.api.handle(err, 'nạp học kỳ'); });
    }
    function napDot() {
        if (!v('hk')) { pat.fill(f('dot'), [], { head: 'Chọn đợt học' }); return; }
        ums.api.call({ action: 'KHCT_DotHoc/LayDanhSach_RutGon', method: 'GET', silent: true, strDaoTao_HocKy_Id: v('hk') })
            .then(function (r) { pat.fill(f('dot'), arr(r.data), { name: 'DOTHOC', head: 'Chọn đợt học' }); })
            .catch(function (err) { ums.api.handle(err, 'nạp đợt học'); });
    }
    if (jq(f('nam'))) {
        jq(f('nam')).on('select2:select select2:clear', function () { pat.fill(f('dot'), [], { head: 'Chọn đợt học' }); napHK(); veKH(); });
        jq(f('hk')).on('select2:select select2:clear', function () { napDot(); veKH(); });
        jq(f('dot')).on('select2:select select2:clear', veKH);
    }
    pat.chain([f('nam'), f('hk'), f('dot')], { phatLai: false });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiKH(); } });

    /* ---------- 2. Chương trình của kế hoạch ---------- */
    function moKH(row) {
        keHoach = row;
        root.querySelector('[data-z="tenKH1"]').textContent = ': ' + e(row.TENKEHOACH);
        root.querySelector('[data-z="tenKH2"]').textContent = ': ' + e(row.TENKEHOACH);
        hien('ct');
        taiDaLuu();
    }
    function taiDaLuu() {
        z('bangCT').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: P + 'LayDanhSach', method: 'GET',
            strTuKhoa: '', strDangKy_KeHoachDangKy_Id: keHoach.ID, strDaoTao_ChuongTrinh_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 })
            .then(function (r) {
                daLuu = arr(r.data);
                ui.table({ el: z('bangCT'), rows: daLuu, empty: 'Kế hoạch chưa có chương trình',
                    columns: [
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center', width: '160px' },
                        { title: 'Chương trình', prop: 'TENCHUONGTRINH' },
                        { title: 'Chi tiết', cls: 'is-center is-actions', width: '80px', render: function () {
                            return '<button type="button" class="ums-iconbtn ums-iconbtn--edit pcct-khoa" disabled title="Chưa dùng được — biểu mẫu sửa của bản gốc lỗi">' +
                                '<i class="fa-light fa-pen-to-square"></i></button>';
                        } }
                    ] });
                z('bangCT').insertAdjacentHTML('beforeend', '<div class="ums-tablefoot">' + pat.footSum('Tổng số chương trình', daLuu.length) + '</div>');
                veChon();
            })
            .catch(function (err) { z('bangCT').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải chương trình của kế hoạch'); });
    }

    /* ---------- 3. Chọn chương trình ---------- */
    function ten(r) { return e(r.MACHUONGTRINH) + ' - ' + e(r.TENCHUONGTRINH); }
    function daCo(ct) {
        return daLuu.some(function (d) {
            return (d.DAOTAO_CHUONGTRINH_ID && d.DAOTAO_CHUONGTRINH_ID === ct.ID) ||
                (d.MACHUONGTRINH && d.MACHUONGTRINH === ct.MACHUONGTRINH);
        });
    }
    function loc(rows, q) {
        q = boDau(q).trim();
        return q ? rows.filter(function (r) { return boDau(ten(r)).indexOf(q) >= 0; }) : rows;
    }
    function veChon() {
        var trai = dsCT.filter(function (c) { return !daCo(c) && moi.indexOf(c.ID) < 0; });
        ui.table({ el: z('trai'), rows: loc(trai, v('qTrai')), empty: 'Không còn chương trình để chọn',
            columns: [
                { title: 'Chương trình', render: function (r) { return esc(ten(r)); } },
                { title: '', cls: 'is-center', width: '96px', render: function (r) {
                    return ui.btn('add', { text: 'Chọn', mod: 'out-primary', icon: 'fa-forward', cls: 'ums-btn--sm', attr: { 'data-chon': e(r.ID) } });
                } }
            ] });
        var phai = daLuu.map(function (d) { return { luu: d, MACHUONGTRINH: d.MACHUONGTRINH, TENCHUONGTRINH: d.TENCHUONGTRINH }; })
            .concat(dsCT.filter(function (c) { return moi.indexOf(c.ID) >= 0; }).map(function (c) {
                return { moi: c.ID, MACHUONGTRINH: c.MACHUONGTRINH, TENCHUONGTRINH: c.TENCHUONGTRINH };
            }));
        ui.table({ el: z('phai'), rows: loc(phai, v('qPhai')), empty: 'Chưa có chương trình thuộc kế hoạch',
            columns: [
                { title: 'Chương trình', render: function (r) {
                    return esc(ten(r)) + (r.moi ? ' ' + ui.badge('Chưa lưu', 'warn') : '');
                } },
                { title: '', cls: 'is-center', width: '110px', render: function (r) {
                    return ui.btn('del', { text: 'Bỏ Chọn', mod: 'out-danger', icon: 'fa-backward', cls: 'ums-btn--sm',
                        attr: r.luu ? { 'data-bo-luu': e(r.luu.ID) } : { 'data-bo-moi': e(r.moi) } });
                } }
            ] });
    }
    function taiCT() {
        return ums.api.call({ action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '',
            strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000 })
            .then(function (r) { dsCT = arr(r.data); })
            .catch(function (err) { ums.api.handle(err, 'nạp danh sách chương trình'); });
    }
    function boLuu(id) {
        var d = daLuu.filter(function (x) { return x.ID === id; })[0] || {};
        ui.confirm('Bỏ chương trình "' + ten(d) + '" khỏi kế hoạch? Phân công đã lưu sẽ bị xoá.', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: P + 'Xoa', strIds: id, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); taiDaLuu(); })
                .catch(function (err) { ums.api.handle(err, 'xoá chương trình khỏi kế hoạch'); });
        });
    }
    function themTatCa() {
        var trai = dsCT.filter(function (c) { return !daCo(c) && moi.indexOf(c.ID) < 0; });
        if (!trai.length) return;
        ui.confirm('Bạn có muốn thêm ' + trai.length + ' chương trình vào kế hoạch không?', { title: 'Thêm tất cả', ok: 'Thêm' }).then(function (yes) {
            if (!yes) return;
            trai.forEach(function (c) { moi.push(c.ID); });
            veChon();
        });
    }
    function luu() {
        if (!moi.length) { ui.toast('Chưa chọn thêm chương trình nào.', 'warn'); return; }
        var calls = moi.map(function (id) {
            return { action: P + 'ThemMoi', strId: '', strDangKy_KeHoachDangKy_Id: keHoach.ID, strDaoTao_ChuongTrinh_Id: id,
                strNgayBatDau: '', strNgayKetThuc: '', dSoTinChiToiDa: '', dSoTinChiToiThieu: '', strNguoiThucHien_Id: '' };
        });
        ui.batch(calls, { title: 'Đang thêm chương trình', okText: 'Thêm mới thành công!' }).then(function () {
            moi = [];
            taiDaLuu();
        });
    }

    f('qTrai').addEventListener('input', veChon);
    f('qPhai').addEventListener('input', veChon);
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-xemct]');
        if (t && root.contains(t)) {
            var k = dsKH.filter(function (x) { return x.ID === t.getAttribute('data-xemct'); })[0];
            if (k) moKH(k);
            return;
        }
        t = ev.target.closest('[data-chon]');
        if (t && root.contains(t)) { moi.push(t.getAttribute('data-chon')); veChon(); return; }
        t = ev.target.closest('[data-bo-moi]');
        if (t && root.contains(t)) { var id = t.getAttribute('data-bo-moi'); moi = moi.filter(function (x) { return x !== id; }); veChon(); return; }
        t = ev.target.closest('[data-bo-luu]');
        if (t && root.contains(t)) { boLuu(t.getAttribute('data-bo-luu')); return; }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'timKH') taiKH();
        else if (a === 'dongCT') hien('kh');
        else if (a === 'themCT') { moi = []; f('qTrai').value = ''; f('qPhai').value = ''; veChon(); hien('chon'); }
        else if (a === 'dongChon') { moi = []; hien('ct'); taiDaLuu(); }
        else if (a === 'themTatCa') themTatCa();
        else if (a === 'luu') luu();
    });

    napNam();
    taiKH();
    taiCT();
})();
