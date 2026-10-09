/* =========================================================================
   Báo cáo hướng dẫn sinh viên — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/huongdansinhvien.html + script/huongdansinhvien.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_SP_HuongDan_GiangDay/LayDanhSach  strThanhVien_Id '', strTuKhoa, strPhanLoai_Id (ô "vai trò", NCKH.VTHDGD),
            strNguoiThucHien_Id (người đăng nhập), pageIndex, pageSize
   Gốc không nạp danh sách mẫu cho nút "Xuất excel" (nút thả xuống rỗng) — nay xuất danh sách, xem _chung.js.
   ========================================================================= */
(function () {
    'use strict';
    ums.nckhBc.man(document.getElementById('nckh-baocao-huongdansinhvien'), {
        tieuDe: 'Báo cáo hướng dẫn sinh viên', dsTitle: 'Danh sách hướng dẫn sinh viên', icon: 'fa-user-graduate', tenTep: 'danh-sach-huong-dan-sinh-vien',
        loc: [
            { key: 'vt', label: 'Tất cả vai trò', dm: 'NCKH.VTHDGD' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_SP_HuongDan_GiangDay/LayDanhSach',
                strThanhVien_Id: '', strTuKhoa: f.q, strPhanLoai_Id: f.vt,
                strNguoiThucHien_Id: (ums.session && ums.session.userId) || ''
            };
        },
        cot: [
            { title: 'Tên đề tài', prop: 'TENDETAI_GIANGDAY', width: '50%' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
            { title: 'Năm nghiệm thu', prop: 'NAMNGHIEMTHU', cls: 'is-center' }
        ]
    });
})();
