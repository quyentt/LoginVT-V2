/* =========================================================================
   Quản lý hồ sơ — Nghiên cứu khoa học › Quản lý hồ sơ
   Bản gốc: ApisNCKH/Modules/quanlyhoso/html/quanlyhoso.html + script/quanlyhoso.js (lớp QuanLyHoSo)
   ---------------------------------------------------------------------------
   Nguồn gốc mã: bản CÁN BỘ của màn Cổng SV "Tự nhập hồ sơ" (ApisCongSinhVien/Modules/profile/script/
   tunhaphoso.js — chép gần từng dòng: kế hoạch nhập hồ sơ, bảng trường thông tin theo tab, geninput,
   bcheck, lưu từng trường) + cột trái danh sách sinh viên của kế hoạch (SV_KeHoach_PhamVi) và hộp "Sinh viên"
   thêm người học vào kế hoạch. Bản Cổng SV đã chuyển (ums.csvProfile.manHoSo) KHÔNG dùng lại được nguyên
   khối: nó đọc ID người học từ phiên thủ vai, gọi action MÃ HOÁ SV_KeHoach_MH (ở đây là action kiểu cũ
   SV_KeHoach_NguoiHoc / SV_KeHoach_DuLieu), đặt ô Kế hoạch trong khối thông tin (ở đây nằm ở cột trái) và
   dựng cả trang một cột → chỉ dùng lại KIỂU (css _profile.css: .pf-ctl, .pf-nhom…) và cách vẽ ô nhập.

   Bố cục giữ nguyên gốc — HAI cột (col-lg-3 · col-lg-9):
     trái : ô Kế hoạch (chọn sẵn mục đầu) + từ khoá + "Danh sách" sinh viên (ảnh · họ tên · mã số), phân trang
     phải: dải tab ("1. Tất cả" + tab thông tin) → khung người học (ảnh, họ tên, mã SV) + bảng
           "Nhóm | Tên thông tin | Dữ liệu cần nhập | Dữ liệu sinh viên tự xác nhận | Kết quả xác nhận từ trường |
           File minh chứng" + Xuất báo cáo + Lưu
     "Thêm mới" (gốc: nút ở cột trái mở hộp "Sinh viên") → biểu mẫu Họ đệm / Tên / Mã số thay chỗ khung phải
     (BO-CUC luật 1, 5: nút ở đầu trang, biểu mẫu trong trang). Sửa (gốc: bút chì trên từng dòng) → nút "Sửa" trên
     đầu khung người học (luật 12: mục cột trái không mang nút).

   Lời gọi (kiểu cũ, chép nguyên tên tham số):
     SV_KeHoach_NguoiHoc/LayDSKeHoachNhapHoSo (GET)  strChucNang_Id, strQLSV_NguoiHoc_Id ''   → ID, MOTA, XACNHANTHONGTIN
     SV_KeHoach_PhamVi/LayDanhSach (GET)  strTuKhoa, strQLSV_KeHoach_NguoiHoc_Id, strNguoiTao_Id '', pageIndex, pageSize
           → ID, QLSV_NGUOIHOC_ID, ANH, QLSV_NGUOIHOC_HODEM / _TEN / _MASO
     SV_HoSo/LayChiTiet (GET)  strId = ID người học  → HODEM, TEN, MASO, ANH
     SV_KeHoach_NguoiHoc/LayDSHoSoChoPhepSVNhap | LayDSTabThongTinNguoiHoc (GET)  strChucNang_Id,
           strQLSV_KeHoach_NguoiHoc_Id, strQLSV_NguoiHoc_Id, strNguoiThucHien_Id, strHanhDong_Id ''
     SV_KeHoach_DuLieu/ThemMoi (POST)  strChucNang_Id, strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id '',
           strQLSV_KeHoach_NguoiHoc_Id, strTruongThongTin_Id, strTruongThongTin_GiaTri, strThongTinXacMinh, strNguoiThucHien_Id
     SV_KeHoach_HoSo/ThemMoi (POST)  strChucNang_Id, strHoDem, strTen, strMaSo, strQLSV_KeHoach_NguoiHoc_Id, strNguoiThucHien_Id
     SV_KeHoach_HoSo/Xoa (POST)  strIds = ID người học, strChucNang_Id, strNguoiThucHien_Id
     Tệp: SV_Files. Menu mẫu báo cáo (getList_MauImport "zonebtnBaoCao_QLHS", không có vùng _Import):
           strQLSV_KeHoach_NguoiHoc_Id, strQLSV_NguoiHoc_Id.

   Lỗi của bản gốc đã sửa (làm theo ý định):
     · Ô từ khoá không bao giờ được gửi (đọc ô 'txtAAAA' không tồn tại) → gửi strTuKhoa; gõ là tự tìm (luật 12).
     · "Lưu" duyệt MỌI trường của kế hoạch nhưng chỉ trường của TAB ĐANG MỞ có ô trên màn → trường tab khác bị gửi
       giá trị undefined (xoá trắng dữ liệu). Nay chỉ lưu các trường đang hiện (tab "Tất cả" = mọi trường).
     · me.bcheck chốt MỘT CHIỀU (bật khi kế hoạch có XACNHANTHONGTIN = 0, không bao giờ tắt) → tính lại theo kế hoạch
       đang chọn; cột "Dữ liệu sinh viên tự xác nhận" ẩn/hiện theo đó.
     · Dải tab: mỗi lần chọn sinh viên gốc NỐI THÊM tab (tab nhân đôi) → vẽ lại.
     · Hộp "Sinh viên" khi sửa luôn gọi ThemMoi (obj_save không có strId nên nhánh CapNhat là mã chết → sửa = tạo
       TRÙNG) → Sửa gửi SV_KeHoach_HoSo/CapNhat kèm strId = ID người học (đường GHI mới — thử trên host). Nút Xoá của
       hộp bị ẩn cứng (display:none) → hiện trong biểu mẫu Sửa.
     · Ô TEXT có DORONG dựng <textarea value=…> (luôn trống) → đổ giá trị vào thân thẻ (như bản Cổng SV).
     · Tệp: gốc gắn tệp theo khoá = ID TRƯỜNG thông tin (mọi sinh viên dùng CHUNG một bộ tệp). Nay khoá =
       ID người học + ID trường — đúng khoá màn Cổng SV "Tự nhập hồ sơ" dùng, nên cán bộ thấy đúng tệp sinh viên đã nộp.
       Trường kiểu FILE thì chính ô là tệp, cột "File minh chứng" để trống (tránh hai khung cùng khoá).
     · Ảnh: gốc dựng khung tải ảnh nhưng hàm lưu ảnh (save_Anh) không bao giờ được gọi (và lỗi `me` chưa khai) → ảnh
       CHỈ XEM ở đầu khung người học.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nckh-quanlyhoso');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function goi(action, o, post) { return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {})); }

    var S = { rows: [], page: 1, size: 10, total: 0, chon: null, sv: null, dsKH: [], truong: [], tab: '', tabs: [], bcheck: false, tep: {}, sua: false };

    var m = pat.master({
        el: root, title: 'Quản lý hồ sơ',
        actions: ui.btn('add', { attr: { 'data-a': 'them' } }),
        side: {
            title: 'Danh sách', icon: 'fa-user-graduate', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-master__adv" data-q="adv">' +
                '<div class="ums-field"><select class="ums-select" data-q="kh" data-ph="Chọn kế hoạch" data-required><option value=""></option></select></div></div>'
        },
        main: { title: false }
    });
    var elKH = m.side.querySelector('[data-q="kh"]');

    m.mainBody.innerHTML =
        '<div class="ums-panel" data-q="nhac"><div class="ums-panel__body">' +
            ui.empty('Chọn một sinh viên ở cột trái để nhập / xác nhận hồ sơ', 'fa-user-magnifying-glass') + '</div></div>' +
        '<div data-q="hs" hidden>' +
            '<nav class="ums-u-mb-4" data-q="tab" hidden></nav>' +
            '<div class="ums-panel" data-q="nguoi"><div class="ums-panel__body ums-panel__body--flush" data-q="bang"></div></div>' +
        '</div>' +
        '<div class="ums-panel" data-z="svform" hidden>' +
            '<div class="ums-panel__head"><div class="ums-panel__title" data-q="ftitle"></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'fdong' } }) +
                ui.btn('del', { attr: { 'data-a': 'fxoa' } }) + ui.btn('save', { attr: { 'data-a': 'fluu' } }) + '</div></div>' +
            '<div class="ums-panel__body"><div class="ums-grid ums-grid--2">' +
                ui.field('Họ đệm', '<input class="ums-input" data-scope="form" data-f="strHoDem">') +
                ui.field('Tên', '<input class="ums-input" data-scope="form" data-f="strTen">', { required: true }) +
                ui.field('Mã số', '<input class="ums-input" data-scope="form" data-f="strMaSo">', { required: true }) +
            '</div></div></div>';
    function q(k) { return m.mainBody.querySelector('[data-q="' + k + '"]'); }
    var elNhac = q('nhac'), elHS = q('hs'), elForm = m.mainBody.querySelector('[data-z="svform"]');

    /* ---------- Cột trái ---------------------------------------------- */
    function keHoach() { return elKH.value; }
    function tai(page) {
        if (page) S.page = page;
        if (!keHoach()) {
            S.rows = []; S.total = 0; ve();
            m.sideBody.innerHTML = ui.empty('Chọn kế hoạch', 'fa-calendar');
            return Promise.resolve();
        }
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return goi('SV_KeHoach_PhamVi/LayDanhSach', {
            strTuKhoa: (m.search.value || '').trim(), strQLSV_KeHoach_NguoiHoc_Id: keHoach(), strNguoiTao_Id: '',
            pageIndex: S.page, pageSize: S.size
        }).then(function (r) {
            S.rows = arr(r.data); S.total = Number(r.pager) || S.rows.length; ve();
        }).catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }
    function hoTen(r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(); }
    function ve() {
        m.sideCount.textContent = S.total ? '(' + ui.so(S.total) + ')' : '';
        m.sideBody.innerHTML = S.rows.length ? S.rows.map(function (r) {
            return '<button type="button" class="ums-master__item ums-dsns__item' + (S.chon && S.chon.ID === r.ID ? ' is-active' : '') + '" data-id="' + esc(e(r.ID)) + '">' +
                pat.anhNguoi(e(r.ANH)) +
                '<span class="ums-master__item__main"><span class="ums-cell__title">' + esc(hoTen(r)) + '</span>' +
                '<span class="ums-master__item__sub">' + esc(e(r.QLSV_NGUOIHOC_MASO)) + '</span></span></button>';
        }).join('') : ui.empty('Không có sinh viên nào', 'fa-user-magnifying-glass');
        m.setPage({ index: S.page, size: S.size, total: S.total, onChange: function (p) { tai(p); }, onSize: function (v) { S.size = v; tai(1); } });
    }
    m.sideBody.addEventListener('click', function (ev) {
        var it = ev.target.closest('.ums-master__item[data-id]');
        if (!it) return;
        var r = S.rows.filter(function (x) { return e(x.ID) === it.getAttribute('data-id'); })[0];
        if (r) chon(r);
    });

    /* Đổi kế hoạch → bỏ người đang chọn; tính lại bcheck (gốc: option name = XACNHANTHONGTIN, "0" → bcheck) */
    function datBcheck() {
        var k = S.dsKH.filter(function (x) { return e(x.ID) === keHoach(); })[0];
        S.bcheck = !!k && e(k.XACNHANTHONGTIN) === '0';
    }
    m.side.querySelector('[data-q="adv"]').addEventListener('change', function () { datBcheck(); boChon(); });
    pat.cotTrai(m, { tai: tai, moSan: true });

    goi('SV_KeHoach_NguoiHoc/LayDSKeHoachNhapHoSo', { strChucNang_Id: cn(), strQLSV_NguoiHoc_Id: '' }).then(function (r) {
        S.dsKH = arr(r.data);
        pat.fill(elKH, S.dsKH, { id: 'ID', name: 'MOTA', head: 'Chọn kế hoạch' });
        if (S.dsKH.length) { elKH.value = e(S.dsKH[0].ID); if (window.jQuery) jQuery(elKH).trigger('change.select2'); }  // selectOne của gốc
        datBcheck();
        tai(1);
    }).catch(function (err) { ums.api.handle(err, 'kế hoạch nhập hồ sơ'); tai(1); });

    /* ---------- Khung phải: người học đang chọn ------------------------ */
    function hienVung(v) {
        elNhac.hidden = v !== 'nhac'; elHS.hidden = v !== 'hs'; elForm.hidden = v !== 'form';
        m.formMode(v === 'form');
    }
    function boChon() {
        S.chon = null; S.sv = null;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item.is-active'), function (x) { x.classList.remove('is-active'); });
        hienVung('nhac');
    }
    function tenSV() { return S.sv ? (e(S.sv.HODEM) + ' ' + e(S.sv.TEN)).trim() : hoTen(S.chon || {}); }
    function veDau() {
        var sv = S.sv || {}, r = S.chon || {};
        pat.datDau(q('nguoi'), {
            anh: e(sv.ANH || r.ANH), ten: tenSV(),
            nhan: '<span class="ums-u-faint ums-u-fz13">Mã sinh viên: ' + esc(e(sv.MASO || r.QLSV_NGUOIHOC_MASO)) + '</span>',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('edit', { attr: { 'data-a': 'sua' } }) +
                '<span data-q="bc"></span>' + ui.btn('save', { attr: { 'data-a': 'luu' } })
        });
        ums.report.mount(q('bc'), {
            import: false,
            collect: function (add) {
                add('strQLSV_KeHoach_NguoiHoc_Id', keHoach());
                add('strQLSV_NguoiHoc_Id', S.chon ? e(S.chon.QLSV_NGUOIHOC_ID) : '');
            }
        });
    }
    function svId() { return S.chon ? e(S.chon.QLSV_NGUOIHOC_ID) : ''; }
    function chon(r) {
        if (S.chon !== r) S.tab = '';
        S.chon = r; S.sv = null;
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) {
            x.classList.toggle('is-active', x.getAttribute('data-id') === e(r.ID));
        });
        hienVung('hs');
        veDau();
        goi('SV_HoSo/LayChiTiet', { strId: svId() }).then(function (x) {
            S.sv = arr(x.data)[0] || null;
            if (S.chon === r) veDau();
        }).catch(function (err) { ums.api.handle(err, 'thông tin sinh viên'); });
        taiTruong();
    }
    function thamSo() {
        return { strChucNang_Id: cn(), strQLSV_KeHoach_NguoiHoc_Id: keHoach(), strQLSV_NguoiHoc_Id: svId(), strNguoiThucHien_Id: uid(), strHanhDong_Id: '' };
    }
    function taiTruong() {
        var r0 = S.chon;
        q('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        Promise.all([
            goi('SV_KeHoach_NguoiHoc/LayDSHoSoChoPhepSVNhap', thamSo()),
            goi('SV_KeHoach_NguoiHoc/LayDSTabThongTinNguoiHoc', thamSo())
        ]).then(function (kq) {
            if (S.chon !== r0) return;
            S.truong = arr(kq[0].data); S.tabs = arr(kq[1].data);
            veTab();
            /* nạp lại sau khi Lưu thì giữ tab đang mở (gốc về "Tất cả") */
            chonTab(S.tabs.some(function (t) { return e(t.ID) === S.tab; }) ? S.tab : '');
        }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thông tin hồ sơ'); });
    }

    /* Dải tab — "1. Tất cả" + tab thông tin (gốc genTab_DM_HoatDong: "2) Tên"…) */
    function veTab() {
        var nav = q('tab');
        if (!S.tabs.length) { nav.hidden = true; nav.innerHTML = ''; return; }
        nav.hidden = false;
        nav.innerHTML = ui.tabs([{ key: '', text: '1. Tất cả' }].concat(S.tabs.map(function (t, i) {
            return { key: e(t.ID), text: (i + 2) + ') ' + e(t.TAB_THONGTIN_TEN) };
        })), '', 'data-qtab');
    }
    function chonTab(id) {
        S.tab = id;
        ui.tabsActive(q('tab'), id, 'data-qtab');
        veBang(id ? S.truong.filter(function (x) { return e(x.TAB_THONGTIN_ID) === id; }) : S.truong.slice());
    }

    /* ---------- Bảng trường thông tin — gốc genTable_QuanLyHoSo -------- */
    var dangHien = [];
    function giaTri(x) { return e(S.bcheck ? x.TRUONGTHONGTIN_GIATRI : x.THONGTINXACMINH); }
    function laFile(x) { return e(x.KIEUDULIEU).toUpperCase() === 'FILE'; }
    function veO(x) {
        var k = e(x.KIEUDULIEU).toUpperCase();
        if (!k) return '';
        var ro = String(e(x.DUOCSUA)) === '0' ? ' readonly' : '';
        var id = ' data-m="' + esc(e(x.ID)) + '"';
        var val = giaTri(x);
        if (k === 'FILE') return '<div data-mfile="' + esc(e(x.ID)) + '"></div>';
        if (k === 'LIST' || k === 'TINH' || k === 'HUYEN' || k === 'XA')
            return '<select class="ums-select ums-input--sm"' + id + ' data-v="' + esc(val) + '"' + (ro ? ' disabled' : '') + '><option value=""></option></select>';
        if (k === 'DATE') return '<input class="ums-input ums-input--sm"' + id + ' data-date value="' + esc(val) + '"' + ro + '>';
        if (k !== 'TEXT' && k !== 'NUMBER') return '';
        if (x.DORONG) return '<textarea class="ums-input ums-input--sm"' + id + ' style="height:' + Number(x.DORONG) + 'px"' + ro + '>' + esc(val) + '</textarea>';
        return '<input class="ums-input ums-input--sm"' + id + (k === 'NUMBER' ? ' inputmode="decimal"' : '') + ' value="' + esc(val) + '"' + ro + '>';
    }
    function veBang(rows) {
        dangHien = rows; S.tep = {};
        var nhomTruoc = null;
        var cot = [
            { title: 'Nhóm', width: '14%', render: function (x, i) {
                var g = e(x.THUOCNHOM), hien = i === 0 || g !== nhomTruoc;   // gốc gộp ô cột Nhóm (actionRowSpanForACol)
                nhomTruoc = g;
                return hien ? '<b class="pf-nhom">' + esc(g) + '</b>' : '';
            } },
            { title: 'Tên thông tin', width: '18%', prop: 'TEN' }
        ];
        if (!S.bcheck) cot.push({ title: 'Dữ liệu cần nhập', width: '16%', prop: 'TRUONGTHONGTIN_GIATRI' });
        cot.push(
            { title: S.bcheck ? 'Dữ liệu cần nhập' : 'Dữ liệu sinh viên tự xác nhận', render: function (x) { return '<div class="pf-ctl">' + veO(x) + '</div>'; } },
            { title: 'Kết quả xác nhận từ trường', width: '14%', prop: 'KETQUAXACNHAN_TEN' },
            { title: 'File minh chứng', width: '18%', render: function (x) { return laFile(x) ? '' : '<div data-mc="' + esc(e(x.ID)) + '"></div>'; } }
        );
        ui.table({
            el: q('bang'), rows: rows, columns: cot, empty: 'Không có thông tin nào', tableCls: 'ums-table--lined pf-bang',
            rowCls: function (x, i) { return (i > 0 && e(x.THUOCNHOM) !== e(rows[i - 1].THUOCNHOM)) ? 'pf-r--nhom' : ''; }
        });
        sauKhiVe(rows);
    }
    function khoaTep(x) { return svId() + e(x.ID); }
    function sauKhiVe(rows) {
        var bang = q('bang');
        ui.enhance(bang);
        rows.forEach(function (x) {
            var k = e(x.KIEUDULIEU).toUpperCase();
            if (k === 'LIST' && x.MABANGDANHMUC) {
                var s = bang.querySelector('select[data-m="' + e(x.ID) + '"]');
                if (s) ums.api.dm(e(x.MABANGDANHMUC)).then(function (d) {
                    pat.fill(s, d, { head: 'Chọn dữ liệu' }); s.value = s.getAttribute('data-v');
                }, function () { /* thiếu danh mục thì để trống như gốc */ });
            }
            var h = laFile(x) ? bang.querySelector('[data-mfile="' + e(x.ID) + '"]') : bang.querySelector('[data-mc="' + e(x.ID) + '"]');
            if (h) {
                var f = ums.files.mount(h, { api: 'SV_Files' });
                S.tep[e(x.ID)] = f;
                f.load(khoaTep(x));
            }
        });
        /* Tỉnh / Huyện / Xã cùng NHÓM thì nối tầng (gốc genDropTinhThanh) — luật cha → con */
        var dsTinh = rows.filter(function (x) { return e(x.KIEUDULIEU).toUpperCase() === 'TINH'; });
        if (!dsTinh.length) return;
        pat.dmTinhThanh().then(function (dm) {
            function con(cha) { return dm.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
            dsTinh.forEach(function (xt) {
                function oCua(kieu) {
                    var x = rows.filter(function (r) { return e(r.NHOM) === e(xt.NHOM) && e(r.KIEUDULIEU).toUpperCase() === kieu; })[0];
                    return x ? bang.querySelector('select[data-m="' + e(x.ID) + '"]') : null;
                }
                var t = oCua('TINH'), h = oCua('HUYEN'), xa = oCua('XA');
                if (!t) return;
                function nap(el, list) { if (!el) return; var v = el.getAttribute('data-v') || ''; pat.fill(el, list, { head: 'Chọn' }); el.value = v; }
                nap(t, con(null)); nap(h, t.value ? con(t.value) : []); nap(xa, h && h.value ? con(h.value) : []);
                t.addEventListener('change', function () {
                    if (h) { h.setAttribute('data-v', ''); pat.fill(h, t.value ? con(t.value) : [], { head: 'Chọn' }); h.value = ''; }
                    if (xa) { xa.setAttribute('data-v', ''); pat.fill(xa, [], { head: 'Chọn' }); xa.value = ''; }
                });
                if (h) h.addEventListener('change', function () {
                    if (xa) { xa.setAttribute('data-v', ''); pat.fill(xa, h.value ? con(h.value) : [], { head: 'Chọn' }); xa.value = ''; }
                });
                pat.chain([t, h, xa].filter(Boolean), { phatLai: false });
            });
        }, function (err) { ums.api.handle(err, 'danh mục tỉnh thành'); });
    }

    /* ---------- Lưu hồ sơ — gốc save_QuanLyHoSo cho từng trường -------- */
    function oVal(id) { var el = q('bang').querySelector('[data-m="' + id + '"]'); return el ? e(el.value) : ''; }
    function luuHoSo(btn) {
        if (!dangHien.length) { ui.toast('Không có thông tin nào để lưu', 'warn'); return; }
        btn.disabled = true;
        var kh = keHoach(), sv = svId();
        var viec = [];
        dangHien.forEach(function (x) {
            var gt = laFile(x) ? '' : oVal(e(x.ID));
            viec.push(function () {
                return goi('SV_KeHoach_DuLieu/ThemMoi', {
                    strChucNang_Id: cn(), strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: '', strQLSV_KeHoach_NguoiHoc_Id: kh,
                    strTruongThongTin_Id: e(x.ID),
                    strTruongThongTin_GiaTri: S.bcheck ? gt : e(x.TRUONGTHONGTIN_GIATRI),
                    strThongTinXacMinh: S.bcheck ? e(x.THONGTINXACMINH) : gt,
                    strNguoiThucHien_Id: uid()
                }, true).then(function (r) {
                    var f = S.tep[e(x.ID)];
                    return f ? Promise.resolve(f.save(khoaTep(x))).then(function () { return r; }) : r;
                });
            });
        });
        ui.batch(viec, { title: 'Đang lưu hồ sơ', okText: 'Cập nhật thành công' }).then(function () {
            btn.disabled = false; taiTruong();
        });
    }

    /* ---------- Biểu mẫu "Sinh viên" (gốc hộp #myModal) --------------- */
    function oF(k) { return elForm.querySelector('[data-f="' + k + '"]'); }
    function moForm(sua) {
        if (!sua && !keHoach()) { ui.toast('Chọn kế hoạch trước khi thêm sinh viên', 'warn'); return; }
        S.sua = !!sua;
        var sv = S.sv || {}, r = S.chon || {};
        q('ftitle').innerHTML = '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Sửa' : 'Thêm mới') + ' - Sinh viên';
        oF('strHoDem').value = sua ? e(sv.HODEM || r.QLSV_NGUOIHOC_HODEM) : '';
        oF('strTen').value = sua ? e(sv.TEN || r.QLSV_NGUOIHOC_TEN) : '';
        oF('strMaSo').value = sua ? e(sv.MASO || r.QLSV_NGUOIHOC_MASO) : '';
        elForm.querySelector('[data-a="fxoa"]').hidden = !sua;
        hienVung('form');
        oF('strHoDem').focus();
    }
    function dongForm() { hienVung(S.chon ? 'hs' : 'nhac'); }
    function luuSV() {
        var thieu = ['strTen', 'strMaSo'].filter(function (k) { return !oF(k).value.trim(); });
        if (thieu.length) { ui.toast('Nhập đủ Tên và Mã số', 'warn'); oF(thieu[0]).focus(); return; }
        var p = {
            strChucNang_Id: cn(), strHoDem: oF('strHoDem').value.trim(), strTen: oF('strTen').value.trim(), strMaSo: oF('strMaSo').value.trim(),
            strQLSV_KeHoach_NguoiHoc_Id: keHoach(), strNguoiThucHien_Id: uid()
        };
        if (S.sua) p.strId = svId();
        goi(S.sua ? 'SV_KeHoach_HoSo/CapNhat' : 'SV_KeHoach_HoSo/ThemMoi', p, true).then(function () {
            ui.toast(S.sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            var r = S.chon;
            dongForm();
            tai().then(function () {
                if (!r) return;
                var moi = S.rows.filter(function (x) { return e(x.ID) === e(r.ID); })[0];
                if (moi) chon(moi);
            });
        }).catch(function (err) { ums.api.handle(err, S.sua ? 'cập nhật sinh viên' : 'thêm sinh viên'); });
    }
    function xoaSV() {
        ui.confirm('Xoá sinh viên "' + tenSV() + '" khỏi kế hoạch?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            goi('SV_KeHoach_HoSo/Xoa', { strIds: svId(), strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }, true).then(function () {
                ui.toast('Xóa dữ liệu thành công!', 'ok');
                boChon(); tai();
            }).catch(function (err) { ums.api.handle(err, 'xoá sinh viên'); });
        });
    }

    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-qtab]');
        if (t && root.contains(t)) { chonTab(t.getAttribute('data-qtab')); return; }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-a')) {
            case 'them': moForm(false); break;
            case 'sua': moForm(true); break;
            case 'dong': boChon(); break;
            case 'luu': luuHoSo(b); break;
            case 'fdong': dongForm(); break;
            case 'fluu': luuSV(); break;
            case 'fxoa': xoaSV(); break;
        }
    });
})();
