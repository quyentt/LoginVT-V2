# Kiểm thử đơn vị tầng chung `_v2/assets/js`

Lập 2026-10-15 (việc E của `_v2/DANH-GIA-2026-10-14.md`). jsdom + `node:test`, **không sửa mã chạy để "dễ test"**:
`moi-truong.js` nạp các IIFE theo đúng thứ tự `_v2/index.aspx`, hàm riêng (toQuery, cauKiem, lyDo, fromFixture…) kiểm qua hành vi
công khai (`ums.api.call` với `fetch` giả / chế độ demo).

```
cd _harness/test && npm install        # một lần (jsdom), node_modules đã .gitignore
node --test _harness/test/*.test.js    # từ gốc dự án, ~3 giây
```

| Tệp | Kiểm gì |
|---|---|
| `api.test.js` | POST form-urlencoded + tự chèn tham số hệ thống, GET, bọc `{A: AE()}` khi có iM, ORA-20xxx → câu kiểm dữ liệu, lỗi HTTP + trang IIS (hồi quy `/\s+/`), 401, mất kết nối, chỉ báo busy, chế độ demo (func → action#dm → action), `ums.util.ngaySinh` |
| `crud.test.js` | `filterValues` (mặc định khi chưa nạp), `formValues` (trim, checks on/off, static), `fillForm` khứ hồi, `fieldDef` trong items, render |
| `ui.test.js` | `ui.table`: Stt, escape, render, rỗng, phân trang, nhóm tiêu đề, dời cột Thao tác / ô chọn xuống cuối (`data-cot-goc`, `oTheoGoc`), tổng |
| `pat.test.js` | `pat.chain`: khoá con, xoá trắng khi đổi / xoá cha, ô nhiều, select2:clear phát lại, `phatLai: false` |

Bẫy đã gặp khi viết: giá trị sinh trong cửa sổ jsdom có prototype realm khác → so bằng `thuan()` (JSON) thay `deepStrictEqual`;
lỗi giả phải tạo bằng `new w.TypeError` (api.js kiểm `instanceof` trong realm của nó); jQuery 3 mã hoá khoảng trắng `%20` không phải `+`;
`.finally()` chạy sau khi `await` resolve một nhịp; select đơn tự chọn option đầu, đổi `multiple` sau thì giữ luôn.
