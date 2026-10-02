/* =========================================================================
   Quyết định — quyết định người học (khai báo quyết định, sinh viên thực hiện, học phần công nhận điểm)
   Bản gốc: ApisSinhVien/Modules/quyetdinh/html/quyetdinh.html + script/quyetdinh.js (lớp QuyetDinh)
   Phần chung với "Thực thi quyết định": _quyetdinh.js (ums.svqd).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus):
       #zonebatdau       thanh lọc + "Danh sách quyết định sinh viên"        → ums.crud (danh sách)
       #zoneEdit         thêm / sửa quyết định · Học phần | File thông tin (hai cột) · Sinh viên thực hiện
                                                                              → biểu mẫu ums.crud + vùng extra
       #zoneViewHocPhan  "Danh sách học phần công nhận điểm" (bấm ô Số sinh viên)   → vùng hp
       #zoneCoSo         "Danh sách cơ sở công nhận điểm" (nút "Cở sở công nhận điểm") → vùng cs (ums.crud lồng)
   Hộp (modal gốc → ums.ui.dialog): Chọn trạng thái cần chuyển · Chọn lớp cần chuyển / lớp ngành 2 · Nhập % tính phí ·
   Cập nhật kỳ hiệu lực (thêm học kỳ) · Học kỳ áp dụng (xem / xoá) · Tìm sinh viên · Tìm học phần.

   Lời gọi (chép nguyên — quyết định là dữ liệu THẬT của người học, không đổi tên / thứ tự tham số):
     SV_QuyetDinh_MH/… pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh     danh sách (Q.thamSo + strTuNgayQD · strDenNgayQD ·
                                              strNguoiThucHien_Id · pageIndex · pageSize — phân trang máy chủ)
     SV_QuyetDinh_MH/… PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh | Sua_QLSV_QuyetDinh
                                              strId · strHinhThucQuyetDinh_Id · strLoaiQuyetDinh_Id · strSoQuyetDinh · strNgayQuyetDinh ·
                                              strCapQuyetDinh_Id · strNgayHieuLuc · strNguyenNhan_LyDo · strDaoTao_ThoiGianDaoTao_Id ·
                                              strNgayHetHieuLuc · strNguoiThucHien_Id
     SV_QuyetDinh/Xoa                         strIds (mỗi quyết định đã chọn một lời gọi)
     SV_QuyetDinh_ThucThi/LayDSHinhThucQuyetDinh  GET  type · strLoaiQuyetDinh_Id (ô Hình thức ẩn khi rỗng — như gốc)
     SV_QuyetDinh_NguoiHoc/LayDanhSach        GET  strChucNang_Id · strQLSV_QuyetDinh_Id · strQLSV_NguoiHoc_Id ''
     SV_QuyetDinh_MH/… Them_QLSV_QuyetDinh_NguoiHoc   (sau khi lưu, mỗi SV mới) strQLSV_NguoiHoc_Id · strQLSV_QuyetDinh_Id ·
                                              strDaoTao_LopQuanLy_Id · strDaoTao_ToChucCT_Id · strTrangThaiNguoiHoc_Id · strTrack_Id · strNguoiThucHien_Id
     SV_QuyetDinh_MH/… Xoa_QLSV_QuyetDinh_NguoiHoc    strIds (Xóa sinh viên — mỗi dòng một lời gọi)
     SV_QuyetDinh_MH/… CapNhat_TrangThai_QD_NH  strQLSV_QD_NguoiHoc_Id · strTrangThaiNguoiHoc_Moi_Id
     SV_QuyetDinh_MH/… CapNhat_LopQuanLy_QD_NH  strQLSV_QD_NguoiHoc_Id · strDaoTao_LopQuanLy_Moi_Id
     SV_QuyetDinh_MH/… CapNhat_LopQuanLy_N2_QD_NH  strQLSV_QD_NguoiHoc_Id · strDaoTao_LopQuanLy_N2_Id
     SV_QuyetDinh_MH/… CapNhat_PhanTramPhi_QD_NH   strQLSV_QD_NguoiHoc_Id · dPhamTramTinhPhi
     SV_HSSV_ThongTin_MH/… pkg_hososinhvien_thongtin.Them_QLSV_QD_ThoiGian   strQLSV_NguoiHoc_Id · strDaoTao_ThoiGianDaoTao_Id · strQLSV_QuyetDinh_Id
     SV_HSSV_ThongTin_MH/… LayDSKetQuaNhieuKy   strQLSV_NguoiHoc_Id · strQLSV_QuyetDinh_Id  ·  Xoa_QLSV_QD_ThoiGian  strId
     SV_QuyetDinh_HocPhan/LayDSQLSV_QuyetDinh_HocPhan  GET  type · strTuKhoa '' · strDaoTao_HocPhan_Id '' · strQLSV_QuyetDinh_Id ·
                                              strDaoTao_ThoiGianDaoTao_Id '' · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000
     SV_QuyetDinh_HocPhan/Them_QLSV_QuyetDinh_HocPhan  POST type · strQLSV_QuyetDinh_Id · strXauCongThuc '' · strDaoTao_HocPhan_Id ·
                                              strDaoTao_ThoiGianDaoTao_Id (sau khi lưu, mỗi dòng học phần mới)
     SV_QuyetDinh_HocPhan/Xoa_QLSV_QuyetDinh_HocPhan   POST type · strIds
     SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh    GET  type · strQLSV_QuyetDinh_Id  (ô học phần của vùng công nhận)
     D_CoSoCongNhanDiem/LayKQCongNhanHocPhan   GET  type · strQLSV_NguoiHoc_Id · strDaoTao_HocPhan_Id '' (gốc truyền thiếu đối số)
     D_CoSoCongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap  POST type · strQLSV_QuyetDinh_Id · strQLSV_NguoiHoc_Id · strDaoTao_HocPhan_Id ·
                                              strDiem_CoSoCongNhan_Id · strGhiChu ''  ·  Xoa_Diem_NguoiHoc_HocPhan_Cap  strIds
     D_PhanQuyen/PhanQuyen_TaoDSTheoQuyetDinh   POST type · strQLSV_QuyetDinh_Id
     D_CoSoCongNhanDiem/LayDSDiem_CoSoCongNhanDiem  GET  type · strTuKhoa '' · strPhanLoai_Id '' · pageIndex 1 · pageSize 100000
     D_CoSoCongNhanDiem/Them_ | Sua_Diem_CoSoCongNhanDiem  POST type · strId · strMa · strTen · strDiaChi · strPhanLoai_Id
     D_CoSoCongNhanDiem/Xoa_Diem_CoSoCongNhanDiem  POST type · strIds
     Tệp quyết định: SV_Files (uploadFiles / viewFiles / saveFiles → ums.files).
     Danh mục: QLSV.CQD (cấp), QLSV.TRANGTHAI, DIEM.PHANLOAI.COSODAOTAO; loại quyết định: SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh.
     Hộp chọn SV: ums.pat.pickSinhVien (nguồn Corei genModal_SinhVien: PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc).
     Hộp chọn học phần (edu.extend.genModal_HocPhan): ums.dkhChon.hocPhan — nạp CHÍNH ApisDangKyHoc/…/_nvchon.js.
     Import: ums.report.mount (getList_MauImport "zonebtnSVQD" + vùng _Import); không có mẫu import thì hiện hai mục
       cứng của html gốc (IMPORTWITHPROC_SVQD "Quyết định", IMPORTWITHPROC_QDHC "QD Hồi cố" → showImportChungV2).

   Lỗi gốc — làm theo ý định:
     · Lưu quyết định MỚI xong gốc vẫn đứng ở biểu mẫu với ID rỗng → Lưu lần hai THÊM TRÙNG quyết định (kèm SV, học
       phần). Ở đây lưu xong về danh sách (ums.crud).
     · Xoá học phần đã lưu: gốc vẽ lại bảng bằng Data của lời gọi XOÁ (thường rỗng → bảng trắng) — nay nạp lại danh sách.
     · Đổi ô học phần của vùng công nhận: gốc chỉ nạp lại khi CHỌN thêm, bỏ bớt thì bảng giữ cột cũ — nay nạp lại cả khi bỏ.
     · "Chọn lớp cần chuyển": ô Hệ/Khoá/CT/Lớp nay khoá theo luật cha → con (gốc nạp sẵn mọi tầng).
   Cố ý bỏ (mã chết): getList_MauImport riêng (CM_Import_PhanQuyen → #zonebtnBaoCao_LHD không có), KHCT_HocPhan/LayDanhSach
     (getList_HocPhan — đã chú thích lời gọi), genHTML_ThongTin, genComBo_HocPhan, arrSinhVien_Id / SINHVIEN_ID (cột không có),
     vùng Import trong chân biểu mẫu (đã chú thích), resetCombobox.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, Q = ums.svqd, e = Q.e, arr = Q.arr, qa = Q.qa;
    var root = document.getElementById('sv-quyetdinh');
    if (!root) return;
    var MH = 'SV_QuyetDinh_MH/', PK = 'PKG_HOSOHOCVIEN_QUYETDINH.';
    var TT = 'SV_HSSV_ThongTin_MH/', PT = 'pkg_hososinhvien_thongtin.';

    root.innerHTML = '<div data-vung="qd"></div><div data-vung="hp" hidden></div><div data-vung="cs" hidden></div>';
    var zQD = root.querySelector('[data-vung="qd"]'), zHP = root.querySelector('[data-vung="hp"]'), zCS = root.querySelector('[data-vung="cs"]');

    var L = null;
    var st = { id: '', sv: [], moi: [], hp: [], hpMoi: [], extra: null, tep: null };

    /* =====================================================================
       Danh sách + biểu mẫu quyết định
       ===================================================================== */
    var crud = ums.crud({
        root: zQD,
        title: 'Quyết định',
        formTitle: 'quyết định',
        listTitle: 'Danh sách quyết định sinh viên',
        icon: 'fa-screen-users',
        autoload: false,
        list: {
            paged: true,
            call: function () {
                var p = Q.thamSo(L);
                p.action = MH + 'DSA4BRIQDRIXHhA0OCQ1BSgvKQPP';
                p.func = 'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh';
                p.strTuNgayQD = L.gt('tu');
                p.strDenNgayQD = L.gt('den');
                p.strNguoiThucHien_Id = '';
                return p;
            }
        },
        columns: Q.cotQD({ tongSV: true, capGiua: true, soSV: function (r) {
            return ui.btn('view', { text: String(e(r.SOLUONG)), mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-a': 'hp', 'data-id': r.ID } });
        } }).concat([
            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center' }
        ]),
        onLoad: function (rows) { Q.tepDong(crud.z('table'), rows); },
        formCols: 3,
        fields: [
            { type: 'legend', label: 'Thông tin quyết định' },
            { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', placeholder: 'Chọn loại quyết định',
              source: { call: { action: 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh', method: 'GET', type: 'GET', strNguoiDung_Id: Q.uid() }, name: 'TEN' } },
            { key: 'strCapQuyetDinh_Id', col: 'CAPQUYETDINH_ID', label: 'Cấp quyết định', type: 'select', source: { dm: 'QLSV.CQD' } },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Học kỳ', type: 'select', placeholder: 'Chọn học kỳ',
              source: { call: { action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
                  strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, name: 'DAOTAO_THOIGIANDAOTAO' } },
            { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', label: 'Số quyết định', required: true },
            { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', label: 'Ngày quyết định', type: 'date' },
            { type: 'gap' },
            { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', label: 'Ngày hiệu lực', type: 'date' },
            { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', label: 'Ngày hết hiệu lực', type: 'date' },
            { key: 'strHinhThucQuyetDinh_Id', label: 'Hình thức', type: 'select', placeholder: 'Chọn hình thức' },
            { key: 'strNguyenNhan_LyDo', col: 'NGUYENNHAN_LYDO', label: 'Nội dung quyết định', type: 'textarea', span: true }
        ],
        formDelete: false,
        onForm: function (row, c, extra) { moBieuMau(row, extra); },
        save: function (v, row) {
            st.id = row ? row.ID : '';
            return {
                action: MH + (row ? 'EjQgHhANEhceEDQ4JDUFKC8p' : 'FSkkLB4QDRIXHhA0OCQ1BSgvKQPP'),
                func: PK + (row ? 'Sua_QLSV_QuyetDinh' : 'Them_QLSV_QuyetDinh'),
                strId: row ? row.ID : '',
                strHinhThucQuyetDinh_Id: v.strHinhThucQuyetDinh_Id,
                strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strCapQuyetDinh_Id: v.strCapQuyetDinh_Id,
                strNgayHieuLuc: v.strNgayHieuLuc,
                strNguyenNhan_LyDo: v.strNguyenNhan_LyDo,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                strNguoiThucHien_Id: ''
            };
        },
        onSaved: function (c, result) { sauLuu(st.id || (result && result.raw && result.raw.Id) || ''); },
        removeText: 'Xóa',
        remove: function (ids) { return ids.map(function (id) { return { action: 'SV_QuyetDinh/Xoa', strIds: id, strNguoiThucHien_Id: '' }; }); }
    });

    /* Thanh lọc chèn vào đầu vùng danh sách của crud (thay vì thanh lọc riêng của crud) */
    var hostLoc = document.createElement('div');
    crud.z('list').insertBefore(hostLoc, crud.z('list').firstChild);
    var DROP = '<div class="ums-field ums-field--fit" data-z="impmau" hidden><div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
        '<i class="fa-light fa-cloud-arrow-up"></i><span>Import</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
        '<div class="ums-drop__menu" role="menu" hidden>' +
        '<button type="button" class="ums-drop__item" role="menuitem" data-imp="IMPORTWITHPROC_SVQD" data-ten="Quyết định"><span class="ums-drop__no">1.</span><span class="ums-drop__text">IMPORTWITHPROC_SVQD</span></button>' +
        '<button type="button" class="ums-drop__item" role="menuitem" data-imp="IMPORTWITHPROC_QDHC" data-ten="QD Hồi cố"><span class="ums-drop__no">2.</span><span class="ums-drop__text">Import quyết định hồi cố</span></button>' +
        '</div></div></div><div class="ums-field ums-field--fit" data-z="bc"></div>';
    L = Q.boLoc(hostLoc, { ngay: true, sau: DROP });
    ums.report.mount(hostLoc.querySelector('[data-z="bc"]'), {
        onImported: function () { crud.load(); },
        onLoad: function (rows) {
            hostLoc.querySelector('[data-z="impmau"]').hidden = arr(rows).some(function (r) { return /^IMPORTWITHPROC/i.test(e(r.MAUIMPORT_MA)); });
        }
    });
    crud.load(1);

    /* ---------- Biểu mẫu: ô Hình thức ------------------------------------------- */
    function fEl(k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]'); }
    function napHinhThuc(chon) {
        var el = fEl('strHinhThucQuyetDinh_Id'), khung = el.closest('.ums-field').parentNode;
        var loai = fEl('strLoaiQuyetDinh_Id').value;
        if (!loai) { khung.hidden = true; pat.fill(el, [], { head: 'Chọn hình thức' }); return; }
        ums.api.call({ action: 'SV_QuyetDinh_ThucThi/LayDSHinhThucQuyetDinh', method: 'GET', type: 'GET', silent: true, strLoaiQuyetDinh_Id: loai })
            .then(function (r) {
                var d = arr(r.data);
                khung.hidden = !d.length;
                pat.fill(el, d, { name: 'TEN', head: 'Chọn hình thức' });
                if (chon) { el.value = chon; jQuery(el).trigger('change.select2'); }
            }).catch(function (err) { ums.api.handle(err, 'hình thức quyết định'); });
    }
    jQuery(fEl('strLoaiQuyetDinh_Id')).on('select2:select select2:clear', function () { napHinhThuc(''); });

    /* ---------- Biểu mẫu: vùng extra (học phần · tệp · sinh viên) ----------------- */
    function x(k) { return st.extra ? st.extra.querySelector('[data-z="' + k + '"]') : null; }
    function moBieuMau(row, extra) {
        st.id = row ? row.ID : '';
        st.sv = []; st.moi = []; st.hp = []; st.hpMoi = [];
        st.extra = extra;
        extra.innerHTML =
            '<div class="ums-grid ums-grid--2 ums-cols ums-u-mb-4">' +
                pat.panel({ title: 'Học phần', icon: 'fa-book', flush: true, zone: 'hpt',
                    tools: ui.btn('add', { mod: 'out-success', attr: { 'data-a': 'hp-them' } }) }) +
                pat.panel({ title: 'File thông tin', icon: 'fa-paperclip', body: ui.field('File quyết định', '<div data-z="tep"></div>') }) +
            '</div>' +
            pat.panel({ title: 'Sinh viên thực hiện', icon: 'fa-users', count: 'svn',
                tools: ui.xoaChon('input[data-qdsv]', { goc: '.ums-panel', text: 'Xóa sinh viên', attr: { 'data-a': 'sv-xoa' } }),
                body: '<div class="ums-row ums-row--between ums-u-mb-2">' +
                        ui.btn('add', { text: 'Bổ sung sinh viên', mod: 'out-success', attr: { 'data-a': 'sv-them' } }) +
                        '<div class="ums-row">' +
                            ui.btn('edit', { text: 'Chọn trạng thái cần chuyển', mod: 'out-warn', icon: 'fa-repeat', attr: { 'data-a': 'sv-tt' } }) +
                            ui.btn('edit', { text: 'Chọn lớp cần chuyển', mod: 'out-primary', icon: 'fa-people-arrows', attr: { 'data-a': 'sv-lop', 'data-n': 'N1' } }) +
                            ui.btn('edit', { text: 'Chọn lớp ngành 2', mod: 'out-primary', icon: 'fa-people-arrows', attr: { 'data-a': 'sv-lop', 'data-n': 'N2' } }) +
                            ui.btn('edit', { text: 'Nhập % tính phí', mod: 'out-primary', icon: 'fa-percent', attr: { 'data-a': 'sv-phi' } }) +
                            ui.btn('edit', { text: 'Cập nhật kỳ hiệu lực', mod: 'out-primary', attr: { 'data-a': 'sv-ky' } }) +
                        '</div></div><div data-z="svt"></div>' });
        st.tep = ums.files.mount(x('tep'), { api: 'SV_Files' });
        if (st.id) st.tep.load(st.id); else st.tep.clear();
        if (row) napHinhThuc(e(row.HINHTHUCQUYETDINH_ID)); else napHinhThuc('');
        veHP(); veSV();
        if (st.id) { taiHP(); taiSV(); }
    }

    /* ---------- Học phần của quyết định ------------------------------------------ */
    function taiHP() {
        var id = st.id;
        x('hpt').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_QuyetDinh_HocPhan/LayDSQLSV_QuyetDinh_HocPhan', method: 'GET', type: 'GET',
            strTuKhoa: '', strDaoTao_HocPhan_Id: '', strQLSV_QuyetDinh_Id: id, strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '',
            pageIndex: 1, pageSize: 100000 })
            .then(function (r) { if (id === st.id) { st.hp = arr(r.data); veHP(); } })
            .catch(function (err) { x('hpt').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần của quyết định'); });
    }
    function veHP() {
        var host = x('hpt');
        if (!host) return;
        // Giữ học kỳ đã chọn ở các dòng mới khi vẽ lại
        qa(host, 'select[data-hpky]').forEach(function (s) { var m = st.hpMoi[Number(s.getAttribute('data-hpky'))]; if (m) m.ky = s.value; });
        var rows = st.hp.map(function (r) { return { r: r }; }).concat(st.hpMoi.map(function (m, i) { return { m: m, i: i }; }));
        ui.table({ el: host, rows: rows, empty: 'Chưa có học phần', columns: [
            { title: 'Thời gian', render: function (o) {
                if (o.r) return esc(e(o.r.THOIGIAN));
                return '<select class="ums-select" data-s2 data-hpky="' + o.i + '" data-ph="Chọn học kỳ"><option value=""></option></select>';
            } },
            { title: 'Học phần', render: function (o) {
                return o.r ? esc(e(o.r.DAOTAO_HOCPHAN_TEN) + ' - ' + e(o.r.DAOTAO_HOCPHAN_MA)) : esc(e(o.m.hp.TEN) + ' - ' + e(o.m.hp.MA));
            } },
            { title: 'Xóa', cls: 'is-center', width: '72px', render: function (o) {
                return o.r ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="hp-xoa" data-id="' + esc(o.r.ID) + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>'
                    : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="hp-bo" data-i="' + o.i + '" title="Xóa dòng"><i class="fa-light fa-trash-can"></i></button>';
            } }
        ] });
        var o = qa(host, 'select[data-hpky]');
        if (o.length) Q.hocKy().then(function (d) {
            o.forEach(function (s) {
                var m = st.hpMoi[Number(s.getAttribute('data-hpky'))];
                pat.fill(s, d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
                if (m && m.ky) { s.value = m.ky; jQuery(s).trigger('change.select2'); }
            });
            ui.enhance(host);
        });
    }
    function themHP() {
        ums.dkhChon.hocPhan({ onPick: function (rows) {
            rows.forEach(function (hp) { st.hpMoi.push({ hp: hp, ky: '' }); });
            veHP();
        } });
    }
    function xoaHP(id) {
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá học phần' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'SV_QuyetDinh_HocPhan/Xoa_QLSV_QuyetDinh_HocPhan', type: 'POST', strIds: id, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); taiHP(); })
                .catch(function (err) { ums.api.handle(err, 'xoá học phần'); });
        });
    }

    /* ---------- Sinh viên thực hiện ----------------------------------------------- */
    function taiSV() {
        var id = st.id, host = x('svt');
        if (!host) return;
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_QuyetDinh_NguoiHoc/LayDanhSach', method: 'GET', strChucNang_Id: Q.cn(), strQLSV_QuyetDinh_Id: id, strQLSV_NguoiHoc_Id: '' })
            .then(function (r) { if (id === st.id) { st.sv = arr(r.data); veSV(); } })
            .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của quyết định'); });
    }
    function veSV() {
        var host = x('svt');
        if (!host) return;
        var rows = st.sv.map(function (r) { return { r: r }; }).concat(st.moi.map(function (m) { return { m: m }; }));
        var n = x('svn');
        if (n) n.textContent = '(' + rows.length + ')';
        function g(o, k) { return o.r ? esc(e(o.r[k])) : ''; }
        ui.table({ el: host, rows: rows, empty: 'Chưa có sinh viên thực hiện', columns: Q.cotSV().concat([
            { title: 'Trạng thái mới', render: function (o) { return g(o, 'TRANGTHAINGUOIHOC_MOI_TEN'); } },
            { title: 'Lớp mới', render: function (o) { return g(o, 'DAOTAO_LOPQUANLY_MOI_TEN'); } },
            { title: '% tính phí', cls: 'is-center', render: function (o) { return g(o, 'PHAMTRAMTINHPHI'); } },
            { title: 'Lớp ngành 2', render: function (o) { return g(o, 'DAOTAO_LOPQUANLY_N2_TEN'); } },
            { title: 'Kỳ hiệu lực', cls: 'is-nowrap', render: function (o) {
                if (!o.r) return '';
                return ui.btn('view', { text: e(o.r.DSKETQUANHIEUKY) || 'Chi tiết', mod: 'out-primary', cls: 'ums-btn--sm',
                    attr: { 'data-a': 'sv-hk', 'data-nh': e(o.r.QLSV_NGUOIHOC_ID), 'data-ten': Q.hoTen(o.r) } });
            } },
            { head: '<input type="checkbox" data-qdsvall title="Chọn tất cả">', cls: 'is-center', width: '56px', render: function (o) {
                return o.r ? '<input type="checkbox" data-qdsv="' + esc(o.r.ID) + '">'
                    : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="sv-bo" data-id="' + esc(o.m.ID) + '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>';
            } }
        ]) });
    }
    function daChon() { return qa(x('svt'), 'input[data-qdsv]:checked').map(function (c) { return c.getAttribute('data-qdsv'); }); }
    function canChon(msg) { var ids = daChon(); if (!ids.length) ui.toast(msg || 'Vui lòng chọn sinh viên?', 'warn'); return ids; }
    function chayDS(calls, tieuDe) {
        return ui.batch(calls, { title: tieuDe || 'Đang cập nhật', okText: 'Thực hiện thành công', show: true }).then(function () { taiSV(); });
    }
    function mh(fn, ma, p) {
        var c = { action: MH + ma, func: PK + fn, strNguoiThucHien_Id: '' };
        Object.keys(p).forEach(function (k) { c[k] = p[k]; });
        return c;
    }

    function themSV() {
        pat.pickSinhVien({
            filters: true,
            status: function (el) { return pat.checks(el, Q.trangThai(), { cols: 3, what: 'trạng thái sinh viên' }); },
            call: function (p, page, size) {
                return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                    strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                    strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                    strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                    strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
            },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(Q.hoTen(r)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
            ],
            onPick: function (rows) {
                var co = {}, bo = 0;
                st.sv.concat(st.moi).forEach(function (r) { co[r.QLSV_NGUOIHOC_ID] = 1; });
                rows.forEach(function (r) { if (co[r.QLSV_NGUOIHOC_ID]) { bo++; return; } co[r.QLSV_NGUOIHOC_ID] = 1; st.moi.push(r); });
                if (bo) ui.toast('Đã tồn tại: ' + bo + ' sinh viên', 'warn');
                veSV();
            }
        });
    }
    function xoaSV() {
        var ids = canChon('Vui lòng chọn đối tượng cần xóa?');
        if (!ids.length) return;
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá sinh viên khỏi quyết định' }).then(function (yes) {
            if (!yes) return;
            chayDS(ids.map(function (id) { return mh('Xoa_QLSV_QuyetDinh_NguoiHoc', 'GS4gHhANEhceEDQ4JDUFKC8pHg8mNC4oCS4i', { strIds: id }); }), 'Đang xoá sinh viên');
        });
    }
    function hopTrangThai() {
        var ids = canChon();
        if (!ids.length) return;
        var dlg = ui.dialog({ title: 'Chọn trạng thái cần chuyển', icon: 'fa-repeat', size: 'sm',
            body: ui.field('Trạng thái', Q.sel('tt', 'Chọn trạng thái'), { required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var v = dlg.body.querySelector('[data-x="tt"]').value;
                if (!v) { ui.toast('Vui lòng chọn trạng thái?', 'warn'); return false; }
                chayDS(ids.map(function (id) { return mh('CapNhat_TrangThai_QD_NH', 'AiAxDykgNR4VMyAvJhUpICgeEAUeDwkP', { strQLSV_QD_NguoiHoc_Id: id, strTrangThaiNguoiHoc_Moi_Id: v }); }));
            } }] });
        ui.enhance(dlg.body);
        Q.trangThai().then(function (d) { pat.fill(dlg.body.querySelector('[data-x="tt"]'), d, { name: 'TEN', head: 'Chọn trạng thái' }); });
    }
    function hopLop(che) {
        var ids = canChon();
        if (!ids.length) return;
        var dlg = ui.dialog({ title: che === 'N2' ? 'Chọn lớp ngành 2' : 'Chọn lớp cần chuyển', icon: 'fa-people-arrows', size: 'md',
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Hệ đào tạo', Q.sel('he', 'Tất cả hệ đào tạo')) + ui.field('Khóa đào tạo', Q.sel('khoa', 'Tất cả khóa đào tạo')) +
                ui.field('Chương trình đào tạo', Q.sel('ct', 'Tất cả chương trình đào tạo')) + ui.field('Lớp', Q.sel('lop', 'Chọn lớp'), { required: true }) + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var lop = dlg.body.querySelector('[data-x="lop"]').value;
                if (!lop) { ui.toast('Vui lòng chọn lớp?', 'warn'); return false; }
                chayDS(ids.map(function (id) {
                    return che === 'N2'
                        ? mh('CapNhat_LopQuanLy_N2_QD_NH', 'AiAxDykgNR4NLjEQNCAvDTgeD3MeEAUeDwkP', { strQLSV_QD_NguoiHoc_Id: id, strDaoTao_LopQuanLy_N2_Id: lop })
                        : mh('CapNhat_LopQuanLy_QD_NH', 'AiAxDykgNR4NLjEQNCAvDTgeEAUeDwkP', { strQLSV_QD_NguoiHoc_Id: id, strDaoTao_LopQuanLy_Moi_Id: lop });
                }));
            } }] });
        ui.enhance(dlg.body);
        function s(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        var P = { pageIndex: 1, pageSize: 1000000 };
        /* getList_*_Chuyen của gốc: Khoá theo Hệ · CT theo Khoá · Lớp theo Hệ + Khoá + CT */
        Q.noiTang({ he: s('he'), khoa: s('khoa'), ct: s('ct'), lop: s('lop') }, {
            nhan: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Chọn lớp' },
            lopTheo: ['he', 'khoa', 'ct'],
            nap: {
                khoa: function (v) { return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v.he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize }); },
                ct: function (v) { return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v.khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize }); },
                lop: function (v) { return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v.he, strKhoaDaoTao_Id: v.khoa, strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: v.ct, strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize }); }
            }
        });
    }
    function hopPhi() {
        var ids = canChon();
        if (!ids.length) return;
        var dlg = ui.dialog({ title: 'Nhập % tính phí', icon: 'fa-percent', size: 'sm',
            body: ui.field('% tính phí', '<input type="number" class="ums-input" data-x="pt" min="0" max="100" step="0.01" placeholder="Nhập số phần trăm">', { required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var v = (dlg.body.querySelector('[data-x="pt"]').value || '').trim();
                if (v === '' || isNaN(v)) { ui.toast('Vui lòng nhập số phần trăm hợp lệ?', 'warn'); return false; }
                chayDS(ids.map(function (id) { return mh('CapNhat_PhanTramPhi_QD_NH', 'AiAxDykgNR4RKSAvFTMgLBEpKB4QBR4PCQPP', { strQLSV_QD_NguoiHoc_Id: id, dPhamTramTinhPhi: v }); }));
            } }] });
    }
    function hopThemKy() {
        var ids = canChon('Vui lòng chọn đối tượng?');
        if (!ids.length) return;
        var dlg = ui.dialog({ title: 'Thêm học kỳ', icon: 'fa-calendar-plus', size: 'md',
            body: ui.field('Học kỳ', Q.sel('hk', 'Chọn học kỳ', true), { required: true }),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var ky = jQuery(dlg.body.querySelector('[data-x="hk"]')).val() || [];
                if (!ky.length) { ui.toast('Vui lòng chọn học kỳ', 'warn'); return false; }
                var calls = [];
                ids.forEach(function (id) {
                    var sv = Q.tim(st.sv, id);
                    if (!sv) return;
                    ky.forEach(function (k) {
                        calls.push({ action: TT + 'FSkkLB4QDRIXHhAFHhUpLigGKCAv', func: PT + 'Them_QLSV_QD_ThoiGian',
                            strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ThoiGianDaoTao_Id: k, strQLSV_QuyetDinh_Id: st.id, strNguoiThucHien_Id: '' });
                    });
                });
                chayDS(calls);
            } }] });
        ui.enhance(dlg.body);
        Q.hocKy().then(function (d) { pat.fill(dlg.body.querySelector('[data-x="hk"]'), d, { name: 'DAOTAO_THOIGIANDAOTAO' }); });
    }
    function hopKyApDung(nguoiHoc, ten) {
        var dlg = ui.dialog({ title: 'Học kỳ — ' + ten, icon: 'fa-calendar-days', size: 'md', body: '<div data-x="t"></div>',
            xoa: { chon: 'input[data-hk]', text: 'Xóa', onClick: function (api) {
                var ids = qa(api.body, 'input[data-hk]:checked').map(function (c) { return c.getAttribute('data-hk'); });
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                api.close();
                chayDS(ids.map(function (id) { return { action: TT + 'GS4gHhANEhceEAUeFSkuKAYoIC8P', func: PT + 'Xoa_QLSV_QD_ThoiGian', strId: id, strNguoiThucHien_Id: '' }; }), 'Đang xoá học kỳ');
            } } });
        var host = dlg.body.querySelector('[data-x="t"]');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: TT + 'DSA4BRIKJDUQNCAPKSgkNAo4', func: PT + 'LayDSKetQuaNhieuKy',
            strQLSV_NguoiHoc_Id: nguoiHoc, strQLSV_QuyetDinh_Id: st.id, strNguoiThucHien_Id: '' }).then(function (r) {
            ui.table({ el: host, rows: arr(r.data), empty: 'Chưa có học kỳ áp dụng', columns: [
                { title: 'Học kỳ áp dụng', prop: 'THOIGIAN' },
                { head: '<input type="checkbox" data-hkall title="Chọn tất cả">', cls: 'is-center', width: '56px',
                  render: function (d) { return '<input type="checkbox" data-hk="' + esc(d.ID) + '">'; } }
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'học kỳ áp dụng'); });
        host.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-hkall')) qa(host, 'input[data-hk]').forEach(function (c) { c.checked = ev.target.checked; });
        });
    }

    /** Sau khi lưu quyết định: tệp → SV mới → học phần mới (thứ tự của gốc), rồi nạp lại danh sách */
    function sauLuu(id) {
        if (!id) return;
        qa(x('hpt') || document.createElement('div'), 'select[data-hpky]').forEach(function (s) { var m = st.hpMoi[Number(s.getAttribute('data-hpky'))]; if (m) m.ky = s.value; });
        var calls = st.moi.map(function (a) {
            return mh('Them_QLSV_QuyetDinh_NguoiHoc', 'FSkkLB4QDRIXHhA0OCQ1BSgvKR4PJjQuKAkuIgPP', {
                strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strQLSV_QuyetDinh_Id: id, strDaoTao_LopQuanLy_Id: a.DAOTAO_LOPQUANLY_ID,
                strDaoTao_ToChucCT_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID, strTrangThaiNguoiHoc_Id: a.QLSV_TRANGTHAINGUOIHOC_ID, strTrack_Id: a.TRACK_ID });
        }).concat(st.hpMoi.map(function (m) {
            return { action: 'SV_QuyetDinh_HocPhan/Them_QLSV_QuyetDinh_HocPhan', type: 'POST', strQLSV_QuyetDinh_Id: id, strXauCongThuc: '',
                strDaoTao_HocPhan_Id: m.hp.DAOTAO_HOCPHAN_ID, strDaoTao_ThoiGianDaoTao_Id: m.ky || '', strNguoiThucHien_Id: '' };
        }));
        st.moi = []; st.hpMoi = [];
        var tep = st.tep;
        (tep ? tep.save(id) : Promise.resolve()).then(function () {
            if (calls.length) return ui.batch(calls, { title: 'Đang lưu sinh viên, học phần', okText: 'Thêm thành công', show: true });
        }).then(function () { crud.load(); });
    }

    /* =====================================================================
       Vùng "Danh sách học phần công nhận điểm" (#zoneViewHocPhan)
       ===================================================================== */
    var hp = { qd: null, ds: [], coSo: [], sv: [], xem: [], o: {}, luot: 0 };
    zHP.innerHTML = pat.panel({ title: 'Danh sách học phần công nhận điểm', icon: 'fa-book-bookmark', flush: true, zone: 'hpbang',
        tools: ui.btn('close', { attr: { 'data-a': 'hp-dong' } }) +
            ui.btn('save', { text: 'Tạo danh sách nhập điểm', mod: 'out-danger', icon: 'fa-file-pen', attr: { 'data-a': 'hp-taods' } }) +
            ui.btn('view', { text: 'Cở sở công nhận điểm', mod: 'out-success', icon: 'fa-folder-bookmark', attr: { 'data-a': 'hp-coso' } }) +
            ui.btn('save', { text: 'Lưu lại', mod: 'out-primary', attr: { 'data-a': 'hp-luulai' } }) +
            ui.btn('save', { attr: { 'data-a': 'hp-luu' } }) });
    /* Hàng lọc (học phần · cơ sở · Điền tất cả) nằm giữa đầu khung và bảng như box-search của gốc */
    zHP.querySelector('.ums-panel__body').insertAdjacentHTML('beforebegin', '<div class="svqd-hploc"><div class="ums-filter">' +
        '<div class="ums-field"><select class="ums-select" data-hf="hp" data-ph="Chọn học phần" multiple></select></div>' +
        '<div class="ums-field"><select class="ums-select" data-hf="cs" data-ph="Chọn cơ sở" data-required></select></div>' +
        '<div class="ums-field ums-field--fit">' + ui.btn('confirm', { text: 'Điền tất cả', mod: 'primary', icon: 'fa-check-double', attr: { 'data-a': 'hp-dien' } }) + '</div>' +
        '</div></div>');
    ui.enhance(zHP);
    function hf(k) { return zHP.querySelector('[data-hf="' + k + '"]'); }
    function hpBang() { return zHP.querySelector('[data-z="hpbang"]'); }
    hpBang().innerHTML = ui.empty('Chọn học phần để xem danh sách sinh viên', 'fa-book');

    function napCoSo() {
        return ums.api.call({ action: 'D_CoSoCongNhanDiem/LayDSDiem_CoSoCongNhanDiem', method: 'GET', type: 'GET', silent: true,
            strTuKhoa: '', strPhanLoai_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                hp.coSo = arr(r.data);
                pat.fill(hf('cs'), hp.coSo, { name: 'TEN', head: 'Chọn cơ sở' });
                if (!hf('cs').value && hp.coSo.length) { hf('cs').value = hp.coSo[0].ID; jQuery(hf('cs')).trigger('change.select2'); }
            }).catch(function (err) { ums.api.handle(err, 'cơ sở công nhận điểm'); });
    }
    napCoSo();

    function moHP(qd) {
        hp.qd = qd; hp.sv = []; hp.xem = []; hp.o = {};
        zHP.querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-book-bookmark"></i> Danh sách học phần công nhận điểm' +
            (qd.SOQUYETDINH ? ' — ' + esc(qd.SOQUYETDINH) : '');
        hpBang().innerHTML = ui.empty('Chọn học phần để xem danh sách sinh viên', 'fa-book');
        napHPQD();
        ui.swap(zQD, zHP);
    }
    function napHPQD() {
        pat.fill(hf('hp'), [], {});
        return ums.api.call({ action: 'SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh', method: 'GET', type: 'GET', silent: true,
            strQLSV_QuyetDinh_Id: hp.qd.ID, strNguoiThucHien_Id: '' })
            .then(function (r) { hp.ds = arr(r.data); pat.fill(hf('hp'), hp.ds, { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'học phần theo quyết định'); });
    }
    jQuery(hf('hp')).on('select2:select select2:unselect select2:clear', function () { taiHPSV(); });

    function taiHPSV() {
        var l = ++hp.luot, chon = jQuery(hf('hp')).val() || [];
        hp.xem = chon.map(function (id) { return Q.tim(hp.ds, id); }).filter(Boolean);
        hp.o = {};
        if (!hp.xem.length) { hpBang().innerHTML = ui.empty('Chọn học phần để xem danh sách sinh viên', 'fa-book'); return; }
        hpBang().innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_QuyetDinh_NguoiHoc/LayDanhSach', method: 'GET', strChucNang_Id: Q.cn(), strQLSV_QuyetDinh_Id: hp.qd.ID, strQLSV_NguoiHoc_Id: '' })
            .then(function (r) {
                if (l !== hp.luot) return;
                hp.sv = arr(r.data);
                veHPSV();
                /* Mỗi SV một lời gọi LayKQCongNhanHocPhan (gốc) — 6 luồng */
                var i = 0;
                function w() {
                    if (l !== hp.luot || i >= hp.sv.length) return Promise.resolve();
                    var k = i++, sv = hp.sv[k];
                    return ums.api.call({ action: 'D_CoSoCongNhanDiem/LayKQCongNhanHocPhan', method: 'GET', type: 'GET', silent: true,
                        strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_HocPhan_Id: '', strNguoiThucHien_Id: '' })
                        .then(function (res) { if (l === hp.luot) ghiKQ(k, arr(res.data)); }, function (err) { if (err && err.expired) ums.api.handle(err); })
                        .then(w);
                }
                for (var n = 0; n < 6; n++) w();
            }).catch(function (err) { hpBang().innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của quyết định'); });
    }
    function oCoSo(i, j) {
        return '<div class="svqd-cn"><select class="ums-select ums-input--sm" data-cn="' + i + ':' + j + '"><option value="">Chọn cơ sở</option>' +
            hp.coSo.map(function (c) { return '<option value="' + esc(c.ID) + '">' + esc(e(c.TEN)) + '</option>'; }).join('') + '</select>' +
            '<input type="checkbox" data-cno="' + i + ':' + j + '"></div>';
    }
    function veHPSV() {
        var G = ['Danh sách học phần công nhận điểm'];
        var cols = [
            { head: '<input type="checkbox" data-cnall title="Chọn tất cả">', cls: 'is-center', width: '44px',
              render: function (r, i) { return '<input type="checkbox" data-cnhang="' + i + '" title="Chọn cả dòng">'; } },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', cls: 'is-nowrap' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' }
        ];
        hp.xem.forEach(function (h, j) {
            cols.push({ group: G, cls: 'is-center', head: esc(e(h.MA) + ' - ' + e(h.TEN)) + '<br><input type="checkbox" data-cncot="' + j + '" title="Chọn cả cột">',
                render: function (r, i) { return oCoSo(i, j); } });
        });
        ui.table({ el: hpBang(), rows: hp.sv, columns: cols, empty: 'Quyết định chưa có sinh viên', tableCls: 'ums-table--lined svqd-cnbang' });
    }
    /** Kết quả công nhận của một SV: đặt cơ sở vào ô, nhớ giá trị gốc (name) và ID bản ghi (title) như gốc */
    function ghiKQ(i, ds) {
        ds.forEach(function (r) {
            var j = -1;
            hp.xem.forEach(function (h, k) { if (String(h.ID) === String(r.DAOTAO_HOCPHAN_ID)) j = k; });
            if (j < 0) return;
            var key = i + ':' + j, s = hpBang().querySelector('select[data-cn="' + key + '"]');
            if (!s) return;
            s.value = e(r.DIEM_COSODAOTAOCONGNHANDIEM_ID);
            hp.o[key] = { goc: r.DIEM_COSODAOTAOCONGNHANDIEM_ID, id: r.ID };
            if (r.DIEM_COSODAOTAOCONGNHANDIEM_ID) hpBang().querySelector('input[data-cno="' + key + '"]').checked = true;
        });
    }
    /** Ô thay đổi: `laiCa` = "Lưu lại" (gồm cả ô đã có giá trị gốc) */
    function thayDoi(laiCa) {
        var them = [], xoa = [];
        qa(hpBang(), 'select[data-cn]').forEach(function (s) {
            var key = s.getAttribute('data-cn'), o = hp.o[key] || {}, goc = o.goc;
            if ((laiCa && goc) || String(goc === undefined || goc === null ? '\u0000' : goc) !== s.value) {
                if (s.value !== '') them.push({ key: key, v: s.value });
                else if (o.id !== undefined && o.id !== null) xoa.push(o.id);
            }
        });
        return { them: them, xoa: xoa };
    }
    function goiLuu(t) {
        var p = t.key.split(':'), sv = hp.sv[Number(p[0])], h = hp.xem[Number(p[1])];
        return { action: 'D_CoSoCongNhanDiem/Them_Diem_NguoiHoc_HocPhan_Cap', type: 'POST', strQLSV_QuyetDinh_Id: hp.qd.ID,
            strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_HocPhan_Id: h.ID, strDiem_CoSoCongNhan_Id: t.v, strGhiChu: '', strNguoiThucHien_Id: '' };
    }
    function goiXoa(id) { return { action: 'D_CoSoCongNhanDiem/Xoa_Diem_NguoiHoc_HocPhan_Cap', type: 'POST', strIds: id, strNguoiThucHien_Id: '' }; }
    function luuCN(laiCa) {
        var t = thayDoi(laiCa);
        if (!(t.them.length + t.xoa.length)) { ui.toast('Không có thay đổi lưu', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn thêm ' + t.them.length + ' và hủy ' + t.xoa.length + '?', { title: 'Lưu công nhận điểm' }).then(function (yes) {
            if (!yes) return;
            ui.batch(t.them.map(goiLuu).concat(t.xoa.map(goiXoa)), { title: 'Đang lưu', okText: 'Lưu thành công', show: true }).then(taiHPSV);
        });
    }
    function dienTatCa() {
        var cs = hf('cs').value;
        if (!cs) { ui.toast('Vui lòng chọn cơ sở công nhận điểm trước khi điền?', 'warn'); return; }
        var o = qa(hpBang(), 'input[data-cno]:checked');
        if (!o.length) { ui.toast('Vui lòng tích chọn ô học phần cần điền (dùng ô check ở đầu bảng để chọn tất cả, hoặc ô check trên tiêu đề từng cột học phần)?', 'warn'); return; }
        var dien = 0, bo = 0;
        o.forEach(function (c) {
            var s = hpBang().querySelector('select[data-cn="' + c.getAttribute('data-cno') + '"]');
            if (!s) return;
            if (!s.value) { s.value = cs; dien++; } else bo++;
        });
        ui.toast('Đã điền ' + dien + ' ô.' + (bo ? ' Bỏ qua ' + bo + ' ô đã có cơ sở.' : ''), 'ok');
    }
    function taoDS() {
        var cs = hf('cs').value;
        qa(hpBang(), 'input[data-cno]:checked').forEach(function (c) {
            var s = hpBang().querySelector('select[data-cn="' + c.getAttribute('data-cno') + '"]');
            if (s && !s.value) s.value = cs;
        });
        var t = thayDoi(false);
        var buoc = t.them.length + t.xoa.length
            ? ui.batch(t.them.map(goiLuu).concat(t.xoa.map(goiXoa)), { title: 'Đang lưu', okText: 'Lưu thành công', show: true })
            : Promise.resolve();
        buoc.then(function () {
            return ums.api.call({ action: 'D_PhanQuyen/PhanQuyen_TaoDSTheoQuyetDinh', type: 'POST', strQLSV_QuyetDinh_Id: hp.qd.ID, strNguoiThucHien_Id: '' });
        }).then(function () {
            ui.toast('Thêm mới thành công!', 'ok');
            hp.xem = []; hpBang().innerHTML = ui.empty('Chọn học phần để xem danh sách sinh viên', 'fa-book');
            napHPQD();
        }).catch(function (err) { ums.api.handle(err, 'tạo danh sách nhập điểm'); });
    }
    zHP.addEventListener('change', function (ev) {
        var t = ev.target, b = hpBang();
        if (t.hasAttribute('data-cnhang')) qa(b, 'input[data-cno^="' + t.getAttribute('data-cnhang') + ':"]').forEach(function (c) { c.checked = t.checked; });
        else if (t.hasAttribute('data-cncot')) qa(b, 'input[data-cno$=":' + t.getAttribute('data-cncot') + '"]').forEach(function (c) { c.checked = t.checked; });
        else if (t.hasAttribute('data-cnall')) qa(b, 'input[data-cno], input[data-cnhang], input[data-cncot]').forEach(function (c) { c.checked = t.checked; });
    });

    /* =====================================================================
       Vùng "Danh sách cơ sở công nhận điểm" (#zoneCoSo) — ums.crud lồng
       ===================================================================== */
    ums.crud({
        root: zCS,
        embedded: true,
        title: 'Danh sách cơ sở công nhận điểm',
        formTitle: 'cơ sở đào tạo',
        icon: 'fa-building-columns',
        back: function () { ui.swap(zCS, zHP); napCoSo(); },
        list: {
            call: function () {
                return { action: 'D_CoSoCongNhanDiem/LayDSDiem_CoSoCongNhanDiem', method: 'GET', type: 'GET',
                    strTuKhoa: '', strPhanLoai_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 };
            }
        },
        columns: [
            { title: 'Mã cơ sở', prop: 'MA', cls: 'is-center is-nowrap' },
            { title: 'Tên cơ sở', prop: 'TEN' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
            { title: 'Địa chỉ', prop: 'DIACHI' }
        ],
        formCols: 1,
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã' },
            { key: 'strTen', col: 'TEN', label: 'Tên' },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', source: { dm: 'DIEM.PHANLOAI.COSODAOTAO' } },
            { key: 'strDiaChi', col: 'DIACHI', label: 'Địa chỉ' }
        ],
        save: function (v, row) {
            return { action: 'D_CoSoCongNhanDiem/' + (row ? 'Sua_Diem_CoSoCongNhanDiem' : 'Them_Diem_CoSoCongNhanDiem'), type: 'POST',
                strId: row ? row.ID : '', strMa: v.strMa, strTen: v.strTen, strDiaChi: v.strDiaChi, strPhanLoai_Id: v.strPhanLoai_Id,
                strNguoiThucHien_Id: '' };
        },
        removeText: 'Xóa',
        remove: function (ids) {
            return ids.map(function (id) { return { action: 'D_CoSoCongNhanDiem/Xoa_Diem_CoSoCongNhanDiem', type: 'POST', strIds: id, strNguoiThucHien_Id: '' }; });
        }
    });

    /* =====================================================================
       Sự kiện
       ===================================================================== */
    zQD.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute && ev.target.hasAttribute('data-qdsvall')) qa(x('svt'), 'input[data-qdsv]').forEach(function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var tog = ev.target.closest('[data-z="impmau"] .ums-drop__toggle');
        if (tog) {
            var d = tog.closest('.ums-drop'), m = d.querySelector('.ums-drop__menu'), on = !d.classList.contains('is-open');
            d.classList.toggle('is-open', on); m.hidden = !on; tog.setAttribute('aria-expanded', on ? 'true' : 'false');
            return;
        }
        var imp = ev.target.closest('[data-imp]');
        if (imp) {
            var dd = imp.closest('.ums-drop'); dd.classList.remove('is-open'); dd.querySelector('.ums-drop__menu').hidden = true;
            ums.report.importChung(imp.getAttribute('data-ten'), imp.getAttribute('data-imp'), { onDone: function () { crud.load(); } });
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var id = b.getAttribute('data-id');
        switch (b.getAttribute('data-a')) {
            case 'tim': crud.load(1); break;
            case 'hp': var r = Q.tim(crud.rows, id); if (r) moHP(r); break;
            case 'hp-them': themHP(); break;
            case 'hp-xoa': xoaHP(id); break;
            case 'hp-bo': st.hpMoi.splice(Number(b.getAttribute('data-i')), 1); veHP(); break;
            case 'sv-them': themSV(); break;
            case 'sv-xoa': xoaSV(); break;
            case 'sv-bo': st.moi = st.moi.filter(function (m) { return String(m.ID) !== String(id); }); veSV(); break;
            case 'sv-tt': hopTrangThai(); break;
            case 'sv-lop': hopLop(b.getAttribute('data-n')); break;
            case 'sv-phi': hopPhi(); break;
            case 'sv-ky': hopThemKy(); break;
            case 'sv-hk': hopKyApDung(b.getAttribute('data-nh'), b.getAttribute('data-ten')); break;
            case 'hp-dong': ui.swap(zHP, zQD); crud.load(); break;
            case 'hp-coso': ui.swap(zHP, zCS); break;
            case 'hp-luu': luuCN(false); break;
            case 'hp-luulai': luuCN(true); break;
            case 'hp-dien': dienTatCa(); break;
            case 'hp-taods': taoDS(); break;
        }
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('[data-f="q"]')) { ev.preventDefault(); crud.load(1); }
    });
})();
