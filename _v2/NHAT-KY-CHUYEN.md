# Nhật ký chuyển đổi từng phân hệ sang `_v2` (chuyển nguyên văn từ CLAUDE.md mục 11 ngày 2026-10-05)

Bảng tóm tắt phân hệ ở CLAUDE.md mục 11. Tệp này giữ nguyên văn: lịch sử các lần kéo gốc (1–6), "Đã làm đến đâu", và việc 1–21
(từng phân hệ: vai trò mẫu, khung chung, lỗi gốc đã sửa, điểm chờ nghiệp vụ, nợ tầng chung). Điểm đã chốt: `CAN-QUYET-DA-CHOT.md`.

## Lịch sử kéo kho gốc (lần 1 → 6)

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

Lần 6 (2026-10-05, 13 commit gốc `88f37941..0551deba`, 1/10 → 5/10) — **ĐÃ CHUYỂN 2026-10-05, CHƯA kiểm host**. **Kho máy nay là bản GỘP một commit** (`20b5dbe6`, 2/10, đã lên LoginVT-V2) — KHÔNG chung gốc với kho gốc nên không `git pull`/`merge` được: kéo bằng `git fetch origin` rồi `git checkout origin/main -- <tệp>` cho từng tệp gốc đổi (trước đó kiểm tệp máy = bản gốc cũ theo nội dung, bỏ CRLF). Mốc gốc đã chuyển ghi đầu `_v2/CHO-CHUYEN-SAU-PULL.md`. Màn: TC `tinhhocphi`, thu tiền QR; NH `phanlop`; TN `xacnhan` (Hạ bậc trực tiếp), `quanlythongtin` (Gán số vào sổ); TS `kehoachtuyensinhnew` (nguồn khai thác). Gốc nay có sẵn nút "?" Cổng Help trong Core / Corei và hai trang help-*.aspx → ngoại lệ "không ghi đè" ở mục 9 không còn cần. Chốt: `CAN-QUYET-DA-CHOT.md` mục "Kéo gốc lần 6".

Lần 7 (2026-10-05 tối, gốc force-push `0551deba` → `1680e53d`, 3 tệp) — **ĐÃ CHUYỂN cùng tối**: KHCT `danhmuc/danhmucdulieu.html` mở lại ba ô lọc Dữ liệu cha / Trạng thái / Từ khoá (bản nạp chéo `_v2` bỏ `data-loc="q"`, đã đo đủ ba ô); Core / Corei chỉ đổi độ dài `?v=` chống cache → không chuyển. Bảng tệp: `_v2/CHO-CHUYEN-SAU-PULL.md` "Lần kéo 7".

**Cùng ngày — ba luật bảng ở tầng chung** (BO-CUC luật 17 + ghi nhớ): cột ô đánh dấu chọn dòng tự về CUỐI bảng (`ums.ui.table`, `data-cot-goc`, `ums.ui.oTheoGoc` cho báo cáo / import); ô đánh dấu trong ô bảng căn giữa theo chữ; "Thông tin lịch" nhiều khối thành danh sách `.ums-dsl` (`ui.escBr`); mục cột trái mã dài tự xuống dòng. `thu-crud` nhận thêm tên thủ tục `_Create` / `_Update`.

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

20. **Tốt nghiệp (ApisTotNghiep) — XONG 13/13 (2026-10-05)**, 5 tác tử con. Vai trò mẫu **R16**, ID `TN-<module>-<tệp>` (tên menu theo tệp).
   Kiểm: `kiem-dong-bo?vt=R16&tien=TN&coTep=1` 13/13; `thu-crud` 8/13 — ĐÚNG THIẾT KẾ: ba màn thiết lập tab 2 chặn Thêm tới khi chọn Phân loại
   + Phân cấp (y Học bổng), `kehoach/kehoach` lưu xong ở lại biểu mẫu (như gốc), `vanbang/quanlythongtin` bắt tìm SV rồi Xem / Kế thừa mới cho Lưu;
   `kiem-cot-trai` 1/1; biểu tượng 0 lệch; hồi quy Học bổng 12/12 + 7/12 (không đổi).
   Thiết lập dùng lại `ums.hbDk` (`thamsochung` nạp THẲNG tệp Học bổng; sửa HB `_dk.js` cờ `tuKhoa` đối tượng, `xeploaihabac.js` tách `ums.hbXlhb`);
   `thuchienxet` / `xacnhan` / `tonghop` dùng lại `ums.hbKh` / `ums.hbTh` + `ums.khxl` (HB `_kh_chung.js` thêm cờ `napPhanCong` `action/khoa`, `hopDS`
   `khoaKQ/phanTrang/onTim`); khung riêng: `kehoach/script/_tnkh_*.js` (`ums.tnKh`), `_tndkn_*.js` (`ums.tndkn`, điều kiện nhóm),
   `vanbang/script/_tnvb_*.js` (`ums.tnvb`, `ums.tnvbPhoi` — phôi in văn bằng, `eval` thay bằng bộ tính biểu thức an toàn, html2canvas trong module);
   `hoctap/xemdiem_sv` (`ums.tnXemDiem`, trên `ums.diemHoc`); danh mục nạp DKH. Chốt: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-05 — Tốt nghiệp";
   1 việc dữ liệu (`dieukiennhom`: thiếu thủ tục xoá lệnh từ khoá — bản cũ gọi nhầm thủ tục xoá Khoản thu Tài chính). CHƯA kiểm host.

21. **Quản lý thi trắc nghiệm (ApisQuanLyThiTracNghiem) — XONG 16/16 (2026-10-05)**. 13 màn đầu 2 tác tử con (5/10); ba màn cuối tự làm (không tác tử — người dùng 5/10):
   `quanlybode/quanlybode`, `quanlybode/taodethucong` (`ums.bode` nạp chéo `ums.nhch`; dữ liệu mẫu chung `_bode.demo.js`), `quanlythi/quanlythi` (`ums.qlt`:
   `_qlt_chung.js` tạo đề + báo cáo mã xác nhận, `_qlt_phong.js` biểu mẫu phòng thi + cán bộ coi / chấm, `_qlt_import.js` import phòng thi / DS thí sinh — trên khung
   `ums.coiThi.manPhong` + `gst.chiTiet` của Cổng cán bộ mở rộng bằng cờ `locThem / dotThi / thamSo / toolbar / tacVu đối tượng / sua / sauDung / tools / onCt / tenBam /
   baoCaoMa / baoCaoChay / tinhLaiSauGhi / sanSang`). Vai trò mẫu **R12**, ID `QLTTN-<module>-<tệp>` (thư mục gốc chữ thường `modules`).
   Kiểm: `kiem-dong-bo?vt=R12&tien=QLTTN&coTep=1` 16/16; `thu-crud` 16/16; `kiem-cot-trai` 3/3; biểu tượng 0 lệch; trang dò tạm bấm sâu ba màn cuối (cấu trúc đề ba tab, thêm
   đề thi, thêm câu vào đề thủ công 2 → 4, import phòng thi → thêm phòng, tạo đề một phòng / nhiều phòng, mật khẩu phần thi, thí sinh thêm / sửa, hộp tình huống) 0 lỗi JS —
   bắt được 1 lỗi: bộ chặn bấm của khung Import nuốt luôn nút của chính khung (đã sửa). Chốt: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-05 — Quản lý thi trắc nghiệm";
   không có việc dữ liệu (CHƯA kiểm host; phân hệ thêm vào `ums.canQuyetChuaKiem`). ApisThiTracNghiem (trang làm bài .aspx) DỪNG theo người dùng 5/10.

22. **Tin tức (ApisTinTuc) — XONG 4/4 (2026-10-05 tối)**. Vai trò mẫu **R46**, ID `TT-<module>-<tệp>`. Hai tác tử con (tintuc, guithongbaoappsinhvien) bị cắt
   giữa chừng vì hết hạn mức phiên → `tintuc.js` (gốc 3.017 dòng) tự viết: `ums.crud` (biểu mẫu 4 nhóm, `ums.editor` nội dung, tệp `SV_Files`, ảnh bìa `avatar`,
   ô tin ưu tiên `checks`) + hai khung `pat.formTrang` "Phạm vi áp dụng" (`pat.phamVi`) và "Gửi Email" (lọc Hệ / Khoá / CT / Lớp chọn nhiều tự dựng bằng
   `ums.ref.*` + `pat.chain`, bảng SV phân trang máy chủ, `ui.batch` gửi từng người, Import Excel bằng `assets/vendor/xlsx` nạp khi bấm) + hộp Quản lý chuyên mục
   (`CMS_DanhMucTenBang` → `CMS_DanhMucDuLieu`, nạp lại hai ô chuyên mục không qua bộ nhớ `api.dm`). `guithongbaoappsinhvien` tác tử viết xong (3 khung formTrang,
   `boLocNguoiHoc`), `vanban` ums.crud (thêm ô Loại văn bản), `danhmucdulieu` nạp chéo ĐKH. Kiểm: `kiem-dong-bo?vt=R46&tien=TT&coTep=1` 4/4; `thu-crud` 4/4;
   `kiem-cot-trai` 1/1; biểu tượng 0 lệch; trang dò tạm bấm sâu Thêm / Sửa / Quản lý chuyên mục / Phạm vi / Gửi email / Import (không lỗi console).
   Chốt: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-05 (tối) — Tin tức"; không có việc dữ liệu (CHƯA kiểm host; thêm vào `ums.canQuyetChuaKiem`).

23. Các phân hệ còn lại (Ký túc xá 22 mục menu host, Luận văn 14, TKGG 12, Danh hiệu; Thi trắc nghiệm — trang làm bài — dừng). Tổng 859 màn hình, xem mục 7 để biết vì
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

