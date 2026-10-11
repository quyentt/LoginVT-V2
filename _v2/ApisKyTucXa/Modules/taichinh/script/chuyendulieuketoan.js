/* =========================================================================
   Chuyển dữ liệu kế toán (Ký túc xá → Tính toán) — quy trình 2, chạy bằng hàng đợi
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/chuyendulieuketoan.html + script/chuyendulieuketoan.js (1.012 dòng)
   ---------------------------------------------------------------------------
   Bố cục hai cột trên + bảng kết quả dưới y hệt màn Tính phí → khung chung ums.ktxTC.hangDoi (_hangdoi.js).
   Lời gọi (chép nguyên):
       KTX_HangDoi/TaoHangDoi_ChuyenKeToan_TuDong   GET   strNam, strThang, strNghiepVuApDung_Id   (nút "Chuyển kế toán", hỏi trước)
       Hàng đợi createHangDoi strLoaiNhiemVu "CHUYENPHIKTXTUDONG" → ums.queue.mount (endHangDoi gốc rỗng — ở đây nạp lại bảng kết quả)
       KTX_TinhPhi/LayDSTinhKTX_ChuaKT   GET v1.0   strThang, strNam, strNguoiThucHien_Id (tự chèn), strNghiepVuApDung_Id
       Báo cáo (getList_MauImport "zonebtnBaoCao_CKT"): strHeDaoTao '', strKhoaDaoTao '', strThoiGianDaoTao '', strKhoanThu '' (bốn ô không có
           trong HTML — gốc gửi rỗng), strNghiepVu = nghiệp vụ áp dụng
       Danh mục KTX.NVAP; Năm / Tháng mặc định = hiện tại
   Khác gốc: bảng kết quả nạp ngay khi mở màn (gốc chờ "Xem danh sách"); cột "Mã số" gốc là liên kết .btnChiTiet chỉ được bắt trên bảng
   #tblTinChi_ChuyenDuLieu không tồn tại → chữ thường.
   Cố ý bỏ (mã chết — gốc đã ghi chú hoặc bảng / ô không có trong HTML): tab "2) Theo niên chế" + getList_NienChe, getList_TinChi / getDetail_TinChi +
   khung "Chi tiết học phí" (#zone_input, #tblChiTiet — chỉ mở từ bảng không tồn tại), getList_TrangThaiSV (#DSTrangThaiSV_CKT), CM_ThoiGianDaoTao /
   TC_KhoanThu / Hệ / Khóa (các hàm không ai gọi), proSeqMain_HangDoi / genHTML_HangDoi (hàng đợi tự viết, đã thay bằng createHangDoi), #btnYes.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ktx-chuyendulieuketoan');
    if (!root) return;
    ums.ktxTC.hangDoi({
        root: root, title: 'Chuyển dữ liệu kế toán', quyTrinh: 'Quy trình 2: Chuyển kế toán', lichSu: 'Lịch sử: Chuyển kế toán', danhSach: '1) Danh sách chuyển kế toán',
        loai: 'CHUYENPHIKTXTUDONG',
        chay: { text: 'Chuyển kế toán', icon: 'fa-calculator', confirm: 'Bạn có chắc chắn Chuyển dữ liệu không?', action: 'KTX_HangDoi/TaoHangDoi_ChuyenKeToan_TuDong', fail: 'QLTC_HangDoi.TaoHangDoi_ChuyenDuLieu_TuDong' },
        list: function (f) {
            return { action: 'KTX_TinhPhi/LayDSTinhKTX_ChuaKT', method: 'GET', versionAPI: 'v1.0', strThang: f.thang, strNam: f.nam, strNghiepVuApDung_Id: f.nv };
        },
        baoCao: function (add, f) { add('strHeDaoTao', ''); add('strKhoaDaoTao', ''); add('strThoiGianDaoTao', ''); add('strKhoanThu', ''); add('strNghiepVu', f.nv); }
    });
})();
