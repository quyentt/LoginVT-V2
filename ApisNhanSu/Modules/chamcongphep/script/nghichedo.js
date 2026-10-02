/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function NghiCheDo() { }
NghiCheDo.prototype = {
    dtNghiCheDo: [],
    strNghiCheDo_Id: '',

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
        $(".btnSearchNghiCheDo_NhanSu").click(function () {
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
        $("#btnSaveNghiCheDo").click(function () {
            if (edu.util.checkValue(me.strNghiCheDo_Id)) {
                me.update_NghiCheDo();
            }
            else {
                me.save_NghiCheDo();
            }

        });
        $("#btnRefreshNghiCheDo").click(function () {
            me.getList_NghiCheDo();
        });
        $("#tblNghiCheDo").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strNghiCheDo_Id = strId;
                me.getDetail_NghiCheDo(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNghiCheDo").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_NghiCheDo(strId);
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
        edu.system.dateYearToCombo("1993", "dropNghiCheDo_NamApDung", "Chọn năm áp dụng")
        edu.system.lunarCalendar("listSuggess_NghiCheDo");
        me.getList_NghiCheDo();
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropNghiCheDo_LoaiDoiTuong");
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strNghiCheDo_Id = "";
        var arrId = ["dropNghiCheDo_LoaiDoiTuong", "txtNghiCheDo_SoNgayNghi", "dropNghiCheDo_NamApDung"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_list: function () {
        edu.util.toggle_overide("zoneNghiCheDo", "zone_detail_NghiCheDo");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneNghiCheDo", "zone_input_NghiCheDo");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneNghiCheDo", "zone_notify_NghiCheDo");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NghiCheDo
    -------------------------------------------*/
    getList_NghiCheDo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QuyDinhNghiCheDo/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiDoiTuong_Id': '',
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
                    me.dtNghiCheDo = dtResult;
                    me.genTable_NghiCheDo(dtResult);
                }
                else {
                    edu.system.alert("NS_QuyDinhNghiCheDo/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNghiCheDo/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NghiCheDo: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhNghiCheDo/ThemMoi',
            

            'strId': "",
            'strLoaiDoiTuong_Id': edu.util.getValById("dropNghiCheDo_LoaiDoiTuong"),
            'dSoNgayDuocNghi': edu.util.getValById("txtNghiCheDo_SoNgayNghi"),
            'strNamApDung': edu.util.getValById("dropNghiCheDo_NamApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_NghiCheDo();
                }
                else {
                    edu.system.alert("NS_QuyDinhNghiCheDo/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNghiCheDo/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_NghiCheDo: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhNghiCheDo/CapNhat',
            

            'strId': me.strNghiCheDo_Id,
            'strLoaiDoiTuong_Id': edu.util.getValById("dropNghiCheDo_LoaiDoiTuong"),
            'dSoNgayDuocNghi': edu.util.getValById("txtNghiCheDo_SoNgayNghi"),
            'strNamApDung': edu.util.getValById("dropNghiCheDo_NamApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_NghiCheDo();
                }
                else {
                    edu.system.alert("NS_QuyDinhNghiCheDo/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNghiCheDo/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_NghiCheDo: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtNghiCheDo, "ID", me.viewEdit_NghiCheDo);
    },
    delete_NghiCheDo: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyDinhNghiCheDo/Xoa',
            

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
                    me.getList_NghiCheDo();
                }
                else {
                    obj = {
                        content: "NS_QuyDinhNghiCheDo/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QuyDinhNghiCheDo/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML NghiCheDo
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NghiCheDo: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblNghiCheDo",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 3, 4, 5],
                left: [1],
                fix: [0, 4, 5]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIDOITUONG_TEN",
                }
                , {
                    "mDataProp": "SONGAYDUOCNGHI",
                }
                , {
                    "mDataProp": "NAMAPDUNG",
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
    viewEdit_NghiCheDo: function (data) {
        var me = main_doc.NghiCheDo;
        var dt = data[0];
        edu.util.viewValById("dropNghiCheDo_LoaiDoiTuong", dt.LOAIDOITUONG_ID);
        edu.util.viewValById("txtNghiCheDo_SoNgayNghi", dt.SONGAYDUOCNGHI);
        edu.util.viewValById("dropNghiCheDo_NamApDung", dt.NAMAPDUNG);
    }
};