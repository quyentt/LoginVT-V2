# Thay đổi của kho gốc CHỜ chuyển sang `_v2`

Mỗi lần kéo mã gốc về mà **chưa** chuyển thay đổi sang `_v2` thì ghi vào đây. Phiên chuyển đổi kế tiếp đọc tệp này
trước, làm xong mục nào thì xoá mục đó (ghi điều đã chốt vào `CAN-QUYET-DA-CHOT.md`, việc dữ liệu vào `can-quyet.js`).

Xem lại đúng thay đổi của một tệp: `git diff -w <từ>..<đến> -- <đường dẫn tệp gốc>`.

**Từ 6/10: lúc kéo CHỈ ghi tên tệp + trạng thái "chưa xem", KHÔNG mở diff** (người dùng: "diff như vậy quá tốn"). Diff mở khi tới lượt làm đúng màn đó
(kiểm host / chuyển phân hệ ấy, hoặc đang sửa màn ấy) rồi đổi thành "đã chuyển". Phân hệ chưa chuyển: không bao giờ mở.

---

## Lần kéo 10 (12/10 tối) — mốc gốc nay là `2254204a` (gốc lại force-push; mốc cũ `c42e11e1`)

Lần sau so: `git diff --name-status 2254204a origin/main`. 11 tệp gốc đổi, đã ghi đè bằng `git checkout origin/main -- <tệp>`. **ĐÃ CHUYỂN HẾT 12/10 tối** (người dùng bảo "chuyển"), do-man 4 màn sạch, CHƯA kiểm host.
Số theo phân hệ: Sinh viên 7 · Cổng cán bộ 2 · Tài chính 2. **Cả 11 tệp đều của màn ĐÃ chuyển** — không có màn mới, không có phân hệ chưa chuyển.

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển, đã kiểm host 6/10) | `lichgiang/lichgiangnhieuphonghoc` | `ApisCongCanBo/Modules/lichgiang/html/lichgiangnhieuphonghoc.html` | **đã chuyển 12/10** — thêm 2 mục ô Tiết: "Sáng + chiều (T1-12)", "Cả ngày (T1-15)" (+ đổi version script, bỏ) |
| Cổng cán bộ (đã chuyển, đã kiểm host 6/10) | `lichgiang/lichgiangnhieuphonghoc` | `ApisCongCanBo/Modules/lichgiang/script/lichgiangnhieuphonghoc.js` | **đã chuyển 12/10** — gốc: đang lọc phòng trống theo khoảng ngày thì mọi lần vẽ lại (đổi cách tính, tải thêm phòng) đều vẽ bảng phòng × ngày; `_v2` đã đúng sẵn (khung `_nhieu.veLai` luôn hỏi `veThay` trước) → không sửa |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/hoso_capnhat` | `ApisSinhVien/Modules/hoso/html/hoso_capnhat.html` | **đã chuyển 12/10** — chỉ đổi version `zoneEditModal_inject.js?v=…73`, không có gì chuyển |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/hoso_danhsach` | `ApisSinhVien/Modules/hoso/html/hoso_danhsach.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/quanlytoanbo` | `ApisSinhVien/Modules/hoso/html/quanlytoanbo.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/xemhoso` | `ApisSinhVien/Modules/hoso/html/xemhoso.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/zoneEditModal_inject` | `ApisSinhVien/Modules/hoso/script/zoneEditModal_inject.js` | **đã chuyển 12/10** → `_v2/…/hoso/script/_hsA.js`: (1) Giới tính trống thì KHÔNG lưu, tô đỏ ô + mở tab Thông tin cơ bản (gốc 09/10: ô không có dòng trống nên rơi về "Nam" rồi ghi đè; `_v2` đã có dòng trống sẵn, chỉ thêm chặn lưu); (2) tab Xuất hoá đơn: ô bỏ trống mà người dùng không tự gõ thì lấp lại giá trị bản ghi hiện hành (`st.hdCham`, `giuHoaDonCu`), không ghi rỗng đè |
| Sinh viên (đã chuyển, chưa kiểm host) | `tinhtrangquanso/tinhtrangquanso` | `ApisSinhVien/Modules/tinhtrangquanso/html/tinhtrangquanso.html` | **đã chuyển 12/10** — chỉ đổi version script |
| Sinh viên (đã chuyển, chưa kiểm host) | `tinhtrangquanso/tinhtrangquanso` | `ApisSinhVien/Modules/tinhtrangquanso/script/tinhtrangquanso.js` | **đã chuyển 12/10** — cột tiêu chí mở rộng (Nữ, DTTS…) là tập con của trạng thái → KHÔNG cộng vào "Tổng số" dòng và tổng chung (cờ `moRong` trên cột, hàm `tong()`); tổng từng cột vẫn hiện |
| Tài chính (đã chuyển, đã kiểm host 30/9) | `dulieuhocphi/hopdong` | `ApisTaiChinh/Modules/dulieuhocphi/html/hopdong.html` | **đã chuyển 12/10** — nút "Xoá đã chọn" + cột ô đánh dấu (chọn tất cả) ở bảng sinh viên, thanh nút đặt trên bảng |
| Tài chính (đã chuyển, đã kiểm host 30/9) | `dulieuhocphi/hopdong` | `ApisTaiChinh/Modules/dulieuhocphi/scripts/hopdong.js` | **đã chuyển 12/10** — `delSvChon`: dòng mới chỉ gỡ khỏi danh sách, dòng đã lưu xoá `TC_NguoiHoc_QuanLy/Xoa` từng Id qua `ui.batch` 5 luồng, báo gộp, nạp lại; nút = `ui.xoaChon` (tự đếm, mờ khi chưa chọn) |

---

## Lần kéo 9 (12/10) — mốc gốc nay là `c42e11e1` (gốc force-push; `origin/main` cũ trên máy là `df26f98b`)

Lần sau so: `git diff --name-status c42e11e1 origin/main`. 46 tệp gốc đổi, đã ghi đè bằng `git checkout origin/main -- <tệp>`, CHƯA mở diff.
Số theo phân hệ: Ký túc xá 34 (đang chuyển 12/10: 28 tệp của màn đã chuyển, 5 của màn chưa làm, 1 CSS không chép) · Sinh viên 7 · Tài chính 3 · Cổng cán bộ 2.
Không chép `ApisKyTucXa.zip` (gói nén, 285 KB, gốc thêm mới).

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển, đã kiểm host) | `lichgiang/lichgiang` | `ApisCongCanBo/Modules/lichgiang/html/lichgiang.html` | **đã chuyển 12/10** |
| Cổng cán bộ (đã chuyển, đã kiểm host) | `lichgiang/lichgiang` | `ApisCongCanBo/Modules/lichgiang/script/lichgiang.js` | **đã chuyển 12/10** |
| Ký túc xá (đang chuyển 12/10) | `common/ktx-ui` | `ApisKyTucXa/Modules/common/ktx-ui.css` | **không chép** — CSS vỏ cũ, chỉ bám bố cục (12/10) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtodien` | `ApisKyTucXa/Modules/cosovatchat/html/congtodien.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtonuoc` | `ApisKyTucXa/Modules/cosovatchat/html/congtonuoc.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/phong` | `ApisKyTucXa/Modules/cosovatchat/html/phong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/quanlythietbi` | `ApisKyTucXa/Modules/cosovatchat/html/quanlythietbi.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/thietbi` | `ApisKyTucXa/Modules/cosovatchat/html/thietbi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/toanha` | `ApisKyTucXa/Modules/cosovatchat/html/toanha.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtodien` | `ApisKyTucXa/Modules/cosovatchat/script/congtodien.js` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/congtonuoc` | `ApisKyTucXa/Modules/cosovatchat/script/congtonuoc.js` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `cosovatchat/toanha` | `ApisKyTucXa/Modules/cosovatchat/script/toanha.js` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `danhmuc/danhmucdulieu` | `ApisKyTucXa/Modules/danhmuc/html/danhmucdulieu.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `diennuoc/diennuoc` | `ApisKyTucXa/Modules/diennuoc/html/diennuoc.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/chinhsach` | `ApisKyTucXa/Modules/hopdong/html/chinhsach.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/chuacohopdong` | `ApisKyTucXa/Modules/hopdong/html/chuacohopdong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/dacohopdong` | `ApisKyTucXa/Modules/hopdong/html/dacohopdong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hopdong/miengiam` | `ApisKyTucXa/Modules/hopdong/html/miengiam.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/dangkynguoio` | `ApisKyTucXa/Modules/hoso/html/dangkynguoio.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/hoso` | `ApisKyTucXa/Modules/hoso/html/hoso.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/khongtinhmien` | `ApisKyTucXa/Modules/hoso/html/khongtinhmien.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/khongtinhphi` | `ApisKyTucXa/Modules/hoso/html/khongtinhphi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `hoso/taomoihoso` | `ApisKyTucXa/Modules/hoso/html/taomoihoso.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/kehoach` | `ApisKyTucXa/Modules/kehoach/html/kehoach.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/kehoachdangky` | `ApisKyTucXa/Modules/kehoach/html/kehoachdangky.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/phanphongdangky` | `ApisKyTucXa/Modules/kehoach/html/phanphongdangky.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `kehoach/xepphongdangky` | `ApisKyTucXa/Modules/kehoach/html/xepphongdangky.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/apdungcongthucphi` | `ApisKyTucXa/Modules/taichinh/html/apdungcongthucphi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/chuyendulieuketoan` | `ApisKyTucXa/Modules/taichinh/html/chuyendulieuketoan.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/khoanthu` | `ApisKyTucXa/Modules/taichinh/html/khoanthu.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/mucluyke` | `ApisKyTucXa/Modules/taichinh/html/mucluyke.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/phidichvu` | `ApisKyTucXa/Modules/taichinh/html/phidichvu.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/phitheoloaiphong` | `ApisKyTucXa/Modules/taichinh/html/phitheoloaiphong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/phitheophong` | `ApisKyTucXa/Modules/taichinh/html/phitheophong.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `taichinh/tinhphi` | `ApisKyTucXa/Modules/taichinh/html/tinhphi.html` | **đã chuyển 12/10** (chuyển cả màn từ bản gốc mới nhất, không mở diff) |
| Ký túc xá (đang chuyển 12/10) | `xacnhandangkyphong/xacnhandangkyphong` | `ApisKyTucXa/Modules/xacnhandangkyphong/html/xacnhandangkyphong.html` | chưa chuyển (màn chưa làm — người dùng 12/10 bảo dừng; làm tiếp thì chuyển thẳng từ bản gốc hiện có, không cần diff) |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/hoso_capnhat` | `ApisSinhVien/Modules/hoso/html/hoso_capnhat.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/hoso_danhsach` | `ApisSinhVien/Modules/hoso/html/hoso_danhsach.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/quanlytoanbo` | `ApisSinhVien/Modules/hoso/html/quanlytoanbo.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/xemhoso` | `ApisSinhVien/Modules/hoso/html/xemhoso.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, chưa kiểm host) | `hoso/zoneEditModal_inject` | `ApisSinhVien/Modules/hoso/script/zoneEditModal_inject.js` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, chưa kiểm host) | `quyetdinh/quyetdinh` | `ApisSinhVien/Modules/quyetdinh/html/quyetdinh.html` | **đã chuyển 12/10** |
| Sinh viên (đã chuyển, chưa kiểm host) | `quyetdinh/quyetdinh` | `ApisSinhVien/Modules/quyetdinh/script/quyetdinh.js` | **đã chuyển 12/10** |
| Tài chính (đã chuyển, đã kiểm host) | `danhmucheso/taikhoanno` | `ApisTaiChinh/Modules/danhmucheso/html/taikhoanno.html` | **đã chuyển 12/10** |
| Tài chính (đã chuyển, đã kiểm host) | `danhmucheso/taikhoanno` | `ApisTaiChinh/Modules/danhmucheso/scripts/taikhoanno.js` | **đã chuyển 12/10** |
| Tài chính (đã chuyển, đã kiểm host) | `phieuthu/thutienkhac` | `ApisTaiChinh/Modules/phieuthu/scripts/thutienkhac.js` | **đã chuyển 12/10** |

---

## Lần kéo 8 (6/10) — mốc gốc nay là `3c3b2d70` (gốc lại force-push; `origin/main` trên máy từng bị lệnh push ghi đè thành commit của mình, fetch đã sửa)

Lần sau so: `git diff --name-status 3c3b2d70 origin/main`. Bốn tệp gốc đổi (hai màn), đã ghi đè bằng `git checkout origin/main -- <tệp>`, CHƯA mở diff.

| Phân hệ | Màn | Tệp gốc | Trạng thái |
|---|---|---|---|
| Cổng cán bộ (đã chuyển, đã kiểm host) | `lichgiang/lichgiangnhieuphonghoc` | html + js | **đã chuyển 6/10 chiều**: tìm phòng trống (lọc + hộp đổi lịch) không gửi `strKieuPhong` nữa (gốc: gửi 'LT'/'TH' thì thủ tục trả 0 phòng; loại đã lọc ở máy khách) → `goiTrong` gửi rỗng. Bỏ: đổi version script html, console.warn. **Kiểm lại trên host 6/10 tối ĐẠT** (thủ tục trả 242–250 phòng / ngày với `strKieuPhong` rỗng; lọc LT / TH ở máy khách 235 / 217 ô; hộp đổi lịch mở – đóng sạch). Sửa thêm: khoá nhớ kết quả bỏ loại phòng (đổi loại không gọi lại) — gói bổ sung chờ up |
| Quản lý tuyển sinh (đã chuyển, chưa kiểm host) | `tuyensinh/kehoachtuyensinhnew` | html + js | **chưa xem** — mở diff khi kiểm host Tuyển sinh |

## Lần kéo 7 (5/10 tối) — ĐÃ CHUYỂN HẾT, mốc gốc đã chuyển nay là `1680e53d` (gốc bị force-push từ `0551deba`)

Lần sau so: `git diff --name-status 1680e53d origin/main`. Ba tệp gốc đổi, đã ghi đè bằng `git checkout origin/main -- <tệp>`.

| Tệp gốc | Gốc đổi gì | `_v2` |
|---|---|---|
| KHCT `danhmuc/danhmucdulieu.html` | Mở lại ba ô lọc Dữ liệu cha / Trạng thái / Từ khoá + nút Tìm kiếm (script gốc vốn đã gắn sẵn, html trước chỉ có ô từ khoá) | ĐÃ CHUYỂN: bỏ `data-loc="q"` ở bản nạp chéo → hiện cả ba ô như Tài chính |
| `Core/systemroot.js`, `Corei/systemroot.js` | `randomInt(4)` → `randomInt(32)` cho `?v=` chống cache khi nạp html / js / Config.js | Vỏ cũ — `_v2` có cơ chế `?v=` riêng, không chuyển |

## Lần kéo 6 (5/10) — ĐÃ CHUYỂN HẾT 5/10, CHƯA kiểm host — 13 commit gốc `88f37941..0551deba` (1/10 → 5/10), mốc gốc đã chuyển nay là `0551deba`

Kho máy là bản GỘP một commit (`20b5dbe6`, 2/10) — không chung gốc với kho gốc → KHÔNG `git merge` được; đã ghi đè 20 tệp gốc bằng
`git checkout origin/main -- <tệp>` (mọi tệp trên máy đúng là bản gốc cũ, chỉ khác CRLF). Lần sau so: `git diff --name-status 0551deba origin/main`.

| Tệp gốc | Gốc đổi gì | `_v2` |
|---|---|---|
| CCB / QLD / TP `nhapdiem*`, `tuibai`, `phanquyennhapdiem*` (10 tệp) | Câu báo lỗi bỏ tiền tố "XLHV_NhapDiem/ThemMoi (er):" | Không cần — `_v2` vốn không có tiền tố này |
| TC `dulieuhocphi/tinhhocphi` | Bỏ chọn Lớp → nạp lại sinh viên (khi vùng SV mở); SV nạp khi mở vùng | ĐÃ CHUYỂN: thêm `select2:unselect/clear` |
| TC `phieuthu/thutien` | QR thanh toán mở `Init_API().TSV` nếu có | ĐÃ CHUYỂN (`_chung_thutien.js` `taoQR`) |
| NH `phanlop/phanlop` | Chương trình chỉ nạp khi có kế hoạch; khoá lùi `KHOADAOTAO_ID` / `DAOTAO_KHOAHOC_ID`; nhãn "Tên - Mã" | ĐÃ CHUYỂN (`taiCT`, `tenCT`; chặn khi chưa có kế hoạch vốn đã có) |
| TN `kehoach/xacnhan` (html + js) | Nút "Hạ bậc trực tiếp" (hộp Xếp loại + Lý do, mỗi người một lời gọi `pkg_totnghiep_tinhtoan.HaBacTrucTiep`); còn lại CSS | ĐÃ CHUYỂN — hộp thoại (thao tác hàng loạt), hỏi lại, chạy tuần tự; đường GHI mới, chưa thử host |
| TN `vanbang/quanlythongtin` (html + js) | Nút "Gán số vào sổ" (một SV → hộp chọn số chưa dùng theo quy tắc / năm → `PKG_VANBANG_CHUNGCHI.GanSoVaoSoTrucTiep`); còn lại CSS | ĐÃ CHUYỂN — hộp chọn, hỏi lại; đường GHI mới, chưa thử host |
| TS `tuyensinh/kehoachtuyensinhnew.js` (+540/−363) | Nguồn khai thác (đối tác TS): tra lùi `LayDS_TS_HoSo_DoiTacTS` (vì `Them_TS_HoSo_DoiTacTS` lưu IS_ACTIVE NULL), cột "Nguồn khai thác", tham số mới `strTS_DoiTacTuyenSinh_Id/_id/_Khac` cho Them/Sua_HoSo_TS; chặn trùng CCCD, khoá nút Lưu khi đang lưu; chọn ô theo chữ lỏng; danh sách mới nhất lên đầu (hai commit 1/10 tên "popup … pvp" thật ra là màn này) | ĐÃ CHUYỂN (`_khtsn_chung/khaiphu/khai/kqdk.js`) — bỏ khai báo trùng `_hsDotHienTai/_nvDauRaHienTai` (lỗi lùi của gốc 2/10) |
| `Core/systemroot.js`, `Corei/systemroot.js` | Gốc nay CÓ SẴN nút "?" Cổng Help (y bản máy); Core đổi hẹn giờ kiểm phiên bản 20 s → 300 s | Vỏ cũ — không chuyển; ghi đè theo gốc (ngoại lệ "nút ?" không còn cần) |
| `help-sso.aspx`, `help-jwks.aspx` | Gốc nay có hai tệp (y bản máy) | Không đổi |
| QLTTN + `App_Themes/Cms/Custom_V1/ums/` (lột da) | Gốc nhận phần lột da của máy (+ `modules.rar`, `ums.rar`, `quanlythi.css`, `giamsatthi.js`) | Trên máy đã trùng gốc mới; phân hệ chưa sang `_v2` |

## Trước lần kéo 6

Lần kéo 4 (30/9, merge `cffda56e`) + lần kéo 5 (1/10, merge `c6886b05`) — ĐÃ CHUYỂN 1/10: 20 màn (CCB `lichgiangnhieuphonghoc`, Cổng SV 18 màn,
màn mới Cổng SV `dicvusinhvien/nguoihocxacnhanthanhtoan`). Điều đã chốt: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-01". **CHƯA kiểm host, CHƯA commit** — danh sách màn cần kiểm: `_harness/kiem-host/VIEC-PHIEN-SAU.md` mục 1 (nhắc đầu tiên khi người dùng bảo "chuyển" / "kiểm").

Còn ghi nhớ (không phải việc chuyển lúc này): kho gốc có phân hệ mới `ApisThiTracNghiem/` và thay đổi `ApisQuanLyThiTracNghiem/` —
hai phân hệ chưa chuyển sang `_v2`, khi chuyển thì theo bản gốc mới nhất.
