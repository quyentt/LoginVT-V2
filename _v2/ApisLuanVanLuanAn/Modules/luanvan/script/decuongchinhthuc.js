/* =========================================================================
   Đề cương chính thức (luanvan/decuongchinhthuc)
   Bản gốc: ApisLuanVanLuanAn/Modules/luanvan/html/decuongchinhthuc.html (271 dòng) + script/decuongchinhthuc.js (1.080 dòng)
   Giống dangkydecuong 92% — khác: không có nút Thêm mới / Import / Xoá (chỉ sửa), thêm Số quyết định + Ngày quyết định + tệp
   "File up quyết định hội đồng"; cột "Số quyết định". Khung: ums.lvla.man (_lv_chung.js).
   Lời gọi (chép nguyên):
       LVLA_DeCuong_ChinhThuc/LayDanhSach GET strTuKhoa · strQLSV_NguoiHoc_Id '' · strNguoiDangKy_Id '' · strLVLA_KeHoach_DeCuong_Id · pageIndex · pageSize
       LVLA_DeCuong_ChinhThuc/CapNhat POST strId · strLVLA_KeHoach_DeCuong_Id · strQLSV_NguoiHoc_Id · strNguoiDangKy_Id · strNgayDangKy
            · strTenTiengViet · strTenTiengAnh · strMoTa · strSoQuyetDinh · strNgayQuyetDinh · strLVLA_DeCuong_DangKy_Id (= LVLA_DECUONG_DANGKY_ID của dòng)
       Tệp: LVLA_Files, gắn vào ID đề cương chính thức (gốc saveFiles(txtFileDinhKem, strId, "LVLA_Files"))
       LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach GET strTuKhoa '' · strNguoiDung_Id '' · strLVLA_DeCuong_DangKy_Id '' · strQLSV_NguoiHoc_Id ''
            · strNguoiHuongDan_Id '' · strVaiTro_Id '' · strLVLA_KeHoach_DeCuong_Id · strLVLA_DeCuong_ChinhThuc_Id · pageIndex 1 · pageSize 100000
       LVLA_DeCuong_ChinhThuc_HuongDan/ThemMoi | CapNhat | Xoa — như dangkydecuong, khoá cha strLVLA_DeCuong_ChinhThuc_Id
   Cố ý bỏ: nút Xoá (bị chú thích trong html gốc), mã chết (xem _lv_chung.js).
   ========================================================================= */
(function () {
    'use strict';
    var L = ums.lvla, H = 'LVLA_DeCuong_ChinhThuc_HuongDan/';
    var root = document.getElementById('lvla-luanvan-decuongchinhthuc');
    if (!root) return;
    L.man(root, {
        title: 'Đề cương chính thức', listTitle: 'Danh sách', formTitle: 'Đề cương',
        P: 'LVLA_DeCuong_ChinhThuc/', canAdd: false, quyetDinh: true,
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
