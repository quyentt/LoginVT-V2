/* =========================================================================
   Nhập học — khung TRANG MẪU của nhóm thống kê (ums.nhMau)
   Dùng ở: thongke/loaikhoan, thongke/nguoithu.
   ---------------------------------------------------------------------------
   Hai màn gốc là HTML TĨNH (số liệu viết cứng trong html, .js chỉ gọi edu.system.page_load — không lời gọi API nào).
   Chuyển nguyên trang mẫu, cùng cách với Dashboardv2 của Cổng cán bộ: giữ bố cục + số liệu của gốc, đầu trang ghi
   "Trang mẫu — số liệu dựng thử".
     Bố cục gốc: (tuỳ màn) dải "Kế hoạch / Tổng tiền" · hàng thẻ số liệu (info-box) · HAI cột: trái (col-3) khung thông tin
     "nhãn : giá trị", phải (col-9) "Lịch sử thu tiền" dạng đàn xếp theo ngày (ngày đầu mở sẵn).
     Liên kết "Chi tiết" trên thẻ gốc là href="#" không xử lý → giữ, khoá (disabled).

   ums.nhMau.man(root, {
       tieuDe, keHoach: { ten, tong },            dải kế hoạch (tuỳ chọn)
       the: [{ ten, tien, icon, mau }],           thẻ số liệu (mau: green | '' | red | purple)
       trai: { tieuDe, icon, dong: [[nhãn, giá trị, đậm?]] },
       lichSu: [{ ngay, dong: [[nhãn, tiền]], tong }]   tiền null = trống như gốc
       cotTen: tiêu đề cột tên ở bảng lịch sử (vd 'Người thu' / 'Loại khoản')
     Lịch sử mỗi ngày là BẢNG sát mép khung (tên | số tiền căn phải | dòng Tổng) — người dùng 2026-09-27: dạng "nhãn : giá trị"
     với cột nhãn hẹp làm tên gãy dòng, "khoảng trống thì rộng mà nhìn rúm ró".
   })
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui, pat = ums.pat;
    var M = ums.nhMau = ums.nhMau || {};

    function tien(v) { return v === null || v === undefined || v === '' ? '' : ui.money(v, { donVi: true }); }

    M.man = function (root, o) {
        var h = '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + ui.esc(o.tieuDe) + '</h1>' +
            '<div class="ums-page__actions"><span class="nhm-mau"><i class="fa-light fa-flask"></i> Trang mẫu — số liệu dựng thử</span></div></div>';

        if (o.keHoach) {
            h += pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                '<div class="nhm-kh"><span><i class="fa-light fa-file-invoice-dollar"></i> Kế hoạch: <b class="nhm-do">' + ui.esc(o.keHoach.ten) + '</b></span>' +
                '<span><i class="fa-light fa-sack-dollar"></i> Tổng tiền: <b>' + tien(o.keHoach.tong) + '</b></span></div>' });
        }

        h += '<div class="ums-grid ums-grid--4 ums-u-mb-4">' + o.the.map(function (t) {
            return '<div class="ums-stat' + (t.mau ? ' ums-stat--' + t.mau : '') + '">' +
                '<div class="ums-stat__icon"><i class="fa-light ' + ui.esc(t.icon) + '"></i></div>' +
                '<div class="ums-stat__main"><div class="ums-stat__label">' + ui.esc(t.ten) + '</div>' +
                '<div class="ums-stat__value">' + tien(t.tien) + '</div>' +
                '<div class="ums-stat__links"><button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" disabled title="Trang mẫu — chưa có xử lý">' +
                '<i class="fa-light fa-eye"></i><span>Chi tiết</span></button></div></div></div>';
        }).join('') + '</div>';

        /* Cột trái hẹp: nhãn dạt TRÁI, giá trị dạt PHẢI, chỉ dòng tên (dòng đầu) in đậm — cùng kiểu khung thông tin cột trái
           của Điểm học (.ums-dh__tt). Người dùng 2026-09-27: kiểu "nhãn : giá trị" cột nhãn cố định "bố trí lạ". */
        var trai = '<div class="nhm-tt">' + o.trai.dong.map(function (d) {
            return '<div><span>' + ui.esc(d[0]) + '</span><b>' + ui.esc(d[1]) + '</b></div>';
        }).join('') + '</div>';

        var ls = o.lichSu.map(function (n, i) {
            return '<details class="nhm-ngay"' + (i === 0 ? ' open' : '') + '><summary><span><i class="fa-light fa-calendar-day"></i> Ngày ' +
                ui.esc(n.ngay) + '</span><span class="nhm-ngay__tong">Tổng: <b class="nhm-do">' + (n.tong === null ? '—' : tien(n.tong)) + '</b></span></summary>' +
                '<div data-ngay="' + i + '"></div></details>';
        }).join('');

        h += '<div class="nhm-cols ums-cols">' +
            pat.panel({ title: o.trai.tieuDe, icon: o.trai.icon, body: trai }) +
            pat.panel({ title: 'Lịch sử thu tiền', icon: 'fa-clock-rotate-left', body: '<div class="nhm-ls">' + ls + '</div>' }) +
            '</div>';

        root.innerHTML = h;
        o.lichSu.forEach(function (n, i) {
            ui.table({
                el: root.querySelector('[data-ngay="' + i + '"]'),
                rows: n.dong.map(function (d) { return { TEN: d[0], TIEN: d[1] }; }),
                empty: 'Không có khoản thu',
                columns: [
                    { title: o.cotTen || 'Nội dung', prop: 'TEN' },
                    { title: 'Số tiền', cls: 'is-right is-nowrap', width: '220px', render: function (r) { return tien(r.TIEN); },
                      sum: function () { return '<b class="nhm-do">' + (n.tong === null ? '' : tien(n.tong)) + '</b>'; } }
                ]
            });
        });
    };
})();
