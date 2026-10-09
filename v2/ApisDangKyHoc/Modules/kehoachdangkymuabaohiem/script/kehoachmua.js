/* =========================================================================
   Kế hoạch tổ chức đăng ký mua
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangkymuabaohiem/script/kehoachmua.js
   (theo bản TRÊN MÁY — có thêm chữ gợi ý "-- Chọn … --" cho 6 ô danh mục,
   tham số thứ 5 của loadToCombo_DanhMucDuLieu; dùng làm nhãn ô ở đây.)
   Nằm trong phân hệ Đăng ký học nhưng dữ liệu là KẾ HOẠCH MUA HÀNG của Tài
   chính: gói PKG_TAICHINH_DANGKYMUA, danh mục TAICHINH.KEHOACH.MUAHANG.*.
   ---------------------------------------------------------------------------
   Lời gọi (TC_DangKyMua_MH/<mã hoá> + func, POST — chép nguyên):
     Kế hoạch      Pr_TC_KH_MuaHang_LayDS · _Get_By_Id · _Them · _Sua · _Xoa
     Loại khoản    Pr_TC_KH_MH_DG_LayDS · _Get_By_Id · _Them · _Sua · _Xoa
     Phạm vi       Pr_TC_KH_MH_PV_LayDS · _Them (mỗi phạm vi một lời gọi) · _Xoa
     Kết quả       Pr_TC_KH_MH_KQ_LayDS
   Nguồn ô chọn:
     danh mục TAICHINH.KEHOACH.MUAHANG.LOAI / TINHTRANG / PHANLOAIHANGHOA / DONVITINH
     TC_KhoanThu/LayDanhSach (GET, kiểu cũ)            loại khoản
     edu.system.getList_ThoiGianDaoTao / HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao
       / KhoaQuanLy → ums.ref.* (tham số giống bản Corei)
     edu.system.getList_LopQuanLy → gọi thẳng theo bản Corei (có thêm
       strDaoTao_KhoaQuanLy_Id so với ums.ref.lopQuanLy của Core)
     SV_HoSoHocVien_MH / pkg_hosohocvien.LayDanhSachHoSo    người học của lớp
   Bốn tham số mọi lời gọi gốc tự gửi (strNguoiThucHien_Id, strVaiTroDangNhap_Id,
   strChucNangHeThong_Id, strHanhDong_Code) gửi rỗng — ums.api tự điền ba ô đầu
   như makeRequest cũ (edu.system.strVaiTro_Id không tồn tại nên gốc cũng gửi rỗng).
   Tên cột đọc theo đúng các cột dự phòng bản gốc dò (TEN || Ten || ten …).

   Giữ nguyên hành vi bản gốc:
     · Danh sách KHÔNG phân trang máy chủ (gốc không gửi pageIndex/pageSize).
     · Đổi ô lọc = tìm ngay; gõ ô từ khoá tìm sau 300 ms; Enter = tìm.
     · Xoá kế hoạch / loại khoản chỉ có trong biểu mẫu sửa (gốc không có xoá
       trên dòng; nút "Xóa" đầu danh sách của gốc để ẩn và không có xử lý).
     · Lưu phạm vi CHỈ gửi strPhamViApDung_Id (không gửi loại phạm vi — gốc
       cũng không). Danh sách phạm vi chỉ giữ dòng HIEULUC = 1 (lọc ở máy).
     · Kết quả đăng ký: tìm/lọc tại chỗ trên dữ liệu đã nạp (từ khoá khớp mã
       số, họ tên, loại khoản, tình trạng, lý do; hai ô lọc dựng từ dữ liệu).

   Khác gốc:
     · Mở màn là nạp danh sách luôn (gốc chỉ nạp khi bấm Tìm kiếm / đổi ô lọc —
       bảng trống lúc mới vào).
     · Ba nhóm "Cho phép…/Bắt buộc/Hiệu lực" là ô chọn hai mục thay nút radio
       (cùng giá trị 1/0, cùng mặc định); ô trống gửi đúng giá trị dự phòng
       của gốc (`|| "0"`, hiệu lực `|| "1"`).
     · Đơn giá: ô nhập có dấu phẩy ngăn nghìn, gửi số trơn (gốc gửi nguyên chữ gõ).
     · Hộp "Thêm mới phạm vi": nối tầng Hệ → Khoá → Chương trình → Lớp → Người
       học KHOÁ theo luật cha → con (gốc nạp sẵn mọi lớp khi mở hộp). Khoa quản
       lý đứng riêng, không nối tầng.
     · Lưu / xoá nhiều phạm vi chạy qua ums.ui.batch, báo đúng số lỗi (gốc lưu
       báo "thành công" cả khi máy chủ trả Success = false).
   Cố ý bỏ:
     · Cột "Chọn" (ô đánh dấu) của bảng Kết quả: không có xử lý nào dùng đến.
     · Lớp phủ "Đang tải dữ liệu..." riêng của màn (tầng chung đã có).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('kehoachmua');
    if (!root) return;

    /* ---------- Lời gọi TC_DangKyMua_MH ----------------------------------- */
    var P = 'PKG_TAICHINH_DANGKYMUA.';
    var A = {
        khDS:   ['ETMeFQIeCgkeDDQgCSAvJh4NIDgFEgPP', 'Pr_TC_KH_MuaHang_LayDS'],
        khCT:   ['ETMeFQIeCgkeDDQgCSAvJh4GJDUeAzgeCCUP', 'Pr_TC_KH_MuaHang_Get_By_Id'],
        khThem: ['ETMeFQIeCgkeDDQgCSAvJh4VKSQs', 'Pr_TC_KH_MuaHang_Them'],
        khSua:  ['ETMeFQIeCgkeDDQgCSAvJh4SNCAP', 'Pr_TC_KH_MuaHang_Sua'],
        khXoa:  ['ETMeFQIeCgkeDDQgCSAvJh4ZLiAP', 'Pr_TC_KH_MuaHang_Xoa'],
        dgDS:   ['ETMeFQIeCgkeDAkeBQYeDSA4BRIP', 'Pr_TC_KH_MH_DG_LayDS'],
        dgCT:   ['ETMeFQIeCgkeDAkeBQYeBiQ1HgM4Hggl', 'Pr_TC_KH_MH_DG_Get_By_Id'],
        dgThem: ['ETMeFQIeCgkeDAkeBQYeFSkkLAPP', 'Pr_TC_KH_MH_DG_Them'],
        dgSua:  ['ETMeFQIeCgkeDAkeBQYeEjQg', 'Pr_TC_KH_MH_DG_Sua'],
        dgXoa:  ['ETMeFQIeCgkeDAkeBQYeGS4g', 'Pr_TC_KH_MH_DG_Xoa'],
        pvDS:   ['ETMeFQIeCgkeDAkeERceDSA4BRIP', 'Pr_TC_KH_MH_PV_LayDS'],
        pvThem: ['ETMeFQIeCgkeDAkeERceFSkkLAPP', 'Pr_TC_KH_MH_PV_Them'],
        pvXoa:  ['ETMeFQIeCgkeDAkeERceGS4g', 'Pr_TC_KH_MH_PV_Xoa'],
        kqDS:   ['ETMeFQIeCgkeDAkeChAeDSA4BRIP', 'Pr_TC_KH_MH_KQ_LayDS']
    };
    function goi(k, o) {
        o = o || {};
        o.action = 'TC_DangKyMua_MH/' + A[k][0];
        o.func = P + A[k][1];
        o.strNguoiThucHien_Id = '';
        o.strVaiTroDangNhap_Id = '';
        o.strChucNangHeThong_Id = '';
        o.strHanhDong_Code = '';
        return o;
    }

    /* ---------- Tiện ích --------------------------------------------------- */
    function e(v) { return v === undefined || v === null ? '' : v; }
    function rowsOf(r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    /** pick(row, 'TEN', 'Ten', 'ten') — cột đầu tiên có giá trị, như hàm pick của gốc */
    function pick(r) {
        for (var i = 1; i < arguments.length; i++) {
            var v = r ? r[arguments[i]] : undefined;
            if (v !== undefined && v !== null && v !== '') return v;
        }
        return '';
    }
    function co01(v) { return v == 1 || v === '1' ? '1' : '0'; }     // eslint-disable-line eqeqeq
    function coKhong(v) {
        if (v === 1 || v === '1' || v === true) return 'Có';
        if (v === 0 || v === '0' || v === false) return 'Không';
        return '';
    }
    function hai(a, b) { return { items: [{ ID: '1', TEN: a }, { ID: '0', TEN: b }] }; }
    function soTien(v) { return v === '' || v === null || v === undefined ? '' : ui.money(v); }

    var TEN_NGAYTAO = ['NGAYTAO_DD_MM_YYYY_HHMMSS', 'NgayTao_dd_mm_yyyy_hhmmss', 'NGAYTAO', 'NgayTao'];
    var TEN_NGUOITAO = ['NGUOITAO_TAIKHOAN', 'NGUOITAO_TaiKhoan', 'NguoiTao_TaiKhoan', 'NGUOITAO'];
    function pickArr(r, keys) { return pick.apply(null, [r].concat(keys)); }

    /* ---------- Nguồn ô chọn (dùng chung — mỗi nguồn chỉ tải một lần) ----- */
    var LOAI = { dm: 'TAICHINH.KEHOACH.MUAHANG.LOAI' };
    var TINHTRANG = { dm: 'TAICHINH.KEHOACH.MUAHANG.TINHTRANG' };
    var PHANLOAI = { dm: 'TAICHINH.KEHOACH.MUAHANG.PHANLOAIHANGHOA' };
    var DVT = { dm: 'TAICHINH.KEHOACH.MUAHANG.DONVITINH' };
    var THOIGIAN = {
        call: {   // getList_ThoiGianDaoTao (Corei:3683) với objList của gốc
            action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P',
            func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
            strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000
        },
        id: 'ID', name: 'DAOTAO_THOIGIANDAOTAO'
    };
    var KHOANTHU = {
        call: {   // loadCombo_KhoanThu_LK
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET',
            strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1,
            strNhomCacKhoanThu_Id: '', strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
        },
        id: 'ID', name: 'TEN'
    };

    /* =====================================================================
       Danh sách kế hoạch + biểu mẫu (zonebatdau / zoneEdit_KeHoach)
       ===================================================================== */
    /* Cột chữ dài giữ bề rộng tối thiểu — bảng 12 cột, không thì bị bóp một từ một dòng */
    function rong(t) { return '<div class="khm-rong">' + ui.esc(t) + '</div>'; }
    function nutXem(k, r) {
        return ui.btn('view', { text: 'Xem chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-xem': k, 'data-id': e(r.ID) } });
    }

    var main = ums.crud({
        root: root,
        title: 'Kế hoạch tổ chức đăng ký mua',
        listTitle: 'Danh sách kế hoạch tổ chức đăng ký mua',
        formTitle: 'kế hoạch tổ chức đăng ký mua',
        icon: 'fa-list-timeline',
        addText: 'Mở kế hoạch mới',
        empty: 'Không có dữ liệu',

        filters: [
            { key: 'loai', type: 'select', label: 'Chọn loại kế hoạch', source: LOAI },
            { key: 'tt', type: 'select', label: 'Chọn tình trạng', source: TINHTRANG },
            { key: 'q', type: 'text', label: 'Nhập thông tin tìm kiếm' }
        ],

        list: {
            call: function (f) {
                return goi('khDS', {
                    strTuKhoa: f.q,
                    strLoaiKeHoach_Id: f.loai,
                    strTinhTrang_Id: f.tt,
                    dHieuLuc: '',
                    strTuNgay: '',
                    strDenNgay: ''
                });
            }
        },

        columns: [
            { title: 'Tên kế hoạch', render: function (r) { return rong(pick(r, 'TEN', 'Ten', 'ten')); } },
            { title: 'Mã kế hoạch', width: '120px', render: function (r) { return ui.esc(pick(r, 'MA', 'Ma', 'ma')); } },
            { title: 'Mô tả', render: function (r) { return rong(pick(r, 'MOTA', 'MoTa', 'mota')); } },
            { title: 'Từ ngày', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pick(r, 'TUNGAY', 'TuNgay', 'tungay')); } },
            { title: 'Đến ngày', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pick(r, 'DENNGAY', 'DenNgay', 'denngay')); } },
            { title: 'Loại kế hoạch', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'LOAIKEHOACH_TEN', 'LOAIKEHOACH_Ten', 'LoaiKeHoach_Ten')); } },
            { title: 'Tình trạng', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'TINHTRANG_TEN', 'TINHTRANG_Ten', 'TinhTrang_Ten')); } },
            { title: 'Loại khoản và đơn giá', cls: 'is-center is-nowrap', render: function (r) { return nutXem('lk', r); } },
            { title: 'Mở cho đối tượng nào', cls: 'is-center is-nowrap', render: function (r) { return nutXem('pv', r); } },
            { title: 'Kết quả đăng ký mua', cls: 'is-center is-nowrap', render: function (r) { return nutXem('kq', r); } },
            { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pickArr(r, TEN_NGAYTAO)); } },
            { title: 'Người tạo', render: function (r) { return ui.esc(pickArr(r, TEN_NGUOITAO)); } }
        ],

        detail: function (row) { return goi('khCT', { strId: row.ID }); },

        formCols: 2,
        fields: [
            { key: 'strDAOTAO_ThoiGianDaoTao_Id', label: 'Thời gian đào tạo', type: 'select', source: THOIGIAN,
              placeholder: '--Chọn thời gian đào tạo--',
              get: function (r) { return pick(r, 'DAOTAO_THOIGIANDAOTAO_ID', 'DAOTAO_THOIGIANDAOTAO_Id', 'DaoTao_ThoiGianDaoTao_Id'); } },
            { key: 'strLoaiKeHoach_Id', label: 'Loại kế hoạch', type: 'select', source: LOAI, placeholder: 'Chọn loại kế hoạch',
              get: function (r) { return pick(r, 'LOAIKEHOACH_ID', 'LOAIKEHOACH_Id', 'LoaiKeHoach_Id', 'LOAIKEHOACH_id'); } },
            { key: 'strTinhTrang_Id', label: 'Tình trạng', type: 'select', source: TINHTRANG, placeholder: 'Chọn tình trạng',
              get: function (r) { return pick(r, 'TINHTRANG_ID', 'TINHTRANG_Id', 'TinhTrang_Id', 'TINHTRANG_id'); } },
            { key: 'strMa', label: 'Mã kế hoạch', placeholder: 'Nhập mã kế hoạch', get: function (r) { return pick(r, 'MA', 'Ma', 'ma'); } },
            { key: 'strTen', label: 'Tên kế hoạch', placeholder: 'Nhập tên kế hoạch', span: true, get: function (r) { return pick(r, 'TEN', 'Ten', 'ten'); } },
            { key: 'strMoTa', label: 'Mô tả', type: 'textarea', span: true, get: function (r) { return pick(r, 'MOTA', 'MoTa', 'mota'); } },
            { key: 'dChoPhepSuaSoLuong', label: 'Cho phép sửa số lượng', type: 'select', value: '1',
              source: hai('Cho phép', 'Không cho phép'),
              get: function (r) { return co01(pick(r, 'CHOPHEPSUASOLUONG', 'ChoPhepSuaSoLuong', 'chophepsuasoluong')); } },
            { key: 'dChoPhepHuyTruocThanhToan', label: 'Cho phép hủy trước thanh toán', type: 'select', value: '1',
              source: hai('Cho phép', 'Không cho phép'),
              get: function (r) { return co01(pick(r, 'CHOPHEPHUYTRUOCTHANHTOAN', 'ChoPhepHuyTruocThanhToan', 'chophephuytruocthanhtoan')); } },
            { key: 'dYeuCauThanhToanNgay', label: 'Yêu cầu thanh toán ngay', type: 'select', value: '0',
              source: hai('Thanh toán ngay', 'Thanh toán sau'),
              get: function (r) { return co01(pick(r, 'YEUCAUTHANHTOANNGAY', 'YeuCauThanhToanNgay', 'yeucauthanhtoanngay')); } },
            { type: 'gap' },
            { key: 'strTuNgay', label: 'Từ ngày', type: 'date', get: function (r) { return pick(r, 'TUNGAY', 'TuNgay', 'tungay'); } },
            { key: 'strDenNgay', label: 'Đến ngày', type: 'date', get: function (r) { return pick(r, 'DENNGAY', 'DenNgay', 'denngay'); } }
        ],

        save: function (v, row) {
            var strId = row ? pick(row, 'ID', 'Id', 'id') : '';
            return goi(strId ? 'khSua' : 'khThem', {
                strId: strId,
                strMa: v.strMa,
                strTen: v.strTen,
                strMoTa: v.strMoTa,
                strLoaiKeHoach_Id: v.strLoaiKeHoach_Id,
                strTinhTrang_Id: v.strTinhTrang_Id,
                strDAOTAO_ThoiGianDaoTao_Id: v.strDAOTAO_ThoiGianDaoTao_Id,
                strTuNgay: v.strTuNgay,
                strDenNgay: v.strDenNgay,
                dChoPhepHuyTruocThanhToan: v.dChoPhepHuyTruocThanhToan || '0',
                dChoPhepSuaSoLuong: v.dChoPhepSuaSoLuong || '0',
                dYeuCauThanhToanNgay: v.dYeuCauThanhToanNgay || '0'
            });
        },

        // Xoá chỉ có trong biểu mẫu sửa (btnXoa_KeHoach), một kế hoạch một lời gọi
        remove: function (ids) { return goi('khXoa', { strId: ids[0] }); },
        rowDelete: false,
        multi: false,
        removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa kế hoạch này không?'; }
    });

    /* Gõ tới đâu tìm tới đó (debounce 300 ms như gốc) */
    var henTim = 0;
    root.addEventListener('input', function (ev) {
        var t = ev.target;
        if (!t.matches || !t.matches('[data-scope="filter"][data-k="q"]') || !root.contains(t)) return;
        if (t.closest('dialog')) return;
        clearTimeout(henTim);
        henTim = setTimeout(function () { main.load(1); }, 300);
    });

    /* Ba nút "Xem chi tiết" trên dòng */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xem]');
        if (!b || !root.contains(b)) return;
        var id = b.getAttribute('data-id');
        var kh = main.rows.filter(function (r) { return String(r.ID) === id; })[0] || { ID: id };
        var k = b.getAttribute('data-xem');
        if (k === 'lk') moLoaiKhoan(kh);
        else if (k === 'pv') moPhamVi(kh);
        else if (k === 'kq') moKetQua(kh);
    });

    function tenKH(kh) { return pick(kh, 'TEN', 'Ten', 'ten'); }

    /* =====================================================================
       MÀN CON "Loại khoản và đơn giá" — mở NGAY TRONG TRANG, thay chỗ danh sách kế hoạch
       (BO-CUC luật 1, rà hộp thoại 2026-09-30; trước đây là hộp thoại chứa cả danh sách +
       biểu mẫu). Biểu mẫu thêm / sửa của crud con thay chỗ bảng bên trong khung này.
       ===================================================================== */
    function moLoaiKhoan(kh) {
        var ft = pat.formTrang({ host: root, title: 'Loại khoản và đơn giá', icon: 'fa-coins', cols: 1, body: '<div></div>' });
        var host = ft.body.firstChild;

        ums.crud({
            root: host,
            embedded: true,
            title: tenKH(kh) || 'Loại khoản và đơn giá',
            formTitle: 'loại khoản và đơn giá',
            icon: 'fa-coins',
            addText: 'Thêm mới',
            empty: 'Không có dữ liệu',

            list: {
                call: function () {
                    return goi('dgDS', {
                        strTaiChinh_KH_MuaHang_Id: kh.ID,
                        strTaiChinh_CacKhoanThu_Id: '',
                        strPhanLoaiHangHoa_Id: '',
                        dHieuLuc: ''
                    });
                }
            },

            columns: [
                { title: 'Loại khoản', render: function (r) { return ui.esc(pick(r, 'TEN_KHOANTHU', 'LOAIKHOAN_TEN', 'LOAIKHOAN_Ten')); } },
                { title: 'Đơn giá', cls: 'is-right is-nowrap', render: function (r) { return soTien(r.DONGIA); } },
                { title: 'Phân loại', render: function (r) { return ui.esc(pick(r, 'PHANLOAIHANGHOA_TEN', 'PHANLOAIHANGHOA_Ten', 'PHANLOAI_Ten')); } },
                { title: 'Đơn vị tính', render: function (r) { return ui.esc(pick(r, 'TEN_DONVITINH', 'DONVITINH_TEN', 'DONVITINH_Ten')); } },
                { title: 'Cho phép không mua', cls: 'is-center', render: function (r) { return coKhong(r.CHOPHEPKHONGMUA); } },
                { title: 'Bắt buộc', cls: 'is-center', render: function (r) { return coKhong(r.BATBUOC); } },
                { title: 'Cho phép nhập số lượng', cls: 'is-center', render: function (r) { return coKhong(r.CONHAPSOLUONG); } },
                { title: 'Số tối thiểu', prop: 'SOLUONGTOITHIEU', cls: 'is-center' },
                { title: 'Số tối đa', prop: 'SOLUONGTOIDA', cls: 'is-center' },
                { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pick(r, 'NGAYTAO_DD_MM_YYYY_HHMMSS', 'NgayTao_dd_mm_yyyy_hhmmss', 'NGAYTAO')); } },
                { title: 'Người tạo', render: function (r) { return ui.esc(pick(r, 'NGUOITAO_TAIKHOAN', 'NGUOITAO_TaiKhoan', 'NGUOITAO')); } }
            ],

            detail: function (row) { return goi('dgCT', { strId: row.ID }); },

            fields: [
                { key: 'strTaiChinh_CacKhoanThu_Id', label: 'Loại khoản', type: 'select', source: KHOANTHU, placeholder: 'Chọn loại khoản',
                  get: function (r) { return pick(r, 'TAICHINH_CACKHOANTHU_ID', 'TAICHINH_CACKHOANTHU_Id', 'TaiChinh_CacKhoanThu_Id', 'TAICHINHCACKHOANTHU_ID'); } },
                { key: 'dDonGia', label: 'Đơn giá', type: 'number', placeholder: 'Nhập đơn giá',
                  get: function (r) { return pat.money(pick(r, 'DONGIA', 'DonGia', 'dongia')); } },
                { key: 'strPhanLoaiHangHoa_Id', label: 'Phân loại', type: 'select', source: PHANLOAI, placeholder: 'Chọn phân loại hàng hóa',
                  get: function (r) { return pick(r, 'PHANLOAIHANGHOA_ID', 'PHANLOAIHANGHOA_Id', 'PhanLoaiHangHoa_Id', 'PHANLOAI_ID'); } },
                { key: 'strDonViTinh_Id', label: 'Đơn vị tính', type: 'select', source: DVT, placeholder: 'Chọn đơn vị tính',
                  get: function (r) { return pick(r, 'DONVITINH_ID', 'DONVITINH_Id', 'DonViTinh_Id'); } },
                { key: 'dChoPhepKhongMua', label: 'Cho phép không mua', type: 'select', value: '0',
                  source: hai('Cho phép không mua', 'Mặc định mua'),
                  get: function (r) { return co01(pick(r, 'CHOPHEPKHONGMUA', 'ChoPhepKhongMua', 'chophepkhongmua')); } },
                { key: 'dBatBuoc', label: 'Bắt buộc', type: 'select', value: '0',
                  source: hai('Bắt buộc', 'Không bắt buộc'),
                  get: function (r) { return co01(pick(r, 'BATBUOC', 'BatBuoc', 'batbuoc')); } },
                { key: 'dCoNhapSoLuong', label: 'Cho phép nhập số lượng', type: 'select', value: '1',
                  source: hai('Cho phép nhập số lượng', 'Không cho phép nhập số lượng'),
                  get: function (r) { return co01(pick(r, 'CONHAPSOLUONG', 'CoNhapSoLuong', 'conhapsoluong')); } },
                { key: 'dHieuLuc', label: 'Hiệu lực', type: 'select', value: '1',
                  source: hai('Hiệu lực', 'Hết hiệu lực'),
                  get: function (r) { return co01(pick(r, 'HIEULUC', 'HieuLuc', 'hieuluc')); } },
                { key: 'dSoLuongToiThieu', label: 'Số tối thiểu', type: 'number', placeholder: 'Nhập số tối thiểu',
                  get: function (r) { return pick(r, 'SOLUONGTOITHIEU', 'SoLuongToiThieu', 'soluongtoithieu'); } },
                { key: 'dSoLuongToiDa', label: 'Số tối đa', type: 'number', placeholder: 'Nhập số tối đa',
                  get: function (r) { return pick(r, 'SOLUONGTOIDA', 'SoLuongToiDa', 'soluongtoida'); } },
                { key: 'dSapXep', label: 'Thứ tự', type: 'number', placeholder: 'Nhập thứ tự',
                  get: function (r) { return pick(r, 'SAPXEP', 'SapXep', 'sapxep'); } }
            ],

            save: function (v, row) {
                var strId = row ? pick(row, 'ID', 'Id', 'id') : '';
                return goi(strId ? 'dgSua' : 'dgThem', {
                    strId: strId,
                    strTaiChinh_KH_MuaHang_Id: kh.ID,
                    strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id,
                    strPhanLoaiHangHoa_Id: v.strPhanLoaiHangHoa_Id,
                    dDonGia: pat.num(v.dDonGia),
                    strDonViTinh_Id: v.strDonViTinh_Id,
                    dCoNhapSoLuong: v.dCoNhapSoLuong || '0',
                    dSoLuongToiThieu: v.dSoLuongToiThieu,
                    dSoLuongToiDa: v.dSoLuongToiDa,
                    dBatBuoc: v.dBatBuoc || '0',
                    dChoPhepKhongMua: v.dChoPhepKhongMua || '0',
                    dHieuLuc: v.dHieuLuc || '1',
                    dSapXep: v.dSapXep
                });
            },

            remove: function (ids) { return goi('dgXoa', { strId: ids[0] }); },
            rowDelete: false,
            multi: false,
            removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa loại khoản và đơn giá này không?'; }
        });

        // Đơn giá: dấu phẩy ngăn nghìn khi rời ô
        host.addEventListener('focusout', function (ev) {
            var t = ev.target;
            if (t.matches && t.matches('[data-scope="form"][data-k="dDonGia"]') && t.value.trim()) t.value = pat.money(t.value);
        });
    }

    /* =====================================================================
       Hộp "Phạm vi đối tượng nào"
       ===================================================================== */
    var LOAI_LABELS = {
        KHOAQUANLY: 'Khoa quản lý', HEDAOTAO: 'Hệ đào tạo', KHOADAOTAO: 'Khóa',
        CHUONGTRINH: 'Chương trình', LOP: 'Lớp', NGUOIHOC: 'Người học'
    };

    function moPhamVi(kh) {
        var dlg = ui.dialog({
            title: 'Phạm vi đối tượng nào',
            icon: 'fa-users-gear',
            size: 'lg',
            body: '<div data-pv-bang></div>',
            xoa: { chon: 'input[data-pv]', onClick: function () { xoaChon(); } },
            buttons: [{ text: 'Thêm mới', kind: 'add', keepOpen: true, onClick: function () { themPhamVi(kh, nap); } }]
        });
        var host = dlg.body.querySelector('[data-pv-bang]');

        function nap() {
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(goi('pvDS', {
                strTaiChinh_KH_MuaHang_Id: kh.ID,
                strPhamViLoai_Code: '',
                strPhamViApDung_Id: '',
                dHieuLuc: 1
            })).then(function (r) {
                // Lọc ở máy như gốc: chỉ giữ bản ghi còn hiệu lực (HIEULUC = 1 hoặc không có cột)
                var rows = rowsOf(r).filter(function (x) {
                    var v = x.HIEULUC;
                    return v === 1 || v === '1' || v === true || v === null || v === undefined;
                });
                ui.table({
                    el: host,
                    rows: rows,
                    empty: 'Chưa có phạm vi nào',
                    columns: [
                        { title: 'Phạm vi', render: function (x) { return ui.esc(pick(x, 'PHAMVIAPDUNG_TEN', 'PHAMVIAPDUNG_Ten', 'PHAMVI_Ten')); } },
                        { title: 'Hiệu lực', cls: 'is-center', width: '90px', render: function (x) { return coKhong(x.HIEULUC); } },
                        { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (x) { return ui.esc(pick(x, 'NGAYTAO_DD_MM_YYYY_HHMMSS', 'NgayTao_dd_mm_yyyy_hhmmss', 'NGAYTAO')); } },
                        { title: 'Người tạo', render: function (x) { return ui.esc(pick(x, 'NGUOITAO_TAIKHOAN', 'NGUOITAO_TaiKhoan', 'NGUOITAO')); } },
                        { head: '<input type="checkbox" data-pv-all title="Chọn tất cả">', cls: 'is-center', width: '60px',
                          render: function (x) { return '<input type="checkbox" data-pv="' + ui.esc(x.ID) + '">'; } }
                    ]
                });
            }).catch(function (err) {
                host.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'phạm vi đối tượng');
            });
        }

        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.hasAttribute('data-pv-all')) {
                Array.prototype.forEach.call(host.querySelectorAll('input[data-pv]'), function (x) { x.checked = t.checked; });
            } else if (t.hasAttribute('data-pv')) {
                var all = host.querySelector('[data-pv-all]');
                var bx = host.querySelectorAll('input[data-pv]');
                if (all) all.checked = bx.length > 0 && host.querySelectorAll('input[data-pv]:checked').length === bx.length;
            }
            ui.demXoaChon();
        });

        function xoaChon() {
            var ids = Array.prototype.map.call(host.querySelectorAll('input[data-pv]:checked'), function (x) { return x.getAttribute('data-pv'); });
            if (!ids.length) { ui.toast('Chưa chọn phạm vi để xóa!', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa ' + ids.length + ' phạm vi đã chọn không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá phạm vi' })
                .then(function (yes) {
                    if (!yes) return;
                    return ui.batch(ids.map(function (id) { return goi('pvXoa', { strId: id }); }), { title: 'Đang xoá phạm vi' })
                        .then(function (r) {
                            if (!r.fail) ui.toast('Xóa thành công ' + ids.length + ' phạm vi!', 'ok');
                            else ui.toast('Xóa xong: ' + r.ok + '/' + ids.length + ' thành công, ' + r.fail + ' lỗi.', 'warn');
                            nap();
                        });
                });
        }

        nap();
    }

    /* Hộp "Thêm mới phạm vi đối tượng nào" — sáu ô chọn, mỗi ô một nút Thêm */
    function themPhamVi(kh, sauLuu) {
        var DONG = [
            ['KHOAQUANLY', 'Khoa quản lý', '--Chọn khoa quản lý--'],
            ['HEDAOTAO', 'Hệ đào tạo', '--Chọn hệ đào tạo--'],
            ['KHOADAOTAO', 'Khóa', '--Chọn khóa đào tạo--'],
            ['CHUONGTRINH', 'Chương trình', '--Chọn chương trình--'],
            ['LOP', 'Lớp', '--Chọn lớp--'],
            ['NGUOIHOC', 'Người học', '--Chọn người học--']
        ];
        var chon = [];      // arrPhamVi_PV: { id, loai, name }

        var body = '<div class="ums-legend">Thông tin phạm vi</div>' +
            DONG.map(function (d) {
                return ui.field(d[1], '<div class="khm-pv-row">' +
                    '<select class="ums-select" data-pv-sel="' + d[0] + '" data-ph="' + ui.esc(d[2]) + '"><option value="">' + ui.esc(d[2]) + '</option></select>' +
                    ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-pv-add': d[0], title: 'Thêm phạm vi' } }) +
                    '</div>', { inline: true });
            }).join('') +
            '<div class="khm-pv-chon"><div class="ums-panel__title ums-u-mb-2"><i class="fa-light fa-circle-check"></i> Phạm vi đã chọn</div>' +
            '<div data-pv-chips></div></div>';

        var dlg = ui.dialog({
            title: 'Thêm mới phạm vi đối tượng nào',
            icon: 'fa-plus',
            size: 'md',
            body: body,
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); } }]
        });
        var B = dlg.body;
        function sel(k) { return B.querySelector('[data-pv-sel="' + k + '"]'); }
        var F = { kql: sel('KHOAQUANLY'), he: sel('HEDAOTAO'), khoa: sel('KHOADAOTAO'), ct: sel('CHUONGTRINH'), lop: sel('LOP'), hv: sel('NGUOIHOC') };
        ui.enhance(B);

        function napO(el, p, name) {
            return p.then(function (rows) { pat.fill(el, rows, { id: 'ID', name: name }); })
                .catch(function (err) { ums.api.handle(err, 'danh sách phạm vi'); });
        }
        function v(el) { return el.value || ''; }

        /* getList_PV_* — tham số theo bản Corei */
        function napKhoa() {
            napO(F.khoa, ums.ref.khoaDaoTao({ strHeDaoTao_Id: v(F.he), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }), 'TENKHOA');
        }
        function napCT() {
            napO(F.ct, ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v(F.khoa), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }), 'TENCHUONGTRINH');
        }
        function napLop() {
            napO(F.lop, ums.api.call({       // Corei getList_LopQuanLy (4080)
                action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
                func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
                silent: true,
                strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_HeDaoTao_Id: v(F.he),
                strDaoTao_KhoaDaoTao_Id: v(F.khoa),
                strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_Nganh_Id: '',
                strDaoTao_LoaiLop_Id: '',
                strDaoTao_ToChucCT_Id: v(F.ct),
                strNguoiThucHien_Id: '',
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: 1000000
            }).then(rowsOf), 'TEN');
        }
        function napHV() {
            if (!v(F.lop)) { pat.fill(F.hv, []); return; }
            napO(F.hv, ums.api.call({
                action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu',
                func: 'pkg_hosohocvien.LayDanhSachHoSo',
                silent: true,
                strHeDaoTao_Id: v(F.he),
                strKhoaDaoTao_Id: v(F.khoa),
                strChuongTrinh_Id: v(F.ct),
                strLopQuanLy_Id: v(F.lop),
                strQLSV_TrangThaiNguoiHoc_Id: '',
                dLocTheoDuLieuImport: -1,
                strNguoiThucHien_Id: '',
                strChucNang_Id: ums.state.chucNangId || '',
                strTuNgay: '',
                strDenNgay: '',
                pageIndex: 1,
                pageSize: 1000000
            }).then(rowsOf), function (r) { return e(r.MASO) + ' - ' + e(r.HODEM) + ' ' + e(r.TEN); });
        }

        // loadCombo_PhamVi_All: Khoa quản lý + Hệ; Lớp / Người học chờ ô cha (luật cha → con)
        napO(F.kql, ums.ref.khoaQuanLy(), 'TEN');
        napO(F.he, ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }), 'TENHEDAOTAO');

        if (window.jQuery) {
            jQuery(F.he).on('select2:select', napKhoa);
            jQuery(F.khoa).on('select2:select', function () { napCT(); napLop(); });
            jQuery(F.ct).on('select2:select', napLop);
            jQuery(F.lop).on('select2:select', napHV);
        }
        pat.chain([F.he, F.khoa, F.ct, F.lop, F.hv]);

        function veChip() {
            var h = B.querySelector('[data-pv-chips]');
            if (!chon.length) { h.innerHTML = '<span class="ums-u-faint ums-u-fz13">Chưa chọn phạm vi nào</span>'; return; }
            h.innerHTML = '<div class="ums-chips">' + chon.map(function (x, i) {
                return '<span class="ums-chip">' + ui.badge(LOAI_LABELS[x.loai] || x.loai, 'info') + '<span>' + ui.esc(x.name) + '</span>' +
                    '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-pv-bo="' + i + '" title="Bỏ chọn"><i class="fa-light fa-xmark"></i></button></span>';
            }).join('') + '</div>';
        }
        veChip();

        B.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-pv-add]');
            if (a) {
                var loai = a.getAttribute('data-pv-add');
                var s = sel(loai);
                if (!s.value) { ui.toast('Vui lòng chọn giá trị trước khi thêm!', 'warn'); return; }
                if (chon.some(function (x) { return x.id === s.value && x.loai === loai; })) return;
                chon.push({ id: s.value, loai: loai, name: s.options[s.selectedIndex].text });
                veChip();
                return;
            }
            var bo = ev.target.closest('[data-pv-bo]');
            if (bo) { chon.splice(Number(bo.getAttribute('data-pv-bo')), 1); veChip(); }
        });

        function luu() {
            if (!chon.length) { ui.toast('Vui lòng chọn ít nhất 1 phạm vi!', 'warn'); return; }
            var calls = chon.map(function (x) {
                return goi('pvThem', { strTaiChinh_KH_MuaHang_Id: kh.ID, strPhamViApDung_Id: x.id });
            });
            ui.batch(calls, { title: 'Đang lưu phạm vi' }).then(function (r) {
                if (!r.fail) {
                    ui.toast('Lưu ' + calls.length + ' phạm vi thành công!', 'ok');
                    dlg.close();
                } else {
                    ui.toast('Lưu xong: ' + r.ok + '/' + calls.length + ' thành công, ' + r.fail + ' lỗi.', 'warn');
                }
                sauLuu();
            });
        }
    }

    /* =====================================================================
       Hộp "Kết quả đăng ký mua" — tìm / lọc tại chỗ
       ===================================================================== */
    function lkCua(r) { return pick(r, 'TEN_KHOANTHU', 'LOAIKHOAN_TEN', 'LOAIKHOAN_Ten'); }
    function ttCua(r) { return pick(r, 'TINHTRANGDANGKY_CODE_NAME', 'TINHTRANGDANGKY_Code_Name', 'TINHTRANGDANGKY_TEN', 'TINHTRANG_Ten'); }
    function soCua(r, a, b) { return r[a] != null ? r[a] : (r[b] != null ? r[b] : ''); }

    function moKetQua(kh) {
        var dlg = ui.dialog({
            title: 'Kết quả đăng ký mua',
            icon: 'fa-money-check-pen',
            size: 'xl',
            body:
                '<div class="ums-filter ums-u-mb-4">' +
                    '<div class="ums-field"><input class="ums-input" data-kq="q" placeholder="Tìm mã số, họ tên, loại khoản, lý do..." autocomplete="off"></div>' +
                    '<div class="ums-field"><select class="ums-select" data-kq="lk" data-ph="-- Tất cả loại khoản --"><option value="">-- Tất cả loại khoản --</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-kq="tt" data-ph="-- Tất cả tình trạng --"><option value="">-- Tất cả tình trạng --</option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('close', { text: 'Xóa lọc', mod: 'out-danger', attr: { 'data-kq': 'xoa' } }) + '</div>' +
                '</div>' +
                '<div data-kq="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-kq="' + k + '"]'); }
        ui.enhance(B);

        var tatCa = [], dang = [], trang = 1, co = 10;

        var COT = [
            { title: 'Mã số', render: function (r) { return ui.esc(pick(r, 'MASO', 'MaSo')); } },
            { title: 'Họ tên', render: function (r) { return ui.esc((e(pick(r, 'HODEM', 'HoDem')) + ' ' + e(pick(r, 'TEN', 'Ten'))).trim()); } },
            { title: 'Ngày mua', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pick(r, 'NGAYMUA_DD_MM_YYYY_HHMMSS', 'NgayMua_dd_mm_yyyy_hhmmss', 'NGAYMUA', 'NgayMua')); } },
            { title: 'Loại khoản', render: function (r) { return ui.esc(lkCua(r)); } },
            { title: 'Tình trạng', render: function (r) { return ui.esc(ttCua(r)); } },
            { title: 'Lý do không mua(nếu chọn không mua)', render: function (r) { return ui.esc(pick(r, 'LYDOKHONGMUA', 'LyDoKhongMua')); } },
            { title: 'Minh chứng', render: function (r) {
                var mc = pick(r, 'MINHCHUNG', 'MinhChung');
                if (!mc || /^\s*javascript:/i.test(mc)) return '';
                return '<a href="' + ui.esc(mc) + '" target="_blank" rel="noopener">Xem minh chứng</a>';
            } },
            { title: 'Số lượng', cls: 'is-center', render: function (r) { return ui.esc(soCua(r, 'SOLUONG', 'SoLuong')); } },
            { title: 'Đơn giá', cls: 'is-right is-nowrap', render: function (r) { return soTien(soCua(r, 'DONGIA', 'DonGia')); } },
            { title: 'Số tiền phải nộp', cls: 'is-right is-nowrap', render: function (r) { return soTien(soCua(r, 'SOTIEN_PHAINOP', 'SoTienPhaiNop')); } },
            { title: 'Số tiền đã nộp', cls: 'is-right is-nowrap', render: function (r) { return soTien(soCua(r, 'SOTIEN_DANOP', 'SoTienDaNop')); } },
            { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(pickArr(r, TEN_NGAYTAO)); } },
            { title: 'Người tạo', render: function (r) { return ui.esc(pickArr(r, TEN_NGUOITAO)); } }
        ];

        function ve() {
            var tong = dang.length;
            var tu = co === 'all' ? 0 : (trang - 1) * co;
            ui.table({
                el: q('bang'),
                rows: co === 'all' ? dang : dang.slice(tu, tu + co),
                columns: COT,
                empty: 'Không có dữ liệu',
                page: {
                    index: trang, size: co === 'all' ? tong || 1 : co, total: tong,
                    onChange: function (p) { trang = p; ve(); },
                    onSize: function (s) { co = s; trang = 1; ve(); }
                }
            });
        }

        function loc() {
            var kw = (q('q').value || '').toLowerCase().trim();
            var lk = q('lk').value || '', tt = q('tt').value || '';
            dang = tatCa.filter(function (r) {
                if (lk && lkCua(r) !== lk) return false;
                if (tt && ttCua(r) !== tt) return false;
                if (kw) {
                    var hodem = String(e(pick(r, 'HODEM', 'HoDem'))).toLowerCase();
                    var ten = String(e(pick(r, 'TEN', 'Ten'))).toLowerCase();
                    var cac = [String(e(pick(r, 'MASO', 'MaSo'))).toLowerCase(), (hodem + ' ' + ten).trim(), ten,
                        String(lkCua(r)).toLowerCase(), String(ttCua(r)).toLowerCase(), String(e(pick(r, 'LYDOKHONGMUA', 'LyDoKhongMua'))).toLowerCase()];
                    if (!cac.some(function (s) { return s.indexOf(kw) >= 0; })) return false;
                }
                return true;
            });
            trang = 1;
            ve();
        }

        function dsLoc(fn) {
            var m = {};
            tatCa.forEach(function (r) { var x = fn(r); if (x) m[x] = true; });
            return Object.keys(m).sort().map(function (k) { return { ID: k, TEN: k }; });
        }

        ums.api.call(goi('kqDS', {
            strTaiChinh_KH_MuaHang_Id: kh.ID,
            strQLSV_NguoiHoc_Id: '',
            strTaiChinh_CacKhoanThu_Id: '',
            strTinhTrangDangKy_Code: '',
            dHieuLuc: ''
        })).then(function (r) {
            tatCa = rowsOf(r);
            pat.fill(q('lk'), dsLoc(lkCua), { head: '-- Tất cả loại khoản --' });
            pat.fill(q('tt'), dsLoc(ttCua), { head: '-- Tất cả tình trạng --' });
            loc();
        }).catch(function (err) {
            q('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'kết quả đăng ký mua');
        });

        var hen = 0;
        B.addEventListener('input', function (ev) {
            if (ev.target !== q('q')) return;
            clearTimeout(hen);
            hen = setTimeout(loc, 300);
        });
        B.addEventListener('change', function (ev) {
            if (ev.target === q('lk') || ev.target === q('tt')) loc();
        });
        B.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-kq="xoa"]')) return;
            q('q').value = '';
            [q('lk'), q('tt')].forEach(function (s) {
                s.value = '';
                if (window.jQuery) jQuery(s).trigger('change.select2');
            });
            loc();
        });
    }
})();
