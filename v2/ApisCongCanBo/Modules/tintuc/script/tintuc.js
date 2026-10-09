/* =========================================================================
   Tin tức — bảng tin cho cán bộ
   Bản gốc: ApisCongCanBo/Modules/tintuc/script/tintuc.js + html/tintuc.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       TT_DonViCungCapNguon/LayDanhSach   GET  strQLSV_NguoiHoc_Id = userId → nút lọc theo nguồn
       TT_BangTin_NguoiDung/LayDanhSach   GET  strTuKhoa, strTuNgay, strDenNgay, strChuyenMuc_Id '',
                                               strChung_UngDung_Id = vai trò đang mở (edu.system.appId),
                                               dTinQuanTrong -1, strDaoTao_CoCauToChuc_Id = nguồn, dHieuLuc 1,
                                               pageIndex 1, pageSize 10000
       TT_LuotXem/ThemMoi                 POST mở một tin (đếm lượt xem)
       TT_LuuTru/ThemMoi | LayDanhSach    "Lưu đánh dấu" / cột "Tin đã đánh dấu"
       TT_BinhLuan/ThemMoi | LayDanhSach  ý kiến cá nhân (Enter để gửi)
   Tệp đính kèm của tin: SV_Files (chỉ xem). Nội dung tin (NOIDUNG) là HTML do
   người soạn tin nhập ở phân hệ Tin tức — hiện nguyên như bản gốc.

   Khác bản gốc:
     · "Đã lưu": bản gốc so ID của dòng LƯU TRỮ với id tin (checkDaLuu) nên tin
       đã lưu vẫn hiện nút "Lưu đánh dấu" — bấm lại là lưu trùng. Ở đây so theo
       TINTUC_BANGTIN_ID.
   Mở thẳng một tin từ bảng điều khiển (gốc: main_doc.DashBoard.objTinTuc) → dashboard/dashboard đặt
   ums.state.moTin = dòng tin rồi mở chức năng "#tintuc"; màn này nạp xong thì xem ngay tin đó.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tintuc');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function anh(p) { return p ? (ums.session.rootPathUpload || '') + '/' + String(p).replace(/^\/+/, '') : ''; }

    root.innerHTML =
        pat.page('Tin tức', '') +
        pat.filterBar([
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'tu', label: 'Từ ngày', type: 'date' },
            { key: 'den', label: 'Đến ngày', type: 'date' }
        ]) +
        '<div class="tt-nguon ums-u-mb-4" data-z="nguon"></div>' +
        '<div class="tt-trang">' +
            '<div class="tt-trang__chinh">' +
                '<div class="tt-luoi" data-z="luoi"></div>' +
                '<div data-z="bai" hidden></div>' +
            '</div>' +
            '<aside class="tt-trang__phu" data-z="luuWrap" hidden>' +
                pat.panel({ title: 'Tin đã đánh dấu', icon: 'fa-bookmark', zone: 'luu', flush: true }) +
            '</aside>' +
        '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var nguon = '', dsTin = [], dsLuu = [], dangXem = '';

    function the(x, id, boLuuDuoc) {
        var p = anh(x.DUONGDANANHHIENTHI);
        return '<div class="tt-the__bao">' + (boLuuDuoc ? '<button type="button" class="ums-iconbtn ums-iconbtn--del tt-the__bo" data-boluu="' + esc(id) + '" title="Bỏ lưu"><i class="fa-light fa-bookmark-slash"></i></button>' : '') +
            '<button type="button" class="tt-the" data-tin="' + esc(id) + '">' +
            '<span class="tt-the__anh">' + (p ? '<img alt="" src="' + esc(p) + '" onerror="this.remove()">' : '') + '<i class="fa-light fa-newspaper"></i></span>' +
            '<span class="tt-the__noi"><b class="tt-the__td">' + esc(e(x.TIEUDE)) + '</b>' +
            '<span class="tt-the__meta"><span><i class="fa-light fa-caret-right"></i> ' + esc(e(x.DAOTAO_COCAUTOCHUC_TEN)) + '</span>' +
            '<span><i class="fa-light fa-calendar"></i> ' + esc(e(x.NGAYBATDAU)) + '</span></span></span></button>';
    }

    function veNguon(ds) {
        z('nguon').innerHTML = [{ ID: '', TEN: 'Toàn bộ' }].concat(ds).map(function (x) {
            return '<button type="button" class="ums-btn ums-btn--sm ' + (x.ID === nguon ? 'ums-btn--primary' : 'ums-btn--ghost') + '" data-nguon="' + esc(x.ID) + '">' + esc(e(x.TEN)) + '</button>';
        }).join(' ');
    }
    var dsNguon = [];
    ums.api.call({ action: 'TT_DonViCungCapNguon/LayDanhSach', method: 'GET', strQLSV_NguoiHoc_Id: uid() })
        .then(function (r) { dsNguon = arr(r.data); veNguon(dsNguon); }, function (err) { veNguon([]); ums.api.handle(err, 'nguồn tin'); });
    veNguon([]);

    function veDs() {
        z('luoi').innerHTML = dsTin.length ? dsTin.map(function (x) { return the(x, x.ID); }).join('') : ui.empty('Không có tin nào', 'fa-newspaper');
    }
    function taiTin() {
        dong();
        z('luoi').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'TT_BangTin_NguoiDung/LayDanhSach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strTuNgay: f('tu').value, strDenNgay: f('den').value,
            strNguoiThucHien_Id: uid(), strChuyenMuc_Id: '', strChung_UngDung_Id: ums.state.roleId || '',
            dTinQuanTrong: -1, strDaoTao_CoCauToChuc_Id: nguon, dHieuLuc: 1, pageIndex: 1, pageSize: 10000
        }).then(function (r) { dsTin = arr(r.data); veDs(); })
          .catch(function (err) { z('luoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'bảng tin'); });
    }
    function taiLuu() {
        return ums.api.call({ action: 'TT_LuuTru/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(),
            strTinTuc_BangTin_Id: '', strNguoiDung_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
            dsLuu = arr(r.data);
            z('luuWrap').hidden = !dsLuu.length;
            z('luu').innerHTML = dsLuu.map(function (x) { return the(x, x.TINTUC_BANGTIN_ID, true); }).join('');
            nutLuu();
        }).catch(function (err) { ums.api.handle(err, 'tin đã đánh dấu'); });
    }
    function daLuu(id) { return dsLuu.some(function (x) { return x.TINTUC_BANGTIN_ID === id; }); }
    /* Bỏ lưu — bản gốc chưa có (nút "Đã lưu" trơ, delete_DanhDau bị chú thích).
       Controller TT_LuuTru theo quy ước CRUD của hệ (LayDanhSach · ThemMoi · Xoa)
       → dùng TT_LuuTru/Xoa; ĐƯỜNG GHI MỚI, cần thử trên host. */
    function boLuu(id) {
        if (!id) return;
        ui.confirm('Bỏ lưu tin này khỏi danh sách đã đánh dấu?', { title: 'Xác nhận' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: 'TT_LuuTru/Xoa', strTinTuc_BangTin_Id: id, strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Đã bỏ lưu', 'ok'); return taiLuu(); })
                .catch(function (err) { ums.api.handle(err, 'bỏ lưu tin'); });
        });
    }
    function nutLuu() {
        var b = root.querySelector('[data-a="luu"]');
        if (!b) return;
        var ok = daLuu(dangXem);
        b.disabled = ok;
        /* Đã lưu thì đổi thành BỎ LƯU (bản gốc để nút "Đã lưu" trơ, không xử lý) */
        b.className = 'ums-btn ums-btn--' + (ok ? 'out-danger' : 'out-warn');
        b.setAttribute('data-a', ok ? 'boluu' : 'luu');
        b.innerHTML = ok ? '<i class="fa-light fa-bookmark-slash"></i><span>Bỏ lưu</span>' : '<i class="fa-light fa-bookmark"></i><span>Lưu đánh dấu</span>';
    }

    function binhLuan() {
        var host = root.querySelector('[data-z="bl"]');
        if (!host) return;
        ums.api.call({ action: 'TT_BinhLuan/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(),
            strTinTuc_BangTin_Id: dangXem, strNguoiDung_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
            var ds = arr(r.data);
            root.querySelector('[data-z="blDem"]').textContent = 'Bình luận (' + ds.length + ')';
            host.innerHTML = ds.map(function (x) {
                return '<div class="tt-bl"><i class="fa-light fa-circle-user tt-bl__anh"></i><div><b>' + esc(e(x.NGUOIDUNG_TENDAYDU)) + '</b> ' + esc(e(x.NOIDUNG)) +
                    '<div class="ums-u-faint ums-u-fz12"><i class="fa-light fa-calendar"></i> ' + esc(ui.ngayGio(x.NGAYTAO)) + '</div></div></div>';
            }).join('');
        }).catch(function (err) { ums.api.handle(err, 'bình luận'); });
    }

    function xem(id) {
        var x = dsTin.filter(function (r) { return r.ID === id; })[0] ||
                dsLuu.filter(function (r) { return r.TINTUC_BANGTIN_ID === id; })[0];
        if (!x) return;
        dangXem = id;
        var bai = z('bai');
        bai.innerHTML = pat.panel({
            title: 'Tin tức', icon: 'fa-newspaper',
            tools: ui.btn('close', { text: 'Quay lại', attr: { 'data-a': 'dong' } }) + ui.btn('save', { mod: 'out-warn', attr: { 'data-a': 'luu' } }),
            body: '<h2 class="tt-bai__td">' + esc(e(x.TIEUDE)) + '</h2>' +
                '<div class="tt-the__meta ums-u-mb-4"><span><i class="fa-light fa-building"></i> ' + esc(e(x.DAOTAO_COCAUTOCHUC_TEN)) + '</span>' +
                '<span><i class="fa-light fa-calendar"></i> ' + esc(e(x.NGAYBATDAU)) + '</span></div>' +
                '<div class="tt-bai__nd">' + e(x.NOIDUNG) + '<div class="tt-bai__tg">' + esc(e(x.NGUOITAO_TENDAYDU)) + '</div></div>' +
                '<div class="ums-u-mt-4" data-z="tep"></div>' +
                '<div class="ums-legend ums-legend--cach">Ý kiến cá nhân</div>' +
                '<textarea class="ums-textarea" data-z="ykien" placeholder="Nhập ý kiến rồi bấm Enter để gửi"></textarea>' +
                '<div class="ums-u-mt-3"><b data-z="blDem">Bình luận (0)</b></div><div data-z="bl"></div>'
        });
        z('luoi').hidden = true; bai.hidden = false;
        ums.files.mount(bai.querySelector('[data-z="tep"]'), { api: 'SV_Files', readonly: true }).load(x.ID);
        nutLuu(); binhLuan();
        ums.api.call({ action: 'TT_LuotXem/ThemMoi', strTinTuc_BangTin_Id: id, strDiaChiMayTram: '', strTrinhDuyetSuDungTruyCap: '',
            strTenThietBi: '', strThoiGianMayTram: '', strNguoiThucHien_Id: uid(), silent: true }).catch(function () {});
    }
    function dong() { dangXem = ''; z('bai').hidden = true; z('bai').innerHTML = ''; z('luoi').hidden = false; }

    root.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t.closest('[data-a="search"]')) { taiTin(); return; }
        var n = t.closest('[data-nguon]');
        if (n) { nguon = n.getAttribute('data-nguon'); veNguon(dsNguon); taiTin(); return; }
        var th = t.closest('[data-tin]');
        if (th) { xem(th.getAttribute('data-tin')); return; }
        if (t.closest('[data-a="dong"]')) { dong(); return; }
        var bo = t.closest('[data-boluu]');
        if (bo) { boLuu(bo.getAttribute('data-boluu')); return; }
        if (t.closest('[data-a="boluu"]')) { boLuu(dangXem); return; }
        if (t.closest('[data-a="luu"]')) {
            ums.api.call({ action: 'TT_LuuTru/ThemMoi', strTinTuc_BangTin_Id: dangXem, strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid() })
                .then(taiLuu).catch(function (err) { ums.api.handle(err, 'lưu đánh dấu'); });
        }
    });
    root.addEventListener('keydown', function (ev) {
        var t = ev.target;
        if (ev.key !== 'Enter') return;
        if (t.matches('[data-f="q"]')) { ev.preventDefault(); taiTin(); }
        if (t.matches('[data-z="ykien"]') && !ev.shiftKey) {
            ev.preventDefault();
            var nd = t.value.trim();
            if (!nd) return;
            ums.api.call({ action: 'TT_BinhLuan/ThemMoi', strTinTuc_BangTin_Id: dangXem, strNguoiDung_Id: '', strNoiDung: nd, strNguoiThucHien_Id: uid() })
                .then(function () { t.value = ''; binhLuan(); }).catch(function (err) { ums.api.handle(err, 'gửi ý kiến'); });
        }
    });

    taiTin().then(function () {
        var mo = ums.state && ums.state.moTin;
        if (!mo) return;
        delete ums.state.moTin;
        if (!dsTin.some(function (r) { return r.ID === mo.ID; })) dsTin.push(mo);
        xem(mo.ID);
    });
    taiLuu();
})();
