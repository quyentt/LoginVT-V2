/* =========================================================================
   Hồ sơ sinh viên — phần dùng chung của "Quá hạn" (quahan) và "Tìm kiếm sinh viên"
   (timkiemsinhvien). Hai tệp gốc (script/QuaHan.js — tệp thật tên quahan.js — và
   script/timkiemsinhvien.js) chép nhau gần từng dòng phần thanh lọc và khối
   addKeyValue của "Xuất báo cáo".

   Thanh lọc: CHÍNH ums.pat.boLocNguoiHoc của Xử lý học vụ
   (tầng chung ums.pat.boLocNguoiHoc — assets/js/patterns.js):
   gốc XLHV và gốc hai màn này cùng một khuôn — Hệ · Khoá · CT · Lớp · Năm nhập học ·
   Khoa QL · Học kỳ CHỌN NHIỀU, gọi edu.system.getList_* (KHÔNG lọc quyền),
   KHCT_NamNhapHoc/LayDanhSach GET, "Chọn trạng thái sinh viên" QLSV.TRANGTHAI đánh dấu sẵn.
   Luật cha → con (Hệ → Khoá → CT → Lớp khoá tầng dưới) do boLoc lo.

   ums.hsB.boLoc(host, { them }) → loc của ums.pat.boLocNguoiHoc + các hàm dưới
       thamSo()                      bộ tham số lọc chung (tên chép nguyên gốc)
       baoCao(add, ids, thuTu)       khối addKeyValue của getList_MauImport gốc
                                     (ids = dòng đã đánh dấu ở bảng; thuTu = mảng thứ tự,
                                     rỗng thì gửi "" như gốc)
   ums.hsB.chia(mảng)              → 4 lát 120 phần tử (strNguoiHoc_ThanhPhan_Ids_01…04)
   ums.hsB.cotChon(tên thuộc tính) cột ô đánh dấu + "chọn tất cả" cho ums.ui.table
   ums.hsB.ganChon(host, attr, onDoi) gắn "chọn tất cả" cho cột trên

   Khác bản gốc: xem chú thích pat.boLocNguoiHoc (luật cha → con, bỏ resetCombobox của ô chọn
   nhiều kiểu cũ). Ô Học kỳ gốc có mà KHÔNG gửi đi đâu (danh sách lẫn báo cáo) — giữ ô,
   không gửi, như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui;
    var H = ums.hsB = ums.hsB || {};

    H.uid = function () { return (ums.session && ums.session.userId) || ''; };
    H.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    H.e = function (v) { return v === null || v === undefined ? '' : v; };

    H.chia = function (a) {
        a = a || [];
        return [a.slice(0, 120), a.slice(120, 240), a.slice(240, 360), a.slice(360, 480)];
    };

    H.boLoc = function (host, o) {
        o = o || {};
        var loc = ums.pat.boLocNguoiHoc(host, {
            hang: [['he', 'khoa', 'ct', 'lop'], ['nam', 'kql', 'hk'], ['q', 'nut']],
            them: o.them || ''
        });
        function q() { return loc.f('q') ? (loc.f('q').value || '').trim() : ''; }

        /* Phần chung của getList_QuaHan / TaoHangDoi / báo cáo gốc */
        loc.thamSo = function () {
            return {
                strTuKhoa: q(),
                strKhoaQuanLy_Id: loc.v('kql'),
                strHeDaoTao_Id: loc.v('he'),
                strKhoaDaoTao_Id: loc.v('khoa'),
                strChuongTrinh_Id: loc.v('ct'),
                strLopQuanLy_Id: loc.v('lop'),
                strNguoiDangNhap_Id: H.uid(),
                strTrangThaiNguoiHoc_Id: loc.tt.val()
            };
        };

        /* edu.system.getList_MauImport(zone, function (addKeyValue) { … }) gốc — thứ tự khoá chép nguyên */
        loc.baoCao = function (add, ids, thuTu) {
            var c = H.chia(ids), t = thuTu ? H.chia(thuTu) : null;
            var p = {
                strTuKhoa: q(),
                strChucNang_Id: H.cn(),
                strNguoiHoc_ThanhPhan_Ids_01: c[0].toString(),
                strNguoiHoc_ThanhPhan_01: t ? t[0].toString() : '',
                strNguoiHoc_ThanhPhan_Ids_02: c[1].toString(),
                strNguoiHoc_ThanhPhan_02: t ? t[1].toString() : '',
                strNguoiHoc_ThanhPhan_Ids_03: c[2].toString(),
                strNguoiHoc_ThanhPhan_03: t ? t[2].toString() : '',
                strNguoiHoc_ThanhPhan_Ids_04: c[3].toString(),
                strNguoiHoc_ThanhPhan_04: t ? t[3].toString() : '',
                strNamNhapHoc: loc.v('nam'),
                strKhoaQuanLy_Id: loc.v('kql'),
                strHeDaoTao_Id: loc.v('he'),
                strKhoaDaoTao_Id: loc.v('khoa'),
                strChuongTrinh_Id: loc.v('ct'),
                strLopQuanLy_Id: loc.v('lop'),
                strNguoiDangNhap_Id: H.uid(),
                strTrangThaiNguoiHoc_Id: loc.tt.val()
            };
            Object.keys(p).forEach(function (k) { add(k, p[k]); });
        };

        loc.q = q;
        return loc;
    };

    /* ---- Cột ô đánh dấu (checkX + chkSystemSelectAll gốc) ----
       Thuộc tính riêng (data-hsb…) — KHÔNG dùng data-ck: trùng ô trạng thái của pat.checks. */
    H.cotChon = function (attr, idProp) {
        return {
            head: '<input type="checkbox" ' + attr + '-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" ' + attr + '="' + ui.esc(H.e(r[idProp || 'ID'])) + '">'; }
        };
    };
    H.ganChon = function (host, attr, onDoi) {
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.hasAttribute(attr + '-all')) {
                Array.prototype.forEach.call(host.querySelectorAll('[' + attr + ']'), function (x) {
                    if (x.checked !== t.checked) { x.checked = t.checked; if (onDoi) onDoi(x); }
                });
            } else if (t.hasAttribute(attr) && onDoi) onDoi(t);
        });
    };
    H.daChon = function (host, attr) {
        return Array.prototype.map.call(host.querySelectorAll('[' + attr + ']:checked'), function (x) { return x.getAttribute(attr); });
    };
})();
