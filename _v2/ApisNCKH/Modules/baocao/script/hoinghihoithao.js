/* =========================================================================
   Báo cáo hội nghị / hội thảo — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/hoinghihoithao.html + script/hoinghihoithao.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_HoiNghiHoiThao/LayDanhSach  strVaitro_Id '', strQuanLyDeTai_Id '', strThuocLinhVucNao_Id (NCKH.LVNC),
            strPhamViHoiNghiHoiThao_Id (NCKH.PVHT), strTuKhoa, iTrangThai 1, strCanBoNhap_Id '', strThanhVienDangKy_Id (Nhân sự),
            strLoaiHocVi_Id '', strLoaiChucDanh_Id '', strDonViCuaThanhVien_Id, pageIndex, pageSize
   Khác gốc (tự chốt 2026-09-27):
     · Ô "Tất cả khoa/viện/phòng ban" gốc nạp mà không gửi, trong khi strDonViCuaThanhVien_Id có sẵn (gửi rỗng) → nay gửi ô đó
       (cùng cách màn Bài báo quốc tế dùng tham số này).
     · Ô "Tất cả thời gian" gốc không nạp gì (dateYearToCombo đổ vào ô dropHNHT_NamBaoCao không có trên màn) và không có tham số
       → giữ ô, khoá.
     · Cột "Ghi chú" gốc để trống (mDataProp "") → giữ cột trống. "Chuyên ngành" đọc THUOCLINHVUCNAO_MA như gốc.
     · Bỏ phần nạp NCKH.VTHT / NCKH.TCHT của gốc (chỉ đổ vào ô của biểu mẫu không có trên màn này).
     · "Xuất excel": xem _chung.js (gốc gọi report_HNHT không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    function trong() { return ''; }
    ums.nckhBc.man(document.getElementById('nckh-baocao-hoinghihoithao'), {
        tieuDe: 'Báo cáo hội nghị / hội thảo', dsTitle: 'Danh sách hội nghị/hội thảo', icon: 'fa-people-group', tenTep: 'danh-sach-hoi-nghi-hoi-thao',
        loc: [
            { key: 'tg', label: 'Tất cả thời gian', khoa: 'Bản gốc chưa có danh sách thời gian cho ô này' },
            { key: 'cctc', label: 'Tất cả khoa/viện/phòng ban', cctc: true },
            { key: 'ns', label: 'Tất cả nhân sự', nhanSu: true },
            { key: 'pv', label: 'Tất cả phạm vi', dm: 'NCKH.PVHT' },
            { key: 'lv', label: 'Tất cả lĩnh vực', dm: 'NCKH.LVNC' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_HoiNghiHoiThao/LayDanhSach',
                strVaitro_Id: '', strQuanLyDeTai_Id: '', strThuocLinhVucNao_Id: f.lv, strPhamViHoiNghiHoiThao_Id: f.pv,
                strTuKhoa: f.q, iTrangThai: 1, strCanBoNhap_Id: '', strThanhVienDangKy_Id: f.ns,
                strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strDonViCuaThanhVien_Id: f.cctc
            };
        },
        cot: [
            { title: 'Tên hội nghị/hội thảo', prop: 'TENHOINGHIHOITHAO', width: '28%' },
            { title: 'Thời gian tổ chức', prop: 'THOIGIANTOCHUC' },
            { title: 'Chuyên ngành', prop: 'THUOCLINHVUCNAO_MA' },
            { title: 'Số lượng tham gia', prop: 'SOTACGIA_N', cls: 'is-center' },
            { title: 'Cấp tổ chức', prop: 'PHAMVIHOINGHIHOITHAO_TEN' },
            { title: 'Đơn vị tổ chức', prop: 'DONVITOCHUC_TEN' },
            { title: 'Ghi chú', render: trong, xls: trong }
        ]
    });
})();
