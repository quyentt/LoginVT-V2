/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/04/2019
--Input: 
--Output:
--API URL: KeHoachToChuc/MonHoc
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function MonHoc() { };
MonHoc.prototype = {
    strMonHoc_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtMonHoc: '',//danh sach mon hoc

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_MonHoc();
        me.getList_CoCauToChuc();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnRefresh").click(function () {
            me.getList_MonHoc();
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
            if (edu.util.checkValue(me.strMonHoc_Id)) {
                me.update_MonHoc();
            }
            else {
                me.save_MonHoc();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strMonHoc_Id)) {
                me.update_MonHoc();
            }
            else {
                me.save_MonHoc();
            }
            me.rewrite();
        });

        $("#btnSearch").click(function () {
            me.getList_MonHoc();
        });
        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_MonHoc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_MonHoc();
            }
        });

        $("#tblMonHoc").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strMonHoc_Id = strId;
                me.getDetail_MonHoc(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblMonHoc");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblMonHoc").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_MonHoc(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMonHoc", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            //edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_MonHoc(arrChecked_Id.toString());
            });
        });
        $("#tblMonHoc").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblMonHoc", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblMonHoc" });
        });
        //$("#btnSearch").click(function () {
        //    me.getList_MonHoc("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_BoMon"));
        //});
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMonHoc", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn chương trình cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_MonHoc(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_MonHoc]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblMonHoc" });
        });
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_MonHoc");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_MonHoc");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strMonHoc_Id = "";
        edu.util.viewValById("dropBoMon", edu.util.getValById('dropSearch_BoMon'));
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtCT_SoTinChi", "");
        edu.util.viewValById("txtCT_KyHieu", "");
    },
    
    save_MonHoc: function () {
        var me = main_doc.MonHoc;
        //--Edit
        var obj_save = {
            'action': 'KHCT_MonHoc/ThemMoi',
            

            'strId': '',
            'strTen': edu.util.getValById("txtTen"),
            'strMa': edu.util.getValById("txtMa"),
            'dHocTrinh': edu.util.getValById("txtCT_SoTinChi"),
            'strThuocBoMon_Id': edu.util.getValById("dropBoMon"),
            'strKyHieu': edu.util.getValById("txtCT_KyHieu"),
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
                        me.getList_MonHoc();
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

    update_MonHoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_MonHoc/CapNhat',
            

            'strId': me.strMonHoc_Id,
            'strTen': edu.util.getValById("txtTen"),
            'strMa': edu.util.getValById("txtMa"),
            'dHocTrinh': edu.util.getValById("txtCT_SoTinChi"),
            'strThuocBoMon_Id': edu.util.getValById("dropBoMon"),
            'strKyHieu': edu.util.getValById("txtCT_KyHieu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strMonHoc_Id = me.strMonHoc_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_MonHoc();
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
    getList_MonHoc: function () {
        var me = main_doc.MonHoc;

        //--Edit
        var obj_list = {
            'action': 'KHCT_MonHoc/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strThuocBoMon_Id': edu.util.getValById("dropSearch_BoMon"),
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
                    me.genTable_MonHoc(dtResult, iPager);
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
    getDetail_MonHoc: function (strId) {
        var me = main_doc.MonHoc;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_MonHoc/LayChiTiet',
            
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
                        me.viewForm_MonHoc(data.Data[0]);
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
    delete_MonHoc: function (Ids) {
        var me = main_doc.MonHoc;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_MonHoc/Xoa',
            
            'strIds': Ids,
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
                    me.getList_MonHoc();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_MonHoc: function (data, iPager) {
        var me = main_doc.MonHoc;
        $("#lblMonHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblMonHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.MonHoc.getList_MonHoc()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 4, 5, 6],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên môn học: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Số tín chỉ: ' + edu.util.returnEmpty(aData.HOCTRINH) + "</span><br />";
                //        html += '<span>' + 'Bộ môn: ' + edu.util.returnEmpty(aData.THUOCBOMON_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
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
        
        /*III. Callback*/
    },
    viewForm_MonHoc: function (data) {
        var me = main_doc.MonHoc;
        //call popup --Edit
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("dropBoMon", data.THUOCBOMON_ID);
        edu.util.viewValById("txtCT_SoTinChi", data.HOCTRINH);
        edu.util.viewValById("txtCT_KyHieu", data.KYHIEU);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> CCTC
    --Author: duyentt
	-------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.MonHoc;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropBoMon", "dropSearch_BoMon"],
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
}