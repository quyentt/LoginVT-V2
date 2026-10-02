/* =========================================================================
   Trang chính — Cổng sinh viên (bảng điều khiển)
   (vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/dashboard/html/dashboard.html
            + script/dashboard.js (lớp DashBoard, vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục theo bản gốc SAU lần kéo 4 (kho gốc 30/09/2026), MỘT cột:
     dải chào (db-hero: "Chào buổi sáng/trưa/chiều/tối," + họ tên + thứ, ngày)
     → lưới 4 lối tắt cố định (#dbQuickAccess .db-quick-card[data-goto])
     → tin tức chia BA NHÓM (#zoneTinTucHome): Tin nhà trường · Tin đào tạo ·
       Hoạt động sinh viên, mỗi nhóm 3 tin + "Xem tất cả".
   Phân nhóm + vẽ nhóm dùng CHUNG với màn Tin tức: ums.csvTinTuc.phanNhom / nhomHtml
   (tintuc/script/_tintuc.js, css tintuc/css/tintuc.css — html màn này nạp cả hai),
   không chép lại hàm classify_TinTuc.

   Lời gọi (chép nguyên action / func / tên tham số / tên cột):
     TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4PJjQuKAU0LyYP
         pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung { strTuKhoa '', strTuNgay '',
         strDenNgay '', strChuyenMuc_Id '', strChung_UngDung_Id = vai trò đang mở
         (bản gốc edu.system.appId — chính là VaiTro_Id), dTinQuanTrong -1,
         strDaoTao_CoCauToChuc_Id '', dHieuLuc 1, pageIndex 1, pageSize 30 }
         → TIEUDE · NGAYBATDAU (hoặc NGAYTAO_DD_MM_YYYY) · DAOTAO_COCAUTOCHUC_TEN
   Bấm một tin / "Xem tất cả" → mở chức năng có mã hiển thị "#tintuc"
   (ums.app.openHash, thay edu.system.triggerChucNang_MaHienThi); tin được bấm
   truyền qua ums.state.moTin để màn Tin tức mở ngay tin đó (gốc: objTinTuc).
   Lối tắt: mã hiển thị #dangkyhoc · #thoikhoabieu · #taichinh · #tintuc (chép nguyên
   data-goto của gốc) → ums.app.openHash; vai trò chưa được cấp mã đó thì báo.

   Khác bản gốc:
     · Kho gốc 30/09/2026 GIẤU (display:none, vẫn gọi máy chủ) lưới lối tắt theo phân
       loại (#zonedashbroad — LayDSChucNangTheoPhanLoai), khối "Giới thiệu" (LayDSCauHinh
       _HOME) và dải tin trượt cũ → bản mới bỏ hẳn, KHÔNG gọi hai lời gọi đó nữa.
     · Khối "Sự kiện sắp tới" (#dbEvents) của gốc là khung tĩnh luôn "Chưa có sự kiện
       nào", không lời gọi nào đổ dữ liệu → không vẽ.
     · Họ tên trên dải chào: gốc đọc chữ #lblHoTenNguoiDangNhap của vỏ; bản mới lấy
       tên người học đang thủ vai (ums.thuVai), không thủ vai thì lấy tên trên thanh
       trên (#userName); không có thì "Sinh viên" như gốc.
     · Lời chào tính theo giờ Việt Nam (Asia/Ho_Chi_Minh) như gốc.
     · Hai khối "Bạn bè" và "Dịch vụ" của bản gốc (vốn đã bị giấu) không vẽ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var root = document.getElementById('svdb');
    if (!root) return;
    var TT = ums.csvTinTuc;

    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    /* ---------- Dải chào (db-hero) ---------------------------------------- */
    function tenNguoi() {
        var tv = ums.thuVai && ums.thuVai.hienTai && ums.thuVai.hienTai(ums.state && ums.state.roleId);
        if (tv && tv.info && tv.info.ten) return tv.info.ten;
        var el = document.getElementById('userName');
        return (el && el.textContent.trim()) || 'Sinh viên';
    }
    function loiChao() {
        var now = new Date(), gio;
        try { gio = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', hour12: false }), 10); }
        catch (x) { gio = now.getHours(); }
        var chao = gio >= 5 && gio < 11 ? 'Chào buổi sáng'
                 : gio >= 11 && gio < 13 ? 'Chào buổi trưa'
                 : gio >= 13 && gio < 18 ? 'Chào buổi chiều'
                 : gio >= 18 && gio < 22 ? 'Chào buổi tối' : 'Chào bạn';
        var thu = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][now.getDay()];
        function p2(n) { return (n < 10 ? '0' : '') + n; }
        return { chao: chao + ',', ngay: thu + ', ngày ' + p2(now.getDate()) + '/' + p2(now.getMonth() + 1) + '/' + now.getFullYear() };
    }

    /* ---------- Lối tắt cố định (#dbQuickAccess) — chép nguyên gốc -------- */
    var LOI_TAT = [
        { ma: '#dangkyhoc', nhan: 'Học tập', ten: 'Đăng ký học', icon: 'fa-book-open-reader', mau: 'c1' },
        { ma: '#thoikhoabieu', nhan: 'Lịch', ten: 'Thời khóa biểu', icon: 'fa-calendar-week', mau: 'c2' },
        { ma: '#taichinh', nhan: 'Tài chính', ten: 'Học phí', icon: 'fa-wallet', mau: 'c3' },
        { ma: '#tintuc', nhan: 'Thông tin', ten: 'Tin tức & thông báo', icon: 'fa-newspaper', mau: 'c4' }
    ];

    var lc = loiChao();
    root.innerHTML =
        '<div class="svdb-hero">' +
            '<div class="svdb-hero__chu">' +
                '<p class="svdb-hero__chao">' + esc(lc.chao) + '</p>' +
                '<h2 class="svdb-hero__ten">' + esc(tenNguoi()) + '</h2>' +
                '<p class="svdb-hero__ngay"><i class="fa-light fa-calendar"></i> ' + esc(lc.ngay) + '</p>' +
            '</div>' +
            '<span class="svdb-hero__ic"><i class="fa-light fa-graduation-cap"></i></span>' +
        '</div>' +
        '<div class="svdb-nhanh">' + LOI_TAT.map(function (x) {
            return '<button type="button" class="svdb-nhanh__the" data-goto="' + esc(x.ma) + '">' +
                '<span class="svdb-nhanh__ic svdb-nhanh__ic--' + x.mau + '"><i class="fa-light ' + x.icon + '"></i></span>' +
                '<span class="svdb-nhanh__chu"><span class="svdb-nhanh__nhan">' + esc(x.nhan) + '</span>' +
                '<b class="svdb-nhanh__ten">' + esc(x.ten) + '</b></span></button>';
        }).join('') + '</div>' +
        '<div class="svdb-tin" data-z="tin"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div></div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var dsTin = [];

    /* ---------- Tin tức ba nhóm — getList_TinTuc → genTable_TinTuc_Home --- */
    function veTin() {
        var g = TT.chiaNhom(dsTin);
        z('tin').innerHTML = TT.NHOM.map(function (n) {
            return TT.nhomHtml(n.ten, g[n.key], { xem: 3, them: 'tatCa' });
        }).join('');
    }
    ums.api.call({
        action: 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4PJjQuKAU0LyYP',
        func: 'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung',
        strTuKhoa: '', strTuNgay: '', strDenNgay: '', strChuyenMuc_Id: '',
        strChung_UngDung_Id: (ums.state && ums.state.roleId) || '',
        dTinQuanTrong: -1, strDaoTao_CoCauToChuc_Id: '', dHieuLuc: 1, pageIndex: 1, pageSize: 30
    }).then(function (r) { dsTin = arr(r.data); veTin(); })
      .catch(function (err) { z('tin').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tin tức'); });

    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-tin]');
        if (t) {
            var id = t.getAttribute('data-tin');
            ums.state.moTin = dsTin.filter(function (x) { return e(x.ID) === id; })[0];
            if (!ums.app.openHash('#tintuc')) delete ums.state.moTin;
            return;
        }
        if (ev.target.closest('[data-a="tatca"]')) { ums.app.openHash('#tintuc'); return; }
        var g = ev.target.closest('[data-goto]');
        if (g) ums.app.openHash(g.getAttribute('data-goto'));
    });
})();
