/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/ChuongTrinh
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DiemDacBiet() { };
DiemDacBiet.prototype = {
    treenode: '',
    strDiemDacBiet_Id: '',
    dtTab: '',
    dtDiemDacBiet: [],
    arrValid_DiemDacBiet: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_DiemDacBiet();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_DiemDacBiet();
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
            if (edu.util.checkValue(me.strDiemDacBiet_Id)) {
                me.update_DiemDacBiet();
            }
            else {
                me.save_DiemDacBiet();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strDiemDacBiet_Id)) {
                me.update_DiemDacBiet();
            }
            else {
                me.save_DiemDacBiet();
            }
            me.rewrite();
        });

        $("#dropSearch_LoaiDiem").on("select2:select", function () {
            me.getList_DiemDacBiet();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DiemDacBiet();

            }
        });
        $("#tblDiemDacBiet").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strDiemDacBiet_Id = strId;
                me.getDetail_DiemDacBiet(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblDiemDacBiet");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDiemDacBiet").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DiemDacBiet(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_DiemDacBiet("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_LoaiDiem"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDiemDacBiet", "checkDiemDacBiet");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn điểm đặc biệt cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_DiemDacBiet(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_DiemDacBiet]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDiemDacBiet" });
        });
        $("#tblDiemDacBiet").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblDiemDacBiet", regexp: /checkX/g, });
        });
        //$("[id$=chkSelectAll_ChuongTrinh]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "lblThamSoHocTapChung_Tong" });
        //});

        me.arrValid_DiemDacBiet = [
            { "MA": "txtDiemDacBiet_Ten", "THONGTIN1": "EM" },
            { "MA": "txtDiemDacBiet_Ma", "THONGTIN1": "EM" },
            { "MA": "dropLoaiDiem", "THONGTIN1": "EM" },
            { "MA": "txtDiemDacBiet_GiaTriXuLy", "THONGTIN1": "EM" },
        ];
        //toggle_input_ThamSoHocTapChung: function () {
        //    edu.util.toggle_overide("zone-bus", "zone_input_ThamSoHocTapChung");
        //};
        //toggle_list_ChuongTrinh: function () {
        //    edu.util.toggle_overide("zone-bus", "zone_list_ChuongTrinh");
        //};
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropCT_DaoTao_N_CN");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDIEMDACBIET", "dropSearch_LoaiDiem, dropLoaiDiem");
    },
    page_load: function () {
        var me = this;
       
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_DiemDacBiet();
        }, 150);
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_DiemDacBiet");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_DiemDacBiet");
    },
    //toggle_detail: function () {
    //    edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    //},

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDiemDacBiet_Id = "";
        edu.util.viewValById("dropLoaiDiem", edu.util.getValById('dropSearch_LoaiDiem'));
        edu.util.viewValById("txtDiemDacBiet_Ten", "");
        edu.util.viewValById("txtDiemDacBiet_Ma", "");
        edu.util.viewValById("txtDiemDacBiet_GiaTriXuLy", "");
    },

    save_DiemDacBiet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_DiemDacBiet/ThemMoi',
            

            'strId': '',
            'strMa': edu.util.getValById("txtDiemDacBiet_Ma"),
            'strTen': edu.util.getValById("txtDiemDacBiet_Ten"),
            'strGiaTriXuLy': edu.util.getValById("txtDiemDacBiet_GiaTriXuLy"),
            'strLoaiDiem_Id': edu.util.getValById("dropLoaiDiem"),
            'dThuTu': "",
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
                        me.getList_DiemDacBiet();
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
    update_DiemDacBiet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_DiemDacBiet/CapNhat',
            

            'strId': me.strDiemDacBiet_Id,
            'strMa': edu.util.getValById("txtDiemDacBiet_Ma"),
            'strTen': edu.util.getValById("txtDiemDacBiet_Ten"),
            'strGiaTriXuLy': edu.util.getValById("txtDiemDacBiet_GiaTriXuLy"),
            'strLoaiDiem_Id': edu.util.getValById("dropLoaiDiem"),
            'dThuTu': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strDiemDacBiet_Id = me.strDiemDacBiet_Id;
                    me.getList_DiemDacBiet();
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
    getList_DiemDacBiet: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_DiemDacBiet/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strLoaiDiem_Id': edu.util.getValById("dropSearch_LoaiDiem"),
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
                    me.genTable_DiemDacBiet(dtResult, iPager);
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
    getDetail_DiemDacBiet: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_DiemDacBiet/LayChiTiet',
            
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
                        me.viewForm_DiemDacBiet(data.Data[0]);
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
    //getDetail_ChuongTrinh_Full: function (strId, strAction) {
    //    var me = this;
    //    edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID", me.viewEdit_ChuongTrinh);
    //},
    delete_DiemDacBiet: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_DiemDacBiet/Xoa',
            
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_DiemDacBiet();
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
    genTable_DiemDacBiet: function (data, iPager) {
        var me = this;
        $("#lblDiemDacBiet_Tong").html(iPager);
        //edu.util.viewHTMLById("lblDiemDacBiet_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblDiemDacBiet",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DiemDacBiet.getList_DiemDacBiet()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 3, 4, 5, 6],
                //left: [1],
                //fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên điểm: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Loại điểm: ' + edu.util.returnEmpty(aData.LOAIDIEM_TEN) + "</span><br />";
                //        html += '<span>' + 'Giá trị xử lý: ' + edu.util.returnEmpty(aData.GIATRIXULY) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //},
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "LOAIDIEM_TEN"
                },
                {
                    "mDataProp": "GIATRIXULY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkDiemDacBiet' + aData.ID + '"/>';
                    }
                }

            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_DiemDacBiet: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtDiemDacBiet_Ten", data.TEN);
        edu.util.viewValById("txtDiemDacBiet_Ma", data.MA);
        edu.util.viewValById("dropLoaiDiem", data.LOAIDIEM_ID);
        edu.util.viewValById("txtDiemDacBiet_GiaTriXuLy", data.GIATRIXULY);
    },
};