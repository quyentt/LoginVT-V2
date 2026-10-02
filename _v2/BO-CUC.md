# Sổ bố cục — đọc TRƯỚC khi dựng bất kỳ màn hình nào

> **Khuôn để chép: [components.html](components.html)** (mở bằng máy chủ:
> `http://localhost:8787/_v2/components.html`) — mục **"0. Khuôn màn hình"**
> có sẵn khai báo đầy đủ cho màn một cột và màn hai cột, kèm bảng **"Lỗi vặt đã
> gặp"**. Mở nó ra chép, đừng dựng mới.

Hệ cũ có 859 màn hình nhưng chỉ khoảng **mười dạng bố cục**, lặp đi lặp lại
qua mọi phân hệ. Sổ này ghi các dạng đã dựng sẵn ở tầng chung. Gặp màn hình
mới: **tra sổ này trước**, thấy dạng nào khớp thì dùng lại; chỉ khi không có
dạng nào khớp mới dựng mới — và khi đó phải thêm dạng mới vào tầng chung
cùng một mục ở sổ này.

Không tra sổ mà tự dựng lại là cách chắc chắn để mỗi màn một kiểu — đúng
chuyện đã xảy ra ở đợt chuyển ApisTaiChinh: cùng một dạng màn hình ở bộ cũ,
sang bộ mới thành chỗ hộp thoại chỗ biểu mẫu, chỗ có select2 chỗ không.

---

## Quy ước bắt buộc (mọi bố cục)

0. **BÁM CẤU TRÚC BẢN GỐC — luật trùm lên mọi luật dưới đây.**
   Chuyển đổi là đổi *cách dựng* (thẻ, lớp, tiện ích dùng chung), KHÔNG đổi
   *cấu trúc màn hình*. Bản gốc một cột (thanh lọc ngang + bảng đầy trang) thì
   bản mới cũng một cột; bản gốc hai cột (danh sách trái + nội dung phải) thì
   bản mới cũng hai cột. Người dùng đã quen vị trí từng khối, đổi bố cục là
   bắt họ học lại màn hình mà không được gì.

   Cách kiểm trước khi dựng: mở `ApisTaiChinh/Modules/<module>/html/<tên>.html`
   của bản gốc, đếm vùng. Hai cột có dấu hiệu rõ: cặp `col-*-3` (hoặc `-4`)
   và `col-*-9` (hoặc `-8`) ở cùng cấp, cột trái chứa một `<table>` danh sách.
   `col-sm-3` đứng lẻ trong một hàng lọc thì CHỈ là ô lọc, không phải cột.

   Chỉ đi khác bản gốc ở những điểm người dùng đã nêu đích danh (bỏ nút trùng,
   ô chọn dùng select2, bảng qua `ums.ui.table`, biểu mẫu thay chỗ danh sách…)
   — nghĩa là khác ở *cách làm*, không khác ở *bố cục*. Gặp chỗ thấy nên đổi
   thì hỏi, đừng tự đổi.

   **KHÔNG DỰNG MỚI NẾU ĐÃ CÓ KHUNG TƯƠNG TỰ.** Trình tự bắt buộc trước khi
   viết dòng đầu tiên của một màn:
   1. Đếm vùng ở HTML bản gốc → một cột hay hai cột.
   2. Mở [components.html](components.html) mục "0. Khuôn màn hình", chép khuôn
      A (một cột) hoặc B (hai cột).
   3. Không hợp hai khuôn đó thì tra "Bảng tra nhanh" bên dưới — lưới nhập,
      bảng xoay, lưới thẻ, xem/in chứng từ, chọn sinh viên, nhóm ô đánh dấu,
      báo cáo/import, hàng đợi… đều đã có sẵn.
   4. Vẫn không có thì mới dựng mới, và dựng ở **tầng chung** (`assets/js` +
      `assets/css/components`), rồi ghi một dòng vào sổ này — không để trong
      module. Tự dựng riêng trong màn là cách chắc chắn nhất để lặp lại đúng
      những lỗi vặt đã liệt kê ở cuối mục "0. Khuôn màn hình".

1. **Thêm / sửa BẢN GHI CHÍNH: biểu mẫu thay chỗ danh sách, ngay trong
   trang.** Bấm "Thêm mới" mới hiện; không đẩy biểu mẫu ra sẵn khi mở màn.
   Lý do chọn cách này: nhiều chức năng có hộp thoại lồng trong hộp thoại,
   mà biểu mẫu trong trang thì không giới hạn chiều cao, nút "Lưu" vẫn dính
   đỉnh khi cuộn.

   **Hộp thoại** (`ums.ui.dialog`) chỉ dùng cho việc phụ: chọn sinh viên / học
   phần / phạm vi, xem phiếu, xem trước, tiến độ, xác nhận, gửi email, kế thừa.

   **MỘT chuẩn cho mọi màn (người dùng 2026-09-30: "màn hình thêm mới hiện bật modal… chuyển phải về một chuẩn nhất định") — bỏ ngoại lệ cũ
   "sửa một ô của matrix thì dùng hộp thoại".** Vào TRONG TRANG: (1) hộp mà nội dung chính là ô nhập rồi Lưu thành bản ghi — một bản ghi, một ô giá
   trị, hay lưới nhập nhiều dòng; (2) MÀN CON quản lý bảng con (danh sách + thêm / sửa / xoá). GIỮ hộp thoại: chọn từ danh sách rồi gán (kể cả gán
   quyền bằng ô đánh dấu), xác nhận / phê duyệt (kể cả có lý do), thao tác hàng loạt đặt một giá trị cho các dòng đã đánh dấu, xem (kể cả có một ô phụ).
   Biểu mẫu mở từ một hộp danh sách được giữ: đóng hộp danh sách → biểu mẫu trong trang → đóng biểu mẫu thì mở lại hộp danh sách.

   Khối dùng: **`ums.pat.formTrang({ host, title, icon, body, buttons, xoa, cols, flush, onClose })`** (patterns.js) — nhận cấu hình của `ui.dialog`,
   trả `{ body, el, close(), closed }`, bấm nút xong tự đóng trừ khi `onClick` trả `false` / nút có `keepOpen` (y hệt `ui.dialog`), nên chuyển từ hộp
   thoại sang gần như chỉ đổi tên hàm. `host` = vùng bị thay chỗ (gốc màn, hoặc một khung con đang mở → biểu mẫu thành tầng hai; lồng được nhiều tầng).
   Tầng chung tự lo: Đóng (trái) → Xoá → nút khác → Lưu; chỉ MỘT nút Đóng đang hiện; tầng hai mở thì dãy nút khung ngoài ẩn; ô ngắn hai ô một hàng
   (`cols: 1` để tắt); select2 / lịch gắn SAU khi màn đổ dữ liệu; biểu mẫu con giữa trang thì cuộn tới chính nó. Khác `ui.dialog`: không có thẻ
   `<dialog>`, nút mang `data-ft="N"` (không phải `data-dlg`), nằm trong `.ums-panel__tools`.
   **Bẫy khi đưa MÀN CON vào trang** (đã gặp 30/9): trình xử lý uỷ quyền gắn ở gốc màn bắt luôn nút / ô đánh dấu CÙNG THUỘC TÍNH của màn con
   (`[data-xem]`, `data-ck="all"`, "chọn tất cả") → một lần bấm chạy hai lần, hoặc đánh dấu cả bảng đang ẩn. Chặn bằng
   `if (b.closest('.ums-formtrang')) return` ở trình xử lý của màn, hoặc đặt tên thuộc tính riêng cho màn con.
   Đã rà và chuyển TOÀN BỘ 17 phân hệ ngày 30/9 (384 hộp, 93 hộp vào trang): danh sách từng hộp + lý do giữ ở **`RA-HOP-THOAI.md`**.
   **Phím Esc** (2026-09-30): đóng đúng TẦNG đang hiện — tầng chung bấm hộ nút "Đóng" đang hiện (`ui.btn('close')`), mỗi lần một tầng. Màn tự dùng
   Esc cho việc khác (huỷ sửa tại ô, đóng bộ lọc nổi) phải gọi `ev.preventDefault()`.
2. **Ô chọn: không bao giờ để ô chọn trần.** `ums.ui.enhance` tự gắn select2
   cho mọi `<select>` trong màn (kể cả ô mới vẽ thêm). Cần ô gốc thì đánh dấu
   `data-no-s2` và ghi lý do.

   **Hai ngoại lệ, `enhance` tự bỏ qua, không phải khai gì:**
   - Ô chọn **trong bảng** (`.ums-table`) — **ÍT MỤC THÌ KHÔNG DÙNG select2**
     (người dùng chốt 2026-09-22). Ô trong ô bảng thường chỉ vài mục (Có/Không,
     vài trạng thái, đơn vị tính…): select2 thêm ô gõ tìm vô ích, bảng trăm
     dòng thành trăm khung select2 nặng, khung xổ gắn ở `<body>` dễ lạc chỗ
     khi bảng cuộn ngang. Ô gốc đã được vẽ **giống hệt select2** (cùng khung,
     viền, bo góc, cỡ chữ, mũi tên) nên nhìn vẫn đồng bộ.
     `data-s2` CHỈ dùng khi danh sách dài tới mức phải gõ để tìm — ít mục mà
     gắn `data-s2` là sai luật. Ba đường lọt luật, đừng đi:
     · tự dựng `<table>` không qua `ums.ui.table` (mất lớp `.ums-table` →
       `enhance` bọc select2 như ô thường);
     · tự gọi `ums.ui.select2(el)` cho ô trong bảng (gọi thẳng thì bỏ qua
       kiểm tra của `enhance`);
     · gắn `data-s2` cho ô ít mục.
   - Ô chọn tháng **bên trong lịch** (`.flatpickr-calendar`): là ruột của thư
     viện, bọc select2 vào thì vỡ đầu lịch và mất ô năm. Ô chọn nhiều tự gom thành **một dòng tóm tắt**
   "Tất cả (12)" — không gim từng thẻ.
   - `data-ph="…"` = chữ gợi ý của ô.
   - `data-required` (hoặc `required`) = **tắt nút xoá trắng "×"** — dùng cho
     ô luôn phải có giá trị (vd "Kế thừa"), xoá trắng sẽ gửi tham số rỗng.
   - Đổ lại danh sách bằng `ums.pat.fill`: hàm này chỉ báo select2 vẽ lại,
     KHÔNG bắn `change` thật. Muốn bắt người dùng chọn thì nghe
     `select2:select` / `select2:clear`, đừng nghe `change`.
3. **Bảng: luôn qua `ums.ui.table`** (kể cả dòng tổng — dùng `sum: true` trên
   cột, đừng tự dựng `tfoot`). Bố cục bảng đặc biệt thì dùng `ums.pat.matrix`
   / `ums.pat.pivot`.
4. **CSS: không nằm trong module nếu dùng lại được.** Kiểu của bố cục nằm ở
   `assets/css/components/patterns.css`. Trong module chỉ giữ kiểu thật sự
   riêng của một màn, đặt ở `Modules/<module>/css/<tên>.css` và nạp bằng
   `<link>`. Không chèn CSS bằng JS.
5. **MỘT nút cho một việc, đặt ở đầu trang.** Nút "Thêm mới" nằm trong
   `.ums-page__actions` của `ums.pat.page`. Khung giới thiệu lúc chưa chọn gì
   chỉ ghi câu dẫn, KHÔNG đặt thêm một nút "Thêm mới" nữa.

6. **Thanh dính: nhóm nào cuộn tới thì nhóm ấy chiếm chỗ.** Luật ở
   `assets/css/objects/shell.css` (2026-09-21):
   - **Đầu trang** (`.ums-page__actions` có nút) dính ở mốc `--ums-stick-top`.
   - **Đầu khung** (`.ums-panel__head` có `.ums-btn` trong `.ums-panel__tools`)
     cũng dính ở ĐÚNG mốc đó, nhưng `z-index` cao hơn — nên cuộn tới khung nào
     thì thanh của khung ấy **vẽ đè, thay chỗ** thanh đang đứng. Nhiều khung
     thì khung sau thay khung trước, như tiêu đề từng mục trong danh bạ.
   - **Hàng tiêu đề bảng** KHÔNG dính vào trang — xem quy ước 7.

   Điều kiện viết bằng `:has()` + `:not([hidden] *)` nên tự đúng khi một vùng
   bị ẩn — kể cả màn tự dựng đặt cả đầu trang bên trong vùng danh sách.

7. **KHÔNG cuộn bên trong.** Danh sách hay lưới dài thì cuộn cả trang. Đã bỏ
   `max-height`/`overflow` của `.ums-master__list`, `.dmhsa-scroll`,
   `.ums-tablewrap--tall`. Lý do: vùng cuộn lồng nhau vừa khó dùng, vừa làm
   `position: sticky` bám nhầm khung — hàng tiêu đề bảng không dính được vào
   trang.

   **Cuộn NGANG thì GIỮ NGUYÊN** — bảng nhiều cột phải vuốt ngang được, nên
   `.ums-tablewrap` vẫn `overflow-x: auto` như cũ (kéo chuột để vuốt: xem
   `ums.ui`). Hệ quả phải chấp nhận: `position: sticky` bám vào vùng cuộn gần
   nhất, mà khung này LÀ một vùng cuộn — nên **hàng tiêu đề bảng không dính
   vào trang được**. Thanh dính của cả nhóm là `.ums-panel__head`, thế là đủ.
   Ngoại lệ còn giữ: hộp chọn nhiều ô đánh dấu trong thanh lọc (`.bc-pick`,
   `.hp-svbox`) — chúng là ô chọn nhỏ, bỏ giới hạn thì thanh lọc dài ra vô lý.
   Khung "Tìm nâng cao" ở cột trái thì KHÔNG cuộn riêng: dùng lớp chung
   `.ums-master__adv` + `.ums-master__tt` (Thu tiền, Chứng từ) — đừng tự viết.

8. **Nhóm ô đánh dấu: dùng lớp chung, đừng tự dựng khung.**
   - Nằm trong THÂN trang (rộng) → `.ums-checkgrid`: tự chia cột theo bề
     ngang (`repeat(auto-fill, minmax(220px, 1fr))`), 13 trạng thái sinh viên
     ở màn rộng thành 5 cột thay vì một hàng dài.
   - Nằm trong CỘT LỌC hẹp → `.ums-checklist`: một cột.
   Tự viết `display: flex; flex-wrap: wrap` thì lớp chung không với tới được —
   `lophocphan` từng mắc đúng lỗi này, sửa CSS chung mà màn đó không đổi gì.

9. **Nối tầng Hệ → Khoá → Chương trình → Lớp** (người dùng yêu cầu 2026-09-21,
   KHÁC bản gốc): chưa chọn tầng trên thì tầng dưới bị KHOÁ; chọn/xoá tầng trên
   thì xoá trắng tầng dưới. Các bộ nối tầng chung (`ums.ref.cascade`,
   `ums.ref.cascadeQuyen`, `ums.dmhsB.cascadeQuyen`, `ums.dmhsB.mucPhi`,
   `A.boLoc`, `D.khoaOnce`, `_chung_thutien`, `hoadon/_xuatdon`) đã có sẵn. Tự
   viết bằng `select2:select` thì thêm MỘT dòng sau khi gắn xử lý:
   `ums.pat.chain([he, khoa, ct, lop])` (màn đã tự nghe lúc xoá / nghe `change`
   thì thêm `{ phatLai: false }`). Lý do: bản gốc không bắt lúc xoá, và
   `pat.fill` giữ giá trị cũ nếu còn trong danh sách mới — bỏ Hệ thì danh sách
   Khoá là tất cả, khoá cũ vẫn nằm nguyên. Đã rà 32/32 màn có cặp Hệ/Khoá.

10. **Không tự viết lại tiện ích đã có**: tiền (`ums.pat.money` cho ô nhập,
   `ums.ui.money` để hiển thị), đọc số thành chữ, gọi API, danh mục đào tạo
   (`ums.ref`), báo cáo/import (`ums.report`), chọn sinh viên.

11. **Biểu mẫu: ô NGẮN hai ô một hàng, ô DÀI cả dòng** (người dùng 2026-09-26: "đừng để input dài full thế" →
   "những cái này 2 dòng 1 hàng chứ"). `ums.crud` tự làm: `formCols: 1` hoặc mọi ô `span` → lưới 2 cột; ở MỌI biểu mẫu
   `span` chỉ còn tác dụng với ô dài (`Crud.oDai`: textarea/tệp/nhóm ô đánh dấu, hoặc nhãn mô tả/ghi chú/nội dung/công thức/
   đường dẫn/địa chỉ/tiêu đề…). Ép ô ngắn cả dòng: `caDong: true`; giữ một cột thật: `formMotCot: true`. Biểu mẫu tự dựng:
   `ums-grid ums-grid--2`, ô dài bọc `<div style="grid-column:1 / -1">`.

12. **Cột trái có bộ lọc: ô tìm + nút Tải lại + nút "Bộ lọc nâng cao" (fa-sliders) trên tiêu đề cột; các ô chọn nằm trong
   khung `.ums-master__adv` ẨN SẴN ngay dưới ô tìm; KHÔNG có nút Tìm kiếm** — đổi ô chọn là tự tải, gõ từ khoá tự tìm sau
   400ms (người dùng 2026-09-26). Đã có sẵn ở `ums.pat.dsNhanSu` và danh sách trái của `ums.crud` (`master`). Ô lọc bắt buộc
   (`required` / `first`) thì khung mở sẵn. Nút lọc tô sáng (`.is-on`) khi khung mở hoặc đang có điều kiện lọc.
   Nút trên tiêu đề cột là **Tải lại (fa-rotate-right)**, KHÔNG phải kính lúp. Màn tự dựng đã đưa về khuôn này (26/9): Thu tiền
   (`_chung_thutien.js`), Thu tiền khác, Thu tiền qua POS, Chứng từ, Xuất hoá đơn, NS `sinhphieu`, `hesoluong`.
   (Thanh lọc ĐẦU TRANG có nút "Tìm kiếm" vẫn giữ Enter / nút — luật này chỉ cho cột trái.)
   **Không tự chọn khi danh sách còn đúng một kết quả** (gõ là tự tìm, nhiều người trùng tên — người dùng 2026-09-26): chỉ lọc,
   người dùng tự bấm. **Mục danh sách KHÔNG mang nút sửa / xoá / xem** — thao tác đặt trên tiêu đề khung bên phải (cạnh Đóng).

12b. **Nhóm nút trên bảng / khung: các nút chức năng → "Xoá đã chọn" → "Tải lại" (CUỐI CÙNG)** (người dùng 2026-09-26).
   Tải lại và Xoá đã chọn là nút NHẸ, nhỏ hơn nút chức năng; Tải lại chỉ có biểu tượng ↻. Dùng `ui.btn('reload', { attr })`
   (chữ mặc định → tự vẽ `.ums-btn--tailai`, bỏ qua màu màn truyền vào) và `ui.xoaChon`; thứ tự do CSS `order` lo, màn không
   tự sắp. KHÔNG viết tay nút "Tải lại" bằng HTML, không tô vàng/xanh. (Chân hộp thoại vẫn: Xoá dạt trái.)

13. **Khung "Chi tiết" chỉ xem (`.ums-kv`): chỉ TÊN in đậm, giá trị khác chữ thường** — dòng đầu tự đậm, dòng khác muốn đậm
   thêm `.ums-kv--dam` (người dùng 2026-09-26).

14. **Khung hai cột theo người đang chọn (`pat.masterNhanSu`): khi nội dung bên dưới có nút Đóng riêng (đang mở biểu mẫu) thì
   ẨN CẢ DÒNG TÊN** (tên + mã + Đóng) — người đang chọn đã tô sáng ở cột trái (người dùng 2026-09-26).

15. **Bảng: SÁT MÉP khung, luôn có ĐƯỜNG KẺ CUỐI, các khối cách nhau rõ** (người dùng 2026-09-26, ảnh màn Điểm học tab
   Khối kiến thức). (a) Bảng nằm trong khung có lề trong thì tràn qua lề hai bên — dùng thân `ums-panel__body--flush`,
   hoặc khung tự dựng có lề thì `margin-inline: calc(-1 * lề)` cho `.ums-tablewrap` (mẫu: `.ums-dh__pane`, diemhoc.css).
   (b) `.ums-tablewrap` tự có kẻ dưới (table.css); tự BỎ khi đáy bảng chạm kẻ khác: là con cuối của `.ums-panel` /
   `ums-panel__body--flush` / ô kỳ `.ums-dh__ky`, hoặc ngay sau là `.ums-pager` / `.ums-tablefoot` / `.ums-dh__tk--ky`. Khung
   mới có viền đáy riêng thì THÊM vào danh sách đó, đừng tắt kẻ ở từng màn. (c) Tiêu đề nhóm `.ums-legend` đứng sau khối
   khác tự cách `--ums-khoi-gap` = 40px (panel.css; 24px bị chê "quá thấp"); legend là con đầu của vỏ bọc mà vẫn cần cách
   thì gắn `ums-legend--cach` — KHÔNG gắn `ums-u-mt-*` cho legend (đã đổi hết 103 chỗ). (d) `.ums-legend` KHÔNG gạch chân,
   chỉ vạch trái (người dùng: "bỏ gạch chân title cho đỡ rối"). (e) Tiêu đề nhóm cách nội dung 12px (`margin-bottom: sp-3`; dòng `.ums-kv` ngay dưới bỏ lề trên). Lưới nhiều KHỐI (ô bắt đầu
   bằng tiêu đề nhóm, vd khung chi tiết hai cột) tự có khe dọc 40px / ngang 40px (panel.css, `:has`). (f) `.ums-kv` chỉ in đậm TÊN: dòng
   đầu tự đậm, dòng đầu không phải tên (cột thứ hai…) đặt `.ums-kv--thuong`; không đặt `--dam` cho tổng tiền / mã / ngành… (người dùng 2026-09-27).

16. **Cột trái — nhóm radio ngắn & dấu tình trạng** (người dùng 2026-09-27, cột "Danh sách thí sinh" Nhập học): nhóm chọn một
   ("Đã nhập / Chưa nhập / Toàn bộ") = `<div class="ums-field"><label class="ums-field__label">…</label><div class="ums-radios">…` (xếp
   ngang, xuống dòng thẳng mép trái); dấu tình trạng của mục (vd đã nhập học) = biểu tượng `ums-master__tt` ở CUỐI mục — xanh, dạt
   phải, có title; KHÔNG đặt cạnh tên, không dùng nhãn chữ trong mục. Lớp chung ở patterns.css.

17. **Bảng: cột "Thao tác" và cột ô đánh dấu chọn dòng nằm CUỐI bảng** (thứ tự: … dữ liệu | Thao tác | ô đánh dấu; cột đứng ĐẦU bảng có lớp `is-actions` hoặc tiêu đề "Thao tác" cũng tự dời) (người dùng 2026-09-29, ảnh Thi phách — Phân quyền nhập điểm), không nằm
   sau cột Stt như bản gốc. Làm chung ở `ums.ui.table`: cột ĐẦU mà tiêu đề (`head`) là ô "chọn tất cả" thì tự dời xuống cuối —
   146 tệp khai cột này ở đầu không phải sửa; màn mới khai luôn ở cuối (như `ums.crud`). Ô dời mang `data-cot-goc` = vị trí gốc
   trong dòng; nơi đọc ô THEO CHỈ SỐ CỘT gốc (báo cáo, import điền ngược — `report.js`) dùng `ums.ui.oTheoGoc(tr)`. Giữ nguyên
   chỗ: `ui.table({ chonCuoi: false })` hoặc cột `giuCho: true`. Không áp cho lưới nhiều cột ô đánh dấu (phân quyền) và danh
   sách cột trái (ô đánh dấu ở đầu mục).

---

18. **Mỗi lúc chỉ MỘT nút "Đóng"** (người dùng 2026-09-29, ảnh màn Đề xuất hồ sơ: đầu trang "Chi tiết hồ sơ … [Đóng]" + khung
    "Thêm thành viên gia đình [Đóng] [Lưu]"). Khung BÊN TRONG đang mở có nút Đóng của nó thì nút Đóng của tầng NGOÀI tự **ẩn** (không khoá);
    đóng khung trong thì hiện lại. Dòng tên ở đầu trang vẫn giữ. Làm sẵn ở tầng chung (`objects/shell.css` mục 3, dựa vào lớp `ums-btn--dong` do
    `ui.btn('close')` gắn) — màn KHÔNG phải viết gì, miễn là dựng nút bằng `ui.btn('close')`. Hộp thoại không tính. Trang kiểm `kiem-dong-bo`
    và `thu-crud` báo "n nút Đóng cùng hiện".

19. **Hàng ô ngắn có ô ẩn / hiện theo lựa chọn thì các ô còn lại TỰ CHIA cho hết hàng** (người dùng 2026-09-29, biểu mẫu hồ sơ: Họ / Tên đệm / Tên một
    hàng; Ngày / Tháng / Năm / Giới tính một hàng, chọn mức độ "chỉ năm" thì Năm + Giới tính chia đôi hàng). Không để ô ngắn mỗi ô một dòng, không để
    hàng hụt nửa chừng. Mẫu: `chiaHangNgay` trong `ApisNhanSu/Modules/kehoach/script/dexuathoso.js` (lưới 12 của `ums.crud`, đặt lại `grid-column: span n`
    cho các ô đang hiện).

20. **Ngày sinh ba ô (Ngày / Tháng / Năm) phải kiểm trước khi gửi** — `ums.util.ngaySinh(ngay, thang, nam, maMuc)` trả `{ loi, chuoi, ngay, thang, nam }`.
    `loi` khác rỗng thì báo "Kiểm tra lại: …" và KHÔNG gửi; `chuoi` là `dd/mm/yyyy` khi đủ ba phần, không thì rỗng (không bao giờ gửi `//2000`). Người dùng 2026-09-30.

## Bảng tra nhanh

| Dạng màn hình ở hệ cũ | Dùng | Ví dụ đã chuyển |
|---|---|---|
| Danh sách + lọc + thêm/sửa/xoá | `ums.crud` | `danhmucheso/khoanthu`, `hethonghoadon`, `taikhoanno`, `danhmucnganhang`, `kyhieuchuongtrinh`, `miengiam/miengiammotphan`, `miengiamtoanphan`, `dulieuhocphi/cauhinhtinhphi`, `hopdong` |
| Danh sách + lọc + thêm/sửa/xoá, **bản GỐC hai cột** | `ums.crud({ master: { title, icon, item(row) } })` — danh sách sang cột trái, biểu mẫu ở cột phải; phần nạp/lọc/phân trang/lưu/xoá giữ nguyên | `danhmucheso/hethonghoadon`, `hethongbienlai`, `hethongphieuthu` |
| Lưới nhập theo cột thời gian, sửa trong ô rồi "Cập nhật" | `ums.pat.matrix` | `danhmucheso/`: `donviphimoi`, `donviphimoict`, `donviphimoihp`, `donviphimoilop`, `mucphi`, `mucphilop`, `mucphinienche`, `sothangtinhtien`, `sothangkhonghoc`, `apdungcongthucphi`, `hesohocphanmoi`, `hocphansotienmoi`; `miengiam/mucmiengiammoi`, `sinhvienmiengiammoi`, `sinhviensotienmien`; `khaidonviphi/*` |
| Bảng chéo, tiêu đề hai tầng, sửa/xoá trong ô | `ums.pat.pivot` | `danhmucheso/hesohocphan`, `hesolophocphan`, `hocphansotien`, `mucdonviphi`; `miengiam/dinhmucmiengiam`, `hesodoituong` |
| Chọn một mục bên trái rồi làm việc bên phải | `ums.pat.master` | `phieuthu/thutien`, `viewthutien`, `thutienkhac`, `pos_thutien`; `chungtu/chungtu`; `hoadon/xuathoadon`, `xuatchungtu`, `xuathoadonkhac`; `danhmuc/danhmucdulieu`; `danhmucheso/kehoachthuchi`; `miengiam/dinhmucmiengiam`, `hesodoituong`, `sinhvien_miengiam` |
| Tra cứu chứng từ dạng thẻ, bấm để xem/in | `ums.pat.cards` | `phieuthu/tracuusophieuthu`, `bienlai/tracuusobienlai`, `hoadon/tracuusohoadon`, `hoadonnhap` |
| Thẻ có nút thao tác riêng trong thẻ | `ums.pat.cards` + `actions(item)` | `hoadon/xuatlohoadon` (xem trước theo người học) |
| Bảng gộp ô theo nhóm (rowspan) | `ums.pat.groupTable` | `hoatdong/cthp` (khối kiến thức × học phần) |
| Danh sách đầy trang rồi khung XEM thay chỗ nó | `ums.pat.page` + `ums.pat.filterBar` + `ums.ui.table`, đổi vùng bằng `ums.ui.swap` | `hoatdong/cthp` |
| Khung trang, khung nội dung, thanh lọc | `ums.pat.page/panel/filterBar` | mọi màn |
| Nút Báo cáo / Import theo mẫu phân quyền | `ums.report.mount` | `phieuthu/sinhviennotien`, `baocao/baocao` |
| Tác vụ chạy nền, hàng đợi | `ums.queue.mount` | `dulieuhocphi/tinhhocphi` |
| Chạy hàng loạt có tiến độ | `ums.ui.batch` | `miengiam/sinhvien_miengiam` |
| Danh mục đào tạo, chọn nối tầng Hệ→Khoá→CT→Lớp | `ums.ref.cascade` | nhiều màn |
| Hộp chọn sinh viên — bản gọn (tìm + chọn từng dòng) | `ums.pat.pickSinhVien` | `miengiam/*` |
| Hộp chọn sinh viên — bản đầy đủ (lọc nối tầng, trạng thái, chọn nhiều, "thêm từng khoá/chương trình/lớp") | `ums.pat.pickSinhVien({ filters: true, call, columns, group, status })` | dựng sẵn ở dòng dưới |
| Hộp chọn sinh viên — bản **nhiều ngành** (`LayDanhSachHoSoNhieuNganh`, mỗi ngành một dòng) | `ums.pat.pickSinhVienNganh({ onPick, onGroup })` | `dulieuhocphi/tinhhocphi`, `hopdong`, `giahanthu/kehoach`, `danhmucheso/khongbatno` |
| Nhóm ô đánh dấu có ô "Tất cả" (trạng thái SV, khoản thu…) | `ums.pat.checks(host, rows, { all, checked, cols, onChange })` → `{ ids, val, picked, set, setAll }` | `phieuthu/sinhviennotien`, `thutienkhac`, `phieurut/ruttien`, `hoadon/xuatlohoadon`, `xuathoadon*`, `dulieuhocphi/*` |
| Ô chọn tệp | `ums.ui.file({ key, accept })` — không để `<input type="file">` trần | màn import của `phieuthu/_chung_tracuu` |
| **Xoá NHIỀU dòng** (ô đánh dấu + nút Xoá) — mọi màn, mọi hộp thoại (người dùng chốt 2026-09-22) | `ums.ui.xoaChon('input[data-ck]', { attr, goc, trong, text })` — nút "Xoá đã chọn" (.ums-btn--delsel như ums.crud): chưa chọn thì mờ + khoá, chọn rồi viền đỏ "Xoá N dòng đã chọn", dòng đang chọn tô sáng (tr.is-selected). TỰ ĐẾM, màn không gắn gì. Trong HỘP THOẠI: đặt ở CHÂN hộp bằng `ui.dialog({ xoa: { chon, onClick(api) } })` (dạt trái, cạnh Đóng) — không để nút Xoá trong thân hộp. Xoá MỘT dòng (thùng rác trên dòng, Xoá trong biểu mẫu) giữ nút đỏ thường | `luanvan/_detai` (kho đề tài), `klgd/thanhtoangiangday`, `klgd/_phancong`, `baocao/baocao` (3 hộp) |
| Đóng khung chi tiết / biểu mẫu | `ums.ui.btn('close')` trong `.ums-panel__tools` — **không dùng mũi tên ←** | mọi màn |
| Số dòng mỗi trang ("Hiển thị 30") | `page.sizes: [24,30,50,100,200,'all']` + `page.onSize` của `ums.ui.pager` — chữ "Hiển thị" + ô chọn **trong thanh phân trang**, màn không tự dựng `<select>` riêng | `phieuthu/tracuusophieuthu`, `sinhviennotien` |
| Bảng tràn ngang: kéo chuột để vuốt | có sẵn trong `ums.ui.table` (`.ums-tablewrap`) — không phải khai gì | mọi bảng |
| Xem / in chứng từ đã lưu (phiếu thu, biên lai, hoá đơn, in theo lô) | `ums.phieu.viewer(host, { tools, onMau })` → `show/add/doiMau/print/clear` | `phieuthu/thutien`, `thutienkhac`, `pos_thutien`, `tracuusophieuthu`; `bienlai/tracuusobienlai`; `phieurut/ruttien`; `hoadon/*`; `chungtu/chungtu` |
| Đọc số tiền thành chữ | `ums.ui.docSo` | mọi màn in phiếu / hoá đơn |
| Tiền trong ô nhập (dấu phẩy ngăn nghìn) | `ums.pat.money` / `ums.pat.num` | mọi màn nhập tiền |
| **Nhiều tab × nhiều khung danh sách** (hồ sơ cán bộ: mỗi tab vài khung, mỗi khung một biểu mẫu; mở biểu mẫu thì ẩn tab + khung khác) | `ums.pat.sections({ el, title, tabs: [{ key, text, icon, sections: [cfg ums.crud…] }] })` — một tab thì không vẽ dải tab | `ApisCongCanBo/…/quatrinhdaotao`, `quanhegiadinh`, `khenthuongkyluat`, `danhhieuhocham` |
| **Lưới dòng nhập trong biểu mẫu** ("Thêm dòng mới", mỗi dòng một bản ghi con, lưu SAU bản ghi cha) | `ums.pat.rows(host, { columns, minRows, minRowsNew, list(id), filled(v), save(v, rec, id), remove(rec) })` → `load(id) / save(id) / clear()` — đặt trong `onForm(row, crud, extra)` của crud | `quatrinhdaotao` (Gia hạn, Tiến độ), `sukien/sukien`, `danhhieuhocham`, `quatrinhcongtac/dinuocngoai`, `hoso/qtthongtin` (Quyết định) |
| Lưới dòng: tiêu đề hai tầng / ô chọn danh sách dài / nút thêm ở đầu khung | cột `group: 'Thời gian bắt đầu'` (cột liền nhau cùng group) · cột `s2: true` (select2 thật, vd nhân sự) · `source: { load: fn → Promise, name: fn }` · `tools: '<button…>'` | `sukien/sukien` |
| **Phạm vi áp dụng** (bảng tên phạm vi + Thêm mở hộp chọn SV / "Thêm từng khóa, CT, lớp"; lưu SAU kế hoạch) | `ums.pat.phamVi(host, { list(id), save(pvId, id), remove(rowId), name? })` → `load(id) / save(id) / pending()` — trong `onForm` của crud, `save` gọi ở `onSaved` | `sukien/kehoach` (dùng tiếp: `khaosat/kehoach`, sanphamkhoahoc) |
| **Danh sách cán bộ bên trái** (edu.system.getList_NhanSu — hầu hết màn quản trị Nhân sự) | `ums.pat.masterNhanSu({ el, title, actions, sideTools, ghiChu, nhac, onChon(r, host, api) })` — trọn khung hai cột, đầu khung phải "Họ tên – Mã cán bộ" + Đóng. Cần giữ vùng phải cố định / tự vẽ phải: `pat.master({ side: { filter: pat.dsNhanSuLoc({ locThem, sideTools }) } })` + `pat.dsNhanSu(m, { onPick })` → `{ F, load, chon, boChon }`. Khoa → Bộ môn khoá (pat.chain), Tình trạng, đổi ô lọc tự tải, lọc Bộ môn ‖ Khoa. Ảnh tròn người: `ums.pat.anhNguoi(path)` (`.ums-ava`). KHÔNG tự dựng bản mới (đã gộp 6 bản ngày 26/9) | `ApisNhanSu/…/quatrinhcongtac`, `luong/quatrinhluong` |
| **Thanh lọc người học nhiều tầng** (Hệ/Khoá/CT/Lớp chọn nhiều, Năm nhập học, Khoa QL, Học kỳ, kế hoạch / loại / mức xử lý, + "Chọn trạng thái sinh viên") | `ums.pat.boLocNguoiHoc(host, { hang: [['he','khoa','ct','lop'], ['nam','kql','hk'], ['q','nut']], don, oRieng, nut, them })` → `{ f, v, tt, thamSo(), baoCao(add), luong(), z }`. `don: true` = ô chọn một; `oRieng` = ô riêng của màn (màn tự nạp). Getlist_* KHÔNG lọc quyền (như gốc). Gộp 2026-09-26 từ `ums.xlhvKQ.boLoc` + bản chính sách SV | XLHV `thuchienxulyhocvu`, SV `hoso/quahan`, `chinhsach/*` |
| **Hộp chọn nhân sự** (edu.extend.genModal_NhanSu — >100 màn gốc) | `ums.pat.pickNhanSu({ title, onPick(rows) })` — lọc Đơn vị / Trong-ngoài trường / từ khoá, phân trang máy chủ, chọn giữ qua trang | `khaosat/kehoach` |
| Nút nhảy sang màn khác (`edu.system.initMain('#x', '/modules/…/html/x.html')`) | `ums.app.openPath('/modules/…/html/x.html')` — tìm trong cây chức năng của vai trò đang mở, không có thì báo | `dgplnguoilaodong/phieudanhgia` (Kê khai) |
| **Lịch tuần theo giờ + lịch tháng nhỏ** (genHtml_Month / genTable_ThongTin của lichgiang.js — 5 màn gốc chép nhau) | `ums.lich.tao({ thang, tuan, load(tuan) → Promise<dòng>, noiDung(dòng), onClick, danhDau, sauKhiVe })` → `{ reload, chon, tuan, rows }`; tệp `assets/js/lich.js` | `lichgiang/lichgiang`, `lichgiangphonghoc`, `thoikhoabieusinhvien/lichhoc` |
| Hộp điểm danh một buổi (#my_calendar) | `ums.lich.diemDanh(buổi, { sapXep, cot2, kieuTuDanhMuc })` — tham số lưu/xoá chép nguyên (hai tên khác nhau như gốc) | `lichgiang/lichgiang`, `lichgiangphonghoc` |
| Bảng điểm & học tập của một người học (lớp DiemHoc — Cổng sinh viên, chép vào DaQHHT) | `ums.diemHoc.mount(host, { nguoiHocId })` — 8 tab, tệp `assets/js/diemhoc.js` | `hoatdong/DaQHHT` (hộp hồ sơ) |
| Chỉ VẼ một phần bảng điểm (màn tự gọi action gốc của nó) | `ums.diemHoc.veBangDiem(el, rsDiemKetThucHocPhan, rsDiemTrungBinhChung, { chiTiet, ghiChu })` · `veTichLuy(el, data)` · `veRenLuyen(el, data)` | `nhapdiem/inbangdiem` |
| Chọn "chỉ dòng đã đánh dấu / toàn bộ" trước thao tác hàng loạt | `ums.pat.chonPhamVi({ title, icon, soChon, daChon, tatCa, warn })` → Promise<'daChon' \| 'tatCa' \| null> | `phieuthu/sinhviennotien`, `nhapdiem/inbangdiem` |
| Gửi email hàng loạt (xem trước + gửi tuần tự CMS_NguoiDung/SendEmail) | `ums.pat.guiEmail({ title, list, email(d), than(d), tieuDe, hint, ghiChu, cot, cotSau })` · `ums.pat.emailHopLe(s)` | `phieuthu/sinhviennotien`, `nhapdiem/inbangdiem` |
| "Tải bảng điểm" / "Nhập điểm qua file" (reportAllTable_User / showReportAndImportTable_User(true)) | `ums.report.taiBangNhap(table)` · `ums.report.nhapBangTuTep({ onDone })` — bảng và ô nhập PHẢI có id (tệp mang id, nạp ngược theo id); nạp xong KHÔNG lưu | `nhapdiem/nhapdiem`, `nhapdiemdst` |
| Thời khoá biểu của một sinh viên (lịch tuần + tháng, cảm xúc, tự điểm danh) | `ums.tkbSV.mount(host, { sv, timKiem, nguoiDsLop: 'sv'\|'canbo', reportText })` — tệp `thoikhoabieusinhvien/script/_lichhocsv.js` + css `lichhoc.css` | `thoikhoabieusinhvien/lichhoc`, `nhapdiem/lichhoc`, hộp "Lịch học" của `nhapdiem/inbangdiem` |
| Các màn nhập điểm (module nhapdiem): xác nhận / công bố, vi phạm, lọc TP_Chung năm tầng, hệ 10, phím di chuyển | `ums.nd.xacNhan` · `ums.nd.viPham` · `ums.nd.locThi` · `ums.nd.he10` · `ums.nd.phim` · `ums.nd.pool` — `nhapdiem/script/_xacnhan.js`, `_chung.js` | 7 màn nhapdiem |
| Các màn nhóm Thi: bộ lọc XLHV_TP_Chung_MH (Thời gian CHỌN NHIỀU được) · hộp phân cán bộ coi/chấm thi | `ums.thi.loc({ f, tang, them, chonDau, onDoi })` · `ums.thi.chung(tên, o)` · `ums.thi.canBo({ title, ids, ds, them, xoa, xemTruoc, danhTu, onDone })` — `thi/script/_chung.js`; khung `_sotheodoi.js` (sổ theo dõi, chỉ xem), `_phancong.js` (phân công) | 10 màn thi |
| Các màn phòng thi trắc nghiệm (QLTTN_*): danh sách phòng thi + "Chi tiết phòng" thay chỗ danh sách, thông tin phòng / đề, tình trạng làm bài + đồng hồ đếm ngược, "Gian lận" → máy đã đăng nhập, mở/đóng phòng, chuyển mức phê duyệt, báo cáo URL cứng | `ums.coiThi.manPhong(root, { tieuDe, donVi, action, locTrangThai, trangThai, chiTiet(room, host) → hàm dọn })` · `thongTin(room, { matKhau, de })` / `veDe(de, deThi)` · `tinhTrang(r, coPhan)` + `demNguoc(host)` · `tenThiSinh` · `xemIP(r)` · `phanThi` · `mucPheDuyet` · `baoCao(code, room, part)` — `coithi/script/_phongthi.js` + `css/coithi.css` | `coithi/coithi`, `chamthituluan`, `duyetdiemthitracnghiem` |
| Các màn luận văn (LVLA_BV_*): danh sách người học theo kế hoạch bảo vệ + chi tiết thay chỗ, khối thông tin người học, hộp Xác nhận (trạng thái + lịch sử), lưới người hướng dẫn / phản biện, hộp Tạo quyết định / Duyệt | `ums.lv.man(root, { tieuDe, keHoach, list, phanTrang, columns, tools, onTool, onXacNhan, chiTiet(row, khung, ctx) })` · `thongTin` · `xacNhan({ loai, dm, sanPham, sanPhamLuu, khoaDs })` · `luoiNguoi` / `bangNguoi` / `dsNguoi` · `hopQuyetDinh` / `hopDuyet` — `luanvan/script/_luanvan.js`; khung riêng `_phanbien.js`, `_detai.js`, `_hoidong.js` | 8 màn `luanvan/*` |
| Các màn kê khai SẢN PHẨM KHOA HỌC (NCKH_*): hai cột, năm đánh giá, thành viên trong / ngoài trường, sản phẩm thuộc đề tài, hộp "Tìm …" chép sản phẩm có sẵn (kể cả tệp) | `ums.nckh.man(root, { tieuDe, ctl, ds, fields, luu, khoi: [...], tim, onForm, sauThem, choNap })` · khối `thanhVien({ vaiTro, ngoai, tyLe })` / `nguoi({ nguon, list, map, save, xoa })` / `kinhPhi` / `deTai` / `khac` / `tepRieng` — mỗi khối `{ html, gan, nap, chep, moi, luu, gt }` — `sanphamkhoahoc/script/_sanpham.js` | 12 màn `sanphamkhoahoc/*` |
| Các màn KHỐI LƯỢNG GIẢNG DẠY (TKGG_KLGD / TKGG_QLKLGD — mỗi màn một cặp bản cũ / bản QL): danh mục theo năm học, bộ lọc 8–10 ô nối tầng, bảng nhập trực tiếp lưu từng dòng, hộp import tệp | `ums.klgd.danhMuc(root, o)` · `boLoc(host, keys, ql, onDoi)` (nam hk dot he khoa csdt bm gv loaiTiet kieuLop loaiLop hocPhan kieuLopT monHoc ttDuyet) · `nhapBang(o)` · `hopImport({ mau, nut, params })` — `klgd/script/_klgd.js`; khung `_danhmuc.js`, `_thoigian.js`, `_donvi.js`, `_tonghop.js`, `_phancong.js`, `_tuychinh.js` (+ `_nhapkl.js`), `_dinhmuc.js`, `_tachlop.js` | 27 màn `klgd/*` |
| Bảng điều khiển MẪU (Dashboardv2 — số liệu sinh bằng mã, gốc Chart.js 2.9): đầu trang, thẻ KPI, bộ lọc chung, lưới thẻ biểu đồ / bảng | `ums.dbv2.man(root, { tieuDe, moTa, icon, nguon, loc, macDinh, tinh(f) → { kpis, … }, the: [{ key, tieuDe, moTa, icon, rong, cao, bang, ve(host, kq, api) }] })` · `api.bieuDo(host, type, data, optsV2)` (cấu hình Chart.js 2 đổi TỰ ĐỘNG sang v4 bằng `ums.dbv2.v2sang4`) · `api.bang` · `badge(chữ, tone)` — `Dashboardv2/script/_dbv2.js` + `css/dbv2.css` | 9 màn `Dashboardv2/*` |
| BIỂU TƯỢNG của nút hành động (chữ giữ nguyên bản gốc, icon theo chuẩn chung) | `ums.ui.btn('view' | 'edit' | 'history' | 'confirm' | 'reload' | 'attach' | 'report' | 'importer' | 'add' | 'save' | 'search' | 'close' | 'del' | 'excel' | 'print')` · `ums.ui.iconBtn(kind)` · bảng tra `ums.ui.ICON` — `assets/js/ui.js`. Kiểm: `python _harness/kiem-icon-chuan.py` | mọi màn |
| MÀU NHÃN trạng thái (`ums.ui.badge`) — chọn theo Ý NGHĨA, không theo loại dữ liệu | `ok` xanh lá = tốt / bình thường / đã hoàn thành / còn dư · `warn` cam = cần chú ý (bảo lưu, học lại, sắp hết hạn) · `bad` đỏ = xấu (đang nợ, hết hạn, bị xoá tên) · `info` xanh dương = thông tin trung tính · `mute` xám = chưa xác định. Chữ đã nói "nợ" thì SỐ bỏ dấu âm. Bảng màu: `components/chip.css` | mọi màn |
| THỦ VAI — vai trò CHOPHEPTHUVAI = 1 (vd "Cổng sinh viên - thủ vai"): chọn người học trước khi vào vai trò, thẻ "Đang xem — …" đầu cột trái, nút × rời vai | TỰ ĐỘNG trong vỏ (`app.js` openRole) — màn KHÔNG tự dựng hộp chọn SV; đọc ID người học bằng `ums.session.userId` (thay `edu.system.userId`). `ums.thuVai.hienTai / ap / bo / chon(role) / theHtml / tuDong` — `assets/js/thuvai.js` + `components/thuvai.css`. Harness: `vt=R04` tự chọn sẵn SV0001 | `ApisCongSinhVien/*` |
| Bảng tin (thẻ tin hai cột · khung xem tin · bình luận · tin đã đánh dấu) | `ums.csvTinTuc.man(root, { thongBao })` — `ApisCongSinhVien/Modules/tintuc/script/_tintuc.js` (bản Cổng cán bộ `ApisCongCanBo/Modules/tintuc/script/tintuc.js` còn riêng — nên gộp) | `tintuc`, `tintuc1` |
| Bảng điểm cá nhân 8 tab (Cổng SV `hoctap/diemhoc`, Cổng cán bộ `DaQHHT`) | `ums.diemHoc.mount(host, { nguoiHocId, diemQuaTrinh: false })` · `veBangDiem` / `veTichLuy` / `veRenLuyen` — `assets/js/diemhoc.js`. Thông tin người học đọc cột `QLSV_NGUOIHOC_*`; hộp "Điểm quá trình" bật mặc định | `hoctap/diemhoc`, `hoatdong/DaQHHT` |
| Màn ĐĂNG KÝ HỌC của Cổng sinh viên: thẻ lớp học phần, kết quả đăng ký nhóm theo môn, hộp lịch / điểm danh / điểm quá trình | `ums.dky.the / ketQua / lich / diemDanh / diemQuaTrinh` — `ApisCongSinhVien/Modules/dangkyhoc/script/_dangky.js` | `dangky`, `tracuu` |
| Hai bảng "CHƯA đăng ký / ĐÃ đăng ký" xếp dọc, nút Đăng ký + `ui.xoaChon` Hủy đăng ký | `ums.dkhHaiLuoi(host, cfg)` — `dangkyhoc/script/_hailuoi.js` (bản có thanh lọc + MỘT lời gọi trả cả hai bảng: `ums.dkhDs`, `_dangkyds.js`) | `nguyenvong`, `thilai` · `nganh2`, `dinhhuong` |
| Công nhận điểm (từ chứng chỉ / từ bảng điểm) | `ums.cnd.*` — `dangkyhoc/script/_congnhandiem.js` | `congnhandiem`, `congnhandiemv3` |
| Mã hoá payload kiểu cũ `{ strVal: … }` (edu.system.atob) và sinh khoá 32 hex | `ums.util.xorB64(chuoi, khoa)` · `ums.util.unXor` · `ums.util.uuid()` — `assets/js/api.js` | mọi màn có lời GHI kiểu `strVal` |
| Lưới dòng có cột chỉ hiện (Ngày tạo, Người tạo) | cột `type: 'static'` của `ums.pat.rows` | `luanvan/gvhdxacnhan` |
| Màn gốc KHÔNG có vùng Import → ẩn nút Import | `ums.report.mount(host, { import: false, … })` | nhapdiem, tuibai, inbangdiem, thi/* |
| Hỏi lại liệt kê đúng những gì sắp ghi (showFancyConfirm) | `ums.pat.xacNhanChiTiet({ title, subject, sections, requireCheckbox })` → Promise<boolean> | `hoatdong/DaQHHT` |
| Xuất Excel ở máy khách (gốc tải SheetJS từ CDN) | `ums.ui.xuatXls(tên, { tieuDe, cot: [{ title, get }], dong })` · tải tệp: `ums.ui.taiTep` | `hoatdong/DaQHHT`, `lichgiang/_nhieu.js` |
| Danh sách trái là DANH MỤC | `ums.pat.master({ side: { kieu: 'danhmuc' } })` — cây thư mục, số lượng thành nhãn tròn | `danhmuc/danhmucdulieu` |
| Dải tab tự dựng | `ums.ui.tabs([{ key, text, icon }], active, 'data-xtab')` + `ums.ui.tabsActive(host, key, 'data-xtab')` | `khaosat/kehoach` (phiếu tự động, kết quả) |
| Hai nút xoá gọi hai procedure (xoá ở danh sách ≠ xoá trong biểu mẫu) | crud `remove` (danh sách) + `formRemove` (biểu mẫu), chữ nút `removeText` / `formRemoveText`, chữ hỏi `removeConfirm(rows, trongBieuMau)` | `khaosat/kehoach` |
| Lưới dòng: thêm dòng MỚI điền sẵn (chép đáp án mẫu…) | `g.addNew(dongNguon)` của `ums.pat.rows` — điền theo `col` | `khaosat/phieu` |
| **Tệp đính kèm của bản ghi** (uploadFiles / viewFiles / saveFiles) | trường `{ type: 'files', api: 'NS_Files' }` của `ums.crud` — tự nạp khi sửa, tự gắn vào id máy chủ trả sau khi lưu; ngoài crud: `ums.files.mount(host, { api })` | mọi màn hồ sơ Cổng cán bộ |
| **Ảnh đại diện** (uploadAvatar + getImage) | `ums.files.avatar(host, { width, height, icon })` → `set / get / finalize(id)`; trong crud: trường `{ type: 'avatar', key, col, icon }` | `hoso/capnhathoso`, `sukien/sukien` |
| Ô lọc chọn sẵn mục đầu (`selectFirst: true` của loadToCombo_data) | ô lọc crud `{ type: 'select', first: true, source }` + `autoload: false`, rồi `crud.sourcesReady.then(crud.load)` | `sukien/sukien` |
| **Ô địa chỉ Tỉnh/Huyện/Xã** (setTinhThanh — ô chữ + kính lúp) | `ums.pat.diaChi(input)` → `set(tinh, huyen, xa, them) / get()` | `hoso/capnhathoso` |
| Biểu mẫu có dòng 3 ô lẫn dòng 4 ô | `ums.crud({ formCols: 12 })` + `cols: 4` / `cols: 3` trên từng trường | `quatrinhcongtac/danhsachgiamtrugiacanh` |
| Bảng tiêu đề nhiều tầng (colspan/rowspan) | cột `ums.ui.table` khai `group: ['Tầng 1', 'Tầng 2']` | `danhsachgiamtrugiacanh`, `luong/bangtinhluongnam` (cây thành phần động), `hoso/qtthongtin` |
| Khối xem chỉ đọc "nhãn : giá trị" | `<div class="ums-kv"><span>Nhãn</span><b>Giá trị</b></div>` | `hoso/quyetdinh` |
| Nút "Lưu và nhập tiếp" (btnReWrite / btnSaveRe) | `ums.crud({ saveAgain: 'Lưu và nhập tiếp', saveAgainMod })` | mọi màn hồ sơ có nút này |
| **Hai bảng "CHƯA đăng ký / ĐÃ đăng ký"** xếp dọc, mỗi bảng một nút (Đăng ký / Hủy đăng ký), ô đánh dấu ở cột cuối | `ums.pat.haiLuoi(host, { chua: { title, columns, nut, onDangKy(rows), kiemTra }, da: { title, columns, onHuy(rows) }, nhom })` → `ve(k, rows, cột?) / nhac / dang / loi / chon / bang` | `dangkyhoc/nguyenvong`, `dangkyhoc/thilai`, `sukien/sukien`, `xebus/vethang` |
| Số tiền kèm đơn vị | `ums.ui.money(n, { donVi: true })` → `"1.250.000 đ"` | mọi màn học phí / vé tháng |
| Bảng SINH VIÊN × NGÀY chuyên cần (mỗi ô: ô đánh dấu + ô số buổi; tiêu đề ngày có ô "chọn cả cột"; cột / dòng Tổng tự tính; mỗi ô một lời gọi, hàng đợi 6 luồng; Lưu = thêm ô mới đánh dấu / đổi số, xoá ô bỏ đánh dấu) · thanh lọc Hệ→Khoá→CT→Lớp + Năm + Khoa QL + Kiểu chuyên cần + trạng thái SV | `ums.cc.luoi(host, { lead, o, them, xoa, ghiId, buoi, chuHoi, sauLuu })` → `ve(data, page) / luu() / xoaTrang(msg)` · `ums.cc.boLoc(host, { khoiTao, baoCao })` → `thamSo()` · `ums.cc.cotSV()` — `ApisChuyenCan/Modules/nhapchuyencan/script/_chung.js` + `css/_chung.css`. Ô lưới mang `data-cc` (KHÔNG `data-ck` — trùng ô trạng thái của `pat.checks`) | `nhapchuyencan`, `nhaptheolop`, `tonghop/tonghoptheongay` |
| Học lại thi lại: thanh lọc Hệ→Khoá→CT→Lớp + Học kỳ + Khoa QL + Đánh giá + trạng thái SV, khung "Danh sách" ẩn tới khi tìm · lớp học phần hai chế độ (danh sách lớp / đăng ký chi tiết) + dồn lớp | `ums.hltl.boLoc / cotSV / khungDS` — `ApisHocLaiThiLai/Modules/lapdanhsach/script/_hltl.js` · `ums.hltlLhp.man(root, { kieu: 'dangky'|'lapdanhsach' })` — `dangky/script/_lhp.js` (dùng lại `ums.lhp.donLop` / `hopPhamVi` của Đăng ký học) | `lapdanhsach`, `dangky`, `chotdanhsach`, hai `lophocphan` |
| Điểm rèn luyện — họ màn "ÁP DỤNG" (phạm vi Khoá × Học kỳ/Năm × Đối tượng, Kế thừa / Xóa toàn bộ, ô danh mục "chưa dùng", bảng cây tiêu chí) | `ums.rlApDung.locDefs / boLoc / crudEl / pvFields / phamViForm / giaTriPV / toanBo / themMuc / cay / cotCay` — `ApisRenLuyen/Modules/khaibaoheso/script/_apdung.js` | `tieuchidiemapdung`, `tieuchixeploaiapdung`, `hesoapdung` (nên dùng tiếp: XLHV `dieukienapdung`) |
| CÂY danh mục / tiêu chí (cha → con) trong DANH SÁCH — kiểu BẢNG CÂY (còn dùng ở tieuchidiemapdung; tieuchidiem nay dùng sơ đồ tổ chức, dòng dưới): bảng cây — mỗi mục một dòng, tên thụt lề theo cấp, mục có con in đậm, các cột thường + nút Sửa. Người dùng chốt 2026-09-25: KHÔNG vẽ cây lên tiêu đề bảng (thân trống) như vài màn gốc. Kiểu sơ đồ trên tiêu đề vẫn giữ để dùng lại: `veCayTieuDe(crud)` trong `ApisRenLuyen/Modules/tieuchidiem/script/tieuchidiem.js` (ui.table cột `group`, mã cha làm khoá nhóm) | `ums.rlApDung.cay(rows, { id, cha })` (xếp cha trước con, gắn `_cap` / `_con`) + `cotCay({ title, prop })` — `ApisRenLuyen/Modules/khaibaoheso/script/_apdung.js`; với ums.crud: `list.rows: d => cay(d)` + cột `cotCay` (nên đưa lên `ums.pat` khi màn thứ ba cần) | `tieuchidiem`, `tieuchidiemapdung` |
| SƠ ĐỒ TỔ CHỨC cho cây cha → con (cha trên, các con dàn ngang, đường nối; mỗi ô bấm được; tràn thì cuộn / kéo ngang). Người dùng chọn 2026-09-25 cho cây tiêu chí điểm (bỏ bảng) | `ums.pat.soDo(host, rows, { id, cha, nhan(r, laCha), attr(r) })` — `assets/js/patterns.js` + `components/sodo.css` (`.ums-sodo__ma`, `.ums-sodo__diem`, `.is-am`). **Quy ước màu tầng** (người dùng 2026-09-25, áp cho MỌI sơ đồ / cây phân cấp): tầng 1 navy đậm chữ trắng · 2 xanh dương nhạt · 3 xanh lá nhạt · 4 vàng nhạt · 5 tím nhạt · 6 hồng đào nhạt · từ tầng 7 lặp lại 2→6 (lớp `is-cap-0..5`, hàm `lopCap`); với ums.crud: `columns: []` + `onLoad` vẽ vào `crud.z('table')`, `attr` trả `data-c: uid + ':edit'`, `data-i` | RL `tieuchidiem` |
| Xử lý học vụ — thanh lọc theo hàng (Hệ/Khoá/CT/Lớp chọn nhiều, kế hoạch, loại/mức) + bảng kết quả có nhóm cột "Thông số xử lý" điền từng ô + hộp "Thay đổi mức cảnh cáo"; màn thao tác hàng loạt trên đó | `ums.xlhvKQ.boLoc / ketQua / khungDS / hopDoiMuc` — `ApisXuLyHocVu/Modules/thuchienxulyhocvu/script/_ketqua.js` · `ums.xlhv.man(root, { tieuDe, tools, tren, baoCao, onNut })` — `pheduyetketqua/script/_xlhv.js` · `ums.xlhvDk.tuKhoa / haiCot` — `dieukienxuly/script/_dieukien.js` · `ums.khxl.*` — `kehoachxuly/script/_khxl_*.js` | `thuchienxulyhocvu`, `tracuuketqua`, `pheduyetketqua`, `raquyetdinh`, `dieukienxuly/*`, `kehoachxuly` |
| Học bổng — họ màn "Điều kiện áp dụng" (hai tab chung / riêng, biểu mẫu hai cột 4|8, phân loại/quỹ → phân cấp → phạm vi Hệ→Khoá→CT→Lớp→Học viên, bảng từ khoá sửa trong ô) · kế hoạch xét (danh sách + biểu mẫu + cán bộ + SV + điều kiện, hộp danh sách người học cột động) · tổng hợp / phân bổ / văn bằng | `ums.hbDk.man(root, { tieuDe, phanLoai, cotChung, trai, phai, chung, rieng, phanCap, keHoach, tuKhoa, toolbar, onForm, onSaved })` · `tuKhoa` · `gt` — `ApisHocBong/Modules/thietlap/script/_dk.js` · `ums.hbKh.quy / napQuy / napHocKy / dsKeHoach / cotPhanCong / cotSV / cotXepLoai / hopDS / taoForm / taoDieuKien` — `kehoach/script/_kh_*.js` · `ums.hbTh.dt / quy / chay / hoTen` — `kehoach/script/_th.js` | thietlap/*, kehoach/*, vanbang/quanlythongtin |
| Danh mục dữ liệu của phân hệ khác (21 bản `danhmucdulieu.js` chép nhau) | nạp CHÍNH `ApisTaiChinh/Modules/danhmuc/script/danhmucdulieu.js`, khai chỗ lệch bằng thuộc tính thẻ gốc: `data-tu-khoa` (strTuKhoa danh sách bảng), `data-tu-chon="0"` (không tự mở bảng đầu), `data-loc="q"` (ô lọc hiện ra trong cha / tt / q) | `ApisChuyenCan/Modules/danhmuc/danhmucdulieu` |
| **CMS** — hai cột: danh sách NGƯỜI DÙNG (ảnh tròn · tên · email, phân trang máy chủ, thẻ khi rê) + khối quyền chức năng (ứng dụng · bảng chức năng gộp theo ứng dụng · cây ô đánh dấu, Lưu tính phần thêm/xoá) | `ums.cmsNd.dsNguoiDung` · `quyen` · `cay` · `bangChucNang` · `anh` — `ApisCMS/Modules/nguoidung/script/_chung.js` | `nguoidung/*` |
| **CMS** — CÂY (thay jstree): cây bấm chọn / chỉ xem / ô đánh dấu ba trạng thái, lọc tại chỗ tô từ khoá, bảng gộp nhiều tầng | `ums.cmsCay.html` · `loc` · `active` · `chon` · `thuTu` · `bang` — `ApisCMS/Modules/vaitro/script/_chung.js` | `vaitro/*`, `ungdung/ungdungchucnang` |
| **CMS** — cây CHỨC NĂNG của một ứng dụng (ô ứng dụng + cây theo CHUCNANGCHA_ID, tìm tô chữ) | `ums.cmsCN.fillUngDung` · `cay` · `chon` · `loc` · `theoCay` — `ApisCMS/Modules/chucnang/script/_chung.js` | `chucnang/chucnang`, `sodoquytrinh` |
| **CMS** — quản trị QUYỀN DỮ LIỆU (lưới đối tượng × chiều; hộp Thêm quyền / Cấu hình quyền / Xem kết quả) | `ums.qtqdl.man(root, { …, quyen: { tai, map, them, xoaThem \| xoaKQ } })` · `napChieu` · `cay` / `nhanCay` — `ApisCMS/Modules/phanquyen/script/_qtqdl.js` | `phanquyen/quantriquyendulieu*` |
| **CMS** — phân quyền dạng LƯỚI CÂY × CỘT (cây THANHPHAN_* gộp ô, cột người dùng / trường thông tin, ô đánh dấu `data-pq`) | `ums.pq.luoi` · `phanQuyen` · `daoTao` (Hệ/Khoá/CT/Lớp chọn nhiều) · `gopDoc` — `ApisCMS/Modules/phanquyen/script/_pq.js` | `phanquyen/diem`, `baocaoimport`, `canbonhaphoso*`, `canhantunhaphoso`, `sinhvientunhap` |
| **CMS** — khai báo HÀM import/export theo procedure (tách tham số từ SQL) · cây BẢNG danh mục lọc ứng dụng | `ums.cmsDm.hamMan` · `cay` · `ungDung()` · `tachSQL` · `moBaoCao` — `ApisCMS/Modules/danhmuc/script/_dm.js` | `danhmuc/danhmucimport`, `danhmucexport`, `danhmucdulieu`, `danhmucthuoctinh`, `import` |
| **CMS** — công cụ tác động CSDL / mã: MỌI nút ghi hỏi lại tone bad, hộp mã pin, gọi máy chủ khác, tải gói .zip, gộp ô | `ums.cmsCu.ghi` · `hopPin` · `goiNgoai` · `taiZip` · `gopO` · `commentSQL` — `ApisCMS/Modules/danhmuc/script/_cu.js` | `danhmuc/comparetable`, `exporttable`, `upcode`, `cloudupdate`, `autologdb` |
| **CMS** — bảng CẤU TRÚC BÁO CÁO (tiêu đề cây nhiều tầng + thân cây gộp dòng + ô nhập theo cột lá) | `ums.cmsBaoCao.bangCay` · `chayLuong` — `ApisCMS/Modules/baocao/script/_chung.js` | `baocao/khaibao`, `thuchien` |
| **Đăng ký học** — biểu mẫu kế hoạch RẤT dài: nhóm radio/ô đánh dấu nạp từ danh mục + câu hỏi Có/Không (1/0) | `ums.khdk.taoForm(host)` → `ready / reset / fill / values` · khối `yn` / `dmBox` — `ApisDangKyHoc/Modules/kehoachdangky/script/_khdk_form.js` | `kehoachdangky/kehoachdangky` |
| **Đăng ký học** — lớp học phần: bộ lọc nối tầng, ô "Tìm cụm từ trong bảng" kiểu Ctrl+F, hộp hỏi lại kèm radio, dồn lớp / dồn nhóm / rút | `ums.lhp.boLoc` · `tim` · `hoiChon` · `cotChon` — `kehoachdangky/script/_lhp_*.js` | `kehoachdangky/lophocphan` |
| **Đăng ký học** — màn PHÂN CÔNG: khối "Thông tin phạm vi" (mỗi dòng ô chọn + Thêm), danh sách chia theo phân cấp DANGKY.PHANCAP | `ums.dkhPC.boPhamVi` · `luoi` · `chon` · `phamViMan(root, cfg)` — `kehoachdangky/script/_phancong.js` | `kehoachdangky/phanconglop`, `phancongphamvi`, `nguyenvongdangky/phancongphamvi` |
| **Đăng ký học** — lớp học / dồn lớp / quản lý toàn bộ: ô chọn nhiều có "Chọn tất cả" (bản chép thứ hai của `B.s2multi` Tài chính), cột ô đánh dấu `data-lck` | `ums.dkhLop.s2multi` · `fillMulti` · `trangThai` · `cotChon` · `ganChonTatCa` — `kehoachdangky/script/_lop.js` | `lophoc`, `donlop`, `quanlytoanbo`, `lichsu` |
| **Đăng ký học** — áp phí / rút học phần (bảng đã xử lý + "Kết quả đã đăng ký" + hộp Thực hiện) | `ums.dkhHp.man(root, cfg)` · cột `cotSV/cotHP/cotPT/cotTien` — `kehoachdangky/script/_hp.js` | `apphihocphan`, `ruthocphan` |
| **Đăng ký học** — cán bộ đăng ký học THAY sinh viên | `ums.dky.*` của Cổng SV nạp chéo + `canbodangky/script/dangky.js` | `canbodangky/dangky` |
| **Đăng ký học** — kế hoạch đăng ký THI (nhiều vùng "Chi tiết", hộp chọn học phần / người dùng, hộp Duyệt) | `ums.tlKh.*` — `thilai/script/_chung.js`, `_tl_*.js` | `thilai/kehoach` |
| Hộp chọn HỌC PHẦN / LỚP QUẢN LÝ (genModal_HocPhan / genModal_Lop), chọn nhiều, phân trang máy chủ | `ums.dkhChon.hocPhan` · `lop` · `bang` — `ApisDangKyHoc/Modules/nguyenvongdangky/script/_nvchon.js` (nên lên `ums.pat`) | `nguyenvongdangky/kehoachdangky`, `nganh2/kehoach` |
| Danh mục dữ liệu bản "strPhanCap_Id / strChung_TenDanhMuc_Cha_Id" (không ThongTin7/8, từ khoá lọc tại chỗ) | nạp CHÍNH `ApisDangKyHoc/Modules/danhmuc/script/danhmucdulieu.js` — gốc của ApisHocLaiThiLai, ApisTKGG giống hệt | `ApisDangKyHoc/danhmuc` |
| Khung hồ sơ Cổng SV (tab + khối thông tin cá nhân + bảng trường thông tin) | `ums.csvProfile.manHoSo(root, { tieuDe, sua, anh, loc, ds, bcheck })`, khối riêng `ums.csvProfile.khoiSV(host, {…})` | `profile/hoso`, `profile/tunhaphoso`, `profile/minhchung` |

> **MÀU NÚT THEO ĐỘNG TÁC, không để trắng hàng loạt.** Màn cũ đầy nút trắng
> giống hệt nhau nên nhìn không ra việc nào là gì. Bảng phân loại:
>
> | Việc | Lớp | Ví dụ |
> |---|---|---|
> | Việc chính của màn | `ums-btn--primary` | Tìm kiếm |
> | Thêm mới (nút chính đầu trang) | `ums-btn--add` (xanh success) | Thêm mới · Tạo mới |
> | Lưu | `ums-btn--save` | Lưu · Cập nhật |
> | Xem · tìm · tải lại · mở danh sách | `ums-btn--out-primary` | Xem danh sách · Tổng hợp dữ liệu |
> | Thêm một mục phụ | `ums-btn--out-success` | Thêm dòng mới · Thêm thành viên |
> | In · xuất · gửi · import | `ums-btn--out-info` | Xuất báo cáo · Import · Xuất Excel |
> | Việc cần cân nhắc | `ums-btn--out-warn` | Sinh số hóa đơn tự động |
> | Xoá · huỷ · gỡ | `ums-btn--danger` (nặng) hoặc `--out-danger` (nhẹ) | Xoá nợ |
> | Trung tính | `ums-btn--ghost` — **chỉ** Đóng, Viết lại, Thử lại | |
>
> `ums.ui.btn(kind)` đã gán sẵn đúng lớp cho từng loại — dùng nó thay vì viết tay.

> **Chữ trên nút lấy ĐÚNG của bản gốc.** Mọi màn đang chuyển đều chạy ở vỏ
> `indexi`, nên nút mẫu báo cáo là **"Xuất báo cáo"** (Corei:6945), không phải
> "Báo cáo" của vỏ `index`. Nút bản gốc có mà không có xử lý thì **giữ nút,
> đặt `disabled`** — không xoá khỏi giao diện.

> **Bẫy phân quyền:** bộ lọc mà hệ cũ dựng bằng `edu.extend.genBoLoc_HeKhoa`
> gọi procedure `…Quyen` (lọc theo quyền người dùng). `ums.ref.cascade` gọi
> bản KHÔNG lọc quyền. Xem bản gốc rồi mới chọn.

---

## Chi tiết từng bố cục

### 1. Danh sách + biểu mẫu — `ums.crud`

Dạng phổ biến nhất (danh mục, khai báo). Lo sẵn: thanh lọc, bảng, phân trang
máy chủ, chọn nhiều dòng, thêm/sửa/xoá, kiểm tra hợp lệ, thông báo.
Tài liệu: chú thích đầu `assets/js/crud.js`; cách khai báo ở `CHUYEN-DOI.md` mục 4.

### 2. Lưới nhập — `ums.pat.matrix`

Dòng (học phần / lớp / đối tượng) × cột (thời gian / đợt). Mỗi ô là một bản
ghi; sửa thẳng trong ô, Enter hoặc ↑↓ để nhảy ô, ô đã sửa được đánh dấu, nút
"Cập nhật" gom các ô đổi rồi gửi hàng loạt qua `ums.ui.batch`.

```js
var grid = ums.pat.matrix({
    el: zone, rows: dsHocPhan, cols: dsThoiGian, money: true,
    lead: [{ title: 'Mã', prop: 'MA' }, { title: 'Tên học phần', prop: 'TEN' }],
    rowKey: function (r) { return r.ID; },
    cells: dsBanGhi, cellKey: function (d) { return { r: d.HOCPHAN_ID, c: d.THOIGIAN_ID }; },
    value: function (d) { return d.SOTIEN; },
    onEdit: function (rec, row, col) { … }      // bỏ nếu màn không có nút sửa trong ô
});
grid.dirty();   // [{ row, col, rec, value, old }] — các ô đã đổi
```

### 3. Bảng xoay — `ums.pat.pivot`

Tiêu đề hai tầng (nhóm × cột con), ô hiện giá trị, rê chuột mới hiện nút
sửa/xoá.

```js
ums.pat.pivot({
    el: zone, rows: dsDoiTuong,
    lead: [{ title: 'Đối tượng', prop: 'TEN' }],
    groups: [{ title: 'Học kỳ 1', cols: [{ title: 'Học phí', key: 'HP' }] }],
    value: function (row, col) { return ums.pat.money(row[col.key]); },
    has: function (row, col) { return row[col.key] != null; },
    onEdit: …, onDelete: …
});
```

### 4. Hai cột — `ums.pat.master`

Bên trái: tìm kiếm + danh sách bấm được (dùng `.ums-master__item`, mục đang
chọn thêm `is-active`). Bên phải: nội dung của mục đang chọn.

```js
var m = ums.pat.master({
    el: root, title: 'Thu tiền', actions: ums.ui.btn('add', { attr: { 'data-a': 'add' } }),
    side: { title: 'Sinh viên', icon: 'fa-user-graduate', search: 'Nhập mã, tên sinh viên' },
    main: { title: false }
});
m.sideBody.innerHTML = …;  m.mainBody.innerHTML = …;
```

Cột trái chỉ rộng 320px: **mỗi ô lọc một dòng**. Đã là luật chung
(`.ums-master__side .ums-filter > .ums-field { flex: 1 1 100% }`), không đè lại
để nhét hai ô vào một hàng — tên hệ/khoá/chương trình sẽ bị cắt. Bản gốc cũng
xếp dọc (`<div class="clear">` giữa hai `<select>`).

**Danh sách là DANH MỤC → `side: { kieu: 'danhmuc' }`** (người dùng yêu cầu
2026-09-22). Cột trái vẽ kiểu cây thư mục: đường chấm nối, thư mục vàng (mở
khi đang chọn), số lượng thành nhãn tròn xanh (đặt `sideCount` là SỐ, không
kèm ngoặc). Cây lồng: `<ul><li><button class="ums-master__item">…</button>
<ul>…</ul></li></ul>`; danh sách phẳng thì đặt thẳng các mục. Danh sách bản
ghi thường (sinh viên, phiếu, học phần…) giữ kiểu mép răng cưa. Mẫu:
`danhmuc/danhmucdulieu`.

### 5. Lưới thẻ — `ums.pat.cards`

```js
ums.pat.cards({
    el: zone, items: rows, tone: function (r) { return r.DAHUY ? 'bad' : 'ok'; },
    render: function (r) {
        return '<span class="ums-card__no">' + ums.ui.esc(r.SOPHIEU) + '</span>' +
               ums.pat.cardRow('Người nộp', r.HOTEN) + ums.pat.cardRow('Số tiền', ums.ui.money(r.SOTIEN));
    },
    page: { index: page, size: 24, total: tong, onChange: … },
    onPick: function (r) { … }
});
```

### 6. Vùng dưới bảng

Tổng theo cột: `sum: true` trên cột của `ums.ui.table`. Ghi chú / tổng ngoài
bảng / thanh thao tác: `<div class="ums-tablefoot">` (đã có kiểu sẵn), đặt
trong `ums-panel__body--flush` ngay sau bảng.

---

## Khi cần thêm bố cục mới

1. Kiểm tra lại bảng tra nhanh — phần lớn "dạng mới" thật ra là một dạng cũ
   thêm vài nút.
2. Dựng ở `assets/js/patterns.js` + `assets/css/components/patterns.css`,
   đặt tên `ums-*`, không phụ thuộc phân hệ nào.
3. Thêm một mục vào sổ này: tên, dùng khi nào, ví dụ khai báo, màn đang dùng.
4. Chạy lại trang dò toàn bộ màn hình trước khi coi là xong.
