/* =========================================================================
   hoatdong/DaQHHT — phần dùng chung giữa hộp "Hồ sơ sinh viên" và tab
   "Khởi tạo định danh mới": danh mục, khối đầu hồ sơ, biểu mẫu "Thông tin
   cơ bản" và "Thông tin hồ sơ - chính sách".
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, mã hoá):
       NS_HoSoNhanSu5_MH · PKG_CORE_HOSONHANSU_05.UpdateCorePerson / InsertCorePerson
           strFullName, strLastName, strMiddleName, strFirstName, strDateOfBirth,
           strDobPrecisionLevel '', dBirthDay/Month/Year (tách từ dd/mm/yyyy), strGenderId,
           strProfileStatusId '', strPortraitFileId '', strContext_Code 'STUDENT',
           strInitial_ConText_Code 'STUDENT', strCreated_Source_Code 'INTERNAL_FORM'
           (+ strId, strPerson_Id khi CẬP NHẬT)
       SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile / Them_ / Sua_ / Xoa_Person_Profile
   Danh mục: NS.GITI, NS.TOGI, NS.DATO, NS.THANHPHANGIADINH, NS.TINHTRANGHONNHAN,
   QLSV.DOITUONG, KHCT.HTDT, CORE_PERSON_STUDY_TRACK.STUDY_RELATION_TYPE,
   CORE_PERSON_STUDY_TRACK.SOURCE_TYPE, CORE_PERSON_STUDY.CHANGE_TYPE, QLSV.TRANGTHAI.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var qhht = ums.qhht = ums.qhht || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    qhht.e = e; qhht.arr = arr;
    /** Giá trị đầu tiên khác rỗng — thay chuỗi `a || b || c` của gốc */
    qhht.lay = function (r, ks) { r = r || {}; for (var i = 0; i < ks.length; i++) { var v = r[ks[i]]; if (v !== null && v !== undefined && v !== '') return v; } return ''; };
    var lay = qhht.lay;
    qhht.personId = function (r) { return lay(r, ['CORE_PERSON_ID', 'PERSON_ID']); };
    qhht.chung = function () { return { strNguoiThucHien_Id: uid(), strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '' }; };
    var NH = 'SV_NGUOIHOC_01_MH/', P = 'PKG_CORE_NGUOIHOC_01.';

    /* ---------- Danh mục (nạp một lần) ------------------------------------ */
    var MA = { gioiTinh: 'NS.GITI', tonGiao: 'NS.TOGI', danToc: 'NS.DATO', hoanCanh: 'NS.THANHPHANGIADINH', honNhan: 'NS.TINHTRANGHONNHAN',
        doiTuong: 'QLSV.DOITUONG', hinhThucHoc: 'KHCT.HTDT', dienHoc: 'CORE_PERSON_STUDY_TRACK.STUDY_RELATION_TYPE',
        loaiNguon: 'CORE_PERSON_STUDY_TRACK.SOURCE_TYPE', loaiTiepNhan: 'CORE_PERSON_STUDY.CHANGE_TYPE', trangThai: 'QLSV.TRANGTHAI' };
    var dmHua = null;
    qhht.dm = function () {
        if (dmHua) return dmHua;
        var keys = Object.keys(MA), o = {};
        dmHua = Promise.all(keys.map(function (k) { return ums.api.dm(MA[k]).then(function (d) { o[k] = d || []; }).catch(function () { o[k] = []; }); }))
            .then(function () { return o; });
        return dmHua;
    };
    qhht.opt = function (ds, chon, dau) {
        return '<option value="">' + esc(dau || '') + '</option>' + (ds || []).map(function (x) {
            return '<option value="' + esc(x.ID) + '"' + (String(x.ID) === String(e(chon)) && chon !== '' ? ' selected' : '') + '>' + esc(e(x.TEN)) + '</option>';
        }).join('');
    };
    function tenCua(sel) { return sel && sel.value ? sel.options[sel.selectedIndex].text : ''; }
    qhht.tenCua = tenCua;

    /* ---------- Khối đầu hồ sơ (_buildViewHeader) --------------------------- */
    qhht.dauHoSo = function (r) {
        function o2(n, v) { return '<div><span>' + esc(n) + ':</span> <b>' + (v ? esc(v) : '—') + '</b></div>'; }
        var lop = lay(r, ['LOPQUANLY_TEN', 'LOPQUANLY_MA']), ct = e(r.TENCHUONGTRINH), tt = lay(r, ['STUDY_STATUS_TEN', 'TRANGTHAI_TEN']);
        return '<div class="qhht-dau"><div class="qhht-dau__ten">' + esc(lay(r, ['FULL_NAME', 'HO_TEN', 'SINHVIEN_TENDAYDU']) || 'Chưa có tên') + '</div><div class="qhht-dau__o">' +
            o2('Mã NH', lay(r, ['MA_NGUOIHOC_CHINH', 'MA_NGUOIHOC_PHU', 'MA_NGUOI_HOC'])) + o2('CCCD', lay(r, ['DINHDANH_CHINH_SO', 'IDENTIFIER_NO', 'CCCD'])) +
            o2('Ngày sinh', lay(r, ['NGAYSINH_DD_MM_YYYY', 'NGAY_SINH', 'DATE_OF_BIRTH'])) + o2('Giới tính', lay(r, ['GIOITINH_TEN', 'GIOI_TINH_TEN'])) +
            (lop || e(r.KHOAQUANLY_TEN) ? o2('Lớp', lop) + o2('Khoa quản lý', e(r.KHOAQUANLY_TEN)) : '') +
            (ct || e(r.TENHEDAOTAO) ? o2('Chương trình', ct) + o2('Hệ đào tạo', e(r.TENHEDAOTAO)) : '') +
            (e(r.TENKHOA) ? o2('Khóa học', e(r.TENKHOA)) : '') + (e(r.EMAIL) ? o2('Email', e(r.EMAIL)) : '') +
            (tt ? '<div><span>Trạng thái:</span> <span class="ums-badge ums-badge--info">' + esc(tt) + '</span></div>' : '') + '</div></div>';
    };

    /* ---------- Biểu mẫu "Thông tin cơ bản" --------------------------------- */
    /* o = { dm, them: bool (InsertCorePerson), xacNhan: bool (hộp hỏi lại chi tiết), huy(), sauLuu(data) } */
    qhht.coBan = function (host, r, o) {
        r = r || {};
        var gt = lay(r, ['GIOI_TINH_ID', 'GENDER_ID']);
        host.innerHTML = '<div class="ums-grid ums-grid--12">' +
            '<div style="grid-column:span 4">' + ui.field('Mã người học', '<input class="ums-input" disabled value="' + esc(lay(r, ['MA_NGUOI_HOC', 'MA_NGUOIHOC_CHINH'])) + '">') + '</div>' +
            '<div style="grid-column:span 8">' + ui.field('Họ và tên đầy đủ', '<input class="ums-input" data-cb="full" placeholder="VD: Nguyễn Văn An" value="' + esc(lay(r, ['FULL_NAME', 'HO_TEN'])) + '" autocomplete="off">', { required: true }) + '</div>' +
            '<div style="grid-column:span 4">' + ui.field('Họ', '<input class="ums-input" data-cb="ho" value="' + esc(e(r.LAST_NAME)) + '" autocomplete="off">') + '</div>' +
            '<div style="grid-column:span 4">' + ui.field('Tên đệm', '<input class="ums-input" data-cb="dem" value="' + esc(e(r.MIDDLE_NAME)) + '" autocomplete="off">') + '</div>' +
            '<div style="grid-column:span 4">' + ui.field('Tên', '<input class="ums-input" data-cb="ten" value="' + esc(e(r.FIRST_NAME)) + '" autocomplete="off">') + '</div>' +
            '<div style="grid-column:span 6">' + ui.field('Ngày sinh', '<input class="ums-input" data-cb="ns" data-date placeholder="dd/mm/yyyy" value="' + esc(lay(r, ['NGAYSINH_DD_MM_YYYY', 'NGAY_SINH', 'DATE_OF_BIRTH'])) + '" autocomplete="off">') + '</div>' +
            '<div style="grid-column:span 6">' + ui.field('Giới tính', '<select class="ums-select" data-cb="gt" data-ph="Chọn giới tính">' + qhht.opt(o.dm.gioiTinh, gt, '') + '</select>') + '</div>' +
            '</div><div class="ums-row ums-row--end ums-u-mt-3">' + (o.huy ? ui.btn('close', { text: 'Hủy', attr: { 'data-cba': 'huy' } }) : '') +
            ui.btn('save', { text: 'Lưu thông tin cơ bản', attr: { 'data-cba': 'luu' } }) + '</div>';
        ui.enhance(host);
        function q(k) { return host.querySelector('[data-cb="' + k + '"]'); }
        host.onclick = function (ev) {          // gán (không cộng dồn) — biểu mẫu có thể vẽ lại
            var b = ev.target.closest('[data-cba]');
            if (!b) return;
            if (b.getAttribute('data-cba') === 'huy') { o.huy(); return; }
            var full = q('full').value.trim();
            if (!full) { q('full').focus(); ui.toast('Vui lòng nhập Họ và tên đầy đủ', 'warn'); return; }
            var ns = q('ns').value.trim(), p = ns.split('/');
            /* Ngày sinh kiểm TRƯỚC KHI GỬI (2026-09-30, như Đề xuất hồ sơ): gốc gửi thẳng chữ trong ô — InsertCorePerson nhận cả 31/02, tháng 13.
               Để trống thì gửi rỗng; có nhập thì phải đúng dd/mm/yyyy và là ngày có thật, gửi đi dạng đã thêm số 0. */
            if (ns) {
                var kt = p.length === 3 ? ums.util.ngaySinh(p[0], p[1], p[2], 'EXACT') : { loi: 'Ngày sinh phải theo dạng dd/mm/yyyy' };
                if (kt.loi) { q('ns').focus(); ui.toast('Kiểm tra lại: ' + kt.loi, 'warn'); return; }
                ns = kt.chuoi; p = ns.split('/');
            }
            var x =Object.assign({ action: o.them ? 'NS_HoSoNhanSu5_MH/CC8yJDM1Ai4zJBEkMzIuLwPP' : 'NS_HoSoNhanSu5_MH/FDElIDUkAi4zJBEkMzIuLwPP',
                func: 'PKG_CORE_HOSONHANSU_05.' + (o.them ? 'InsertCorePerson' : 'UpdateCorePerson'), strChucNang_Id: cn(),
                strFullName: full, strLastName: q('ho').value.trim(), strMiddleName: q('dem').value.trim(), strFirstName: q('ten').value.trim(),
                strDateOfBirth: ns, strDobPrecisionLevel: '', dBirthDay: p.length === 3 ? parseInt(p[0], 10) || '' : '', dBirthMonth: p.length === 3 ? parseInt(p[1], 10) || '' : '',
                dBirthYear: p.length === 3 ? parseInt(p[2], 10) || '' : '', strGenderId: q('gt').value, strProfileStatusId: '', strPortraitFileId: '',
                strContext_Code: 'STUDENT', strInitial_ConText_Code: 'STUDENT', strCreated_Source_Code: 'INTERNAL_FORM' }, qhht.chung());
            if (!o.them) { x.strId = qhht.personId(r); x.strPerson_Id = x.strId; }
            var hoi = o.xacNhan ? pat.xacNhanChiTiet({ title: 'Lưu thông tin cơ bản', icon: 'fa-user-pen', okText: 'Lưu',
                subject: { name: full, extra: [{ label: 'Mã NH', value: lay(r, ['MA_NGUOI_HOC', 'MA_NGUOIHOC_CHINH']) }] },
                sections: [{ title: 'Thông tin cơ bản', tone: 'blue', rows: [['Họ và tên', full], ['Họ', x.strLastName], ['Tên đệm', x.strMiddleName], ['Tên', x.strFirstName],
                    ['Ngày sinh', ns], ['Giới tính', tenCua(q('gt'))]] }] }) : Promise.resolve(true);
            hoi.then(function (ok) {
                if (!ok) return;
                ums.api.call(x).then(function (res) {
                    ui.toast(o.them ? 'Khởi tạo thông tin cơ bản thành công' : 'Cập nhật thông tin cơ bản thành công', 'ok');
                    if (o.sauLuu) o.sauLuu(res);
                }).catch(function (err) { ums.api.handle(err, 'lưu thông tin cơ bản'); });
            });
        };
    };

    /* ---------- Biểu mẫu "Thông tin hồ sơ - chính sách" --------------------- */
    /* o = { dm, xacNhan: bool, sauLuu(r) } — r mang PERSON_PROFILE_ID khi đã có hồ sơ */
    qhht.hscs = function (host, r, o) {
        r = r || {};
        var pid = lay(r, ['PERSON_PROFILE_ID', 'PROFILE_ID']), dm = o.dm;
        function sel(k, ds, v, ph) { return '<select class="ums-select" data-hs="' + k + '" data-ph="' + esc(ph) + '">' + qhht.opt(ds, v, '-- ' + ph + ' --') + '</select>'; }
        function txt(k, v, ph) { return '<input class="ums-input" data-hs="' + k + '" value="' + esc(e(v)) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + ' autocomplete="off">'; }
        host.innerHTML = '<div class="ums-grid ums-grid--3">' +
            ui.field('Tôn giáo', sel('tg', dm.tonGiao, r.RELIGION_ID, 'Chọn tôn giáo')) + ui.field('Dân tộc', sel('dt', dm.danToc, r.ETHNICITY_ID, 'Chọn dân tộc')) +
            ui.field('Thành phần gia đình', sel('hc', dm.hoanCanh, r.FAMILY_BACKGROUND_ID, 'Chọn hoàn cảnh')) +
            ui.field('Tình trạng hôn nhân', sel('hn', dm.honNhan, r.MARITAL_STATUS_ID, 'Chọn tình trạng')) +
            ui.field('Đối tượng chính sách', sel('cs', dm.doiTuong, r.POLICY_OBJECT_ID, 'Chọn đối tượng')) +
            ui.field('Nhóm máu', txt('nm', r.BLOOD_TYPE_CODE, 'VD: A, B, AB, O+')) +
            ui.field('Ngày vào Đoàn', txt('doan', r.UNION_JOIN_DATE, 'dd/mm/yyyy')) + ui.field('Ngày vào Đảng', txt('dang', r.PARTY_JOIN_DATE, 'dd/mm/yyyy')) +
            ui.field('Ngày chính thức Đảng', txt('dangct', r.PARTY_OFFICIAL_DATE, 'dd/mm/yyyy')) +
            '<div class="ums-field"><label class="ums-field__label">&nbsp;</label><div class="ums-field__control"><label class="ums-check"><input type="checkbox" data-hs="hl"' +
                (r.IS_ACTIVE === undefined || r.IS_ACTIVE === null || r.IS_ACTIVE == 1 ? ' checked' : '') + '><span>Hiệu lực</span></label></div></div>' +
            '</div><div class="ums-row ums-row--end ums-u-mt-3">' + (pid ? ui.btn('del', { attr: { 'data-hsa': 'xoa' } }) : '') +
            ui.btn('save', { text: pid ? 'Cập nhật hồ sơ - chính sách' : 'Lưu hồ sơ - chính sách', attr: { 'data-hsa': 'luu' } }) + '</div>';
        ui.enhance(host);
        function q(k) { return host.querySelector('[data-hs="' + k + '"]'); }
        host.onclick = function (ev) {
            var b = ev.target.closest('[data-hsa]');
            if (!b) return;
            var person = qhht.personId(r);
            if (b.getAttribute('data-hsa') === 'xoa') {
                var hoiXoa = o.xacNhan ? pat.xacNhanChiTiet({ title: 'Xóa hồ sơ - chính sách', icon: 'fa-trash-can', tone: 'bad', okText: 'Xóa',
                    subject: { name: lay(r, ['FULL_NAME', 'HO_TEN']) }, sections: [{ title: 'Bản ghi sẽ xoá', tone: 'red', rows: [['ID hồ sơ', pid]] }] })
                    : ui.confirm('Bạn có chắc chắn muốn xóa hồ sơ - chính sách này?', { tone: 'bad', ok: 'Xoá' });
                hoiXoa.then(function (ok) {
                    if (!ok) return;
                    ums.api.call(Object.assign({ action: NH + 'GS4gHhEkMzIuLx4RMy4nKC0k', func: P + 'Xoa_Person_Profile', strId: pid }, qhht.chung())).then(function () {
                        ui.toast('Xóa hồ sơ - chính sách thành công', 'ok');
                        ['PERSON_PROFILE_ID', 'PROFILE_ID', 'RELIGION_ID', 'ETHNICITY_ID', 'FAMILY_BACKGROUND_ID', 'MARITAL_STATUS_ID', 'POLICY_OBJECT_ID', 'BLOOD_TYPE_CODE',
                            'UNION_JOIN_DATE', 'PARTY_JOIN_DATE', 'PARTY_OFFICIAL_DATE'].forEach(function (k) { delete r[k]; });
                        qhht.hscs(host, r, o); if (o.sauLuu) o.sauLuu(r);
                    }).catch(function (err) { ums.api.handle(err, 'xoá hồ sơ - chính sách'); });
                });
                return;
            }
            if (!person) { ui.toast('Chưa có Person ID. Vui lòng lưu Thông tin cơ bản trước.', 'warn'); return; }
            var x = Object.assign({ strReligion_Id: q('tg').value, strEthnicity_Id: q('dt').value, strFamilyBackground_Id: q('hc').value, strMaritalStatus_Id: q('hn').value,
                strPolicyObject_Id: q('cs').value, strBloodType_Code: q('nm').value.trim(), strUnionJoinDate: q('doan').value.trim(), strPartyJoinDate: q('dang').value.trim(),
                strPartyOfficialDate: q('dangct').value.trim(), dIsActive: q('hl').checked ? 1 : 0 }, qhht.chung(),
                pid ? { action: NH + 'EjQgHhEkMzIuLx4RMy4nKC0k', func: P + 'Sua_Person_Profile', strId: pid } : { action: NH + 'FSkkLB4RJDMyLi8eETMuJygtJAPP', func: P + 'Them_Person_Profile', strPerson_Id: person });
            var hoi = o.xacNhan ? pat.xacNhanChiTiet({ title: pid ? 'Cập nhật hồ sơ - chính sách' : 'Lưu hồ sơ - chính sách', icon: 'fa-id-card', okText: 'Lưu',
                subject: { name: lay(r, ['FULL_NAME', 'HO_TEN']) },
                sections: [{ title: 'Hồ sơ - chính sách', tone: 'green', rows: [['Tôn giáo', tenCua(q('tg'))], ['Dân tộc', tenCua(q('dt'))], ['Thành phần gia đình', tenCua(q('hc'))],
                    ['Tình trạng hôn nhân', tenCua(q('hn'))], ['Đối tượng chính sách', tenCua(q('cs'))], ['Nhóm máu', x.strBloodType_Code], ['Ngày vào Đoàn', x.strUnionJoinDate],
                    ['Ngày vào Đảng', x.strPartyJoinDate], ['Ngày chính thức Đảng', x.strPartyOfficialDate], ['Hiệu lực', x.dIsActive ? 'Có' : 'Không']] }] }) : Promise.resolve(true);
            hoi.then(function (ok) {
                if (!ok) return;
                ums.api.call(x).then(function (res) {
                    ui.toast('Lưu hồ sơ - chính sách thành công', 'ok');
                    Object.assign(r, { RELIGION_ID: x.strReligion_Id, ETHNICITY_ID: x.strEthnicity_Id, FAMILY_BACKGROUND_ID: x.strFamilyBackground_Id, MARITAL_STATUS_ID: x.strMaritalStatus_Id,
                        POLICY_OBJECT_ID: x.strPolicyObject_Id, BLOOD_TYPE_CODE: x.strBloodType_Code, UNION_JOIN_DATE: x.strUnionJoinDate, PARTY_JOIN_DATE: x.strPartyJoinDate,
                        PARTY_OFFICIAL_DATE: x.strPartyOfficialDate, IS_ACTIVE: x.dIsActive });
                    var moi = res && res.raw && (res.raw.Id || res.raw.ID);
                    if (!pid && moi) { r.PERSON_PROFILE_ID = moi; qhht.hscs(host, r, o); }
                    if (o.sauLuu) o.sauLuu(r);
                }).catch(function (err) { ums.api.handle(err, 'lưu hồ sơ - chính sách'); });
            });
        };
    };
    /* ---------- Danh mục đào tạo theo chiều (KHCT_BIND_DIMENSION) -----------
       qhht.dim('he' | 'kql' | 'khoa' | 'ct' | 'lop', thamSố) → Promise<[{ ID, TEN }]>
       Tham số chung như _bindDimCommon của gốc: strTuKhoa '', dBoQuaPhamVi 0 +
       người thực hiện / vai trò / hành động. Nhãn "TÊN (MÃ)" như gốc. */
    var DIM = {
        he:   { a: 'DSA4BRIJJAUgLhUgLgPP', f: 'LayDSHeDaoTao', ten: ['TENHEDAOTAO', 'NAME', 'TEN'], ma: [] },
        kql:  { a: 'DSA4BRIKKS4gEDQgLw04', f: 'LayDSKhoaQuanLy', ten: ['NAME', 'TEN', 'TENKHOA'], ma: ['CODE', 'MA', 'MAKHOA'] },
        khoa: { a: 'DSA4BRIKKS4gBSAuFSAu', f: 'LayDSKhoaDaoTao', ten: ['TENKHOA'], ma: ['MAKHOA'] },
        ct:   { a: 'DSA4BRICKTQuLyYVMygvKQPP', f: 'LayDSChuongTrinh', ten: ['TENCHUONGTRINH'], ma: ['MACHUONGTRINH'] },
        lop:  { a: 'DSA4BRINLjEQNCAvDTgP', f: 'LayDSLopQuanLy', ten: ['TENLOP'], ma: ['MALOP'] }
    };
    qhht.dim = function (k, ts) {
        var d = DIM[k];
        return ums.api.call(Object.assign({ action: 'KHCT_BIND_DIMENSION_MH/' + d.a, func: 'PKG_CORE_GET_BIND_DIMENSION.' + d.f, strTuKhoa: '', dBoQuaPhamVi: 0 },
            qhht.chung(), ts || {})).then(function (r) {
            return arr(r.data).map(function (x) { var t = lay(x, d.ten), m = lay(x, d.ma); return { ID: x.ID, TEN: m ? t + ' (' + m + ')' : t }; });
        });
    };

    /** Nạp hồ sơ - chính sách (LayTTPerson_Profile) rồi gộp vào r */
    qhht.napHSCS = function (r, profileId) {
        var person = qhht.personId(r);
        if (!person) return Promise.resolve(r);
        return ums.api.call(Object.assign({ action: NH + 'DSA4FRURJDMyLi8eETMuJygtJAPP', func: P + 'LayTTPerson_Profile', silent: true, strId: profileId || '', strPerson_Id: person }, qhht.chung()))
            .then(function (x) { var d = arr(x.data)[0]; if (d) Object.assign(r, d); return r; }).catch(function () { return r; });
    };
})();
