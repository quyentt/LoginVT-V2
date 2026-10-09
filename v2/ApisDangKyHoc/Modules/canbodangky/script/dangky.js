/* =========================================================================
   Cán bộ đăng ký cho sinh viên (cán bộ đăng ký học THAY sinh viên)
   Bản gốc: ApisDangKyHoc/Modules/canbodangky/html/dangky.html + script/dangky.js (vỏ indexi).
   (script/dangky1.js cùng thư mục là bản cũ, html không nạp — không chuyển.)
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — hai vùng thay chỗ nhau (zone-bus):
     1. "zonebatdau" — MỘT cột: bộ lọc Hệ · Khoá · Chương trình · Lớp / Định hướng · Nhóm định
        hướng · từ khoá · Tìm kiếm · Import ▾; "Chọn trạng thái sinh viên"; khung "Danh sách sinh
        viên (n)" với Xóa dữ liệu import · Đăng ký · Tìm theo import; bảng có ô đánh dấu + cột "Kết quả".
     2. "zonehocphan" — HAI cột (col-lg-3 | col-lg-9), cùng khung với Cổng SV › Đăng ký học:
        trái: người học + Số dư · Số phát sinh · Tổng lớp đã đăng ký · Số tín chỉ…; "Bộ lọc tìm
        kiếm" (Giảng viên, Thứ học, Phương án đăng ký, Lọc trùng, Xuất báo cáo, Tìm kiếm);
        phải: Chương trình đào tạo (nút Đóng) → Kế hoạch (+ thời gian) → Học phần → Lớp học phần.
     "zonechonmonhocphan" (chọn đủ nhóm lớp) và "zoneketquahocphan" (kết quả) → HỘP, đúng như bản
     Cổng SV đã chuyển (_v2/ApisCongSinhVien/Modules/dangkyhoc/script/dangky.js).
   Dùng lại tầng Cổng SV: ums.dky (the / theHtml / nut / ketQua / lich / xorB64 / uuid) —
   ApisCongSinhVien/Modules/dangkyhoc/script/_dangky.js + css/_dangky.css (nạp chéo, KHÔNG sửa).

   Lời gọi (action kiểu cũ, không func — chép nguyên; "type": "GET" của gốc gửi cả khoá type):
     SV_HoSoHocVien_MH · pkg_hosohocvien.LayDanhSachHoSo        danh sách SV (dLocTheoDuLieuImport -1 | 1)
     KHCT_ThongTin_MH  · pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong · KHCT_ThongTin2_MH · pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom
     Hệ/Khoá/CT/Lớp: edu.system.getList_* (KHÔNG lọc quyền) → ums.ref.cascade (tự khoá tầng dưới).
     DKH_Chung/LayDSChuongTrinh · LayDSKeHoachDangKyHoc · LayDSHocPhanDangToChuc · LayDSLopHocPhanDangToChuc
       (lớp chính: dLaLopHocPhanChinh 1 → { rs, rsNhomKiemSoat }; nhóm lớp: -1 + strMaNhomLop →
       { rs, rsThuocTinhLopHocPhan }; đổi lịch: theo dòng kết quả) · LayKetQuaDangKyLopHocPhan ·
       LayGiangVienTheoHocPhan · LayThuHocTheoHocPhan · LayLichTuanTheoLopHocPhan · LayDSLopHocPhanTheoNhomKS
       (khoá strNguoiThucHien_ID viết HOA như gốc)
     TC_ThongTin/LayDSTinhTrangTaiChinhDKH  (Id = số dư; rsConPhaiNopTrongDotDK / rsConPhaiNopHienTai / rsConDuHienTai)
     GHI — { strVal: edu.system.atob(JSON, "chaolong") } (ums.dky.xorB64), JSON có action:
       DKH_DangKyMH/DangKyHocTrucTiep · ThucHienHuyDangKyHoc · ThucHienDoiLichDangKyHoc
     DKH_Import/Xoa_DangKy_NguoiHoc_Import  nút "Xóa dữ liệu import"
     Import: hai mục viết tay (btnImportWithProce → showImportChungV2) IMPORTWITHPROC_DANGKY_NGUOIHOC
       "Người học" · IMPORTWITHPROC_DKLHP "lớp học phần" → ums.report.importChung.
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_DangKyHoc") ở khung lọc cột trái,
       import: false (mục import viết tay đã ở vùng 1; gốc: mẫu import theo quyền — nếu có — vẽ đè
       lên nút Import viết tay đó).
   Đăng ký nhiều SV ("Đăng ký" với N dòng đánh dấu): mỗi SV một lời gọi DangKyHocTrucTiep với
     strQLSV_NguoiHoc_Id = ID dòng, strDaoTao_ChuongTrinh_Id = NGANH_ID dòng (gốc cắt chuỗi
     "ID_NGANH_ID" của ô đánh dấu — cùng giá trị); các tham số khác theo SV ĐẦU đang hiện.
   Khác gốc (sửa lỗi / cách làm):
     · Kết quả từng SV ghi vào cột "Kết quả" (gốc ghi vào span id "lblKetQuaDangKy<ID>_<NGANH>" không
       tồn tại → không bao giờ hiện, chỉ bật N hộp thông báo chồng nhau). Xong báo gộp một lần.
     · "Đã đăng ký HP" (khoá nút) khi đăng ký cho MỘT SV — gốc chỉ khoá khi đúng 1 ô đang đánh dấu,
       nên mở từ mã số (0 ô đánh dấu) thì học phần đã đăng ký vẫn bấm được.
     · Phân trang danh sách giữ chế độ "Tìm theo import" (gốc sang trang là mất cờ dLocTheoDuLieuImport).
     · "Xóa dữ liệu import" hỏi lại trước khi xoá (gốc xoá ngay, không hỏi) và nạp lại danh sách.
     · Hộp chọn nhóm lớp: tự chọn lớp đầu tiên CÒN CHỖ của mỗi nhóm (gốc so nhầm biến aData của
       vòng lặp trước → chọn sai / không chọn); bỏ chữ nháp "(text ở trung tâm nhé)".
     · Bỏ trễ 500 ms trước mỗi lần nạp; thẻ rê chuột (popover) → ums.ui.hoverCard + bấm mở hộp.
     · Đổi lịch / Hủy xong nạp lại hộp kết quả đang mở.
   Giữ như gốc, cần kiểm: đổi lịch lớp thuộc NHÓM đẩy ID lớp đang đổi cho mọi lớp cùng nhóm (như bản
     Cổng SV); đăng ký thành công chỉ khi máy chủ trả Id; đăng ký theo nhóm chờ SOGIAYCHO giây (runAA).
   Bỏ (mã chết): bSinhVien (luôn false), toggle_detail, viewForm_HS, rdLoaiHienThi / "Gói đăng ký" (ẩn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, D = ums.dky;
    var root = document.getElementById('dkh-cbdangky');
    if (!root || !D) return;
    var e = D.e, arr = D.arr, uid = D.uid;
    function esc(s) { return ui.esc(e(s)); }

    var DC = 'DKH_Chung/';
    var IMP = [{ ma: 'IMPORTWITHPROC_DANGKY_NGUOIHOC', ten: 'Người học', chu: '1. Người học' },
               { ma: 'IMPORTWITHPROC_DKLHP', ten: 'lớp học phần', chu: '2. Đăng ký theo lớp học phần' }];

    /* ================= VÙNG 1 — danh sách sinh viên ====================== */
    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select></div>'; }
    var vung1 =
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
                sel('dh', 'Chọn định hướng') + sel('nhomdh', 'Chọn nhóm định hướng') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timsv' } }) + '</div>' +
                '<div class="ums-field ums-field--fit"><div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
                    '<i class="fa-light fa-cloud-arrow-up"></i><span>Import</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
                    '<div class="ums-drop__menu" role="menu" hidden>' + IMP.map(function (x, i) {
                        return '<button type="button" class="ums-drop__item" role="menuitem" data-imp="' + i + '"><span class="ums-drop__text">' + esc(x.chu) + '</span></button>';
                    }).join('') + '</div></div></div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach"><i class="fa-light fa-user-graduate"></i> Chọn trạng thái sinh viên</div><div data-z="tt"></div>' }) +
        pat.panel({ title: 'Danh sách sinh viên', icon: 'fa-address-book', count: 'nSV', flush: true, zone: 'sv',
            tools: ui.btn('del', { text: 'Xóa dữ liệu import', attr: { 'data-a': 'xoaimport', 'data-khong-chon': '1' } }) +
                ui.btn('confirm', { text: 'Đăng ký', mod: 'primary', icon: 'fa-user-pen', attr: { 'data-a': 'dangky' } }) +
                ui.btn('search', { text: 'Tìm theo import', mod: 'out-primary', attr: { 'data-a': 'timimport' } }) });

    /* ================= VÙNG 2 — đăng ký (hai cột) ======================== */
    function muc(icon, chu, z, cls) {
        return '<i class="fa-light ' + icon + '"></i><span>' + esc(chu) + '</span><b class="' + (cls || '') + '" data-z="' + z + '"></b>';
    }
    var trai =
        pat.panel({ title: false, body:
            '<div class="dky-sv"><div class="dky-sv__anh" data-z="anh"><i class="fa-light fa-user"></i></div>' +
            '<div class="dky-sv__ten"><b data-z="ten"></b><span>Mã số: <span data-z="ma"></span></span></div></div>' +
            '<ul class="dky-tt">' +
            '<li><button type="button" class="dky-tt__nut" data-a="taichinh" data-loai="du">' + muc('fa-sack-dollar', 'Số dư tài khoản hiện tại:', 'soDu', 'dky-xanh') + '</button></li>' +
            '<li><button type="button" class="dky-tt__nut" data-a="taichinh" data-loai="ps">' + muc('fa-money-from-bracket', 'Số phát sinh thêm trong đợt:', 'phatSinh', 'dky-cam') + '</button></li>' +
            '<li><button type="button" class="dky-tt__nut" data-a="ketqua">' + muc('fa-screen-users', 'Tổng lớp đã đăng ký:', 'soLop') + '</button></li>' +
            '<li>' + muc('fa-book-open-reader', 'Số tín chỉ đã đăng ký:', 'tcDaDK') + '</li>' +
            '<li>' + muc('fa-album-collection-circle-user', 'Số tín chỉ tối đa', 'tcMax') + '</li>' +
            '<li>' + muc('fa-rectangle-history-circle-user', 'Số tín chỉ tối thiểu:', 'tcMin') + '</li>' +
            '</ul>' }) +
        pat.panel({ title: 'Bộ lọc tìm kiếm', icon: 'fa-magnifying-glass', body:
            '<div class="dky-loc"><h5 class="dky-loc__tieu">Giảng viên</h5><div class="ums-checklist" data-z="gv"></div></div>' +
            '<div class="dky-loc"><h5 class="dky-loc__tieu">Thứ học</h5><div class="ums-checklist" data-z="thu"></div></div>' +
            '<div class="dky-loc"><h5 class="dky-loc__tieu">Phương án đăng ký</h5><div class="dky-pa" data-z="pa"></div></div>' +
            '<div class="dky-loc"><label class="ums-check"><input type="checkbox" data-f="locTrung"><span><b>Lọc trùng</b></span></label></div>' +
            '<div class="dky-loc dky-loc__nut"><span data-z="report"></span>' + ui.btn('search', { attr: { 'data-a': 'timlop' } }) + '</div>' });
    var phai =
        pat.panel({ title: 'Chương trình đào tạo', icon: 'fa-graduation-cap', zone: 'ctdt', tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) +
        pat.panel({ title: 'Kế hoạch', icon: 'fa-calendar-check', body: '<div data-z="kh"></div><div class="dky-thoigian" data-z="tg"></div>' }) +
        pat.panel({ title: 'Học phần', icon: 'fa-book', body: '<div class="dky-hp" data-z="hp"></div>' }) +
        pat.panel({ title: 'Lớp học phần', icon: 'fa-chalkboard-user', zone: 'lhp', flush: true, count: 'nLhp' });

    root.innerHTML = pat.page('Cán bộ đăng ký cho sinh viên', '') +
        '<div data-v="1">' + vung1 + '</div>' +
        '<div data-v="2" hidden><div class="ums-master dky"><aside class="ums-master__side">' + trai + '</aside><div class="ums-master__main">' + phai + '</div></div></div>';
    ui.enhance(root.querySelector('[data-v="1"]'));
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    function dat(k, v) { z(k).textContent = e(v); }
    function dangTai(el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function danhDau(host) { return Array.prototype.map.call(host.querySelectorAll('input:checked'), function (x) { return x.value; }).join(','); }
    function moVung(k) {
        var cu = vung(k === 1 ? 2 : 1), moi = vung(k);
        if (!moi.hidden) return;
        ui.swap(cu, moi);
    }

    /* ---------- Danh sách SV (getList_HSSV / genTable_HSSV) --------------- */
    var L = { ds: [], trang: 1, co: 10, tong: 0, imp: -1, kq: {} };
    var trangThai = pat.checks(z('tt'), ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 });
    function taiSV() {
        dangTai(z('sv'));
        ums.api.call({
            action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu', func: 'pkg_hosohocvien.LayDanhSachHoSo',
            strTuKhoa: (f('q').value || '').trim(),
            strHeDaoTao_Id: f('he').value, strKhoaDaoTao_Id: f('khoa').value, strChuongTrinh_Id: f('ct').value, strLopQuanLy_Id: f('lop').value,
            dLocTheoDuLieuImport: L.imp,
            strDaoTao_CT_DinhHuong_Id: f('dh').value, strDaoTao_CT_DH_Nhom_Id: f('nhomdh').value,
            strQLSV_TrangThaiNguoiHoc_Id: trangThai.ids().join(','),
            strNguoiThucHien_Id: '', pageIndex: L.trang, pageSize: L.co
        }).then(function (r) {
            L.ds = arr(r.data);
            L.tong = Number(r.pager) || L.ds.length;
            dat('nSV', '(' + L.tong + ')');
            ui.table({ el: z('sv'), rows: L.ds, empty: 'Không có sinh viên',
                page: { index: L.trang, size: L.co, total: L.tong, onChange: function (p) { L.trang = p; taiSV(); }, onSize: function (s) { L.co = s; L.trang = 1; taiSV(); } },
                columns: [
                    { title: 'Mã số', cls: 'is-nowrap', render: function (x, i) {
                        return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-xemsv="' + i + '" title="Đăng ký cho sinh viên này"><span>' + esc(x.MASO) + '</span></button>'; } },
                    { title: 'Họ tên', cls: 'is-nowrap', render: function (x) { return esc(e(x.HODEM) + ' ' + e(x.TEN)); } },
                    { title: 'Lớp', prop: 'LOP', cls: 'is-nowrap' },
                    { title: 'Chương trình', prop: 'NGANH' },
                    { title: 'Định hướng', prop: 'DAOTAO_CT_DINHHUONG_TEN' },
                    { title: 'Nhóm định hướng', prop: 'DAOTAO_CT_DH_NHOM_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_NGUOIHOC_TRANGTHAI', cls: 'is-center is-nowrap' },
                    { head: '<input type="checkbox" data-svall title="Chọn tất cả">', cls: 'is-center is-actions', width: '50px',
                        render: function (x, i) { return '<input type="checkbox" data-svck="' + i + '">'; } },
                    { title: 'Kết quả', render: function (x) { return '<span data-kqsv="' + esc(x.ID) + '">' + esc(L.kq[e(x.ID)]) + '</span>'; } }
                ] });
        }).catch(function (err) { z('sv').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }
    function timSV(imp) { L.imp = imp ? 1 : -1; L.trang = 1; taiSV(); }
    // gốc: genList_TrangThaiSV vẽ xong ô trạng thái rồi mới nạp danh sách lần đầu
    ums.api.dm('QLSV.TRANGTHAI').catch(function () {}).then(function () { setTimeout(taiSV, 0); });

    /* ---------- Hệ → Khoá → CT → Lớp · Định hướng · Nhóm ------------------ */
    function napDH() {
        ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8m', func: 'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong',
            strTuKhoa: '', strDaoTao_HeDaoTao_Id: f('he').value, strDaoTao_KhoaDaoTao_Id: f('khoa').value, strDaoTao_ChuongTrinh_Id: f('ct').value,
            strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('dh'), arr(r.data), { name: 'TEN', head: 'Chọn định hướng' }); })
            .catch(function (err) { ums.api.handle(err, 'định hướng'); });
    }
    function napNhomDH() {
        ums.api.call({ action: 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeDykuLAPP', func: 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom',
            strDaoTao_ChuongTrinh_Id: f('ct').value, strDaoTao_CT_DinhHuong_Id: f('dh').value, strNguoiThucHien_Id: uid() })
            .then(function (r) { pat.fill(f('nhomdh'), arr(r.data), { name: 'TEN', head: 'Chọn nhóm định hướng' }); })
            .catch(function (err) { ums.api.handle(err, 'nhóm định hướng'); });
    }
    ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' },
        onChange: function (v, level) {
            if (level === 'he') napDH();
            else if (level === 'khoa') { timSV(); napDH(); }
            else if (level === 'ct') { timSV(); napDH(); napNhomDH(); }
            else if (level === 'lop') timSV();
        } });
    jQuery(f('dh')).on('change', function () { napNhomDH(); timSV(); });

    /* ================= VÙNG 2 — trạng thái ================================= */
    var st = { sv: '', dsSV: [], ct: [], ctId: '', kh: [], khId: '', soGiay: 0, hp: [], hpChon: '', daDK: [],
               lhp: { rs: [], rsNhomKiemSoat: [] }, kq: [], taiChinh: null };
    function goi(m, o) { return ums.api.call(Object.assign({ action: DC + m, method: 'GET' }, o)); }
    function ghi(inner) { return ums.api.call({ action: inner.action, strVal: D.xorB64(JSON.stringify(inner), 'chaolong') }); }
    function motSV() { return st.dsSV.length <= 1; }

    function moDangKy(sv, dsSV) {
        st.sv = e(sv); st.dsSV = dsSV || [];
        st.hpChon = ''; st.kq = []; st.taiChinh = null;
        ['ten', 'ma', 'soDu', 'soLop', 'tcDaDK', 'tcMax', 'tcMin'].forEach(function (k) { dat(k, ''); });
        dat('phatSinh', '-');
        z('anh').innerHTML = '<i class="fa-light fa-user"></i>';
        z('kh').innerHTML = ''; z('tg').innerHTML = ''; z('hp').innerHTML = ''; z('lhp').innerHTML = ''; z('gv').innerHTML = ''; z('thu').innerHTML = ''; z('pa').innerHTML = '';
        moVung(2);
        napCT();
    }

    /* ---------- Chương trình (getList_ChuongTrinh) ----------------------- */
    function napCT() {
        dangTai(z('ctdt'));
        goi('LayDSChuongTrinh', { strQLSV_NguoiHoc_Id: st.sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.ct = arr(r.data);
            st.ctId = st.ct.length ? e(st.ct[0].DAOTAO_TOCHUCCHUONGTRINH_ID) : '';
            veCT();
            var d = st.ct[0];
            if (d) {
                dat('ten', e(d.QLSV_NGUOIHOC_HODEM) + ' ' + e(d.QLSV_NGUOIHOC_TEN));
                dat('ma', d.QLSV_NGUOIHOC_MASO);
                if (d.QLSV_NGUOIHOC_ANH && ums.state.mode !== 'demo' && ums.files) {
                    var img = new Image();
                    img.alt = '';
                    img.onload = function () { z('anh').innerHTML = ''; z('anh').appendChild(img); };
                    img.src = ums.files.url(d.QLSV_NGUOIHOC_ANH);
                }
            }
            napKH();
        }).catch(function (err) { z('ctdt').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chương trình đào tạo'); });
    }
    function veCT() {
        z('ctdt').innerHTML = st.ct.length ? ui.chips(st.ct.map(function (c) { return { key: e(c.DAOTAO_TOCHUCCHUONGTRINH_ID), label: e(c.DAOTAO_TOCHUCCHUONGTRINH_TEN) }; }), st.ctId)
            : ui.empty('Không có chương trình đào tạo');
    }

    /* ---------- Kế hoạch (getList_KeHoach / showThoiGianDangKy) ---------- */
    function napKH() {
        dangTai(z('kh'));
        goi('LayDSKeHoachDangKyHoc', { strDaoTao_ChuongTrinh_Id: st.ctId, strQLSV_NguoiHoc_Id: st.sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.kh = arr(r.data);
            st.khId = st.kh.length ? e(st.kh[0].ID) : '';
            veKH();
            z('tg').innerHTML = '';
            if (st.kh.length) thoiGian(st.kh[0]);
            napHP();
            napKQ().catch(function () { return null; });
            napTC();
        }).catch(function (err) { z('kh').innerHTML = ui.fail(err.message); ums.api.handle(err, 'kế hoạch đăng ký'); });
    }
    function veKH() {
        z('kh').innerHTML = st.kh.length ? ui.chips(st.kh.map(function (k) { return { key: e(k.ID), label: e(k.MAKEHOACH) + ' - ' + e(k.TENKEHOACH) }; }), st.khId)
            : ui.empty('Không có kế hoạch đăng ký');
    }
    function thoiGian(d) {
        z('tg').innerHTML = '<b>Thời gian:</b> ' + esc(e(d.NGAYBATDAU) + ' ' + e(d.GIODANGKYTRONGNGAYDAU) + ':' + e(d.PHUTDANGKYTRONGNGAYDAU) + ' - ' +
            e(d.NGAYKETTHUC) + ' ' + e(d.GIOKETTHUCTRONGNGAYCUOI) + ':' + e(d.PHUTKETTHUCTRONGNGAYCUOI));
        dat('tcDaDK', d.SOTINCHIDADANGKY);
        dat('tcMax', d.SOTINCHITOIDACHUONGTRINH);
        dat('tcMin', d.SOTINCHITOITHIEUCHUONGTRINH);
        if (d.SOGIAYCHO) st.soGiay = parseInt(d.SOGIAYCHO, 10) || 0;
    }

    /* ---------- Học phần (getList_HocPhan / genList_HocPhan) ------------- */
    function hpId() { return st.hp.some(function (h) { return e(h.DAOTAO_HOCPHAN_ID) === st.hpChon; }) ? st.hpChon : ''; }
    function napHP() {
        dangTai(z('hp'));
        goi('LayDSHocPhanDangToChuc', { strDangKy_KeHoachDangKy_Id: st.khId, strDaoTao_ChuongTrinh_Id: st.ctId, strQLSV_NguoiHoc_Id: st.sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.hp = arr(r.data);
            st.daDK = st.hp.filter(function (h) { return h.DADANGKY > 0; }).map(function (h) { return e(h.DAOTAO_HOCPHAN_ID); });
            // chọn sẵn: học phần đang chọn trước đó, không có thì học phần đầu tiên CHƯA đăng ký (như gốc)
            if (!hpId()) {
                var dau = st.hp.filter(function (h) { return h.DADANGKY === 0 || h.DADANGKY === '0'; })[0];
                st.hpChon = dau ? e(dau.DAOTAO_HOCPHAN_ID) : '';
            }
            veHP();
            z('thu').innerHTML = ''; z('gv').innerHTML = '';
            napLHP(); napThu(); napGV();
        }).catch(function (err) { z('hp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); });
    }
    function veHP() {
        z('hp').innerHTML = st.hp.length ? st.hp.map(function (h, i) {
            return '<button type="button" class="dky-hp__muc' + (e(h.DAOTAO_HOCPHAN_ID) === st.hpChon ? ' is-active' : '') + (h.DADANGKY > 0 ? ' is-dk' : '') + '" data-hp="' + i + '">' +
                '<i class="fa-light fa-angle-right"></i><span>' + esc(e(h.DAOTAO_HOCPHAN_MA) + ' - ' + e(h.DAOTAO_HOCPHAN_TEN)) + '</span>' +
                (h.DADANGKY > 0 ? '<i class="fa-solid fa-circle-check dky-xong" title="Đã đăng ký"></i>' : '') + '</button>';
        }).join('') : ui.empty('Không có học phần đang tổ chức');
    }

    /* ---------- Lớp học phần + Phương án -------------------------------- */
    function napLHP(cuon) {
        var hp = hpId();
        if (!hp) { st.lhp = { rs: [], rsNhomKiemSoat: [] }; veLHP(); vePA(); return; }
        dangTai(z('lhp'));
        goi('LayDSLopHocPhanDangToChuc', {
            type: 'GET',
            strThuHoc: danhDau(z('thu')), strNhanSu_HoSoNhanSu_v2_Id: danhDau(z('gv')),
            dChiLayCacLopKhongTrung: f('locTrung').checked ? 1 : 0,
            strThuocTinhLop_Id: '', strMaNhomLop: '', dLaLopHocPhanChinh: 1,
            strQLSV_NguoiHoc_Id: st.sv, strDaoTao_ChuongTrinh_Id: st.ctId, strDangKy_KeHoachDangKy_Id: st.khId,
            strDaoTao_HocPhan_Id: hp, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var d = r.data || {};
            st.lhp = { rs: arr(d.rs), rsNhomKiemSoat: arr(d.rsNhomKiemSoat) };
            veLHP(); vePA();
            if (cuon && st.lhp.rs.length) z('lhp').closest('.ums-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }).catch(function (err) { z('lhp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp học phần'); });
    }
    function dongThe(r) {
        return [e(r.THUOCTINHLOP_TEN), 'Ngày: ' + e(r.NGAYBATDAU) + ' - ' + e(r.NGAYKETTHUC), 'Thứ: ' + e(r.THUHOC), 'Giảng viên: ' + e(r.GIANGVIEN),
                'Tổng số: ' + e(r.SOLUONGDUKIENHOC), 'Đã đăng ký: ' + e(r.SOTHUCTEDANGKYHOC)];
    }
    function veLHP() {
        var rs = st.lhp.rs;
        z('nLhp').textContent = rs.length ? '(' + rs.length + ')' : '';
        pat.cards({
            el: z('lhp'), items: rs, empty: hpId() ? 'Không có lớp học phần' : 'Chọn học phần để xem lớp học phần',
            render: function (r) { return D.the(r, { dong: dongThe(r), gia: r.PHISAUKHITRUMIEN }); },
            actions: function (r, i) {
                var daDK = motSV() && st.daDK.indexOf(e(r.DAOTAO_HOCPHAN_ID)) >= 0;
                return D.nut('out-primary', 'Xem chi tiết', { 'data-ct': i }) +
                    (Number(r.SOLOPTHUOCCUNGNHOM) === 1
                        ? D.nut('save', daDK ? 'Đã đăng ký HP' : 'Đăng ký', { 'data-dk': i }, daDK)
                        : D.nut('warn', (daDK ? 'Đủ ' : 'Chọn thêm ') + e(r.SOLOPTHUOCCUNGNHOM), { 'data-chon': i }, daDK));
            }
        });
    }
    function vePA() {
        z('pa').innerHTML = st.lhp.rsNhomKiemSoat.map(function (p, i) {
            return '<button type="button" class="dky-pa__muc" data-pa="' + i + '"><span>' + esc(p.TENNHOM) + '</span><i class="fa-light fa-arrow-right"></i></button>';
        }).join('');
    }

    /* ---------- Thứ học / Giảng viên ------------------------------------- */
    function thamSoLoc() { return { type: 'GET', strDangKy_KeHoachDangKy_Id: st.khId, strDaoTao_HocPhan_Id: hpId(), strQLSV_NguoiHoc_Id: st.sv, strDaoTao_ChuongTrinh_Id: st.ctId, strNguoiThucHien_Id: uid() }; }
    function oDanhDau(id, chu) { return '<label class="ums-check"><input type="checkbox" value="' + esc(id) + '" checked><span>' + esc(chu) + '</span></label>'; }
    function napThu() {
        goi('LayThuHocTheoHocPhan', thamSoLoc()).then(function (r) {
            z('thu').innerHTML = arr(r.data).map(function (x) { return oDanhDau(x.THUHOC, x.THUHOC); }).join('');
        }).catch(function (err) { ums.api.handle(err, 'thứ học'); });
    }
    function napGV() {
        goi('LayGiangVienTheoHocPhan', thamSoLoc()).then(function (r) {
            z('gv').innerHTML = arr(r.data).map(function (x) { return oDanhDau(x.ID, e(x.MASO) + ' - ' + e(x.HODEM) + ' ' + e(x.TEN)); }).join('');
        }).catch(function (err) { ums.api.handle(err, 'giảng viên'); });
    }

    /* ---------- Đăng ký (save_KeHoachDangKy) ----------------------------- */
    function hoiDangKy(ten) {
        return ui.confirm('Bạn có chắc chắn muốn đăng ký lớp học phần: ' + e(ten) + '?', { title: 'Xác nhận đăng ký', ok: 'Đồng ý', cancel: 'Quay lại' });
    }
    function dangKy(ids) {
        st.hpChon = hpId();
        var inner = {
            action: 'DKH_DangKyMH/DangKyHocTrucTiep',
            strThuocTinhLop_Id: '', strMaNhomLop: '', dLaLopHocPhanChinh: 1,
            strQLSV_NguoiHoc_Id: st.sv,
            strDaoTao_ChuongTrinh_Id: st.ctId,
            strDangKy_KeHoachDangKy_Id: st.khId,
            strDaoTao_HocPhan_Id: st.hpChon,
            strNguoiThucHien_Id: uid(),
            strDangKy_LopHocPhan_Ids: ids.join(',')
        };
        if (!st.dsSV.length) {
            ghi(inner).then(function (r) {
                if (r.raw && r.raw.Id) { ui.toast('Đăng ký thành công!', 'ok'); napKQ().catch(function () { return null; }); napHP(); }
                else ui.toast(e(r.message) || 'Đăng ký không thành công (không rõ lý do)', 'warn');
            }).catch(function (err) { ums.api.handle(err, 'đăng ký lớp học phần'); });
            return;
        }
        /* Nhiều SV: mỗi SV một lời gọi; kết quả ghi vào cột "Kết quả" của danh sách */
        var dong = [];
        ui.batch(st.dsSV.map(function (s) {
            return function () {
                var x = Object.assign({}, inner, { strQLSV_NguoiHoc_Id: e(s.ID), strDaoTao_ChuongTrinh_Id: e(s.NGANH_ID) });
                return ghi(x).then(function (r) {
                    return r.raw && r.raw.Id ? 'Đăng ký thành công!' : (e(r.message) || 'Đăng ký không thành công (không rõ lý do)');
                }, function (err) { return err.message; }).then(function (m) {
                    L.kq[e(s.ID)] = m;
                    dong.push({ ten: e(s.MASO) + ' - ' + e(s.HODEM) + ' ' + e(s.TEN), kq: m });
                    var c = z('sv').querySelector('[data-kqsv="' + e(s.ID).replace(/"/g, '') + '"]');
                    if (c) c.textContent = m;
                });
            };
        }), { title: 'Đang đăng ký', toast: false, concurrency: 4 }).then(function () {
            var ok = dong.filter(function (x) { return x.kq === 'Đăng ký thành công!'; }).length;
            ui.toast('Đăng ký thành công ' + ok + '/' + dong.length + ' sinh viên — xem cột "Kết quả" ở danh sách', ok === dong.length ? 'ok' : 'warn');
            if (ok < dong.length) {
                var dlg = ui.dialog({ title: 'Kết quả đăng ký', icon: 'fa-clipboard-check', size: 'md', body: '<div data-x="b"></div>' });
                ui.table({ el: dlg.body.querySelector('[data-x="b"]'), rows: dong, columns: [{ title: 'Sinh viên', prop: 'ten' }, { title: 'Kết quả', prop: 'kq' }] });
            }
            napKQ().catch(function () { return null; });
            napHP();
        });
    }
    /* runAA: đăng ký theo nhóm chờ SOGIAYCHO giây ("Hệ thống đang kiểm tra tính xác thực dữ liệu") */
    function choRoiDangKy(ids) {
        if (!st.soGiay) { dangKy(ids); return; }
        var n = 0, dlg = ui.dialog({ title: 'Vui lòng đợi', icon: 'fa-hourglass-half', size: 'sm',
            body: '<p class="ums-u-fz13">Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi!</p><div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-x="bar" style="width:0"></div></div></div>' });
        var bar = dlg.body.querySelector('[data-x="bar"]');
        (function buoc() {
            if (dlg.closed) return;
            if (n >= st.soGiay) { dlg.close(); dangKy(ids); return; }
            n++;
            bar.style.width = Math.round(n / st.soGiay * 100) + '%';
            setTimeout(buoc, 1000);
        })();
    }

    /* ---------- Hộp "Chọn thêm" (loadMonTheoNhom + genList_NhomLopHocPhan) */
    function chonNhom(lop) {
        var nhom = { tt: [], rs: [], chon: {}, loc: '' };
        var dlg = ui.dialog({
            title: lop.TENLOP, icon: 'fa-chalkboard-user', size: 'xl',
            body: '<div class="dky-chon"><h5 class="dky-chon__tieu">ĐỂ HOÀN THÀNH QUÁ TRÌNH ĐĂNG KÝ HỌC HỌC PHẦN ' + esc(lop.TENLOP) + ', BẠN CẦN CHỌN ĐỦ CÁC NHÓM LỚP SAU</h5>' +
                '<div class="dky-chon__o" data-x="o"></div></div>' +
                '<h5 class="dky-chon__tieu">DANH SÁCH CÁC LỚP HỌC PHẦN THẢO LUẬN / THỰC HÀNH</h5><div class="dky" data-x="ds">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Đăng ký', kind: 'save', onClick: function () {
                // gốc: lớp chính + mọi lớp đang nằm trong ô nhóm (#zoneThuocTinh .btnChonNhomLopHocPhan)
                var ids = [e(lop.ID)];
                nhom.tt.forEach(function (t) { var x = nhom.chon[e(t.THUOCTINHLOP_ID)]; if (x) ids.push(e(x.ID)); });
                hoiDangKy(lop.TENLOP).then(function (ok) { if (ok) choRoiDangKy(ids); });
            } }]
        });
        var oHost = dlg.body.querySelector('[data-x="o"]'), dsHost = dlg.body.querySelector('[data-x="ds"]');
        function the(r, acts) { return D.theHtml(D.the(r, { dong: dongThe(r), gia: r.PHISAUKHITRUMIEN }), acts); }
        function veO() {
            oHost.innerHTML = '<div class="dky-o' + (nhom.loc === '' ? ' is-active' : '') + '" data-o="">' + the(lop, D.nut('out-primary', 'Xem chi tiết', { 'data-xem': 'chinh' })) + '</div>' +
                nhom.tt.map(function (t) {
                    var id = e(t.THUOCTINHLOP_ID), x = nhom.chon[id];
                    return '<div class="dky-o' + (nhom.loc === id ? ' is-active' : '') + '" data-o="' + esc(id) + '">' +
                        (x ? the(x, D.nut('out-primary', 'Xem chi tiết', { 'data-xem': nhom.rs.indexOf(x) })) : '<div class="dky-o__trong">Chọn lớp ' + esc(t.THUOCTINHLOP_TEN) + '</div>') + '</div>';
                }).join('');
        }
        function locDS() {
            Array.prototype.forEach.call(dsHost.querySelectorAll('[data-tt]'), function (c) { c.hidden = !!nhom.loc && c.getAttribute('data-tt') !== nhom.loc; });
        }
        function veDS() {
            pat.cards({
                el: dsHost, items: nhom.rs, empty: 'Không có lớp thảo luận / thực hành',
                attrs: function (r) { return { 'data-tt': e(r.THUOCTINHLOP_ID) }; },
                render: function (r) { return D.the(r, { dong: dongThe(r), gia: r.PHISAUKHITRUMIEN }); },
                actions: function (r, i) { return D.nut('out-primary', 'Xem chi tiết', { 'data-xem': i }) + D.nut('warn', 'Chọn lớp ' + e(r.THUOCTINHLOP_TEN), { 'data-chonlop': i }); }
            });
            locDS();
        }
        veO();
        goi('LayDSLopHocPhanDangToChuc', {
            strThuocTinhLop_Id: '', strMaNhomLop: lop.MANHOMLOP, dLaLopHocPhanChinh: -1,
            strQLSV_NguoiHoc_Id: st.sv, strDaoTao_ChuongTrinh_Id: st.ctId, strDangKy_KeHoachDangKy_Id: st.khId,
            strDaoTao_HocPhan_Id: lop.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var d = r.data || {};
            nhom.tt = arr(d.rsThuocTinhLopHocPhan).filter(function (t) { return t.LOPHOCPHANCHINH !== 1 && e(t.MANHOMLOP) === e(lop.MANHOMLOP); });
            nhom.rs = arr(d.rs).filter(function (x) { return x.LOPHOCPHANCHINH !== 1; });
            nhom.tt.forEach(function (t) {
                var x = nhom.rs.filter(function (y) { return e(y.THUOCTINHLOP_ID) === e(t.THUOCTINHLOP_ID) && Number(y.SOTHUCTEDANGKYHOC) < Number(y.SOLUONGDUKIENHOC); })[0];
                if (x) nhom.chon[e(t.THUOCTINHLOP_ID)] = x;
            });
            veO(); veDS();
        }).catch(function (err) { dsHost.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nhóm lớp học phần'); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xem]');
            if (b) { var k = b.getAttribute('data-xem'), x = k === 'chinh' ? lop : nhom.rs[Number(k)]; if (x) xemLich(x.ID, x.TENLOP); return; }
            b = ev.target.closest('[data-chonlop]');
            if (b) { var y = nhom.rs[Number(b.getAttribute('data-chonlop'))]; nhom.chon[e(y.THUOCTINHLOP_ID)] = y; veO(); return; }
            b = ev.target.closest('[data-o]');
            if (b) { nhom.loc = b.getAttribute('data-o'); veO(); locDS(); }
        });
    }

    /* ---------- Hộp lịch / phương án ------------------------------------- */
    function xemLich(lopId, ten) {
        D.lich({ action: DC + 'LayLichTuanTheoLopHocPhan', gioPhut: true,
            them: { type: 'GET', method: 'GET', strKhoaKiemTraDuLieu: D.uuid(), strQLSV_NguoiHoc_Id: st.sv } }, lopId, ten);
    }
    function xemPA(p) {
        var dlg = ui.dialog({ title: 'Chi tiết - ' + e(p.TENNHOM), icon: 'fa-list-check', size: 'lg', body: '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="bang"]');
        goi('LayDSLopHocPhanTheoNhomKS', { type: 'GET', strTKB_NhomKiemSoat_Id: p.ID, strNguoiThucHien_ID: uid() }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Không có lớp', columns: [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Số dự kiến', prop: 'SODUKIEN', cls: 'is-center' }, { title: 'Số đã đăng ký', prop: 'SODADANGKY', cls: 'is-center' }
            ] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phương án đăng ký'); });
    }

    /* ---------- Tài chính (getList_TinhTrangTaiChinh) — nạp khi chọn kế hoạch như gốc */
    function napTC() {
        st.tcNap = ums.api.call({ action: 'TC_ThongTin/LayDSTinhTrangTaiChinhDKH', type: 'GET', method: 'GET',
            strDangKy_KeHoachDangKy_Id: st.khId, strQLSV_NguoiHoc_Id: st.sv, strNguoiThucHien_Id: uid(), strDaoTao_ChuongTrinh_Id: st.ctId
        }).then(function (r) {
            var d = r.data || {};
            st.taiChinh = { no: arr(d.rsConPhaiNopHienTai), du: arr(d.rsConDuHienTai), ps: arr(d.rsConPhaiNopTrongDotDK) };
            dat('soDu', D.tien(r.raw && r.raw.Id));
            dat('phatSinh', D.tien(st.taiChinh.ps.reduce(function (s, x) { return s + (Number(x.SOTIEN) || 0); }, 0)));
            return st.taiChinh;
        }).catch(function (err) { ums.api.handle(err, 'tình trạng tài chính'); return null; });
        return st.tcNap;
    }
    function taiChinh(loai) {
        (st.taiChinh ? Promise.resolve(st.taiChinh) : (st.tcNap || napTC())).then(function (tc) {
            if (!tc) return;
            var cot = [{ title: 'Số tiền', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIEN)); } },
                       { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO' }];
            if (loai === 'du') {
                var dlg = ui.dialog({ title: 'Số dư tài khoản hiện tại', icon: 'fa-sack-dollar', size: 'lg',
                    body: '<h4 class="dky-h">Khoản còn nợ</h4><div data-x="no"></div><h4 class="dky-h">Khoản còn dư</h4><div data-x="du"></div>' });
                ui.table({ el: dlg.body.querySelector('[data-x="no"]'), rows: tc.no, columns: cot, stt: false, empty: 'Không có khoản còn nợ' });
                ui.table({ el: dlg.body.querySelector('[data-x="du"]'), rows: tc.du, columns: cot, stt: false, empty: 'Không có khoản còn dư' });
                return;
            }
            var dlg2 = ui.dialog({ title: 'Số phát sinh thêm trong đợt', icon: 'fa-money-from-bracket', size: 'xl', body: '<div data-x="ps"></div>' });
            ui.table({ el: dlg2.body.querySelector('[data-x="ps"]'), rows: tc.ps, stt: false, empty: 'Không có khoản phát sinh', columns: [
                { title: 'Tên lớp', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
                { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                { title: 'Số tiền phải nộp ban đầu', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIEN)); } },
                { title: 'Phần trăm được miễn', prop: 'PHAMTRAMMIEN', cls: 'is-center' },
                { title: 'Số được miễn', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIENDUOCMIEN)); } },
                { title: 'Số còn phải nộp', cls: 'is-right is-nowrap', render: function (x) { return esc(D.tien(x.SOTIENPHAINOP)); } },
                // gốc: biến temp luôn "" (so chuỗi rỗng > 0) → cột luôn trống; giữ nguyên
                { title: 'Đã chuyển kế toán', render: function () { return ''; } }
            ] });
        });
    }

    /* ---------- Kết quả đăng ký (hộp) ------------------------------------ */
    function napKQ() {
        return goi('LayKetQuaDangKyLopHocPhan', { strDaoTao_ChuongTrinh_Id: st.ctId, strDangKy_KeHoachDangKy_Id: st.khId, strQLSV_NguoiHoc_Id: st.sv, strNguoiThucHien_Id: uid() }).then(function (r) {
            st.kq = arr(r.data);
            st.kqNap = true;
            dat('soLop', st.kq.length);
            if (st.kq.length) dat('tcDaDK', st.kq[0].SOTINCHIDADANGKY);
            return st.kq;
        });
    }
    var hopKQ = null;
    function moKQ() {
        if (hopKQ && !hopKQ.closed) return;
        hopKQ = ui.dialog({ title: 'KẾT QUẢ ĐĂNG KÝ HỌC', icon: 'fa-clipboard-check', size: 'xl', body: '<div class="dky" data-x="kq">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        hopKQ.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ctkq]');
            if (b) { var x = st.kq[Number(b.getAttribute('data-ctkq'))]; xemLich(x.DANGKY_LOPHOCPHAN_ID, x.DANGKY_LOPHOCPHAN_TEN); return; }
            b = ev.target.closest('[data-doi]');
            if (b) { doiLich(st.kq[Number(b.getAttribute('data-doi'))]); return; }
            b = ev.target.closest('[data-huy]');
            if (b) hoiHuy(st.kq[Number(b.getAttribute('data-huy'))]);
        });
        veKQ();
    }
    function veKQ() {
        if (!hopKQ || hopKQ.closed) { napKQ().catch(function () { return null; }); return; }
        var h = hopKQ.body.querySelector('[data-x="kq"]');
        napKQ().then(function (ds) {
            D.ketQua(h, ds, {
                tenAttr: function (r, i) { return { 'data-ctkq': i }; },
                actions: function (r, i) { return D.nut('out-primary', 'Đổi lịch', { 'data-doi': i }) + D.nut('danger', 'Hủy', { 'data-huy': i }); }
            });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả đăng ký'); });
    }
    function hoiHuy(temp) {
        ui.confirm('Bạn có chắc chắn muốn hủy đăng ký lớp học phần: ' + e(temp.DANGKY_LOPHOCPHAN_TEN) + '?', { title: 'Xác nhận hủy', tone: 'bad', ok: 'Đồng ý', cancel: 'Quay lại' })
            .then(function (ok) { if (ok) huy(temp); });
    }
    function huy(temp) {
        var ids = temp.MANHOMLOP
            ? st.kq.filter(function (x) { return x.MANHOMLOP === temp.MANHOMLOP; }).map(function (x) { return e(x.DANGKY_LOPHOCPHAN_ID); }).join(',')
            : e(temp.DANGKY_LOPHOCPHAN_ID);
        ghi({
            action: 'DKH_DangKyMH/ThucHienHuyDangKyHoc',
            strQLSV_NguoiHoc_Id: st.sv,
            strDaoTao_ChuongTrinh_Id: temp.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: temp.DANGKY_KEHOACHDANGKY_ID,
            strDaoTao_HocPhan_Id: temp.DAOTAO_HOCPHAN_ID,
            strNguoiThucHien_Id: uid(),
            strDangKy_LopHocPhan_Ids: ids
        }).then(function () { ui.toast('Hủy thành công!', 'ok'); }, function (err) { ums.api.handle(err, 'hủy đăng ký'); })
            .then(function () { veKQ(); napHP(); });      // gốc nạp lại cả khi lỗi
    }
    function doiLich(temp) {
        goi('LayDSLopHocPhanDangToChuc', {
            strThuocTinhLop_Id: e(temp.THUOCTINHLOP_ID), strMaNhomLop: e(temp.MANHOMLOP),
            dLaLopHocPhanChinh: temp.LOPHOCPHANCHINH === null || temp.LOPHOCPHANCHINH === undefined ? -1 : temp.LOPHOCPHANCHINH,
            strQLSV_NguoiHoc_Id: st.sv, strDaoTao_ChuongTrinh_Id: temp.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: temp.DANGKY_KEHOACHDANGKY_ID, strDaoTao_HocPhan_Id: temp.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var ds = arr((r.data || {}).rs).filter(function (x) {
                if (e(x.ID) === e(temp.DANGKY_LOPHOCPHAN_ID)) return false;
                return !(x.SOLOPTHUOCCUNGNHOM > 1 && x.LOPHOCPHANCHINH == 1);
            });
            if (!ds.length) { ui.toast('Không có lớp để đổi', 'warn'); return; }
            var dlg = ui.dialog({ title: 'Danh sách học phần', icon: 'fa-books', size: 'xl', body: '<div class="dky" data-x="ds"></div>' });
            pat.cards({
                el: dlg.body.querySelector('[data-x="ds"]'), items: ds,
                render: function (x) { return D.the(x, { dong: dongThe(x), gia: x.PHISAUKHITRUMIEN }); },
                actions: function (x, i) { return D.nut('out-primary', 'Xem chi tiết', { 'data-xem': i }) + D.nut('warn', 'Đổi lớp ' + e(x.THUOCTINHLOP_TEN), { 'data-doilop': i }); }
            });
            dlg.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-xem]');
                if (b) { var x = ds[Number(b.getAttribute('data-xem'))]; xemLich(x.ID, x.TENLOP); return; }
                b = ev.target.closest('[data-doilop]');
                if (!b) return;
                var moi = ds[Number(b.getAttribute('data-doilop'))];
                ui.confirm('Bạn có chắc chắn muốn đổi lớp học phần: ' + e(temp.DANGKY_LOPHOCPHAN_TEN) + ' sang lớp học phần ' + e(moi.TENLOP) + '?', { title: 'Xác nhận' })
                    .then(function (ok) { if (ok) luuDoiLich(temp, e(moi.ID), dlg); });
            });
        }).catch(function (err) { ums.api.handle(err, 'danh sách lớp đổi lịch'); });
    }
    function luuDoiLich(obj, strId, dlg) {
        var cu = '', moi = '';
        if (obj.MANHOMLOP === null || obj.MANHOMLOP === undefined) { cu = e(obj.DANGKY_LOPHOCPHAN_ID); moi = strId; }
        else {
            // GIỮ Y GỐC (dangky.js:1289): lớp khác trong nhóm cũng đẩy ID lớp đang đổi
            var aCu = [], aMoi = [];
            st.kq.filter(function (x) { return x.MANHOMLOP === obj.MANHOMLOP; }).forEach(function (x) {
                if (x.DANGKY_LOPHOCPHAN_ID === obj.DANGKY_LOPHOCPHAN_ID) { aCu.push(obj.DANGKY_LOPHOCPHAN_ID); aMoi.push(strId); }
                else { aCu.push(obj.DANGKY_LOPHOCPHAN_ID); aMoi.push(obj.DANGKY_LOPHOCPHAN_ID); }
            });
            cu = aCu.join(','); moi = aMoi.join(',');
        }
        ghi({
            action: 'DKH_DangKyMH/ThucHienDoiLichDangKyHoc',
            strQLSV_NguoiHoc_Id: st.sv,
            strDaoTao_ChuongTrinh_Id: obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            strDangKy_KeHoachDangKy_Id: obj.DANGKY_KEHOACHDANGKY_ID,
            strDaoTao_HocPhan_Id: obj.DAOTAO_HOCPHAN_ID,
            strNguoiThucHien_Id: uid(),
            strDangKy_LopHocPhan_Cu_Ids: cu,
            strDangKy_LopHocPhan_Moi_Ids: moi
        }).then(function () { ui.toast('Đổi lịch thành công!', 'ok'); dlg.close(); veKQ(); })
            .catch(function (err) { ums.api.handle(err, 'đổi lịch'); });
    }

    /* ---------- Xóa dữ liệu import --------------------------------------- */
    function xoaImport() {
        ui.confirm('Xóa toàn bộ dữ liệu import đăng ký của bạn?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: 'DKH_Import/Xoa_DangKy_NguoiHoc_Import', type: 'POST', strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); taiSV(); })
                .catch(function (err) { ums.api.handle(err, 'xóa dữ liệu import'); });
        });
    }

    /* ---------- Sự kiện --------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target, b;
        if ((b = t.closest('.ums-drop__toggle'))) {
            var dr = b.closest('.ums-drop'), mn = dr.querySelector('.ums-drop__menu'), on = !dr.classList.contains('is-open');
            dr.classList.toggle('is-open', on); mn.hidden = !on; b.setAttribute('aria-expanded', on ? 'true' : 'false');
            return;
        }
        if ((b = t.closest('[data-imp]'))) {
            var d0 = b.closest('.ums-drop'); d0.classList.remove('is-open'); d0.querySelector('.ums-drop__menu').hidden = true;
            var x = IMP[Number(b.getAttribute('data-imp'))];
            ums.report.importChung(x.ten, x.ma, { onDone: taiSV });
            return;
        }
        if ((b = t.closest('[data-xemsv]'))) { var s = L.ds[Number(b.getAttribute('data-xemsv'))]; if (s) moDangKy(s.ID, []); return; }
        if ((b = t.closest('[data-z="ctdt"] [data-chip]'))) { st.ctId = b.getAttribute('data-chip'); veCT(); napKH(); return; }
        if ((b = t.closest('[data-z="kh"] [data-chip]'))) {
            st.khId = b.getAttribute('data-chip'); veKH();
            var k = st.kh.filter(function (y) { return e(y.ID) === st.khId; })[0];
            if (k) thoiGian(k);
            napHP(); napKQ().catch(function () { return null; }); st.taiChinh = null; napTC();
            return;
        }
        if ((b = t.closest('[data-hp]'))) {
            st.hpChon = e(st.hp[Number(b.getAttribute('data-hp'))].DAOTAO_HOCPHAN_ID);
            Array.prototype.forEach.call(z('hp').querySelectorAll('[data-hp]'), function (y) { y.classList.toggle('is-active', y === b); });
            z('thu').innerHTML = ''; z('gv').innerHTML = '';
            napLHP(true); napThu(); napGV();
            return;
        }
        if ((b = t.closest('[data-ct]'))) { var l = st.lhp.rs[Number(b.getAttribute('data-ct'))]; xemLich(l.ID, l.TENLOP); return; }
        if ((b = t.closest('[data-dk]'))) {
            var lop = st.lhp.rs[Number(b.getAttribute('data-dk'))];
            hoiDangKy(lop.TENLOP).then(function (ok) { if (ok) dangKy([e(lop.ID)]); });
            return;
        }
        if ((b = t.closest('[data-chon]'))) { chonNhom(st.lhp.rs[Number(b.getAttribute('data-chon'))]); return; }
        if ((b = t.closest('[data-pa]'))) { xemPA(st.lhp.rsNhomKiemSoat[Number(b.getAttribute('data-pa'))]); return; }
        if ((b = t.closest('[data-a="taichinh"]'))) { taiChinh(b.getAttribute('data-loai')); return; }
        if (!(b = t.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'timsv') timSV();
        else if (a === 'timimport') timSV(true);
        else if (a === 'xoaimport') xoaImport();
        else if (a === 'dangky') {
            var ds = Array.prototype.map.call(z('sv').querySelectorAll('input[data-svck]:checked'), function (c) { return L.ds[Number(c.getAttribute('data-svck'))]; }).filter(Boolean);
            if (!ds.length) { ui.toast('Vui lòng chọn đối tượng cần đăng ký?', 'warn'); return; }
            moDangKy(ds[0].ID, ds);
        }
        else if (a === 'dong') moVung(1);
        else if (a === 'ketqua') moKQ();
        else if (a === 'timlop') napLHP();
    });
    root.addEventListener('change', function (ev) {
        if (!ev.target.hasAttribute('data-svall')) return;
        Array.prototype.forEach.call(z('sv').querySelectorAll('input[data-svck]'), function (c) { c.checked = ev.target.checked; });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); timSV(); } });

    /* ---------- Thẻ rê chuột của ba dòng số liệu (popover của gốc) ------- */
    var HC_MAX = 8;
    function hcCon(ds) { return ds.length > HC_MAX ? '<div class="dky-hc__chan">… còn ' + (ds.length - HC_MAX) + ' mục — bấm để xem đầy đủ</div>' : ''; }
    function theRe(loai) {
        if (loai === 'ketqua') {
            if (!st.kq.length) return '<div class="ums-u-faint">Chưa đăng ký lớp nào.</div>';
            return '<ul class="dky-dadk">' + st.kq.slice(0, HC_MAX).map(function (x) {
                return '<li><p><span>' + esc(x.DANGKY_LOPHOCPHAN_TEN) + '</span><span class="dky-cam">' + esc(D.tien(x.PHISAUKHITRUMIEN)) + 'đ</span></p>' +
                    '<p><span>' + esc(e(x.NGAYBATDAU) + ' - ' + e(x.NGAYKETTHUC)) + '</span><span>T' + esc(x.THUHOC_TIETHOC) + '</span></p></li>';
            }).join('') + '</ul>' + hcCon(st.kq);
        }
        var tc = st.taiChinh || { no: [], du: [], ps: [] };
        function dsTien(ds, trong) {
            if (!ds.length) return '<div class="ums-u-faint">' + esc(trong) + '</div>';
            return '<ul class="dky-dadk">' + ds.slice(0, HC_MAX).map(function (x) {
                return '<li><p><span>' + esc(x.NOIDUNG) + '</span><span class="dky-cam">' + esc(D.tien(x.SOTIEN)) + '</span></p><p><span>' + esc(x.DAOTAO_THOIGIANDAOTAO) + '</span></p></li>';
            }).join('') + '</ul>' + hcCon(ds);
        }
        if (loai === 'du') {
            return '<div class="dky-hc__td">Khoản còn nợ</div>' + dsTien(tc.no, 'Không có khoản còn nợ') +
                '<div class="dky-hc__td">Khoản còn dư</div>' + dsTien(tc.du, 'Không có khoản còn dư');
        }
        if (!tc.ps.length) return '<div class="ums-u-faint">Không có khoản phát sinh trong đợt.</div>';
        return '<ul class="dky-dadk">' + tc.ps.slice(0, HC_MAX).map(function (x) {
            return '<li><p><span>' + esc(x.DANGKY_LOPHOCPHAN_TEN) + '</span><span class="dky-cam">' + esc(D.tien(x.SOTIENPHAINOP)) + '</span></p>' +
                '<p><span>' + esc(x.TAICHINH_CACKHOANTHU_TEN) + '</span></p></li>';
        }).join('') + '</ul><div class="dky-hc__chan">Bấm để xem bảng đầy đủ</div>';
    }
    ui.hoverCard(root.querySelector('.dky-tt'), '.dky-tt__nut', function (nut) {
        var loai = nut.getAttribute('data-a') === 'ketqua' ? 'ketqua' : nut.getAttribute('data-loai');
        if (!st.sv) return null;
        return '<div>' + theRe(loai) + '</div>';
    });

    ums.report.mount(z('report'), { import: false, collect: function (add) {
        add('strThuHoc', danhDau(z('thu')));
        add('strNhanSu_HoSoNhanSu_v2_Id', danhDau(z('gv')));
        add('dChiLayCacLopKhongTrung', f('locTrung').checked ? 1 : 0);
        add('strThuocTinhLop_Id', '');
        add('strMaNhomLop', '');
        add('dLaLopHocPhanChinh', 1);
        add('strQLSV_NguoiHoc_Id', st.sv);
        add('strDaoTao_ChuongTrinh_Id', st.ctId);
        add('strDangKy_KeHoachDangKy_Id', st.khId);
        add('strDaoTao_HocPhan_Id', hpId());
        add('strNguoiThucHien_Id', uid());
    } });
    ui.enhance(vung(2));
})();
