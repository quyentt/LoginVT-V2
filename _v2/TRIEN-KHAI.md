# Triển khai bộ giao diện mới lên máy chủ

## 1. Chép thư mục

Chép nguyên `_v2/` vào **thư mục gốc của ứng dụng**, ngang hàng với
`index.aspx`, `Config.js`, `bin/`:

```
<ứng dụng>/
├─ index.aspx          ← vỏ cũ, giữ nguyên
├─ indexi.aspx         ← vỏ cũ, giữ nguyên
├─ Config.js           ← Init_API — dùng khi `_v2/Config.js` không có
├─ bin/                ← chứa Apis.LoginVT.dll
└─ _v2/             ← chép vào đây
   ├─ index.aspx       ← MỞ TỆP NÀY
   ├─ index.html       ← chỉ để xem trên máy, chế độ dữ liệu dựng thử
   ├─ assets/
   ├─ ApisTaiChinh/    ← màn hình đã chuyển đổi, cùng cây thư mục với dự án gốc
   │  └─ Modules/danhmucheso/{html,scripts}/…
   └─ screens/         ← màn hình MẪU dữ liệu cứng, chỉ dùng khi dựng thử
```

Mở: `https://<tên miền>/<ứng dụng>/_v2/index.aspx`

Mở `…/_v2/` (không ghi tên tệp) thì IIS trả `index.html` trước `index.aspx`.
`index.html` tự chuyển sang `index.aspx` khi không chạy trên `localhost`, nên
không còn rơi vào dữ liệu mẫu. Muốn cố ý xem dữ liệu mẫu trên máy chủ:
`…/_v2/index.html?demo`.

Phải **đăng nhập trước** ở `login.aspx` như bình thường — vỏ mới dùng lại
đúng phiên đó, không có cơ chế đăng nhập riêng.

## 2. Ba thứ vỏ ASPX lấy từ máy chủ

`_v2/index.aspx` khai `Inherits="Apis.LoginVT.Index"` — dùng lại code-behind
của `index.aspx` hiện hành, **không thêm biến máy chủ nào mới**:

| Thứ | Nguồn | Dùng làm gì |
|---|---|---|
| `AXYZCLRVN()` | `<%= lblXYZCLRVN %>` | Blob phiên đã mã hoá: userId, tokenJWT, appId, rootPath… |
| `AE()` / `AD()` | `assets/vendor/crypto/crypto-js.js` (trong `_v2`) | Giải blob, mã hoá payload gửi lên API |
| `Init_API()` | `_v2/Config.js` nếu có, không thì `../Config.js` | Bảng 29 base URL microservice |

Thiếu bất kỳ thứ nào, màn hình sẽ **báo rõ thiếu cái gì** thay vì hỏng im lặng.

### `_v2` tự chứa tệp tĩnh (từ 2026-09-29)

Mọi tệp TĨNH mà `_v2` từng lấy của ứng dụng cha nay nằm trong `_v2`:

| Tệp | Trước | Nay |
|---|---|---|
| `crypto-js.js` (có AE / AD) | `../assets/js/crypto-js.js` | `assets/vendor/crypto/crypto-js.js` — bản sao nguyên văn; **không thay bằng crypto-js tải từ nguồn ngoài** (mất AE / AD) |
| Ảnh nút Microsoft, Keycloak | `../assets/images/…` | `assets/img/…` |
| `Config.js` | `../Config.js` | chép `Config.js` của host vào `_v2/` là `index.aspx` tự dùng bản đó; chưa chép thì vẫn lấy bản cha |
| `encrypt.js` (trang đăng nhập) | `../App_Themes/Plugins/encrypt/encrypt.js` | chép từ host vào `_v2/assets/vendor/encrypt/encrypt.js` là `login.aspx` tự dùng; chưa chép thì vẫn lấy bản cha |

Hai tệp cuối không có trong kho mã (mỗi host một bản) nên gói deploy không mang theo — chép một lần trên host.

Vẫn cần ứng dụng cha, KHÔNG chép về được vì là mã / dữ liệu phía máy chủ: `bin/` (code-behind `Apis.LoginVT.*`),
`Web.config`, `App_Data/help-sso/`, `Handler/*.ashx` (tải tệp lên), `Pages/ForgetPass.aspx` + `Support.aspx`,
`Upload/` (tệp người dùng tải lên và phôi in `Upload/Files/PrintTemplate/`).

## 3. Nếu đặt ở thư mục khác

`_v2/index.aspx` không còn đường dẫn nào phải sửa nếu `Config.js` đã nằm trong `_v2`. Chưa có thì `../Config.js`
phải trỏ đúng tệp của ứng dụng cha.

Đặt lại `api.logoutUrl` trong `assets/config/site.config.js` nếu trang
đăng xuất không nằm ở `<gốc ứng dụng>/Logout.aspx`.

## 4. Đổi màu, logo, tên hệ thống

Sửa **duy nhất** `assets/config/site.config.js` — không cần mở tệp CSS nào.
Xem chú thích trong chính tệp đó.

## 5. Thêm màn hình đã chuyển đổi

Màn hình mới đặt **đúng cây thư mục của dự án gốc**, bên trong `_v2/`.
Không phải khai báo ở đâu cả — có tệp là chức năng tự bật.

Hệ cũ nạp `<gốc>/<MAUNGDUNG><DUONGDANFILE>` (`Core/systemroot.js:1002`), vỏ
mới nạp `<gốc>/_v2/<MAUNGDUNG><DUONGDANFILE>`:

| Bảng chức năng | Giá trị |
|---|---|
| `MAUNGDUNG` | `ApisTaiChinh` |
| `DUONGDANFILE` | `/Modules/danhmucheso/html/hethonghoadon.html` |
| Hệ cũ nạp | `ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html` |
| Vỏ mới nạp | `_v2/ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html` |

Mỗi màn hình gồm hai tệp, giống bản gốc:

```
_v2/ApisTaiChinh/Modules/danhmucheso/
├─ html/hethonghoadon.html      <div id="hethonghoadon"></div>
│                               <script src="../scripts/hethonghoadon.js"></script>
└─ scripts/hethonghoadon.js     ums.crud({ … })
```

`src` trong tệp HTML tính **theo vị trí tệp HTML** (`../scripts/…`), script
chạy tuần tự nên script nội tuyến phía sau luôn thấy được tệp .js phía trước.

Chưa có tệp thì chức năng hiện *"chưa chuyển sang giao diện mới"* kèm đúng
đường dẫn cần đặt tệp — **không nạp màn hình cũ**, tránh vỡ giao diện.

Màn hình dạng danh sách + biểu mẫu dùng `assets/js/crud.js` — chỉ khai báo
action/func, cột, trường; xem chú thích đầu tệp và 6 màn hình trong
`ApisTaiChinh/Modules/danhmucheso/scripts/` làm mẫu. Tên tham số và tên cột
chép **nguyên** từ tệp .js gốc.

Bảng `api.demoScreens` trong `site.config.js` chỉ dành cho các màn hình mẫu
trong `screens/` và **chỉ có tác dụng ở chế độ dựng thử** — chạy với API thật
thì bị bỏ qua, để dữ liệu mẫu không lẫn vào dữ liệu thật.

### Phân hệ Tài chính — đã chuyển

| Màn hình | Tệp | Lời gọi |
|---|---|---|
| Khai báo các khoản thu (+ kế hoạch xuất hoá đơn) | `khoanthu` | `TC_KhoanThu/*`, `pkg_taichinh_thuchi.*_TaiChinh_CacKhoanThu`, `pkg_taichinh_kehoach.*_QDXuatHD` |
| Khai báo hệ thống hoá đơn | `hethonghoadon` | `TC_HoaDon/*` |
| Khai báo hệ thống biên lai | `hethongbienlai` | `TC_BienLai/*` |
| Khai báo hệ thống phiếu thu | `hethongphieuthu` | `TC_PhieuThu/*` |
| Khai báo TK Nợ, TK Có | `taikhoanno` | `pkg_taichinh_ketoan.*API_KeToan_Khoan_HT` |
| Danh mục ngân hàng | `danhmucnganhang` | `pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc`, `CapNhatTrangThai_DuLieuDM` |

Tất cả nằm trong `ApisTaiChinh/Modules/danhmucheso/`.

**2026-09-19: đã chuyển 72/73 màn** của `ApisTaiChinh` (15 module). Màn còn
lại, `danhmucheso/mucphisotien`, bản gốc là trang rỗng (HTML trống, JS rỗng,
không nơi nào nạp) nên không có gì để chuyển. Chạy thử lại cả 73 bằng dữ liệu
mẫu: 72 mở không lỗi JS. Chưa màn nào chạy với API thật.

Ghi chú từng màn (lời gọi, phần cố ý bỏ, lỗi bản gốc đã sửa/giữ) nằm ở chú
thích đầu mỗi tệp `.js`. Danh sách việc cần nghiệp vụ quyết định và cần kiểm
trên host: `CLAUDE.md` mục 11.

## 6. Chạy thử trên máy không có máy chủ

Mở `_v2/index.html` qua một static server bất kỳ. Khi không có
`AXYZCLRVN()`, hệ tự chuyển sang dữ liệu dựng thử (`api.dataSource = 'auto'`).

Trên máy này có sẵn:

```
powershell -ExecutionPolicy Bypass -File _harness\serve.ps1 -Port 8788
```

## 7. Đăng nhập thẳng từ bản mới

Hai tệp trong `_v2/` làm việc này, **dùng lại nguyên code-behind cũ**, không
thêm mã máy chủ nào:

| Tệp | Lớp dùng lại | Việc |
|---|---|---|
| `_v2/login.aspx` | `Apis.LoginVT.Login` | Trang đăng nhập, giao diện bản mới |
| `_v2/Logout.aspx` | `Apis.LoginVT.Logout` | Đăng xuất rồi quay về `_v2/login.aspx` |

Mở: `https://<tên miền>/<ứng dụng>/_v2/login.aspx`

`assets/js/session.js` lấy trang đăng xuất **ngay cạnh trang đang mở**, nên
đăng xuất từ bản mới thì về `_v2/login.aspx`, đăng xuất từ vỏ cũ vẫn về
`login.aspx` ở gốc như trước.

### Sau khi đăng nhập đúng thì vào đâu?

Code-behind quyết định, mà mã nguồn của nó không có trong kho nên **phải thử
trên host mới biết**:

- Chuyển bằng đường dẫn tương đối (`"index.aspx"`) → rơi đúng vào
  `_v2/index.aspx`. Đúng điều mong muốn, không phải làm gì thêm.
- Chuyển bằng đường dẫn tuyệt đối (`"~/index.aspx"`, `"/index.aspx"`) → rơi về
  vỏ cũ. Phiên đăng nhập vẫn dùng chung, chỉ cần gõ tiếp `_v2/index.aspx` là
  vào. Muốn tự động thì sửa một dòng trong `login.aspx.cs` của dự án gốc.

### Ba điểm đã vấp, đừng lặp lại

1. **Tệp .aspx phải có BOM UTF-8.** Thiếu BOM thì máy chủ đọc tệp theo bảng mã
   khác, chữ Việt ra `Ä Äƒng nháº­p há»‡ thá»‘ng`. `index.aspx` cũng có BOM — giữ
   nguyên khi sửa bằng trình soạn thảo.
2. **Hai ảnh của trang đăng nhập lấy từ bản gốc**, đã chép sẵn vào
   `_v2/assets/img/`:
   `login-bg.jpg` ← `App_Themes/Cms/Custom_V1/images/bg_login_1.jpg`,
   `login-illustration.jpg` ← `App_Themes/Cms/Custom_V1/images/img-edu.jpg`.
   Dưới ảnh nền còn lớp màu chuyển sắc cùng tone, ảnh thiếu thì không ra nền
   trắng. Trên cùng là lớp điểm trôi nối nhau (`assets/js/login-bg.js`), tự dừng
   khi tab ẩn và khi người dùng đặt "giảm chuyển động".
3. **Lần tải đầu sau khi đăng nhập có thể chưa ra vai trò** (phải F5 mới lên).
   `assets/js/app.js` tự tải lại **đúng một lần** khi danh sách vai trò rỗng hoặc
   lỗi, cờ đặt trong `sessionStorage` (`ums.taiLaiVaiTro`) nên không tải vòng
   tròn. Đây là cách chữa tạm ở phía trình duyệt; nguyên nhân nằm ở phía máy
   chủ (phiên vừa tạo), muốn dứt điểm thì phải xem `login.aspx.cs` của dự án gốc.

### CSS phải GỘP trước KHI ĐẨY LÊN HOST

```
python _harness\gop-css.py
```

Sinh ra hai tệp (đừng sửa tay, sẽ bị ghi đè):

```
_v2/assets/css/main.bundle.css         309 KB   ← main.css (38 @import)
_v2/assets/css/login-page.bundle.css    29 KB   ← login-page.css (7 @import)
```

Hai vỏ `.aspx` nạp **bản gộp**; `index.html` (xem trên máy) vẫn nạp `main.css`
bản @import nên sửa CSS là thấy ngay, không cần gộp.

**Vì sao phải gộp:** tệp chỉ gồm @import bị trình duyệt coi là "đã tải xong"
nên nó VẼ TRANG NGAY trong khi 38 tệp con còn đang về. Trên host đường
truyền chậm hơn localhost nên thấy rõ: vào `login.aspx` lần đầu ra trang trơ
chữ với một hình SVG đen khổng lồ; vào trong thì mất sạch biểu tượng. F5 thì
đã có sẵn trong bộ đệm nên "chuẩn" ngay — đúng hiện tượng đã gặp.

Kèm theo hai việc nữa đã làm sẵn trong vỏ:
  · `?v=<thời điểm sửa tệp>` sau tên CSS — đổi CSS là trình duyệt tự lấy bản
    mới, không đổi thì dùng bộ đệm.
  · `<link rel="preload">` cho phông `fa-light-300.woff2` ở `index.aspx` — biểu
    tượng lên sớm thay vì đợi đọc xong CSS.

### Trang đăng nhập phải NHẸ

Đo thật (Edge, máy chủ tĩnh, bộ đệm trống):

| | Yêu cầu | Tải về |
|---|---:|---:|
| Nếu nạp `main.css` + biểu tượng Font Awesome | 39 (riêng phần này) | 822 KB |
| Cách đang dùng | **16** (cả trang) | **294 KB** |

Ba việc làm nên con số đó — **đừng hoàn nguyên**:

1. Trang nạp `assets/css/login-page.css` (7 tệp) thay cho `assets/css/main.css`
   (38 tệp + `fontawesome.min.css` 152 KB).
2. Biểu tượng trong trang là **SVG nội tuyến**, không nạp Font Awesome — riêng
   phông `fa-light-300.woff2` đã 372 KB, `fa-brands-400.woff2` 113 KB.
3. Hai ảnh đã thu về đúng cỡ hiển thị (nền 1600px, minh hoạ 1120px) và nén
   lại: 714 KB → 216 KB. Nền còn được `<link rel="preload">` để tải song song
   với CSS. Ảnh gốc vẫn nằm nguyên ở `App_Themes/Cms/Custom_V1/images/`.

### Những tên KHÔNG ĐƯỢC ĐỔI trong `_v2/login.aspx`

Code-behind gọi tới các điều khiển theo đúng tên này — đổi là đăng nhập hỏng:
`username`, `password`, `cms_authenticate_do_login` (kèm
`OnClick="cms_authenticate_do_login_Click"`), `lblNotify`, `xxxxxx`, và ba ô ẩn
`userip` / `userbrower` / `userdevice`.

Các lối đăng nhập ngoài (Google / Microsoft / SSO KeyCloak) chỉ hiện khi máy
chủ có khai — giống hệt điều kiện của `login.aspx` bản gốc.

---

## 8. Gỡ lỗi

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| Trên máy chủ mà vẫn thấy dữ liệu mẫu (48 vai trò R01…R48) | Đang mở `index.html` — bản cũ chưa có tự chuyển; mở thẳng `index.aspx` |
| "Thiếu AXYZCLRVN()" | Mở tệp `.html` thay vì `.aspx`, hoặc máy chủ không xử lý `.aspx` ở thư mục này |
| Chức năng báo "chưa chuyển đổi" dù đã chép tệp | So đường dẫn trong thông báo với vị trí tệp — `MAUNGDUNG` của chức năng trong DB có thể khác tên thư mục |
| "Thiếu AD()" | Sai đường dẫn tới `crypto-js.js` |
| "Thiếu Init_API()" | Sai đường dẫn tới `Config.js` |
| "Blob phiên rỗng" | Chưa đăng nhập, hoặc phiên hết hạn |
| "Không tìm thấy base URL cho tiền tố X" | `Config.js` thiếu khoá đó |
| Gọi API trả 401 | Token hết hạn — hệ tự chuyển sang `Logout.aspx` |
| **Biểu tượng thành ô vuông rỗng** (chữ vẫn đọc được) | Phông Font Awesome không tải được — xem mục 8.1 ngay dưới |

### 8.1. Biểu tượng thành ô vuông rỗng

Mọi biểu tượng (menu trái, nút, ô đánh dấu) thành ô vuông → tệp phông
không về được. Hai tệp phông của bộ giao diện:

```
_v2/assets/vendor/fontawesome/webfonts/*.woff2   biểu tượng (4 tệp)
_v2/assets/fonts/Mulish-*.ttf                    phông chữ (7 tệp)
```

**Chạy ba bước này, đừng đoán:** mở DevTools → Network → gõ `woff` vào ô
lọc → tải lại trang → nhìn dòng `fa-light-300.woff2`.

| Mã trả về | Nghĩa là | Sửa |
|---|---|---|
| **404** | IIS không biết đuôi `.woff2`, hoặc thư mục `webfonts` chưa được chép lên | Đã có sẵn `_v2/web.config` khai ba đuôi `.woff2/.woff/.ttf` — **phải chép tệp này lên host**. Vẫn 404 thì mở thắng `…/_v2/assets/vendor/fontawesome/webfonts/fa-light-300.woff2` trên trình duyệt: không tải được là thiếu tệp trên đĩa |
| **500** | `web.config` khai trùng với cấu hình cha | Bỏ dòng `<mimeMap>` của đuôi bị trùng trong `_v2/web.config` |
| **200** | Phông tải được, lỗi chỗ khác | Xem `main.css` có 200 không; kiểm `assets/vendor/fontawesome/css/*.min.css` có đủ bốn tệp |
| **không có dòng nào** | CSS chưa tải nên trình duyệt chưa xin phông | Lọc `css`, xem `main.css` và `fontawesome.min.css` |

Lưu ý khi chép lên host: nhiều công cụ đẩy tệp **bỏ qua thư mục chỉ chứa tệp
nhị phân** hoặc bỏ `web.config`. Chép xong hãy đếm: `webfonts` phải có đủ
**4 tệp .woff2**, `assets/fonts` đủ **7 tệp .ttf**.

Muốn xem payload thô khi gỡ lỗi, tắt mã hoá bằng cách chạy trong Console:

```js
localStorage.setItem('strIM', 'false'); location.reload();
```

Bật lại: `localStorage.removeItem('strIM')`.

## 9. Đăng nhập một lần (SSO) sang Cổng Help để soạn bài

Yêu cầu gốc: `yeu-cau-sso-cho-doi-app.md` (Help, 27/09/2026). Việc này **không liên quan
nút "?"** — "?" mở bài công khai, không cần token. SSO chỉ dành cho người của trường
**soạn / sửa** bài trên Help mà không cần mật khẩu thứ hai.

### Có gì trong `_v2`

| Tệp | Việc |
|---|---|
| `help-sso.aspx` | Trang trung gian. Kế thừa `Apis.LoginVT.Index` nên dùng đúng phiên đang đăng nhập (chưa đăng nhập → về login). Đọc **vai trò và email qua chính API của ứng dụng** (microservice, JWT của phiên, mã hoá như `api.js`) — KHÔNG dùng thư viện CSDL trong `bin` vì kết nối của nó trỏ tới CSDL khác (CMCDB). Phát JWT **RS256** sống 90 giây (`iss`, `sub` = ID người dùng, `email`, `name`, `aud: "help-master"`, `realm_access.roles` = `MAVAITRO`) rồi tự POST sang Help. Token không bao giờ nằm trên URL |
| `help-jwks.aspx` | Khoá công khai dạng JWKS để Help xác thực. Trang công khai, không cần phiên. **Đăng ký với Help địa chỉ này** (`<ứng dụng>/_v2/help-jwks.aspx`), không dùng `/.well-known/` |
| menu người dùng → "Soạn bài hướng dẫn" | `chrome.js` + `app.js soanBaiChoPhep`; ai thấy mục này khai ở `site.config.js` → `help.sso.roles` (mã `MAUNGDUNG`, `"*"` = mọi người) |

### Bản sao ở thư mục GỐC ứng dụng (từ 2026-09-28)

Hai trang có bản sao y hệt ở gốc dự án: `help-sso.aspx`, `help-jwks.aspx`. Chúng không dùng gì của giao diện v1 hay v2,
chỉ cần `bin`, `Config.js`, `App_Data` của gốc ứng dụng — nên **trường chỉ chạy v1 chép đúng hai tệp này lên gốc là có SSO**,
và ngày v2 ra chính thức (hết thư mục `_v2`) địa chỉ vẫn không đổi. **Khai bên Help địa chỉ ở GỐC:**

```
Trang phát thông tin đăng nhập   https://<tên miền>/<ứng dụng>/help-sso.aspx
JWKS                             https://<tên miền>/<ứng dụng>/help-jwks.aspx
```

Nguồn sửa là bản trong `_v2`; `dong-goi.py` tự chép lại bản gốc mỗi lần đóng gói và nhắc khi có đổi. Hai tệp gốc KHÔNG nằm
trong gói `_v2` — tự chép lên thư mục gốc ứng dụng trên host. Khoá dùng chung (`App_Data/help-sso/`) nên hai địa chỉ phát cùng một khoá.

### Cấu hình + khoá nằm NGOÀI `_v2`, ở `App_Data/help-sso/` của ứng dụng cha

ASP.NET không bao giờ phục vụ `App_Data` qua HTTP nên khoá riêng không lộ. **Lần chạy
đầu tự tạo** cả hai tệp (tài khoản chạy IIS phải ghi được `App_Data`):

```
App_Data/help-sso/help-sso.json      iss, helpUrl, postPath, aud, ttlSeconds, rolesClaim…
App_Data/help-sso/help-sso.key.xml   khoá RSA 2048 (KHÔNG chép đi đâu, KHÔNG đưa vào git)
```

Mặc định của `help-sso.json` (sửa tay khi cài cho trường khác — `iss` là **mã trường**,
cố định, không phải địa chỉ web; Help dùng nó để chọn bộ khoá):

```json
{ "iss": "ums-qtdh", "helpUrl": "https://con98.api-apis.com/help-master",
  "postPath": "/dang-nhap-truong", "aud": "help-master", "ttlSeconds": 90,
  "rolesClaim": "realm_access", "keyFile": "help-sso.key.xml",
  "apiHost": "", "iM": "AzzSystem",
  "rolesAction": "CMS_QuanTri01_MH/DSA4BRIXICgVMy4PJjQuKAU0LyYP",
  "rolesFunc": "PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung", "roleColumn": "MAVAITRO",
  "userAction": "CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP",
  "userFunc": "pkg_chung_quanlynguoidung.LayDanhSachNguoiDung", "emailColumn": "EMAIL" }
```

Help dời từ `/help-master` sang `/help`: đổi `helpUrl` rồi lưu, không cần deploy lại.
Xoay khoá: xoá `help-sso.key.xml`, lần bấm sau tự sinh khoá mới; Help đọc lại JWKS trong
10 phút.

### Thử trên host — theo đúng thứ tự

1. Mở `…/_v2/help-jwks.aspx` → phải ra JSON `{"keys":[{"kty":"RSA",…}]}`. Lỗi 500 kèm
   `error` = không ghi được `App_Data` (cấp quyền cho tài khoản IIS).
2. Đăng nhập rồi mở `…/_v2/help-sso.aspx?xem=1` → **chỉ xem, không gửi**: payload sẽ gửi và kết
   quả hai lời gọi API (địa chỉ đã gọi, số dòng, tên cột, có khớp ID người dùng không). Lỗi
   "chuyển hướng" hoặc không kết nối được: điền `apiHost` trong json (vd `https://<tên miền>`).
   Tệp json cũ thiếu khoá nào thì khoá đó tự lấy mặc định, không phải sửa.
3. Gửi Help: `iss` (trong json) + địa chỉ JWKS. Help điền `.env`, bật cờ.
4. Menu người dùng → "Soạn bài hướng dẫn" → Help phải vào khu quản trị. Bị 401 "Token
   không hợp lệ hoặc đã hết hạn": kiểm `aud` trước, rồi lệch giờ (host phải đồng bộ NTP,
   token chỉ sống 90 giây), rồi mới tới chữ ký. Trang lỗi của Help in **mã lý do** — đọc
   mã đó cho bên Help.

### Ràng buộc phía dữ liệu

- Người soạn bài **phải có email** trong Quản trị → Người dùng; thiếu thì trang báo ngay,
  không gửi. Email trùng giữa hai người thì người sau bị Help từ chối.
- `sub` = ID người dùng (GUID 32 ký tự, khoá chính) — đổi ID là Help coi là người khác.
- Thêm vai trò mới bên app thì báo Help để ánh xạ, không thì người đó vào Help với 0 quyền.
