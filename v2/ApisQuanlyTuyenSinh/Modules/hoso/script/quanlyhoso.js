/* =========================================================================
   Quản lý hồ sơ (tuyển sinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/hoso/html/quanlyhoso.html + script/QuanLyHoSo.js
            (html nạp "QuanLyHoSo.js", tệp trên đĩa tên thường "quanlyhoso.js" — bản mới đặt quanlyhoso.js)
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (Năm · Kế hoạch · Đợt · Hình thức · Hệ · Khóa · từ khoá · Tìm kiếm ·
   Xuất báo cáo) → khung "Danh sách (n)" + "Thêm mới" → bảng tiêu đề hai tầng: Thông tin cá nhân (Mã số · Họ đệm ·
   Tên · Ngày sinh · Lớp / Ngành / Khóa / Hệ nhập học · Người tạo · Ngày tạo · Lịch sử) · Thông tin nguyện vọng
   (Ngành đăng ký · Chi tiết) · Lệ phí (Phải nộp · Đã nộp) · Thông tin hồ sơ (MỘT CỘT MỖI TRƯỜNG THÔNG TIN của kế
   hoạch — động) · Duyệt hồ sơ · Chọn (sửa) · ô đánh dấu → chân khung "Xóa". Hai hộp: "Chi tiết nguyện vọng"
   (cột môn thi động) và "Lịch sử".

   Lời gọi (chép nguyên, GET/POST như gốc) — nguồn ô lọc, xoá, Thêm mới, sửa: _chung.js (ums.tsHoSo)
     TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen    GET  strTuKhoa, strTS_KeHoachTuyenSinh_Id, strDaoTao_HeDaoTao_Id,
                                                   strDaoTao_KhoaDaoTao_Id, strDotTuyenSinh_Id, strDoiTuongDuTuyen_Id, strNam,
                                                   strNguoiTao_Id '' (gốc đọc dropAAAA), trang máy chủ
     TS_TaiKhoan/LayDSThongTinTheoKeHoach     GET  strChucNang_Id, strTS_KeHoachTuyenSinh_Id, strDotTuyenSinh_Id, strNguoiThucHien_Id
                                                   → ID, TEN, KIEUDULIEU (cột "Thông tin hồ sơ")
     TS_TaiKhoan/LayKQTS_KeHoach_DuLieu       GET  strTruongThongTin_Id, strTS_HoSoTuyenSinh_Id — MỖI Ô một lời gọi
                                                   → TRUONGTHONGTIN_GIATRI_TEN_CUOI; kiểu FILE → SV_Files (id hồ sơ + id trường)
     TS_ThiSinh_KetQua/LayDSMonThiTheoThiSinh GET  strTS_HoSoDuTuyen_Id → ID, TS_MONTHI_TEN, DIEM (hộp nguyện vọng)
     TS_ThiSinh_NguyenVong/LayDanhSach        GET  strTuKhoa '', strNganhNghe_Id '', strDoiTuongDuTuyen_Id, strDotTuyenSinh_Id,
                                                   strTS_KeHoachTuyenSinh_Id, strTS_HoSoDuTuyen_Id, strNguoiTao_Id '', 1/100000
                                                   → NGANHNGHE_TEN, TS_TOHOP_TEN, DSMONTHITHEOTOHOPNGANH_ID, TS_XACNHANDUYETTT_TEN
     TS_DuLieu/LayDSLichSuCapNhatHoSo         GET  strTS_HoSoDuTuyen_Id (hộp Lịch sử)
     Xuất báo cáo: ums.report.mount — các khoá lọc như gốc + strTS_HoSoDuTuyen_Id cho MỖI hồ sơ đã đánh dấu.

   Khác gốc / tự chốt:
     · Bảng chỉ vẽ SAU khi có danh sách trường thông tin (gốc gọi hai lời gọi song song — về trước thì mất cột động).
     · Chọn Đợt: gốc chỉ vẽ lại TIÊU ĐỀ (thân bảng lệch cột tới lần tìm sau) → ở đây nạp lại cả bảng.
     · Ô "chọn tất cả" + "Xoá đã chọn" (ui.xoaChon) thay nút "Xóa" chân khung; các ô trường thông tin nạp 6 luồng.
     · Hộp nguyện vọng: gốc lỗi khi dòng không có DSMONTHITHEOTOHOPNGANH_ID (null.indexOf) → coi như rỗng.
     · Nút ".btnDownloadAllFile" có mã nhưng KHÔNG có trong html gốc → không dựng (bản mở rộng mới có nút này).
   Cặp cha → con: Kế hoạch → Hệ → Khóa, Kế hoạch → Đợt, Kế hoạch → Hình thức (pat.chain). Năm là ô lọc độc lập (gốc
   không nạp lại kế hoạch theo năm ở màn này).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tsHoSo, e = T.e, esc = ui.esc;
    var root = document.getElementById('ts-quanlyhoso');
    if (!root) return;

    root.innerHTML =
        pat.page('Quản lý hồ sơ', '<div data-z="bc"></div>') +
        pat.filterBar(T.locFields()) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'ds',
            tools: ui.btn('add', { attr: { 'data-a': 'them' } }) +
                ui.xoaChon('input[data-hs]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    T.ganChon(z('ds'), 'data-hs');

    var st = { trang: 1, co: 10, rows: [], truong: [], the: 0 };

    var L = T.noiLoc(root, {
        gop: true,
        onKH: function () { taiTruong().then(function () { tai(1); }); },
        onDot: function () { taiTruong().then(function () { tai(1); }); },
        onTim: function () { tai(1); }
    });
    function loc() {
        return { strTuKhoa: L.v('q'), strTS_KeHoachTuyenSinh_Id: L.v('kh'), strDaoTao_HeDaoTao_Id: L.v('he'),
            strDaoTao_KhoaDaoTao_Id: L.v('khoa'), strDotTuyenSinh_Id: L.v('dot'), strDoiTuongDuTuyen_Id: L.v('ht'),
            strNam: L.v('nam'), strNguoiTao_Id: '' };
    }

    /* ---------- Trường thông tin (cột động) ---------- */
    function taiTruong() {
        return T.rows({ action: 'TS_TaiKhoan/LayDSThongTinTheoKeHoach', method: 'GET', strChucNang_Id: T.cn(),
            strTS_KeHoachTuyenSinh_Id: L.v('kh'), strDotTuyenSinh_Id: L.v('dot'), strNguoiThucHien_Id: T.uid() })
            .then(function (r) { st.truong = r; }, function (err) { st.truong = []; ums.api.handle(err, 'trường thông tin'); });
    }

    /* ---------- Danh sách hồ sơ ---------- */
    function tai(trang) {
        if (trang) st.trang = trang;
        var the = ++st.the;
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var c = loc();
        c.action = 'TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen'; c.method = 'GET';
        c.pageIndex = st.trang; c.pageSize = st.co; c.silent = true;
        ums.api.call(c).then(function (r) {
            if (the !== st.the) return;
            st.rows = Array.isArray(r.data) ? r.data : [];
            var tong = Number(r.pager) || st.rows.length;
            z('n').textContent = '(' + tong + ')';
            ve(tong);
            napO(the);
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách hồ sơ'); });
    }
    var TT = ['Thông tin cá nhân'], NV = ['Thông tin nguyện vọng'], LP = ['Lệ phí'], HS = ['Thông tin hồ sơ'];
    function ve(tong) {
        var cols = [
            { title: 'Mã số', prop: 'MASO', group: TT, cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'HODEM', group: TT, cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN', group: TT, cls: 'is-nowrap' },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', group: TT, cls: 'is-center is-nowrap', width: '120px' },
            { title: 'Lớp nhập học', prop: 'DAOTAO_LOPQUANLY_TEN', group: TT, cls: 'is-nowrap' },
            { title: 'Ngành nhập học', prop: 'NGANHNGHE_TEN', group: TT, cls: 'is-nowrap' },
            { title: 'Khóa nhập học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: TT, cls: 'is-nowrap' },
            { title: 'Hệ nhập học', prop: 'DAOTAO_HEDAOTAO_TEN', group: TT, cls: 'is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU', group: TT, cls: 'is-nowrap' },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', group: TT, cls: 'is-center is-nowrap' },
            { title: 'Lịch sử', group: TT, cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('history', { cls: 'ums-btn--sm', attr: { 'data-ls': e(r.ID) } }); } },
            { title: 'Ngành đăng ký', prop: 'DSNGUYENVONGTHEOKEHOACH', group: NV, width: '240px' },
            { title: 'Chi tiết', group: NV, cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('view', { cls: 'ums-btn--sm', attr: { 'data-nv': e(r.ID) } }); } },
            { title: 'Phải nộp', group: LP, cls: 'is-right is-nowrap', render: function (r) { return esc(tien(r.TONGTIENPHAINOP)); } },
            { title: 'Đã nộp', group: LP, cls: 'is-right is-nowrap', render: function (r) { return esc(tien(r.TONGTIENDANOP)); } }
        ];
        st.truong.forEach(function (t) {
            cols.push({ title: e(t.TEN), group: HS, render: function (r) {
                return '<span data-o="' + esc(e(r.ID) + '_' + e(t.ID)) + '"></span>'; } });
        });
        cols.push(
            { title: 'Duyệt hồ sơ', prop: 'TONGTIENDANOP1', cls: 'is-center' },
            { title: 'Chọn', cls: 'is-center', render: function (r) { return T.suaLink(r.ID); } },
            T.cotChon('data-hs')
        );
        ui.table({ el: z('ds'), rows: st.rows, columns: cols, empty: 'Không có hồ sơ',
            page: { index: st.trang, size: st.co, total: tong, onChange: tai,
                onSize: function (s) { st.co = s; tai(1); } } });
    }
    function tien(v) { return v === null || v === undefined || v === '' ? '' : ui.money(v); }

    /* getData_HoSo — mỗi (trường × hồ sơ) một lời gọi, gốc bắn một lượt; ở đây 6 luồng, lượt cũ bị bỏ khi bảng vẽ lại */
    function napO(the) {
        var jobs = [];
        st.rows.forEach(function (r) {
            st.truong.forEach(function (t) {
                jobs.push(function () {
                    if (the !== st.the) return null;
                    return T.rows({ action: 'TS_TaiKhoan/LayKQTS_KeHoach_DuLieu', method: 'GET',
                        strTruongThongTin_Id: e(t.ID), strTS_HoSoTuyenSinh_Id: e(r.ID) }).then(function (d) {
                        if (the !== st.the || !d.length) return null;
                        var o = z('ds').querySelector('[data-o="' + e(r.ID) + '_' + e(t.ID) + '"]');
                        if (!o) return null;
                        if (t.KIEUDULIEU === 'FILE') {
                            return T.tep(e(r.ID) + e(t.ID)).then(function (ds) { if (the === st.the) o.innerHTML = T.tepHtml(ds); });
                        }
                        o.textContent = e(d[d.length - 1].TRUONGTHONGTIN_GIATRI_TEN_CUOI);
                        return null;
                    });
                });
            });
        });
        T.hang(jobs, 6);
    }

    /* ---------- Hộp "Chi tiết nguyện vọng" ---------- */
    function nguyenVong(id) {
        var dlg = ui.dialog({ title: 'Chi tiết nguyện vọng', icon: 'fa-list-check', size: 'xl',
            body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-x="bang"]');
        var mon = [];
        T.rows({ action: 'TS_ThiSinh_KetQua/LayDSMonThiTheoThiSinh', method: 'GET', strTS_HoSoDuTuyen_Id: id }).then(function (m) {
            mon = m;
            return T.rows({ action: 'TS_ThiSinh_NguyenVong/LayDanhSach', method: 'GET', strTuKhoa: '', strNganhNghe_Id: '',
                strDoiTuongDuTuyen_Id: L.v('ht'), strDotTuyenSinh_Id: L.v('dot'), strTS_KeHoachTuyenSinh_Id: L.v('kh'),
                strTS_HoSoDuTuyen_Id: id, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 });
        }).then(function (rows) {
            var cols = [{ title: 'Nguyện vọng', prop: 'NGANHNGHE_TEN' }, { title: 'Tổ hợp', prop: 'TS_TOHOP_TEN' }];
            mon.forEach(function (x) {
                cols.push({ title: e(x.TS_MONTHI_TEN), group: ['Môn'], cls: 'is-center', render: function (r) {
                    var ds = e(r.DSMONTHITHEOTOHOPNGANH_ID).split(',');
                    if (ds.indexOf(e(x.ID)) < 0) return '';
                    return esc(e(x.DIEM) || 'x');
                } });
            });
            cols.push({ title: 'Tình trạng', prop: 'TS_XACNHANDUYETTT_TEN' });
            ui.table({ el: host, rows: rows, columns: cols, empty: 'Không có nguyện vọng' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nguyện vọng'); });
    }

    /* ---------- Hộp "Lịch sử" ---------- */
    function lichSu(id) {
        var dlg = ui.dialog({ title: 'Lịch sử', icon: 'fa-clock-rotate-left', size: 'xl',
            body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-x="bang"]');
        function giaTri(r, k) {
            if (r.KIEUDULIEU !== 'FILE') return ui.escBr(r[k]);
            var ds = e(r[k]).split(',').filter(Boolean).map(function (p) { return { path: p, name: p.split('/').pop() }; });
            return T.tepHtml(ds);
        }
        T.rows({ action: 'TS_DuLieu/LayDSLichSuCapNhatHoSo', method: 'GET', strTS_HoSoDuTuyen_Id: id }).then(function (rows) {
            ui.table({ el: host, rows: rows, empty: 'Chưa có lịch sử cập nhật', columns: [
                { title: 'Hành động', prop: 'HANHDONG' },
                { title: 'Loại thông tin', prop: 'TRUONGTHONGTIN_TEN' },
                { title: 'Dữ liệu ban đầu', render: function (r) { return giaTri(r, 'DULIEU_TRUOCKHISUA'); } },
                { title: 'Dữ liệu sau khi sửa/xóa', render: function (r) { return giaTri(r, 'DULIEU_SAUKHISUA'); } },
                { title: 'Thời gian thực hiện', prop: 'NGAYTHUCHIEN', cls: 'is-nowrap' },
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' }
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử'); });
    }

    /* ---------- Xuất báo cáo ---------- */
    ums.report.mount(z('bc'), { collect: function (add) {
        var c = loc();
        Object.keys(c).forEach(function (k) { add(k, c[k]); });
        T.chon(z('ds'), 'data-hs').forEach(function (x) { add('strTS_HoSoDuTuyen_Id', x.id); });
    } });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-nv]');
        if (b) { nguyenVong(b.getAttribute('data-nv')); return; }
        if ((b = ev.target.closest('[data-ls]'))) { lichSu(b.getAttribute('data-ls')); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'them') T.themMoi('/congtuyensinh/pages/tuyensinh.aspx');
        else if (a === 'xoa') {
            T.xoaHoSo(T.chon(z('ds'), 'data-hs').map(function (x) { return x.id; })).then(function (ok) { if (ok) tai(); });
        }
    });

    /* Mở màn: gốc nạp danh sách + trường thông tin với bộ lọc trống */
    taiTruong().then(function () { tai(1); });
})();
