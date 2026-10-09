/* =========================================================================
   klgd — Tổng hợp khối lượng: ums.klgd.tongHop(root, kieu)
     kieu 'cu'  = tonghopkhoiluong                   (TKGG_KLGD)
          'ql'  = qlklgd_tonghopkhoiluong            (TKGG_QLKLGD)
          'gv'  = qlklgd_tonghopkhoiluong_giangvien  (TKGG_QLKLGD — khối lượng CỦA TÔI, không ô Bộ môn / Giảng viên,
                                                      không Tổng hợp / Báo cáo)
   Một cột: thanh lọc · khối "Thông tin giảng viên" (11 nhãn) · bảng "Tổng hợp khối lượng" 20 cột.
   ---------------------------------------------------------------------------
   Nguồn: Năm (GetcboSchoolYear | GetThongTinNamKyDot) · Hệ đào tạo (GetTRAININGSYSTEMList | ListDS_HeDaoTao, ID/NAME) ·
     Bộ môn (GetBoMonDuocPhanCong | LayDS_PhanQuyenNguoiDungDonVi, ID/NAME) · Giảng viên (GetListStaff NHANVIENID/HOTEN |
     GetDanhSachCanBoNienHoc STAFFID/HOTENMASO).
   Bảng: cu GetKhoiLuongThoiKhoaBieu { strBoMonId (rỗng → "#@"), strStaffId (rỗng → "#@"), strNamHoc, strHeDaoTaoId, strNguoiDung_Id }
         ql GetDanhSachPhanCong { strBoMonId, strStaffId, strHocKy '', strDotHocId '', strHeDaoTaoId, strCoSoDaoTaoId '', strKhoaHocId '',
            strNguoiThucHienId } — KHÔNG gửi năm học (như gốc); gv như ql với strStaffId = userId, strBoMonId = bộ môn của người
            đăng nhập (TBL_KLGD_NHOMMONHOCID của GetThongTinCanBo) hoặc "#@".
   Thông tin GV: GetThongTinCanBo { strStaffId, strNamHoc, strNguoiDung_Id | strNguoiThucHienId }.
   Tổng hợp: TinhKhoiLuongTruDanTheoChuan_Kieu2 { NhomMonHocID, strNamHoc, strHocKy (cu "<năm>_", ql ""), strNguoiDung_Id
     (+ ql strBoMonId = TBL_BOMONID của bộ môn) } — một lời gọi cho bộ môn đang chọn, hoặc MỌI bộ môn khi chưa chọn.
   Khác bản gốc (ghi ở can-quyet.js):
     · cu: chọn Hệ đào tạo gốc gọi hàm KHÔNG tồn tại (lỗi JS) — nay chỉ lọc lại bảng khi đã có giảng viên.
     · ql: tiêu đề cột gốc giữ của bản cũ nên LỆCH dữ liệu ("Loại" hiện TENCOSODAOTAO, "Kiểu lớp" hiện TENHINHTHUCHOC) → đặt
       tiêu đề theo dữ liệu: "Cơ sở đào tạo", "Hình thức học". Bốn tham số từ ô không có trên màn gửi rỗng (như gốc).
     · gv: nạp thông tin giảng viên TRƯỚC rồi mới nạp bảng (gốc làm ngược → lần đầu luôn gửi bộ môn "#@").
     · Tổng hợp: thiếu năm học thì dừng (gốc báo rồi vẫn chạy); chờ tính xong mới nạp lại bảng (gốc nạp ngay / chờ cứng 2 giây).
     · Năm → Bộ môn → Giảng viên khoá theo luật cha → con.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;

    function tien(v) { var s = pat.num(v); return s === '' || Number(s) === 0 ? '0' : pat.money(s); }

    K.tongHop = function (root, kieu) {
        var ql = kieu !== 'cu', gvMode = kieu === 'gv', ctl = K.ctl(ql);
        var loc = [{ key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' }];
        if (!gvMode) loc.push({ key: 'bm', type: 'select', label: 'Chọn bộ môn' }, { key: 'gv', type: 'select', label: 'Chọn giảng viên' });
        var TT = [['Họ tên', 'ht'], ['Mã giảng viên', 'ma'], ['Bộ môn', 'bm'], ['Định mức giảng dạy', 'dmgd'], ['Hoàn thành giảng dạy', 'htgd'],
            ['Số tiết vượt giờ giảng dạy', 'vgd', 1], ['Định mức NCKH', 'dmnc'], ['Hoàn thành NCKH', 'htnc'], ['Số tiết vượt NCKH', 'vnc', 1],
            ['Tổng tiền vượt giờ', 'tvg', 1], ['Tổng tiền đã tạm ứng', 'ttu', 1]];
        root.innerHTML = pat.page(gvMode ? 'Tổng hợp khối lượng giảng viên' : 'Tổng hợp khối lượng', gvMode ? '' : '<span data-z="bc"></span>') +
            pat.filterBar(loc, { search: false, extra: gvMode ? '' : '<div class="ums-field ums-field--fit">' +
                ui.btn('save', { text: 'Tổng hợp', icon: 'fa-calculator', attr: { 'data-a': 'tonghop' } }) + '</div>' }) +
            pat.panel({ title: 'Thông tin giảng viên', icon: 'fa-id-card', cls: 'ums-u-mb-4', body: '<div class="ums-grid ums-grid--3">' +
                TT.map(function (t) { return '<div class="ums-kv"><span>' + esc(t[0]) + '</span><b data-tt="' + t[1] + '"' + (t[2] ? ' class="kl-do"' : '') + '></b></div>'; }).join('') + '</div>' }) +
            pat.panel({ title: 'Tổng hợp khối lượng', icon: 'fa-table-list', flush: true, count: 'dem', zone: 'bang' });
        ui.enhance(root);
        function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return F(k) ? F(k).value : ''; }
        var bang = root.querySelector('[data-z="bang"]');
        var boMon = [], bmCuaToi = '';

        /* ---------- Nguồn ---------- */
        ums.crud.loadSource(K.nam(ql)).then(function (d) {
            var k = ql ? 'NAMHOC' : 'NIENHOC';
            pat.fill(F('nam'), d, { id: k, name: k, head: 'Chọn năm học' });
            if (d.length) { F('nam').value = e(d[0][k]); jQuery(F('nam')).trigger('change.select2'); doiNam(); }
            else doiNam();
        }).catch(function (err) { ums.api.handle(err, 'năm học'); });
        K.g(ctl + (ql ? 'ListDS_HeDaoTao' : 'GetTRAININGSYSTEMList'), { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), silent: true })
            .then(function (r) { pat.fill(F('he'), K.arr(r.data), { id: 'ID', name: 'NAME', head: 'Chọn hệ đào tạo' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        function napBoMon() {
            if (gvMode || !v('nam')) return Promise.resolve();
            return (ql ? K.g(ctl + 'LayDS_PhanQuyenNguoiDungDonVi', { strNamHoc: v('nam'), strNguoiDungId: K.uid(), strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid(), silent: true })
                : K.g(ctl + 'GetBoMonDuocPhanCong', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNamHoc: v('nam'), silent: true }))
                .then(function (r) { boMon = K.arr(r.data); pat.fill(F('bm'), boMon, { id: 'ID', name: 'NAME', head: 'Chọn bộ môn' }); })
                .catch(function (err) { ums.api.handle(err, 'bộ môn'); });
        }
        function napGV() {
            if (gvMode || !v('bm')) return;
            (ql ? K.g(ctl + 'GetDanhSachCanBoNienHoc', { strNhomMonHocId: v('bm'), strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid(), silent: true })
                : K.g(ctl + 'GetListStaff', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNhomMonHocId: v('bm'), silent: true }))
                .then(function (r) { pat.fill(F('gv'), K.arr(r.data), ql ? { id: 'STAFFID', name: 'HOTENMASO', head: 'Chọn giảng viên' } : { id: 'NHANVIENID', name: 'HOTEN', head: 'Chọn giảng viên' }); })
                .catch(function (err) { ums.api.handle(err, 'giảng viên'); });
        }

        /* ---------- Thông tin giảng viên ---------- */
        function datTT(d) {
            d = d || {};
            var ht = e(d.SOTIETHOANTHANHGIANGDAY), them = e(d.SOTIETDUOCCONGTHEM);
            if (them !== '' && Number(them) !== 0) ht += ' (chưa cộng thêm ' + them + ')';
            var x = d.HOTEN === undefined ? {} : {
                ht: (e(d.HOCHAMHOCVI) + ' ' + e(d.HOTEN)).trim(), ma: e(ql ? d.SOHIEUCT : d.MACANBO), bm: e(ql ? d.TENBM : d.TENBOMON),
                dmgd: e(d.DINHMUCGIANGDAY), htgd: ht, vgd: e(d.SOTIETVUOT), dmnc: e(d.DINHMUCNGHIENCUUKHOAHOC), htnc: e(d.SOTIETHOANTHANHNCKH),
                vnc: e(d.THUATHIEUNCKH), tvg: tien(d.TIENVUOTGIO), ttu: tien(d.TIENDATHANHTOAN) };
            TT.forEach(function (t) { root.querySelector('[data-tt="' + t[1] + '"]').textContent = x[t[1]] || ''; });
        }
        function staff() { return gvMode ? K.uid() : v('gv'); }
        function napTT() {
            if (!staff() || !v('nam')) { datTT(null); return Promise.resolve(); }
            var p = { strStaffId: staff(), strNamHoc: v('nam') };
            p[ql ? 'strNguoiThucHienId' : 'strNguoiDung_Id'] = K.uid();
            return K.g(ctl + 'GetThongTinCanBo', p).then(function (r) {
                var d = K.arr(r.data)[0] || null;
                if (gvMode && d) bmCuaToi = e(d.TBL_KLGD_NHOMMONHOCID);
                datTT(d);
            }).catch(function (err) { datTT(null); ums.api.handle(err, 'thông tin giảng viên'); });
        }

        /* ---------- Bảng ---------- */
        var COT = [
            { title: ql ? 'Cơ sở đào tạo' : 'Loại', render: function (r) { return esc(e(ql ? r.TENCOSODAOTAO : r.LOAI)); } },
            { title: 'Tên học phần', render: function (r) {
                return ql ? esc(e(r.TENHOCPHAN)) + '_<span class="kl-do">' + esc(e(r.MAHOCPHAN) + '_' + e(r.HOCTRINH)) + '</span>'
                    : esc(e(r.TENMON)) + '_<span class="kl-do">' + esc(e(r.MAHOCPHAN)) + '</span>';
            } },
            { title: 'Số TC', cls: 'is-center', render: function (r) { return esc(e(ql ? r.HOCTRINH : r.DVHT)); } },
            { title: 'Tên lớp HP/Lớp quản lý', cls: 'is-center', render: function (r) {
                var t = e(r.TACHTHEOSINHVIEN_TIET);
                return esc(e(r.TENLOP)) + (t === 'SV' ? ' <span class="kl-do">(Tách theo SV)</span>' : t === 'TIET' ? ' <span class="kl-do">(Tách theo tiết)</span>' : '');
            } },
            { title: ql ? 'Hình thức học' : 'Kiểu lớp', render: function (r) { return esc(e(ql ? r.TENHINHTHUCHOC : r.LOAILOPHOCPHAN)); } },
            { title: 'HT Giảng dạy', prop: 'TENHINHTHUCGIANGDAY' },
            { title: 'Sỹ số', prop: 'SOSV', cls: 'is-center' },
            { title: 'Hệ đào tạo', render: function (r) { return esc(e(ql ? r.TENHEDAOTAO : r.HEDAOTAO)); } },
            { title: 'Học kỳ', render: function (r) { return esc(e(ql ? r.HOCKYDOTHOCFULL : r.HOCKY_DOT)); } },
            { title: 'Lý thuyết', prop: 'TIETLYTHUYET_DC', cls: 'is-center' }, { title: 'Bài tập', prop: 'TIETBAITAP_DC', cls: 'is-center' },
            { title: 'Thảo luận', prop: 'TIETTHAOLUAN_DC', cls: 'is-center' }, { title: 'Thí nghiệm', prop: 'TIETTHINGHIEM_DC', cls: 'is-center' },
            { title: 'Thực hành', prop: 'TIETTHUCHANH_DC', cls: 'is-center' }, { title: 'BTL', prop: 'BTL', cls: 'is-center' },
            { title: 'TKMH', prop: 'TKMH', cls: 'is-center' }, { title: 'Số ngày', prop: 'SONGAY', cls: 'is-center' },
            { title: 'Thiết kế TN', prop: 'THIETKETN', cls: 'is-center' }, { title: 'Quy đổi', prop: 'SOTIETQUYDOI', cls: 'is-center' }];
        function nhac(t) { bang.innerHTML = ui.empty(t, 'fa-filter'); root.querySelector('[data-z="dem"]').textContent = ''; }
        function tai() {
            bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            var p;
            if (!ql) p = { action: ctl + 'GetKhoiLuongThoiKhoaBieu', strBoMonId: v('bm') || '#@', strStaffId: v('gv') || '#@', strNamHoc: v('nam'),
                strHeDaoTaoId: v('he'), strNguoiDung_Id: K.uid() };
            else p = { action: ctl + 'GetDanhSachPhanCong', strBoMonId: gvMode ? (bmCuaToi || '#@') : v('bm'), strStaffId: gvMode ? (K.uid() || '#@') : v('gv'),
                strHocKy: '', strDotHocId: '', strHeDaoTaoId: v('he'), strCoSoDaoTaoId: '', strKhoaHocId: '', strNguoiThucHienId: K.uid() };
            p.method = 'GET';
            return ums.api.call(p).then(function (r) {
                var d = K.arr(r.data);
                ui.table({ el: bang, rows: d, columns: COT, empty: 'Không có khối lượng' });
                root.querySelector('[data-z="dem"]').textContent = '(' + d.length + ')';
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối lượng'); });
        }
        function taiDu() {
            if (gvMode) { if (!v('nam')) { nhac('Chọn năm học'); datTT(null); return; } napTT().then(tai); return; }
            if (!v('gv')) { nhac('Chọn năm học, bộ môn và giảng viên để xem khối lượng'); datTT(null); return; }
            tai().then(napTT);
        }
        function doiNam() {
            datTT(null);
            if (gvMode) { taiDu(); return; }
            napBoMon(); nhac('Chọn năm học, bộ môn và giảng viên để xem khối lượng');
        }

        function tongHop() {
            if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            var ds = v('bm') ? boMon.filter(function (x) { return e(x.ID) === v('bm'); }) : boMon;
            if (!ds.length) { ui.toast('Không có bộ môn để tổng hợp', 'warn'); return; }
            ui.batch(ds.map(function (b) {
                var p = { action: ctl + 'TinhKhoiLuongTruDanTheoChuan_Kieu2', method: 'GET', NhomMonHocID: e(b.ID), strNamHoc: v('nam'),
                    strHocKy: ql ? '' : v('nam') + '_', strNguoiDung_Id: K.uid() };
                if (ql) p.strBoMonId = e(b.TBL_BOMONID);
                return p;
            }), { title: 'Đang tổng hợp', okText: 'Tổng hợp dữ liệu thành công', show: true }).then(function () { if (v('gv')) taiDu(); });
        }

        if (!gvMode) ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) {
            add('strNamHoc', v('nam')); add('strNhomMonHocId', v('bm')); add('Id', v('bm')); add('strChucNang_Id', K.chucNang());
            if (ql) { add('strHeDaoTaoId', v('he')); add('strNguoiThucHienId', K.uid()); }
        } });
        root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="tonghop"]')) tongHop(); });
        jQuery(F('nam')).on('select2:select select2:clear', doiNam);
        jQuery(F('he')).on('select2:select select2:clear', function () { if (gvMode || v('gv')) taiDu(); });
        if (!gvMode) {
            jQuery(F('bm')).on('select2:select select2:clear', function () { napGV(); datTT(null); nhac('Chọn giảng viên để xem khối lượng'); });
            jQuery(F('gv')).on('select2:select select2:clear', taiDu);
            pat.chain([F('nam'), F('bm'), F('gv')], { phatLai: false });
        }
        nhac(gvMode ? 'Chọn năm học' : 'Chọn năm học, bộ môn và giảng viên để xem khối lượng');
    };
})();
