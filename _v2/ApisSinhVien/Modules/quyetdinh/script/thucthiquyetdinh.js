/* =========================================================================
   Thực thi quyết định — áp quyết định vào hồ sơ người học (thực thi / huỷ thực thi / chuyển lớp)
   Bản gốc: ApisSinhVien/Modules/quyetdinh/html/thucthiquyetdinh.html + script/thucthiquyetdinh.js
   Phần chung với "Quyết định": _quyetdinh.js (ums.svqd).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus):
       #zonebatdau    thanh lọc + "Danh sách quyết định sinh viên" (nút "Thực thi" khi quyết định có SV)
                                                         → ums.crud (danh sách; không Thêm / Xoá — html gốc không có hai nút)
       #zoneEdit      "Thông tin - Quyết định" (sửa được, nút Lưu) · File thông tin (chỉ xem) · Sinh viên thực hiện
                                                         → biểu mẫu ums.crud + vùng extra
       #zoneQuyetDinh "Thực thi - Quyết định" của MỘT sinh viên: thông tin quyết định | chuyển lớp → vùng tt

   Lời gọi (kiểu cũ trừ khi ghi func — chép nguyên; đây là thao tác ghi THẬT vào hồ sơ người học):
     SV_QuyetDinh/LayDanhSach        GET  Q.thamSo (không có hai ô ngày như màn Quyết định) · pageIndex · pageSize
     SV_QuyetDinh/CapNhat | ThemMoi       strId · strLoaiQuyetDinh_Id · strSoQuyetDinh · strNgayQuyetDinh · strCapQuyetDinh_Id ·
                                          strNgayHieuLuc · strNguyenNhan_LyDo · strDaoTao_ThoiGianDaoTao_Id · strNguoiThucHien_Id
     SV_QuyetDinh_NguoiHoc/LayDanhSach GET strChucNang_Id · strQLSV_QuyetDinh_Id · strQLSV_NguoiHoc_Id ''
                                          → … QLSV_QUYETDINH_THUCTHI_ID (rỗng = chưa thực thi)
     SV_QuyetDinh_MH/… PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh_ThucThi   ("Thực thi theo danh sách", mỗi SV một lời gọi)
                                          strQLSV_NguoiHoc_Id · strQLSV_QuyetDinh_Id · strDaoTao_LopQuanLy_Id · strDaoTao_ToChucCT_Id ·
                                          strTrangThaiNguoiHoc_Id · strTrack_Id ('' khi rỗng) · strNguoiThucHien_Id
     SV_QuyetDinh_ThucThi/Xoa          strIds = QLSV_QUYETDINH_THUCTHI_ID ("Hủy thực thi" — từng dòng / các dòng đã chọn)
     SV_HoSo_ThongTinHienTai/LayDSLopHienTai  GET  strNguoiHoc_Id · strNguoiThucHien_Id → DAOTAO_LOPQUANLY_ID / _TEN
     SV_QuyetDinh_ThucThi/ThucThi_ChuyenLop   strId '' · strQLSV_QuyetDinh_Id · strQLSV_NguoiHoc_Id · strDaoTao_LopQuanLy_Cu_Id ·
                                          strDaoTao_LopQuanLy_Moi_Id · strTrangThaiNguoiHoc_Moi_Id · strTo_Moi_Id · strNguoiThucHien_Id
     Loại quyết định: SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh · Cấp: QLSV.CQD · trạng thái: QLSV.TRANGTHAI · tệp: SV_Files (chỉ xem).
     Chuyển lớp — Hệ → Khoá → CT → Lớp cần chuyển đến như gốc: Khoá theo Hệ · CT theo Khoá · chọn Khoá thì Lớp theo Khoá,
       chọn CT thì Lớp theo CT (strKhoaDaoTao_Id rỗng) — đúng tham số getList_LopQuanLy(khoá, ct) của gốc.

   Khác gốc / lỗi gốc:
     · Chọn Hệ/Khoá/CT của khối chuyển lớp gốc đổ lại CẢ ô lọc tìm kiếm (hàm dùng chung renderPlace) — bỏ; mỗi khối nạp riêng.
       Khối chuyển lớp khoá tầng dưới khi chưa chọn tầng trên (luật cha → con).
     · Lưu thông tin quyết định xong về danh sách (ums.crud); gốc đứng lại biểu mẫu.
     · Ô "Loại quyết định" của biểu mẫu: gốc đổ HAI nguồn đè nhau (danh mục QLSV.LQD và LayDSLoaiQuyetDinh — cái nào về
       sau thắng) → dùng LayDSLoaiQuyetDinh như màn Quyết định. Kiểm trên host.
     · Học kỳ ở khối thực thi hiện "NĂM_NĂM+1_KỲ,ĐỢT" như gốc; thiếu năm thì để trống (gốc in "undefined_NaN…").
     · Hủy thực thi một dòng: gốc gắn hỏi lại bằng $("#btnYes").click mỗi lần bấm (bấm N lần → xoá N lần) — ở đây hỏi một lần.
   Cố ý bỏ (mã chết / khối đã ẩn trong html gốc): khối "Chuyển chương trình học" (ThucThi_ChuyenChuongTrinhHoc,
     LayDSChuongTrinhHocHienTai) và "Chuyển trạng thái" (ThucThi_ChuyenTrangThai) — html gốc đã chú thích bỏ, "quy hết về
     Chuyển lớp"; btnAdd / btnXoaQuyetDinh / btnSearchDTSV_SinhVien / addHTMLinto_SinhVien / save_SinhVien (không có nút trên
     html); getList_MauImport (CM_Import_PhanQuyen → #zonebtnBaoCao_LHD không có); autoWithDiv; resetCombobox.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, Q = ums.svqd, e = Q.e, arr = Q.arr, qa = Q.qa;
    var root = document.getElementById('sv-thucthiquyetdinh');
    if (!root) return;

    root.innerHTML = '<div data-vung="qd"></div><div data-vung="tt" hidden></div>';
    var zQD = root.querySelector('[data-vung="qd"]'), zTT = root.querySelector('[data-vung="tt"]');
    var L = null;
    var st = { qd: null, sv: [], extra: null };

    var crud = ums.crud({
        root: zQD,
        title: 'Thực thi quyết định',
        formTitle: 'quyết định',
        listTitle: 'Danh sách quyết định sinh viên',
        icon: 'fa-screen-users',
        autoload: false,
        canAdd: false,
        canEdit: false,
        list: {
            paged: true,
            call: function () {
                var p = Q.thamSo(L);
                p.action = 'SV_QuyetDinh/LayDanhSach';
                p.method = 'GET';
                return p;
            }
        },
        columns: Q.cotQD().concat([
            { title: 'Thực thi', cls: 'is-center', width: '96px', render: function (r) {
                return Number(r.SOLUONG) > 0
                    ? ui.btn('confirm', { text: 'Thực thi', mod: 'out-primary', icon: 'fa-check-to-slot', cls: 'ums-btn--sm', attr: { 'data-a': 'mo', 'data-id': r.ID } })
                    : '';
            } }
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
            { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', label: 'Ngày hiệu lực', type: 'date' },
            { key: 'strNguyenNhan_LyDo', col: 'NGUYENNHAN_LYDO', label: 'Nội dung quyết định', type: 'textarea', span: true }
        ],
        onForm: function (row, c, extra) { moBieuMau(row, extra); },
        save: function (v, row) {
            return {
                action: 'SV_QuyetDinh/' + (row ? 'CapNhat' : 'ThemMoi'),
                strId: row ? row.ID : '',
                strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strCapQuyetDinh_Id: v.strCapQuyetDinh_Id,
                strNgayHieuLuc: v.strNgayHieuLuc,
                strNguyenNhan_LyDo: v.strNguyenNhan_LyDo,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strNguoiThucHien_Id: ''
            };
        }
    });

    var hostLoc = document.createElement('div');
    crud.z('list').insertBefore(hostLoc, crud.z('list').firstChild);
    L = Q.boLoc(hostLoc, { ngay: false });
    crud.load(1);

    /* ---------- Biểu mẫu: tệp (chỉ xem) + sinh viên thực hiện ---------------------- */
    function x(k) { return st.extra ? st.extra.querySelector('[data-z="' + k + '"]') : null; }
    function moBieuMau(row, extra) {
        st.qd = row; st.sv = []; st.extra = extra;
        extra.innerHTML =
            pat.panel({ title: 'File thông tin', icon: 'fa-paperclip', cls: 'ums-u-mb-4', body: ui.field('File quyết định', '<div data-z="tep"></div>') }) +
            pat.panel({ title: 'Sinh viên thực hiện', icon: 'fa-users', count: 'svn', flush: true, zone: 'svt',
                tools: ui.xoaChon('input[data-ttx]', { goc: '.ums-panel', text: 'Hủy thực thi', attr: { 'data-a': 'huy-ds' } }) +
                    ui.btn('confirm', { text: 'Thực thi theo danh sách', icon: 'fa-check-to-slot', attr: { 'data-a': 'tt-ds' } }) });
        var tep = ums.files.mount(x('tep'), { api: 'SV_Files', readonly: true });
        if (row) tep.load(row.ID); else tep.clear();
        if (row) taiSV(); else veSV();
    }
    function taiSV() {
        var qd = st.qd, host = x('svt');
        if (!host || !qd) return;
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_QuyetDinh_NguoiHoc/LayDanhSach', method: 'GET', strChucNang_Id: Q.cn(), strQLSV_QuyetDinh_Id: qd.ID, strQLSV_NguoiHoc_Id: '' })
            .then(function (r) { if (qd === st.qd) { st.sv = arr(r.data); veSV(); } })
            .catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của quyết định'); });
    }
    function daThucThi(r) { return r.QLSV_QUYETDINH_THUCTHI_ID !== null && r.QLSV_QUYETDINH_THUCTHI_ID !== undefined && r.QLSV_QUYETDINH_THUCTHI_ID !== ''; }
    function veSV() {
        var host = x('svt');
        if (!host) return;
        var n = x('svn');
        if (n) n.textContent = '(' + st.sv.length + ')';
        ui.table({ el: host, rows: st.sv, empty: 'Chưa có sinh viên thực hiện', columns: Q.cotSV().concat([
            { title: 'Thực thi', cls: 'is-center', width: '84px', render: function (r) {
                return daThucThi(r) ? '' : '<button type="button" class="ums-iconbtn ums-iconbtn--confirm" data-a="mo-tt" data-id="' + esc(r.ID) +
                    '" title="Thực thi"><i class="fa-light fa-check-to-slot"></i></button>';
            } },
            { title: 'Hủy thực thi', cls: 'is-center', width: '96px', render: function (r) {
                return daThucThi(r) ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="huy" data-id="' + esc(r.QLSV_QUYETDINH_THUCTHI_ID) +
                    '" title="Hủy thực thi"><i class="fa-light fa-trash-can"></i></button>' : '';
            } },
            { head: '<input type="checkbox" data-ttall title="Chọn tất cả">', cls: 'is-center', width: '56px', render: function (r) {
                return daThucThi(r) ? '<input type="checkbox" data-ttx="' + esc(r.QLSV_QUYETDINH_THUCTHI_ID) + '">'
                    : '<input type="checkbox" data-ttc="' + esc(r.ID) + '">';
            } }
        ]) });
    }
    /** "Thực thi theo danh sách": dòng chưa thực thi đã chọn + dòng ĐÃ thực thi đã chọn (cho chạy lại — như gốc) */
    function thucThiDS() {
        var ids = qa(x('svt'), 'input[data-ttc]:checked').map(function (c) { return c.getAttribute('data-ttc'); });
        qa(x('svt'), 'input[data-ttx]:checked').forEach(function (c) {
            var tt = c.getAttribute('data-ttx');
            var r = st.sv.filter(function (s) { return String(s.QLSV_QUYETDINH_THUCTHI_ID) === tt; })[0];
            if (r && ids.indexOf(r.ID) < 0) ids.push(r.ID);
        });
        if (!ids.length) { ui.toast('Vui lòng chọn sinh viên cần thực thi?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn thực thi cho ' + ids.length + ' sinh viên đã chọn?', { title: 'Thực thi quyết định', ok: 'Thực thi' }).then(function (yes) {
            if (!yes) return;
            var calls = ids.map(function (id) {
                var a = Q.tim(st.sv, id);
                return a ? { action: 'SV_QuyetDinh_MH/FSkkLB4QDRIXHhA0OCQ1BSgvKR4VKTQiFSko', func: 'PKG_HOSOHOCVIEN_QUYETDINH.Them_QLSV_QuyetDinh_ThucThi',
                    strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strQLSV_QuyetDinh_Id: st.qd.ID, strDaoTao_LopQuanLy_Id: a.DAOTAO_LOPQUANLY_ID,
                    strDaoTao_ToChucCT_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID, strTrangThaiNguoiHoc_Id: a.QLSV_TRANGTHAINGUOIHOC_ID,
                    strTrack_Id: e(a.TRACK_ID), strNguoiThucHien_Id: '' } : null;
            }).filter(Boolean);
            ui.batch(calls, { title: 'Đang thực thi', okText: 'Thực thi thành công', show: true }).then(taiSV);
        });
    }
    function huy(ids) {
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Hủy thực thi', title: 'Hủy thực thi' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) { return { action: 'SV_QuyetDinh_ThucThi/Xoa', strIds: id, strNguoiThucHien_Id: '' }; }),
                { title: 'Đang hủy thực thi', okText: 'Xóa thành công!', show: true }).then(taiSV);
        });
    }

    /* ---------- Vùng "Thực thi - Quyết định" của một sinh viên --------------------- */
    function hocKy(d) {
        return d.DAOTAO_THOIGIANDAOTAO_NAM !== undefined && d.DAOTAO_THOIGIANDAOTAO_NAM !== null && d.DAOTAO_THOIGIANDAOTAO_NAM !== ''
            ? d.DAOTAO_THOIGIANDAOTAO_NAM + '_' + (Number(d.DAOTAO_THOIGIANDAOTAO_NAM) + 1) + '_' + e(d.DAOTAO_THOIGIANDAOTAO_KY) + ',' + e(d.DAOTAO_THOIGIANDAOTAO_DOT)
            : '';
    }
    function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div>'; }
    function moThucThi(sv) {
        var d = st.qd || {};
        zTT.innerHTML = pat.panel({ title: 'Thực thi - Quyết định', icon: 'fa-check-to-slot',
            tools: ui.btn('close', { attr: { 'data-a': 'tt-dong' } }),
            body: '<div class="svqd-ten">' + esc(Q.hoTen(sv) + ' - ' + e(sv.QLSV_NGUOIHOC_MASO)) + '</div>' +
                '<div class="ums-grid ums-grid--2 ums-cols">' +
                    pat.panel({ title: 'Thông tin quyết định', icon: 'fa-file-contract', body:
                        kv('Loại quyết định', d.LOAIQUYETDINH_TEN) + kv('Cấp quyết định', d.CAPQUYETDINH_TEN) + kv('Học kỳ', hocKy(d)) +
                        kv('Số quyết định', d.SOQUYETDINH) + kv('Ngày quyết định', d.NGAYQUYETDINH) + kv('Ngày hiệu lực', d.NGAYHIEULUC) +
                        kv('Nội dung', d.NGUYENNHAN_LYDO) }) +
                    pat.panel({ title: 'Chuyển lớp - ngành - khóa - hệ đào tạo', icon: 'fa-people-arrows', body:
                        ui.field('Lớp hiện tại của sinh viên', Q.sel('cu', 'Chọn lớp hiện tại')) +
                        '<div class="ums-legend ums-legend--cach">Chọn lớp cần chuyển đến</div>' +
                        '<div class="ums-grid ums-grid--2">' +
                            ui.field('Chọn hệ', Q.sel('he', 'Chọn hệ đào tạo')) + ui.field('Chọn khóa', Q.sel('khoa', 'Chọn khóa đào tạo')) +
                            ui.field('Chọn chương trình', Q.sel('ct', 'Chọn chương trình đào tạo')) + ui.field('Chọn lớp cần chuyển', Q.sel('lop', 'Chọn lớp')) +
                            ui.field('Trạng thái mới', Q.sel('ttm', 'Chọn trạng thái mới')) +
                            ui.field('Tổ', '<input class="ums-input" data-x="to" autocomplete="off">') +
                        '</div>' +
                        '<div class="ums-row ums-row--end ums-u-mt-4">' +
                            ui.btn('save', { text: 'Chuyển lớp', mod: 'primary', icon: 'fa-arrow-down-up-across-line', attr: { 'data-a': 'chuyenlop', 'data-id': sv.ID } }) +
                        '</div>' })
                + '</div>' });
        ui.enhance(zTT);
        function s(k) { return zTT.querySelector('[data-x="' + k + '"]'); }
        function chonMot(el, dsMuc) { if (dsMuc.length === 1) { el.value = dsMuc[0][el === s('cu') ? 'DAOTAO_LOPQUANLY_ID' : 'ID']; jQuery(el).trigger('change.select2'); } }
        ums.api.call({ action: 'SV_HoSo_ThongTinHienTai/LayDSLopHienTai', method: 'GET', strNguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strNguoiThucHien_Id: '' })
            .then(function (r) { var dd = arr(r.data); pat.fill(s('cu'), dd, { id: 'DAOTAO_LOPQUANLY_ID', name: 'DAOTAO_LOPQUANLY_TEN', head: 'Chọn lớp hiện tại' }); chonMot(s('cu'), dd); })
            .catch(function (err) { ums.api.handle(err, 'lớp hiện tại'); });
        Q.trangThai().then(function (dd) { pat.fill(s('ttm'), dd, { name: 'TEN', head: 'Chọn trạng thái mới' }); chonMot(s('ttm'), dd); });
        var P = { pageIndex: 1, pageSize: 1000000 };
        Q.noiTang({ he: s('he'), khoa: s('khoa'), ct: s('ct'), lop: s('lop') }, {
            nhan: { he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo', ct: 'Chọn chương trình đào tạo', lop: 'Chọn lớp' },
            lopTheo: ['khoa', 'ct'],
            nap: {
                khoa: function (v) { return ums.ref.khoaDaoTao({ strHeDaoTao_Id: v.he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize }); },
                ct: function (v) { return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v.khoa, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize }); },
                /* getList_LopQuanLy(khoá, ct) của gốc: chọn Khoá → (khoá, "") · chọn CT → ("", ct); không gửi Hệ */
                lop: function (v, tang) {
                    return ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strKhoaDaoTao_Id: tang === 'ct' ? '' : v.khoa, strNganh_Id: '', strLoaiLop_Id: '',
                        strToChucCT_Id: tang === 'ct' ? v.ct : '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: P.pageIndex, pageSize: P.pageSize });
                }
            }
        });
        ui.swap(zQD, zTT);
    }
    function chuyenLop(svId) {
        var sv = Q.tim(st.sv, svId);
        if (!sv) return;
        function s(k) { return zTT.querySelector('[data-x="' + k + '"]'); }
        ui.confirm('Bạn có chắc chắn muốn chuyển lớp không?', { title: 'Chuyển lớp', ok: 'Chuyển lớp' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'SV_QuyetDinh_ThucThi/ThucThi_ChuyenLop', strId: '', strQLSV_QuyetDinh_Id: st.qd.ID, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                strDaoTao_LopQuanLy_Cu_Id: s('cu').value, strDaoTao_LopQuanLy_Moi_Id: s('lop').value, strTrangThaiNguoiHoc_Moi_Id: s('ttm').value,
                strTo_Moi_Id: (s('to').value || '').trim(), strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); ui.swap(zTT, zQD); taiSV(); })
                .catch(function (err) { ums.api.handle(err, 'chuyển lớp'); });
        });
    }

    /* ---------- Sự kiện ------------------------------------------------------------ */
    zQD.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute && t.hasAttribute('data-ttall')) qa(x('svt'), 'input[data-ttx], input[data-ttc]').forEach(function (c) { c.checked = t.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        var id = b.getAttribute('data-id');
        switch (b.getAttribute('data-a')) {
            case 'tim': crud.load(1); break;
            case 'mo': var r = Q.tim(crud.rows, id); if (r) crud.showForm(r); break;
            case 'mo-tt': var sv = Q.tim(st.sv, id); if (sv) moThucThi(sv); break;
            case 'tt-dong': ui.swap(zTT, zQD); break;
            case 'chuyenlop': chuyenLop(id); break;
            case 'huy': huy([id]); break;
            case 'huy-ds': huy(qa(x('svt'), 'input[data-ttx]:checked').map(function (c) { return c.getAttribute('data-ttx'); })); break;
            case 'tt-ds': thucThiDS(); break;
        }
    });
    root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && ev.target.matches && ev.target.matches('[data-f="q"]')) { ev.preventDefault(); crud.load(1); }
    });
})();
