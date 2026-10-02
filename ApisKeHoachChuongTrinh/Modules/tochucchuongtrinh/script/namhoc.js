/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 23/04/2019
--Input: 
--Output:
--API URL: KHCT/HeDaoTao
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function NamHoc() { };
NamHoc.prototype = {
    strNamHoc_Id: '',
    treenode: '',
    dtTab: '',
    dtNamHoc: '',//danh sách năm học

    init: function () {
        var me = this;
        me.page_load();
        me.getList_NamHoc();
        //edu.system.loadToCombo_DanhMucDuLieu("TKGG.HEDT", "dropHP_HeDaoTao");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.COSODAOTAO", "dropHP_CoSoDaoTao"); //
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_NamHoc()();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NamHoc();
            }
        });
        $(".btnRefresh").click(function () {
            me.getList_NamHoc();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strNamHoc_Id)) {
                me.update_NamHoc();
            }
            else {
                me.save_NamHoc();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strNamHoc_Id)) {
                me.update_NamHoc();
            }
            else {
                me.save_NamHoc();
            }
            me.rewrite();
        });
        $("#tblNamHoc").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strNamHoc_Id = strId;
                me.getDetail_NamHoc(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblNamHoc");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNamHoc").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_NamHoc(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNamHoc", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_NamHoc(arrChecked_Id.toString());
            });
        });
        $("#tblNamHoc").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblNamHoc", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNamHoc" });
        });
        //me.arrValid_HeDaoTao = [
        //    //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        //    { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        //];
        //edu.system.loadToCombo_DanhMucDuLieu("TKGG.HTDT", "dropHinhThucDaoTao");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.BACDAOTAO", "dropBacDaoTao");
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_NamHoc();
        setTimeout(function () {
            //me.getList_HS();
        }, 150);
    },
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = main_doc.NamHoc;
        me.strId = "";
        edu.util.resetValById("txtNamHoc");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_NamHoc");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_NamHoc");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //  
        me.strNamHoc_Id = "";
        var arrId = ["txtNamHoc"];
        edu.util.resetValByArrId(arrId);
    },
    
    getList_NamHoc: function () {
        var me = main_doc.NamHoc;

        //--Edit
        var obj_list = {
            'action': 'KHCT_NamHoc/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'dTRANGTHAI': "",
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
                    }
                    me.genTable_NamHoc(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_NamHoc: function (strId) {
        var me = main_doc.NamHoc;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_NamHoc/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_NamHoc(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NamHoc: function (Ids) {
        var me = main_doc.NamHoc;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_NamHoc/Xoa',
            
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_NamHoc();
            },
            error: function (er) {
                
                edu.system.afterComfirm(er);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_NamHoc: function (data, iPager) {
        var me = main_doc.NamHoc;
        $("#lblNamHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNamHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NamHoc.getList_NamHoc()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                center: [0, 2, 3],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Năm học: '+ edu.util.returnEmpty(aData.NAMHOC) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //},
                {
                    "mDataProp": "NAMHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },
    viewForm_NamHoc: function (data) {
        var me = main_doc.NamHoc;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtNamHoc", data.NAMHOC);
    },
    save_NamHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_NamHoc/ThemMoi',
            

            'strId': '',
            'dNamHoc': edu.util.getValById("txtNamHoc"),
            'dTRANGTHAI': 1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                        
                    }

                    setTimeout(function () {
                        me.getList_NamHoc();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_NamHoc: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_NamHoc/CapNhat',
            

            'strId': me.strNamHoc_Id,
            'dNamHoc': edu.util.getValById("txtNamHoc"),
            'dTRANGTHAI': 1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNamHoc_Id = me.strNamHoc_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_NamHoc();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //viewEdit_NamHoc: function (data) {
    //    var me = this;
    //    var dt = data[0];
    //    edu.util.viewValById("txtNamHoc", data[0].NAMHOC);
    //},
};