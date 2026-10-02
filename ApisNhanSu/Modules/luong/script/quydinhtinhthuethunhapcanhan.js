/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/08/2019
----------------------------------------------*/
function QDThueTNCN() { }
QDThueTNCN.prototype = {
    dtQDThueTNCN: [],
    dtTab: '',
    strQDThueTNCN_Id: '',
    arrValid_QDThueTNCN: [],

    init: function () {
        var me = main_doc.QDThueTNCN;
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
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strQDThueTNCN_Id)) {
                me.update_QDThueTNCN();
            }
            else {
                me.save_QDThueTNCN();
            }
            
            setTimeout(function () {
                me.rewrite();
            }, 1000);
        });
        $("#btnSearch").click(function () {
            me.getList_QDThueTNCN();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QDThueTNCN();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_QDThueTNCN").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QDThueTNCN);
            if (valid) {
                if (edu.util.checkValue(me.strQDThueTNCN_Id)) {
                    me.update_QDThueTNCN();
                }
                else {
                    me.save_QDThueTNCN();
                }
            }
        });
        $("#tblQDThueTNCN").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strQDThueTNCN_Id = strId;
                me.getDetail_QDThueTNCN(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblQDThueTNCN");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQDThueTNCN").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QDThueTNCN(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_QDThueTNCN();
            }
        });
        $("#btnExtend_Search").click(function () {
            me.getList_QDThueTNCN();
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
        me.getList_QDThueTNCN();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_QDThueTNCN = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtMucCanDuoi", "THONGTIN1": "EM" },

            { "MA": "txtPhanTramThue", "THONGTIN1": "EM" },
            { "MA": "txtMucCanTren", "THONGTIN1": "EM" },
        ];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QDThueTNCN");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QDThueTNCN");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QDThueTNCN");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        $("#myModalLabel_QDThueTNCN").html('.. <i class="fa fa-pencil"></i> Kê khai quy định tính thuế thu nhập cá nhân');
        me.strQDThueTNCN_Id = "";
        var arrId = ["txtMucCanDuoi", "txtMucCanTren", "txtPhanTramThue", "txtNgayBatDauApDung"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_QDThueTNCN: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_QuyDinh_ThueThuNhapCaNhan/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': "",
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
                        me.strQDThueTNCN_Id = dtResult;
                    }
                    me.genTable_QDThueTNCN(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_QuyDinh_ThueThuNhapCaNhan/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_QuyDinh_ThueThuNhapCaNhan/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QDThueTNCN: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinh_ThueThuNhapCaNhan/ThemMoi',
            

            'strId': "",
            'dMucCanDuoi': edu.util.getValById("txtMucCanDuoi"),
            'dMucCanTren': edu.util.getValById("txtMucCanTren"),
            'dPhanTramThue': edu.util.getValById("txtPhanTramThue"),
            'strNgayApDung': edu.util.getValById("txtNgayBatDauApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_QDThueTNCN();
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                    });
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_QDThueTNCN: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinh_ThueThuNhapCaNhan/CapNhat',
            

            'strId': me.strQDThueTNCN_Id,
            'dMucCanDuoi': edu.util.getValById("txtMucCanDuoi"),
            'dMucCanTren': edu.util.getValById("txtMucCanTren"),
            'dPhanTramThue': edu.util.getValById("txtPhanTramThue"),
            'strNgayApDung': edu.util.getValById("txtNgayBatDauApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QDThueTNCN();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_QDThueTNCN: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_QuyDinh_ThueThuNhapCaNhan/LayChiTiet',
            
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
                        me.viewForm_QDThueTNCN(data.Data[0]);
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
    delete_QDThueTNCN: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_QuyDinh_ThueThuNhapCaNhan/Xoa',
            
            'strIds': strIds
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
                    edu.system.afterComfirm(obj);
                    me.getList_QDThueTNCN();
                }
                else {
                    obj = {
                        content: "L_QuyDinh_ThueThuNhapCaNhan/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_QuyDinh_ThueThuNhapCaNhan/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QDThueTNCN: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQDThueTNCN_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQDThueTNCN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QDThueTNCN.tblQDThueTNCN()",
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
                        html += '<span>' + 'Khoảng thu nhập: ' + edu.util.returnEmpty(aData.MUCCANDUOI) + ' - ' + edu.util.returnEmpty(aData.MUCCANTREN) + "</span><br />";
                        html += '<span>' + 'Phần trăm thuế: ' + edu.util.returnEmpty(aData.PHANTRAMTHUE) + "</span><br />";
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
    viewForm_QDThueTNCN: function (data) {
        var me = this;
        //View - Thong tin
        var dt = data[0];
        edu.util.viewValById("txtMucCanDuoi", data.MUCCANDUOI);
        edu.util.viewValById("txtMucCanTren", data.MUCCANTREN);
        edu.util.viewValById("txtPhanTramThue", data.PHANTRAMTHUE);
        edu.util.viewValById("txtNgayBatDauApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtMoTa", data.MOTA);
        $("#myModalLabel_QDThueTNCN").html('<i class="fa fa-edit"></i> Chỉnh sửa quy định tính thuế thu nhập cá nhân');
    },
};