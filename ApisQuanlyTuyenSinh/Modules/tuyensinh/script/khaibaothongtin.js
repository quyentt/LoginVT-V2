/*----------------------------------------------
--Author:
--Date of created: 2026-06-03
--Note: Khai báo Thông tin – Form động (metadata).
--      Quản trị 7 thực thể metadata theo PKG_CORE_GIAODIEN:
--      Trường · Phân loại · Danh mục · Mẫu khai ·
--      Cấu hình mẫu · Áp dụng đợt · Mapping nguồn.
----------------------------------------------*/
function KhaiBaoThongTin() { };
KhaiBaoThongTin.prototype = {

    /*------------------------------------------
    -- State
    -------------------------------------------*/
    strActive_Id: 'truong',
    objSubview: {},
    objSearch: {},
    objDB: {},
    intUid: 1000,
    strCurMode: null,   // 'create' | 'edit' | 'view'
    strCurId: null,

    /*------------------------------------------
    -- Option lists dùng chung
    -------------------------------------------*/
    O: {
        linhvuc: ["Nhân thân", "Liên hệ / Địa chỉ", "Học tập", "Nguyện vọng", "Tài chính / Lương"],
        phamvi: ["Dùng chung", "Theo module"],
        kieudl: ["TEXT", "NUMBER", "DECIMAL", "DATE", "DATETIME", "BOOLEAN", "FILE"],
        control: ["TEXTBOX", "TEXTAREA", "NUMBER", "DATEPICKER", "CHECKBOX", "SELECT", "RADIO", "MULTISELECT", "FILE", "LABEL"],
        nguon: ["NONE", "STATIC", "TABLE", "SQL", "CASCADE"],
        modules: ["TUYENSINH", "NHANSU", "DAOTAO", "KHENTHUONG"],
        owner: ["PERSON", "HOPDONG", "DETAI", "DONVI"],
        ttmau: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        kct: ["BANG_1", "BANG_N", "KEYVALUE"],
        lienket: ["OWNER", "INSTANCE", "PARENT"],
        cachghi: ["INSERT", "UPDATE", "UPSERT"]
    },

    /*------------------------------------------
    -- Schema driven: 7 module metadata
    -------------------------------------------*/
    getSCHEMA: function () {
        var me = this, O = me.O;
        var F = function (key, label, type, opt) { opt = opt || {}; return $.extend({ key: key, label: label, type: type }, opt); };
        return [
            {
                id: "truong", pkg: "Truong", nav: "1", title: "Định nghĩa Trường",
                subtitle: "Khai từng trường thông tin vào thư viện dùng chung (dm_form_truong) — tái sử dụng cho nhiều mẫu.",
                newTitle: "Khai trường mới", unit: "trường",
                columns: [
                    { key: "ma_truong", label: "Mã trường", render: function (r) { return '<div class="kbtt-cellname"><span class="kbtt-mono">' + (r.ma_truong || '') + '</span><div class="sub">' + (r.ten_truong || '') + '</div></div>'; } },
                    { key: "nhom", label: "Lĩnh vực" },
                    { key: "pham_vi", label: "Phạm vi", badge: 1 },
                    { key: "kieudl", label: "Kiểu", badge: 1 },
                    { key: "control", label: "Control" },
                    { key: "batbuoc", label: "Bắt buộc", render: function (r) { return r.batbuoc ? '<span class="kbtt-badge kbtt-b-rose kbtt-dot">Bắt buộc</span>' : '<span class="kbtt-dash">—</span>'; } }
                ],
                groups: [
                    {
                        title: "Thông tin cơ bản", fields: [
                            F("ma_truong", "Mã trường (KEY logic)", "text", { req: 1, mono: 1, ph: "NV_TOHOP", help: "Mã định danh logic duy nhất, viết HOA_GACH_DUOI. Dùng làm KEY khi lưu EAV và tham chiếu cascade. Không đổi sau khi đã dùng." }),
                            F("ten_truong", "Tên hiển thị", "text", { req: 1, ph: "Tổ hợp môn", help: "Nhãn mặc định trên form; mẫu có thể đổi nhãn riêng." }),
                            F("nhom", "Lĩnh vực", "select", { opts: O.linhvuc, help: "Chủ đề để gom/tìm trong thư viện. KHÔNG phải module, không quyết định nơi lưu." }),
                            F("pham_vi", "Phạm vi dùng", "select", { req: 1, opts: O.phamvi, help: "Dùng chung mọi module, hoặc Theo module (phải khai ở form Phân loại)." })
                        ]
                    },
                    {
                        title: "Kiểu & hiển thị", fields: [
                            F("kieudl", "Kiểu dữ liệu", "select", { req: 1, opts: O.kieudl, help: "Kiểu logic; quyết định cột EAV lưu giá trị." }),
                            F("control", "Loại control", "select", { req: 1, opts: O.control, help: "Widget hiển thị. SELECT/RADIO/MULTISELECT cần nguồn giá trị." }),
                            F("chonnhieu", "Cho chọn nhiều", "switch", { help: "Bật nếu trường nhận nhiều giá trị (chọn nhiều)." }),
                            F("batbuoc", "Bắt buộc mặc định", "switch", { help: "Bắt buộc khi đặt vào mẫu; mẫu có thể override." })
                        ]
                    },
                    {
                        title: "Nguồn giá trị & ràng buộc", fields: [
                            F("nguon", "Nguồn giá trị", "select", { req: 1, opts: O.nguon, help: "NONE nhập tự do · STATIC option tĩnh · TABLE bảng danh mục · SQL truy vấn · CASCADE danh mục phân cấp." }),
                            F("dinhdang", "Định dạng / Mask", "text", { ph: "dd/MM/yyyy", help: "Mask hiển thị: ngày dd/MM/yyyy, số #,##0.00." }),
                            F("cauhinh", "Cấu hình nguồn (JSON)", "json", { full: 1, ph: '{"table":"dm_tohop","valueCol":"id","labelCol":"ten"}', help: "JSON trỏ NƠI lấy option (không chứa dữ liệu). Theo loại nguồn: TABLE/SQL/CASCADE." }),
                            F("regex", "Regex kiểm tra", "text", { full: 1, mono: 1, ph: "^[0-9]{12}$", help: "Biểu thức kiểm tra mặc định ở cấp thư viện (vd CCCD)." }),
                            F("ghichu", "Ghi chú", "textarea", { full: 1, help: "Mô tả nội bộ cho người quản trị." })
                        ]
                    }
                ],
                rows: [
                    { ma_truong: "HO_TEN", ten_truong: "Họ và tên", nhom: "Nhân thân", pham_vi: "Dùng chung", kieudl: "TEXT", control: "TEXTBOX", nguon: "NONE", batbuoc: 1, chonnhieu: 0 },
                    { ma_truong: "NGAY_SINH", ten_truong: "Ngày sinh", nhom: "Nhân thân", pham_vi: "Dùng chung", kieudl: "DATE", control: "DATEPICKER", nguon: "NONE", dinhdang: "dd/MM/yyyy", batbuoc: 1, chonnhieu: 0 },
                    { ma_truong: "CCCD", ten_truong: "Số CCCD", nhom: "Nhân thân", pham_vi: "Dùng chung", kieudl: "TEXT", control: "TEXTBOX", nguon: "NONE", regex: "^[0-9]{12}$", batbuoc: 1, chonnhieu: 0 },
                    { ma_truong: "NV_TOHOP", ten_truong: "Tổ hợp môn", nhom: "Nguyện vọng", pham_vi: "Theo module", kieudl: "TEXT", control: "MULTISELECT", nguon: "TABLE", cauhinh: '{"table":"dm_tohop","valueCol":"id","labelCol":"ten"}', batbuoc: 0, chonnhieu: 1 },
                    { ma_truong: "LUONG_COBAN", ten_truong: "Lương cơ bản", nhom: "Tài chính / Lương", pham_vi: "Theo module", kieudl: "DECIMAL", control: "NUMBER", nguon: "NONE", batbuoc: 0, chonnhieu: 0 }
                ]
            },
            {
                id: "phanloai", pkg: "TruongModule", special: "phanloai", nav: "2", title: "Phân loại Trường – Module",
                subtitle: "Gắn trường 'Theo module' vào các module được phép dùng. Trường 'Dùng chung' áp dụng mọi module — không cần gắn.",
                newTitle: "Gán trường vào module", unit: "phân loại",
                columns: [
                    { key: "ma_truong", label: "Mã trường", render: function (r) { return '<span class="kbtt-mono">' + (r.ma_truong || '') + '</span>'; } },
                    { key: "pham_vi", label: "Phạm vi", badge: 1 },
                    {
                        key: "modules", label: "Module áp dụng", render: function (r) {
                            if (r.pham_vi === "Dùng chung") return '<span class="kbtt-badge kbtt-b-teal">Tất cả module</span>';
                            var a = (r.modules || []);
                            return a.length
                                ? '<div class="kbtt-tags">' + a.map(function (m) { return '<span class="kbtt-badge kbtt-b-brand">' + m + '</span>'; }).join('') + '</div>'
                                : '<span class="kbtt-dash">— chưa gán —</span>';
                        }
                    }
                ],
                groups: [{
                    title: "Phân loại", fields: [
                        F("ma_truong", "Trường", "text", { req: 1, mono: 1, ph: "NV_TOHOP", help: "Mã trường đã khai ở form Định nghĩa Trường." }),
                        F("pham_vi", "Phạm vi", "select", { req: 1, opts: O.phamvi, help: "Chỉ trường 'Theo module' mới cần chọn module bên dưới." }),
                        F("modules", "Module áp dụng", "modules", { full: 1, opts: O.modules, help: "Chọn các module được dùng trường. Bỏ qua nếu phạm vi là 'Dùng chung'." })
                    ]
                }],
                rows: [
                    { ma_truong: "HO_TEN", pham_vi: "Dùng chung", modules: [] },
                    { ma_truong: "NV_TOHOP", pham_vi: "Theo module", modules: ["TUYENSINH"] },
                    { ma_truong: "LUONG_COBAN", pham_vi: "Theo module", modules: ["NHANSU"] },
                    { ma_truong: "HE_SO_PHUCAP", pham_vi: "Theo module", modules: ["NHANSU", "DAOTAO"] }
                ]
            },
            {
                id: "danhmuc", nav: "3", title: "Định nghĩa Danh mục",
                subtitle: "Khai loại danh mục và cây danh mục phân cấp (dm_loai_danhmuc + dm_danhmuc) — phục vụ nguồn CASCADE / TABLE.",
                subviews: [
                    {
                        key: "loai", pkg: "LoaiDanhMuc", label: "Loại danh mục", newTitle: "Khai loại danh mục", unit: "loại",
                        columns: [
                            { key: "ma_loai", label: "Mã loại", render: function (r) { return '<span class="kbtt-mono">' + (r.ma_loai || '') + '</span>'; } },
                            { key: "ten_loai", label: "Tên loại" },
                            { key: "so_cap", label: "Số cấp", render: function (r) { return '<span class="kbtt-badge kbtt-b-brand">' + r.so_cap + ' cấp</span>'; } },
                            { key: "ten_cac_cap", label: "Tên các cấp" }
                        ],
                        groups: [{
                            title: "Loại danh mục", fields: [
                                F("ma_loai", "Mã loại", "text", { req: 1, mono: 1, ph: "DIABAN", help: "Mã loại duy nhất (DIABAN, NGANH, DONVI...). Trường CASCADE trỏ tới mã này." }),
                                F("ten_loai", "Tên loại", "text", { req: 1, ph: "Địa bàn hành chính", help: "Tên hiển thị của loại danh mục." }),
                                F("so_cap", "Số cấp", "number", { req: 1, ph: "3", help: "Số cấp phân cấp của cây (vd 3 = Tỉnh/Quận/Phường)." }),
                                F("ten_cac_cap", "Tên các cấp (JSON)", "json", { full: 1, ph: '["Tỉnh/Thành","Quận/Huyện","Phường/Xã"]', help: "Nhãn từng cấp." })
                            ]
                        }],
                        rows: [
                            { ma_loai: "DIABAN", ten_loai: "Địa bàn hành chính", so_cap: 3, ten_cac_cap: '["Tỉnh/Thành","Quận/Huyện","Phường/Xã"]' },
                            { ma_loai: "NGANH", ten_loai: "Ngành đào tạo", so_cap: 2, ten_cac_cap: '["Khối ngành","Ngành"]' }
                        ]
                    },
                    {
                        key: "cay", pkg: "DanhMuc", label: "Cây danh mục", newTitle: "Khai nút danh mục", unit: "nút",
                        columns: [
                            { key: "ma", label: "Mã", render: function (r) { return '<span class="kbtt-mono">' + (new Array((r.cap || 1)).join('&nbsp;&nbsp;&nbsp;')) + (r.ma || '') + '</span>'; } },
                            { key: "ten", label: "Tên" },
                            { key: "loai", label: "Loại" },
                            { key: "cap", label: "Cấp", render: function (r) { return '<span class="kbtt-badge kbtt-b-amber">Cấp ' + r.cap + '</span>'; } },
                            { key: "parent", label: "Cha", render: function (r) { return r.parent ? '<span class="kbtt-mono">' + r.parent + '</span>' : '<span class="kbtt-dash">(gốc)</span>'; } }
                        ],
                        groups: [{
                            title: "Nút danh mục", fields: [
                                F("ma", "Mã (ma)", "text", { req: 1, mono: 1, ph: "HN_CG", help: "Mã nút, duy nhất trong loại." }),
                                F("ten", "Tên (ten)", "text", { req: 1, ph: "Cầu Giấy", help: "Tên hiển thị của nút." }),
                                F("loai", "Thuộc loại", "select", { req: 1, opts: ["DIABAN", "NGANH", "DONVI"], help: "Loại danh mục mà nút này thuộc về." }),
                                F("cap", "Cấp", "number", { req: 1, ph: "2", help: "Số cấp của nút (1 = gốc)." }),
                                F("parent", "Mã cha (parent)", "text", { mono: 1, ph: "HN", help: "Mã nút cha (adjacency list). Để trống nếu là cấp 1." })
                            ]
                        }],
                        rows: [
                            { ma: "HN", ten: "Hà Nội", loai: "DIABAN", cap: 1, parent: "" },
                            { ma: "HN_CG", ten: "Cầu Giấy", loai: "DIABAN", cap: 2, parent: "HN" },
                            { ma: "HN_CG_DV", ten: "Dịch Vọng", loai: "DIABAN", cap: 3, parent: "HN_CG" }
                        ]
                    }
                ]
            },
            {
                id: "mau", pkg: "Mau", nav: "4", title: "Định nghĩa Mẫu khai",
                subtitle: "Khai đầu mẫu form (tbl_form_mau). Thay đổi mẫu = tạo mẫu mới; mẫu cũ chuyển ARCHIVED, hồ sơ cũ vẫn render đúng.",
                newTitle: "Khai mẫu mới", unit: "mẫu",
                columns: [
                    { key: "ma_mau", label: "Mã mẫu", render: function (r) { return '<div class="kbtt-cellname"><span class="kbtt-mono">' + (r.ma_mau || '') + '</span><div class="sub">' + (r.ten_mau || '') + '</div></div>'; } },
                    { key: "owner", label: "Thực thể" },
                    { key: "module", label: "Module", render: function (r) { return '<span class="kbtt-badge kbtt-b-brand">' + (r.module || '—') + '</span>'; } },
                    { key: "trangthai", label: "Trạng thái", badge: 1 },
                    { key: "hieuluc", label: "Hiệu lực", render: function (r) { return '<span class="sub" style="color:#0f1729">' + (r.hieuluc_tu || '—') + ' → ' + (r.hieuluc_den || '—') + '</span>'; } }
                ],
                groups: [
                    {
                        title: "Thông tin mẫu", fields: [
                            F("ma_mau", "Mã mẫu", "text", { req: 1, mono: 1, ph: "NHAPHOC_2027", help: "Mã mẫu duy nhất; mỗi lần đổi mẫu là một mã mới." }),
                            F("ten_mau", "Tên mẫu", "text", { req: 1, ph: "Hồ sơ nhập học 2027", help: "Tên hiển thị của mẫu." }),
                            F("owner", "Loại thực thể", "select", { opts: O.owner, help: "Mẫu phục vụ thực thể nào. Person-centric thường để PERSON." }),
                            F("module", "Module", "select", { opts: O.modules, help: "Mảng nghiệp vụ mẫu thuộc về." }),
                            F("mota", "Mô tả", "textarea", { full: 1, help: "Mô tả ngắn về mẫu." })
                        ]
                    },
                    {
                        title: "Vòng đời & quy trình", fields: [
                            F("trangthai", "Trạng thái", "select", { req: 1, opts: O.ttmau, help: "DRAFT · PUBLISHED · ARCHIVED." }),
                            F("wf", "Quy trình duyệt", "text", { mono: 1, ph: "WF_XETHOSO", help: "Mã quy trình duyệt; để trống nếu không cần duyệt." }),
                            F("socot", "Số cột lưới", "number", { ph: "12", help: "Số cột lưới gốc làm khung layout." }),
                            F("kichhoat", "Kích hoạt", "switch", { help: "Bật = đang dùng; tắt = ẩn mềm." }),
                            F("hieuluc_tu", "Hiệu lực từ", "text", { ph: "2027-01-01", help: "Ngày bắt đầu hiệu lực (ISO)." }),
                            F("hieuluc_den", "Hiệu lực đến", "text", { ph: "2027-08-31", help: "Ngày kết thúc hiệu lực (ISO)." })
                        ]
                    }
                ],
                rows: [
                    { ma_mau: "NHAPHOC_2027", ten_mau: "Hồ sơ nhập học 2027", owner: "PERSON", module: "TUYENSINH", trangthai: "PUBLISHED", wf: "WF_XETHOSO", socot: 12, kichhoat: 1, hieuluc_tu: "2027-01-01", hieuluc_den: "2027-08-31", mota: "Khai hồ sơ nhập học đợt 2027" },
                    { ma_mau: "NHAPHOC_2026", ten_mau: "Hồ sơ nhập học 2026", owner: "PERSON", module: "TUYENSINH", trangthai: "ARCHIVED", socot: 12, kichhoat: 0, hieuluc_tu: "2026-01-01", hieuluc_den: "2026-08-31" },
                    { ma_mau: "LYLICH_CB", ten_mau: "Lý lịch cán bộ", owner: "PERSON", module: "NHANSU", trangthai: "DRAFT", socot: 12, kichhoat: 1 }
                ]
            },
            {
                id: "cauhinh", nav: "5", title: "Cấu hình Trường trong Mẫu",
                subtitle: "Chọn mẫu gồm những nhóm/section và trường nào, bố cục và override (tbl_form_lay_nhom + tbl_form_lay_truong).",
                context: "Mẫu: NHAPHOC_2027",
                subviews: [
                    {
                        key: "nhom", pkg: "LayNhom", label: "Nhóm / Section", newTitle: "Khai nhóm/section", unit: "nhóm",
                        columns: [
                            { key: "ten", label: "Tên nhóm", render: function (r) { return '<div class="kbtt-cellname"><b>' + (r.ten || '') + '</b><div class="sub kbtt-mono">' + (r.ma || '') + '</div></div>'; } },
                            { key: "buoc", label: "Bước", render: function (r) { return '<span class="kbtt-badge kbtt-b-gray">Bước ' + r.buoc + '</span>'; } },
                            { key: "socot", label: "Số cột" },
                            { key: "laplai", label: "Lặp lại", render: function (r) { return r.laplai ? '<span class="kbtt-badge kbtt-b-teal">Lặp ' + (r.min || 1) + '–' + (r.max || '') + '</span>' : '<span class="kbtt-dash">—</span>'; } },
                            { key: "nguon", label: "Nguồn lưu", render: function (r) { return r.nguon ? '<span class="kbtt-mono">' + r.nguon + '</span>' : '<span class="kbtt-dash">EAV</span>'; } }
                        ],
                        groups: [{
                            title: "Nhóm / section", fields: [
                                F("ma", "Mã nhóm", "text", { req: 1, mono: 1, ph: "G_NV", help: "Mã section trong mẫu." }),
                                F("ten", "Tên nhóm", "text", { req: 1, ph: "Nguyện vọng", help: "Tiêu đề section hiển thị." }),
                                F("buoc", "Bước (wizard)", "number", { ph: "1", help: "Trang/bước trong wizard; cùng bước = cùng trang." }),
                                F("socot", "Số cột", "number", { ph: "12", help: "Số cột lưới riêng của nhóm." }),
                                F("nhomcha", "Nhóm cha", "text", { mono: 1, help: "Mã nhóm cha nếu lồng nhau; để trống nếu cấp 1." }),
                                F("laplai", "Nhóm lặp lại", "switch", { help: "Bật nếu là danh sách nhiều dòng (bảng con)." }),
                                F("min", "Số dòng tối thiểu", "number", { help: "Áp dụng khi nhóm lặp." }),
                                F("max", "Số dòng tối đa", "number", { help: "Áp dụng khi nhóm lặp." }),
                                F("nguon", "Nguồn (nếu lặp)", "text", { full: 1, mono: 1, ph: "NGUYENVONG", help: "Mã nguồn BANG_N để đổ dữ liệu nhóm lặp; để trống = EAV." })
                            ]
                        }],
                        rows: [
                            { ma: "G_CANHAN", ten: "Thông tin cá nhân", buoc: 1, socot: 12, laplai: 0, nguon: "" },
                            { ma: "G_DIACHI", ten: "Địa chỉ thường trú", buoc: 1, socot: 12, laplai: 0, nguon: "" },
                            { ma: "G_NV", ten: "Nguyện vọng", buoc: 2, socot: 12, laplai: 1, min: 1, max: 10, nguon: "NGUYENVONG" }
                        ]
                    },
                    {
                        key: "truong", pkg: "LayTruong", label: "Trường trong mẫu", newTitle: "Đặt trường vào mẫu", unit: "trường",
                        columns: [
                            { key: "truong", label: "Trường", render: function (r) { return '<div class="kbtt-cellname"><span class="kbtt-mono">' + (r.truong || '') + '</span><div class="sub">' + (r.nhan || '') + '</div></div>'; } },
                            { key: "nhom", label: "Nhóm", render: function (r) { return '<span class="kbtt-mono">' + (r.nhom || '') + '</span>'; } },
                            { key: "socot", label: "Cột chiếm" },
                            { key: "batbuoc", label: "Bắt buộc", render: function (r) { return r.batbuoc ? '<span class="kbtt-badge kbtt-b-rose kbtt-dot">Bắt buộc</span>' : '<span class="kbtt-dash">—</span>'; } },
                            { key: "luu", label: "Nơi lưu", render: function (r) { return r.nguon ? '<span class="kbtt-mono">' + r.nguon + '.' + (r.cotdich || '') + '</span>' : '<span class="kbtt-badge kbtt-b-amber">EAV</span>'; } }
                        ],
                        groups: [
                            {
                                title: "Đặt trường & bố cục", fields: [
                                    F("nhom", "Nhóm", "text", { req: 1, mono: 1, ph: "G_CANHAN", help: "Mã nhóm chứa trường." }),
                                    F("truong", "Trường (ma_truong)", "text", { req: 1, mono: 1, ph: "HO_TEN", help: "Mã trường từ thư viện." }),
                                    F("thutu", "Thứ tự", "number", { ph: "1", help: "Thứ tự trong nhóm." }),
                                    F("socot", "Số cột chiếm", "number", { ph: "6", help: "Colspan trên lưới (1–12)." }),
                                    F("nhan", "Nhãn override", "text", { help: "Đổi nhãn so với thư viện; trống = kế thừa." }),
                                    F("control", "Control override", "select", { opts: ["(kế thừa)"].concat(O.control), help: "Đổi control; '(kế thừa)' = theo thư viện." }),
                                    F("batbuoc", "Bắt buộc", "switch", { help: "Override bắt buộc; tắt = theo thư viện." }),
                                    F("chidoc", "Chỉ đọc", "switch", { help: "Hiển thị nhưng không cho sửa." })
                                ]
                            },
                            {
                                title: "Định tuyến nơi lưu (mapping)", fields: [
                                    F("nguon", "Nguồn lưu", "text", { mono: 1, ph: "PERSON", help: "Mã nguồn (ở form Mapping). Trống = ghi vào EAV." }),
                                    F("cotdich", "Cột đích", "text", { mono: 1, ph: "ho_ten", help: "Cột trong bảng thật của nguồn." }),
                                    F("dieukien", "Điều kiện hiện (JSON)", "json", { full: 1, ph: '{"truong":"CO_UU_TIEN","op":"=","giaTri":"1"}', help: "Ẩn/hiện theo giá trị trường khác." })
                                ]
                            }
                        ],
                        rows: [
                            { nhom: "G_CANHAN", truong: "HO_TEN", thutu: 1, socot: 6, batbuoc: 1, nguon: "PERSON", cotdich: "ho_ten", nhan: "Họ tên thí sinh" },
                            { nhom: "G_CANHAN", truong: "NGAY_SINH", thutu: 2, socot: 3, batbuoc: 1, nguon: "PERSON", cotdich: "ngay_sinh" },
                            { nhom: "G_CANHAN", truong: "CCCD", thutu: 3, socot: 3, batbuoc: 1, nguon: "PERSON", cotdich: "cccd" },
                            { nhom: "G_NV", truong: "NV_NGANH", thutu: 1, socot: 8, batbuoc: 1, nguon: "NGUYENVONG", cotdich: "nganh_id" },
                            { nhom: "G_NV", truong: "NV_TOHOP", thutu: 2, socot: 4, batbuoc: 0, nguon: "", cotdich: "" }
                        ]
                    }
                ]
            },
            {
                id: "apdung", pkg: "MauApDung", nav: "6", title: "Áp dụng cho Đợt",
                subtitle: "Xác định mẫu áp dụng cho kế hoạch/đợt nào (tbl_form_mau_apdung). Nhiều dòng cùng mẫu = AND.",
                newTitle: "Khai phạm vi áp dụng", unit: "điều kiện",
                columns: [
                    { key: "ma_mau", label: "Mã mẫu", render: function (r) { return '<span class="kbtt-mono">' + (r.ma_mau || '') + '</span>'; } },
                    { key: "context", label: "Giá trị ngữ cảnh (id)", render: function (r) { return '<span class="kbtt-badge kbtt-b-brand">' + (r.context || '') + '</span>'; } },
                    { key: "kichhoat", label: "Kích hoạt", render: function (r) { return r.kichhoat ? '<span class="kbtt-badge kbtt-b-green kbtt-dot">Đang áp dụng</span>' : '<span class="kbtt-badge kbtt-b-gray">Tắt</span>'; } },
                    { key: "ghichu", label: "Ghi chú", render: function (r) { return '<span class="sub" style="color:#0f1729">' + (r.ghichu || '') + '</span>'; } }
                ],
                note: "Mẫu khớp khi MỌI giá trị ngữ cảnh của nó đều nằm trong tập ngữ cảnh chạy thực tế. Mẫu không có dòng nào = áp dụng mọi ngữ cảnh. Giá trị phải là id duy nhất (KH2027, DOT2027_01), không dùng số trần.",
                groups: [{
                    title: "Phạm vi áp dụng", fields: [
                        F("ma_mau", "Mã mẫu", "text", { req: 1, mono: 1, ph: "NHAPHOC_2027", help: "Mẫu cần gắn phạm vi." }),
                        F("context", "Giá trị ngữ cảnh (id)", "text", { req: 1, mono: 1, ph: "DOT2027_01", help: "id duy nhất của kế hoạch/đợt/phương thức mà mẫu áp dụng." }),
                        F("kichhoat", "Kích hoạt", "switch", { help: "Bật = điều kiện đang áp dụng." }),
                        F("ghichu", "Ghi chú", "textarea", { full: 1, help: "Diễn giải điều kiện này." })
                    ]
                }],
                rows: [
                    { ma_mau: "NHAPHOC_2027", context: "KH2027", kichhoat: 1, ghichu: "Áp dụng cho kế hoạch tuyển sinh 2027" },
                    { ma_mau: "NHAPHOC_2027", context: "DOT2027_01", kichhoat: 1, ghichu: "... VÀ riêng đợt 1 (AND)" },
                    { ma_mau: "NHAPHOC_BOSUNG", context: "DOT2027_BS", kichhoat: 1, ghichu: "Mẫu bổ sung chỉ cho đợt bổ sung" }
                ]
            },
            {
                id: "mapping", pkg: "MapNguon", nav: "7", title: "Cấu hình Mapping",
                subtitle: "Khai mỗi nguồn lưu của mẫu: ghi về bảng nào, cột nào (tbl_form_map_nguon).",
                context: "Mẫu: NHAPHOC_2027",
                newTitle: "Khai nguồn lưu", unit: "nguồn",
                columns: [
                    { key: "ma_nguon", label: "Mã nguồn", render: function (r) { return '<span class="kbtt-mono">' + (r.ma_nguon || '') + '</span>'; } },
                    { key: "kct", label: "Kiểu cấu trúc", badge: 1 },
                    { key: "bang", label: "Bảng đích", render: function (r) { return '<span class="kbtt-mono">' + (r.bang || '') + '</span>'; } },
                    {
                        key: "lienket", label: "Liên kết", render: function (r) {
                            return '<span class="kbtt-mono">' + (r.cot_lienket || '') + '</span> '
                                + '<span class="kbtt-badge ' + KhaiBaoThongTin.prototype.badgeClass(r.lienket) + '">' + (r.lienket || '') + '</span>';
                        }
                    },
                    { key: "cachghi", label: "Cách ghi", badge: 1 },
                    { key: "thutughi", label: "T.tự", render: function (r) { return '<span class="kbtt-badge kbtt-b-gray">#' + r.thutughi + '</span>'; } }
                ],
                groups: [
                    {
                        title: "Nguồn lưu", fields: [
                            F("ma_nguon", "Mã nguồn", "text", { req: 1, mono: 1, ph: "PERSON", help: "Mã nguồn trong mẫu; trường/nhóm trỏ tới mã này." }),
                            F("kct", "Kiểu cấu trúc", "select", { req: 1, opts: O.kct, help: "BANG_1 ngang 1 dòng · BANG_N ngang nhiều dòng · KEYVALUE bảng dọc (EAV)." }),
                            F("bang", "Bảng đích", "text", { req: 1, mono: 1, ph: "CORE_PERSON", help: "Tên bảng nghiệp vụ (kể cả bảng EAV)." }),
                            F("cot_khoa", "Cột khóa", "text", { mono: 1, ph: "id", help: "Khóa chính của bảng đích." })
                        ]
                    },
                    {
                        title: "Liên kết & cách ghi", fields: [
                            F("cot_lienket", "Cột liên kết", "text", { req: 1, mono: 1, ph: "person_id", help: "Cột FK gắn dòng về đối tượng/hồ sơ." }),
                            F("lienket", "Liên kết với", "select", { req: 1, opts: O.lienket, help: "OWNER theo người · INSTANCE theo hồ sơ · PARENT theo dòng cha." }),
                            F("cot_thuoctinh", "Cột thuộc tính (KEYVALUE)", "text", { mono: 1, ph: "ma_truong", help: "Chỉ với KEYVALUE: cột chứa tên thuộc tính." }),
                            F("cot_dinhdanh", "Cột định danh", "text", { mono: 1, ph: "cccd", help: "Cột dò trùng khi UPSERT, tránh tạo trùng." }),
                            F("cachghi", "Cách ghi", "select", { req: 1, opts: O.cachghi, help: "INSERT/UPDATE/UPSERT." }),
                            F("thutughi", "Thứ tự ghi", "number", { ph: "1", help: "Thứ tự fan-out: bảng người trước, con sau, EAV cuối." })
                        ]
                    }
                ],
                rows: [
                    { ma_nguon: "PERSON", kct: "BANG_1", bang: "CORE_PERSON", cot_khoa: "id", cot_lienket: "id", lienket: "OWNER", cot_dinhdanh: "cccd", cachghi: "UPSERT", thutughi: 1 },
                    { ma_nguon: "DIACHI", kct: "BANG_N", bang: "CORE_DIACHI", cot_khoa: "id", cot_lienket: "person_id", lienket: "OWNER", cachghi: "UPSERT", thutughi: 2 },
                    { ma_nguon: "NGUYENVONG", kct: "BANG_N", bang: "TS_NGUYENVONG", cot_khoa: "id", cot_lienket: "hoso_id", lienket: "INSTANCE", cachghi: "UPSERT", thutughi: 3 },
                    { ma_nguon: "EAV", kct: "KEYVALUE", bang: "tbl_form_instance_giatri", cot_khoa: "id", cot_lienket: "instance_Id", cot_thuoctinh: "ma_truong", lienket: "INSTANCE", cachghi: "INSERT", thutughi: 9 }
                ]
            }
        ];
    },

    /*------------------------------------------
    -- Helpers
    -------------------------------------------*/
    badgeClass: function (v) {
        var m = {
            'Dùng chung': 'kbtt-b-teal', 'Theo module': 'kbtt-b-brand',
            'PUBLISHED': 'kbtt-b-green', 'DRAFT': 'kbtt-b-amber', 'ARCHIVED': 'kbtt-b-gray',
            'TEXT': 'kbtt-b-brand', 'NUMBER': 'kbtt-b-teal', 'DECIMAL': 'kbtt-b-teal',
            'DATE': 'kbtt-b-amber', 'DATETIME': 'kbtt-b-amber', 'BOOLEAN': 'kbtt-b-gray', 'FILE': 'kbtt-b-rose',
            'BANG_1': 'kbtt-b-brand', 'BANG_N': 'kbtt-b-teal', 'KEYVALUE': 'kbtt-b-amber',
            'UPSERT': 'kbtt-b-green', 'INSERT': 'kbtt-b-brand', 'UPDATE': 'kbtt-b-amber',
            'OWNER': 'kbtt-b-brand', 'INSTANCE': 'kbtt-b-teal', 'PARENT': 'kbtt-b-amber'
        };
        return m[v] || 'kbtt-b-gray';
    },

    findModule: function (id) {
        var sc = this.getSCHEMA();
        for (var i = 0; i < sc.length; i++) if (sc[i].id === id) return sc[i];
        return null;
    },
    activeView: function () {
        var m = this.findModule(this.strActive_Id);
        if (m.subviews) {
            var key = this.objSubview[m.id];
            var sv = null;
            for (var i = 0; i < m.subviews.length; i++) if (m.subviews[i].key === key) { sv = m.subviews[i]; break; }
            return { m: m, view: sv, dsk: m.id + ':' + sv.key };
        }
        return { m: m, view: m, dsk: m.id };
    },

    /*------------------------------------------
    -- Init
    -------------------------------------------*/
    init: function () {
        var me = this;
        if (typeof edu !== 'undefined' && edu.system && edu.system.page_load) {
            edu.system.page_load();
        }

        // build DB từ SCHEMA
        var SCHEMA = me.getSCHEMA();
        SCHEMA.forEach(function (m) {
            if (m.subviews) {
                me.objSubview[m.id] = m.subviews[0].key;
                m.subviews.forEach(function (sv) {
                    me.objDB[m.id + ':' + sv.key] = sv.rows.map(function (r, i) {
                        return $.extend({ _id: m.id + sv.key + i }, r);
                    });
                });
            } else {
                me.objDB[m.id] = m.rows.map(function (r, i) {
                    return $.extend({ _id: m.id + i }, r);
                });
            }
        });

        me.strActive_Id = SCHEMA[0].id;
        me.genTabs();
        me.render();

        /*------------------------------------------
        -- Bind action
        -------------------------------------------*/
        $('#btnSearchKhaiBao').click(function () { me.applySearch(); });
        $('#txtSearchKhaiBao_TuKhoa').on('keypress', function (e) {
            if (e.which === 13) { e.preventDefault(); me.applySearch(); }
        });

        // Tab module
        $('#ulKhaiBao_Tabs').on('click', '.nav-link', function () {
            me.strActive_Id = $(this).data('id');
            me.render();
        });

        // Subview pill
        $('#divKhaiBao_Subview').on('click', 'button', function () {
            me.objSubview[me.strActive_Id] = $(this).data('sv');
            me.render();
        });

        // Thêm mới: button có data-bs-toggle, click handler chỉ chuẩn bị form
        // (Bootstrap tự mở modal — pattern y hệt $("#btnAddKeHoach").click)
        $('#btnAddKhaiBao').click(function () {
            me.strCurMode = 'create';
            me.strCurId = null;
            me.renderForm('create', null);
        });

        // Chi tiết (= xem-sửa): nút "Chi tiết" trên mỗi dòng
        // Dùng delegate vì rows là dynamic.
        $('#tblKhaiBao').delegate('.btnDetailKhaiBao', 'click', function () {
            var strId = $(this).attr('data-id');
            if (!strId) return;
            me.strCurMode = 'edit';
            me.strCurId = strId;
            me.renderForm('edit', strId);
        });

        // Xóa nhanh trên dòng (không mở modal Chi tiết)
        $('#tblKhaiBao').delegate('.btnDeleteKhaiBao', 'click', function () {
            me.strCurId = $(this).attr('data-id');
            me.askDelete();
        });

        // Khi modal đóng → reset mode
        $('#chi-tiet-khaibao').on('hidden.bs.modal', function () {
            me.strCurMode = null;
            me.strCurId = null;
        });

        // Lưu
        $('#btnSave_KhaiBao').click(function () { me.save(); });

        // Chuyển sang sửa (từ chế độ xem)
        $('#btnEditMode_KhaiBao').click(function () {
            if (me.strCurId) me.renderForm('edit', me.strCurId);
        });

        // Xóa (từ trong modal chi tiết)
        $('#btnDelete_KhaiBao').click(function () { me.askDelete(); });

        // ESC để đóng modal: Bootstrap đã có sẵn, không cần handler riêng.
    },

    applySearch: function () {
        var me = this, dsk = me.activeView().dsk;
        me.objSearch[dsk] = $('#txtSearchKhaiBao_TuKhoa').val() || '';
        me.render();
    },

    /*------------------------------------------
    -- Render: tabs + subview + bảng
    -------------------------------------------*/
    genTabs: function () {
        var html = '', SCHEMA = this.getSCHEMA();
        SCHEMA.forEach(function (m) {
            html += '<li><button type="button" class="nav-link" data-id="' + m.id + '"><span class="ix">' + m.nav + '</span>' + m.title + '</button></li>';
        });
        $('#ulKhaiBao_Tabs').html(html);
    },

    render: function () {
        var me = this, av = me.activeView(), m = av.m, view = av.view, dsk = av.dsk;

        // Tabs active
        $('#ulKhaiBao_Tabs .nav-link').each(function () {
            $(this).toggleClass('active', $(this).data('id') === m.id);
        });

        // Subview
        if (m.subviews) {
            var svHtml = '';
            m.subviews.forEach(function (sv) {
                svHtml += '<button type="button" data-sv="' + sv.key + '" class="' + (sv.key === me.objSubview[m.id] ? 'on' : '') + '">' + sv.label + '</button>';
            });
            $('#divKhaiBao_Subview').html(svHtml);
            $('#divKhaiBao_SubviewWrap').show();
        } else {
            $('#divKhaiBao_SubviewWrap').hide();
        }

        // Context banner
        if (m.context) {
            $('#lblKhaiBao_Context').text(m.context);
            $('#divKhaiBao_ContextWrap').show();
        } else {
            $('#divKhaiBao_ContextWrap').hide();
        }

        // Note
        if (m.note) {
            $('#lblKhaiBao_Note').text(m.note);
            $('#divKhaiBao_Note').show();
        } else {
            $('#divKhaiBao_Note').hide();
        }

        // Title + placeholder
        $('#lblKhaiBao_Title').text(m.title);
        $('#lblKhaiBao_BtnAdd').text(view.newTitle || 'Thêm mới');
        $('#txtSearchKhaiBao_TuKhoa').val(me.objSearch[dsk] || '').attr('placeholder', 'Tìm ' + view.unit + '…');

        // Build header + rows
        me.genTable(view, dsk);
    },

    genTable: function (view, dsk) {
        var me = this;
        var rows = me.getRows(dsk);

        // Header
        var thHtml = '<th class="td-center w-50px">Stt</th>';
        view.columns.forEach(function (c) {
            thHtml += '<th class="td-left">' + c.label + '</th>';
        });
        thHtml += '<th class="td-center" style="width:180px;">Thao tác</th>';
        $('#trKhaiBao_Header').html(thHtml);

        // Body
        var tbody = '';
        if (!rows.length) {
            tbody = '<tr><td colspan="' + (view.columns.length + 2) + '" class="td-center" style="padding:36px;color:#65718c">'
                + '<i class="fa-regular fa-inbox" style="font-size:32px;display:block;margin-bottom:8px;color:#cfd6e6"></i>'
                + 'Chưa có ' + view.unit + ' nào. Bấm <b>Thêm mới</b> để khai bản ghi đầu tiên.'
                + '</td></tr>';
        } else {
            rows.forEach(function (r, i) {
                tbody += '<tr>';
                tbody += '<td class="td-center">' + (i + 1) + '</td>';
                view.columns.forEach(function (c) {
                    var cell;
                    if (c.render) cell = c.render(r);
                    else if (c.badge) {
                        var v = r[c.key];
                        cell = (v != null && v !== '')
                            ? '<span class="kbtt-badge ' + me.badgeClass(v) + '">' + v + '</span>'
                            : '<span class="kbtt-dash">—</span>';
                    } else {
                        var vv = r[c.key];
                        cell = (vv != null && vv !== '') ? vv : '<span class="kbtt-dash">—</span>';
                    }
                    tbody += '<td class="td-left">' + cell + '</td>';
                });
                tbody += '<td class="td-center">'
                    + '<div class="kbtt-rowact">'
                    + '  <a class="btn kbtt-btn-detail btnDetailKhaiBao" data-id="' + r._id + '" title="Xem - sửa bản ghi" data-toggle="modal" data-target="#chi-tiet-khaibao">'
                    + '    <i class="fa-regular fa-pen-to-square"></i><span>Chi tiết</span>'
                    + '  </a>'
                    + '  <a class="btn kbtt-btn-delete btnDeleteKhaiBao" data-id="' + r._id + '" title="Xóa bản ghi">'
                    + '    <i class="fa-regular fa-trash"></i><span>Xóa</span>'
                    + '  </a>'
                    + '</div>'
                    + '</td></tr>';
            });
        }
        $('#tblKhaiBao tbody').html(tbody);
        $('#lblKhaiBao_Tong').text(rows.length);
    },

    getRows: function (dsk) {
        var me = this;
        var rows = me.objDB[dsk] || [];
        var q = (me.objSearch[dsk] || '').toLowerCase().trim();
        if (!q) return rows;
        return rows.filter(function (r) {
            return JSON.stringify($.map(r, function (v) { return v; })).toLowerCase().indexOf(q) >= 0;
        });
    },

    /*------------------------------------------
    -- Form (Thêm mới / Sửa / Xem)
    -- Origin: PKG_CORE_GIAODIEN.<Pkg>_LayChiTiet / _Them / _Sua
    -- Mọi mode đều đi qua event show.bs.modal của #chi-tiet-khaibao
    -- (button có data-bs-toggle), nên không cần openForm() riêng.
    -------------------------------------------*/
    renderForm: function (mode, id) {
        var me = this, av = me.activeView(), view = av.view, m = av.m;
        var rec = id ? (me.objDB[av.dsk].filter(function (r) { return r._id === id; })[0] || {}) : {};
        var readonly = mode === 'view';

        // Title + icon
        var titleMap = { create: view.newTitle || 'Khai mới', edit: 'Sửa bản ghi · ' + m.title, view: 'Xem chi tiết · ' + m.title };
        var iconMap = { create: 'fa-regular fa-plus', edit: 'fa-regular fa-pen-to-square', view: 'fa-regular fa-eye' };
        $('#lblKhaiBao_ModalTitle').text(titleMap[mode]);
        $('#iconKhaiBao_Modal').attr('class', iconMap[mode]);

        // Note trong modal (chỉ với mode khác view)
        if (m.note && mode !== 'view') {
            $('#divKhaiBao_ModalNote').text(m.note).show();
        } else {
            $('#divKhaiBao_ModalNote').hide();
        }

        // Form body
        var html = '';
        view.groups.forEach(function (g) {
            html += '<div class="kbtt-section"><i class="fa-regular fa-circle-info"></i> ' + g.title + '</div>';
            html += '<div class="kbtt-group">';
            g.fields.forEach(function (f) {
                html += me.genFieldRow(f, rec[f.key], readonly);
            });
            html += '</div>';
        });
        $('#divKhaiBao_FormBody').html(html);

        // Bind switch toggle
        $('#divKhaiBao_FormBody .kbtt-tog').off('click').on('click', function () {
            if (readonly) return;
            $(this).toggleClass('on');
            $(this).attr('data-v', $(this).hasClass('on') ? 1 : 0);
            $(this).next('.kbtt-tog-lbl').text($(this).hasClass('on') ? 'Có' : 'Không');
        });
        // Bind pill toggle
        $('#divKhaiBao_FormBody .kbtt-pill').off('click').on('click', function () {
            if (readonly) return;
            $(this).toggleClass('on');
        });

        // Disable inputs khi view-mode
        if (readonly) {
            $('#divKhaiBao_FormBody').find('input,select,textarea').prop('disabled', true);
        }

        // Buttons
        $('#btnSave_KhaiBao').toggleClass('d-none', readonly);
        $('#btnEditMode_KhaiBao').toggleClass('d-none', mode !== 'view');
        $('#btnDelete_KhaiBao').toggleClass('d-none', mode !== 'edit');
    },

    /*------------------------------------------
    -- Field control: row "label - input" + help
    -- Theo style của các modal khác (aps-lable-name)
    -- f.full = true → field chiếm cả dòng, label phía trên
    -------------------------------------------*/
    genFieldRow: function (f, val, readonly) {
        var me = this;
        var v = val == null ? '' : val;
        var lbl = f.label + (f.req ? '<span class="kbtt-req">*</span>' : '');
        var ctrl = me.genFieldCtrl(f, v, readonly);
        var help = f.help ? '<span class="kbtt-help">' + f.help + '</span>' : '';
        var cls = 'kbtt-row' + (f.full ? ' full' : '');
        return ''
            + '<div class="' + cls + '">'
            + '<div class="kbtt-lbl">' + lbl + '</div>'
            + '<div class="kbtt-ctrl">' + ctrl + help + '</div>'
            + '</div>';
    },

    genFieldCtrl: function (f, v, readonly) {
        var attr = 'data-k="' + f.key + '"';
        var safe = (v == null) ? '' : String(v).replace(/"/g, '&quot;');

        if (f.type === 'textarea') {
            return '<textarea class="form-control min-h-86" ' + attr + ' placeholder="' + (f.ph || '') + '">' + safe + '</textarea>';
        }
        if (f.type === 'json') {
            return '<textarea class="form-control kbtt-mono min-h-86" ' + attr + ' placeholder="' + (f.ph || '') + '">' + safe + '</textarea>';
        }
        if (f.type === 'number') {
            return '<input type="number" class="form-control" ' + attr + ' value="' + safe + '" placeholder="' + (f.ph || '') + '">';
        }
        if (f.type === 'select') {
            var html = '<div class="custom-select"><i class="fa-light fa-chevron-down"></i>'
                + '<select class="form-select" ' + attr + '>'
                + '<option value="">— chọn —</option>';
            (f.opts || []).forEach(function (o) {
                html += '<option ' + (String(o) === String(v) ? 'selected' : '') + '>' + o + '</option>';
            });
            html += '</select></div>';
            return html;
        }
        if (f.type === 'switch') {
            var on = !!v;
            return '<div class="kbtt-switch">'
                + '<div class="kbtt-tog ' + (on ? 'on' : '') + '" ' + attr + ' data-v="' + (on ? 1 : 0) + '"></div>'
                + '<span class="kbtt-tog-lbl">' + (on ? 'Có' : 'Không') + '</span>'
                + '</div>';
        }
        if (f.type === 'modules') {
            var arr = Array.isArray(v) ? v : [];
            var html2 = '<div class="kbtt-pills" ' + attr + '>';
            (f.opts || []).forEach(function (o) {
                html2 += '<button type="button" class="kbtt-pill ' + (arr.indexOf(o) >= 0 ? 'on' : '') + '" data-v="' + o + '">' + o + '</button>';
            });
            html2 += '</div>';
            return html2;
        }
        // text (default)
        var cls = 'form-control' + (f.mono ? ' kbtt-mono' : '');
        return '<input class="' + cls + '" ' + attr + ' value="' + safe + '" placeholder="' + (f.ph || '') + '">';
    },

    /*------------------------------------------
    -- Save (in-memory)
    -- Origin: PKG_CORE_GIAODIEN.<Pkg>_Them / _Sua / TruongModule_Luu
    -------------------------------------------*/
    save: function () {
        var me = this, av = me.activeView(), dsk = av.dsk;
        var rec = {};
        $('#divKhaiBao_FormBody').find('[data-k]').each(function () {
            var $el = $(this), k = $el.data('k');
            if ($el.hasClass('kbtt-tog')) {
                rec[k] = +$el.attr('data-v');
            } else if ($el.hasClass('kbtt-pills')) {
                rec[k] = $el.find('.kbtt-pill.on').map(function () { return $(this).data('v'); }).get();
            } else {
                rec[k] = $el.val();
            }
        });

        if (me.strCurMode === 'create') {
            rec._id = 'n' + (me.intUid++);
            (me.objDB[dsk] = me.objDB[dsk] || []).unshift(rec);
            me.toastOk('Đã thêm bản ghi mới');
        } else {
            var arr = me.objDB[dsk] || [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]._id === me.strCurId) {
                    rec._id = me.strCurId;
                    me.objDB[dsk][i] = $.extend({}, arr[i], rec);
                    break;
                }
            }
            me.toastOk('Đã lưu thay đổi');
        }
        $('#chi-tiet-khaibao').modal('hide');
        me.render();
    },

    /*------------------------------------------
    -- Delete
    -- Origin: PKG_CORE_GIAODIEN.<Pkg>_Xoa
    -------------------------------------------*/
    askDelete: function () {
        var me = this;
        var doDel = function () { me.doDelete(); };
        if (typeof edu !== 'undefined' && edu.system && edu.system.confirm) {
            edu.system.confirm('Bạn có chắc chắn xóa bản ghi này không?');
            $('#btnYes').off('click').on('click', doDel);
        } else if (window.confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
            doDel();
        }
    },
    doDelete: function () {
        var me = this, av = me.activeView(), dsk = av.dsk;
        me.objDB[dsk] = (me.objDB[dsk] || []).filter(function (r) { return r._id !== me.strCurId; });
        $('#chi-tiet-khaibao').modal('hide');
        me.strCurId = null;
        me.render();
        me.toastDel('Đã xóa bản ghi');
    },

    /*------------------------------------------
    -- Toast: ưu tiên edu.system.alert nếu có
    -------------------------------------------*/
    toastOk: function (msg) {
        if (typeof edu !== 'undefined' && edu.system && edu.system.alert) edu.system.alert(msg, 's');
        else this._simpleToast(msg, 'ok');
    },
    toastDel: function (msg) {
        if (typeof edu !== 'undefined' && edu.system && edu.system.alert) edu.system.alert(msg, 'i');
        else this._simpleToast(msg, 'del');
    },
    _simpleToast: function (msg, type) {
        var $t = $('<div></div>').css({
            position: 'fixed', right: '24px', bottom: '76px', zIndex: 1080,
            background: type === 'del' ? '#d8456b' : '#1f9d6b', color: '#fff',
            padding: '10px 16px', borderRadius: '10px', boxShadow: '0 6px 22px rgba(0,0,0,.18)',
            fontSize: '13px', fontWeight: '500'
        }).text(msg).appendTo('body');
        setTimeout(function () { $t.fadeOut(300, function () { $t.remove(); }); }, 2000);
    }
};
