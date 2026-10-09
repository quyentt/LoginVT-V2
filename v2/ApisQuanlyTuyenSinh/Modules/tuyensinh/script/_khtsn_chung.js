/* =========================================================================
   ums.khtsn — phần CHUNG của màn "Kế hoạch tuyển sinh (new)" (Tuyển sinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/script/kehoachtuyensinhnew.js (13.832 dòng)
   ---------------------------------------------------------------------------
   Màn gốc là MỘT đối tượng KeHoachTuyenSinhNew rất lớn; bản mới tách theo khối:
     _khtsn_chung.js    (tệp này) trạng thái dùng chung, tiện ích dò cột, danh mục
     _khtsn_excel.js    đọc tệp Excel/CSV (SheetJS tải khi cần — như gốc), xuất .xls
     _khtsn_dot.js      hộp "Các đợt tuyển sinh" (danh sách + Thêm/Sửa/Xoá đợt)
     _khtsn_qdhs.js     hộp "Khai danh mục hồ sơ giấy tờ" theo đợt
     _khtsn_daura.js    hộp "Kế hoạch đầu ra" (xem / sửa; thêm theo chương trình khi mở từ đợt)
     _khtsn_phancong.js màn con "Phân công nhân sự" (khung chung ums.khts.phanCong)
     _khtsn_kqdk.js     hộp "Kết quả đăng ký" — danh sách hồ sơ (Gọn / Đầy đủ, lọc kiểu Excel)
     _khtsn_import.js   màn "Import trúng tuyển" + "Đối chiếu file với hệ thống"
     _khtsn_khai.js     biểu mẫu "Khai trực tiếp hồ sơ" (8 bước) — Thêm / Sửa hồ sơ
     _khtsn_khaiphu.js  các bảng phụ của người (địa chỉ, CCCD, gia đình, hồ sơ cá nhân,
                        ngân hàng, hoá đơn, nguồn khai thác) — đọc lên và ghi xuống
     _khtsn_docapi.js   hộp "Đọc dữ liệu từ nguồn API"
     _khtsn_tracuu.js   hộp "Tra cứu người học toàn hệ thống"
     kehoachtuyensinhnew.js  danh sách + biểu mẫu kế hoạch tuyển sinh (ums.crud), mở các màn con
   Từ 30/9 (BO-CUC luật 1): "hộp" Các đợt / Khai danh mục hồ sơ / Kế hoạch đầu ra / Phân công nhân sự / Kết quả đăng ký (kèm
   Import, Khai trực tiếp) là MÀN CON mở ngay trong trang bằng ums.pat.formTrang — tầng một thay chỗ T.S.root, tầng hai (mở từ
   "Các đợt") thay chỗ thân màn con đợt. Chỉ còn Đọc từ API, Tra cứu người học, Đổi nguyện vọng đầu vào là hộp thoại.
   Dùng lại khung ums.khts (ApisNhapHoc/…/trungtuyen/scripts/_khts.js): K.dsDotTS, K.phanCong,
   K.nguonDonVi, K.ngay/ngayGio, K.co, K.tenMa, K.rows.
   ---------------------------------------------------------------------------
   Theo gốc 1–2/10 (47ab8a26, bc5f0bf8, bc5d5f67 — hai commit 1/10 mang tên "popup cinematic … pvp" nhưng nội dung
   ĐÚNG là màn này): T.datChon so chữ lỏng hơn như _setSelectByIdOrText mới (gộp khoảng trắng, bỏ dấu ngoặc, chữ ≥ 4 ký tự
   nhận cả khi chứa nhau; khớp đúng vẫn được ưu tiên). Thay đổi còn lại ghi ở đầu _khtsn_khai.js, _khtsn_khaiphu.js, _khtsn_kqdk.js.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, K = ums.khts;
    var T = ums.khtsn = {};

    /* Trạng thái dùng chung giữa các hộp (tương đương các biến me.* của gốc) */
    T.S = {
        root: null,          // gốc màn (kehoachtuyensinhnew.js đặt) — vùng các màn con thay chỗ khi mở trong trang (ums.pat.formTrang)
        khId: '',            // strKeHoachTuyenSinh_Id
        dtKH: [],            // dtKeHoachTuyenSinh (danh sách đang hiện)
        dtDot: [],           // dtDotTuyenSinh (đợt của kế hoạch đang mở)
        dtDotKH: '',         // kế hoạch mà dtDot thuộc về
        dotKQ: ''            // strDot_Id_ForKQ
    };

    /** Mở một màn con / biểu mẫu NGAY TRONG TRANG — ums.pat.formTrang, o.host mặc định là gốc màn (T.S.root);
        tầng hai thì truyền o.host = thân (body) của khung formTrang đang mở. */
    T.moTrang = function (o) {
        o.host = o.host || T.S.root;
        return ums.pat.formTrang(o);
    };

    function e(v) { return v === undefined || v === null ? '' : v; }
    T.e = e;
    T.esc = function (s) { return ui.esc(s); };

    /** _kqPick: giá trị đầu tiên khác rỗng theo danh sách tên cột */
    T.pick = function (d, keys) {
        if (!d) return '';
        for (var i = 0; i < keys.length; i++) {
            var v = d[keys[i]];
            if (v !== undefined && v !== null && v !== '') return v;
        }
        return '';
    };
    /** _kqPickFuzzy: giá trị đầu tiên có tên cột khớp regex */
    T.pickFuzzy = function (d, re) {
        if (!d) return '';
        for (var k in d) {
            if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
            if (re.test(k)) {
                var v = d[k];
                if (v !== undefined && v !== null && v !== '') return v;
            }
        }
        return '';
    };
    /** _pickLoose: bỏ qua hoa/thường, dấu "_" và tiền tố nhóm cột (khớp đuôi đúng ranh giới "_") */
    T.pickLoose = function (row, names) {
        if (!row) return '';
        var up = function (s) { return (s + '').replace(/\s+/g, '').toUpperCase(); };
        var bare = function (s) { return up(s).replace(/_/g, ''); };
        var keys = Object.keys(row);
        var val = function (key) {
            var v = row[key];
            return (v === undefined || v === null || v === '') ? null : v;
        };
        for (var i = 0; i < names.length; i++) {
            var want = up(names[i]), wantBare = bare(names[i]);
            for (var j = 0; j < keys.length; j++) {
                if (bare(keys[j]) === wantBare) { var v1 = val(keys[j]); if (v1 !== null) return v1; }
            }
            if (want.indexOf('_') < 0 && want.length < 6) continue;
            for (var j2 = 0; j2 < keys.length; j2++) {
                var nk = up(keys[j2]);
                if (nk.length > want.length + 1 && nk.slice(-(want.length + 1)) === '_' + want) {
                    var v2 = val(keys[j2]); if (v2 !== null) return v2;
                }
            }
        }
        return '';
    };
    /** _pickPair: dò theo từ khoá — { id: cột *_ID/_IDS hoặc giá trị trần, ten: cột *_TEN/_NAME/_MOTA } */
    T.pickPair = function (row, re) {
        var out = { id: '', ten: '' };
        if (!row) return out;
        var plain = '';
        Object.keys(row).forEach(function (k) {
            var K2 = (k + '').toUpperCase();
            if (!re.test(K2)) return;
            var v = row[k];
            if (v === undefined || v === null || v === '') return;
            if (/(_TEN|_NAME|_MOTA)$/.test(K2)) { if (!out.ten) out.ten = v; }
            else if (/_IDS?$/.test(K2)) { if (!out.id) out.id = v; }
            else if (plain === '') plain = v;
        });
        if (!out.id) out.id = plain;
        return out;
    };
    /** Bỏ dấu + viết hoa (so khớp tên loại danh mục như gốc) */
    T.strip = function (s) {
        s = (s || '') + '';
        if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
        return s.replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    };
    T.pid = function (d) { return T.pick(d, ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id', 'PERSON_ID', 'Person_Id']); };
    T.hid = function (d) { return T.pick(d, ['HOSO_ID', 'ID', 'HoSo_Id', 'Id']); };
    T.id = function (d) { return d ? (d.ID || d.Id || d.id || '') : ''; };
    T.tenMa = function (ten, ma) {
        if (ten && ma && ten !== ma) return ten + ' (' + ma + ')';
        return ten || ma || '';
    };

    /* ---------- Ngày ----------------------------------------------------------
       _ngaySinhToUI / _ngaySinhToISO của gốc. Bản mới dùng ô lịch dd/mm/yyyy nên
       giá trị trên form luôn là dd/mm/yyyy; chỗ gốc gửi ISO (ô type=date — ngày cấp
       CCCD) thì đổi ngược sang ISO trước khi gửi để máy chủ nhận ĐÚNG như cũ. */
    T.ngayUI = function (s) {
        if (!s) return '';
        var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return m[3] + '/' + m[2] + '/' + m[1];
        return String(s).replace(/^(\d{2})\/(\d{2})\/(\d{4}).*$/, '$1/$2/$3');
    };
    T.ngayISO = function (s) {
        if (!s) return '';
        var m = String(s).trim().match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
        var mISO = String(s).trim().match(/^(\d{4}-\d{2}-\d{2})/);
        if (mISO) return mISO[1];
        return s;
    };
    T.homNay = function () {
        var d = new Date(), p = function (n) { return n < 10 ? '0' + n : '' + n; };
        return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
    };
    T.dauGio = function () {
        var d = new Date(), p = function (n) { return n < 10 ? '0' + n : '' + n; };
        return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
    };

    /* ---------- Lời gọi ------------------------------------------------------
       Tham số hệ thống (strNguoiThucHien_Id, strVaiTroDangNhap_Id, strChucNangHeThong_Id)
       để trống cho ums.api tự điền như makeRequest cũ. */
    T.TS = 'TS_Core_KeHoach_MH/';
    T.PTS = 'PKG_CORE_TS_KEHOACH.';
    T.goi = function (action, func, extra, hanhDong) {
        var o = { action: action, func: func };
        if (hanhDong !== undefined) {
            o.strNguoiThucHien_Id = '';
            o.strVaiTroDangNhap_Id = '';
            o.strChucNangHeThong_Id = '';
            o.strHanhDong_Code = hanhDong;
        }
        Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
        return o;
    };
    T.rows = function (r) { var d = r && r.data; return Array.isArray(d) ? d : (d ? [d] : []); };
    /** Lấy MỘT bản ghi (Get_By_Id trả mảng hoặc đối tượng) */
    T.mot = function (r) { var d = r && r.data; return Array.isArray(d) ? (d[0] || null) : (d || null); };

    /* ---------- Danh mục (getList_DanhMucDulieu / _ensureDMList) ----------- */
    T.dm = function (ma) {
        return ums.api.dm(ma).then(function (r) { return r || []; }, function () { return []; });
    };
    /** Tên theo MA (lookupTen của gốc: không có thì trả lại mã) */
    T.tenTheoMa = function (rows, ma) {
        if (!ma) return '';
        for (var i = 0; i < (rows || []).length; i++) if (rows[i].MA == ma) return rows[i].TEN || ''; // eslint-disable-line eqeqeq
        return ma;
    };
    T.tenTheoId = function (rows, id) {
        if (!id) return '';
        for (var i = 0; i < (rows || []).length; i++) if (String(T.id(rows[i])) === String(id)) return rows[i].TEN || rows[i].Ten || '';
        return '';
    };
    /** Danh mục đầu trang — nạp một lần mỗi màn */
    var cacheDM = {};
    T.dmMot = function (ma) {
        if (!cacheDM[ma]) cacheDM[ma] = T.dm(ma);
        return cacheDM[ma];
    };
    T.DM = {
        TINHTRANG_KH: 'TS.KEHOACH.TINHTRANG',
        KIEUDOT: 'TS.KEHOACH.DOT.KIEUDOT',
        TINHTRANG_DOT: 'TS.KEHOACH.DOT.TINHTRANG',
        VAITRO_PC: 'TS.KEHOACH.NHANSU.VAITRO',
        LOAI_DAURA: 'TS.KEHOACH.DAURA.LOAI',
        KIEUHOC: 'TS.KEHOACH.DAURA.KIEUHOC',
        TT_DAURA: 'TS.KEHOACH.DAURA.TRANGTHAI',
        LOAIHOSO: 'TUYENSINH.LOAIHOSO',
        TINHCHATHOSO: 'TUYENSINH.TINHCHATHOSO',
        NGANHNGHE: 'TUYENSINH.NGANHNGHE',
        // constant.setting.CATOR của gốc: NS.GITI / NS.DATO / NS.TOGI / CHUN.CHLU
        GIOITINH: 'NS.GITI', DANTOC: 'NS.DATO', TONGIAO: 'NS.TOGI', QUOCTICH: 'CHUN.CHLU',
        DOITUONG_TS: 'TS.DOITUONGDUTUYEN', DOITUONG_UT: 'QLSV.DOITUONG', KHUVUC_UT: 'QLSV.KHUVUC',
        TRUONG12: 'TUYENSINH.TRUONGHOC', HOCLUC: 'TUYENSINH.HOCLUC', HANHKIEM: 'TUYENSINH.HANHKIEM',
        DOITUONG_HD: 'TS.DOITUONGHOADON', LOAI_TK: 'PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE',
        LOAI_DIACHI: 'PERSON_ADDRESS.ADDRESS_TYPE_CODE', LOAI_DINHDANH: 'PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE',
        QUANHE_GD: 'PERSON_FAMILY.RELATION_TYPE_CODE'
    };

    /** Tên danh mục theo ID (thay _kqLookupById đọc option của ô chọn ẩn) */
    var mapDM = {};
    T.napMapDM = function (ma) {
        return T.dmMot(ma).then(function (rows) {
            var m = {};
            rows.forEach(function (r) { m[String(T.id(r))] = r.TEN || r.Ten || ''; });
            mapDM[ma] = m;
            return m;
        });
    };
    T.tenDM = function (ma, id) {
        if (!id) return '';
        var m = mapDM[ma];
        return m ? (m[String(id)] || '') : '';
    };
    T.tenDMNhieu = function (ma, ids) {
        if (!ids) return '';
        return String(ids).split(/[,;]/).map(function (x) { x = x.trim(); return x ? T.tenDM(ma, x) : ''; })
            .filter(function (x) { return x; }).join(', ');
    };

    /* ---------- Đợt của kế hoạch (_ensureDotTuyenSinh) --------------------------
       Pr_Ts_Kh_Ts_Dot_Get_Ds với dIs_Active RỖNG (mọi đợt) như gốc — qua K.dsDotTS cờ tatCa. */
    T.dsDot = function (khId, epNap) {
        if (!khId) return Promise.resolve([]);
        if (!epNap && T.S.dtDotKH === khId && T.S.dtDot.length) return Promise.resolve(T.S.dtDot);
        return K.dsDotTS(khId, '', { tatCa: true }).then(function (rows) {
            T.S.dtDot = rows || [];
            T.S.dtDotKH = khId;
            return T.S.dtDot;
        }).catch(function (err) { ums.api.handle(err, 'đợt tuyển sinh'); return []; });
    };
    /** Nhãn đợt "[MA] TEN" như các ô chọn đợt của gốc */
    T.nhanDot = function (d) {
        var ma = d.MA || d.Ma || '', ten = d.TEN || d.Ten || '';
        return (ma ? '[' + ma + '] ' : '') + ten;
    };
    T.tenKH = function (kh) { return kh ? (kh.TEN || kh.Ten || kh.KEHOACH_TEN || '') : ''; };
    T.khHienTai = function () {
        var id = T.S.khId;
        return (T.S.dtKH || []).filter(function (r) { return String(T.id(r)) === String(id); })[0] || { ID: id };
    };

    /* ---------- Cơ sở đào tạo (loadCoSoDaoTao_ToSelect) --------------------- */
    var pCSDT = null;
    T.dsCoSoDaoTao = function () {
        if (!pCSDT) {
            pCSDT = ums.api.call({
                action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
                func: 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
                strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000, silent: true
            }).then(T.rows).catch(function () { pCSDT = null; return []; });
        }
        return pCSDT;
    };
    T.nhanCSDT = function (d) {
        var ma = d.MA || d.Ma || '', ten = d.TEN || d.Ten || ma;
        return ten + (ma && ma !== ten ? ' [' + ma + ']' : '');
    };

    /* ---------- Ô chọn --------------------------------------------------------
       Đổ danh sách vào ô chọn (pat.fill) — `giu` đặt lại giá trị đã chọn nếu còn */
    T.fill = function (el, rows, o) {
        if (!el) return;
        ums.pat.fill(el, rows, o);
        if (o && o.giu !== undefined) {
            el.value = rows.some(function (r) { return String(r[(o.id || 'ID')]) === String(o.giu); }) ? o.giu : '';
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }
    };
    /** Đặt giá trị ô chọn theo ID, không có thì dò theo chữ hiển thị (_setSelectByIdOrText) */
    T.datChon = function (el, id, text) {
        if (!el) return false;
        var ok = false;
        if (id !== undefined && id !== null && id !== '') {
            ok = Array.prototype.some.call(el.options, function (o) { return o.value === String(id); });
            if (ok) el.value = String(id);
        }
        if (!ok && text && String(text).trim()) {
            /* Gốc 1/10: so chữ sau khi gộp khoảng trắng + bỏ dấu ngoặc; chữ ≥ 4 ký tự thì nhận cả khi chứa nhau
               (vd tên đối tác "Nguyễn Văn A" khớp mục "Nguyễn Văn A (DT01)") */
            var chuan = function (x) { return String(x || '').replace(/\s+/g, ' ').trim().toLowerCase(); };
            var sach = function (x) { return chuan(x).replace(/[()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim(); };
            var t = chuan(text), tS = sach(text);
            var ds = Array.prototype.filter.call(el.options, function (o) { return !!o.value; });
            var hit = ds.filter(function (o) { return chuan(o.text) === t || sach(o.text) === tS; })[0] ||   // khớp đúng trước
                (tS.length >= 4 ? ds.filter(function (o) { var oS = sach(o.text); return oS && (oS.indexOf(tS) >= 0 || tS.indexOf(oS) >= 0); })[0] : null);
            if (hit) { el.value = hit.value; ok = true; }
        }
        if (ok && window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
        return ok;
    };

    /* Nút "Xem" trong ô bảng (btnview của gốc); khoa=true → giữ nút, khoá (hộp đích không tồn tại ở gốc) */
    T.nutXem = function (k, id, chu, khoa, them) {
        var attr = { 'data-xem': k, 'data-id': e(id) };
        Object.keys(them || {}).forEach(function (x) { attr[x] = them[x]; });
        if (khoa) { attr.disabled = 'disabled'; attr.title = 'Bản gốc chưa có màn này (nút không mở gì)'; }
        return ui.btn('view', { text: chu || 'Xem', cls: 'ums-btn--sm', attr: attr });
    };
    T.rong = function (t, cls) { return '<div class="' + (cls || 'khtsn-rong') + '">' + ui.esc(t) + '</div>'; };

    /** Hàng đợi N luồng cho các việc trả Promise (gốc tự viết ở nhiều chỗ, MAX = 6) */
    T.hangDoi = function (viec, n) {
        n = n || 6;
        var i = 0, chay = 0;
        return new Promise(function (xong) {
            if (!viec.length) { xong(); return; }
            var da = 0;
            function tiep() {
                while (chay < n && i < viec.length) {
                    var f = viec[i++];
                    chay++;
                    Promise.resolve().then(f).catch(function () { /* từng việc tự lo lỗi */ }).then(function () {
                        chay--; da++;
                        if (da >= viec.length) xong(); else tiep();
                    });
                }
            }
            tiep();
        });
    };
})();
