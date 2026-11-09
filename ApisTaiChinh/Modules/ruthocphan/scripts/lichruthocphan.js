/*----------------------------------------------
--Trang: Lịch rút học phần (module Tài chính)
--Yêu cầu (sếp): cán bộ tài chính theo dõi theo lịch để biết ngày nào có sinh viên rút học phần.
--  - Lịch tháng nhỏ (cột phải): ô có dữ liệu rút được tô xanh.
--  - Lưới tuần (cột trái): chỉ có trục ngang theo ngày, KHÔNG có trục giờ. Ngày có rút hiện 1 thẻ tóm tắt,
--    bấm vào thẻ mở danh sách chi tiết sinh viên rút của ngày đó.
--API (module Đăng ký học - dùng lại đúng hàm của trang Rút học phần ở ApisDangKyHoc/kehoachdangky/ruthocphan.js):
--  DKH_RutHocPhan/LayDSThoiGianRut -> danh sách đợt
--  DKH_RutHocPhan/LayDSRut         -> danh sách rút, mỗi dòng = 1 sinh viên x 1 học phần, có NGAYRUT_DD_MM_YYYY
--  edu.system.getList_HeDaoTao     -> danh sách hệ đào tạo
--Bộ lọc:
--  * Lọc tại máy chủ (nạp lại): Đợt đăng ký, Hệ đào tạo, Từ khóa (đúng 3 tham số mà LayDSRut hỗ trợ).
--  * Lọc trên dữ liệu đã nạp (không gọi máy chủ): Từ/Đến ngày rút, Khóa, Chương trình, Lớp, Học phần, Trạng thái người học,
--    Kiểu học. Các ô chọn dạng "facet": mỗi ô chỉ liệt kê giá trị còn lại sau khi áp các bộ lọc KHÁC, kèm số lượt rút.
--Lưu ý: API KHÔNG có lọc theo khoảng ngày và không có số liệu tổng hợp theo ngày, nên FE nạp cả đợt rồi nhóm theo ngày.
--       Không sửa/tính lại số liệu: chỉ cộng các cột số của chính danh sách trả về để hiện tóm tắt.
----------------------------------------------*/
function LichRutHocPhan() { };
LichRutHocPhan.prototype = {
    dtRut: [],            // toàn bộ dòng rút máy chủ trả về cho (đợt, hệ, từ khóa) hiện tại
    dtLoc: [],            // dtRut sau khi áp các bộ lọc trên dữ liệu đã nạp
    objTheoNgay: {},      // 'yyyy-mm-dd' -> mảng dòng rút (đã lọc) của ngày đó
    iKhongCoNgay: 0,      // số dòng không đọc được ngày rút (không lên được lịch)
    bDaNap: false,        // đã nạp xong lần đầu (tránh báo "chưa có dữ liệu" khi mới mở trang)
    dtModal: [],          // các dòng của ngày đang mở trong modal
    dtModalHienThi: [],   // các dòng modal đang hiển thị (sau ô tìm nhanh) - đúng cái sẽ xuất Excel
    strNgayModal: "",     // 'yyyy-mm-dd' của ngày đang mở trong modal
    dHomNay: null,
    dNgayChon: null,      // ngày đang chọn -> xác định tuần đang xem
    iThang: 0,            // tháng đang hiện trên lịch nhỏ (1-12)
    iNam: 0,
    iReq: 0,              // chống kết quả cũ ghi đè khi đổi đợt liên tục
    strLocNgayCu: "|",    // cặp (từ ngày|đến ngày) hợp lệ đã áp gần nhất
    TRONG: '__trong__',   // giá trị lọc cho dòng không có thông tin ở trường đó
    arrThu: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'],
    // Các ô lọc trên dữ liệu đã nạp. pre = tiền tố trường (xxx_TEN, xxx_MA) -> nhãn hiển thị "TEN (MA)" khi có mã
    arrLoc: [
        { id: 'dropRhpKhoa', pre: 'DAOTAO_KHOADAOTAO', ten: 'Khóa đào tạo', all: 'Tất cả khóa đào tạo' },
        { id: 'dropRhpChuongTrinh', pre: 'DAOTAO_CHUONGTRINH', ten: 'Chương trình', all: 'Tất cả chương trình đào tạo' },
        { id: 'dropRhpLop', pre: 'DAOTAO_LOPQUANLY', ten: 'Lớp quản lý', all: 'Tất cả lớp quản lý' },
        { id: 'dropRhpHocPhan', pre: 'DAOTAO_HOCPHAN', ten: 'Học phần', all: 'Tất cả học phần' },
        { id: 'dropRhpTrangThai', pre: 'QLSV_TRANGTHAINGUOIHOC', ten: 'Trạng thái', all: 'Tất cả trạng thái người học' },
        { id: 'dropRhpKieuHoc', pre: 'KIEUHOC', ten: 'Kiểu học', all: 'Tất cả kiểu học' }
    ],

    init: function () {
        var me = this;
        me.dHomNay = me.layHomNay();
        me.dNgayChon = me.dHomNay;
        me.iThang = me.dHomNay.getMonth() + 1;
        me.iNam = me.dHomNay.getFullYear();
        me.apDungLoc(false);

        // ----- Điều hướng lịch
        $("#rhpTuanTruoc").click(function () { me.chuyenTuan(-1); });
        $("#rhpTuanSau").click(function () { me.chuyenTuan(1); });
        $("#rhpHomNay").click(function () { me.chonNgay(me.key(me.dHomNay)); });
        $("#rhpThangTruoc").click(function () { me.chuyenThang(-1); });
        $("#rhpThangSau").click(function () { me.chuyenThang(1); });
        $("#rhpThang").delegate(".dd", "click", function () {
            me.chonNgay($(this).attr("data-ngay"));
        });
        $("#rhpTuan").delegate(".rhp-card", "click", function () {
            me.openChiTiet($(this).attr("data-ngay"));
        });
        $("#rhpTuan").delegate(".rhp-card", "keydown", function (e) {
            if (e.which === 13 || e.which === 32) {
                e.preventDefault();
                me.openChiTiet($(this).attr("data-ngay"));
            }
        });

        // ----- Lọc tại máy chủ: đổi đợt / hệ -> nạp lại; từ khóa -> Enter hoặc nút Tìm kiếm
        // Combo đợt dùng loadToCombo_data (selectFirst) -> tự bắn "change" khi chọn sẵn đợt đầu => nạp dữ liệu 1 lần
        $("#dropSearch_DotRut, #dropSearch_HeDaoTao_Rut").on("change", function () {
            me.getList_RutHocPhan();
        });
        $("#rhpBtnTim").click(function () { me.getList_RutHocPhan(); });
        $("#txtRhpTuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_RutHocPhan();
            }
        });

        // ----- Lọc trên dữ liệu đã nạp
        $(".rhp-loc").on("change", function () { me.apDungLoc(false); });
        // Ô ngày là text dd/mm/yyyy có mặt nạ Cleave (edu.system.pickerdate chạy trong page_load SAU init) => đợi Cleave format
        // xong mới đọc; chỉ lọc lại khi cặp ngày hợp lệ thực sự đổi (tránh lọc lại ở mỗi phím gõ dở).
        $(".rhp-loc-ngay").on("input change blur", function () {
            setTimeout(function () {
                var strNgay = me.docNgay("dpRhpTuNgay") + "|" + me.docNgay("dpRhpDenNgay");
                if (strNgay === me.strLocNgayCu) return;
                me.apDungLoc(false);
            }, 0);
        });
        $("#rhpBtnXoaLoc").click(function () { me.xoaLoc(); });
        $("#rhpToggleLoc").click(function () {
            var $z = $("#rhpLocNangCao");
            $z.toggle();
            $("#rhpIconLoc").toggleClass("fa-chevron-up", $z.is(":visible")).toggleClass("fa-chevron-down", !$z.is(":visible"));
        });

        // ----- Tìm nhanh trong modal
        $("#txtRhpModalTim").on("input", function () { me.renderModal(); });

        me.initXuatExcel();
        me.getList_HeDaoTao();
        me.getList_DotRut();
    },

    /*------------------------------------------
    --Ngày tháng (toàn bộ dùng Date theo giờ địa phương, 00:00)
    -------------------------------------------*/
    layHomNay: function () {
        var d = new Date();
        try {
            // Ưu tiên giờ máy chủ như các trang khác ("dd/mm/yyyy")
            var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(edu.util.dateToday());
            if (m) d = new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10));
        } catch (ex) { }
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    },
    pad2: function (n) { return (n < 10 ? "0" : "") + n; },
    key: function (d) { return d.getFullYear() + "-" + this.pad2(d.getMonth() + 1) + "-" + this.pad2(d.getDate()); },
    parseKey: function (k) {
        var a = String(k).split("-");
        return new Date(parseInt(a[0], 10), parseInt(a[1], 10) - 1, parseInt(a[2], 10));
    },
    fmt: function (d) { return this.pad2(d.getDate()) + "/" + this.pad2(d.getMonth() + 1) + "/" + d.getFullYear(); },
    // "Thứ Bảy, 07/11/2026"
    fmtDai: function (d) { return this.arrThu[(d.getDay() + 6) % 7] + ", " + this.fmt(d); },
    addDays: function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); },
    thuHai: function (d) { return this.addDays(d, -((d.getDay() + 6) % 7)); },
    // 'dd/mm/yyyy' (có thể kèm giờ) -> 'yyyy-mm-dd'; không đọc được -> ''
    parseNgay: function (str) {
        var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(str == null ? "" : str));
        if (!m) return "";
        return m[3] + "-" + this.pad2(parseInt(m[2], 10)) + "-" + this.pad2(parseInt(m[1], 10));
    },

    /*------------------------------------------
    --Tiện ích hiển thị
    -------------------------------------------*/
    esc: function (v) {
        return String(v == null ? "" : v)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    toNum: function (v) {
        var n = parseFloat(String(v == null ? "" : v).replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
    },
    fmtNum: function (n) { return String(Math.round(n * 100) / 100); },
    fmtTien: function (n) { return edu.util.formatCurrency(Math.round(n)); },
    // Số đếm (lượt, sinh viên...) cũng có dấu phân cách hàng nghìn: 3,349 thay vì 3349
    fmtSo: function (n) { return edu.util.formatCurrency(Math.round(n)); },
    // Giá trị rỗng -> dấu gạch mờ để phân biệt với "0"
    hienGiaTri: function (v) {
        if (v == null || String(v).trim() === "") return '<span class="rhp-na">—</span>';
        return this.esc(v);
    },
    // Bỏ dấu + hạ chữ thường để tìm không phụ thuộc gõ dấu
    chuanHoa: function (s) {
        s = String(s == null ? "" : s).toLowerCase();
        if (s.normalize) s = s.normalize("NFD");
        return s.replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
    },
    // "TEN (MA)" theo tiền tố trường; không có mã thì chỉ TEN (hiện tại lớp/khóa chưa thấy trả về mã)
    nhan: function (e, strPre) {
        var ten = e[strPre + "_TEN"], ma = e[strPre + "_MA"];
        ten = ten == null ? "" : String(ten).trim();
        ma = ma == null ? "" : String(ma).trim();
        if (!ten && !ma) return "";
        if (ma && ma !== ten) return ten ? ten + " (" + ma + ")" : ma;
        return ten;
    },
    // Mã đợt dạng "2026_2027_1,1" (năm học _ học kỳ , đợt) -> "Năm học 2026-2027 · Học kỳ 1 · Đợt 1"; không khớp mẫu thì giữ nguyên
    nhanDot: function (str) {
        var s = String(str == null ? "" : str);
        var m = /^\s*(\d{4})_(\d{4})_(\d+)\s*,\s*(\d+)\s*$/.exec(s);
        if (!m) return s;
        return "Năm học " + m[1] + "-" + m[2] + " · Học kỳ " + m[3] + " · Đợt " + m[4];
    },
    // Thông báo ngay trong trang (loai: i = thông tin, w = cảnh báo, e = lỗi)
    thongBao: function (strLoai, strNoiDung) {
        var strIcon = { i: "fa-info-circle", w: "fa-exclamation-triangle", e: "fa-times-circle" }[strLoai] || "fa-info-circle";
        var $b = $('<div class="rhp-banner ' + (strLoai === "i" ? "" : strLoai) + '"></div>');
        $b.append($('<i class="fa ' + strIcon + '"></i>')).append(document.createTextNode(" " + strNoiDung));
        $("#rhpThongBao").html($b);
    },
    tenDot: function () {
        if (!edu.util.getValById("dropSearch_DotRut")) return "Tất cả đợt";
        return $("#dropSearch_DotRut option:selected").text().trim();
    },

    /*------------------------------------------
    --Nạp dữ liệu từ máy chủ
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_HeDaoTao(objList, "", "", function (data) { me.genCombo_HeDaoTao(data); });
    },
    genCombo_HeDaoTao: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENHEDAOTAO", code: "", avatar: "" },
            renderPlace: ["dropSearch_HeDaoTao_Rut"],
            type: "",
            title: "Tất cả hệ đào tạo"
        });
    },
    getList_DotRut: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_RutHocPhan/LayDSThoiGianRut',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data || [];
                    me.genCombo_DotRut(dt);
                    if (dt.length === 0) {
                        me.bDaNap = true;
                        me.apDungLoc(false);
                    }
                }
                else {
                    me.thongBao("e", obj_list.action + ": " + data.Message);
                }
            },
            error: function (er) {
                me.thongBao("e", obj_list.action + " (lỗi kết nối" + ((er && er.status) ? " " + er.status : "") + ")");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    genCombo_DotRut: function (data) {
        var me = this;
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                selectFirst: true,
                mRender: function (j, e) { return me.nhanDot(e.THOIGIAN); }
            },
            renderPlace: ["dropSearch_DotRut"],
            title: "Tất cả đợt"
        });
    },
    getList_RutHocPhan: function () {
        var me = this;
        var iReq = ++me.iReq;
        var obj_list = {
            'action': 'DKH_RutHocPhan/LayDSRut',
            'strTuKhoa': edu.util.getValById("txtRhpTuKhoa").trim(),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_DotRut"),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao_Rut"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        me.thongBao("i", "Đang tải dữ liệu rút học phần...");
        edu.system.makeRequest({
            success: function (data) {
                if (iReq !== me.iReq) return;   // đã đổi điều kiện, bỏ kết quả cũ
                me.bDaNap = true;
                if (data.Success) {
                    me.dtRut = data.Data || [];
                    me.chuanBi(me.dtRut);
                    me.apDungLoc(true);
                }
                else {
                    me.dtRut = [];
                    me.apDungLoc(true);
                    me.thongBao("e", obj_list.action + ": " + data.Message);
                }
            },
            error: function (er) {
                if (iReq !== me.iReq) return;
                me.thongBao("e", obj_list.action + " (lỗi kết nối" + ((er && er.status) ? " " + er.status : "") + ")");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    // Tính sẵn 1 lần cho mỗi dòng (khóa ngày, nhãn các ô lọc, số) để lọc nhiều lần không phải tính lại
    chuanBi: function (arr) {
        var me = this;
        arr.forEach(function (e) {
            e._k = me.parseNgay(e.NGAYRUT_DD_MM_YYYY);
            e._lb = {};
            me.arrLoc.forEach(function (f) { e._lb[f.id] = me.nhan(e, f.pre) || me.TRONG; });
            e._tien = me.toNum(e.SOTIENPHAINOP);
            e._tcp = me.toNum(e.SOTINCHI_TINHPHI);
            e._tch = me.toNum(e.SOTINCHI_HOCTAP);
            e._sv = String(e.QLSV_NGUOIHOC_ID || e.QLSV_NGUOIHOC_MASO || e.ID);
            e._hp = String(e.DAOTAO_HOCPHAN_ID || e.DAOTAO_HOCPHAN_MA || e.DAOTAO_HOCPHAN_TEN);
        });
    },

    /*------------------------------------------
    --Lọc trên dữ liệu đã nạp
    -------------------------------------------*/
    // Ô ngày "dd/mm/yyyy" -> 'yyyy-mm-dd'; rỗng, gõ dở hoặc ngày không có thật (vd 31/02) -> ''
    docNgay: function (id) {
        var m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec($("#" + id).val() || "");
        if (!m) return "";
        var d = new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10));
        if (d.getDate() !== parseInt(m[1], 10) || d.getMonth() !== parseInt(m[2], 10) - 1) return "";
        return this.key(d);
    },
    docLoc: function () {
        var obj = { tu: this.docNgay("dpRhpTuNgay"), den: this.docNgay("dpRhpDenNgay") };
        this.arrLoc.forEach(function (f) { obj[f.id] = $("#" + f.id).val() || ""; });
        return obj;
    },
    // Dòng có thỏa bộ lọc không (strBoQua = id ô lọc không tính, dùng khi dựng danh sách lựa chọn của chính ô đó)
    dat: function (e, objLoc, strBoQua) {
        for (var i = 0; i < this.arrLoc.length; i++) {
            var id = this.arrLoc[i].id;
            if (id !== strBoQua && objLoc[id] && e._lb[id] !== objLoc[id]) return false;
        }
        if (objLoc.tu && (!e._k || e._k < objLoc.tu)) return false;
        if (objLoc.den && (!e._k || e._k > objLoc.den)) return false;
        return true;
    },
    // Dựng lại danh sách lựa chọn của từng ô (facet). Trả true nếu có ô bị đưa về "Tất cả" vì giá trị cũ không còn
    taoOptionLoc: function () {
        var me = this;
        var objLoc = me.docLoc();
        var bDoi = false;
        me.arrLoc.forEach(function (f) {
            var objDem = {};
            me.dtRut.forEach(function (e) {
                if (me.dat(e, objLoc, f.id)) {
                    var lb = e._lb[f.id];
                    objDem[lb] = (objDem[lb] || 0) + 1;
                }
            });
            var arrKey = Object.keys(objDem).sort(function (a, b) {
                if (a === me.TRONG) return 1;
                if (b === me.TRONG) return -1;
                return a.localeCompare(b, "vi");
            });
            var strCur = objLoc[f.id];
            var html = '<option value="">' + f.all + '</option>';
            arrKey.forEach(function (k) {
                var strTen = (k === me.TRONG) ? "(Chưa có thông tin)" : k;
                html += '<option value="' + me.esc(k) + '">' + me.esc(strTen) + ' (' + objDem[k] + ')</option>';
            });
            if (strCur && objDem[strCur] === undefined) { strCur = ""; bDoi = true; }
            $("#" + f.id).html(html).val(strCur).trigger("change.select2");
        });
        return bDoi;
    },
    // Áp bộ lọc -> nhóm theo ngày -> vẽ lại. bVeDauTien = true sau khi nạp mới: mở tới ngày rút gần nhất
    apDungLoc: function (bVeDauTien) {
        var me = this;
        for (var i = 0; i < 4; i++) { if (!me.taoOptionLoc()) break; }   // lặp vì bỏ 1 lựa chọn có thể làm đổi lựa chọn các ô khác
        var objLoc = me.docLoc();
        me.strLocNgayCu = objLoc.tu + "|" + objLoc.den;
        me.dtLoc = me.dtRut.filter(function (e) { return me.dat(e, objLoc, null); });
        var objKhongNgay = $.extend({}, objLoc, { tu: "", den: "" });
        me.iKhongCoNgay = me.dtRut.filter(function (e) { return !e._k && me.dat(e, objKhongNgay, null); }).length;
        me.nhomTheoNgay(me.dtLoc);

        var arrKey = Object.keys(me.objTheoNgay).sort();
        if (arrKey.length > 0) {
            if (bVeDauTien) me.dNgayChon = me.parseKey(arrKey[arrKey.length - 1]);
            else if (!me.coDuLieuTuan()) me.dNgayChon = me.parseKey(me.ganNhat(arrKey));
        }
        else if (bVeDauTien) me.dNgayChon = me.dHomNay;
        me.iThang = me.dNgayChon.getMonth() + 1;
        me.iNam = me.dNgayChon.getFullYear();

        me.renderAll();
        me.renderKpi(arrKey);
        me.renderSoLoc(objLoc);
        $("#rhpBtnXuat").toggleClass("disabled", me.dtLoc.length === 0);
        me.capNhatThongBao();
    },
    xoaLoc: function () {
        var me = this;
        $("#dpRhpTuNgay, #dpRhpDenNgay").val("");
        me.arrLoc.forEach(function (f) { $("#" + f.id).val("").trigger("change.select2"); });
        // Từ khóa / hệ đào tạo là lọc tại máy chủ: chỉ nạp lại khi đang có giá trị
        var bCanNap = !!(edu.util.getValById("txtRhpTuKhoa").trim() || edu.util.getValById("dropSearch_HeDaoTao_Rut"));
        $("#txtRhpTuKhoa").val("");
        $("#dropSearch_HeDaoTao_Rut").val("").trigger("change.select2");
        if (bCanNap) me.getList_RutHocPhan();
        else me.apDungLoc(false);
    },
    nhomTheoNgay: function (arr) {
        var me = this;
        me.objTheoNgay = {};
        arr.forEach(function (e) {
            if (!e._k) return;
            if (!me.objTheoNgay[e._k]) me.objTheoNgay[e._k] = [];
            me.objTheoNgay[e._k].push(e);
        });
    },
    coDuLieuTuan: function () {
        var me = this;
        var dT2 = me.thuHai(me.dNgayChon);
        for (var i = 0; i < 7; i++) { if (me.objTheoNgay[me.key(me.addDays(dT2, i))]) return true; }
        return false;
    },
    // Ngày có dữ liệu gần nhất với ngày đang chọn
    ganNhat: function (arrKey) {
        var me = this;
        var iMin = Infinity, strKq = arrKey[0];
        arrKey.forEach(function (k) {
            var iCach = Math.abs(me.parseKey(k) - me.dNgayChon);
            if (iCach < iMin) { iMin = iCach; strKq = k; }
        });
        return strKq;
    },
    // Thông báo chung dưới thanh tiêu đề lịch (chỉ hiện khi cần chú ý)
    capNhatThongBao: function () {
        var me = this;
        if (!me.bDaNap) return;
        if (me.dtRut.length === 0) {
            me.thongBao("i", "Không có sinh viên rút học phần theo đợt / hệ đào tạo / từ khóa đã chọn.");
        }
        else if (me.dtLoc.length === 0) {
            var objLoc = me.docLoc();
            if (objLoc.tu && objLoc.den && objLoc.tu > objLoc.den) {
                me.thongBao("w", "\"Từ ngày rút\" đang lớn hơn \"Đến ngày rút\" nên không có kết quả. Hãy kiểm tra lại khoảng ngày.");
            }
            else me.thongBao("w", "Không có dữ liệu phù hợp với bộ lọc hiện tại. Bấm \"Xóa bộ lọc\" để xem lại toàn bộ.");
        }
        else if (me.iKhongCoNgay > 0) {
            me.thongBao("w", "Có " + me.fmtSo(me.iKhongCoNgay) + " lượt rút không có ngày rút nên không hiện trên lịch.");
        }
        else $("#rhpThongBao").empty();
    },

    /*------------------------------------------
    --Tóm tắt 1 nhóm dòng rút (1 ngày hoặc toàn bộ kết quả lọc)
    -------------------------------------------*/
    tomTat: function (arr) {
        var objSV = {}, objHP = {}, dTien = 0, dTCPhi = 0, dTCHT = 0;
        arr.forEach(function (e) {
            objSV[e._sv] = 1;
            if (!objHP[e._hp]) objHP[e._hp] = { ten: e.DAOTAO_HOCPHAN_TEN, ma: e.DAOTAO_HOCPHAN_MA, n: 0 };
            objHP[e._hp].n++;
            dTien += e._tien;
            dTCPhi += e._tcp;
            dTCHT += e._tch;
        });
        var arrHP = Object.keys(objHP).map(function (k) { return objHP[k]; });
        arrHP.sort(function (a, b) { return b.n - a.n; });
        return { iSV: Object.keys(objSV).length, iLuot: arr.length, iHP: arrHP.length, arrHP: arrHP, dTien: dTien, dTCPhi: dTCPhi, dTCHT: dTCHT };
    },

    /*------------------------------------------
    --Điều hướng lịch
    -------------------------------------------*/
    chonNgay: function (k) {
        var me = this;
        me.dNgayChon = me.parseKey(k);
        me.iThang = me.dNgayChon.getMonth() + 1;
        me.iNam = me.dNgayChon.getFullYear();
        me.renderAll();
    },
    chuyenTuan: function (n) {
        var me = this;
        me.dNgayChon = me.addDays(me.dNgayChon, 7 * n);
        me.iThang = me.dNgayChon.getMonth() + 1;
        me.iNam = me.dNgayChon.getFullYear();
        me.renderAll();
    },
    // Chỉ xem tháng khác trên lịch nhỏ (để dò các ngày có rút), KHÔNG đổi tuần đang chọn
    chuyenThang: function (n) {
        var me = this;
        me.iThang += n;
        if (me.iThang === 0) { me.iThang = 12; me.iNam--; }
        if (me.iThang === 13) { me.iThang = 1; me.iNam++; }
        me.renderThang();
    },

    /*------------------------------------------
    --Vẽ giao diện
    -------------------------------------------*/
    renderAll: function () {
        this.renderThang();
        this.renderTuan();
    },
    renderKpi: function (arrKey) {
        var me = this;
        var t = me.tomTat(me.dtLoc);
        function the(strIcon, strMau, strNen, strGiaTri, strNhan) {
            return '<div class="rhp-kpi" style="--c:' + strMau + ';--bg:' + strNen + '"><div class="ic"><i class="fa ' + strIcon + '"></i></div>' +
                '<div><div class="v">' + strGiaTri + '</div><div class="l">' + strNhan + '</div></div></div>';
        }
        var html = "";
        html += the("fa-list-alt", "#2f55a4", "#e8eefb", me.fmtSo(t.iLuot), "Lượt rút học phần");
        html += the("fa-users", "#16a34a", "#e7f6ec", me.fmtSo(t.iSV), "Sinh viên rút");
        html += the("fa-book", "#7c3aed", "#f0e9fe", me.fmtSo(t.iHP), "Học phần bị rút");
        html += the("fa-calendar-check-o", "#ec4c00", "#fdece3", me.fmtSo(arrKey.length), "Ngày có sinh viên rút");
        html += the("fa-money", "#dc2626", "#fde8e8", me.fmtTien(t.dTien), "Số tiền phải nộp (đ)");
        $("#rhpKpi").html(html);
        var strCap = "Kết quả theo bộ lọc: <b>" + me.fmtSo(me.dtLoc.length) + "</b> / " + me.fmtSo(me.dtRut.length) + " lượt rút";
        if (me.bDaNap) strCap += " - " + me.esc(me.tenDot());
        $("#rhpKpiCap").html(strCap);
    },
    // Số bộ lọc "trên dữ liệu đã nạp" đang bật
    renderSoLoc: function (objLoc) {
        var n = 0;
        if (objLoc.tu) n++;
        if (objLoc.den) n++;
        this.arrLoc.forEach(function (f) { if (objLoc[f.id]) n++; });
        $("#rhpSoLoc").text(n).toggle(n > 0);
    },
    renderThang: function () {
        var me = this;
        var y = me.iNam, m = me.iThang;
        $("#rhpNhanThang").text("Tháng " + m + " - " + y);
        var iPad = (new Date(y, m - 1, 1).getDay() + 6) % 7;
        var iDays = new Date(y, m, 0).getDate();
        var iCells = Math.ceil((iPad + iDays) / 7) * 7;
        var kHomNay = me.key(me.dHomNay);
        var kChon = me.key(me.dNgayChon);
        var dT2 = me.thuHai(me.dNgayChon);
        var kT2 = me.key(dT2), kCN = me.key(me.addDays(dT2, 6));
        var html = "";
        ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach(function (w) { html += '<div class="wd">' + w + '</div>'; });
        for (var c = 0; c < iCells; c++) {
            var d = new Date(y, m - 1, 1 - iPad + c);
            var k = me.key(d);
            var arr = me.objTheoNgay[k];
            var cls = "dd";
            if (d.getMonth() !== m - 1) cls += " other";
            if (arr) cls += " has";
            if (k === kHomNay) cls += " today";
            if (k === kChon) cls += " sel";
            if (k >= kT2 && k <= kCN) cls += " inweek";
            var strTitle = me.fmtDai(d) + (arr ? " - " + me.tomTat(arr).iSV + " sinh viên rút (" + arr.length + " lượt)" : "");
            html += '<div class="' + cls + '" data-ngay="' + k + '" title="' + me.esc(strTitle) + '"><span>' + d.getDate() + '</span></div>';
        }
        $("#rhpThang").html(html);
    },
    renderTuan: function () {
        var me = this;
        var dT2 = me.thuHai(me.dNgayChon);
        $("#rhpNhanTuan").text(me.fmt(dT2) + " - " + me.fmt(me.addDays(dT2, 6)));
        var kHomNay = me.key(me.dHomNay), kChon = me.key(me.dNgayChon);
        var html = "";
        for (var i = 0; i < 7; i++) {
            var d = me.addDays(dT2, i);
            var k = me.key(d);
            var cls = "rhp-day";
            if (k === kHomNay) cls += " is-today";
            if (k === kChon) cls += " is-sel";
            html += '<div class="' + cls + '" data-ngay="' + k + '">';
            html += '<div class="rhp-day-head"><div class="w">' + me.arrThu[i] + '</div><div class="d">' + me.fmt(d) + '</div></div>';
            if (me.objTheoNgay[k]) html += me.genCard(k, me.objTheoNgay[k]);
            html += '</div>';
        }
        $("#rhpTuan").html(html);
        // Màn hẹp: lưới cuộn ngang, đưa cột của ngày đang chọn vào giữa khung để không bị che mất cột có dữ liệu
        var elSc = $(".rhp-scroll-x")[0], elSel = $("#rhpTuan .rhp-day.is-sel")[0];
        if (elSc && elSel && elSc.scrollWidth > elSc.clientWidth) {
            var iViTri = elSel.getBoundingClientRect().left - elSc.getBoundingClientRect().left + elSc.scrollLeft;
            elSc.scrollLeft = iViTri - (elSc.clientWidth - elSel.offsetWidth) / 2;
        }
        else if (elSc) elSc.scrollLeft = 0;
    },
    // Thẻ tóm tắt của 1 ngày
    genCard: function (k, arr) {
        var me = this;
        var t = me.tomTat(arr);
        var html = '<div class="rhp-card" data-ngay="' + k + '" tabindex="0" role="button" title="Bấm để xem danh sách sinh viên rút ngày ' + me.fmt(me.parseKey(k)) + '">';
        html += '<div class="rhp-card-head">' + me.fmtSo(t.iSV) + ' sinh viên rút<small>' + me.fmtSo(t.iLuot) + ' lượt rút</small></div>';
        html += '<div class="rhp-card-body">';
        html += '<div class="rhp-kv"><span>Số học phần</span><b>' + me.fmtSo(t.iHP) + '</b></div>';
        html += '<div class="rhp-kv"><span>Tín chỉ tính phí</span><b>' + me.fmtNum(t.dTCPhi) + '</b></div>';
        html += '<div class="rhp-kv rhp-kv-big"><span>Số tiền phải nộp (đ)</span><b>' + me.fmtTien(t.dTien) + '</b></div>';
        html += '<div class="rhp-hp-cap">Rút nhiều nhất</div>';
        html += '<ul class="rhp-hp">';
        t.arrHP.slice(0, 3).forEach(function (h) {
            var strTen = me.esc(h.ten);
            html += '<li title="' + strTen + (h.ma ? ' (' + me.esc(h.ma) + ')' : '') + ' - ' + h.n + ' lượt"><span>' + strTen + '</span><b>' + h.n + '</b></li>';
        });
        html += '</ul>';
        if (t.arrHP.length > 3) html += '<div class="rhp-more">và ' + (t.arrHP.length - 3) + ' học phần khác</div>';
        html += '<div class="rhp-view">Xem chi tiết <i class="fa fa-angle-right"></i></div>';
        html += '</div></div>';
        return html;
    },

    /*------------------------------------------
    --Modal danh sách sinh viên rút của 1 ngày
    -------------------------------------------*/
    openChiTiet: function (k) {
        var me = this;
        var arr = me.objTheoNgay[k];
        if (!arr || arr.length === 0) return;
        me.strNgayModal = k;
        $("#rhpModalNgay").text(me.fmtDai(me.parseKey(k)));
        $("#rhpModalDot").text(me.tenDot());
        // Sắp theo mã sinh viên rồi mã học phần để các học phần của cùng 1 sinh viên nằm liền nhau
        me.dtModal = arr.slice().sort(function (a, b) {
            var x = String(a.QLSV_NGUOIHOC_MASO || ""), y = String(b.QLSV_NGUOIHOC_MASO || "");
            if (x !== y) return x < y ? -1 : 1;
            x = String(a.DAOTAO_HOCPHAN_MA || ""); y = String(b.DAOTAO_HOCPHAN_MA || "");
            return x < y ? -1 : (x > y ? 1 : 0);
        });
        $("#txtRhpModalTim").val("");
        me.renderChipLoc();
        me.renderModal();
        $("#modalRhpChiTiet").modal("show");
    },
    // Các điều kiện lọc đang áp dụng: [[tên, giá trị], ...] - dùng cho chip trong modal và dòng điều kiện trong file Excel
    layChipLoc: function () {
        var me = this;
        var arrChip = [];
        var strHe = edu.util.getValById("dropSearch_HeDaoTao_Rut");
        if (strHe) arrChip.push(["Hệ đào tạo", $("#dropSearch_HeDaoTao_Rut option:selected").text().trim()]);
        var strTuKhoa = edu.util.getValById("txtRhpTuKhoa").trim();
        if (strTuKhoa) arrChip.push(["Từ khóa", strTuKhoa]);
        var objLoc = me.docLoc();
        if (objLoc.tu) arrChip.push(["Từ ngày rút", me.fmt(me.parseKey(objLoc.tu))]);
        if (objLoc.den) arrChip.push(["Đến ngày rút", me.fmt(me.parseKey(objLoc.den))]);
        me.arrLoc.forEach(function (f) {
            if (objLoc[f.id]) arrChip.push([f.ten, objLoc[f.id] === me.TRONG ? "(Chưa có thông tin)" : objLoc[f.id]]);
        });
        return arrChip;
    },
    // Nhắc các bộ lọc đang áp dụng để người xem hiểu vì sao danh sách có thể ít hơn tổng của ngày
    renderChipLoc: function () {
        var me = this;
        var arrChip = me.layChipLoc();
        var html = "";
        if (arrChip.length > 0) {
            html += '<span style="color:#64748b;margin-right:6px">Đang lọc:</span>';
            arrChip.forEach(function (c) { html += '<span class="rhp-chip">' + me.esc(c[0]) + ': <b>' + me.esc(c[1]) + '</b></span>'; });
        }
        $("#rhpModalLoc").html(html).toggle(arrChip.length > 0);
    },
    renderModal: function () {
        var me = this;
        var strTim = me.chuanHoa($("#txtRhpModalTim").val()).trim();
        var arr = me.dtModal.filter(function (e) {
            if (!strTim) return true;
            if (e._hs === undefined) {
                e._hs = me.chuanHoa([e.QLSV_NGUOIHOC_MASO, e.QLSV_NGUOIHOC_HODEM, e.QLSV_NGUOIHOC_TEN, e.DAOTAO_HOCPHAN_TEN,
                    e.DAOTAO_HOCPHAN_MA, e.DSLOPHOCPHAN, e.DAOTAO_LOPQUANLY_TEN, e.NGUOIRUT_TAIKHOAN, e.GHICHU].join(" "));
            }
            return e._hs.indexOf(strTim) !== -1;
        });
        me.dtModalHienThi = arr;
        $("#rhpBtnXuatNgay").toggleClass("disabled", arr.length === 0);
        var t = me.tomTat(arr);
        var strTong = '<b>' + me.fmtSo(t.iSV) + '</b> sinh viên · <b>' + me.fmtSo(t.iLuot) + '</b> lượt rút · <b>' + me.fmtSo(t.iHP) + '</b> học phần';
        if (arr.length !== me.dtModal.length) strTong += ' <span style="color:#64748b">(hiển thị ' + me.fmtSo(arr.length) + '/' + me.fmtSo(me.dtModal.length) + ' lượt rút)</span>';
        $("#rhpModalTong").html(strTong);

        if (arr.length === 0) {
            $("#tblRhpChiTiet tbody").html('<tr><td colspan="16" class="rhp-trong">Không có dòng nào khớp với từ khóa tìm kiếm.</td></tr>');
            $("#tblRhpChiTiet tfoot").html("");
            return;
        }
        var html = "", strSVTruoc = null, iNhom = 0;
        arr.forEach(function (e, i) {
            var bDau = (e._sv !== strSVTruoc);
            if (bDau) { iNhom++; strSVTruoc = e._sv; }
            var strHoTen = (me.esc(e.QLSV_NGUOIHOC_HODEM) + " " + me.esc(e.QLSV_NGUOIHOC_TEN)).trim();
            var strTien = (e.SOTIENPHAINOP == null || String(e.SOTIENPHAINOP).trim() === "") ? me.hienGiaTri("") : me.fmtTien(e._tien);
            // Lớp học phần: nhiều lớp nối bằng dấu phẩy -> mỗi lớp 1 dòng cho dễ đọc
            var arrLop = String(e.DSLOPHOCPHAN == null ? "" : e.DSLOPHOCPHAN).split(/,(?=\S)/).filter(function (s) { return s.trim() !== ""; });
            var strLop = arrLop.length === 0 ? me.hienGiaTri("") : arrLop.map(function (s) { return '<div>' + me.esc(s.trim()) + '</div>'; }).join("");
            html += '<tr class="g' + (iNhom % 2) + (bDau ? ' first' : '') + '">';
            // Thứ tự cột phải khớp thead trong lichruthocphan.html: định danh -> học phần -> cột số -> thông tin phụ
            html += '<td class="c">' + (i + 1) + '</td>';
            html += '<td>' + me.hienGiaTri(e.QLSV_NGUOIHOC_MASO) + '</td>';
            html += '<td>' + (strHoTen || me.hienGiaTri("")) + '</td>';
            html += '<td>' + me.hienGiaTri(me.nhan(e, "DAOTAO_LOPQUANLY")) + '</td>';
            html += '<td class="w">' + me.hienGiaTri(me.nhan(e, "DAOTAO_HOCPHAN")) + '</td>';
            html += '<td class="w">' + strLop + '</td>';
            html += '<td class="r">' + me.hienGiaTri(e.SOTINCHI_HOCTAP) + '</td>';
            html += '<td class="r">' + me.hienGiaTri(e.SOTINCHI_TINHPHI) + '</td>';
            html += '<td class="c">' + me.hienGiaTri(e.PHANTRAMPHITINH) + '</td>';
            html += '<td class="r">' + strTien + '</td>';
            html += '<td class="w">' + me.hienGiaTri(me.nhan(e, "DAOTAO_CHUONGTRINH")) + '</td>';
            html += '<td>' + me.hienGiaTri(me.nhan(e, "DAOTAO_KHOADAOTAO")) + '</td>';
            html += '<td>' + me.hienGiaTri(me.nhan(e, "QLSV_TRANGTHAINGUOIHOC")) + '</td>';
            html += '<td>' + me.hienGiaTri(me.nhan(e, "KIEUHOC")) + '</td>';
            html += '<td>' + me.hienGiaTri(e.NGUOIRUT_TAIKHOAN) + '</td>';
            html += '<td class="w">' + me.hienGiaTri(e.GHICHU) + '</td>';
            html += '</tr>';
        });
        $("#tblRhpChiTiet tbody").html(html);
        // Dòng tổng cho các cột số (không cộng STT, không cộng %) - tính theo các dòng đang hiển thị
        $("#tblRhpChiTiet tfoot").html(
            '<tr class="rhp-sum-row"><td colspan="6" class="r">Tổng</td>' +
            '<td class="r">' + me.fmtNum(t.dTCHT) + '</td>' +
            '<td class="r">' + me.fmtNum(t.dTCPhi) + '</td>' +
            '<td></td>' +
            '<td class="r">' + me.fmtTien(t.dTien) + '</td>' +
            '<td colspan="6"></td></tr>'
        );
    }

    ,

    /*------------------------------------------
    --Xuất Excel: dùng chuẩn chung edu.exporter (Corei/exportexcel.js) - KHÔNG viết riêng.
    --  #rhpBtnXuat      = toàn bộ kết quả đang lọc (mọi ngày)
    --  #rhpBtnXuatNgay  = danh sách đang hiển thị trong modal (đúng ngày đó, kể cả ô tìm nhanh)
    --Hộp thoại của chuẩn chung có sẵn "lọc thêm khi xuất"; dữ liệu đã được lọc theo màn hình nên mặc định tích trống = tất cả.
    --indexi.aspx mới có edu.exporter; vỏ khác không có thì ẩn nút thay vì báo lỗi.
    -------------------------------------------*/
    initXuatExcel: function () {
        var me = this;
        if (typeof edu === "undefined" || !edu.exporter || typeof edu.exporter.bindButton !== "function") {
            $(".rhp-export").hide();
            return;
        }
        edu.exporter.bindButton("#rhpBtnXuat", function () { return me.optsXuat(false); });
        edu.exporter.bindButton("#rhpBtnXuatNgay", function () { return me.optsXuat(true); });
    },
    optsXuat: function (bTheoNgay) {
        var me = this;
        var arr = bTheoNgay ? me.dtModalHienThi : me.dtLoc;
        if (!arr || arr.length === 0) return null;   // nút đang khóa (không có dòng nào)
        var strNgay = bTheoNgay ? me.fmt(me.parseKey(me.strNgayModal)) : "";

        // Dòng điều kiện ghi dưới tiêu đề file: người đọc file biết dữ liệu được lấy với điều kiện nào
        var arrSub = ["Đợt đăng ký: " + me.tenDot()];
        if (bTheoNgay) arrSub.push("Ngày rút: " + me.fmtDai(me.parseKey(me.strNgayModal)));
        me.layChipLoc().forEach(function (c) { arrSub.push(c[0] + ": " + c[1]); });
        var strTim = bTheoNgay ? $("#txtRhpModalTim").val().trim() : "";
        if (strTim) arrSub.push('Tìm trong danh sách: "' + strTim + '"');

        // Toàn bộ kết quả: sắp theo ngày rút, rồi mã sinh viên, rồi mã học phần; theo ngày: giữ thứ tự modal
        var arrDuLieu = arr.slice();
        if (!bTheoNgay) {
            arrDuLieu.sort(function (a, b) {
                if (a._k !== b._k) {
                    if (!a._k) return 1;   // dòng không có ngày rút xếp cuối
                    if (!b._k) return -1;
                    return a._k < b._k ? -1 : 1;
                }
                var x = String(a.QLSV_NGUOIHOC_MASO || ""), y = String(b.QLSV_NGUOIHOC_MASO || "");
                if (x !== y) return x < y ? -1 : 1;
                x = String(a.DAOTAO_HOCPHAN_MA || ""); y = String(b.DAOTAO_HOCPHAN_MA || "");
                return x < y ? -1 : (x > y ? 1 : 0);
            });
        }
        function nhan(strPre) { return function (r) { return me.nhan(r, strPre); }; }
        var arrLoc = [
            { label: "Học phần", get: nhan("DAOTAO_HOCPHAN") },
            { label: "Lớp quản lý", get: nhan("DAOTAO_LOPQUANLY") },
            { label: "Khóa đào tạo", get: nhan("DAOTAO_KHOADAOTAO") },
            { label: "Trạng thái người học", get: nhan("QLSV_TRANGTHAINGUOIHOC") }
        ];
        if (!bTheoNgay) arrLoc.unshift({ label: "Ngày rút", get: function (r) { return r._k ? me.fmt(me.parseKey(r._k)) : ""; } });

        return {
            fileName: bTheoNgay ? "SinhVienRutHocPhan_Ngay" + strNgay.replace(/\//g, "") : "SinhVienRutHocPhan",
            title: "DANH SÁCH SINH VIÊN RÚT HỌC PHẦN" + (bTheoNgay ? " NGÀY " + strNgay : ""),
            subTitles: arrSub,
            name: "Rút học phần",
            data: arrDuLieu,
            filters: arrLoc,
            // Cột khớp thứ tự trên modal; mã và tên học phần tách 2 cột để lọc/tra cứu trong Excel; chỉ cột số mới ghi số (mã SV luôn là chữ)
            columns: [
                { header: "Ngày rút", field: "NGAYRUT_DD_MM_YYYY", align: "center" },
                { header: "Mã sinh viên", field: "QLSV_NGUOIHOC_MASO" },
                { header: "Họ và tên", render: function (r) { return ((r.QLSV_NGUOIHOC_HODEM == null ? "" : r.QLSV_NGUOIHOC_HODEM) + " " + (r.QLSV_NGUOIHOC_TEN == null ? "" : r.QLSV_NGUOIHOC_TEN)).trim(); } },
                { header: "Lớp quản lý", render: nhan("DAOTAO_LOPQUANLY") },
                { header: "Mã học phần", field: "DAOTAO_HOCPHAN_MA" },
                { header: "Tên học phần", field: "DAOTAO_HOCPHAN_TEN" },
                { header: "Lớp học phần", field: "DSLOPHOCPHAN" },
                { header: "Số tín chỉ học tập", field: "SOTINCHI_HOCTAP", type: "number", sum: true },
                { header: "Số tín chỉ tính phí", field: "SOTINCHI_TINHPHI", type: "number", sum: true },
                { header: "Tỷ lệ tính phí (%)", field: "PHANTRAMPHITINH", type: "number" },
                { header: "Số tiền phải nộp (đ)", field: "SOTIENPHAINOP", type: "number", format: "int", sum: true },
                { header: "Chương trình đào tạo", render: nhan("DAOTAO_CHUONGTRINH") },
                { header: "Khóa đào tạo", render: nhan("DAOTAO_KHOADAOTAO") },
                { header: "Trạng thái người học", render: nhan("QLSV_TRANGTHAINGUOIHOC") },
                { header: "Kiểu học", render: nhan("KIEUHOC") },
                { header: "Người thực hiện rút", field: "NGUOIRUT_TAIKHOAN" },
                { header: "Ghi chú", field: "GHICHU" }
            ]
        };
    }
};
