/* =========================================================================
   dangkymonthi — Cổng sinh viên › Đăng ký môn thi (vai trò thủ vai: người học = ums.session.userId).
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/dangkymonthi.html + script/dangkymonthi.js (vỏ index).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc, MỘT cột: ô "Chương trình đang học" + Xem → lưới THẺ kế hoạch (Đăng ký · Kết quả).
   Bấm "Đăng ký" → lưới thẻ học phần (môn thi) được đăng ký THAY CHỖ lưới kế hoạch; "Kết quả" → lưới thẻ
   đã đăng ký (Hủy đăng ký). Thẻ dựng bằng ums.pat.cards (thẻ có nút thao tác).

   Lời gọi (chép nguyên action / func / tên tham số):
     DKH_DangKyThi_MonThi_Chung_MH · pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc (strQLSV_NguoiHoc_Id)
         → ô chương trình (DAOTAO_TOCHUCCHUONGTRINH_ID / DAOTAO_CHUONGTRINH_TEN); có dữ liệu thì chọn mục đầu
           rồi nạp kế hoạch (gốc: viewValById bắn 'change' → getList_KeHoach).
     … pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc (strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id)
         → thẻ: TENKEHOACH · TUNGAY/DENNGAY · MUCPHIDANGKY · NGAYHANNOPPHI.
     DKH_DangKyThi_MonThi_ThongTin_MH · pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy
         (strChucNang_Id, strDaoTao_ChuongTrinh_Id, strQLSV_NguoiHoc_Id, strDangKy_Thi_HP_KeHoach_Id = ID kế hoạch)
         → "Đăng ký" đọc Data.rsHocPhanDuDK (rỗng → "Đã đăng ký"); "Kết quả" đọc Data.rsKetQua (rỗng → "Bạn chưa đăng ký").
         Thẻ: DAOTAO_HOCPHAN_TEN (Ngôn ngữ thi) · TRINHDO · THOIGIANTHIDUKIEN · DIADIEMTHI · MUCPHIDANGKY · NGAYHANNOPPHI.
     … ThucHienDangKy (strDangKy_Thi_HP_KeHoach_Id = DANGKY_THI_HP_KEHOACH_ID, strQLHLTL_NguoiHoc_Id = ID thẻ)
     … ThucHienHuyDangKy (strDangKy_Thi_HP_KeHoach_Id = DANGKY_THI_HP_KEHOACH_ID, strDangKy_Thi_HocPhan_KQ_Id = ID thẻ)
     strNguoiThucHien_Id = edu.system.userId ở gốc → để api.js tự điền (cùng giá trị).

   Khác bản gốc:
     · Tiêu đề: gốc ghi breadcrumb "Gia hạn thanh toán" (chép nhầm từ màn khác) → "Đăng ký môn thi" theo tên chức năng.
     · Nút "Quay lại" trên TỪNG thẻ → MỘT nút "Đóng" ở đầu khung (luật chung: đóng khung chi tiết bằng "Đóng").
     · Đăng ký / Hủy xong: gốc gọi start_Progress("zoneprocessXXXX") với vùng KHÔNG tồn tại, callback (hai hàm
       getList_ChuaDangKy / getList_DaDangKy cũng không tồn tại) không bao giờ chạy → chỉ quay về lưới kế hoạch.
       Bản mới làm đúng như vậy (không nạp lại gì thêm).
     · Hộp hỏi lại gốc gắn thêm trình xử lý mỗi lần mở ($("#btnYes").click) — bấm lần 2 là gửi 2 lần; ums.ui.confirm hết lỗi đó.
     · Lệ phí ở thẻ môn thi gốc in số thô ("450000đ") → định dạng tiền như thẻ kế hoạch.
     · Xoá trắng ô chương trình → lưới về lời nhắc (gốc: không làm gì, thẻ cũ nằm nguyên).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('dkh-dangkymonthi');
    var SV = (ums.session && ums.session.userId) || '';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var CHUNG = 'DKH_DangKyThi_MonThi_Chung_MH/', TT = 'DKH_DangKyThi_MonThi_ThongTin_MH/';
    var dtKeHoach = [], dtDangKy = [], dtKetQua = [];

    root.innerHTML = pat.page('Đăng ký môn thi', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
            ui.field('Chương trình đang học', '<select class="ums-select" data-f="ct" data-ph="Chọn chương trình"><option value=""></option></select>', { inline: true }) +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem', icon: 'fa-magnifying-glass', attr: { 'data-a': 'xem' } }) + '</div></div>' }) +
        '<div data-v="kehoach">' + pat.panel({ title: false, flush: true, zone: 'kehoach' }) + '</div>' +
        '<div data-v="dangky" hidden>' + pat.panel({ title: 'Đăng ký', icon: 'fa-pen-to-square', flush: true, zone: 'dangky',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) + '</div>' +
        '<div data-v="ketqua" hidden>' + pat.panel({ title: 'Kết quả', icon: 'fa-square-poll-vertical', flush: true, zone: 'ketqua',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) + '</div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    function hienVung(k) {
        var dang = ['kehoach', 'dangky', 'ketqua'].filter(function (x) { return !vung(x).hidden; })[0];
        if (dang === k) return;
        ['kehoach', 'dangky', 'ketqua'].forEach(function (x) { if (x !== k && x !== dang) vung(x).hidden = true; });
        ui.swap(vung(dang), vung(k));
    }
    function tieuDe(k, t) { var el = vung(k).querySelector('.ums-panel__title'); if (el) el.lastChild.textContent = ' ' + t; }

    /* ---------- Thẻ ------------------------------------------------------ */
    function thoiGian(kh) { return e(kh.TUNGAY) + ' đến ' + e(kh.DENNGAY); }
    function tien(v) { return ui.money(v) + ' đ'; }
    function theMonThi(kh, a) {
        return '<span class="ums-card__no dkmt-ten">' + esc(e(kh.TENKEHOACH)) + '</span>' +
            pat.cardRow('Thời gian đăng ký', thoiGian(kh)) +
            pat.cardRow('Ngôn ngữ thi', a.DAOTAO_HOCPHAN_TEN) +
            pat.cardRow('Trình độ', a.TRINHDO) +
            pat.cardRow('Ngày thi dự kiến', a.THOIGIANTHIDUKIEN) +
            pat.cardRow('Địa điểm thi', a.DIADIEMTHI) +
            pat.cardRow('Lệ phí', tien(a.MUCPHIDANGKY) + ' / lần đăng ký') +
            pat.cardRow('Hạn nộp phí', a.NGAYHANNOPPHI);
    }
    function veKeHoach() {
        pat.cards({ el: z('kehoach'), items: dtKeHoach, empty: 'Không có kế hoạch đăng ký môn thi', emptyIcon: 'fa-calendar-xmark',
            tone: function () { return 'warn'; },
            render: function (kh) {
                return '<span class="ums-card__no dkmt-ten">' + esc(e(kh.TENKEHOACH)) + '</span>' +
                    pat.cardRow('Thời gian đăng ký', thoiGian(kh)) +
                    pat.cardRow('Mức phí đăng ký', tien(kh.MUCPHIDANGKY)) +
                    pat.cardRow('Hạn nộp phí', kh.NGAYHANNOPPHI);
            },
            actions: function (kh, i) {
                return ui.btn('save', { text: 'Đăng ký', icon: 'fa-pen-to-square', attr: { 'data-a': 'dk', 'data-i': i } }) +
                    ui.btn('search', { text: 'Kết quả', mod: 'out-primary', icon: 'fa-square-poll-vertical', attr: { 'data-a': 'kq', 'data-i': i } });
            } });
    }

    /* ---------- Nạp dữ liệu --------------------------------------------- */
    function taiKeHoach() {
        z('kehoach').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        hienVung('kehoach');
        return ums.api.call({ action: CHUNG + 'DSA4BRIKJAkuICIpFSkkLg8mNC4oCS4i', func: 'pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc',
            strDaoTao_ChuongTrinh_Id: f('ct').value, strQLSV_NguoiHoc_Id: SV })
            .then(function (r) { dtKeHoach = arr(r.data); veKeHoach(); })
            .catch(function (err) { z('kehoach').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kế hoạch'); });
    }
    function taiHocPhan(kh) {
        return ums.api.call({ action: TT + 'DSA4BRIJLiIRKSAvBSAvJgo4', func: 'pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy',
            strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strDaoTao_ChuongTrinh_Id: f('ct').value,
            strQLSV_NguoiHoc_Id: SV, strDangKy_Thi_HP_KeHoach_Id: e(kh.ID) }).then(function (r) { return r.data || {}; });
    }
    function moDangKy(kh) {
        taiHocPhan(kh).then(function (d) {
            dtDangKy = arr(d.rsHocPhanDuDK);
            if (!dtDangKy.length) { ui.toast('Đã đăng ký', 'info'); return; }
            tieuDe('dangky', 'Đăng ký: ' + e(kh.TENKEHOACH));
            pat.cards({ el: z('dangky'), items: dtDangKy, tone: function () { return 'ok'; },
                render: function (a) { return theMonThi(kh, a); },
                actions: function (a, i) { return ui.btn('save', { text: 'Đăng ký', icon: 'fa-pen-to-square', attr: { 'data-a': 'dkhp', 'data-i': i } }); } });
            hienVung('dangky');
        }).catch(function (err) { ums.api.handle(err, 'môn thi được đăng ký'); });
    }
    function moKetQua(kh) {
        taiHocPhan(kh).then(function (d) {
            dtKetQua = arr(d.rsKetQua);
            if (!dtKetQua.length) { ui.toast('Bạn chưa đăng ký', 'info'); return; }
            tieuDe('ketqua', 'Kết quả: ' + e(kh.TENKEHOACH));
            pat.cards({ el: z('ketqua'), items: dtKetQua,
                render: function (a) { return theMonThi(kh, a); },
                actions: function (a, i) { return ui.btn('search', { text: 'Hủy đăng ký', mod: 'out-primary', icon: 'fa-xmark', attr: { 'data-a': 'huy', 'data-i': i } }); } });
            hienVung('ketqua');
        }).catch(function (err) { ums.api.handle(err, 'kết quả đăng ký'); });
    }

    /* ---------- Ghi -------------------------------------------------------- */
    function dangKyHocPhan(a) {
        ui.confirm('Bạn có chắc chắn không?', { ok: 'Đăng ký' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: TT + 'FSk0IgkoJC8FIC8mCjgP', func: 'pkg_dangkythi_monthi_thongtin.ThucHienDangKy',
                strDangKy_Thi_HP_KeHoach_Id: e(a.DANGKY_THI_HP_KEHOACH_ID), strQLHLTL_NguoiHoc_Id: e(a.ID) })
                .then(function () { ui.toast('Đăng ký thành công!', 'ok'); hienVung('kehoach'); })
                .catch(function (err) { if (err && err.expired) return ums.api.handle(err); ui.toast('Đăng ký thất bại: ' + err.message, 'bad'); });
        });
    }
    function huyDangKy(a) {
        ui.confirm('Bạn có chắc chắn không?', { tone: 'bad', ok: 'Hủy đăng ký' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: TT + 'FSk0IgkoJC8JNDgFIC8mCjgP', func: 'pkg_dangkythi_monthi_thongtin.ThucHienHuyDangKy',
                strDangKy_Thi_HP_KeHoach_Id: e(a.DANGKY_THI_HP_KEHOACH_ID), strDangKy_Thi_HocPhan_KQ_Id: e(a.ID) })
                .then(function () { ui.toast('Thực hiện thành công!', 'ok'); hienVung('kehoach'); })
                .catch(function (err) { if (err && err.expired) return ums.api.handle(err); ui.toast('Thực hiện thất bại: ' + err.message, 'bad'); });
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a'), i = Number(b.getAttribute('data-i'));
        if (a === 'xem') taiKeHoach();
        else if (a === 'dong') hienVung('kehoach');
        else if (a === 'dk') moDangKy(dtKeHoach[i]);
        else if (a === 'kq') moKetQua(dtKeHoach[i]);
        else if (a === 'dkhp') dangKyHocPhan(dtDangKy[i]);
        else if (a === 'huy') huyDangKy(dtKetQua[i]);
    });
    function nhac() { dtKeHoach = []; z('kehoach').innerHTML = ui.empty('Chọn chương trình đang học rồi bấm "Xem"', 'fa-hand-pointer'); hienVung('kehoach'); }
    if (window.jQuery) {
        // Gốc nghe 'change' và bỏ qua khi ô trống; xoá trắng thì đưa lưới về lời nhắc
        jQuery(f('ct')).on('select2:select', function () { if (f('ct').value) taiKeHoach(); });
        jQuery(f('ct')).on('select2:clear', nhac);
    }

    nhac();
    ums.api.call({ action: CHUNG + 'DSA4BRICKTQuLyYVMygvKQ8mNC4oCS4i', func: 'pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc', strQLSV_NguoiHoc_Id: SV })
        .then(function (r) {
            var d = arr(r.data);
            pat.fill(f('ct'), d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN', head: 'Chọn chương trình' });
            if (d.length) {
                f('ct').value = d[0].DAOTAO_TOCHUCCHUONGTRINH_ID;
                if (window.jQuery) jQuery(f('ct')).trigger('change.select2');
                taiKeHoach();
            }
        })
        .catch(function (err) { ums.api.handle(err, 'chương trình'); });
})();
