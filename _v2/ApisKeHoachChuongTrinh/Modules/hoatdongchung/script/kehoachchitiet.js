/* =========================================================================
   Kế hoạch chi tiết — Kế hoạch chương trình › Kế hoạch chung
   Bản gốc: ApisKeHoachChuongTrinh/Modules/hoatdongchung/html/kehoachchitiet.html + script/kehoachchitiet.js
            (lớp KeHoachXuLy — bản chép của kehoach.js, vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau         thanh lọc (Năm → Kế hoạch năm → Kế hoạch chi tiết, từ khoá) + "Danh sách kế hoạch" → "ds"
       #zoneEdit           Thêm mới / Sửa kế hoạch chi tiết                                             → "form"
       #zoneHocPhanDuKien  học phần dự kiến mở (chỉ xem)                                                → "dk"
       #zoneHocPhanDeXuat  học phần đề xuất từ các đơn vị (chỉ xem)                                     → "dx"
       #zoneDSNhanSu       nhân sự của kế hoạch                                                          → "ns"
   Tiện ích chung: _khc.js (ums.khctKh). Bộ lọc Năm → Kế hoạch năm → Kế hoạch chi tiết: ums.hd.keHoach —
   nạp CHÍNH tệp ApisCongCanBo/Modules/hoatdong/script/_kehoach.js (cùng ba lời gọi LayDSNam /
   LayDSKH_Nam_TongHop / LayDSKH_Nam_ChiTietTheo, cùng tên cột; khoá tầng dưới bằng ums.pat.chain, tự chọn khi một mục).

   Lời gọi (chép nguyên, func PKG_KEHOACH_HOATDONG_KEHOACH.* trừ khi ghi khác):
       KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNQPP  LayDSKH_Nam_ChiTiet
           strTuKhoa · strNam (ô Năm) · strKH_Nam_TongHop_Id · strKH_Nam_ChiTiet_Id (hai ô lọc)
       …/FSkkLB4KCR4PICweAikoFSgkNQPP  Them_KH_Nam_ChiTiet   (strId rỗng)
       …/EjQgHgoJHg8gLB4CKSgVKCQ1      Sua_KH_Nam_ChiTiet    (strId = ID)
           strPhanLoai_Id · strTen · strMa · strTuNgay · strDenNgay · strNam (ô Năm của THANH LỌC, như gốc)
           · dKhoaDuLieu · dHieuLuc · strCheDoApDung_Id · strKH_Nam_TongHop_Id (thêm: ô lọc; sửa: KH_NAM_TONGHOP_ID của dòng)
           · strDaoTao_ThoiGianDaoTao_Id
       …/GS4gHgoJHg8gLB4CKSgVKCQ1      Xoa_KH_Nam_ChiTiet    strId (mỗi dòng đã chọn một lời gọi)
       …/DSA4BRIKCR4PICweAikoFSgkNR4PKSAvEjQP  LayDSKH_Nam_ChiTiet_NhanSu  strKH_Nam_ChiTiet_Id
       …/FSkkLB4KCR4PICweAikoFSgkNR4PKSAvEjQP  Them_KH_Nam_ChiTiet_NhanSu  strKH_Nam_ChiTiet_Id · strNguoiDung_Id
       …/GS4gHgoJHg8gLB4CKSgVKCQ1Hg8pIC8SNAPP  Xoa_KH_Nam_ChiTiet_NhanSu   strId
       KHCT_HoatDong_Chung_MH/DSA4BRIVKS4oBiggLxUpJC4KJAkuICIp  PKG_KEHOACH_HOATDONG_CHUNG.LayDSThoiGianTheoKeHoach
           strKH_Nam_TongHop_Id → ô "Thời gian" (cột THOIGIAN)
       KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgU0CigkLwPP      PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien
       KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgUkGTQgNQPP      PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DeXuat
           strKH_Nam_ChiTiet_Id = ID dòng · pageIndex 1 · pageSize 1000000 · các tham số lọc còn lại RỖNG
           (gốc đọc ô 'txtAAAA' / 'dropAAAA' không tồn tại → luôn rỗng; giữ rỗng).
   Danh mục: KH.NAM.PHANLOAI (Phân loại) · KH.NAM.CHEDOAPDUNG (Chế độ).

   Cố ý bỏ (mã chết của gốc): hộp #modal_XacNhan + nút "Xác nhận" (display:none !important), vùng #zonebtnBaoCao_KH
   (không gọi getList_MauImport), ô #dropNam / bảng #tblThoiGian (không có trên màn — rewrite/viewEdit ghi vào khoảng không).
   Khác gốc:
       · Cột "Khóa dữ liệu": gốc đọc nhầm HIEULUC → đọc KHOADULIEU.
       · "Thêm mới" khi chưa chọn Kế hoạch năm ở thanh lọc thì báo (gốc mở biểu mẫu, ô Thời gian trống, lưu gửi
         strKH_Nam_TongHop_Id rỗng).
       · Lưu kế hoạch MỚI: nhớ ID máy chủ trả, đổi tiêu đề sang "Sửa" (gốc giữ strId rỗng → lưu lần hai THÊM TRÙNG).
       · Khung "Học phần đề xuất": ba nút Xóa / Thêm / Lưu của gốc mang id TRÙNG với vùng nhân sự / biểu mẫu nên
         jQuery chỉ gắn xử lý cho nút đầu tiên → ba nút này chưa từng làm gì. Giữ nút, đặt disabled.
       · Bảng "Học phần dự kiến" (chỉ xem, không nút) bỏ cột ô đánh dấu.
       · Xoá kế hoạch / nhân sự: ums.ui.xoaChon + ums.ui.batch, nạp lại một lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.khctKh, K = H.K, e = H.e;
    var root = document.getElementById('khct-kehoachchitiet');
    if (!root) return;
    var P = H.P, KH = H.KH;

    function inp(k, date) {
        return '<input class="ums-input" data-k="' + k + '" data-scope="form" autocomplete="off"' +
            (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>';
    }
    function sel(k, ph, opts, req) {
        return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph) + '"' + (req ? ' data-required' : '') + '>' +
            (opts || '<option value="">' + esc(ph) + '</option>') + '</select>';
    }
    function locSel(f, ph) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + f + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select></div>';
    }
    var HP = ['Thông tin học phần dự kiến'];
    function cotHP() {
        return [
            { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap', group: HP },
            { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', cls: 'khckh-ten', group: HP },
            { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', cls: 'is-center', group: HP },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', group: HP },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: HP },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: HP },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: HP },
            { title: 'Khối kiến thức', prop: 'KHOIKIENTHUC_TEN', group: HP },
            { title: 'Định hướng', prop: 'DINHHUONG_TEN', group: HP },
            { title: 'Thời gian trong chương trình', prop: 'THOIGIAN', cls: 'is-center', group: HP }
        ];
    }

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch chi tiết', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                locSel('nam', 'Chọn Năm') + locSel('khn', 'Chọn kế hoạch') + locSel('khct', 'Chọn kế hoạch chi tiết') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-kc]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden>' +
            pat.panel({
                title: 'Thêm mới - Kế hoạch', icon: 'fa-plus', cls: 'khckh-form',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="ums-legend">Thông tin kế hoạch</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Mã kế hoạch', inp('ma')) +
                        ui.field('Tên kế hoạch', inp('ten')) +
                        ui.field('Từ ngày', inp('tu', true)) +
                        ui.field('Đến ngày', inp('den', true)) +
                        ui.field('Thời gian', sel('tg', 'Chọn thời gian')) +
                        ui.field('Chế độ', sel('cd', 'Chọn chế độ')) +
                        ui.field('Phân loại', sel('pl', 'Chọn phân loại')) +
                        ui.field('Hiệu lực', sel('hl', 'Hiệu lực', '<option value="1">Có hiệu lực</option><option value="0">Hết hiệu lực</option>', true)) +
                        ui.field('Khóa dữ liệu', sel('kdl', 'Khóa dữ liệu', '<option value="0">Không khóa</option><option value="1">Khóa</option>', true)) +
                    '</div>'
            }) +
        '</div>' +
        '<div data-z="dk" hidden>' +
            pat.panel({ title: 'Học phần dự kiến mở', icon: 'fa-chalkboard-user', count: 'dkn', flush: true, zone: 'dkt',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) +
        '</div>' +
        '<div data-z="dx" hidden>' +
            pat.panel({ title: 'Học phần đề xuất từ các đơn vị', icon: 'fa-chalkboard-user', count: 'dxn', flush: true, zone: 'dxt',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('del', { text: 'Xóa', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } }) +
                    ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } }) +
                    ui.btn('save', { attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } }) }) +
        '</div>' +
        '<div data-z="ns" hidden></div>';

    function q(s) { return root.querySelector(s); }
    function k(x) { return root.querySelector('[data-k="' + x + '"]'); }
    function f(x) { return root.querySelector('[data-f="' + x + '"]'); }
    var zDs = q('[data-z="ds"]'), zForm = q('[data-z="form"]'), zDk = q('[data-z="dk"]'), zDx = q('[data-z="dx"]'), zNs = q('[data-z="ns"]');
    var dangMo = null, khId = '', khnId = '', tgId = '', rows = [];
    ui.enhance(root);
    K.ganChon(root);

    function mo(z) { dangMo = z; ui.swap(zDs, z); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    /* ---------- Danh mục ---------------------------------------------------- */
    ums.api.dm('KH.NAM.PHANLOAI')
        .then(function (ds) { pat.fill(k('pl'), ds, { name: 'TEN', head: 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });
    ums.api.dm('KH.NAM.CHEDOAPDUNG')
        .then(function (ds) { pat.fill(k('cd'), ds, { name: 'TEN', head: 'Chọn chế độ' }); })
        .catch(function (err) { ums.api.handle(err, 'chế độ'); });

    /** Ô "Thời gian" của biểu mẫu theo kế hoạch năm (getList_ThoiGian + default_val của gốc) */
    function napThoiGian(khn, chon) {
        if (!khn) { pat.fill(k('tg'), [], { head: 'Chọn thời gian' }); return Promise.resolve(); }
        return H.goi(H.CHUNG + 'DSA4BRIVKS4oBiggLxUpJC4KJAkuICIp', 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSThoiGianTheoKeHoach',
            { strKH_Nam_TongHop_Id: khn }).then(function (r) {
            pat.fill(k('tg'), K.ds(r), { name: 'THOIGIAN', head: 'Chọn thời gian' });
            H.datGiaTri(k('tg'), chon || '');
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    }

    /* ---------- Thanh lọc Năm → Kế hoạch năm → Kế hoạch chi tiết ------------ */
    ums.hd.keHoach({
        nam: f('nam'), khn: f('khn'), khct: f('khct'),
        doi: function () { load(); }
    });

    /* ---------- Danh sách kế hoạch chi tiết --------------------------------- */
    function load() {
        var host = q('[data-z="t"]');
        K.dang(host);
        H.goi(KH + 'DSA4BRIKCR4PICweAikoFSgkNQPP', P + 'LayDSKH_Nam_ChiTiet', {
            strTuKhoa: f('q').value.trim(), strNam: f('nam').value,
            strKH_Nam_TongHop_Id: f('khn').value, strKH_Nam_ChiTiet_Id: f('khct').value
        }).then(function (r) {
            rows = K.ds(r);
            q('[data-z="n"]').textContent = '(' + rows.length + ')';
            ui.table({
                el: host, rows: rows, empty: 'Chưa có kế hoạch chi tiết',
                columns: [
                    { title: 'Kế hoạch năm', prop: 'KH_NAM_TONGHOP_TEN', cls: 'khckh-ten' },
                    { title: 'Tên', prop: 'TEN', cls: 'khckh-ten' },
                    { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
                    { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
                    { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: H.hieuLuc },
                    { title: 'Khóa dữ liệu', cls: 'is-center is-nowrap', render: H.khoaDL },
                    { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                    { title: 'Thời gian kỳ, đợt mở', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                    { title: 'Học phần mở dự kiến', cls: 'is-center is-nowrap', render: function (x) { return H.nut('Chi tiết', 'dk', x.ID); } },
                    { title: 'Học phần đề xuất từ các đơn vị', cls: 'is-center is-nowrap', render: function (x) { return H.nut('Chi tiết', 'dx', x.ID); } },
                    { title: 'Nhân sự', cls: 'is-center is-nowrap', render: function (x) { return H.nut('Chi tiết', 'ns', x.ID); } },
                    { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-center is-nowrap' },
                    { title: 'Sửa', cls: 'is-center is-actions', render: function (x) { return H.suaBtn(x.ID); } },
                    K.cotChon('kc')
                ]
            });
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }
    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'kc');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) {
            return { action: KH + 'GS4gHgoJHg8gLB4CKSgVKCQ1', func: P + 'Xoa_KH_Nam_ChiTiet', strId: id, strNguoiThucHien_Id: '' };
        }), load);
    }

    /* ---------- Biểu mẫu ----------------------------------------------------- */
    function tieuDe(sua) {
        q('.khckh-form .ums-panel__title').innerHTML =
            '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Sửa' : 'Thêm mới') + ' - Kế hoạch';
    }
    function moThem() {
        if (!f('khn').value) { ui.toast('Vui lòng chọn kế hoạch năm ở thanh lọc trước khi thêm kế hoạch chi tiết', 'warn'); return; }
        khId = ''; khnId = f('khn').value; tgId = '';
        tieuDe(false);
        ['ma', 'ten', 'tu', 'den', 'pl', 'cd'].forEach(function (x) { H.datGiaTri(k(x), ''); });
        H.datGiaTri(k('hl'), '1'); H.datGiaTri(k('kdl'), '0');
        napThoiGian(khnId, '');
        mo(zForm);
    }
    function moSua(r) {
        khId = r.ID; khnId = e(r.KH_NAM_TONGHOP_ID); tgId = e(r.DAOTAO_THOIGIANDAOTAO_ID);
        tieuDe(true);
        H.datGiaTri(k('ma'), r.MA); H.datGiaTri(k('ten'), r.TEN);
        H.datGiaTri(k('tu'), r.TUNGAY); H.datGiaTri(k('den'), r.DENNGAY);
        H.datGiaTri(k('pl'), r.PHANLOAI_ID); H.datGiaTri(k('cd'), r.CHEDOAPDUNG_ID);
        H.datGiaTri(k('hl'), e(r.HIEULUC) === '' ? '1' : r.HIEULUC);
        H.datGiaTri(k('kdl'), e(r.KHOADULIEU) === '' ? '0' : r.KHOADULIEU);
        napThoiGian(khnId, tgId);
        mo(zForm);
    }
    function luu() {
        var them = !khId;
        var o = {
            strId: khId,
            strPhanLoai_Id: k('pl').value, strTen: k('ten').value.trim(), strMa: k('ma').value.trim(),
            strTuNgay: k('tu').value, strDenNgay: k('den').value, strNam: f('nam').value,
            dKhoaDuLieu: k('kdl').value, dHieuLuc: k('hl').value,
            strCheDoApDung_Id: k('cd').value, strKH_Nam_TongHop_Id: khnId, strDaoTao_ThoiGianDaoTao_Id: k('tg').value
        };
        var call = them ? [KH + 'FSkkLB4KCR4PICweAikoFSgkNQPP', P + 'Them_KH_Nam_ChiTiet']
                        : [KH + 'EjQgHgoJHg8gLB4CKSgVKCQ1', P + 'Sua_KH_Nam_ChiTiet'];
        H.goi(call[0], call[1], o).then(function (r) {
            ui.toast(them ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
            if (them) { khId = (r.raw && r.raw.Id) || ''; if (khId) tieuDe(true); }
        }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch'); });
    }

    /* ---------- Học phần dự kiến / đề xuất (chỉ xem) ------------------------ */
    function thamSoHP(id) {
        return { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '',
            strDaoTao_ChuongTrinh_Id: '', strDaoTao_KhoaQuanLy_Id: '', strKH_Nam_ChiTiet_Id: id, strKH_Nam_TongHop_Id: '',
            pageIndex: 1, pageSize: 1000000 };
    }
    function moDK(id) {
        var host = q('[data-z="dkt"]');
        mo(zDk);
        K.dang(host);
        H.goi(H.TT + 'DSA4BRIKCR4JLiIRKSAvHgU0CigkLwPP', 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien', thamSoHP(id)).then(function (r) {
            var ds = K.ds(r);
            q('[data-z="dkn"]').textContent = '(' + ds.length + ')';
            ui.table({ el: host, rows: ds, empty: 'Chưa có học phần dự kiến', columns: cotHP() });
        }).catch(function (err) { K.loi(host, err, 'học phần dự kiến'); });
    }
    function moDX(id) {
        var host = q('[data-z="dxt"]');
        var CB = ['Thông tin cán bộ đề xuất'];
        mo(zDx);
        K.dang(host);
        H.goi(H.TT + 'DSA4BRIKCR4JLiIRKSAvHgUkGTQgNQPP', 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DeXuat', thamSoHP(id)).then(function (r) {
            var ds = K.ds(r);
            q('[data-z="dxn"]').textContent = '(' + ds.length + ')';
            ui.table({ el: host, rows: ds, empty: 'Chưa có học phần đề xuất', columns: cotHP().concat([
                { title: 'Người đề xuất', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-nowrap', group: CB },
                { title: 'Đơn vị', prop: 'NGUOITAO_DONVI_TEN', group: CB },
                { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap', group: CB },
                K.cotChon('khdx')
            ]) });
        }).catch(function (err) { K.loi(host, err, 'học phần đề xuất'); });
    }

    /* ---------- Nhân sự ------------------------------------------------------ */
    var ns = H.taoNhanSu(zNs, {
        khoa: 'strKH_Nam_ChiTiet_Id',
        lay: [KH + 'DSA4BRIKCR4PICweAikoFSgkNR4PKSAvEjQP', P + 'LayDSKH_Nam_ChiTiet_NhanSu'],
        them: [KH + 'FSkkLB4KCR4PICweAikoFSgkNR4PKSAvEjQP', P + 'Them_KH_Nam_ChiTiet_NhanSu'],
        xoa: [KH + 'GS4gHgoJHg8gLB4CKSgVKCQ1Hg8pIC8SNAPP', P + 'Xoa_KH_Nam_ChiTiet_NhanSu'],
        onClose: dong
    });

    /* ---------- Sự kiện ----------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled || zNs.contains(b)) return;
        var id = b.getAttribute('data-id'), r = id ? K.tim(rows, id) : null;
        switch (b.getAttribute('data-a')) {
            case 'search': load(); break;
            case 'them': moThem(); break;
            case 'xoa': xoa(); break;
            case 'dong': dong(); break;
            case 'luu': luu(); break;
            case 'sua': if (r) moSua(r); else ui.toast('Vui lòng chọn đối tượng!', 'warn'); break;
            case 'dk': if (id) moDK(id); break;
            case 'dx': if (id) moDX(id); break;
            case 'ns': if (id) { ns.mo(id); mo(zNs); } break;
        }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(); } });

    load();
})();
