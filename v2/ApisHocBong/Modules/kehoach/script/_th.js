/* =========================================================================
   Học bổng — phần dùng chung của "Tổng hợp" (kehoach/tonghop), "Phân bổ học bổng"
   (thietlap/phanbohocbong) và "Quản lý thông tin" văn bằng (vanbang/quanlythongtin).
   Ba màn gốc chép nhau khối getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao /
   LopQuanLy + cbGenCombo_* (tham số chép nguyên edu.system.getList_* của Corei — vỏ
   indexi), và hai màn đầu cùng nạp quỹ học bổng HB_QuyHocBong/LayDanhSach.
   Nạp từ html của từng màn bằng đường dẫn tương đối tới tệp này.

   ums.hbTh.dt(f, o) → { napHe(), napLop(), gtri() }
       Hệ → Khoá → Chương trình → Lớp (edu.system.getList_*, KHÔNG lọc quyền — gốc
       không dùng genBoLoc_HeKhoa). f = { he, khoa, ct, lop } — các phần tử <select>
       (ô CHỌN NHIỀU cũng được: giá trị gửi đi ghép "a,b" như edu.util.getValCombo).
       Luật cha → con (ums.pat.chain): chưa chọn tầng trên thì KHOÁ tầng dưới; chọn /
       xoá tầng trên thì xoá trắng tầng dưới rồi nạp lại theo gốc:
           Hệ  → nạp Khoá (+ Lớp)      Khoá → nạp CT (+ Lớp)      CT → nạp Lớp
       o.lopBang(rows | null)  — màn vẽ LỚP thành BẢNG (phân bổ học bổng): gọi lại mỗi lần
                                 Hệ / Khoá / CT đổi; null = chưa chọn Hệ (về lời nhắc).
       Không có o.lopBang thì Lớp là ô chọn, chỉ nạp khi chọn CT (ô Lớp khoá tới lúc đó
       nên các lần nạp Lớp theo Hệ / Khoá của gốc là thừa — bỏ).
       o.nhan = { he, khoa, ct } — nhãn đầu ô (mặc định "Tất cả …" như gốc).

   ums.hbTh.quy(el, nhan)   HB_QuyHocBong/LayDanhSach (GET) → ô chọn quỹ (TEN)
   ums.hbTh.chay(viec, n, conHieuLuc)   chạy mảng hàm trả Promise, n luồng cùng lúc;
                                         conHieuLuc() = false thì dừng (tìm lại giữa chừng)
   ums.hbTh.hoTen(r)        QLSV_NGUOIHOC_HODEM + ' ' + QLSV_NGUOIHOC_TEN
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat;
    var K = ums.hbTh = ums.hbTh || {};

    K.e = function (v) { return v === null || v === undefined ? '' : v; };
    K.arr = function (d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); };
    K.uid = function () { return (ums.session && ums.session.userId) || ''; };
    K.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    K.hoTen = function (r) { return (K.e(r.QLSV_NGUOIHOC_HODEM) + ' ' + K.e(r.QLSV_NGUOIHOC_TEN)).trim(); };
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    /* getList_QuyHocBong gốc (tonghop.js, phanbohocbong.js) — strTuKhoa / strNguoiTao_Id đọc ô không có → rỗng */
    K.quy = function (el, nhan) {
        return ums.api.call({ action: 'HB_QuyHocBong/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { var d = K.arr(r.data); pat.fill(el, d, { name: 'TEN', head: nhan || 'Chọn quỹ học bổng' }); return d; })
            .catch(loi('quỹ học bổng'));
    };

    K.chay = function (viec, n, conHieuLuc) {
        var k = 0;
        function mot() {
            if ((conHieuLuc && !conHieuLuc()) || k >= viec.length) return Promise.resolve();
            return viec[k++]().then(mot, mot);
        }
        var p = [];
        for (var i = 0, m = Math.min(n || 10, viec.length); i < m; i++) p.push(mot());
        return Promise.all(p);
    };

    K.dt = function (f, o) {
        o = o || {};
        var nhan = o.nhan || {};
        var P = { pageIndex: 1, pageSize: 1000000 };
        function v(k) { return f[k] ? pat.val(f[k]) : ''; }
        function gop(x) { var r = {}; Object.keys(P).forEach(function (k) { r[k] = P[k]; }); Object.keys(x).forEach(function (k) { r[k] = x[k]; }); return r; }

        function napHe() {
            return ums.ref.heDaoTao(gop({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f.he, d, { name: 'TENHEDAOTAO', head: nhan.he || 'Tất cả hệ đào tạo' }); })
                .catch(loi('hệ đào tạo'));
        }
        function napKhoa() {
            if (!f.khoa) return Promise.resolve();
            return ums.ref.khoaDaoTao(gop({ strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f.khoa, d, { name: 'TENKHOA', head: nhan.khoa || 'Tất cả khóa đào tạo' }); })
                .catch(loi('khóa đào tạo'));
        }
        /* Gốc chỉ truyền strKhoaDaoTao_Id (không truyền Hệ) */
        function napCT() {
            if (!f.ct) return Promise.resolve();
            return ums.ref.chuongTrinh(gop({ strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f.ct, d, { name: 'TENCHUONGTRINH', head: nhan.ct || 'Tất cả chương trình đào tạo' }); })
                .catch(loi('chương trình đào tạo'));
        }
        /* edu.system.getList_LopQuanLy của Corei — có strDaoTao_KhoaQuanLy_Id rỗng (ums.ref.lopQuanLy theo Core thiếu) */
        function layLop() {
            return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', silent: true,
                strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'),
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { return K.arr(r.data); });
        }
        var luotLop = 0;
        function napLop() {
            if (o.lopBang) {
                var sh = ++luotLop;
                if (!v('he')) { o.lopBang(null); return Promise.resolve(); }
                return layLop().then(function (d) { if (sh === luotLop) o.lopBang(d); }).catch(loi('lớp quản lý'));
            }
            if (!f.lop) return Promise.resolve();
            return layLop().then(function (d) { pat.fill(f.lop, d, { name: 'TEN', head: 'Tất cả lớp' }); }).catch(loi('lớp quản lý'));
        }

        /* Luật cha → con gắn TRƯỚC trình nạp để lúc đọc giá trị, các tầng dưới đã xoá trắng */
        pat.chain([f.he, f.khoa, f.ct, o.lopBang ? null : f.lop], { phatLai: false });
        var NAP = {
            he: function () { napKhoa(); if (o.lopBang) napLop(); },
            khoa: function () { napCT(); if (o.lopBang) napLop(); },
            ct: function () { napLop(); }
        };
        ['he', 'khoa', 'ct'].forEach(function (k) {
            if (!f[k]) return;
            jQuery(f[k]).on('select2:select select2:unselect select2:clear', function () { NAP[k](); });
        });
        napHe();
        if (o.lopBang) o.lopBang(null);
        return { napHe: napHe, napLop: napLop, gtri: v };
    };
})();
