/* =========================================================================
   Đề xuất hồ sơ (Hồ sơ đề xuất — CORE_PERSON)
   Bản gốc: ApisNhanSu/Modules/kehoach/html/dexuathoso.html + script/dexuathoso.js (vỏ index, 5.276 dòng).
   (html/dexuathoso.js và kehoach/dexuathoso.html + .js ở gốc module là bản chép cũ lạc chỗ — html đang dùng
   nạp modules/kehoach/script/dexuathoso.js — không chuyển.)
   ---------------------------------------------------------------------------
   Bố cục gốc: MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau          thanh lọc (từ khoá · giới tính · Tìm kiếm · Xuất báo cáo) + "Danh sách hồ sơ đề xuất"
                            (Xóa · Thùng rác · Nhập hồ sơ đề xuất · Kiểm tra định danh)
       #zoneEdit            biểu mẫu hồ sơ (8 | 4: ô nhập | ảnh) + hai bảng "Thông tin định danh" | "Thông tin liên hệ"
       #zoneKiemTraDinhDanh kiểm tra một số định danh đã có trong hệ thống chưa
       #zoneChiTietHoSo     7 tab (địa chỉ, gia đình, tài khoản NH, học vấn, chứng chỉ, tài liệu, học hàm) → _dxhs_chitiet.js
       #zoneThungRac        hồ sơ đã xoá (IS_ACTIVE = 0): khôi phục / xoá vĩnh viễn
   Ở đây: danh sách + biểu mẫu = ums.crud (biểu mẫu thay chỗ danh sách); ba vùng còn lại thay chỗ bằng ui.swap.
   Lời gọi (NS_HoSoNhanSu5_MH · PKG_CORE_HOSONHANSU_05, chép nguyên):
       GetCorePersonByNguoiTaoId          danh sách (IS_ACTIVE = 1) và thùng rác (IS_ACTIVE = 0); lọc từ khoá / giới
                                          tính ngay trên máy (như gốc: FULL_NAME, DATE_OF_BIRTH, CURRENT_EMPLOYEE_CODE)
       InsertCorePerson / UpdateCorePerson  strId · strFullName · strLastName · strMiddleName · strFirstName ·
            strDateOfBirth (ngày/tháng/năm) · strDobPrecisionLevel · dBirthDay · dBirthMonth · dBirthYear · strGenderId ·
            strProfileStatusId '' · strPortraitFileId (ảnh — uploadAvatar)
       DeleteCorePerson strId (xoá mềm) · DeleteCorePerson strId + bPermanent true (xoá vĩnh viễn) ·
       UpdateCorePerson strId + dIs_Active 1 (khôi phục)
       LayDSLoaiDinhDanhBatBuoc · LayDSLoaiLienHeBatBuoc (dòng của hai bảng) ·
       GetPersonIdentifierByPerson_Id / GetPersonContactByPerson_Id (đổ khi Sửa, khớp IDENTIFIER_TYPE_CODE /
       CONTACT_TYPE_CODE_ID = ID loại) · KiemTraThongTinDinhDanh / KiemTraThongTinLienHe (trước khi lưu, loại chưa có
       bản ghi) · InsertPersonIdentifier|UpdatePersonIdentifier · InsertPersonContact|UpdatePersonContact
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_DeXuatHoSo", không có vùng Import):
            dHieuLuc (ô dropSearch_HieuLuc KHÔNG có trên trang → '') · mỗi hồ sơ đánh dấu một strDiem_DeXuatHoSoCongNhan_Id.
       Danh mục: CORE_PERSON.GENDER_ID, CORE_PERSON.DOB_PRECISION_LEVEL, PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE.
   Luồng Lưu (giữ như gốc): kiểm tra từng loại định danh / liên hệ CHƯA có bản ghi — trùng thì báo "Dữ liệu tồn
   tại: <loại>" và dừng; không có loại nào thì hỏi "Chưa có thông tin định danh…"; lưu người rồi lưu MỌI dòng định
   danh / liên hệ (kể cả dòng trống — như gốc); lưu xong Ở LẠI biểu mẫu (như gốc), danh sách nạp lại phía sau.
   Khác gốc (lỗi rõ):
     · Sửa: gốc đọc biến strChinhXac_Id chưa khai → lỗi JS cuối trình xử lý, ô ngày/tháng/năm không ẩn/hiện theo
       mức độ → nay ẩn/hiện đúng theo mức độ đang lưu.
     · Lưu xong gốc KHÔNG ghi nhận id các dòng định danh / liên hệ vừa thêm → bấm Lưu lần hai là thêm TRÙNG; nay
       nạp lại id sau khi lưu (lần sau gọi Update…).
     · Kiểm tra định danh: gốc chỉ chặn khi THIẾU CẢ HAI ô (&&) mà câu báo "cần điền đủ" → chặn khi thiếu một ô.
     · Nút xoá từng dòng / Xoá vĩnh viễn / Khôi phục: gốc gắn $("#btnYes").click mỗi lần mở hộp (bấm lần 3 là xoá 3
       lần) → một hộp hỏi mỗi lần.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.nsDxhs;
    var root = document.getElementById('ns-dexuathoso');
    if (!root) return;

    root.innerHTML = '<div data-z="ds"></div><div data-z="kt" hidden></div><div data-z="ct" hidden></div><div data-z="tr" hidden></div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var zDs = z('ds'), dangMo = null;
    function mo(k) { dangMo = z(k); ui.swap(zDs, dangMo); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; ds.load(); }

    /* Hai bảng loại định danh / liên hệ bắt buộc — nạp một lần */
    var pLoai = Promise.all([
        ums.api.call(X.g5('LayDSLoaiDinhDanhBatBuoc', { silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; }),
        ums.api.call(X.g5('LayDSLoaiLienHeBatBuoc', { silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; })
    ]);
    var pMucDo = X.dmRows('CORE_PERSON.DOB_PRECISION_LEVEL');

    var tatCa = [];       // hồ sơ còn hiệu lực (IS_ACTIVE = 1) — lọc từ khoá / giới tính trên máy
    function loc(rows) {
        var f = ds ? ds.filterValues() : {};
        var q = String(f.q || '').toLowerCase().trim();
        return rows.filter(function (r) {
            if (q && [r.FULL_NAME, r.DATE_OF_BIRTH, r.CURRENT_EMPLOYEE_CODE].every(function (x) { return String(x || '').toLowerCase().indexOf(q) < 0; })) return false;
            if (f.gt && r.GENDER_ID != f.gt) return false;
            return true;
        });
    }
    function demRac(n) {
        var b = zDs.querySelector('[data-c="' + ds.uid + ':tool0"] span');
        if (b) b.textContent = n > 0 ? 'Thùng rác (' + n + ')' : 'Thùng rác';
    }

    var ds = ums.crud({
        root: zDs, title: 'Đề xuất hồ sơ', listTitle: 'Danh sách hồ sơ đề xuất', formTitle: 'hồ sơ đề xuất', icon: 'fa-list-timeline',
        addText: 'Nhập hồ sơ đề xuất', formCols: 12, formDelete: false,   // gốc: Xóa ở dòng + ô đánh dấu, biểu mẫu chỉ Đóng / Lưu
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm (mã, họ tên, ngày sinh...)' },
            { key: 'gt', type: 'select', label: '-- Tất cả giới tính --', source: { dm: 'CORE_PERSON.GENDER_ID' } }
        ],
        toolbar: [
            { text: 'Thùng rác', icon: 'fa-trash-can-undo', mod: 'ghost', onClick: moThungRac },
            { text: 'Kiểm tra định danh', icon: 'fa-id-card-clip', mod: 'out-primary', onClick: function () { mo('kt'); } }
        ],
        list: {
            call: function () { return X.g5('GetCorePersonByNguoiTaoId'); },
            rows: function (d) {
                var all = X.arr(d);
                demRac(all.filter(function (r) { return r.IS_ACTIVE == 0; }).length);
                tatCa = all.filter(function (r) { return r.IS_ACTIVE == 1; });
                return loc(tatCa);
            }
        },
        columns: [
            { title: 'Mã chính thức', prop: 'CURRENT_EMPLOYEE_CODE', cls: 'is-center is-nowrap' },
            { title: 'Họ và tên', prop: 'FULL_NAME', cls: 'is-nowrap' },
            { title: 'Ngày sinh', prop: 'DATE_OF_BIRTH', cls: 'is-center' },
            { title: 'Giới tính', prop: 'GENDER_NAME', cls: 'is-center' },
            { title: 'Tình trạng hồ sơ', prop: 'PROFILE_STATUS_NAME', cls: 'is-center' },
            { title: 'Hoàn thiện hồ sơ', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('view', { text: 'Xem chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-x': 'ct', 'data-id': r.ID } });
            } },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.IS_ACTIVE == 1 ? ui.badge('Có hiệu lực', 'ok') : ui.badge('Không hiệu lực', 'mute'); } },
            { title: 'Ngày tạo', prop: 'CREATED_AT_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'CREATED_BY_TAIKHOAN', cls: 'is-center' }
        ],
        fields: [
            /* Bố cục (người dùng 2026-09-29): Họ / Tên đệm / Tên MỘT hàng; Ngày / Tháng / Năm / Giới tính MỘT hàng — mức độ ngày sinh
               ẩn bớt ô nào thì các ô còn lại tự chia đều cho hết hàng (chiaHangNgay). Ảnh đứng cột phải, cao ba hàng. */
            { key: 'strLastName', col: 'LAST_NAME', label: 'Họ', cols: 3 },
            { key: 'strMiddleName', col: 'MIDDLE_NAME', label: 'Tên đệm', cols: 2 },
            { key: 'strFirstName', col: 'FIRST_NAME', label: 'Tên', cols: 3 },
            { key: 'strPortraitFileId', col: 'PORTRAIT_FILE_ID', label: 'Ảnh', type: 'avatar', cols: 4 },
            { key: 'strFullName', col: 'FULL_NAME', label: 'Tên đầy đủ', cols: 4 },
            { key: 'strDobPrecisionLevel', col: 'DOB_PRECISION_LEVEL', label: 'Chọn mức độ ngày sinh', type: 'select', cols: 4, source: { dm: 'CORE_PERSON.DOB_PRECISION_LEVEL' } },
            { key: 'dBirthDay', col: 'BIRTH_DAY', label: 'Ngày sinh', cols: 2 },
            { key: 'dBirthMonth', col: 'BIRTH_MONTH', label: 'Tháng sinh', cols: 2 },
            { key: 'dBirthYear', col: 'BIRTH_YEAR', label: 'Năm sinh', cols: 2 },
            { key: 'strGenderId', col: 'GENDER_ID', label: 'Giới tính', type: 'select', cols: 2, source: { dm: 'CORE_PERSON.GENDER_ID' } }
        ],
        onForm: veBieuMau,
        save: function (v, row, c) { luu(v, row, c); return null; },
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) { return ids.map(function (id) { return X.g5('DeleteCorePerson', { strId: id }); }); }
    });

    /* Lọc tại chỗ khi gõ (gốc: txtSearch 'input' → genTable) */
    var oQ = zDs.querySelector('[data-cf="' + ds.uid + '"][data-scope="filter"][data-k="q"]');
    if (oQ) oQ.addEventListener('input', function () { ds.rows = loc(tatCa); ds.total = ds.rows.length; ds.page = 1; ds.selected = {}; ds.draw(); });

    /* Báo cáo theo mẫu phân quyền — đầu trang, trước các nút */
    var act = ds.z('actions');
    if (act && ums.report && ums.report.mount) {
        var slot = document.createElement('span');
        act.insertBefore(slot, act.firstChild);
        ums.report.mount(slot, {
            import: false,
            collect: function (add) {
                add('dHieuLuc', '');
                ds.pickedRows().forEach(function (r) { add('strDiem_DeXuatHoSoCongNhan_Id', r.ID); });
            }
        });
    }

    zDs.addEventListener('click', function (e) {
        var b = e.target.closest('[data-x="ct"]');
        if (!b || !zDs.contains(b)) return;
        var r = tatCa.filter(function (x) { return x.ID === b.getAttribute('data-id'); })[0];
        if (!r) return;
        mo('ct');
        X.chiTiet(z('ct'), r, dong);
    });

    /* ---------- Biểu mẫu hồ sơ ------------------------------------------------ */
    function fo(k) { return ds.root.querySelector('[data-cf="' + ds.uid + '"][data-scope="form"][data-k="' + k + '"]'); }
    var ganMot = false;
    function hoTen() { fo('strFullName').value = [fo('strLastName').value, fo('strMiddleName').value, fo('strFirstName').value].join(' ').replace(/\s+/g, ' ').trim(); }
    /* Hàng Ngày / Tháng / Năm / Giới tính rộng 8 phần (cạnh ô ảnh): ô nào đang ẩn thì các ô còn lại chia nhau cho hết hàng.
       Màn hẹp lưới về một cột (grid.css đặt !important) nên độ rộng đặt ở đây không ảnh hưởng. */
    function chiaHangNgay() {
        var o = ['dBirthDay', 'dBirthMonth', 'dBirthYear', 'strGenderId'].map(function (k) { var f = fo(k) && fo(k).closest('.ums-field'); return f && f.parentElement; })
            .filter(function (c) { return c && !c.hidden; });
        var chia = { 1: [8], 2: [4, 4], 3: [3, 3, 2], 4: [2, 2, 2, 2] }[o.length] || [];
        o.forEach(function (c, i) { c.style.gridColumn = 'span ' + chia[i]; });
    }
    function hienNgay() {
        pMucDo.then(function (md) {
            var r = md.filter(function (x) { return x.ID === fo('strDobPrecisionLevel').value; })[0], ma = r ? String(r.MA || '').trim() : '';
            var an = { EXACT: [0, 0, 0], MONTH_ONLY: [1, 0, 0], YEAR_ONLY: [1, 1, 0], UNKNOWN: [1, 1, 1] }[ma];
            if (!an) { chiaHangNgay(); return; }          // mức độ lạ / chưa chọn: giữ nguyên như gốc (switch không có default)
            ['dBirthDay', 'dBirthMonth', 'dBirthYear'].forEach(function (k, i) { X.an(fo(k), an[i]); });
            chiaHangNgay();
        });
    }

    function veBieuMau(row, c, extra) {
        var du = fo('strFullName');
        du.readOnly = true;
        hoTen();
        if (!ganMot) {
            ganMot = true;
            ['strLastName', 'strMiddleName', 'strFirstName'].forEach(function (k) { fo(k).addEventListener('input', hoTen); });
            if (window.jQuery) jQuery(fo('strDobPrecisionLevel')).on('change', hienNgay);
        }
        if (!row) {
            // Thêm mới: mức độ mặc định "EXACT" (btnAdd_DeXuatHoSo)
            pMucDo.then(function (md) {
                var r = md.filter(function (x) { return String(x.MA || '').trim() === 'EXACT'; })[0];
                if (r) { fo('strDobPrecisionLevel').value = r.ID; jQuery(fo('strDobPrecisionLevel')).trigger('change.select2'); }
                hienNgay();
            });
        } else hienNgay();

        extra.innerHTML = '<div class="ums-grid ums-grid--2 ums-cols">' +
            pat.panel({ title: 'Thông tin định danh', icon: 'fa-id-card', flush: true, zone: 'dd' }) +
            pat.panel({ title: 'Thông tin liên hệ', icon: 'fa-address-book', flush: true, zone: 'lh' }) + '</div>';
        c._dd = {}; c._lh = {};
        pLoai.then(function (x) {
            veBang(extra, x[0], x[1]);
            if (row) napDaLuu(c, extra, row.ID);
        });
    }

    function veBang(extra, dd, lh) {
        function o(attr, id, f, date) { return '<input class="ums-input" ' + attr + '="' + esc(id) + '" data-f="' + f + '"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + ' autocomplete="off">'; }
        function chinh(attr, id) { return '<input type="checkbox" ' + attr + '="' + esc(id) + '" data-f="chinh">'; }
        ui.table({ el: extra.querySelector('[data-z="dd"]'), rows: dd, empty: 'Không có loại định danh bắt buộc', columns: [
            { title: 'Loại định danh', prop: 'TEN' },
            { title: 'Số định danh', render: function (r) { return o('data-dd', r.ID, 'so'); } },
            { title: 'Ngày cấp', width: '140px', render: function (r) { return o('data-dd', r.ID, 'ngay', true); } },
            { title: 'Nơi cấp', render: function (r) { return o('data-dd', r.ID, 'noi'); } },
            { title: 'Là thông tin chính', cls: 'is-center', width: '90px', render: function (r) { return chinh('data-dd', r.ID); } }
        ] });
        ui.table({ el: extra.querySelector('[data-z="lh"]'), rows: lh, empty: 'Không có loại liên hệ bắt buộc', columns: [
            { title: 'Loại liên hệ', prop: 'TEN' },
            { title: 'Thông tin', render: function (r) { return o('data-lh', r.ID, 'gt'); } },
            { title: 'Là thông tin chính', cls: 'is-center', width: '90px', render: function (r) { return chinh('data-lh', r.ID); } }
        ] });
        ui.enhance(extra);
    }
    function oBang(extra, attr, id, f) { return extra.querySelector('[' + attr + '="' + id + '"][data-f="' + f + '"]'); }

    /* Đổ định danh / liên hệ đã lưu (genTable_DinhDanh / genTable_LienHe — chỉ nhận mã loại dài 32) */
    function napDaLuu(c, extra, pid) {
        return Promise.all([
            ums.api.call(X.g5('GetPersonIdentifierByPerson_Id', { strPerson_Id: pid, silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; }),
            ums.api.call(X.g5('GetPersonContactByPerson_Id', { strPerson_Id: pid, silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; })
        ]).then(function (x) {
            x[0].forEach(function (d) {
                var t = String(d.IDENTIFIER_TYPE_CODE || '');
                if (t.length !== 32 || !oBang(extra, 'data-dd', t, 'so')) return;
                c._dd[t] = d.ID;
                oBang(extra, 'data-dd', t, 'so').value = d.IDENTIFIER_NO || '';
                var ng = oBang(extra, 'data-dd', t, 'ngay');
                ng.value = d.ISSUE_DATE || '';
                if (ng._flatpickr) ng._flatpickr.setDate(ng.value || null, false, 'd/m/Y');
                oBang(extra, 'data-dd', t, 'noi').value = d.ISSUE_PLACE || '';
                if (X.co(d.IS_PRIMARY)) oBang(extra, 'data-dd', t, 'chinh').checked = true;
            });
            x[1].forEach(function (d) {
                var t = String(d.CONTACT_TYPE_CODE_ID || '');
                if (t.length !== 32 || !oBang(extra, 'data-lh', t, 'gt')) return;
                c._lh[t] = d.ID;
                oBang(extra, 'data-lh', t, 'gt').value = d.CONTACT_VALUE || '';
                if (X.co(d.IS_PRIMARY)) oBang(extra, 'data-lh', t, 'chinh').checked = true;
            });
        });
    }

    /* ---------- Lưu ------------------------------------------------------------ */
    function luu(v, row, c) {
        var extra = c.z('extra');
        Promise.all([pLoai, pMucDo]).then(function (kq) {
            var x = kq[0], dd = x[0], lh = x[1];
            /* Ngày sinh kiểm TRƯỚC KHI GỬI (2026-09-30): gốc ghép thẳng ba ô, hồ sơ chưa có ngày sinh thành "//" → UpdateCorePerson
               trả ORA-20001. Nay: sai thì báo tại chỗ, không gửi; đủ ngày-tháng-năm mới gửi dd/mm/yyyy, còn lại gửi rỗng. */
            var r = kq[1].filter(function (m) { return m.ID === v.strDobPrecisionLevel; })[0];
            var ns = ums.util.ngaySinh(v.dBirthDay, v.dBirthMonth, v.dBirthYear, r ? r.MA : '');
            if (ns.loi) { ui.toast('Kiểm tra lại: ' + ns.loi, 'warn'); return; }
            v._ns = ns;
            // Định danh / liên hệ ĐÃ lưu mà nay để trống: máy chủ không nhận giá trị rỗng → báo tại màn, không gửi
            var trong = dd.filter(function (t) { return c._dd[t.ID] && !oBang(extra, 'data-dd', t.ID, 'so').value.trim(); })
                .concat(lh.filter(function (t) { return c._lh[t.ID] && !oBang(extra, 'data-lh', t.ID, 'gt').value.trim(); }));
            if (trong.length) { ui.toast('Kiểm tra lại: ' + trong.map(function (t) { return t.TEN; }).join(', ') + ' đã lưu trước đó, không được để trống', 'warn'); return; }
            if (!dd.length && !lh.length) {
                return ui.confirm('Chưa có thông tin định danh. Bạn có muốn lưu không?').then(function (yes) { if (yes) luuNguoi(v, row, c, extra, dd, lh); });
            }
            // Kiểm tra trùng — chỉ loại CHƯA có bản ghi (gốc: attr name dài 32 thì bỏ qua)
            var kt = [];
            dd.forEach(function (t) {
                if (c._dd[t.ID]) return;
                kt.push({ ten: t.TEN, call: X.g5('KiemTraThongTinDinhDanh', { strIdentifier_Type_Code: t.ID, strIdentifier_No: oBang(extra, 'data-dd', t.ID, 'so').value.trim(), silent: true }) });
            });
            lh.forEach(function (t) {
                if (c._lh[t.ID]) return;
                kt.push({ ten: t.TEN, call: X.g5('KiemTraThongTinLienHe', { strContactTypeCode: t.ID, strContactValue: oBang(extra, 'data-lh', t.ID, 'gt').value.trim(), silent: true }) });
            });
            return Promise.all(kt.map(function (k) {
                return ums.api.call(k.call).then(function (r) { return X.arr(r.data).length ? 'Dữ liệu tồn tại: ' + k.ten : ''; },
                    function (err) { return err.message || 'Lỗi kiểm tra ' + k.ten; });
            })).then(function (loi) {
                loi = loi.filter(Boolean);
                if (loi.length) { ui.toast(loi[0], 'warn'); return; }
                luuNguoi(v, row, c, extra, dd, lh);
            });
        });
    }

    function luuNguoi(v, row, c, extra, dd, lh) {
        var o = {
            // strFullName = txtHoVaTen của gốc = Họ + ' ' + Tên đệm + ' ' + Tên
            strId: row ? row.ID : '', strFullName: [v.strLastName, v.strMiddleName, v.strFirstName].join(' ').replace(/\s+/g, ' ').trim(),   // không để hai dấu cách khi thiếu tên đệm
            strLastName: v.strLastName, strMiddleName: v.strMiddleName,
            strFirstName: v.strFirstName, strDateOfBirth: v._ns.chuoi,
            strDobPrecisionLevel: v.strDobPrecisionLevel, dBirthDay: v._ns.ngay, dBirthMonth: v._ns.thang, dBirthYear: v._ns.nam,
            strGenderId: v.strGenderId, strProfileStatusId: '', strPortraitFileId: v.strPortraitFileId
        };
        ums.api.call(X.g5(row ? 'UpdateCorePerson' : 'InsertCorePerson', o)).then(function (r) {
            var pid = row ? row.ID : ((r.raw && r.raw.Id) || '');
            var calls = [], thieu = [];
            dd.forEach(function (t) {
                var id = c._dd[t.ID] || '';
                /* Dòng định danh CHƯA nhập số và chưa từng lưu thì KHÔNG gửi (2026-09-30): gốc gửi cả dòng trống → máy chủ trả
                   ORA-01400 IDENTIFIER_NO, trong khi hồ sơ đã lưu xong. Lưu xong màn nhắc các loại còn thiếu. */
                if (!id && !oBang(extra, 'data-dd', t.ID, 'so').value.trim()) { thieu.push(t.TEN); return; }
                calls.push(X.g5(id ? 'UpdatePersonIdentifier' : 'InsertPersonIdentifier', {
                    strId: id, strIdentifierTypeCode: t.ID, strPersonId: pid,
                    strIdentifierNo: oBang(extra, 'data-dd', t.ID, 'so').value.trim(),
                    strIssueDate: oBang(extra, 'data-dd', t.ID, 'ngay').value.trim(),
                    strIssuePlace: oBang(extra, 'data-dd', t.ID, 'noi').value.trim(),
                    dIsPrimary: oBang(extra, 'data-dd', t.ID, 'chinh').checked ? 1 : 0, strEffectiveFrom: '', strEffectiveTo: ''
                }));
            });
            lh.forEach(function (t) {
                var id = c._lh[t.ID] || '';
                if (!id && !oBang(extra, 'data-lh', t.ID, 'gt').value.trim()) { thieu.push(t.TEN); return; }
                calls.push(X.g5(id ? 'UpdatePersonContact' : 'InsertPersonContact', {
                    strId: id, strPersonId: pid, strContactTypeCode: t.ID,
                    strContactValue: oBang(extra, 'data-lh', t.ID, 'gt').value.trim(),
                    dIsPrimary: oBang(extra, 'data-lh', t.ID, 'chinh').checked ? 1 : 0, strEffectiveFrom: '', strEffectiveTo: ''
                }));
            });
            return (calls.length ? ui.batch(calls, { title: 'Đang lưu thông tin định danh / liên hệ' }) : Promise.resolve({ fail: 0, errors: [] })).then(function (kq) {
                if (kq.fail) ui.toast(kq.errors[0] || 'Có dòng định danh / liên hệ lưu lỗi', 'bad');
                else if (thieu.length) ui.toast('Đã lưu hồ sơ. Chưa nhập: ' + thieu.join(', ') + ' — bổ sung rồi bấm Lưu lại.', 'warn');
                else ui.toast('Lưu thành công', 'ok');
                // Ở lại biểu mẫu như gốc; lần Lưu sau là SỬA người vừa lưu
                c.editing = Object.assign({}, row || {}, { ID: pid });
                var t = c.z('ftitle'); if (t) t.textContent = 'Sửa hồ sơ đề xuất';
                c._dd = {}; c._lh = {};
                if (pid) napDaLuu(c, extra, pid);
                ds.load();
            });
        }).catch(function (err) { ums.api.handle(err, 'lưu hồ sơ đề xuất'); ds.load(); });
    }

    /* ---------- Kiểm tra định danh -------------------------------------------- */
    var zKt = z('kt');
    zKt.innerHTML =
        pat.panel({ title: 'Kiểm tra định danh', icon: 'fa-id-card-clip', tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="loai" data-ph="Chọn loại định danh"><option value=""></option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="so" placeholder="Nhập số định danh" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Kiểm tra', attr: { 'data-a': 'kt' } }) + '</div></div>' }) +
        pat.panel({ title: 'Kết quả kiểm tra', icon: 'fa-list-check', flush: true, zone: 'kq',
            body: ui.empty('Chọn loại định danh, nhập số định danh rồi bấm "Kiểm tra"', 'fa-hand-pointer') });
    ui.enhance(zKt);
    var ktLoai = zKt.querySelector('[data-f="loai"]'), ktSo = zKt.querySelector('[data-f="so"]'), ktKq = zKt.querySelector('[data-z="kq"]');
    X.dmRows('PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE').then(function (r) { pat.fill(ktLoai, r); });
    function kiemTra() {
        if (!ktLoai.value || !ktSo.value.trim()) { ui.toast('Bạn cần điền đủ thông tin', 'warn'); return; }
        ktKq.innerHTML = ui.empty('Đang kiểm tra…', 'fa-spinner fa-spin');
        var tenLoai = txtChon(ktLoai), so = ktSo.value.trim();
        ums.api.call(X.g5('KiemTraThongTinDinhDanh', { strIdentifier_Type_Code: ktLoai.value, strIdentifier_No: so })).then(function (r) {
            var d = X.arr(r.data);
            ktKq.innerHTML = '<div class="nsdx-kq">' + (d.length
                ? ui.badge('Tồn tại nhân sự có thông tin định danh ' + tenLoai + ' dữ liệu ' + so, 'warn')
                : ui.badge('Định danh ' + tenLoai + ' dữ liệu ' + so + ' → Không tồn tại trong hệ thống và chưa được sử dụng', 'ok')) + '</div><div data-z="bang"></div>';
            ui.table({ el: ktKq.querySelector('[data-z="bang"]'), rows: d, empty: 'Không có dữ liệu', columns: [
                { title: 'Loại định danh', prop: 'IDENTIFIER_TYPE_CODE_NAME' }, { title: 'Số định danh', prop: 'IDENTIFIER_NO' },
                { title: 'Ngày cấp', prop: 'ISSUE_DATE', cls: 'is-center' }, { title: 'Nơi cấp', prop: 'ISSUE_PLACE' },
                { title: 'Họ tên', prop: 'FULL_NAME' }, { title: 'Ghi chú', prop: 'NOTE' }
            ] });
        }).catch(function (err) { ktKq.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kiểm tra định danh'); });
    }
    function txtChon(el) { return el.value && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : ''; }
    zKt.addEventListener('click', function (e) {
        if (e.target.closest('[data-a="dong"]')) dong();
        else if (e.target.closest('[data-a="kt"]')) kiemTra();
    });
    ktSo.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); kiemTra(); } });

    /* ---------- Thùng rác ----------------------------------------------------- */
    var zTr = z('tr');
    zTr.innerHTML = pat.panel({ title: 'Thùng rác', icon: 'fa-trash-can-undo', count: 'n', flush: true, zone: 'bang',
        tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
            ui.btn('reload', { text: 'Khôi phục', mod: 'out-primary', icon: 'fa-trash-can-undo', attr: { 'data-a': 'kp' } }) +
            ui.xoaChon('input[data-tr]', { goc: '.ums-panel', text: 'Xóa vĩnh viễn', attr: { 'data-a': 'xvv' } }) });
    var rac = [];
    function moThungRac() { mo('tr'); napThungRac(); }
    function napThungRac() {
        var host = zTr.querySelector('[data-z="bang"]');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(X.g5('GetCorePersonByNguoiTaoId')).then(function (r) {
            rac = X.arr(r.data).filter(function (x) { return x.IS_ACTIVE == 0; });
            zTr.querySelector('[data-z="n"]').textContent = '(' + rac.length + ')';
            ui.table({ el: host, rows: rac, empty: 'Thùng rác trống', columns: [
                { title: 'Họ và tên', prop: 'FULL_NAME' },
                { title: 'Ngày sinh', prop: 'DATE_OF_BIRTH', cls: 'is-center' },
                { title: 'Giới tính', prop: 'GENDER_NAME', cls: 'is-center' },
                { title: 'Ngày xóa', cls: 'is-center', render: function (x) { return esc(x.UPDATED_AT_DD_MM_YYYY_HHMMSS || x.CREATED_AT_DD_MM_YYYY_HHMMSS || ''); } },
                { title: 'Người xóa', cls: 'is-center', render: function (x) { return esc(x.UPDATED_BY_TAIKHOAN || x.CREATED_BY_TAIKHOAN || ''); } },
                { title: 'Xóa', cls: 'is-actions', width: '64px', render: function (x) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xvv="' + esc(x.ID) + '" title="Xóa vĩnh viễn"><i class="fa-light fa-trash-can"></i></button>';
                } },
                { head: '<input type="checkbox" data-tr-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (x) { return '<input type="checkbox" data-tr="' + esc(x.ID) + '">'; } }
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thùng rác'); });
    }
    function chonRac() { return Array.prototype.filter.call(zTr.querySelectorAll('input[data-tr]'), function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-tr'); }); }
    function chay(ids, cau, tao, xong) {
        ui.confirm(cau, { tone: 'bad', ok: 'Đồng ý' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(tao), { title: 'Đang thực hiện' }).then(function (kq) {
                if (kq.ok) ui.toast(xong, 'ok');
                if (kq.fail) ui.toast(kq.errors[0] || 'Có lỗi', 'bad');
                napThungRac();
                ds.load();
            });
        });
    }
    function xoaVV(ids) {
        chay(ids, 'Bạn có chắc chắn xóa vĩnh viễn? Dữ liệu sẽ không thể khôi phục!',
            function (id) { return X.g5('DeleteCorePerson', { strId: id, bPermanent: true }); }, 'Xóa vĩnh viễn thành công!');
    }
    zTr.addEventListener('click', function (e) {
        var t = e.target;
        if (t.closest('[data-a="dong"]')) return dong();
        if (t.matches('[data-tr-all]')) {
            Array.prototype.forEach.call(zTr.querySelectorAll('input[data-tr]'), function (x) { x.checked = t.checked; });
            return;
        }
        var b = t.closest('[data-xvv]');
        if (b) return xoaVV([b.getAttribute('data-xvv')]);
        if (t.closest('[data-a="xvv"]')) { var ids = chonRac(); if (ids.length) xoaVV(ids); return; }
        if (t.closest('[data-a="kp"]')) {
            var kp = chonRac();
            if (!kp.length) { ui.toast('Vui lòng chọn đối tượng cần khôi phục!', 'warn'); return; }
            chay(kp, 'Bạn có chắc chắn khôi phục dữ liệu không?',
                function (id) { return X.g5('UpdateCorePerson', { strId: id, dIs_Active: 1 }); }, 'Khôi phục thành công!');
        }
    });
})();
