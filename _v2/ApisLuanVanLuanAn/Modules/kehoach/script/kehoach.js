/* =========================================================================
   Kế hoạch (Luận văn, luận án)
   Bản gốc: ApisLuanVanLuanAn/Modules/kehoach/html/kehoach.html + script/kehoach.js (vỏ indexi, 2.390 dòng)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): thanh lọc (Thời gian · Phân loại · từ khoá · Tìm kiếm) → "Danh sách kế hoạch"
   (Thêm mới · Xóa đã chọn) → biểu mẫu thêm / sửa THAY CHỖ danh sách (ums.crud) → năm màn con mở TRONG TRANG từ các nút
   "Chi tiết" của bảng: Khoa phụ trách · Cán bộ quản lý · Đề tài · Học phần · Người học (zoneKhoaPhuTrach, zoneCanBo, zoneDeTai,
   zoneHocPhan, zoneSinhVien của gốc). Hộp chọn: học phần / người dùng = ums.tlKh (Đăng ký học, nạp chéo), nhân sự = pat.pickNhanSu,
   sinh viên = hộp riêng của màn (LayDSBV_NguoiHoc).

   Lời gọi (chép nguyên, `strNguoiThucHien_Id` hệ tự chèn):
     LVLA_BV_Chung/LayDSThoiGian GET · LVLA_BV_Chung/LayDSBV_NguoiDung_PhanLoai GET   ô lọc Thời gian / Phân loại (cùng nguồn ô Phân loại biểu mẫu)
     KHCT_ThoiGianDaoTao/LayDanhSach  strDAOTAO_Nam_Id '' · strTuKhoa '' · pageIndex 1 · pageSize 1000000   ô Thời gian của biểu mẫu
     LVLA_BV_KeHoach/LayDSBV_KeHoach GET  strTuKhoa · strPhanLoai_Id · dHieuLuc -1 · strDaoTao_ThoiGianDaoTao_Id · pageIndex · pageSize
     LVLA_BV_KeHoach/Them_BV_KeHoach | Sua_BV_KeHoach (khi có strId) POST  strId · strTen · strMoTa · strTuNgay · strDenNgay · dHieuLuc
         · strPhanLoai_Id · strDaoTao_ThoiGianDaoTao_Id
     LVLA_BV_KeHoach/Xoa_BV_KeHoach  strIds (mỗi kế hoạch một lời gọi)
     Khoa phụ trách: LayDSBV_KeHoach_DonVi GET (strTuKhoa '' · strBV_KeHoach_Id · strDaoTao_ThoiGianDaoTao_Id '' · strNhanSu_HoSoCanBo_Id ''
         · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000) · Them_BV_KeHoach_DonVi POST (strId '' · strChucNang_Id · strBV_KeHoach_Id
         · strNguoiDung_Id · strDaoTao_CoCauToChuc_Id = DONVIID của người dùng đã chọn) · Xoa_BV_KeHoach_DonVi (strChucNang_Id · strIds).
         Cột: MASO · HODEM · TEN · DONVI · DIENTHOAI · EMAIL.
     Cán bộ quản lý: LayDSBV_KeHoach_NhanSu GET (cùng tham số) · Them_BV_KeHoach_NhanSu POST (strId '' · strChucNang_Id · strBV_KeHoach_Id
         · strNguoiDung_Id = ID nhân sự đã chọn) · Xoa_BV_KeHoach_NhanSu (strChucNang_Id · strIds). Cùng bộ cột.
     Đề tài: LayDSBV_KeHoach_DeTai GET (strTuKhoa '' · strBV_KeHoach_Id · pageIndex 1 · pageSize 100000) = "Đề tài đề xuất trong đợt";
         LayDSBV_DeTai GET (strTuKhoa '' · strBV_KeHoach_Id '' · pageIndex 1 · pageSize 100000) = "Đề tài đã có trong hệ thống";
         Them_BV_KeHoach_DeTai POST (strId '' · strChucNang_Id · strMaDeTai · strTenDeTaiTiengViet · strTenDeTaiTiengAnh · strBV_KeHoach_Id);
         Xoa_BV_KeHoach_DeTai (strIds). Cột: MADETAI · TENDETAITIENGVIET · TENDETAITIENGANH · NGUOICUOI_TAIKHOAN · NGAYTAO_DD_MM_YYYY · DASUDUNG.
     Học phần: LayDSBV_Kehoach_HocPhan GET (strTuKhoa '' · strDaoTao_HocPhan_Id '' · strBV_KeHoach_Id · pageIndex 1 · pageSize 1000000)
         · Them_BV_Kehoach_HocPhan POST (strBV_KeHoach_Id · strDaoTao_HocPhan_Id) · Xoa_BV_Kehoach_HocPhan (strChucNang_Id · strIds).
         Cột: DAOTAO_HOCPHAN_MA · DAOTAO_HOCPHAN_TEN · DAOTAO_HOCPHAN_HOCTRINH · DONVI.
     Người học: LayDSBV_Kehoach_NguoiHoc GET (strTuKhoa '' · strBV_KeHoach_Id · pageIndex 1 · pageSize 100000) · Them_BV_Kehoach_NguoiHoc POST
         (strBV_KeHoach_Id · strDaoTao_HocPhan_Id · strQLSV_NguoiHoc_Id · strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID của dòng chọn)
         · xoá = HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_PhamVi (strIds) — CHÉP NGUYÊN của gốc (procedure của Danh hiệu, xem báo cáo).
         Hộp chọn sinh viên: LayDSBV_NguoiHoc GET (strTuKhoa · strDaoTao_KhoaQuanLy_Id · strDaoTao_HeDaoTao_Id · strDaoTao_KhoaDaoTao_Id
         · strDaoTao_ChuongTrinh_Id · strDaoTao_LopQuanLy_Id · strDaoTao_ThoiGianDaoTao_Id · strDaoTao_HocPhan_Id · strBV_KeHoach_Id);
         ô Học phần của hộp = LayDSBV_Kehoach_HocPhan (id DAOTAO_HOCPHAN_ID).

   Khác gốc:
     · Nút Xóa của "Khoa phụ trách" gốc gọi delete_ThanhVien (xoá nhầm sang Cán bộ quản lý) → gọi Xoa_BV_KeHoach_DonVi đúng ý định.
     · Đề tài: nút "Xóa" và "Thêm" gốc KHÔNG có trình xử lý (chỉ có hàm save_DeTai / delete_DeTai đọc ô không tồn tại) → làm theo ý định:
       "Xóa" xoá đề tài đề xuất trong đợt đã đánh dấu; "Thêm" gắn đề tài đã có trong hệ thống (đã đánh dấu) vào kế hoạch
       (Them_BV_KeHoach_DeTai, mã + tên lấy từ chính dòng). Cột "Đã sử dụng" (có ở tiêu đề gốc, không có ở dữ liệu) hiện DASUDUNG.
     · Hộp chọn sinh viên: ô từ khoá gốc không được gửi (strTuKhoa đọc txtAAAA) → gửi; các ô Hệ / Khóa / Chương trình / Lớp là ô chọn MỘT nối tầng
       (ums.ref.cascade, gốc chọn nhiều); tiêu đề cột gốc lệch dữ liệu (Khóa ↔ Học phần, Trạng thái ↔ Thời gian) → tiêu đề theo dữ liệu; không phân
       trang máy chủ như gốc (lời gọi không có pageIndex) nên phân trang tại máy. Lưu: mỗi người một lời gọi, rồi nạp lại một lần (ums.ui.batch).
     · Màn con Người học: nút "Lưu" (btnSave_SinhVien) gốc không có xử lý, người học lưu ngay lúc chọn → không dựng nút này.
     · Ảnh trang trí study-topic.svg bên phải biểu mẫu bỏ.
   Cố ý bỏ (mã chết — html không có hoặc hàm không ai gọi): Điều kiện (zoneDieuKien, btnSave_/btnDelete_/btnSave_KeThuaDieuKien, getList_DieuKien — hàm
   không tồn tại), "Danh sách sinh viên xét" / "Danh sách sinh viên" (#myModal, #myModalKetQua — không có nút mở), mẫu import (zonebtnBaoCao_KH không có
   nút), save_Lop / save_ChuongTrinh / save_Khoa + các nút btnAdd_Khoa / btnAdd_ChuongTrinh / btnAdd_Lop (HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamVi*
   — nằm trong hộp gốc nhưng hộp gốc không dựng các nút đó), getList_ComBoHocPhan (đã dùng ở hộp sinh viên), arrValid (ô txtKeHoachXuLy_So không có).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('lvla-kehoach-kehoach');
    if (!root) return;

    var KH = 'LVLA_BV_KeHoach/', CH = 'LVLA_BV_Chung/';
    var T = ums.tlKh;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function ds(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function chucNang() { return (ums.state && ums.state.chucNangId) || ''; }
    function g(action, o, post) { return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {})); }
    function dang(el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function loi(el, err, noi) { el.innerHTML = ui.fail(err && err.message); ums.api.handle(err, noi); }
    function tim(rows, id) { for (var i = 0; i < (rows || []).length; i++) if (String(rows[i].ID) === String(id)) return rows[i]; return null; }
    function qa(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }

    root.innerHTML = '<div data-z="main"></div>';
    var main = root.querySelector('[data-z="main"]');

    /* ---------- Cột ô đánh dấu + "chọn tất cả" ---------------------------- */
    function cotChon(k) {
        return { head: '<input type="checkbox" data-all="' + k + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-' + k + '="' + esc(r.ID) + '">'; } };
    }
    function ganChon(host) {
        host.addEventListener('change', function (ev) {
            var k = ev.target.getAttribute && ev.target.getAttribute('data-all');
            if (!k) return;
            var tb = ev.target.closest('table');
            if (tb) qa(tb, 'tbody input[data-' + k + ']').forEach(function (c) { c.checked = ev.target.checked; });
        });
    }
    function daChon(host, k) {
        return qa(host, 'tbody input[data-' + k + ']:checked').map(function (c) { return c.getAttribute('data-' + k); });
    }
    function xoaNhieu(ids, mk, tieuDe, xong) {
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(mk), { title: tieuDe, okText: 'Xóa thành công' }).then(xong);
        });
    }
    function nutChiTiet(k, id) { return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-sub': k, 'data-id': id } }); }

    /* ---------- Màn con: bảng + Xóa + Thêm (zoneKhoaPhuTrach, zoneCanBo, zoneHocPhan, zoneSinhVien) ---------- */
    function manCon(kh, o) {
        var rows = [];
        var f = pat.formTrang({ host: root, title: o.title + ' — ' + e(kh.TEN), icon: o.icon, cols: 1, flush: true,
            body: '<div data-z="t"></div>',
            xoa: { chon: 'input[data-sel]', onClick: function () {
                xoaNhieu(daChon(host, 'sel'), o.xoa, o.title, tai);
            } },
            buttons: [{ text: o.themChu, kind: 'add', onClick: function () { o.them(kh, tai, rows); return false; } }] });
        var host = f.body.querySelector('[data-z="t"]');
        ganChon(host);
        function tai() {
            dang(host);
            return o.tai(kh).then(function (r) {
                rows = ds(r);
                ui.table({ el: host, rows: rows, stt: true, empty: o.trong || 'Không có dữ liệu', columns: o.cot.concat([cotChon('sel')]) });
            }).catch(function (err) { loi(host, err, o.title); });
        }
        tai();
        return f;
    }
    var COT_NS = [
        { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'HODEM', cls: 'is-nowrap' }, { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
        { title: 'Đơn vị', prop: 'DONVI' }, { title: 'Số điện thoại', prop: 'DIENTHOAI', cls: 'is-nowrap' }, { title: 'Email', prop: 'EMAIL' }
    ];
    function dsNS(api) {
        return function (kh) {
            return g(KH + api, { strTuKhoa: '', strBV_KeHoach_Id: kh.ID, strDaoTao_ThoiGianDaoTao_Id: '', strNhanSu_HoSoCanBo_Id: '', strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 100000 });
        };
    }
    function themBatch(calls, ten, tai) {
        ui.batch(calls, { title: ten, okText: 'Thêm mới thành công' }).then(tai);
    }

    function khoaPhuTrach(kh) {
        manCon(kh, { title: 'Khoa phụ trách', icon: 'fa-building-columns', trong: 'Chưa có khoa phụ trách', cot: COT_NS, themChu: 'Thêm cán bộ',
            tai: dsNS('LayDSBV_KeHoach_DonVi'),
            xoa: function (id) { return { action: KH + 'Xoa_BV_KeHoach_DonVi', method: 'POST', strChucNang_Id: chucNang(), strIds: id }; },
            them: function (k, tai) {
                T.pickNguoiDung(function (ids, rows) {
                    themBatch(rows.map(function (r) {
                        return { action: KH + 'Them_BV_KeHoach_DonVi', method: 'POST', strId: '', strChucNang_Id: chucNang(), strBV_KeHoach_Id: k.ID,
                            strNguoiDung_Id: r.ID, strDaoTao_CoCauToChuc_Id: e(r.DONVIID) };
                    }), 'Đang thêm khoa phụ trách', tai);
                });
            } });
    }
    function canBo(kh) {
        manCon(kh, { title: 'Cán bộ quản lý', icon: 'fa-user-tie', trong: 'Chưa có cán bộ quản lý', cot: COT_NS, themChu: 'Thêm cán bộ',
            tai: dsNS('LayDSBV_KeHoach_NhanSu'),
            xoa: function (id) { return { action: KH + 'Xoa_BV_KeHoach_NhanSu', method: 'POST', strChucNang_Id: chucNang(), strIds: id }; },
            them: function (k, tai) {
                pat.pickNhanSu({ onPick: function (list) {
                    themBatch(list.map(function (r) {
                        return { action: KH + 'Them_BV_KeHoach_NhanSu', method: 'POST', strId: '', strChucNang_Id: chucNang(), strBV_KeHoach_Id: k.ID, strNguoiDung_Id: r.ID };
                    }), 'Đang thêm cán bộ', tai);
                } });
            } });
    }
    function hocPhan(kh) {
        manCon(kh, { title: 'Học phần', icon: 'fa-book-open', trong: 'Chưa có học phần', themChu: 'Thêm', cot: [
            { title: 'Mã số', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Số tín', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }, { title: 'Đơn vị', prop: 'DONVI' }],
            tai: function (k) { return g(KH + 'LayDSBV_Kehoach_HocPhan', { strTuKhoa: '', strDaoTao_HocPhan_Id: '', strBV_KeHoach_Id: k.ID, pageIndex: 1, pageSize: 1000000 }); },
            xoa: function (id) { return { action: KH + 'Xoa_BV_Kehoach_HocPhan', method: 'POST', strChucNang_Id: chucNang(), strIds: id }; },
            them: function (k, tai) {
                T.pickHocPhan(function (ids) {
                    themBatch(ids.map(function (id) {
                        return { action: KH + 'Them_BV_Kehoach_HocPhan', method: 'POST', strBV_KeHoach_Id: k.ID, strDaoTao_HocPhan_Id: id };
                    }), 'Đang thêm học phần', tai);
                });
            } });
    }

    /* ---------- Đề tài (zoneDeTai): hai bảng trong một màn con ---------- */
    var COT_DT = [
        { title: 'Mã số', prop: 'MADETAI', cls: 'is-nowrap' }, { title: 'Tên đề tài tiếng việt', prop: 'TENDETAITIENGVIET' },
        { title: 'Tên đề tài tiếng anh', prop: 'TENDETAITIENGANH' }, { title: 'Người nhập', prop: 'NGUOICUOI_TAIKHOAN' },
        { title: 'Ngày nhập', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' },
        { title: 'Đã sử dụng', cls: 'is-center', render: function (x) { return x.DASUDUNG ? ui.badge('Đã sử dụng', 'info') : ''; } }
    ];
    function deTai(kh) {
        var tren = [], duoi = [];
        var f = pat.formTrang({ host: root, title: 'Đề tài — ' + e(kh.TEN), icon: 'fa-book', cols: 1, flush: true, body:
            pat.panel({ title: 'Đề tài đề xuất trong đợt', icon: 'fa-book', cls: 'ums-u-mb-4', flush: true, zone: 'dt', count: 'dtn' }) +
            pat.panel({ title: 'Đề tài đã có trong hệ thống', icon: 'fa-books', flush: true, zone: 'dc', count: 'dcn',
                tools: ui.btn('add', { text: 'Thêm', mod: 'out-primary', attr: { 'data-dt-a': 'them' } }) }),
            xoa: { chon: 'input[data-dtx]', onClick: function () {
                xoaNhieu(daChon(zTren, 'dtx'), function (id) { return { action: KH + 'Xoa_BV_KeHoach_DeTai', method: 'POST', strIds: id }; }, 'Xoá đề tài', taiTren);
            } } });
        var B = f.body, zTren = B.querySelector('[data-z="dt"]'), zDuoi = B.querySelector('[data-z="dc"]');
        ganChon(B);
        function taiTren() {
            dang(zTren);
            return g(KH + 'LayDSBV_KeHoach_DeTai', { strTuKhoa: '', strBV_KeHoach_Id: kh.ID, pageIndex: 1, pageSize: 100000 }).then(function (r) {
                tren = ds(r);
                B.querySelector('[data-z="dtn"]').textContent = '(' + tren.length + ')';
                ui.table({ el: zTren, rows: tren, stt: true, empty: 'Kế hoạch chưa có đề tài', columns: COT_DT.concat([cotChon('dtx')]) });
            }).catch(function (err) { loi(zTren, err, 'đề tài đề xuất'); });
        }
        function taiDuoi() {
            dang(zDuoi);
            return g(KH + 'LayDSBV_DeTai', { strTuKhoa: '', strBV_KeHoach_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
                duoi = ds(r);
                B.querySelector('[data-z="dcn"]').textContent = '(' + duoi.length + ')';
                ui.table({ el: zDuoi, rows: duoi, stt: true, empty: 'Chưa có đề tài', columns: COT_DT.concat([cotChon('dtc')]) });
            }).catch(function (err) { loi(zDuoi, err, 'đề tài trong hệ thống'); });
        }
        B.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-dt-a="them"]')) return;
            var ids = daChon(zDuoi, 'dtc');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.batch(ids.map(function (id) {
                var r = tim(duoi, id) || {};
                return { action: KH + 'Them_BV_KeHoach_DeTai', method: 'POST', strId: '', strChucNang_Id: chucNang(), strMaDeTai: e(r.MADETAI),
                    strTenDeTaiTiengViet: e(r.TENDETAITIENGVIET), strTenDeTaiTiengAnh: e(r.TENDETAITIENGANH), strBV_KeHoach_Id: kh.ID };
            }), { title: 'Đang thêm đề tài', okText: 'Thêm mới thành công' }).then(function () { taiTren(); taiDuoi(); });
        });
        taiTren();
        taiDuoi();
    }

    /* ---------- Người học (zoneSinhVien) + hộp chọn sinh viên ---------- */
    function nguoiHoc(kh) {
        var tai;
        var COT = [
            { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: function (r) { return pat.anhNguoi(r.ANH); } },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: function (r) { return esc((e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim()); } },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-nowrap' }];
        var f = manCon(kh, { title: 'Người học', icon: 'fa-user-graduate', trong: 'Chưa có người học', cot: COT, themChu: 'Thêm thành viên',
            tai: function (k) { return g(KH + 'LayDSBV_Kehoach_NguoiHoc', { strTuKhoa: '', strBV_KeHoach_Id: k.ID, pageIndex: 1, pageSize: 100000 }); },
            xoa: function (id) { return { action: 'HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_PhamVi', method: 'POST', strIds: id }; },
            them: function (k, t) { hopSinhVien(k, t); } });
        return f;
    }

    function hopSinhVien(kh, xong) {
        var rows = [], picked = {}, page = 1, size = 10, hp = [];
        var dlg = ui.dialog({ title: 'Tìm kiếm sinh viên', icon: 'fa-magnifying-glass', size: 'xl', body:
            '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="kql" data-ph="Tất cả khoa quản lý"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="he" data-ph="Tất cả hệ đào tạo"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="khoa" data-ph="Tất cả khóa đào tạo"></select></div></div>' +
            '<div class="ums-filter ums-u-mt-3"><div class="ums-field"><select class="ums-select" data-f="ct" data-ph="Tất cả chương trình đào tạo"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="lop" data-ph="Tất cả lớp quản lý"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="tg" data-ph="Tất cả thời gian"></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="hp" data-ph="Tất cả học phần"></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div></div>' +
            '<div class="ums-row ums-row--between ums-u-mt-4"><b class="ums-u-navy">Danh sách <span class="ums-u-faint ums-u-fz13" data-f="n"></span></b>' +
            '<span class="ums-u-fz13 ums-u-muted" data-f="sel"></span></div><div class="ums-u-mt-2" data-f="tbl"></div>',
            buttons: [{ text: 'Chọn', kind: 'add', mod: 'primary', onClick: function () {
                var ids = Object.keys(picked);
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                ui.batch(ids.map(function (id) {
                    var a = picked[id];
                    return { action: KH + 'Them_BV_Kehoach_NguoiHoc', method: 'POST', strBV_KeHoach_Id: kh.ID, strDaoTao_HocPhan_Id: e(a.DAOTAO_HOCPHAN_ID),
                        strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: e(a.DAOTAO_TOCHUCCHUONGTRINH_ID) };
                }), { title: 'Đang thêm người học', okText: 'Thêm mới thành công' }).then(xong);
            } }] });
        var B = dlg.body;
        function fe(k) { return B.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(B);
        ums.ref.khoaQuanLy().then(function (d) { pat.fill(fe('kql'), d, { name: 'TEN', head: 'Tất cả khoa quản lý' }); }).catch(function (er) { ums.api.handle(er, 'khoa quản lý'); });
        ums.ref.cascade({ he: fe('he'), khoa: fe('khoa'), ct: fe('ct'), lop: fe('lop'),
            labels: { he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', ct: 'Tất cả chương trình đào tạo', lop: 'Tất cả lớp quản lý' } });
        ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (d) { pat.fill(fe('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả thời gian' }); }).catch(function (er) { ums.api.handle(er, 'thời gian'); });
        g(KH + 'LayDSBV_Kehoach_HocPhan', { strTuKhoa: '', strDaoTao_HocPhan_Id: '', strBV_KeHoach_Id: kh.ID, pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { hp = ds(r); pat.fill(fe('hp'), hp, { id: 'DAOTAO_HOCPHAN_ID', name: 'DAOTAO_HOCPHAN_TEN', head: 'Tất cả học phần' }); })
            .catch(function (er) { ums.api.handle(er, 'học phần'); });

        function ve() {
            fe('n').textContent = '(' + rows.length + ')';
            ui.table({ el: fe('tbl'), rows: rows.slice((page - 1) * size, page * size), empty: 'Không tìm thấy sinh viên',
                page: { index: page, size: size, total: rows.length,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(rows.length / size)) { page = p; ve(); } },
                    onSize: function (v) { size = v === 'all' ? Math.max(rows.length, 1) : Number(v); page = 1; ve(); } },
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: function (r) { return pat.anhNguoi(r.ANH); } },
                    { title: 'Họ tên', render: function (r) { return ui.cell((e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(), e(r.QLSV_NGUOIHOC_MASO)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Học phần', render: function (r) { return esc((e(r.DAOTAO_HOCPHAN_TEN) + ' ' + e(r.DAOTAO_HOCPHAN_MA)).trim()); } },
                    { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
                    { head: '<input type="checkbox" data-sv="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                      render: function (r) { return '<input type="checkbox" data-sv="' + esc(r.ID) + '"' + (picked[r.ID] ? ' checked' : '') + '>'; } }
                ] });
            dem();
        }
        function dem() { var n = Object.keys(picked).length; fe('sel').textContent = n ? 'Đã chọn ' + n : ''; }
        function tai() {
            dang(fe('tbl'));
            g(KH + 'LayDSBV_NguoiHoc', { strTuKhoa: (fe('q').value || '').trim(), strDaoTao_KhoaQuanLy_Id: fe('kql').value, strDaoTao_HeDaoTao_Id: fe('he').value,
                strDaoTao_KhoaDaoTao_Id: fe('khoa').value, strDaoTao_ChuongTrinh_Id: fe('ct').value, strDaoTao_LopQuanLy_Id: fe('lop').value,
                strDaoTao_ThoiGianDaoTao_Id: fe('tg').value, strDaoTao_HocPhan_Id: fe('hp').value, strBV_KeHoach_Id: kh.ID })
                .then(function (r) { rows = ds(r); page = 1; ve(); })
                .catch(function (err) { loi(fe('tbl'), err, 'danh sách sinh viên'); });
        }
        fe('tbl').addEventListener('change', function (ev) {
            var k = ev.target.getAttribute && ev.target.getAttribute('data-sv');
            if (k === null || k === undefined) return;
            if (k === 'all') {
                qa(fe('tbl'), 'tbody input[data-sv]').forEach(function (c) {
                    var r = tim(rows, c.getAttribute('data-sv'));
                    c.checked = ev.target.checked;
                    if (r) { if (ev.target.checked) picked[r.ID] = r; else delete picked[r.ID]; }
                });
            } else {
                var r = tim(rows, k);
                if (r) { if (ev.target.checked) picked[r.ID] = r; else delete picked[r.ID]; }
            }
            dem();
        });
        B.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="tim"]')) tai(); });
        fe('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
        tai();
    }

    /* ---------- Danh sách kế hoạch + biểu mẫu (ums.crud) ---------- */
    var cr = ums.crud({
        root: main,
        title: 'Kế hoạch',
        icon: 'fa-clipboard-list',
        listTitle: 'Danh sách kế hoạch',
        formTitle: 'kế hoạch',
        rowDelete: false,
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: { call: { action: CH + 'LayDSThoiGian', method: 'GET', strNguoiThucHien_Id: uid() }, name: 'DAOTAO_THOIGIANDAOTAO' } },
            { key: 'loai', type: 'select', label: 'Chọn phân loại', source: { call: { action: CH + 'LayDSBV_NguoiDung_PhanLoai', method: 'GET', strNguoiThucHien_Id: uid() } } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: KH + 'LayDSBV_KeHoach', method: 'GET', strTuKhoa: f.q, strPhanLoai_Id: f.loai, dHieuLuc: -1,
                    strDaoTao_ThoiGianDaoTao_Id: f.tg, strNguoiThucHien_Id: uid() };
            }
        },
        columns: [
            { title: 'Tên', prop: 'TEN' },
            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
            { title: 'Ngày bắt đầu', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Ngày kết thúc', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Khoa phụ trách', cls: 'is-center is-nowrap', render: function (r) { return nutChiTiet('khoa', r.ID); } },
            { title: 'Cán bộ quản lý', cls: 'is-center is-nowrap', render: function (r) { return nutChiTiet('canbo', r.ID); } },
            { title: 'Đề tài', cls: 'is-center is-nowrap', render: function (r) { return nutChiTiet('detai', r.ID); } },
            { title: 'Học phần', cls: 'is-center is-nowrap', render: function (r) { return nutChiTiet('hocphan', r.ID); } },
            { title: 'Người học', cls: 'is-center is-nowrap', render: function (r) { return nutChiTiet('nguoihoc', r.ID); } }
        ],
        fields: [
            { key: 'strTen', col: 'TEN', label: 'Tên kế hoạch', span: true },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', value: '1', source: { items: [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] }, placeholder: 'Hiệu lực' },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select', placeholder: 'Chọn thời gian',
              source: { call: { action: 'KHCT_ThoiGianDaoTao/LayDanhSach', strDAOTAO_Nam_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }, name: 'DAOTAO_THOIGIANDAOTAO' } },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', placeholder: 'Chọn phân loại',
              source: { call: { action: CH + 'LayDSBV_NguoiDung_PhanLoai', method: 'GET', strNguoiThucHien_Id: uid() } } },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true }
        ],
        save: function (v, row) {
            return { action: KH + (row ? 'Sua_' : 'Them_') + 'BV_KeHoach', method: 'POST', strId: row ? row.ID : '', strTen: v.strTen, strMoTa: v.strMoTa,
                strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, dHieuLuc: v.dHieuLuc, strPhanLoai_Id: v.strPhanLoai_Id,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id: uid() };
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: KH + 'Xoa_BV_KeHoach', method: 'POST', strIds: id, strNguoiThucHien_Id: uid() }; });
        }
    });

    var MO = { khoa: khoaPhuTrach, canbo: canBo, detai: deTai, hocphan: hocPhan, nguoihoc: nguoiHoc };
    main.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-sub]');
        if (!b) return;
        var r = tim(cr.rows, b.getAttribute('data-id'));
        if (r && MO[b.getAttribute('data-sub')]) MO[b.getAttribute('data-sub')](r);
    });
})();
