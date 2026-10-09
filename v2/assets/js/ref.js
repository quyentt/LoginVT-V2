/* =========================================================================
   ums.ref — danh mục dùng chung của đào tạo
   =========================================================================
   Bản viết lại của các hàm edu.system.getList_* trong Core/systemroot.js.
   Tham số và procedure giữ NGUYÊN bản gốc (số dòng ghi cạnh từng hàm).
   Mọi hàm trả Promise<mảng dòng>, lỗi thì ném ra.

       ums.ref.heDaoTao()                              → TENHEDAOTAO
       ums.ref.khoaDaoTao({ strHeDaoTao_Id })           → TENKHOA, MAKHOA
       ums.ref.chuongTrinh({ strDaoTao_HeDaoTao_Id, strKhoaDaoTao_Id })
                                                       → TENCHUONGTRINH, MACHUONGTRINH
       ums.ref.lopQuanLy({ strDaoTao_HeDaoTao_Id, strKhoaDaoTao_Id, strToChucCT_Id })
                                                       → TEN, MA
       ums.ref.hocPhan({ strChuongTrinh_Id })           → DAOTAO_HOCPHAN_ID, TEN
       ums.ref.thoiGianDaoTao({ strNam_Id })            → DAOTAO_THOIGIANDAOTAO
       ums.ref.khoaQuanLy()
       ums.ref.sinhVien({ strTuKhoa, strHeDaoTao_Id, …, pageIndex, pageSize })
       ums.ref.dm('MA.BANG')                            = ums.api.dm

   Chọn nối tầng Hệ → Khoá → Chương trình → Lớp (dùng ở ~45 màn hình gốc):

       var cas = ums.ref.cascade({
           he:   '#fHe',  khoa: '#fKhoa',  ct: '#fCT',  lop: '#fLop',   // ô nào không có thì bỏ
           onChange: function (v) { … }      // v = { he, khoa, ct, lop }
       });
       cas.values()   → { he, khoa, ct, lop }
       cas.ready      → Promise, xong khi đã nạp danh sách Hệ

   Đổi Hệ thì nạp lại Khoá, Chương trình, Lớp; đổi Khoá thì nạp lại
   Chương trình và Lớp; đổi Chương trình thì nạp lại Lớp. Ô cha để trống
   thì ô con vẫn nạp (theo đúng cách procedure gốc hiểu tham số rỗng = tất cả).
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});
    var ref = {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function z(v) { return v === undefined || v === null || v === '' ? 0 : v; }

    function rows(call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    }

    /* Core/systemroot.js:3714 */
    ref.heDaoTao = function (o) {
        o = o || {};
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4P',
            func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao',
            strDAOTAO_HinhThucDaoTao_Id: e(o.strHinhThucDaoTao_Id),
            strDaoTao_BacDaoTao_Id: e(o.strBacDaoTao_Id),
            strNguoiThucHien_Id: '',
            strTuKhoa: e(o.strTuKhoa),
            pageIndex: z(o.pageIndex),
            pageSize: z(o.pageSize)
        });
    };

    /* Core/systemroot.js:3792 */
    ref.khoaDaoTao = function (o) {
        o = o || {};
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLgPP',
            func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao',
            strDAOTAO_HeDaoTao_Id: e(o.strHeDaoTao_Id),
            strDaoTao_CoSoDaoTao_Id: e(o.strCoSoDaoTao_Id),
            strNguoiThucHien_Id: '',
            strTuKhoa: e(o.strTuKhoa),
            pageIndex: z(o.pageIndex),
            pageSize: z(o.pageSize)
        });
    };

    /* Core/systemroot.js:3868 */
    ref.chuongTrinh = function (o) {
        o = o || {};
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUP',
            func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT',
            strDaoTao_HeDaoTao_Id: e(o.strDaoTao_HeDaoTao_Id),
            strDaoTao_KhoaDaoTao_Id: e(o.strKhoaDaoTao_Id),
            strDaoTao_N_CN_Id: e(o.strN_CN_LOP_Id),
            strDaoTao_KhoaQuanLy_Id: e(o.strKhoaQuanLy_Id),
            strDaoTao_ToChucCT_Cha_Id: e(o.strToChucCT_Cha_Id),
            strNguoiThucHien_Id: e(o.strNguoiThucHien_Id),
            strTuKhoa: e(o.strTuKhoa),
            pageIndex: z(o.pageIndex),
            pageSize: z(o.pageSize)
        });
    };

    /* Core/systemroot.js:4035 */
    ref.lopQuanLy = function (o) {
        o = o || {};
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
            func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
            strDaoTao_CoSoDaoTao_Id: e(o.strCoSoDaoTao_Id),
            strDaoTao_HeDaoTao_Id: e(o.strDaoTao_HeDaoTao_Id),
            strDaoTao_KhoaDaoTao_Id: e(o.strKhoaDaoTao_Id),
            strDaoTao_Nganh_Id: e(o.strNganh_Id),
            strDaoTao_LoaiLop_Id: e(o.strLoaiLop_Id),
            strDaoTao_ToChucCT_Id: e(o.strToChucCT_Id),
            strNguoiThucHien_Id: e(o.strNguoiThucHien_Id),
            strTuKhoa: e(o.strTuKhoa),
            pageIndex: z(o.pageIndex),
            pageSize: z(o.pageSize)
        });
    };

    /* Core/systemroot.js:4332 */
    ref.hocPhan = function (o) {
        o = o || {};
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4JLiIRKSAvHgIpNC4vJhUzKC8p',
            func: 'pkg_kehoach_thongtin.LayDSKS_HocPhan_ChuongTrinh',
            strDaoTao_ChuongTrinh_Id: e(o.strChuongTrinh_Id),
            strNguoiThucHien_Id: e(o.strNguoiThucHien_Id),
            strTuKhoa: e(o.strTuKhoa),
            pageIndex: z(o.pageIndex),
            pageSize: z(o.pageSize)
        });
    };

    /* Core/systemroot.js:3638 */
    ref.thoiGianDaoTao = function (o) {
        o = o || {};
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P',
            func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
            strDAOTAO_Nam_Id: e(o.strNam_Id),
            strNguoiThucHien_Id: e(o.strNguoiThucHien_Id),
            strTuKhoa: e(o.strTuKhoa),
            pageIndex: z(o.pageIndex),
            pageSize: z(o.pageSize)
        });
    };

    /* Core/systemroot.js:4186 */
    ref.khoaQuanLy = function () {
        return rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04',
            func: 'pkg_kehoach_thongtin.LayDSKhoaQuanLy',
            strNguoiThucHien_Id: ''
        });
    };

    /* =====================================================================
       Nhân sự — dùng chung cho Cổng cán bộ / Nhân sự
       ===================================================================== */

    /* edu.system.getList_CoCauToChuc (Corei/systemroot.js:4455). Bản gốc hay
       tách kết quả thành cha (không có DAOTAO_COCAUTOCHUC_CHA_ID) và con. */
    ref.coCauToChuc = function (o) {
        o = o || {};
        return rows({
            action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P',
            func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
            dTrangThai: o.iTrangThai !== undefined ? o.iTrangThai : 1,
            strLoaiCoCauToChuc_Id: e(o.strCCTC_Loai_Id),
            strCoCauToChucCha_Id: e(o.strCCTC_Cha_Id)
        });
    };

    /* edu.system.getList_NhanSu (Core/systemroot.js:4690) — danh sách hồ sơ
       nhân sự. Tham số chép nguyên; strChucVu_Id bản gốc đọc ô dropAAAA không
       có → rỗng. Nhãn hay dùng: HODEM TEN - MASO - DAOTAO_COCAUTOCHUC_TEN. */
    function callNhanSu(o) {
        o = o || {};
        return {
            action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP',
            func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
            strTuKhoa: e(o.strTuKhoa),
            strDaoTao_CoCauToChuc_Id: e(o.strCoCauToChuc_Id),
            dLaCanBoNgoaiTruong: o.dLaCanBoNgoaiTruong !== undefined ? o.dLaCanBoNgoaiTruong : '',
            strTinhTrangNhanSu_Id: e(o.strTinhTrangNhanSu_Id),
            strChucVu_Id: '',
            strNguoiThucHien_Id: (ums.session && ums.session.userId) || '',
            pageIndex: o.pageIndex || 1,
            pageSize: o.pageSize || 1000000
        };
    }
    ref.nhanSu = function (o) { return rows(callNhanSu(o)); };
    /** Bản có phân trang — hộp chọn nhân sự (ums.pat.pickNhanSu) → { rows, total } */
    ref.nhanSuPage = function (o) {
        var c = callNhanSu(o); c.silent = true;
        return ums.api.call(c).then(function (r) {
            var d = r.data, rs = Array.isArray(d) ? d : (d && d.rs) || [];
            return { rows: rs, total: Number(r.pager) || rs.length };
        });
    };
    ref.tenNhanSu = function (r) {
        return e(r.HODEM) + ' ' + e(r.TEN) + ' - ' + e(r.MASO) + ' - ' + e(r.DAOTAO_COCAUTOCHUC_TEN);
    };

    /* edu.extend.ThietLapQuaTrinhCuoiCung (Corei/systemextend.js:2653) — gọi
       sau khi THÊM MỚI một dòng quá trình (chức vụ, công tác…) để máy chủ
       đánh dấu dòng mới nhất. strMaBang: 'NHANSU_QT_CHUVU'… chép nguyên từ .js gốc.
       Bản gốc không báo gì khi xong, lỗi mới alert — ở đây im lặng như vậy. */
    /* XOÁ QUYẾT ĐỊNH SINH KÈM (người dùng quyết 2026-09-30). Thêm kỷ luật / khen thưởng / danh hiệu / học hàm có số quyết định thì máy chủ tự
       sinh một quyết định (NS_ThongTinQuyetDinh, NGUONDULIEU_ID = id dòng); xoá dòng thì quyết định ở lại, mồ côi. Màn gọi hàm này SAU khi xoá
       dòng thành công. CHỈ xoá quyết định có NGUONDULIEU_ID ĐÚNG BẰNG id vừa xoá (phòng khi máy chủ bỏ qua tham số lọc mà trả mọi quyết định).
       Lỗi khi dọn không chặn màn — dòng chính đã xoá xong.
       Kiểm host 2026-09-30: kỷ luật / khen thưởng / danh hiệu máy chủ nay tự xoá quyết định kèm; HỌC HÀM thì không — hàm này dọn. Quyết định
       sinh kèm khen thưởng mang TRANGTHAI = 0 nên tìm ở CẢ HAI trạng thái (danh sách chỉ trả một trạng thái mỗi lần gọi). */
    ref.xoaQuyetDinhKem = function (ids) {
        return (ids || []).reduce(function (p, id) {
            return p.then(function () {
                if (!id) return;
                return [1, 0].reduce(function (pt, tt) {
                    return pt.then(function () {
                        return ums.api.call({ action: 'NS_ThongTinQuyetDinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguonDuLieu_Id: id, iTrangThai: tt,
                            strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '', strLoaiQuyetDinh_Id: '', strThanhVien_Id: '', pageIndex: 1, pageSize: 1000, silent: true })
                            .then(function (r) {
                                var ds = (Array.isArray(r.data) ? r.data : []).filter(function (q) { return q.ID && q.NGUONDULIEU_ID === id; });
                                return ds.reduce(function (p2, q) {
                                    return p2.then(function () {
                                        return ums.api.call({ action: 'NS_ThongTinQuyetDinh/Xoa', strId: q.ID, strNguoiThucHien_Id: ums.session.userId, silent: true })
                                            .catch(function () {});
                                    });
                                }, Promise.resolve());
                            }).catch(function () {});
                    });
                }, Promise.resolve());
            });
        }, Promise.resolve());
    };

    ref.quaTrinhCuoiCung = function (strMaBang) {
        return ums.api.call({
            action: 'NS_QuaTrinh_MH/FSkoJDUNIDEQNCAVMygvKQI0LigCNC8m',
            func: 'pkg_nhansu_quatrinh.ThietLapQuaTrinhCuoiCung',
            strNguoiThucHien_Id: '',
            strMaQuaTrinhThongTin: strMaBang,
            silent: true
        }).catch(function (err) { ums.api.handle(err, 'thiết lập quá trình cuối cùng'); });
    };

    /* Core/systemroot.js:4783 — bản gốc lấy phân trang mặc định của hệ */
    ref.sinhVien = function (o) {
        o = o || {};
        return rows({
            action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu',
            func: 'pkg_hosohocvien.LayDanhSachHoSo',
            strTuKhoa: e(o.strTuKhoa),
            strHeDaoTao_Id: e(o.strHeDaoTao_Id),
            strKhoaDaoTao_Id: e(o.strKhoaDaoTao_Id),
            strChuongTrinh_Id: e(o.strChuongTrinh_Id),
            strLopQuanLy_Id: e(o.strLopQuanLy_Id),
            strQLSV_TrangThaiNguoiHoc_Id: '',
            dLocTheoDuLieuImport: -1,
            strTuNgay: '',
            strDenNgay: '',
            pageIndex: o.pageIndex || 1,
            pageSize: o.pageSize || 10
        });
    };

    /** Như ref.sinhVien nhưng trả kèm tổng số dòng — cần cho hộp chọn có phân trang */
    ref.sinhVienPage = function (o) {
        o = o || {};
        return ums.api.call({
            action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu',
            func: 'pkg_hosohocvien.LayDanhSachHoSo',
            silent: true,
            strTuKhoa: e(o.strTuKhoa),
            strHeDaoTao_Id: e(o.strHeDaoTao_Id),
            strKhoaDaoTao_Id: e(o.strKhoaDaoTao_Id),
            strChuongTrinh_Id: e(o.strChuongTrinh_Id),
            strLopQuanLy_Id: e(o.strLopQuanLy_Id),
            strQLSV_TrangThaiNguoiHoc_Id: e(o.strQLSV_TrangThaiNguoiHoc_Id),
            dLocTheoDuLieuImport: o.dLocTheoDuLieuImport === undefined ? -1 : o.dLocTheoDuLieuImport,
            strTuNgay: e(o.strTuNgay),
            strDenNgay: e(o.strDenNgay),
            pageIndex: o.pageIndex || 1,
            pageSize: o.pageSize || 10
        }).then(function (r) {
            var d = r.data;
            var rows = Array.isArray(d) ? d : (d && d.rs) || [];
            return { rows: rows, total: Number(r.pager) || rows.length };
        });
    };

    ref.dm = function (code, sortBy) { return ums.api.dm(code, sortBy); };

    /* =====================================================================
       Chọn nối tầng
       ===================================================================== */
    function node(x) { return typeof x === 'string' ? document.querySelector(x) : x; }

    function fill(el, list, id, name, head) {
        if (!el) return;
        var keep = el.value;
        var h = '<option value="">' + ums.ui.esc(head) + '</option>';
        list.forEach(function (r) {
            var t = typeof name === 'function' ? name(r) : r[name];
            h += '<option value="' + ums.ui.esc(r[id]) + '">' + ums.ui.esc(t) + '</option>';
        });
        el.innerHTML = h;
        if (keep && list.some(function (r) { return String(r[id]) === keep; })) el.value = keep;
        if (global.jQuery) jQuery(el).trigger('change.select2');
    }

    ref.cascade = function (o) {
        var el = { he: node(o.he), khoa: node(o.khoa), ct: node(o.ct), lop: node(o.lop) };
        var label = o.labels || {};
        var head = {
            he: label.he || 'Chọn hệ đào tạo',
            khoa: label.khoa || 'Chọn khoá đào tạo',
            ct: label.ct || 'Chọn chương trình',
            lop: label.lop || 'Chọn lớp'
        };
        var busy = false;

        function values() {
            return {
                he: el.he ? el.he.value : '',
                khoa: el.khoa ? el.khoa.value : '',
                ct: el.ct ? el.ct.value : '',
                lop: el.lop ? el.lop.value : ''
            };
        }

        function loadKhoa() {
            if (!el.khoa) return Promise.resolve();
            return ref.khoaDaoTao({ strHeDaoTao_Id: values().he, pageSize: 1000000, pageIndex: 1 })
                .then(function (r) { fill(el.khoa, r, 'ID', function (x) { return x.TENKHOA || x.MAKHOA || x.TEN; }, head.khoa); });
        }
        function loadCT() {
            if (!el.ct) return Promise.resolve();
            var v = values();
            return ref.chuongTrinh({ strDaoTao_HeDaoTao_Id: v.he, strKhoaDaoTao_Id: v.khoa, pageSize: 1000000, pageIndex: 1 })
                .then(function (r) { fill(el.ct, r, 'ID', function (x) { return x.TENCHUONGTRINH || x.MACHUONGTRINH || x.TEN; }, head.ct); });
        }
        function loadLop() {
            if (!el.lop) return Promise.resolve();
            var v = values();
            return ref.lopQuanLy({ strDaoTao_HeDaoTao_Id: v.he, strKhoaDaoTao_Id: v.khoa, strToChucCT_Id: v.ct, pageSize: 1000000, pageIndex: 1 })
                .then(function (r) { fill(el.lop, r, 'ID', function (x) { return x.TEN || x.MA; }, head.lop); });
        }

        /* Đổi (hoặc XOÁ) tầng trên thì xoá trắng giá trị các tầng dưới trước
           khi nạp lại — fill() giữ giá trị cũ nếu nó còn trong danh sách mới,
           mà bỏ Hệ thì danh sách Khoá là TẤT CẢ khoá → khoá cũ vẫn nằm đó. */
        var DUOI = { he: ['khoa', 'ct', 'lop'], khoa: ['ct', 'lop'], ct: ['lop'] };
        function xoaDuoi(level) {
            (DUOI[level] || []).forEach(function (k) {
                if (!el[k]) return;
                el[k].value = '';
                if (global.jQuery) jQuery(el[k]).trigger('change.select2');
            });
        }
        function changed(level) {
            if (busy) return;
            busy = true;
            xoaDuoi(level);
            var chain = Promise.resolve();
            if (level === 'he') chain = chain.then(loadKhoa).then(loadCT).then(loadLop);
            else if (level === 'khoa') chain = chain.then(loadCT).then(loadLop);
            else if (level === 'ct') chain = chain.then(loadLop);
            chain.catch(function (err) { ums.api.handle(err, 'nạp danh mục đào tạo'); })
                .then(function () {
                    busy = false;
                    if (o.onChange) o.onChange(values(), level);
                });
        }

        ['he', 'khoa', 'ct', 'lop'].forEach(function (k) {
            if (!el[k]) return;
            if (!el[k].options.length) el[k].innerHTML = '<option value="">' + ums.ui.esc(head[k]) + '</option>';
            if (global.jQuery) jQuery(el[k]).on('change', function () { changed(k); });
            else el[k].addEventListener('change', function () { changed(k); });
        });
        // Chưa chọn tầng trên thì khoá tầng dưới (ums.pat.chain)
        ums.pat.chain([el.he, el.khoa, el.ct, el.lop], { phatLai: false });

        var ready = (el.he
            ? ref.heDaoTao({ pageIndex: 1, pageSize: 1000000 }).then(function (r) {
                fill(el.he, r, 'ID', function (x) { return x.TENHEDAOTAO || x.MAHEDAOTAO || x.TEN; }, head.he);
            })
            : Promise.resolve())
            .then(function () { busy = true; return loadKhoa().then(loadCT).then(loadLop); })
            .catch(function (err) { ums.api.handle(err, 'nạp danh mục đào tạo'); })
            .then(function () { busy = false; });

        return { values: values, ready: ready, reload: function () { changed('he'); } };
    };

    /* =====================================================================
       Chọn nối tầng THEO QUYỀN — Khoa quản lý → Hệ → Khoá → Chương trình → Lớp
       ---------------------------------------------------------------------
       Bản viết lại của `edu.extend.genBoLoc_HeKhoa` (Core/systemextend.js:6713).
       Khác `ref.cascade` ở chỗ gọi các procedure `…Quyen`, tức CHỈ trả dữ
       liệu người dùng được phép thấy. Màn hình nào ở hệ cũ dựng bộ lọc bằng
       genBoLoc_HeKhoa thì PHẢI dùng hàm này; dùng nhầm `ref.cascade` là cho
       người dùng thấy dữ liệu ngoài phạm vi.

           var cas = ums.ref.cascadeQuyen({ kql: el, he: el, khoa: el, ct: el, lop: el,
                                            onChange: function () { … } });
           cas.ready · cas.values() · cas.set({ he, khoa, ct, lop })
       ===================================================================== */
    var heQuyenCache = null;
    ref.cascadeQuyen = function (o) {
        var el = { he: node(o.he), khoa: node(o.khoa), ct: node(o.ct), lop: node(o.lop), kql: node(o.kql) };
        function v(k) { return el[k] ? el[k].value : ''; }
        var busy = 0;

        function heQuyen() {
            if (!heQuyenCache) {
                heQuyenCache = rows({
                    action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4QNDgkLwPP',
                    func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen',
                    strTuKhoa: '',
                    strDaoTao_KhoaQuanLy_Id: '',      // bản gốc đọc 'dropKhoaQuanLy11111' — ô không tồn tại
                    strDaoTao_HinhThucDaoTao_Id: '',
                    strDaoTao_BacDaoTao_Id: '',
                    strNguoiThucHien_Id: '',
                    strChucNang_Id: '',
                    pageIndex: 1, pageSize: 1000000
                }).catch(function (err) { heQuyenCache = null; throw err; });
            }
            return heQuyenCache;
        }
        function khoa() {
            if (!el.khoa) return Promise.resolve();
            return rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLhA0OCQv',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_HeDaoTao_Id: v('he'),
                strDaoTao_CoSoDaoTao_Id: '', strNguoiTao_Id: '', strNguoiThucHien_Id: '', strChucNang_Id: '',
                pageIndex: 1, pageSize: 1000000
            }).then(function (r) { ums.pat.fill(el.khoa, r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); });
        }
        function ct() {
            if (!el.ct) return Promise.resolve();
            return rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUQNDgkLwPP',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen',
                strTuKhoa: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_ToChucCT_Cha_Id: '',
                strNguoiThucHien_Id: '', strChucNang_Id: '',
                pageIndex: 1, pageSize: 1000000
            }).then(function (r) { ums.pat.fill(el.ct, r, { name: 'TENCHUONGTRINH', head: 'Chọn chương trình đào tạo' }); });
        }
        function lop() {
            if (!el.lop) return Promise.resolve();
            return rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
                strTuKhoa: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '',
                strDaoTao_ToChucCT_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql'), strNhomlop_Id: '',
                strNguoiThucHien_Id: '', strChucNang_Id: '',
                pageIndex: 1, pageSize: 1000000
            }).then(function (r) { ums.pat.fill(el.lop, r, { name: 'TEN', head: 'Chọn lớp' }); });
        }
        function kql() {
            if (!el.kql) return Promise.resolve();
            return rows({
                action: 'KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04ESkgLxA0OCQv',
                func: 'pkg_kehoach_thongtin.LayDSKhoaQuanLyPhanQuyen',
                strNguoiThucHien_Id: ''
            }).then(function (r) { ums.pat.fill(el.kql, r, { name: 'TEN', head: 'Chọn khoa quản lý' }); });
        }

        function run(p) {
            busy++;
            return p.catch(function (err) { ums.api.handle(err, 'nạp danh mục đào tạo'); })
                .then(function () { busy--; if (o.onChange && !busy) o.onChange(); });
        }
        /* Đổi (hoặc XOÁ) tầng trên thì xoá trắng giá trị các tầng dưới trước
           khi nạp lại — fill() giữ giá trị cũ nếu nó còn trong danh sách mới,
           mà bỏ Hệ thì danh sách Khoá là TẤT CẢ khoá → khoá cũ vẫn nằm đó. */
        var DUOI = { kql: ['khoa', 'ct', 'lop'], he: ['khoa', 'ct', 'lop'], khoa: ['ct', 'lop'], ct: ['lop'] };
        function xoaDuoi(level) {
            (DUOI[level] || []).forEach(function (k) {
                if (!el[k]) return;
                el[k].value = '';
                if (global.jQuery) jQuery(el[k]).trigger('change.select2');
            });
        }
        function chain(level) {
            xoaDuoi(level);
            if (level === 'he' || level === 'kql') return khoa().then(ct).then(lop);
            if (level === 'khoa') return ct().then(lop);
            if (level === 'ct') return lop();
            return Promise.resolve();
        }

        ['kql', 'he', 'khoa', 'ct'].forEach(function (k) {
            if (!el[k]) return;
            // select2:select / clear — KHÔNG nghe 'change' vì đổ lại danh sách cũng bắn change
            if (global.jQuery) jQuery(el[k]).on('select2:select select2:clear', function () { if (!busy) run(chain(k)); });
            else el[k].addEventListener('change', function () { if (!busy) run(chain(k)); });
        });
        // Chưa chọn tầng trên thì khoá tầng dưới (ums.pat.chain)
        ums.pat.chain([el.he, el.khoa, el.ct, el.lop], { phatLai: false });

        var ready = run(Promise.all([
            el.he ? heQuyen().then(function (r) { ums.pat.fill(el.he, r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }) : null,
            kql()
        ]));

        /** Đặt giá trị lần lượt từng tầng (nạp tầng con trước khi đặt) */
        function set(vals) {
            busy++;
            return ready.then(function () {
                if (el.he) { el.he.value = vals.he || ''; if (global.jQuery) jQuery(el.he).trigger('change.select2'); }
                return khoa();
            }).then(function () {
                if (el.khoa) { el.khoa.value = vals.khoa || ''; if (global.jQuery) jQuery(el.khoa).trigger('change.select2'); }
                return ct();
            }).then(function () {
                if (el.ct) { el.ct.value = vals.ct || ''; if (global.jQuery) jQuery(el.ct).trigger('change.select2'); }
                return lop();
            }).then(function () {
                if (el.lop) { el.lop.value = vals.lop || ''; if (global.jQuery) jQuery(el.lop).trigger('change.select2'); }
            }).catch(function (err) { ums.api.handle(err, 'nạp danh mục đào tạo'); })
              .then(function () { busy--; });
        }

        return {
            ready: ready,
            values: function () { return { he: v('he'), khoa: v('khoa'), ct: v('ct'), lop: v('lop'), kql: v('kql') }; },
            set: set
        };
    };

    ums.ref = ref;

})(window);
