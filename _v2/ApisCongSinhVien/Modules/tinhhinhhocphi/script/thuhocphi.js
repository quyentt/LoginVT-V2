/* =========================================================================
   thuhocphi — Thanh toán học phí (Cổng sinh viên, vai trò thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/tinhhinhhocphi/html/thuhocphi.html
            + script/thuhocphi.js
   ---------------------------------------------------------------------------
   ⚠ BẢN GỐC CHƯA BAO GIỜ CHẠY ĐƯỢC — hai lỗi chồng nhau:
     1. html gọi `new ThuHocPhi()` nhưng tệp thuhocphi.js lại khai lớp
        `TinhHinhHocPhi` (là bản chép CŨ của màn Tình hình học phí, chỉ khác
        tiền tố action của LayThongTinChiTietHoSo: SV_HoSoHocVien_MH thay cho
        SV_Custom) → ReferenceError ngay khi mở màn;
     2. kể cả khi sửa tên lớp, html KHÔNG có một id/lớp nào mà mã đó tìm
        (#lblHoTen, .btnDetail_*, #tblChiTietKhoan, các thẻ số liệu…): html là
        MỘT TRANG MẪU TĨNH, dữ liệu viết cứng ("Phạm Ngọc Đạo", "71DCTD22025",
        ba dòng học phí 4,000,000 và dòng Tổng 12,000,000).
   Bản mới dựng theo ĐÚNG bố cục của trang mẫu đó, nhưng đổ dữ liệu thật bằng
   chính hai lời gọi mà tệp .js của màn thực hiện lúc khởi tạo. Mọi điểm phải
   đoán đều ghi ở "Cần nghiệp vụ quyết" bên dưới và trong báo cáo.

   Bố cục GIỮ như trang mẫu — MỘT cột, trong một khung:
     · "Thông tin cá nhân": các ô nhãn : giá trị;
     · hàng bên phải: ô chọn hình thức thanh toán + nút "Thực hiện thanh toán";
     · "Thông tin thanh toán": bảng Nội dung · Số tiền · Ghi chú · Chọn, có dòng
       Tổng và dòng "Tổng tiền đã chọn".

   Lời gọi (chép nguyên action / func / tham số / tên cột):
     SV_HoSoHocVien_MH/…  pkg_hosohocvien.LayThongTinChiTietHoSo   thông tin cá nhân
                          (HODEM, TEN, MASO, QLSV_NGUOIHOC_NGAYSINH, LOP, NGANH —
                           tên cột lấy từ màn profile/hoso.js dùng cùng procedure)
     TC_ThongTin_MH/…     pkg_taichinh_thongtin.LayDSTinhTrangTaiChinh  tổng nợ/dư
     TC_ThongTin_MH/…     pkg_taichinh_thongtin.LayDSKhoanNoChung       bảng thanh toán

   Cần nghiệp vụ quyết (xem báo cáo):
     · Bảng "Thông tin thanh toán" lấy từ LayDSKhoanNoChung (khoản còn nợ) —
       trang mẫu không nói nguồn; cột "Ghi chú" đọc GHICHU, procedure có thể
       không trả cột này (khi đó để trống).
     · Ô chọn hình thức thanh toán và nút "Thực hiện thanh toán" của trang mẫu
       KHÔNG có nguồn dữ liệu và KHÔNG có trình xử lý → giữ nút, đặt disabled.
     · Trang mẫu có ô "Khóa" nhưng procedure hồ sơ không trả cột khoá nào đã
       biết → bản mới không vẽ ô đó.
   Kéo gốc 30/9: tệp .js gốc chỉ đổi tên cột tình trạng người học
   (QLSV_TRANGTHAINGUOIHOC_* → TRANGTHAINGUOIHOC_N1_*) trong lớp chép không chạy;
   bản này không hiện tình trạng người học → không có gì để chuyển.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-thuhocphi');
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var sv = (ums.session && ums.session.userId) || '';

    var TT = 'TC_ThongTin_MH/', F = 'pkg_taichinh_thongtin.';
    var G = {
        hoSo:      { action: 'SV_HoSoHocVien_MH/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP', func: 'pkg_hosohocvien.LayThongTinChiTietHoSo' },
        tinhTrang: { action: TT + 'DSA4BRIVKC8pFTMgLyYVICgCKSgvKQPP', func: F + 'LayDSTinhTrangTaiChinh' },
        nochung:   { action: TT + 'DSA4BRIKKS4gLw8uAik0LyYP', func: F + 'LayDSKhoanNoChung' }
    };
    function goi(k, o) { return ums.api.call(Object.assign({ silent: true }, G[k], o || {})); }

    var dtNo = [];

    root.innerHTML =
        pat.page('Thanh toán học phí', '') +
        pat.panel({ title: 'Thông tin cá nhân', icon: 'fa-user-graduate', cls: 'ums-u-mb-4',
                    body: '<div class="hp-canhan" data-z="tt"></div>' +
                          '<div class="hp-nut ums-u-mt-4">' +
                          '<div class="ums-field ums-field--fit"><select class="ums-select" data-f="httt" disabled>' +
                          '<option value="">Chọn hình thức thanh toán</option></select></div>' +
                          ui.btn('confirm', { text: 'Thực hiện thanh toán', icon: 'fa-paper-plane', mod: 'out-info', attr: { disabled: 'disabled' } }) +
                          '</div>' }) +
        pat.panel({ title: 'Thông tin thanh toán', icon: 'fa-money-check-dollar', flush: true,
                    tools: '<span class="ums-u-fz13 ums-u-muted" data-z="chon"></span>',
                    body: '<div data-z="bang"></div>' });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    /* ---------- Thông tin cá nhân ----------------------------------------- */
    z('tt').innerHTML = ui.empty('Đang tải thông tin…', 'fa-spinner fa-spin');
    goi('hoSo', { strId: sv }).then(function (r) {
        var d = arr(r.data)[0] || {};
        z('tt').innerHTML =
            kv('Họ tên', (e(d.HODEM) + ' ' + e(d.TEN)).trim()) +
            kv('Mã Sinh viên', d.MASO) +
            kv('Ngày sinh', d.QLSV_NGUOIHOC_NGAYSINH) +
            kv('Lớp', d.LOP) +
            kv('Ngành', d.NGANH) +
            '<div class="ums-kv"><span>Tình trạng tài chính</span><b data-z="noco">—</b></div>';
        return goi('tinhTrang', { strQLSV_NguoiHoc_Id: sv, strNguonDuLieu_Id: '' });
    }).then(function (r) {
        var a = ((r.data || {}).rsThongTin || [])[0];
        var el = z('noco');
        if (!el) return;
        var n = a ? Number(e(a.NOCO)) : NaN;
        if (!a || isNaN(n) || e(a.NOCO) === '') el.innerHTML = ui.badge('Chưa xác định', 'mute');
        else if (n > 0) el.innerHTML = ui.badge('Tổng dư: ' + ui.money(n) + ' đ', 'ok');
        else if (n < 0) el.innerHTML = ui.badge('Tổng nợ: ' + ui.money(Math.abs(n)) + ' đ', 'bad');
        else el.innerHTML = ui.badge('Đã hoàn thành', 'ok');
    }).catch(function (err) { ums.api.handle(err, 'thông tin cá nhân'); });

    function kv(nhan, gt) {
        return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(gt) + '</b></div>';
    }

    /* ---------- Bảng thông tin thanh toán --------------------------------- */
    z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    goi('nochung', { pageIndex: 1, pageSize: 1000000000, strQLSV_NguoiHoc_Id: sv }).then(function (r) {
        dtNo = arr(r.data);
        ui.table({
            el: z('bang'), rows: dtNo, empty: 'Không có khoản nào cần thanh toán',
            columns: [
                { title: 'Nội dung', prop: 'NOIDUNG' },
                { title: 'Số tiền', cls: 'is-right is-nowrap', sum: true, sumProp: 'SOTIEN',
                  render: function (x) { return ui.money(x.SOTIEN); } },
                { title: 'Ghi chú', prop: 'GHICHU' },
                { head: 'Chọn <input type="checkbox" data-ckall>', title: 'Chọn', cls: 'is-center', width: '90px',
                  render: function (x) { return '<input type="checkbox" data-ck value="' + esc(x.ID) + '">'; } }
            ]
        });
        var all = z('bang').querySelector('[data-ckall]');
        if (all) {
            all.addEventListener('click', function () {
                Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) { c.checked = all.checked; });
                tongChon();
            });
        }
        z('bang').addEventListener('change', tongChon);
        tongChon();
    }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); });

    /* "Tổng tiền đã chọn" — bản gốc show_TongTien của lớp TinhHinhHocPhi */
    function tongChon() {
        var t = 0;
        Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-ck]'), function (c) {
            if (!c.checked) return;
            for (var i = 0; i < dtNo.length; i++) {
                if (String(dtNo[i].ID) === c.value) { t += Number(pat.num(dtNo[i].SOTIEN)) || 0; break; }
            }
        });
        z('chon').textContent = t ? 'Tổng tiền đã chọn: ' + ui.money(t) : '';
    }
})();
