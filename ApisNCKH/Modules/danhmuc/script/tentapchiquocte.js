/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 04/12/2018
----------------------------------------------*/
function TenTapChiQuocTe() { }
TenTapChiQuocTe.prototype = {
    dtDanhMucTCQT: [],
    strDanhMucTCQT_Id: '',

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
            me.getList_DMTCQT();
        });
        /*------------------------------------------
        --Discription: [1] Action HoiDongXetChucDanh
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_DMTCQT").click(function () {
            me.getList_DMTCQT();
        });
        $("#txtSearch_DMTCQT_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DMTCQT();
            }
        });
        $("#btnSave_DMTCQT").click(function () {

            me.save_DMTCQT();
        });
        $("#tblDMTCQT").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblDMTCQT");
                me.rewrite();
                me.toggle_form();
                me.strDanhMucTCQT_Id = strId;
                me.getDetail_DMTCQT(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDMTCQT").delegate(".btnDelete", "click", function (e) {
            var strId = this.id;
            e.stopImmediatePropagation();
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblDMTCQT");
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DMTCQT(strId);
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
        me.getList_DMTCQT();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.CQXB, "dropDMTCQT_CoQuanXuatBan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LTQG, "dropDMTCQT_LoaiTapChi");
        
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_dmtcqt");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_dmtcqt");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_dmtcqt");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strDanhMucTCQT_Id = "";
        var arrId = ["dropDMTCQT_DanhMucTenTCQG", "dropDMTCQT_LoaiTapChi", "txtDMTCQT_ChiSoISSN", "dropDMTCQT_CoQuanXuatBan", "txtDMTCQT_DaiDiem", "txtDMTCQT_DiemApDung", "txtDMTCQT_ThoiGianApDung", "txtDMTCQT_GhiChu", "txtMaTapChi", "txtTenTapChi"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongXetChucDanh
    -------------------------------------------*/
    getList_DMTCQT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_DMTapChiQuocTe/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DMTCQT_TuKhoa"),
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
                        me.dtDanhMucTCQT = dtResult;
                    }
                    me.genTable_DMTCQT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DMTCQT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_DMTapChiQuocTe/ThemMoi',
            

            'strId': me.strDanhMucTCQT_Id,
            'strTenTapChiDang_Id': edu.util.getValById("dropDMTCQT_DanhMucTenTCQG"),
            'strThoiGianApDung': edu.util.getValById("txtDMTCQT_ThoiGianApDung"),
            'dDiem': edu.util.getValById("txtDMTCQT_DiemApDung"),
            'strLoaiTapChi_Id': edu.util.getValById("dropDMTCQT_LoaiTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtDMTCQT_ChiSoISSN"),
            'strDaiDiem': edu.util.getValById("txtDMTCQT_DaiDiem"),
            'strCoQuanXuatBan_Id': edu.util.getValById("dropDMTCQT_CoQuanXuatBan"),
            'strGhiChu': edu.util.getValById("txtDMTCQT_GhiChu"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strMaTapChiDang': edu.util.getValById('txtMaTapChi'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTenTapChiDang': edu.util.getValById('txtTenTapChi'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'NCKH_DMTapChiQuocTe/CapNhat';
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
                    me.getList_DMTCQT();
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocTe/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocTe/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMTCQT: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_DMTapChiQuocTe/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    me.getList_DMTCQT();
                }
                else {
                    obj = {
                        content: "NCKH_DMTapChiQuocTe/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DMTapChiQuocTe/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML HoiDongXetChucDanh
    -------------------------------------------*/
    getDetail_DMTCQT: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtDanhMucTCQT, "ID", me.viewEdit_DMTCQT);
    },
    genTable_DMTCQT: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDMTCQT_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblDMTCQT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TenTapChiQuocTe.getList_DMTCQT()",
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
    viewEdit_DMTCQT: function (data) {
        var dt = data[0];
        //Edit - Thong tin
        edu.util.viewValById("dropDMTCQT_DanhMucTenTCQG", dt.TENTAPCHIDANG_ID);
        edu.util.viewValById("dropDMTCQT_LoaiTapChi", dt.LOAITAPCHI_ID);
        edu.util.viewValById("txtDMTCQT_ChiSoISSN", dt.CHISO_ISSN);
        edu.util.viewValById("dropDMTCQT_CoQuanXuatBan", dt.COQUANXUATBAN_ID);
        edu.util.viewValById("txtDMTCQT_DaiDiem", dt.DAIDIEM);
        edu.util.viewValById("txtDMTCQT_DiemApDung", dt.DIEM);
        edu.util.viewValById("txtDMTCQT_ThoiGianApDung", dt.THOIGIANAPDUNG);
        edu.util.viewValById("txtDMTCQT_GhiChu", dt.GHICHU);
        edu.util.viewValById("txtTenTapChi", dt.TENTAPCHIDANG);
        edu.util.viewValById("txtMaTapChi", dt.MATAPCHIDANG);
        //view DoiTuong
    },
};