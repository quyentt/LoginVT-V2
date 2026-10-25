<%@ Page Language="C#" AutoEventWireup="true" Inherits="Apis.LoginVT.Index" EnableViewState="false" ResponseEncoding="utf-8" ContentType="application/json" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="System.Globalization" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Text.RegularExpressions" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Linq" %>
<script runat="server">
    /* =====================================================================
       MAPPING CHỨC NĂNG CHO CỔNG HELP — tải tệp JSON bằng một địa chỉ
       ---------------------------------------------------------------------
       Gõ  <ứng dụng>/mapping.aspx          → tải về mapping-chuc-nang_<ngày>_<giờ>.json
            <ứng dụng>/mapping.aspx?xem=1    → hiện JSON ngay trong trình duyệt
            <ứng dụng>/mapping.aspx?gon=1    → JSON một dòng (không thụt lề)

       Cùng nội dung với nút "Xuất mapping" ở màn Cài đặt của _v2 (assets/js/app.js → ums.app.xuatMapping,
       schema ums-help-mapping/1): TOÀN BỘ chức năng trong CSDL (mọi ứng dụng, dTrangThai = 1), không theo quyền
       của tài khoản — người dùng 2026-09-26: "phải lấy đủ trong csdl vì sẽ phải chuyển hết". Trang này để trường
       chỉ chạy v1 (không mở _v2) vẫn lấy được mapping, và để bên Help tải lại bất cứ lúc nào.

       Kế thừa Apis.LoginVT.Index (như index.aspx / help-sso.aspx): dùng phiên đang đăng nhập, chưa đăng nhập thì
       lớp cha đá về login.aspx; tài khoản phải có quyền gọi hai thủ tục dưới (quyền của màn Quản trị → Chức năng).
       KHÔNG khai Page_Load (che mất bản của lớp cha) — dùng Page_PreRender.

       Lời gọi (đúng của màn ApisCMS/chucnang, qua microservice như assets/js/api.js — form-urlencoded, Bearer JWT
       phiên, body { A: AE(json, <phần sau dấu "/" của action>) }, Data.B giải bằng AD(…, iM)):
         CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m   pkg_chung_quanlynguoidung.LayDanhSachUngDung
         CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP pkg_chung_quanlynguoidung.LayDanhSachChucNang (từng ứng dụng)
       Base URL microservice: appSetting web.config theo tiền tố action, không có thì đọc ~/Config.js (Init_API).
       Cấu hình dùng chung với help-sso.aspx: ~/App_Data/help-sso/help-sso.json (apiHost, configJs, iM) — không có
       thì dùng mặc định, không tạo tệp.

       icon  = tên biểu tượng ĐÃ chuẩn hoá FA7 như menu _v2 vẽ (bảng đổi tên đọc từ ~/_v2/assets/js/icon-fa4.js —
               không có tệp thì chỉ đổi "fa fa-x" → "fa-light fa-x"); iconRaw = giá trị gốc TENANH.
       converted = tệp màn đã có trong ~/_v2 trên MÁY CHỦ NÀY (File.Exists — bản _v2 kiểm bằng GET, cùng ý).
       legacyShell = vỏ cũ mở chức năng (TENANH bắt đầu "fa " → indexi.aspx, CLAUDE.md mục 5).
       dataIssues = lỗi dữ liệu từng dòng (code-trung, thieu-code, duong-dan-file-khong-hop-le, thieu-route,
               route-trung, icon-mac-dinh, icon-khong-hop-le) — việc sửa là của quản trị CSDL.

       BẪY ASPX: không viết nguyên thẻ đóng script trong khối runat="server" (kể cả trong chuỗi) — tách "</scr" + "ipt>".
       ===================================================================== */

    const string THU_MUC_SSO = "~/App_Data/help-sso";
    const string TEP_CAU_HINH = "help-sso.json";
    const string TEP_ICON = "~/_v2/assets/js/icon-fa4.js";
    const string THU_MUC_V2 = "~/_v2/";
    const string QL = "CMS_QuanLyNguoiDung_MH/";
    const string PQ = "pkg_chung_quanlynguoidung.";

    public class CauHinh
    {
        public string apiHost = "";          // gốc host cho base URL tương đối; rỗng = lấy từ địa chỉ đang mở
        public string configJs = "~/Config.js";
        public string iM = "AzzSystem";
    }

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

    CauHinh DocCauHinh()
    {
        try
        {
            string p = Path.Combine(Server.MapPath(THU_MUC_SSO), TEP_CAU_HINH);
            if (File.Exists(p)) return JsonConvert.DeserializeObject<CauHinh>(File.ReadAllText(p, Encoding.UTF8)) ?? new CauHinh();
        }
        catch { }
        return new CauHinh();
    }

    /* ---------- Gọi API microservice như api.js (chép từ help-sso.aspx) ---------- */
    class KetQuaApi { public bool ok; public string loi = ""; public string url = ""; public JArray data = new JArray(); public string message = ""; }

    string GocHost(CauHinh ch)
    {
        if (!string.IsNullOrEmpty(ch.apiHost)) return ch.apiHost.TrimEnd('/');
        return Request.Url.GetLeftPart(UriPartial.Authority);
    }

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
        var m = Regex.Match(js, @"(?<![\w$])" + Regex.Escape(prefix) + @"\s*:\s*(?:([A-Za-z_$][\w$]*)\s*\+\s*)?['""]([^'""]*)['""]");
        if (!m.Success) return "";
        string dau = "";
        if (m.Groups[1].Success)
        {
            var mv = Regex.Match(js, @"\bvar\s+" + Regex.Escape(m.Groups[1].Value) + @"\s*=\s*['""]([^'""]*)['""]");
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
                req.Timeout = 120000;
                req.AllowAutoRedirect = false;
                // 26/10 host UTC: API trả 401 cho lời gọi thiếu Referer của ứng dụng → gửi y như trình duyệt
                string ck = Request.Headers["Cookie"]; if (!string.IsNullOrEmpty(ck)) req.Headers["Cookie"] = ck;
                string ua = Request.UserAgent; if (!string.IsNullOrEmpty(ua)) req.UserAgent = ua;
                string ip = Request.UserHostAddress; if (!string.IsNullOrEmpty(ip)) { req.Headers["X-Forwarded-For"] = ip; req.Headers["X-Real-IP"] = ip; }
                req.Referer = DuongDanIndex();
                req.Headers["Origin"] = Request.Url.GetLeftPart(UriPartial.Authority);
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
                if (d != null && d.Type == JTokenType.Object && d["rs"] != null) d = d["rs"];
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

    string DuongDanIndex() { return Request.Url.GetLeftPart(UriPartial.Authority) + (Request.ApplicationPath ?? "/").TrimEnd('/') + "/index.aspx"; }

    /* Dữ liệu thô do TRÌNH DUYỆT gửi về (chế độ dự phòng khi máy chủ không gọi được API): POST du_lieu = JSON
       { apps: [dòng LayDanhSachUngDung], fns: { <ID ứng dụng>: [dòng LayDanhSachChucNang] }, errors: { <ID>: lỗi } }
       kèm uid = ID người đang đăng nhập (chứng minh cùng nguồn — trang có no-referrer gửi Origin: null). */
    string NhanDuLieuTuForm()
    {
        if (!string.Equals(Request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase)) return null;
        string v = Request.Form["du_lieu"];
        if (v == null) return null;
        string uidForm = (Request.Form["uid"] ?? "").Trim();
        if (uidForm.Length > 0 && string.Equals(uidForm, (user_id ?? "").Trim(), StringComparison.OrdinalIgnoreCase)) return v;
        string nguon = Request.Headers["Origin"];
        Uri u;
        if (!string.IsNullOrEmpty(nguon) && Uri.TryCreate(nguon, UriKind.Absolute, out u) && string.Equals(u.Host, Request.Url.Host, StringComparison.OrdinalIgnoreCase)) return v;
        return null;
    }

    /* Trang HTML nhỏ: trình duyệt (đúng IP + Referer người dùng, chỗ duy nhất API chấp nhận) gọi LayDanhSachUngDung rồi
       LayDanhSachChucNang từng ứng dụng, lọc còn các cột cần, POST du_lieu + uid về lại trang này (giữ nguyên ?xem / ?gon). */
    string TrangKhoiDong(CauHinh ch, string lyDo)
    {
        string prefix = QL.Substring(0, QL.IndexOf('_'));
        string baseUrl = BaseUrl(ch, prefix);
        var cfg = new Dictionary<string, object>();
        cfg["base"] = baseUrl.StartsWith("http") ? baseUrl : GocHost(ch) + baseUrl;
        cfg["ref"] = DuongDanIndex();
        cfg["iM"] = ch.iM;
        cfg["udAction"] = QL + "DSA4BSAvKRIgIikULyYFNC8m"; cfg["udFunc"] = PQ + "LayDanhSachUngDung";
        cfg["cnAction"] = QL + "DSA4BSAvKRIgIikCKTQiDyAvJgPP"; cfg["cnFunc"] = PQ + "LayDanhSachChucNang";
        var cai = new JsonSerializerSettings { StringEscapeHandling = StringEscapeHandling.EscapeHtml };
        var sb = new StringBuilder();
        sb.Append("<!DOCTYPE html><html lang='vi'><head><meta charset='utf-8'><title>Mapping chức năng</title></head>");
        sb.Append("<body style='font:15px/1.5 system-ui,Arial,sans-serif;margin:40px;color:#1f2933'>");
        sb.Append("<h1 style='font-size:20px'>Đang tạo mapping chức năng cho Cổng Help…</h1><p id='tt'>Đang chuẩn bị…</p>");
        sb.Append("<p style='color:#64748b'>Máy chủ không tự gọi được API (" + Server.HtmlEncode(lyDo) + "), nên trình duyệt lấy dữ liệu rồi gửi về máy chủ để tạo tệp. Xong sẽ tự tải về / hiện JSON.</p>");
        sb.Append("<script src='assets/js/crypto-js.js?v=32'></scr" + "ipt>");
        sb.Append("<script>(function(){");
        sb.Append("var cfg=" + JsonConvert.SerializeObject(cfg, cai) + ";var blob=" + JsonConvert.SerializeObject(Convert.ToString(lblXYZCLRVN), cai) + ";");
        sb.Append(@"var t=document.getElementById('tt');function noi(m){if(t)t.textContent=m;}
var a;try{a=JSON.parse(AD(blob,'AzzS'));}catch(ex){noi('Không giải được phiên đăng nhập: '+ex.message);return;}
var h={'Authorization':'Bearer '+(a.tokenJWT||''),'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};
function goi(action,func,them){var d={action:action,func:func,strChucNang_Id:'',strNguoiThucHien_Id:a.userId||'',strVaiTroDangNhap_Id:'',strChucNangHeThong_Id:'',strNguoiThucVai_Id:'',iM:cfg.iM};
  for(var k in them)d[k]=them[k];var key=action.substring(action.indexOf('/')+1);
  return fetch(cfg.base+'/'+action,{method:'POST',headers:h,cache:'no-store',referrer:cfg.ref,referrerPolicy:'unsafe-url',body:new URLSearchParams({A:AE(JSON.stringify(d),key)})})
    .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status+' ('+func+')');return r.json();})
    .then(function(j){if(j&&j.Success===false)throw new Error(j.Message||'Success=false ('+func+')');var dd=j&&j.Data;if(dd&&dd.B)dd=JSON.parse(AD(dd.B,cfg.iM));if(dd&&dd.rs)dd=dd.rs;return dd||[];});}
function loc(r,cols){var o={};cols.forEach(function(c){if(r[c]!==undefined&&r[c]!==null)o[c]=r[c];});return o;}
var CA=['ID','MAUNGDUNG','MA','TENUNGDUNG','TEN'];
var CC=['ID','TENCHUCNANG','MACHUCNANG','CHUCNANGCHA_ID','DUONGDANFILE','DUONGDANHIENTHI','DUONGDANHUONGDANSUDUNG','TENANH','THUTU','THUTUHIENTHI','MOTA','TENDAYDU','MAUNGDUNG'];
function post(duLieu){var f=document.createElement('form');f.method='POST';f.action=location.pathname+location.search;
  function add(n,v){var i=document.createElement('input');i.type='hidden';i.name=n;i.value=v;f.appendChild(i);}
  add('du_lieu',JSON.stringify(duLieu));add('uid',a.userId||'');document.body.appendChild(f);f.submit();}
noi('Đang lấy danh sách ứng dụng…');
goi(cfg.udAction,cfg.udFunc,{strTuKhoa:'',pageIndex:1,pageSize:1000,dTrangThai:1}).then(function(apps){
  var ket={apps:apps.map(function(r){return loc(r,CA);}),fns:{},errors:{}};var i=0;
  function tiep(){if(i>=apps.length){noi('Đang tạo tệp mapping…');post(ket);return;}
    var ap=apps[i];noi('Đang lấy chức năng '+(i+1)+'/'+apps.length+': '+(ap.TENUNGDUNG||ap.TEN||ap.ID));
    goi(cfg.cnAction,cfg.cnFunc,{versionAPI:'v1.0',strTuKhoa:'',strChung_UngDung_Id:ap.ID,strCHUCNANGCHA_Id:'',pageIndex:1,pageSize:100000,strNGUONTRUYCAP_Id:'',dTrangThai:1})
      .then(function(rows){ket.fns[ap.ID]=rows.map(function(r){return loc(r,CC);});},function(ex){ket.errors[ap.ID]=ex.message;})
      .then(function(){i++;tiep();});}
  tiep();
}).catch(function(ex){noi('Lỗi: '+ex.message+' — mở index.aspx đăng nhập lại rồi thử lại.');});
})();</scr" + "ipt></body></html>");
        return sb.ToString();
    }

    static string Cot(JToken r, params string[] ten)
    {
        var o = r as JObject; if (o == null) return "";
        foreach (string t in ten)
            foreach (var p in o.Properties())
                if (string.Equals(p.Name, t, StringComparison.OrdinalIgnoreCase))
                {
                    string v = p.Value.Type == JTokenType.Null ? "" : Convert.ToString(p.Value);
                    if (!string.IsNullOrEmpty(v)) return v.Trim();
                }
        return "";
    }

    /* ---------- Biểu tượng: đúng luật ums.iconFA4 / navIcon của _v2 ---------- */
    Dictionary<string, string> DOI = new Dictionary<string, string>();
    HashSet<string> THUONGHIEU = new HashSet<string>();
    static readonly Regex KIEU_NET = new Regex(@"(^|\s)(fa-(solid|regular|light|thin|brands|duotone|sharp)|fa[srlbdt])(\s|$)");
    static readonly Regex GLYPH = new Regex(@"(^|\s)fa-(?!(solid|regular|light|thin|brands|duotone|sharp)(\s|$))[a-z0-9-]+");

    void DocBangIcon()
    {
        try
        {
            string p = Server.MapPath(TEP_ICON);
            if (!File.Exists(p)) return;
            string js = File.ReadAllText(p, Encoding.UTF8);
            var m = Regex.Match(js, @"var\s+DOI\s*=\s*(\{[\s\S]*?\});");
            if (m.Success) foreach (var kv in JObject.Parse(m.Groups[1].Value)) DOI[kv.Key] = Convert.ToString(kv.Value);
            var t = Regex.Match(js, @"var\s+THUONGHIEU\s*=\s*(\[[\s\S]*?\]);");
            if (t.Success) foreach (var x in JArray.Parse(t.Groups[1].Value)) THUONGHIEU.Add(Convert.ToString(x));
        }
        catch { }
    }
    string IconFA4(string t)
    {
        t = (t ?? "").Trim();
        if (t.Length == 0) return "";
        if (Regex.IsMatch(t, @"^(fad|fa-duotone|fa-sharp-duotone)\s")) return Regex.Replace(t, @"^(fad|fa-duotone|fa-sharp-duotone)(\s+fa-(solid|light|regular|thin))?\s+", "fa-light ");
        var m = Regex.Match(t, @"^fa\s+(?:fa-lg\s+|fa-fw\s+)*fa-([a-z0-9-]+)(.*)$");
        if (!m.Success) return t;
        string ten = m.Groups[1].Value, them = m.Groups[2].Value;
        string moi = DOI.ContainsKey(ten) ? DOI[ten] : ten;
        if (THUONGHIEU.Contains(ten)) return "fa-brands fa-" + moi + them;
        return "fa-light fa-" + moi + them;
    }
    /* navIcon: trống → mặc định; sau đó iconChuan: không có glyph → mặc định, thiếu kiểu nét → thêm fa-light */
    string NavIcon(string raw) { string t = (raw ?? "").Trim(); return t.Length == 0 ? "fa-light fa-circle-dot" : IconFA4(t); }
    bool CoGlyph(string c) { return GLYPH.IsMatch(c ?? ""); }
    string IconChuan(string raw)
    {
        string c = NavIcon(raw);
        if (!CoGlyph(c)) return "fa-light fa-circle-dot";
        return KIEU_NET.IsMatch(c) ? c : "fa-light " + c;
    }

    /* screenUrl của app.js: đường dẫn tệp màn tính từ gốc _v2 (thêm mã ứng dụng ở đầu nếu thiếu) */
    static string ScreenUrl(string path, string appCode)
    {
        string p = (path ?? "").Replace('\\', '/').Split('?')[0].Trim();
        if (p.Length == 0 || Regex.IsMatch(p, "^https?:", RegexOptions.IgnoreCase) || p.IndexOf("..") >= 0) return "";
        p = p.TrimStart('/');
        string app = (appCode ?? "").Trim('/');
        if (app.Length > 0 && !p.ToLowerInvariant().StartsWith(app.ToLowerInvariant() + "/")) p = app + "/" + p;
        return p;
    }

    class ChucNang
    {
        public string id, name, code, parent, path, hash, help, icon, desc, scope, appId, appCode, appName;
        public int order;
    }

    /* Host để customErrors=RemoteOnly → mọi lỗi chưa bắt chỉ hiện "Runtime Error": trang tự in lỗi thật dạng JSON */
    protected void Page_Error(object sender, EventArgs e)
    {
        Exception ex = Server.GetLastError();
        if (ex == null) return;
        if (ex is HttpUnhandledException && ex.InnerException != null) ex = ex.InnerException;
        Server.ClearError();
        Response.Clear();
        Response.StatusCode = 500;
        Response.ContentType = "application/json";
        var o = new JObject();
        o["error"] = ex.GetType().Name + ": " + ex.Message;
        if (Request.QueryString["xem"] == "1") o["stack"] = ex.ToString();
        Response.Write(o.ToString(Formatting.Indented));
        Response.End();
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        Response.Clear();
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.Cache.SetNoStore();
        Response.ContentType = "application/json";
        Response.Charset = "utf-8";
        Response.TrySkipIisCustomErrors = true;   // lỗi 4xx/5xx trả đúng JSON của trang, không bị IIS thay bằng trang "502 - Web server…"
        bool xem = Request.QueryString["xem"] == "1";
        bool gon = Request.QueryString["gon"] == "1";

        string uid = (user_id ?? "").Trim();
        if (uid.Length == 0)
        {
            Response.StatusCode = 401;
            Response.Write("{\"error\":\"Chưa đăng nhập — mở index.aspx đăng nhập rồi gõ lại mapping.aspx\"}");
            Response.Flush(); HttpContext.Current.ApplicationInstance.CompleteRequest();
            return;
        }

        var ch = DocCauHinh();
        DocBangIcon();
        var errors = new JArray();

        /* [1] Ứng dụng → chức năng từng ứng dụng.
           Nguồn: (a) trình duyệt POST du_lieu về (chế độ dự phòng, xem TrangKhoiDong) — (b) máy chủ tự gọi API như trước;
           (b) hỏng mà yêu cầu là GET thì trả trang khởi động để trình duyệt làm (a). 26/10 host UTC: API từ chối lời gọi từ máy chủ. */
        JArray dsUD = null;
        var cnTheoUD = new Dictionary<string, JArray>();
        var loiTheoUD = new Dictionary<string, string>();
        bool tuTrinhDuyet = false;
        string duLieu = NhanDuLieuTuForm();
        if (duLieu != null)
        {
            try
            {
                var o = JObject.Parse(duLieu);
                dsUD = o["apps"] as JArray ?? new JArray();
                var fo = o["fns"] as JObject; if (fo != null) foreach (var pr in fo.Properties()) cnTheoUD[pr.Name] = pr.Value as JArray ?? new JArray();
                var eo = o["errors"] as JObject; if (eo != null) foreach (var pr in eo.Properties()) loiTheoUD[pr.Name] = Convert.ToString(pr.Value);
                tuTrinhDuyet = true;
            }
            catch (Exception ex)
            {
                Response.StatusCode = 400;
                var lo0 = new JObject(); lo0["error"] = "du_lieu trình duyệt gửi về không phải JSON hợp lệ"; lo0["detail"] = ex.Message;
                Response.Write(lo0.ToString(Formatting.Indented));
                Response.Flush(); HttpContext.Current.ApplicationInstance.CompleteRequest();
                return;
            }
        }
        if (dsUD == null)
        {
            var kqUD = GoiApi(ch, QL + "DSA4BSAvKRIgIikULyYFNC8m", PQ + "LayDanhSachUngDung",
                new Dictionary<string, object> { { "strTuKhoa", "" }, { "pageIndex", 1 }, { "pageSize", 1000 }, { "dTrangThai", 1 } });
            if (kqUD.loi.Length > 0)
            {
                if (string.Equals(Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase) && Request.QueryString["maychu"] != "1")
                {
                    Response.ContentType = "text/html";
                    Response.Write(TrangKhoiDong(ch, kqUD.loi.Length > 160 ? kqUD.loi.Substring(0, 160) + "…" : kqUD.loi));
                    Response.Flush(); HttpContext.Current.ApplicationInstance.CompleteRequest();
                    return;
                }
                Response.StatusCode = 502;
                var lo = new JObject(); lo["error"] = "Không đọc được danh sách ứng dụng (LayDanhSachUngDung)"; lo["detail"] = kqUD.loi; lo["url"] = kqUD.url;
                Response.Write(lo.ToString(Formatting.Indented));
                Response.Flush(); HttpContext.Current.ApplicationInstance.CompleteRequest();
                return;
            }
            dsUD = kqUD.data;
        }
        var apps = new JArray();
        var ds = new List<ChucNang>();
        foreach (var a in dsUD)
        {
            string aid = Cot(a, "ID"), acode = Cot(a, "MAUNGDUNG", "MA"), aname = Cot(a, "TENUNGDUNG", "TEN");
            var ao = new JObject(); ao["id"] = aid; ao["code"] = acode; ao["name"] = aname; apps.Add(ao);
            KetQuaApi kqCN;
            if (tuTrinhDuyet)
            {
                kqCN = new KetQuaApi();
                if (cnTheoUD.ContainsKey(aid)) kqCN.data = cnTheoUD[aid];
                else kqCN.loi = loiTheoUD.ContainsKey(aid) ? loiTheoUD[aid] : "trình duyệt không gửi dữ liệu cho ứng dụng này";
            }
            else
            kqCN = GoiApi(ch, QL + "DSA4BSAvKRIgIikCKTQiDyAvJgPP", PQ + "LayDanhSachChucNang", new Dictionary<string, object> {
                { "versionAPI", "v1.0" }, { "strTuKhoa", "" }, { "strChung_UngDung_Id", aid }, { "strCHUCNANGCHA_Id", "" },
                { "pageIndex", 1 }, { "pageSize", 100000 }, { "strNGUONTRUYCAP_Id", "" }, { "dTrangThai", 1 } });
            if (kqCN.loi.Length > 0)
            {
                var eo = new JObject(); eo["applicationId"] = aid; eo["applicationName"] = aname; eo["error"] = kqCN.loi; errors.Add(eo);
                continue;
            }
            foreach (var c in kqCN.data)
            {
                int thuTu = 0; int.TryParse(Cot(c, "THUTU", "THUTUHIENTHI"), out thuTu);
                string maUD = Cot(c, "MAUNGDUNG"); if (maUD.Length == 0) maUD = acode;
                ds.Add(new ChucNang { id = Cot(c, "ID"), name = Cot(c, "TENCHUCNANG"), code = Cot(c, "MACHUCNANG"), parent = Cot(c, "CHUCNANGCHA_ID"),
                    path = Cot(c, "DUONGDANFILE"), hash = Cot(c, "DUONGDANHIENTHI"), help = Cot(c, "DUONGDANHUONGDANSUDUNG"), icon = Cot(c, "TENANH"),
                    order = thuTu, desc = Cot(c, "MOTA"), scope = Cot(c, "TENDAYDU"), appId = aid, appCode = maUD, appName = aname });
            }
        }

        /* [2] Nhóm menu / chức năng mở màn; converted theo tệp trong ~/_v2 trên máy chủ này */
        var byId = new Dictionary<string, ChucNang>();
        foreach (var n in ds) if (n.id.Length > 0 && !byId.ContainsKey(n.id)) byId[n.id] = n;
        var nhomMenu = new JArray();
        var fns = new List<JObject>();
        string gocV2 = Server.MapPath(THU_MUC_V2);
        foreach (var n in ds)
        {
            var nhom = new List<string>(); ChucNang p; int vong = 0;
            byId.TryGetValue(n.parent, out p);
            while (p != null && vong++ < 8) { nhom.Insert(0, p.name); byId.TryGetValue(p.parent, out p); }
            if (n.path.Length == 0)
            {
                var g = new JObject(); g["groupId"] = n.id; g["code"] = n.code; g["name"] = n.name; g["parentId"] = n.parent.Length > 0 ? (JToken)n.parent : JValue.CreateNull();
                g["menuPath"] = new JArray(nhom.ToArray()); g["order"] = n.order; g["application"] = n.appCode;
                nhomMenu.Add(g);
                continue;
            }
            string url = ScreenUrl(n.path, n.appCode);
            var ph = Regex.Match(url, @"(Apis[A-Za-z0-9]+)"); var md = Regex.Match(url, @"Modules/([^/]+)", RegexOptions.IgnoreCase);
            string screen = url.Length > 0 ? Regex.Replace(url.Substring(url.LastIndexOf('/') + 1), @"\.html?$", "", RegexOptions.IgnoreCase) : "";
            bool? converted = null;
            if (url.Length == 0 || Regex.IsMatch(url, "^https?:", RegexOptions.IgnoreCase)) converted = false;
            else { try { converted = File.Exists(Path.Combine(gocV2, url.Replace('/', Path.DirectorySeparatorChar))); } catch { converted = null; } }

            var f = new JObject();
            f["functionId"] = n.id; f["code"] = n.code; f["name"] = n.name.Trim();
            var ap = new JObject(); ap["id"] = n.appId; ap["code"] = n.appCode; ap["name"] = n.appName; f["application"] = ap;
            f["subsystem"] = ph.Success ? ph.Groups[1].Value : ""; f["module"] = md.Success ? md.Groups[1].Value : "";
            f["screen"] = screen; f["file"] = url; f["route"] = n.hash;
            f["parentId"] = n.parent.Length > 0 ? (JToken)n.parent : JValue.CreateNull();
            f["menuPath"] = new JArray(nhom.ToArray()); f["order"] = n.order;
            f["icon"] = IconChuan(n.icon); f["iconRaw"] = n.icon;
            f["legacyShell"] = n.icon.Trim().StartsWith("fa ") ? "indexi.aspx" : "index.aspx";
            f["helpUrl"] = n.help; f["description"] = n.desc; f["scope"] = n.scope;
            f["converted"] = converted.HasValue ? (JToken)converted.Value : JValue.CreateNull();
            fns.Add(f);
        }

        /* [3] Lỗi dữ liệu từng dòng — như app.js */
        var demMa = new Dictionary<string, int>(); var demRoute = new Dictionary<string, HashSet<string>>();
        foreach (var f in fns)
        {
            string code = (string)f["code"], route = (string)f["route"];
            if (code.Length > 0) demMa[code] = (demMa.ContainsKey(code) ? demMa[code] : 0) + 1;
            if (route.Length > 0)
            {
                string kr = (string)f["application"]["code"] + "|" + route;
                if (!demRoute.ContainsKey(kr)) demRoute[kr] = new HashSet<string>();
                demRoute[kr].Add(((string)f["file"]).ToLowerInvariant());
            }
        }
        var demIssue = new Dictionary<string, int>();
        foreach (var f in fns)
        {
            var v = new List<string>();
            string code = (string)f["code"], route = (string)f["route"], file = (string)f["file"], iconRaw = (string)f["iconRaw"];
            if (code.Length > 0 && demMa[code] > 1) v.Add("code-trung");
            if (code.Length == 0) v.Add("thieu-code");
            if (((string)f["module"]).Length == 0 || !Regex.IsMatch(file, @"\.html?$", RegexOptions.IgnoreCase)) v.Add("duong-dan-file-khong-hop-le");
            if (route.Length == 0) v.Add("thieu-route");
            else if (demRoute[(string)f["application"]["code"] + "|" + route].Count > 1) v.Add("route-trung");
            if (iconRaw.Trim().Length == 0) v.Add("icon-mac-dinh");
            else if (!CoGlyph(NavIcon(iconRaw))) v.Add("icon-khong-hop-le");
            f["dataIssues"] = new JArray(v.ToArray());
            foreach (string k in v) demIssue[k] = (demIssue.ContainsKey(k) ? demIssue[k] : 0) + 1;
        }
        var vi = StringComparer.Create(CultureInfo.GetCultureInfo("vi-VN"), false);
        fns.Sort((a, b) =>
        {
            int r = string.CompareOrdinal((string)a["subsystem"], (string)b["subsystem"]);
            if (r == 0) r = string.CompareOrdinal((string)a["module"], (string)b["module"]);
            if (r == 0) r = vi.Compare((string)a["name"], (string)b["name"]);
            return r;
        });

        /* [4] Module tổng hợp */
        var modules = new SortedDictionary<string, JObject>(StringComparer.Ordinal);
        int daChuyen = 0;
        foreach (var f in fns)
        {
            string sub = (string)f["subsystem"], mod = (string)f["module"];
            string k = (sub.Length > 0 ? sub : ((string)f["application"]["code"]).Length > 0 ? (string)f["application"]["code"] : "?") + "/" + (mod.Length > 0 ? mod : "?");
            JObject m;
            if (!modules.TryGetValue(k, out m)) { m = new JObject(); m["moduleId"] = k; m["subsystem"] = sub; m["module"] = mod; m["functionCount"] = 0; m["converted"] = 0; modules[k] = m; }
            m["functionCount"] = (int)m["functionCount"] + 1;
            if (f["converted"].Type == JTokenType.Boolean && (bool)f["converted"]) { m["converted"] = (int)m["converted"] + 1; daChuyen++; }
        }

        var ra = new JObject();
        ra["schema"] = "ums-help-mapping/1";
        ra["purpose"] = "Danh mục Function ID của hệ thống để nạp / đồng bộ vào Cổng Help (mapping chức năng ↔ bài Help theo ngữ cảnh) và theo dõi chuyển đổi giao diện";
        var ung = new JObject(); ung["id"] = "UMS"; ung["name"] = "Hệ thống quản trị đại học"; ung["version"] = Request.Url.GetLeftPart(UriPartial.Authority) + Request.ApplicationPath.TrimEnd('/'); ra["application"] = ung;
        ra["generatedAt"] = DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'");
        ra["generatedBy"] = uid;
        ra["source"] = tuTrinhDuyet ? "database (API gọi từ trình duyệt)" : "database";
        ra["note"] = "Toàn bộ chức năng trong CSDL (mọi ứng dụng, dTrangThai = 1), không phụ thuộc quyền của tài khoản xuất. converted = tệp màn đã có trong _v2 trên máy chủ. Xuất bởi mapping.aspx (v1).";
        var counts = new JObject();
        counts["applications"] = apps.Count; counts["functions"] = fns.Count; counts["converted"] = daChuyen; counts["notConverted"] = fns.Count - daChuyen;
        counts["menuGroups"] = nhomMenu.Count; counts["modules"] = modules.Count;
        var di = new JObject(); foreach (var kv in demIssue) di[kv.Key] = kv.Value; counts["dataIssues"] = di;
        ra["counts"] = counts;
        ra["applications"] = apps;
        ra["modules"] = new JArray(modules.Values);
        ra["menuGroups"] = nhomMenu;
        ra["functions"] = new JArray(fns);
        ra["errors"] = errors;

        if (!xem) Response.AddHeader("Content-Disposition", "attachment; filename=mapping-chuc-nang_" + DateTime.Now.ToString("yyyyMMdd_HHmm") + ".json");
        Response.Write(ra.ToString(gon ? Formatting.None : Formatting.Indented));
        Response.Flush(); HttpContext.Current.ApplicationInstance.CompleteRequest();
    }
</script>
