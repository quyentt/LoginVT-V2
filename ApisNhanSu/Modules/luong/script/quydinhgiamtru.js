/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/08/2019
----------------------------------------------*/
function QDGiamTruGiaCanh() { }
QDGiamTruGiaCanh.prototype = {
    dtQDGiamTruGiaCanh: [],
    dtTab: '',
    strQDGiamTruGiaCanh_Id: '',
    arrValid_QDGiamTruGiaCanh: [],

    init: function () {
        var me = main_doc.QDGiamTruGiaCanh;
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
            if (edu.util.checkValue(me.strQDGiamTruGiaCanh_Id)) {
                me.update_QDGiamTruGiaCanh();
            }
            else {
                me.save_QDGiamTruGiaCanh();
            }
            
            setTimeout(function () {
                me.rewrite();
            }, 1000);
        });
        $("#btnSearch").click(function () {
            me.getList_QDGiamTruGiaCanh();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QDGiamTruGiaCanh();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_QDGiamTruGiaCanh").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QDGiamTruGiaCanh);
            if (valid) {
                if (edu.util.checkValue(me.strQDGiamTruGiaCanh_Id)) {
                    me.update_QDGiamTruGiaCanh();
                }
                else {
                    me.save_QDGiamTruGiaCanh();
                }
            }
        });
        $("#tblQDGiamTruGiaCanh").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strQDGiamTruGiaCanh_Id = strId;
                me.getDetail_QDGiamTruGiaCanh(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblQDGiamTruGiaCanh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQDGiamTruGiaCanh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QDGiamTruGiaCanh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_QDGiamTruGiaCanh();
            }
        });
        $("#btnExtend_Search").click(function () {
            me.getList_QDGiamTruGiaCanh();
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
        me.getList_QDGiamTruGiaCanh();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_QDGiamTruGiaCanh= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDoiVoiNguoiNopThue", "THONGTIN1": "EM" },
            //{ "MA": "txtPhanTramThue", "THONGTIN1": "EM" },
            //{ "MA": "txtMucCanTren", "THONGTIN1": "EM" },
        ];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QDGiamTruGiaCanh");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QDGiamTruGiaCanh");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QDGiamTruGiaCanh");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        $("#myModalLabel_QDGiamTruGiaCanh").html('.. <i class="fa fa-pencil"></i> Kê khai quy định giảm trừ gia cảnh');
        me.strQDGiamTruGiaCanh_Id = "";
        var arrId = ["txtDoiVoiNguoiNopThue", "txtDoiVoiNguoiPhuThuoc", "txtNgayBatDauApDung"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_QDGiamTruGiaCanh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_QuyDinh_GiamTru/LayDanhSach',
            

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
                        me.strQDGiamTruGiaCanh_Id = dtResult;
                    }
                    me.genTable_QDGiamTruGiaCanh(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_QuyDinh_GiamTru/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_QuyDinh_GiamTru/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QDGiamTruGiaCanh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinh_GiamTru/ThemMoi',
            

            'strId': "",
            'dVoiNguoiNopThue': edu.util.getValById("txtDoiVoiNguoiNopThue"),
            'dVoiNguoiPhuThuoc': edu.util.getValById("txtDoiVoiNguoiPhuThuoc"),
            'strNgayApDung': edu.util.getValById("txtNgayBatDauApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_QDGiamTruGiaCanh();
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
    update_QDGiamTruGiaCanh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinh_GiamTru/CapNhat',
            

            'strId': me.strQDGiamTruGiaCanh_Id,
            'dVoiNguoiNopThue': edu.util.getValById("txtDoiVoiNguoiNopThue"),
            'dVoiNguoiPhuThuoc': edu.util.getValById("txtDoiVoiNguoiPhuThuoc"),
            'strNgayApDung': edu.util.getValById("txtNgayBatDauApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QDGiamTruGiaCanh();
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
    getDetail_QDGiamTruGiaCanh: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_QuyDinh_GiamTru/LayChiTiet',
            
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
                        me.viewForm_QDGiamTruGiaCanh(data.Data[0]);
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
    delete_QDGiamTruGiaCanh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_QuyDinh_GiamTru/Xoa',
            
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
                    me.getList_QDGiamTruGiaCanh();
                }
                else {
                    obj = {
                        content: "L_QuyDinh_GiamTru/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_QuyDinh_GiamTru/Xoa (er): " + JSON.stringify(er),
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
    genTable_QDGiamTruGiaCanh: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQDGiamTruGiaCanh_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQDGiamTruGiaCanh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QDGiamTruGiaCanh.tblQDGiamTruGiaCanh()",
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
                        html += '<span>' + 'Với người nộp thuế: ' + edu.util.returnEmpty(aData.VOINGUOINOPTHUE) + "</span><br />";
                        html += '<span>' + 'Với người phụ thuộc: ' + edu.util.returnEmpty(aData.VOIMOINGUOIPHUTHUOC) + "</span><br />";
                        html += '<span>' + 'Ngày áp dụng: ' + edu.util.returnEmpty(aData.NGAYAPDUNG) + "</span><br />";
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
    viewForm_QDGiamTruGiaCanh: function (data) {
        var me = this;
        //View - Thong tin
        //var dt = data[0];
        edu.util.viewValById("txtDoiVoiNguoiNopThue", data.VOINGUOINOPTHUE);
        edu.util.viewValById("txtDoiVoiNguoiPhuThuoc", data.VOIMOINGUOIPHUTHUOC);
        edu.util.viewValById("txtNgayBatDauApDung", data.NGAYAPDUNG);
        $("#myModalLabel_QDGiamTruGiaCanh").html('<i class="fa fa-edit"></i> Chỉnh sửa quy định giảm trừ gia cảnh');
    },
};