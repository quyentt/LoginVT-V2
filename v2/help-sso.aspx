<%@ Page Language="C#" AutoEventWireup="true" Inherits="Apis.LoginVT.Index" EnableViewState="false" ResponseEncoding="utf-8" ContentType="text/html" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Security.Cryptography" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Linq" %>
<script runat="server">
    /* =====================================================================
       ĐĂNG NHẬP MỘT LẦN (SSO) SANG CỔNG HELP — trang trung gian
       ---------------------------------------------------------------------
       Yêu cầu: yeu-cau-sso-cho-doi-app.md (Help, 27/09/2026). Tóm tắt:
         1. Người ĐÃ đăng nhập app bấm "Soạn bài hướng dẫn" (menu người dùng).
         2. Trang này phát một JWT RS256 sống ~90 giây: iss / sub / email / name /
            aud = "help-master" / realm_access.roles, rồi TỰ POST sang Help
            (không đưa token lên query string — xem mục 3 của yêu cầu).
         3. Help xác thực bằng khoá công khai lấy ở help-jwks.aspx (JWKS).

       Kế thừa Apis.LoginVT.Index (như index.aspx) để dùng đúng phiên đang có:
       Page_Load của lớp cha đọc HttpContext.User (CustomPrincipal), đá về
       login.aspx khi chưa đăng nhập và điền user_id / fullname / tokenjwt.
       KHÔNG khai Page_Load ở đây (che mất bản của lớp cha) — dùng Page_PreRender.

       EMAIL VÀ VAI TRÒ LẤY QUA CHÍNH API CỦA ỨNG DỤNG (microservice), như giao
       diện đang gọi — KHÔNG dùng Apis.Login.BO / OraDB trong bin: kết nối
       OraMainDb của bin trỏ tới schema CMCDB là MỘT CSDL KHÁC (vai trò CMCDB trả
       về không có trong danh mục vai trò của hệ; đã đối chiếu 27/9). Lời gọi:
         PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung        → cột MAVAITRO (48 dòng với tài khoản thử)
         pkg_chung_quanlynguoidung.LayDanhSachNguoiDung  → tìm theo tài khoản, khớp ID → cột EMAIL
       Giao thức đúng như assets/js/api.js: form-urlencoded, Bearer <JWT phiên>,
       body { A: AE(json, <phần sau dấu "/" của action>) } với AE = XOR từng ký tự
       với khoá rồi base64 (crypto-js.js:6192); Data.B trả về giải bằng AD(…, iM).
       Base URL microservice: AppSetting.GetString(<tiền tố action>) — cùng nguồn
       Init_API() của indexi.aspx / Config.js.

       CẤU HÌNH + KHOÁ nằm NGOÀI thư mục _v2, ở ~/App_Data/help-sso/ của ứng dụng
       cha (ASP.NET không bao giờ phục vụ App_Data qua HTTP):
         help-sso.json     iss, địa chỉ Help, aud, thời gian sống… — tự tạo với
                           giá trị mặc định lần chạy đầu, sửa tay cho trường khác
         help-sso.key.xml  khoá RSA 2048 — tự sinh lần chạy đầu. Mất tệp này là
                           đổi khoá: Help đọc lại JWKS trong 10 phút, không phải hẹn.

       ?xem=1  → CHỈ hiện payload sẽ gửi + kết quả từng lời gọi, KHÔNG gửi.
                 Dùng để kiểm trên host trước khi bật thật.

       BẪY ASPX: không được viết nguyên thẻ đóng script (nhỏ hơn, gạch chéo,
       "script", lớn hơn) ở BẤT KỲ đâu trong khối runat="server" — kể cả trong
       chuỗi hay chú thích: bộ phân tích cắt khối C# tại đó → "Runtime Error"
       mà Page_Error không bắt được (đã vấp HAI lần 27/9). Luôn tách "</scr" + "ipt>".
       ===================================================================== */

    const string THU_MUC = "~/App_Data/help-sso";
    const string TEP_CAU_HINH = "help-sso.json";

    public class CauHinh
    {
        public string iss = "ums-qtdh";                                 // mã trường — cố định, KHÔNG phải địa chỉ web
        public string helpUrl = "https://con98.api-apis.com/help-master";// gốc Cổng Help (đổi /help-master ↔ /help ở đây)
        public string postPath = "/dang-nhap-truong";                    // đường nhận token của Help
        public string aud = "help-master";                               // Help KIỂM claim này, sai là 401
        public int ttlSeconds = 90;                                      // Help yêu cầu 60–120 giây
        public string rolesClaim = "realm_access";                       // Help mặc định đọc realm_access.roles
        public string keyFile = "help-sso.key.xml";
        // --- Lời gọi API của ứng dụng (chép từ _v2/assets/config/site.config.js và màn CMS Người dùng) ---
        public string apiHost = "";                                      // gốc host cho base URL tương đối; rỗng = tự lấy từ địa chỉ đang mở
        public string configJs = "~/Config.js";                          // tệp Init_API() của ứng dụng cha — nguồn base URL khi web.config không khai
        public string iM = "AzzSystem";                                  // khoá giải Data.B (session.js)
        public string rolesAction = "CMS_QuanTri01_MH/DSA4BRIXICgVMy4PJjQuKAU0LyYP";
        public string rolesFunc = "PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung";
        public string roleColumn = "MAVAITRO";
        public string userAction = "CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP";
        public string userFunc = "pkg_chung_quanlynguoidung.LayDanhSachNguoiDung";
        public string emailColumn = "EMAIL";
        public bool emailFromLoginDb = true;                             // bản ghi phía API không có email → lấy email của tài khoản ở CSDL đăng nhập (UserBo.GetDetail)
    }

    static string B64u(byte[] b) { return Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_'); }

    /* AE / AD của crypto-js.js: XOR từng ký tự (UTF-16) với khoá lặp vòng, rồi UTF-8 → base64 và ngược lại */
    static string AE(string r, string t)
    {
        var sb = new StringBuilder(r.Length);
        for (int n = 0; n < r.Length; n++) sb.Append((char)(r[n] ^ t[n % t.Length]));
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(sb.ToString()));
    }
    static string AD(string r, string t)
    {
        string s = Encoding.UTF8.GetString(Convert.FromBase64String(r));
        var sb = new StringBuilder(s.Length);
        for (int n = 0; n < s.Length; n++) sb.Append((char)(s[n] ^ t[n % t.Length]));
        return sb.ToString();
    }

    string ThuMuc() { return Server.MapPath(THU_MUC); }

    CauHinh DocCauHinh()
    {
        string dir = ThuMuc(), p = Path.Combine(dir, TEP_CAU_HINH);
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
        if (!File.Exists(p))
        {
            File.WriteAllText(p, JsonConvert.SerializeObject(new CauHinh(), Formatting.Indented), new UTF8Encoding(false));
        }
        return JsonConvert.DeserializeObject<CauHinh>(File.ReadAllText(p, Encoding.UTF8)) ?? new CauHinh();
    }

    /* Khoá RSA 2048 dùng CSP kiểu 24 (PROV_RSA_AES) để ký SHA-256 được trên mọi bản .NET 4.x.
       PersistKeyInCsp = false: khoá chỉ sống trong tệp XML, không ghi vào kho khoá Windows. */
    RSACryptoServiceProvider TaiKhoa(CauHinh ch, out string kid)
    {
        string p = Path.Combine(ThuMuc(), ch.keyFile);
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
        using (var sha = SHA256.Create())
            kid = B64u(sha.ComputeHash(rsa.ExportParameters(false).Modulus)).Substring(0, 16);
        return rsa;
    }

    /* ---------- Gọi API microservice như api.js ---------- */
    class KetQuaApi { public bool ok; public string loi = ""; public string url = ""; public JArray data = new JArray(); public string message = ""; }

    string GocHost(CauHinh ch)
    {
        if (!string.IsNullOrEmpty(ch.apiHost)) return ch.apiHost.TrimEnd('/');
        return Request.Url.GetLeftPart(UriPartial.Authority);
    }

    /* Base URL của một microservice theo tiền tố action. Thứ tự: appSetting của web.config (cách indexi.aspx
       dựng Init_API), không có thì đọc Config.js của ứng dụng cha — tệp dạng
           var url = "https://…";  return { CMS: url + '/cmsapi/api', … }
       (host con98 chỉ khai ở Config.js — đã thấy 27/9). Bỏ các dòng chú thích // trước khi tìm. */
    string BaseUrl(CauHinh ch, string prefix)
    {
        string v = "";
        try { v = Apis.CommonV1.Base.AppSetting.GetString(prefix); } catch { }
        if (!string.IsNullOrEmpty(v)) return v;
        string p = Server.MapPath(ch.configJs);
        if (!File.Exists(p)) return "";
        var dong = new List<string>();
        foreach (string d in File.ReadAllLines(p, Encoding.UTF8)) if (!d.TrimStart().StartsWith("//")) dong.Add(d);
        string js = string.Join("\n", dong.ToArray());
        var m = System.Text.RegularExpressions.Regex.Match(js, @"(?<![\w$])" + System.Text.RegularExpressions.Regex.Escape(prefix) + @"\s*:\s*(?:([A-Za-z_$][\w$]*)\s*\+\s*)?['""]([^'""]*)['""]");
        if (!m.Success) return "";
        string dau = "";
        if (m.Groups[1].Success)
        {
            var mv = System.Text.RegularExpressions.Regex.Match(js, @"\bvar\s+" + System.Text.RegularExpressions.Regex.Escape(m.Groups[1].Value) + @"\s*=\s*['""]([^'""]*)['""]");
            if (mv.Success) dau = mv.Groups[1].Value;
        }
        return dau + m.Groups[2].Value;
    }

    KetQuaApi GoiApi(CauHinh ch, string action, string func, Dictionary<string, object> them)
    {
        var kq = new KetQuaApi();
        string prefix = action.Substring(0, action.IndexOf('_'));
        string baseUrl = BaseUrl(ch, prefix);
        if (string.IsNullOrEmpty(baseUrl)) { kq.loi = "Không tìm thấy base URL cho tiền tố \"" + prefix + "\" (web.config appSettings và " + ch.configJs + ")"; return kq; }
        string goc = GocHost(ch);
        string url = (baseUrl.StartsWith("http") ? baseUrl : goc + baseUrl) + "/" + action;

        var data = new Dictionary<string, object>();
        data["action"] = action;
        data["func"] = func;
        foreach (var kv in them) data[kv.Key] = kv.Value;
        if (!data.ContainsKey("strChucNang_Id")) data["strChucNang_Id"] = "";
        data["strNguoiThucHien_Id"] = user_id;
        data["strVaiTroDangNhap_Id"] = app_id ?? "";
        if (!data.ContainsKey("strChucNangHeThong_Id")) data["strChucNangHeThong_Id"] = "";
        data["strNguoiThucVai_Id"] = "";
        data["iM"] = ch.iM;
        string key = action.Substring(action.IndexOf('/') + 1);
        string body = "A=" + HttpUtility.UrlEncode(AE(JsonConvert.SerializeObject(data), key));

        // Sau proxy Request.Url có thể là http:// dù thật là https:// → thử scheme hiện có, hỏng thì đổi scheme
        string[] thu = baseUrl.StartsWith("http") ? new[] { url } : new[] { url, url.StartsWith("https://") ? "http://" + url.Substring(8) : "https://" + url.Substring(7) };
        foreach (string u in thu)
        {
            kq.url = u;
            try
            {
                ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
                var req = (HttpWebRequest)WebRequest.Create(u);
                req.Method = "POST";
                req.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
                req.Headers["Authorization"] = "Bearer " + tokenjwt;
                req.Timeout = 30000;
                req.AllowAutoRedirect = false;
                byte[] bb = Encoding.UTF8.GetBytes(body);
                req.ContentLength = bb.Length;
                using (var s = req.GetRequestStream()) s.Write(bb, 0, bb.Length);
                string txt;
                using (var res = (HttpWebResponse)req.GetResponse())
                using (var rd = new StreamReader(res.GetResponseStream(), Encoding.UTF8)) txt = rd.ReadToEnd();
                var j = JObject.Parse(txt);
                kq.message = Convert.ToString((object)j["Message"]) ?? "";
                kq.ok = j["Success"] != null && j["Success"].Type == JTokenType.Boolean && (bool)j["Success"];
                var d = j["Data"];
                if (d != null && d.Type == JTokenType.Object && d["B"] != null) d = JToken.Parse(AD((string)d["B"], ch.iM));
                if (d != null && d.Type == JTokenType.Array) kq.data = (JArray)d;
                if (!kq.ok && kq.loi.Length == 0) kq.loi = "Success=false" + (kq.message.Length > 0 ? " — " + kq.message : "");
                return kq;
            }
            catch (WebException ex)
            {
                string chiTiet = ex.Message;
                var r2 = ex.Response as HttpWebResponse;
                if (r2 != null)
                {
                    try { using (var rd = new StreamReader(r2.GetResponseStream())) chiTiet = "HTTP " + (int)r2.StatusCode + " " + rd.ReadToEnd(); } catch { }
                    if (r2.StatusCode == HttpStatusCode.MovedPermanently || r2.StatusCode == HttpStatusCode.Found || r2.StatusCode == HttpStatusCode.TemporaryRedirect)
                        chiTiet = "HTTP " + (int)r2.StatusCode + " chuyển hướng → " + r2.Headers["Location"];
                }
                kq.loi = chiTiet;
                if (kq.loi.Length > 600) kq.loi = kq.loi.Substring(0, 600) + "…";
            }
            catch (Exception ex) { kq.loi = ex.GetType().Name + ": " + ex.Message; }
        }
        return kq;
    }

    static string Cot(JToken r, string ten)
    {
        var o = r as JObject; if (o == null) return "";
        foreach (var p in o.Properties())
            if (string.Equals(p.Name, ten, StringComparison.OrdinalIgnoreCase)) return Convert.ToString(p.Value).Trim();
        return "";
    }
    static string TenCot(JArray a)
    {
        if (a == null || a.Count == 0 || !(a[0] is JObject)) return "(không có dòng)";
        var l = new List<string>(); foreach (var p in ((JObject)a[0]).Properties()) l.Add(p.Name);
        return string.Join(", ", l.ToArray());
    }

    /* Cột nào có chữ MAIL trong bản ghi: "TÊN = giá trị" — để biết email nằm ở cột nào khi cột EMAIL trống. */
    static string CotMail(JToken r)
    {
        var o = r as JObject; if (o == null) return "(không có dòng)";
        var l = new List<string>();
        foreach (var p in o.Properties())
            if (p.Name.IndexOf("MAIL", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                string gt = Convert.ToString(p.Value).Trim();
                l.Add(p.Name + " = " + (gt.Length > 0 ? gt : "(trống)"));
            }
        return l.Count > 0 ? string.Join("; ", l.ToArray()) : "(KHÔNG có cột nào có chữ MAIL)";
    }

    /* Tên tài khoản của người đang đăng nhập — lấy từ HttpContext.User (CustomPrincipal) bằng phản chiếu
       để không phụ thuộc tên thuộc tính; không có thì dùng họ tên làm từ khoá tìm */
    string TuKhoaNguoiDung()
    {
        try
        {
            var u = HttpContext.Current.User;
            if (u != null)
                foreach (string ten in new[] { "Username", "UserName", "TaiKhoan", "Account" })
                {
                    var p = u.GetType().GetProperty(ten);
                    if (p != null) { string v = Convert.ToString(p.GetValue(u, null)); if (!string.IsNullOrEmpty(v)) return v.Trim(); }
                }
            if (u != null && u.Identity != null && !string.IsNullOrEmpty(u.Identity.Name)) return u.Identity.Name.Trim();
        }
        catch { }
        return (fullname ?? "").Trim();
    }

    string Loi(string tieuDe, string chiTiet)
    {
        return "<div class=\"box loi\"><h1>" + Server.HtmlEncode(tieuDe) + "</h1><p>" + Server.HtmlEncode(chiTiet) + "</p>" +
               "<p><a href=\"index.aspx\">Về trang chính</a></p></div>";
    }

    protected string noiDung = "";
    protected bool tuGui = false;

    /* Host để customErrors=RemoteOnly nên mọi lỗi chưa bắt chỉ hiện "Runtime Error" — trang tự in lỗi thật
       (kiểu + thông điệp; kèm stack khi ?xem=1) để không phải lên máy chủ đọc nhật ký (đã vấp 27/9). */
    protected void Page_Error(object sender, EventArgs e)
    {
        Exception ex = Server.GetLastError();
        if (ex == null) return;
        if (ex is HttpUnhandledException && ex.InnerException != null) ex = ex.InnerException;
        bool xem = Request.QueryString["xem"] == "1";
        string chiTiet = xem ? ex.ToString() : (ex.GetType().Name + ": " + ex.Message);
        Server.ClearError();
        Response.Clear();
        Response.ContentType = "text/html";
        Response.Write("<!DOCTYPE html><html lang=\"vi\"><head><meta charset=\"utf-8\"><title>Sang Cổng Help — lỗi</title>" +
            "<style>body{font:15px/1.5 system-ui,Arial,sans-serif;margin:24px;color:#1f2933}h1{color:#b42318;font-size:20px}pre{background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;overflow:auto;font-size:13px;white-space:pre-wrap}</style></head><body>" +
            "<h1>Không sang được Cổng Help</h1><p>Lỗi phía máy chủ khi chuẩn bị token. Báo quản trị kèm nội dung dưới đây.</p>" +
            "<pre>" + Server.HtmlEncode(chiTiet) + "</pre><p><a href=\"index.aspx\">Về trang chính</a></p></body></html>");
        Response.End();
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.Cache.SetNoStore();
        Response.AddHeader("Referrer-Policy", "no-referrer");

        string uid = (user_id ?? "").Trim();
        if (uid.Length == 0) { noiDung = Loi("Chưa đăng nhập", "Không thấy phiên đăng nhập. Hãy đăng nhập lại rồi bấm \"Soạn bài hướng dẫn\" một lần nữa."); return; }

        bool xem = Request.QueryString["xem"] == "1";
        CauHinh ch;
        try { ch = DocCauHinh(); }
        catch (Exception ex)
        {
            noiDung = Loi("Không đọc / tạo được cấu hình SSO", "Thư mục " + THU_MUC + " (" + ex.Message + "). Cấp quyền ghi cho tài khoản chạy IIS vào App_Data của ứng dụng, hoặc tạo tay tệp " + TEP_CAU_HINH + ".");
            return;
        }

        // 1. Vai trò — như giao diện gọi (site.config.js api.endpoints.roles)
        var kqVaiTro = GoiApi(ch, ch.rolesAction, ch.rolesFunc, new Dictionary<string, object> { { "strChucNang_Id", "" } });
        var roles = new List<string>();
        foreach (var r in kqVaiTro.data) { string m = Cot(r, ch.roleColumn); if (m.Length > 0 && !roles.Contains(m)) roles.Add(m); }

        // 2. Email — danh sách người dùng theo từ khoá tài khoản, khớp đúng ID
        //    API chỉ tìm theo CHUỖI CON, không có lời gọi lấy theo ID. Từ khoá có thể rất ngắn (tài khoản thử tên "01"
        //    nằm ở dòng 1501–2000 của kết quả) → lật tối đa 10 trang × 500; không thấy thì thử họ tên.
        string tuKhoa = TuKhoaNguoiDung();
        KetQuaApi kqNguoiDung = null;
        JToken dongNguoiDung = null;
        var cacTuKhoa = new List<string>(); cacTuKhoa.Add(tuKhoa);
        string hoTen = (fullname ?? "").Trim();
        if (hoTen.Length > 0 && hoTen != tuKhoa) cacTuKhoa.Add(hoTen);
        foreach (string tk in cacTuKhoa)
        {
            for (int trang = 1; trang <= 10 && dongNguoiDung == null; trang++)
            {
                kqNguoiDung = GoiApi(ch, ch.userAction, ch.userFunc, new Dictionary<string, object> {
                    { "versionAPI", "v1.0" }, { "strTuKhoa", tk }, { "pageIndex", trang }, { "pageSize", 500 }, { "dTrangThai", 1 },
                    { "strChung_DonVi_Id", "" }, { "strVaiTro_Id", "" }, { "strPhanLoaiDoiTuong", "" } });
                foreach (var r in kqNguoiDung.data) if (string.Equals(Cot(r, "ID"), uid, StringComparison.OrdinalIgnoreCase)) { dongNguoiDung = r; break; }
                if (kqNguoiDung.loi.Length > 0 || kqNguoiDung.data.Count < 500) break;
            }
            if (dongNguoiDung != null) { tuKhoa = tk; break; }
            if (kqNguoiDung != null && kqNguoiDung.loi.Length > 0) break;
        }
        string email = dongNguoiDung != null ? Cot(dongNguoiDung, ch.emailColumn) : "";
        string nguonEmail = email.Length > 0 ? "API (Quản trị → Người dùng)" : "";
        // Bản ghi phía API không có email → email của CHÍNH tài khoản đăng nhập ở CSDL xác thực. Ở trường thật hai nơi là một
        // CSDL; host thử con98 thì lệch (đăng nhập = CMCDB, API = hệ khác) nên tài khoản thử chỉ có email ở CSDL đăng nhập.
        string loiDangNhapDb = "";
        string cotDangNhapDb = "";
        if (email.Length == 0 && ch.emailFromLoginDb)
        {
            try
            {
                var dt = Apis.Login.BO.Base.UserBo.GetDetail(uid);   // hàm STATIC
                if (dt == null || dt.Rows.Count == 0) cotDangNhapDb = "(không có dòng nào cho tài khoản này)";
                else
                {
                    var tenCot = new List<string>(); var cotMail = new List<string>();
                    foreach (System.Data.DataColumn c in dt.Columns)
                    {
                        tenCot.Add(c.ColumnName);
                        if (c.ColumnName.IndexOf("MAIL", StringComparison.OrdinalIgnoreCase) >= 0)
                        {
                            string gt = Convert.ToString(dt.Rows[0][c]).Trim();
                            cotMail.Add(c.ColumnName + " = " + (gt.Length > 0 ? gt : "(trống)"));
                        }
                    }
                    cotDangNhapDb = "cột: " + string.Join(", ", tenCot.ToArray()) +
                        (cotMail.Count > 0 ? " · cột có chữ MAIL: " + string.Join("; ", cotMail.ToArray()) : " · KHÔNG có cột nào có chữ MAIL");
                }
                if (dt != null && dt.Rows.Count > 0)
                    foreach (System.Data.DataColumn c in dt.Columns)
                        if (string.Equals(c.ColumnName, ch.emailColumn, StringComparison.OrdinalIgnoreCase)) { email = Convert.ToString(dt.Rows[0][c]).Trim(); break; }
                if (email.Length > 0) nguonEmail = "CSDL đăng nhập (LayThongTinNguoiDung) — bản ghi phía API không có email";
            }
            catch (Exception ex) { loiDangNhapDb = ex.GetType().Name + ": " + ex.Message; }
        }
        string ten = (fullname ?? "").Trim();
        if (ten.Length == 0 && dongNguoiDung != null) ten = Cot(dongNguoiDung, "TENDAYDU");

        long now = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds;
        var payload = new Dictionary<string, object>();
        payload["iss"] = ch.iss;
        payload["sub"] = uid;
        payload["email"] = email;
        if (ten.Length > 0) payload["name"] = ten;
        payload["aud"] = ch.aud;
        payload["iat"] = now;
        payload["exp"] = now + Math.Max(60, Math.Min(120, ch.ttlSeconds));
        payload["jti"] = Guid.NewGuid().ToString("N");
        var rolesObj = new Dictionary<string, object>(); rolesObj["roles"] = roles;
        payload[string.IsNullOrEmpty(ch.rolesClaim) ? "realm_access" : ch.rolesClaim] = rolesObj;

        string dich = ch.helpUrl.TrimEnd('/') + ch.postPath;

        if (xem)
        {
            var sb = new StringBuilder();
            sb.Append("<div class=\"box\"><h1>Xem thử SSO sang Cổng Help — KHÔNG gửi</h1>");
            sb.Append("<p>Gửi tới: <code>" + Server.HtmlEncode(dich) + "</code></p>");
            string duongJwks = new Uri(Request.Url, "help-jwks.aspx").AbsolutePath;
            sb.Append("<p>JWKS (đăng ký với Help): <code id=\"jwks\">" + Server.HtmlEncode(duongJwks) + "</code>" +
                      "<script>document.getElementById('jwks').textContent=location.origin+" + JsonConvert.SerializeObject(duongJwks) + ";</scr" + "ipt></p>");
            sb.Append("<p>Cấu hình: <code>" + Server.HtmlEncode(Path.Combine(ThuMuc(), TEP_CAU_HINH)) + "</code></p>");
            sb.Append("<p>Vai trò (" + Server.HtmlEncode(ch.rolesFunc) + ") · <code>" + Server.HtmlEncode(kqVaiTro.url) + "</code>: " +
                      (kqVaiTro.loi.Length > 0 ? "<span class=\"do\">LỖI " + Server.HtmlEncode(kqVaiTro.loi) + "</span>" :
                       kqVaiTro.data.Count + " dòng, cột <code>" + Server.HtmlEncode(TenCot(kqVaiTro.data)) + "</code>, " + roles.Count + " mã " + Server.HtmlEncode(ch.roleColumn)) + "</p>");
            sb.Append("<p>Người dùng (" + Server.HtmlEncode(ch.userFunc) + ", từ khoá <b>" + Server.HtmlEncode(tuKhoa) + "</b>): " +
                      (kqNguoiDung.loi.Length > 0 ? "<span class=\"do\">LỖI " + Server.HtmlEncode(kqNguoiDung.loi) + "</span>" :
                       kqNguoiDung.data.Count + " dòng, " + (dongNguoiDung != null ? "ĐÃ khớp ID" : "<span class=\"do\">KHÔNG có dòng nào khớp ID người đang đăng nhập</span>")) + "</p>");
            if (dongNguoiDung != null) sb.Append("<p>Bản ghi phía API: tài khoản <b>" + Server.HtmlEncode(Cot(dongNguoiDung, "TAIKHOAN")) + "</b>, tên <b>" + Server.HtmlEncode(Cot(dongNguoiDung, "TENDAYDU")) + "</b></p>");
            if (dongNguoiDung != null) sb.Append("<p>Cột của bản ghi phía API: <code>" + Server.HtmlEncode(TenCot(new JArray(dongNguoiDung.DeepClone()))) + "</code><br>Cột có chữ MAIL: <code>" + Server.HtmlEncode(CotMail(dongNguoiDung)) + "</code></p>");
            if (cotDangNhapDb.Length > 0) sb.Append("<p>CSDL đăng nhập — " + Server.HtmlEncode(cotDangNhapDb) + "</p>");
            sb.Append("<p>Cột email đang cấu hình: <code>" + Server.HtmlEncode(ch.emailColumn) + "</code> — email nằm ở cột khác thì sửa <code>emailColumn</code> trong <code>help-sso.json</code> rồi tải lại trang.</p>");
            if (email.Length > 0) sb.Append("<p>Nguồn email: " + Server.HtmlEncode(nguonEmail) + "</p>");
            if (loiDangNhapDb.Length > 0) sb.Append("<p class=\"do\">Lỗi đọc CSDL đăng nhập: " + Server.HtmlEncode(loiDangNhapDb) + "</p>");
            if (email.Length == 0) sb.Append("<p class=\"do\">Tài khoản chưa có email → Help sẽ trả 401. Bổ sung ở Quản trị → Người dùng.</p>");
            sb.Append("<h2>Payload</h2><pre>" + Server.HtmlEncode(JsonConvert.SerializeObject(payload, Formatting.Indented)) + "</pre>");
            sb.Append("<p><a href=\"help-sso.aspx\">Gửi thật</a> · <a href=\"index.aspx\">Về trang chính</a></p></div>");
            noiDung = sb.ToString();
            return;
        }

        if (kqVaiTro.loi.Length > 0) { noiDung = Loi("Không đọc được vai trò của bạn", kqVaiTro.loi); return; }
        if (kqNguoiDung.loi.Length > 0) { noiDung = Loi("Không đọc được thông tin người dùng", kqNguoiDung.loi); return; }
        if (email.Length == 0)
        {
            noiDung = Loi("Tài khoản chưa có email", "Cổng Help yêu cầu mỗi người soạn bài phải có email. Nhờ quản trị bổ sung email cho tài khoản ở Quản trị hệ thống → Người dùng, rồi thử lại.");
            return;
        }

        string token;
        try
        {
            string kid;
            using (var rsa = TaiKhoa(ch, out kid))
            {
                var header = new Dictionary<string, object>();
                header["alg"] = "RS256"; header["typ"] = "JWT"; header["kid"] = kid;
                string phan = B64u(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(header))) + "." +
                              B64u(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(payload)));
                byte[] chuKy = rsa.SignData(Encoding.UTF8.GetBytes(phan), "SHA256");
                token = phan + "." + B64u(chuKy);
            }
        }
        catch (Exception ex)
        {
            noiDung = Loi("Không ký được token", ex.GetType().Name + ": " + ex.Message + ". Kiểm quyền ghi thư mục " + THU_MUC + " và tệp " + ch.keyFile + ".");
            return;
        }

        tuGui = true;
        noiDung = "<div class=\"box\"><h1>Đang chuyển sang Cổng Help…</h1>" +
                  "<p>Nếu không tự chuyển trong vài giây, bấm nút bên dưới.</p>" +
                  "<form method=\"post\" action=\"" + Server.HtmlEncode(dich) + "\" id=\"f\">" +
                  "<input type=\"hidden\" name=\"token\" value=\"" + Server.HtmlEncode(token) + "\">" +
                  "<button type=\"submit\">Tiếp tục sang Cổng Help</button></form>" +
                  "<p><a href=\"index.aspx\">Về trang chính</a></p></div>";
    }
</script>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="referrer" content="no-referrer">
    <meta name="robots" content="noindex, nofollow">
    <title>Sang Cổng Help</title>
    <style>
        body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
               font: 15px/1.5 system-ui, "Segoe UI", Arial, sans-serif; background: #f3f5f8; color: #1f2933; }
        .box { background: #fff; border-radius: 12px; box-shadow: 0 8px 30px rgba(15, 23, 42, .08); padding: 28px 32px; max-width: 760px; width: calc(100% - 32px); }
        h1 { font-size: 20px; margin: 0 0 10px; } h2 { font-size: 15px; margin: 18px 0 6px; }
        p { margin: 8px 0; } .do { color: #b42318; } .loi h1 { color: #b42318; }
        code { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-size: 13px; word-break: break-all; }
        pre { background: #0f172a; color: #e2e8f0; padding: 12px 14px; border-radius: 8px; font-size: 13px; overflow: auto; }
        button { font: inherit; padding: 8px 16px; border-radius: 8px; border: 0; background: #1d4ed8; color: #fff; cursor: pointer; }
        a { color: #1d4ed8; }
    </style>
</head>
<body>
    <%= noiDung %>
    <% if (tuGui) { %><script>document.getElementById('f').submit();</script><% } %>
</body>
</html>
