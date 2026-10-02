/* =========================================================================
   kehoach/dexuathoso — vùng "Chi tiết hồ sơ" (zoneChiTietHoSo của gốc): 7 tab, mỗi tab một danh sách
   + biểu mẫu thay chỗ (zoneForm* của gốc) → ums.pat.sections (mỗi khung là ums.crud).
       ums.nsDxhs.chiTiet(host, người, onClose)
   Lời gọi (NS_HoSoNhanSu6_MH · PKG_CORE_HOSONHANSU_06, chép nguyên; mọi lời gọi kèm strVaiTro_Id ''):
       Get_Person_<X> (strPerson_Id) · Ins_Person_<X> · Upd_Person_<X> (+ strId) · Del_Person_<X> (strId)
       X = Address · Family · Bank_Account · Education · Certificate · Document · Academic_Rank
       Get_Person_Document_By_Id / Get_Person_Academic_Rank_By_Id: nạp chi tiết trước khi Sửa (như gốc);
       Get_Person_Certificate_By_Id / _Document_By_Id / _Academic_Rank_By_Id / _Education_By_Id: hộp "Chi tiết".
       Tỉnh / Phường: CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM GET CHUN.DMTT2 (cha–con QUANHECHA_ID).
       Chi nhánh theo ngân hàng: CMS_DanhMuc_MH · pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc (strQUANHECHA_Id =
       ngân hàng, strCHUNG_TENDANHMUC_Id 'PERSON_BANK_ACCOUNT.BRANCH_ID', 1, 100000); rỗng → cả danh mục.
   Lọc danh sách như gốc: đúng PERSON_ID và IS_ACTIVE (không có cột hoặc = 1); tab Tài liệu chỉ lọc PERSON_ID.
   Khác gốc:
     · Ngày: gốc dùng ô type=date (gửi yyyy-mm-dd) ở 6 tab, riêng Học vấn đổi sang dd/mm/yyyy ("Oracle parse
       DD/MM/YYYY"). Bản mới gửi dd/mm/yyyy ở MỌI tab (ô ngày chung). Đổ ngày đọc được mọi dạng.
     · Nút "Chi tiết" ở Học vấn / Chứng chỉ / Tài liệu / Học hàm: gốc có hàm show_ChiTiet* mà KHÔNG gắn vào nút
       → nút chết; nay mở hộp chi tiết (By_Id, rỗng/DUMMY thì dùng dòng đang có).
     · Tệp đính kèm (Chứng chỉ, Tài liệu): gốc đọc giá trị ô <input type=file> ("C:\fakepath\…") gửi vào
       strFile_Id — chưa có luồng tải tệp thật. Bản mới KHÔNG gửi đường dẫn giả: giữ FILE_ID đang có (thêm mới: rỗng).
   Nối tầng: Tỉnh → Phường (khoá), Ngân hàng → Chi nhánh (khoá) — ums.pat.chain.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.nsDxhs;

    function s(k, col, label, o) { return gop({ key: k, col: col, label: label }, o); }
    function gop(a, b) { Object.keys(b || {}).forEach(function (k) { a[k] = b[k]; }); return a; }
    function dm(k, col, label, ma, o) { return gop({ key: k, col: col, label: label, type: 'select', source: { dm: ma } }, o); }
    function ng(k, col, label, o) { return gop({ key: k, get: function (r) { return X.ngay(r[col]); }, label: label, type: 'date' }, o); }
    function lg(t) { return { type: 'legend', label: t }; }
    function ck(k, col, label, o) { return gop({ key: k, col: col, label: label, on: 1, off: 0 }, o); }
    function tick(v) { return X.co(v) ? '<i class="fa-light fa-check nsdx-tick"></i>' : ''; }
    function hl(r) { return X.co(r.IS_ACTIVE) ? ui.badge('Có hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute'); }
    function fo(c, k) { return c.root.querySelector('[data-cf="' + c.uid + '"][data-scope="form"][data-k="' + k + '"]'); }
    function txt(el) { return el && el.value && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : ''; }
    function dat(el, v) { if (el) el.value = v == null ? '' : v; }
    function jq(el, ev, fn) { if (window.jQuery && el) jQuery(el).on(ev, fn); }

    /* ---------- Tỉnh / Phường theo CHUN.DMTT2 (ensureDMTT2Loaded + heuristic của gốc) -------------------- */
    var dmtt2 = null;
    function napDMTT2() {
        if (dmtt2) return dmtt2;
        dmtt2 = X.dmRows('CHUN.DMTT2').then(function (ds) {
            var co = {}; ds.forEach(function (x) { co[x.ID] = 1; });
            var goc = ds.filter(function (x) { return !x.QUANHECHA_ID || !co[x.QUANHECHA_ID]; });
            function con(id) { return ds.filter(function (x) { return x.QUANHECHA_ID == id; }); }
            function laXa(t) { t = String(t || '').trim().toLowerCase(); return t.indexOf('phường') === 0 || t.indexOf('xã') === 0 || t.indexOf('thị trấn') === 0; }
            function laTinh(t) { t = String(t || '').trim().toLowerCase(); return t.indexOf('tỉnh') === 0 || t.indexOf('thành phố') === 0; }
            var qg = goc.filter(function (x) { var n = String(x.TEN || '').toLowerCase().trim(); return n === 'việt nam' || n === 'viet nam'; })[0];
            var qgId = qg ? qg.ID : null;
            if (!qgId) {
                var best = 0;
                goc.forEach(function (c) {
                    var ch = con(c.ID).slice(0, 30), d = 0;
                    ch.forEach(function (x) { if (laTinh(x.TEN)) d++; if (laXa(x.TEN)) d--; });
                    if (d > best) { best = d; qgId = c.ID; }
                });
            }
            return {
                tinh: qgId ? con(qgId) : goc,
                xa: function (tinhId) {
                    var kq = tinhId ? con(tinhId) : [];
                    if (!kq.length && tinhId) {
                        var n = ds.filter(function (x) { return x.ID == tinhId; })[0], ma = n ? n.MA : null;
                        kq = ds.filter(function (x) {
                            return [x.QUANHECHA_ID, x.THONGTIN1, x.THONGTIN2, x.THONGTIN3, x.THONGTIN4].some(function (v) {
                                return v && (String(v).trim() === String(tinhId) || (ma && String(v).trim() === String(ma)));
                            });
                        });
                    }
                    var chiXa = kq.filter(function (x) { return laXa(x.TEN); });
                    return chiXa.length ? chiXa : kq;
                }
            };
        });
        return dmtt2;
    }

    /* ---------- Danh mục ngành (ensureDmMajor / ensureDmMajorGroupOnly của gốc) -------------------------- */
    var dmNganh = null;
    function napNganh() {
        if (dmNganh) return dmNganh;
        dmNganh = Promise.all([X.dmRows('PERSON_EDUCATION.MAJOR_ID'), X.dmRows('PERSON_EDUCATION.MAJOR_GROUP_ID')]).then(function (x) {
            var tat = x[0], rieng = x[1];
            var goc = tat.filter(function (r) { return !r.QUANHECHA_ID && !r.MAJOR_GROUP_ID; });
            return { tat: tat, nhom: rieng.length ? rieng : goc };
        });
        return dmNganh;
    }
    function tenNhom(n, val) {
        if (!val) return '';
        var f = n.nhom.concat(n.tat).filter(function (x) { return String(x.ID) === String(val) || String(x.MA || '').trim() === String(val); })[0];
        return f ? f.TEN || '' : '';
    }
    function nhomCuaNganh(n, maj) {
        var f = n.tat.filter(function (x) { return String(x.ID) === String(maj) || String(x.MA || '').trim() === String(maj); })[0];
        return f ? String(f.MAJOR_GROUP_ID || f.QUANHECHA_ID || '') : '';
    }
    /* Ngành: ô chọn Ngành của gốc bị ẩn (display:none) — suy strMajor_Id từ Mã / Tên ngành trong nhóm (tryDeriveMajorIdFromInputs) */
    function suyNganh(n, ma, ten, nhom) {
        var ds = n.tat.filter(function (x) {
            if (!x.QUANHECHA_ID && !x.MAJOR_GROUP_ID) return false;
            if (nhom && String(x.QUANHECHA_ID || x.MAJOR_GROUP_ID || '') !== String(nhom)) return false;
            if (ma) return String(x.MA || '').trim() === ma;
            if (ten) return String(x.TEN || '').trim().toLowerCase() === ten.toLowerCase();
            return false;
        });
        return ds.length ? ds[0].ID : '';
    }

    /* ---------- Hộp "Chi tiết" -------------------------------------------------------------------------- */
    function xem(title, icon, byId, row, nhom) {
        var dlg = ui.dialog({ title: title, icon: icon, size: 'lg', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
        var p = byId ? ums.api.call(X.g6(byId, { strId: row.ID, silent: true })).then(function (r) {
            var d = X.arr(r.data)[0];
            return d && !(d.DUMMY && Object.keys(d).length <= 2) ? d : row;   // By_Id trả {DUMMY:'X'} → dùng dòng đang có
        }, function () { return row; }) : Promise.resolve(row);
        p.then(function (d) { dlg.body.innerHTML = X.kv(d, nhom); });
    }

    X.chiTiet = function (host, nguoi, onClose) {
        var pid = nguoi.ID;
        host.innerHTML = pat.page('Chi tiết hồ sơ: ' + (nguoi.FULL_NAME || ''), ui.btn('close', { attr: { 'data-a': 'dong' } })) + '<div data-z="sec"></div>';
        host.onclick = function (e) { if (e.target.closest('[data-a="dong"]')) onClose(); };

        function loc(chiNguoi) {
            return function (d) {
                return X.arr(d).filter(function (r) {
                    return r.PERSON_ID == pid && (chiNguoi || r.IS_ACTIVE === undefined || r.IS_ACTIVE === null || r.IS_ACTIVE == 1);
                });
            };
        }
        function tab(key, text, icon, E, o) {
            var cfg = gop({
                title: o.tieuDe, icon: icon, addText: o.them, formTitle: o.ten, formCols: 12,
                multi: false, formDelete: false,          // gốc: chỉ nút Xóa trên từng dòng
                list: { call: function () { return X.g6('Get_Person_' + E, { strPerson_Id: pid }); }, rows: loc(o.chiNguoi) },
                remove: function (ids) { return ids.map(function (id) { return X.g6('Del_Person_' + E, { strId: id }); }); },
                removeConfirm: function () { return o.hoiXoa; }
            }, o.cfg);
            return { key: key, text: text, icon: icon, sections: [cfg] };
        }
        function luu(E, v, row, them) {
            var o = { strPerson_Id: pid };
            if (row) o.strId = row.ID;
            return X.g6((row ? 'Upd' : 'Ins') + '_Person_' + E, gop(gop(o, v), them));
        }

        ums.pat.sections({ el: host.querySelector('[data-z="sec"]'), tabs: [

            /* ===== Tab 1: Địa chỉ ===== */
            tab('dc', 'Địa chỉ', 'fa-location-dot', 'Address', { tieuDe: 'Thông tin địa chỉ cá nhân', them: 'Thêm địa chỉ', ten: 'địa chỉ',
                hoiXoa: 'Bạn có chắc chắn xóa địa chỉ này không?', cfg: {
                columns: [
                    { title: 'Loại địa chỉ', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['ADDRESS_TYPE_NAME', 'ADDRESS_TYPE_CODE_NAME'])); } },
                    { title: 'Trạng thái', prop: 'ADDRESS_STATUS_CODE_NAME', cls: 'is-center' },
                    { title: 'Quốc gia', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['COUNTRY_NAME', 'COUNTRY_ID_NAME', 'COUNTRY_CODE_NAME'])); } },
                    { title: 'Tỉnh/thành', prop: 'PROVINCE_NAME', cls: 'is-center' },
                    { title: 'Phường/xã', prop: 'WARD_NAME', cls: 'is-center' },
                    { title: 'Địa chỉ chi tiết 1', prop: 'ADDRESS_LINE1' },
                    { title: 'Địa chỉ chi tiết 2', prop: 'ADDRESS_LINE2' },
                    { title: 'Địa chỉ đầy đủ', prop: 'FULL_ADDRESS' },
                    { title: 'Mã bưu chính', prop: 'POSTAL_CODE', cls: 'is-center' },
                    { title: 'Địa chỉ chính', cls: 'is-center', render: function (r) { return tick(r.IS_PRIMARY); } },
                    { title: 'Ngày hiệu lực', prop: 'EFFECTIVE_FROM', cls: 'is-center' },
                    { title: 'Ngày hết hiệu lực', prop: 'EFFECTIVE_TO', cls: 'is-center' },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl },
                    { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    dm('strAddress_Type_Code', '', 'Loại địa chỉ', 'PERSON_ADDRESS.ADDRESS_TYPE_CODE', { required: true, cols: 6,
                        get: function (r) { return X.lay(r, ['ADDRESS_TYPE_CODE', 'ADDRESS_TYPE', 'ADDRESS_TYPE_ID']); } }),
                    dm('strAddress_Status_Code', '', 'Trạng thái', 'PERSON_ADDRESS.ADDRESS_STATUS_CODE', { cols: 6,
                        get: function (r) { return X.lay(r, ['ADDRESS_STATUS_CODE', 'ADDRESS_STATUS', 'ADDRESS_STATUS_ID']); } }),
                    dm('strCountry_Id', '', 'Quốc gia', 'PERSON_ADDRESS.COUNTRY_ID', { cols: 6,
                        get: function (r) { return X.lay(r, ['COUNTRY_ID', 'COUNTRY_CODE', 'COUNTRY', 'COUNTRYID']); } }),
                    s('strProvince_Id', 'PROVINCE_ID', 'Tỉnh/Thành phố', { type: 'select', required: true, cols: 6, placeholder: '-- Chọn tỉnh/thành phố --' }),
                    s('strWard_Id', 'WARD_ID', 'Phường/Xã', { type: 'select', cols: 6, placeholder: '-- Chọn phường/xã --' }),
                    s('strAddress_Line1', 'ADDRESS_LINE1', 'Địa chỉ chi tiết 1', { cols: 6 }),
                    s('strAddress_Line2', 'ADDRESS_LINE2', 'Địa chỉ chi tiết 2', { cols: 6 }),
                    s('strPostal_Code', 'POSTAL_CODE', 'Mã bưu chính', { cols: 6 }),
                    s('strFull_Address', 'FULL_ADDRESS', 'Địa chỉ đầy đủ', { type: 'textarea', span: true }),
                    { type: 'checks', span: true, items: [ck('dIs_Primary', 'IS_PRIMARY', 'Là địa chỉ chính')] },
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                onForm: function (row, c) {
                    var tinh = fo(c, 'strProvince_Id'), xa = fo(c, 'strWard_Id');
                    ['strAddress_Type_Code', 'strAddress_Status_Code', 'strCountry_Id'].forEach(function (k) {
                        var el = fo(c, k); X.chon(el, el.value || (row ? c.cfg.fields.filter(function (f) { return f.key === k; })[0].get(row) : ''));
                    });
                    if (!c._gan) {
                        c._gan = true;
                        var dayDu = function () {
                            var p = [fo(c, 'strAddress_Line1').value, fo(c, 'strAddress_Line2').value, txt(xa), txt(tinh), txt(fo(c, 'strCountry_Id'))]
                                .map(function (x) { return String(x || '').trim(); }).filter(function (x) { return x && x !== '-- Chọn --'; });
                            fo(c, 'strFull_Address').value = p.join(', ');
                        };
                        ['strAddress_Line1', 'strAddress_Line2'].forEach(function (k) { fo(c, k).addEventListener('input', dayDu); });
                        jq(xa, 'select2:select select2:clear', dayDu);
                        jq(fo(c, 'strCountry_Id'), 'select2:select select2:clear', dayDu);
                        jq(tinh, 'select2:select select2:clear', function () {
                            napDMTT2().then(function (d) { pat.fill(xa, tinh.value ? d.xa(tinh.value) : []); dayDu(); });
                        });
                        pat.chain([tinh, xa], { phatLai: false });
                    }
                    napDMTT2().then(function (d) {
                        pat.fill(tinh, d.tinh);
                        dat(tinh, row ? row.PROVINCE_ID : '');
                        pat.fill(xa, tinh.value ? d.xa(tinh.value) : []);
                        dat(xa, row ? row.WARD_ID : '');
                        jQuery(tinh).trigger('change.select2').trigger('ums:refresh');
                        jQuery(xa).trigger('change.select2');
                    });
                },
                save: function (v, row) {
                    // Gốc: Id = strId = id đang sửa, thêm mới thì sinh uuid (viết HOA)
                    var id = String(row ? row.ID : ums.util.uuid()).toUpperCase();
                    return luu('Address', {
                        Id: id, strAddress_Type_Code: v.strAddress_Type_Code, strAddress_Status_Code: v.strAddress_Status_Code,
                        strCountry_Id: v.strCountry_Id, strProvince_Id: v.strProvince_Id, strDistrict_Id: '', strWard_Id: v.strWard_Id,
                        strAddress_Line1: v.strAddress_Line1, strAddress_Line2: v.strAddress_Line2, strFull_Address: v.strFull_Address,
                        strPostal_Code: v.strPostal_Code, dIs_Primary: v.dIs_Primary, dIs_Verified: 0, dIs_Active: 1,
                        strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To, strNote: v.strNote
                    }, row, { strId: id });
                }
            } }),

            /* ===== Tab 2: Gia đình ===== */
            tab('gd', 'Gia đình', 'fa-users', 'Family', { tieuDe: 'Thông tin gia đình', them: 'Thêm thành viên', ten: 'thành viên gia đình',
                hoiXoa: 'Bạn có chắc chắn xóa thành viên gia đình này không?', cfg: {
                columns: [
                    { title: 'Loại quan hệ', prop: 'RELATION_TYPE_CODE_NAME', cls: 'is-center' },
                    { title: 'Trạng thái quan hệ', prop: 'RELATION_STATUS_CODE_NAME', cls: 'is-center' },
                    { title: 'Họ tên đầy đủ', prop: 'FULL_NAME' },
                    { title: 'Họ', prop: 'LAST_NAME' }, { title: 'Tên đệm', prop: 'MIDDLE_NAME' }, { title: 'Tên', prop: 'FIRST_NAME' },
                    { title: 'Giới tính', prop: 'GENDER_NAME', cls: 'is-center' },
                    { title: 'Mức độ chính xác ngày sinh', prop: 'DOB_PRECISION_LEVEL_NAME', cls: 'is-center' },
                    { title: 'Ngày sinh đầy đủ', prop: 'DATE_OF_BIRTH', cls: 'is-center' },
                    { title: 'Ngày sinh', prop: 'BIRTH_DAY', cls: 'is-center' }, { title: 'Tháng sinh', prop: 'BIRTH_MONTH', cls: 'is-center' },
                    { title: 'Năm sinh', prop: 'BIRTH_YEAR', cls: 'is-center' },
                    { title: 'Nghề nghiệp', prop: 'OCCUPATION' },
                    { title: 'Ngày hiệu lực', prop: 'EFFECTIVE_FROM', cls: 'is-center' },
                    { title: 'Ngày hết hiệu lực', prop: 'EFFECTIVE_TO', cls: 'is-center' },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl },
                    { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    dm('strRelation_Type_Code', 'RELATION_TYPE_CODE', 'Loại quan hệ', 'PERSON_FAMILY.RELATION_TYPE_CODE', { required: true, cols: 6 }),
                    dm('strRelation_Status_Code', 'RELATION_STATUS_CODE', 'Trạng thái quan hệ', 'PERSON_FAMILY.RELATION_STATUS_CODE', { cols: 6 }),
                    s('strFull_Name', 'FULL_NAME', 'Họ tên đầy đủ', { span: true, hint: 'Gõ họ tên đầy đủ rồi rời ô (hoặc Enter) để tự tách Họ / Tên đệm / Tên' }),
                    s('strLast_Name', 'LAST_NAME', 'Họ', { required: true, cols: 4 }),
                    s('strMiddle_Name', 'MIDDLE_NAME', 'Tên đệm', { cols: 4 }),
                    s('strFirst_Name', 'FIRST_NAME', 'Tên', { required: true, cols: 4 }),
                    dm('strGender_Id', 'GENDER_ID', 'Giới tính', 'CORE_PERSON.GENDER_ID', { cols: 6 }),
                    dm('strDob_Precision_Level', 'DOB_PRECISION_LEVEL', 'Mức độ chính xác ngày sinh', 'CORE_PERSON.DOB_PRECISION_LEVEL', { cols: 6 }),
                    s('dBirth_Day', 'BIRTH_DAY', 'Ngày sinh', { type: 'number', cols: 4 }),
                    s('dBirth_Month', 'BIRTH_MONTH', 'Tháng sinh', { type: 'number', cols: 4 }),
                    s('dBirth_Year', 'BIRTH_YEAR', 'Năm sinh', { type: 'number', cols: 4 }),
                    s('strOccupation', 'OCCUPATION', 'Nghề nghiệp', { cols: 6 }),
                    s('strWorkplace', 'WORKPLACE', 'Nơi làm việc', { cols: 6 }),
                    s('strPhone_Number', 'PHONE_NUMBER', 'Số điện thoại', { cols: 6 }),
                    s('strEmail', 'EMAIL', 'Email', { cols: 6 }),
                    s('strAddress_Text', 'ADDRESS_TEXT', 'Địa chỉ của thân nhân', { type: 'textarea', span: true }),
                    { type: 'checks', span: true, items: [ck('dIs_Dependent', 'IS_DEPENDENT', 'Người phụ thuộc'),
                        ck('dIs_Emergency_Contact', 'IS_EMERGENCY_CONTACT', 'Người liên hệ khẩn cấp'), ck('dIs_Primary_Contact', 'IS_PRIMARY_CONTACT', 'Quan hệ chính')] },
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                onForm: function (row, c) {
                    var md = fo(c, 'strDob_Precision_Level');
                    // setSelectFlex của gốc: máy chủ có thể trả MA thay cho ID
                    Promise.all([X.dmRows('PERSON_FAMILY.RELATION_TYPE_CODE'), X.dmRows('PERSON_FAMILY.RELATION_STATUS_CODE'), X.dmRows('CORE_PERSON.DOB_PRECISION_LEVEL')])
                        .then(function (x) {
                            if (row) {
                                X.chon(fo(c, 'strRelation_Type_Code'), row.RELATION_TYPE_CODE, x[0]);
                                X.chon(fo(c, 'strRelation_Status_Code'), row.RELATION_STATUS_CODE, x[1]);
                            }
                            c._md = x[2]; hienNgay();
                        });
                    function hienNgay() {
                        var r = (c._md || []).filter(function (x) { return x.ID === md.value; })[0], ma = r ? String(r.MA || '').trim() : '';
                        var an = { EXACT: [0, 0, 0], MONTH_ONLY: [1, 0, 0], YEAR_ONLY: [1, 1, 0], UNKNOWN: [1, 1, 1] }[ma] || [0, 0, 0];
                        ['dBirth_Day', 'dBirth_Month', 'dBirth_Year'].forEach(function (k, i) { X.an(fo(c, k), an[i]); });
                    }
                    if (c._gan) return;
                    c._gan = true;
                    jq(md, 'change', hienNgay);
                    var ho = fo(c, 'strLast_Name'), dem = fo(c, 'strMiddle_Name'), ten = fo(c, 'strFirst_Name'), du = fo(c, 'strFull_Name');
                    var dongBo = false;
                    [ho, dem, ten].forEach(function (el) {
                        el.addEventListener('input', function () {
                            if (!dongBo) du.value = (ho.value + ' ' + dem.value + ' ' + ten.value).replace(/\s+/g, ' ').trim();
                        });
                    });
                    function tach() {
                        var p = du.value.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
                        if (p.length < 2) return;
                        dongBo = true;
                        ho.value = p[0]; ten.value = p[p.length - 1]; dem.value = p.length > 2 ? p.slice(1, -1).join(' ') : '';
                        du.value = p.join(' ');
                        dongBo = false;
                        (dem.value ? dem : ten).focus();
                    }
                    du.addEventListener('blur', tach);
                    du.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); tach(); } });
                },
                save: function (v, row) {
                    // Ngày sinh kiểm trước khi gửi (ums.util.ngaySinh) — gốc ghép thẳng ba ô, để trống thành "//"
                    var ns = ums.util.ngaySinh(v.dBirth_Day, v.dBirth_Month, v.dBirth_Year, '');
                    if (ns.loi) { ui.toast('Kiểm tra lại: ' + ns.loi, 'warn'); return null; }
                    return luu('Family', {
                        strRelation_Type_Code: v.strRelation_Type_Code, strRelation_Status_Code: v.strRelation_Status_Code,
                        strFull_Name: v.strFull_Name, strLast_Name: v.strLast_Name, strMiddle_Name: v.strMiddle_Name, strFirst_Name: v.strFirst_Name,
                        strGender_Id: v.strGender_Id, strDate_Of_Birth: ns.chuoi,
                        strDob_Precision_Level: v.strDob_Precision_Level, dBirth_Day: ns.ngay, dBirth_Month: ns.thang, dBirth_Year: ns.nam,
                        strOccupation: v.strOccupation, strWorkplace: v.strWorkplace, strPhone_Number: v.strPhone_Number, strEmail: v.strEmail,
                        strAddress_Text: v.strAddress_Text, dIs_Dependent: v.dIs_Dependent, dIs_Emergency_Contact: v.dIs_Emergency_Contact,
                        dIs_Primary_Contact: v.dIs_Primary_Contact, dIs_Active: 1,
                        strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To, strNote: v.strNote
                    }, row);
                }
            } }),

            /* ===== Tab 3: Tài khoản ngân hàng ===== */
            tab('tk', 'Tài khoản ngân hàng', 'fa-building-columns', 'Bank_Account', { tieuDe: 'Thông tin tài khoản ngân hàng', them: 'Thêm tài khoản',
                ten: 'tài khoản ngân hàng', hoiXoa: 'Bạn có chắc chắn xóa tài khoản ngân hàng này không?', cfg: {
                columns: [
                    { title: 'Loại tài khoản', prop: 'ACCOUNT_TYPE_CODE_NAME', cls: 'is-center' },
                    { title: 'Trạng thái', prop: 'ACCOUNT_STATUS_CODE_NAME', cls: 'is-center' },
                    { title: 'Tên ngân hàng', prop: 'BANK_NAME' }, { title: 'Mã ngân hàng', prop: 'BANK_CODE' },
                    { title: 'Tên chi nhánh', prop: 'BRANCH_NAME' }, { title: 'Mã chi nhánh', prop: 'BRANCH_CODE' },
                    { title: 'Số tài khoản', prop: 'ACCOUNT_NUMBER' }, { title: 'Tên chủ TK', prop: 'ACCOUNT_NAME' },
                    { title: 'Loại tiền tệ', prop: 'ACCOUNT_CURRENCY_CODE_NAME', cls: 'is-center' },
                    { title: 'TK chính', cls: 'is-center', render: function (r) { return tick(r.IS_PRIMARY); } },
                    { title: 'TK mặc định', cls: 'is-center', render: function (r) { return tick(r.IS_PAYROLL_DEFAULT); } },
                    { title: 'Xác thực', cls: 'is-center', render: function (r) { return tick(r.IS_VERIFIED); } },
                    { title: 'Ngày hiệu lực', prop: 'EFFECTIVE_FROM', cls: 'is-center' },
                    { title: 'Ngày hết hiệu lực', prop: 'EFFECTIVE_TO', cls: 'is-center' },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl },
                    { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    dm('strAccount_Type_Code', 'ACCOUNT_TYPE_CODE', 'Loại tài khoản', 'PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE', { required: true, cols: 6 }),
                    dm('strAccount_Status_Code', 'ACCOUNT_STATUS_CODE', 'Trạng thái tài khoản', 'PERSON_BANK_ACCOUNT.ACCOUNT_STATUS_CODE', { cols: 6 }),
                    dm('strBank_Id', 'BANK_ID', 'Ngân hàng', 'PERSON_BANK_ACCOUNT.BANK_ID', { required: true, cols: 6 }),
                    s('strBank_Code', 'BANK_CODE', 'Mã ngân hàng', { cols: 6 }),
                    s('strBank_Name', 'BANK_NAME', 'Tên ngân hàng', { cols: 6 }),
                    s('strBranch_Id', 'BRANCH_ID', 'Chi nhánh', { type: 'select', cols: 6, placeholder: 'Chọn chi nhánh' }),
                    s('strBranch_Code', 'BRANCH_CODE', 'Mã chi nhánh', { cols: 6 }),
                    s('strBranch_Name', 'BRANCH_NAME', 'Tên chi nhánh', { cols: 6 }),
                    s('strAccount_Number', 'ACCOUNT_NUMBER', 'Số tài khoản', { required: true, cols: 6 }),
                    s('strAccount_Name', 'ACCOUNT_NAME', 'Tên chủ tài khoản', { required: true, cols: 6 }),
                    dm('strAccount_Currency_Code', 'ACCOUNT_CURRENCY_CODE', 'Loại tiền tệ', 'PERSON_BANK_ACCOUNT.ACCOUNT_CURRENCY_CODE', { cols: 6 }),
                    { type: 'checks', span: true, items: [ck('dIs_Primary', 'IS_PRIMARY', 'Tài khoản chính'),
                        ck('dIs_Payroll_Default', 'IS_PAYROLL_DEFAULT', 'TK mặc định chi trả'), ck('dIs_Verified', 'IS_VERIFIED', 'Đã xác thực')] },
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                onForm: function (row, c) {
                    var nh = fo(c, 'strBank_Id'), cn = fo(c, 'strBranch_Id');
                    function napCN(bank) {
                        if (!bank) return Promise.resolve([]);
                        return ums.api.call({ action: 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFNA0oJDQFIC8pDDQi', func: 'pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc',
                            silent: true, strQUANHECHA_Id: bank, strTuKhoa: '', strCHUNG_TENDANHMUC_Id: 'PERSON_BANK_ACCOUNT.BRANCH_ID',
                            strTieuChiSapXep: '', pageIndex: 1, pageSize: 100000, dTrangThai: 1 })
                            .then(function (r) { var d = X.arr(r.data); return d.length ? d : X.dmRows('PERSON_BANK_ACCOUNT.BRANCH_ID'); },
                                function () { return X.dmRows('PERSON_BANK_ACCOUNT.BRANCH_ID'); });
                    }
                    if (!c._gan) {
                        c._gan = true;
                        jq(nh, 'select2:select select2:clear', function () {
                            X.dmRows('PERSON_BANK_ACCOUNT.BANK_ID').then(function (ds) {
                                var r = ds.filter(function (x) { return x.ID === nh.value; })[0];
                                fo(c, 'strBank_Code').value = r ? r.MA || '' : '';
                                fo(c, 'strBank_Name').value = r ? r.TEN || '' : '';
                            });
                            fo(c, 'strBranch_Code').value = ''; fo(c, 'strBranch_Name').value = '';
                            napCN(nh.value).then(function (ds) { c._cn = ds; pat.fill(cn, ds); });
                        });
                        jq(cn, 'select2:select select2:clear', function () {
                            var r = (c._cn || []).filter(function (x) { return x.ID === cn.value; })[0];
                            fo(c, 'strBranch_Code').value = r ? r.MA || '' : '';
                            fo(c, 'strBranch_Name').value = r ? r.TEN || '' : '';
                        });
                        pat.chain([nh, cn], { phatLai: false });
                    }
                    napCN(nh.value).then(function (ds) {
                        c._cn = ds;
                        pat.fill(cn, ds);
                        if (row) X.chon(cn, row.BRANCH_ID || row.BRANCH_CODE, ds);
                        else dat(cn, '');
                        jQuery(cn).trigger('change.select2');
                    });
                },
                save: function (v, row) {
                    return luu('Bank_Account', {
                        strAccount_Type_Code: v.strAccount_Type_Code, strAccount_Status_Code: v.strAccount_Status_Code,
                        strBank_Id: v.strBank_Id, strBank_Code: v.strBank_Code, strBank_Name: v.strBank_Name,
                        strBranch_Id: v.strBranch_Id, strBranch_Code: v.strBranch_Code, strBranch_Name: v.strBranch_Name,
                        strAccount_Number: v.strAccount_Number, strAccount_Name: v.strAccount_Name, strAccount_Currency_Code: v.strAccount_Currency_Code,
                        dIs_Primary: v.dIs_Primary, dIs_Payroll_Default: v.dIs_Payroll_Default, dIs_Verified: v.dIs_Verified, dIs_Active: 1,
                        strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To, strNote: v.strNote
                    }, row);
                }
            } }),

            /* ===== Tab 4: Học vấn ===== */
            tab('hv', 'Học vấn', 'fa-graduation-cap', 'Education', { tieuDe: 'Thông tin học vấn', them: 'Thêm học vấn', ten: 'học vấn',
                hoiXoa: 'Bạn có chắc chắn xóa học vấn này không?', cfg: {
                rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (r) {
                    napNganh().then(function (n) {
                        if (!r.MAJOR_GROUP_NAME) r.MAJOR_GROUP_NAME = tenNhom(n, r.MAJOR_GROUP_ID) || tenNhom(n, nhomCuaNganh(n, r.MAJOR_ID || r.MAJOR_CODE));
                        xem('Thông tin chi tiết học vấn', 'fa-graduation-cap', null, r, [
                            { t: 'Thông tin chung', i: [['Loại hình học vấn', 'EDUCATION_TYPE_CODE_NAME'], ['Bậc đào tạo', 'EDUCATION_LEVEL_CODE_NAME'],
                                ['Trạng thái học', 'EDUCATION_STATUS_CODE_NAME'], ['Loại văn bằng', function (d) { return esc(X.lay(d, ['DEGREE_CODE', 'DEGREE_TYPE_CODE'])); }],
                                ['Tên Loại văn bằng', function (d) { return esc(X.lay(d, ['DEGREE_NAME', 'BANK_NAME'])); }]] },
                            { t: 'Thông tin ngành học', i: [['Nhóm ngành', 'MAJOR_GROUP_NAME'], ['Mã ngành', 'MAJOR_CODE'], ['Tên ngành', 'MAJOR_NAME'],
                                ['Chuyên ngành', 'SPECIALIZATION_NAME'], ['Mã chuyên ngành', 'SPECIALIZATION_CODE'], ['Tên chuyên ngành', 'SPECIALIZATION_NAME_FULL']] },
                            { t: 'Cơ sở đào tạo', i: [['Tên cơ sở', 'INSTITUTION_NAME'], ['Mã cơ sở', 'INSTITUTION_CODE'], ['Tên đầy đủ', 'INSTITUTION_NAME_FULL'], ['Quốc gia', 'COUNTRY_NAME']] },
                            { t: 'Thời gian học tập', i: [['Năm nhập học', 'ENROLLMENT_YEAR'], ['Năm tốt nghiệp', 'GRADUATION_YEAR'], ['Ngày bắt đầu', 'START_DATE'], ['Ngày tốt nghiệp', 'COMPLETION_DATE']] },
                            { t: 'Kết quả học tập', i: [['Xếp loại', 'CLASSIFICATION_CODE_NAME'], ['GPA', function (d) { return esc((d.GPA || '') + ' / ' + (d.GPA_SCALE || '')); }],
                                ['Số hiệu văn bằng', 'DEGREE_NUMBER'], ['Ngày cấp VB', 'DEGREE_ISSUE_DATE']] },
                            { t: 'Thông tin khác', i: [['Trình độ cao nhất', function (d) { return X.coKhong(d.IS_HIGHEST); }],
                                ['Chuyên môn chính', function (d) { return X.coKhong(d.IS_PRIMARY_MAJOR); }], ['Được công nhận', function (d) { return X.coKhong(d.IS_RECOGNIZED); }],
                                ['Ngày hiệu lực', 'EFFECTIVE_FROM'], ['Ngày hết hiệu lực', 'EFFECTIVE_TO'],
                                ['Hiệu lực', function (d) { return X.coKhong(d.IS_ACTIVE, 'Có hiệu lực', 'Hết hiệu lực'); }], ['Ghi chú', 'NOTE']] }
                        ]);
                    });
                } }],
                onLoad: function (rows, c) {
                    // Cột "Nhóm ngành": API danh sách có thể không trả MAJOR_GROUP_* → suy từ danh mục ngành (genTable_HocVan của gốc)
                    napNganh().then(function (n) {
                        var doi = false;
                        rows.forEach(function (r) {
                            if (r._nhom !== undefined) return;
                            r._nhom = X.lay(r, ['MAJOR_GROUP_NAME', 'MAJOR_GROUP_ID_NAME', 'MAJOR_GROUP_CODE']) || tenNhom(n, X.lay(r, ['MAJOR_GROUP_ID'])) ||
                                tenNhom(n, nhomCuaNganh(n, X.lay(r, ['MAJOR_ID', 'MAJOR_CODE'])));
                            doi = true;
                        });
                        if (doi) c.draw();
                    });
                },
                columns: [
                    { title: 'Loại hình học vấn', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['EDUCATION_TYPE_CODE_NAME', 'EDUCATION_TYPE_NAME'])); } },
                    { title: 'Bậc đào tạo', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['EDUCATION_LEVEL_CODE_NAME', 'EDUCATION_LEVEL_NAME'])); } },
                    { title: 'Trạng thái học', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['EDUCATION_STATUS_CODE_NAME', 'EDUCATION_STATUS_NAME'])); } },
                    { title: 'Loại văn bằng', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['DEGREE_CODE_NAME', 'DEGREE_TYPE_CODE_NAME', 'DEGREE_TYPE_NAME', 'DEGREE_CODE', 'DEGREE_TYPE_CODE'])); } },
                    { title: 'Tên văn bằng', render: function (r) { return esc(X.lay(r, ['DEGREE_NAME', 'BANK_NAME', 'DEGREE_NAME_FULL'])); } },
                    { title: 'Nhóm ngành', render: function (r) { return esc(r._nhom || ''); } },
                    { title: 'Mã ngành', prop: 'MAJOR_CODE' }, { title: 'Tên ngành', prop: 'MAJOR_NAME' },
                    { title: 'Chuyên ngành', render: function (r) { return esc(X.lay(r, ['SPECIALIZATION_NAME', 'SPECIALIZATION_NAME_FULL'])); } },
                    { title: 'Mã chuyên ngành', prop: 'SPECIALIZATION_CODE' },
                    { title: 'Tên chuyên ngành', render: function (r) { return esc(X.lay(r, ['SPECIALIZATION_NAME_FULL', 'SPECIALIZATION_NAME'])); } },
                    { title: 'Cơ sở đào tạo', render: function (r) { return esc(X.lay(r, ['INSTITUTION_NAME', 'INSTITUTION_NAME_FULL'])); } },
                    { title: 'Mã cơ sở ĐT', prop: 'INSTITUTION_CODE' },
                    { title: 'Tên cơ sở ĐT', render: function (r) { return esc(X.lay(r, ['INSTITUTION_NAME_FULL', 'INSTITUTION_NAME'])); } },
                    { title: 'Quốc gia', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['COUNTRY_NAME', 'COUNTRY_ID_NAME', 'COUNTRY_CODE_NAME'])); } },
                    { title: 'Năm nhập học', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['ENROLLMENT_YEAR', 'D_ENROLLMENT_YEAR', 'ENROLL_YEAR'])); } },
                    { title: 'Ngày bắt đầu', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['START_DATE', 'STR_START_DATE'])); } },
                    { title: 'Ngày tốt nghiệp', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['COMPLETION_DATE', 'COMPLETION_DATE_STR', 'STR_COMPLETION_DATE'])); } },
                    { title: 'Năm tốt nghiệp', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['GRADUATION_YEAR', 'D_GRADUATION_YEAR'])); } },
                    { title: 'Xếp loại', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['CLASSIFICATION_CODE_NAME', 'CLASSIFICATION_NAME'])); } },
                    { title: 'GPA', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['GPA', 'D_GPA'])); } },
                    { title: 'Số hiệu văn bằng', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['DEGREE_NUMBER', 'DEGREE_NO', 'STR_DEGREE_NUMBER'])); } },
                    { title: 'Ngày cấp VB', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['DEGREE_ISSUE_DATE', 'STR_DEGREE_ISSUE_DATE'])); } },
                    { title: 'Trình độ cao nhất', cls: 'is-center', render: function (r) { return X.coKhong(X.lay(r, ['IS_HIGHEST', 'D_IS_HIGHEST'])); } },
                    { title: 'Được công nhận', cls: 'is-center', render: function (r) { return X.coKhong(X.lay(r, ['IS_RECOGNIZED', 'D_IS_RECOGNIZED'])); } },
                    { title: 'Ngày hiệu lực', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['EFFECTIVE_FROM', 'STR_EFFECTIVE_FROM'])); } },
                    { title: 'Ngày hết hiệu lực', cls: 'is-center', render: function (r) { return esc(X.lay(r, ['EFFECTIVE_TO', 'STR_EFFECTIVE_TO'])); } },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl },
                    { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    lg('Thông tin chung'),
                    dm('strEducation_Type_Code', '', 'Loại hình học vấn', 'PERSON_EDUCATION.EDUCATION_TYPE_CODE', { required: true, cols: 6, get: function (r) { return X.lay(r, ['EDUCATION_TYPE_CODE', 'EDUCATION_TYPE_ID']); } }),
                    dm('strEducation_Level_Code', '', 'Bậc đào tạo', 'PERSON_EDUCATION.EDUCATION_LEVEL_CODE', { required: true, cols: 6, get: function (r) { return X.lay(r, ['EDUCATION_LEVEL_CODE', 'EDUCATION_LEVEL_ID']); } }),
                    dm('strEducation_Status_Code', '', 'Trạng thái học', 'PERSON_EDUCATION.EDUCATION_STATUS_CODE', { cols: 6, get: function (r) { return X.lay(r, ['EDUCATION_STATUS_CODE', 'EDUCATION_STATUS_ID']); } }),
                    lg('Thông tin văn bằng'),
                    dm('strDegree_Code', '', 'Mã loại văn bằng', 'PERSON_EDUCATION.DEGREE_CODE', { cols: 6, get: function (r) { return X.lay(r, ['DEGREE_CODE', 'DEGREE_TYPE_CODE']); } }),
                    s('strDegree_Name', '', 'Tên Loại văn bằng', { cols: 6, get: function (r) { return X.lay(r, ['DEGREE_NAME', 'BANK_NAME']); } }),
                    lg('Thông tin ngành học'),
                    s('_nhomNganh', '', 'Nhóm ngành', { type: 'select', cols: 6, placeholder: 'Chọn nhóm ngành', get: function (r) { return X.lay(r, ['MAJOR_GROUP_ID']); } }),
                    s('strMajor_Code', 'MAJOR_CODE', 'Mã ngành', { cols: 6 }),
                    s('strMajor_Name', 'MAJOR_NAME', 'Tên ngành', { cols: 6 }),
                    dm('strSpecialization_Id', '', 'Chuyên ngành', 'PERSON_EDUCATION.SPECIALIZATION_ID', { cols: 6, get: function (r) { return X.lay(r, ['SPECIALIZATION_ID', 'SPECIALIZATION_CODE']); } }),
                    s('strSpecialization_Code', 'SPECIALIZATION_CODE', 'Mã chuyên ngành', { cols: 6 }),
                    s('strSpecialization_Name', 'SPECIALIZATION_NAME', 'Tên chuyên ngành', { cols: 6 }),
                    lg('Cơ sở đào tạo'),
                    dm('strInstitution_Id', 'INSTITUTION_ID', 'Cơ sở đào tạo', 'PERSON_EDUCATION.INSTITUTION_ID', { cols: 6 }),
                    s('strInstitution_Code', 'INSTITUTION_CODE', 'Mã cơ sở ĐT', { cols: 6 }),
                    s('strInstitution_Name', 'INSTITUTION_NAME', 'Tên cơ sở ĐT', { cols: 6 }),
                    dm('strCountry_Id', '', 'Quốc gia', 'PERSON_EDUCATION.COUNTRY_ID', { cols: 6, get: function (r) { return X.lay(r, ['COUNTRY_ID', 'COUNTRY_CODE']); } }),
                    lg('Thời gian học tập'),
                    s('dEnrollment_Year', '', 'Năm nhập học', { type: 'number', cols: 6, get: function (r) { return X.lay(r, ['ENROLLMENT_YEAR', 'D_ENROLLMENT_YEAR']); } }),
                    ng('strStart_Date', 'START_DATE', 'Ngày bắt đầu học', { cols: 6 }),
                    ng('strCompletion_Date', 'COMPLETION_DATE', 'Ngày tốt nghiệp', { cols: 6 }),
                    s('dGraduation_Year', '', 'Năm tốt nghiệp', { type: 'number', cols: 6, get: function (r) { return X.lay(r, ['GRADUATION_YEAR', 'D_GRADUATION_YEAR']); } }),
                    lg('Kết quả học tập'),
                    dm('strClassification_Code', 'CLASSIFICATION_CODE', 'Xếp loại tốt nghiệp', 'PERSON_EDUCATION.CLASSIFICATION_CODE', { cols: 6 }),
                    s('dGPA', '', 'GPA (Điểm TB)', { type: 'number', cols: 6, get: function (r) { return X.lay(r, ['GPA', 'D_GPA']); } }),
                    s('dGPA_Scale', '', 'GPA Scale (Thang điểm)', { type: 'number', cols: 6, get: function (r) { return X.lay(r, ['GPA_SCALE', 'D_GPA_SCALE']); } }),
                    s('strDegree_Number', '', 'Số hiệu văn bằng', { cols: 6, get: function (r) { return X.lay(r, ['DEGREE_NUMBER', 'DEGREE_NO']); } }),
                    ng('strDegree_Issue_Date', 'DEGREE_ISSUE_DATE', 'Ngày cấp văn bằng', { cols: 6 }),
                    lg('Thông tin khác'),
                    { type: 'checks', span: true, items: [ck('dIs_Highest', 'IS_HIGHEST', 'Là trình độ cao nhất'), ck('dIs_Primary_Major', 'IS_PRIMARY_MAJOR', 'Chuyên môn chính'),
                        ck('dIs_Recognized', 'IS_RECOGNIZED', 'Được công nhận'), ck('dIs_Active', 'IS_ACTIVE', 'Hiệu lực', { value: 1 })] },
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                onForm: function (row, c) {
                    var nhom = fo(c, '_nhomNganh'), cn = fo(c, 'strSpecialization_Id'), cs = fo(c, 'strInstitution_Id');
                    var dsDm = ['EDUCATION_TYPE_CODE', 'EDUCATION_LEVEL_CODE', 'EDUCATION_STATUS_CODE', 'DEGREE_CODE', 'SPECIALIZATION_ID', 'INSTITUTION_ID', 'COUNTRY_ID', 'CLASSIFICATION_CODE'];
                    var khoa = ['strEducation_Type_Code', 'strEducation_Level_Code', 'strEducation_Status_Code', 'strDegree_Code', 'strSpecialization_Id', 'strInstitution_Id', 'strCountry_Id', 'strClassification_Code'];
                    if (row) {
                        // setComboSmart của gốc: đặt theo ID, không khớp thì theo MA
                        Promise.all(dsDm.map(function (m) { return X.dmRows('PERSON_EDUCATION.' + m); })).then(function (x) {
                            khoa.forEach(function (k, i) {
                                var f = c.cfg.fields.filter(function (y) { return y.key === k; })[0];
                                X.chon(fo(c, k), f.get ? f.get(row) : row[f.col], x[i]);
                            });
                        });
                    }
                    napNganh().then(function (n) {
                        c._n = n;
                        pat.fill(nhom, n.nhom);
                        X.chon(nhom, row ? X.lay(row, ['MAJOR_GROUP_ID']) : '', n.nhom);
                    });
                    if (c._gan) return;
                    c._gan = true;
                    // Đổi nhóm ngành (người dùng chọn) → xoá chuyên ngành như gốc
                    jq(nhom, 'select2:select select2:clear', function () {
                        dat(cn, ''); jQuery(cn).trigger('change.select2');
                        fo(c, 'strSpecialization_Code').value = ''; fo(c, 'strSpecialization_Name').value = '';
                    });
                    function tuDien(el, ma, kCode, kName) {
                        jq(el, 'select2:select select2:clear', function () {
                            X.dmRows(ma).then(function (ds) {
                                var r = ds.filter(function (x) { return x.ID === el.value; })[0];
                                fo(c, kCode).value = r ? r.MA || '' : '';
                                fo(c, kName).value = r ? r.TEN || '' : '';
                            });
                        });
                    }
                    tuDien(cn, 'PERSON_EDUCATION.SPECIALIZATION_ID', 'strSpecialization_Code', 'strSpecialization_Name');
                    tuDien(cs, 'PERSON_EDUCATION.INSTITUTION_ID', 'strInstitution_Code', 'strInstitution_Name');
                },
                save: function (v, row, c) {
                    var n = c._n || { tat: [], nhom: [] };   // danh mục ngành đã nạp ở onForm
                    return (function () {
                        var maj = suyNganh(n, v.strMajor_Code, v.strMajor_Name, v._nhomNganh);
                        if (!maj && row && String(row.MAJOR_CODE || '') === v.strMajor_Code) maj = row.MAJOR_ID || '';
                        var grp = v._nhomNganh;
                        if (maj && grp && maj === grp) { var cha = nhomCuaNganh(n, maj); if (cha) grp = cha; else maj = ''; }
                        if (maj && !grp) grp = nhomCuaNganh(n, maj);
                        return luu('Education', {
                            strEducation_Type_Code: v.strEducation_Type_Code, strEducation_Level_Code: v.strEducation_Level_Code,
                            strEducation_Status_Code: v.strEducation_Status_Code,
                            strDegree_Type_Code: v.strDegree_Code, strBank_Name: v.strDegree_Name,          // tên tham số cũ backend đang dùng
                            strDegree_Code: v.strDegree_Code, strDegree_Name: v.strDegree_Name,
                            strMajor_Group_Id: grp, strMajor_Id: maj, strMajor_Code: v.strMajor_Code, strMajor_Name: v.strMajor_Name,
                            strSpecialization_Id: v.strSpecialization_Id, strSpecialization_Code: v.strSpecialization_Code, strSpecialization_Name: v.strSpecialization_Name,
                            strInstitution_Id: v.strInstitution_Id, strInstitution_Code: v.strInstitution_Code, strInstitution_Name: v.strInstitution_Name,
                            strCountry_Id: v.strCountry_Id, dEnrollment_Year: v.dEnrollment_Year, strStart_Date: v.strStart_Date,
                            strCompletion_Date: v.strCompletion_Date, dGraduation_Year: v.dGraduation_Year, strClassification_Code: v.strClassification_Code,
                            dGPA: v.dGPA, dGPA_Scale: v.dGPA_Scale, strDegree_Number: v.strDegree_Number, strDegree_Issue_Date: v.strDegree_Issue_Date,
                            dIs_Highest: v.dIs_Highest, dIs_Primary_Major: v.dIs_Primary_Major, dIs_Recognized: v.dIs_Recognized,
                            strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To, dIs_Active: v.dIs_Active, strNote: v.strNote
                        }, row);
                    })();
                }
            } }),

            /* ===== Tab 5: Chứng chỉ ===== */
            tab('cc', 'Chứng chỉ', 'fa-certificate', 'Certificate', { tieuDe: 'Thông tin chứng chỉ', them: 'Thêm chứng chỉ', ten: 'chứng chỉ',
                hoiXoa: 'Bạn có chắc chắn xóa chứng chỉ này không?', cfg: {
                rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (r) {
                    xem('Thông tin chi tiết chứng chỉ', 'fa-certificate', 'Get_Person_Certificate_By_Id', r, [
                        { t: 'Thông tin chung', i: [['Loại chứng chỉ', 'CERTIFICATE_TYPE_CODE_NAME'], ['Trạng thái', 'CERTIFICATE_STATUS_CODE_NAME'], ['Mã chứng chỉ', 'CERTIFICATE_CODE'], ['Tên chứng chỉ', 'CERTIFICATE_NAME']] },
                        { t: 'Nhóm và cấp độ', i: [['Nhóm chứng chỉ', 'CATEGORY_NAME'], ['Mã nhóm', 'CATEGORY_CODE'], ['Cấp độ', 'LEVEL_NAME'], ['Mã cấp độ', 'LEVEL_CODE']] },
                        { t: 'Kết quả', i: [['Điểm số', 'SCORE'], ['Xếp loại', 'CLASSIFICATION_CODE_NAME'], ['Mô tả kết quả', 'RESULT_TEXT']] },
                        { t: 'Thông tin chứng chỉ', i: [['Số chứng chỉ', 'CERTIFICATE_NO'], ['Số seri', 'SERIAL_NO']] },
                        { t: 'Đơn vị cấp', i: [['Tên đơn vị', 'ISSUED_BY_ORG_NAME'], ['Mã đơn vị', 'ISSUED_BY_ORG_CODE'], ['Quốc gia', 'COUNTRY_NAME']] },
                        { t: 'Thời gian', i: [['Ngày cấp', 'ISSUE_DATE'], ['Ngày hết hạn', 'EXPIRE_DATE']] },
                        { t: 'Thông tin khác', i: [['Vô thời hạn', function (d) { return X.coKhong(d.IS_LIFETIME); }], ['Chứng chỉ chính', function (d) { return X.coKhong(d.IS_MAIN_CERTIFICATE); }],
                            ['Đã xác minh', function (d) { return X.coKhong(d.IS_VERIFIED); }], ['Ngày hiệu lực', 'EFFECTIVE_FROM'], ['Ngày hết hiệu lực', 'EFFECTIVE_TO'],
                            ['Hiệu lực', function (d) { return X.coKhong(d.IS_ACTIVE, 'Có hiệu lực', 'Hết hiệu lực'); }], ['Ghi chú', 'NOTE']] }
                    ]);
                } }],
                columns: [
                    { title: 'Loại chứng chỉ', prop: 'CERTIFICATE_TYPE_CODE_NAME', cls: 'is-center' },
                    { title: 'Trạng thái', prop: 'CERTIFICATE_STATUS_CODE_NAME', cls: 'is-center' },
                    { title: 'Mã chứng chỉ', prop: 'CERTIFICATE_CODE' }, { title: 'Tên chứng chỉ', prop: 'CERTIFICATE_NAME' },
                    { title: 'Nhóm chứng chỉ', prop: 'CATEGORY_NAME' }, { title: 'Cấp độ/Bậc', prop: 'LEVEL_NAME' },
                    { title: 'Điểm số', prop: 'SCORE', cls: 'is-center' }, { title: 'Xếp loại', prop: 'CLASSIFICATION_CODE_NAME', cls: 'is-center' },
                    { title: 'Số chứng chỉ', prop: 'CERTIFICATE_NO' }, { title: 'Đơn vị cấp', prop: 'ISSUED_BY_ORG_NAME' },
                    { title: 'Quốc gia', prop: 'COUNTRY_NAME', cls: 'is-center' },
                    { title: 'Ngày cấp', prop: 'ISSUE_DATE', cls: 'is-center' }, { title: 'Ngày hết hạn', prop: 'EXPIRE_DATE', cls: 'is-center' },
                    { title: 'Vô thời hạn', cls: 'is-center', render: function (r) { return tick(r.IS_LIFETIME); } },
                    { title: 'Chứng chỉ chính', cls: 'is-center', render: function (r) { return tick(r.IS_MAIN_CERTIFICATE); } },
                    { title: 'Đã xác minh', cls: 'is-center', render: function (r) { return tick(r.IS_VERIFIED); } },
                    { title: 'Ngày hiệu lực', prop: 'EFFECTIVE_FROM', cls: 'is-center' }, { title: 'Ngày hết hiệu lực', prop: 'EFFECTIVE_TO', cls: 'is-center' },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl }, { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    lg('Thông tin chung'),
                    dm('strCertificate_Type_Code', 'CERTIFICATE_TYPE_CODE', 'Loại chứng chỉ', 'PERSON_CERTIFICATE.CERTIFICATE_TYPE_CODE', { required: true, cols: 6 }),
                    dm('strCertificate_Status_Code', 'CERTIFICATE_STATUS_CODE', 'Trạng thái chứng chỉ', 'PERSON_CERTIFICATE.CERTIFICATE_STATUS_CODE', { cols: 6 }),
                    dm('strCertificate_Code', 'CERTIFICATE_CODE', 'Mã chứng chỉ', 'PERSON_CERTIFICATE.CERTIFICATE_CODE', { cols: 6 }),
                    s('strCertificate_Name', 'CERTIFICATE_NAME', 'Tên chứng chỉ', { cols: 6 }),
                    lg('Nhóm và cấp độ'),
                    dm('strCategory_Id', 'CATEGORY_ID', 'Nhóm chứng chỉ', 'PERSON_CERTIFICATE.CATEGORY_ID', { cols: 6 }),
                    s('strCategory_Code', 'CATEGORY_CODE', 'Mã nhóm chứng chỉ', { cols: 6 }),
                    s('strCategory_Name', 'CATEGORY_NAME', 'Tên nhóm chứng chỉ', { cols: 6 }),
                    dm('strLevel_Id', 'LEVEL_ID', 'Cấp độ/Bậc', 'PERSON_CERTIFICATE.LEVEL_ID', { cols: 6 }),
                    s('strLevel_Code', 'LEVEL_CODE', 'Mã cấp độ', { cols: 6 }),
                    s('strLevel_Name', 'LEVEL_NAME', 'Tên cấp độ', { cols: 6 }),
                    lg('Kết quả'),
                    s('dScore', 'SCORE', 'Điểm số đạt được', { type: 'number', cols: 6 }),
                    s('dScore_Scale', 'SCORE_SCALE', 'Thang điểm', { type: 'number', cols: 6 }),
                    dm('strClassification_Code', 'CLASSIFICATION_CODE', 'Xếp loại', 'PERSON_CERTIFICATE.CLASSIFICATION_CODE', { cols: 6 }),
                    s('strResult_Text', 'RESULT_TEXT', 'Mô tả kết quả', { type: 'textarea', span: true }),
                    lg('Thông tin chứng chỉ'),
                    s('strCertificate_No', 'CERTIFICATE_NO', 'Số chứng chỉ', { cols: 6 }),
                    s('strSerial_No', 'SERIAL_NO', 'Số seri', { cols: 6 }),
                    lg('Đơn vị cấp'),
                    dm('strIssued_By_Org_Id', 'ISSUED_BY_ORG_ID', 'Đơn vị cấp', 'PERSON_CERTIFICATE.ISSUED_BY_ORG_ID', { cols: 6 }),
                    s('strIssued_By_Org_Code', 'ISSUED_BY_ORG_CODE', 'Mã đơn vị cấp', { cols: 6 }),
                    s('strIssued_By_Org_Name', 'ISSUED_BY_ORG_NAME', 'Tên đơn vị cấp', { cols: 6 }),
                    s('strCountry_Id', 'COUNTRY_ID', 'Quốc gia', { type: 'select', cols: 6 }),
                    lg('Thời gian'),
                    ng('strIssue_Date', 'ISSUE_DATE', 'Ngày cấp', { cols: 6 }),
                    ng('strExpire_Date', 'EXPIRE_DATE', 'Ngày hết hạn', { cols: 6 }),
                    lg('Thông tin khác'),
                    { type: 'checks', span: true, items: [ck('dIs_Lifetime', 'IS_LIFETIME', 'Vô thời hạn'), ck('dIs_Main_Certificate', 'IS_MAIN_CERTIFICATE', 'Chứng chỉ chính'),
                        ck('dIs_Verified', 'IS_VERIFIED', 'Đã xác minh'), ck('dIs_Active', 'IS_ACTIVE', 'Hiệu lực', { value: 1 })] },
                    s('strFile_Id', 'FILE_ID', '', { type: 'hidden' }),
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                onForm: function (row, c) {
                    // Quốc gia: danh mục của chứng chỉ rỗng → dùng danh mục của địa chỉ (fallback của gốc)
                    var qg = fo(c, 'strCountry_Id');
                    X.dmRows('PERSON_CERTIFICATE.COUNTRY_ID').then(function (ds) { return ds.length ? ds : X.dmRows('PERSON_ADDRESS.COUNTRY_ID'); })
                        .then(function (ds) { pat.fill(qg, ds); dat(qg, row ? row.COUNTRY_ID : ''); jQuery(qg).trigger('change.select2'); });
                },
                save: function (v, row) {
                    return luu('Certificate', {
                        strCertificate_Type_Code: v.strCertificate_Type_Code, strCertificate_Status_Code: v.strCertificate_Status_Code,
                        strCertificate_Code: v.strCertificate_Code, strCertificate_Name: v.strCertificate_Name,
                        strCategory_Id: v.strCategory_Id, strCategory_Code: v.strCategory_Code, strCategory_Name: v.strCategory_Name,
                        strLevel_Id: v.strLevel_Id, strLevel_Code: v.strLevel_Code, strLevel_Name: v.strLevel_Name,
                        dScore: v.dScore, dScore_Scale: v.dScore_Scale, strClassification_Code: v.strClassification_Code, strResult_Text: v.strResult_Text,
                        strCertificate_No: v.strCertificate_No, strSerial_No: v.strSerial_No,
                        strIssued_By_Org_Id: v.strIssued_By_Org_Id, strIssued_By_Org_Code: v.strIssued_By_Org_Code, strIssued_By_Org_Name: v.strIssued_By_Org_Name,
                        strCountry_Id: v.strCountry_Id, strIssue_Date: v.strIssue_Date, strExpire_Date: v.strExpire_Date,
                        dIs_Lifetime: v.dIs_Lifetime, dIs_Main_Certificate: v.dIs_Main_Certificate, dIs_Verified: v.dIs_Verified,
                        strFile_Id: v.strFile_Id, strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To,
                        dIs_Active: v.dIs_Active, strNote: v.strNote
                    }, row);
                }
            } }),

            /* ===== Tab 6: Tài liệu ===== */
            tab('tl', 'Tài liệu', 'fa-file-lines', 'Document', { tieuDe: 'Thông tin tài liệu', them: 'Thêm tài liệu', ten: 'tài liệu', chiNguoi: true,
                hoiXoa: 'Bạn có chắc chắn xóa tài liệu này không?', cfg: {
                detail: function (r) { return X.g6('Get_Person_Document_By_Id', { strId: r.ID }); },
                rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (r) {
                    xem('Thông tin chi tiết tài liệu', 'fa-file-lines', 'Get_Person_Document_By_Id', r, [
                        { t: 'Thông tin chung', i: [['Loại tài liệu', 'DOCUMENT_TYPE_CODE_NAME'], ['Trạng thái', 'DOCUMENT_STATUS_CODE_NAME'], ['Tên tài liệu', 'DOCUMENT_NAME'],
                            ['Số hiệu', 'DOCUMENT_NO'], ['Tiêu đề', 'DOCUMENT_TITLE']] },
                        { t: 'Thông tin file', i: [['File ID', 'FILE_ID'], ['Tên file', 'FILE_NAME'], ['Phần mở rộng', 'FILE_EXT']] },
                        { t: 'Đơn vị cấp', i: [['Tên đơn vị', 'ISSUED_BY_ORG_NAME'], ['Mã đơn vị', 'ISSUED_BY_ORG_CODE']] },
                        { t: 'Thời gian', i: [['Ngày cấp', 'ISSUE_DATE'], ['Ngày hết hạn', 'EXPIRE_DATE'], ['Ngày hiệu lực', 'EFFECTIVE_FROM'], ['Ngày hết hiệu lực', 'EFFECTIVE_TO']] },
                        { t: 'Thông tin khác', i: [['Hiệu lực', function (d) { return X.coKhong(d.IS_ACTIVE, 'Có hiệu lực', 'Hết hiệu lực'); }], ['Ghi chú', 'NOTE']] }
                    ]);
                } }],
                columns: [
                    { title: 'Loại tài liệu', prop: 'DOCUMENT_TYPE_CODE_NAME', cls: 'is-center' },
                    { title: 'Trạng thái', prop: 'DOCUMENT_STATUS_CODE_NAME', cls: 'is-center' },
                    { title: 'Tên tài liệu', prop: 'DOCUMENT_NAME' }, { title: 'Số hiệu', prop: 'DOCUMENT_NO' }, { title: 'Tiêu đề', prop: 'DOCUMENT_TITLE' },
                    { title: 'File', prop: 'FILE_ID' }, { title: 'Tên file', prop: 'FILE_NAME' }, { title: 'Phần mở rộng', prop: 'FILE_EXT', cls: 'is-center' },
                    { title: 'Đơn vị cấp', prop: 'ISSUED_BY_ORG_NAME' }, { title: 'Mã đơn vị', prop: 'ISSUED_BY_ORG_CODE' }, { title: 'Tên đơn vị', prop: 'ISSUED_BY_ORG_NAME' },
                    { title: 'Ngày cấp', prop: 'ISSUE_DATE', cls: 'is-center' }, { title: 'Ngày hết hạn', prop: 'EXPIRE_DATE', cls: 'is-center' },
                    { title: 'Ngày hiệu lực', prop: 'EFFECTIVE_FROM', cls: 'is-center' }, { title: 'Ngày hết hiệu lực', prop: 'EFFECTIVE_TO', cls: 'is-center' },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl }, { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    lg('Thông tin chung'),
                    dm('strDocument_Type_Code', 'DOCUMENT_TYPE_CODE', 'Loại tài liệu', 'PERSON_DOCUMENT.DOCUMENT_TYPE_CODE', { required: true, cols: 6 }),
                    dm('strDocument_Status_Code', 'DOCUMENT_STATUS_CODE', 'Trạng thái', 'PERSON_DOCUMENT.DOCUMENT_STATUS_CODE', { cols: 6 }),
                    s('strDocument_Name', 'DOCUMENT_NAME', 'Tên tài liệu', { cols: 6 }),
                    s('strDocument_No', 'DOCUMENT_NO', 'Số hiệu', { cols: 6 }),
                    s('strDocument_Title', 'DOCUMENT_TITLE', 'Tiêu đề', { span: true }),
                    lg('Thông tin file'),
                    s('strFile_Id', 'FILE_ID', '', { type: 'hidden' }),
                    s('strFile_Name', 'FILE_NAME', 'Tên file', { cols: 6 }),
                    s('strFile_Ext', 'FILE_EXT', 'Phần mở rộng', { cols: 6 }),
                    lg('Đơn vị cấp'),
                    dm('strIssued_By_Org_Id', 'ISSUED_BY_ORG_ID', 'Đơn vị cấp', 'PERSON_DOCUMENT.ISSUED_BY_ORG_ID', { cols: 6 }),
                    s('strIssued_By_Org_Code', 'ISSUED_BY_ORG_CODE', 'Mã đơn vị', { cols: 6 }),
                    s('strIssued_By_Org_Name', 'ISSUED_BY_ORG_NAME', 'Tên đơn vị', { cols: 6 }),
                    lg('Thời gian'),
                    ng('strIssue_Date', 'ISSUE_DATE', 'Ngày cấp', { cols: 6 }),
                    ng('strExpire_Date', 'EXPIRE_DATE', 'Ngày hết hạn', { cols: 6 }),
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    lg('Thông tin khác'),
                    { type: 'checks', span: true, items: [ck('dIs_Active', 'IS_ACTIVE', 'Hiệu lực', { value: 1 })] },
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                save: function (v, row) {
                    return luu('Document', {
                        strDocument_Type_Code: v.strDocument_Type_Code, strDocument_Status_Code: v.strDocument_Status_Code,
                        strDocument_Name: v.strDocument_Name, strDocument_No: v.strDocument_No, strDocument_Title: v.strDocument_Title,
                        strFile_Id: v.strFile_Id, strFile_Name: v.strFile_Name, strFile_Ext: v.strFile_Ext, strMime_Type: '', dFile_Size: 0,
                        strIssued_By_Org_Id: v.strIssued_By_Org_Id, strIssued_By_Org_Code: v.strIssued_By_Org_Code, strIssued_By_Org_Name: v.strIssued_By_Org_Name,
                        strIssue_Date: v.strIssue_Date, strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To, strExpire_Date: v.strExpire_Date,
                        strRelated_Table_Name: '', strRelated_Record_Id: '', strRelated_Field_Code: '', dVersion_No: 1,
                        dIs_Primary: 0, dIs_Verified: 0, dIs_Confidential: 0, dIs_Active: v.dIs_Active, dSort_Order: 0, strNote: v.strNote
                    }, row);
                }
            } }),

            /* ===== Tab 7: Học hàm ===== */
            tab('hh', 'Học hàm', 'fa-award', 'Academic_Rank', { tieuDe: 'Thông tin học hàm', them: 'Thêm học hàm', ten: 'học hàm',
                hoiXoa: 'Bạn có chắc chắn xóa học hàm này không?', cfg: {
                detail: function (r) { return X.g6('Get_Person_Academic_Rank_By_Id', { strId: r.ID }); },
                rowActions: [{ icon: 'fa-eye', title: 'Chi tiết', onClick: function (r) {
                    xem('Thông tin chi tiết học hàm', 'fa-award', 'Get_Person_Academic_Rank_By_Id', r, [
                        { t: 'Thông tin chung', i: [['Mã học hàm', 'ACADEMIC_RANK_CODE'], ['Tên học hàm', 'ACADEMIC_RANK_NAME']] },
                        { t: 'Quyết định công nhận', i: [['Số quyết định', 'DECISION_NO'], ['Ngày quyết định', 'DECISION_DATE'], ['Ngày công nhận', 'RECOGNITION_DATE']] },
                        { t: 'Đơn vị cấp', i: [['Tên đơn vị', 'ISSUED_BY_ORG_NAME']] },
                        { t: 'Thông tin khác', i: [['Học hàm hiện tại', function (d) { return X.coKhong(d.IS_CURRENT); }], ['Ngày hiệu lực', 'EFFECTIVE_FROM'],
                            ['Ngày hết hiệu lực', 'EFFECTIVE_TO'], ['Hiệu lực', function (d) { return X.coKhong(d.IS_ACTIVE, 'Có hiệu lực', 'Hết hiệu lực'); }], ['Ghi chú', 'NOTE']] }
                    ]);
                } }],
                columns: [
                    { title: 'Mã học hàm', prop: 'ACADEMIC_RANK_CODE' }, { title: 'Tên học hàm', prop: 'ACADEMIC_RANK_NAME' },
                    { title: 'Số quyết định', prop: 'DECISION_NO' }, { title: 'Ngày quyết định', prop: 'DECISION_DATE', cls: 'is-center' },
                    { title: 'Ngày công nhận', prop: 'RECOGNITION_DATE', cls: 'is-center' },
                    { title: 'Đơn vị cấp', prop: 'ISSUED_BY_ORG_ID_NAME' }, { title: 'Tên đơn vị', prop: 'ISSUED_BY_ORG_NAME' },
                    { title: 'Hiện tại', cls: 'is-center', render: function (r) { return tick(r.IS_CURRENT); } },
                    { title: 'Ngày hiệu lực', prop: 'EFFECTIVE_FROM', cls: 'is-center' }, { title: 'Ngày hết hiệu lực', prop: 'EFFECTIVE_TO', cls: 'is-center' },
                    { title: 'Hiệu lực', cls: 'is-center', render: hl }, { title: 'Ghi chú', prop: 'NOTE' }
                ],
                fields: [
                    lg('Thông tin chung'),
                    dm('strAcademic_Rank_Code', 'ACADEMIC_RANK_CODE', 'Mã học hàm', 'PERSON_ACADEMIC_RANK.ACADEMIC_RANK_CODE', { required: true, cols: 6 }),
                    s('strAcademic_Rank_Name', 'ACADEMIC_RANK_NAME', 'Tên học hàm', { cols: 6 }),
                    lg('Quyết định công nhận'),
                    s('strDecision_No', 'DECISION_NO', 'Số quyết định', { cols: 4 }),
                    ng('strDecision_Date', 'DECISION_DATE', 'Ngày quyết định', { cols: 4 }),
                    ng('strRecognition_Date', 'RECOGNITION_DATE', 'Ngày công nhận', { cols: 4 }),
                    lg('Đơn vị cấp'),
                    s('strIssued_By_Org_Id', 'ISSUED_BY_ORG_ID', 'Đơn vị cấp', { type: 'select', cols: 6 }),
                    s('strIssued_By_Org_Name', 'ISSUED_BY_ORG_NAME', 'Tên đơn vị', { cols: 6 }),
                    lg('Thông tin khác'),
                    { type: 'checks', span: true, items: [ck('dIs_Current', 'IS_CURRENT', 'Học hàm hiện tại'), ck('dIs_Active', 'IS_ACTIVE', 'Hiệu lực', { value: 1 })] },
                    ng('strEffective_From', 'EFFECTIVE_FROM', 'Ngày hiệu lực', { cols: 6 }),
                    ng('strEffective_To', 'EFFECTIVE_TO', 'Ngày hết hiệu lực', { cols: 6 }),
                    s('strNote', 'NOTE', 'Ghi chú', { type: 'textarea', span: true })
                ],
                onForm: function (row, c) {
                    // Đơn vị cấp: danh mục học hàm → chứng chỉ → tài liệu (fallback của gốc)
                    var dv = fo(c, 'strIssued_By_Org_Id');
                    X.dmRows('PERSON_ACADEMIC_RANK.ISSUED_BY_ORG_ID')
                        .then(function (ds) { return ds.length ? ds : X.dmRows('PERSON_CERTIFICATE.ISSUED_BY_ORG_ID'); })
                        .then(function (ds) { return ds.length ? ds : X.dmRows('PERSON_DOCUMENT.ISSUED_BY_ORG_ID'); })
                        .then(function (ds) { pat.fill(dv, ds); dat(dv, row ? row.ISSUED_BY_ORG_ID : ''); jQuery(dv).trigger('change.select2'); });
                },
                save: function (v, row) {
                    return luu('Academic_Rank', {
                        strAcademic_Rank_Code: v.strAcademic_Rank_Code, strAcademic_Rank_Name: v.strAcademic_Rank_Name,
                        strDecision_No: v.strDecision_No, strDecision_Date: v.strDecision_Date, strRecognition_Date: v.strRecognition_Date,
                        strIssued_By_Org_Id: v.strIssued_By_Org_Id, strIssued_By_Org_Name: v.strIssued_By_Org_Name,
                        dIs_Current: v.dIs_Current, dIs_Active: v.dIs_Active,
                        strEffective_From: v.strEffective_From, strEffective_To: v.strEffective_To, strNote: v.strNote
                    }, row);
                }
            } })
        ] });
    };
})();
