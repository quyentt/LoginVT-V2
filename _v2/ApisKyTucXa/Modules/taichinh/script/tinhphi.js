/* =========================================================================
   Tính phí (Ký túc xá → Tính toán) — quy trình 2, chạy bằng hàng đợi
   Bản gốc: ApisKyTucXa/Modules/taichinh/html/tinhphi.html + script/tinhphi.js (404 dòng)
   ---------------------------------------------------------------------------
   Bố cục hai cột trên + bảng kết quả dưới như gốc → khung chung ums.ktxTC.hangDoi (_hangdoi.js; dùng chung với chuyendulieuketoan).
   Lời gọi (chép nguyên):
       KTX_HangDoi/TaoHangDoi_TinhPhi_TuDong   GET   strNam, strThang, strNghiepVuApDung_Id   (nút "Tính phí", hỏi trước)
       Hàng đợi createHangDoi strLoaiNhiemVu "TINHPHIKTXTUDONG" → ums.queue.mount; chạy xong (endHangDoi) → nạp lại bảng kết quả
       KTX_TinhPhi/LayDanhSach   GET v1.0   strDaoTao_ThoiGianDaoTao_Id '' (ô dropThoiGianDaoTao_TP không có trong HTML), strNguoiThucHien_Id '',
                                            strNghiepVuApDung_Id, strThang, strNam
       Báo cáo (getList_MauImport "zonebtnBaoCao_THP"): strNam, strThang, strNghiepVuApDung_Id
       Danh mục KTX.NVAP; Năm / Tháng mặc định = hiện tại (edu.util.thisYear / thisMonth)
   Khác gốc: bảng kết quả nạp ngay khi mở màn (gốc chờ "Xem danh sách"); cột "Mã số" gốc là liên kết .btnChiTiet không có trình xử lý → chữ thường.
   Cố ý bỏ (mã chết): getList_HeDaoTao / KhoaDaoTao / ThoiGianDaoTao / LoaiKhoan và các ô Hệ / Khóa / Khoản thu đã bị gốc ghi chú; #btnYes.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ktx-tinhphi');
    if (!root) return;
    ums.ktxTC.hangDoi({
        root: root, title: 'Tính phí', quyTrinh: 'Quy trình 2: Tính phí', lichSu: 'Lịch sử: Tính phí', danhSach: '1) Danh sách tính phí',
        loai: 'TINHPHIKTXTUDONG',
        chay: { text: 'Tính phí', icon: 'fa-calculator', confirm: 'Bạn có chắc chắn Tính phí không?', action: 'KTX_HangDoi/TaoHangDoi_TinhPhi_TuDong', fail: 'TC_HangDoi.TaoHangDoi_TinhPhi_TuDong' },
        list: function (f) {
            return { action: 'KTX_TinhPhi/LayDanhSach', method: 'GET', versionAPI: 'v1.0', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiThucHien_Id: '', strNghiepVuApDung_Id: f.nv, strThang: f.thang, strNam: f.nam };
        },
        baoCao: function (add, f) { add('strNam', f.nam); add('strThang', f.thang); add('strNghiepVuApDung_Id', f.nv); }
    });
})();
