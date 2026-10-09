/* =========================================================================
   Học lại thi lại — phần dùng chung của ba màn Lập danh sách / Đăng ký /
   Chốt danh sách (lapdanhsach, dangky, chotdanhsach — ba bản gốc chép nhau
   gần từng dòng: cùng thanh lọc, cùng HLTL_ThongTinChung/*).
   Nạp từ html của từng màn: ../../lapdanhsach/script/_hltl.js

   ums.hltl.boLoc(host, o) → { f(k), v(k), tt, thamSo(), hocPhan(), z(k) }
       Thanh lọc (html gốc giống nhau, bốn hàng):
         Hệ · Khoá · Chương trình · Lớp   — ums.ref.cascade (bản gốc gọi
             edu.system.getList_* KHÔNG lọc quyền, tham số giữ nguyên)
         Học kỳ (thời gian đào tạo) · Khoa quản lý · Đánh giá (DIEM.DANHGIA)
             [· Trạng thái đăng ký (QLHLTL.TINHTRANGDANGKY) khi o.trangThaiDK]
         Từ khoá · Tìm kiếm [· vùng báo cáo khi o.baoCao]
         Học phần · nút lấy học phần (o.hocPhan.nut)
         "Chọn trạng thái sinh viên" — CM_DanhMucDuLieu/LayDanhSach GET
             QLSV.TRANGTHAI, đánh dấu sẵn hết như gốc (ums.pat.checks).
       o = {
         danhGiaNhieu: true      ô Đánh giá CHỌN NHIỀU (lapdanhsach — gốc multiple)
         khoaQL: 'cctc' | 'khct' nguồn Khoa quản lý:
                   'cctc' = edu.system.getList_CoCauToChuc({ strCCTC_Loai_Id: '',
                            strCCTC_Cha_Id: '', iTrangThai: 1 })  (lapdanhsach)
                   'khct' = KHCT_KhoaQuanLy/LayDanhSach GET v1.0   (dangky, chotdanhsach)
         trangThaiDK: true       có ô "Trạng thái đăng ký"
         baoCao: true            chừa vùng data-z="bc" cạnh nút Tìm kiếm
         hocPhan: { nut: 'Lấy học phần' | 'Xem học phần',
                    call(thamSo) → lời gọi, ten(dòng) → chữ trong ô }
       }
       thamSo() = chín tham số lọc chung, tên chép nguyên bản gốc.
       hocPhan() = giá trị ô Học phần.

   ums.hltl.cotSV() — tám cột đầu bảng của cả ba màn (genTable_TongHop gốc).

   Cố ý bỏ (chung cả ba bản gốc — mã chết, không có ô / nút nào dùng tới):
     · TC_NguoiDungDaThuTien/LayDanhSach (đổ vào dropSearch_NguoiThu — không có ô này).
     · KHCT_NamNhapHoc/LayDanhSach, TC_KhoanThu/LayDanhSach: hàm có nhưng không nơi nào gọi.
     · Trình xử lý Học kỳ ẩn/hiện dropSearch_KyThucHien (không có ô này).
     · resetCombobox (chỉ có tác dụng với ô chọn nhiều có mục "" — ô select2 mới không có mục đó).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ref = ums.ref, esc = ui.esc;
    var H = ums.hltl = ums.hltl || {};

    H.uid = function () { return (ums.session && ums.session.userId) || ''; };
    H.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    H.e = function (v) { return v === null || v === undefined ? '' : v; };
    H.arr = function (d) { return Array.isArray(d) ? d : []; };
    H.AC = 'HLTL_ThongTinChung/';

    H.boLoc = function (host, o) {
        o = o || {};
        function sel(k, ph, nhieu) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
                (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
        }
        var hp = o.hocPhan || {};
        host.innerHTML = pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') +
                sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
            '</div>' +
            '<div class="ums-filter ums-u-mt-3">' +
                sel('hk', 'Tất cả học kỳ') + sel('kql', 'Tất cả khoa quản lý') +
                sel('dg', 'Chọn đánh giá', o.danhGiaNhieu) +
                (o.trangThaiDK ? sel('ttdk', 'Chọn trạng thái đăng ký') : '') +
            '</div>' +
            '<div class="ums-filter ums-u-mt-3">' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                (o.baoCao ? '<div class="ums-field ums-field--fit" data-z="bc"></div>' : '') +
            '</div>' +
            '<div class="ums-filter ums-u-mt-3">' +
                sel('hp', 'Chọn học phần') +
                '<div class="ums-field ums-field--fit">' +
                    ui.btn('search', { text: hp.nut || 'Xem học phần', attr: { 'data-a': 'hocphan' } }) + '</div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>'
        });
        ui.enhance(host);
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? pat.val(f(k)) : ''; }
        function loi(t) { return function (err) { ums.api.handle(err, t); }; }

        var cas = ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
            labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' } });

        ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (d) { pat.fill(f('hk'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' }); })
            .catch(loi('học kỳ'));

        var kql = o.khoaQL === 'cctc'
            ? ref.coCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 })
            : ums.api.call({ action: 'KHCT_KhoaQuanLy/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strNguoiThucHien_Id: '' })
                .then(function (r) { return H.arr(r.data); });
        kql.then(function (d) { pat.fill(f('kql'), d, { name: 'TEN', head: 'Tất cả khoa quản lý' }); }).catch(loi('khoa quản lý'));

        ums.api.dm('DIEM.DANHGIA').then(function (d) {
            pat.fill(f('dg'), d, { head: pat.dmTitle(d) || 'Chọn đánh giá' });
        }).catch(loi('đánh giá'));
        if (o.trangThaiDK) {
            ums.api.dm('QLHLTL.TINHTRANGDANGKY').then(function (d) {
                pat.fill(f('ttdk'), d, { head: pat.dmTitle(d) || 'Chọn trạng thái đăng ký' });
            }).catch(loi('trạng thái đăng ký'));
        }

        var tt = pat.checks(host.querySelector('[data-z="tt"]'),
            ums.api.call({ action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0', strMaBangDanhMuc: 'QLSV.TRANGTHAI' })
                .then(function (r) { return H.arr(r.data); }),
            { cols: 3, what: 'trạng thái sinh viên' });

        function thamSo() {
            return {
                strTuKhoa: (f('q').value || '').trim(),
                strChucNang_Id: H.cn(),
                strDanhGia_Id: v('dg'),
                strDaoTao_ThoiGianDaoTao_Id: v('hk'),
                strHeDaoTao_Id: v('he'),
                strKhoaDaoTao_Id: v('khoa'),
                strKhoaQuanLy_Id: v('kql'),
                strChuongTrinh_Id: v('ct'),
                strLopQuanLy_Id: v('lop'),
                strTrangThaiNguoiHoc_Id: tt.val()
            };
        }

        /* Nút lấy danh sách học phần → đổ vào ô Học phần (genList_HocPhan gốc) */
        function napHocPhan() {
            if (!hp.call) return;
            var b = host.querySelector('[data-a="hocphan"]');
            if (b) b.disabled = true;
            ums.api.call(hp.call(thamSo()))
                .then(function (r) {
                    var d = H.arr(r.data);
                    pat.fill(f('hp'), d, { name: hp.ten || 'TEN', head: 'Chọn học phần' });
                    ui.toast('Đã lấy ' + d.length + ' học phần', 'info');
                })
                .catch(loi('danh sách học phần'))
                .then(function () { if (b) b.disabled = false; });
        }
        host.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-a="hocphan"]')) napHocPhan();
        });

        return {
            f: f, v: v, tt: tt, cascade: cas, thamSo: thamSo,
            hocPhan: function () { return v('hp'); },
            z: function (k) { return host.querySelector('[data-z="' + k + '"]'); }
        };
    };

    /* Tám cột đầu bảng — chép thứ tự genTable_TongHop gốc (HEDAOTAO … QLSV_NGUOIHOC_NGAYSINH).
       Họ tên = HODEM + " " + TEN (mRender gốc). */
    H.cotSV = function () {
        return [
            { title: 'Hệ đào tạo', prop: 'HEDAOTAO' },
            { title: 'Khóa học', prop: 'KHOADAOTAO', cls: 'is-nowrap' },
            { title: 'Chương trình', prop: 'CHUONGTRINH' },
            { title: 'Khoa quản lý', prop: 'KHOAQUANLY' },
            { title: 'Lớp', prop: 'LOP', cls: 'is-nowrap' },
            { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(H.e(r.HODEM) + ' ' + H.e(r.TEN)); } },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }
        ];
    };

    /* Khung "Danh sách" (zone_nhap gốc): ẩn tới khi Tìm kiếm, nút Đóng (× gốc) để ẩn lại.
       tools = các nút thêm SAU nút Đóng (Đóng luôn ngoài cùng bên trái). */
    H.khungDS = function (o) {
        return '<div data-z="kq" hidden>' +
            pat.panel({ title: 'Danh sách', icon: o.icon || 'fa-rectangle-list', count: 'n', flush: true, zone: 'bang',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + (o.tools || '') }) +
            '</div>';
    };
})();
