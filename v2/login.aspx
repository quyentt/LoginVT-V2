<%@ Page Language="C#" AutoEventWireup="true" Inherits="Apis.LoginVT.Login" %>
<!DOCTYPE html>
<html lang="vi">

<head runat="server">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Đăng nhập</title>

    <%--
        TRANG ĐĂNG NHẬP CỦA BẢN MỚI
        ==========================================================
        Dùng lại NGUYÊN code-behind `Apis.LoginVT.Login` của login.aspx ở thư
        mục gốc — không có mã máy chủ mới, không đụng gì đến bản cũ. Muốn vậy
        thì phải giữ ĐÚNG TÊN các điều khiển mà code-behind gọi tới:

            username                      ô tài khoản
            password                      ô mật khẩu
            cms_authenticate_do_login     nút, gắn OnClick="cms_authenticate_do_login_Click"
            lblNotify                     chỗ hiện lỗi đăng nhập
            xxxxxx                        ô ẩn của bản gốc (giữ nguyên, đừng bỏ)
            userip / userbrower / userdevice   ba ô ẩn bản gốc gửi kèm

        Đổi tên bất kỳ cái nào ở trên là đăng nhập hỏng. Phần nhìn thì viết
        lại hoàn toàn bằng lớp ums- của bản mới.

        SAU KHI ĐĂNG NHẬP ĐÚNG, code-behind tự chuyển trang. Không đọc được mã
        nguồn code-behind (không có trong kho) nên có hai khả năng:
          · Chuyển bằng đường dẫn TƯƠNG ĐỐI ("index.aspx") → rơi đúng vào
            _v2/index.aspx, tức bản mới. Đây là điều mong muốn.
          · Chuyển bằng đường dẫn TUYỆT ĐỐI ("~/index.aspx", "/index.aspx") →
            rơi về vỏ cũ. Khi đó mở tay <ứng dụng>/_v2/index.aspx là vào được
            ngay, phiên đăng nhập vẫn dùng chung.
        Xem _v2/TRIEN-KHAI.md mục 8.
    --%>

    <%-- Bộ kiểu RIÊNG của trang này, ĐÃ GỘP sẵn thành MỘT tệp.
         Không nạp bản @import: trình duyệt coi tệp chỉ gồm @import là "xong"
         rồi vẽ trang ngay trong khi các tệp con còn đang về — đúng hiện tượng
         "vào lần đầu trơ chữ, F5 mới đẹp". Sửa CSS xong phải chạy lại:
             python _harness\gop-css.py --%>
    <%-- Số phiên bản lấy từ lần sửa cuối của chính tệp CSS: đổi CSS là đổi số,
         trình duyệt tự tải bản mới; không đổi thì dùng lại bộ đệm. --%>
    <% string cssV = "1";
       try { cssV = System.IO.File.GetLastWriteTimeUtc(
               Server.MapPath("assets/css/login-page.bundle.css")).Ticks.ToString(); } catch { } %>
    <link rel="stylesheet" href="assets/css/login-page.bundle.css?v=<%= cssV %>">

    <%-- Hai anh nang nhat trang: bao truoc de tai song song voi CSS, khong
         phai doi trinh duyet doc xong CSS moi biet ma tai. --%>
    <link rel="preload" as="image" href="assets/img/login-bg.jpg" fetchpriority="high">
    <link rel="preload" as="image" href="assets/img/login-illustration.jpg">

    <script src="assets/config/site.config.js"></script>
    <script src="assets/config/apply-config.js"></script>

    <%-- Bản gốc nạp encrypt.js ở trang đăng nhập; giữ nguyên để không thiếu
         hàm nào code-behind hoặc mã cũ trông đợi. --%>
    <%-- Có bản đặt trong _v2 (assets/vendor/encrypt/encrypt.js) thì dùng bản đó,
         chưa có thì lùi về bản của ứng dụng cha. Tệp này không có trong kho mã
         nên không chép sẵn được — lấy từ host. --%>
    <% string encJs = "../App_Themes/Plugins/encrypt/encrypt.js";
       try { if (System.IO.File.Exists(Server.MapPath("assets/vendor/encrypt/encrypt.js")))
                 encJs = "assets/vendor/encrypt/encrypt.js"; } catch { } %>
    <script src="<%= encJs %>"></script>
</head>

<body class="ums-login">
    <%-- Nền động: các điểm trôi, điểm nào gần nhau thì nối — vẽ bằng canvas
         nên không phải chép ảnh nền nặng lên máy chủ. --%>
    <canvas id="umsLoginBg" aria-hidden="true"></canvas>

    <form id="formLoginSSO" runat="server" class="ums-login__form">
        <div class="ums-login__box">
            <div class="ums-login__main">
            <h1 class="ums-login__title">Đăng nhập hệ thống</h1>

            <div class="ums-login__field">
                <svg class="ums-login__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>
                <asp:TextBox ID="username" runat="server" CssClass="ums-input"
                    placeholder="Nhập tài khoản hoặc email" autocomplete="username" />
            </div>

            <div class="ums-login__field ums-login__field--pass">
                <svg class="ums-login__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="5"/><path d="M11.5 11.5 21 21"/><path d="M17.5 17.5 20 15"/></svg>
                <asp:TextBox ID="password" runat="server" type="password" CssClass="ums-input"
                    placeholder="Nhập mật khẩu" autocomplete="current-password" />
                <%-- type="button" — không để nút này gửi biểu mẫu đi --%>
                <button type="button" class="ums-login__eye" data-eye
                    aria-label="Hiện mật khẩu" title="Hiện mật khẩu">
                    <svg class="ums-login__svg ums-login__svg--on" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/>
                        <circle cx="12" cy="12" r="2.6"/></svg>
                    <svg class="ums-login__svg ums-login__svg--off" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="M2 12s3.6-6.5 10-6.5c1.7 0 3.2.5 4.5 1.1M22 12s-3.6 6.5-10 6.5c-1.7 0-3.2-.5-4.5-1.1"/>
                        <path d="M4 20 20 4"/></svg></button>
            </div>

            <asp:Button ID="cms_authenticate_do_login" runat="server"
                CssClass="ums-btn ums-btn--primary ums-btn--block ums-login__submit"
                Text="Đăng nhập" OnClick="cms_authenticate_do_login_Click" />

            <p class="ums-login__notify">
                <asp:Label ID="lblNotify" runat="server" ForeColor="Red" Text="" />
            </p>

            <%-- Các lối đăng nhập ngoài: chỉ hiện khi máy chủ có khai. Ảnh đã chép
                 vào _v2/assets/img. Hai trang phụ (Quên mật khẩu, Trợ giúp) là
                 trang ASPX của ứng dụng cha, code-behind nằm trong bin — không
                 chép về được nên vẫn lùi một cấp (../). --%>
            <% if (urlgoogle != "") { %>
            <div class="ums-login__or"><span>hoặc</span></div>
            <a class="ums-btn ums-btn--ghost ums-btn--block ums-login__sso" href="<%= urlgoogle %>">
                <svg class="ums-login__svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.35Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.42l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.5H3.07a10 10 0 0 0 0 9l3.34-2.58Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.93 5.5l3.34 2.58C7.2 7.72 9.4 5.95 12 5.95Z"/></svg><span>Đăng nhập bằng Google</span></a>
            <% } %>
            <% if (urlmicrosoft != "") { %>
            <div class="ums-login__or"><span>hoặc</span></div>
            <a class="ums-btn ums-btn--ghost ums-btn--block ums-login__sso" id="btnDangNhapMicrosoft" href="<%= urlmicrosoft %>">
                <img src="assets/img/microsoft_logg.svg" alt="" class="ums-login__ico"><span>Đăng nhập bằng Microsoft</span></a>
            <% } %>
            <% if (urlKeyCloak != "") { %>
            <div class="ums-login__or"><span>hoặc</span></div>
            <a class="ums-btn ums-btn--ghost ums-btn--block ums-login__sso" href="<%= urlKeyCloak %>">
                <img src="assets/img/icon-Keycloak.png" alt="" class="ums-login__ico"><span>Đăng nhập bằng SSO</span></a>
            <% } %>

            <div class="ums-login__foot">
                <a href="../Pages/ForgetPass.aspx">Quên mật khẩu?</a>
                <a href="../Pages/Support.aspx" target="_blank">Trợ giúp</a>
            </div>

            <%-- Ba ô ẩn của bản gốc: giữ nguyên tên, code-behind đọc theo tên này --%>
            <input id="userip" name="userip" type="text" hidden />
            <input id="userbrower" name="userbrower" type="text" hidden />
            <input id="userdevice" name="userdevice" type="text" hidden />
            <asp:TextBox ID="xxxxxx" runat="server" type="password" CssClass="ums-input"
                style="display:none" />
            </div>

            <%-- Cột phải: đặt ảnh vào _v2/assets/img/login-illustration.png là hiện.
                 Chưa có tệp thì ở đây là mảng chuyển sắc xanh, không vỡ bố cục. --%>
            <div class="ums-login__art" aria-hidden="true"></div>
        </div>
    </form>

    <script src="assets/js/login-bg.js"></script>

    <script>
        /* Hiện / ẩn mật khẩu. Ô là <asp:TextBox> nên id do máy chủ sinh —
           tìm theo vị trí trong khối, không viết cứng id. */
        (function () {
            var nut = document.querySelector('[data-eye]');
            if (!nut) return;
            var o = nut.parentNode.querySelector('input');
            nut.addEventListener('click', function () {
                var hien = o.type === 'password';
                o.type = hien ? 'text' : 'password';
                nut.classList.toggle('is-hien', hien);
                nut.setAttribute('aria-label', hien ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
                nut.title = hien ? 'Ẩn mật khẩu' : 'Hiện mật khẩu';
                o.focus();
            });
        })();

        /* Dọn phiên cũ đúng như login.aspx bản gốc — vào trang đăng nhập là
           bỏ hết dấu vết phiên trước, tránh mở bản mới bằng blob đã hết hạn. */
        (function () {
            try { sessionStorage.clear(); } catch (e) { }
            try {
                ['strIM', 'strRootPath', 'pendingThuVaiSV', 'reload'].forEach(function (k) {
                    localStorage.removeItem(k);
                });
            } catch (e) { }
        })();
    </script>
</body>

</html>
