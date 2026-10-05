/* =========================================================================
   Gửi thông báo app sinh viên (phân hệ Tin tức)
   Bản gốc: ApisTinTuc/Modules/kehoach/html/guithongbaoappsinhvien.html + script/guithongbaoappsinhvien.js
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột): khung Tìm kiếm (từ khoá · Tìm kiếm · nút "Thêm tin nhắn" / "Gửi tin nhắn")
   → bảng "Danh sách tin nhắn" (một tab → không vẽ dải tab). Ba vùng thay chỗ (zone-bus):
     · zoneEditTinNhan  biểu mẫu Tiêu đề / Nội dung + Lưu           → ums.pat.formTrang
     · zoneEdit         chọn người nhận: Hệ · Khoá · CT · Lớp / Năm nhập học · Khoa QL / từ khoá ·
                        Tìm kiếm · Import dữ liệu + "Chọn trạng thái sinh viên" + bảng Kết quả tìm kiếm
                        + "Gửi tin nhắn theo danh sách tìm kiếm"        → ums.pat.formTrang + ums.pat.boLocNguoiHoc
     · zoneTinDaGui     ô "thời gian gửi" (đợt gửi) · từ khoá · Tìm kiếm · bảng + "Gửi lại những trường hợp
                        chưa nhận được tin nhắn"                       → ums.pat.formTrang
     · myModal_Upload   Import dữ liệu (chọn tệp · Tải file mẫu · Import) → ums.ui.dialog (việc phụ)

   Lời gọi (TT = TT_ThongBao/, chép nguyên):
     TT/LayDS_ThongBaoTinNhan        GET  strTuKhoa, strNguoiTaoId (= người đăng nhập), iPageNumber, iItemPerPage (phân trang máy chủ)
                                          → ID, TIEUDE, NOIDUNG, NGUOITAO, NGAYTAO
     TT/ThemMoi_ThongBao_TinNhan     POST v1.0  strTieuDe, strNoiDung, strNGUOITAOID       → ID mới ở trường ngoài Data (data.ID)
     TT/Sua_ThongBao_TinNhan         POST v1.0  + strId
     D_BaoCao/LayDanhSachHoSoNhieuNganh  GET  strTuKhoa, strNamNhapHoc, strKhoaQuanLy_Id, strHeDaoTao_Id, strKhoaDaoTao_Id,
                                          strChuongTrinh_Id, strLopQuanLy_Id, strTrangThaiNguoiHoc_Id, strChucNang_Id,
                                          strTN_KeHoach_Id '' (gốc đọc ô AAAAAA không có), strNguoiThucHien_Id, pageIndex 1, pageSize 1000000000
                                          → QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO, QLSV_NGUOIHOC_HODEM, QLSV_NGUOIHOC_NGAYSINH,
                                            QLSV_TRANGTHAINGUOIHOC_TEN, DAOTAO_LOPQUANLY_TEN, DAOTAO_CHUONGTRINH_TEN,
                                            DAOTAO_KHOADAOTAO_TEN, DAOTAO_HEDAOTAO_TEN, DAOTAO_KHOAQUANLY_TEN
     TT/THEMOI_THONGBAO_TINNHAN_DOTGUI   POST v1.0  strTHONGBAO_TINNHAN_ID, strNGUOITAOID, strTIEUDE, strNOIDUNG → Data = id đợt gửi
     TT/TM_THONGBAO_TINNHAN_NGUOIHOC     POST v1.0  MỖI sinh viên một lời gọi: strTHONGBAO_TINNHAN_ID, strTHONGBAO_TINNHAN_DOTGUI_ID,
                                          strQLSV_NGUOIHOC_ID, strTIEUDE, strNOIDUNG, strNGUOITAOID
     TT/Import_GuiTinNhanToiSinhVien GET  v1.0  NguoiThucHien_Id (không tiền tố str — như gốc), strPath (đường dẫn tệp sau ums.upload)
                                          → Data = danh sách SV (cột như trên) thay vào bảng Kết quả; Message hiện "Đã import dữ liệu: …"
     TT/LayDS_TinNhan_DotGui         GET  v1.0  strThongBao_TinNhan_Id → ID, NGAYTAO (ô chọn "thời gian gửi")
     TT/LayDS_TinNhanNguoiHoc_DotGui GET  strTuKhoa, strTinNhan_DotGui_Id, strNguoiTaoId, iPageNumber, iItemPerPage → cột SV + TRANGTHAIGUI
     TT/GuiTinNhanNhungTruongHopChuaNhan  GET v1.0  strTinNhan_DotGui_Id, strNGUOITAOID
     Hệ / Khoá / CT / Lớp / Năm nhập học (KHCT_NamNhapHoc/LayDanhSach) / Khoa QL / trạng thái SV: ums.pat.boLocNguoiHoc
     Tải file mẫu: mở Apistintuc/Modules/Template/DanhSachSVCanGuiTinNhan.xlsx ở gốc ứng dụng (window.open như gốc).

   Giữ như gốc:
     · Tiêu đề / Nội dung là ô nhập THƯỜNG: html gốc đặt id editor_* nhưng .js gốc KHÔNG gọi CKEDITOR / LoadEditor, đọc bằng .val()
       → không dùng ums.editor (tin đẩy lên app là chữ thường).
     · "Gửi tin nhắn theo danh sách tìm kiếm" gửi cho TẤT CẢ dòng đang có trong bảng Kết quả (gốc đọc mọi ô ẩn
       chkGuiTinNhanSinhVien, không có ô đánh dấu) — kết quả Import thay vào bảng rồi gửi y như vậy.
     · Danh sách tin nhắn chỉ gồm tin của người đăng nhập (strNguoiTaoId).
     · Bắt buộc nhập Nội dung; Tiêu đề không bắt buộc (gốc chỉ kiểm nội dung).
   Khác gốc (lỗi rõ ràng):
     · Gốc KHÔNG nạp danh sách tin nhắn khi mở màn (init không gọi getList_TinNhan — bảng trống tới khi bấm Tìm kiếm) → nạp ngay.
     · Năm nhập học: gốc có ô dropSearch_NamNhapHoc_IHD nhưng strNamNhapHoc đọc txtAAAA (không có) → gửi giá trị ô đã chọn.
     · Gửi: hỏi lại, kiểm danh sách không rỗng, gửi từng người qua ums.ui.batch (có tiến độ) rồi báo gộp — gốc bắn tất cả cùng lúc và
       báo "Thực hiện gửi thành công" NGAY khi chưa có phản hồi nào (strErr luôn rỗng lúc đó), gửi 0 người cũng báo thành công.
     · Lưu tin nhắn: gốc gắn thêm một trình xử lý #btnYes mỗi lần bấm Lưu (bấm lần N lưu N lần) → ums.ui.confirm; lưu xong đóng biểu mẫu
       (gốc ở lại biểu mẫu; muốn sửa tiếp thì bấm "Chi tiết").
     · "Gửi lại những trường hợp chưa nhận": bắt buộc chọn thời gian gửi (gốc gửi strTinNhan_DotGui_Id rỗng) + hỏi lại.
     · Luật cha → con Hệ → Khoá → CT → Lớp (boLocNguoiHoc / pat.chain); bỏ resetCombobox của ô chọn nhiều kiểu cũ.
     · Bảng Kết quả tìm kiếm phân trang ở MÁY KHÁCH (gốc đổ hết, bPaginate đã bị ghi chú); gửi vẫn cho cả danh sách.
     · Trạng thái SV nạp qua ums.api.dm('QLSV.TRANGTHAI') (CMS_DanhMucThuocTinh) — gốc gọi CM_DanhMucDuLieu/LayDanhSach cùng mã bảng.
     · Nội dung tin trong bảng hiện dạng chữ, cắt 220 ký tự (gốc đổ thẳng).
   Cố ý bỏ (mã chết):
     · report(): chỉ nhánh MAUTEMPLATEIMPORT (tải file mẫu) chạy được; phần SYS_Report/ThemMoi phía dưới tham chiếu biến không tồn tại
       (strMau_LoaiCauHoiId, strGroupQuestionDetailId, drpStatus) chép từ màn ngân hàng câu hỏi, không nút nào gọi.
     · txtSearch_DT keypress → activeTabFun (hàm không tồn tại). Ô Enter ở từ khoá SV nay chạy tìm kiếm.
     · ckbLKT_RT_All / ckbLKT_IHD (không có trong html). Khối CSS select2-trong-modal cuối html (vỏ cũ).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('tt-guithongbao');
    if (!root) return;

    var TT = 'TT_ThongBao/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cnId() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function toast(m, t) { ui.toast(m, t || 'ok'); }
    function loi(err, noi) { ums.api.handle(err, noi); }

    /* HTML/chuỗi dài → chữ thường, cắt bớt (như guiemail) */
    function chu(html, n) {
        var s = String(e(html)).replace(/<br\s*\/?>|<\/(p|div|li|tr|h[1-6])>/gi, ' ');
        var doc = new DOMParser().parseFromString(s, 'text/html');
        Array.prototype.forEach.call(doc.querySelectorAll('script, style'), function (x) { x.parentNode.removeChild(x); });
        var t = ((doc.body && doc.body.textContent) || '').replace(/\s+/g, ' ').trim();
        return n && t.length > n ? t.slice(0, n) + '…' : t;
    }

    var S = { rows: [], chon: '', trang: { index: 1, size: 10 }, luot: 0 };

    /* ---------- Màn chính: thanh lọc + danh sách tin nhắn ------------------- */
    root.innerHTML =
        pat.page('Gửi thông báo app sinh viên',
            ui.btn('add', { text: 'Thêm tin nhắn', attr: { 'data-a': 'them' } }) +
            ui.btn('save', { text: 'Gửi tin nhắn', icon: 'fa-paper-plane-top', mod: 'primary', attr: { 'data-a': 'gui' } })) +
        pat.filterBar([{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
        pat.panel({ title: 'Danh sách tin nhắn', icon: 'fa-comment-dots', count: 'n', flush: true, zone: 'bang' });

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var oQ = root.querySelector('[data-f="q"]');

    function nap(p) {
        if (p) S.trang.index = p;
        var sh = ++S.luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: TT + 'LayDS_ThongBaoTinNhan', method: 'GET',
            strTuKhoa: (oQ.value || '').trim(), strNguoiTaoId: uid(),
            iPageNumber: S.trang.index, iItemPerPage: S.trang.size
        }).then(function (r) {
            if (sh !== S.luot) return;
            S.rows = arr(r.data);
            ve(Number(r.pager) || S.rows.length);
        }).catch(function (err) {
            if (sh !== S.luot) return;
            z('bang').innerHTML = ui.fail(err.message);
            loi(err, 'LayDS_ThongBaoTinNhan');
        });
    }

    function ve(tong) {
        z('n').textContent = '(' + tong + ')';
        ui.table({
            el: z('bang'), rows: S.rows, empty: 'Chưa có tin nhắn nào',
            columns: [
                { title: 'Tiêu đề', prop: 'TIEUDE' },
                { title: 'Nội dung', render: function (r) { var t = chu(r.NOIDUNG); return '<span title="' + esc(t) + '">' + esc(t.length > 220 ? t.slice(0, 220) + '…' : t) + '</span>'; } },
                { title: 'Người tạo', prop: 'NGUOITAO', cls: 'is-nowrap' },
                { title: 'Ngày tạo', prop: 'NGAYTAO', cls: 'is-center is-nowrap' },
                { title: 'Thao tác', cls: 'is-center is-nowrap is-actions', render: function (r) {
                    var nutDaGui = ui.btn('history', { text: 'Thời gian gửi', cls: 'ums-btn--sm', attr: { 'data-a': 'dagui', 'data-id': e(r.ID) } });
                    var nutChiTiet = ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': 'sua', 'data-id': e(r.ID) } });
                    return nutDaGui + ' ' + nutChiTiet;
                } },
                { title: 'Chọn', cls: 'is-center', width: '64px', render: function (r) {
                    return '<input type="radio" name="tt-gtb-chon" data-chon value="' + esc(e(r.ID)) + '"' + (S.chon === e(r.ID) ? ' checked' : '') + ' title="Chọn tin nhắn để gửi">';
                } }
            ],
            page: { index: S.trang.index, size: S.trang.size, total: tong,
                onChange: function (p) { nap(p); },
                onSize: function (s) { S.trang.size = s; nap(1); } }
        });
    }

    function dong(id) { return S.rows.filter(function (r) { return e(r.ID) === String(id); })[0]; }

    /* ---------- Biểu mẫu Thêm / Sửa tin nhắn (zoneEditTinNhan) ------------ */
    function moForm(row) {
        var body = document.createElement('div');
        body.innerHTML =
            ui.field('Tiêu đề', '<input class="ums-input" data-k="tieude" autocomplete="off">') +
            ui.field('Nội dung', '<textarea class="ums-textarea" data-k="noidung" rows="8"></textarea>', { required: true });
        function q(k) { return body.querySelector('[data-k="' + k + '"]'); }
        if (row) { q('tieude').value = e(row.TIEUDE); q('noidung').value = e(row.NOIDUNG); }
        var id = row ? e(row.ID) : '';
        pat.formTrang({
            host: root, title: row ? 'Sửa tin nhắn' : 'Thêm tin nhắn', icon: 'fa-comment-dots', cols: 1, body: body,
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (api) {
                if (!q('noidung').value.trim()) { toast('Bạn chưa nhập nội dung', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn thực hiện?', { title: row ? 'Sửa tin nhắn' : 'Thêm tin nhắn', ok: 'Lưu' }).then(function (yes) {
                    if (!yes) return;
                    var c = { action: TT + (id ? 'Sua_ThongBao_TinNhan' : 'ThemMoi_ThongBao_TinNhan'), method: 'POST', versionAPI: 'v1.0',
                        strTieuDe: q('tieude').value, strNoiDung: q('noidung').value, strNGUOITAOID: uid() };
                    if (id) c.strId = id;
                    return ums.api.call(c).then(function (r) {
                        id = e(r.raw && (r.raw.ID || r.raw.Id)) || id;
                        toast('Thực hiện thành công');
                        api.close();
                        nap();
                    }).catch(function (err) { loi(err, c.action); });
                });
            } }]
        });
    }

    /* ---------- Khung Gửi tin nhắn: chọn người nhận (zoneEdit) ------------ */
    function moGui(tin) {
        var sv = [], trang = { index: 1, size: 10 }, luot = 0;
        var body = document.createElement('div');
        body.innerHTML =
            '<div class="ums-kv ums-u-mb-4"><span>Tin nhắn</span><b>' + esc(e(tin.TIEUDE)) + '</b></div>' +
            '<div data-z="loc"></div>' +
            pat.panel({ title: 'Kết quả tìm kiếm', icon: 'fa-user-graduate', count: 'n', flush: true, zone: 'bang' });
        function zz(k) { return body.querySelector('[data-z="' + k + '"]'); }

        var f = pat.formTrang({
            host: root, title: 'Gửi tin nhắn', icon: 'fa-paper-plane-top', cols: 1, body: body,
            buttons: [{ text: 'Gửi tin nhắn theo danh sách tìm kiếm', kind: 'save', icon: 'fa-paper-plane-top', mod: 'primary', keepOpen: true,
                onClick: function (api) { gui(api); } }]
        });

        var loc = pat.boLocNguoiHoc(zz('loc'), {
            hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql'], ['q', 'nut']],
            nut: '<div class="ums-field ums-field--fit">' + ui.btn('importer', { text: 'Import dữ liệu', attr: { 'data-a': 'import' } }) + '</div>'
        });
        zz('bang').innerHTML = ui.empty('Chọn điều kiện và bấm "Tìm kiếm" để tải danh sách', 'fa-magnifying-glass');

        function veSV() {
            zz('n').textContent = '(' + sv.length + ')';
            ui.table({
                el: zz('bang'), rows: sv.slice((trang.index - 1) * trang.size, trang.index * trang.size), empty: 'Không có dữ liệu',
                columns: [
                    { title: 'Mã sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                    { title: 'Ngành/Chuyên ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-nowrap' },
                    { title: 'Khoa', prop: 'DAOTAO_KHOAQUANLY_TEN' }
                ],
                page: { index: trang.index, size: trang.size, total: sv.length,
                    onChange: function (p) { trang.index = p; veSV(); },
                    onSize: function (s) { trang.size = s; trang.index = 1; veSV(); } }
            });
        }

        /* getList_SinhVien gốc — tham số chép nguyên */
        function tim() {
            var sh = ++luot;
            zz('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({
                action: 'D_BaoCao/LayDanhSachHoSoNhieuNganh', method: 'GET',
                strTuKhoa: (loc.f('q').value || '').trim(),
                strNamNhapHoc: loc.v('nam'),
                strKhoaQuanLy_Id: loc.v('kql'),
                strHeDaoTao_Id: loc.v('he'),
                strKhoaDaoTao_Id: loc.v('khoa'),
                strChuongTrinh_Id: loc.v('ct'),
                strLopQuanLy_Id: loc.v('lop'),
                strTrangThaiNguoiHoc_Id: loc.tt.val(),
                strChucNang_Id: cnId(),
                strTN_KeHoach_Id: '',
                strNguoiThucHien_Id: uid(),
                pageIndex: 1, pageSize: 1000000000
            }).then(function (r) {
                if (sh !== luot) return;
                sv = arr(r.data); trang.index = 1; veSV();
            }).catch(function (err) {
                if (sh !== luot) return;
                zz('bang').innerHTML = ui.fail(err.message);
                loi(err, 'LayDanhSachHoSoNhieuNganh');
            });
        }

        /* myModal_Upload gốc: chọn tệp · Tải file mẫu · Import dữ liệu file Excel */
        function moImport() {
            var dlg = ui.dialog({
                title: 'Import dữ liệu', icon: 'fa-file-excel', size: 'md',
                body: ui.field('Chọn file Import', ui.file({ key: 'tep', accept: '.xls,.xlsx' })) +
                    '<div data-k="tb" class="ums-u-fz13 ums-u-mt-3"></div>',
                buttons: [
                    { text: 'Tải file mẫu', kind: 'excel', icon: 'fa-download', mod: 'ghost', keepOpen: true, onClick: function () {
                        var goc = (ums.session && (ums.session.rootPath || ums.session.host)) || '..';
                        window.open(goc.replace(/\/$/, '') + '/Apistintuc/Modules/Template/DanhSachSVCanGuiTinNhan.xlsx');
                    } },
                    { text: 'Import dữ liệu file Excel', kind: 'importer', keepOpen: true, onClick: function (d) {
                        var tb = d.body.querySelector('[data-k="tb"]');
                        var files = d.body.querySelector('[data-k="tep"]').files;
                        if (!files || !files.length) { toast('Bạn chưa chọn file nào!', 'warn'); return; }
                        tb.textContent = 'Đang tải tệp lên…';
                        ums.upload(files).then(function (p) {
                            return ums.api.call({ action: TT + 'Import_GuiTinNhanToiSinhVien', method: 'GET', versionAPI: 'v1.0', NguoiThucHien_Id: uid(), strPath: p });
                        }).then(function (r) {
                            tb.textContent = 'Đã import dữ liệu: ' + e(r.message);
                            sv = arr(r.data); trang.index = 1; veSV();
                            toast('Đã import ' + sv.length + ' dòng vào danh sách');
                        }).catch(function (err) { tb.textContent = 'Lỗi: ' + err.message; loi(err, 'Import_GuiTinNhanToiSinhVien'); });
                    } }
                ]
            });
            ui.enhance(dlg.el);
        }

        /* btnGuiTinNhan gốc: THEMOI_THONGBAO_TINNHAN_DOTGUI rồi TM_THONGBAO_TINNHAN_NGUOIHOC từng người */
        function gui(api) {
            if (!sv.length) { toast('Danh sách tìm kiếm đang trống — chưa có sinh viên để gửi', 'warn'); return; }
            ui.confirm('Gửi tin nhắn "' + chu(tin.TIEUDE, 80) + '" tới ' + sv.length + ' sinh viên trong danh sách?', { title: 'Gửi tin nhắn', ok: 'Gửi' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({
                    action: TT + 'THEMOI_THONGBAO_TINNHAN_DOTGUI', method: 'POST', versionAPI: 'v1.0',
                    strTHONGBAO_TINNHAN_ID: e(tin.ID), strNGUOITAOID: uid(), strTIEUDE: e(tin.TIEUDE), strNOIDUNG: e(tin.NOIDUNG)
                }).then(function (r) {
                    var dotId = e(r.data);
                    return ui.batch(sv.map(function (x) {
                        return { action: TT + 'TM_THONGBAO_TINNHAN_NGUOIHOC', method: 'POST', versionAPI: 'v1.0', silent: true,
                            strTHONGBAO_TINNHAN_ID: e(tin.ID), strTHONGBAO_TINNHAN_DOTGUI_ID: dotId, strQLSV_NGUOIHOC_ID: e(x.QLSV_NGUOIHOC_ID),
                            strTIEUDE: e(tin.TIEUDE), strNOIDUNG: e(tin.NOIDUNG), strNGUOITAOID: uid() };
                    }), { title: 'Đang gửi tin nhắn', okText: 'Đã gửi', concurrency: 5, toast: false });
                }).then(function (kq) {
                    if (kq.fail) toast('Gửi ' + kq.ok + '/' + sv.length + ' — lỗi: ' + kq.errors[0] + (kq.fail > 1 ? ' (và ' + (kq.fail - 1) + ' lỗi khác)' : ''), 'warn');
                    else { toast('Thực hiện gửi thành công'); api.close(); }
                }).catch(function (err) { loi(err, 'THEMOI_THONGBAO_TINNHAN_DOTGUI'); });
            });
        }

        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !body.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tim();
            else if (a === 'import') moImport();
        });
        loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
        return f;
    }

    /* ---------- Khung Tin nhắn đã gửi theo đợt (zoneTinDaGui) ------------- */
    function moDaGui(tin) {
        var trang = { index: 1, size: 10 }, luot = 0;
        var body = document.createElement('div');
        body.innerHTML =
            '<div class="ums-kv ums-u-mb-4"><span>Tin nhắn</span><b>' + esc(e(tin.TIEUDE)) + '</b></div>' +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-k="dot" data-ph="Chọn thời gian gửi tin nhắn"><option value="">Chọn thời gian gửi tin nhắn</option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-k="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div></div>' }) +
            pat.panel({ title: 'Kết quả tìm kiếm', icon: 'fa-list-check', count: 'n', flush: true, zone: 'bang' });
        function q(k) { return body.querySelector('[data-k="' + k + '"]'); }
        function zz(k) { return body.querySelector('[data-z="' + k + '"]'); }

        pat.formTrang({
            host: root, title: 'Tin nhắn đã gửi', icon: 'fa-clock-rotate-left', cols: 1, body: body,
            buttons: [{ text: 'Gửi lại những trường hợp chưa nhận được tin nhắn', kind: 'save', icon: 'fa-paper-plane-top', mod: 'primary', keepOpen: true,
                onClick: function () { guiLai(); } }]
        });
        zz('bang').innerHTML = ui.empty('Chọn thời gian gửi và bấm "Tìm kiếm" để tải danh sách', 'fa-magnifying-glass');

        ums.api.call({ action: TT + 'LayDS_TinNhan_DotGui', method: 'GET', versionAPI: 'v1.0', strThongBao_TinNhan_Id: e(tin.ID) })
            .then(function (r) { pat.fill(q('dot'), arr(r.data), { id: 'ID', name: 'NGAYTAO', head: 'Chọn thời gian gửi tin nhắn' }); })
            .catch(function (err) { loi(err, 'LayDS_TinNhan_DotGui'); });

        function tai(p) {
            if (p) trang.index = p;
            var sh = ++luot;
            zz('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({
                action: TT + 'LayDS_TinNhanNguoiHoc_DotGui', method: 'GET',
                strTuKhoa: (q('q').value || '').trim(), strTinNhan_DotGui_Id: q('dot').value, strNguoiTaoId: uid(),
                iPageNumber: trang.index, iItemPerPage: trang.size
            }).then(function (r) {
                if (sh !== luot) return;
                var rows = arr(r.data), tong = Number(r.pager) || rows.length;
                zz('n').textContent = '(' + tong + ')';
                ui.table({
                    el: zz('bang'), rows: rows, empty: 'Không có dữ liệu',
                    columns: [
                        { title: 'Mã sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HODEM', cls: 'is-nowrap' },
                        { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                        { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-nowrap' },
                        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-nowrap' },
                        { title: 'Ngành/Chuyên ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' },
                        { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-nowrap' },
                        { title: 'Khoa', prop: 'DAOTAO_KHOAQUANLY_TEN' },
                        { title: 'Trạng thái gửi', cls: 'is-center is-nowrap', render: function (r) {
                            var t = e(r.TRANGTHAIGUI);
                            return t ? ui.badge(t, /chưa|lỗi|thất bại/i.test(t) ? 'warn' : 'ok') : '';
                        } }
                    ],
                    page: { index: trang.index, size: trang.size, total: tong,
                        onChange: function (p) { tai(p); },
                        onSize: function (s) { trang.size = s; tai(1); } }
                });
            }).catch(function (err) {
                if (sh !== luot) return;
                zz('bang').innerHTML = ui.fail(err.message);
                loi(err, 'LayDS_TinNhanNguoiHoc_DotGui');
            });
        }

        function guiLai() {
            if (!q('dot').value) { toast('Bạn chưa chọn thời gian gửi tin nhắn', 'warn'); return; }
            ui.confirm('Gửi lại tin nhắn cho những trường hợp chưa nhận được trong đợt đã chọn?', { title: 'Gửi lại', ok: 'Gửi' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: TT + 'GuiTinNhanNhungTruongHopChuaNhan', method: 'GET', versionAPI: 'v1.0',
                    strTinNhan_DotGui_Id: q('dot').value, strNGUOITAOID: uid() })
                    .then(function () { toast('Thực hiện thành công'); tai(1); })
                    .catch(function (err) { loi(err, 'GuiTinNhanNhungTruongHopChuaNhan'); });
            });
        }

        body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a="search"]');
            if (b && body.contains(b)) tai(1);
        });
        q('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        if (window.jQuery) jQuery(q('dot')).on('select2:select select2:clear', function () { tai(1); });
    }

    /* ---------- Sự kiện màn chính ------------------------------------------ */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.closest('.ums-formtrang')) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') nap(1);
        else if (a === 'them') moForm(null);
        else if (a === 'gui') {
            var r = dong(S.chon);
            if (!r) { toast('Bạn chưa chọn tin nhắn để gửi', 'warn'); return; }
            moGui(r);
        }
        else if (a === 'sua') { var r2 = dong(b.getAttribute('data-id')); if (r2) moForm(r2); }
        else if (a === 'dagui') { var r3 = dong(b.getAttribute('data-id')); if (r3) moDaGui(r3); }
    });
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t && t.matches && t.matches('input[data-chon]')) S.chon = t.value;
    });
    oQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); nap(1); } });

    nap(1);
})();
