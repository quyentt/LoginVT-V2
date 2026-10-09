/* =========================================================================
   Quá trình chức vụ — bản QUẢN TRỊ (cán bộ nhân sự chọn một người rồi xem/sửa)
   Bản gốc: ApisNhanSu/Modules/quatrinh/html/chucvu.html + script/chucvu.js
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 danh sách cán bộ + col-lg-9 nội dung):
     · cột trái: ums.nsCanBo (hoso/script/_canbo.js) — getList_NhanSu dLaCanBoNgoaiTruong 0,
       lọc Khoa/Viện/Phòng ban → Bộ môn, Tình trạng làm việc (NS.TTNS);
     · cột phải: DÙNG LẠI khung Cổng cán bộ ums.ccbQtChucVu (quatrinhchucvu.js) —
       bản gốc NS chép y hệt bản Cổng cán bộ, chỉ khác strNhanSu_HoSoCanBo_Id =
       người ĐANG CHỌN (me.strNhanSu_Id) thay vì người đăng nhập. Lời gọi:
       NS_QT_ChucVu/LayDanhSach · LayChiTiet · ThemMoi | CapNhat · Xoa,
       ThietLapQuaTrinhCuoiCung('NHANSU_QT_CHUVU') sau khi thêm, tệp NS_Files.
   Đầu trang: "Xuất báo cáo" theo mẫu phân quyền (getList_MauImport("zonebtnChucVu"))
   và "Import chức vụ" (btnImportWithProce name=IMPORTWITHPROC_CHUCVU title="Chức vụ"
   → showImportChungV2 → ums.report.importChung).

   Không chuyển: khung "Danh sách dự kiến sắp hết nhiệm kỳ"
   (NS_QT_ChucVu/LocDSNhanSu_QT_ChucVu_DenHan, dSoNgayQuyDinh 90) — bản gốc nạp lúc
   mở màn nhưng KHÔNG BAO GIỜ HIỆN: nút mở nó (#btnViewChucVu_DuBao) không có trên
   màn, còn toggle_notify / toggle_form ẩn mọi .zone-bus (khung đích zone_notify_…,
   zone_input_ChucVu không tồn tại). Handler .btnSetTrangThaiCuoi của bảng chức vụ
   cũng không có cột tương ứng — bỏ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var root = document.getElementById('nschucvu');

    var cb = ums.nsCanBo.man(root, {
        tieuDe: 'Quá trình chức vụ',
        actions: '<span data-z="baocao"></span>' +
            ui.btn('importer', { text: 'Import chức vụ', attr: { 'data-a': 'import' } }),
        onChon: function (row, host) {
            ums.ccbQtChucVu.mount(host, {
                embedded: true,
                listTitle: 'Quá trình chức vụ',
                nhanSuId: function () { return row.ID; }
            });
        }
    });

    ums.report.mount(root.querySelector('[data-z="baocao"]'), { import: false });
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="import"]')) ums.report.importChung('Chức vụ', 'IMPORTWITHPROC_CHUCVU', { onDone: function () { cb.tai(); } });
    });
})();
