/* =========================================================================
   Quản lý toàn bộ (danh sách hồ sơ người học nhiều ngành)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/quanlytoanbo.html + script/quanlytoanbo.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm — Hệ · Khoá · Chương trình · Lớp ·
   Năm nhập học · Khoa quản lý · Thời gian (đều CHỌN NHIỀU) / từ khoá · Tìm kiếm ·
   Xuất báo cáo · Import / "Chọn trạng thái sinh viên" → khung "Danh sách (n)":
   Mã số · Họ đệm · Tên · Ngày sinh · Tình trạng · Lớp · Chương trình · Khóa học ·
   Khoa quản lý · Hệ đào tạo · ô đánh dấu (phân trang máy chủ, 10 dòng).

   Lời gọi (chép nguyên):
       SV_HoSoNhieuNganh/LayDanhSach          GET  danh sách (strTuKhoa, strNamNhapHoc, strKhoaQuanLy_Id,
                                              strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id,
                                              strNguoiDangNhap_Id, strTrangThaiNguoiHoc_Id, strNguoiTao_Id '', trang)
       edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao / LopQuanLy (bản Corei — ums.dkhLop.dt)
       KHCT_NamNhapHoc/LayDanhSach            GET  ô Năm nhập học (NAMNHAPHOC)
       edu.system.getList_KhoaQuanLy          = ums.ref.khoaQuanLy
       DKH_Chung/LayThoiGianDangKyHoc         GET  ô Thời gian (chỉ gửi vào báo cáo — gốc không gửi vào danh sách)
       danh mục QLSV.TRANGTHAI                trạng thái sinh viên
   Báo cáo / Import: ums.report.mount (= getList_MauImport "zonebtnBaoCao_QLTB" — html gốc có
   cả vùng _Import), collect() thêm ĐÚNG các khoá gốc thêm: strTuKhoa, strChucNang_Id,
   strNguoiHoc_ThanhPhan_Ids_01..04 (ID dòng đã đánh dấu, mỗi phần 120), strNguoiHoc_ThanhPhan_01..04
   rỗng, strNamNhapHoc, strKhoaQuanLy_Id, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id,
   strLopQuanLy_Id, strThoiGianDaoTao_Id, strNguoiDangNhap_Id, strTrangThaiNguoiHoc_Id, và
   mỗi dòng đánh dấu một strNguoiHoc_Id.

   Cố ý KHÔNG dựng (không có đường vào ở bản gốc):
     · Vùng "Chỉnh sửa hồ sơ" (#zoneEdit: SV_HoSo/LayChiTiet · Capnhat · Xoa, thành viên gia
       đình SV_ThanhPhanGiaDinh/*) và hai hộp "Quá trình quyết định" / "Quá trình chuyển lớp"
       (SV_QuyetDinh_ThucThi, SV_HoatDong_ThayDoi): các nút .btnEdit / .btnDetailQuyetDinh /
       .btnDetailChuyenLop đều đã bị chú thích bỏ trong genTable_QuanLyToanBo, nên không bao giờ
       mở được. Nút xoá hàng loạt #btnDeleteQuanLyToanBo cũng đã bị chú thích trong html.
       (viewForm_HS gốc còn đọc main_doc.CapNhatHoSo không tồn tại → TypeError nếu có mở.)
     · TaoHangDoi (SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong): không nơi nào gọi, lại dùng biến
       strNguoiHoc_ThanhPhan_0x chưa khai báo → ReferenceError.
     · getList_HSSV / genTable_HSSV: mã chết (bảng tblDSSV_NhanSu không có trong html).
   Khác bản gốc:
     · Bấm chuột vào ô từ khoá KHÔNG tìm kiếm nữa (gốc gắn nhầm .click → mỗi lần bấm vào ô là
       nạp lại danh sách); Enter và nút Tìm kiếm giữ nguyên.
     · Hệ → Khoá → Chương trình → Lớp: chưa chọn tầng trên thì KHOÁ tầng dưới, đổi / bỏ tầng trên
       thì xoá trắng tầng dưới (luật chung 2026-09-21, ums.pat.chain).
     · Lần nạp đầu gửi trạng thái sinh viên đã đánh dấu sau khi danh mục về (gốc gọi danh sách
       cùng lúc với danh mục nên thường gửi rỗng).

   CỜ `data-kieu="khct"` trên thẻ gốc (#dkh-quanlytoanbo) — bản của Kế hoạch chương trình
   (ApisKeHoachChuongTrinh/Modules/lophoc/html/quanlytoanbo.html + script/quanlytoanbo.js, gốc chép từ
   bản này, lệch 277 dòng). Không có cờ thì hành vi y như trên. Có cờ:
     · Sáu ô lọc là ô chọn MỘT (html gốc bỏ `multiple`), ô Thời gian bị chú thích bỏ trong html gốc
       (getList_ThoiGianDaoTao cũng chú thích) → không vẽ; báo cáo vẫn gửi strThoiGianDaoTao_Id rỗng.
     · Nút "Chuyển lớp" đầu khung Danh sách (#btnChuyenNguyenVong) → hộp "Chuyển lớp": Hệ đào tạo →
       Khóa đào tạo → Lớp quản lý + Lý do (#myModalNguyenVong). Lời gọi chép nguyên:
         edu.system.getList_HeDaoTao / getList_KhoaDaoTao (bản Corei — ums.dkhLop.dt.he / khoa)
         KHCT_LopQuanLy/LayDanhSach   GET  lớp theo khóa (strTuKhoa '', strDaoTao_CoSoDaoTao_Id '',
                                           strDaoTao_KhoaDaoTao_Id, Nganh/LoaiLop/ToChucCT '', trang 1 / 100000);
                                           nhãn "TEN(SOLUONGTHUCTE)"
         SV_QuyetDinh_MH/FSk0IhUpKB4CKTQ4JC8NLjEeFTM0IhUoJDEP  [PKG_HOSOHOCVIEN_QUYETDINH.ThucThi_ChuyenLop_TrucTiep]
                                           mỗi dòng đánh dấu một lời gọi: strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID,
                                           strDaoTao_LopQuanLy_Cu_Id = DAOTAO_LOPQUANLY_ID của dòng,
                                           strDaoTao_LopQuanLy_Moi_Id = lớp chọn, strTrangThaiNguoiHoc_Moi_Id '',
                                           strTo_Moi_Id '', strNgayHieuLuc '', strGhiChu = Lý do
       Khác gốc: phải chọn Lớp quản lý mới cho chuyển (gốc gửi lớp rỗng); hỏi lại MỘT lần (gốc gắn thêm
       #btnYes mỗi lần bấm); Hệ → Khóa → Lớp khoá theo luật cha → con. Bỏ save_ChuyenNguyenVong
       (TS_HoSoDuTuyen/ChuyenLop — không nút nào gọi, đọc ô dropKeHoachTuyenSinh không có trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.dkhLop, e = L.e;
    var root = document.getElementById('dkh-quanlytoanbo');
    if (!root) return;
    var KHCT = root.getAttribute('data-kieu') === 'khct';

    function sel(k, ph) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + ph + '"' +
            (KHCT ? '><option value="">' + ph + '</option>' : ' multiple>') + '</select></div>';
    }
    root.innerHTML = pat.page('Quản lý toàn bộ', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') +
                sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
            '</div><div class="ums-filter ums-u-mt-4">' +
                sel('nam', 'Tất cả năm nhập học') + sel('kql', 'Tất cả khoa quản lý') + (KHCT ? '' : sel('tg', 'Tất cả học kỳ')) +
            '</div><div class="ums-filter ums-u-mt-4">' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach ums-u-mb-2">Chọn trạng thái sinh viên</div>' +
            '<div data-z="tt"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-building', count: 'n', flush: true, zone: 'bang',
            tools: KHCT ? ui.btn('save', { text: 'Chuyển lớp', mod: 'primary', icon: 'fa-arrow-down-up-across-line', attr: { 'data-a': 'chuyenLop' } }) : '' });

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var F = {};
    ['he', 'khoa', 'ct', 'lop', 'nam', 'kql', 'tg'].forEach(function (k) { F[k] = f(k); if (!KHCT) L.s2multi(F[k]); });
    ui.enhance(root);
    L.ganChonTatCa(root);
    function m(k) { return L.multi(F[k]); }
    /* Bản KHCT: ô chọn một → pat.fill (nhãn "Tất cả …" như cbGenCombo_* gốc) */
    function fillO(el, r, o) {
        if (!el) return;
        if (KHCT) pat.fill(el, r, { id: o.id, name: o.name, head: el.getAttribute('data-ph') });
        else L.fillMulti(el, r, o);
    }

    /* ---------- Nguồn lọc ---------- */
    function napKhoa() { return L.dt.khoa(m('he')).then(function (r) { fillO(F.khoa, r, { name: 'TENKHOA' }); }, L.fail('nạp khóa đào tạo')); }
    function napCT() { return L.dt.ct(m('khoa')).then(function (r) { fillO(F.ct, r, { name: 'TENCHUONGTRINH' }); }, L.fail('nạp chương trình')); }
    function napLop() { return L.dt.lop(m('he'), m('khoa'), m('ct')).then(function (r) { fillO(F.lop, r, { name: 'TEN' }); }, L.fail('nạp lớp')); }

    L.dt.he().then(function (r) { fillO(F.he, r, { name: 'TENHEDAOTAO' }); }, L.fail('nạp hệ đào tạo'));
    napKhoa(); napCT(); napLop();
    L.rows({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', strNguoiThucHien_Id: '' })
        .then(function (r) { fillO(F.nam, r, { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' }); }, L.fail('nạp năm nhập học'));
    ums.ref.khoaQuanLy().then(function (r) { fillO(F.kql, r, { name: 'TEN' }); }, L.fail('nạp khoa quản lý'));
    if (!KHCT) L.rows({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' })
        .then(function (r) { fillO(F.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO' }); }, L.fail('nạp thời gian'));

    /* Đổi tầng trên (chọn / bỏ / xoá hết) → nạp lại các tầng dưới như gốc
       (gốc: Hệ → Khoá, CT, Lớp; Khoá → CT, Lớp; CT → Lớp). Nghe 'change' vì nút × của dòng
       tóm tắt ô chọn nhiều chỉ bắn change. */
    jQuery(F.he).on('change', function () { napKhoa().then(napCT).then(napLop); });
    jQuery(F.khoa).on('change', function () { napCT().then(napLop); });
    jQuery(F.ct).on('change', function () { napLop(); });
    pat.chain([F.he, F.khoa, F.ct, F.lop], { phatLai: false });

    var tt = L.trangThai(z('tt'));

    /* ---------- Danh sách ---------- */
    var st = { trang: 1, co: 10, rows: [], token: 0 };
    function thamSo() {
        return {
            strTuKhoa: f('q').value.trim(),
            strNamNhapHoc: m('nam'),
            strKhoaQuanLy_Id: m('kql'),
            strHeDaoTao_Id: m('he'),
            strKhoaDaoTao_Id: m('khoa'),
            strChuongTrinh_Id: m('ct'),
            strLopQuanLy_Id: m('lop'),
            strNguoiDangNhap_Id: ums.session.userId,
            strTrangThaiNguoiHoc_Id: tt.val()
        };
    }
    function tai(p) {
        if (p) st.trang = p;
        var my = ++st.token;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var o = thamSo();
        o.action = 'SV_HoSoNhieuNganh/LayDanhSach';
        o.method = 'GET';
        o.strNguoiTao_Id = '';
        o.pageIndex = st.trang;
        o.pageSize = st.co;
        ums.api.call(o).then(function (r) {
            if (my !== st.token) return;
            st.rows = L.arr(r.data);
            var tong = Number(r.pager) || st.rows.length;
            z('n').textContent = '(' + tong + ')';
            ui.table({ el: z('bang'), rows: st.rows, empty: 'Không có dữ liệu',
                page: { index: st.trang, size: st.co, total: tong, onChange: tai, onSize: function (s) { st.co = s; tai(1); } },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
                    { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', cls: 'is-nowrap' },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
                    L.cotChon('sv')
                ] });
        }).catch(function (err) {
            if (my !== st.token) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách người học');
        });
    }

    ums.report.mount(z('bc'), {
        collect: function (add) {
            var ids = L.chon(z('bang'), 'sv');
            var p = thamSo();
            var o = {
                strTuKhoa: p.strTuKhoa,
                strChucNang_Id: ums.state.chucNangId,
                strNguoiHoc_ThanhPhan_Ids_01: ids.slice(0, 120).toString(),
                strNguoiHoc_ThanhPhan_01: '',
                strNguoiHoc_ThanhPhan_Ids_02: ids.slice(120, 240).toString(),
                strNguoiHoc_ThanhPhan_02: '',
                strNguoiHoc_ThanhPhan_Ids_03: ids.slice(240, 360).toString(),
                strNguoiHoc_ThanhPhan_03: '',
                strNguoiHoc_ThanhPhan_Ids_04: ids.slice(360, 480).toString(),
                strNguoiHoc_ThanhPhan_04: '',
                strNamNhapHoc: p.strNamNhapHoc,
                strKhoaQuanLy_Id: p.strKhoaQuanLy_Id,
                strHeDaoTao_Id: p.strHeDaoTao_Id,
                strKhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                strChuongTrinh_Id: p.strChuongTrinh_Id,
                strLopQuanLy_Id: p.strLopQuanLy_Id,
                strThoiGianDaoTao_Id: m('tg'),
                strNguoiDangNhap_Id: p.strNguoiDangNhap_Id,
                strTrangThaiNguoiHoc_Id: p.strTrangThaiNguoiHoc_Id
            };
            Object.keys(o).forEach(function (k) { add(k, o[k]); });
            ids.forEach(function (id) { add('strNguoiHoc_Id', id); });
        },
        onImported: function () { tai(); }
    });

    /* ---------- Chuyển lớp (chỉ bản KHCT) ---------- */
    function chuyenLop() {
        var ids = L.chon(z('bang'), 'sv');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var ds = ids.map(function (id) { return st.rows.find(function (x) { return String(x.ID) === String(id); }); }).filter(Boolean);
        function o(k, ph) { return '<select class="ums-select" data-cl="' + k + '" data-ph="' + ph + '"><option value="">' + ph + '</option></select>'; }
        var dlg = ui.dialog({
            title: 'Chuyển lớp', icon: 'fa-arrow-down-up-across-line', size: 'md',
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Hệ đào tạo', o('he', 'Chọn hệ đào tạo')) +
                ui.field('Khóa đào tạo', o('khoa', 'Chọn khóa đào tạo')) +
                '<div style="grid-column:1 / -1">' + ui.field('Lớp quản lý', o('lop', 'Chọn lớp quản lý'), { required: true }) + '</div>' +
                '<div style="grid-column:1 / -1">' + ui.field('Lý do', '<textarea class="ums-textarea" data-cl="lydo" rows="3"></textarea>') + '</div>' +
                '</div>',
            buttons: [{ text: 'Chuyển lớp', mod: 'primary', icon: 'fa-arrow-down-up-across-line', onClick: function (d) {
                var lop = D('lop').value;
                if (!lop) { ui.toast('Vui lòng chọn lớp quản lý', 'warn'); return false; }
                var ten = ds.length === 1 ? e(ds[0].QLSV_NGUOIHOC_HODEM) + ' ' + e(ds[0].QLSV_NGUOIHOC_TEN) : ds.length + ' sinh viên';
                var lyDo = D('lydo').value;
                ui.confirm('Bạn có muốn chuyển lớp cho ' + ten + ' không?', { ok: 'Chuyển lớp', title: 'Chuyển lớp' }).then(function (yes) {
                    if (!yes) return;
                    d.close();
                    ui.batch(ds.map(function (r) {
                        return { action: 'SV_QuyetDinh_MH/FSk0IhUpKB4CKTQ4JC8NLjEeFTM0IhUoJDEP',
                            func: 'PKG_HOSOHOCVIEN_QUYETDINH.ThucThi_ChuyenLop_TrucTiep',
                            strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Cu_Id: r.DAOTAO_LOPQUANLY_ID,
                            strDaoTao_LopQuanLy_Moi_Id: lop, strTrangThaiNguoiHoc_Moi_Id: '', strTo_Moi_Id: '', strNgayHieuLuc: '',
                            strGhiChu: lyDo, strNguoiThucHien_Id: ums.session.userId };
                    }), { title: 'Đang chuyển lớp', okText: 'Chuyển lớp thành công' }).then(function () { tai(); });
                });
                return false;
            } }]
        });
        function D(k) { return dlg.body.querySelector('[data-cl="' + k + '"]'); }
        ui.enhance(dlg.body);
        L.dt.he().then(function (r) { pat.fill(D('he'), r, { name: 'TENHEDAOTAO' }); }, L.fail('nạp hệ đào tạo'));
        function napKhoa2() {
            return L.dt.khoa(D('he').value).then(function (r) { pat.fill(D('khoa'), r, { name: 'TENKHOA' }); }, L.fail('nạp khóa đào tạo'));
        }
        function napLop2() {
            if (!D('khoa').value) { pat.fill(D('lop'), []); return; }
            L.rows({ action: 'KHCT_LopQuanLy/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: D('khoa').value, strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) { pat.fill(D('lop'), r, { name: function (x) { return e(x.TEN) + '(' + e(x.SOLUONGTHUCTE) + ')'; } }); },
                    L.fail('nạp lớp quản lý'));
        }
        jQuery(D('he')).on('select2:select select2:clear', napKhoa2);
        jQuery(D('khoa')).on('select2:select select2:clear', napLop2);
        pat.chain([D('he'), D('khoa'), D('lop')], { phatLai: false });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) tai(1);
        if (ev.target.closest('[data-a="chuyenLop"]')) chuyenLop();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });

    /* Chờ danh mục trạng thái (đánh dấu sẵn) rồi mới nạp lần đầu */
    tt.ready.then(function () { tai(1); });
})();
