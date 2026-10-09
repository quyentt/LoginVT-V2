/* =========================================================================
   hoso — phần dùng chung của 5 màn nhóm A (ums.hsA): hoso_danhsach, xemhoso, hoso_capnhat,
   hoso_taomoi, quanlytoanbo. Cả 5 html gốc nạp script/dexuathoso.js (+ zoneEditModal_inject.js,
   trừ hoso_taomoi) và mở CÙNG một biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất" (#zoneEdit, 3 tab) bằng
   DeXuatHoSo.openEditByPerson({ id, hoDem, ten, ngaySinh_*, anh, gioiTinh…, aData }).
   ---------------------------------------------------------------------------
   Dùng lại Nhân sự: ApisNhanSu/Modules/kehoach/script/_dxhs_chung.js (ums.nsDxhs — bảng mã action
   NS_HoSoNhanSu5/6, X.chon, X.an, X.dmRows, và hai bảng định danh | liên hệ X.ddlh với các cờ bản
   Sinh viên: boQuaRong, motChinh, locHieuLuc, boQuaTrungMinh, xoaMem). dexuathoso.js gốc của Sinh
   viên lệch bản Nhân sự đúng ở những điểm đó (bỏ qua ô trống, "trùng với chính mình"…).

   ums.hsA.nguoi(dòng SV_HoSo)        → person (các khoá của openEditByPerson gốc)
   ums.hsA.dsSV(master, o)            → danh sách sinh viên ở cột trái pat.master
        o = { loc: true (Hệ → Khoá → CT → Lớp, ums.ref.cascade — gốc edu.system.getList_*, KHÔNG lọc quyền),
              call(q, loc, trang, cỡ) → lời gọi, dong(r) → HTML dòng phụ, onPick(r) }
        → { load(trang), rows(), boChon(), chon(id) }
   ums.hsA.editor(host, o)            → biểu mẫu 3 tab; o = { onDong(), onLuu(pid) }
        → { mo(person), dong(), pid() }

   Lời gọi của biểu mẫu (chép nguyên gốc; action mã hoá lấy đúng chuỗi trong dexuathoso.js / inject):
     Mở:  PKG_CORE_HOSONHANSU_05.LayDSLoaiDinhDanhBatBuoc · LayDSLoaiLienHeBatBuoc · GetPersonIdentifierByPerson_Id
          · GetPersonContactByPerson_Id (X.ddlh) · PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile (Dân tộc / Tôn giáo)
          · PKG_CORE_HOSONHANSU_06.Get_Person_Address (Nơi sinh / Hộ khẩu) · Get_Person_Bank_Account
          · PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo (dChiHienHanh 1) · LayDSNguoiHoc_All (thanh thông tin
          sinh viên, strTuKhoa = mã số, dBoQuaPhamVi 0, pageSize 20)
          Danh mục: CORE_PERSON.DOB_PRECISION_LEVEL, CORE_PERSON.GENDER_ID, CHUN.CHLU, NS.DATO, NS.TOGI,
          TS.DOITUONGHOADON, PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE, PERSON_ADDRESS.ADDRESS_TYPE_CODE,
          CHUN.DMTT (tỉnh / huyện / xã — ums.pat.dmTinhThanh, cùng bảng genDropTinhThanh gốc)
     Lưu: KiemTraThongTinDinhDanh / KiemTraThongTinLienHe (loại chưa có bản ghi, có giá trị)
          → UpdateCorePerson (strId, strFullName, strLastName, strMiddleName, strFirstName, strDateOfBirth,
            strDobPrecisionLevel, dBirthDay/Month/Year, strGenderId, strProfileStatusId '', strPortraitFileId)
          → Insert|UpdatePersonIdentifier · Insert|UpdatePersonContact (bỏ ô trống)
          · Them_|Sua_Person_Profile (strReligion_Id, strEthnicity_Id + giữ nguyên 7 cột khác của hồ sơ)
          · Ins_|Upd_Person_Address (2 cụm; Id/strId sinh mới khi thêm) · Ins_|Upd_Person_Bank_Account
          · Them_|Sua_PersonInvoiceInfo (strBuyer_Ref_Type 'CORE_PERSON', strBuyer_Ref_Id = người)

   Khác gốc (inject là ~40 lớp vá chồng lên nhau — ở đây viết theo Ý ĐỊNH cuối cùng của các lớp vá):
     · Một luồng Lưu tuần tự, không còn thanh tiến trình ngầm / hẹn giờ 300–600 ms / "watchdog".
       Kiểm tra trùng báo trùng → KHÔNG lưu gì (gốc: vẫn lưu riêng hoá đơn / ngân hàng / địa chỉ dù
       banner báo "toàn bộ nội dung KHÔNG được ghi lại").
     · Số CCCD / Email / Điện thoại ở tab 1 và dòng tương ứng ở bảng tab 2 là MỘT giá trị: gõ bên nào thì
       bên kia theo ngay (gốc: "cầu nối" ghi đè lúc Lưu, ô nào sửa sau thắng).
     · Mức độ ngày sinh ẩn / hiện từng ô Ngày / Tháng / Năm (gốc SV .parent()×3 ẩn nhầm cả lưới).
     · Hoá đơn cá nhân (không MST): tên người mua đổ vào ô "Họ tên người mua" thay vì ô Tên đơn vị.
     · Chưa chọn sinh viên thì KHÔNG hiện biểu mẫu (gốc hiện form trống → bấm Lưu ra ORA-01400).
     · Quốc tịch: hiện như gốc nhưng KHÔNG lưu đi đâu (gốc không có tham số nào nhận) — giữ như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.nsDxhs;
    var A = ums.hsA = ums.hsA || {};
    var NH = 'SV_NGUOIHOC_01_MH/', PNH = 'PKG_CORE_NGUOIHOC_01.';

    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function bo(s) { return e(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase(); }
    function giong(a, b) { return e(a).trim().toUpperCase() === e(b).trim().toUpperCase(); }
    function chung() { return { strVaiTroDangNhap_Id: '', strHanhDong_Code: '' }; }
    function gop(a, b) { Object.keys(b || {}).forEach(function (k) { a[k] = b[k]; }); return a; }
    A.e = e; A.arr = arr; A.uid = uid;

    /* Chuẩn hoá một dòng SV_HoSo/LayDanhSach thành "person" (openEditByPerson của hosodanhsach gốc) */
    A.nguoi = function (r) {
        r = r || {};
        return {
            id: r.ID, hoDem: r.HODEM, ten: r.TEN, ngay: r.NGAYSINH_NGAY, thang: r.NGAYSINH_THANG,
            nam: r.NGAYSINH_NAM || r.BIRTH_YEAR || '', anh: r.ANH || r.ANHCANHAN || '',
            gioiTinh: r.GENDER_ID || r.GIOITINH_ID || '', gioiTinhMa: r.GIOITINH_MA || '',
            danTocMa: r.DANTOC_MA || '', tonGiaoMa: r.TONGIAO_MA || '', quocTichMa: r.QUOCTICH_MA || '',
            ma: r.MASO || '', aData: r
        };
    };
    A.ngaySinh = function (r) {
        return [r.NGAYSINH_NGAY, r.NGAYSINH_THANG, r.NGAYSINH_NAM].map(e).filter(Boolean).join('/');
    };

    /* =====================================================================
       Cột trái: danh sách sinh viên
       ===================================================================== */
    A.locHtml = function () {
        function s(k, ph) { return '<div class="ums-field"><select class="ums-select" data-sv="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }
        return '<div class="ums-filter hsa-loc">' + s('he', '--Chọn hệ--') + s('khoa', '--Chọn khóa--') + s('ct', '--Chọn chương trình--') + s('lop', '--Chọn lớp--') +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-sv': 'tim' } }) + '</div></div>';
    };
    A.dsSV = function (m, o) {
        o = o || {};
        var side = m.side, st = { page: 1, size: 10, total: 0, rows: [], chon: '' }, cas = null, token = 0;
        function f(k) { return side.querySelector('[data-sv="' + k + '"]'); }
        ui.enhance(side);
        if (o.loc) {
            cas = ums.ref.cascade({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop'),
                labels: { he: '--Chọn hệ--', khoa: '--Chọn khóa--', ct: '--Chọn chương trình--', lop: '--Chọn lớp--' },
                onChange: function () { api.load(1); } });
            // gốc: chọn Lớp chỉ đổi ô, không tự tải; Hệ / Khoá / CT thì tải lại (onChange ở trên)
        }
        side.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-sv="tim"]')) { api.load(1); return; }
            var it = ev.target.closest('.hsa-sv');
            if (!it || !m.sideBody.contains(it)) return;
            var i = Number(it.getAttribute('data-i')), r = st.rows[i];
            if (!r) return;
            st.chon = String(i);
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.hsa-sv'), function (x) { x.classList.toggle('is-active', x === it); });
            if (o.onPick) o.onPick(r);
        });
        if (m.search) m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); api.load(1); } });
        /* Luật cột trái (BO-CUC 12): Tải lại + Bộ lọc nâng cao, Hệ/Khoá/CT/Lớp ẩn sẵn, bỏ nút Tìm kiếm, gõ là tự tìm
           (đổi ô lọc đã tự nạp qua cascade.onChange → tuTaiLoc: false) */
        pat.cotTrai(m, { tai: function () { return api.load(1); }, tuTaiLoc: false });
        function dongPhu(r) {
            if (o.dong) return o.dong(r);
            return '<span class="ums-master__item__sub">' + esc(e(r.MASO)) + '</span>' +
                '<span class="ums-master__item__sub">' + esc(A.ngaySinh(r)) + '</span>';
        }
        function ve() {
            if (m.sideCount) m.sideCount.textContent = '(' + st.total + ')';
            m.sideBody.innerHTML = !st.rows.length ? ui.empty('Không tìm thấy sinh viên', 'fa-user-graduate') : st.rows.map(function (r, i) {
                // 1 SV học nhiều ngành → nhiều dòng cùng ID: đánh dấu theo VỊ TRÍ dòng (gốc dò MASO trong chữ của dòng)
                return '<button type="button" class="ums-master__item ums-dsns__item hsa-sv' + (String(i) === st.chon ? ' is-active' : '') +
                    '" data-i="' + i + '">' + pat.anhNguoi(r.ANH) +
                    '<span class="ums-master__item__main"><b>' + esc((e(r.HODEM) + ' ' + e(r.TEN)).trim()) + '</b>' + dongPhu(r) + '</span></button>';
            }).join('');
            m.setPage({
                index: st.page, size: st.size, total: st.total, shown: st.rows.length,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(st.total / st.size)) api.load(p); },
                onSize: function (v) { st.size = v; api.load(1); }
            });
        }
        var api = {
            rows: function () { return st.rows; },
            boChon: function () { st.chon = ''; ve(); },
            load: function (page) {
                if (page) st.page = page;
                var t = ++token;
                m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                var v = cas ? cas.values() : { he: '', khoa: '', ct: '', lop: '' };
                return ums.api.call(o.call(m.search ? m.search.value.trim() : '', v, st.page, st.size === 'all' ? 1000000 : st.size)).then(function (x) {
                    if (t !== token) return;
                    st.rows = arr(x.data); st.total = Number(x.pager) || st.rows.length; st.chon = '';
                    ve();
                }).catch(function (err) {
                    if (t !== token) return;
                    m.sideBody.innerHTML = ui.fail(err.message);
                    ums.api.handle(err, 'danh sách sinh viên');
                });
            }
        };
        return api;
    };

    /* =====================================================================
       Biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất"
       ===================================================================== */
    var DM = {
        mucDo: 'CORE_PERSON.DOB_PRECISION_LEVEL', gioiTinh: 'CORE_PERSON.GENDER_ID', quocTich: 'CHUN.CHLU',
        danToc: 'NS.DATO', tonGiao: 'NS.TOGI', doiTuong: 'TS.DOITUONGHOADON', loaiTK: 'PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE',
        loaiDC: 'PERSON_ADDRESS.ADDRESS_TYPE_CODE'
    };
    var dmHua = null;
    function dm() {
        if (dmHua) return dmHua;
        var o = {};
        dmHua = Promise.all(Object.keys(DM).map(function (k) { return X.dmRows(DM[k]).then(function (r) { o[k] = r; }); }))
            .then(function () { return o; });
        return dmHua;
    }
    var TRANGTHAI = {
        NORMAL: 'ok', CHUYENTRUONG: 'ok', GRADUATE: 'info', RESERVE: 'info', CANHBAO: 'warn', REPEATE: 'warn', DROPOUT: 'warn',
        KHONGXACDINH: 'warn', DUNGHOC: 'warn', FORCEDROPOUT: 'bad', XOATEN: 'bad', CHUYENTRUONGDI: 'bad'
    };
    var TU_PHONE = ['DIENTHOAI', 'SDT', 'DTDD', 'DIDONG', 'MOBILE', 'PHONE', 'TEL', 'SOMAY', 'LIENLAC', 'CELL', 'HOTLINE'];
    var TU_EMAIL = ['EMAIL', 'MAIL', 'THUDIENTU', 'HOMTHU'];
    function khoa(s) { return bo(s).replace(/[^A-Z0-9]/g, ''); }

    function oNhap(k, nhan, o) {
        o = o || {};
        var ctl = o.select
            ? '<select class="ums-select" data-hs="' + k + '" data-ph="' + esc(o.ph || '') + '"><option value=""></option></select>'
            : '<input class="ums-input" data-hs="' + k + '"' + (o.date ? ' data-date' : '') + ' placeholder="' + esc(o.ph || '') + '" autocomplete="off"' + (o.ro ? ' readonly' : '') + '>';
        return '<div' + (o.span ? ' class="hsa-full"' : '') + '>' + ui.field(nhan, ctl, { hint: o.hint }) + '</div>';
    }
    function cum(k, t, chiTiet) {
        return '<div class="ums-legend"><i class="fa-light ' + (k === 'ns' ? 'fa-location-dot' : 'fa-house') + '"></i> ' + t + '</div>' +
            '<div class="ums-grid ums-grid--2 hsa-grid">' +
            oNhap(k + 'Tinh', 'Tỉnh / Thành phố', { select: true, ph: 'Chọn tỉnh thành' }) +
            oNhap(k + 'Huyen', 'Quận / Huyện', { select: true, ph: 'Chọn quận/huyện' }) +
            oNhap(k + 'Xa', 'Xã / Phường', { select: true, ph: 'Chọn phường/xã' }) +
            oNhap(k + 'Line', chiTiet[0], { ph: chiTiet[1] }) + '</div>';
    }

    A.editor = function (host, o) {
        o = o || {};
        var TABS = [{ key: 'tt', text: 'Thông tin cơ bản', icon: 'fa-user' }, { key: 'dd', text: 'Định danh & Liên hệ', icon: 'fa-id-card' },
            { key: 'hd', text: 'Xuất hoá đơn', icon: 'fa-file-invoice-dollar' }];
        host.innerHTML =
            '<div class="ums-panel hsa-ed">' +
                '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-file-circle-question"></i> Chỉnh sửa - Hồ sơ đề xuất</div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-hs-a': 'dong' } }) + ui.btn('save', { attr: { 'data-hs-a': 'luu' } }) + '</div></div>' +
                '<div class="hsa-thanh" data-z="thanh"></div>' +
                '<div class="hsa-loi" data-z="loi" hidden></div>' +
                '<div class="ums-panel__body">' + ui.tabs(TABS, 'tt', 'data-hs-tab') +
                '<div data-hs-pane="tt">' +
                    '<div class="ums-legend"><i class="fa-light fa-user"></i> Thông tin cá nhân</div>' +
                    '<div class="hsa-canhan"><div class="ums-grid ums-grid--2 hsa-grid">' +
                        oNhap('ho', 'Họ') + oNhap('dem', 'Tên đệm') + oNhap('ten', 'Tên') + oNhap('full', 'Tên đầy đủ', { ro: true }) +
                        oNhap('mucDo', 'Mức độ ngày sinh', { select: true, ph: 'Chọn mức độ ngày sinh' }) + oNhap('gioiTinh', 'Giới tính', { select: true, ph: 'Chọn giới tính' }) +
                        oNhap('ngay', 'Ngày sinh', { ph: 'dd' }) + oNhap('thang', 'Tháng sinh', { ph: 'mm' }) + oNhap('nam', 'Năm sinh', { ph: 'yyyy' }) +
                        oNhap('nsFull', 'Ngày sinh (đầy đủ)', { ph: 'dd/mm/yyyy', hint: 'Gộp Ngày/Tháng/Năm — dán dd/mm/yyyy vào đây cũng tự tách ra 3 ô' }) +
                        oNhap('quocTich', 'Quốc tịch', { select: true, ph: '-- Chọn quốc tịch --' }) + oNhap('danToc', 'Dân tộc', { select: true, ph: '-- Chọn dân tộc --' }) +
                        oNhap('tonGiao', 'Tôn giáo', { select: true, ph: '-- Chọn tôn giáo --' }) + oNhap('email', 'Email', { ph: 'email@...' }) +
                        oNhap('dienThoai', 'Điện thoại', { ph: '09xx xxx xxx' }) +
                    '</div><div class="hsa-anh" data-z="anh"></div></div>' +
                    cum('ns', 'Nơi sinh', ['Chi tiết (số nhà / thôn / xóm)', 'Số nhà, tên đường, thôn/xóm...']) +
                    '<div class="ums-legend"><i class="fa-light fa-id-card"></i> Số CCCD / Định danh</div>' +
                    '<div class="ums-grid ums-grid--2 hsa-grid">' + oNhap('cccdSo', 'Số CCCD', { ph: '12 chữ số' }) + oNhap('cccdNgay', 'Ngày cấp', { date: true, ph: 'dd/mm/yyyy' }) +
                        oNhap('cccdNoi', 'Nơi cấp', { span: true, ph: 'Ví dụ: Cục Cảnh sát QLHC...' }) + '</div>' +
                    cum('hk', 'Hộ khẩu thường trú', ['Số nhà / thôn / xóm', '']) +
                '</div>' +
                '<div data-hs-pane="dd" hidden><div data-z="ddlh"></div></div>' +
                '<div data-hs-pane="hd" hidden>' +
                    '<div class="ums-legend"><i class="fa-light fa-file-invoice-dollar"></i> Người mua / Xuất hoá đơn</div>' +
                    '<div class="ums-grid ums-grid--2 hsa-grid">' +
                        oNhap('hdDoiTuong', 'Đối tượng xuất hoá đơn', { select: true, ph: '-- Chọn đối tượng --' }) +
                        oNhap('hdNguoiMua', 'Họ tên người mua hàng', { ph: 'Người nộp tiền / người mua' }) +
                        oNhap('hdTenDonVi', 'Tên đơn vị / Công ty (nếu xuất cho tổ chức)', { span: true, ph: 'Tên đơn vị nhận hoá đơn' }) +
                        oNhap('hdMST', 'Mã số thuế (MST)', { ph: '10 hoặc 13 chữ số' }) + oNhap('hdQHNS', 'Mã quan hệ ngân sách', { ph: 'Mã QHNS (nếu là đơn vị NSNN)' }) +
                        oNhap('hdSDT', 'Số điện thoại nhận', { ph: '09xx xxx xxx' }) +
                        oNhap('hdDiaChi', 'Địa chỉ trên hoá đơn', { span: true, ph: 'Địa chỉ ghi trên hoá đơn' }) +
                        oNhap('hdEmail', 'Email nhận hoá đơn điện tử', { span: true, ph: 'email nhận HĐĐT' }) + '</div>' +
                    '<div class="ums-legend"><i class="fa-light fa-money-check-dollar"></i> Thông tin thanh toán</div>' +
                    '<div class="ums-grid ums-grid--2 hsa-grid">' +
                        oNhap('tkLoai', 'Loại tài khoản ngân hàng', { select: true, ph: '-- Chọn loại tài khoản --' }) +
                        oNhap('tkNganHang', 'Ngân hàng', { ph: 'Tên ngân hàng' }) + oNhap('tkSo', 'Số tài khoản', { ph: 'Số tài khoản ngân hàng' }) +
                        oNhap('tkChu', 'Chủ tài khoản', { ph: 'Tên chủ tài khoản' }) +
                        oNhap('tkGhiChu', 'Ghi chú', { span: true, ph: 'Ghi chú thêm cho hoá đơn (nếu có)' }) + '</div>' +
                '</div></div></div>';

        function F(k) { return host.querySelector('[data-hs="' + k + '"]'); }
        function val(k) { var el = F(k); return el ? e(el.value).trim() : ''; }
        function dat(k, v) {
            var el = F(k); if (!el) return;
            el.value = e(v);
            if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y');
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        }
        function z(k) { return host.querySelector('[data-z="' + k + '"]'); }
        ui.enhance(host);
        var anh = ums.files.avatar(z('anh'), { icon: 'fa-user' });
        var bang = X.ddlh(z('ddlh'), { motCot: true, boQuaRong: true, motChinh: true, locHieuLuc: true, boQuaTrungMinh: true, xoaMem: true });
        var st = { p: null, pid: '', dm: null, profile: null, bank: null, inv: null, dc: [], dcCham: {}, chamLH: {}, tt: null, luot: 0 };

        /* ---------- Tab ---------- */
        function moTab(k) {
            ui.tabsActive(host, k, 'data-hs-tab');
            Array.prototype.forEach.call(host.querySelectorAll('[data-hs-pane]'), function (p) { p.hidden = p.getAttribute('data-hs-pane') !== k; });
        }
        host.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-hs-tab]');
            if (t) { ev.preventDefault(); moTab(t.getAttribute('data-hs-tab')); return; }
            var b = ev.target.closest('[data-hs-a]');
            if (!b) return;
            if (b.getAttribute('data-hs-a') === 'dong') { if (o.onDong) o.onDong(); }
            else { catTatCa(); luu(); }
        });

        /* ---------- Tự cắt khoảng trắng thừa ở mọi ô nhập (gốc zoneEditModal_inject.js, bản kéo về 29/09/2026) ----------
           Dữ liệu dán từ Excel / Word hay dính khoảng trắng đầu / cuối và khoảng trắng không ngắt dòng (U+00A0) —
           máy chủ coi là ký tự khác nên báo lỗi hoặc lưu sai. Cắt lúc RỜI Ô và lần nữa ngay trước khi Lưu: bỏ hai
           đầu, gom nhiều khoảng trắng liền nhau thành một. Không đụng ô đánh dấu, ô ngày kiểu date, ô chỉ đọc / khoá,
           ô gắn data-ze-khong-trim. Gán .value nên không bắn sự kiện gõ (như gốc). */
        var BO_QUA_CAT = ['checkbox', 'radio', 'file', 'hidden', 'button', 'submit', 'image', 'reset', 'date', 'datetime-local',
            'time', 'month', 'week', 'color', 'range'];
        function catMotO(el) {
            if (!el || el.disabled || el.readOnly || el.getAttribute('data-ze-khong-trim')) return;
            if (BO_QUA_CAT.indexOf(e(el.type).toLowerCase()) > -1) return;
            var v = el.value;
            if (typeof v !== 'string' || !v) return;
            var moi = v.replace(/[\s ]+/g, ' ').trim();
            if (moi !== v) el.value = moi;
        }
        function catTatCa() {
            Array.prototype.forEach.call(host.querySelectorAll('input, textarea'), catMotO);
            hoTen();      // ô Họ tên đầy đủ ghép từ ba ô vừa cắt
        }
        host.addEventListener('focusout', function (ev) {
            var t = ev.target, the = t && e(t.tagName).toUpperCase();
            if (the !== 'INPUT' && the !== 'TEXTAREA') return;
            catMotO(t);
            if (t === F('ho') || t === F('dem') || t === F('ten')) hoTen();
        });

        /* ---------- Danh mục ---------- */
        var pDm = dm().then(function (d) {
            st.dm = d;
            pat.fill(F('mucDo'), d.mucDo, { head: 'Chọn mức độ ngày sinh' });
            pat.fill(F('gioiTinh'), d.gioiTinh, { head: 'Chọn giới tính' });
            pat.fill(F('quocTich'), d.quocTich, { head: '-- Chọn quốc tịch --' });
            pat.fill(F('danToc'), d.danToc, { head: '-- Chọn dân tộc --' });
            pat.fill(F('tonGiao'), d.tonGiao, { head: '-- Chọn tôn giáo --' });
            pat.fill(F('hdDoiTuong'), d.doiTuong, { head: '-- Chọn đối tượng --' });
            pat.fill(F('tkLoai'), d.loaiTK, { head: '-- Chọn loại tài khoản --' });
            return d;
        });

        /* ---------- Họ tên / ngày sinh ---------- */
        function hoTen() { F('full').value = val('ho') + ' ' + val('dem') + ' ' + val('ten'); }
        ['ho', 'dem', 'ten'].forEach(function (k) { F(k).addEventListener('input', hoTen); });
        function hai(v) { v = e(v).trim().replace(/\D/g, ''); return !v ? '' : (v.length === 1 ? '0' + v : v); }
        function gopNS() {
            var d = hai(val('ngay')), m = hai(val('thang')), y = val('nam').replace(/\D/g, ''), s = '';
            if (y) s = (d && m) ? d + '/' + m + '/' + y : (m ? m + '/' + y : y); else if (d && m) s = d + '/' + m;
            F('nsFull').value = s;
        }
        function tachNS() {
            var s = val('nsFull'), d = '', m = '', y = '', mt;
            if (!s) return;
            if ((mt = s.match(/^(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{4})$/))) { d = mt[1]; m = mt[2]; y = mt[3]; }
            else if ((mt = s.match(/^(\d{4})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{1,2})$/))) { y = mt[1]; m = mt[2]; d = mt[3]; }
            else if ((mt = s.match(/^(\d{1,2})\s*[\/\-.]\s*(\d{4})$/))) { m = mt[1]; y = mt[2]; }
            else if ((mt = s.match(/^(\d{2})(\d{2})(\d{4})$/))) { d = mt[1]; m = mt[2]; y = mt[3]; }
            else if ((mt = s.match(/^(\d{4})$/))) { y = mt[1]; }
            else { gopNS(); return; }
            if ((d && (+d < 1 || +d > 31)) || (m && (+m < 1 || +m > 12))) { gopNS(); return; }
            F('ngay').value = hai(d); F('thang').value = hai(m); F('nam').value = y; gopNS();
        }
        ['ngay', 'thang', 'nam'].forEach(function (k) { F(k).addEventListener('input', gopNS); });
        F('nsFull').addEventListener('change', tachNS);
        F('nsFull').addEventListener('focus', function () { var t = this; setTimeout(function () { try { t.select(); } catch (x) { /* bỏ qua */ } }, 0); });
        function hienNgay() {
            var r = ((st.dm && st.dm.mucDo) || []).filter(function (x) { return x.ID === val('mucDo'); })[0];
            var an = { EXACT: [0, 0, 0], MONTH_ONLY: [1, 0, 0], YEAR_ONLY: [1, 1, 0], UNKNOWN: [1, 1, 1] }[r ? e(r.MA).trim() : ''];
            if (!an) return;          // mức độ lạ / chưa chọn: giữ nguyên như gốc (switch không có default)
            ['ngay', 'thang', 'nam'].forEach(function (k, i) { X.an(F(k), an[i]); });
        }
        if (window.jQuery) jQuery(F('mucDo')).on('select2:select select2:clear', hienNgay);

        /* ---------- Tỉnh → Huyện → Xã (genDropTinhThanh + _zeApply2Cap: tỉnh 2 cấp thì Xã treo thẳng vào Tỉnh) ---------- */
        var dsTT = [];
        var pTT = pat.dmTinhThanh().then(function (r) { dsTT = r || []; }, function () { dsTT = []; });
        function con(id) { return dsTT.filter(function (x) { return (x.QUANHECHA_ID || null) === (id || null); }); }
        function haiCap(tinh) { var c = con(tinh); return c.length > 0 && !c.some(function (x) { return con(x.ID).length; }); }
        function tenOf(id) { var x = dsTT.filter(function (r) { return r.ID === id; })[0]; return x ? x.TEN : ''; }
        function khoaO(el, khoa) { el.disabled = !!khoa; if (window.jQuery) jQuery(el).trigger('change.select2'); }
        function napCum(k, tinh, huyen, xa) {
            var T = F(k + 'Tinh'), H = F(k + 'Huyen'), Xa = F(k + 'Xa');
            T.value = tinh || '';
            if (window.jQuery) jQuery(T).trigger('change.select2');
            var hc = tinh && haiCap(tinh);
            pat.fill(H, tinh && !hc ? con(tinh) : [], { head: 'Chọn quận/huyện' });   // tỉnh 2 cấp: khoá ô Huyện, Xã treo vào Tỉnh
            H.value = !hc && huyen ? huyen : ''; if (window.jQuery) jQuery(H).trigger('change.select2');
            khoaO(H, !tinh || hc);
            var cha = hc ? tinh : H.value;
            pat.fill(Xa, cha ? con(cha) : [], { head: 'Chọn phường/xã' });
            Xa.value = cha && xa ? xa : ''; if (window.jQuery) jQuery(Xa).trigger('change.select2');
            khoaO(Xa, !cha);
        }
        ['ns', 'hk'].forEach(function (k) {
            pTT.then(function () { pat.fill(F(k + 'Tinh'), con(null), { head: 'Chọn tỉnh thành' }); napCum(k, '', '', ''); });
            if (!window.jQuery) return;
            var ev = 'select2:select select2:clear';
            jQuery(F(k + 'Tinh')).on(ev, function () { st.dcCham[k] = 1; napCum(k, val(k + 'Tinh'), '', ''); dienDiaChiHD(k); });
            jQuery(F(k + 'Huyen')).on(ev, function () { st.dcCham[k] = 1; napCum(k, val(k + 'Tinh'), val(k + 'Huyen'), ''); dienDiaChiHD(k); });
            jQuery(F(k + 'Xa')).on(ev, function () { st.dcCham[k] = 1; dienDiaChiHD(k); });
            F(k + 'Line').addEventListener('input', function () { st.dcCham[k + 'Line'] = 1; dienDiaChiHD(k); });
        });
        function cumGT(k) {
            var b = { kind: k, tinh: val(k + 'Tinh'), huyen: val(k + 'Huyen'), xa: val(k + 'Xa'), line: val(k + 'Line') };
            b.daCham = !!st.dcCham[k]; b.chamLine = !!st.dcCham[k + 'Line'];
            b.full = [b.line, tenOf(b.xa), tenOf(b.huyen), tenOf(b.tinh)].filter(Boolean).join(', ');
            return b;
        }
        /* _zeAutoFillHoaDon: địa chỉ vừa sửa tự điền sang "Địa chỉ trên hoá đơn" — không đè giá trị lấy từ CSDL / người dùng gõ */
        var hdTuDien = false, hdCham = false;
        F('hdDiaChi').addEventListener('input', function () { hdCham = true; });
        function dienDiaChiHD(k) {
            if (hdCham || (val('hdDiaChi') && !hdTuDien)) return;
            var b = cumGT(k);
            if (!b.full) return;
            F('hdDiaChi').value = b.full; hdTuDien = true;
        }

        /* ---------- Tab 1 ↔ bảng tab 2 (CCCD, Email, Điện thoại) ---------- */
        var map = { cccd: '', email: '', phone: '' };
        function chonLoai() {
            return bang.loai.then(function (x) {
                var c = x[0].filter(function (t) { var m = e(t.MA).toUpperCase(), n = e(t.TEN).toUpperCase(); return m === 'CCCD' || n.indexOf('CCCD') > -1 || n.indexOf('CĂN CƯỚC') > -1 || bo(n).indexOf('CAN CUOC') > -1; })[0];
                map.cccd = c ? c.ID : '';
                function diem(t, tu) {
                    var k = khoa(t.MA) + '|' + khoa(t.TEN), d = tu.some(function (w) { return k.indexOf(w) > -1; }) ? 2 : 0;
                    var b = (bang.rows.lh || []).filter(function (r) { return giong(r.CONTACT_TYPE_CODE_ID, t.ID); })[0], v = b ? e(b.CONTACT_VALUE) : '';
                    if (v && ((tu === TU_EMAIL && v.indexOf('@') > -1) || (tu === TU_PHONE && /^[\d\s+\-().]+$/.test(v) && v.replace(/\D/g, '').length >= 6))) d += 3;
                    return d;
                }
                function tot(tu) { var s = x[1].map(function (t) { return { id: t.ID, d: diem(t, tu) }; }).filter(function (a) { return a.d > 0; }).sort(function (a, b) { return b.d - a.d; }); return s.length ? s[0].id : ''; }
                map.email = tot(TU_EMAIL); map.phone = tot(TU_PHONE);
                if (!map.phone) {
                    var con1 = x[1].filter(function (t) { return t.ID !== map.email && !/DIACHI|ADDRESS|FACEBOOK|ZALO|WEBSITE|SKYPE|GHICHU/.test(khoa(t.MA) + khoa(t.TEN)); });
                    if (con1.length === 1) map.phone = con1[0].ID;
                }
                if (!map.email) { var con2 = x[1].filter(function (t) { return t.ID !== map.phone; }); if (con2.length === 1) map.email = con2[0].ID; }
                return map;
            });
        }
        var CAP = [['cccdSo', 'dd', 'cccd', 'so'], ['cccdNgay', 'dd', 'cccd', 'ngay'], ['cccdNoi', 'dd', 'cccd', 'noi'], ['email', 'lh', 'email', 'gt'], ['dienThoai', 'lh', 'phone', 'gt']];
        function oBang(c) { return map[c[2]] ? bang.o(c[1], map[c[2]], c[3]) : null; }
        CAP.forEach(function (c) {
            F(c[0]).addEventListener('input', function () { var b = oBang(c); if (b) { b.value = F(c[0]).value; b.setAttribute('data-cham', '1'); } });
            F(c[0]).addEventListener('change', function () { var b = oBang(c); if (b) { b.value = F(c[0]).value; if (b._flatpickr) b._flatpickr.setDate(b.value || null, false, 'd/m/Y'); } });
        });
        z('ddlh').addEventListener('input', dongBoTu);
        z('ddlh').addEventListener('change', dongBoTu);
        function dongBoTu(ev) {
            CAP.forEach(function (c) { var b = oBang(c); if (b && b === ev.target) dat(c[0], b.value); });
        }
        function keoTuBang() { CAP.forEach(function (c) { var b = oBang(c); dat(c[0], b ? b.value : ''); }); }

        /* ---------- Thanh thông tin sinh viên (LayDSNguoiHoc_All theo mã số) ---------- */
        function veThanh() {
            var r = st.tt || {}, p = st.p || {}, a = p.aData || {};
            var hoTenSV = X.lay(r, ['FULL_NAME', 'HOTEN', 'HO_TEN']) || [e(r.HODEM), e(r.TEN)].filter(Boolean).join(' ') || F('full').value.replace(/\s+/g, ' ').trim();
            var ma = X.lay(r, ['MASO']) || p.ma || X.lay(a, ['MASO', 'QLSV_NGUOIHOC_MASO']);
            var sdt = X.lay(r, ['TTLL_DIENTHOAICANHAN', 'DIENTHOAI', 'PHONE']);
            var ttMa = e(r.QLSV_TRANGTHAINGUOIHOC_MA).toUpperCase(), ttTen = e(r.QLSV_TRANGTHAINGUOIHOC_TEN);
            function chip(i, n, v) { return v ? '<span class="hsa-chip"><i class="fa-light ' + i + '"></i> ' + esc(n) + ': <b>' + esc(v) + '</b></span>' : ''; }
            z('thanh').innerHTML = !hoTenSV && !ma ? '' :
                '<div class="hsa-thanh__dong">' + (ttMa || (ttTen && ttTen !== '-') ? ui.badge(ttTen && ttTen !== '-' ? ttTen : ttMa, TRANGTHAI[ttMa] || 'mute') : '') +
                    '<b class="hsa-thanh__ten">' + esc(hoTenSV.toUpperCase()) + '</b>' + (ma ? '<span>– ' + esc(ma) + '</span>' : '') + (sdt ? '<span>– ' + esc(sdt) + '</span>' : '') + '</div>' +
                '<div class="hsa-thanh__dong">' + chip('fa-users', 'Lớp', X.lay(r, ['DAOTAO_LOPQUANLY_N1_TEN', 'DAOTAO_LOPQUANLY_TEN']) || X.lay(a, ['DAOTAO_LOPQUANLY_TEN'])) +
                    chip('fa-book', 'Ngành', X.lay(r, ['NGANHHOC_N1_TEN', 'DAOTAO_NGANH_TEN'])) + chip('fa-building-columns', 'Khoa', X.lay(r, ['KHOAHOC_N1_TEN', 'DAOTAO_KHOAQUANLY_TEN']) || X.lay(a, ['DAOTAO_KHOAQUANLY_TEN'])) +
                    chip('fa-calendar', 'Niên khoá', X.lay(r, ['NIENKHOA_N1', 'NIENKHOA'])) + '</div>';
        }
        function napTT(luot) {
            var p = st.p, ma = p.ma || X.lay(p.aData || {}, ['MASO', 'QLSV_NGUOIHOC_MASO']);
            if (!ma) return;
            ums.api.call(gop({ action: NH + 'DSA4BRIPJjQuKAkuIh4ALS0P', func: PNH + 'LayDSNguoiHoc_All', silent: true, strTuKhoa: ma,
                strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '', strDaoTao_KhoaQuanLy_Id: '',
                strDaoTao_LopQuanLy_Id: '', strStudyStatus_Ids: '', dIsPrimary: '', dBoQuaPhamVi: 0, pageIndex: 1, pageSize: 20 }, chung())).then(function (x) {
                if (luot !== st.luot) return;
                var ds = arr(x.data);
                st.tt = ds.filter(function (r) { return giong(r.ID, st.pid); })[0] || ds.filter(function (r) { return e(r.MASO) === ma; })[0] || ds[0] || null;
                veThanh();
            }, function () { /* phạm vi chặn / lỗi: thanh giữ Họ tên + Mã */ });
        }

        /* ---------- Báo lỗi ngay trên biểu mẫu (gốc: banner #zeLoiLuu / #zeChanLuu) ---------- */
        function loi(msg) { var el = z('loi'); el.hidden = !msg; el.innerHTML = msg ? '<i class="fa-light fa-triangle-exclamation"></i> <span>' + esc(msg) + '</span>' : ''; }

        /* ---------- Mở hồ sơ ---------- */
        function mo(p, giuTab) {
            st.luot++;
            var luot = st.luot;
            st.p = p; st.pid = e(p.id); st.profile = null; st.bank = null; st.inv = null; st.dc = []; st.dcCham = {}; st.tt = null;
            hdTuDien = false; hdCham = false;
            if (!giuTab) { loi(''); moTab('tt'); }
            Array.prototype.forEach.call(host.querySelectorAll('input[data-hs]'), function (el) { el.value = ''; el.classList.remove('is-invalid'); });
            bang.xoa();
            var hd = e(p.hoDem).trim().replace(/\s+/g, ' ').split(' ');
            F('ho').value = hd.shift() || ''; F('dem').value = hd.join(' '); F('ten').value = e(p.ten); hoTen();
            F('ngay').value = e(p.ngay); F('thang').value = e(p.thang); F('nam').value = e(p.nam); gopNS();
            anh.set(p.anh || '');
            veThanh();
            napTT(luot);
            pDm.then(function (d) {
                if (luot !== st.luot) return;
                var ex = d.mucDo.filter(function (x) { return e(x.MA).trim() === 'EXACT'; })[0];
                dat('mucDo', ex ? ex.ID : ''); hienNgay();
                X.chon(F('gioiTinh'), p.gioiTinh || p.gioiTinhMa, d.gioiTinh);
                X.chon(F('danToc'), p.danToc || p.danTocMa, d.danToc);
                X.chon(F('tonGiao'), p.tonGiao || p.tonGiaoMa, d.tonGiao);
                X.chon(F('quocTich'), p.quocTich || p.quocTichMa, d.quocTich);
                ['hdDoiTuong', 'tkLoai'].forEach(function (k) { dat(k, ''); });
                napProfile(luot); napBank(luot, d); napInvoice(luot, d);
            });
            pTT.then(function () { napCum('ns', '', '', ''); napCum('hk', '', '', ''); napDiaChi(luot); });
            bang.nap(st.pid).then(function () { if (luot !== st.luot) return; return chonLoai(); }).then(function () {
                if (luot !== st.luot) return;
                keoTuBang();
                // Email / SĐT hoá đơn trống thì lấy từ liên hệ (gốc: sau 1 s)
                if (!val('hdEmail') && map.email) dat('hdEmail', bang.o('lh', map.email, 'gt').value);
                if (!val('hdSDT') && map.phone) dat('hdSDT', bang.o('lh', map.phone, 'gt').value);
            });
        }

        function napProfile(luot) {
            ums.api.call(gop({ action: NH + 'DSA4FRURJDMyLi8eETMuJygtJAPP', func: PNH + 'LayTTPerson_Profile', silent: true, strId: '', strPerson_Id: st.pid }, chung()))
                .then(function (x) {
                    if (luot !== st.luot) return;
                    var r = arr(x.data)[0];
                    if (!r) return;
                    st.profile = r;
                    // Dân tộc / Tôn giáo nằm ở PERSON_PROFILE — nguồn chuẩn, đè giá trị lấy từ danh sách
                    if (r.ETHNICITY_ID) dat('danToc', r.ETHNICITY_ID);
                    if (r.RELIGION_ID) dat('tonGiao', r.RELIGION_ID);
                }, function () { /* không có hồ sơ chính sách: lưu sẽ Them_ */ });
        }
        function napBank(luot, d) {
            ums.api.call(X.g6('Get_Person_Bank_Account', { strPerson_Id: st.pid, silent: true })).then(function (x) {
                if (luot !== st.luot) return;
                var b = arr(x.data).filter(function (r) { return giong(r.PERSON_ID, st.pid) && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1); })
                    .sort(function (a, c) { return (c.IS_PRIMARY == 1 ? 1 : 0) - (a.IS_PRIMARY == 1 ? 1 : 0); })[0];
                if (!b) return;
                st.bank = b;
                X.chon(F('tkLoai'), b.ACCOUNT_TYPE_CODE, d.loaiTK);   // lưu MA (dữ liệu cũ) hoặc ID
                dat('tkNganHang', b.BANK_NAME); dat('tkSo', b.ACCOUNT_NUMBER); dat('tkChu', b.ACCOUNT_NAME); dat('tkGhiChu', b.NOTE);
            }, function () { /* im như gốc */ });
        }
        function napInvoice(luot, d) {
            ums.api.call(gop({ action: NH + 'DSA4BRIeESQzMi4vCC83LigiJAgvJy4P', func: PNH + 'LayDS_PersonInvoiceInfo', silent: true, strPerson_Id: st.pid, dChiHienHanh: 1 }, chung()))
                .then(function (x) {
                    if (luot !== st.luot) return;
                    var v = arr(x.data)[0];
                    if (!v) return;
                    st.inv = v;
                    // BUYER_TYPE_LOAI: GUID danh mục hoặc mã chữ (bảng đang lẫn hai kiểu) → khớp ID, MA, rồi chữ hiển thị
                    var dt = d.doiTuong.filter(function (r) { return giong(r.ID, v.BUYER_TYPE_LOAI) || giong(r.MA, v.BUYER_TYPE_LOAI) || giong(r.TEN, v.BUYER_TYPE_LOAI); })[0];
                    dat('hdDoiTuong', dt ? dt.ID : '');
                    var ten = e(v.BUYER_NAME_TENNM || v.BUYER_NAME);
                    if (e(v.BUYER_TAX_MST)) dat('hdTenDonVi', ten); else dat('hdNguoiMua', ten);
                    if (v.BUYER_ADDR_DIACHI) dat('hdDiaChi', v.BUYER_ADDR_DIACHI);
                    dat('hdMST', v.BUYER_TAX_MST); dat('hdQHNS', v.BUYER_BUDGET_MAQHNS);
                    if (v.BUYER_EMAIL) dat('hdEmail', v.BUYER_EMAIL);
                    if (v.BUYER_PHONE_SDT) dat('hdSDT', v.BUYER_PHONE_SDT);
                }, function () { /* im như gốc */ });
        }
        var pLoaiDC = null;
        function loaiDC() {
            if (!pLoaiDC) pLoaiDC = dm().then(function (d) { return d.loaiDC || []; });
            return pLoaiDC;
        }
        function idLoaiDC(ds, k) {
            var rx = k === 'ns' ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
            var r = ds.filter(function (x) { return rx.test(bo(x.TEN) + ' ' + bo(x.MA)); })[0];
            return r ? r.ID : '';
        }
        function dsDiaChi() {
            return ums.api.call(X.g6('Get_Person_Address', { strPerson_Id: st.pid, silent: true }))
                .then(function (x) { return arr(x.data).filter(function (r) { return r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1; }); }, function () { return []; });
        }
        function napDiaChi(luot) {
            Promise.all([loaiDC(), dsDiaChi()]).then(function (x) {
                if (luot !== st.luot) return;
                var ds = x[1];
                st.dc = ds;
                function pick(k) {
                    var id = idLoaiDC(x[0], k), rx = k === 'ns' ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
                    return (id && ds.filter(function (r) { return r.ADDRESS_TYPE_CODE === id; })[0]) ||
                        ds.filter(function (r) { return rx.test(bo(r.ADDRESS_TYPE_CODE_NAME || r.ADDRESS_TYPE_NAME)); })[0];
                }
                var ns = pick('ns'), hk = pick('hk');
                if (!ns && !hk && ds.length === 1) hk = ds[0];   // không phân loại được mà chỉ một dòng → hộ khẩu
                [['ns', ns], ['hk', hk]].forEach(function (c) {
                    var r = c[1];
                    if (!r) return;
                    var xa = e(r.WARD_ID), huyen = e(r.DISTRICT_ID || r.QUANHUYEN_ID || r.HUYEN_ID), tinh = e(r.PROVINCE_ID);
                    var nx = dsTT.filter(function (t) { return t.ID === xa; })[0];
                    if (!huyen && nx) huyen = e(nx.QUANHECHA_ID);
                    if (!tinh && huyen) tinh = e((dsTT.filter(function (t) { return t.ID === huyen; })[0] || {}).QUANHECHA_ID);
                    if (huyen === tinh) huyen = '';          // tỉnh 2 cấp: cha của Xã chính là Tỉnh
                    napCum(c[0], tinh, huyen, xa);
                    dat(c[0] + 'Line', r.ADDRESS_LINE1);
                });
            });
        }

        /* =================================================================
           LƯU
           ================================================================= */
        function co(v) { return v !== '' && v !== null && v !== undefined; }
        function nhan(t, call) {
            return function () { return ums.api.call(gop({ silent: true }, call)).catch(function (err) { throw new Error(t + ': ' + (err.message || 'máy chủ từ chối')); }); };
        }
        function luu() {
            var pid = st.pid;
            if (!pid) { loi('Chưa chọn được hồ sơ nên không lưu được. Vui lòng bấm chọn lại sinh viên trong danh sách rồi nhập lại.'); return; }
            loi('');
            Array.prototype.forEach.call(host.querySelectorAll('.is-invalid'), function (x) { x.classList.remove('is-invalid'); });
            // Ngày sinh kiểm trước khi gửi (ums.util.ngaySinh, 2026-09-30) — sai thì báo, không gửi
            var nsKt = ums.util.ngaySinh(val('ngay'), val('thang'), val('nam'), '');
            if (nsKt.loi) { ['ngay', 'thang', 'nam'].forEach(function (k) { if (F(k)) F(k).classList.add('is-invalid'); }); loi('Không lưu được: ' + nsKt.loi + '.'); return; }
            var luot = st.luot, duongAnh = '';
            Promise.all([bang.loai, bang.kiemTra(pid)]).then(function (x) {
                var tr = x[1];
                if (tr) {
                    var el = bang.o(tr.kind, tr.loai.ID, tr.kind === 'dd' ? 'so' : 'gt');
                    if (el) el.classList.add('is-invalid');
                    CAP.forEach(function (c) { if (oBang(c) === el) F(c[0]).classList.add('is-invalid'); });
                    loi(tr.gt !== undefined ? 'Không lưu được: ' + tr.loai.TEN + (tr.gt ? ' "' + tr.gt + '"' : '') + ' đã được dùng ở một hồ sơ khác. Toàn bộ nội dung vừa nhập trong lần Lưu này đều KHÔNG được ghi lại — sửa lại ô đang tô đỏ rồi bấm Lưu lần nữa.' : tr.ten);
                    return;
                }
                return anh.finalize(pid).then(function (duong) {
                    duongAnh = duong || '';
                    var ns = nsKt.chuoi;
                    return ums.api.call(X.g5('UpdateCorePerson', {
                        strId: pid, strFullName: F('full').value, strLastName: val('ho'), strMiddleName: val('dem'), strFirstName: val('ten'),
                        strDateOfBirth: ns, strDobPrecisionLevel: val('mucDo'), dBirthDay: nsKt.ngay, dBirthMonth: nsKt.thang, dBirthYear: nsKt.nam,
                        strGenderId: val('gioiTinh'), strProfileStatusId: '', strPortraitFileId: duong || ''
                    }));
                }).then(function () { return luuPhu(pid, x[0]); }).then(function (kq) {
                    if (luot !== st.luot) return;
                    if (kq.fail) loi('Đã lưu thông tin cơ bản nhưng chưa lưu được: ' + kq.errors.join(' · '));
                    else ui.toast('Cập nhật thành công!', 'ok');
                    // Nạp lại Id bản ghi con (lần Lưu sau là Update) — giữ nguyên giá trị vừa lưu và tab đang mở
                    gop(st.p, { hoDem: (val('ho') + ' ' + val('dem')).trim(), ten: val('ten'), ngay: val('ngay'), thang: val('thang'), nam: val('nam'),
                        anh: duongAnh, gioiTinh: val('gioiTinh'), danToc: val('danToc'), tonGiao: val('tonGiao'), quocTich: val('quocTich') });
                    mo(st.p, true);
                    if (o.onLuu) o.onLuu(pid);
                });
            }).catch(function (err) { loi(err.message || 'Lưu không thành công'); ums.api.handle(err, 'lưu hồ sơ'); });
        }

        function luuPhu(pid, loai) {
            var calls = bang.calls(pid, loai).map(function (c) {
                var t = /Identifier/.test(c.func) ? 'Thông tin định danh' : 'Thông tin liên hệ';
                return nhan(t, c);
            });
            /* Dân tộc / Tôn giáo — PERSON_PROFILE (save_PersonProfile) */
            var dt = val('danToc'), tg = val('tonGiao'), pr = st.profile || {}, prId = e(pr.PERSON_PROFILE_ID || pr.PROFILE_ID || pr.ID);
            if (dt || tg || prId) {
                var p = gop({
                    strReligion_Id: tg, strEthnicity_Id: dt,
                    strFamilyBackground_Id: e(pr.FAMILY_BACKGROUND_ID), strMaritalStatus_Id: e(pr.MARITAL_STATUS_ID), strPolicyObject_Id: e(pr.POLICY_OBJECT_ID),
                    strBloodType_Code: e(pr.BLOOD_TYPE_CODE), strUnionJoinDate: e(pr.UNION_JOIN_DATE), strPartyJoinDate: e(pr.PARTY_JOIN_DATE),
                    strPartyOfficialDate: e(pr.PARTY_OFFICIAL_DATE), dIsActive: 1
                }, chung());
                if (prId.length === 32) gop(p, { action: NH + 'EjQgHhEkMzIuLx4RMy4nKC0k', func: PNH + 'Sua_Person_Profile', strId: prId });
                else gop(p, { action: NH + 'FSkkLB4RJDMyLi8eETMuJygtJAPP', func: PNH + 'Them_Person_Profile', strPerson_Id: pid });
                calls.push(nhan('Dân tộc / Tôn giáo', p));
            }
            /* Ngân hàng — PERSON_BANK_ACCOUNT (_zeSaveBank): cả 5 ô trống thì không tạo dòng rỗng */
            var b = { loai: val('tkLoai'), nh: val('tkNganHang'), so: val('tkSo'), chu: val('tkChu'), gc: val('tkGhiChu') };
            if (b.loai || b.nh || b.so || b.chu || b.gc) {
                var old = st.bank || {}, bid = e(old.ID), upd = bid.length === 32;
                function so(v, m) { var n = Number(v); return (v === null || v === undefined || v === '' || isNaN(n)) ? m : n; }
                calls.push(nhan('Thông tin thanh toán', X.g6(upd ? 'Upd_Person_Bank_Account' : 'Ins_Person_Bank_Account', gop({
                    strPerson_Id: pid, strAccount_Type_Code: b.loai, strAccount_Status_Code: e(old.ACCOUNT_STATUS_CODE), strBank_Id: e(old.BANK_ID),
                    strBank_Code: e(old.BANK_CODE), strBank_Name: b.nh, strBranch_Id: e(old.BRANCH_ID), strBranch_Code: e(old.BRANCH_CODE),
                    strBranch_Name: e(old.BRANCH_NAME), strAccount_Number: b.so, strAccount_Name: b.chu, strAccount_Currency_Code: e(old.ACCOUNT_CURRENCY_CODE),
                    dIs_Primary: so(old.IS_PRIMARY, 1), dIs_Payroll_Default: so(old.IS_PAYROLL_DEFAULT, 0), dIs_Verified: so(old.IS_VERIFIED, 0), dIs_Active: 1,
                    strEffective_From: e(old.EFFECTIVE_FROM), strEffective_To: e(old.EFFECTIVE_TO), strNote: b.gc
                }, upd ? { strId: bid } : {}))));
            }
            /* Địa chỉ — PERSON_ADDRESS (_zeSaveAddress): cụm có nhập, hoặc người dùng vừa xoá trắng */
            var cumLuu = ['ns', 'hk'].map(cumGT).filter(function (c) { return c.tinh || c.xa || c.line || c.daCham || c.chamLine; });
            var pDC = !cumLuu.length ? Promise.resolve([]) : Promise.all([loaiDC(), dsDiaChi()]).then(function (x) {
                return cumLuu.map(function (c) {
                    var tid = idLoaiDC(x[0], c.kind), t = c.kind === 'ns' ? 'Địa chỉ nơi sinh' : 'Địa chỉ hộ khẩu';
                    if (!tid) return function () { return Promise.reject(new Error(t + ': danh mục PERSON_ADDRESS.ADDRESS_TYPE_CODE chưa khai loại này')); };
                    var old = x[1].filter(function (r) { return r.ADDRESS_TYPE_CODE === tid; })[0], upd = !!(old && old.ID);
                    var rid = (upd ? e(old.ID) : ums.util.uuid()).toUpperCase();
                    function giu(moi, cu, cham) { return co(moi) ? moi : (cham ? '' : (upd ? e(cu) : '')); }
                    return nhan(t, X.g6(upd ? 'Upd_Person_Address' : 'Ins_Person_Address', {
                        Id: rid, strId: rid, strPerson_Id: pid, strAddress_Type_Code: tid, strAddress_Status_Code: '', strCountry_Id: '',
                        strProvince_Id: giu(c.tinh, old && old.PROVINCE_ID, c.daCham), strDistrict_Id: giu(c.huyen, old && old.DISTRICT_ID, c.daCham),
                        strWard_Id: giu(c.xa, old && old.WARD_ID, c.daCham), strAddress_Line1: giu(c.line, old && old.ADDRESS_LINE1, c.chamLine),
                        strAddress_Line2: '', strFull_Address: giu(c.full, old && old.FULL_ADDRESS, c.daCham || c.chamLine), strPostal_Code: '',
                        dIs_Primary: c.kind === 'hk' ? 1 : 0, dIs_Verified: 0, dIs_Active: 1, strEffective_From: '', strEffective_To: '', strNote: ''
                    }));
                });
            });
            /* Hoá đơn — PERSON_INVOICE_INFO (save_PersonInvoice + các bản vá của inject) */
            var inv = { dt: val('hdDoiTuong'), ten: val('hdTenDonVi') || val('hdNguoiMua'), mst: val('hdMST'), dc: val('hdDiaChi'), em: val('hdEmail'), sdt: val('hdSDT'), qhns: val('hdQHNS') };
            var ivId = e(st.inv && st.inv.ID);
            if (inv.dt || inv.ten || inv.mst || inv.dc || inv.em || inv.sdt || inv.qhns || ivId) calls.push(function () { return luuHoaDon(pid, inv, ivId); });
            return pDC.then(function (dc) { return ui.batch(calls.concat(dc), { title: 'Đang lưu hồ sơ', toast: false }); });
        }
        function luuHoaDon(pid, v, ivId) {
            var upd = ivId.length === 32;
            var p = gop({
                action: NH + (upd ? 'EjQgHhEkMzIuLwgvNy4oIiQILycu' : 'FSkkLB4RJDMyLi8ILzcuKCIkCC8nLgPP'), func: PNH + (upd ? 'Sua_PersonInvoiceInfo' : 'Them_PersonInvoiceInfo'),
                silent: true, strBuyer_Type_Loai: v.dt, strBuyer_Ref_Type: 'CORE_PERSON', strBuyer_Ref_Id: pid, strBuyer_Name: v.ten, strBuyer_Addr: v.dc,
                strBuyer_Tax_Mst: v.mst, strBuyer_Budget_Qhns: v.qhns, strBuyer_Email: v.em, strBuyer_Phone: v.sdt
            }, chung());
            if (upd) p.strId = ivId; else p.strPerson_Id = pid;
            return ums.api.call(p).catch(function (err) {
                // Them_ đòi mã chữ, Sua_ nhận GUID: bị chê ĐÚNG cột BUYER_TYPE_LOAI thì gửi lại MỘT lần bằng kiểu còn lại
                var r = ((st.dm && st.dm.doiTuong) || []).filter(function (x) { return x.ID === v.dt; })[0];
                var khac = r ? (v.dt === r.ID ? e(r.MA || r.TEN).trim() : r.ID) : '';
                if (!/BUYER_TYPE_LOAI/i.test(err.message || '') || !khac || khac === v.dt) throw err;
                return ums.api.call(gop(p, { strBuyer_Type_Loai: khac })).catch(function (err2) {
                    /* Cả hai kiểu đều bị từ chối = máy chủ không biết mục đang chọn ở danh mục Đối tượng xuất hoá đơn —
                       ghi rõ mục nào để người dùng đổi mục khác (chép từ gốc zoneEditModal_inject.js, bản kéo về 27/09/2026) */
                    var ma = r ? e(r.MA || r.TEN).trim() : v.dt;
                    throw new Error('máy chủ không chấp nhận mục "' + ma + '" ở ô Đối tượng xuất hoá đơn (đã thử cả mã chữ lẫn mã danh mục).' +
                        ' Vui lòng chọn mục khác — thường chỉ CA_NHAN và TO_CHUC được chấp nhận.  [' + ((err2.message || '').trim() || 'không kèm lý do') + ']');
                });
            }).catch(function (err) { throw new Error('Thông tin hoá đơn: ' + (err.message || 'máy chủ từ chối')); });
        }

        return {
            mo: function (p) { if (!p || !p.id) { loi('Chưa chọn được hồ sơ.'); return; } mo(p); },
            pid: function () { return st.pid; },
            el: host
        };
    };

    /* =====================================================================
       Màn hai cột: danh sách SV trái + biểu mẫu phải (hoso_danhsach, xemhoso, hoso_capnhat)
       o = { el, title, sideTitle, loc, call(q, v, trang, cỡ), dong(r) }
       ===================================================================== */
    A.manHaiCot = function (o) {
        var m = pat.master({
            el: o.el, title: o.title,
            side: { title: o.sideTitle || 'Danh sách sinh viên', icon: 'fa-address-book', search: 'Nhập từ khóa tìm kiếm', filter: o.loc ? A.locHtml() : '' },
            main: { title: false }
        });
        var edHost = document.createElement('div'), nhac = document.createElement('div');
        m.mainBody.appendChild(nhac); m.mainBody.appendChild(edHost);
        nhac.innerHTML = pat.panel({ title: 'Thông tin hồ sơ', icon: 'fa-circle-info',
            body: ui.empty('Chọn một sinh viên ở danh sách bên trái để xem và cập nhật hồ sơ.', 'fa-hand-pointer') });
        edHost.hidden = true;
        var ed = A.editor(edHost, {
            onDong: function () { ds.boChon(); ui.swap(edHost, nhac); },
            onLuu: function () { /* danh sách trái không đổi theo hồ sơ (gốc không nạp lại) */ }
        });
        var ds = A.dsSV(m, {
            loc: o.loc, call: o.call, dong: o.dong,
            onPick: function (r) { if (edHost.hidden) ui.swap(nhac, edHost); ed.mo(A.nguoi(r)); }
        });
        ds.load(1);
        return { m: m, ed: ed, ds: ds };
    };
    /* SV_HoSo/LayDanhSach (GET) — getList_HSSV của hosodanhsach / xemhoso / hosocapnhat */
    A.callHoSo = function (q, v, trang, co) {
        return { action: 'SV_HoSo/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strTuKhoa: q, strHeDaoTao_Id: v.he, strKhoaDaoTao_Id: v.khoa,
            strChuongTrinh_Id: v.ct, strLopQuanLy_Id: v.lop, strNguoiThucHien_Id: '', pageIndex: trang, pageSize: co };
    };
})();
