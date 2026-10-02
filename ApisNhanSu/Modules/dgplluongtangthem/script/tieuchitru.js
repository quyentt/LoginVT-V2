/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function TieuChiTru() { }
TieuChiTru.prototype = {
    dtTieuChiTru: [],
    strTieuChiTru_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
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
        $("#txtSearch_TieuChiTru_TuKhoa").focus();
        $("#txtSearch_TieuChiTru_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TieuChiTru();
            }
        });
        /*------------------------------------------
        --Discription: [1] Action TieuChiTru
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_TieuChiTru").click(function () {
            me.getList_TieuChiTru();
        });
        $("#btnSave_TieuChiTru").click(function () {
            if (edu.util.checkValue(me.strTieuChiTru_Id)) {
                me.update_TieuChiTru();
            }
            else {
                me.save_TieuChiTru();
            }
        });
        $("#tblTieuChiTru").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strTieuChiTru_Id = strId;
                me.getDetail_TieuChiTru(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblTieuChiTru");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTieuChiTru").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TieuChiTru(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [1] Action TieuChi
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_TieuChiTru_LoaiApDung").change("select:select2", function () {
            var strId = $("#dropSearch_TieuChiTru_LoaiApDung").val();
            me.getList_TieuChi(strId, "dropSearch_TieuChiTru_TieuChi");
        });
        $("#dropTieuChiTru_LoaiApDung").change("select:select2", function () {
            var strId = $("#dropTieuChiTru_LoaiApDung").val();
            me.getList_TieuChi(strId, "dropTieuChiTru_TieuChi");
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load TieuChiTru
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_TieuChiTru();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LDTL, "dropTieuChiTru_LoaiApDung,dropSearch_TieuChiTru_LoaiApDung");
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.PTLT, "dropTieuChiTru_PTLT,dropSearch_TieuChiTru_PTLT");
                }, 50)
            }, 50);
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_TieuChiTru");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_TieuChiTru");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_TieuChiTru");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strTieuChiTru_Id = "";
        var arrId = ["txtTieuChiTru_Ten", "txtTieuChiTru_TuNgay", "txtTieuChiTru_DenNgay", "txtTieuChiTru_NoiDung"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TieuChiTru
    -------------------------------------------*/
    getList_TieuChiTru: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_PLDG_LTT_TieuChiTru/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TieuChiTru_TuKhoa"),
            'strNhanSu_DGPL_LTT_TC_Id': edu.util.getValById("dropSearch_TieuChiTru_TieuChi"),
            'strPhuongThucLayThongTin_Id': edu.util.getValById("dropSearch_TieuChiTru_PTLT"),
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
                        iPager = data.Pager;
                        me.dtTieuChiTru = dtResult;
                    }
                    me.genTable_TieuChiTru(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChiTru/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChiTru/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_TieuChiTru: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_TieuChiTru/ThemMoi',
            

            'strId': "",
            'strNhanSu_DGPL_LTT_TC_Id': edu.util.getValById("dropTieuChiTru_TieuChi"),
            'strTieuChi': edu.util.getValById("txtTieuChiTru_Ten"),
            'iThuTu': edu.util.getValById("txtTieuChiTru_ThuTu"),
            'dDiemChuan': edu.util.getValById("txtTieuChiTru_DiemChuan"),
            'strPhuongThucLayThongTin_Id': edu.util.getValById("dropTieuChiTru_PTLT"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_TieuChiTru();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChiTru/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChiTru/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_TieuChiTru: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_PLDG_LTT_TieuChiTru/CapNhat',
            

            'strId': me.strTieuChiTru_Id,
            'strNhanSu_DGPL_LTT_TC_Id': edu.util.getValById("dropTieuChiTru_TieuChi"),
            'strTieuChi': edu.util.getValById("txtTieuChiTru_Ten"),
            'iThuTu': edu.util.getValById("txtTieuChiTru_ThuTu"),
            'dDiemChuan': edu.util.getValById("txtTieuChiTru_DiemChuan"),
            'strPhuongThucLayThongTin_Id': edu.util.getValById("dropTieuChiTru_PTLT"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_TieuChiTru();
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChiTru/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChiTru/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TieuChiTru: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_LTT_TieuChiTru/Xoa',
            

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
                    me.getList_TieuChiTru();
                }
                else {
                    obj = {
                        content: "NS_PLDG_LTT_TieuChiTru/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_LTT_TieuChiTru/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML TieuChiTru
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TieuChiTru: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblTieuChiTru_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblTieuChiTru",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TieuChiTru.getList_TieuChiTru()",
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
    getDetail_TieuChiTru: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtTieuChiTru, "ID", me.viewEdit_TieuChiTru);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtTieuChiTru, "ID", me.viewDetail_TieuChiTru);
                break;
        }
    },
    viewEdit_TieuChiTru: function (data) {
        var me = this;
        var dtTieuChiTru = data[0];
        //View - Thong tin
        edu.util.viewValById("dropTieuChiTru_KeHoach", dtTieuChiTru.NHANSU_DGPL_LTT_KEHOACH_ID);
        edu.util.viewValById("txtTieuChiTru_Ten", dtTieuChiTru.TIEUCHI);
        edu.util.viewValById("txtTieuChiTru_DiemChuan", dtTieuChiTru.DIEMCHUAN);
        edu.util.viewValById("txtTieuChiTru_ThuTu", dtTieuChiTru.THUTU);
        edu.util.viewValById("dropTieuChiTru_LoaiApDung", dtTieuChiTru.LOAIDOITUONGAPDUNG_ID);
    },
    viewDetail_TieuChiTru: function (data) {
        var me = main_doc.TieuChiTru;
        var dtTieuChiTru = data[0];
        //View - Thong tin
        edu.util.viewHTMLById("lblTieuChiTru_KeHoach", dtTieuChiTru.NHANSU_DGPL_LTT_KEHOACH_TEN);
        edu.util.viewHTMLById("lblTieuChiTru_Ten", dtTieuChiTru.TIEUCHI);
        edu.util.viewHTMLById("lblTieuChiTru_DiemChuan", dtTieuChiTru.DIEMCHUAN);
        edu.util.viewHTMLById("lblTieuChiTru_ThuTu", dtTieuChiTru.THUTU);
        edu.util.viewHTMLById("lblTieuChiTru_LoaiApDung", dtTieuChiTru.LOAIDOITUONGAPDUNG_TEN);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML KeHoach
    --ULR:  Modules
    -------------------------------------------*/
    getList_TieuChi: function (strLoaiDoiTuong_Id, place) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_PLDG_LTT_TieuChi/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById(""),
            'strNhanSu_DGPL_LTT_KH_Id': edu.util.getValById(""),
            'strLoaiDoiTuongApDung_Id': strLoaiDoiTuong_Id,
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
                        me.dtTieuChi = dtResult;
                    }
                    me.genCombo_TieuChi(dtResult, place);
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChi/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChi/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_TieuChi: function (data, place) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TIEUCHI",
                code: "MA"
            },
            renderPlace: [place],
            type: "",
            title: "Chọn tiêu chí"
        };
        edu.system.loadToCombo_data(obj);
    }
};