/*----------------------------------------------
--Author: nnthuong
--Phone:
--Date of created: 11/01/2019
----------------------------------------------*/
function KhungDinhMuc() { };
KhungDinhMuc.prototype = {
    arrValid_KhungDinhMuc: [],
    strKhungDinhMuc_Id: '',
    dtKhungDinhMuc: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: [0] KhungDinhMuc
        -------------------------------------------*/
        $('#btnAddnew_KhungDinhMuc').click(function () {
            me.resetPopup();
            me.popup();
            $("#myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới khung định mức');
        });
        $("#btnRefresh_KhungDinhMuc").click(function () {
            me.getList_KhungDinhMuc();
        });

        $("#btnSave_KhungDinhMuc").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KhungDinhMuc);
            if (valid) {
                me.save_KhungDinhMuc();
            }
        });
        $("#tblKhungDinhMuc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strKhungDinhMuc_Id = strId;
            $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa khung định mức');
            edu.util.setOne_BgRow(strId, "tblKhungDinhMuc");
            me.getDetail_KhungDinhMuc(strId);
            return false;
        });
        $("#tblKhungDinhMuc").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblKhungDinhMuc");
            $("#btnYes").click(function (e) {
                me.delete_KhungDinhMuc(strId);
            });
            return false;
        });
    },
    /*------------------------------------------
    --Discription: [0] Common KhungDinhMuc
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        //
        me.arrValid_KhungDinhMuc = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtKhungDinhMuc_Ten", "THONGTIN1": "EM" },
            { "MA": "txtKhungDinhMuc_Ma", "THONGTIN1": "EM" },
            { "MA": "dropKhungDinhMuc_Nhom", "THONGTIN1": "EM" }
        ];
        //
        setTimeout(function () {
            me.getList_KhungDinhMuc();
            setTimeout(function () {
                me.getList_LoaiChucDanh();
            }, 150);
        }, 150);
    },
    popup: function (value) {
        //show
        $("#myModal").modal("show");
        //event
        $('#myModal').on('shown.bs.modal', function () {
            $('#txtKhungDinhMuc_Ten').val('').trigger('focus').val(value);
        });
    },
    resetPopup: function () {
        var me = main_doc.KhungDinhMuc;
        me.strKhungDinhMuc_Id = "";
        edu.util.resetValById("txtKhungDinhMuc_Ten");
        edu.util.resetValById("txtKhungDinhMuc_Ma");
        edu.util.resetValById("txtKhungDinhMuc_ThuTu");
        edu.util.resetValById("dropKhungDinhMuc_Nhom");
        edu.util.resetValById("txtKhungDinhMuc_MoTa");
    },
    /*------------------------------------------
    --Discription: [0] AcessDB DuLieuDanhMuc
    -------------------------------------------*/
    getList_LoaiChucDanh: function () {
        var me = main_doc.KhungDinhMuc;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOCD, "dropKDM_LoaiChucDanh", "", me.getList_KhungGioChuan);
    },
    getList_KhungGioChuan: function () {
        var me = main_doc.KhungDinhMuc;
        edu.system.loadToCombo_DanhMucDuLieu("TKGG.DMGC", "dropKDM_KhungGioChuan", "", me.getList_ThoiGianDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = main_doc.KhungDinhMuc;
        return;
        //--Edit
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            

            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_ThoiGianDaoTao(data.Data)
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.DanhMucDuLieu;
        me.dtUngDung = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKDM_ThoiGian"],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB KhungDinhMuc
    -------------------------------------------*/
    getList_KhungDinhMuc: function () {
        var me = main_doc.KhungDinhMuc;

        //--Edit
        var obj_list = {
            'action': 'TKGG_KhungDinhMuc/LayDanhSach',
            

            'strKLGD_THOIGIAN_Id': "",
            'strLOAICHUCDANH_Id': "",
            'strLoaiChucDanhGiangVien_Id': "",
            'strTuKhoaText': "",
            'dTuKhoaNumber': -1,
            'strKHUNGDINHMUCQIOCHUAN_Id': "",
            'strCanBoNhap_Id': "",
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
                    me.genTable_KhungDinhMuc(data.Data, data.Pager);
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
    save_KhungDinhMuc: function () {
        var me = main_doc.KhungDinhMuc;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TKGG_KhungDinhMuc/ThemMoi',
            

            'strId': '',
            'strTen': edu.util.getValById("txtKhungDinhMuc_Ten"),
            'strMa': edu.util.getValById("txtKhungDinhMuc_Ma"),
            'iThuTu': edu.util.getValById("txtKhungDinhMuc_ThuTu"),
            'strNhomCacKhungDinhMuc_Id': edu.util.getValById("dropKhungDinhMuc_Nhom"),
            'strMoTa': edu.util.getValById("txtKhungDinhMuc_MoTa"),
            'dThutuUuTienGachNo': -1,
            'dTinhPhiTuDong': -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strKhungDinhMuc_Id != "") {
            obj_save.action = 'TKGG_KhungDinhMuc/CapNhat';
            obj_save.strId = me.strKhungDinhMuc_Id;
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
                    me.getList_KhungDinhMuc();
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
    getDetail_KhungDinhMuc: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TKGG_KhungDinhMuc/LayChiTiet',
            
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
                        me.viewForm_KhungDinhMuc(data.Data[0]);
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
    delete_KhungDinhMuc: function (Ids) {
        var me = main_doc.KhungDinhMuc;
        //--Edit
        var obj_delete = {
            'action': 'TKGG_KhungDinhMuc/Xoa',
            
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
                    me.getList_KhungDinhMuc();
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
	--Discription: [1]  GenHTML KhungDinhMuc
    --Author: nnthuong
	-------------------------------------------*/
    genTable_KhungDinhMuc: function (data, iPager) {
        var me = main_doc.KhungDinhMuc;
        var jsonForm = {
            strTable_Id: "tblKhungDinhMuc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhungDinhMuc.getList_KhungDinhMuc()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 6, 7],
                right: [],
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_THOIGIAN_NAMHOC"
                }
                , {
                    "mDataProp": "KHUNGDINHMUCQIOCHUAN_TEN"
                }
                , {
                    "mDataProp": "LOAICHUCDANHGIANGVIEN_TEN"
                }
                , {
                    "mDataProp": "SOGIOCHUAN"
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
    viewForm_KhungDinhMuc: function (data) {
        var me = main_doc.KhungDinhMuc;
        //call popup --Edit
        me.popup("");
        //view data --Edit
        edu.util.viewValById("dropKDM_ThoiGian", data.KLGD_THOIGIAN_ID);
        edu.util.viewValById("dropKDM_LoaiChucDanh", data.LOAICHUCDANHGIANGVIEN_ID);
        edu.util.viewValById("dropKDM_KhungGioChuan", data.KHUNGDINHMUCQIOCHUAN_ID);
        edu.util.viewValById("txtKDM_SoGioChuan", data.SOGIOCHUAN);
        edu.util.viewValById("txtKDM_MoTa", data.MOTA);
    },
};