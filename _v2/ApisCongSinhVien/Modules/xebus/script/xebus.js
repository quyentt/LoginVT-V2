/* =========================================================================
   Đăng ký xe buýt (Cổng sinh viên — vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/xebus/html/xebus.html + script/xebus.js (vỏ index)
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc: thanh trên (ô "Chọn kế hoạch" + "Xem" + "Hủy đăng ký"
   + "Đăng ký"), rồi HAI CỘT — cột trái 340px "Tháng đăng ký" (lưới ô tháng bấm
   chọn), cột phải "Tuyến đăng ký" (bảng có ô đánh dấu + chọn tất cả) và bên dưới
   là khối "Điện thoại liên hệ / Nơi nộp đơn và nhận thẻ / ảnh cá nhân" cạnh
   "Phí phải nộp + Thanh toán".

   Lời gọi (chép nguyên action / func / tên tham số của bản gốc):
     pkg_hososinhvien_xebus.LayDSKeHoach_DichVu_XeBus        → ô Kế hoạch (ID / TENKEHOACH)
     pkg_hososinhvien_xebus.LayDSThangDangKyTheoKeHoach      → Data.{ rs (THANG, NAM), rsKetQuaCaNhan (ID, THANG, NAM) }
     pkg_hososinhvien_xebus.LayDSQLSV_XeBus_TuyenXe_KH       → Data.{ rs (ID, TEN, MOTA), rsKetQuaCaNhan (ID, QLSV_XEBUS_TUYENXE_ID) }
     pkg_hososinhvien_xebus.LayDSKeHoach_XeBus_DangKy        → bản ghi cá nhân (ID, DIENTHOAILIENHE, NOINOPDONVANHANTHE, ANHCANHAN)
     pkg_hososinhvien_xebus.Them_KeHoach_XeBus_DangKy        → lưu bản ghi cá nhân (ảnh, điện thoại, nơi nhận thẻ)
     pkg_hososinhvien_xebus.Them_XeBus_ThangDangKy / Xoa_XeBus_ThangDangKy   (dThang, dNam)
     pkg_hososinhvien_xebus.Them_XeBus_TuyenDangKy / Xoa_XeBus_TuyenDangKy   (strQLSV_XeBus_TuyenXe_Id)
     pkg_hososinhvien_xebus.HuyDangKy                        → "Hủy đăng ký" (gửi kèm ảnh / điện thoại / nơi nhận thẻ như gốc)
     strNguoiThucHien_Id = edu.system.userId ở gốc → api.js tự điền (cùng giá trị).

   Giữ như gốc:
     · bấm "Đăng ký" (đổi chữ thành "Cập nhật" khi đã có bản ghi) thì lưu bản ghi
       cá nhân, rồi so sánh tháng / tuyến đang chọn với danh sách đã đăng ký và
       gửi Thêm cho mục mới chọn, Xoá cho mục vừa bỏ chọn;
     · "Hủy đăng ký" chỉ hiện khi đã có bản ghi;
     · nút "Thanh toán" bản gốc không có xử lý → giữ nút, đặt disabled;
     · "Phí phải nộp" bản gốc viết cứng 00.00đ (không có lời gọi nào lấy số tiền)
       → vẫn hiện 0 qua ums.ui.money, ghi vào sổ cần quyết.

   Khác bản gốc (và vì sao):
     · Các lời gọi khi Lưu chạy TUẦN TỰ qua ums.ui.batch (bản ghi cá nhân trước,
       rồi tháng / tuyến) thay vì bắn song song — bản gốc gọi save_XeBus() rồi
       lập tức bắn tiếp tháng/tuyến, nên các dòng tháng/tuyến có thể tới máy chủ
       trước khi bản ghi cha kịp tạo; và mỗi lời gọi bật một thông báo riêng.
     · Lưu / hủy xong thì NẠP LẠI ba danh sách. Bản gốc không nạp lại, nên các ô
       vẫn mang trạng thái cũ: bấm "Cập nhật" lần thứ hai là gửi Thêm lần nữa cho
       cùng một tháng / tuyến (đăng ký trùng). Đây là sửa lỗi, không đổi tham số gửi đi.
     · Đổi kế hoạch sang kế hoạch CHƯA đăng ký thì xoá trắng điện thoại / nơi nhận
       thẻ / ảnh và trả nút về "Đăng ký" (bản gốc chỉ đổ dữ liệu khi CÓ bản ghi,
       nên thông tin của kế hoạch trước còn nằm nguyên trên màn).
     · "Hủy đăng ký" xong: bản gốc gọi location.reload() (nạp lại cả vỏ SPA) →
       ở đây chỉ nạp lại ba danh sách của màn.
     · Thông báo sau khi lưu: bản gốc luôn hiện "Thêm mới thành công!" vì nhánh
       so sánh obj_save.strId không bao giờ có giá trị; ở đây hiện "Cập nhật thành
       công!" khi đang sửa bản ghi đã có (đúng ý định của nhánh đó).
     · Ảnh cá nhân: ums.files.avatar (thay edu.system.uploadAvatar). Như gốc, khi
       lưu vẫn gửi đường dẫn TẠM (unsave_…) mà KHÔNG gọi copyfile — xem sổ cần quyết.
     · Bảng tuyến không cuộn riêng (bản gốc .bus-wrp cao tối đa 300px) — luật
       "không cuộn bên trong" của BO-CUC.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, X = ums.xebus;
    var root = document.getElementById('csv-xebus');
    var A = 'SV_XeBus_MH/', P = 'pkg_hososinhvien_xebus.';
    function e(v) { return X.e(v); }
    function arr(d) { return X.arr(d); }

    var dsThang = [], dkThang = {}, chonThang = {};   // khoá = THANG + '/' + NAM
    var dsTuyen = [], dkTuyen = {};                   // ID tuyến → ID bản ghi đã đăng ký
    var caNhanId = '';
    var av = null;

    /* ---------- Khung màn hình ------------------------------------------- */
    root.innerHTML =
        pat.page('Đăng ký bus',
            ui.btn('del', { text: 'Hủy đăng ký', attr: { 'data-a': 'huy', hidden: 'hidden' } }) +
            ui.btn('save', { text: 'Đăng ký', attr: { 'data-a': 'luu' } })) +
        X.thanhLoc({ label: 'Chọn kế hoạch' }) +
        '<div class="xb-cols">' +
        pat.panel({ title: 'Tháng đăng ký', icon: 'fa-calendar-days', zone: 'thang' }) +
        '<div class="xb-right">' +
        pat.panel({ title: 'Tuyến đăng ký', icon: 'fa-bus', flush: true, zone: 'tuyen' }) +
        pat.panel({
            title: false,
            body: '<div class="xb-info">' +
                '<div class="xb-lienhe">' +
                '<div class="xb-lienhe__form">' +
                ui.field('Điện thoại liên hệ', '<input class="ums-input" data-f="dt" autocomplete="off">') +
                ui.field('Nơi nộp đơn và nhận thẻ', '<input class="ums-input" data-f="noi" autocomplete="off">') +
                '</div>' +
                '<div class="xb-anh" data-z="anh"></div>' +
                '</div>' +
                '<div class="xb-phi">' +
                '<div>Phí phải nộp: <b class="xb-phi__so" data-z="phi"></b></div>' +
                ui.btn('save', {
                    text: 'Thanh toán', mod: 'primary', icon: 'fa-credit-card',
                    attr: { 'data-a': 'tt', disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' }
                }) +
                '</div></div>'
        }) +
        '</div></div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function nut(a) { return root.querySelector('[data-a="' + a + '"]'); }
    function kh() { return f('kh').value; }
    function key(a) { return e(a.THANG) + '/' + e(a.NAM); }

    av = ums.files.avatar(z('anh'), { width: 336, height: 448, icon: 'fa-user' });
    z('phi').textContent = ui.money(0) + ' đ';

    /* ---------- Tháng đăng ký -------------------------------------------- */
    function veThang() {
        if (!dsThang.length) { z('thang').innerHTML = ui.empty('Kế hoạch chưa mở tháng nào', 'fa-calendar-days'); return; }
        z('thang').innerHTML = '<div class="xb-months">' + dsThang.map(function (a, i) {
            var chon = !!chonThang[key(a)];
            return '<button type="button" class="xb-month' + (chon ? ' is-active' : '') + '" data-m="' + i + '"' +
                ' aria-pressed="' + (chon ? 'true' : 'false') + '">' +
                '<i class="fa-light fa-check"></i><span>T' + ui.esc(e(a.THANG)) + '/' + ui.esc(e(a.NAM)) + '</span></button>';
        }).join('') + '</div>';
    }

    function taiThang() {
        z('thang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: A + 'DSA4BRIVKSAvJgUgLyYKOBUpJC4KJAkuICIp', func: P + 'LayDSThangDangKyTheoKeHoach',
            strQLSV_KeHoach_XeBus_Id: kh()
        }).then(function (r) {
            var d = r.data || {};
            dsThang = arr(d.rs); dkThang = {}; chonThang = {};
            arr(d.rsKetQuaCaNhan).forEach(function (a) { var k = key(a); dkThang[k] = e(a.ID); chonThang[k] = true; });
            veThang();
        }).catch(function (err) {
            dsThang = []; dkThang = {}; chonThang = {};
            z('thang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'tháng đăng ký');
        });
    }

    /* ---------- Tuyến đăng ký -------------------------------------------- */
    function veTuyen() {
        ui.table({
            el: z('tuyen'), rows: dsTuyen, empty: 'Kế hoạch chưa khai tuyến nào',
            columns: [
                { title: 'Tuyến', prop: 'TEN' },
                { title: 'Mô tả', prop: 'MOTA' },
                {
                    head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '"' + (dkTuyen[e(r.ID)] ? ' checked' : '') + '>'; }
                }
            ]
        });
    }

    function taiTuyen() {
        z('tuyen').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: A + 'DSA4BRIQDRIXHhkkAzQyHhU0OCQvGSQeCgkP', func: P + 'LayDSQLSV_XeBus_TuyenXe_KH',
            strQLSV_KeHoach_XeBus_Id: kh()
        }).then(function (r) {
            var d = r.data || {};
            dsTuyen = arr(d.rs); dkTuyen = {};
            arr(d.rsKetQuaCaNhan).forEach(function (a) { dkTuyen[e(a.QLSV_XEBUS_TUYENXE_ID)] = e(a.ID); });
            veTuyen();
        }).catch(function (err) {
            dsTuyen = []; dkTuyen = {};
            z('tuyen').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'tuyến đăng ký');
        });
    }

    /* ---------- Bản ghi cá nhân ------------------------------------------ */
    function doiNut(daCo) {
        var s = nut('luu').querySelector('span');
        if (s) s.textContent = daCo ? 'Cập nhật' : 'Đăng ký';
        nut('huy').hidden = !daCo;
    }
    function xoaTrangCaNhan() {
        f('dt').value = ''; f('noi').value = ''; av.set(''); caNhanId = ''; doiNut(false);
    }
    function taiCaNhan() {
        return ums.api.call({
            action: A + 'DSA4BRIKJAkuICIpHhkkAzQyHgUgLyYKOAPP', func: P + 'LayDSKeHoach_XeBus_DangKy',
            strQLSV_KeHoach_XeBus_Id: kh()
        }).then(function (r) {
            var a = arr(r.data)[0];
            if (!a) { xoaTrangCaNhan(); return; }
            f('dt').value = e(a.DIENTHOAILIENHE);
            f('noi').value = e(a.NOINOPDONVANHANTHE);
            av.set(e(a.ANHCANHAN));
            caNhanId = e(a.ID);
            doiNut(true);
        }).catch(function (err) { xoaTrangCaNhan(); ums.api.handle(err, 'thông tin đăng ký'); });
    }

    /* ---------- Nạp / xoá trắng cả màn ----------------------------------- */
    function nhac() {
        dsThang = []; dkThang = {}; chonThang = {}; dsTuyen = []; dkTuyen = {};
        z('thang').innerHTML = ui.empty('Chọn kế hoạch rồi bấm "Xem"', 'fa-hand-pointer');
        z('tuyen').innerHTML = ui.empty('Chọn kế hoạch rồi bấm "Xem"', 'fa-hand-pointer');
        xoaTrangCaNhan();
    }
    function tai() {
        if (!kh()) { nhac(); return; }
        taiThang(); taiTuyen(); taiCaNhan();
    }

    /* ---------- Lưu ------------------------------------------------------- */
    function luu() {
        if (!kh()) { ui.toast('Vui lòng chọn kế hoạch?', 'warn'); return; }
        var moi = !caNhanId;
        var calls = [{
            action: A + 'FSkkLB4KJAkuICIpHhkkAzQyHgUgLyYKOAPP', func: P + 'Them_KeHoach_XeBus_DangKy',
            strQLSV_KeHoach_XeBus_Id: kh(), strAnhCaNhan: av.get(),
            strDienThoaiLienHe: f('dt').value, strNoiNopDonVaNhanThe: f('noi').value
        }];

        /* Tháng: mục mới chọn → Thêm, mục vừa bỏ chọn → Xoá (như vòng lặp gốc) */
        dsThang.forEach(function (a) {
            var k = key(a), daCo = !!dkThang[k], dangChon = !!chonThang[k];
            if (daCo === dangChon) return;
            calls.push({
                action: dangChon ? A + 'FSkkLB4ZJAM0Mh4VKSAvJgUgLyYKOAPP' : A + 'GS4gHhkkAzQyHhUpIC8mBSAvJgo4',
                func: P + (dangChon ? 'Them_XeBus_ThangDangKy' : 'Xoa_XeBus_ThangDangKy'),
                strQLSV_KeHoach_XeBus_Id: kh(), dThang: e(a.THANG), dNam: e(a.NAM)
            });
        });

        /* Tuyến: đọc thẳng ô đánh dấu trong bảng (như $("#tblXeBus .tuyenbus")) */
        Array.prototype.forEach.call(z('tuyen').querySelectorAll('tbody input[data-ck]'), function (c) {
            var r = dsTuyen[Number(c.getAttribute('data-ck'))];
            if (!r) return;
            var daCo = !!dkTuyen[e(r.ID)], dangChon = c.checked;
            if (daCo === dangChon) return;
            calls.push({
                action: dangChon ? A + 'FSkkLB4ZJAM0Mh4VNDgkLwUgLyYKOAPP' : A + 'GS4gHhkkAzQyHhU0OCQvBSAvJgo4',
                func: P + (dangChon ? 'Them_XeBus_TuyenDangKy' : 'Xoa_XeBus_TuyenDangKy'),
                strQLSV_KeHoach_XeBus_Id: kh(), strQLSV_XeBus_TuyenXe_Id: e(r.ID)
            });
        });

        ui.batch(calls, {
            title: moi ? 'Đang đăng ký xe buýt' : 'Đang cập nhật đăng ký',
            okText: moi ? 'Thêm mới thành công!' : 'Cập nhật thành công!'
        }).then(function () { tai(); });
    }

    /* ---------- Hủy đăng ký ----------------------------------------------- */
    function huy() {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy đăng ký', title: 'Hủy đăng ký' })
            .then(function (yes) {
                if (!yes) return;
                return ums.api.call({
                    action: A + 'CTQ4BSAvJgo4', func: P + 'HuyDangKy',
                    strQLSV_KeHoach_XeBus_Id: kh(), strAnhCaNhan: av.get(),
                    strDienThoaiLienHe: f('dt').value, strNoiNopDonVaNhanThe: f('noi').value
                }).then(function () { ui.toast('Xóa thành công!', 'ok'); tai(); });
            })
            .catch(function (err) { ums.api.handle(err, 'hủy đăng ký'); });
    }

    /* ---------- Sự kiện --------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var m = ev.target.closest('[data-m]');
        if (m && root.contains(m)) {
            var a = dsThang[Number(m.getAttribute('data-m'))];
            if (!a) return;
            var k = key(a);
            chonThang[k] = !chonThang[k];
            m.classList.toggle('is-active', !!chonThang[k]);
            m.setAttribute('aria-pressed', chonThang[k] ? 'true' : 'false');
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var act = b.getAttribute('data-a');
        if (act === 'xem') tai();
        else if (act === 'luu') luu();
        else if (act === 'huy') huy();
    });

    /* Ô "chọn tất cả" của bảng tuyến (edu.util.checkedAll_BgRow của gốc) */
    root.addEventListener('change', function (ev) {
        var c = ev.target;
        if (!c.matches || !c.matches('input[data-ck]') || !z('tuyen').contains(c)) return;
        var all = z('tuyen').querySelectorAll('tbody input[data-ck]');
        if (c.getAttribute('data-ck') === 'all') {
            Array.prototype.forEach.call(all, function (x) { x.checked = c.checked; });
            return;
        }
        var h = z('tuyen').querySelector('thead input[data-ck="all"]');
        if (h) h.checked = all.length > 0 && Array.prototype.every.call(all, function (x) { return x.checked; });
    });

    /* ---------- Mở màn ---------------------------------------------------- */
    nhac();
    X.napKeHoach(f('kh'), {
        action: A + 'DSA4BRIKJAkuICIpHgUoIikXNB4ZJAM0MgPP', func: P + 'LayDSKeHoach_DichVu_XeBus'
    }, {
        chon: 'mot',                 // selectOne: true của bản gốc
        label: 'Chọn kế hoạch',
        onDoi: function (co) { if (co) tai(); else nhac(); }
    });
})();
