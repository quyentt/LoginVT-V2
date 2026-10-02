# _v2/assets/vendor — thư viện của bộ giao diện

Thư mục `_v2/` **tự chứa mọi phụ thuộc**: sao chép nguyên thư mục đi đâu cũng
chạy, không trỏ ra ngoài, không gọi CDN lúc chạy.

| Thư mục | Thư viện | Phiên bản | Lấy từ |
|---|---|---|---|
| `bootstrap/` | Bootstrap | 5.3.8 | `html data/bootstrap-5.3.8-dist/` |
| `fontawesome/` | Font Awesome Pro | 7.3.1 | `html data/awesome/` |
| `jquery/` | jQuery | 3.7.1 | `assets/js/` |
| `select2/` | select2 + skin bootstrap-5 + i18n `vi` | 4.1.0-rc.0 / 1.3.0 | tải về 2026-09-15 |
| `flatpickr/` | flatpickr + locale `vn` | 4.6.13 | tải về 2026-09-15 |
| `chart/` | Chart.js UMD + plugin datalabels | 4.4.2 / 2.2.0 | tải về 2026-09-15 |

Font chữ Mulish nằm ở `_v2/assets/fonts/` (7 độ đậm), sao từ `assets/fonts/`.

## Về Font Awesome

Chỉ lấy phần cần dùng thay vì cả gói 8,2 MB:

- CSS: `fontawesome.min.css` (lõi) + `light` + `solid` + `regular` + `brands`
- Webfont: 4 tệp `.woff2` tương ứng

Bộ giao diện dùng chủ yếu `fa-light`. Muốn thêm kiểu khác (`duotone`, `sharp`,
`thin`…) thì chép thêm tệp CSS và `.woff2` tương ứng từ `html data/awesome/`,
rồi thêm một dòng `@import` vào `assets/css/main.css`.

## Về Chart.js

Dùng bản **UMD**. Bản `assets/js/chart.js` của dự án là ESM, không nạp được
bằng thẻ `<script>` thường — đó là lý do 86 chỗ trong dự án đang phải gọi
Chart.js từ CDN.
