# Brief giao tác tử con chuyển MỘT màn sang `_v2`

Chép nguyên tệp này vào lời giao việc, điền phần `<…>`. Tác tử KHÔNG đọc CLAUDE.md, KHÔNG đọc toàn bộ BO-CUC.md / components.html / mã tầng chung.
Chỉ giao tác tử khi hạn mức phiên còn nhiều (tác tử chết giữa chừng là mất trắng phần đã đọc — 5/10 mất hai tác tử).

## Việc
Chuyển màn `<ApisXxx>/Modules/<module>/html/<tên>.html` + `script/<tên>.js` sang `_v2/<cùng đường dẫn>` (html chỉ còn `<div id="<tiền tố>-<tên>"></div>` +
`<script src="../script/<tên>.js"></script>`, kèm `<tên>.demo.js` dữ liệu mẫu `ums.demo.add({...})` — ThemMoi trả `{ rows: [], raw: { Id } }`).
Menu mẫu đã có: vai trò `<R..>`, chức năng `<TIỀN TỐ>-<module>-<tên>`. Máy chủ tĩnh đang chạy `http://localhost:8787`.

## Đọc đúng ba thứ, theo thứ tự
1. `python _harness/tom-tat-goc.py <html gốc>` — vùng, hàm, mọi lời gọi API kèm tham số, id lệch (mã chết). Chỉ đọc nguyên văn hàm cần (`--ham a,b`).
2. `_v2/API.md` — tra theo tên hàm (`ums.crud` ở khối đầu crud.js; `ums.pat.formTrang`, `boLocNguoiHoc`, `phamVi`, `chain`; `ums.ui.table/btn/dialog/batch/file/xoaChon`;
   `ums.editor.tao`; `ums.files.mount`; `ums.ref.*`; `ums.api.call/dm`). Không mở mã tầng chung.
3. `_v2/CLASS.md` — tên lớp CSS có thật. Không bịa lớp.
Màn tham chiếu cùng dạng (đọc để chép cách dựng): `<đường dẫn 1–2 màn _v2 gần giống>`. Mẫu chú thích đầu tệp: `_v2/ApisCongCanBo/Modules/sukien/script/sukien.js`.

## Luật bắt buộc (vi phạm = làm lại)
- Bám bố cục gốc (một cột / hai cột như gốc), chỉ đổi cách dựng; class tiền tố `ums-`, không Bootstrap.
- Lời gọi API: action + tham số + method chép nguyên văn; tên cột trả về chép nguyên văn; `strNguoiThucHien_Id` để hệ tự chèn; danh mục chung `ums.api.dm`.
- Thêm / Sửa / khung phụ lớn = biểu mẫu TRONG TRANG (`ums.crud` hoặc `ums.pat.formTrang`); hộp thoại chỉ cho chọn / xem / xác nhận / hàng loạt / tiến độ / import.
- Nút Đóng ngoài cùng trái (`ui.btn('close')`), mỗi lúc một nút Đóng hiện; một hành động = một biểu tượng (`ui.btn(kind)`, chữ giữ gốc; chữ "Chi tiết" phải kèm `icon: 'fa-eye'`).
- Cha → con khoá / xoá trắng (`pat.chain` hoặc `boLocNguoiHoc`); ô chọn trong bảng ít mục không select2; ô tệp `ui.file`; xoá nhiều `ui.xoaChon`; tệp đính kèm `{ type: 'files', api }`.
- Lỗi rõ của gốc (đọc ô không có, chép nhầm cột) → làm theo ý định, ghi "Khác gốc". Mã chết → "Cố ý bỏ".
- KHÔNG sửa `_v2/assets/**`, `demo-data.js`, `can-quyet.js`, `*.md`, `_harness/**`, tệp gốc. Thiếu gì ở tầng chung → tự xử trong màn + báo.

## Kiểm trước khi báo (Git Bash, `MSYS_NO_PATHCONV=1`, cổng `<9xx1..9xx4>` không trùng tác tử khác)
```
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/do-man.html?vt=<R..>&man=<ID>&sau=1" <cổng1>
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/kiem-dong-bo.html?vt=<R..>&tien=<TIỀN TỐ>&coTep=1" <cổng2>
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/thu-crud.html?vt=<R..>&tien=<TIỀN TỐ>" <cổng3>
MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/kiem-cot-trai.html?vt=<R..>&tien=<TIỀN TỐ>" <cổng4>
PYTHONIOENCODING=utf-8 python _harness/kiem-icon-chuan.py
```
Chỉ sửa lỗi thuộc màn của mình; lỗi màn khác ghi vào báo cáo.

## Báo cáo cuối (ngắn)
1. Tệp đã tạo. 2. Kết quả kiểm. 3. "Khác gốc" / "Cố ý bỏ". 4. Việc dữ liệu / backend (ghi `can-quyet.js`) và câu cần chốt (ghi `CAN-QUYET-DA-CHOT.md`). 5. Thiếu gì ở tầng chung.
