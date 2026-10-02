/* =========================================================================
   Báo cáo đề tài / dự án — Nghiên cứu khoa học
   Bản gốc: ApisNCKH/Modules/baocao/html/detai.html + script/detai.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên — 22 tham số):
       NCKH_DeTai/LayDanhSach  iTinhTrang -1, iTrangThai -1, strCanBoNhapDeTai_Id '', strThanhVien_Id '', strTuKhoaText,
            dTuKhoaNumber -1, strNCKH_DeCuong_Id '', strCapQuanLy_Id '', strLinhVucNghienCuu_Id '', strNguonKinhPhi_Id '',
            strThietKeNghienCuu_Id '', strNCKH_ThanhVien_Id, strDonVi_Id_CuaThanhVien_Id, strDaoTao_CoCauToChuc_Id '',
            strLoaiChucDanh_Id '', strLoaiHocVi_Id '', strTinhTrang_Id '', strPhanLoaiDeTai_Id, strTinhTrangXacNhan_Id '',
            strNhanSu_TDKT_KeHoach_Id '', pageIndex, pageSize
   Bảng gốc ẩn tiêu đề, một cột TENDETAITIENGVIET; khung trái thứ hai chỉ hiện "Tổng" → số dòng cạnh tiêu đề danh sách.
   Gốc làm dở (làm theo ý định, tự chốt 2026-09-27):
     · Nút Tìm kiếm / Enter KHÔNG gắn xử lý; từ khoá và Đơn vị đọc ô của HỘP khác (txtSearchModal_…, dropSearchModal_…) không có
       trên màn → luôn rỗng. Nay: từ khoá → strTuKhoaText, "khoa/viện/phòng ban" → strDonVi_Id_CuaThanhVien_Id,
       "loại đề tài" (NCKH.PLDT, gốc nạp mà không gửi) → strPhanLoaiDeTai_Id.
     · strNCKH_ThanhVien_Id gốc gửi CỨNG người đăng nhập (báo cáo chỉ ra đề tài của chính mình). Giữ mặc định đó khi ô
       "Nhân sự" để trống; chọn nhân sự thì gửi nhân sự đã chọn.
     · Ô "Chọn thời gian" (gốc không nạp gì, không gửi) → giữ, khoá. Nhóm radio "Tình trạng" gốc không nạp → bỏ (vùng trống).
     · "Xuất excel": xem _chung.js.
   ========================================================================= */
(function () {
    'use strict';
    ums.nckhBc.man(document.getElementById('nckh-baocao-detai'), {
        tieuDe: 'Báo cáo đề tài / dự án', dsTitle: 'Danh sách đề tài/dự án', icon: 'fa-flask', tenTep: 'danh-sach-de-tai',
        loc: [
            { key: 'tg', label: 'Chọn thời gian', khoa: 'Bản gốc chưa có danh sách thời gian cho ô này' },
            { key: 'cctc', label: 'Chọn khoa/viện/phòng ban', cctc: true },
            { key: 'ns', label: 'Chọn nhân sự', nhanSu: true },
            { key: 'loai', label: 'Tất cả phân loại', dm: 'NCKH.PLDT' }
        ],
        goi: function (f) {
            return {
                action: 'NCKH_DeTai/LayDanhSach',
                iTinhTrang: -1, iTrangThai: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: '', strTuKhoaText: f.q,
                dTuKhoaNumber: -1, strNCKH_DeCuong_Id: '', strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: '', strNguonKinhPhi_Id: '',
                strThietKeNghienCuu_Id: '', strNCKH_ThanhVien_Id: f.ns || (ums.session && ums.session.userId) || '',
                strDonVi_Id_CuaThanhVien_Id: f.cctc, strDaoTao_CoCauToChuc_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '',
                strTinhTrang_Id: '', strPhanLoaiDeTai_Id: f.loai, strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: ''
            };
        },
        cot: [
            { title: 'Tên đề tài/dự án', prop: 'TENDETAITIENGVIET' }
        ]
    });
})();
