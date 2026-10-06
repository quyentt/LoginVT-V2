/* =========================================================================
   tkggLHP — tầng riêng màn "Xác định phạm vi dữ liệu lớp HP" (ApisTKGG/Modules/kehoach): ums.tkggLHP.*
   Tệp này: khung "Thêm mới - Lớp học phần" THAY CHỖ màn (gốc: zoneEdit toggle_overide) + ba hàm ô đánh dấu dùng chung
   cho mọi bảng chọn nhiều của màn (cotChon / daChon / ganChonTatCa — chép cách dựng của _phamvi.js, không nạp chéo vì
   màn này không cần tầng ums.tkggPV).
   ---------------------------------------------------------------------------
   L.khungThem({ host, ctId, ctTen, sauLuu }) — khung chọn lớp học phần từ Đăng ký học:
     Chuỗi ô chọn NHIỀU (gốc multiple="multiple", giá trị nối bằng dấu phẩy):
       Thời gian   DKH_Chung/LayThoiGianDangKyHoc (GET)                          → DAOTAO_THOIGIANDAOTAO
       Hệ đào tạo  edu.system.getList_HeDaoTao → ums.ref.heDaoTao                → TENHEDAOTAO
       Khóa ĐT     DKH_PhanCong_LopHP/LayDSKhoaToChuc (GET) — strDaoTao_HeDaoTao_Id, strDaoTao_ThoiGianDaoTao_Id → TENKHOA
       Khoa QL     edu.system.getList_KhoaQuanLy → ums.ref.khoaQuanLy            → TEN
       Chương trình DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc (GET) — strDaoTao_ThoiGianDaoTao_Id, strDaoTao_KhoaDaoTao_Id,
                   strDaoTao_HeDaoTao_Id, strDaoTao_KhoaQuanLy_Id                → TENCHUONGTRINH
       Học phần    DKH_PhanCong_LopHP/LayDSHocPhan (GET) — + strDaoTao_ChuongTrinh_Id → "TEN - MA"
     Bảng lớp học phần: DKH_ThongTin/LayDSLopHocPhan (GET, phân trang máy chủ 10 dòng) — strTuKhoa (gốc txtAAAA → ''),
       strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, strNguoiThucHien_Id, pageIndex, pageSize, strDangKy_KeHoachDangKy_Id '',
       dLocGanTheoCTDT 0, dChiLayCacLopChuaPhanCong 0, strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id, strDaoTao_HeDaoTao_Id,
       strDaoTao_KhoaQuanLy_Id, dSoDaDangTuSo -1, dSoDaDangDenSo -1, strDaoTao_CoSoDaoTao_Id (gốc dropAAAA → '') → MALOP, TENLOP, ID.
     Lưu: mỗi dòng đánh dấu một lời gọi TKGG_KeHoach/Them_KLGD_DuLieu_LopHocPhan (POST) — strKLGD_KeHoachChiTiet_Id (= ô KH chi tiết
       của khung tìm kiếm ngoài), strDaoTao_LopHocPhan_Id, strMoTa (gốc txtAAAA → ''); chạy ui.batch, xong nạp lại danh sách ngoài,
       khung vẫn mở như gốc.
   Giữ như gốc: Hệ đào tạo / Khoa quản lý không đổi theo Thời gian (thủ tục không nhận tham số); đổi Thời gian nạp lại Khóa + Học phần,
     đổi Hệ nạp lại Khóa + Chương trình + Học phần, đổi Khóa / Khoa QL nạp lại Chương trình + Học phần, đổi Chương trình nạp lại Học phần.
   Khác gốc: cha → con khoá / xoá trắng (pat.chain: Thời gian → Hệ → Khóa → Chương trình → Học phần; Thời gian → Khoa QL);
     khung hiện tên KH chi tiết đang chọn, chưa chọn thì Lưu bị chặn (gốc gửi strKLGD_KeHoachChiTiet_Id rỗng); lưu N dòng có tiến độ,
     báo gộp một lần (gốc N thông báo + gắn chồng #btnYes); gốc gọi getList_KhoaToChuc (không tồn tại) khi đổi Thời gian → gọi
     LayDSKhoaToChuc đúng ý định.
   Cố ý bỏ: ảnh minh hoạ img-kehoach_2.svg cột phải; ô Lớp QL / Năm nhập học / Người thu / Trạng thái SV (hàm có, html không có ô);
     box-footer d-none (nút Lưu / Đóng lặp, ẩn hẳn); resetCombobox (chỉ bỏ mục rỗng của select2 nhiều).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var L = ums.tkggLHP = ums.tkggLHP || {};
    var e = T.e, arr = T.arr, esc = ui.esc;

    /* ---------- Ô đánh dấu chọn dòng (checkX + ID của gốc) ---------- */
    L.cotChon = function (tieuDe) {
        return { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', title: tieuDe || '', cls: 'is-center', width: '44px',
            render: function (x) { return '<input type="checkbox" data-ck="' + esc(e(x.ID)) + '">'; } };
    };
    L.daChon = function (host) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return c.getAttribute('data-ck'); });
    };
    L.ganChonTatCa = function (host) {
        host.addEventListener('change', function (ev) {
            if (!ev.target.matches || ev.target.getAttribute('data-ck') !== 'all') return;
            var bang = ev.target.closest('table');
            if (bang) Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
    };
    L.boChon = function (host) {
        Array.prototype.forEach.call(host.querySelectorAll('input[data-ck]:checked'), function (c) { c.checked = false; });
    };

    /* Giá trị ô chọn nhiều → chuỗi nối dấu phẩy (gốc edu.util.getValById trên select multiple) */
    function vMulti(el) { return el ? (el.multiple ? (window.jQuery ? (jQuery(el).val() || []).join(',') : '') : e(el.value)) : ''; }
    L.vMulti = vMulti;

    var NHAN = { tg: 'Chọn học kỳ', he: 'Tất cả hệ đào tạo', khoa: 'Tất cả khóa đào tạo', kql: 'Tất cả khoa quản lý', ct: 'Tất cả chương trình đào tạo', hp: 'Chọn học phần' };
    var KEYS = ['tg', 'he', 'khoa', 'kql', 'ct', 'hp'];

    L.khungThem = function (o) {
        var body = '<div class="ums-kv ums-u-mb-4" style="grid-column:1 / -1"><span>Kế hoạch chi tiết</span><b>' + (o.ctTen ? esc(o.ctTen) :
            '<span class="ums-u-danger">Chưa chọn — chọn ở khung tìm kiếm trước khi Lưu</span>') + '</b></div>' +
            KEYS.map(function (k) {
                return '<div class="ums-field"><select class="ums-select" multiple data-lhp="' + k + '" data-ph="' + esc(NHAN[k]) + '"></select></div>';
            }).join('') +
            '<div class="ums-field ums-field--fit" style="grid-column:1 / -1">' + ui.btn('search', { attr: { 'data-lhp': 'tim' } }) + '</div>' +
            '<div data-lhp="bang" style="grid-column:1 / -1">' + ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"') + '</div>';
        var dlg = pat.formTrang({ host: o.host, title: 'Thêm mới - Lớp học phần', icon: 'fa-plus', body: body, buttons: [
            { text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }] });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-lhp="' + k + '"]'); }
        var el = {}; KEYS.forEach(function (k) { el[k] = f(k); ui.select2(el[k], { placeholder: NHAN[k], allowClear: true }); });
        function v(k) { return vMulti(el[k]); }

        pat.chain([el.tg, el.he, el.khoa, el.ct, el.hp]);
        pat.chain([el.tg, el.kql], { phatLai: false });

        function nap(k, call, name) {
            pat.fill(el[k], [], { head: NHAN[k] });
            return ums.api.call(call).then(function (r) { pat.fill(el[k], arr(r.data), { id: 'ID', name: name, head: NHAN[k] }); })
                .catch(function (err) { ums.api.handle(err, call.action || call.func); });
        }
        function napKhoa() { return nap('khoa', { action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }, 'TENKHOA'); }
        function napCT() { return nap('ct', { action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') }, 'TENCHUONGTRINH'); }
        function napHP() {
            return nap('hp', { action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') }, function (r) { return e(r.TEN) + ' - ' + e(r.MA); });
        }
        el.tg.addEventListener('change', function () { if (!v('tg')) return; napKhoa(); napHP(); });
        el.he.addEventListener('change', function () { if (!v('he')) return; napKhoa(); napCT(); napHP(); });
        el.khoa.addEventListener('change', function () { if (!v('khoa')) return; napCT(); napHP(); });
        el.kql.addEventListener('change', function () { if (!v('kql')) return; napCT(); napHP(); });
        el.ct.addEventListener('change', function () { if (!v('ct')) return; napHP(); });

        ums.api.call({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET' }).then(function (r) { pat.fill(el.tg, arr(r.data), { id: 'ID', name: 'DAOTAO_THOIGIANDAOTAO' }); })
            .catch(function (err) { ums.api.handle(err, 'thời gian đăng ký học'); });
        ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(el.he, arr(d), { id: 'ID', name: 'TENHEDAOTAO' }); })
            .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });
        ums.ref.khoaQuanLy().then(function (d) { pat.fill(el.kql, arr(d), { id: 'ID', name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });

        /* Bảng lớp học phần (phân trang máy chủ như gốc, 10 dòng / trang) */
        var bang = f('bang'), trang = { index: 1, size: 10 }, luot = 0;
        L.ganChonTatCa(bang);
        function tai(p) {
            if (p) trang.index = p;
            var sh = ++luot;
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: 'DKH_ThongTin/LayDSLopHocPhan', method: 'GET', strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'),
                strNguoiThucHien_Id: '', pageIndex: trang.index, pageSize: trang.size, strDangKy_KeHoachDangKy_Id: '', dLocGanTheoCTDT: 0, dChiLayCacLopChuaPhanCong: 0,
                strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql'),
                dSoDaDangTuSo: -1, dSoDaDangDenSo: -1, strDaoTao_CoSoDaoTao_Id: '' }).then(function (r) {
                if (sh !== luot) return;
                var rows = arr(r.data);
                ui.table({ el: bang, rows: rows, stt: true, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' }, L.cotChon()],
                    page: { index: trang.index, size: trang.size, total: Number(r.pager) || rows.length, onChange: function (p) { tai(p); }, onSize: function (s) { trang.size = s; tai(1); } } });
            }).catch(function (err) { if (sh !== luot) return; bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách lớp học phần'); });
        }
        f('tim').addEventListener('click', function () { tai(1); });

        function luu() {
            if (!o.ctId) { ui.toast('Bạn chưa chọn kế hoạch chi tiết ở khung tìm kiếm', 'warn'); return; }
            var ids = L.daChon(bang);
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu ' + ids.length + ' dữ liệu không?', { ok: 'Lưu' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: 'TKGG_KeHoach/Them_KLGD_DuLieu_LopHocPhan', method: 'POST', strKLGD_KeHoachChiTiet_Id: o.ctId, strDaoTao_LopHocPhan_Id: id, strMoTa: '' };
                }), { title: 'Đang lưu ' + ids.length + ' lớp học phần', okText: 'Thành công', show: true }).then(function (r) {
                    if (r && r.ok) L.boChon(bang);
                    if (o.sauLuu) o.sauLuu();
                });
            });
        }
        return dlg;
    };
})();
