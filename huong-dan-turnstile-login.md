# Hướng dẫn tích hợp Cloudflare Turnstile vào trang đăng nhập

Turnstile là CAPTCHA "vô hình" của Cloudflare (miễn phí). Người thật không phải
làm gì, bot thì bị chặn. Nó là lớp chống bot ở tầng ứng dụng — dùng **kèm** rate
limit / WAF, không thay thế hoàn toàn (xem mục 7).

> File này chỉ là **tài liệu + mã mẫu để bạn dán vào host**. Không đụng gì tới
> code hiện có trong repo. `login.aspx.cs` nằm ngoài repo nên phần backend dưới
> đây là **mẫu tự viết lại**, bạn ráp vào phần xác thực username/password HIỆN CÓ.

---

## 0. Chuẩn bị (một lần)

1. Đăng ký Cloudflare, thêm domain của trường.
2. Vào **Turnstile → Add site**, chọn widget mode (khuyên dùng *Managed*), lấy:
   - **Site key** (dùng ở frontend)
   - **Secret key** (dùng ở backend — KHÔNG lộ ra ngoài)
3. Để thử trước khi có key thật, dùng **test keys**:
   - Site key `1x00000000000000000000AA` / Secret `1x0000000000000000000000000000000AA` → luôn **đạt**
   - Site key `2x00000000000000000000AB` / Secret `2x0000000000000000000000000000000AA` → luôn **chặn**

---

## 1. Sửa `login.aspx` (frontend)

### 1a. Thêm script Turnstile

Thêm vào `<head>` (sau các thẻ `<script>` hiện có):

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

### 1b. Thêm ô widget trước nút "Đăng nhập"

Đặt **trong** `<form id="formLoginSSO" runat="server">`, ngay **trước** nút
`cms_authenticate_do_login` (khoảng `login.aspx:64`):

```html
<div class="cf-turnstile"
     data-sitekey="SITE_KEY_CUA_BAN"
     data-theme="light"></div>
```

- `data-sitekey` thay bằng site key thật của bạn.
- Widget tự tạo một ô ẩn tên `cf-turnstile-response` và nạp token vào đó.
  Vì nút là `<asp:Button>` (postback), token sẽ gửi kèm lên server.

> **Mẹo chống "bấm quá nhanh":** nếu muốn chặn người dùng bấm Đăng nhập khi
> Turnstile chưa kịp tải (token rỗng → bị từ chối nhầm), thêm thuộc tính
> `data-callback="cfDungNut"` vào div trên và đoạn JS sau:

```html
<script>
  function cfDungNut() {
    // Turnstile đã xong, cho phép bấm (nếu bạn đang vô hiệu hoá nút lúc đầu)
  }
</script>
```

---

## 2. Sửa `login.aspx.cs` (backend) — mã mẫu

### 2a. Thêm `using` (nếu chưa có)

```csharp
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;   // dự án đã dùng Newtonsoft (xem help-sso.aspx)
```

### 2b. Hàm kiểm tra token

```csharp
private const string TURNSTILE_SECRET = "0x4AAAA..."; // thay bằng Secret key thật

/// <summary>
/// Gọi Cloudflare siteverify để kiểm token Turnstile.
/// Trả false khi thiếu token / sai / lỗi mạng (fail-CLOSED — xem mục 5).
/// </summary>
private bool KiemTraTurnstile(string token, string remoteIp)
{
    if (string.IsNullOrEmpty(token)) return false;

    var req = (HttpWebRequest)WebRequest.Create(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    req.Method = "POST";
    req.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
    req.Timeout = 10000;
    ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;

    string body = "secret=" + Uri.EscapeDataString(TURNSTILE_SECRET)
                + "&response=" + Uri.EscapeDataString(token)
                + "&remoteip=" + Uri.EscapeDataString(remoteIp);

    byte[] bb = Encoding.UTF8.GetBytes(body);
    req.ContentLength = bb.Length;
    using (var s = req.GetRequestStream()) s.Write(bb, 0, bb.Length);

    try
    {
        using (var res = (HttpWebResponse)req.GetResponse())
        using (var rd = new StreamReader(res.GetResponseStream(), Encoding.UTF8))
        {
            var json = JObject.Parse(rd.ReadToEnd());
            return json["success"] != null && (bool)json["success"];
        }
    }
    catch
    {
        return false;   // không với tới Turnstile → từ chối (an toàn hơn là cho qua)
    }
}
```

### 2c. Chèn kiểm tra vào đầu `cms_authenticate_do_login_Click`

```csharp
protected void cms_authenticate_do_login_Click(object sender, EventArgs e)
{
    // (1) Chặn bot TRƯỚC khi đụng tới cơ sở dữ liệu
    string turnstileToken = Request.Form["cf-turnstile-response"];
    if (!KiemTraTurnstile(turnstileToken, Request.UserHostAddress))
    {
        lblNotify.Text = "Vui lòng hoàn tất xác nhận bảo mật rồi thử lại.";
        return;   // KHÔNG chạy tiếp bước kiểm tra mật khẩu
    }

    // (2) ... TỪ ĐÂY TRỞ XUỐNG là phần xác thực username/password HIỆN CÓ của bạn,
    //     dán nguyên vào, không cần đổi gì ...
}
```

---

## 3. Test

1. Dán test keys (mục 0) vào, chạy.
2. Site key `1x...AA` → luôn đạt → đăng nhập bình thường.
3. Site key `2x...AB` → luôn chặn → thấy dòng `lblNotify` "Vui lòng hoàn tất...".
4. Xong thì thay bằng key thật.

---

## 4. Lưu ý quan trọng

- **Token dùng 1 lần, sống ~300 giây.** Mỗi lần postback trang tải lại → widget
  render lại → token mới. Nên người dùng sai mật khẩu rồi bấm lại vẫn bình thường.
- **Không xác thực bằng AJAX rồi giữ nguyên trang** mà không `turnstile.reset()`
  thì lần thứ hai sẽ bị từ chối (token đã dùng). Với postback WebForms thì không sao.
- **Fail-closed** (mục 2b `catch → return false`): khi không với tới Turnstile,
  mọi đăng nhập bị chặn. Nếu muốn ưu tiên "không làm kẹt người thật" hơn, đổi
  `catch` thành `return true` — nhưng khi đó kẻ tấn công chỉ cần chặn DNS Turnstile
  là vượt. Cân nhắc theo mức độ quan trọng của hệ thống.

---

## 5. Bonus: rate limit theo IP (kèm theo)

Dán cùng file `login.aspx.cs`:

```csharp
using System.Collections.Concurrent;
using System.Collections.Generic;

private static readonly ConcurrentDictionary<string, List<DateTime>> _logDangNhap
    = new ConcurrentDictionary<string, List<DateTime>>();
private const int MAX_LAN = 5;        // tối đa 5 lần thử
private const int CUA_SO_PHUT = 15;    // trong 15 phút

private bool QuaGioiHan(string ip)
{
    var gio = DateTime.UtcNow;
    var ds = _logDangNhap.GetOrAdd(ip, new List<DateTime>());
    lock (ds) ds.RemoveAll(t => (gio - t).TotalMinutes > CUA_SO_PHUT);
    return ds.Count >= MAX_LAN;
}

private void GhiLanThu(string ip)
{
    var ds = _logDangNhap.GetOrAdd(ip, new List<DateTime>());
    lock (ds) ds.Add(DateTime.UtcNow);
}
```

Rồi trong `cms_authenticate_do_login_Click`, ngay sau bước kiểm tra Turnstile:

```csharp
    string ip = Request.UserHostAddress;
    if (QuaGioiHan(ip))
    {
        lblNotify.Text = "Quá nhiều lần thử. Vui lòng chờ " + CUA_SO_PHUT + " phút.";
        return;
    }
    GhiLanThu(ip);   // hoặc chỉ ghi khi sai mật khẩu (tuỳ bạn)
```

**Lưu ý:** `ConcurrentDictionary` chỉ sống trong bộ nhớ → mất khi app pool tái chế,
và **không dùng chung giữa nhiều máy chủ**. Hệ thống nhiều node thì dùng Redis/DB.

---

## 6. Vị trí so với các lớp khác

```
Trình duyệt ──► Cloudflare (WAF/CDN, tùy chọn)      ← chặn layer 3/4 + bot sớm nhất
                  │
                  ▼
            login.aspx + Turnstile                  ← chặn bot layer 7 (bài này)
                  │
                  ▼
            login.aspx.cs: rate limit + verify token← chặn flood theo IP/tài khoản
                  │
                  ▼
            kiểm tra username/password (Oracle)
```

---

## 7. Giới hạn cần nhớ

Turnstile giảm đáng kể bot, nhưng **chưa phải là chống DDoS trọn vẹn**:

- Kẻ tấn công vẫn có thể flood **tầng mạng** (SYN/UDP flood) trước khi tới trang
  login → cần **Cloudflare proxy / WAF** phía trước.
- Nông trại giải captcha vẫn tồn tại (nhưng Turnstile khó hơn slider tự làm).
- Vẫn nên có **IIS Dynamic IP Restrictions** hoặc nginx `limit_req` ở hạ tầng.

Với hệ thống **đóng** (tài khoản cấp sẵn, ít người), combo hiệu quả nhất vẫn là:
**Cloudflare proxy + rate limit + Turnstile**, và nếu chỉ có nhân sự nội bộ thì
thêm **IP allowlist** cho vai trò quản trị.
