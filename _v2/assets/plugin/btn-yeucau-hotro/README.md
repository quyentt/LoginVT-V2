# Plugin "Yêu cầu hỗ trợ" — nút nổi, chụp màn hình, sửa ảnh, gửi sang Cổng Help

Theo tài liệu `nut-yeu-cau-ho-tro-tren-app.docx` (Help gửi đội app 26/10/2026), mục 2 (luồng), 4 (form), 5 (chú ý khi làm trên v2)
và dòng "Sửa ảnh" đội app thêm ở bước 2: chụp xong có nút sửa ảnh dạng Paint (khung, mũi tên) và nút Cắt ảnh.

## Tệp

| Tệp | Vai trò |
|---|---|
| `btn-yeucau-hotro.js` | Toàn bộ plugin: nút nổi, popup, chụp ảnh, trình vẽ (khung / mũi tên / cắt / hoàn tác), phát token, form POST |
| `btn-yeucau-hotro.css` | Kiểu dáng tiền tố `yh-`, JS tự nạp. Dùng biến `--ums-*` nếu vỏ có, không có thì màu dự phòng |
| `html2canvas.min.js` | html2canvas 1.4.1 (bản gốc từ cdnjs, tự chứa). Nạp lười lần bấm đầu |
| `thu-nhan.aspx` | Trang thử nhận form thay cửa `/ho-tro/gui` khi Help chưa dựng: in lại mọi trường + ảnh |

## Gắn vào vỏ

Một thẻ script, đặt **sau** các script của vỏ (đã gắn sẵn ở `_v2/index.aspx` và `_v2/index.html`):

```html
<script src="assets/plugin/btn-yeucau-hotro/btn-yeucau-hotro.js"></script>
```

Vỏ v1 (`index.aspx` gốc) gắn y hệt với đường dẫn `_v2/assets/plugin/btn-yeucau-hotro/btn-yeucau-hotro.js`; plugin tự nhận ra
`edu.system` và lấy ngữ cảnh từ đó (`strChucNang_Id`, `dtChucNang`, `dtUngDung`, `userId`), `v = "1"`.

## Cấu hình (tuỳ chọn)

Trước thẻ script, hoặc bằng `data-*` trên thẻ script, hoặc sửa `btnYeuCauHoTro.config` lúc chạy:

```html
<script>window.UMS_HOTRO_CONFIG = {
  url: "https://con98.api-apis.com/help-master/ho-tro/gui",   // cửa nhận của Help (mặc định)
  tokenUrl: "help-sso.aspx",                                   // trang phát token (POST roles + uid + json=1)
  v: "",                                                       // rỗng = theo vỏ (_v2: help.version; v1: "1")
  text: "Yêu cầu hỗ trợ",
  target: "help-portal"                                        // tên tab cố định, trùng tab nút "?"
};</script>
```

Thử khi Help chưa có cửa nhận: `btnYeuCauHoTro.config.url = 'assets/plugin/btn-yeucau-hotro/thu-nhan.aspx'` trên console rồi bấm gửi;
tab `help-portal` hiện bảng mọi trường và ảnh nhận được.

## Luồng

1. Bấm nút nổi → html2canvas chụp **vùng đang hiện** của `document.body` (bỏ nút nổi), thu về ≤ 1600px bề ngang → mở popup.
2. Popup: dòng ngữ cảnh (tên màn, ứng dụng, phiên bản), thanh công cụ **Khung / Mũi tên / Cắt ảnh / Hoàn tác / Chụp lại / Ảnh khác**,
   dán ảnh bằng Ctrl+V, ô mô tả ≤ 2.000 ký tự, dòng nhắc "người cùng ứng dụng ở trường bạn sẽ thấy".
   Nét vẽ đỏ `#e11d48`, độ dày 3px (tỷ lệ theo bề ngang ảnh). Cắt: kéo chọn vùng, thả là cắt; sai thì Hoàn tác (30 bước).
3. "Gửi nhanh" / "Chi tiết hơn": phát token MỚI (`POST help-sso.aspx` với `roles`, `uid`, `json=1` → `{token, dich, exp}`),
   dựng form `multipart/form-data` target `help-portal` tới `config.url`, submit, xoá form. Popup giữ nguyên để gửi lại nếu Help báo lỗi token.

## Trường gửi (tài liệu mục 4)

`token` · `ma` (CHUCNANG.ID) · `ten` (≤ 200) · `duong` (DUONGDANFILE, ≤ 300) · `v` · `cheDo` (`nhanh` | `chi-tiet`) · `noiDung` (≤ 2.000)
· `anh` (PNG, quá 5 MB tự chuyển JPEG 0.85; tên `man-hinh.png`) · `route` (hash) · `appVersion` (`ums.ban` nếu có) · `browser` (UA).

## Giới hạn đã biết

- Chế độ dựng thử trên máy (`index.html`, không có vỏ ASPX): chụp / vẽ / cắt chạy đủ, bấm gửi chỉ báo "không có phiên để phát token".
- Màn hình nạp nội dung cross-origin (ảnh từ host khác không có CORS) có thể ra ô trắng trong ảnh chụp — người dùng dùng "Ảnh khác" hoặc Ctrl+V.
- `help-sso.aspx` phát token theo vai trò do trình duyệt gửi (xem ghi chú trong tệp đó): Help vẫn kiểm quyền phía họ.
