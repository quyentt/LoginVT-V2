/* =========================================================================
   Bảng tính lương và phụ cấp — xem / tính bảng lương THÁNG theo quy định lương
   Bản gốc: ApisNhanSu/Modules/luong/script/bangtinhluongvaphucap.js
   Khung chung: ums.luongA.bangTinh (script/_luongA.js) — dùng chung với bangtinhluongnam.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
     L_BangQuyDinhLuong/LayDanhSach   GET  ô quy định (tên = MUCLUONGCOBAN)
     NS_HoSoV2/LayDanhSach            GET  ô thành viên theo đơn vị (dLaCanBoNgoaiTruong 0)
     L_CauTrucBangLuong/LayDanhSach   GET  cây thành phần → tiêu đề nhiều tầng
     L_DuLieuBangLuong/LayDanhSach    GET  { rsNhanSu, rsDuLieuLuong } — ô tra theo
                                           NHANSU_HOSOCANBO_ID × THANHPHAN_ID
     L_BangLuong/ThucHienTinhLuong    POST nút "Tính lương"
   "Xuất báo cáo": mẫu báo cáo của chức năng (getList_MauImport) → ums.report, cùng bộ khoá.
   Giữ như gốc: Xem bắt buộc Quy định + Tháng + Năm; ô định dạng tiền, dòng tổng
   mọi cột thành phần; "Tính lương" không hỏi lại.
   Bỏ: ô nhập trong bảng / di chuyển bằng phím (genTable_HSSV, SV_HoSo/LayDanhSach —
   mã chết không nơi nào gọi), bảng tiêu đề dính kiểu nhân bản #clone.
   ========================================================================= */
(function () {
    'use strict';
    var A = ums.luongA;
    A.bangTinh({
        root: document.getElementById('bangtinhluongvaphucap'),
        tieuDe: 'Bảng tính lương và phụ cấp',
        khung: 'BẢNG TÍNH LƯƠNG VÀ PHỤ CẤP',
        thang: true,
        tien: true,
        cauTruc: 'L_CauTrucBangLuong/LayDanhSach',
        duLieu: function (v) {
            return {
                action: 'L_DuLieuBangLuong/LayDanhSach', method: 'GET',
                strDaoTao_CoCauToChuc_Id: v.dv,
                strNhanSu_HoSoCanBo_Id: v.tv,
                dThang: v.thang,
                dNam: v.nam,
                strNguoiThucHien_Id: '',
                strLoaiBangLuong_Id: v.loai
            };
        },
        tinh: function (v) {
            return {
                action: 'L_BangLuong/ThucHienTinhLuong',
                strDaoTao_CoCauToChuc_Id: v.dv,
                strNhanSu_HoSoCanBo_Id: v.tv,
                strThang: v.thang,
                strNam: v.nam,
                strNguoiThucHien_Id: A.uid(),
                strLoaiBangLuong_Id: v.loai
            };
        }
    });
})();
