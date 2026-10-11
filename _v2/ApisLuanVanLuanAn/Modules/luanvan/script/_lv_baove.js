/* =========================================================================
   Luận văn / luận án — khung màn "BẢO VỆ": ums.lvBaoVe.man(root, cfg)
   Dùng cho baovecapcoso, baovecaptruong, baoveluanvan (module luanvan) và — nạp chéo — luanan/baoveluanvan.
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/{html,script}/baovecapcoso | baovecaptruong | baoveluanvan.
   Ba tệp gốc giống nhau 91–93% (diff đã so): cùng khung "kế hoạch + từ khoá + danh sách bảo vệ", cùng biểu mẫu chi tiết
   (thông tin học viên / đề cương · danh sách hướng dẫn · hội đồng bảo vệ · lịch bảo vệ · đề tài sau bảo vệ),
   cùng hộp "Xác nhận" (Đánh giá chung). Chỉ khác ở tiền tố action và vài khối — đều thành cờ trong `cfg`.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá; tên tham số / cột HOA chép nguyên từ gốc):
     Kế hoạch   LVLA_KeHoach_DeCuong/LayDanhSach            strTuKhoa, pageIndex 1, pageSize 100000
     Danh sách  <cfg.listAction>                            strTuKhoa, strQLSV_NguoiHoc_Id '', strNguoiDangKy_Id '',
                                                            strLVLA_KeHoach_DeCuong_Id, trang ở máy chủ
     Hướng dẫn  <cfg.hdAction>   (chỉ xem)                  strLVLA_DeCuong_DangKy_Id = strLVLA_DeCuong_ChinhThuc_Id = ID dòng,
                                                            strLVLA_KeHoach_DeCuong_Id = LVLA_KEHOACH_DECUONG_ID của dòng
     Hội đồng   <cfg.tv>/LayDanhSach · ThemMoi · CapNhat (có strId) · Xoa (strIds)
                strThanhVien_Id, strVaiTro_Id (LVLA.VTHDONG), dDiem, strDanhGia_Id (LVLA.DGHD), strNhanXet
     Lịch       <cfg.lich>/LayDanhSach · ThemMoi · CapNhat · Xoa · <cfg.lich>/<cfg.suaDeTai> (đề tài sau bảo vệ, chỉ dòng đã lưu)
     Tổng điểm  LVLA_DeCuong_ChinhThuc/Sua_LVLA_DeCuong_CT_Diem   (cfg.tongDiem)
     Xác nhận   LVLA_NhanXet_DanhGia/LayDanhSach · ThemMoi — mã sản phẩm = cfg.sanPham + ID dòng; trạng thái XLHV.XNKK (sắp HESO1)
     Tệp        LVLA_Files — mã 'DETAISAUBAOVE' + ID dòng (cfg.coTep)
     Chọn người ums.pat.pickNhanSu (cfg.picker 'nhanSu') | hộp riêng pkg_llkh_hoso.LayDanhSachLLKH (cfg.picker 'llkh' — genModal_LLKH)
   ---------------------------------------------------------------------------
   THAM SỐ HOÁ — cfg = {
     tieuDe        'Bảo vệ cấp cơ sở'          tiêu đề trang + khung chi tiết
     nhomHD        'Danh sách hướng dẫn chính thức' | 'Danh sách hướng dẫn'   tiêu đề khối hướng dẫn
     listAction    mặc định 'LVLA_DeCuong_ChinhThuc/LayDanhSach'
     hdAction      mặc định 'LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach'
     tv            tiền tố action hội đồng: 'LVLA_BaoVe_CoSo_HoiDong_ThanhVien' | 'LVLA_BaoVe_Truong_HoiDong_ThanhVien' | 'LVLA_BaoVe_HoiDong_KetQua'
     lich          tiền tố action lịch: 'LVLA_BaoVe_CoSo_Lich' | 'LVLA_BaoVe_Truong_Lich' | 'LVLA_BaoVe_Lich'
     suaDeTai      'Sua_LVLA_CS_DeTaiSauBaoVe' | 'Sua_LVLA_Truong_DeTaiSauBaoVe' | 'Sua_LVLA_DeTaiSauBaoVe'
     sanPham       'LVLA_BaoVe_CoSo_HoiDong_TV' | 'LVLA_BaoVe_Truong_HoiDong_TV' | 'LVLA_BaoVe_HoiDong_KQ'
     coDiem        true: cột "Điểm" trong bảng hội đồng (cơ sở, luận văn); false: ẩn (cấp trường) — dDiem gửi rỗng như gốc
     coPhut        true: cột "Phút" trong lịch (luận văn); strPhut gửi kèm
     tongDiem      true: ô "Tổng điểm" + Sua_LVLA_DeCuong_CT_Diem (luận văn)
     coTep         true: khối "File khoá luận bản cuối cùng đính kèm" (luận văn)
     mauImport     true: nút báo cáo của chức năng (getList_MauImport, thêm strLVLA_KeHoach_DeCuong_Id) — luận văn
     picker        'nhanSu' | 'llkh'
     xacNhan       mặc định true; false: bỏ nút "Đánh giá chung" + hộp Xác nhận (luanan/baoveluanvan gốc không có)
     deTai         mặc định true; false: bỏ khối "Đề tài sau bảo vệ" + lời gọi suaDeTai (luanan/baoveluanvan gốc không có)
     dmVaiTro      mặc định 'LVLA.VTHDONG'; luanan/baoveluanvan gốc dùng 'LVLA.VTHD'
   }
   Màn khác (luanan) tái dùng: đổi listAction / hdAction / tv / lich / suaDeTai / sanPham và các cờ — không sửa khung.
   ---------------------------------------------------------------------------
   Khác bản gốc (ghi ở can-quyet.js):
     · Biểu mẫu chi tiết mở TRONG TRANG (formTrang), thay chỗ danh sách (gốc: zone-bus ẩn / hiện — cùng ý). Phần thông tin học viên /
       đề cương là ô bị khoá (readonly) ở gốc → hiện dạng "nhãn : giá trị".
     · Lịch (luận văn): header có cột "Phút" nhưng hàng gốc không vẽ ô Phút (lệch cột, strPhut luôn rỗng) → vẽ ô Phút và gửi.
     · Đề tài sau bảo vệ: gốc đặt id hai ô tiếng Việt / tiếng Anh đảo chéo nên ô cột "Tên tiếng việt" bị gửi vào tham số tiếng Anh
       và ngược lại → gửi đúng cột.
     · Sau khi lưu gốc KHÔNG nạp lại hội đồng / lịch nên dòng mới vẫn mang id rỗng — bấm Lưu lần hai thêm trùng → nạp lại.
     · Lịch sử xác nhận: gốc có bảng tblModal_XacNhan nhưng không bao giờ đổ dữ liệu → đổ từ chính lời gọi LayDanhSach.
     · Sau khi xác nhận gốc gọi getList_XacNhanSanPham() không truyền id (mã sản phẩm "…undefined") → nạp lại đúng id.
     · Tệp khoá luận (luận văn): gốc đọc kho NCKH_Files nhưng lưu LVLA_Files → đọc / lưu cùng LVLA_Files. KIỂM TRÊN HOST.
     · genHTML_NhanSu kiểm trùng so với mảng id BẢN GHI (lẫn id thành viên) → kiểm theo id nhân sự.
     · Gốc ghi đè ô lọc "kế hoạch" bằng kế hoạch của dòng đang mở → dùng thẳng kế hoạch của dòng, không đụng ô lọc.
     · Chọn nhân sự: gốc để hộp mở sau mỗi lần Chọn; pickNhanSu cho đánh dấu nhiều người rồi đóng. Hộp LLKH: giữ như gốc (chọn từng người).
   Cố ý bỏ: delete_<màn> (LVLA_DeCuong_DangKy/Xoa — không nút nào gọi), ô chọn Hệ / Khoá / Chương trình / Lớp / Học viên và nhóm
     hàm cbGenCombo_* / getList_* nạp chúng (chỉ để hiện giá trị khoá), nút "Thêm" (.btnAdd không có trong html gốc), cột Hình ảnh
     của hộp LLKH, cột "Xác nhận" của hội đồng (đã bỏ comment trong gốc), các id mã chết (dropAAAA, txtAAAA…).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var LB = ums.lvBaoVe = ums.lvBaoVe || {};

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function chucNang() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    var DANG_TAI = ui.empty('Đang tải…', 'fa-spinner fa-spin');

    function g(action, o, post) {
        return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {}));
    }
    function kv(n, v) { return '<div class="ums-kv"><span>' + esc(n) + '</span><b>' + esc(v) + '</b></div>'; }
    function opts(list, sel, head) {
        return '<option value="">' + esc(head) + '</option>' + arr(list).map(function (d) {
            return '<option value="' + esc(d.ID) + '"' + (e(d.ID) === e(sel) ? ' selected' : '') + '>' + esc(d.TEN) + '</option>';
        }).join('');
    }
    function ten(r) {
        return (r.LOAICHUCDANH_MA ? r.LOAICHUCDANH_MA + '. ' : '') + (r.LOAIHOCVI_MA ? r.LOAIHOCVI_MA + '. ' : '') + e(r.HOTEN);
    }

    /* ---------- Hộp chọn từ lý lịch khoa học (edu.extend.genModal_LLKH) ------------------------------ */
    LB.pickLLKH = function (onPick) {
        var page = 1, size = 10, total = 0, rows = [];
        var dlg = ui.dialog({ title: 'Tìm kiếm nhân sự', icon: 'fa-user-magnifying-glass', size: 'xl', body:
            '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div></div>' +
            '<div class="ums-u-mt-4" data-f="tbl"></div>' });
        var B = dlg.body, tbl = B.querySelector('[data-f="tbl"]'), q = B.querySelector('[data-f="q"]');
        function tim(p) {
            if (p) page = p;
            tbl.innerHTML = DANG_TAI;
            ums.api.call({ action: 'TN_LLKH_HoSo_MH/DSA4BSAvKRIgIikNDQoJ', func: 'pkg_llkh_hoso.LayDanhSachLLKH', method: 'POST', silent: true,
                strTuKhoa: (q.value || '').trim(), iTrangThai: -1, iTinhTrang: -1, strLoaiTimKiem: '', dChiLayDSCoSua: -1, pageIndex: page, pageSize: size })
                .then(function (r) { rows = arr(r.data); total = Number(r.pager) || rows.length; ve(); })
                .catch(function (err) { tbl.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tìm nhân sự'); });
        }
        function ve() {
            ui.table({ el: tbl, rows: rows, empty: 'Không tìm thấy nhân sự',
                page: { index: page, size: size, total: total, onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) tim(p); },
                    onSize: function (v) { size = v === 'all' ? Math.max(total, 1) : Number(v); tim(1); } },
                columns: [
                    { title: 'Họ tên', render: function (r) {
                        return esc((r.MACHUCDANH ? r.MACHUCDANH + '.' : '') + (r.MAHOCVI ? r.MAHOCVI + '.' : '') + ' ' + e(r.HOVATEN)) + '<br><span class="ums-u-faint">' + esc(e(r.MASO)) + '</span>'; } },
                    { title: 'Năm sinh', cls: 'is-center is-nowrap', render: function (r) {
                        return esc([r.NGAYSINH, r.THANGSINH, r.NAMSINH].filter(function (x) { return e(x) !== ''; }).join('/')); } },
                    { title: 'Giới tính', prop: 'TENGIOITINH', cls: 'is-center' },
                    { title: '#', cls: 'is-center', width: '90px', render: function (r, i) {
                        return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-pk="' + i + '"><i class="fa-light fa-circle-check"></i><span>Chọn</span></button>'; } }
                ] });
        }
        B.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-a="search"]')) { tim(1); return; }
            var b = ev.target.closest('[data-pk]');
            if (b) onPick(rows[Number(b.getAttribute('data-pk'))]);
        });
        q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(1); } });
        tim(1);
        return dlg;
    };

    /* =====================================================================
       Khung màn
       ===================================================================== */
    LB.man = function (root, cfg) {
        var LISTA = cfg.listAction || 'LVLA_DeCuong_ChinhThuc/LayDanhSach';
        var HDA = cfg.hdAction || 'LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach';
        var st = { page: 1, size: 10, rows: [] };
        var dm = { vaiTro: [], danhGia: [], xacNhan: [] };
        var coXn = cfg.xacNhan !== false, coDt = cfg.deTai !== false;

        root.innerHTML = pat.page(cfg.tieuDe) +
            pat.filterBar([{ key: 'kh', type: 'select', label: 'Chọn kế hoạch' }, { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
                { searchText: 'Tìm kiếm', extra: cfg.mauImport ? '<div class="ums-field ums-field--fit" data-z="mau"></div>' : '' }) +
            pat.panel({ title: 'Danh sách bảo vệ', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        var kh = root.querySelector('[data-f="kh"]'), q = root.querySelector('[data-f="q"]'), bang = root.querySelector('[data-z="bang"]');

        /* ---------- danh mục dùng chung (nạp một lần, cache của ums.api.dm) ---------- */
        var dmReady = Promise.all([
            ums.api.dm(cfg.dmVaiTro || 'LVLA.VTHDONG').then(function (d) { dm.vaiTro = d; }),
            ums.api.dm('LVLA.DGHD').then(function (d) { dm.danhGia = d; }),
            coXn ? ums.api.dm('XLHV.XNKK', 'HESO1').then(function (d) { dm.xacNhan = d; }) : null
        ]).catch(function (err) { ums.api.handle(err, 'danh mục'); });

        /* ---------- danh sách ---------- */
        function tai(page) {
            if (page) st.page = page;
            bang.innerHTML = DANG_TAI;
            return g(LISTA, { strTuKhoa: (q.value || '').trim(), strQLSV_NguoiHoc_Id: '', strNguoiDangKy_Id: '', strLVLA_KeHoach_DeCuong_Id: kh.value,
                strNguoiThucHien_Id: uid(), pageIndex: st.page, pageSize: st.size }).then(function (r) {
                st.rows = arr(r.data);
                var tong = Number(r.pager) || st.rows.length;
                root.querySelector('[data-z="n"]').textContent = '(' + tong + ')';
                ui.table({ el: bang, rows: st.rows, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN', cls: 'is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center is-nowrap' },
                    { title: 'Ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
                    { title: 'Tên đề cương', prop: 'TENTIENGVIET' },
                    { title: 'Quyết định', prop: 'SOQUYETDINH', cls: 'is-nowrap' },
                    { title: 'Mô tả', prop: 'MOTA' },
                    { title: 'Chi tiết', cls: 'is-center', width: '110px', render: function (r) {
                        return ui.btn('view', { cls: 'ums-btn--sm', attr: { 'data-bv-mo': r.ID } }); } }
                ], page: { index: st.page, size: st.size, total: tong, onChange: tai, onSize: function (n) { st.size = n; tai(1); } } });
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách bảo vệ'); });
        }
        if (window.jQuery) jQuery(kh).on('select2:select select2:clear', function () { tai(1); });
        q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        root.addEventListener('click', function (ev) {
            if (ev.target.closest('.ums-formtrang')) return;
            if (ev.target.closest('[data-a="search"]')) { tai(1); return; }
            var m = ev.target.closest('[data-bv-mo]');
            if (m) {
                var id = m.getAttribute('data-bv-mo');
                var row = st.rows.filter(function (r) { return e(r.ID) === id; })[0];
                if (row) mo(row);
            }
        });

        g('LVLA_KeHoach_DeCuong/LayDanhSach', { strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(kh, arr(r.data), { name: 'TEN', head: 'Chọn kế hoạch' }); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
        if (cfg.mauImport && ums.report && ums.report.mount) {
            ums.report.mount(root.querySelector('[data-z="mau"]'), { import: false, collect: function (add) {
                add('strLVLA_KeHoach_DeCuong_Id', kh.value);
            } });
        }
        tai(1);

        /* =================================================================
           Biểu mẫu chi tiết một dòng
           ================================================================= */
        function mo(row) {
            var tv = [], lich = [], hdRows = [], bin = false, tep = null, loiLuu = 0;
            var f = pat.formTrang({ host: root, title: cfg.tieuDe + ' — ' + e(row.QLSV_NGUOIHOC_HOTEN), icon: 'fa-user-graduate', cols: 1,
                buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } }],
                body:
                '<div class="ums-grid ums-grid--12 ums-u-mb-4">' +
                  '<div style="grid-column:span 4"><div class="ums-legend">Thông tin học viên</div>' +
                    kv('Hệ', e(row.DAOTAO_HEDAOTAO_TEN)) + kv('Khóa', e(row.DAOTAO_KHOADAOTAO_TEN)) +
                    kv('Chương trình', e(row.DAOTAO_CHUONGTRINH_TEN)) + kv('Lớp', e(row.DAOTAO_LOPQUANLY_TEN)) +
                    kv('Học viên', (e(row.QLSV_NGUOIHOC_MASO) + ' - ' + e(row.QLSV_NGUOIHOC_HOTEN)).replace(/^ - /, '')) +
                    kv('Số quyết định', e(row.SOQUYETDINH)) + kv('Ngày quyết định', e(row.NGAYQUYETDINH)) + '</div>' +
                  '<div style="grid-column:span 8"><div class="ums-legend">Thông tin đề cương</div>' +
                    kv('Tên đề cương tiếng việt', e(row.TENTIENGVIET)) + kv('Tên đề cương tiếng anh', e(row.TENTIENGANH)) +
                    kv('Ngày đăng ký', e(row.NGAYDANGKY)) + kv('Mô tả', e(row.MOTA)) + '</div>' +
                '</div>' +
                pat.panel({ title: cfg.nhomHD, icon: 'fa-user-tie', cls: 'ums-u-mb-4', flush: true, zone: 'hd' }) +
                pat.panel({ title: 'Hội đồng bảo vệ', icon: 'fa-users', cls: 'ums-u-mb-4', flush: true, zone: 'tv',
                    tools: (coXn ? '<span data-z="dgc"></span>' : '') + ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-success', attr: { 'data-bv': 'them-tv' } }),
                    foot: cfg.tongDiem ? '<div class="ums-field ums-field--inline"><label class="ums-field__label">Tổng điểm</label>' +
                            '<input class="ums-input" data-bv="tong" value="' + esc(e(row.DIEM)) + '"' + (row.VMACACHLAY === 'TUNGTHANHVIEN' ? ' readonly' : '') + '></div>' : '' }) +
                pat.panel({ title: 'Lịch bảo vệ', icon: 'fa-calendar-days', cls: 'ums-u-mb-4', flush: true, zone: 'lich',
                    tools: ui.btn('add', { text: 'Thêm dòng mới', mod: 'out-success', attr: { 'data-bv': 'them-lich' } }),
                    foot: '<span class="ums-u-faint ums-u-fz13"><i>Chú ý: Phải điền đầy đủ thông tin</i></span>' }) +
                (coDt ? pat.panel({ title: 'Đề tài sau bảo vệ', icon: 'fa-file-lines', flush: true, zone: 'dt',
                    foot: cfg.coTep ? '<div class="ums-field"><label class="ums-field__label">File khóa luận bản cuối cùng đính kèm</label><div data-z="tep"></div></div>' : '' }) : '') });
            var B = f.body;
            function z(k) { return B.querySelector('[data-z="' + k + '"]'); }
            ['hd', 'tv', 'lich', 'dt'].forEach(function (k) { if (z(k)) z(k).innerHTML = DANG_TAI; });
            ui.enhance(B);
            if (cfg.coTep && z('tep')) { tep = ums.files.mount(z('tep'), { api: 'LVLA_Files' }); tep.load('DETAISAUBAOVE' + row.ID); }

            function loi(err, o) { ums.api.handle(err, o); }
            function chung() { return { strChucNang_Id: chucNang(), strLVLA_DeCuong_ChinhThuc_Id: row.ID, strLVLA_KeHoach_DeCuong_Id: e(row.LVLA_KEHOACH_DECUONG_ID),
                strQLSV_NguoiHoc_Id: e(row.QLSV_NGUOIHOC_ID), strNguoiThucHien_Id: uid() }; }

            /* ---------- Hướng dẫn (chỉ xem) ---------- */
            g(HDA, { strTuKhoa: '', strNguoiDung_Id: '', strLVLA_DeCuong_DangKy_Id: row.ID, strQLSV_NguoiHoc_Id: '', strNguoiHuongDan_Id: '', strVaiTro_Id: '',
                strLVLA_KeHoach_DeCuong_Id: e(row.LVLA_KEHOACH_DECUONG_ID), strLVLA_DeCuong_ChinhThuc_Id: row.ID, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    hdRows = arr(r.data);
                    ui.table({ el: z('hd'), rows: hdRows, empty: 'Chưa có người hướng dẫn', columns: [
                        { title: 'Họ tên', prop: 'NGUOIHUONGDAN_HOTEN' }, { title: 'Cơ quan công tác', prop: 'NGUOIHUONGDAN_COQUANCONGTAC' },
                        { title: 'Vai trò', prop: 'VAITRO_TEN' }] });
                }).catch(function (err) { z('hd').innerHTML = ui.fail(err.message); loi(err, 'danh sách hướng dẫn'); });

            /* ---------- Hội đồng ---------- */
            function thuTv() {
                tv.forEach(function (t, i) {
                    ['diem', 'danhGia', 'nhanXet', 'vaiTro'].forEach(function (k) {
                        var el = z('tv').querySelector('[data-tvk="' + k + '"][data-i="' + i + '"]');
                        if (el) t[k] = el.value;
                    });
                });
            }
            function veTv() {
                var cot = [{ title: 'Họ tên', render: function (t) { return esc(t.ten); } },
                    { title: 'Cơ quan công tác', render: function (t) { return esc(t.coQuan); } }];
                if (cfg.coDiem) cot.push({ title: 'Điểm', width: '90px', render: function (t, i) {
                    return '<input class="ums-input ums-input--sm" data-tvk="diem" data-i="' + i + '" value="' + esc(t.diem) + '">'; } });
                cot.push({ title: 'Đánh giá', render: function (t, i) {
                    return '<select class="ums-select ums-input--sm" data-tvk="danhGia" data-i="' + i + '">' + opts(dm.danhGia, t.danhGia, 'Chọn đánh giá') + '</select>'; } });
                cot.push({ title: 'Nhận xét', render: function (t, i) {
                    return '<input class="ums-input ums-input--sm" data-tvk="nhanXet" data-i="' + i + '" value="' + esc(t.nhanXet) + '">'; } });
                cot.push({ title: 'Vai trò', render: function (t, i) {
                    return '<select class="ums-select ums-input--sm" data-tvk="vaiTro" data-i="' + i + '">' + opts(dm.vaiTro, t.vaiTro, 'Chọn vai trò') + '</select>'; } });
                cot.push({ title: 'Xóa', cls: 'is-center', width: '100px', render: function (t, i) {
                    return ui.btn('del', { text: 'Xóa', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-bv': 'xoa-tv', 'data-i': i } }); } });
                ui.table({ el: z('tv'), rows: tv, columns: cot, empty: 'Chưa có thành viên hội đồng' });
            }
            function napTv() {
                return g(cfg.tv + '/LayDanhSach', { strTuKhoa: '', strLVLA_KeHoach_DeCuong_Id: '', strThanhVien_Id: '', strDanhGia_Id: '', strQLSV_NguoiHoc_Id: '',
                    strVaiTro_Id: '', strLVLA_DeCuong_ChinhThuc_Id: row.ID, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
                    tv = arr(r.data).map(function (d) {
                        return { id: e(d.ID), nsId: e(d.THANHVIEN_ID), ten: (e(d.THANHVIEN_HODEM) + ' ' + e(d.THANHVIEN_TEN)).trim(), coQuan: e(d.THANHVIEN_COQUANCONGTAC),
                            diem: e(d.DIEM), danhGia: e(d.DANHGIA_ID), nhanXet: e(d.NHANXET), vaiTro: e(d.VAITRO_ID) };
                    });
                    veTv();
                }).catch(function (err) { z('tv').innerHTML = ui.fail(err.message); loi(err, 'hội đồng bảo vệ'); });
            }
            function themNguoi(id, tenNguoi, coQuan) {
                thuTv();
                if (tv.some(function (t) { return t.nsId === e(id); })) { ui.toast('Đã tồn tại!', 'warn'); return false; }
                tv.push({ id: '', nsId: e(id), ten: tenNguoi, coQuan: coQuan, diem: '', danhGia: '', nhanXet: '', vaiTro: '' });
                veTv();
                ui.toast('Đã chọn!', 'ok');
                return true;
            }
            function chonNguoi() {
                if (cfg.picker === 'llkh') {
                    LB.pickLLKH(function (r) {
                        themNguoi(r.ID, ((r.MACHUCDANH ? r.MACHUCDANH + '.' : '') + (r.MAHOCVI ? r.MAHOCVI + '.' : '') + ' ' + e(r.HOVATEN)).trim(), e(r.COQUANCONGTAC));
                    });
                } else {
                    pat.pickNhanSu({ title: 'Tìm kiếm nhân sự', onPick: function (list) {
                        list.forEach(function (r) { themNguoi(r.ID, ten(r), e(r.COQUANCONGTAC) || e(r.DAOTAO_COCAUTOCHUC_TEN)); });
                    } });
                }
            }

            /* ---------- Lịch + đề tài sau bảo vệ ---------- */
            function thuLich() {
                lich.forEach(function (l, i) {
                    ['ngay', 'gio', 'phut', 'diaDiem'].forEach(function (k) {
                        var el = z('lich').querySelector('[data-lk="' + k + '"][data-i="' + i + '"]');
                        if (el) l[k] = (el.value || '').trim();
                    });
                    if (coDt) ['dtTv', 'dtTa'].forEach(function (k) {
                        var el = z('dt').querySelector('[data-lk="' + k + '"][data-i="' + i + '"]');
                        if (el) l[k] = (el.value || '').trim();
                    });
                });
            }
            function veLich() {
                var cot = [{ title: 'Ngày', width: '170px', render: function (l, i) {
                    return '<div class="ums-inputwrap"><input class="ums-input ums-input--sm" data-lk="ngay" data-i="' + i + '" data-date placeholder="dd/mm/yyyy" autocomplete="off" value="' + esc(l.ngay) + '">' +
                        '<i class="fa-light fa-calendar"></i></div>'; } },
                    { title: 'Giờ', width: '90px', render: function (l, i) { return '<input class="ums-input ums-input--sm" data-lk="gio" data-i="' + i + '" value="' + esc(l.gio) + '">'; } }];
                if (cfg.coPhut) cot.push({ title: 'Phút', width: '90px', render: function (l, i) {
                    return '<input class="ums-input ums-input--sm" data-lk="phut" data-i="' + i + '" value="' + esc(l.phut) + '">'; } });
                cot.push({ title: 'Địa điểm', render: function (l, i) { return '<input class="ums-input ums-input--sm" data-lk="diaDiem" data-i="' + i + '" value="' + esc(l.diaDiem) + '">'; } });
                cot.push({ title: 'Xóa', cls: 'is-center', width: '110px', render: function (l, i) {
                    return ui.btn('del', { text: l.id ? 'Xóa' : 'Xóa dòng', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-bv': 'xoa-lich', 'data-i': i } }); } });
                ui.table({ el: z('lich'), rows: lich, columns: cot, empty: 'Chưa có lịch bảo vệ' });
                ui.enhance(z('lich'));
                if (coDt) veDeTai();
            }
            function veDeTai() {
                var luu = lich.map(function (l, i) { return { l: l, i: i }; }).filter(function (x) { return x.l.id; });
                ui.table({ el: z('dt'), rows: luu, empty: 'Chưa có lịch bảo vệ đã lưu', columns: [
                    { title: 'Tên tiếng việt', render: function (x) { return '<input class="ums-input ums-input--sm" data-lk="dtTv" data-i="' + x.i + '" value="' + esc(x.l.dtTv) + '">'; } },
                    { title: 'Tên tiếng anh', render: function (x) { return '<input class="ums-input ums-input--sm" data-lk="dtTa" data-i="' + x.i + '" value="' + esc(x.l.dtTa) + '">'; } }] });
            }
            function napLich() {
                return g(cfg.lich + '/LayDanhSach', { strTuKhoa: '', strLVLA_KeHoach_DeCuong_Id: '', strLVLA_DeCuong_ChinhThuc_Id: row.ID, strQLSV_NguoiHoc_Id: '',
                    strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
                    lich = arr(r.data).map(function (d) {
                        return { id: e(d.ID), ngay: e(d.NGAY), gio: e(d.GIO), phut: e(d.PHUT), diaDiem: e(d.DIADIEM),
                            dtTv: e(d.TENDETAITIENGVIET_SAUBAOVE), dtTa: e(d.TENDETAITIENGANH_SAUBAOVE) };
                    });
                    if (!lich.length) lich.push({ id: '', ngay: '', gio: '', phut: '', diaDiem: '', dtTv: '', dtTa: '' });   // gốc luôn có ít nhất một dòng
                    veLich();
                }).catch(function (err) { z('lich').innerHTML = ui.fail(err.message); loi(err, 'lịch bảo vệ'); });
            }

            /* ---------- Đánh giá chung (xác nhận) ---------- */
            var lsXn = [];
            function napXn() {
                return g('LVLA_NhanXet_DanhGia/LayDanhSach', { strTuKhoa: '', strsanpham_Id: cfg.sanPham + row.ID, strTinhTrang_Id: '', strNguoiThucHien_Id: '',
                    pageIndex: 1, pageSize: 100000 }).then(function (r) {
                    lsXn = arr(r.data);
                    var d = lsXn[0];
                    z('dgc').innerHTML = ui.btn('confirm', { text: d ? e(d.TINHTRANG_TEN) : 'Đánh giá chung', mod: 'out-primary',
                        icon: d && d.TINHTRANG_THONGTIN1 ? ums.iconFA4(d.TINHTRANG_THONGTIN1) : undefined, attr: { 'data-bv': 'xn' } });
                }).catch(function (err) { loi(err, 'xác nhận'); });
            }
            function hopXn() {
                var dlg = ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'lg', body:
                    '<div class="ums-legend">Nội dung xác nhận</div><input class="ums-input" data-xn="nd" autocomplete="off">' +
                    '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="ums-row" data-xn="btn"></div>' +
                    '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-xn="ls"></div>' });
                var b = dlg.body;
                b.querySelector('[data-xn="btn"]').innerHTML = dm.xacNhan.map(function (d) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary" data-xn-tt="' + esc(d.ID) + '">' +
                        (d.THONGTIN1 ? '<i class="' + esc(ums.iconFA4(d.THONGTIN1)) + '"></i>' : '') + '<span>' + esc(d.TEN) + '</span></button>';
                }).join('');
                ui.table({ el: b.querySelector('[data-xn="ls"]'), rows: lsXn, empty: 'Chưa có lượt xác nhận', columns: [
                    { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
                b.addEventListener('click', function (ev) {
                    var t = ev.target.closest('[data-xn-tt]');
                    if (!t) return;
                    var nd = (b.querySelector('[data-xn="nd"]').value || '').trim();
                    g('LVLA_NhanXet_DanhGia/ThemMoi', { strId: '', strSanPham_Id: cfg.sanPham + row.ID, strNoiDung: nd, strTinhTrang_Id: t.getAttribute('data-xn-tt'),
                        strNguoiXacnhan_Id: uid(), strChucNang_Id: chucNang() }, true)
                        .then(function () { ui.toast('Xác nhận thành công', 'ok'); dlg.close(); napXn(); })
                        .catch(function (err) { loi(err, 'xác nhận'); });
                });
            }

            /* ---------- Lưu ---------- */
            function chay(c) { return ums.api.call(c).catch(function (err) { loiLuu++; loi(err, 'lưu'); }); }
            function luu() {
                if (bin) return;
                bin = true; loiLuu = 0;
                thuTv(); thuLich();
                var cs = [];
                tv.forEach(function (t) {
                    cs.push(Object.assign({ action: cfg.tv + (t.id ? '/CapNhat' : '/ThemMoi'), method: 'POST', strId: t.id, strThanhVien_Id: t.nsId, strVaiTro_Id: t.vaiTro,
                        dDiem: cfg.coDiem ? t.diem : '', strDanhGia_Id: t.danhGia, strNhanXet: t.nhanXet }, chung()));
                });
                lich.forEach(function (l) {
                    if (!l.ngay) return;     // gốc: dòng không có Ngày bị bỏ (kể cả đề tài sau bảo vệ)
                    var c = Object.assign({ action: cfg.lich + (l.id ? '/CapNhat' : '/ThemMoi'), method: 'POST', strId: l.id, strNgay: l.ngay, strGio: l.gio }, chung());
                    if (cfg.coPhut) c.strPhut = l.phut;
                    c.strDiaDiem = l.diaDiem;
                    cs.push(c);
                    if (l.id && coDt) cs.push(Object.assign({ action: cfg.lich + '/' + cfg.suaDeTai, method: 'POST', strId: l.id, strTenDeTaiTV_SauBaoVe: l.dtTv, strTenDeTaiTA_SauBaoVe: l.dtTa }, chung()));
                });
                if (cfg.tongDiem) cs.push({ action: 'LVLA_DeCuong_ChinhThuc/Sua_LVLA_DeCuong_CT_Diem', method: 'POST', strId: row.ID, strChucNang_Id: chucNang(),
                    strTongDiem: (B.querySelector('[data-bv="tong"]').value || '').trim(), strNguoiThucHien_Id: uid() });
                cs.reduce(function (p, c) { return p.then(function () { return chay(c); }); }, Promise.resolve())
                    .then(function () { return tep ? tep.save('DETAISAUBAOVE' + row.ID).catch(function (err) { loiLuu++; loi(err, 'tệp đính kèm'); }) : null; })
                    .then(function () { if (!loiLuu) ui.toast('Lưu thành công', 'ok'); return Promise.all([napTv(), napLich()]); })
                    .then(function () { bin = false; tai(); }, function () { bin = false; });
            }

            B.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-bv]');
                if (!b || b.closest('.ums-formtrang') !== f.el) return;
                var k = b.getAttribute('data-bv'), i = Number(b.getAttribute('data-i'));
                if (k === 'them-tv') { chonNguoi(); return; }
                if (k === 'them-lich') { thuLich(); lich.push({ id: '', ngay: '', gio: '', phut: '', diaDiem: '', dtTv: '', dtTa: '' }); veLich(); return; }
                if (k === 'xn' && coXn) { hopXn(); return; }
                if (k === 'xoa-tv') {
                    thuTv();
                    var t = tv[i];
                    if (!t.id) { tv.splice(i, 1); veTv(); return; }
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                        if (!yes) return;
                        return g(cfg.tv + '/Xoa', { strIds: t.id, strNguoiThucHien_Id: uid() }, true).then(function () {
                            tv.splice(tv.indexOf(t), 1); veTv(); ui.toast('Xóa thành công!', 'ok');
                        });
                    }).catch(function (err) { loi(err, 'xóa thành viên'); });
                    return;
                }
                if (k === 'xoa-lich') {
                    thuLich();
                    var l = lich[i];
                    var bo = function () { lich.splice(lich.indexOf(l), 1); if (!lich.length) lich.push({ id: '', ngay: '', gio: '', phut: '', diaDiem: '', dtTv: '', dtTa: '' }); veLich(); };
                    if (!l.id) { bo(); return; }
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                        if (!yes) return;
                        return g(cfg.lich + '/Xoa', { strIds: l.id, strNguoiThucHien_Id: uid() }, true).then(function () { bo(); ui.toast('Xóa thành công!', 'ok'); });
                    }).catch(function (err) { loi(err, 'xóa lịch'); });
                }
            });

            dmReady.then(function () { return Promise.all([napTv(), napLich(), coXn ? napXn() : null]); });
        }
        return { tai: tai };
    };
})();
