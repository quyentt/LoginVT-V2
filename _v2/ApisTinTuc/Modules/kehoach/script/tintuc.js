/* =========================================================================
   Tin tức — bảng tin (phân hệ Tin tức)
   Bản gốc: ApisTinTuc/Modules/kehoach/html/tintuc.html + script/tintuc.js (3.017 dòng)
   ---------------------------------------------------------------------------
   Một cột như bản gốc: thanh lọc (tiêu đề · từ ngày · đến ngày · đơn vị · ứng dụng · chuyên mục · tình trạng)
   + bảng tin + ba khung thay chỗ màn: biểu mẫu Thêm / Sửa (ums.crud), "Phạm vi áp dụng" và
   "Gửi Email thông báo" (ums.pat.formTrang). Hộp thoại chỉ cho: Quản lý chuyên mục, Import Excel, xác nhận, tiến độ.

   Lời gọi (chép nguyên văn):
       Danh mục TINTUC.CHUYENMUC (ô lọc + biểu mẫu), TINTUC.PHEDUYET (ô Tình trạng)
       CMS_UngDung/LayDanhSach              GET   strTuKhoa '', pageIndex 1, pageSize 1000, dTrangThai 1 → ô Ứng dụng (TENUNGDUNG)
       edu.system.getList_CoCauToChuc       → ums.ref.coCauToChuc({ iTrangThai: 1 }) → ô Đơn vị (TEN)
       TT_BangTin/LayDanhSach               GET   strTuKhoa, strTuNgay, strDenNgay, strChuyenMuc_Id, strChung_UngDung_Id,
                                                  dTinQuanTrong -1, strDaoTao_CoCauToChuc_Id, strTrangThaiDuyet_Id, dHieuLuc -1, phân trang máy chủ
       TS_TinTuc_MH/DSA4FSgvFTQiHgMgLyYVKC8eAikoFSgkNQPP  func pkg_tintuc.LayTinTuc_BangTin_ChiTiet  strTinTuc_BangTin_Id (trước khi sửa / gửi email)
       TT_BangTin/ThemMoi | CapNhat         POST  strId, strTieuDe, strMoTa '', strNoiDung, strChuyenMuc_Id, strChung_UngDung_Id, dTinQuanTrong,
                                                  dHieuLuc 1, strNgayBatDau, strNgayKetThuc, strDaoTao_CoCauToChuc_Id, strDuongDanAnhHienThi
       TT_BangTin/Xoa                       POST  strIds = MỘT id — mỗi dòng đánh dấu một lời gọi (như gốc)
       SV_Files/LayDanhSach | ThemMoi | Xoa       tệp đính kèm của tin (gốc viewFiles / saveFiles "SV_Files")
       Ảnh bìa: Handler up_files (ums.files.avatar — gốc edu.system.uploadAvatar)
       Phạm vi áp dụng (ums.pat.phamVi = edu.extend.genModal_SinhVien):
         TT_PhamVi/LayDanhSach              GET   strTuKhoa '', strPhamViApDung_Id '', strTinTuc_BangTin_Id, pageIndex 1, pageSize
         TT_PhamVi/ThemMoi                  POST  strTinTuc_BangTin_Id, strPhamViApDung_Id, strQLSV_TrangThai_Id '' — mỗi phạm vi một lời gọi
         TT_PhamVi/Xoa                      POST  strIds
       Gửi email:
         Hệ / Khoá / CT / Lớp chọn nhiều: edu.system.getList_* → ums.ref.heDaoTao / khoaDaoTao / chuongTrinh / lopQuanLy (tham số như gốc)
         SV_HoSo/LayDanhSach                GET   strTuKhoa, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id, strLopQuanLy_Id (nối phẩy), pageIndex, pageSize 20
         CMS_NguoiDung/SendEmail            POST  mailTo, mailSubject "[THÔNG BÁO] <tiêu đề>", strBody, arrFileDinhKem [] — từng sinh viên có email
       Quản lý chuyên mục (hộp thoại):
         CMS_DanhMucTenBang/LayDanhSach     GET   strTuKhoa 'TINTUC.CHUYENMUC', pageSize 20, dTrangThai 1 → id bảng (MADANHMUC / MA khớp)
         CMS_DanhMucDuLieu/LayDanhSach      GET   strCHUNG_TENDANHMUC_Id, pageSize 1000, dTrangThai 1
         CMS_DanhMucDuLieu/ThemMoi | CapNhat | Xoa   POST (tham số như gốc: dHeSo1-3 0, strThongTin1-8 '')

   Giữ như gốc:
     · Sửa đọc chi tiết (nội dung) qua pkg_tintuc.LayTinTuc_BangTin_ChiTiet; tin ưu tiên mặc định KHÔNG đánh dấu khi thêm (rewrite gốc bỏ đánh dấu).
     · Gửi email chỉ tới sinh viên ĐÃ ĐÁNH DẤU và có email (gốc processSendEmail_ToSelected); thân thư HTML ngắn như sendEmail_Batch_Selected.
     · Import Excel chỉ ĐÁNH DẤU sinh viên đang hiện trong bảng (khớp Email hoặc MaSV), không gửi gì lên máy chủ; tệp mẫu 3 cột MaSV · Email · HoTen.
   Khác gốc (lỗi rõ ràng, làm theo ý định — KIỂM TRÊN HOST):
     · Cột "Ngày tạo" gốc đổ NGAYBATDAU, "Người tạo" đổ NGAYKETTHUC (chép nhầm) → đổ NGAYTAO_DD_MM_YYYY / NGUOITAO_TAIKHOAN (tên cột đoán).
     · Cột "Duyệt" gốc đọc NGAYKETTHU (sai chính tả → luôn trống) → đổ TRANGTHAIDUYET_TEN (đoán).
     · Danh sách phạm vi gốc lấy 20 dòng / trang có phân trang tự vẽ; khung chung không phân trang → lấy pageSize 1000.
     · Chi tiết tin thay cả dòng (crud) thay vì gộp dòng + chi tiết như gốc — thủ tục chi tiết phải trả đủ cột.
   Cố ý bỏ (mã chết / không có trên màn): nút "Phóng to" trình soạn thảo tự chế; các hàm Hệ / Khoá / CT / Lớp / Học kỳ / Năm nhập học / Khoa QL
   của vùng tìm kiếm không có ô; khung "Gửi email trong phạm vi" (btnSendEmail_PhamVi, tblSinhVien_PhamVi, dropSearch_*_PV, countSinhVien
   rỗng) — html gốc không có các phần tử đó; XoaTin (Xoa_TinTuc_BangTin, không nơi nào gọi); arrValid kiểm ô txtTinTuc_So không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tt-tintuc');
    if (!root) return;
    function esc(s) { return ui.esc(s == null ? '' : String(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rows) || []; }
    var UD_CALL = { action: 'CMS_UngDung/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 };
    var CCTC_CALL = { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo', dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' };
    var edNoiDung = null;

    /* ---------- Danh sách + biểu mẫu ---------- */
    var crud = ums.crud({
        root: root,
        title: 'Tin tức',
        listTitle: 'Danh sách',
        formTitle: 'tin tức',
        icon: 'fa-newspaper',
        filters: [
            { key: 'q', type: 'text', label: 'Tìm theo tiêu đề...' },
            { key: 'tu', type: 'text', label: 'Từ ngày' },
            { key: 'den', type: 'text', label: 'Đến ngày' },
            { key: 'dv', type: 'select', label: 'Chọn đơn vị', source: { call: CCTC_CALL, name: 'TEN' } },
            { key: 'ud', type: 'select', label: 'Chọn ứng dụng', source: { call: UD_CALL, name: 'TENUNGDUNG' } },
            { key: 'cm', type: 'select', label: 'Chọn chuyên mục', source: { dm: 'TINTUC.CHUYENMUC' } },
            { key: 'tt', type: 'select', label: 'Chọn tình trạng', source: { dm: 'TINTUC.PHEDUYET' } }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TT_BangTin/LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strTuNgay: f.tu || '', strDenNgay: f.den || '',
                    strChuyenMuc_Id: f.cm || '', strChung_UngDung_Id: f.ud || '', dTinQuanTrong: -1, strDaoTao_CoCauToChuc_Id: f.dv || '',
                    strTrangThaiDuyet_Id: f.tt || '', dHieuLuc: -1 };
            }
        },
        columns: [
            { title: 'Tiêu đề', prop: 'TIEUDE' },
            { title: 'Chuyên mục', prop: 'CHUYENMUC_TEN' },
            { title: 'Ngày bắt đầu đăng', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Ngày hết hạn đăng', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Thông tin từ đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Hiển thị cho ứng dụng', prop: 'CHUNG_UNGDUNG_TEN', cls: 'is-center' },
            { title: 'Mục ưu tiên', cls: 'is-center', render: function (r) { return String(r.TIEUDIEM) === '1' ? ui.badge('Quan trọng', 'warn') : ''; } },
            { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (r) { return esc(r.NGAYTAO_DD_MM_YYYY || r.NGAYTAO || ''); } },
            { title: 'Người tạo', render: function (r) { return esc(r.NGUOITAO_TAIKHOAN || r.NGUOITAO || ''); } },
            { title: 'Duyệt', cls: 'is-center', render: function (r) { return esc(r.TRANGTHAIDUYET_TEN || r.PHEDUYET_TEN || ''); } }
        ],
        rowActions: [
            { icon: 'fa-users', title: 'Phạm vi', onClick: function (row) { moPhamVi(row); } },
            { icon: 'fa-envelope', title: 'Gửi Email', onClick: function (row) { moGuiEmail(row); } }
        ],
        detail: function (row) {
            return { action: 'TS_TinTuc_MH/DSA4FSgvFTQiHgMgLyYVKC8eAikoFSgkNQPP', func: 'pkg_tintuc.LayTinTuc_BangTin_ChiTiet', strTinTuc_BangTin_Id: row.ID };
        },
        fields: [
            { type: 'legend', label: 'Thông tin cơ bản' },
            { key: 'strTieuDe', col: 'TIEUDE', label: 'Tiêu đề', required: true, span: true, placeholder: 'Nhập tiêu đề tin tức...' },
            { key: 'strChuyenMuc_Id', col: 'CHUYENMUC_ID', label: 'Chuyên mục', type: 'select', span: true, source: { dm: 'TINTUC.CHUYENMUC' } },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu đăng', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày hết hạn đăng', type: 'date' },
            { type: 'legend', label: 'Phân loại & Phạm vi hiển thị' },
            { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Tin tức từ đơn vị', type: 'select', source: { call: CCTC_CALL, name: 'TEN' } },
            { key: 'strChung_UngDung_Id', col: 'CHUNG_UNGDUNG_ID', label: 'Hiển thị ở ứng dụng', type: 'select', source: { call: UD_CALL, name: 'TENUNGDUNG' } },
            { type: 'legend', label: 'Nội dung tin tức' },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung chi tiết', type: 'textarea', span: true },
            { key: '_tep', type: 'files', label: 'File đính kèm', api: 'SV_Files' },
            { type: 'legend', label: 'Ảnh trang bìa & ưu tiên' },
            { key: 'strDuongDanAnhHienThi', col: 'DUONGDANANHHIENTHI', label: 'Ảnh trang bìa', type: 'avatar', icon: 'fa-image' },
            { type: 'checks', label: 'Tin ưu tiên', items: [{ key: 'dTinQuanTrong', col: 'TINQUANTRONG', label: 'Đánh dấu là tin ưu tiên (hiển thị nổi bật trên trang tin tức)', on: 1, off: 0 }] }
        ],
        onForm: function (row) {
            // Nút "Quản lý" chuyên mục cạnh nhãn ô Chuyên mục (gốc: btnQuickAdd_ChuyenMuc)
            var sel = root.querySelector('select[data-scope="form"][data-k="strChuyenMuc_Id"]');
            var lbl = sel && sel.closest('.ums-field') && sel.closest('.ums-field').querySelector('.ums-field__label');
            if (lbl && !lbl.querySelector('[data-tt="cm"]')) {
                lbl.insertAdjacentHTML('beforeend', ' ' + ui.btn('edit', { text: 'Quản lý', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-tt': 'cm', type: 'button' } }));
            }
            // Nội dung: CKEditor (lùi về textarea khi không có)
            var ta = root.querySelector('textarea[data-scope="form"][data-k="strNoiDung"]');
            if (edNoiDung) { try { edNoiDung.destroy(); } catch (e) { /* đã gỡ */ } edNoiDung = null; }
            if (ta) ums.editor.tao(ta, { cao: 320 }).then(function (ed) { edNoiDung = ed; ed.set(row ? (row.NOIDUNG || '') : ''); });
        },
        save: function (v, row) {
            return {
                action: 'TT_BangTin/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST',
                strId: row ? row.ID : '',
                strTieuDe: v.strTieuDe, strMoTa: '',
                strNoiDung: edNoiDung ? edNoiDung.get() : (v.strNoiDung || ''),
                strChuyenMuc_Id: v.strChuyenMuc_Id || '', strChung_UngDung_Id: v.strChung_UngDung_Id || '',
                dTinQuanTrong: v.dTinQuanTrong ? 1 : 0, dHieuLuc: 1,
                strNgayBatDau: v.strNgayBatDau || '', strNgayKetThuc: v.strNgayKetThuc || '',
                strDaoTao_CoCauToChuc_Id: v.strDaoTao_CoCauToChuc_Id || '',
                strDuongDanAnhHienThi: v.strDuongDanAnhHienThi || ''
            };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: 'TT_BangTin/Xoa', method: 'POST', strIds: id }; }); }
    });
    // Hai ô lọc ngày (gốc input-datepicker) — ums.crud chỉ có ô chữ / ô chọn ở thanh lọc
    ['tu', 'den'].forEach(function (k) { var el = root.querySelector('input[data-scope="filter"][data-k="' + k + '"]'); if (el) ui.datepicker(el); });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-tt="cm"]');
        if (b) { ev.preventDefault(); moChuyenMuc(); }
    });

    /* ---------- Phạm vi áp dụng (khung thay chỗ màn) ---------- */
    function moPhamVi(row) {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-u-mb-2"><b>' + esc(row.TIEUDE) + '</b></div><div data-z="pv"></div>';
        var pv = pat.phamVi(body.querySelector('[data-z="pv"]'), {
            list: function (id) { return { action: 'TT_PhamVi/LayDanhSach', method: 'GET', strTuKhoa: '', strPhamViApDung_Id: '', strTinTuc_BangTin_Id: id, pageIndex: 1, pageSize: 1000 }; },
            save: function (pvId, id) { return { action: 'TT_PhamVi/ThemMoi', method: 'POST', strTinTuc_BangTin_Id: id, strPhamViApDung_Id: pvId, strQLSV_TrangThai_Id: '' }; },
            remove: function (rowId) { return { action: 'TT_PhamVi/Xoa', method: 'POST', strIds: rowId }; }
        });
        pat.formTrang({
            host: root, title: 'Phạm vi áp dụng', icon: 'fa-users', cols: 1, body: body,
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                pv.save(row.ID).then(function () { ui.toast('Đã lưu phạm vi áp dụng', 'ok'); pv.load(row.ID); });
                return false;
            } }]
        });
        pv.load(row.ID);
    }

    /* ---------- Gửi Email thông báo (khung thay chỗ màn) ---------- */
    function moGuiEmail(row) {
        ums.api.call({ action: 'TS_TinTuc_MH/DSA4FSgvFTQiHgMgLyYVKC8eAikoFSgkNQPP', func: 'pkg_tintuc.LayTinTuc_BangTin_ChiTiet', strTinTuc_BangTin_Id: row.ID, silent: true })
            .then(function (r) { var d = Array.isArray(r.data) ? r.data[0] : r.data; return Object.assign({}, row, d || {}); })
            .catch(function () { return row; })
            .then(veGuiEmail);
    }
    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" multiple data-f="' + k + '" data-ph="' + esc(ph) + '"></select></div>'; }
    function veGuiEmail(tin) {
        var body = document.createElement('div');
        body.innerHTML =
            '<div class="ums-u-mb-4"><div class="ums-kv"><span>Tiêu đề</span><b>' + esc(tin.TIEUDE) + '</b></div>' +
            '<div class="ums-kv"><span>Chuyên mục</span><b>' + esc(tin.CHUYENMUC_TEN) + '</b></div>' +
            '<div class="ums-kv"><span>Ngày đăng</span><b>' + esc(tin.NGAYBATDAU) + '</b></div></div>' +
            '<div class="ums-legend"><i class="fa-light fa-filter"></i> Chọn đối tượng nhận email</div>' +
            '<div class="ums-grid ums-grid--4 ums-u-mb-2">' + sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') + '</div>' +
            '<div class="ums-grid ums-grid--4 ums-u-mb-4"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập mã SV, họ tên..." autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div></div>' +
            '<div class="ums-legend"><i class="fa-light fa-users"></i> Danh sách sinh viên <span class="ums-u-fz13 ums-u-muted" style="float:right">Đã chọn: <b data-z="dachon">0</b> sinh viên</span></div>' +
            '<div class="ums-u-mb-2">' + ui.btn('importer', { text: 'Import Excel', attr: { 'data-a': 'import' } }) + ' ' +
            ui.btn('confirm', { text: 'Chọn tất cả', mod: 'ghost', attr: { 'data-a': 'all' } }) + ' ' +
            ui.btn('close', { text: 'Bỏ chọn tất cả', attr: { 'data-a': 'none' } }) + '</div>' +
            '<div data-z="bang"></div>';
        var f = function (k) { return body.querySelector('[data-f="' + k + '"]'); };
        var he = f('he'), khoa = f('khoa'), ct = f('ct'), lop = f('lop');
        var rows = [], page = { index: 1, size: 20, total: 0 }, chon = {};   // chon[ID] = { email, maso }

        pat.formTrang({
            host: root, title: 'Gửi Email Thông Báo Tin Tức', icon: 'fa-envelope', cols: 1, body: body,
            buttons: [{ text: 'Gửi Email', kind: 'confirm', icon: 'fa-envelope', onClick: function () { gui(); return false; } }]
        });
        [he, khoa, ct, lop].forEach(function (s) { ui.select2(s, { placeholder: s.getAttribute('data-ph') }); });
        pat.chain([he, khoa, ct, lop]);

        function v(el) { return pat.val(el); }
        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(he, arr(d), { name: 'TENHEDAOTAO' }); });
        function napKhoa() { ums.ref.khoaDaoTao({ strHeDaoTao_Id: v(he), strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(khoa, arr(d), { name: 'TENKHOA' }); }); }
        function napCT() { ums.ref.chuongTrinh({ strKhoaDaoTao_Id: v(khoa), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '', strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(ct, arr(d), { name: 'TENCHUONGTRINH' }); }); }
        function napLop() { ums.ref.lopQuanLy({ strCoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v(he), strKhoaDaoTao_Id: v(khoa), strNganh_Id: '', strLoaiLop_Id: '', strToChucCT_Id: v(ct), strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(lop, arr(d), { name: 'TEN' }); }); }
        he.addEventListener('change', function () { napKhoa(); napLop(); });
        khoa.addEventListener('change', function () { napCT(); napLop(); });
        ct.addEventListener('change', napLop);

        function demChon() { body.querySelector('[data-z="dachon"]').textContent = Object.keys(chon).length; }
        function ve() {
            ui.table({
                el: body.querySelector('[data-z="bang"]'), rows: rows, stt: true, empty: 'Không tìm thấy sinh viên nào',
                page: { index: page.index, size: page.size, total: page.total, onChange: function (p) { tai(p); } },
                columns: [
                    { title: 'Mã SV', prop: 'MASO', cls: 'is-center is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc((r.HODEM || '') + ' ' + (r.TEN || '')); } },
                    { title: 'Email', prop: 'TTLL_EMAILCANHAN' },
                    { title: 'Lớp', prop: 'LOP', cls: 'is-center' },
                    { title: 'Khóa', prop: 'KHOADAOTAO', cls: 'is-center' },
                    { title: 'Hệ', prop: 'HEDAOTAO', cls: 'is-center' },
                    { title: 'Trạng thái', prop: 'QLSV_NGUOIHOC_TRANGTHAI', cls: 'is-center' },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r) { return '<input type="checkbox" data-ck="' + esc(r.ID) + '"' + (chon[r.ID] ? ' checked' : '') + '>'; } }
                ]
            });
            demChon();
        }
        function tai(p) {
            page.index = p || 1;
            return ums.api.call({ action: 'SV_HoSo/LayDanhSach', method: 'GET', strTuKhoa: (f('q').value || '').trim(),
                strHeDaoTao_Id: v(he), strKhoaDaoTao_Id: v(khoa), strChuongTrinh_Id: v(ct), strLopQuanLy_Id: v(lop), pageIndex: page.index, pageSize: page.size })
                .then(function (r) { rows = arr(r.data); page.total = Number(r.pager) || rows.length; ve(); })
                .catch(function (err) { ums.api.handle(err, 'danh sách sinh viên'); });
        }
        function datChon(r, co) { if (co) chon[r.ID] = { email: r.TTLL_EMAILCANHAN || '', maso: r.MASO || '' }; else delete chon[r.ID]; }
        body.addEventListener('change', function (ev) {
            var c = ev.target;
            if (!c.matches('input[type=checkbox][data-ck]')) return;
            if (c.getAttribute('data-ck') === 'all') { rows.forEach(function (r) { datChon(r, c.checked); }); ve(); return; }
            var r = rows.filter(function (x) { return String(x.ID) === c.getAttribute('data-ck'); })[0];
            if (r) datChon(r, c.checked);
            demChon();
        });
        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'tim') tai(1);
            else if (a === 'all') { rows.forEach(function (r) { datChon(r, true); }); ve(); }
            else if (a === 'none') { rows.forEach(function (r) { datChon(r, false); }); ve(); }
            else if (a === 'import') moImport();
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        tai(1);

        function gui() {
            var ds = Object.keys(chon).map(function (id) { return chon[id]; });
            if (!ds.length) { ui.toast('Vui lòng chọn ít nhất 1 sinh viên để gửi email!', 'warn'); return; }
            var coMail = ds.filter(function (x) { return x.email; });
            if (!coMail.length) { ui.toast('Không có sinh viên nào có email để gửi!', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn gửi email đến ' + ds.length + ' sinh viên đã chọn không?', { ok: 'Gửi Email' }).then(function (yes) {
                if (!yes) return;
                var body = '<html><body><h2>THÔNG BÁO TIN TỨC</h2><h3>' + esc(tin.TIEUDE) + '</h3><div>' + (tin.NOIDUNG || '') + '</div><p>Trân trọng!</p></body></html>';
                ui.batch(coMail.map(function (sv) {
                    return { action: 'CMS_NguoiDung/SendEmail', method: 'POST', mailTo: sv.email, mailSubject: '[THÔNG BÁO] ' + (tin.TIEUDE || ''), strBody: body, arrFileDinhKem: [] };
                }), { title: 'Đang gửi email đến ' + coMail.length + ' sinh viên...' }).then(function (r) {
                    ui.toast('Đã gửi email đến ' + r.ok + ' sinh viên' + (r.fail ? ', lỗi ' + r.fail : ''), r.fail ? 'warn' : 'ok');
                });
            });
        }

        /* Import Excel để đánh dấu sinh viên (gốc: modalImportExcel_SinhVien, thư viện XLSX đọc ở trình duyệt) */
        function moImport() {
            var dlg = ui.dialog({
                title: 'Import Excel để chọn sinh viên', icon: 'fa-file-excel', size: 'md',
                body: '<div class="ums-u-mb-3"><b>Hướng dẫn:</b><ul class="ums-u-mb-0"><li>File Excel cần có cột <b>Email</b> hoặc <b>MaSV</b></li>' +
                    '<li>Hệ thống sẽ tự động đánh dấu sinh viên có trong danh sách đang hiện</li><li>Định dạng: .xlsx, .xls, .csv</li></ul></div>' +
                    ui.field('Chọn file Excel hoặc CSV', ui.file({ key: 'tep', accept: '.xlsx,.xls,.csv' })) +
                    '<div class="ums-u-mt-3" data-z="kq" hidden></div>',
                buttons: [
                    { text: 'Tải file mẫu', kind: 'excel', onClick: function () { napXLSX().then(mauExcel).catch(function (e) { ui.toast(e.message, 'bad'); }); return false; } },
                    { text: 'Xử lý Import', kind: 'confirm', onClick: function (d) { xuLy(d); return false; } }
                ]
            });
            function xuLy(d) {
                var inp = d.body.querySelector('input[data-k="tep"]'), kq = d.body.querySelector('[data-z="kq"]');
                var file = inp && inp.files && inp.files[0];
                if (!file) { ui.toast('Vui lòng chọn file Excel hoặc CSV!', 'warn'); return; }
                var ten = file.name.toLowerCase();
                if (!/\.(xlsx|xls|csv)$/.test(ten)) { ui.toast('Chỉ hỗ trợ file .xlsx, .xls hoặc .csv!', 'warn'); return; }
                napXLSX().then(function (XLSX) {
                    var rd = new FileReader();
                    rd.onload = function (e) {
                        var wb = /\.csv$/.test(ten) ? XLSX.read(e.target.result, { type: 'string' }) : XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                        var data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        if (!data.length) { ui.toast('File không có dữ liệu!', 'warn'); return; }
                        var co = 0, khong = [];
                        data.forEach(function (x) {
                            var email = String(x.Email || x.email || x.EMAIL || '').toLowerCase(), ma = String(x.MaSV || x.masv || x.MASV || x.MaSv || '');
                            var r = rows.filter(function (s) { return (email && String(s.TTLL_EMAILCANHAN || '').toLowerCase() === email) || (ma && String(s.MASO || '') === ma); })[0];
                            if (r) { datChon(r, true); co++; } else khong.push(email || ma);
                        });
                        ve();
                        kq.hidden = false;
                        kq.innerHTML = '<div><b>Kết quả Import:</b><br>- Đã đánh dấu: <b>' + co + '</b> sinh viên' +
                            (khong.length ? '<br>- Không tìm thấy: <b>' + khong.length + '</b> sinh viên<br><small>' + esc(khong.slice(0, 5).join(', ')) +
                                (khong.length > 5 ? ' và ' + (khong.length - 5) + ' sinh viên khác...' : '') + '</small>' : '') + '</div>';
                        setTimeout(function () { d.close(); }, 2000);
                    };
                    if (/\.csv$/.test(ten)) rd.readAsText(file, 'UTF-8'); else rd.readAsArrayBuffer(file);
                }).catch(function (e) { ui.toast(e.message, 'bad'); });
            }
            function mauExcel(XLSX) {
                var wb = XLSX.utils.book_new();
                var ws = XLSX.utils.aoa_to_sheet([['MaSV', 'Email', 'HoTen'], ['20233195', '20233195@eaut.edu.vn', 'Nguyen Van A'], ['20233196', '20233196@eaut.edu.vn', 'Tran Thi B']]);
                XLSX.utils.book_append_sheet(wb, ws, 'DanhSachSinhVien');
                XLSX.writeFile(wb, 'MauImportSinhVien.xlsx');
            }
            return dlg;
        }
    }
    var pXLSX = null;
    function napXLSX() {
        if (window.XLSX && window.XLSX.utils) return Promise.resolve(window.XLSX);
        if (!pXLSX) pXLSX = new Promise(function (ok, loi) {
            var s = document.createElement('script');
            s.src = 'assets/vendor/xlsx/xlsx.bundle.js';
            s.onload = function () { ok(window.XLSX); };
            s.onerror = function () { pXLSX = null; loi(new Error('Không tải được thư viện Excel (assets/vendor/xlsx)')); };
            document.head.appendChild(s);
        });
        return pXLSX;
    }

    /* ---------- Quản lý chuyên mục (hộp thoại — gốc modalQuickAdd_ChuyenMuc) ---------- */
    var tenBangId = '';
    function layTenBangId() {
        if (tenBangId) return Promise.resolve(tenBangId);
        return ums.api.call({ action: 'CMS_DanhMucTenBang/LayDanhSach', method: 'GET', strTuKhoa: 'TINTUC.CHUYENMUC', strChung_TenDanhMuc_Cha_Id: '', strNhomDanhMuc_Id: '', pageIndex: 1, pageSize: 20, dTrangThai: 1 })
            .then(function (r) {
                var row = arr(r.data).filter(function (x) { return String(x.MADANHMUC || x.MA || '').toUpperCase() === 'TINTUC.CHUYENMUC'; })[0];
                if (!row) throw new Error('Chưa khai báo bảng danh mục TINTUC.CHUYENMUC trong hệ thống. Vui lòng vào Danh mục dữ liệu để tạo trước!');
                tenBangId = row.ID;
                return tenBangId;
            });
    }
    function napLaiChuyenMuc(chonId) {
        // Nạp lại hai ô Chuyên mục (lọc + biểu mẫu) — không qua ums.api.dm vì ô đó nhớ kết quả
        return ums.api.call({ action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM', method: 'GET', silent: true, strMaBangDanhMuc: 'TINTUC.CHUYENMUC', strTieuChiSapXep: '' }).then(function (r) {
            var ds = arr(r.data);
            ['filter', 'form'].forEach(function (sc) {
                var s = root.querySelector('select[data-scope="' + sc + '"][data-k="' + (sc === 'filter' ? 'cm' : 'strChuyenMuc_Id') + '"]');
                if (!s) return;
                pat.fill(s, ds, { head: s.getAttribute('data-ph') || '-- Chọn --' });
                if (sc === 'form' && chonId) { s.value = chonId; if (window.jQuery) jQuery(s).trigger('change'); }
            });
        }).catch(function () { /* ô giữ nguyên */ });
    }
    function moChuyenMuc() {
        var ds = [], suaId = '';
        var dlg = ui.dialog({
            title: 'Quản lý chuyên mục tin tức', icon: 'fa-folder-tree', size: 'lg',
            body: '<div class="ums-u-mb-2"><b>Danh sách chuyên mục</b> <span class="ums-badge ums-badge--info" data-z="tong">0</span> ' +
                ui.btn('reload', { attr: { 'data-a': 'tai' } }) + '</div><div data-z="bang" class="ums-u-mb-4"></div>' +
                '<div class="ums-legend" data-z="tieude">Thêm chuyên mục mới</div>' +
                '<div class="ums-grid ums-grid--2">' + ui.field('Mã', '<input class="ums-input" data-k="ma" placeholder="VD: TB_CHUNG">', { required: true }) +
                ui.field('Tên', '<input class="ums-input" data-k="ten" placeholder="VD: Thông báo chung">', { required: true }) +
                '<div style="grid-column:1 / -1">' + ui.field('Mô tả', '<textarea class="ums-input" data-k="mota" rows="2" placeholder="Mô tả ngắn về chuyên mục (không bắt buộc)"></textarea>') + '</div></div>' +
                '<div class="ums-u-mt-2">' + ui.btn('reload', { text: 'Làm mới', attr: { 'data-a': 'moi' } }) + ' ' + ui.btn('save', { text: 'Thêm mới', attr: { 'data-a': 'luu' } }) + '</div>'
        });
        var q = function (k) { return dlg.body.querySelector('[data-k="' + k + '"]'); };
        function veBang() {
            dlg.body.querySelector('[data-z="tong"]').textContent = ds.length;
            ui.table({ el: dlg.body.querySelector('[data-z="bang"]'), rows: ds, stt: true, empty: 'Chưa có chuyên mục nào. Nhập thông tin bên dưới để tạo mới.',
                columns: [
                    { title: 'Mã', render: function (r) { return '<code>' + esc(r.MA) + '</code>'; } },
                    { title: 'Tên', prop: 'TEN' },
                    { title: 'Mô tả', prop: 'MOTA' },
                    { title: 'Thao tác', cls: 'is-center is-actions', render: function (r) { return ui.actions(r.ID, ['edit', 'del']); } }
                ] });
        }
        function tai() {
            layTenBangId().then(function (id) {
                return ums.api.call({ action: 'CMS_DanhMucDuLieu/LayDanhSach', method: 'GET', strCha_Id: '', strTuKhoa: '', strCHUNG_TENDANHMUC_Id: id, strTieuChiSapXep: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 });
            }).then(function (r) { ds = arr(r.data); veBang(); })
              .catch(function (err) { ui.toast(err.message || String(err), 'warn'); });
        }
        function lamMoi() {
            suaId = ''; q('ma').value = ''; q('ten').value = ''; q('mota').value = '';
            dlg.body.querySelector('[data-z="tieude"]').textContent = 'Thêm chuyên mục mới';
            dlg.body.querySelector('[data-a="luu"]').lastChild.textContent = ' Thêm mới';
        }
        function sua(id) {
            var r = ds.filter(function (x) { return String(x.ID) === String(id); })[0];
            if (!r) { ui.toast('Không tìm thấy chuyên mục để sửa!', 'warn'); return; }
            suaId = r.ID; q('ma').value = r.MA || ''; q('ten').value = r.TEN || ''; q('mota').value = r.MOTA || '';
            dlg.body.querySelector('[data-z="tieude"]').textContent = 'Đang sửa: ' + (r.TEN || '');
            dlg.body.querySelector('[data-a="luu"]').lastChild.textContent = ' Cập nhật';
            q('ten').focus();
        }
        function luu() {
            var ma = q('ma').value.trim(), ten = q('ten').value.trim(), mota = q('mota').value.trim();
            if (!ma) { ui.toast('Vui lòng nhập Mã!', 'warn'); q('ma').focus(); return; }
            if (!ten) { ui.toast('Vui lòng nhập Tên!', 'warn'); q('ten').focus(); return; }
            layTenBangId().then(function (id) {
                return ums.api.call({ action: 'CMS_DanhMucDuLieu/' + (suaId ? 'CapNhat' : 'ThemMoi'), method: 'POST',
                    strMa: ma, strTen: ten, strChung_TenDanhMuc_Cha_Id: '', strCHUNG_TENDANHMUC_Id: id, dHeSo1: 0, dHeSo2: 0, dHeSo3: 0,
                    strThongTin1: '', strThongTin2: '', strThongTin3: '', strThongTin4: '', strThongTin5: '', strThongTin6: '', strThongTin7: '', strThongTin8: '',
                    strMoTa: mota, strId: suaId, dTrangThai: 1 });
            }).then(function (r) {
                var id = suaId || (r.raw && (r.raw.Id || r.raw.ID)) || '';
                ui.toast(suaId ? 'Cập nhật chuyên mục thành công!' : 'Thêm chuyên mục thành công!', 'ok');
                lamMoi(); tai(); napLaiChuyenMuc(id);
            }).catch(function (err) { ums.api.handle(err, 'lưu chuyên mục'); });
        }
        function xoa(id) {
            var r = ds.filter(function (x) { return String(x.ID) === String(id); })[0];
            ui.confirm('Bạn có chắc chắn muốn xóa chuyên mục "' + (r ? r.TEN : '') + '"?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'CMS_DanhMucDuLieu/Xoa', method: 'POST', strId: id, dTrangThai: 1 }).then(function () {
                    ui.toast('Đã xóa chuyên mục!', 'ok');
                    if (suaId === id) lamMoi();
                    tai(); napLaiChuyenMuc('');
                }).catch(function (err) { ums.api.handle(err, 'xoá chuyên mục'); });
            });
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a], [data-act]');
            if (!b) return;
            var a = b.getAttribute('data-a');
            if (a === 'tai') tai(); else if (a === 'moi') lamMoi(); else if (a === 'luu') luu();
            else { var act = b.getAttribute('data-act'), id = b.getAttribute('data-id'); if (act === 'edit') sua(id); else if (act === 'del') xoa(id); }
        });
        tai();
    }
})();
