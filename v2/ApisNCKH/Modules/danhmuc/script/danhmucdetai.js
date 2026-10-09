/* =========================================================================
   Danh mục đề tài (Nghiên cứu khoa học)
   Bản gốc: ApisNCKH/Modules/danhmuc/html/danhmucdetai.html + script/danhmucdetai.js
   ---------------------------------------------------------------------------
   Bố cục gốc (HAI cột col-lg-3 | col-lg-9): trái ô từ khoá + "Đề tài/dự án" (tổng; mỗi mục Tên / Mã / Phân loại +
   thùng rác); phải "Thông tin chung" đổi chỗ cho "Kê khai danh mục đề tài": Thông tin đề tài (Mã chỉ đọc, Tên, Tên
   tiếng Anh, Phân loại, Mô tả) → Thành viên trong trường → Thành viên ngoài trường → Nội dung minh chứng (tệp).
   Cùng khuôn các màn kê khai sản phẩm khoa học của Cổng cán bộ → dùng lại khung ums.nckh.man + khối ums.nckh.thanhVien /
   ums.nckh.tepRieng (ApisCongCanBo/Modules/sanphamkhoahoc/script/_sanpham.js, nạp chéo — KHÔNG sửa tệp đó).
   Lời gọi (chép nguyên):
     NCKH_DanhMucDeTai/LayDanhSach  GET  strTuKhoa, strPhanLoaiDeTai_Id '', strNguoiThucHien_Id = người đăng nhập, phân trang
     NCKH_DanhMucDeTai/ThemMoi | CapNhat  POST  strId, strMaDeTai '' (mã do máy chủ cấp), strTenDeTai, strTenDeTaiTiengAnh,
                                      strPhanLoaiDeTai_Id, strMoTa
     NCKH_DanhMucDeTai/Xoa  POST  strIds
     NCKH_ThanhVien/LayDanhSach (strSanPham_Id, pageSize 100) · ThemMoi (mọi dòng mỗi lần lưu, như gốc) · Xoa (dòng đã lưu)
       — LATHANHVIENCUATRUONG = 1 vào bảng NGOÀI trường, như gốc. Vai trò: danh mục NCKH.VTDT. Phân loại: NCKH.PLDT.
     Tệp minh chứng: NCKH_Files gắn ID đề tài.
   Khác gốc (tự chốt):
     · Thùng rác trên từng mục cột trái → nút "Xoá" trên đầu biểu mẫu (BO-CUC luật 12; như các màn sản phẩm Cổng cán bộ).
     · Nút "Nhập tiếp" gốc gắn theo id #btnReWrite mà nút trên màn chỉ có lớp .btnReWrite → chưa từng chạy → bỏ.
     · CapMa_NCKH_SP_DanhMucDeTai (nút .btnCapMaDeTai không có trên màn), ô tình trạng NCKH.TTDT (vùng vẽ không có), hộp
       "Tìm đề tài" / ô thành viên đăng ký (NS_HoSoV2/LayDanhSach vào ô không tồn tại) — mã chết của gốc → bỏ.
     · Thêm mới xong gốc hỏi "tiếp tục thêm?" rồi giữ biểu mẫu KHÔNG kèm id (bấm Lưu lần nữa là thêm trùng) → về danh sách.
     · Không tự thêm người đăng nhập làm thành viên (gốc danh mục đề tài không làm) — tuThem: false.
     · Lưu thành viên gửi thêm strNCKH_TinhDiem_KeHoach_Id '' và strChucNang_Id (khối dùng chung của sản phẩm Cổng cán bộ).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nckh-danhmucdetai');
    if (!root || !ums.nckh || !ums.nckh.man) return;
    var N = ums.nckh, e = N.e, esc = ums.ui.esc;

    var crud = N.man(root, {
        tieuDe: 'Danh mục đề tài', dsTieuDe: 'Đề tài/dự án', icon: 'fa-flask', formTitle: 'danh mục đề tài', ctl: 'NCKH_DanhMucDeTai',
        nam: false,
        ten: function (r) { return e(r.TENDETAI); },
        ds: function (f) { return { strTuKhoa: f.q, strPhanLoaiDeTai_Id: '', strNguoiThucHien_Id: N.uid() }; },
        fields: [
            { type: 'legend', label: 'Thông tin đề tài' },
            { key: '_ma', col: 'MADETAI', label: 'Mã đề tài', type: 'static' },
            { key: 'strPhanLoaiDeTai_Id', col: 'PHANLOAIDETAI_ID', label: 'Phân loại đề tài', type: 'select', required: true,
                source: { dm: 'NCKH.PLDT' }, placeholder: 'Chọn phân loại đề tài' },
            { key: 'strTenDeTai', col: 'TENDETAI', label: 'Tên đề tài', required: true, caDong: true, span: true },
            { key: 'strTenDeTaiTiengAnh', col: 'TENDETAITIENGANH', label: 'Tên đề tài tiếng anh', caDong: true, span: true },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        khoi: [
            N.thanhVien({ vaiTro: 'NCKH.VTDT', ngoai: true, tuThem: false }),
            N.tepRieng({ tieuDe: 'Nội dung minh chứng', hauTo: '' })
        ],
        luu: function (v) {
            return { strMaDeTai: '', strTenDeTai: v.strTenDeTai, strTenDeTaiTiengAnh: v.strTenDeTaiTiengAnh,
                strPhanLoaiDeTai_Id: v.strPhanLoaiDeTai_Id, strMoTa: v.strMoTa, strNguoiThucHien_Id: N.uid() };
        }
    });
    /* Mục cột trái như gốc: Tên / Mã / Phân loại (khung chung chỉ vẽ một dòng tên) */
    if (crud && crud.cfg && crud.cfg.master) {
        crud.cfg.master.item = function (r) {
            return '<div class="nk-ten">' + esc(e(r.TENDETAI)) + '</div>' +
                '<span class="ums-master__item__sub">Mã đề tài: ' + esc(e(r.MADETAI)) + '</span>' +
                '<span class="ums-master__item__sub">Phân loại: ' + esc(e(r.PHANLOAIDETAI_TEN)) + '</span>';
        };
    }
})();
