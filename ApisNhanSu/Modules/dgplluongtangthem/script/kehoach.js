/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function KeHoach() { }
KeHoach.prototype = {
    dtLuongTangThem: [],
    strLuongTangThem_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [1] Action LuongTangThem
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_KeHoach").click(function () {
            me.getList_KeHoach();
        });
        $("#btnSave_KeHoach").click(function () {
            if (edu.util.checkValue(me.strLuongTangThem_Id)) {
                me.update_KeHoach();
            }
            else {
                me.save_KeHoach();
            }
        });
        $("#tblKeHoach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strLuongTangThem_Id = strId;
                me.getDetail_KeHoach(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblKeHoach");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoach").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KeHoach(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load LuongTangThem
        -------------------------------------------*/
        me.getList_KeHoach();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_KeHoach");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KeHoach");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KeHoach");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strLuongTangThem_Id = "";
        var arrId = ["txtKeHoach_Ten", "txtKeHoach_TuNgay", "txtKeHoach_DenNgay", "txtKeHoach_NoiDung"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB LuongTangThem
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_PLDG_LTT_KeHoach/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiThucHien_Id': '',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtLuongTangThem = dtResult;
                    }
                    me.genTable_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_KeHoach/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_KeHoach/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_KeHoach/ThemMoi',
            

            'strId': "",
            'strTenKeHoach': edu.util.getValById("txtKeHoach_Ten"),
            'strTuNgay': edu.util.getValById("txtKeHoach_TuNgay"),
            'strDenNgay': edu.util.getValById("txtKeHoach_DenNgay"),
            'strNoiDung': edu.util.getValById("txtKeHoach_NoiDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_KeHoach();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_KeHoach/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_KeHoach/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_KeHoach/CapNhat',
            

            'strId': me.strLuongTangThem_Id,
            'strTenKeHoach': edu.util.getValById("txtKeHoach_Ten"),
            'strTuNgay': edu.util.getValById("txtKeHoach_TuNgay"),
            'strDenNgay': edu.util.getValById("txtKeHoach_DenNgay"),
            'strNoiDung': edu.util.getValById("txtKeHoach_NoiDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_KeHoach();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_KeHoach/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_KeHoach/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoach: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_LTT_KeHoach/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoach();
                }
                else {
                    obj = {
                        content: "NS_PLDG_LTT_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_LTT_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML LuongTangThem
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblaiBaoTN_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENKEHOACH) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_KeHoach: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtLuongTangThem, "ID", me.viewEdit_KeHoach);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtLuongTangThem, "ID", me.viewDetail_KeHoach);
                break;
        }
    },
    viewEdit_KeHoach: function (data) {
        var me = this;
        var dtLuongTangThem = data[0];
        //View - Thong tin
        edu.util.viewValById("txtKeHoach_Ten", dtLuongTangThem.TENKEHOACH);
        edu.util.viewValById("txtKeHoach_TuNgay", dtLuongTangThem.TUNGAY);
        edu.util.viewValById("txtKeHoach_DenNgay", dtLuongTangThem.DENNGAY);
        edu.util.viewValById("txtKeHoach_NoiDung", dtLuongTangThem.NOIDUNG);
    },
    viewDetail_KeHoach: function (data) {
        var me = main_doc.LuongTangThem;
        var dtLuongTangThem = data[0];
        //View - Thong tin
        edu.util.viewHTMLById("lblKeHoach_Ten", dtLuongTangThem.TENKEHOACH);
        edu.util.viewHTMLById("lblKeHoach_TuNgay", dtLuongTangThem.TUNGAY);
        edu.util.viewHTMLById("lblKeHoach_DenNgay", dtLuongTangThem.DENNGAY);
        edu.util.viewHTMLById("lblKeHoach_NoiDung", dtLuongTangThem.NOIDUNG);
    }
};