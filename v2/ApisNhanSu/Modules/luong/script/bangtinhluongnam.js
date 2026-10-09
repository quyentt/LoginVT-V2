/* =========================================================================
   Bảng tính lương năm — xem / tính bảng lương CẢ NĂM theo quy định lương
   Bản gốc: ApisNhanSu/Modules/luong/script/bangtinhluongnam.js
   Khung chung: ums.luongA.bangTinh (script/_luongA.js) — dùng chung với bangtinhluongvaphucap.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
     L_BangQuyDinhLuong/LayDanhSach        GET  ô quy định (tên = MUCLUONGCOBAN)
     NS_HoSoV2/LayDanhSach                 GET  ô thành viên theo đơn vị (dLaCanBoNgoaiTruong 0)
     L_LuongNam_CauTruc/LayDanhSach        GET  cây thành phần → tiêu đề nhiều tầng
     L_LuongNam_BangLuong/LayDanhSach      GET  { rsNhanSu, rsDuLieuLuong }
     L_LuongNam_TinhLuong/ThucHienTinhLuong POST "Tính lương" — strThang "" (như gốc)
   Khác bản tháng (giữ như gốc): không có ô Tháng (html gốc chú thích), ô hiện số
   THÔ không định dạng tiền, không có dòng tổng; báo cáo gửi dThang rỗng.
   Bỏ: như bản tháng (mã chết genTable_HSSV, bảng #clone).
   ========================================================================= */
(function () {
    'use strict';
    var A = ums.luongA;
    A.bangTinh({
        root: document.getElementById('bangtinhluongnam'),
        tieuDe: 'Bảng tính lương năm',
        khung: 'BẢNG TÍNH LƯƠNG VÀ PHỤ CẤP',
        thang: false,
        tien: false,
        cauTruc: 'L_LuongNam_CauTruc/LayDanhSach',
        duLieu: function (v) {
            return {
                action: 'L_LuongNam_BangLuong/LayDanhSach', method: 'GET',
                strTuKhoa: '',
                strDaoTao_CoCauToChuc_Id: v.dv,
                strNhanSu_HoSoCanBo_Id: v.tv,
                strNhanSu_QuyDinhLuong_Id: v.qd,
                strNguoiTao_Id: '',
                strNam: v.nam,
                strLoaiBangLuong_Id: v.loai,
                pageIndex: 1,
                pageSize: 100000
            };
        },
        tinh: function (v) {
            return {
                action: 'L_LuongNam_TinhLuong/ThucHienTinhLuong',
                strDaoTao_CoCauToChuc_Id: v.dv,
                strNhanSu_HoSoCanBo_Id: v.tv,
                strThang: '',
                strNam: v.nam,
                strNguoiThucHien_Id: A.uid(),
                strLoaiBangLuong_Id: v.loai
            };
        }
    });
})();
