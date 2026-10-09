/* =========================================================================
   Báo cáo giải thưởng — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/giaithuong.html + script/giaithuong.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_GiaiThuong/LayDanhSach  strVaiTro_Id '', strCanBoNhap_Id '', strNCKH_QuanLyDeTai_Id '', strnckh_detai_thanhvien_id '',
            iTrangThai 1, strTuKhoa, strLoaiHocVi_Id (NS.DMHV), strLoaiChucDanh_Id (NS.LOCD), strLoaiDoiTuong_Id '',
            strDonViCuaThanhVien_Id '', pageIndex, pageSize
   Gốc không nạp danh sách mẫu cho nút "Xuất excel" (nút thả xuống rỗng) — nay xuất danh sách, xem _chung.js.
   ========================================================================= */
(function () {
    'use strict';
    ums.nckhBc.man(document.getElementById('nckh-baocao-giaithuong'), {
        tieuDe: 'Báo cáo giải thưởng', dsTitle: 'Danh sách giải thưởng', icon: 'fa-trophy', tenTep: 'danh-sach-giai-thuong',
        loc: [
            { key: 'cd', label: 'Tất cả loại chức danh', dm: 'NS.LOCD' },
            { key: 'hv', label: 'Tất cả loại học vị', dm: 'NS.DMHV' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_GiaiThuong/LayDanhSach',
                strVaiTro_Id: '', strCanBoNhap_Id: '', strNCKH_QuanLyDeTai_Id: '', strnckh_detai_thanhvien_id: '',
                iTrangThai: 1, strTuKhoa: f.q, strLoaiHocVi_Id: f.hv, strLoaiChucDanh_Id: f.cd,
                strLoaiDoiTuong_Id: '', strDonViCuaThanhVien_Id: ''
            };
        },
        cot: [
            { title: 'Người nhận', prop: 'CANBONHAP_TENDAYDU' },
            { title: 'Hình thức', prop: 'HINHTHUC' },
            { title: 'Nội dung', prop: 'NOIDUNGGIAITHUONG', width: '35%' },
            { title: 'Năm nhận', prop: 'NAMTANGTHUONG', cls: 'is-center' },
            { title: 'Số người', prop: 'SONGUOITHAMGIAVAOCONGTRINH_N' }
        ]
    });
})();
