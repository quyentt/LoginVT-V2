/* =========================================================================
   Báo cáo bài báo tạp chí quốc tế — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/tapchiquocte.html + script/tapchiquocte.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_TapChiQuocTe/LayDanhSach  strVaitro_Id '', strQuanLyDeTai_Id '', strThuocLinhVucNao_Id (Lĩnh vực),
            strPhanLoaiTapChi_Id (Phân loại), strTuKhoa, iTrangThai 1, strCanBoNhap_Id '', strThanhVienDangKy_Id (Nhân sự),
            strLoaiHocVi_Id '', strLoaiChucDanh_Id '', strDonViCuaThanhVien_Id (Cơ cấu), strDMTapChiQuocTe_Id (Tên danh mục tạp chí),
            pageIndex, pageSize
       NCKH_DMTapChiQuocTe/LayDanhSach  GET  strTuKhoa '', strTenTapChiDang_Id '', strLoaiTapChi_Id '', strCoQuanXuatBan_Id '',
            strNguoiThucHien_Id '', pageIndex 1, pageSize 1000000 → ô "Tên danh mục tạp chí" (TENTAPCHIDANG_TEN)
       Danh mục: NCKH.TCQT (Phân loại), NCKH.LVNC (Lĩnh vực); nhân sự / cơ cấu: getList_NhanSu / getList_CoCauToChuc.
   Lỗi gốc đã sửa (làm theo ý định):
     · strTuKhoa gốc đọc giá trị của NÚT / ô không tồn tại → luôn rỗng; nay đọc ô từ khoá.
     · Nút Tìm kiếm / Enter gắn sai id (quốc tế: bấm vào Ô từ khoá mới tải; quốc gia: nút Tìm kiếm không có xử lý) → nay gõ là tự tìm.
     · Ô Nhân sự hiện HODEM (chỉ họ đệm) → hiện họ tên.
     · "Xuất excel": xem _chung.js (gốc gọi hàm report_TCQT không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    var B = ums.nckhBc;
    B.man(document.getElementById('nckh-baocao-tapchiquocte'), {
        tieuDe: 'Báo cáo bài báo tạp chí quốc tế', dsTitle: 'Danh sách tạp chí quốc tế', icon: 'fa-newspaper', tenTep: 'danh-sach-tap-chi-quocte',
        loc: [
            { key: 'cctc', label: 'Cơ cấu khoa/viện/phòng ban', cctc: true },
            { key: 'ns', label: 'Nhân sự', nhanSu: true },
            { key: 'dmtc', label: 'Tên danh mục tạp chí', name: 'TENTAPCHIDANG_TEN',
                call: { action: 'NCKH_DMTapChiQuocTe/LayDanhSach', method: 'GET', strTuKhoa: '', strTenTapChiDang_Id: '', strLoaiTapChi_Id: '',
                    strCoQuanXuatBan_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } },
            { key: 'pl', label: 'Phân loại', dm: 'NCKH.TCQT' },
            { key: 'lv', label: 'Lĩnh vực', dm: 'NCKH.LVNC' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_TapChiQuocTe/LayDanhSach',
                strVaitro_Id: '', strQuanLyDeTai_Id: '', strThuocLinhVucNao_Id: f.lv, strPhanLoaiTapChi_Id: f.pl,
                strTuKhoa: f.q, iTrangThai: 1, strCanBoNhap_Id: '', strThanhVienDangKy_Id: f.ns,
                strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strDonViCuaThanhVien_Id: f.cctc, strDMTapChiQuocTe_Id: f.dmtc
            };
        },
        cot: [
            { title: 'Số xuất bản', prop: 'SOTAPCHI', cls: 'is-center' },
            { title: 'Thời gian xuất bản', prop: 'NAMCONGBO' },
            { title: 'Tên bài báo', prop: 'TENBAIBAO', width: '28%' },
            { title: 'Tác giả chính', prop: 'NCKH_DETAI_THANHVIEN_TEN' },
            { title: 'Số lượng tác giả', prop: 'SOTACGIA_N' },
            { title: 'Chuyên ngành', prop: 'THUOCLINHVUCNAO' },
            { title: 'Ghi chú', prop: 'THONGTINMINHCHUNG' }
        ]
    });
})();
