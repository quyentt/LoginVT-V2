/* =========================================================================
   Hội đồng đạo đức — Nghiên cứu khoa học (dùng chung hai màn)
     · Quản lý sản phẩm  › Hội đồng đạo đức  (quanlysanpham/html/hoidongdaoduc.html)
     · Xác nhận kê khai  › Hội đồng đạo đức  (xacnhankekhai/html/hoidongdaoduc.html — nạp chéo tệp này)
   Bản gốc: ApisNCKH/Modules/{quanlysanpham,xacnhankekhai}/html/hoidongdaoduc.html + script/hoidongdaoduc.js
   (hai bản gốc GIỐNG HỆT — diff -w chỉ khác chú thích / dòng trống; Cổng cán bộ KHÔNG có màn này).
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 "Danh sách hội đồng đạo đức" · col-lg-9 Thông tin chung / Chi tiết / Kê khai)
   → khung chung kê khai sản phẩm KH của Cổng cán bộ: ums.nckh.man (sanphamkhoahoc/script/_sanpham.js), nam: false
   (màn gốc không có ô năm đánh giá).
   Lời gọi (kiểu cũ, chép nguyên tên tham số):
     NCKH_SP_HoiDongDaoDuc/LayDanhSach (GET)  strNCKH_DeTai_ThanhVien_Id '', strQuanLyDeTai_Id '', strCanBoNhap_Id,
         strTuKhoa, iTrangThai 1, pageIndex, pageSize
     NCKH_SP_HoiDongDaoDuc/ThemMoi | CapNhat (POST)  strId, dTyLeThamGia 0, iSoDaiBieuTrongNuoc, iSoDaiBieuQuocTe,
         strDonViToChuc_Id, strThuocLinhVucNao_Id, strQuanLyDeTai_Id '', strThanhVien_Id, strVaitro_Id, strNamBaoCao,
         strTen, iSoTacGia, strPhamVi_Id, strNamHoanThanh, strTenBaoCao, strFileMinhChung, strThongTinMinhChung,
         iThuTu 1, strCanBoNhap_Id = người đăng nhập, strMa, iTrangThai 1
     NCKH_SP_HoiDongDaoDuc/Xoa (POST)  strId, strNguoiThucHien_Id
   Cột trả về: ID, MASANPHAM, TONGSOHOIDONGDATHAMGIA, NAMTHAMGIA, TRANGTHAI, MOTA, CANBONHAP_TENDAYDU.

   Lỗi của bản gốc (mã .js chép từ màn "Hội nghị khoa học" rồi bỏ dở):
     · Biểu mẫu có 5 ô (Mã sản phẩm, Số hội đồng, Năm tham gia, Trạng thái, Mô tả) nhưng hàm lưu đọc các ô của màn
       hội nghị KHÔNG có trên html (txtHDDD_Ten, dropHDDD_PhamVi, dropHDDD_NamBaoCao…) → mọi tham số gửi RỖNG, 5 ô
       người dùng nhập KHÔNG được gửi đi. Tên tham số thật của 5 ô chưa rõ → giữ nguyên bộ tham số gốc, điền những
       chỗ khớp nghĩa: strMa ← Mã sản phẩm; strNamBaoCao + strNamHoanThanh ← Năm tham gia (gốc lấy cả hai từ cùng
       một ô năm). Số hội đồng / Trạng thái / Mô tả vẫn hiện (đọc từ cột trả về) nhưng CHƯA có tham số để lưu.
     · Ô lọc "Thành viên" / "Cán bộ nhập" chưa bao giờ có dữ liệu (đoạn nạp bị chú thích bỏ), lời gọi danh sách đọc
       ô không tồn tại (dropSearch_HDDD_LinhVuc) cho cả strCanBoNhap_Id lẫn strTuKhoa → bỏ hai ô lọc rỗng, ô từ khoá
       nay gửi strTuKhoa; strCanBoNhap_Id gửi rỗng như thực tế gốc.
     · Bảng thành viên: gốc vẽ một dòng GIẢ (id viết cứng, ảnh localhost:46945) vào bảng không có trên html → bỏ.
     · Chi tiết chỉ xem + ba nút Xoá / Sửa / Xem trên từng dòng (luật cột trái 12: mục không mang nút) → bấm mục mở
       biểu mẫu Sửa, nút Xoá trong biểu mẫu (như mọi màn kê khai sản phẩm đã chuyển).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.querySelector('[data-hdg="daoduc"]');
    if (!root || !ums.nckh) return;
    var N = ums.nckh, e = N.e;

    N.man(root, {
        tieuDe: 'Hội đồng đạo đức', dsTieuDe: 'Danh sách hội đồng đạo đức', icon: 'fa-scale-balanced',
        formTitle: 'hội đồng đạo đức', ctl: 'NCKH_SP_HoiDongDaoDuc', nam: false, xoaKhoa: 'strId',
        loiChao: 'Hôm nay bạn có muốn thêm mới không? Bấm Thêm mới ở đầu trang.',
        ten: function (r) { return e(r.MASANPHAM) || '(chưa có mã sản phẩm)'; },
        ds: function (q) {
            return { strNCKH_DeTai_ThanhVien_Id: '', strQuanLyDeTai_Id: '', strCanBoNhap_Id: '', strTuKhoa: q.q || '', iTrangThai: 1 };
        },
        fields: [
            { type: 'legend', label: 'Thông tin hội đồng khoa học' },
            { key: 'strMa', col: 'MASANPHAM', label: 'Mã sản phẩm' },
            { key: '_soHoiDong', col: 'TONGSOHOIDONGDATHAMGIA', label: 'Số hội đồng' },
            { key: 'strNamBaoCao', col: 'NAMTHAMGIA', label: 'Năm tham gia' },
            { key: '_trangThai', col: 'TRANGTHAI', label: 'Trạng thái' },
            { key: '_moTa', col: 'MOTA', label: 'Mô tả' }
        ],
        luu: function (v) {
            return {
                dTyLeThamGia: 0, iSoDaiBieuTrongNuoc: '', iSoDaiBieuQuocTe: '', strDonViToChuc_Id: '', strThuocLinhVucNao_Id: '',
                strQuanLyDeTai_Id: '', strThanhVien_Id: '', strVaitro_Id: '',
                strNamBaoCao: v.strNamBaoCao, strTen: '', iSoTacGia: '', strPhamVi_Id: '', strNamHoanThanh: v.strNamBaoCao,
                strTenBaoCao: '', strFileMinhChung: '', strThongTinMinhChung: '', iThuTu: 1,
                strCanBoNhap_Id: N.uid(), strMa: v.strMa, iTrangThai: 1
            };
        }
    });
})();
