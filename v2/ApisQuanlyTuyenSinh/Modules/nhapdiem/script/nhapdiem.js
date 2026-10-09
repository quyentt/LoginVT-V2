/* =========================================================================
   Nhập điểm tuyển sinh — danh sách bảng điểm → lưới nhập điểm theo công thức (tiêu đề nhiều tầng).
   Bản gốc: ApisQuanlyTuyenSinh/Modules/nhapdiem/html/nhapdiem.html + script/nhapdiem.js (vỏ indexi).
   Tệp gốc là BẢN CŨ của ApisQuanLyDiem/Modules/nhapdiem/script/nhapdiem.js (diff ~500 dòng / 1.467) — bản đó đã chuyển;
   ở đây dùng lại đúng các khối chung của nó (module nhapdiem Cổng cán bộ):
     · lưới nhập điểm ums.nd.bangDiem (_chung.js) — cờ MỚI chon: false (gốc Tuyển sinh không có cột "Chọn");
     · hộp xác nhận kiểu nút ums.nd.xacNhanNut (_xacnhan.js) — cờ MỚI idHanhDong (gốc gửi strDiem_DanhSachHoc_Id cho
       D_HanhDongXacNhan) + luu riêng (gốc lưu bằng D_XacNhan/XacNhan_DanhSachDiem, không phải Them_Diem_XacNhan).
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT: khung "Tìm kiếm" (Loại danh sách → Thời gian → Học phần · Lớp quản lý ẨN (display:none) · từ khoá ·
   Tìm kiếm · Nhập điểm mặc định · Nhập điểm qua file) → "Danh sách bảng điểm (n)": Loại DS · Mã DS · Tên DS · Mã HP · Tên HP ·
   Số lượng (SOLUONG(TYLENHAPDIEM%)) · Thời gian · Files · Hiển thị ("Chọn"). Chọn → khung "Nhập điểm: <mã - tên HP>" thay chỗ:
   ô sắp xếp · Nhập điểm mặc định · Xuất báo cáo ▾ · Tải bảng điểm · Nhập điểm qua file · Công bố · Xác nhận · Tính lại · Lưu.

   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
     D_LoaiDanhSach/LayLoaiDanhSach → D_ThoiGian/LayDanhSach (strLoaiDanhSach_Id)
       → D_HocPhan/LayDanhSach (strDaoTao_LopQuanLy_Id '' — ô ẩn, strLoaiDanhSach_Id, strDaoTao_ThoiGianDaoTao_Id)
     D_Hoc/LayDanhSach (phân trang máy chủ): strTuKhoa, strDaoTao_LopQuanLy_Id '', strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id,
       strTrangThai_Id '', strDangKy_KeHoachDangKy_Id '', strLoaiDanhSach_Id, strNguoiDung_Id, strNguoiTao_Id '', strNguoiThucHien_Id
     Tệp của bảng điểm: ums.files (NS_Files) — gốc uploadFiles/viewFiles/saveFiles trong ô "Files"
     Lưới: D_CongThuc/LayChiTiet → D_Hoc_NguoiHoc/LayDanhSach (strTieuChiSapXep = ô sắp xếp, danh mục DIEM.NHAPDIEM.SAPXEP)
       → D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach mỗi cột lá; Lưu: POST Nhan_Diem_NguoiHoc_ThanhPhan mỗi ô đổi;
       Tính lại: POST Tinh_Diem_NguoiHoc_ThanhPhan mỗi dòng (ums.nd.bangDiem)
     Nhập điểm qua file (danh sách): ums.upload → D_Hoc_NguoiHoc_Diem_Import/Import (GET strPath, strNguoiThucHien_Id)
     Nhập điểm mặc định: POST D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach (strDiemCanNhapMacDinh; strDiem_DanhSachHoc_Id '' ở danh
       sách, id bảng điểm ở lưới; strUngDung_Id = vai trò đang mở như edu.system.appId)
     Xác nhận / Công bố: D_HanhDongXacNhan/LayDanhSach (strLoaiXacNhan_Id XACNHAN_HOANTHANH_NHAP | XACNHAN_CONGBODIEM,
       strDiem_DanhSachHoc_Id) → nút; bấm nút → POST D_XacNhan/XacNhan_DanhSachDiem (strDiem_DanhSachHoc_Id, strHanhDong_Id,
       strLoaiXacNhan_Id, strThongTinXacNhan = ô Nội dung)
     Xuất báo cáo (zonebtnBaoCao_Diem — không có vùng Import): strTuKhoa, strDaoTao_LopQuanLy_Id '', strChucNang_Id,
       strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, strTrangThai_Id '', strDangKy_KeHoachDangKy_Id '', strLoaiDanhSach_Id,
       strNguoiDung_Id, strNguoiTao_Id '', strNguoiThucHien_Id, strDiem_DanhSachHoc_Id, strQLSV_NguoiHoc_Id '',
       strDiem_DanhSach_NguoiHoc_Id '', strKyHieuCotDuLieu ''
     Tải bảng điểm / Nhập điểm qua file (lưới): ums.report.taiBangNhap / nhapBangTuTep

   Không chép (mã chết / lỗi rõ của gốc):
     · Khung "Chỉnh sửa thông tin hiển thị bảng điểm" (#zone_edithienthi — bảng #tblHienThi, bộ chọn màu bootstrap-colorselector):
       KHÔNG có lối mở (toggle_edithienthi không nơi nào gọi) và các hàm lưu / thêm dòng / xoá (save_CauHinhHienThiCot,
       genHTML_CauHinhHienThiCot, delete_CauHinhHienThiCot) KHÔNG tồn tại → bỏ cả khung, không cần bộ chọn màu.
     · Nút "Báo cáo" BangDiemEdit (#btnBaoCao) không có trong html → bỏ. Bảng "Lịch sử Xác nhận" của hộp xác nhận không nơi nào
       nạp (genTable_XacNhanSanPham không ai gọi) → bỏ khối lịch sử.
     · Nút ở chân lưới lặp lại nút ở đầu → một bộ nút. Bảng tiêu đề "nhân bản" bám đỉnh khi cuộn (#clone) → không cần.
   Khác gốc / tự chốt (ghi báo cáo):
     · Lưu điểm xong TÍNH LẠI rồi nạp lại (ums.nd.bangDiem — như bản Quản lý điểm mới hơn); gốc Tuyển sinh chỉ nạp lại, người
       dùng tự bấm "Tính lại".
     · Tính lại gửi strDiem_DanhSach_NguoiHoc_Id = ID dòng người học (bản Quản lý điểm mới hơn); gốc Tuyển sinh gửi
       QLSV_NGUOIHOC_ID (id tr) — bản sau đã sửa, coi là lỗi của bản cũ.
     · Chọn Loại danh sách / Thời gian / Học phần tự tải lại danh sách như gốc; danh sách trả đúng MỘT bảng điểm thì tự mở như gốc.
   Cặp cha → con: Loại danh sách → Thời gian → Học phần (pat.chain). Lớp quản lý ẩn ở gốc nên không dựng.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd;
    var root = document.getElementById('ts-nhapdiem');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML =
        '<section data-v="ds">' + pat.page('Nhập điểm',
                ui.btn('edit', { text: 'Nhập điểm mặc định', mod: 'out-warn', attr: { 'data-a': 'mdds' } }) +
                ui.btn('importer', { text: 'Nhập điểm qua file', attr: { 'data-a': 'nhapds' } })) +
            pat.filterBar([{ key: 'loai', type: 'select', label: 'Chọn loại danh sách' }, { key: 'tg', type: 'select', label: 'Chọn thời gian' },
                { key: 'hp', type: 'select', label: 'Chọn học phần' }, { key: 'q', label: 'Nhập mã số hoặc tên' }]) +
            pat.panel({ title: 'Danh sách bảng điểm', icon: 'fa-list-timeline', count: 'nDS', flush: true, zone: 'ds',
                tools: ui.btn('reload', { attr: { 'data-a': 'search' } }) }) + '</section>' +
        '<section data-v="nd" hidden>' + pat.page('Nhập điểm', ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
            pat.panel({ title: 'Bảng điểm', icon: 'fa-table-cells', count: 'nND', flush: true,
                body: '<div class="nd-thanh">' +
                    '<div class="nd-thanh__trai"><span class="nd-hp" data-z="hp"></span>' +
                        '<div class="ums-field"><select class="ums-select" data-f="sx" data-no-s2><option value="ABC">Xếp theo ABC</option><option value="LOPQUANLY">Xếp theo Lớp quản lý</option></select></div></div>' +
                    '<div class="nd-thanh__phai">' +
                        ui.btn('edit', { text: 'Nhập điểm mặc định', mod: 'warn', attr: { 'data-a': 'md' } }) + '<span data-z="bc"></span>' +
                        ui.btn('excel', { text: 'Tải bảng điểm', icon: 'fa-file-arrow-down', mod: 'out-primary', attr: { 'data-a': 'tai' } }) +
                        ui.btn('search', { text: 'Nhập điểm qua file', icon: 'fa-file-arrow-up', mod: 'out-success', attr: { 'data-a': 'nhap' } }) +
                        ui.btn('save', { text: 'Công bố', icon: 'fa-bullhorn', mod: 'out-alt', attr: { 'data-a': 'congbo' } }) +
                        ui.btn('confirm', { text: 'Xác nhận', mod: 'out-danger', attr: { 'data-a': 'xacnhan' } }) +
                        ui.btn('search', { text: 'Tính lại', icon: 'fa-calculator', mod: 'out-alt', attr: { 'data-a': 'tinh' } }) + '</div></div>' +
                    '<div data-z="luoi"></div>' }) + '</section>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    var dang = 'ds', bd = null;
    function sang(k) { ui.swap(vung(dang), vung(k), { top: true }); dang = k; }

    /* ---------- 1. Bộ lọc: Loại DS → Thời gian → Học phần ------------------ */
    var chain = pat.chain([f('loai'), f('tg'), f('hp')], { phatLai: false });
    get('D_LoaiDanhSach/LayLoaiDanhSach').then(function (r) { pat.fill(f('loai'), arr(r.data), { head: 'Chọn loại danh sách' }); chain.sync(); })
        .catch(function (err) { ums.api.handle(err, 'loại danh sách'); });
    function napTG() {
        if (!v('loai')) { pat.fill(f('tg'), []); pat.fill(f('hp'), []); chain.sync(); return; }
        get('D_ThoiGian/LayDanhSach', { strLoaiDanhSach_Id: v('loai') }).then(function (r) {
            pat.fill(f('tg'), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); chain.sync();
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    }
    function napHP() {
        if (!v('tg')) { pat.fill(f('hp'), []); chain.sync(); return; }
        get('D_HocPhan/LayDanhSach', { strDaoTao_LopQuanLy_Id: '', strLoaiDanhSach_Id: v('loai'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần' }); chain.sync(); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    jQuery(f('loai')).on('select2:select select2:clear', function () { napTG(); trang = 1; taiDS(); });
    jQuery(f('tg')).on('select2:select select2:clear', function () { napHP(); trang = 1; taiDS(); });
    jQuery(f('hp')).on('select2:select select2:clear', function () { trang = 1; taiDS(); });

    /* ---------- 2. Danh sách bảng điểm ---------------------------------- */
    var trang = 1, co = 10, DS = [];
    function thamLoc() {
        return { strTuKhoa: v('q'), strDaoTao_LopQuanLy_Id: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strTrangThai_Id: '',
            strDangKy_KeHoachDangKy_Id: '', strLoaiDanhSach_Id: v('loai'), strNguoiDung_Id: uid(), strNguoiTao_Id: '' };
    }
    function taiDS() {
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return get('D_Hoc/LayDanhSach', Object.assign(thamLoc(), { pageIndex: trang, pageSize: co })).then(function (r) {
            DS = arr(r.data);
            var tong = Number(r.pager) || DS.length;
            z('nDS').textContent = '(' + tong + ')';
            ui.table({ el: z('ds'), rows: DS, empty: 'Không có bảng điểm', columns: [
                { title: 'Loại danh sách', prop: 'LOAIDANHSACH_TEN' }, { title: 'Mã danh sách', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên danh sách', prop: 'TEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số lượng', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.SOLUONG) + '(' + e(x.TYLENHAPDIEM) + '%)'); } },
                { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
                { title: 'Files', cls: 'is-center', render: function (x, i) { return ui.btn('attach', { text: 'Tệp', cls: 'ums-btn--sm', attr: { 'data-tep': i } }); } },
                { title: 'Hiển thị', cls: 'is-center', render: function (x, i) { return ui.btn('search', { text: 'Chọn', icon: 'fa-pen-to-square', mod: 'primary', cls: 'ums-btn--sm', attr: { 'data-chon': i } }); } }],
                page: { index: trang, size: co, total: tong, onChange: function (p) { trang = p; taiDS(); }, onSize: function (s) { co = s === 'all' ? Math.max(tong, 1) : Number(s); trang = 1; taiDS(); } } });
            if (DS.length === 1 && dang === 'ds') moBang(DS[0]);            // gốc: đúng một bảng điểm thì mở luôn
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách bảng điểm'); });
    }
    function moTep(x) {
        var dlg = ui.dialog({ title: 'Tệp đính kèm — ' + e(x.MA), icon: 'fa-paperclip', size: 'md', body: '<div data-x="tep"></div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                tep.save(x.ID).then(function () { ui.toast('Đã lưu tệp đính kèm', 'ok'); }).catch(function (err) { ums.api.handle(err, 'lưu tệp'); });
            } }] });
        var tep = ums.files.mount(dlg.body.querySelector('[data-x="tep"]'), { api: 'NS_Files' });
        tep.load(x.ID);
    }
    ums.report.mount(z('bc'), { import: false, tables: function () { var t = document.getElementById('tblNhapDiem'); return t ? [t] : []; }, collect: function (add) {
        var t = thamLoc();
        add('strTuKhoa', t.strTuKhoa); add('strDaoTao_LopQuanLy_Id', ''); add('strChucNang_Id', cn()); add('strDaoTao_ThoiGianDaoTao_Id', t.strDaoTao_ThoiGianDaoTao_Id);
        add('strDaoTao_HocPhan_Id', t.strDaoTao_HocPhan_Id); add('strTrangThai_Id', ''); add('strDangKy_KeHoachDangKy_Id', ''); add('strLoaiDanhSach_Id', t.strLoaiDanhSach_Id);
        add('strNguoiDung_Id', uid()); add('strNguoiTao_Id', ''); add('strNguoiThucHien_Id', uid()); add('strDiem_DanhSachHoc_Id', bd ? bd.ID : '');
        add('strQLSV_NguoiHoc_Id', ''); add('strDiem_DanhSach_NguoiHoc_Id', ''); add('strKyHieuCotDuLieu', '');
    } });

    /* ---------- 3. Nhập điểm mặc định / qua file ------------------------- */
    function nhapMacDinh(dsId) {
        var dlg = ui.dialog({ title: 'Nhập điểm mặc định', icon: 'fa-pen-to-square', size: 'sm',
            body: '<p class="ums-u-fz13">Bạn có chắc chắn muốn nhập điểm mặc định cho danh sách?</p>' + ui.field('Điểm mặc định', '<input class="ums-input" data-x="md" autocomplete="off">'),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                var t = thamLoc();
                ums.api.call({ action: 'D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach', method: 'POST', strTuKhoa: t.strTuKhoa, strChucNang_Id: cn(), strUngDung_Id: vt(),
                    strDaoTao_LopQuanLy_Id: '', strDaoTao_ThoiGianDaoTao_Id: t.strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id: t.strDaoTao_HocPhan_Id,
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
    var luoi = nd.bangDiem(z('luoi'), { he10: false, chon: false, dem: z('nND'), bd: function () { return bd; }, sx: function () { return v('sx'); } });
    ums.api.dm('DIEM.NHAPDIEM.SAPXEP').then(function (d) { if (d && d.length) f('sx').innerHTML = d.map(function (x) { return '<option value="' + esc(x.ID) + '">' + esc(e(x.TEN)) + '</option>'; }).join(''); }).catch(function () {});
    function moBang(x) {
        bd = x;
        z('hp').textContent = e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN);
        if (dang !== 'nd') sang('nd');
        luoi.tai();
    }
    function xacNhan(loai, tieuDe) {
        var id = bd.ID;
        nd.xacNhanNut({ loai: loai, tieuDe: tieuDe, chuDe: e(bd.DAOTAO_HOCPHAN_MA) + ' - ' + e(bd.DAOTAO_HOCPHAN_TEN), idHanhDong: id,
            luu: function (hd, noiDung) {
                return ums.api.call({ action: 'D_XacNhan/XacNhan_DanhSachDiem', method: 'POST', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(),
                    strDiem_DanhSachHoc_Id: id, strHanhDong_Id: hd, strLoaiXacNhan_Id: loai, strThongTinXacNhan: noiDung })
                    .then(function () { ui.toast('Xác nhận thành công', 'ok'); }).catch(function (err) { ums.api.handle(err, 'xác nhận'); });
            } });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('change', function (ev) {
        if (ev.target === f('sx')) luoi.hoiBo().then(function (yes) { if (yes) luoi.tai(); });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang = 1; taiDS(); } });
    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-chon]'))) { moBang(DS[Number(b.getAttribute('data-chon'))]); return; }
        if ((b = ev.target.closest('[data-tep]'))) { moTep(DS[Number(b.getAttribute('data-tep'))]); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') { trang = 1; taiDS(); }
        else if (a === 'nhapds') nhapQuaFile();
        else if (a === 'mdds') nhapMacDinh('');
        else if (a === 'md') nhapMacDinh(bd.ID);
        else if (a === 'dong') luoi.hoiBo().then(function (yes) { if (yes) { bd = null; sang('ds'); } });
        else if (a === 'luu') luoi.luu();
        else if (a === 'tinh') ui.confirm('Bạn có chắc chắn muốn tính lại điểm không?', { title: 'Tính lại điểm' }).then(function (yes) { if (yes) luoi.tinhLai(); });
        else if (a === 'xacnhan') xacNhan('XACNHAN_HOANTHANH_NHAP', 'Xác nhận');
        else if (a === 'congbo') xacNhan('XACNHAN_CONGBODIEM', 'Công bố');
        else if (a === 'tai') { var t = document.getElementById('tblNhapDiem'); if (t) ums.report.taiBangNhap(t); else ui.toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); }
        else if (a === 'nhap') { if (document.getElementById('tblNhapDiem')) ums.report.nhapBangTuTep({ onDone: luoi.danhDau }); else ui.toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); }
    });
    taiDS();                                                               // gốc tải danh sách ngay khi mở màn
})();
