<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="Apis.LoginVT.Login" %>

    <!DOCTYPE html>

    <html>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Apis - Login</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link href="App_Themes/Plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" /><!-- Bootstrap 3.3.7 -->
        <link href="App_Themes/Plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
        <!--Plugin font awesome -->
        <link href="App_Themes/Plugins/ionicons/css/ionicons.min.css" rel="stylesheet" /><!--Plugin Ionicons -->
        <link href="App_Themes/Cms/adminlte/css/AdminLTE.min.css" rel="stylesheet" /><!--Template Style AdminLTE-->
        <link href="App_Themes/Cms/adminlte/css/AdminLTE.min.css" rel="stylesheet" /><!--Template Style AdminLTE-->
        <link href="App_Themes/Cms/css/index.css" rel="stylesheet" /><!--Index - user defined-->
        <!-- jQuery 3 -->
        <script type="text/javascript" src="App_Themes/Plugins/jquery/jquery.min.js"></script>
        <script type="text/javascript" src="App_Themes/Plugins/encrypt/encrypt.js"></script>
        <script type="text/javascript" src="App_Themes/Plugins/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    </head>

    <body class="hold-transition login-page">
        <form id="formLoginSSO" runat="server" class="formLoginSSO">
            <form id="cms_bm_frm_login" action="#" method="post" onsubmit="return false">
                <div class="login-box">
                    <div class="login-logo">
                        <a href="#"><img border="0" src="<%=logo %>" height="120" /></a>
                    </div>
                    <!-- /.login-logo -->
                    <div class="login-box-body">
                        <p class="login-box-msg">
                            <i class="fa fa-key icon-login"></i>
                        </p>
                        <p class="login-box-msg">
                            <span style="font-size: 26px; color:#3c8dbc">Đăng nhập hệ thống</span>
                        </p>
                        <div class="form-group has-feedback">
                            <asp:TextBox ID="username" placeholder="Nhập tài khoản hoặc email" class="form-control"
                                runat="server" />
                        </div>
                        <div class="form-group has-feedback">
                            <asp:TextBox type="password" ID="password" placeholder="Nhập mật khẩu" class="form-control"
                                runat="server" />
                        </div>
                        <div class="row">
                            <div class="col-xs-5 login-language" style="display: none">
                                <select class="form-control">
                                    <% if (dtLanguage !=null) { int c=dtLanguage.Rows.Count; if (c> 0)
                                        {
                                        for(int i = 0; i < c; i++) { %>
                                            <option value="<%=dtLanguage.Rows[i][" Id"].ToString()%>">
                                                <%=dtLanguage.Rows[i]["TenNgonNgu"].ToString()%>
                                            </option>
                                            <% } } } %>
                                </select>
                            </div>
                            <!-- /.col -->
                            <div class="col-xs-7">
                                <div class="pull-right" style="width: auto">
                                    <asp:Button ID="cms_authenticate_do_login" runat="server"
                                        CssClass="btn btn-primary btn-block btn-flat" Text="Đăng nhập"
                                        OnClick="cms_authenticate_do_login_Click" />
                                </div>
                            </div>
                            <!-- /.col -->
                        </div>
                        <% if (urlgoogle !="" ) { %>
                            <div class="row login-notify">
                                <div class="social-auth-links text-center">
                                    <p>- OR -</p>
                                    <a href="<%=urlgoogle %>" class="btn btn-block btn-social btn-google btn-flat"><i
                                            class="fa fa-google-plus"></i> Sign in using Google+</a>
                                </div>
                            </div>
                            <% } if (urlmicrosoft !="" ) { %>
                                <div class="row login-notify">
                                    <div class="social-auth-links text-center">
                                        <p>- OR -</p>
                                        <a type="submit" id="btnDangNhapMicrosoft" href="<%=urlmicrosoft %>"
                                            class="btn btn-primary btn-microsoft btn-flat"><img
                                                src="assets/images/microsoft_logg.svg" class="logo-google"> Sign in
                                            using Microsoft</a>
                                    </div>
                                </div>
                                <% } if (urlKeyCloak !="" ) { %>
                                    <div class="row login-notify">
                                        <div class="social-auth-links text-center">
                                            <p>- OR -</p>
                                            <a type="submit" href="<%=urlKeyCloak %>"
                                                class="btn btn-block btn-social btn-google btn-flat"><img
                                                    src="assets/images/icon-Keycloak.png" style="padding-top: 10px">
                                                Đăng nhập bằng SSO</a>
                                        </div>
                                    </div>
                                    <% } %>
                                        <div class="row login-notify" style="margin-bottom: -40px">
                                            <p class="box-notify" style="text-align: center">
                                                <asp:Label Width="100%" runat="server" ForeColor="Red" Text=""
                                                    ID="lblNotify"></asp:Label>
                                            </p>
                                        </div>
                    </div>
                    <div class="login-box-footer">
                        <a title="Quên mật khẩu" href="Pages/ForgetPass.aspx"><b>Quên mật khẩu?</b></a><br>
                        <a title="Trợ giúp" target="_blank" href="Pages/Support.aspx"><b>Trợ giúp!</b></a><br>
                    </div>
                    <input id="userip" name="userip" type="text" hidden />
                    <input id="userbrower" name="userbrower" type="text" hidden />
                    <input id="userdevice" name="userdevice" type="text" hidden />
                    <asp:TextBox type="password" ID="xxxxxx" hiden="true" class="form-control" style="display: none"
                        runat="server" />
                </div>
            </form>
        </form>
    </body>

    </html>
    <script>
        $(document).ready(function () {
            try {
                sessionStorage.clear();
            } catch (e) { }
            try {
                var lsKeys = ['strIM', 'strRootPath', 'pendingThuVaiSV', 'reload'];
                for (var i = 0; i < lsKeys.length; i++) {
                    localStorage.removeItem(lsKeys[i]);
                }
            } catch (e) { }
        });
    </script>