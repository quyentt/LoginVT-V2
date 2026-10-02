/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 
----------------------------------------------*/
function KhoanThu() { };
KhoanThu.prototype = {
    arrValid_KhoanThu: [],
    strKhoanThu_Id: '',
    dtKhoanThu: '',

    init: function () {
        var me = main_doc.KhoanThu;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: [0] KhoanThu
        -------------------------------------------*/
        $('#btnAddnew_KhoanThu').click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới khoản thu');
        });
        $("#btnRefresh_KhoanThu").click(function () {
            me.getList_KhoanThu();
        });

        $("#btnSave_KhoanThu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KhoanThu);
            if (valid) {
                me.save_KhoanThu();
            }
        });
        $("#tblKhoanThu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strKhoanThu_Id = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa khoản thu');
            edu.util.setOne_BgRow(strId, "tblKhoanThu");
            me.getDetail_KhoanThu(strId);
            return false;
        });
        $("#tblKhoanThu").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblKhoanThu");
            $("#btnYes").click(function (e) {
                me.delete_KhoanThu(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Common KhoanThu
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        //
        me.arrValid_KhoanThu = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtKhoanThu_Ten", "THONGTIN1": "EM" },
            { "MA": "txtKhoanThu_Ma", "THONGTIN1": "EM" },
            { "MA": "dropKhoanThu_Nhom", "THONGTIN1": "EM" }
        ];
        //
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.TC.NKT0, "dropKhoanThu_Nhom");
            setTimeout(function () {
                me.getList_KhoanThu();
            }, 50);
        }, 50);
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
        $('#myModal').on('shown.bs.modal', function () {
            $('#txtKhoanThu_Ten').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = main_doc.KhoanThu;
        me.strKhoanThu_Id = "";
        edu.util.resetValById("txtKhoanThu_Ten");
        edu.util.resetValById("txtKhoanThu_Ma");
        edu.util.resetValById("txtKhoanThu_ThuTu");
        edu.util.resetValById("dropKhoanThu_Nhom");
        edu.util.resetValById("txtKhoanThu_MoTa");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB KhoanThu
    -------------------------------------------*/
    getList_KhoanThu: function () {
        var me = main_doc.KhoanThu;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhomCacKhoanThu_Id':"",
            'strNguoiThucHien_Id': "",
            'strcanboquanly_id': "",
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
                    me.genTable_KhoanThu(data.Data);
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
    save_KhoanThu: function () {
        var me = main_doc.KhoanThu;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KhoanThu/ThemMoi',
            

            'strId': '',
            'strTen': edu.util.getValById("txtKhoanThu_Ten"),
            'strMa': edu.util.getValById("txtKhoanThu_Ma"),
            'iThuTu': edu.util.getValById("txtKhoanThu_ThuTu"),
            'strNhomCacKhoanThu_Id': edu.util.getValById("dropKhoanThu_Nhom"),
            'strMoTa': edu.util.getValById("txtKhoanThu_MoTa"),
            'dThutuUuTienGachNo': -1,
            'dTinhPhiTuDong': -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strKhoanThu_Id != "") {
            obj_save.action = 'TC_KhoanThu/CapNhat';
            obj_save.strId = me.strKhoanThu_Id;
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
                    me.getList_KhoanThu();
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
    getDetail_KhoanThu: function (strId) {
        var me = main_doc.KhoanThu;
        //view data --Edit
        var obj_detail = {
            'action': 'TC_KhoanThu/LayChiTiet',
            
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
                        me.viewForm_KhoanThu(data.Data[0]);
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
    delete_KhoanThu: function (Ids) {
        var me = main_doc.KhoanThu;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanThu/Xoa',
            
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
                    me.getList_KhoanThu();
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
	--Discription: [1]  GenHTML KhoanThu
    --Author: nnthuong
	-------------------------------------------*/
    genTable_KhoanThu: function (data, iPager) {
        var me = main_doc.KhoanThu;
        var jsonForm = {
            strTable_Id: "tblKhoanThu",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 5, 6],
                right: [],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mDataProp": "MA"
                }
                , {
                    "mDataProp": "NHOMCACKHOANTHU_TEN"
                }
                , {
                    "mDataProp": "MOTA"
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
    viewForm_KhoanThu: function (data) {
        var me = main_doc.KhoanThu;
        //call popup --Edit
        me.popup(data.TEN);
        //view data --Edit
        edu.util.viewValById("txtKhoanThu_Ten", data.TEN);
        edu.util.viewValById("txtKhoanThu_Ma", data.MA);
        edu.util.viewValById("txtKhoanThu_ThuTu", data.THUTU);
        edu.util.viewValById("dropKhoanThu_Nhom", data.NHOMCACKHOANTHU_ID);
        edu.util.viewValById("txtKhoanThu_MoTa", data.MOTA);
    },
};