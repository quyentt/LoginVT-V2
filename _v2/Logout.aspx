<%@ Page Language="C#" AutoEventWireup="true" Inherits="Apis.LoginVT.Logout" %>
<!DOCTYPE html>
<html lang="vi">
<head runat="server">
    <meta charset="utf-8">
    <title>Đang đăng xuất…</title>
    <%--
        Bản sao của Logout.aspx ở thư mục gốc, dùng lại đúng code-behind
        `Apis.LoginVT.Logout`. Khác một điểm: chuyển về _v2/login.aspx (đường
        dẫn tương đối 'login.aspx' tính từ chính thư mục này) để người dùng
        đăng xuất từ bản mới thì quay lại trang đăng nhập của bản mới.
    --%>
    <script>
        (function () {
            try { sessionStorage.clear(); } catch (e) { }
            try {
                ['strIM', 'strRootPath', 'pendingThuVaiSV', 'reload'].forEach(function (k) {
                    localStorage.removeItem(k);
                });
            } catch (e) { }
            window.location.replace('login.aspx');
        })();
    </script>
</head>
<body>
    <form id="form1" runat="server"></form>
</body>
</html>
