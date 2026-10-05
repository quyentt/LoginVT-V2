/* =========================================================================
   Giám sát thi (Quản lý thi trắc nghiệm) — danh sách phòng thi + chi tiết phòng THAY CHỖ danh sách (một cột như gốc)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlythi/html/giamsatthi.html + script/giamsatthi.js
   Khung: ums.coiThi.manPhong + ums.coiThi.gst.chiTiet (ApisCongCanBo/Modules/coithi/script/_phongthi.js, coithi.js —
   bản Cổng cán bộ "Coi thi" là bản mới hơn của chính màn này; mọi khác biệt truyền bằng tuỳ chọn, xem đầu coithi.js).
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func, không iM — chép nguyên):
     Đơn vị      QLTTN_ThongTin/LayDS_DonViByUserId_GST GET strUserId
     Đợt thi     QLTTN_QuanLyThi/LayDS_DotThi GET strStatus '1'
     Phòng thi   QLTTN_QuanLyThi/LayDS_ThongTinPhongThi_GST GET versionAPI v1.0, strDonVi_Id, strDotThi_Id, strTrangThaiPhongThi,
                 strStatus (ô "Tình trạng phòng(Ẩn/Hiện)"), strTuNgay, strDenNgay, strTuKhoa, strNguoiDung_Id, PageNumber, ItemPerPage
                 — cột ROOMNAME, COURSENAME, EXAMDATE, TENDOTTHI, OPENSTATUS, STATUS, SOLUONGTHISINH, TENDONVI, MATKHAUCHOPHONGTHI.
     Tác vụ      QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi GET versionAPI, strExamRoomInfoId (MỘT phòng mỗi lời gọi, như gốc lặp
                 từng ô đã đánh dấu), strThaoTacPhongThi MOPHONGTHI / DONGPHONGTHI / ANPHONGTHI / HIENPHONGTHI, strNguoiThucHien_Id.
     Chi tiết    LayDS_ChiTietPhongThi_KetQua (strCoTinhLaiDiem luôn '1', PHÂN TRANG máy chủ), LayDS_ExamRoomInfoDetail,
                 LayDS_ExamStructPart, LayDS_ThiSinh_TinhHuongThi, XulyTinhHuongThi, Save_ViPhamQuyCheThi, KhoiTaoLaiDeChoThiSinh,
                 TTN_ThiSinh/gen_KetQuaThi (chi tiết bài thi) — xem coithi.js.
   Khác gốc / lỗi gốc đã sửa:
     · Ô "Vi phạm quy chế" (drpViPhamQuyChe) gốc KHÔNG nơi nào nạp → luôn chỉ có "---", lưu vi phạm với id rỗng. Nay nạp
       QLTTN_QuanLyTHI/LayDS_ViPhamQuyChe như bản Cổng cán bộ (theo ý định).
     · Nút "Công nhận điểm" và ô "Chọn loại báo cáo" + "Tải file" ở gốc KHÔNG có xử lý (không hàm nào gắn). "Công nhận điểm"
       giữ nút, đặt disabled (quy ước: nút gốc có mà không xử lý thì khoá). "Tải file" là việc ĐỌC → chạy theo ý định của hai màn
       tự luận cùng phân hệ (SYS_Report/ThemMoi, BAOCAODIEM, URL báo cáo của hệ thống).
     · Tác vụ gốc gọi từng phòng rồi hẹn 2 giây nạp lại kể cả khi bấm Huỷ → nay gọi tuần tự, xong mới nạp lại.
     · LayDS_MatKhauPhanThi: gốc gọi (đồng bộ) rồi vẽ vào #zoneMatKhauDeThi KHÔNG có trong html → bỏ lời gọi.
     · Dòng chân bảng "Tổng số / Số Đạt / Số Không Đạt" của gốc luôn 0 → bỏ. Khung "Chi tiết phòng thi" (#zonePhongThi, biểu mẫu
       sửa phòng) có trong html nhưng không hàm nào mở / lưu → không chuyển.
     · Hộp "Xử lý tình huống thi" của gốc là vùng thay chỗ; ở đây là hộp thoại (thao tác hàng loạt trên dòng đã đánh dấu — BO-CUC
       luật 1) như bản Cổng cán bộ. Gốc hỏi lại TRƯỚC khi kiểm số phút → nay kiểm trước.
     · Nút "Đóng" của gốc có ba cái → một nút ở đầu trang (luật một nút Đóng). Mở màn không tự nạp danh sách — chờ Tìm kiếm (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var P = ums.coiThi, G = P.gst;
    var g = P.g, QL = P.QL, V = P.V;
    var root = document.getElementById('qlttn-giamsatthi');
    if (!root) return;

    G.nap({ cauHinh: false });   // gốc QLTTN không đọc cấu hình COITHI.*
    P.manPhong(root, {
        tieuDe: 'Giám sát thi',
        donVi: 'QLTTN_ThongTin/LayDS_DonViByUserId_GST',
        action: QL + 'LayDS_ThongTinPhongThi_GST',
        locTrangThai: true, locStatus: true,
        tacVu: [['MOPHONGTHI', 'Mở phòng thi', 'mở'], ['DONGPHONGTHI', 'Đóng phòng thi', 'đóng'],
            ['ANPHONGTHI', 'Ẩn phòng thi', 'ẩn'], ['HIENPHONGTHI', 'Hiển thị phòng thi', 'hiển thị']],
        thaoTac: function (ids, tv) {
            return ids.reduce(function (p, id) {
                return p.then(function () {
                    return g(QL + 'ThaoTacPhongThi_PhongThi', { versionAPI: V, strExamRoomInfoId: id, strThaoTacPhongThi: tv, strNguoiThucHien_Id: P.uid() });
                });
            }, Promise.resolve());
        },
        cot: { gioThi: false, anHien: true },
        chiTiet: function (room, host) {
            return G.chiTiet(room, host, {
                phanTrang: true, luonTinhLai: true, tongThoiGian: false, anhThiSinh: true, matKhau: false,
                baoCao: 'chon', congNhan: false, ketQuaThi: true, xemKetQua: false, gianLan: false,
                doiMay: false, viPhamLuonKetThuc: true, chuXuLy: 'Xử lý TS'
            });
        }
    });
})();
