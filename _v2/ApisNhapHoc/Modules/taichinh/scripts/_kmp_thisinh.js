/* =========================================================================
   Khai mức phí thu nhập học — phần THÍ SINH của kế hoạch (ums.kmp)
     K.taoMucPhi(khId, sau)      "Tạo mức phí nhập học cho kế hoạch"
     K.mucPhiDaGan(khId)         "Xem mức phí đã gán cho thí sinh" (+ hộp chi tiết phải nộp)
     K.dsNhapHocThuTien(khId)    "Danh sách nhập học & thu tiền"
   Bản gốc: ApisNhapHoc/Modules/taichinh/scripts/khaimucphinhaphoc.js
   (taoMucPhi_ChoKeHoach, openModal_MucPhiDaGan, xem_ChiTiet_PhaiNop, openModal_DSNHTT).
   ---------------------------------------------------------------------------
   Lời gọi (SV_CORE_NhapHoc_ThuTien_MH, POST — chép nguyên):
     LayDSQLSV_NguoiHoc_TTTS     strTuKhoa '', strTaiChinh_KeHoach_Id, dDaNhapHoc 0, pageIndex 1, pageSize 100000
     Gen_TaiChinh_PhaiNop_Intake strCore_Person_Intake_Id, dChayThu 0, dGhiLog 1, strChucNangThucHien_Id
     LayDSMucPhiDaGanNhapHoc     strTuKhoa '', strTaiChinh_KeHoach_Id, dDaNhapHoc (ô tình trạng), pageIndex 1, pageSize 100000
     LayDS_PhaiNop_TheoIntake    strCore_Person_Intake_Id
     LayDSThiSinhNhapHoc         strTuKhoa '', strTaiChinh_KeHoach_Id, dDaNhapHoc 0, pageIndex 1, pageSize 100000
   Giữ như gốc:
     · Tạo mức phí chạy TUẦN TỰ từng thí sinh (không song song), dòng không có
       ID tính là lỗi và bỏ qua; xong thì báo tổng / thành công / lỗi và tải lại
       danh sách nhóm.
     · Hai danh sách tải HẾT một lần rồi lọc / chia trang tại máy: từ khoá, khoảng
       tổng phí, tình trạng nhập học (DSNHTT lọc tại máy theo IsStudyCreated; mức
       phí đã gán gửi dDaNhapHoc lên máy chủ và tải lại). Tổng cộng tính trên TOÀN
       BỘ danh sách đang lọc. Xuất Excel xuất toàn bộ danh sách đang lọc; Ctrl+G
       trong hộp = Xuất Excel.
     · DSNHTT ẩn cột "Đã nhập học" và "Còn phải nộp" như bản gốc (sếp yêu cầu).
   Khác gốc:
     · Tiến độ tạo mức phí dùng ums.ui.batch (thanh tiến độ); nhật ký từng thí
       sinh hiện ở hộp kết quả cuối (gốc ghi dần trong hộp tiến độ).
     · Nút "Sửa" cạnh Tổng phí phải nộp chỉ MỞ XEM chi tiết các khoản phải nộp
       (không sửa được gì) → đổi chữ thành "Chi tiết", biểu tượng xem.
     · Xuất Excel dùng ums.ui.xuatXls (không tải SheetJS từ ba CDN như gốc).
     · Bỏ thanh cuộn ngang giả trên đầu bảng (bảng tầng chung kéo chuột để vuốt ngang).
   Cố ý bỏ: nhánh "_genFrom_MucPhiDaGan" (gốc không nơi nào bật cờ này — mã chết),
   log console dò tên cột.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var K = ums.kmp;
    var e = K.e, pick = K.pick, pickCI = K.pickCI;

    /* =====================================================================
       Tạo mức phí nhập học cho kế hoạch
       ===================================================================== */
    K.taoMucPhi = function (khId, sau) {
        ums.api.call(K.goi('nguoiHocTTTS', {
            strTuKhoa: '',
            strTaiChinh_KeHoach_Id: khId,
            strNguoiThucHien_Id: ums.session.userId,
            dDaNhapHoc: 0,
            pageIndex: 1,
            pageSize: 100000
        })).then(function (r) {
            var ds = K.rows(r);
            if (!ds.length) { ui.toast('Không có thí sinh nào để xử lý.', 'warn'); return; }
            var nhatKy = [];
            var viec = ds.map(function (row, i) {
                var id = pick(row, 'ID', 'CORE_PERSON_INTAKE_ID', 'Core_Person_Intake_Id');
                var ten = (e(row.HODEM) + ' ' + e(row.TEN)).trim() || pick(row, 'HOTEN', 'HO_TEN', 'SOBAODANH') || id;
                return function () {
                    if (!id) {
                        nhatKy.push({ stt: i + 1, ten: ten, ok: false, msg: 'bỏ qua: không có ID' });
                        return Promise.reject(new Error('Không có ID thí sinh'));
                    }
                    return ums.api.call(K.goi('genPhaiNop', {
                        strCore_Person_Intake_Id: id,
                        dChayThu: 0,
                        dGhiLog: 1,
                        strNguoiThucHien_Id: ums.session.userId,
                        strChucNangThucHien_Id: (ums.state && ums.state.chucNangId) || ''
                    })).then(function (res) {
                        nhatKy.push({ stt: i + 1, ten: ten, ok: true, msg: res.message || '' });
                    }, function (err) {
                        nhatKy.push({ stt: i + 1, ten: ten, ok: false, msg: err.message || '' });
                        throw err;
                    });
                };
            });
            return ui.batch(viec, { title: 'Tạo mức phí nhập học cho kế hoạch', show: true, concurrency: 1, toast: false })
                .then(function (kq) {
                    ketQua(ds.length, kq.ok, kq.fail, nhatKy);
                    if (sau) sau();
                });
        }).catch(function (err) { ums.api.handle(err, 'tải danh sách thí sinh'); });
    };

    function ketQua(tong, ok, loi, nhatKy) {
        var dlg = ui.dialog({
            title: 'Đã hoàn tất tạo phí nhập học', icon: 'fa-wand-magic-sparkles', size: 'lg',
            body: '<div class="ums-kv"><span>Tổng</span><b>' + ui.so(tong) + ' thí sinh</b></div>' +
                '<div class="ums-kv"><span>Thành công</span><b>' + ui.so(ok) + '</b></div>' +
                '<div class="ums-kv"><span>Lỗi</span><b' + (loi ? ' class="ums-u-danger"' : '') + '>' + ui.so(loi) + '</b></div>' +
                '<div class="ums-legend ums-legend--cach">Nhật ký</div><div data-nk></div>'
        });
        ui.table({
            el: dlg.body.querySelector('[data-nk]'), stt: false,
            rows: nhatKy.sort(function (a, b) { return a.stt - b.stt; }),
            columns: [
                { title: 'Stt', cls: 'is-center', width: '56px', render: function (x) { return x.stt; } },
                { title: 'Thí sinh', render: function (x) { return ui.esc(x.ten); } },
                { title: 'Kết quả', render: function (x) {
                    return (x.ok ? ui.badge('OK', 'ok') : ui.badge('Lỗi', 'bad')) + (x.msg ? ' ' + ui.esc(x.msg) : '');
                } }
            ]
        });
    }

    /* =====================================================================
       Mức phí đã gán cho thí sinh
       ===================================================================== */
    var MP = {
        id: function (r) { return pick(r, 'ID', 'CORE_PERSON_INTAKE_ID', 'Core_Person_Intake_Id'); },
        cccd: function (r) { return pick(r, 'IDENTIFIER_NO', 'Identifier_No', 'CCCD'); },
        ma: function (r) { return pick(r, 'CURRENT_EMPLOYEE_CODE', 'Current_Employee_Code', 'MASO', 'MA_SO'); },
        ten: function (r) { return pick(r, 'FULL_NAME', 'Full_Name', 'HOTEN', 'HO_TEN'); },
        gt: function (r) { return pick(r, 'GENDER_TEN', 'Gender_Ten', 'GIOITINH_TEN'); },
        ns: function (r) { return pick(r, 'DATE_OF_BIRTH', 'Date_Of_Birth', 'NGAYSINH'); },
        nganh: function (r) { return pick(r, 'DAOTAO_NGANH_TS_TEN', 'DaoTao_Nganh_TS_Ten', 'NGANH_TS_TEN', 'TEN_NGANH_TS'); },
        ct: function (r) {
            var ma = pick(r, 'MACHUONGTRINH', 'MaChuongTrinh', 'MA_CHUONGTRINH');
            return pick(r, 'TENCHUONGTRINH', 'TenChuongTrinh', 'TEN_CHUONGTRINH') + (ma ? ' (' + ma + ')' : '');
        },
        ctTen: function (r) { return pick(r, 'TENCHUONGTRINH', 'TenChuongTrinh', 'TEN_CHUONGTRINH'); },
        lop: function (r) { return pick(r, 'LOPQUANLY_TEN', 'LopQuanLy_Ten', 'LOP_QUANLY_TEN'); },
        tt: function (r) { return pick(r, 'THONGTINMUCPHI', 'ThongTinMucPhi', 'THONG_TIN_MUC_PHI'); },
        tong: function (r) { return pick(r, 'TONGMUCPHI', 'TongMucPhi', 'TONG_MUC_PHI'); },
        gc: function (r) { return pick(r, 'GHICHU', 'GhiChu', 'GHI_CHU'); }
    };
    function thanhBoLoc(key, ds) {
        // ds: [[loại, khoá, chữ gợi ý / nhãn]]
        return '<div class="ums-filter ums-u-mb-4">' + ds.map(function (x) {
            if (x[0] === 'input') return '<div class="ums-field"><input class="ums-input" data-' + key + '="' + x[1] + '" placeholder="' + ui.esc(x[2]) + '" autocomplete="off"' + (x[3] ? ' inputmode="numeric"' : '') + '></div>';
            if (x[0] === 'select') return '<div class="ums-field"><select class="ums-select" data-' + key + '="' + x[1] + '" data-required data-ph="' + ui.esc(x[2][0][1]) + '">' +
                x[2].map(function (o) { return '<option value="' + o[0] + '">' + ui.esc(o[1]) + '</option>'; }).join('') + '</select></div>';
            return '<div class="ums-field ums-field--fit">' + x[1] + '</div>';
        }).join('') + '</div>';
    }
    var TINHTRANG = [['0', 'Tất cả tình trạng'], ['1', 'Đã nhập học']];

    K.mucPhiDaGan = function (khId) {
        var dlg = ui.dialog({
            title: 'Mức phí đã gán cho thí sinh', icon: 'fa-list-check', size: 'xl',
            body:
                thanhBoLoc('mp', [
                    ['input', 'q', 'Tìm theo CCCD / Mã số / Họ tên / Ngành / Chương trình...'],
                    ['select', 'nh', TINHTRANG],
                    ['nut', ui.btn('search', { text: 'Tìm', attr: { 'data-mp': 'tim' } })]
                ]) +
                thanhBoLoc('mp', [
                    ['input', 'tu', 'Tổng phí từ (VD: 15,000,000)...', 1],
                    ['input', 'den', 'Tổng phí đến (VD: 20,000,000)...', 1],
                    ['nut', ui.btn('search', { text: 'Lọc theo tổng phí', icon: 'fa-filter', mod: 'out-warn', attr: { 'data-mp': 'loctien' } })],
                    ['nut', ui.btn('close', { text: 'Xóa lọc tổng phí', mod: 'out-danger', attr: { 'data-mp': 'xoatien' } })]
                ]) +
                '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-check"></i> Danh sách' +
                ' <span class="ums-u-faint ums-u-fz13" data-mp="dem"></span></div>' +
                '<div class="ums-panel__tools">' + ui.btn('excel', { attr: { 'data-mp': 'xls', title: 'Xuất Excel toàn bộ danh sách đang hiển thị theo bộ lọc (Ctrl+G)' } }) + '</div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-mp="bang"></div></div>'
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-mp="' + k + '"]'); }
        ui.enhance(B);
        K.oTien(q('tu')); K.oTien(q('den'));

        var tatCa = [], dang = [];
        var L = K.luoi(q('bang'), {
            size: 50, sizes: [20, 50, 100, 200, 'all'],
            empty: 'Không tìm thấy dữ liệu',
            columns: [
                { title: 'CCCD', cls: 'is-nowrap', render: function (r) { return ui.esc(MP.cccd(r)); } },
                { title: 'Mã số', cls: 'is-nowrap', render: function (r) { return ui.esc(MP.ma(r)); } },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return ui.esc(MP.ten(r)); } },
                { title: 'Giới tính', cls: 'is-center', render: function (r) { return ui.esc(MP.gt(r)); } },
                { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(MP.ns(r)); } },
                { title: 'Ngành nhập học', render: function (r) { return ui.esc(MP.nganh(r)); } },
                { title: 'Chương trình nhập học', render: function (r) { return ui.esc(MP.ct(r)); } },
                { title: 'Lớp chính thức', render: function (r) { return ui.esc(MP.lop(r)); } },
                { title: 'Thông tin mức phí nhập học', render: function (r) { return ui.esc(MP.tt(r)); } },
                { title: 'Tổng phí phải nộp', cls: 'is-right is-nowrap',
                  render: function (r) {
                      return '<b>' + K.tien(MP.tong(r)) + '</b> ' +
                          ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-mp-ct': MP.id(r), 'data-ten': MP.ten(r), 'data-ma': MP.ma(r) } });
                  },
                  sum: function (rows) { return '<b>' + ui.money(K.cong(rows, MP.tong)) + '</b>'; } },
                { title: 'Tổng phí đã nộp', cls: 'is-right is-nowrap', render: function (r) { return K.tien(K.daNop(r)); },
                  sum: function (rows) { return '<b>' + ui.money(K.cong(rows, K.daNop)) + '</b>'; } },
                { title: 'Ghi chú', render: function (r) { return ui.esc(MP.gc(r)); } }
            ]
        });

        function loc() {
            var kw = q('q').value.trim().toLowerCase();
            var tu = K.docTien(q('tu').value), den = K.docTien(q('den').value);
            dang = tatCa.filter(function (r) {
                if (tu !== null || den !== null) {
                    var n = K.so(MP.tong(r)) || 0;
                    if (tu !== null && n < tu) return false;
                    if (den !== null && n > den) return false;
                }
                if (kw) {
                    return [MP.cccd(r), MP.ma(r), MP.ten(r), MP.nganh(r), MP.ctTen(r)].some(function (s) {
                        return String(e(s)).toLowerCase().indexOf(kw) >= 0;
                    });
                }
                return true;
            });
            q('dem').textContent = '(' + ui.so(dang.length) + ')';
            L.dat(dang);
        }

        function nap() {
            L.dang();
            q('dem').textContent = '';
            ums.api.call(K.goi('mucPhiDaGan', {
                strTuKhoa: '',
                strTaiChinh_KeHoach_Id: khId,
                strNguoiThucHien_Id: ums.session.userId,
                dDaNhapHoc: parseInt(q('nh').value, 10) || 0,
                pageIndex: 1,
                pageSize: 100000
            })).then(function (r) { tatCa = K.rows(r); loc(); })
                .catch(function (err) { L.loi(err.message); ums.api.handle(err, 'mức phí đã gán'); });
        }

        var hen = 0, henTien = 0;
        q('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(loc, 300); });
        q('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); loc(); } });
        [q('tu'), q('den')].forEach(function (el) {
            el.addEventListener('input', function () { clearTimeout(henTien); henTien = setTimeout(loc, 300); });
        });
        q('tim').addEventListener('click', loc);
        q('loctien').addEventListener('click', function () { clearTimeout(henTien); loc(); });
        q('xoatien').addEventListener('click', function () { q('tu').value = ''; q('den').value = ''; loc(); });
        // Tình trạng nhập học lọc ở MÁY CHỦ (dDaNhapHoc) → tải lại
        jQuery(q('nh')).on('change', nap);

        q('bang').addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-mp-ct]');
            if (b) chiTietPhaiNop(b.getAttribute('data-mp-ct'), b.getAttribute('data-ten'), b.getAttribute('data-ma'));
        });

        function xuat() {
            if (!dang.length) { ui.toast('Không có dữ liệu để xuất.', 'warn'); return; }
            ui.xuatXls('MucPhiDaGan_' + dang.length + 'rec_' + dauGio(), {
                cot: [
                    { title: 'STT', get: function (r, i) { return i + 1; } },
                    { title: 'CCCD', get: MP.cccd }, { title: 'Mã số', get: MP.ma }, { title: 'Họ tên', get: MP.ten },
                    { title: 'Giới tính', get: MP.gt }, { title: 'Ngày sinh', get: MP.ns },
                    { title: 'Ngành nhập học', get: MP.nganh }, { title: 'Chương trình nhập học', get: MP.ct },
                    { title: 'Lớp chính thức', get: MP.lop }, { title: 'Thông tin mức phí nhập học', get: MP.tt },
                    { title: 'Tổng phí phải nộp', get: function (r) { return soXuat(MP.tong(r)); } },
                    { title: 'Tổng phí đã nộp', get: function (r) { return soXuat(K.daNop(r)); } },
                    { title: 'Ghi chú', get: MP.gc }
                ],
                dong: dang
            });
        }
        q('xls').addEventListener('click', xuat);
        K.phimXuat(dlg.el, xuat);

        nap();
    };

    function soXuat(v) { return K.so(v) === null ? '' : K.so(v); }
    function dauGio() {
        var p = function (n) { return (n < 10 ? '0' : '') + n; }, d = new Date();
        return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
    }

    /* Chi tiết các khoản phải nộp của một thí sinh (gốc: bấm "Sửa" cột Tổng phí) */
    function chiTietPhaiNop(intakeId, hoTen, ma) {
        if (!intakeId) { ui.toast('Không xác định được thí sinh.', 'warn'); return; }
        var lbl = hoTen || '';
        if (ma) lbl += (lbl ? ' — ' : '') + 'Mã: ' + ma;
        var dlg = ui.dialog({
            title: 'Chi tiết các khoản phải nộp của thí sinh', icon: 'fa-money-check-dollar', size: 'lg',
            body: (lbl ? '<div class="ums-kv ums-u-mb-4"><span>Thí sinh</span><b>' + ui.esc(lbl) + '</b></div>' : '') +
                '<div data-pn>' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-pn]');
        Promise.all([K.dm(), ums.api.call(K.goi('phaiNopIntake', { strCore_Person_Intake_Id: intakeId, strNguoiThucHien_Id: ums.session.userId }))])
            .then(function (x) {
                var dm = x[0];
                function conLai(r) {
                    var v = pick(r, 'SO_TIEN_CON_NOP', 'CON_PHAI_NOP', 'SO_CON_NOP', 'CON_LAI');
                    var p = phaiNop(r), d = daNop(r);
                    if (v === '' && p !== '' && d !== '') v = (Number(p) || 0) - (Number(d) || 0);
                    return v;
                }
                function phaiNop(r) { return pick(r, 'SO_TIEN_PHAI_NOP', 'SO_TIEN_PHAINOP', 'PHAI_NOP', 'SO_TIEN', 'SO_TIEN_DINH_MUC'); }
                function daNop(r) { return pick(r, 'SO_TIEN_DA_NOP', 'DA_NOP', 'SO_DA_NOP'); }
                ui.table({
                    el: host, rows: K.rows(x[1]), empty: 'Chưa có khoản phải nộp nào',
                    columns: [
                        { title: 'Tên khoản phải nộp', render: function (r) { return ui.esc(pick(r, 'TEN_KHOAN', 'KHOAN_TEN', 'KHOANTHU_TEN', 'TEN_HIEN_THI', 'TEN')); } },
                        { title: 'Mã khoản', cls: 'is-nowrap', render: function (r) { return ui.esc(pick(r, 'MA_KHOAN', 'KHOAN_MA', 'KHOANTHU_MA', 'MA')); } },
                        { title: 'Số tiền phải nộp', cls: 'is-right is-nowrap', render: function (r) { return K.tien(phaiNop(r)); } },
                        { title: 'Đã nộp', cls: 'is-right is-nowrap', render: function (r) { return K.tien(daNop(r)); } },
                        { title: 'Còn phải nộp', cls: 'is-right is-nowrap', render: function (r) { return K.tien(conLai(r)); } },
                        { title: 'Đơn vị', cls: 'is-center', render: function (r) {
                            var ma = pick(r, 'DON_VI_TIEN_MA', 'DON_VI_TIEN_ID', 'DVT_MA', 'DVT');
                            return ui.esc(K.tenTheoMa(dm.dvt, ma) || pick(r, 'DON_VI_TIEN_TEN', 'DVT_TEN'));
                        } },
                        { title: 'Ghi chú', render: function (r) { return ui.esc(pick(r, 'GHICHU', 'GHI_CHU')); } }
                    ]
                });
            }).catch(function (err) { host.innerHTML = ui.fail('Lỗi tải dữ liệu'); ums.api.handle(err, 'khoản phải nộp'); });
    }

    /* =====================================================================
       Danh sách nhập học & thu tiền (Đông Á)
       ===================================================================== */
    var TT = {
        cccd: function (r) { return pickCI(r, 'IdentifierNo', 'CCCD'); },
        ma: function (r) { return pickCI(r, 'CurrentEmployeeCode', 'MaSo'); },
        ten: function (r) { return pickCI(r, 'FullName', 'HoTen'); },
        sdt: function (r) { return pickCI(r, 'SoDienThoaiCaNhan', 'SoDienThoai', 'DienThoaiCaNhan', 'DienThoai', 'Phone', 'Mobile'); },
        gt: function (r) { return pickCI(r, 'GenderTen', 'GioiTinhTen', 'GioiTinh', 'Gender'); },
        ns: function (r) { return pickCI(r, 'DateOfBirth', 'NgaySinhStr', 'NgaySinh'); },
        nganh: function (r) { return pickCI(r, 'DaoTaoNganhTsTen', 'NganhTsTen', 'TenNganhTs', 'NganhTen'); },
        ct: function (r) { return pickCI(r, 'TenChuongTrinh', 'TenCT', 'ChuongTrinhTen', 'DaoTaoToChucChuongTrinhTen'); },
        lop: function (r) { return pickCI(r, 'LopQuanLyTen', 'TenLop', 'LopTen', 'LopCtTen', 'LopChinhThucTen'); },
        tong: function (r) { return pickCI(r, 'TONGMUCPHI', 'TongMucPhi', 'TongPhaiNop', 'TongTienPhaiNop'); },
        daNop: function (r) { return pickCI(r, 'TongSoTienDaNop', 'TongTienDaNop', 'TongDaNop', 'SoTienDaNop', 'DaNop', 'TongThuTien', 'TongDaThu'); },
        ngay: function (r) { return pickCI(r, 'NgayNop', 'NgayThuTien', 'NgayThu', 'NgayNopGanNhat', 'NgayNopCuoi'); },
        daNH: function (r) { return Number(pickCI(r, 'IsStudyCreated', 'DaNhapHoc', 'IsNhapHoc') || 0) === 1; }
    };

    K.dsNhapHocThuTien = function (khId) {
        var dlg = ui.dialog({
            title: 'Danh sách nhập học & thu tiền', icon: 'fa-list-ul', size: 'xl',
            body:
                thanhBoLoc('tt', [
                    ['input', 'q', 'Tìm theo CCCD / Mã số / Họ tên...'],
                    ['select', 'nh', TINHTRANG],
                    ['nut', ui.btn('search', { text: 'Tìm', attr: { 'data-tt': 'tim' } })]
                ]) +
                '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-list-ul"></i> Danh sách' +
                ' <span class="ums-u-faint ums-u-fz13" data-tt="dem"></span></div>' +
                '<div class="ums-panel__tools">' + ui.btn('excel', { attr: { 'data-tt': 'xls', title: 'Xuất Excel toàn bộ danh sách theo bộ lọc hiện tại (Ctrl+G)' } }) + '</div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-tt="bang"></div></div>'
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-tt="' + k + '"]'); }
        ui.enhance(B);

        var tatCa = [], dang = [];
        function cotTien(get) {
            return { cls: 'is-right is-nowrap', render: function (r) { return K.tien(get(r)); },
                     sum: function (rows) { return '<b>' + ui.money(K.cong(rows, get)) + '</b>'; } };
        }
        function gan(o, c) { Object.keys(c).forEach(function (k) { o[k] = c[k]; }); return o; }
        var L = K.luoi(q('bang'), {
            size: 50, sizes: [20, 50, 100, 200, 'all'],
            empty: 'Không có dữ liệu',
            columns: [
                { title: 'CCCD', cls: 'is-nowrap', render: function (r) { return ui.esc(TT.cccd(r)); } },
                { title: 'Mã số', cls: 'is-nowrap', render: function (r) { return ui.esc(TT.ma(r)); } },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return ui.esc(TT.ten(r)); } },
                { title: 'Số điện thoại', cls: 'is-nowrap', render: function (r) { return ui.esc(TT.sdt(r)); } },
                { title: 'Giới tính', cls: 'is-center', render: function (r) { return ui.esc(TT.gt(r)); } },
                { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(TT.ns(r)); } },
                { title: 'Ngành nhập học', render: function (r) { return ui.esc(TT.nganh(r)); } },
                { title: 'Chương trình nhập học', render: function (r) { return ui.esc(TT.ct(r)); } },
                { title: 'Lớp chính thức', render: function (r) { return ui.esc(TT.lop(r)); } },
                gan({ title: 'Tổng phải nộp' }, cotTien(TT.tong)),
                gan({ title: 'Đã nộp' }, cotTien(TT.daNop)),
                { title: 'Ngày nộp', cls: 'is-center is-nowrap', render: function (r) { return ui.esc(TT.ngay(r)); } }
            ]
        });

        function loc() {
            var kw = q('q').value.trim().toLowerCase();
            var chiDaNH = (parseInt(q('nh').value, 10) || 0) === 1;
            dang = tatCa.filter(function (r) {
                if (chiDaNH && !TT.daNH(r)) return false;
                if (kw && [TT.cccd(r), TT.ma(r), TT.ten(r)].every(function (s) { return String(e(s)).toLowerCase().indexOf(kw) < 0; })) return false;
                return true;
            });
            q('dem').textContent = '(' + ui.so(dang.length) + ')';
            L.dat(dang);
        }

        var hen = 0;
        q('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(loc, 300); });
        q('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); loc(); } });
        q('tim').addEventListener('click', loc);
        jQuery(q('nh')).on('change', loc);

        function xuat() {
            if (!dang.length) { ui.toast('Không có dữ liệu để xuất.', 'warn'); return; }
            ui.xuatXls('DSNhapHocThuTien_' + dang.length + 'rec_' + dauGio(), {
                cot: [
                    { title: 'STT', get: function (r, i) { return i + 1; } },
                    { title: 'CCCD', get: TT.cccd }, { title: 'Mã số', get: TT.ma }, { title: 'Họ tên', get: TT.ten },
                    { title: 'Số điện thoại', get: TT.sdt }, { title: 'Giới tính', get: TT.gt }, { title: 'Ngày sinh', get: TT.ns },
                    { title: 'Ngành nhập học', get: TT.nganh }, { title: 'Chương trình nhập học', get: TT.ct },
                    { title: 'Lớp chính thức', get: TT.lop },
                    { title: 'Tổng phải nộp', get: function (r) { return soXuat(TT.tong(r)); } },
                    { title: 'Đã nộp', get: function (r) { return soXuat(TT.daNop(r)); } },
                    { title: 'Ngày nộp', get: TT.ngay }
                ],
                dong: dang
            });
        }
        q('xls').addEventListener('click', xuat);
        K.phimXuat(dlg.el, xuat);

        L.dang();
        ums.api.call(K.goi('thiSinhNH', {
            strTuKhoa: '',
            strTaiChinh_KeHoach_Id: khId,
            strNguoiThucHien_Id: ums.session.userId,
            dDaNhapHoc: 0,
            pageIndex: 1,
            pageSize: 100000
        })).then(function (r) { tatCa = K.rows(r); loc(); })
            .catch(function (err) { L.loi('Lỗi tải dữ liệu'); ums.api.handle(err, 'danh sách nhập học & thu tiền'); });
    };
})();
