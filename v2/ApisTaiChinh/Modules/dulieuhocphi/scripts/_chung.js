/* =========================================================================
   Dùng chung cho nhóm màn "tính học phí" (module dulieuhocphi) và màn
   giahanthu/kehoach. Nạp bằng thẻ <script> TRƯỚC tệp màn hình.

       ums.hocphi.*

   Phần khung giao diện KHÔNG viết lại ở đây (xem _v2/BO-CUC.md):
       H.fill → ums.pat.fill · H.val/H.vals → ums.pat.val
       H.s2   → ums.ui.enhance (select2 + lịch cho cả vùng, kể cả trong <dialog>)

   Gồm những thứ bản gốc chép tay lặp lại ở từng tệp:
     · đổ ô chọn, đọc giá trị (ô chọn nhiều → "a,b" như
       edu.util.getValById / getValCombo với ô multiple)
     · các nguồn dữ liệu dùng lặp: thời gian đào tạo (CM_ThoiGianDaoTao),
       khoản thu (TC_KhoanThu/LayDanhSach), khoản theo nghiệp vụ
       (TC_TinhTien), kế hoạch đăng ký theo thời gian (DKH_KeHoachDangKy),
       sinh viên theo lớp (TC_NguoiHoc_HoSo), trạng thái SV (CM_DanhMucDuLieu)
     · nhóm ô đánh dấu "Chọn trạng thái sinh viên" (genList_TrangThaiSV)
     · cột bảng kết quả tính phí: theo tín chỉ, theo niên chế, chi tiết
     · hộp chọn sinh viên — bản viết lại của edu.extend.genModal_SinhVien
       (Core/systemextend.js:918) + getList_SinhVienMD (LayDanhSachHoSoNhieuNganh)

   Tham số, action, tên cột chép nguyên từ bản gốc (số dòng ghi cạnh hàm).
   Không gắn sự kiện lên document/window.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var H = ums.hocphi = ums.hocphi || {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    H.e = e;

    /* ---------- Gọi API trả mảng dòng ------------------------------------ */
    H.rows = function (call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    };

    /* ---------- Ô chọn ---------------------------------------------------- */
    /** Markup một ô chọn có nhãn nằm trái (bố cục "quy trình" của bản gốc) */
    H.selField = function (id, label, opts) {
        opts = opts || {};
        // data-ph: chữ gợi ý của select2, cần cho ô chọn NHIỀU (không có mục đầu)
        var ph = opts.head || ('-- ' + label + ' --');
        return ui.field(label,
            '<select class="ums-select" id="' + esc(id) + '"' + (opts.multiple ? ' multiple' : '') +
            ' data-ph="' + esc(ph) + '">' +
            (opts.multiple ? '' : '<option value="">' + esc(ph) + '</option>') +
            '</select>', { inline: true, labelWidth: opts.labelWidth || '170px', required: opts.required });
    };

    function node(el) { return typeof el === 'string' ? document.getElementById(el) : el; }

    /** Đổ danh sách vào ô chọn — bố cục chung ums.pat.fill (loadToCombo_data) */
    H.fill = function (el, rows, o) {
        el = node(el);
        if (!el) return;
        o = o || {};
        ums.pat.fill(el, rows, { id: o.id, name: o.name, head: o.head });
    };

    /** Giá trị như edu.util.getValById: ô chọn nhiều → "a,b", ô khác → chuỗi đã trim */
    H.val = function (el) { return ums.pat.val(node(el)); };

    H.vals = function (el) { var v = H.val(el); return v ? v.split(',') : []; };

    /** Gắn select2 + lịch cho mọi ô trong vùng (ô chọn nhiều tự gom một dòng) */
    H.s2 = function (root) { ui.enhance(root); };

    /** Nghe người dùng chọn / bỏ chọn một mục. Bản gốc dùng
        $(...).on('select2:select'); thêm 'select2:clear' để xoá ô cũng nạp lại
        ô phụ thuộc. KHÔNG nghe 'change': H.fill đổ lại danh sách cũng bắn
        'change' trên ô chọn nhiều, nghe 'change' sẽ gọi API thừa lúc mở màn. */
    H.on = function (el, fn) {
        el = node(el);
        if (!el) return;
        if (window.jQuery) jQuery(el).on('select2:select select2:clear', fn); else el.addEventListener('change', fn);
    };

    /* ---------- Nguồn dữ liệu -------------------------------------------- */

    /* getList_ThoiGianDaoTao của các màn dulieuhocphi — KHÁC ums.ref.thoiGianDaoTao */
    H.thoiGianDaoTao = function () {
        return H.rows({
            action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            method: 'GET',
            versionAPI: 'v1.0',
            strDAOTAO_Nam_Id: '',
            strNguoiThucHien_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000
        });
    };

    /* getList_LoaiKhoan / getList_DMLKT — toàn bộ khoản thu */
    H.khoanThu = function () {
        return H.rows({
            action: 'TC_KhoanThu/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000,
            strNhomCacKhoanThu_Id: '',
            strCanBoQuanLy_Id: '',
            strNguoiThucHien_Id: ''
        });
    };

    /* getList_LoaiKhoan của tinhhocphi / chuyendulieuketoan — khoản theo nghiệp vụ.
       Bản gốc để 'type': 'GET' NGAY TRONG dữ liệu gửi đi → vẫn gửi y như vậy. */
    H.khoanTheoNghiepVu = function (strNghiepVuApDung_Id) {
        return H.rows({
            action: 'TC_TinhTien/LayDSKhoanPhiTheoNghiepVu',
            method: 'GET',
            type: 'GET',
            strNghiepVuApDung_Id: strNghiepVuApDung_Id,
            strNguoiThucHien_Id: ''
        });
    };

    /* getList_KeHoachDangKy */
    H.keHoachDangKy = function (strDaoTao_ThoiGianDaoTao_Id) {
        return H.rows({
            action: 'DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian',
            method: 'GET',
            type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: strDaoTao_ThoiGianDaoTao_Id,
            strNguoiThucHien_Id: ''
        });
    };

    /* getList_LopQuanLy(strKhoaDaoTao_Id, strToChucCT_Id) → edu.system.getList_LopQuanLy */
    H.lopQuanLy = function (strKhoaDaoTao_Id, strToChucCT_Id) {
        return ums.ref.lopQuanLy({
            strCoSoDaoTao_Id: '',
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: '',
            strLoaiLop_Id: '',
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: '',
            strTuKhoa: '',
            pageIndex: 1,
            pageSize: 10000
        });
    };

    /* getList_SinhVien (tinhhocphi / chuyendulieuketoan): sinh viên của lớp đang chọn */
    H.sinhVienTheoLop = function (o) {
        return H.rows({
            action: 'TC_NguoiHoc_HoSo/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            pageIndex: 1,
            pageSize: 100000,
            strChuongTrinh_Id: '',
            strKhoaDaoTao_Id: o.strKhoaDaoTao_Id,
            strHeDaoTao_Id: o.strHeDaoTao_Id,
            strLopHoc_Id: o.strLopHoc_Id,
            strTuKhoa: '',
            strTrangThaiNguoiHoc_Id: o.strTrangThaiNguoiHoc_Id,
            strQLSV_NguoiHoc_Id: ''
        });
    };

    /* ---------- Nhóm ô "Chọn trạng thái sinh viên" -----------------------
       Cách vẽ là của tầng chung (ums.pat.checks); ở đây chỉ còn NGUỒN.
       Nguồn này là getList_TrangThaiSV của bản gốc → CM_DanhMucDuLieu/
       LayDanhSach; hộp chọn sinh viên lấy nguồn KHÁC (CMS_DanhMucThuocTinh,
       xem ums.pat.pickSinhVienNganh). Mặc định đánh dấu tất cả; trả { ids() }
       như edu.extend.getCheckedCheckBoxByClassName. */
    H.trangThai = function (host) {
        return ums.pat.checks(host, H.rows({
            action: 'CM_DanhMucDuLieu/LayDanhSach',
            method: 'GET',
            versionAPI: 'v1.0',
            strMaBangDanhMuc: 'QLSV.TRANGTHAI'
        }), { cols: 3, what: 'trạng thái sinh viên' });
    };

    /* ---------- Bảng chọn sinh viên có ô đánh dấu (tblSinhVien) ----------- */
    H.pickTable = function (host, rows, cols) {
        var picked = {};
        cols = cols.concat([{
            head: '<input type="checkbox" data-pk="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-pk="one" value="' + esc(r.ID) + '">'; }
        }]);
        ui.table({ el: host, rows: rows, columns: cols, empty: 'Chưa có sinh viên — chọn lớp để nạp danh sách' });
        host.onchange = function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('input[data-pk]')) return;
            if (t.getAttribute('data-pk') === 'all') {
                Array.prototype.forEach.call(host.querySelectorAll('input[data-pk="one"]'), function (x) { x.checked = t.checked; });
            }
            Array.prototype.forEach.call(host.querySelectorAll('input[data-pk="one"]'), function (x) {
                var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked);
            });
        };
        return {
            ids: function () {
                return Array.prototype.filter.call(host.querySelectorAll('input[data-pk="one"]'), function (x) { return x.checked; })
                    .map(function (x) { return x.value; });
            }
        };
    };

    /* ---------- Số tiền --------------------------------------------------- */
    function num(v) { var n = Number(String(v === null || v === undefined ? '' : v).replace(/[^\d.-]/g, '')); return isNaN(n) ? 0 : n; }
    H.num = num;
    function money(p) { return { prop: p, cls: 'is-right is-nowrap', render: function (r) { return ui.money(r[p]); }, sum: true, sumProp: p }; }
    function plain(p, cls) { return { prop: p, cls: cls || '' }; }
    function titled(t, c) { c.title = t; return c; }

    function hoTen(r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); }

    /** Cột bảng "Theo tín chỉ" (genTable_TinChi). onDetail != null → mã số là nút mở chi tiết.
        Dòng tổng: cột [8,9,10,11,12,14,15] của bản gốc = số HP, số TC, học đi,
        học lại, nâng điểm, số tiền miễn, số phải nộp (không cộng % miễn). */
    H.colsTinChi = function (detailAttr) {
        return [
            titled('Mã số', { cls: 'is-nowrap', render: function (r) {
                return detailAttr
                    ? '<a href="javascript:void(0)" ' + detailAttr + '="' + esc(r.QLSV_NGUOIHOC_ID) + '" title="Xem chi tiết">' + esc(r.QLSV_NGUOIHOC_MASO) + '</a>'
                    : esc(r.QLSV_NGUOIHOC_MASO);
            } }),
            titled('Họ tên', { render: hoTen, cls: 'is-nowrap' }),
            titled('Ngày sinh', plain('QLSV_NGUOIHOC_NGAYSINH', 'is-center is-nowrap')),
            titled('Tình trạng', plain('QLSV_NGUOIHOC_TINHTRANG', 'is-center')),
            titled('Lớp', plain('QLSV_NGUOIHOC_LOP', 'is-nowrap')),
            titled('Chương trình', plain('QLSV_NGUOIHOC_CHUONGTRINH')),
            titled('Khóa', plain('QLSV_NGUOIHOC_KHOAHOC', 'is-nowrap')),
            titled('Số học phần', { prop: 'SOHOCPHAN', cls: 'is-center', sum: true }),
            titled('Số tín chỉ', { prop: 'SOTINCHI', cls: 'is-center', sum: true }),
            titled('Học đi', money('SOTIEN_HOCDI')),
            titled('Học lại', money('SOTIEN_HOCLAI')),
            titled('Học nâng điểm', money('SOTIEN_HOCNANGDIEM')),
            titled('Phần trăm miễn', plain('PHANTRAMMIEN', 'is-center')),
            titled('Số tiền miễn', money('SOTIENMIEN')),
            titled('Số phải nộp', money('SOTIENPHAINOP'))
        ];
    };

    /** Cột bảng "Theo niên chế" (genTable_NienChe). coDinh = true: có cột
        SOTIENMIENCODINH (bản tinhhocphi). */
    H.colsNienChe = function (coDinh) {
        var c = [
            titled('Mã số', plain('QLSV_NGUOIHOC_MASO', 'is-nowrap')),
            titled('Họ tên', { render: hoTen, cls: 'is-nowrap' }),
            titled('Ngày sinh', plain('QLSV_NGUOIHOC_NGAYSINH', 'is-center is-nowrap')),
            titled('Tình trạng', plain('QLSV_NGUOIHOC_TINHTRANG', 'is-center')),
            titled('Lớp', plain('QLSV_NGUOIHOC_LOP', 'is-nowrap')),
            titled('Chương trình', plain('QLSV_NGUOIHOC_CHUONGTRINH')),
            titled('Khóa', plain('QLSV_NGUOIHOC_KHOAHOC', 'is-nowrap')),
            titled('Số tiền', money('SOTIEN')),
            titled('Phần trăm miễn', plain('PHANTRAMMIEN', 'is-center')),
            titled(coDinh ? 'Số tiền miễn %' : 'Số tiền miễn', money('SOTIENMIEN'))
        ];
        if (coDinh) c.push(titled('Số tiền miễn cố định', money('SOTIENMIENCODINH')));
        c.push(titled('Số phải nộp', money('SOTIENPHAINOP')));
        return c;
    };

    /** Cột bảng chi tiết học phí một sinh viên (genDeTail_TinChi).
        Số phải nộp = parseInt(SOTIEN) − parseInt(SOTIENMIEN), đúng công thức
        bản gốc; ô trống tính là 0 (bản gốc ra NaN). */
    H.phaiNopChiTiet = function (r) {
        var a = parseInt(r.SOTIEN, 10), b = parseInt(r.SOTIENMIEN, 10);
        return (isNaN(a) ? 0 : a) - (isNaN(b) ? 0 : b);
    };
    H.colsChiTiet = function () {
        return [
            titled('Mã học phần', plain('DAOTAO_HOCPHAN_MA', 'is-nowrap')),
            titled('Tên học phần', plain('DAOTAO_HOCPHAN_TEN')),
            titled('Số tín chỉ', plain('DAOTAO_HOCPHAN_TINCHI', 'is-center')),
            titled('Số tiền', money('SOTIEN')),
            titled('Kiểu học', plain('KIEUHOC_TEN', 'is-center')),
            titled('Phần trăm miễn', plain('PHANTRAMMIEN', 'is-center')),
            titled('Số tiền miễn', money('SOTIENMIEN')),
            titled('Số phải nộp', {
                cls: 'is-right is-nowrap',
                render: function (r) { return ui.money(H.phaiNopChiTiet(r)); },
                sum: function (rows) { return '<b>' + ui.money(rows.reduce(function (a, r) { return a + H.phaiNopChiTiet(r); }, 0)) + '</b>'; }
            })
        ];
    };

    /* ---------- Thẻ tab --------------------------------------------------- */
    /** tabs = [{ key, text, count: true }]. Trả { set(key), count(key, n) } */
    H.tabs = function (nav, tabs, onSwitch) {
        nav.innerHTML = tabs.map(function (t, i) {
            return '<a class="ums-tabs__item' + (i === 0 ? ' is-active' : '') + '" href="javascript:void(0)" data-tab="' + esc(t.key) + '">' +
                esc(t.text) + (t.count ? ' <span class="ums-u-faint ums-u-fz13" data-tabn="' + esc(t.key) + '"></span>' : '') + '</a>';
        }).join('');
        function set(key) {
            Array.prototype.forEach.call(nav.querySelectorAll('.ums-tabs__item'), function (a) {
                a.classList.toggle('is-active', a.getAttribute('data-tab') === key);
            });
            if (onSwitch) onSwitch(key);
        }
        nav.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]');
            if (a && nav.contains(a)) set(a.getAttribute('data-tab'));
        });
        return {
            set: set,
            count: function (key, n) { var b = nav.querySelector('[data-tabn="' + key + '"]'); if (b) b.textContent = n === undefined || n === null ? '' : '(' + n + ')'; }
        };
    };

    /* Hộp chọn sinh viên (nhiều ngành) — nay ở tầng chung:
       ums.pat.pickSinhVienNganh. Giữ tên gọi cũ cho các màn đang dùng. */
    H.pickSinhVien = function (opts) { return ums.pat.pickSinhVienNganh(opts); };

    /* ---------- Khung kết quả hai tab + chi tiết (chottinhphi, chuyendulieuketoan)
       cfg = {
           host,  main, detail         vùng chứa bảng; vùng "main" và "detail" để đổi qua lại
           tinChi()  → call             lời gọi danh sách theo tín chỉ
           nienChe() → call             lời gọi danh sách theo niên chế
           chiTiet(id) → call           lời gọi chi tiết một sinh viên
           coDinh                       có cột "Số tiền miễn cố định"
       }
       Trả { loadTinChi(), loadNienChe() }. */
    H.mountKetQua = function (cfg) {
        var host = cfg.host, detail = cfg.detail;
        host.innerHTML =
            '<div class="ums-panel">' +
                '<nav class="ums-tabs" data-kq="tabs"></nav>' +
                '<div data-kqp="tc">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-ol"></i> Kết quả theo tín chỉ</div>' +
                        '<div class="ums-panel__tools"><button type="button" class="ums-iconbtn" data-kqa="tc" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button></div></div>' +
                    '<div class="ums-panel__body ums-panel__body--flush" data-kq="tc"></div>' +
                '</div>' +
                '<div data-kqp="nc" hidden>' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-ol"></i> Kết quả theo niên chế</div>' +
                        '<div class="ums-panel__tools"><button type="button" class="ums-iconbtn" data-kqa="nc" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button></div></div>' +
                    '<div class="ums-panel__body ums-panel__body--flush" data-kq="nc"></div>' +
                '</div>' +
            '</div>';
        detail.innerHTML =
            '<div class="ums-panel">' +
                '<div class="ums-panel__head">' +
                    '<div class="ums-panel__title"><i class="fa-light fa-receipt"></i> Chi tiết học phí <span class="ums-u-faint ums-u-fz13" data-kq="who"></span></div>' +
                    '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-kqa': 'back' } }) + '</div>' +
                '</div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-kq="dt"></div>' +
            '</div>';
        function k(n, el) { return (el || host).querySelector('[data-kq="' + n + '"]'); }
        var tabs = H.tabs(k('tabs'), [
            { key: 'tc', text: '1) Theo tín chỉ', count: true },
            { key: 'nc', text: '2) Theo niên chế', count: true }
        ], function (key) {
            Array.prototype.forEach.call(host.querySelectorAll('[data-kqp]'), function (p) { p.hidden = p.getAttribute('data-kqp') !== key; });
        });
        var hint = 'Chọn điều kiện rồi bấm "Xem danh sách"';
        ui.table({ el: k('tc'), rows: [], columns: H.colsTinChi(), empty: hint });
        ui.table({ el: k('nc'), rows: [], columns: H.colsNienChe(cfg.coDinh), empty: hint });

        function load(key, call, cols, where) {
            var el = k(key);
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(call).then(function (r) {
                tabs.count(key, r.pager);
                ui.table({ el: el, rows: Array.isArray(r.data) ? r.data : [], columns: cols, tableCls: 'ums-table--lined ums-table--tight' });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, where); });
        }
        var api = {
            loadTinChi: function () { return load('tc', cfg.tinChi(), H.colsTinChi('data-kqd'), 'kết quả theo tín chỉ'); },
            loadNienChe: function () { return load('nc', cfg.nienChe(), H.colsNienChe(cfg.coDinh), 'kết quả theo niên chế'); }
        };
        function openDetail(id, label) {
            k('who', detail).textContent = label ? '— ' + label : '';
            var el = k('dt', detail);
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ui.swap(cfg.main, detail);
            ums.api.call(cfg.chiTiet(id)).then(function (r) {
                ui.table({ el: el, rows: Array.isArray(r.data) ? r.data : [], columns: H.colsChiTiet() });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết học phí'); });
        }
        host.addEventListener('click', function (ev) {
            var d = ev.target.closest('[data-kqd]');
            if (d && host.contains(d)) { ev.preventDefault(); return openDetail(d.getAttribute('data-kqd'), d.textContent); }
            var b = ev.target.closest('[data-kqa]');
            if (!b || !host.contains(b)) return;
            if (b.getAttribute('data-kqa') === 'tc') api.loadTinChi();
            else if (b.getAttribute('data-kqa') === 'nc') api.loadNienChe();
        });
        detail.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-kqa="back"]');
            if (b) ui.swap(detail, cfg.main);
        });
        return api;
    };

    /* ---------- Hộp xác nhận rồi chạy hàng loạt --------------------------- */
    /** Chạy calls bằng ums.ui.batch, xong gọi then(). Không có dòng nào thì cảnh báo. */
    H.runAll = function (calls, title, done) {
        if (!calls.length) return Promise.resolve();
        return ui.batch(calls, { title: title, show: true }).then(function (r) { if (done) done(r); return r; });
    };

})();
