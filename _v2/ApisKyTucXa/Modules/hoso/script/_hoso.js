/* =========================================================================
   Khung dùng chung của module hoso — phân hệ Ký túc xá (ums.ktxHoSo)
   Bản gốc: ApisKyTucXa/Modules/hoso/script/{taomoihoso,dangkynguoio,hoso,khongtinhmien,khongtinhphi}.js
   ---------------------------------------------------------------------------
   Năm màn gốc chép tay cùng một bộ: lời gọi KTX_DoiTuongOKyTucXa/LayDanhSach (22 tham số), biểu mẫu hồ sơ
   người ở 5 nhóm (30 ô), ô chọn Tòa nhà → Phòng, xếp phòng (KTX_DaXepPhong/ThemMoi). Ở đây một bản:

       X.dsCall(o)                 lời gọi danh sách người ở, mọi tham số như gốc, `o` ghi đè từng tham số
       Ô chọn Tòa nhà → Phòng: ums.ktx.noiToaNhaPhong (cosovatchat/script/_ktx.js, nạp chéo TRƯỚC tệp này — 12/10 gộp
                                   ba bản về một; bản riêng X.callToaNha / X.callPhong / X.noiToaNhaPhong đã bỏ)
       X.fieldsNO()                4 nhóm ô của biểu mẫu hồ sơ (định nghĩa kiểu ums.crud fields, formCols 12)
       X.saveNO(v, row)            lời gọi ThemMoi / CapNhat (tên tham số chép nguyên từ save_NO / CapNhat_NO)
       X.khoiXepPhong(host)        nhóm "5) Đăng ký phòng" (Tòa nhà → Phòng, Ngày vào, Ngày ra) → { val(), reset(), hide(b) }
       X.xepPhong(dtId, phongId, ngayVao, ngayRa)   KTX_DaXepPhong/ThemMoi (save_DangKy gốc)
       X.veTruong(host, fields)    vẽ biểu mẫu từ định nghĩa fields cho màn KHÔNG dùng ums.crud (dangkynguoio)
                                   → { el(k), val(k), set(k, v), values(), reset(), ready }
       X.hoTen(r, tienTo) · X.ngaySinh(r) · X.e(v) · X.arr(d)

   Danh mục chung (loadToCombo_DanhMucDuLieu gốc): KTX.TTHD, KTX.LOP, KTX.KHOADAOTAO, NS.DATO, NS.TOGI, NS.QUOCTICH,
   KTX_PHANLOAIDOITUONG, NS.GITI (constant.setting.CATOR.NS.GITI), KTX.TRINHDO, KTX.DIDT, CHUN.NGAN.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var X = ums.ktxHoSo = {};

    X.P = 'KTX_DoiTuongOKyTucXa/';
    X.e = function (v) { return v === null || v === undefined ? '' : String(v); };
    X.arr = function (d) { return Array.isArray(d) ? d : []; };
    X.hoTen = function (r, pre) { pre = pre || ''; return (X.e(r[pre + 'HODEM']) + ' ' + X.e(r[pre + 'TEN'])).trim(); };
    /* như gốc: NGAYSINH/THANGSINH/NAMSINH ghép bằng "/" (ô trống vẫn giữ dấu) */
    X.ngaySinh = function (r) { return X.e(r.NGAYSINH) + '/' + X.e(r.THANGSINH) + '/' + X.e(r.NAMSINH); };
    X.loi = function (viec) { return function (err) { ums.api.handle(err, viec); }; };

    /* ---------- Danh sách người ở ------------------------------------------ */
    X.dsCall = function (o) {
        var b = {
            action: X.P + 'LayDanhSach', method: 'GET',
            strTuKhoa: '', strTinhTrangHopDong_Id: '', dBiKyLuat: -1,
            strNgayVao_TuNgay: '', strNgayVao_DenNgay: '', strNgayRa_TuNgay: '', strNgayRa_DenNgay: '',
            strKTX_ToaNha_Id: '', strLopQuanLy_Id: '', strKTX_Phong_Id: '', strPhanLoaiDoiTuong_Id: '', strKhoaDaoTao_Id: '',
            dDoiTuongConDangOKTX: 1, strGioiTinh_Id: '', strTrinhDoDaoTao_Id: '', strDienDaoTao_Id: '', strNganhDaoTao_Id: '',
            strNgayKiemTra: '', strNamNhapHoc: ''
        };   /* pageIndex / pageSize: ums.crud (paged) tự chèn; màn tự gọi thì truyền trong `o` */
        Object.keys(o || {}).forEach(function (k) { b[k] = o[k]; });
        return b;
    };

    /* ---------- Biểu mẫu hồ sơ người ở (4 nhóm) ----------------------------- */
    X.fieldsNO = function () {
        return [
            { type: 'legend', label: '1) Nhóm thông tin cơ bản' },
            /* Ảnh bên trái, trải 3 hàng (không nhãn); bên phải: Mã số | Họ đệm + Tên | Ngày / Tháng / Năm + Giới tính (người dùng 2026-10-12) */
            { key: 'strAnhCaNhan', col: 'ANH', label: '', type: 'avatar', cols: 2, hang: 3 },
            { key: 'strMaSo', col: 'MASO', label: 'Mã số', cols: 10, required: true },
            { key: 'strHoDem', col: 'HODEM', label: 'Họ đệm', cols: 5, placeholder: 'Nhập họ' },
            { key: 'strTen', col: 'TEN', label: 'Tên', cols: 5, placeholder: 'Nhập tên' },
            { key: 'strNgaySinh', col: 'NGAYSINH', label: 'Sinh ngày', cols: 2, placeholder: 'dd' },
            { key: 'strThangSinh', col: 'THANGSINH', label: 'Tháng', cols: 2, placeholder: 'mm' },
            { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm', cols: 2, placeholder: 'yyyy' },
            { key: 'strGioiTinh_Id', col: 'GIOITINH_ID', label: 'Giới tính', type: 'select', cols: 4, placeholder: '--Chọn giới tính--', source: { dm: 'NS.GITI' } },
            { key: 'strKhoaDaoTao_Id', col: 'KHOADAOTAO_ID', label: 'Khóa', type: 'select', cols: 6, placeholder: '--Chọn khóa đào tạo--', source: { dm: 'KTX.KHOADAOTAO' } },
            { key: 'strLopQuanLy_Id', col: 'LOPQUANLY_ID', label: 'Lớp', type: 'select', cols: 6, placeholder: '--Chọn lớp đào tạo--', source: { dm: 'KTX.LOP' } },
            { key: 'strEmail_CaNhan', col: 'EMAIL_CANHAN', label: 'Email', cols: 6, placeholder: 'client@mail.com' },
            { key: 'strDanToc_Id', col: 'DANTOC_ID', label: 'Dân tộc', type: 'select', cols: 6, placeholder: '--Chọn dân tộc--', source: { dm: 'NS.DATO' } },
            { key: 'strTonGiao_Id', col: 'TONGIAO_ID', label: 'Tôn giáo', type: 'select', cols: 6, placeholder: '--Chọn tôn giáo--', source: { dm: 'NS.TOGI' } },
            { key: 'strSDT_CaNhan', col: 'SDT_CANHAN', label: 'SĐT Cá nhân', cols: 6, placeholder: '035 789 567' },
            { key: 'strSDT_GiaDinh', col: 'SDT_GIADINH', label: 'Số điện thoại gia đình', cols: 6, placeholder: '091 775 754' },
            { key: 'strCanCuoc_So', col: 'CANCUOC_SO', label: 'Số căn cước', cols: 6 },
            { key: 'strSoTaiKhoanCaNhan', col: 'SOTAIKHOANCANHAN1', label: 'Số tài khoản', cols: 6 },

            { type: 'legend', label: '2) Thông tin bổ sung' },
            { key: 'strQuocTich_Id', col: 'QUOCTICH_ID', label: 'Quốc tịch', type: 'select', cols: 6, placeholder: '--Chọn quốc tịch--', source: { dm: 'NS.QUOCTICH' } },
            { key: 'strPhanLoaiDoiTuong_Id', col: 'PHANLOAIDOITUONG_ID', label: 'Loại đối tượng', type: 'select', cols: 6, placeholder: '--Chọn loại đối tượng--', source: { dm: 'KTX_PHANLOAIDOITUONG' } },
            { key: 'strQueQuan', col: 'QUEQUAN', label: 'Quê quán', cols: 12 },
            { key: 'strHoKhauThuongTru', col: 'HOKHAUTHUONGTRU', label: 'Hộ khẩu thường trú', cols: 12 },
            { key: 'strDiaChiLienHe', col: 'DIACHILIENHE', label: 'Địa chỉ liên hệ', cols: 12 },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', cols: 12 },

            { type: 'legend', label: '3) Thông tin đào tạo' },
            { key: 'strNganhDaoTao_Id', col: 'NGANHDAOTAO_ID', label: 'Ngành', type: 'select', cols: 6, placeholder: '--Chọn ngành đào tạo--', source: { dm: 'CHUN.NGAN' } },
            { key: 'strTrinhDoDaoTao_Id', col: 'TRINHDODAOTAO_ID', label: 'Trình độ', type: 'select', cols: 6, placeholder: '--Chọn trình độ đào tạo--', source: { dm: 'KTX.TRINHDO' } },
            { key: 'strDienDaoTao_Id', col: 'DIENDAOTAO_ID', label: 'Diện đào tạo', type: 'select', cols: 6, placeholder: '--Chọn diện đào tạo--', source: { dm: 'KTX.DIDT' } },

            { type: 'legend', label: '4) Thông tin lưu học sinh' },
            { key: 'strSoHoChieu', col: 'SOHOCHIEU', label: 'Số hộ chiếu', cols: 6 },
            { key: 'strThoiHanViSa', col: 'THOIHANVISA', label: 'Hạn visa', type: 'date', cols: 6 },
            { key: 'strThoiGianDen', col: 'THOIGIANDEN', label: 'Thời gian đến', type: 'date', cols: 6 },
            { key: 'strThoiGianDi', col: 'THOIGIANDI', label: 'Thời gian đi', type: 'date', cols: 6 }
        ];
    };

    /* Lời gọi lưu hồ sơ — tên tham số chép nguyên save_NO / CapNhat_NO; strNguoiThucHien_Id hệ tự chèn */
    X.saveNO = function (v, row) {
        var o = { action: X.P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '' };
        ['strMaSo', 'strHoDem', 'strTen', 'strNgaySinh', 'strThangSinh', 'strNamSinh', 'strGioiTinh_Id', 'strSDT_CaNhan', 'strEmail_CaNhan',
            'strCanCuoc_So', 'strDiaChiLienHe', 'strGhiChu', 'strSoHoChieu', 'strThoiHanViSa', 'strTrinhDoDaoTao_Id', 'strDienDaoTao_Id',
            'strNganhDaoTao_Id', 'strAnhCaNhan', 'strQuocTich_Id', 'strDanToc_Id', 'strKhoaDaoTao_Id', 'strLopQuanLy_Id', 'strTonGiao_Id',
            'strSoTaiKhoanCaNhan', 'strQueQuan', 'strHoKhauThuongTru', 'strThoiGianDen', 'strThoiGianDi', 'strSDT_GiaDinh', 'strPhanLoaiDoiTuong_Id']
            .forEach(function (k) { o[k] = X.e(v[k]); });
        return o;
    };

    /* Xếp phòng sau khi lưu hồ sơ (save_DangKy gốc) */
    X.xepPhong = function (dtId, phongId, ngayVao, ngayRa) {
        return ums.api.call({ action: 'KTX_DaXepPhong/ThemMoi', method: 'POST', strId: '', strKTX_KeHoachDangKy_Id: '', strKTX_Phong_Id: phongId,
            strKTX_DoiTuongOKyTucXa_Id: dtId, strNgayVao: ngayVao, strNgayRa: ngayRa || '', strKTX_DangKy_Id: '', strKTX_HopDong_Id: '', strMoTa: '' });
    };

    /* Nhóm "5) Đăng ký phòng" — vẽ vào host; hai màn (taomoihoso: vùng extra của crud; dangkynguoio: dưới biểu mẫu) */
    X.khoiXepPhong = function (host, o) {
        o = o || {};
        host.innerHTML = '<div class="ums-grid ums-grid--12" data-xp="khoi">' +
            '<div class="ums-legend" style="grid-column:1 / -1">5) Đăng ký phòng</div>' +
            '<div style="grid-column:span 6">' + ui.field('Tòa nhà', '<select class="ums-select" data-xp="toanha" data-ph="Chọn tòa nhà"><option value=""></option></select>') + '</div>' +
            '<div style="grid-column:span 6">' + ui.field('Phòng', '<select class="ums-select" data-xp="phong" data-ph="Chọn phòng"><option value=""></option></select>') + '</div>' +
            '<div style="grid-column:span 6">' + ui.field('Ngày vào', '<input class="ums-input" data-xp="ngayvao" data-date placeholder="dd/mm/yyyy" autocomplete="off">', { hint: 'Chú ý: Ngày vào là bắt buộc' }) + '</div>' +
            '<div style="grid-column:span 6">' + ui.field('Ngày ra', '<input class="ums-input" data-xp="ngayra" data-date placeholder="dd/mm/yyyy" autocomplete="off">') + '</div>' +
            '</div>';
        function q(k) { return host.querySelector('[data-xp="' + k + '"]'); }
        var sTN = q('toanha'), sP = q('phong');
        ui.enhance(host);
        ums.ktx.noiToaNhaPhong(sTN, sP);
        return {
            val: function () { return { toaNha: pat.val(sTN), phong: pat.val(sP), ngayVao: pat.val(q('ngayvao')), ngayRa: pat.val(q('ngayra')) }; },
            reset: function () {
                [sTN, sP].forEach(function (s) { s.value = ''; if (window.jQuery) jQuery(s).trigger('change'); });
                q('ngayvao').value = ''; q('ngayra').value = '';
            },
            hide: function (b) { q('khoi').hidden = !!b; },
            el: q
        };
    };

    /* ---------- Vẽ biểu mẫu từ định nghĩa fields (màn không dùng ums.crud) ---- */
    X.veTruong = function (host, fields) {
        var h = '<div class="ums-grid ums-grid--12">', avatars = {}, cho = [];
        fields.forEach(function (f) {
            if (f.type === 'legend') { h += '<div class="ums-legend" style="grid-column:1 / -1">' + esc(f.label) + '</div>'; return; }
            if (f.type === 'note') { h += '<div class="ums-u-muted ums-u-fz12" style="grid-column:1 / -1">' + esc(f.label) + '</div>'; return; }
            var ctl;
            var at = ' data-k="' + esc(f.key) + '" data-type="' + esc(f.type || 'text') + '"';
            if (f.type === 'avatar') ctl = '<div' + at + '></div>';
            else if (f.type === 'select') ctl = '<select class="ums-select"' + at + ' data-ph="' + esc(f.placeholder || '-- Chọn --') + '"><option value=""></option></select>';
            else if (f.type === 'textarea') ctl = '<textarea class="ums-textarea"' + at + ' rows="3"></textarea>';
            else ctl = '<input class="ums-input"' + at + (f.type === 'date' ? ' data-date placeholder="dd/mm/yyyy"' : (f.type === 'number' ? ' type="number"' : '')) +
                (f.placeholder && f.type !== 'date' ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
                (f.value !== undefined ? ' value="' + esc(f.value) + '"' : '') + ' autocomplete="off">';
            h += '<div style="grid-column:span ' + Number(f.cols || 6) + '">' + ui.field(f.label, ctl, { required: f.required, hint: f.hint }) + '</div>';
        });
        host.innerHTML = h + '</div>';
        function el(k) { return host.querySelector('[data-k="' + k + '"]'); }
        fields.forEach(function (f) {
            if (!f.key) return;
            var e = el(f.key);
            if (f.type === 'avatar') { avatars[f.key] = ums.files.avatar(e, { width: f.width, height: f.height }); return; }
            if (f.type === 'select' && f.source) {
                var p = f.source.dm ? ums.api.dm(f.source.dm)
                    : f.source.call ? ums.api.call(f.source.call).then(function (d) { return X.arr(d.data); })
                    : Promise.resolve(f.source.items || []);
                cho.push(p.then(function (rows) {
                    pat.fill(e, rows, { id: f.source.id, name: f.source.name, head: f.placeholder || pat.dmTitle(rows) || '-- Chọn --' });
                }, X.loi(f.label)));
            }
        });
        ui.enhance(host);
        var api = {
            el: el,
            val: function (k) { return avatars[k] ? avatars[k].get() : pat.val(el(k)); },
            set: function (k, v) {
                if (avatars[k]) { avatars[k].set(v); return; }
                var e = el(k); if (!e) return;
                e.value = X.e(v);
                if (e.tagName === 'SELECT' && window.jQuery) jQuery(e).trigger('change.select2');
            },
            values: function () { var v = {}; fields.forEach(function (f) { if (f.key) v[f.key] = api.val(f.key); }); return v; },
            reset: function () { fields.forEach(function (f) { if (f.key) api.set(f.key, f.value !== undefined ? f.value : ''); }); },
            avatars: avatars,
            ready: Promise.all(cho)
        };
        return api;
    };

    /* Kiểm ô bắt buộc của biểu mẫu tự vẽ → tên ô thiếu đầu tiên hoặc '' */
    X.thieu = function (api, fields) {
        for (var i = 0; i < fields.length; i++) {
            var f = fields[i];
            if (f.required && f.key && !api.val(f.key)) { var e = api.el(f.key); if (e && e.focus) e.focus(); return f.label; }
        }
        return '';
    };
})();
