/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 
----------------------------------------------*/
function MucLuyKe() { };
MucLuyKe.prototype = {
    arrValid_MucLuyKe:[],
    strMucLuyKeId: '',
    dtMucLuyKe: '',

    init: function () {
        var me = main_doc.MucLuyKe;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $("#btnAddnew_MucLuyKe").click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới mức lũy kế');
        });
        $("#btnRefresh_MucLuyKe").click(function () {
            me.getList_MucLuyKe();
        });

        $("#btnSave_MucLuyKe").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MucLuyKe);
            if (valid) {
                me.save_MucLuyKe();
            }
        });
        $("#tblMucLuyKe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strMucLuyKeId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa mức lũy kế');
            edu.util.setOne_BgRow(strId, "tblMucLuyKe");
            me.getDetail_MucLuyKe(strId);
            return false;
        });
        $("#tblMucLuyKe").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblMucLuyKe");
            $("#btnYes").click(function (e) {
                me.delete_MucLuyKe(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Common MucLuyKe
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.arrValid_MucLuyKe = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtMucLuyKe_MucCanTren", "THONGTIN1": "EM#FL" },
            { "MA": "txtMucLuyKe_MucCanDuoi", "THONGTIN1": "EM#FL" },
            { "MA": "txtMucLuyKe_Ten", "THONGTIN1": "EM" }
        ];
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LP00, "dropMucLuyKe_LoaiPhong");
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.DVTT, "dropMucLuyKe_DonViTinh");
            }, 50);
            setTimeout(function () {
                me.getList_MucLuyKe();
            }, 50);
        }, 50);
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
        $('#myModal').on('shown.bs.modal', function () {
            $('#txtMucLuyKe_MucCanDuoi').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = main_doc.MucLuyKe;
        me.strMucLuyKeId = "";
        edu.util.resetValById("dropMucLuyKe_KhoanThu");
        edu.util.resetValById("txtMucLuyKe_NgayApDung");
        edu.util.resetValById("dropMucLuyKe_LoaiPhong");
        edu.util.resetValById("dropMucLuyKe_DonViTinh");
        edu.util.resetValById("txtMucLuyKe_DonGia");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB MucLuyKe
    -------------------------------------------*/
    getList_MucLuyKe: function () {
        var me = main_doc.MucLuyKe;

        //--Edit
        var obj_list = {
            'action': 'KTX_LuyKe/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_MucLuyKe(data.Data);
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
    save_MucLuyKe: function () {
        var me = main_doc.MucLuyKe;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_LuyKe/ThemMoi',
            

            'strId'                 : '',
            'dMucCanTren'           : edu.util.getValById("txtMucLuyKe_MucCanTren"),
            'dMucCanDuoi'           : edu.util.getValById("txtMucLuyKe_MucCanDuoi"),
            'strTen'                : edu.util.getValById("txtMucLuyKe_Ten"),
            'strMa'                 : edu.util.getValById("txtMucLuyKe_Ma"),
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        if (me.strMucLuyKeId != "") {
            obj_save.action = 'KTX_LuyKe/CapNhat';
            obj_save.strId = me.strMucLuyKeId;
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
                    me.getList_MucLuyKe();
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
    getDetail_MucLuyKe: function (strId) {
        var me = main_doc.MucLuyKe;
        //view data --Edit
        var obj_detail = {
            'action': 'KTX_LuyKe/LayChiTiet',
            
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
                        me.viewForm_MucLuyKe(data.Data[0]);
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
    delete_MucLuyKe: function (Ids) {
        var me = main_doc.MucLuyKe;
        //--Edit
        var obj_delete = {
            'action': 'KTX_LuyKe/Xoa',
            
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
                    me.getList_MucLuyKe();
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
	--Discription: [1]  GenHTML MucLuyKe
    --Author: nnthuong
	-------------------------------------------*/
    genTable_MucLuyKe: function (data, iPager) {
        var me = main_doc.MucLuyKe;
        var jsonForm = {
            strTable_Id: "tblMucLuyKe",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 5, 6],
                right:[3, 4]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mDataProp": "MA"
                }
                , {
                    "mDataProp": "MUCCANDUOI"
                }
                , {
                    "mDataProp": "MUCCANTREN"
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
    viewForm_MucLuyKe: function (data) {
        var me = main_doc.MucLuyKe;
        //call popup --Edit
        me.popup(data.MUCCANDUOI);
        //view data --Edit
        edu.util.viewValById("txtMucLuyKe_MucCanDuoi", data.MUCCANDUOI);
        edu.util.viewValById("txtMucLuyKe_MucCanTren", data.MUCCANTREN);
        edu.util.viewValById("txtMucLuyKe_Ten", data.TEN);
        edu.util.viewValById("txtMucLuyKe_Ma", data.MA);
    },
};