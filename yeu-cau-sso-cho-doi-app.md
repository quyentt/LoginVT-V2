# Yêu cầu từ app v1/v2 để bật đăng nhập một lần (SSO) sang Help Center

**Gửi:** đội phát triển app quản trị đại học (v1 / v2)
**Ngày:** 27/09/2026
**Mục đích:** để người của trường soạn bài hướng dẫn trên Help Center mà **không phải có thêm một mật khẩu thứ hai**.

---

## 0. Đọc trước: việc này KHÔNG liên quan đến nút `?`

Hai việc hoàn toàn tách rời, đừng gộp:

| Việc | Cần SSO? |
| --- | --- |
| Nút `?` mở bài hướng dẫn của màn hình đang xem | **Không.** Bài hướng dẫn là trang công khai. App chỉ mở một URL, không token, không đăng nhập |
| Người của trường **soạn / sửa** bài trên Help | **Có.** Đây là nội dung của tài liệu này |

Nếu chỉ cần nút `?` thì **không phải làm gì trong tài liệu này**.

---

## 1. Phát hành một JWT ngắn hạn cho người đang đăng nhập

Cần một endpoint bên app, kiểu `GET /api/help/sso-token`, chỉ gọi được khi người dùng **đã đăng nhập vào app**, trả về một JWT.

### Chữ ký

Chọn **một** trong hai, ưu tiên cách A:

**A. RS256 + JWKS (khuyến nghị)**
- App công bố một endpoint JWKS, ví dụ `https://<app>/.well-known/jwks.json`
- Xoay khóa được mà không phải hẹn nhau — Help đọc lại JWKS mỗi 10 phút
- Help **không bao giờ giữ khóa bí mật của app**

**B. HS256 + secret dùng chung (dự phòng)**
- Chỉ dùng nếu hạ tầng app chưa làm được khóa bất đối xứng
- Secret phải **dành riêng cho Help**, không dùng lại secret nào đang có
- Đổi secret là phải hẹn nhau và deploy hai bên cùng lúc

### Các claim

| Claim | Bắt buộc | Yêu cầu |
| --- | --- | --- |
| `iss` | ✅ | Một chuỗi **cố định**, không đổi giữa các môi trường triển khai của cùng một trường. Help dùng nó để chọn bộ khóa và từ chối mọi `iss` không khai trước |
| `sub` | ✅ | **Mã người dùng ỔN ĐỊNH VĨNH VIỄN.** Xem mục 4 — đây là yêu cầu nghiêm ngặt nhất |
| `email` | ✅ | Thiếu là Help trả 401. Xem mục 5 |
| `exp` | ✅ | **Sống 60–120 giây.** Token này dùng đúng một lần, ngay lập tức |
| `name` | nên có | Họ tên hiển thị. Thiếu thì Help lấy phần trước dấu `@` của email |
| *(claim vai trò)* | nên có | Xem mục 2. Tên claim do hai bên thống nhất; mặc định Help đọc `realm_access.roles` |
| `aud` | ✅ | Đặt đúng chuỗi **`help-master`**. Help **kiểm claim này**, thiếu hoặc sai là 401. Lý do: không kiểm `aud` thì một token trường phát cho **hệ thống khác** cũng dùng được ở Help, miễn `iss` khớp |

Ví dụ phần payload:

```json
{
  "iss": "https://sso.truong.edu.vn",
  "sub": "CB0001742",
  "email": "nguyen.van.a@truong.edu.vn",
  "name": "Nguyễn Văn A",
  "aud": "help-master",
  "exp": 1790000060,
  "realm_access": { "roles": ["GIAOVIEN", "KETOAN"] }
}
```

### Đồng bộ giờ máy chủ

Token sống 60 giây thì lệch giờ giữa hai máy chủ **quá 60 giây là mọi lần đăng nhập đều thất bại**, và thông báo lỗi sẽ chỉ là *"Token không hợp lệ hoặc đã hết hạn"* — rất khó lần ra. Hai máy chủ phải đồng bộ NTP.

Phía Help đã để sẵn **dung sai 60 giây** cho việc lệch giờ này, nới được tới 300 giây bằng cấu hình. Nếu hạ tầng của app không bảo đảm được NTP thì nói trước để chúng tôi nới.

---

## 2. Danh sách mã vai trò

Cần một bảng liệt kê **mã vai trò thật** trong CSDL của app, kèm ý nghĩa:

```
Mã vai trò      | Tên              | Người này phụ trách nghiệp vụ gì
----------------|------------------|----------------------------------
GIAOVIEN        | Giảng viên       | ...
KETOAN          | Kế toán          | Tài chính
...
```

Help ánh xạ từng mã sang một vai trò bên Help (bảng cấu hình, không phải code). **Mã nào không có trong bảng thì người đó vào Help với 0 quyền** — vào được nhưng không sửa được gì. Đó là hành vi đúng, không phải lỗi.

⚠️ **Thêm vai trò mới bên app thì phải báo Help**, không thì người mang vai trò đó vào Help với 0 quyền và không ai hiểu tại sao.

Vai trò gửi sang **thay thế** hoàn toàn vai trò cũ mỗi lần đăng nhập — app là nguồn sự thật, Help không tự sửa.

---

## 3. Một trang trung gian tự gửi token sang Help

Không dùng redirect kèm token trong URL. Cách làm:

1. Trong app thêm một chỗ bấm, ví dụ *"Soạn bài hướng dẫn"* (chỉ hiện với vai trò được phép).
2. Bấm vào → app mở một trang của **chính app**, trang đó lấy token ở mục 1 rồi **tự gửi form POST** sang Help:

```html
<form method="POST" action="https://con98.api-apis.com/help-master/dang-nhap-truong">
  <input type="hidden" name="token" value="<JWT vừa phát hành>">
</form>
<script>document.forms[0].submit()</script>
```

3. Help xác thực token, đặt phiên của **chính Help**, rồi chuyển người dùng vào khu quản trị.

### Vì sao không để token trong query string

`...?token=eyJ...` sẽ nằm trong:
- log truy cập của IIS / nginx ở **cả hai bên**
- lịch sử trình duyệt
- header `Referer` gửi sang mọi ảnh/script của trang tiếp theo

Dán cái link đó cho đồng nghiệp là **dán luôn phiên đăng nhập**. Token trong body POST không đi vào chỗ nào trong số đó.

Nếu bên app bắt buộc phải dùng GET thì phương án lùi là để token trong **fragment** (`#token=...`) — fragment không gửi lên máy chủ nên không vào log, nhưng vẫn nằm trong lịch sử trình duyệt. Kém hơn, và phải nói trước.

---

## 4. `sub` phải ổn định vĩnh viễn — yêu cầu nghiêm ngặt nhất

Help lưu tài khoản theo cặp `(iss, sub)`. Nếu `sub` của một người đổi giá trị:

- Help coi đó là **một người hoàn toàn khác**
- Tạo tài khoản mới, và **email trùng sẽ làm việc đăng nhập THẤT BẠI** (xem mục 5)
- Bài viết cũ vẫn còn nhưng mất liên hệ với người viết

Nên `sub` **không được** là:
- số thứ tự có thể đánh lại khi di trú dữ liệu
- email (người ta đổi email)
- mã đăng nhập (đổi được)

Nên là khóa chính bất biến của bản ghi người dùng.

⚠️ **Nếu v3 có kế hoạch đánh số lại ID người dùng thì phải nói ngay từ bây giờ** — có cách xử lý, nhưng phải chuẩn bị trước, không phải sau khi đã có tài khoản thật.

---

## 5. Email: phải có, và phải là duy nhất

Cần xác nhận hai điều về dữ liệu người dùng bên app:

1. **Người sẽ soạn bài có email trong CSDL không?** Thiếu email → Help trả 401 và không có đường lùi nào.
2. **Email có trùng nhau giữa hai người không?**

Và một trường hợp cần biết trước: nếu người đó **đã có tài khoản đăng ký trực tiếp trên Help cùng email đó**, Help **cố ý không gộp tự động** — trả lỗi `ACCOUNT_LINK_REQUIRED`. Đây là chủ ý về an toàn (gộp tự động theo email là một đường chiếm tài khoản), nhưng nghĩa là **người đó sẽ kẹt** cho tới khi xử lý tay. Cho chúng tôi biết có bao nhiêu người thuộc diện này.

---

## 6. Những thứ app KHÔNG phải làm

Nói rõ để không ai làm thừa:

- ❌ **Không** gọi API nào của Help
- ❌ **Không** lưu token của Help
- ❌ **Không** cài SDK
- ❌ **Không** thêm cột hay chạy SQL trong CSDL của app
- ❌ **Không** gửi danh sách quyền theo từng màn hình — Help không dùng
- ❌ **Không** cần Help sống để app chạy. Help sập thì chỗ bấm đó mở ra tab lỗi, app vẫn chạy bình thường

Toàn bộ tích hợp là **một chiều**: app đưa token, Help tự lo phần còn lại.

---

## 7. Phần Help còn phải làm (không phải việc của app)

Ghi ra cho minh bạch:

| | Trạng thái |
| --- | --- |
| Xác thực token ngoài, tạo người dùng, ánh xạ vai trò, cấp token Help | ✅ xong, đang tắt bằng cờ môi trường |
| Giới hạn quyền ghi theo từng nghiệp vụ | ✅ xong |
| Trang nhận POST `/dang-nhap-truong` + nút trên trang đăng nhập | ✅ xong 27/09/2026 |
| Kiểm claim `aud`, khóa cứng danh sách thuật toán chữ ký, dung sai lệch giờ | ✅ xong 27/09/2026 |
| Giao diện xử lý trường hợp email trùng (`ACCOUNT_LINK_REQUIRED`) | ⚠️ có trang giải thích, chưa có đường liên kết hai tài khoản |
| Hỗ trợ nhiều trường cùng lúc | ❌ hiện chỉ đỡ được **một** nguồn phát hành token |

**Phía Help đã thử được rồi.** Cửa nhận đã hoạt động: gửi POST thiếu token, sai
token, hay lúc chưa bật đều ra trang lỗi có **mã lý do** in trên màn hình. Các bạn
dựng trang trung gian rồi bắn thử sang là thấy ngay Help nhận được gì — đọc mã lý
do đó cho chúng tôi là đủ để lần ra chỗ sai, không phải mò.

Còn thiếu đúng một thứ để chạy thật: `iss` và JWKS (hoặc secret) của các bạn, để
điền vào `.env` của Help.

---

## 8. Việc cần trả lời / gửi lại

Để chốt được lịch, cần bốn thứ từ đội app:

1. Chọn **A (RS256 + JWKS)** hay **B (HS256 + secret)**, kèm giá trị `iss` dự kiến
2. **Bảng mã vai trò** ở mục 2
3. Trả lời hai câu về email ở mục 5
4. Khẳng định `sub` ở mục 4 là **bất biến**, và cho biết v3 có kế hoạch đánh số lại ID hay không

Có bốn thứ đó là hai bên thử được trên môi trường thử nghiệm.

⚠️ Một điều **không phải câu hỏi mà là ràng buộc**: token phải có `aud` đúng bằng `help-master`. Đây là chỗ dễ quên nhất khi lập trình, và triệu chứng khi quên là 401 với thông báo *"Token không hợp lệ hoặc đã hết hạn"* — nhìn y như lỗi chữ ký hoặc lỗi lệch giờ. Nếu thử mà bị 401, kiểm `aud` trước khi đi tìm chỗ khác.
