/* =========================================================================
   Dữ liệu dựng thử — chỉ dùng khi api.dataSource = "demo"
   =========================================================================
   Giữ ĐÚNG hình dạng mà máy chủ trả về (tên trường viết HOA) để phần chuẩn
   hoá và phần vẽ chạy y hệt hai chế độ. Nhờ vậy chuyển sang API thật không
   phát sinh khác biệt bất ngờ.

       vai trò   ← PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung
       chức năng ← PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung  (trả { rs: [] })

   Nhóm và biểu tượng của vai trò KHÔNG khai ở đây — để `roleRules` trong
   site.config.js tự suy ra từ tên, giống hệt cách hệ hiện hành làm.
   ========================================================================= */
(function (global) {
    'use strict';

    var ums = global.ums || (global.ums = {});

    function role(id, ten, ma, thuVai) {
        return { ID: id, TENVAITRO: ten, MAUNGDUNG: ma, CHOPHEPTHUVAI: thuVai ? '1' : '0' };
    }

    ums.demo = {

        roles: [
            role('R01', 'App Sinh viên', 'APPSV'),
            role('R02', 'Cổng cán bộ', 'CONGCB'),
            role('R03', 'Cổng cán bộ(admin)', 'CONGCBAD'),
            role('R04', 'Cổng sinh viên - thủ vai', 'CONGSV', true),
            role('R05', 'Cổng thông tin khảo sát', 'CONGKS'),
            role('R06', 'Dashboard', 'DASH'),

            role('R07', 'Chuyên cần', 'CC'),
            role('R08', 'Chốt số lượng lớp đặc thù', 'CSLDT'),
            role('R09', 'Học lại Thi Lại', 'HLTL'),
            role('R10', 'In VBC-CC', 'VBC'),
            role('R11', 'Quản lý quyết định người học', 'QDNH'),
            role('R12', 'Quản lý thi trắc nghiệm', 'QLTTN'),
            role('R13', 'Quản lý điểm', 'D'),
            role('R14', 'Thi phách', 'TP'),
            role('R15', 'Thống kê tiến độ nhập điểm', 'TKND'),
            role('R16', 'Xét tốt nghiệp', 'TN'),
            role('R17', 'Xử lý học vụ', 'XLHV'),
            role('R18', 'Điểm rèn luyện', 'RL'),
            role('R19', 'Đăng ký học', 'DKH'),
            role('R20', 'Đăng ký thi lại', 'DKTL'),

            role('R21', 'Kế hoạch chương trình', 'KHCT'),
            role('R22', 'Luận Văn, Luận Án', 'LVLA'),
            role('R23', 'Nghiên cứu khoa học', 'NCKH'),
            role('R24', 'Nhập học', 'NH'),
            role('R25', 'Quản lý Tuyển Sinh', 'TS'),
            role('R26', 'Thu hồ sơ nhập học', 'THSNH'),
            role('R27', 'Thống kê nhập học', 'TKNH'),
            role('R28', 'Tra cứu chương trình đào tạo', 'TCCTDT'),
            role('R29', 'Tạo các mức phí nhập học', 'TMPNH'),
            role('R30', 'Tạo kế hoạch nhập học', 'TKHNH'),
            role('R31', 'Tạo kế hoạch tuyển sinh', 'TKHTS'),

            role('R32', 'Ký túc xá', 'KTX'),
            role('R33', 'Tài chính', 'TC'),
            role('R34', 'Tài chính - tra cứu kết quả đăng ký học', 'TCTC'),
            role('R35', 'Xét học bổng', 'HB'),

            role('R36', 'Nhân sự', 'NS'),
            role('R37', 'Nhân sự 2026', 'NS26'),
            role('R38', 'Sinh viên', 'SV'),
            role('R39', 'Thống kê giờ giảng', 'TKGG'),

            role('R40', 'Hệ thống thông tin', 'HTTT'),
            role('R41', 'Phân quyền nhập điểm chủ động gán', 'PQND'),
            role('R42', 'Quản lý khảo sát', 'QLKS'),
            role('R43', 'Quản lý đối tượng chính sách miễn giảm', 'QLMG'),
            role('R44', 'Quản trị hệ thống', 'CMS'),
            role('R45', 'SMS', 'SMS'),
            role('R46', 'Tin tức', 'TT'),
            role('R47', 'Đối tượng chính sách miễn giảm', 'DTMG'),

            role('R48', 'Khảo sát trực tuyến', 'KSTT')
        ],

        /* Cây chức năng mẫu của vai trò "Cổng cán bộ" (R02) — đủ màn của
           ApisCongCanBo theo cây thư mục, ID dạng  CCB-<module>-<tệp>:
               #/r/R02/CCB-quatrinhchucvu-quatrinhchucvu
           Tên lấy từ tiêu đề trong HTML gốc; màn không có tiêu đề thì đặt
           theo tên tệp. Tên thật nằm trong DB. Bỏ ztest/docjson (trang thử)
           và thongtinhuu (tệp rỗng). */
        menus: {
            /* Cổng sinh viên - thủ vai (CHOPHEPTHUVAI = 1): vào vai trò phải chọn người học trước
               (ums.thuVai). ID chức năng CSV-<module>-<tệp>. Mới có nhóm Đăng ký học. */
            R04: buildMenu([
                ['dangkyhoc', 'Đăng ký học', 'fa fa-pencil-square-o', [
                    ['dangky', 'Đăng ký học'],
                    ['tracuu', 'Kết quả đăng ký học'],
                    ['nguyenvong', 'Đăng ký nguyện vọng'],
                    ['thilai', 'Đăng ký thi lại'],
                    ['dangkymonthi', 'Đăng ký môn thi'],
                    ['nganh2', 'Đăng ký ngành 2'],
                    ['dinhhuong', 'Đăng ký định hướng'],
                    ['congnhandiem', 'Công nhận điểm'],
                    ['congnhandiemv3', 'Công nhận điểm (v3)'],
                    ['dangkycosodaotao', 'Đăng ký cơ sở đào tạo'],
                    ['xacnhannhaphoc', 'Xác nhận nhập học']]],
                ['hoctap', 'Học tập', 'fa fa-graduation-cap', [
                    ['diemhoc', 'Điểm học tập'],
                    ['chuontrinhhoc', 'Chương trình học'],
                    ['congnhandiem', 'Công nhận điểm'],
                    ['diemrenluyen', 'Điểm rèn luyện'],
                    ['hoantotnghiep', 'Xét - Hoãn xét tốt nghiệp'],
                    ['phuckhao', 'Đăng ký phúc khảo']]],
                ['thoikhoabieu', 'Thời khoá biểu', 'fa fa-calendar', [
                    ['lichhoc', 'Lịch học'],
                    ['lichthi', 'Lịch thi']]],
                ['profile', 'Hồ sơ cá nhân', 'fa fa-id-card', [
                    ['hoso', 'Hồ sơ sinh viên'],
                    ['tunhaphoso', 'Tự nhập hồ sơ'],
                    ['minhchung', 'Minh chứng hồ sơ']]],
                ['dicvusinhvien', 'Dịch vụ sinh viên', 'fa fa-check-square-o', [
                    ['nguoihocxacnhanthanhtoan', 'Kiểm tra thông tin cá nhân']]],
                ['sukien', 'Sự kiện', 'fa fa-bullhorn', [
                    ['sukien', 'Sự kiện']]],
                ['thutuchanhchinh', 'Thủ tục hành chính', 'fa fa-file-text-o', [
                    ['xinxacnhan', 'Xin xác nhận'],
                    ['yeucau', 'Yêu cầu hỗ trợ']]],
                ['xebus', 'Xe buýt', 'fa fa-bus', [
                    ['xebus', 'Đăng ký xe buýt'],
                    ['vethang', 'Vé tháng']]],
                ['dashboard', 'Trang chính', 'fa fa-dashboard', [
                    ['dashboard', 'Trang chính']]],
                ['tinhhinhhocphi', 'Tình hình học phí', 'fa fa-money', [
                    ['tinhhinhhocphi', 'Tình hình học phí'],
                    ['xuathoadon', 'Xuất hoá đơn'],
                    ['thuhocphi', 'Thu học phí'],
                    ['dongphuc', 'Đồng phục'],
                    ['quyettoan', 'Quyết toán']]],
                ['thanhtoanonline', 'Thanh toán trực tuyến', 'fa fa-credit-card', [
                    ['thanhtoanonline', 'Thanh toán trực tuyến']]],
                ['tintuc', 'Tin tức', 'fa fa-newspaper-o', [
                    ['tintuc', 'Bảng tin'],
                    ['vanban', 'Văn bản']]]
            ], null, { prefix: 'CSV', app: 'ApisCongSinhVien' }),
            /* Chuyên cần (R07) — đủ 5 màn của ApisChuyenCan, ID CC-<module>-<tệp>.
               Tên lấy theo tiêu đề / breadcrumb trong html gốc; tên thật nằm trong DB. */
            R07: buildMenu([
                ['nhapchuyencan', 'Nhập chuyên cần', 'fa fa-check-square-o', [
                    ['nhapchuyencan', 'Nhập chuyên cần'],
                    ['nhaptheolop', 'Nhập chuyên cần theo danh sách học'],
                    ['khongdiemdanh', 'Không điểm danh']]],
                ['tonghop', 'Tổng hợp', 'fa fa-bar-chart', [
                    ['tonghoptheongay', 'Tổng hợp theo ngày']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'CC', app: 'ApisChuyenCan' }),
            /* Quản trị hệ thống (R44) — ApisCMS, ID CMS-<module>-<tệp>. Bỏ trang thử danhmuc/test, test2,
               hethong/hello và bản lạc chỗ phanquyen/quantriquyendulieu.html (ngoài thư mục html/). */
            R44: buildMenu([
                ['nguoidung', 'Người dùng', 'fa fa-users', [
                    ['nguoidung', 'Quản lý người dùng'],
                    ['nguoidungvaitro', 'Người dùng - vai trò'],
                    ['nguoidungchucnang', 'Người dùng - chức năng'],
                    ['canbochucnang', 'Cán bộ - chức năng']]],
                ['vaitro', 'Vai trò', 'fa fa-user-secret', [
                    ['vaitro', 'Quản lý vai trò'],
                    ['vaitrochucnang', 'Vai trò - chức năng'],
                    ['vaitronguoidung', 'Vai trò - người dùng']]],
                ['chucnang', 'Chức năng', 'fa fa-sitemap', [
                    ['chucnang', 'Quản lý chức năng'],
                    ['configurechucnang', 'Cấu hình chức năng'],
                    ['sodoquytrinh', 'Sơ đồ quy trình'],
                    ['testchucnang', 'Test chức năng']]],
                ['ungdung', 'Ứng dụng', 'fa fa-th-large', [
                    ['ungdung', 'Quản lý ứng dụng'],
                    ['ungdungchucnang', 'Ứng dụng - chức năng'],
                    ['filebaocao', 'File báo cáo']]],
                ['phanquyen', 'Phân quyền dữ liệu', 'fa fa-shield', [
                    ['quantriquyendulieu', 'Quản trị quyền dữ liệu cán bộ'],
                    ['quantriquyendulieum1', 'Quản trị quyền dữ liệu cán bộ (M1)'],
                    ['quantriquyendulieum2', 'Quản trị quyền dữ liệu (M2)'],
                    ['diem', 'Phân quyền điểm'],
                    ['baocaoimport', 'Phân quyền báo cáo - import'],
                    ['canbonhaphosocanbo', 'Cán bộ nhập hồ sơ cán bộ'],
                    ['canbonhaphososinhvien', 'Cán bộ nhập hồ sơ sinh viên'],
                    ['canhantunhaphoso', 'Cá nhân tự nhập hồ sơ'],
                    ['sinhvientunhap', 'Sinh viên tự nhập']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu'],
                    ['danhmucthuoctinh', 'Danh mục thuộc tính'],
                    ['danhmuctenbang', 'Danh mục tên bảng'],
                    ['danhmuctukhoa', 'Danh mục từ khoá'],
                    ['danhmucimport', 'Danh mục import'],
                    ['danhmucexport', 'Danh mục export'],
                    ['import', 'Import'],
                    ['mauphoiin', 'Mẫu phôi in'],
                    ['cautrucnoidungguiemail', 'Cấu trúc nội dung gửi email'],
                    ['comparetable', 'So sánh bảng'],
                    ['exporttable', 'Export table'],
                    ['upcode', 'Upcode'],
                    ['cloudupdate', 'Cloud update'],
                    ['autologdb', 'Nhật ký gọi hàm']]],
                ['hethong', 'Hệ thống', 'fa fa-cogs', [
                    ['config_app', 'Cấu hình ứng dụng'],
                    ['crypto', 'Mã hoá'],
                    ['guiemail', 'Gửi email'],
                    ['accessedhistory', 'Lịch sử truy cập']]],
                ['hangdoi', 'Hàng đợi', 'fa fa-tasks', [
                    ['chuyendulieu', 'Chuyển dữ liệu'],
                    ['quanlytientrinhguiemail', 'Tiến trình gửi email']]],
                ['baocao', 'Báo cáo', 'fa fa-file-text-o', [
                    ['kehoach', 'Kế hoạch báo cáo'],
                    ['khaibao', 'Khai báo báo cáo'],
                    ['thuchien', 'Thực hiện báo cáo']]]
            ], null, { prefix: 'CMS', app: 'ApisCMS' }),
            /* Đăng ký học (R19) — ApisDangKyHoc, ID DKH-<module>-<tệp>. Bỏ phanconglophocphan (trang trống). */
            R19: buildMenu([
                ['kehoachdangky', 'Kế hoạch đăng ký', 'fa fa-calendar-check-o', [
                    ['kehoachdangky', 'Kế hoạch đăng ký'],
                    ['lophocphan', 'Lớp học phần'],
                    ['lophoc', 'Lớp học'],
                    ['donlop', 'Dồn lớp'],
                    ['phanconglop', 'Phân công lớp'],
                    ['phancongphamvi', 'Phân công phạm vi'],
                    ['quanlytoanbo', 'Quản lý toàn bộ'],
                    ['apphihocphan', 'Áp phí học phần'],
                    ['ruthocphan', 'Rút học phần'],
                    ['baocaodangkyhoc', 'Báo cáo đăng ký học'],
                    ['lichsu', 'Lịch sử']]],
                ['canbodangky', 'Cán bộ đăng ký', 'fa fa-user-plus', [
                    ['dangky', 'Cán bộ đăng ký cho sinh viên'],
                    ['khongdangky', 'Sinh viên không đăng ký']]],
                ['sinhviendangky', 'Sinh viên đăng ký', 'fa fa-pencil-square-o', [
                    ['dangky', 'Sinh viên đăng ký'],
                    ['autopk', 'Tự động phân khối']]],
                ['nguyenvongdangky', 'Nguyện vọng đăng ký', 'fa fa-list-ol', [
                    ['kehoachdangky', 'Kế hoạch nguyện vọng'],
                    ['phancongphamvi', 'Phân công phạm vi nguyện vọng'],
                    ['ketqua', 'Kết quả nguyện vọng'],
                    ['lichsudangky', 'Lịch sử đăng ký nguyện vọng']]],
                ['phancongchuongtrinh', 'Phân công chương trình', 'fa fa-sitemap', [
                    ['phancongchuongtrinh', 'Phân công chương trình']]],
                ['nganh2', 'Ngành 2', 'fa fa-graduation-cap', [
                    ['kehoach', 'Kế hoạch ngành 2']]],
                ['thilai', 'Thi lại', 'fa fa-repeat', [
                    ['kehoach', 'Kế hoạch thi lại']]],
                ['kehoachdangkymuabaohiem', 'Mua bảo hiểm', 'fa fa-shield', [
                    ['kehoachmua', 'Kế hoạch mua']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'DKH', app: 'ApisDangKyHoc' }),
            /* Học lại thi lại (R09) — ApisHocLaiThiLai, ID HLTL-<module>-<tệp>. Hai module cùng có lophocphan. */
            R09: buildMenu([
                ['lapdanhsach', 'Lập danh sách', 'fa fa-list-ol', [
                    ['lapdanhsach', 'Lập danh sách học lại thi lại'],
                    ['lophocphan', 'Lớp học phần (lập danh sách)']]],
                ['dangky', 'Đăng ký', 'fa fa-pencil-square-o', [
                    ['dangky', 'Đăng ký học lại thi lại'],
                    ['lophocphan', 'Lớp học phần thi lại']]],
                ['chotdanhsach', 'Chốt danh sách', 'fa fa-check-square-o', [
                    ['chotdanhsach', 'Chốt danh sách']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'HLTL', app: 'ApisHocLaiThiLai' }),
            /* Điểm rèn luyện (R18) — ApisRenLuyen, ID RL-<module>-<tệp>. Tên đặt theo tên tệp (html gốc không có tiêu đề). */
            R18: buildMenu([
                ['tieuchidiem', 'Tiêu chí điểm', 'fa fa-list-alt', [
                    ['tieuchidiem', 'Khai báo tiêu chí điểm'],
                    ['tieuchidiemapdung', 'Tiêu chí điểm áp dụng']]],
                ['tieuchixeploai', 'Tiêu chí xếp loại', 'fa fa-sort-amount-desc', [
                    ['tieuchixeploai', 'Khai báo tiêu chí xếp loại'],
                    ['tieuchixeploaiapdung', 'Tiêu chí xếp loại áp dụng']]],
                ['khaibaoheso', 'Hệ số', 'fa fa-percent', [
                    ['hesoapdung', 'Hệ số áp dụng']]],
                ['nhapdiemrenluyen', 'Nhập điểm', 'fa fa-pencil-square-o', [
                    ['nhapdiemrenluyen', 'Nhập điểm rèn luyện']]],
                ['tonghopdiem', 'Tổng hợp', 'fa fa-bar-chart', [
                    ['tonghopdiem', 'Tổng hợp điểm rèn luyện']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'RL', app: 'ApisRenLuyen' }),
            /* Quản lý điểm (R13) — ApisQuanLyDiem, ID QLD-<module>-<tệp>. Tên đặt theo tên tệp (html gốc không có tiêu đề). */
            R13: buildMenu([
                ['kehoach', 'Kế hoạch', 'fa fa-calendar', [
                    ['kehoach', 'Kế hoạch điểm'],
                    ['quydoichungchi', 'Quy đổi chứng chỉ']]],
                ['thamsochung', 'Tham số chung', 'fa fa-sliders', [
                    ['khaibaothamsochung', 'Khai báo tham số chung'],
                    ['thamsochungapdung', 'Tham số chung áp dụng']]],
                ['thanhphandiem', 'Thành phần điểm', 'fa fa-th-list', [
                    ['khaibaothanhphandiem', 'Khai báo thành phần điểm'],
                    ['khaibaothanhphandiemapdung', 'Thành phần điểm áp dụng']]],
                ['thamsotinhdiem', 'Tham số tính điểm', 'fa fa-calculator', [
                    ['khaibaothamsotinhdiem', 'Khai báo tham số tính điểm'],
                    ['thamsotinhdiemapdung', 'Tham số tính điểm áp dụng']]],
                ['thamsolamtron', 'Tham số làm tròn', 'fa fa-circle-o', [
                    ['khaibaothamsolamtron', 'Khai báo tham số làm tròn'],
                    ['thamsolamtronapdung', 'Tham số làm tròn áp dụng']]],
                ['thamsoquydoithangdiem', 'Quy đổi thang điểm', 'fa fa-exchange', [
                    ['thamsoquydoithangdiem', 'Tham số quy đổi thang điểm'],
                    ['thamsoquydoithangdiemapdung', 'Quy đổi thang điểm áp dụng']]],
                ['thamsodanhgiaketqua', 'Đánh giá kết quả', 'fa fa-check-square-o', [
                    ['thamsodanhgiaketqua', 'Tham số đánh giá kết quả'],
                    ['thamsodanhgiaketquaapdung', 'Đánh giá kết quả áp dụng']]],
                ['diemdacbiet', 'Điểm đặc biệt', 'fa fa-star', [
                    ['khaibaodiemdacbiet', 'Khai báo điểm đặc biệt'],
                    ['diemdacbietapdung', 'Điểm đặc biệt áp dụng']]],
                ['congthucdiem', 'Công thức điểm', 'fa fa-superscript', [
                    ['khaibaocongthucdiem', 'Khai báo công thức điểm'],
                    ['congthucdiemapdung', 'Công thức điểm áp dụng'],
                    ['hocphan', 'Công thức theo học phần'],
                    ['lophocphan', 'Công thức theo lớp học phần'],
                    ['hinhthucthi', 'Hình thức thi']]],
                ['cauhinhhienthi', 'Cấu hình hiển thị', 'fa fa-paint-brush', [
                    ['cauhinhhienthi', 'Cấu hình hiển thị'],
                    ['cauhinhhienthichung', 'Cấu hình hiển thị chung']]],
                ['nhapdiem', 'Nhập điểm', 'fa fa-pencil-square-o', [
                    ['nhapdiem', 'Nhập điểm'],
                    ['nhapdiemchamkiemtra', 'Nhập điểm chấm kiểm tra'],
                    ['nhapdiemphuckhao', 'Nhập điểm phúc khảo'],
                    ['mien', 'Miễn học phần']]],
                ['phanquyen', 'Phân quyền', 'fa fa-lock', [
                    ['diem', 'Phân quyền nhập điểm']]],
                ['tinhdiem', 'Tính điểm', 'fa fa-cogs', [
                    ['tonghopketqua', 'Tổng hợp kết quả'],
                    ['inbangdiem', 'In bảng điểm']]],
                ['tracuudiem', 'Tra cứu', 'fa fa-search', [
                    ['tracuudiem', 'Tra cứu điểm']]],
                ['canhan', 'Cá nhân', 'fa fa-user', [
                    ['inbangdiem', 'In bảng điểm cá nhân']]],
                ['thongke', 'Thống kê', 'fa fa-bar-chart', [
                    ['diemhocphan', 'Điểm học phần'],
                    ['diemtrungbinh', 'Điểm trung bình'],
                    ['thongkediemchu', 'Thống kê điểm chữ'],
                    ['tonghopketqua', 'Tổng hợp kết quả'],
                    ['nhapdiemhocphan', 'Tiến độ nhập điểm học phần'],
                    ['nhapdiemlophocphan', 'Tiến độ nhập điểm lớp học phần'],
                    ['nhapdiemkhoahoc', 'Tiến độ nhập điểm khoá học'],
                    ['nhapdiemlichthi', 'Tiến độ nhập điểm lịch thi']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'QLD', app: 'ApisQuanLyDiem' }),
            /* Xét học bổng (R35) — ApisHocBong, ID HB-<module>-<tệp>. Tên đặt theo tên tệp (html gốc không có tiêu đề). */
            R35: buildMenu([
                ['thietlap', 'Thiết lập', 'fa fa-sliders', [
                    ['thamsochung', 'Tham số chung'],
                    ['dieukienxet', 'Điều kiện xét'],
                    ['xeploaihabac', 'Xếp loại hạ bậc'],
                    ['quyhocbong', 'Quỹ học bổng'],
                    ['phanbohocbong', 'Phân bổ học bổng']]],
                ['kehoach', 'Kế hoạch xét', 'fa fa-calendar', [
                    ['kehoach', 'Kế hoạch xét học bổng'],
                    ['sotinkehoach', 'Số tín kế hoạch'],
                    ['thuchienxet', 'Thực hiện xét'],
                    ['xacnhan', 'Xác nhận kết quả'],
                    ['tonghop', 'Tổng hợp']]],
                ['vanbang', 'Văn bằng', 'fa fa-graduation-cap', [
                    ['quanlythongtin', 'Quản lý thông tin']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'HB', app: 'ApisHocBong' }),
            /* Xét tốt nghiệp (R16) — ApisTotNghiep, ID TN-<module>-<tệp>. Tên đặt theo tên tệp (menu host bản xuất 26/9 không có tên màn). */
            R16: buildMenu([
                ['thietlap', 'Thiết lập điều kiện', 'fa fa-sliders', [
                    ['thamsochung', 'Tham số chung'],
                    ['dieukienxet', 'Điều kiện xét'],
                    ['xeploaihabac', 'Xếp loại hạ bậc']]],
                ['kehoach', 'Kế hoạch xét', 'fa fa-calendar', [
                    ['kehoach', 'Kế hoạch xét tốt nghiệp'],
                    ['dieukiennhom', 'Điều kiện nhóm'],
                    ['thuchienxet', 'Thực hiện xét'],
                    ['xacnhan', 'Xác nhận kết quả'],
                    ['tonghop', 'Tổng hợp'],
                    ['quanlysovaso', 'Quản lý số vào sổ']]],
                ['vanbang', 'Văn bằng - Chứng chỉ', 'fa fa-graduation-cap', [
                    ['quanlythongtin', 'Quản lý thông tin'],
                    ['thuchienin', 'Thực hiện in']]],
                ['hoctap', 'Học tập', 'fa fa-book', [
                    ['xemdiem_sv', 'Xem điểm sinh viên']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'TN', app: 'ApisTotNghiep' }),
            /* Xử lý học vụ (R17) — ApisXuLyHocVu, ID XLHV-<module>-<tệp>. */
            R17: buildMenu([
                ['dieukienxuly', 'Điều kiện xử lý', 'fa fa-sliders', [
                    ['khaibaodieukien', 'Khai báo điều kiện'],
                    ['dieukienapdung', 'Điều kiện áp dụng']]],
                ['kehoachxuly', 'Kế hoạch xử lý', 'fa fa-calendar', [
                    ['kehoachxuly', 'Kế hoạch xử lý học vụ']]],
                ['thuchienxulyhocvu', 'Thực hiện xử lý', 'fa fa-cogs', [
                    ['thuchienxulyhocvu', 'Thực hiện xử lý học vụ']]],
                ['pheduyetketqua', 'Phê duyệt', 'fa fa-check-circle', [
                    ['pheduyetketqua', 'Phê duyệt kết quả']]],
                ['raquyetdinh', 'Quyết định', 'fa fa-gavel', [
                    ['raquyetdinh', 'Ra quyết định']]],
                ['tracuuketqua', 'Tra cứu', 'fa fa-search', [
                    ['tracuuketqua', 'Tra cứu kết quả']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'XLHV', app: 'ApisXuLyHocVu' }),
            /* Nhân sự (R36) — ApisNhanSu, ID NS-<module>-<tệp>. Tên đặt theo tên tệp (phần lớn html gốc không có tiêu đề). */
            R36: buildMenu([
                ['hoso', 'Hồ sơ', 'fa fa-id-card-o', [
                    ['capnhatv2', 'Cập nhật hồ sơ'],
                    ['khoitao', 'Khởi tạo hồ sơ'],
                    ['nhansungoaitruong', 'Nhân sự ngoài trường'],
                    ['qtthongtin', 'Quá trình thông tin'],
                    ['cauhinhhoso', 'Cấu hình hồ sơ'],
                    ['cauhinhhopdong', 'Cấu hình hợp đồng']]],
                ['quatrinhcongtac', 'Quá trình công tác', 'fa fa-briefcase', [
                    ['quatrinhcongtac', 'Quá trình công tác'],
                    ['cachinhthuchopdong', 'Các hình thức hợp đồng'],
                    ['cacmonhocdagiangday', 'Các môn học đã giảng dạy'],
                    ['dinuocngoai', 'Đi nước ngoài'],
                    ['hoatdongxahoivagiangday', 'Hoạt động xã hội và giảng dạy'],
                    ['huongnghiencuuchinh', 'Hướng nghiên cứu chính'],
                    ['nhiemvuchienluoc', 'Nhiệm vụ chiến lược'],
                    ['thongtinhuu', 'Thông tin hưu']]],
                ['quatrinh', 'Quá trình', 'fa fa-history', [
                    ['chucvu', 'Quá trình chức vụ']]],
                ['quatrinhdaotao', 'Quá trình đào tạo', 'fa fa-graduation-cap', [
                    ['quatrinhdaotao', 'Quá trình đào tạo']]],
                ['quatrinhsuckhoe', 'Sức khoẻ', 'fa fa-heartbeat', [
                    ['quatrinhsuckhoe', 'Quá trình sức khoẻ']]],
                ['quanhegiadinh', 'Gia đình', 'fa fa-users', [
                    ['quanhegiadinh', 'Quan hệ gia đình']]],
                ['khenthuongkyluat', 'Khen thưởng kỷ luật', 'fa fa-trophy', [
                    ['khenthuongkyluat', 'Khen thưởng kỷ luật']]],
                ['danhhieuhocham', 'Danh hiệu học hàm', 'fa fa-certificate', [
                    ['danhhieuhocham', 'Danh hiệu học hàm']]],
                ['nghithaisan', 'Nghỉ thai sản', 'fa fa-child', [
                    ['nghithaisan', 'Nghỉ thai sản']]],
                ['nghihuu', 'Nghỉ hưu', 'fa fa-user-times', [
                    ['nghihuu', 'Nghỉ hưu']]],
                ['quyetdinh', 'Quyết định', 'fa fa-gavel', [
                    ['quyetdinh', 'Quyết định']]],
                ['hopdong', 'Hợp đồng', 'fa fa-file-text', [
                    ['hopdongcanbo', 'Hợp đồng cán bộ'],
                    ['hopdongdukien', 'Hợp đồng dự kiến']]],
                ['cocautochuc', 'Cơ cấu tổ chức', 'fa fa-sitemap', [
                    ['cocautochuc', 'Cơ cấu tổ chức'],
                    ['cocautochucv2', 'Cơ cấu tổ chức (v2)'],
                    ['cocautochucngoaitruong', 'Cơ cấu tổ chức ngoài trường'],
                    ['khungcocaunhansu', 'Khung cơ cấu nhân sự'],
                    ['vitricongviec', 'Vị trí công việc'],
                    ['vaitrovitri', 'Vai trò vị trí'],
                    ['phanconglaodong', 'Phân công lao động'],
                    ['quanhelaodong', 'Quan hệ lao động'],
                    ['danhmucnghe', 'Danh mục nghề']]],
                ['nhansu', 'Tuyển dụng', 'fa fa-user-plus', [
                    ['nhansu', 'Nhân sự'],
                    ['kehoach', 'Kế hoạch nhân sự'],
                    ['dexuattuyendung', 'Đề xuất tuyển dụng']]],
                ['kehoach', 'Kế hoạch', 'fa fa-calendar', [
                    ['kehoach', 'Kế hoạch'],
                    ['canhan', 'Cá nhân'],
                    ['dexuathoso', 'Đề xuất hồ sơ']]],
                ['heso', 'Hệ số', 'fa fa-percent', [
                    ['hesongach', 'Hệ số ngạch'],
                    ['hesochucdanh', 'Hệ số chức danh'],
                    ['hesochucvu', 'Hệ số chức vụ'],
                    ['hesothamnien', 'Hệ số thâm niên'],
                    ['chucvuchinhquyen', 'Chức vụ chính quyền'],
                    ['chucvudoandang', 'Chức vụ đoàn đảng'],
                    ['khoanchucvu', 'Khoản chức vụ'],
                    ['chedomien', 'Chế độ miễn'],
                    ['chedomienrieng', 'Chế độ miễn riêng'],
                    ['khungdinhmuc', 'Khung định mức'],
                    ['khungdinhmucrieng', 'Khung định mức riêng'],
                    ['quydoigio', 'Quy đổi giờ'],
                    ['tangthem', 'Tăng thêm'],
                    ['khongtinhluong', 'Không tính lương'],
                    ['xulybietle', 'Xử lý biệt lệ'],
                    ['tonghopkhoiluong', 'Tổng hợp khối lượng']]],
                ['luong', 'Lương', 'fa fa-money', [
                    ['bangtinhluongnam', 'Bảng tính lương năm'],
                    ['bangtinhluongvaphucap', 'Bảng tính lương và phụ cấp'],
                    ['biendong', 'Biến động'],
                    ['cautrucbangluong', 'Cấu trúc bảng lương'],
                    ['cautrucbangluongnam', 'Cấu trúc bảng lương năm'],
                    ['cosoapdung', 'Cơ sở áp dụng'],
                    ['danhsachgiamtrugiacanh', 'Giảm trừ gia cảnh'],
                    ['dieukienxetnangluong', 'Điều kiện xét nâng lương'],
                    ['dstinhluongtheothang', 'Tính lương theo tháng'],
                    ['hangchucdanh', 'Hạng chức danh'],
                    ['hesoluong', 'Hệ số lương'],
                    ['kehoachxetnangluong', 'Kế hoạch xét nâng lương'],
                    ['khoanduocnhankhac', 'Khoản được nhận khác'],
                    ['khoankhongtinh', 'Khoản không tính'],
                    ['luongduocnhankhac', 'Lương được nhận khác'],
                    ['luongvathunhapkhac', 'Lương và thu nhập khác'],
                    ['mucluongcoban', 'Mức lương cơ bản'],
                    ['nhomngachbac', 'Nhóm ngạch bậc'],
                    ['phucap', 'Phụ cấp'],
                    ['quatrinhluong', 'Quá trình lương'],
                    ['quydinhdongbaohiem', 'Quy định đóng bảo hiểm'],
                    ['quydinhgiamtru', 'Quy định giảm trừ'],
                    ['quydinhnangluong', 'Quy định nâng lương'],
                    ['quydinhphucap', 'Quy định phụ cấp'],
                    ['quydinhtinhthuethunhapcanhan', 'Quy định thuế TNCN'],
                    ['thamnien', 'Thâm niên'],
                    ['thuchienxetnangluong', 'Thực hiện xét nâng lương'],
                    ['truylinh', 'Truy lĩnh']]],
                ['chamcongphep', 'Chấm công, phép', 'fa fa-clock-o', [
                    ['chamcongvaora', 'Chấm công vào ra'],
                    ['giolamviec', 'Giờ làm việc'],
                    ['ngaylamviectuan', 'Ngày làm việc trong tuần'],
                    ['nghile', 'Nghỉ lễ'],
                    ['nghichedo', 'Nghỉ chế độ'],
                    ['nghiphep', 'Nghỉ phép'],
                    ['danhsachphep', 'Danh sách phép'],
                    ['dimuonvesom', 'Đi muộn về sớm'],
                    ['tonghopcongthang', 'Tổng hợp công tháng']]],
                ['dgplnguoilaodong', 'Đánh giá người lao động', 'fa fa-star-half-o', [
                    ['kehoach', 'Kế hoạch đánh giá'],
                    ['tieuchi', 'Tiêu chí'],
                    ['phancap', 'Phân cấp'],
                    ['anhxa', 'Ánh xạ'],
                    ['sinhphieu', 'Sinh phiếu'],
                    ['ketqua', 'Kết quả phân loại']]],
                ['dgplluongtangthem', 'Đánh giá lương tăng thêm', 'fa fa-line-chart', [
                    ['kehoach', 'Kế hoạch'],
                    ['quydinh', 'Quy định'],
                    ['tieuchi', 'Tiêu chí'],
                    ['tieuchithuong', 'Tiêu chí thưởng'],
                    ['tieuchithuong_cvql', 'Tiêu chí thưởng CVQL'],
                    ['tieuchitru', 'Tiêu chí trừ'],
                    ['phancap', 'Phân cấp'],
                    ['anhxa', 'Ánh xạ'],
                    ['ketqua', 'Kết quả']]],
                ['dubao', 'Dự báo', 'fa fa-bell', [
                    ['hethanhopdong', 'Hết hạn hợp đồng'],
                    ['nangluongthuongxuyen', 'Nâng lương thường xuyên'],
                    ['nangluongtruocthoihan', 'Nâng lương trước thời hạn'],
                    ['nangluongvuotkhung', 'Nâng lương vượt khung'],
                    ['nghihuu', 'Đến tuổi nghỉ hưu']]],
                ['tracuuinan', 'Tra cứu, in ấn', 'fa fa-print', [
                    ['hosolylich', 'Hồ sơ lý lịch'],
                    ['nhansutuychon', 'Nhân sự tuỳ chọn']]],
                ['baocao', 'Báo cáo', 'fa fa-bar-chart', [
                    ['tongquannhanluc', 'Tổng quan nhân lực'],
                    ['chatluongnhanluc', 'Chất lượng nhân lực']]],
                ['dashboard', 'Tổng quan', 'fa fa-tachometer', [
                    ['dashboard', 'Dashboard'],
                    ['trangchu', 'Trang chủ nhân sự'],
                    ['modul', 'Mô-đun']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'NS', app: 'ApisNhanSu' }),
            /* Sinh viên (R38) — ApisSinhVien, ID SV-<module>-<tệp>. Tên đặt theo tên tệp (html gốc không có tiêu đề). */
            R38: buildMenu([
                ['hoso', 'Hồ sơ sinh viên', 'fa fa-id-card-o', [
                    ['hoso_danhsach', 'Danh sách hồ sơ'],
                    ['hoso_capnhat', 'Cập nhật hồ sơ'],
                    ['hoso_taomoi', 'Tạo mới hồ sơ'],
                    ['hoso_taomoi_cu', 'Tạo mới hồ sơ (bản cũ)'],
                    ['hoso_sua', 'Sửa hồ sơ'],
                    ['hoso_in', 'In hồ sơ'],
                    ['xemhoso', 'Xem hồ sơ'],
                    ['quanlytoanbo', 'Quản lý toàn bộ'],
                    ['timkiemsinhvien', 'Tìm kiếm sinh viên'],
                    ['quahan', 'Quá hạn'],
                    ['yeucau', 'Yêu cầu'],
                    ['DaQHHT', 'Xác nhận thực hiện']]],
                ['chinhsach', 'Chính sách', 'fa fa-gift', [
                    ['chedochinhsach', 'Chế độ chính sách'],
                    ['chinhsachdoituong', 'Chính sách theo đối tượng'],
                    ['chinhsachphantram', 'Chính sách theo phần trăm'],
                    ['chinhsachsotien', 'Chính sách theo số tiền'],
                    ['goihotro', 'Gói hỗ trợ'],
                    ['tonghopdoituong', 'Tổng hợp theo đối tượng'],
                    ['tonghopphantram', 'Tổng hợp theo phần trăm'],
                    ['tonghopsotien', 'Tổng hợp theo số tiền']]],
                ['kehoach', 'Kế hoạch', 'fa fa-calendar', [
                    ['kehoach', 'Kế hoạch'],
                    ['xacnhanketqua', 'Xác nhận kết quả']]],
                ['quyetdinh', 'Quyết định', 'fa fa-gavel', [
                    ['quyetdinh', 'Quyết định'],
                    ['thucthiquyetdinh', 'Thực thi quyết định']]],
                ['tinhtrangquanso', 'Quân số', 'fa fa-users', [
                    ['tinhtrangquanso', 'Tình trạng quân số']]],
                ['thutuchanhchinh', 'Thủ tục hành chính', 'fa fa-file-text-o', [
                    ['giayto', 'Giấy tờ'],
                    ['yeucau', 'Yêu cầu'],
                    ['canboxuly', 'Cán bộ xử lý']]],
                ['vexe', 'Vé xe', 'fa fa-bus', [
                    ['xebus', 'Xe bus'],
                    ['vethang', 'Vé tháng']]],
                ['dicvusinhvien', 'Dịch vụ sinh viên', 'fa fa-credit-card', [
                    ['nguoihocxacnhanthanhtoan', 'Người học xác nhận thanh toán']]],
                ['hoctructuyen', 'Học trực tuyến', 'fa fa-laptop', [
                    ['thongtindayhoc', 'Thông tin dạy học'],
                    ['giangviendayhoc', 'Giảng viên dạy học']]],
                ['dashboard', 'Tổng quan', 'fa fa-tachometer', [
                    ['dashboard', 'Dashboard']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'SV', app: 'ApisSinhVien' }),
            /* Kế hoạch chương trình (R21) — ApisKeHoachChuongTrinh, ID KHCT-<module>-<tệp>. Tên đặt theo tên tệp (html gốc không có tiêu đề). */
            R21: buildMenu([
                ['tochucchuongtrinh', 'Tổ chức chương trình', 'fa fa-sitemap', [
                    ['hedaotao', 'Hệ đào tạo'],
                    ['khoahoc', 'Khoá học'],
                    ['namhoc', 'Năm học'],
                    ['thoigiandaotao', 'Thời gian đào tạo'],
                    ['chuongtrinh', 'Chương trình'],
                    ['noidungchuongtrinh', 'Nội dung chương trình'],
                    ['dinhhuong', 'Định hướng']]],
                ['noidungdaotao', 'Nội dung đào tạo', 'fa fa-book', [
                    ['monhoc', 'Môn học'],
                    ['hocphan', 'Học phần'],
                    ['hocphantuongduong', 'Học phần tương đương'],
                    ['quanhehocphan', 'Quan hệ học phần'],
                    ['baihoc', 'Bài học'],
                    ['decuonghoctap', 'Đề cương học tập']]],
                ['chuongtrinhhocphan', 'Chương trình – học phần', 'fa fa-list-alt', [
                    ['cthp', 'Chương trình – học phần']]],
                ['hoatdongchung', 'Kế hoạch chung', 'fa fa-calendar', [
                    ['kehoach', 'Kế hoạch'],
                    ['kehoachchitiet', 'Kế hoạch chi tiết']]],
                ['hoatdong', 'Hoạt động', 'fa fa-tasks', [
                    ['dukienhocphan', 'Dự kiến học phần'],
                    ['hocphan', 'Học phần'],
                    ['molop', 'Mở lớp'],
                    ['dinhhuong', 'Định hướng']]],
                ['thietlapcaclophocphan', 'Thiết lập lớp học phần', 'fa fa-cogs', [
                    ['thietlapcaclophocphan', 'Thiết lập các lớp học phần']]],
                ['lophoc', 'Lớp học', 'fa fa-users', [
                    ['lophoc', 'Lớp học'],
                    ['covanlop', 'Cố vấn lớp'],
                    ['quanlytoanbo', 'Quản lý toàn bộ']]],
                ['phanlichgiang', 'Phân lịch giảng', 'fa fa-calendar-check-o', [
                    ['quantri_phanlichgiang', 'Quản trị phân lịch giảng'],
                    ['phanquyen', 'Phân quyền'],
                    ['dulieuthucdia', 'Dữ liệu thực địa']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Danh mục dữ liệu']]]
            ], null, { prefix: 'KHCT', app: 'ApisKeHoachChuongTrinh' }),
            /* Nhập học (R24) — ApisNhapHoc, ID NH-<module>-<tệp>. Tên theo chức năng trên host (bản xuất mapping 26/9);
               bốn tệp "(bản cũ)" không có trên menu host nhưng còn trong mã gốc. */
            R24: buildMenu([
                ['kehoach', 'Kế hoạch', 'fa fa-calendar', [
                    ['nhaphoc', 'Kế hoạch nhập học'],
                    ['nhansu', 'Kế hoạch nhân sự']]],
                ['dinhmuc', 'Định mức', 'fa fa-sliders', [
                    ['dinhmucchung', 'Định mức chung'],
                    ['dinhmucrieng', 'Định mức riêng']]],
                ['quydinh', 'Quy định hồ sơ', 'fa fa-folder-open', [
                    ['hoso', 'Quy định hồ sơ'],
                    ['hoso_apdung', 'Quy định hồ sơ áp dụng']]],
                ['quytacsinhma', 'Quy tắc sinh mã', 'fa fa-barcode', [
                    ['quytacsinhma', 'Quy tắc sinh mã']]],
                ['trungtuyen', 'Trúng tuyển đại học', 'fa fa-graduation-cap', [
                    ['danhsach', 'Danh sách trúng tuyển'],
                    ['import', 'Import trúng tuyển'],
                    ['kehoachtuyensinhnew', 'Kế hoạch nhập học (new)']]],
                ['phanlop', 'Phân lớp', 'fa fa-users', [
                    ['phanlop', 'Phân lớp'],
                    ['chuyenlopnhaphoc', 'Chuyển lớp - chỉ chuyển lớp không thay đổi kế hoạch'],
                    ['hosotuyensinh', 'Chuyển lớp - sẽ chuyển cả kế hoạch tuyển sinh']]],
                ['thuhoso', 'Thu hồ sơ', 'fa fa-inbox', [
                    ['thuhosonew', 'Thu hồ sơ'],
                    ['thuhoso', 'Thu hồ sơ (bản cũ)']]],
                ['taichinh', 'Tài chính nhập học', 'fa fa-money', [
                    ['taichinhnew', 'Thu tiền'],
                    ['khaimucphinhaphoc', 'Khai mức phí thu nhập học'],
                    ['checkinnhaphoc', 'Check-in nhập học (bản cũ)'],
                    ['taichinh', 'Thu tiền (bản cũ)']]],
                ['ruttien', 'Rút tiền', 'fa fa-reply', [
                    ['ruttiennew', 'Rút tiền'],
                    ['ruttien', 'Rút tiền (bản cũ)']]],
                ['thongke', 'Thống kê', 'fa fa-bar-chart', [
                    ['lephinhaphoc', 'Lệ phí nhập học'],
                    ['loaikhoan', 'Loại khoản'],
                    ['ngaythu', 'Ngày thu'],
                    ['nguoithu', 'Người thu'],
                    ['sinhviennhaphoc', 'Sinh viên nhập học']]],
                ['baocaothongke', 'Báo cáo', 'fa fa-file-text', [
                    ['baocaosinhvien', 'Báo cáo sinh viên'],
                    ['baocao', 'Báo cáo tài chính']]],
                ['hethong', 'Hệ thống', 'fa fa-cog', [
                    ['dongbodulieu', 'Đồng bộ dữ liệu'],
                    ['tracuuphieurut', 'Tra cứu phiếu rút'],
                    ['tracuuphieuthu', 'Tra cứu phiếu thu']]]
            ], null, { prefix: 'NH', app: 'ApisNhapHoc' }),
            /* Thi phách (R14) — ApisThiPhach, ID TP-<module>-<tệp>. Tên theo chức năng trên host (mapping 26/9); ba màn không có
               trên menu host (baocaothi, tuibai, xacnhan) đặt tên theo tệp. */
            R14: buildMenu([
                ['kehoach', 'Tổ chức thi', 'fa fa-diamond', [
                    ['duyetdulieuthi', 'Cập nhật đủ điều kiện dự thi'],
                    ['hannhapdiem', 'Nhập hạn nhập điểm'],
                    ['khaothicapnhat', 'Cập nhật tình trạng vi phạm quy chế thi'],
                    ['tuibaitc', 'Tạo túi bài, lập phách'],
                    ['tuibai', 'Túi bài (tuibai)'],
                    ['chamkiemtradst', 'Chấm kiểm tra - Danh sách thi'],
                    ['champhach', 'Chấm kiểm tra - Phách'],
                    ['phanquyennhapdiem', 'Phân quyền nhập theo Túi'],
                    ['phanquyennhapdiemdst', 'Phân quyền nhập theo DST'],
                    ['phanquyennhapdiemlhp', 'Phân quyền nhập theo Lop HP'],
                    ['nhapdiem', 'Nhập điểm theo phách'],
                    ['nhapdiemdst', 'Nhập điểm theo danh sách thi'],
                    ['phuckhao', 'Khảo thí duyệt đk Phúc Khảo'],
                    ['xacnhan', 'Xác nhận (xacnhan)'],
                    ['tracuulichthi', 'Tra cứu lịch thi - phách'],
                    ['thongketinhtrangtochucthi', 'Thống kê tình trạng tổ chức thi'],
                    ['baocaothi', 'Báo cáo thi (baocaothi)']]],
                ['danhmuc', 'Danh mục', 'fa fa-cogs', [
                    ['danhmucdulieu', 'Khai báo danh mục']]]
            ], null, { prefix: 'TP', app: 'ApisThiPhach' }),
            /* Tuyển sinh (R31) — ApisQuanlyTuyenSinh (tên thư mục repo; CSDL ghi ApisQuanLyTuyenSinh — IIS không phân biệt hoa thường),
               ID TS-<module>-<tệp>. Tên theo chức năng trên host (bản xuất mapping 26/9). nhapdiemtest (trang thử) không đưa vào. */
            R31: buildMenu([
                ['tuyensinh', 'Tuyển sinh', 'fa fa-graduation-cap', [
                    ['kehoachtuyensinhnew', 'Kế hoạch tuyển sinh (new)'],
                    ['kehoachtuyensinh', 'Kế hoạch tuyển sinh'],
                    ['chitieutuyensinh', 'Kế hoạch chỉ tiêu'],
                    ['khaibaothongtin', 'Khai báo thông tin'],
                    ['diachitruong', 'Địa chỉ trường'],
                    ['doitactuyensinh', 'Đối tác tuyển sinh'],
                    ['hosotuyensinh', 'Nhập hồ sơ tuyển sinh'],
                    ['duyethoso', 'Duyệt hồ sơ'],
                    ['xettuyen', 'Xét tuyển'],
                    ['ingiaytrungtuyen', 'In giấy trúng tuyển']]],
                ['hoso', 'Hồ sơ', 'fa fa-folder-open', [
                    ['quanlyhoso', 'Quản lý hồ sơ'],
                    ['quanlyhosomorong', 'Quản lý hồ sơ - mở rộng'],
                    ['tochucthinhapdiem', 'Tổ chức thi tuyển sinh']]],
                ['nhapdiem', 'Nhập điểm', 'fa fa-pencil', [
                    ['nhapdiem', 'Nhập điểm tuyển sinh']]],
                ['danhmuc', 'Danh mục', 'fa fa-list', [
                    ['danhmucdulieu', 'Khai báo danh mục']]]
            ], null, { prefix: 'TS', app: 'ApisQuanlyTuyenSinh' }),
            /* Nghiên cứu khoa học (R23) — ApisNCKH, ID NCKH-<module>-<tệp>. Tên theo chức năng trên host (mapping 26/9); màn không có
               trên menu host đặt tên theo tệp. */
            R23: buildMenu([
                ['danhmuc', 'Danh mục sản phẩm', 'fa fa-list', [
                    ['tentapchiquocte', 'Bài báo quốc tế'],
                    ['tentapchiquocgia', 'Bài báo quốc gia'],
                    ['danhmucdetai', 'Danh mục đề tài'],
                    ['danhmucdulieu', 'Khai báo danh mục']]],
                ['quanlysanpham', 'Quản lý sản phẩm', 'fa fa-flask', [
                    ['tapchiquocte', 'Bài báo quốc tế'],
                    ['tapchiquocgia', 'Bài báo trong nước'],
                    ['baibaoquocte', 'Bài báo quốc tế (baibaoquocte)'],
                    ['baibaotrongnuoc', 'Bài báo trong nước (baibaotrongnuoc)'],
                    ['kyyeuhoinghi', 'Kỷ yếu/hội nghị'],
                    ['thongtinsach', 'Thông tin sách'],
                    ['detai', 'Đề tài/dự án'],
                    ['quanlyduan', 'Quản lý dự án'],
                    ['detaisinhvien', 'Đề tài sinh viên'],
                    ['giaithuong', 'Giải thưởng'],
                    ['vanbangsangche', 'Văn bằng sáng chế'],
                    ['hoinghihoithao', 'Hội nghị/hội thảo'],
                    ['giangdaysaudaihoc', 'Giảng dạy sau đại học'],
                    ['huongdansaudaihoc', 'Hướng dẫn sau đại học'],
                    ['huongdangiangday', 'Hướng dẫn giảng dạy'],
                    ['hoidongxetchucdanh', 'Hội đồng xét chức danh'],
                    ['hoidongdaoduc', 'Hội đồng đạo đức']]],
                ['xacnhankekhai', 'Xác nhận kê khai', 'fa fa-check-square-o', [
                    ['tapchiquocte', 'Bài báo quốc tế'],
                    ['tapchiquocgia', 'Bài báo trong nước'],
                    ['kyyeuhoinghi', 'Kỷ yếu/hội nghị'],
                    ['thongtinsach', 'Thông tin sách'],
                    ['detai', 'Đề tài/dự án'],
                    ['detaisinhvien', 'Đề tài sinh viên'],
                    ['giaithuong', 'Giải thưởng'],
                    ['vanbangsangche', 'Văn bằng sáng chế'],
                    ['hoinghihoithao', 'Hội nghị/hội thảo'],
                    ['giangdaysaudaihoc', 'Giảng dạy sau đại học'],
                    ['huongdansaudaihoc', 'Hướng dẫn sau đại học'],
                    ['hoidongxetchucdanh', 'Hội đồng xét chức danh'],
                    ['hoidongdaoduc', 'Hội đồng đạo đức'],
                    ['phieudanhgia', 'Tiêu chí thi đua khen thưởng dành cho giảng viên'],
                    ['phieudanhgiacanbo', 'Tiêu chí thi đua khen thưởng dành cho cán bộ']]],
                ['tinhdiem', 'Tính điểm', 'fa fa-calculator', [
                    ['tinhdiem', 'Tính điểm'],
                    ['tinhdiemsanpham', 'Tính điểm sản phẩm'],
                    ['phanbo', 'Phân bổ']]],
                ['quanlydiem', 'Quản lý điểm', 'fa fa-star', [
                    ['quanlydiem', 'Quản lý điểm']]],
                ['quanlyhoso', 'Quản lý hồ sơ', 'fa fa-folder-open', [
                    ['quanlyhoso', 'Quản lý hồ sơ']]],
                ['baocao', 'Báo cáo', 'fa fa-file-text', [
                    ['baocao', 'Báo cáo'],
                    ['tapchiquocte', 'Bài báo quốc tế'],
                    ['tapchiquocgia', 'Bài báo quốc gia'],
                    ['sach', 'Sách'],
                    ['detai', 'Đề tài'],
                    ['giaithuong', 'Giải thưởng'],
                    ['vanbangsangche', 'Văn bằng sáng chế'],
                    ['hoinghihoithao', 'Hội nghị/hội thảo'],
                    ['huongdansinhvien', 'Hướng dẫn sinh viên'],
                    ['hoidongxetchucdanh', 'Hội đồng xét chức danh']]],
                ['tracuuinan', 'Tra cứu, in ấn', 'fa fa-print', [
                    ['hosolylich', 'Hồ sơ lý lịch'],
                    ['nhansutuychon', 'Nhân sự tuỳ chọn']]],
                ['lylichkhoahoc', 'Lý lịch khoa học', 'fa fa-id-card', [
                    ['lylichkhoahoc', 'Lý lịch khoa học']]],
                ['dashboard', 'Tổng quan', 'fa fa-tachometer', [
                    ['dashboard', 'Dashboard']]]
            ], null, { prefix: 'NCKH', app: 'ApisNCKH' }),
            R02: buildMenu([
                ['hoso', 'Hồ sơ cá nhân', 'fa fa-user', [
                    ['capnhathoso', 'Thông tin lý lịch'],
                    ['qtthongtin', 'Tất cả hoạt động'],
                    ['quyetdinh', 'Danh sách quyết định']]],
                ['quatrinhcongtac', 'Quá trình công tác', 'fa fa-briefcase', [
                    ['quatrinhcongtac', 'Quá trình công tác trước tuyển dụng'],
                    ['cachinhthuchopdong', 'Hợp đồng lao động'],
                    ['cacmonhocdagiangday', 'Các môn học đã giảng dạy'],
                    ['danhsachgiamtrugiacanh', 'Giảm trừ gia cảnh'],
                    ['dinuocngoai', 'Đi nước ngoài'],
                    ['hoatdongxahoi_giangday', 'Hoạt động xã hội và giảng dạy'],
                    ['huongnghiencuuchinh', 'Hướng nghiên cứu chính'],
                    ['nhiemvuchienluoc', 'Nhiệm vụ chiến lược']]],
                ['quatrinhchucvu', 'Quá trình chức vụ', 'fa fa-id-badge', [['quatrinhchucvu', 'Quá trình chức vụ']]],
                ['quatrinhdaotao', 'Quá trình đào tạo', 'fa fa-graduation-cap', [['quatrinhdaotao', 'Quá trình đào tạo']]],
                ['quatrinhsuckhoe', 'Quá trình sức khoẻ', 'fa fa-heartbeat', [['quatrinhsuckhoe', 'Quá trình khám sức khỏe']]],
                ['quanhegiadinh', 'Quan hệ gia đình', 'fa fa-users', [['quanhegiadinh', 'Quan hệ gia đình']]],
                ['khenthuongkyluat', 'Khen thưởng, kỷ luật', 'fa fa-trophy', [['khenthuongkyluat', 'Quá trình khen thưởng']]],
                ['danhhieuhocham', 'Học hàm, danh hiệu', 'fa fa-certificate', [['danhhieuhocham', 'Học hàm']]],
                ['nghithaisan', 'Nghỉ thai sản', 'fa fa-child', [['nghithaisan', 'Nghỉ thai sản']]],
                ['luong', 'Lương', 'fa fa-money', [
                    ['quatrinhluong', 'Quá trình lương'],
                    ['bangtinhluongnam', 'Bảng tính lương năm'],
                    ['luongvathunhapkhac', 'Lương và thu nhập khác']]],
                ['sanphamkhoahoc', 'Sản phẩm khoa học', 'fa fa-flask', [
                    ['detai', 'Đề tài/dự án'],
                    ['detaisinhvien', 'Đề tài sinh viên'],
                    ['giaithuong', 'Giải thưởng'],
                    ['giangdaysaudaihoc', 'Giảng dạy sau đại học'],
                    ['huongdansaudaihoc', 'Hướng dẫn sau đại học'],
                    ['hoidongxetchucdanh', 'Hội đồng xét chức danh'],
                    ['hoinghihoithao', 'Hội nghị/hội thảo'],
                    ['hoithaoquocte', 'Hội thảo quốc tế'],
                    ['kyyeuhoinghi', 'Kỷ yếu/hội nghị'],
                    ['sangkien', 'Sáng kiến'],
                    ['tapchiquocgia', 'Tạp chí trong nước'],
                    ['tapchiquocte', 'Tạp chí quốc tế'],
                    ['thongtinsach', 'Sách'],
                    ['vanbangsangche', 'Văn bằng sáng chế']]],
                ['lichgiang', 'Lịch giảng', 'fa fa-calendar', [
                    ['lichgiang', 'Lịch giảng'],
                    ['lichgiangadmin', 'Lịch giảng (quản trị)'],
                    ['lichgiangdaotao', 'Đào tạo xử lý đổi lịch'],
                    ['lichgiangkhoa', 'Lịch giảng của khoa'],
                    ['lichgiangphonghoc', 'Lịch giảng theo phòng học'],
                    ['lichgiangnhieuphonghoc', 'Lịch giảng nhiều phòng học'],
                    ['lichgiangnhieuphonghocgiangvien', 'Lịch giảng nhiều phòng học (giảng viên)'],
                    ['duyetbuoihoc', 'Khoa duyệt buổi học thực tế'],
                    ['khoiluongcanhan', 'Khối lượng cá nhân'],
                    ['khoaxemkhoiluongcanhan', 'Khoa xem khối lượng cá nhân'],
                    ['nguoihoc', 'Người học'],
                    ['nguoihoctheokhoa', 'Người học theo khoa']]],
                ['phanlichgiang', 'Phân lịch giảng', 'fa fa-calendar-check-o', [
                    ['phanlichgiang', 'Phân lịch giảng'],
                    ['tracuulichgiang', 'Tra cứu lịch giảng'],
                    ['dulieuchamthi', 'Dữ liệu chấm thi'],
                    ['dulieuchamthiv2', 'Dữ liệu chấm thi (v2)']]],
                ['nhapdiem', 'Nhập điểm', 'fa fa-pencil-square-o', [
                    ['nhapdiem', 'Nhập điểm'],
                    ['nhapdiemchamkiemtra', 'Nhập điểm chấm kiểm tra'],
                    ['nhapdiemdst', 'Nhập điểm DST'],
                    ['nhapdiemdstbc', 'Nhập điểm DST (báo cáo)'],
                    ['nhapdiemphuckhao', 'Nhập điểm phúc khảo'],
                    ['nhapdiemrenluyen', 'Nhập điểm rèn luyện'],
                    ['phuckhao', 'Phúc khảo'],
                    ['duyetchuyendiem', 'Duyệt chuyển điểm'],
                    ['inbangdiem', 'In bảng điểm'],
                    ['lichchamthi', 'Lịch chấm thi'],
                    ['lichhoc', 'Lịch học'],
                    ['tuibai', 'Túi bài']]],
                ['thi', 'Thi', 'fa fa-file-text-o', [
                    ['xemlichcoithi', 'Lịch phân công coi thi'],
                    ['coithi', 'Coi thi'],
                    ['phancoithi', 'Phân coi thi'],
                    ['sotheodoiphancoithi', 'Sổ theo dõi phân coi thi'],
                    ['chamthi', 'Chấm thi'],
                    ['phanchamthi', 'Phân chấm thi'],
                    ['chamtui', 'Chấm túi'],
                    ['phanchamtui', 'Phân chấm túi'],
                    ['phanphuckhao', 'Phân phúc khảo'],
                    ['baocao', 'Báo cáo thi']]],
                ['coithi', 'Coi thi, chấm thi', 'fa fa-check-square-o', [
                    ['coithi', 'Coi thi'],
                    ['chamthituluan', 'Chấm thi tự luận'],
                    ['duyetdiemthitracnghiem', 'Duyệt điểm thi trắc nghiệm'],
                    ['GV-5-quanlythi-01', 'Quản lý thi'],
                    ['GV-7-pheduyetdiem', 'Phê duyệt điểm']]],
                ['klgd', 'Khối lượng giảng dạy', 'fa fa-tasks', [
                    ['phanconggiangday', 'Phân công giảng dạy'],
                    ['tonghopkhoiluong', 'Tổng hợp khối lượng'],
                    ['tuychinhkhoiluong', 'Tuỳ chỉnh khối lượng'],
                    ['khoiluongnckh', 'Khối lượng NCKH'],
                    ['thanhtoangiangday', 'Thanh toán giảng dạy'],
                    ['taclop', 'Tách lớp'],
                    ['duyetdulieutach', 'Duyệt dữ liệu tách'],
                    ['thietlapthoigian', 'Thiết lập thời gian'],
                    ['donvigiangvien', 'Đơn vị giảng viên'],
                    ['danhmucdinhmuc', 'Danh mục định mức'],
                    ['danhmucmiengiam', 'Danh mục miễn giảm'],
                    ['dinhmucmiengiam', 'Định mức miễn giảm'],
                    ['qlklgd_phanconggiangday', 'QL: Phân công giảng dạy'],
                    ['qlklgd_nhapkhoiluong', 'QL: Nhập khối lượng'],
                    ['qlklgd_tonghopkhoiluong', 'QL: Tổng hợp khối lượng'],
                    ['qlklgd_tonghopkhoiluong_giangvien', 'QL: Tổng hợp khối lượng giảng viên'],
                    ['qlklgd_tuychinhkhoiluong', 'QL: Tuỳ chỉnh khối lượng'],
                    ['qlklgd_taclop', 'QL: Tách lớp'],
                    ['qlklgd_duyetdulieutach', 'QL: Duyệt dữ liệu tách'],
                    ['qlklgd_thietlapthoigian', 'QL: Thiết lập thời gian'],
                    ['qlklgd_donvigiangvien', 'QL: Đơn vị giảng viên'],
                    ['qlklgd_danhmucdinhmuc', 'QL: Danh mục định mức'],
                    ['qlklgd_danhmucmiengiam', 'QL: Danh mục miễn giảm'],
                    ['qlklgd_dinhmucmiengiam', 'QL: Định mức miễn giảm'],
                    ['qlklgd_dongia', 'QL: Đơn giá'],
                    ['qlklgd_hesolopdong', 'QL: Hệ số lớp đông'],
                    ['qlklgd_quanlydongbodulieu', 'QL: Đồng bộ dữ liệu']]],
                ['luanvan', 'Luận văn', 'fa fa-book', [
                    ['giaodetai', 'Giao đề tài'],
                    ['duyetdetai', 'Duyệt đề tài'],
                    ['duyetdexuat', 'Duyệt đề xuất'],
                    ['dexuathoidong', 'Đề xuất hội đồng'],
                    ['duyethoidong', 'Duyệt hội đồng'],
                    ['gvhdxacnhan', 'GVHD xác nhận'],
                    ['khoaphanbien', 'Khoa phân phản biện'],
                    ['pbxacnhan', 'Phản biện xác nhận']]],
                ['hoatdong', 'Hoạt động đào tạo', 'fa fa-cubes', [
                    ['cthp', 'Chương trình học phần'],
                    ['dukienhocphan', 'Dự kiến học phần'],
                    ['phangiangvien', 'Phân giảng viên'],
                    ['duyet1cua', 'Duyệt một cửa'],
                    ['DaQHHT', 'Khởi tạo định danh']]],
                ['thoikhoabieusinhvien', 'Thời khoá biểu sinh viên', 'fa fa-table', [
                    ['lichhoc', 'Lịch học'],
                    ['lichthi', 'Lịch thi']]],
                ['thongtinsinhvien', 'Thông tin sinh viên', 'fa fa-credit-card', [['thanhtoanonline', 'Thanh toán online']]],
                ['dangky', 'Đăng ký', 'fa fa-edit', [['canbodangkynganh2', 'Cán bộ đăng ký ngành']]],
                ['dgplnguoilaodong', 'Đánh giá người lao động', 'fa fa-star-half-o', [
                    ['phieudanhgia', 'Phiếu đánh giá'],
                    ['phieudanhgiacanbo', 'Phiếu đánh giá cán bộ'],
                    ['ketqua', 'Kết quả đánh giá']]],
                ['khaosat', 'Khảo sát', 'fa fa-question-circle', [
                    ['kehoach', 'Kế hoạch khảo sát'],
                    ['phieu', 'Phiếu khảo sát']]],
                ['sukien', 'Sự kiện', 'fa fa-bullhorn', [
                    ['kehoach', 'Kế hoạch sự kiện'],
                    ['sukien', 'Sự kiện'],
                    ['theodoi', 'Theo dõi sự kiện']]],
                ['tintuc', 'Tin tức, văn bản', 'fa fa-newspaper-o', [
                    ['tintuc', 'Tin tức'],
                    ['vanban', 'Văn bản, quy định, biểu mẫu']]],
                ['thongke', 'Thống kê', 'fa fa-bar-chart', [
                    ['chuyencan', 'Chuyên cần'],
                    ['giangduong', 'Giảng đường'],
                    ['henganh', 'Hệ ngành'],
                    ['ketquakhaosat', 'Kết quả khảo sát'],
                    ['ketquakhaosatadmin', 'Kết quả khảo sát (quản trị)'],
                    ['nhapdiemhocphan', 'Nhập điểm học phần'],
                    ['nhapdiemlichthi', 'Nhập điểm lịch thi'],
                    ['nhapdiemlophocphan', 'Nhập điểm lớp học phần'],
                    ['phodiem', 'Phổ điểm']]],
                ['baocao', 'Báo cáo', 'fa fa-print', [['baocao', 'Báo cáo']]],
                ['dashboard', 'Bảng điều khiển', 'fa fa-dashboard', [['dashboard', 'Bảng điều khiển']]],
                ['Dashboardv2', 'Bảng điều khiển v2', 'fa fa-area-chart', [
                    ['giang-vien', 'Giảng viên'],
                    ['giao-vu-khoa', 'Giáo vụ khoa'],
                    ['lanh-dao-khoa', 'Lãnh đạo khoa'],
                    ['lanh-dao-phong-dt', 'Lãnh đạo Phòng Đào tạo'],
                    ['lanh-dao-phong-ctsv', 'Lãnh đạo Phòng CTSV'],
                    ['lanh-dao-phong-khao-thi', 'Lãnh đạo Phòng Khảo thí'],
                    ['lanh-dao-phong-tckt', 'Lãnh đạo Phòng TCKT'],
                    ['bgh', 'Ban giám hiệu'],
                    ['sinh-vien', 'Sinh viên']]]
            ], null, { prefix: 'CCB', app: 'ApisCongCanBo' })
        },

        /* Cây chức năng của vai trò "Tài chính" — phẳng, đúng như máy chủ trả.
           MAUNGDUNG + DUONGDANFILE ghép lại đúng như hệ cũ nạp tệp
           (Core/systemroot.js:1002): ApisTaiChinh + /Modules/…/html/x.html.
           Vỏ mới tìm tệp ở _v2/<MAUNGDUNG><DUONGDANFILE>.

           Đủ 73 màn hình của ApisTaiChinh, nhóm theo module. ID chức năng
           dạng  TC-<module>-<tệp>  để mở thẳng khi thử:
               #/r/R33/TC-danhmucheso-khoanthu
           Tên chức năng thật nằm trong DB; tên dưới đây đặt theo tên tệp.
           TENANH để nguyên cú pháp Font Awesome 4 như trong DB thật.        */
        menu: buildMenu([
            ['danhmucheso', 'Khai báo danh mục, hệ số', 'fa fa-cogs', [
                ['khoanthu', 'Khai báo các khoản thu'],
                ['hethonghoadon', 'Khai báo hệ thống hoá đơn'],
                ['hethongbienlai', 'Khai báo hệ thống biên lai'],
                ['hethongphieuthu', 'Khai báo hệ thống phiếu thu'],
                ['taikhoanno', 'Khai báo TK Nợ, TK Có'],
                ['danhmucnganhang', 'Danh mục ngân hàng'],
                ['kyhieuchuongtrinh', 'Khai báo ký hiệu chương trình'],
                ['khongbatno', 'Thiết đặt không bắt nợ theo đợt'],
                ['kehoachthuchi', 'Kế hoạch thu chi'],
                ['apdungcongthucphi', 'Áp dụng công thức phí'],
                ['donviphimoi', 'Đơn vị phí'],
                ['donviphimoict', 'Đơn vị phí theo chương trình'],
                ['donviphimoihp', 'Đơn vị phí theo học phần'],
                ['donviphimoilop', 'Đơn vị phí theo lớp'],
                ['mucdonviphi', 'Mức đơn vị phí'],
                ['mucphi', 'Mức phí'],
                ['mucphilop', 'Mức phí theo lớp'],
                ['mucphinienche', 'Mức thu niên chế'],
                ['mucphisotien', 'Mức phí theo số tiền'],
                ['hesohocphan', 'Hệ số học phần'],
                ['hesohocphanmoi', 'Hệ số học phần (mới)'],
                ['hesolophocphan', 'Hệ số lớp học phần'],
                ['hocphansotien', 'Đơn giá học phần'],
                ['hocphansotienmoi', 'Đơn giá học phần (mới)'],
                ['lophocphan', 'Học phí lớp học phần'],
                ['loprieng', 'Áp dụng riêng theo lớp'],
                ['sothangkhonghoc', 'Số tháng không học'],
                ['sothangtinhtien', 'Số tháng tính tiền']
            ]],
            ['khaidonviphi', 'Khai báo đơn vị phí', 'fa fa-tags', [
                ['donviphikhoa', 'Đơn vị phí theo khoá'],
                ['donviphilop', 'Đơn vị phí theo lớp'],
                ['dongiatheodai', 'Đơn giá theo dải']
            ]],
            ['miengiam', 'Miễn giảm', 'fa fa-percent', [
                ['dinhmucmiengiam', 'Định mức miễn giảm'],
                ['hesodoituong', 'Hệ số đối tượng'],
                ['mucmiengiammoi', 'Mức miễn giảm'],
                ['miengiammotphan', 'Miễn giảm một phần'],
                ['miengiamtoanphan', 'Miễn giảm toàn phần'],
                ['sinhvien_miengiam', 'Sinh viên miễn giảm'],
                ['sinhvienmiengiammoi', 'Sinh viên miễn giảm (mới)'],
                ['sinhviensotienmien', 'Số tiền miễn giảm của sinh viên']
            ]],
            ['dulieuhocphi', 'Tính học phí', 'fa fa-layer-group', [
                ['cauhinhtinhphi', 'Cấu hình tính phí'],
                ['tinhhocphi', 'Tính học phí'],
                ['chottinhphi', 'Chốt tính phí'],
                ['hopdong', 'Hợp đồng'],
                ['phanbodoanhthu', 'Phân bổ doanh thu'],
                ['chuyendulieuketoan', 'Chuyển dữ liệu kế toán']
            ]],
            ['giahanthu', 'Kế hoạch thu', 'fa fa-calendar', [
                ['kehoach', 'Kế hoạch thu - gia hạn thu']
            ]],
            ['phieuthu', 'Thu tiền', 'fa fa-exchange', [
                ['thutien', 'Thu tiền'],
                ['thutienkhac', 'Thu tiền khác'],
                ['pos_thutien', 'Thu tiền qua POS'],
                ['viewthutien', 'Xem thu tiền'],
                ['gachnotructiep', 'Gạch nợ trực tiếp'],
                ['sinhviennotien', 'Sinh viên còn nợ'],
                ['tracuusophieuthu', 'Tra cứu phiếu thu'],
                ['import_phainop', 'Import khoản phải nộp'],
                ['import_danop', 'Import khoản đã nộp'],
                ['import_phantrammiengiam', 'Import phần trăm miễn giảm'],
                ['import_sotienmiengiam', 'Import số tiền miễn giảm']
            ]],
            ['phieurut', 'Rút tiền', 'fa fa-money-bill', [
                ['ruttien', 'Phiếu rút tiền']
            ]],
            ['hoadon', 'Hoá đơn', 'fa fa-file-text', [
                ['xuathoadon', 'Xuất hoá đơn'],
                ['xuatlohoadon', 'Xuất lô hoá đơn'],
                ['xuathoadonkhac', 'Xuất hoá đơn khác'],
                ['hoadonnhap', 'Hoá đơn nháp'],
                ['xuatchungtu', 'Xuất chứng từ'],
                ['tracuusohoadon', 'Tra cứu số hoá đơn']
            ]],
            ['bienlai', 'Biên lai', 'fa fa-book', [
                ['tracuusobienlai', 'Tra cứu số biên lai']
            ]],
            ['chungtu', 'Chứng từ', 'fa fa-files-o', [
                ['chungtu', 'Chứng từ']
            ]],
            ['tracuu', 'Tra cứu', 'fa fa-search', [
                ['tracuuthongtinnoptienvnpay', 'Tra cứu nộp tiền VNPAY']
            ]],
            ['thongke', 'Thống kê', 'fa fa-bar-chart', [
                ['theodoicongno', 'Theo dõi công nợ'],
                ['tonghoptaichinh', 'Tổng hợp tài chính'],
                ['hachtoantaichinh', 'Hạch toán tài chính']
            ]],
            ['baocao', 'Báo cáo', 'fa fa-file-text', [
                ['baocao', 'Báo cáo tài chính']
            ]],
            ['hoatdong', 'Chương trình học phần', 'fa fa-list-alt', [
                ['cthp', 'Xem chương trình đào tạo']
            ]],
            ['danhmuc', 'Danh mục', 'fa fa-database', [
                ['danhmucdulieu', 'Danh mục dữ liệu']
            ]]
        ], [
            /* Hai trường hợp có thật trong dữ liệu máy chủ, giữ ở đây để
               kiểm được cách dựng menu (xem buildTree trong app.js):
               · mục MỒ CÔI: cha 'G-khongduoccap' không nằm trong danh sách
                 được cấp quyền → hệ cũ bỏ hẳn, bản mới gom vào nhóm "Khác"
               · mục #dashboard: hệ cũ dựng rồi display:none                */
            cn('TC-mocoi', 'Chức năng cha không được cấp', 'G-khongduoccap', 1,
               'ApisTaiChinh:/Modules/thongke/html/tonghoptaichinh.html'),
            /* Mục TẦNG 3 (cha là một mục con) — index.aspx của hệ cũ bỏ hẳn,
               indexi.aspx thì vẽ. Bản mới vẽ đủ mọi tầng. */
            cn('TC-thongke-congno-dot', 'Công nợ theo đợt', 'TC-thongke-theodoicongno', 1,
               'ApisTaiChinh:/Modules/thongke/html/theodoicongno.html'),
            { ID: 'C-dash', TENCHUCNANG: 'Dashboard', TENANH: 'fa fa-gauge', CHUCNANGCHA_ID: '',
              THUTUHIENTHI: 98, MAUNGDUNG: '', DUONGDANFILE: '', DUONGDANHIENTHI: '#dashboard' },

            // Màn hình MẪU dữ liệu cứng trong _v2/screens/ (api.demoScreens)
            cn('M1', 'Kế hoạch tổ chức đăng ký mua', 'GM', 1, 'ApisDangKyHoc:/Modules/kehoachdangkymuabaohiem/html/kehoachmua.html'),
            cn('M2', 'Kế hoạch hoạt động tài chính', 'GM', 2, 'ApisTaiChinh:/Modules/kehoach/html/kehoachtaichinh.html'),
            cn('M3', 'Tổng quan thu', 'GM', 3, 'ApisTaiChinh:/Modules/thongke/html/tongquanthu.html')
        ]),

        /* Dữ liệu mẫu cho lời gọi API của màn hình — chỉ dùng ở chế độ dựng
           thử (ums.api tra theo func, rồi action#strMaBangDanhMuc, rồi
           action). Tên cột lấy từ tệp .js gốc của từng màn hình.          */
        fixtures: {
            /* --- Danh mục dùng chung --- */
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.MAUIN': [
                dm('MI1', 'HDDT', 'Hoá đơn điện tử', 'Loại mẫu in'), dm('MI2', 'HDGTGT', 'Hoá đơn giá trị gia tăng', 'Loại mẫu in'), dm('MI3', 'BL', 'Biên lai thu tiền', 'Loại mẫu in')
            ],
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.HTTHU': [
                dm('HT1', 'TM', 'Tiền mặt'), dm('HT2', 'CK', 'Chuyển khoản'), dm('HT3', 'POS', 'Quẹt thẻ POS'), dm('HT4', 'VNPAY', 'Cổng VNPAY')
            ],
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.LOKT': [
                dm('NK1', 'HP', 'Học phí'), dm('NK2', 'LP', 'Lệ phí'), dm('NK3', 'BH', 'Bảo hiểm'), dm('NK4', 'KTX', 'Ký túc xá')
            ],
            'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.DVT': [
                dm('DV1', 'TC', 'Tín chỉ'), dm('DV2', 'HK', 'Học kỳ'), dm('DV3', 'THANG', 'Tháng'), dm('DV4', 'LAN', 'Lần')
            ],

            /* --- Hệ thống hoá đơn / biên lai / phiếu thu --- */
            'TC_HoaDon/LayDanhSach': [
                { ID: 'HD1', MAUSO: '1', KYHIEU: 'C26TAA', NAMAPDUNG: '2026', MAUIN_ID: 'MI1', SUPPLIERTAXCODE: '0101234567', DODAIHOADON: 7, SOKHOITAOBANDAU: 1, SODIENTHOAI: '024 3869 1234', DIACHI: 'Số 1 Đại Cồ Việt, Hà Nội' },
                { ID: 'HD2', MAUSO: '1', KYHIEU: 'C25TAA', NAMAPDUNG: '2025', MAUIN_ID: 'MI1', SUPPLIERTAXCODE: '0101234567', DODAIHOADON: 7, SOKHOITAOBANDAU: 1, SODIENTHOAI: '024 3869 1234', DIACHI: 'Số 1 Đại Cồ Việt, Hà Nội' },
                { ID: 'HD3', MAUSO: '2', KYHIEU: 'K26TBB', NAMAPDUNG: '2026', MAUIN_ID: 'MI2', SUPPLIERTAXCODE: '0101234567', DODAIHOADON: 8, SOKHOITAOBANDAU: 1001, SODIENTHOAI: '', DIACHI: '' }
            ],
            'TC_BienLai/LayDanhSach': [
                { ID: 'BL1', MAUSO: '01BLP', KYHIEUQUYEN: 'AA/26', NAM: '2026', MAUIN_ID: 'MI3', SOBIENLAITRONGQUYEN: 50, DODAIQUYEN: 4, DODAIBIENLAI: 7, SOKHOITAOBANDAU: 1 },
                { ID: 'BL2', MAUSO: '01BLP', KYHIEUQUYEN: 'AB/26', NAM: '2026', MAUIN_ID: 'MI3', SOBIENLAITRONGQUYEN: 100, DODAIQUYEN: 4, DODAIBIENLAI: 7, SOKHOITAOBANDAU: 1 }
            ],
            'TC_PhieuThu/LayDanhSach': [
                { ID: 'PT1', MAUSO: 'C40-BB', KYHIEUQUYEN: 'PT26', NAM: '2026', MAUIN_ID: 'MI3', SOPHIEUTHUTRONGQUYEN: 100, DODAIQUYEN: 3, DODAIPHIEUTHU: 6, SOKHOITAOBANDAU: 1, SODIENTHOAI: '024 3869 1234', DIACHI: 'Phòng Tài vụ' }
            ],

            /* --- Khoản thu --- */
            'TC_KhoanThu/LayDanhSach': function (o) { return like(KHOANTHU, o.strTuKhoa, ['MA', 'TEN'], 'NHOMCACKHOANTHU_ID', o.strNhomCacKhoanThu_Id); },
            'TC_KhoanThu/LayChiTiet': function (o) { return KHOANTHU.filter(function (r) { return r.ID === o.strId; }); },
            'pkg_taichinh_thuchi.LayDSCacKhoanThu': function () { return KHOANTHU; },
            'pkg_taichinh_kehoach.LayDSTC_KhoanThu_QDXuatHD': function (o) {
                return o.strTaiChinh_CacKhoanThu_Id === 'KT1' ? [
                    { ID: 'QD1', NAM: 2025, NGAYBATDAU: '01/09/2025', NGAYKETTHUC: '31/12/2025' },
                    { ID: 'QD2', NAM: 2026, NGAYBATDAU: '01/01/2026', NGAYKETTHUC: '30/06/2026' }
                ] : [];
            },

            /* --- TK Nợ / Có --- */
            'pkg_taichinh_ketoan.LayDMucAPI_DoiTac': [
                { ID: 'DT1', TENDOITAC: 'Ngân hàng BIDV' }, { ID: 'DT2', TENDOITAC: 'Ngân hàng Vietcombank' }, { ID: 'DT3', TENDOITAC: 'VNPAY' }
            ],
            'pkg_taichinh_ketoan.LayDSAPI_KeToan_Khoan_HT': function (o) {
                return TKNO.filter(function (r) {
                    return (!o.strTaiChinh_CacKhoanThu_Id || r.TAICHINH_CACKHOANTHU_ID === o.strTaiChinh_CacKhoanThu_Id) &&
                        (!o.strAPI_DoiTac_Id || r.API_DOITAC_ID === o.strAPI_DoiTac_Id) &&
                        (!o.strHinhThucThu_Id || r.HINHTHUCTHU_ID === o.strHinhThucThu_Id);
                });
            },

            /* --- Danh mục ngân hàng --- */
            'pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc': function (o) {
                return like([
                    { ID: 'NH1', MA: 'BIDV', THONGTIN1: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', TRANGTHAI: 1 },
                    { ID: 'NH2', MA: 'VCB', THONGTIN1: 'Ngân hàng TMCP Ngoại thương Việt Nam', TRANGTHAI: 1 },
                    { ID: 'NH3', MA: 'CTG', THONGTIN1: 'Ngân hàng TMCP Công thương Việt Nam', TRANGTHAI: 0 },
                    { ID: 'NH4', MA: 'AGR', THONGTIN1: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn', TRANGTHAI: 1 }
                ], o.strTuKhoa, ['MA', 'THONGTIN1']);
            }
        }
    };

    /* ---------- Bảng dùng chung cho nhiều lời gọi --------------------------- */
    var KHOANTHU = [
        kt('KT1', 'HP', 'Học phí', 'NK1', 'Học phí', 1, 1, { TINHPHITUDONG: 1, XUATHOADONTUDONG: 1, KIEMTRANOKHIXETTOTNGHIEP: 1, KIEMTRANOKHIDANGKYHOC: 1, VAT: 0 }),
        kt('KT2', 'HPHL', 'Học phí học lại', 'NK1', 'Học phí', 2, 2, { TINHPHITUDONG: 1, TINHPHITUDONGLOPRIENG: 1 }),
        kt('KT3', 'LPTN', 'Lệ phí tốt nghiệp', 'NK2', 'Lệ phí', 3, 5, { KHOANTHURIENG: 1, VAT: 8 }),
        kt('KT4', 'BHYT', 'Bảo hiểm y tế', 'NK3', 'Bảo hiểm', 4, 3, { KHONGXUATHOADON: 1 }),
        kt('KT5', 'KTX', 'Phí ký túc xá', 'NK4', 'Ký túc xá', 5, 4, { KHOANNOPTRUOC: 1, VAT: 10 })
    ];

    var TKNO = [
        { ID: 'TK1', TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', TAICHINH_CACKHOANTHU_MA: 'HP', HINHTHUCTHU_ID: 'HT2', HINHTHUCTHU_TEN: 'Chuyển khoản', HINHTHUCTHU_MA: 'CK', API_DOITAC_ID: 'DT1', API_DOITAC_TEN: 'Ngân hàng BIDV', KETOAN_TAIKHOANNO: '1121', KETOAN_TAIKHOANCO: '5111' },
        { ID: 'TK2', TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Học phí', TAICHINH_CACKHOANTHU_MA: 'HP', HINHTHUCTHU_ID: 'HT1', HINHTHUCTHU_TEN: 'Tiền mặt', HINHTHUCTHU_MA: 'TM', API_DOITAC_ID: '', API_DOITAC_TEN: '', KETOAN_TAIKHOANNO: '1111', KETOAN_TAIKHOANCO: '5111' },
        { ID: 'TK3', TAICHINH_CACKHOANTHU_ID: 'KT5', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', TAICHINH_CACKHOANTHU_MA: 'KTX', HINHTHUCTHU_ID: 'HT4', HINHTHUCTHU_TEN: 'Cổng VNPAY', HINHTHUCTHU_MA: 'VNPAY', API_DOITAC_ID: 'DT3', API_DOITAC_TEN: 'VNPAY', KETOAN_TAIKHOANNO: '1131', KETOAN_TAIKHOANCO: '5118' }
    ];

    /* ---------- Hàm dựng dữ liệu ------------------------------------------- */
    function cn(id, ten, cha, thuTu, file, icon) {
        var app = '', path = file;
        if (file.indexOf(':') > 0) { app = file.split(':')[0]; path = file.split(':')[1]; }
        // Mã hiển thị (DUONGDANHIENTHI) — bảng điều khiển mở Tin tức bằng mã "#tintuc" (ums.app.openHash)
        var ma = /\/tintuc\/html\/tintuc\.html$/.test(path) ? '#tintuc' : '';
        return { ID: id, TENCHUCNANG: ten, TENANH: icon || '', CHUCNANGCHA_ID: cha, THUTUHIENTHI: thuTu, MAUNGDUNG: app, DUONGDANFILE: path, DUONGDANHIENTHI: ma };
    }

    /* Hai cột cấu hình theo từng chức năng của bảng chức năng, có thật trong
       DB nên để ở đây cho giống:
         THONGTINKHONGHIENTHI  ẩn/khoá phần tử của màn (Core:6564)
         DUONGDANHUONGDANSUDUNG  đường dẫn hướng dẫn sử dụng (nút ? ở breadcrumb) */
    /* Khai bằng FUNCTION chứ không phải var: buildMenu chạy ngay trong lúc
       dựng object ums.demo, tức trước mọi lệnh gán `var` phía dưới. */
    function cauHinhChucNang(id) {
        return ({
            'TC-danhmucheso-danhmucnganhang': {
                THONGTINKHONGHIENTHI: '{"me":".ums-page__actions","readonly":"[data-cf][data-scope=\'filter\']"}',
                DUONGDANHUONGDANSUDUNG: 'https://example.com/huong-dan/danh-muc-ngan-hang'
            }
        })[id];
    }

    /** Dựng cây phẳng: mỗi module một nhóm, mỗi tệp một chức năng.
        opt = { prefix, app } cho phân hệ khác Tài chính (mặc định TC / ApisTaiChinh) */
    function buildMenu(groups, extra, opt) {
        var prefix = (opt && opt.prefix) || 'TC', app = (opt && opt.app) || 'ApisTaiChinh';
        var list = [cn('C00', 'Trang chủ', '', 0, '', 'fa fa-home')];
        groups.forEach(function (g, gi) {
            var gid = (opt ? 'G-' + prefix + '-' : 'G-') + g[0];
            list.push(cn(gid, g[1], '', gi + 1, '', g[2]));
            g[3].forEach(function (s, si) {
                list.push(cn(prefix + '-' + g[0] + '-' + s[0], s[1], gid, si + 1,
                    app + ':/Modules/' + g[0] + '/html/' + s[0] + '.html'));
            });
        });
        if (!opt) list.push(cn('GM', 'Màn hình mẫu (dữ liệu cứng)', '', 99, '', 'fa fa-flask'));
        list.forEach(function (x) {
            var c = cauHinhChucNang(x.ID);
            if (c) Object.keys(c).forEach(function (k) { x[k] = c[k]; });
        });
        return list.concat(extra || []);
    }

    /* CHUNG_TENDANHMUC_TEN = tên bảng danh mục do quản trị nhập; hệ cũ lấy
       cột này làm nhãn "Chọn …" của ô chọn (xem ums.pat.dmTitle). Dữ liệu mẫu
       gắn kèm để thử được nhãn đó ngay trên máy. */
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || "" }; }

    /* Màn hình tự đăng ký dữ liệu mẫu của mình — tệp scripts/<tên>.demo.js
       nạp trước tệp chính:  ums.demo.add({ 'pkg_x.LayDS': [...] })
       Trùng khoá thì bản đăng ký sau thắng. Chạy với API thật thì bảng này
       không được đọc, nên nạp tệp .demo.js trên máy chủ cũng vô hại.      */
    ums.demo.add = function (fx) {
        Object.keys(fx || {}).forEach(function (k) { ums.demo.fixtures[k] = fx[k]; });
    };

    /* Kho dữ liệu mẫu cho một controller kiểu cũ <X>/LayDanhSach | LayChiTiet |
       ThemMoi | CapNhat | Xoa — để .demo.js của mỗi màn chỉ khai dòng mẫu:
           ums.demo.crudStore('NS_QT_KhamSucKhoe', [ {...}, {...} ], { map: fn(o) → dòng })
       map đổi tham số lưu (strX) thành cột (X) cho dòng mới; bỏ trống thì chỉ giữ ID.
       ThemMoi trả raw.Id như máy chủ thật (ums.crud dùng để gắn tệp đính kèm). */
    ums.demo.crudStore = function (ctrl, rows, opt) {
        opt = opt || {};
        var seq = rows.length + 1, fx = {};
        function merge(r, o) { var m = opt.map ? opt.map(o) : {}; Object.keys(m).forEach(function (k) { r[k] = m[k]; }); return r; }
        fx[ctrl + '/LayDanhSach'] = function (o) { return opt.list ? opt.list(rows, o) : rows.slice(); };
        fx[ctrl + '/LayChiTiet'] = function (o) { return rows.filter(function (r) { return r.ID === o.strId; }); };
        fx[ctrl + '/ThemMoi'] = function (o) {
            var id = ctrl.replace(/\W/g, '') + (seq++);
            rows.push(merge({ ID: id }, o));
            return { rows: [], raw: { Id: id } };
        };
        fx[ctrl + '/CapNhat'] = function (o) {
            rows.forEach(function (r) { if (r.ID === o.strId) merge(r, o); });
            return { rows: [], raw: { Id: o.strId } };
        };
        fx[ctrl + '/Xoa'] = function (o) {
            var ids = String(o.strIds || o.strId || '').split(',');
            for (var i = rows.length - 1; i >= 0; i--) if (ids.indexOf(rows[i].ID) >= 0) rows.splice(i, 1);
            return [];
        };
        ums.demo.add(fx);
    };

    /* ---------- Thủ vai — hộp "Nhập thông tin định danh" (ums.thuVai) --------- */
    var SV_THUVAI = [
        { ID: 'SV0001', NAME: '25001029', FULLNAME: 'Lăng Văn Huy - DCOT.16.2', EMAIL: '25001029@sv.edu.vn' },
        { ID: 'SV0002', NAME: '25001030', FULLNAME: 'Nguyễn Thị Lan - DCOT.16.2', EMAIL: '25001030@sv.edu.vn' },
        { ID: 'SV0003', NAME: '24002118', FULLNAME: 'Trần Minh Đức - DCKT.15.1', EMAIL: '24002118@sv.edu.vn' },
        { ID: 'SV0004', NAME: '23003305', FULLNAME: 'Phạm Thu Hà - DCCN.14.3', EMAIL: '23003305@sv.edu.vn' }
    ];
    ums.demo.add({
        'PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh': function (o) {
            var q = String(o.strThongTinDinhDanh || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
            return SV_THUVAI.filter(function (r) {
                var t = (r.ID + ' ' + r.NAME + ' ' + r.FULLNAME + ' ' + r.EMAIL).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
                return q && t.indexOf(q) >= 0;
            });
        }
    });

    /* ---------- Nhân sự — dùng chung cho các màn hồ sơ của Cổng cán bộ ------ */
    var NS_FILES = {};      // strDuLieu_Id → [{ ID, FILEMINHCHUNG, TENHIENTHI }]
    ums.demo.add({
        'pkg_nhansu_hoso_v2.LayDanhSachToanBo': [
            { ID: 'CC1', MA: 'KCNTT', TEN: 'Khoa Công nghệ thông tin', DAOTAO_COCAUTOCHUC_CHA_ID: '' },
            { ID: 'CC2', MA: 'BMHTTT', TEN: 'Bộ môn Hệ thống thông tin', DAOTAO_COCAUTOCHUC_CHA_ID: 'CC1' },
            { ID: 'CC3', MA: 'KKT', TEN: 'Khoa Kinh tế', DAOTAO_COCAUTOCHUC_CHA_ID: '' },
            { ID: 'CC4', MA: 'PDT', TEN: 'Phòng Đào tạo', DAOTAO_COCAUTOCHUC_CHA_ID: '' }
        ],
        'pkg_nhansu_quatrinh.ThietLapQuaTrinhCuoiCung': [],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.QUDI': [dm('QD1', 'BN', 'Bổ nhiệm'), dm('QD2', 'BNL', 'Bổ nhiệm lại'), dm('QD3', 'MN', 'Miễn nhiệm')],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.DMCV': [dm('CV1', 'GV', 'Giảng viên'), dm('CV2', 'PTK', 'Phó trưởng khoa'), dm('CV3', 'TK', 'Trưởng khoa'), dm('CV4', 'TBM', 'Trưởng bộ môn')],
        'NS_Files/LayDanhSach': function (o) { return NS_FILES[o.strDuLieu_Id] || []; },
        'NS_Files/ThemMoi': function (o) {
            var l = NS_FILES[o.strDuLieu_Id] || (NS_FILES[o.strDuLieu_Id] = []);
            l.push({ ID: 'F' + Date.now() + l.length, FILEMINHCHUNG: o.strFileMinhChung, TENHIENTHI: o.strTenHienThi });
            return [];
        },
        'NS_Files/Xoa': function (o) {
            Object.keys(NS_FILES).forEach(function (k) { NS_FILES[k] = NS_FILES[k].filter(function (f) { return f.ID !== o.strIds; }); });
            return [];
        }
    });

    /* ---------- Hộp chọn sinh viên (ums.pat.pickSinhVienNganh) — dùng chung ---
       Màn nào khai lại trong .demo.js riêng thì bản riêng thắng. */
    var SV_MAU = [
        ['NH01', 'BIT220101', 'Nguyễn Văn', 'An', '12/03/2004', 'K67-KTPM1'],
        ['NH02', 'BIT220102', 'Trần Thị', 'Bình', '05/07/2004', 'K67-KTPM1'],
        ['NH03', 'BBA220561', 'Lê Minh', 'Châu', '21/11/2004', 'K67-QTKD2'],
        ['NH04', 'BIT230210', 'Phạm Thu', 'Dung', '02/01/2005', 'K68-HTTT1']
    ];
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao': [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': [{ ID: 'L1', TEN: 'K67-KTPM1' }, { ID: 'L2', TEN: 'K67-QTKD2' }, { ID: 'L3', TEN: 'K68-HTTT1' }],
        /* Bản THEO QUYỀN (ums.ref.cascadeQuyen — genBoLoc_HeKhoa) */
        'pkg_kehoach_thongtin.LayDSKhoaQuanLyPhanQuyen': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen': [{ ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }],
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen': function (o) { return o.strDaoTao_HeDaoTao_Id ? [{ ID: 'K67', TENKHOA: 'Khóa 67' }, { ID: 'K68', TENKHOA: 'Khóa 68' }] : []; },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen': function (o) { return o.strDaoTao_KhoaDaoTao_Id ? [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }] : []; },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen': function (o) { return o.strDaoTao_ToChucCT_Id ? [{ ID: 'L1', TEN: 'K67-KTPM1' }, { ID: 'L2', TEN: 'K67-QTKD2' }] : []; },
        // Hộp chọn nhân sự (ums.pat.pickNhanSu) / lưới nhân sự
        'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2': function (o) {
            var rows = [
                { ID: 'NS1', MASO: 'CB001', HOTEN: 'Nguyễn Văn Hùng', HODEM: 'Nguyễn Văn', TEN: 'Hùng', LOAICHUCDANH_MA: 'PGS', LOAIHOCVI_MA: 'TS', NGAYSINH: 12, THANGSINH: 4, NAMSINH: 1975, GIOITINH_TEN: 'Nam', DAOTAO_COCAUTOCHUC_TEN: 'Ban Giám hiệu' },
                { ID: 'NS2', MASO: 'CB015', HOTEN: 'Trần Thị Mai', HODEM: 'Trần Thị', TEN: 'Mai', LOAICHUCDANH_MA: '', LOAIHOCVI_MA: 'ThS', NGAYSINH: 3, THANGSINH: 9, NAMSINH: 1988, GIOITINH_TEN: 'Nữ', DAOTAO_COCAUTOCHUC_TEN: 'Phòng Công tác sinh viên' },
                { ID: 'NS3', MASO: 'CB102', HOTEN: 'Lê Quang Minh', HODEM: 'Lê Quang', TEN: 'Minh', LOAICHUCDANH_MA: '', LOAIHOCVI_MA: 'TS', NGAYSINH: 21, THANGSINH: 1, NAMSINH: 1983, GIOITINH_TEN: 'Nam', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' }
            ];
            rows = like(rows, o.strTuKhoa, ['MASO', 'HOTEN']);
            return { rows: rows, pager: rows.length };
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TRANGTHAI': [dm('TT1', 'DH', 'Đang học'), dm('TT2', 'BL', 'Bảo lưu'), dm('TT3', 'TN', 'Đã tốt nghiệp')],
        'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh': function (o) {
            var rows = SV_MAU.map(function (x) {
                return { ID: 'SV' + x[0], QLSV_NGUOIHOC_ID: x[0], DAOTAO_TOCHUCCHUONGTRINH_ID: 'CTKTPM', QLSV_NGUOIHOC_MASO: x[1],
                    QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3], QLSV_NGUOIHOC_NGAYSINH: x[4], DAOTAO_LOPQUANLY_TEN: x[5],
                    DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', DAOTAO_KHOADAOTAO_TEN: 'Khóa 67', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học' };
            });
            rows = like(rows, o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_TEN', 'QLSV_NGUOIHOC_HODEM']);
            return { rows: rows, pager: rows.length };
        }
    });

    function kt(id, ma, ten, nhomId, nhomTen, thuTu, uuTien, flags) {
        var r = {
            ID: id, MA: ma, TEN: ten, NHOMCACKHOANTHU_ID: nhomId, NHOMCACKHOANTHU_TEN: nhomTen,
            MOTA: '', THUTU: thuTu, THUTUUUTIENGACHNO: uuTien, DONVITINH_ID: 'DV1', MATHANHTOANDINHDANH: '',
            NGAYTAO_DD_MM_YYYY_HHMMSS: '12/08/2026 09:1' + thuTu + ':00', TAIKHOAN_TENDAYDU: 'Nguyễn Thị Lan'
        };
        Object.keys(flags || {}).forEach(function (k) { r[k] = flags[k]; });
        return r;
    }

    /** Lọc theo từ khoá không dấu trên các cột, và theo một cột khoá nếu có */
    function like(rows, q, cols, keyCol, keyVal) {
        function norm(s) {
            return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
        }
        q = norm((q || '').trim());
        return rows.filter(function (r) {
            if (keyCol && keyVal && r[keyCol] !== keyVal) return false;
            return !q || cols.some(function (c) { return norm(r[c]).indexOf(q) >= 0; });
        });
    }

})(window);
