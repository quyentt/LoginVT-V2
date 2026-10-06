# Việc cho phiên kiểm host kế tiếp

Viết 2026-09-30, cuối phiên kiểm host 29–30/9. Người dùng tạm nghỉ sau phiên này.
Khi người dùng bảo "kiểm host": ĐỌC TỆP NÀY, đưa THÔNG BÁO tình hình (mục 0) rồi mới chạy. Làm xong việc nào thì xoá / sửa việc đó ở đây.

Quy ước bắt buộc (chi tiết ở CLAUDE.md mục 9 và bộ nhớ):
- Cuốn chiếu từng phân hệ: đọc sâu → thử ghi (thêm thì xoá) → sửa mã / ghi việc CSDL → ghi sổ → DỪNG báo cáo.
- Phân hệ MỚI chỉ kiểm khi người dùng yêu cầu đích danh.
- Xử lý được bằng MÃ thì sửa mã + ghi sổ lỗi mã, KHÔNG báo lỗi CSDL.
- "Ghi chú chuyển đổi" do người kiểm VIẾT THẲNG (bấm gì → thấy gì → ảnh hưởng → ai làm gì), không bê câu lỗi thô của máy chủ.
- (C, 30/9) Thiếu dữ liệu đầu vào (danh mục rỗng, chưa có bản ghi cha) mà TẠO ĐƯỢC trong ứng dụng thì sang màn đó tạo, thử xong xoá cả bản ghi thử lẫn dữ liệu
  phụ (con trước cha; không có đường xoá thì không tạo). Làm đến đâu sạch đến đó. Trước khi ghi việc CSDL, so tên tham số với màn khác gọi cùng controller.
- Sau mỗi lượt thử ghi phải quét dấu ZKT (dữ liệu ghi lan). Chỉ ghi vào hồ sơ của tài khoản thử (`TIM="Kadara"`).

## 0. Thông báo phải đưa ra đầu phiên

Chạy rồi tóm tắt cho người dùng:
```
node _harness/kiem-host/loi-code.js ds          # lỗi mã đang treo
ls _v2_bo_xung_deploy                            # còn tệp = chưa up
git status --short                               # thay đổi chưa commit
```
Tình hình kết ngày 30/9 (tối): mọi gói đã lên host (so băm, `--da-up`), gói bổ sung TRỐNG, **sổ lỗi mã TRỐNG**, đã commit + đẩy git.
Trong ngày: chuyển 93 hộp thoại thêm / sửa sang biểu mẫu trong trang (`ums.pat.formTrang`, sổ `_v2/RA-HOP-THOAI.md`), thêm phím Esc đóng từng tầng,
Tài chính thử ghi xong (19 màn sạch), Nhân sự kiểm lại sau khi đổi. Người dùng dặn: việc phụ cứ làm; thử ghi PHÂN HỆ nào thì chờ người dùng quyết.
**Đợt chuyển hộp thoại MỚI kiểm trên host ở Nhân sự + 4 màn Tài chính** — 12 phân hệ còn lại chỉ mới dò bằng dữ liệu mẫu trên máy: khi kiểm host phân hệ nào
thì mở các màn ghi `xong 30/9` của phân hệ đó trong `RA-HOP-THOAI.md` (bấm Thêm / Sửa: không có `dialog[open]`, một nút Đóng, Esc đóng đúng tầng, Lưu chạy đúng).

## 0a. Cổng sinh viên 6/10 (chiều) — ĐÃ HOÀN THIỆN, CHỜ UP app.js

- 22/22 màn trên menu host đọc sâu sạch; thử ghi `dongphuc` sạch; 21 màn xếp loại không thử có lý do (sổ); 15 màn ngoài menu: host chưa khai chức năng.
- Gói bổ sung: `assets/js/app.js` (đóng hộp thoại khi đổi màn). Sau khi up: mở Đồng phục → "Kết quả đã đăng ký" → bấm Back trình duyệt → không còn hộp đè.
- Trang tiến độ: cột "Chưa kiểm (lý do)" + `xep-loai-chua-kiem.py` — phân hệ kiểm xong mà còn "CHƯA XẾP LOẠI" thì chạy script này (`--ghi`).

## 0b. Kiểm host Cổng cán bộ 6/10 (01:00–01:40) — CHỜ UP rồi kiểm lại

- Đọc sâu lại hai vai trò host "Cổng cán bộ" (25 màn) + "Cổng cán bộ(admin)" (87 màn): 0 lỗi mới; 6 màn lỗi cũ đều đã có `ben` (coithi, duyetdiemthitracnghiem: dịch vụ QLTTN
  không chạy; tracuulichgiang ORA-01427; thongke/henganh thiếu API KHCT_NamNhapHoc; nhapdiemchamkiemtra gói PL/SQL lỗi; capnhathoso ảnh tạm 404 — mới ghi `ben` nghiepvu).
- Thử ghi: `sukien/kehoach` sạch (thu-ghi); `luanvan/giaodetai` kho đề tài thêm → xoá sạch, biểu mẫu hai tầng không hộp thoại, một nút Đóng, Esc đóng từng tầng (lái tay);
  `khaosat/phieu` thêm nhóm câu hỏi được nhưng XOÁ bị máy chủ từ chối → nhóm `ZKT0119` CÒN SÓT (ghi `ben` + CLAUDE.md); `khaosat/kehoach`, `khaosat/phieu` thêm bị từ chối
  vì màn chưa kiểm ô bắt buộc → ĐÃ SỬA (required), sổ lỗi mã "chờ kiểm lại".
- Up lần 1 + 2 (01:40, 01:48): `khaosat/phieu` và `khaosat/kehoach` thu-ghi sạch, sổ lỗi mã TRỐNG. Bộ thử tự động coi "Xóa (N)" đầu danh sách kế hoạch là xoá — thực ra
  là đặt lại kết quả tạo phiếu (như gốc), xoá kế hoạch nằm trong biểu mẫu ("Xóa kế hoạch", crud `formRemove`) → màn có cả `remove` lẫn `formRemove` thì thu-ghi phải xoá qua biểu mẫu.
  Không thử nhóm câu hỏi nữa (còn sót ZKT0119).
- **65 màn CCB không có trên menu hai vai trò host** (người dùng 6/10: "phải ghi rõ"): sổ `da-kiem.json` doc = `khong-tren-menu`, trang tiến độ hiện riêng. Nhóm: klgd 28 (cả bộ
  qlklgd_*), dashboardv2 9, thi 7, coithi 3, sanphamkhoahoc 3, nhapdiem 3, hoatdong 3… Đối chiếu bản xuất mapping host (619 chức năng): **16 màn CÓ chức năng trong CSDL
  nhưng chưa gán vai trò thử** (dashboardv2 9, thi 5, daqhht, duyethoidong — ghiChu từng màn có functionId; cách kiểm: gán vào vai trò thử rồi chạy `chay-vaitro`),
  **49 màn host CHƯA KHAI chức năng** (cả klgd 28) — không ai mở được trên host.
- **HOÃN (người dùng 6/10: "để chờ đó đã"):** trang "Toàn bộ màn" (`?full` / `#/full`, danh sách 747 màn sinh lúc đóng gói, mở màn theo đường dẫn tệp dưới vai trò
  đang đăng nhập, `strChucNang_Id` mượn nếu host có) + `chay-vaitro.js FULL=1` để đọc sâu màn không có chức năng. Chỉ làm khi người dùng gọi.
- Chưa thử ghi (không có đường xoá hoặc đụng dữ liệu thật): lichgiangphonghoc (đăng ký phòng), phangiangvien, nhapkl, tuibai/_dst (điểm), thanhtoangiangday, lichhocsv,
  moigiang (tạo hồ sơ nhân sự), dukienhocphan, _qhht_hoso, doilich, thi/_chung phân công. Màn `sukien/sukien` không có trên menu host.

## 1. Làm TRƯỚC — màn đã sửa mã, chờ kiểm lại

### Kết quả kiểm host 5/10 (chiều) — phân hệ ĐÃ hoàn thành + Cổng cán bộ / Cổng SV

- ĐẠT: TC Tính học phí (bỏ chọn Lớp nạp lại SV), CCB Lịch giảng đường nhiều phòng học (lọc phòng trống khoảng ngày, lưới phòng × ngày, hộp đổi lịch —
  không thử ghi: tài khoản thử không có buổi dạy), CCB hai màn lịch hồi quy, Cổng SV 22 màn đọc sâu (0 lỗi JS / máy chủ) + bảng điểm bấm cả dòng.
- Khung "Cần làm trước" trên host: hiện đúng ở TC kehoachthuchi (3 danh mục), baocao (2), thutienkhac (2).
- **ĐÃ UP, KIỂM LẠI ĐẠT (5/10):** nút "Mở Danh mục dữ liệu" khi vai trò không có màn danh mục nhảy nhầm Ký túc xá (404) → sửa: chỉ mục tìm màn
  đường dẫn đầy đủ + kiểm tệp có trong _v2; Tính học phí gọi hai lần khi xoá Lớp → gộp. Kiểm lại: TC kehoachthuchi bấm "Mở Danh mục dữ liệu" → phải sang
  Quản trị hệ thống → Danh mục dữ liệu và chọn sẵn TAICHINH.MOHINH_PHIEUTHU (chỉ xem, không thêm giá trị).
- Backend mới (đã ghi can-quyet): TC Thu tiền → Tạo QR thanh toán 404 — host chưa khai TSV trong Config.js.
- Không kiểm được: XLHV Kế hoạch xử lý bảng điểm — mọi kế hoạch trên host trỏ người học mất hồ sơ (mã / tên null). DaQHHT không có trên menu host.
- Còn lại của đợt (chờ người dùng gọi tên): NH Phân lớp, TS Kế hoạch tuyển sinh (new), Tốt nghiệp 13 màn.

### ⚠ Đợt 5/10 — ĐÃ UP (5/10), CHƯA KIỂM HOST, CHƯA COMMIT

**Tốt nghiệp (13 màn, phân hệ MỚI — kiểm khi người dùng gọi tên):** vai trò Xét tốt nghiệp trên host; chốt ở `CAN-QUYET-DA-CHOT.md` mục "Tốt nghiệp".
Ưu tiên: `dieukiennhom` (nút Xoá lệnh khoá — đã ghi can-quyet), `kehoach` (Lưu ở lại biểu mẫu, tab 1 điều kiện chặn khi chưa Kế thừa),
`thuchienin` (phôi in: bộ tính biểu thức thay eval, QR từ `CTT_Token/TaoQRCode`), sửa xâu tab 2 điều kiện nhóm có mất Ngày áp dụng không.

**Kéo gốc lần 6 (màn ĐÃ kiểm host trước đây — kiểm lại phần đổi):**
| Màn | Kiểm gì |
|---|---|
| TC Tính học phí | Bỏ chọn Lớp → danh sách SV nạp lại |
| TC Thu tiền → Tạo QR thanh toán | Mở đúng địa chỉ (Config.js có `TSV` thì dùng `TSV`) |
| NH Phân lớp | Ô Chương trình "Tên - Mã", có dữ liệu sau khi chọn kế hoạch |
| TS Kế hoạch tuyển sinh (new) | Cột "Nguồn khai thác", Sửa hồ sơ hiện đúng nguồn; Thêm trùng CCCD bị chặn; mới nhất lên đầu (thử ghi: thêm thì xoá) |
| TN Xác nhận → Hạ bậc trực tiếp · TN Quản lý thông tin → Gán số vào sổ | Đường GHI mới — chưa có đường hoàn lại rõ → chỉ mở hộp, KHÔNG bấm Đồng ý tới khi người dùng cho |

### ⚠ 20 màn chuyển từ kéo gốc lần 4 + 5 — ĐÃ UP (1/10 02:52), CHƯA KIỂM HOST, CHƯA COMMIT GIT

Chuyển 1/10 ở workspace đám mây (shell máy không chạy), đã ghi về máy + gói bổ sung 36 tệp người dùng đã up, mốc `.moc-da-up.json` đã cập nhật.
Phiên 1/10 dừng ở bước đăng nhập host (Claude in Chrome: profile Chrome của tiện ích chưa có phiên đăng nhập `qtdhgit/_v2` — người dùng phải tự bấm
Đăng nhập ĐÚNG tab trong nhóm tab Claude; Claude không tự đăng nhập bằng mật khẩu). Bộ kiểm `_harness/kiem-host` (Edge + tk.md) chạy trên máy thì không vướng.
**Khi người dùng bảo "chuyển" hoặc "kiểm host": NHẮC việc này ĐẦU TIÊN.** Kiểm xong đạt → commit + đẩy (các tệp dưới đây + CLAUDE.md, CAN-QUYET-DA-CHOT.md,
CHO-CHUYEN-SAU-PULL.md, VIEC-PHIEN-SAU.md, `.moc-da-up.json`). Điểm tự chốt: `_v2/CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-01". CHỈ ĐỌC ở Cổng SV (ghi = dữ liệu SV thật → hỏi trước).

| Màn (menu host) | Kiểm gì |
|---|---|
| CCB Lịch giảng → Lịch giảng đường nhiều phòng học | Lọc phòng trống khoảng ngày + thứ + tiết (`TKB_CHUNG.LAYPHONGHOCTRONG`, xem cột ID trả về); 1 ngày → lưới 1 ngày; nhiều ngày → bảng phòng × ngày; ô "Trống" → biểu mẫu đổi lịch chỉ còn phòng trống |
| CCB lịch giảng nhiều phòng (giảng viên), Lịch học SV, In bảng điểm → Lịch học | Hồi quy (`_nhieu.js`, `ums.lich`, `ums.tkbSV`) |
| CCB Hoạt động → DaQHHT | Hồi quy: bảng điểm chỉ mở bằng nút Chi tiết (không bấm cả dòng) |
| CSV Đăng ký học → Đăng ký | Thời gian `dd/mm/yyyy hh:mm`; đăng ký / huỷ xong tự nạp lại Kết quả + Tình trạng tài chính |
| CSV Nguyện vọng · Thi lại · Xác nhận nhập học | Ô Ngành + chain; cột "Đã nộp"; lịch sử xác nhận (tên cột thời gian) |
| CSV Đăng ký cơ sở đào tạo | `LayHoSoNguoiHoc_TongQuan`; `DS_KH_NH` có `DA_DANGKY` / `COSODAOTAO_ID_DACHON`; cơ sở đúng (không lấy id dòng) |
| CSV Công nhận điểm, v3 · Hồ sơ | Hồi quy (không đổi) |
| CSV Học tập → Điểm học · Chương trình học · Công nhận điểm · Hoãn tốt nghiệp | Bấm cả dòng mở điểm thành phần, dòng tổng TC CTĐT; ô tìm lọc tại chỗ; câu "chưa có dữ liệu" |
| CSV Lịch học | Đầu cột chỉ số ngày; khối lớp không có lịch chi tiết đứng trước, đủ 6 cột |
| CSV Tự nhập hồ sơ | Ảnh tải lên tự lưu ("Đã lưu ảnh đại diện"); trường theo nhóm; tab rỗng ẩn; ô con lọc theo cha |
| CSV Thanh toán trực tuyến | Đổi ngân hàng nạp lại bảng, mã ngân hàng đúng (VCB → VCB_ONLINE…) |
| CSV Tình hình học phí (+ Xuất hoá đơn) | 3 nhóm thẻ; bấm thẻ mở chi tiết; không dòng KHONGHACHTOAN; cột `TRANGTHAINGUOIHOC_N1_*` |
| CSV Tin tức · Trang chính | 3 nhóm tin + Xem thêm; bấm tin gọi `LayTinTuc_BangTin_ChiTiet`; lọc tại chỗ; dashboard 4 lối tắt + 3 nhóm tin |
| CSV Kiểm tra thông tin cá nhân (màn mới `dicvusinhvien/nguoihocxacnhanthanhtoan`) | Mở được; lời gọi gửi đúng id người học |
| XLHV Kế hoạch xử lý · SV Kiểm tra thông tin cá nhân | Hồi quy (dùng chung `ums.diemHoc`, tệp SV) |


| Màn | Đã sửa gì | Kiểm lại thế nào |
|---|---|---|
| Sinh viên → hồ sơ (`hoso/_hsA.js`) | Kiểm ngày sinh trước khi gửi | Đã up 30/9, CHƯA kiểm trên host (phân hệ Sinh viên chưa kiểm — chỉ kiểm khi được yêu cầu) |

Xử lý học vụ (1/10): 6 lỗi mã (ô bắt buộc, câu báo trùng, cột Kết quả điều chỉnh, strTrack_Id, Kế thừa điều kiện chuẩn khi kế hoạch 0 sinh viên) đã up và
**kiểm lại ĐẠT** bằng tệp thật trên host, đã gỡ khỏi sổ. **Sổ lỗi mã TRỐNG, gói bổ sung TRỐNG.**


ĐÃ KIỂM ĐẠT trưa 30/9 (đã gỡ khỏi sổ lỗi mã), đều trên hồ sơ tài khoản thử, không còn bản ghi thử nào hiện trên màn:
- Khen thưởng - Kỷ luật, Danh hiệu - Học hàm (Nhân sự + Cổng cán bộ): thêm rồi xoá, đối chứng `LayChiTiet` quyết định kèm có → không. Kỷ luật / khen thưởng /
  danh hiệu: máy chủ NAY TỰ XOÁ quyết định kèm (màn tìm không thấy gì để dọn). Học hàm: máy chủ không xoá, màn dọn đúng 1 quyết định.
  Quyết định kèm khen thưởng mang TRANGTHAI = 0 (kỷ luật / danh hiệu / học hàm = 1).
- Đề xuất hồ sơ: Sửa hồ sơ chưa có định danh / liên hệ → Lưu → "Đã lưu hồ sơ. Chưa nhập: …", không còn ORA-01400, không gửi dòng trống.
- Quản lý quyết định: thêm qua giao diện hiện NGAY trong danh sách (gửi `iTrangThai`); mở lại quyết định vừa lưu thấy thành viên (lấy từ `LayChiTiet`, chỉ xem);
  xoá được — đạt 30/9. Khung ghi chú mới (nhóm "Lỗi đã kiểm … yêu cầu backend", huy hiệu đỏ, không còn phần tự ghi) đã chạy trên host.
- Cổng cán bộ biểu mẫu thông tin cơ bản (`_qhht_chung.js`): màn `DaQHHT` KHÔNG có trên menu host của ba vai trò Cổng cán bộ (chỉ có ở Sinh viên — phân hệ chưa kiểm)
  → đã thử trên máy: 31/02, tháng 13, chữ "abc" bị chặn, không gọi máy chủ; ngày hợp lệ gửi bình thường. Kiểm trên host khi kiểm Sinh viên.
- Thông báo nổi hiện lâu hơn (6 / 9 / 12 giây + theo độ dài): bản mới đã chạy trên host.
- Rèn luyện → Tiêu chí điểm áp dụng (tối 30/9, hai lần up): Sửa có sẵn ô Thời gian / Hệ; dòng con kế thừa thụt dưới dòng cha, Sửa giữ tiêu chí cha — đạt.
- Tài chính (kiểm lại tối 30/9 sau khi up): Khai định mức phí (sửa ô chỉ mở một biểu mẫu), Đơn vị phí khối kiến thức (lưới hiện cột, thêm / sửa / xoá qua giao diện),
  Phân bổ doanh thu (mở màn không lỗi, chặn ô số sai) — đạt.
- Nhân sự — khối Danh mục thành phần ở ba màn thiết lập bảng lương: thêm hiện ngay, sửa đổi đúng, xoá đúng — đạt.
- Học hàm với `ref.js` mới (tìm quyết định kèm ở cả trạng thái 1 và 0): kiểm lại chiều 30/9 sau khi up — đạt.
- Đề xuất hồ sơ → Chi tiết → Gia đình → Thêm thành viên: 31/02, tháng 13, ngày 0, năm 2 chữ số đều bị chặn tại màn, không gửi; ngày hợp lệ thêm được.

**Bảng "Màn đang có lỗi backend" (30/9 tối):** ĐÃ UP, kiểm host ĐẠT (Tài chính 11 màn / 19 lỗi, bấm tên mở đúng màn, nút tổng 61 màn / 68 lỗi, ô tắt ở Cài đặt chạy đúng) — xem CLAUDE.md mục 10. Kiểm xong một phân hệ mới trên host thì gỡ tiền tố của nó khỏi `ums.canQuyetChuaKiem` (can-quyet.js).

## 2. Việc mã còn nợ

1. Phần tự chép câu lỗi thô ("Lỗi máy chủ vừa gặp"): ĐÃ GỠ cuối ngày 30/9 theo lời người dùng — lỗi đã kiểm thì viết thẳng mục `ben`; nhóm trên màn nay tên
   "Lỗi đã kiểm trên hệ thống thật — yêu cầu backend / CSDL xử lý", huy hiệu đỏ. Đã up và kiểm host đạt.
2. Rà mục việc CSDL trong `can-quyet.js`: ĐÃ RÀ 61 mục của các phân hệ đã kiểm host (30/9). Kết quả: gỡ 3 (Quyết định → sửa mã; hai màn Tra cứu in ấn → danh mục
   có dữ liệu), viết lại 2 (Hệ thống hoá đơn, Xử lý biệt lệ), thêm 1 (khen thưởng: quyết định kèm trạng thái 0). CHƯA rà ~30 mục của phân hệ chưa kiểm host
   (Sinh viên, Nhập học, Tuyển sinh, NCKH, Thi phách, Học bổng) — rà khi kiểm phân hệ đó. ĐỪNG đổi ORA-00001 thành câu thân thiện ở `api.js` (Hệ thống hoá đơn /
   biên lai: lỗi thủ tục, bản ghi vẫn tạo; crud đã tự nạp lại danh sách khi lưu lỗi).
3. Bố cục biểu mẫu hồ sơ mới (Họ / Tên đệm / Tên một hàng…) chưa áp cho biểu mẫu cùng loại bên Sinh viên — chờ người dùng bảo.
4. **Màn áp được quy ước C** (thiếu dữ liệu đầu vào, có thể tự tạo rồi xoá) — làm khi người dùng cho thử phân hệ đó: Nhân sự `nhansu/kehoach` + `kehoach/kehoach`
   (bảng danh mục NS.TD.PHANLOAI chưa có, mẫu hồ sơ tuyển dụng 0 dòng), `heso/xulybietle` (chưa có bảng danh mục), `luong/quydinhdongbaohiem` / `quydinhnangluong` /
   `quydinhphucap` (chưa có Bảng quy định lương; màn khai không có trên menu host), Cổng cán bộ `hoso/qtthongtin` (danh mục hoạt động nhân sự 0 dòng),
   Tài chính `kehoachthuchi` (3 danh mục mô hình phân bổ trống; đường xoá kế hoạch chưa từng chạy ở gốc).

## 3. Thử ghi còn dang dở ở 11 phân hệ đã đọc sâu

Sổ `da-kiem.json` còn nhiều màn "chưa thử ghi". Đề nghị thứ tự, mỗi phân hệ xong thì dừng báo cáo:

| Phân hệ | Vai trò | Màn trong sổ | Chưa thử ghi | Lưu ý |
|---|---|---|---|---|
| Tài chính | `8CA298…` | 50 | 0 | XONG 30/9 (lượt 2, theo quy ước C): 19 màn sạch (kể cả mức phí, đơn vị phí, đơn giá, hệ số, công thức, số tháng, kế hoạch hoạt động tài chính, gia hạn thu, phân bổ doanh thu); 6 màn tra cứu; còn lại không thử vì không hoàn lại được (thu tiền, hoá đơn, biên lai, gạch nợ, tính / chốt phí, chuyển kế toán, nhập tệp, chốt lớp riêng) hoặc gắn dữ liệu thật trước sinh viên (không bắt nợ → kế hoạch đăng ký thật; kết nối thanh toán → ngân hàng VNPAY). `hesolophocphan`: nguồn lớp học phần 0 dòng (đã ghi việc backend). Mẹo: thử ở hệ **Đào tạo khác** (khoá Tập huấn / Bổ sung kiến thức), khoản **Võ phục**, kỳ **2031_2032_2** để không đụng học phí thật |
| Cổng cán bộ | `9FE0F1…` `B0B172…` `9FDE9F…` | 88 | 73 | Hồ sơ cá nhân = hồ sơ tài khoản thử. KHÔNG thử nhập điểm / chấm thi / lịch giảng của lớp thật. 10 màn sản phẩm KH: id ThemMoi khác id danh sách |
| Quản trị hệ thống | `31C395…` | 41 | 37 | KHÔNG thử: người dùng, phân quyền, công cụ CSDL (comparetable, upcode, cloudupdate…) |
| Quản lý điểm | `4ADAFD…` | 39 | 29 | KHÔNG thử dữ liệu gắn lớp đã có danh sách thi / điểm (máy chủ chặn gỡ) |
| Cổng sinh viên | `80CF9E…` | 21 | 21 | Thủ vai `THUVAI="Đặng Bác Ái"`; ghi là ghi vào dữ liệu SV thật → hỏi người dùng trước |
| Đăng ký học | `D71078…` | 15 | 15 | Kế hoạch đăng ký hiện ra trước SV → hỏi trước |
| Xét học bổng | `D66824…` | 8 | 8 | Host thiếu cấu hình dịch vụ HB → chưa thử được gì |
| Rèn luyện | `4E6532…` | 8 | 0 | XONG 30/9: 6 màn sạch qua giao diện (kể cả nhập điểm: một ô, kỳ 2031_2032_2, đã xoá), xếp loại áp dụng Thêm / Sửa lỗi backend (đã ghi sổ), tổng hợp = tra cứu |
| Xử lý học vụ | `7CA2C9…` | 7 | 0 | XONG 1/10 (quy ước C): 5 màn sạch, Phê duyệt không thử (không có xoá), Thực hiện xử lý chỉ tra cứu (hàng đợi không xoá được). Mọi bảng về đúng số dòng cũ. 6 lỗi mã đã up + kiểm lại đạt; 2 việc backend: Xét báo "Có lỗi" giả, Xóa toàn bộ điều kiện áp dụng không xoá |
| Chuyên cần, Học lại | | | 3 / 1 | |

Nhiều màn trong số "chưa thử ghi" thực ra đã thử 24–26/9 bằng `thu-apdung.js` / lời gọi trực tiếp (xem CLAUDE.md mục 9) nhưng sổ chưa ghi — việc đầu tiên của mỗi
phân hệ là đối chiếu CLAUDE.md để điền sổ, rồi mới thử phần còn thiếu.

## 4. Phân hệ CHƯA kiểm (chỉ làm khi người dùng yêu cầu đích danh)

Sinh viên `2BD6D7…` · Kế hoạch chương trình `3EEBEF…` · Nhập học `D3FA56…` (+ 5 vai trò nhỏ: Thu hồ sơ NH, Thống kê NH, Tạo mức phí NH, Tạo kế hoạch NH,
Tạo kế hoạch TS) · Tuyển sinh `FB5151…` · NCKH `41FCFE…` · Thi phách `6F038B…`. Các vai trò khác trên host trỏ phân hệ chưa chuyển (Ký túc xá, Tốt nghiệp,
Khảo sát, Thi trắc nghiệm, Luận văn, Tin tức, TKGG…).

## 5. Bản ghi thử còn sót trên host (chờ quản lý CSDL xoá tay — đã có ghi chú trên màn)

| Ở đâu | Bản ghi | Vì sao không tự xoá được |
|---|---|---|
| Cổng cán bộ → Nhiệm vụ chiến lược, hồ sơ tài khoản thử | id `71F5751A5EA94D4983F8E45EB1B95456` ("ZKT1743S") | Thủ tục xoá báo thành công mà không xoá |
| Quản lý điểm → Công thức theo lớp HP, lớp `TTKT.03.K11.01.LH.C04BS.1_LT` | id `4084811E199B4D1EB4478890442FCE91` | Lớp đã có danh sách thi, máy chủ chặn xoá |

| Nhân sự → Đề xuất hồ sơ → Chi tiết hồ sơ tài khoản thử → Gia đình | id `B7393D0B89194B89BA90D4B54D263F9F` ("ZKT1180 Thu") | Xoá ở màn này là xoá MỀM (IS_ACTIVE = 0, như gốc): không hiện trên màn nhưng dòng còn trong CSDL. Không cần xử lý gấp |

Ngoài dòng xoá mềm trên, lượt trưa 30/9 không để lại bản ghi thử nào (danh sách quyết định host về 0 ở cả hai trạng thái).

## 6. Công cụ (trong `_harness/kiem-host/`)

`dangnhap.js` · `chay-vaitro.js` (đọc sâu; `SAU=1`, `CHI="id1,id2"`, `THUVAI=`) · `tom-tat.js <6 ký tự>` · `thu-ghi.js` / `thu-ghi-ui.js` (`TIM="Kadara" BAM=".ums-master__item" FULL=1`)
· `chay.js <role> <cnId|-> '<thân hàm>'` (lái tay; thân hàm để trong nháy ĐƠN) · `id.sh` · `ghi-da-kiem.js` · `loi-code.js` · sổ `da-kiem.json`
· `va-tam.js <idGốcMàn> <tệp.js…>` (mới 1/10: chạy MÃ VỪA SỬA trên host trước khi up — thay gốc màn đang mở rồi chạy tệp trên máy; `XOA="ums.x"` gỡ chốt tệp chung; tải lại trang là về bản host).
Thân hàm dài của `chay.js`: viết vào `%TEMP%/ums-kiem-host/xNN.txt` rồi `node chay.js $R - "$(cat …)"` (heredoc trong lệnh dài dễ vỡ nháy).
Kết quả thô ở `%TEMP%/ums-kiem-host` (ngoài dự án). Đừng mở DevTools / che cửa sổ Edge của bộ thử lúc đang chạy.
