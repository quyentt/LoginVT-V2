/*----------------------------------------------
--Author: nnthuong
--Phone:
--Date of created: 19/01/2019
----------------------------------------------*/
function TyLeMienGiam() { };
TyLeMienGiam.prototype = {
    arrValid_TyLeMienGiam: [],
    strTyLeMienGiam_Id: '',
    dtTyLeMienGiam: '',

    init: function () {
        var me = main_doc.TyLeMienGiam;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: [0] TyLeMienGiam
        -------------------------------------------*/
        $('#btnAddnew_TyLeMienGiam').click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới khung định mức');
        });
        $("#btnRefresh_TyLeMienGiam").click(function () {
            me.getList_TyLeMienGiam();
        });

        $("#btnSave_TyLeMienGiam").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TyLeMienGiam);
            if (valid) {
                me.save_TyLeMienGiam();
            }
        });
        $("#tblTyLeMienGiam").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strTyLeMienGiam_Id = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa khung định mức');
            edu.util.setOne_BgRow(strId, "tblTyLeMienGiam");
            me.getDetail_TyLeMienGiam(strId);
            return false;
        });
        $("#tblTyLeMienGiam").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblTyLeMienGiam");
            $("#btnYes").click(function (e) {
                me.delete_TyLeMienGiam(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Common TyLeMienGiam
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        //
        me.arrValid_TyLeMienGiam = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtTyLeMienGiam_Ten", "THONGTIN1": "EM" },
            { "MA": "txtTyLeMienGiam_Ma", "THONGTIN1": "EM" },
            { "MA": "dropTyLeMienGiam_Nhom", "THONGTIN1": "EM" }
        ];
        //
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.TC.NKT0, "dropTyLeMienGiam_Nhom");
            setTimeout(function () {
                me.getList_TyLeMienGiam();
            }, 50);
        }, 50);
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
        $('#myModal').on('shown.bs.modal', function () {
            $('#txtTyLeMienGiam_Ten').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = main_doc.TyLeMienGiam;
        me.strTyLeMienGiam_Id = "";
        edu.util.resetValById("txtTyLeMienGiam_Ten");
        edu.util.resetValById("txtTyLeMienGiam_Ma");
        edu.util.resetValById("txtTyLeMienGiam_ThuTu");
        edu.util.resetValById("dropTyLeMienGiam_Nhom");
        edu.util.resetValById("txtTyLeMienGiam_MoTa");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TyLeMienGiam
    -------------------------------------------*/
    getList_TyLeMienGiam: function () {
        var me = main_doc.TyLeMienGiam;

        //--Edit
        var obj_list = {
            'action': 'TKGG_TyLeMienGiam/LayDanhSach',
            

            'strKLGD_CHUCVU_Id': "",
            'strKLGD_THOIGIAN_Id': "",
            'dTuKhoaNumber': -1,
            'strTuKhoaText': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TyLeMienGiam(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    save_TyLeMienGiam: function () {
        var me = main_doc.TyLeMienGiam;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TKGG_TyLeMienGiam/ThemMoi',
            

            'strId': '',
            'strTen': edu.util.getValById("txtTyLeMienGiam_Ten"),
            'strMa': edu.util.getValById("txtTyLeMienGiam_Ma"),
            'iThuTu': edu.util.getValById("txtTyLeMienGiam_ThuTu"),
            'strNhomCacTyLeMienGiam_Id': edu.util.getValById("dropTyLeMienGiam_Nhom"),
            'strMoTa': edu.util.getValById("txtTyLeMienGiam_MoTa"),
            'dThutuUuTienGachNo': -1,
            'dTinhPhiTuDong': -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strTyLeMienGiam_Id != "") {
            obj_save.action = 'TKGG_TyLeMienGiam/CapNhat';
            obj_save.strId = me.strTyLeMienGiam_Id;
        }
        //default
        
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
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_TyLeMienGiam();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_TyLeMienGiam: function (strId) {
        var me = main_doc.TyLeMienGiam;
        //view data --Edit
        var obj_detail = {
            'action': 'TKGG_TyLeMienGiam/LayChiTiet',
            
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
                        me.viewForm_TyLeMienGiam(data.Data[0]);
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
    delete_TyLeMienGiam: function (Ids) {
        var me = main_doc.TyLeMienGiam;
        //--Edit
        var obj_delete = {
            'action': 'TKGG_TyLeMienGiam/Xoa',
            
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
                    me.getList_TyLeMienGiam();
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
    /*------------------------------------------
	--Discription: [1]  GenHTML TyLeMienGiam
    --Author: nnthuong
	-------------------------------------------*/
    genTable_TyLeMienGiam: function (data, iPager) {
        var me = main_doc.TyLeMienGiam;
        var jsonForm = {
            strTable_Id: "tblTyLeMienGiam",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TyLeMienGiam.getList_TyLeMienGiam()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 5, 6],
                right: [3],
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_THOIGIAN_TEN"
                }
                , {
                    "mDataProp": "CHUCVU_TEN"
                }
                , {
                    "mDataProp": "TYLEMIEN"
                }
                , {
                    "mDataProp": "GHICHU"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_TyLeMienGiam: function (data) {
        var me = main_doc.TyLeMienGiam;
        //call popup --Edit
        me.popup(data.TEN);
        //view data --Edit
        edu.util.viewValById("txtTyLeMienGiam_Ten", data.TEN);
        edu.util.viewValById("txtTyLeMienGiam_Ma", data.MA);
        edu.util.viewValById("txtTyLeMienGiam_ThuTu", data.THUTU);
        edu.util.viewValById("dropTyLeMienGiam_Nhom", data.NHOMCACTyLeMienGiam_ID);
        edu.util.viewValById("txtTyLeMienGiam_MoTa", data.MOTA);
    },
};