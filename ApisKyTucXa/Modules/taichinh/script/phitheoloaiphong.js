/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 
----------------------------------------------*/
function PhiTheoLoaiPhong() { };
PhiTheoLoaiPhong.prototype = {
    arrValid_PTLP: [],
    strPTLPId: '',
    dtPTLP: '',

    init: function () {
        var me = main_doc.PhiTheoLoaiPhong;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $("#btnAddnew_PTLP").click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới phí theo loại phòng');
        });
        $("#btnRefresh_PTLP").click(function () {
            me.getList_PTLP();
        });

        $("#btnSave_PTLP").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_PTLP);
            if (valid) {
                me.save_PTLP();
            }
        });
        $("#tblPTLP").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strPTLPId = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa phí theo loại phòng');
            edu.util.setOne_BgRow(strId, "tblPTLP");
            me.getDetail_PTLP(strId);
            return false;
        });
        $("#tblPTLP").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblPTLP");
            $("#btnYes").click(function (e) {
                me.delete_PTLP(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung PhiTheoLoaiPhong
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.arrValid_PTLP = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropPTLP_KhoanThu", "THONGTIN1": "EM" },
            { "MA": "txtPTLP_NgayApDung", "THONGTIN1": "EM" },
            { "MA": "dropPTLP_LoaiPhong", "THONGTIN1": "EM" },
            { "MA": "txtPTLP_DonGia", "THONGTIN1": "EM#FL" },
            { "MA": "dropPTLP_DonViTinh", "THONGTIN1": "EM" }
        ];
        me.getList_KhoanThu();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LP00, "dropPTLP_LoaiPhong");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.DVT0, "dropPTLP_DonViTinh");
        me.getList_PTLP();
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
        $('#myModal').on('shown.bs.modal', function () {
            $('#dropPTLP_KhoanThu').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = main_doc.PhiTheoLoaiPhong;
        me.strPTLPId = "";
        edu.util.resetValById("dropPTLP_KhoanThu");
        edu.util.resetValById("txtPTLP_NgayApDung");
        edu.util.resetValById("dropPTLP_LoaiPhong");
        edu.util.resetValById("dropPTLP_DonViTinh");
        edu.util.resetValById("txtPTLP_DonGia");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB PhiTheoLoaiPhong
    -------------------------------------------*/
    save_PTLP: function () {
        var me = main_doc.PhiTheoLoaiPhong;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_MucPhi_LoaiPhong/ThemMoi',
            

            'strId'                     : '',
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropPTLP_KhoanThu"),
            'strNgayApDung'             : edu.util.getValById("txtPTLP_NgayApDung"),
            'strLoaiPhong_Id'           : edu.util.getValById("dropPTLP_LoaiPhong"),
            'strDonViTinh_Id'           : edu.util.getValById("dropPTLP_DonViTinh"),
            'dDonGia'                   : edu.util.getValById("txtPTLP_DonGia"),
            'strNguoiThucHien_Id'       : edu.system.userId
        };
        if (me.strPTLPId != "") {
            obj_save.action = 'KTX_MucPhi_LoaiPhong/CapNhat';
            obj_save.strId = me.strPTLPId;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
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
                    me.getList_PTLP();
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
    getList_PTLP: function () {
        var me = main_doc.PhiTheoLoaiPhong;

        //--Edit
        var obj_list = {
            'action': 'KTX_MucPhi_LoaiPhong/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiPhong_Id': "",
            'strDonViTinh_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_PTLP(data.Data);
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
    getDetail_PTLP: function (strId) {
        var me = main_doc.PhiTheoLoaiPhong;
        //view data --Edit
        var obj_detail = {
            'action': 'KTX_MucPhi_LoaiPhong/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_PTLP(data.Data[0]);
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
    delete_PTLP: function (Ids) {
        var me = main_doc.PhiTheoLoaiPhong;
        //--Edit
        var obj_delete = {
            'action': 'KTX_MucPhi_LoaiPhong/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_PTLP();
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
	--Discription: [1]  GenHTML PhiTheoLoaiPhong
	-------------------------------------------*/
    genTable_PTLP: function (data, iPager) {
        var me = main_doc.PTLP;
        var jsonForm = {
            strTable_Id: "tblPTLP",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 5],
                right:[3],
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mDataProp": "LOAIPHONG_TEN"
                }
                , {
                    "mDataProp": "DONGIA"
                }
                , {
                    "mDataProp": "DONVITINH_TEN"
                }
                , {
                    "mDataProp": "NGAYAPDUNG"
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
    viewForm_PTLP: function (data) {
        var me = main_doc.PhiTheoLoaiPhong;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropPTLP_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("txtPTLP_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropPTLP_LoaiPhong", data.LOAIPHONG_ID);
        edu.util.viewValById("txtPTLP_DonGia", data.DONGIA);
        edu.util.viewValById("dropPTLP_DonViTinh", data.DONVITINH_ID);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB/GenHTML LoaiKhoanThu
    -------------------------------------------*/
    getList_KhoanThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhomCacKhoanThu_Id': "",
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
                    me.genCombo_KhoanThu(data.Data);
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
    genCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: ["dropPTLP_KhoanThu"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },
};