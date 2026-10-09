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
    url: "https://con98.api-apis.com/help-master/mo?ma={functionId}&v={version}",   // Help dời sang /help thì đổi ở đây
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
  },

  /* =====================================================================
       6. NHÓM VAI TRÒ
       ---------------------------------------------------------------------
       Thứ tự ở đây chính là thứ tự hiện trên trang chủ.
       `key` phải khớp với `g` của từng vai trò trong dữ liệu.
       ===================================================================== */
  roleGroups: [
    { key: "cong", name: "Cổng người dùng", tone: "blue" },
    { key: "hocvu", name: "Học vụ", tone: "green" },
    { key: "daotao", name: "Đào tạo", tone: "purple" },
    { key: "taichinh", name: "Tài chính", tone: "amber" },
    { key: "nhansu", name: "Nhân sự", tone: "red" },
    { key: "quantri", name: "Quản trị", tone: "slate" },
    { key: "khac", name: "Khác", tone: "slate" },
  ],

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
    dataSource: "api",

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
       9. PHÂN NHÓM VAI TRÒ TỰ ĐỘNG
       ---------------------------------------------------------------------
       API chỉ trả tên vai trò, không trả nhóm. Hệ hiện hành phân nhóm bằng
       cách khớp từ khoá trên TÊN vai trò đã bỏ dấu (index.aspx:2020) — vì
       mã ứng dụng hay đổi định dạng nên khớp theo tên chắc ăn hơn.

       Duyệt tuần tự, khớp đầu tiên thắng. Đặt luật cụ thể TRƯỚC luật chung.
       ===================================================================== */
  roleRules: [
    { kw: "phan quyen", group: "quantri", icon: "fa-light fa-shield-halved" },
    {
      kw: "tra cuu ket qua dang ky",
      group: "taichinh",
      icon: "fa-light fa-receipt",
    },
    {
      kw: "tra cuu chuong trinh",
      group: "daotao",
      icon: "fa-light fa-magnifying-glass",
    },

    {
      kw: "cong can bo(admin)",
      group: "cong",
      icon: "fa-light fa-user-shield",
    },
    { kw: "cong can bo", group: "cong", icon: "fa-light fa-briefcase" },
    { kw: "cong sinh vien", group: "cong", icon: "fa-light fa-circle-user" },
    { kw: "cong thong tin", group: "cong", icon: "fa-light fa-globe" },
    { kw: "app sinh vien", group: "cong", icon: "fa-light fa-mobile" },
    { kw: "dashboard", group: "cong", icon: "fa-light fa-gauge" },

    { kw: "chuyen can", group: "hocvu", icon: "fa-light fa-calendar-check" },
    { kw: "hoc lai", group: "hocvu", icon: "fa-light fa-rotate-right" },
    { kw: "thi lai", group: "hocvu", icon: "fa-light fa-arrow-rotate-right" },
    { kw: "trac nghiem", group: "hocvu", icon: "fa-light fa-list-check" },
    { kw: "quan ly diem", group: "hocvu", icon: "fa-light fa-pen-to-square" },
    { kw: "nhap diem", group: "hocvu", icon: "fa-light fa-chart-line" },
    { kw: "thi phach", group: "hocvu", icon: "fa-light fa-hashtag" },
    { kw: "ren luyen", group: "hocvu", icon: "fa-light fa-star" },
    { kw: "tot nghiep", group: "hocvu", icon: "fa-light fa-circle-check" },
    { kw: "hoc vu", group: "hocvu", icon: "fa-light fa-triangle-exclamation" },
    { kw: "dang ky hoc", group: "hocvu", icon: "fa-light fa-pen" },
    { kw: "vbc", group: "hocvu", icon: "fa-light fa-certificate" },
    { kw: "quyet dinh", group: "hocvu", icon: "fa-light fa-file-signature" },
    { kw: "lop dac thu", group: "hocvu", icon: "fa-light fa-clipboard-check" },

    { kw: "tuyen sinh", group: "daotao", icon: "fa-light fa-graduation-cap" },
    { kw: "nhap hoc", group: "daotao", icon: "fa-light fa-user-plus" },
    { kw: "luan van", group: "daotao", icon: "fa-light fa-book-open" },
    { kw: "nghien cuu", group: "daotao", icon: "fa-light fa-flask" },
    { kw: "chuong trinh", group: "daotao", icon: "fa-light fa-calendar" },

    { kw: "ky tuc xa", group: "taichinh", icon: "fa-light fa-building" },
    { kw: "hoc bong", group: "taichinh", icon: "fa-light fa-award" },
    { kw: "tai chinh", group: "taichinh", icon: "fa-light fa-wallet" },

    { kw: "nhan su", group: "nhansu", icon: "fa-light fa-users" },
    { kw: "sinh vien", group: "nhansu", icon: "fa-light fa-user-graduate" },
    { kw: "gio giang", group: "nhansu", icon: "fa-light fa-clock" },

    { kw: "he thong", group: "quantri", icon: "fa-light fa-server" },
    { kw: "quan tri", group: "quantri", icon: "fa-light fa-sliders" },
    { kw: "khao sat", group: "quantri", icon: "fa-light fa-clipboard-list" },
    { kw: "mien giam", group: "quantri", icon: "fa-light fa-scale-balanced" },
    { kw: "sms", group: "quantri", icon: "fa-light fa-comment-dots" },
    { kw: "tin tuc", group: "quantri", icon: "fa-light fa-newspaper" },
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
