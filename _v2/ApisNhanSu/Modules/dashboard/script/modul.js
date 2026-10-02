/* =========================================================================
   Modul — lưới ứng dụng và chức năng của người dùng (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/dashboard/html/modul.html + script/modul.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc: "Chào mừng bạn" · "Modul" · lưới thẻ ỨNG DỤNG (mỗi thẻ: tối đa 4 biểu tượng chức năng cấp 1,
   hai lối "Yêu thích" / "All", tên ứng dụng). Bấm vùng hai lối → ẩn lưới, hiện các chức năng cấp 1 của ứng dụng,
   mỗi chức năng có nút tim (Thêm / Bỏ yêu thích). Chỉ một ứng dụng thì tự mở luôn. Khối "For you today" gốc để
   display:none (thẻ mẫu viết cứng) → không vẽ.
   Lời gọi (kiểu cũ, GET — chép nguyên):
     CMS_Quyen/LayDSUngDungTheoNguoiDung_Id   strNguoiDung_Id, strVeVaoCua 'APP_AURORA', strNgonNgu_Id '' (ô dropAAAA)
         → ID, TENUNGDUNG, TENANH, MAUNGDUNG
     CMS_Quyen/LayDSChucNangTheoNguoiDung_Id  strNguoiDung_Id, strUngDung_Id '', strNgonNgu_Id ''
         → ID, CHUNG_UNGDUNG_ID, CHUCNANGCHA_ID, TENCHUCNANG, TENANH, DUONGDANFILE, YEUTHICH
     CMS_NguoiDung/Them_ChucNang_ThuongDung   POST strChucNang_Id, strNguoiDung_Id, strNguoiThucHien_Id
     CMS_NguoiDung/Xoa_ChucNang_ThuongDung    POST (như trên)
   Mở chức năng (edu.system.initMain): chức năng không có DUONGDANFILE thì mở chức năng con đầu tiên (như gốc);
   bản mới chuyển sang #/r/<CHUNG_UNGDUNG_ID>/<ID> (appId của hệ = vai trò — CLAUDE.md mục 4).
   Khác gốc (ghi báo cáo):
     · Bỏ yêu thích xong gốc gọi me.getList_ChucNangTheoPhanLoai — hàm KHÔNG có trong tệp này → lỗi JS, màn không
       cập nhật. Nay nạp lại danh sách chức năng như khi Thêm yêu thích.
     · Màu thẻ chức năng gốc ngẫu nhiên mỗi lần vẽ (data-bg random) → nay xoay vòng cố định theo thứ tự.
     · Biểu tượng TENANH qua ums.iconFA4; TENANH là tệp .svg thì vẽ ảnh như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-modul');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    var TONE = ['blue', 'green', 'purple', 'amber', 'red', 'slate'];

    root.innerHTML = '<p class="nsdb-chao">Chào mừng bạn</p>' + pat.page('Modul') +
        '<div data-z="ud"><div class="ums-grid ums-grid--cards" data-z="luoi">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div></div>' +
        '<div data-z="cn" hidden>' + pat.panel({ title: '', icon: 'fa-grid-2', zone: 'cnBody',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) + '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var S = { ud: [], cn: [], mo: null };

    function bieuTuong(t, cls) {
        t = e(t);
        if (t.indexOf('.svg') >= 0) return '<img alt="" src="' + ui.esc(/^(https?:|\/)/.test(t) ? t : '../' + t) + '" class="' + (cls || '') + '">';
        return '<i class="' + ui.esc((ums.iconFA4 ? ums.iconFA4(t) : t) || 'fa-light fa-grid-2') + (cls ? ' ' + cls : '') + '"></i>';
    }
    function cap1(udId) { return S.cn.filter(function (x) { return x.CHUNG_UNGDUNG_ID == udId && !x.CHUCNANGCHA_ID; }); }
    function href(cn) {
        var dich = cn;
        if (!cn.DUONGDANFILE) dich = S.cn.filter(function (x) { return x.CHUCNANGCHA_ID == cn.ID; })[0] || cn;
        return '#/r/' + encodeURIComponent(e(dich.CHUNG_UNGDUNG_ID || cn.CHUNG_UNGDUNG_ID)) + '/' + encodeURIComponent(e(dich.ID));
    }

    /* ---------- Lưới ứng dụng (genTable_UngDung) ---------- */
    function veUngDung() {
        z('luoi').innerHTML = S.ud.length ? S.ud.map(function (u) {
            var cns = cap1(u.ID).slice(0, 4);
            return '<div class="ums-panel nsdb-ud">' +
                '<div class="nsdb-ud__icons">' + cns.map(function (c) {
                    return '<a href="' + ui.esc(href(c)) + '" title="' + ui.esc(e(c.TENCHUCNANG)) + '">' + bieuTuong(c.TENANH) + '</a>';
                }).join('') + '</div>' +
                '<div class="nsdb-ud__lien">' +
                    ui.btn('view', { text: 'Yêu thích', mod: 'out-primary', icon: 'fa-heart-circle-check', cls: 'ums-btn--sm', attr: { 'data-ud': u.ID } }) +
                    ui.btn('view', { text: 'All', mod: 'out-primary', icon: 'fa-grid-2', cls: 'ums-btn--sm', attr: { 'data-ud': u.ID } }) +
                '</div>' +
                '<div class="nsdb-ud__ten">' + bieuTuong(u.TENANH) + ' ' + ui.esc(e(u.TENUNGDUNG)) + '</div></div>';
        }).join('') : ui.empty('Bạn chưa có chức năng nào? Hãy liên hệ admin!', 'fa-grid-2');
        if (S.ud.length === 1) moUngDung(S.ud[0].ID);
    }

    /* ---------- Chức năng cấp 1 của một ứng dụng ---------- */
    function moUngDung(id) {
        S.mo = id;
        var u = S.ud.filter(function (x) { return x.ID == id; })[0] || {};
        z('cn').querySelector('.ums-panel__title').innerHTML = bieuTuong(u.TENANH) + ' ' + ui.esc(e(u.TENUNGDUNG));
        veChucNang();
        z('ud').hidden = true;
        z('cn').hidden = false;
    }
    function veChucNang() {
        var ds = cap1(S.mo);
        z('cnBody').innerHTML = ds.length ? '<div class="ums-grid ums-grid--tiles">' + ds.map(function (c, i) {
            var yt = !!c.YEUTHICH;
            return '<div class="nsdb-cn">' +
                '<button type="button" class="ums-iconbtn nsdb-cn__tim" data-yt="' + ui.esc(c.ID) + '" data-co="' + (yt ? 1 : 0) + '" title="' + (yt ? 'Bỏ yêu thích' : 'Thêm yêu thích') + '">' +
                '<i class="' + (yt ? 'fa-solid' : 'fa-light') + ' fa-heart"></i></button>' +
                ui.tile({ name: e(c.TENCHUCNANG), icon: (ums.iconFA4 ? ums.iconFA4(e(c.TENANH)) : e(c.TENANH)) || 'fa-light fa-grid-2', tone: TONE[i % TONE.length], href: href(c) }) +
                '</div>';
        }).join('') + '</div>' : ui.empty('Ứng dụng chưa có chức năng nào');
    }

    /* ---------- Nạp ---------- */
    function napChucNang() {
        return ums.api.call({ action: 'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id', method: 'GET', strNguoiDung_Id: uid(), strUngDung_Id: '', strNgonNgu_Id: '' })
            .then(function (r) { S.cn = arr(r); });
    }
    ums.api.call({ action: 'CMS_Quyen/LayDSUngDungTheoNguoiDung_Id', method: 'GET', strNguoiDung_Id: uid(), strVeVaoCua: 'APP_AURORA', strNgonNgu_Id: '' })
        .then(function (r) {
            S.ud = arr(r);
            if (!S.ud.length) ui.toast('Bạn chưa có chức năng nào? Hãy liên hệ admin!', 'warn');
            return napChucNang();
        }).then(veUngDung)
        .catch(function (err) { z('luoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'CMS_Quyen'); });

    function yeuThich(id, co) {
        var act = co ? 'CMS_NguoiDung/Xoa_ChucNang_ThuongDung' : 'CMS_NguoiDung/Them_ChucNang_ThuongDung';
        ums.api.call({ action: act, strChucNang_Id: id, strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid() }).then(function () {
            if (!co) ui.toast('Thêm mới thành công!', 'ok');
            return napChucNang().then(veChucNang);
        }).catch(function (err) { ums.api.handle(err, act); });
    }

    root.addEventListener('click', function (ev) {
        var yt = ev.target.closest('[data-yt]');
        if (yt && root.contains(yt)) { yeuThich(yt.getAttribute('data-yt'), yt.getAttribute('data-co') === '1'); return; }
        var ud = ev.target.closest('[data-ud]');
        if (ud && root.contains(ud)) { moUngDung(ud.getAttribute('data-ud')); return; }
        if (ev.target.closest('[data-a="dong"]')) { z('cn').hidden = true; z('ud').hidden = false; }
    });
})();
