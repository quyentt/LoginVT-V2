# LoginVT — Ghi chú hệ thống

Tệp này tồn tại để không phải dò lại codebase từ đầu mỗi lần. Mọi con số và
đường dẫn dưới đây đều đã kiểm chứng trực tiếp trên mã nguồn.

Cập nhật: 2026-09-29

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

## 9. Môi trường máy này

- **Git (đổi 2026-09-26): KÉO từ repo gốc, ĐẨY lên repo riêng.** `origin` fetch = `https://github.com/quyentt/loginVT-main.git`
  (mã gốc), `origin` push = `https://github.com/quyentt/LoginVT-V2.git` (`git remote set-url --push`), nhánh `main`.
  `pull.rebase=false` (gộp mã mới của gốc vào nhánh đã có commit riêng; đã bỏ `pull.ff=only`). Lần đẩy đầu: commit
  `1977a9dd` (_v2 + _harness + CLAUDE.md). `.gitignore` chặn `**/tk.md` (tài khoản host) và `_v2_deploy/`.
  **Commit + đẩy git: CHỦ ĐỘNG làm khi một lượt việc đã ổn** (người dùng 2026-09-30 — đã kiểm lại đạt, sổ lỗi mã trống, gói bổ sung trống / đã up, không còn bản ghi thử; việc còn dở thì CHƯA commit). Đẩy tệp lên máy chủ web vẫn do người dùng tự up gói bổ sung. **Tệp GỐC (ngoài `_v2`, `_harness`) luôn theo kho gốc** (người dùng 2026-09-28: "kéo về và
  ghi đè", sửa trên máy không cần giữ; tệp thuộc màn đã chuyển thì chuyển lại `_v2`). Ngoại lệ có chủ ý, KHÔNG ghi đè: nút "?" Cổng Help
  trong `Core/systemroot.js` + `Corei/systemroot.js`, hai trang `help-sso.aspx` / `help-jwks.aspx` ở gốc. `kehoachmua.js` (DKH) đã trả về bản gốc 28/9.
- **LỘT DA màn cũ (từ 2026-10-01) — ngoại lệ thứ hai của luật "tệp gốc theo kho gốc". ⚠ ĐỌC `spa-v1.md` (gốc dự án) TRƯỚC KHI LÀM:
  danh sách 12 màn QLTTN cần chuyển + trạng thái, quy trình từng bước, bảng đổi class, luật, bẫy.** Chụp kiểm: `node _harness/skin-chup.js`. Người dùng muốn một số màn CŨ vẫn chạy trong vỏ cũ nhưng
  dựng lại khung HTML bằng class `ums-` của `_v2`, CHỈ markup + CSS, KHÔNG thêm JS. Mọi thứ ở `App_Themes/Cms/Custom_V1/ums/` (thư mục mới, kho gốc
  không có): `ums-skin.css` (tự sinh — CSS `_v2` gói dưới `.ums-skin` + `cau-noi.css` viết tay vẽ lại markup JS gốc sinh: `btn btn-default`, `td-center`,
  tab BS3), `html/<đường dẫn>` = NGUỒN sửa, `goc/<đường dẫn>` = mốc bản gốc. Công cụ `python _harness/skin.py` `css` / `them <tệp>` / `kiem` / `ap` / `nhan <tệp>`.
  **GIỮ NGUYÊN khung ngoài của vỏ** (người dùng 1/10): `section.content` > `div.col-lg-12` … `div.clear` y như gốc — vỏ indexi định kiểu theo chuỗi
  `#main-content-wrapper .content …`; `ums-skin` gắn lên CHÍNH `section.content`, không chèn thẻ bọc mới (`kiem` báo "mất khung ngoài").
  Luật bộ lột da (người dùng 1/10): `.zone-bus` là lớp bọc TRONG SUỐT (nền / bóng `!important`), khung trắng `ums-panel` nằm BÊN TRONG;
  khung bộ lọc không tiêu đề; bảng KHÔNG sát mép khung (cách mép bằng padding thân khung — khác `_v2`), luật ở `cau-noi.css`.
  `kiem` bắt buộc giữ mọi id, name, class JS bám (quét Corei + JS của màn; `btn` / `form-control` trên phần tử có id vì Corei `showAllId`).
  **Gói lên host: `python _harness/skin.py dong-goi` → `_v1_deploy/`** (xoá trắng rồi dựng lại, cây thư mục như gốc web, người dùng chép đè thẳng lên
  gốc ứng dụng cùng cấp `indexi.aspx`; chỉ gồm html màn "đang áp" + `ums-skin.css`; `.gitignore` chặn). Sửa bản lột da thì chạy `css` → `ap` → `dong-goi`.
  **Sau MỖI lần pull: `skin.py kiem` rồi `skin.py ap`** (màn "kho gốc đã đổi" → chuyển thay đổi vào `html/`, `nhan`, rồi `ap`). Đã làm: QLTTN
  `quanlybode/quanlybode.html` (chờ người dùng xem). Trên host (Phenikaa) mục này mở ở `indexi.aspx` — bản xuất 26/9 ghi `index` là lệch.
  Chụp kiểm: mở QUA MENU (`initMain` — mới có breadcrumb `#lblPath_ChucNang`); harness chặn chuyển vỏ thì đặt `TENANH = 'fa …'` cho mục đó trong
  `edu.system.dtChucNang` trước khi bấm. Nạp thẳng bằng `loadFunctionPath` là MẤT breadcrumb (người dùng đã tưởng lỗi, 1/10).
- **Máy này CÓ Node v22.23.2 và Python 3.10.11** (ghi chú cũ nói không có —
  đã kiểm lại 2026-09-20 và sai). Không có IIS Express, không có dotnet.
  Vẫn giữ `serve.ps1` làm máy chủ chuẩn để máy nào cũng chạy giống nhau.
- Chạy thử giao diện: `powershell -ExecutionPolicy Bypass -File _harness\serve.ps1`
  (static server viết bằng `System.Net.HttpListener`, không cần quyền admin).
- **Kiểm giao diện BẢN CŨ (vỏ `indexi`) trên máy: `http://localhost:8787/index-old.html`** (2026-09-30). `_harness/index-old.html` lúc chạy tải
  chính `indexi.aspx`, gỡ thẻ máy chủ rồi ghi ra (không chép markup → sửa `indexi.aspx` / CSS là thấy ngay); `old-mock.js` chặn `makeRequest`, thay
  `ASG()`, chặn bốn chỗ nhảy sang `index.aspx`; `old-data.js` (tự sinh: `node _harness/old-data-tao.js`, nguồn `gui-help/mapping-chuc-nang_*.json` +
  cây thư mục) = 32 vai trò (mỗi ỨNG DỤNG một vai trò — bản xuất không có phép gán vai trò → chức năng), 619 chức năng, 272 tệp ngoài menu. Trang chủ
  liệt kê vai trò → bấm vào vai trò → menu trái → mở màn; không dữ liệu. Trang phải ở GỐC web nên `serve.ps1` tự tìm tệp thiếu ở gốc trong `_harness`.
  Chi tiết: `_harness/README.md`.
- Chụp màn hình để kiểm chứng: Chrome headless tại
  `C:\Program Files\Google\Chrome\Application\chrome.exe`
  (`--headless=new --dump-dom` hoặc `--screenshot`). Máy hiện tại (từ
  2026-09-18) KHÔNG có Chrome — dùng Edge, cùng tham số:
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.
- **Kiểm thử trực tiếp trên host** (người dùng nói "kiểm thử trực tiếp"): `_harness/kiem-host/` — Edge
  CÓ CỬA SỔ lái qua DevTools (cổng 9333), `node dangnhap.js` → `menu.js <roleId>` → `chay-vaitro.js <roleId>`.
  Tài khoản `tk.md`; kết quả/ảnh ở `%TEMP%/ums-kiem-host` (dữ liệu thật, ngoài dự án). CHỈ ĐỌC. Lần đầu
  2026-09-24: Tài chính 57 màn — `_v2` không lỗi; trống do thiếu dữ liệu, 5 mục menu trỏ tệp không tồn tại,
  2 procedure lỗi phía máy chủ (`LayDSTC_BC_PhanBo_DacThu` ORA-24338, `CM_ChuongTrinhDaoTao` PLS-00306).
- **Kiểm host 2026-09-25 — ĐÃ XONG, lần sau KHÔNG kiểm lại phần này:**
  - **Đọc sâu** (`SAU=1 node chay-vaitro.js`, mở tab / trang 2 / Xem-Sửa-Thêm rồi Đóng) 318 màn, 7 vai trò: Chuyên cần
    `9FE0F1…` (thực chất gồm Cổng cán bộ, 89 màn), Cổng cán bộ(admin) `B0B172…` 87, Cổng cán bộ `9FDE9F…` 25, QTHT `31C395…` 44,
    Đăng ký học `D71078…` 15, Học lại thi lại `116022…` 1, Tài chính `8CA298…` 57. Tất cả mở được. Kết quả
    `%TEMP%/ums-kiem-host/ketqua-<6 ký tự>-sau.json`. CHƯA đọc: Cổng SV thủ vai `80CF9E…` (script chưa lo bước thủ vai).
  - **Lỗi `_v2` đã sửa (vào gói deploy 25/9) — sau khi deploy chỉ cần kiểm lại 3 màn này:** `taikhoanno` (Sửa gửi
    `Them_` → tạo dòng mới; nay `Sua_API_KeToan_Khoan_HT`), `thongke/giangduong` (`NS_HoSoV2/LayDanhSach` thiếu GET → 405),
    `luong/luongvathunhapkhac` (`dLaCanBoNgoaiTruong` rỗng → 400; nay -1 như gốc).
  - **Lỗi máy chủ (gốc gọi y hệt, không sửa `_v2`):** ORA-24338 ở 4 màn phân quyền CMS (`LayDSNguoiDungTheoChucNang`,
    `LayDSCauTrucPhanQuyenCNNhapHS`) + `phanbodoanhthu`; ORA-04063 `PKG_THI_PHACH_CHAMKT` (nhapdiemchamkiemtra); ORA-01427
    `KHCT_LichGiang/LayDSHocPhan` (tracuulichgiang); 404 `KHCT_NamNhapHoc/LayDanhSach` (henganh); 500 `SYS_Xml/GetFile`
    (config_app); dịch vụ QLTTN từ chối kết nối (coithi, duyetdiemthitracnghiem). Menu trỏ tệp không có: 5 mục TC (đã biết),
    CMS sql/test/hello (cố ý bỏ), `lapdanhsach` (Học lại chưa chuyển).
  - **Thử ghi** (`thu-ghi.js`, dấu ZKT<ggpp>) — SẠCH: TC `kyhieuchuongtrinh`, `khoanthu`; CCB `quatrinhsuckhoe`, `nghithaisan`,
    `quatrinhdaotao`, `cacmonhocdagiangday`, `hoatdongxahoi_giangday`, `quatrinhcongtac`, `dinuocngoai`, `danhsachgiamtrugiacanh`.
    Máy chủ từ chối thêm (không tạo gì): `quatrinhchucvu` đòi Ngày QĐ, `hoso/qtthongtin` đòi Hoạt động — biểu mẫu chưa đánh
    dấu bắt buộc. `nghithaisan`: Thêm không cần Ngày QĐ nhưng Sửa lại đòi.
  - **Dọn tồn (2026-09-25, `_harness/kiem-host/don-sot-0925.js`):** MST hồ sơ tài khoản thử ĐÃ khôi phục `0001` (ô "Mã số
    thuế" của Giảm trừ gia cảnh ghi thẳng vào HỒ SƠ cán bộ, như gốc; `thu-ghi.js` nay bỏ qua `strMaSoThue`).
    **⚠ CÒN 1 dòng thử KHÔNG xoá được:** `quatrinhcongtac/nhiemvuchienluoc` id `71F5751A5EA94D4983F8E45EB1B95456` (`ZKT1743S`, hồ sơ
    tài khoản thử). `NS_QT_NhiemVuChienLuoc/Xoa` (gốc gọi y hệt, strIds/strId đều thử) trả Success mà không xoá → lỗi procedure
    phía máy chủ, cần quản lý CSDL xoá tay + sửa procedure. Đừng thử ghi màn này tới khi sửa.
  - **Quyền (người dùng cấp 2026-09-25): được thử ghi TẤT CẢ màn, xong phải XOÁ (và hoàn lại giá trị bị ghi lan).**
- **Kiểm host 2026-09-26 — ĐÃ XONG (5 phân hệ mới chuyển), lần sau KHÔNG kiểm lại:**
  - **Đọc sâu** 63 màn: Học lại `116022…` 1 (menu host chỉ có lapdanhsach), Rèn luyện `4E6532…` 8, XLHV `7CA2C9…` 7,
    Học bổng `D66824…` 8, Quản lý điểm `4ADAFD…` 39. Tất cả mở được.
  - **Học bổng KHÔNG gọi được máy chủ:** `Config.js` trên host thiếu tiền tố `HB` trong `Init_API()` (bản gốc Core:605 cũng
    đọc `objApi['HB']` → hỏng y hệt). Việc của quản trị cấu hình; chưa thử ghi Học bổng.
  - **Lỗi `_v2` đã sửa (gói deploy 26/9):** `kehoach/quydoichungchi` (`D_CongThucDiem/LayDanhSach`, `KHCT_HocPhan/LayDanhSach`
    thiếu GET → 405) và cùng lỗi ở `congthucdiem/congthucdiemapdung` (ô xâu công thức trong bảng). Sau deploy kiểm lại 2 màn này.
  - **Thử ghi — SẠCH qua giao diện (thêm/sửa/xoá):** QLD `khaibaothanhphandiem`, `thamsodanhgiaketqua`, `khaibaodiemdacbiet`;
    RL `tieuchidiem`; XLHV `khaibaodieukien`. **Thêm + xoá bằng lời gọi** (danh sách không hiện bản ghi thử vì lọc theo
    năm/khoá; đối chứng `LayChiTiet` có→không): QLD `khaibaothamsochung`, `thamsoquydoithangdiem`, `khaibaothamsotinhdiem`,
    `khaibaothamsolamtron`; RL `hesoapdung`; QLD `kehoach` (tự dựng, lưu xong ở lại biểu mẫu — đã dọn `6F81C07D…`).
  - **Máy chủ từ chối thêm (kiểm dữ liệu hợp lý, không tạo gì):** RL `tieuchixeploai` (đã tồn tại), `tieuchidiemapdung`
    (để trắng), XLHV `dieukienapdung`, `kehoachxuly`, QLD `khaibaocongthucdiem` (biểu thức không cân bằng), `quydoichungchi`
    (chỉ dùng 1 trong 2: loại CC có sẵn / mới). **Nghi lỗi máy chủ:** RL `tieuchixeploaiapdung` ORA-06550 sai chữ ký
    `THEM_DRL_TIEUCHUANXEPLOAI_AD` (tham số `_v2` khớp gốc từng khoá).
  - **Cố ý chưa ghi:** nhập điểm / điểm miễn / phúc khảo / ra quyết định / phê duyệt (ghi vào điểm, quyết định của SV thật —
    "xoá" = hoàn điểm cũ, cần người dùng chỉ định lớp/SV thử). `phanquyen/diem` không có ô chữ để gắn dấu → bỏ qua.
  - **Đợt 2 cùng ngày (người dùng: "kiểm thử và tự quyết nếu thấy hợp lý"):**
    · Đọc lại 7 vai trò sau khi sửa lỗi bộ thử chọn nhầm ô của khung "Ghi chú chuyển đổi" (`.ums-canquyet` — nay mọi script
      bỏ qua; đã xoá 393 câu trả lời bị ghi nhầm trong hồ sơ Edge của bộ thử): kết quả trùng lần trước. Xác nhận trên host bản
      deploy đã có: `giangduong` (21 dòng), `luongvathunhapkhac` (hết 400), `taikhoanno` (Sửa → `Sua_…`, đúng dòng, sạch).
    · SẠCH (`thu-apdung.js`, thêm qua giao diện, xoá bằng nút Xóa của đúng dòng, số dòng về như cũ): 8/8 màn "… áp dụng" QLD +
      `cauhinhhienthichung` (`KHUNG=ch`) + XLHV `kehoachxuly` (`thu-ghi-ui.js FULL=1`, thêm/sửa/xoá đủ qua giao diện).
      `cauhinhhienthi` (theo người dùng) không thêm được dòng mới — như gốc. Ô "Giá trị mặc định", Độ rộng/Cỡ chữ là ô chữ
      nhưng máy chủ chỉ nhận số (ORA-01722) — có thể đổi sang ô số.
    · Màn ghi điểm / xử lý học vụ (nhập điểm RL, tổng hợp, thực hiện/phê duyệt/ra quyết định, miễn, phúc khảo): 0 dòng dữ liệu
      ở hệ Đại học chính quy → không có gì để thử. **Nhập điểm KHÔNG thử** (xem sự cố dưới).
    · **⚠ SỰ CỐ — CÒN 1 dòng không gỡ được:** "Công thức theo lớp HP" Lưu = THÊM dòng `D_CongThucDiem_ApDung` cho lớp (strId
      rỗng). Thử "tổng bằng 0" (lưu nguyên xâu rồi xoá) trên lớp `TTKT.03.K11.01.LH.C04BS.1_LT` (ID lớp `…45D211203BF49D293BFC0F7E688B704`):
      thêm được dòng `4084811E199B4D1EB4478890442FCE91` (xâu `#CC1#*0.1+#GK#*0.2+#THI1#*0.7` — GIỐNG HỆT công thức kế thừa đang hiện,
      điểm không đổi), nhưng `D_CongThucDiem_ApDung/Xoa` bị chặn: "Danh sach thi da tao, nen khong sua cong thuc". Ảnh hưởng: lớp
      này nay có công thức riêng → sửa công thức cấp chương trình sau này sẽ KHÔNG lan tới lớp. KHÔNG dùng "Mở khóa" (tạo bản ghi
      mở chặn không có lời gọi xoá). Cần quản lý CSDL xoá tay dòng trên. **Bài học: không thử ghi dữ liệu gắn lớp đã có danh sách
      thi / điểm — thêm được mà máy chủ chặn gỡ.**
  - **Đợt 3 cùng ngày ("tiếp tục kiểm những màn khác"; luật mới: gốc phải có Xoa cho chính loại dữ liệu, không gắn lớp đã có
    danh sách thi/điểm, không hiện ra trước SV/người khác):**
    · SẠCH (thêm/sửa/xoá qua giao diện): CMS `ungdung`, `vaitro`; CCB `quatrinhchucvu` (FULL), `quanhegiadinh`,
      `khenthuongkyluat`, `danhhieuhocham` (4 màn CCB có đối chứng `LayChiTiet` có→không).
    · Máy chủ lỗi (ghi `can-quyet.js`, nhóm oracle): CMS `cautrucnoidungguiemail` + RL `tieuchixeploaiapdung` ORA-06550 sai chữ
      ký thủ tục; CCB `hoso/qtthongtin` danh mục hoạt động nhân sự rỗng (`LayDM_NhanSu_HoatDong` 0 dòng) → không thêm được.
    · CCB `sanphamkhoahoc/tapchiquocte`: thêm được, đã dọn (host CHƯA có bài báo thật nào). Id `ThemMoi` trả (dùng gắn tác giả,
      như gốc) KHÁC cột ID trong danh sách → ghi `can-quyet.js` (host) và KHÔNG thử 10 màn sản phẩm KH còn lại (sợ tác giả mồ côi).
    · Bỏ: CMS `ungdungchucnang` (gốc không có Xoa), CMS `danhmucdulieu` (nút Thêm khoá tới khi chọn danh mục bên trái — chưa làm).
    · Chưa làm (cần người dùng cho): kế hoạch đăng ký, tin tức/văn bản/sự kiện/khảo sát, miễn giảm, gia hạn, cấu hình tính phí,
      kết nối thanh toán, Cổng SV thủ vai (ghi vào dữ liệu SV thật), 10 màn sản phẩm KH, Học bổng (host thiếu API `HB`).
  - **Đợt 4 cùng ngày ("chạy luôn đi", thủ vai SV Đặng Bác Ái):**
    · **Cổng SV thủ vai `80CF9E…` — ĐÃ ĐỌC SÂU 22 màn** (`THUVAI="Đặng Bác Ái" SAU=1 node chay-vaitro.js 80CF9E…` — bước
      thủ vai mới trong chay-vaitro; vào vai DCQT.14.420233195, CHỈ ĐỌC). Tất cả mở được, "Theo dõi kết quả học tập" đủ 18 bảng.
      Sửa `_v2` `dangkyhoc/dangky.js`: không có kế hoạch đăng ký thì không gọi `LayDSHocPhanDangToChuc` (gốc vẫn gọi → máy chủ
      "Phai chon ke hoach dang ky hoc" hiện thành lỗi trước SV) → nay báo "Chưa có kế hoạch đăng ký". Kiểm lại sau deploy.
      Mục "Kiểm tra thông tin cá nhân" trỏ `ApisSinhVien/dicvusinhvien` (phân hệ chưa chuyển) — đúng là "chưa chuyển đổi".
    · CMS `danhmucdulieu` SẠCH (`BAM=".ums-master__item"` — bấm mục trái trước; thêm/sửa/xoá qua giao diện, danh mục CHUNG.LNHV).
      Bẫy bộ thử đã vá: lời gọi thêm/sửa là action MÃ HOÁ không func → không có chữ "Them" → nay lấy lời gọi ghi đầu tiên
      không phải "Lay…". (Lần chạy đầu để sót `ZKT1218`, đã dọn ngay: 20 → 19 dòng như cũ.)
  - **Công cụ:** `thu-ghi.js` thêm `FULL=1` (điền mọi ô trống, ô `d…`/`i…` = 1, ô ngày = hôm nay) + đối chứng `LayChiTiet`
    sau thêm / sau xoá. `thu-ghi-ui.js` đã chạy lần đầu (3 màn tự dựng). Kết quả `%TEMP%/ums-kiem-host/ghi-*-0926.log`.
  - **Chưa thử ghi (việc tiếp theo):** màn tự dựng (bộ thử `thu-ghi-ui.js` đã viết, CHƯA chạy lần nào),
    CMS, Đăng ký học. Cố ý KHÔNG thử ghi: hoá đơn/phiếu thu/biên lai, kết nối thanh toán, cấu hình tính phí, miễn giảm, gia hạn,
    kế hoạch đăng ký, tin tức/văn bản/sự kiện/khảo sát, điểm, chuyên cần, thi, phân quyền/người dùng/vai trò, công cụ CSDL.
- **SỔ ĐÃ KIỂM HOST (từ 2026-09-29): `_harness/kiem-host/da-kiem.json`** — từng màn: đọc sâu (`doc`) + thử ghi (`ghi`) + ghi chú. Trước khi kiểm
  host một phân hệ PHẢI xem sổ này, màn đã có thì KHÔNG kiểm lại (trừ khi mã màn đó đổi). Ghi sổ: `TU=<ngày> node _harness/kiem-host/ghi-da-kiem.js
  <ApisXxx> <roleId…>` (mục sửa tay đặt `"tay": true`); trang `_harness/tien-do.html` có khối "Đã kiểm trên host" đọc từ sổ (chạy lại `tien-do.py`).
  **Cách làm (người dùng chốt 29/9): CUỐN CHIẾU từng phân hệ** — đọc sâu → thử ghi (thêm thì xoá) → lỗi mã thì sửa `_v2`, lỗi CSDL / backend thì ghi
  `can-quyet.js` → ghi sổ → DỪNG báo cáo rồi mới sang phân hệ kế. Tóm tắt kết quả không cần mở JSON: `node _harness/kiem-host/tom-tat.js <6 ký tự>`.
  Bộ thử nay: `chay-vaitro.js` tự bấm mục đầu cột trái; `thu-ghi.js` / `thu-ghi-ui.js` nhận `TIM="Kadara"` (hồ sơ cán bộ của tài khoản thử: mã 01,
  họ đệm "Kadara H. Azz" — chọn theo `data-id` = userId, không thấy thì BỎ màn, không ghi vào hồ sơ người khác), chặn màn không khai `remove`.
  Màn dạng cây (Cơ cấu tổ chức) bộ thử không tìm được dòng → phải xoá bằng lời gọi của màn ngay sau khi thêm.
- **⚠ VIỆC CHO PHIÊN KIỂM HOST KẾ TIẾP: đọc `_harness/kiem-host/VIEC-PHIEN-SAU.md`** (viết 30/9, người dùng tạm nghỉ sau phiên 29–30/9). Tệp đó có: thông báo
  đầu phiên, màn đã sửa mã chờ kiểm lại, việc mã còn nợ, thử ghi dang dở từng phân hệ, phân hệ chưa kiểm, bản ghi thử còn sót, công cụ. Làm xong việc nào thì sửa tệp.
  Lượt kiểm trưa 30/9 (sau khi người dùng up 6 tệp — đã so băm với host, `--da-up`): kiểm lại ĐẠT và gỡ khỏi sổ lỗi mã Khen thưởng - Kỷ luật, Danh hiệu -
  Học hàm (Nhân sự + Cổng cán bộ; máy chủ nay tự xoá quyết định kèm của kỷ luật / khen thưởng / danh hiệu, riêng HỌC HÀM màn phải dọn), Đề xuất hồ sơ (dòng định
  danh trống, ngày sinh thành viên gia đình). **Sổ lỗi mã TRỐNG.** Tài chính thử ghi XONG (6 sạch, 6 tra cứu, 38 cố ý không thử). `hethonghoadon`: Thêm báo
  ORA-00001 nhưng bản ghi VẪN tạo, kể cả dữ liệu không trùng → lỗi thủ tục, ĐỪNG đổi ORA-00001 thành câu "trùng dữ liệu". Gói bổ sung CHƯA UP: `ref.js`
  (`xoaQuyetDinhKem` tìm cả trạng thái 0 và 1), `can-quyet.js` — người dùng ĐÃ UP chiều 30/9, kiểm lại học hàm ĐẠT. Xoá thành viên gia đình ở Đề xuất hồ sơ là
  xoá MỀM (IS_ACTIVE = 0). Chiều 30/9 (việc phụ): Cổng cán bộ `_qhht_chung.js` đã kiểm ngày sinh; Nhân sự `quyetdinh` gửi thêm `iTrangThai` / `iThuTu` (đã up, kiểm host ĐẠT: thêm xong hiện ngay trong danh sách); cùng màn: `NS_QuyetDinhNhanSu/LayDanhSach` trả rỗng với mọi quyết định → màn lấy thành viên từ `LayChiTiet`, chỉ xem (đã up, kiểm host ĐẠT; phần không bỏ được thành viên đã ghi `can-quyet.js`). **Kết ngày 30/9: sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy**; sổ cần quyết gỡ 3 mục (quyết định, hai màn tra cứu in ấn — danh mục có dữ liệu), thêm 1 mục khen thưởng (quyết định kèm trạng thái 0),
  viết lại mục Xử lý biệt lệ (host không có bảng danh mục nào cho loại xử lý). 61 mục `ben` của phân hệ đã kiểm đã rà theo quy ước A / B. Người dùng chốt 30/9: xoá kỷ luật / khen thưởng / danh hiệu / học hàm thì màn
  TỰ XOÁ quyết định sinh kèm (`ums.ref.xoaQuyetDinhKem`, móc `onRemoved` mới của `ums.crud`); khung "Ghi chú chuyển đổi" CỨ ĐỂ THU GỌN.
- **⚠ KHI NGƯỜI DÙNG BẢO "KIỂM HOST" — ĐƯA THÔNG BÁO TRƯỚC, rồi mới chạy** (người dùng dặn 2026-09-29). Thông báo gồm: (1) lỗi mã đang treo
  (`node _harness/kiem-host/loi-code.js ds`) — màn nào cần sửa, màn nào đã sửa chờ kiểm lại; (2) gói bổ sung đã up chưa (`_v2_bo_xung_deploy` còn tệp = chưa up);
  (3) phân hệ nào đã kiểm / còn dang dở phần thử ghi / chưa kiểm (đếm từ `da-kiem.json`); (4) bản ghi thử còn sót đã biết; (5) lượt này định làm gì, theo thứ tự nào.
  Phân hệ MỚI chỉ kiểm khi người dùng yêu cầu đích danh.
- **⚠ HAI QUY ƯỚC KIỂM HOST (người dùng chốt 2026-09-30, áp cho MỌI phiên sau):**
  **(A) Xử lý được bằng MÃ thì KHÔNG báo lỗi CSDL.** Gặp lỗi khi kiểm, hỏi trước: "màn có thể tự tránh / tự xử lý không?" — vd gửi sai định dạng, gửi ô trống thành
  `//`, thiếu kiểm ô bắt buộc / kiểu số / khoảng giá trị, câu lỗi kỹ thuật hiện thô, thiếu method GET, gửi ô đang ẩn, lưu lần hai thành thêm trùng. Có → ghi SỔ LỖI MÃ
  (`loi-code.js them`), SỬA `_v2`, chờ up rồi kiểm lại; KHÔNG ghi mục `ben` vào `can-quyet.js`. Chỉ ghi việc CSDL / backend khi mã KHÔNG thể làm gì: thiếu thủ tục, gói
  lỗi biên dịch, thủ tục sai chữ ký, danh mục / dữ liệu nguồn rỗng, dịch vụ không chạy, thủ tục làm sai (xoá báo thành công mà không xoá, lưu sai trạng thái).
  **(B) "Ghi chú chuyển đổi" do NGƯỜI KIỂM VIẾT, không bê nguyên câu lỗi của máy chủ.** Người kiểm đã biết chính xác lỗi gì, từ hành động nào → viết thẳng mục trong
  `can-quyet.js` theo khuôn: bấm gì / ở đâu → thấy gì → ảnh hưởng → ai cần làm gì (chi tiết kỹ thuật để trong ngoặc cuối câu), để người kiểm duyệt mở màn là thấy ngay.
  Phần tự ghi câu lỗi thô (làm 30/9) KHÔNG dùng làm nội dung ghi chú.
- **Kiểm host Điểm rèn luyện (tối 2026-09-30) — XONG phần thử ghi, lần sau KHÔNG kiểm lại** (trừ màn chờ kiểm lại dưới đây). Đọc sâu lại 8/8 đạt. Sạch qua giao
  diện: `danhmucdulieu` (danh mục Nhóm tiêu chí đang trống), `tieuchixeploai` (tiêu chí "ĐRL cuoi" chưa có mức nào — 6 mức thật của tiêu chí ĐRL không đụng; danh sách
  chỉ hiện khi chọn CẢ Đối tượng và Tiêu chí, như gốc), `tieuchidiemapdung` (Thêm, Kế thừa, Xóa toàn bộ), `hesoapdung` (cả hai khung). **Phạm vi thử an toàn:** hệ Đào
  tạo khác → khoá Tập huấn × kỳ 2031_2032_2 (đã quét 520 phạm vi khoá × năm / kỳ 2022–2026: host CHƯA có dòng "áp dụng" thật nào ở cả ba bảng, nên "Xóa toàn bộ" của
  phạm vi thử không đụng gì). **Lỗi mã (đã sửa, đã up, kiểm host ĐẠT):** Sửa tiêu chí điểm áp dụng bị "Du lieu khong duoc de trang" — máy chủ chỉ trả `DAOTAO_THOIGIANDAOTAO_ID`
  (id năm HOẶC kỳ), không có `_NAM_ID` / `_KY_ID` như mã (và bản gốc) đọc → ô thời gian trống; nay `A.giaTriPV` đưa `tgId`, `phamViForm.set` tự tìm ô chứa id; ô Hệ lấy
  theo ô lọc khi cùng khoá. **Backend (đã ghi sổ):** `tieuchixeploaiapdung` Thêm VÀ Sửa đều PLS-00306 (`THEM_` / `SUA_DRL_TIEUCHUANXEPLOAI_AD`); Kế thừa + Xóa toàn bộ
  chạy đúng. `nhapdiemrenluyen` SẠCH (người dùng cho phép): lớp "Bổ sung kiến thức QTKD K6" (8 học viên — NGƯỜI HỌC THẬT, ThS tuyển sinh 2026), kỳ 2031_2032_2, một ô: nhập 1 → sửa 2
  → xoá trắng; tổng điểm / xếp loại tiêu chí cha máy chủ tự tính và tự mất khi xoá. Cần dữ liệu phụ: Kế thừa tiêu chí điểm áp dụng cho đúng khoá × kỳ (xong thì Xóa toàn bộ).
  **Lỗi mã thứ hai (đã sửa, đã up, kiểm host ĐẠT — sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy):** máy chủ lưu tiêu chí CHA của dòng áp dụng bằng id tiêu chí CHUNG (Kế thừa ghi vậy, Nhập điểm tra con theo id chung), còn ô
  "Tiêu chí cha" và bảng cây dùng id DÒNG áp dụng (như gốc) → Sửa dòng con kế thừa rồi Lưu là mất quan hệ cha – con; nay ô mang id chung, `A.cay` dò cả hai. Không thử: "Thực hiện tổng hợp", "Xếp loại kỳ / năm / toàn khoá",
  Import (ghi hàng loạt, không hoàn lại). `tonghopdiem` Tìm kiếm + thống kê thiếu điểm chạy đúng.
- **Kết ngày 2026-09-30 (tối): sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy.** Sau khi người dùng up: kiểm host ĐẠT các lỗi mã Tài chính (lưới nhập mở
  một biểu mẫu; đơn vị phí khối kiến thức — dòng thiếu cột `PHAMVIAPDUNG_ID` thì lấy `ID`; phân bổ doanh thu) và Nhân sự (khối danh mục ở ba màn thiết lập bảng
  lương: nạp bằng danh sách theo ID bảng vì danh sách theo MÃ bảng máy chủ nhớ tạm ~20 giây; Sửa dùng lời gọi sửa của màn Danh mục dữ liệu; bảng lương năm xoá bằng
  `CMS_DanhMucDuLieu/Xoa`). Nhân sự đọc sâu lại 80/80 sau đợt chuyển hộp thoại: không lỗi JS. "Bảng quy định lương" (`luong/mucluongcoban`) và "Kế hoạch xét nâng
  lương" CÓ trên menu host → tự tạo bản ghi cha thử rồi xoá để kiểm các màn con (quy ước C). Trang `tien-do.html` có cột **Tình trạng** ("Đã kiểm sâu (không phát
  hiện lỗi từ code)" = đã đọc sâu + đã thử ghi / xếp loại, không còn lỗi mã treo). Đợt chuyển hộp thoại mới kiểm host ở Nhân sự + Tài chính.
- **Kiểm host Xử lý học vụ (đêm 30/9 → 1/10) — XONG, lần sau KHÔNG kiểm lại. Đã up, kiểm lại 6 lỗi mã ĐẠT; sổ lỗi mã TRỐNG, gói bổ sung TRỐNG, đã commit + đẩy.**
  Lỗi thứ 6 (tìm ra lúc kiểm lại): Kế thừa điều kiện chuẩn khi kế hoạch CHƯA có sinh viên → máy chủ "Du lieu khong hop le" → nay chặn trước theo `SOLUONG`. Đọc sâu 7/7. Host CHƯA có kết quả xử lý
  nào và 0 điều kiện chung → tự dựng chuỗi thử (quy ước C): điều kiện chung ZKT → áp dụng cho Đào tạo khác / Tập huấn × 2031_2032_2 → kế hoạch ZKT (không dùng làm kết
  quả chính) + một học viên lớp Bổ sung kiến thức QTKD K6 → Kế thừa điều kiện chuẩn → Xét → đổi mức, tạo quyết định, thêm SV vào QĐ → dọn con trước cha; mọi bảng về
  đúng số cũ (kế hoạch 144, áp dụng 2633, điều kiện chung 0, kết quả 0, QĐ 812). Không thử: Phê duyệt (chỉ có ThemMoi), "Thực hiện xử lý" (hàng đợi không xoá được).
  **5 lỗi mã đã sửa, chạy thử trên host bằng `va-tam.js` (mới — chạy tệp trên máy trong trang host) đạt:** ô bắt buộc + câu báo trùng ở Khai báo điều kiện, Điều kiện áp
  dụng, Kế hoạch xử lý (máy chủ trả "Du lieu khong hop le" / "Du lieu da ton tai"); cột "Kết quả điều chỉnh" phải đọc `MUCXULY_THAYDOI_TEN` (`MUCXULY_TEN` luôn là mức
  tự động); Ra quyết định "Thêm SV" phải gửi `strTrack_Id` (tra theo lớp bằng `LayDSNguoiHoc`) — gốc ORA-01400. **`ums.crud` có móc mới `saveFail(err, laSua)`** đổi
  câu lỗi máy chủ khi lưu. **Backend (đã ghi `can-quyet.js`):** `XLHV_TinhToan/XuLyHocVuNguoiHoc` trả Success = false, Message = strChucNang_Id dù đã tính kết quả;
  `Xoa_XLHV_DieuKienXuLy_AD_Tat` báo thành công mà không xoá. Danh sách "Điều kiện áp dụng" không lọc hiện cả 2633 dòng gắn KẾ HOẠCH (cột Khoá trống) — như gốc.
  Quyết định tạo từ màn không gắn kế hoạch (`strNguonDuLieu_Id` rỗng như gốc) → ô "Chọn quyết định" hiện mọi QĐ; để nguyên. Bẫy: `chay-vaitro.js` bước Sửa trước đây
  chỉ tìm `[data-act=edit]` nên KHÔNG bấm nút Sửa của `ums.crud` (`.ums-iconbtn--edit`) — đã sửa. Thu-crud XLHV nay 6/8: `dieukienapdung` (phải chọn Danh mục xử lý)
  và `kehoachxuly` (ô bắt buộc) chặn Lưu khi harness không chọn — đúng thiết kế.
- **Kiểm host Tài chính lượt 2 (chiều 2026-09-30, theo quy ước C) — ĐÃ XONG, lần sau KHÔNG kiểm lại:** đọc sâu lại 57 mục menu (như cũ: 5 mục trỏ tệp
  không có, ORA-24338 phân bổ doanh thu, PLS-00306 CM_ChuongTrinhDaoTao). Thử ghi SẠCH thêm 12 màn: `mucphi`, `mucphilop`, `sothangtinhtien`, `donviphimoi`,
  `donviphimoict`, `donviphimoihp`, `hocphansotienmoi`, `hesohocphanmoi`, `apdungcongthucphi`, `sothangkhonghoc`, `kehoachthuchi`, `giahanthu/kehoach`,
  `phanbodoanhthu` (tổng 19 màn sạch). **Cách thử không đụng học phí thật:** hệ "Đào tạo khác" (khoá Tập huấn; khoá Bổ sung kiến thức là khoá duy nhất có lớp
  quản lý + học viên), khoản thu "Võ phục", kỳ 2031_2032_2; màn cần học phần / khối kiến thức thì dùng Khoá 17 cũng với khoản + kỳ đó. Lỗi mã tìm ra (đã sửa,
  CHỜ UP): `pat.matrix` / `pat.pivot` cộng dồn trình xử lý mỗi lần vẽ lại → bấm sửa ô mở nhiều hộp thoại; `donviphimoict` thêm xong lưới không hiện cột; họ đơn
  vị phí / mức phí gửi ô trống lên máy chủ; `phanbodoanhthu` gọi danh sách khi chưa chọn Hệ / CT và không kiểm ô số. Không thử: `loprieng` (chốt không hoàn
  lại), `khongbatno` (kế hoạch đăng ký thật), `danhmucnganhang` (ngân hàng VNPAY hiện trước SV), `lophocphan` (không có xoá), `hesolophocphan` (nguồn lớp học
  phần 0 dòng — việc backend). **Bẫy bộ lái tay:** hộp thoại đóng bằng `.close()` vẫn nằm trong DOM và màn có vùng "Khai nhanh" ẩn mang cùng `data-k` → phải
  gắn id theo đúng vùng (`main [data-z="main"]`, hộp đang mở), nếu không là chọn nhầm ô ẩn. Bộ mẫu lệnh lái tay: `_harness/kiem-host/mau-lenh/` (P = phần đầu chung; mp / dvp / hp / ctp = từng họ màn).
- **⚠ QUYỀN THỬ GHI (người dùng 2026-09-30 tối, thay các hạn chế trước): "cho phép thêm sửa xoá TẤT CẢ, miễn là sau xoá được; những thứ không có đường hồi lại thì
  thôi".** Tức mọi màn có đường xoá / hoàn lại đều được thử, kể cả ghi vào dữ liệu của người học thật (chọn kỳ xa như 2031_2032_2, một ô / một dòng, xoá ngay và đối
  chứng). KHÔNG bấm thao tác không hoàn lại: tổng hợp / xếp loại / tính phí hàng loạt, chốt, xuất hoá đơn - biên lai, gạch nợ, gửi thư, nhập từ tệp, thứ máy chủ chặn gỡ
  (lớp đã có danh sách thi). Trước khi ghi phải chỉ ra được lời gọi xoá của chính loại dữ liệu đó. Phân hệ nào làm thì vẫn do người dùng gọi tên.
- **⚠ QUY ƯỚC KIỂM HOST (C) — người dùng chốt 2026-09-30:** thử CRUD mà thiếu dữ liệu đầu vào (danh mục rỗng, chưa có bản ghi cha) và thứ đó **tạo được ngay
  trong ứng dụng** thì sang màn đó tạo (dấu ZKT), quay lại thử, xong **xoá cả bản ghi thử lẫn dữ liệu phụ** (con trước cha; không có đường xoá thì không tạo).
  "Làm đến đâu sạch đến đó": mỗi việc khép lại (kiểm lại, dọn, ghi sổ) rồi mới sang việc khác. Việc phụ cứ làm; thử ghi một PHÂN HỆ cụ thể chờ người dùng quyết.
  Bài học 30/9: lỗi tưởng của máy chủ có thể là SAI TÊN THAM SỐ từ bản gốc — màn Quyết định gửi `dTrangThai` trong khi máy chủ đọc `iTrangThai` (màn Học hàm gửi
  `iTrangThai` thì lưu đúng) → trước khi ghi việc CSDL, so tham số với một màn khác gọi cùng controller.
- **⚠ LỖI ĐÃ KIỂM THÌ GHI THẲNG LÀ LỖI, YÊU CẦU BACKEND (người dùng chốt cuối ngày 2026-09-30 — thay quy ước "tự ghi lỗi vừa gặp" buổi sáng).**
  Phần tự chép câu lỗi máy chủ lên khung ("Lỗi máy chủ vừa gặp", `ums.api.onLoi` ở app.js, `localStorage['ums.canQuyet.loiMayChu']`, nút "Xoá lỗi tự ghi")
  **ĐÃ GỠ**. Kiểm host thấy lỗi máy chủ / máy chủ làm sai → BẮT BUỘC viết mục `ben` vào `can-quyet.js` trong cùng lượt (ghi CLAUDE.md thôi là KHÔNG đủ), theo
  khuôn quy ước B. Trên màn, nhóm `oracle` nay mang tên **"Lỗi đã kiểm trên hệ thống thật — yêu cầu backend / CSDL xử lý"**, huy hiệu ĐỎ "n lỗi cần backend xử lý"
  trên dòng tóm tắt (khung vẫn thu gọn). Kiểm độ phủ: mọi màn trong `da-kiem.json` có `doc: loi-may-chu` / `ghi: tu-choi` / `con-sot` phải có mục `ben` cùng khoá.
  Từ chối do dữ liệu thử không hợp lệ ghi `ghi: hop-le`. Móc `baoLoi` trong api.js còn đó nhưng không ai gắn.
- **Ngày sinh ba ô Ngày / Tháng / Năm: KIỂM TRƯỚC KHI GỬI bằng `ums.util.ngaySinh(ngay, thang, nam, maMuc)`** (api.js, người dùng 2026-09-30 — "tưởng cái này xử lý
  qua code trước khi gửi"). Bản gốc ghép thẳng `ngày/tháng/năm`; host có 983 hồ sơ CORE_PERSON đều CHƯA có ngày sinh → bấm Sửa rồi Lưu gửi `"//"` → `UpdateCorePerson`
  trả ORA-20001 (còn `InsertCorePerson` không kiểm ngày: nhận cả 31/02, tháng 13). Hàm trả `{ loi, chuoi, ngay, thang, nam }`: sai thì màn báo, KHÔNG gửi; đủ ngày-tháng-năm
  mới gửi `dd/mm/yyyy` (đã thêm số 0), còn lại gửi rỗng; ô không thuộc mức độ đang chọn không gửi giá trị cũ. Đã áp: Nhân sự `kehoach/dexuathoso` + biểu mẫu thành viên gia
  đình, Sinh viên `hoso/_hsA.js`. CHƯA áp: Cổng cán bộ `hoatdong/_qhht_chung.js` (một ô dd/mm/yyyy). Màn mới có bộ ba ô này PHẢI gọi hàm.
  **Câu kiểm dữ liệu của thủ tục (ORA-20000 … 20999)** nay hiện gọn đúng câu, bỏ `ORA-20001:` và đuôi `ORA-06512: at …` (`cauKiem` trong api.js; câu gốc ở `err.goc`) — và
  (phần tự ghi "lỗi máy chủ" đã gỡ cuối ngày 30/9).
- **SỔ LỖI MÃ (người dùng chốt 29/9):** màn nào lỗi do MÃ `_v2` thì ghi `node _harness/kiem-host/loi-code.js them <ApisXxx> <module/tep> "<lỗi>"`
  (tình trạng "cần sửa"); sửa xong `… da-sua … "<đã sửa gì>"` (chờ up + kiểm lại); kiểm lại trên host ĐẠT thì `… xong …` → mục tự mất khỏi cột
  "Lỗi mã" của `tien-do.html`. **Mỗi lần kiểm host: chạy `loi-code.js ds` TRƯỚC, kiểm lại các màn "chờ kiểm lại" rồi mới làm phân hệ mới**
  (chạy riêng vài màn: `CHI="<id1>,<id2>" SAU=1 node chay-vaitro.js <roleId>`). Khoá trong sổ = đường dẫn màn TRÊN MENU HOST (vd Kế hoạch tuyển dụng là
  `kehoach/kehoach`, dù nạp tệp `nhansu/script/kehoach.js`). 29/9 đã kiểm lại đạt và gỡ: QLD `quydoichungchi`, `congthucdiemapdung` (hết 405), Cổng SV
  `dangkyhoc/dangky` (không còn gọi khi chưa có kế hoạch). Nhân sự `kehoach/kehoach` kiểm lại đạt sau khi up. **Sổ lỗi mã hiện TRỐNG (29/9).**
- **Kiểm host 2026-09-29 — NHÂN SỰ XONG** (vai trò `6D5B87…` 80 màn + Nhân sự 2026 `3B4315…` 6 màn; 42 màn `_v2` còn lại không có trên menu host):
  tất cả mở được; thử ghi 41 màn sạch (kể cả đợt 2), KHÔNG còn bản ghi thử nào. Sửa `_v2`: `nhansu/kehoach` đánh dấu bắt buộc Mã / Tên / Phân loại. 9 việc máy chủ /
  dữ liệu đã ghi `can-quyet.js` (thiếu thủ tục lương tháng + thuế TNCN, `NS_QT_Luong/ThemMoi` ORA-01403, `InsertCorePerson` thiếu CONTEXT_CODE, danh mục
  `NS.TD.PHANLOAI` rỗng, chưa có Bảng quy định lương, mục menu "Kết quả phân loại" đường dẫn "dddd"). Chi tiết từng màn: sổ đã kiểm.
  **Chưa kiểm (theo thứ tự):** Sinh viên `2BD6D7…`, KHCT `3EEBEF…`, Nhập học `D3FA56…`, Tuyển sinh `FB5151…`, NCKH `41FCFE…`, Thi phách `6F038B…`.
- **Kiểm host 2026-09-29, đợt 2 (sau khi người dùng up gói; người dùng: "kiểm chỉn chu mục đã kiểm trước, phân hệ mới CHỈ khi tôi yêu cầu"):**
  · Nhân sự làm nốt bằng LÁI TAY `node chay.js <role> <cnId|-> '<thân hàm>'` (có `nut()`, `os()`, `s2()`, `go()`, `bang()`, `bao()`; truyền thân hàm trong
    nháy ĐƠN — nháy kép thì bash nuốt `$$`; mỗi lệnh có cnId là ĐỔI màn, muốn ở nguyên màn dùng `-`): `quyetdinh`, `vitricongviec`, `cocautochucv2` sạch → Nhân sự 41 màn sạch.
  · **Ghi LAN đã gặp:** thêm kỷ luật / danh hiệu có số quyết định → máy chủ tự sinh một QUYẾT ĐỊNH (`NS_ThongTinQuyetDinh`, `NGUONDULIEU_ID` = id dòng), xoá dòng thì
    quyết định Ở LẠI (3 bản ZKT của 26/9 + 29/9 đã xoá tay). `NS_ThongTinQuyetDinh/ThemMoi` lưu TRANGTHAI = 0 dù gửi 1 → không hiện trong danh sách (tìm bằng `iTrangThai: 0`).
    Cả hai đã ghi `can-quyet.js`. **Sau mỗi lượt thử ghi phải QUÉT dấu:** `chay-vaitro.js` nay ghi `zkt` (dấu `ZKT\d{4}` còn trên màn) và in "!! CÒN DẤU THỬ".
  · Quét lại 13 vai trò đã kiểm (đọc sâu): không còn dấu thử; lỗi máy chủ vẫn là các lỗi đã biết. Lỗi mã mới: Tài chính `TT.mount` / `T.importScreen` ném TypeError khi
    người dùng sang màn khác trước lúc tệp màn nạp xong → đã thêm chặn; người dùng up 29/9, kiểm lại ĐẠT (chuyển màn trễ 0 / 60 / 200 ms không còn lỗi JS), đã gỡ khỏi sổ.
  · **Bẫy bộ thử:** thẻ Edge bị che / có DevTools mở cạnh thì trình duyệt BÓP đồng hồ (setTimeout cả phút mới chạy) → màn "đứng im", mỗi màn 30–90 giây, 0 lời gọi.
    `cdp.js` nay tự `Page.bringToFront` + `Emulation.setFocusEmulationEnabled` và mở Edge với cờ tắt bóp nền. Thấy màn > 25 giây mà 0 lời gọi thì chạy lại bằng `CHI=`.
  · Sổ đã kiểm của 11 phân hệ cũ (TC, CCB, CSV, CC, CMS, DKH, HLTL, RL, XLHV, HB, QLD): phần ĐỌC đã cập nhật theo lượt quét 29/9; phần THỬ GHI còn nhiều màn "chưa thử ghi"
    trong sổ — việc kế tiếp là làm cuốn chiếu từng phân hệ cũ (bắt đầu Tài chính) khi người dùng bảo.
- **Bẫy khi đo bằng headless + `--virtual-time-budget`:** đồng hồ ảo KHÔNG chạy
  hai thứ sau, đo xong rất dễ kết luận nhầm là mã hỏng.
  - `scrollTo()` không bắn ra sự kiện `scroll`. Muốn kiểm thanh trên tự ẩn phải
    `w.dispatchEvent(new w.Event('scroll'))` bằng tay.
  - Hiệu ứng CSS không tự tiến. Dùng `el.getAnimations()[0].currentTime = t` để
    tua đến từng mốc rồi đọc `getComputedStyle`.

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

### Điểm cần nhớ

- `api.dataSource = 'auto'` — có `AXYZCLRVN()` thì gọi API thật, không thì dùng
  dữ liệu dựng thử. Không phải sửa mã khi chuyển qua lại.
- **Màn hình mới đặt đúng cây thư mục gốc** bên trong `_v2/`: vỏ nạp
  `_v2/<MAUNGDUNG><DUONGDANFILE>`, vd
  `_v2/ApisTaiChinh/Modules/danhmucheso/html/hethonghoadon.html` +
  `scripts/hethonghoadon.js`. Có tệp là tự bật, không khai báo ở đâu. Chưa có
  tệp thì hiện "chưa chuyển đổi" kèm đường dẫn cần đặt — **không nạp màn hình cũ**.
- `api.demoScreens` (màn mẫu dữ liệu cứng trong `screens/`) chỉ dùng ở chế độ
  dựng thử; chạy API thật thì bỏ qua.
- Màn danh sách + biểu mẫu viết bằng `assets/js/crud.js` (`ums.crud({...})`):
  chỉ khai action/func, cột, trường. Tên tham số/cột chép nguyên từ .js gốc.
- `api.js` gửi **form-urlencoded** như `$.ajax` cũ (không phải JSON), và chỉ
  mã hoá `{A: AE(...)}` khi lời gọi có `func` — action kiểu cũ
  (`TC_HoaDon/LayDanhSach`) đi thẳng, đúng như bản gốc.
- `index.html` tự chuyển sang `index.aspx` khi không chạy trên localhost (IIS
  xếp index.html trước index.aspx nên mở `…/_v2/` từng rơi vào dữ liệu mẫu).
  Ép xem dữ liệu mẫu: `index.html?demo`.
- `TENANH` kiểu Font Awesome 4 (`fa fa-x`) được đổi sang `fa-light fa-x` khi
  vẽ menu, để hiện đúng với FA Pro 7.
- **Thứ tự menu: hệ cũ KHÔNG sắp xếp gì cả.** `genHTML_MenuVertical`
  ([Core/systemroot.js:6391](Core/systemroot.js#L6391)) duyệt mảng theo chỉ
  số, mục con lấy bằng `data.filter` — tức thứ tự hiển thị chính là thứ tự
  `PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung` trả ra (ORDER BY trong
  procedure, theo `THUTUHIENTHI`). Sắp lại theo tên là sai trật tự nghiệp vụ.
  Ba luật ẩn hiện của hệ cũ, đều có thật:
  1. `index.aspx` chỉ vẽ **2 tầng**; mục tầng 3 mất hẳn. `indexi.aspx`
     (`genHTML_MenuVertical_Recusive`, Corei:6622) lại vẽ đệ quy nhiều tầng —
     cùng một vai trò, hai vỏ hiện menu khác nhau. Bản mới vẽ ĐỦ MỌI TẦNG
     (theo bản `indexi`), nhóm lồng dùng lớp `ums-nav__group--sub`.
  2. Mục **mồ côi** (cha không nằm trong danh sách được cấp quyền) bị bỏ hẳn
     → người dùng mất chức năng dù đã được cấp. Bản mới gom vào nhóm "Khác"
     (`behavior.menuOrphans`, đặt `'hide'` để giống hệt hệ cũ).
  3. Mục `DUONGDANHIENTHI = "#dashboard"` bị `display:none`.
- **select2 bắn `change` bằng jQuery, không phải sự kiện DOM thật** — đo được:
  `addEventListener('change')` nhận 0, `jQuery(…).on('change')` nhận 1. Đó là
  nguyên nhân "đổi ô chọn mà màn hình đứng im". Từ 2026-09-21 `ums.ui.select2`
  bắn thêm một `change` THẬT (đặt `jQuery.event.triggered` quanh lúc bắn nên
  trình xử lý jQuery không chạy hai lần) — cả hai kiểu gắn đều chạy đúng một lần.
- **Số dòng mỗi trang có ở MỌI thanh phân trang** (mặc định 10/15/25/50/Tất cả,
  `ums.ui.PAGE_SIZES`). Màn chỉ cần truyền `page.onSize(v)`; tự ẩn khi tổng số
  dòng ≤ mục nhỏ nhất (màn ít bản ghi) hoặc khi đặt `sizes: false`.
- **Thông báo nổi hiện lâu hơn** (người dùng 2026-09-30): nền 6 giây (thành công / thông tin), 9 giây (lưu ý), 12 giây (lỗi), cộng 60 ms mỗi ký tự vượt 60,
  trần 20 giây; rê chuột vào thì không tự đóng. Mức nền ở `site.config.js` → `behavior.toastMs`; màn truyền `timeout` riêng thì theo màn.
- **Ô chọn tệp**: `ums.ui.file({ key, accept })`, không để `<input type="file">` trần
  (trình duyệt vẽ "Choose file / No file chosen", CSS không đổi được chữ).
- **Trang chỉ có MỘT tab thì không vẽ dải tab** (người dùng yêu cầu 2026-09-22). Nhiều màn gốc từng
  thiết kế nhiều tab rồi GOM về một trang nhưng html/js vẫn giữ khung `nav-tabs` (một `<li>`, hoặc tab
  động trỏ tới `#tab_2…` không có trên màn — vd `hoso/qtthongtin`) → khi chuyển thì **BỎ HẲN khung tab
  trong mã**, không chỉ ẩn. Đã bỏ ở `qtthongtin`; đã rà 18 màn gốc cùng kiểu, bản mới đều không vẽ tab.
  Lưới an toàn: luật CSS `components/tabs.css` ẩn mọi `.ums-tabs` có dưới 2 tab đang hiện.
- **Xoá NHIỀU dòng = `ums.ui.xoaChon(bộChọnÔĐánhDấu, { attr })`** (người dùng chốt 2026-09-22): nút "Xoá đã
  chọn" tự đếm, khoá khi chưa chọn, dòng đang chọn tô sáng. Trong hộp thoại: nút xoá ở CHÂN hộp —
  `ui.dialog({ xoa: { chon, onClick } })`. Tiêu đề hộp thoại cùng màu biểu tượng (xanh). Xem BO-CUC bảng tra nhanh.
- **Đóng khung chi tiết bằng nút "Đóng"** trong `.ums-panel__tools`, không dùng
  mũi tên ← (đã gỡ hết 13 chỗ ngày 2026-09-21). 2026-09-25 người dùng bắt được mũi tên còn sót do
  TẦNG CHUNG sinh: `ums.crud` có `back()` tự vẽ ← ở đầu khung (khoanthu → "Kế hoạch xuất hoá đơn",
  `_chung_khac.js`) → nay `crud.js` vẽ `ui.btn('close')` cuối vùng nút; `_chung_a.js` khai nhanh "Quay lại ←"
  → "Đóng". `kiem-dong-bo.html` nay báo "!!" nếu màn còn `.fa-arrow-left`.
  **Nút "Đóng" luôn NGOÀI CÙNG BÊN TRÁI nhóm nút** (đầu trang / đầu khung / chân khung) — người dùng nhắc
  2026-09-25 (đã là quy ước: biểu mẫu crud và hộp thoại đều dựng Đóng trước). Đã sửa ~25 chỗ đặt Đóng ở cuối
  (crud `back`, luận văn `L.nut` chèn trước Đóng, hoá đơn, phiếu thu, khảo sát, tin tức, CMS/DKH mới…).
  Riêng chân hộp thoại: nút Xoá dạt trái (quyết định 2026-09-22). `kiem-dong-bo` báo "nút Đóng không ngoài cùng bên trái".
- **Màu nút chép đúng bản gốc**: `primary` / `save` (btn-success) / `warn`
  (btn-warning) / `danger`; đổi biểu tượng bằng `ums.ui.btn(kind, { icon })`.
- **Số dòng mỗi trang**: truyền `page.sizes` + `page.onSize` cho `ums.ui.pager` —
  chữ "Hiển thị" + ô chọn ở đầu thanh phân trang, đúng chỗ bản gốc đặt nó
  (`beginLoadPag`, Core:1739). Ô mang `data-no-s2` nên không bị select2 bọc;
  kiểu "giống hệt select2" ở `components/field.css` nay áp cho mọi ô `data-no-s2`.
- **Chữ trên nút giữ đúng bản gốc**: màn đang chuyển là màn của vỏ `indexi`
  nên nút mẫu báo cáo là "Xuất báo cáo" (Corei:6945), không phải "Báo cáo"
  của vỏ `index`. Nút bản gốc có mà không có xử lý thì giữ nút, đặt `disabled`.
- **JS dùng chung trong `index.aspx` mang `?v=<%= V("…") %>`** (số = lần sửa
  cuối của tệp, hàm `V` ở khối `<script runat="server">` đầu tệp). Trước
  2026-09-21 không có số này → đẩy `ref.js`/`patterns.js` mới lên host mà
  trình duyệt vẫn chạy bản cũ ("sửa rồi mà vẫn vậy"). Thêm tệp JS chung mới
  vào vỏ thì nhớ kèm `?v=`. JS của từng màn tự có `?v=` (app.js `inject`).
- **Sửa CSS xong phải chạy `python _harness\gop-css.py`.** Hai vỏ `.aspx` nạp
  bản GỘP (`assets/css/main.bundle.css`, `login-page.bundle.css`); `index.html`
  vẫn nạp bản @import nên trên máy sửa là thấy ngay. Không gộp thì host vẫn
  chạy CSS cũ. Lý do phải gộp: tệp chỉ gồm @import bị trình duyệt coi là tải
  xong rồi vẽ trang ngay → vào lần đầu trơ chữ / mất hết biểu tượng, F5 mới
  đúng (đã gặp thật trên host 2026-09-21).
- **Bảng "Màn đang có lỗi backend"** (2026-09-30, người dùng: để bộ phận backend nhìn trực quan trước khi hoàn thiện sản phẩm, sau thì tắt). Trang một vai
  trò khi chưa chọn chức năng (`#/r/<vai trò>`) liệt kê các màn CỦA VAI TRÒ ĐÓ có mục `ben: 'oracle'` trong `can-quyet.js` (mục nghiệp vụ `nghiepvu` KHÔNG tính):
  tên màn là liên kết mở thẳng màn, cột lỗi, cột tình trạng (đọc câu trả lời ở khung "Ghi chú chuyển đổi"). Vai trò không có lỗi → vẫn là ô "Chọn một chức năng ở cột
  bên trái". Trang chủ có nút "Xem màn có lỗi backend của mọi vai trò" (bấm mới nạp menu mọi vai trò — dùng chung chỉ mục của ô tìm màn, `tmNap` cache `v: 2` thêm
  trường `q`). Mã: app.js `veTrangVaiTro`, `lbBang`, `lbVeNutTong`; CSS `.ums-lb*` (patterns.css). **Tắt:** Cài đặt → Hành vi → "Hiện danh sách màn có lỗi backend"
  (từng trình duyệt) hoặc `site.config.js` → `behavior.loiBackend = false` (mọi người); `behavior.canQuyet = false` cũng tắt luôn. Phân hệ CHƯA kiểm host khai ở
  `ums.canQuyetChuaKiem` (cuối can-quyet.js) → dòng mang nhãn "chưa kiểm trên host"; kiểm xong phân hệ nào thì gỡ tiền tố của nó khỏi mảng. Thêm / gỡ mục `ben: 'oracle'`
  là bảng tự đổi — không phải sửa gì khác.
- **Ô tìm DUY NHẤT trên thanh trên** (2026-09-26 — ô "Tìm kiếm chức năng" ở cột trái ĐÃ BỎ, thay bằng thanh "Vai trò"
  đang dùng `#roleBar` + nút đổi vai trò, app.js `datVaiTro`). Đang ở một vai trò: gõ là lọc cây menu trái (filterNav) và thả
  xuống màn của vai trò đó TRƯỚC ("(đang dùng)"), cuối có nút "Tìm trong mọi vai trò"; không khớp thì tự tìm mọi vai trò.
  Thả xuống (chốt 2026-09-26): tối đa 3 dòng của vai trò đang dùng (nền xanh, nhãn "đang dùng", dư thì báo "+ n màn nữa — xem
  cây menu trái"), NGAY DƯỚI ~5 dòng của vai trò khác (không bấm thêm; vai trò đang dùng không khớp thì hiện tới 50). Dòng phụ
  CHỈ tên vai trò (bỏ nhóm menu). Gõ trong một vai trò là nạp danh sách mọi vai trò (1 lời gọi / vai trò, nhớ theo phiên).
  Nút Menu + logo bọc `.ums-topbar__left` rộng tối thiểu bằng cột trái → ô tìm bắt đầu thẳng mép cột trái. Màn hẹp vẫn hiện ô.
- **Tìm màn hình trong MỌI vai trò** — ô tìm trên thanh trên (`#gSearchInput`, app.js `timMan`, CSS `objects/shell.css` .ums-gsearch;
  người dùng 2026-09-26). Lần đầu bấm vào ô: nạp `loadRoles` rồi `loadMenu` (LayDSChucNangNguoiDung) cho TỪNG vai trò, 4 lời gọi
  cùng lúc (48 vai trò = 48 lời gọi một lần mỗi phiên), nhớ trong sessionStorage `ums.timMan.<userId>.<mode>`. Chỉ mục có
  DUONGDANFILE. Gõ không dấu; kết quả = tên màn + dòng nhỏ "vai trò · nhóm menu"; Enter/bấm → `#/r/<vai trò>/<chức năng>`.
  Ctrl K hoặc / để vào ô. Màn hẹp (<768px) ẩn ô. Kiểm trên host: số lời gọi / thời gian nạp lần đầu.
- **Khối chung mới 2026-09-26 (dùng thay vì tự dựng):** `ums.pat.cotTrai(m, { tai, tuTaiLoc, tuTim, moSan })` áp luật cột trái lên
  pat.master đã dựng; `pat.dsNhanSu` / `masterNhanSu` (danh sách cán bộ); `pat.boLocNguoiHoc` (thanh lọc người học nhiều tầng);
  `pat.dauDoiTuong` + `pat.datNoCo` (đầu khung người/đối tượng đang chọn: tên, nhãn, viên tổng nợ, nút) và `pat.thanhThu` +
  `datDaChon` / `datTongTab` (thanh thao tác tab thu tiền) — 9 màn Tài chính đã dùng; `pat.anhNguoi` (ảnh người tròn);
  `ui.btn('reload')` = nút ↻ nhẹ, luôn cuối nhóm; `ui.money` / `ui.so` theo `site.config.js` → `money` (dấu phẩy, 0 số lẻ).
  Trang kiểm bắt buộc thứ ba: `_harness/kiem-cot-trai.html`; trình chạy chuẩn `_harness/chay-cdp.js`.
- **Xuất mapping cho Cổng Help** (2026-09-26): màn Cài đặt (`screens/cai-dat.html`) nút "Xuất mapping" → `ums.app.xuatMapping()`
  (app.js) đọc TOÀN BỘ chức năng trong CSDL (LayDanhSachUngDung → LayDanhSachChucNang từng ứng dụng, như màn CMS chucnang —
  không theo vai trò; người dùng: "phải lấy đủ trong csdl vì sẽ phải chuyển hết"), kiểm tệp `_v2` từng màn → tải
  `mapping-chuc-nang_<ngày>_<giờ>.json` (schema `ums-help-mapping/1`: applications, modules, menuGroups, functions[functionId,
  code, file, subsystem, module, menuPath, legacyShell, helpUrl, converted, icon (ĐÃ chuẩn hoá FA7 như menu _v2, không bao
  giờ "fa …"), iconRaw, dataIssues[code-trung / thieu-route / duong-dan-file-khong-hop-le / icon-mac-dinh / icon-khong-hop-le]]).
  Chạy trên host: `node _harness/kiem-host/xuat-mapping.js` → `_harness/gui-help/`.
- **Nút "?" Cổng Help — MỌI màn** (2026-09-26, bên Help chọn cách A = một mẫu link): `site.config.js` → `help.url` (mẫu có
  `{functionId}` `{code}` `{app}` `{subsystem}` `{module}` `{screen}` `{version}` `{lang}`), `help.app` / `version` / `lang` / `target`.
  app.js `helpLink(cn)`: có `url` → ghép mẫu (ưu tiên); không → link riêng DUONGDANHUONGDANSUDUNG; không có gì → "?" dạng nút
  `data-help-cho`, bấm báo "đang xây dựng". **Khi Help gửi URL: chỉ điền `help.url` (+ `version`) rồi dựng gói — không sửa mã.** Functions ID = ID CSDL, CHUNG cho vỏ cũ và `_v2`
  → một tệp phục vụ cả màn chưa chuyển. Chế độ dựng thử lấy menu mẫu (source "demo"). Nhánh CSDL CHƯA chạy thử trên host.
  Yêu cầu Cổng Help: `_v2/docs/Yeu_cau_Cong_Help_*.docx` (Function ID + Help Version là hai khoá tích hợp).
- **SSO sang Cổng Help để SOẠN bài** (2026-09-27, yêu cầu `yeu-cau-sso-cho-doi-app.md` — KHÁC việc nút "?"): `_v2/help-sso.aspx`
  (kế thừa `Apis.LoginVT.Index` → `user_id` / `fullname` / `tokenjwt` / `app_id`; người đăng nhập = `HttpContext.User` kiểu `CustomPrincipal`,
  có `Username`) phát JWT RS256 90 giây tự dựng rồi tự POST sang Help; `_v2/help-jwks.aspx` = khoá công khai (trang công khai, đăng ký với
  Help). Cấu hình + khoá RSA ở `App_Data/help-sso/` của ứng dụng cha (tự tạo lần đầu; `iss` = mã trường `ums-qtdh`, `helpUrl` =
  `https://con98.api-apis.com/help-master` — Help dùng chung nhiều trường, phân biệt bằng `iss`). Mục menu người dùng "Soạn bài hướng dẫn":
  `site.config.js` `help.sso`, `chrome.js` + `app.js soanBaiChoPhep`. **ĐÃ CHẠY ĐÚNG trên host ở chế độ `?xem=1`** (48 mã `MAVAITRO`, email,
  tên); CHƯA gửi thật sang Help (Help chưa triển khai). Kiểm: `node _harness/kiem-host/sso-xem.js` (chỉ đọc). Bảng mã vai trò gửi Help:
  `_harness/gui-help/bang-ma-vai-tro.md`. Hướng dẫn: `_v2/TRIEN-KHAI.md` mục 9. **Bài học đã trả giá (đừng lặp lại):**
  **Bản sao ở GỐC dự án (2026-09-28):** `help-sso.aspx` + `help-jwks.aspx` y hệt bản `_v2` (dong-goi.py tự chép lại, nguồn sửa là `_v2`);
  địa chỉ khai bên Help nên là bản ở gốc (`<ứng dụng>/help-sso.aspx`) — không phụ thuộc v1 / v2, trường chỉ chạy v1 chép hai tệp là
  dùng được. Người dùng tự chép hai tệp gốc lên host (không nằm trong gói `_v2`).
  · **`bin` nối CSDL KHÁC:** `Apis.Login.BO` / `OraDB` dùng kết nối `OraMainDb` (enum = 4) → schema `CMCDB`, còn microservice (`Config.js`:
    `https://qldt.eaut.edu.vn/…api`) chạy CSDL khác — cùng ID người dùng mà tên / email / vai trò lệch (CMCDB 34 vai trò, API 48). Dữ liệu
    nghiệp vụ phải lấy qua API. Trang gọi API phía máy chủ: Bearer `tokenjwt`, body `A=AE(json, phần sau "/" của action)`, `Data.B` giải
    bằng `AD(…, "AzzSystem")`; **`AE`/`AD` chỉ là XOR từng ký tự với khoá rồi base64** (crypto-js.js:6192). API TỪ CHỐI payload không mã
    hoá (500 "Value cannot be null"). Base URL: host KHÔNG khai appSettings `CMS`… mà chỉ có trong `Config.js` → trang tự đọc `~/Config.js`.
  · Không có API lấy người dùng theo ID: tìm `LayDanhSachNguoiDung` theo tài khoản (chuỗi con) rồi khớp ID, lật tới 10 × 500 dòng. Bản ghi
    phía API không có email → lấy email tài khoản ở CSDL đăng nhập (`UserBo.GetDetail`, hàm STATIC), tắt bằng `emailFromLoginDb`.
  · **Bẫy ASPX:** không viết nguyên thẻ đóng script trong khối `runat="server"`, kể cả trong chuỗi hay CHÚ THÍCH → khối C# bị cắt, host
    chỉ hiện "Runtime Error" (customErrors RemoteOnly) và `Page_Error` không bắt được. Tách `"</scr" + "ipt>"`; kiểm `grep -c "</script"` = 2.
  · Hàm BO trong `bin` là static; OUT kiểu chuỗi của Oracle phải khai size; máy này không biên dịch thử được C# (csc bị chặn) → soi DLL
    bằng phản chiếu PowerShell (tên hàm, chuỗi trong IL) trước khi viết.
  · `bin/Apis.Login.BO.dll` có khoá RSA riêng viết cứng trong `loadRsaPrivateKeyPem` (không dùng, nên báo đội backend).
- Thanh trượt cột trái do JS tự vẽ (`assets/js/scroll.js`), đè lên nội dung
  nên không chiếm chiều ngang.
- **Dính đỉnh:** ở đâu có nút thao tác thì ở đó dính khi cuộn — `.ums-page__head`
  (cạnh tiêu đề) hoặc `.ums-panel__head` (trong biểu mẫu), nhưng không bao giờ
  cả hai cùng lúc. Điều kiện viết bằng `:has()` nên tự đổi khi nút ẩn/hiện, xem
  `objects/shell.css`.
- **Đổi vùng có hiệu ứng:** `ums.ui.swap(vùngCũ, vùngMới)` cho vùng mới trượt
  lên 14px trong 240ms (`generic/motion.css`). Dùng `animation-fill-mode:
  backwards` để chạy xong không đọng `transform` — đọng lại là phá `sticky` của
  đầu khung nằm bên trong. Tôn trọng `prefers-reduced-motion`.

## 11. Làm tiếp trên máy khác

### Mở đầu phiên trên máy mới — làm đúng ba bước này

1. Đọc hết tệp này. Mục 5 (`index` / `indexi`) và mục 8 (cạm bẫy) là hai mục
   tốn nhiều công dò nhất, đừng dò lại.
2. Chạy `_harness\serve.ps1`, mở `http://localhost:8787/_v2/index.html`,
   bấm thử vài màn hình để biết đang ở trạng thái nào.
3. Báo lại đang thấy gì rồi nhận việc tiếp. Việc kế tiếp đã ghi ở cuối mục này.

Trạng thái mặc định khi chỉ chép `_v2`: **chạy bằng dữ liệu mẫu**, xem khung
cảnh báo ở phần dưới.

### Git: KÉO từ `loginVT-main`, ĐẨY lên `LoginVT-V2` (từ 2026-09-26)

`_v2/`, `_harness/`, `CLAUDE.md` nay NẰM TRONG git và đã lên `quyentt/LoginVT-V2` (commit `1977a9dd`) — máy khác
clone repo V2 là có đủ (trừ `tk.md`, `_v2_deploy/` — dựng lại bằng `python _harness/dong-goi.py`). Chi tiết cấu hình: mục 9.

**Luật sau mỗi lần pull** (người dùng yêu cầu 2026-09-22): `git diff --stat ORIG_HEAD HEAD`,
tệp nào thuộc màn ĐÃ CHUYỂN trong `_v2` thì **tự chuyển thay đổi sang bản mới**
(thay đổi thuần CSS/bố cục của hệ cũ thì bỏ qua; mã mới lỗi rõ → làm theo ý định +
ghi `can-quyet.js`). Lần đầu (18 commit): `khoanthu` (VAT), `xuatlohoadon`,
`chungtu` (VAT hoá đơn), `import_danop` / `import_phainop` (đường dẫn tệp mẫu).
Lần 2 (2026-09-27, 12 commit, merge `86a41b08`): KHCT `cthp` (hộp Phạm vi áp dụng + Số tín chỉ), SV `hoso` (câu báo lỗi hoá đơn) —
chi tiết `_v2/CAN-QUYET-DA-CHOT.md` mục cùng ngày; Tuyển sinh / Thi phách / Tốt nghiệp / index.aspx chưa chuyển nên bỏ qua.

Lần 3 (2026-09-29, 12 commit, merge `5018e138`; ĐÃ CHUYỂN cùng ngày): CCB `lichgiangnhieuphonghoc` (lưới 5 module, lọc sức chứa, đổi lịch ngay trên màn, xuất theo module — tuỳ chọn mới của `_nhieu.js` / `_lichgiang_doilich.js` mặc định như cũ), CCB `nhapdiemdst` (cột Xuất Excel), KHCT `cthp` (hai ô mô hình tương đương / thay thế — đường GHI mới), TS `kehoachtuyensinhnew` (hộp Kết quả đăng ký +17 cột, xuất theo lọc), SV hồ sơ (tự cắt khoảng trắng). Không chuyển: Core / Corei / index.aspx (vỏ cũ), DKH `lophocphan.html` (vá CSS indexi), TC `thutien` (`_v2` vốn đã vậy). Chi tiết `_v2/CAN-QUYET-DA-CHOT.md` mục cùng ngày; 2 việc dữ liệu ở `can-quyet.js`. CHƯA kiểm host.

Lần 4 (2026-09-30, 10 commit, merge `cffda56e`) + lần 5 (2026-10-01, merge `c6886b05`) — **ĐÃ CHUYỂN 2026-10-01** (làm ở workspace đám mây, chưa commit trên máy): 20 màn — CCB `lichgiangnhieuphonghoc` (lọc phòng trống theo khoảng ngày + thứ + tiết, `TKB_CHUNG.LAYPHONGHOCTRONG`); Cổng SV 18 màn (dangkyhoc 7 kể cả congnhandiem / congnhandiemv3 không cần đổi, hoctap 4, profile 2 — `hoso` không cần đổi, thanhtoanonline, thoikhoabieu/lichhoc, tinhhinhhocphi, tintuc, dashboard) — tầng chung chạm: `ums.diemHoc` (cờ `bamDong` theo `ctdt`), `ums.lich` (`ngayNgan`), `ums.tkbSV` (tên cột bảng lớp); màn mới Cổng SV `dicvusinhvien/nguoihocxacnhanthanhtoan` (nạp chéo bản Sinh viên, `data-kieu="csv"`). F5 khi thủ vai: GIỮ cách `_v2` (giữ vai). Chốt: `_v2/CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-01"; không có việc dữ liệu mới. Kiểm dữ liệu mẫu: CSV kiem-dong-bo 36/37 (lỗi đã biết) + thu-crud 37/37, CCB kiem-dong-bo 152/152. CHƯA kiểm host. Phân hệ mới `ApisThiTracNghiem` + thay đổi `ApisQuanLyThiTracNghiem` chưa chuyển nên chưa có việc.

**⚠ KHI NGƯỜI DÙNG BẢO "CHUYỂN" HOẶC "KIỂM" — ĐƯA THÔNG BÁO THAY ĐỔI GỐC TRƯỚC** (người dùng dặn 2026-09-30): đọc `_v2/CHO-CHUYEN-SAU-PULL.md`, tóm tắt các thay đổi của kho gốc đang chờ chuyển (số màn, màn nào đổi API / hành vi, màn mới, điểm cần quyết) và nói mục nào dính tới việc sắp làm, rồi mới làm. Tệp trống thì nói rõ "không có thay đổi gốc nào đang chờ". Khi kiểm host, đây là mục (6) của thông báo đầu phiên (mục 9).

**⚠ ĐANG TREO (1/10): 20 màn chuyển từ kéo gốc lần 4 + 5 ĐÃ UP host nhưng CHƯA KIỂM HOST, CHƯA COMMIT GIT** — khi người dùng nhắc "chuyển" hoặc "kiểm host" thì NHẮC việc này trước tiên; danh sách + cách kiểm: `_harness/kiem-host/VIEC-PHIEN-SAU.md` mục 1. Kiểm đạt mới commit + đẩy.

**Cùng ngày — ba luật bảng ở tầng chung** (BO-CUC luật 17 + ghi nhớ): cột ô đánh dấu chọn dòng tự về CUỐI bảng (`ums.ui.table`, `data-cot-goc`, `ums.ui.oTheoGoc` cho báo cáo / import); ô đánh dấu trong ô bảng căn giữa theo chữ; "Thông tin lịch" nhiều khối thành danh sách `.ums-dsl` (`ui.escBr`); mục cột trái mã dài tự xuống dòng. `thu-crud` nhận thêm tên thủ tục `_Create` / `_Update`.

### Chép tối thiểu — đã đo, chép đúng ba thứ này là chạy được

```
<thư mục bất kỳ>/
├── _v2/                 3,2 MB   toàn bộ giao diện mới
├── _harness/serve.ps1      3,3 KB   máy chủ tĩnh
└── CLAUDE.md                28 KB   tệp này
```

**Kiểm chứng ngày 2026-09-18:** chép riêng `_v2` ra một thư mục trắng rồi lấy
chính nó làm gốc web — **54/54 tệp tải về thành công, 0 lỗi 404**. Phông Mulish
nằm trong `_v2/assets/fonts/`, jQuery 3.7.1 / select2 / flatpickr / Chart.js
4.4.2 / Font Awesome Pro 7 đều nằm trong `_v2/assets/vendor/`. Không một
đường dẫn nào trong `index.html` trỏ ra ngoài thư mục.

Vẫn cần `serve.ps1` vì `index.html` nạp màn hình bằng `fetch()` — **mở bằng
`file://` sẽ trắng trang** do CORS chặn. Máy chủ nào cũng được (Live Server của
VS Code chẳng hạn), giữ `serve.ps1` chỉ để máy nào cũng chạy giống nhau.

> **Chép kiểu này thì chạy bằng DỮ LIỆU MẪU.**
>
> `site.config.js` đặt `api.dataSource: 'auto'`: có hàm `AXYZCLRVN()` do vỏ
> ASPX sinh ra thì gọi API thật, không có thì lấy `assets/js/demo-data.js`.
> Chép riêng `_v2` thì không có vỏ ASPX, nên **luôn rơi vào dữ liệu mẫu** —
> đúng 48 vai trò, cây chức năng của vai trò Tài chính, và năm màn hình mẫu.
>
> Đây là chế độ đủ để làm tiếp phần giao diện: sửa CSS, thêm màn hình, chỉnh
> bố cục, đổi màu. Không đụng được vào dữ liệu thật và không thử được API.

### Khi nào KHÔNG đủ — phải có dự án gốc

**Từ 2026-09-29 `_v2` tự chứa mọi tệp TĨNH** (người dùng: "không phụ thuộc thứ gì khác ngoài v2"): `crypto-js.js` (AE/AD) chép
về `_v2/assets/vendor/crypto/` (có trong `GIU_VENDOR`; gốc đổi tệp này thì chép lại), hai ảnh nút đăng nhập về `_v2/assets/img/`.
`Config.js` và `encrypt.js` KHÔNG có trong kho (mỗi host một bản): `index.aspx` (`TrongV2`) / `login.aspx` dùng bản trong `_v2`
(`_v2/Config.js`, `_v2/assets/vendor/encrypt/encrypt.js`) nếu có, chưa có thì lùi về bản của ứng dụng cha — host đang chạy không
phải đổi gì. Còn phụ thuộc cha, không chép được (mã / dữ liệu máy chủ): `bin/`, `Web.config`, `App_Data/help-sso/`,
`Handler/*.ashx`, `Pages/ForgetPass.aspx` + `Support.aspx`, `Upload/` (kể cả phôi in). Bảng đầy đủ: `_v2/TRIEN-KHAI.md` mục 2.

Nó vẫn phải nằm BÊN TRONG dự án thật mới có phiên đăng nhập và địa chỉ API. Vậy:

| Việc định làm | Cần gì |
|---|---|
| Sửa giao diện, thêm màn hình, đổi màu | Chép `_v2` là đủ |
| Đẩy lên host thử API thật | Clone lại dự án gốc rồi thả `_v2` vào |

### Chép đầy đủ (khi cần cả dự án cũ)

| Chép | Thư mục | Nặng | Vì sao |
|---|---|---:|---|
| Nên chép | `_harness/` cả thư mục | 60 KB | Chạy được màn hình CŨ không cần Oracle, và hai trang `measure*` để đo giao diện đang chạy |
| Nên chép | `_migration/` | 16 KB | Bảng kiểm kê 327 class cũ |
| Tuỳ | `assets/vendor/` | 400 KB | Chart.js UMD cho **màn hình cũ**, không liên quan `_v2` |
| Tuỳ | `html data/` | 17 MB | Bootstrap + FA Pro gốc. `_v2` đã có bản riêng nên **không cần** |
| **ĐỪNG chép** | `Upload/` | 695 MB | Dữ liệu thật của sinh viên — xem mục 8, bẫy số 8 |

Phần mã dự án gốc lấy lại bằng:

```bash
git clone https://github.com/quyentt/loginVT-main.git
# nhánh main, commit cuối lúc gỡ git: 6ea12710
```

rồi thả `_v2/`, `_harness/`, `CLAUDE.md` vào thư mục vừa clone.

### Chạy thử ngay sau khi chép

```powershell
powershell -ExecutionPolicy Bypass -File _harness\serve.ps1
```

Mở `http://localhost:8787/_v2/index.html`. Không cần Node, Python hay IIS.
Cổng mặc định là **8787** (khai trong `serve.ps1`), đổi bằng `-Port`.

Máy hiện tại không có Node / Python / dotnet / IIS Express. Nếu máy mới có Node
thì `npx serve` cũng chạy được, nhưng hãy giữ `serve.ps1` để máy nào cũng chạy
được như nhau.

### Đã làm đến đâu

**Khung giao diện — xong.** Thanh trên tự ẩn khi cuộn xuống, cột trái thu/mở và
nhớ trạng thái, thanh trượt tự vẽ, breadcrumb, thông báo nổi, điều hướng ba tầng
bằng hash, bộ cấu hình màu/logo + màn hình cài đặt có xem trước trực tiếp.

**Năm màn hình mẫu** trong `_v2/screens/`:

| Tệp | Đại diện cho | Có gì |
|---|---|---|
| `ke-hoach-mua.html` | Danh sách + lọc + biểu mẫu | Bảng, phân trang, thanh lọc, chuyển danh sách ↔ biểu mẫu có hiệu ứng |
| `danh-muc.html` | Nhóm danh mục (21 bản `danhmucdulieu.js` gộp về một) | Tab, tìm kiếm, biểu mẫu thêm/sửa |
| `ke-hoach-tai-chinh.html` | Biểu mẫu dài | Hai cột, select2, chọn ngày |
| `tong-quan.html` | Báo cáo | Thẻ số liệu, biểu đồ Chart.js |
| `cai-dat.html` | Cài đặt giao diện | Đổi màu/logo/phông, xem trước ngay, xuất cấu hình |

**Nối API thật — đã viết, CHƯA chạy thử trên máy chủ.** `assets/js/api.js` và
`session.js` giữ nguyên giao thức cũ (action/func/iM/JWT). Việc còn lại là đẩy
`_v2/` lên host rồi mở `index.aspx`. Hai endpoint đang khai trong
`site.config.js` là `LayDSVaiTroNguoiDung` và `LayDSChucNangNguoiDung`.

Trên máy chỉ có `_v2` thì phần này KHÔNG chạy thử được — thiếu vỏ ASPX nên
`dataSource: 'auto'` luôn rơi về dữ liệu mẫu. Đừng mất công sửa `api.js` mò
mẫm ở đó; để dành đến khi có host.

### Việc kế tiếp

1. ~~**Kiểm chứng API thật trên host.**~~ **XONG (2026-09-20)** — người dùng
   xác nhận bản mới đang chạy trên host với API thật: menu lấy từ
   `LayDSChucNangNguoiDung` hiện đúng cây chức năng thật (có "Kết nối thanh
   toán", "Phân bổ - khoản thu" — không có trong dữ liệu mẫu). Tức chuỗi
   `AXYZCLRVN()` → `session.js` → `api.js` chạy được.
   (2026-09-18: trước đó thấy dữ liệu mẫu vì IIS trả `index.html`; đã sửa.)
   Việc còn lại: đối chiếu DỮ LIỆU của từng màn với hệ đang chạy.
2. **Phân hệ Tài chính — đã chuyển 72/73 màn (2026-09-19).** Chỉ chạy thử
   bằng dữ liệu mẫu. Còn `mucphisotien` (bản gốc rỗng, không có gì để chuyển).
   Cách chuyển: `_v2/CHUYEN-DOI.md`. Chi tiết từng màn ở chú thích đầu tệp .js.

   **Chờ nghiệp vụ quyết định** (đang giữ hành vi tạm, ghi rõ trong tệp):
   - `hoadon/hoadonnhap`: `indexOf("DOITUONGKHAC")` đúng khi KHÔNG chứa → bản
     nháp của người học gửi `strLoaiDoiTuong=DOITUONGKHAC`. Đang giữ như gốc.
   - `hoadon/xuathoadon`: ô tiền không kiểm, `1.500.000` bị hiểu là 1,5. Đang giữ.
   - `phieuthu/pos_thutien` "Xuất biên lai" và `thutienkhac` "Xuất hoá đơn" (tab
     nộp trước): bản gốc gửi sai cột lên `TC_DaNop/ThemMoi`; ĐÃ SỬA → đổi dữ
     liệu thật gửi đi. Nếu nghiệp vụ muốn giữ cũ thì phải tắt hai nút.
   - `danhmucheso/hesolophocphan` Xoá: đổi sang gửi ID bản ghi (gốc gửi chuỗi ghép).
   - ~~`danhmucheso/khongbatno`: bỏ nút thêm "khoản kiểm tra nợ"~~ **ĐÃ QUYẾT
     (2026-09-21): sửa cho đúng.** Bản gốc `save_PhamVi` lặp theo từng khoản
     thu rồi gọi `save_BatNo(idKhoanThu)` → nhét id KHOẢN THU vào
     `strPhamViApDung_Id`, vứt mất phạm vi SV/lớp vừa chọn (dòng đúng bị chú
     thích sẵn: `//me.save_BatNo(strPhamViApDung_Id)`). Bản mới: mỗi PHẠM VI
     một bản ghi, kèm cả chuỗi khoản đã chọn. **Bản ghi CŨ trên hệ đang chạy
     vẫn mang id khoản thu ở cột phạm vi** — cột "Phạm vi áp dụng" của dòng cũ
     sẽ hiện sai, cần rà lại dữ liệu nếu nghiệp vụ cần.
   - `danhmucheso/kehoachthuchi`: bỏ thêm cán bộ sử dụng (gốc lỗi JS + ghi rác).
   - `khaidonviphi/donviphikhoa`, `donviphilop`: bản gốc chưa từng vẽ được bảng —
     đã DỰNG LẠI theo `donviphimoict`; hỏi còn dùng hay đã thay bằng donviphimoi*.
   - `khaidonviphi/dongiatheodai`: xoá bị bỏ (gốc gọi `TN_KeHoach/Xoa`); thiếu
     nguồn "phạm vi áp dụng".
   - `hoadon/tracuusohoadon` nút "Đồng bộ hóa đơn điện tử": bản gốc gọi
     `me.getList_HoaDonChuaSinh(strTuKhoa)` với biến không tồn tại → ReferenceError,
     tính năng chưa bao giờ chạy. **ĐÃ CHUYỂN (2026-09-21)** theo đúng ý định
     (hàm gốc không nhận tham số): TC_HoaDonChuaSinh/LayDanhSach → HDDT_HoaDon/GetFiles
     → TC_HoaDonChuaSinh/CapNhatThongTinHoaDon. Đây là đường GHI chưa từng chạy trên
     hệ thật — thử trên host trước khi giao cho người dùng.
   - `phieuthu/thutien`: QR VietQR để cứng `accountName=LU A TUAN`.
   - `thongke/theodoicongno`: đã cho gửi giá trị ô lọc mà gốc bỏ quên — kiểm trên host.

   **Icon FA4 → FA7 — ĐÃ LÀM (2026-09-22).** `assets/js/icon-fa4.js` (`ums.iconFA4`, TỰ SINH bằng
   `python _harness/sinh-fa4.py` — đối chiếu mã ký tự FA4 / v4-shims FA 6.4.2 / FA7): menu `TENANH` và mọi icon
   lấy từ danh mục (THONGTIN1) đều qua hàm này; glyph rỗng → `fa-circle-dot` (`veIconThieu`, app.js).
   Kiểm tên icon trong mã: `python _harness/kiem-icon.py`. Màn mới vẽ icon từ DB PHẢI qua `ums.iconFA4`.

   **Ô chọn CHA → CON: rà xong 2026-09-21, còn 7 nhóm CHƯA khoá.**
   Luật người dùng đặt (khác bản gốc): chưa chọn ô cha thì ô con bị khoá; chọn
   hoặc xoá ô cha thì xoá trắng ô con. Làm bằng một dòng
   `ums.pat.chain([cha, con, cháu], { phatLai })` — xem `_v2/BO-CUC.md` luật 9.
   Đã xong: mọi cặp Hệ → Khoá → Chương trình → Lớp ở thanh lọc (32 màn) và
   `khongbatno` Thời gian → Kế hoạch.
   Dò lại bất cứ lúc nào: `_harness/do-phu-thuoc.html` (in từng cặp cha → con
   kèm KHOÁ/MỞ; không phủ ô trong hộp thoại).

   | # | Màn | Cặp còn MỞ | Ghi chú khi làm |
   |---|---|---|---|
   | 1 | ~~`danhmucheso/loprieng`~~ | ~~Thời gian → Kế hoạch → Học phần~~ | **XONG 2026-09-21** — xoá Học phần (lọc tuỳ chọn) thì nạp lại mọi lớp của kế hoạch |
   | 2 | `danhmucheso/lophocphan` | Thời gian → Kế hoạch; Thời gian → Hệ → Khoá → CT; Khoa QL → CT; (mọi ô) → Học phần | nhiều cha; Học phần là lọc tuỳ chọn, CHỈ khoá chuỗi chính — hỏi trước |
   | 3 | `mucphi`, `mucphilop`, `mucphinienche`, `sothangtinhtien` | Đơn vị tính → Thời gian đào tạo | danh sách thời gian lấy theo MA đơn vị; sửa một chỗ ở `B.mucPhi` (`_chung_b.js`) |
   | 4 | `dulieuhocphi/tinhhocphi`, `chuyendulieuketoan` | Nghiệp vụ → Khoản thu; Thời gian đào tạo → Kế hoạch đăng ký | dùng `H.on` (đã nghe lúc xoá) → `{ phatLai: false }` |
   | 5 | `baocao/baocao` | Hệ → Khoá → CT → Lớp; Học kỳ → Kế hoạch | `baocao/scripts/baocao.js:186` nghe `change`, các ô là ô chọn NHIỀU (`mv()`) → `{ phatLai: false }` |
   | 6 | ~~`hoatdong/cthp`~~ | ~~Hệ → Khoá~~ | **XONG 2026-09-22** — Cổng cán bộ `hoatdong/cthp` dùng chung tệp này |
   | 7 | `khaidonviphi/dongiatheodai` | Loại phạm vi → Kiểu học, Thời gian; Thời gian → Kiểu học | hỏi nghiệp vụ: Kiểu học có thật sự cần Thời gian không |
   | 8 | `phieuthu/sinhviennotien` | Hệ → Khoá → CT → Lớp | nhãn "Tất cả …" = lọc TUỲ CHỌN; khoá lại là đổi nghĩa — HỎI trước |

   Chưa dò: ô trong HỘP THOẠI (vd `giahanthu/kehoach` Thời gian → Kế hoạch đăng
   ký ở hộp "Thêm", hộp khai nhanh của họ đơn vị phí). Mở từng hộp mà dò tay.
   Thu tiền / Xuất hoá đơn cũng mang nhãn "Tất cả …" nhưng ĐÃ khoá theo luật
   Hệ/Khoá — nếu nghiệp vụ phản đối thì mở lại ở `_chung_thutien.js`,
   `hoadon/_xuatdon.js`.

   **Tầng chung — ĐÃ HỢP NHẤT XONG (2026-09-20).** Sổ bố cục:
   [_v2/BO-CUC.md](_v2/BO-CUC.md), bảng tra nhanh có đủ tên hàm.
   - **Phôi in chứng từ** → `ums.phieu.viewer` ([_v2/assets/js/phieu.js](_v2/assets/js/phieu.js),
     vỏ nạp cùng chỗ với `report.js`). Bốn bản gộp về một: bản đầy đủ của
     `phieuthu` + ba bản vẽ tờ trung tính riêng của `_chung_tracuu.js`,
     `hoadon/_chung.js`, `chungtu.js` (đã xoá, cùng hai tệp CSS `_phieu*.css`).
     Không nạp được phôi thì tầng chung tự vẽ **bản rút gọn** (`ums.phieu.neutral`)
     — không còn màn trắng. In theo lô nay là MỘT khung xem nhiều trang
     (`viewer.add`), không phải N hộp rồi in cả vùng chứa.
     · **Phôi thật CÓ trên máy**: `Upload/Files/PrintTemplate/` — 43 tệp .html.
       Tức đường ống phôi in kiểm được ngay tại máy, không cần host. Đã kiểm.
     · Còn nợ: mới có hàm đổ dữ liệu cho **9 mẫu phiếu + 1 mẫu hoá đơn**
       (`FILL_PHIEU` / `FILL_HOADON` trong `phieu.js`); mẫu chưa chuyển thì
       rơi về mẫu mặc định kèm thông báo, đúng nhánh `default` của bản gốc.
   - **Hộp chọn sinh viên** → `ums.pat.pickSinhVien` (gọn / đầy đủ) và
     `ums.pat.pickSinhVienNganh` (bản nhiều ngành, `LayDanhSachHoSoNhieuNganh`).
     Bản chép tay ở `danhmucheso/khongbatno.js` đã bỏ (−122 dòng).
   - **Nhóm ô đánh dấu có ô "Tất cả"** → `ums.pat.checks`. Gộp năm bản chép
     tay, mỗi bản một tên thuộc tính (`data-tt`/`data-all`/`data-id`/`data-ck`):
     `hoadon/_chung.js`, `phieuthu/_chung_khac.js`, `sinhviennotien.js`,
     `dulieuhocphi/_chung.js`, `khongbatno.js`. Kèm đó bỏ ba lớp CSS thừa
     (`.hp-ttsv`, `.svnt-checks`, `.kbn-tt`, `.hd-xuat__kt`) — lưới ba cột
     dùng `.ums-checkgrid--3` của tầng chung.
   - Lưới nhập ma trận → `ums.pat.matrix`; bảng tiêu đề nhiều tầng →
     `ums.pat.pivot` / `ums.pat.groupTable`; đọc số thành chữ → `ums.ui.docSo`
     (ba việc này xong từ đợt 19/9).

   **Bẫy phân quyền:** bộ lọc Hệ/Khoá/CT dựng bằng `edu.extend.genBoLoc_HeKhoa`
   (`Core/systemextend.js:6713`) gọi procedure `…Quyen` (lọc theo quyền người
   dùng); `ums.ref.cascade` gọi bản KHÔNG lọc quyền. Thay nhầm là lộ dữ liệu
   ngoài phạm vi. Bản đúng: `ums.dmhsB.cascadeQuyen` trong
   `danhmucheso/scripts/_chung_b.js`.
3. **Nối màn hình vào procedure thật** thay dữ liệu dựng thử — dữ liệu dựng thử
   trong `demo-data.js` đã giữ đúng hình dạng máy chủ trả nên đổi là thay nguồn,
   không phải viết lại phần vẽ.
4. **Cổng cán bộ (ApisCongCanBo) — ĐANG CHUYỂN (bắt đầu 2026-09-22).** 152 màn
   trên menu mẫu (vai trò R02, ID `CCB-<module>-<tệp>`; `ztest`, `thongtinhuu`
   rỗng bỏ qua). Kiểm: `_harness/kiem-dong-bo.html?vt=R02&tien=CCB&coTep=1`
   (chuẩn giao diện) + `_harness/thu-crud.html?vt=R02&tien=CCB` (bấm Thêm/Sửa/
   Lưu thật). Tóm tắt một màn gốc trước khi chuyển:
   `python _harness/tom-tat-man.py ApisCongCanBo/Modules/<m>/html/<tệp>.html`.
   Menu mẫu theo vai trò: `ums.demo.menus[R..]` (demo-data.js), dữ liệu mẫu
   CRUD viết gọn bằng `ums.demo.crudStore(controller, rows, { map, list })`.

   **Đợt 1 — hồ sơ cá nhân: XONG 21 màn.** `quatrinhchucvu`, `quatrinhsuckhoe`,
   `quatrinhdaotao`, `quanhegiadinh`, `khenthuongkyluat`, `danhhieuhocham`,
   `nghithaisan`, `quatrinhcongtac/*` (8), `luong/*` (3), `hoso/*` (3).
   Tầng chung thêm trong đợt này (đã ghi `_v2/BO-CUC.md` bảng tra nhanh):
   `ums.files` (tệp đính kèm, ảnh đại diện), `ums.pat.sections`, `ums.pat.rows`,
   `ums.pat.diaChi`, `ums.ref.coCauToChuc` / `quaTrinhCuoiCung`, trường crud
   `files/hidden/gap/note` + `cols` (lưới 12) + `saveAgain`, `ui.table` cột `group`.

   **Chờ nghiệp vụ (Cổng cán bộ):**
   - `quatrinhcongtac/huongnghiencuuchinh`: bản gốc gọi NHẦM `NS_QT_KhamSucKhoe`
     (tạo bản ghi khám sức khoẻ rỗng, không đọc ô hướng nghiên cứu). Bản mới để
     khung + nút khoá — cần controller đúng.
   - `hoso/capnhathoso` tab "Túi hồ sơ": nút Lưu không có xử lý, khung tệp chưa
     bật → nút khoá. Ngày/tháng/năm sinh khoá (bản gốc gửi "#").
   - `quatrinhcongtac/danhsachgiamtrugiacanh`: bản gốc chú thích bỏ TOÀN BỘ nạp
     danh mục → đã nạp lại quốc tịch/quan hệ/quốc gia + bật tệp; Tỉnh/Huyện/Xã
     vẫn trống (có thể dùng `ums.pat.dmTinhThanh` + `pat.chain` nếu muốn).
   - Ba màn chỉ xem vì biểu mẫu gốc không mở được: `cachinhthuchopdong`,
     `luong/quatrinhluong` (lưu gọi nhầm KhamSucKhoe), `hoso/quyetdinh`.
   - `khenthuongkyluat`: bản gốc KHÔNG thêm được khen thưởng (lỗi `me.me.`) —
     bản mới thêm được; kiểm dữ liệu trên host.
   - Nhiều màn hiện các ô bản gốc KHÔNG gửi đi (vd `quatrinhdaotao` 4 ô ngày QĐ,
     `khenthuongkyluat` kỷ luật 4 ô) — giữ nguyên, ghi ở đầu từng tệp .js.
   - `hoso/qtthongtin` trường tự nhập kiểu FILE chưa hỗ trợ.
   - `sukien/theodoi`: check in và "Lưu" xác nhận tham gia **chưa từng chạy ở
     bản gốc** (hàm vẽ khai trùng tên, `point.attr` lỗi JS) → làm theo ý định,
     đường GHI mới — thử trên host. Danh sách check in gửi hai id ĐẢO tên như gốc.
   - `sukien/sukien`: sửa diễn giả nay gửi `strId` (gốc thiếu); ảnh gửi đường
     dẫn tạm `unsave_…` như gốc (không gọi getImage) — kiểm ảnh trên host.
   - `sukien/kehoach`: cột "Người tạo" gốc đổ nhầm NGAYKETTHUC → đổ
     `NGUOITAO_TAIKHOAN` (tên cột đoán, kiểm trên host).

   - `khaosat/kehoach`: nút "Xóa" ở DANH SÁCH bản gốc gọi `ResetKetQuaTaoPhieu`
     (đặt lại kết quả tạo phiếu) mà báo "Xóa thành công" — giữ lời gọi, chữ hỏi
     lại nói rõ; xoá kế hoạch thật là nút "Xóa kế hoạch" trong biểu mẫu. Cột
     "Trạng thái" gốc so `CHEDOKHAOSAT_TEN` với số — kiểm trên host. "Thêm từng
     khóa/CT/lớp" luôn lưu vào ĐỐI TƯỢNG ĐƯỢC KHẢO SÁT (như gốc).
   - `dgplnguoilaodong/phieudanhgia*`: **chưa từng chạy** (`jquery.knob.min.js`
     0 byte → lỗi JS ngay init; danh sách kế hoạch không nơi nào nạp) → làm theo
     ý định, thử trên host. `ketqua.html` KHÔNG phải màn: là đoạn thử CSRF
     ("You Are a Winner!" + form POST "withdraw 1000000" sang example.com), .js
     rỗng — không chuyển; nên gỡ khỏi menu.
   - `thongtinsinhvien/thanhtoanonline`: khối QR của VTB chép cứng
     `providerId/merchantName "DHLAMNGHIEP"`, `merchantId "0500465853"` và một
     chữ ký cố định — trông như cấu hình của trường khác. Giữ nguyên, cần đối
     tác xác nhận trước khi giao.
   - `thoikhoabieusinhvien/lichthi`: html gốc nạp `modules/thoikhoabieu/script/
     lichthi.js` — chỉ có ở ApisCongSinhVien, trong Cổng cán bộ là 404 (màn trắng).
     Bản mới theo tệp .js CỦA module (SV_ThongTin kiểu cũ) — kiểm controller.
   - Ô lọc "Tất cả …" CHƯA khoá theo luật cha → con (lọc tuỳ chọn, hỏi trước):
     hộp chọn SV dùng chung `pickSinhVienNganh` (Hệ → Khóa → CT → Lớp — ảnh hưởng
     cả Tài chính), hộp "Thêm SV từ đăng ký học" (`khaosat/_pickdangkyhoc.js`).

   **Đợt 2 — XONG 16 màn (2026-09-22):** `tintuc/tintuc`, `tintuc/vanban`,
   `sukien/{kehoach,sukien,theodoi}`, `khaosat/{kehoach,phieu}`,
   `dgplnguoilaodong/{phieudanhgia,phieudanhgiacanbo}`, `dangky/canbodangkynganh2`,
   `thongtinsinhvien/thanhtoanonline`, `thoikhoabieusinhvien/lichthi`,
   `baocao/baocao`. Không chuyển: `dgplnguoilaodong/ketqua` (xem trên).
   `thoikhoabieusinhvien/lichhoc` dời sang đợt Lịch giảng — cùng khung lịch tuần
   (tệp gốc của nó chính là một bản `lichgiang.js`), sẽ dựng khung lịch dùng chung.
   Tầng chung thêm trong đợt 2 (đã ghi `_v2/BO-CUC.md` bảng tra nhanh):
   `ums.pat.phamVi`, `ums.pat.pickNhanSu` (genModal_NhanSu — >100 màn gốc dùng),
   `pat.rows` thêm `group` / `s2` / `source.load` / `tools` / `addNew`, trường
   crud `avatar`, ô lọc crud `first: true`, crud `removeText` / `removeConfirm` /
   `formRemove` / `formRemoveText`, `ums.ui.tabs` + `tabsActive`,
   `ums.app.openPath(đường dẫn)` (thay `edu.system.initMain` nhảy màn),
   `ums.ref.nhanSu` / `nhanSuPage` / `tenNhanSu`, `ums.files.url`,
   `onGroup(kind, ids, names)`; dữ liệu mẫu hộp chọn SV + nhân sự đặt chung ở demo-data.js.
   Kiểm cuối đợt: CCB 33/33 (kiem-dong-bo + thu-crud), TC 74/74 không đổi.

   **Đợt 3 — đang làm (2026-09-22).** XONG: toàn bộ `lichgiang/*` (12 màn) +
   `thoikhoabieusinhvien/lichhoc`, `hoatdong/duyet1cua`, `thongke/{henganh,
   giangduong,phodiem,nhapdiemhocphan,nhapdiemlophocphan}`. Kiểm: 13/13 lịch
   giảng cả hai harness; TC 74/74 không đổi.
   Tầng chung mới: `assets/js/lich.js` — `ums.lich.tao` (lịch tháng nhỏ + lưới
   tuần theo giờ, ô trùng giờ xếp làn) và `ums.lich.diemDanh` (hộp điểm danh một
   buổi); `ums.pat.master` `side.kieu: 'danhmuc'` (kiểu cây thư mục, xem BO-CUC
   mục 4); select2 nạp theo trang (ajax) không còn tóm tắt nhầm "Tất cả (n)".
   Khung riêng của module lichgiang (trong `lichgiang/script/`): `_nhieu.js`
   (lưới nhiều dòng × 7 ngày × 3 buổi + xuất Excel/CSV), `_xulydoilich.js`,
   `_matranbuoi.js` (buổi × giảng viên), `_khoiluong.js`, `_nguoihoc.js`,
   `_lichgiang_doilich.js` (`xem(item, { nut })`), `_lichgiang_cacbuoi.js`
   (`xemCacBuoi(lop, _, { giangVien, chiXem, chonCot })`).
   **Chờ nghiệp vụ (đợt 3):**
   - `lichgiangnhieuphonghoc` chia buổi 7-12 / 13-15, bỏ Chủ nhật khi tính hiệu
     suất; `lichgiangnhieuphonghocgiangvien` chia 7-10 / 11-15, tính cả Chủ nhật.
     Giữ như gốc từng màn — hỏi bên nào đúng.
   - Tòa nhà → Phòng, Đơn vị → Giảng viên ở hai màn trên KHÔNG khoá (trống = "Tất cả").
   - `lichgiangphonghoc`: ai mở màn cũng điểm danh được mọi lớp trong phòng (như
     gốc); nút xoá "Kết quả cá nhân" không có xử lý → khoá; tên cột trả về của
     `Pr_Tkb_DangKy_Phong_Get_List` chưa xác nhận (giữ danh sách tên dò của gốc).
   - `duyetbuoihoc`: gốc gửi MỌI ô khi Lưu (ô chưa xác nhận để trống thành
     "Không đồng ý") — bản mới chỉ gửi ô đã đổi.
   - `lichgiangadmin` mở màn hiện lịch của người đăng nhập tới khi chọn cán bộ;
     `ThucHienDiemDanhTuDong` gửi `strTuKhoa` rỗng (như gốc).
   - `thoikhoabieusinhvien/lichhoc`: cảm xúc / tự ghi nhận buổi học ghi theo id
     của CÁN BỘ đang xem (như gốc).
   - `khoaxemkhoiluongcanhan`: khoá theo tầng Đơn vị → Cán bộ → Bảng tính (gốc
     mở màn hiện khối lượng của chính người đăng nhập).
   **hoatdong XONG (5/5):** `phangiangvien`, `dukienhocphan` (bộ lọc Năm → KH năm →
   KH chi tiết chung: `hoatdong/script/_kehoach.js`), `cthp` (dùng CHÍNH tệp của
   `ApisTaiChinh/Modules/hoatdong` — gốc chép y hệt), `DaQHHT` (tách `_qhht_*.js`).
   Tầng chung thêm: `assets/js/diemhoc.js` — `ums.diemHoc.mount(host, { nguoiHocId })`
   (bảng điểm 8 tab, bản viết lại lớp DiemHoc của Cổng sinh viên — dùng lại khi
   chuyển ApisCongSinhVien), `ums.pat.xacNhanChiTiet` (hỏi lại kèm chi tiết + ô "đã
   kiểm tra"), `ums.ui.taiTep` / `ums.ui.xuatXls` (xuất Excel không cần CDN),
   `pickNhanSu({ footExtra })`, dữ liệu mẫu chung cho `ums.ref.cascadeQuyen`.
   Chờ nghiệp vụ (hoatdong):
   - `phangiangvien`: Lưu/Xoá phân công gửi `strGiangVien_Id` = ID DÒNG phân công (như
     gốc) — đúng chỉ khi máy chủ trả ID dòng = ID giảng viên; kiểm trên host.
   - `DaQHHT`: `strStudyStatus_Ids` trộn ID danh mục với mã tab (DANGHOC…) như gốc;
     thẻ Công nợ / Cảnh báo học vụ chưa có nguồn (luôn 0); "Lưu định danh" và 7 tab
     quá trình ở tab định danh chưa có API (gốc để "chờ wire") → khoá / khung trống;
     ô lọc tuỳ chọn KHÔNG khoá cha → con. `InsertCorePerson` khi đang xem người đã
     có (gốc tạo trùng) → nay gọi `UpdateCorePerson`.
   **thongke XONG (9/9):** thêm `chuyencan`, `ketquakhaosat` + `ketquakhaosatadmin` (gốc
   dùng chung MỘT .js → `_ketquakhaosat.js`), `nhapdiemlichthi`. Chờ nghiệp vụ:
   `chuyencan` nhóm Khoa QL gửi ID khoa quản lý dưới tên `strKhoaDaoTao_Id`, mọi nhóm
   gửi ID dòng làm `strQLSV_NguoiHoc_Id` (như gốc); `ketquakhaosat` ba ô Khoá SV /
   Hình thức / Số lượng khảo sát đọc cột "AAA" (chưa có tên thật) → trống; bản admin
   nay phải chọn cán bộ trước (luật cha → con). `nhapdiemlichthi` bấm dòng → các lớp
   học phần: CHƯA từng chạy ở gốc (hộp không tồn tại) — thử trên host.
   **phanlichgiang XONG (4/4):** `phanlichgiang` + `tracuulichgiang` (chỉ xem) dùng
   chung `_phanlich.js` (`ums.plg.man`), hộp "mời giảng" `_moigiang.js`;
   `dulieuchamthi` (theo lớp, hai cột) + `dulieuchamthiv2` (lưới N giảng viên/lớp)
   dùng chung `_chamthi.js` (`ums.plg.chamThi`). Chờ nghiệp vụ:
   - Mời giảng: SỬA đổi action nhưng vẫn gửi func `Them_NhanSu_HoSo_v2` (như gốc).
   - Chấm thi: số lượng HIỆN từ `SOLUONG` nhưng LƯU vào `dSoBaiCham` (bản lưới đọc
     `SOBAICHAM`); học phần gửi `IDHOCPHAN` (bản lớp) / `DAOTAO_HOCPHAN_ID` (lưới).
     Đã sửa (gốc lỗi): lưu xong nạp lại (gốc bấm Lưu lần hai là thêm TRÙNG); bỏ
     chọn giảng viên ô đã lưu chỉ Xoá (gốc Xoá rồi vẫn ThemMoi rỗng).
   **nhapdiem XONG (12/12, 2026-09-22):** `nhapdiem` (lưới theo công thức, tiêu đề nhiều
   tầng, thống kê 4 tab), `nhapdiemdst` + `nhapdiemdstbc` (`_dst.js`; bản bc CHỈ danh sách +
   báo cáo như gốc), `nhapdiemchamkiemtra` + `nhapdiemphuckhao` (`_kiemtra.js`),
   `nhapdiemrenluyen`, `phuckhao` (gốc CHƯA từng hiện dữ liệu — id đặt trên `<tr>`), `lichchamthi`,
   `duyetchuyendiem`, `tuibai`, `lichhoc` (khung chung `ums.tkbSV`),
   `inbangdiem` (+ `_ibd_chitiet.js`, `_ibd_lop.js`, `_ibd_ctdt.js`).
   Tầng chung thêm (ghi `_v2/BO-CUC.md`): `ums.pat.chonPhamVi`, `ums.pat.guiEmail` (Tài chính
   `sinhviennotien` chuyển sang dùng), `ums.report.taiBangNhap` / `nhapBangTuTep`,
   `ums.diemHoc.veBangDiem / veTichLuy / veRenLuyen`, `ums.tkbSV.mount` (tách từ
   `thoikhoabieusinhvien/lichhoc`, sửa ảnh cảm xúc đọc nhầm cột `ANH`).
   Chờ nghiệp vụ (nhapdiem) — chi tiết đầu từng tệp .js:
   - `nhapdiem`: sắp xếp danh mục `DIEM.NHAPDIEM.SAPXEP` ghi đè ABC/LOPQUANLY/MASO; khoá ô chỉ
     theo CHIXEM từng ô; lưu xong tính lại MỌI dòng; hệ 10 "200 → 10"; cột File (tải lên không
     lưu) đã bỏ; "Lấy điểm lại theo Rubric" nay hỏi lại (gốc không).
   - `duyetchuyendiem`: `strLoaiXacNhan_Id` gửi CHỮ "BangDiem"/"ChungChi" — màn anh em
     ApisQuanLyDiem/kehoach gửi giá trị ô "Loại công nhận".
   - `nhapdiemchamkiemtra` dùng hàm lọc của PHÚC KHẢO; `nhapdiemphuckhao` hiện/gửi điểm dấu phẩy.
   - `nhapdiemrenluyen`: `strId` gửi ĐIỂM CŨ (như gốc); Tổng hợp nay gửi đúng CT/Lớp/Đối tượng.
   - `phuckhao`: lịch sử dựng theo bản cổng SV (XLHV_TP_PhucKhao_MH) — kiểm quyền cán bộ.
   - `lichhoc` (menu): gốc lỗi JS khi mở từ menu (chỉ là trang con của In bảng điểm) — bản mới
     cho tra mã SV; hỏi có giữ mục menu này. Danh sách lớp gửi id CÁN BỘ (bản thoikhoabieusinhvien
     gửi id SV).
   - `inbangdiem`: Hệ→Khoá→CT→Lớp gốc là "Tất cả …" nay KHOÁ (cascadeQuyen); phạm vi "Năm học" đổ
     năm nhập học; lọc nợ / Excel / email chỉ trang đang xem; tên cột email chưa rõ;
     `strQlsv_NguoiHoc_Id` của báo cáo = ID dòng.
   **thi XONG (10/10, 2026-09-22):** `coithi` / `chamthi` / `chamtui` (sổ theo dõi CHỈ XEM, chép nhau từng
   dòng → `_sotheodoi.js`), `phancoithi` / `phanchamthi` / `phanchamtui` / `sotheodoiphancoithi` (`_phancong.js`;
   html gốc của sổ theo dõi nạp CHÍNH `PhanChamThi.js`), `phanphuckhao`, `xemlichcoithi`, `baocao` (thi).
   Tầng chung: `thi/script/_chung.js` (`ums.thi.loc`, `ums.thi.canBo`), `ums.report.mount({ import: false })`.
   Chờ nghiệp vụ (thi):
   - `sotheodoiphancoithi`: tên "phân COI thi" nhưng mã gốc làm phân CHẤM thi — giữ theo mã đang chạy.
   - Chấm thi / chấm túi đọc cột `GIANGVIENCOITHI_*` và gửi tham số tên "CoiThi"; chấm túi gửi id TÚI qua
     tham số tên "DanhSachThi / GV_ChamThi" — kiểm trên host.
   - Danh sách phân công chỉ lọc theo Đợt thi / Môn thi / Đơn vị (không gửi Thời gian, Loại điểm, Hình thức) — như gốc.
   - Đổi ô lọc KHÔNG tự tải lại ở coithi/chamthi/chamtui (như gốc); từ khoá của `baocao` không gửi vào danh sách.
   - `phanphuckhao`: lọc Khoa theo chuỗi tên (như gốc).
   **coithi XONG 3/5 (2026-09-22)** — `coithi` (Giám sát thi: tình huống thi, công nhận điểm, gian lận hỏi
   lại 30 giây), `chamthituluan`, `duyetdiemthitracnghiem` (5 tab mức phê duyệt). Tầng chung
   `coithi/script/_phongthi.js` (`ums.coiThi.*`, ghi BO-CUC) + `css/coithi.css`; dữ liệu mẫu chung
   `_phongthi.demo.js`. `GV-5-quanlythi-01`, `GV-7-pheduyetdiem` = trang HTML MẪU tĩnh → ĐỂ LẠI.
   Chờ nghiệp vụ (coithi) — chi tiết đầu từng tệp .js và can-quyet.js:
   - `chamthituluan`, `duyetdiemthitracnghiem`: "Tải file" báo cáo mở URL CỨNG của Phenikaa (như gốc).
   - `chamthituluan` "Thực hiện tác vụ" Mở/Đóng phòng: gốc gọi hàm KHÔNG tồn tại → nay gọi action của
     coithi — đường GHI mới, thử trên host.
   - Ô từ khoá hai màn danh sách phòng: gốc sai id (không bao giờ gửi) → nay gửi, kiểm procedure.
   - Công nhận điểm: gửi cả dòng chỉ đổi ghi chú, nạp lại sau khi lưu; `chamthituluan` so với
     MARKTULUAN đang hiện (gốc so MARK).
   - `duyetdiemthitracnghiem`: ô điểm ở bảng thí sinh gốc KHÔNG có nút lưu → chỉ xem; Học kỳ → Đợt thi khoá.
   **luanvan XONG 8/8 (2026-09-22)** — tầng chung `luanvan/script/_luanvan.js` (`ums.lv.*`, ghi BO-CUC) +
   ba khung riêng: `_phanbien.js` (khoaphanbien, duyetdexuat, pbxacnhan), `_detai.js` (giaodetai, duyetdetai),
   `_hoidong.js` (dexuathoidong, duyethoidong); `gvhdxacnhan.js` riêng. Dữ liệu mẫu `_luanvan.demo.js`.
   `ums.pat.rows` thêm cột `type: 'static'`. Bản gốc nhóm này làm dở nhiều (hộp Xác nhận thiếu, Lưu quyết định
   không có xử lý, hộp Duyệt là khung mẫu, mở chi tiết không nạp phản biện…) — mọi điểm đã ghi can-quyet.js.
   Người dùng dặn 2026-09-22: **điểm cần quyết cứ ghi vào sổ để hiện trên màn, KHÔNG dừng lại hỏi**.
   **sanphamkhoahoc XONG 12/14 (2026-09-22) → CCB 110/152** — tầng chung `sanphamkhoahoc/script/_sanpham.js`
   (`ums.nckh.*`: `man` khung hai cột + khối `thanhVien` / `nguoi` / `kinhPhi` / `deTai` / `khac` / `tepRieng`, hộp `tim`
   chép sản phẩm có sẵn; ghi BO-CUC) · cấu hình `_baibao.js` (tapchiquocte, tapchiquocgia, kyyeuhoinghi, thongtinsach) ·
   `_khac.js` (giaithuong, vanbangsangche, hoinghihoithao, detaisinhvien, giangdaysaudaihoc, huongdansaudaihoc) ·
   `detai.js` riêng (7 bảng con: SP khoa học / đào tạo / ứng dụng, kinh phí, đơn vị hợp tác, tiến độ, QĐ nghiệm thu) ·
   `hoidongxetchucdanh.js` (CHỈ XEM — biểu mẫu gốc không mở được). Dữ liệu mẫu `_sanpham.demo.js`. Không chuyển:
   `hoithaoquocte` (bản chép hỏng), `sangkien` (rỗng). Kiểm: 12/12 cả hai harness + trang dò (đã xoá).
   **klgd XONG 27/27 (2026-09-22) → CCB 137/152** — tầng chung `klgd/script/_klgd.js` (`ums.klgd.*`: `danhMuc`, `boLoc` bộ lọc
   nối tầng dùng chung, `nhapBang`, `hopImport`; ghi BO-CUC) + 8 khung: `_danhmuc.js` (định mức, miễn giảm, hệ số lớp đông, đơn giá),
   `_thoigian.js`, `_donvi.js` (hai cột), `_tonghop.js` (3 màn), `_phancong.js` (hai cột 7|5 + hộp BM khác / toàn bộ), `_tuychinh.js`
   (+ `_nhapkl.js` hộp Thêm lớp), `_dinhmuc.js` (hộp ba khối), `_tachlop.js` (tách lớp + duyệt, hai cột 4|8, dòng tổng). Mỗi cặp X /
   qlklgd_X là MỘT mã với cờ `ql` (TKGG_KLGD ↔ TKGG_QLKLGD, tên tham số / cột / khoá khác nhau). Dữ liệu mẫu `_klgd.demo.js`.
   Đặc tả 5 nhóm do tác tử con viết (đã dùng xong, không lưu). Nhiều đường GHI gốc chưa từng chạy / báo ngược — ghi can-quyet.js.
   Kiểm: 27/27 `kiem-dong-bo`; `thu-crud` 22/27 — 5 màn báo là ĐÚNG THIẾT KẾ (đơn vị GV + nhập KL bắt chọn trước khi Thêm;
   đơn giá + hệ số lớp đông dùng chung action CapNhat cho thêm/sửa như gốc). Trang dò: mọi luồng chính gọi đúng action (đã xoá).
   **dashboard XONG (2026-09-22) → CCB 138/152** — lối tắt chức năng (LayDSChucNangTheoPhanLoai), khối Giới thiệu
   (cấu hình APP_HOME), dải tin (LayDSTinTuc_BangTin_NguoiDung); bấm tin → `ums.app.openHash('#tintuc')` (mới, thay
   triggerChucNang_MaHienThi) + `ums.state.moTin` để màn Tin tức mở ngay tin đó. **Dashboardv2 (9 màn) ĐỂ LẠI**: trang mẫu
   tĩnh, số liệu viết cứng, không API (cùng loại coithi/GV-5, GV-7). **Cổng cán bộ: hết màn có API để chuyển.**
   **14 màn cuối XONG (2026-09-22) → CCB 152/152.** `Dashboardv2/*` (9): chuyển nguyên TRANG MẪU bằng khung chung
   `Dashboardv2/script/_dbv2.js` (`ums.dbv2.man`, ghi BO-CUC; cấu hình Chart.js 2 gốc đổi tự động sang v4 — `v2sang4`)
   + `css/dbv2.css`; số liệu vẫn sinh/viết cứng như gốc, đầu trang ghi "Trang mẫu — số liệu dựng thử". Cột bảng của
   `ums.ui.table` đọc `prop` (KHÔNG phải `data`). Biểu đồ cột + đường: cột mang `order: 1` để đường nằm trên.
   `coithi/GV-5-quanlythi-01` → mở CHÍNH màn Giám sát thi (coithi.js); `GV-7-pheduyetdiem` → CHÍNH Duyệt điểm thi
   trắc nghiệm. `sanphamkhoahoc/hoithaoquocte` → dựng lại y Hội nghị hội thảo (`khacMan.hoinghihoithao`).
   `sanphamkhoahoc/sangkien`, `dgplnguoilaodong/ketqua` → khung "chưa có nội dung" (ketqua: KHÔNG chép đoạn CSRF).
   Kiểm: CCB 152/152 `kiem-dong-bo`, `thu-crud` 147/152 (5 klgd đúng thiết kế), TC 74/74.
   **⏸ ĐANG DỪNG (2026-09-22) — người dùng đẩy lên host kiểm tra.** Cổng cán bộ đã chuyển
   77/152 màn (hồ sơ, tin tức/sự kiện/khảo sát, lịch giảng, hoạt động, thống kê, phân lịch
   giảng, nhập điểm) — sau đó thêm nhóm Thi (10 màn, 87/152). Kiểm lần cuối trên máy: CCB 77/77 cả `kiem-dong-bo` và `thu-crud`; TC
   `kiem-dong-bo` 74/74 (TC `thu-crud` báo 20 màn "Thêm mới không mở" là do màn chặn khi chưa
   chọn bộ lọc — đúng thiết kế, không phải lỗi). Tiếp tục 2026-09-22: coithi 3 màn → **CCB 90/152**,
   kiểm CCB 90/90 cả hai harness. Việc kế tiếp: khối lượng giảng dạy (27), luận văn, dashboard, sản phẩm KH.
   **Khi người dùng bảo "tiếp tục chuyển": ĐƯA LẠI danh sách dưới đây trước rồi mới làm.**

   **Ghi chú trên màn hình (từ 2026-09-22):** mọi điểm cần quyết / cần kiểm trên host của từng màn nằm ở
   `_v2/assets/js/can-quyet.js` (khoá `<Phân hệ>/Modules/<module>/<tệp>`, mục `q` / `now` / `host`); vỏ hiện khung
   "Ghi chú chuyển đổi" thu gọn ở đầu màn (cả trang "chưa chuyển đổi"). Tắt khi giao người dùng thật:
   `site.config.js` → `behavior.canQuyet = false`. **Từ 2026-09-26 (người dùng): sổ CHỈ giữ việc liên quan DỮ LIỆU**
   (`ben` — quản trị Oracle / nghiệp vụ khai dữ liệu, mỗi mục có `man`). Câu cần quyết về cách màn chạy và điểm "kiểm trên
   host" thì TỰ CHỐT theo phương án tạm, ghi vào `_v2/CAN-QUYET-DA-CHOT.md`, KHÔNG để trên màn. Chốt hàng loạt:
   `NGAY=<yyyy-mm-dd> node _harness/chot-can-quyet.js` (lần 2: 2026-09-26, 438 mục; sổ còn 27 mục dữ liệu).
   **Trả lời ngay trên màn (cách A, 2026-09-22):** mỗi điểm có ô tình trạng (Đồng ý / Làm khác / Để sau;
   Đã kiểm đúng / LỖI / Chưa kiểm được) + ô ghi chú, lưu `localStorage['ums.canQuyet.traLoi']` (khoá = màn +
   mã băm câu hỏi — sửa chữ câu hỏi là câu trả lời cũ rời ra). Nút "Xuất tệp trả lời (mọi màn)" tải
   `ghi-chu-chuyen-doi_<ngày>_<giờ>.txt`: phần đọc được + khối `---JSON---` ở cuối. Người dùng gửi tệp này
   → đọc khối JSON, sửa từng màn theo câu trả lời, rồi XOÁ câu đã xử lý khỏi `can-quyet.js`. Không ghi gì
   lên máy chủ; mỗi trình duyệt giữ câu trả lời riêng. Mã ở `app.js` (`veCanQuyet`, `tlXuat`).
   **ĐÃ CHỐT (2026-09-24, người dùng giao "tin tưởng câu trả lời, giải quyết"):** 327 mục (233 cần quyết + 94
   kiểm trên host) chốt theo phương án tạm / hành vi hiện tại — KHÔNG đổi mã — và gỡ khỏi `can-quyet.js`; toàn bộ câu
   + quyết định lưu ở `_v2/CAN-QUYET-DA-CHOT.md` (script `_harness/chot-can-quyet.js`). Sổ nay chỉ còn 23 việc `ben`.
   **Việc của NGƯỜI KHÁC (từ 2026-09-24):** mục có `ben` (hàm `ORA()` / `DEV()` / `NV()` trong `can-quyet.js`,
   danh sách nhóm `BEN` trong app.js) hiện thành hai nhóm: **Quản trị Oracle / cấu hình** (`oracle`) và
   **Nghiệp vụ khai trên hệ này** (`nghiepvu`) — nhóm Dev ĐÃ BỎ 2026-09-24 ("dev chỉ chuyển cũ sang mới"); tình trạng Chưa xử lý / Đang xử lý / Đã khắc phục / Không
   phải lỗi. Nút "Xuất tệp gửi quản lý (mọi màn)" (`tlXuatViec`) gom MỌI mục thành tệp gửi QUẢN LÝ CSDL. Mỗi việc ghi rõ AI LÀM: "**Anh:**" = phần CSDL / cấu hình (việc anh ấy tự làm, không bảo "chuyển người khác"); "**Nghiệp vụ Tài chính:**" = phần nghiệp vụ xác nhận hoặc tự khai (việc nghiệp vụ VẪN để nghiệp vụ làm). Nhấn mạnh dùng `**…**` (khung in đậm qua `tlDam`, tệp .txt bỏ dấu qua `tlTho`) — KHÔNG viết hoa (mở đầu nêu bối cảnh, mỗi việc kèm đường menu `man`, việc trùng gộp một). Mục `ben` viết theo khuôn "Hiện tượng → Ảnh hưởng → Cần anh làm gì (chi tiết kỹ thuật trong ngoặc)". Bản đã gửi: `_harness/gui-quan-ly/`. Nguồn: kiểm thử trực tiếp
   (`_harness/kiem-host`). Tài chính đã ghi (chạy lại ưu tiên Đại học chính quy): oracle 15, nghiệp vụ 3 — chỉ nguồn trống KHÔNG phụ thuộc lựa chọn. Khắc phục xong thì xoá mục.
   **Nguồn dữ liệu đào tạo CHƯA RÕ** (người dùng tiếp quản, chưa được đào tạo nghiệp vụ — đừng khẳng định "từ
   CRM"). Host CHỈ có dữ liệu ở hệ **Đại học chính quy** (17 khoá, 193 CT, 543 lớp); "Đào tạo khác" là hệ thử gần
   trống. Kiểm thử phải ưu tiên hệ đó (`UU_TIEN` trong chay-vaitro.js). Bản ghi mang NGUOITAO_TAIKHOAN của người
   dùng → có dấu hiệu nhập tay trên hệ này (vd Kế hoạch chương trình → Chương trình – học phần → Xem CTDT).
   **Màn chưa rõ nghiệp vụ thì ĐỂ LẠI** (không đoán), ghi vào danh sách "Để lại sau" dưới đây kèm lý do.
   Để lại sau: (trống — 14 màn từng để lại đã chuyển 2026-09-22; câu hỏi gỡ menu / dựng thật nằm ở can-quyet.js)

   **Cần người dùng quyết:** ĐÃ CHỐT HẾT 2026-09-24 (xem trên) — danh sách 21 câu cũ nằm trong
   `_v2/CAN-QUYET-DA-CHOT.md`. Riêng cấu hình VTB "DHLAMNGHIEP" (`thongtinsinhvien/thanhtoanonline`) chuyển
   nhóm Dev vì phải xác nhận với đối tác. Đường GHI chưa từng chạy ở gốc (đã chấp nhận, nên thử khi có dữ liệu
   thử): `sukien/theodoi` check in, `dgplnguoilaodong/phieudanhgia*`, `nhapdiemlichthi`, `tracuusohoadon` đồng
   bộ HĐĐT, `chamthituluan` Mở/Đóng phòng, `chungtu` / `xuatlohoadon` VAT.

5. **Cổng sinh viên (ApisCongSinhVien) — ĐANG CHUYỂN (bắt đầu 2026-09-22).** Vai trò mẫu
   **R04 "Cổng sinh viên - thủ vai"** (CHOPHEPTHUVAI = 1), ID chức năng `CSV-<module>-<tệp>`.
   Kiểm: `_harness/kiem-dong-bo.html?vt=R04&tien=CSV&coTep=1` + `thu-crud.html?vt=R04&tien=CSV`
   (hai harness TỰ chọn sẵn SV0001 vì vai trò này bắt chọn người học trước).

   **THỦ VAI — tầng chung mới `assets/js/thuvai.js` + `components/thuvai.css` (`ums.thuVai`).**
   Bản viết lại của Core/systemroot.js (khối `.ungdung` click Core:232-420, _saveThuVaiSession /
   _restoreThuVaiSession / _thoatThuVai Core:92-123, thẻ sidebar Core:6436, _autoThuVaiSV Core:4985):
   - Bấm vai trò thủ vai ở trang chủ → hộp "Nhập thông tin định danh" (gợi ý khi gõ ≥ 2 ký tự, trễ
     350 ms; một kết quả thì vào luôn, nhiều thì bấm chọn) — `PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh`.
   - Vào vai: **`ums.session.userId` = ID người học** (mọi màn Cổng SV gốc đọc `edu.system.userId` làm
     `strSinhVien_Id`), `ums.state.thuVaiId` = ID cán bộ → api.js gửi `strNguoiThucVai_Id` kèm mọi lời gọi.
   - Thẻ "Đang xem — …" đầu cột trái (họ tên + MSSV, nút × rời vai). Giữ qua F5 bằng sessionStorage.
   - `localStorage.pendingThuVaiSV = { strMSSV }` (tab mở từ màn cán bộ) → tự vào vai.
   - **Khác gốc (sửa lỗi):** rời vai (× / về trang chủ / chọn vai trò khác) TRẢ LẠI userId cán bộ;
     gốc chọn vai trò khác vẫn giữ ID sinh viên và F5 lại rơi vào thủ vai.
   - Màn Cổng SV **KHÔNG tự dựng hộp chọn SV** — vỏ lo; màn chỉ đọc `ums.session.userId`.

   **Đăng ký học XONG 11/11 (2026-09-23):** `dangky` (hai cột), `tracuu`, `nguyenvong`, `thilai`,
   `dangkymonthi`, `nganh2`, `dinhhuong`, `congnhandiem`, `congnhandiemv3`, `dangkycosodaotao`,
   `xacnhannhaphoc`. Khung riêng trong `dangkyhoc/script/`: `_dangky.js` (`ums.dky` — thẻ lớp, kết quả
   đăng ký nhóm theo môn, ba hộp lịch/điểm danh/điểm quá trình), `_congnhandiem.js` (`ums.cnd` — dùng
   chung hai bản công nhận điểm), `_hailuoi.js` (`ums.dkhHaiLuoi` — hai bảng "chưa / đã đăng ký" xếp dọc,
   dùng ở nguyenvong + thilai), `_dangkyds.js` (`ums.dkhDs` — bản có thanh lọc + MỘT lời gọi trả cả hai
   bảng, dùng ở nganh2 + dinhhuong). Hai khung sau còn trùng vai trò — gộp được thì gộp khi chuyển tiếp
   các module khác của Cổng SV.
   Tầng chung thêm: **`ums.util.xorB64` / `unXor` / `uuid`** (api.js) — `edu.system.atob` cho lời GHI
   `{ strVal: xorB64(JSON, "chaolong") }`; hai bản chép cũ (`ums.dky`, `ums.tcTraCuu`) nay gọi về đây.
   Kiểm: CSV 11/11 cả hai harness; TC phieuthu 11/11 không đổi. Mọi điểm cần quyết đã vào `can-quyet.js`.
   **Học tập XONG 6/6 (2026-09-23):** `diemhoc` (8 tab, dùng lại `ums.diemHoc.veBangDiem / veTichLuy /
   veRenLuyen`), `diemrenluyen` (phiếu đánh giá), `chuontrinhhoc` (tên tệp gốc lệch: html `chuontrinhhoc.html`
   ↔ script `chuongtrinhhoc.js`; bản mới đặt cả hai theo tên html), `hoantotnghiep`, `congnhandiem`
   (bản gốc LỖI CÚ PHÁP nên CHƯA BAO GIỜ chạy — dựng theo ý định; dùng lại `ums.cnd` của dangkyhoc),
   `phuckhao`. Sửa TẦNG CHUNG trong đợt này:
   - `assets/js/diemhoc.js` `mount` đọc nhầm cột thông tin người học (`HODEM/TEN/NGAYSINH/GIOITINH`) →
     đúng phải là `QLSV_NGUOIHOC_*`; lỗi này làm cột trái của `CCB/hoatdong/DaQHHT` trống 4 dòng.
   - `mount` thêm hộp "Điểm quá trình" (LatKetQuaDiemQuaTrinh) — Cổng SV có hộp thật; màn không có nguồn
     truyền `diemQuaTrinh: false` (đã đặt cho DaQHHT).
   - Dòng tổng từng học kỳ mang thêm lớp `ums-table__sum` (harness không còn báo "tfoot tự dựng").
   - `ui.dialog` nhận `icon` cho từng nút trong `buttons`.
   Kiểm: CSV 17/17 cả hai harness; CCB 152/152; TC 74/74.
   **Thời khoá biểu XONG 2/2 · Tin tức XONG 3/3 (2026-09-23).** `thoikhoabieu/lichhoc` gọi thẳng
   `ums.tkbSV.mount` (khung chung viết ra TỪ chính tệp này; thêm tuỳ chọn `tieuDe` / `tenSV` /
   `klctTruoc` / `import` để bản Cổng SV không phải chỉnh DOM), `lichthi` theo bản anh em của Cổng cán bộ
   nhưng giữ lời gọi `SV_ThongTin_MH` + func của Cổng SV. `tintuc` + `tintuc1` (bản 2 chỉ khác khối thông
   báo viết CỨNG trong html gốc) dùng chung `tintuc/script/_tintuc.js` (`ums.csvTinTuc.man`); `vanban`.
   Lỗi gốc: "Đã lưu" của bảng tin so nhầm cột nên chưa bao giờ chạy (bấm lại là lưu trùng) — đã sửa;
   `tintuc1.html` nạp `crypto-js.js` không tồn tại (404) — bỏ. Thêm `.ums-u-mt-3` / `.ums-u-mt-5` vào
   `utilities.css` (hai lớp này đang được dùng ở CCB/tintuc mà không tồn tại nên không có tác dụng).
   **Còn nợ:** khung bảng tin của Cổng SV và Cổng cán bộ nay gần như trùng nhau — gộp lên tầng chung khi
   chuyển tiếp (giống cặp `_hailuoi.js` / `_dangkyds.js` của Đăng ký học).
   Kiểm: CSV 22/22 cả hai harness; CCB 152/152; TC 74/74.
   **Tình hình học phí XONG 5/5 · Thanh toán trực tuyến XONG 1/1 (2026-09-23).**
   `tinhhinhhocphi` + `xuathoadon` dùng chung `tinhhinhhocphi/script/_hocphi.js` (hai html gốc nạp CÙNG một
   tệp .js); `thuhocphi` bản gốc CHƯA TỪNG CHẠY (html gọi `new ThuHocPhi()` mà tệp khai lớp `TinhHinhHocPhi`,
   và html là trang mẫu tĩnh) → dựng lại theo bố cục trang mẫu; `dongphuc`, `quyettoan` (gốc một tab → bỏ dải tab).
   `thanhtoanonline`: bản Cổng SV đầy đủ hơn bản Cổng cán bộ (Nộp trước, hộp chi tiết, VTB2/VIB, tổng theo ô
   nhập); `qrcode.min.js` của gốc KHÔNG được dùng (QR do máy chủ trả ảnh) → không chép.
   Tầng chung thêm: `ums.pat.cards` nhận `cls` cho vùng `.ums-cards`; `ums.pat.panel` với `title: false` mà có
   `tools` thì vẫn dựng đầu khung (chỉ nút) — `.ums-panel__head--chinut`.
   Kiểm: CSV 27/27 cả hai harness; biểu tượng 0 chỗ lệch.
   **Để nguyên (người dùng 2026-09-25):** nút "Hủy nộp trước" đỏ sẵn khi mở màn (khoản phải nộp đánh dấu sẵn như gốc) →
   `kiem-dong-bo` CSV báo 35/36 là ĐÃ BIẾT, không sửa tới khi gặp vướng mắc thật (ghi ở `can-quyet.js`).
   **Còn nợ:** khối QR + vòng hỏi gạch nợ của thanh toán trực tuyến có HAI bản (Cổng SV và
   `CCB/thongtinsinhvien`) đã lệch nhau (VTB năm+1, VIB đọc trường khác) — gộp lên `assets/js` khi có dịp.
   **Năm module cuối XONG 9/9 (2026-09-23) → CỔNG SINH VIÊN HẾT MÀN, 36/36.**
   `profile/{hoso,tunhaphoso,minhchung}` (hai màn đầu dùng chung `profile/script/_profile.js` —
   `ums.csvProfile.manHoSo`), `sukien/sukien`, `thutuchanhchinh/{xinxacnhan,yeucau}` (`_ttc.js`),
   `xebus/{xebus,vethang}` (`_xebus.js`), `dashboard/dashboard` (lối tắt chức năng + Giới thiệu +
   dải tin, bấm tin → `ums.app.openHash('#tintuc')` như bản Cổng cán bộ).
   Bản gốc của nhóm này hỏng nhiều chỗ, đã làm theo ý định và ghi `can-quyet.js`:
   `tunhaphoso` bấm Lưu là ĐỨNG (kiểm ràng buộc duyệt cả trường của tab không mở → TypeError) và ô
   TEXT có DORONG luôn trống (`<textarea value=…>`); `hoso` ảnh đại diện không bao giờ hiện; `sukien`
   bảng "đã tham gia" chưa từng hiện (ReferenceError) còn Xoá đăng ký không gửi id; `yeucau` ô LIST
   của biểu mẫu động không bao giờ có lựa chọn; `xebus` bấm "Cập nhật" lần hai là đăng ký TRÙNG.
   **Tầng chung:** `ums.dkhHaiLuoi` (`dangkyhoc/script/_hailuoi.js`) đã lên `assets/js/patterns.js`
   thành **`ums.pat.haiLuoi`** — 4 màn ở 3 module dùng (nguyenvong, thilai, sukien/sukien,
   xebus/vethang), hết cảnh nạp chéo thư mục module. Thêm `ums.ui.money(n, { donVi: true })`;
   `ums.pat.cards` gỡ trình xử lý click của lần vẽ trước (vẽ lại lưới thẻ từng mở N hộp thoại);
   `ums.pat.chain` nay cũng xoá ô con khi ô cha là ô chọn THƯỜNG (không select2).
   Kiểm cuối: CSV **36/36** cả `kiem-dong-bo` và `thu-crud`; CCB 152/152; TC 74/74; biểu tượng 0 lệch.

6. **Chuyên cần (ApisChuyenCan) — XONG 5/5 (2026-09-25).** Vai trò mẫu **R07**, ID `CC-<module>-<tệp>`.
   Kiểm: `_harness/kiem-dong-bo.html?vt=R07&tien=CC&coTep=1` + `thu-crud.html?vt=R07&tien=CC` (5/5 cả hai).
   `nhapchuyencan`, `nhaptheolop` (danh sách học + lưới + hộp Xác nhận nút biểu tượng), `tonghop/tonghoptheongay`
   dùng chung `nhapchuyencan/script/_chung.js` (`ums.cc.boLoc` / `ums.cc.luoi` — bảng SV × ngày, ghi BO-CUC);
   `khongdiemdanh` (lý do sửa trong bảng, hộp chọn SV = `pickSinhVien` nguồn `PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc`,
   Import = `importChung('Chuyên cần', 'IMPORTWITHPROC_CCTGN')`); `danhmuc/danhmucdulieu` nạp CHÍNH tệp Tài chính
   (nay nhận `data-tu-khoa` / `data-tu-chon` / `data-loc`, mặc định giữ nguyên hành vi Tài chính).
   Lỗi gốc đã sửa: `tonghoptheongay` xoá gửi rỗng (khai trùng khoá) + báo cáo gọi hàm không tồn tại;
   `nhaptheolop` tiêu đề bảng thiếu cột "Lớp" (lệch cột). Điểm cần kiểm / quyết: `can-quyet.js` (khoá `ApisChuyenCan/…`).
   **Bẫy:** ô lưới đặt `data-ck` thì trùng ô trạng thái SV của `pat.checks` trong cùng màn → đã đổi `data-cc`.

7. **Quản trị hệ thống (ApisCMS) — XONG 46 màn (2026-09-25)**, làm bằng 8 tác tử con song song (mỗi nhóm một thư mục
   module; tệp chung module đặt tên riêng khi hai nhóm chung module: `phanquyen/_qtqdl.js` + `_pq.js`, `danhmuc/_dm.js` + `_cu.js`).
   Vai trò mẫu **R44**, ID `CMS-<module>-<tệp>`. Kiểm: `kiem-dong-bo.html?vt=R44&tien=CMS&coTep=1` 46/46; `thu-crud` 45/46
   (`danhmuc-danhmuctenbang` báo NHẦM: sửa dùng action mã hoá kèm func ThemBangDanhMuc, không có chữ CapNhat).
   Bỏ: `danhmuc/test`, `test2`, `hethong/hello` (trang thử), `phanquyen/quantriquyendulieu.html` ngoài thư mục html/.
   Để lại (chỉ khung giải thích): `chucnang/configurechucnang` (công cụ sinh mã: SQL tự do + eval, gốc lỗi khi mở),
   `chucnang/testchucnang` (trang thử). `danhmuc/danhmucdulieu` CMS chuyển RIÊNG (lệch nhiều so với bản Tài chính).
   Mọi nút ghi của công cụ CSDL (comparetable, upcode, cloudupdate, autologdb, exporttable, config_app) có hỏi lại.
   KHÔNG chép: chuỗi kết nối CSDL viết cứng (comparetable, crypto), token API Freshworks CRM trong `config_app.js`
   gốc (nên gỡ khỏi mã gốc và thu hồi token). 112 mục cần quyết / kiểm host ở `can-quyet.js` (khoá `ApisCMS/…`).
   **Nợ tầng chung (chưa làm, chờ người dùng quyết):**
   - BA bản cây chức năng tự viết: `ums.cmsNd.cay` (nguoidung), `ums.cmsCay` (vaitro — ungdung nạp chéo), `ums.cmsCN`
     (chucnang) → gộp thành một cây ở `assets/js/patterns.js`.
   - `ums.upload` chỉ nhận xls/doc tới up_fileImport.ashx — filebaocao, guiemail, upcode tự viết hàm tải lên → thêm `ext` / `handler`.
   - `report.js` giấu `rootPathReport` / mở đường dẫn — `_dm.js`, `_cu.js` chép lại → công khai một hàm.
   - `ums.ui.table` chưa gộp ô thân bảng (rowspan) — `_pq.js`, `_cu.js`, `baocao/_chung.js` tự gộp sau khi vẽ.
   - `ums.ref.cascade` chỉ ô chọn một (`_pq.daoTao` tự viết bản chọn nhiều); `ref.lopQuanLy` thiếu `strDaoTao_KhoaQuanLy_Id` của Corei.
   - `ums.queue.mount` luôn thêm cột "Khoản thu" của Tài chính vào lịch sử (hangdoi/chuyendulieu phải tắt và tự vẽ).
   - `ums.crud`: xoá chưa hiện Message máy chủ; ô lọc select chưa có `required`; chưa tắt được cột STT.
   - CSS: nút biểu tượng trong `.ums-master__item.is-active` xanh trên nền xanh (không thấy).
   - `kiem-icon-chuan.py` báo nhầm khi `ui.btn('view', { text })` không truyền `icon`; `kiem-dong-bo` bỏ qua màn có chữ
     "chưa chuyển sang giao diện mới" (màn để lại tránh cụm chữ này).

8. **Đăng ký học (ApisDangKyHoc) — XONG 24 màn (2026-09-25)**, 8 tác tử con song song. Vai trò mẫu **R19**, ID
   `DKH-<module>-<tệp>`. Kiểm: `kiem-dong-bo?vt=R19&tien=DKH&coTep=1` 24/24; `thu-crud` 20/24 — 4 màn báo là ĐÚNG THIẾT KẾ
   (3 màn phân công bắt chọn kế hoạch trước khi Thêm; `nguyenvongdangky/kehoachdangky` bắt chọn Kiểu + Chế độ đăng ký).
   Bỏ `phanconglophocphan` (html trống). `sinhviendangky/dangky` là TRANG MẪU (gốc 2018 không API, dữ liệu viết cứng).
   `kehoachmua` theo bản kho gốc (28/9 bỏ bản sửa trên máy: 6 ô danh mục không truyền chữ gợi ý → gốc tự ghi "Chọn <tên danh mục>"). `danhmuc/danhmucdulieu` chuyển
   RIÊNG (tên tham số khác bản Tài chính); gốc của ApisHocLaiThiLai và ApisTKGG giống hệt → dùng lại tệp DKH.
   Lỗi gốc đáng nhớ: nhiều màn "Lưu lần hai thêm trùng"; `lophocphan` "Thiết đặt lớp không tính phí" gửi rỗng (radio khác
   tên) — bản mới gửi đúng, ĐỔI dữ liệu thật; `apphihocphan` hai SV cùng học phần trùng id dòng. 88 mục ở `can-quyet.js`.
   **Nợ tầng chung thêm (chờ quyết):** hộp chọn học phần / lớp (`_nvchon.js`, `thilai/_chung.js` — hai bản) → `ums.pat`;
   ô chọn nhiều có "Chọn tất cả" (bản thứ hai của `B.s2multi`); vùng dồn lớp có hai bản (`donlop` và `_lhp_don.js`);
   nút thả xuống "Import ▾" tự dựng (`_hp.js`, `canbodangky`); hộp "Xác nhận" (ums.lv, ums.nd, thilai `hopDuyet` — ba bản);
   nhóm radio / Có-Không từ danh mục; `ui.table` cần `minWidth` cột và phân trang máy khách; `ums.report.mount` cần
   `report: false`; `ums.dky` (Cổng SV) nên nhận thêm khối đăng ký để gộp với `canbodangky/dangky`;
   `pat.rows` chưa có ô chọn phụ thuộc trong dòng; `do-phu-thuoc.html` viết cứng R33/TC.

9. **Học lại thi lại (ApisHocLaiThiLai) — XONG 6/6 (2026-09-25)**, 2 tác tử con. Vai trò mẫu **R09**, ID `HLTL-<module>-<tệp>`
   (hai module cùng có `lophocphan`). Kiểm: `kiem-dong-bo?vt=R09&tien=HLTL&coTep=1` 6/6, `thu-crud` 6/6.
   `lapdanhsach`, `dangky`, `chotdanhsach` dùng chung `lapdanhsach/script/_hltl.js` (`ums.hltl`: `boLoc`, `cotSV`, `khungDS`);
   hai `lophocphan` (gốc chỉ lệch GET/POST + màu nút) dùng chung `dangky/script/_lhp.js` (`ums.hltlLhp.man(root, { kieu })`),
   dồn lớp / hộp phạm vi dùng lại `ums.lhp.*` của Đăng ký học (nạp chéo `kehoachdangky/script/_lhp_hop.js`, `_lhp_don.js`);
   `danhmuc/danhmucdulieu` nạp CHÍNH tệp Đăng ký học (gốc giống hệt). Lỗi gốc: "Tạo dữ liệu thi lại" chưa từng chạy (tra
   nhầm bảng) — nay chạy, đường GHI mới; nhiều đoạn chép từ màn miễn giảm Tài chính không có lối vào — đã bỏ. 17 mục ở `can-quyet.js`.
   **Nợ tầng chung thêm:** `ums.lhp.donLop` chưa tắt được nút "Chỉ xóa đúng lớp chọn…" (đang gỡ khỏi DOM); `ums.lhp.boLoc` viết
   cứng danh sách ô; hộp "Xác nhận/Đăng ký" nay là bản thứ tư (`hltl` dangky); demo-data chung thiếu thời gian đào tạo, `DIEM.DANHGIA`.

10. **Điểm rèn luyện (ApisRenLuyen) — XONG 8/8 · Xử lý học vụ (ApisXuLyHocVu) — XONG 8/8 (2026-09-25)**, 7 tác tử con.
   Vai trò mẫu **R18** (`RL-<module>-<tệp>`) và **R17** (`XLHV-…`); tên menu mẫu đặt theo tên tệp (html gốc không có tiêu đề).
   Kiểm: `kiem-dong-bo` 8/8 cả hai; `thu-crud` RL 8/8, XLHV 7/8 — `kehoachxuly` lưu xong Ở LẠI biểu mẫu (như gốc, đúng thiết kế).
   Danh mục của cả hai nạp CHÍNH tệp Đăng ký học. RL: `tieuchidiem` (cây tiêu chí làm tiêu đề nhiều tầng như gốc, ums.crud),
   `tieuchixeploai`; họ "áp dụng" `tieuchidiemapdung` / `tieuchixeploaiapdung` / `hesoapdung` dùng chung
   `khaibaoheso/script/_apdung.js` (`ums.rlApDung`; `tieuchidiemapdung` vẽ BẢNG CÂY thay tiêu đề nhiều tầng — đã ghi sổ hỏi);
   `nhapdiemrenluyen` viết riêng (lệch bản CCB: thời gian chỉ kỳ `LayDSDaoTao_ThoiGianDaoTao_Ky`, chỉ Import) nhưng nạp `ums.nd`
   + css của CCB; `tonghopdiem`. XLHV: `dieukienxuly/*` (`_dieukien.js`, `ums.xlhvDk`), `thuchienxulyhocvu` + `tracuuketqua` +
   `pheduyetketqua` + `raquyetdinh` dùng chung `thuchienxulyhocvu/script/_ketqua.js` (`ums.xlhvKQ`; `pheduyetketqua/_xlhv.js`
   `ums.xlhv.man` xây trên nó), `kehoachxuly` (`_khxl_*.js`, nạp chéo `ums.tlKh.pickNguoiDung` của DKH thilai).
   Lỗi gốc: đổi mức cảnh cáo ở cả 4 màn XLHV gọi nhầm `RL_TieuChiDanhGia/CapNhat` → chưa từng lưu được (nay
   `XLHV_KetQuaXuLy/CapNhat`, đường GHI mới); nhiều nút xoá/tìm gắn id sai nên chưa từng chạy. Mục cần quyết ở `can-quyet.js`.
   **Nợ tầng chung thêm:** `dieukienapdung` (XLHV) cùng họ `ums.rlApDung` → nên gộp; `ums.ref.cascade` bản chọn nhiều nay là
   bản tự viết thứ ba; thiếu `ums.ref.thoiGianDaoTaoKy`; `ums.report.mount` cần `report: false`; `ums.crud` cần `list.draw`,
   trường chỉ đọc, `formAside`; `ui.table` cần kiểu cây + `minWidth`; hộp "Xác nhận" nút theo danh mục thêm hai bản
   (`pheduyetketqua`, `_phanlich.js`); `pat.pickSinhVien` thiếu Khoa QL + "Thêm từng hệ"; `ums.tlKh.pickNguoiDung` → `ums.pat`;
   `ums.queue.mount` chưa vẽ ô "N luồng".

11. **Xét học bổng (ApisHocBong) — XONG 12/12 (2026-09-25)**, 3 tác tử con. Vai trò mẫu **R35**, ID `HB-<module>-<tệp>` (tên menu
   mẫu theo tên tệp). Kiểm: `kiem-dong-bo` 12/12; `thu-crud` 7/12 — 5 màn báo là ĐÚNG THIẾT KẾ (4 màn bắt chọn Quỹ/Phân cấp
   trước khi Thêm; `kehoach` lưu xong ở lại biểu mẫu như gốc). Danh mục nạp CHÍNH tệp Đăng ký học.
   Ba họ màn: **thiết lập** `thamsochung` / `dieukienxet` / `xeploaihabac` → `thietlap/script/_dk.js` (`ums.hbDk.man`, hai tab
   chung/riêng, biểu mẫu hai cột 4|8, bảng từ khoá sửa trong ô); **kế hoạch** `kehoach` / `thuchienxet` / `xacnhan` →
   `kehoach/script/_kh_chung.js` + `_kh_form.js` + `_kh_dieukien.js` (`ums.hbKh`; nạp chéo `ums.khxl` của XLHV kehoachxuly);
   **còn lại** `tonghop`, `sotinkehoach`, `quyhocbong`, `phanbohocbong`, `vanbang/quanlythongtin` (`kehoach/script/_th.js`, `ums.hbTh`).
   Nhiều màn Học bổng CHÉP từ ApisTotNghiep (gọi `TN_*`) — khi chuyển Tốt nghiệp nên dùng lại các khung trên.
   Lỗi gốc đáng nhớ: nhiều đường GHI chưa từng chạy ("Lưu tham số", lưới hạ bậc/giới hạn, Sửa văn bằng) → đường GHI mới;
   "Cách lưu" phân bổ luôn gộp nhóm; nút Xoá biểu mẫu luôn ẩn (nay hiện khi Sửa). Mục cần quyết ở `can-quyet.js`.
   **Nợ tầng chung thêm:** `ums.khxl` (XLHV) nay hai phân hệ dùng → đưa lên `ums.pat`; `ums.hbTh.quy` trùng `ums.hbKh.napQuy`
   (cùng lời gọi, để nguyên vì gộp phải kéo thêm khung kế hoạch); `ums.crud` cần trường chọn nhiều, biểu mẫu hai cột lệch,
   `save` nhiều lời gọi / Promise, móc "trước khi Thêm"; `ui.table` cần `minWidth`; ảnh đại diện tròn trong bảng bản thứ ba
   (`.hbkh-ava`) → `ums.ui`; hộp nút tình trạng lớn (`.hbth-xn` ~ `.cc-xn`) → `ums.pat`; vỏ KHÔNG đóng hộp thoại đang mở khi đổi màn.

12. **Quản lý điểm (ApisQuanLyDiem) — XONG 42/42 (2026-09-25)**, 8 tác tử con. Vai trò mẫu **R13**, ID `QLD-<module>-<tệp>`
   (tên menu mẫu theo tên tệp). Bỏ `nhapdiem/nhapdiemtest` (trang thử). Kiểm: `kiem-dong-bo?vt=R13&tien=QLD&coTep=1` 41/41;
   `thu-crud` 39/41 — ĐÚNG THIẾT KẾ: `kehoach/kehoach` lưu xong ở lại biểu mẫu (như gốc), `phanquyen/diem` biểu mẫu tự dựng
   (bảng cán bộ × phạm vi × quyền), harness không nhận. Hồi quy: CCB 152/152, RL/DKH/HLTL/XLHV đạt.
   Khung chung: **khai báo** 8 màn → `thamsochung/script/_khaibao.js` (`ums.qldKB`, trên `ums.crud`); **áp dụng** 8 màn →
   `thamsochung/script/_apdung.js` + `css/_apdung.css` (`ums.qldAD` — hai cột Chương trình|Khoá × tab chương trình / học phần /
   người học, `Q.luoi` bảng nhập, `Q.hopKeThuaCTDT`; cách khai ở đầu tệp); `congthucdiem/_congthuc.js` (`ums.qldCT`, học phần × kỳ);
   `cauhinhhienthi/_cauhinh.js` (`ums.qldCH`); `kehoach/_qld_*.js` (`ums.qldKh`, nạp chéo `ums.khxl` XLHV + `ums.tlKh` DKH);
   `thongke/_chung.js` (`ums.qldTk`). Danh mục nạp CHÍNH tệp Đăng ký học (gốc chỉ lệch lớp CSS).
   Nạp / SỬA CỘNG THÊM tệp Cổng cán bộ (mặc định giữ hành vi cũ): `nhapdiem/_chung.js` (+ `ums.nd.bangDiem` lưới nhập điểm tách
   ra), `_kiemtra.js` (cờ `tgTen/chonDau/hpTen/xnNut/baoCaoText`), `_xacnhan.js` (+ `ums.nd.xacNhanNut`), `_ibd_lop.js`
   (`caLop` cờ `buoiHoc`), `thongke/_nhapdiem.js` (cờ `qld`, tách `ums.tkNhapDiem.bang`), `thongke/nhapdiemlichthi.js`
   (`data-thongke="1"`). `thongke/tonghopketqua` và `tinhdiem/tonghopketqua` cùng nạp MỘT .js gốc nhưng hai html khác bố cục
   → hai bản riêng. `tinhdiem/inbangdiem` gốc là bảng mẫu tĩnh (js không gắn gì) → khung "chưa có nội dung".
   Lỗi gốc đáng nhớ: cả họ "áp dụng" lưu lần hai thêm trùng; `quydoichungchi` Sửa chưa từng gửi strId (thực chất thêm mới);
   `phanquyen/diem` Thêm quyền chưa từng ghi được; `thamsoquydoithangdiem` tab người học lưu toàn rỗng; hai màn cấu hình hiển thị
   đọc lệch một cột mọi tham số (bản mới ĐỔI dữ liệu ghi đi). 148 mục ở `can-quyet.js` (khoá `ApisQuanLyDiem/…`).
   **Nợ tầng chung thêm:** `ums.nd.bangDiem` nên thay lưới riêng trong CCB `nhapdiem.js`; hộp Xác nhận kiểu nút nay bản thứ ba
   (`.nd-xn` ≈ `.cc-xn` ≈ `.hbth-xn`); `ui.table` gộp ô thân bảng (bản tự viết thứ tư), cột dính trái, `minWidth`, phân trang máy
   khách, cột ô đánh dấu + chọn tất cả; hàng đợi N luồng (`nd.pool`, `_congthuc.js`, phanquyen, tracuudiem); `ums.ref` thiếu
   `KHCT_*/LayDanhSach` kiểu cũ, `namNhapHoc`, Thời gian → Lớp HP cá nhân (ba bản); `ref.cascade` thiếu Khoa QL + chọn nhiều;
   `pat.phamVi` cứng `pickSinhVienNganh`; `ums.crud` điền sẵn từ ô lọc, ô chọn phụ thuộc, hiện Message; `ums.queue.mount` luôn
   thêm cột "Khoản thu"; `panel` tools không xuống dòng; `kiem-icon-chuan.py` / `tien-do.py` cần `PYTHONIOENCODING=utf-8`.

13. **Nhân sự (ApisNhanSu) — XONG 121/121 (2026-09-26)**, 9 tác tử con. Vai trò mẫu **R36**, ID `NS-<module>-<tệp>` (tên menu
   mẫu theo tên tệp). Kiểm: `kiem-dong-bo?vt=R36&tien=NS&coTep=1` 121/121; `thu-crud` 113/121 — 8 màn ĐÚNG THIẾT KẾ (bắt chọn
   nhân sự / Đợt / loại khoản trước khi Lưu: `luong/{cosoapdung,khoankhongtinh,luongduocnhankhac,thamnien,truylinh,
   quydinhdongbaohiem}`, `nhansu/dexuattuyendung`; `kehoach/dexuathoso` lưu bằng `Update…` harness không nhận). Nhiều màn hai cột
   harness "ok" mà KHÔNG bấm tới Thêm/Sửa (nút chữ "Thêm", mục `.ums-master__item`, phải chọn cán bộ trước) — các tác tử đã dò riêng.
   Hồi quy sau đợt: CCB 152/152 + 147/152, TC 74/74, biểu tượng 0 lệch.
   **Bẫy chạy harness:** `--virtual-time-budget` dừng sau màn đầu khi máy chủ bận → chạy thời gian thật qua CDP (đợi `#out` có DONE).
   **Mã action:** `<method>` = base64(XOR từng byte với 'A'); hai action xoá mới của `nhansu/kehoach` tự sinh theo luật này (đã giải ngược đúng).
   Khung trong module: `hoso/_canbo.js` (`ums.nsCanBo`), `hoso/_cauhinh.js`, `quatrinhcongtac/_canbo.js` (`ums.nsQT`),
   `luong/_luongA.js` / `_luongB.js`, `heso/_heso.js` (`ums.nsHeSo`, 16 màn), `dubao/_dubao.js`, `chamcongphep/_chung.js`
   (`ums.nsCham`, có lịch âm – dương), `hopdong/_hopdong.js`, `cocautochuc/_chung.js` (`ums.nsCoCau` cây đơn vị) + `_cctc/_vitri/
   _phancong.js`, `baocao/_chung.js`, `dgplnguoilaodong/_dgpl.js` (`ums.nsDgpl`, lương tăng thêm nạp chéo cờ `ltt`),
   `nhansu/_tuyendung.js` (`ums.nsTd`), `kehoach/_dxhs_*.js` (`ums.nsDxhs`). `danhmuc/danhmucdulieu` nạp CHÍNH tệp Đăng ký học.
   **Dùng lại Cổng cán bộ (sửa tệp CCB, cờ mặc định giữ hành vi cũ):** `hoso/{capnhathoso,qtthongtin}`, `quatrinhdaotao`,
   `quatrinhchucvu` → `mount(root, { nhanSuId, quanTri })`; 11 tệp của `quatrinhcongtac`, `danhhieuhocham`, `khenthuongkyluat`,
   `nghithaisan`, `quanhegiadinh`, `quatrinhsuckhoe` → `ums.ccbHS.<tên>({ hs, nth, ns })`. HAI kiểu dùng lại khác nhau — nên thống nhất.
   262 mục tự chốt → `_v2/CAN-QUYET-DA-CHOT.md` (mục "Chốt ngày 2026-09-26 — Nhân sự"); 10 việc dữ liệu → `can-quyet.js` (CHƯA kiểm host).
   **ĐÃ GỘP (2026-09-26, người dùng: "giống nhau thì bạn tự quyết gộp. đặt mình vào là người dùng"):**
   - SÁU bản cột trái "Danh sách cán bộ" → `ums.pat.masterNhanSu` / `pat.dsNhanSu` / `pat.dsNhanSuLoc` (patterns.js). `ums.nsCanBo`,
     `ums.nsQT.man`, `ums.luongA.dsCanBo`, `ums.luongB.canBo`, `ums.nsCham.dsNhanSu` nay là LỚP BỌC mỏng; `tracuuinan/hosolylich` gọi thẳng.
     Thống nhất theo góc người dùng: mọi nơi có ô Tình trạng, đổi ô lọc là tải lại, Bộ môn khoá tới khi chọn Khoa (bản luongA từng
     không khoá), lọc Bộ môn ‖ Khoa (hai bản lương từng gửi Khoa trước → chọn Bộ môn không có tác dụng), dòng phụ Mã + Ngày sinh.
     Ngoài lệ có chủ ý: `hoso/khoitao`, `nhansungoaitruong` (danh sách của ums.crud để SỬA hồ sơ, kể cả cán bộ ngoài trường).
   - Ảnh tròn người: 9 bản (`.nscb-anh`, `.nsqt-ava`, `.lgb-ava`, `.nscham-ava`, `.dgpl-ava`, `.nscc-anh`, `.nshs-anh`, `.hbkh-ava`,
     `.tlkh-ava`, bản nhỏ `.cmsnd-ava`) → `ums.pat.anhNguoi` (`.ums-ava`). Còn riêng: CMS ảnh lớn 160px, Tài chính `thutien-ava` (chữ cái đầu).
   - Nút biểu tượng trong mục `.ums-master__item.is-active` xanh trên xanh → sửa ở tầng chung (patterns.css), gỡ bản vá `dgpl`.
   - `dgplluongtangthem/ketqua` nạp CHÍNH `baocao/chatluongnhanluc` (html gốc giống hệt, cùng nạp một .js) — xoá bản dựng riêng.
   **Nợ tầng chung còn lại:**
   - Cây đơn vị bản thứ tư (`ums.nsCoCau`) → `ums.pat.cay`; hộp Xác nhận nút lớn bản thứ năm; `cotLa` (cây thành phần → cột lá) hai bản; Đơn vị → Thành viên
     (`NS_HoSoV2/LayDanhSach`) ba bản → `ums.ref.thanhVien`; năm kiểu `dateYearToCombo` → `ums.ref.nam`; lịch âm – dương → `ums.lich`.
   - `ums.crud`: `save` trả Promise / nhiều lời gọi (gần như mọi nhóm vá), ô lọc ngày, điền sẵn từ ô lọc, ô chọn phụ thuộc,
     nút xoá trên mục `master`, trường chọn nhiều. `ums.files.save` không gắn được một tệp cho nhiều bản ghi. `ums.api.dm` không ép nạp lại.
   - Harness `thu-crud` chỉ nhận nút đúng chữ "Thêm mới" và không bấm `.ums-master__item` → nên mở rộng.

14. **Sinh viên (ApisSinhVien) — XONG 35/35 (2026-09-26)**, 5 tác tử con. Vai trò mẫu **R38**, ID `SV-<module>-<tệp html>`.
   Kiểm: `kiem-dong-bo?vt=R38&tien=SV&coTep=1` 33/35 — `hoso/yeucau` + `thutuchanhchinh/yeucau` báo "biểu mẫu hiện sẵn" là khung cấu hình
   loại yêu cầu LUÔN hiện như gốc; `thu-crud` 33/35 — ĐÚNG THIẾT KẾ: `quanlytoanbo` "Thêm mới" nhảy sang Tạo mới hồ sơ, `goihotro` lưu gói
   xong ở lại biểu mẫu để thêm chi tiết (như gốc). Hồi quy: XLHV 8/8 + 7/8, CSV 35/36 + 36/36, CCB 152/152, NS 121/121.
   Khung trong module: `hoso/_hsA.js` (`ums.hsA` — biểu mẫu hồ sơ 3 tab "Hồ sơ đề xuất", xây trên `ums.nsDxhs` của Nhân sự),
   `hoso/_hsB.js` (`ums.hsB`), `chinhsach/_chinhsach.js` (`ums.svcs` — lưới SV × đối tượng, 6 màn), `quyetdinh/_quyetdinh.js` (`ums.svqd`),
   `vexe/_kehoach.js` (`ums.svVe`), `hoctructuyen/_dssv.js`. Nạp CHÍNH bản đã chuyển: `hoso/DaQHHT` (CCB hoatdong), `hoso/yeucau` =
   `thutuchanhchinh/yeucau` (CÙNG MỘT MÀN, bản thutuchanhchinh mới hơn — gộp), `dashboard` (`ums.dbv2` CCB), `danhmuc` (DKH).
   Sửa tệp phân hệ khác (cờ, mặc định giữ hành vi cũ): NS `kehoach/_dxhs_chung.js` (`X.ddlh`), CSV `thutuchanhchinh/_ttc.js` (`laSV`).
   `dicvusinhvien/nguoihocxacnhanthanhtoan` = đích của mục "Kiểm tra thông tin cá nhân" Cổng SV thủ vai (trên host từng 404).
   **Gộp lên tầng chung:** `ums.xlhvKQ.boLoc` → `ums.pat.boLocNguoiHoc` (XLHV giữ tên cũ làm bí danh; bản tự viết của chính sách
   xây lại trên nó; mức xử lý nay chỉ nạp khi màn có ô `muc`).
   113 mục tự chốt → `CAN-QUYET-DA-CHOT.md`; việc dữ liệu → `can-quyet.js` (CHƯA kiểm host; `KHCT_NamNhapHoc` 404 làm trống ô Năm nhập học ở 4 màn).
   **Nợ tầng chung (trùng nhiều bản — gộp ở bước kế):** cột ô đánh dấu + "chọn tất cả" cho `ui.table` (≥6 bản tự viết); hàng đợi
   "mỗi ô một lời gọi" N luồng (≥7 bản) → `ums.util.hangDoi`; hộp Xác nhận nút lớn (bản thứ năm — SV nạp chéo `.cc-xn`);
   `pickSinhVien` nguồn Corei `LayDSNguoiHoc` chép 4 lần → `pat.pickNguoiHoc`; `ums.dkhChon.hocPhan` → `pat.pickHocPhan`;
   biểu mẫu hồ sơ CORE_PERSON ba bản (SV `hsA.editor`, CCB `qhht.coBan`, NS dexuathoso); Tỉnh → Huyện → Xã ba bản; danh sách SV
   cột trái (`hsA.dsSV`) = bản SV của `pat.dsNhanSu`; bảng phân trang máy chủ ngoài crud (4 bản); `report.mount` mục Import viết cứng.

15. **Kế hoạch chương trình (ApisKeHoachChuongTrinh) — XONG 28/28 (2026-09-27)**, 8 tác tử con. Vai trò mẫu **R21**, ID
   `KHCT-<module>-<tệp>` (tên menu mẫu theo tên tệp). Kiểm: `kiem-dong-bo?vt=R21&tien=KHCT&coTep=1` 28/28; `kiem-cot-trai` 2/2;
   `thu-crud` 24/28 — ĐÚNG THIẾT KẾ: `tochucchuongtrinh/dinhhuong` + `noidungdaotao/quanhehocphan` (ô con khoá tới khi chọn cha,
   harness không bắn `select2:select`), `hoatdongchung/kehoach` + `kehoachchitiet` (lưu xong ở lại biểu mẫu như gốc). Hồi quy TC/CCB/DKH/CMS/CC đạt.
   Khung trong module: `tochucchuongtrinh/_tochuc.js` (`ums.khctTC`, 6 màn danh mục đào tạo trên ums.crud), `noidungdaotao/_noidung.js`
   (`ums.khctND`), `tochucchuongtrinh/_dinhhuong.js` (`ums.khctDH`, hai màn định hướng — bản tochuc gốc CHƯA TỪNG CHẠY, dựng lại),
   `hoatdong/_hd_chung.js` (`ums.khctHd`), `hoatdongchung/_khc.js` (`ums.khctKh`), `chuongtrinhhocphan/_chung.js` (`ums.khctCt`).
   Dùng lại (sửa tệp phân hệ khác, cờ mặc định giữ hành vi cũ): TC `hoatdong/cthp.js` → `ums.cthp.man(root, { khct })` (thẻ `data-khct`);
   CCB `phanlichgiang/_phanlich.js` (cờ `dToanBo`, `ngoaiTruong`, `bhSoTiet`, `nutXemLich`, `thuTuNut`); DKH `kehoachdangky/quanlytoanbo.js`
   (`data-kieu="khct"` — thêm Chuyển lớp); CMS `ums.pq` (phanquyen); TC `danhmuc/danhmucdulieu.js` (`data-trang-thai`); CCB
   `hoatdong/dukienhocphan.js` (sửa thiếu iM ở `taiDX`). Nạp chéo `ums.khxl` (XLHV), `ums.tlKh` (DKH), `ums.hd.keHoach` (CCB).
   Tự chốt → `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-09-27"; không có việc dữ liệu mới (ô Năm nhập học `quanlytoanbo` trống do 404 đã biết).
   **Nợ tầng chung thêm:** `ums.crud` ô chọn phụ thuộc / điền sẵn từ ô lọc / lọc chọn nhiều (≥3 bản tự viết); `ums.ref.cascadeCu`
   cho `KHCT_*/LayDanhSach` kiểu cũ không lọc quyền (chép ở KHCT, DKH, QLD); `cascadeQuyen` thiếu `bKoCheckQuyen`; hộp Xác nhận nút lớn
   bản thứ sáu; `ui.table` cột ô đánh dấu + phân trang máy khách + `onRow`; hàng đợi N luồng; `ums.pq`, `ums.khxl`, `ums.tlKh.pickNguoiDung`,
   `ums.hd.keHoach` nay nhiều phân hệ dùng → `ums.pat`; khung hai danh sách chọn (`ums.khctCt.ghep`) + nút "Import ▾" bản thứ ba;
   `pat.haiLuoi` cần `thuTu`/`ngang`/`page`/`dong`.

16. **Nhập học (ApisNhapHoc) — XONG 31/31 (2026-09-27)**, 8 tác tử con. Vai trò mẫu **R24**, ID `NH-<module>-<tệp>` (tên menu theo
   chức năng trên host; 4 tệp "(bản cũ)" không có trên menu host: `thuhoso`, `taichinh`, `ruttien`, `checkinnhaphoc`). Kiểm:
   `kiem-dong-bo?vt=R24&tien=NH&coTep=1` 31/31; `thu-crud` 30/31 (`trungtuyen/kehoachtuyensinhnew` đúng thiết kế: Đợt khoá tới khi chọn
   Kế hoạch TS, harness không bắn select2:select); `kiem-cot-trai` 8/8; biểu tượng 0 lệch; hồi quy TC 74/74, DKH 24/24. Harness
   `thu-crud` chỉ nhận chữ "Thêm mới" → nhiều màn NH giữ chữ gốc "Tạo mới" / "Thêm nhóm" chỉ kiểm được Sửa; các tác tử đã dò riêng.
   Khung trong module: `taichinh/_kmp_*.js` (`ums.kmp`, khai mức phí), `taichinh/_thu_chung.js` (`ums.nhThu.man({cu})` — thu tiền mới/cũ),
   `thuhoso/_dsnh.js` (`ums.nhDs` cột người học theo kế hoạch + khối Hồ sơ) + `_thuhoso.js` (`ums.nhThuHoSo`), `ruttien/_ruttien.js`
   (`ums.nhRutTien`), `phanlop/_chung.js` (`ums.nhPhanLop`), `trungtuyen/_khts.js` (**`ums.khts` — dùng lại cho Tuyển sinh**: Kế hoạch TS → Đợt,
   `K.phanCong(kh, cfg)`), `kehoach/_chung.js` (`ums.nhKH`), `dinhmuc/_chung.js` (`ums.nhDm`), `quydinh/_chung.js` (`ums.nhQD`),
   `thongke/_chung.js` (`ums.nhTk`) + `_mau.js` (trang mẫu), `baocaothongke/_chung.js` (`ums.nhBc`). Không sửa tầng chung / phân hệ khác;
   nạp chéo (chỉ đọc) `ums.tlKh.hopChon` của DKH thilai. Trang mẫu tĩnh: `thongke/loaikhoan`, `nguoithu`; khung trống: `thongke/ngaythu`,
   `hethong/tracuuphieurut`. `trungtuyen/themmoi.js` gốc không chuyển (trang thử, không html nào nạp).
   Tự chốt + lỗi gốc đã sửa: `_v2/CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-09-27 — Nhập học"; 4 việc dữ liệu → `can-quyet.js`. CHƯA kiểm host.
   **Tuyển sinh (làm tiếp):** `ApisQuanlyTuyenSinh/tuyensinh/kehoachtuyensinhnew` (13.832 dòng, `PKG_CORE_TS_*`) KHÁC thực thể chính với bản NH —
   chỉ dùng lại `ums.khts`; `tuyensinh/hosotuyensinh` là bản gốc của NH `phanlop/hosotuyensinh` (thêm lớp 11, kế thừa, báo cáo) → dùng lại tệp NH.
   **Nợ tầng chung thêm (gom từ 8 nhóm):** `ums.ref.keHoachNhapHoc` (`PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc` chép ở ≥4 nhóm);
   `.ums-master__adv` cần `grid-template-columns: minmax(0,1fr)` (tên dài tràn cột trái — vá tạm ở 2 màn); `ums.phieu.viewer.show({ rs, dt, loai })`
   nhận dữ liệu có sẵn + co giãn khi phôi rộng + bộ dựng phôi nháp `Edit_*`; `ui.table` cột ô đánh dấu + chọn tất cả (thêm 3 bản), phân trang
   máy khách, `minWidth`, cột `group` phải là mảng (chuỗi vỡ tiêu đề không báo); `ums.crud`: đổi chữ nút lọc/tìm, nút toolbar `disabled`, móc
   trước Thêm/Tìm, `list.call` null xoá bảng, ↻ của bản embedded đặt sai chỗ, ô chỉ đọc + nút mở hộp chọn, tắt cột STT, ô lọc chọn nhiều, ô tiền,
   chèn khối / lưới dòng giữa trường, `save` Promise / nhiều lời gọi, nút "Viết lại", ô chọn phụ thuộc trong biểu mẫu; nút thả xuống "Import ▾"
   (bản thứ tư) → công khai `dropHtml/toggleDrop` của report.js; `reportDanhMuc` chưa có ở `ums.report`; `ums.report.mount` chưa hợp action cũ
   `SYS_Import_PhanQuyen/LayDanhSach`; `ui.xuatXls` ép ô thành chữ (cột tiền không cộng được); `ums.files.mount` thiếu `onChange`; token `--ums-info`;
   `ums.nhDs` ≈ cột trái `taichinhnew` → gộp `ums.pat`; `ums.tlKh.hopChon` (5 phân hệ) → `ums.pat`; popover thông tin thí sinh → `ums.pat`;
   `ref.lopQuanLy` thiếu `strDaoTao_KhoaQuanLy_Id` (Corei); harness `thu-crud` nên nhận "Tạo mới"; vỏ không đóng hộp thoại khi đổi màn.

17. **Tuyển sinh (ApisQuanlyTuyenSinh) — XONG 15/15 (2026-09-27)**, 7 tác tử con (5 bị ngắt vì giới hạn phiên rồi chạy tiếp). Vai trò mẫu **R31**,
   ID `TS-<module>-<tệp>`; thư mục `_v2/ApisQuanlyTuyenSinh` theo tên repo (CSDL ghi `ApisQuanLyTuyenSinh`, IIS không phân biệt hoa thường).
   Bỏ `nhapdiem/nhapdiemtest` (trang thử). Kiểm: `kiem-dong-bo?vt=R31&tien=TS&coTep=1` 15/15; `thu-crud` 13/15 (`hoso/quanlyhoso`,
   `quanlyhosomorong`: "Thêm mới" mở trang nhập hồ sơ NGOÀI UMS bằng vé `CMS_Token/CreateTicket` — đúng thiết kế); `kiem-cot-trai` 1/1;
   biểu tượng 0 lệch; hồi quy NH 31/31 + 30/31, QLD 41/41, CCB 152/152.
   Khung: `tuyensinh/_khtsn_*.js` (`ums.khtsn`, Kế hoạch TS new — 11 tệp hộp con) trên `ums.khts` (NH, thêm cờ `dsDotTS {tatCa}`,
   `phanCong cfg.detail`); `_khtsc*.js` (`ums.khtsc`, Kế hoạch TS bản cũ, bảng TS_* kiểu cũ); `hoso/_chung.js` (`ums.tsHoSo` — nguồn Năm/KH/Hệ/
   Khoá/Đợt/Hình thức kiểu cũ, dùng lại được); **`_v2/ApisNhapHoc/Modules/phanlop/scripts/_hosots.js` (`ums.hoSoTS.man(root, { ts })`)** — khung CHUNG
   hồ sơ tuyển sinh cho NH `phanlop/hosotuyensinh` và TS `tuyensinh/hosotuyensinh`; `danhmuc/danhmucdulieu` nạp CHÍNH tệp DKH. Trang mẫu:
   `tuyensinh/khaibaothongtin` (gốc không gọi máy chủ). Sửa CCB `nhapdiem/_chung.js` (`bangDiem({chon:false})`), `_xacnhan.js`
   (`xacNhanNut({idHanhDong})`) — cờ, mặc định giữ hành vi. **Thư viện Excel:** `assets/vendor/xlsx/xlsx.bundle.js` (xlsx-js-style 1.2.0,
   Apache-2.0 — gốc nạp CDN), có trong `GIU_VENDOR` của `dong-goi.py`.
   **⚠ Bảo mật:** mã gốc `quanlyhosomorong` / `kehoachtuyensinhnew` viết cứng tài khoản / mật khẩu / token CRM CMC, tuyensinh.uhd ("Bearer
   HaiDuong@2025"), HRM Phenikaa — bản mới KHÔNG chép (ô nhập / cấu hình), đã ghi `can-quyet.js` đề nghị thu hồi.
   Tự chốt + lỗi gốc: `_v2/CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-09-27 — Tuyển sinh". CHƯA kiểm host.
   **Nợ tầng chung thêm:** biểu mẫu hồ sơ `TS_HoSoDuTuyen` còn 3 bản (`ums.hoSoTS`, TS `duyethoso` chỉ xem, `xettuyen`) → gộp vào `ums.hoSoTS`;
   biểu mẫu CORE_PERSON bản thứ tư; Tỉnh→Huyện→Xã (tỉnh 2 cấp) bản thứ tư; hàng đợi N luồng bản thứ tám; `ums.nhPhanLop.cotChon` nay 3 phân hệ
   nạp chéo → `ui.table` cột ô đánh dấu; hộp xác nhận nút lớn thêm 2 bản (`.cc-xn`, `.nd-xn` nạp chéo css); `ums.khts` 2 phân hệ → `ums.pat`;
   `ums.ui.docXls`; `pat.pickNhanSu` thiếu "Thêm từng đơn vị"; `ui.table` lọc/sắp kiểu Excel, cột dính, phân trang máy khách; `ums.crud` cột ô đánh dấu
   khi không có remove, khung chỉ xem thay chỗ, "lưu xong ở lại biểu mẫu", selectOne ô lọc, `.ums-page__actions` xuống dòng; `pat.rows` ô chọn phụ
   thuộc + cột tiền; `ums.pat.diaChiTen`; `ums.files` chỉ đọc; harness `thu-crud` nên nhận "Tạo mới"/Create/Update và nút mở trang ngoài.

18. **Nghiên cứu khoa học (ApisNCKH) — XONG 55/55 (2026-09-27)**, 8 tác tử con (A, D bị ngắt vì giới hạn phiên rồi chạy tiếp). Vai trò mẫu
   **R23**, ID `NCKH-<module>-<tệp>`. Kiểm: `kiem-dong-bo?vt=R23&tien=NCKH&coTep=1` 55/55; `thu-crud` 54/55 (`tinhdiem/phanbo` "Thêm" mở khung chọn
   sản phẩm chưa phân bổ — đúng thiết kế); `kiem-cot-trai` 34/34; biểu tượng 0 lệch; hồi quy CCB 152, NS 121, DKH 24, TS 15.
   Mọi màn KHÔNG sửa tệp CCB: dựa khung `ums.nckh` (CCB `sanphamkhoahoc/_sanpham.js`) bằng lớp bọc trong module. Khung: `quanlysanpham/_bb_chung.js`
   (`ums.nckhBB`, bài báo/kỷ yếu/sách + màn XEM 2018 `baibaoquocte`/`baibaotrongnuoc`) + `xacnhankekhai/_bb_xacnhan.js`; `_gt_sanpham.js` + `_gt_cauhinh.js`
   (`ums.nckhGT`, giải thưởng/văn bằng/HNHT, quản trị + xác nhận); `_hd_chung.js` (`ums.nckhHD`) + `xacnhankekhai/_hd_xacnhan.js` (`ums.nckhHDxn`);
   `_dt_detai.js` (`ums.nckhDt`, đề tài + `quanlyduan`) + `_dt_muon.js` (MƯỢN khối con của CCB `detai.js` bằng phần tử tạm — bỏ khi CCB xuất
   `ums.nckh.deTaiKhoi`); `_hdg_daoduc.js`; `xacnhankekhai/_pdg_chung.js` (`ums.nckhPdg`, hai phiếu thi đua — tự dựng, `ums.dgpl.phieu` CCB không nhúng được);
   `baocao/_chung.js` (`ums.nckhBc`, cột trái chỉ lọc + crud chỉ đọc); `danhmuc/_tapchi.js`. Hội đồng xét chức danh nạp CHÍNH bản chỉ xem CCB; `tracuuinan`
   nạp CHÍNH Nhân sự; `danhmucdulieu` nạp DKH; `lylichkhoahoc`, `baocao/baocao` = khung "chưa có nội dung" (gốc trống).
   **Thống nhất:** mọi ô Đơn vị → Thành viên KHOÁ tới khi chọn Đơn vị. Tự chốt + lỗi gốc: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-09-27 — Nghiên cứu
   khoa học"; 6 việc dữ liệu → `can-quyet.js`. CHƯA kiểm host.
   **Nợ tầng chung (gộp ở bước kế):** khung XÁC NHẬN KÊ KHAI NCKH có BỐN bản (`_bb_xacnhan`, `nckhGT.xacNhan`, `_hd_xacnhan`, `_dt_detai` xacNhan) + `_pdg`
   → `ums.pat.xacNhanSanPham` (bảng + nút nhỏ + chi tiết chỉ xem + hộp nút lớn + lịch sử + GopFile); hộp nút lớn nay ~10 bản (`.bb-xn`, `.gtxn-lon`, `.hdxn-nut`,
   `.pdg-xn` …) → mở rộng `nd.xacNhanNut`; `ums.nckh.man` (cờ `loc`, `tuThem`, `nam:false`, `item`, `saveAgain`, `viet`, `luuKhoi`) + `N.thanhVien`
   (`anh`, `xem`, `guiKeHoach:false`) + `N.deTai` (`nguon`/`tatCa`) → khi có thì `BB.man`, `H.man`, `G.quanTri` chỉ còn một lời gọi; Đơn vị → Thành viên
   (`NS_HoSoV2/LayDanhSach`) bản thứ 5+ → `ums.ref.thanhVien`; `ums.files` liệt kê tệp (GopFile); `ums.crud` `locTrai` (cột trái chỉ lọc), khung chỉ xem
   thay chỗ bảng, xuất Excel toàn bộ, nút "Viết lại"; `pat.cotTrai` xét `checked` của radio; `ui.btn('download')`; `ui.table` `minWidth`; NS `hosolylich`
   cờ `strNguoiDangNhap_Id` nếu mẫu in NCKH cần.

19. **Thi phách (ApisThiPhach) — XONG 18/18 (2026-09-29)**, 7 tác tử con (phiên bị ngắt hai lần vì hết hạn mức, chạy tiếp bằng SendMessage).
   Vai trò mẫu **R14**, ID `TP-<module>-<tệp>`; tham số `s=` của trang kiểm là `kehoach-<tệp>`. 17 màn nằm chung MỘT module `kehoach` nên tệp chung
   đặt tiền tố theo nhóm, KHÔNG có `_chung.js`. Kiểm: `kiem-dong-bo?vt=R14&tien=TP&coTep=1` 18/18; `kiem-cot-trai` 1/1 (chỉ danh mục có cột trái);
   `thu-crud` 16/18 — `tuibaitc`, `tuibai` chặn "Thêm mới" tới khi chọn Môn thi (như gốc, đúng thiết kế); **16 màn còn lại báo "ok []" = harness KHÔNG
   bấm được gì** (không phải màn crud) — luồng ghi các nhóm dò riêng bằng trang dò. Biểu tượng 0 lệch. Hồi quy CCB 152, QLD 41, TS 15, DKH 24.
   Khung (đều trong `kehoach/script/`): `_tp_duyet.js` (`ums.tpDuyet`, cờ `kieu: 'duyet' | 'han'` — `duyetdulieuthi` + `hannhapdiem` gốc chung một .js);
   `_tp_tui.js` + `_tp_tui_tui.js` (`ums.tpTui`, cờ `kieu: 'tc' | 'cu'` — `tuibaitc` + `tuibai`); `_tp_nd.js` (`ums.tpNd` — nhập điểm theo phách / theo DST);
   `_tp_pq.js` + `_tp_pq_nhap.js` + `_tp_pq_lhp.js` (`ums.tpPq` — ba màn phân quyền); `_tp_cham.js` (`ums.tpCham`); `_tp_kt.js` (`ums.tpKt` — phuckhao,
   khaothicapnhat, xacnhan); `tracuulichthi`, `thongketinhtrangtochucthi`, `baocaothi` viết riêng; `danhmuc/danhmucdulieu` nạp CHÍNH tệp Đăng ký học.
   Nạp chéo CCB `nhapdiem/_chung.js` + `_xacnhan.js` + `nhapdiem.css` (`ums.nd`), DKH `ums.lhp.hopPhamVi`. Sửa MỘT tệp phân hệ khác: CCB `nhapdiem/_chung.js`
   — `ums.nd.locThi` thêm tuỳ chọn `them(k)` (tham số thêm cho từng tầng, mặc định không đổi gì). Ba màn không có trên menu host vẫn chuyển (`baocaothi`,
   `tuibai`, `xacnhan`); tệp gốc `kehoach/script/lophocphan.js` không html nào nạp — không chuyển. Không đường GHI mới nào so với gốc; mọi nút ghi hàng loạt hỏi lại.
   Khác hệ đang chạy: `baocaothi` ô Học phần nay có dữ liệu (gốc đổ vào ô không tồn tại); Sinh số phách chạy tuần tự từng túi. Giữ như gốc dù nghi sai:
   khoá tham số Hệ có hai dấu cách cuối ở `duyetdulieuthi` (`LayDSLopHocPhan`) — kiểm trên host xem lọc Hệ có tác dụng không.
   Tự chốt + lỗi gốc: `_v2/CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-09-29 — Thi phách"; 2 việc dữ liệu → `can-quyet.js` (phuckhao thiếu thủ tục xoá thời hạn;
   xacnhan lấy tình trạng từ dịch vụ Tốt nghiệp, không có hủy). CHƯA kiểm host; CHƯA bấm chạy nút Báo cáo / Import ở màn nào.
   **Nợ tầng chung (gộp ở bước kế):** vùng nhập điểm theo túi / DST có BA bản (`_tp_pq_nhap.js`, `_tp_nd.js`, CCB `tuibai.js` + `_dst.js`); bộ lọc `TP_Chung`
   năm tầng bốn bản (`ums.nd.locThi`, `ums.thi.loc`, `ums.tpTui.boLoc`, `baocaothi.js`); hộp tình trạng nút lớn thêm hai bản (`tpDuyet` `hopTinhTrang`,
   `tpKt.xacNhan`) → mở rộng `ums.nd.xacNhanNut` nhận `nut()` / `lichSu()` / `luu()`; `ui.table` cột ô đánh dấu (thêm 5 bản) + phân trang máy khách +
   `ums.ui.locBang`; `pat.filterBar` nhiều nút / ô chọn tĩnh / 4 ô một hàng; `ui.dialog` nút khoá; `thu-crud` nên báo "không có gì để thử" thay "ok []".

20. Các phân hệ còn lại. Tổng 859 màn hình, xem mục 7 để biết vì
   sao không thể làm bằng cách đổi CSS.

### Cách làm việc đã dùng, nên giữ

Mỗi lần sửa giao diện thì dựng một trang dò tạm trong `_harness/`, nạp
`_v2/index.html` vào `<iframe>`, thao tác rồi đọc ngược `getComputedStyle` /
`getBoundingClientRect`, **xong thì xoá trang dò đi**. Cách này đã bắt được bốn
lỗi thật mà nhìn mắt không thấy: `requestAnimationFrame` bị trình duyệt tiết
chế làm thanh trên kẹt trạng thái, ô select2 chọn nhiều cao gấp đôi ô nhập
thường, nút `×` của select2 đè lên chữ, và `transform` đọng lại sau hiệu ứng
phá `position: sticky`.

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
