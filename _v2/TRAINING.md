# Đào tạo bộ giao diện `_v2`

Tài liệu này dành cho người tiếp nhận, phát triển và triển khai bộ giao diện mới của LoginVT/UMS.

## 1. Mục tiêu

Sau khóa học, người học có thể:

- Mô tả kiến trúc của `_v2` và quan hệ với ứng dụng ASP.NET cũ.
- Chạy giao diện bằng dữ liệu mẫu trên máy cá nhân.
- Chạy giao diện thật trên host với phiên đăng nhập và API.
- Tìm đúng vị trí một màn hình theo `MAUNGDUNG` và `DUONGDANFILE`.
- Đọc, sửa và tạo màn hình theo khuôn chung hiện có.
- Gọi API đúng giao thức của hệ thống cũ.
- Kiểm tra màn hình bằng các harness trước khi đóng gói.
- Đóng gói và triển khai mà không làm mất dependency của vỏ ASP.NET.

## 2. Kiến trúc tổng quát

```text
Trình duyệt
    |
    +--> _v2/login.aspx
    |       |
    |       +--> Apis.LoginVT.Login (code-behind cũ)
    |
    +--> _v2/index.aspx
            |
            +--> Apis.LoginVT.Index
            |       +--> AXYZCLRVN()  : blob phiên
            |       +--> Config.js   : URL microservice
            |       +--> crypto-js   : AE() / AD()
            |
            +--> assets/js/session.js
            |       +--> userId, appId, tokenJWT, iM
            |
            +--> assets/js/api.js
            |       +--> form-urlencoded
            |       +--> JWT Bearer
            |       +--> AE/AD
            |
            +--> assets/js/app.js
                    +--> vai trò
                    +--> cây chức năng
                    +--> hash routing
                    +--> nạp HTML/JS màn hình
                            |
                            +--> ApisTaiChinh/Modules/...
                            +--> ApisCongCanBo/Modules/...
                            +--> ApisCongSinhVien/Modules/...
                            +--> các phân hệ khác
                                    |
                                    +--> microservice
                                            |
                                            +--> Oracle PL/SQL
```

`_v2` là giao diện mới, không phải backend mới. Nghiệp vụ vẫn nằm ở API và Oracle.

## 3. Hai chế độ chạy

### 3.1. Chế độ demo

Dùng khi làm giao diện trên máy cá nhân. Không cần đăng nhập và không gọi API thật.

```text
_v2/index.html
    -> api.dataSource = "demo" hoặc "auto"
    -> assets/js/demo-data.js
    -> dữ liệu mẫu
```

Chạy bằng static server, không mở trực tiếp bằng `file://` vì màn hình được nạp bằng `fetch()`.

```powershell
powershell -ExecutionPolicy Bypass -File _harness\serve.ps1 -Port 8788
```

Mở:

```text
http://localhost:8788/_v2/index.html
```

### 3.2. Chế độ API thật

Dùng trên host IIS hoặc môi trường có ASP.NET:

```text
_v2/index.aspx
    -> session thật
    -> API thật
    -> dữ liệu Oracle
```

Mở:

```text
https://<host>/<ung-dung>/_v2/login.aspx
```

Không dùng `index.html` để đánh giá API thật.

## 4. Dependency của vỏ ngoài

Không được xem `_v2` là thư mục độc lập. Khi chạy thật, nó cần ứng dụng ASP.NET cha:

```text
<ung-dung>/
├── bin/                         DLL chứa code-behind
├── Web.config                   cấu hình ASP.NET/IIS
├── Config.js                    Init_API() — dùng khi _v2/Config.js không có
├── Handler/                     *.ashx tải tệp lên
├── Upload/                      tệp tải lên, phôi in
├── App_Themes/                  chỉ còn encrypt.js của trang đăng nhập (nếu chưa chép vào _v2)
├── Pages/                       hỗ trợ/quên mật khẩu nếu còn dùng
└── _v2/
    ├── index.aspx
    ├── login.aspx
    ├── Logout.aspx
    ├── assets/
    └── Apis.../
```

Các class ASP.NET được dùng lại:

```text
Apis.LoginVT.Index
Apis.LoginVT.Login
Apis.LoginVT.Logout
```

Chúng thường nằm trong `bin/Apis.LoginVT.dll`, không nằm trong file JavaScript.

## 5. Luồng khởi động

1. Người dùng đăng nhập ở `login.aspx` hoặc `_v2/login.aspx`.
2. Code-behind tạo phiên và đưa blob vào `lblXYZCLRVN`.
3. `index.aspx` khai báo `AXYZCLRVN()`.
4. `session.js` giải blob bằng `AD(blob, "AzzS")`.
5. `session.js` lấy `Init_API()` từ `Config.js`.
6. `app.js` gọi procedure lấy danh sách vai trò.
7. Người dùng chọn vai trò.
8. `app.js` gọi procedure lấy cây chức năng.
9. Người dùng chọn màn hình.
10. `app.js` tìm HTML theo `MAUNGDUNG + DUONGDANFILE` rồi nạp HTML, CSS và JS.

Ví dụ:

```text
MAUNGDUNG     = ApisTaiChinh
DUONGDANFILE  = /Modules/danhmucheso/html/hethonghoadon.html

=> _v2/ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html
```

## 6. Quy tắc tìm và đặt màn hình

Mỗi màn hình thường có:

```text
_v2/<PhanHe>/Modules/<module>/
├── html/<man-hinh>.html
├── scripts hoặc script/<man-hinh>.js
└── css/<man-hinh>.css       tùy nhu cầu
```

HTML tối thiểu:

```html
<div id="man-hinh"></div>
<script src="../scripts/man-hinh.js"></script>
```

Đường dẫn `src` được tính từ vị trí của file HTML, không tính từ `index.aspx`.

Quy tắc quan trọng:

- Không khai báo thêm màn hình trong router nếu màn hình nằm đúng cây thư mục.
- Không đổi `MAUNGDUNG` hoặc `DUONGDANFILE` để chữa lỗi đường dẫn một cách tùy tiện.
- Không nạp màn hình cũ khi màn hình mới chưa tồn tại.
- Tên tham số và tên cột API phải chép đúng từ màn hình gốc.
- Không đưa dữ liệu thật vào `demo-data.js`.

## 7. Điều hướng và trạng thái

Hash hiện tại có ba tầng:

```text
#/                         danh sách vai trò
#/r/<vaiTroId>             menu của vai trò
#/r/<vaiTroId>/<chucNangId> mở màn hình
```

Trạng thái chính nằm trong `ums.state`:

```js
ums.state.mode
ums.state.roleId
ums.state.chucNangId
ums.state.thuVaiId
ums.state.roles
ums.state.menu
```

Không dùng `location.href` để chuyển giữa các màn hình `_v2`. Dùng:

```js
ums.app.openPath('/Modules/bao-cao/html/bao-cao.html');
ums.app.openHash('#tintuc');
```

Khi mở một màn hình theo ID chức năng, router tự áp dụng:

- breadcrumb;
- trạng thái mục đang chọn;
- `THONGTINKHONGHIENTHI`;
- ghi chú chuyển đổi nếu có;
- xử lý lỗi tải màn hình.

## 8. Gọi API

Dùng API chung:

```js
ums.api.call({
    action: 'TC_HoaDon/LayDanhSach',
    func: 'PKG_TAICHINH_HOADON.LayDanhSach',
    iM: ums.session.iM,
    strTuKhoa: '',
    pageIndex: 1,
    pageSize: 20
}).then(function (res) {
    var rows = res.data || [];
    var pager = res.pager;
}).catch(function (err) {
    ums.api.handle(err, 'LayDanhSach');
});
```

`ums.api.call()` tự xử lý:

- `Authorization: Bearer <tokenJWT>`;
- các tham số hệ thống;
- `AE()` khi có `iM`;
- `AD()` khi phản hồi có `Data.B`;
- lỗi HTTP, timeout và 401;
- trạng thái đang tải.

Không tự dùng `fetch()` cho API nghiệp vụ nếu không có lý do đặc biệt.

### API JSON nguyên văn

Một số API cũ nhận JSON thay vì form-urlencoded:

```js
ums.api.json('SYS_Report/ThemMoi', {
    arrTuKhoa: rows
});
```

Chỉ dùng `ums.api.json()` khi bản gốc thực sự gửi `application/json`.

### Cảnh báo bảo mật

`AE()`/`AD()` là cơ chế tương thích của hệ thống cũ, không nên xem là mã hóa bảo mật hiện đại. Không ghi token, mật khẩu hoặc payload thật vào log, ảnh chụp màn hình hay dữ liệu mẫu.

## 9. Dùng tầng giao diện chung

Trước khi viết màn hình mới, tra:

- `assets/js/ui.js`: nút, bảng, hộp thoại, thông báo, select.
- `assets/js/crud.js`: màn danh sách + biểu mẫu.
- `assets/js/patterns.js`: các khuôn bố cục dùng lại.
- `assets/js/ref.js`: danh mục và bộ lọc đào tạo.
- `assets/js/report.js`: báo cáo, import, tải tệp.
- `assets/js/phieu.js`: xem/in phiếu.
- `assets/js/lich.js`: lịch.
- `assets/js/diemhoc.js`: bảng điểm.
- `assets/js/thuvai.js`: thủ vai sinh viên.
- `assets/js/icon-fa4.js`: chuẩn hóa icon cũ sang Font Awesome mới.

Mở [components.html](components.html) trước khi dựng màn hình. Không tự tạo lại một khuôn đã có.

### Khuôn CRUD cơ bản

> Chữ ký đầy đủ, đối chiếu mã, ở [HUONG-DAN-NGUOI-MOI.md](HUONG-DAN-NGUOI-MOI.md) mục 3. Bản dưới là tối thiểu chạy được
> (mẫu cũ ở đây dùng khoá `api` / `columns[].key` — KHÔNG phải chữ ký của `ums.crud`, đã sửa 2026-10-06).

```js
(function () {
    'use strict';
    ums.crud({
        root: document.getElementById('mau'),
        title: 'Danh sách mẫu', listTitle: 'Danh sách', formTitle: 'mẫu', icon: 'fa-table-list',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: { paged: true, call: function (f) { return { action: 'TC_Mau/LayDanhSach', method: 'GET', strTuKhoa: f.q || '' }; } },
        columns: [{ title: 'Mã', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên', prop: 'TEN' }],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã', required: true },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true }
        ],
        save: function (v, row) { return { action: row ? 'TC_Mau/CapNhat' : 'TC_Mau/ThemMoi', method: 'POST', strId: row ? row.ID : '', strMa: v.strMa, strTen: v.strTen }; },
        remove: function (ids) { return ids.map(function (id) { return { action: 'TC_Mau/Xoa', method: 'POST', strIds: id }; }); }
    });
})();
```

Đây là khung minh họa. Khi chuyển màn thật, phải dùng đúng action, func, tên cột và tham số của bản gốc (`tom-tat-goc.py` mục 4 và 7).

## 10. Quy ước giao diện bắt buộc

1. Bám bố cục bản gốc: một cột vẫn là một cột, hai cột vẫn là hai cột.
2. Dùng `ums.ui.table`, không tự dựng bảng nếu tầng chung đã hỗ trợ.
3. Dùng `ums.crud` cho danh sách + biểu mẫu thông thường.
4. Biểu mẫu chính thay chỗ danh sách trong trang; không dùng dialog cho biểu mẫu lớn.
5. Ô ngắn xếp hai ô một hàng; ô dài chiếm cả hàng.
6. Ô chọn cha chưa có giá trị thì ô con bị khóa và phải xóa giá trị cũ.
7. Dùng `ums.pat.chain([cha, con, chau])` cho quan hệ phụ thuộc.
8. Nút đóng luôn ở ngoài cùng bên trái nhóm nút.
9. Nút tải lại dùng `ui.btn('reload')`, đặt cuối nhóm.
10. Icon phải đi qua chuẩn `ums.ui.btn()` hoặc `ums.iconFA4()`.
11. Không tự viết CSS chung trong từng màn; đưa CSS dùng lại vào `assets/css`.
12. Không tự dùng `select2` cho ô ít mục trong bảng.

Chi tiết đầy đủ nằm trong [BO-CUC.md](BO-CUC.md).

## 11. Quy trình chuyển một màn hình

### Bước 1: Đọc bản gốc

Đọc cả:

```text
Apis<PhanHe>/Modules/<module>/html/<man>.html
Apis<PhanHe>/Modules/<module>/script hoặc scripts/<man>.js
```

Ghi lại:

- bố cục một hay hai cột;
- các bộ lọc;
- các lời gọi API;
- cột bảng;
- tham số thêm/sửa/xóa;
- hộp thoại và màn hình con;
- các điểm bản gốc có lỗi hoặc chưa bao giờ chạy.

### Bước 2: Tra khuôn

Mở `components.html` và `BO-CUC.md`. Dùng khung gần nhất trước khi tự dựng.

### Bước 3: Tạo HTML và JS

Đặt tệp đúng cây thư mục của chức năng. Không đổi tên route tùy ý.

### Bước 4: Chuyển dữ liệu mẫu

Nếu cần làm UI trước khi có API, thêm fixture trong dữ liệu demo. Dữ liệu demo phải giữ đúng hình dạng phản hồi thật.

### Bước 5: Kiểm tra cục bộ

Chạy static server, mở màn hình, kiểm tra:

- bố cục;
- responsive;
- trạng thái rỗng;
- loading và lỗi;
- thêm/sửa/xóa giả lập;
- hộp thoại;
- icon;
- quan hệ cha-con;
- không có lỗi Console.

### Bước 6: Kiểm tra hồi quy

Chạy các harness phù hợp:

```text
_harness/kiem-dong-bo.html
_harness/thu-crud.html
_harness/kiem-cot-trai.html
```

Không đánh dấu hoàn thành chỉ vì màn hình mở được. Phải kiểm cả luồng chính và đường ghi dữ liệu.

### Bước 7: Kiểm tra API thật

Trên host kiểm tra:

- đúng vai trò;
- đúng quyền dữ liệu;
- đúng bộ lọc;
- đúng phân trang;
- thêm/sửa/xóa có đúng ID;
- nạp lại sau khi lưu;
- không tạo dữ liệu trùng;
- không để lại dữ liệu thử.

### Bước 8: Đóng gói

Sau khi sửa CSS:

```powershell
python _harness\gop-css.py
```

Đóng gói deploy:

```powershell
python _harness\dong-goi.py
```

Không sửa trực tiếp trong `_v2_deploy`; đây là thư mục sinh ra để triển khai.

## 12. Kiểm tra trước khi đưa lên host

### Kiểm tra tệp

- Đã có HTML và JS đúng đường dẫn chưa?
- Tên thư mục có đúng `MAUNGDUNG` không?
- Có CSS riêng nào chưa được nạp không?
- Có file demo bị đóng gói nhầm không?
- Có dependency CDN còn sót không?

### Kiểm tra vỏ

- `index.aspx` có tải được không?
- `login.aspx` có giữ đúng ID điều khiển không?
- `Config.js` có đủ prefix API không?
- `crypto-js.js` có tồn tại ở `_v2/assets/vendor/crypto/crypto-js.js` không?
- `bin/Apis.LoginVT.dll` có tồn tại không?
- Font `.woff2` có trả HTTP 200 không?

### Kiểm tra dữ liệu

- Không dùng nhầm ID dòng với ID đối tượng.
- Không gửi tham số `undefined`.
- Không gửi ô lọc không được chọn thành giá trị sai kiểu.
- Không thử ghi lên lớp, sinh viên hoặc dữ liệu thật nếu chưa có phương án dọn.
- Không đưa token, mật khẩu, chuỗi kết nối hoặc dữ liệu cá nhân vào repo.

## 13. Sự cố thường gặp

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Thiếu `AXYZCLRVN()` | Mở `index.html` hoặc ASPX chưa chạy | Mở `_v2/index.aspx` trên IIS |
| Thiếu `AD()` | Sai đường dẫn `crypto-js.js` | Kiểm tra `_v2/assets/vendor/crypto/crypto-js.js` |
| Thiếu `Init_API()` | Sai hoặc thiếu `Config.js` | Kiểm tra `_v2/Config.js`, không có thì `../Config.js` |
| Không tìm thấy base URL | `Config.js` thiếu prefix | Đối chiếu `action` với `Init_API()` |
| HTTP 401 | JWT hết hạn hoặc phiên sai | Đăng nhập lại, kiểm tra session |
| Chức năng chưa chuyển đổi | Sai cây `MAUNGDUNG/DUONGDANFILE` | Đặt HTML đúng đường dẫn API yêu cầu |
| Icon thành ô vuông | Font bị 404 hoặc MIME sai | Kiểm tra `.woff2` và `web.config` |
| CSS sửa nhưng host chưa đổi | Chưa gộp CSS hoặc cache | Chạy `gop-css.py`, kiểm tra `?v=` |
| Form trắng | JS màn hình lỗi hoặc dependency thiếu | Xem Console, Network và thứ tự script |
| Lưu lần hai tạo dòng trùng | Không chuyển trạng thái thêm sang sửa | Kiểm tra `strId` và luồng reload |
| Ô con giữ giá trị cũ | Chưa gắn chain sau xử lý chọn | Dùng `ums.pat.chain()` |

## 14. Bài thực hành đề xuất

### Bài 1: Chạy bản demo

1. Chạy `serve.ps1`.
2. Mở `_v2/index.html`.
3. Chọn một vai trò mẫu.
4. Mở một màn hình mẫu.
5. Mở DevTools và xác nhận không có lỗi Console.

### Bài 2: Đọc một màn hình

1. Chọn một chức năng từ menu mẫu.
2. Tìm `DUONGDANFILE` tương ứng trong `demo-data.js` hoặc dữ liệu API.
3. Mở HTML và JS của màn hình.
4. Ghi lại các lời gọi `ums.api.call()`.
5. Đối chiếu cột bảng với dữ liệu trả về.

### Bài 3: Tạo màn CRUD demo

1. Tạo HTML đúng cây module.
2. Dùng `ums.crud()`.
3. Tạo fixture cho danh sách.
4. Kiểm tra thêm, sửa, xóa ở chế độ demo.
5. Chạy `kiem-dong-bo.html` và `thu-crud.html`.

### Bài 4: Đóng gói thử

1. Chạy `gop-css.py`.
2. Chạy `dong-goi.py`.
3. Kiểm tra `_v2_deploy` không thiếu HTML, JS, CSS, font.
4. Không sửa tay trong `_v2_deploy`.

## 15. Tài liệu cần đọc tiếp

- [TRIEN-KHAI.md](TRIEN-KHAI.md): triển khai host và xử lý sự cố.
- [BO-CUC.md](BO-CUC.md): quy ước bố cục và tầng dùng chung.
- [CHUYEN-DOI.md](CHUYEN-DOI.md): quy trình chuyển màn hình từ bản gốc.
- [components.html](components.html): các khuôn màn hình có sẵn.
- `CLAUDE.md`: kiến trúc hệ thống cũ, dependency và các bẫy dữ liệu/API.

## 16. Nguyên tắc nhớ nhanh

```text
Đọc bản gốc trước.
Tra khuôn chung trước.
Giữ nguyên route và API contract.
Dùng API/UI helper chung.
Kiểm demo trước, kiểm host sau.
Đóng gói từ _v2, không sửa _v2_deploy.
Không xóa dependency của ASP.NET cha.
```
