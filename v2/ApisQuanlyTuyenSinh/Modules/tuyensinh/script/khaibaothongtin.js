/* =========================================================================
   Khai báo thông tin — Form động (metadata) (Tuyển sinh › tuyensinh)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/html/khaibaothongtin.html + script/khaibaothongtin.js (814 dòng, 2026-06-03)
   ---------------------------------------------------------------------------
   TRANG MẪU: bản gốc KHÔNG gọi máy chủ lần nào — dữ liệu 7 thực thể metadata (PKG_CORE_GIAODIEN: Trường · Phân loại ·
   Danh mục · Mẫu khai · Cấu hình mẫu · Áp dụng đợt · Mapping nguồn) viết cứng trong SCHEMA, thêm / sửa / xoá chỉ đổi mảng
   trong bộ nhớ (chú thích "Origin: PKG_CORE_GIAODIEN.<Pkg>_Them / _Sua / _Xoa" là dự kiến, chưa có lời gọi). Chuyển
   nguyên như trang mẫu (cùng cách Dashboardv2 / Nhập học thongke): đầu trang ghi "Trang mẫu — dữ liệu dựng thử", mở lại
   màn là về dữ liệu mẫu như gốc. Khi có procedure thật thì thay ba hàm luu / xoa / (nạp) trong tệp này.

   Bố cục gốc MỘT CỘT: dải 7 tab (số thứ tự + tên) → (tab có subviews) dải chọn "Loại danh mục / Cây danh mục",
   "Nhóm / Section / Trường trong mẫu" → (tab có context) nhãn "Đang cấu hình cho: Mẫu: NHAPHOC_2027" → ô từ khoá +
   Tìm kiếm → khung "<tên tab> (n)" + nút "<newTitle>" → (tab có note) ghi chú vàng → bảng Stt · cột theo tab ·
   Thao tác (Chi tiết · Xóa). Chi tiết / Thêm mới mở hộp "Chi tiết" (nhóm → hàng nhãn | ô + chữ giải thích).

   Khác gốc / tự chốt:
     · Biểu mẫu thay chỗ danh sách ngay trong trang (BO-CUC luật 1) thay hộp thoại "Chi tiết"; nút Thêm mới lên đầu trang
       (luật 5) và giữ chữ theo tab như gốc ("Khai trường mới", "Gán trường vào module"…). Nút Đóng ngoài cùng bên trái.
     · Ô bắt buộc (dấu * ở gốc, gốc không kiểm) → nay kiểm khi Lưu.
     · Chế độ "Xem" + nút "Chuyển sang sửa" của gốc không có lối vào (renderForm chỉ được gọi với create / edit) → bỏ.
     · Ô "switch" (Có / Không) → ô đánh dấu; ô "modules" (viên chọn nhiều) → nhóm ô đánh dấu .ums-checkgrid.
     · Tìm kiếm: như gốc (lọc trong bộ nhớ theo mọi giá trị của dòng, nhớ từ khoá riêng từng tab / subview).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('ts-khaibaothongtin');
    if (!root) return;

    /* ---------- Danh sách chọn dùng chung (O của gốc) ---------- */
    var O = {
        linhvuc: ['Nhân thân', 'Liên hệ / Địa chỉ', 'Học tập', 'Nguyện vọng', 'Tài chính / Lương'],
        phamvi: ['Dùng chung', 'Theo module'],
        kieudl: ['TEXT', 'NUMBER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'FILE'],
        control: ['TEXTBOX', 'TEXTAREA', 'NUMBER', 'DATEPICKER', 'CHECKBOX', 'SELECT', 'RADIO', 'MULTISELECT', 'FILE', 'LABEL'],
        nguon: ['NONE', 'STATIC', 'TABLE', 'SQL', 'CASCADE'],
        modules: ['TUYENSINH', 'NHANSU', 'DAOTAO', 'KHENTHUONG'],
        owner: ['PERSON', 'HOPDONG', 'DETAI', 'DONVI'],
        ttmau: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        kct: ['BANG_1', 'BANG_N', 'KEYVALUE'],
        lienket: ['OWNER', 'INSTANCE', 'PARENT'],
        cachghi: ['INSERT', 'UPDATE', 'UPSERT']
    };

    /* badgeClass của gốc → tông nhãn chung (brand/teal → info, amber → warn, green → ok, rose → bad, gray → mute) */
    var TONE = {
        'Dùng chung': 'info', 'Theo module': 'info',
        'PUBLISHED': 'ok', 'DRAFT': 'warn', 'ARCHIVED': 'mute',
        'TEXT': 'info', 'NUMBER': 'info', 'DECIMAL': 'info',
        'DATE': 'warn', 'DATETIME': 'warn', 'BOOLEAN': 'mute', 'FILE': 'bad',
        'BANG_1': 'info', 'BANG_N': 'info', 'KEYVALUE': 'warn',
        'UPSERT': 'ok', 'INSERT': 'info', 'UPDATE': 'warn',
        'OWNER': 'info', 'INSTANCE': 'info', 'PARENT': 'warn'
    };
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function dash(t) { return '<span class="ums-u-faint">' + esc(t || '—') + '</span>'; }
    function mono(v) { return '<span class="kbtt-mono">' + esc(e(v)) + '</span>'; }
    function nhan(v, tone) { return ui.badge(e(v), tone || TONE[v] || 'mute'); }
    function hai(ma, ten) { return '<div class="ums-cell__title kbtt-mono">' + esc(e(ma)) + '</div>' + (ten ? '<div class="ums-cell__sub">' + esc(ten) + '</div>' : ''); }
    function batBuoc(r) { return r.batbuoc && r.batbuoc !== '0' ? nhan('Bắt buộc', 'bad') : dash(); }

    function F(key, label, type, opt) { var x = { key: key, label: label, type: type }; Object.keys(opt || {}).forEach(function (k) { x[k] = opt[k]; }); return x; }

    /* ---------- SCHEMA 7 thực thể — chép nguyên nội dung gốc ---------- */
    var SCHEMA = [
        {
            id: 'truong', nav: '1', title: 'Định nghĩa Trường', newTitle: 'Khai trường mới', unit: 'trường',
            columns: [
                { key: 'ma_truong', label: 'Mã trường', render: function (r) { return hai(r.ma_truong, r.ten_truong); } },
                { key: 'nhom', label: 'Lĩnh vực' },
                { key: 'pham_vi', label: 'Phạm vi', badge: 1 },
                { key: 'kieudl', label: 'Kiểu', badge: 1 },
                { key: 'control', label: 'Control' },
                { key: 'batbuoc', label: 'Bắt buộc', render: batBuoc }
            ],
            groups: [
                { title: 'Thông tin cơ bản', fields: [
                    F('ma_truong', 'Mã trường (KEY logic)', 'text', { req: 1, mono: 1, ph: 'NV_TOHOP', help: 'Mã định danh logic duy nhất, viết HOA_GACH_DUOI. Dùng làm KEY khi lưu EAV và tham chiếu cascade. Không đổi sau khi đã dùng.' }),
                    F('ten_truong', 'Tên hiển thị', 'text', { req: 1, ph: 'Tổ hợp môn', help: 'Nhãn mặc định trên form; mẫu có thể đổi nhãn riêng.' }),
                    F('nhom', 'Lĩnh vực', 'select', { opts: O.linhvuc, help: 'Chủ đề để gom/tìm trong thư viện. KHÔNG phải module, không quyết định nơi lưu.' }),
                    F('pham_vi', 'Phạm vi dùng', 'select', { req: 1, opts: O.phamvi, help: 'Dùng chung mọi module, hoặc Theo module (phải khai ở form Phân loại).' })
                ] },
                { title: 'Kiểu & hiển thị', fields: [
                    F('kieudl', 'Kiểu dữ liệu', 'select', { req: 1, opts: O.kieudl, help: 'Kiểu logic; quyết định cột EAV lưu giá trị.' }),
                    F('control', 'Loại control', 'select', { req: 1, opts: O.control, help: 'Widget hiển thị. SELECT/RADIO/MULTISELECT cần nguồn giá trị.' }),
                    F('chonnhieu', 'Cho chọn nhiều', 'switch', { help: 'Bật nếu trường nhận nhiều giá trị (chọn nhiều).' }),
                    F('batbuoc', 'Bắt buộc mặc định', 'switch', { help: 'Bắt buộc khi đặt vào mẫu; mẫu có thể override.' })
                ] },
                { title: 'Nguồn giá trị & ràng buộc', fields: [
                    F('nguon', 'Nguồn giá trị', 'select', { req: 1, opts: O.nguon, help: 'NONE nhập tự do · STATIC option tĩnh · TABLE bảng danh mục · SQL truy vấn · CASCADE danh mục phân cấp.' }),
                    F('dinhdang', 'Định dạng / Mask', 'text', { ph: 'dd/MM/yyyy', help: 'Mask hiển thị: ngày dd/MM/yyyy, số #,##0.00.' }),
                    F('cauhinh', 'Cấu hình nguồn (JSON)', 'json', { full: 1, ph: '{"table":"dm_tohop","valueCol":"id","labelCol":"ten"}', help: 'JSON trỏ NƠI lấy option (không chứa dữ liệu). Theo loại nguồn: TABLE/SQL/CASCADE.' }),
                    F('regex', 'Regex kiểm tra', 'text', { full: 1, mono: 1, ph: '^[0-9]{12}$', help: 'Biểu thức kiểm tra mặc định ở cấp thư viện (vd CCCD).' }),
                    F('ghichu', 'Ghi chú', 'textarea', { full: 1, help: 'Mô tả nội bộ cho người quản trị.' })
                ] }
            ],
            rows: [
                { ma_truong: 'HO_TEN', ten_truong: 'Họ và tên', nhom: 'Nhân thân', pham_vi: 'Dùng chung', kieudl: 'TEXT', control: 'TEXTBOX', nguon: 'NONE', batbuoc: 1, chonnhieu: 0 },
                { ma_truong: 'NGAY_SINH', ten_truong: 'Ngày sinh', nhom: 'Nhân thân', pham_vi: 'Dùng chung', kieudl: 'DATE', control: 'DATEPICKER', nguon: 'NONE', dinhdang: 'dd/MM/yyyy', batbuoc: 1, chonnhieu: 0 },
                { ma_truong: 'CCCD', ten_truong: 'Số CCCD', nhom: 'Nhân thân', pham_vi: 'Dùng chung', kieudl: 'TEXT', control: 'TEXTBOX', nguon: 'NONE', regex: '^[0-9]{12}$', batbuoc: 1, chonnhieu: 0 },
                { ma_truong: 'NV_TOHOP', ten_truong: 'Tổ hợp môn', nhom: 'Nguyện vọng', pham_vi: 'Theo module', kieudl: 'TEXT', control: 'MULTISELECT', nguon: 'TABLE', cauhinh: '{"table":"dm_tohop","valueCol":"id","labelCol":"ten"}', batbuoc: 0, chonnhieu: 1 },
                { ma_truong: 'LUONG_COBAN', ten_truong: 'Lương cơ bản', nhom: 'Tài chính / Lương', pham_vi: 'Theo module', kieudl: 'DECIMAL', control: 'NUMBER', nguon: 'NONE', batbuoc: 0, chonnhieu: 0 }
            ]
        },
        {
            id: 'phanloai', nav: '2', title: 'Phân loại Trường – Module', newTitle: 'Gán trường vào module', unit: 'phân loại',
            columns: [
                { key: 'ma_truong', label: 'Mã trường', render: function (r) { return mono(r.ma_truong); } },
                { key: 'pham_vi', label: 'Phạm vi', badge: 1 },
                { key: 'modules', label: 'Module áp dụng', render: function (r) {
                    if (r.pham_vi === 'Dùng chung') return nhan('Tất cả module', 'info');
                    var a = r.modules || [];
                    return a.length ? '<span class="kbtt-tags">' + a.map(function (m) { return nhan(m, 'info'); }).join('') + '</span>' : dash('— chưa gán —');
                } }
            ],
            groups: [{ title: 'Phân loại', fields: [
                F('ma_truong', 'Trường', 'text', { req: 1, mono: 1, ph: 'NV_TOHOP', help: 'Mã trường đã khai ở form Định nghĩa Trường.' }),
                F('pham_vi', 'Phạm vi', 'select', { req: 1, opts: O.phamvi, help: "Chỉ trường 'Theo module' mới cần chọn module bên dưới." }),
                F('modules', 'Module áp dụng', 'modules', { full: 1, opts: O.modules, help: "Chọn các module được dùng trường. Bỏ qua nếu phạm vi là 'Dùng chung'." })
            ] }],
            rows: [
                { ma_truong: 'HO_TEN', pham_vi: 'Dùng chung', modules: [] },
                { ma_truong: 'NV_TOHOP', pham_vi: 'Theo module', modules: ['TUYENSINH'] },
                { ma_truong: 'LUONG_COBAN', pham_vi: 'Theo module', modules: ['NHANSU'] },
                { ma_truong: 'HE_SO_PHUCAP', pham_vi: 'Theo module', modules: ['NHANSU', 'DAOTAO'] }
            ]
        },
        {
            id: 'danhmuc', nav: '3', title: 'Định nghĩa Danh mục',
            subviews: [
                {
                    key: 'loai', label: 'Loại danh mục', newTitle: 'Khai loại danh mục', unit: 'loại',
                    columns: [
                        { key: 'ma_loai', label: 'Mã loại', render: function (r) { return mono(r.ma_loai); } },
                        { key: 'ten_loai', label: 'Tên loại' },
                        { key: 'so_cap', label: 'Số cấp', render: function (r) { return nhan(e(r.so_cap) + ' cấp', 'info'); } },
                        { key: 'ten_cac_cap', label: 'Tên các cấp' }
                    ],
                    groups: [{ title: 'Loại danh mục', fields: [
                        F('ma_loai', 'Mã loại', 'text', { req: 1, mono: 1, ph: 'DIABAN', help: 'Mã loại duy nhất (DIABAN, NGANH, DONVI...). Trường CASCADE trỏ tới mã này.' }),
                        F('ten_loai', 'Tên loại', 'text', { req: 1, ph: 'Địa bàn hành chính', help: 'Tên hiển thị của loại danh mục.' }),
                        F('so_cap', 'Số cấp', 'number', { req: 1, ph: '3', help: 'Số cấp phân cấp của cây (vd 3 = Tỉnh/Quận/Phường).' }),
                        F('ten_cac_cap', 'Tên các cấp (JSON)', 'json', { full: 1, ph: '["Tỉnh/Thành","Quận/Huyện","Phường/Xã"]', help: 'Nhãn từng cấp.' })
                    ] }],
                    rows: [
                        { ma_loai: 'DIABAN', ten_loai: 'Địa bàn hành chính', so_cap: 3, ten_cac_cap: '["Tỉnh/Thành","Quận/Huyện","Phường/Xã"]' },
                        { ma_loai: 'NGANH', ten_loai: 'Ngành đào tạo', so_cap: 2, ten_cac_cap: '["Khối ngành","Ngành"]' }
                    ]
                },
                {
                    key: 'cay', label: 'Cây danh mục', newTitle: 'Khai nút danh mục', unit: 'nút',
                    columns: [
                        { key: 'ma', label: 'Mã', render: function (r) {
                            var cap = Math.max(1, Number(r.cap) || 1);
                            return '<span class="kbtt-mono" style="padding-left:' + ((cap - 1) * 18) + 'px">' + esc(e(r.ma)) + '</span>';
                        } },
                        { key: 'ten', label: 'Tên' },
                        { key: 'loai', label: 'Loại' },
                        { key: 'cap', label: 'Cấp', render: function (r) { return nhan('Cấp ' + e(r.cap), 'warn'); } },
                        { key: 'parent', label: 'Cha', render: function (r) { return r.parent ? mono(r.parent) : dash('(gốc)'); } }
                    ],
                    groups: [{ title: 'Nút danh mục', fields: [
                        F('ma', 'Mã (ma)', 'text', { req: 1, mono: 1, ph: 'HN_CG', help: 'Mã nút, duy nhất trong loại.' }),
                        F('ten', 'Tên (ten)', 'text', { req: 1, ph: 'Cầu Giấy', help: 'Tên hiển thị của nút.' }),
                        F('loai', 'Thuộc loại', 'select', { req: 1, opts: ['DIABAN', 'NGANH', 'DONVI'], help: 'Loại danh mục mà nút này thuộc về.' }),
                        F('cap', 'Cấp', 'number', { req: 1, ph: '2', help: 'Số cấp của nút (1 = gốc).' }),
                        F('parent', 'Mã cha (parent)', 'text', { mono: 1, ph: 'HN', help: 'Mã nút cha (adjacency list). Để trống nếu là cấp 1.' })
                    ] }],
                    rows: [
                        { ma: 'HN', ten: 'Hà Nội', loai: 'DIABAN', cap: 1, parent: '' },
                        { ma: 'HN_CG', ten: 'Cầu Giấy', loai: 'DIABAN', cap: 2, parent: 'HN' },
                        { ma: 'HN_CG_DV', ten: 'Dịch Vọng', loai: 'DIABAN', cap: 3, parent: 'HN_CG' }
                    ]
                }
            ]
        },
        {
            id: 'mau', nav: '4', title: 'Định nghĩa Mẫu khai', newTitle: 'Khai mẫu mới', unit: 'mẫu',
            columns: [
                { key: 'ma_mau', label: 'Mã mẫu', render: function (r) { return hai(r.ma_mau, r.ten_mau); } },
                { key: 'owner', label: 'Thực thể' },
                { key: 'module', label: 'Module', render: function (r) { return nhan(r.module || '—', 'info'); } },
                { key: 'trangthai', label: 'Trạng thái', badge: 1 },
                { key: 'hieuluc', label: 'Hiệu lực', render: function (r) { return esc((r.hieuluc_tu || '—') + ' → ' + (r.hieuluc_den || '—')); } }
            ],
            groups: [
                { title: 'Thông tin mẫu', fields: [
                    F('ma_mau', 'Mã mẫu', 'text', { req: 1, mono: 1, ph: 'NHAPHOC_2027', help: 'Mã mẫu duy nhất; mỗi lần đổi mẫu là một mã mới.' }),
                    F('ten_mau', 'Tên mẫu', 'text', { req: 1, ph: 'Hồ sơ nhập học 2027', help: 'Tên hiển thị của mẫu.' }),
                    F('owner', 'Loại thực thể', 'select', { opts: O.owner, help: 'Mẫu phục vụ thực thể nào. Person-centric thường để PERSON.' }),
                    F('module', 'Module', 'select', { opts: O.modules, help: 'Mảng nghiệp vụ mẫu thuộc về.' }),
                    F('mota', 'Mô tả', 'textarea', { full: 1, help: 'Mô tả ngắn về mẫu.' })
                ] },
                { title: 'Vòng đời & quy trình', fields: [
                    F('trangthai', 'Trạng thái', 'select', { req: 1, opts: O.ttmau, help: 'DRAFT · PUBLISHED · ARCHIVED.' }),
                    F('wf', 'Quy trình duyệt', 'text', { mono: 1, ph: 'WF_XETHOSO', help: 'Mã quy trình duyệt; để trống nếu không cần duyệt.' }),
                    F('socot', 'Số cột lưới', 'number', { ph: '12', help: 'Số cột lưới gốc làm khung layout.' }),
                    F('kichhoat', 'Kích hoạt', 'switch', { help: 'Bật = đang dùng; tắt = ẩn mềm.' }),
                    F('hieuluc_tu', 'Hiệu lực từ', 'text', { ph: '2027-01-01', help: 'Ngày bắt đầu hiệu lực (ISO).' }),
                    F('hieuluc_den', 'Hiệu lực đến', 'text', { ph: '2027-08-31', help: 'Ngày kết thúc hiệu lực (ISO).' })
                ] }
            ],
            rows: [
                { ma_mau: 'NHAPHOC_2027', ten_mau: 'Hồ sơ nhập học 2027', owner: 'PERSON', module: 'TUYENSINH', trangthai: 'PUBLISHED', wf: 'WF_XETHOSO', socot: 12, kichhoat: 1, hieuluc_tu: '2027-01-01', hieuluc_den: '2027-08-31', mota: 'Khai hồ sơ nhập học đợt 2027' },
                { ma_mau: 'NHAPHOC_2026', ten_mau: 'Hồ sơ nhập học 2026', owner: 'PERSON', module: 'TUYENSINH', trangthai: 'ARCHIVED', socot: 12, kichhoat: 0, hieuluc_tu: '2026-01-01', hieuluc_den: '2026-08-31' },
                { ma_mau: 'LYLICH_CB', ten_mau: 'Lý lịch cán bộ', owner: 'PERSON', module: 'NHANSU', trangthai: 'DRAFT', socot: 12, kichhoat: 1 }
            ]
        },
        {
            id: 'cauhinh', nav: '5', title: 'Cấu hình Trường trong Mẫu', context: 'Mẫu: NHAPHOC_2027',
            subviews: [
                {
                    key: 'nhom', label: 'Nhóm / Section', newTitle: 'Khai nhóm/section', unit: 'nhóm',
                    columns: [
                        { key: 'ten', label: 'Tên nhóm', render: function (r) { return '<div class="ums-cell__title">' + esc(e(r.ten)) + '</div><div class="ums-cell__sub kbtt-mono">' + esc(e(r.ma)) + '</div>'; } },
                        { key: 'buoc', label: 'Bước', render: function (r) { return nhan('Bước ' + e(r.buoc), 'mute'); } },
                        { key: 'socot', label: 'Số cột' },
                        { key: 'laplai', label: 'Lặp lại', render: function (r) { return r.laplai && r.laplai !== '0' ? nhan('Lặp ' + (r.min || 1) + '–' + e(r.max), 'info') : dash(); } },
                        { key: 'nguon', label: 'Nguồn lưu', render: function (r) { return r.nguon ? mono(r.nguon) : dash('EAV'); } }
                    ],
                    groups: [{ title: 'Nhóm / section', fields: [
                        F('ma', 'Mã nhóm', 'text', { req: 1, mono: 1, ph: 'G_NV', help: 'Mã section trong mẫu.' }),
                        F('ten', 'Tên nhóm', 'text', { req: 1, ph: 'Nguyện vọng', help: 'Tiêu đề section hiển thị.' }),
                        F('buoc', 'Bước (wizard)', 'number', { ph: '1', help: 'Trang/bước trong wizard; cùng bước = cùng trang.' }),
                        F('socot', 'Số cột', 'number', { ph: '12', help: 'Số cột lưới riêng của nhóm.' }),
                        F('nhomcha', 'Nhóm cha', 'text', { mono: 1, help: 'Mã nhóm cha nếu lồng nhau; để trống nếu cấp 1.' }),
                        F('laplai', 'Nhóm lặp lại', 'switch', { help: 'Bật nếu là danh sách nhiều dòng (bảng con).' }),
                        F('min', 'Số dòng tối thiểu', 'number', { help: 'Áp dụng khi nhóm lặp.' }),
                        F('max', 'Số dòng tối đa', 'number', { help: 'Áp dụng khi nhóm lặp.' }),
                        F('nguon', 'Nguồn (nếu lặp)', 'text', { full: 1, mono: 1, ph: 'NGUYENVONG', help: 'Mã nguồn BANG_N để đổ dữ liệu nhóm lặp; để trống = EAV.' })
                    ] }],
                    rows: [
                        { ma: 'G_CANHAN', ten: 'Thông tin cá nhân', buoc: 1, socot: 12, laplai: 0, nguon: '' },
                        { ma: 'G_DIACHI', ten: 'Địa chỉ thường trú', buoc: 1, socot: 12, laplai: 0, nguon: '' },
                        { ma: 'G_NV', ten: 'Nguyện vọng', buoc: 2, socot: 12, laplai: 1, min: 1, max: 10, nguon: 'NGUYENVONG' }
                    ]
                },
                {
                    key: 'truong', label: 'Trường trong mẫu', newTitle: 'Đặt trường vào mẫu', unit: 'trường',
                    columns: [
                        { key: 'truong', label: 'Trường', render: function (r) { return hai(r.truong, r.nhan); } },
                        { key: 'nhom', label: 'Nhóm', render: function (r) { return mono(r.nhom); } },
                        { key: 'socot', label: 'Cột chiếm' },
                        { key: 'batbuoc', label: 'Bắt buộc', render: batBuoc },
                        { key: 'luu', label: 'Nơi lưu', render: function (r) { return r.nguon ? mono(r.nguon + '.' + e(r.cotdich)) : nhan('EAV', 'warn'); } }
                    ],
                    groups: [
                        { title: 'Đặt trường & bố cục', fields: [
                            F('nhom', 'Nhóm', 'text', { req: 1, mono: 1, ph: 'G_CANHAN', help: 'Mã nhóm chứa trường.' }),
                            F('truong', 'Trường (ma_truong)', 'text', { req: 1, mono: 1, ph: 'HO_TEN', help: 'Mã trường từ thư viện.' }),
                            F('thutu', 'Thứ tự', 'number', { ph: '1', help: 'Thứ tự trong nhóm.' }),
                            F('socot', 'Số cột chiếm', 'number', { ph: '6', help: 'Colspan trên lưới (1–12).' }),
                            F('nhan', 'Nhãn override', 'text', { help: 'Đổi nhãn so với thư viện; trống = kế thừa.' }),
                            F('control', 'Control override', 'select', { opts: ['(kế thừa)'].concat(O.control), help: "Đổi control; '(kế thừa)' = theo thư viện." }),
                            F('batbuoc', 'Bắt buộc', 'switch', { help: 'Override bắt buộc; tắt = theo thư viện.' }),
                            F('chidoc', 'Chỉ đọc', 'switch', { help: 'Hiển thị nhưng không cho sửa.' })
                        ] },
                        { title: 'Định tuyến nơi lưu (mapping)', fields: [
                            F('nguon', 'Nguồn lưu', 'text', { mono: 1, ph: 'PERSON', help: 'Mã nguồn (ở form Mapping). Trống = ghi vào EAV.' }),
                            F('cotdich', 'Cột đích', 'text', { mono: 1, ph: 'ho_ten', help: 'Cột trong bảng thật của nguồn.' }),
                            F('dieukien', 'Điều kiện hiện (JSON)', 'json', { full: 1, ph: '{"truong":"CO_UU_TIEN","op":"=","giaTri":"1"}', help: 'Ẩn/hiện theo giá trị trường khác.' })
                        ] }
                    ],
                    rows: [
                        { nhom: 'G_CANHAN', truong: 'HO_TEN', thutu: 1, socot: 6, batbuoc: 1, nguon: 'PERSON', cotdich: 'ho_ten', nhan: 'Họ tên thí sinh' },
                        { nhom: 'G_CANHAN', truong: 'NGAY_SINH', thutu: 2, socot: 3, batbuoc: 1, nguon: 'PERSON', cotdich: 'ngay_sinh' },
                        { nhom: 'G_CANHAN', truong: 'CCCD', thutu: 3, socot: 3, batbuoc: 1, nguon: 'PERSON', cotdich: 'cccd' },
                        { nhom: 'G_NV', truong: 'NV_NGANH', thutu: 1, socot: 8, batbuoc: 1, nguon: 'NGUYENVONG', cotdich: 'nganh_id' },
                        { nhom: 'G_NV', truong: 'NV_TOHOP', thutu: 2, socot: 4, batbuoc: 0, nguon: '', cotdich: '' }
                    ]
                }
            ]
        },
        {
            id: 'apdung', nav: '6', title: 'Áp dụng cho Đợt', newTitle: 'Khai phạm vi áp dụng', unit: 'điều kiện',
            note: 'Mẫu khớp khi MỌI giá trị ngữ cảnh của nó đều nằm trong tập ngữ cảnh chạy thực tế. Mẫu không có dòng nào = áp dụng mọi ngữ cảnh. Giá trị phải là id duy nhất (KH2027, DOT2027_01), không dùng số trần.',
            columns: [
                { key: 'ma_mau', label: 'Mã mẫu', render: function (r) { return mono(r.ma_mau); } },
                { key: 'context', label: 'Giá trị ngữ cảnh (id)', render: function (r) { return nhan(r.context, 'info'); } },
                { key: 'kichhoat', label: 'Kích hoạt', render: function (r) { return r.kichhoat && r.kichhoat !== '0' ? nhan('Đang áp dụng', 'ok') : nhan('Tắt', 'mute'); } },
                { key: 'ghichu', label: 'Ghi chú' }
            ],
            groups: [{ title: 'Phạm vi áp dụng', fields: [
                F('ma_mau', 'Mã mẫu', 'text', { req: 1, mono: 1, ph: 'NHAPHOC_2027', help: 'Mẫu cần gắn phạm vi.' }),
                F('context', 'Giá trị ngữ cảnh (id)', 'text', { req: 1, mono: 1, ph: 'DOT2027_01', help: 'id duy nhất của kế hoạch/đợt/phương thức mà mẫu áp dụng.' }),
                F('kichhoat', 'Kích hoạt', 'switch', { help: 'Bật = điều kiện đang áp dụng.' }),
                F('ghichu', 'Ghi chú', 'textarea', { full: 1, help: 'Diễn giải điều kiện này.' })
            ] }],
            rows: [
                { ma_mau: 'NHAPHOC_2027', context: 'KH2027', kichhoat: 1, ghichu: 'Áp dụng cho kế hoạch tuyển sinh 2027' },
                { ma_mau: 'NHAPHOC_2027', context: 'DOT2027_01', kichhoat: 1, ghichu: '... VÀ riêng đợt 1 (AND)' },
                { ma_mau: 'NHAPHOC_BOSUNG', context: 'DOT2027_BS', kichhoat: 1, ghichu: 'Mẫu bổ sung chỉ cho đợt bổ sung' }
            ]
        },
        {
            id: 'mapping', nav: '7', title: 'Cấu hình Mapping', context: 'Mẫu: NHAPHOC_2027', newTitle: 'Khai nguồn lưu', unit: 'nguồn',
            columns: [
                { key: 'ma_nguon', label: 'Mã nguồn', render: function (r) { return mono(r.ma_nguon); } },
                { key: 'kct', label: 'Kiểu cấu trúc', badge: 1 },
                { key: 'bang', label: 'Bảng đích', render: function (r) { return mono(r.bang); } },
                { key: 'lienket', label: 'Liên kết', render: function (r) { return mono(r.cot_lienket) + ' ' + nhan(r.lienket); } },
                { key: 'cachghi', label: 'Cách ghi', badge: 1 },
                { key: 'thutughi', label: 'T.tự', render: function (r) { return nhan('#' + e(r.thutughi), 'mute'); } }
            ],
            groups: [
                { title: 'Nguồn lưu', fields: [
                    F('ma_nguon', 'Mã nguồn', 'text', { req: 1, mono: 1, ph: 'PERSON', help: 'Mã nguồn trong mẫu; trường/nhóm trỏ tới mã này.' }),
                    F('kct', 'Kiểu cấu trúc', 'select', { req: 1, opts: O.kct, help: 'BANG_1 ngang 1 dòng · BANG_N ngang nhiều dòng · KEYVALUE bảng dọc (EAV).' }),
                    F('bang', 'Bảng đích', 'text', { req: 1, mono: 1, ph: 'CORE_PERSON', help: 'Tên bảng nghiệp vụ (kể cả bảng EAV).' }),
                    F('cot_khoa', 'Cột khóa', 'text', { mono: 1, ph: 'id', help: 'Khóa chính của bảng đích.' })
                ] },
                { title: 'Liên kết & cách ghi', fields: [
                    F('cot_lienket', 'Cột liên kết', 'text', { req: 1, mono: 1, ph: 'person_id', help: 'Cột FK gắn dòng về đối tượng/hồ sơ.' }),
                    F('lienket', 'Liên kết với', 'select', { req: 1, opts: O.lienket, help: 'OWNER theo người · INSTANCE theo hồ sơ · PARENT theo dòng cha.' }),
                    F('cot_thuoctinh', 'Cột thuộc tính (KEYVALUE)', 'text', { mono: 1, ph: 'ma_truong', help: 'Chỉ với KEYVALUE: cột chứa tên thuộc tính.' }),
                    F('cot_dinhdanh', 'Cột định danh', 'text', { mono: 1, ph: 'cccd', help: 'Cột dò trùng khi UPSERT, tránh tạo trùng.' }),
                    F('cachghi', 'Cách ghi', 'select', { req: 1, opts: O.cachghi, help: 'INSERT/UPDATE/UPSERT.' }),
                    F('thutughi', 'Thứ tự ghi', 'number', { ph: '1', help: 'Thứ tự fan-out: bảng người trước, con sau, EAV cuối.' })
                ] }
            ],
            rows: [
                { ma_nguon: 'PERSON', kct: 'BANG_1', bang: 'CORE_PERSON', cot_khoa: 'id', cot_lienket: 'id', lienket: 'OWNER', cot_dinhdanh: 'cccd', cachghi: 'UPSERT', thutughi: 1 },
                { ma_nguon: 'DIACHI', kct: 'BANG_N', bang: 'CORE_DIACHI', cot_khoa: 'id', cot_lienket: 'person_id', lienket: 'OWNER', cachghi: 'UPSERT', thutughi: 2 },
                { ma_nguon: 'NGUYENVONG', kct: 'BANG_N', bang: 'TS_NGUYENVONG', cot_khoa: 'id', cot_lienket: 'hoso_id', lienket: 'INSTANCE', cachghi: 'UPSERT', thutughi: 3 },
                { ma_nguon: 'EAV', kct: 'KEYVALUE', bang: 'tbl_form_instance_giatri', cot_khoa: 'id', cot_lienket: 'instance_Id', cot_thuoctinh: 'ma_truong', lienket: 'INSTANCE', cachghi: 'INSERT', thutughi: 9 }
            ]
        }
    ];

    /* ---------- Trạng thái (objDB / objSubview / objSearch của gốc) ---------- */
    var DB = {}, SUB = {}, TIM = {}, uidN = 1000;
    SCHEMA.forEach(function (m) {
        if (m.subviews) {
            SUB[m.id] = m.subviews[0].key;
            m.subviews.forEach(function (sv) {
                DB[m.id + ':' + sv.key] = sv.rows.map(function (r, i) { var x = { _id: m.id + sv.key + i }; Object.keys(r).forEach(function (k) { x[k] = r[k]; }); return x; });
            });
        } else {
            DB[m.id] = m.rows.map(function (r, i) { var x = { _id: m.id + i }; Object.keys(r).forEach(function (k) { x[k] = r[k]; }); return x; });
        }
    });
    var act = SCHEMA[0].id, dangSua = null;          // dangSua: null = thêm mới, còn lại = _id dòng đang sửa

    function tim(id) { return SCHEMA.filter(function (m) { return m.id === id; })[0]; }
    function view() {
        var m = tim(act);
        if (m.subviews) {
            var sv = m.subviews.filter(function (x) { return x.key === SUB[m.id]; })[0];
            return { m: m, v: sv, k: m.id + ':' + sv.key };
        }
        return { m: m, v: m, k: m.id };
    }
    function dong(k) {
        var rows = DB[k] || [];
        var q = (TIM[k] || '').toLowerCase().trim();
        if (!q) return rows;
        return rows.filter(function (r) {
            return Object.keys(r).filter(function (x) { return x !== '_id'; }).map(function (x) { return e(r[x]); }).join(' ').toLowerCase().indexOf(q) >= 0;
        });
    }

    /* ---------- Khung trang ---------- */
    root.innerHTML =
        '<div data-kb="ds">' +
            '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Khai báo thông tin</h1>' +
            '<div class="ums-page__actions"><span class="kbtt-mau"><i class="fa-light fa-flask"></i> Trang mẫu — dữ liệu dựng thử</span>' +
            ui.btn('add', { attr: { 'data-kb': 'them' } }) + '</div></div>' +
            '<div data-kb="tabs"></div>' +
            '<div class="ums-u-mt-4" data-kb="sub" hidden></div>' +
            '<div class="ums-u-mt-4" data-kb="ctx" hidden></div>' +
            '<div class="ums-panel ums-u-mt-4"><div class="ums-panel__body"><div class="ums-filter">' +
                '<div class="ums-field kbtt-q"><input class="ums-input" data-kb="q" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-kb': 'tim' } }) + '</div>' +
            '</div></div></div>' +
            pat.panel({ title: 'Danh sách', icon: 'fa-database', count: 'kbDem', flush: true, cls: 'ums-u-mt-4',
                body: '<div class="kbtt-note" data-kb="note" hidden></div><div data-kb="bang"></div>' }) +
        '</div>' +
        '<div data-kb="form" hidden></div>';
    function Z(k) { return root.querySelector('[data-kb="' + k + '"]'); }
    var zDs = Z('ds'), zForm = Z('form');

    Z('tabs').innerHTML = ui.tabs(SCHEMA.map(function (m) { return { key: m.id, text: m.nav + '. ' + m.title }; }), act, 'data-kbtab');

    function ve() {
        var a = view(), m = a.m, v = a.v;
        ui.tabsActive(Z('tabs'), m.id, 'data-kbtab');
        var sub = Z('sub');
        sub.hidden = !m.subviews;
        if (m.subviews) sub.innerHTML = ui.chips(m.subviews.map(function (x) { return { key: x.key, label: x.label }; }), SUB[m.id]);
        var ctx = Z('ctx');
        ctx.hidden = !m.context;
        if (m.context) ctx.innerHTML = '<span class="kbtt-ctx">' + ui.badge('Đang cấu hình cho', 'mute') + ' ' + ui.badge(m.context, 'info') + '</span>';
        var note = Z('note');
        note.hidden = !m.note;
        note.textContent = m.note || '';
        root.querySelector('[data-kb="ds"] .ums-panel__title').innerHTML = '<i class="fa-light fa-database"></i> ' + esc(m.title) +
            ' <span class="ums-u-faint ums-u-fz13" data-z="kbDem"></span>';
        var nut = Z('them'); nut.querySelector('span').textContent = v.newTitle || 'Thêm mới';
        var q = Z('q'); q.value = TIM[a.k] || ''; q.placeholder = 'Tìm ' + v.unit + '…';
        veBang(a);
    }

    function veBang(a) {
        var rows = dong(a.k);
        var cols = a.v.columns.map(function (c) {
            return { title: c.label, render: function (r) {
                if (c.render) return c.render(r);
                var val = r[c.key];
                if (val === undefined || val === null || val === '') return dash();
                return c.badge ? nhan(val) : esc(e(val));
            } };
        });
        cols.push({ title: 'Thao tác', cls: 'is-center is-nowrap', width: '190px', render: function (r) {
            return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-kbsua': r._id, title: 'Xem - sửa bản ghi' } }) + ' ' +
                ui.btn('del', { text: 'Xóa', cls: 'ums-btn--sm', attr: { 'data-kbxoa': r._id, title: 'Xóa bản ghi' } });
        } });
        ui.table({ el: Z('bang'), rows: rows, columns: cols,
            empty: 'Chưa có ' + a.v.unit + ' nào. Bấm ' + (a.v.newTitle || 'Thêm mới') + ' để khai bản ghi đầu tiên.' });
        var dem = root.querySelector('[data-z="kbDem"]');
        if (dem) dem.textContent = '(' + rows.length + ')';
    }

    /* ---------- Biểu mẫu (renderForm của gốc) ---------- */
    function oHtml(f, val) {
        var attr = 'data-kbk="' + esc(f.key) + '"';
        var v = e(val);
        switch (f.type) {
            case 'textarea':
                return '<textarea class="ums-textarea" ' + attr + ' placeholder="' + esc(f.ph || '') + '">' + esc(v) + '</textarea>';
            case 'json':
                return '<textarea class="ums-textarea kbtt-mono" ' + attr + ' placeholder="' + esc(f.ph || '') + '">' + esc(v) + '</textarea>';
            case 'number':
                return '<input class="ums-input" inputmode="decimal" ' + attr + ' value="' + esc(v) + '" placeholder="' + esc(f.ph || '') + '" autocomplete="off">';
            case 'select':
                return '<select class="ums-select" ' + attr + ' data-ph="— chọn —"><option value="">— chọn —</option>' +
                    (f.opts || []).map(function (x) { return '<option' + (String(x) === v ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select>';
            case 'switch':
                return '<label class="ums-check"><input type="checkbox" ' + attr + (val && String(val) !== '0' ? ' checked' : '') + '> Có</label>';
            case 'modules':
                var arr = Array.isArray(val) ? val : [];
                return '<div class="ums-checkgrid" ' + attr + '>' + (f.opts || []).map(function (x) {
                    return '<label class="ums-check"><input type="checkbox" value="' + esc(x) + '"' + (arr.indexOf(x) >= 0 ? ' checked' : '') + '> ' + esc(x) + '</label>';
                }).join('') + '</div>';
            default:
                return '<input class="ums-input' + (f.mono ? ' kbtt-mono' : '') + '" ' + attr + ' value="' + esc(v) + '" placeholder="' + esc(f.ph || '') + '" autocomplete="off">';
        }
    }

    function moForm(id) {
        var a = view(), m = a.m, v = a.v;
        dangSua = id || null;
        var rec = id ? (DB[a.k].filter(function (r) { return r._id === id; })[0] || {}) : {};
        var body = (m.note ? '<div class="kbtt-note">' + esc(m.note) + '</div>' : '') +
            v.groups.map(function (g) {
                return '<div class="ums-legend">' + esc(g.title) + '</div><div class="ums-grid ums-grid--2">' +
                    g.fields.map(function (f) {
                        var fld = ui.field(f.label, oHtml(f, rec[f.key]), { required: !!f.req, hint: f.help });
                        return f.full || f.type === 'textarea' || f.type === 'json' || f.type === 'modules' ? '<div style="grid-column:1 / -1">' + fld + '</div>' : '<div>' + fld + '</div>';
                    }).join('') + '</div>';
            }).join('');
        zForm.innerHTML = pat.panel({
            title: id ? 'Sửa bản ghi · ' + m.title : (v.newTitle || 'Khai mới'),
            icon: id ? 'fa-pen-to-square' : 'fa-plus',
            tools: ui.btn('close', { attr: { 'data-kb': 'dong' } }) +
                (id ? ui.btn('del', { text: 'Xóa', attr: { 'data-kbxoa': id } }) : '') +
                ui.btn('save', { attr: { 'data-kb': 'luu' } }),
            body: body
        });
        ui.enhance(zForm);
        ui.swap(zDs, zForm);
    }
    function dongForm() { dangSua = null; ui.swap(zForm, zDs); zForm.innerHTML = ''; }

    function luu() {
        var a = view(), rec = {}, thieu = [];
        a.v.groups.forEach(function (g) {
            g.fields.forEach(function (f) {
                var el = zForm.querySelector('[data-kbk="' + f.key + '"]');
                if (!el) return;
                var val;
                if (f.type === 'switch') val = el.checked ? 1 : 0;
                else if (f.type === 'modules') val = Array.prototype.filter.call(el.querySelectorAll('input'), function (x) { return x.checked; }).map(function (x) { return x.value; });
                else val = (el.value || '').trim();
                rec[f.key] = val;
                var trong = f.type === 'modules' ? false : (f.type !== 'switch' && !val);
                el.classList.toggle('is-invalid', !!(f.req && trong));
                var s2 = el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('select2') ? el.nextElementSibling : null;
                if (s2) s2.classList.toggle('is-invalid', !!(f.req && trong));
                if (f.req && trong) thieu.push(f.label);
            });
        });
        if (thieu.length) { ui.toast('Kiểm tra lại: ' + thieu.join(', '), 'warn'); return; }
        if (!dangSua) {
            rec._id = 'n' + (uidN++);
            (DB[a.k] = DB[a.k] || []).unshift(rec);
            ui.toast('Đã thêm bản ghi mới', 'ok');
        } else {
            DB[a.k] = DB[a.k].map(function (r) {
                if (r._id !== dangSua) return r;
                var x = {}; Object.keys(r).forEach(function (k) { x[k] = r[k]; }); Object.keys(rec).forEach(function (k) { x[k] = rec[k]; });
                return x;
            });
            ui.toast('Đã lưu thay đổi', 'ok');
        }
        dongForm();
        ve();
    }

    function xoa(id) {
        ui.confirm('Bạn có chắc chắn xóa bản ghi này không?', { tone: 'bad', ok: 'Xóa', title: 'Xóa bản ghi' }).then(function (yes) {
            if (!yes) return;
            var k = view().k;
            DB[k] = (DB[k] || []).filter(function (r) { return r._id !== id; });
            if (!zForm.hidden) dongForm();
            ve();
            ui.toast('Đã xóa bản ghi', 'ok');
        });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-kbtab],[data-chip],[data-kb],[data-kbsua],[data-kbxoa]');
        if (!t || !root.contains(t)) return;
        if (t.hasAttribute('data-kbtab')) { act = t.getAttribute('data-kbtab'); ve(); return; }
        if (t.hasAttribute('data-chip')) { SUB[act] = t.getAttribute('data-chip'); ve(); return; }
        if (t.hasAttribute('data-kbsua')) { moForm(t.getAttribute('data-kbsua')); return; }
        if (t.hasAttribute('data-kbxoa')) { xoa(t.getAttribute('data-kbxoa')); return; }
        var k = t.getAttribute('data-kb');
        if (k === 'them') moForm(null);
        else if (k === 'tim') { TIM[view().k] = Z('q').value || ''; ve(); }
        else if (k === 'dong') dongForm();
        else if (k === 'luu') luu();
    });
    Z('q').addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); TIM[view().k] = Z('q').value || ''; ve(); }
    });

    ve();
})();
