/* =========================================================================
   Nội dung đào tạo — phần dùng chung của 6 màn trong module
   (monhoc, hocphan, hocphantuongduong, quanhehocphan, baihoc, decuonghoctap)
   ---------------------------------------------------------------------------
   Sáu màn gốc cùng một khuôn: thanh lọc đầu trang + bảng + biểu mẫu thay chỗ
   → mỗi màn là một ums.crud. Tệp này chỉ gom:
     · các lời gọi danh mục KIỂU CŨ mà gốc dùng (chép nguyên — KHÔNG phải bản
       pkg_kehoach_thongtin của ums.ref, cũng không phải bản lọc quyền):
         KHCT_HeDaoTao/LayDanhSach · KHCT_KhoaDaoTao/LayDanhSach ·
         KHCT_ToChucChuongTrinh/LayDanhSach · KHCT_HocPhan_ChuongTrinh/LayDanhSach ·
         KHCT_HocPhan/LayDanhSach · KHCT_MonHoc/LayDanhSach (GET cả)
       và nguồn Bộ môn = edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc);
     · bộ lọc nối tầng Hệ → Khoá → Chương trình trên thanh lọc của ums.crud
       (luật cha → con: pat.chain khoá tầng dưới);
     · ô chọn PHỤ THUỘC trong biểu mẫu ums.crud (Chương trình → Học phần).

       var N = ums.khctND;
       N.fl(crud, 'he') / N.fe(crud, 'strX')         ô lọc / ô biểu mẫu của crud
       N.locDaoTao(crud, { he, khoa, ct })            nối tầng trên thanh lọc
       N.phuThuoc(crud, chaKey, conKey, { nap(v) → Promise<dòng>, id, name, head, col })
            → { nap(giaTri) } — gọi trong onForm(row)
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums;
    var pat = ums.pat;
    var N = {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    N.e = e;

    /** Lời gọi danh sách kiểu cũ → Promise<mảng dòng> */
    function rows(call) {
        call.silent = true;
        if (!call.method) call.method = 'GET';
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    }
    N.rows = rows;

    /* ---------- Danh mục (tham số chép nguyên từ các .js gốc) -------------- */
    N.heDaoTao = function () {
        return rows({ action: 'KHCT_HeDaoTao/LayDanhSach', strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '',
            strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    };
    N.khoaDaoTao = function (he) {
        return rows({ action: 'KHCT_KhoaDaoTao/LayDanhSach', strTuKhoa: '', strDaoTao_HeDaoTao_Id: e(he),
            strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    };
    N.chuongTrinh = function (he, khoa) {
        return rows({ action: 'KHCT_ToChucChuongTrinh/LayDanhSach', strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: e(khoa),
            strDaoTao_HeDaoTao_Id: e(he), strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    };
    /** Nguồn ô chọn crud: mọi chương trình (tham số lọc rỗng như gốc) */
    N.srcChuongTrinh = function (name) {
        return { call: { action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: '',
            strDaoTao_HeDaoTao_Id: '', strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, id: 'ID', name: name || 'TENCHUONGTRINH' };
    };
    N.tenCT = function (r) { return e(r.MACHUONGTRINH) + ' - ' + e(r.TENCHUONGTRINH); };

    /** Học phần của một chương trình — hocphantuongduong, quanhehocphan */
    N.hocPhanCT = function (ct) {
        return rows({ action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach', strTuKhoa: '', strDaoTao_ThoiGian_KH_Id: '',
            strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '',
            strDaoTao_HocPhan_Id: '', strDaoTao_ChuongTrinh_Id: e(ct), strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    };
    N.tenHPCT = function (r) { return e(r.DAOTAO_HOCPHAN_MA) + ' - ' + e(r.DAOTAO_HOCPHAN_TEN); };

    /** Mọi học phần (KHCT_HocPhan/LayDanhSach, pageSize 100000000) — baihoc, decuonghoctap */
    N.srcHocPhan = function (name) {
        return { call: { action: 'KHCT_HocPhan/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_MonHoc_Id: '',
            strThuocBoMon_Id: '', strThuocTinhHocPhan_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 },
            id: 'ID', name: name || 'TEN' };
    };

    /** Môn học theo bộ môn (hocphan: getList_MonHoc) */
    N.monHoc = function (boMon) {
        return rows({ action: 'KHCT_MonHoc/LayDanhSach', strTuKhoa: '', strThuocBoMon_Id: e(boMon),
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    };

    /** Bộ môn = edu.system.getList_CoCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }) */
    N.srcBoMon = function () {
        return { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
            dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }, id: 'ID', name: 'TEN' };
    };

    /* ---------- Truy cập ô của ums.crud ------------------------------------ */
    N.fl = function (crud, k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); };
    N.fe = function (crud, k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); };

    function datGT(el, v) {
        if (!el) return;
        el.value = e(v);
        if (el.value !== String(e(v))) el.value = '';
        if (global.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
    }
    N.datGT = datGT;

    /* =====================================================================
       Nối tầng Hệ → Khoá → Chương trình trên thanh lọc (getList_HeDaoTao /
       KhoaDaoTao / ChuongTrinh của gốc). Gốc: chọn Hệ → nạp lại Khoá + CT
       (theo Hệ, Khoá) rồi tải danh sách; chọn Khoá → nạp lại CT. Luật chung:
       chưa chọn cha thì khoá con, chọn / xoá cha thì xoá con.
       o = { he, khoa, ct } — khoá ô lọc của crud; o.nhanCT(dòng) nhãn ô CT.
       ===================================================================== */
    N.locDaoTao = function (crud, o) {
        var F = { he: N.fl(crud, o.he || 'he'), khoa: N.fl(crud, o.khoa || 'khoa'), ct: N.fl(crud, o.ct || 'ct') };
        var nhanCT = o.nhanCT || 'TENCHUONGTRINH';
        function napKhoa() {
            if (!F.khoa) return Promise.resolve();
            if (!F.he.value) { pat.fill(F.khoa, [], { head: 'Chọn khóa đào tạo' }); return Promise.resolve(); }
            return N.khoaDaoTao(F.he.value).then(function (r) { pat.fill(F.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); });
        }
        function napCT() {
            if (!F.ct) return Promise.resolve();
            if (!F.khoa.value) { pat.fill(F.ct, [], { head: 'Chọn chương trình' }); return Promise.resolve(); }
            return N.chuongTrinh(F.he.value, F.khoa.value).then(function (r) { pat.fill(F.ct, r, { name: nhanCT, head: 'Chọn chương trình' }); });
        }
        function loi(err) { ums.api.handle(err, 'nạp danh mục đào tạo'); }
        var ready = N.heDaoTao().then(function (r) { pat.fill(F.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(loi);
        if (global.jQuery) {
            jQuery(F.he).on('select2:select select2:clear', function () {
                napKhoa().then(napCT).catch(loi).then(function () { crud.load(1); });
            });
            jQuery(F.khoa).on('select2:select select2:clear', function () {
                napCT().catch(loi).then(function () { crud.load(1); });
            });
        }
        pat.chain([F.he, F.khoa, F.ct], { phatLai: false });
        return { ready: ready, F: F };
    };

    /* =====================================================================
       Ô chọn PHỤ THUỘC trong biểu mẫu crud (cha → con). Chọn / xoá cha thì
       nạp lại con; chưa chọn cha thì con khoá (pat.chain).
           var hp = N.phuThuoc(crud, 'strCT', 'strHP', { nap: function (ct) → Promise, id, name, head, col });
           onForm(row): hp.nap(row ? row.X : '')   — đặt lại con sau khi nạp
       ===================================================================== */
    N.phuThuoc = function (crud, chaKey, conKey, o) {
        var cha = N.fe(crud, chaKey), con = N.fe(crud, conKey);
        var chain = pat.chain([cha, con], { phatLai: false });
        var luot = 0;
        function nap(giaTri) {
            var my = ++luot;
            if (!cha.value) { pat.fill(con, [], { head: o.head }); datGT(con, ''); chain.sync(); return Promise.resolve(); }
            return o.nap(cha.value).then(function (r) {
                if (my !== luot) return;
                pat.fill(con, r, { id: o.id || 'ID', name: o.name || 'TEN', head: o.head });
                datGT(con, giaTri);
                chain.sync();
            }).catch(function (err) { ums.api.handle(err, 'nạp ' + (o.head || 'danh sách')); });
        }
        if (global.jQuery) jQuery(cha).on('select2:select select2:clear', function () { nap(''); });
        return { nap: nap, sync: chain.sync, el: con };
    };

    ums.khctND = N;
})(window);
