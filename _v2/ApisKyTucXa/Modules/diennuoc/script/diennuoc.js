/* =========================================================================
   Quản lý điện - nước — chốt số điện / số nước theo phòng
   Bản gốc: ApisKyTucXa/Modules/diennuoc/html/diennuoc.html + script/diennuoc.js (917 dòng)
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái = ô tìm + Tòa nhà + "Danh sách phòng" (Tòa nhà - Phòng - Loại phòng - Tính chất,
   phân trang máy chủ 10 dòng); phải = "Phòng: <tên>" + hai khung cạnh nhau "Chốt số điện" | "Chốt số nước"
   (TT, Công tơ, Ngày chốt, Chỉ số đầu, Chỉ số cuối, Số sử dụng, Sửa, Xóa), Thêm mới / Sửa = biểu mẫu
   THAY CHỖ hai khung (gốc toggle_overide zonecontent) với Lưu và nhập tiếp / Lưu.
   Import (gốc getList_MauImport "zonebtnDN", chỉ có vùng Import) → ums.report.mount ở đầu trang, giấu nút Xuất báo cáo.

   Lời gọi (kiểu cũ, không mã hoá, tham số chép nguyên):
       KTX_ToaNha/LayDanhSach   GET  (ô Tòa nhà)
       KTX_Phong/LayDanhSach    GET  strTuKhoa, strKTX_ToaNha_Id, strPhanLoaiDoiTuong_Id '', strTangThu_Id '', strLoaiPhong_Id '',
                                     strTinhChat_Id '', strTinhTrang_Id '', pageIndex, pageSize
       KTX_TrangThietBi_ChiSoDien / KTX_TrangThietBi_ChiSoNuoc
           LayDanhSach  GET  strTuKhoa '', strKTX_CongToDien_Id | strKTX_CongToNuoc_Id '', strKTX_Phong_Id, pageIndex 1, pageSize 10000
           ThemMoi | CapNhat (có strId)  POST  strNgayLayThongTin, dChiSoDau, dChiSoGhiNhan,
                                              strKTX_CongToDien_Id | strKTX_CongToNuoc_Id = ID PHÒNG (gốc gửi me.strPhong_Id), strKTX_Phong_Id
           Xoa  POST strIds
       Cột: KTX_CONGTODIEN_MA | KTX_CONGTONUOC_MA, NGAYLAYTHONGTIN, CHISODAU, CHISOGHINHAN, SODIENSUDUNG | SONUOCSUDUNG

   Giữ như gốc:
     · strKTX_CongToDien_Id / strKTX_CongToNuoc_Id gửi id PHÒNG (procedure tự tra công tơ của phòng). KIỂM TRÊN HOST.
     · Ô "Công tơ" trong biểu mẫu chỉ hiện mã công tơ khi sửa (gốc là ô chữ không gửi đi).
   Khác gốc (lỗi rõ ràng, làm theo ý định):
     · Từ khoá: gốc nút kính lúp gọi getListCombo_Phong (đổ vào ô dropDienNuoc_Phong KHÔNG có), Enter gọi getList_Phong
       KHÔNG gửi từ khoá → không bao giờ tìm được. Bản mới gửi strTuKhoa cùng strKTX_ToaNha_Id vào KTX_Phong/LayDanhSach.
     · Sửa / đặt lại biểu mẫu nước: gốc ghi "Chỉ số đầu" vào ô txtDien_ChiSoDau của ĐIỆN → bản mới đổ đúng ô nước.
     · Bắt buộc Ngày chốt và Chỉ số cuối (arrValid gốc trỏ ô không có nên chưa từng kiểm).
     · Khung bên phải có nút Đóng về trạng thái chưa chọn phòng.
   Cố ý bỏ: .btnAddnew / .btnClose / tblTChotSoDien / me.rewrite / toggle_list (không có trên màn, hàm không tồn tại);
   khối kiểm "ngày bắt đầu > hôm nay" đã bị chú thích trong gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function tenPhong(p) { return [e(p.KTX_TOANHA_TEN), e(p.TEN), e(p.LOAIPHONG_TEN), e(p.TINHCHAT_TEN)].join(' - '); }

    var root = document.getElementById('ktx-diennuoc');
    var st = { page: 1, size: 10, total: 0, rows: [], phong: null };

    var m = pat.master({
        el: root,
        title: 'Quản lý điện - nước',
        actions: '<span data-z="imp"></span>',
        side: {
            title: 'Danh sách phòng', icon: 'fa-hard-drive', search: 'Nhập từ khóa tìm kiếm',
            filter: '<div class="ums-field"><select class="ums-select" data-f="toanha" data-ph="--Chọn tòa nhà--"><option value="">--Chọn tòa nhà--</option></select></div>'
        },
        main: { title: false }
    });
    ui.enhance(root);
    var fToaNha = root.querySelector('[data-f="toanha"]');
    ums.api.call({ action: 'KTX_ToaNha/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_ToaNha_Id: '', strLoaiToaNha_Id: '', strViTriCauThang_Id: '',
        strPhanLoaiDoiTuong_Id: '', strTangThu_Id: '', strLoaiPhong_Id: '', strTinhChat_Id: '', strTinhTrang_Id: '', pageIndex: 1, pageSize: 10, silent: true })
        .then(function (r) { pat.fill(fToaNha, arr(r.data), { head: '--Chọn tòa nhà--' }); }, function (err) { ums.api.handle(err, 'danh sách tòa nhà'); });

    /* Import (chỉ Import như gốc — vùng báo cáo không có trên màn) */
    ums.report.mount(root.querySelector('[data-z="imp"]'), {
        onImported: function () { if (st.phong) { taiDien(); taiNuoc(); } },
        onLoad: function () { var rp = root.querySelector('[data-z="imp"] [data-drop="report"]'); if (rp) rp.hidden = true; }
    });

    /* ---------- Cột trái: danh sách phòng ---------- */
    function veDs() {
        m.sideCount.textContent = '(' + st.total + ')';
        m.sideBody.innerHTML = st.rows.length ? st.rows.map(function (p) {
            return pat.masterItem({ id: p.ID, text: tenPhong(p), active: !!st.phong && st.phong.ID === p.ID });
        }).join('') : ui.empty('Không có phòng', 'fa-inbox');
        m.setPage({ index: st.page, size: st.size, total: st.total, shown: st.rows.length,
            onChange: function (p) { tai(p); }, onSize: function (s) { st.size = s; tai(1); } });
    }
    var token = 0;
    function tai(p) {
        st.page = p || 1;
        var t = ++token;
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'KTX_Phong/LayDanhSach', method: 'GET', strTuKhoa: (m.search.value || '').trim(), strKTX_ToaNha_Id: fToaNha.value || '',
            strPhanLoaiDoiTuong_Id: '', strTangThu_Id: '', strLoaiPhong_Id: '', strTinhChat_Id: '', strTinhTrang_Id: '', pageIndex: st.page, pageSize: st.size })
            .then(function (r) {
                if (t !== token) return;
                st.rows = arr(r.data); st.total = Number(r.pager) || st.rows.length; veDs();
            }).catch(function (err) {
                if (t !== token) return;
                st.rows = []; st.total = 0; m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phòng');
            });
    }

    /* ---------- Khung bên phải ---------- */
    var main = m.mainBody;
    var LOAI = {
        dien: { ctrl: 'KTX_TrangThietBi_ChiSoDien', ten: 'Chốt số điện', icon: 'fa-bolt', maCot: 'KTX_CONGTODIEN_MA', suDung: 'SODIENSUDUNG', congTo: 'strKTX_CongToDien_Id', z: 'bangDien' },
        nuoc: { ctrl: 'KTX_TrangThietBi_ChiSoNuoc', ten: 'Chốt số nước', icon: 'fa-droplet', maCot: 'KTX_CONGTONUOC_MA', suDung: 'SONUOCSUDUNG', congTo: 'strKTX_CongToNuoc_Id', z: 'bangNuoc' }
    };
    var DL = { dien: [], nuoc: [] };

    function nhac() {
        st.phong = null;
        main.innerHTML = pat.panel({ title: 'Phòng', icon: 'fa-door-open', body: ui.empty('Chọn một phòng ở cột trái để xem chỉ số điện - nước', 'fa-bolt') });
    }
    function dungKhung(p) {
        function khung(k) {
            var L = LOAI[k];
            return pat.panel({ title: L.ten, icon: L.icon, flush: true, zone: L.z, count: L.z + 'Dem',
                tools: ui.btn('add', { attr: { 'data-a': 'them', 'data-loai': k } }) });
        }
        main.innerHTML =
            '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-door-open"></i> Phòng: ' +
            '<span class="ums-u-blue">' + esc(tenPhong(p)) + '</span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) + '</div></div></div>' +
            '<div class="ktx-dn-hai ums-u-mt-4" data-z="hai">' + khung('dien') + khung('nuoc') + '</div>';
    }
    function veBang(k) {
        var L = LOAI[k], host = main.querySelector('[data-z="' + L.z + '"]');
        if (!host) return;
        var dem = main.querySelector('[data-z="' + L.z + 'Dem"]'); if (dem) dem.textContent = '(' + DL[k].length + ')';
        ui.table({
            el: host, rows: DL[k], empty: 'Chưa có lần chốt nào', tableCls: 'ums-table--lined ums-table--tight',
            columns: [
                { title: 'Công tơ', prop: L.maCot, cls: 'is-center is-nowrap' },
                { title: 'Ngày chốt', prop: 'NGAYLAYTHONGTIN', cls: 'is-center is-nowrap' },
                { title: 'Chỉ số đầu', prop: 'CHISODAU', cls: 'is-center' },
                { title: 'Chỉ số cuối', prop: 'CHISOGHINHAN', cls: 'is-center' },
                { title: 'Số sử dụng', prop: L.suDung, cls: 'is-center' },
                { title: 'Thao tác', cls: 'is-center is-nowrap is-actions', render: function (r) { return ui.actions(r.ID, ['edit', 'del']); } }
            ]
        });
    }
    function taiLoai(k) {
        var L = LOAI[k], host = main.querySelector('[data-z="' + L.z + '"]');
        if (!host || !st.phong) return Promise.resolve();
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var c = { action: L.ctrl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_Phong_Id: st.phong.ID, pageIndex: 1, pageSize: 10000 };
        c[L.congTo] = '';
        return ums.api.call(c).then(function (r) { DL[k] = arr(r.data); veBang(k); })
            .catch(function (err) { DL[k] = []; host.innerHTML = ui.fail(err.message); ums.api.handle(err, L.ten.toLowerCase()); });
    }
    function taiDien() { return taiLoai('dien'); }
    function taiNuoc() { return taiLoai('nuoc'); }
    function chonPhong(id) {
        var p = st.rows.filter(function (x) { return x.ID === id; })[0];
        if (!p) return;
        st.phong = p; veDs(); dungKhung(p);
        taiDien(); taiNuoc();
    }

    /* ---------- Biểu mẫu thêm / sửa (thay chỗ hai khung) ---------- */
    function fld(label, ctl, req) { return '<div>' + ui.field(label, ctl, { required: req }) + '</div>'; }
    function moForm(k, rec) {
        var L = LOAI[k];
        var body =
            fld('Công tơ', '<div class="ums-kv"><b data-k="congTo">' + esc(rec ? e(rec[L.maCot]) : '') + '</b></div>') +
            fld('Ngày chốt', '<div class="ums-inputwrap"><input class="ums-input" data-k="strNgayLayThongTin" data-date placeholder="Nhập ngày chốt số ' +
                (k === 'dien' ? 'điện' : 'nước') + '" autocomplete="off" value="' + esc(rec ? e(rec.NGAYLAYTHONGTIN) : '') + '"><i class="fa-light fa-calendar"></i></div>', true) +
            fld('Chỉ số đầu', '<input class="ums-input" type="number" data-k="dChiSoDau" autocomplete="off" value="' + esc(rec ? e(rec.CHISODAU) : '') + '">') +
            fld(k === 'dien' ? 'Chỉ số cuối' : 'Chỉ số chốt', '<input class="ums-input" type="number" data-k="dChiSoGhiNhan" autocomplete="off" value="' + esc(rec ? e(rec.CHISOGHINHAN) : '') + '">', true);
        var ft = pat.formTrang({
            host: main, title: (rec ? 'Chỉnh sửa ' : 'Thêm ') + L.ten.toLowerCase(), icon: rec ? 'fa-pen-to-square' : 'fa-plus', body: body,
            buttons: [
                { text: 'Lưu và nhập tiếp', kind: 'save', mod: 'out-success', keepOpen: true, onClick: function (api) { luu(api, true); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function (api) { luu(api, false); return false; } }
            ]
        });
        function q(key) { return ft.body.querySelector('[data-k="' + key + '"]'); }
        function val(key) { var el = q(key); return el ? (el.value || '').trim() : ''; }
        function luu(api, tiep) {
            if (!val('strNgayLayThongTin')) { ui.toast('Chưa nhập Ngày chốt', 'warn'); q('strNgayLayThongTin').focus(); return; }
            if (!val('dChiSoGhiNhan')) { ui.toast('Chưa nhập ' + (k === 'dien' ? 'Chỉ số cuối' : 'Chỉ số chốt'), 'warn'); q('dChiSoGhiNhan').focus(); return; }
            var c = { action: L.ctrl + (rec ? '/CapNhat' : '/ThemMoi'), method: 'POST', strId: rec ? rec.ID : '',
                strNgayLayThongTin: val('strNgayLayThongTin'), dChiSoDau: val('dChiSoDau'), dChiSoGhiNhan: val('dChiSoGhiNhan'), strKTX_Phong_Id: st.phong.ID, strNguoiThucHien_Id: uid() };
            c[L.congTo] = st.phong.ID;
            ums.api.call(c).then(function () {
                ui.toast(rec ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                if (tiep && !rec) {
                    ['strNgayLayThongTin', 'dChiSoDau', 'dChiSoGhiNhan'].forEach(function (key) { var el = q(key); if (el) el.value = ''; });
                    q('strNgayLayThongTin').focus();
                } else api.close();
                return taiLoai(k);
            }).catch(function (err) { ums.api.handle(err, 'lưu ' + L.ten.toLowerCase()); });
        }
        ui.enhance(ft.body);
        var dau = q('strNgayLayThongTin'); if (dau) dau.focus();
    }
    function xoa(k, id) {
        var L = LOAI[k];
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: L.ctrl + '/Xoa', method: 'POST', strIds: id, strNguoiThucHien_Id: uid() })
                .then(function (r) { ui.toast(r.message || 'Xóa dữ liệu thành công!', 'ok'); return taiLoai(k); });
        }).catch(function (err) { ums.api.handle(err, 'xoá ' + L.ten.toLowerCase()); });
    }

    /* ---------- Sự kiện ---------- */
    m.sideBody.addEventListener('click', function (ev) {
        var it = ev.target.closest('[data-id]');
        if (it && m.sideBody.contains(it)) chonPhong(it.getAttribute('data-id'));
    });
    main.addEventListener('click', function (ev) {
        if (ev.target.closest('.ums-formtrang')) return;
        var b = ev.target.closest('[data-a], [data-act]');
        if (!b || !main.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') { nhac(); veDs(); return; }
        if (a === 'them') { moForm(b.getAttribute('data-loai'), null); return; }
        var act = b.getAttribute('data-act');
        if (!act) return;
        var k = b.closest('[data-z="bangDien"]') ? 'dien' : 'nuoc';
        var id = b.getAttribute('data-id');
        var rec = DL[k].filter(function (x) { return x.ID === id; })[0];
        if (act === 'edit' && rec) moForm(k, rec);
        if (act === 'del') xoa(k, id);
    });
    m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
    if (window.jQuery) jQuery(fToaNha).on('select2:select select2:clear', function () { tai(1); });

    pat.cotTrai(m, { tai: tai, tuTaiLoc: false });
    nhac();
    tai(1);
})();
