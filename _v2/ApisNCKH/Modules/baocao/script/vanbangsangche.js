/* =========================================================================
   Báo cáo văn bằng sáng chế — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/vanbangsangche.html + script/vanbangsangche.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_VanBangSangChe/LayDanhSach  strVaitro_Id '', strCanBo_Id '', strQuanLyDeTai_Id '', strThanhVienDangKy_Id (Nhân sự),
            iTrangThai 1, strTuKhoa, pageIndex, pageSize
   Ô "Tất cả khoa/viện/phòng ban": gốc nạp cơ cấu nhưng lời gọi KHÔNG có tham số đơn vị → giữ ô, khoá (tự chốt — không thêm
   tham số mà procedure chưa nhận). "Xuất excel": xem _chung.js (gốc gọi report_VBSC không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    ums.nckhBc.man(document.getElementById('nckh-baocao-vanbangsangche'), {
        tieuDe: 'Báo cáo văn bằng sáng chế', dsTitle: 'Danh sách văn bằng sáng chế', icon: 'fa-certificate', tenTep: 'danh-sach-van-bang-sang-che',
        loc: [
            { key: 'cctc', label: 'Tất cả khoa/viện/phòng ban', khoa: 'Danh sách văn bằng chưa lọc được theo đơn vị (máy chủ không nhận điều kiện này)' },
            { key: 'ns', label: 'Tất cả nhân sự', nhanSu: true }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_VanBangSangChe/LayDanhSach',
                strVaitro_Id: '', strCanBo_Id: '', strQuanLyDeTai_Id: '', strThanhVienDangKy_Id: f.ns, iTrangThai: 1, strTuKhoa: f.q
            };
        },
        cot: [
            { title: 'Tên văn bằng', prop: 'TENVANBANG' },
            { title: 'Nội dung', prop: 'NOIDUNGVANBANG', width: '30%' },
            { title: 'Năm nhận', prop: 'NAMCAPVANBANG' },
            { title: 'Người nhận', prop: 'NCKH_DETAI_THANHVIEN_TEN' },
            { title: 'Ghi chú', prop: 'THONGTINMINHCHUNG' }
        ]
    });
})();
