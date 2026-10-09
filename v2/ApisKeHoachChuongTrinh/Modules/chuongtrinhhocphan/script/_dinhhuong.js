/* =========================================================================
   Chương trình – học phần (KHCT) — "Thêm mới / Chỉnh sửa - định hướng cho chương trình"
   Bản gốc: ApisKeHoachChuongTrinh/Modules/chuongtrinhhocphan/script/cthp.js (zone_input_dinhhuong)
   Bố cục gốc: cột trái 7/12 = biểu mẫu (Thông tin · Gắn theo khối kiến thức · Gắn theo học phần ·
   Danh sách người học đăng ký định hướng · Xóa | Đóng · Lưu), cột phải 5/12 = ẢNH TRANG TRÍ
   (Upload/images/img-edu-05.png — không có nội dung) → bỏ ảnh, biểu mẫu chiếm cả khung.

   Lời gọi (chép nguyên):
     pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong · Sua_DaoTao_CT_DinhHuong
     KHCT_ThongTin/Xoa_DaoTao_CT_DinhHuong
     KHCT_DinhHuong/LayDSKhoiKienThucChuaDinhHuong (GET + type 'GET', versionAPI v1.0) — ô khối kiến thức
     KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_KKT (GET) · Them_DaoTao_CT_DinhHuong_KKT · Xoa_DaoTao_CT_DinhHuong_KKT
     KHCT_DinhHuong/LayDSDaoTao_HocPhan_Chua_DH (GET, versionAPI v1.0) — ô học phần
     KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_HP (GET) · Them_DaoTao_CT_DinhHuong_HP · Xoa_DaoTao_CT_DinhHuong_HP
     KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_NH (GET) · Them_DaoTao_CT_DinhHuong_NH · Xoa_DaoTao_CT_DinhHuong_NH
     Hộp chọn người học (edu.extend.genModal_SinhVien, Corei): SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc
     danh mục: DAOTAO.CTDT.DINHHUONG.CHEDO

   LỖI BẢN GỐC — làm theo ý định:
     · Thêm mới xong gốc không nhớ id định hướng mới (chỉ gán vào biến cục bộ) → bấm Lưu lần hai là
       thêm TRÙNG. Nay nhớ id, lần sau là Sửa, nạp lại ba bảng.
     · Xoá người học đã lưu: gốc gọi me.getList_SinhVien() — hàm KHÔNG tồn tại (lỗi JS, bảng không nạp
       lại). Nay nạp lại bảng người học.
     · Tên / Mã định hướng mang dấu (*) nhưng gốc không kiểm → nay bắt nhập hai ô này.
     · Ô "Học phần" của dòng gắn học phần: gốc nạp theo khối của dòng lúc dựng (dòng mới = rỗng → mọi
       học phần chưa định hướng) và KHÔNG nạp lại khi đổi khối. Nay đổi khối là nạp lại học phần của
       khối đó (khối để trống = mọi học phần, như gốc) — lọc TUỲ CHỌN nên không khoá.
     · Chọn trùng người học đã có trong bảng: gốc báo "Đã tồn tại!" — giữ (so theo QLSV_NGUOIHOC_ID).
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khctCt;
    if (!K || !K.api) return;
    var e = K.e, esc = K.esc, rows = K.rows;
    var DH = 'KHCT_DinhHuong/';
    var cur = null, dsKKT = [], moiSV = [], daSV = [];

    function fld(nhan, html, req, rong) {
        return '<div class="ums-field"' + (rong ? ' style="grid-column:1 / -1"' : '') + '><label class="ums-field__label">' + esc(nhan) +
            (req ? '<i class="ums-field__req">*</i>' : '') + '</label><div class="ums-field__control">' + html + '</div></div>';
    }
    function inp(k, ph, date) {
        return date
            ? '<div class="ums-inputwrap"><input class="ums-input" data-k="' + k + '" data-date placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>'
            : '<input class="ums-input" data-k="' + k + '" placeholder="' + esc(ph || '') + '" autocomplete="off">';
    }
    function nhom(tieuDe, nut) {
        return '<div class="ums-row khct-nhomhang"><div class="ums-legend ums-u-flex1">' + esc(tieuDe) + '</div>' + nut + '</div>';
    }

    var D = K.vung('dh',
        pat.panel({ title: 'Định hướng cho chương trình', icon: 'fa-signs-post', count: 'ten', cls: 'khct-vung', flush: true,
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body:
                '<div class="khct-pad">' +
                    '<div class="ums-legend">Thông tin</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        fld('Tên định hướng', inp('ten', 'Tên định hướng'), true) + fld('Mã định hướng', inp('ma', 'Mã định hướng'), true) +
                        fld('Chế độ đăng ký định hướng', '<select class="ums-select" data-k="cheDo" data-ph="--Chọn chế độ--"><option value="">--Chọn chế độ--</option></select>') +
                        fld('Tên tiếng anh', inp('tenTA', 'Tên tiếng anh')) +
                        fld('Ngày bắt đầu', inp('bd', '', true)) + fld('Ngày kết thúc', inp('kt', '', true)) +
                    '</div>' +
                    nhom('Gắn theo khối kiến thức', ui.btn('add', { mod: 'out-primary', attr: { 'data-a': 'themKKT' } })) +
                '</div>' +
                '<div data-z="kkt"></div>' +
                '<div class="khct-pad">' + nhom('Gắn theo học phần', ui.btn('add', { mod: 'out-success', attr: { 'data-a': 'themHP' } })) + '</div>' +
                '<div data-z="hp"></div>' +
                '<div class="khct-pad">' + nhom('Danh sách người học đăng ký định hướng', ui.btn('add', { mod: 'out-info', attr: { 'data-a': 'themSV' } })) + '</div>' +
                '<div data-z="sv"></div>',
            foot: ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoa' } }) + '<div class="ums-u-flex1"></div>' +
                ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }) }));
    function z(k) { return D.querySelector('[data-z="' + k + '"]'); }
    function o(k) { return D.querySelector('[data-k="' + k + '"]'); }
    function v(k) { return pat.val(o(k)); }
    function dat(k, x) {
        var el = o(k);
        el.value = x === undefined || x === null ? '' : x;
        if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y');
        if (window.jQuery) jQuery(el).trigger('change.select2');
    }
    ums.api.dm('DAOTAO.CTDT.DINHHUONG.CHEDO').then(function (r) { pat.fill(o('cheDo'), r, { head: '--Chọn chế độ--' }); }).catch(function () {});
    ui.enhance(D);

    /* ---------- Bảng "Gắn theo khối kiến thức" / "Gắn theo học phần" --------
       Dòng ĐÃ LƯU chỉ hiện chữ + "Xóa" (xoá ngay trên máy chủ); dòng MỚI có ô chọn + "Xóa dòng".
       Lưu định hướng xong mới gửi các dòng mới (như gốc). */
    var gan = { kkt: { luu: [], moi: [] }, hp: { luu: [], moi: [] } };
    var dem = 0;
    function oKKT(k, val) {
        return '<select class="ums-select ums-input--sm" data-' + k + '><option value="">Chọn khối kiến thức</option>' + dsKKT.map(function (x) {
            return '<option value="' + esc(x.ID) + '"' + (x.ID === val ? ' selected' : '') + '>' + esc(e(x.TEN)) + '</option>';
        }).join('') + '</select>';
    }
    function veKKT() {
        var ds = gan.kkt.luu.map(function (r) { return { ID: r.ID, luu: r }; }).concat(gan.kkt.moi.map(function (m) { return { ID: m.id, moi: m }; }));
        ui.table({ el: z('kkt'), rows: ds, empty: 'Chưa gắn khối kiến thức',
            columns: [
                { title: 'Khối kiến thức', render: function (x) {
                    return x.luu ? esc(e(x.luu.DAOTAO_KHOIKIENTHUC_MA) + ' - ' + e(x.luu.DAOTAO_KHOIKIENTHUC_TEN))
                        : oKKT('kkt-o="' + esc(x.moi.id) + '"', x.moi.khoi);
                } },
                { title: 'Xóa', cls: 'is-center is-actions', width: '110px', render: function (x) { return nutXoa('kkt', x); } }
            ] });
    }
    function veHP() {
        var ds = gan.hp.luu.map(function (r) { return { ID: r.ID, luu: r }; }).concat(gan.hp.moi.map(function (m) { return { ID: m.id, moi: m }; }));
        ui.table({ el: z('hp'), rows: ds, empty: 'Chưa gắn học phần',
            columns: [
                { title: 'Khối kiến thức', render: function (x) {
                    return x.luu ? esc(e(x.luu.DAOTAO_KHOIKIENTHUC_MA) + ' - ' + e(x.luu.DAOTAO_KHOIKIENTHUC_TEN))
                        : oKKT('hpk-o="' + esc(x.moi.id) + '"', x.moi.khoi);
                } },
                { title: 'Học phần', render: function (x) {
                    if (x.luu) return esc(e(x.luu.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.luu.DAOTAO_HOCPHAN_TEN));
                    return '<select class="ums-select ums-input--sm" data-hph-o="' + esc(x.moi.id) + '"><option value="">Chọn học phần</option>' +
                        (x.moi.dsHP || []).map(function (h) {
                            return '<option value="' + esc(h.ID) + '"' + (h.ID === x.moi.hp ? ' selected' : '') + '>' + esc(e(h.MA) + ' - ' + e(h.TEN)) + '</option>';
                        }).join('') + '</select>';
                } },
                { title: 'Xóa', cls: 'is-center is-actions', width: '110px', render: function (x) { return nutXoa('hp', x); } }
            ] });
    }
    function nutXoa(k, x) {
        return x.luu
            ? '<button type="button" class="ums-btn ums-btn--out-danger ums-btn--sm" data-xoaluu="' + k + '" data-id="' + esc(x.ID) + '"><i class="fa-light fa-trash-can"></i><span>Xóa</span></button>'
            : '<button type="button" class="ums-btn ums-btn--out-danger ums-btn--sm" data-xoamoi="' + k + '" data-id="' + esc(x.ID) + '"><i class="fa-light fa-trash-can"></i><span>Xóa dòng</span></button>';
    }
    function hocPhanChuaDH(khoi) {
        return ums.api.call({ action: DH + 'LayDSDaoTao_HocPhan_Chua_DH', method: 'GET', type: 'GET', silent: true,
            strDaoTao_ChuongTrinh_Id: K.ctId(), strDaoTao_CT_DinhHuong_Id: cur ? cur.ID : '', strDaoTao_KhoiKienThuc_Id: khoi || '',
            strNguoiThucHien_Id: '', versionAPI: 'v1.0' }).then(rows).catch(function (err) { ums.api.handle(err, 'học phần chưa định hướng'); return []; });
    }

    /* ---------- Bảng người học ---------------------------------------------- */
    function veSV() {
        var ds = daSV.map(function (r) { return { ID: r.ID, luu: r, r: r }; }).concat(moiSV.map(function (r) { return { ID: 'm' + r.ID, r: r }; }));
        ui.table({ el: z('sv'), rows: ds, empty: 'Không tìm thấy dữ liệu!',
            columns: [
                { title: 'Mã số', render: function (x) { return esc(e(x.r.QLSV_NGUOIHOC_MASO)); }, cls: 'is-nowrap' },
                { title: 'Học đệm', render: function (x) { return esc(e(x.r.QLSV_NGUOIHOC_HODEM)); } },
                { title: 'Tên', render: function (x) { return esc(e(x.r.QLSV_NGUOIHOC_TEN)) + (x.luu ? '' : ' ' + ui.badge('Chưa lưu', 'warn')); } },
                { title: 'Xóa', cls: 'is-center is-actions', width: '60px', render: function (x) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" ' + (x.luu ? 'data-xoasv' : 'data-bosv') + '="' + esc(x.luu ? x.ID : x.r.ID) +
                        '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                } }
            ] });
    }
    function idNH(r) { return e(r.QLSV_NGUOIHOC_ID || r.ID); }

    /* ---------- Nạp ----------------------------------------------------------- */
    function taiKKTGan() {
        return ums.api.call({ action: DH + 'LayDSKhoiKienThucChuaDinhHuong', method: 'GET', type: 'GET', silent: true,
            strDaoTao_ChuongTrinh_Id: K.ctId(), strNguoiThucHien_Id: '', versionAPI: 'v1.0' })
            .then(function (r) { dsKKT = rows(r); }).catch(function (err) { dsKKT = []; ums.api.handle(err, 'khối kiến thức chưa định hướng'); });
    }
    function taiDS(k) {
        var map = { kkt: 'LayDSDaoTao_CT_DinhHuong_KKT', hp: 'LayDSDaoTao_CT_DinhHuong_HP', sv: 'LayDSDaoTao_CT_DinhHuong_NH' };
        if (!cur) { if (k === 'sv') { daSV = []; veSV(); } else { gan[k].luu = []; (k === 'kkt' ? veKKT : veHP)(); } return Promise.resolve(); }
        var c = { action: DH + map[k], method: 'GET', type: 'GET', strTuKhoa: '', strDaoTao_ChuongTrinh_Id: K.ctId(),
            strDaoTao_CT_DinhHuong_Id: cur.ID, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 };
        if (k === 'hp') c.strDaoTao_KhoiKienThuc_Id = '';
        return ums.api.call(c).then(function (r) {
            if (k === 'sv') { daSV = rows(r); veSV(); } else { gan[k].luu = rows(r); (k === 'kkt' ? veKKT : veHP)(); }
        }).catch(function (err) { ums.api.handle(err, 'tải danh sách gắn định hướng'); });
    }

    K.moDH = function (row) {
        cur = row;
        gan.kkt = { luu: [], moi: [] }; gan.hp = { luu: [], moi: [] }; moiSV = []; daSV = [];
        z('ten').textContent = (row ? ' — Chỉnh sửa: ' : ' — Thêm mới: ') + e(K.ct && K.ct.TENCHUONGTRINH);
        dat('ten', row && row.TEN); dat('ma', row && row.MA); dat('tenTA', row && row.TENTA);
        dat('cheDo', row && row.CHEDODANGKYDINHHUONG_ID); dat('bd', row && row.NGAYBATDAU); dat('kt', row && row.NGAYKETTHUC);
        D.querySelector('[data-a="xoa"]').hidden = !row;
        veKKT(); veHP(); veSV();
        K.api.hien('dh');
        taiKKTGan().then(function () { veKKT(); veHP(); });
        if (row) { taiDS('kkt'); taiDS('hp'); taiDS('sv'); }
    };

    /* Đọc giá trị ô chọn của dòng mới vào mảng (vẽ lại không mất lựa chọn) */
    function docMoi() {
        gan.kkt.moi.forEach(function (m) { var s = D.querySelector('[data-kkt-o="' + m.id + '"]'); if (s) m.khoi = s.value; });
        gan.hp.moi.forEach(function (m) {
            var s = D.querySelector('[data-hpk-o="' + m.id + '"]'), h = D.querySelector('[data-hph-o="' + m.id + '"]');
            if (s) m.khoi = s.value; if (h) m.hp = h.value;
        });
    }

    function luu() {
        docMoi();
        if (!v('ten') || !v('ma')) { ui.toast('Nhập Tên định hướng và Mã định hướng.', 'warn'); return; }
        var c = { action: 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eAhUeBSgvKQk0Li8m', func: 'pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong',
            strId: cur ? cur.ID : '', strDaoTao_ChuongTrinh_Id: K.ctId(), strTen: v('ten'), strTenTA: v('tenTA'), strMa: v('ma'),
            strCheDoDangKyDinhHuong_Id: v('cheDo'), strNgayBatDau: v('bd'), strNgayKetThuc: v('kt'), strNguoiThucHien_Id: '' };
        if (cur) { c.action = 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4CFR4FKC8pCTQuLyYP'; c.func = 'pkg_kehoach_thongtin.Sua_DaoTao_CT_DinhHuong'; }
        ums.api.call(c).then(function (r) {
            var id = cur ? cur.ID : ((r.raw && r.raw.Id) || '');
            ui.toast(cur ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            if (!id) { K.taiDH(); return; }
            cur = cur || { ID: id };
            D.querySelector('[data-a="xoa"]').hidden = false;
            var calls = [];
            gan.kkt.moi.filter(function (m) { return m.khoi; }).forEach(function (m) {
                calls.push({ action: DH + 'Them_DaoTao_CT_DinhHuong_KKT', type: 'POST', strId: '', strDaoTao_ChuongTrinh_Id: K.ctId(),
                    strDaoTao_CT_DinhHuong_Id: id, strDaoTao_KhoiKienThuc_Id: m.khoi, strMoTa: '', strNguoiThucHien_Id: '' });
            });
            gan.hp.moi.filter(function (m) { return m.hp; }).forEach(function (m) {
                calls.push({ action: DH + 'Them_DaoTao_CT_DinhHuong_HP', type: 'POST', strId: '', strDaoTao_ChuongTrinh_Id: K.ctId(),
                    strDaoTao_CT_DinhHuong_Id: id, strDaoTao_KhoiKienThuc_Id: m.khoi || '', strDaoTao_HocPhan_Id: m.hp, strMoTa: '', strNguoiThucHien_Id: '' });
            });
            moiSV.forEach(function (s) {
                calls.push({ action: DH + 'Them_DaoTao_CT_DinhHuong_NH', type: 'POST', strDaoTao_ChuongTrinh_Id: K.ctId(),
                    strDaoTao_CT_DinhHuong_Id: id, strQLSV_NguoiHoc_Id: idNH(s), strSoQuyetDinh: '', strNgayQuyetDinh: '', strMoTa: '', strNguoiThucHien_Id: '' });
            });
            return ui.batch(calls, { title: 'Đang lưu gắn định hướng', okText: 'Thêm mới thành công!' }).then(function () {
                gan.kkt.moi = []; gan.hp.moi = []; moiSV = [];
                K.taiDH().then(function () {
                    var r2 = K.dsDH.filter(function (x) { return x.ID === id; })[0];
                    if (r2) cur = r2;
                });
                taiKKTGan().then(function () { return Promise.all([taiDS('kkt'), taiDS('hp'), taiDS('sv')]); });
            });
        }).catch(function (err) { ums.api.handle(err, 'lưu định hướng'); });
    }
    function xoa() {
        if (!cur) return;
        ui.confirm('Bạn có chắc chắn muốn xóa định hướng "' + e(cur.TEN) + '"?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'KHCT_ThongTin/Xoa_DaoTao_CT_DinhHuong', strIds: cur.ID, strNguoiThucHien_Id: '' }).then(function () {
                ui.toast('Xóa dữ liệu thành công!', 'ok');
                K.veCT();
                K.taiDH();
            });
        }).catch(function (err) { ums.api.handle(err, 'xoá định hướng'); });
    }
    function chonSV() {
        pat.pickSinhVien({
            filters: true,
            status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3 }); },
            call: function (p, page, size) {
                return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                    strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                    strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                    strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                    strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
            },
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', render: function (r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
            ],
            onPick: function (ds) {
                var co = {};
                daSV.concat(moiSV).forEach(function (r) { co[idNH(r)] = 1; });
                var n = 0;
                ds.forEach(function (r) { if (!co[idNH(r)]) { moiSV.push(r); co[idNH(r)] = 1; n++; } });
                if (n < ds.length) ui.toast('Đã tồn tại! Bỏ qua ' + (ds.length - n) + ' người học đã có trong bảng', 'info');
                veSV();
            }
        });
    }

    D.addEventListener('change', function (ev) {
        var s = ev.target.closest('[data-hpk-o]');
        if (!s) return;
        var m = gan.hp.moi.filter(function (x) { return x.id === s.getAttribute('data-hpk-o'); })[0];
        if (!m) return;
        docMoi();
        m.hp = '';
        hocPhanChuaDH(m.khoi).then(function (ds) { m.dsHP = ds; veHP(); });
    });
    D.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-xoamoi]');
        if (b && D.contains(b)) {
            docMoi();
            var k = b.getAttribute('data-xoamoi'), id = b.getAttribute('data-id');
            gan[k].moi = gan[k].moi.filter(function (m) { return m.id !== id; });
            (k === 'kkt' ? veKKT : veHP)();
            return;
        }
        b = ev.target.closest('[data-xoaluu]');
        if (b && D.contains(b)) {
            var k2 = b.getAttribute('data-xoaluu'), id2 = b.getAttribute('data-id');
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                docMoi();
                return ums.api.call({ action: DH + (k2 === 'kkt' ? 'Xoa_DaoTao_CT_DinhHuong_KKT' : 'Xoa_DaoTao_CT_DinhHuong_HP'), strIds: id2, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); taiKKTGan().then(function () { return taiDS(k2); }); });
            }).catch(function (err) { ums.api.handle(err, 'xoá'); });
            return;
        }
        b = ev.target.closest('[data-bosv]');
        if (b && D.contains(b)) { var sid = b.getAttribute('data-bosv'); moiSV = moiSV.filter(function (r) { return r.ID !== sid; }); veSV(); return; }
        b = ev.target.closest('[data-xoasv]');
        if (b && D.contains(b)) {
            var rid = b.getAttribute('data-xoasv');
            ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: DH + 'Xoa_DaoTao_CT_DinhHuong_NH', strIds: rid, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Xóa thành công!', 'ok'); taiDS('sv'); });
            }).catch(function (err) { ums.api.handle(err, 'xoá người học'); });
            return;
        }
        b = ev.target.closest('[data-a]');
        if (!b || !D.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') K.veCT();
        else if (a === 'luu') luu();
        else if (a === 'xoa') xoa();
        else if (a === 'themKKT') { docMoi(); gan.kkt.moi.push({ id: 'n' + (++dem), khoi: '' }); veKKT(); }
        else if (a === 'themHP') {
            docMoi();
            var m = { id: 'n' + (++dem), khoi: '', hp: '', dsHP: [] };
            gan.hp.moi.push(m); veHP();
            hocPhanChuaDH('').then(function (ds) { m.dsHP = ds; docMoi(); veHP(); });
        }
        else if (a === 'themSV') chonSV();
    });
})();
