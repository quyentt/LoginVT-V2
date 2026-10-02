<%@ Page Language="C#" AutoEventWireup="true" Inherits="Apis.LoginVT.Index" %>
<script runat="server">
    /* Số phiên bản cho tệp tĩnh = lần sửa cuối của chính tệp đó. Đẩy tệp mới
       lên là số đổi, trình duyệt tải lại; không đổi thì dùng bộ đệm.
       Thiếu số này thì trình duyệt giữ ref.js / patterns.js CŨ dù host đã có
       bản mới — sửa xong, đẩy lên rồi mà "vẫn vậy" (đã gặp 2026-09-21). */
    protected string V(string duongDan)
    {
        try { return System.IO.File.GetLastWriteTimeUtc(Server.MapPath(duongDan)).Ticks.ToString(); }
        catch { return "1"; }
    }

    /* Tệp cấu hình theo từng host (Config.js): có bản đặt NGAY TRONG _v2 thì
       dùng bản đó — _v2 không phụ thuộc gì ngoài thư mục của nó; chưa có thì
       lùi về bản của ứng dụng cha như trước (host đang chạy không phải đổi gì). */
    protected string TrongV2(string ten)
    {
        try { if (System.IO.File.Exists(Server.MapPath(ten))) return ten; } catch { }
        return "../" + ten;
    }
</script>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>UMS</title>

    <%--
        VỎ TRIỂN KHAI LÊN MÁY CHỦ
        ==========================================================
        Dùng lại code-behind sẵn có `Apis.LoginVT.Index` để lấy đúng blob phiên
        mà index.aspx hiện hành đang dùng. Không thêm biến máy chủ nào mới.

        Đặt thư mục _v2 ngay dưới thư mục gốc của ứng dụng, rồi mở
            <ứng dụng>/_v2/index.aspx

        Ba thứ bắt buộc phải có, theo đúng thứ tự:
            1. AXYZCLRVN()  — blob phiên đã mã hoá, do máy chủ bơm
            2. crypto-js.js — cung cấp AE() và AD() để giải blob và mã hoá payload
                              (bản sao trong _v2/assets/vendor/crypto/)
            3. Config.js    — cung cấp Init_API(), bảng 29 base URL microservice
                              (_v2/Config.js nếu có, không thì ../Config.js)

        Nếu thiếu bất kỳ thứ nào, session.js sẽ báo rõ thiếu cái gì ngay trên
        màn hình thay vì hỏng im lặng.
    --%>

    <%-- CSS ĐÃ GỘP thành một tệp (xem _harness\gop-css.py). Bản @import
         `main.css` chỉ dùng khi xem bằng index.html trên máy. --%>
    <%-- Số phiên bản lấy từ lần sửa cuối của chính tệp CSS: đổi CSS là đổi số,
         trình duyệt tự tải bản mới; không đổi thì dùng lại bộ đệm. --%>
    <% string cssV = "1";
       try { cssV = System.IO.File.GetLastWriteTimeUtc(
               Server.MapPath("assets/css/main.bundle.css")).Ticks.ToString(); } catch { } %>
    <link rel="stylesheet" href="assets/css/main.bundle.css?v=<%= cssV %>">

    <%-- Phông biểu tượng: báo trước để tải song song với CSS. Không có dòng
         này thì phải đợi đọc xong CSS mới bắt đầu tải — vào lần đầu mất
         sạch biểu tượng một lúc. crossorigin là bắt buộc với phông. --%>
    <link rel="preload" as="font" type="font/woff2" crossorigin
          href="assets/vendor/fontawesome/webfonts/fa-light-300.woff2">

    <script src="assets/config/site.config.js?v=<%= V("assets/config/site.config.js") %>"></script>
    <script src="assets/config/apply-config.js?v=<%= V("assets/config/apply-config.js") %>"></script>
</head>

<body>
    <div class="ums-app" id="app">

        <header class="ums-topbar">
            <!-- Nút Menu + logo: rộng tối thiểu bằng cột trái để ô tìm bắt đầu thẳng mép cột trái -->
            <div class="ums-topbar__left">
                <button type="button" class="ums-topbar__toggle" id="navToggle">
                    <i class="fa-light fa-bars-sort"></i><span>Menu</span>
                </button>

                <a class="ums-topbar__brand" href="#/">
                    <span class="ums-topbar__logo" data-ums-brand="logo"></span>
                    <span data-ums-brand="name"></span>
                </a>
            </div>
            <!-- Tìm MÀN HÌNH (app.js timMan) — vai trò đang dùng trước, rồi mọi vai trò; tên màn + dòng nhỏ tên vai trò -->
            <div class="ums-gsearch" id="gSearch">
                <i class="fa-light fa-magnifying-glass ums-gsearch__icon"></i>
                <input class="ums-gsearch__input" id="gSearchInput" type="text" autocomplete="off" spellcheck="false"
                       placeholder="Tìm màn hình trong mọi vai trò…" aria-label="Tìm màn hình">
                <kbd class="ums-gsearch__kbd">Ctrl K</kbd>
                <div class="ums-gsearch__list" id="gSearchList" role="listbox" hidden></div>
            </div>

            <span class="ums-topbar__spacer"></span>

            <div class="ums-topbar__tools">
                <span class="ums-topbar__divider"></span>
                <button type="button" class="ums-topbar__icon" title="Thông báo">
                    <i class="fa-light fa-bell"></i>
                    <span class="ums-topbar__dot"></span>
                </button>
                <button type="button" class="ums-topbar__user" id="btnUser">
                    <span class="ums-topbar__avatar"><i class="fa-light fa-user"></i></span>
                    <span class="ums-u-hide-sm" id="userName"><%= fullname %></span>
                </button>
            </div>
        </header>

        <aside class="ums-sidebar">
            <div class="ums-sidebar__top">
                <div class="ums-rolebar" id="roleBar" title="Vai trò đang dùng">
                    <span class="ums-rolebar__icon"><i class="fa-light fa-user-shield" id="roleBarIcon"></i></span>
                    <span class="ums-rolebar__txt"><small>Vai trò</small><b id="roleBarName">Chưa chọn vai trò</b></span>
                    <a class="ums-rolebar__doi" href="#/" title="Đổi vai trò"><i class="fa-light fa-arrow-right-arrow-left"></i></a>
                </div>
            </div>

            <div class="ums-scroll ums-sidebar__body" id="navScroll">
                <div class="ums-scroll__view">
                    <nav id="nav"></nav>
                </div>
                <div class="ums-scroll__bar"><div class="ums-scroll__thumb"></div></div>
            </div>

            <div class="ums-sidebar__foot" data-ums-brand="footer"></div>
        </aside>

        <div class="ums-veil" id="veil"></div>

        <main class="ums-main">
            <div id="content"></div>
        </main>
    </div>

    <%-- 1. Blob phiên do máy chủ bơm — phải đứng trước session.js --%>
    <script type="text/javascript">AXYZCLRVN = () => "<%= lblXYZCLRVN %>"</script>

    <%-- 2. AE()/AD() — BẢN SAO nguyên văn của assets/js/crypto-js.js ở ứng dụng
            gốc (crypto-js đã bị nhét thêm AE/AD/ASG — KHÔNG thay bằng bản
            crypto-js tải từ nguồn ngoài). Gốc đổi tệp này thì chép lại. --%>
    <script src="assets/vendor/crypto/crypto-js.js?v=<%= V("assets/vendor/crypto/crypto-js.js") %>"></script>

    <%-- 3. Init_API() — bảng base URL của 29 microservice. Ưu tiên _v2/Config.js,
            chưa có thì dùng ../Config.js của ứng dụng cha. --%>
    <script src="<%= TrongV2("Config.js") %>?v=<%= Guid.NewGuid().ToString() %>"></script>

    <!-- Thư viện của bộ giao diện -->
    <script src="assets/vendor/jquery/jquery-3.7.1.min.js"></script>
    <script src="assets/vendor/select2/select2.min.js"></script>
    <script src="assets/vendor/select2/i18n-vi.js"></script>
    <script src="assets/vendor/flatpickr/flatpickr.min.js"></script>
    <script src="assets/vendor/flatpickr/l10n/vn.js"></script>
    <script src="assets/vendor/chart/chart.umd.js"></script>
    <script src="assets/vendor/chart/chartjs-plugin-datalabels.min.js"></script>
    <script src="assets/vendor/n2vi/n2vi.min.js"></script>

    <!-- Bộ giao diện -->
    <script src="assets/js/scroll.js?v=<%= V("assets/js/scroll.js") %>"></script>
    <script src="assets/js/chrome.js?v=<%= V("assets/js/chrome.js") %>"></script>
    <script src="assets/js/ui.js?v=<%= V("assets/js/ui.js") %>"></script>
    <script src="assets/js/session.js?v=<%= V("assets/js/session.js") %>"></script>
    <script src="assets/js/api.js?v=<%= V("assets/js/api.js") %>"></script>
    <script src="assets/js/crud.js?v=<%= V("assets/js/crud.js") %>"></script>
    <script src="assets/js/patterns.js?v=<%= V("assets/js/patterns.js") %>"></script>
    <script src="assets/js/ref.js?v=<%= V("assets/js/ref.js") %>"></script>
    <script src="assets/js/report.js?v=<%= V("assets/js/report.js") %>"></script>
    <script src="assets/js/phieu.js?v=<%= V("assets/js/phieu.js") %>"></script>
    <script src="assets/js/lich.js?v=<%= V("assets/js/lich.js") %>"></script>
    <script src="assets/js/diemhoc.js?v=<%= V("assets/js/diemhoc.js") %>"></script>
    <script src="assets/js/demo-data.js?v=<%= V("assets/js/demo-data.js") %>"></script>
    <script src="assets/js/icon-fa4.js?v=<%= V("assets/js/icon-fa4.js") %>"></script>
    <script src="assets/js/can-quyet.js?v=<%= V("assets/js/can-quyet.js") %>"></script>
    <script src="assets/js/thuvai.js?v=<%= V("assets/js/thuvai.js") %>"></script>
    <script src="assets/js/app.js?v=<%= V("assets/js/app.js") %>"></script>
</body>

</html>
