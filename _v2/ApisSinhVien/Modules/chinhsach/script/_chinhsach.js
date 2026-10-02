/* =========================================================================
   Chính sách người học — phần dùng chung của SÁU màn lưới "sinh viên × đối tượng"
   (bản gốc chép nhau gần từng dòng — cùng thanh lọc, cùng cách vẽ lưới, cùng Lưu):

       chinhsachdoituong · chinhsachphantram · chinhsachsotien     (bản "chính sách")
       tonghopdoituong   · tonghopphantram   · tonghopsotien       (bản "tổng hợp")

   Nạp từ html của từng màn: ../script/_chinhsach.js (+ ../css/_chinhsach.css)

   ums.svcs.man(root, cfg)
     cfg = {
       tieuDe       tiêu đề trang
       kieu         'dt' (ô đánh dấu + số tháng + "Gói hỗ trợ") · 'pt' (số tháng + phần trăm)
                    · 'st' (số tháng + số tiền) — bảng KIEU dưới đây giữ lời gọi của từng loại
       th           true = bản TỔNG HỢP: danh sách LayDSSV_TongHop_* phân trang máy chủ, bắt chọn đủ
                    ô trước khi tìm, cột người học đọc DAOTAO_* / QLSV_NGUOIHOC_*; false = bản CHÍNH
                    SÁCH: LayDSSV_ChinhSach_PhanTram (chỉ lọc theo lớp + trạng thái + từ khoá)
       nhieu        true = Hệ / Khoá / CT / Lớp / Học kỳ CHỌN NHIỀU (html gốc multiple)
       hang         thứ tự ô lọc theo html gốc: [['he','khoa','ct','lop'], ['hk','kieu','khoan','chedo'], …]
       nut          nút trên hàng lọc cuối: 'lop' Nhập theo lớp · 'kethua' Kế thừa · 'kethuaKhoa' Kế thừa
                    (khoá — gốc không có xử lý) · 'thongke' Thống kê khai > 1 đối tượng
       mau          màu nút chép gốc: { lop, kethua, kt: [nút theo tháng, nút theo kỳ] }
       baoCaoImport vùng báo cáo có vùng <zone>_Import (mẫu Import theo quyền) hay không
       importTinh   [{ ma, ten, chu }] — nút "Import ▾" viết cứng trong html gốc (.btnImportWithProce)
       xoa, xem     (pt) nút "Xóa" các dòng đã đánh dấu · nút "Xem" chính sách miễn của từng người học
     }

   Lời gọi (chép nguyên bản gốc; action kiểu cũ trừ chỗ có func):
     Lọc  pkg_kehoach_thongtin.* (edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinhDaoTao /
          LopQuanLy / ThoiGianDaoTao — KHÔNG lọc quyền, gốc gọi đúng các hàm này)
          CM_DanhMucDuLieu/LayDanhSach GET QLSV.TRANGTHAI · danh mục KHDT.DIEM.KIEUHOC, QLTC.CDCS
          TC_KhoanThu/LayDanhSach GET · SV_ChinhSach/LayDS_DoiTuong_CheDo GET (đối tượng của chế độ)
     Danh sách  SV_ChinhSach/LayDSSV_ChinhSach_PhanTram GET (chính sách, CẢ BA màn — gốc vậy)
                SV_ChinhSach/LayDSSV_TongHop_{DoiTuong|PhanTram|SoTien} GET (tổng hợp)
     Ô lưới     mỗi (người học × đối tượng) MỘT lời gọi như gốc (hàng đợi 6 luồng):
                dt SV_ChinhSach/LayKQChinhSach_DoiTuong GET · st SV_ChinhSach/LayKQChinhSach_SoTien GET
                pt SV_ChinhSach_MH/… PKG_HOSOSINHVIEN_CHINHSACH.LayKQChinhSach_PhanTram
     Lưu        dt TC_DoiTuong_NguoiHoc/ThemMoi | Xoa · st TC_SoTienMien/ThemMoi | Xoa
                pt TC_ThuChi_MH/… pkg_taichinh_thuchi.Them_TaiChinh_DT_MienGiam · TC_DoiTuong_MienGiam/Xoa
     Nhập theo lớp  SV_LopQuanLy/LayDanhSach GET · TC_DoiTuong_Lop_{NguoiHoc|MienGiam|TienMien}/ThemMoi
     Gói hỗ trợ (dt)  SV_KetQua_ChinhSach/LayDanhSach GET · SV_KetQua_ChinhSach/CapNhat
     Kế thừa (tổng hợp)  SV_ChinhSach/KeThua_DoiTuong_{Goi|PhanTram|SoTien}_{Thang|Ky} (gửi cả type=POST như gốc)
     Thống kê (tonghopphantram)  SV_ChinhSach_MH/… PKG_HOSOSINHVIEN_CHINHSACH.LayDSTongHopNhieuDoiTuong
     Xem / Xóa (pt)  … LayDSChinhSachMienSV · … Xoa_TaiChinh_DT_MienGiam
     Báo cáo  ums.report.mount (getList_MauImport — addKeyValue chung sáu màn)

   Khác bản gốc (chung):
     · Hệ → Khoá → CT → Lớp và Chế độ → Đối tượng: chưa chọn cha thì KHOÁ con, đổi / xoá cha thì xoá
       trắng con (luật cha → con). Gốc nạp sẵn mọi tầng lúc mở màn.
     · Lọc (học kỳ, kiểu học, khoản thu, chế độ) CHỤP LẠI lúc bấm Tìm kiếm và dùng cho cả nạp ô lẫn
       Lưu — gốc đọc lại ô lọc lúc Lưu (đổi học kỳ sau khi tìm rồi Lưu là ghi nhầm học kỳ).
     · Lưu chạy hàng loạt có tiến độ (ui.batch), xong nạp lại (gốc: báo từng dòng rồi nạp lại sau 1 giây).
     · Ô lỗi khi nạp ô lưới báo MỘT lần mỗi lượt (gốc nuốt lỗi); tìm lại / đổi trang giữa chừng thì bỏ lượt cũ.
   Cố ý bỏ (mã chết — không có ô / nút nào dùng tới):
     · TC_NguoiDungDaThuTien/LayDanhSach (đổ vào dropSearch_NguoiThu — không có ô này),
       KHCT_NamNhapHoc / KHCT_KhoaQuanLy (hàm có nhưng không nơi nào gọi), ẩn/hiện dropSearch_KyThucHien,
       resetCombobox (mục "" của ô chọn nhiều kiểu cũ), move_ThroughInTable (nhảy ô bằng phím).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var C = ums.svcs = ums.svcs || {};

    C.uid = function () { return (ums.session && ums.session.userId) || ''; };
    C.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    C.e = function (v) { return v === null || v === undefined ? '' : v; };
    C.arr = function (d) { return Array.isArray(d) ? d : []; };
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    function gop() {
        var r = {};
        Array.prototype.forEach.call(arguments, function (x) { Object.keys(x || {}).forEach(function (k) { r[k] = x[k]; }); });
        return r;
    }

    /* ---------- Bảng lời gọi theo loại màn -------------------------------- */
    var KIEU = {
        dt: {
            kq: { action: 'SV_ChinhSach/LayKQChinhSach_DoiTuong', method: 'GET' },
            them: { action: 'TC_DoiTuong_NguoiHoc/ThemMoi' },
            xoa: 'TC_DoiTuong_NguoiHoc/Xoa',
            lop: 'TC_DoiTuong_Lop_NguoiHoc/ThemMoi',
            dsTH: 'SV_ChinhSach/LayDSSV_TongHop_DoiTuong',
            keThua: 'SV_ChinhSach/KeThua_DoiTuong_Goi_',
            batBuoc: 'Bạn cần chọn đủ học kỳ và chế độ!'
        },
        pt: {
            nhan: 'Phần trăm hưởng', cot: 'PHANTRAMMIENGIAM', ts: 'dPhanTramMienGiam',
            kq: { action: 'SV_ChinhSach_MH/DSA4ChACKSgvKRIgIikeESkgLxUzICwP',
                  func: 'PKG_HOSOSINHVIEN_CHINHSACH.LayKQChinhSach_PhanTram', khoan: true, cheDo: true },
            them: { action: 'TC_ThuChi_MH/FSkkLB4VICgCKSgvKR4FFR4MKCQvBiggLAPP',
                    func: 'pkg_taichinh_thuchi.Them_TaiChinh_DT_MienGiam', khoan: true, cheDo: true },
            xoa: 'TC_DoiTuong_MienGiam/Xoa',
            lop: 'TC_DoiTuong_Lop_MienGiam/ThemMoi', lopNhan: 'Phần trăm miễn giảm',
            dsTH: 'SV_ChinhSach/LayDSSV_TongHop_PhanTram', khoan: true,
            keThua: 'SV_ChinhSach/KeThua_DoiTuong_PhanTram_',
            batBuoc: 'Bạn cần chọn đủ học kỳ, kiểu học, khoản thu và chế độ!'
        },
        st: {
            nhan: 'Số tiền', cot: 'SOTIEN', ts: 'dSoTien',
            kq: { action: 'SV_ChinhSach/LayKQChinhSach_SoTien', method: 'GET', khoan: true },
            them: { action: 'TC_SoTienMien/ThemMoi', khoan: true },
            xoa: 'TC_SoTienMien/Xoa',
            lop: 'TC_DoiTuong_Lop_TienMien/ThemMoi', lopNhan: 'Số tiền miễn giảm',
            dsTH: 'SV_ChinhSach/LayDSSV_TongHop_SoTien', khoan: true,
            keThua: 'SV_ChinhSach/KeThua_DoiTuong_SoTien_',
            batBuoc: 'Bạn cần chọn đủ học kỳ, kiểu học, khoản thu và chế độ!'
        }
    };
    C.KIEU = KIEU;

    /* Cột người học: bản chính sách (LayDSSV_ChinhSach_PhanTram) và bản tổng hợp (LayDSSV_TongHop_*)
       trả hai bộ tên cột khác nhau — chép nguyên genTable_TongHop / save_KetQua của từng bản. */
    var NGUOI = {
        cs: {
            he: 'HEDAOTAO', khoa: 'KHOADAOTAO', ct: 'CHUONGTRINH', kql: 'KHOAQUANLY', lop: 'LOP', ma: 'MASO',
            hoTen: function (r) { return C.e(r.HODEM) + ' ' + C.e(r.TEN); },
            nh: function (r) { return r.ID; }, ctId: function (r) { return r.CHUONGTRINH_ID; },
            lopId: function (r) { return r.LOP_ID; }, ttId: function (r) { return r.QLSV_NGUOIHOC_TRANGTHAI_ID; }
        },
        th: {
            he: 'DAOTAO_HEDAOTAO_TEN', khoa: 'DAOTAO_KHOADAOTAO_TEN', ct: 'DAOTAO_CHUONGTRINH_TEN', kql: 'KHOAQUANLY_TEN',
            lop: 'DAOTAO_LOPQUANLY_TEN', ma: 'QLSV_NGUOIHOC_MASO',
            hoTen: function (r) { return C.e(r.QLSV_NGUOIHOC_HODEM) + ' ' + C.e(r.QLSV_NGUOIHOC_TEN); },
            nh: function (r) { return r.QLSV_NGUOIHOC_ID; }, ctId: function (r) { return r.DAOTAO_TOCHUCCHUONGTRINH_ID; },
            lopId: function (r) { return r.DAOTAO_LOPQUANLY_ID; }, ttId: function (r) { return r.QLSV_TRANGTHAINGUOIHOC_ID; }
        }
    };

    /* ---------- Nút thả xuống "Import ▾" viết cứng trong html gốc ----------
       Cùng khung .ums-drop với ums.report (report.js đóng mọi .ums-drop khi bấm ra ngoài). */
    C.drop = function (text, icon, items) {
        return '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items.map(function (x, i) {
                return '<button type="button" class="ums-drop__item" role="menuitem" data-imp="' + i + '">' +
                    '<span class="ums-drop__no">' + (i + 1) + '.</span><span class="ums-drop__text">' + esc(x.chu) + '</span></button>';
            }).join('') + '</div></div>';
    };
    C.batDrop = function (tog) {
        var d = tog.closest('.ums-drop'), m = d.querySelector('.ums-drop__menu');
        var on = !d.classList.contains('is-open');
        d.classList.toggle('is-open', on);
        m.hidden = !on;
        tog.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    C.dongDrop = function (el) {
        var d = el.closest('.ums-drop');
        if (!d) return;
        d.classList.remove('is-open');
        d.querySelector('.ums-drop__menu').hidden = true;
    };

    /* =====================================================================
       Thanh lọc
       ===================================================================== */
    var NHAN = {
        he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp',
        hk: 'Tất cả học kỳ', kieu: 'Chọn kiểu học', khoan: 'Tất cả khoản thu', chedo: 'Chọn chế độ',
        dt: 'Chọn đối tượng chính sách'
    };

    /* Thanh lọc: khung chung ums.pat.boLocNguoiHoc (Hệ → Khoá → CT → Lớp, Học kỳ, trạng thái SV — gộp 2026-09-26,
       trước đây là bản tự viết thứ tư). Ở đây chỉ thêm các ô riêng của nhóm chính sách: kiểu học, khoản thu,
       chế độ → đối tượng, từ khoá. o.nhieu = true: Hệ/Khoá/CT/Lớp/Học kỳ chọn nhiều (như gốc từng màn). */
    C.boLoc = function (host, o) {
        o = o || {};
        function sel(k) {
            return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(NHAN[k]) + '"><option value=""></option></select></div>';
        }
        var rieng = { q: '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' };
        ['kieu', 'khoan', 'chedo', 'dt'].forEach(function (k) { rieng[k] = sel(k); });
        var L = pat.boLocNguoiHoc(host, { hang: o.hang, don: !o.nhieu, oRieng: rieng, nut: o.nut });
        var f = L.f, v = L.v;

        if (f('kieu')) {
            ums.api.dm('KHDT.DIEM.KIEUHOC').then(function (d) {
                pat.fill(f('kieu'), d, { head: pat.dmTitle(d) || NHAN.kieu });
            }).catch(loi('kiểu học'));
        }
        if (f('khoan')) {
            ums.api.call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
                strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1, strNhomCacKhoanThu_Id: '',
                strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '' })
                .then(function (r) { pat.fill(f('khoan'), C.arr(r.data), { name: 'TEN', head: NHAN.khoan }); })
                .catch(loi('khoản thu'));
        }

        /* ---- Chế độ → Đối tượng (getList_DoiTuong_CheDo, gọi lại mỗi lần chọn chế độ) ---- */
        var dsDoiTuong = [];
        function napDoiTuong() {
            if (!v('chedo')) { dsDoiTuong = []; pat.fill(f('dt'), [], { head: NHAN.dt }); return Promise.resolve(); }
            return ums.api.call({ action: 'SV_ChinhSach/LayDS_DoiTuong_CheDo', method: 'GET', silent: true,
                strChucNang_Id: C.cn(), strCheDoChinhSach_Id: v('chedo'), strDoiTuong_Id: '', strNguoiThucHien_Id: C.uid() })
                .then(function (r) {
                    dsDoiTuong = C.arr(r.data);
                    pat.fill(f('dt'), dsDoiTuong, { name: 'DOITUONG_TEN', head: NHAN.dt });
                }).catch(loi('đối tượng của chế độ'));
        }
        if (f('chedo')) {
            ums.api.dm('QLTC.CDCS').then(function (d) {
                pat.fill(f('chedo'), d, { head: pat.dmTitle(d) || NHAN.chedo });
            }).catch(loi('chế độ chính sách'));
            pat.chain([f('chedo'), f('dt')], { phatLai: false });
            jQuery(f('chedo')).on('select2:select select2:clear', napDoiTuong);
        }

        var tt = L.tt;

        function cheDoTen() {
            var el = f('chedo');
            return el && el.value && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : '';
        }

        return {
            f: f, v: v, tt: tt, cheDoTen: cheDoTen,
            doiTuong: function () { return dsDoiTuong; },
            q: function () { return f('q') ? (f('q').value || '').trim() : ''; },
            z: function (k) { return host.querySelector('[data-z="' + k + '"]'); }
        };
    };

    /* =====================================================================
       Màn lưới sinh viên × đối tượng
       ===================================================================== */
    C.man = function (root, cfg) {
        var K = KIEU[cfg.kieu], th = !!cfg.th, N = th ? NGUOI.th : NGUOI.cs, dt = cfg.kieu === 'dt';
        var mau = cfg.mau || {};
        var nut = cfg.nut || [];
        var coNut = function (k) { return nut.indexOf(k) >= 0; };

        /* Nút hàng lọc — thứ tự như html gốc */
        var h = '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>';
        if (coNut('kethua') || coNut('kethuaKhoa')) {
            h += '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Kế thừa', icon: 'fa-copy', mod: mau.kethua || 'save',
                attr: coNut('kethuaKhoa') ? { disabled: 'disabled', title: 'Bản gốc chưa có xử lý cho nút này' } : { 'data-a': 'kethua' } }) + '</div>';
        }
        if (coNut('thongke')) {
            h += '<div class="ums-field ums-field--fit">' + ui.btn('report', { text: 'Thống kê khai > 1 đối tượng', icon: 'fa-chart-column',
                mod: 'out-info', attr: { 'data-a': 'thongke' } }) + '</div>';
        }
        h += '<div class="ums-field ums-field--fit" data-z="bc"></div>';
        if (cfg.importTinh && cfg.importTinh.length) {
            h += '<div class="ums-field ums-field--fit">' + C.drop('Import', 'fa-cloud-arrow-up', cfg.importTinh) + '</div>';
        }
        if (coNut('lop')) {
            h += '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Nhập theo lớp', icon: 'fa-screen-users',
                mod: mau.lop || 'danger', attr: { 'data-a': 'lop' } }) + '</div>';
        }

        root.innerHTML = pat.page(cfg.tieuDe, '') +
            '<div data-z="loc"></div>' +
            '<div data-z="ds">' + pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
                tools: (cfg.xoa ? ui.xoaChon('input[data-ckx]', { attr: { 'data-a': 'xoa' }, goc: '[data-z="ds"]' }) : '') +
                    ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: ui.empty('Chọn điều kiện lọc rồi bấm Tìm kiếm', 'fa-magnifying-glass') }) + '</div>' +
            (coNut('lop') ? '<div data-z="lop" hidden>' +
                pat.panel({ title: 'Nhập cho nhiều lớp', icon: 'fa-screen-users',
                    tools: ui.btn('close', { attr: { 'data-a': 'lopdong' } }) + ui.btn('save', { attr: { 'data-a': 'lopluu' } }),
                    body: '<div class="ums-filter">' +
                        (dt ? '<div class="ums-field svcs-lopo">' + ui.field('Số tháng', '<input class="ums-input" data-lf="th" autocomplete="off">') + '</div>'
                            : '<div class="ums-field svcs-lopo">' + ui.field(K.lopNhan, '<input class="ums-input" data-lf="gt" autocomplete="off">') + '</div>' +
                              '<div class="ums-field svcs-lopo">' + ui.field('Số tháng miễn giảm', '<input class="ums-input" data-lf="th" autocomplete="off">') + '</div>') +
                        '</div>' }) +
                pat.panel({ title: 'Danh sách lớp', icon: 'fa-users-rectangle', count: 'nl', flush: true, zone: 'banglop' }) +
                '</div>' : '');
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

        var nutHtml = h;
        var loc = C.boLoc(z('loc'), { hang: cfg.hang, nhieu: cfg.nhieu, nut: nutHtml });

        /* ---- Báo cáo (getList_MauImport gốc — addKeyValue như nhau ở sáu màn) ----
           strKhoaQuanLy_Id: gốc đọc dropSearch_KhoaQuanLy — không có ô này → rỗng. */
        ums.report.mount(loc.z('bc'), {
            import: !!cfg.baoCaoImport,
            collect: function (add) {
                add('strTuKhoa', loc.q());
                add('strKhoaQuanLy_Id', '');
                add('strHeDaoTao_Id', loc.v('he'));
                add('strKhoaDaoTao_Id', loc.v('khoa'));
                add('strChuongTrinh_Id', loc.v('ct'));
                add('strLopQuanLy_Id', loc.v('lop'));
                add('strDaoTao_ThoiGianDaoTao_Id', loc.v('hk'));
                add('strTaiChinh_CacKhoanThu_Id', loc.v('khoan'));
                add('strDoiTuong_Id', loc.v('dt'));
                add('strCheDoChinhSach_Id', loc.v('chedo'));
            },
            onImported: function () { tim(trang); }
        });

        /* Tham số lọc chung của danh sách tổng hợp + kế thừa (getList_TongHop / KeThua_* gốc;
           strNamNhapHoc / strKhoaQuanLy_Id / strNguoiDangNhap_Id gốc đọc ô không tồn tại → rỗng) */
        function thamSoTH() {
            var p = {
                strTrangThaiNguoiHoc_Id: loc.tt.val(),
                strDaoTao_LopQuanLy_Id: loc.v('lop'),
                strNguoiThucHien_Id: C.uid(),
                strTuKhoa: loc.q(),
                strNamNhapHoc: '',
                strKhoaQuanLy_Id: '',
                strHeDaoTao_Id: loc.v('he'),
                strKhoaDaoTao_Id: loc.v('khoa'),
                strChuongTrinh_Id: loc.v('ct'),
                strLopQuanLy_Id: loc.v('lop'),
                strNguoiDangNhap_Id: ''
            };
            return p;
        }

        /* =================================================================
           Danh sách + lưới
           ================================================================= */
        var trang = 1, co = 10, luot = 0;
        var rows = [], dsDT = [], o = [], dang = null;

        function chup() {
            return { hk: loc.v('hk'), kieu: loc.v('kieu'), khoan: loc.v('khoan'), chedo: loc.v('chedo'),
                cheDoTen: loc.cheDoTen(), dt: loc.v('dt') };
        }

        function tim(p) {
            var d = chup();
            if (th && (!d.hk || !d.chedo || (K.khoan && (!d.kieu || !d.khoan)))) {
                ui.toast(K.batBuoc, 'warn');
                return;
            }
            trang = p || 1;
            luot++;
            dang = d;
            z('n').textContent = '';
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var call;
            if (th) {
                var ts = thamSoTH();
                if (K.khoan) { ts.strTaiChinh_CacKhoanThu_Id = d.khoan; ts.strKieuHoc_Id = d.kieu; }
                call = gop({ action: K.dsTH, method: 'GET', strChucNang_Id: C.cn() }, ts, {
                    strDaoTao_ThoiGianDaoTao_Id: d.hk, strCheDoChinhSach_Id: d.chedo, strDoiTuong_Id: d.dt,
                    pageIndex: trang, pageSize: co });
            } else {
                call = { action: 'SV_ChinhSach/LayDSSV_ChinhSach_PhanTram', method: 'GET',
                    strChucNang_Id: C.cn(), strTrangThaiNguoiHoc_Id: loc.tt.val(),
                    strDaoTao_LopQuanLy_Id: loc.v('lop'), strTuKhoa: loc.q(), strNguoiThucHien_Id: C.uid() };
            }
            var sh = luot;
            ums.api.call(call).then(function (r) {
                if (sh !== luot) return;
                ve(C.arr(r.data), th ? Number(r.pager) || 0 : 0);
            }).catch(function (err) {
                if (sh !== luot) return;
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách người học');
            });
        }

        function cotNguoi() {
            var g = ['Thông tin người học'];
            return [
                { title: 'Hệ đào tạo', prop: N.he, group: g, cls: 'is-nowrap' },
                { title: 'Khóa học', prop: N.khoa, group: g, cls: 'is-nowrap' },
                { title: 'Chương trình', prop: N.ct, group: g, cls: 'is-nowrap' },
                { title: 'Khoa quản lý', prop: N.kql, group: g, cls: 'is-nowrap' },
                { title: 'Lớp', prop: N.lop, group: g, cls: 'is-nowrap' },
                { title: 'Mã số', prop: N.ma, group: g, cls: 'is-nowrap' },
                { title: 'Họ tên', group: g, cls: 'is-nowrap', render: function (r) { return esc(N.hoTen(r)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', group: g, cls: 'is-center is-nowrap' }
            ];
        }

        function ve(rs, tong) {
            var sh = luot;
            rows = rs;
            /* genTable_TongHop gốc: đối tượng của chế độ, lọc theo ô Đối tượng (so cột ID) */
            dsDT = loc.doiTuong().filter(function (x) { return !dang.dt || String(x.ID) === String(dang.dt); });
            o = rs.map(function () { return dsDT.map(function () { return { id: '', th: '', gt: '' }; }); });

            var cot = [];
            if (cfg.xoa) {
                cot.push({ head: '<input type="checkbox" data-ckxall title="Chọn tất cả">', cls: 'is-center is-actions', width: '44px',
                    render: function (r, i) { return '<input type="checkbox" data-ckx="' + i + '">'; } });
            }
            if (cfg.xem) {
                cot.push({ title: 'Xem', cls: 'is-center is-actions',
                    render: function (r, i) { return ui.btn('view', { text: 'Xem', cls: 'ums-btn--sm', attr: { 'data-a': 'xem', 'data-i': i } }); } });
            }
            cot = cot.concat(cotNguoi());
            var cheDo = dang.cheDoTen || 'Chế độ';
            dsDT.forEach(function (d, j) {
                if (dt) {
                    cot.push({ group: [cheDo], cls: 'is-center is-nowrap',
                        head: esc(C.e(d.DOITUONG_TEN)) + '<br><input type="checkbox" data-cotall="' + j + '" title="Chọn cả cột">',
                        render: function (r, i) {
                            return '<div class="svcs-o"><input type="checkbox" data-cso="' + i + '|' + j + '">' +
                                '<input class="ums-input ums-input--sm" data-cs="' + i + '|' + j + '" data-t="th" placeholder="Số tháng" autocomplete="off">' +
                                '<a class="ums-link" href="javascript:void(0)" data-a="goi" data-i="' + i + '" data-j="' + j + '" hidden>| Gói hỗ trợ</a></div>';
                        } });
                } else {
                    var g = [cheDo, C.e(d.DOITUONG_TEN)];
                    cot.push({ title: 'Số tháng hưởng', group: g, cls: 'is-center',
                        render: function (r, i) { return '<input class="ums-input ums-input--sm svcs-so" data-cs="' + i + '|' + j + '" data-t="th" autocomplete="off">'; } });
                    cot.push({ title: K.nhan, group: g, cls: 'is-center',
                        render: function (r, i) { return '<input class="ums-input ums-input--sm svcs-so" data-cs="' + i + '|' + j + '" data-t="gt" autocomplete="off">'; } });
                }
            });

            ui.table({ el: z('bang'), rows: rs, columns: cot, empty: 'Không có dữ liệu',
                page: th ? { index: trang, size: co, total: tong,
                    onChange: function (p) { tim(p); },
                    onSize: function (s) { co = s; tim(1); } } : null });
            z('n').textContent = '(' + (th ? tong : rs.length) + ')';

            /* Mỗi ô một lời gọi như gốc — hàng đợi 6 luồng, bỏ lượt cũ */
            var viec = [], baoLoi = false;
            rs.forEach(function (r, i) {
                dsDT.forEach(function (d, j) {
                    viec.push(function () {
                        var p = gop({ action: K.kq.action, silent: true }, K.kq.func ? { func: K.kq.func } : { method: K.kq.method }, {
                            strChucNang_Id: C.cn(), strDaoTao_ChuongTrinh_Id: N.ctId(r), strQLSV_NguoiHoc_Id: N.nh(r),
                            strDaoTao_ThoiGianDaoTao_Id: dang.hk, strDoiTuong_Id: d.DOITUONG_ID });
                        if (K.kq.khoan) { p.strTaiChinh_CacKhoanThu_Id = dang.khoan; p.strKieuHoc_Id = dang.kieu; }
                        if (K.kq.cheDo) p.strCheDoChinhSach_Id = dang.chedo;
                        return ums.api.call(p).then(function (res) {
                            if (sh !== luot) return;
                            C.arr(res.data).forEach(function (x) { napO(i, j, x); });
                        }).catch(function (err) {
                            if (sh !== luot || baoLoi) return;
                            baoLoi = true;
                            ums.api.handle(err, 'kết quả chính sách của người học');
                        });
                    });
                });
            });
            var k = 0;
            function chay() {
                if (sh !== luot || k >= viec.length) return Promise.resolve();
                return viec[k++]().then(chay);
            }
            for (var n = 0; n < 6; n++) chay();
        }

        function oEl(i, j, t) { return z('bang').querySelector('[data-cs="' + i + '|' + j + '"][data-t="' + t + '"]'); }
        function oCk(i, j) { return z('bang').querySelector('[data-cso="' + i + '|' + j + '"]'); }

        /* getList_KetQua gốc: đổ giá trị ô + nhớ ID bản ghi và giá trị ban đầu */
        function napO(i, j, x) {
            var c = o[i] && o[i][j];
            if (!c) return;
            c.id = C.e(x.ID);
            c.th = String(C.e(x.SOTHANG));
            var a = oEl(i, j, 'th');
            if (a) a.value = c.th;
            if (dt) {
                var ck = oCk(i, j);
                if (ck) ck.checked = true;
                var g = z('bang').querySelector('[data-a="goi"][data-i="' + i + '"][data-j="' + j + '"]');
                if (g) g.hidden = false;
            } else {
                c.gt = String(C.e(x[K.cot]));
                var b = oEl(i, j, 'gt');
                if (b) b.value = c.gt;
            }
        }

        /* ---- Lưu (btnSaveChinhSach_PhanTram gốc) ---- */
        function goiThem(i, j) {
            var r = rows[i], d = dsDT[j], c = o[i][j];
            var thang = (oEl(i, j, 'th') || {}).value;
            var p = gop({ action: K.them.action }, K.them.func ? { func: K.them.func } : {}, {
                strId: c.id,
                strDaoTao_LopQuanLy_Id: N.lopId(r),
                strQLSV_TrangThaiNguoiHoc_Id: N.ttId(r),
                strDaoTao_ToChucCT_Id: N.ctId(r),
                strQLSV_NguoiHoc_Id: N.nh(r),
                strQLSV_DoiTuong_Id: d.DOITUONG_ID,
                strDaoTao_ThoiGianDaoTao_Id: dang.hk
            });
            if (dt) {
                if (!th) p.dSoThang = C.e(thang);         // bản tổng hợp gốc KHÔNG gửi số tháng
            } else {
                p[K.ts] = C.e((oEl(i, j, 'gt') || {}).value);
                p.dSoThang = C.e(thang);
                p.strDiem_KieuHoc_Id = dang.kieu;
                p.strTaiChinh_CacKhoanThu_Id = dang.khoan;
                if (K.them.cheDo) p.strDoiTuongChinhSach_Id = dang.chedo;
            }
            p.strNguoiThucHien_Id = C.uid();
            return p;
        }

        function luu() {
            if (!dang || !rows.length) { ui.toast('Không có thay đổi lưu', 'warn'); return; }
            var them = [], xoa = [];
            rows.forEach(function (r, i) {
                dsDT.forEach(function (d, j) {
                    var c = o[i][j];
                    if (dt) {
                        var ck = oCk(i, j);
                        if (!ck) return;
                        if (ck.checked) {
                            if (!c.id) them.push([i, j]);
                            /* bản chính sách: đổi số tháng của dòng đã có → ghi lại */
                            else if (!th && C.e((oEl(i, j, 'th') || {}).value) !== c.th) them.push([i, j]);
                        } else if (c.id) xoa.push(c.id);
                    } else {
                        var a = C.e((oEl(i, j, 'th') || {}).value), b = C.e((oEl(i, j, 'gt') || {}).value);
                        if (a === c.th && b === c.gt) return;
                        if (a === '' && b === '') { if (c.id) xoa.push(c.id); }
                        else them.push([i, j]);
                    }
                });
            });
            if (!them.length && !xoa.length) { ui.toast('Không có thay đổi lưu', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thêm ' + them.length + ' và hủy ' + xoa.length + '?', { ok: 'Lưu', title: 'Lưu thay đổi' })
                .then(function (ok) {
                    if (!ok) return;
                    var calls = xoa.map(function (id) { return { action: K.xoa, strIds: id, strNguoiThucHien_Id: C.uid() }; })
                        .concat(them.map(function (x) { return goiThem(x[0], x[1]); }));
                    ui.batch(calls, { title: 'Đang lưu', okText: 'Thực hiện thành công' }).then(function () { tim(trang); });
                });
        }

        /* ---- Xóa các dòng đã đánh dấu (pt — delete_KetQuaChinhSach gốc, strId = ID dòng) ---- */
        function xoaDong() {
            var ids = Array.prototype.slice.call(z('bang').querySelectorAll('input[data-ckx]:checked'))
                .map(function (x) { return rows[Number(x.getAttribute('data-ckx'))].ID; });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
                if (!ok) return;
                ui.batch(ids.map(function (id) {
                    return { action: 'SV_ChinhSach_MH/GS4gHhUgKAIpKC8pHgUVHgwoJC8GKCAs',
                        func: 'PKG_HOSOSINHVIEN_CHINHSACH.Xoa_TaiChinh_DT_MienGiam', strId: id, strNguoiThucHien_Id: C.uid() };
                }), { title: 'Đang xóa', okText: 'Thực hiện thành công' }).then(function () { tim(trang); });
            });
        }

        /* ---- "Xem" (pt — getList_QuanSoTheoLop gốc: chính sách miễn của người học) ---- */
        function xem(r) {
            var dlg = ui.dialog({ title: 'Danh sách', icon: 'fa-list-ul', size: 'xl',
                body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var host = dlg.body.querySelector('[data-x="bang"]');
            ums.api.call({ action: 'SV_ChinhSach_MH/DSA4BRICKSgvKRIgIikMKCQvEhcP', func: 'PKG_HOSOSINHVIEN_CHINHSACH.LayDSChinhSachMienSV',
                strQLSV_NguoiHoc_Id: C.e(r.QLSV_NGUOIHOC_ID), strNguoiThucHien_Id: C.uid() })
                .then(function (res) {
                    ui.table({ el: host, rows: C.arr(res.data), empty: 'Không có dữ liệu', columns: [
                        { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                        { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                        { title: 'Chế độ', prop: 'CHINHSACH_TEN' },
                        { title: 'Đối tượng', render: function (x) { return esc(C.e(x.DOITUONG_TEN) + '(' + C.e(x.DOITUONG_MA) + ')'); } },
                        { title: 'Thời gian', prop: 'THOIGIAN' },
                        { title: 'Số tháng', prop: 'SOTHANG', cls: 'is-center' },
                        { title: 'Phần trăm', prop: 'PHANTRAMMIENGIAMDUYET', cls: 'is-center' },
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN', cls: 'is-nowrap' },
                        { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                        { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' }
                    ] });
                })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chính sách miễn của người học'); });
        }

        /* ---- "Gói hỗ trợ" (dt — getList_KetQuaSinhVien / save_KetQuaSinhVien gốc) ----
           Lưới sửa nhiều bản ghi của MỘT người học × đối tượng — mở NGAY TRONG TRANG, thay chỗ màn (ums.pat.formTrang, BO-CUC luật 1;
           gốc là modal, trước 2026-09-30 bản mới cũng bật hộp thoại). Nút Lưu nay ở lại tới khi lô chạy xong: không lỗi mới đóng,
           có dòng lỗi thì GIỮ biểu mẫu để không mất ô đang nhập (trước đó hộp đóng ngay khi bấm, lô còn chưa chạy). */
        function goiHoTro(i, j) {
            var r = rows[i], d = dsDT[j], ds = [];
            var dlg = pat.formTrang({ host: root, title: 'Chỉnh sửa - Gói hỗ trợ', icon: 'fa-hand-holding-heart', cols: 1,
                body: '<div class="svcs-goi">' + esc(C.e(r.TAICHINH_CS_GOIHOTRO_TEN) + ' - ' + N.hoTen(r) + ' - ' + C.e(r[N.ma])) + '</div>' +
                    '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                    if (!ds.length) return;
                    var host = api.body;
                    ui.batch(ds.map(function (x, k) {
                        function g(t) { var el = host.querySelector('[data-g="' + t + '"][data-k="' + k + '"]'); return el ? el.value : ''; }
                        return { action: 'SV_KetQua_ChinhSach/CapNhat', strId: x.ID, strTaiChinh_DT_NguoiHoc_Id: '',
                            dSoTien: pat.num(g('tien')), strNgayApDung: g('ngay'), strGhiChu: g('gc'), strNguoiThucHien_Id: C.uid() };
                    }), { title: 'Đang cập nhật', okText: 'Cập nhật thành công' }).then(function (kq) {
                        if (!kq || !kq.fail) api.close();
                    });
                    return false;
                } }] });
            var host = dlg.body.querySelector('[data-x="bang"]');
            ums.api.call({ action: 'SV_KetQua_ChinhSach/LayDanhSach', method: 'GET',
                strQLSV_NguoiHoc_Id: N.nh(r), strDaoTao_ThoiGianDaoTao_Id: dang.hk, strDoiTuong_Id: d.DOITUONG_ID })
                .then(function (res) {
                    ds = C.arr(res.data);
                    ui.table({ el: host, rows: ds, empty: 'Không có dữ liệu', columns: [
                        { title: 'Khoản trợ cấp', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                        { title: 'Số tiền theo quy định', cls: 'is-right is-nowrap', render: function (x) { return esc(pat.money(x.SOTIENTHEOCHINHSACH)); } },
                        { title: 'Số tiền thực nhận', width: '150px', render: function (x, k) {
                            return '<input class="ums-input ums-input--sm is-right" data-g="tien" data-k="' + k + '" value="' + esc(pat.money(x.SOTIEN)) + '" autocomplete="off">'; } },
                        { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO_HOCKY', cls: 'is-center' },
                        { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
                        { title: 'Ngày áp dụng', width: '140px', render: function (x, k) {
                            return '<input class="ums-input ums-input--sm" data-date data-g="ngay" data-k="' + k + '" value="' + esc(C.e(x.NGAYAPDUNG)) + '" autocomplete="off">'; } },
                        { title: 'Đối tượng', prop: 'DOITUONG_TEN' },
                        { title: 'Chế độ', prop: 'CHEDOCHINHSACH_TEN' },
                        { title: 'Ghi chú', render: function (x, k) {
                            return '<input class="ums-input ums-input--sm" data-g="gc" data-k="' + k + '" value="' + esc(C.e(x.GHICHU)) + '" autocomplete="off">'; } }
                    ] });
                    ui.enhance(host);
                })
                .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'gói hỗ trợ của người học'); });
        }

        /* ---- Kế thừa (tổng hợp — btnSave_KeThua / btnSave_KeThua_Nam gốc) ---- */
        function keThua() {
            var kt = mau.kt || ['primary', 'save'];
            var dlg = ui.dialog({ title: 'Kế thừa', icon: 'fa-copy', size: 'sm',
                body: '<div class="ums-grid">' +
                    ui.field('Năm', '<input class="ums-input" data-k="nam" autocomplete="off">') +
                    ui.field('Tháng', '<input class="ums-input" data-k="thang" autocomplete="off">') +
                    '<div class="ums-row ums-row--end">' + ui.btn('save', { text: 'Kế thừa theo tháng', mod: kt[0], attr: { 'data-kt': 'Thang' } }) + '</div>' +
                    ui.field('Năm', '<input class="ums-input" data-k="nam2" autocomplete="off">') +
                    ui.field('Kỳ', '<input class="ums-input" data-k="ky" autocomplete="off">') +
                    ui.field('Đợt học', '<input class="ums-input" data-k="dot" autocomplete="off">') +
                    '<div class="ums-row ums-row--end">' + ui.btn('save', { text: 'Kế thừa theo kỳ, đợt', mod: kt[1], attr: { 'data-kt': 'Ky' } }) + '</div>' +
                    '</div>' });
            dlg.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-kt]');
                if (!b) return;
                var kieu = b.getAttribute('data-kt');
                function g(k) { return (dlg.body.querySelector('[data-k="' + k + '"]').value || '').trim(); }
                var them = kieu === 'Thang' ? { dNamHoc: g('nam'), dThang: g('thang') }
                    : { dNamHoc: g('nam2'), dHocKy: g('ky'), dDotHoc: g('dot') };
                dlg.close();
                ui.confirm('Bạn có muốn kế thừa không?', { ok: 'Kế thừa', title: 'Kế thừa' }).then(function (ok) {
                    if (!ok) return;
                    var p = gop({ action: K.keThua + kieu, type: 'POST' }, thamSoTH(), {
                        strTaiChinh_CacKhoanThu_Id: loc.v('khoan'), strKieuHoc_Id: loc.v('kieu'),
                        strDaoTao_ThoiGianDaoTao_Id: loc.v('hk'), strCheDoChinhSach_Id: loc.v('chedo'), strDoiTuong_Id: loc.v('dt')
                    }, them);
                    ums.api.call(p).then(function () { ui.toast('Kế thừa thành công', 'ok'); })
                        .catch(function (err) { ums.api.handle(err, 'kế thừa'); });
                });
            });
        }

        /* ---- Thống kê khai > 1 đối tượng (tonghopphantram — getList_ThongKeNhieuDoiTuong gốc).
           Gốc đổi ô rỗng thành null (toNullIfEmpty); jQuery gửi null thành chuỗi rỗng → gửi ''. ---- */
        function pick(x, keys) {
            for (var i = 0; i < keys.length; i++) { if (x && x[keys[i]] != null && x[keys[i]] !== '') return x[keys[i]]; }
            return '';
        }
        function thongKe() {
            var d = chup();
            if (!d.hk || !d.kieu || !d.chedo || !d.khoan) { ui.toast(K.batBuoc, 'warn'); return; }
            ums.api.call({ action: 'SV_ChinhSach_MH/DSA4BRIVLi8mCS4xDykoJDQFLigVNC4vJgPP', func: 'PKG_HOSOSINHVIEN_CHINHSACH.LayDSTongHopNhieuDoiTuong',
                strTrangThaiNguoiHoc_Id: loc.tt.val(), strDaoTao_ThoiGianDaoTao_Id: d.hk, strHeDaoTao_Id: loc.v('he'),
                strKhoaDaoTao_Id: loc.v('khoa'), strKhoaQuanLy_Id: '', strChuongTrinh_Id: loc.v('ct'), strLopQuanLy_Id: loc.v('lop'),
                strTaiChinh_CacKhoanThu_Id: d.khoan, strKieuHoc_Id: d.kieu, strCheDoChinhSach_Id: d.chedo, strNguoiThucHien_Id: C.uid() })
                .then(function (res) {
                    var dlg = ui.dialog({ title: 'Thống kê khai > 1 đối tượng', icon: 'fa-chart-column', size: 'xl', body: '<div data-x="bang"></div>' });
                    /* Tên cột chưa chốt — gốc dò lần lượt nhiều tên (giữ nguyên danh sách dò) */
                    ui.table({ el: dlg.body.querySelector('[data-x="bang"]'), rows: C.arr(res.data), empty: 'Không có dữ liệu', columns: [
                        { title: 'Mã số', cls: 'is-nowrap', render: function (x) { return esc(pick(x, ['QLSV_NGUOIHOC_MASO', 'MASO', 'NGUOIHOC_MASO'])); } },
                        { title: 'Họ tên', cls: 'is-nowrap', render: function (x) {
                            var ht = pick(x, ['QLSV_NGUOIHOC_HOTEN', 'HOTEN', 'NGUOIHOC_HOTEN']);
                            if (ht === '') ht = (C.e(pick(x, ['QLSV_NGUOIHOC_HODEM', 'HODEM'])) + ' ' + C.e(pick(x, ['QLSV_NGUOIHOC_TEN', 'TEN']))).trim();
                            return esc(ht); } },
                        { title: 'Lớp', render: function (x) { return esc(pick(x, ['DAOTAO_LOPQUANLY_TEN', 'LOP_TEN', 'LOPQUANLY_TEN', 'LOP'])); } },
                        { title: 'Chương trình', render: function (x) { return esc(pick(x, ['DAOTAO_CHUONGTRINH_TEN', 'CHUONGTRINH_TEN', 'CHUONGTRINH'])); } },
                        { title: 'Số đối tượng', cls: 'is-center', render: function (x) { return esc(pick(x, ['SO_DOITUONG', 'SODOITUONG', 'SLDOITUONG', 'SOLUONGDOITUONG', 'DOITUONG_SOLUONG'])); } },
                        { title: 'Danh sách đối tượng', render: function (x) { return esc(pick(x, ['DS_DOITUONG', 'DSDOITUONG', 'DOITUONG_DS', 'DOITUONG_TEN', 'DS_DOITUONG_TEN'])); } }
                    ] });
                })
                .catch(function (err) { ums.api.handle(err, 'thống kê khai nhiều đối tượng'); });
        }

        /* =================================================================
           Nhập cho nhiều lớp (zone_nhapchonhieulop gốc)
           ================================================================= */
        var dsLop = [];
        function moLop() {
            ui.swap(z('ds'), z('lop'));
            z('nl').textContent = '';
            z('banglop').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'SV_LopQuanLy/LayDanhSach', method: 'GET', strChucNang_Id: C.cn(),
                strDaoTao_HeDaoTao_Id: loc.v('he'), strDaoTao_KhoaDaoTao_Id: loc.v('khoa'), strDaoTao_ChuongTrinh_Id: loc.v('ct'),
                strDaoTao_LopQuanLy_Id: loc.v('lop'), strNguoiThucHien_Id: C.uid() })
                .then(function (r) {
                    dsLop = C.arr(r.data);
                    z('nl').textContent = '(' + dsLop.length + ')';
                    ui.table({ el: z('banglop'), rows: dsLop, empty: 'Không có dữ liệu', columns: [
                        { title: 'Tên lớp', prop: 'TEN', cls: 'is-nowrap' },
                        { title: 'Chương trình', prop: 'CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'KHOADAOTAO_TEN', cls: 'is-nowrap' },
                        { title: 'Khoa', prop: 'KHOAQUANLY_TEN' },
                        { title: 'Hệ', prop: 'HEDAOTAO_TEN' },
                        { title: 'Số SV', prop: 'SOSVDANGHOC', cls: 'is-center' },
                        { head: '<input type="checkbox" data-lopall title="Chọn tất cả">', cls: 'is-center is-actions', width: '44px',
                            render: function (x, i) { return '<input type="checkbox" data-lop="' + i + '">'; } }
                    ] });
                })
                .catch(function (err) { z('banglop').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp'); });
        }
        function luuLop() {
            var chon = Array.prototype.slice.call(z('banglop').querySelectorAll('input[data-lop]:checked'))
                .map(function (x) { return dsLop[Number(x.getAttribute('data-lop'))]; });
            if (!chon.length) { ui.toast('Vui lòng chọn lớp', 'warn'); return; }
            function g(k) { var el = z('lop').querySelector('[data-lf="' + k + '"]'); return el ? (el.value || '').trim() : ''; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { ok: 'Lưu', title: 'Nhập cho nhiều lớp' }).then(function (ok) {
                if (!ok) return;
                /* save_KetQua_Lop gốc: strId đọc txtAAAA (không có ô) → rỗng; lọc đọc lại lúc lưu như gốc */
                ui.batch(chon.map(function (l) {
                    var p = { action: K.lop, strId: '', strDaoTao_LopQuanLy_Id: l.ID, strQLSV_DoiTuong_Id: loc.v('dt'),
                        strDaoTao_ThoiGianDaoTao_Id: loc.v('hk') };
                    if (!dt) {
                        p[K.ts] = g('gt');
                        p.dSoThang = g('th');
                        p.strDiem_KieuHoc_Id = loc.v('kieu');
                        p.strTaiChinh_CacKhoanThu_Id = loc.v('khoan');
                    } else p.dSoThang = g('th');
                    p.strNguoiThucHien_Id = C.uid();
                    return p;
                }), { title: 'Đang lưu', okText: 'Thêm mới thành công' });
            });
        }

        /* ---- Sự kiện ---- */
        root.addEventListener('click', function (ev) {
            var t = ev.target, b;
            if ((b = t.closest('.ums-drop__toggle')) && b.closest('[data-z="loc"]') && !b.closest('[data-z="bc"]')) { C.batDrop(b); return; }
            if ((b = t.closest('[data-imp]'))) {
                C.dongDrop(b);
                var x = cfg.importTinh[Number(b.getAttribute('data-imp'))];
                ums.report.importChung(x.ten, x.ma, { onDone: function () { tim(trang); } });
                return;
            }
            if (t.matches && t.matches('input[data-ckxall]')) {
                Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ckx]'), function (x) { x.checked = t.checked; });
                return;
            }
            if (t.matches && t.matches('input[data-lopall]')) {
                Array.prototype.forEach.call(z('banglop').querySelectorAll('input[data-lop]'), function (x) { x.checked = t.checked; });
                return;
            }
            if (t.matches && t.matches('input[data-cotall]')) {
                var j = t.getAttribute('data-cotall');
                Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-cso$="|' + j + '"]'), function (x) { x.checked = t.checked; });
                return;
            }
            if (!(b = t.closest('[data-a]')) || !root.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tim(1);
            else if (a === 'luu') luu();
            else if (a === 'xoa') xoaDong();
            else if (a === 'xem') xem(rows[Number(b.getAttribute('data-i'))]);
            else if (a === 'goi') goiHoTro(Number(b.getAttribute('data-i')), Number(b.getAttribute('data-j')));
            else if (a === 'kethua') keThua();
            else if (a === 'thongke') thongKe();
            else if (a === 'lop') moLop();
            else if (a === 'lopdong') ui.swap(z('lop'), z('ds'));
            else if (a === 'lopluu') luuLop();
        });
        /* Bản chính sách (dt): gõ số tháng thì tự đánh dấu ô, xoá trắng thì bỏ đánh dấu (.sothang change gốc) */
        if (dt && !th) {
            root.addEventListener('change', function (ev) {
                var t = ev.target;
                if (!t.matches || !t.matches('input[data-cs][data-t="th"]')) return;
                var ck = z('bang').querySelector('[data-cso="' + t.getAttribute('data-cs') + '"]');
                if (ck) ck.checked = t.value !== '';
            });
        }
        loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(1); } });

        return { tim: tim, loc: loc };
    };
})();
