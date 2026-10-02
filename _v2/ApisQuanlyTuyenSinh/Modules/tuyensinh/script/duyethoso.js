/* =========================================================================
   Duyệt hồ sơ (tuyển sinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/duyethoso.html + script/duyethoso.js (1.828 dòng)
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (Năm → Kế hoạch tuyển sinh → Hệ → Khóa · Tình trạng duyệt · Tỉnh → Huyện → Xã ·
   Trường học · Ngành nghề · Đối tác · từ khoá · Tìm kiếm) → "Danh sách hồ sơ thí sinh (n)" + "Duyệt hồ sơ" (các dòng đánh dấu):
   Họ đệm · Tên · Ngày sinh · Hệ · Khóa · Điện thoại · Tình trạng · Chi tiết · ô đánh dấu.
   Chi tiết → khung "DUYỆT HỒ SƠ" thay chỗ danh sách (zone_input): Thông tin cơ bản (ảnh…), Trường THPT đã học, Điểm thi vào
   lớp 9 / lớp 10 / lớp 12, Hồ sơ đính kèm, Hồ sơ giấy tờ, Tình trạng hồ sơ, Ghi chú + nút "Duyệt".
   Hộp "Duyệt hồ sơ" (modal_DuyetHoSo): Nội dung · các nút tình trạng lấy từ danh mục (loadBtnXacNhan) · Lịch sử duyệt.
   → khuôn A (ums.crud cho danh sách + thanh lọc), khung chi tiết tự dựng đổi chỗ bằng ui.swap, hộp duyệt kiểu nút lớn (.cc-xn,
     nạp css của Chuyên cần như SV kehoach/xacnhanketqua). Cột ô đánh dấu: ums.nhPhanLop.cotChon (nạp chéo NH phanlop/_chung.js).

   Lời gọi (chép nguyên, GET/POST như gốc):
     TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach  GET  strNguoiThucHien_Id                    → NAM
     TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung     GET  strTuKhoa '' (gốc đọc ô txtAAAA không tồn tại), strNguoiDung_Id,
                                                             strNam, pageIndex 1, pageSize 100000  → TEN
     TS_HeDaoTao/LayDanhSach    GET  strChucNang_Id, strTS_KeHoachTuyenSinh_Id, strNguoiThucHien_Id → TENHEDAOTAO
     TS_KhoaDaoTao/LayDanhSach  GET  strChucNang_Id, strNguoiThucHien_Id, strDaoTao_HeDaoTao_Id, strTS_KeHoachTuyenSinh_Id → TENKHOA
     TS_DoiTacTuyenSinh/LayDanhSach GET strTuKhoa '', strNguoiTao_Id = người đăng nhập                → HODEM + TEN
     danh mục TUYENSINH.XACNHANDUYETHOSO (sắp HESO1 — ô Tình trạng + các nút duyệt, THONGTIN1 = biểu tượng, THONGTIN2 = kiểu),
       TUYENSINH.NGANHNGHE / TRUONGHOC / HOCLUC / HANHKIEM / LOAIHOSO / TINHTRANGHOSO, NS.GITI / DATO / TOGI, CHUN.DMTT
     TS_HoSoDuTuyen/LayDanhSach GET  strTuKhoa, strTS_KeHoachTuyenSinh_Id, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id,
                                     strTS_DoiTacTuyenSinh_Id, strThuongTru_TinhThanh_Id, strNam, strThuongTru_QuanHuyen_Id,
                                     strThuongTru_PhuongXa_Id, strTruongPTTH_Id, strNganhNghe_Id, strTS_XacNhanDuyetHoSo_Id,
                                     strTS_XacNhanDuyetTT_Id '', strNguoiTao_Id, trang (máy chủ)
     TS_HoSoDuTuyen_Lop9 | Lop10 | Lop12 /LayDanhSach GET strTuKhoa '', strTS_HoSoDuTuyen_Id, strChucNang_Id,
                                     strNguoiTao_Id (Lop12 gửi '' như gốc), pageIndex 1, pageSize 10000 — lấy dòng CUỐI như gốc
     TS_HoSoDuTuyen_Truong/LayDanhSach GET … pageSize 1000000 · TS_HoSo/LayDanhSach GET (strTS_KeHoachTuyenSinh_Id = ô lọc)
     TS_Files (tệp đính kèm, chỉ xem)
     TS_XacNhanDuyetHoSo/LayDanhSach GET strTuKhoa '', strsanpham_Id, strTinhTrang_Id '', strNguoiThucHien_Id '', 1/100000
     TS_XacNhanDuyetHoSo/ThemMoi     POST strId '', strSanPham_Id = id hồ sơ, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id

   Khác gốc / tự chốt (ghi báo cáo):
     · Khung "DUYỆT HỒ SƠ" CHỈ XEM: gốc vẽ ô nhập nhưng không có nút lưu nào (#btnHS_Save không có trên html, save_HoSo và
       các save_HSDT_* / delete_* không nơi nào gọi; link "Xóa" trong hai lưới không gắn xử lý) → sửa ở đây không bao giờ
       được lưu. Bản mới hiện dạng "nhãn : giá trị" (.ums-kv) + bảng chỉ xem, giữ đúng thứ tự khối của gốc.
     · Chi tiết đọc từ DÒNG DANH SÁCH như gốc (objGetOneDataInData) — getDetail_HoSo có mà không dùng.
     · Mở hồ sơ khác thì xoá trắng điểm lớp 9/10/12, trường, giấy tờ trước khi nạp (gốc giữ giá trị của hồ sơ trước khi hồ sơ
       sau không có dòng tương ứng).
     · Lỗi gốc sửa: ô Học lực / Hạnh kiểm không bao giờ có danh mục (nạp vào id drop_HocLuc_9 … không tồn tại) → nay hiện tên;
       ô Tình trạng hồ sơ không nạp danh mục → hiện tên theo TUYENSINH.TINHTRANGHOSO (như NH phanlop/hosotuyensinh);
       ô Đối tác (lọc + Nguồn tuyển sinh) vẽ <option id=…> KHÔNG có value → lọc gửi CHỮ họ tên thay id → nay gửi ID;
       ô Đối tác chỉ nạp trang đầu 10 dòng (pageIndex/pageSize_default) → nạp đủ (1/1000000000 như NH).
     · Duyệt nhiều hồ sơ: gốc gửi TỪNG lời gọi rồi 500ms sau nạp lại → nay ui.batch có tiến độ rồi nạp lại. Lịch sử trong hộp
       duyệt nhiều: gốc tra theo hồ sơ mở GẦN NHẤT (id cũ còn đọng, không liên quan các dòng đánh dấu) → nay chỉ hiện khi đánh
       dấu đúng một hồ sơ, nhiều hồ sơ thì ghi "Chọn một hồ sơ để xem lịch sử".
     · Nút "Duyệt hồ sơ" gốc có hai chỗ (trên và dưới bảng) → một nút đầu trang (luật 5).
   Cặp cha → con: Năm → Kế hoạch TS → Hệ → Khóa, Tỉnh → Huyện → Xã — pat.chain (khoá con khi chưa chọn cha).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.nhPhanLop, esc = ui.esc;
    var root = document.getElementById('ts-duyethoso');
    if (!root || !P) return;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function uid() { return ums.session.userId; }
    function cn() { return ums.state.chucNangId; }
    function loi(noi) { return function (err) { ums.api.handle(err, noi); }; }

    var DM_DUYET = 'TUYENSINH.XACNHANDUYETHOSO';
    function tenDoiTac(r) { return (e(r.HODEM) + '   ' + e(r.TEN)).trim(); }
    var srcDoiTac = { call: { action: 'TS_DoiTacTuyenSinh/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: uid(),
        pageIndex: 1, pageSize: 1000000000 }, name: tenDoiTac };

    root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');

    var crud = ums.crud({
        root: zDs,
        title: 'Duyệt hồ sơ',
        listTitle: 'Danh sách hồ sơ thí sinh',
        icon: 'fa-rectangle-history-circle-user',
        toolbar: [{ text: 'Duyệt hồ sơ', icon: 'fa-circle-check', mod: 'primary', onClick: function () { duyetNhieu(); } }],
        filters: [
            { key: 'nam', type: 'select', label: 'Chọn năm', source: { call: { action: 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
                method: 'GET', strNguoiThucHien_Id: uid() }, id: 'NAM', name: 'NAM' } },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch tuyển sinh' },
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'tt', type: 'select', label: 'Tất cả tình trạng duyệt', source: { dm: DM_DUYET, sort: 'HESO1' } },
            { key: 'tinh', type: 'select', label: 'Chọn tỉnh' },
            { key: 'huyen', type: 'select', label: 'Chọn huyện' },
            { key: 'xa', type: 'select', label: 'Chọn xã' },
            { key: 'truong', type: 'select', label: 'Chọn trường học', source: { dm: 'TUYENSINH.TRUONGHOC' } },
            { key: 'nganh', type: 'select', label: 'Chọn ngành nghề', source: { dm: 'TUYENSINH.NGANHNGHE' } },
            { key: 'doitac', type: 'select', label: 'Chọn đối tác tuyển sinh', source: srcDoiTac },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'TS_HoSoDuTuyen/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strTS_KeHoachTuyenSinh_Id: f.kh, strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa,
                    strTS_DoiTacTuyenSinh_Id: f.doitac, strThuongTru_TinhThanh_Id: f.tinh, strNam: f.nam,
                    strThuongTru_QuanHuyen_Id: f.huyen, strThuongTru_PhuongXa_Id: f.xa, strTruongPTTH_Id: f.truong,
                    strNganhNghe_Id: f.nganh, strTS_XacNhanDuyetHoSo_Id: f.tt, strTS_XacNhanDuyetTT_Id: '', strNguoiTao_Id: uid() };
            }
        },
        columns: [
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', width: '120px', render: function (r) { return esc(ngaySinh(r)); } },
            { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Điện thoại', prop: 'TTCN_DIENTHOAI', cls: 'is-center is-nowrap', width: '150px' },
            { title: 'Tình trạng', prop: 'TS_XACNHANDUYETHOSO_TEN', cls: 'is-center', width: '150px' },
            { title: 'Chi tiết', cls: 'is-center', width: '80px', render: function (r) { return ui.iconBtn('view', e(r.ID)); } },
            P.cotChon('dhs')
        ]
    });
    var bang = crud.z('table');
    P.ganChon(bang, 'dhs');
    bang.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-act="view"][data-id]');
        if (!b) return;
        var id = b.getAttribute('data-id');
        var row = crud.rows.filter(function (r) { return e(r.ID) === id; })[0];
        if (row) moChiTiet(row);
    });

    function ngaySinh(r) { return e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH); }

    /* ---------- Thanh lọc: nối tầng ---------- */
    function fl(k) { return crud.root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
    var F = { nam: fl('nam'), kh: fl('kh'), he: fl('he'), khoa: fl('khoa'), tt: fl('tt'), tinh: fl('tinh'), huyen: fl('huyen'), xa: fl('xa') };
    function napKH() {
        if (!F.nam.value) { pat.fill(F.kh, []); return; }
        P.rows({ action: 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung', method: 'GET', strTuKhoa: '', strNguoiDung_Id: uid(),
            strNam: F.nam.value, pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(F.kh, r, { name: 'TEN' }); }, loi('kế hoạch tuyển sinh'));
    }
    function napHe() {
        if (!F.kh.value) { pat.fill(F.he, []); return; }
        P.rows({ action: 'TS_HeDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strTS_KeHoachTuyenSinh_Id: F.kh.value,
            strNguoiThucHien_Id: uid() }).then(function (r) { pat.fill(F.he, r, { name: 'TENHEDAOTAO' }); }, loi('hệ đào tạo'));
    }
    function napKhoa() {
        if (!F.he.value) { pat.fill(F.khoa, []); return; }
        P.rows({ action: 'TS_KhoaDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
            strDaoTao_HeDaoTao_Id: F.he.value, strTS_KeHoachTuyenSinh_Id: F.kh.value })
            .then(function (r) { pat.fill(F.khoa, r, { name: 'TENKHOA' }); }, loi('khóa đào tạo'));
    }
    var dsTT = [];
    function conTT(cha) { return dsTT.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
    pat.dmTinhThanh().then(function (r) { dsTT = r; pat.fill(F.tinh, conTT(null)); }, loi('tỉnh thành'));

    var S2 = 'select2:select select2:clear';
    jQuery(F.nam).on(S2, function () { napKH(); pat.fill(F.he, []); pat.fill(F.khoa, []); });
    jQuery(F.kh).on(S2, function () { napHe(); pat.fill(F.khoa, []); crud.load(1); });
    jQuery(F.he).on(S2, function () { napKhoa(); crud.load(1); });
    jQuery(F.khoa).on(S2, function () { crud.load(1); });
    jQuery(F.tt).on(S2, function () { crud.load(1); });
    jQuery(F.tinh).on(S2, function () { pat.fill(F.huyen, F.tinh.value ? conTT(F.tinh.value) : []); pat.fill(F.xa, []); });
    jQuery(F.huyen).on(S2, function () { pat.fill(F.xa, F.huyen.value ? conTT(F.huyen.value) : []); });
    pat.chain([F.nam, F.kh, F.he, F.khoa], { phatLai: false });
    pat.chain([F.tinh, F.huyen, F.xa], { phatLai: false });

    /* ---------- Bảng tra tên cho khung chi tiết ---------- */
    var traP = null;
    function traTen() {
        if (traP) return traP;
        function map(p, id, ten) {
            return p.then(function (rows) {
                var m = {};
                (rows || []).forEach(function (r) { m[e(r[id || 'ID'])] = typeof ten === 'function' ? ten(r) : e(r[ten || 'TEN']); });
                return m;
            }, function () { return {}; });
        }
        var ds = {
            gt: map(ums.api.dm('NS.GITI')), dt: map(ums.api.dm('NS.DATO')), tg: map(ums.api.dm('NS.TOGI')),
            nganh: map(ums.api.dm('TUYENSINH.NGANHNGHE')), hl: map(ums.api.dm('TUYENSINH.HOCLUC')),
            hk: map(ums.api.dm('TUYENSINH.HANHKIEM')), truong: map(ums.api.dm('TUYENSINH.TRUONGHOC')),
            loai: map(ums.api.dm('TUYENSINH.LOAIHOSO')), tths: map(ums.api.dm('TUYENSINH.TINHTRANGHOSO')),
            doitac: map(P.rows(Object.assign({}, srcDoiTac.call)), 'ID', tenDoiTac),
            dmtt: map(pat.dmTinhThanh())
        };
        var keys = Object.keys(ds);
        traP = Promise.all(keys.map(function (k) { return ds[k]; })).then(function (arr) {
            var o = {};
            keys.forEach(function (k, i) { o[k] = arr[i]; });
            return o;
        });
        return traP;
    }
    function ten(m, id) { return id ? e(m[e(id)]) : ''; }
    /* edu.extend.viewTinhThanhById: "Tỉnh, Huyện, Xã, địa chỉ" */
    function diaChi(T, tinh, huyen, xa, them) {
        return [ten(T.dmtt, tinh), ten(T.dmtt, huyen), ten(T.dmtt, xa), e(them)].filter(function (x) { return x; }).join(', ');
    }

    /* ---------- Khung "DUYỆT HỒ SƠ" (chỉ xem) ---------- */
    var dang = null;          // hồ sơ đang mở
    var tep = null;
    function kv(nhan, gt, dam) {
        return '<div class="ums-kv' + (dam === 'thuong' ? ' ums-kv--thuong' : dam ? ' ums-kv--dam' : '') + '"><span>' + esc(nhan) +
            '</span><b data-kv="' + esc(nhan) + '">' + esc(gt) + '</b></div>';
    }
    function lg(chu, x) { return '<div class="ums-legend">' + esc(chu) + '</div>' + (x ? '<div data-x="' + x + '"></div>' : ''); }

    zCt.innerHTML =
        '<div class="ums-panel dhs-ct"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-rectangle-history-circle-user"></i> Duyệt hồ sơ' +
            ' <span class="ums-u-faint ums-u-fz13" data-x="ten"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-x': 'dong' } }) +
                ui.btn('confirm', { text: 'Duyệt', attr: { 'data-x': 'duyet' } }) + '</div></div>' +
        '<div class="ums-panel__body">' +
            lg('Thông tin cơ bản') + '<div data-x="coban"></div>' +
            lg('Trường THPT đã học', 'thpt') +
            lg('Điểm thi vào lớp 9', 'l9') +
            lg('Điểm thi vào lớp 10', 'l10') +
            lg('Điểm thi lớp 12', 'l12') +
            lg('Thông tin hồ sơ đính kèm', 'tep') +
            lg('Hồ sơ giấy tờ', 'giayto') +
            lg('Tình trạng hồ sơ', 'tths') +
        '</div></div>';
    function X(k) { return zCt.querySelector('[data-x="' + k + '"]'); }
    tep = ums.files.mount(X('tep'), { api: 'TS_Files', readonly: true });
    X('dong').addEventListener('click', function () { dang = null; ui.swap(zCt, zDs); });
    X('duyet').addEventListener('click', function () { if (dang) hopDuyet([dang.ID], dang); });

    function khoiLop9(T, d, id) {
        var h = '<div class="ums-grid ums-grid--2">' + kv('Điểm TB cả năm', e(d.DIEMTBCN), 'thuong') + kv('Học lực', ten(T.hl, d.HOCLUC_ID)) +
            kv('Hạnh kiểm', ten(T.hk, d.HANHKIEM_ID)) + kv('Năm tốt nghiệp', e(d.NAMTN)) + '</div>';
        X(id).innerHTML = h;
    }
    function khoiLop10(d) {
        var h = '<div class="ums-grid ums-grid--2">';
        for (var i = 1; i <= 5; i++) {
            h += kv('Tên môn ' + i, e(d['MON' + i + '_TEN']), i === 1 ? 'thuong' : '') + kv('Điểm môn ' + i, e(d['MON' + i]));
        }
        h += kv('Ưu tiên', e(d.DIEMUUTIEN)) + kv('Tổng', e(d.TONGDIEM)) + '</div>';
        X('l10').innerHTML = h;
    }
    function con(ctl, id, nguoiTao) {
        return P.rows({ action: ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: id, strChucNang_Id: cn(),
            strNguoiTao_Id: nguoiTao, pageIndex: 1, pageSize: 10000 })
            .then(function (r) { return r.length ? r[r.length - 1] : {}; },           // gốc lấy dòng CUỐI
                function (err) { ums.api.handle(err, ctl); return {}; });
    }

    function moChiTiet(r) {
        dang = r;
        X('ten').textContent = '— ' + (e(r.HODEM) + ' ' + e(r.TEN)).trim() + ' - Mã số: ' + e(r.MASO);
        ['coban', 'thpt', 'l9', 'l10', 'l12', 'giayto', 'tths'].forEach(function (k) { X(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); });
        tep.load(r.ID);
        ui.swap(zDs, zCt);
        traTen().then(function (T) {
            if (dang !== r) return;
            X('coban').innerHTML =
                '<div class="dhs-coban"><div class="dhs-coban__anh">' + pat.anhNguoi(e(r.ANHCANHAN)) + '</div>' +
                '<div class="ums-grid ums-grid--2 dhs-coban__kv">' +
                    kv('Họ đệm', e(r.HODEM)) + kv('Tên', e(r.TEN), true) +
                    kv('Ngày sinh', ngaySinh(r)) + kv('Giới tính', ten(T.gt, r.GIOITINH_ID)) +
                    kv('Dân tộc', ten(T.dt, r.DANTOC_ID)) + kv('Tôn giáo', ten(T.tg, r.TONGIAO_ID)) +
                    kv('Số điện thoại', e(r.TTCN_DIENTHOAI)) + kv('Số CMND/CCCD', e(r.CMT_SO)) +
                    kv('Ngày vào Đoàn', e(r.DOAN_NGAYVAO)) + kv('Ngày vào Đảng', e(r.DANG_NGAYVAO)) +
                    '<div style="grid-column:1 / -1">' +
                        kv('Nơi sinh', diaChi(T, r.NOISINH_TINHTHANH_ID, r.NOISINH_QUANHUYEN_ID, r.NOISINH_PHUONGXA_ID, r.NOISINH_DIACHI), 'thuong') +
                        kv('Quê quán', diaChi(T, r.QUEQUAN_TINHTHANH_ID, r.QUEQUAN_QUANHUYEN_ID, r.QUEQUAN_PHUONGXA_ID, r.QUEQUAN_DIACHI)) +
                        kv('Hộ khẩu thường trú', diaChi(T, r.THUONGTRU_TINHTHANH_ID, r.THUONGTRU_QUANHUYEN_ID, r.THUONGTRU_PHUONGXA_ID, r.THUONGTRU_DIACHI)) +
                        kv('Ngành nghề', ten(T.nganh, r.NGANHNGHE_ID)) +
                    '</div>' +
                    kv('Nguồn tuyển sinh', ten(T.doitac, r.TS_DOITACTUYENSINH_ID)) + kv('Nguồn tuyển sinh khác', e(r.TS_DOITACTUYENSINH_KHAC)) +
                    kv('Họ tên bố', e(r.GIADINH_HOTENBO)) + kv('SĐT bố', e(r.GIADINH_SODIENTHOAIBO)) +
                    kv('Họ tên mẹ', e(r.GIADINH_HOTENME)) + kv('SĐT mẹ', e(r.GIADINH_SODIENTHOAIME)) +
                    kv('Người báo tin', e(r.GIADINH_NGUOIBAOTIN)) + kv('Địa chỉ báo tin', e(r.GIADINH_DIACHIBAOTIN)) +
                '</div></div>';
            X('tths').innerHTML = kv('Tình trạng hồ sơ', ten(T.tths, r.XACNHANTINHTRANGNOPHOSO_ID), 'thuong') + kv('Ghi chú', e(r.GHICHU));

            con('TS_HoSoDuTuyen_Lop9', r.ID, uid()).then(function (d) { if (dang === r) khoiLop9(T, d, 'l9'); });
            con('TS_HoSoDuTuyen_Lop10', r.ID, uid()).then(function (d) { if (dang === r) khoiLop10(d); });
            con('TS_HoSoDuTuyen_Lop12', r.ID, '').then(function (d) { if (dang === r) khoiLop9(T, d, 'l12'); });
            P.rows({ action: 'TS_HoSoDuTuyen_Truong/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: r.ID,
                strChucNang_Id: cn(), strNguoiTao_Id: uid(), pageIndex: 1, pageSize: 1000000 }).then(function (rows) {
                if (dang !== r) return;
                ui.table({ el: X('thpt'), rows: rows, empty: 'Chưa có trường THPT', columns: [
                    { title: 'Tên trường THPT', render: function (x) { return esc(ten(T.truong, x.TRUONG_ID)); } },
                    { title: 'Trường THPT khác', prop: 'TRUONG_KHAC' },
                    { title: 'Địa chỉ', prop: 'GHICHU' }
                ] });
            }, function (err) { X('thpt').innerHTML = ui.fail(err.message); });
            P.rows({ action: 'TS_HoSo/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_HoSoDuTuyen_Id: r.ID, strChucNang_Id: cn(),
                strLoaiHoSo_Id: '', strTS_KeHoachTuyenSinh_Id: F.kh.value, strNguoiTao_Id: uid(), pageIndex: 1, pageSize: 1000000 })
                .then(function (rows) {
                    if (dang !== r) return;
                    ui.table({ el: X('giayto'), rows: rows, stt: true, empty: 'Chưa có hồ sơ giấy tờ', columns: [
                        { title: 'Loại hồ sơ', render: function (x) { return esc(ten(T.loai, x.LOAIHOSO_ID)); } },
                        { title: 'Số lượng cần nộp', prop: 'SOLUONGCANNOP', cls: 'is-center', width: '150px' },
                        { title: 'Số lượng đã nộp', prop: 'SOLUONG', cls: 'is-center', width: '150px' },
                        { title: 'Ghi chú', prop: 'MOTA' }
                    ] });
                }, function (err) { X('giayto').innerHTML = ui.fail(err.message); });
        });
    }

    /* ---------- Hộp "Duyệt hồ sơ" ---------- */
    function duyetNhieu() {
        var ids = P.chon(bang, 'dhs');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var mot = ids.length === 1 ? crud.rows.filter(function (r) { return e(r.ID) === ids[0]; })[0] : null;
        hopDuyet(ids, mot);
    }

    function hopDuyet(ids, hs) {
        var chuDe = hs ? (e(hs.HODEM) + ' ' + e(hs.TEN)).trim() : '';
        var dlg = ui.dialog({
            title: 'Duyệt hồ sơ' + (chuDe ? ': ' + chuDe : ''), icon: 'fa-circle-check', size: 'lg',
            body: (ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ids.length + ' hồ sơ đã chọn.</p>' : '') +
                ui.field('Nội dung duyệt hồ sơ', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn duyệt hồ sơ</div><div class="cc-xn" data-x="nut">' +
                    ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử duyệt</div><div data-x="ls"></div>'
        });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ums.api.dm(DM_DUYET, 'HESO1').then(function (d) {
            q('nut').innerHTML = (d || []).length ? d.map(function (h) {
                var ic = ums.iconFA4 ? ums.iconFA4(e(h.THONGTIN1) || 'fa fa-check') : 'fa-light fa-circle-check';
                return '<button type="button" class="cc-xn__nut" data-hd="' + esc(e(h.ID)) + '"><i class="' + esc(ic) + '"' +
                    (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo danh mục tình trạng duyệt (TUYENSINH.XACNHANDUYETHOSO)');
        }, function (err) { q('nut').innerHTML = ui.fail(err.message); });

        if (ids.length === 1) {
            q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            P.rows({ action: 'TS_XacNhanDuyetHoSo/LayDanhSach', method: 'GET', strTuKhoa: '', strsanpham_Id: ids[0], strTinhTrang_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (rows) {
                ui.table({ el: q('ls'), rows: rows, stt: true, empty: 'Chưa có lịch sử duyệt', columns: [
                    { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' },
                    { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }
                ] });
            }, function (err) { q('ls').innerHTML = ui.fail(err.message); });
        } else {
            q('ls').innerHTML = ui.empty('Chọn một hồ sơ để xem lịch sử duyệt', 'fa-clock-rotate-left');
        }

        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var tinhTrang = b.getAttribute('data-hd'), noiDung = (q('nd').value || '').trim();
            dlg.close();
            var goi = ids.map(function (id) {
                return { action: 'TS_XacNhanDuyetHoSo/ThemMoi', method: 'POST', strId: '', strSanPham_Id: id, strNoiDung: noiDung,
                    strTinhTrang_Id: tinhTrang, strNguoiXacnhan_Id: uid() };
            });
            var p = goi.length === 1
                ? ums.api.call(goi[0]).then(function () { ui.toast('Duyệt hồ sơ thành công', 'ok'); },
                    function (err) { ui.toast('Duyệt hồ sơ thất bại: ' + err.message, 'warn'); })
                : ui.batch(goi, { title: 'Đang duyệt hồ sơ', okText: 'Duyệt hồ sơ thành công' });
            Promise.resolve(p).then(function () { crud.load(); });
        });
        return dlg;
    }
})();
