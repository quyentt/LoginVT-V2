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
function ThamSoDanhGiaKetQua() { };
ThamSoDanhGiaKetQua.prototype = {
    treenode: '',
    strThamSoDanhGiaKetQua_Id: '',
    dtTab: '',
    dtThamSoDanhGiaKetQua: [],
    arrValid_ThamSoDanhGiaKetQua: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ThamSoDanhGiaKetQua();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_ThamSoDanhGiaKetQua();
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
            if (edu.util.checkValue(me.strThamSoDanhGiaKetQua_Id)) {
                me.update_ThamSoDanhGiaKetQua();
            }
            else {
                me.save_ThamSoDanhGiaKetQua();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strThamSoDanhGiaKetQua_Id)) {
                me.update_ThamSoDanhGiaKetQua();
            }
            else {
                me.save_ThamSoDanhGiaKetQua();
            }
            me.rewrite();
        });
        $("#dropSearch_DanhGia").on("select2:select", function () {
            me.getList_ThamSoDanhGiaKetQua();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThamSoDanhGiaKetQua();

            }
        });

        $("#tblThamSoDanhGiaKetQua").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strThamSoDanhGiaKetQua_Id = strId;
                me.getDetail_ThamSoDanhGiaKetQua(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThamSoDanhGiaKetQua");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThamSoDanhGiaKetQua").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThamSoDanhGiaKetQua(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_ThamSoDanhGiaKetQua("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_DanhGia"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoDanhGiaKetQua", "checkThamSoDanhGiaKetQua");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn điểm đặc biệt cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThamSoDanhGiaKetQua(arrChecked_Id.toString());
            });
        });
        //$("[id$=chkSelectAll_ChuongTrinh]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "lblThamSoHocTapChung_Tong" });
        //});

        $("#tblThamSoDanhGiaKetQua").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblThamSoDanhGiaKetQua", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll_ThamSoDanhGiaKetQua]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThamSoDanhGiaKetQua" });
        });
        me.arrValid_ThamSoDanhGiaKetQua = [
            { "MA": "dropDanhGia", "THONGTIN1": "EM" },
            { "MA": "txtXauDieuKien", "THONGTIN1": "EM" },
            { "MA": "txtMoTa", "THONGTIN1": "EM" },
        ];
    
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DANHGIA", "dropSearch_DanhGia, dropDanhGia");//////
    },
    page_load: function () {
        var me = this;

        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_ThamSoDanhGiaKetQua();
        }, 150);
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ThamSoDanhGiaKetQua");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_ThamSoDanhGiaKetQua");
    },
   

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strThamSoDanhGiaKetQua_Id = "";
        edu.util.viewValById("dropDanhGia", edu.util.getValById('dropSearch_DanhGia'));
        edu.util.viewValById("txtXauDieuKien", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtThuTuUuTien", "");
    },

    save_ThamSoDanhGiaKetQua: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoDanhGiaKetQua/ThemMoi',
            

            'strId': '',
            'strDanhGia_Id': edu.util.getValById("dropDanhGia"),
            'strXauDieuKien': edu.util.getValById("txtXauDieuKien"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'iThuTu': "",
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
                        me.getList_ThamSoDanhGiaKetQua();
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
    update_ThamSoDanhGiaKetQua: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoDanhGiaKetQua/CapNhat',
            

            'strId': me.strThamSoDanhGiaKetQua_Id,
            'strDanhGia_Id': edu.util.getValById("dropDanhGia"),
            'strXauDieuKien': edu.util.getValById("txtXauDieuKien"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'iThuTu':"",
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strThamSoDanhGiaKetQua_Id = me.strThamSoDanhGiaKetQua_Id;
                    me.getList_ThamSoDanhGiaKetQua();
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
    getList_ThamSoDanhGiaKetQua: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoDanhGiaKetQua/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDanhGia_Id': edu.util.getValById("dropSearch_DanhGia"),
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
                    me.genTable_ThamSoDanhGiaKetQua(dtResult, iPager);
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
    getDetail_ThamSoDanhGiaKetQua: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThamSoDanhGiaKetQua/LayChiTiet',
            
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
                        me.viewForm_ThamSoDanhGiaKetQua(data.Data[0]);
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
    delete_ThamSoDanhGiaKetQua: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoDanhGiaKetQua/Xoa',
            
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
                
                me.getList_ThamSoDanhGiaKetQua();
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
    genTable_ThamSoDanhGiaKetQua: function (data, iPager) {
        var me = this;
        $("#lblThamSoDanhGiaKetQua_Tong").html(iPager);
        //edu.util.viewHTMLById("lblThamSoDanhGiaKetQua_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblThamSoDanhGiaKetQua",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThamSoDanhGiaKetQua.getList_ThamSoDanhGiaKetQua()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 4, 5],
                //left: [1],
                //fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Kết quả đánh giá: ' + edu.util.returnEmpty(aData.DANHGIA_TEN) + "</span><br />";
                //        html += '<span>' + 'Xâu điều kiện: ' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkThamSoDanhGiaKetQua' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_ThamSoDanhGiaKetQua: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropDanhGia", data.DANHGIA_ID);
        edu.util.viewValById("txtXauDieuKien", data.XAUDIEUKIEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtThuTuUuTien", data.THUTUUUTIEN);
    },
};