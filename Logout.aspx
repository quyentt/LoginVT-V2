<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Logout.aspx.cs" Inherits="Apis.LoginVT.Logout" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Đang đăng xuất...</title>
    <script>
        (function () {
            try {
                sessionStorage.clear();
            } catch (e) { }
            try {
                var lsKeys = ['strIM', 'strRootPath', 'pendingThuVaiSV', 'reload'];
                for (var i = 0; i < lsKeys.length; i++) {
                    localStorage.removeItem(lsKeys[i]);
                }
            } catch (e) { }
            window.location.replace('login.aspx');
        })();
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
</body>
</html>
