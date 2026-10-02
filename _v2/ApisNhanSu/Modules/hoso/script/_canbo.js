/* =========================================================================
   ums.nsCanBo — khung HAI CỘT "Danh sách cán bộ" của các màn quản trị hồ sơ
   (phân hệ Nhân sự: cán bộ nhân sự CHỌN MỘT NGƯỜI rồi xem / sửa hồ sơ người đó)
   ---------------------------------------------------------------------------
   Từ 2026-09-26 chỉ là lớp bọc của khung chung ums.pat.masterNhanSu
   (assets/js/patterns.js) — năm bản tự dựng của phân hệ Nhân sự đã gộp về đó.
   Giữ tên hàm để các màn (capnhatv2, qtthongtin, quatrinhdaotao, quatrinh/chucvu)
   không phải sửa.

       var cb = ums.nsCanBo.man(root, {
           tieuDe: 'Quá trình chức vụ',            // tiêu đề trang
           locTinhTrang: true,                      // ô Tình trạng làm việc (mặc định có)
           dLaCanBoNgoaiTruong: 0,                  // 0 trong trường · 1 ngoài trường · -1 tất cả
           actions: '<button…>',                    // nút đầu trang (Xuất báo cáo, Import…)
           chuaChon: 'câu dẫn lúc chưa chọn',
           onChon: function (row, host, api) { … }  // vẽ nội dung của màn vào host
       });
       cb.dangChon() · cb.idChon() · cb.tai(trang) · cb.taiLai() · cb.boChon() · cb.el
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }

    /** Một mục (ảnh + họ tên + mã cán bộ + ngày sinh) — dùng cho master của ums.crud (khoitao) */
    function itemMacDinh(r) {
        var ngay = e(r.NGAYSINH) + '/' + e(r.THANGSINH) + '/' + e(r.NAMSINH);
        return pat.anhNguoi(r.ANH) +
            '<span class="ums-master__item__main"><b>' + esc(e(r.HODEM) + ' ' + e(r.TEN)) + '</b>' +
                '<span class="ums-master__item__sub">Mã cán bộ: ' + esc(e(r.MASO)) + '</span>' +
                '<span class="ums-master__item__sub">Ngày sinh: ' + esc(ngay) + '</span></span>';
    }

    function man(root, o) {
        o = o || {};
        return pat.masterNhanSu({
            el: root,
            title: o.tieuDe,
            actions: o.actions || '',
            sideTitle: o.dsTieuDe,
            locTinhTrang: o.locTinhTrang,
            dLaCanBoNgoaiTruong: o.dLaCanBoNgoaiTruong,
            nhac: o.chuaChon,
            tenChon: o.tenChon,
            onChon: o.onChon,
            onBoChon: o.onBoChon
        });
    }

    ums.nsCanBo = { man: man, item: itemMacDinh };
})();
