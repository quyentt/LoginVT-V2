/* =========================================================================
   ums.khtsn.phu — các BẢNG PHỤ của một người (đọc lên + ghi xuống) và các lời gọi tra cứu hồ sơ
   Bản gốc: kehoachtuyensinhnew.js — _getPersonAddressList / save_PersonAddress, save_PersonIden /
   _writeIden, _getFamilyList / _writeFamily, save_PersonProfile / _writeProfile, save_PersonBank /
   _writeBank, _loadPersonInvoice / _ghi_PersonInvoice, _loadNguonKhaiThac / save_HoSoDoiTacTS /
   _dtcDonRac, _ensureLopForRows / _ensureLopQLLookup, _tcGoiQLTB …
   Mọi tên tham số / action / func chép nguyên. Mọi hàm trả Promise (gốc dùng callback).
   ---------------------------------------------------------------------------
   Lời gọi:
     NS_HoSoNhanSu6_MH / PKG_CORE_HOSONHANSU_06: Get_/Ins_/Upd_Person_Address, Get_/Ins_/Upd_Person_Family,
                                                 Ins_Person_Bank_Account
     NS_HoSoNhanSu5_MH / PKG_CORE_HOSONHANSU_05: GetPersonContactByPerson_Id, GetPersonIdentifierByPerson_Id,
                                                 InsertPersonIdentifier, UpdatePersonIdentifier
     SV_NGUOIHOC_01_MH / PKG_CORE_NGUOIHOC_01:   LayTTPerson_Profile, Them_/Sua_Person_Profile, LayDSPerson_Profile,
                                                 LayDS_/Them_/Sua_PersonInvoiceInfo, LayDSNguoiHoc_All
     SV_Core_TS_HoSo_MH / PKG_CORE_TS_HOSO:      LayDS_HoSo_TS(_FULL), LayTT_HoSo_TS, LayDS_Bank_TS, Sua_Bank_TS,
                                                 LayDS_TS_DoiTacTuyenSinh, LayDS_/Them_/Sua_/Xoa_TS_HoSo_DoiTacTS
     SV_HoSoHocVien_MH / pkg_hosohocvien.LayDanhSachHoSoNhieuNganh ; KHCT_ThongTin_MH / LayDSKS_DaoTao_LopQuanLy
     Danh mục PERSON_ADDRESS.ADDRESS_TYPE_CODE, PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE,
              PERSON_FAMILY.RELATION_TYPE_CODE (lưu ID GUID — đối chiếu theo tên như gốc)
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, T = ums.khtsn;
    var P = T.phu = {};
    var e = T.e;

    var A = {
        Addr_LayDS: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AJSUzJDIy',
        Addr_Them: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy',
        Addr_Sua: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy',
        Contact: 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
        Iden_LayDS: 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vCCUkLzUoJygkMwM4ESQzMi4vHggl',
        Iden_Them: 'NS_HoSoNhanSu5_MH/CC8yJDM1ESQzMi4vCCUkLzUoJygkMwPP',
        Iden_Sua: 'NS_HoSoNhanSu5_MH/FDElIDUkESQzMi4vCCUkLzUoJygkMwPP',
        Fam_LayDS: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4HICwoLTgP',
        Fam_Them: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4HICwoLTgP',
        Fam_Sua: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4HICwoLTgP',
        Profile_LayTT: 'SV_NGUOIHOC_01_MH/DSA4FRURJDMyLi8eETMuJygtJAPP',
        Profile_Them: 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8eETMuJygtJAPP',
        Profile_Sua: 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLx4RMy4nKC0k',
        Profile_LayDS: 'SV_NGUOIHOC_01_MH/DSA4BRIRJDMyLi8eETMuJygtJAPP',
        Bank_LayDS: 'SV_Core_TS_HoSo_MH/DSA4BRIeAyAvKh4VEgPP',
        Bank_Sua: 'SV_Core_TS_HoSo_MH/EjQgHgMgLyoeFRIP',
        Bank_Them: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP',
        Inv_LayDS: 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
        Inv_Them: 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8ILzcuKCIkCC8nLgPP',
        Inv_Sua: 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLwgvNy4oIiQILycu',
        DoiTac_DM: 'SV_Core_TS_HoSo_MH/DSA4BRIeFRIeBS4oFSAiFTQ4JC8SKC8p',
        DoiTac_LayDS: 'SV_Core_TS_HoSo_MH/DSA4BRIeFRIeCS4SLh4FLigVICIVEgPP',
        DoiTac_Them: 'SV_Core_TS_HoSo_MH/FSkkLB4VEh4JLhIuHgUuKBUgIhUS',
        DoiTac_Sua: 'SV_Core_TS_HoSo_MH/EjQgHhUSHgkuEi4eBS4oFSAiFRIP',
        DoiTac_Xoa: 'SV_Core_TS_HoSo_MH/GS4gHhUSHgkuEi4eBS4oFSAiFRIP',
        HoSo_LayDS: 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEgPP',
        HoSo_LayDS_Full: 'SV_Core_TS_HoSo_MH/DSA4BRIeCS4SLh4VEh4HFA0N',
        HoSo_LayTT: 'SV_Core_TS_HoSo_MH/DSA4FRUeCS4SLh4VEgPP',
        NguoiHoc_All: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P',
        QLTB: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
        LopQL: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04'
    };
    P.A = A;
    var HS = 'PKG_CORE_TS_HOSO.';

    function goi(o) { o.silent = true; return ums.api.call(o).then(T.rows, function () { return []; }); }
    function conHieuLuc(r) { return r && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1); } // eslint-disable-line eqeqeq
    function nguoi() { return { strChucNang_Id: '', strNguoiThucHien_Id: '' }; }
    function gop(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }

    /* ---------- Danh mục loại (địa chỉ / định danh / quan hệ) ------------- */
    function timTheoTen(dt, rx) {
        var f = (dt || []).filter(function (x) { return rx.test(T.strip(x.TEN) + ' ' + T.strip(x.MA)); })[0];
        return f ? (f.ID || '') : '';
    }
    P.dmAddr = function () { return T.dmMot(T.DM.LOAI_DIACHI); };
    P.addrTypeId = function (kind, dt) { return timTheoTen(dt, kind === 'NS' ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/); };
    P.dmIden = function () { return T.dmMot(T.DM.LOAI_DINHDANH); };
    P.idenTypeId = function (dt) { return timTheoTen(dt, /CCCD|CAN CUOC/) || timTheoTen(dt, /CMND|CHUNG MINH/); };
    P.dmFam = function () { return T.dmMot(T.DM.QUANHE_GD); };
    P.famTypeId = function (kind, dt) {
        var chinh = kind === 'BO' ? ['BO', 'CHA'] : ['ME'];
        var f = (dt || []).filter(function (x) { return chinh.indexOf(T.strip(x.TEN).trim()) >= 0; })[0];
        if (f) return f.ID || '';
        return timTheoTen(dt, kind === 'BO' ? /\b(BO|CHA|FATHER)\b/ : /\b(ME|MOTHER)\b/);
    };

    /* ---------- Địa chỉ (PERSON_ADDRESS) ---------------------------------- */
    P.dsDiaChi = function (pid) {
        if (!pid) return Promise.resolve([]);
        return goi({ action: A.Addr_LayDS, func: 'PKG_CORE_HOSONHANSU_06.Get_Person_Address', strPerson_Id: pid,
            strChucNang_Id: '', strVaiTro_Id: '', strNguoiThucHien_Id: '' }).then(function (r) { return r.filter(conHieuLuc); });
    };
    P.timDiaChi = function (rows, kind, dt) {
        if (!rows || !rows.length) return null;
        var id = P.addrTypeId(kind, dt);
        var f = id && rows.filter(function (x) { return x.ADDRESS_TYPE_CODE === id; })[0];
        if (f) return f;
        var rx = kind === 'NS' ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
        return rows.filter(function (x) { return rx.test(T.strip(x.ADDRESS_TYPE_CODE_NAME || x.ADDRESS_TYPE_NAME || '')); })[0] || null;
    };
    /** blocks: [{ kind, tinh, huyen, xa, line, full, daCham, chamLine }] — upsert theo loại, chống ghi đè rỗng */
    P.ghiDiaChi = function (pid, blocks) {
        if (!pid || !blocks || !blocks.length) return Promise.resolve();
        return Promise.all([P.dmAddr(), P.dsDiaChi(pid)]).then(function (x) {
            var dt = x[0], rows = x[1];
            return Promise.all(blocks.map(function (b) {
                var typeId = P.addrTypeId(b.kind, dt);
                if (!typeId) return null;
                var old = rows.filter(function (r) { return r.ADDRESS_TYPE_CODE === typeId; })[0];
                var sua = !!(old && old.ID);
                var id = String(sua ? old.ID : ums.util.uuid()).toUpperCase();
                var giu = function (moi, cu, cham) { if (moi) return moi; if (cham) return ''; return sua ? (cu || '') : ''; };
                return ums.api.call({
                    action: sua ? A.Addr_Sua : A.Addr_Them,
                    func: 'PKG_CORE_HOSONHANSU_06.' + (sua ? 'Upd_Person_Address' : 'Ins_Person_Address'),
                    Id: id, strId: id, strChucNang_Id: '', strVaiTro_Id: '', strPerson_Id: pid,
                    strAddress_Type_Code: typeId, strAddress_Status_Code: '', strCountry_Id: '',
                    strProvince_Id: giu(b.tinh, old && old.PROVINCE_ID, b.daCham),
                    strDistrict_Id: giu(b.huyen, old && old.DISTRICT_ID, b.daCham),
                    strWard_Id: giu(b.xa, old && old.WARD_ID, b.daCham),
                    strAddress_Line1: giu(b.line, old && old.ADDRESS_LINE1, b.chamLine),
                    strAddress_Line2: '',
                    strFull_Address: giu(b.full, old && old.FULL_ADDRESS, b.daCham || b.chamLine),
                    strPostal_Code: '', dIs_Primary: b.kind === 'HK' ? 1 : 0, dIs_Verified: 0, dIs_Active: 1,
                    strEffective_From: '', strEffective_To: '', strNote: '', strNguoiThucHien_Id: '', silent: true
                }).catch(function () {});
            }));
        });
    };
    /** Cảnh báo danh mục loại địa chỉ thiếu mục (_addrWarnText) — đồng bộ nên cần danh mục đã nạp */
    P.canhBaoDiaChi = function (blocks, dt) {
        if (!dt || !dt.length) return '';
        var thieu = (blocks || []).filter(function (b) { return !P.addrTypeId(b.kind, dt); })
            .map(function (b) { return b.kind === 'NS' ? 'Nơi sinh' : 'Hộ khẩu thường trú'; });
        return thieu.length ? 'Chưa lưu được ' + thieu.join(' và ') + ': danh mục "Loại địa chỉ" (PERSON_ADDRESS.ADDRESS_TYPE_CODE) chưa khai báo mục này.' : '';
    };

    /* ---------- Liên hệ (điện thoại / email) ------------------------------ */
    P.lienHe = function (pid) {
        return goi({ action: A.Contact, func: 'PKG_CORE_HOSONHANSU_05.GetPersonContactByPerson_Id', strPerson_Id: pid,
            strChucNang_Id: '', strNguoiThucHien_Id: '' }).then(function (rs) {
            var lh = { sdt: '', email: '' };
            rs.forEach(function (it) {
                var val = it.CONTACT_VALUE || it.VALUE || '';
                if (!val) return;
                var tx = T.strip(it.CONTACT_TYPE_CODE_MA || it.MA) + '|' + T.strip(it.CONTACT_TYPE_CODE_NAME || it.CONTACT_TYPE_NAME);
                var em = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(tx), ph = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(tx);
                if (!em && !ph) {
                    if (val.indexOf('@') > -1) em = true;
                    else if (/^[\d\s+\-().]+$/.test(val) && val.replace(/\D/g, '').length >= 6) ph = true;
                }
                if (em && !lh.email) lh.email = val; else if (ph && !lh.sdt) lh.sdt = val;
            });
            return lh;
        });
    };

    /* ---------- Định danh (CCCD) ------------------------------------------- */
    P.dsDinhDanh = function (pid) {
        return goi({ action: A.Iden_LayDS, func: 'PKG_CORE_HOSONHANSU_05.GetPersonIdentifierByPerson_Id', strPerson_Id: pid,
            strChucNang_Id: '', strNguoiThucHien_Id: '' });
    };
    P.timCCCD = function (rows) {
        return (rows || []).filter(function (r) {
            return /CCCD|CAN CUOC|CMND/.test(T.strip(r.IDENTIFIER_TYPE_CODE_MA || r.MA) + ' ' + T.strip(r.IDENTIFIER_TYPE_CODE_NAME || r.IDENTIFIER_TYPE_NAME));
        })[0] || (rows || []).filter(function (r) { return r.IS_PRIMARY == 1; })[0] || (rows || [])[0] || null; // eslint-disable-line eqeqeq
    };
    /** i = { so, ngayCap (ISO như ô type=date của gốc), noiCap } */
    P.ghiDinhDanh = function (pid, i) {
        if (!pid || !i) return Promise.resolve();
        return Promise.all([P.dmIden(), P.dsDinhDanh(pid)]).then(function (x) {
            var old = P.timCCCD(x[1]);
            var oldId = old ? T.pickLoose(old, ['ID', 'PERSON_IDENTIFIER_ID']) : '';
            var typeId = (old && old.IDENTIFIER_TYPE_CODE) || P.idenTypeId(x[0]);
            if (!typeId) return null;
            var o = {
                action: oldId ? A.Iden_Sua : A.Iden_Them,
                func: 'PKG_CORE_HOSONHANSU_05.' + (oldId ? 'UpdatePersonIdentifier' : 'InsertPersonIdentifier'),
                strChucNang_Id: '', strPersonId: pid, strIdentifierTypeCode: typeId, strIdentifierNo: i.so,
                strIssueDate: i.ngayCap, strIssuePlace: i.noiCap, dIsPrimary: 1, strEffectiveFrom: '', strEffectiveTo: '',
                strNguoiThucHien_Id: '', silent: true
            };
            if (oldId) o.strId = oldId;
            return ums.api.call(o).catch(function () {});
        });
    };

    /* ---------- Gia đình (PERSON_FAMILY) --------------------------------- */
    P.dsGiaDinh = function (pid) {
        if (!pid) return Promise.resolve([]);
        return goi({ action: A.Fam_LayDS, func: 'PKG_CORE_HOSONHANSU_06.Get_Person_Family', strChucNang_Id: '', strVaiTro_Id: '',
            strNguoiThucHien_Id: '', strPerson_Id: pid }).then(function (r) { return r.filter(conHieuLuc); });
    };
    P.timGiaDinh = function (rows, kind, dt) {
        var id = P.famTypeId(kind, dt);
        var hit = id && rows.filter(function (r) { return r.RELATION_TYPE_CODE === id; })[0];
        if (hit) return hit;
        var rx = kind === 'BO' ? /\b(BO|CHA|FATHER)\b/ : /\b(ME|MOTHER)\b/;
        return rows.filter(function (r) { return rx.test(T.strip(r.RELATION_TYPE_CODE_NAME || r.RELATION_TYPE_NAME || '')); })[0];
    };
    /** list = [{ kind: 'BO'|'ME', hoTen, namSinh, noiO, sdt }] */
    P.ghiGiaDinh = function (pid, list) {
        if (!pid || !list || !list.length) return Promise.resolve();
        return Promise.all([P.dmFam(), P.dsGiaDinh(pid)]).then(function (x) {
            return Promise.all(list.map(function (f) {
                var typeId = P.famTypeId(f.kind, x[0]);
                if (!typeId) return null;
                var old = P.timGiaDinh(x[1], f.kind, x[0]) || {};
                var oldId = T.pickLoose(old, ['ID', 'PERSON_FAMILY_ID']);
                var noiO = f.noiO || T.pickLoose(old, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']);
                var nsRaw = f.namSinh || T.pickLoose(old, ['BIRTH_YEAR', 'NAMSINH']);
                var ns = nsRaw !== '' ? Number(nsRaw) : NaN;
                var o = {
                    action: oldId ? A.Fam_Sua : A.Fam_Them,
                    func: 'PKG_CORE_HOSONHANSU_06.' + (oldId ? 'Upd_Person_Family' : 'Ins_Person_Family'),
                    strChucNang_Id: '', strVaiTro_Id: '', strPerson_Id: pid, strRelation_Type_Code: typeId, strRelation_Status_Code: '',
                    strFull_Name: f.hoTen, strLast_Name: '', strMiddle_Name: '', strFirst_Name: '', strGender_Id: '',
                    strDate_Of_Birth: '', strDob_Precision_Level: '', dBirth_Day: null, dBirth_Month: null,
                    dBirth_Year: isNaN(ns) ? null : ns, strOccupation: '', strWorkplace: '', strPhone_Number: f.sdt, strEmail: '',
                    strAddress_Text: noiO, dIs_Dependent: 0, dIs_Emergency_Contact: 0, dIs_Primary_Contact: f.kind === 'BO' ? 1 : 0,
                    dIs_Active: 1, strEffective_From: '', strEffective_To: '', strNote: '', strNguoiThucHien_Id: '', silent: true
                };
                if (oldId) o.strId = oldId;
                return ums.api.call(o).catch(function () {});
            }));
        });
    };

    /* ---------- Hồ sơ cá nhân (dân tộc / tôn giáo) ------------------------ */
    P.layProfile = function (pid) {
        return goi({ action: A.Profile_LayTT, func: 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile', strId: '', strPerson_Id: pid,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '' }).then(function (r) { return r[0] || null; });
    };
    P.dsProfile = function (ids) {
        return goi({ action: A.Profile_LayDS, func: 'PKG_CORE_NGUOIHOC_01.LayDSPerson_Profile', strPerson_Ids: ids.join(','),
            strEthnicity_Id: '', strReligion_Id: '', strPolicyObject_Id: '', dIsActive: 1,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '' });
    };
    /** p = { danToc, tonGiao } — giữ các cột khác của PERSON_PROFILE như cũ */
    P.ghiProfile = function (pid, p) {
        if (!pid || !p) return Promise.resolve();
        return P.layProfile(pid).then(function (old) {
            old = old || {};
            var oldId = T.pickLoose(old, ['PERSON_PROFILE_ID', 'PROFILE_ID', 'ID']);
            var k = function (v) { return v === null || v === undefined ? '' : v; };
            var o = {
                strReligion_Id: p.tonGiao, strEthnicity_Id: p.danToc,
                strFamilyBackground_Id: k(old.FAMILY_BACKGROUND_ID), strMaritalStatus_Id: k(old.MARITAL_STATUS_ID),
                strPolicyObject_Id: k(old.POLICY_OBJECT_ID), strBloodType_Code: k(old.BLOOD_TYPE_CODE),
                strUnionJoinDate: k(old.UNION_JOIN_DATE), strPartyJoinDate: k(old.PARTY_JOIN_DATE), strPartyOfficialDate: k(old.PARTY_OFFICIAL_DATE),
                dIsActive: 1, strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '', silent: true
            };
            if (oldId) { o.action = A.Profile_Sua; o.func = 'PKG_CORE_NGUOIHOC_01.Sua_Person_Profile'; o.strId = oldId; }
            else { o.action = A.Profile_Them; o.func = 'PKG_CORE_NGUOIHOC_01.Them_Person_Profile'; o.strPerson_Id = pid; }
            return ums.api.call(o).catch(function () {});
        });
    };

    /* ---------- Tài khoản ngân hàng --------------------------------------- */
    P.dsBank = function (pid) {
        return goi({ action: A.Bank_LayDS, func: HS + 'LayDS_Bank_TS', strCorePerson_Id: pid,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'XEM' });
    };
    P.bankChinh = function (rows) {
        return (rows || []).filter(conHieuLuc).sort(function (x, y) { return (y.IS_PRIMARY == 1 ? 1 : 0) - (x.IS_PRIMARY == 1 ? 1 : 0); })[0] || null; // eslint-disable-line eqeqeq
    };
    /** b = { loai, nganHang, soTK, chuTK, ghiChu } — có bản ghi → Sua_Bank_TS, chưa có → Ins_Person_Bank_Account */
    P.ghiBank = function (pid, b) {
        if (!pid || !b) return Promise.resolve();
        return P.dsBank(pid).then(function (rows) {
            var old = P.bankChinh(rows);
            var oldId = old ? T.pickLoose(old, ['ID', 'PERSONBANK_ID', 'PERSON_BANK_ID']) : '';
            var o = oldId ? {
                action: A.Bank_Sua, func: HS + 'Sua_Bank_TS', strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '',
                strHanhDong_Code: 'SUA', strPersonBank_Id: oldId, strPersonBank_HinhThucTT: b.loai, strPersonBank_TenNganHang: b.nganHang,
                strPersonBank_SoTaiKhoan: b.soTK, strPersonBank_ChuTaiKhoan: b.chuTK, strPersonBank_GhiChu: b.ghiChu
            } : {
                action: A.Bank_Them, func: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Bank_Account', strChucNang_Id: '', strVaiTro_Id: '',
                strPerson_Id: pid, strAccount_Type_Code: b.loai, strAccount_Status_Code: '', strBank_Id: '', strBank_Code: '',
                strBank_Name: b.nganHang, strBranch_Id: '', strBranch_Code: '', strBranch_Name: '', strAccount_Number: b.soTK,
                strAccount_Name: b.chuTK, strAccount_Currency_Code: '', dIs_Primary: 1, dIs_Payroll_Default: 0, dIs_Verified: 0,
                dIs_Active: 1, strEffective_From: '', strEffective_To: '', strNote: b.ghiChu, strNguoiThucHien_Id: ''
            };
            o.silent = true;
            return ums.api.call(o).catch(function () {});
        });
    };

    /* ---------- Thông tin xuất hoá đơn (PERSON_INVOICE_INFO) -------------- */
    P.dsHoaDon = function (pid) {
        return goi({ action: A.Inv_LayDS, func: 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo', strPerson_Id: pid, dChiHienHanh: 1,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '' });
    };
    /** Đối tượng hoá đơn là cá nhân (CN) hay tổ chức (TC) — nhận ID hoặc mã chữ (_loaiHD_TuGiaTri) */
    P.loaiHD = function (v, dtDoiTuong) {
        if (!v) return '';
        var raw = String(v).trim(), text = raw;
        (dtDoiTuong || []).forEach(function (r) {
            var id = String(T.id(r)).trim(), ma = String(r.MA || r.Ma || '').trim();
            if (id === raw || ma === raw) text += ' ' + ma + ' ' + (r.TEN || r.Ten || '');
        });
        var s = T.strip(text).replace(/[^A-Z]/g, '');
        if (/CANHAN|CANHN/.test(s)) return 'CN';
        if (/TOCHUC|DONVI|DOANHNGHIEP|CONGTY/.test(s)) return 'TC';
        return '';
    };
    /** s = { tenDonVi, nguoiMua, diaChi, mst, maQHNS, email, sdt, doiTuong, ungVien: [ID, mã chữ] } — upsert thật
        (luôn tra bản ghi hiện hành trước). BE chê BUYER_TYPE_LOAI thì gửi lại bằng giá trị ứng viên kế tiếp. */
    P.ghiHoaDon = function (pid, s, dtDoiTuong) {
        if (!pid || !s) return Promise.resolve('');
        return P.dsHoaDon(pid).then(function (arr) {
            var r = arr[0];
            var invId = r ? (T.pickLoose(r, ['ID', 'PERSON_INVOICE_INFO_ID', 'INVOICE_ID']) || '') : '';
            if (!(s.tenDonVi || s.nguoiMua || s.diaChi || s.mst || s.maQHNS || s.email || s.sdt || s.doiTuong) && !invId) return '';
            var sua = !!(invId && String(invId).length === 32);
            var o = {
                action: sua ? A.Inv_Sua : A.Inv_Them,
                func: sua ? 'PKG_CORE_NGUOIHOC_01.Sua_PersonInvoiceInfo' : 'PKG_CORE_NGUOIHOC_01.Them_PersonInvoiceInfo',
                strBuyer_Type_Loai: s.doiTuong, strBuyer_Ref_Type: '', strBuyer_Ref_Id: '',
                strBuyer_Name: P.loaiHD(s.doiTuong, dtDoiTuong) === 'CN' ? (s.nguoiMua || s.tenDonVi) : (s.tenDonVi || s.nguoiMua),
                strBuyer_Addr: s.diaChi, strBuyer_Tax_Mst: s.mst, strBuyer_Budget_Qhns: s.maQHNS, strBuyer_Email: s.email,
                strBuyer_Phone: s.sdt, strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
            };
            if (sua) o.strId = invId; else o.strPerson_Id = pid;
            var ung = (s.ungVien && s.ungVien.length) ? s.ungVien.slice() : [s.doiTuong];
            var lan = 0;
            function gui() {
                o.strBuyer_Type_Loai = ung[lan];
                return ums.api.call(o).then(function () { return ''; }, function (err) {
                    if (/BUYER_TYPE_LOAI/i.test(err.message || '') && lan + 1 < ung.length) { lan++; return gui(); }
                    return 'Lưu thông tin hóa đơn lỗi: ' + (err.message || '');
                });
            }
            return gui();
        });
    };

    /* ---------- Nguồn khai thác (đối tác tuyển sinh) ---------------------- */
    var pDT = null;
    P.dmDoiTac = function () {
        if (!pDT) pDT = goi({ action: A.DoiTac_DM, func: HS + 'LayDS_TS_DoiTacTuyenSinh', strTuKhoa: '', strNguoiThucHien_Id: '' });
        return pDT;
    };
    /** Họ tên đầy đủ của đối tác (cột TEN chỉ là tên riêng → ghép Họ + Đệm + Tên như gốc) */
    P.hoTenDoiTac = function (d) {
        var full = T.pick(d, ['HOTEN', 'HO_TEN', 'HOVATEN', 'HO_VA_TEN', 'TENDAYDU', 'TEN_DAYDU', 'FULL_NAME', 'FULLNAME', 'HoTen', 'FullName']);
        if (full) return String(full).trim();
        return [T.pick(d, ['HO', 'LAST_NAME', 'Ho']), T.pick(d, ['HODEM', 'HO_DEM', 'TENDEM', 'TEN_DEM', 'DEM', 'MIDDLE_NAME', 'HoDem']), T.pick(d, ['TEN', 'FIRST_NAME', 'Ten'])]
            .filter(function (x) { return x; }).join(' ').replace(/\s+/g, ' ').trim();
    };
    P.nhanDoiTac = function (d) {
        var ten = P.hoTenDoiTac(d) || T.pick(d, ['TEN_HIENTHI', 'TEN_DONVI', 'TENDONVI']);
        var ma = T.pick(d, ['MA', 'Ma', 'MA_HIENTHI']);
        return ten && ma && ma !== ten ? ten + ' (' + ma + ')' : (ten || ma || T.id(d));
    };
    P.locDoiTac = function (khId, dotId, pid) {
        return { action: A.DoiTac_LayDS, func: HS + 'LayDS_TS_HoSo_DoiTacTS', strHoSo_KH_TS_Id: khId || '', strHoSo_KH_TS_Dot_Id: dotId || '',
            // CỐ Ý RỖNG như gốc: nhánh lọc theo nguyện vọng làm proc lỗi ORA-24338 → lọc tại máy (locTheoNV)
            strNguyenVong_DauRa_Id: '', strCore_Person_Id: pid || '', strTS_DoiTacTuyenSinh_Id: '',
            dIs_Primary: null, dIs_Current: null, dIs_Active: 1, strTuKhoa: '', strNguoiThucHien_Id: '' };
    };
    P.dsHoSoDoiTac = function (khId, dotId, pid) { return goi(P.locDoiTac(khId, dotId, pid)); };
    P.dtcRowId = function (r) {
        if (!r) return '';
        var id = T.pickLoose(r, ['ID', 'TS_HOSO_DOITACTS_ID', 'HOSO_DOITACTS_ID', 'HOSO_DOITAC_ID', 'TS_HOSO_DOITAC_ID']);
        if (id) return id;
        var k = Object.keys(r).filter(function (x) {
            var K2 = x.toUpperCase();
            return K2.indexOf('DOITACTUYENSINH') < 0 && K2.indexOf('PERSON') < 0 && /_ID$/.test(K2) && K2.indexOf('HOSO') >= 0 && K2.indexOf('DOITAC') >= 0 && r[x];
        })[0];
        return k ? r[k] : '';
    };
    P.dtcMoiNhat = function (rows) {
        if (!rows || !rows.length) return null;
        if (rows.length === 1) return rows[0];
        var moc = function (r) {
            var s = String(T.pickLoose(r, ['NGAYTAO', 'NGAY_TAO']) || '');
            if (/^\d{8,14}$/.test(s)) return parseInt(s.substring(0, 14), 10);
            var g = String(T.pickLoose(r, ['NGAY_GHI_NHAN', 'NGAYGHINHAN']) || '').match(/^(\d{2})\/(\d{2})\/(\d{4})/);
            return g ? parseInt(g[3] + g[2] + g[1] + '000000', 10) : 0;
        };
        var ut = rows.filter(function (r) { return String(T.pickLoose(r, ['IS_CURRENT', 'ISCURRENT']) || '') === '1'; });
        var ds = ut.length ? ut : rows, best = ds[ds.length - 1], bm = moc(best);
        ds.forEach(function (r) { var m = moc(r); if (m >= bm) { best = r; bm = m; } });
        return best;
    };
    P.locTheoNV = function (rows, nv) {
        if (!nv || !rows || !rows.length) return rows || [];
        var k = rows.filter(function (r) { var v = T.pickLoose(r, ['NGUYENVONG_DAURA_ID', 'TS_KEHOACH_DAU_RA_ID', 'DAURA_ID']); return !v || String(v) === String(nv); });
        return k.length ? k : rows;
    };
    P.xoaDoiTac = function (rowId) {
        if (!rowId) return Promise.resolve();
        return ums.api.call({ action: A.DoiTac_Xoa, func: HS + 'Xoa_TS_HoSo_DoiTacTS', strId: rowId, strNguoiThucHien_Id: '', silent: true }).catch(function () {});
    };
    /** Sau khi ghi: đọc lại, GIỮ bản mới nhất, xoá dòng dư (_dtcDonRac) */
    P.donRacDoiTac = function (khId, dotId, pid, nv) {
        return P.dsHoSoDoiTac(khId, dotId, pid).then(function (rows) {
            rows = P.locTheoNV(rows, nv);
            if (rows.length <= 1) return;
            var giu = P.dtcRowId(P.dtcMoiNhat(rows));
            return Promise.all(rows.map(function (r) { var id = P.dtcRowId(r); return id && id !== giu ? P.xoaDoiTac(id) : null; }));
        });
    };
    /** Ghi nhận nguồn khai thác (save_HoSoDoiTacTS). cu = { rowId, rowIds, partnerId, ghiChu, nguonId } của ĐÚNG người này.
        Trả chuỗi lỗi ('' = ổn). */
    P.ghiDoiTac = function (o) {
        var cu = o.cu || {};
        if (!o.doiTacId) {
            var ds = (cu.rowIds || []).slice();
            if (cu.rowId && ds.indexOf(cu.rowId) < 0) ds.push(cu.rowId);
            return Promise.all(ds.map(P.xoaDoiTac)).then(function () { return ''; });
        }
        if (!o.pid) return Promise.resolve('');
        if (cu.rowId && o.doiTacId === cu.partnerId && (o.ghiChu || '') === (cu.ghiChu || '')) return Promise.resolve('');
        if (cu.rowId) {
            return ums.api.call({ action: A.DoiTac_Sua, func: HS + 'Sua_TS_HoSo_DoiTacTS', strId: cu.rowId, strTS_HoSo_Nguon_Id: cu.nguonId || '',
                strCore_Person_Id: o.pid, strTS_DoiTacTuyenSinh_Id: o.doiTacId, strNgay_Ghi_Nhan: T.homNay(), dIs_Primary: 1, dIs_Current: 1,
                dIs_Active: 1, strNguon_Ghi_Nhan_Code: '', strNguoi_Ghi_Nhan_Id: ums.session.userId, strGhiChu: o.ghiChu, strNguoiThucHien_Id: '', silent: true
            }).then(function () { return ''; }, function (err) { return 'Cập nhật nguồn khai thác lỗi: ' + err.message; });
        }
        return ums.api.call({ action: A.DoiTac_Them, func: HS + 'Them_TS_HoSo_DoiTacTS', strId: '',
            strHoSo_KH_TS_Id: o.khId || '', strHoSo_KH_TS_Dot_Id: o.dotId || '', strNguyenVong_DauRa_Id: o.nv || '',
            strCore_Person_Id: o.pid, strTS_DoiTacTuyenSinh_Id: o.doiTacId, strNgay_Ghi_Nhan: T.homNay(), dIs_Primary: 1, dIs_Current: 1,
            strNguon_Ghi_Nhan_Code: '', strNguoi_Ghi_Nhan_Id: ums.session.userId, strGhiChu: o.ghiChu, strNguoiThucHien_Id: '', silent: true
        }).then(function () {
            return P.donRacDoiTac(o.khId, o.dotId, o.pid, o.nv).then(function () { return ''; });
        }, function (err) {
            var thieu = [];
            if (!o.khId) thieu.push('Kế hoạch'); if (!o.dotId) thieu.push('Đợt tuyển sinh');
            if (!o.nv) thieu.push('Nguyện vọng đầu ra'); if (!o.pid) thieu.push('Mã người học');
            return 'Ghi nhận nguồn khai thác lỗi: ' + err.message + (thieu.length ? ' — đang thiếu: ' + thieu.join(', ') + ' (tab Trúng tuyển)' : '');
        });
    };

    /* ---------- Hồ sơ tuyển sinh ------------------------------------------ */
    /** LayDS_HoSo_TS — p: { tuKhoa, kh, dot, full } */
    P.dsHoSoTS = function (p) {
        var o = {
            action: p.full ? A.HoSo_LayDS_Full : A.HoSo_LayDS, func: HS + (p.full ? 'LayDS_HoSo_TS_FULL' : 'LayDS_HoSo_TS'),
            strTuKhoa: p.tuKhoa || '', strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'XEM',
            strHoSo_KH_TS_Id: p.kh || '', strHoSo_KH_TS_Dot_Id: p.dot || '', strHoSo_KH_Dot_PT_Id: '', strNguyenVong_DauRa_Id: '',
            strHoSo_KetQuaCode: '', strHoSo_TuNgay: '', strHoSo_DenNgay: ''
        };
        if (p.lopDK) o.strDaoTao_LopQuanLy_DuKien = '';
        if (p.pageSize) { o.pageIndex = 1; o.pageSize = p.pageSize; }
        return o;
    };
    P.layTTHoSo = function (hosoId) {
        return goi({ action: A.HoSo_LayTT, func: HS + 'LayTT_HoSo_TS', strHoSo_Id: hosoId,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'XEM' }).then(function (r) { return r[0] || null; });
    };

    /* ---------- Người học / lớp quản lý ----------------------------------- */
    P.nguoiHocAll = function (extra, boQua) {
        return goi(gop({ action: A.NguoiHoc_All, func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All', strTuKhoa: '', strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: boQua ? 200 : 20, strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '',
            strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '', strDaoTao_KhoaQuanLy_Id: '',
            strDaoTao_LopQuanLy_Id: '', strStudyStatus_Ids: '', dIsPrimary: '', dBoQuaPhamVi: boQua ? 1 : 0 }, extra || {}));
    };
    /** pkg_hosohocvien.LayDanhSachHoSoNhieuNganh (proc "Quản lý toàn bộ") — đổi tên cột về dạng người học */
    P.qltb = function (loc) {
        return goi(gop({ action: A.QLTB, func: 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh', strTuKhoa: '', strKhoaQuanLy_Id: '',
            strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '', strNamNhapHoc: '',
            strTrangThaiNguoiHoc_Id: '', strChucNang_Id: '', strNguoiTao_Id: '', strNgayBatDau: '', strNgayKetThuc: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 500 }, loc || {})).then(function (rows) {
            return rows.map(function (r) {
                return { PERSON_ID: r.QLSV_NGUOIHOC_ID || '', STUDY_ID: r.ID || '',
                    FULL_NAME: ((r.QLSV_NGUOIHOC_HODEM || '') + ' ' + (r.QLSV_NGUOIHOC_TEN || '')).trim(),
                    NGAYSINH: r.QLSV_NGUOIHOC_NGAYSINH || '', MASO: r.QLSV_NGUOIHOC_MASO || '',
                    DAOTAO_HEDAOTAO_TEN: r.DAOTAO_HEDAOTAO_TEN || '', DAOTAO_KHOADAOTAO_TEN: r.DAOTAO_KHOADAOTAO_TEN || '',
                    DAOTAO_CHUONGTRINH_TEN: r.DAOTAO_CHUONGTRINH_TEN || '', DAOTAO_LOPQUANLY_ID: r.DAOTAO_LOPQUANLY_ID || '',
                    DAOTAO_LOPQUANLY_TEN: r.DAOTAO_LOPQUANLY_MA || r.DAOTAO_LOPQUANLY_TEN || '',
                    QLSV_TRANGTHAINGUOIHOC_TEN: r.QLSV_TRANGTHAINGUOIHOC_TEN || '' };
            });
        });
    };
    var pLop = null;
    P.lopQL = function () {
        if (!pLop) {
            pLop = goi({ action: A.LopQL, func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', strTuKhoa: '', strDaoTao_CoSoDaoTao_Id: '',
                strDaoTao_KhoaDaoTao_Id: '', strDaoTao_Nganh_Id: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LoaiLop_Id: '',
                strDaoTao_ToChucCT_Id: '', dLopMoNganh2: '', strNhomlop_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (rows) {
                var m = {};
                rows.forEach(function (r) { var id = T.id(r); if (id) m[String(id).trim()] = { ma: r.MA || r.Ma || '', ten: r.TEN || r.Ten || '' }; });
                return m;
            });
        }
        return pLop;
    };
    /** Lớp của những hồ sơ ĐÃ tạo hồ sơ học tập (INTAKE_ISSTUDYCREATED = 1), tra LayDSNguoiHoc_All theo CCCD / họ tên */
    P.lopSV = {};
    P.dsLopQL = null;
    P.ensureLop = function (rows) {
        var viec = [], can = [];
        (rows || []).forEach(function (d) {
            if (String(T.pick(d, ['INTAKE_ISSTUDYCREATED'])) !== '1') return;
            var pid = T.pid(d);
            if (!pid || (pid in P.lopSV) || can.indexOf(pid) >= 0) return;
            can.push(pid);
            var kw = T.pick(d, ['PERSONIDEN_SOCCCD', 'SOCCCD', 'CCCD']) || T.pick(d, ['COREPERSON_HOTEN', 'HOTEN']);
            viec.push(function () {
                return P.nguoiHocAll({ strTuKhoa: kw || '' }).then(function (rs) {
                    var r = rs.filter(function (x) { return T.pick(x, ['CORE_PERSON_ID', 'COREPERSON_ID', 'PERSON_ID']) === pid; })[0] || rs[0];
                    P.lopSV[pid] = r ? { ma: T.pick(r, ['DAOTAO_LOPQUANLY_MA', 'LOPQUANLY_MA', 'LOP_MA']),
                        ten: T.pick(r, ['DAOTAO_LOPQUANLY_TEN', 'QLSV_NGUOIHOC_LOPQUANLY_TEN', 'LOP_TEN', 'LOP']),
                        id: T.pick(r, ['DAOTAO_LOPQUANLY_ID', 'LOPQUANLY_ID']) } : { ma: '', ten: '', id: '' };
                });
            });
        });
        if (!viec.length) return Promise.resolve(false);
        return T.hangDoi(viec, 6).then(function () {
            var canMap = can.some(function (p) { var o = P.lopSV[p]; return o && !o.ma && !o.ten && o.id; });
            return canMap ? P.lopQL().then(function (m) { P.dsLopQL = m; return true; }) : true;
        });
    };
    P.lopCua = function (d) {
        var laId = function (v) { return String(e(v)).trim().length === 32; };
        var tra = function (id) { var o = (P.dsLopQL || {})[String(id).trim()]; return o ? (o.ma || o.ten || '') : ''; };
        var v = T.pick(d, ['INTAKE_LOP_MA', 'DAOTAO_LOPQUANLY_MA', 'LOPQUANLY_MA', 'LOP_QUANLY_MA', 'MA_LOP', 'MaLop',
            'DAOTAO_LOPQUANLY_DUKIEN_MA', 'LOPQUANLY_DUKIEN_MA', 'DAOTAO_LOPQUANLY_TEN', 'LOPQUANLY_TEN', 'TEN_LOP']);
        if (v) return laId(v) ? tra(v) : v;
        var o = P.lopSV[T.pid(d)];
        if (o) { var g = o.ma || o.ten || (o.id ? tra(o.id) : ''); if (g) return g; }
        if (String(T.pick(d, ['INTAKE_ISSTUDYCREATED'])) === '0') return 'Chưa phân lớp';
        return '';
    };
})();
