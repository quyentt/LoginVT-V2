/* =========================================================================
   Thủ vai — cán bộ vào một vai trò CHOPHEPTHUVAI = 1 (vd "Cổng sinh viên - thủ vai")
   dưới danh nghĩa một người học: ums.thuVai.*
   Bản viết lại của Core/systemroot.js: khối '.ungdung' click (hộp "Nhập thông tin
   định danh", Core:232-420), _saveThuVaiSession / _restoreThuVaiSession / _thoatThuVai
   (Core:92-123), thẻ "Đang xem — …" đầu cột trái (Core:6436) và _autoThuVaiSV (Core:4985).
   ---------------------------------------------------------------------------
   Giống bản gốc:
     · Tìm bằng PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh (ID / MSSV / họ tên / email),
       gợi ý khi gõ (≥ 2 ký tự, trễ 350 ms), một kết quả thì vào luôn, nhiều thì bấm chọn.
     · Vào vai: userId của phiên = ID người học (mọi màn Cổng SV đọc edu.system.userId làm
       strSinhVien_Id / strNguoiThucHien_Id), strNguoiThucVai_Id = ID cán bộ thật — api.js
       gửi kèm MỌI lời gọi qua ums.state.thuVaiId.
     · Giữ qua F5 bằng sessionStorage (mỗi tab riêng, đóng tab là mất).
     · localStorage.pendingThuVaiSV = { strMSSV } (tab mở từ màn cán bộ) → tự vào vai.
   Khác bản gốc (sửa lỗi):
     · Rời vai (nút × trên thẻ, về trang chủ, chọn vai trò khác) TRẢ LẠI userId cán bộ. Gốc
       chọn vai trò khác ngay trong trang thì userId vẫn là ID sinh viên, và sessionStorage
       không xoá nên F5 lại rơi vào thủ vai.
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums || (global.ums = {});
    var ui = ums.ui;
    var KHOA = 'ums.thuvai';
    var TIM = { action: 'CMS_QuanTri02_MH/CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP', func: 'PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh' };
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function S() { return ums.session || {}; }

    var TV = ums.thuVai = {};
    var goc = null;          // userId cán bộ trước khi vào vai

    function doc() { try { return JSON.parse(sessionStorage.getItem(KHOA) || 'null'); } catch (x) { return null; } }
    function ghi(tv) { try { sessionStorage.setItem(KHOA, JSON.stringify(tv)); } catch (x) {} }

    /** Thủ vai đang giữ cho vai trò roleId (null nếu không) */
    TV.hienTai = function (roleId) {
        var tv = doc();
        return tv && (!roleId || tv.roleId === roleId) ? tv : null;
    };
    /** Áp thủ vai vào phiên: userId = người học, thuVaiId = cán bộ thật */
    TV.ap = function (tv) {
        if (goc === null) goc = S().userId || '';
        if (ums.session) ums.session.userId = tv.userIdVai;
        if (ums.state) ums.state.thuVaiId = tv.userIdGoc;
    };
    /** Rời vai: trả userId cán bộ, xoá khỏi sessionStorage */
    TV.bo = function () {
        try { sessionStorage.removeItem(KHOA); } catch (x) {}
        if (goc !== null && ums.session) ums.session.userId = goc;
        goc = null;
        if (ums.state) ums.state.thuVaiId = '';
    };

    function chuanHoa(r, role) {
        return {
            roleId: role.id,
            userIdGoc: goc !== null ? goc : (S().userId || ''),
            userIdVai: e(r.ID || r.Id || r.id),
            info: {
                ten: e(r.FULLNAME || r.HOTEN || r.HoTen || r.ten),
                ma: e(r.NAME || r.MSSV || r.MA || r.ma),
                email: e(r.EMAIL || r.Email || r.email),
                tenVaiTro: role.name || 'người dùng'
            }
        };
    }
    function tim(role, q) {
        return ums.api.call({ action: TIM.action, func: TIM.func, strThongTinDinhDanh: q, strNguoiThucHien_Id: goc !== null ? goc : S().userId,
            strVaiTroDangNhap_Id: role.id, strChucNangHeThong_Id: role.id, strHanhDong_Code: '', silent: true })
            .then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    }

    /** Hộp "Nhập thông tin định danh" → Promise<tv> (reject khi đóng hộp mà chưa chọn) */
    TV.chon = function (role, goiSan) {
        return new Promise(function (xong, bo) {
            var daChon = false, hen = null, soLan = 0;
            var dlg = ui.dialog({
                title: 'Thông báo', icon: 'fa-bell', size: 'lg',
                body: '<div class="ums-tv-hop">' +
                    '<div class="ums-tv-hop__nhan"><i class="fa-light fa-user-graduate"></i> Nhập thông tin định danh (' + esc(role.name) + ')</div>' +
                    '<div class="ums-tv-hop__o"><span class="ums-tv-hop__ic"><i class="fa-light fa-id-card"></i></span>' +
                        '<input class="ums-input" data-tv="q" placeholder="Nhập ID / MSSV / Họ tên / Email..." autocomplete="off">' +
                        ui.btn('search', { attr: { 'data-tv': 'tim' } }) + '</div>' +
                    '<div class="ums-tv-hop__goiy" data-tv="goiy" hidden></div>' +
                    '<div data-tv="kq"></div></div>',
                onClose: function () { if (!daChon) bo(new Error('huy')); }
            });
            var o = dlg.body, inp = o.querySelector('[data-tv="q"]'), goiY = o.querySelector('[data-tv="goiy"]'), kq = o.querySelector('[data-tv="kq"]');
            function chon(r) { daChon = true; var tv = chuanHoa(r, role); ghi(tv); dlg.close(); xong(tv); }
            function loi(msg) { kq.innerHTML = '<div class="ums-tv-bao ums-tv-bao--warn"><i class="fa-light fa-triangle-exclamation"></i> ' + esc(msg) + '</div>'; }
            function anGoiY() { goiY.hidden = true; goiY.innerHTML = ''; }
            function dong(r, i) {
                var em = e(r.EMAIL || r.Email);
                return '<button type="button" class="ums-tv-hop__muc" data-i="' + i + '"><b>' + esc(e(r.FULLNAME || r.HOTEN)) + '</b>' +
                    '<span><code>' + esc(e(r.NAME || r.MSSV || r.MA)) + '</code>' + (em ? ' • ' + esc(em) : '') + '</span></button>';
            }
            var dsGoiY = [];
            function goiYNgay(q) {
                var lan = ++soLan;
                tim(role, q).then(function (rs) {
                    if (lan !== soLan || inp.value.trim() !== q) return;
                    dsGoiY = rs;
                    if (!rs.length) return anGoiY();
                    goiY.innerHTML = rs.map(dong).join(''); goiY.hidden = false;
                }).catch(anGoiY);
            }
            goiY.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
            goiY.addEventListener('click', function (ev) { var b = ev.target.closest('[data-i]'); if (b) chon(dsGoiY[+b.getAttribute('data-i')]); });
            inp.addEventListener('input', function () {
                clearTimeout(hen); var v = inp.value.trim();
                if (v.length < 2) { soLan++; anGoiY(); return; }
                hen = setTimeout(function () { goiYNgay(v); }, 350);
            });
            inp.addEventListener('focus', function () { var v = inp.value.trim(); if (v.length >= 2) goiYNgay(v); });
            inp.addEventListener('blur', function () { setTimeout(anGoiY, 200); });
            function timKiem() {
                var q = inp.value.trim();
                clearTimeout(hen); soLan++; anGoiY();
                if (!q) return loi('Vui lòng nhập thông tin định danh!');
                kq.innerHTML = '<div class="ums-u-faint ums-u-fz13"><i class="fa-light fa-spinner fa-spin"></i> Đang tìm…</div>';
                tim(role, q).then(function (rs) {
                    if (!rs.length) return loi('Không tìm thấy ' + role.name + ' phù hợp!');
                    if (rs.length === 1) return chon(rs[0]);
                    kq.innerHTML = '<div class="ums-tv-bao ums-tv-bao--info"><i class="fa-light fa-circle-info"></i> Tìm thấy <b>' + rs.length + '</b> kết quả — bấm vào một dòng để chọn</div><div data-tv="bang"></div>';
                    ui.table({ el: kq.querySelector('[data-tv="bang"]'), rows: rs, rowCls: function () { return 'ums-tv-dong'; }, columns: [
                        { title: 'Họ tên', render: function (r) { return '<i class="fa-light fa-circle-user ums-u-blue"></i> <b>' + esc(e(r.FULLNAME || r.HOTEN)) + '</b>'; } },
                        { title: 'Mã', width: '140px', render: function (r) { return '<code>' + esc(e(r.NAME || r.MSSV || r.MA)) + '</code>'; } },
                        { title: 'Email', render: function (r) { return esc(e(r.EMAIL || r.Email)); } }] });
                    kq.querySelector('tbody').addEventListener('click', function (ev) {
                        var tr = ev.target.closest('tr'); if (!tr) return;
                        var i = Array.prototype.indexOf.call(tr.parentNode.children, tr);
                        if (rs[i]) chon(rs[i]);
                    });
                }).catch(function (err) { loi(err.message || 'Có lỗi xảy ra!'); });
            }
            o.querySelector('[data-tv="tim"]').addEventListener('click', timKiem);
            inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); timKiem(); } });
            if (goiSan) { inp.value = goiSan; timKiem(); }
            setTimeout(function () { inp.focus(); }, 30);
        });
    };

    /** Thẻ "Đang xem — …" đặt đầu cột trái */
    TV.theHtml = function (tv) {
        if (!tv || !tv.info || !tv.info.ten) return '';
        var i = tv.info;
        return '<div class="ums-tv-the">' +
            '<button type="button" class="ums-tv-the__x" data-tv-thoat title="Thoát vai"><i class="fa-light fa-xmark"></i></button>' +
            '<div class="ums-tv-the__nhan">Đang xem — ' + esc(i.tenVaiTro) + '</div>' +
            '<div class="ums-tv-the__ten">' + esc(i.ten) + '</div>' +
            (i.ma ? '<div class="ums-tv-the__ma">' + esc(i.ma) + '</div>' : '') + '</div>';
    };

    /** Tab mở từ màn cán bộ: localStorage.pendingThuVaiSV = { strMSSV } → tự tìm rồi vào vai.
        roles: danh sách vai trò đã chuẩn hoá; trả Promise<{ role, tv }> hoặc null khi không có yêu cầu. */
    TV.tuDong = function (roles) {
        var p = null;
        try { p = JSON.parse(localStorage.getItem('pendingThuVaiSV') || 'null'); localStorage.removeItem('pendingThuVaiSV'); } catch (x) {}
        if (!p || !p.strMSSV) return null;
        var role = (roles || []).filter(function (r) { return r.thuVai; })[0];
        if (!role) { ui.toast('Không tìm thấy ứng dụng cho phép thủ vai sinh viên.', 'warn'); return null; }
        if (goc === null) goc = S().userId || '';
        return tim(role, p.strMSSV).then(function (rs) {
            if (rs.length === 1) { var tv = chuanHoa(rs[0], role); ghi(tv); return { role: role, tv: tv }; }
            return TV.chon(role, p.strMSSV).then(function (tv) { return { role: role, tv: tv }; });
        });
    };
})(window);
