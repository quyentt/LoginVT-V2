/* =========================================================================
   Cập nhật hồ sơ — bản QUẢN TRỊ (cán bộ nhân sự chọn một người rồi sửa lý lịch)
   Bản gốc: ApisNhanSu/Modules/hoso/script/capnhatv2.js + html/capnhatv2.html
   ---------------------------------------------------------------------------
   Hai cột như gốc: cột trái ums.nsCanBo (getList_NhanSu dLaCanBoNgoaiTruong 0, lọc
   Khoa/Viện/Phòng ban → Bộ môn, Tình trạng làm việc); cột phải DÙNG LẠI khung Cổng
   cán bộ ums.ccbHoSo (capnhathoso.js) với cờ quanTri — bản gốc NS là cùng biểu mẫu
   "1) Thông tin lý lịch" nhưng:
     · strId / KeThua / In mẫu 2C theo người ĐANG CHỌN (me.strNhanSu_Id);
     · sửa được Mã số, Họ đệm, Tên, Ngày/Tháng/Năm sinh, Chức danh nghề nghiệp;
       Tình trạng / Loại đối tượng / Loại giảng viên là ô chọn (NS.TTNS, NS.LTNS,
       NS.LGV0) — gửi giá trị thật thay "#";
     · một tab (không có Túi hồ sơ) → không vẽ dải tab.
   Lời gọi: NS_HoSoV2/LayChiTiet (GET strId) · NS_HoSoV2/CapNhat · NS_HoSoV2/KeThua ·
   edu.system.report("2C_2008") — tham số chép nguyên, xem chú thích đầu capnhathoso.js.

   Giữ như gốc:
     · strAnh = getImage('uploadPicture_HS', edu.system.userId): ảnh chép sang tên
       theo id người ĐĂNG NHẬP, không phải người đang sửa (anh.finalize(uid())).
     · Đơn vị (dropNS_CoCauToChuc readonly) khoá, giá trị vẫn gửi.
   Bỏ: #zone_action (gốc đổi nút "Cập nhật" vào vùng không tồn tại — không có tác
   dụng); đổi ảnh đầu trang khi người sửa = người đăng nhập (vỏ mới không có ảnh đó).
   ========================================================================= */
(function () {
    'use strict';

    ums.nsCanBo.man(document.getElementById('nscapnhatv2'), {
        tieuDe: 'Cập nhật hồ sơ',
        onChon: function (row, host) {
            ums.ccbHoSo.mount(host, {
                tieuDe: false,
                quanTri: true,
                nhanSuId: function () { return row.ID; }
            });
        }
    });
})();
