/* =========================================================================
   ApisKyTucXa / kehoach — phần DÙNG CHUNG của các màn kế hoạch đăng ký
   (kehoach, kehoachdangky, phanphongdangky, xepphongdangky). Đặt ở ums.ktxKH.
   ---------------------------------------------------------------------------
   ums.ktxKH.keHoach()        → Promise<[{ ID, TENKEHOACH, TUNGAY, DENNGAY, NGAYVAO, NGAYRA, LOAIKEHOACH_ID, LOAIKEHOACH_TEN,
                                 SONGAYHIEULUCGIUCHO, HIEULUC, SOPHONGPHANCONG, SODOITUONG }]>
       KTX_KeHoachDangKy/LayDanhSach GET — strTuKhoa "", strLoaiKeHoach_Id "", strNguoiThucHien_Id "", pageIndex 1, pageSize 100000
       (ô chọn kế hoạch của các màn phân phòng / xếp phòng); nhớ trong một lần mở màn, ums.ktxKH.quen() để xoá.
   ums.ktxKH.hieuLuc(r)       → nhãn Hiệu lực / Hết hiệu lực theo cột HIEULUC (1 / 0)
   ums.ktxKH.tenKH(r)         → "Tên kế hoạch (Từ ngày – Đến ngày)" cho ô chọn
   ums.ktxKH.rows(r) / e(v)   tiện ích đọc kết quả ums.api.call / rỗng → ''
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var K = ums.ktxKH = {};

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    K.e = e;
    K.rows = rows;

    var p = null;
    K.keHoach = function () {
        if (!p) {
            p = ums.api.call({
                action: 'KTX_KeHoachDangKy/LayDanhSach', method: 'GET',
                strTuKhoa: '', strLoaiKeHoach_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
            }).then(rows, function (err) {
                p = null;
                ums.api.handle(err, 'danh sách kế hoạch đăng ký');
                return [];
            });
        }
        return p;
    };
    K.quen = function () { p = null; };

    K.hieuLuc = function (r) {
        return String(r.HIEULUC) === '1' ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'bad');
    };
    K.tenKH = function (r) {
        var tg = e(r.TUNGAY) + (e(r.DENNGAY) ? ' – ' + e(r.DENNGAY) : '');
        return e(r.TENKEHOACH) + (tg ? ' (' + tg + ')' : '');
    };
})();
