# Thay đổi của kho gốc CHỜ chuyển sang `_v2`

Mỗi lần kéo mã gốc về mà **chưa** chuyển thay đổi sang `_v2` thì ghi vào đây. Phiên chuyển đổi kế tiếp đọc tệp này
trước, làm xong mục nào thì xoá mục đó (ghi điều đã chốt vào `CAN-QUYET-DA-CHOT.md`, việc dữ liệu vào `can-quyet.js`).

Xem lại đúng thay đổi của một tệp: `git diff -w <từ>..<đến> -- <đường dẫn tệp gốc>`.

---

## Hiện KHÔNG có thay đổi gốc nào đang chờ chuyển

Lần kéo 4 (30/9, merge `cffda56e`) + lần kéo 5 (1/10, merge `c6886b05`) — ĐÃ CHUYỂN 1/10: 20 màn (CCB `lichgiangnhieuphonghoc`, Cổng SV 18 màn,
màn mới Cổng SV `dicvusinhvien/nguoihocxacnhanthanhtoan`). Điều đã chốt: `CAN-QUYET-DA-CHOT.md` mục "Chốt ngày 2026-10-01". **CHƯA kiểm host, CHƯA commit** — danh sách màn cần kiểm: `_harness/kiem-host/VIEC-PHIEN-SAU.md` mục 1 (nhắc đầu tiên khi người dùng bảo "chuyển" / "kiểm").

Còn ghi nhớ (không phải việc chuyển lúc này): kho gốc có phân hệ mới `ApisThiTracNghiem/` và thay đổi `ApisQuanLyThiTracNghiem/` —
hai phân hệ chưa chuyển sang `_v2`, khi chuyển thì theo bản gốc mới nhất.
