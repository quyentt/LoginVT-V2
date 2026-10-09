/* =========================================================================
   Dùng chung cho hai màn THU TIỀN KHÁC và THU TIỀN QUA POS (phieuthu)
   ---------------------------------------------------------------------------
   Bản gốc: ApisTaiChinh/Modules/phieuthu/scripts/thutienkhac.js và
   pos_thutien.js — hai tệp chép từ cùng một khuôn (PhieuThu), phần lớn
   giống hệt nhau. Phần giống được gom về đây, đặt ở ums.phieuthuKhac.

     PK.m                    tiền: fmt / parse / isNum / tongStr — đúng
                             edu.util.formatCurrency, edu.system.countFloat,
                             convertFloat (Core/systemroot.js:8219)
     PK.cmDM(ma)             CM_DanhMucDuLieu/LayDanhSach (GET) — trạng thái SV, nút HĐĐT
     PK.dmList(ma)           edu.system.getList_DanhMucDulieu (CMS_DanhMucThuocTinh/…)
     PK.options(rows, o)     dựng <option> đúng như edu.system.loadToCombo_data
     PK.khoanThu()           TC_KhoanThu/LayDanhSach (danh mục khoản thu)
     PK.checks(host, rows)   danh sách ô đánh dấu có "Tất cả" (trạng thái SV, khoản thu)
     PK.tinhHinh(host, cfg)  tab "Tình hình học phí": các ô tổng + bảng chi tiết
     PK.bang(host, cfg)      bảng các khoản có ô nhập nội dung / số lượng / số tiền
     PK.nhap(host, cfg)      phiếu viết (bản nháp trước khi lưu) — thay mẫu
                             Upload/Files/PrintTemplate/Edit_DHCNTTTN_BIENLAI*_2018.html

   Số tiền trong màn này hiển thị theo quy ước của hệ cũ (dấu phẩy phân
   nghìn, dấu chấm thập phân) — ô nhập số tiền phân tích đúng quy ước đó,
   trộn với ums.ui.money (dấu chấm phân nghìn) trong cùng một màn tiền dễ
   đọc nhầm.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums;
    var ui = ums.ui;
    var esc = ui.esc;
    var PK = ums.phieuthuKhac = ums.phieuthuKhac || {};
    var seq = 0;

    function has(v) { return v !== null && v !== undefined && v !== ''; }
    function e(v) { return has(v) ? v : ''; }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    /* =====================================================================
       Tiền
       ===================================================================== */
    var m = PK.m = {};

    /* edu.util.floatValid */
    m.isNum = function (v) { return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(v); };

    /* edu.util.formatCurrency — nay là ums.pat.money ở tầng chung (chỉ nhóm
       phần nguyên; bản gốc chạy regex trên cả chuỗi nên "1234.5678" thành
       "1,234.5,678"). Với số nguyên kết quả giống hệt. Rỗng → "0" như bản gốc. */
    m.fmt = function (v) { return ums.pat.money(has(v) ? v : 0); };

    /* getSoTien() của bản gốc: bỏ khoảng trắng và dấu phẩy rồi parseFloat.
       Trả NaN khi không phải số — nơi gọi phải kiểm tra. */
    m.parse = function (v) {
        return parseFloat(String(v === null || v === undefined ? '' : v).replace(/ /g, '').replace(/,/g, ''));
    };

    /* Giá trị một ô số tiền như countFloat đọc: rỗng = 0, sai định dạng = bỏ qua */
    m.cell = function (v) {
        var s = String(v === null || v === undefined ? '' : v).replace(/ /g, '').replace(/,/g, '');
        if (s === '') return 0;
        return m.isNum(s) ? parseFloat(s) : null;
    };

    /* countFloat: làm tròn XUỐNG 2 chữ số thập phân; convertFloat: định dạng */
    m.floor2 = function (n) { return Math.floor(n * 100) / 100; };
    m.tongStr = function (n) {
        n = m.floor2(n);
        if (!n) return '0';
        var s = String(n), dot = s.indexOf('.');
        return dot < 0 ? m.fmt(s) : m.fmt(s.substring(0, dot)) + s.substring(dot);
    };

    /* =====================================================================
       Danh mục
       ===================================================================== */
    function rowsOf(r) {
        var d = r && r.data;
        return Array.isArray(d) ? d : (d && d.rs) || [];
    }
    PK.rowsOf = rowsOf;

    /* CM_DanhMucDuLieu/LayDanhSach — tiền tố CM_, KHÁC danh mục CMS_ của ums.api.dm */
    PK.cmDM = function (ma) {
        return ums.api.call({
            action: 'CM_DanhMucDuLieu/LayDanhSach', method: 'GET', silent: true,
            versionAPI: 'v1.0', strMaBangDanhMuc: ma
        }).then(rowsOf);
    };

    /* edu.system.getList_DanhMucDulieu (Core/systemroot.js:4476) — gửi
       dTrangThai rỗng (bản gốc không truyền iTrangThai), khác ums.api.dm */
    var dmCache = {};
    PK.dmList = function (ma) {
        if (!dmCache[ma]) {
            dmCache[ma] = ums.api.call({
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM', method: 'GET', silent: true,
                strMaBangDanhMuc: ma, strTieuChiSapXep: ''
            }).then(rowsOf, function (err) { delete dmCache[ma]; throw err; });
        }
        return dmCache[ma];
    };

    /* edu.system.loadToCombo_data (Core/systemroot.js:2239):
         <option id="{avatar}" value="{id}" name="{code}">{tên}</option>
       Có title → mục rỗng đầu; không có title mà dòng đầu có
       CHUNG_TENDANHMUC_TEN → mục rỗng "Chọn <tên danh mục>"; ngược lại KHÔNG
       có mục rỗng (ô tự chọn dòng đầu). Dòng có THONGTIN8 = "CHON" là mặc định.
       Trả { html, def } — def là giá trị mặc định (có thể rỗng). */
    PK.options = function (rows, o) {
        o = o || {};
        var id = o.id || 'ID', name = o.name || 'TEN';
        var h = '', def = o.def || '';
        rows = rows || [];
        if (!rows.length) return { html: '<option value="">-- Không tìm thấy dữ liệu! --</option>', def: '' };
        if (has(o.title)) h += '<option value="">' + esc(o.title) + '</option>';
        else if (has(rows[0].CHUNG_TENDANHMUC_TEN)) h += '<option value="">Chọn ' + esc(String(rows[0].CHUNG_TENDANHMUC_TEN).toLowerCase()) + '</option>';
        rows.forEach(function (r) {
            if (r.THONGTIN8 === 'CHON') def = r[id];
            h += '<option value="' + esc(r[id]) + '"' +
                (o.avatar ? ' data-ma="' + esc(r[o.avatar]) + '"' : '') +
                (o.code ? ' data-code="' + esc(String(r[o.code])) + '"' : '') + '>' +
                esc(typeof name === 'function' ? name(r) : r[name]) + '</option>';
        });
        return { html: h, def: def };
    };

    PK.fillSelect = function (el, rows, o) {
        var r = PK.options(rows, o);
        el.innerHTML = r.html;
        if (r.def) el.value = r.def;
        return r;
    };

    /* TC_KhoanThu/LayDanhSach — getList_DMLKT của cả ba màn (tham số giống hệt) */
    PK.khoanThu = function () {
        return ums.api.call({
            // bản gốc KHÔNG có versionAPI trong dữ liệu gửi (chỉ ở tham số makeRequest)
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1,
            strNhomCacKhoanThu_Id: '', strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
        }).then(rowsOf);
    };

    /* edu.extend.removeNoiDungDai (Core/systemextend.js:6243) */
    PK.noiDungNgan = function (s, soTien) {
        if (!has(s)) return '';
        s = String(s);
        if (s.indexOf('VIETINBANK') >= 0 && s.indexOf('DTC') >= 0) {
            s = s.replace('VIETIN', '');
            s = s.substring(0, s.indexOf('$'));
            if (has(soTien) && s.indexOf(String(soTien)) >= 0) s = s.replace(String(soTien), '');
            return s + '...';
        }
        return s;
    };

    /* =====================================================================
       Danh sách ô đánh dấu có "Tất cả" (genList_TrangThaiSV, genList_DMLKT)
       ---------------------------------------------------------------------
       Bản dựng ở tầng chung — ums.pat.checks. Ở đây giữ tên gọi cũ và giữ
       đúng nếp của nhóm màn này: KHÔNG có ô "Tất cả" trừ khi truyền `all`.
         var c = PK.checks(host, rows, { all: 'Tất cả', checked: true, name: 'TEN' })
         c.ids()  → mảng ID đang chọn (thứ tự như trên màn, = getCheckedCheckBoxByClassName)
       ===================================================================== */
    PK.checks = function (host, rows, o) {
        o = o || {};
        var c = ums.pat.checks(host, rows, {
            all: o.all || false,
            checked: !!o.checked,
            name: o.name || 'TEN',
            onChange: o.onChange
        });
        c.uncheckAll = function () { c.setAll(false); };
        return c;
    };

    /* =====================================================================
       Tab "Tình hình học phí"
       ---------------------------------------------------------------------
       cfg = {
         id()          → strQLSV_NguoiHoc_Id gửi lên (thutienkhac: ID đối tượng,
                         POS: STUDENTID)
         tiles         danh sách khoá ô cần hiện (mặc định: tất cả)
         onPhieu(kind, id)   bấm "Chi tiết" một phiếu: kind = thu | rut | hoadon
         onEdit(kind, row, rows) nút sửa ở bảng khoản phải nộp / đã nộp (bỏ = không có nút)
         report(el)    gắn nút báo cáo vào ô Báo cáo (bỏ = không có ô)
       }
       ===================================================================== */
    var COT_KHOAN = [
        { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center is-nowrap' },
        { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' },
        { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
        { title: 'Nội dung', render: function (r) { return '<span title="' + esc(r.NOIDUNG) + '">' + esc(PK.noiDungNgan(r.NOIDUNG, r.SOTIEN)) + '</span>'; } },
        { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (r) { return esc(m.fmt(r.SOTIEN)); }, sum: sumCol('SOTIEN') },
        { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
        { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU', cls: 'is-center' }
    ];

    function sumCol(prop) {
        return function (rows) {
            var t = 0;
            rows.forEach(function (r) { var v = m.cell(m.fmt(r[prop])); if (v !== null) t += v; });
            return '<b>' + esc(m.tongStr(t)) + '</b>';
        };
    }

    function cotPhieu(soCol, nguoiCol, kind) {
        return [
            { title: 'Số phiếu', prop: soCol, cls: 'is-center' },
            { title: 'Tổng tiền', cls: 'is-right is-nowrap', render: function (r) { return esc(m.fmt(r.TONGTIEN)); }, sum: sumCol('TONGTIEN') },
            { title: 'Ngày thu', prop: 'NGAYTHU_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người thu', prop: nguoiCol, cls: 'is-center' },
            { title: 'Chi tiết', cls: 'is-actions', render: function (r) {
                return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-phieu="' + kind + '" data-id="' + esc(r.ID) + '">' +
                    '<i class="fa-light fa-file-lines"></i><span>Chi tiết</span></button>';
            } }
        ];
    }

    var TILES = [
        { k: 'PhaiNop', label: 'Khoản phải nộp', col: 'TONGKHOANPHAINOP', icon: 'fa-sack-dollar', tone: 'green', action: 'TC_ThongTinChung/LayDSKhoanPhaiNop', edit: 'phaiNop' },
        { k: 'DuocMien', label: 'Khoản được miễn', col: 'TONGKHOANDUOCMIEN', icon: 'fa-badge-dollar', tone: 'green', action: 'TC_ThongTinChung/LayDSKhoanMien', sotienTitle: 'Số tiền được miễn' },
        { k: 'DaNop', label: 'Khoản đã nộp', col: 'TONGKHOANDANOP', icon: 'fa-circle-dollar', tone: 'green', action: 'TC_ThongTinChung/LayDSKhoanDaNop', edit: 'daNop', soChungTu: true },
        { k: 'DaRut', label: 'Khoản đã rút', col: 'TONGKHOANDARUT', icon: 'fa-money-from-bracket', tone: 'green', action: 'TC_ThongTinChung/LayDSKhoanDaRut' },
        { k: 'NoRieng', label: 'Tổng nợ riêng các khoản', col: 'TONGNORIENG', icon: 'fa-hand-holding-dollar', tone: 'red', action: 'TC_ThongTinChung/LayDSKhoanNoRieng', paged: true },
        { k: 'NoChung', label: 'Tổng nợ chung các khoản', col: 'TONGNOCHUNG', icon: 'fa-hands-holding-dollar', tone: 'red', action: 'TC_ThongTinChung/LayDSKhoanNoChung', paged: true },
        { k: 'DuRieng', label: 'Tổng dư riêng các khoản', col: 'TONGDURIENG', icon: 'fa-square-dollar', tone: 'blue', action: 'TC_ThongTinChung/LayDSKhoanDuRieng', paged: true },
        { k: 'DuChung', label: 'Tổng dư chung các khoản', col: 'TONGDUCHUNG', icon: 'fa-circle-dollar-to-slot', tone: 'blue', action: 'TC_ThongTinChung/LayDSKhoanDuChung', paged: true },
        { k: 'PhieuThu', label: 'Danh sách phiếu đã thu', col: 'TONGTIENPHIEUTHU', icon: 'fa-file-invoice-dollar', tone: 'amber', action: 'TC_ThongTinChung/LayDSPhieuDaThu', paged: true, phieu: ['SOPHIEUTHU', 'TAIKHOAN_NGUOITHU', 'thu'] },
        { k: 'PhieuRut', label: 'Danh sách phiếu đã rút', col: 'TONGTIENPHIEURUT', icon: 'fa-file-invoice', tone: 'amber', action: 'TC_ThongTinChung/LayDSPhieuDaRut', paged: true, phieu: ['SOPHIEUTHU', 'TAIKHOAN_NGUOIRUT', 'rut'] },
        { k: 'PhieuHoaDon', label: 'Danh sách phiếu hóa đơn', col: 'TONGTIENHOADON', icon: 'fa-receipt', tone: 'amber', action: 'TC_ThongTinChung/LayDSPhieuHoaDon', paged: true, phieu: ['SOHOADON', 'TAIKHOAN_NGUOITHU', 'hoadon'] }
    ];
    PK.TILES = TILES;

    PK.tinhHinh = function (host, cfg) {
        var uid = 'th' + (++seq);
        var keys = cfg.tiles || TILES.map(function (t) { return t.k; });
        var tiles = TILES.filter(function (t) { return keys.indexOf(t.k) >= 0; });
        var cur = null, curRows = [];

        var h = '<div data-z="tiles"><div class="ums-grid ums-grid--4 pk-tiles">';
        tiles.forEach(function (t) {
            h += '<button type="button" class="ums-stat' + (t.tone === 'blue' ? '' : ' ums-stat--' + t.tone) + ' pk-tile" data-tile="' + t.k + '">' +
                '<span class="ums-stat__icon"><i class="fa-light ' + t.icon + '"></i></span>' +
                '<span><span class="ums-stat__value" data-v="' + t.k + '">0</span>' +
                '<span class="ums-stat__label">' + esc(t.label) + '</span></span></button>';
        });
        if (cfg.report) {
            h += '<div class="ums-stat ums-stat--amber pk-tile"><span class="ums-stat__icon"><i class="fa-light fa-file-chart-column"></i></span>' +
                '<span><span class="ums-stat__label">Báo cáo</span><span data-z="report"></span></span></div>';
        }
        h += '</div></div>';
        host.innerHTML = h;
        var z = function (n) { return host.querySelector('[data-z="' + n + '"]'); };
        if (cfg.report) cfg.report(z('report'));

        /* Bảng chi tiết một loại mở trong HỘP THOẠI (người dùng 2026-09-26) — trước đây thay chỗ các thẻ tổng,
           nút "Tổng nợ … các khoản" ở tab khác còn nhảy về tab Tình hình học phí. */
        var dlg = null;
        function bang() { return dlg && !dlg.closed ? dlg.body : null; }
        function showTiles() { if (dlg && !dlg.closed) dlg.close(); cur = null; }

        function detail(k) {
            var t = tiles.filter(function (x) { return x.k === k; })[0];
            if (!t) return;
            cur = t;
            if (!dlg || dlg.closed) {
                dlg = ui.dialog({ title: t.label, icon: 'fa-list-ul', size: 'xl', body: '',
                    onClose: function () { cur = null; } });
                dlg.body.addEventListener('click', nut);
            } else {
                var tt = dlg.el.querySelector('.ums-dialog__title');
                if (tt) tt.innerHTML = '<i class="fa-light fa-list-ul"></i> ' + esc(t.label);
            }
            bang().innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var call = { action: t.action, method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: cfg.id(), strNguoiThucHien_Id: '' };
            if (t.paged) { call.pageIndex = 1; call.pageSize = 1000000000; }
            ums.api.call(call).then(function (r) {
                if (cur !== t) return;
                curRows = rowsOf(r);
                var cols;
                if (t.phieu) cols = cotPhieu(t.phieu[0], t.phieu[1], t.phieu[2]);
                else {
                    cols = COT_KHOAN.slice();
                    if (t.sotienTitle) { cols[4] = Object.assign({}, cols[4], { title: t.sotienTitle }); }
                    if (t.soChungTu) cols.splice(5, 0, { title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' });
                    if (t.edit && cfg.onEdit) {
                        cols.push({ title: 'Sửa', cls: 'is-actions', render: function (r) {
                            return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-edit="' + t.edit + '" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                        } });
                    }
                }
                if (bang()) ui.table({ el: bang(), rows: curRows, columns: cols, empty: 'Không có dữ liệu' });
            }).catch(function (err) {
                if (bang()) bang().innerHTML = ui.fail(err.message);
                ums.api.handle(err, t.label);
            });
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tile]');
            if (b && host.contains(b)) return detail(b.getAttribute('data-tile'));
        });
        /* nút trong bảng chi tiết (hộp thoại): xem phiếu · sửa khoản */
        function nut(ev) {
            var p = ev.target.closest('[data-phieu]');
            if (p && cfg.onPhieu) return cfg.onPhieu(p.getAttribute('data-phieu'), p.getAttribute('data-id'));
            var ed = ev.target.closest('[data-edit]');
            if (ed && cfg.onEdit) {
                var id = ed.getAttribute('data-id');
                var row = curRows.filter(function (r) { return String(r.ID) === id; })[0];
                if (row) cfg.onEdit(ed.getAttribute('data-edit'), row);
            }
        }

        return {
            uid: uid,
            /* rsThongTin[0] — genHTML_TongCacKhoanThu */
            set: function (info) {
                info = info || {};
                tiles.forEach(function (t) {
                    var v = info[t.col];
                    var el = host.querySelector('[data-v="' + t.k + '"]');
                    if (el) el.textContent = m.isNum(v) ? m.fmt(v) : '0';
                });
            },
            reset: function () { this.set({}); showTiles(); },
            detail: detail,
            reload: function () { if (cur) detail(cur.k); },
            /* loại đang mở trong hộp chi tiết ('' nếu hộp đóng) — màn dùng để đóng hộp trước khi mở biểu mẫu sửa trong trang
               rồi mở lại đúng hộp đó (detail(k)) khi biểu mẫu đóng */
            dangMo: function () { return cur && dlg && !dlg.closed ? cur.k : ''; },
            back: showTiles
        };
    };

    /* Trạng thái nợ/có ở đầu thông tin đối tượng (NOCO) */
    /* = viên chung ums.pat.noCo (đầu khung ums.pat.dauDoiTuong) — cùng một kiểu ở mọi màn */
    PK.noCo = function (info) {
        var d = info ? info.NOCO : undefined;
        return ums.pat.noCo(m.isNum(d) ? Number(d) : '', 'Chưa xác định');
    };

    /* =====================================================================
       Bảng các khoản (nợ chung / nợ riêng / thừa / thu hộ / nộp trước / POS)
       ---------------------------------------------------------------------
       Mỗi dòng giữ trạng thái trong JS; tổng tính trên trạng thái, không
       đọc ngược DOM như bản gốc.

       cfg = {
         soLuong: true       có cột Số lượng (thutienkhac); POS thì không
         canDoi: true        có cột "Cân đối" (nộp trước)
         max: true           không cho sửa số tiền vượt số gốc (khoản thừa → rút)
         pos: true           luật ô số tiền của POS: sửa khác 0 thì tự đánh dấu dòng,
                             về 0 thì bỏ đánh dấu
         heSo()              true = tổng đã chọn nhân số lượng (DONGIARATIEN)
         onChange(bang)      sau mỗi thay đổi (để cập nhật "Tổng tiền đã chọn")
         soTienTitle         tiêu đề cột số tiền
       }
       Dòng: { id, name, title, hk, dot, khoan, noiDung, soLuong, soTien, goc, checked, canDoi }
       ===================================================================== */
    PK.dong = function (r) {
        return {
            src: r,
            id: e(r.TAICHINH_CACKHOANTHU_ID),
            name: e(r.DAOTAO_THOIGIANDAOTAO_ID),
            title: String(r.HETHONGCHUNGTU_MA),      // title="' + aData.HETHONGCHUNGTU_MA + '" → "undefined"/"null" nếu thiếu
            hk: e(r.DAOTAO_THOIGIANDAOTAO),
            dot: e(r.DAOTAO_THOIGIANDAOTAO_DOT),
            khoan: e(r.TAICHINH_CACKHOANTHU_TEN),
            noiDung: e(r.NOIDUNG),
            soLuong: '1',
            soTien: m.fmt(r.SOTIEN),
            goc: m.fmt(r.SOTIEN),
            checked: false,
            canDoi: true
        };
    };

    PK.bang = function (host, cfg) {
        cfg = cfg || {};
        var rows = [];

        function valid(v) {
            var s = String(v).replace(/,/g, '');
            return s === '' || m.isNum(s);
        }

        /* countFloat(bảng, cột tiền, cột chọn[, cột hệ số]) */
        function tongChon() {
            var heSo = cfg.heSo ? cfg.heSo() : false;
            var t = 0;
            rows.forEach(function (r) {
                if (!r.checked) return;
                var v = m.cell(r.soTien);
                if (v === null) return;
                var k = 1;
                if (heSo && cfg.soLuong) {
                    k = m.cell(r.soLuong);
                    if (r.soLuong === '' || k === null) k = 1;   // xem ghi chú đầu tệp màn hình
                }
                t += k * v;
            });
            return m.floor2(t);
        }

        function tongTatCa() {
            var t = 0;
            rows.forEach(function (r) { var v = m.cell(r.soTien); if (v !== null) t += v; });
            return t;
        }

        /* Bảng dựng bằng ums.ui.table; dòng tổng là `sum` của cột số tiền
           (BO-CUC quy ước 3 — không tự dựng <tfoot>). */
        function draw() {
            var cols = [
                { title: 'Học kỳ', prop: 'hk', cls: 'is-center', width: '110px' },
                { title: 'Đợt', prop: 'dot', cls: 'is-center', width: '56px' },
                { title: 'Khoản thu', prop: 'khoan' },
                { title: 'Nội dung', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-f="noiDung" data-i="' + i + '" value="' + esc(r.noiDung) + '">';
                } }
            ];
            if (cfg.soLuong) {
                cols.push({ title: 'Số lượng', cls: 'is-center', width: '90px', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm pk-num" data-f="soLuong" data-i="' + i + '" inputmode="decimal" value="' + esc(r.soLuong) + '">';
                } });
            }
            cols.push({
                title: (typeof cfg.soTienTitle === 'function' ? cfg.soTienTitle() : cfg.soTienTitle) || 'Số tiền',
                cls: 'is-right', width: '160px',
                render: function (r, i) {
                    return '<input class="ums-input ums-input--sm pk-num" data-f="soTien" data-i="' + i + '" inputmode="decimal" value="' + esc(r.soTien) + '">';
                },
                sum: function () { return '<b data-z="tong">' + esc(m.tongStr(tongTatCa())) + '</b>'; }
            });
            cols.push({
                head: '<input type="checkbox" data-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r, i) {
                    return '<input type="checkbox" data-f="checked" data-i="' + i + '"' + (r.checked ? ' checked' : '') + '>';
                }
            });
            if (cfg.canDoi) {
                cols.push({ title: 'Cân đối', cls: 'is-center', width: '70px', render: function (r, i) {
                    return '<input type="checkbox" data-f="canDoi" data-i="' + i + '"' + (r.canDoi ? ' checked' : '') + '>';
                } });
            }
            ui.table({
                el: host, rows: rows, columns: cols,
                tableCls: 'ums-table--lined pk-bang', empty: cfg.empty || 'Không có khoản nào'
            });
            if (rows.length) {
                qa(host, 'tbody tr').forEach(function (tr, i) {
                    if (rows[i]) tr.classList.toggle('is-selected', rows[i].checked);
                });
            }
            syncAll();
        }

        function syncAll() {
            var all = host.querySelector('input[data-all]');
            if (all) all.checked = rows.length > 0 && rows.every(function (r) { return r.checked; });
        }

        function changed() {
            var t = host.querySelector('[data-z="tong"]');
            if (t) t.textContent = m.tongStr(tongTatCa());
            syncAll();
            if (cfg.onChange) cfg.onChange(api);
        }

        function rowOf(el) {
            var i = el.getAttribute('data-i');
            var tr = el.closest('tr');
            return (i !== null && tr && rows[Number(i)]) ? { tr: tr, r: rows[Number(i)] } : null;
        }

        /* checkSoTienInput (Core/systemroot.js:8296) + biến thể POS */
        host.addEventListener('input', function (ev) {
            var el = ev.target, f = el.getAttribute('data-f');
            if (!f || f === 'checked' || f === 'canDoi') return;
            var x = rowOf(el);
            if (!x) return;
            if (f === 'noiDung') { x.r.noiDung = el.value; return; }

            var v = el.value;
            var last = v.charAt(v.length - 1);
            if (last === '.' || last === ',') return;          // đang gõ dở phần thập phân
            if (!valid(v)) { el.value = x.r[f]; return; }        // ký tự lạ → trả lại giá trị hợp lệ trước đó
            var s = v.replace(/,/g, '');
            if (f === 'soTien' && cfg.max && s !== '' && parseFloat(s) > m.parse(x.r.goc)) {
                el.value = x.r[f];                              // rút không được quá số gốc
                ui.toast('Không được vượt số tiền gốc ' + x.r.goc, 'warn');
                return;
            }
            var out = s === '' ? '' : m.fmt(s);
            el.value = out;
            x.r[f] = out;
            if (f === 'soTien' && cfg.pos) {
                var n = m.cell(out);
                x.r.checked = !!n;
                x.tr.classList.toggle('is-selected', x.r.checked);
                var cb = x.tr.querySelector('input[data-f="checked"]');
                if (cb) cb.checked = x.r.checked;
            }
            changed();
        });

        host.addEventListener('change', function (ev) {
            var el = ev.target;
            if (el.hasAttribute('data-all')) {
                rows.forEach(function (r) { r.checked = el.checked; });
                qa(host, 'tbody tr').forEach(function (tr) {
                    tr.classList.toggle('is-selected', el.checked);
                    var cb = tr.querySelector('input[data-f="checked"]');
                    if (cb) cb.checked = el.checked;
                });
                return changed();
            }
            var f = el.getAttribute('data-f');
            var x = rowOf(el);
            if (!x) return;
            if (f === 'checked') {
                x.r.checked = el.checked;
                x.tr.classList.toggle('is-selected', el.checked);
                changed();
            } else if (f === 'canDoi') {
                x.r.canDoi = el.checked;
            }
        });

        var api = {
            get rows() { return rows; },
            set: function (list) { rows = list || []; draw(); changed(); },
            add: function (r) { rows.push(r); draw(); changed(); },
            remove: function (pred) { rows = rows.filter(function (r) { return !pred(r); }); draw(); changed(); },
            clear: function () { rows = []; draw(); changed(); },
            checked: function () { return rows.filter(function (r) { return r.checked; }); },
            count: function () { return rows.filter(function (r) { return r.checked; }).length; },
            /* quickSelectAll_Phieu: pred(r) → true thì đánh dấu */
            selectAll: function (pred) {
                rows.forEach(function (r) { if (!pred || pred(r)) r.checked = true; });
                draw(); changed();
            },
            tongChon: tongChon,
            redraw: draw
        };
        draw();
        return api;
    };

    /* =====================================================================
       Phiếu viết — bản nháp trước khi lưu
       ---------------------------------------------------------------------
       Thay mẫu Upload/Files/PrintTemplate/Edit_DHCNTTTN_BIENLAITHU_2018.html /
       Edit_DHCNTTTN_BIENLAIRUT_2018.html (mẫu chỉ để xem, không phải mẫu in).

       cfg = {
         rut: bool              chữ "rút" thay "thu", không có ô hình thức / loại tiền
         tenPhieu               tiêu đề (strLoaiChungTu của bản gốc)
         info: { hoTen, ma, ngaySinh, diaChi, maSoThue, lop, nganh, khoa }
         ngay: [dd, mm, yyyy]
         dvt: bool              cột Đơn vị (ô chọn TAICHINH.DVT từng dòng)
         chonHinhThuc: bool     ô Hình thức thu + Loại tiền tệ (QLTC.HTTHU, QLTC.LTT)
         anSoLuong: bool        hiện ô "Không hiển thị số lượng và đơn giá"
         dong: [{ id, name, khoan, noiDung, soLuong, donGia, thanhTien, canDoi }]
       }
       Trả về api.values() → { dong:[…+ dvtId, dvtTen], hinhThuc:{id,ma,ten}, loaiTien:{id,ten}, anSoLuong }
       ===================================================================== */
    PK.nhap = function (host, cfg) {
        var info = cfg.info || {};
        var ngay = cfg.ngay || [];
        var rut = !!cfg.rut;
        var dong = cfg.dong || [];
        var dvtOpts = null, htRows = [], lttRows = [];

        var tong = 0;
        dong.forEach(function (d) { var v = m.cell(m.fmt(d.thanhTien)); if (v !== null) tong += v; });
        var tongS = m.tongStr(tong);
        var slTong = 0;
        dong.forEach(function (d) { var v = m.cell(d.soLuong); if (v !== null) slTong += v; });

        function kv(k, v) { return '<div class="pk-kv"><span class="pk-kv__k">' + esc(k) + '</span><span class="pk-kv__v">' + esc(v) + '</span></div>'; }

        var h = '<div class="pk-nhap">' +
            '<div class="pk-nhap__title">' + esc(cfg.tenPhieu || (rut ? 'BIÊN LAI RÚT TIỀN' : 'CHỨNG TỪ ĐỂ IN')) + '</div>' +
            '<div class="pk-nhap__date">Ngày ' + esc(ngay[0]) + ' tháng ' + esc(ngay[1]) + ' năm ' + esc(ngay[2]) + '</div>' +
            '<div class="ums-grid ums-grid--3 pk-nhap__info">' +
            kv('Họ tên', info.hoTen) + kv('Mã', info.ma) + kv('Ngày sinh', info.ngaySinh) +
            kv('Địa chỉ', info.diaChi) + kv('Mã số thuế', info.maSoThue) + kv('Lớp', info.lop) +
            kv('Ngành', info.nganh) + kv('Khoá', info.khoa) +
            '</div>';
        if (!rut && cfg.chonHinhThuc) {
            h += '<div class="ums-grid ums-grid--3 ums-u-mt-4">' +
                ui.field('Hình thức thu', '<select class="ums-select" data-z="ht"></select>') +
                ui.field('Loại tiền tệ', '<select class="ums-select" data-z="ltt"></select>') +
                (cfg.anSoLuong ? '<div class="ums-field"><label class="ums-field__label">&nbsp;</label><label class="ums-check"><input type="checkbox" data-z="ansl"> Không hiển thị số lượng và đơn giá</label></div>' : '') +
                '</div>';
        } else if (rut) {
            h += '<div class="ums-u-mt-4 ums-u-bold">Nội dung rút:</div>';
        }
        h += '<div class="ums-u-mt-4" data-z="tbl"></div>' +
            '<div class="pk-nhap__sum">' +
            '<div><b>' + (rut ? 'Số tiền rút' : 'Số tiền thu') + ':</b> <span class="pk-nhap__money">' + esc(tongS) + '</span> đồng</div>' +
            '<div><b>(Viết bằng chữ):</b> <i data-z="chu">' + esc(ums.phieu.bangChu(tongS.replace(/,/g, ''))) + '</i></div>' +
            '</div>' +
            '<div class="pk-nhap__sign"><div><b>' + (rut ? 'Người nhận tiền' : 'Người nộp tiền') + '</b><br><i>(Ký, ghi rõ họ tên)</i></div>' +
            '<div><b>' + (rut ? 'Người lập phiếu' : 'Người thu tiền') + '</b><br><i>(Ký, ghi rõ họ tên)</i></div></div>' +
            '</div>';
        host.innerHTML = h;

        /* Bảng dòng phiếu — ums.ui.table, dòng tổng bằng `sum` của cột */
        var colsNhap = [
            { title: rut ? 'Khoản rút' : 'Khoản thu', prop: 'khoan' },
            { title: 'Nội dung', prop: 'noiDung' }
        ];
        if (cfg.dvt) {
            colsNhap.push({ title: 'Đơn vị', width: '170px', render: function (d, i) {
                return '<select class="ums-select ums-input--sm" data-dvt="' + i + '"></select>';
            } });
        }
        colsNhap.push(
            { title: 'Số lượng', cls: 'is-center', width: '90px', prop: 'soLuong',
              sum: function () { return '<b>' + esc(m.tongStr(slTong)) + '</b>'; } },
            { title: 'Đơn giá', cls: 'is-right', width: '150px', prop: 'donGia' },
            { title: 'Thành tiền', cls: 'is-right', width: '160px',
              render: function (d) { return esc(m.fmt(d.thanhTien)); },
              sum: function () { return '<b>' + esc(tongS) + '</b>'; } }
        );
        ui.table({ el: host.querySelector('[data-z="tbl"]'), rows: dong, columns: colsNhap, tableCls: 'ums-table--lined' });

        var elHT = host.querySelector('[data-z="ht"]');
        var elLTT = host.querySelector('[data-z="ltt"]');

        /* TC_ThongTinChung/DocSoThanhChu — bản gốc gọi mỗi khi đổi loại tiền
           (kể cả lần tự chọn VND lúc mở phiếu), kết quả thay chữ viết bằng
           chữ. Bản gốc gửi nhầm TỔNG CỘT ĐƠN GIÁ (tfoot td:eq(5)); ở đây gửi
           tổng thành tiền — chính là số in trên phiếu. */
        function docSo() {
            if (!elLTT) return;
            var opt = elLTT.options[elLTT.selectedIndex];
            var t = opt ? opt.text.trim() : '';
            if (!t || !elLTT.value) return;
            if (t === 'VND') t = 'đồng';
            ums.api.call({
                action: 'TC_ThongTinChung/DocSoThanhChu', method: 'GET', silent: true,
                versionAPI: 'v1.0', dSoTien: tongS.replace(/,/g, ''), strLoaiTien: t
            }).then(function (r) {
                if (has(r.data) && typeof r.data === 'string') host.querySelector('[data-z="chu"]').textContent = r.data;
            }).catch(function () { /* bản gốc chỉ ghi log */ });
        }

        var ready = [];
        if (elHT) {
            ready.push(PK.dmList('QLTC.HTTHU').then(function (rows) {
                htRows = rows;
                PK.fillSelect(elHT, rows, { code: 'THONGTIN1', avatar: 'MA' });
                // cbGenCombo_HinhThucThu: chưa có giá trị thì chọn mục có MA = "TM" (tiền mặt)
                // (ô không có mục rỗng thì đã tự đứng ở dòng đầu — bản gốc cũng vậy)
                if (!elHT.value) {
                    var tm = rows.filter(function (x) { return x.MA === 'TM'; })[0];
                    if (tm) elHT.value = tm.ID;
                }
                ui.select2(elHT, { placeholder: 'Hình thức thu' });
            }));
        }
        if (elLTT) {
            ready.push(PK.dmList('QLTC.LTT').then(function (rows) {
                lttRows = rows;
                PK.fillSelect(elLTT, rows, { code: 'MA', avatar: 'MA' });
                var vnd = rows.filter(function (x) { return x.MA === 'VND'; })[0];
                if (vnd) elLTT.value = vnd.ID;
                ui.select2(elLTT, { placeholder: 'Loại tiền tệ' });
                if (global.jQuery) jQuery(elLTT).on('change', docSo); else elLTT.addEventListener('change', docSo);
                docSo();
            }));
        }
        if (cfg.dvt && dong.length) {
            ready.push(PK.dmList('TAICHINH.DVT').then(function (rows) {
                dvtOpts = rows;
                qa(host, 'select[data-dvt]').forEach(function (s) {
                    PK.fillSelect(s, rows, { code: 'MA', avatar: 'MA' });
                    ui.select2(s, { placeholder: 'Đơn vị' });
                });
            }));
        }
        ready = Promise.all(ready).catch(function (err) { ums.api.handle(err, 'nạp danh mục phiếu'); });

        function selOpt(sel) { return sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex] : null; }

        return {
            ready: ready,
            tong: tong,
            tongStr: tongS,
            values: function () {
                var out = { dong: [], hinhThuc: { id: '', ma: undefined, ten: '' }, loaiTien: { id: '', ten: '' }, anSoLuong: false };
                dong.forEach(function (d, i) {
                    var c = {}; Object.keys(d).forEach(function (k) { c[k] = d[k]; });
                    var s = host.querySelector('select[data-dvt="' + i + '"]');
                    c.dvtId = s ? s.value : '';
                    var o = selOpt(s);
                    c.dvtTen = c.dvtId !== '' && o ? o.text.trim() : '';
                    out.dong.push(c);
                });
                if (elHT) {
                    var o = selOpt(elHT);
                    var row = htRows.filter(function (x) { return String(x.ID) === elHT.value; })[0];
                    out.hinhThuc.id = elHT.value;
                    out.hinhThuc.ma = row ? row.MA : undefined;
                    /* strHinhThucThu_TEN: thuộc tính name của option (= THONGTIN1) nếu
                       khác undefined/"undefined"/"null", ngược lại là chữ hiển thị */
                    var code = row ? String(row.THONGTIN1) : 'undefined';
                    out.hinhThuc.ten = (code !== 'undefined' && code !== 'null') ? code : (o ? o.text.trim() : '');
                }
                if (elLTT) {
                    var ol = selOpt(elLTT);
                    out.loaiTien.id = elLTT.value;
                    out.loaiTien.ten = elLTT.value !== '' && ol ? ol.text.trim() : '';
                }
                var an = host.querySelector('[data-z="ansl"]');
                out.anSoLuong = !!(an && an.checked);
                return out;
            }
        };
    };

    /* Ngày hôm nay dạng [dd, mm, yyyy] — edu.util.thisDay/thisMonth/thisYear */
    PK.homNay = function () {
        var d = new Date();
        function p(n) { return n < 10 ? '0' + n : String(n); }
        return [p(d.getDate()), p(d.getMonth() + 1), String(d.getFullYear())];
    };

    /* Loại chứng từ theo HETHONGCHUNGTU_MA — genHTML_NoiDung_BienLai */
    PK.loaiChungTu = function (ma, thu, bangPos) {
        if (bangPos) {
            switch (ma) {
                case 'TAICHINH_HETHONGPHIEUTHU': return 'PHIẾU THU TIỀN';
                case 'TAICHINH_HOADON': return 'HÓA ĐƠN BÁN HÀNG';
                case 'TAICHINH_HETHONGBIENLAI': return 'BIÊN LAI THU TIỀN';
                default: return thu ? 'BIÊN LAI THU TIỀN' : 'BIÊN LAI RÚT TIỀN';
            }
        }
        switch (ma) {
            case 'TAICHINH_HETHONGPHIEUTHU': return 'phiếu thu tiền';
            case 'TAICHINH_HOADON': return 'hóa đơn bán hàng';
            case 'TAICHINH_HETHONGBIENLAI': return 'CHỨNG TỪ ĐỂ IN';
            case 'TAICHINH_HETHONGPHIEUTHURUT': return 'biên lai rút tiền';
            default: return thu ? 'CHỨNG TỪ ĐỂ IN' : 'biên lai rút tiền';
        }
    };

    /* Kiểm tra các dòng đã chọn cùng hệ thống chứng từ (title của ô chọn) */
    PK.cungHeThong = function (list) {
        if (!list.length) { ui.toast('Vui lòng chọn khoản thu trước khi viết phiếu!', 'warn'); return null; }
        var ma = list[0].title;
        for (var i = 0; i < list.length; i++) {
            if (list[i].title !== ma) {
                ui.toast('Mã hệ thống chứng từ khác nhau. Vui lòng kiểm tra lại! ("' + ma + '" : "' + list[i].title + '")', 'warn');
                return null;
            }
        }
        return ma;
    };

})(window);
