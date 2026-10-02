/* =========================================================================
   Lớp học phần — THANH LỌC (phần của màn lophocphan, tách riêng cho gọn)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/lophocphan.html (khối
   #zonebatdau .inputSearch) + script/lophocphan.js (init, getList_*, cbGenCombo_*)
   ---------------------------------------------------------------------------
   ums.lhp.boLoc(host, { onXem(kieu), onLoaiLop(), onLocCT() })
       → { f(k), v(k), tt, loaiLop(), chuaNop(), daChuyenKT(), chung(), bc }

   Lời gọi (chép nguyên bản gốc):
       DKH_Chung/LayThoiGianDangKyHoc               GET  — Thời gian (chọn nhiều)
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao    = edu.system.getList_HeDaoTao (KHÔNG lọc quyền, như gốc)
       DKH_PhanCong_LopHP/LayDSKhoaToChuc           GET  — Khoá (theo Hệ, Thời gian)
       DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc    GET  — CT (theo Thời gian, Khoá, Hệ, Khoa QL)
       pkg_kehoach_thongtin.LayDSKhoaQuanLy         = edu.system.getList_KhoaQuanLy
       DKH_PhanCong_LopHP/LayDSHocPhan              GET  — Học phần (theo Thời gian, Khoá, Hệ, CT, Khoa QL)
       DKH_ThongTin/LayDSDangKy_KeHoachDangKy       GET  — Kế hoạch (theo Thời gian; strTuKhoa = txtAAAA → '')
       pkg_dangkyhoc_chung.LayDSHinhThucHoc         — Hình thức học (chọn nhiều)
       Danh mục: KHDT.DIEM.KIEUHOC (Kiểu học), DANGKY.XACNHAN.KETQUA (Hành động),
                 QLSV.TRANGTHAI (khối "Chọn trạng thái sinh viên", đánh dấu sẵn hết)

   Ô chọn CHA → CON:
     · Thời gian → Kế hoạch: một cha, danh sách chỉ nạp khi chọn Thời gian → KHOÁ
       Kế hoạch khi chưa chọn Thời gian, đổi/xoá Thời gian thì xoá trắng (ums.pat.chain).
     · Khoá, Chương trình, Học phần: nhãn "Tất cả …" / nhiều cha (Hệ, Thời gian,
       Khoa QL…) → lọc TUỲ CHỌN, KHÔNG khoá. Đổi HOẶC XOÁ ô cha thì nạp lại (xoá
       trắng) ô con — bản gốc chỉ bắt select2:select nên bỏ chọn cha thì danh sách
       con vẫn theo lựa chọn cũ.
     · Chọn Thời gian: bản gốc nạp lại Hệ (xoá trắng Hệ) nhưng KHÔNG nạp lại Khoá /
       CT theo Hệ vừa bị xoá → ở đây nạp lại luôn Khoá, CT (hai lời gọi này vốn
       nhận cả Thời gian làm tham số).
   Bỏ: #dropSearch_Lop, #dropSearch_NguoiThu, #dropSearch_NamNhapHoc (không có trong
   html gốc — mã chết), getList_LopQuanLy / getList_NamNhapHoc (không được gọi),
   resetCombobox (xử lý mục rỗng "--Chọn--" trong ô chọn nhiều của select2 cũ).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ref = ums.ref;
    var L = ums.lhp = ums.lhp || {};

    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    L.uid = function () { return (ums.session && ums.session.userId) || ''; };
    L.arr = arr;
    L.e = e;
    /* Tên kèm mã trong ngoặc — mRender "ten (ma)" dùng ở nhiều cột của bản gốc */
    L.tenMa = function (ten, ma) { ten = e(ten); ma = e(ma); return ma ? ten + ' (' + ma + ')' : ten; };
    L.loi = function (t) { return function (err) { ums.api.handle(err, t); }; };

    L.boLoc = function (host, o) {
        o = o || {};
        function sel(k, ph, nhieu, opts) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
                (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + (opts || '') + '</select></div>';
        }
        function inp(k, ph, so) {
            return '<div class="ums-field"><input class="ums-input" data-f="' + k + '"' + (so ? ' inputmode="numeric"' : '') +
                ' placeholder="' + esc(ph) + '" autocomplete="off"></div>';
        }
        function chk(k, t) { return '<label class="ums-check"><input type="checkbox" data-f="' + k + '"> ' + esc(t) + '</label>'; }
        function nut(a, t, mod) {
            return ui.btn('search', { text: t, mod: mod || 'out-primary', attr: { 'data-a': a } });
        }

        host.innerHTML = ums.pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter lhp-loc">' +
                sel('tg', 'Chọn học kỳ', true) + sel('he', 'Tất cả hệ đào tạo', true) +
                sel('khoa', 'Tất cả khóa đào tạo', true) + sel('kql', 'Tất cả khoa quản lý', true) +
            '</div>' +
            '<div class="ums-filter lhp-loc ums-u-mt-3">' +
                sel('ct', 'Tất cả chương trình đào tạo', true) + sel('hp', 'Chọn học phần', true) +
                sel('kh', 'Chọn kế hoạch') + sel('kieu', 'Chọn kiểu học') +
                sel('hd', 'Chọn hành động xác nhận') +
            '</div>' +
            '<div class="ums-filter lhp-loc ums-u-mt-3">' +
                sel('loai', 'Tất cả loại lớp', false,
                    '<option value="rieng">Chỉ lớp riêng</option><option value="thuong">Chỉ lớp thường</option>') +
                sel('htt', 'Chọn hình thức học', true) +
                '<div class="ums-field lhp-loc__chk">' +
                    chk('cpc', 'Chỉ hiện các lớp chưa phân công') + chk('cn', 'Chỉ hiện đăng ký chưa nộp tiền') +
                    chk('dckt', 'Chỉ hiện đã chuyển kế toán') +
                '</div>' +
            '</div>' +
            '<div class="ums-filter lhp-loc ums-u-mt-3">' +
                inp('tu', 'Số đã đăng ký(từ số)', true) + inp('den', 'Số đã đăng ký(đến số)', true) +
                inp('q', 'Nhập từ khóa tìm kiếm') +
            '</div>' +
            '<div class="lhp-loc__nut ums-u-mt-4">' +
                nut('lhp', 'Xem danh sách lớp học phần', 'primary') +
                nut('ct', 'Xem danh sách đăng ký chi tiết') +
                nut('cb', 'Xem kết quả đăng ký chi tiết(cán bộ đăng ký)') +
                nut('rut', 'Xem danh sách rút đăng ký') +
                nut('kdk', 'Danh sách không đăng ký') +
                '<span data-z="bc"></span>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>'
        });
        ui.enhance(host);

        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? pat.val(f(k)) : ''; }
        function co(k) { return !!(f(k) && f(k).checked); }

        /* Đổ danh sách; hệ cũ đặt lại ô về trống khi danh sách không đúng MỘT mục */
        function fill(k, rows, opt) {
            pat.fill(f(k), rows, opt);
            if (rows.length !== 1) {
                if (f(k).multiple) jQuery(f(k)).val([]); else f(k).value = '';
                jQuery(f(k)).trigger('change.select2').trigger('ums:refresh');
            }
        }
        function goi(p) { return ums.api.call(p).then(function (r) { return arr(r.data); }); }

        function napThoiGian() {
            return goi({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', type: 'GET', strNguoiThucHien_Id: L.uid() })
                .then(function (d) { pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); }).catch(L.loi('thời gian đào tạo'));
        }
        function napHe() {
            return ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (d) { fill('he', d, { name: 'TENHEDAOTAO' }); }).catch(L.loi('hệ đào tạo'));
        }
        function napKhoa() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', type: 'GET',
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
                .then(function (d) { fill('khoa', d, { name: 'TENKHOA' }); }).catch(L.loi('khóa đào tạo'));
        }
        function napCT() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', type: 'GET',
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                .then(function (d) { fill('ct', d, { name: 'TENCHUONGTRINH' }); }).catch(L.loi('chương trình đào tạo'));
        }
        function napKQL() {
            return ref.khoaQuanLy().then(function (d) { fill('kql', d, { name: 'TEN' }); }).catch(L.loi('khoa quản lý'));
        }
        function napHP() {
            return goi({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', type: 'GET',
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') })
                .then(function (d) {
                    pat.fill(f('hp'), d, { name: function (r) { return e(r.TEN) + ' - ' + e(r.MA); } });
                }).catch(L.loi('học phần'));
        }
        function napKH() {
            if (!v('tg')) { pat.fill(f('kh'), [], {}); return Promise.resolve(); }
            return goi({ action: 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy', method: 'GET', type: 'GET',
                strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: L.uid(),
                pageIndex: 1, pageSize: 10000 })
                .then(function (d) { pat.fill(f('kh'), d, { name: 'TENKEHOACH' }); }).catch(L.loi('kế hoạch đăng ký'));
        }
        function napHTH() {
            return goi({ action: 'DKH_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP', func: 'pkg_dangkyhoc_chung.LayDSHinhThucHoc',
                strNguoiThucHien_Id: L.uid() })
                .then(function (d) {
                    pat.fill(f('htt'), d, { name: function (r) { return e(r.TENHINHTHUCHOC) + ' - ' + e(r.MAHINHTHUCHOC); } });
                }).catch(L.loi('hình thức học'));
        }
        function dm(k, ma) {
            ums.api.dm(ma).then(function (d) {
                var t = pat.dmTitle(d);
                if (t) { f(k).setAttribute('data-ph', t); }
                pat.fill(f(k), d, { head: t || f(k).getAttribute('data-ph') });
            }).catch(L.loi(ma));
        }

        /* Khởi tạo — đúng thứ tự init() bản gốc */
        napHe(); napKhoa(); napCT(); napKQL(); napThoiGian(); napHTH();
        dm('kieu', 'KHDT.DIEM.KIEUHOC');
        dm('hd', 'DANGKY.XACNHAN.KETQUA');
        var tt = pat.checks(host.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });

        /* Nối tầng — nghe cả lúc bỏ chọn / xoá (bản gốc chỉ nghe select2:select) */
        function nghe(k, fn) { jQuery(f(k)).on('select2:select select2:unselect select2:clear', fn); }
        nghe('tg', function () { napHe(); napKhoa(); napCT(); napHP(); napKH(); });
        nghe('he', function () { napKhoa(); napCT(); napHP(); });
        nghe('khoa', function () { napCT(); napHP(); });
        nghe('ct', function () { napHP(); });
        nghe('kql', function () { napCT(); napHP(); });
        pat.chain([f('tg'), f('kh')], { phatLai: false });

        jQuery(f('loai')).on('change', function () { if (o.onLoaiLop) o.onLoaiLop(); });
        [f('cn'), f('dckt')].forEach(function (c) { c.addEventListener('change', function () { if (o.onLocCT) o.onLocCT(); }); });
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !host.contains(b) || b.disabled) return;
            if (o.onXem) o.onXem(b.getAttribute('data-a'));
        });

        function so(k) { var n = parseInt(v(k), 10); return v(k) && !isNaN(n) ? n : -1; }

        return {
            f: f, v: v, tt: tt,
            bc: host.querySelector('[data-z="bc"]'),
            loaiLop: function () { return v('loai'); },
            chuaNop: function () { return co('cn'); },
            daChuyenKT: function () { return co('dckt'); },
            chuaPhanCong: function () { return co('cpc') ? 1 : 0; },
            tuKhoa: function () { return (f('q').value || '').trim(); },
            soTu: function () { return so('tu'); },
            soDen: function () { return so('den'); },
            /* Bộ tham số CHUNG của bốn danh sách (tên chép nguyên bản gốc).
               Tham số riêng từng danh sách (Hình thức học, Hành động, Kiểu học,
               phân trang) do lophocphan.js thêm vào đúng như từng hàm gốc. */
            chung: function () {
                return {
                    strTuKhoa: (f('q').value || '').trim(),
                    strDaoTao_ThoiGianDaoTao_Id: v('tg'),
                    strDaoTao_HocPhan_Id: v('hp'),
                    strNguoiThucHien_Id: L.uid(),
                    strDangKy_KeHoachDangKy_Id: v('kh'),
                    dChiLayCacLopChuaPhanCong: co('cpc') ? 1 : 0,
                    strDaoTao_KhoaDaoTao_Id: v('khoa'),
                    strDaoTao_ChuongTrinh_Id: v('ct'),
                    strDaoTao_HeDaoTao_Id: v('he'),
                    strDaoTao_KhoaQuanLy_Id: v('kql'),
                    dSoDaDangTuSo: so('tu'),
                    dSoDaDangDenSo: so('den')
                };
            }
        };
    };
})();
