/* =========================================================================
   Phiếu rút tiền — rút tiền dư của sinh viên theo lô
   Bản gốc: ApisTaiChinh/Modules/phieurut/html/ruttien.html + scripts/ruttien.js (RutTien)
   Dùng chung: phieuthu/scripts/_chung_khac.js; xem/in: ums.phieu (assets/js/phieu.js)
   (đọc số thành chữ nay dùng ums.ui.docSo ở tầng chung)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     TC_KhoanThu/LayDanhSach (GET)            danh sách khoản rút (ô đánh dấu)
     CM_DanhMucDuLieu/LayDanhSach (GET)       QLSV.TRANGTHAI
     KHCT_NamNhapHoc/LayDanhSach (GET)        năm nhập học
     KHCT_KhoaQuanLy/LayDanhSach (GET)        khoa quản lý
     ums.ref.* (= edu.system.getList_HeDaoTao / KhoaDaoTao / ChuongTrinh / LopQuanLy / ThoiGianDaoTao)
     TC_NguoiHoc_DuTien/LayDanhSach (POST, phân trang)   sinh viên dư tiền
     TC_TaiChinh_Rut/ThemMoi                  mỗi sinh viên một chứng từ rút
     TC_PhieuThu/LayTTPhieuThu_Rut (qua ums.phieu.viewer, loại BIENLAIRUT, in theo lô)
     Báo cáo: ums.report.mount (edu.system.getList_MauImport)

   PHÉP TÍNH TIỀN
     · Số tiền rút mỗi dòng = ô số tiền (mặc định SOTIEN của dòng dư).
     · Tổng mỗi sinh viên ở danh sách chứng từ = Σ số tiền các dòng ĐÃ CHỌN
       của sinh viên đó.
     · Lưu: bỏ dòng có SOTIEN GỐC = 0 (bản gốc so x.SOTIEN == 0, không phải
       số đã sửa); strTaiChinh_SoTien_s = số tiền từng dòng nối dấu phẩy.

   KHÁC BẢN GỐC — sửa lỗi rõ ràng
     1. Ô số tiền: bản gốc là ô chữ tự do, gửi nguyên chuỗi đã gõ và nối các
        dòng bằng dấu phẩy — gõ "1,000,000" là vỡ danh sách; tổng dùng
        parseFloat("1,000,000") = 1. Ở đây ô số tiền kiểm tra số, hiện dấu
        phẩy nghìn, gửi số đã bỏ dấu phẩy.
     2. Bấm "Thực hiện rút" hai lần tạo hai lô chứng từ. Ở đây khoá nút sau
        khi chạy xong.
     3. Sinh viên mà mọi dòng đã chọn đều có SOTIEN = 0 — bản gốc vẫn gọi
        ThemMoi với danh sách rỗng. Ở đây bỏ qua và báo.
     4. Xem trước phiếu (bấm tên sinh viên chưa rút): bản gốc hiện MỌI dòng
        của sinh viên trong trang với SỐ TIỀN GỐC, trong khi lưu chỉ lấy dòng
        đã chọn với số đã sửa. Ở đây xem trước đúng những gì sẽ lưu.
     5. Một sinh viên lỗi thì bản gốc không bao giờ hiện hộp "sẵn sàng in"
        (bộ đếm không giảm). Ở đây vẫn hỏi in phần đã thành công.
   Giữ nguyên dù đáng ngờ
     · strHinhThucThu_Id rỗng (bản gốc đọc #dropHinhThucThanhToanPTCEdit — không có trên màn).
     · Học kỳ, từ ngày, đến ngày chỉ dùng cho báo cáo, KHÔNG gửi trong lời gọi danh sách.
   Cố ý bỏ: ô "người thu" (ẩn cứng, không nạp), hai mục báo cáo viết tay
   trong HTML gốc (không gắn sự kiện; getList_MauImport thay nội dung vùng đó).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc;
    var PK = ums.phieuthuKhac, m = PK.m;
    var root = document.getElementById('ruttien');
    if (!root) return;

    var S = { rows: [], page: 1, size: 10, total: 0, sua: {}, chon: {}, dsSV: [], dtThu: [], ketQua: {} };

    root.insertAdjacentHTML('beforeend',
        '<div data-z="main">' +
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Phiếu rút tiền</h1>' +
        '<div class="ums-page__actions"><span data-z="report"></span></div></div>' +

        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body">' +
        '<div class="rt-filter">' +
        '<select class="ums-select" data-z="he"></select><select class="ums-select" data-z="khoa"></select>' +
        '<select class="ums-select" data-z="ct"></select><select class="ums-select" data-z="lop"></select>' +
        '<select class="ums-select" data-z="hocky"><option value="">Tất cả học kỳ</option></select>' +
        '<div data-z="kywrap" hidden><select class="ums-select" data-z="ky"><option value="1">Trong kỳ này</option><option value="0">Đến kỳ này</option></select></div>' +
        '<select class="ums-select" data-z="nam" multiple></select>' +
        '<select class="ums-select" data-z="kql" multiple></select>' +
        '<div class="ums-inputwrap"><input class="ums-input" data-z="tungay" placeholder="Từ ngày dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
        '<div class="ums-inputwrap"><input class="ums-input" data-z="denngay" placeholder="Đến ngày dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
        '<input class="ums-input" data-z="key" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off">' +
        '<div>' + ui.btn('search', { attr: { 'data-act': 'tim' } }) + '</div>' +
        '</div></div></div>' +

        '<div class="ums-grid ums-grid--main-aside ums-u-mb-4">' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-money-check-pen"></i> Chọn khoản rút</div></div>' +
        '<div class="ums-panel__body" data-z="khoan"></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-user-graduate"></i> Chọn trạng thái sinh viên</div></div>' +
        '<div class="ums-panel__body" data-z="trangthai"></div></div></div>' +

        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-ul"></i> DS sinh viên dư tiền ' +
        '<span class="ums-u-faint ums-u-fz13" data-z="count"></span></div></div>' +
        /* Thanh thao tác CHUNG (ums.pat.thanhThu, người dùng 2026-09-26): "Tổng tiền đã chọn" ngay trước nút rút */
        '<div class="ums-panel__body rt-thanh">' + ums.pat.thanhThu({
            truocNut: '<span class="ums-thanhthu__chon">Số dòng đã chọn: <b data-z="soDong">0</b></span>',
            nut: '<button type="button" class="ums-btn ums-btn--danger" data-act="taolo"><i class="fa-light fa-file-medical"></i><span>Tạo lô chứng từ rút</span></button>'
        }) + '</div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="table">' + ui.empty('Hãy ấn nút "Tìm kiếm" để tải danh sách', 'fa-magnifying-glass') + '</div></div>' +
        '</div>' +

        /* --- Vùng chứng từ rút --- */
        '<div data-z="lo" hidden>' +
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Chứng từ rút</h1>' +
        '<div class="ums-page__actions">' +
        '<button type="button" class="ums-btn ums-btn--ghost" data-act="dong"><i class="fa-light fa-xmark"></i><span>Đóng</span></button>' +
        '<div class="ums-inputwrap rt-ngay"><input class="ums-input" data-z="ngayct" placeholder="Ngày xuất chứng từ" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
        '<button type="button" class="ums-btn ums-btn--primary" data-act="inlo" hidden><i class="fa-light fa-print"></i><span>In DS chứng từ</span></button>' +
        '<button type="button" class="ums-btn ums-btn--save" data-act="rut"><i class="fa-light fa-file-signature"></i><span>Thực hiện rút và in DS chứng từ</span></button>' +
        '</div></div>' +
        '<div class="rt-lo">' +
        '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-books"></i> Danh sách chứng từ rút</div></div>' +
        '<div class="ums-panel__body ums-panel__body--flush" data-z="dssv"></div></div>' +
        '<div class="ums-panel"><div class="ums-panel__body rt-lien" data-z="plien" hidden></div><div class="ums-panel__body" data-z="xem"></div></div>' +
        '</div>' +
        '<div data-z="dsphieu" hidden></div>' +
        '</div>');

    function z(n) { return root.querySelector('[data-z="' + n + '"]'); }
    function $on(el, fn) { if (window.jQuery) jQuery(el).on('change', fn); else el.addEventListener('change', fn); }

    /* ---------------------------------------------------------------------
       Bộ lọc
       --------------------------------------------------------------------- */
    var cas = ums.ref.cascade({
        he: z('he'), khoa: z('khoa'), ct: z('ct'), lop: z('lop'),
        labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp' }
    });
    ['he', 'khoa', 'ct', 'lop'].forEach(function (k) { ui.select2(z(k), { placeholder: z(k).options[0] ? z(k).options[0].text : '' }); });

    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (rows) {
        z('hocky').innerHTML = ui.options(rows, { name: 'DAOTAO_THOIGIANDAOTAO', title: 'Tất cả học kỳ' });
        ui.select2(z('hocky'), { placeholder: 'Tất cả học kỳ' });
    }).catch(function (err) { ums.api.handle(err, 'học kỳ'); });
    ui.select2(z('ky'), { minimumResultsForSearch: Infinity });
    $on(z('hocky'), function () { z('kywrap').hidden = !z('hocky').value; });

    ums.api.call({ action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strNguoiThucHien_Id: '' }).then(function (r) {
        z('nam').innerHTML = ui.options(PK.rowsOf(r), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC', title: false });
        ui.select2(z('nam'), { placeholder: 'Tất cả năm nhập học' });
    }).catch(function (err) { ums.api.handle(err, 'năm nhập học'); });
    ums.api.call({ action: 'KHCT_KhoaQuanLy/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strNguoiThucHien_Id: '' }).then(function (r) {
        z('kql').innerHTML = ui.options(PK.rowsOf(r), { title: false });
        ui.select2(z('kql'), { placeholder: 'Tất cả khoa quản lý' });
    }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });

    ui.datepicker(z('tungay'));
    ui.datepicker(z('denngay'));
    ui.datepicker(z('ngayct'));

    var khoan = PK.checks(z('khoan'), [], {});
    PK.khoanThu().then(function (rows) { khoan = PK.checks(z('khoan'), rows, { all: 'Tất cả', checked: true }); })
        .catch(function (err) { ums.api.handle(err, 'khoản rút'); });
    var trangThai = PK.checks(z('trangthai'), [], {});
    PK.cmDM('QLSV.TRANGTHAI').then(function (rows) { trangThai = PK.checks(z('trangthai'), rows, { all: 'Tất cả', checked: true }); })
        .catch(function (err) { ums.api.handle(err, 'trạng thái sinh viên'); });

    function multi(el) {
        return Array.prototype.filter.call(el.options, function (o) { return o.selected && o.value !== '' && o.value !== 'SELECTALL'; })
            .map(function (o) { return o.value; }).join(',');
    }

    /* Báo cáo (getList_MauImport "zonebtnBaoCao_RT") */
    ums.report.mount(z('report'), {
        collect: function (add) {
            var kt = khoan.ids(), tt = trangThai.ids().toString();
            if (!kt.length) { ui.toast('Vui lòng chọn khoản thu!', 'warn'); return false; }
            if (tt === '') { ui.toast('Vui lòng chọn trạng thái!', 'warn'); return false; }
            var v = cas.values();
            add('strMaTruong', 'KCNTTTN');
            add('strNguoiDangNhap_Id', ums.session.userId);
            add('strNguoiThucHien_Id', '');
            add('strHeDaoTao_Id', v.he);
            add('strKhoaDaoTao_Id', v.khoa);
            add('strChuongTrinh_Id', v.ct);
            add('strLopQuanLy_Id', v.lop);
            add('strThoiGianDaoTao_Id', z('hocky').value);
            add('strPhamViApDung', z('hocky').value === '' ? '' : z('ky').value);
            add('strTuNgay', z('tungay').value.trim());
            add('strDenNgay', z('denngay').value.trim());
            add('strTuKhoa', z('key').value.trim());
            add('strKhoaQuanLy_Id', multi(z('kql')));
            add('strNamNhapHoc', multi(z('nam')));
            kt.forEach(function (id) { add('strTAICHINH_CacKhoanThu_Ids', id); });
            add('strTrangThaiNguoiHoc_Id', tt);
        }
    });

    /* ---------------------------------------------------------------------
       Danh sách sinh viên dư tiền (getList_KhoanThu_ChuaXuat)
       --------------------------------------------------------------------- */
    function load(page) {
        if (page) S.page = page;
        var kt = khoan.ids().toString();
        if (kt === '') { ui.toast('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'warn'); return; }
        var v = cas.values();
        z('table').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'TC_NguoiHoc_DuTien/LayDanhSach', versionAPI: 'v1.0',
            pageIndex: S.page, pageSize: S.size,
            strTrangThaiNguoiHoc_Id: trangThai.ids().toString(),
            strTAICHINH_CacKhoanThu_Ids: kt,
            strHeDaoTao_Id: v.he, strKhoaDaoTao_Id: v.khoa, strChuongTrinh_Id: v.ct, strLopQuanLy_Id: v.lop,
            strTuKhoa: z('key').value.trim(),
            strNguoiDung_Id: '',
            strNamNhapHoc: multi(z('nam')),
            strKhoaQuanLy_Id: multi(z('kql'))
        }).then(function (r) {
            S.rows = PK.rowsOf(r);
            S.total = Number(r.pager) || S.rows.length;
            S.sua = {}; S.chon = {};
            S.rows.forEach(function (x) { S.sua[x.ID] = m.fmt(x.SOTIEN); });
            draw();
        }).catch(function (err) { z('table').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên dư tiền'); });
    }

    function draw() {
        z('count').textContent = S.total ? '(' + S.total + ')' : '';
        ui.table({
            el: z('table'), rows: S.rows, empty: 'Không có sinh viên dư tiền',
            page: {
                index: S.page, size: S.size, total: S.total, onChange: load,
                onSize: function (v) { S.size = v; load(1); }
            },
            columns: [
                { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'HOTENNGUOIHOC' },
                { title: 'Lớp', prop: 'LOP' },
                { title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
                { title: 'Khoản thu', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Nội dung', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Số tiền', cls: 'is-right', width: '160px', render: function (x) {
                    return '<input class="ums-input ums-input--sm rt-num" data-tien="' + esc(x.ID) + '" inputmode="decimal" value="' + esc(S.sua[x.ID]) + '">';
                } },
                { head: '<input type="checkbox" data-all title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x) {
                    return '<input type="checkbox" data-chon="' + esc(x.ID) + '"' + (S.chon[x.ID] ? ' checked' : '') + '>';
                } }
            ]
        });
        tongChon();
    }

    function tongChon() {
        var t = 0, n = 0;
        S.rows.forEach(function (x) { if (S.chon[x.ID]) { n++; var v = m.cell(S.sua[x.ID]); if (v !== null) t += v; } });
        z('soDong').textContent = n;
        ums.pat.datDaChon(z('main'), m.floor2(t));
    }

    z('table').addEventListener('input', function (ev) {
        var id = ev.target.getAttribute('data-tien');
        if (!id) return;
        var v = ev.target.value, last = v.charAt(v.length - 1);
        if (last === '.' || last === ',') return;
        var s = v.replace(/,/g, '');
        if (s !== '' && !m.isNum(s)) { ev.target.value = S.sua[id]; return; }
        ev.target.value = s === '' ? '' : m.fmt(s);
        S.sua[id] = ev.target.value;
        tongChon();
    });
    z('table').addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute('data-all')) {
            S.rows.forEach(function (x) { S.chon[x.ID] = t.checked; });
            z('table').querySelectorAll('input[data-chon]').forEach(function (c) { c.checked = t.checked; });
        } else if (t.hasAttribute('data-chon')) {
            S.chon[t.getAttribute('data-chon')] = t.checked;
        }
        tongChon();
    });

    /* ---------------------------------------------------------------------
       Tạo lô (getDetail_KhoanThu_DoiTuong → genList_DoiTuong_KhoanThu)
       --------------------------------------------------------------------- */
    var xem = null, lo = null;

    function taoLo() {
        var ds = [], thu = [];
        S.rows.forEach(function (x) {
            if (!S.chon[x.ID]) return;
            if (ds.indexOf(x.QLSV_NGUOIHOC_ID) < 0) ds.push(x.QLSV_NGUOIHOC_ID);
            thu.push(x);
        });
        if (!ds.length) { ui.toast('Không có sinh viên nào được chọn!', 'warn'); return; }
        for (var i = 0; i < thu.length; i++) {
            if (m.cell(S.sua[thu[i].ID]) === null || S.sua[thu[i].ID] === '') {
                ui.toast('Số tiền không hợp lệ: ' + thu[i].HOTENNGUOIHOC + ' — ' + thu[i].TAICHINH_CACKHOANTHU_TEN, 'warn');
                return;
            }
        }
        S.dsSV = ds; S.dtThu = thu; S.ketQua = {};
        // chốt số tiền của lô — danh sách phía sau có thể tải lại (sau khi rút) làm mất số đã sửa
        S.tien = {};
        thu.forEach(function (x) { S.tien[x.ID] = S.sua[x.ID]; });
        z('dsphieu').innerHTML = '';
        lo = ums.phieu.viewer(z('dsphieu'));
        xem = ums.phieu.viewer(z('xem'), { tools: z('plien'), empty: 'Chọn một sinh viên để xem phiếu' });
        root.querySelector('[data-act="rut"]').disabled = false;
        root.querySelector('[data-act="inlo"]').hidden = true;
        veDS();
        ui.swap(z('main'), z('lo'));
    }

    function dongCua(sv) { return S.dtThu.filter(function (x) { return x.QLSV_NGUOIHOC_ID === sv; }); }

    function veDS(active) {
        var tongLo = 0;
        var rows = S.dsSV.map(function (sv) {
            var ds = dongCua(sv), t = 0;
            ds.forEach(function (x) { var v = m.cell(S.tien[x.ID]); if (v !== null) t += v; });
            tongLo += t;
            return { ID: sv, d: ds[0], tong: t, kq: S.ketQua[sv] };
        });
        ui.table({
            el: z('dssv'), rows: rows, stt: false, tableCls: 'rt-ds',
            columns: [
                { title: 'Sinh viên', render: function (r) { return ui.cell(r.d.HOTENNGUOIHOC, r.d.MASONGUOIHOC); } },
                { title: 'Tổng', cls: 'is-right', render: function (r) {
                    return '<div class="ums-u-semi">' + esc(m.fmt(r.tong)) + '</div>' +
                        (r.kq ? (r.kq.id ? ui.badge('Đã rút', 'ok') : ui.badge(r.kq.loi ? 'Lỗi' : 'Bỏ qua', 'bad')) : '');
                } }
            ],
            empty: 'Không có'
        });
        z('dssv').querySelectorAll('tbody tr[data-id]').forEach(function (tr) {
            tr.classList.toggle('is-selected', tr.getAttribute('data-id') === active);
            tr.style.cursor = 'pointer';
        });
        var foot = z('dssv').querySelector('.rt-tong');
        if (!foot) z('dssv').insertAdjacentHTML('beforeend', '<div class="rt-tong">Tổng lô: <b>' + esc(m.fmt(m.floor2(tongLo))) + '</b></div>');
    }

    /* Bấm một sinh viên: đã rút → xem chứng từ thật; chưa → xem trước */
    z('dssv').addEventListener('click', function (ev) {
        var tr = ev.target.closest('tbody tr[data-id]');
        if (!tr) return;
        var sv = tr.getAttribute('data-id');
        veDS(sv);
        var kq = S.ketQua[sv];
        if (kq && kq.id) { xem.show({ id: kq.id, loai: 'BIENLAIRUT' }); return; }
        xemTruoc(sv);
    });

    function dongLuu(sv) {
        return dongCua(sv).filter(function (x) { return Number(x.SOTIEN) !== 0; });   // if (x[i].SOTIEN == 0) continue;
    }

    function xemTruoc(sv) {
        var ds = dongLuu(sv);
        if (!ds.length) { z('xem').innerHTML = ui.empty('Mọi khoản của sinh viên này có số tiền 0 — không tạo chứng từ'); return; }
        var ma = PK.cungHeThong(ds.map(function (x) { return { title: String(x.HETHONGCHUNGTU_MA) }; }));
        if (ma === null) return;
        var a = ds[0];
        z('plien').hidden = true;
        PK.nhap(z('xem'), {
            rut: true, tenPhieu: 'BIÊN LAI RÚT TIỀN',
            info: { hoTen: a.HOTENNGUOIHOC, ma: a.MASONGUOIHOC, ngaySinh: a.NGAYSINH, diaChi: a.NOIOHIENNAY, maSoThue: a.MASOTHUECANHAN,
                lop: a.DAOTAO_LOPQUANLY_N1_TEN, nganh: a.NGANHHOC_N1_TEN, khoa: a.KHOAHOC_N1_TEN },
            ngay: PK.homNay(),
            dong: ds.map(function (x) {
                return { id: x.TAICHINH_CACKHOANTHU_ID, khoan: x.TAICHINH_CACKHOANTHU_TEN, noiDung: x.TAICHINH_CACKHOANTHU_TEN,
                    soLuong: '1', donGia: S.tien[x.ID], thanhTien: m.parse(S.tien[x.ID]) };
            })
        });
    }

    /* save_HDBL cho từng sinh viên */
    function rutMot(sv) {
        var ds = dongLuu(sv);
        if (!ds.length) { S.ketQua[sv] = { bo: true }; return Promise.resolve(); }
        return ums.api.call({
            action: 'TC_TaiChinh_Rut/ThemMoi', versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: ds.map(function (x) { return x.TAICHINH_CACKHOANTHU_ID; }).join(','),
            strTaiChinh_SoTien_s: ds.map(function (x) { return m.parse(S.tien[x.ID]); }).join(','),
            strTaiChinh_NoiDung_s: ds.map(function (x) { return x.TAICHINH_CACKHOANTHU_TEN; }).join('#'),
            strQLSV_NguoiHoc_Id: sv,
            strDaoTao_ThoiGianDaoTao_Id: ds.map(function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID; }).join(','),
            strHinhThucThu_Id: '',
            strXuatHoaDonTrucTiep: '',
            strNguonDuLieu_Id: '',
            strCANBOTHUCHIENRUT_Id: ums.session.userId,
            strNGAYTHUCHIENRUT: '',
            strCHUNGTURUT_Id: '',
            strLOAITIENTE_Id: '',
            dTYGIAQUYDOI: -1,
            strNgayChungTuRut: z('ngayct').value.trim()
        }).then(function (r) {
            var id = r.raw && r.raw.Id;
            S.ketQua[sv] = { id: id || '(không rõ)' };
            return lo.add({ id: id, loai: 'BIENLAIRUT' });
        }, function (err) {
            S.ketQua[sv] = { loi: err.message };
            throw err;
        });
    }

    function thucHienRut() {
        var btn = root.querySelector('[data-act="rut"]');
        btn.disabled = true;
        lo.clear();
        ui.batch(S.dsSV.map(function (sv) { return function () { return rutMot(sv); }; }),
            { title: 'Đang rút tiền', okText: 'Đã xử lý', show: true })
            .then(function (res) {
                veDS();
                var bo = S.dsSV.filter(function (sv) { return S.ketQua[sv] && S.ketQua[sv].bo; }).length;
                if (bo) ui.toast(bo + ' sinh viên có mọi khoản bằng 0 — không tạo chứng từ', 'warn');
                if (lo.count()) {
                    root.querySelector('[data-act="inlo"]').hidden = false;
                    ui.confirm('Lô hóa đơn đã sẵn sàng để in. Bạn có chắc chắn muốn in không?', { ok: 'In' })
                        .then(function (y) { if (y) lo.print('In DS chứng từ rút'); });
                }
                btn.disabled = true;               // chạy lại sẽ tạo lô trùng — đóng vùng rồi tạo lô mới
                load();
            });
    }

    root.addEventListener('click', function (ev) {
        var a = ev.target.closest('[data-act]');
        if (!a || !root.contains(a)) return;
        switch (a.getAttribute('data-act')) {
            case 'tim': load(1); break;
            case 'taolo': taoLo(); break;
            case 'dong': ui.swap(z('lo'), z('main')); break;
            case 'rut':
                ui.confirm('Thực hiện rút tiền và tạo ' + S.dsSV.length + ' chứng từ rút?', { ok: 'Thực hiện' })
                    .then(function (y) { if (y) thucHienRut(); });
                break;
            case 'inlo': if (lo) lo.print('In DS chứng từ rút'); break;
        }
    });
    z('key').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });
})();
