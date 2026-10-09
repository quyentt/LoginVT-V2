/* =========================================================================
   _khtsc_dot.js — vùng "Đợt phương thức" của Kế hoạch tuyển sinh (bản cũ)
   Bản gốc: kehoachtuyensinh.js — zone_DotPhuongThuc + ba hộp myModalNganhNghe,
            myModalToHop, myModalMonThi, myModalLopDuKien.
   ---------------------------------------------------------------------------
   ums.khtsc.dot(host, { kh, dot|null, dots, onDong(), onDoi() })
     kh   = kế hoạch đang sửa { ID, TEN }
     dot  = dòng TS_Dot_DoiTuong đang sửa (null = thêm mới)
   Lời gọi (chép nguyên):
     TS_Dot_DoiTuong/ThemMoi | CapNhat | Xoa · LayDanhSach (GET, để tìm lại dòng sau khi thêm)
     TS_KeHoach_MH · pkg_tuyensinh_kehoach.LayDSTS_KeHoach_Phi_Dot / Them_ / Sua_TS_KeHoach_Phi_Dot · TS_KeHoach_Phi_Dot/Xoa
     TS_ThongTin_MH · pkg_tuyensinh_thongtin.LayDSTS_Dot_DoiTuong_LopHoc / Them_ / Sua_ / Xoa_TS_Dot_DoiTuong_LopHoc
     TS_Dot_DT_NganhNghe/LayDanhSach (GET) | ThemMoi | Xoa
     TS_ToHop_Mon_Nganh_Dot/LayDanhSach (GET) | ThemMoi | Xoa · TS_ToHop_MonThi/LayDanhSach (GET)
   Lỗi gốc đã sửa:
     · Sửa khoản phí gửi action Sua_TS_KeHoach_Phi_Dot nhưng func vẫn Them_… → gửi func Sua_ khớp action.
     · Sửa lớp dự kiến gửi func 'TS_ThongTin_MH.Sua_…' (tên controller thay tên gói) → 'pkg_tuyensinh_thongtin.Sua_…'.
     · Thêm đợt xong gốc vẫn giữ id rỗng → bấm Lưu lần hai là thêm TRÙNG; nay chuyển sang sửa đúng đợt vừa tạo.
     · Lưu khoản phí xong gốc nạp lại "Tổ hợp môn" của kế hoạch (nhầm hàm) → nạp lại khoản phí.
   Nơi hiện (30/9, BO-CUC luật 1): "Lớp dự kiến" (thêm / sửa) và "Tổ hợp ngành nghề" (màn con) là biểu mẫu NGAY TRONG TRANG,
     thay chỗ vùng đợt (ums.pat.formTrang, host = vùng đợt). Hộp CHỌN "Ngành nghề", "Thêm mới - Tổ hợp" vẫn là hộp thoại.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, K = ums.khtsc;
    var esc = ui.esc, e = K.e;

    var MH = 'TS_KeHoach_MH/', PK = 'pkg_tuyensinh_kehoach.';
    var TT = 'TS_ThongTin_MH/', PT = 'pkg_tuyensinh_thongtin.';

    K.dsDot = function (khId) {
        return K.get({ action: 'TS_Dot_DoiTuong/LayDanhSach', type: 'GET', strTuKhoa: '', strDoiTuongDuTuyen_Id: '', strDotTuyenSinh_Id: '',
            strTS_KeHoachTuyenSinh_Id: khId, strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 });
    };

    function fld(label, ctl, full) {
        return '<div' + (full ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(label, ctl) + '</div>';
    }
    function inp(k, ph) { return '<input class="ums-input" data-d="' + k + '" autocomplete="off"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>'; }
    function ngay(k) { return '<div class="ums-inputwrap"><input class="ums-input" data-d="' + k + '" data-date autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>'; }
    function sel(k, ph) { return '<select class="ums-select" data-d="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'; }

    K.dot = function (host, o) {
        var kh = o.kh, dot = o.dot || null;

        host.innerHTML =
            pat.panel({
                title: 'Đợt phương thức - ' + e(kh.TEN), icon: 'fa-calendar-days',
                tools: ui.btn('close', { attr: { 'data-d': 'dong' } }) +
                    '<button type="button" class="ums-btn ums-btn--danger" data-d="xoa" hidden><i class="fa-light fa-trash-can"></i><span>Xóa</span></button>' +
                    ui.btn('save', { attr: { 'data-d': 'luu' } }),
                body: '<div class="ums-legend">Thông tin đợt tuyển sinh</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                    fld('Mã đợt', inp('strMa')) + fld('Tên đợt', inp('strTen')) +
                    fld('Ngày bắt đầu', ngay('strNgayBatDau')) + fld('Ngày kết thúc', ngay('strNgayKetThuc')) +
                    fld('Thứ tự', inp('iThuTu')) + fld('Tên tổ hợp', inp('strTenHienThiToHop')) +
                    fld('Nguyện vọng tối thiểu', inp('dNguyenVongToiThieuCanNhap')) + fld('Nguyện vọng tối đa', inp('dNguyenVongToiDaCanNhap')) +
                    fld('Khai theo mẫu', sel('strTS_MauHoSo_Id', 'Chọn mẫu hồ sơ')) + fld('Phương thức tuyển', sel('strDoiTuongDuTuyen_Id', 'Chọn phương thức tuyển')) +
                    fld('Đợt', sel('strDotTuyenSinh_Id', 'Chọn đợt')) + '<div aria-hidden="true"></div>' +
                    fld('Mô tả', '<textarea class="ums-textarea" data-d="strMoTa"></textarea>', true) +
                    '</div>'
            }) +
            '<div class="ums-u-mt-4" data-d="phi"></div>' +
            '<div class="ums-u-mt-4" data-d="lop"></div>' +
            '<div class="ums-u-mt-4" data-d="nganh"></div>';

        function q(k) { return host.querySelector('[data-d="' + k + '"]'); }
        ui.enhance(host);
        Array.prototype.forEach.call(host.querySelectorAll('[data-date]'), function (el) { ui.datepicker(el); });

        function datGT(el, v) {
            el.value = e(v);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
            if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y');
        }
        var nguon = Promise.all([
            K.mauHoSo().then(function (ds) { pat.fill(q('strTS_MauHoSo_Id'), ds, { name: 'TEN' }); }),
            ums.api.dm('TS.DOITUONGDUTUYEN').then(function (ds) { pat.fill(q('strDoiTuongDuTuyen_Id'), ds); }),
            ums.api.dm('TS.DOTTUYENSINH').then(function (ds) { pat.fill(q('strDotTuyenSinh_Id'), ds); })
        ]).catch(function (err) { ums.api.handle(err, 'danh mục đợt'); });

        /* ---- Khoản phí (lưu SAU đợt, như gốc) ---------------------------- */
        var gPhi = pat.rows(q('phi'), {
            title: 'Khoản phí', icon: 'fa-money-bill', addText: 'Thêm mới', minRows: 1,
            columns: [
                { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', title: 'Khoản phí', type: 'select', s2: true,
                  placeholder: 'Chọn khoản thu', source: { load: K.khoanThu, name: 'TEN' } },
                { key: 'dSoTien', col: 'SOTIEN', title: 'Số tiền', width: '150px' },
                { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', title: 'Thời gian', type: 'select', s2: true,
                  placeholder: 'Chọn thời gian', source: { load: K.thoiGian, name: 'DAOTAO_THOIGIANDAOTAO' } },
                { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' }
            ],
            list: function (id) {
                return { action: MH + 'DSA4BRIVEh4KJAkuICIpHhEpKB4FLjUP', func: PK + 'LayDSTS_KeHoach_Phi_Dot', method: 'POST',
                    strTuKhoa: '', strDoiTuongDuTuyen_Id: e(dot && dot.DOITUONGDUTUYEN_ID), strDotTuyenSinh_Id: id,
                    strTS_DotTS_DoiTuong_Id: id, strTaiChinh_CacKhoanThu_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', dSoTien: -1,
                    strMoTa: '', strTS_KeHoachTuyenSinh_Id: e(dot && dot.TS_KEHOACHTUYENSINH_ID), strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
            },
            filled: function (v) { return !!v.strTaiChinh_CacKhoanThu_Id; },
            save: function (v, rec, id) {
                var sua = !!rec;
                return { action: MH + (sua ? 'EjQgHhUSHgokCS4gIikeESkoHgUuNQPP' : 'FSkkLB4VEh4KJAkuICIpHhEpKB4FLjUP'),
                    func: PK + (sua ? 'Sua_TS_KeHoach_Phi_Dot' : 'Them_TS_KeHoach_Phi_Dot'), method: 'POST',
                    strId: sua ? rec.ID : '', dSoTien: pat.num(v.dSoTien), strMoTa: v.strMoTa,
                    strDoiTuongDuTuyen_Id: q('strDoiTuongDuTuyen_Id').value, strDotTuyenSinh_Id: id, strTS_DotTS_DoiTuong_Id: id,
                    strTS_KeHoachTuyenSinh_Id: kh.ID, strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id,
                    strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id };
            },
            remove: function (rec) { return { action: 'TS_KeHoach_Phi_Dot/Xoa', method: 'POST', strIds: rec.ID }; }
        });

        /* ---- Lớp dự kiến ------------------------------------------------- */
        var dsLop = [];
        q('lop').innerHTML = pat.panel({
            title: 'Lớp dự kiến', icon: 'fa-users-rectangle', flush: true,
            tools: ui.btn('add', { text: 'Thêm mới', mod: 'out-success', attr: { 'data-d': 'lopThem' } }) +
                ui.xoaChon('input[data-lck]', { goc: '.ums-panel', attr: { 'data-d': 'lopXoa' } }),
            body: '<div data-d="lopTbl"></div>'
        });
        function veLop() {
            ui.table({
                el: q('lopTbl'), rows: dsLop, empty: dot ? 'Chưa có lớp dự kiến' : 'Lưu đợt trước rồi mới thêm lớp dự kiến',
                columns: [
                    { title: 'Mã lớp', prop: 'DAOTAO_LOPQUANLY_MA', cls: 'is-nowrap' },
                    { title: 'Tên lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Số kế hoạch', prop: 'SOLUONGKEHOACH', cls: 'is-right' },
                    { title: 'Thực tế', prop: 'SOLUONGTHUCTE', cls: 'is-right' },
                    { title: 'Ngày tạo', prop: 'NGAY_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN', cls: 'is-nowrap' },
                    { title: 'Sửa', cls: 'is-center', width: '56px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-lsua="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                    } },
                    { head: '<input type="checkbox" data-d="lopAll" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-lck="' + i + '">'; } }
                ]
            });
        }
        function napLop() {
            if (!dot) { dsLop = []; veLop(); return Promise.resolve(); }
            return K.post({ action: TT + 'DSA4BRIVEh4FLjUeBS4oFTQuLyYeDS4xCS4i', func: PT + 'LayDSTS_Dot_DoiTuong_LopHoc',
                strTS_DoiTuongTS_DT_Id: dot.ID, strTS_KeHoachTuyenSinh_Id: kh.ID, strNguoiThucHien_Id: '' })
                .then(function (ds) { dsLop = ds; veLop(); })
                .catch(function (err) { dsLop = []; veLop(); ums.api.handle(err, 'lớp dự kiến'); });
        }
        /* Biểu mẫu "Lớp dự kiến" — NGAY TRONG TRANG, thay chỗ vùng Đợt phương thức (tầng hai; BO-CUC luật 1, trước 30/9 là hộp thoại) */
        function hopLop(rec) {
            var d = pat.formTrang({
                host: host,
                title: 'Lớp dự kiến', icon: 'fa-users-rectangle',
                body:
                    '<div style="grid-column:1 / -1">' + ui.field('Lớp quản lý', '<select class="ums-select" data-h="lop" data-ph="Chọn lớp quản lý"><option value=""></option></select>', { required: true }) + '</div>' +
                    '<div>' + ui.field('Số kế hoạch', '<input class="ums-input" data-h="sl" inputmode="numeric" autocomplete="off">') + '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                    var lop = api.body.querySelector('[data-h="lop"]').value;
                    if (!lop) { ui.toast('Vui lòng chọn lớp quản lý', 'warn'); return false; }
                    var sua = !!(rec && rec.ID);
                    ums.api.call({ action: TT + (sua ? 'EjQgHhUSHgUuNR4FLigVNC4vJh4NLjEJLiIP' : 'FSkkLB4VEh4FLjUeBS4oFTQuLyYeDS4xCS4i'),
                        func: PT + (sua ? 'Sua_TS_Dot_DoiTuong_LopHoc' : 'Them_TS_Dot_DoiTuong_LopHoc'), method: 'POST',
                        strId: sua ? rec.ID : '', strTS_DoiTuongTS_DT_Id: dot.ID, strTS_KeHoachTuyenSinh_Id: kh.ID,
                        strDaoTao_LopQuanLy_Id: lop, dSoLuongKeHoach: api.body.querySelector('[data-h="sl"]').value.trim(), strNguoiThucHien_Id: '' })
                        .then(function () { ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok'); api.close(); napLop(); })
                        .catch(function (err) { ums.api.handle(err, 'lưu lớp dự kiến'); });
                    return false;
                } }]
            });
            var sLop = d.body.querySelector('[data-h="lop"]');
            d.body.querySelector('[data-h="sl"]').value = e(rec && rec.SOLUONGKEHOACH);
            K.lopQL(kh.ID).then(function (ds) {
                pat.fill(sLop, ds, { name: 'TEN' });
                sLop.value = e(rec && rec.DAOTAO_LOPQUANLY_ID);
                if (window.jQuery) jQuery(sLop).trigger('change.select2');
            }).catch(function (err) { ums.api.handle(err, 'lớp quản lý'); });
        }
        q('lop').addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-d') === 'lopAll') {
                Array.prototype.forEach.call(q('lop').querySelectorAll('input[data-lck]'), function (x) { x.checked = ev.target.checked; });
            }
        });
        q('lop').addEventListener('click', function (ev) {
            if (ev.target.closest('[data-d="lopThem"]')) {
                if (!dot) { ui.toast('Lưu đợt trước rồi mới thêm lớp dự kiến', 'warn'); return; }
                hopLop(null); return;
            }
            var s = ev.target.closest('[data-lsua]');
            if (s) { hopLop(dsLop[Number(s.getAttribute('data-lsua'))]); return; }
            if (ev.target.closest('[data-d="lopXoa"]')) {
                var chon = Array.prototype.filter.call(q('lop').querySelectorAll('input[data-lck]'), function (x) { return x.checked; })
                    .map(function (x) { return dsLop[Number(x.getAttribute('data-lck'))]; });
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá lớp dự kiến' }).then(function (yes) {
                    if (!yes) return;
                    return ui.batch(chon.map(function (r) {
                        return { action: TT + 'GS4gHhUSHgUuNR4FLigVNC4vJh4NLjEJLiIP', func: PT + 'Xoa_TS_Dot_DoiTuong_LopHoc', method: 'POST',
                            strId: r.ID, strNguoiThucHien_Id: '' };
                    }), { title: 'Đang xoá lớp dự kiến', okText: 'Đã xoá' }).then(napLop);
                });
            }
        });

        /* ---- Ngành nghề dự kiến mở cho đợt tuyển sinh ------------------ */
        var dsNganh = [];
        q('nganh').innerHTML = pat.panel({
            title: 'Ngành nghề dự kiến mở cho đợt tuyển sinh', icon: 'fa-briefcase', flush: true,
            tools: ui.btn('add', { text: 'Thêm mới', mod: 'out-success', attr: { 'data-d': 'ngThem' } }) +
                ui.xoaChon('input[data-nck]', { goc: '.ums-panel', attr: { 'data-d': 'ngXoa' } }),
            body: '<div data-d="ngTbl"></div>'
        });
        function veNganh() {
            ui.table({
                el: q('ngTbl'), rows: dsNganh, empty: 'Chưa có ngành nghề dự kiến mở',
                columns: [
                    { title: 'Mã ngành', prop: 'NGANHNGHE_MA', cls: 'is-nowrap' },
                    { title: 'Tên ngành', prop: 'NGANHNGHE_TEN' },
                    { title: 'Tổ hợp xét', prop: 'DSTOHOP' },
                    { title: 'Mã ngành xét', prop: 'MANGANHNGHEXETTUYEN', cls: 'is-nowrap' },
                    { title: 'Xem', cls: 'is-center', width: '56px', render: function (r, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--view" data-nxem="' + i + '" title="Tổ hợp ngành nghề"><i class="fa-light fa-eye"></i></button>';
                    } },
                    { head: '<input type="checkbox" data-d="ngAll" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" data-nck="' + i + '">'; } }
                ]
            });
        }
        function napNganh() {
            if (!dot) { dsNganh = []; veNganh(); return Promise.resolve(); }
            return K.get({ action: 'TS_Dot_DT_NganhNghe/LayDanhSach', type: 'GET', strTuKhoa: '', strNganhNghe_Id: '',
                strDoiTuongDuTuyen_Id: e(dot.DOITUONGDUTUYEN_ID), strDotTuyenSinh_Id: e(dot.DOTTUYENSINH_ID),
                strTS_KeHoachTuyenSinh_Id: e(dot.TS_KEHOACHTUYENSINH_ID), strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (ds) { dsNganh = ds; veNganh(); })
                .catch(function (err) { dsNganh = []; veNganh(); ums.api.handle(err, 'ngành nghề'); });
        }
        q('nganh').addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-d') === 'ngAll') {
                Array.prototype.forEach.call(q('nganh').querySelectorAll('input[data-nck]'), function (x) { x.checked = ev.target.checked; });
            }
        });
        q('nganh').addEventListener('click', function (ev) {
            if (ev.target.closest('[data-d="ngThem"]')) { hopNganh(); return; }
            var x = ev.target.closest('[data-nxem]');
            if (x) { hopToHop(dsNganh[Number(x.getAttribute('data-nxem'))]); return; }
            if (ev.target.closest('[data-d="ngXoa"]')) {
                var chon = Array.prototype.filter.call(q('nganh').querySelectorAll('input[data-nck]'), function (c) { return c.checked; })
                    .map(function (c) { return dsNganh[Number(c.getAttribute('data-nck'))]; });
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá ngành nghề' }).then(function (yes) {
                    if (!yes) return;
                    return ui.batch(chon.map(function (r) {
                        return { action: 'TS_Dot_DT_NganhNghe/Xoa', method: 'POST', strIds: r.ID };
                    }), { title: 'Đang xoá ngành nghề', okText: 'Đã xoá' }).then(function () { napNganh(); if (o.onDoi) o.onDoi(); });
                });
            }
        });

        /* Hộp "Ngành nghề" — danh mục TUYENSINH.NGANHNGHE, mỗi dòng nhập mã ngành xét tuyển */
        function hopNganh() {
            var ds = [];
            var d = ui.dialog({
                title: 'Ngành nghề', icon: 'fa-briefcase', size: 'lg',
                body: '<div data-h="tbl"></div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                    var chon = Array.prototype.filter.call(api.body.querySelectorAll('input[data-hck]'), function (c) { return c.checked; })
                        .map(function (c) { return ds[Number(c.getAttribute('data-hck'))]; });
                    if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                    var calls = chon.map(function (r) {
                        var ma = api.body.querySelector('input[data-hma="' + ds.indexOf(r) + '"]');
                        return { action: 'TS_Dot_DT_NganhNghe/ThemMoi', type: 'POST', method: 'POST', strId: '', strNganhNghe_Id: r.ID,
                            strTS_Dot_DoiTuong_Id: dot.ID, strTS_KeHoachTuyenSinh_Id: kh.ID, strDoiTuongDuTuyen_Id: e(dot.DOITUONGDUTUYEN_ID),
                            strMaNganhNgheXetTuyen: ma ? ma.value.trim() : '', strDotTuyenSinh_Id: e(dot.DOTTUYENSINH_ID) };
                    });
                    api.close();
                    ui.batch(calls, { title: 'Đang thêm ngành nghề', okText: 'Thêm mới thành công' }).then(function () { napNganh(); if (o.onDoi) o.onDoi(); });
                    return false;
                } }]
            });
            var el = d.body.querySelector('[data-h="tbl"]');
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            K.nganhNghe().then(function (rows) {
                ds = rows || [];
                ui.table({
                    el: el, rows: ds, empty: 'Chưa có danh mục ngành nghề',
                    columns: [
                        { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                        { title: 'Tên', prop: 'TEN' },
                        { title: 'Mã ngành', width: '180px', render: function (r, i) {
                            return '<input class="ums-input ums-input--sm" data-hma="' + i + '" value="' + esc(e(r.MANGANHNGHEXETTUYEN)) + '" autocomplete="off">';
                        } },
                        { head: '<input type="checkbox" data-hall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (r, i) { return '<input type="checkbox" data-hck="' + i + '">'; } }
                    ]
                });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh mục ngành nghề'); });
            d.body.addEventListener('change', function (ev) {
                if (ev.target.hasAttribute('data-hall')) {
                    Array.prototype.forEach.call(d.body.querySelectorAll('input[data-hck]'), function (c) { c.checked = ev.target.checked; });
                }
            });
        }

        /* Màn con "Tổ hợp ngành nghề" — tổ hợp / môn của MỘT ngành trong đợt (danh sách + thêm + xoá), mở NGAY TRONG TRANG
           thay chỗ vùng Đợt phương thức (tầng hai; trước 30/9 là hộp thoại); đóng thì nạp lại ngành. Thêm = hộp CHỌN môn thi (giữ hộp thoại). */
        function hopToHop(ng) {
            var ds = [];
            var d = pat.formTrang({
                host: host,
                title: 'Tổ hợp ngành nghề', icon: 'fa-books', cols: 1,
                body: '<div class="ums-kv"><span>Ngành nghề</span><b>' + esc(e(ng.NGANHNGHE_MA) + ' - ' + e(ng.NGANHNGHE_TEN)) + '</b></div>' +
                    '<div class="ums-row ums-row--between ums-u-mt-4"><div class="ums-legend ums-u-mb-0">Thêm tổ hợp</div>' +
                    ui.btn('add', { text: 'Thêm mới', mod: 'out-success', cls: 'ums-btn--sm', attr: { 'data-h': 'them' } }) + '</div>' +
                    '<div class="ums-u-mt-2" data-h="tbl"></div>',
                xoa: { chon: 'input[data-tck]', onClick: function () { xoa(); } },
                onClose: function () { napNganh(); if (o.onDoi) o.onDoi(); }
            });
            var el = d.body.querySelector('[data-h="tbl"]');
            function nap() {
                el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return K.get({ action: 'TS_ToHop_Mon_Nganh_Dot/LayDanhSach', type: 'GET', strTuKhoa: '', strNganhNghe_Id: e(ng.NGANHNGHE_ID),
                    strDoiTuongDuTuyen_Id: e(ng.DOITUONGDUTUYEN_ID), strDotTuyenSinh_Id: e(ng.DOTTUYENSINH_ID),
                    strTS_KeHoachTuyenSinh_Id: e(ng.TS_KEHOACHTUYENSINH_ID), strTS_ToHop_Id: '', strTS_MonThi_Id: '', strNguoiTao_Id: '',
                    pageIndex: 1, pageSize: 10000 }).then(function (rows) { ds = rows; ve(); })
                    .catch(function (err) { ds = []; ve(); ums.api.handle(err, 'tổ hợp ngành nghề'); });
            }
            function ve() { bangMon(el, ds, 'data-tck', 'data-tall', 'Chưa có tổ hợp'); }
            function xoa() {
                var chon = Array.prototype.filter.call(el.querySelectorAll('input[data-tck]'), function (c) { return c.checked; })
                    .map(function (c) { return ds[Number(c.getAttribute('data-tck'))]; });
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá tổ hợp' }).then(function (yes) {
                    if (!yes) return;
                    return ui.batch(chon.map(function (r) { return { action: 'TS_ToHop_Mon_Nganh_Dot/Xoa', method: 'POST', strIds: r.ID }; }),
                        { title: 'Đang xoá tổ hợp', okText: 'Đã xoá' }).then(nap);
                });
            }
            d.body.addEventListener('change', function (ev) {
                if (ev.target.hasAttribute('data-tall')) {
                    Array.prototype.forEach.call(el.querySelectorAll('input[data-tck]'), function (c) { c.checked = ev.target.checked; });
                }
            });
            d.body.addEventListener('click', function (ev) {
                if (ev.target.closest('[data-h="them"]')) hopMonThi(ng, nap);
            });
            nap();
        }

        /* Hộp "Thêm mới - Tổ hợp" — danh sách TS_ToHop_MonThi, đánh dấu rồi Lưu */
        function hopMonThi(ng, sau) {
            var ds = [];
            var d = ui.dialog({
                title: 'Thêm mới - Tổ hợp', icon: 'fa-plus', size: 'lg',
                body: '<div data-h="tbl"></div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) {
                    var chon = Array.prototype.filter.call(api.body.querySelectorAll('input[data-mck]'), function (c) { return c.checked; })
                        .map(function (c) { return ds[Number(c.getAttribute('data-mck'))]; });
                    if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                    api.close();
                    ui.batch(chon.map(function (m) {
                        return { action: 'TS_ToHop_Mon_Nganh_Dot/ThemMoi', type: 'POST', method: 'POST',
                            strNganhNghe_Id: e(ng.NGANHNGHE_ID), strTS_Dot_DoiTuong_Id: e(ng.TS_DOTTUYENSINH_DOITUONG_ID),
                            strTS_KeHoachTuyenSinh_Id: e(ng.TS_KEHOACHTUYENSINH_ID), strDoiTuongDuTuyen_Id: e(ng.DOITUONGDUTUYEN_ID),
                            strDotTuyenSinh_Id: e(ng.DOTTUYENSINH_ID), strPhanLoai_Id: e(m.PHANLOAI_ID), strTS_ToHop_Id: e(m.TS_TOHOP_ID),
                            strTS_MonThi_Id: e(m.TS_MONTHI_ID), strTinhChat_Id: e(m.TINHCHAT_ID) };
                    }), { title: 'Đang thêm tổ hợp', okText: 'Thêm mới thành công' }).then(sau);
                    return false;
                } }]
            });
            var el = d.body.querySelector('[data-h="tbl"]');
            el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            K.monThi().then(function (rows) { ds = rows; bangMon(el, ds, 'data-mck', 'data-mall', 'Chưa có tổ hợp môn thi'); })
                .catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tổ hợp môn thi'); });
            d.body.addEventListener('change', function (ev) {
                if (ev.target.hasAttribute('data-mall')) {
                    Array.prototype.forEach.call(el.querySelectorAll('input[data-mck]'), function (c) { c.checked = ev.target.checked; });
                }
            });
        }
        function bangMon(el, ds, ck, all, rong) {
            ui.table({
                el: el, rows: ds, empty: rong,
                columns: [
                    { title: 'Tổ hợp', prop: 'TS_TOHOP_TEN' },
                    { title: 'Môn', prop: 'TS_MONTHI_TEN' },
                    { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
                    { title: 'Tính chất', prop: 'TINHCHAT_TEN' },
                    { head: '<input type="checkbox" ' + all + ' title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r, i) { return '<input type="checkbox" ' + ck + '="' + i + '">'; } }
                ]
            });
        }

        /* ---- Đổ biểu mẫu + chế độ thêm / sửa ------------------------------ */
        var KEYS = { strMa: 'MA', strTen: 'TEN', strNgayBatDau: 'NGAYBATDAU', strNgayKetThuc: 'NGAYKETTHUC', strTS_MauHoSo_Id: 'TS_MAUHOSO_ID',
            strDoiTuongDuTuyen_Id: 'DOITUONGDUTUYEN_ID', strMoTa: 'MOTADIEUKIENXET', strDotTuyenSinh_Id: 'DOTTUYENSINH_ID', iThuTu: 'THUTU',
            strTenHienThiToHop: 'TENHIENTHITOHOP', dNguyenVongToiThieuCanNhap: 'NGUYENVONGTOITHIEUCANNHAP', dNguyenVongToiDaCanNhap: 'NGUYENVONGTOIDACANNHAP' };
        function cheDo() {
            q('xoa').hidden = !dot;
            q('nganh').hidden = !dot;             // gốc: $("#zoneNganhNghe").hide() khi thêm mới
            nguon.then(function () { Object.keys(KEYS).forEach(function (k) { datGT(q(k), dot ? dot[KEYS[k]] : ''); }); });
            if (dot) gPhi.load(dot.ID); else gPhi.clear();
            napLop();
            napNganh();
        }
        cheDo();

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-d]');
            if (!b || !host.contains(b)) return;
            var k = b.getAttribute('data-d');
            if (k === 'dong') { if (o.onDong) o.onDong(); return; }
            if (k === 'luu') { luu(b); return; }
            if (k === 'xoa') {
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá đợt' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: 'TS_Dot_DoiTuong/Xoa', method: 'POST', strIds: dot.ID }).then(function () {
                        ui.toast('Xóa dữ liệu thành công!', 'ok');
                        if (o.onDong) o.onDong();
                    });
                }).catch(function (err) { ums.api.handle(err, 'xoá đợt'); });
            }
        });

        function luu(btn) {
            var v = {};
            Object.keys(KEYS).forEach(function (k) { v[k] = (q(k).value || '').trim(); });
            var sua = !!dot;
            var call = {
                action: sua ? 'TS_Dot_DoiTuong/CapNhat' : 'TS_Dot_DoiTuong/ThemMoi', method: 'POST',
                strId: sua ? dot.ID : '', strTen: v.strTen, strMa: v.strMa, strMoTa: v.strMoTa,
                strNgayBatDau: v.strNgayBatDau, strNgayKetThuc: v.strNgayKetThuc, strDoiTuongDuTuyen_Id: v.strDoiTuongDuTuyen_Id,
                strDotTuyenSinh_Id: v.strDotTuyenSinh_Id, strMoTaDieuKienXet: v.strMoTa, strTS_MauHoSo_Id: v.strTS_MauHoSo_Id,
                strTS_KeHoachTuyenSinh_Id: kh.ID, iThuTu: v.iThuTu, strTenHienThiToHop: v.strTenHienThiToHop,
                dNguyenVongToiThieuCanNhap: v.dNguyenVongToiThieuCanNhap, dNguyenVongToiDaCanNhap: v.dNguyenVongToiDaCanNhap
            };
            btn.disabled = true;
            ums.api.call(call).then(function (r) {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                var id = sua ? dot.ID : ((r.raw && r.raw.Id) || '');
                return gPhi.save(id).then(function () {
                    if (o.onDoi) o.onDoi();
                    return K.dsDot(kh.ID).then(function (ds) {
                        var moi = ds.filter(function (x) { return x.ID === id; })[0];
                        if (moi) dot = moi;
                        cheDo();
                    });
                });
            }).catch(function (err) { ums.api.handle(err, 'lưu đợt'); })
              .then(function () { btn.disabled = false; });
        }

        return { dong: function () {} };
    };
})();
