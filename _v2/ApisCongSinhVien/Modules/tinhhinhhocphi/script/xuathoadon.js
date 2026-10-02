/* =========================================================================
   xuathoadon — Xuất hóa đơn (Cổng sinh viên, vai trò thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/tinhhinhhocphi/html/xuathoadon.html
            + script/tinhhinhhocphi.js  ← ĐÚNG tệp .js của màn Tình hình học phí
   (hai html nạp chung một lớp TinhHinhHocPhi). Phần chung nằm ở
   script/_hocphi.js — đọc chú thích đầu tệp đó để biết lời gọi, lỗi bản gốc
   và những gì đã bỏ.

   Bố cục GIỮ như gốc — MỘT cột, HAI tab:
     · khối thông tin người học (gốc màn này KHÔNG hiện "Lớp" và KHÔNG có nút
       "Hướng dẫn" — giữ đúng vậy);
     · tab "Xuất hóa đơn": hàng nút xuất HĐĐT + bảng "Khoản đã nộp chưa xuất
       hóa đơn" (chọn dòng bằng ô đánh dấu, có ô chọn tất cả ở đầu cột);
     · tab "Thông tin tài chính": lưới thẻ số liệu, mỗi thẻ có nút "Chi tiết".

   Khác bản gốc (cách làm):
     · Dải tab dựng bằng ums.ui.tabs (gốc dùng nav-tabs của Bootstrap 5).
     · Bảng có tiêu đề khung "Khoản đã nộp chưa xuất hóa đơn" — chính chữ bản
       gốc đặt cho hộp thoại cùng bảng này ở màn Tình hình học phí — để hàng
       nút xuất nằm ở .ums-panel__tools và dính đỉnh khi cuộn.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.csvHocPhi;
    var root = document.getElementById('csv-xuathoadon');
    var dsHoaDon = [];

    root.innerHTML =
        pat.page('Xuất hóa đơn', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div data-z="sv"></div>' }) +
        ui.tabs([
            { key: 'hd', text: 'Xuất hóa đơn', icon: 'fa-file-invoice' },
            { key: 'tc', text: 'Thông tin tài chính', icon: 'fa-circle-info' }
        ], 'hd', 'data-xtab') +
        '<div data-z="tab-hd">' +
            pat.panel({ title: 'Khoản đã nộp chưa xuất hóa đơn', icon: 'fa-file-invoice-dollar', flush: true,
                        tools: '<span class="hp-nut" data-z="nut"></span>',
                        body: '<div data-z="bang"></div>' }) +
        '</div>' +
        '<div data-z="tab-tc" hidden>' +
            pat.panel({ title: false, flush: true, body: '<div class="hp-the" data-z="the"></div>' }) +
        '</div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    /* ---------- Tab ------------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-xtab]');
        if (t) {
            var k = t.getAttribute('data-xtab');
            ui.tabsActive(root, k, 'data-xtab');
            z('tab-hd').hidden = k !== 'hd';
            z('tab-tc').hidden = k !== 'tc';
            return;
        }
        var the = ev.target.closest('[data-the]');
        if (the) H.hopChiTiet(the.getAttribute('data-the'));
    });

    /* ---------- Dữ liệu --------------------------------------------------- */
    H.thongTinSV(z('sv'), {}).then(nap);

    function nap() {
        H.veThe(z('the'), null);
        return H.napTinhTrang().then(function (d) {
            dsHoaDon = d.hoaDon || [];
            H.veThe(z('the'), d.tt);
            H.noCo(z('sv'), d.tt);
            H.bangHoaDon(z('bang'), dsHoaDon);
        }).catch(function (err) { ums.api.handle(err, 'tình trạng tài chính'); });
    }

    /* ---------- Nút xuất hoá đơn điện tử ---------------------------------- */
    H.nutHDDT(z('nut'), {
        bang: root,
        rows: function () { return dsHoaDon; },
        sauKhiXuat: nap
    });
})();
