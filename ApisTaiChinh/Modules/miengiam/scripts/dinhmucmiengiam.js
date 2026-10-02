/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 30/08/2018
--API URL: QLTC_MucMienGiam
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DinhMucMienGiam() { };
DinhMucMienGiam.prototype = {
    valid_DMMG: [],
    html_DMMG: {},
    input_DMMG: {},
    strDoiTuong_Id: '',
    arrKhoaHoc_Id: [],
    arrHaveEdited: [],
    dtKhoanThu: [],
    dtKieuHoc: [],
    dtDoiTuong: [],
    dtDinhMucMienGiam: [],
    dtKhoaDaoTao: [],
    dtChuongTrinhDaoTao: [],

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: [0] Initial system
		-------------------------------------------*/
        
        /*------------------------------------------
        --Discription: [0] Initial local 
        -------------------------------------------*/
        me.page_load();

        /*------------------------------------------
        --Discription: [0] Action common
        -------------------------------------------*/
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-dmmg", "zone_list_dmmg");
        });
        $(".btnCloseKeThua").click(function () {
            
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            edu.util.toggle_overide("zone-dmmg", "zone_input_dmmg");
        });
        $(".btnKeThua").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_DMMG");
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_DMMG");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa trước!", "w");
                return;
            }
            edu.util.toggle_overide("zone-bus", "zoneEdit");
        });
        $("#txtKeyword_DMMG").focus();
        /*------------------------------------------
		--Discription: [1] Action TimKiem DinhMucMienGiam
		-------------------------------------------*/
        $('#dropHeDaoTao_DMMG').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_DMMG");
            if (strHeHaoTao_Id) {
                me.getList_KhoaDaoTao(strHeHaoTao_Id);
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_DMMG').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_DMMG");
            if (strKhoaHoc_Id) {
                me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $('#dropChuongTrinhDaoTao_DMMG').on('select2:select', function () {
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_DMMG");
            if (strChuongTrinh_Id) {
                //1. call db
                me.getList_DinhMucMienGiam();
                //2.hide box-search
                //edu.util.toggle("box-sub-search");
                //4. trigger ----> dropChuongTrinhDaoTaoOnModal_DMMG on modal
                $("#dropChuongTrinhDaoTaoOnModal_DMMG").val(strChuongTrinh_Id).trigger("change");
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $('#dropHeDaoTaoEdit_DMMG').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTaoEdit_DMMG");
            if (strHeHaoTao_Id) {
                me.getList_KhoaDaoTao_Edit(strHeHaoTao_Id);
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $('#dropKhoaDaoTaoEdit_DMMG').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTaoEdit_DMMG");
            if (strKhoaHoc_Id) {
                me.getList_ChuongTrinhDaoTao_Edit(strKhoaHoc_Id);
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $("#btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnRefresh_DMMG").click(function () {
            me.getList_DinhMucMienGiam();
        });
        $('#dropChuongTrinhDaoTaoOnModal_DMMG').on('select2:select', function () {
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTaoOnModal_DMMG");
            if (edu.util.checkValue(strChuongTrinh_Id)) {
                me.getList_HocPhan_OnModal(strChuongTrinh_Id);
            }
        });
        /*------------------------------------------
		--Discription: [1] Action main  DinhMucMienGiam
		-------------------------------------------*/
        $("#btnSave_DMMG").click(function (e) {
            //check HocKy, dHeSo, KhoanThu, TinhChat
            var valid = edu.util.validInputForm(me.valid_TKKBP);
            if (valid == true) {
                me.save_DinhMucMienGiam();
            }

        });
        $("#tbldata_DMMG").delegate(".btnEdit_DMMG", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/edit_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.openBoxEdit_DinhMucMienGiam(selected_id);
            }
        });
        $("#tbldata_DMMG").delegate(".btnUpdate_DMMG", "keypress", function (e) {
            if (e.which == 13) {
                var selected_id = this.id;
                var strIds = edu.util.cutPrefixId(/txt/g, selected_id);

                if (edu.util.checkValue(strIds)) {
                    var obj = me.closeBoxEdit_DinhMucMienGiam(strIds);
                    var value = edu.util.convertStrToNum(obj.value);
                    var arrId = obj.arrId;
                    //call update function
                    me.update_DinhMucMienGiam(arrId, value, strIds);
                }
            }
        });
        $("#tbldata_DMMG").delegate(".btnDel_DMMG", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/delete_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
                $("#btnYes").click(function (e) {
                    me.delete_DinhMucMienGiam(selected_id);
                });
                return false;
            }

        });
        $('#tbldata_DMMG').on('mouseenter', '.action-dmmg', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).removeClass("hide");
        }).on('mouseleave', '.action-dmmg', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).addClass("hide");
        });
        $("#btnRewrite_DMMG").click(function () {
            me.rewrite();
        });
        /*------------------------------------------
		--Discription: [2] action HocPhan
		-------------------------------------------*/
        $("#btnCallModal_HocPhan_DMMG").click(function () {
            me.popup_HocPhan();
        });
        $("#tbldata_HocPhan_DMMG").delegate(".btnSelect_HocPhan", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/hocphan_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_HocPhan(selected_id);
            }
        });
        $("#tbldata_HocPhan_Selected").delegate(".btnRemove_HocPhan", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/selected_hocphan_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.remove_HocPhan(selected_id);
            }
        });
        /*------------------------------------------
		--Discription: [2] action HocPhan
		-------------------------------------------*/
        $("[id$=chkSelectAll_CT_DMMG]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_ChuongTrinh" });
        });
        $("#tblInput_ChuongTrinh").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblInput_ChuongTrinh", regexp: /checkX/g, });
        });
        $("#saveKeThua").click(function () {
            var strChuongTrinh = edu.util.getValById("dropChuongTrinhDaoTaoEdit_DMMG");
            if (strChuongTrinh == "") {
                edu.system.alert("Hãy chọn chương trình!", "w");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_ChuongTrinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn kế thừa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.KeThua_DinhMucMienGiam(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle_overide("zone-dmmg", "zone_list_dmmg");
        me.arrHaveEdited = [];
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao_Edit("");
        me.getList_ChuongTrinhDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();
        me.getList_DoiTuong();
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.DOITUONG", "dropDoiTuong_DMMG", "Chọn đối tượng đào tạo");
        me.valid_TKKBP = [
            { "MA": "dropHocKy_DMMG", "THONGTIN1": "1" },
            { "MA": "dropDoiTuong_DMMG", "THONGTIN1": "1" },
            { "MA": "txtPhanTramMienGiam_DMMG", "THONGTIN1": "1#3" },
            { "MA": "dropKieuHoc_DMMG", "THONGTIN1": "1" },
            { "MA": "dropKhoanThu_DMMG", "THONGTIN1": "1" },
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character... 
        ];
    },
    rewrite: function () {
        //1.reset id
        var me = this;
        var arrId = ["dropHocKy_DMMG", "txtPhanTramMienGiam_DMMG", "dropKhoanThu_DMMG", "dropKieuHoc_DMMG"];
        edu.util.resetValByArrId(arrId);
        //2.reset table
        $("#tbldata_ChuongTrinh_MDVP td .btnClose").each(function () {
            $(this).trigger("click");
        });
        $("#tbldata_HocPhan_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
    },
    popup_HocPhan: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalChuongTrinh_DMMG").modal("show");
    },
    genPathSelect: function () {
        var me = this;
        //1.get text
        var strHe = edu.util.getTextById_Combo("dropHeDaoTao_DMMG");
        var strKhoa = edu.util.getTextById_Combo("dropKhoaDaoTao_DMMG");
        var strNganh = edu.util.getTextById_Combo("dropChuongTrinhDaoTao_DMMG");
        if (!edu.util.checkValue(edu.util.getValById("dropHeDaoTao_DMMG"))) {
            strHe = "..";
        }
        if (!edu.util.checkValue(edu.util.getValById("dropKhoaDaoTao_DMMG"))) {
            strKhoa = "..";
        }
        if (!edu.util.checkValue(edu.util.getValById("dropChuongTrinhDaoTao_DMMG"))) {
            strNganh = "..";
        }
        var strHe_Khoa_Nganh = strHe + "/" + strKhoa + "/" + strNganh;
        var html = '<span title="' + edu.util.capitalFirst(strHe_Khoa_Nganh) + '">' + edu.util.capitalFirst(strHe_Khoa_Nganh) + '</span>';
        //2.view
        edu.util.viewHTMLById("lblPathSelect_HeKhoaNganh", html);
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB DinhMucMienGiam
	--ULR:  
	-------------------------------------------*/
    save_DinhMucMienGiam: function () {
        me = this;

        var strHocKy_Ids = edu.util.getValById("dropHocKy_DMMG");
        var dHeSo = edu.util.convertStrToNum($("#txtPhanTramMienGiam_DMMG").val());
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropKhoanThu_DMMG");
        var strKieHoc_Ids = edu.util.getValCombo("dropKieuHoc_DMMG");
        var strDoiTuong_Id = edu.util.getValCombo("dropDoiTuong_DMMG");
        var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTaoOnModal_DMMG");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_MucMienGiam/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strDoiTuong_Id.toString(),
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'dPhanTramMienGiam': dHeSo,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': ""
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        title: "Thông báo",
                        content: "Thêm mới thành công!",
                        time: 1500,
                    }
                    edu.system.alert("Thêm mới thành công!");
                    edu.util.toggle_overide("zone-dmmg", "zone_list_dmmg");
                    me.getList_DinhMucMienGiam();
                }
                else {
                    edu.system.alert("QLTC_MucMienGiam.ThemMoi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MucMienGiam.ThemMoi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    update_DinhMucMienGiam: function (arrId, dHeSo, strIds) {

        var me = this;
        var obj_notify = {};
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_MucMienGiam/CapNhat',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': edu.util.getValById("dropChuongTrinhDaoTao_DMMG"),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id': arrId[1],
            'strDaoTao_ThoiGianDaoTao_Id': arrId[0],
            'dHeSo': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': arrId[3],
            'strTaiChinh_CacKhoanThu_Id': arrId[2],
            'strGhiChu': "",
        };
        //default
        edu.system.beginLoading();

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    me.affectUpdate_DinhMucMienGiam(strIds, dHeSo);
                    //notify alert)timer
                    var obj = {
                        title: "Thông báo",
                        content: "Cập nhật thành công!",
                        time: 1500,
                    }
                    edu.system.alertTimer(obj);
                }
                else {
                    edu.system.alert("QLTC_MucMienGiam.CapNhat: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MucMienGiam.CapNhat (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    delete_DinhMucMienGiam: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_MucMienGiam/Xoa',
            'versionAPI': 'v1.0',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    var obj = {
                        content: "Xóa thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    me.getList_DinhMucMienGiam();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DinhMucMienGiam: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strDaoTao_ToChucChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_DMMG");
        var strDoiTuong_Id = me.strDoiTuong_Id;
        var strDaoTao_ThoiGianDaoTao_Id = "";
        var strNguoiThucHien_Id = "";
        var strDiem_KieuHoc_Id = "";
        var strTaiChinh_CacKhoanThu_Id = "";
        var strDangKy_DotDangKyHoc_Id = "";

        var obj_list = {
            'action': 'TC_MucMienGiam/LayDanhSach',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strDaoTao_ToChucChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strDoiTuong_Id,
            'strTaiChinh_CacKhoanThu_Id': strTaiChinh_CacKhoanThu_Id,
            'dTuKhoa_number': -1,
            'strDiem_KieuHoc_Id': strDiem_KieuHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.dtDinhMucMienGiam = dtResult;
                    me.genTable_DinhMucMienGiam();
                }
                else {
                    edu.system.alert("QLTC_MucMienGiam.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MucMienGiam.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    KeThua_DinhMucMienGiam: function (strChuongTrinh_CanKeThua_Ids) {
        me = this;
        
        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_MucMienGiam/KeThua',
            'versionAPI': 'v1.0',

            'strChuongTrinh_Goc_Id': edu.util.getValById("dropChuongTrinhDaoTaoEdit_DMMG"),
            'strChuongTrinh_CanKeThua_Ids': strChuongTrinh_CanKeThua_Ids,
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoTaoEdit_DMMG"),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropKieuHocEdit_DMMG"),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropLoaiKhoanEdit_DMMG"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        title: "Thông báo",
                        content: "Thêm mới thành công!",
                        time: 1500,
                    }
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("QLTC_MucMienGiam.ThemMoi: " + data.Message);
                }
                edu.system.endLoading();
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MucMienGiam.ThemMoi (er): " + JSON.stringify(er));
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    endLuuHeSo: function () {
        var me = main_doc.DinhMucMienGiam;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
    },
    /*------------------------------------------
	--Discription: [1] GEN HTML DinhMucMienGiam
	--ULR:  
	-------------------------------------------*/
    genTable_DinhMucMienGiam: function () {
        var me = this;
        //1. variable
        var $table_thead = "#tbldata_DMMG thead";
        var $table_tbody = "#tbldata_DMMG tbody";
        var thead = "";
        var tbody = "";
        $($table_thead).html("");
        $($table_tbody).html("");
        //2. thead
        thead = me.genThead_DinhMucMienGiam(me.dtKhoanThu, me.dtKieuHoc, me.dtDinhMucMienGiam);
        $($table_thead).append(thead);
        //3. tbody
        tbody = me.genTbody_DinhMucMienGiam(me.dtDoiTuong, me.dtDinhMucMienGiam, me.dtKhoanThu, me.dtKieuHoc);
        $($table_tbody).append(tbody);
    },
    genThead_DinhMucMienGiam: function (dtKhoanThu, dtKieuHoc, dtDinhMucMienGiam) {
        var me = this;
        var arrLoaiKhoan = [];
        //thead
        var thead = '';
        thead += '<tr>';
        thead += '<th class="td-center td-fixed" rowspan="2">Stt</th>';
        thead += '<th class="td-left" rowspan="2">Chương trình</th>';
        thead += '<th class="td-left" rowspan="2">Đối tượng</th>';
        thead += '<th class="td-center" rowspan="2">Học kỳ</th>';
        arrLoaiKhoan = me.getUnique_LoaiKhoan(dtKhoanThu, dtDinhMucMienGiam);

        for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {
            thead += '<th class="td-center" colspan="' + dtKieuHoc.length + '">' + dtKhoanThu[lk].TEN + '</th>';
        }
        thead += '</tr>';
        thead += '<tr>';
        for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {
            for (var kh = 0; kh < dtKieuHoc.length; kh++) {
                thead += '<th class="td-center">' + dtKieuHoc[kh].TEN + '</th>';
            }
        }
        thead += '</tr>';

        return thead;
    },
    genTbody_DinhMucMienGiam: function (dtDoiTuong, dtDinhMucMienGiam, dtKhoanThu, dtKieuHoc) {
        var me = this;
        //tbody
        var tbody = '';
        var arrHocKy = [];
        var arrDinhMucMienGiam = [];
        var arrDoiTuong = [];
        var arrLoaiKhoan = [];
        var objHocKy = {};
        var rowspan = 0;
        var check = false;
        var arrCheckExist = [];
        //1. loop ChuongTrinh and Data to get unique HOCKY_ID
        unique_HocKy();

        //2. 
        // processing
        function unique_HocKy() {
            for (var hp = 0; hp < dtDoiTuong.length; hp++) {
                //1. hocky
                for (var dt = 0; dt < dtDinhMucMienGiam.length; dt++) {
                    if (dtDoiTuong[hp].ID == dtDinhMucMienGiam[dt].QLSV_DOITUONG_ID) {
                        //objHocKy
                        objHocKy = {};
                        objHocKy.ID = dtDinhMucMienGiam[dt].DAOTAO_THOIGIANDAOTAO_ID;
                        objHocKy.TEN = dtDinhMucMienGiam[dt].DAOTAO_THOIGIANDAOTAO_HOCKY;
                        //
                        if (!edu.util.objEqualVal(arrHocKy, "ID", objHocKy.ID)) {//if not exit
                            arrHocKy.push(objHocKy);
                        }
                        //
                        arrDinhMucMienGiam.push(dtDinhMucMienGiam[dt]);
                        arrDoiTuong = dtDoiTuong[hp];
                    }
                }
                //2. loaikhoan
                arrLoaiKhoan = me.getUnique_LoaiKhoan(dtKhoanThu, dtDinhMucMienGiam);
                //3. call process
                genTbody(arrHocKy, arrDoiTuong, arrDinhMucMienGiam, arrLoaiKhoan);
                //4. reset
                arrDinhMucMienGiam = [];
                arrHocKy = [];
                arrDoiTuong = [];
                arrLoaiKhoan = [];
            }
        }
        function genTbody(arrHocKy, arrDoiTuong, arrDinhMucMienGiam, arrLoaiKhoan) {

            var stt = 0;
            var strChuongTrinh_Ten = "";
            var strDoiTuong_Ten = "";
            var strHocKy_Ten = "";

            var arrId = "";
            var dPhanTramMienGiam = 0;
            var check = false;

            for (var hk = 0; hk < arrHocKy.length; hk++) {//1.loop HocKy
                stt = (hk + 1);
                strChuongTrinh_Ten = edu.util.returnEmpty(arrDinhMucMienGiam[hk].PHAMVIAPDUNG_TEN);
                strDoiTuong_Ten = edu.util.returnEmpty(arrDinhMucMienGiam[hk].QLSV_DOITUONG_TEN);
                strHocKy_Ten = edu.util.returnEmpty(arrHocKy[hk].TEN);

                //{start: generating row}
                tbody += '<tr>';
                //collage the same strHocPhan_Ten and strHocPhan_Ma
                tbody += '<td class="td-center td-fixed">' + stt + '</td>';
                tbody += '<td class="td-left">' + strChuongTrinh_Ten + '</td>';
                tbody += '<td class="td-left">' + strDoiTuong_Ten + '</td>';
                tbody += '<td class="td-center">' + strHocKy_Ten + '</td>';
                //gen data dPhanTramMienGiam for each HocKy_Id
                for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {//2.loop LoaiKhoan
                    for (var kh = 0; kh < dtKieuHoc.length; kh++) {//3.loop KieuHoc
                        check = false;
                        arrId = arrHocKy[hk].ID + "_" + arrDoiTuong.QLSV_DOITUONG_ID + "_" + arrLoaiKhoan[lk].ID + "_" + dtKieuHoc[kh].ID;
                        var arrKieuHoc = [];

                        for (var dt = arrDinhMucMienGiam.length -1; dt >=0; dt--) {//4.loop DinhMucMienGiam
                            if (arrHocKy[hk].ID == arrDinhMucMienGiam[dt].DAOTAO_THOIGIANDAOTAO_ID
                                && arrDinhMucMienGiam[dt].TAICHINH_CACKHOANTHU_ID == arrLoaiKhoan[lk].ID
                                && arrDinhMucMienGiam[dt].KIEUHOC_ID == dtKieuHoc[kh].ID) {
                                if (arrKieuHoc.indexOf(dtKieuHoc[kh].ID) != -1) continue;
                                arrKieuHoc.push(dtKieuHoc[kh].ID);
                                //has value
                                dPhanTramMienGiam = edu.util.formatCurrency(edu.util.returnZero(arrDinhMucMienGiam[dt].PHANTRAMMIENGIAM));
                                //gen tr
                                tbody += genRow(arrId, dPhanTramMienGiam, arrDinhMucMienGiam[dt].ID);
                                check = true;
                            }
                        }
                        if (!check) {//no value
                            tbody += genRow(arrId, "");
                        }
                    }
                }
                tbody += '</tr>';
                //(end: row}
            }

        }
        function genRow(arrId, dPhanTramMienGiam, strDinhMuc_Id) {
            var tbody = '';
            tbody += '<td class="td-center action-dmmg" id="remark' + arrId + '">';
            tbody += '<span id="zoneDisplay' + arrId + '">';
            tbody += '<span id="value' + arrId + '">' + dPhanTramMienGiam + "</span> <br />";
            tbody += '<span class="hide" id="action' + arrId + '">';
            tbody += '<a id="edit_' + arrId + '" class="btn btn-default btn-circle btnEdit_DMMG" title="Chỉnh sửa"><i class="fa fa-pencil color-active"></i></a>';
            tbody += '<a id="delete_' + strDinhMuc_Id + '" class="btn btn-default btn-circle btnDel_DMMG" title="Xóa"><i class="fa fa-times-circle color-active"></i></a>';
            tbody += '</span>';
            tbody += '</span>';
            tbody += '<span id="zoneEdit' + arrId + '"  style="display: none">';
            tbody += '<input type="text" id="txt' + arrId + '" class="form-control btnUpdate_DMMG" data-ax5formatter="money"/>';
            tbody += '</span>';
            tbody += '</td>';
            return tbody;

        }

        return tbody;
    },
    getUnique_LoaiKhoan: function (dtKhoanThu, dtDinhMucMienGiam) {
        var me = this;;
        var arrLoaiKhoan = [];
        var objLoaiKhoan = {};

        for (var lk = 0; lk < dtKhoanThu.length; lk++) {
            for (var dv = 0; dv < dtDinhMucMienGiam.length; dv++) {
                if (dtDinhMucMienGiam[dv].TAICHINH_CACKHOANTHU_ID == dtKhoanThu[lk].ID) {
                    //objLoaiKhoan
                    objLoaiKhoan = {};
                    objLoaiKhoan.ID = dtKhoanThu[lk].ID;
                    objLoaiKhoan.TEN = dtKhoanThu[lk].TEN;
                    //
                    if (!edu.util.objEqualVal(arrLoaiKhoan, "ID", objLoaiKhoan.ID)) {//if not exit
                        arrLoaiKhoan.push(objLoaiKhoan);
                    }
                }
            }

        }
        return arrLoaiKhoan
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML - DinhMucMienGiam
	--ULR:  
	-------------------------------------------*/
    openBoxEdit_DinhMucMienGiam: function (arrId) {
        //var arrId = edu.util.convertStrToArr(selected_id, "#");
        var $placeEdit = "#zoneEdit" + arrId;
        var $placeDisplay = "#zoneDisplay" + arrId;
        var $value = "#value" + arrId;
        var $input = "#txt" + arrId;
        var value = $($value).html();

        $($placeEdit).show(120);
        $($placeDisplay).hide(120);
        $($input).val(value);
        $($input).focus();

    },
    closeBoxEdit_DinhMucMienGiam: function (arrId) {
        var $placeEdit = "#zoneEdit" + arrId;
        var $placeDisplay = "#zoneDisplay" + arrId;
        var $input = "#txt" + arrId;
        $($placeEdit).hide(120);
        $($placeDisplay).show(120);
        //get value to save
        var arrId = edu.util.convertStrToArr(arrId, "_");
        var value = $($input).val();
        var obj = {
            arrId: arrId,
            value: value
        }
        return obj;
    },
    //affect --> for edit action and delete
    affectUpdate_DinhMucMienGiam: function (strIds, value) {
        var me = this;
        //1. add or update remark
        me.removeAffect_DinhMucMienGiam(strIds);
        var $place = "#remark" + strIds;
        $($place).addClass("bg-default");
        //2. update html new value
        var $newValue = "#value" + strIds;
        $($newValue).html(edu.util.formatCurrency(value));
    },
    affectDelete_DinhMucMienGiam: function (arrId) {
        //2. update html new value
        var $empty = "#value" + arrId;
        $($empty).html("");
    },
    removeAffect_DinhMucMienGiam: function (arrId) {
        var $place = "#removeRemark" + arrId;
        $($place).removeClass("bg-default");
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.DinhMucMienGiam;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = main_doc.DinhMucMienGiam;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.DinhMucMienGiam;

        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };

        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//call only one time
            edu.system.getList_ChuongTrinhDaoTao(obj_ChuongTrinhDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
        }
        else {
            edu.util.objGetDataInData(strKhoaDaoTao_Id, me.dtChuongTrinhDaoTao, "DAOTAO_KHOADAOTAO_ID", me.cbGenCombo_ChuongTrinhDaoTao);
        }
    },
    getList_KhoaDaoTao_Edit: function (strHeDaoTao_Id) {
        var me = main_doc.DinhMucMienGiam;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao_Edit);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao_Edit);
        }
    },
    getList_ChuongTrinhDaoTao_Edit: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.DinhMucMienGiam;

        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };

        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//call only one time
            edu.system.getList_ChuongTrinhDaoTao(obj_ChuongTrinhDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao_Edit_Edit);
        }
        else {
            edu.util.objGetDataInData(strKhoaDaoTao_Id, me.dtChuongTrinhDaoTao, "DAOTAO_KHOADAOTAO_ID", me.cbGenCombo_ChuongTrinhDaoTao_Edit);
        }
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao_DMMG", "dropHeDaoTaoEdit_DMMG"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.DinhMucMienGiam;
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//attch only one time
            me.dtKhoaDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao_DMMG"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.DinhMucMienGiam;
        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//attch only one time
            me.dtChuongTrinhDaoTao = data;
        }
        me.genTable_ChuongTrinhDaoTao(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao_DMMG", "dropChuongTrinhDaoTaoOnModal_DMMG"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_ChuongTrinhDaoTao: function (data, iPager) {
        var me = this;//global variable

        var jsonForm = {
            strTable_Id: "tblInput_ChuongTrinh",
            aaData: data,
            colPos: {
                left: [1, 2],
                center: [0, 3],
                fix: [0, 3]
            },
            aoColumns: [
                {
                    "mDataProp": "MACHUONGTRINH"
                }
                , {
                    "mDataProp": "TENCHUONGTRINH"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    cbGenCombo_KhoaDaoTao_Edit: function (data) {
        var me = main_doc.DinhMucMienGiam;
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//attch only one time
            me.dtKhoaDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTaoEdit_DMMG"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao_Edit: function (data) {
        var me = main_doc.DinhMucMienGiam;
        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//attch only one time
            me.dtChuongTrinhDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTaoEdit_DMMG"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    loadToCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHocKy_DMMG", "dropThoiGianDaoTaoEdit_DMMG"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KieuHoc: function (data) {
        var me = main_doc.DinhMucMienGiam;
        me.dtKieuHoc = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKieuHoc_DMMG", "dropKieuHocEdit_DMMG"],
            type: "",
            title: "Chọn kiểu học",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KhoanThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoanThu_DMMG", "dropLoaiKhoanEdit_DMMG"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGianDaoTao: function () {
        var me = this;
        var strDAOTAO_Nam_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.loadToCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LoaiKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.genComBo_KhoanThu(dtResult);
                    me.dtKhoanThu = dtResult;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KieuHoc: function (resolve, reject) {
        var me = this;
        var obj = {
            strMaBangDanhMuc: "KHDT.DIEM.KIEUHOC"
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genComBo_KieuHoc);
        /////////////////////////////
    },
    /*------------------------------------------
    --Discription: [4] ACESS DB DanhMUc_DoiTuong
    --ULR:  
    -------------------------------------------*/
    getList_DoiTuong: function (strChuongTrinh_Id) {
        var me = this;
        var obj = {
            strMaBangDanhMuc: "QLTC.DTMG"
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenTreejs_DoiTuong);
    },
    /*------------------------------------------
    --Discription: [4] GEN HTML DoiTuong
    --ULR:  
    -------------------------------------------*/
    cbGenTreejs_DoiTuong: function (data) {
        var me = main_doc.DinhMucMienGiam;
        var strDoiTuong_Text = "";

        me.strDoiTuong_Id = "";
        me.dtDoiTuong = data;
        me.cbGenComBo_DoiTuong(data);
        //1. Gen
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_treejs_doituong"]
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_treejs_doituong').on("select_node.jstree", function (e, data) {
            me.strDoiTuong_Id = data.node.id;
            strDoiTuong_Text = data.node.li_attr.title;//title --> full info, text --> a part infor (30 characters).
            //2.1 call main action
            me.getList_DinhMucMienGiam();
            //2.2 bind text
            edu.util.viewHTMLById("lblDoiTuong", strDoiTuong_Text);
            //3.active on dropDoiTuong
            $("#dropDoiTuong_DMMG").val(me.strDoiTuong_Id).trigger("change");

            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
        });
    },
    cbGenComBo_DoiTuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropDoiTuong_DMMG"],
            type: "",
            title: "Chọn đối tượng",
        }
        edu.system.loadToCombo_data(obj);
    },
}