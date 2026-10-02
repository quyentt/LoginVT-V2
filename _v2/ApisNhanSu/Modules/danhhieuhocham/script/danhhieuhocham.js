/* =========================================================================
   Danh hiệu - Học hàm — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/danhhieuhocham/script/danhhieuhocham.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải một tab
   (không vẽ dải tab), hai khung:
       Học hàm    NS_QT_ChucDanh  (thêm xong: ThietLapQuaTrinhCuoiCung NHANSU_QT_CHUCDANH)
                  + lưới "Thông tin quyết định": NS_ThongTinQuyetDinh (strNguonDuLieu_Id
                    = id học hàm), tệp từng dòng vào NS_Files
       Danh hiệu  NS_QT_DanhHieu  (thêm xong: NHANSU_QT_DANHHIEU), tệp NS_Files
   LayDanhSach GET (strNhanSu_HoSoCanBo_Id = cán bộ đang chọn) · LayChiTiet GET ·
   ThemMoi | CapNhat · Xoa (strIds). Dùng lại ums.ccbHS.danhhieuhocham(P) — các
   điểm Nhân sự khác Cổng cán bộ nằm sau cờ P.ns (ghi ở đầu tệp Cổng cán bộ).

   Khác bản gốc (lỗi rõ ràng):
     · Danh hiệu — mở Sửa: bản gốc đổ Ngày áp dụng / Ngày hiệu lực / Ngày hết
       hiệu lực / Mô tả ĐỀU từ NHANSU_TTQUYETDINH_NGAYQD, và id quyết định ẩn
       (txtDanhHieu_QuyetDinh_ID) từ NOIPHONG → lưu lại là ghi đè sai. Ở đây đổ
       từ NHANSU_TTQUYETDINH_NGAYAD / _NGAYHL / _NGAYHHL, MOTA,
       NHANSU_THONGTINQUYETDINH_ID; Loại QĐ từ LOAIQUYETDINH_ID (gốc không đổ).
     · Lưới quyết định — dòng đã lưu: bản gốc đổ ô Ngày áp dụng từ NGAYQUYETDINH;
       ở đây từ NGAYAPDUNG (tên cột như lưới quyết định của Đi nước ngoài).
     · Nhãn "Loại quyết định (*)" của danh hiệu có dấu * nhưng arrValid gốc không
       bắt → không bắt buộc (như gốc đang chạy).
   ========================================================================= */
(function () {
    'use strict';

    ums.nsQT.man({
        el: document.getElementById('ns_danhhieuhocham'),
        title: 'Danh hiệu - Học hàm',
        mo: function (host, cb, P) { ums.nsQT.sections(host, ums.ccbHS.danhhieuhocham(P)); }
    });
})();
