/* =========================================================================
   Xác định phạm vi chấm thi (Thống kê giờ giảng — kế hoạch)
   Bản gốc: ApisTKGG/Modules/kehoach/html/phamvichamthi.html + script/phamvichamthi.js (1.691 dòng)
   Khung dựng chung với màn coi thi: _phamvi.js (ums.tkggPV) — bố cục một cột như gốc:
   khung tìm kiếm (Thời gian → KH tổng hợp → KH chi tiết · từ khoá · Tìm kiếm) → khung "Danh sách kế hoạch" + HAI nút
   "Thêm mới dữ liệu theo Túi" / "Thêm mới dữ liệu theo DST" → khung tương ứng THAY CHỖ màn (gốc: zoneEdit_CT / zoneEdit_DST toggle_overide).
   ---------------------------------------------------------------------------
   Lời gọi (POST mã hoá, có func — api.js tự thêm iM; strNguoiThucHien_Id hệ tự chèn):
     Bộ lọc kế hoạch (ums.tkgg, họ 'ma'): NS_KLGD_KeHoach_MH + PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL / LayDSKLGD_TongHopKhoiLuong /
       LayDSKLGD_KeHoachChiTiet.
     Danh sách: NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4CKSAsFSko · PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_ChamThi — strTuKhoa, strKLGD_KeHoachChiTiet_Id,
       strKLGD_TongHopKhoiLuong_Id, pageIndex, pageSize; các ô gốc đọc dropAAAA → '' (xem _phamvi.js). Data = { rs, rsSoNguoiCham }.
     Người chấm thi từng ô: NS_KLGD_ThongTin_MH/DSA4FRUPJjQuKAIpICwVKSgVKSQu · PKG_KLGV_V2_THONGTIN.LayTTNguoiChamThiTheo — strKLGD_DuLieu_Id, dNguoiThuMay.
     Theo TÚI bài (họ PV.HO.chamThiTui): PKG_THI_PHANCONG_SOTHEODOI.LayDSThoiGianChamThiTui / LayDSDotThiChamThiTui / LayDSHocPhanChamThiTui /
       LayDSDotPhachChamThiTui / LayDSGiangVienChamThiTui / LayDSNguoiPhanChamThiTui / LayDSHinhThucThiChamThiTui / LayDSPhongThiChamThiTui /
       LayDSNgayThiChamThiTui / LayDSSoTheoDoiChamThiTui (có strThi_DotPhach_Id) → lưu NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CKSAsFSkoHhU0KAPP ·
       PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_Tui — strKLGD_KeHoachChiTiet_Id, strThi_TuiBai_Id (= ID dòng), strMoTa ''.
     Theo DANH SÁCH THI (họ PV.HO.chamThi): …ChamThi (không Đợt phách) → lưu NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CKSAsFSkoHgUSFQPP ·
       PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_DST — strKLGD_KeHoachChiTiet_Id, strThi_DanhSachThi_Id (= ID dòng), strMoTa ''.
   Giữ như gốc: ô Thời gian hai khung Thêm mới KHÔNG chọn sẵn (khác màn coi thi); lưu xong khung vẫn mở, danh sách kế hoạch nạp lại.
   Khác gốc / Cố ý bỏ: xem khối chú thích _phamvi.js (chung hai màn). Riêng màn này: ô Đợt phách (khung theo Túi) được nạp theo Môn —
     gốc có ô + hàm getList_DotPhach_CT nhưng lời gọi bị ghi chú (ô luôn trống); dropSearch_DotPhach_DST gốc đã ghi chú trong html → không có.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg, PV = ums.tkggPV;
    var root = document.getElementById('tkgg-phamvichamthi');
    if (!root) return;

    PV.man(root, {
        title: 'Xác định phạm vi chấm thi',
        ds: { action: 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4CKSAsFSko', func: 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_ChamThi' },
        nguoi: { action: 'NS_KLGD_ThongTin_MH/DSA4FRUPJjQuKAIpICwVKSgVKSQu', func: 'PKG_KLGV_V2_THONGTIN.LayTTNguoiChamThiTheo' },
        rsNguoi: 'rsSoNguoiCham',
        nhomNguoi: 'Thông tin người chấm thi',
        them: [{
            text: 'Thêm mới dữ liệu theo Túi', ho: PV.HO.chamThiTui, tui: true, nhanGV: 'GV Chấm thi', nhanPhan: 'Người phân chấm thi',
            luu: function (id, ctId) {
                return { action: 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CKSAsFSkoHhU0KAPP', func: 'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_Tui',
                    strKLGD_KeHoachChiTiet_Id: ctId, strThi_TuiBai_Id: id, strMoTa: '' };
            }
        }, {
            text: 'Thêm mới dữ liệu theo DST', ho: PV.HO.chamThi, nhanGV: 'GV Chấm thi', nhanPhan: 'Người phân chấm thi',
            luu: function (id, ctId) {
                return { action: 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CKSAsFSkoHgUSFQPP', func: 'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_DST',
                    strKLGD_KeHoachChiTiet_Id: ctId, strThi_DanhSachThi_Id: id, strMoTa: '' };
            }
        }]
    });
})();
