/* =========================================================================
   ums.khtsn.moDocAPI(kh) — hộp "Đọc từ API" (bản gốc: modal #doc-api-tuyensinh, docAPI_*)
   ---------------------------------------------------------------------------
   Ba bước như gốc:
     1. Nguồn + Đợt + Cơ sở + Từ khoá + Giới hạn → CM_UngDung/CustomAPIGet (POST: strHost, strApi '', strLoaiXacThuc,
        strMaXacThuc, strData '', strNguoiThucHien_Id) → JSON.parse(Data) rồi bóc theo responseUnwrap.
     2. Ghép cột API → 77 tham số của Them_HoSo_TS (bảng alias của gốc; lưu theo máy: <chức năng>_docAPI_<nguồn>_<kế hoạch>).
     3. Xem trước (200 dòng / trang, lọc, chọn từng dòng / tất cả) → Import: MỖI bản ghi một lời gọi
        PKG_CORE_TS_HOSO_IMPORT.Them_HoSo_TS (dùng chung ums.khtsn.goiImport với Import Excel), 5 luồng, dừng được, bảng lỗi + xuất lỗi.
   TỰ CHỐT: KHÔNG chép khoá xác thực / mật khẩu viết cứng trong mã gốc (token CMC, mật khẩu HRM Phenikaa, Bearer UHD).
     Địa chỉ + mã xác thực là ô nhập, nhớ theo máy (trừ mã xác thực) — việc dữ liệu: đưa cấu hình nguồn API về phía máy chủ.
   Bỏ như gốc: nút "Tự động ghép" (gốc đã ẩn 09/08); ô "Đối tượng" (gốc để hidden, deprecated).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, T = ums.khtsn;

    var PRESETS = [
        { id: 'CMC', ten: 'CMC (Nhap hoc)', host: 'https://crm.cmcu.edu.vn/api/resource/Nhaphoc?fields=["*"]&limit_page_length=50000',
          loaiXacThuc: 'Authorization', keyCol: 'mssv', filterFmt: '&filters=[["mssv","like","%25{kw}%25"]]', unwrap: 'data' },
        { id: 'UHD', ten: 'UHD (User admitted)', host: 'https://tuyensinh.uhd.edu.vn/api/admission/user-registration/user-admitted',
          loaiXacThuc: 'Authorization', keyCol: 'userId', filterFmt: '', unwrap: 'data' },
        { id: 'PHENIKAA', ten: 'Phenikaa (HRM profiles)', host: 'https://hrm.phenikaa-uni.edu.vn/hrm/api/v1/profiles/apis?page=1&pageSize=100000',
          loaiXacThuc: '', keyCol: '', filterFmt: '', unwrap: 'data.listProfile' }
    ];
    /* 77 tham số của PKG_CORE_TS_HOSO.Them_HoSo_TS (bản gốc _docAPI_TargetParams) */
    var TARGET = [
        ['strCorePerson_HoTen', 'Họ và tên (đầy đủ)'], ['strCorePerson_Ho', 'Họ'], ['strCorePerson_Dem', 'Đệm'], ['strCorePerson_Ten', 'Tên'],
        ['strCorePerson_NgaySinh', 'Ngày sinh (raw từ API, không format)'], ['dCorePerson_NgayS', 'Ngày sinh - ngày (số)'], ['dCorePerson_ThangS', 'Ngày sinh - tháng (số)'],
        ['dCorePerson_NamS', 'Ngày sinh - năm (số)'], ['strCorePerson_GioiTinh_Ma', 'Giới tính (Mã/Tên)'], ['strMaSo', 'Mã số (MSSV nội bộ)'],
        ['strDaoTao_LopQuanLy_DuKien', 'Lớp quản lý dự kiến'], ['strPersonProfile_DanToc_Ma', 'Dân tộc (Mã/Tên)'], ['strPersonProfile_TonGiao_Ma', 'Tôn giáo (Mã/Tên)'],
        ['strPersonProfile_QuocTich_Ma', 'Quốc tịch (Mã/Tên)'], ['strPersonContact_DienThoai', 'Điện thoại'], ['strPersonContact_Email', 'Email'],
        ['strPersonIden_SoCCCD', 'Số CCCD'], ['strPersonIden_NgayCap', 'Ngày cấp CCCD'], ['strPersonIden_NoiCap', 'Nơi cấp CCCD'],
        ['strPersonAddr_NS_Tinh_Ma', 'Nơi sinh - Tỉnh (Mã/Tên)'], ['strPersonAddr_NS_Xa_Ma', 'Nơi sinh - Xã (Mã/Tên)'], ['strPersonAddr_NoiSinh', 'Nơi sinh (text)'],
        ['strPersonAddr_HK_Tinh_Ma', 'Hộ khẩu - Tỉnh (Mã/Tên)'], ['strPersonAddr_HK_Xa_Ma', 'Hộ khẩu - Xã (Mã/Tên)'], ['strPersonAddr_HK_SoNha', 'Hộ khẩu - Số nhà/Thôn/Xóm'],
        ['strPersonEdu_Tinh_Ma', 'Tỉnh lớp 12 (Mã/Tên)'], ['strPersonEdu_TruongMaTen', 'Trường lớp 12 (Mã-Tên)'], ['strPersonEdu_HocLuc', 'Học lực lớp 12'],
        ['strPersonEdu_HanhKiem', 'Hạnh kiểm lớp 12'], ['strPersonFam_Bo_HoTen', 'Bố - Họ tên'], ['dPersonFam_Bo_NamSinh', 'Bố - Năm sinh'], ['strPersonFam_Bo_NoiO', 'Bố - Nơi ở'],
        ['strPersonFam_Bo_SDT', 'Bố - SĐT'], ['strPersonFam_Me_HoTen', 'Mẹ - Họ tên'], ['dPersonFam_Me_NamSinh', 'Mẹ - Năm sinh'], ['strPersonFam_Me_NoiO', 'Mẹ - Nơi ở'],
        ['strPersonFam_Me_SDT', 'Mẹ - SĐT'], ['strHoSo_KH_Dot_PT_Ma', 'Phương thức tuyển sinh (Mã/Tên)'], ['strHoSo_DoiTuong_TS_Ma', 'Đối tượng tuyển sinh (Mã/Tên)'],
        ['strHoSo_DoiTuong_UT_Mas', 'Đối tượng ưu tiên (Mã, có thể nhiều)'], ['strHoSo_KhuVuc_UT_Ma', 'Khu vực ưu tiên (Mã/Tên)'], ['strHoSo_MaHoSo', 'Mã hồ sơ'],
        ['strHoSo_SoBaoDanh', 'Số báo danh'], ['strHoSo_Import_Batch_Ma', 'Import Batch (Mã)'], ['strMaNganhTrungTuyen', 'Mã ngành trúng tuyển'],
        ['strMaCTDT', 'Mã CTĐT (nếu ngành TT không duy nhất)'], ['strXetTuyen_TohopMon_Ma', 'Tổ hợp môn (Mã/Tên)'], ['strXetTuyen_TohopMon_Code', 'Tổ hợp môn (code)'],
        ['strXetTuyen_TohopMon_Ten', 'Tổ hợp môn (tên)'], ['dXetTuyen_DiemUuTien', 'Điểm ưu tiên'], ['dXetTuyen_DiemTongMon', 'Điểm tổng môn'],
        ['dXetTuyen_DiemTongXT', 'Điểm tổng xét tuyển'], ['strXT_Mon_Data', 'XT Môn Data (JSON)'], ['strKetQua_QuyetDinh_Ma', 'Quyết định trúng tuyển (Mã)'],
        ['strIntake_IntakeCode', 'Intake code'], ['strIntake_IntakeTypeCode', 'Intake type code'], ['strPersonInvoice_TypeLoai', 'Hóa đơn - Loại'],
        ['strPersonInvoice_NguoiMua', 'Hóa đơn - Người mua'], ['strPersonInvoice_TenDonVi', 'Hóa đơn - Tên đơn vị'], ['strPersonInvoice_MST', 'Hóa đơn - MST'],
        ['strPersonInvoice_MaQHNS', 'Hóa đơn - Mã QHNS'], ['strPersonInvoice_SDT', 'Hóa đơn - SĐT'], ['strPersonInvoice_DiaChi', 'Hóa đơn - Địa chỉ'],
        ['strPersonInvoice_Email', 'Hóa đơn - Email'], ['strPersonBank_HinhThucTT', 'Ngân hàng - Hình thức TT'], ['strPersonBank_TenNganHang', 'Ngân hàng - Tên NH'],
        ['strPersonBank_SoTaiKhoan', 'Ngân hàng - Số TK'], ['strPersonBank_ChuTaiKhoan', 'Ngân hàng - Chủ TK'], ['strPersonBank_GhiChu', 'Ngân hàng - Ghi chú'],
        ['strDaoTao_CoSoDaoTao', 'Cơ sở đào tạo (Mã/Tên)'], ['strSoTienNopTruoc', 'Số tiền nộp trước (giữ chỗ)'], ['strExtra_Person_Data', 'Extra Person Data (JSON)'],
        ['strExtra_HoSo_Data', 'Extra Hồ Sơ Data (JSON)'], ['strExtra_Intake_Data', 'Extra Intake Data (JSON)']
    ];
    /* Alias cột API → tham số (bản gốc _docAPI_ColAliases, phần có đích; phần null = bỏ qua có chủ ý) */
    var ALIAS = {
        hoten: 'strCorePerson_HoTen', dob: 'strCorePerson_NgaySinh', gt: 'strCorePerson_GioiTinh_Ma', dantoc: 'strPersonProfile_DanToc_Ma',
        quoctich: 'strPersonProfile_QuocTich_Ma', sdt: 'strPersonContact_DienThoai', emailts: 'strPersonContact_Email', emailsv: 'strPersonContact_Email',
        cccd: 'strPersonIden_SoCCCD', noisinh: 'strPersonAddr_NoiSinh', dc_tinhthanh: 'strPersonAddr_HK_Tinh_Ma', dc_phuongxa: 'strPersonAddr_HK_Xa_Ma',
        dc_lienlac: 'strPersonAddr_HK_SoNha', truongthpt: 'strPersonEdu_TruongMaTen', tinhthpt: 'strPersonEdu_Tinh_Ma', hocluc_12: 'strPersonEdu_HocLuc',
        hangkiem_12: 'strPersonEdu_HanhKiem', hotenph_bo: 'strPersonFam_Bo_HoTen', sdtph_bo: 'strPersonFam_Bo_SDT', hotenph_me: 'strPersonFam_Me_HoTen',
        sdtph_me: 'strPersonFam_Me_SDT', mssv: 'strMaSo', mahoso: 'strHoSo_MaHoSo', sbd: 'strHoSo_SoBaoDanh', phuongthuc_trungtuyen: 'strHoSo_KH_Dot_PT_Ma',
        dtut: 'strHoSo_DoiTuong_UT_Mas', kvut: 'strHoSo_KhuVuc_UT_Ma', tohop_trungtuyen: 'strXetTuyen_TohopMon_Code', diem_trungtuyen: 'dXetTuyen_DiemTongXT',
        manganh: 'strMaNganhTrungTuyen', mactdt: 'strMaCTDT', dc_hoadon: 'strPersonInvoice_DiaChi', tc_lpgd: 'strSoTienNopTruoc', noptientruoc: 'strSoTienNopTruoc',
        diachixuathoadon: 'strPersonInvoice_DiaChi', cosonhaphoc: 'strDaoTao_CoSoDaoTao'
    };
    var TRANG = 200;

    T.moDocAPI = function (kh) {
        var khId = T.id(kh);
        var S = { preset: null, data: [], cols: [], map: {}, keyCol: '', loc: '', page: 1, all: true, picks: {}, huy: false, loi: [], chay: false };
        var dlg = ui.dialog({
            title: 'Đọc dữ liệu tuyển sinh từ API — ' + (T.tenKH(kh) || ''), icon: 'fa-cloud-arrow-down', size: 'xl',
            body:
                '<div class="ums-legend">1. Nguồn dữ liệu</div>' +
                '<div class="ums-grid ums-grid--3">' +
                    ui.field('Nguồn API', '<select class="ums-select" data-da="preset" data-ph="-- Chọn nguồn --"><option value=""></option>' +
                        PRESETS.map(function (p) { return '<option value="' + p.id + '">' + ui.esc(p.ten) + '</option>'; }).join('') + '</select>', { required: true }) +
                    ui.field('Đợt tuyển sinh', '<select class="ums-select" data-da="dot" data-ph="-- Chọn đợt --"><option value=""></option></select>', { required: true }) +
                    ui.field('Cơ sở đào tạo', '<select class="ums-select" data-da="coso" data-ph="-- Chọn cơ sở đào tạo --"><option value=""></option></select>') +
                    '<div style="grid-column:1 / -1">' + ui.field('Địa chỉ API', '<input class="ums-input" data-da="host" autocomplete="off" placeholder="https://…">') + '</div>' +
                    ui.field('Kiểu xác thực', '<input class="ums-input" data-da="loaixt" autocomplete="off" placeholder="VD: Authorization (bỏ trống nếu không cần)">') +
                    ui.field('Mã xác thực', '<input class="ums-input" type="password" data-da="token" autocomplete="off" placeholder="VD: token key:secret / Bearer …">',
                        { hint: 'Không lưu trên máy — nhập mỗi lần đọc.' }) +
                    ui.field('Từ khoá lọc', '<input class="ums-input" data-da="kw" autocomplete="off" placeholder="VD: CMC26 (bỏ trống = tất cả)">') +
                '</div>' +
                '<div class="ums-row ums-u-mt-2">' +
                    '<div class="ums-radios"><label><input type="radio" name="khtsnDaLim" value="custom" checked> Chỉ đọc</label>' +
                    '<input class="ums-input khtsn-so" type="number" min="1" data-da="lim" value="100">' +
                    '<label><input type="radio" name="khtsnDaLim" value="all"> Toàn bộ</label></div>' +
                    ui.btn('search', { text: 'Đọc dữ liệu', attr: { 'data-da': 'fetch' } }) +
                '</div>' +
                '<div class="ums-u-fz13 ums-u-muted ums-u-mt-2" data-da="info"></div>' +
                '<div data-da="step2" hidden>' +
                    '<div class="ums-legend ums-legend--cach">2. Ghép cột API → trường hồ sơ <span class="ums-u-faint ums-u-fz13" data-da="demcot"></span></div>' +
                    '<div class="ums-row ums-row--between ums-u-mb-2">' +
                        '<span class="ums-row">' + ui.field('Cột làm mã (xem trước)', '<select class="ums-select" data-da="keycol" data-no-s2></select>', { inline: true }) + '</span>' +
                        '<span class="ums-row">' + ui.btn('reload', { text: 'Bỏ ghép tất cả', mod: 'ghost', icon: 'fa-eraser', attr: { 'data-da': 'clear' } }) +
                            ui.btn('save', { text: 'Lưu cấu hình ghép', attr: { 'data-da': 'savemap' } }) + '</span>' +
                    '</div>' +
                    '<div data-da="map" class="khtsn-da__map"></div>' +
                    '<div class="ums-legend ums-legend--cach">3. Xem trước &amp; nhập</div>' +
                    '<div class="ums-row ums-row--between ums-u-mb-2">' +
                        '<span class="ums-row"><input class="ums-input" data-da="loc" placeholder="Lọc trong dữ liệu đã đọc..." autocomplete="off">' +
                            '<label class="ums-u-fz13"><input type="checkbox" data-da="all" checked> Chọn tất cả (theo lọc)</label>' +
                            '<span class="ums-u-fz13 ums-u-muted" data-da="dem"></span></span>' +
                        '<span class="ums-row">' + ui.btn('excel', { text: 'Xuất Excel', attr: { 'data-da': 'xuat' } }) +
                            ui.btn('del', { text: 'Dừng', attr: { 'data-da': 'dung', hidden: 'hidden' } }) +
                            ui.btn('save', { text: 'Bắt đầu nhập', icon: 'fa-file-import', attr: { 'data-da': 'nhap' } }) + '</span>' +
                    '</div>' +
                    '<div data-da="tien" hidden class="ums-u-mb-2"><div class="ums-u-fz13 ums-u-mb-2" data-da="tienchu"></div>' +
                        '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" data-da="bar" style="width:0"></div></div></div></div>' +
                    '<div data-da="loipn" hidden class="khtsn-note khtsn-note--bad ums-u-mb-2"></div>' +
                    '<div data-da="xem"></div>' +
                '</div>'
        });
        var b = dlg.body, q = function (k) { return b.querySelector('[data-da="' + k + '"]'); }, g = function (k) { return String(q(k).value || '').trim(); };
        ui.enhance(b);

        T.dsDot(khId).then(function (rows) { T.fill(q('dot'), rows, { name: T.nhanDot, giu: T.S.dotKQ || (rows.length === 1 ? T.id(rows[0]) : '') }); });
        T.dsCoSoDaoTao().then(function (r) { ums.pat.fill(q('coso'), r, { name: T.nhanCSDT }); });

        function khoaLuu() { return ((ums.app && ums.app.state && ums.app.state.chucNangId) || (ums.state && ums.state.chucNangId) || '') + '_docAPI_' + (S.preset ? S.preset.id : '') + '_' + khId; }
        function chonPreset(id) {
            S.preset = PRESETS.filter(function (p) { return p.id === id; })[0] || null;
            var p = S.preset || {}, luu = {};
            try { luu = JSON.parse(localStorage.getItem('khtsn_docAPI_nguon_' + (p.id || '')) || '{}') || {}; } catch (x) { luu = {}; }
            q('host').value = luu.host || p.host || '';
            q('loaixt').value = luu.loaiXacThuc !== undefined ? luu.loaiXacThuc : (p.loaiXacThuc || '');
            q('info').textContent = p.id ? 'Bóc dữ liệu theo đường: ' + (p.unwrap || '(gốc)') + (p.keyCol ? ' · cột mã mặc định: ' + p.keyCol : '') : '';
        }
        var hn = location.hostname || '';
        var macDinh = hn.indexOf('103.159.50.116') >= 0 ? 'UHD' : (hn.indexOf('phenikaa-uni.edu.vn') >= 0 ? 'PHENIKAA' : 'CMC');
        q('preset').value = macDinh; jQuery(q('preset')).trigger('change.select2'); chonPreset(macDinh);
        jQuery(q('preset')).on('select2:select select2:clear', function () { chonPreset(g('preset')); q('step2').hidden = true; });

        function fetch() {
            if (!S.preset) { ui.toast('Vui lòng chọn nguồn API', 'warn'); return; }
            if (!g('dot')) { ui.toast('Vui lòng chọn Đợt tuyển sinh trước khi tải cấu trúc', 'warn'); return; }
            var host = g('host');
            if (!host) { ui.toast('Chưa có địa chỉ API', 'warn'); return; }
            try { localStorage.setItem('khtsn_docAPI_nguon_' + S.preset.id, JSON.stringify({ host: host, loaiXacThuc: g('loaixt') })); } catch (x) { /* chặn lưu trữ */ }
            var kw = g('kw');
            if (kw && S.preset.filterFmt) host += S.preset.filterFmt.replace('{kw}', encodeURIComponent(kw));
            var lim = (b.querySelector('input[name="khtsnDaLim"]:checked') || {}).value || 'custom', n = parseInt(g('lim'), 10);
            if (lim === 'custom' && n > 0) {
                if (/limit_page_length=\d+/.test(host)) host = host.replace(/limit_page_length=\d+/, 'limit_page_length=' + n);
                else host += (host.indexOf('?') === -1 ? '?' : '&') + 'limit_page_length=' + n;
            }
            q('info').innerHTML = '<i class="fa-light fa-spinner fa-spin"></i> Đang tải...';
            ums.api.call({ action: 'CM_UngDung/CustomAPIGet', type: 'POST', strHost: host, strApi: '', strLoaiXacThuc: g('loaixt'), strMaXacThuc: g('token'),
                strData: '', strNguoiThucHien_Id: ums.session.userId || '' }).then(function (r) {
                var raw = r.raw && r.raw.Data !== undefined ? r.raw.Data : r.data, rec;
                try { rec = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (x) { throw new Error('Response API không phải JSON hợp lệ'); }
                (S.preset.unwrap || '').split('.').forEach(function (k) { if (rec && k) rec = rec[k]; });
                S.data = Array.isArray(rec) ? rec : [];
                S.cols = S.data.length ? Object.keys(S.data[0]) : [];
                S.keyCol = S.preset.keyCol && S.cols.indexOf(S.preset.keyCol) >= 0 ? S.preset.keyCol : (S.cols[0] || '');
                S.map = {}; S.picks = {}; S.all = true; S.page = 1; S.loi = [];
                q('info').textContent = 'Đã tải ' + S.data.length + ' bản ghi API, ' + TARGET.length + ' trường thông tin.';
                taiMap(); veMap(); veXem();
                q('step2').hidden = false; q('loipn').hidden = true;
            }).catch(function (err) {
                q('info').innerHTML = '<span class="khtsn-bad">Không tải được dữ liệu API</span>';
                ums.api.handle(err, 'CustomAPIGet');
            });
        }
        function taiMap() {
            var cfg = null;
            try { cfg = JSON.parse(localStorage.getItem(khoaLuu()) || 'null'); } catch (x) { cfg = null; }
            if (cfg && cfg.mapping) {
                S.map = {};
                Object.keys(cfg.mapping).forEach(function (c) { if (S.cols.indexOf(c) >= 0) S.map[c] = cfg.mapping[c]; });
                if (cfg.keyCol && S.cols.indexOf(cfg.keyCol) >= 0) S.keyCol = cfg.keyCol;
            } else {
                S.cols.forEach(function (c) { var a = ALIAS[String(c).toLowerCase()]; if (a) S.map[c] = a; });
            }
        }
        function luuMap(bao) {
            try {
                localStorage.setItem(khoaLuu(), JSON.stringify({ keyCol: S.keyCol, mapping: S.map, savedAt: new Date().toISOString() }));
                if (bao) ui.toast('Đã lưu cấu hình ghép cho kế hoạch này + nguồn API này.', 'ok');
            } catch (x) { ui.toast('Không lưu được cấu hình trên máy: ' + x.message, 'warn'); }
        }
        function mau(c) { for (var i = 0; i < Math.min(S.data.length, 20); i++) { var v = S.data[i][c]; if (v !== null && v !== undefined && v !== '') return typeof v === 'object' ? JSON.stringify(v) : String(v); } return ''; }
        function veMap() {
            q('demcot').textContent = '(' + S.cols.length + ' cột API · ' + TARGET.length + ' trường · đã ghép ' + Object.keys(S.map).filter(function (c) { return S.map[c]; }).length + ')';
            q('keycol').innerHTML = S.cols.map(function (c) { return '<option value="' + ui.esc(c) + '"' + (c === S.keyCol ? ' selected' : '') + '>' + ui.esc(c) + '</option>'; }).join('');
            var opt = '<option value="">— Bỏ qua —</option>' + TARGET.map(function (t) { return '<option value="' + t[0] + '">' + ui.esc(t[1]) + ' (' + t[0] + ')</option>'; }).join('');
            ui.table({ el: q('map'), rows: S.cols, empty: 'API không trả về bản ghi nào.', columns: [
                { title: 'Cột API', cls: 'is-nowrap', render: function (c) { return '<b>' + ui.esc(c) + '</b>'; } },
                { title: 'Giá trị mẫu', render: function (c) { var v = mau(c); return '<span class="ums-u-fz13 ums-u-muted">' + ui.esc(v.length > 60 ? v.slice(0, 60) + '…' : v) + '</span>'; } },
                { title: 'Trường hồ sơ (Them_HoSo_TS)', width: '42%', render: function (c) {
                    return '<select class="ums-select" data-damap="' + ui.esc(c) + '">' + opt.replace('value="' + (S.map[c] || '') + '"', 'value="' + (S.map[c] || '') + '" selected') + '</select>'; } }
            ] });
        }
        function locIdx() {
            var kw = S.loc.toLowerCase(), out = [];
            S.data.forEach(function (r, i) {
                if (!kw) { out.push(i); return; }
                var hit = Object.keys(S.map).some(function (c) { return S.map[c] && String(r[c] == null ? '' : r[c]).toLowerCase().indexOf(kw) >= 0; }) ||
                    String(r[S.keyCol] == null ? '' : r[S.keyCol]).toLowerCase().indexOf(kw) >= 0;
                if (hit) out.push(i);
            });
            return out;
        }
        function daChon(i) { return S.all ? S.picks[i] !== false : S.picks[i] === true; }
        function veXem() {
            var idx = locIdx(), cols = Object.keys(S.map).filter(function (c) { return S.map[c]; });
            var tong = idx.length, trang = Math.max(1, Math.ceil(tong / TRANG));
            if (S.page > trang) S.page = trang;
            var view = idx.slice((S.page - 1) * TRANG, S.page * TRANG);
            q('dem').textContent = 'Đang chọn ' + idx.filter(daChon).length + ' / ' + tong + ' bản ghi';
            var loiMap = {}; S.loi.forEach(function (l) { loiMap[l.idx] = l; });
            ui.table({ el: q('xem'), rows: view, empty: cols.length ? 'Không có bản ghi khớp bộ lọc.' : 'Chưa ghép cột nào — chọn trường hồ sơ ở bước 2.',
                columns: [
                    { title: '', cls: 'is-center', width: '40px', render: function (i) { return '<input type="checkbox" data-dapick="' + i + '"' + (daChon(i) ? ' checked' : '') + '>'; } },
                    { title: 'Mã (' + (S.keyCol || '—') + ')', cls: 'is-nowrap', render: function (i) { return ui.esc(S.data[i][S.keyCol] == null ? '' : S.data[i][S.keyCol]); } }
                ].concat(cols.map(function (c) {
                    var t = TARGET.filter(function (x) { return x[0] === S.map[c]; })[0];
                    return { title: t ? t[1] : S.map[c], render: function (i) { var v = S.data[i][c]; return ui.esc(v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : v); } };
                })).concat([{ title: 'Kết quả', cls: 'is-center', width: '90px', render: function (i) {
                    var l = loiMap[i]; return '<span data-dast="' + i + '">' + (l ? '<span title="' + ui.esc(l.msg) + '">' + ui.badge('Lỗi', 'bad') + '</span>' : '') + '</span>'; } }]),
                page: { index: S.page, size: TRANG, total: tong, sizes: false, onChange: function (p) { S.page = p; veXem(); } }
            });
        }
        function chonDong() { return locIdx().filter(daChon); }
        function nhap() {
            var dot = g('dot');
            if (!dot) { ui.toast('Chưa chọn Đợt tuyển sinh', 'warn'); return; }
            var cols = Object.keys(S.map).filter(function (c) { return S.map[c]; });
            if (!cols.length) { ui.toast('Chưa ghép cột nào — vào bước 2 để chọn trường tương ứng', 'warn'); return; }
            var ds = chonDong();
            if (!ds.length) { ui.toast('Chưa chọn bản ghi nào để nhập', 'warn'); return; }
            luuMap(false);
            S.huy = false; S.loi = []; S.chay = true;
            var tong = ds.length, xong = 0, ok = 0, loi = 0;
            q('tien').hidden = false; q('loipn').hidden = true; q('dung').hidden = false; q('nhap').disabled = true;
            var ve = function () {
                q('tienchu').textContent = xong + ' / ' + tong + ' · Thành công: ' + ok + ' · Lỗi: ' + loi;
                q('bar').style.width = (tong ? Math.round(xong * 100 / tong) : 0) + '%';
            };
            ve();
            var coSo = g('coso');
            T.hangDoi(ds.map(function (i) {
                return function () {
                    if (S.huy) return null;
                    var rec = S.data[i], row = {};
                    cols.forEach(function (c) { var v = rec[c]; row[S.map[c]] = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); });
                    var st = b.querySelector('[data-dast="' + i + '"]');
                    if (st) st.innerHTML = '<i class="fa-light fa-spinner fa-spin"></i>';
                    return ums.api.call(T.goiImport(row, i + 1, { KH: khId, Dot: dot, CoSo: coSo })).then(function () {
                        ok++; if (st) st.innerHTML = ui.badge('OK', 'ok');
                    }, function (err) {
                        loi++; var m = (err && err.message) || 'Lỗi không rõ';
                        S.loi.push({ idx: i, ma: rec[S.keyCol], ten: row.strCorePerson_HoTen || '', msg: m });
                        if (st) st.innerHTML = '<span title="' + ui.esc(m) + '">' + ui.badge('Lỗi', 'bad') + '</span>';
                    }).then(function () { xong++; ve(); });
                };
            }), 5).then(function () {
                S.chay = false; q('dung').hidden = true; q('nhap').disabled = false;
                ui.toast((S.huy ? 'Đã dừng ở ' + xong + '/' + tong + '. ' : 'Xong. ') + 'Thành công: ' + ok + ' / Lỗi: ' + loi, loi ? 'warn' : 'ok');
                veLoi();
            });
        }
        function veLoi() {
            var p = q('loipn');
            if (!S.loi.length) { p.hidden = true; return; }
            p.hidden = false;
            p.innerHTML = '<div class="ums-row ums-row--between"><b><i class="fa-light fa-triangle-exclamation"></i> ' + S.loi.length + ' bản ghi lỗi</b>' +
                ui.btn('excel', { text: 'Xuất danh sách lỗi', attr: { 'data-da': 'xuatloi' } }) + '</div><ul class="ums-u-fz13">' +
                S.loi.slice(0, 20).map(function (l) { return '<li>Dòng ' + (l.idx + 1) + (l.ma ? ' (' + ui.esc(l.ma) + ')' : '') + ': ' + ui.esc(l.msg) + '</li>'; }).join('') +
                (S.loi.length > 20 ? '<li>… và ' + (S.loi.length - 20) + ' dòng nữa (xem tệp xuất)</li>' : '') + '</ul>';
        }
        function xuat() {
            var cols = Object.keys(S.map).filter(function (c) { return S.map[c]; });
            var aoa = [['STT', S.keyCol].concat(cols.map(function (c) { return S.map[c]; }))];
            locIdx().forEach(function (i, k) {
                var r = S.data[i];
                aoa.push([k + 1, r[S.keyCol] == null ? '' : r[S.keyCol]].concat(cols.map(function (c) { var v = r[c]; return v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); })));
            });
            T.xuatAoa('DocAPI_' + (S.preset ? S.preset.id : '') + '_' + T.homNay().replace(/\//g, ''), aoa);
        }
        function xuatLoi() {
            var aoa = [['Dòng', 'Mã', 'Họ tên', 'Lỗi']];
            S.loi.forEach(function (l) { aoa.push([l.idx + 1, l.ma == null ? '' : l.ma, l.ten, l.msg]); });
            T.xuatAoa('DocAPI_Loi_' + T.homNay().replace(/\//g, ''), aoa);
        }

        b.addEventListener('click', function (ev) {
            var x = ev.target.closest('button[data-da]');
            if (!x) return;
            var k = x.getAttribute('data-da');
            if (k === 'fetch') fetch();
            else if (k === 'clear') { S.map = {}; veMap(); veXem(); }
            else if (k === 'savemap') luuMap(true);
            else if (k === 'nhap') nhap();
            else if (k === 'dung') { S.huy = true; ui.toast('Đang dừng — chờ các lời gọi đang chạy xong', 'info'); }
            else if (k === 'xuat') xuat();
            else if (k === 'xuatloi') xuatLoi();
        });
        b.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute('data-damap') !== null) { S.map[t.getAttribute('data-damap')] = t.value; if (!t.value) delete S.map[t.getAttribute('data-damap')]; veMap(); veXem(); return; }
            if (t.getAttribute('data-da') === 'keycol') { S.keyCol = t.value; veXem(); return; }
            if (t.getAttribute('data-da') === 'all') { S.all = t.checked; S.picks = {}; veXem(); return; }
            if (t.getAttribute('data-dapick') !== null) { S.picks[t.getAttribute('data-dapick')] = t.checked; veXem(); }
        });
        var hen = null;
        q('loc').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { S.loc = g('loc'); S.page = 1; veXem(); }, 250); });
        q('kw').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); fetch(); } });
    };
})();
