/*----------------------------------------------
--Author:   
--Phone: 
--Date of created: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function CoCauToChuc() { }
CoCauToChuc.prototype = {
    arrValid_CCTC: [],
    dtCCTC: '',
    strCCTC_Id: '',

    init: function () {
        var me = this;
        me.pageLoad();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_detail();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            edu.util.viewHTMLById("lblForm_CCTC", '<i class="fa fa-plus"</i> Thêm mới');
            me.toggle_form();
        });
        $("#zone_action_cctc").delegate(".btnEdit_CCTC", "click", function () {
            if (edu.util.checkValue(me.strCCTC_Id)) {
                me.toggle_form();
                edu.util.viewHTMLById("lblForm_CCTC", '<i class="fa fa-pencil"</i> Chỉnh sửa');
                me.getDetail_CCTC(me.strCCTC_Id, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zone_action_cctc").delegate(".btnDelete_CCTC", "click", function () {
            if (edu.util.checkValue(me.strCCTC_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_CCTC();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [1] Action CCTC
        --Order: 
        -------------------------------------------*/
        $("#btnSave_CCTC").click(function () {
            //save
            if (edu.util.checkValue(me.strCCTC_Id)) {
                me.update_CCTC();
            }
            else {
                me.save_CCTC();
            }
        });
        $("#btnRewrite_CCTC").click(function () {
            me.rewrite();
        });
        /*------------------------------------------
        --Discription: [1] Action CCTC
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_CCTC_Loai").on("select2:select", function () {
            me.getList_CCTC();
            me.rewrite();
            $("#dropCCTC_Loai").val($(this).find('option:selected').val()).trigger("change")
        });
        $("#txtSearch_CCTC_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_CCTC_treejs ul li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            }).css("color", "red");
        });
        $("#txtSearch_CCTC_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CCTC();
            }
        });
    },
    /*----------------------------------------------
    --Discription: function common
    ----------------------------------------------*/
    pageLoad: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.toggle_detail();
        //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
        me.arrValid_CCTC = [
            { "MA": "txtCCTC_Ten", "THONGTIN1": "EM" },
            { "MA": "txtCCTC_Ma", "THONGTIN1": "EM" },
            { "MA": "txtCCTC_ThuTuHienThi", "THONGTIN1": "EM#IN" },
            { "MA": "dropCCTC_Loai", "THONGTIN1": "EM" }
        ];
        setTimeout(function () {
            me.getList_CCTC();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu("NS.LCTC", "dropCCTC_Loai,dropSearch_CCTC_Loai");
            }, 50);
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-cctc", "zone_detail_cctc");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-cctc", "zone_input_cctc");
        $("#txtCCTC_Ten").focus();
    },

    rewrite: function () {
        var me = this;
        edu.util.resetValById("txtCCTC_Ten");
        edu.util.resetValById("txtCCTC_Ma");
        edu.util.resetValById("dropCCTC_Loai");
        edu.util.resetValById("dropCCTC_DuLieuCha");
        edu.util.resetValById("txtCCTC_GhiChu");
        //
        edu.util.viewHTMLById("lblCCTC_Ten", "");
        edu.util.viewHTMLById("lblCCTC_Ma", "");
        edu.util.viewHTMLById("lblCCTC_Loai", "");
        edu.util.viewHTMLById("lblCCTC_DuLieuCha", "");
        edu.util.viewHTMLById("lblCCTC_GhiChu", "");
        me.strCCTC_Id = "";
        $("#zone_action_cctc").append('');
    },
    genAction: function () {
        var html = '';
        html += '<a class="btn btn-default btnEdit_CCTC"><i class="fa fa-pencil"></i> <span class="lang" key="">Sửa</span></a>';
        html += '<a class="btn btn-default btnDelete_CCTC"> <i class="fa fa-trash"></i> <span class="lang" key="">Xóa</span></a>';
        $("#zone_action_cctc").html(html);
    },
    /*----------------------------------------------
    --Discription: Danh mục vai trò
    --API:  Common/Controller/sysCCTC
    ----------------------------------------------*/
    save_CCTC: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_CoCauToChucNgoai/ThemMoi',
            
            
            'strTen': edu.util.getValById("txtCCTC_Ten"),
            'strMa': edu.util.getValById("txtCCTC_Ma"),
            'strDaoTao_Loai_Id': edu.util.getValById("dropCCTC_Loai"),
            'strDaoTao_CoCau_Cha_Id': edu.util.getValById("dropCCTC_DuLieuCha"),
            'iThuTu': 1,
            'iTrangThai': 1,
            'strGhiChu': edu.util.getValById("txtCCTC_GhiChu"),
            'strThongTinNguoiDungDau': edu.util.getValById("txtCCTC_GhiChu"),
            'strFax': edu.util.getValById("txtCCTC_GhiChu"),
            'strWebSite': edu.util.getValById("txtCCTC_GhiChu"),
            'strId': ""
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_CCTC();
                }
                else {
                    edu.system.alert("NS_CoCauToChucNgoai/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_CoCauToChucNgoai/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_CCTC: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_CoCauToChucNgoai/CapNhat',
            

            'strTen': edu.util.getValById("txtCCTC_Ten"),
            'strMa': edu.util.getValById("txtCCTC_Ma"),
            'strDaoTao_Loai_Id': edu.util.getValById("dropCCTC_Loai"),
            'strDaoTao_CoCau_Cha_Id': edu.util.getValById("dropCCTC_DuLieuCha"),
            'iThuTu': 1,
            'iTrangThai': 1,
            'strThongTinNguoiDungDau': edu.util.getValById("txtCCTC_GhiChu"),
            'strFax': edu.util.getValById("txtCCTC_GhiChu"),
            'strWebSite': edu.util.getValById("txtCCTC_GhiChu"),
            'strGhiChu': edu.util.getValById("txtCCTC_GhiChu"),
            'strId': me.strCCTC_Id
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_CCTC();
                    me.rewrite();
                }
                else {
                    edu.system.alert("NS_CoCauToChucNgoai/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_CoCauToChucNgoai/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CCTC: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_CoCauToChucNgoai/LayDanhSach',
            

            'iTrangThai': 1,
            'strLoaiCoCauToChuc_Id': edu.util.getValById("dropSearch_CCTC_Loai"),
            'strCoCauToChucCha_Id': ""
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtCCTC = dtResult;
                    me.genCombo_CCTC();
                    me.genTreeJs_CCTC(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_CoCauToChucNgoai/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("NS_CoCauToChucNgoai/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_CCTC: function (strId, strAction) {
        var me = this;

        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtCCTC, "ID", me.viewEdit_CCTC);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtCCTC, "ID", me.viewDetail_CCTC);
                break;
        }
    },
    delete_CCTC: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_CoCauToChucNgoai/Xoa',
            
            'strId': me.strCCTC_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.rewrite();
                    me.getList_CCTC();
                }
                else {
                    edu.system.alert("NS_CoCauToChucNgoai/Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_CoCauToChucNgoai/Xoa (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: Generating html on interface
    --ULR:  Modules/CCTC/Templates/CCTC
    ----------------------------------------------*/
    genTreeJs_CCTC: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblCCTC_Tong", dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_CCTC_treejs"],
            style: "fa fa-institution color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_CCTC_treejs').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            me.strCCTC_Id = strNameNode;
            me.getDetail_CCTC(strNameNode, constant.setting.ACTION.VIEW);
            me.genAction();
            me.toggle_detail();
            //----------------------------------------------------------------------------------------------
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
            //---------------------------------------------------------------------------------------------------------
        });
    },
    viewDetail_CCTC: function (data) {
        var me = this;
        //view data
        edu.util.viewHTMLById("lblCCTC_Ten", data[0].TEN);
        edu.util.viewHTMLById("lblCCTC_Ma", data[0].MA);
        edu.util.viewHTMLById("lblCCTC_Loai", data[0].DAOTAO_LOAICOCAUTOCHUC);
        edu.util.viewHTMLById("lblCCTC_DuLieuCha", data[0].DAOTAO_COCAUTOCHUC_CHA);
        edu.util.viewHTMLById("lblCCTC_GhiChu", data[0].GHICHU);
    },
    viewEdit_CCTC: function (data) {
        var me = this;
        //view data
        edu.util.viewValById("txtCCTC_Ten", data[0].TEN);
        edu.util.viewValById("txtCCTC_Ma", data[0].MA);
        edu.util.viewValById("dropCCTC_Loai", data[0].DAOTAO_LOAICOCAUTOCHUC_ID);
        edu.util.viewValById("dropCCTC_DuLieuCha", data[0].DAOTAO_COCAUTOCHUC_CHA_ID);
        edu.util.viewValById("txtCCTC_GhiChu", data[0].GHICHU);
    },
    genCombo_CCTC: function () {
        var me = this;
        var obj = {
            data: me.dtCCTC,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropCCTC_DuLieuCha"],
            type: "",
            title: "Chọn cơ cấu tổ chức cha"
        };
        edu.system.loadToCombo_data(obj);
    }
};