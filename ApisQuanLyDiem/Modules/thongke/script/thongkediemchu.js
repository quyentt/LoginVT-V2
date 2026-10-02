/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--Note: Thống kê kết quả theo điểm chữ
        API: D_ThongKe_MH/FSkuLyYKJAokNRA0IBUpJC4FKCQsAik0
        Func: PKG_DIEM_THONGKE.ThongKeKetQuaTheoDiemChu
----------------------------------------------*/
function ThongKeDiemChu() { };
ThongKeDiemChu.prototype = {

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: Cascade combobox
        -------------------------------------------*/
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_KhoaQuanLy").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_LopQuanLy();
        });
        /*------------------------------------------
        --Discription: Main action
        -------------------------------------------*/
        $("#btnThongKe").click(function () {
            me.thongKe_DiemChu();
        });
        $("#btnResetFilter").click(function () {
            me.resetFilter();
        });
    },

    resetFilter: function () {
        var me = this;
        var ids = [
            "dropSearch_ThoiGian", "dropSearch_HeDaoTao", "dropSearch_KhoaDaoTao",
            "dropSearch_KhoaQuanLy", "dropSearch_ChuongTrinh", "dropSearch_LopQuanLy",
            "dropSearch_NganhHoc"
        ];
        ids.forEach(function (id) {
            $("#" + id).val(null).trigger("change");
        });
        $("#dropSearch_PhamVi").val("1").trigger("change");
        $("#dropSearch_TrangThaiSV option").prop("selected", true);
        $("#dropSearch_TrangThaiSV").trigger("change");
    },

    page_load: function () {
        var me = this;
        edu.system.page_load && edu.system.page_load();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KhoaQuanLy();
        me.getList_ChuongTrinh();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropSearch_NganhHoc");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.cbGenCombo_TrangThaiSV);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> Systemroot (HeDaoTao/KhoaDaoTao/...)
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_HeDaoTao(obj, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_KhoaDaoTao(obj, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    getList_ChuongTrinh: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValCombo("dropSearch_KhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, "", "", me.cbGenCombo_ChuongTrinh);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000
        };
        edu.system.getList_ThoiGianDaoTao(obj, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },

    /*------------------------------------------
    --Discription: [2] GEN COMBO
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENHEDAOTAO", code: "", avatar: "" },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Tất cả hệ đào tạo"
        });
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENKHOA", code: "", avatar: "" },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            title: "Tất cả khóa đào tạo"
        });
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
            renderPlace: ["dropSearch_KhoaQuanLy"],
            title: "Tất cả khoa quản lý"
        });
    },
    cbGenCombo_ChuongTrinh: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TENCHUONGTRINH", code: "", avatar: "" },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Tất cả chương trình đào tạo"
        });
    },
    cbGenCombo_LopQuanLy: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
            renderPlace: ["dropSearch_LopQuanLy"],
            title: "Tất cả lớp quản lý"
        });
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "DAOTAO_THOIGIANDAOTAO", code: "", avatar: "" },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Tất cả học kỳ"
        });
    },
    cbGenCombo_TrangThaiSV: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
            renderPlace: ["dropSearch_TrangThaiSV"],
            title: "Tất cả trạng thái người học"
        });
        $("#dropSearch_TrangThaiSV option").prop("selected", true);
        $("#dropSearch_TrangThaiSV").trigger("change");
    },

    /*------------------------------------------
    --Discription: [3] Thống kê — gọi PKG_DIEM_THONGKE.ThongKeKetQuaTheoDiemChu
    -------------------------------------------*/
    thongKe_DiemChu: function () {
        var me = this;
        var obj_save = {
            'action': 'D_ThongKe_MH/FSkuLyYKJAokNRA0IBUpJC4FKCQsAik0',
            'func': 'PKG_DIEM_THONGKE.ThongKeKetQuaTheoDiemChu',
            'iM': edu.system.iM,
            'strDaoTao_HeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropSearch_LopQuanLy'),
            'strDaoTao_NganhHoc_Id': edu.util.getValCombo('dropSearch_NganhHoc'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_ThoiGian'),
            'strQLSV_TrangThai_Id': edu.util.getValCombo('dropSearch_TrangThaiSV'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('dropSearch_PhamVi')
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading();
                if (data.Success) {
                    var dt = data.Data || [];
                    me.genTable_KetQua(dt, data.Pager);
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [4] GenHTML kết quả — cột sinh động theo rs trả về
    -------------------------------------------*/
    genTable_KetQua: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblKetQuaThongKe";
        var total = iPager || (data ? data.length : 0);
        $("#lblTongDong").html(total);

        if (!data || data.length === 0) {
            $("#" + strTable_Id + " thead").html('<tr><th class="td-stt">Stt</th></tr>');
            $("#" + strTable_Id + " tbody").html(
                '<tr class="tkdc-empty-row"><td colspan="20"><i class="fa fa-inbox"></i> Không có dữ liệu phù hợp</td></tr>'
            );
            return;
        }

        // Lib loadToTable_data tự render cột STT đầu tiên cho mỗi row,
        // nên bỏ qua key trùng (STT/TT) trong data để tránh lặp.
        var skipKeys = { "STT": true, "TT": true };
        var keys = Object.keys(data[0]).filter(function (k) {
            return !skipKeys[String(k).toUpperCase()];
        });

        var thead = '<tr><th class="td-stt">Stt</th>';
        keys.forEach(function (k) {
            thead += '<th class="td-center">' + me.formatHeader(k) + '</th>';
        });
        thead += '</tr>';
        $("#" + strTable_Id + " thead").html(thead);

        var aoColumns = keys.map(function (k) {
            return {
                "mRender": function (nRow, aData) {
                    var v = aData[k];
                    if (v === null || v === undefined || v === "") return "";
                    if (typeof v === "number") {
                        return Number.isInteger(v) ? v.toLocaleString("vi-VN") : v.toFixed(2);
                    }
                    return v;
                }
            };
        });

        edu.system.loadToTable_data({
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: aoColumns
        });

        // gắn class td-stt cho cột STT (cột đầu) sau khi render xong → sticky-left
        $("#" + strTable_Id + " tbody tr").each(function () {
            $(this).find("td:first").addClass("td-stt");
        });
    },

    formatHeader: function (key) {
        if (key == null) return "";
        var s = String(key).replace(/_/g, ' ').toLowerCase().trim();
        return s.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
};
