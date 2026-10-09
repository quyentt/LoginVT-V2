/* =========================================================================
   Kế hoạch (kế hoạch NĂM tổng hợp) — Kế hoạch chương trình › Kế hoạch chung
   Bản gốc: ApisKeHoachChuongTrinh/Modules/hoatdongchung/html/kehoach.html + script/kehoach.js
            (lớp KeHoachXuLy, vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau         thanh lọc (Năm, từ khoá, Tìm kiếm) + "Danh sách kế hoạch"   → "ds"
       #zoneEdit           Thêm mới / Sửa kế hoạch + bảng "Thời gian" (Thêm dòng mới)    → "form"
       #zoneKeHoachChiTiet danh sách kế hoạch chi tiết của kế hoạch (nút "Chi tiết")     → "kc"
       #zoneDSNhanSu       nhân sự của kế hoạch (nút "Chi tiết" cột Nhân sự)              → "ns"
   Tiện ích chung: _khc.js (ums.khctKh) trên ums.khxl (nạp chéo XLHV kehoachxuly/_khxl_chung.js).

   Lời gọi (chép nguyên, mọi lời gọi mã hoá kèm func PKG_KEHOACH_HOATDONG_KEHOACH.* trừ khi ghi khác):
       KHCT_HoatDong_Chung_MH/DSA4BRIPICwP   PKG_KEHOACH_HOATDONG_CHUNG.LayDSNam  → ô Năm (lọc + biểu mẫu), cột NAM, giá trị ID
       …/DSA4BRIKCR4PICweFS4vJgkuMQPP  LayDSKH_Nam_TongHop     strNam = ô Năm (ID)
       …/FSkkLB4KCR4PICweFS4vJgkuMQPP  Them_KH_Nam_TongHop     (strId rỗng)
       …/EjQgHgoJHg8gLB4VLi8mCS4x      Sua_KH_Nam_TongHop      (strId = ID)
           strPhanLoai_Id · strTen · strMa · strTuNgay · strDenNgay · strNam (ô Năm của biểu mẫu) · dKhoaDuLieu · dHieuLuc
       …/GS4gHgoJHg8gLB4VLi8mCS4x      Xoa_KH_Nam_TongHop      strId (mỗi kế hoạch đã chọn một lời gọi)
       …/DSA4BRIKCR4PICweFSkuKAYoIC8P  LayDSKH_Nam_ThoiGian    strKH_Nam_TongHop_Id
       …/FSkkLB4KCR4PICweFSkuKAYoIC8P  Them_KH_Nam_ThoiGian    strId '' · strKH_Nam_TongHop_Id · strDaoTao_ThoiGianDaoTao_Id
       …/GS4gHgoJHg8gLB4VKS4oBiggLwPP  Xoa_KH_Nam_ThoiGian     strId = ID dòng
       …/DSA4BRIKCR4PICweAikoFSgkNRUpJC4P  LayDSKH_Nam_ChiTietTheo  strKH_Nam_TongHop_Id
       …/DSA4BRIKCR4PICweDykgLxI0      LayDSKH_Nam_NhanSu      strKH_Nam_TongHop_Id
       …/FSkkLB4KCR4PICweDykgLxI0      Them_KH_Nam_NhanSu      strKH_Nam_TongHop_Id · strNguoiDung_Id
       …/GS4gHgoJHg8gLB4PKSAvEjQP      Xoa_KH_Nam_NhanSu       strId = ID dòng
       KHCT_ThoiGianDaoTao/LayDanhSach GET  strDAOTAO_Nam_Id '' · strTuKhoa '' · pageIndex 1 · pageSize 1000000
                                             → ô "Thời gian" từng dòng (DAOTAO_THOIGIANDAOTAO)
   Danh mục: KH.NAM.PHANLOAI (ô Phân loại).

   Cố ý bỏ (mã chết của gốc): hộp #modal_XacNhan + nút "Xác nhận" (display:none !important, không mã nào mở),
   bốn hộp #modal_nhansu / sinhvien / hocphan / lophoc (trống), vùng #zonebtnBaoCao_KH (không gọi getList_MauImport),
   genCombo_ThoiGianDaoTao (đổ vào #dropThanhPhanDiem không có trên màn), các mảng arrSinhVien… không dùng.
   Khác gốc:
       · Ô "Nhập từ khóa tìm kiếm": gốc KHÔNG gửi đi (LayDSKH_Nam_TongHop chỉ nhận strNam) → lọc tại chỗ theo Năm/Tên/Mã/Phân loại.
       · Cột "Khóa dữ liệu": gốc đọc nhầm HIEULUC → đọc KHOADULIEU.
       · Cột "Thời gian kỳ, đợt mở": gốc vẽ nút Sửa (lệch cột) — giữ nút mở biểu mẫu (bảng Thời gian nằm ở đó).
       · Lưu kế hoạch MỚI: gốc không nhớ ID máy chủ trả → bấm Lưu lần hai là THÊM TRÙNG; ở đây nhớ ID, đổi tiêu đề
         sang "Sửa" và nạp lại bảng Thời gian (dòng mới thành dòng đã lưu — gốc để nguyên nên lưu lại là thêm trùng).
       · Dòng Thời gian ĐÃ LƯU khoá ô chọn: gốc chỉ lưu dòng mới (không có Sua_KH_Nam_ThoiGian), đổi ô dòng cũ không có tác dụng.
       · Xoá kế hoạch / nhân sự: ums.ui.xoaChon + ums.ui.batch, nạp lại một lần.
       · Bảng kế hoạch chi tiết (chỉ xem): bỏ cột ô đánh dấu (gốc không có nút nào dùng); cột không tiêu đề là "Ngày tạo".
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, H = ums.khctKh, K = H.K, e = H.e;
    var root = document.getElementById('khct-kehoach');
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

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="nam" data-ph="Chọn Năm"><option value="">Chọn Năm</option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-kh]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden>' +
            pat.panel({
                title: 'Thêm mới - Kế hoạch', icon: 'fa-plus', cls: 'khckh-form',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="ums-legend">Thông tin kế hoạch</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Năm', sel('nam', 'Chọn Năm')) + '<div></div>' +
                        ui.field('Mã kế hoạch', inp('ma')) +
                        ui.field('Tên kế hoạch', inp('ten')) +
                        ui.field('Từ ngày', inp('tu', true)) +
                        ui.field('Đến ngày', inp('den', true)) +
                        ui.field('Phân loại', sel('pl', 'Chọn phân loại')) +
                        ui.field('Hiệu lực', sel('hl', 'Hiệu lực', '<option value="1">Có hiệu lực</option><option value="0">Hết hiệu lực</option>', true)) +
                        ui.field('Khóa dữ liệu', sel('kdl', 'Khóa dữ liệu', '<option value="0">Không khóa</option><option value="1">Khóa</option>', true)) +
                    '</div>'
            }) +
            '<div class="khckh-tg" data-z="tg"></div>' +
        '</div>' +
        '<div data-z="kc" hidden>' +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'kcn', flush: true, zone: 'kct',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) }) +
        '</div>' +
        '<div data-z="ns" hidden></div>';

    function q(s) { return root.querySelector(s); }
    function k(x) { return root.querySelector('[data-k="' + x + '"]'); }
    var zDs = q('[data-z="ds"]'), zForm = q('[data-z="form"]'), zKc = q('[data-z="kc"]'), zNs = q('[data-z="ns"]');
    var fNam = q('[data-f="nam"]'), fQ = q('[data-f="q"]');
    var dangMo = null, khId = '', rows = [];
    ui.enhance(root);
    K.ganChon(zDs);

    function mo(z) { dangMo = z; ui.swap(zDs, z); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    /* ---------- Danh mục ---------------------------------------------------- */
    H.goi(H.CHUNG + 'DSA4BRIPICwP', 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSNam').then(function (r) {
        var ds = K.ds(r);
        pat.fill(fNam, ds, { name: 'NAM', head: 'Chọn Năm' });
        pat.fill(k('nam'), ds, { name: 'NAM', head: 'Chọn Năm' });
    }).catch(function (err) { ums.api.handle(err, 'năm'); });
    ums.api.dm('KH.NAM.PHANLOAI')
        .then(function (ds) { pat.fill(k('pl'), ds, { name: 'TEN', head: 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    function veBang() {
        var ds = H.loc(rows, fQ.value, ['NAM', 'TEN', 'MA', 'PHANLOAI_TEN']);
        q('[data-z="n"]').textContent = '(' + ds.length + ')';
        ui.table({
            el: q('[data-z="t"]'), rows: ds, empty: 'Chưa có kế hoạch',
            columns: [
                { title: 'Năm', prop: 'NAM', cls: 'is-nowrap' },
                { title: 'Tên', prop: 'TEN', cls: 'khckh-ten' },
                { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
                { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
                { title: 'Hiệu lực', cls: 'is-nowrap', render: H.hieuLuc },
                { title: 'Khóa dữ liệu', cls: 'is-nowrap', render: H.khoaDL },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
                { title: 'Thời gian kỳ, đợt mở', cls: 'is-center is-actions', render: function (r) { return H.suaBtn(r.ID); } },
                { title: 'Kế hoạch chi tiết', cls: 'is-center is-nowrap', render: function (r) { return H.nut('Chi tiết', 'kc', r.ID); } },
                { title: 'Nhân sự', cls: 'is-center is-nowrap', render: function (r) { return H.nut('Chi tiết', 'ns', r.ID); } },
                { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-nowrap' },
                { title: 'Sửa', cls: 'is-center is-actions', render: function (r) { return H.suaBtn(r.ID); } },
                K.cotChon('kh')
            ]
        });
    }
    function load() {
        var host = q('[data-z="t"]');
        K.dang(host);
        H.goi(KH + 'DSA4BRIKCR4PICweFS4vJgkuMQPP', P + 'LayDSKH_Nam_TongHop', { strNam: fNam.value })
            .then(function (r) { rows = K.ds(r); veBang(); })
            .catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }
    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'kh');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) {
            return { action: KH + 'GS4gHgoJHg8gLB4VLi8mCS4x', func: P + 'Xoa_KH_Nam_TongHop', strId: id, strNguoiThucHien_Id: '' };
        }), load);
    }

    /* ---------- Biểu mẫu + bảng Thời gian ----------------------------------- */
    var tg = pat.rows(q('[data-z="tg"]'), {
        title: 'Thời gian', icon: 'fa-calendar-days',
        columns: [
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', title: 'Thời gian', type: 'select', s2: true,
              placeholder: 'Chọn thời gian',
              source: { name: 'DAOTAO_THOIGIANDAOTAO', load: function () {
                  return ums.api.call({ action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', silent: true,
                      strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                      .then(function (r) { return K.ds(r); });
              } } }
        ],
        list: function (id) {
            return { action: KH + 'DSA4BRIKCR4PICweFSkuKAYoIC8P', func: P + 'LayDSKH_Nam_ThoiGian', strKH_Nam_TongHop_Id: id, strNguoiThucHien_Id: '' };
        },
        // gốc chỉ lưu dòng MỚI có chọn thời gian (dòng đã lưu: id ≠ 30 ký tự → bỏ qua)
        filled: function (v, rec) { return !rec && !!v.strDaoTao_ThoiGianDaoTao_Id; },
        save: function (v, rec, id) {
            return { action: KH + 'FSkkLB4KCR4PICweFSkuKAYoIC8P', func: P + 'Them_KH_Nam_ThoiGian',
                strId: '', strKH_Nam_TongHop_Id: id, strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id: '' };
        },
        remove: function (rec) {
            return { action: KH + 'GS4gHgoJHg8gLB4VKS4oBiggLwPP', func: P + 'Xoa_KH_Nam_ThoiGian', strId: rec.ID, strNguoiThucHien_Id: '' };
        }
    });
    function napTG() {
        return tg.load(khId).then(function () {
            // dòng đã lưu: khoá ô chọn (không có lời gọi sửa dòng)
            Array.prototype.forEach.call(q('[data-z="tg"]').querySelectorAll('tbody select'), function (s) {
                s.disabled = true;
                if (window.jQuery) jQuery(s).trigger('change.select2');
            });
        });
    }
    function tieuDe(sua) {
        q('.khckh-form .ums-panel__title').innerHTML =
            '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Sửa' : 'Thêm mới') + ' - Kế hoạch';
    }
    function moThem() {
        khId = '';
        tieuDe(false);
        H.datGiaTri(k('ma'), ''); H.datGiaTri(k('ten'), '');
        H.datGiaTri(k('nam'), fNam.value);
        H.datGiaTri(k('tu'), ''); H.datGiaTri(k('den'), '');
        H.datGiaTri(k('pl'), ''); H.datGiaTri(k('hl'), '1'); H.datGiaTri(k('kdl'), '0');
        tg.clear();
        mo(zForm);
    }
    function moSua(r) {
        khId = r.ID;
        tieuDe(true);
        H.datGiaTri(k('nam'), r.NAM);
        H.datGiaTri(k('ma'), r.MA); H.datGiaTri(k('ten'), r.TEN);
        H.datGiaTri(k('tu'), r.TUNGAY); H.datGiaTri(k('den'), r.DENNGAY);
        H.datGiaTri(k('pl'), r.PHANLOAI_ID);
        H.datGiaTri(k('hl'), e(r.HIEULUC) === '' ? '1' : r.HIEULUC);
        H.datGiaTri(k('kdl'), e(r.KHOADULIEU) === '' ? '0' : r.KHOADULIEU);
        napTG();
        mo(zForm);
    }
    function luu() {
        var them = !khId;
        var o = {
            strId: khId,
            strPhanLoai_Id: k('pl').value, strTen: k('ten').value.trim(), strMa: k('ma').value.trim(),
            strTuNgay: k('tu').value, strDenNgay: k('den').value, strNam: k('nam').value,
            dKhoaDuLieu: k('kdl').value, dHieuLuc: k('hl').value
        };
        var call = them ? [KH + 'FSkkLB4KCR4PICweFS4vJgkuMQPP', P + 'Them_KH_Nam_TongHop']
                        : [KH + 'EjQgHgoJHg8gLB4VLi8mCS4x', P + 'Sua_KH_Nam_TongHop'];
        H.goi(call[0], call[1], o).then(function (r) {
            ui.toast(them ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
            if (them) { khId = (r.raw && r.raw.Id) || ''; if (khId) tieuDe(true); }
            return tg.save(khId).then(napTG);
        }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch'); });
    }

    /* ---------- Kế hoạch chi tiết (chỉ xem) --------------------------------- */
    function moKC(id) {
        var host = q('[data-z="kct"]');
        mo(zKc);
        K.dang(host);
        H.goi(KH + 'DSA4BRIKCR4PICweAikoFSgkNRUpJC4P', P + 'LayDSKH_Nam_ChiTietTheo', { strKH_Nam_TongHop_Id: id }).then(function (r) {
            var ds = K.ds(r);
            q('[data-z="kcn"]').textContent = '(' + ds.length + ')';
            ui.table({
                el: host, rows: ds, empty: 'Chưa có kế hoạch chi tiết',
                columns: [
                    { title: 'Tên', prop: 'TEN', cls: 'khckh-ten' },
                    { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
                    { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-nowrap' },
                    { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-nowrap' },
                    { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
                    { title: 'Chế độ', prop: 'CHEDOAPDUNG_TEN' },
                    { title: 'Hiệu lực', cls: 'is-nowrap', render: H.hieuLuc },
                    { title: 'Khóa dữ liệu', cls: 'is-nowrap', render: H.khoaDL },
                    { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' }
                ]
            });
        }).catch(function (err) { K.loi(host, err, 'kế hoạch chi tiết'); });
    }

    /* ---------- Nhân sự ------------------------------------------------------ */
    var ns = H.taoNhanSu(zNs, {
        khoa: 'strKH_Nam_TongHop_Id',
        lay: [KH + 'DSA4BRIKCR4PICweDykgLxI0', P + 'LayDSKH_Nam_NhanSu'],
        them: [KH + 'FSkkLB4KCR4PICweDykgLxI0', P + 'Them_KH_Nam_NhanSu'],
        xoa: [KH + 'GS4gHgoJHg8gLB4PKSAvEjQP', P + 'Xoa_KH_Nam_NhanSu'],
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
            case 'kc': if (id) moKC(id); break;
            case 'ns': if (id) { ns.mo(id); mo(zNs); } break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); veBang(); } });
    if (window.jQuery) jQuery(fNam).on('select2:select select2:clear', load);

    load();
})();
