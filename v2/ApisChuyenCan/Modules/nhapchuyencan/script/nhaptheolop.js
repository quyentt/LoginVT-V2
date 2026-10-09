/* =========================================================================
   Nhập chuyên cần theo danh sách học
   Bản gốc: ApisChuyenCan/Modules/nhapchuyencan/html/nhaptheolop.html + script/nhaptheolop.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột, hai khung xếp dọc, cả hai cùng hiện) — bản mới ĐỔI CHỖ theo yêu cầu người
   dùng (2026-09-25): bấm "Chọn" thì khung 2 thay chỗ thanh lọc + khung 1 ở đầu trang, nút "Đóng" (ngoài
   cùng bên trái) quay về danh sách — không đẩy khung 2 xuống chân trang.
     1. "Danh sách học": thanh lọc Loại danh sách · Thời gian · Lớp quản lý · Học phần /
        từ khoá · Tìm kiếm · vùng Import → bảng "Danh sách lớp học phần" (phân trang), nút
        "Chọn" mỗi dòng (chỉ MỘT dòng thì tự chọn).
     2. "Danh sách: <tên>": Ngày khởi tạo · Kiểu chuyên cần · "Khởi tạo ngày chuyên cần" ·
        "Xác nhận" · Xuất báo cáo → bảng SINH VIÊN × NGÀY → nút Lưu.
   Khung dùng chung: ums.cc.luoi (script/_chung.js).

   Lời gọi (chép nguyên):
       D_XuLyDiem/LayDSDiem_DanhSachHoc (GET, phân trang)      bảng danh sách học
       D_XuLyDiem/LayDSThoiGian · LayDSLopQuanLy · LayDSHocPhan (GET)   ô lọc
       Danh mục: DIEM.LOAIDANHSACH, QLSV.KIEUCHUYENCAN
       XLHV_CC_ThongTin_MH · PKG_CHUYENCAN_THONGTIN.LayDSQLSV_NguoiHoc_ChuyenCan (pageSize 500000)
       CC_NguoiHoc_ChuyenCan/LayKetQuaChuyenCanTheoNgay (GET, mỗi ô một lời gọi) — nhớ ID bản ghi
       PKG_CHUYENCAN_THONGTIN.Them_QLSV_NguoiHoc_ChuyenCan | Sua_QLSV_NguoiHoc_ChuyenCan (ô đã có → Sửa, strId = ID)
       CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan (POST) — bỏ đánh dấu ô đã có
       CC_ThoiGian_ChuyenCan/ThemMoi (POST) — "Khởi tạo ngày chuyên cần"
       Xác nhận (XACNHAN_HOANTHANH_DIEMDANH): D_Chung_MH · PKG_DIEM_CHUNG.LayDSHanhDongXacNhan (nút hành động),
           D_XacNhan/LayDSDiem_XacNhan (GET, lịch sử), D_XacNhan/Them_Diem_XacNhan (POST, bấm nút hành động = lưu)
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_NTL": strTinhDenNgay, strDanhSachHoc_Id)
   Giữ như bản gốc:
     · Danh sách SV gửi các ô lọc KHÔNG có trên màn này (Hệ, Khoá, CT, Năm, Khoa QL, trạng thái,
       Từ/Đến ngày, từ khoá txtSearch_DT) = '' ; strLopQuanLy_Id = ô Lớp quản lý.
     · Khởi tạo gửi các ô không có trên màn = '' (strGio/strPhut/strGiay ''), dGio/dPhut/dGiay 0.
     · Lưu / xoá gửi dGio / dPhut / dGiay theo GIO / PHUT / GIAY của ngày ghi nhận.
     · Báo cáo strTinhDenNgay = '' (gốc đọc ô txtSearch_TuNgay_IHD không có ở màn này).
     · Vùng Import của bản gốc nằm cạnh nút Tìm kiếm; ở đây gộp chung nút Xuất báo cáo / Import
       của ums.report.mount ở khung 2 (cùng một danh sách mẫu).
   Khác gốc:
     · Cột "Lớp": thân bảng gốc có cột LOP nhưng tiêu đề thiếu → tiêu đề lệch một cột. Đã thêm tiêu đề.
     · Khung 2 chỉ nạp khi ĐÃ chọn một danh sách (gốc gọi cả khi chưa chọn, strDiem_DanhSachHoc_Id '');
       Khởi tạo / Xác nhận / Lưu cũng báo "Chọn một danh sách trước" thay vì gửi id rỗng.
     · Ô lọc nối tầng Loại danh sách → Thời gian → Lớp quản lý → Học phần: chưa chọn cha thì khoá con,
       đổi / xoá cha thì xoá trắng con (luật chung; gốc nạp sẵn hết và không bắt lúc xoá).
     · Kiểu chuyên cần của ô / lưu / xoá lấy theo lúc nạp bảng (gốc đọc ô đang chọn lúc gọi).
     · Ô nội dung xác nhận: gửi đúng như gốc; hộp gốc có 3 nút "Đóng" giả trong vùng nút hành động
       (khuôn html chưa thay) → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, cc = ums.cc;
    var root = document.getElementById('cc-nhaptheolop');
    if (!root) return;

    var XL = 'XLHV_CC_ThongTin_MH/', PK = 'PKG_CHUYENCAN_THONGTIN.';
    var LOAI_XN = 'XACNHAN_HOANTHANH_DIEMDANH';
    function e(v) { return cc.e(v); }
    function esc(s) { return ui.esc(s); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid() }, o)); }
    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }

    root.innerHTML = pat.page('Nhập chuyên cần theo danh sách học', '') + '<div data-z="vungDs">' +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('loai', 'Chọn loại danh sách') + sel('tg', 'Chọn thời gian') + sel('lop', 'Chọn lớp quản lý') + sel('hp', 'Chọn học phần') +
            '</div><div class="ums-filter ums-u-mt-3">' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập mã số hoặc tên" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách lớp học phần', icon: 'fa-list-timeline', count: 'nds', flush: true, zone: 'ds', cls: 'ums-u-mb-4' }) +
        '</div><div data-z="vungCt" hidden>' +
        pat.panel({ title: 'Danh sách', icon: 'fa-users', count: 'nsv', zone: 'ct',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + '<span data-z="bc"></span>' +
                ui.btn('add', { text: 'Khởi tạo ngày chuyên cần', icon: 'fa-calendar-day', mod: 'out-warn', attr: { 'data-a': 'khoitao' } }) +
                ui.btn('confirm', { text: 'Xác nhận', attr: { 'data-a': 'xacnhan' } }) +
                ui.btn('save', { text: 'Lưu', attr: { 'data-a': 'luu' } }),
            body:
                '<div class="ums-filter">' +
                    '<div class="ums-field"><input class="ums-input" data-f="ngayKT" data-date placeholder="Ngày khởi tạo dd/mm/yyyy" autocomplete="off"></div>' +
                    sel('kieu', 'Chọn kiểu chuyên cần') +
                '</div>' +
                '<div class="ums-u-mt-3" data-z="bang"></div>' }) + '</div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? pat.val(f(k)) : ''; }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    var tieuDe = root.querySelectorAll('.ums-panel__title')[1];

    var dsHoc = [], dsId = '', trang = 1, co = 10, kieuDang = '', ngayDang = [];

    /* ---------- Ô lọc ----------------------------------------------------------- */
    ums.api.dm('DIEM.LOAIDANHSACH').then(function (d) { pat.fill(f('loai'), d, { head: pat.dmTitle(d) || 'Chọn loại danh sách' }); }).catch(loi('loại danh sách'));
    ums.api.dm('QLSV.KIEUCHUYENCAN').then(function (d) { pat.fill(f('kieu'), d, { head: pat.dmTitle(d) || 'Chọn kiểu chuyên cần' }); }).catch(loi('kiểu chuyên cần'));
    function napTG() {
        return get('D_XuLyDiem/LayDSThoiGian', { strLoaiDanhSach_Id: v('loai') })
            .then(function (r) { pat.fill(f('tg'), cc.arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); }).catch(loi('thời gian'));
    }
    function napLop() {
        return get('D_XuLyDiem/LayDSLopQuanLy', { strLoaiDanhSach_Id: v('loai'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('lop'), cc.arr(r.data), { name: 'TEN', head: 'Chọn lớp quản lý' }); }).catch(loi('lớp quản lý'));
    }
    function napHP() {
        return get('D_XuLyDiem/LayDSHocPhan', { strDaoTao_LopQuanLy_Id: v('lop'), strLoaiDanhSach_Id: v('loai'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('hp'), cc.arr(r.data), { name: 'TEN', head: 'Chọn học phần' }); }).catch(loi('học phần'));
    }
    napTG(); napLop(); napHP();
    if (window.jQuery) {
        var S = 'select2:select select2:clear';
        jQuery(f('loai')).on(S, function () { napTG(); napHP(); napLop(); taiDs(1); });
        jQuery(f('tg')).on(S, function () { napLop(); napHP(); taiDs(1); });
        jQuery(f('lop')).on(S, function () { napHP(); taiDs(1); });
        jQuery(f('hp')).on(S, function () { taiDs(1); });
        jQuery(f('kieu')).on(S, function () { taiSV(); taiDs(trang); });
    }
    pat.chain([f('loai'), f('tg'), f('lop'), f('hp')]);

    /* ---------- Bảng danh sách học -------------------------------------------- */
    function taiDs(p) {
        trang = p || 1;
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        get('D_XuLyDiem/LayDSDiem_DanhSachHoc', {
            strTuKhoa: (f('q').value || '').trim(), strDaoTao_LopQuanLy_Id: v('lop'), strDaoTao_ThoiGianDaoTao_Id: v('tg'),
            strDaoTao_HocPhan_Id: v('hp'), strTrangThai_Id: '', strDangKy_KeHoachDangKy_Id: '', strLoaiDanhSach_Id: v('loai'),
            strNguoiDung_Id: cc.uid(), strNguoiTao_Id: '', pageIndex: trang, pageSize: co
        }).then(function (r) {
            dsHoc = cc.arr(r.data);
            var tong = Number(r.pager) || dsHoc.length;
            z('nds').textContent = '(' + tong + ')';
            ui.table({ el: z('ds'), rows: dsHoc, empty: 'Không có danh sách học',
                page: { index: trang, size: co, total: tong, onChange: taiDs, onSize: function (s) { co = s; taiDs(1); } },
                columns: [
                    { title: 'Loại danh sách', prop: 'LOAIDANHSACH_TEN' },
                    { title: 'Mã danh sách', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên danh sách', prop: 'TEN' },
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                    { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center is-nowrap' },
                    { title: 'Hiển thị', cls: 'is-center is-actions', render: function (x) {
                        return '<button type="button" class="ums-btn ums-btn--sm ' + (x.ID === dsId ? 'ums-btn--primary' : 'ums-btn--out-primary') +
                            '" data-chon="' + esc(x.ID) + '">Chọn</button>'; } }
                ] });
            if (dsHoc.length === 1) chon(dsHoc[0].ID);
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học'); });
    }

    function chon(id) {
        dsId = id;
        if (z('vungCt').hidden) ui.swap(z('vungDs'), z('vungCt'));
        var x = dsHoc.filter(function (r) { return r.ID === id; })[0];
        tieuDe.innerHTML = '<i class="fa-light fa-users"></i> Danh sách: ' + esc(x ? x.TEN : '') + ' <span class="ums-u-faint ums-u-fz13" data-z="nsv"></span>';
        Array.prototype.forEach.call(z('ds').querySelectorAll('[data-chon]'), function (b) {
            var on = b.getAttribute('data-chon') === id;
            b.classList.toggle('ums-btn--primary', on);
            b.classList.toggle('ums-btn--out-primary', !on);
        });
        taiSV();
    }

    /* ---------- Lưới chuyên cần của danh sách đang chọn ----------------------- */
    var luoi = cc.luoi(z('bang'), {
        lead: cc.cotSV(),
        buoi: true,
        ghiId: true,
        chuHoi: 'lưu',
        o: function (sv, d) {
            return { action: 'CC_NguoiHoc_ChuyenCan/LayKetQuaChuyenCanTheoNgay', method: 'GET',
                strChucNang_Id: cc.cn(), strNgay_Gio_Phut_Giay_Id: d.ID, strKieuChuyenCan_Id: kieuDang,
                strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strDiem_DanhSachHoc_Id: dsId, strNguoiThucHien_Id: cc.uid() };
        },
        them: function (sv, d, soLuong, id) {
            return { action: id ? XL + 'EjQgHhANEhceDyY0LigJLiIeAik0OCQvAiAv' : XL + 'FSkkLB4QDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP',
                func: PK + (id ? 'Sua_QLSV_NguoiHoc_ChuyenCan' : 'Them_QLSV_NguoiHoc_ChuyenCan'),
                strId: id || '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: sv.QLSV_NGUOIHOC_TRANGTHAI_ID, strDiem_DanhSach_Id: dsId,
                strKieuChuyenCan_Id: kieuDang, strNgayGhiNhan: d.NGAYGHINHAN, dSoLuong: soLuong,
                dGio: e(d.GIO), dPhut: e(d.PHUT), dGiay: e(d.GIAY) };
        },
        xoa: function (sv, d) {
            return { action: 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan',
                strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strQLSV_NguoiHoc_Id: sv.ID, strDaoTao_LopQuanLy_Id: sv.LOP_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: sv.QLSV_NGUOIHOC_TRANGTHAI_ID, strDiem_DanhSachHoc_Id: dsId,
                strKieuChuyenCan_Id: kieuDang, strNgay_Gio_Phut_Giay_Id: d.ID, strNgayGhiNhan: d.NGAYGHINHAN,
                dGio: e(d.GIO), dPhut: e(d.PHUT), dGiay: e(d.GIAY) };
        },
        sauLuu: function () { taiSV(); }
    });

    function taiSV() {
        if (!dsId) { luoi.xoaTrang('Chọn một danh sách ở bảng "Danh sách lớp học phần"'); return; }
        if (!v('kieu')) { luoi.xoaTrang('Chọn kiểu chuyên cần để hiện bảng chuyên cần'); return; }
        kieuDang = v('kieu');
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: XL + 'DSA4BRIQDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP', func: PK + 'LayDSQLSV_NguoiHoc_ChuyenCan',
            strTuKhoa: '', strChucNang_Id: cc.cn(), strKhoaQuanLy_Id: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '',
            strLopQuanLy_Id: v('lop'), strNamNhapHoc: '', strTrangThaiNguoiHoc_Id: '', strTuNgay: '', strDenNgay: '',
            strKieuChuyenCan_Id: kieuDang, strDiem_DanhSachHoc_Id: dsId, strNguoiThucHien_Id: cc.uid(), pageIndex: 1, pageSize: 500000 })
            .then(function (r) {
                var d = r.data || {};
                ngayDang = cc.arr(d.rsNgay);
                var n = z('nsv'); if (n) n.textContent = '(' + cc.arr(d.rs).length + ')';
                luoi.ve(d);
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách chuyên cần'); });
    }

    function khoiTao() {
        if (!dsId) { ui.toast('Chọn một danh sách trước', 'warn'); return; }
        var ngay = (f('ngayKT').value || '').trim();
        ums.api.call({ action: 'CC_ThoiGian_ChuyenCan/ThemMoi',
            strId: '', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
            strKhoaQuanLy_Id: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: v('lop'),
            strNamNhapHoc: '', strTrangThaiNguoiHoc_Id: '', strNgay: ngay, strDenNgay: '', strKieuChuyenCan_Id: v('kieu'),
            strDiem_DanhSachHoc_Id: dsId, strNgayGhiNhan: ngay, strGio: '', strPhut: '', strGiay: '',
            strDaoTao_LopQuanLy_Id: v('lop'), dGio: 0, dPhut: 0, dGiay: 0 })
            .then(function () { ui.toast('Khởi tạo thành công', 'ok'); taiSV(); })
            .catch(function (err) { ums.api.handle(err, 'khởi tạo ngày chuyên cần'); });
    }

    /* ---------- Xác nhận hoàn thành điểm danh --------------------------------- */
    function xacNhan() {
        if (!dsId) { ui.toast('Chọn một danh sách trước', 'warn'); return; }
        var x = dsHoc.filter(function (r) { return r.ID === dsId; })[0];
        var dlg = ui.dialog({ title: 'Xác nhận' + (x ? ' — ' + e(x.TEN) : ''), icon: 'fa-circle-check', size: 'lg',
            body: ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="cc-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ums.api.call({ action: 'D_Chung_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P', func: 'PKG_DIEM_CHUNG.LayDSHanhDongXacNhan',
            strChucNang_Id: cc.cn(), strLoaiXacNhan_Id: LOAI_XN, strNguoiThucHien_Id: cc.uid(), strDiem_DanhSachHoc_Id: dsId })
            .then(function (r) {
                var d = cc.arr(r.data);
                q('nut').innerHTML = d.length ? d.map(function (h) {
                    var ic = ums.iconFA4 ? ums.iconFA4(e(h.THONGTIN1) || 'fa-solid fa-circle-check') : 'fa-solid fa-circle-check';
                    return '<button type="button" class="cc-xn__nut" data-hd="' + esc(h.ID) + '">' +
                        '<i class="' + esc(ic) + '"' + (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i>' +
                        '<span>' + esc(h.TEN) + '</span></button>';
                }).join('') : ui.empty('Chưa khai báo hành động xác nhận');
            }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'hành động xác nhận'); });
        ums.api.call({ action: 'D_XacNhan/LayDSDiem_XacNhan', method: 'GET', type: 'GET', strTuKhoa: '', strDuLieuXacNhan: dsId,
            strLoaiXacNhan_Id: LOAI_XN, strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                ui.table({ el: q('ls'), rows: cc.arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                    { title: 'Xác nhận', prop: 'TEN' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }] });
            }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            dlg.close();
            ums.api.call({ action: 'D_XacNhan/Them_Diem_XacNhan', strChucNang_Id: cc.cn(), strNguoiThucHien_Id: cc.uid(),
                strDiem_DanhSachHoc_Id: dsId, strHanhDong_Id: b.getAttribute('data-hd'), strLoaiXacNhan_Id: LOAI_XN,
                strThongTinXacNhan: (q('nd').value || '').trim(), strNguoiXacNhan_Id: cc.uid(), strDuLieuXacNhan: dsId })
                .then(function () { ui.toast('Xác nhận thành công', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'xác nhận'); });
        });
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strTinhDenNgay', '');
        add('strDanhSachHoc_Id', dsId);
    } });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-chon]');
        if (b) { chon(b.getAttribute('data-chon')); return; }
        b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') taiDs(1);
        else if (a === 'dong') ui.swap(z('vungCt'), z('vungDs'));
        else if (a === 'khoitao') khoiTao();
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'luu') { if (!dsId) ui.toast('Chọn một danh sách trước', 'warn'); else luoi.luu(); }
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiDs(1); } });

    taiDs(1);
    taiSV();
})();
