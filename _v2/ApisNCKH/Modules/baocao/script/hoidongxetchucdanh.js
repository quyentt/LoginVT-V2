/* =========================================================================
   Báo cáo hội đồng xét chức danh — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/hoidongxetchucdanh.html + script/hoidongxetchucdanh.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       NCKH_HoiDongXetChucDanh/LayDanhSach  strChucDanhDeXuat_Id '', strDoiTuongDeXuat_Id '',
            strKetQuaHoiDongCoSo_Id (radio NCKH.HDCS), strKetQuaHoiDongNghanh_Id (radio NCKH.HDNG),
            strKetQuaHoiDongNhaNuoc_Id (radio NCKH.HDNN), strNguoiThucHien_Id '', strTuKhoa, pageIndex, pageSize
   Khác gốc (tự chốt 2026-09-27):
     · Ba nhóm radio thêm mục "Tất cả" chọn sẵn — gốc chọn một lần là không bỏ lọc được nữa.
     · Bỏ nhóm radio chức danh (QLCB.CHDA) của gốc: đổ vào vùng rdHDXCD_ChucDanh không có trên màn, không gửi.
     · Cột giữ như gốc: "Họ tên ứng viên" đọc DOITUONGDEXUAT_TEN (trùng cột "Đối tượng"), "Đơn vị" và "Ghi chú" để trống
       (mDataProp "") — không đoán tên cột.
     · "Xuất excel": xem _chung.js (gốc gọi report_HDXCD không tồn tại).
   ========================================================================= */
(function () {
    'use strict';
    function trong() { return ''; }
    ums.nckhBc.man(document.getElementById('nckh-baocao-hoidongxetchucdanh'), {
        tieuDe: 'Báo cáo hội đồng xét chức danh', dsTitle: 'Danh sách hội đồng xét chức danh', icon: 'fa-user-tie', tenTep: 'danh-sach-hoi-dong-xet-chuc-danh',
        loc: [
            { key: 'cs', type: 'radio', label: 'Thông qua hội đồng cơ sở', dm: 'NCKH.HDCS' },
            { key: 'ng', type: 'radio', label: 'Thông qua hội đồng ngành', dm: 'NCKH.HDNG' },
            { key: 'nn', type: 'radio', label: 'Thông qua hội đồng nhà nước', dm: 'NCKH.HDNN' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_HoiDongXetChucDanh/LayDanhSach',
                strChucDanhDeXuat_Id: '', strDoiTuongDeXuat_Id: '',
                strKetQuaHoiDongCoSo_Id: f.cs, strKetQuaHoiDongNghanh_Id: f.ng, strKetQuaHoiDongNhaNuoc_Id: f.nn,
                strNguoiThucHien_Id: '', strTuKhoa: f.q
            };
        },
        cot: [
            { title: 'Họ tên ứng viên', prop: 'DOITUONGDEXUAT_TEN' },
            { title: 'Đơn vị', render: trong, xls: trong },
            { title: 'Chuyên ngành', prop: 'CHUYENNGANH_TEN' },
            { title: 'Đối tượng', prop: 'DOITUONGDEXUAT_TEN' },
            { title: 'Đề nghị xét chức danh', prop: 'CHUCDANHDEXUAT_TEN' },
            { title: 'Thông qua HĐ cơ sở', prop: 'KETQUAHOIDONGCOSO_TEN' },
            { title: 'Thông qua HĐ ngành', prop: 'KETQUAHOIDONGNGANH_TEN' },
            { title: 'Thông qua HĐ nhà nước', prop: 'KETQUAHOIDONGNHANUOC_TEN' },
            { title: 'Ghi chú', render: trong, xls: trong }
        ]
    });
})();
