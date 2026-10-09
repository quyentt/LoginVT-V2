/* =========================================================================
   dongphuc — Đăng ký mua/tham gia đồng phục - bảo hiểm (Cổng sinh viên, thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/tinhhinhhocphi/html/dongphuc.html
            + script/dongphuc.js (lớp DongPhuc, vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — MỘT cột:
     · thanh lọc: ô "Chọn đợt đăng ký" + nút "Tìm kiếm";
     · khung "Thông tin đăng ký <loại>" — nút "Kết quả đã đăng ký <loại>" ở đầu
       khung (gốc đặt cạnh tiêu đề) — và bảng: Loại · Đơn giá/Lệ phí · Số lượng
       (ô nhập, mặc định 1) · Xác nhận <loại> · Xác nhận không <loại>;
     · ba hộp thoại như gốc: xác nhận tham gia, xác nhận không tham gia
       (lý do + minh chứng), kết quả đã đăng ký (bảng + "Hủy đăng ký").
   Chữ "<loại>" lấy từ MOTA của đợt đang chọn, mặc định "tham gia" — đúng hàm
   getMoTaLoaiDangKy / updateLabels_LoaiDangKy của bản gốc.

   Lời gọi (chép nguyên action / func / tham số / tên cột) — TC_DangKyMua_MH ·
   PKG_TAICHINH_DANGKYMUA.*:
       Pr_TC_KH_MuaHang_DangKy      danh sách đợt đăng ký (ID, TEN, MOTA)
       Pr_TC_KH_MH_DG_LayDSDangKy   hàng hoá/dịch vụ của đợt (ID, TEN_KHOANTHU,
                                    DONGIA, TAICHINH_CACKHOANTHU_ID)
       Pr_TC_KH_MH_KQ_Them_Mua      xác nhận tham gia
       Pr_TC_KH_MH_KQ_Them_KhongMua xác nhận không tham gia
       Pr_TC_KH_MH_KQ_LayDSDangKy   kết quả đã đăng ký (SOLUONG, SOTIENPHAINOP,
                                    TINHTRANGDANGKY_CODE = 'DANG_KY' khi tham gia)
       Pr_TC_KH_MH_KQ_Xoa           hủy đăng ký

   Khác bản gốc (cách làm, KHÔNG đổi bố cục):
     · Bảng qua ums.ui.table, hộp thoại qua ums.ui.dialog.
     · "Hủy đăng ký" dùng ums.ui.xoaChon đặt ở CHÂN hộp thoại (luật chung) —
       nút tự đếm số dòng đã chọn; gốc là nút đỏ cố định + edu.util.ActionInCheckedIds.
       Xoá hàng loạt chạy tuần tự kèm tiến độ (ums.ui.batch) thay start_Progress.
     · Ô "Minh chứng" dùng ums.ui.file thay <input type="file"> trần.
   Giữ như gốc (chờ nghiệp vụ — xem báo cáo):
     · Bản gốc gửi `strMinhChung` = GIÁ TRỊ của ô chọn tệp, tức đường dẫn giả
       "C:\\fakepath\\<tên tệp>"; không nơi nào tải tệp lên. Bản mới gửi TÊN TỆP
       đã chọn (không còn phần "C:\\fakepath\\") và KHÔNG tự tải tệp lên — cần
       nghiệp vụ xác nhận đường tải tệp minh chứng.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-dongphuc');
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var sv = (ums.session && ums.session.userId) || '';

    var A = 'TC_DangKyMua_MH/', F = 'PKG_TAICHINH_DANGKYMUA.';
    var G = {
        dot:      { action: A + 'ETMeFQIeCgkeDDQgCSAvJh4FIC8mCjgP', func: F + 'Pr_TC_KH_MuaHang_DangKy' },
        ds:       { action: A + 'ETMeFQIeCgkeDAkeBQYeDSA4BRIFIC8mCjgP', func: F + 'Pr_TC_KH_MH_DG_LayDSDangKy' },
        mua:      { action: A + 'ETMeFQIeCgkeDAkeChAeFSkkLB4MNCAP', func: F + 'Pr_TC_KH_MH_KQ_Them_Mua' },
        khongMua: { action: A + 'ETMeFQIeCgkeDAkeChAeFSkkLB4KKS4vJgw0IAPP', func: F + 'Pr_TC_KH_MH_KQ_Them_KhongMua' },
        kq:       { action: A + 'ETMeFQIeCgkeDAkeChAeDSA4BRIFIC8mCjgP', func: F + 'Pr_TC_KH_MH_KQ_LayDSDangKy' },
        xoa:      { action: A + 'ETMeFQIeCgkeDAkeChAeGS4g', func: F + 'Pr_TC_KH_MH_KQ_Xoa' }
    };
    /* Bản gốc gửi kèm strVaiTroDangNhap_Id / strChucNangHeThong_Id / strHanhDong_Code
       ở MỌI lời gọi; hai tham số đầu do ums.api tự điền, strHanhDong_Code giữ rỗng. */
    function goi(k, o) {
        return ums.api.call(Object.assign({ silent: true, strHanhDong_Code: '' }, G[k], o || {}));
    }

    var dtDot = [], dtDangKy = [], dtKetQua = [];
    var chon = '';          // ID dòng đang thao tác (me.strSelected_KhoanThu_Id)

    root.innerHTML =
        pat.page('Đăng ký mua/tham gia đồng phục - bảo hiểm', '') +
        pat.filterBar([{ key: 'dot', type: 'select', label: 'Chọn đợt đăng ký' }], { searchText: 'Tìm kiếm' }) +
        pat.panel({ title: 'Thông tin đăng ký', icon: 'fa-shirt', flush: true,
                    tools: ui.btn('view', { text: 'Kết quả đã đăng ký', icon: 'fa-list-check', mod: 'out-primary', attr: { 'data-a': 'kq' } }),
                    body: '<div data-z="bang"></div>' });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    /* Chữ "mua/tham gia" theo MOTA của đợt đang chọn (gốc: getMoTaLoaiDangKy) */
    function loai() {
        var id = f('dot').value;
        for (var i = 0; i < dtDot.length; i++) {
            if (String(dtDot[i].ID) === String(id) && e(dtDot[i].MOTA) !== '') return dtDot[i].MOTA;
        }
        return 'tham gia';
    }
    function nhanLai() {
        var t = root.querySelector('.ums-panel__title');
        if (t) t.innerHTML = '<i class="fa-light fa-shirt"></i> Thông tin đăng ký ' + esc(loai());
        var b = root.querySelector('[data-a="kq"] span');
        if (b) b.textContent = 'Kết quả đã đăng ký ' + loai();
    }

    /* ---------- Đợt đăng ký ------------------------------------------------ */
    goi('dot', { strNguoiThuVai_Id: sv }).then(function (r) {
        dtDot = arr(r.data);
        pat.fill(f('dot'), dtDot, { head: 'Chọn đợt đăng ký' });
        if (dtDot.length) {                       // selectFirst: true của bản gốc
            f('dot').value = e(dtDot[0].ID);
            if (window.jQuery) jQuery(f('dot')).trigger('change.select2');
        }
        nhanLai();
        napDS();
    }).catch(function (err) { ums.api.handle(err, 'danh sách đợt đăng ký'); });

    if (window.jQuery) jQuery(f('dot')).on('select2:select', function () { nhanLai(); napDS(); });

    /* ---------- Danh sách hàng hoá / dịch vụ ------------------------------- */
    function napDS() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return goi('ds', {
            strTaiChinh_KH_MuaHang_Id: f('dot').value,
            strTaiChinh_CacKhoanThu_Id: '', strPhanLoaiHangHoa_Id: '', dHieuLuc: ''
        }).then(function (r) {
            dtDangKy = arr(r.data);
            nhanLai();
            veBang();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); });
    }

    function veBang() {
        var L = loai();
        ui.table({
            el: z('bang'), rows: dtDangKy, empty: 'Chưa có dịch vụ nào trong đợt này',
            columns: [
                { title: 'Loại', prop: 'TEN_KHOANTHU' },
                { title: 'Đơn giá/Lệ phí', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.DONGIA); } },
                { title: 'Số lượng', cls: 'is-center', width: '110px', render: function (x) {
                    return '<input class="ums-input is-center" data-sl="' + esc(x.ID) + '" value="1">';
                } },
                { title: 'Xác nhận ' + L, cls: 'is-center is-nowrap', render: function (x) {
                    return ui.btn('confirm', { text: 'Xác nhận ' + L, mod: 'out-success', cls: 'ums-btn--sm',
                        attr: { 'data-mua': e(x.ID) } });
                } },
                { title: 'Xác nhận không ' + L, cls: 'is-center is-nowrap', render: function (x) {
                    return ui.btn('confirm', { text: 'Xác nhận không ' + L, icon: 'fa-circle-xmark', mod: 'out-danger', cls: 'ums-btn--sm',
                        attr: { 'data-khongmua': e(x.ID) } });
                } }
            ]
        });
    }

    function dong(id) {
        for (var i = 0; i < dtDangKy.length; i++) if (String(dtDangKy[i].ID) === String(id)) return dtDangKy[i];
        return null;
    }

    /* ---------- Sự kiện ---------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"]');
        if (b) { napDS(); return; }
        b = ev.target.closest('[data-a="kq"]');
        if (b) { hopKetQua(); return; }
        b = ev.target.closest('[data-mua]');
        if (b) { chon = b.getAttribute('data-mua'); hopMua(); return; }
        b = ev.target.closest('[data-khongmua]');
        if (b) { chon = b.getAttribute('data-khongmua'); hopKhongMua(); }
    });

    /* ---------- Hộp "Xác nhận tham gia" ------------------------------------ */
    function hopMua() {
        var a = dong(chon);
        if (!a) { ui.toast('Vui lòng chọn dịch vụ.', 'warn'); return; }
        var L = loai();
        ui.dialog({
            title: 'Xác nhận ' + L, icon: 'fa-circle-check', size: 'md',
            body: '<p class="ums-u-mb-4">Bạn đã chọn ' + esc(L) + ': <b>' + esc(a.TEN_KHOANTHU) + '</b></p>' +
                  '<p class="ums-u-danger"><i class="fa-light fa-triangle-exclamation"></i> ' +
                  'Lưu ý: Nếu bạn bấm <b>Đồng ý</b>, hệ thống sẽ phát sinh khoản phí phải đóng tương ứng.</p>',
            buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (dlg) { luuMua(dlg); return false; } }]
        });
    }

    function luuMua(dlg) {
        var a = dong(chon);
        if (!a) { ui.toast('Vui lòng chọn dịch vụ.', 'warn'); return; }
        var el = root.querySelector('[data-sl="' + chon + '"]');
        var sl = el ? el.value : '';
        if (!String(sl).trim() || Number(sl) <= 0) { ui.toast('Vui lòng nhập số lượng.', 'warn'); return; }
        goi('mua', {
            strTaiChinh_KH_MuaHang_Id: f('dot').value,
            strQLSV_NguoiHoc_Id: sv,
            strTaiChinh_CacKhoanThu_Id: e(a.TAICHINH_CACKHOANTHU_ID),
            dSoLuong: sl,
            dDonGia: e(a.DONGIA),
            strGhiChu: ''
        }).then(function () {
            dlg.close();
            ui.toast('Xác nhận ' + loai() + ' thành công!', 'ok');
            napDS();
        }).catch(function (err) { ums.api.handle(err, 'xác nhận ' + loai()); });
    }

    /* ---------- Hộp "Xác nhận không tham gia" ------------------------------ */
    function hopKhongMua() {
        var a = dong(chon);
        if (!a) { ui.toast('Vui lòng chọn dịch vụ.', 'warn'); return; }
        var L = loai();
        var dlg = ui.dialog({
            title: 'Xác nhận không ' + L, icon: 'fa-circle-xmark', size: 'md',
            body: ui.field('Mô tả lý do', '<textarea class="ums-input ums-textarea" data-k="lydo" rows="3"></textarea>') +
                  ui.field('Minh chứng', ui.file({ key: 'minhchung', accept: 'image/*,.pdf,.doc,.docx' })),
            buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (d) { luuKhongMua(d); return false; } }]
        });
        ui.enhance(dlg.body);
    }

    function luuKhongMua(dlg) {
        var a = dong(chon);
        if (!a) { ui.toast('Vui lòng chọn dịch vụ.', 'warn'); return; }
        var lyDo = dlg.body.querySelector('[data-k="lydo"]').value;
        if (!String(lyDo).trim()) { ui.toast('Vui lòng nhập lý do không ' + loai() + '.', 'warn'); return; }
        var fi = dlg.body.querySelector('[data-k="minhchung"]');
        var mc = fi && fi.files && fi.files.length ? fi.files[0].name : '';
        goi('khongMua', {
            strTaiChinh_KH_MuaHang_Id: f('dot').value,
            strQLSV_NguoiHoc_Id: sv,
            strTaiChinh_CacKhoanThu_Id: e(a.TAICHINH_CACKHOANTHU_ID),
            strLyDoKhongMua: lyDo,
            strMinhChung: mc,
            strGhiChu: ''
        }).then(function () {
            dlg.close();
            ui.toast('Xác nhận không ' + loai() + ' thành công!', 'ok');
            napDS();
        }).catch(function (err) { ums.api.handle(err, 'xác nhận không ' + loai()); });
    }

    /* ---------- Hộp "Kết quả đã đăng ký" ----------------------------------- */
    function hopKetQua() {
        var L = loai();
        var dlg = ui.dialog({
            title: 'Kết quả đã đăng ký ' + L, icon: 'fa-list-check', size: 'xl',
            body: '<div data-z="kq">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            xoa: { chon: 'input[data-ck]', text: 'Hủy đăng ký', onClick: function (d) { huy(d); } }
        });
        napKetQua(dlg);
        return dlg;
    }

    function napKetQua(dlg) {
        var host = dlg.body.querySelector('[data-z="kq"]');
        var L = loai();
        return goi('kq', {
            strTaiChinh_KH_MuaHang_Id: f('dot').value,
            strQLSV_NguoiHoc_Id: sv,
            strTaiChinh_CacKhoanThu_Id: '', strTinhTrangDangKy_Code: '', dHieuLuc: ''
        }).then(function (r) {
            dtKetQua = arr(r.data);
            ui.table({
                el: host, rows: dtKetQua, empty: 'Chưa có đăng ký nào',
                columns: [
                    { title: 'Loại', prop: 'TEN_KHOANTHU' },
                    { title: 'Đơn giá/Lệ phí', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.DONGIA); } },
                    { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                    { title: 'Tổng tiền', cls: 'is-right is-nowrap', sum: true, sumProp: 'SOTIENPHAINOP',
                      render: function (x) { return '<b class="hp-cam">' + ui.money(x.SOTIENPHAINOP) + '</b>'; } },
                    { title: 'Xác nhận ' + L, cls: 'is-center', render: function (x) {
                        return e(x.TINHTRANGDANGKY_CODE) === 'DANG_KY' ? '<i class="fa-light fa-check hp-ok"></i>' : '';
                    } },
                    { title: 'Xác nhận không ' + L, cls: 'is-center', render: function (x) {
                        var c = e(x.TINHTRANGDANGKY_CODE);
                        return c !== '' && c !== 'DANG_KY' ? '<i class="fa-light fa-xmark hp-bad"></i>' : '';
                    } },
                    { head: '<input type="checkbox" data-ckall>', title: '', cls: 'is-center', width: '46px',
                      render: function (x) { return '<input type="checkbox" data-ck value="' + esc(x.ID) + '">'; } }
                ]
            });
            var all = host.querySelector('[data-ckall]');
            if (all) {
                all.addEventListener('click', function () {
                    Array.prototype.forEach.call(host.querySelectorAll('input[data-ck]'), function (c) { c.checked = all.checked; });
                    ui.demXoaChon();
                });
            }
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); });
    }

    function huy(dlg) {
        var ids = Array.prototype.filter.call(dlg.body.querySelectorAll('input[data-ck]'), function (c) { return c.checked; })
            .map(function (c) { return c.value; });
        if (!ids.length) { ui.toast('Vui lòng chọn dòng cần hủy đăng ký', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn hủy đăng ký ' + ids.length + ' dòng đã chọn không?', { tone: 'bad', ok: 'Hủy đăng ký' })
            .then(function (yes) {
                if (!yes) return;
                var calls = ids.map(function (id) {
                    return Object.assign({ strHanhDong_Code: '' }, G.xoa, { strId: id });
                });
                return ui.batch(calls, { title: 'Đang hủy đăng ký', okText: 'Đã hủy đăng ký' })
                    .then(function () { napKetQua(dlg); napDS(); });
            }).catch(function (err) { ums.api.handle(err, 'hủy đăng ký'); });
    }
})();
