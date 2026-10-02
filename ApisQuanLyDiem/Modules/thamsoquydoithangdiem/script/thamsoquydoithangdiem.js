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
function ThamSoQuyDoiThangDiem() { };
ThamSoQuyDoiThangDiem.prototype = {
    treenode: '',
    strThamSoQuyDoiThangDiem_Id: '',
    dtTab: '',
    dtThamSoQuyDoiThangDiem: [],
    arrValid_ThamSoQuyDoiThangDiem: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ThamSoQuyDoiThangDiem();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_ThamSoQuyDoiThangDiem();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strThamSoQuyDoiThangDiem_Id)) {
                me.update_ThamSoQuyDoiThangDiem();
            }
            else {
                me.save_ThamSoQuyDoiThangDiem();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strThamSoQuyDoiThangDiem_Id)) {
                me.ThamSoQuyDoiThangDiem();
            }
            else {
                me.save_ThamSoQuyDoiThangDiem();
            }
            me.rewrite();
        });

        $("#dropSearch_ThangDiemGoc").on("select2:select", function () {
            me.getList_ThamSoQuyDoiThangDiem();
        });
        $("#dropSearch_ThangDiemQuyDoi").on("select2:select", function () {
            me.getList_ThamSoQuyDoiThangDiem();
        });
        $("#dropSearch_ThangDiemChuQuyDoi").on("select2:select", function () {
            me.getList_ThamSoQuyDoiThangDiem();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThamSoQuyDoiThangDiem();

            }
        });
        $("#tblThamSoQuyDoiThangDiem").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strThamSoQuyDoiThangDiem_Id = strId;
                me.getDetail_ThamSoQuyDoiThangDiem(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThamSoQuyDoiThangDiem");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThamSoQuyDoiThangDiem").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThamSoQuyDoiThangDiem(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_ThamSoQuyDoiThangDiem("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_ThangDiemGoc"), edu.util.getValById("dropSearch_ThangDiemQuyDoi"), edu.util.getValById("dropSearch_ThangDiemChuQuyDoi"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoQuyDoiThangDiem", "checkThamSoQuyDoiThangDiem");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn điểm đặc biệt cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThamSoQuyDoiThangDiem(arrChecked_Id.toString());
            });
        });
        //$("[id$=chkSelectAll_ChuongTrinh]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "lblThamSoHocTapChung_Tong" });
        //});

        $("#tblThamSoQuyDoiThangDiem").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblThamSoQuyDoiThangDiem", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll_ThamSoQuyDoiThangDiem]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThamSoQuyDoiThangDiem" });
        });
        me.arrValid_ThamSoQuyDoiThangDiemt = [
            { "MA": "txtThuTu", "THONGTIN1": "EM" },
            { "MA": "dropThangDiemGoc", "THONGTIN1": "EM" },
            { "MA": "dropThangDiemQuyDoi", "THONGTIN1": "EM" },
            { "MA": "txtDiemGoc_MucDiemCanDuoi", "THONGTIN1": "EM" },
            { "MA": "txtDiemGoc_MucDiemCanTren", "THONGTIN1": "EM" },
            { "MA": "txtDiemSoQuyDoi", "THONGTIN1": "EM" },
            { "MA": "dropDiemChuQuyDoi", "THONGTIN1": "EM" },
        ];
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.THANGDIEM", "dropSearch_ThangDiemGoc, dropThangDiemGoc, dropSearch_ThangDiemQuyDoi, dropThangDiemQuyDoi");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DIEMCHU", "dropSearch_ThangDiemChuQuyDoi, dropDiemChuQuyDoi");

    },
    page_load: function () {
        var me = this;

        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        setTimeout(function () {
            me.getList_ThamSoQuyDoiThangDiem();
        }, 150);
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ThamSoQuyDoiThangDiem");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_ThamSoQuyDoiThangDiem");
    },


    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strThamSoQuyDoiThangDiem_Id = "";
        edu.util.viewValById("dropThangDiemGoc", edu.util.getValById('dropSearch_ThangDiemGoc'));
        edu.util.viewValById("dropThangDiemQuyDoi", edu.util.getValById('dropSearch_ThangDiemQuyDoi'));
        edu.util.viewValById("dropDiemChuQuyDoi", edu.util.getValById('dropSearch_ThangDiemChuQuyDoi'));
        edu.util.viewValById("txtDiemGoc_MucDiemCanDuoi", "");
        edu.util.viewValById("txtDiemGoc_MucDiemCanTren", "");
        edu.util.viewValById("txtDiemSoQuyDoi", "");
    },

    save_ThamSoQuyDoiThangDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_QuyDoiThangDiem/ThemMoi',
            

            'strId': '',
            'strThangDiemGoc_Id': edu.util.getValById("dropThangDiemGoc"),
            'strThangDiemQuyDoi_Id': edu.util.getValById("dropThangDiemQuyDoi"),
            'dDiemCanDuoi_DiemGoc': edu.util.getValById("txtDiemGoc_MucDiemCanDuoi"),
            'dDiemCanTren_DiemGoc': edu.util.getValById("txtDiemGoc_MucDiemCanTren"),
            'dDiemSo_DiemQuyDoi': edu.util.getValById("txtDiemSoQuyDoi"),
            'strDiemChu_DiemQuyDoi_Id': edu.util.getValById("dropDiemChuQuyDoi"),
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
                        me.getList_ThamSoQuyDoiThangDiem();
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
    update_ThamSoQuyDoiThangDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_QuyDoiThangDiem/CapNhat',
            

            'strId': me.strThamSoQuyDoiThangDiem_Id,
            'strThangDiemGoc_Id': edu.util.getValById("dropThangDiemGoc"),
            'strThangDiemQuyDoi_Id': edu.util.getValById("dropThangDiemQuyDoi"),
            'dDiemCanDuoi_DiemGoc': edu.util.getValById("txtDiemGoc_MucDiemCanDuoi"),
            'dDiemCanTren_DiemGoc': edu.util.getValById("txtDiemGoc_MucDiemCanTren"),
            'dDiemSo_DiemQuyDoi': edu.util.getValById("txtDiemSoQuyDoi"),
            'strDiemChu_DiemQuyDoi_Id': edu.util.getValById("dropDiemChuQuyDoi"),
            'iThuTu': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strThamSoQuyDoiThangDiem_Id = me.strThamSoQuyDoiThangDiem_Id;
                    me.getList_ThamSoQuyDoiThangDiem();
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
    getList_ThamSoQuyDoiThangDiem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_QuyDoiThangDiem/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strThangDiemGoc_Id': edu.util.getValById("dropSearch_ThangDiemGoc"),
            'strThangDiemQuyDoi_Id': edu.util.getValById("dropSearch_ThangDiemQuyDoi"),
            'strDiemChu_DiemQuyDoi_Id': edu.util.getValById("dropSearch_ThangDiemChuQuyDoi"),
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
                    me.genTable_ThamSoQuyDoiThangDiem(dtResult, iPager);
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
    getDetail_ThamSoQuyDoiThangDiem: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_QuyDoiThangDiem/LayChiTiet',
            
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
                        me.viewForm_ThamSoQuyDoiThangDiem(data.Data[0]);
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
    delete_ThamSoQuyDoiThangDiem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_QuyDoiThangDiem/Xoa',
            
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
                
                me.getList_ThamSoQuyDoiThangDiem();
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
    genTable_ThamSoQuyDoiThangDiem: function (data, iPager) {
        var me = this;
        $("#lblThamSoQuyDoiThangDiem_Tong").html(iPager);
        //edu.util.viewHTMLById("lblThamSoQuyDoiThangDiem_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblThamSoQuyDoiThangDiem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThamSoQuyDoiThangDiem.getList_ThamSoQuyDoiThangDiem()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                //left: [1],
                //fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Thang điểm gốc: ' + edu.util.returnEmpty(aData.THANGDIEMGOC_TEN) + ' - Thang điểm quy đổi: ' + edu.util.returnEmpty(aData.THANGDIEMQUYDOI_TEN) + "</span><br />";
                //        html += '<span>' + 'Mức điểm cận dưới của điểm gốc: ' + edu.util.returnEmpty(aData.DIEMCANDUOI_THANGDIEMGOC) +  "</span><br />";
                //        html += '<span>' + 'Mức điểm cận trên của điểm gốc: ' + edu.util.returnEmpty(aData.DIEMCANTREN_THANGDIEMGOC) + "</span><br />";
                //        html += '<span>' + 'Điểm sối quy đổi: ' + edu.util.returnEmpty(aData.DIEMSO_THANGDIEMQUYDOI) + '. Điểm chữ quy đổi: ' + edu.util.returnEmpty(aData.DIEMCHU_THANGDIEMQUYDOI_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                
                {
                    "mDataProp": "THANGDIEMGOC_TEN"
                },
                {
                    "mDataProp": "THANGDIEMQUYDOI_TEN"
                },
                {
                    "mDataProp": "DIEMCANDUOI_THANGDIEMGOC"
                },
                {
                    "mDataProp": "DIEMCANTREN_THANGDIEMGOC"
                },
                {
                    "mDataProp": "DIEMSO_THANGDIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMCHU_THANGDIEMQUYDOI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkThamSoQuyDoiThangDiem' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_ThamSoQuyDoiThangDiem: function (data) {
        var me = this;
        var dt = data[0];
        //view data --
        edu.util.viewValById("dropThangDiemGoc", data.THANGDIEMGOC_ID);
        edu.util.viewValById("dropThangDiemQuyDoi", data.THANGDIEMQUYDOI_ID);
        edu.util.viewValById("txtDiemGoc_MucDiemCanDuoi", data.DIEMCANDUOI_THANGDIEMGOC);
        edu.util.viewValById("txtDiemGoc_MucDiemCanTren", data.DIEMCANTREN_THANGDIEMGOC);
        edu.util.viewValById("txtDiemSoQuyDoi", data.DIEMSO_THANGDIEMQUYDOI);
        edu.util.viewValById("dropDiemChuQuyDoi", data.DIEMCHU_THANGDIEMQUYDOI_ID);
    },
};