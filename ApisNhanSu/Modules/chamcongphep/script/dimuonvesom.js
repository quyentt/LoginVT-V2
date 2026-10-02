/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function DiMuonVeSom() { }
DiMuonVeSom.prototype = {
    dtDMVS: [],
    strDMVS_Id: '',

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
        $(".btnSearchDMVS_NhanSu").click(function () {
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
        $("#btnSaveDMVS").click(function () {
            if (edu.util.checkValue(me.strDMVS_Id)) {
                me.update_DMVS();
            }
            else {
                me.save_DMVS();
            }

        });
        $("#btnRefreshDMVS").click(function () {
            me.getList_DMVS();
        });
        $("#tblDMVS").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strDMVS_Id = strId;
                me.getDetail_DMVS(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDMVS").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DMVS(strId);
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
        edu.system.dateYearToCombo("1993", "dropDMVS_NamApDung", "Chọn năm áp dụng")
        edu.system.lunarCalendar("listSuggess_DMVS");
        me.getList_DMVS();
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropDMVS_LoaiDoiTuong");
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDMVS_Id = "";
        var arrId = ["txtDMVS_SoPhutDiMuon", "txtDMVS_SoPhutVeSom", "txtDMVS_SoLan", "txtDMVS_NgayApDung"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_list: function () {
        edu.util.toggle_overide("zoneDMVS", "zone_detail_DMVS");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneDMVS", "zone_input_DMVS");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneDMVS", "zone_notify_DMVS");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB DMVS
    -------------------------------------------*/
    getList_DMVS: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QuyDinhDiMuonVeSom/LayDanhSach',
            

            'strTuKhoa': "",
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
                    me.dtDMVS = dtResult;
                    me.genTable_DMVS(dtResult);
                }
                else {
                    edu.system.alert("NS_QuyDinhDiMuonVeSom/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhDiMuonVeSom/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DMVS: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhDiMuonVeSom/ThemMoi',
            

            'strId': "",
            'strNgayApDung': edu.util.getValById("txtDMVS_NgayApDung"),
            'dSoPhutDiMuon': edu.util.getValById("txtDMVS_SoPhutDiMuon"),
            'dSoPhutVeSom': edu.util.getValById("txtDMVS_SoPhutVeSom"),
            'dSoLan': edu.util.getValById("txtDMVS_SoLan"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_DMVS();
                }
                else {
                    edu.system.alert("NS_QuyDinhDiMuonVeSom/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhDiMuonVeSom/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_DMVS: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhDiMuonVeSom/CapNhat',
            

            'strId': me.strDMVS_Id,
            'strNgayApDung': edu.util.getValById("txtDMVS_NgayApDung"),
            'dSoPhutDiMuon': edu.util.getValById("txtDMVS_SoPhutDiMuon"),
            'dSoPhutVeSom': edu.util.getValById("txtDMVS_SoPhutVeSom"),
            'dSoLan': edu.util.getValById("txtDMVS_SoLan"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_DMVS();
                }
                else {
                    edu.system.alert("NS_QuyDinhDiMuonVeSom/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhDiMuonVeSom/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_DMVS: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtDMVS, "ID", me.viewEdit_DMVS);
    },
    delete_DMVS: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyDinhDiMuonVeSom/Xoa',
            

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
                    me.getList_DMVS();
                }
                else {
                    obj = {
                        content: "NS_QuyDinhDiMuonVeSom/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QuyDinhDiMuonVeSom/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML DMVS
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DMVS: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblDMVS",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 6, 7],
                left: [5],
                fix: [0, 6, 7]
            },
            aoColumns: [
                {
                    "mDataProp": "SOPHUTDIMUON",
                }
                , {
                    "mDataProp": "SOPHUTVESOM",
                }
                , {
                    "mDataProp": "SOLAN",
                }
                , {
                    "mDataProp": "NGAYAPDUNG", 
                }
                , {
                    "mDataProp": "NGUOITHUCHIEN_TENDAYDU", 
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
    viewEdit_DMVS: function (data) {
        var me = main_doc.DMVS;
        var dt = data[0];
        edu.util.viewValById("txtDMVS_SoPhutDiMuon", dt.SOPHUTDIMUON);
        edu.util.viewValById("txtDMVS_SoPhutVeSom", dt.SOPHUTVESOM);
        edu.util.viewValById("txtDMVS_SoLan", dt.SOLAN);
        edu.util.viewValById("txtDMVS_NgayApDung", dt.NGAYAPDUNG);
    }
};