function SinhPhieu() { }
SinhPhieu.prototype = {
    dtKeHoach: [],
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
        $("#btnSearch_SinhPhieu").click(function () {
            me.getList_KeHoach();
        });
        $("#btnSave_Sinhphieu").click(function () {
            if (edu.util.checkValue(me.strKeHoach_Id)) {
                me.update_KeHoach();
            }
            else {
                me.save_KeHoach();
            }
        });
        $("#tblKeHoach").delegate(".btnGen", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/gen_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm("Bạn có chắc chắn muốn sinh phiếu tự động không?");
                $("#btnYes").click(function (e) {
                    me.rewrite();
                    me.genPhieu(strId);
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
        edu.system.dateYearToCombo("1993", "dropKeHoach_Nam", "Chọn năm");
        me.getList_KeHoach();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_KeHoach");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KeHoach");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KeHoach");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strKeHoach_Id = "";
        var arrId = ["txtKeHoach_Ten", "txtKeHoach_TuNgay", "txtKeHoach_DenNgay", "txtKeHoach_NoiDung", "dropKeHoach_Nam"];
        edu.util.resetValByArrId(arrId);
    },
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_KeHoach/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
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
                        me.dtKeHoach = dtResult;
                    }
                    me.genTable_KeHoach(dtResult, iPager);
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
    genPhieu: function (strKeHoach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_PLDG_NLD_TieuChi_CaNhan/KhoiTao',            

            'strLoaiDoiTuong_Id': edu.util.getValById(""),
            'strNhanSu_DGPL_Nam_KH_Id': strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Sinh phiếu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoach();
                }
                else {
                    obj = {
                        content: "NS_PLDG_NLD_TieuChi_CaNhan/KhoiTao: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_NLD_TieuChi_CaNhan/KhoiTao (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblKeHoach_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENKEHOACH) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnGen" id="gen_' + aData.ID + '" href="#" title="View"><i class="fa fa-ticket color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};