/* nhapdiem/lichhoc — khung chung ums.tkbSV (thoikhoabieusinhvien/script/_lichhocsv.js).
   Chờ nghiệp vụ: mục menu này ở bản gốc KHÔNG chạy được (chỉ là trang con của In bảng điểm) — bản mới cho tra mã
   sinh viên như thoikhoabieusinhvien/lichhoc; danh sách lớp của buổi học gửi strNguoiThucHien_Id = CÁN BỘ (như bản
   nhapdiem gốc; bản thoikhoabieusinhvien gửi id sinh viên). Hỏi có giữ mục menu này không. */
(function () { ums.tkbSV.mount(document.getElementById('tkb-lichhoc-nd'), { timKiem: true, nguoiDsLop: 'canbo', reportText: 'Báo cáo' }); })();
