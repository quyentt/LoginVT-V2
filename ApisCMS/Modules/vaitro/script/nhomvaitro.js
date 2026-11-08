/*----------------------------------------------
--Cấu hình nhóm + thứ tự vai trò: quyết định mỗi vai trò nằm ở NHÓM nào và đứng THỨ MẤY trong nhóm trên màn hình
--  "Danh sách vai trò" của trang chủ (index.aspx > initRolePicker). Lưu ở DB nên toàn hệ thống cùng thấy sau khi
--  người dùng tải lại trang.
--
--Cách lưu: ghi các thẻ vào cuối cột MOTA của vai trò bằng API SuaVaiTro có sẵn (cùng API của trang Vai trò, gửi lại
--  nguyên các trường khác, CHỈ đổi MOTA, phần mô tả cũ giữ nguyên):
--     [nhom:mã]   nhóm của vai trò (mã lấy từ danh mục dữ liệu "nhomvaitro")
--     [stt:N]     thứ tự trong nhóm (số nhỏ đứng trước; vai trò không có số đứng sau, theo tên)
--  Trang chủ đọc các thẻ này ở classify()/enrich() (index.aspx). Đây là cách TẠM vì bảng vai trò chưa có cột riêng.
--  Khi BE thêm cột riêng thì chỉ cần đổi: tagOf/sttOf (đọc), withTags (ghi), req_SuaNhom (tham số gửi).
--
--Danh sách nhóm: lấy từ danh mục dữ liệu "nhomvaitro" (xem loadNhom/mergeNhom). GROUPS bên dưới là danh sách CÓ SẴN dùng
--  làm dự phòng khi danh mục lỗi/trống — các mã phải khớp với GROUPS trong index.aspx (initRolePicker); đổi tên nhóm hoặc
--  thêm nhóm mới chỉ cần sửa ở danh mục, không phải sửa code. THỨ TỰ NHÓM cũng lấy từ danh mục: cột HeSo1 ("Thứ tự")
--  hoặc thẻ [stt:N] ở ô Mô tả của dòng nhóm.
----------------------------------------------*/
function NhomVaiTro() { }
NhomVaiTro.prototype = {
    dtVaiTro: [],
    mapById: {},
    objChange: {},  // ID vai trò -> mã nhóm mới ('' = theo mặc định hệ thống); chỉ chứa dòng KHÁC giá trị đã lưu
    objStt: {},     // ID vai trò -> thứ tự mới ('' = bỏ thứ tự); chỉ chứa dòng KHÁC giá trị đã lưu
    savedOk: {},    // ID vai trò -> { nhom, stt } đã lưu thành công trong lần chạy gần nhất (để đối chiếu lại với máy chủ)
    iTimer: 0,
    iRenderToken: 0, // tăng mỗi lần vẽ lại bảng để việc khởi tạo select2 theo đợt của lần vẽ cũ tự dừng
    _unkRank: {},    // mã nhóm lạ (không có trong danh sách nhóm) -> thứ hạng khối, tính lại mỗi lần sắp xếp

    // color = màu chấm nhóm, lấy đúng màu nhóm trên trang chủ (GROUPS.fg trong index.aspx) cho người dùng dễ liên tưởng — đổi màu ở đâu thì đổi cả hai
    GROUPS: [
        { code: "tuyensinh", label: "Quản lý tuyển sinh và sinh viên", color: "#be185d" },
        { code: "daotao", label: "Quản lý đào tạo", color: "#6d28d9" },
        { code: "khaothi", label: "Quản lý khảo thí", color: "#c2410c" },
        { code: "taichinh", label: "Quản lý tài chính và học phí", color: "#15803d" },
        { code: "cong", label: "Hệ thống cổng thông tin", color: "#1d4ed8" },
        { code: "mobile", label: "Ứng dụng di động", color: "#0e7490" },
        { code: "nhansu", label: "Nhân sự", color: "#a21caf" },
        { code: "quantri", label: "Quản trị hệ thống", color: "#4d7c0f" },
        { code: "khac", label: "Khác", color: "#6b7280" }
    ],

    init: function () {
        var me = this;
        if (edu.system && typeof edu.system.page_load === "function") edu.system.page_load();
        // Nạp danh sách nhóm từ danh mục dữ liệu trước (lỗi/trống thì dùng danh sách có sẵn), rồi mới dựng ô lọc + bảng
        me.loadNhom(function () {
            me.initFilterSelect();
            me.initSortSelect();
            me.getList_VaiTro();
        });

        $("#txtNhomVT_TuKhoa").on("input", function () {
            clearTimeout(me.iTimer);
            me.iTimer = setTimeout(function () { me.render(); }, 150);
        });
        $("#dropNhomVT_Loc, #dropNhomVT_SapXep").on("change", function () { me.render(); });
        $("#tblNhomVaiTro").on("change", ".sl-nhomvt", function () {
            me.onChangeNhom($(this).attr("data-id"), $(this).val());
        });
        // Ô thứ tự: gõ số xong (rời ô) chỉ ghi nhận; nhấn Enter hoặc bấm ▲▼ mới sắp xếp lại bảng
        // (không tự sắp lại khi đang gõ để người dùng Tab xuống dòng dưới nhập tiếp được)
        $("#tblNhomVaiTro").on("change", ".in-sttvt", function () {
            me.onChangeStt($(this).attr("data-id"), $(this).val(), $(this));
        });
        $("#tblNhomVaiTro").on("keydown", ".in-sttvt", function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.onChangeStt($(this).attr("data-id"), $(this).val(), $(this));
                me.render(true);
            }
        });
        $("#tblNhomVaiTro").on("click", ".nvt-arrow", function (e) {
            e.preventDefault();
            if ($(this).hasClass("nvt-dis")) return;
            me.moveRow($(this).attr("data-id"), $(this).hasClass("nvt-up") ? -1 : 1);
        });
        $("#btnNhomVT_Luu").click(function (e) {
            e.preventDefault();
            me.save();
        });
        $("#btnNhomVT_HoanTac").click(function (e) {
            e.preventDefault();
            me.objChange = {};
            me.objStt = {};
            me.render();
        });
        $("#btnNhomVT_TaiLai").click(function (e) {
            e.preventDefault();
            if (me.countChange() > 0 && !window.confirm("Có " + me.countChange() + " thay đổi chưa lưu sẽ bị bỏ. Tải lại danh sách?")) return;
            me.objChange = {};
            me.objStt = {};
            me.getList_VaiTro();
        });
    },

    /*----------------------------------------------
    --Discription: Danh sách nhóm lấy từ danh mục dữ liệu "nhomvaitro"
    --  (CMS > Danh mục > Danh mục dữ liệu; bảng "Nhóm vai trò", mỗi dòng: Mã = mã nhóm, Tên = tên nhóm).
    --  GROUPS ở trên là danh sách CÓ SẴN, luôn dùng làm dự phòng. Quy tắc gộp (giống index.aspx):
    --   - Mã đã có sẵn: lấy TÊN trong danh mục làm nhãn (đổi tên nhóm không cần sửa code).
    --   - Mã mới: thêm nhóm mới, xếp trước "Khác", màu lấy lần lượt từ NEW_COLORS.
    --   - Không bao giờ xóa nhóm có sẵn: vai trò đã gắn nhóm đó vẫn phải có chỗ hiển thị.
    --   - THỨ TỰ nhóm: dòng nào có số thứ tự (cột HeSo1 > 0, hoặc thẻ [stt:N] ở ô Mô tả) thì xếp theo số đó và đứng
    --     TRƯỚC các dòng chưa có số; các dòng chưa có số giữ thứ tự mặc định.
    --  Mã chỉ gồm a-z, 0-9, _ (vì nằm trong thẻ [nhom:mã]); mã sai quy tắc bị bỏ qua.
    ----------------------------------------------*/
    NHOM_DM_MA: "nhomvaitro",
    NEW_COLORS: ["#0f766e", "#4338ca", "#b91c1c", "#a16207", "#92400e", "#0369a1", "#9a3412", "#115e59"], // khác 8 màu nhóm có sẵn; giữ khớp NEW_GROUP_COLORS ở index.aspx
    // Số thứ tự của 1 dòng nhóm trong danh mục: HeSo1 (> 0) trước, không có thì thẻ [stt:N] ở Mô tả; không có = null
    orderOfDm: function (r) {
        var h = parseFloat(r && r.HESO1);
        if (isFinite(h) && h > 0) return h;
        var m = /\[stt:(\d+)\]/i.exec((r && r.MOTA) || "");
        return m ? parseInt(m[1], 10) : null;
    },
    mergeNhom: function (rows) {
        var base = NhomVaiTro.prototype.GROUPS, me = this, seen = {}, extra = [], renamed = {}, orders = {};
        (rows || []).forEach(function (r) {
            var code = String((r && r.MA) || "").trim().toLowerCase(), label = String((r && r.TEN) || "").trim();
            if (!code || !label || seen[code]) return;
            if (!/^[a-z0-9_]+$/.test(code)) {
                if (window.console) console.warn("[nhomvaitro] Bỏ qua mã nhóm không hợp lệ trong danh mục: \"" + r.MA + "\" (chỉ dùng a-z, 0-9, _).");
                return;
            }
            seen[code] = true;
            var o = me.orderOfDm(r);
            if (o !== null) orders[code] = o;
            var isBase = base.some(function (g) { return g.code === code; });
            if (isBase) renamed[code] = label; else extra.push({ code: code, label: label });
        });
        var out = [], khac = null;
        base.forEach(function (g) {
            var item = { code: g.code, label: renamed[g.code] || g.label, color: g.color };
            if (g.code === "khac") khac = item; else out.push(item);
        });
        extra.forEach(function (g, i) { out.push({ code: g.code, label: g.label, color: me.NEW_COLORS[i % me.NEW_COLORS.length] }); });
        if (khac) out.push(khac);
        // Xếp theo số thứ tự của danh mục (nếu có); bằng nhau / chưa có số thì giữ thứ tự mặc định ở trên
        var pos = {};
        out.forEach(function (g, i) { pos[g.code] = i; });
        out.sort(function (a, b) {
            var ha = Object.prototype.hasOwnProperty.call(orders, a.code), hb = Object.prototype.hasOwnProperty.call(orders, b.code);
            if (ha && hb) return (orders[a.code] - orders[b.code]) || (pos[a.code] - pos[b.code]);
            if (ha) return -1;
            if (hb) return 1;
            return pos[a.code] - pos[b.code];
        });
        return out;
    },
    loadNhom: function (fnDone) {
        var me = this, called = false;
        function done() { if (!called) { called = true; if (typeof fnDone === "function") fnDone(); } }
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success && Array.isArray(data.Data) && data.Data.length > 0) {
                    me.GROUPS = me.mergeNhom(data.Data);
                } else {
                    me.showBanner("info", "Danh mục nhóm \"" + me.NHOM_DM_MA + "\" đang trống hoặc không đọc được" + (data && data.Message ? " (" + me.esc(data.Message) + ")" : "") + " — đang dùng danh sách nhóm mặc định.");
                }
                done();
            },
            error: function () {
                me.showBanner("info", "Không kết nối được danh mục nhóm \"" + me.NHOM_DM_MA + "\" — đang dùng danh sách nhóm mặc định.");
                done();
            },
            type: "GET",
            action: "CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM",
            contentType: true,
            data: { "strMaBangDanhMuc": me.NHOM_DM_MA, "strTieuChiSapXep": "", "dTrangThai": 1 },
            fakedb: []
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Discription: Tiện ích
    ----------------------------------------------*/
    esc: function (s) {
        return String(s === null || s === undefined ? "" : s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    },
    norm: function (s) {
        return String(s === null || s === undefined ? "" : s).toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
    },
    labelOf: function (code) {
        if (!code) return "Theo mặc định";
        for (var i = 0; i < this.GROUPS.length; i++) if (this.GROUPS[i].code === code) return this.GROUPS[i].label;
        return "(mã lạ: " + code + ")";
    },
    // Đọc thẻ nhóm trong MOTA — phải cùng quy ước với groupFromMoTa() ở index.aspx
    tagOf: function (moTa) {
        var m = /\[nhom:([a-z0-9_]+)\]/i.exec(moTa || "");
        return m ? m[1].toLowerCase() : "";
    },
    // Đọc thẻ thứ tự [stt:N] trong MOTA (chuỗi số nguyên dương, không có = "") — cùng quy ước với sttFromMoTa() ở index.aspx
    sttOf: function (moTa) {
        var m = /\[stt:(\d+)\]/i.exec(moTa || "");
        var n = m ? parseInt(m[1], 10) : 0;
        return n > 0 ? String(n) : "";
    },
    // MOTA mới = mô tả cũ (bỏ thẻ nhóm + thẻ thứ tự cũ) + thẻ mới; nhóm rỗng / thứ tự rỗng = không ghi thẻ đó
    withTags: function (moTa, code, stt) {
        var text = String(moTa === null || moTa === undefined ? "" : moTa)
            .replace(/\s*\[nhom:[a-z0-9_]+\]/ig, "").replace(/\s*\[stt:\d+\]/ig, "").trim();
        var out = text;
        if (code) out += (out ? " " : "") + "[nhom:" + code + "]";
        if (stt) out += (out ? " " : "") + "[stt:" + stt + "]";
        return out;
    },
    origOf: function (row) { return this.tagOf(row.MOTA); },
    curOf: function (row) {
        return Object.prototype.hasOwnProperty.call(this.objChange, row.ID) ? this.objChange[row.ID] : this.origOf(row);
    },
    origStt: function (row) { return this.sttOf(row.MOTA); },
    curStt: function (row) {
        return Object.prototype.hasOwnProperty.call(this.objStt, row.ID) ? this.objStt[row.ID] : this.origStt(row);
    },
    isChanged: function (row) {
        return this.curOf(row) !== this.origOf(row) || this.curStt(row) !== this.origStt(row);
    },
    setStt: function (row, val) {
        if (val === this.origStt(row)) delete this.objStt[row.ID]; else this.objStt[row.ID] = val;
    },
    // Số dòng có thay đổi chưa lưu (đổi nhóm HOẶC đổi thứ tự; 1 dòng đổi cả hai vẫn tính 1)
    countChange: function () {
        var all = {};
        Object.keys(this.objChange).forEach(function (k) { all[k] = 1; });
        Object.keys(this.objStt).forEach(function (k) { all[k] = 1; });
        return Object.keys(all).length;
    },
    showBanner: function (type, html) {
        // type: success | info | warning | danger. Dùng khung chữ trong trang, KHÔNG dùng edu.system.alert (tránh chồng modal BS3)
        $("#divNhomVT_Banner").html(html ? '<div class="alert alert-' + type + '" style="margin-bottom:12px">' + html + '</div>' : "");
    },

    /*----------------------------------------------
    --Discription: Nạp danh sách vai trò (cùng API với trang Vai trò: LayDanhSachVaiTro)
    ----------------------------------------------*/
    getList_VaiTro: function (fnDone) {
        var me = this;
        var obj_list = {
            'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
            'func': 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
            'iM': edu.system.iM,
            'versionAPI': 'v1.0',
            'strLoaiVaiTro_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1,
            'strChung_VaiTro_Cha_Id': ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    var dt = Array.isArray(data.Data) ? data.Data : ((data.Data && data.Data.rs) || []);
                    me.dtVaiTro = dt.slice();
                    me.mapById = {};
                    me.dtVaiTro.forEach(function (r) { me.mapById[r.ID] = r; });
                    var iPager = parseInt(data.Pager, 10);
                    if (iPager > dt.length) {
                        me.showBanner("warning", "Chỉ nạp được " + dt.length + "/" + iPager + " vai trò đầu tiên. Dùng ô tìm kiếm của trang Vai trò cho các vai trò còn lại.");
                    }
                    me.render();
                    if (typeof fnDone === "function") fnDone();
                } else {
                    me.showBanner("danger", "Không nạp được danh sách vai trò: " + me.esc(data && data.Message));
                }
            },
            error: function (er) {
                me.showBanner("danger", "Không nạp được danh sách vai trò (lỗi kết nối): " + me.esc(JSON.stringify(er)));
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Discription: Ô chọn dạng select2 (có ô tìm kiếm). Cùng thư viện + giao diện với các trang khác trong hệ thống.
    --  Không có select2 thì vẫn dùng <select> thường, chức năng không đổi.
    ----------------------------------------------*/
    colorOf: function (code) {
        for (var i = 0; i < this.GROUPS.length; i++) if (this.GROUPS[i].code === code) return this.GROUPS[i].color;
        return "#94a3b8";
    },
    // Dòng trong danh sách + ô đang chọn: chấm màu nhóm + tên. Mặc định = chấm rỗng. Dựng bằng .text() nên không lọt HTML.
    fmtNhom: function (state) {
        if (state.loading) return state.text;
        var $o = $('<span class="nvt-opt"></span>');
        var $dot = $('<i class="nvt-dot"></i>');
        if (state.id) $dot.css("background", this.colorOf(state.id));
        else $dot.addClass("nvt-dot-none");
        $o.append($dot).append($("<span></span>").text(state.text));
        return $o;
    },
    // Tìm không phân biệt dấu và chữ hoa/thường: gõ "khao thi" ra "Quản lý khảo thí"
    matcherNhom: function (params, data) {
        var P = NhomVaiTro.prototype; // select2 gọi hàm này không kèm this
        var kw = $.trim(params.term || "");
        if (kw === "") return data;
        // Mục có con (optgroup của ô bộ lọc): giữ lại các con khớp, không con nào khớp thì bỏ cả nhóm
        if (data.children && data.children.length > 0) {
            var match = $.extend(true, {}, data);
            for (var c = data.children.length - 1; c >= 0; c--) {
                if (P.matcherNhom(params, data.children[c]) === null) match.children.splice(c, 1);
            }
            return match.children.length > 0 ? match : null;
        }
        if (typeof data.text === "undefined") return null;
        return P.norm(data.text).indexOf(P.norm(kw)) > -1 ? data : null;
    },
    select2Opts: function (el) {
        var me = this;
        return {
            width: "100%",
            // Cùng chuẩn với edu.system.page_load: ngoài modal gắn vào body để không bị khung cuộn của bảng cắt mất
            dropdownParent: (edu.system && typeof edu.system.getSelect2Parent === "function") ? edu.system.getSelect2Parent(el) : $(document.body),
            matcher: me.matcherNhom,
            language: { noResults: function () { return "Không tìm thấy nhóm phù hợp"; } },
            templateResult: function (s) { return me.fmtNhom(s); },
            templateSelection: function (s) { return me.fmtNhom(s); }
        };
    },
    bindSelect2Common: function ($s, strHint) {
        $s.on("select2:open", function () {
            // Gợi ý trong ô tìm kiếm của danh sách vừa mở
            if (strHint) setTimeout(function () { $(".select2-container--open .select2-search__field").attr("placeholder", strHint); }, 0);
        }).on("select2:close", function () {
            // select2 4.0.3 gắn scroll.select2 vào các khung cha khi mở; gỡ khi đóng để trang/khung cuộn không bị khóa
            $(this).parents().off("scroll.select2");
        });
    },
    initFilterSelect: function () {
        var me = this, $f = $("#dropNhomVT_Loc");
        if (!$f.length) return;
        // Danh sách nhóm trong bộ lọc sinh từ GROUPS (không chép tay ở HTML nữa → chỉ còn 1 nguồn trong trang này)
        var $og = $f.find("optgroup");
        if (!$og.length) $og = $('<optgroup label="Theo nhóm đã chọn"></optgroup>').appendTo($f);
        $og.empty();
        me.GROUPS.forEach(function (g) { $og.append($("<option></option>").val("g:" + g.code).text(g.label)); });
        if (!$.fn.select2) return;
        // Dự phòng khi HTML là bản cũ (thiếu thẻ bọc .nvt-loc): tự bọc, nếu không ô select2 sẽ giãn hết cả hàng
        // và danh sách xổ ra rộng kín trang ở mép trái
        if (!$f.parent().hasClass("nvt-loc")) $f.removeClass("nvt-loc").css("width", "100%").wrap('<div class="nvt-loc"></div>');
        var o = me.select2Opts($f[0]);
        delete o.templateResult; delete o.templateSelection; // bộ lọc không cần chấm màu
        $f.select2(o);
        me.bindSelect2Common($f, "Gõ để tìm bộ lọc...");
    },
    // Ô chọn cách sắp xếp bảng (nhóm + thứ tự / tên A-Z): ít lựa chọn nên không cần ô tìm kiếm
    initSortSelect: function () {
        var me = this, $s = $("#dropNhomVT_SapXep");
        if (!$s.length || !$.fn.select2) return;
        if (!$s.parent().hasClass("nvt-sort")) $s.css("width", "100%").wrap('<div class="nvt-sort"></div>');
        var o = me.select2Opts($s[0]);
        delete o.templateResult; delete o.templateSelection;
        o.minimumResultsForSearch = Infinity;
        $s.select2(o);
        me.bindSelect2Common($s, "");
    },
    // Khởi tạo select2 cho các dòng vừa vẽ, theo đợt để bảng hàng trăm dòng không làm đơ trình duyệt
    initSelects: function () {
        var me = this;
        if (!$.fn.select2) return;
        var token = ++me.iRenderToken, $all = $("#tblNhomVaiTro tbody .sl-nhomvt"), i = 0, CHUNK = 40;
        (function step() {
            if (token !== me.iRenderToken) return; // đã có lần vẽ mới hơn
            $all.slice(i, i + CHUNK).each(function () {
                var $s = $(this);
                $s.select2(me.select2Opts(this));
                me.bindSelect2Common($s, "Gõ để tìm nhóm...");
            });
            i += CHUNK;
            if (i < $all.length) setTimeout(step, 0);
        })();
    },
    optionsHtml: function (sel) {
        var me = this, h = '<option value=""' + (sel === "" ? " selected" : "") + '>— Theo mặc định hệ thống —</option>', known = false, i;
        for (i = 0; i < me.GROUPS.length; i++) {
            if (me.GROUPS[i].code === sel) known = true;
            h += '<option value="' + me.GROUPS[i].code + '"' + (me.GROUPS[i].code === sel ? " selected" : "") + ">" + me.esc(me.GROUPS[i].label) + "</option>";
        }
        // Thẻ có mã không còn trong danh sách nhóm: giữ lại để không âm thầm mất khi lưu
        if (sel && !known) h += '<option value="' + me.esc(sel) + '" selected>(mã lạ: ' + me.esc(sel) + ")</option>";
        return h;
    },
    statusHtml: function (row) {
        if (this.isChanged(row)) return '<span class="nvt-badge nvt-b-chg">Chưa lưu</span>';
        return (this.origOf(row) || this.origStt(row)) ? '<span class="nvt-badge nvt-b-set">Đã chọn</span>' : '<span class="nvt-badge nvt-b-def">Mặc định</span>';
    },
    matchFilter: function (row, kw, loc) {
        var me = this;
        if (kw && me.norm(row.TENVAITRO + " " + row.MAVAITRO).indexOf(kw) < 0) return false;
        var cur = me.curOf(row);
        if (loc === "set") return cur !== "";
        if (loc === "unset") return cur === "";
        if (loc === "changed") return me.isChanged(row);
        if (loc.indexOf("g:") === 0) return cur === loc.substring(2);
        return true;
    },
    curFilter: function () {
        return { kw: this.norm($("#txtNhomVT_TuKhoa").val()).trim(), loc: $("#dropNhomVT_Loc").val() || "" };
    },

    /*----------------------------------------------
    --Discription: Sắp xếp + vẽ bảng
    --  Chế độ "nhom" (mặc định): theo nhóm (đúng thứ tự nhóm ở danh mục) rồi thứ tự, rồi tên. Vai trò chưa chọn nhóm
    --  nằm cuối cùng ("theo mặc định": trang chủ tự xếp bằng nhóm mặc định trong code nên trang này chưa biết nhóm nào).
    --  Chế độ "ten": A-Z theo tên (cách cũ).
    ----------------------------------------------*/
    sortMode: function () { return $("#dropNhomVT_SapXep").val() === "ten" ? "ten" : "nhom"; },
    blockRank: function (code) {
        if (!code) return 1000000;
        for (var i = 0; i < this.GROUPS.length; i++) if (this.GROUPS[i].code === code) return i;
        return this.GROUPS.length + 1 + (this._unkRank[code] || 0);
    },
    sortedRows: function () {
        var me = this, rows = me.dtVaiTro.slice();
        var cmpName = function (a, b) { return String(a.TENVAITRO || "").localeCompare(String(b.TENVAITRO || ""), "vi"); };
        if (me.sortMode() === "ten") return rows.sort(cmpName);
        // mã nhóm lạ xếp ngay sau các nhóm hợp lệ, theo chữ cái, để mỗi mã lạ thành 1 khối liền nhau
        var unk = {}, list = [];
        rows.forEach(function (r) {
            var c = me.curOf(r);
            if (c && !me.GROUPS.some(function (g) { return g.code === c; }) && !unk[c]) { unk[c] = 1; list.push(c); }
        });
        list.sort();
        me._unkRank = {};
        list.forEach(function (c, i) { me._unkRank[c] = i; });
        return rows.sort(function (a, b) {
            var ra = me.blockRank(me.curOf(a)), rb = me.blockRank(me.curOf(b));
            if (ra !== rb) return ra - rb;
            var sa = me.curStt(a), sb = me.curStt(b);
            var na = sa === "" ? Infinity : parseInt(sa, 10), nb = sb === "" ? Infinity : parseInt(sb, 10);
            if (na !== nb) return na < nb ? -1 : 1;
            return cmpName(a, b);
        });
    },
    groupHeaderHtml: function (code, n) {
        var me = this, label, dot;
        if (!code) {
            label = "Chưa chọn nhóm — trang chủ dùng nhóm mặc định";
            dot = '<i class="nvt-dot nvt-dot-none"></i>';
        } else {
            label = me.labelOf(code);
            dot = '<i class="nvt-dot" style="background:' + me.esc(me.colorOf(code)) + '"></i>';
        }
        return '<tr class="nvt-grp"><td colspan="7">' + dot + "<b>" + me.esc(label) + '</b> <span class="nvt-grp-n">(' + n + ")</span></td></tr>";
    },
    render: function (keepScroll) {
        var me = this, f = me.curFilter(), mode = me.sortMode();
        var $sc = $(".aps-nhomvt-scroll"), st = keepScroll ? $sc.scrollTop() : 0;
        var rows = me.sortedRows().filter(function (r) { return me.matchFilter(r, f.kw, f.loc); });
        // Đếm + tìm dòng đầu/cuối từng khối (để ghi số lượng vào tiêu đề nhóm và khóa nút ▲ ở dòng đầu, ▼ ở dòng cuối)
        var counts = {}, first = {}, last = {};
        rows.forEach(function (r) {
            var k = me.curOf(r);
            counts[k] = (counts[k] || 0) + 1;
            if (first[k] === undefined) first[k] = r.ID;
            last[k] = r.ID;
        });
        var html = "", n = 0, lastKey = null;
        rows.forEach(function (r) {
            var key = me.curOf(r);
            if (mode === "nhom" && key !== lastKey) { html += me.groupHeaderHtml(key, counts[key]); lastKey = key; }
            n++;
            var cha = r.CHUNG_VAITRO_CHA_ID && me.mapById[r.CHUNG_VAITRO_CHA_ID] ? me.mapById[r.CHUNG_VAITRO_CHA_ID].TENVAITRO : "";
            var id = me.esc(r.ID);
            var ord = '<div class="nvt-ord">';
            if (mode === "nhom") ord += '<a class="nvt-arrow nvt-up' + (first[key] === r.ID ? " nvt-dis" : "") + '" data-id="' + id + '" title="Đưa lên trên">&#9650;</a>';
            ord += '<input type="text" class="form-control input-sm in-sttvt" inputmode="numeric" maxlength="4" placeholder="—" data-id="' + id + '" value="' + me.esc(me.curStt(r)) + '" />';
            if (mode === "nhom") ord += '<a class="nvt-arrow nvt-down' + (last[key] === r.ID ? " nvt-dis" : "") + '" data-id="' + id + '" title="Đưa xuống dưới">&#9660;</a>';
            ord += "</div>";
            html += '<tr class="nvt-row' + (me.isChanged(r) ? " nvt-changed" : "") + '" id="nvt_' + id + '">';
            html += '<td class="td-center">' + n + "</td>";
            html += "<td><b>" + me.esc(r.TENVAITRO) + "</b></td>";
            html += "<td>" + me.esc(r.MAVAITRO) + "</td>";
            html += '<td class="text-muted">' + me.esc(cha) + "</td>";
            html += '<td><select class="form-control input-sm sl-nhomvt" data-id="' + id + '">' + me.optionsHtml(me.curOf(r)) + "</select></td>";
            html += "<td>" + ord + "</td>";
            html += '<td class="td-center nvt-status">' + me.statusHtml(r) + "</td>";
            html += "</tr>";
        });
        if (!html) html = '<tr><td colspan="7" class="td-center text-muted" style="padding:24px">Không có vai trò phù hợp.</td></tr>';
        $("#tblNhomVaiTro tbody").html(html);
        if (st) $sc.scrollTop(st);
        me.initSelects();
        $("#lblNhomVT_Tong").text(me.dtVaiTro.length);
        $("#lblNhomVT_HienThi").text("Hiển thị " + n + " / " + me.dtVaiTro.length);
        me.refreshFooter();
    },
    refreshRow: function (row) {
        $("#nvt_" + row.ID).toggleClass("nvt-changed", this.isChanged(row)).find(".nvt-status").html(this.statusHtml(row));
        this.refreshFooter();
    },
    onChangeNhom: function (strId, strCode) {
        var me = this, row = me.mapById[strId];
        if (!row) return;
        if (strCode === me.origOf(row)) delete me.objChange[strId];
        else me.objChange[strId] = strCode;
        me.refreshRow(row);
    },
    // Ô thứ tự: chỉ giữ chữ số dương (tối đa 4 chữ số); rỗng/0 = bỏ thứ tự của vai trò này
    onChangeStt: function (strId, strVal, $inp) {
        var me = this, row = me.mapById[strId];
        if (!row) return;
        var v = String(strVal || "").replace(/\D/g, "").replace(/^0+/, "").slice(0, 4);
        if ($inp) $inp.val(v);
        me.setStt(row, v);
        me.refreshRow(row);
    },
    // ▲▼: đổi chỗ với vai trò kế bên (cùng khối, đang hiển thị) rồi ĐÁNH SỐ LẠI cả khối 1..k theo thứ tự mới — nhờ vậy
    // vai trò chưa có số cũng có thứ tự rõ ràng và mỗi lần bấm chỉ đổi đúng 2 vị trí
    moveRow: function (strId, dir) {
        var me = this, row = me.mapById[strId];
        if (!row) return;
        var key = me.curOf(row), f = me.curFilter();
        var full = me.sortedRows().filter(function (r) { return me.curOf(r) === key; });
        var pos = -1;
        full.forEach(function (r, i) { if (r.ID === strId) pos = i; });
        if (pos < 0) return;
        var j = pos + dir;
        while (j >= 0 && j < full.length && !me.matchFilter(full[j], f.kw, f.loc)) j += dir; // bỏ qua dòng đang bị bộ lọc ẩn
        if (j < 0 || j >= full.length) return;
        var t = full[pos]; full[pos] = full[j]; full[j] = t;
        full.forEach(function (r, i) { me.setStt(r, String(i + 1)); });
        me.render(true);
    },
    refreshFooter: function () {
        var n = this.countChange();
        $("#lblNhomVT_SoThayDoi").html(n > 0 ? '<b style="color:#c2410c">' + n + "</b> thay đổi chưa lưu" : "Chưa có thay đổi");
    },

    /*----------------------------------------------
    --Discription: Lưu — mỗi vai trò đổi nhóm/thứ tự = 1 lần gọi SuaVaiTro (form tiến trình dùng chung edu.process)
    ----------------------------------------------*/
    // Dựng tham số SuaVaiTro: gửi lại NGUYÊN các trường hiện có của vai trò, chỉ MOTA đổi
    req_SuaNhom: function (it) {
        var me = this, r = it.row;
        var d = {
            'action': 'CMS_QuanLyNguoiDung/SuaVaiTro',
            'versionAPI': 'v1.0',
            'strMaVaiTro': r.MAVAITRO,
            'strTenVaiTro': r.TENVAITRO,
            'strMoTa': me.withTags(r.MOTA, it.MOI, it.SMOI),
            'dThuTu': (r.THUTU === undefined || r.THUTU === "") ? null : r.THUTU,
            'dTrangThai': 1,
            'strLoaiVaiTro_Id': r.LOAIVAITRO_ID || "",
            'strChung_VaiTro_Cha_Id': r.CHUNG_VAITRO_CHA_ID || "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': r.ID
        };
        return { action: d.action, data: d };
    },
    save: function () {
        var me = this, items = [];
        me.dtVaiTro.forEach(function (r) {
            if (me.isChanged(r)) {
                items.push({ ID: r.ID, TEN: r.TENVAITRO, MA: r.MAVAITRO, CU: me.origOf(r), MOI: me.curOf(r), SCU: me.origStt(r), SMOI: me.curStt(r), row: r });
            }
        });
        if (!items.length) {
            me.showBanner("info", "Chưa có thay đổi nào để lưu.");
            return;
        }
        me.showBanner("", "");
        me.savedOk = {};
        var fnAfter = function () { me.afterSave(); };
        if (edu.process && typeof edu.process.run === "function") {
            edu.process.run({
                title: "Lưu nhóm và thứ tự vai trò",
                unit: "vai trò",
                fileName: "KetQuaLuuNhomVaiTro",
                items: items,
                columns: [
                    { header: "Tên vai trò", render: function (it) { return it.TEN; } },
                    { header: "Mã vai trò", render: function (it) { return it.MA; } },
                    { header: "Nhóm (cũ → mới)", render: function (it) { return it.CU === it.MOI ? me.labelOf(it.MOI) + " (giữ nguyên)" : me.labelOf(it.CU) + " → " + me.labelOf(it.MOI); } },
                    { header: "Thứ tự (cũ → mới)", render: function (it) { return (it.SCU || "—") + " → " + (it.SMOI || "—"); } }
                ],
                notes: ["Mỗi vai trò đổi nhóm hoặc thứ tự được lưu bằng 1 lần cập nhật. Nhóm và thứ tự mới hiện ở trang chủ sau khi người dùng tải lại trang."],
                okMessage: "Đã lưu",
                run: function (it) {
                    return edu.process.callApi(me.req_SuaNhom(it)).then(function (r) {
                        if (r.ok) me.savedOk[it.ID] = { nhom: it.MOI, stt: it.SMOI };
                        return { ok: r.ok, message: r.message };
                    });
                },
                refresh: fnAfter
            });
        } else {
            me.saveSequential(items, fnAfter);
        }
    },
    // Dự phòng khi máy chủ chưa có edu.process (VD chưa copy processrun.js): lưu tuần tự, báo kết quả ở khung chữ
    saveSequential: function (items, fnAfter) {
        var me = this, i = 0, ok = 0, errs = [];
        me.showBanner("info", "Đang lưu " + items.length + " vai trò...");
        function next() {
            if (i >= items.length) {
                if (errs.length) me.showBanner("danger", "Lưu được " + ok + "/" + items.length + ". Lỗi: " + errs.map(function (s) { return me.esc(s); }).join("; "));
                if (ok > 0) fnAfter();
                return;
            }
            var it = items[i++], p = me.req_SuaNhom(it);
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) { ok++; me.savedOk[it.ID] = { nhom: it.MOI, stt: it.SMOI }; }
                    else errs.push(it.TEN + ": " + ((data && data.Message) || "không rõ lỗi"));
                    next();
                },
                error: function (er) { errs.push(it.TEN + ": lỗi kết nối"); next(); },
                type: 'POST', contentType: true, action: p.action, data: p.data, fakedb: []
            }, false, false, false, null);
        }
        next();
    },
    // Sau khi lưu: nạp lại từ máy chủ rồi ĐỐI CHIẾU thẻ nhóm + thẻ thứ tự — phòng khi máy chủ báo thành công mà không ghi MOTA
    afterSave: function () {
        var me = this, saved = me.savedOk;
        // Dòng lưu thành công thì bỏ khỏi danh sách chưa lưu; dòng lỗi giữ lại để lưu lại
        Object.keys(saved).forEach(function (id) { delete me.objChange[id]; delete me.objStt[id]; });
        me.getList_VaiTro(function () {
            var bad = [], total = Object.keys(saved).length;
            Object.keys(saved).forEach(function (id) {
                var r = me.mapById[id];
                if (!r || me.tagOf(r.MOTA) !== saved[id].nhom || me.sttOf(r.MOTA) !== saved[id].stt) bad.push(r ? r.TENVAITRO : id);
            });
            if (bad.length) {
                me.showBanner("warning", "Máy chủ báo lưu thành công nhưng <b>" + bad.length + "/" + total + "</b> vai trò chưa đổi nhóm/thứ tự (cột Mô tả không được cập nhật): " +
                    bad.map(function (s) { return me.esc(s); }).join(", ") + ". Cần báo bộ phận kỹ thuật kiểm tra hàm SuaVaiTro.");
            } else if (me.countChange() > 0) {
                // Có vai trò lưu lỗi: giữ nguyên lựa chọn của người dùng ở trạng thái "Chưa lưu" để bấm lưu lại
                me.showBanner("warning", "Đã lưu cho <b>" + total + "</b> vai trò. Còn <b>" + me.countChange() + "</b> vai trò chưa lưu được (dòng màu vàng, trạng thái \"Chưa lưu\") — xem lý do ở form kết quả, sửa rồi bấm Lưu lại.");
            } else {
                me.showBanner("success", "Đã lưu nhóm và thứ tự cho <b>" + total + "</b> vai trò. Người dùng tải lại trang chủ (Ctrl+F5) sẽ thấy thay đổi.");
            }
        });
    }
};
