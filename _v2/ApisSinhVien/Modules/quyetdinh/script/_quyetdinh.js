/* =========================================================================
   Quyết định người học — phần dùng chung của hai màn (ums.svqd)
   Bản gốc: ApisSinhVien/Modules/quyetdinh/script/quyetdinh.js + thucthiquyetdinh.js
            (hai tệp chép nhau phần thanh lọc, bảng quyết định, bảng sinh viên, hộp chọn lớp)
   ---------------------------------------------------------------------------
   Q.boLoc(host, { ngay, sau }) → L (ums.pat.boLocNguoiHoc) + L.lqd / L.q / L.tu / L.den
       Thanh lọc _QD của html gốc: Hệ → Khoá → CT → Lớp (chọn nhiều, edu.system.getList_* KHÔNG lọc quyền),
       Năm nhập học, Khoa QL, Học kỳ (chọn nhiều), Loại quyết định (chọn nhiều — SV_QuyetDinh_ThucThi/
       LayDSLoaiQuyetDinh), [Ngày bắt đầu / kết thúc QĐ], từ khoá, Tìm kiếm (data-a="tim") + HTML `sau`,
       khối "Chọn trạng thái sinh viên" (QLSV.TRANGTHAI — gốc HIỆN nhưng KHÔNG gửi: strTrangThaiNguoiHoc_Id "").
       Khung lọc: tầng chung ums.pat.boLocNguoiHoc (gốc từ Xử lý học vụ) — cùng họ ô lọc.
   Q.thamSo(L) → tham số lọc chung của danh sách quyết định (tên chép nguyên hai bản gốc).
   Q.loaiQD()  → Promise<dòng> SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh (GET, type GET, strNguoiDung_Id) — một lần.
   Q.hocKy()   → Promise<dòng> edu.system.getList_ThoiGianDaoTao (pageSize 100000) — một lần.
   Q.trangThai() → Promise<dòng> QLSV.TRANGTHAI — một lần.
   Q.cotQD(o)  → cột "Loại … File" của bảng quyết định (o.soSV(r) vẽ ô Số sinh viên).
   Q.tepDong(host, rows) → ô File của từng dòng (viewFiles gốc: SV_Files/LayDanhSach theo ID quyết định).
   Q.noiTang(el, o) — Hệ → Khoá → CT → Lớp MỘT giá trị trong hộp / khối chuyển lớp; o.nap = { khoa, ct, lop }
       (hàm tự gọi ums.ref.* với ĐÚNG tham số bản gốc từng chỗ), luật cha → con bằng ums.pat.chain.
   Q.cotSV(o)  → các cột sinh viên dùng chung (Hình ảnh · Mã số · Họ tên · Lớp · Nhóm lớp · Chương trình · Khóa).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.svqd = ums.svqd || {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    Q.e = e;
    Q.arr = arr;
    Q.uid = function () { return (ums.session && ums.session.userId) || ''; };
    Q.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    Q.qa = function (el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); };
    Q.hoTen = function (r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(); };
    Q.tim = function (rows, id) { return arr(rows).filter(function (x) { return String(x.ID) === String(id); })[0] || null; };

    /* ---------- Danh mục dùng một lần --------------------------------------- */
    var pLoai = null, pHk = null, pTt = null;
    Q.loaiQD = function () {
        if (!pLoai) pLoai = ums.api.call({ action: 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh', method: 'GET', type: 'GET', silent: true, strNguoiDung_Id: Q.uid() })
            .then(function (r) { return arr(r.data); }, function (err) { pLoai = null; ums.api.handle(err, 'loại quyết định'); return []; });
        return pLoai;
    };
    Q.hocKy = function () {
        if (!pHk) pHk = ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .catch(function (err) { pHk = null; ums.api.handle(err, 'học kỳ'); return []; });
        return pHk;
    };
    Q.trangThai = function () {
        if (!pTt) pTt = ums.api.dm('QLSV.TRANGTHAI').catch(function (err) { pTt = null; ums.api.handle(err, 'trạng thái người học'); return []; });
        return pTt;
    };

    /* ---------- Thanh lọc ------------------------------------------------------ */
    Q.boLoc = function (host, o) {
        o = o || {};
        var L = ums.pat.boLocNguoiHoc(host, { hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql', 'hk']] });
        var hang = host.querySelectorAll('.ums-filter');
        hang[1].insertAdjacentHTML('beforeend', '<div class="ums-field"><select class="ums-select" data-f="lqd" data-ph="Chọn loại quyết định" multiple></select></div>');
        function ngay(k, ph) {
            return '<div class="ums-field"><div class="ums-inputwrap"><input class="ums-input" data-f="' + k + '" data-date placeholder="' + esc(ph) +
                '" autocomplete="off"><i class="fa-light fa-calendar"></i></div></div>';
        }
        hang[1].insertAdjacentHTML('afterend', '<div class="ums-filter ums-u-mt-3">' +
            (o.ngay ? ngay('tu', 'Ngày bắt đầu QĐ') + ngay('den', 'Ngày kết thúc QĐ') : '') +
            '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' + (o.sau || '') + '</div>');
        ui.enhance(host);
        Q.loaiQD().then(function (d) { pat.fill(L.f('lqd'), d, { name: 'TEN' }); });
        function gt(k) { var el = L.f(k); return el ? (el.value || '').trim() : ''; }
        L.gt = gt;
        return L;
    };
    Q.thamSo = function (L) {
        return {
            strTuKhoa: L.gt('q'),
            strChucNang_Id: Q.cn(),
            strKhoaQuanLy_Id: L.v('kql'),
            strHeDaoTao_Id: L.v('he'),
            strKhoaDaoTao_Id: L.v('khoa'),
            strChuongTrinh_Id: L.v('ct'),
            strLopQuanLy_Id: L.v('lop'),
            strNamNhapHoc: L.v('nam'),
            strTrangThaiNguoiHoc_Id: '',
            strQLSV_NguoiHoc_Id: '',
            strLoaiQuyetDinh_Id: L.v('lqd'),
            strCapQuyetDinh_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: L.v('hk'),
            strNguoiTao_Id: ''
        };
    };

    /* ---------- Bảng quyết định ------------------------------------------------ */
    Q.cotQD = function (o) {
        o = o || {};
        return [
            { title: 'Loại quyết định', prop: 'LOAIQUYETDINH_TEN' },
            { title: 'Số quyết định', prop: 'SOQUYETDINH', cls: 'is-center is-nowrap' },
            { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUC', cls: 'is-center is-nowrap' },
            { title: 'Cấp quyết định', prop: 'CAPQUYETDINH_TEN', cls: o.capGiua ? 'is-center' : '' },
            { title: 'Nội dung', prop: 'NGUYENNHAN_LYDO' },
            { title: 'Số sinh viên', cls: 'is-center is-nowrap', sum: o.tongSV ? function (rows) {
                return '<b>' + rows.reduce(function (t, r) { var n = Number(r.SOLUONG); return t + (isNaN(n) ? 0 : n); }, 0) + '</b>';
            } : undefined, render: o.soSV || function (r) { return esc(e(r.SOLUONG)); } },
            { title: 'File', cls: 'is-center', render: function (r) { return '<div class="svqd-tep" data-tep="' + esc(r.ID) + '"></div>'; } }
        ];
    };
    Q.tepDong = function (host, rows) {
        arr(rows).forEach(function (r) {
            ums.api.call({ action: 'SV_Files/LayDanhSach', method: 'GET', silent: true, strDuLieu_Id: r.ID }).then(function (res) {
                var o = host.querySelector('[data-tep="' + (window.CSS && CSS.escape ? CSS.escape(String(r.ID)) : r.ID) + '"]');
                if (!o) return;
                o.innerHTML = arr(res.data).filter(function (x) { return x.FILEMINHCHUNG; }).map(function (x) {
                    var ten = e(x.TENHIENTHI) || String(x.FILEMINHCHUNG).split('/').pop();
                    return '<a href="' + esc(ums.files.url(x.FILEMINHCHUNG)) + '" target="_blank" rel="noopener" title="' + esc(ten) + '">' +
                        '<i class="fa-light fa-paperclip"></i> ' + esc(ten) + '</a>';
                }).join('<br>');
            }).catch(function () { /* thiếu tệp thì để trống như viewFiles gốc */ });
        });
    };

    /* ---------- Cột sinh viên --------------------------------------------------- */
    Q.cotSV = function () {
        return [
            { title: 'Hình ảnh', cls: 'is-center', width: '76px', render: function (x) { return pat.anhNguoi((x.r || x).ANH); } },
            { title: 'Mã số', cls: 'is-nowrap', render: function (x) { return esc(e((x.r || x).QLSV_NGUOIHOC_MASO)); } },
            { title: 'Họ tên', render: function (x) { return esc(Q.hoTen(x.r || x)); } },
            { title: 'Lớp', render: function (x) { return esc(e((x.r || x).DAOTAO_LOPQUANLY_TEN)); } },
            { title: 'Nhóm lớp', render: function (x) { return esc(e((x.r || x).NHOMLOP_TEN)); } },
            // dòng đã lưu: DAOTAO_TOCHUCCHUONGTRINH_TEN · dòng mới từ hộp chọn: DAOTAO_CHUONGTRINH_TEN (như gốc)
            { title: 'Chương trình', render: function (x) { return esc(x.r ? e(x.r.DAOTAO_TOCHUCCHUONGTRINH_TEN) : e((x.m || x).DAOTAO_CHUONGTRINH_TEN || (x.m || x).DAOTAO_TOCHUCCHUONGTRINH_TEN)); } },
            { title: 'Khóa', render: function (x) { return esc(e((x.r || x).DAOTAO_KHOADAOTAO_TEN)); } }
        ];
    };

    /* ---------- Hệ → Khoá → CT → Lớp một giá trị (hộp / khối chuyển lớp) ------------
       el = { he, khoa, ct, lop }; o.nap = { khoa(v), ct(v), lop(v, tầngVừaChọn) } → Promise<dòng>
       v = { he, khoa, ct } giá trị hiện tại. Nạp Hệ lúc gọi; chọn tầng nào thì nạp tầng ngay dưới
       (và Lớp nếu o.nap.lopTheo chứa tầng đó). */
    Q.noiTang = function (el, o) {
        function v() { return { he: el.he.value, khoa: el.khoa.value, ct: el.ct.value }; }
        function loi(t) { return function (err) { ums.api.handle(err, t); }; }
        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { pat.fill(el.he, d, { name: 'TENHEDAOTAO', head: o.nhan.he }); }).catch(loi('hệ đào tạo'));
        pat.chain([el.he, el.khoa, el.ct, el.lop], { phatLai: false });
        var lopTheo = o.lopTheo || ['ct'];
        function napLop(tang) {
            return o.nap.lop(v(), tang).then(function (d) { pat.fill(el.lop, d, { name: 'TEN', head: o.nhan.lop }); }).catch(loi('lớp quản lý'));
        }
        jQuery(el.he).on('select2:select', function () {
            o.nap.khoa(v()).then(function (d) { pat.fill(el.khoa, d, { name: 'TENKHOA', head: o.nhan.khoa }); }).catch(loi('khóa đào tạo'));
            if (lopTheo.indexOf('he') >= 0) napLop('he');
        });
        jQuery(el.khoa).on('select2:select', function () {
            o.nap.ct(v()).then(function (d) { pat.fill(el.ct, d, { name: 'TENCHUONGTRINH', head: o.nhan.ct }); }).catch(loi('chương trình đào tạo'));
            if (lopTheo.indexOf('khoa') >= 0) napLop('khoa');
        });
        jQuery(el.ct).on('select2:select', function () { if (lopTheo.indexOf('ct') >= 0) napLop('ct'); });
    };

    /* ---------- Ô chọn một giá trị trong hộp thoại ------------------------------- */
    Q.sel = function (k, ph, multi) {
        return '<select class="ums-select" data-x="' + k + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') + '>' + (multi ? '' : '<option value=""></option>') + '</select>';
    };
})();
