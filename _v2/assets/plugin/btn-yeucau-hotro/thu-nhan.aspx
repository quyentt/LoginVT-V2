<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" ResponseEncoding="utf-8" ContentType="text/html" ValidateRequest="false" %>
<%@ Import Namespace="System.Text" %>
<script runat="server">
    /* TRANG THỬ NHẬN FORM của plugin "Yêu cầu hỗ trợ" — thay cửa /ho-tro/gui của Help khi Help chưa dựng
       (tài liệu nut-yeu-cau-ho-tro-tren-app.docx mục 7 bước 3: "tạm trỏ action vào một trang của chính app
       để xem form gửi đủ trường và ảnh"). Chỉ IN LẠI những gì nhận được, không lưu gì.
       Dùng: window.UMS_HOTRO_CONFIG = { url: 'assets/plugin/btn-yeucau-hotro/thu-nhan.aspx' } trước thẻ script plugin,
       hoặc trên console: btnYeuCauHoTro.config.url = 'assets/plugin/btn-yeucau-hotro/thu-nhan.aspx'.
       Không kế thừa Apis.LoginVT.Index: trang này không cần phiên, chỉ đọc Request. */
    protected string noiDung = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        var sb = new StringBuilder();
        if (!string.Equals(Request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
        {
            sb.Append("<p class=\"do\">Trang này chỉ nhận POST từ popup \"Yêu cầu hỗ trợ\". Mở bằng GET thì không có gì để xem.</p>");
            noiDung = sb.ToString(); return;
        }
        sb.Append("<p>Content-Type: <code>" + Server.HtmlEncode(Request.ContentType) + "</code> · " + Request.ContentLength + " byte</p>");
        sb.Append("<table><tr><th>Trường</th><th>Giá trị</th></tr>");
        string[] thuTu = { "token", "ma", "ten", "duong", "v", "cheDo", "noiDung", "route", "appVersion", "browser" };
        foreach (string k in thuTu)
        {
            string v = Request.Form[k];
            string hien = v == null ? "<i>(THIẾU)</i>" : (v.Length == 0 ? "<i>(rỗng)</i>" : Server.HtmlEncode(v.Length > 300 ? v.Substring(0, 300) + "… (" + v.Length + " ký tự)" : v));
            if (k == "token" && v != null && v.Length > 0)
            {
                string[] ph = v.Split('.');
                hien = ph.Length + " phần, " + v.Length + " ký tự";
                if (ph.Length == 3)
                {
                    try
                    {
                        string b = ph[1].Replace('-', '+').Replace('_', '/'); while (b.Length % 4 != 0) b += "=";
                        hien += "<br><code>" + Server.HtmlEncode(Encoding.UTF8.GetString(Convert.FromBase64String(b))) + "</code>";
                    }
                    catch { hien += " (không giải được payload)"; }
                }
            }
            sb.Append("<tr><td>" + k + "</td><td>" + hien + "</td></tr>");
        }
        foreach (string k in Request.Form.AllKeys)
            if (Array.IndexOf(thuTu, k) < 0) sb.Append("<tr><td>" + Server.HtmlEncode(k) + " <i>(ngoài danh sách)</i></td><td>" + Server.HtmlEncode(Request.Form[k]) + "</td></tr>");
        sb.Append("</table>");
        var f = Request.Files["anh"];
        if (f == null || f.ContentLength == 0) sb.Append("<p>Tệp <code>anh</code>: <i>không có</i> (được phép — ảnh là tuỳ chọn).</p>");
        else
        {
            byte[] bb = new byte[f.ContentLength]; f.InputStream.Read(bb, 0, bb.Length);
            sb.Append("<p>Tệp <code>anh</code>: " + Server.HtmlEncode(f.FileName) + " · " + Server.HtmlEncode(f.ContentType) + " · " + (f.ContentLength / 1024) + " KB" +
                      (f.ContentLength > 5 * 1024 * 1024 ? " <span class=\"do\">(QUÁ 5 MB — Help sẽ chặn)</span>" : "") + "</p>");
            sb.Append("<img src=\"data:" + Server.HtmlEncode(f.ContentType) + ";base64," + Convert.ToBase64String(bb) + "\" alt=\"ảnh nhận được\">");
        }
        noiDung = sb.ToString();
    }
</script>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex, nofollow">
    <title>Thử nhận Yêu cầu hỗ trợ</title>
    <style>
        body { font: 14px/1.5 system-ui, Arial, sans-serif; margin: 24px; color: #1f2933; }
        h1 { font-size: 18px; margin: 0 0 12px; }
        table { border-collapse: collapse; margin: 10px 0; } td, th { border: 1px solid #d8dee9; padding: 6px 10px; text-align: left; vertical-align: top; }
        th { background: #eef1fb; } code { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-size: 12px; word-break: break-all; }
        img { max-width: 100%; border: 1px solid #d8dee9; border-radius: 6px; margin-top: 8px; } .do { color: #b42318; }
    </style>
</head>
<body>
    <h1>Trang thử nhận form "Yêu cầu hỗ trợ" (thay cửa /ho-tro/gui của Help)</h1>
    <%= noiDung %>
</body>
</html>
