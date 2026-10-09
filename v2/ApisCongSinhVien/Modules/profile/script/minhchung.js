/* =========================================================================
   Minh chứng hồ sơ — Cổng sinh viên › Hồ sơ cá nhân
   (vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/profile/html/minhchung.html
            + script/minhchung.js (lớp MinhChung, vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc, MỘT cột:
     khung "Thông tin cá nhân" (KHÔNG có ảnh — khối ảnh bị chú thích bỏ trong
     html gốc; Họ tên / Ngày sinh / CMND / Mã SV / Ngành học)
     → bảng "Loại hồ sơ | Mô tả | Files dữ liệu" → nút "Lưu thông tin".

   Lời gọi (chép nguyên action / func / tên tham số / tên cột):
     TS_NH_ThongTin_MH/DSA4BRICICIJLhIuDykgMQkuIgPP
         pkg_nhaphoc_thongtin.LayDSCacHoSoNhapHoc { strQLSV_NguoiHoc_TTTS_Id }
         → ID · LOAIHOSO_ID · LOAIHOSO_TEN (cột "Loại hồ sơ") · TEN (cột "Mô tả")
     TS_NH_ThongTin_MH/DykgMQkuIh4VKTQJLhIu
         pkg_nhaphoc_thongtin.NhapHoc_ThuHoSo { strQLSV_NguoiHoc_TTTS_Id,
         strLoaiHoSo_Ids = LOAIHOSO_ID, strLoaiHoSo_SoLuong_s = SỐ TỆP đang có }
     SV_HoSoHocVien_MH/… pkg_hosohocvien.LayThongTinChiTietHoSo (khối thông tin)
   Tệp: SV_Files, khoá = ID dòng hồ sơ (bản gốc uploadFiles/viewFiles/saveFiles
   với "file" + ID, dữ liệu gắn theo e.ID) → ums.files.mount + load(ID)/save(ID).

   Giữ như bản gốc:
     · Dòng KHÔNG có tệp nào thì KHÔNG gọi NhapHoc_ThuHoSo (bản gốc kiểm
       temp.length > 0 trước khi gửi).
     · strLoaiHoSo_SoLuong_s đếm SỐ TỆP đang hiện ở ô (kể cả tệp chưa lưu),
       đúng cách bản gốc đếm các <div> trong vùng đính kèm.
   Khác bản gốc (cách làm):
     · Số thứ tự "1. 2. 3." nhập vào cột "Loại hồ sơ" của bản gốc nay là cột Stt
       của ums.ui.table.
     · Mỗi dòng lưu xong bản gốc bật một hộp thông báo riêng ("Thêm mới thành
       công!") — nay gom vào một thanh tiến độ (ums.ui.batch) và một thông báo.
   Lỗi của bản gốc (xem báo cáo):
     · `edu.util.checkValue(obj_save.strId)` — obj_save KHÔNG có khoá strId nên
       luôn báo "Thêm mới thành công!" kể cả khi cập nhật. Bỏ, dùng một câu.
     · `obj_notify` trong nhánh lỗi là biến TOÀN CỤC chưa khai (gán ngầm).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('pf-minhchung');
    if (!root || !ums.csvProfile) return;
    var P = ums.csvProfile, e = P.e, esc = P.esc, arr = P.arr;

    var A = {
        ds:  { action: 'TS_NH_ThongTin_MH/DSA4BRICICIJLhIuDykgMQkuIgPP', func: 'pkg_nhaphoc_thongtin.LayDSCacHoSoNhapHoc' },
        thu: { action: 'TS_NH_ThongTin_MH/DykgMQkuIh4VKTQJLhIu', func: 'pkg_nhaphoc_thongtin.NhapHoc_ThuHoSo' }
    };

    root.innerHTML =
        pat.page('Minh chứng hồ sơ', '') +
        pat.panel({ title: 'Thông tin cá nhân', icon: 'fa-id-card', body: '<div data-z="sv"></div>' }) +
        pat.panel({
            title: false, flush: true,
            tools: ui.btn('save', { text: 'Lưu thông tin', attr: { 'data-a': 'luu' } }),
            body: '<div data-z="bang"></div>'
        });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    P.khoiSV(z('sv'), { anh: false, lop: false, nguon: 'hoSoMH' }).nap();

    var dsHoSo = [], tep = {};

    function tai() {
        z('bang').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({ action: A.ds.action, func: A.ds.func, strQLSV_NguoiHoc_TTTS_Id: P.sv() })
            .then(function (r) { dsHoSo = arr(r.data); ve(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách hồ sơ nhập học'); });
    }

    function ve() {
        tep = {};
        ui.table({
            el: z('bang'), rows: dsHoSo, empty: 'Không có loại hồ sơ nào cần nộp',
            tableCls: 'ums-table--lined',
            columns: [
                { title: 'Loại hồ sơ', width: '40%', prop: 'LOAIHOSO_TEN' },
                { title: 'Mô tả', width: '20%', prop: 'TEN' },
                { title: 'Files dữ liệu', cls: 'pf-mc__tep', render: function (x) {
                    return '<div data-mcfile="' + esc(e(x.ID)) + '"></div>';
                } }
            ]
        });
        dsHoSo.forEach(function (x) {
            var h = z('bang').querySelector('[data-mcfile="' + e(x.ID) + '"]');
            if (!h) return;
            var f = ums.files.mount(h, { api: 'SV_Files' });
            tep[e(x.ID)] = f;
            f.load(e(x.ID));
        });
    }

    /** Số tệp đang hiện ở một dòng — bản gốc đếm $("#zoneFileDinhKemfile<ID> div") */
    function soTep(id) {
        var h = z('bang').querySelector('[data-mcfile="' + id + '"]');
        return h ? h.querySelectorAll('.ums-files__item').length : 0;
    }

    function luu(btn) {
        var viec = [];
        dsHoSo.forEach(function (x) {
            var id = e(x.ID), n = soTep(id);
            if (!n) return;                       // bản gốc: không có tệp thì bỏ qua dòng
            viec.push({
                action: A.thu.action, func: A.thu.func,
                strQLSV_NguoiHoc_TTTS_Id: P.sv(),
                strLoaiHoSo_Ids: e(x.LOAIHOSO_ID),
                strLoaiHoSo_SoLuong_s: n
            });
            viec.push(function () { return tep[id].save(id); });
        });
        if (!viec.length) { ui.toast('Bạn chưa chọn tệp minh chứng nào!', 'warn'); return; }
        btn.disabled = true;
        ui.batch(viec, { title: 'Đang lưu minh chứng', okText: 'Cập nhật thành công' })
            .then(function () { btn.disabled = false; tai(); }, function (err) { btn.disabled = false; ums.api.handle(err, 'lưu minh chứng'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="luu"]');
        if (b) luu(b);
    });

    tai();
})();
