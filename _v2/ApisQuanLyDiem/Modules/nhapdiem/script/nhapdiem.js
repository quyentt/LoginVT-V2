/* =========================================================================
   Nhập điểm — bản Quản lý điểm: danh sách bảng điểm → lưới nhập điểm theo công thức (tiêu đề nhiều tầng).
   Bản gốc: ApisQuanLyDiem/Modules/nhapdiem/html/nhapdiem.html + script/nhapdiem.js (vỏ indexi).
   Bản anh em đã chuyển: ApisCongCanBo/Modules/nhapdiem/script/nhapdiem.js. Dùng lại:
     · lưới nhập điểm ums.nd.bangDiem (_chung.js — tách từ bản cổng cán bộ, cùng lời gọi D_CongThuc / D_Hoc_NguoiHoc /
       D_Hoc_NguoiHoc_Diem, cùng cách lưu → tính lại → nạp lại, Rubric);
     · hộp xác nhận KIỂU NÚT ums.nd.xacNhanNut (_xacnhan.js) — gốc Quản lý điểm vẽ các hành động thành nút (#zoneBtnXacNhan).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       D_LoaiDanhSach/LayLoaiDanhSach → D_ThoiGian/LayDanhSach (strLoaiDanhSach_Id; tự chọn mục đầu như selectFirst)
         → D_LopQuanLy/LayDanhSach (strLoaiDanhSach_Id, strDaoTao_ThoiGianDaoTao_Id)
         → D_HocPhan/LayDanhSach (strDaoTao_LopQuanLy_Id, strLoaiDanhSach_Id, strDaoTao_ThoiGianDaoTao_Id; tên "TEN - MA")
         → POST XLHV_TP_ToChucThi_MH · pkg_thi_tochucthi.LayDSDangKy_KeHoachDangKy (strTuKhoa '', thời gian, 1/100000; tên TENKEHOACH)
       D_Hoc/LayDanhSach (phân trang máy chủ; strTrangThai_Id / strNguoiTao_Id '' như gốc; strDangKy_KeHoachDangKy_Id = ô kế hoạch)
       Tệp của bảng điểm: ums.files (NS_Files) — gốc uploadFiles/viewFiles/saveFiles ở cột "Files"
       Xác nhận điểm thành phần / điểm danh (cả danh sách theo bộ lọc): POST D_NguoiHoc/XacNhanDiem_DanhSachHoc
         (strHanhDong_Id, strLoaiXacNhan_Id XACNHAN_HOANTHANH_NHAP | XACNHAN_HOANTHANH_DIEMDANH, bộ lọc; strNguoiDung_Id '' như gốc)
       Nhập điểm qua file (danh sách): ums.upload → D_Hoc_NguoiHoc_Diem_Import/Import (GET strPath)
       Nhập điểm mặc định: POST D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach (strDiemCanNhapMacDinh; strDiem_DanhSachHoc_Id '' ở danh
         sách, id bảng điểm ở lưới)
       Xác nhận / Công bố / Xác nhận điểm danh (một bảng điểm): D_XacNhan/Them_Diem_XacNhan (XACNHAN_HOANTHANH_NHAP / XACNHAN_CONGBODIEM /
         XACNHAN_HOANTHANH_DIEMDANH, strThongTinXacNhan = ô Nội dung) · lịch sử D_XacNhan/LayDSDiem_XacNhan
       Xác nhận từng sinh viên (điểm TP / điểm danh): Them_Diem_XacNhan với id = id bảng điểm + QLSV_NGUOIHOC_ID (ghép liền như gốc),
         XACNHAN_HOANTHANH_NHAP_NGUOIHOC / XACNHAN_HOANTHANH_DIEMDANH_NGUOIHOC
       Báo cáo theo mẫu: zonebtnBaoCao_DiemNgoai (danh sách) · zonebtnBaoCao_Diem (lưới, kèm id các bảng điểm đã đánh dấu)
       Tải bảng điểm / Nhập điểm qua file (lưới): ums.report.taiBangNhap / nhapBangTuTep
   Không chép (lỗi rõ / mã chết của gốc):
     · Lưu xong nạp lưới HAI lần (xem đầu nhapdiem.js cổng cán bộ) → một lần. Phím ↑/↓ nhảy sai ô → theo đúng cột.
     · Khung "Chỉnh sửa thông tin hiển thị bảng điểm" (#zone_edithienthi) không có lối mở (toggle_edithienthi không nơi nào gọi,
       save_CauHinhHienThiCot không tồn tại) → bỏ. Nút "Báo cáo" BangDiemEdit (#btnBaoCao) và "Xác nhận gia hạn"
       (.btnSaveXacNhanGiaHan) không có trong html → bỏ. Bảng lịch sử của hộp "Xác nhận điểm thành phần" không nơi nào nạp → bỏ.
     · Nút ở chân lưới lặp lại nút ở đầu → một bộ nút.
     · Hộp xác nhận từng SV gắn thêm trình xử lý bấm dòng MỖI lần mở (mở N lần = N lời gọi) → một lần.
   Chờ nghiệp vụ (giữ như gốc): xem _harness/_cq-nhapdiem.txt.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd;
    var root = document.getElementById('qld-nhapdiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }, o)); }
    function tenHP(x) { return e(x.TEN) + ' - ' + e(x.MA); }

    root.innerHTML =
        '<section data-v="ds">' + pat.page('Nhập điểm', '<span data-z="bcN"></span>' +
                ui.btn('confirm', { text: 'Xác nhận điểm thành phần', mod: 'out-primary', attr: { 'data-a': 'xnds' } }) +
                ui.btn('confirm', { text: 'Xác nhận điểm danh', mod: 'out-success', attr: { 'data-a': 'xntp' } }) +
                ui.btn('importer', { text: 'Nhập điểm qua file', attr: { 'data-a': 'nhapds' } }) +
                ui.btn('edit', { text: 'Nhập điểm mặc định', mod: 'out-info', attr: { 'data-a': 'mdds' } })) +
            pat.filterBar([{ key: 'loai', type: 'select', label: 'Chọn loại danh sách' }, { key: 'tg', type: 'select', label: 'Chọn thời gian' },
                { key: 'lql', type: 'select', label: 'Chọn lớp quản lý' }, { key: 'hp', type: 'select', label: 'Chọn học phần' },
                { key: 'kh', type: 'select', label: 'Chọn kế hoạch đăng ký học' }, { key: 'q', label: 'Nhập mã số hoặc tên' }]) +
            pat.panel({ title: 'Danh sách bảng điểm', icon: 'fa-list-timeline', count: 'nDS', flush: true, zone: 'ds' }) + '</section>' +
        '<section data-v="nd" hidden>' + pat.page('Nhập điểm', ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
            pat.panel({ title: 'Bảng điểm', icon: 'fa-table-cells', count: 'nND', flush: true,
                body: '<div class="nd-thanh">' +
                    '<div class="nd-thanh__trai"><span class="nd-hp" data-z="hp"></span>' +
                        '<div class="ums-field"><select class="ums-select" data-f="sx" data-no-s2><option value="ABC">Xếp theo ABC</option><option value="LOPQUANLY">Xếp theo Lớp quản lý</option><option value="MASO">Xếp theo Mã sinh viên</option></select></div></div>' +
                    '<div class="nd-thanh__phai">' +
                        ui.btn('edit', { text: 'Nhập điểm mặc định', mod: 'warn', attr: { 'data-a': 'md' } }) + '<span data-z="bc"></span>' +
                        ui.btn('excel', { text: 'Tải bảng điểm', icon: 'fa-file-arrow-down', mod: 'out-primary', attr: { 'data-a': 'tai' } }) +
                        ui.btn('search', { text: 'Nhập điểm qua file', icon: 'fa-file-arrow-up', mod: 'out-success', attr: { 'data-a': 'nhap' } }) +
                        ui.btn('save', { text: 'Công bố', icon: 'fa-bullhorn', mod: 'out-alt', attr: { 'data-a': 'congbo' } }) +
                        ui.btn('confirm', { text: 'Xác nhận', mod: 'out-danger', attr: { 'data-a': 'xacnhan' } }) +
                        ui.btn('confirm', { text: 'Xác nhận điểm danh', mod: 'out-warn', attr: { 'data-a': 'xndd' } }) +
                        ui.btn('confirm', { text: 'Xác nhận từng sinh viên - điểm TP', mod: 'out-info', attr: { 'data-a': 'svtp' } }) +
                        ui.btn('confirm', { text: 'Xác nhận từng sinh viên - điểm danh', mod: 'out-primary', attr: { 'data-a': 'svdd' } }) +
                        ui.btn('search', { text: 'Lấy điểm lại theo Rubric', icon: 'fa-calculator', mod: 'out-info', attr: { 'data-a': 'rubric' } }) +
                        ui.btn('search', { text: 'Tính lại', icon: 'fa-calculator', mod: 'out-alt', attr: { 'data-a': 'tinh' } }) + '</div></div>' +
                    '<div data-z="luoi"></div>' }) + '</section>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    var dang = 'ds', bd = null;
    function sang(k) { ui.swap(vung(dang), vung(k), { top: true }); dang = k; }

    /* ---------- 1. Bộ lọc ------------------------------------------------ */
    // Loại DS → Thời gian → {Lớp QL, Học phần, Kế hoạch ĐKH}. Học phần còn lọc theo Lớp QL (lọc tuỳ chọn — không khoá theo Lớp QL).
    var chain = pat.chain([f('loai'), f('tg'), f('hp')], { phatLai: false });
    var chainL = pat.chain([f('tg'), f('lql')], { phatLai: false });
    var chainK = pat.chain([f('tg'), f('kh')], { phatLai: false });
    function sync() { chain.sync(); chainL.sync(); chainK.sync(); }
    get('D_LoaiDanhSach/LayLoaiDanhSach').then(function (r) { pat.fill(f('loai'), arr(r.data), { head: 'Chọn loại danh sách' }); sync(); })
        .catch(function (err) { ums.api.handle(err, 'loại danh sách'); });
    function napTG() {
        if (!v('loai')) { ['tg', 'lql', 'hp', 'kh'].forEach(function (k) { pat.fill(f(k), []); }); sync(); return; }
        get('D_ThoiGian/LayDanhSach', { strLoaiDanhSach_Id: v('loai') }).then(function (r) {
            var d = arr(r.data);
            pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' });
            if (d.length) { f('tg').value = d[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); }   // selectFirst như gốc
            sync(); napTheoTG();
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    }
    function napTheoTG() {
        if (!v('tg')) { ['lql', 'hp', 'kh'].forEach(function (k) { pat.fill(f(k), []); }); sync(); return; }
        napLQL().then(napHP);
        napKH();
    }
    function napLQL() {
        return get('D_LopQuanLy/LayDanhSach', { strLoaiDanhSach_Id: v('loai'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('lql'), arr(r.data), { head: 'Chọn lớp quản lý' }); sync(); }).catch(function (err) { ums.api.handle(err, 'lớp quản lý'); });
    }
    function napHP() {
        if (!v('tg')) { pat.fill(f('hp'), []); sync(); return Promise.resolve(); }
        return get('D_HocPhan/LayDanhSach', { strDaoTao_LopQuanLy_Id: v('lql'), strLoaiDanhSach_Id: v('loai'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần', name: tenHP }); sync(); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    function napKH() {
        return ums.api.call({ action: 'XLHV_TP_ToChucThi_MH/DSA4BRIFIC8mCjgeCiQJLiAiKQUgLyYKOAPP', func: 'pkg_thi_tochucthi.LayDSDangKy_KeHoachDangKy',
            strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 })
            .then(function (r) { pat.fill(f('kh'), arr(r.data), { name: 'TENKEHOACH', head: 'Chọn kế hoạch đăng ký học' }); sync(); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch đăng ký học'); });
    }
    if (window.jQuery) {
        jQuery(f('loai')).on('select2:select select2:clear', napTG);
        jQuery(f('tg')).on('select2:select select2:clear', napTheoTG);
        jQuery(f('lql')).on('select2:select select2:clear', function () { napHP(); });
    }

    /* ---------- 2. Danh sách bảng điểm ---------------------------------- */
    var trang = 1, co = 10, DS = [];
    function thamLoc() {
        return { strTuKhoa: v('q'), strDaoTao_LopQuanLy_Id: v('lql'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strTrangThai_Id: '',
            strDangKy_KeHoachDangKy_Id: v('kh'), strLoaiDanhSach_Id: v('loai'), strNguoiDung_Id: uid(), strNguoiTao_Id: '' };
    }
    function taiDS() {
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return get('D_Hoc/LayDanhSach', Object.assign(thamLoc(), { pageIndex: trang, pageSize: co })).then(function (r) {
            DS = arr(r.data);
            var tong = Number(r.pager) || DS.length;
            z('nDS').textContent = '(' + tong + ')';
            function xn(x) { return String(x) === '1' ? ui.badge('Đã xác nhận', 'ok') : ''; }
            ui.table({ el: z('ds'), rows: DS, empty: 'Không có bảng điểm', columns: [
                { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } },
                { title: 'Loại danh sách', prop: 'LOAIDANHSACH_TEN' }, { title: 'Mã danh sách', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên danh sách', prop: 'TEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Giảng viên', prop: 'DSGIANGVIEN' },
                { title: 'Số lượng', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.SOLUONG) + '(' + e(x.TYLENHAPDIEM) + '%)'); } },
                { title: 'Đã xác nhận điểm TP', cls: 'is-center', render: function (x) { return xn(x.XACNHANHOANTHANHNHAPDIEM); } },
                { title: 'Đã xác nhận điểm danh', cls: 'is-center', render: function (x) { return xn(x.XACNHANHOANTHANHDIEMDANH); } },
                { title: 'Thời gian học', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.NGAYBATDAU) + '->' + e(x.NGAYKETTHUC)); } },
                { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
                { title: 'Files', cls: 'is-center', render: function (x, i) { return ui.btn('attach', { text: 'Tệp', cls: 'ums-btn--sm', attr: { 'data-tep': i } }); } },
                { title: 'Hiển thị', cls: 'is-center', render: function (x, i) { return ui.btn('search', { text: 'Chọn', icon: 'fa-pen-to-square', mod: 'primary', cls: 'ums-btn--sm', attr: { 'data-chon': i } }); } }],
                page: { index: trang, size: co, total: tong, onChange: function (p) { trang = p; taiDS(); }, onSize: function (s) { co = s === 'all' ? Math.max(tong, 1) : Number(s); trang = 1; taiDS(); } } });
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách bảng điểm'); });
    }
    z('ds').innerHTML = ui.empty('Chọn bộ lọc rồi bấm "Tìm kiếm" để xem danh sách bảng điểm', 'fa-hand-pointer');
    function daChonDS() {
        return Array.prototype.filter.call(z('ds').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return (DS[Number(c.getAttribute('data-ck'))] || {}).ID; }).filter(Boolean);
    }
    function moTep(x) {
        var dlg = ui.dialog({ title: 'Tệp đính kèm — ' + e(x.MA), icon: 'fa-paperclip', size: 'md', body: '<div data-x="tep"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                tep.save(x.ID).then(function () { ui.toast('Đã lưu tệp đính kèm', 'ok'); }).catch(function (err) { ums.api.handle(err, 'lưu tệp'); });
            } }] });
        var tep = ums.files.mount(dlg.body.querySelector('[data-x="tep"]'), { api: 'NS_Files' });
        tep.load(x.ID);
    }
    function reportChung(add) {
        var t = thamLoc();
        add('strTuKhoa', t.strTuKhoa); add('strDaoTao_LopQuanLy_Id', t.strDaoTao_LopQuanLy_Id); add('strChucNang_Id', cn()); add('strDaoTao_ThoiGianDaoTao_Id', t.strDaoTao_ThoiGianDaoTao_Id);
        add('strDaoTao_HocPhan_Id', t.strDaoTao_HocPhan_Id); add('strTrangThai_Id', '');
        return t;
    }
    function reportDuoi(add, t) {
        add('strLoaiDanhSach_Id', t.strLoaiDanhSach_Id); add('strNguoiDung_Id', uid()); add('strNguoiTao_Id', ''); add('strNguoiThucHien_Id', uid());
        add('strDiem_DanhSachHoc_Id', bd ? bd.ID : ''); add('strQLSV_NguoiHoc_Id', ''); add('strDiem_DanhSach_NguoiHoc_Id', ''); add('strKyHieuCotDuLieu', '');
    }
    // zonebtnBaoCao_DiemNgoai — gốc gửi strDangKy_KeHoachDangKy_Id RỖNG (dropAAAA) ở vùng này
    ums.report.mount(z('bcN'), { import: false, collect: function (add) { var t = reportChung(add); add('strDangKy_KeHoachDangKy_Id', ''); reportDuoi(add, t); } });
    // zonebtnBaoCao_Diem — gửi kế hoạch đăng ký học + id MỌI bảng điểm đang đánh dấu ở danh sách
    ums.report.mount(z('bc'), { import: false, tables: function () { var t = document.getElementById('tblNhapDiem'); return t ? [t] : []; }, collect: function (add) {
        var t = reportChung(add); add('strDangKy_KeHoachDangKy_Id', t.strDangKy_KeHoachDangKy_Id); reportDuoi(add, t);
        daChonDS().forEach(function (id) { add('strDiem_DanhSachHoc_Id', id); });
    } });

    /* ---------- 3. Các thao tác theo bộ lọc (đầu danh sách) -------------- */
    function xacNhanDS(loai) {
        nd.xacNhanNut({ loai: loai, tieuDe: 'Xác nhận', chuDe: loai === 'XACNHAN_HOANTHANH_DIEMDANH' ? 'Điểm danh (theo bộ lọc)' : 'Điểm thành phần (theo bộ lọc)', noiDung: false,
            luu: function (hd) {
                var t = thamLoc();
                return ums.api.call({ action: 'D_NguoiHoc/XacNhanDiem_DanhSachHoc', method: 'POST', strTuKhoa: '', strChucNang_Id: cn(), strHanhDong_Id: hd, strLoaiXacNhan_Id: loai,
                    strDaoTao_LopQuanLy_Id: t.strDaoTao_LopQuanLy_Id, strDaoTao_ThoiGianDaoTao_Id: t.strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id: t.strDaoTao_HocPhan_Id,
                    strTrangThai_Id: '', strDangKy_KeHoachDangKy_Id: '', strLoaiDanhSach_Id: t.strLoaiDanhSach_Id, strNguoiDung_Id: '', strNguoiThucHien_Id: uid(), strNguoiTao_Id: '' })
                    .then(function () { ui.toast('Xác nhận thành công', 'ok'); }).catch(function (err) { ums.api.handle(err, 'xác nhận'); });
            } });
    }
    function nhapMacDinh(dsId) {
        var dlg = ui.dialog({ title: 'Nhập điểm mặc định', icon: 'fa-pen-to-square', size: 'sm',
            body: '<p class="ums-u-fz13">Bạn có chắc chắn muốn nhập điểm mặc định cho danh sách?</p>' + ui.field('Điểm mặc định', '<input class="ums-input" data-x="md" autocomplete="off">'),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                var t = thamLoc();
                ums.api.call({ action: 'D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach', method: 'POST', strTuKhoa: t.strTuKhoa, strChucNang_Id: cn(), strUngDung_Id: vt(),
                    strDaoTao_LopQuanLy_Id: t.strDaoTao_LopQuanLy_Id, strDaoTao_ThoiGianDaoTao_Id: t.strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id: t.strDaoTao_HocPhan_Id,
                    strTrangThai_Id: '', strDangKy_KeHoachDangKy_Id: '', strLoaiDanhSach_Id: t.strLoaiDanhSach_Id, strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid(), strNguoiTao_Id: '',
                    strDiemCanNhapMacDinh: (dlg.body.querySelector('[data-x="md"]').value || '').trim(), strDiem_DanhSachHoc_Id: dsId })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); if (dsId && dang === 'nd') luoi.tai(); })
                    .catch(function (err) { ums.api.handle(err, 'nhập điểm mặc định'); });
            } }] });
    }
    function nhapQuaFile() {
        var dlg = ui.dialog({ title: 'Nhập điểm từ file excel', icon: 'fa-file-excel', size: 'md',
            body: ui.field('Chọn file excel', ui.file({ key: 'tep', accept: '.xls,.xlsx' })) + '<div data-x="kq" class="ums-u-mt-3"></div>',
            buttons: [{ text: 'Upload', kind: 'importer', onClick: function () {
                var inp = dlg.body.querySelector('input[type="file"]'), kq = dlg.body.querySelector('[data-x="kq"]');
                if (!inp.files || !inp.files.length) { ui.toast('Bạn chưa chọn file nào!', 'warn'); return false; }
                kq.innerHTML = ui.empty('Đang tải lên…', 'fa-spinner fa-spin');
                ums.upload(inp.files).then(function (duongDan) {
                    return ums.api.call({ action: 'D_Hoc_NguoiHoc_Diem_Import/Import', method: 'GET', strPath: duongDan, strNguoiThucHien_Id: uid() });
                }).then(function (r) { kq.innerHTML = '<p class="ums-u-fz13">Đã import dữ liệu: ' + esc(e(r.data)) + '</p>'; })
                    .catch(function (err) { kq.innerHTML = ui.fail('Lỗi: ' + err.message); });
                return false;
            } }] });
    }

    /* ---------- 4. Lưới nhập điểm --------------------------------------- */
    var luoi = nd.bangDiem(z('luoi'), { he10: false, dem: z('nND'), bd: function () { return bd; }, sx: function () { return v('sx'); } });
    ums.api.dm('DIEM.NHAPDIEM.SAPXEP').then(function (d) { if (d && d.length) f('sx').innerHTML = d.map(function (x) { return '<option value="' + esc(x.ID) + '">' + esc(e(x.TEN)) + '</option>'; }).join(''); }).catch(function () {});
    function moBang(x) {
        bd = x;
        z('hp').textContent = e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN);
        if (dang !== 'nd') sang('nd');
        luoi.tai();
    }
    function xacNhanBang(loai, tieuDe) {
        nd.xacNhanNut({ loai: loai, tieuDe: tieuDe, chuDe: e(bd.DAOTAO_HOCPHAN_MA) + ' - ' + e(bd.DAOTAO_HOCPHAN_TEN), ids: [bd.ID], lichSu: bd.ID });
    }
    function xacNhanTungSV(loai, chuDe) {
        var NH = luoi.NH(), COT = luoi.COT(), cot3 = COT.nh.slice(1, 4);
        if (!NH.length) { ui.toast('Bảng điểm chưa có người học', 'warn'); return; }
        var TT = {};
        nd.xacNhanNut({ loai: loai, tieuDe: 'Xác nhận', chuDe: chuDe, lichSu: '', lichSuRong: 'Bấm một dòng để xem lịch sử xác nhận', size: 'xl', truoc: '<div data-x="dssv"></div>',
            onBody: function (dlg) {
                var host = dlg.body.querySelector('[data-x="dssv"]');
                function ve() {
                    ui.table({ el: host, rows: NH, empty: 'Không có người học', columns: cot3.map(function (c) { return { title: e(c.TENCOT), render: function (x) { return ui.escBr(x[c.MACOT]); } }; }).concat([
                        { title: 'Tình trạng', cls: 'is-center', render: function (x) { return esc(TT[x.QLSV_NGUOIHOC_ID] || ''); } },
                        { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-sv="' + i + '">'; } }]) });
                }
                ve();
                nd.pool(NH, function (x) { return nd.trangThai(bd.ID + x.QLSV_NGUOIHOC_ID, loai).then(function (t) { TT[x.QLSV_NGUOIHOC_ID] = t; }); }, 10).then(ve);
                host.addEventListener('change', function (ev) {
                    if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(host.querySelectorAll('input[data-sv]'), function (c) { c.checked = ev.target.checked; });
                });
                host.addEventListener('click', function (ev) {
                    if (ev.target.closest('input')) return;
                    var tr = ev.target.closest('tbody tr'), c = tr && tr.querySelector('input[data-sv]');
                    if (!c) return;
                    Array.prototype.forEach.call(host.querySelectorAll('tbody tr'), function (r) { r.classList.toggle('is-selected', r === tr); });
                    dlg.lichSu(bd.ID + NH[Number(c.getAttribute('data-sv'))].QLSV_NGUOIHOC_ID);
                });
                dlg.chonSV = function () {
                    return Array.prototype.filter.call(host.querySelectorAll('input[data-sv]:checked'), function () { return true; })
                        .map(function (c) { return bd.ID + NH[Number(c.getAttribute('data-sv'))].QLSV_NGUOIHOC_ID; });
                };
            },
            luu: function (hd, noiDung, dlg) {
                var ids = dlg.chonSV();
                if (!ids.length) { ui.toast('Vui lòng chọn người học', 'warn'); return false; }
                return nd.luuXacNhan(ids, hd, loai, noiDung);
            } });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute('data-ck') === 'all') { Array.prototype.forEach.call(t.closest('table').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; }); return; }
        if (t === f('sx')) luoi.hoiBo().then(function (yes) { if (yes) luoi.tai(); });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang = 1; taiDS(); } });
    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-chon]'))) { moBang(DS[Number(b.getAttribute('data-chon'))]); return; }
        if ((b = ev.target.closest('[data-tep]'))) { moTep(DS[Number(b.getAttribute('data-tep'))]); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') { trang = 1; taiDS(); }
        else if (a === 'xnds') xacNhanDS('XACNHAN_HOANTHANH_NHAP');
        else if (a === 'xntp') xacNhanDS('XACNHAN_HOANTHANH_DIEMDANH');
        else if (a === 'nhapds') nhapQuaFile();
        else if (a === 'mdds') nhapMacDinh('');
        else if (a === 'md') nhapMacDinh(bd.ID);
        else if (a === 'dong') luoi.hoiBo().then(function (yes) { if (yes) { bd = null; sang('ds'); taiDS(); } });
        else if (a === 'luu') luoi.luu();
        else if (a === 'tinh') ui.confirm('Bạn có chắc chắn muốn tính lại điểm không?', { title: 'Tính lại điểm' }).then(function (yes) { if (yes) luoi.tinhLai(); });
        else if (a === 'rubric') luoi.rubric();
        else if (a === 'xacnhan') xacNhanBang('XACNHAN_HOANTHANH_NHAP', 'Xác nhận');
        else if (a === 'congbo') xacNhanBang('XACNHAN_CONGBODIEM', 'Công bố');
        else if (a === 'xndd') xacNhanBang('XACNHAN_HOANTHANH_DIEMDANH', 'Xác nhận');
        else if (a === 'svtp') xacNhanTungSV('XACNHAN_HOANTHANH_NHAP_NGUOIHOC', 'Từng sinh viên - điểm thành phần');
        else if (a === 'svdd') xacNhanTungSV('XACNHAN_HOANTHANH_DIEMDANH_NGUOIHOC', 'Từng sinh viên - điểm danh');
        else if (a === 'tai') { var t = document.getElementById('tblNhapDiem'); if (t) ums.report.taiBangNhap(t); else ui.toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); }
        else if (a === 'nhap') { if (document.getElementById('tblNhapDiem')) ums.report.nhapBangTuTep({ onDone: luoi.danhDau }); else ui.toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); }
    });
})();
