function TieuChi() { }
TieuChi.prototype = {
    dtTieuChi: [],
    strTieuChi_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearch_TieuChi").click(function () {
            me.getList_TieuChi();
        });
        $("#btnSave_TieuChi").click(function () {
            if (edu.util.checkValue(me.strTieuChi_Id)) {
                me.update_TieuChi();
            }
            else {
                me.save_TieuChi();
            }
        });
        $("#tblTieuChi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strTieuChi_Id = strId;
                me.getDetail_TieuChi(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblTieuChi");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTieuChi").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TieuChi(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        edu.system.dateYearToCombo("1993", "dropTieuChi_Nam", "Chọn năm");
        me.getList_TieuChi();
        setTimeout(function () {
            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LDVN, "dropTieuChi_LoaiDoiTuong");
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.NTCD, "dropTieuChi_NhomTieuChi");
                setTimeout(function () {
                    me.getList_KeHoach();
                }, 50);
            }, 50);
        }, 50)
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_TieuChi");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_TieuChi");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_TieuChi");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strTieuChi_Id = "";
        var arrId = ["txtTieuChi_Ten", "dropTieuChi_KeHoach", "txtTieuChi_ThuTuHienThi", "dropTieuChi_LoaiDoiTuong", "dropTieuChi_NhomTieuChi"];
        edu.util.resetValByArrId(arrId);
    },
    getList_TieuChi: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_TieuChi/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strLoaiDoiTuong_Id': edu.util.getValById(""),
            'strNhomTieuChi_Id': edu.util.getValById(""),
            'strNguoiThucHien_Id': '',
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
                        iPager = data.Pager;
                        me.dtTieuChi = dtResult;
                    }
                    me.genTable_TieuChi(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_TieuChi/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_TieuChi/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_TieuChi: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_PLDG_NLD_TieuChi/ThemMoi',            

            'strId': "",
            'strTieuChi': edu.util.getValById("txtTieuChi_Ten"),
            'iThuTu': edu.util.getValById("txtTieuChi_ThuTuHienThi"),
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropTieuChi_KeHoach"),
            'strLoaiDoiTuong_Id': edu.util.getValById("dropTieuChi_LoaiDoiTuong"),
            'strNhomTieuChi_Id': edu.util.getValById("dropTieuChi_NhomTieuChi"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_TieuChi();
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_TieuChi/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_TieuChi/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_TieuChi: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_PLDG_NLD_TieuChi/CapNhat',            

            'strId': me.strTieuChi_Id,
            'strTieuChi': edu.util.getValById("txtTieuChi_Ten"),
            'iThuTu': edu.util.getValById("txtTieuChi_ThuTuHienThi"),
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropTieuChi_KeHoach"),
            'strLoaiDoiTuong_Id': edu.util.getValById("dropTieuChi_LoaiDoiTuong"),
            'strNhomTieuChi_Id': edu.util.getValById("dropTieuChi_NhomTieuChi"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_TieuChi();
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_TieuChi/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_TieuChi/CapNhat (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TieuChi: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_NLD_TieuChi/Xoa',            

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
                    me.getList_TieuChi();
                }
                else {
                    obj = {
                        content: "NS_PLDG_NLD_TieuChi/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_NLD_TieuChi/Xoa (er): " + JSON.stringify(er),
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
    genTable_TieuChi: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblTieuChi_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblTieuChi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TieuChi.getList_TieuChi()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TIEUCHI) + "</span><br />";
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
    getDetail_TieuChi: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtTieuChi, "ID", me.viewEdit_TieuChi);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtTieuChi, "ID", me.viewDetail_TieuChi);
                break;
        }
    },
    viewEdit_TieuChi: function (data) {
        var me = this;
        var dtTieuChi = data[0];
        edu.util.viewValById("txtTieuChi_Ten", dtTieuChi.TIEUCHI);
        edu.util.viewValById("dropTieuChi_KeHoach", dtTieuChi.NHANSU_DGPL_NAM_KEHOACH_ID);
        edu.util.viewValById("txtTieuChi_ThuTuHienThi", dtTieuChi.THUTU);
        edu.util.viewValById("dropTieuChi_LoaiDoiTuong", dtTieuChi.LOAIDOITUONG_ID);
        edu.util.viewValById("dropTieuChi_NhomTieuChi", dtTieuChi.NHOMTIEUCHI_ID);
    },
    viewDetail_TieuChi: function (data) {
        var me = main_doc.TieuChi;
        var dtTieuChi = data[0];
        edu.util.viewHTMLById("lblTieuChi_Ten", dtTieuChi.TIEUCHI);
        edu.util.viewHTMLById("lblTieuChi_KeHoach", dtTieuChi.NHANSU_DGPL_NAM_KEHOACH_TEN);
        edu.util.viewHTMLById("lblTieuChi_ThuTuHienThi", dtTieuChi.THUTU);
        edu.util.viewHTMLById("lblTieuChi_LoaiDoiTuong", dtTieuChi.LOAIDOITUONG_TEN);
        edu.util.viewHTMLById("lblTieuChi_NhomTieuChi", dtTieuChi.NHOMTIEUCHI_TEN);
    },
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_KeHoach/LayDanhSach',            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': '',
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
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA"
            },
            renderPlace: ["dropTieuChi_KeHoach"],
            type: "",
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    }
};