/* =========================================================================
   ums.khtsn.moDauRa(kh, dot, vung) — màn con "Kế hoạch đầu ra" (mở trong trang, thay chỗ vung; không truyền = T.S.root)
   Bản gốc: modal #ke-hoach-dau-ra (danh sách) + #them-moi-dau-ra (thêm theo chương trình)
            + #xem-sua-dau-ra (xem - sửa một đầu ra)
   ---------------------------------------------------------------------------
   Lời gọi (TS_Core_KeHoach_MH / PKG_CORE_TS_KEHOACH):
     Pr_Ts_Kh_Dau_Ra_Get_Ds     strTuKhoa '', strTs_Kh_TuyenSinh_Id, strTs_Kh_TuyenSinh_Dot_Id (đợt hoặc ''),
                                strTs_Kh_Dot_PhuongThuc_Id '', strOutput_Status_Code '', dIs_Public '', dIs_Active ''
     Pr_Ts_Kh_Dau_Ra_Get_By_Id / _Ins / _Upd / _Del (tham số chép nguyên)
     KHCT_HeDaoTao/LayDanhSach, KHCT_KhoaDaoTao/LayDanhSach, KHCT_ToChucChuongTrinh/LayDanhSach (GET)
     Danh mục TS.KEHOACH.DAURA.LOAI / .KIEUHOC / .TRANGTHAI (giá trị = MA), TUYENSINH.NGANHNGHE (mã ngành)
   Như gốc: mở từ bảng KẾ HOẠCH chỉ xem + sửa; mở từ bảng ĐỢT mới có "Thêm mới" (đầu ra thêm theo đợt).
   Thêm mới: biểu mẫu thay chỗ danh sách đầu ra — Hệ → Khoá (khoá tới khi chọn Hệ) → bảng chương trình,
   tick chương trình nào thì MỖI chương trình MỘT lời gọi _Ins (thông tin khai chung áp cho tất cả).
   Ô chỉ tiêu trong bảng: ↑↓←→ / Enter nhảy ô như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, K = ums.khts, T = ums.khtsn;
    var e = T.e;

    /* ---------- Tra mã chương trình / mã ngành (dùng chung với hộp "Đổi nguyện vọng đầu vào") ---------- */
    T.ctMa = {};
    T.ensureCTMa = function (rows) {
        var pairs = {};
        (rows || []).forEach(function (r) {
            var ct = e(r.DAOTAO_TOCHUCCHUONGTRINH_ID);
            if (!ct || Object.prototype.hasOwnProperty.call(T.ctMa, ct)) return;
            pairs[e(r.DAOTAO_HEDAOTAO_ID) + '|' + e(r.DAOTAO_KHOADAOTAO_ID)] = { he: e(r.DAOTAO_HEDAOTAO_ID), khoa: e(r.DAOTAO_KHOADAOTAO_ID) };
        });
        return Promise.all(Object.keys(pairs).map(function (k) {
            var p = pairs[k];
            return ums.api.call({ action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: p.khoa, strDaoTao_HeDaoTao_Id: p.he, strDaoTao_N_CN_Id: '',
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) { T.rows(r).forEach(function (c) { if (c.ID) T.ctMa[c.ID] = c.MACHUONGTRINH || ''; }); }, function () {});
        }));
    };
    var nganh = null;
    T.ensureNganhMa = function () {
        if (nganh) return Promise.resolve(nganh);
        return T.dm(T.DM.NGANHNGHE).then(function (rows) {
            nganh = { id: {}, ten: {} };
            rows.forEach(function (r) {
                if (r.ID) nganh.id[r.ID] = r.MA || '';
                if (r.TEN) nganh.ten[String(r.TEN).trim().toLowerCase()] = r.MA || '';
            });
            return nganh;
        });
    };
    T.maNganh = function (id, ten) {
        if (!nganh) return '';
        return nganh.id[id] || (ten ? nganh.ten[String(ten).trim().toLowerCase()] : '') || '';
    };

    function ck(key, label, col, mac) {
        return { key: key, label: label, on: 1, off: 0, value: mac ? 1 : undefined,
                 get: function (d) { return (d[col] || d[col.toLowerCase()]) == 1 ? 1 : 0; } }; // eslint-disable-line eqeqeq
    }

    T.moDauRa = function (kh, dot, vung) {
        var khId = T.id(kh), dotId = dot ? T.id(dot) : '';
        var dsLoai = [], dsKieu = [];
        var nguonLoai = { dm: T.DM.LOAI_DAURA, id: 'MA', name: 'TEN' };
        var nguonKieu = { dm: T.DM.KIEUHOC, id: 'MA', name: 'TEN' };
        var nguonTT = { dm: T.DM.TT_DAURA, id: 'MA', name: 'TEN' };
        /* Màn con NGAY TRONG TRANG (BO-CUC luật 1; trước 30/9 là hộp thoại lớn): mở từ bảng kế hoạch thì thay chỗ màn (T.S.root),
           mở từ bảng đợt thì thay chỗ thân màn con "Các đợt tuyển sinh" (vung — tầng hai). */
        var ft = T.moTrang({
            host: vung,
            title: 'Kế hoạch đầu ra' + (dot ? ' — đợt ' + T.tenMa(dot.TEN || dot.Ten || '', dot.MA || dot.Ma || '') : (T.tenKH(kh) ? ' — ' + T.tenKH(kh) : '')),
            icon: 'fa-list-check', cols: 1,
            body: '<div data-dr="ds"></div><div data-dr="them" hidden></div>'
        });
        var vDs = ft.body.querySelector('[data-dr="ds"]'), vThem = ft.body.querySelector('[data-dr="them"]');

        var crud = ums.crud({
            root: vDs,
            embedded: true,
            title: 'Kế hoạch đầu ra',
            icon: 'fa-list-check',
            formTitle: 'kế hoạch đầu ra',
            empty: 'Không có dữ liệu',
            canAdd: false,
            toolbar: dotId ? [{ text: 'Thêm mới', icon: 'fa-plus', mod: 'add', onClick: function () { moThem(); } }] : [],
            list: {
                call: function () {
                    return T.goi(T.TS + 'ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP', T.PTS + 'Pr_Ts_Kh_Dau_Ra_Get_Ds', {
                        strTuKhoa: '', strTs_Kh_TuyenSinh_Id: khId, strTs_Kh_TuyenSinh_Dot_Id: dotId || '',
                        strTs_Kh_Dot_PhuongThuc_Id: '', strOutput_Status_Code: '', dIs_Public: '', dIs_Active: ''
                    });
                }
            },
            onLoad: function (rows, c) {
                Promise.all([T.ensureCTMa(rows), T.ensureNganhMa()]).then(function () { c.draw(); });
            },
            columns: [
                { title: 'Mã', cls: 'is-nowrap', render: function (d) { return ui.esc(d.MA || d.Ma || ''); } },
                { title: 'Tên', render: function (d) { return T.rong(d.TEN || d.Ten || ''); } },
                { title: 'Loại đầu ra', render: function (d) { return ui.esc(d.DAU_RA_TYPE_CODE_Name || d.DAU_RA_TYPE_CODE_Ten || T.tenTheoMa(dsLoai, d.DAU_RA_TYPE_CODE)); } },
                { title: 'Kiểu học tập', render: function (d) { return ui.esc(d.STUDY_TYPE_CODE_Name || d.STUDY_TYPE_CODE_Ten || T.tenTheoMa(dsKieu, d.STUDY_TYPE_CODE)); } },
                { title: 'Hệ mở', render: function (d) { return ui.esc(d.DAOTAO_HEDAOTAO_Ten || d.DAOTAO_HEDAOTAO_TEN || ''); } },
                { title: 'Khóa mở', render: function (d) { return ui.esc(d.DAOTAO_KHOADAOTAO_Ten || d.DAOTAO_KHOADAOTAO_TEN || ''); } },
                { title: 'Chương trình mở', render: function (d) {
                    return T.rong(T.tenMa(d.DAOTAO_TOCHUCCHUONGTRINH_Ten || d.DAOTAO_TOCHUCCHUONGTRINH_TEN || '', T.ctMa[d.DAOTAO_TOCHUCCHUONGTRINH_ID] || '')); } },
                { title: 'Ngành tuyển sinh', render: function (d) {
                    var t = d.DAOTAO_NGANH_TS_Ten || d.DAOTAO_NGANH_TS_TEN || ''; return T.rong(T.tenMa(t, T.maNganh(d.DAOTAO_NGANH_TS_ID, t))); } },
                { title: 'Ngành đào tạo', render: function (d) {
                    var t = d.DAOTAO_NGANH_DT_Ten || d.DAOTAO_NGANH_DT_TEN || ''; return T.rong(T.tenMa(t, T.maNganh(d.DAOTAO_NGANH_DT_ID, t))); } },
                { title: 'Tên hiển thị', prop: 'TEN_HIENTHI' },
                { title: 'Mã hiển thị', prop: 'MA_HIENTHI' },
                { title: 'Là ngành nổi bật cần hiện lên đầu', cls: 'is-center', render: function (d) { return K.co(d.IS_HIGHLIGHT, 'bad'); } },
                { title: 'Thứ tự hiển thị', cls: 'is-center', prop: 'THU_TU_HIENTHI' },
                { title: 'Chỉ tiêu', cls: 'is-center', prop: 'CHI_TIEU' },
                { title: 'Chỉ tiêu tối đa', cls: 'is-center', prop: 'CHI_TIEU_TOI_DA' },
                { title: 'Chỉ tiêu tối thiểu', cls: 'is-center', prop: 'CHI_TIEU_TOI_THIEU' },
                { title: 'Hiệu lực', cls: 'is-center', render: function (d) { return K.co(d.is_active || d.IS_ACTIVE, 'bad'); } },
                { title: 'Người tạo', cls: 'is-nowrap', render: function (d) { return ui.esc(d.NGUOITAO_TaiKhoan || d.NGUOITAO_TEN || d.NGUOI_TAO || d.NguoiTao || ''); } },
                { title: 'Ngày tạo', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(d.NgayTao_dd_mm_yyyy_hhmmss || d.NGAY_TAO || d.NgayTao || ''); } }
            ],
            detail: function (row) {
                return T.goi(T.TS + 'ETMeFTIeCikeBSA0HhMgHgYkNR4DOB4IJQPP', T.PTS + 'Pr_Ts_Kh_Dau_Ra_Get_By_Id', { strId: row.ID });
            },
            fields: [
                { key: '_he', label: 'Hệ', type: 'static', get: function (d) { return d.DAOTAO_HEDAOTAO_Ten || d.DAOTAO_HEDAOTAO_TEN || ''; } },
                { key: '_khoa', label: 'Khóa', type: 'static', get: function (d) { return d.DAOTAO_KHOADAOTAO_Ten || d.DAOTAO_KHOADAOTAO_TEN || ''; } },
                { key: '_ct', label: 'Chương trình', type: 'static', caDong: true, get: function (d) { return d.DAOTAO_TOCHUCCHUONGTRINH_Ten || d.DAOTAO_TOCHUCCHUONGTRINH_TEN || ''; } },
                { type: 'legend', label: 'Chỉ tiêu' },
                { key: 'dChi_Tieu', label: 'Chỉ tiêu', type: 'number', col: 'CHI_TIEU' },
                { key: 'dChi_Tieu_Toi_Da', label: 'Chỉ tiêu tối đa', type: 'number', col: 'CHI_TIEU_TOI_DA' },
                { key: 'dChi_Tieu_Toi_Thieu', label: 'Chỉ tiêu tối thiểu', type: 'number', col: 'CHI_TIEU_TOI_THIEU' },
                { type: 'legend', label: 'Thông tin đầu ra' },
                { key: 'strMa', label: 'Mã', get: function (d) { return d.Ma || d.MA || ''; } },
                { key: 'strTen', label: 'Tên', get: function (d) { return d.Ten || d.TEN || ''; } },
                { key: 'strMa_HienThi', label: 'Mã hiển thị', col: 'MA_HIENTHI' },
                { key: 'strTen_HienThi', label: 'Tên hiển thị', col: 'TEN_HIENTHI' },
                { key: 'strDau_Ra_Type_Code', label: 'Loại đầu ra tuyển', type: 'select', placeholder: 'Chọn loại đầu ra', source: nguonLoai, col: 'DAU_RA_TYPE_CODE' },
                { key: 'strStudy_Type_Code', label: 'Kiểu học sau khi vào', type: 'select', placeholder: 'Chọn kiểu học', source: nguonKieu, col: 'STUDY_TYPE_CODE' },
                { key: 'dThu_Tu_HienThi', label: 'Thứ tự hiển thị', type: 'number', col: 'THU_TU_HIENTHI' },
                { type: 'checks', span: true, items: [ck('dIs_HighLight', 'Là ngành nổi bật cần hiện lên đầu', 'IS_HIGHLIGHT')] },
                { type: 'checks', label: 'Cấu hình', span: true, items: [
                    ck('dIs_Allow_Register', 'Cho phép đăng ký trực tuyến', 'IS_ALLOW_REGISTER'),
                    ck('dIs_Allow_Waitlist', 'Cho phép đăng ký nếu hết chỉ tiêu (Đưa vào danh sách chờ)', 'IS_ALLOW_WAITLIST'),
                    ck('dIs_Allow_Transfer_In', 'Cho phép tiếp nhận trường hợp chuyển trường không', 'IS_ALLOW_TRANSFER_IN'),
                    ck('dIs_Auto_Intake', 'Có tự động tạo dữ liệu chuẩn bị nhập học khi đủ điều kiện tiếp nhận không', 'IS_AUTO_INTAKE'),
                    ck('dIs_Auto_Enrollment', 'Có tự động tạo hồ sơ học tập không', 'IS_AUTO_ENROLLMENT'),
                    ck('dIs_Auto_Class_Assign', 'Có tự động phân lớp không', 'IS_AUTO_CLASS_ASSIGN')
                ] },
                { key: 'strOutput_Status_Code', label: 'Trạng thái của đầu ra', type: 'select', placeholder: 'Chọn trạng thái', source: nguonTT, col: 'OUTPUT_STATUS_CODE' },
                { type: 'checks', span: true, items: [
                    ck('dIs_Public', 'Có cho phép public qua cổng Portal không', 'IS_PUBLIC'),
                    ck('dIs_Active', 'Hiệu lực', 'IS_ACTIVE', true)
                ] },
                { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, col: 'GHICHU' }
            ],
            save: function (v, c) {
                c = c || {};
                return T.goi(T.TS + 'ETMeFTIeCikeBSA0HhMgHhQxJQPP', T.PTS + 'Pr_Ts_Kh_Dau_Ra_Upd', {
                    strId: c.ID, strTs_Kh_TuyenSinh_Id: khId,
                    strTs_Kh_TuyenSinh_Dot_Id: c.TS_KH_TUYENSINH_DOT_ID || '', strTs_Kh_Dot_PhuongThuc_Id: c.TS_KH_DOT_PHUONGTHUC_ID || '',
                    strMa: v.strMa, strTen: v.strTen, strDau_Ra_Type_Code: v.strDau_Ra_Type_Code, strStudy_Type_Code: v.strStudy_Type_Code,
                    strDaotao_HeDaoTao_Id: c.DAOTAO_HEDAOTAO_ID || '', strDaotao_KhoaDaoTao_Id: c.DAOTAO_KHOADAOTAO_ID || '',
                    strDaotao_ChuongTrinh_Id: c.DAOTAO_TOCHUCCHUONGTRINH_ID || c.DAOTAO_CHUONGTRINH_ID || '',
                    strDaotao_Nganh_Dt_Id: c.DAOTAO_NGANH_DT_ID || '', strDaotao_Nganh_Ts_Id: c.DAOTAO_NGANH_TS_ID || '',
                    strTen_HienThi: v.strTen_HienThi, strMa_HienThi: v.strMa_HienThi, strMoTa_HienThi: c.MOTA_HIENTHI || '',
                    dThu_Tu_HienThi: v.dThu_Tu_HienThi, dIs_HighLight: v.dIs_HighLight,
                    dChi_Tieu: v.dChi_Tieu, dChi_Tieu_Toi_Da: v.dChi_Tieu_Toi_Da, dChi_Tieu_Toi_Thieu: v.dChi_Tieu_Toi_Thieu,
                    dIs_Allow_Register: v.dIs_Allow_Register, dIs_Allow_Waitlist: v.dIs_Allow_Waitlist, dIs_Allow_Transfer_In: v.dIs_Allow_Transfer_In,
                    dIs_Auto_Intake: v.dIs_Auto_Intake, dIs_Auto_Enrollment: v.dIs_Auto_Enrollment, dIs_Auto_Class_Assign: v.dIs_Auto_Class_Assign,
                    strOutput_Status_Code: v.strOutput_Status_Code, dIs_Public: v.dIs_Public, dIs_Active: v.dIs_Active, strGhiChu: v.strGhiChu
                }, 'SUA');
            },
            remove: function (ids) {
                return T.goi(T.TS + 'ETMeFTIeCikeBSA0HhMgHgUkLQPP', T.PTS + 'Pr_Ts_Kh_Dau_Ra_Del', { strId: ids[0] }, 'XOA');
            },
            rowDelete: false,
            multi: false,
            removeConfirm: function () { return 'Bạn có chắc chắn xóa đầu ra này không?'; }
        });
        Promise.all([ums.crud.loadSource(nguonLoai), ums.crud.loadSource(nguonKieu)]).then(function (x) {
            dsLoai = x[0] || []; dsKieu = x[1] || [];
            if (crud.rows.length) crud.draw();
        }).catch(function () {});

        /* ---------- Thêm mới theo chương trình (#them-moi-dau-ra) ---------- */
        var dsCT = [];
        function moThem() {
            var chk = function (k, t, on) { return '<label class="ums-check"><input type="checkbox" data-n="' + k + '"' + (on ? ' checked' : '') + '> ' + ui.esc(t) + '</label>'; };
            vThem.innerHTML = ums.pat.panel({
                title: 'Thêm mới kế hoạch đầu ra', icon: 'fa-plus',
                tools: ui.btn('close', { attr: { 'data-n': 'dong' } }) + ui.btn('save', { attr: { 'data-n': 'luu' } }),
                body:
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Hệ đào tạo', '<select class="ums-select" data-n="he" data-ph="Chọn hệ đào tạo"><option value=""></option></select>') +
                        ui.field('Khóa đào tạo', '<select class="ums-select" data-n="khoa" data-ph="Chọn khóa đào tạo"><option value=""></option></select>') +
                    '</div>' +
                    '<div class="khtsn-dr ums-u-mt-4">' +
                        '<div><div class="ums-legend">Các thông tin khai chung</div><div class="ums-grid">' +
                            ui.field('Loại đầu ra tuyển sinh', '<select class="ums-select" data-n="loai" data-ph="Chọn loại đầu ra"><option value=""></option></select>') +
                            ui.field('Kiểu học sau khi vào học', '<select class="ums-select" data-n="kieu" data-ph="Chọn kiểu học"><option value=""></option></select>') +
                            '<div class="ums-checklist">' +
                                chk('dIs_HighLight', 'Là ngành nổi bật cần hiện lên đầu') +
                                chk('dIs_Allow_Register', 'Cho phép đăng ký trực tuyến') +
                                chk('dIs_Allow_Waitlist', 'Cho phép đăng ký nếu hết chỉ tiêu (Đưa vào danh sách chờ)') +
                                chk('dIs_Allow_Transfer_In', 'Cho phép tiếp nhận trường hợp chuyển trường không') +
                                chk('dIs_Auto_Intake', 'Có tự động tạo dữ liệu chuẩn bị nhập học khi đủ điều kiện tiếp nhận không') +
                                chk('dIs_Auto_Enrollment', 'Có tự động tạo hồ sơ học tập không') +
                                chk('dIs_Auto_Class_Assign', 'Có tự động phân lớp không') +
                            '</div>' +
                            ui.field('Trạng thái của đầu ra', '<select class="ums-select" data-n="tt" data-ph="Chọn trạng thái"><option value=""></option></select>') +
                            '<div class="ums-checklist">' + chk('dIs_Public', 'Có cho phép public qua cổng Portal không') + chk('dIs_Active', 'Hiệu lực', true) + '</div>' +
                        '</div></div>' +
                        '<div><div class="ums-legend">Các đầu ra cần chọn</div><div data-n="bang"></div></div>' +
                    '</div>'
            });
            var q = function (k) { return vThem.querySelector('[data-n="' + k + '"]'); };
            ui.swap(vDs, vThem);
            ui.enhance(vThem);
            dsCT = []; veCT();
            Promise.all([ums.crud.loadSource(nguonLoai), ums.crud.loadSource(nguonKieu), ums.crud.loadSource(nguonTT)]).then(function (x) {
                ums.pat.fill(q('loai'), x[0], { id: 'MA' }); ums.pat.fill(q('kieu'), x[1], { id: 'MA' }); ums.pat.fill(q('tt'), x[2], { id: 'MA' });
            });
            ums.api.call({ action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '',
                strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 })
                .then(function (r) { ums.pat.fill(q('he'), T.rows(r), { name: 'TENHEDAOTAO' }); })
                .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
            jQuery(q('he')).on('select2:select', function () {
                dsCT = []; veCT();
                ums.pat.fill(q('khoa'), []);
                if (!q('he').value) return;
                ums.api.call({ action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HeDaoTao_Id: q('he').value,
                    strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000 })
                    .then(function (r) { ums.pat.fill(q('khoa'), T.rows(r), { name: 'TENKHOA' }); })
                    .catch(function (err) { ums.api.handle(err, 'khoá đào tạo'); });
            });
            jQuery(q('khoa')).on('select2:select select2:clear', function () {
                dsCT = []; veCT();
                if (!q('khoa').value) return;
                ums.api.call({ action: 'KHCT_ToChucChuongTrinh/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_KhoaDaoTao_Id: q('khoa').value,
                    strDaoTao_HeDaoTao_Id: q('he').value, strDaoTao_N_CN_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ToChucCT_Cha_Id: '',
                    strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                    .then(function (r) { dsCT = T.rows(r).map(function (c) { return { c: c, ct: '', max: '', min: '', chon: false }; }); veCT(); })
                    .catch(function (err) { ums.api.handle(err, 'KHCT_ToChucChuongTrinh/LayDanhSach'); });
            });
            ums.pat.chain([q('he'), q('khoa')]);
        }
        function veCT() {
            var host = vThem.querySelector('[data-n="bang"]');
            if (!host) return;
            var o = function (k, i, v) { return '<input class="ums-input khtsn-so" type="number" min="0" data-ct="' + k + '" data-i="' + i + '" value="' + ui.esc(v) + '">'; };
            ui.table({
                el: host, rows: dsCT,
                empty: vThem.querySelector('[data-n="khoa"]') && vThem.querySelector('[data-n="khoa"]').value ? 'Không có chương trình' : 'Chọn Hệ đào tạo và Khóa đào tạo để hiện chương trình',
                columns: [
                    { title: 'Mã chương trình', cls: 'is-nowrap', render: function (x) { return ui.esc(x.c.MACHUONGTRINH || ''); } },
                    { title: 'Tên chương trình', render: function (x) { return T.rong(x.c.TENCHUONGTRINH || ''); } },
                    { title: 'Ngành TS', render: function (x) { return ui.esc(x.c.NGANHTUYENSINH_TEN || ''); } },
                    { title: 'Ngành ĐT', render: function (x) { return ui.esc(x.c.DAOTAO_N_CN_TEN || ''); } },
                    { title: 'Chỉ tiêu', cls: 'is-center', width: '100px', render: function (x, i) { return o('ct', i, x.ct); } },
                    { title: 'Chỉ tiêu tối đa', cls: 'is-center', width: '110px', render: function (x, i) { return o('max', i, x.max); } },
                    { title: 'Chỉ tiêu tối thiểu', cls: 'is-center', width: '110px', render: function (x, i) { return o('min', i, x.min); } },
                    { head: '<input type="checkbox" data-ct="tatca" title="Chọn tất cả">', cls: 'is-center', width: '50px',
                      render: function (x, i) { return '<input type="checkbox" data-ct="chon" data-i="' + i + '"' + (x.chon ? ' checked' : '') + '>'; } }
                ]
            });
        }
        vThem.addEventListener('input', doiCT); vThem.addEventListener('change', doiCT);
        function doiCT(ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-ct');
            if (!k) return;
            if (k === 'tatca') { dsCT.forEach(function (x) { x.chon = t.checked; }); veCT(); return; }
            var x = dsCT[Number(t.getAttribute('data-i'))];
            if (!x) return;
            if (k === 'chon') x.chon = t.checked; else x[k] = t.value;
        }
        /* ↑↓←→ / Enter trong ba cột chỉ tiêu — lưới kiểu Excel như gốc */
        vThem.addEventListener('keydown', function (ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-ct');
            var cols = ['ct', 'max', 'min'], c = cols.indexOf(k);
            if (c < 0 || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].indexOf(ev.key) < 0) return;
            var r = Number(t.getAttribute('data-i'));
            if (ev.key === 'ArrowUp') r--; else if (ev.key === 'ArrowDown' || ev.key === 'Enter') r++;
            else if (ev.key === 'ArrowLeft') { c--; if (c < 0) { c = 2; r--; } } else { c++; if (c > 2) { c = 0; r++; } }
            if (r < 0 || r >= dsCT.length) return;
            ev.preventDefault();
            var n = vThem.querySelector('[data-ct="' + cols[c] + '"][data-i="' + r + '"]');
            if (n) { n.focus(); n.select(); }
        });
        vThem.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-n]');
            if (!b) return;
            if (b.getAttribute('data-n') === 'dong') ui.swap(vThem, vDs);
            else if (b.getAttribute('data-n') === 'luu') luuThem();
        });
        function luuThem() {
            if (!khId) { ui.toast('Vui lòng chọn kế hoạch tuyển sinh trước', 'warn'); return; }
            var chon = dsCT.filter(function (x) { return x.chon; });
            if (!chon.length) { ui.toast('Vui lòng tích chọn ít nhất 1 chương trình để tạo đầu ra', 'warn'); return; }
            var q = function (k) { return vThem.querySelector('[data-n="' + k + '"]'); };
            var cb = function (k) { return q(k).checked ? 1 : 0; };
            ui.batch(chon.map(function (x) {
                return T.goi(T.TS + 'ETMeFTIeCikeBSA0HhMgHggvMgPP', T.PTS + 'Pr_Ts_Kh_Dau_Ra_Ins', {
                    strTs_Kh_TuyenSinh_Id: khId, strTs_Kh_TuyenSinh_Dot_Id: dotId || '', strTs_Kh_Dot_PhuongThuc_Id: '',
                    // Mã / Tên lấy từ chương trình — BE không tự lấy (gốc: ctMap)
                    strMa: x.c.MACHUONGTRINH || '', strTen: x.c.TENCHUONGTRINH || '',
                    strDau_Ra_Type_Code: q('loai').value, strStudy_Type_Code: q('kieu').value,
                    strDaotao_HeDaoTao_Id: '', strDaotao_KhoaDaoTao_Id: '', strDaotao_ChuongTrinh_Id: x.c.ID || '',
                    strDaotao_Nganh_Dt_Id: '', strDaotao_Nganh_Ts_Id: '', strTen_HienThi: '', strMa_HienThi: '', strMoTa_HienThi: '',
                    dThu_Tu_HienThi: '', dIs_HighLight: cb('dIs_HighLight'),
                    dChi_Tieu: x.ct || '', dChi_Tieu_Toi_Da: x.max || '', dChi_Tieu_Toi_Thieu: x.min || '',
                    dIs_Allow_Register: cb('dIs_Allow_Register'), dIs_Allow_Waitlist: cb('dIs_Allow_Waitlist'),
                    dIs_Allow_Transfer_In: cb('dIs_Allow_Transfer_In'), dIs_Auto_Intake: cb('dIs_Auto_Intake'),
                    dIs_Auto_Enrollment: cb('dIs_Auto_Enrollment'), dIs_Auto_Class_Assign: cb('dIs_Auto_Class_Assign'),
                    strOutput_Status_Code: q('tt').value, dIs_Public: cb('dIs_Public'), dIs_Active: cb('dIs_Active'), strGhiChu: ''
                }, 'THEM');
            }), { title: 'Đang thêm kế hoạch đầu ra', okText: 'Đã thêm kế hoạch đầu ra', show: true }).then(function () {
                ui.swap(vThem, vDs);
                crud.load();
            });
        }
        return { form: ft, crud: crud };
    };
})();
