function CauTrucNoiDungGuiEmail() { };
CauTrucNoiDungGuiEmail.prototype = {
    dtCauTrucNoiDungGuiEmail: [],
    strCauTrucNoiDungGuiEmail_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        $(".btnSearch_CauTrucNoiDungGuiEmail").click(function (){
            me.getList_CauTrucNoiDungGuiEmail();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                me.getList_CauTrucNoiDungGuiEmail();
            }
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        
        $("#btnSave_CauTrucNoiDungGuiEmail").click(function () {
            var arrValid = [                
                { "MA": "txtMaNoiDung", "THONGTIN1": "EM" },
                { "MA": "txtTieuDe", "THONGTIN1": "EM" }
            ];

            var valid = edu.util.validInputForm(arrValid);
            if (valid) {
                me.save_CauTrucNoiDungGuiEmail();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#tblCauTrucNoiDungGuiEmail").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strCauTrucNoiDungGuiEmail_Id = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtCauTrucNoiDungGuiEmail, "ID");
            if (dt.length > 0) {
                me.viewEdit_KyThi(dt[0]);
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $("[id$=chkSelectAll_CauTrucNoiDungGuiEmail]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCauTrucNoiDungGuiEmail" });
        });
        $("#btnDelete_KyThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauTrucNoiDungGuiEmail", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
               $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KyThi(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_CauTrucNoiDungGuiEmail();
            }, 2000);
        });   

    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        
        me.getList_CauTrucNoiDungGuiEmail();

    },
   
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewrite: function () {
        var me = this;
        edu.util.viewValById("txtMaNoiDung", "");
        edu.util.viewValById("txtTenEmailHienThi", "");
        edu.util.viewValById("txtTieuDe", ""); 
        edu.util.viewValById("txtGhiChu", ""); 
        CKEDITOR.instances['editor_CauTrucNoiDungGuiEmail'].setData('');
        edu.util.viewValById("editor_DanhSachNhanEmail", ""); 
      
        me.strCauTrucNoiDungGuiEmail_Id = "";
    },
    /*------------------------------------------
    --Discription: Access DB KyThi
    --ULR: Modules
    -------------------------------------------*/
    getList_CauTrucNoiDungGuiEmail: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'), 
            'strNguoiTao_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCauTrucNoiDungGuiEmail = data.Data;
                    me.genList_CauTrucNoiDungGuiEmail(data.Data, data.Pager);
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_CauTrucNoiDungGuiEmail: function (data, iPager) {
        var me = this;
        $("#lblKyThi_Tong").html(iPager); 
        var jsonForm = {
            strTable_Id: "tblCauTrucNoiDungGuiEmail",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CauTrucNoiDungGuiEmail.getList_CauTrucNoiDungGuiEmail()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0,1,2,3] 
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TENEMAILHIENTHI"
                },
                {
                    "mDataProp": "TIEUDE"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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

    viewEdit_KyThi: function (data) {
        var me = this;       
        //call popup --Edit
        me.rewrite();
        me.toggle_edit();
        //view data --Edit 
        console.log(data.TIEUDE);

        
        edu.util.viewValById("txtTieuDe", data.TIEUDE);
        edu.util.viewValById("txtMaNoiDung", data.MA);  
        edu.util.viewValById("txtTenEmailHienThi", data.TENEMAILHIENTHI);  
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        
        setTimeout(function () {
            CKEDITOR.instances['editor_CauTrucNoiDungGuiEmail'].setData(data.NOIDUNG);            
            edu.util.viewValById("editor_DanhSachNhanEmail", data.DANHSACHNHANEMAIL); 


        }, 500);

        me.strCauTrucNoiDungGuiEmail_Id = data.ID;
    },
    save_CauTrucNoiDungGuiEmail: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_TienIch/Them_CauTrucNoiDungGuiEmail',
            'versionAPI': 'v1.0',
            'strId': "",
            'strMa': edu.util.getValById('txtMaNoiDung'),
            'strTenEmailHienThi': edu.util.getValById('txtTenEmailHienThi'),
            'strTieuDe': edu.util.getValById('txtTieuDe'),  
            'strNoiDung': CKEDITOR.instances['editor_CauTrucNoiDungGuiEmail'].getData(), 
            'strDanhSachNhanEmail': edu.util.getValById('editor_DanhSachNhanEmail'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),  
            'strNguoiThucHien_Id': edu.system.userId
        };
       
        if (edu.util.returnEmpty(me.strCauTrucNoiDungGuiEmail_Id) != "") {
            obj_save.action = 'CMS_TienIch/Sua_CauTrucNoiDungGuiEmail';
            obj_save.strId = me.strCauTrucNoiDungGuiEmail_Id;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCauTrucNoiDungGuiEmail_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_CauTrucNoiDungGuiEmail();
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
    delete_KyThi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_TienIch/Xoa_CauTrucNoiDungGuiEmail',
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
                    edu.system.alert(obj_delete + ": " + data.Message);
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