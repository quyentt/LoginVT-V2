/* =========================================================================
   Đào tạo dự kiến học phần
   Bản gốc: ApisCongCanBo/Modules/hoatdong/html/dukienhocphan.html + script/dukienhocphan.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): bộ lọc → "Danh sách học phần dự kiến của đào tạo"
   → "Danh sách học phần khoa đề xuất" (Thêm theo CTĐT / Thêm theo đơn vị / Xóa)
   → nút "Lưu đề xuất tăng/giảm" + "Xác nhận" (tác động lên bảng dự kiến).
   Lời gọi (chép nguyên; mã hoá trừ khi ghi):
       Năm / Kế hoạch năm / Kế hoạch chi tiết: _kehoach.js (ums.hd.keHoach)
       Khoa QL / Hệ / Khoá / CT: ums.ref.cascadeQuyen (genBoLoc_HeKhoa — theo QUYỀN), ở màn và hai hộp thêm
       THONGTIN.LayDSKH_HocPhan_DuKien              bảng dự kiến (phân trang máy chủ)
       KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat bảng đề xuất (kiểu cũ + iM — sửa 27/9: bản trước quên iM; không theo kế hoạch — như gốc)
       THONGTIN.CapNhatTangGiamKhoaDeXuat           Lưu đề xuất tăng/giảm (mỗi ô đã đổi)
       THONGTIN.LayDSThoiGianTheo / Sua_KH_HocPhan_DuKien   biểu mẫu "Thời gian đề xuất" (trong trang — BO-CUC luật 1)
       XACNHAN.LayDSKH_Khoa_HP_XacNhan (strsanpham_Id — chữ s thường) / Them_KH_Khoa_HP_XacNhan   Xác nhận;
         trạng thái = danh mục KH.KHOA.HOCPHAN.XACNHAN
       THONGTIN.LayDSKH_HocPhan_CT / LayDSKH_HocPhan_DonVi   hộp thêm theo CTĐT / theo đơn vị
       CHUNG.LayThoiGianTheoCTDT                    ô Thời gian trong hai hộp thêm (theo Hệ / Khoá / CT)
       THONGTIN.Them_KH_HocPhan_DeXuat · Xoa_KH_HocPhan_DeXuat
   Mẫu báo cáo: Hệ / Khoá / CT / Khoa QL, KH chi tiết, KH năm, strDaoTao_ThoiGianDaoTao_Id = ID NĂM
   (gốc gửi nhầm như vậy — giữ), strTuKhoa.

   Không chép (lỗi rõ của bản gốc):
     · Ô "Thông tin" không lọc bảng dự kiến (gốc gửi 'txtAAAA') — ở đây có gửi.
     · Đồng ý ở hộp CTĐT nạp lại danh sách của hộp ĐƠN VỊ; cả hai hộp không nạp lại
       bảng đề xuất; sửa thời gian đề xuất nạp nhầm bảng khác → ở đây nạp đúng bảng.
     · Xác nhận gửi strThongTinXacNhan = ID sản phẩm — hộp không có ô nội dung → gửi rỗng.
     · Không kiểm đã chọn trạng thái / thời gian; ô tăng/giảm nhận chữ bất kỳ → kiểm là số.
     · Dòng chưa có thời gian mở "Thời gian đề xuất" với giá trị của dòng mở trước.
     · "Đồng ý" đóng khung ngay khi bấm (lưu lỗi là mất lựa chọn) → lưu xong mới đóng.
     · Nhãn "Khóa học" đặt nhầm trên ô Chương trình ở hộp đơn vị.
   Giữ như bản gốc: ô Thời gian bộ lọc chính bị chú thích ở html → mọi lời gọi gửi
   thời gian rỗng; bảng đề xuất không theo kế hoạch; hai hộp thêm không hỏi lại.
   Bỏ (không có đường vào): Lưu quy mô, Duyệt đề xuất, cột "tính chất" (chú thích ở gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('hd-dukienhocphan');
    var TT = 'KHCT_HoatDong_ThongTin_MH/', XN = 'KHCT_HoatDong_XacNhan_MH/', CH = 'KHCT_HoatDong_Chung_MH/';
    var P_TT = 'PKG_KEHOACH_HOATDONG_THONGTIN.', P_XN = 'PKG_KEHOACH_HOATDONG_XACNHAN.', P_CH = 'PKG_KEHOACH_HOATDONG_CHUNG.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function call(a, f, o) { return ums.api.call(Object.assign({ action: a, func: f, strNguoiThucHien_Id: uid() }, o)); }
    function ck(host) {
        return Array.prototype.filter.call(host.querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return Number(c.getAttribute('data-ck')); });
    }
    function cotCk() { return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }; }
    function danhDauHet(host) {
        host.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(host.querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
    }
    var G = ['Thông tin học phần dự kiến'];
    function cotHP(thoiGian) {
        return [
            { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: G, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: G },
            { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: G, cls: 'is-center' }, { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', group: G },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: G }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: G },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: G }, { title: 'Khối kiến thức', prop: 'KHOIKIENTHUC_TEN', group: G },
            { title: 'Định hướng', prop: 'DINHHUONG_TEN', group: G },
            thoiGian || { title: 'Thời gian trong chương trình', prop: 'THOIGIAN', group: G, cls: 'is-center' }
        ];
    }

    root.innerHTML =
        pat.page('Đào tạo dự kiến học phần', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'nam', label: 'Chọn năm', type: 'select' }, { key: 'khn', label: 'Chọn kế hoạch', type: 'select' },
            { key: 'khct', label: 'Chọn kế hoạch chi tiết', type: 'select' }, { key: 'kql', label: 'Chọn khoa quản lý', type: 'select' },
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' }, { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' },
            { key: 'ct', label: 'Chọn chương trình', type: 'select' }, { key: 'q', label: 'Thông tin' }
        ], { searchText: 'Xem danh sách' }) +
        pat.panel({ title: 'Danh sách học phần dự kiến của đào tạo', icon: 'fa-list-check', count: 'n1', flush: true, zone: 'dk',
            tools: ui.btn('save', { text: 'Lưu đề xuất tăng/giảm', mod: 'primary', attr: { 'data-a': 'tanggiam' } }) +
                ui.btn('save', { text: 'Xác nhận', icon: 'fa-circle-check', attr: { 'data-a': 'xacnhan' } }) }) +
        '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách học phần khoa đề xuất', icon: 'fa-lightbulb', count: 'n2', flush: true, zone: 'dx',
            tools: ui.btn('add', { text: 'Thêm học phần theo CTĐT', mod: 'out-primary', attr: { 'data-a': 'themct' } }) +
                ui.btn('add', { text: 'Thêm học phần theo đơn vị', attr: { 'data-a': 'themdv' } }) +
                ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-a': 'xoadx' } }) }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k).value.trim(); }
    z('dk').innerHTML = ui.empty('Chọn khoa quản lý rồi bấm "Xem danh sách"', 'fa-hand-pointer');
    z('dx').innerHTML = ui.empty('Chọn khoa quản lý rồi bấm "Xem danh sách"', 'fa-hand-pointer');
    danhDauHet(z('dk')); danhDauHet(z('dx'));
    ums.hd.keHoach({ nam: f('nam'), khn: f('khn'), khct: f('khct') });
    ums.ref.cascadeQuyen({ kql: f('kql'), he: f('he'), khoa: f('khoa'), ct: f('ct') });
    function locCB() { return { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') }; }

    /* ---------- Bảng dự kiến ------------------------------------------------ */
    var t1 = { index: 1, size: 10 }, t2 = { index: 1, size: 10 }, dk = [], dx = [];
    function taiDK() {
        z('dk').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return call(TT + 'DSA4BRIKCR4JLiIRKSAvHgU0CigkLwPP', P_TT + 'LayDSKH_HocPhan_DuKien', Object.assign({ strTuKhoa: v('q'), strDaoTao_ThoiGianDaoTao_Id: '',
            strKH_Nam_ChiTiet_Id: v('khct'), strKH_Nam_TongHop_Id: v('khn'), pageIndex: t1.index, pageSize: t1.size }, locCB())).then(function (r) {
            dk = arr(r.data);
            var tong = Number(r.pager) || dk.length;
            z('n1').textContent = '(' + tong + ')';
            ui.table({ el: z('dk'), rows: dk, empty: 'Không có học phần dự kiến',
                page: { index: t1.index, size: t1.size, total: tong, onChange: function (p) { t1.index = p; taiDK(); }, onSize: function (s) { t1.size = s; t1.index = 1; taiDK(); } },
                columns: cotHP({ title: 'Thời gian trong chương trình', group: G, cls: 'is-center', render: function (x, i) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-hk="' + i + '"><span>' + esc(e(x.THOIGIAN) || 'Sửa') + '</span></button>'; } }).concat([
                    { title: 'Số sv chưa hoàn thành', prop: 'SOSVCHUAHOANTHANH', cls: 'is-center' }, { title: 'Số sv đủ đk học', prop: 'SOSVDUDKHOC', cls: 'is-center' },
                    { title: 'Số lượng nhu cầu', prop: 'TONGSOLUONGBANDAU', cls: 'is-center' }, { title: 'Số điều chỉnh(tăng/giảm)', prop: 'TONGSOLUONGTANGGIAM', cls: 'is-center' },
                    { title: 'Tổng số dự kiến', prop: 'TONGSODUKIEN', cls: 'is-center' },
                    { title: 'Khoa đề xuất tăng/giảm', cls: 'is-center', width: '110px', render: function (x, i) {
                        return '<input class="ums-input ums-input--sm" data-tg="' + i + '" value="' + esc(e(x.TANGGIAMKHOADEXUAT)) + '" inputmode="numeric" autocomplete="off">'; } },
                    { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Đề xuất từ khoa', prop: 'DEXUATTUKHOA', cls: 'is-center' }, { title: 'Khoa xác nhận', prop: 'HANHDONG_TEN', cls: 'is-center' },
                    cotCk()
                ]) });
        }).catch(function (err) { z('dk').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần dự kiến'); });
    }
    function taiDX() {
        z('dx').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(Object.assign({ action: 'KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat', method: 'POST', iM: ums.session.iM, strTuKhoa: v('q'), strDaoTao_ThoiGianDaoTao_Id: '',
            strNguoiThucHien_Id: uid(), pageIndex: t2.index, pageSize: t2.size }, locCB())).then(function (r) {
            dx = arr(r.data);
            var tong = Number(r.pager) || dx.length;
            z('n2').textContent = '(' + tong + ')';
            ui.table({ el: z('dx'), rows: dx, empty: 'Không có học phần khoa đề xuất',
                page: { index: t2.index, size: t2.size, total: tong, onChange: function (p) { t2.index = p; taiDX(); }, onSize: function (s) { t2.size = s; t2.index = 1; taiDX(); } },
                columns: cotHP().concat([
                    { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Đào tạo duyệt đề xuất', prop: 'DEXUATTUKHOA', cls: 'is-center' }, cotCk()
                ]) });
        }).catch(function (err) { z('dx').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần đề xuất'); });
    }
    function tim() {
        if (!v('kql')) { ui.toast('Bạn cần chọn khoa quản lý', 'warn'); return; }
        t1.index = 1; t2.index = 1; taiDK(); taiDX();
    }

    /* ---------- Lưu đề xuất tăng/giảm -------------------------------------- */
    function luuTangGiam() {
        var doi = Array.prototype.filter.call(z('dk').querySelectorAll('input[data-tg]'), function (i) { return i.value.trim() !== String(e(dk[Number(i.getAttribute('data-tg'))].TANGGIAMKHOADEXUAT)); });
        if (!doi.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
        var sai = doi.filter(function (i) { return i.value.trim() && !/^-?\d+$/.test(i.value.trim()); });
        if (sai.length) { sai[0].focus(); ui.toast('Đề xuất tăng/giảm phải là số nguyên (có thể âm)', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' thay đổi?', { title: 'Lưu đề xuất tăng/giảm' }).then(function (yes) {
            if (!yes) return;
            ui.batch(doi.map(function (i) {
                return { action: TT + 'AiAxDykgNRUgLyYGKCAsCikuIAUkGTQgNQPP', func: P_TT + 'CapNhatTangGiamKhoaDeXuat', strNguoiThucHien_Id: uid(),
                    strKH_HocPhan_DuKien_Id: dk[Number(i.getAttribute('data-tg'))].ID, dTangGiamKhoaDeXuat: i.value.trim() };
            }), { title: 'Đang lưu', okText: 'Thực hiện thành công', show: true }).then(taiDK);
        });
    }

    /* ---------- Thời gian đề xuất ------------------------------------------- */
    function suaHocKy(x) {
        var dlg = pat.formTrang({ host: root, title: 'Thời gian đề xuất', icon: 'fa-calendar-pen',
            body: ui.field('Thời gian đề xuất', '<select class="ums-select" data-x="hk" data-ph="Chọn thời gian"><option value=""></option></select>'),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function (api) {
                if (!s.value) { ui.toast('Chọn thời gian đề xuất', 'warn'); return false; }
                call(TT + 'EjQgHgoJHgkuIhEpIC8eBTQKKCQv', P_TT + 'Sua_KH_HocPhan_DuKien', { strDaoTao_ThoiGianDaoTao_Id: s.value, strKH_HocPhan_DuKien_Id: x.ID })
                    .then(function () { ui.toast('Thực hiện thành công!', 'ok'); api.close(); taiDK(); }).catch(function (err) { ums.api.handle(err, 'thời gian đề xuất'); });
                return false;                                   // lưu xong mới đóng
            } }] });
        var s = dlg.body.querySelector('[data-x="hk"]'), macDinh = String(e(x.DAOTAO_THOIGIANDAOTAO_ID)).split(',')[0];
        call(TT + 'DSA4BRIVKS4oBiggLxUpJC4P', P_TT + 'LayDSThoiGianTheo', { strKH_HocPhan_DuKien_Id: x.ID }).then(function (r) {
            pat.fill(s, arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' });
            if (macDinh) { s.value = macDinh; if (window.jQuery) jQuery(s).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    }

    /* ---------- Xác nhận ----------------------------------------------------- */
    function xacNhan() {
        var chon = ck(z('dk')).map(function (i) { return dk[i]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var ids = chon.map(function (x) { return x.ID; });
        var dlg = ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'md',
            body: '<p class="ums-u-fz13 ums-u-muted">' + ids.length + ' học phần đã chọn</p>' +
                ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-ph="Chọn xác nhận"><option value=""></option></select>') +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                if (!s.value) { ui.toast('Chọn trạng thái xác nhận', 'warn'); return false; }
                var tt = s.value;
                ui.batch(ids.map(function (id) {
                    return { action: XN + 'FSkkLB4KCR4KKS4gHgkRHhkgIg8pIC8P', func: P_XN + 'Them_KH_Khoa_HP_XacNhan', strNguoiThucHien_Id: uid(),
                        strSanPham_Id: id, strNguoiXacnhan_Id: uid(), strThongTinXacNhan: '', strHanhDong_Id: tt };
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(taiDK);
            } }] });
        ui.enhance(dlg.body);
        var s = dlg.body.querySelector('[data-x="tt"]'), ls = dlg.body.querySelector('[data-x="ls"]');
        ums.api.dm('KH.KHOA.HOCPHAN.XACNHAN').then(function (d) { pat.fill(s, d, { name: 'TEN', head: 'Chọn xác nhận' }); }).catch(function () {});
        call(XN + 'DSA4BRIKCR4KKS4gHgkRHhkgIg8pIC8P', P_XN + 'LayDSKH_Khoa_HP_XacNhan', { strTuKhoa: '', strsanpham_Id: ids.join(','), strLoaiXacNhan_Id: '',
            strNguoiXacNhan_Id: '', strHanhDong_Id: '', strPhanLoaiLop_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
            ui.table({ el: ls, rows: arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                { title: 'Trạng thái', prop: 'TINHTRANG_TEN' }, { title: '', prop: 'NOIDUNG' }, { title: 'Người thực hiện', prop: 'NGUOIXACNHAN_TENDAYDU' },
                { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
        }).catch(function (err) { ls.innerHTML = ui.fail(err.message); });
    }

    /* ---------- Hai hộp thêm học phần (theo CTĐT / theo đơn vị) ------------ */
    function hopThem(theoDV) {
        if (!v('khct')) { ui.toast('Bạn cần chọn kế hoạch', 'warn'); return; }
        var ds = [], tr = { index: 1, size: 10 };
        var dlg = ui.dialog({
            title: theoDV ? 'Thêm học phần theo đơn vị vào kế hoạch' : 'Thêm học phần theo chương trình đào tạo vào kế hoạch', icon: 'fa-square-plus', size: 'xl',
            body: '<div class="ums-filter">' +
                    (theoDV ? '<div class="ums-field"><select class="ums-select" data-x="dv" data-ph="Chọn đơn vị"><option value=""></option></select></div>'
                            : '<div class="ums-field"><select class="ums-select" data-x="kql" data-ph="Chọn khoa quản lý"><option value=""></option></select></div>') +
                    '<div class="ums-field"><select class="ums-select" data-x="he" data-ph="Chọn hệ đào tạo"><option value=""></option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-x="khoa" data-ph="Chọn khóa học"><option value=""></option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-x="ct" data-ph="Chọn chương trình"><option value=""></option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-x="tg" data-ph="Chọn thời gian"><option value=""></option></select></div>' +
                    '<div class="ums-field"><input class="ums-input" data-x="q" placeholder="Thông tin" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem danh sách', attr: { 'data-x': 'tim' } }) + '</div>' +
                  '</div><div class="ums-u-mt-4" data-x="bang"></div>',
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () { dongY(); return false; } }]
        });
        var B = dlg.body;
        function x(k) { return B.querySelector('[data-x="' + k + '"]'); }
        function xv(k) { return x(k) ? x(k).value.trim() : ''; }
        ui.enhance(B); danhDauHet(B);
        if (theoDV) ums.ref.coCauToChuc({}).then(function (d) { pat.fill(x('dv'), d, { name: 'TEN', head: 'Chọn đơn vị' }); }).catch(function () {});
        ums.ref.cascadeQuyen({ kql: x('kql'), he: x('he'), khoa: x('khoa'), ct: x('ct') });
        function napTG() {
            call(CH + 'DSA4FSkuKAYoIC8VKSQuAhUFFQPP', P_CH + 'LayThoiGianTheoCTDT', { strTuKhoa: '', strDaoTao_CoCauToChuc_Id: xv('dv'), strDaoTao_HeDaoTao_Id: xv('he'),
                strDaoTao_KhoaDaoTao_Id: xv('khoa'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: xv('ct') }).then(function (r) {
                var d = arr(r.data); pat.fill(x('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' });
                if (d.length === 1) { x('tg').value = d[0].ID; if (window.jQuery) jQuery(x('tg')).trigger('change.select2'); }
            }).catch(function () {});
        }
        if (window.jQuery) jQuery([x('he'), x('khoa'), x('ct')]).on('select2:select select2:clear', napTG);
        function tai() {
            var host = x('bang');
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var ts = { strTuKhoa: xv('q'), strDaoTao_HeDaoTao_Id: xv('he'), strDaoTao_KhoaDaoTao_Id: xv('khoa'), strDaoTao_ThoiGianDaoTao_Id: xv('tg'),
                strDaoTao_ChuongTrinh_Id: xv('ct'), pageIndex: tr.index, pageSize: tr.size };
            var p = theoDV ? call(TT + 'DSA4BRIKCR4JLiIRKSAvHgUuLxco', P_TT + 'LayDSKH_HocPhan_DonVi', Object.assign({ strDaoTao_CoCauToChuc_Id: xv('dv') }, ts))
                       : call(TT + 'DSA4BRIKCR4JLiIRKSAvHgIV', P_TT + 'LayDSKH_HocPhan_CT', Object.assign({ strDaoTao_CoCauToChuc_Id: xv('kql') }, ts));
            p.then(function (r) {
                ds = arr(r.data);
                var tong = Number(r.pager) || ds.length, H = ['Thông tin học phần'], C = ['Thông tin chương trình'];
                ui.table({ el: host, rows: ds, empty: 'Không có học phần',
                    page: { index: tr.index, size: tr.size, total: tong, onChange: function (pg) { tr.index = pg; tai(); }, onSize: function (sz) { tr.size = sz; tr.index = 1; tai(); } },
                    columns: [
                        { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: H, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: H },
                        { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: H, cls: 'is-center' }, { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', group: H },
                        { title: 'Hệ', prop: 'DAOTAO_HEDAOTAO_TEN', group: C }, { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', group: C },
                        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: C }, { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: C, cls: 'is-center' },
                        { title: 'Khối kiến thức', prop: 'KHOIKIENTHUC_TEN', group: C }, { title: 'Định hướng', prop: 'DINHHUONG_TEN', group: C },
                        cotCk()
                    ] });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); });
        }
        function dongY() {
            var chon = ck(x('bang')).map(function (i) { return ds[i]; });
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            ui.batch(chon.map(function (r) {
                return { action: TT + 'FSkkLB4KCR4JLiIRKSAvHgUkGTQgNQPP', func: P_TT + 'Them_KH_HocPhan_DeXuat', strNguoiThucHien_Id: uid(), strKH_Nam_ChiTiet_Id: v('khct'),
                    strPhamViApDung_Id: e(r.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_HocPhan_Id: e(r.DAOTAO_HOCPHAN_ID), strDaoTao_ThoiGianDaoTao_Id: '' };
            }), { title: 'Đang thêm học phần', okText: 'Thực hiện thành công', show: true }).then(function () { tai(); taiDX(); });
        }
        B.addEventListener('click', function (ev) { if (ev.target.closest('[data-x="tim"]')) { tr.index = 1; tai(); } });
        x('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tr.index = 1; tai(); } });
        tai();
    }

    /* ---------- Xoá đề xuất -------------------------------------------------- */
    function xoaDX() {
        var chon = ck(z('dx')).map(function (i) { return dx[i]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (r) {
                return { action: TT + 'GS4gHgoJHgkuIhEpIC8eBSQZNCA1', func: P_TT + 'Xoa_KH_HocPhan_DeXuat', strId: r.ID, strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strNguoiThucHien_Id: uid() };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!', show: true }).then(taiDX);
        });
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        var c = locCB(); Object.keys(c).forEach(function (k) { add(k, c[k]); });
        add('strKH_Nam_ChiTiet_Id', v('khct')); add('strKH_Nam_TongHop_Id', v('khn')); add('strDaoTao_ThoiGianDaoTao_Id', v('nam')); add('strTuKhoa', v('q'));
    } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-hk]');
        if (b) { suaHocKy(dk[Number(b.getAttribute('data-hk'))]); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'tanggiam') luuTangGiam();
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'themct') hopThem(false);
        else if (a === 'themdv') hopThem(true);
        else if (a === 'xoadx') xoaDX();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
