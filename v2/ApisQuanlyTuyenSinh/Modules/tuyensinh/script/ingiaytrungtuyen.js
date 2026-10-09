/* =========================================================================
   In giấy trúng tuyển
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/ingiaytrungtuyen.html + script/ingiaytrungtuyen.js
   (tệp .js là bản chép của tuyensinh/hosotuyensinh.js, lớp InGiayTrungTuyen)
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" 13 ô (Năm → Kế hoạch TS → Hệ → Khóa · Tình trạng xét tuyển ·
   Tỉnh → Huyện → Xã · Trường học · Ngành nghề · Đối tác · từ khoá · Tìm kiếm) → "Danh sách hồ sơ thí sinh (n)"
   + "Xuất báo cáo ▾": Họ đệm · Tên · Ngày sinh · Ngành nghề · Hệ · Khóa · Điện thoại · Số lần in · Chi tiết ·
   ô đánh dấu, dưới bảng nút "In giấy báo". Bấm Chi tiết → khung "THÔNG TIN HỒ SƠ" thay chỗ danh sách
   (zone_input): Thông tin cơ bản (ảnh…), Trường THPT đã học, Điểm thi vào lớp 9 / lớp 10 / lớp 12, Hồ sơ đính
   kèm, Hồ sơ giấy tờ, Tình trạng hồ sơ, Ghi chú; chân khung "Đóng" + "In giấy báo".

   Lời gọi (chép nguyên, GET như gốc — màn chỉ ĐỌC):
     TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach  strNguoiThucHien_Id → NAM
     TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung      strTuKhoa '' (gốc đọc ô txtAAAA không tồn tại), strNguoiDung_Id,
                                                        strNam, trang 1/100000 → TEN
     TS_HeDaoTao/LayDanhSach        strChucNang_Id, strTS_KeHoachTuyenSinh_Id, strNguoiThucHien_Id → TENHEDAOTAO
     TS_KhoaDaoTao/LayDanhSach      strChucNang_Id, strNguoiThucHien_Id, strDaoTao_HeDaoTao_Id, strTS_KeHoachTuyenSinh_Id → TENKHOA
     TS_DoiTacTuyenSinh/LayDanhSach strTuKhoa '', strNguoiTao_Id, trang 1/1000000000 → THONGTINHIENTHI
     danh mục TUYENSINH.XACNHANTRUNGTUYEN / TRUONGHOC / NGANHNGHE / HOCLUC / HANHKIEM / TINHTRANGHOSO / LOAIHOSO,
       NS.GITI / NS.DATO / NS.TOGI, CHUN.DMTT (genDropTinhThanh → ums.pat.dmTinhThanh)
     TS_HoSoDuTuyen/LayDanhSach     strTuKhoa, strTS_KeHoachTuyenSinh_Id, strTS_DoiTacTuyenSinh_Id, strDaoTao_HeDaoTao_Id,
                                    strDaoTao_KhoaDaoTao_Id, strNam, strThuongTru_TinhThanh_Id/_QuanHuyen_Id/_PhuongXa_Id,
                                    strNganhNghe_Id, strTruongPTTH_Id, strTS_XacNhanDuyetHoSo_Id '', strTS_XacNhanDuyetTT_Id,
                                    strNguoiTao_Id, trang (máy chủ)
     TS_HoSoDuTuyen/LayChiTiet      strId, strChucNang_Id
     TS_HoSoDuTuyen_Lop9 (1/100000) · _Lop10 (1/10000) · _Lop12 (1/10000) /LayDanhSach — lấy dòng CUỐI như gốc
     TS_HoSoDuTuyen_Truong/LayDanhSach (1/10) · TS_HoSo/LayDanhSach (strLoaiHoSo_Id '', kế hoạch = thanh lọc, 1/100000000)
     tệp đính kèm: ums.files (TS_Files, chỉ xem)
     Xuất báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TT") — collect gửi strChucNang_Id,
       strTS_HoSoDuTuyen_Id (id các dòng ĐÁNH DẤU, quá 100 thì dừng như gốc), strNam, strTuKhoa, kế hoạch / hệ / khoá,
       strTruongPTTH_Id, strTS_DoiTacTuyenSinh_Id, tỉnh / huyện / xã, strNganhNghe_Id, strTS_XacNhanDuyetHoSo_Id '',
       strTS_XacNhanDuyetTT_Id.

   Khác gốc / tự chốt (ghi báo cáo):
     · Khung chi tiết CHỈ XEM (.ums-kv): html gốc KHÔNG có nút Lưu (#btnHS_Save không có trên màn, hàm save_HS không
       tồn tại) → các ô nhập của gốc thực chất chỉ để xem. Nút "Thêm dòng mới" / "Xóa" hai lưới không gắn xử lý → bỏ.
     · Hai nút "In giấy báo" (dưới bảng, chân khung chi tiết): gốc KHÔNG gắn xử lý → giữ nút, khoá. In thật đi qua
       "Xuất báo cáo" (mẫu được phân quyền, gửi id các dòng đánh dấu). Mục viết cứng "1. Giấy báo nhập học" trong html
       gốc bị getList_MauImport ghi đè (và không có xử lý) → không dựng.
     · Năm → Kế hoạch → Hệ → Khóa, Tỉnh → Huyện → Xã: chưa chọn cha thì khoá con (pat.chain). Gốc nạp sẵn kế hoạch /
       hệ / khoá với cha rỗng.
     · Đổi Năm là tải lại danh sách (gốc chỉ nạp lại kế hoạch) — vì chọn năm xoá trắng kế hoạch/hệ/khoá.
     · Ô "Đối tác": placeholder gốc chép nhầm "Chọn ngành nghề" → "Chọn nguồn tuyển sinh" (chữ genCombo gốc đặt lại).
     · Mã chết không dựng: .btnAdd, #btnHS_In (report 2C_2008), rewrite, save_*, delete_* (không nút nào gọi tới).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.nhPhanLop, esc = ui.esc;
    var root = document.getElementById('ts-ingiaytrungtuyen');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function uid() { return ums.session.userId; }
    function cn() { return ums.state.chucNangId; }
    function rows(call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) { var d = r.data; return Array.isArray(d) ? d : (d && d.rs) || []; });
    }
    function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }
    var KHOA_IN = { disabled: '', title: 'Bản gốc chưa gắn xử lý cho nút này — in qua "Xuất báo cáo"' };

    var srcDoiTac = { call: { action: 'TS_DoiTacTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: uid(),
        pageIndex: 1, pageSize: 1000000000 }, name: 'THONGTINHIENTHI' };

    /* ---------- Khung: danh sách (ums.crud) + khung chi tiết thay chỗ ---------- */
    root.innerHTML = '<div data-x="crud"></div>';
    var crud = ums.crud({
        root: root.querySelector('[data-x="crud"]'),
        title: 'In giấy trúng tuyển',
        listTitle: 'Danh sách hồ sơ thí sinh',
        icon: 'fa-rectangle-list',
        canAdd: false,
        filters: [
            { key: 'nam', type: 'select', label: 'Chọn năm', source: { call: { action: 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
                method: 'GET', strNguoiThucHien_Id: uid() }, id: 'NAM', name: 'NAM' } },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch tuyển sinh' },
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'tt', type: 'select', label: 'Chọn tình trạng xét tuyển', source: { dm: 'TUYENSINH.XACNHANTRUNGTUYEN' } },
            { key: 'tinh', type: 'select', label: 'Chọn tỉnh' },
            { key: 'huyen', type: 'select', label: 'Chọn huyện' },
            { key: 'xa', type: 'select', label: 'Chọn xã' },
            { key: 'truong', type: 'select', label: 'Chọn trường học', source: { dm: 'TUYENSINH.TRUONGHOC' } },
            { key: 'nganh', type: 'select', label: 'Chọn ngành nghề', source: { dm: 'TUYENSINH.NGANHNGHE' } },
            { key: 'doitac', type: 'select', label: 'Chọn nguồn tuyển sinh', source: srcDoiTac },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TS_HoSoDuTuyen/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strTS_KeHoachTuyenSinh_Id: f.kh, strTS_DoiTacTuyenSinh_Id: f.doitac,
                    strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa, strNam: f.nam,
                    strThuongTru_TinhThanh_Id: f.tinh, strThuongTru_QuanHuyen_Id: f.huyen, strThuongTru_PhuongXa_Id: f.xa,
                    strNganhNghe_Id: f.nganh, strTruongPTTH_Id: f.truong, strTS_XacNhanDuyetHoSo_Id: '',
                    strTS_XacNhanDuyetTT_Id: f.tt, strNguoiTao_Id: uid() };
            }
        },
        columns: [
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', width: '120px',
              render: function (r) { return esc(e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH)); } },
            { title: 'Ngành nghề', prop: 'NGANHNGHE_TEN' },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Điện thoại', prop: 'TTCN_DIENTHOAI', cls: 'is-center', width: '150px' },
            { title: 'Số lần in', prop: 'SOLANIN', cls: 'is-center', width: '90px' }
        ],
        rowActions: [{ title: 'Chi tiết', icon: 'fa-eye', onClick: function (r) { xem(r); } }],
        onLoad: function () { var all = crud.z('table').querySelector('[data-nhall="hs"]'); if (all) all.checked = false; }
    });
    /* cột ô đánh dấu CUỐI bảng (sau cột thao tác) như gốc — ums.crud chỉ có ô đánh dấu khi có remove */
    var drawGoc = crud.draw;
    crud.draw = function () { drawGoc.call(crud); chenCotChon(); };
    function chenCotChon() {
        var tbl = crud.z('table').querySelector('table');
        if (!tbl) return;
        var th = tbl.querySelector('thead tr');
        var thTT = th && th.querySelector('th.is-actions');
        if (thTT) thTT.textContent = 'Chi tiết';                    // tiêu đề cột của gốc
        if (th && !th.querySelector('[data-nhall]')) {
            th.insertAdjacentHTML('beforeend', '<th class="is-center" style="width:50px">' + P.cotChon('hs').head + '</th>');
        }
        Array.prototype.forEach.call(tbl.querySelectorAll('tbody tr'), function (tr, i) {
            var r = crud.rows[i];
            if (!r || tr.querySelector('[data-nhck]')) return;
            tr.insertAdjacentHTML('beforeend', '<td class="is-center">' + P.cotChon('hs').render(r) + '</td>');
        });
    }
    P.ganChon(crud.z('table'), 'hs');

    /* Công cụ trên khung danh sách: Xuất báo cáo ▾ + In giấy báo (gốc: dưới bảng, không xử lý) */
    var toolsDs = crud.z('table').parentNode.querySelector('.ums-panel__tools');
    toolsDs.insertAdjacentHTML('afterbegin', '<span data-x="bc"></span>' + ui.btn('print', { text: 'In giấy báo', attr: KHOA_IN }));

    /* ---------- Thanh lọc: nối tầng ---------- */
    function fl(k) { return crud.root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
    var F = {};
    ['nam', 'kh', 'he', 'khoa', 'tt', 'tinh', 'huyen', 'xa', 'q'].forEach(function (k) { F[k] = fl(k); });
    function napKH() {
        if (!F.nam.value) { pat.fill(F.kh, []); return; }
        rows({ action: 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung', method: 'GET', strTuKhoa: '', strNguoiDung_Id: uid(),
            strNam: F.nam.value, pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(F.kh, r, { name: 'TEN' }); }, loi('kế hoạch tuyển sinh'));
    }
    function napHe() {
        if (!F.kh.value) { pat.fill(F.he, []); return; }
        rows({ action: 'TS_HeDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strTS_KeHoachTuyenSinh_Id: F.kh.value,
            strNguoiThucHien_Id: uid() }).then(function (r) { pat.fill(F.he, r, { name: 'TENHEDAOTAO' }); }, loi('hệ đào tạo'));
    }
    function napKhoa() {
        if (!F.he.value) { pat.fill(F.khoa, []); return; }
        rows({ action: 'TS_KhoaDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
            strDaoTao_HeDaoTao_Id: F.he.value, strTS_KeHoachTuyenSinh_Id: F.kh.value })
            .then(function (r) { pat.fill(F.khoa, r, { name: 'TENKHOA' }); }, loi('khóa đào tạo'));
    }
    var dsTT = [];
    function conTT(cha) { return dsTT.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
    function tenTT(id) { var x = dsTT.filter(function (r) { return r.ID === id; })[0]; return x ? e(x.TEN) : ''; }
    pat.dmTinhThanh().then(function (r) { dsTT = r; pat.fill(F.tinh, conTT(null)); }, loi('tỉnh thành'));

    var S = 'select2:select select2:clear';
    jQuery(F.nam).on(S, function () { napKH(); pat.fill(F.he, []); pat.fill(F.khoa, []); crud.load(1); });
    jQuery(F.kh).on(S, function () { napHe(); pat.fill(F.khoa, []); crud.load(1); });
    jQuery(F.he).on(S, function () { napKhoa(); crud.load(1); });
    jQuery(F.khoa).on(S, function () { crud.load(1); });
    jQuery(F.tt).on(S, function () { crud.load(1); });
    jQuery(F.tinh).on(S, function () { pat.fill(F.huyen, F.tinh.value ? conTT(F.tinh.value) : []); pat.fill(F.xa, []); });
    jQuery(F.huyen).on(S, function () { pat.fill(F.xa, F.huyen.value ? conTT(F.huyen.value) : []); });
    F.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); crud.load(1); } });
    pat.chain([F.nam, F.kh, F.he, F.khoa], { phatLai: false });
    pat.chain([F.tinh, F.huyen, F.xa], { phatLai: false });

    /* ---------- Xuất báo cáo ---------- */
    ums.report.mount(root.querySelector('[data-x="bc"]'), {
        import: false,
        collect: function (add) {
            var ids = P.chon(crud.z('table'), 'hs');
            if (ids.length > 100) { ui.toast('Số được chọn không quá 100?', 'warn'); return false; }
            var f = crud.filterValues();
            var o = {
                strChucNang_Id: cn(), strTS_HoSoDuTuyen_Id: ids.toString(), strNam: f.nam, strTuKhoa: f.q,
                strTS_KeHoachTuyenSinh_Id: f.kh, strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa,
                strTruongPTTH_Id: f.truong, strTS_DoiTacTuyenSinh_Id: f.doitac,
                strThuongTru_TinhThanh_Id: f.tinh, strThuongTru_QuanHuyen_Id: f.huyen, strThuongTru_PhuongXa_Id: f.xa,
                strNganhNghe_Id: f.nganh, strTS_XacNhanDuyetHoSo_Id: '', strTS_XacNhanDuyetTT_Id: f.tt
            };
            Object.keys(o).forEach(function (k) { add(k, o[k]); });
        }
    });

    /* ---------- Khung chi tiết (chỉ xem) ---------- */
    var list = crud.z('list');
    list.insertAdjacentHTML('afterend', '<div data-x="ct" hidden>' + pat.panel({
        title: 'Thông tin hồ sơ', icon: 'fa-id-card',
        tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('print', { text: 'In giấy báo', attr: KHOA_IN }),
        body: '<div data-x="ctBody"></div>'
    }) + '</div>');
    var ct = crud.root.querySelector('[data-x="ct"]'), ctBody = ct.querySelector('[data-x="ctBody"]');
    var token = 0;

    var dmCache = {};
    function dm(ma) { return dmCache[ma] || (dmCache[ma] = ums.api.dm(ma).catch(function () { delete dmCache[ma]; return []; })); }
    function ten(ds, id) { if (!id) return ''; var x = (ds || []).filter(function (r) { return r.ID === id; })[0]; return x ? e(x.TEN) : ''; }
    function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div>'; }
    function luoi(ds) { return '<div class="ums-grid ums-grid--2">' + ds.join('') + '</div>'; }
    function lg(chu, cach) { return '<div class="ums-legend' + (cach ? ' ums-legend--cach' : '') + '">' + esc(chu) + '</div>'; }
    function diaChi(them, tinh, huyen, xa) {
        return [e(them), tenTT(xa), tenTT(huyen), tenTT(tinh)].filter(function (x) { return x; }).join(', ');
    }
    function cuoi(ctl, id, size) {
        return rows({ action: ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id, strChucNang_Id: cn(),
            strNguoiTao_Id: uid(), pageIndex: 1, pageSize: size })
            .then(function (r) { return r.length ? r[r.length - 1] : {}; }, function (err) { ums.api.handle(err, ctl); return {}; });
    }

    function xem(r) {
        var id = e(r.ID), my = ++token;
        ctBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ui.swap(list, ct);
        var khId = crud.filterValues().kh;
        var dsDoiTac = rows(Object.assign({}, srcDoiTac.call)).catch(function () { return []; });
        Promise.all([
            ums.api.call({ action: 'TS_HoSoDuTuyen/LayChiTiet', method: 'GET', strId: id, strChucNang_Id: cn(), silent: true })
                .then(function (x) { var d = x.data; return (Array.isArray(d) ? d[0] : d) || r; }),
            cuoi('TS_HoSoDuTuyen_Lop9', id, 100000), cuoi('TS_HoSoDuTuyen_Lop10', id, 10000), cuoi('TS_HoSoDuTuyen_Lop12', id, 10000),
            rows({ action: 'TS_HoSoDuTuyen_Truong/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id,
                strChucNang_Id: cn(), strNguoiTao_Id: uid(), pageIndex: 1, pageSize: 10 }).catch(function (err) { ums.api.handle(err, 'trường THPT'); return []; }),
            rows({ action: 'TS_HoSo/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id, strChucNang_Id: cn(),
                strLoaiHoSo_Id: '', strTS_KeHoachTuyenSinh_Id: khId, strNguoiTao_Id: uid(), pageIndex: 1, pageSize: 100000000 })
                .catch(function (err) { ums.api.handle(err, 'hồ sơ giấy tờ'); return []; }),
            dsDoiTac,
            Promise.all(['NS.GITI', 'NS.DATO', 'NS.TOGI', 'TUYENSINH.NGANHNGHE', 'TUYENSINH.HOCLUC', 'TUYENSINH.HANHKIEM',
                'TUYENSINH.TINHTRANGHOSO', 'TUYENSINH.TRUONGHOC', 'TUYENSINH.LOAIHOSO'].map(dm))
        ]).then(function (kq) {
            if (my !== token) return;
            ve(kq[0], kq[1], kq[2], kq[3], kq[4], kq[5], kq[6], kq[7]);
        }).catch(function (err) {
            if (my !== token) return;
            ctBody.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'TS_HoSoDuTuyen/LayChiTiet');
        });
    }

    function ve(d, l9, l10, l12, thpt, giayTo, doiTac, D) {
        var GT = D[0], DT = D[1], TG = D[2], NN = D[3], HL = D[4], HK = D[5], TTHS = D[6], TRUONG = D[7], LHS = D[8];
        var dt = (doiTac || []).filter(function (x) { return x.ID === d.TS_DOITACTUYENSINH_ID; })[0];
        var h = lg('Thông tin cơ bản') +
            '<div class="tsig-coban"><div class="tsig-coban__anh">' + pat.anhNguoi(e(d.ANHCANHAN)) + '</div>' +
            luoi([
                kv('Mã số dự tuyển', d.MASO), '<div></div>',
                kv('Họ đệm', d.HODEM), kv('Tên', d.TEN),
                kv('Ngày sinh', [e(d.NGAYSINH), e(d.THANGSINH), e(d.NAMSINH)].join('/').replace(/^\/+|\/+$/g, '')),
                kv('Giới tính', ten(GT, d.GIOITINH_ID)),
                kv('Dân tộc', ten(DT, d.DANTOC_ID)), kv('Tôn giáo', ten(TG, d.TONGIAO_ID)),
                kv('Số điện thoại', d.TTCN_DIENTHOAI), kv('Số CMND/CCCD', d.CMT_SO),
                kv('Ngày vào Đoàn', d.DOAN_NGAYVAO), kv('Ngày vào Đảng', d.DANG_NGAYVAO),
                kv('Nơi sinh', diaChi(d.NOISINH_DIACHI, d.NOISINH_TINHTHANH_ID, d.NOISINH_QUANHUYEN_ID, d.NOISINH_PHUONGXA_ID)),
                kv('Quê quán', diaChi(d.QUEQUAN_DIACHI, d.QUEQUAN_TINHTHANH_ID, d.QUEQUAN_QUANHUYEN_ID, d.QUEQUAN_PHUONGXA_ID)),
                kv('Hộ khẩu thường trú', diaChi(d.THUONGTRU_DIACHI, d.THUONGTRU_TINHTHANH_ID, d.THUONGTRU_QUANHUYEN_ID, d.THUONGTRU_PHUONGXA_ID)),
                kv('Ngành nghề', ten(NN, d.NGANHNGHE_ID) || d.NGANHNGHE_TEN),
                kv('Ngành nghề đã học', d.NGANH_NGHE_TRUOC), kv('Nguồn tuyển sinh', dt ? dt.THONGTINHIENTHI : ''),
                kv('Nguồn tuyển sinh khác', d.TS_DOITACTUYENSINH_KHAC), '<div></div>',
                kv('Họ tên bố', d.GIADINH_HOTENBO), kv('SĐT bố', d.GIADINH_SODIENTHOAIBO),
                kv('Họ tên mẹ', d.GIADINH_HOTENME), kv('SĐT mẹ', d.GIADINH_SODIENTHOAIME),
                kv('Người báo tin', d.GIADINH_NGUOIBAOTIN), kv('Địa chỉ báo tin', d.GIADINH_DIACHIBAOTIN)
            ]) + '</div>' +
            lg('Trường THPT đã học') + '<div data-x="thpt"></div>' +
            lg('Điểm thi vào lớp 9') + luoi([kv('Điểm TB cả năm', l9.DIEMTBCN), kv('Học lực', ten(HL, l9.HOCLUC_ID)),
                kv('Hạnh kiểm', ten(HK, l9.HANHKIEM_ID)), kv('Năm tốt nghiệp', l9.NAMTN)]);
        var mon = [];
        for (var i = 1; i <= 5; i++) mon.push(kv('Tên môn ' + i, l10['MON' + i + '_TEN']), kv('Điểm môn ' + i, l10['MON' + i]));
        mon.push(kv('Ưu tiên', l10.DIEMUUTIEN), kv('Tổng', l10.TONGDIEM));
        h += lg('Điểm thi vào lớp 10') + luoi(mon) +
            lg('Điểm thi lớp 12') + luoi([kv('Điểm TB cả năm', l12.DIEMTBCN), kv('Học lực', ten(HL, l12.HOCLUC_ID)),
                kv('Hạnh kiểm', ten(HK, l12.HANHKIEM_ID)), kv('Năm tốt nghiệp', l12.NAMTN)]) +
            lg('Thông tin hồ sơ đính kèm') + '<div data-x="tep"></div>' +
            lg('Hồ sơ giấy tờ') + '<div data-x="giayto"></div>' +
            lg('Tình trạng hồ sơ') + luoi([kv('Tình trạng hồ sơ', ten(TTHS, d.XACNHANTINHTRANGNOPHOSO_ID)), '<div></div>']) +
            '<div class="ums-u-mt-3">' + kv('Ghi chú', d.GHICHU) + '</div>';
        ctBody.innerHTML = h;
        ui.table({ el: ctBody.querySelector('[data-x="thpt"]'), rows: thpt, stt: false, empty: 'Chưa khai trường THPT', columns: [
            { title: 'Tên trường THPT', render: function (x) { return esc(ten(TRUONG, x.TRUONG_ID)); } },
            { title: 'Trường THPT khác', prop: 'TRUONG_KHAC' },
            { title: 'Địa chỉ', prop: 'GHICHU' }
        ] });
        ui.table({ el: ctBody.querySelector('[data-x="giayto"]'), rows: giayTo, stt: true, empty: 'Chưa có hồ sơ giấy tờ', columns: [
            { title: 'Loại hồ sơ', render: function (x) { return esc(ten(LHS, x.LOAIHOSO_ID)); } },
            { title: 'Số lượng cần nộp', prop: 'SOLUONGCANNOP', cls: 'is-center', width: '150px' },
            { title: 'Số lượng đã nộp', prop: 'SOLUONG', cls: 'is-center', width: '150px' },
            { title: 'Ghi chú', prop: 'MOTA' }
        ] });
        var tep = ums.files.mount(ctBody.querySelector('[data-x="tep"]'), { api: 'TS_Files', readonly: true });
        tep.load(e(d.ID));
    }

    ct.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="dong"]')) { token++; ui.swap(ct, list); }
    });
})();
