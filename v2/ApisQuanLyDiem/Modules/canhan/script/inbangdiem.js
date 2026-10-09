/* =========================================================================
   canhan/inbangdiem — In bảng điểm cá nhân (phân hệ Quản lý điểm)
   Danh sách người học (mỗi dòng một người học × chương trình) + 6 cột "Xem" (_chitiet.js, ums.qldIbd).
   Bản gốc: ApisQuanLyDiem/Modules/canhan/html/inbangdiem.html + script/inbangdiem.js (vỏ indexi / Corei).
   Anh em: ApisCongCanBo/Modules/nhapdiem/inbangdiem (đã chuyển) — bản QLĐ LỆCH nhiều: lời gọi kiểu cũ
   D_BaoCao/* (không mã hoá), bộ lọc KHÔNG theo quyền, ít cột hơn, thêm "Điểm kết thúc" (Không tính điểm),
   không có Tổng hợp / Nợ môn / Email / Excel. Dùng lại: ums.ibd.caLop (+ cờ buoiHoc: false), ums.diemHoc.veBangDiem.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Danh sách  D_BaoCao/LayDanhSachHoSoNhieuNganh (GET, phân trang máy chủ, 10 dòng như pageSize_default = 10)
       Bộ lọc     edu.system.getList_* (KHÔNG theo quyền — bản gốc không dùng genBoLoc_HeKhoa):
                  Hệ ums.ref.heDaoTao · Khoá ums.ref.khoaDaoTao(strHeDaoTao_Id) · Khoa QL ums.ref.khoaQuanLy
                  · CT ums.ref.chuongTrinh(strKhoaDaoTao_Id, strKhoaQuanLy_Id — KHÔNG gửi Hệ, như gốc)
                  · Lớp pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy (bản Corei, có strDaoTao_KhoaQuanLy_Id — ums.ref.lopQuanLy thiếu tham số này)
       Trạng thái SV danh mục QLSV.TRANGTHAI (đánh dấu sẵn tất cả)
       Loại xét TN_KeHoach/LayDSPhanLoaiXetTheoND1 (strNguoiDung_Id = người đăng nhập) → Kế hoạch TN_ThongTin/LayDSTN_KeHoach (pageSize 100000)
       Phạm vi tổng hợp (CHỈ dùng cho báo cáo) DIEM.PHAMVITONGHOPDIEM → thời gian ums.ref.thoiGianDaoTao · năm KHCT_NamNhapHoc/LayDanhSach
   Báo cáo (getList_MauImport "zonebtnSVQD", không có vùng Import): strPhamViTongHopDiem_Id, strDaoTao_ThoiGianDaoTao_Id (ô con của
       phạm vi), strTuKhoa, strNamNhapHoc '', strKhoaQuanLy_Id '' (gốc đọc ô dropAAAA không tồn tại — giữ rỗng, xem _cq),
       strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id, strTrangThaiNguoiHoc_Id, strTN_KeHoach_Id,
       rồi MỖI dòng đánh dấu một strQlsv_NguoiHoc_Id (= ID dòng như gốc).
   Khác bản gốc:
     · Hệ → Khoá → CT → Lớp là lọc "Tất cả …" ở gốc; nay KHOÁ theo luật cha → con (như bản Cổng cán bộ). Khoa QL là cha
       TUỲ CHỌN của CT + Lớp: đổi / xoá Khoa QL thì xoá trắng CT, Lớp rồi nạp lại. Loại xét → Kế hoạch cũng khoá
       (gốc nạp sẵn MỌI kế hoạch lúc mở màn).
     · Đóng khung "Xem toàn bộ" thì nạp lại danh sách (như toggle_form gốc).
   Bỏ (mã chết của gốc): rewrite / save_QuyetDinh / getList_MauImport riêng (CM_Import_PhanQuyen, không nơi nào gọi),
       .btnAdd, nhánh #btnSave_QuyetDinh (nút không tồn tại), dropSearch_ThoiGianDaoTao_QD / dropThoiGianDaoTao_QD (không có ô).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, Q = ums.qldIbd;
    var root = document.getElementById('qld-inbangdiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function sel(k, ph, multi) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') + '>' + (multi ? '' : '<option value=""></option>') + '</select></div>'; }

    root.innerHTML = pat.page('In bảng điểm cá nhân', '<span data-z="bc"></span>') +
        '<div data-z="ds">' +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Thông tin người học (Mã số, họ tên, ngày sinh …)" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div></div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-user-graduate"></i> Chọn trạng thái sinh viên</div><div data-z="tt"></div>' +
            '<details class="ibd-mo"><summary>Điều kiện lọc dữ liệu mở rộng</summary><div class="ums-filter ums-u-mt-2">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('kql', 'Tất cả khoa quản lý') + sel('ct', 'Tất cả chương trình đào tạo') +
                sel('lop', 'Tất cả lớp') + sel('lx', 'Chọn loại xét') + sel('kh', 'Chọn kế hoạch') + '</div>' +
                '<div class="ums-filter ums-u-mt-2"><span class="ums-u-fz13 ums-u-muted ibd-pv__nhan">Phạm vi tổng hợp</span>' + sel('pv', 'Chọn phạm vi') +
                    '<span class="ums-u-fz13 ibd-pv" data-pv="TOANKHOA" hidden>- Toàn khóa</span>' +
                    '<span class="ibd-pv" data-pv="NHIEUKY" hidden>' + sel('pv_NHIEUKY', 'Chọn kỳ', true) + '</span>' +
                    '<span class="ibd-pv" data-pv="NAMHOC" hidden>' + sel('pv_NAMHOC', 'Chọn năm học') + '</span>' +
                    '<span class="ibd-pv" data-pv="HOCKY" hidden>' + sel('pv_HOCKY', 'Chọn học kỳ') + '</span>' +
                    '<span class="ibd-pv" data-pv="DOTHOC" hidden>' + sel('pv_DOTHOC', 'Chọn đợt học') + '</span></div></details>' }) +
        pat.panel({ title: 'Danh sách sinh viên', icon: 'fa-rectangle-history-circle-user', count: 'n', flush: true,
            body: '<div data-z="bang">' + ui.empty('Nhập điều kiện rồi bấm "Tìm kiếm" để xem danh sách sinh viên.', 'fa-magnifying-glass') + '</div>' }) +
        '</div><div data-z="tb" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var $ = window.jQuery;

    /* ---------- Bộ lọc Hệ → Khoá → CT → Lớp (+ Khoa QL) ------------------ */
    var TT = pat.checks(z('tt'), ums.api.dm('QLSV.TRANGTHAI'), { what: 'trạng thái sinh viên' });
    function hong(t) { return function (err) { ums.api.handle(err, t); }; }
    var NAP = {
        khoa: function () {
            return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA', head: 'Tất cả khóa đào tạo' }); }).catch(hong('khóa đào tạo'));
        },
        ct: function () {
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: v('kql'), strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH', head: 'Tất cả chương trình đào tạo' }); }).catch(hong('chương trình đào tạo'));
        },
        lop: function () {
            /* edu.system.getList_LopQuanLy (Corei:4080) — gửi cả strDaoTao_KhoaQuanLy_Id */
            return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', silent: true,
                strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_KhoaQuanLy_Id: v('kql'),
                strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f('lop'), arr(r.data), { name: 'TEN', head: 'Tất cả lớp' }); }).catch(hong('lớp quản lý'));
        }
    };
    function chuoi(ks) { return ks.reduce(function (p, k) { return p.then(NAP[k]); }, Promise.resolve()); }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO', head: 'Tất cả hệ đào tạo' }); }).catch(hong('hệ đào tạo'));
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { head: 'Tất cả khoa quản lý' }); }).catch(hong('khoa quản lý'));
    NAP.khoa();
    var DOI = { he: ['khoa', 'ct', 'lop'], khoa: ['ct', 'lop'], ct: ['lop'], kql: ['ct', 'lop'] };
    if ($) Object.keys(DOI).forEach(function (k) {
        $(f(k)).on('select2:select select2:clear', function () {
            if (k === 'kql') ['ct', 'lop'].forEach(function (c) { f(c).value = ''; $(f(c)).trigger('change.select2').trigger('ums:refresh'); });
            /* pat.chain xoá trắng ô con trong CÙNG sự kiện — nạp sau nó để khỏi đọc giá trị cũ */
            setTimeout(function () { chuoi(DOI[k]); }, 0);
        });
    });
    var cHe = pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });
    if ($) $(f('kql')).on('select2:select select2:clear', function () { setTimeout(cHe.sync, 0); });

    /* ---------- Loại xét → Kế hoạch --------------------------------------- */
    var cLX = pat.chain([f('lx'), f('kh')], { phatLai: false });
    ums.api.call({ action: 'TN_KeHoach/LayDSPhanLoaiXetTheoND1', method: 'GET', strNguoiDung_Id: uid() })
        .then(function (r) { pat.fill(f('lx'), arr(r.data), { head: 'Chọn loại xét' }); cLX.sync(); }).catch(hong('loại xét'));
    function napKH() {
        if (!v('lx')) { pat.fill(f('kh'), [], { head: 'Chọn kế hoạch' }); cLX.sync(); return; }
        ums.api.call({ action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET', strTuKhoa: '', strPhanLoai_Id: v('lx'), strDaoTao_ThoiGianDaoTao_Id: '', strNguoiDung_Id: '',
            strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) { pat.fill(f('kh'), arr(r.data), { head: 'Chọn kế hoạch' }); cLX.sync(); }).catch(hong('kế hoạch xét'));
    }
    if ($) $(f('lx')).on('select2:select select2:clear', napKH);

    /* ---------- Phạm vi tổng hợp (chỉ cho báo cáo) ------------------------- */
    var PV = [], pvMa = '';
    ums.api.dm('DIEM.PHAMVITONGHOPDIEM').then(function (d) { PV = d || []; pat.fill(f('pv'), PV, { head: 'Chọn phạm vi' }); }).catch(function () {});
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) {
        ['pv_NHIEUKY', 'pv_HOCKY', 'pv_DOTHOC'].forEach(function (k) { pat.fill(f(k), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' }); });
    }).catch(hong('thời gian đào tạo'));
    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', strNguoiThucHien_Id: '' })
        .then(function (r) { pat.fill(f('pv_NAMHOC'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', head: 'Tất cả năm nhập học' }); }).catch(hong('năm nhập học'));
    if ($) $(f('pv')).on('select2:select select2:clear', function () {
        var p = PV.filter(function (x) { return String(x.ID) === v('pv'); })[0];
        pvMa = p ? e(p.MA) : '';
        Array.prototype.forEach.call(root.querySelectorAll('[data-pv]'), function (s) { s.hidden = s.getAttribute('data-pv') !== pvMa; });
    });

    /* ---------- Danh sách ---------------------------------------------------- */
    function loc() {
        return { strTuKhoa: v('q'), strNamNhapHoc: '', strKhoaQuanLy_Id: v('kql'), strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'),
            strLopQuanLy_Id: v('lop'), strTrangThaiNguoiHoc_Id: TT.val(), strChucNang_Id: cn(), strTN_KeHoach_Id: v('kh'), strNguoiThucHien_Id: uid() };
    }
    var trang = 1, co = 10, DS = [], TONG = 0;
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(Object.assign({ action: 'D_BaoCao/LayDanhSachHoSoNhieuNganh', method: 'GET', pageIndex: trang, pageSize: co }, loc()))
            .then(function (r) { DS = arr(r.data); TONG = Number(r.pager) || DS.length; ve(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }
    function nut(k, i) { return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-x': k, 'data-i': i } }); }
    function ve() {
        z('n').textContent = '(' + TONG + ')';
        ui.table({ el: z('bang'), rows: DS, empty: 'Không có sinh viên', columns: [
            ['tb', 'Điểm toàn bộ'], ['dtb', 'Điểm trung bình'], ['khoi', 'Tích lũy theo khối'], ['dk', 'Kết quả đăng ký'], ['lop', 'Kết quả đăng ký cả lớp'], ['kt', 'Điểm kết thúc']
        ].map(function (c) { return { title: c[1], cls: 'is-center', render: function (x, i) { return nut(c[0], i); } }; }).concat([
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }, { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
            { title: 'Tài chính', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.TONGNOPHI); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }, { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' }, { title: 'ĐTBTL Hệ 4', prop: 'DTBTICHLUYHE4TOANKHOA', cls: 'is-center' },
            { title: 'ĐTBTL Hệ 10', prop: 'DTBTICHLUYHE10TOANKHOA', cls: 'is-center' }, { title: 'Số TCTL', prop: 'SOTCTICHLUYTOANKHOA', cls: 'is-center' },
            { head: '<input type="checkbox" data-chon="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-chon="' + i + '">'; } }]),
            page: { index: trang, size: co, total: TONG, onChange: function (p) { trang = p; tai(); }, onSize: function (s) { co = s === 'all' ? Math.max(TONG, 1) : Number(s); trang = 1; tai(); } } });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-chon]:checked'), function (c) { return c.getAttribute('data-chon') !== 'all'; })
            .map(function (c) { return DS[Number(c.getAttribute('data-chon'))]; }).filter(Boolean);
    }
    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        add('strPhamViTongHopDiem_Id', v('pv'));
        add('strDaoTao_ThoiGianDaoTao_Id', pvMa && f('pv_' + pvMa) ? v('pv_' + pvMa) : '');
        var l = loc();
        l.strKhoaQuanLy_Id = '';   // gốc: edu.util.getValById('dropAAAA') — ô không tồn tại
        ['strTuKhoa', 'strNamNhapHoc', 'strKhoaQuanLy_Id', 'strHeDaoTao_Id', 'strKhoaDaoTao_Id', 'strChuongTrinh_Id', 'strLopQuanLy_Id', 'strTrangThaiNguoiHoc_Id', 'strTN_KeHoach_Id']
            .forEach(function (k) { add(k, l[k]); });
        daChon().forEach(function (x) { add('strQlsv_NguoiHoc_Id', x.ID); });
    } });

    /* ---------- Khung "Xem toàn bộ" thay chỗ danh sách ---------------------- */
    function xemToanBo(r) {
        Q.toanBo(z('tb'), r, function () { ui.swap(z('tb'), z('ds')); tai(); });
        ui.swap(z('ds'), z('tb'));
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    var HOP = { dtb: 'diemTB', khoi: 'tichLuy', dk: 'ketQuaDK', lop: 'caLop', kt: 'diemKetThuc' };
    z('bang').addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute && t.getAttribute('data-chon') === 'all') {
            Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-chon]'), function (c) { c.checked = t.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-x][data-i]');
        if (b && z('bang').contains(b)) {
            var r = DS[Number(b.getAttribute('data-i'))]; if (!r) return;
            var k = b.getAttribute('data-x');
            if (k === 'tb') xemToanBo(r); else Q[HOP[k]](r);
            return;
        }
        if ((b = ev.target.closest('[data-a="search"]'))) { trang = 1; tai(); }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang = 1; tai(); } });
})();
