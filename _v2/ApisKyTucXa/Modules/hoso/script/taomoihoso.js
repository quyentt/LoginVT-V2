/* =========================================================================
   Danh sách người ở (Danh sách đối tượng ở ký túc xá)
   Bản gốc: ApisKyTucXa/Modules/hoso/html/taomoihoso.html + script/taomoihoso.js (1.889 dòng; tệp
   "taomoihoso (Azz's conflicted copy 2021-07-20).js" là bản sao Dropbox, không nạp).
   ---------------------------------------------------------------------------
   Bố cục gốc: MỘT cột — khung Tìm kiếm (17 ô) + "Danh sách đối tượng ở ký túc xá" (Thêm hồ sơ · Thêm hồ sơ từ
   đào tạo; chân bảng: Chuyển phòng · Gia hạn hợp đồng · Chấm dứt hợp đồng · Kỷ luật người ở · In danh sách người ở ·
   In hợp đồng sinh viên · In hợp đồng lưu học sinh); #zoneEdit biểu mẫu 5 nhóm thay chỗ danh sách; #zoneHoSoDaoTao
   tìm người học rồi "Thêm hồ sơ"; 5 modal (chuyển phòng, gia hạn, chấm dứt, kỷ luật, tình trạng tài chính).
   Ở đây: ums.crud (danh sách + lọc + biểu mẫu; nhóm 5 "Đăng ký phòng" vẽ vào vùng extra — khung chung X.khoiXepPhong),
   "Thêm hồ sơ từ đào tạo" = pat.formTrang; 4 việc hàng loạt + 3 khung xem = ui.dialog.
   Lời gọi (kiểu cũ, chép nguyên — xem _hoso.js): KTX_DoiTuongOKyTucXa/LayDanhSach · LayChiTiet · ThemMoi · CapNhat;
       KTX_DaXepPhong/ThemMoi (xếp phòng sau lưu, hỏi trước) · KTX_DaXepPhong/ChuyenPhongOKTX · KTX_GiaHanHopDong/GiaHanHopDong ·
       KTX_HopDong/ChamDutHopDong · KTX_DoiTuongOKyTucXa_ViPham/ThemMoi | LayDanhSach · KTX_QuaTrinhOKTX/LayDanhSach ·
       KTX_TinhHinhCongNoKTX/LayDanhSach (Data = { rsNo, rsDu, rsDaNop, rsPhaiNop, rsMien, rsRut }) ·
       KTX_DoiTuongDaoTao/LayDanhSach | ThemMoi · KTX_ToaNha/LayDanhSach · KTX_Phong/LayDanhSach · KHCT_NamNhapHoc/LayDanhSach
       Báo cáo: DoiTuongOKyTucXa (mọi ô lọc) · HopDongSinhVien / HopDongLuuHocSinh (strHopDong_Id của các dòng đánh dấu)
   Giữ như gốc:
     · Các việc hàng loạt gọi MỖI DÒNG một lời gọi; dòng thiếu KTX_DANHSACHDAXEPPHONG_ID (chuyển phòng, gia hạn) báo
       "Đối tượng gặp lỗi" như gốc; chấm dứt gửi KTX_HOPDONG_ID của dòng.
     · "Xem kỷ luật" chỉ hiện khi BIKYLUAT != "KHONGBI".
   Khác gốc (lỗi rõ / luật chung):
     · Ô lọc Tòa nhà → Phòng và ô Tòa nhà → Phòng trong biểu mẫu / hộp chuyển phòng / gia hạn theo luật cha → con
       (chưa chọn tòa thì Phòng khoá; hộp chuyển phòng / gia hạn gốc chỉ có một ô Phòng liệt kê MỌI phòng → thêm ô Tòa nhà).
     · Nút "Tạo hợp đồng" / "Viết lại" / "Cập nhật" của biểu mẫu gốc → nút Lưu chung của ums.crud (biểu mẫu chỉ lưu
       hồ sơ rồi hỏi xếp phòng — không tạo hợp đồng).
     · Ba khung popover (kỷ luật, quá trình ở, tài chính) → hộp thoại xem.
     · "Thêm hồ sơ từ đào tạo": lưới thẻ → bảng; gõ từ khoá tự tìm (gốc phải bấm Tìm kiếm).
     · delete_NO (KTX_DoiTuongOKyTucXa/Xoa) gốc không có nút gọi → cố ý bỏ (nút "Xoá đã chọn" của crud ẩn đi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.ktxHoSo;
    var root = document.getElementById('ktx-taomoihoso');
    if (!root) return;

    var dSelTT = { items: [{ ID: '1', TEN: 'Đang ở' }, { ID: '-1', TEN: 'Tất cả hồ sơ' }] };
    var dSelKL = { items: [{ ID: '-1', TEN: 'Tình trạng kỷ luật' }, { ID: '1', TEN: 'Đã bị kỷ luật' }, { ID: '0', TEN: 'Chưa bị kỷ luật' }] };
    var choXep = null, dangSua = null, xp = null;

    function locCall(f) {
        return X.dsCall({
            strTuKhoa: f.q || '', strTinhTrangHopDong_Id: f.tthd || '', dBiKyLuat: f.kl || -1,
            strNgayVao_TuNgay: f.vaoTu || '', strNgayVao_DenNgay: f.vaoDen || '', strNgayRa_TuNgay: f.raTu || '', strNgayRa_DenNgay: f.raDen || '',
            strKTX_ToaNha_Id: f.tn || '', strKTX_Phong_Id: f.phong || '', strPhanLoaiDoiTuong_Id: f.ldt || '', strKhoaDaoTao_Id: f.khoa || '',
            dDoiTuongConDangOKTX: f.tt || 1, strGioiTinh_Id: f.gt || '', strTrinhDoDaoTao_Id: f.td || '', strDienDaoTao_Id: f.ddt || '',
            strNganhDaoTao_Id: f.nganh || '', strNgayKiemTra: f.ngayKT || '', strNamNhapHoc: f.nam || ''
        });
    }

    var crud = ums.crud({
        root: root, title: 'Danh sách người ở', listTitle: 'Danh sách đối tượng ở ký túc xá', formTitle: 'hồ sơ người ở',
        icon: 'fa-building-user', addText: 'Thêm hồ sơ', formCols: 12, rowDelete: false, formDelete: false,
        filters: [
            { key: 'ldt', type: 'select', label: '--Tất cả loại đối tượng--', source: { dm: 'KTX_PHANLOAIDOITUONG' } },
            { key: 'tt', type: 'select', label: 'Tình trạng ở', source: dSelTT, value: '1' },
            { key: 'tn', type: 'select', label: 'Chọn tòa nhà' },
            { key: 'phong', type: 'select', label: 'Chọn phòng' },
            { key: 'gt', type: 'select', label: '--Tất cả giới tính--', source: { dm: 'NS.GITI' } },
            { key: 'td', type: 'select', label: '--Tất cả trình độ đào tạo--', source: { dm: 'KTX.TRINHDO' } },
            { key: 'ddt', type: 'select', label: '--Tất cả diện đào tạo--', source: { dm: 'KTX.DIDT' } },
            { key: 'nganh', type: 'select', label: '--Tất cả ngành--', source: { dm: 'CHUN.NGAN' } },
            { key: 'khoa', type: 'select', label: '--Tất cả khóa đào tạo--', source: { dm: 'KTX.KHOADAOTAO' } },
            { key: 'tthd', type: 'select', label: '--Chọn tình trạng hợp đồng--', source: { dm: 'KTX.TTHD' } },
            { key: 'kl', type: 'select', label: 'Tình trạng kỷ luật', source: dSelKL, value: '-1' },
            { key: 'nam', type: 'select', label: 'Chọn năm nhập học', source: { call: { action: 'KHCT_NamNhapHoc/LayDanhSach', method: 'GET' }, id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' } },
            { key: 'vaoTu', type: 'text', label: 'Tìm kiếm ngày vào từ ngày' },
            { key: 'vaoDen', type: 'text', label: 'Tìm kiếm ngày vào đến ngày' },
            { key: 'raTu', type: 'text', label: 'Tìm kiếm ngày ra từ ngày' },
            { key: 'raDen', type: 'text', label: 'Tìm kiếm ngày ra đến ngày' },
            { key: 'ngayKT', type: 'text', label: 'Ngày kiểm tra danh sách ở' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        toolbar: [
            { text: 'Thêm hồ sơ từ đào tạo', icon: 'fa-user-plus', onClick: moHoSoDaoTao }
        ],
        list: { paged: true, call: locCall },
        columns: [
            { title: 'Tòa nhà', prop: 'KTX_TOANHA_TEN', cls: 'is-center' },
            { title: 'Phòng', prop: 'KTX_PHONG_TEN', cls: 'is-center' },
            { title: 'Họ tên', render: function (r) { return esc(X.hoTen(r)); } },
            { title: 'Mã', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
            { title: 'Năm sinh', cls: 'is-center is-nowrap', render: function (r) { return esc(X.ngaySinh(r)); } },
            { title: 'Lớp', prop: 'LOPQUANLY', cls: 'is-center' },
            { title: 'Dân tộc', prop: 'DANTOC_TEN', cls: 'is-center' },
            { title: 'Kỷ luật', cls: 'is-center is-nowrap', render: function (r) {
                return r.BIKYLUAT != 'KHONGBI' ? ui.btn('view', { text: 'Xem kỷ luật', cls: 'ums-btn--sm', attr: { 'data-a': 'kyluat', 'data-id': r.ID, title: 'Xem tất cả kỷ luật từ trước tới nay' } }) : '';
            } },
            { title: 'Phòng đã ở', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('history', { text: 'Xem quá trình', cls: 'ums-btn--sm', attr: { 'data-a': 'quatrinh', 'data-id': r.ID, title: 'Xem quá trình' } });
            } },
            { title: 'Tài chính', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('view', { text: 'Xem TC', cls: 'ums-btn--sm', attr: { 'data-a': 'taichinh', 'data-id': r.ID } });
            } }
        ],
        fields: X.fieldsNO(),
        detail: function (row) { return { action: X.P + 'LayChiTiet', method: 'GET', strId: row.ID }; },
        onForm: function (row, c, extra) {
            extra.innerHTML = '';
            xp = X.khoiXepPhong(extra);
            xp.hide(!!(row && X.e(row.KTX_PHONG_TEN)));      // đã có phòng thì không hiện nhóm 5 (như gốc)
        },
        save: function (v, row) {
            dangSua = row || null;
            choXep = xp ? xp.val() : null;
            return X.saveNO(v, row);
        },
        onSaved: function (me, result, isEdit) {
            var id = isEdit ? (dangSua && dangSua.ID) : X.e(result && result.raw && result.raw.Id);
            var c = choXep; choXep = null;
            if (!(id && c && c.phong && c.ngayVao)) return;
            ui.confirm((isEdit ? 'Cập nhật' : 'Thêm hồ sơ') + ' thành công. Bạn có chắc chắn muốn xếp phòng không?').then(function (yes) {
                if (!yes) return;
                X.xepPhong(id, c.phong, c.ngayVao, c.ngayRa).then(function (d) {
                    if (d.message) ui.toast(d.message, 'warn'); else ui.toast('Đăng ký thành công!', 'ok');
                    me.load();
                }, X.loi('xếp phòng'));
            });
        },
        /* Gốc không có nút xoá (delete_NO không nơi nào gọi) — `remove` chỉ để có cột đánh dấu dòng cho 7 việc hàng loạt */
        remove: function (ids) { return ids.map(function (id) { return { action: X.P + 'Xoa', method: 'POST', strIds: id }; }); }
    });

    /* Ẩn "Xoá đã chọn" (gốc không có); ô lọc ngày thành ô chọn ngày; ô từ khoá gõ là tự tìm */
    var bXoa = root.querySelector('.ums-btn--delsel'); if (bXoa) bXoa.hidden = true;
    function fl(k) { return root.querySelector('[data-cf="' + crud.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }
    ['vaoTu', 'vaoDen', 'raTu', 'raDen', 'ngayKT'].forEach(function (k) { var e = fl(k); if (e) { e.setAttribute('data-date', ''); e.placeholder = e.placeholder; } });
    var fq = fl('q'); if (fq) fq.setAttribute('data-tutim', '1');
    ui.enhance(root.querySelector('.ums-filter') || root);
    ums.ktx.noiToaNhaPhong(fl('tn'), fl('phong'));     // đổ tòa + nối Tòa nhà → Phòng (bản chung _ktx.js)

    /* Chân bảng: 7 nút của box-footer gốc */
    var zT = crud.z('table');
    if (zT) zT.insertAdjacentHTML('afterend', '<div class="ums-panel__foot"><div class="ums-row">' +
        ui.btn('confirm', { text: 'Chuyển phòng', icon: 'fa-shuffle', mod: 'out-primary', attr: { 'data-a': 'chuyenphong' } }) +
        ui.btn('confirm', { text: 'Gia hạn hợp đồng', icon: 'fa-calendar-plus', mod: 'out-primary', attr: { 'data-a': 'giahan' } }) +
        ui.btn('confirm', { text: 'Chấm dứt hợp đồng', icon: 'fa-user-xmark', mod: 'out-danger', attr: { 'data-a': 'chamdut' } }) +
        ui.btn('confirm', { text: 'Kỷ luật người ở', icon: 'fa-gavel', mod: 'out-warn', attr: { 'data-a': 'kyluat-them' } }) +
        ui.btn('print', { text: 'In danh sách người ở', attr: { 'data-a': 'in-ds' } }) +
        ui.btn('print', { text: 'In hợp đồng sinh viên', attr: { 'data-a': 'in-hd', 'data-ma': 'HopDongSinhVien' } }) +
        ui.btn('print', { text: 'In hợp đồng lưu học sinh', attr: { 'data-a': 'in-hd', 'data-ma': 'HopDongLuuHocSinh' } }) +
        '</div></div>');

    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.closest('.ums-formtrang')) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        var r = crud.rows.filter(function (x) { return x.ID === id; })[0];
        if (a === 'kyluat') xemKyLuat(r);
        else if (a === 'quatrinh') xemQuaTrinh(r);
        else if (a === 'taichinh') xemTaiChinh(r);
        else if (a === 'chuyenphong') hopChuyenPhong();
        else if (a === 'giahan') hopGiaHan();
        else if (a === 'chamdut') hopChamDut();
        else if (a === 'kyluat-them') hopKyLuat();
        else if (a === 'in-ds') inDanhSach();
        else if (a === 'in-hd') inHopDong(b.getAttribute('data-ma'));
    });

    /* ---------- Ba khung xem ----------------------------------------------- */
    function bangHop(title, icon, size, columns, p, viec) {
        var dlg = ui.dialog({ title: title, icon: icon, size: size || 'lg', body: '<div data-z="b"></div>' });
        var host = dlg.body.querySelector('[data-z="b"]');
        p.then(function (rows) { ui.table({ el: host, columns: columns, rows: rows, empty: 'Không có dữ liệu' }); }, X.loi(viec));
        return dlg;
    }
    function xemKyLuat(r) {
        if (!r) return;
        bangHop('Kỷ luật — ' + X.hoTen(r), 'fa-gavel', 'lg', [
            { title: 'Loại vi phạm', prop: 'LOAIVIPHAM_TEN', cls: 'is-center' },
            { title: 'Hình thức xử lý', prop: 'HINHTHUCXULY_TEN' },
            { title: 'Cán bộ tạo', prop: 'NGUOITHUCHIEN_TENDAYDU' },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-right is-nowrap' }
        ], ums.api.call({ action: 'KTX_DoiTuongOKyTucXa_ViPham/LayDanhSach', method: 'GET', strTuKhoa: '', strHinhThucXuLy_Id: '', strLoaiViPham_Id: '',
            strKTX_DoiTuongOKyTucXa_Id: r.ID, pageIndex: 1, pageSize: 10000 }).then(function (d) { return X.arr(d.data); }), 'danh sách kỷ luật');
    }
    function xemQuaTrinh(r) {
        if (!r) return;
        bangHop('Quá trình ở — ' + X.hoTen(r), 'fa-clock-rotate-left', 'lg', [
            { title: 'Phòng', cls: 'is-center', render: function (x) { return esc(X.e(x.KTX_TOANHA_TEN) + ' - ' + X.e(x.KTX_PHONG_TEN)); } },
            { title: 'Ngày vào', prop: 'NGAYVAO', cls: 'is-center is-nowrap' },
            { title: 'Ngày ra', prop: 'NGAYRA', cls: 'is-center is-nowrap' },
            { title: 'Cán bộ tạo', prop: 'NGUOITHUCHIEN_TENDAYDU', cls: 'is-right' }
        ], ums.api.call({ action: 'KTX_QuaTrinhOKTX/LayDanhSach', method: 'GET', strKTX_DoiTuongOKyTucXa_Id: r.ID }).then(function (d) { return X.arr(d.data); }), 'quá trình ở');
    }
    function xemTaiChinh(r) {
        if (!r) return;
        var KHOI = [['rsNo', 'Danh sách còn nợ', false], ['rsDu', 'Danh sách còn dư', false], ['rsDaNop', 'Danh sách đã nộp', true],
            ['rsPhaiNop', 'Danh sách phải nộp', true], ['rsMien', 'Danh sách miễn', true], ['rsRut', 'Danh sách rút', true]];
        var dlg = ui.dialog({ title: 'Tình trạng tài chính - ' + X.hoTen(r), icon: 'fa-coins', size: 'xl',
            body: KHOI.map(function (k) { return '<div class="ums-legend">' + esc(k[1]) + '</div><div data-z="' + k[0] + '"></div>'; }).join('') });
        ums.api.call({ action: 'KTX_TinhHinhCongNoKTX/LayDanhSach', method: 'GET', strKTX_DoiTuongOKTX_Id: r.ID }).then(function (d) {
            var j = d.data || {};
            KHOI.forEach(function (k) {
                var rows = X.arr(j[k[0]]), host = dlg.body.querySelector('[data-z="' + k[0] + '"]');
                var cols = [
                    { title: 'Khoản', prop: 'TAICHINH_CACKHOANTHU_TEN', cls: 'is-center' },
                    { title: 'Số tiền', cls: 'is-right is-nowrap', render: function (x) { return ui.money(x.SOTIEN); } },
                    { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }
                ];
                if (k[2]) cols.push({ title: 'Nội dung', prop: 'NOIDUNG' });
                ui.table({ el: host, columns: cols, rows: rows, empty: 'Không có dữ liệu' });
                if (rows.length) {
                    var tong = rows.reduce(function (s, x) { return s + (Number(x.SOTIEN) || 0); }, 0);
                    host.insertAdjacentHTML('beforeend', '<div class="ums-tablefoot"><span class="ums-tablefoot__sum">Tổng: ' + ui.money(tong) + '</span></div>');
                }
            });
        }, X.loi('tình trạng tài chính'));
    }

    /* ---------- Thêm hồ sơ từ đào tạo (KTX_DoiTuongDaoTao) --------------------- */
    function moHoSoDaoTao() {
        var ft = pat.formTrang({ host: root, title: 'Khởi tạo hồ sơ từ đào tạo', icon: 'fa-user-plus', cols: 1,
            body: '<div class="ums-filter ums-u-mb-4"><div class="ums-field"><input class="ums-input" data-dt="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                  '<div data-dt="ds">' + ui.empty('Nhập từ khóa để tìm người học') + '</div>' });
        var q = ft.body.querySelector('[data-dt="q"]'), ds = ft.body.querySelector('[data-dt="ds"]'), hen = 0, rows = [];
        function tai() {
            ums.api.call({ action: 'KTX_DoiTuongDaoTao/LayDanhSach', method: 'GET', strTuKhoa: pat.val(q), strGioiTinh: '-1', pageIndex: 1, pageSize: 100000 }).then(function (d) {
                rows = X.arr(d.data);
                ui.table({ el: ds, rows: rows, empty: 'Không tìm thấy người học', columns: [
                    { title: 'Ảnh', cls: 'is-center', width: '56px', render: function (x) { return pat.anhNguoi(x.ANH); } },
                    { title: 'Mã', prop: 'MASV', cls: 'is-nowrap' },
                    { title: 'Tên', render: function (x) { return esc(X.hoTen(x)); } },
                    { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Khóa', prop: 'KHOAHOC_TEN', cls: 'is-center' },
                    { title: 'Lớp', prop: 'LOPQUANLY_TEN', cls: 'is-center' },
                    { title: 'Tình trạng', prop: 'TINHTRANG', cls: 'is-center' },
                    { title: 'Thao tác', cls: 'is-actions is-nowrap', render: function (x) { return ui.btn('add', { text: 'Thêm hồ sơ', cls: 'ums-btn--sm', attr: { 'data-dt': 'them', 'data-id': x.ID } }); } }
                ] });
            }, X.loi('danh sách người học'));
        }
        q.addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(tai, 400); });
        q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(hen); tai(); } });
        ft.body.addEventListener('click', function (e) {
            var b = e.target.closest('[data-dt="them"]'); if (!b) return;
            var x = rows.filter(function (y) { return y.ID === b.getAttribute('data-id'); })[0]; if (!x) return;
            ui.confirm('Bạn có chắc chắn thêm hồ sơ ' + X.hoTen(x) + ' từ đào tạo không?').then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'KTX_DoiTuongDaoTao/ThemMoi', method: 'POST', strNguoiHoc_Id: x.ID }).then(function () {
                    ui.toast('Thêm hồ sơ thành công!', 'ok'); crud.load(1);
                }, X.loi('thêm hồ sơ từ đào tạo'));
            });
        });
        q.focus();
    }

    /* ---------- Bốn việc hàng loạt trên dòng đã đánh dấu ------------------------ */
    function daChon(msg) {
        var r = crud.pickedRows();
        if (!r.length) { ui.toast(msg || 'Vui lòng chọn đối tượng?', 'warn'); return null; }
        return r;
    }
    function oPhong(nhanPhong, ghiChu) {
        return '<div class="ums-grid ums-grid--2">' +
            ui.field('Tòa nhà', '<select class="ums-select" data-h="tn" data-ph="Chọn tòa nhà"><option value=""></option></select>') +
            ui.field(nhanPhong, '<select class="ums-select" data-h="phong" data-ph="--Chọn phòng chuyển đến--"><option value=""></option></select>', { hint: ghiChu }) +
            '</div>';
    }
    function napToaNha(body) {
        var tn = body.querySelector('[data-h="tn"]'), p = body.querySelector('[data-h="phong"]');
        ums.ktx.noiToaNhaPhong(tn, p);
    }
    function h(body, k) { return pat.val(body.querySelector('[data-h="' + k + '"]')); }
    function chay(calls, title, loiDong, me) {
        if (!calls.length) { ui.toast(loiDong, 'warn'); return Promise.resolve(); }
        return ui.batch(calls, { title: title }).then(function (r) {
            if (loiDong) ui.toast(loiDong, 'warn');
            crud.load();
        });
    }
    function hopChuyenPhong() {
        var rows = daChon('Vui lòng chọn đối tượng cần chuyển?'); if (!rows) return;
        var dlg = ui.dialog({ title: 'Chuyển phòng', icon: 'fa-shuffle', size: 'md',
            body: oPhong('Phòng chuyển đến') + ui.field('Ngày chuyển', '<input class="ums-input" data-h="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off">'),
            buttons: [{ text: 'Chuyển phòng', kind: 'confirm', onClick: function (api) {
                var b = api.body, phong = h(b, 'phong');
                if (!phong) { ui.toast('Vui lòng chọn phòng cần chuyển?!', 'warn'); return false; }
                var loi = 0, calls = [];
                rows.forEach(function (r) {
                    if (!X.e(r.KTX_DANHSACHDAXEPPHONG_ID)) { loi++; return; }
                    calls.push({ action: 'KTX_DaXepPhong/ChuyenPhongOKTX', method: 'POST', strNgayVao: h(b, 'ngay'), strKTX_Phong_ChuyenDen_Id: phong, strKTX_DanhSachDaXepPhong_Id: r.KTX_DANHSACHDAXEPPHONG_ID });
                });
                chay(calls, 'Đang chuyển phòng', loi ? loi + ' đối tượng gặp lỗi (chưa xếp phòng). Vui lòng liên hệ admin?!' : '');
            } }] });
        ui.enhance(dlg.body); napToaNha(dlg.body);
    }
    function hopGiaHan() {
        var rows = daChon(); if (!rows) return;
        var dlg = ui.dialog({ title: 'Gia hạn hợp đồng', icon: 'fa-calendar-plus', size: 'md',
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Ngày bắt đầu hợp đồng', '<input class="ums-input" data-h="bd" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Ngày kết thúc hợp đồng', '<input class="ums-input" data-h="kt" data-date placeholder="dd/mm/yyyy" autocomplete="off">') + '</div>' +
                '<label class="ums-check ums-u-mt-3"><input type="checkbox" data-h="bao"> <span>Bao phòng (Thực hiện gia hạn có bao phòng cho toàn bộ sinh viên đã chọn)</span></label>' +
                '<div class="ums-u-mt-3">' + oPhong('Phòng chuyển đến', 'Chú ý: Nếu không chuyển sang phòng khác, bỏ qua bước này') + '</div>',
            buttons: [{ text: 'Gia hạn', kind: 'confirm', onClick: function (api) {
                var b = api.body, bao = b.querySelector('[data-h="bao"]').checked ? 1 : 0, loi = 0, calls = [];
                rows.forEach(function (r) {
                    if (!X.e(r.KTX_DANHSACHDAXEPPHONG_ID)) { loi++; return; }
                    calls.push({ action: 'KTX_GiaHanHopDong/GiaHanHopDong', method: 'POST', strNgayBatDau: h(b, 'bd'), strNgayKetThuc: h(b, 'kt'),
                        strKTX_DanhSachDaXepPhong_Id: r.KTX_DANHSACHDAXEPPHONG_ID, dBaoPhong: bao, strKTX_ChuyenSangPhongMoi_Id: h(b, 'phong') });
                });
                chay(calls, 'Đang gia hạn hợp đồng', loi ? loi + ' đối tượng không tìm được phòng đang ở. Vui lòng liên hệ admin?!' : '');
            } }] });
        ui.enhance(dlg.body); napToaNha(dlg.body);
    }
    function hopChamDut() {
        var rows = daChon(); if (!rows) return;
        var dlg = ui.dialog({ title: 'Chấm dứt hợp đồng', icon: 'fa-user-xmark', size: 'md',
            body: ui.field('Lý do chấm dứt', '<input class="ums-input" data-h="lydo" autocomplete="off">') +
                ui.field('Ngày chấm dứt', '<input class="ums-input" data-h="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Mô tả', '<input class="ums-input" data-h="mota" autocomplete="off">'),
            buttons: [{ text: 'Chấm dứt hợp đồng', kind: 'confirm', mod: 'danger', onClick: function (api) {
                var b = api.body;
                var calls = rows.map(function (r) {
                    return { action: 'KTX_HopDong/ChamDutHopDong', method: 'POST', strNgayKetThucHopHong: h(b, 'ngay'), strKTX_HopDong_Id: X.e(r.KTX_HOPDONG_ID), strLyDo: h(b, 'lydo'), strMoTa: h(b, 'mota') };
                });
                chay(calls, 'Đang chấm dứt hợp đồng', '');
            } }] });
        ui.enhance(dlg.body);
    }
    function hopKyLuat() {
        var rows = daChon(); if (!rows) return;
        var dlg = ui.dialog({ title: 'Kỷ luật đối tượng ở', icon: 'fa-gavel', size: 'md',
            body: ui.field('Loại vi phạm', '<select class="ums-select" data-h="loai" data-ph="--Chọn loại vi phạm--"><option value=""></option></select>') +
                ui.field('Hình thức xử lý', '<select class="ums-select" data-h="ht" data-ph="--Chọn hình thức xử lý--"><option value=""></option></select>') +
                ui.field('Ngày áp dụng', '<input class="ums-input" data-h="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                ui.field('Mô tả', '<input class="ums-input" data-h="mota" autocomplete="off">'),
            buttons: [{ text: 'Lưu kỷ luật đối tượng', kind: 'save', onClick: function (api) {
                var b = api.body;
                var calls = rows.map(function (r) {
                    return { action: 'KTX_DoiTuongOKyTucXa_ViPham/ThemMoi', method: 'POST', strKTX_DoiTuongOKyTucXa_Id: r.ID, strHinhThucXuLy_Id: h(b, 'ht'),
                        strLoaiViPham_Id: h(b, 'loai'), strMoTa: h(b, 'mota'), strNgayApDung: h(b, 'ngay') };
                });
                chay(calls, 'Đang lưu kỷ luật', '');
            } }] });
        ui.enhance(dlg.body);
        ums.api.dm('KTX.KYLUAT.LOAIVYPHAM').then(function (rs) { pat.fill(dlg.body.querySelector('[data-h="loai"]'), rs); }, X.loi('loại vi phạm'));
        ums.api.dm('KTX.KYLUAT.HINHTHUCXULY').then(function (rs) { pat.fill(dlg.body.querySelector('[data-h="ht"]'), rs); }, X.loi('hình thức xử lý'));
    }

    /* ---------- In ------------------------------------------------------------- */
    function inDanhSach() {
        var f = crud.filterValues();
        ums.report.run('DoiTuongOKyTucXa', { collect: function (add) {
            var c = locCall(f);
            ['strTuKhoa', 'strTinhTrangHopDong_Id', 'dBiKyLuat', 'strNgayVao_TuNgay', 'strNgayVao_DenNgay', 'strNgayRa_TuNgay', 'strNgayRa_DenNgay', 'strKTX_ToaNha_Id',
                'strLopQuanLy_Id', 'strKTX_Phong_Id', 'strPhanLoaiDoiTuong_Id', 'strKhoaDaoTao_Id', 'dDoiTuongConDangOKTX', 'strGioiTinh_Id', 'strTrinhDoDaoTao_Id',
                'strDienDaoTao_Id', 'strNganhDaoTao_Id', 'strNgayKiemTra', 'strNamNhapHoc'].forEach(function (k) { add(k, c[k]); });
        } });
    }
    function inHopDong(ma) {
        var rows = daChon(); if (!rows) return;
        var ids = rows.map(function (r) { return X.e(r.KTX_HOPDONG_ID); }).filter(Boolean);
        ums.report.run(ma, { collect: function (add) { add('strHopDong_Id', ids.join(',')); } });
    }
})();
