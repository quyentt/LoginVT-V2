/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function TieuChiThuong() { }
TieuChiThuong.prototype = {
    dtTieuChiThuong: [],
    strTieuChiThuong_Id: '',

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
        $("#txtSearch_TieuChiThuong_TuKhoa").focus();
        $("#txtSearch_TieuChiThuong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TieuChiThuong();
            }
        });
        /*------------------------------------------
        --Discription: [1] Action TieuChiThuong
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_TieuChiThuong").click(function () {
            me.getList_TieuChiThuong();
        });
        $("#btnSave_TieuChiThuong").click(function () {
            if (edu.util.checkValue(me.strTieuChiThuong_Id)) {
                me.update_TieuChiThuong();
            }
            else {
                me.save_TieuChiThuong();
            }
        });
        //$("#tblTieuChiThuong").delegate(".btnView", "click", function () {
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/view_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        me.rewrite();
        //        me.toggle_detail();
        //        me.strTieuChiThuong_Id = strId;
        //        me.getDetail_TieuChiThuong(strId, constant.setting.ACTION.VIEW);
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        $("#tblTieuChiThuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strTieuChiThuong_Id = strId;
                me.getDetail_TieuChiThuong(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "//});");

            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTieuChiThuong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TieuChiThuong(strId);
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
        --Discription: [1] Load TieuChiThuong
        -------------------------------------------*/
        me.getList_TieuChiThuong();
        setTimeout(function () {
            me.getList_KeHoach();
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_TieuChiThuong");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_TieuChiThuong");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_TieuChiThuong");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strTieuChiThuong_Id = "";
        var arrId = ["dropTieuChiThuong_KeHoach", "txtTieuChiThuong_Ten", "txtTieuChiThuong_DiemChuan", "txtTieuChiThuong_ThuTu"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TieuChiThuong
    -------------------------------------------*/
    getList_TieuChiThuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_PLDG_LTT_TieuChiThuong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TieuChiThuong_TuKhoa"),
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById("dropSearch_TieuChiThuong_KeHoach"),
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
                        me.dtTieuChiThuong = dtResult;
                    }
                    me.genTable_TieuChiThuong(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChiThuong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChiThuong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_TieuChiThuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_TieuChiThuong/ThemMoi',
            

            'strId': "",
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById("dropTieuChiThuong_KeHoach"),
            'strTieuChi': edu.util.getValById("txtTieuChiThuong_Ten"),
            'iThuTu': edu.util.getValById("txtTieuChiThuong_ThuTu"),
            'dDiemChuan': edu.util.getValById("txtTieuChiThuong_DiemChuan"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_TieuChiThuong();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChiThuong/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChiThuong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_TieuChiThuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_TieuChiThuong/CapNhat',
            

            'strId': me.strTieuChiThuong_Id,
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById("dropTieuChiThuong_KeHoach"),
            'strTieuChi': edu.util.getValById("txtTieuChiThuong_Ten"),
            'iThuTu': edu.util.getValById("txtTieuChiThuong_ThuTu"),
            'dDiemChuan': edu.util.getValById("txtTieuChiThuong_DiemChuan"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_TieuChiThuong();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChiThuong/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChiThuong/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TieuChiThuong: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_LTT_TieuChiThuong/Xoa',
            

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
                    me.getList_TieuChiThuong();
                }
                else {
                    obj = {
                        content: "NS_PLDG_LTT_TieuChiThuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_LTT_TieuChiThuong/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML TieuChiThuong
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TieuChiThuong: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblTieuChiThuong_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblTieuChiThuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TieuChiThuong.getList_TieuChiThuong()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TIEUCHI) + "</span><br />";
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
    getDetail_TieuChiThuong: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtTieuChiThuong, "ID", me.viewEdit_TieuChiThuong);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtTieuChiThuong, "ID", me.viewDetail_TieuChiThuong);
                break;
        }
    },
    viewEdit_TieuChiThuong: function (data) {
        var me = this;
        var dtTieuChiThuong = data[0];
        //View - Thong tin
        edu.util.viewValById("dropTieuChiThuong_KeHoach", dtTieuChiThuong.NHANSU_DGPL_LTT_KEHOACH_ID);
        edu.util.viewValById("txtTieuChiThuong_Ten", dtTieuChiThuong.TIEUCHI);
        edu.util.viewValById("txtTieuChiThuong_DiemChuan", dtTieuChiThuong.DIEMCHUAN);
        edu.util.viewValById("txtTieuChiThuong_ThuTu", dtTieuChiThuong.THUTU);
    },
    viewDetail_TieuChiThuong: function (data) {
        var me = main_doc.TieuChiThuong;
        var dtTieuChiThuong = data[0];
        //View - Thong tin
        edu.util.viewHTMLById("lblTieuChiThuong_KeHoach", dtTieuChiThuong.NHANSU_DGPL_LTT_KEHOACH_TEN);
        edu.util.viewHTMLById("lblTieuChiThuong_Ten", dtTieuChiThuong.TIEUCHI);
        edu.util.viewHTMLById("lblTieuChiThuong_DiemChuan", dtTieuChiThuong.DIEMCHUAN);
        edu.util.viewHTMLById("lblTieuChiThuong_ThuTu", dtTieuChiThuong.THUTU);
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
            renderPlace: ["dropTieuChiThuong_KeHoach", "dropSearch_TieuChiThuong_KeHoach"],
            type: "",
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    }
};