/* =========================================================================
   tinhhinhhocphi — Tình hình học phí (Cổng sinh viên, vai trò thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/tinhhinhhocphi/html/tinhhinhhocphi.html
            + script/tinhhinhhocphi.js (lớp TinhHinhHocPhi, vỏ index / Core)
   Phần mã chung với màn "Xuất hóa đơn" (cùng một tệp .js ở bản gốc) nằm ở
   script/_hocphi.js — đọc chú thích đầu tệp đó để biết lời gọi, lỗi bản gốc
   và những gì đã bỏ.

   Bố cục GIỮ như gốc — MỘT cột:
     · đầu trang: tiêu đề + nút "Hướng dẫn" (gốc: khối .nav-content-right);
     · khối thông tin người học (họ tên · Mã · SĐT · Lớp · tình trạng ·
       tổng nợ/dư) — gốc .finance-user-info;
     · lưới thẻ số liệu, mỗi thẻ một con số + nút "Chi tiết" mở hộp danh sách.

   Riêng màn này (khác Xuất hóa đơn): có dòng "Lớp" và nút "Hướng dẫn".

   Kéo gốc 30/9: html gốc chia thẻ thành BA nhóm có tiêu đề ("Tổng hợp dư, nợ" ·
   "Chi tiết quá trình" · "Thông tin hóa đơn, phiếu thu") — vẽ bằng
   H.veThe(…, { nhom: true }), tiêu đề nhóm là .ums-legend; khung chứa bỏ tiêu đề
   "Thông tin tài chính" (gốc không có, ba tiêu đề nhóm đã đủ). Các thay đổi mã
   (cột tình trạng, lọc KHONGHACHTOAN, cột QR chỉ ở CMCU, bấm cả thẻ) ở _hocphi.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.csvHocPhi;
    var root = document.getElementById('csv-tinhhinhhocphi');

    root.innerHTML =
        pat.page('Tình hình học phí',
            ui.btn('view', { text: 'Hướng dẫn', icon: 'fa-circle-question', mod: 'out-primary', attr: { 'data-a': 'huongdan' } })) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div data-z="sv"></div>' }) +
        pat.panel({ title: false, body: '<div class="hp-the" data-z="the"></div>' });

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    /* 1. Thông tin người học (gốc: getDetail_DoiTuong) */
    H.thongTinSV(z('sv'), { lop: true }).then(nap);

    /* 2. Các con số + lưới thẻ (gốc: getList_TinhTrangTaiChinh) */
    function nap() {
        H.veThe(z('the'), null, { nhom: true });
        return H.napTinhTrang().then(function (d) {
            H.veThe(z('the'), d.tt, { nhom: true });
            H.noCo(z('sv'), d.tt);
        }).catch(function (err) { ums.api.handle(err, 'tình trạng tài chính'); });
    }

    /* 3. Nút "Chi tiết" của từng thẻ + nút "Hướng dẫn" */
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-the]');
        if (t) { H.hopChiTiet(t.getAttribute('data-the')); return; }
        var a = ev.target.closest('[data-a="huongdan"]');
        if (a) H.hopHuongDan();
    });
})();
