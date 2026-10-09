/* =========================================================================
   Xác nhận kết quả — duyệt dữ liệu hồ sơ người học (trường thông tin) theo kế hoạch
   Bản gốc: ApisSinhVien/Modules/kehoach/html/xacnhanketqua.html + script/xacnhanketqua.js
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột: thanh lọc (Hệ → Khoá → CT → Lớp, Năm nhập học, Khoa QL, Kế hoạch, Trường
   thông tin + Tìm kiếm + Xuất báo cáo / Import) · khung "Danh sách" (nút Tải file · Xuất Excel · Import trường
   thông tin · Xác nhận) — bảng người học × trường thông tin, mỗi ô: giá trị + ô đánh dấu + tình trạng duyệt.
   Hộp: "Duyệt hồ sơ" (nội dung + nút xác nhận theo danh mục), "Kết quả import", "Xuất Excel dữ liệu hồ sơ".

   Lời gọi (kiểu cũ, chép nguyên; tham số `type` gốc nằm TRONG dữ liệu gửi đi nên giữ):
     SV_KeHoach_NguoiHoc/LayDanhSach     GET  type · strTuKhoa '' · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000
                                              + mục cứng { ID: DULIEUGOC, MOTA: "Dữ liệu gốc", XACNHANTHONGTIN: 0 } (như gốc),
                                              chọn sẵn mục đầu
     SV_KeHoach_NguoiHoc/LayDSThongTinTheoKeHoach  GET  type · strChucNang_Id · strQLSV_KeHoach_NguoiHoc_Id · strNguoiThucHien_Id
                                              → ID · TEN · KIEUDULIEU (ô "Trường thông tin" + cột bảng)
     SV_KeHoach_PhamVi/LayDSQLSV_KeHoach_PhamVi_DL  GET  type · strTuKhoa '' · strQLSV_KeHoach_NguoiHoc_Id · strNamNhapHoc ·
                                              strKhoaQuanLy_Id · strHeDaoTao_Id · strKhoaDaoTao_Id · strChuongTrinh_Id · strLopQuanLy_Id ·
                                              strTrangThaiNguoiHoc_Id '' · strTruongThongTin_Id · strNguoiTao_Id '' · pageIndex · pageSize
                                              → ID · QLSV_NGUOIHOC_ID · DAOTAO_LOPQUANLY_MA · QLSV_NGUOIHOC_MASO / HODEM / TEN
     SV_KeHoach_DuLieu/LayKQQLSV_KeHoach_DuLieu     GET  type · strQLSV_KeHoach_NguoiHoc_Id · strTruongThongTin_Id '' ·
                                              strQLSV_NguoiHoc_Id (MỖI DÒNG một lời gọi như gốc — hàng đợi 6 luồng)
                                              → TRUONGTHONGTIN_ID · KETQUAXACNHAN_TEN · TRUONGTHONGTIN_GIATRI_KQ · THONGTINXACMINH_KQ
     SV_Files/LayDanhSach                 GET  strDuLieu_Id = QLSV_NGUOIHOC_ID + TRUONGTHONGTIN_ID (ô kiểu FILE — viewFiles gốc)
     SV_KeHoachHoSo_XacNhan/ThemMoi       POST type · strSanPham_Id = mã chức năng + ID kế hoạch + ID trường + ID dòng ·
                                              strNguoiXacnhan_Id · strNoiDung · strTinhTrang_Id (mỗi ô đã đánh dấu một lời gọi)
     CMS_Files/GopFile                    arrTuKhoa (đường dẫn tệp) · arrDuLieu (tên = mã SV + đuôi tệp) · strNguoiThucHien_Id
                                              → mở <RootPathUpload>/<Data>
     Import: ums.report.importChung(…, 'IMPORTWITHPROC_TRUONGTT') (= showBaoCao gốc: SYS_Import/SImport + tham số THONGTIN5),
       phiên import tự sinh (edu.system.strPhien_Id) rồi
     SV_Import_MH/… PKG_HOSOSINHVIEN_IMPORT.LayDSKQImport_HoSo_TruongTT   strChucNang_Id · strPhienImport · strNguoiThucHien_Id
     Hệ → Khoá → CT → Lớp: ums.ref.cascade (gốc gọi edu.system.getList_* KHÔNG lọc quyền, ô chọn MỘT) · Năm nhập học
       KHCT_NamNhapHoc/LayDanhSach GET · Khoa QL edu.system.getList_KhoaQuanLy · nút xác nhận: danh mục QLSV.XACNHAN.SINHVIEN.NHAP.HOSO
       (THONGTIN1 = biểu tượng FA4 qua ums.iconFA4, THONGTIN2 = kiểu).
     Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_XNKQ" + vùng _Import).
   Xuất Excel: gốc tải SheetJS từ CDN rồi ghi .xlsx — ở đây ums.ui.xuatXls (tệp .xls, không cần CDN), cùng luồng:
     LayDSQLSV_KeHoach_PhamVi_DL (strNamNhapHoc '' như gốc, Khoa QL / Hệ / Khoá / CT / Lớp theo ô lọc, cỡ = số lượng chọn)
     → LayKQQLSV_KeHoach_DuLieu từng SV (6 luồng, chờ tối đa 20 giây mỗi lời gọi) → cột STT · Lớp · Mã số · Họ và tên ·
     Ngày sinh · Giới tính + mỗi trường (FILE → "Có file"). "Đếm" = cùng lời gọi pageSize 1 đọc Pager. Hủy xuất / đóng hộp = dừng.

   Lỗi gốc — làm theo ý định:
     · Danh sách gửi strNamNhapHoc / strKhoaQuanLy_Id RỖNG (gốc đọc txtAAAA / dropAAAA) dù hai ô lọc có trên màn → nay gửi
       giá trị ô. Kiểm trên host.
     · Báo cáo: callback gốc đọc ô KHÔNG tồn tại (dropSearch_HeDaoTao… không có hậu tố _IHD, dropSearch_HocKy, KhoanThu,
       DoiTuong, CheDo — chép từ màn Tài chính) → mọi khoá đều rỗng. Nay Hệ / Khoá / CT / Lớp / Khoa QL gửi giá trị ô lọc,
       các khoá còn lại giữ rỗng như gốc.
     · Giá trị hiển thị: gốc bật cờ "hiện thông tin xác minh" MỘT LẦN khi chọn kế hoạch cần xác nhận và không bao giờ tắt
       (đổi sang "Dữ liệu gốc" vẫn hiện THONGTINXACMINH_KQ). Nay theo kế hoạch ĐANG chọn (XACNHANTHONGTIN khác 0).
     · Duyệt: gốc báo "Không có thay đổi lưu" nhưng vẫn chạy tiếp; lưu xong nạp lại sau 1 giây — giữ nạp lại.
     · Tải file: không có tệp nào thì báo thay vì gửi mảng rỗng.
   Cố ý bỏ: khối "Lịch sử xác nhận" của hộp duyệt (bảng không bao giờ được nạp — không có lời gọi), #txtHoSoDuTuyen (không
     gán), hai nút "Đóng" giả trong khung nút (bị loadBtnXacNhan ghi đè), resetCombobox, getList_ThoiGianDaoTao /
     genList_TrangThaiSV (ô / đối tượng không có), QLTC.CDCS (đã chú thích), SheetJS CDN.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('sv-xacnhanketqua');
    if (!root) return;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function sel(k, ph, multi) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') +
            '>' + (multi ? '' : '<option value=""></option>') + '</select></div>';
    }

    root.innerHTML = pat.page('Xác nhận kết quả', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('ct', 'Tất cả chương trình đào tạo') + sel('lop', 'Tất cả lớp') +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('nam', 'Tất cả năm nhập học') + sel('kql', 'Tất cả khoa quản lý') +
                '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch" data-required></select></div>' +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('tt', 'Chọn trường thông tin', true) +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('attach', { text: 'Tải file', icon: 'fa-download', mod: 'out-primary', attr: { 'data-a': 'taifile' } }) +
                ui.btn('excel', { attr: { 'data-a': 'excel' } }) +
                ui.btn('importer', { text: 'Import trường thông tin', attr: { 'data-a': 'import' } }) +
                ui.btn('confirm', { text: 'Xác nhận', attr: { 'data-a': 'xacnhan' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    z('bang').innerHTML = ui.empty('Chọn kế hoạch rồi bấm "Tìm kiếm"', 'fa-magnifying-glass');

    /* ---------- Danh mục lọc ----------------------------------------------------- */
    ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' } });
    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', silent: true, strNguoiThucHien_Id: '' })
        .then(function (r) { pat.fill(f('nam'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', head: 'Tất cả năm nhập học' }); })
        .catch(function (err) { ums.api.handle(err, 'năm nhập học'); });
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN', head: 'Tất cả khoa quản lý' }); })
        .catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });

    var keHoach = [], dtTT = [], dsXN = null;
    function khDangChon() { var id = f('kh').value; return keHoach.filter(function (x) { return String(x.ID) === String(id); })[0] || null; }
    /** Hiện THONGTINXACMINH_KQ khi kế hoạch đang chọn cần xác nhận (XACNHANTHONGTIN khác 0) — cờ bcheck của gốc */
    function xacMinh() { var k = khDangChon(); return !!(k && k.XACNHANTHONGTIN && String(k.XACNHANTHONGTIN) !== '0'); }

    function napTruongTT() {
        dtTT = [];
        pat.fill(f('tt'), [], {});
        if (!f('kh').value) return Promise.resolve();
        return ums.api.call({ action: 'SV_KeHoach_NguoiHoc/LayDSThongTinTheoKeHoach', method: 'GET', type: 'GET',
            strChucNang_Id: cn(), strQLSV_KeHoach_NguoiHoc_Id: f('kh').value, strNguoiThucHien_Id: uid() })
            .then(function (r) { dtTT = arr(r.data); pat.fill(f('tt'), dtTT, { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'trường thông tin của kế hoạch'); });
    }
    ums.api.call({ action: 'SV_KeHoach_NguoiHoc/LayDanhSach', method: 'GET', type: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) {
            keHoach = arr(r.data).concat([{ ID: 'DULIEUGOC', MOTA: 'Dữ liệu gốc', XACNHANTHONGTIN: 0 }]);
            pat.fill(f('kh'), keHoach, { name: 'MOTA', head: 'Chọn kế hoạch' });
            f('kh').value = keHoach[0].ID;
            jQuery(f('kh')).trigger('change.select2');
            napTruongTT();
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    jQuery(f('kh')).on('select2:select', function () { napTruongTT(); });
    pat.chain([f('kh'), f('tt')], { phatLai: false });

    ums.api.dm('QLSV.XACNHAN.SINHVIEN.NHAP.HOSO').then(function (d) { dsXN = d; })
        .catch(function (err) { dsXN = []; ums.api.handle(err, 'danh mục xác nhận'); });

    /* ---------- Báo cáo ---------------------------------------------------------- */
    ums.report.mount(z('bc'), {
        collect: function (add) {
            add('strTuKhoa', '');
            add('strKhoaQuanLy_Id', v('kql'));
            add('strHeDaoTao_Id', v('he'));
            add('strKhoaDaoTao_Id', v('khoa'));
            add('strChuongTrinh_Id', v('ct'));
            add('strLopQuanLy_Id', v('lop'));
            add('strDaoTao_ThoiGianDaoTao_Id', '');
            add('strTaiChinh_CacKhoanThu_Id', '');
            add('strDoiTuong_Id', '');
            add('strCheDoChinhSach_Id', '');
        }
    });

    /* ---------- Danh sách ---------------------------------------------------------- */
    var page = 1, size = 10, total = 0, rows = [], cols = [], tep = {}, luot = 0;

    function thamSo(p, s) {
        return { action: 'SV_KeHoach_PhamVi/LayDSQLSV_KeHoach_PhamVi_DL', method: 'GET', type: 'GET',
            strTuKhoa: '', strQLSV_KeHoach_NguoiHoc_Id: f('kh').value, strNamNhapHoc: v('nam'), strKhoaQuanLy_Id: v('kql'),
            strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'), strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'),
            strTrangThaiNguoiHoc_Id: '', strTruongThongTin_Id: v('tt'), strNguoiTao_Id: '', pageIndex: p, pageSize: s };
    }
    /** Cột trường thông tin: các trường đang chọn ở ô lọc, không chọn thì cả kế hoạch (dtThongTin_View của gốc) */
    function cotTT() {
        var chon = v('tt');
        if (!chon) return dtTT.slice();
        return chon.split(',').map(function (id) { return dtTT.filter(function (x) { return String(x.ID) === id; })[0]; }).filter(Boolean);
    }

    function tim(p) {
        if (p) page = p;
        if (!f('kh').value) { ui.toast('Vui lòng chọn kế hoạch', 'warn'); return; }
        var l = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(thamSo(page, size)).then(function (r) {
            if (l !== luot) return;
            rows = arr(r.data);
            total = Number(r.pager) || rows.length;
            cols = cotTT();
            tep = {};
            ve();
            napKetQua(l);
        }).catch(function (err) { if (l === luot) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách người học'); } });
    }

    function ve() {
        z('n').textContent = '(' + total + ')';
        var c = [
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_MA', cls: 'is-nowrap' },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } }
        ];
        cols.forEach(function (t, j) {
            c.push({ head: esc(e(t.TEN)) + '<br><input type="checkbox" data-cotall="' + j + '" title="Chọn cả cột">', cls: 'is-center',
                render: function (r, i) {
                    return '<div class="xnkq-o"><span class="xnkq-o__gt" data-gt="' + i + ':' + j + '"></span>' +
                        '<input type="checkbox" data-xn="' + i + ':' + j + '">' +
                        '<span class="xnkq-o__tt" data-tt="' + i + ':' + j + '"></span></div>';
                } });
        });
        c.push({ head: 'Tất cả <input type="checkbox" data-bangall title="Chọn tất cả">', cls: 'is-center', width: '84px',
            render: function (r, i) { return '<input type="checkbox" data-dongall="' + i + '" title="Chọn cả dòng">'; } });
        ui.table({
            el: z('bang'), rows: rows, columns: c, empty: 'Không có người học trong phạm vi lọc',
            page: { index: page, size: size, total: total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tim(p); },
                onSize: function (x) { size = x === 'all' ? ui.PAGE_ALL : Number(x); tim(1); } }
        });
    }

    /** Mỗi dòng một lời gọi LayKQQLSV_KeHoach_DuLieu (strTruongThongTin_Id rỗng — cả các trường), 6 luồng */
    function napKetQua(l) {
        var km = f('kh').value, hienXM = xacMinh(), i = 0;
        var viTri = {};
        cols.forEach(function (t, j) { viTri[t.ID] = j; });
        function w() {
            if (l !== luot || i >= rows.length) return Promise.resolve();
            var k = i++, sv = rows[k];
            return ums.api.call({ action: 'SV_KeHoach_DuLieu/LayKQQLSV_KeHoach_DuLieu', method: 'GET', type: 'GET', silent: true,
                strQLSV_KeHoach_NguoiHoc_Id: km, strTruongThongTin_Id: '', strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID })
                .then(function (r) {
                    if (l !== luot) return;
                    arr(r.data).forEach(function (kq) {
                        var j = viTri[kq.TRUONGTHONGTIN_ID];
                        if (j === undefined) return;
                        var o = k + ':' + j;
                        var st = z('bang').querySelector('[data-tt="' + o + '"]');
                        if (st) st.textContent = e(kq.KETQUAXACNHAN_TEN);
                        var gt = z('bang').querySelector('[data-gt="' + o + '"]');
                        if (!gt) return;
                        gt.textContent = e(hienXM ? kq.THONGTINXACMINH_KQ : kq.TRUONGTHONGTIN_GIATRI_KQ);
                        if (cols[j].KIEUDULIEU === 'FILE') napTep(gt, o, e(kq.QLSV_NGUOIHOC_ID) + e(kq.TRUONGTHONGTIN_ID), l);
                    });
                }).catch(function (err) { if (err && err.expired) { i = rows.length; ums.api.handle(err); } })
                .then(w);
        }
        for (var n = 0; n < 6; n++) w();
    }
    /** Ô kiểu FILE: liệt kê tệp đã nộp (viewFiles gốc — SV_Files/LayDanhSach theo strDuLieu_Id) */
    function napTep(host, o, duLieuId, l) {
        ums.api.call({ action: 'SV_Files/LayDanhSach', method: 'GET', silent: true, strDuLieu_Id: duLieuId }).then(function (r) {
            if (l !== luot) return;
            var ds = arr(r.data).filter(function (x) { return x.FILEMINHCHUNG; });
            tep[o] = ds.map(function (x) { return { path: x.FILEMINHCHUNG, name: e(x.TENHIENTHI) || String(x.FILEMINHCHUNG).split('/').pop() }; });
            host.innerHTML = tep[o].map(function (x) {
                return '<a class="xnkq-tep" href="' + esc(ums.files.url(x.path)) + '" target="_blank" rel="noopener"><i class="fa-light fa-paperclip"></i> ' + esc(x.name) + '</a>';
            }).join('');
        }).catch(function () { /* thiếu tệp thì để trống như gốc */ });
    }

    /* ---------- Chọn ô: cả cột / cả dòng / cả bảng (chkSelectAll của gốc) ------------ */
    z('bang').addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute('data-cotall')) {
            var j = t.getAttribute('data-cotall');
            qa(z('bang'), 'input[data-xn$=":' + j + '"]').forEach(function (x) { x.checked = t.checked; });
        } else if (t.hasAttribute('data-dongall')) {
            var i = t.getAttribute('data-dongall');
            qa(z('bang'), 'input[data-xn^="' + i + ':"]').forEach(function (x) { x.checked = t.checked; });
        } else if (t.hasAttribute('data-bangall')) {
            qa(z('bang'), 'tbody input[type="checkbox"], thead input[data-cotall]').forEach(function (x) { x.checked = t.checked; });
        }
    });
    function oDaChon() {
        return qa(z('bang'), 'input[data-xn]:checked').map(function (x) {
            var p = x.getAttribute('data-xn').split(':');
            return { dong: rows[Number(p[0])], tt: cols[Number(p[1])] };
        }).filter(function (o) { return o.dong && o.tt; });
    }

    /* ---------- Xác nhận (hộp "Duyệt hồ sơ") ------------------------------------------ */
    function xacNhan() {
        var ds = oDaChon();
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        var km = f('kh').value;
        var dlg = ui.dialog({ title: 'Duyệt hồ sơ', icon: 'fa-circle-check', size: 'lg',
            body: '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ds.length + ' ô đã chọn.</p>' +
                ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="cc-xn" data-x="nut"></div>' });
        var nut = dlg.body.querySelector('[data-x="nut"]');
        function veNut(d) {
            nut.innerHTML = arr(d).length ? arr(d).map(function (h) {
                var ic = ums.iconFA4(e(h.THONGTIN1) || 'fa fa-paper-plane');
                return '<button type="button" class="cc-xn__nut" data-hd="' + esc(h.ID) + '"><i class="' + esc(ic) + '"' +
                    (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo danh mục xác nhận');
        }
        if (dsXN) veNut(dsXN); else { nut.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); setTimeout(function () { veNut(dsXN || []); }, 800); }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var tinhTrang = b.getAttribute('data-hd'), noiDung = (dlg.body.querySelector('[data-x="nd"]').value || '').trim();
            dlg.close();
            ui.batch(ds.map(function (o) {
                return { action: 'SV_KeHoachHoSo_XacNhan/ThemMoi', method: 'POST', type: 'POST',
                    strSanPham_Id: cn() + km + e(o.tt.ID) + e(o.dong.ID),
                    strNguoiXacnhan_Id: uid(), strNoiDung: noiDung, strTinhTrang_Id: tinhTrang };
            }), { title: 'Đang xác nhận', okText: 'Thực hiện thành công', show: true }).then(function () {
                setTimeout(function () { tim(); }, 1000);
            });
        });
    }

    /* ---------- Tải file (gộp mọi tệp của các dòng đang hiện) -------------------------- */
    function taiFile() {
        var url = [], ten = [];
        rows.forEach(function (sv, i) {
            Object.keys(tep).forEach(function (o) {
                if (o.split(':')[0] !== String(i)) return;
                tep[o].forEach(function (x) {
                    if (url.indexOf(x.path) >= 0) return;
                    url.push(x.path);
                    ten.push(e(sv.QLSV_NGUOIHOC_MASO) + (x.name.lastIndexOf('.') >= 0 ? x.name.substring(x.name.lastIndexOf('.')) : ''));
                });
            });
        });
        if (!url.length) { ui.toast('Không có tệp nào trong danh sách đang hiện', 'warn'); return; }
        ums.api.call({ action: 'CMS_Files/GopFile', arrTuKhoa: url, arrDuLieu: ten, strNguoiThucHien_Id: '' }).then(function (r) {
            if (r.data) window.open(ums.files.url(r.data));
        }).catch(function (err) { ums.api.handle(err, 'gộp tệp'); });
    }

    /* ---------- Import trường thông tin ---------------------------------------------- */
    function nhapTT() {
        var phien = ums.util.uuid();
        ums.report.importChung('trường thông tin', 'IMPORTWITHPROC_TRUONGTT', {
            values: function (ma, bieuThuc) { if (/strPhien_Id/.test(bieuThuc)) return phien; },
            onDone: function () { ketQuaImport(phien); }
        });
    }
    function ketQuaImport(phien) {
        var dlg = ui.dialog({ title: 'Kết quả import', icon: 'fa-list-check', size: 'xl', body: '<div data-x="t">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-x="t"]');
        ums.api.call({ action: 'SV_Import_MH/DSA4BRIKEAgsMS4zNR4JLhIuHhUzNC4vJhUV', func: 'PKG_HOSOSINHVIEN_IMPORT.LayDSKQImport_HoSo_TruongTT',
            strChucNang_Id: cn(), strPhienImport: phien, strNguoiThucHien_Id: uid() }).then(function (r) {
            ui.table({ el: host, rows: arr(r.data), empty: 'Không có kết quả import', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MA', cls: 'is-center is-nowrap' },
                { title: 'Thời gian thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' },
                { title: 'Trường thông tin', prop: 'TRUONGTHONGTIN_TEN' },
                { title: 'Giá trị cập nhật', prop: 'TRUONGTHONGTINDULIEU_GIATRI' },
                { title: 'Lỗi', prop: 'ERR', cls: 'ums-u-danger' },
                { title: 'Ghi chú', prop: 'QLSV_KEHOACH_NGUOIHOC_TEN' }
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả import'); });
    }

    /* ---------- Xuất Excel dữ liệu hồ sơ ---------------------------------------------- */
    function xuatExcel() {
        var kh = khDangChon();
        if (!kh || kh.ID === 'DULIEUGOC') { ui.toast('Vui lòng chọn Kế hoạch (khác "Dữ liệu gốc") trước khi xuất Excel.', 'warn'); return; }
        var chon = cotTT(), tatCa = !v('tt'), huy = false, chay = false;
        var q = function (k) { return dlg.body.querySelector('[data-x="' + k + '"]'); };
        var dlg = ui.dialog({
            title: 'Xuất Excel dữ liệu hồ sơ', icon: 'fa-file-excel', size: 'md',
            body: '<div class="ums-kv"><span>Kế hoạch</span><b>' + esc(e(kh.MOTA)) + '</b></div>' +
                '<div class="ums-kv"><span>Trường thông tin xuất</span><b>' + esc(tatCa ? 'Tất cả ' + dtTT.length + ' trường của kế hoạch'
                    : chon.length + ' trường: ' + chon.map(function (x) { return e(x.TEN); }).join(', ')) + '</b></div>' +
                '<div class="ums-kv"><span>Tổng SV theo bộ lọc</span><b><span data-x="tong">— (bấm "Đếm" để kiểm tra)</span> ' +
                    ui.btn('reload', { text: 'Đếm', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-x': 'dem' } }) + '</b></div>' +
                '<div class="ums-legend ums-legend--cach">Số lượng SV cần xuất</div><div class="xnkq-sl">' +
                    [['100', '100'], ['500', '500'], ['1000', '1.000'], ['5000', '5.000'], ['all', 'Tất cả']].map(function (x) {
                        return '<label class="ums-check"><input type="radio" name="xnkq-sl" value="' + x[0] + '"' + (x[0] === 'all' ? ' checked' : '') + '> ' + x[1] + '</label>';
                    }).join('') + '</div>' +
                '<p class="ums-u-fz13 ums-u-muted">Mẹo: xuất ít trước để đo tốc độ, rồi xuất tất cả.</p>' +
                '<div data-x="td" hidden><div class="ums-legend ums-legend--cach">Tiến độ xuất</div>' +
                    '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-x="bar" style="width:0"></div></div></div>' +
                    '<p class="ums-u-fz13" data-x="log">Đang chuẩn bị…</p></div>',
            buttons: [
                { text: 'Hủy xuất', kind: 'del', mod: 'danger', icon: 'fa-circle-stop', keepOpen: true, onClick: function () {
                    huy = true; chay = false; q('log').textContent = 'Đã hủy bởi người dùng. Có thể bấm "Xuất Excel" để chạy lại.'; nutChay(false); return false;
                } },
                { text: 'Xuất Excel', kind: 'excel', mod: 'save', keepOpen: true, onClick: function () { batDau(); return false; } }
            ],
            onClose: function () { huy = true; }
        });
        var nutHuy = dlg.el.querySelector('[data-dlg="0"]'), nutXuat = dlg.el.querySelector('[data-dlg="1"]');
        function nutChay(on) {
            nutHuy.hidden = !on; nutXuat.disabled = on;
            qa(dlg.body, 'input[name="xnkq-sl"]').forEach(function (x) { x.disabled = on; });
        }
        nutChay(false);
        q('dem').addEventListener('click', function () {
            q('tong').textContent = 'Đang đếm…';
            ums.api.call(xuatThamSo(1, 1)).then(function (r) {
                var n = parseInt(r.pager, 10);
                if (isNaN(n)) n = arr(r.data).length;
                q('tong').textContent = n.toLocaleString('en-US') + ' SV';
            }).catch(function (err) { q('tong').textContent = 'Lỗi: ' + err.message; });
        });
        function xuatThamSo(p, s) {
            var o = thamSo(p, s);
            o.strNamNhapHoc = ''; o.strTruongThongTin_Id = '';      // _exportBuildQueryParams của gốc
            return o;
        }
        function batDau() {
            var qty = (dlg.body.querySelector('input[name="xnkq-sl"]:checked') || {}).value || 'all';
            var n = qty === 'all' ? 100000 : parseInt(qty, 10) || 100000;
            huy = false; chay = true; nutChay(true);
            q('td').hidden = false; q('bar').style.width = '0'; q('log').textContent = 'Đang lấy danh sách sinh viên…';
            ums.api.call(xuatThamSo(1, n)).then(function (r) {
                if (huy) return;
                var ds = arr(r.data);
                if (!ds.length) { q('log').textContent = 'Không có sinh viên nào trong phạm vi lọc.'; nutChay(false); return; }
                layHet(ds);
            }).catch(function (err) { q('log').textContent = 'Lỗi lấy DS SV: ' + err.message; nutChay(false); });
        }
        function layHet(ds) {
            var map = {}, i = 0, xong = 0, loi = 0, n = ds.length;
            function bao() {
                var pc = n ? Math.round(xong / n * 100) : 100;
                q('bar').style.width = pc + '%';
                q('log').textContent = 'Đã tải ' + xong + '/' + n + ' SV (Lỗi/timeout: ' + loi + ')';
            }
            function w() {
                if (huy || i >= n) return Promise.resolve();
                var sv = ds[i++];
                return ums.api.call({ action: 'SV_KeHoach_DuLieu/LayKQQLSV_KeHoach_DuLieu', method: 'GET', type: 'GET', silent: true, timeout: 20000,
                    strQLSV_KeHoach_NguoiHoc_Id: kh.ID, strTruongThongTin_Id: '', strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID })
                    .then(function (r) {
                        var m = map[sv.QLSV_NGUOIHOC_ID] = map[sv.QLSV_NGUOIHOC_ID] || {};
                        arr(r.data).forEach(function (kq) { if (kq && kq.TRUONGTHONGTIN_ID) m[kq.TRUONGTHONGTIN_ID] = kq; });
                    }, function () { loi++; })
                    .then(function () { if (huy) return; xong++; bao(); return w(); });
            }
            bao();
            var ps = [];
            for (var k = 0; k < 6; k++) ps.push(w());
            Promise.all(ps).then(function () { if (!huy && xong === n) ghi(ds, map, loi); });
        }
        function ghi(ds, map, loi) {
            var cot = [
                { title: 'STT', get: function (r, i) { return i + 1; } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_MA' },
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO' },
                { title: 'Họ và tên', get: function (r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).replace(/\s+/g, ' ').trim(); } },
                { title: 'Ngày sinh', get: ngaySinh },
                { title: 'Giới tính', get: function (r) {
                    return e(r.QLSV_NGUOIHOC_GIOITINH_TEN) || e(r.GIOITINH_TEN) || e(r.QLSV_NGUOIHOC_GIOITINH) || e(r.GIOITINH) ||
                        e(r.TENGIOITINH) || e(r.QLSV_NGUOIHOC_TENGIOITINH) || e(r.QLSV_NGUOIHOC_GIOITINH_MA) || e(r.GIOITINH_MA);
                } }
            ];
            chon.filter(function (t) { return t && t.ID && t.TEN; }).forEach(function (t) {
                cot.push({ title: e(t.TEN) || e(t.MA), get: function (r) {
                    var kq = (map[r.QLSV_NGUOIHOC_ID] || {})[t.ID];
                    if (!kq) return '';
                    return t.KIEUDULIEU === 'FILE' ? (kq.TRUONGTHONGTIN_GIATRI_KQ ? 'Có file' : '') : e(kq.TRUONGTHONGTIN_GIATRI_KQ);
                } });
            });
            var d = new Date(), p2 = function (x) { return x < 10 ? '0' + x : x; };
            var ten = 'XacNhanKetQua_' + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '_' + p2(d.getHours()) + p2(d.getMinutes()) + '.xls';
            ui.xuatXls(ten, { cot: cot, dong: ds });
            q('log').textContent = 'Đã xuất: ' + ten + ' (' + ds.length + ' SV × ' + (cot.length - 6) + ' trường)' +
                (loi ? ' — có ' + loi + ' SV bị lỗi/timeout, cột trường TT để trống.' : '');
            chay = false; nutChay(false);
        }
        function ngaySinh(o) {
            var raw = e(o.QLSV_NGUOIHOC_NGAYSINH) || e(o.NGAYSINH) || e(o.QLSV_NGUOIHOC_NGAYSINH_DD_MM_YYYY);
            if (raw && String(raw).indexOf('/') > 0) return raw;
            var dd = e(o.QLSV_NGUOIHOC_NGAYSINH) || e(o.NGAYSINH), mm = e(o.QLSV_NGUOIHOC_THANGSINH) || e(o.THANGSINH), yy = e(o.QLSV_NGUOIHOC_NAMSINH) || e(o.NAMSINH);
            var pad = function (x) { x = String(x); return x.length < 2 ? '0' + x : x; };
            return dd && mm && yy ? pad(dd) + '/' + pad(mm) + '/' + yy : raw;
        }
    }

    /* ---------- Sự kiện ---------------------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        switch (b.getAttribute('data-a')) {
            case 'tim': tim(1); break;
            case 'xacnhan': xacNhan(); break;
            case 'taifile': taiFile(); break;
            case 'excel': xuatExcel(); break;
            case 'import': nhapTT(); break;
        }
    });
})();
