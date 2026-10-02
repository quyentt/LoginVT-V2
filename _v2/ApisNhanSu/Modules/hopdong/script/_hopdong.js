/* =========================================================================
   Hợp đồng (ApisNhanSu/hopdong) — lời gọi ghi NS_ThongTinHopDong dùng chung
   cho hopdongcanbo và hopdongdukien (hai tệp gốc chép cùng 45 tham số).
   ums.nsCham.hopDongCall(values, row, them) → đối tượng lời gọi ThemMoi / CapNhat.
     values: giá trị biểu mẫu (khoá = tên tham số gốc); tham số màn không có ô → rỗng
     them:   tham số riêng từng màn (vd strNhanSu_HoSoCanBo_Id của cán bộ đang xem)
   ========================================================================= */
(function () {
    'use strict';
    var S = ums.nsCham;
    var KHOA = ['strTinhTrang_Id', 'strDaoTao_CoCauToChuc_Id', 'strNhanSu_HoSoCanBo_Id', 'strDieu1_HinhThucTuyen_Id', 'strNgayTuyenDung',
        'strNgayHieuLucHopDong', 'strNgayHetHieuLucHopDong', 'strNgayKyHopDong', 'strSoHopDong', 'strDieu3_DongBaoHiem_Id',
        'strDieu3_CheDoPhucLoi_Id', 'strDieu3_HinhThucTra_Id', 'strDieu3_BangQuyDinhLuong_Id', 'strDieu3_HeSoLuong', 'strDieu3_Bac',
        'strDieu3_Ngach_Id', 'strDieu3_PhuongTienDiLai_Id', 'strDieu2_ThoiGianLamViec_Id', 'strDieu1_CongViecPhaiLam', 'strDieu1_ChucDanhCM_Id',
        'strDieu1_DiaDiemLamViec', 'strDieu1_DenNgay', 'strDieu1_TuNgay', 'strDieu1_LoaiHopDong_Id', 'strBenB_NoiCapCMTND',
        'strBenB_NgayCapCMTND', 'strBenB_SoCMTND', 'strBenB_DiaChi', 'strBenB_TrinhDoChuyenMon_Id', 'strBenB_NamSinh', 'strBenB_NgaySinh',
        'strBenB_ThangSinh', 'strBenB_QuocTich_Id', 'strBenB_Ten', 'strBenB_HoDem', 'strBenA_DienThoai', 'strBenA_DiaChi',
        'strBenA_DonVi_Id', 'strBenA_ChucVu_Id', 'strBenA_QuocTich_Id', 'strBenA_NguoiKy_Id'];
    S.hopDongCall = function (v, row, them) {
        var o = { action: 'NS_ThongTinHopDong/' + (row ? 'CapNhat' : 'ThemMoi'), strId: row ? row.ID : '' };
        KHOA.forEach(function (k) { o[k] = v[k] === undefined || v[k] === null ? '' : v[k]; });
        Object.keys(them || {}).forEach(function (k) { o[k] = them[k]; });
        o.strNguoiThucHien_Id = S.uid();
        return o;
    };
})();
