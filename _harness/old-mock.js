/*
 * Phần giả lập cho _harness/index-old.html — chạy vỏ CŨ indexi.aspx trên máy, không máy chủ.
 *
 * Nạp SAU đoạn script cuối của indexi.aspx (lúc đó `edu` đã có) và TRƯỚC khi trang sẵn sàng,
 * nên startApp() / constant.init() của Corei chạy nguyên bản trên nền đã thay:
 *   1. edu.system.makeRequest  → không gọi mạng; vai trò + cây chức năng lấy từ old-data.js,
 *      lời gọi khác lấy fixtures.js (nếu có khoá) hoặc trả mảng rỗng.
 *   2. ASG()                   → dựng phiên giả thay cho blob mã hoá do ASPX sinh.
 *   3. Bốn chỗ Corei nhảy sang index.aspx (mục 5 CLAUDE.md) → ở lại trang này.
 * Corei/*.js, html và js của module không bị sửa dòng nào.
 */
(function () {
    'use strict';

    var D = window.HARNESS_OLD || { info: {}, roles: [], menus: {} };
    var FX = window.HARNESS_FIXTURES || {};
    var sys = edu.system;
    var F_VAITRO = 'PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung';
    var F_CHUCNANG = 'PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung';

    // Cờ "thủ vai SV đang chờ" của vỏ thật (và của _v2 — cùng origin localhost:8787). Còn sót thì checkChucNang() xoá vai trò
    // vừa chọn rồi nhảy sang index.aspx ngay khi bấm vào một vai trò. Harness không có thủ vai → bỏ cờ.
    try { localStorage.removeItem('pendingThuVaiSV'); } catch (ex) { }

    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function boDau(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function laIndex(r) { var a = (r.TENANH || '').trim(); return !!r.DUONGDANFILE && a.indexOf('fa ') !== 0; }

    /* ---------- 1. Bảng nhỏ góc dưới phải: lời gọi bị chặn + lỗi JS ---------- */
    var log = (function () {
        var box, list, stat, goi = 0, thieu = 0;
        function dung() {
            if (box) return;
            box = document.createElement('div');
            box.id = 'hn-panel';
            box.innerHTML = '<div class="hn-panel__head"><b>HARNESS</b> <span class="hn-panel__stat"></span>' +
                '<a href="javascript:void(0)" data-hn="mo">mở</a> <a href="javascript:void(0)" data-hn="an" title="Ẩn tới khi tải lại trang">×</a></div>' +
                '<div class="hn-panel__body" style="display:none"><table></table></div>';
            document.body.appendChild(box);
            list = box.querySelector('table'); stat = box.querySelector('.hn-panel__stat');
            box.addEventListener('click', function (e) {
                var k = e.target.getAttribute && e.target.getAttribute('data-hn');
                if (k === 'an') box.style.display = 'none';
                if (k === 'mo') { var b = box.querySelector('.hn-panel__body'); var mo = b.style.display === 'none'; b.style.display = mo ? '' : 'none'; e.target.textContent = mo ? 'thu gọn' : 'mở'; }
            });
        }
        function ve() {
            var loi = (window.__harnessErrors || []).length;
            stat.textContent = goi + ' lời gọi' + (thieu ? ' · ' + thieu + ' không có dữ liệu mẫu' : '') + (loi ? ' · ' + loi + ' lỗi JS' : '');
            box.className = loi ? 'hn-co-loi' : '';
        }
        function dong(cls, nhan, chu, payload) {
            var tr = document.createElement('tr');
            tr.className = cls;
            tr.innerHTML = '<td>' + nhan + '</td><td>' + esc(chu) + '</td>';
            if (payload) { tr.title = 'Bấm để in tham số ra Console'; tr.onclick = function () { console.log('[harness]', chu, payload); }; }
            list.insertBefore(tr, list.firstChild);
        }
        return {
            goi: function (key, found, payload) { dung(); goi++; if (!found) thieu++; dong(found ? 'hn-ok' : 'hn-thieu', found ? 'OK' : 'RỖNG', key, payload); ve(); },
            loi: function (chu) { dung(); dong('hn-loi', 'LỖI', chu); ve(); }
        };
    })();
    window.__harnessBaoLoi = function (chu) { if (document.body) log.loi(chu); };
    (window.__harnessErrors || []).forEach(function (c) { log.loi(c); });

    /* ---------- 2. makeRequest: không gọi mạng ---------- */
    function traCuu(op, d) {
        if (d.func === F_VAITRO) return D.roles;
        if (d.func === F_CHUCNANG) return { rs: D.menus[d.strVaiTro_Id] || [] };
        var keys = [d.strMaBangDanhMuc ? op.action + '#' + d.strMaBangDanhMuc : null, d.func, op.action];
        for (var i = 0; i < keys.length; i++) {
            if (!keys[i] || FX[keys[i]] === undefined) continue;
            var v = FX[keys[i]];
            if (typeof v === 'string' && v.indexOf('@first:') === 0) { var s = FX[v.substring(7)]; return s && s.length ? [s[0]] : []; }
            return v;
        }
    }
    sys.makeRequest = function (op) {
        var d = op.data || {};
        var data = traCuu(op, d);
        var found = data !== undefined;
        if (d.func !== F_VAITRO && d.func !== F_CHUCNANG) log.goi(d.func || op.action, found, d);
        var res = { Success: true, Message: '', Data: found ? data : [], Pager: found && data.length ? data.length : 0 };
        setTimeout(function () {
            try { if (typeof op.success === 'function') op.success(res); }
            catch (ex) { console.error('[harness] lỗi trong success của', d.func || op.action, ex); window.__harnessErrors.push(String(ex)); log.loi((d.func || op.action) + ' → ' + ex); }
            if (typeof op.complete === 'function') op.complete({}, 'success');
        }, 60);
    };

    /* ---------- 3. Phiên giả — thay ASG() trong jquery.simplePagination.min.js ---------- */
    window.ASG = function () {
        var o = edu.system, goc = location.origin;
        o.objApi = Init_API();
        o.strhost = goc;
        o.rootPath = goc;               // loadPage ghép  rootPath + "/" + appCode + url
        o.rootPathUpload = goc;
        o.rootPathReport = '';
        o.apiUrl = goc;
        o.apiUrlTemp = goc;
        o.folderAvatar = '';
        o.folderDoc = '';
        o.clientIP = '127.0.0.1';
        o.appId = '';
        o.userId = 'DEV00000000000000000000000000001';
        o.langId = 'VI';
        o.tokenJWT = '';
        o.browsername = (o.getBrowser() || {}).name;
        var anh = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#c5cbe0"/><circle cx="20" cy="15" r="7" fill="#fff"/><path d="M6 38c0-9 28-9 28 0z" fill="#fff"/></svg>');
        $('#imgavatar, #imgavatardrop').attr('src', anh);
        $('#lbLogo_mini').html('UMS');
        $('#lbLogo_large').html('UMS — bản cũ');

        // Đã chọn vai trò (giữ qua F5 bằng sessionStorage, đúng cơ chế của Corei): để checkChucNang()
        // tự khôi phục vai trò, dựng menu, đổ danh sách vai trò vào cột phải và mở lại màn đang xem.
        if (sessionStorage.getItem('strChucNang')) {
            if (!sessionStorage.getItem('strChucNang_Id')) sessionStorage.setItem('strChucNang_Id', 'HARNESS');
            o.getlistByUser_ChucNang();
        } else {
            veTrangChu();
        }
    };

    // Core/uploadfile.js + uploadavatar.js nằm ở máy chủ tải tệp (RootPathUpload), không có trong kho.
    // Thiếu hai hàm này thì màn có ô đính kèm ném ReferenceError giữa chừng và dựng dở → đặt hàm rỗng.
    ['UploadFile', 'UploadAvatar'].forEach(function (ten) {
        if (typeof window[ten] !== 'function') window[ten] = function () { console.info('[harness] ' + ten + '() bỏ qua — không có máy chủ tải tệp'); };
    });

    /* ---------- 4. Chặn các chỗ Corei nhảy sang index.aspx ---------- */
    // (a) Bấm logo / mục "Trang chủ": bản thật về index.aspx → ở đây về danh sách vai trò.
    //     Gắn trước startApp() nên chạy trước trình xử lý của Corei và chặn nó.
    $(document).on('click', '.refeshlogo', function (e) {
        e.preventDefault(); e.stopImmediatePropagation();
        sessionStorage.removeItem('strChucNang'); sessionStorage.removeItem('strChucNang_Id');
        location.hash = ''; location.reload();
    });
    // (b) initMain: chức năng có TENANH không bắt đầu bằng "fa " thì bản thật chuyển sang index.aspx
    //     (Bootstrap 5). Ở đây vẫn mở trong vỏ indexi, mục đó được đánh dấu "index" trên menu.
    var initMainGoc = sys.initMain;
    sys.initMain = function (hienThi, tep, id) {
        var me = this, cn = (me.dtChucNang || []).find(function (e) { return e.ID === id; });
        if (cn && !cn.DUONGDANFILE) {
            // Mục chưa gắn link (DUONGDANFILE rỗng) → nhảy về trang chủ (danh sách vai trò).
            sessionStorage.removeItem('strChucNang'); sessionStorage.removeItem('strChucNang_Id');
            location.hash = ''; location.reload();
            return;
        }
        var cu = cn && cn.TENANH, doi = cn && laIndex(cn);
        if (doi) cn.TENANH = 'fa ' + (cu || '');
        try { return initMainGoc.apply(me, arguments); }
        finally { if (doi) cn.TENANH = cu; }
    };
    // (c) Đánh dấu trên menu: mục thuộc vỏ index, mục trỏ tệp không có trong kho
    var genGoc = sys.genHTML_MenuVertical;
    sys.genHTML_MenuVertical = function (data) {
        var r = genGoc.apply(this, arguments);
        (data || []).forEach(function (row) {
            var li = document.getElementById('chucnang' + row.ID);
            if (!li) return;
            if (row._thieu) { li.classList.add('hn-thieu'); li.title = 'Menu trỏ tới tệp không có trong kho: ' + row.MAUNGDUNG + row.DUONGDANFILE; }
            else if (laIndex(row)) { li.classList.add('hn-index'); li.title = 'Trên hệ thật mục này mở ở index.aspx (Bootstrap 5), không phải indexi'; }
        });
        return r;
    };

    /* ---------- 5. Trang chủ: danh sách vai trò ---------- */
    // Phân nhóm theo từ khoá trên TÊN vai trò như index.aspx (initRolePicker), rút gọn.
    var NHOM = [['cong', 'Cổng người dùng'], ['hocvu', 'Học vụ'], ['daotao', 'Đào tạo'], ['taichinh', 'Tài chính'], ['nhansu', 'Nhân sự'], ['quantri', 'Quản trị'], ['khac', 'Khác']];
    var LUAT = [
        ['quantri', ['phan quyen']], ['taichinh', ['tra cuu ket qua dang ky']], ['daotao', ['tra cuu chuong trinh']],
        ['cong', ['cong can bo', 'cong sinh vien', 'cong thong tin', 'app sinh vien', 'dashboard']],
        ['hocvu', ['chuyen can', 'hoc lai', 'thi lai', 'thi trac nghiem', 'thi phach', 'quyet dinh nguoi hoc', 'quan ly diem', 'nhap diem', 'xu ly hoc vu', 'ren luyen', 'dang ky hoc', 'dang ky thi', 'tot nghiep', 'vbc', 'chung chi', 'bang cap', 'chot so luong']],
        ['daotao', ['ke hoach nhap hoc', 'ke hoach tuyen sinh', 'ke hoach chuong trinh', 'chuong trinh', 'luan van', 'luan an', 'nghien cuu khoa hoc', 'nckh', 'tuyen sinh', 'nhap hoc']],
        ['taichinh', ['ky tuc xa', 'hoc bong', 'hoc phi', 'tai chinh', 'muc phi']],
        ['nhansu', ['nhan su', 'gio giang', 'thong ke gio', 'sinh vien']],
        ['quantri', ['khao sat', 'he thong', 'khoa quan ly', 'tin tuc', 'sms', 'cms', 'chinh sach', 'mien giam', 'doi tuong', 'tra cuu']]
    ];
    function nhomCua(ten) {
        var t = boDau(ten);
        for (var i = 0; i < LUAT.length; i++) for (var j = 0; j < LUAT[i][1].length; j++) if (t.indexOf(LUAT[i][1][j]) >= 0) return LUAT[i][0];
        return 'khac';
    }
    function veTrangChu() {
        var theo = {}, html = '';
        D.roles.forEach(function (r) {
            var ds = D.menus[r.ID] || [], man = ds.filter(function (x) { return x.DUONGDANFILE; });
            var g = r._ngoai ? 'khac' : nhomCua(r.TENVAITRO);
            (theo[g] = theo[g] || []).push({ r: r, man: man.length, ngoai: man.filter(function (x) { return x._ngoai; }).length });
        });
        NHOM.forEach(function (n) {
            if (!theo[n[0]]) return;
            html += '<h4 class="hn-home__nhom">' + n[1] + ' <small>' + theo[n[0]].length + '</small></h4><div class="hn-home__luoi">';
            theo[n[0]].forEach(function (x) {
                html += '<a href="javascript:void(0)" class="hn-home__the" data-vt="' + x.r.ID + '" data-tim="' + esc(boDau(x.r.TENVAITRO + ' ' + x.r.MAUNGDUNG)) + '">' +
                    '<b>' + esc(x.r.TENVAITRO) + '</b><span>' + esc(x.r.MAUNGDUNG) + ' · ' + x.man + ' màn' + (x.ngoai ? ' (' + x.ngoai + ' ngoài menu)' : '') + '</span></a>';
            });
            html += '</div>';
        });
        var i = D.info || {};
        $('#lblPath_ChucNang').html('<a class="list-group-a"><span class="fa fa-home"></span> Danh sách vai trò</a>');
        $('#main-content-wrapper').html('<section class="content"><div class="hn-home">' +
            '<div class="hn-home__dau"><h3>Danh sách vai trò</h3><input type="text" id="hn-tim" class="form-control" placeholder="Tìm vai trò"></div>' +
            '<p class="hn-home__ghi">' + D.roles.length + ' vai trò · ' + (i.chucNang || 0) + ' chức năng trên menu · ' + (i.ngoaiMenu || 0) + ' tệp ngoài menu. ' +
            'Nguồn: ' + esc(i.nguon || '') + '. Không gọi máy chủ, bảng không có dữ liệu.</p>' + html + '</div></section>');
        if (sessionStorage.getItem('hn.chan')) {
            sessionStorage.removeItem('hn.chan');
            $('.hn-home__ghi').after('<p class="hn-home__ghi" style="color:#b45309">Vỏ cũ vừa định chuyển sang <code>index.aspx</code> — harness đã chặn và đưa về đây. Chi tiết (vị trí gọi) ở Console.</p>');
        }
        if (!D.roles.length) $('.hn-home').append('<p>Chưa có <code>_harness/old-data.js</code> — chạy <code>node _harness/old-data-tao.js</code>.</p>');
    }
    $(document).on('click', '.hn-home__the', function () {
        var r = D.roles.find(function (x) { return x.ID === this.getAttribute('data-vt'); }, this);
        if (!r) return;
        // Ghi đúng hai khoá Corei dùng rồi tải lại: vào vai trò theo đường khởi động thật của indexi.
        sessionStorage.setItem('strChucNang', JSON.stringify({ appId: r.ID, appCode: r.MAUNGDUNG, rootPathReport: r.TENFILEDINHKEM }));
        sessionStorage.setItem('strChucNang_Id', 'HARNESS');
        location.reload();
    });
    $(document).on('input', '#hn-tim', function () {
        var q = boDau(this.value);
        $('.hn-home__the').each(function () { this.style.display = this.getAttribute('data-tim').indexOf(q) >= 0 ? '' : 'none'; });
    });
})();
