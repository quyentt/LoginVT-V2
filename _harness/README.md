# Harness — chạy màn hình LoginVT không cần server

Dựng lại một màn hình bất kỳ của LoginVT ngay trên máy: **không IIS, không Web.config,
không microservice, không Oracle**.

Toàn bộ code của project được dùng **nguyên bản** — `Core/`, `Corei/`, file HTML và JS
của module đều không bị sửa một dòng nào. Harness chỉ ghi đè đúng một hàm:
`edu.system.makeRequest`, đổi từ "gọi API" sang "đọc fixture".

---

## Chạy

```
powershell -ExecutionPolicy Bypass -File _harness\serve.ps1
```

Mở: <http://localhost:8787/_harness/>

Đổi cổng: `-Port 9000`. Dừng: `Ctrl+C`.

`serve.ps1` là static file server viết bằng `System.Net.HttpListener` (không cần quyền
admin, không cần cài gì). Web root là thư mục gốc project.

---

## Cả vỏ cũ `indexi` — `index-old.html`

Mở: <http://localhost:8787/index-old.html>

Dựng nguyên vỏ `indexi.aspx` (thanh trên, menu trái, breadcrumb, CSS nội tuyến) để kiểm giao diện bản cũ:
trang chủ liệt kê vai trò → bấm vào là vào vai trò, menu trái hiện cây chức năng → bấm mục nào mở màn đó.
Không gọi máy chủ, bảng không có dữ liệu. F5 giữ nguyên vai trò và màn đang xem; bấm logo về danh sách vai trò.

| Tệp | Vai trò |
|---|---|
| `index-old.html` | Lúc chạy tải chính `indexi.aspx`, gỡ thẻ máy chủ rồi ghi ra — không chép markup, nên sửa `indexi.aspx` / CSS là thấy ngay |
| `old-mock.js` | Chặn `makeRequest`, dựng phiên giả thay `ASG()`, chặn bốn chỗ nhảy sang `index.aspx`, vẽ trang danh sách vai trò |
| `old-data.js` | Vai trò + cây chức năng. **Tự sinh** bằng `node _harness/old-data-tao.js` |
| `old-data-tao.js` | Đọc bản xuất chức năng mới nhất trong `gui-help/mapping-chuc-nang_*.json` + quét cây thư mục `Apis*/Modules` |

- Mỗi **ứng dụng** trong bản xuất thành một vai trò (menu là chức năng thật trong CSDL, đúng tên, đúng thứ tự, đúng icon).
  Vai trò là tập con của một ứng dụng (vd "Tính phí") không có ở đây — bản xuất không chứa phép gán vai trò → chức năng.
- Tệp html không mục menu nào trỏ tới nằm trong nhóm **"Tệp ngoài menu"** ở cuối menu của phân hệ đó.
- Mục mang chữ `↗ index`: trên hệ thật mở ở `index.aspx` (Bootstrap 5) — ở đây vẫn mở trong vỏ `indexi` nên có thể lệch kiểu.
  Mục mang chữ `✕ thiếu tệp`: menu trỏ tới tệp không có trong kho.
- Bảng nhỏ góc dưới phải đếm lời gọi bị chặn và lỗi JS (bấm "mở" xem từng lời gọi, "×" để ẩn).
  Muốn bảng có dòng: thêm khoá vào `fixtures.js` như mục "Thêm màn hình mới" bên dưới.
- Phải chạy bằng `serve.ps1` của thư mục này: trang cần nằm ở **gốc web** như `indexi.aspx`, `serve.ps1` tự tìm nó trong `_harness`.
- Chép sang máy khác: cả thư mục `_harness` đặt ngay dưới gốc dự án cũ (ngang `indexi.aspx`, `Corei/`, `App_Themes/`, `Apis*/`).

---

## Tham số trên URL

| Tham số | Mặc định | Ý nghĩa |
|---|---|---|
| `core` | `Corei` | Nạp `Corei/` (giống `indexi.aspx`) hay `Core/` (giống `index.aspx`). Dùng để so sánh hai bản đang lệch nhau. |
| `app` | `ApisDangKyHoc` | Thư mục domain |
| `page` | `/Modules/kehoachdangkymuabaohiem/html/kehoachmua.html` | Đường dẫn file HTML của module |
| `autorun` | *(rỗng)* | Biểu thức JS chạy sau khi màn hình mount xong |

Ví dụ — vào thẳng trạng thái đã nạp danh sách (màn hình này chỉ nạp khi bấm *Tìm kiếm*):

```
http://localhost:8787/_harness/?autorun=main_doc.KeHoachMua.getList_KeHoachMua()
```

So sánh hành vi giữa hai bản Core:

```
http://localhost:8787/_harness/?core=Core
http://localhost:8787/_harness/?core=Corei
```

---

## Bảng điều khiển (góc dưới phải)

Liệt kê **mọi lời gọi API bị chặn**:

- `OK` — có fixture, đã trả dữ liệu
- `THIẾU` — chưa có fixture, harness trả mảng rỗng để màn hình vẫn dựng được

Bấm vào tên lời gọi để in payload đầy đủ ra Console. Đây là cách nhanh nhất để biết
cần bổ sung fixture nào khi chuyển sang màn hình mới.

Lỗi JS được hiện thành dải đỏ ở đầu trang (code cũ có nhiều `try/catch` rỗng nuốt lỗi,
không có dải này thì chỉ thấy trang trắng).

---

## Thêm màn hình mới

1. Mở harness với `?app=...&page=...` trỏ tới module cần chạy.
2. Nhìn bảng điều khiển, ghi lại các lời gọi đánh dấu `THIẾU`.
3. Thêm khoá tương ứng vào `fixtures.js`.

Khoá tra cứu theo thứ tự ưu tiên:

| Loại | Khoá |
|---|---|
| Gọi procedure Oracle | giá trị `func`, vd `PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_LayDS` |
| Gọi API thường | giá trị `action`, vd `TC_KhoanThu/LayDanhSach` |
| Danh mục dùng chung | `action` + `#` + `strMaBangDanhMuc` |

**Tên cột không cần đoán**: đọc thẳng trong `genTable_*` và `fillForm_*` của module —
đó chính là tên cột mà procedure thật trả về.

Định dạng phản hồi mà Core trông đợi:

```js
{ Success: true, Message: '', Data: [ ... ], Pager: <tổng số dòng> }
```

---

## Ghi dữ liệu

`WRITERS` trong `mock.js` xử lý các procedure `_Them` / `_Sua` / `_Xoa`: ghi thẳng vào
fixture trong bộ nhớ, nên thêm xong thấy dòng mới, xoá xong dòng biến mất.
Dữ liệu mất khi tải lại trang — đúng bản chất harness.

---

## Giới hạn

- Không có phân quyền, không có menu, không có breadcrumb (`strChucNang_Id` để rỗng
  có chủ đích để bỏ qua `genPath_ChucNang()`).
- Không gọi `edu.constant.init()`: hàm này chạy tiếp một hàm khởi tạo phiên nằm ẩn
  trong file vendor `App_Themes/Plugins/pagination/jquery.simplePagination.min.js`,
  hàm đó đọc blob cấu hình mã hoá từ `$("#myTextBox")` do ASPX shell render và sau đó
  dựng menu. Harness không có những thứ đó.
  *Lưu ý:* `Core/constant.js` bọc lời gọi này trong `try/catch` còn `Corei/constant.js`
  thì không — đây là một điểm lệch có thật giữa hai bản.
- Chức năng upload, in báo cáo, CKEditor không chạy (`Scripts/`, `Handler/` không có
  trong repo).

---

## Thư mục này không thuộc sản phẩm

`_harness/` chỉ phục vụ phát triển. Nếu muốn giữ ngoài git, thêm `_harness/` vào
`.gitignore`.
