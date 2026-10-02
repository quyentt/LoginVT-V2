/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function QuyDinh() { }
QuyDinh.prototype = {
    dtQuyDinh: [],
    strQuyDinh_Id: '',

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
        $("#txtSearch_QuyDinh_TuKhoa").focus();
        $("#txtSearch_QuyDinh_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuyDinh();
            }
        });
        /*------------------------------------------
        --Discription: [1] Action QuyDinh
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_QuyDinh").click(function () {
            me.getList_QuyDinh();
        });
        $("#btnSave_QuyDinh").click(function () {
            if (edu.util.checkValue(me.strQuyDinh_Id)) {
                me.update_QuyDinh();
            }
            else {
                me.save_QuyDinh();
            }
        });
        //$("#tblQuyDinh").delegate(".btnView", "click", function () {
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/view_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        me.rewrite();
        //        me.toggle_detail();
        //        me.strQuyDinh_Id = strId;
        //        me.getDetail_QuyDinh(strId, constant.setting.ACTION.VIEW);
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        $("#tblQuyDinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strQuyDinh_Id = strId;
                me.getDetail_QuyDinh(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblQuyDinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuyDinh").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuyDinh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [1] Action TieuChi
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_QuyDinh_LoaiApDung").change("select:select2", function () {
            var strId = $("#dropSearch_QuyDinh_LoaiApDung").val();
            me.getList_TieuChi(strId, "dropSearch_QuyDinh_TieuChi");
        });
        $("#dropQuyDinh_LoaiApDung").change("select:select2", function () {
            var strId = $("#dropQuyDinh_LoaiApDung").val();
            me.getList_TieuChi(strId, "dropQuyDinh_TieuChi");
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
        --Discription: [1] Load QuyDinh
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_QuyDinh();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.XLTL, "dropQuyDinh_XepLoai,dropSearch_QuyDinh_XepLoai");
                setTimeout(function () {
                    me.getList_KeHoach();
                }, 50);
            }, 50);
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_QuyDinh");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QuyDinh");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QuyDinh");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strQuyDinh_Id = "";
        var arrId = ["dropQuyDinh_KeHoach", "txtQuyDinh_DiemCanDuoi", "txtQuyDinh_DiemCanTren", "dropQuyDinh_XepLoai"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB QuyDinh
    -------------------------------------------*/
    getList_QuyDinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_PLDG_LTT_QuyDinh/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_QuyDinh_TuKhoa"),
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById(""),
            'strNguoiThucHien_Id': "",
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
                        me.dtQuyDinh = dtResult;
                    }
                    me.genTable_QuyDinh(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_QuyDinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_QuyDinh/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QuyDinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_QuyDinh/ThemMoi',
            

            'strId': "",
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById("dropQuyDinh_KeHoach"),
            'dMucDiemCanDuoi': edu.util.getValById("txtQuyDinh_DiemCanDuoi"),
            'dMucDiemCanTren': edu.util.getValById("txtQuyDinh_DiemCanTren"),
            'strXepLoai_Id': edu.util.getValById("dropQuyDinh_XepLoai"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_QuyDinh();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_QuyDinh/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_QuyDinh/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_QuyDinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_QuyDinh/CapNhat',
            

            'strId': me.strQuyDinh_Id,
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById("dropQuyDinh_KeHoach"),
            'dMucDiemCanDuoi': edu.util.getValById("txtQuyDinh_DiemCanDuoi"),
            'dMucDiemCanTren': edu.util.getValById("txtQuyDinh_DiemCanTren"),
            'strXepLoai_Id': edu.util.getValById("dropQuyDinh_XepLoai"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QuyDinh();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_QuyDinh/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_QuyDinh/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyDinh: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_LTT_QuyDinh/Xoa',
            

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
                    me.getList_QuyDinh();
                }
                else {
                    obj = {
                        content: "NS_PLDG_LTT_QuyDinh/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_LTT_QuyDinh/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuyDinh: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyDinh_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQuyDinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDinh.getList_QuyDinh()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.XEPLOAI_TEN) + " (" + edu.util.returnEmpty(aData.MUCDIEMCANDUOI, "NUM") + " - " + edu.util.returnEmpty(aData.MUCDIEMCANTREN, "NUM") + ")" +"</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        //html += '<a class="btn btn-default btn-circle btnEdit" id="edit_' + aData.ID + '" href="#" title="Edit"><i class="fa fa-pencil color-active"></i></a>';
                        //html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_QuyDinh: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtQuyDinh, "ID", me.viewEdit_QuyDinh);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtQuyDinh, "ID", me.viewDetail_QuyDinh);
                break;
        }
    },
    viewEdit_QuyDinh: function (data) {
        var me = this;
        var dtQuyDinh = data[0];
        //View - Thong tin
        edu.util.viewValById("dropQuyDinh_KeHoach", dtQuyDinh.NHANSU_DGPL_LTT_KEHOACH_ID);
        edu.util.viewValById("txtQuyDinh_DiemCanDuoi", dtQuyDinh.MUCDIEMCANDUOI);
        edu.util.viewValById("txtQuyDinh_DiemCanTren", dtQuyDinh.MUCDIEMCANTREN);
        edu.util.viewValById("dropQuyDinh_XepLoai", dtQuyDinh.XEPLOAI_ID);
    },
    viewDetail_QuyDinh: function (data) {
        var me = main_doc.QuyDinh;
        var dtQuyDinh = data[0];
        //View - Thong tin
        edu.util.viewHTMLById("lblQuyDinh_KeHoach", dtQuyDinh.NHANSU_DGPL_LTT_KEHOACH_TEN);
        edu.util.viewHTMLById("lblQuyDinh_DiemCanDuoi", dtQuyDinh.MUCDIEMCANDUOI);
        edu.util.viewHTMLById("lblQuyDinh_DiemCanTren", dtQuyDinh.MUCDIEMCANTREN);
        edu.util.viewHTMLById("lblQuyDinh_XepLoai", dtQuyDinh.XEPLOAI_TEN);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML KeHoach
    --ULR:  Modules
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_PLDG_LTT_KeHoach/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById(""),
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 100000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KeHoach(dtResult);
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
    genCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA"
            },
            renderPlace: ["dropQuyDinh_KeHoach", "dropSearch_QuyDinh_KeHoach"],
            type: "",
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    }
};