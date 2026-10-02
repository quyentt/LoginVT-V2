/* =========================================================================
   thi — phân công cán bộ coi thi / chấm thi theo danh sách thi hoặc túi bài — ums.thi.phanCong(root, cfg)
   Dùng cho phancoithi, phanchamthi, phanchamtui, sotheodoiphancoithi.
   Bản gốc: thi/script/phancoithi.js · phanchamthi.js (~95% trùng) · phanchamtui.js (= phanchamthi + Đợt phách);
   sotheodoiphancoithi.html nạp CHÍNH phanchamthi.js (tệp riêng sotheodoiphancoithi.js không nơi nào nạp).
   ---------------------------------------------------------------------------
   Lời gọi (mã hoá, chép nguyên):
       Lọc ums.thi.loc — pkg_thi_phach_chung: LayThoiGian → LayLoaiDiem → LayHinhThucThi → LayDotThi → LayHocPhan [→ LayDotTaoPhach]
         (Đơn vị strDaoTao_CoCauToChuc_Id gửi thêm vào LayDotThi / LayHocPhan; Đơn vị = ums.ref.coCauToChuc)
       Danh sách thi: XLHV_TP_PhanCong_MH · pkg_thi_phancong.LayDSThiTheoDotThi (strTuKhoa, strChucNang_Id, dLocKhongHoanThanhNhapDiem,
         strThi_DotThi_Id, strDaoTao_HocPhan_Id = Môn thi, strDaoTao_CoCauToChuc_Id, strTuNgay '', strDenNgay '')
       Túi bài: pkg_thi_phancong.LayDSTuiTheoDotPhach (strThi_DotPhach_Id, strDaoTao_CoCauToChuc_Id)
       Phân cán bộ: ums.thi.canBo (LayDSNhanSuPhanCong… / Them_Thi_GiaoVien_… "id;thứTự;sốLượng,…" / Xoa_Thi_GiaoVien_…)
       Ngày nhận bài (chấm thi, chấm túi): pkg_thi_phancong.CapNhat_ThoiGianNhanBai (strThi_GV_ChamThi_Id = ID DÒNG, strNgayNhanBai)
       Báo cáo: ums.report.mount · Import (phancoithi): ums.report.importChung('chấm thi', 'IMPORTWITHPROC_PCTCT')
   Không chép (lỗi rõ của bản gốc):
     · Báo cáo đọc ô KHÔNG tồn tại dropSearch_HocPhan → gửi Môn thi làm strDaoTao_HocPhan_Id; các ô khác không có ở màn → null như gốc.
     · Đổi ô cha: các ô con nạp song song với giá trị con CŨ → nạp lần lượt, xoá con (pat.chain).
     · Lưu / xoá phân công chỉ nạp lại hộp, cột "đã phân công" của danh sách cũ → nạp lại cả danh sách.
     · Ngày nhận bài lưu ở MỌI lần rời ô (kể cả không đổi), mỗi lần một thông báo → chỉ lưu khi đổi, ô chọn ngày.
     · Chấm túi: nút "Cán bộ coi thi" mở hộp khi chưa chọn gì (lưu ra chuỗi ";tt;sl") → bỏ; ô từ khoá không gửi → lọc trên danh sách.
     · Sổ theo dõi: bảng thiếu hàng tiêu đề thứ hai, hộp cán bộ 6 tiêu đề / 8 cột → đủ tiêu đề.
     · Tiêu đề trang cả năm màn ghi "Phân coi thi" → theo tên màn.
   Chờ nghiệp vụ:
     · Danh sách chỉ lọc theo Đợt thi / Môn thi / Đơn vị (KHÔNG gửi Thời gian, Loại điểm, Hình thức) — giữ như gốc.
     · Chấm túi gửi id TÚI qua tham số tên "…DanhSachThi / GV_ChamThi" — kiểm trên host.
     · Sổ theo dõi phân COI thi nhưng mã gốc làm phân CHẤM thi; ô Học phần / GV coi thi / Phòng thi của html gốc không nguồn → bỏ.
     · Chọn/xoá ô cha nay KHOÁ ô con (gốc để mở) — luật cha → con của dự án.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, thi = ums.thi;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var PC = 'XLHV_TP_PhanCong_MH/';
    function pc(ma, ten, o) { return ums.api.call(Object.assign({ action: PC + ma, func: 'pkg_thi_phancong.' + ten, strNguoiThucHien_Id: uid() }, o)); }
    var NHAN = { tg: 'Chọn thời gian', ld: 'Chọn loại điểm', ht: 'Chọn hình thức thi', dot: 'Chọn đợt thi', mon: 'Chọn môn thi', dp: 'Chọn đợt phách' };

    thi.phanCong = function (root, cfg) {
        var tui = cfg.kieu === 'tui', cham = cfg.kieu !== 'coi';
        var loc = cfg.tang.map(function (k) { return { key: k, type: 'select', label: NHAN[k] }; });
        if (cfg.khoa) loc.splice(cfg.tang.indexOf('dot') + 1, 0, { key: 'dv', type: 'select', label: 'Chọn đơn vị' });
        var them = '';
        if (cfg.hoanThanh) them += '<div class="ums-field"><select class="ums-select" data-f="htnd" data-no-s2><option value="0">-- Chọn hoàn thành nhập điểm --</option><option value="1">Hoàn thành nhập điểm</option></select></div>';
        if (cfg.chuaPhan) them += '<label class="ums-check thi-chk"><input type="checkbox" data-f="chua"><span>Các học phần chưa phân công</span></label>';
        loc.push({ key: 'q', label: 'Nhập từ khóa tìm kiếm' });
        root.innerHTML = pat.page(cfg.tieuDe, (cfg.baoCao ? '<span data-z="bc"></span>' : '') +
                (cfg.importMa ? ui.btn('search', { text: 'Import', icon: 'fa-cloud-arrow-up', mod: 'out-info', attr: { 'data-a': 'import', title: '1. Import phân chấm thi coi thi' } }) : '') +
                ui.btn('save', { text: cfg.nutPhan, icon: 'fa-chalkboard-user', mod: 'primary', attr: { 'data-a': 'phan' } })) +
            pat.filterBar(loc, { searchText: cfg.nutTim || 'Tìm kiếm', extra: them }) +
            pat.panel({ title: tui ? 'Danh sách túi bài' : 'Danh sách thi', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        var L = thi.loc({ f: f, tang: cfg.tang, them: function (k) { return cfg.khoa && (k === 'dot' || k === 'mon') ? { strDaoTao_CoCauToChuc_Id: v('dv') } : {}; },
            onDoi: function (k) { if (tui && k === 'dp') tai(); } });
        function v(k) { return k === 'dv' || k === 'q' || k === 'htnd' ? (f(k) ? f(k).value.trim() : '') : L.v(k); }
        if (cfg.khoa) {
            ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(f('dv'), d, { name: 'TEN', head: 'Chọn đơn vị' }); }).catch(function () {});
            if (window.jQuery) jQuery(f('dv')).on('select2:select select2:clear', function () { L.napLai('mon'); });
        }

        /* ---------- Danh sách ---------------------------------------------- */
        var ds = [], hien = [];
        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var p = tui ? pc('DSA4BRIVNCgVKSQuBS41ESkgIikP', 'LayDSTuiTheoDotPhach', { strThi_DotPhach_Id: v('dp'), strDaoTao_CoCauToChuc_Id: v('dv') })
                : pc('DSA4BRIVKSgVKSQuBS41FSko', 'LayDSThiTheoDotThi', { strTuKhoa: v('q'), strChucNang_Id: cn(), dLocKhongHoanThanhNhapDiem: v('htnd'), strThi_DotThi_Id: v('dot'),
                    strDaoTao_HocPhan_Id: v('mon'), strDaoTao_CoCauToChuc_Id: v('dv'), strTuNgay: '', strDenNgay: '' });
            return p.then(function (r) { ds = arr(r.data); ve(); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách'); });
        }
        var COT_NS = cham ? 'DSNHANSUCHAMTHI' : 'DSNHANSUCOITHI';
        function ve() {
            hien = ds;
            if (f('chua') && f('chua').checked) hien = hien.filter(function (x) { return !e(x[COT_NS]); });
            var q = v('q').toLowerCase();
            if (tui && q) hien = hien.filter(function (x) { return (e(x.TEN) + ' ' + e(x.DSLOP)).toLowerCase().indexOf(q) >= 0; });
            z('n').textContent = '(' + hien.length + ')';
            var G = [tui ? 'THÔNG TIN TÚI BÀI' : 'THÔNG TIN DANH SÁCH THI'], cot;
            if (tui) cot = [{ title: 'Túi', prop: 'TEN', group: G }, { title: 'Số bài', prop: 'SOBAI', cls: 'is-center', group: G }, { title: 'Lớp', prop: 'DSLOP', group: G }];
            else {
                cot = [{ title: 'Mã danh sách thi', prop: 'MADANHSACHTHI', cls: 'is-nowrap', group: G },
                    { title: 'Học phần', group: G, render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } }];
                if (cham) cot.push({ title: 'Lớp', prop: 'DSLOP', group: G });
                cot.push({ title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap', group: G }, { title: 'Ca thi', prop: 'THI_CATHI_TEN', cls: 'is-center', group: G },
                    { title: 'Phòng thi', prop: 'TKB_PHONGTHI_TEN', cls: 'is-center', group: G }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center', group: G });
            }
            if (cham) cot.push({ title: 'Ngày nhận bài', cls: 'is-center', width: '150px', render: function (x, i) {
                return '<input class="ums-input ums-input--sm" data-nnb="' + i + '" data-date data-goc="' + esc(e(x.NGAYNHANBAI)) + '" value="' + esc(e(x.NGAYNHANBAI)) + '" style="width:130px" autocomplete="off">'; } });
            cot.push({ title: 'Thông tin cán bộ ' + (cham ? 'chấm' : 'coi') + ' thi đã phân công', prop: COT_NS },
                { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
            ui.table({ el: z('bang'), rows: hien, columns: cot, empty: tui ? 'Chọn đợt phách để xem túi bài' : 'Không có danh sách thi' });
            if (cham) ui.enhance(z('bang'));
        }
        function daChon() {
            return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                .map(function (c) { return hien[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
        }
        if (cfg.baoCao) ums.report.mount(z('bc'), { reportText: 'Báo cáo', import: false, collect: function (add) {
            function hoac(s) { return s === '' ? undefined : s; }
            add('strTuKhoa', hoac(v('q'))); add('strDaoTao_ThoiGianDaoTao_Id', hoac(v('tg'))); add('strThi_DotThi_Id', hoac(v('dot'))); add('strDaoTao_HocPhan_Id', hoac(v('mon')));
            add('strGVDuocPhanCoiThi_Id', undefined); add('strGVThucHienPhanCoiThi_Id', undefined); add('strThi_HinhThucThi_Id', hoac(v('ht')));
            add('strTKB_PhongThi_Id', undefined); add('strNgayThi', undefined);
        } });
        L.xong.then(function () { if (!tui) z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm "' + (cfg.nutTim || 'Tìm kiếm') + '"', 'fa-hand-pointer'); else ve(); });

        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute('data-ck') === 'all') { Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; }); return; }
            if (t === f('chua')) { ve(); return; }
            if (t.hasAttribute && t.hasAttribute('data-nnb') && t.value.trim() !== t.getAttribute('data-goc')) {
                var x = hien[Number(t.getAttribute('data-nnb'))], moi = t.value.trim();
                pc('AiAxDykgNR4VKS4oBiggLw8pIC8DICgP', 'CapNhat_ThoiGianNhanBai', { strThi_GV_ChamThi_Id: x.ID, strNgayNhanBai: moi })
                    .then(function () { t.setAttribute('data-goc', moi); x.NGAYNHANBAI = moi; ui.toast('Cập nhật thành công', 'ok'); }).catch(function (err) { ums.api.handle(err, 'ngày nhận bài'); });
            }
        });
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]'); if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tai();
            else if (a === 'import') ums.report.importChung('chấm thi', cfg.importMa, { onDone: tai });
            else if (a === 'phan') {
                var chon = daChon();
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
                thi.canBo({ host: root, title: 'Cán bộ ' + (cham ? 'chấm' : 'coi') + ' thi', ids: chon.map(function (x) { return x.ID; }), ds: cfg.A.ds, them: cfg.A.them, xoa: cfg.A.xoa,
                    xemTruoc: true, danhTu: cfg.danhTu, onDone: tai });
            }
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (tui) ve(); else tai(); } });
    };
})();
