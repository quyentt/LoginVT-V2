/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function NgayLamViecTuan() { }
NgayLamViecTuan.prototype = {
    dtNLVTuan: [],
    strNLVTuan_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchNLVTuan_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveNLVTuan").click(function () {
            if (edu.util.checkValue(me.strNLVTuan_Id)) {
                me.update_NLVTuan();
            }
            else {
                me.save_NLVTuan();
            }

        });
        $("#btnRefreshNLVTuan").click(function () {
            me.getList_NLVTuan();
        });
        $("#tblNLVTuan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strNLVTuan_Id = strId;
                me.getDetail_NLVTuan(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNLVTuan").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_NLVTuan(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        me.toggle_list();
        edu.system.daysOfWeekToCombo("dropNLVTuan_Thu", "Chọn thứ trong tuần")
        edu.system.lunarCalendar("listSuggess_NLVTuan");
        me.getList_NLVTuan();
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LVTT, "dropNLVTuan_QuyDinh");
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strNLVTuan_Id = "";
        var arrId = ["dropNLVTuan_Thu", "dropNLVTuan_QuyDinh", "txtNLVTuan_NgayApDung"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_list: function () {
        edu.util.toggle_overide("zoneNLVTuan", "zone_detail_NLVTuan");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneNLVTuan", "zone_input_NLVTuan");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneNLVTuan", "zone_notify_NLVTuan");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NLVTuan
    -------------------------------------------*/
    getList_NLVTuan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QuyDinhNgayLamViec/LayDanhSach',
            

            'strTuKhoa': "",
            'strQuyDinh_Id': '',
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
                    }
                    me.dtNLVTuan = dtResult;
                    me.genTable_NLVTuan(dtResult);
                }
                else {
                    edu.system.alert("NS_QuyDinhNgayLamViec/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNgayLamViec/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NLVTuan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhNgayLamViec/ThemMoi',
            

            'strId': "",
            'strThu': edu.util.getValById("dropNLVTuan_Thu"),
            'strQuyDinh_Id': edu.util.getValById("dropNLVTuan_QuyDinh"),
            'strNgayApDung': edu.util.getValById("txtNLVTuan_NgayApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_NLVTuan();
                }
                else {
                    edu.system.alert("NS_QuyDinhNgayLamViec/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNgayLamViec/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_NLVTuan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhNgayLamViec/CapNhat',
            

            'strId': me.strNLVTuan_Id,
            'strThu': edu.util.getValById("dropNLVTuan_Thu"),
            'strQuyDinh_Id': edu.util.getValById("dropNLVTuan_QuyDinh"),
            'strNgayApDung': edu.util.getValById("txtNLVTuan_NgayApDung"),
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_NLVTuan();
                }
                else {
                    edu.system.alert("NS_QuyDinhNgayLamViec/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNgayLamViec/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_NLVTuan: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtNLVTuan, "ID", me.viewEdit_NLVTuan);
    },
    delete_NLVTuan: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyDinhNgayLamViec/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NLVTuan();
                }
                else {
                    obj = {
                        content: "NS_QuyDinhNgayLamViec/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QuyDinhNgayLamViec/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NLVTuan
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NLVTuan: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblNLVTuan",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 3, 4, 5],
                left: [2],
                fix: [0, 4, 5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.convertNumToDay(aData.THU);
                    }
                }
                , {
                    "mDataProp": "QUYDINH_TEN",
                }
                , {
                    "mDataProp": "NGAYAPDUNG",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="edit_' + aData.ID + '" title="' + aData.NGUOITHUCHIEN_TENDAYDU + '"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete_' + aData.ID + '" title="' + aData.NGUOITHUCHIEN_TENDAYDU + '"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_NLVTuan: function (data) {
        var me = main_doc.NLVTuan;
        var dt = data[0];
        edu.util.viewValById("dropNLVTuan_Thu", dt.THU);
        edu.util.viewValById("dropNLVTuan_QuyDinh", dt.QUYDINH_ID);
        edu.util.viewValById("txtNLVTuan_NgayApDung", dt.NGAYAPDUNG);
    }
};