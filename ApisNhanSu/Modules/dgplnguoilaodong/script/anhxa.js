
function AnhXa() { }
AnhXa.prototype = {
    dtAnhXa: [],
    strAnhXa_Id: '',

    init: function () {
        var me = this;
        edu.system.page_load();
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveAnhXa").click(function () {
            me.save_AnhXa();
        });
        $("#btnSearchAnhXa").click(function () {
            if (edu.util.checkValue(me.strAnhXa_Id)) {
                me.update_AnhXa();
            }
            else {
                me.save_AnhXa();
            }
        });
        $("#btnSearch_AnhXa_NhanSu").click(function () {
            me.getList_NhanSu();
        });
        $("#txtSearch_AnhXa_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu();
            }
        });
        $("#tblAnhXa").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_input();
                me.strAnhXa_Id = strId;
                me.getDetail_AnhXa(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblAnhXa").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_AnhXa(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_AnhXa_TuKhoa");
        me.toggle_notify();
        me.getList_AnhXa();
        setTimeout(function () {
            me.getList_KeHoach();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LDVN, "dropAnhXa_DoiTuongApDung,dropSearchAnhXa_DoiTuong");
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMCV, "dropAnhXa_ChucVu");
                }, 50);
            }, 50);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strAnhXa_Id = "";
        var arrId = ["dropAnhXa_KeHoach", "dropAnhXa_ChucVu", "dropAnhXa_DoiTuongApDung"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneAnhXa", "zone_detail_AnhXa");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneAnhXa", "zone_input_AnhXa");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneAnhXa", "zone_notify_AnhXa");
    },
    getList_AnhXa: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_AnhXa/LayDanhSach',            

            'strTuKhoa': "",
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropSearchAnhXa_KeHoach"),
            'strDoiTuongApDung_Id': edu.util.getValById("dropSearchAnhXa_DoiTuong"),
            'strChucVu_Id': "",
            'strNguoiThucHien_Id':"",
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
                    me.dtAnhXa = dtResult;
                    me.genTable_AnhXa(dtResult);
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_AnhXa/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_AnhXa/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_AnhXa: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_PLDG_NLD_AnhXa/ThemMoi',            

            'strId': "",
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropAnhXa_KeHoach"),
            'strDoiTuongApDung_Id': edu.util.getValById("dropAnhXa_DoiTuongApDung"),
            'strChucVu_Id': edu.util.getValById("dropAnhXa_ChucVu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_AnhXa();
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_AnhXa/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_AnhXa/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_AnhXa: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_PLDG_NLD_AnhXa/CapNhat',            

            'strId': me.strAnhXa_Id,
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropAnhXa_KeHoach"),
            'strDoiTuongApDung_Id': edu.util.getValById("dropAnhXa_DoiTuongApDung"),
            'strChucVu_Id': edu.util.getValById("dropAnhXa_ChucVu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_AnhXa();
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_AnhXa/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_AnhXa/CapNhat (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_AnhXa: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtAnhXa, "ID", me.viewEdit_AnhXa);
    },
    delete_AnhXa: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_NLD_AnhXa/Xoa',            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_AnhXa();
                }
                else {
                    obj = {
                        content: "NS_PLDG_NLD_AnhXa/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_NLD_AnhXa/Xoa (er): " + JSON.stringify(er),
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
    genTable_AnhXa: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblAnhXa_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblAnhXa",
            aaData: data,
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                center: [0],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.CHUCVU_TEN) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_AnhXa: function (data) {
        var me = main_doc.AnhXa;
        var dt = data[0];
        edu.util.viewValById("dropAnhXa_KeHoach", dt.NHANSU_DGPL_NAM_KEHOACH_ID);
        edu.util.viewValById("dropAnhXa_ChucVu", dt.CHUCVU_ID);
        edu.util.viewValById("dropAnhXa_DoiTuongApDung", dt.DOITUONGAPDUNG_ID);
    },
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_KeHoach/LayDanhSach',            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000
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
                    me.genCombo_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_KeHoach/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_KeHoach/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA"
            },
            renderPlace: ["dropAnhXa_KeHoach", "dropSearchAnhXa_KeHoach"],
            type: "",
            title: "Kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
};