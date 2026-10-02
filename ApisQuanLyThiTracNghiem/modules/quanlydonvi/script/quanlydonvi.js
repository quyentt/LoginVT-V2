function quanlydonvi() { };
quanlydonvi.prototype = {
    dtDonVi: [],    
    strDonViId:'',
    init: function () {
        var me = this;        
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DonVi();
            }
        });   
        $(".btnSearch_DonVi").click(function () {
            me.getList_DonVi();
        });
        $("#drpTrangThai").on("select2:select", function () {
            me.getList_DonVi();
        });
        $("#tblDonVi").delegate(".btnChiTietDonVi", "click", function () {
            var strId = this.id;
            me.strDonViId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtDonVi, "ID");  
            me.rewrite_DonVi();
            me.toggle_edit_DonVi();
            me.viewEdit_DonVi(dt[0]); 

        });
        
        $("#btnDelete_DonVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDonVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DonVi(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DonVi();
            }, 2000);
        }); 
        $("#btnAdd_DotThi").click(function () {
            me.strDonViId = ''; 
            me.rewrite_DonVi(); 
            me.toggle_edit_DonVi();
        });
        $("#btnSave_DonVi").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtMaDonVi", "THONGTIN1": "EM" }, 
                { "MA": "txtTenDonVi", "THONGTIN1": "EM" }, 
                { "MA": "drpTrangThai_Edit", "THONGTIN1": "EM" }, 
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_DonVi();
        });     
         

    },
    page_load: function () {        
        var me = this;
        edu.system.page_load(); 
        me.getList_DonVi();
     

    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    rewrite_DonVi: function () {
        var me = this;
      
        edu.util.viewValById("txtMaDonVi", "");
        edu.util.viewValById("txtTenDonVi", "");
        $("#drpTrangThai_Edit").val("").change();
    },
    toggle_edit_DonVi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneDonVi");
    },  

    viewEdit_DonVi: function (dt) {
        var me = this; 
        edu.util.viewValById("txtMaDonVi", dt.CODE);  
        edu.util.viewValById("txtTenDonVi", dt.NAME);   
        $("#drpTrangThai_Edit").val(dt.STATUS).change(); 
    },
    getList_DonVi: function () {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_ThonTinDonVi',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strStatus': edu.util.getValById('drpTrangThai'), 
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDonVi = data.Data;
                    me.genTable_DonVi(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DonVi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDonVi",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.quanlydonvi.getList_DonVi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0,2],
            },
            aoColumns: [
                {
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strThangThai = aData.STUTUS == "1" ? "Hiện" : "Ẩn";
                        return '<span>'+strThangThai+'</span>';
                    }

                }, 
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietDonVi" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    save_DonVi: function () {
        var me = this; 
       
        var obj_save = {
            'action': 'QLTTN_ThongTin/Them_ThongTinDonVi',
            'versionAPI': 'v1.0',
            'strId': "",
            'strCode': edu.util.getValById('txtMaDonVi'),         
            'strName': edu.util.getValById('txtTenDonVi'),
            'strStatus': edu.util.getValById('drpTrangThai_Edit'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strDonViId != "") {
            obj_save.action = 'QLTTN_ThongTin/Sua_ThongTinDonVi';
            obj_save.strId = me.strDonViId;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strDonViId = data.ID;
                    me.getList_DonVi();
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DonVi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_ThongTin/Xoa_ThongTinDonVi',
            'versionAPI': 'v1.0',
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
}

