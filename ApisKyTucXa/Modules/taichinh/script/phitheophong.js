/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 
----------------------------------------------*/
function PhiTheoPhong() { };
PhiTheoPhong.prototype = {
    arrValid_PTP:[],
    strPTPId: '',
    dtPTP: '',
    strCommon_Id: '',

    init: function () {
        var me = main_doc.PhiTheoPhong;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $("#btnAddnew_PTP").click(function () {
            me.resetPopup();
            me.popup();
        });
        $("#btnRefresh_PTP").click(function () {
            me.getList_PTP();
        });

        $("#btnSave_PTP").click(function () {

            me.save_PTP();
        });
        $("#tblPTP").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strPTPId = strId;
            edu.util.setOne_BgRow(strId, "tblPTP");
            me.getDetail_PTP(strId);
        });
        $("#tblPTP").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblPTP");
            $("#btnYes").click(function (e) {
                me.delete_PTP(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.arrValid_PTP = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropPTP_KhoanThu", "THONGTIN1": "EM" },
            { "MA": "txtPTP_NgayApDung", "THONGTIN1": "EM" },
            { "MA": "dropPTP_Phong", "THONGTIN1": "EM" },
            { "MA": "txtPTP_DonGia", "THONGTIN1": "EM#FL" },
            { "MA": "dropPTP_DonViTinh", "THONGTIN1": "EM" }
        ];
        setTimeout(function () {
            me.getList_KhoanThu();
            setTimeout(function () {
                me.getList_Phong();
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.DVT0, "dropPTP_DonViTinh");
                }, 50);
                setTimeout(function () {
                    me.getList_PTP();
                }, 50);
            }, 50);
        }, 50);
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
    },
    resetPopup: function () {
        var me = main_doc.PhiTheoPhong;
        me.strPTPId = "";
        edu.util.resetValById("dropPTP_KhoanThu");
        edu.util.resetValById("txtPTP_NgayApDung");
        edu.util.resetValById("dropPTP_Phong");
        edu.util.resetValById("dropPTP_DonViTinh");
        edu.util.resetValById("txtPTP_DonGiaTungNguoi");
        edu.util.resetValById("txtPTP_DonGia");
    },
    /*------------------------------------------
    --Discription: [1]  AcessDB PhiTheoPhong
    -------------------------------------------*/
    save_PTP: function () {
        var me = main_doc.PhiTheoPhong;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_MucPhi_Phong/ThemMoi',
            

            'strId': me.strPTPId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropPTP_KhoanThu"),
            'strNgayApDung': edu.util.getValById("txtPTP_NgayApDung"),
            'strKTX_Phong_Id': edu.util.getValById("dropPTP_Phong"),
            'strDonViTinh_Id': edu.util.getValById("dropPTP_DonViTinh"),
            'dDonGiaCaPhong': edu.util.getValById("txtPTP_DonGia"),
            'dDonGiaTheoNguoi': edu.util.getValById("txtPTP_DonGiaTungNguoi"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'KTX_MucPhi_Phong/CapNhat';
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
                    me.getList_PTP();
                }
                else {
                    obj_notify = {
                        type: "i",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PTP: function () {
        var me = main_doc.PhiTheoPhong;

        //--Edit
        var obj_list = {
            'action': 'KTX_MucPhi_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_Phong_Id': "",
            'strDonViTinh_Id': "",
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
                    me.genTable_PTP(data.Data);
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
    getDetail_PTP: function (strId) {
        var me = main_doc.PhiTheoPhong;
        //view data --Edit
        var obj_detail = {
            'action': 'KTX_MucPhi_Phong/LayChiTiet',
            
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
                        me.viewForm_PTP(data.Data[0]);
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
    delete_PTP: function (Ids) {
        var me = main_doc.PhiTheoPhong;
        //--Edit
        var obj_delete = {
            'action': 'KTX_MucPhi_Phong/Xoa',
            
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
                    me.getList_PTP();
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
	--Discription: [1]  GenHTML PhiTheoPhong
    --Author: nnthuong
	-------------------------------------------*/
    genTable_PTP: function (data, iPager) {
        var me = main_doc.PTP;
        var jsonForm = {
            strTable_Id: "tblPTP",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 5],
                right:[2,3],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_PHONG_MA"
                }
                , {
                    "mData": "DONGIATHEONGUOI",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.DONGIATHEONGUOI);
                    }
                }
                , {
                    "mData": "DONGIACAPHONG",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.DONGIACAPHONG);
                    }
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
    viewForm_PTP: function (data) {
        var me = main_doc.PhiTheoPhong;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropPTP_KhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("txtPTP_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropPTP_Phong", data.KTX_PHONG_ID);
        edu.util.viewValById("dropPTP_DonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtPTP_DonGia", data.DONGIACAPHONG);
        edu.util.viewValById("txtPTP_DonGiaTungNguoi", data.DONGIATHEONGUOI);
    },
    /*------------------------------------------
	--Discription: [1]  AcessDB and GenHTML Phong
    --Author: nnthuong
	-------------------------------------------*/
    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': '',
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000

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
                    me.genCombo_Phong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Phong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MA",
                code: ""
            },
            renderPlace: ["dropPTP_Phong"],
            title: "Chọn phòng"
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
            renderPlace: ["dropPTP_KhoanThu"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },
};