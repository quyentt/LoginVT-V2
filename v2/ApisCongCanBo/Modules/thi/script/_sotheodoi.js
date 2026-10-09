/* =========================================================================
   thi — sổ theo dõi phân công (CHỈ XEM) dùng chung cho coithi / chamthi / chamtui
   ums.thi.soTheoDoi(root, cfg). Bản gốc: thi/script/coithi.js, chamthi.js, chamtui.js — chép nhau
   từng dòng, chỉ khác bộ action/func (hậu tố CoiThi / ChamThi / ChamThiTui) và chamtui thêm ô Đợt phách.
   ---------------------------------------------------------------------------
   Lời gọi (mã hoá, XLHV_TP_PhanCong_SoTheoDoi_MH · PKG_THI_PHANCONG_SOTHEODOI.* — bảng ở từng màn):
       Thời gian (tự chọn mục đầu) → Đợt thi · Học phần (TEN - MA) · [Đợt phách] · GV được phân → Người phân ·
       Hình thức thi → Phòng thi → Ngày thi; các ô con TỰ CHỌN khi chỉ có một mục (selectOne như gốc)
       Danh sách: strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strThi_DotThi_Id, strDaoTao_HocPhan_Id, [strThi_DotPhach_Id],
         strGVDuocPhanCoiThi_Id, strGVThucHienPhanCoiThi_Id, strThi_HinhThucThi_Id, strTKB_PhongThi_Id, strNgayThi
         (tên tham số "CoiThi" dùng chung cả ba màn — như gốc)
       Báo cáo (coithi, chamthi): ums.report.mount — cùng các khoá của danh sách (không Đợt phách)
   Không chép (lỗi rõ của bản gốc):
     · Ô Học phần vẽ vào id KHÔNG tồn tại (dropSearch_MonThi) → không bao giờ nạp; kéo theo Đợt phách không nạp.
     · Ô Phòng thi vẽ vào id sai ("TENPHONGHOC") → không bao giờ nạp. Tên cột hiển thị đoán TENPHONGHOC, thiếu thì TEN.
     · "Người phân" nạp song song với ô nó phụ thuộc, chọn GV được phân không nạp lại → nạp lại theo GV được phân.
     · Mở màn tải danh sách KHÔNG lọc (chưa có thời gian) → tải sau khi đã chọn thời gian.
     · Tiêu đề trang cả ba màn ghi "Phân coi thi" → theo tên màn.
   Chờ nghiệp vụ:
     · Đổi ô lọc KHÔNG tự tải lại danh sách (như gốc) — bấm "Danh sách".
     · Chấm thi / chấm túi đọc cột GIANGVIENCOITHI_* / GIANGVIENPHANCOITHI_* (như gốc) — kiểm trên host.
     · Chấm túi: vùng báo cáo có trong html nhưng gốc không nạp mẫu → không có nút báo cáo.
     · Cột ô đánh dấu không thao tác nào dùng (nút "Phân chấm và nhập điểm" bị chú thích) — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var thi = ums.thi = ums.thi || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var AC = 'XLHV_TP_PhanCong_SoTheoDoi_MH/', FN = 'PKG_THI_PHANCONG_SOTHEODOI.';

    thi.soTheoDoi = function (root, cfg) {
        var A = cfg.A, nhan = cfg.nhan;   // A[vai] = [mã action, tên func]
        function goi(k, o) { return ums.api.call(Object.assign({ action: AC + A[k][0], func: FN + A[k][1], strNguoiThucHien_Id: uid() }, o)); }
        var loc = [{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' }, { key: 'hp', type: 'select', label: 'Chọn học phần' }];
        if (cfg.coPhach) loc.push({ key: 'dp', type: 'select', label: 'Chọn đợt phách' });
        loc.push({ key: 'gv', type: 'select', label: 'Chọn được phân ' + nhan }, { key: 'ng', type: 'select', label: 'Chọn giảng viên thực hiện phân ' + nhan },
            { key: 'ht', type: 'select', label: 'Chọn hình thức thi' }, { key: 'ph', type: 'select', label: 'Chọn phòng thi' }, { key: 'nt', type: 'select', label: 'Chọn ngày thi' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' });
        root.innerHTML = pat.page(cfg.tieuDe, cfg.baoCao ? '<span data-z="bc"></span>' : '') +
            pat.filterBar(loc, { searchText: 'Danh sách' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }

        /* ---------- Bộ lọc ------------------------------------------------ */
        var CH = [pat.chain([f('tg'), f('dot')], { phatLai: false }), pat.chain([f('tg'), f('hp')], { phatLai: false }), pat.chain([f('tg'), f('gv'), f('ng')], { phatLai: false }),
            pat.chain([f('tg'), f('ht'), f('ph'), f('nt')], { phatLai: false })];
        if (cfg.coPhach) CH.push(pat.chain([f('hp'), f('dp')], { phatLai: false }));
        function sync() { CH.forEach(function (c) { c.sync(); }); }
        function chung() { return { strDaoTao_HocPhan_Id: v('hp'), strThi_DotThi_Id: v('dot'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }
        var O = {
            dot: ['dotThi', 'tg', function () { return { strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, 'TENDOTTHI', 'Chọn đợt thi'],
            hp: ['hocPhan', 'tg', function () { return { strThi_DotThi_Id: v('dot'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }; }, function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, 'Chọn học phần'],
            dp: ['dotPhach', 'hp', chung, 'TEN', 'Chọn đợt phách'],
            gv: ['gvPhan', 'tg', chung, 'GIANGVIEN', 'Chọn được phân ' + nhan],
            ng: ['nguoiPhan', 'gv', function () { return Object.assign({ strGiangVienCoiThi_Id: v('gv') }, chung()); }, 'GIANGVIEN', 'Chọn giảng viên thực hiện phân ' + nhan],
            ht: ['hinhThuc', 'tg', chung, 'TENHINHTHUCTHI', 'Chọn hình thức thi'],
            ph: ['phongThi', 'ht', function () { return Object.assign({ strThi_HinhThucThi_Id: v('ht') }, chung()); }, function (x) { return e(x.TENPHONGHOC) || e(x.TEN); }, 'Chọn phòng thi'],
            nt: ['ngayThi', 'ht', function () { return Object.assign({ strTKB_PhongThi_Id: v('ph'), strThi_HinhThucThi_Id: v('ht') }, chung()); }, 'NGAYTHI', 'Chọn ngày thi']
        };
        function nap(k) {
            var o = O[k];
            if (!o || !f(k)) return Promise.resolve();
            if (!v(o[1])) { pat.fill(f(k), []); sync(); return Promise.resolve(); }
            return goi(o[0], o[2]()).then(function (r) {
                var d = arr(r.data);
                pat.fill(f(k), d, { name: o[3], head: o[4] });
                if (d.length === 1) { f(k).value = d[0].ID; if (window.jQuery) jQuery(f(k)).trigger('change.select2'); }   // selectOne
                sync();
            }).catch(function (err) { ums.api.handle(err, o[4]); });
        }
        function napLan(ds) { return ds.reduce(function (p, k) { return p.then(function () { return nap(k); }); }, Promise.resolve()); }
        var SAU = { tg: ['dot', 'hp', 'dp', 'gv', 'ng', 'ht', 'ph', 'nt'], dot: ['hp', 'dp', 'gv', 'ng', 'ht', 'ph', 'nt'], hp: ['dp', 'gv', 'ng', 'ht', 'ph', 'nt'],
            gv: ['ng'], ht: ['ph', 'nt'], ph: ['nt'] };
        if (window.jQuery) Object.keys(SAU).forEach(function (k) { if (f(k)) jQuery(f(k)).on('select2:select select2:clear', function () { napLan(SAU[k]); }); });
        goi('thoiGian', {}).then(function (r) {
            var d = arr(r.data);
            pat.fill(f('tg'), d, { name: 'THOIGIAN', head: 'Chọn thời gian' });
            if (d.length) { f('tg').value = d[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); }   // selectFirst
            sync();
            return napLan(SAU.tg);
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); }).then(tai);

        /* ---------- Danh sách --------------------------------------------- */
        function thamSo() {
            var o = { strTuKhoa: v('q'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('hp') };
            if (cfg.coPhach) o.strThi_DotPhach_Id = v('dp');
            return Object.assign(o, { strGVDuocPhanCoiThi_Id: v('gv'), strGVThucHienPhanCoiThi_Id: v('ng'), strThi_HinhThucThi_Id: v('ht'), strTKB_PhongThi_Id: v('ph'), strNgayThi: v('nt') });
        }
        function gv(x, p) { return esc(e(x[p + '_HODEM']) + ' ' + e(x[p + '_TEN']) + ' - ' + e(x[p + '_MA'])); }
        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return goi('list', thamSo()).then(function (r) {
                var ds = arr(r.data);
                z('n').textContent = '(' + ds.length + ')';
                var cot = [{ title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' }];
                if (cfg.coPhach) cot.push({ title: 'Đợt phách', prop: 'THI_DOTPHACH_TEN' }, { title: 'Túi', prop: 'THI_TUIBAI_TEN', cls: 'is-center' });
                cot.push({ title: 'Danh sách thi', prop: 'THI_DANHSACHTHI_TEN' }, { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' }, { title: 'Hình thức thi', prop: 'THI_HINHTHUCTHI_TEN' }, { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' },
                    { title: 'Ca thi', prop: 'THI_CATHI_TEN', cls: 'is-center' }, { title: 'Phòng thi', prop: 'TKB_PHONGHOC_TEN', cls: 'is-center' }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
                    { title: 'GV ' + cfg.nhanHoa, render: function (x) { return gv(x, 'GIANGVIENCOITHI'); } }, { title: 'Người phân ' + nhan, render: function (x) { return gv(x, 'GIANGVIENPHANCOITHI'); } },
                    { title: 'Đợt thi', prop: 'THI_DOTTHI_TEN' },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
                ui.table({ el: z('bang'), rows: ds, columns: cot, empty: 'Không có dữ liệu' });
            }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách'); });
        }
        if (cfg.baoCao) ums.report.mount(z('bc'), { reportText: 'Báo cáo', collect: function (add) {
            var o = thamSo(); delete o.strThi_DotPhach_Id;
            Object.keys(o).forEach(function (k) { add(k, o[k]); });
        } });
        root.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) tai(); });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
    };
})();
