/* =========================================================================
   tinhdiem/tonghopketqua — Quy trình 2: Tổng hợp kết quả (phân hệ Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/tinhdiem/html/tonghopketqua.html + script/tonghopketqua.js (vỏ indexi / Corei)
   Bố cục như gốc: trên hai cột (điều kiện + nút | lịch sử hàng đợi), dưới hai tab
   (1) Danh sách tổng hợp kết quả  (2) Tham số tùy biến học kỳ tính điểm trung bình.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Hệ ums.ref.heDaoTao (pageSize 1000) · Khoá ums.ref.khoaDaoTao(strHeDaoTao_Id, 10000; CHỌN NHIỀU) · Khoa QL ums.ref.khoaQuanLy
       · CT ums.ref.chuongTrinh(strKhoaDaoTao_Id = các khoá, strKhoaQuanLy_Id; 10000)
       · Lớp pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy (Corei:4080 — strDaoTao_Nganh_Id = KHOA QUẢN LÝ như gốc truyền strNganh_Id,
         strDaoTao_KhoaQuanLy_Id rỗng vì gốc truyền nhầm tên strKhoaQuanLy_Id; 100000)
       Tình trạng SV QLSV.TRANGTHAI (chọn nhiều, chọn sẵn tất cả) · Thang điểm DIEM.THANGDIEM · Loại ĐTB DIEM.LOAIDIEMTRUNGBINH
       Phạm vi DIEM.PHAMVITONGHOPDIEM → Học kỳ / Nhiều kỳ / Đợt học ums.ref.thoiGianDaoTao · Năm học pkg_kehoach_thongtin.LayDSNamNhapHoc
       Tính điểm       D_HangDoi/TaoHangDoi_TinhDiem_TuDong (GET) → hàng đợi TINHDIEMTUDONG
       Xếp loại học tập D_HangDoi_MH · diem_nhiemvu_hangdoi.TaoHangDoi_XepLoai_TuDong (POST) → hàng đợi TINHDIEMTUDONG_XEPLOAI
       Danh sách       D_TinhDiem/TinhDiem_TuDong_KetQua (GET, versionAPI v1.0, pageSize 100000)
       Tab 2           D_ThongTin2_MH · PKG_DIEM_THONGTIN2.LayDSTongHopKetQua_ThoiGian / Them_TongHopKetQua_ThoiGian / Xoa_TongHopKetQua_ThoiGian
                       "Thêm" = hộp chọn sinh viên nhiều ngành (edu.extend.genModal_SinhVien → ums.pat.pickSinhVienNganh):
                       chọn SV → strPhamViApDung_Id = QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID (ghép chuỗi như gốc);
                       "Thêm từng khóa / chương trình / lớp" → strPhamViApDung_Id = từng id.
       Báo cáo (getList_MauImport "zonebtnBaoCao_THKQ"): 10 khoá của bộ điều kiện + dTongHopLaiDiemThanhPhan + strNguoiDangNhap_Id.
   Khác bản gốc:
     · Hai hàng đợi cùng strName "TongHopKetQua" nên gốc vẽ ĐÈ nhau vào một chỗ (cái nào về sau thắng) → vẽ cả hai:
       tiến trình dưới khối điều kiện, lịch sử ở cột phải thành hai khối "Tính điểm" / "Xếp loại học tập".
     · Ô "Số luồng" của gốc đặt edu.system.iGioiHanLuong → ở đây là số lời gọi song song khi bấm "Bắt đầu" hàng đợi.
     · Hệ → Khoá → CT → Lớp KHOÁ theo luật cha → con; Khoa QL là cha TUỲ CHỌN của CT + Lớp (đổi thì xoá trắng CT, Lớp).
     · Mã số trong bảng kết quả gốc là liên kết .btnChiTiet KHÔNG có xử lý → chữ thường.
     · Thiếu hai nút của hộp chọn SV gốc: "Thêm từng hệ", "Thêm Khoa quản lý - khóa học" (ums.pat.pickSinhVienNganh chưa có — nợ tầng chung).
     · Xoá nhiều dòng tab 2: ums.ui.xoaChon (hỏi lại, tự đếm).
   Bỏ: page_load / objHangDoi tự dựng, alert từng dòng khi lưu / xoá (gộp bằng ums.ui.batch), fakedb.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('qld-tonghopketqua');
    var $ = window.jQuery;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function sel(k, ph, o) {
        o = o || {};
        return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (o.multi ? ' multiple' : '') + (o.req ? ' data-required' : '') + '>' +
            (o.opts || (o.multi ? '' : '<option value=""></option>')) + '</select>';
    }
    function dong(nhan, ctl, attr) { return '<div' + (attr || '') + '>' + ui.field(nhan, ctl, { inline: true }) + '</div>'; }
    var LUONG = [[10, '10 luồng cùng chạy'], [1, '1 luồng chạy'], [2, '2 luồng chạy'], [30, '30 luồng cùng chạy'], [50, '50 luồng cùng chạy'],
        [100, '100 luồng cùng chạy'], [200, '200 luồng cùng chạy'], [500, '500 luồng cùng chạy'], [1000, '1000 luồng cùng chạy']]
        .map(function (x) { return '<option value="' + x[0] + '">' + x[1] + '</option>'; }).join('');

    root.innerHTML = pat.page('Tổng hợp kết quả', '<span data-z="bc"></span>') +
        '<div class="ums-grid ums-grid--2 ums-u-mb-4">' +
            pat.panel({ title: 'Quy trình 2: Tổng hợp kết quả', icon: 'fa-chalkboard-user', body:
                '<div class="ums-filter thkq-dk">' +
                dong('Hệ đào tạo', sel('he', 'Chọn hệ đào tạo')) + dong('Khóa đào tạo', sel('khoa', 'Chọn khóa đào tạo', { multi: true })) +
                dong('Khoa quản lý', sel('kql', 'Chọn khoa quản lý')) + dong('Chương trình đào tạo', sel('ct', 'Chọn chương trình đào tạo')) +
                dong('Lớp quản lý', sel('lop', 'Chọn lớp quản lý')) + dong('Tình trạng sinh viên', sel('tt', 'Chọn tình trạng sinh viên', { multi: true })) +
                dong('Thang điểm', sel('thang', 'Chọn thang điểm')) + dong('Phạm vi tổng hợp', sel('pv', 'Chọn phạm vi')) +
                dong('- Toàn khóa', '', ' data-pv="TOANKHOA" hidden') +
                dong('- Nhiều kỳ', sel('pv_NHIEUKY', 'Chọn kỳ', { multi: true }), ' data-pv="NHIEUKY" hidden') +
                dong('Năm học', sel('pv_NAMHOC', 'Chọn năm học'), ' data-pv="NAMHOC" hidden') +
                dong('Học kỳ', sel('pv_HOCKY', 'Chọn học kỳ'), ' data-pv="HOCKY" hidden') +
                dong('- Đợt học', sel('pv_DOTHOC', 'Chọn đợt học'), ' data-pv="DOTHOC" hidden') +
                dong('Cách tính', sel('cach', 'Cách tính', { req: true, opts: '<option value="0">Không tính lại điểm thành phần</option><option value="1">Tính lại điểm thành phần</option>' })) +
                dong('Số luồng', sel('luong', 'Số luồng', { req: true, opts: LUONG })) +
                '</div><div class="ums-u-mt-3" data-z="q1"></div><div data-z="q2"></div>',
                foot: '<div class="ums-row ums-row--end">' +
                    ui.btn('search', { text: 'Xem danh sách', mod: 'out-primary', attr: { 'data-a': 'xem' } }) +
                    ui.btn('search', { text: 'Xếp loại học tập', icon: 'fa-arrow-down-wide-short', mod: 'out-info', attr: { 'data-a': 'xeploai' } }) +
                    ui.btn('search', { text: 'Tính điểm', icon: 'fa-calculator', attr: { 'data-a': 'tinhdiem' } }) + '</div>' }) +
            pat.panel({ title: 'Lịch sử: Tổng hợp kết quả', icon: 'fa-clock-rotate-left', body:
                '<div class="ums-legend">Tính điểm</div><div data-z="h1"></div><div class="ums-legend ums-legend--cach">Xếp loại học tập</div><div data-z="h2"></div>' }) +
        '</div>' +
        ui.tabs([{ key: 'ds', text: '1) Danh sách Tổng hợp kết quả' }, { key: 'ts', text: '2) Tham số tùy biến học kỳ tính điểm trung bình' }], 'ds', 'data-tab') +
        '<div data-pane="ds">' + pat.panel({ title: false, flush: true, body:
            '<div class="ums-filter thkq-loc">' +
                '<div class="ums-field">' + sel('lan', 'Lần học', { req: true, opts: '<option value="1">Lần 1</option><option value="0">Cao nhất</option>' }) + '</div>' +
                '<div class="ums-field">' + sel('ldtb', 'Chọn loại điểm trung bình') + '</div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('reload', { mod: 'warn', attr: { 'data-a': 'tailai' } }) + '</div>' +
                '<span class="ums-u-fz13 ums-u-muted thkq-dem" data-z="n"></span></div>' +
            '<div data-z="kq">' + ui.empty('Bấm "Xem danh sách" hoặc "Tải lại" để xem kết quả tổng hợp.', 'fa-list') + '</div>' }) + '</div>' +
        '<div data-pane="ts" hidden>' + pat.panel({ title: false, flush: true, body:
            '<div class="ums-filter thkq-loc">' +
                '<div class="ums-field">' + sel('tgts', 'Chọn thời gian', { multi: true }) + '</div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'thempv' } }) + '</div>' +
                '<div class="ums-field ums-field--fit thkq-xoa">' + ui.xoaChon('input[data-pvck]', { sm: true, attr: { 'data-a': 'xoapv' } }) + '</div></div>' +
            '<div data-z="pv">' + ui.empty('Chọn "Phạm vi tổng hợp" để xem tham số.', 'fa-sliders') + '</div>' }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function hong(t) { return function (err) { ums.api.handle(err, t); }; }

    /* ---------- Bộ điều kiện --------------------------------------------- */
    var NAP = {
        khoa: function () {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(hong('khóa đào tạo'));
        },
        ct: function () {
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: v('kql'), strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); }).catch(hong('chương trình đào tạo'));
        },
        lop: function () {
            return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', silent: true,
                strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_Nganh_Id: v('kql'), strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) { pat.fill(f('lop'), arr(r.data), { name: 'TEN', head: 'Chọn lớp quản lý' }); }).catch(hong('lớp quản lý'));
        }
    };
    function chuoi(ks) { return ks.reduce(function (p, k) { return p.then(NAP[k]); }, Promise.resolve()); }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(hong('hệ đào tạo'));
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { head: 'Chọn khoa quản lý' }); }).catch(hong('khoa quản lý'));
    NAP.khoa();
    var DOI = { he: ['khoa', 'ct', 'lop'], khoa: ['ct', 'lop'], ct: ['lop'], kql: ['ct', 'lop'] };
    if ($) Object.keys(DOI).forEach(function (k) {
        $(f(k)).on('select2:select select2:unselect select2:clear', function () {
            if (k === 'kql') ['ct', 'lop'].forEach(function (c) { f(c).value = ''; $(f(c)).trigger('change.select2').trigger('ums:refresh'); });
            setTimeout(function () { chuoi(DOI[k]); }, 0);   // sau khi pat.chain xoá trắng ô con
        });
    });
    var cHe = pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });
    if ($) $(f('kql')).on('select2:select select2:clear', function () { setTimeout(cHe.sync, 0); });

    ums.api.dm('QLSV.TRANGTHAI').then(function (d) {
        pat.fill(f('tt'), d);
        if ($) $(f('tt')).val((d || []).map(function (x) { return String(x.ID); })).trigger('change.select2').trigger('ums:refresh');   // chọn sẵn tất cả như gốc
    }).catch(hong('tình trạng sinh viên'));
    ums.api.dm('DIEM.THANGDIEM').then(function (d) { pat.fill(f('thang'), d, { head: 'Chọn thang điểm' }); }).catch(hong('thang điểm'));
    ums.api.dm('DIEM.LOAIDIEMTRUNGBINH').then(function (d) { pat.fill(f('ldtb'), d, { head: 'Chọn loại điểm trung bình' }); }).catch(hong('loại điểm trung bình'));
    var PV = [], pvMa = '';
    ums.api.dm('DIEM.PHAMVITONGHOPDIEM').then(function (d) { PV = d || []; pat.fill(f('pv'), PV, { head: 'Chọn phạm vi' }); }).catch(hong('phạm vi tổng hợp'));
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) {
        ['pv_HOCKY', 'pv_NHIEUKY', 'pv_DOTHOC', 'tgts'].forEach(function (k) { pat.fill(f(k), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian đào tạo' }); });
    }).catch(hong('thời gian đào tạo'));
    ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIPICwPKSAxCS4i', func: 'pkg_kehoach_thongtin.LayDSNamNhapHoc', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(f('pv_NAMHOC'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', head: 'Chọn năm' }); }).catch(hong('năm nhập học'));
    function tgPV() { return pvMa && f('pv_' + pvMa) ? v('pv_' + pvMa) : ''; }
    if ($) $(f('pv')).on('select2:select select2:clear', function () {
        var p = PV.filter(function (x) { return String(x.ID) === v('pv'); })[0];
        pvMa = p ? e(p.MA) : '';
        Array.prototype.forEach.call(root.querySelectorAll('[data-pv]'), function (s) { s.hidden = s.getAttribute('data-pv') !== pvMa; });
        taiPV();
    });
    function dk() {
        return { strTrangThaiNguoiHoc_Id: v('tt'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_KhoaQuanLy_Id: v('kql'),
            strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_LopQuanLy_Id: v('lop'), strPhamViTongHopDiem_Id: v('pv'), strDaoTao_ThoiGianDaoTao_Id: tgPV(),
            strThangDiem_Id: v('thang') };
    }

    /* ---------- Hàng đợi + báo cáo ---------------------------------------- */
    var q1o = { strLoaiNhiemVu: 'TINHDIEMTUDONG', strName: 'TongHopKetQua', history: z('h1'), concurrency: 10, onDone: taiKQ };
    var q2o = { strLoaiNhiemVu: 'TINHDIEMTUDONG_XEPLOAI', strName: 'TongHopKetQua', history: z('h2'), concurrency: 10, onDone: taiKQ };
    var q1 = ums.queue.mount(z('q1'), q1o), q2 = ums.queue.mount(z('q2'), q2o);
    f('luong').addEventListener('change', function () { q1o.concurrency = q2o.concurrency = Number(f('luong').value) || 10; });
    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        var o = dk();
        ['strTrangThaiNguoiHoc_Id', 'strDaoTao_HeDaoTao_Id', 'strDaoTao_KhoaDaoTao_Id', 'strDaoTao_KhoaQuanLy_Id', 'strDaoTao_ChuongTrinh_Id', 'strDaoTao_LopQuanLy_Id',
            'strPhamViTongHopDiem_Id', 'strDaoTao_ThoiGianDaoTao_Id', 'strThangDiem_Id'].forEach(function (k) { add(k, o[k]); });
        add('dTongHopLaiDiemThanhPhan', v('cach'));
        add('strNguoiDangNhap_Id', uid());
    } });

    function taoHangDoi(xepLoai) {
        var ten = xepLoai ? 'Xếp loại học tập' : 'Tổng hợp kết quả';
        ui.confirm('Bạn có chắc chắn ' + ten + ' không?', { title: ten, ok: xepLoai ? 'Xếp loại học tập' : 'Tính điểm' }).then(function (yes) {
            if (!yes) return;
            var o = Object.assign(dk(), { dTongHopLaiDiemThanhPhan: v('cach'), strNguoiThucHien_Id: uid() });
            var goi = xepLoai
                ? Object.assign({ action: 'D_HangDoi_MH/FSAuCSAvJgUuKB4ZJDENLiAoHhU0BS4vJgPP', func: 'diem_nhiemvu_hangdoi.TaoHangDoi_XepLoai_TuDong' }, o)
                : Object.assign({ action: 'D_HangDoi/TaoHangDoi_TinhDiem_TuDong', method: 'GET' }, o);
            ums.api.call(goi).then(function () {
                ui.toast('Khởi tạo dữ liệu thành công!', 'ok');
                (xepLoai ? q2 : q1).reload();
            }).catch(hong(xepLoai ? 'TaoHangDoi_XepLoai_TuDong' : 'TaoHangDoi_TongHopKetQua_TuDong'));
        });
    }

    /* ---------- Tab 1: danh sách kết quả ---------------------------------- */
    function taiKQ() {
        z('kq').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: 'D_TinhDiem/TinhDiem_TuDong_KetQua', method: 'GET', versionAPI: 'v1.0', strTuKhoa: '' }, dk(), {
            strNguoiThucHien_Id: uid(), dThuocTinhLanTinh: v('lan'), strLoaiDiemTrungBinh_Id: v('ldtb'), pageIndex: 1, pageSize: 100000 }))
            .then(function (r) {
                var ds = arr(r.data);
                z('n').textContent = 'Tổng: ' + (Number(r.pager) || ds.length);
                ui.table({ el: z('kq'), rows: ds, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' }, { title: 'Họ tên', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); } },
                    { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' }, { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
                    { title: 'Lớp', prop: 'LOP' }, { title: 'Chương trình học', prop: 'NGANH' }, { title: 'Khóa học', prop: 'KHOADAOTAO' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY' }, { title: 'Tình trạng', prop: 'TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
                    { title: 'Số tín chỉ', prop: 'TONGSOTINCHI', cls: 'is-center' }, { title: 'Điểm TBC', prop: 'DIEMTRUNGBINH', cls: 'is-center' }] });
            }).catch(function (err) { z('n').textContent = ''; z('kq').innerHTML = ui.fail(err.message); });
    }

    /* ---------- Tab 2: tham số tùy biến học kỳ ---------------------------- */
    var DSPV = [];
    function taiPV() {
        z('pv').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'D_ThongTin2_MH/DSA4BRIVLi8mCS4xCiQ1EDQgHhUpLigGKCAv', func: 'PKG_DIEM_THONGTIN2.LayDSTongHopKetQua_ThoiGian',
            strPhamViTongHopDiem_Id: v('pv'), strNguoiThucHien_Id: uid() }).then(function (r) {
            DSPV = arr(r.data);
            ui.table({ el: z('pv'), rows: DSPV, empty: 'Chưa có tham số', columns: [
                { title: 'Phạm vi tổng hợp điểm', prop: 'PHAMVITONGHOPDIEM_TEN' }, { title: 'Thời gian tính', prop: 'DAOTAO_THOIGIANDAOTAO_TINH', cls: 'is-center' },
                { title: 'Học kỳ sử dụng', prop: 'DAOTAO_THOIGIANDAOTAO' }, { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
                { head: '<input type="checkbox" data-pvall title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-pvck="' + i + '">'; } }] });
        }).catch(function (err) { z('pv').innerHTML = ui.fail(err.message); });
    }
    function luuPV(ids) {
        if (!ids.length) return;
        ui.batch(ids.map(function (id) {
            return { action: 'D_ThongTin2_MH/FSkkLB4VLi8mCS4xCiQ1EDQgHhUpLigGKCAv', func: 'PKG_DIEM_THONGTIN2.Them_TongHopKetQua_ThoiGian', strPhamViTongHopDiem_Id: v('pv'),
                strPhamViApDung_Id: id, strDaoTao_ThoiGianDaoTao_Id: v('tgts'), strDaoTao_ThoiGian_Tinh_Id: tgPV(), strNguoiThucHien_Id: uid() };
        }), { title: 'Đang thêm phạm vi áp dụng', okText: 'Thực hiện thành công' }).then(taiPV);
    }
    function themPV() {
        pat.pickSinhVienNganh({
            onPick: function (rows) { luuPV((rows || []).map(function (x) { return e(x.QLSV_NGUOIHOC_ID) + e(x.DAOTAO_TOCHUCCHUONGTRINH_ID); })); },
            onGroup: function (kind, ids) { luuPV(ids || []); }
        });
    }
    function xoaPV() {
        var chon = Array.prototype.map.call(z('pv').querySelectorAll('input[data-pvck]:checked'), function (c) { return DSPV[Number(c.getAttribute('data-pvck'))]; }).filter(Boolean);
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa ' + chon.length + ' dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (x) {
                return { action: 'D_ThongTin2_MH/GS4gHhUuLyYJLjEKJDUQNCAeFSkuKAYoIC8P', func: 'PKG_DIEM_THONGTIN2.Xoa_TongHopKetQua_ThoiGian', strId: x.ID, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công!' }).then(taiPV);
        });
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute && ev.target.hasAttribute('data-pvall')) {
            Array.prototype.forEach.call(z('pv').querySelectorAll('input[data-pvck]'), function (c) { c.checked = ev.target.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-tab]');
        if (t) {
            var k = t.getAttribute('data-tab');
            ui.tabsActive(root, k, 'data-tab');
            Array.prototype.forEach.call(root.querySelectorAll('[data-pane]'), function (p) { p.hidden = p.getAttribute('data-pane') !== k; });
            return;
        }
        var b = ev.target.closest('[data-a]'); if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'tinhdiem') taoHangDoi(false);
        else if (a === 'xeploai') taoHangDoi(true);
        else if (a === 'xem' || a === 'tailai') taiKQ();
        else if (a === 'thempv') themPV();
        else if (a === 'xoapv') xoaPV();
    });
})();
