/* =========================================================================
   Tất cả hoạt động — hoạt động / biến động nhân sự do cán bộ tự khai
   Bản gốc: ApisCongCanBo/Modules/hoso/script/qtthongtin.js (1.067 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_HoatDong_ThongTin/LayDM_NhanSu_HoatDong  GET  → ô Hoạt động (biểu mẫu)
       NS_HoatDong_ThongTin/LayDanhSach            GET  strNhanSu_HoSoCanBo_Id, strHoatDongNhanSu_Id ''
       NS_HoatDong_ThongTin/ThemMoi | CapNhat, Xoa (strIds — nút Xoá trong biểu mẫu)
       Lưới quyết định: NS_ThongTinQuyetDinh (strNguonDuLieu_Id = id hoạt động), tệp NS_Files
       "Tự nhập hồ sơ": NS_HoatDong_DuLieu/LayDanhSach + ThemMoi mỗi trường
           (strTruongThongTin_Id, strTruongThongTin_GiaTri, strHoatDongNhanSu_Id = TAB đang chọn)
   Bản gốc không có LayChiTiet — sửa lấy dòng từ danh sách.
   Danh mục: NS.DMCV, NS.DMHV, NS.LOCD, NS.TDCT, NS.TDTH, NS.TDNN, NS.QUDI, cơ cấu tổ chức.
   Bảng: tiêu đề hai tầng, "Biến động liên quan" gộp 14 cột.

   Khác bản gốc (lỗi rõ ràng):
     · BỎ dải tab (người dùng quyết 2026-09-22): trang này trước thiết kế nhiều tab
       (mỗi loại hoạt động một tab, trỏ tới #tab_2, #tab_3… KHÔNG có trên màn), sau
       gom về MỘT trang "Tất cả hoạt động" nhưng mã gốc vẫn giữ khung tab. Bản mới
       bỏ hẳn khung đó — danh sách luôn là tất cả (strHoatDongNhanSu_Id rỗng như tab
       mặc định của gốc).
     · Bảng "Tự nhập hồ sơ": bản gốc chỉ nạp khi Thêm mới; mở Sửa thì bảng còn
       nguyên của lần trước. Ở đây nạp lại mỗi lần mở biểu mẫu.
   Giữ như bản gốc (chờ nghiệp vụ):
     · Cột đánh dấu ở cuối bảng + ô chọn tất cả: nút xoá hàng loạt đã bị chú
       thích bỏ → không vẽ (không có việc gì để làm với ô đã đánh dấu).
     · Tám tham số quyết định của bản ghi chính đọc ô txtAAAA/dropAAAA → rỗng.
     · Lưới quyết định: strNguoiKyQuyetDinh / strThongTinQuyetDinh đọc ô không
       có trong dòng → rỗng; chỉ lưu dòng có Số quyết định; thêm mới vẽ 1 dòng.
     · Tự nhập hồ sơ: strId luôn rỗng (đọc txtAAAA) → luôn ThemMoi; giá trị
       đang có lấy THONGTINXACMINH (cờ bcheck không bao giờ bật). Trường kiểu
       FILE: bản gốc gửi chuỗi tên tệp tạm và xem tệp theo khoá chữ "m<ID>" —
       không dựng lại được đúng; ở đây hiện chữ "chưa hỗ trợ" và gửi rỗng.

   DÙNG LẠI ở bản quản trị Nhân sự (ApisNhanSu/Modules/hoso/qtthongtin — chọn một
   cán bộ rồi khai hoạt động cho người đó): ums.ccbQtThongTin.mount(root, { nhanSuId, tieuDe, quanTri }).
     nhanSuId()  người đang xem (strNhanSu_HoSoCanBo_Id); mặc định người đăng nhập.
     tieuDe      false = không vẽ tiêu đề trang (khung lồng).
     quanTri     true = khác biệt của bản NS (qtthongtin.js gốc NS):
                 · bảng KHÔNG có 14 cột "Biến động liên quan" (genTable NS chỉ 5 cột);
                 · danh mục hoạt động (LayDM_NhanSu_HoatDong) gửi strNhanSu_HoSoCanBo_Id
                   RỖNG như gốc NS (gọi lúc mở màn, trước khi chọn cán bộ);
                 · "Tự nhập hồ sơ" theo HOẠT ĐỘNG đang chọn trong biểu mẫu: nạp lại khi
                   đổi ô Hoạt động, gửi strNhanSu_HoatDong_TT_Id (bản ghi đang sửa; lưu
                   thì id vừa lưu) + strHoatDongNhanSu_Id = ô Hoạt động; giá trị đang có
                   đọc TRUONGTHONGTIN_GIATRI; kiểu TEXT/NUMBER (DORONG → ô nhiều dòng),
                   DATE, LIST (+ TINH/HUYEN/XA: ô chọn không nguồn — như gốc), FILE (tệp
                   NS_Files gắn vào id TRƯỜNG thông tin, như gốc); DUOCSUA = 0 → chỉ đọc.
   Mặc định giữ nguyên hành vi Cổng cán bộ: tự dựng vào #qtthongtin nếu có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    function mount(root, mo) {
        mo = mo || {};
        var qt = !!mo.quanTri;
        function ns() { return mo.nhanSuId ? mo.nhanSuId() : uid(); }
        var C = 'NS_HoatDong_ThongTin';
        var tab = '';                      // strHoatDong_Id của bản gốc — luôn '' = tất cả (đã bỏ dải tab)
        var dsHoatDong = [];

        var CCTC = { call: {
            action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
            dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
        }, name: 'TEN' };
        var HOATDONG = { items: dsHoatDong };

        /* Bảy nhóm biến động: [tiêu đề, tiền tố cột, tiền tố tham số, nguồn, ô "khác" mới] */
        var BD = [
            ['Đơn vị', 'DONVI_CCTC', 'DonVi_CCTC', CCTC],
            ['Chức vụ', 'CHUCVU', 'ChucVu', { dm: 'NS.DMCV' }],
            ['Bằng cấp', 'BANGCAP', 'BangCap', { dm: 'NS.DMHV' }],
            ['Chức danh', 'CHUCDANH', 'ChucDanh', { dm: 'NS.LOCD' }],
            ['Trình độ chính trị', 'TRINHDOCHINHTRI', 'TrinhDoCT', { dm: 'NS.TDCT' }],
            ['Trình độ tin học', 'TRINHDOTINHOC', 'TrinhDoTH', { dm: 'NS.TDTH' }],
            ['Trình độ ngoại ngữ', 'TRINHDONGOAINGU', 'TrinhDoNN', { dm: 'NS.TDNN' }]
        ];

        var fields = [
            { key: 'strHoatDongNhanSu_Id', col: 'HOATDONGNHANSU_ID', label: 'Hoạt động', type: 'select', source: HOATDONG,
              placeholder: 'Chọn hoạt động', span: true },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date', cols: 6 },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date', cols: 6 },
            { key: 'strMoTa', col: 'MOTA', label: 'Nội dung', type: 'textarea', span: true }
        ];
        BD.forEach(function (b) {
            var c = b[1];      // viewEdit gốc đọc <tiền tố>_HIENTAI_ID / _HIENTAI / _BIENDONG_ID / _BIENDONG / _BIENDONG_MOTA
            fields.push({ key: '_lg' + b[2], type: 'legend', label: 'Biến động ' + b[0].toLowerCase() });
            fields.push({ key: 'str' + b[2] + '_HienTai_Id', col: c + '_HIENTAI_ID', label: b[0] + ' hiện tại', type: 'select', source: b[3], cols: 6 });
            fields.push({ key: 'str' + b[2] + '_HienTai', col: c + '_HIENTAI', label: 'Khác', cols: 6 });
            fields.push({ key: 'str' + b[2] + '_BienDong_Id', col: c + '_BIENDONG_ID', label: b[0] + ' mới', type: 'select', source: b[3], cols: 6 });
            fields.push({ key: 'str' + b[2] + '_BienDong', col: c + '_BIENDONG', label: 'Khác', cols: 6 });
            fields.push({ key: 'str' + b[2] + '_BienDong_MoTa', col: c + '_BIENDONG_MOTA', label: 'Ghi chú', type: 'textarea', span: true });
        });

        var BDG = ['Biến động liên quan'];
        var columns = [
            { title: 'Hoạt động', prop: 'HOATDONGNHANSU_TEN' },
            { title: 'Nội dung', prop: 'MOTA' },
            { title: 'Từ Ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' }
        ];
        if (!qt) BD.forEach(function (b) {
            columns.push({ title: b[0] + ' hiện tại', prop: b[1] + '_HIENTAI_TEN', group: BDG, cls: 'is-center' });
            columns.push({ title: b[0] + ' mới', prop: b[1] + '_BIENDONG_TEN', group: BDG, cls: 'is-center' });
        });
        columns.push({ title: 'Quyết định', prop: 'DSSOQUYETDINH', cls: 'is-center' });

        /* ---------- Lưới quyết định + bảng tự nhập hồ sơ (trong biểu mẫu) ---- */
        var luoi = null, tuNhap = [];
        function veThem(extra, row) {
            extra.innerHTML = '<div data-z="qd"></div>' +
                '<div class="ums-panel ums-u-mt-4"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-check"></i> ' +
                'Tự nhập hồ sơ <span class="ums-u-faint ums-u-fz13" data-z="tnDem"></span></div></div><div class="ums-panel__body ums-panel__body--flush" data-z="tn"></div></div>';
            luoi = pat.rows(extra.querySelector('[data-z="qd"]'), {
                title: 'Quyết định', icon: 'fa-file-signature', minRows: 1,
                columns: [
                    { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', title: 'Loại quyết định', type: 'select', source: { dm: 'NS.QUDI' }, placeholder: 'Chọn loại quyết định' },
                    { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', title: 'Số quyết định' },
                    { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', title: 'Ngày quyết định', type: 'date', width: '130px' },
                    { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', title: 'Ngày hiệu lực', type: 'date', width: '130px' },
                    { key: 'strNgayApDung', col: 'NGAYAPDUNG', title: 'Ngày áp dụng', type: 'date', width: '130px' },
                    { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', title: 'Ngày hết hiệu lực', type: 'date', width: '130px' },
                    { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
                ],
                list: function (id) {
                    return { action: 'NS_ThongTinQuyetDinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguonDuLieu_Id: id, iTrangThai: -1,
                        strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '', strLoaiQuyetDinh_Id: '', strThanhVien_Id: '', pageIndex: 1, pageSize: 1000000 };
                },
                filled: function (v) { return !!v.strSoQuyetDinh; },
                save: function (v, rec, id) {
                    return {
                        action: rec ? 'NS_ThongTinQuyetDinh/CapNhat' : 'NS_ThongTinQuyetDinh/ThemMoi',
                        strId: rec ? rec.ID : '', strNgayApDung: v.strNgayApDung, strNguonDuLieu_Id: id,
                        strNhanSu_HoSoCanBo_Id: ns(), strSoQuyetDinh: v.strSoQuyetDinh, strNgayQuyetDinh: v.strNgayQuyetDinh,
                        strNguoiKyQuyetDinh: '', strNgayHieuLuc: v.strNgayHieuLuc, strThongTinQuyetDinh: '', strThongTinDinhKem: '',
                        strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id, strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                        strNguoiThucHien_Id: uid(), iTrangThai: 1, iThuTu: 1
                    };
                },
                remove: function (rec) { return { action: 'NS_ThongTinQuyetDinh/Xoa', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
            });
            luoi.load(row ? row.ID : '');

            napTuNhap(extra, row);
        }

        /* Bảng "Tự nhập hồ sơ". Cổng cán bộ: theo tab (luôn '' = tất cả), giá trị THONGTINXACMINH,
           chỉ TEXT / LIST. Bản NS (qt): theo ô Hoạt động của biểu mẫu + bản ghi đang sửa. */
        var tepTN = {};
        function hdChon() {
            var s = root.querySelector('[data-k="strHoatDongNhanSu_Id"][data-scope="form"]');
            return s ? s.value : '';
        }
        function napTuNhap(extra, row) {
            var tn = extra.querySelector('[data-z="tn"]');
            if (!tn) return;
            tepTN = {};
            tn.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            var goi = { action: 'NS_HoatDong_DuLieu/LayDanhSach', method: 'GET', strChucNang_Id: ums.state.chucNangId || '',
                strNhanSu_HoSoCanBo_Id: ns(), strHoatDongNhanSu_Id: tab, strNguoiThucHien_Id: uid() };
            if (qt) {
                goi = { action: 'NS_HoatDong_DuLieu/LayDanhSach', method: 'GET', strChucNang_Id: ums.state.chucNangId || '',
                    strNhanSu_HoSoCanBo_Id: ns(), strNhanSu_HoatDong_TT_Id: row ? row.ID : '',
                    strHoatDongNhanSu_Id: hdChon(), strNguoiThucHien_Id: uid() };
            }
            ums.api.call(goi).then(function (r) {
                tuNhap = arr(r.data);
                extra.querySelector('[data-z="tnDem"]').textContent = '(' + (r.pager || tuNhap.length) + ')';
                ui.table({
                    el: tn, rows: tuNhap, empty: 'Không có thông tin cần nhập', tableCls: 'ums-table--lined ums-table--tight',
                    columns: [
                        { title: 'Tên thông tin', prop: 'TEN', width: '35%' },
                        { title: 'Dữ liệu cần nhập', render: qt ? oNS : function (x) {
                            var k = String(x.KIEUDULIEU || '').toUpperCase(), val = e(x.THONGTINXACMINH);
                            if (k === 'TEXT') return '<input class="ums-input ums-input--sm" data-tn="' + esc(x.ID) + '" value="' + esc(val) + '">';
                            if (k === 'LIST') return '<select class="ums-select ums-input--sm" data-tn="' + esc(x.ID) + '" data-dm="' + esc(e(x.MABANGDANHMUC)) + '" data-v="' + esc(val) + '"><option value=""></option></select>';
                            if (k === 'FILE') return '<span class="ums-u-faint ums-u-fz13">Trường tệp — chưa hỗ trợ ở bản mới</span>';
                            return '';
                        } }
                    ]
                });
                Array.prototype.forEach.call(tn.querySelectorAll('select[data-dm]'), function (s) {
                    // chỉ ô LIST có nguồn (gốc NS: TINH / HUYEN / XA vẽ ô chọn nhưng không nạp gì)
                    if (!s.getAttribute('data-dm') || (s.getAttribute('data-kieu') || 'LIST') !== 'LIST') return;
                    ums.api.dm(s.getAttribute('data-dm')).then(function (rows) { pat.fill(s, rows); s.value = s.getAttribute('data-v'); });
                });
                if (qt) {
                    Array.prototype.forEach.call(tn.querySelectorAll('[data-tnfile]'), function (h) {
                        var id = h.getAttribute('data-tnfile');
                        tepTN[id] = ums.files.mount(h, { api: 'NS_Files' });
                        tepTN[id].load(id);                   // gốc: viewFiles("m" + ID, aData.ID, "NS_Files")
                    });
                    Array.prototype.forEach.call(tn.querySelectorAll('input[data-tndate]:not([readonly])'), function (el) { ui.datepicker(el); });
                }
            }).catch(function (err) { tn.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tự nhập hồ sơ'); });
        }
        /* Ô nhập của bản NS (genTable_TuNhapHoSo gốc NS) */
        function oNS(x) {
            var k = String(x.KIEUDULIEU || '').toUpperCase(), val = e(x.TRUONGTHONGTIN_GIATRI);
            var ro = x.DUOCSUA === 0 || x.DUOCSUA === '0' ? ' readonly' : '';
            var id = esc(x.ID);
            if (k === 'TEXT' || k === 'NUMBER') {
                // gốc: có DORONG thì <textarea style="height: DORONGpx">; gốc đặt value= trên textarea nên luôn trống — ở đây đổ đúng
                return x.DORONG
                    ? '<textarea class="ums-textarea" data-tn="' + id + '" style="height:' + Number(x.DORONG) + 'px"' + ro + '>' + esc(val) + '</textarea>'
                    : '<input class="ums-input ums-input--sm" data-tn="' + id + '" value="' + esc(val) + '"' + ro + '>';
            }
            if (k === 'DATE') return '<input class="ums-input ums-input--sm" data-tn="' + id + '" data-tndate value="' + esc(val) + '" placeholder="dd/mm/yyyy"' + ro + '>';
            if (k === 'LIST' || k === 'TINH' || k === 'HUYEN' || k === 'XA') {
                return '<select class="ums-select ums-input--sm" data-tn="' + id + '" data-kieu="' + esc(k) + '" data-dm="' + esc(e(x.MABANGDANHMUC)) +
                    '" data-v="' + esc(val) + '"><option value=""></option></select>';
            }
            if (k === 'FILE') return '<div data-tnfile="' + id + '"></div>';
            return '';
        }
        function luuTuNhap(extra, idTT) {
            var gt = {};
            Array.prototype.forEach.call(extra.querySelectorAll('[data-tn]'), function (el) { gt[el.getAttribute('data-tn')] = el.value; });
            var ds = tuNhap.slice(), hd = qt ? hdChon() : tab;
            return ds.reduce(function (p, x) {
                return p.then(function () {
                    var tep = qt && tepTN[x.ID] ? tepTN[x.ID].save(x.ID) : null;   // gốc: saveFiles("m" + ID, aData.ID)
                    var goi = { action: 'NS_HoatDong_DuLieu/ThemMoi', strId: '', strChucNang_Id: ums.state.chucNangId || '',
                        strNhanSu_HoSoCanBo_Id: ns(), strHoatDongNhanSu_Id: hd, strTruongThongTin_Id: x.ID,
                        strTruongThongTin_GiaTri: e(gt[x.ID]), strNguoiThucHien_Id: uid() };
                    if (qt) goi.strNhanSu_HoatDong_TT_Id = idTT || '';
                    return Promise.resolve(tep).then(function () { return ums.api.call(goi); });
                });
            }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu tự nhập hồ sơ'); });
        }

        /* ---------- Khung chính ----------------------------------------------- */
        var extraEl = null;
        var crud = ums.crud({
            root: root,
            embedded: mo.tieuDe === false,
            title: 'Tất cả hoạt động',
            listTitle: 'Tất cả hoạt động',
            formTitle: 'hoạt động',
            addText: 'Thêm mới',
            icon: 'fa-list-timeline',
            formCols: 12,
            multi: false,
            list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: ns(), strHoatDongNhanSu_Id: tab }; } },
            columns: columns,
            fields: fields,
            onForm: function (row, c, extra) {
                extraEl = extra; veThem(extra, row);
                // Bản NS: đổi ô Hoạt động thì nạp lại bảng tự nhập theo hoạt động đó (gốc: dropHoatDong select2:select)
                var s = qt && root.querySelector('[data-k="strHoatDongNhanSu_Id"][data-scope="form"]');
                if (s && window.jQuery && !s._nsHd) {
                    s._nsHd = true;
                    jQuery(s).on('select2:select select2:clear', function () { if (extraEl) napTuNhap(extraEl, crud.editing); });
                }
            },
            save: function (v, row) {
                var x = {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNhanSu_HoSoCanBo_Id: ns(),
                    strHoatDongNhanSu_Id: v.strHoatDongNhanSu_Id,
                    strMoTa: v.strMoTa, strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay
                };
                BD.forEach(function (b) {
                    ['_HienTai_Id', '_HienTai', '_BienDong_Id', '_BienDong', '_BienDong_MoTa'].forEach(function (s) {
                        x['str' + b[2] + s] = v['str' + b[2] + s];
                    });
                });
                ['strLoaiQuyetDinh_Id', 'strThongTinQuyetDinh', 'strNguoiKy', 'strSoQuyetDinh', 'strNgayQuyetDinh',
                 'strNgayHieuLuc', 'strNgayApDung', 'strNgayHetHieuLuc'].forEach(function (k) { x[k] = ''; });
                x.strNguoiThucHien_Id = uid();
                return x;
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : (result.raw && result.raw.Id);
                if (luoi) luoi.save(id || '');
                if (extraEl) luuTuNhap(extraEl, id || '');
            },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        });
        // Bản NS gọi lúc mở màn, khi CHƯA chọn cán bộ → strNhanSu_HoSoCanBo_Id rỗng (giữ như gốc)
        ums.api.call({ action: C + '/LayDM_NhanSu_HoatDong', method: 'GET', strNhanSu_HoSoCanBo_Id: qt ? '' : ns() }).then(function (r) {
            arr(r.data).forEach(function (x) { dsHoatDong.push(x); });
            var s = root.querySelector('[data-k="strHoatDongNhanSu_Id"]');
            if (s) pat.fill(s, dsHoatDong, { head: 'Chọn hoạt động' });
        }).catch(function (err) { ums.api.handle(err, 'danh mục hoạt động'); });
        return crud;
    }

    ums.ccbQtThongTin = { mount: mount };
    var goc = document.getElementById('qtthongtin');
    if (goc) mount(goc);
})();
