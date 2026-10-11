/* =========================================================================
   Đề cương chính thức (luanan/decuongchinhthuc)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanan/html/decuongchinhthuc.html + script/decuongchinhthuc.js
   Giống luanvan/decuongchinhthuc 100% về action / tham số / cột; chỉ KHÔNG có ô "File up quyết định hội đồng" (gốc luanan không có
   txtFileDinhKem / LVLA_Files). Bố cục một cột, chỉ sửa (không Thêm mới / Import / Xoá): thanh lọc (Kế hoạch · từ khoá) → "Danh sách"
   → biểu mẫu (Thông tin học viên + Số / Ngày quyết định | Thông tin đề cương | Danh sách hướng dẫn). Khung: ums.lvla.man.
   Lời gọi (chép nguyên): như luanvan/decuongchinhthuc —
       LVLA_DeCuong_ChinhThuc/LayDanhSach · CapNhat (strSoQuyetDinh · strNgayQuyetDinh · strLVLA_DeCuong_DangKy_Id = LVLA_DECUONG_DANGKY_ID của dòng)
       LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach · ThemMoi | CapNhat · Xoa (khoá cha strLVLA_DeCuong_ChinhThuc_Id); vai trò: LVLA.VTHD
       Kế hoạch: LVLA_KeHoach_DeCuong/LayDanhSach (gốc luanan dùng bộ kế hoạch ĐỀ CƯƠNG ở màn này)
   Cố ý bỏ: nút Xoá (bị chú thích trong html gốc), mã chết (xem _lv_chung.js).
   ========================================================================= */
(function () {
    'use strict';
    var L = ums.lvla, H = 'LVLA_DeCuong_ChinhThuc_HuongDan/';
    var root = document.getElementById('lvla-luanan-decuongchinhthuc');
    if (!root) return;
    L.man(root, {
        title: 'Đề cương chính thức', listTitle: 'Danh sách', formTitle: 'Đề cương',
        P: 'LVLA_DeCuong_ChinhThuc/', canAdd: false, quyetDinh: true, tep: false,
        nguoi: [{
            title: 'Danh sách hướng dẫn', icon: 'fa-chalkboard-user', vaiTro: 'LVLA.VTHD', xoa: H + 'Xoa',
            list: function (row) {
                return { action: H + 'LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiDung_Id: '', strLVLA_DeCuong_DangKy_Id: '',
                    strQLSV_NguoiHoc_Id: '', strNguoiHuongDan_Id: '', strVaiTro_Id: '', strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID),
                    strLVLA_DeCuong_ChinhThuc_Id: row.ID, pageIndex: 1, pageSize: 100000 };
            },
            map: function (r) { return { ID: r.ID, pid: r.NGUOIHUONGDAN_ID, ten: r.NGUOIHUONGDAN_HOTEN, coQuan: r.NGUOIHUONGDAN_COQUANCONGTAC, vt: r.VAITRO_ID, vtTen: r.VAITRO_TEN }; },
            save: function (rec, cha, row) {
                return { action: H + (rec.ID ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec.ID, strLVLA_DeCuong_ChinhThuc_Id: cha,
                    strVaiTro_Id: rec.vt, strNguoiHuongDan_Id: rec.pid, strLVLA_KeHoach_DeCuong_Id: L.e(row.LVLA_KEHOACH_DECUONG_ID),
                    strQLSV_NguoiHoc_Id: L.e(row.QLSV_NGUOIHOC_ID), strMoTa: L.e(row.MOTA) };
            }
        }]
    });
})();
