/* =========================================================================
   Khung dùng chung của module Ký túc xá / Tài chính (ums.ktxTC)
   ---------------------------------------------------------------------------
   Nguồn ô chọn dùng ở nhiều màn (mỗi lần gọi trả MỘT object mới để ums.crud
   không giữ bản tải cũ qua các lần mở màn):
       src.khoanThu()   TC_KhoanThu/LayDanhSach      GET  strTuKhoa '', strNhomCacKhoanThu_Id '', strNguoiThucHien_Id '', strcanboquanly_id '', 1/10000
       src.luyKe()      KTX_LuyKe/LayDanhSach        GET  strTuKhoa '', strNguoiThucHien_Id '', 1/10000
       src.phong()      KTX_Phong/LayDanhSach        GET  mọi lọc rỗng, 1/100000 — hiện MA như bản gốc (genCombo_Phong name: "MA")
       src.dvt()        danh mục KTX.DVT0 (constant.setting.CATOR.KTX.DVT0)
       src.loaiPhong()  danh mục KTX.LP00
       src.nvap()       danh mục KTX.NVAP (nghiệp vụ áp dụng)
       src.nhomKT()     danh mục TC.NKT0 (nhóm khoản thu)
   namNay() / thangNay() thay edu.util.thisYear / thisMonth (tháng 2 chữ số như addZeroToDate).
   ========================================================================= */
(function () {
    'use strict';
    var T = window.ums.ktxTC || (window.ums.ktxTC = {});

    T.src = {
        khoanThu: function () {
            return { call: { action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', strNhomCacKhoanThu_Id: '', strNguoiThucHien_Id: '', strcanboquanly_id: '', pageIndex: 1, pageSize: 10000 }, name: 'TEN' };
        },
        luyKe: function () {
            return { call: { action: 'KTX_LuyKe/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 }, name: 'TEN' };
        },
        phong: function () {
            return { call: { action: 'KTX_Phong/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_ToaNha_Id: '', strPhanLoaiDoiTuong_Id: '', strTangThu_Id: '', strLoaiPhong_Id: '', strTinhChat_Id: '', strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 }, name: 'MA' };
        },
        dvt: function () { return { dm: 'KTX.DVT0' }; },
        loaiPhong: function () { return { dm: 'KTX.LP00' }; },
        nvap: function () { return { dm: 'KTX.NVAP' }; },
        nhomKT: function () { return { dm: 'TC.NKT0' }; }
    };

    T.namNay = function () { return String(new Date().getFullYear()); };
    T.thangNay = function () { var m = new Date().getMonth() + 1; return (m < 10 ? '0' : '') + m; };
    T.e = function (v) { return v === undefined || v === null ? '' : v; };
})();
