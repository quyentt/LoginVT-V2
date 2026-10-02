/* =========================================================================
   Báo cáo sách tham khảo / giáo trình — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/sach.html + script/sach.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_Sach/LayDanhSach  strTuKhoa, strLoaiChucDanh_Id (NS.LOCD), strLoaiHocVi_Id (NS.DMHV), strDonViCuaThanhVien_Id '',
            strVaiTro_Id, strnckh_detai_thanhvien_id '', strPhanLoaiSach_Id (NCKH.PHLS), strNCKH_QuanLyDeTai_Id '',
            strThuocLinhVucNao_Id (NCKH.LVNC), strCanBoNhap_Id '', iTrangThai 1, pageIndex, pageSize
   Khác gốc (tự chốt): ô "Tất cả vai trò" (NCKH.VTVS) có trên màn gốc nhưng strVaiTro_Id luôn gửi rỗng → nay gửi giá trị ô
   (tham số đã có sẵn, cùng tên). "Xuất excel": xem _chung.js (gốc gọi report_Sach không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    ums.nckhBc.man(document.getElementById('nckh-baocao-sach'), {
        tieuDe: 'Báo cáo sách tham khảo / giáo trình', dsTitle: 'Danh sách sách tham khảo/ giáo trình', icon: 'fa-book', tenTep: 'danh-sach-sach',
        loc: [
            { key: 'vt', label: 'Tất cả vai trò', dm: 'NCKH.VTVS' },
            { key: 'lv', label: 'Tất cả lĩnh vực', dm: 'NCKH.LVNC' },
            { key: 'pl', label: 'Tất cả phân loại', dm: 'NCKH.PHLS' },
            { key: 'hv', label: 'Tất cả loại học vị', dm: 'NS.DMHV' },
            { key: 'cd', label: 'Tất cả loại chức danh', dm: 'NS.LOCD' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_Sach/LayDanhSach',
                strTuKhoa: f.q, strLoaiChucDanh_Id: f.cd, strLoaiHocVi_Id: f.hv, strDonViCuaThanhVien_Id: '',
                strVaiTro_Id: f.vt, strnckh_detai_thanhvien_id: '', strPhanLoaiSach_Id: f.pl, strNCKH_QuanLyDeTai_Id: '',
                strThuocLinhVucNao_Id: f.lv, strCanBoNhap_Id: '', iTrangThai: 1
            };
        },
        cot: [
            { title: 'Loại sách', prop: 'PHANLOAISACH' },
            { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' },
            { title: 'Tên sách', prop: 'TENSACH', width: '35%' },
            { title: 'Năm xuất bản', prop: 'NAMXUATBAN' },
            { title: 'Số trang', prop: 'SOTRANGSACH_N' }
        ]
    });
})();
