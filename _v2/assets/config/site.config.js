/* =========================================================================
   CẤU HÌNH WEBSITE — sửa ở ĐÂY, không cần mở tệp CSS nào
   =========================================================================

   Tệp này là nơi duy nhất cần chỉnh khi muốn đổi:
       · màu sắc          · logo và tên hệ thống
       · kích thước khung · phông chữ
       · màu nhóm vai trò · các dòng chữ cố định

   Cách hoạt động: `apply-config.js` đọc tệp này rồi ghi thẳng vào biến CSS
   trên thẻ <html>. Biến nội tuyến luôn thắng biến khai báo trong
   `settings/tokens.css`, nên chỉ cần khai báo thứ muốn đổi — bỏ trống thì
   dùng giá trị mặc định.

   Quy tắc đặt tên: mọi khoá trong `color` và `size` sẽ thành `--ums-<khoá>`.
       color.navy      →  --ums-navy
       size['sidebar-w'] →  --ums-sidebar-w

   Nạp trong <head> TRƯỚC khi vẽ trang nên không bị nháy màu.
   ========================================================================= */

window.UMS_CONFIG = {
  /* =====================================================================
       1. THƯƠNG HIỆU
       ===================================================================== */
  brand: {
    // Tên ngắn hiện cạnh logo trên thanh trên.
    // Để RỖNG là không hiện chữ nào — chỉ còn ô logo. Mỗi trường tự điền
    // tên viết tắt của mình ở đây (hoặc ở màn "Cài đặt giao diện").
    name: "",

    // Tên đầy đủ — dùng cho tiêu đề trang và thuộc tính title
    fullName: "Hệ thống quản trị đại học",

    // Logo. Ưu tiên `image` nếu có; không có thì dùng `icon` (Font Awesome).
    //   image: 'assets/img/logo.png'     → đặt tệp vào _v2/assets/img/
    //   icon : 'fa-light fa-graduation-cap'
    logo: {
      image: "assets/img/logo.png",
      background: "#223771",
      size: "55",
    },

    // Biểu tượng trên tab trình duyệt. Để null thì không đặt.
    favicon: null,

    // Dòng chữ ở chân cột trái. Để chuỗi rỗng thì ẩn luôn.
    footer: "Phiên bản dựng thử — 09/2026",
  },

  /* =====================================================================
       2. MÀU SẮC
       ---------------------------------------------------------------------
       Mỗi khoá thành một biến CSS `--ums-<khoá>`.
       Chỉ cần ghi khoá nào muốn đổi; khoá không ghi giữ giá trị mặc định
       trong settings/tokens.css.
       ===================================================================== */
  /* =====================================================================
       1b. NỀN TRANG (body)
       ---------------------------------------------------------------------
       Màu nền là `color.bg` ở dưới. Khối này thêm ẢNH nền đặt sau màu đó
       — để `image: null` là không dùng ảnh (mặc định).
           image      đường dẫn ảnh: 'assets/img/nen.jpg' hoặc URL
           size       cover | contain | auto | '100% auto'…
           position   'center' | 'top left'…
           repeat     'no-repeat' | 'repeat'
           attachment 'fixed' (ảnh đứng yên khi cuộn) | 'scroll'
           overlay    màu phủ LÊN ảnh cho chữ dễ đọc, vd 'rgba(238,241,251,.88)'
       ===================================================================== */
  background: {
    image: null,
    size: "cover",
    position: "center",
    repeat: "no-repeat",
    attachment: "fixed",
    overlay: null,
  },

  color: {
    /* --- Nền tối của khung (thanh trên + cột trái) --- */
    navy: "#223771",
    "navy-d": "#1b2c5b", // nền của nhóm menu đang mở
    "navy-l": "#2c4589",

    /* --- Màu nhấn chính --- */
    blue: "#0d6efd",
    "blue-d": "#0b5ed7", // trạng thái rê chuột
    "blue-l": "#e8f0ff", // nền nhạt của trạng thái đã chọn

    /* --- Màu mục đang chọn trong cây chức năng --- */
    "nav-active": "#f0913a",

    /* --- Nền chung --- */
    bg: "#eef1fb", // nền vùng nội dung
    surface: "#ffffff", // nền khung, thẻ, bảng

    /* --- Màu hành động --- */
    "act-add": "#198754",
    "act-save": "#22c55e",
    "act-edit": "#d99400",
    "act-del": "#df322b",

    /* --- Màu trạng thái --- */
    ok: "#12805c",
    warn: "#9a6a00",
    bad: "#c0392f",
  },

  /* =====================================================================
       3. KÍCH THƯỚC KHUNG
       ---------------------------------------------------------------------
       Mỗi khoá thành `--ums-<khoá>`. Nhớ ghi kèm đơn vị.
       ===================================================================== */
  size: {
    "topbar-h": "56px", // chiều cao thanh trên
    "sidebar-w": "280px", // chiều rộng cột chức năng
    "control-h": "38px", // chiều cao ô nhập và nút
    "control-h-sm": "32px", // chiều cao nút nhỏ, nút trong ô bảng

    "r-1": "6px", // bo góc nút, ô nhập
    "r-2": "10px", // bo góc khung, thẻ
    "r-3": "14px", // bo góc lớn
  },

  /* =====================================================================
       4. PHÔNG CHỮ
       ---------------------------------------------------------------------
       Giao diện đang chạy của hệ thống hiển thị Arial. Bộ Mulish đã có sẵn
       trong assets/fonts, đổi `family` là dùng được ngay, không cần tải thêm.
       ===================================================================== */
  font: {
    family: "Arial, Helvetica, sans-serif",
    // family: '"Mulish", Arial, Helvetica, sans-serif',   ← đổi sang Mulish

    // Cỡ chữ gốc của nội dung
    baseSize: "14px",
  },

  /* =====================================================================
       4b. TIỀN TỆ — định dạng số tiền trên MỌI màn (ums.ui.money, ums.pat.noCo, thanh "Tổng tiền đã chọn"…)
       ---------------------------------------------------------------------
       Chốt 2026-09-26 (người dùng): DẤU PHẨY ngăn nghìn, KHÔNG số lẻ — tiền Việt không có hàng lẻ; trùng
       edu.util.formatCurrency của hệ cũ và ô nhập tiền (ums.pat.money / pat.num đọc dấu phẩy).
       ⚠ NẾU MỘT LÚC NÀO ĐÓ LÀ USD (hay ngoại tệ có hàng lẻ): đổi `decimals: 2`, `unit: "USD"` (hoặc "$") —
       dấu phẩy ngăn nghìn + dấu CHẤM thập phân của 'en-US' vẫn đúng cho USD; ô nhập pat.money đã giữ phần
       thập phân sau dấu chấm. Kiểm thêm: cột số tiền ở máy chủ có nhận số lẻ không, và các chỗ làm tròn
       (Math.round) trong màn thu tiền / hoá đơn.
       ===================================================================== */
  money: {
    locale: "en-US",   // dấu phẩy ngăn nghìn, dấu chấm thập phân
    decimals: 0,       // VND: 0 · USD: 2
    unit: "đ",         // chữ sau số khi màn gọi ui.money(n, { donVi: true })
  },

  /* =====================================================================
       4c. CỔNG HELP — nút "?" cuối breadcrumb của MỌI màn
       ---------------------------------------------------------------------
       Bên Help chọn cách A (2026-09-26): MỘT mẫu link, Cổng Help tự tìm bài theo mã chức năng (không có bài thì
       Cổng Help tự chuyển về bài module / trang "chưa có nội dung"). Danh mục mã chức năng gửi họ: nút "Xuất mapping"
       ở màn Cài đặt. KHI BÊN HELP GỬI URL: điền `url` bên dưới (và `version` nếu họ quy định) — không phải sửa mã.
       Chỗ trống trong mẫu (tự mã hoá URL):
         {functionId}  ID chức năng trong CSDL (32 ký tự hex) — khoá chính của mapping
         {code}        MACHUCNANG        {app}      giá trị `app` dưới đây
         {subsystem}   vd ApisTaiChinh   {module}   vd danhmucheso        {screen}  tên tệp màn
         {version}     giá trị `version` {lang}     giá trị `lang`
       Để `url` rỗng: "?" vẫn hiện ở mọi màn, bấm thì báo hướng dẫn đang được xây dựng; chức năng nào đã có link riêng
       trong CSDL (cột DUONGDANHUONGDANSUDUNG) thì mở link đó. Có `url` rồi thì Cổng Help được ưu tiên.
       ===================================================================== */
  help: {
    url: "https://help.api-apis.com/mo?ma={functionId}&v={version}",   // Help đổi địa chỉ thì đổi ở đây (11/11: help.api-apis.com, bỏ /help-master)
    app: "UMS",          // mã ứng dụng bên Help đặt cho hệ này — mẫu link hiện không dùng
    version: "2",        // phiên bản phần mềm gửi sang Help: "2" = giao diện mới _v2
    lang: "vi",
    target: "_blank",    // "_blank" = mở tab mới

    /* Đăng nhập một lần (SSO) sang Cổng Help để SOẠN bài — mục "Soạn bài hướng
       dẫn" trong menu người dùng (thanh trên). Chỉ chạy trên máy chủ: trang
       help-sso.aspx phát JWT rồi POST sang Help (yeu-cau-sso-cho-doi-app.md).
       Địa chỉ Help, mã trường (iss), khoá ký nằm PHÍA MÁY CHỦ ở
       App_Data/help-sso/help-sso.json — không khai ở đây.
         page  : trang trung gian; rỗng = tắt mục menu
         roles : mã vai trò (MAUNGDUNG) được thấy mục này; "*" = mọi người đã
                 đăng nhập; [] = ẩn với mọi người. Help tự giới hạn quyền theo
                 mã vai trò gửi sang, nên "*" chỉ là ai THẤY nút, không phải ai sửa được. */
    sso: {
      page: "help-sso.aspx",
      roles: ["*"],
      text: "Soạn bài hướng dẫn",
    },
  },

  /* =====================================================================
       5. MÀU NHÓM VAI TRÒ (trang chủ)
       ---------------------------------------------------------------------
       Dùng cho ô biểu tượng và nhãn nhóm trên thẻ vai trò.
       Thêm nhóm mới: thêm một mục ở đây rồi khai báo trong `roleGroups`.
       ===================================================================== */
  tone: {
    blue: { fg: "#2563eb", bg: "#e8f0fe" },
    green: { fg: "#0f9d58", bg: "#e6f6ed" },
    purple: { fg: "#7c3aed", bg: "#f0e9fe" },
    amber: { fg: "#d99400", bg: "#fdf3dc" },
    red: { fg: "#e0455c", bg: "#fdeaed" },
    slate: { fg: "#64748b", bg: "#eef1f6" },
    /* 8/11 — màu 9 nhóm vai trò theo biên bản EAUT-APIS (fg = chữ / viền, bg = nền nhạt; giữ đúng GROUPS của index.aspx gốc) */
    pink: { fg: "#be185d", bg: "#fce7f3" },
    violet: { fg: "#6d28d9", bg: "#ede9fe" },
    orange: { fg: "#c2410c", bg: "#ffedd5" },
    emerald: { fg: "#15803d", bg: "#dcfce7" },
    azure: { fg: "#1d4ed8", bg: "#dbeafe" },
    cyan: { fg: "#0e7490", bg: "#cffafe" },
    fuchsia: { fg: "#a21caf", bg: "#fae8ff" },
    olive: { fg: "#4d7c0f", bg: "#ecfccb" },
    gray: { fg: "#6b7280", bg: "#f3f4f6" },
  },

  /* =====================================================================
       6. NHÓM VAI TRÒ
       ---------------------------------------------------------------------
       Thứ tự ở đây chính là thứ tự hiện trên trang chủ.
       `key` phải khớp với `g` của từng vai trò trong dữ liệu.
       ===================================================================== */
  roleGroups: [
    { key: "tuyensinh", name: "Quản lý tuyển sinh và sinh viên", tone: "pink" },
    { key: "daotao", name: "Quản lý đào tạo", tone: "violet" },
    { key: "khaothi", name: "Quản lý khảo thí", tone: "orange" },
    { key: "taichinh", name: "Quản lý tài chính và học phí", tone: "emerald" },
    { key: "cong", name: "Hệ thống cổng thông tin", tone: "azure" },
    { key: "mobile", name: "Ứng dụng di động", tone: "cyan" },
    { key: "nhansu", name: "Nhân sự", tone: "fuchsia" },
    { key: "quantri", name: "Quản trị hệ thống", tone: "olive" },
    { key: "khac", name: "Khác", tone: "gray" },
  ],

  /* =====================================================================
       6b. VAI TRÒ → NHÓM (tên chính xác) — 8/11, theo ROLE_GROUP của index.aspx gốc
       ---------------------------------------------------------------------
       Thứ tự ưu tiên khi xếp một vai trò (ums.nhomVaiTro.phanLoai):
         1) thẻ [nhom:mã] trong Mô tả vai trò (màn CMS "Cấu hình nhóm vai trò")
         2) bảng này: "Tên vai trò" → mã nhóm (không phân biệt hoa thường / dấu)
         3) roleRules (mục 9) theo từ khoá — dự phòng cho vai trò mới
         4) còn lại → "khac"
       Muốn chuyển vai trò sang nhóm khác: đổi mã nhóm cuối dòng. Tên gõ đúng như
       hiển thị trên thẻ. Danh mục dữ liệu "nhomvaitro" (CMS) ghi đè TÊN nhóm và
       thêm nhóm mới; mã có sẵn ở roleGroups giữ nguyên.
       ===================================================================== */
  roleGroupMap: {
    // 1. Quản lý tuyển sinh và sinh viên
    "Quản lý Tuyển Sinh": "tuyensinh",
    "Tạo kế hoạch tuyển sinh": "tuyensinh",
    "Tạo kế hoạch nhập học": "tuyensinh",
    "Thu hồ sơ nhập học": "tuyensinh",
    "Nhập học": "tuyensinh",
    "Thống kê nhập học": "tuyensinh",
    "Sinh viên": "tuyensinh",
    "Quản lý quyết định người học": "tuyensinh",
    "Chuyên cần": "tuyensinh",
    "Xét học bổng": "tuyensinh",
    "Điểm rèn luyện": "tuyensinh",
    "Ký túc xá": "tuyensinh",
    // 2. Quản lý đào tạo
    "Kế hoạch chương trình": "daotao",
    "Tra cứu chương trình đào tạo": "daotao",
    "Chốt số lượng lớp đặc thù": "daotao",
    "Đăng ký học": "daotao",
    "Học lại Thi Lại": "daotao",
    "Xử lý học vụ": "daotao",
    "Xét tốt nghiệp": "daotao",
    "In VBC-CC": "daotao",
    "Luận Văn, Luận Án": "daotao",
    "Nghiên cứu khoa học": "daotao",
    // 3. Quản lý khảo thí
    "Quản lý thi trắc nghiệm": "khaothi",
    "Thi phách": "khaothi",
    "Quản lý điểm": "khaothi",
    "Thống kê tiến độ nhập điểm": "khaothi",
    "Đăng ký thi lại": "khaothi",
    // 4. Quản lý tài chính và học phí
    "Tài chính": "taichinh",
    "Tài chính - tra cứu kết quả đăng ký học": "taichinh",
    "Tạo các mức phí nhập học": "taichinh",
    // 5. Hệ thống cổng thông tin
    "Cổng cán bộ": "cong",
    "Cổng cán bộ(admin)": "cong",
    "Cổng sinh viên - thủ vai": "cong",
    "Cổng thông tin khảo sát": "cong",
    "Dashboard": "cong",
    // 6. Ứng dụng di động
    "App Sinh viên": "mobile",
    // Nhóm phụ
    "Nhân sự": "nhansu",
    "Nhân sự 2026": "nhansu",
    "Thống kê giờ giảng": "nhansu",
  },

  /* =====================================================================
       7. CÁC DÒNG CHỮ CỐ ĐỊNH
       ===================================================================== */
  text: {
    searchPlaceholder: "Tìm kiếm chức năng",
    roleTitle: "Danh sách vai trò",
    roleSearchPlaceholder: "Tìm vai trò theo tên hoặc mã...",
    roleUnit: "vai trò",
    emptyRole: "Không tìm thấy vai trò nào",
    emptyData: "Không có dữ liệu",
    // Nhóm cuối menu, chứa chức năng có cha không được cấp quyền
    menuOther: "Khác",
    loading: "Đang tải…",
    // %s sẽ được thay bằng tên người dùng
    greetingMorning: "Chào buổi sáng, %s!",
    greetingAfternoon: "Chào buổi chiều, %s!",
    greetingEvening: "Chào buổi tối, %s!",
  },

  /* =====================================================================
       8. KẾT NỐI API
       ===================================================================== */
  api: {
    /* Nguồn dữ liệu:
             'auto' — có AXYZCLRVN() (tức đang chạy trên máy chủ) thì gọi API
                      thật, không có thì dùng dữ liệu dựng thử. Khuyến nghị.
             'api'  — luôn gọi API thật
             'demo' — luôn dùng dữ liệu dựng thử, không gọi mạng            */
    dataSource: "auto",

    // Trang đăng xuất. Để null thì tự suy ra từ đường dẫn hiện tại.
    logoutUrl: null,

    /* Các thủ tục dùng ở khung ngoài.
           `action` là chuỗi đã mã hoá, phải khớp đúng với microservice đang
           chạy — chép từ Core/systemroot.js của hệ hiện hành, đừng tự sửa. */
    endpoints: {
      // Danh sách vai trò của người đăng nhập
      roles: {
        action: "CMS_QuanTri01_MH/DSA4BRIXICgVMy4PJjQuKAU0LyYP",
        func: "PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung",
      },
      // Cây chức năng của một vai trò
      menu: {
        action: "CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJg8mNC4oBTQvJgPP",
        func: "PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung",
      },
    },

    /* MÀN HÌNH ĐÃ CHUYỂN ĐỔI — không cần khai ở đây.
           Vỏ mới nạp tệp theo đúng cây thư mục của dự án gốc:
               _v2/<MAUNGDUNG><DUONGDANFILE>
               vd  _v2/ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html
           Có tệp là chức năng tự bật; chưa có thì hiện "chưa chuyển đổi"
           kèm đường dẫn cần đặt tệp, KHÔNG nạp màn hình cũ.

           Bảng dưới chỉ dành cho các màn hình MẪU dữ liệu cứng trong
           _v2/screens/, và chỉ dùng ở chế độ dựng thử — chạy với API
           thật thì bị bỏ qua, để không lẫn dữ liệu mẫu vào dữ liệu thật.
           Khoá là một đoạn của DUONGDANFILE; giá trị là tên tệp trong
           _v2/screens/ (không kèm .html).                               */
    demoScreens: {
      "/kehoachdangkymuabaohiem/html/kehoachmua.html": "ke-hoach-mua",
      "/kehoach/html/kehoachtaichinh.html": "ke-hoach-tai-chinh",
      "/danhmuc/html/danhmucdulieu.html": "danh-muc",
      "/thongke/html/tongquanthu.html": "tong-quan",
    },
  },

  /* =====================================================================
       9. PHÂN NHÓM VAI TRÒ TỰ ĐỘNG — luật DỰ PHÒNG theo từ khoá (8/11: theo RULES của index.aspx gốc)
       ---------------------------------------------------------------------
       Chỉ dùng khi tên vai trò chưa có trong roleGroupMap (mục 6b) và chưa có
       thẻ [nhom:…] trong Mô tả; BIỂU TƯỢNG của thẻ vai trò luôn lấy từ đây
       (luật khớp tên đầu tiên), không phụ thuộc nhóm.

       Duyệt tuần tự, khớp đầu tiên thắng. Đặt luật cụ thể TRƯỚC luật chung.
       ===================================================================== */
  roleRules: [
    // Ưu tiên đặc biệt (tránh bị luật chung bên dưới nuốt mất)
    { kw: "phan quyen nhap diem", group: "quantri", icon: "fa-light fa-user-lock" },
    { kw: "phan quyen", group: "quantri", icon: "fa-light fa-shield-halved" },
    { kw: "quan ly doi tuong chinh sach", group: "taichinh", icon: "fa-light fa-users-gear" },
    { kw: "tra cuu ket qua dang ky", group: "taichinh", icon: "fa-light fa-receipt" },
    { kw: "tra cuu chuong trinh", group: "daotao", icon: "fa-light fa-magnifying-glass" },
    { kw: "muc phi", group: "taichinh", icon: "fa-light fa-money-bill" },
    { kw: "hoc lai", group: "daotao", icon: "fa-light fa-rotate-right" },

    // 6. Ứng dụng di động
    { kw: "app sinh vien", group: "mobile", icon: "fa-light fa-mobile-screen" },
    { kw: "di dong", group: "mobile", icon: "fa-light fa-mobile-screen" },
    { kw: "mobile", group: "mobile", icon: "fa-light fa-mobile-screen" },

    // 5. Hệ thống cổng thông tin
    { kw: "cong can bo(admin)", group: "cong", icon: "fa-light fa-user-shield" },
    { kw: "cong can bo", group: "cong", icon: "fa-light fa-briefcase" },
    { kw: "cong sinh vien", group: "cong", icon: "fa-light fa-circle-user" },
    { kw: "cong giang vien", group: "cong", icon: "fa-light fa-circle-user" },
    { kw: "cong thong tin", group: "cong", icon: "fa-light fa-globe" },
    { kw: "dashboard", group: "cong", icon: "fa-light fa-gauge-high" },

    // 3. Quản lý khảo thí
    { kw: "dang ky thi", group: "khaothi", icon: "fa-light fa-clipboard-list" },
    { kw: "thi trac nghiem", group: "khaothi", icon: "fa-light fa-list-check" },
    { kw: "thi phach", group: "khaothi", icon: "fa-light fa-hashtag" },
    { kw: "lich thi", group: "khaothi", icon: "fa-light fa-calendar-days" },
    { kw: "to chuc thi", group: "khaothi", icon: "fa-light fa-clipboard-list" },
    { kw: "khao thi", group: "khaothi", icon: "fa-light fa-clipboard-list" },
    { kw: "quan ly diem", group: "khaothi", icon: "fa-light fa-pen-to-square" },
    { kw: "tien do nhap diem", group: "khaothi", icon: "fa-light fa-chart-line" },
    { kw: "nhap diem", group: "khaothi", icon: "fa-light fa-pen-to-square" },
    { kw: "thi lai", group: "khaothi", icon: "fa-light fa-rotate-right" },

    // 1. Quản lý tuyển sinh và sinh viên
    { kw: "ke hoach nhap hoc", group: "tuyensinh", icon: "fa-light fa-calendar-plus" },
    { kw: "ke hoach tuyen sinh", group: "tuyensinh", icon: "fa-light fa-calendar-days" },
    { kw: "tuyen sinh", group: "tuyensinh", icon: "fa-light fa-graduation-cap" },
    { kw: "thong ke nhap hoc", group: "tuyensinh", icon: "fa-light fa-chart-column" },
    { kw: "ho so nhap hoc", group: "tuyensinh", icon: "fa-light fa-folder-open" },
    { kw: "nhap hoc", group: "tuyensinh", icon: "fa-light fa-user-plus" },
    { kw: "ho so sinh vien", group: "tuyensinh", icon: "fa-light fa-id-card" },
    { kw: "bien dong", group: "tuyensinh", icon: "fa-light fa-right-left" },
    { kw: "quyet dinh nguoi hoc", group: "tuyensinh", icon: "fa-light fa-file-signature" },
    { kw: "chuyen can", group: "tuyensinh", icon: "fa-light fa-calendar-check" },
    { kw: "hoc bong", group: "tuyensinh", icon: "fa-light fa-award" },
    { kw: "ren luyen", group: "tuyensinh", icon: "fa-light fa-star" },
    { kw: "ky tuc xa", group: "tuyensinh", icon: "fa-light fa-building" },
    { kw: "danh hieu", group: "tuyensinh", icon: "fa-light fa-trophy" },
    { kw: "khen thuong", group: "tuyensinh", icon: "fa-light fa-trophy" },
    { kw: "sinh vien", group: "tuyensinh", icon: "fa-light fa-user-graduate" },

    // 2. Quản lý đào tạo
    { kw: "ke hoach chuong trinh", group: "daotao", icon: "fa-light fa-calendar" },
    { kw: "chuong trinh dao tao", group: "daotao", icon: "fa-light fa-book-open" },
    { kw: "chuong trinh", group: "daotao", icon: "fa-light fa-book-open" },
    { kw: "thoi khoa bieu", group: "daotao", icon: "fa-light fa-calendar-days" },
    { kw: "lich giang", group: "daotao", icon: "fa-light fa-calendar-days" },
    { kw: "dang ky hoc", group: "daotao", icon: "fa-light fa-pen-line" },
    { kw: "xu ly hoc vu", group: "daotao", icon: "fa-light fa-triangle-exclamation" },
    { kw: "hoc vu", group: "daotao", icon: "fa-light fa-triangle-exclamation" },
    { kw: "tot nghiep", group: "daotao", icon: "fa-light fa-circle-check" },
    { kw: "vbc", group: "daotao", icon: "fa-light fa-certificate" },
    { kw: "chung chi", group: "daotao", icon: "fa-light fa-certificate" },
    { kw: "bang cap", group: "daotao", icon: "fa-light fa-certificate" },
    { kw: "chot so luong", group: "daotao", icon: "fa-light fa-clipboard-check" },
    { kw: "luan van", group: "daotao", icon: "fa-light fa-scroll" },
    { kw: "luan an", group: "daotao", icon: "fa-light fa-scroll" },
    { kw: "nghien cuu khoa hoc", group: "daotao", icon: "fa-light fa-flask" },
    { kw: "nckh", group: "daotao", icon: "fa-light fa-flask" },

    // 4. Quản lý tài chính và học phí
    { kw: "hoc phi", group: "taichinh", icon: "fa-light fa-wallet" },
    { kw: "tai chinh", group: "taichinh", icon: "fa-light fa-wallet" },
    { kw: "thu phi", group: "taichinh", icon: "fa-light fa-money-bill" },
    { kw: "thanh toan", group: "taichinh", icon: "fa-light fa-credit-card" },
    { kw: "ke toan", group: "taichinh", icon: "fa-light fa-calculator" },
    { kw: "mien giam", group: "taichinh", icon: "fa-light fa-percent" },

    // Nhân sự
    { kw: "nhan su 2026", group: "nhansu", icon: "fa-light fa-id-badge" },
    { kw: "nhan su", group: "nhansu", icon: "fa-light fa-users" },
    { kw: "gio giang", group: "nhansu", icon: "fa-light fa-clock" },
    { kw: "thong ke gio", group: "nhansu", icon: "fa-light fa-clock" },

    // Quản trị hệ thống
    { kw: "khao sat", group: "quantri", icon: "fa-light fa-clipboard-question" },
    { kw: "he thong thong tin", group: "quantri", icon: "fa-light fa-server" },
    { kw: "quan tri he thong", group: "quantri", icon: "fa-light fa-user-gear" },
    { kw: "he thong", group: "quantri", icon: "fa-light fa-server" },
    { kw: "khoa quan ly", group: "quantri", icon: "fa-light fa-network-wired" },
    { kw: "tin tuc", group: "quantri", icon: "fa-light fa-newspaper" },
    { kw: "sms", group: "quantri", icon: "fa-light fa-comment-dots" },
    { kw: "cms", group: "quantri", icon: "fa-light fa-gear" },
    { kw: "chinh sach", group: "quantri", icon: "fa-light fa-scale-balanced" },
    { kw: "doi tuong", group: "quantri", icon: "fa-light fa-user-tag" },

    // Tra cứu chung → cổng thông tin (biên bản: "Tra cứu kết quả học tập" thuộc cổng thông tin)
    { kw: "tra cuu", group: "cong", icon: "fa-light fa-magnifying-glass" },
  ],

  /* =====================================================================
       10. HÀNH VI
       ===================================================================== */
  behavior: {
    /* --- Menu chức năng ---------------------------------------------
           Hệ cũ KHÔNG sắp xếp menu: nó vẽ đúng thứ tự
           PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung trả về (tức ORDER BY
           trong procedure, theo THUTUHIENTHI của bảng chức năng).

           menuOrder:    'server' giữ nguyên thứ tự máy chủ (mặc định, giống
                         hệ cũ) · 'name' sắp theo tên A→B
           menuOrphans:  mục có cha KHÔNG nằm trong danh sách được cấp quyền
                         'group' gom vào nhóm "Khác" ở cuối (mặc định — không
                                 để người dùng mất chức năng đã được cấp)
                         'hide'  bỏ hẳn, giống hệ cũ
                         'root'  coi như một nhóm gốc
           menuHideDashboard: ẩn mục DUONGDANHIENTHI = "#dashboard" (hệ cũ
                         cũng ẩn bằng display:none)                        */
    /* Khung "Ghi chú chuyển đổi" (điểm cần nghiệp vụ quyết / cần kiểm trên host) ở đầu các màn có mục trong
       assets/js/can-quyet.js. Đặt false khi giao cho người dùng thật. */
    canQuyet: true,
    /* Bảng "Màn đang có lỗi backend" ở trang vai trò (chưa chọn chức năng) và nút xem tổng ở trang chủ — cho bộ phận backend nhìn thấy việc cần
       làm. Lấy từ sổ can-quyet.js (chỉ mục lỗi máy chủ / CSDL). Đặt false khi giao cho người dùng thật; từng người tự tắt ở Cài đặt → Hành vi. */
    loiBackend: true,
    /* Khung "Cần làm trước" (assets/js/lamtruoc.js): màn thiếu dữ liệu nghiệp vụ khai được ở màn khác (danh mục chưa có giá trị…) thì tự hiện
       việc cần làm + liên kết mở màn khai. KHÁC khung Ghi chú: giữ khi giao người dùng thật; đặt false để tắt. */
    lamTruoc: true,
    /* Thông báo nổi hiện bao lâu (mili giây) theo loại: thành công / thông tin / lưu ý / lỗi. Câu dài hơn 60 ký tự được cộng
       thêm 60 ms mỗi ký tự, tối đa 20 giây; rê chuột vào thông báo thì không tự đóng. */
    toastMs: { ok: 6000, info: 6000, warn: 9000, bad: 12000 },
    menuOrder: "server",
    menuOrphans: "group",
    menuHideDashboard: true,

    // Nhớ trạng thái thu cột trái giữa các lần mở
    rememberNavCollapsed: true,

    // Mở sẵn nhóm chức năng đầu tiên trong cây
    openFirstNavGroup: true,

    /* Đóng / mở kiểu ĐÀN XẾP: mở một nhóm thì đóng các nhóm cùng cấp (menu
       chức năng và các vùng thu gọn khác). Đặt false để mở được nhiều nhóm
       cùng lúc. Đổi ngay trên màn hình Cài đặt giao diện. */
    accordion: true,

    // Ở thanh lọc, bỏ nhãn riêng và đưa tên trường vào chữ gợi ý trong ô.
    // Đặt false nếu muốn nhãn nằm ngoài như kiểu cũ.
    filterLabelInside: true,

    // Số dòng mặc định mỗi trang của bảng
    pageSize: 10,

    // Định dạng ngày dùng cho ô chọn lịch
    dateFormat: "d/m/Y",
  },
};
