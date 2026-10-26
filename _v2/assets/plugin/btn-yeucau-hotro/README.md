# Plugin "Yêu cầu hỗ trợ" — nút nổi, bảng yêu cầu đã gửi, chụp màn hình, sửa ảnh, gửi sang Cổng Help

Theo tài liệu `nut-yeu-cau-ho-tro-tren-app.docx` (Help gửi đội app 26/10/2026): mục 2 (luồng), 4 (form), 5 (chú ý khi làm trên v2),
dòng "Sửa ảnh" đội app thêm ở bước 2, và **mục 10** (chủ dự án chốt 26/10: nút nổi mở bảng "Yêu cầu của tôi" trượt từ mép phải,
có bộ lọc; "Tạo yêu cầu mới" mới mở popup chụp ảnh) + **10.7** Help trả lời (cửa danh sách đã dựng trên máy dev, lên máy chủ đợt kế tiếp)
+ **mục 11** (chủ dự án chốt 26/10 sau khi Help trả lời **11.7**: trao đổi với hỗ trợ NGAY TRONG POPUP bằng iframe trang vấn đề nhúng của
Help, bỏ chuyển tab) — đã làm xong phía app sau công tắc `nhung`, **mặc định TẮT** (giữ mục 10) cho tới khi Help báo trang nhúng đã lên máy chủ.

## Tệp

| Tệp | Vai trò |
|---|---|
| `btn-yeucau-hotro.js` | Toàn bộ plugin: nút nổi, bảng trượt (bộ lọc, danh sách, tải thêm), popup, chụp ảnh, trình vẽ (khung / mũi tên / cắt / hoàn tác), phát token, gọi cửa danh sách, form POST, nhận postMessage |
| `btn-yeucau-hotro.css` | Kiểu dáng tiền tố `yh-`, JS tự nạp. Dùng biến `--ums-*` nếu vỏ có, không có thì màu dự phòng |
| `html2canvas.min.js` | html2canvas 1.4.1 (bản gốc từ cdnjs, tự chứa). Nạp lười lần bấm "Tạo yêu cầu mới" đầu |
| `thu-nhan.aspx` | Trang thử nhận form thay cửa `/ho-tro/gui` khi Help chưa dựng: in lại mọi trường + ảnh |
| `thu-nhung.html` | Giả lập trang vấn đề nhúng của Help (mục 11): bắn đủ bộ sự kiện 11.3, nhận `app-token` / `app-dong`. Plugin tự nạp vào iframe ở chế độ dựng thử |

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
  url: "https://con98.api-apis.com/help-master/ho-tro/gui",          // cửa nhận form (mặc định)
  listUrl: "https://con98.api-apis.com/help-master/ho-tro/danh-sach", // cửa danh sách JSON (mục 10.2)
  tokenUrl: "help-sso.aspx",                                          // trang phát token (POST roles + uid + json=1)
  v: "",                                                              // rỗng = theo vỏ (_v2: help.version; v1: "1")
  text: "Yêu cầu hỗ trợ",
  target: "help-portal",                                              // tên tab cố định, trùng tab nút "?"
  kichCo: 20,                                                         // dòng mỗi lần tải (Help tối đa 50)
  choMs: 10000,                                                       // chờ Help trả lời (danh sách / postMessage / help-san-sang) tối đa
  choChiaSeMs: 30000,                                                 // chờ người dùng trả lời hộp "Chia sẻ tab" khi chụp thật; quá thì vẽ lại bằng html2canvas
  nhung: false,                                                       // mục 11: trao đổi ngay trong popup — BẬT khi Help báo trang nhúng đã lên máy chủ
  nhungUrl: "https://con98.api-apis.com/help-master/ho-tro/nhung"      // mở yêu cầu cũ trong iframe: POST token + id + v (Help 11.7)
};</script>
```

Thử khi Help chưa có cửa nhận: `btnYeuCauHoTro.config.url = 'assets/plugin/btn-yeucau-hotro/thu-nhan.aspx'` trên console rồi bấm
"Chi tiết hơn"; tab `help-portal` hiện bảng mọi trường và ảnh nhận được.

## Luồng

1. **Bấm nút nổi → bảng "Yêu cầu của tôi"** trượt ra sát mép phải (rộng 420px, đè lên màn, bấm ngoài / Esc / × đóng).
   Trên cùng là bộ lọc: ô tìm (gõ trễ 400 ms), nhóm nút trạng thái (lấy từ danh mục `trangThai` Help trả về trong MỌI phản hồi —
   không ghim cứng mã), "Chỉ màn đang mở" (gửi `ma`), "Cả trường" (`phamVi = truong`), khoảng ngày cập nhật. Đổi bộ lọc là gọi
   lại cửa danh sách; không lọc tại chỗ. Mỗi dòng: nhãn trạng thái (màu Help), `maHienThi`, tiêu đề, tên màn, ngày cập nhật, số
   phản hồi chưa đọc; bấm dòng → mở `url` ở tab `help-portal`. Cuối danh sách có "Tải thêm (n / tổng)".
   Plugin chỉ gọi cửa danh sách khi mở bảng hoặc đổi bộ lọc — không gọi nền, không định kỳ, không số đếm trên nút nổi.
2. **"Tạo yêu cầu mới"** (chân bảng) → giấu bảng + nút nổi trong khoảnh khắc chụp → **chụp thật** bằng Screen Capture API
   (`getDisplayMedia`, `preferCurrentTab`; người dùng chốt 26/10 vì html2canvas tự vẽ lại DOM nên ảnh xô lệch, biểu tượng đè chữ):
   trình duyệt hiện hộp "Chia sẻ tab này" (tab hiện tại chọn sẵn), bấm Chia sẻ → plugin lấy ĐÚNG MỘT khung hình rồi dừng luồng ngay,
   không truyền đi đâu. Ảnh đúng pixel như mắt thấy, thu về ≤ 1600px bề ngang → mở popup đè lên bảng.
   Người dùng bỏ qua hộp, trình duyệt không hỗ trợ, không https, hoặc hộp treo quá `choChiaSeMs` (30 s) → rơi về html2canvas vẽ lại
   như cũ kèm dòng nhắc "ảnh có thể lệch, bấm Chụp lại rồi chọn Chia sẻ". "Chụp lại" dùng cùng cơ chế.
3. Popup: dòng ngữ cảnh (tên màn, ứng dụng, phiên bản), thanh công cụ **Khung / Mũi tên / Cắt ảnh / Hoàn tác / Chụp lại / Ảnh khác**,
   dán ảnh bằng Ctrl+V, ô mô tả ≤ 2.000 ký tự, dòng nhắc "người cùng ứng dụng ở trường bạn sẽ thấy".
   Nét vẽ đỏ `#e11d48`, độ dày 3px (tỷ lệ theo bề ngang ảnh). Cắt: kéo chọn vùng, thả là cắt; sai thì Hoàn tác (30 bước).
4. **"Gửi nhanh"** (bước 3a): phát token MỚI → form `multipart/form-data` submit vào iframe ẩn trong popup → chờ `postMessage`
   `{ loai: "help-ho-tro-xong", ok, id, url, soTuongTu }` từ đúng origin Help (tối đa `choMs`) → báo "Đã gửi" kèm link Xem, chèn
   dòng mới lên đầu bảng (không gọi lại cửa danh sách). Quá hạn hoặc `ok = false` → báo lỗi, popup giữ nguyên để gửi lại.
   **"Chi tiết hơn"** (bước 3b): cùng form, target tab `help-portal` — nút duy nhất mở Help.
5. **Chế độ nhúng** (`nhung: true`, mục 11 theo Help 11.7) thay bước 3a / 3b / 4 và "bấm dòng → mở tab":
   - Popup chỉ còn một nút **"Gửi"** (`cheDo = "nhung"`), form target vào iframe `yh-help` đang nằm trong popup. Help tạo yêu cầu rồi trả
     THẲNG trang vấn đề nhúng vào iframe đó + `help-ho-tro-xong` → plugin thu vùng ảnh / thanh vẽ / ô mô tả, hiện iframe (cao ≥ 60vh),
     đưa `maHienThi` + nhãn trạng thái lên dòng ngữ cảnh, chèn dòng mới lên đầu bảng.
   - **Bấm dòng trong bảng** → popup trao đổi: phát token mới, `POST token + id + v` vào iframe tới `nhungUrl` (`/ho-tro/nhung`). Không mở tab.
   - Nhận postMessage từ đúng origin Help (11.3): `help-san-sang` (tắt lối lui), `help-trang-thai` / `help-tin-moi` (đổi nhãn trên popup và
     trên dòng trong bảng, mã lạ thì thêm vào danh mục — không gọi lại cửa danh sách), `help-phien-het` (phát token mới rồi gửi
     `{ loai: "app-token", token }` vào iframe, **không POST lại** để Help giữ nháp), `help-loi` (thông báo đỏ + nổi bật "Mở trong Help").
   - Chiều app → iframe (targetOrigin = origin Help): `app-token`, `app-dong` (trước khi đóng popup; popup ẩn tức thì, gỡ sau 200 ms để Help kịp nhận).
   - **Lối lui**: không có `help-san-sang` sau `choMs` → thông báo kèm nút **"Mở trong Help"** (mở `url` ở tab `help-portal`). Nút này luôn hiện
     khi đã có `url` (Help đề nghị, để trao đổi dài mở bản đầy đủ).
   - Dựng thử: iframe nạp `thu-nhung.html` (cùng thư mục); `btnYeuCauHoTro.moChat(dong)` mở trao đổi cho một dòng.

## Gọi Help

| Cửa | Cách gọi | Trường |
|---|---|---|
| `/ho-tro/gui` (form) | `POST multipart/form-data`, target iframe ẩn (nhanh) hoặc tab `help-portal` (chi tiết) | `token` · `ma` (CHUCNANG.ID) · `ten` (≤ 200) · `duong` (≤ 300) · `v` · `cheDo` (`nhanh` \| `chi-tiet`) · `noiDung` (≤ 2.000) · `anh` (PNG, quá 5 MB tự chuyển JPEG 0.85) · `route` · `appVersion` (`ums.ban`) · `browser` |
| `/ho-tro/nhung` (form, chỉ khi `nhung`) | `POST`, target iframe hiện trong popup | `token` · `id` · `v` → Help trả trang vấn đề nhúng (token nhúng 60 phút không cookie, CSP `frame-ancestors` theo sổ trường) |
| `/ho-tro/danh-sach` (JSON) | `fetch POST x-www-form-urlencoded`, `mode: cors`, `credentials: omit`, huỷ sau `choMs` | `token` · `v` · `phamVi` · `ma` · `trangThai` · `tuKhoa` · `tuNgay` / `denNgay` (dd/MM/yyyy) · `trang` · `kichCo` → `{ ok, tong, trang, kichCo, trangThai: [{ma, ten, mau}], ds: [{ id, maHienThi, url, tieuDe, moTa, ma, ten, v, trangThai, ngayTao, ngayCapNhat, soPhanHoiMoi, nguoiPhuTrach, cuaToi }] }`; lỗi `{ ok: false, loi, thongBao }` |

Token: mỗi lần gọi (gửi hoặc danh sách) phát mới qua `POST help-sso.aspx` với `roles`, `uid`, `json=1` → `{token, dich, exp}`.
Không giữ token, không cookie Help, không SDK.

## Giới hạn đã biết

- Chế độ dựng thử trên máy (`index.html`, không có vỏ ASPX): bảng chạy bằng **dữ liệu mẫu** (26 dòng, lọc / phân trang tại chỗ, cùng hình
  dạng JSON mục 10.2); chụp / vẽ / cắt chạy đủ; "Gửi nhanh" chỉ thêm một dòng mẫu vào bảng, "Chi tiết hơn" báo không có phiên để phát token.
- Chụp thật CHƯA thử trên host (26/10, chỉ thử được đường lui html2canvas bằng headless vì headless không có hộp chia sẻ). Firefox / Safari cũ
  không có `preferCurrentTab`: người dùng phải tự chọn tab trong danh sách. Trong hộp chọn, popup và nút nổi đã ẩn nên không vào ảnh.
- Đường lui html2canvas: màn nạp nội dung cross-origin (ảnh từ host khác không có CORS) có thể ra ô trắng — người dùng dùng "Ảnh khác" hoặc Ctrl+V.
- `help-sso.aspx` phát token theo vai trò do trình duyệt gửi (xem ghi chú trong tệp đó): Help vẫn kiểm quyền phía họ.
- Chế độ nhúng CHƯA thử với Help thật (26/10: Help ước 2–3 ngày, làm sau khi cửa danh sách lên máy chủ). Khi Help báo xong: đặt `nhung: true`
  trong cấu hình (một chỗ), thử trên Edge Strict + Safari: bấm dòng → khung trao đổi hiện trong 10 giây, gửi tin, dán ảnh, đổi trạng thái →
  dòng trong bảng đổi theo, để quá 60 phút → `help-phien-het` → gia hạn không mất nháp, Đóng rồi mở lại còn nháp.
- Cửa danh sách CHƯA thử với Help thật (26/10: Help mới có trên máy dev). Lên máy chủ thì chạy bước 5 mục 10.4: tài khoản trường có ≥ 25 yêu cầu,
  thử từng bộ lọc, Tải thêm, Gửi nhanh → dòng mới lên đầu, bấm dòng → mở đúng trang vấn đề.

Dò trên máy: `btnYeuCauHoTro.mo()` (bảng), `.tao()` (chụp + popup), `.taiLai()`, `.dong()`, `.taiAnh()` (tải ảnh trong popup + in thông số môi trường).
