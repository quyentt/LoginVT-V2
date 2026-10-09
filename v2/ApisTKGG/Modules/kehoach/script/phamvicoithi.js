/* =========================================================================
   Xác định phạm vi coi thi (Thống kê giờ giảng — kế hoạch)
   Bản gốc: ApisTKGG/Modules/kehoach/html/phamvicoithi.html + script/phamvicoithi.js (1.142 dòng)
   Khung dựng chung với màn chấm thi: _phamvi.js (ums.tkggPV) — bố cục một cột như gốc:
   khung tìm kiếm (Thời gian → KH tổng hợp → KH chi tiết · từ khoá · Tìm kiếm) → khung "Danh sách kế hoạch" + nút "Thêm mới dữ liệu"
   → khung "Thêm mới dữ liệu" THAY CHỖ màn (gốc: zoneEdit_CT toggle_overide).
   ---------------------------------------------------------------------------
   Lời gọi (POST mã hoá, có func — api.js tự thêm iM; strNguoiThucHien_Id hệ tự chèn):
     Bộ lọc kế hoạch (ums.tkgg, họ 'ma'): NS_KLGD_KeHoach_MH + PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL / LayDSKLGD_TongHopKhoiLuong /
       LayDSKLGD_KeHoachChiTiet.
     Danh sách: NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4CLigVKSgP · PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_CoiThi — strTuKhoa, strKLGD_KeHoachChiTiet_Id,
       strKLGD_TongHopKhoiLuong_Id, pageIndex, pageSize; các ô gốc đọc dropAAAA → '' (xem _phamvi.js). Data = { rs, rsSoNguoiCoi }.
     Người coi thi từng ô: NS_KLGD_ThongTin_MH/DSA4FRUPJjQuKAIuKBUpKBUpJC4P · PKG_KLGV_V2_THONGTIN.LayTTNguoiCoiThiTheo — strKLGD_DuLieu_Id, dNguoiThuMay.
     Sổ theo dõi coi thi (khung Thêm mới): họ PV.HO.coiThi — XLHV_TP_PhanCong_SoTheoDoi_MH + PKG_THI_PHANCONG_SOTHEODOI.LayDSThoiGianCoiThi /
       LayDSDotThiCoiThi / LayDSHocPhanCoiThi / LayDSGiangVienCoiThi / LayDSNguoiThucHienPhanCoiThi / LayDSHinhThucThiCoiThi / LayDSPhongThiCoiThi /
       LayDSNgayThiCoiThi / LayDSSoTheoDoiCoiThi.
     Lưu từng dòng đánh dấu: NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CLigVKSgP · PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_CoiThi —
       strKLGD_KeHoachChiTiet_Id, strThi_DanhSachThi_Id (= ID dòng sổ theo dõi), strMoTa (gốc đọc txtAAAA → '').
   Giữ như gốc: ô Thời gian của khung Thêm mới chọn sẵn mục đầu (selectFirst); lưu xong khung vẫn mở, danh sách kế hoạch nạp lại;
     không bắt buộc ô lọc nào của sổ theo dõi.
   Khác gốc / Cố ý bỏ: xem khối chú thích _phamvi.js (chung hai màn). Riêng màn này cố ý bỏ save_PhamViCoiThi_DST (Them_KLGD_DuLieu_ChamThi_DST —
     không nút nào gọi, chép nhầm từ màn chấm thi).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg, PV = ums.tkggPV;
    var root = document.getElementById('tkgg-phamvicoithi');
    if (!root) return;

    PV.man(root, {
        title: 'Xác định phạm vi coi thi',
        ds: { action: 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4CLigVKSgP', func: 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_CoiThi' },
        nguoi: { action: 'NS_KLGD_ThongTin_MH/DSA4FRUPJjQuKAIuKBUpKBUpJC4P', func: 'PKG_KLGV_V2_THONGTIN.LayTTNguoiCoiThiTheo' },
        rsNguoi: 'rsSoNguoiCoi',
        nhomNguoi: 'Thông tin người coi thi',
        them: [{
            text: 'Thêm mới dữ liệu', ho: PV.HO.coiThi, nhanGV: 'GV Coi thi', nhanPhan: 'Người phân coi thi',
            luu: function (id, ctId) {
                return { action: 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CLigVKSgP', func: 'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_CoiThi',
                    strKLGD_KeHoachChiTiet_Id: ctId, strThi_DanhSachThi_Id: id, strMoTa: '' };
            }
        }]
    });
})();
