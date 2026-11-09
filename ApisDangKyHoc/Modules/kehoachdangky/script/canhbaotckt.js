/*----------------------------------------------
--Trang: Gửi cảnh báo thay đổi đăng ký / rút học phần cho Phòng TC-KT (ApisDangKyHoc / kehoachdangky)
--Yêu cầu của Nhà trường (09/11/2026): Phòng TC-KT cần được báo khi có thay đổi đăng ký/rút học phần của sinh viên NGOÀI thời gian
--  đăng ký/rút chính thức của từng đợt, để chủ động kiểm tra trước khi làm học phí, hóa đơn, thuế.
--Cách làm: 1 trang riêng (không gắn vào từng nút đăng ký/rút):
--  [1] Tab "Thay đổi cần gửi": nạp thay đổi từ lịch sử đăng ký hoặc danh sách rút học phần, gợi ý trong/ngoài đợt chính thức,
--      tick chọn rồi "Gửi cho TC-KT" -> với mỗi thay đổi gọi CMS_TienIch/ThucHienGuiEmailTheoCauTruc (mã mẫu MA_MAU, strDuLieuId = Id thay đổi)
--      qua form tiến trình dùng chung edu.process (Corei/processrun.js).
--  [2] "Mẫu email": nội dung + người nhận do Phòng tự chỉnh (CMS_TienIch/Them|Sua_CauTrucNoiDungGuiEmail, mã MA_MAU).
--  [3] Tab "Lịch sử đã gửi": CMS_TienIch/LayDS_TienTrinhGuiEmail lọc theo mẫu; gửi lại bằng CMS_TienIch/ThucHienGuiEmail (GUILAI).
--API đọc dữ liệu (nguồn dữ liệu = ô "Nguồn"):
--  DOCANBO  pkg_dangkyhoc_thongtin2.LayDSDangKyHocDoCanBo  (đăng ký do CÁN BỘ thực hiện; hàm chuẩn của màn Lớp học phần, có NGAYTAO_DD_MM_YYYY_HHMMSS + NGUOITAO_TAIKHOAN)
--  DANGKY   pkg_dangkyhoc_thongtin2.LayDSDangKyHoc         (mọi đăng ký; cùng các cột như trên)
--           -> cả 2 lọc theo đợt (strDaoTao_ThoiGianDaoTao_Id) + kế hoạch (strDangKy_KeHoachDangKy_Id): chọn kế hoạch thì gợi ý so ĐÚNG kế hoạch đó, không chọn thì so với mọi kế hoạch
--  RUT      DKH_RutHocPhan/LayDSThoiGianRut + LayDSRut      (rút học phần; dòng có DANGKY_KEHOACHDANGKY_ID -> so đúng kế hoạch)
--  ẨN (09/11/2026) LICHSU: DKH_XuLy/LayKetQuaLichSuDangKyHoc — hàm này đã bị xóa dưới DB nên nguồn "Đăng ký/hủy/đổi lịch" tạm ẩn (code còn, đã comment).
--  CHƯA CÓ danh sách HỦY đăng ký / ĐỔI lịch (chỉ hàm lịch sử cũ có) — cần BE cấp hàm mới.
--  DKH_KeHoachDangKy/LayDanhSach      (thời gian đăng ký/rút chính thức của từng kế hoạch)
--Giả định chưa xác nhận với máy chủ: (a) dòng đăng ký/rút có trường ID; (b) cửa sổ rút = NGAYBATDAUTINHRUTHOCPHAN đến hết ngày
--  thứ +SONGAYDUOCPHEPRUTHOCPHAN; (c) máy chủ tra nội dung email của mã mẫu mới từ strDuLieuId = ID dòng thay đổi.
----------------------------------------------*/
function CanhBaoTCKT() { };
CanhBaoTCKT.prototype = {
    MA_MAU: 'DKH_CANHBAO_THAYDOI_NGOAIDOT',
    dtThayDoiAll: [],   // dòng đã chuẩn hóa của trang đang xem (trước khi lọc ở trình duyệt)
    dtThayDoi: [],      // dòng đang hiển thị
    dtLichSuGui: [],
    dtKeHoach: [],
    arrCuaSo: [],       // cửa sổ thời gian đã tính của từng kế hoạch
    objMau: null,       // mẫu email hiện có (null = chưa có)
    bMauDaNap: false,   // đã hỏi máy chủ về mẫu (phân biệt "chưa nạp" với "chưa có mẫu")
    bKeHoachDaNap: false,
    objDaGui: {},       // { ID: timestamp } các thay đổi đã gửi từ máy này (chỉ để nhắc, sự thật nằm ở tab Lịch sử)
    iPager: 0,
    iReq: 0,
    iReqLS: 0,
    iPage_paneThayDoi: 1,
    iPage_paneLichSu: 1,
    objChon: {},        // { ID: dòng } các dòng đang được tick — giữ qua các trang (kể cả khi đổi trang)
    mapTrang: {},       // { ID: dòng } các dòng đang hiện ở trang bảng hiện tại
    mapCuaSo: {},       // { id kế hoạch (chữ thường): cửa sổ thời gian }
    arrLoiPhu: [],      // lỗi của các API phụ (kế hoạch, đợt rút): [{ a: action, m: mô tả }] — hiện ở dải chẩn đoán
    strNguonDuLieu: "LICHSU",   // nguồn mà bộ dữ liệu đang hiển thị thuộc về (không đọc lại từ ô chọn để khỏi lệch khi đổi nguồn giữa chừng)
    bDangKiemTra: false,        // đang kiểm tra trước khi gửi (chống bấm đúp)
    bPhanTrangTrinhDuyet: false,   // true = nguồn rút: máy chủ trả cả đợt một lần nên cắt trang ngay ở trình duyệt

    init: function () {
        var me = this;
        edu.system.page_load();
        me.docDaGui();
        $("#lblMau_Ma").text(me.MA_MAU);
        me.taoEditor();

        $("#dropNguon").on("change", function () { me.doiNguon(); });
        $("#btnSearch_ThayDoi").click(function () { me.getList_ThayDoi(true); });
        $("#txtTuKhoa").keypress(function (e) {
            if (e.which === 13) me.getList_ThayDoi(true);
        });
        // lọc ở trình duyệt: không cần hỏi lại máy chủ
        $("#chkAnTrongDot").on("change", function () { me.locLai(); });
        $("#txtTuNgay, #txtDenNgay").on("change changeDate", function () { me.locLai(); });
        // ô tick ở đầu bảng = chọn cả TRANG đang xem; "Chọn tất cả ... dòng đã lọc" ở thanh phía trên = chọn mọi trang
        $("#chkSelectAll_ThayDoi").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThayDoi" });
            me.dongBoChon();
        });
        $("#tblThayDoi").delegate("input[id^=checkX]", "change", function () { me.dongBoChon(); });
        $("#lnkChonTatCa").click(function () { me.chonTatCaDaLoc(); });
        $("#lnkBoChon").click(function () { me.boChonTatCa(); });

        $(".cb-tab").click(function () { me.chonTab($(this).attr("data-pane")); });
        $("#btnGuiTCKT").click(function () { me.guiTCKT(); });
        $("#btnGuiLai").click(function () { me.guiLai(); });

        $("#btnSearch_LichSu").click(function () { me.getList_LichSuGui(true); });
        $("#txtLS_TuKhoa").keypress(function (e) {
            if (e.which === 13) me.getList_LichSuGui(true);
        });
        $("#chkSelectAll_LichSu").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLichSuGui" });
        });
        $("#tblLichSuGui").delegate(".btnXem", "click", function () { me.xemChiTiet(this.id); });
        $(".btnCloseChiTiet").click(function () { edu.util.toggle_overide("zone-bus", "zonebatdau"); });

        $("#btnMauEmail").click(function () { me.moMau(); });
        $(".btnCloseMau").click(function () { edu.util.toggle_overide("zone-bus", "zonebatdau"); });
        $("#btnSaveMau").click(function () { me.saveMau(); });

        me.getMau();
        me.getList_KeHoach();
        me.getList_DotRut();
        me.khoiPhucNguon();
        me.doiNguon();
    },

    /*------------------------------------------
    --Tiện ích
    -------------------------------------------*/
    v: function (x) { return (x === null || x === undefined) ? "" : String(x); },
    esc: function (x) {
        return this.v(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    pad2: function (n) { return (n < 10 ? "0" : "") + n; },
    fmtThoiDiem: function (ms) {
        var d = new Date(ms);
        return this.pad2(d.getDate()) + "/" + this.pad2(d.getMonth() + 1) + "/" + d.getFullYear() + " " + this.pad2(d.getHours()) + ":" + this.pad2(d.getMinutes());
    },
    // Chữ thuần của 1 đoạn HTML do máy chủ trả về — dùng DOMParser (tài liệu rỗng, không chạy script, không tải ảnh)
    htmlToText: function (strHtml) {
        try {
            var doc = new DOMParser().parseFromString(this.v(strHtml), "text/html");
            return (doc.body && doc.body.textContent) ? doc.body.textContent.replace(/\s+\n/g, "\n").trim() : "";
        } catch (ex) { return this.v(strHtml).replace(/<[^>]*>/g, " "); }
    },
    // Thông báo ngay trong trang (loai: i | w | e | s). Không dùng edu.system.alert để khỏi chồng modal.
    thongBao: function (strLoai, strNoiDung, strZone) {
        var $z = $(strZone || "#cbThongBao");
        if (!strNoiDung) { $z.empty(); return; }
        var strIcon = { i: "fa-info-circle", w: "fa-exclamation-triangle", e: "fa-times-circle", s: "fa-check-circle" }[strLoai] || "fa-info-circle";
        var $b = $('<div class="cb-banner ' + (strLoai === "i" ? "" : strLoai) + '"></div>');
        $b.append($('<i class="fa ' + strIcon + '"></i>')).append(document.createTextNode(strNoiDung));
        $z.empty().append($b);
    },
    // Nguồn hợp lệ: DOCANBO (mặc định) | DANGKY | RUT. (LICHSU đã ẩn vì hàm máy chủ đã bị xóa — giá trị lạ/cũ quy về DOCANBO)
    layNguon: function () {
        var s = edu.util.getValById("dropNguon");
        return (s === "RUT" || s === "DANGKY") ? s : "DOCANBO";
    },
    // Cảnh báo CHẶN thao tác: hiện hộp thoại (người dùng đang cuộn xuống giữa bảng dài sẽ không thấy banner ở đầu trang) + banner + cuộn tới banner
    canhBao: function (strNoiDung) {
        var me = this;
        me.thongBao("w", me.v(strNoiDung).replace(/\n/g, "  "));
        // luôn gói trong thẻ để hộp thoại chung hiểu là HTML (chuỗi 1 dòng không thẻ sẽ bị hiện nguyên "&quot;")
        try { edu.system.alert("<span>" + me.esc(strNoiDung).replace(/\n/g, "<br/>") + "</span>", "w"); } catch (ex) { }
        try { var el = document.getElementById("cbThongBao"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" }); } catch (ex2) { }
    },
    // Mô tả lỗi từ jqXHR: "lỗi 400 (nội dung máy chủ trả về)" — nội dung cắt ngắn, bỏ thẻ HTML
    moTaLoi: function (er) {
        var iMa = (er && er.status) ? er.status : 0;
        var strBody = "";
        try {
            if (er && er.responseJSON && er.responseJSON.Message) strBody = String(er.responseJSON.Message);
            else if (er && er.responseText) strBody = String(er.responseText).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        } catch (ex) { }
        if (strBody.length > 200) strBody = strBody.substring(0, 200) + "...";
        return (iMa ? "lỗi " + iMa : "mất kết nối") + (strBody ? " (" + strBody + ")" : "");
    },
    // Ghi/xóa lỗi của 1 API phụ rồi vẽ lại dải chẩn đoán (strMoTa rỗng = đã hết lỗi)
    ghiLoiPhu: function (strAction, strMoTa) {
        this.arrLoiPhu = this.arrLoiPhu.filter(function (x) { return x.a !== strAction; });
        if (strMoTa) this.arrLoiPhu.push({ a: strAction, m: strMoTa });
        this.capNhatGoiY();
    },
    // Dải chẩn đoán dưới thông báo chính: API phụ lỗi + lý do khi TOÀN BỘ dòng đang nạp đều "Chưa xác định"
    capNhatGoiY: function () {
        var me = this;
        var arr = me.arrLoiPhu.map(function (x) { return x.a + " — " + x.m; });
        if (me.bKeHoachDaNap && me.dtThayDoiAll.length > 0) {
            var objDem = {}, iKxd = 0, strTop = "", iTop = 0;
            me.dtThayDoiAll.forEach(function (r) {
                if (r.DG && r.DG.k === "KXD") {
                    iKxd++;
                    objDem[r.DG.ly] = (objDem[r.DG.ly] || 0) + 1;
                    if (objDem[r.DG.ly] > iTop) { iTop = objDem[r.DG.ly]; strTop = r.DG.ly; }
                }
            });
            if (iKxd === me.dtThayDoiAll.length) arr.push("Cột \"Đợt chính thức\": cả " + iKxd + " dòng chưa xác định được — " + strTop);
        }
        me.thongBao("w", arr.join(" | "), "#cbThongBaoPhu");
    },
    // Mở lại trang thì giữ nguồn lần trước
    khoiPhucNguon: function () {
        try {
            var s = window.localStorage.getItem("cbtckt_nguon_" + edu.system.userId);
            if (s === "RUT" || s === "DANGKY" || s === "DOCANBO") $("#dropNguon").val(s).trigger("change.select2");
        } catch (ex) { }
    },
    docDaGui: function () {
        var me = this;
        try {
            var s = window.localStorage.getItem("cbtckt_dagui_" + edu.system.userId);
            me.objDaGui = s ? JSON.parse(s) : {};
        } catch (ex) { me.objDaGui = {}; }
    },
    luuDaGui: function () {
        try { window.localStorage.setItem("cbtckt_dagui_" + edu.system.userId, JSON.stringify(this.objDaGui)); } catch (ex) { }
    },

    /*------------------------------------------
    --Tab
    -------------------------------------------*/
    chonTab: function (strPane) {
        var me = this;
        var bLichSu = (strPane === "paneLichSu");
        $(".cb-tab").removeClass("on").filter("[data-pane=" + strPane + "]").addClass("on");
        $(".cb-pane").hide();
        $("#" + strPane).show();
        $("#btnGuiTCKT").toggle(!bLichSu);
        $("#btnGuiLai").toggle(bLichSu);
        me.thongBao();
        me.nhacMau();
        // mỗi tab nhớ trang đang xem của riêng nó (2 bảng dùng chung pageIndex_default của hệ thống)
        edu.system.pageIndex_default = me["iPage_" + strPane] || 1;
        if (bLichSu) me.getList_LichSuGui();
    },

    /*------------------------------------------
    --[1] Thay đổi cần gửi
    -------------------------------------------*/
    doiNguon: function () {
        var me = this;
        var bRut = (me.layNguon() === "RUT");
        $(".cb-f-kehoach").toggle(!bRut);   // nguồn rút có Id kế hoạch riêng từng dòng nên không cần ô chọn kế hoạch
        me.dtThayDoiAll = [];
        me.iPager = 0;
        me.strNguonDuLieu = me.layNguon();
        me.objChon = {};
        me.iPage_paneThayDoi = 1;
        edu.system.pageIndex_default = 1;
        try { window.localStorage.setItem("cbtckt_nguon_" + edu.system.userId, me.layNguon()); } catch (ex) { }
        me.getList_ThayDoi(true);
    },
    getList_ThayDoi: function (bReset) {
        var me = this;
        if (bReset) { edu.system.pageIndex_default = 1; me.objChon = {}; }
        else me.dongBoChon();   // đổi trang máy chủ: nhớ các dòng đã tick ở trang cũ
        var strNguon = me.layNguon();
        me.strNguonDuLieu = strNguon;
        var obj_list = me.taoYeuCau(strNguon);
        var iReq = ++me.iReq;
        var iLanThu = 0;
        me.thongBao("i", "Đang tải dữ liệu...");
        // trong lúc chờ không để bảng hiện "Không tìm thấy dữ liệu!" (dễ hiểu nhầm là không có dữ liệu)
        $("#tblThayDoi tbody").html('<tr><td colspan="13" class="td-center">Đang tải dữ liệu...</td></tr>');
        var thu = function () {
            iLanThu++;
            edu.system.makeRequest({
                success: function (data) {
                    if (iReq !== me.iReq) return;   // đã đổi nguồn/tìm lại, bỏ kết quả cũ
                    if (data.Success) {
                        var dt = data.Data || [];
                        me.iPager = parseInt(data.Pager, 10);
                        if (isNaN(me.iPager)) me.iPager = dt.length;
                        if (strNguon !== "RUT") me.iPage_paneThayDoi = edu.system.pageIndex_default;
                        // đợt/kế hoạch đang chọn chỉ tra 1 lần cho cả bộ dữ liệu (không tra bằng jQuery từng dòng — có thể hàng nghìn dòng)
                        var objNguCanh = me.taoNguCanh();
                        me.dtThayDoiAll = dt.map(function (r) { return me.chuanHoa(strNguon, r, objNguCanh); });
                        me.tinhDanhGiaTatCa();
                        me.thongBao();
                        var iKhongId = me.dtThayDoiAll.filter(function (r) { return !r.ID; }).length;
                        if (iKhongId > 0) me.thongBao("w", iKhongId + " dòng không có ID từ máy chủ nên không thể chọn để gửi.");
                        else me.nhacMau();
                        me.renderThayDoi();
                    }
                    else {
                        me.dtThayDoiAll = [];
                        me.renderThayDoi();
                        me.thongBao("e", obj_list.action + ": " + data.Message);
                    }
                },
                error: function (er) {
                    if (iReq !== me.iReq) return;
                    var iMa = (er && er.status) ? er.status : 0;
                    // 404/502/503/504 hoặc mất kết nối có thể chỉ là 1 máy chủ trong cụm chưa sẵn sàng: thử lại 1 lần trước khi báo lỗi
                    if (iLanThu === 1 && (iMa === 0 || iMa === 404 || iMa === 502 || iMa === 503 || iMa === 504)) {
                        me.thongBao("i", "Máy chủ chưa phản hồi" + (iMa ? " (" + iMa + ")" : "") + ", đang thử lại...");
                        setTimeout(function () { if (iReq === me.iReq) thu(); }, 700);
                        return;
                    }
                    me.dtThayDoiAll = [];
                    me.renderThayDoi();
                    me.thongBao("e", obj_list.action + " — " + me.moTaLoi(er)
                        + (iMa === 404 ? ": máy chủ không tìm thấy API này (chưa triển khai hoặc đang bảo trì)." : ".")
                        + " Bấm Tìm kiếm để thử lại; nếu vẫn lỗi hãy báo bộ phận kỹ thuật.");
                },
                type: obj_list.iM ? 'POST' : 'GET',
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        };
        thu();
    },
    // Tham số gọi API theo nguồn. Hai nguồn đăng ký dùng ĐÚNG hàm chuẩn của màn Lớp học phần (kehoachdangky/lophocphan.js: tên hàm mã hóa + iM)
    taoYeuCau: function (strNguon) {
        var me = this;
        if (strNguon === "RUT") {
            return {
                'action': 'DKH_RutHocPhan/LayDSRut',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtTuKhoa'),
                'strDaoTao_ThoiGianDaoTao_Id': me.v(edu.util.getValById('dropSearch_DotRut')),
                'strDaoTao_HeDaoTao_Id': '',
                'strNguoiThucHien_Id': edu.system.userId,
            };
        }
        var bCanBo = (strNguon === "DOCANBO");
        var obj = {
            'action': bCanBo ? 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu' : 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP',
            'func': bCanBo ? 'PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo' : 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtTuKhoa'),
            'strDaoTao_ThoiGianDaoTao_Id': me.v(edu.util.getValById('dropSearch_DotRut')),
            'strDaoTao_HocPhan_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTKB_HinhThucHoc_Id': '',
            'strDangKy_KeHoachDangKy_Id': me.v(edu.util.getValById('dropSearch_KeHoach')),
            'dChiLayCacLopChuaPhanCong': 0,
            'strDaoTao_KhoaDaoTao_Id': '',
            'strDaoTao_ChuongTrinh_Id': '',
            'strDaoTao_HeDaoTao_Id': '',
            'strDaoTao_KhoaQuanLy_Id': '',
            'dSoDaDangTuSo': -1,
            'dSoDaDangDenSo': -1,
            'strKieuHoc_Id': '',
        };
        if (!bCanBo) obj['strHanhDong_XacNhan_Id'] = '';
        /* ẨN 09/11/2026 — nguồn LICHSU (hàm DKH_XuLy/LayKetQuaLichSuDangKyHoc đã bị xóa dưới DB, sếp xác nhận). Mở lại nếu BE có hàm lịch sử mới:
        return {
            'action': 'DKH_XuLy/LayKetQuaLichSuDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtTuKhoa'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strKy': edu.util.getValById('txtSearch_Ky'),
            'strDot': edu.util.getValById('txtSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        */
        return obj;
    },
    // Đợt/kế hoạch đang chọn (đọc 1 lần cho cả bộ dữ liệu vừa nạp)
    taoNguCanh: function () {
        return {
            strDot: edu.util.getValById("dropSearch_DotRut") ? $("#dropSearch_DotRut option:selected").text().trim() : "",
            strKeHoach_Id: edu.util.getValById("dropSearch_KeHoach")
        };
    },
    chuanHoa: function (strNguon, r, objNguCanh) {
        return strNguon === "RUT" ? this.chuanHoaRut(r, objNguCanh.strDot) : this.chuanHoaDangKy(r, strNguon, objNguCanh);
    },
    // Dòng của LayDSDangKyHoc / LayDSDangKyHocDoCanBo (các cột như bảng "Chi tiết đăng ký" của màn Lớp học phần)
    chuanHoaDangKy: function (r, strNguon, objNguCanh) {
        var me = this;
        return {
            ID: me.v(r.ID), NGUON: strNguon,
            MASO: me.v(r.QLSV_NGUOIHOC_MASO),
            HOTEN: (me.v(r.QLSV_NGUOIHOC_HODEM) + " " + me.v(r.QLSV_NGUOIHOC_TEN)).trim(),
            KY: objNguCanh.strDot,
            HOCPHAN: me.v(r.DAOTAO_HOCPHAN_TEN) + (r.DAOTAO_HOCPHAN_MA ? " (" + r.DAOTAO_HOCPHAN_MA + ")" : ""),
            LOP: me.v(r.DANGKY_LOPHOCPHAN_TEN) || me.v(r.DANGKY_LOPHOCPHAN_MA),
            THOIDIEM: me.v(r.NGAYTAO_DD_MM_YYYY_HHMMSS),
            NGUOI: me.v(r.NGUOITAO_TAIKHOAN),
            HANHDONG: strNguon === "DOCANBO" ? "Đăng ký (cán bộ)" : "Đăng ký",
            KETQUA: me.v(r.HANHDONG_XACNHAN_TEN),
            // đã chọn kế hoạch thì máy chủ lọc đúng kế hoạch đó -> so khớp chính xác; không chọn thì dùng Id trong dòng (nếu có)
            PLAN_ID: objNguCanh.strKeHoach_Id || me.v(r.DANGKY_KEHOACHDANGKY_ID)
        };
    },
    /* ẨN 09/11/2026 — chuẩn hóa dòng của nguồn LICHSU (hàm máy chủ đã bị xóa)
    chuanHoaLichSu: function (r) {
        var me = this;
        var strKy = me.v(r.NAMHOC);
        if (r.HOCKY) strKy += "_" + r.HOCKY;
        if (r.DOTHOC) strKy += "_" + r.DOTHOC;
        return {
            ID: me.v(r.ID), NGUON: "LICHSU",
            MASO: me.v(r.QLSV_NGUOIHOC_MASO),
            HOTEN: (me.v(r.QLSV_NGUOIHOC_HODEM) + " " + me.v(r.QLSV_NGUOIHOC_TEN)).trim(),
            KY: strKy,
            HOCPHAN: me.v(r.DAOTAO_HOCPHAN_TEN),
            LOP: me.v(r.THONGTINLOPHOCPHAN),
            THOIDIEM: me.v(r.NGAYTAO_DD_MM_YYYY_HHMMSS),
            NGUOI: me.v(r.NGUOITHUCHIEN_TAIKHOAN),
            HANHDONG: me.v(r.HANHDONG),
            KETQUA: me.v(r.ERR),
            PLAN_ID: me.v(r.DANGKY_KEHOACHDANGKY_ID)
        };
    },
    */
    chuanHoaRut: function (r, strDot) {
        var me = this;
        return {
            ID: me.v(r.ID), NGUON: "RUT",
            MASO: me.v(r.QLSV_NGUOIHOC_MASO),
            HOTEN: (me.v(r.QLSV_NGUOIHOC_HODEM) + " " + me.v(r.QLSV_NGUOIHOC_TEN)).trim(),
            KY: strDot,
            HOCPHAN: me.v(r.DAOTAO_HOCPHAN_TEN) + (r.DAOTAO_HOCPHAN_MA ? " (" + r.DAOTAO_HOCPHAN_MA + ")" : ""),
            LOP: me.v(r.DSLOPHOCPHAN),
            THOIDIEM: me.v(r.NGAYRUT_DD_MM_YYYY),
            NGUOI: me.v(r.NGUOIRUT_TAIKHOAN),
            HANHDONG: "Rút học phần",
            KETQUA: "",
            PLAN_ID: me.v(r.DANGKY_KEHOACHDANGKY_ID)
        };
    },

    /*------------------------------------------
    --Gợi ý trong/ngoài đợt chính thức (chỉ để tham khảo, không chặn việc gửi)
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': '',
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKeHoach = data.Data || [];
                    me.arrCuaSo = me.dtKeHoach.map(function (kh) { return me.tinhCuaSo(kh); });
                    me.mapCuaSo = {};
                    me.arrCuaSo.forEach(function (c) { if (c.id) me.mapCuaSo[c.id] = c; });
                    me.bKeHoachDaNap = true;
                    me.ghiLoiPhu(obj_list.action, "");
                    edu.system.loadToCombo_data({
                        data: me.dtKeHoach,
                        renderInfor: { id: "ID", parentId: "", name: "TENKEHOACH", code: "MAKEHOACH" },
                        renderPlace: ["dropSearch_KeHoach"],
                        title: "Tất cả kế hoạch"
                    });
                    if (me.dtThayDoiAll.length > 0) { me.tinhDanhGiaTatCa(); me.renderThayDoi(); }
                }
                else {
                    me.ghiLoiPhu(obj_list.action, "máy chủ báo: " + data.Message);
                }
            },
            error: function (er) { me.ghiLoiPhu(obj_list.action, me.moTaLoi(er)); },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DotRut: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_RutHocPhan/LayDSThoiGianRut',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data || [],
                        renderInfor: { id: "ID", parentId: "", name: "THOIGIAN" },
                        renderPlace: ["dropSearch_DotRut"],
                        title: "Tất cả đợt"
                    });
                    me.ghiLoiPhu(obj_list.action, "");
                }
                else {
                    me.ghiLoiPhu(obj_list.action, "máy chủ báo: " + data.Message);
                }
            },
            error: function (er) { me.ghiLoiPhu(obj_list.action, me.moTaLoi(er)); },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    // Nhắc cố định (không bị "Đang tải..." xóa mất): chưa có mẫu email thì chưa gửi được
    nhacMau: function () {
        var me = this;
        if (me.bMauDaNap && !me.objMau) {
            me.thongBao("w", "Chưa có mẫu email " + me.MA_MAU + ". Bấm \"Mẫu email\" để tạo mẫu (nội dung + người nhận) trước khi gửi.");
        }
    },
    // Chấp nhận 'yyyymmdd', 'dd/MM/yyyy[ ...]', 'yyyy-MM-dd[...]'; không đọc được -> null
    parseNgay: function (x) {
        var s = this.v(x).trim();
        var m = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
        if (m) return { y: +m[1], m: +m[2], d: +m[3] };
        m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s);
        if (m) return { y: +m[3], m: +m[2], d: +m[1] };
        m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
        if (m) return { y: +m[1], m: +m[2], d: +m[3] };
        return null;
    },
    toDate: function (ngay, gio, phut, iGioMacDinh, iPhutMacDinh) {
        var p = this.parseNgay(ngay);
        if (!p) return null;
        var g = parseInt(gio, 10), ph = parseInt(phut, 10);
        if (isNaN(g)) { g = iGioMacDinh; if (isNaN(ph)) ph = iPhutMacDinh; }
        else if (isNaN(ph)) ph = 0;
        return new Date(p.y, p.m - 1, p.d, g, ph, 0);
    },
    tinhCuaSo: function (kh) {
        var me = this;
        var pick = function (a, b) { return (a !== null && a !== undefined && a !== "") ? a : b; };
        var bd = me.toDate(kh.NGAYBATDAU, pick(kh.GIODANGKYTRONGNGAYDAU, kh.NGAYBATDAU_GIO), pick(kh.PHUTDANGKYTRONGNGAYDAU, kh.NGAYBATDAU_PHUT), 0, 0);
        var kt = me.toDate(kh.NGAYKETTHUC, pick(kh.GIOKETTHUCTRONGNGAYCUOI, kh.NGAYKETTHUC_GIO), pick(kh.PHUTKETTHUCTRONGNGAYCUOI, kh.NGAYKETTHUC_PHUT), 23, 59);
        if (kt) kt.setSeconds(59);   // hết phút kết thúc
        var bdRut = me.toDate(kh.NGAYBATDAUTINHRUTHOCPHAN, null, null, 0, 0);
        var iNgay = parseInt(kh.SONGAYDUOCPHEPRUTHOCPHAN, 10);
        var ktRut = (bdRut && !isNaN(iNgay) && iNgay > 0) ? new Date(bdRut.getFullYear(), bdRut.getMonth(), bdRut.getDate() + iNgay, 23, 59, 59) : null;
        return { id: me.v(kh.ID).toLowerCase(), bd: bd, kt: kt, bdRut: bdRut, ktRut: ktRut };
    },
    layCuaSo: function (strPlan_Id) {
        var s = this.v(strPlan_Id).toLowerCase();
        return s ? (this.mapCuaSo[s] || null) : null;
    },
    // Tính gợi ý trong/ngoài đợt 1 lần cho cả bộ dữ liệu vừa nạp (đổi trang/lọc chỉ đọc lại r.DG, không tính lại)
    tinhDanhGiaTatCa: function () {
        var me = this;
        me.dtThayDoiAll.forEach(function (r) { r.DG = me.danhGia(r); });
    },
    // 'dd/MM/yyyy HH:mm:ss' -> {start, end}; chỉ có ngày thì phủ cả ngày; không đọc được -> null
    parseThoiDiem: function (x) {
        var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(this.v(x));
        if (!m) return null;
        var y = +m[3], mo = +m[2] - 1, d = +m[1];
        if (m[4] !== undefined) {
            var t = new Date(y, mo, d, +m[4], +m[5], m[6] ? +m[6] : 0);
            return { start: t, end: t };
        }
        return { start: new Date(y, mo, d, 0, 0, 0), end: new Date(y, mo, d, 23, 59, 59) };
    },
    giaoCuaSo: function (dBD, dKT, t) { return !!(dBD && dKT && t.end >= dBD && t.start <= dKT); },
    // k: 'TRONG' | 'NGOAI' | 'KXD' (không xác định); ly: giải thích hiện ở tooltip
    danhGia: function (row) {
        var me = this;
        var t = me.parseThoiDiem(row.THOIDIEM);
        if (!t) return { k: "KXD", ly: "Không đọc được thời điểm của thay đổi" };
        if (!me.bKeHoachDaNap || me.arrCuaSo.length === 0) return { k: "KXD", ly: "Chưa có dữ liệu thời gian của kế hoạch đăng ký" };
        var w = me.layCuaSo(row.PLAN_ID);
        if (w) {
            if (me.giaoCuaSo(w.bd, w.kt, t)) return { k: "TRONG", ly: "Nằm trong thời gian đăng ký của kế hoạch" };
            if (me.giaoCuaSo(w.bdRut, w.ktRut, t)) return { k: "TRONG", ly: "Nằm trong thời gian được phép rút của kế hoạch" };
            if (w.bd && w.kt && (row.NGUON !== "RUT" || (w.bdRut && w.ktRut))) {
                return { k: "NGOAI", ly: row.NGUON === "RUT" ? "Ngoài thời gian đăng ký và thời gian được phép rút của kế hoạch" : "Ngoài thời gian đăng ký của kế hoạch" };
            }
            return { k: "KXD", ly: "Kế hoạch thiếu ngày đăng ký hoặc cửa sổ rút" };
        }
        if (row.NGUON === "RUT") return { k: "KXD", ly: "Không tìm thấy kế hoạch của dòng rút" };
        // Lịch sử đăng ký không có Id kế hoạch: nằm trong khoảng của BẤT KỲ kế hoạch nào thì coi là trong đợt (gợi ý, có thể lệch khi nhiều đợt chồng nhau)
        var bCoKhoang = false;
        for (var i = 0; i < me.arrCuaSo.length; i++) {
            var c = me.arrCuaSo[i];
            if (!c.bd || !c.kt) continue;
            bCoKhoang = true;
            if (me.giaoCuaSo(c.bd, c.kt, t)) return { k: "TRONG", ly: "Nằm trong thời gian đăng ký của một kế hoạch" };
        }
        return bCoKhoang ? { k: "NGOAI", ly: "Không nằm trong thời gian đăng ký của kế hoạch nào" } : { k: "KXD", ly: "Các kế hoạch thiếu ngày đăng ký" };
    },
    parseNgayInput: function (strId, bCuoiNgay) {
        var p = this.parseNgay(edu.util.getValById(strId));
        if (!p) return null;
        return bCuoiNgay ? new Date(p.y, p.m - 1, p.d, 23, 59, 59) : new Date(p.y, p.m - 1, p.d, 0, 0, 0);
    },

    /*------------------------------------------
    --Vẽ bảng thay đổi
    -------------------------------------------*/
    locLai: function () {
        edu.system.pageIndex_default = 1;
        this.renderThayDoi();
    },
    renderThayDoi: function () {
        var me = this;
        var strNguon = me.strNguonDuLieu || me.layNguon();
        me.bPhanTrangTrinhDuyet = (strNguon === "RUT");
        var bAnTrong = $("#chkAnTrongDot").is(":checked");
        var dTu = me.parseNgayInput("txtTuNgay", false), dDen = me.parseNgayInput("txtDenNgay", true);
        var iAn = 0;
        me.dtThayDoi = me.dtThayDoiAll.filter(function (r) {
            var t = me.parseThoiDiem(r.THOIDIEM);
            if (t && dTu && t.end < dTu) return false;
            if (t && dDen && t.start > dDen) return false;
            if (bAnTrong && r.DG && r.DG.k === "TRONG") { iAn++; return false; }
            return true;
        });
        // dòng đang bị lọc ẩn thì không còn nằm trong tập sẽ gửi (tránh gửi những dòng người dùng không nhìn thấy)
        var objHien = {};
        me.dtThayDoi.forEach(function (r) { objHien[r.ID] = 1; });
        me.dtThayDoiAll.forEach(function (r) { if (!objHien[r.ID] && me.objChon[r.ID]) delete me.objChon[r.ID]; });
        var strTong = String(me.dtThayDoi.length);
        if (strNguon !== "RUT" && me.iPager > me.dtThayDoiAll.length) strTong += "/" + me.iPager;
        if (iAn > 0) strTong += " (ẩn " + iAn + ")";
        $("#lblThayDoi_Tong").text(strTong);
        me.veBang();
        me.capNhatGoiY();
    },
    // Vẽ đúng 1 trang của bảng: nguồn rút cắt từ danh sách đã lọc; nguồn lịch sử đăng ký đã được máy chủ cắt sẵn
    veBang: function () {
        var me = this;
        var bClient = me.bPhanTrangTrinhDuyet;
        var iSize = parseInt(edu.system.pageSize_default, 10) || 10;
        var iTong = bClient ? me.dtThayDoi.length : me.iPager;
        var aaData = me.dtThayDoi;
        if (bClient) {
            var iTrang = parseInt(edu.system.pageIndex_default, 10) || 1;
            if ((iTrang - 1) * iSize >= iTong) { iTrang = 1; edu.system.pageIndex_default = 1; }
            aaData = me.dtThayDoi.slice((iTrang - 1) * iSize, iTrang * iSize);
        }
        me.mapTrang = {};
        aaData.forEach(function (r) { me.mapTrang[r.ID] = r; });

        var jsonForm = {
            strTable_Id: "tblThayDoi",
            aaData: aaData,
            colPos: { center: [0, 6, 10, 11, 12] },
            aoColumns: [
                { "mRender": function (nRow, a) { return me.esc(a.MASO); } },
                { "mRender": function (nRow, a) { return me.esc(a.HOTEN); } },
                { "mRender": function (nRow, a) { return me.esc(a.KY); } },
                { "mRender": function (nRow, a) { return me.esc(a.HOCPHAN); } },
                { "mRender": function (nRow, a) { return me.esc(a.LOP); } },
                { "mRender": function (nRow, a) { return me.esc(a.THOIDIEM); } },
                { "mRender": function (nRow, a) { return me.esc(a.NGUOI); } },
                { "mRender": function (nRow, a) { return me.esc(a.HANHDONG); } },
                { "mRender": function (nRow, a) { return me.esc(a.KETQUA); } },
                {
                    "mRender": function (nRow, a) {
                        var dg = a.DG || { k: "KXD", ly: "" };
                        var o = { NGOAI: ["ngoai", "Ngoài đợt"], TRONG: ["trong", "Trong đợt"], KXD: ["kxd", "Chưa xác định"] }[dg.k];
                        return '<span class="cb-tag ' + o[0] + '" title="' + me.esc(dg.ly) + '">' + o[1] + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, a) {
                        var ms = me.objDaGui[a.ID];
                        return ms ? '<span class="cb-tag da" title="Đã gửi từ máy này lúc ' + me.fmtThoiDiem(ms) + '">' + me.fmtThoiDiem(ms) + '</span>' : "";
                    }
                },
                {
                    "mRender": function (nRow, a) {
                        return '<input type="checkbox" id="checkX' + me.esc(a.ID) + '"' + (a.ID ? '' : ' disabled') + (me.objChon[a.ID] ? ' checked' : '') + ' />';
                    }
                }
            ],
            bPaginate: {
                strFuntionName: bClient ? "main_doc.CanhBaoTCKT.doiTrang()" : "main_doc.CanhBaoTCKT.getList_ThayDoi()",
                iDataRow: iTong
            }
        };
        edu.system.loadToTable_data(jsonForm);
        me.capNhatChonBar();
    },
    // Hàm gọi khi bấm số trang ở nguồn rút (cắt trang ở trình duyệt, không hỏi lại máy chủ)
    doiTrang: function () {
        this.dongBoChon();
        this.veBang();
    },
    // Ghi nhận ô tick đang hiện trên trang vào tập đã chọn (giữ nguyên các dòng đã tick ở trang khác)
    dongBoChon: function () {
        var me = this;
        $("#tblThayDoi tbody input[id^=checkX]").each(function () {
            var id = this.id.substring(6);   // "checkX".length
            var r = me.mapTrang[id];
            if (!r) return;
            if (this.checked) me.objChon[id] = r; else delete me.objChon[id];
        });
        me.capNhatChonBar();
    },
    chonTatCaDaLoc: function () {
        var me = this;
        me.dtThayDoi.forEach(function (r) { if (r.ID) me.objChon[r.ID] = r; });
        me.veBang();
    },
    boChonTatCa: function () {
        this.objChon = {};
        this.veBang();
    },
    capNhatChonBar: function () {
        var me = this;
        var iChon = Object.keys(me.objChon).length;
        var iTong = me.bPhanTrangTrinhDuyet ? me.dtThayDoi.length : 0;
        $("#lblDaChon").text("Đã chọn " + iChon + " dòng");
        $("#lnkChonTatCa").text("Chọn tất cả " + iTong + " dòng đã lọc").toggle(me.bPhanTrangTrinhDuyet && iTong > 0 && iChon < iTong);
        $("#lnkBoChon").toggle(iChon > 0);
        $("#cbChonBar").toggle(me.dtThayDoi.length > 0 || iChon > 0);
        var $ds = $("#tblThayDoi tbody input[id^=checkX]:not(:disabled)");
        $("#chkSelectAll_ThayDoi").prop("checked", $ds.length > 0 && $ds.filter(":checked").length === $ds.length);
    },

    /*------------------------------------------
    --Gửi cho TC-KT (mỗi thay đổi = 1 lần gọi gửi theo mẫu, chạy trong form tiến trình dùng chung)
    -------------------------------------------*/
    req_GuiTheoMau: function (it) {
        var me = this;
        return {
            action: 'CMS_TienIch/ThucHienGuiEmailTheoCauTruc',
            type: 'GET',
            data: {
                'action': 'CMS_TienIch/ThucHienGuiEmailTheoCauTruc',
                'type': 'GET',
                'strCauTrucGuiEmailId': me.MA_MAU,
                'strDuLieuId': it.ID,
                'strNguoiTao_Id': edu.system.userId,
            }
        };
    },
    // Địa chỉ email hợp lệ trong ô "Danh sách email nhận" (cách nhau bằng ; , xuống dòng hay khoảng trắng; \x04 là ký tự máy chủ dùng thay '@')
    layEmailNhan: function () {
        var strDs = this.v(this.objMau ? this.objMau.DANHSACHNHANEMAIL : "").replace(/\x04/g, "@");
        var arrKq = strDs.match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}/g) || [];
        var objDa = {}, arr = [];
        arrKq.forEach(function (e) { var k = e.toLowerCase(); if (!objDa[k]) { objDa[k] = 1; arr.push(e); } });
        return arr;
    },
    // Danh sách lỗi chặn gửi (mảng rỗng = hợp lệ). Gọi SAU KHI đã nạp lại mẫu từ máy chủ.
    kiemTraTruocGui: function () {
        var me = this, arrLoi = [];
        if (!me.objMau) {
            arrLoi.push("Chưa có mẫu email " + me.MA_MAU + " — bấm \"Mẫu email\" để tạo mẫu (nội dung + người nhận).");
        }
        else {
            if (!me.v(me.objMau.TIEUDE).trim()) arrLoi.push("Mẫu email chưa có tiêu đề.");
            if (!me.htmlToText(me.objMau.NOIDUNG).trim()) arrLoi.push("Mẫu email chưa có nội dung.");
            if (me.layEmailNhan().length === 0) arrLoi.push("Mẫu email chưa có email người nhận hợp lệ (ô \"Danh sách email nhận\" đang trống hoặc sai định dạng).");
        }
        return arrLoi;
    },
    guiTCKT: function () {
        var me = this;
        if (!edu.process || typeof edu.process.run !== "function") {
            me.canhBao("Thiếu thành phần tiến trình dùng chung (Corei/processrun.js + dòng đăng ký edu['process'] trong indexi.aspx) — hãy copy file mới sang máy chủ.");
            return;
        }
        if (me.bDangKiemTra) return;
        // 1) Đã chọn thay đổi nào chưa
        me.dongBoChon();
        var arr = Object.keys(me.objChon).map(function (id) { return me.objChon[id]; }).filter(function (r) { return !!r.ID; });
        if (arr.length === 0) {
            me.canhBao("Chưa chọn thay đổi nào để gửi.\nVui lòng tick chọn ít nhất một dòng trong bảng rồi bấm \"Gửi cho TC-KT\".");
            return;
        }
        // 2) Kiểm tra mẫu email + người nhận MỚI NHẤT trên máy chủ (mẫu có thể vừa bị người khác sửa hoặc xóa) rồi mới cho gửi
        me.bDangKiemTra = true;
        me.thongBao("i", "Đang kiểm tra mẫu email và người nhận trước khi gửi...");
        me.getMau(function () {
            me.bDangKiemTra = false;
            var arrLoi = me.kiemTraTruocGui();
            if (arrLoi.length > 0) {
                me.canhBao("Chưa gửi được — cần xử lý trước:\n- " + arrLoi.join("\n- "));
                return;
            }
            me.thongBao();
            me.moFormGui(arr);
        }, function (strLoi) {
            me.bDangKiemTra = false;
            me.canhBao("Chưa gửi — không kiểm tra được mẫu email:\n" + strLoi);
        });
    },
    // 3) Đã kiểm tra xong: mở form tiến trình (Bước 1 = xác nhận, bấm RUN mới gửi)
    moFormGui: function (arr) {
        var me = this;
        var arrNhan = me.layEmailNhan();
        var iNgoai = 0, iTrong = 0, iKxd = 0;
        arr.forEach(function (r) {
            var k = r.DG ? r.DG.k : "KXD";
            if (k === "NGOAI") iNgoai++; else if (k === "TRONG") iTrong++; else iKxd++;
        });
        var arrNote = [];
        if (iTrong > 0) arrNote.push(iTrong + " thay đổi được chọn nằm trong thời gian đăng ký/rút chính thức (thường không cần cảnh báo).");
        var iDaGui = arr.filter(function (r) { return !!me.objDaGui[r.ID]; }).length;
        if (iDaGui > 0) arrNote.push(iDaGui + " thay đổi đã gửi từ máy này trước đó — gửi tiếp sẽ tạo thêm email.");
        if (arr.length > 100) arrNote.push("Mỗi thay đổi gửi thành 1 email riêng: Phòng TC-KT sẽ nhận " + arr.length + " email.");
        var arrThanhCong = [];
        edu.process.run({
            title: "Gửi cảnh báo thay đổi đăng ký/rút học phần cho Phòng TC-KT",
            subTitles: [
                "Mẫu email: " + me.MA_MAU,
                "Người nhận: " + arrNhan.join(", "),
                "Đã kiểm tra: mẫu email hợp lệ, " + arrNhan.length + " người nhận; " + arr.length + " thay đổi (" + iNgoai + " ngoài đợt · " + iKxd + " chưa xác định · " + iTrong + " trong đợt)",
                "Nguồn: " + $("#dropNguon option:selected").text()
            ],
            unit: "thay đổi",
            items: arr,
            columns: [
                { header: "Mã số", render: function (it) { return it.MASO; } },
                { header: "Họ tên", render: function (it) { return it.HOTEN; } },
                { header: "Học phần", render: function (it) { return it.HOCPHAN; } },
                { header: "Thời điểm", render: function (it) { return it.THOIDIEM; } }
            ],
            // run (không dùng request) để đánh dấu "đã gửi" ngay khi máy chủ báo thành công
            run: function (it) {
                return edu.process.callApi(me.req_GuiTheoMau(it)).then(function (r) {
                    if (r.ok) { me.objDaGui[it.ID] = Date.now(); arrThanhCong.push(it.ID); }
                    return r;
                });
            },
            okMessage: "Đã yêu cầu gửi email — xem kết quả ở tab Lịch sử đã gửi",
            notes: arrNote,
            fileName: "KetQuaGuiCanhBaoTCKT",
            refresh: function () {
                me.luuDaGui();
                arrThanhCong.forEach(function (id) { delete me.objChon[id]; });   // dòng gửi xong thì bỏ tick, dòng lỗi giữ lại để gửi lại
                me.veBang();
                me.iPage_paneLichSu = 1;
            }
        });
    },

    /*------------------------------------------
    --[2] Mẫu email (cấu trúc nội dung gửi email)
    -------------------------------------------*/
    taoEditor: function () {
        try {
            if (window.CKEDITOR) {
                if (CKEDITOR.instances["editor_Mau"]) { try { CKEDITOR.instances["editor_Mau"].destroy(true); } catch (e1) { } }
                CKEDITOR.replace("editor_Mau");
            }
        } catch (ex) { console.warn("[CanhBaoTCKT] Không tạo được CKEditor, dùng ô nhập thường", ex); }
    },
    getNoiDung: function () {
        try { if (window.CKEDITOR && CKEDITOR.instances["editor_Mau"]) return CKEDITOR.instances["editor_Mau"].getData(); } catch (ex) { }
        return $("#editor_Mau").val();
    },
    setNoiDung: function (strHtml) {
        try { if (window.CKEDITOR && CKEDITOR.instances["editor_Mau"]) { CKEDITOR.instances["editor_Mau"].setData(strHtml); return; } } catch (ex) { }
        $("#editor_Mau").val(strHtml);
    },
    getMau: function (fnXong, fnLoi) {
        var me = this;
        var obj_list = {
            'action': 'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail',
            'versionAPI': 'v1.0',
            'strTuKhoa': me.MA_MAU,
            'strNguoiTao_Id': '',
            'pageIndex': 1,
            'pageSize': 1000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data || [];
                    me.objMau = null;
                    for (var i = 0; i < dt.length; i++) {
                        if (me.v(dt[i].MA).toLowerCase() === me.MA_MAU.toLowerCase()) { me.objMau = dt[i]; break; }
                    }
                    me.bMauDaNap = true;
                    me.nhacMau();
                    if (typeof fnXong === "function") fnXong();
                }
                else {
                    me.thongBao("e", obj_list.action + ": " + data.Message);
                    if (typeof fnLoi === "function") fnLoi(obj_list.action + ": " + data.Message);
                }
            },
            error: function (er) {
                me.thongBao("e", obj_list.action + " — " + me.moTaLoi(er));
                if (typeof fnLoi === "function") fnLoi(obj_list.action + " — " + me.moTaLoi(er));
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    moMau: function () {
        var me = this;
        me.thongBao("", "", "#cbThongBaoMau");
        var m = me.objMau;
        if (m) {
            edu.util.viewValById("txtMau_TenHienThi", m.TENEMAILHIENTHI);
            edu.util.viewValById("txtMau_TieuDe", m.TIEUDE);
            edu.util.viewValById("txtMau_DanhSach", m.DANHSACHNHANEMAIL);
            edu.util.viewValById("txtMau_GhiChu", m.GHICHU);
            me.setNoiDung(me.v(m.NOIDUNG));
        }
        else {
            // Chưa có mẫu: điền sẵn nội dung gợi ý (chưa lưu cho tới khi bấm "Lưu mẫu")
            edu.util.viewValById("txtMau_TenHienThi", "Hệ thống Quản lý đào tạo");
            edu.util.viewValById("txtMau_TieuDe", "[CẢNH BÁO] Thay đổi đăng ký/rút học phần ngoài thời gian chính thức");
            edu.util.viewValById("txtMau_DanhSach", "");
            edu.util.viewValById("txtMau_GhiChu", "Tạo từ trang Gửi cảnh báo TC-KT");
            me.setNoiDung("<p>Kính gửi Phòng Tài chính - Kế toán,</p>"
                + "<p>Hệ thống ghi nhận có thay đổi đăng ký/rút học phần của sinh viên diễn ra ngoài khoảng thời gian đăng ký/rút chính thức của đợt.</p>"
                + "<p>Đề nghị Phòng kiểm tra trước khi thực hiện các nghiệp vụ liên quan đến học phí, hóa đơn và thuế.</p>"
                + "<p>Trân trọng.</p>");
            me.thongBao("i", "Mẫu chưa tồn tại — nhập email người nhận rồi bấm \"Lưu mẫu\" để tạo.", "#cbThongBaoMau");
        }
        edu.util.toggle_overide("zone-bus", "zoneMau");
    },
    saveMau: function () {
        var me = this;
        var strTieuDe = $("#txtMau_TieuDe").val().trim();
        var strNhan = $("#txtMau_DanhSach").val().trim();
        if (!strTieuDe) { me.thongBao("w", "Vui lòng nhập tiêu đề email.", "#cbThongBaoMau"); return; }
        if (!strNhan) { me.thongBao("w", "Vui lòng nhập email người nhận (Phòng TC-KT).", "#cbThongBaoMau"); return; }
        var bSua = !!(me.objMau && me.objMau.ID);
        var obj_save = {
            'action': bSua ? 'CMS_TienIch/Sua_CauTrucNoiDungGuiEmail' : 'CMS_TienIch/Them_CauTrucNoiDungGuiEmail',
            'versionAPI': 'v1.0',
            'strId': bSua ? me.objMau.ID : '',
            'strMa': me.MA_MAU,
            'strTenEmailHienThi': $("#txtMau_TenHienThi").val().trim(),
            'strTieuDe': strTieuDe,
            'strNoiDung': me.getNoiDung(),
            'strDanhSachNhanEmail': strNhan,
            'strGhiChu': $("#txtMau_GhiChu").val().trim(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.thongBao("s", bSua ? "Đã cập nhật mẫu email." : "Đã tạo mẫu email.", "#cbThongBaoMau");
                    me.getMau(function () { me.thongBao(); });
                }
                else {
                    me.thongBao("e", obj_save.action + ": " + data.Message, "#cbThongBaoMau");
                }
            },
            error: function (er) {
                me.thongBao("e", obj_save.action + " (lỗi kết nối" + ((er && er.status) ? " " + er.status : "") + ")", "#cbThongBaoMau");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --[3] Lịch sử đã gửi
    -------------------------------------------*/
    getList_LichSuGui: function (bReset) {
        var me = this;
        if (bReset) edu.system.pageIndex_default = 1;
        if (me.bMauDaNap && !me.objMau) {
            me.dtLichSuGui = [];
            $("#lblLichSu_Tong").text("0");
            me.genTable_LichSuGui([], 0);
            return;
        }
        var obj_list = {
            'action': 'CMS_TienIch/LayDS_TienTrinhGuiEmail',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtLS_TuKhoa'),
            'strNguoiTao_Id': $("#chkLS_CuaToi").is(":checked") ? edu.system.userId : '',
            'strTuNgay': edu.util.getValById('txtLS_TuNgay'),
            'strDenNgay': edu.util.getValById('txtLS_DenNgay'),
            'strDaGui': edu.util.getValById('dropLS_TrangThai'),
            'strCauTrucNoiDungGuiEmailId': me.objMau ? me.objMau.ID : '',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        var iReq = ++me.iReqLS;
        edu.system.makeRequest({
            success: function (data) {
                if (iReq !== me.iReqLS) return;
                if (data.Success) {
                    me.dtLichSuGui = data.Data || [];
                    var iPager = parseInt(data.Pager, 10);
                    if (isNaN(iPager)) iPager = me.dtLichSuGui.length;
                    me.iPage_paneLichSu = edu.system.pageIndex_default;
                    $("#lblLichSu_Tong").text(iPager);
                    me.genTable_LichSuGui(me.dtLichSuGui, iPager);
                }
                else {
                    me.thongBao("e", obj_list.action + ": " + data.Message);
                }
            },
            error: function (er) {
                if (iReq !== me.iReqLS) return;
                me.thongBao("e", obj_list.action + " (lỗi kết nối" + ((er && er.status) ? " " + er.status : "") + ")");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    // Người gửi: máy chủ có thể đặt tên trường khác nhau — lấy trường đầu tiên có giá trị
    nguoiGui: function (a) {
        var f = ["NGUOITAO_TAIKHOAN", "NGUOITAO_TENDAYDU", "NGUOITHUCHIEN_TAIKHOAN", "NGUOITAO_HOTEN", "NGUOITAO"];
        for (var i = 0; i < f.length; i++) if (this.v(a[f[i]]) !== "") return this.v(a[f[i]]);
        return "";
    },
    tenTrangThai: function (a) {
        var me = this;
        if (a.DAGUI == "1") return "Thành công";
        if (a.DAGUI == "0") return "Chưa gửi";
        if (a.DAGUI == "2") return "Gửi lỗi" + (a.LOIGUIMAIL ? ": " + me.v(a.LOIGUIMAIL) : "");
        return me.v(a.DAGUI);
    },
    genTable_LichSuGui: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSuGui",
            aaData: data,
            bPaginate: { strFuntionName: "main_doc.CanhBaoTCKT.getList_LichSuGui()", iDataRow: iPager },
            colPos: { center: [0, 3, 4, 6, 7] },
            aoColumns: [
                { "mRender": function (nRow, a) { return me.esc(me.v(a.MAILTO).replace(/\x04/g, "@")); } },
                {
                    "mRender": function (nRow, a) {
                        var s = me.htmlToText(a.NOIDUNGEMAIL).replace(/\s+/g, " ");
                        return '<span class="cb-noidung" title="' + me.esc(s) + '">' + me.esc(s) + '</span>';
                    }
                },
                { "mRender": function (nRow, a) { return me.esc(a.NGAYGUI); } },
                {
                    "mRender": function (nRow, a) {
                        var s = me.tenTrangThai(a);
                        return a.DAGUI == "2" ? '<span style="color:#b42318;font-weight:600">' + me.esc(s) + '</span>' : me.esc(s);
                    }
                },
                { "mRender": function (nRow, a) { return me.esc(me.nguoiGui(a)); } },
                { "mRender": function (nRow, a) { return '<a class="btn btn-default btnXem" id="' + me.esc(a.ID) + '" title="Xem chi tiết"><i class="fa fa-eye"></i></a>'; } },
                { "mRender": function (nRow, a) { return '<input type="checkbox" id="checkX' + me.esc(a.ID) + '" />'; } }
            ]
        };
        $("#chkSelectAll_LichSu").prop("checked", false);
        edu.system.loadToTable_data(jsonForm);
    },
    xemChiTiet: function (strId) {
        var me = this;
        var a = null;
        for (var i = 0; i < me.dtLichSuGui.length; i++) if (me.v(me.dtLichSuGui[i].ID) === strId) { a = me.dtLichSuGui[i]; break; }
        if (!a) { me.thongBao("w", "Không tìm thấy email đã chọn."); return; }
        $("#lblCT_Nhan").text(me.v(a.MAILTO).replace(/\x04/g, "@"));
        $("#lblCT_TieuDe").text(me.v(a.MAILSUBJECT));
        $("#lblCT_Ngay").text(me.v(a.NGAYGUI));
        $("#lblCT_TrangThai").text(me.tenTrangThai(a));
        $("#lblCT_NoiDung").text(me.htmlToText(a.NOIDUNGEMAIL));
        edu.util.toggle_overide("zone-bus", "zoneChiTiet");
    },
    guiLai: function () {
        var me = this;
        if (!edu.process || typeof edu.process.runJob !== "function") {
            me.canhBao("Thiếu thành phần tiến trình dùng chung (Corei/processrun.js) — hãy copy file mới sang máy chủ.");
            return;
        }
        var arrId = edu.util.getArrCheckedIds("tblLichSuGui", "checkX");
        if (arrId.length === 0) {
            me.canhBao("Chưa chọn email nào để gửi lại.\nVui lòng tick chọn ít nhất một dòng ở bảng lịch sử rồi bấm \"Gửi lại mục đã chọn\".");
            return;
        }
        me.thongBao();
        edu.process.runJob({
            title: "Gửi lại email cảnh báo TC-KT",
            what: "Gửi lại " + arrId.length + " email đã chọn",
            unit: "yêu cầu",
            request: function () {
                return {
                    action: 'CMS_TienIch/ThucHienGuiEmail',
                    type: 'GET',
                    versionAPI: 'v1.0',
                    authen: true,
                    data: {
                        'action': 'CMS_TienIch/ThucHienGuiEmail',
                        'versionAPI': 'v1.0',
                        'ArrstrId': arrId.join(","),
                        'strHanhDong': 'GUILAI',
                        'strNguoiThucHien_Id': edu.system.userId,
                    }
                };
            },
            okMessage: "Đã yêu cầu gửi lại — tải lại danh sách để xem trạng thái mới",
            fileName: "KetQuaGuiLaiEmailTCKT",
            refresh: function () { me.getList_LichSuGui(); }
        });
    }
};
