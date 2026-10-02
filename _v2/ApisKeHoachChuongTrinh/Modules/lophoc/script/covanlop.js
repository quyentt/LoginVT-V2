/* =========================================================================
   Cố vấn lớp (giảng viên cố vấn / chủ nhiệm của lớp quản lý)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/lophoc/html/covanlop.html + script/covanlop.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): thanh tìm kiếm Hệ · Khóa · Chương trình · Bộ môn · Giảng viên · Lớp học ·
   Vai trò · từ khoá · Tìm kiếm → khung "Danh sách cố vấn lớp (n)" với Xóa · Thêm mới: Bộ môn ·
   Giảng viên · Lớp quản lý · Vai trò · Sửa · ô đánh dấu (phân trang máy chủ). Thêm mới / Sửa →
   biểu mẫu thay chỗ danh sách: Bộ môn · Giảng viên · Lớp quản lý · Vai trò + Đóng · Lưu và Nhập tiếp · Lưu.

   Lời gọi (kiểu cũ, chép nguyên):
       KHCT_LopQuanLy_CoVan/LayDanhSach   GET  strTuKhoa, strDaoTao_LopQuanLy_Id, strGiangVien_Id, strVaiTro_Id,
                                               strNguoiThucHien_Id '', trang
       KHCT_LopQuanLy_CoVan/LayChiTiet    GET  strId
       KHCT_LopQuanLy_CoVan/ThemMoi       POST strId '', strDaoTao_LopQuanLy_Id, strGiangVien_Id, strVaiTro_Id
       KHCT_LopQuanLy_CoVan/CapNhat       POST như trên + strId
       KHCT_LopQuanLy_CoVan/Xoa           POST strIds (các dòng đánh dấu nối dấu phẩy — một lời gọi)
       KHCT_LopQuanLy/LayDanhSach         GET  ô Lớp (lọc + biểu mẫu): strDaoTao_KhoaDaoTao_Id, strDaoTao_ToChucCT_Id
                                               của THANH LỌC, còn lại '', trang 1 / 10000
       NS_HoSoV2/LayDanhSach              GET  ô Giảng viên theo Bộ môn (strDaoTao_CoCauToChuc_Id, dLaCanBoNgoaiTruong 0,
                                               trang 1 / 1000000000); nhãn "HODEM TEN - MASO"
       KHCT_HeDaoTao/LayDanhSach · KHCT_KhoaDaoTao/LayDanhSach (theo Hệ) · KHCT_ToChucChuongTrinh/LayDanhSach (theo
       Khóa + Hệ) — GET; edu.system.getList_CoCauToChuc (Bộ môn, bản Corei); danh mục KHCT.VTGV (Vai trò)

   Khác bản gốc:
     · Hệ → Khóa → Chương trình → Lớp học và Bộ môn → Giảng viên (thanh lọc), Bộ môn → Giảng viên (biểu mẫu):
       chưa chọn cha thì KHOÁ con, đổi / xoá cha thì xoá trắng con (luật chung). Gốc lúc mở màn nạp sẵn
       TOÀN BỘ cán bộ (pageSize 1.000.000.000) vào hai ô Giảng viên — bản mới chỉ nạp khi đã chọn Bộ môn.
     · Ô Lớp quản lý của biểu mẫu nạp khi mở biểu mẫu theo Khóa / Chương trình đang chọn ở thanh lọc
       (gốc đổ chung một danh sách vào cả hai ô). Ô Bộ môn của biểu mẫu chỉ để lọc Giảng viên, KHÔNG gửi đi (như gốc).
     · Lỗi gốc đã sửa: nút Xóa gắn HAI trình xử lý (một cái không hỏi lại, một cái đọc sai tiền tố id
       "check" → gửi thêm "One<ID>"). Bản mới: hỏi lại một lần, gửi đúng ID.
     · Thêm mới điền sẵn Bộ môn / Giảng viên / Lớp / Vai trò từ thanh lọc như rewrite() gốc.
   Cố ý bỏ: ảnh trang trí img-class.svg của biểu mẫu; #btnRefresh, .btnExtend_Search, .btnDelete trên dòng
   (không có trên html); trình xử lý "select" của #dropLopQuanLy (sự kiện không bao giờ bắn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('khct-covanlop');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function rows(call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    }
    function fail(noi) { return function (err) { ums.api.handle(err, noi); }; }

    var srcHe = { call: { action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '',
        strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, name: 'TENHEDAOTAO' };
    /* edu.system.getList_CoCauToChuc (Corei) — { strCCTC_Loai_Id '', strCCTC_Cha_Id '', iTrangThai 1 } */
    var srcCCTC = { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }, name: 'TEN' };

    function napGV(bm) {
        return rows({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 1000000000,
            strDaoTao_CoCauToChuc_Id: e(bm), strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0 });
    }
    function tenGV(x) { return e(x.HODEM) + ' ' + e(x.TEN) + ' - ' + e(x.MASO); }
    function napLop(khoa, ct) {
        return rows({ action: 'KHCT_LopQuanLy/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_CoSoDaoTao_Id: '',
            strDaoTao_KhoaDaoTao_Id: e(khoa), strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: e(ct),
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 });
    }

    var curId = '';
    var crud = ums.crud({
        root: root,
        title: 'Cố vấn lớp',
        formTitle: 'cố vấn lớp',
        listTitle: 'Danh sách cố vấn lớp',
        icon: 'fa-screen-users',
        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo', source: srcHe },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình đào tạo' },
            { key: 'bm', type: 'select', label: 'Chọn bộ môn', source: srcCCTC },
            { key: 'gv', type: 'select', label: 'Chọn giảng viên' },
            { key: 'lop', type: 'select', label: 'Chọn lớp học' },
            { key: 'vt', type: 'select', label: 'Chọn vai trò', source: { dm: 'KHCT.VTGV' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'KHCT_LopQuanLy_CoVan/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strDaoTao_LopQuanLy_Id: f.lop, strGiangVien_Id: f.gv, strVaiTro_Id: f.vt, strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Bộ môn', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Giảng viên', render: function (r) { return ui.esc(e(r.GIANGVIEN_HODEM) + ' ' + e(r.GIANGVIEN_TEN) + ' - ' + e(r.GIANGVIEN_MASO)); } },
            { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Vai trò', prop: 'VAITRO_TEN' }
        ],
        fields: [
            { type: 'legend', label: 'Thông tin cố vấn lớp học' },
            { key: '_boMon', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Bộ môn', type: 'select', placeholder: 'Chọn bộ môn', source: srcCCTC },
            { key: 'strGiangVien_Id', col: 'GIANGVIEN_ID', label: 'Giảng viên', type: 'select', placeholder: 'Chọn giảng viên' },
            { key: 'strDaoTao_LopQuanLy_Id', col: 'DAOTAO_LOPQUANLY_ID', label: 'Lớp quản lý', type: 'select', placeholder: 'Chọn lớp quản lý' },
            { key: 'strVaiTro_Id', col: 'VAITRO_ID', label: 'Vai trò', type: 'select', placeholder: 'Chọn vai trò', source: { dm: 'KHCT.VTGV' } }
        ],
        saveAgain: 'Lưu và Nhập tiếp',
        detail: function (row) {
            curId = row.ID;
            return { action: 'KHCT_LopQuanLy_CoVan/LayChiTiet', method: 'GET', strId: row.ID };
        },
        save: function (v, row) {
            return {
                action: row ? 'KHCT_LopQuanLy_CoVan/CapNhat' : 'KHCT_LopQuanLy_CoVan/ThemMoi',
                strId: row ? (row.ID || curId) : '',
                strDaoTao_LopQuanLy_Id: v.strDaoTao_LopQuanLy_Id,
                strGiangVien_Id: v.strGiangVien_Id,
                strVaiTro_Id: v.strVaiTro_Id,
                strNguoiThucHien_Id: ums.session.userId
            };
        },
        rowDelete: false,
        formDelete: false,
        removeText: 'Xóa',
        remove: function (ids) {
            return { action: 'KHCT_LopQuanLy_CoVan/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: ums.session.userId };
        },
        onForm: function (row) { moForm(row); }
    });

    function fEl(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }
    function oEl(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); }
    function datGT(el, v) { if (!el) return; el.value = e(v); if (window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh'); }

    /* ---------- Thanh lọc ---------- */
    var L = { he: fEl('he'), khoa: fEl('khoa'), ct: fEl('ct'), lop: fEl('lop'), bm: fEl('bm'), gv: fEl('gv') };
    function locKhoa() {
        if (!L.he.value) { pat.fill(L.khoa, []); return Promise.resolve(); }
        return rows({ action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HeDaoTao_Id: L.he.value,
            strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { pat.fill(L.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }, fail('nạp khóa đào tạo'));
    }
    function locCT() {
        if (!L.khoa.value) { pat.fill(L.ct, []); return Promise.resolve(); }
        return rows({ action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: L.khoa.value,
            strDaoTao_HeDaoTao_Id: L.he.value, strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { pat.fill(L.ct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); }, fail('nạp chương trình'));
    }
    function locLop() {
        if (!L.ct.value) { pat.fill(L.lop, []); return Promise.resolve(); }
        return napLop(L.khoa.value, L.ct.value).then(function (r) { pat.fill(L.lop, r, { name: 'TEN', head: 'Chọn lớp học' }); }, fail('nạp lớp'));
    }
    function locGV() {
        if (!L.bm.value) { pat.fill(L.gv, []); return Promise.resolve(); }
        return napGV(L.bm.value).then(function (r) { pat.fill(L.gv, r, { name: tenGV, head: 'Chọn giảng viên' }); }, fail('nạp giảng viên'));
    }
    jQuery(L.he).on('select2:select select2:clear', function () { locKhoa().then(locCT).then(locLop); });
    jQuery(L.khoa).on('select2:select select2:clear', function () { locCT().then(locLop); });
    jQuery(L.ct).on('select2:select select2:clear', locLop);
    jQuery(L.bm).on('select2:select select2:clear', locGV);
    pat.chain([L.he, L.khoa, L.ct, L.lop], { phatLai: false });
    pat.chain([L.bm, L.gv], { phatLai: false });

    /* ---------- Biểu mẫu: Bộ môn → Giảng viên ---------- */
    var B = { bm: oEl('_boMon'), gv: oEl('strGiangVien_Id'), lop: oEl('strDaoTao_LopQuanLy_Id') };
    function bmGV() {
        if (!B.bm.value) { pat.fill(B.gv, []); return Promise.resolve(); }
        return napGV(B.bm.value).then(function (r) { pat.fill(B.gv, r, { name: tenGV, head: 'Chọn giảng viên' }); }, fail('nạp giảng viên'));
    }
    jQuery(B.bm).on('select2:select select2:clear', bmGV);
    var chainB = pat.chain([B.bm, B.gv], { phatLai: false });

    var moSeq = 0;
    function moForm(row) {
        var my = ++moSeq;
        var f = crud.filterValues();
        var bm = row ? row.DAOTAO_COCAUTOCHUC_ID : f.bm;
        var gv = row ? row.GIANGVIEN_ID : f.gv;
        var lop = row ? row.DAOTAO_LOPQUANLY_ID : f.lop;
        if (!row) { datGT(B.bm, bm); datGT(oEl('strVaiTro_Id'), f.vt); }
        /* Bản ghi cũ không có Bộ môn mà có Giảng viên: vẫn nạp danh sách (theo Bộ môn rỗng, như gốc) để hiện đúng tên */
        var napDs = (bm || !gv) ? bmGV() : napGV('').then(function (r) { pat.fill(B.gv, r, { name: tenGV, head: 'Chọn giảng viên' }); }, fail('nạp giảng viên'));
        napDs.then(function () { if (my === moSeq) { datGT(B.gv, gv); chainB.sync(); } });
        napLop(f.khoa, f.ct).then(function (r) {
            if (my !== moSeq) return;
            pat.fill(B.lop, r, { name: 'TEN', head: 'Chọn lớp quản lý' });
            datGT(B.lop, lop);
        }, fail('nạp lớp quản lý'));
    }
})();
