/* =========================================================================
   Bảng điều khiển (cổng cán bộ) — lời chào, lối tắt chức năng, giới thiệu trường, tin tức mới.
   Bản gốc: ApisCongCanBo/Modules/dashboard/html/dashboard.html + script/dashboard.js
   ---------------------------------------------------------------------------
   Lời gọi (mã hoá, POST — chép nguyên):
     CMS_QuanLyNguoiDung_MH/…  pkg_chung_quanlynguoidung.LayDSChucNangTheoPhanLoai { strNguoiDung_Id, strPhanLoai_Id '' }
         → lưới lối tắt: CHUCNANG_ID, CHUCNANG_TEN, CHUCNANG_TENANH (ảnh), viền 8 màu xoay vòng như gốc
     CMS_Chung_MH/…            pkg_chung.LayDSCauHinh { strLoaiCauHinh 'APP_HOME', strDinhDanh '' }
         → khối "Giới thiệu" chỉ hiện khi có APP_LOGO_WEB (logo), APP_TENTRUONG, APP_NDGT (HTML quản trị nhập)
     TS_TinTuc_MH/…            pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung { strTuKhoa '', strTuNgay '', strDenNgay '',
         strNguoiThucHien_Id, strChuyenMuc_Id '', strChung_UngDung_Id = vai trò đang mở, dTinQuanTrong -1,
         strDaoTao_CoCauToChuc_Id '', dHieuLuc 1, pageIndex 1, pageSize 30 }
         → dải tin (ảnh DUONGDANANHHIENTHI, mặc định /Core/images/thongbao.jpg trên máy chủ tệp; TIEUDE)
   Bấm một tin / "Xem tất cả" → mở chức năng mã hiển thị "#tintuc" (ums.app.openHash); tin bấm được
     truyền qua ums.state.moTin, màn Tin tức mở ngay tin đó (gốc: main_doc.DashBoard.objTinTuc).
   Khác bản gốc (ghi ở can-quyet.js):
     · Khối "Bạn bè" và "Dịch vụ" gốc chỉ có tiêu đề (nội dung bị chú thích bỏ, không có lời gọi) → không vẽ.
     · strPhanLoai_Id / strDinhDanh / ô từ khoá tin gốc đọc ô KHÔNG tồn tại → gửi rỗng như gốc.
     · Dải tin trượt (slick) → dải cuộn ngang. Lối tắt gốc có lớp .chucnang nhưng màn không gắn xử lý bấm →
       nay bấm là mở chức năng đó.
     · Ảnh lối tắt / logo là đường dẫn tương đối tính từ gốc ứng dụng → bản mới (nằm trong _v2/) thêm "../".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dashboard');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    /** Đường dẫn ảnh cấu hình: tuyệt đối giữ nguyên; tương đối tính từ gốc ứng dụng (bản mới nằm trong _v2/) */
    function anhUngDung(p) { p = e(p); return !p || /^(https?:|\/|data:)/i.test(p) ? p : '../' + p; }
    var MAU = ['#26465e', '#7aacf3', '#d36f51', '#0232b9', '#a12529', '#71b636', '#f94341', '#f6c531'];

    root.innerHTML =
        '<p class="db-chao">Xin chào!</p>' +
        '<div class="db-luoi" data-z="luoi"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div></div>' +
        '<div class="db-hai">' +
            '<div data-z="gt" hidden>' + pat.panel({ title: 'Giới thiệu', icon: 'fa-building-columns', body:
                '<div class="db-gt"><div class="db-gt__logo" data-z="logo"></div><div><h3 class="db-gt__ten" data-z="ten"></h3><div class="db-gt__nd" data-z="nd"></div></div></div>' }) + '</div>' +
            pat.panel({ title: 'Tin tức', icon: 'fa-newspaper', tools: ui.btn('search', { text: 'Xem tất cả', mod: 'ghost', icon: 'fa-arrow-right', attr: { 'data-a': 'tatca' } }),
                body: '<div class="db-tin" data-z="tin"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div></div>' }) +
        '</div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var dsTin = [];

    /* ---------- Lối tắt chức năng ---------- */
    ums.api.call({ action: 'CMS_QuanLyNguoiDung_MH/DSA4BRICKTQiDyAvJhUpJC4RKSAvDS4gKAPP', func: 'pkg_chung_quanlynguoidung.LayDSChucNangTheoPhanLoai',
        strNguoiDung_Id: uid(), strPhanLoai_Id: '' }).then(function (r) {
        var d = arr(r.data);
        z('luoi').innerHTML = d.length ? d.map(function (x, i) {
            var a = e(x.CHUCNANG_TENANH);
            var hinh = /^fa[a-z-]*\s/.test(a) ? '<i class="' + esc(ums.iconFA4 ? ums.iconFA4(a) : a) + ' db-o__ic"></i>'
                : a ? '<img alt="" src="' + esc(anhUngDung(a)) + '" onerror="this.replaceWith(Object.assign(document.createElement(\'i\'),{className:\'fa-light fa-grid-2 db-o__ic\'}))">'
                : '<i class="fa-light fa-grid-2 db-o__ic"></i>';
            return '<a class="db-o" href="' + esc(ums.app.hrefChucNang(e(x.CHUCNANG_ID))) + '" style="border-color:' + MAU[i % 8] + '">' +
                '<span class="db-o__hinh">' + hinh + '</span><span class="db-o__ten">' + esc(e(x.CHUCNANG_TEN)) + '</span></a>';
        }).join('') : '';
        z('luoi').hidden = !d.length;
    }).catch(function (err) { z('luoi').hidden = true; ums.api.handle(err, 'chức năng'); });

    /* ---------- Giới thiệu (cấu hình APP_HOME) ---------- */
    ums.api.call({ action: 'CMS_Chung_MH/DSA4BRICIDQJKC8p', func: 'pkg_chung.LayDSCauHinh', strLoaiCauHinh: 'APP_HOME', strDinhDanh: '', silent: true })
        .then(function (r) {
            var ch = {};
            arr(r.data).forEach(function (x) { ch[e(x.DINHDANH)] = x.DULIEU; });
            if (!ch.APP_LOGO_WEB) return;
            z('gt').hidden = false;
            z('logo').innerHTML = '<img alt="" src="' + esc(anhUngDung(ch.APP_LOGO_WEB)) + '">';
            z('ten').textContent = e(ch.APP_TENTRUONG);
            z('nd').innerHTML = e(ch.APP_NDGT);       // HTML do quản trị nhập ở cấu hình — hiện nguyên như gốc
        }).catch(function () { /* không có cấu hình thì bỏ khối giới thiệu, như gốc */ });

    /* ---------- Tin tức ---------- */
    function anhTin(p) { p = e(p) || '/Core/images/thongbao.jpg'; return (ums.session.rootPathUpload || '') + '/' + p.replace(/^\/+/, ''); }
    ums.api.call({ action: 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4PJjQuKAU0LyYP', func: 'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung',
        strTuKhoa: '', strTuNgay: '', strDenNgay: '', strNguoiThucHien_Id: uid(), strChuyenMuc_Id: '', strChung_UngDung_Id: (ums.state && ums.state.roleId) || '',
        dTinQuanTrong: -1, strDaoTao_CoCauToChuc_Id: '', dHieuLuc: 1, pageIndex: 1, pageSize: 30 }).then(function (r) {
        dsTin = arr(r.data);
        z('tin').innerHTML = dsTin.length ? dsTin.map(function (x, i) {
            return '<button type="button" class="db-tin__the" data-tin="' + i + '"><span class="db-tin__anh"><img alt="" src="' + esc(anhTin(x.DUONGDANANHHIENTHI)) +
                '" onerror="this.remove()"><i class="fa-light fa-newspaper"></i></span><span class="db-tin__td">' + esc(e(x.TIEUDE)) + '</span></button>';
        }).join('') : ui.empty('Chưa có tin nào', 'fa-newspaper');
    }).catch(function (err) { z('tin').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tin tức'); });

    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-tin]');
        if (t) { ums.state.moTin = dsTin[Number(t.getAttribute('data-tin'))]; ums.app.openHash('#tintuc'); return; }
        if (ev.target.closest('[data-a="tatca"]')) ums.app.openHash('#tintuc');
    });
})();
