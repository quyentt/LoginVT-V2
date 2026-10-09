<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" EnableSessionState="false" ResponseEncoding="utf-8" ContentType="application/json" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="System.Security.Cryptography" %>
<script runat="server">
    /* =====================================================================
       JWKS — khoá CÔNG KHAI để Cổng Help xác thực token do help-sso.aspx phát.
       ---------------------------------------------------------------------
       Trang công khai, KHÔNG kế thừa Apis.LoginVT.Index (lớp đó đá về login khi
       chưa có phiên — Help gọi trang này bằng máy chủ, không có phiên).
       Đọc cùng tệp khoá với help-sso.aspx (~/App_Data/help-sso/help-sso.key.xml);
       chưa có thì tự sinh, để bên Help đăng ký JWKS được trước khi ai bấm SSO.
       Đăng ký với Help: <ứng dụng>/_v2/help-jwks.aspx (không dùng /.well-known/
       vì ASP.NET hay chặn thư mục bắt đầu bằng dấu chấm).
       Help đọc lại JWKS mỗi 10 phút → xoay khoá = xoá tệp .key.xml, không phải hẹn.
       ===================================================================== */

    const string THU_MUC = "~/App_Data/help-sso";
    const string TEP_KHOA = "help-sso.key.xml";

    static string B64u(byte[] b) { return Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_'); }

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "application/json";
        Response.AddHeader("Access-Control-Allow-Origin", "*");
        Response.Cache.SetCacheability(HttpCacheability.Public);
        Response.Cache.SetMaxAge(TimeSpan.FromMinutes(10));
        try
        {
            string dir = Server.MapPath(THU_MUC), p = Path.Combine(dir, TEP_KHOA);
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            var cp = new CspParameters(24);
            RSACryptoServiceProvider rsa;
            if (File.Exists(p))
            {
                rsa = new RSACryptoServiceProvider(cp);
                rsa.PersistKeyInCsp = false;
                rsa.FromXmlString(File.ReadAllText(p, Encoding.UTF8));
            }
            else
            {
                rsa = new RSACryptoServiceProvider(2048, cp);
                rsa.PersistKeyInCsp = false;
                File.WriteAllText(p, rsa.ToXmlString(true), new UTF8Encoding(false));
            }
            string kid, n, e2;
            using (rsa)
            {
                var pub = rsa.ExportParameters(false);
                using (var sha = SHA256.Create()) kid = B64u(sha.ComputeHash(pub.Modulus)).Substring(0, 16);
                n = B64u(pub.Modulus); e2 = B64u(pub.Exponent);
            }
            Response.Write("{\"keys\":[{\"kty\":\"RSA\",\"use\":\"sig\",\"alg\":\"RS256\",\"kid\":\"" + kid + "\",\"n\":\"" + n + "\",\"e\":\"" + e2 + "\"}]}");
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Write("{\"error\":\"" + HttpUtility.JavaScriptStringEncode(ex.GetType().Name + ": " + ex.Message) + "\"}");
        }
        Response.End();
    }
</script>
