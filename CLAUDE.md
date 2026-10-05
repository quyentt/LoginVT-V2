# LoginVT — Ghi chú hệ thống

Tệp này tồn tại để không phải dò lại codebase từ đầu mỗi lần. Mọi con số và
đường dẫn dưới đây đều đã kiểm chứng trực tiếp trên mã nguồn.

Cập nhật: 2026-10-05 (rút gọn từ 187 KB — nhật ký chuyển sang `_v2/NHAT-KY-CHUYEN.md`, `_v2/GHI-NHO-TANG-CHUNG.md`, `_harness/kiem-host/LICH-SU.md`)

> **Vừa chuyển sang máy mới?** Đọc [mục 11](#11-làm-tiếp-trên-máy-khác) trước:
> chép gì sang, chạy thử thế nào, đã làm đến đâu và việc kế tiếp là gì.

---

## 1. Đây là cái gì

**Repo frontend thuần** cho hệ thống quản lý đại học (UMS). 4.122 tệp:
1.016 HTML, 983 JS, 6 ASPX, 2 CS.

**Không có trong repo này:** backend, API, database, `Web.config`, `Config.js`,
`Global.asax`, `Scripts/`, `Handler/`, `bin/`, `ServicesConfig/` — tất cả đều bị
`.gitignore` loại ra và cũng không tồn tại trên máy. Đừng đi tìm.

```
Trình duyệt ──► index.aspx / indexi.aspx   (vỏ SPA, nạp Core/ hoặc Corei/)
                      │  makeRequest({ action, func, … })
                      ▼
              30 microservice  (TC, DKH, SV, NS, CMS, KTX…)
                      │  URL lấy từ web.config — không có ở đây
                      ▼
              Oracle — 60+ package PL/SQL
```

Toàn bộ nghiệp vụ nằm trong PL/SQL. API chỉ là lớp trung chuyển mỏng.

---

## 2. Cấu trúc thư mục

```
index.aspx / indexi.aspx     hai vỏ SPA (xem mục 5)
login.aspx / Logout.aspx     login.aspx.cs KHÔNG có trong repo
Core/ · Corei/               hai bản framework song song, lệch 5.470 dòng
Apis<PhânHệ>/Modules/<module>/{html,script,css}/
App_Themes/                  tài nguyên của indexi (AdminLTE + Bootstrap 3)
assets/                      tài nguyên của index (Bootstrap 5 + FA6)
Upload/                      695 MB — DỮ LIỆU THẬT, xem mục 8
HTML-*/                      mockup tĩnh, chưa nối vào hệ thống
```

Mẫu module chuẩn: một tệp `html/<tên>.html` (view) + một tệp
`script/<tên>.js` (object prototype). Hệ CŨ không có bước build (bản mới `_v2`
có đúng một bước: gộp CSS, xem mục 10); tệp nạp động qua
`loadPage()` kèm version ngẫu nhiên để chống cache
([Core/systemroot.js:946](Core/systemroot.js#L946)).

**26 phân hệ, ~500 module, 859 màn hình.** Lớn nhất: ApisCongCanBo (154 màn),
ApisNhanSu (121), ApisTaiChinh (73), ApisNCKH (55), ApisCMS (49).

---

## 3. Cách gọi API

`makeRequest()` — [Core/systemroot.js:577](Core/systemroot.js#L577)

```js
var obj = {
    'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4SNCAP',  // chuỗi MÃ HOÁ
    'func'  : 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Sua',   // procedure thật
    'iM'    : edu.system.iM,
    'strId' : '…'
};
```

- `action` dạng `<PREFIX>_<Controller>/<method đã mã hoá>`. **Không đọc được** —
  muốn biết nó làm gì phải nhìn `func` đi kèm.
- PREFIX quyết định gọi microservice nào. 30 base URL khai báo trong
  `Init_API()` ([indexi.aspx:1891](indexi.aspx#L1891)), lấy từ `web.config`.
- Tự động chèn: `strChucNang_Id`, `strNguoiThucHien_Id`, `strVaiTroDangNhap_Id`,
  `strNguoiThucVai_Id`. Xác thực bằng JWT Bearer.
- Khi có `iM`, payload bị bọc thành `{A: AE(json, key)}`, trả về giải mã bằng `AD()`.
- Phản hồi: `{ Success, Message, Data, Pager }`.

**Quy ước procedure:** `Pr_<Viết tắt>_<Đối tượng>_{Them|Sua|Xoa|LayDS|Get_By_Id}`

**Danh mục dùng chung** — thêm danh mục mới KHÔNG cần tạo bảng:
```js
edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.KEHOACH.MUAHANG.PHANLOAIHANGHOA", "dropPhanLoai");
```

**Cột trả về viết HOA:** `ID`, `TEN`, `MA`, `DUONGDANFILE`, `DAOTAO_THOIGIANDAOTAO`…
Khoá chính là GUID 32 ký tự hex không gạch: `B2042224DB1D4AA6BC11B65EED062359`.
Ngày truyền dạng chuỗi `dd/MM/yyyy`. Phân trang đẩy `pageIndex`/`pageSize`
xuống procedure, không phân trang ở client.

---

## 4. Mô hình vai trò và phân quyền

### Tầng 1 — quyền chức năng

```
Người dùng ──┬──► Vai trò ──┬──► Ứng dụng
             │              ├──► Chức năng   (cây menu)
             │              └──► Quyền       (thêm/sửa/xoá/xem)
             └──► Chức năng (gán trực tiếp, vượt qua vai trò)
```

| Việc | Procedure |
|---|---|
| Lấy vai trò của người dùng | `PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung` |
| Lấy cây chức năng của vai trò | `PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung` |
| Gán vai trò cho người dùng | `PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro` |
| Gán quyền cho vai trò | `PKG_CORE_QUANTRI_02.Them_Core_VaiTro_Quyen` |

### Tầng 2 — quyền dữ liệu (theo chiều)

`Core_Data_Dimension` → `Core_Dimension_Value`, gán qua
`Core_Role_Data_Scope` (theo vai trò), `Core_User_Data_Scope` (theo người dùng),
`Core_U_R_F_Data_Scope` (người dùng × vai trò × chức năng).
Có kế thừa quyền: `CMS_PhanQuyenDuLieu/KhoiTao_KeThua_Quyen`.

### ⚠ Bẫy đặt tên

**`appId` chính là `VaiTro_Id`**, không phải id ứng dụng:

```js
// Core/systemroot.js:5089
'strVaiTro_Id': me.appId,
```

Biến `dtUngDung` thực ra chứa danh sách **vai trò** (`LayDSVaiTroNguoiDung`).
Hiểu "ứng dụng" theo nghĩa đen là sai ngay.

---

## 5. index.aspx hay indexi.aspx — điểm quan trọng nhất

> Quyết định shell diễn ra ở **từng CHỨC NĂNG**, không phải theo vai trò.
> Một vai trò có thể có chức năng nằm ở cả hai shell, và người dùng **bị tải
> lại trang** mỗi lần nhảy qua lại.

### Luật: cột `TENANH` trong bảng chức năng vừa là icon, vừa là router

| Đang ở | Điều kiện | Nhảy sang |
|---|---|---|
| `index.aspx` | `TENANH` bắt đầu bằng `"fa "` (Font Awesome 4) | → `indexi.aspx` |
| `indexi.aspx` | `TENANH` **không** bắt đầu bằng `"fa "`, hoặc rỗng | → `index.aspx` |

```js
// Core/systemroot.js:829
} else if ((objChucNang.DUONGDANFILE && strTenAnh && strTenAnh.indexOf('fa ') == 0)) {
    location.href = "./indexi.aspx"
}
// Corei/systemroot.js:782
if (objChucNang.DUONGDANFILE && (!strTenAnh || strTenAnh.indexOf('fa ') != 0)) {
    location.href = "./index.aspx"
}
```

Cùng giá trị đó được render thành icon menu: `<i class="' + data[j].TENANH + '">`.
**Đổi icon trong DB = đổi shell.**

### Toàn bộ 4 điểm chuyển trang trong hệ thống

| # | Vị trí | Khi nào | Đi đâu |
|---|---|---|---|
| 1 | [Core:830](Core/systemroot.js#L830) | Mở chức năng có `TENANH` kiểu cũ | → indexi |
| 2 | [Corei:783](Corei/systemroot.js#L783) | Mở chức năng có `TENANH` kiểu mới | → index |
| 3 | [Corei:187](Corei/systemroot.js#L187) | Bấm logo — thoát vai trò | → index |
| 4 | [Corei:5034](Corei/systemroot.js#L5034) | Vào thẳng indexi mà sessionStorage rỗng | → index |

Ngoại lệ: `Core` có danh sách trắng 2 đường dẫn đặt **trước** luật `TENANH`
([systemroot.js:820](Core/systemroot.js#L820)) — 2/859 màn hình đã chuyển sang SPA.

### Khác biệt hai shell

| | `index.aspx` | `indexi.aspx` |
|---|---|---|
| Core | `Core/` | `Corei/` |
| Tài nguyên | `assets/` | `App_Themes/` |
| Bootstrap | 5.3.2 | 3.3.7 + AdminLTE |
| Riêng có | Firebase FCM, socket.io, swiper, thủ vai SV | CKEditor, MathJax, WIRIS, menu cây, mẫu file báo cáo |
| Số hàm | 186 | 188 (trùng ~176, tức 94%) |

### Vòng đời một phiên

```
login.aspx (code-behind không có trong repo)
   └─► index.aspx: checkChucNang() → LayDSVaiTroNguoiDung → dtUngDung
         └─► Trang chủ "Danh sách vai trò" (dựng inline tại index.aspx:1992,
             phân nhóm bằng khớp từ khoá trên TÊN vai trò, 7 nhóm)
               └─► setUngDung(vaiTro)  [Core:5051]
                     ├─ appId = VaiTro_Id, appCode = MAUNGDUNG
                     └─ getlistByUser_ChucNang() → genHTML_MenuVertical()
                           └─► initMain(…)  ← ĐÂY là chỗ chọn shell
```

**Thủ vai:** vai trò có `CHOPHEPTHUVAI = 1` cho phép cán bộ đăng nhập thay sinh
viên. Trạng thái ở `localStorage.pendingThuVaiSV` + `sessionStorage.thuvai`.

---

## 6. Giao diện quản trị (ApisCMS — 18 module, 49 màn hình)

| Nhóm | Màn hình | Làm được gì |
|---|---|---|
| Người dùng | `nguoidung`, `nguoidungvaitro`, `nguoidungchucnang`, `canbochucnang` | Tạo/sửa tài khoản, đặt lại mật khẩu, gán vai trò, gán chức năng riêng ngoài vai trò |
| Vai trò | `vaitro`, `vaitrochucnang`, `vaitronguoidung` | Tạo/sửa/xoá vai trò, gán chức năng, gán quyền thêm/sửa/xoá/xem |
| Chức năng & ứng dụng | `chucnang`, `configurechucnang`, `sodoquytrinh`, `testchucnang`, `ungdung`, `ungdungchucnang`, `filebaocao` | Khai báo mã, tên, **icon (= `TENANH`, kiêm router)**, đường dẫn hiển thị/tệp/thư mục/hướng dẫn, chức năng cha, thứ tự, phạm vi truy cập |
| Phân quyền dữ liệu | `quantriquyendulieu` (3 bản), `diem`, `baocaoimport`, `canbonhaphoso*`, `sinhvientunhap`, `canhantunhaphoso` | Gán phạm vi dữ liệu theo chiều; phân quyền tới mức người dùng × vai trò × chức năng; quy định trường nào cán bộ nhập, trường nào SV tự nhập |
| Danh mục & công cụ DB | `danhmucdulieu`, `danhmucthuoctinh`, `danhmuctenbang`, `danhmuctukhoa`, `danhmucimport/export`, `mauphoiin`, `comparetable`, `exporttable`, `upcode`, `cloudupdate`, `autologdb` | Danh mục nghiệp vụ **và** công cụ tác động cấu trúc DB: so sánh bảng, xuất bảng, cập nhật code từ cloud |
| Hệ thống | `config_app`, `crypto`, `guiemail`, `accessedhistory`, `chuyendulieu`, `quanlytientrinhguiemail` | Cấu hình, mã hoá, gửi email hàng loạt + theo dõi tiến trình, lịch sử truy cập |

Lưu ý: người quản trị có thể **vô tình đổi shell của một chức năng** chỉ bằng
cách đổi icon ở màn hình `chucnang`.

---

## 7. Mức tập trung của markup — quan trọng khi đổi giao diện

| | Số liệu |
|---|---:|
| `loadToTable_data` (dựng bảng chung) | **1.876** lời gọi — nhưng **chỉ sinh `<tr>/<td>`**; `<table>`, `<thead>`, wrapper nằm rải rác trong 859 tệp HTML |
| `loadToCombo_data` | 3.477 lời gọi |
| Tệp JS tự dựng `<tr>/<td>` bằng tay | **382** |
| `makeRequest` | 8.664 lời gọi (~1 lời gọi / 39 dòng JS) |
| Dòng nối chuỗi HTML trong JS | 23.471 |
| Dòng có `class=` trong JS | **17.336** |
| Thẻ `<div>` trong 859 màn hình | 68.294 (79 div/màn) |
| CSS: `App_Themes` + `assets/css` + `assets/css-new` + CSS module | 117 tệp, **228.197 dòng** |

Class cũ xuất hiện nhiều nhất **trong JS**: `td-center` 2.795 · `btn` 1.871 ·
`td-left` 1.528 · `form-control` 1.521 · `btn-default` 1.296 · `select-opt` 653.

Không có helper sinh nút trong `Core`/`Corei` — mỗi `mRender` tự viết chuỗi tay
(369 chỗ `btn btn-default btnEdit`, 87 chỗ `btnDelete`…).

→ **Đổi CSS mà bỏ quên 17.336 dòng JS này thì mọi bảng và mọi nút trong ô bảng
sẽ vỡ.**

---

## 8. Cạm bẫy — đọc trước khi sửa

1. **`TENANH` là coupling ngầm** (mục 5). Không ai đọc bảng dữ liệu mà đoán ra.
2. **`Core` và `Corei` lệch 5.470 dòng, không có test nào.** Ví dụ có thật:
   `Core/constant.js` bọc `try/catch` quanh `AFG()`, `Corei/constant.js` gọi
   thẳng `ASG()` — cùng vị trí, khác hành vi, gây trắng trang.
3. **`AE`/`AD`/`ASG` bị nhét vào tệp thư viện bên thứ ba** —
   `App_Themes/Plugins/pagination/crypto-js.js` và
   `jquery.simplePagination.min.js`. Nâng cấp hai thư viện đó bằng bản gốc là
   toàn hệ thống chết. `ASG()` còn đọc blob cấu hình mã hoá từ `$("#myTextBox")`
   do ASPX shell render.
4. **170 chỗ phụ thuộc CDN lúc chạy** (86 Chart.js + 84 chartjs-plugin-datalabels).
   Nguyên nhân: `assets/js/chart.js` là **bản ESM**, không nạp được bằng thẻ
   `<script>` thường. Bản UMD đã tải sẵn ở `assets/vendor/chart.umd.js`.
5. **jQuery 2.2.0** ở `indexi` (dính CVE-2020-11022/11023 XSS qua `.html()`),
   trong khi markup được dựng bằng nối chuỗi ở 23.471 dòng.
6. **`eval()`** 14 chỗ trong `Core`, 17 chỗ trong `Corei` — có chỗ chạy chuỗi lấy
   từ DB: `eval(data[0].DUONGDANHUONGDANSUDUNG)` ([systemroot.js:6525](Core/systemroot.js#L6525)).
7. **`fakedb: []` được truyền 8.389 lần nhưng KHÔNG nơi nào đọc** — cơ chế mock
   bị bỏ dở. Thêm ~10 dòng vào `makeRequest` là hồi sinh được toàn bộ.
8. **`Upload/File/` — 695 MB dữ liệu thật**: mã sinh viên (`BIT220263`,
   `BBA220561`…), danh sách thi, danh sách nhận ưu đãi, điểm học phần. Cân nhắc
   kỹ trước khi đẩy đi đâu.
9. **Font Awesome Pro** trong `assets/` và `html data/` có header ghi nguồn
   `soft98.ir` (trang bẻ khoá), không phải fontawesome.com. FA Pro là sản phẩm
   thương mại — cần xác minh giấy phép.
10. **21 bản `danhmucdulieu.js`** với 13 nội dung khác nhau (18.532 dòng cộng lại)
    — sửa một chỗ không lan ra chỗ khác.

---

## 9. Môi trường máy này & kiểm host

**Git.** `origin` fetch = `https://github.com/quyentt/loginVT-main.git` (kho gốc), push = `https://github.com/quyentt/LoginVT-V2.git`, nhánh `main`.
**Kho máy là bản GỘP một commit (`20b5dbe6`, 2/10), KHÔNG chung gốc với kho gốc** → không `pull`/`merge`: `git fetch origin` rồi
`git checkout origin/main -- <tệp>` cho từng tệp gốc đổi (so nội dung bỏ CRLF trước; mốc gốc đã chuyển ở đầu `_v2/CHO-CHUYEN-SAU-PULL.md`).
Tệp GỐC (ngoài `_v2`, `_harness`) luôn theo kho gốc. `.gitignore` chặn `**/tk.md`, `_v2_deploy/`, `_v1_deploy/`.
**Commit + đẩy CHỦ ĐỘNG khi lượt việc đã ổn** (kiểm lại đạt, sổ lỗi mã trống, gói bổ sung trống / đã up, không còn bản ghi thử); việc dở thì chưa commit.
Chỉ đẩy lên `LoginVT-V2`, không bao giờ tới kho gốc. Người dùng tự up gói lên host.

**Máy.** Có Node v22 + Python 3.10; không IIS / dotnet. Máy chủ tĩnh chuẩn: `powershell -ExecutionPolicy Bypass -File _harness\serve.ps1`
(cổng 8787; chạy nền bị dừng sau 2 giờ — bật lại). Headless: Edge `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
(`--headless=new`); trình chạy trang kiểm: `_harness/chay-cdp.js` (tự xoá hồ sơ Edge; Git Bash cần `MSYS_NO_PATHCONV=1`).
Bẫy `--virtual-time-budget`: `scrollTo()` không bắn `scroll`, hiệu ứng CSS không tự tiến (tua bằng `getAnimations()[0].currentTime`).
Kiểm vỏ CŨ trên máy: `http://localhost:8787/index-old.html` (`_harness/README.md`).

**Lột da màn cũ (spa-v1) — CHỈ khi người dùng nói "spa v1"**; "chuyển <phân hệ>" mặc định = sang `_v2`. Tài liệu: `spa-v1.md`; công cụ
`python _harness/skin.py css|them|kiem|ap|nhan|dong-goi`; nguồn `App_Themes/Cms/Custom_V1/ums/`; sau mỗi lần kéo gốc chạy `skin.py kiem` → `ap`.

**Kiểm host** (`_harness/kiem-host/`, Edge có cửa sổ qua DevTools cổng 9333, tài khoản `tk.md`, kết quả ở `%TEMP%/ums-kiem-host`):
`node dangnhap.js` → `menu.js <roleId>` → `SAU=1 CHI="id1,id2" node chay-vaitro.js <roleId>` (đọc sâu; `THUVAI="Đặng Bác Ái"` cho Cổng SV)
→ `thu-ghi.js` / `thu-ghi-ui.js` (`TIM="Kadara" FULL=1`) → lái tay `node chay.js <role> <cnId|-> '<thân hàm>'` (nháy ĐƠN; có `nut() os() s2() go() bang() bao()`)
→ `va-tam.js` chạy mã vừa sửa trên host trước khi up → `tom-tat.js <6 ký tự>`. Mẫu lệnh lái tay: `kiem-host/mau-lenh/`.
- **Sổ:** đã kiểm `da-kiem.json` (ghi: `TU=<ngày> node ghi-da-kiem.js <ApisXxx> <roleId…>`, mục tay đặt `"tay": true`); lỗi mã `loi-code.js them|da-sua|xong|ds`
  (khoá = đường dẫn màn TRÊN MENU HOST); việc phiên sau `VIEC-PHIEN-SAU.md`; nhật ký từng ngày `LICH-SU.md`; lỗi backend → mục `ben` trong `_v2/assets/js/can-quyet.js`.
- **Khi người dùng bảo "kiểm host" / "chuyển": `git fetch origin` + THÔNG BÁO TRƯỚC** rồi mới chạy: (1) lỗi mã treo (`loi-code.js ds`); (2) gói bổ sung đã up chưa
  (`_v2_bo_xung_deploy` còn tệp khác `_KHONG-CON-GI-DE-UP.txt` = chưa up); (3) phân hệ đã / dở / chưa kiểm (`da-kiem.json`); (4) bản ghi thử còn sót;
  (5) lượt này làm gì, thứ tự; (6) trang mới kéo về từ kho gốc thuộc phân hệ đã chuyển — LÀM TRƯỚC. Phân hệ MỚI chỉ kiểm khi người dùng gọi tên.
- **Cách làm: CUỐN CHIẾU từng phân hệ** — đọc sâu → thử ghi (thêm thì xoá, đối chứng `LayChiTiet`) → sửa mã / ghi backend → ghi sổ → DỪNG báo cáo.
  Ưu tiên thay đổi (kéo gốc / sửa mã) ở phân hệ ĐÃ hoàn thành trong sổ trước. Sau mỗi lượt thử ghi quét dấu `ZKT` (`chay-vaitro.js` in "!! CÒN DẤU THỬ").
- **(A) Frontend khắc phục được thì PHẢI sửa `_v2` + ghi sổ lỗi mã, KHÔNG báo backend.** (Sai định dạng, ô trống thành `//`, thiếu kiểm bắt buộc / số, câu lỗi thô,
  thiếu GET, gửi ô ẩn, lưu lần hai thêm trùng…). Chỉ ghi `ben` khi mã không làm gì được: thiếu / sai chữ ký thủ tục, gói lỗi, dịch vụ không chạy, cấu hình host,
  thủ tục làm sai. Trước khi ghi backend: so tham số với màn khác gọi cùng controller (bài học `dTrangThai` ↔ `iTrangThai`).
  **Thiếu dữ liệu người dùng tự khai được ở màn khác (danh mục trống, chưa có bản ghi cha, mẫu import) → KHÔNG phải backend: khung "Cần làm trước" tự bắt**
  (mục 10) — thêm dòng vào `ums.lamTruoc.NGUON` nếu cần.
- **(B) Mục `ben` do người kiểm VIẾT THẲNG**: bấm gì / ở đâu → thấy gì → ảnh hưởng → ai làm gì (chi tiết kỹ thuật trong ngoặc). Không bê câu lỗi thô.
  Mọi màn `doc: loi-may-chu` / `ghi: tu-choi` / `con-sot` trong sổ phải có mục `ben` cùng khoá; từ chối do dữ liệu thử sai ghi `ghi: hop-le`.
- **(C) Thiếu dữ liệu đầu vào mà tạo được trong ứng dụng** thì sang màn đó tạo (dấu ZKT), thử, rồi xoá cả bản ghi thử lẫn dữ liệu phụ (con trước cha). Làm đến đâu sạch đến đó.
- **Quyền thử ghi (người dùng 30/9): thêm / sửa / xoá TẤT CẢ miễn xoá lại được**, kể cả dữ liệu người học thật (kỳ xa `2031_2032_2`, một ô / một dòng, xoá ngay).
  KHÔNG bấm thao tác không hoàn lại: tổng hợp / xếp loại / tính phí hàng loạt, chốt, xuất hoá đơn – biên lai, gạch nợ, gửi thư, nhập từ tệp, thứ máy chủ chặn gỡ.
  Phạm vi thử an toàn đã dùng: hệ "Đào tạo khác" → khoá Tập huấn / Bổ sung kiến thức, khoản "Võ phục", kỳ `2031_2032_2`.
- **Bản ghi thử còn sót (cần CSDL xoá tay):** `quatrinhcongtac/nhiemvuchienluoc` id `71F5751A5EA94D4983F8E45EB1B95456`; `D_CongThucDiem_ApDung` id
  `4084811E199B4D1EB4478890442FCE91` (lớp `TTKT.03.K11.01.LH.C04BS.1_LT`). Đừng thử ghi hai chỗ đó tới khi sửa.
- **Ngày sinh ba ô** Ngày / Tháng / Năm: kiểm trước khi gửi bằng `ums.util.ngaySinh(ngay, thang, nam, maMuc)` (api.js) — sai thì báo, không gửi `//`.
  Câu ORA-20000…20999 hiện gọn (`cauKiem`, câu gốc ở `err.goc`).
- Bẫy bộ thử: Edge bị che / có DevTools cạnh → trình duyệt bóp đồng hồ (màn "đứng im" > 25 giây, 0 lời gọi → chạy lại bằng `CHI=`); hộp thoại đã `.close()`
  vẫn trong DOM và vùng "Khai nhanh" ẩn cùng `data-k` → gắn id theo đúng vùng đang mở.

### Thư mục dựng thử — chỉ có trên máy, chưa từng đưa lên remote

| Thư mục | Nội dung |
|---|---|
| `_v2/` | Bộ giao diện mới — xem mục 10 |
| `_harness/` | Static server + các trang đo giao diện đang chạy |
| `_migration/` | `kiem-ke-class.md` — 327 class dự án, chia CO/PORT/MOCOI |
| `assets/vendor/` | Chart.js UMD, datalabels — bỏ phụ thuộc CDN cho màn hình cũ |
| `html data/` | Bootstrap 5.3.8 + Font Awesome Pro 7.3.1 do người dùng cung cấp |

---


## 10. Bộ giao diện mới `_v2/`

Class tiền tố `ums-`, **không dùng lại class nào của hệ cũ**, không nạp
Bootstrap. Cấu trúc CSS theo ITCSS. Tự chứa mọi phụ thuộc trong
`_v2/assets/vendor/`.

### Hai vỏ

| Tệp | Dùng khi nào |
|---|---|
| `_v2/web.config` | Khai kiểu tệp `.woff2/.woff/.ttf` cho IIS. **Thiếu tệp này thì
  mọi biểu tượng Font Awesome thành ô vuông rỗng trên host** (IIS cũ không biết
  đuôi .woff2 → trả 404). Cách dò ba bước: `_v2/TRIEN-KHAI.md` mục 7.1. |
| `_v2/index.aspx` | **Chạy trên máy chủ** — gọi API thật. `Inherits="Apis.LoginVT.Index"`, dùng lại code-behind sẵn có |
| `_v2/index.html` | Xem trên máy, chế độ dữ liệu dựng thử, không gọi mạng |
| `_v2/login.aspx` · `_v2/Logout.aspx` | Đăng nhập / đăng xuất ngay trong bản mới, dùng lại `Apis.LoginVT.Login` và `Apis.LoginVT.Logout`. Giữ nguyên tên điều khiển (`username`, `password`, `cms_authenticate_do_login`, `lblNotify`, `xxxxxx`…) — đổi là hỏng. Xem `_v2/TRIEN-KHAI.md` mục 7 |

Hướng dẫn triển khai đầy đủ: [_v2/TRIEN-KHAI.md](_v2/TRIEN-KHAI.md)

**Gói đẩy lên host: `python _harness\dong-goi.py` → `_v2_deploy/`** (từ 2026-09-22; tự chạy
gop-css trước, xoá trắng rồi dựng lại, tự kiểm mọi đường dẫn). Bỏ: index.html, components.html,
*.md, dữ liệu mẫu (`demo-data.js`, mọi `*.demo.js`, `screens/` trừ `cai-dat.html`), CSS nguồn
@import, vendor không dùng. Trong gói: index.aspx gỡ thẻ demo-data, `dataSource` = `"api"`.
Lên host đặt tên thư mục `_v2` (đường dẫn tương đối `../Config.js` — phải nằm ngay dưới gốc ứng dụng).
**Sửa gì trong `_v2` thì chạy lại lệnh này** — không sửa tay trong `_v2_deploy`.
**Gói BỔ SUNG `_v2_bo_xung_deploy/`** (người dùng 2026-09-27: "copy cho nhẹ"): mỗi lần đóng gói tự so với mốc lần up trước
(`_harness/.moc-da-up.json`) và chép riêng tệp mới / đổi — người dùng chép đè thư mục này vào `_v2` trên host. **Khi người dùng
báo "đã up" → chạy `python _harness\dong-goi.py --da-up`** (lấy gói hiện tại làm mốc). **Thư mục `_v2_bo_xung_deploy` KHÔNG BAO GIỜ bị xoá** (người dùng 30/9: "bạn đã xoá deploy bổ sung của tôi") — `--da-up` chỉ dọn nội dung và để lại `_KHONG-CON-GI-DE-UP.txt` (ghi giờ đặt mốc + danh sách tệp vừa up); "chưa up" = trong thư mục còn tệp KHÁC tệp ghi chú đó. Không chắc host đang ở bản nào →
`--moc-tu-host` (tải từng tệp từ host về băm; .aspx/.config không so được, sửa thì tự nhắc). Báo người dùng: up `_v2_bo_xung_deploy`.

**Trang tiến độ: `python _harness\tien-do.py` → `_harness/tien-do.html`** (2026-09-25) — hai cột Đã chuyển / Chưa chuyển theo phân hệ → module → màn, tự đọc cây thư mục (gốc vs `_v2`). Chuyển xong phân hệ mới: thêm tên vào `THU_TU`; màn cố ý bỏ: thêm vào `BO_QUA` kèm lý do.

### Các tầng JavaScript

| Tệp | Vai trò |
|---|---|
| `assets/config/site.config.js` | **Nơi duy nhất cần sửa** để đổi màu, logo, ảnh nền trang, kích thước, phông chữ, chuỗi hiển thị, endpoint API, bản đồ màn hình. `brand.name` mặc định **rỗng** (không hiện chữ cạnh logo); khối `background` đặt ảnh nền cho `<body>` |
| `assets/config/apply-config.js` | Ghi cấu hình thành biến CSS nội tuyến trên `<html>` |
| `assets/js/session.js` | Bản viết lại sạch của `AFG()` — giải blob phiên từ `AXYZCLRVN()` bằng `AD(blob, "AzzS")` |
| `assets/js/api.js` | Bản viết lại của `makeRequest` — giữ nguyên giao thức (action/func/iM/JWT) nhưng trả Promise |
| `assets/js/ui.js` | `ums.ui.*` — sinh bảng, nút, nhãn, biểu mẫu, thông báo nổi |
| `assets/js/app.js` | Điều hướng ba tầng `#/` → `#/r/<vaiTro>` → `#/r/<vaiTro>/<chucNang>` |
| `assets/js/demo-data.js` | Dữ liệu dựng thử, giữ đúng hình dạng máy chủ trả |

### Điểm cần nhớ (tóm tắt — bản đầy đủ: [_v2/GHI-NHO-TANG-CHUNG.md](_v2/GHI-NHO-TANG-CHUNG.md))

- `api.dataSource = 'auto'`: có `AXYZCLRVN()` (vỏ ASPX) → API thật, không → `demo-data.js`. `index.html?demo` ép dữ liệu mẫu; `index.html` tự sang `index.aspx` ngoài localhost.
- **Màn mới đặt đúng cây thư mục gốc trong `_v2/`** (`_v2/<MAUNGDUNG><DUONGDANFILE>`); có tệp là tự bật, chưa có thì hiện "chưa chuyển đổi" — không nạp màn cũ.
- `api.js` gửi form-urlencoded; chỉ mã hoá `{A: AE(...)}` khi có `func`; action kiểu cũ đi thẳng. Màn danh sách + biểu mẫu = `ums.crud`; tên tham số / cột chép nguyên gốc.
- **Menu: không sắp xếp** (thứ tự = procedure trả); vẽ ĐỦ mọi tầng (theo indexi); mục mồ côi gom nhóm "Khác" (`behavior.menuOrphans`); `#dashboard` ẩn; `TENANH` FA4 → `ums.iconFA4`.
- **select2 bắn `change` bằng jQuery** → `ums.ui.select2` bắn thêm một `change` thật; màn nghe kiểu nào cũng chạy đúng một lần.
- Phân trang: `ums.ui.pager` có số dòng / trang (`page.sizes`, `page.onSize`, ô `data-no-s2`). Thông báo nổi 6 / 9 / 12 giây + 60 ms mỗi ký tự dư (`behavior.toastMs`).
- Ô chọn tệp dùng `ums.ui.file`. Một tab thì KHÔNG vẽ dải tab (bỏ hẳn khung tab trong mã). Xoá nhiều dòng = `ums.ui.xoaChon`; trong hộp thoại nút Xoá ở chân, dạt trái.
- **Nút "Đóng" luôn ngoài cùng BÊN TRÁI nhóm nút**, không mũi tên ←; `kiem-dong-bo` báo nếu sai. Màu nút chép gốc; chữ nút giữ gốc (vỏ indexi: "Xuất báo cáo"); nút gốc không có xử lý thì giữ + `disabled`.
- JS chung trong `index.aspx` phải kèm `?v=<%= V("…") %>`; **sửa CSS xong chạy `python _harness\gop-css.py`** (vỏ `.aspx` nạp bản gộp).
- **Khung "Cần làm trước"** (`assets/js/lamtruoc.js`, `ums.lamTruoc`, 2026-10-05): mọi lời gọi trả 0 dòng qua `ums.api.call` → `sauGoi`: danh mục dùng chung trống →
  "Danh mục X chưa có giá trị" + nút mở Danh mục dữ liệu (vai trò đang mở → bản CMS → phân hệ khác; `ums.app.timManTheoDuongDan`, kiểm tệp có trong `_v2`;
  màn đích tự chọn sẵn danh mục); **bảng nguồn `ums.lamTruoc.NGUON`** (action / tên thủ tục → ô, việc, đuôi đường dẫn màn khai); màn tự khai `lamTruoc.can()` / `neuRong()`.
  Nằm ngay dưới khung Ghi chú, dấu × ẩn tới hết phiên, giữ khi giao người dùng thật (tắt: `behavior.lamTruoc = false`); dữ liệu mẫu chỉ bật khi URL có `lamtruoc`.
- **Khung "Ghi chú chuyển đổi"** (`can-quyet.js`, `behavior.canQuyet`): CHỈ giữ việc dữ liệu / backend (`ben: 'oracle'` = "Lỗi đã kiểm trên hệ thống thật — yêu cầu backend",
  `nghiepvu`); câu cần quyết cách màn chạy thì TỰ CHỐT vào `CAN-QUYET-DA-CHOT.md`. **Bảng "Màn đang có lỗi backend"** ở trang vai trò + nút tổng ở trang chủ
  (`behavior.loiBackend`); phân hệ chưa kiểm host khai ở `ums.canQuyetChuaKiem` — kiểm xong thì gỡ tiền tố.
- Ô tìm duy nhất trên thanh trên (`timMan`: lọc menu vai trò đang dùng, rồi mọi vai trò; chỉ mục sessionStorage `ums.timMan.*` v4 có đường dẫn `p`); Ctrl K hoặc `/`.
- Khối chung hay dùng: `pat.cotTrai`, `pat.dsNhanSu` / `masterNhanSu`, `pat.boLocNguoiHoc`, `pat.dauDoiTuong`, `pat.anhNguoi`, `pat.formTrang`, `pat.chain`, `pat.haiLuoi`,
  `ui.btn('reload')`, `ui.money`, `ums.editor` (`tao` / `toan` / `html` — CKEditor + MathJax nạp từ `../Scripts/` của ứng dụng cha, không có thì lùi về textarea). Bảng tra nhanh: `_v2/BO-CUC.md`.
- **Cổng Help:** nút "?" mọi màn theo `site.config.js → help.url` (mẫu `{functionId}`…), xuất mapping ở màn Cài đặt (`ums.app.xuatMapping`); SSO soạn bài `_v2/help-sso.aspx` +
  `help-jwks.aspx` (bản sao ở gốc dự án; `App_Data/help-sso/`; đã chạy `?xem=1` trên host, chưa gửi thật). Bẫy ASPX: không viết nguyên thẻ đóng script trong khối `runat="server"`.
- Dính đỉnh bằng `:has()` (`objects/shell.css`); đổi vùng có hiệu ứng `ums.ui.swap` (`animation-fill-mode: backwards` để không phá sticky); thanh trượt cột trái tự vẽ (`scroll.js`).

## 11. Làm tiếp trên máy khác

### Mở đầu phiên — ba bước

1. Đọc hết tệp này (mục 5 và 8 tốn nhiều công dò nhất, đừng dò lại). 2. Chạy `_harness\serve.ps1`, mở `http://localhost:8787/_v2/index.html`, bấm vài màn.
3. Báo đang thấy gì rồi nhận việc. Chỉ chép `_v2` thì chạy bằng DỮ LIỆU MẪU (không có vỏ ASPX → `dataSource: 'auto'` rơi về `demo-data.js`).

### Git & kéo kho gốc

`_v2/`, `_harness/`, `CLAUDE.md` nằm trong git `quyentt/LoginVT-V2`; máy khác clone là đủ (trừ `tk.md`; `_v2_deploy/` dựng lại bằng `python _harness/dong-goi.py`).
**Luật sau mỗi lần kéo gốc:** tệp thuộc màn ĐÃ CHUYỂN thì tự chuyển thay đổi sang `_v2` (thuần CSS vỏ cũ thì bỏ; mã mới lỗi rõ → làm theo ý định + ghi `can-quyet.js`);
ghi `_v2/CHO-CHUYEN-SAU-PULL.md` (mốc gốc + bảng tệp) và `CAN-QUYET-DA-CHOT.md`. Lịch sử 6 lần kéo (mốc hiện tại `0551deba`): `_v2/NHAT-KY-CHUYEN.md`.
**Khi người dùng bảo "chuyển" / "kiểm": `git fetch origin`, so với mốc, THÔNG BÁO trang mới kéo về thuộc phân hệ đã chuyển và LÀM TRƯỚC** (phân hệ chưa chuyển chỉ nhắc một dòng).

### Chép tối thiểu

`_v2/` (3,2 MB, tự chứa mọi tệp tĩnh — vendor, phông, `crypto-js`, ảnh; `Config.js` / `encrypt.js` lùi về bản ứng dụng cha) + `_harness/serve.ps1` + `CLAUDE.md`.
Mở bằng `file://` là trắng trang (CORS). Lên host phải nằm TRONG dự án thật (thư mục `_v2` ngay dưới gốc ứng dụng): phiên đăng nhập, `Config.js`, `bin/`, `Web.config`,
`Handler/*.ashx`, `Upload/`, `Scripts/` (CKEditor, MathJax) là của ứng dụng cha. Bảng đầy đủ: `_v2/TRIEN-KHAI.md` mục 2. ĐỪNG chép `Upload/` (695 MB dữ liệu thật).

### Tiến độ chuyển đổi (chi tiết từng phân hệ: [_v2/NHAT-KY-CHUYEN.md](_v2/NHAT-KY-CHUYEN.md); trang `_harness/tien-do.html`)

| Phân hệ | Màn | Vai trò mẫu | Xong | Kiểm host |
|---|---|---|---|---|
| Tài chính `ApisTaiChinh` | 72/73 | R33 `TC-` | 19/9 | đọc sâu + thử ghi xong |
| Cổng cán bộ `ApisCongCanBo` | 152/152 | R02 `CCB-` | 22/9 | đọc sâu xong, thử ghi dở |
| Cổng sinh viên `ApisCongSinhVien` | 36/36 | R04 `CSV-` (thủ vai) | 23/9 | đọc sâu xong (chỉ đọc) |
| Chuyên cần `ApisChuyenCan` | 5/5 | R07 `CC-` | 25/9 | đọc sâu |
| Quản trị hệ thống `ApisCMS` | 46 | R44 `CMS-` | 25/9 | đọc sâu, thử ghi dở |
| Đăng ký học `ApisDangKyHoc` | 24 | R19 `DKH-` | 25/9 | đọc sâu |
| Học lại thi lại `ApisHocLaiThiLai` | 6/6 | R09 `HLTL-` | 25/9 | đọc sâu |
| Điểm rèn luyện `ApisRenLuyen` | 8/8 | R18 `RL-` | 25/9 | xong |
| Xử lý học vụ `ApisXuLyHocVu` | 8/8 | R17 `XLHV-` | 25/9 | xong |
| Xét học bổng `ApisHocBong` | 12/12 | R35 `HB-` | 25/9 | đọc sâu (host thiếu API `HB`) |
| Quản lý điểm `ApisQuanLyDiem` | 42/42 | R13 `QLD-` | 25/9 | đọc sâu, thử ghi dở |
| Nhân sự `ApisNhanSu` | 121/121 | R36 `NS-` | 26/9 | xong |
| Sinh viên `ApisSinhVien` | 35/35 | R38 `SV-` | 26/9 | chưa |
| Kế hoạch chương trình `ApisKeHoachChuongTrinh` | 28/28 | R21 `KHCT-` | 27/9 | chưa |
| Nhập học `ApisNhapHoc` | 31/31 | R24 `NH-` | 27/9 | chưa |
| Tuyển sinh `ApisQuanlyTuyenSinh` | 15/15 | R31 `TS-` | 27/9 | chưa |
| Nghiên cứu khoa học `ApisNCKH` | 55/55 | R23 `NCKH-` | 27/9 | chưa |
| Thi phách `ApisThiPhach` | 18/18 | R14 `TP-` | 29/9 | chưa |
| Tốt nghiệp `ApisTotNghiep` | 13/13 | R16 `TN-` | 5/10 | chưa (đã up) |
| Quản lý thi trắc nghiệm `ApisQuanLyThiTracNghiem` | 16/16 | R12 `QLTTN-` | 5/10 | chưa (gói bổ sung chưa up) |
| Thi trắc nghiệm `ApisThiTracNghiem` (trang làm bài .aspx) | 0 | — | DỪNG (người dùng 5/10) | — |
| Còn lại: Ký túc xá, Luận văn, TKGG, Tin tức, Danh hiệu | — | — | chưa | — |

**Đã xong 5/10:** QLTTN 16/16 (ba màn cuối `quanlybode`, `taodethucong`, `quanlythi` tự làm, không tác tử); chốt ở `CAN-QUYET-DA-CHOT.md`; ApisThiTracNghiem DỪNG.
Việc kế: người dùng up gói bổ sung → `--da-up`; phân hệ mới chỉ làm khi người dùng gọi tên.
Tầng chung mới 5/10: `ums.editor` (`assets/js/editor.js`). **Giao việc: tối đa 2 tác tử con một lúc (người dùng 5/10); mỗi tác tử chỉ đọc đúng mục cần (không "đọc hết"
CLAUDE.md / BO-CUC), grep hàm trong tệp gốc lớn thay vì đọc nguyên tệp, lưu tệp sớm.**

### Quy tắc chuyển một phân hệ (đã dùng 20 lần)

Menu mẫu `ums.demo.menus[R..]` (demo-data.js, `buildMenu`, ID `<TIỀN TỐ>-<module>-<tệp>`) → mỗi màn `html/<tệp>.html` + `script/<tệp>.js` (+ `.demo.js`), khung chung
trong module (`_<tên>.js`), dùng lại khung phân hệ khác bằng nạp chéo (sửa khung thì chỉ thêm cờ, mặc định giữ nguyên, kiểm lại màn đang dùng) → ba trang kiểm
`kiem-dong-bo`, `thu-crud`, `kiem-cot-trai` (`vt=R..&tien=..&coTep=1`) + `kiem-icon-chuan.py` → tự chốt vào `CAN-QUYET-DA-CHOT.md`, việc dữ liệu vào `can-quyet.js`,
thêm phân hệ vào `THU_TU` của `tien-do.py` → `dong-goi.py` → DỪNG báo cáo (không tự sang phân hệ khác). Trang dò tạm trong `_harness/` xoá khi xong.

### Cách làm việc đã dùng, nên giữ

Mỗi lần sửa giao diện thì dựng một trang dò tạm trong `_harness/`, nạp `_v2/index.html` vào `<iframe>`, thao tác rồi đọc ngược `getComputedStyle` /
`getBoundingClientRect`, xong thì xoá. Cách này đã bắt được bốn lỗi mắt không thấy: `requestAnimationFrame` bị tiết chế làm thanh trên kẹt, select2 chọn nhiều cao
gấp đôi, nút `×` của select2 đè chữ, `transform` đọng sau hiệu ứng phá `sticky`.

---

## 12. Quy ước làm việc

- **Chuyển đổi màn hình: BÁM CẤU TRÚC BẢN GỐC.** Đổi cách dựng, không đổi bố
  cục. Bản gốc một cột thì bản mới một cột; bản gốc hai cột thì bản mới hai
  cột. Chỉ đi khác ở những điểm người dùng đã nêu đích danh; thấy chỗ nên đổi
  thì hỏi. Cách nhận biết bản gốc hai cột và các quy ước còn lại:
  [_v2/BO-CUC.md](_v2/BO-CUC.md) mục "Quy ước bắt buộc", luật số 0.

- **⚠ Ô chọn CHA → CON: chưa chọn cha thì KHOÁ con; chọn/xoá cha thì xoá
  trắng con** (người dùng yêu cầu 2026-09-21, khác bản gốc, áp cho MỌI màn
  chuyển đổi về sau — kể cả ô trong hộp thoại). Một dòng
  `ums.pat.chain([cha, con, cháu])` sau các trình xử lý. Luật đầy đủ:
  [_v2/CHUYEN-DOI.md](_v2/CHUYEN-DOI.md) mục 1 luật 6. Kiểm bằng
  `_harness/do-phu-thuoc.html`. Các cặp còn tồn ở Tài chính: mục 11.

- **MỘT hành động = MỘT biểu tượng trên toàn ứng dụng** (người dùng chốt 2026-09-23). Chữ trên nút
  giữ đúng bản gốc ("Xem", "Danh sách", "Xem học phần"…), nhưng biểu tượng lấy từ bảng chuẩn trong
  `ums.ui` (`btn('view'|'edit'|'history'|'confirm'|'reload'|'attach'|'report'|'importer'|…)`,
  `iconBtn(kind)`): xem/chi tiết `fa-eye` · chạy truy vấn `fa-magnifying-glass` · sửa `fa-pen-to-square`
  · xoá `fa-trash-can` · thêm `fa-plus` · lưu `fa-floppy-disk` · lịch sử `fa-clock-rotate-left` ·
  xác nhận `fa-circle-check` · tải lại `fa-rotate-right` · đóng `fa-xmark`. Kiểm: `python _harness/kiem-icon-chuan.py`.

- **Ô chọn trong BẢNG ít mục thì KHÔNG dùng select2** (người dùng chốt
  2026-09-22). Đã tự đúng khi vẽ bảng bằng `ums.ui.table` (`enhance` bỏ qua ô
  trong `.ums-table`). Lọt luật khi: tự dựng `<table>`, tự gọi
  `ums.ui.select2()` cho ô trong bảng, hoặc gắn `data-s2` cho ô ít mục.
  `data-s2` chỉ cho danh sách dài phải gõ để tìm. Xem `_v2/BO-CUC.md` luật 2.

- **KHÔNG dựng mới nếu đã có khung tương tự.** Khuôn để chép nằm ở
  [_v2/components.html](_v2/components.html) mục **"0. Khuôn màn hình"**
  (mở bằng `http://localhost:8787/_v2/components.html`): khai báo đầy đủ
  cho màn một cột và màn hai cột, cộng bảng **"Lỗi vặt đã gặp — đừng lặp lại"**
  (ô tìm lệch chuẩn, lề kép, phân trang dạt trái, icon dạt trái, mất nút Lưu
  khi cuộn, hai nút Thêm mới, nhãn ô chọn danh mục, bảng bóp chữ ở màn hẹp,
  select sinh thanh cuộn ngang). Mỗi dòng trong bảng đó là một lỗi đã thật sự
  xảy ra rồi phải đo lại mới tìm ra — chép khuôn thì không gặp cái nào.

- **⚠ THÊM / SỬA LUÔN LÀ BIỂU MẪU TRONG TRANG — một chuẩn cho mọi màn** (người dùng 2026-09-30; `_v2/BO-CUC.md` luật 1, `CHUYEN-DOI.md` luật 9). Hộp thoại
  chỉ cho việc phụ: chọn, xem, xác nhận / phê duyệt, thao tác hàng loạt trên dòng đã đánh dấu, tiến độ, gửi email, kế thừa, nhập từ tệp. Màn không dựng bằng
  `ums.crud` dùng **`ums.pat.formTrang({ host, title, body, buttons, xoa, cols, flush })`** (nhận cấu hình như `ui.dialog`; lồng nhiều tầng được; tự lo một nút
  Đóng). **Đã rà 384 hộp ở 17 phân hệ và chuyển 93 hộp ngày 30/9** (7 tác tử con) — sổ từng hộp + lý do giữ: `_v2/RA-HOP-THOAI.md`. Bẫy khi đưa màn con vào
  trang: trình xử lý uỷ quyền ở gốc màn bắt luôn nút cùng thuộc tính của màn con (chặn bằng `closest('.ums-formtrang')`). Trang `thu-crud` nay nhận
  `.ums-formtrang` là biểu mẫu. Màn chuyển đổi mới: mở từng nút Thêm / Sửa, `document.querySelectorAll('dialog[open]').length` phải bằng 0. CHƯA kiểm trên host.
- **Phím Esc = bấm nút "Đóng" của TẦNG ĐANG HIỆN** (người dùng 2026-09-30: "không phải đóng cả mà đóng màn đang hiện"). Tầng chung (`ui.js` cuối tệp): mỗi
  lần Esc bấm đúng MỘT nút `.ums-btn--dong` đang hiện (tầng hai → tầng một → khung chi tiết); hộp thoại tự đóng bằng Esc của trình duyệt. Không làm gì khi
  đang mở select2 / lịch / menu thả xuống / ô tìm màn hình, hoặc màn đã tự dùng Esc và gọi `ev.preventDefault()` — **màn nào tự xử lý Esc (huỷ sửa tại ô,
  đóng bộ lọc nổi) PHẢI `preventDefault()`**, không thì Esc đóng luôn cả màn. Màn chỉ cần dựng nút bằng `ui.btn('close')`.
- **Hai luật giao diện chốt 2026-09-29** (`_v2/BO-CUC.md` luật 18, 19): mỗi lúc chỉ MỘT nút "Đóng" — khung trong mở thì nút Đóng tầng ngoài tự ẩn
  (tầng chung lo, màn chỉ cần dựng nút bằng `ui.btn('close')`); hàng ô ngắn có ô ẩn / hiện thì các ô còn lại tự chia cho hết hàng (Họ / Tên đệm / Tên một hàng,
  Ngày / Tháng / Năm / Giới tính một hàng). Đã áp: Nhân sự `kehoach/dexuathoso` (người dùng up 29/9, kiểm lại trên host ĐẠT cả hai luật). CHƯA áp biểu mẫu hồ sơ cùng loại ở Sinh viên (`hoso/_hsA.js`) — chờ người dùng bảo.

- **⚠ Bốn luật giao diện chốt 2026-09-26 + trang kiểm bắt buộc** (chi tiết `_v2/CHUYEN-DOI.md` mục 1 luật 8, `BO-CUC.md` luật 11–14):
  biểu mẫu ô ngắn 2 ô một hàng; cột trái = nút Tải lại + Bộ lọc nâng cao, gõ tự tìm, không nút Tìm kiếm; `.ums-kv` chỉ tên in đậm;
  ẩn dòng tên khi mở biểu mẫu; bảng SÁT MÉP khung + luôn có đường kẻ cuối (trừ khi chạm kẻ khác) + khối cách nhau
  40px, tiêu đề nhóm không gạch chân (BO-CUC luật 15). Báo xong một phân hệ phải qua ĐỦ BA trang: `kiem-dong-bo`, `thu-crud`, `kiem-cot-trai` —
  chạy bằng `_harness/chay-cdp.js` (tự xoá hồ sơ Edge). Giao tác tử con thì dặn đủ các luật + ba trang kiểm này.

- **Chỉ sửa khi được yêu cầu rõ ràng.** Hỏi "phân tích", "kiểm tra", "đưa ra
  kế hoạch" thì dừng ở mức báo cáo.
- **Commit + đẩy git chủ động khi lượt việc đã ổn** (người dùng 2026-09-30; trước đó là "chỉ khi được bảo") — điều kiện ở mục 9. Đường đẩy đi `LoginVT-V2`, không bao giờ tới kho gốc.
- Kiểm chứng bằng số liệu thật — grep, đo `getComputedStyle`, chụp màn hình —
  chứ không suy đoán. Codebase này có nhiều chỗ tệp CSS ghi một đằng, kết quả
  chạy một nẻo (ví dụ `root.css` ghi `--color-link: #018ed5` nhưng giá trị thật
  khi chạy là `#0d6efd`).

