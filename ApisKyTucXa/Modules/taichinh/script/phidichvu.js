/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 
----------------------------------------------*/
function PhiDichVu() { };
PhiDichVu.prototype = {
    arrValid_PhiDichVu:[],
    strPhiDichVuId: '',
    dtPhiDichVu: '',

    init: function () {
        var me = main_doc.PhiDichVu;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $("#btnAddnew_PhiDichVu").click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới phí dịch vụ');
        });
        $("#btnRefresh_PhiDichVu").click(function () {
            me.getList_PhiDichVu();
        });

        $("#btnSave_PhiDichVu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_PhiDichVu);
            if (valid) {
                me.save_PhiDichVu();
            }
        });
        //
        $("#btnSaveRe_PhiDichVu").click(function () {
            me.save_PhiDichVu();
            setTimeout(function () {
                me.resetPopup_PhiDichVu();
            }, 1000);
        });
        $("#btnSave_PhiDichVu").click(function () {
            me.save_PhiDichVu();
        });
        $("#tblPhiDichVu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tblPhiDichVu");
            if (edu.util.checkValue(strId)) {
                me.strPhiDichVuId = strId;
                me.getDetail_PhiDichVu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblPhiDichVu").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblPhiDichVu");
                $("#btnYes").click(function (e) {
                    me.delete_PhiDichVu(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        me.arrValid_PhiDichVu = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropPhiDichVu_KhoanThu", "THONGTIN1": "EM" },
            { "MA": "txtPhiDichVu_NgayApDung", "THONGTIN1": "EM" },
            { "MA": "txtPhiDichVu_DonGia", "THONGTIN1": "EM#FL" },
            { "MA": "dropPhiDichVu_DonViTinh", "THONGTIN1": "EM" }
        ];
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/

    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_phidichvu":
                me.resetPopup_PhiDichVu();
                me.popup_PhiDichVu();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_phidichvu":
                me.getList_PhiDichVu();
                break;
        }
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        setTimeout(function () {
            me.getList_KhoanThu();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.DVT0, "dropPhiDichVu_DonViTinh");
                setTimeout(function () {
                    me.getList_PhiDichVu();
                    setTimeout(function () {
                        me.getList_MucLuyKe();
                    }, 50);
                }, 50);
            }, 50);
        }, 150);
    },

    popup_PhiDichVu: function () {
        //show
        edu.util.toggle_overide("zone-bus", "zone_input_PhiDichVu");
        //event
        //$('#myModal_QTSK').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_PhiDichVu: function () {
        var me = this;
        $("#myModalLabel_PhiDichVu").html('<i class="fa fa-plus"></i> Thêm phí dịch vụ');
        me.strCommon_Id = "";
        edu.util.viewValById("dropPhiDichVu_KhoanThu", "");
        edu.util.viewValById("txtPhiDichVu_NgayApDung", "");
        edu.util.viewValById("txtPhiDichVu_DonGia", "");
        edu.util.viewValById("dropPhiDichVu_DonViTinh", "");
        edu.util.viewValById("txtPhiDichVu_ChiSoBatDau", "");
        edu.util.viewValById("txtPhiDichVu_ChiSoKetThuc", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB/GenHTML PhiDichVu
    -------------------------------------------*/
    save_PhiDichVu: function () {
        var me = main_doc.PhiDichVu;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_MucPhiDichVu/ThemMoi',
            

            'strId': '',
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropPhiDichVu_KhoanThu"),
            'strNgayApDung'             : edu.util.getValById("txtPhiDichVu_NgayApDung"),
            'strDonViTinh_Id'           : edu.util.getValById("dropPhiDichVu_DonViTinh"),
            'dDonGia'                   : edu.util.getValById("txtPhiDichVu_DonGia"),
            'strKTX_LuyKe_Id'           : edu.util.getValById("dropPhiDichVu_LuyKe"),
            'strNguoiThucHien_Id'       : edu.system.userId
        };
        if (me.strPhiDichVuId != "") {
            obj_save.action = 'KTX_MucPhiDichVu/CapNhat';
            obj_save.strId = me.strPhiDichVuId;
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
                    me.getList_PhiDichVu();
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
    getList_PhiDichVu: function () {
        var me = main_doc.PhiDichVu;

        //--Edit
        var obj_list = {
            'action': 'KTX_MucPhiDichVu/LayDanhSach',
            

            'strTuKhoa'             : "",
            'strDonViTinh_Id'       : "",
            'strKTX_LuyKe_Id'       : "",
            'strNguoiThucHien_Id'   : "",
            'pageIndex'             : 1,
            'pageSize'              : 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genTable_PhiDichVu(data.Data, data.Pager);
                    }
                    else {
                        me.genTable_PhiDichVu([], 0);
                    } 
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
    getDetail_PhiDichVu: function (strId) {
        var me = main_doc.PhiDichVu;
        //view data --Edit
        var obj_detail = {
            'action': 'KTX_MucPhiDichVu/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    };
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_PhiDichVu(data.Data[0]);
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
    delete_PhiDichVu: function (Ids) {
        var me = main_doc.PhiDichVu;
        //--Edit
        var obj_delete = {
            'action': 'KTX_MucPhiDichVu/Xoa',
            
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
                    me.getList_PhiDichVu();
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

    genTable_PhiDichVu: function (data, iPager) {
        var me = main_doc.PhiDichVu;
        var jsonForm = {
            strTable_Id: "tblPhiDichVu",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 4, 5, 6],
                right:[2]
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
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
    viewForm_PhiDichVu: function (data) {
        var me = main_doc.PhiDichVu;
        //call popup --Edit
        me.popup_PhiDichVu();
        //view data --Edit
        edu.util.viewValById("dropPhiDichVu_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("txtPhiDichVu_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropPhiDichVu_DonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtPhiDichVu_DonGia", data.DONGIA);
        edu.util.viewValById("dropPhiDichVu_LuyKe", data.KTX_LUYKE_ID);
    },
    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> MucLuyKe
    --Author: nnthuong
	-------------------------------------------*/
    getList_MucLuyKe: function () {
        var me = main_doc.PhiDichVu;

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
                    me.genCombo_MucLuyKe(data.Data);
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
    genCombo_MucLuyKe: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: ["dropPhiDichVu_LuyKe"],
            title: "Chọn mức lũy kế"
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropPhiDichVu_KhoanThu"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },
};