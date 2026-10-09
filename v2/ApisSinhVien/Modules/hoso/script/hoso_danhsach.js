/* =========================================================================
   Danh sách hồ sơ sinh viên
   Bản gốc: ApisSinhVien/Modules/hoso/html/hoso_danhsach.html + script/hosodanhsach.js
            (+ dexuathoso.js + zoneEditModal_inject.js — biểu mẫu "Chỉnh sửa - Hồ sơ đề xuất", ums.hsA.editor)
   ---------------------------------------------------------------------------
   Bố cục gốc HAI cột: trái (col-sm-3) ô từ khoá + "Tìm kiếm nâng cao" Hệ · Khoá · CT · Lớp + nút Tìm kiếm +
   danh sách sinh viên (ảnh · họ tên · mã số · ngày sinh, phân trang máy chủ); phải (col-sm-9) biểu mẫu 3 tab
   dựng thẳng trong trang (#zeInlineHost). Bấm một sinh viên → openEditByPerson.
   Lời gọi: SV_HoSo/LayDanhSach GET (strTuKhoa, strHeDaoTao_Id, strKhoaDaoTao_Id, strChuongTrinh_Id,
            strLopQuanLy_Id, strNguoiThucHien_Id '', pageIndex, pageSize) · danh mục đào tạo edu.system.getList_*
            (KHÔNG lọc quyền) → ums.ref.cascade. Lời gọi của biểu mẫu: đầu tệp _hsA.js.
   Cố ý bỏ (mã chết — gốc return ngay sau openEditByPerson, form cũ ẩn cứng display:none !important):
     SV_HoSo/Capnhat, SV_HoSo/LayChiTiet, SV_HoSo/Xoa, SV_ThanhPhanGiaDinh/*, SV_QuyetDinh_ThucThi/LayDanhSach,
     các danh mục NS.GITI / NS.TPXT / SV.DOITUONGUUTIEN / QLSV.TRANGTHAI / QLSV.TNH / NS.QHGD của form cũ.
   Khác gốc: Hệ → Khoá → CT → Lớp khoá tầng dưới khi chưa chọn tầng trên (luật cha → con); chọn Hệ / Khoá / CT
   tự tải lại danh sách như gốc. Chưa chọn sinh viên thì cột phải là lời dẫn, không phải biểu mẫu trống.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('sv-hoso-danhsach');
    if (!root) return;
    ums.hsA.manHaiCot({ el: root, title: 'Danh sách hồ sơ', loc: true, call: ums.hsA.callHoSo });
})();
