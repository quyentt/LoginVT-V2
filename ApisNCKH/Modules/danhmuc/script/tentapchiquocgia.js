/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 04/12/2018
----------------------------------------------*/
function TenTapChiQuocGia() { }
TenTapChiQuocGia.prototype = {
    dtDanhMucTCQG: [],
    strDanhMucTCQG_Id: '',

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
        /*------------------------------------------
        --Discription: [1] Action HoiDongXetChucDanh
        --Order: 
        -------------------------------------------*/
        $(".btnExtend_Search").click(function () {
            me.getList_DMTCQG();
        });
        $("#txtSearch_DMTCQG_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DMTCQG();
            }
        });
        $("#btnSave_DMTCQG").click(function () {
            me.save_DMTCQG();
        });
        $("#tblDMTCQG").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblDMTCQG");
                me.rewrite();
                me.toggle_form();
                me.strDanhMucTCQG_Id = strId;
                me.getDetail_DMTCQG(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDMTCQG").delegate(".btnDelete", "click", function (e) {
            var strId = this.id;
            e.stopImmediatePropagation()
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblDMTCQG");
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DMTCQG(strId);
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
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        me.getList_DMTCQG();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.DTQG, "dropDMTCQG_DanhMucTenTCQG");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.CQXB, "dropDMTCQG_CoQuanXuatBan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LTQG, "dropDMTCQG_LoaiTapChi");
        
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_dmtcqg");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_dmtcqg");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_dmtcqg");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strDanhMucTCQG_Id = "";
        var arrId = ["dropDMTCQG_DanhMucTenTCQG", "dropDMTCQG_LoaiTapChi", "txtDMTCQG_ChiSoISSN", "dropDMTCQG_CoQuanXuatBan", "txtDMTCQG_DaiDiem", "txtDMTCQG_DiemApDung", "txtDMTCQG_ThoiGianApDung", "txtDMTCQG_GhiChu", "txtMaTapChi", "txtTenTapChi"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongXetChucDanh
    -------------------------------------------*/
    getList_DMTCQG: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_DMTapChiQuocGia/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DMTCQG_TuKhoa"),
            'strTenTapChiDang_Id': "",
            'strLoaiTapChi_Id': "",
            'strCoQuanXuatBan_Id': "",
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
                        me.dtDanhMucTCQG = dtResult;
                    }
                    me.genTable_DMTCQG(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocGia/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocGia/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DMTCQG: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_DMTapChiQuocGia/ThemMoi',
            

            'strId': me.strDanhMucTCQG_Id,
            'strThoiGianApDung': edu.util.getValById("txtDMTCQG_ThoiGianApDung"),
            'dDiem': edu.util.getValById("txtDMTCQG_DiemApDung"),
            'strLoaiTapChi_Id': edu.util.getValById("dropDMTCQG_LoaiTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtDMTCQG_ChiSoISSN"),
            'strDaiDiem': edu.util.getValById("txtDMTCQG_DaiDiem"),
            'strCoQuanXuatBan_Id': edu.util.getValById("dropDMTCQG_CoQuanXuatBan"),
            'strGhiChu': edu.util.getValById("txtDMTCQG_GhiChu"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,

            'strMaTapChiDang': edu.util.getValById('txtMaTapChi'),
            'strTenTapChiDang': edu.util.getValById('txtTenTapChi'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'NCKH_DMTapChiQuocGia/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DMTCQG();
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocGia/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocGia/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_DMTCQG: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_DMTapChiQuocGia/CapNhat',
            

            'strId': me.strDanhMucTCQG_Id,
            'strTenTapChiDang_Id': edu.util.getValById("dropDMTCQG_DanhMucTenTCQG"),
            'strThoiGianApDung': edu.util.getValById("txtDMTCQG_ThoiGianApDung"),
            'dDiem': edu.util.getValById("txtDMTCQG_DiemApDung"),
            'strLoaiTapChi_Id': edu.util.getValById("dropDMTCQG_LoaiTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtDMTCQG_ChiSoISSN"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaiDiem': edu.util.getValById("txtDMTCQG_DaiDiem"),
            'strCoQuanXuatBan_Id': edu.util.getValById("dropDMTCQG_CoQuanXuatBan"),
            'strGhiChu': edu.util.getValById("txtDMTCQG_GhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_DMTCQG();
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocGia/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocGia/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMTCQG: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_DMTapChiQuocGia/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_DMTCQG();
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DMTapChiQuocGia/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.alert(JSON.stringify(er));
                
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
    --Discription: [1] GenHTML HoiDongXetChucDanh
    -------------------------------------------*/
    getDetail_DMTCQG: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtDanhMucTCQG, "ID", me.viewEdit_DMTCQG);
    },
    genTable_DMTCQG: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDMTCQG_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDMTCQG",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TenTapChiQuocGia.getList_DMTCQG()",
                iDataRow: iPager,
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENTAPCHIDANG) + " (" + edu.util.returnZero(aData.MATAPCHIDANG) + ")</span><br />";
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
    viewEdit_DMTCQG: function (data) {
        var dt = data[0];
        //Edit - Thong tin
        edu.util.viewValById("dropDMTCQG_DanhMucTenTCQG", dt.TENTAPCHIDANG_ID);
        edu.util.viewValById("dropDMTCQG_LoaiTapChi", dt.LOAITAPCHI_ID);
        edu.util.viewValById("txtDMTCQG_ChiSoISSN", dt.CHISO_ISSN);
        edu.util.viewValById("dropDMTCQG_CoQuanXuatBan", dt.COQUANXUATBAN_ID);
        edu.util.viewValById("txtDMTCQG_DaiDiem", dt.DAIDIEM);
        edu.util.viewValById("txtDMTCQG_DiemApDung", dt.DIEM);
        edu.util.viewValById("txtDMTCQG_ThoiGianApDung", dt.THOIGIANAPDUNG);
        edu.util.viewValById("txtDMTCQG_GhiChu", dt.GHICHU);
        edu.util.viewValById("txtTenTapChi", dt.TENTAPCHIDANG);
        edu.util.viewValById("txtMaTapChi", dt.MATAPCHIDANG);
        //view DoiTuong
    },
};