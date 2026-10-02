/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/08/2019
----------------------------------------------*/
function MucLuongCoBan() { }
MucLuongCoBan.prototype = {
    dtMucLuongCoBan: [],
    dtTab: '',
    strMucLuongCoBan_Id: '',
    arrValid_MucLuongCoBan: [],

    init: function () {
        var me = main_doc.MucLuongCoBan;
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
            if (edu.util.checkValue(me.strMucLuongCoBan_Id)) {
                me.update_MucLuongCoBan();
            }
            else {
                me.save_MucLuongCoBan();
            }
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_MucLuongCoBan();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_MucLuongCoBan();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_MucLuongCoBan").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MucLuongCoBan);
            if (valid) {
                if (edu.util.checkValue(me.strMucLuongCoBan_Id)) {
                    me.update_MucLuongCoBan();
                }
                else {
                    me.save_MucLuongCoBan();
                }
            }
        });
        $("#tblMucLuongCoBan").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strMucLuongCoBan_Id = strId;
                me.getDetail_MucLuongCoBan(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblGT");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblMucLuongCoBan").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_MucLuongCoBan(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_tblMucLuongCoBan();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_tblMucLuongCoBan();
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
        me.getList_MucLuongCoBan();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_MucLuongCoBan = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtMucLuongCoBan", "THONGTIN1": "EM" },
            //{ "MA": "txtNgayBatDauApDung", "THONGTIN1": "EM" },
            //{ "MA": "txtNgayKetThucApDung", "THONGTIN1": "EM" },
            { "MA": "txtSoBacLuongToiDa", "THONGTIN1": "EM" },
        ];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_MucLuongCoBan");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_MucLuongCoBan");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_MucLuongCoBan");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        $("#myModalLabel_MucLuongCoBan").html('.. <i class="fa fa-pencil"></i> Kê khai mức lương cơ bản');
        me.strMucLuongCoBan_Id = "";
        var arrId = ["txtMucLuongCoBan", "txtNgayBatDauApDung", "txtNgayKetThucApDung", "txtMoTa", "txtSoBacLuongToiDa", "txtLuongToiThieuVung"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_MucLuongCoBan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',
            

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
                        me.strMucLuongCoBan_Id = dtResult;
                    }
                    me.genTable_MucLuongCoBan(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_BangQuyDinhLuong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_BangQuyDinhLuong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_MucLuongCoBan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_BangQuyDinhLuong/ThemMoi',
            

            'strId': "",
            'dMucLuongCoBan': edu.util.getValById("txtMucLuongCoBan"),
            'dSoBacLuongToiDa': edu.util.getValById("txtSoBacLuongToiDa"),
            'dLuongToiThieuVung': edu.util.getValById("txtLuongToiThieuVung"),
            'strNgayBatDauApDung': edu.util.getValById("txtNgayBatDauApDung"),
            'strNgayKetThucApDung': edu.util.getValById("txtNgayKetThucApDung"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_MucLuongCoBan();
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
    update_MucLuongCoBan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_BangQuyDinhLuong/CapNhat',
            

            'strId': me.strMucLuongCoBan_Id,
            'dMucLuongCoBan': edu.util.getValById("txtMucLuongCoBan"),
            'dSoBacLuongToiDa': edu.util.getValById("txtSoBacLuongToiDa"),
            'dLuongToiThieuVung': edu.util.getValById("txtLuongToiThieuVung"),
            'strNgayBatDauApDung': edu.util.getValById("txtNgayBatDauApDung"),
            'strNgayKetThucApDung': edu.util.getValById("txtNgayKetThucApDung"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_MucLuongCoBan();
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
    getDetail_MucLuongCoBan: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_BangQuyDinhLuong/LayChiTiet',
            
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
                        me.viewForm_MucLuongCoBan(data.Data[0]);
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
    delete_MucLuongCoBan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_BangQuyDinhLuong/Xoa',
            
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
                    me.getList_MucLuongCoBan();
                }
                else {
                    obj = {
                        content: "L_BangQuyDinhLuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_BangQuyDinhLuong/Xoa (er): " + JSON.stringify(er),
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
    genTable_MucLuongCoBan: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblMucLuongCoBan_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblMucLuongCoBan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.MucLuongCoBan.getList_MucLuongCoBan()",
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
                        html += '<span>' + 'Mức lương cơ bản: ' + edu.util.returnEmpty(aData.MUCLUONGCOBAN) + "</span><br />";
                        html += '<span>' + 'Thời gian áp dụng: ' + edu.util.returnEmpty(aData.NGAYBATDAUAPDUNG) + ' - ' + edu.util.returnEmpty(aData.NGAYKETTHUCAPDUNG) +  "</span><br />";
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
    viewForm_MucLuongCoBan: function (data) {
        var me = this;
        //View - Thong tin
        var dt = data[0];
        edu.util.viewValById("txtMucLuongCoBan", data.MUCLUONGCOBAN);
        edu.util.viewValById("txtSoBacLuongToiDa", data.SOBACLUONGTOIDA);
        edu.util.viewValById("txtLuongToiThieuVung", data.LUONGTOITHIEUVUNG);
        edu.util.viewValById("txtNgayBatDauApDung", data.NGAYBATDAUAPDUNG);
        edu.util.viewValById("txtNgayKetThucApDung", data.NGAYKETTHUCAPDUNG);
        edu.util.viewValById("txtMoTa", data.MOTA);
        $("#myModalLabel_MucLuongCoBan").html('<i class="fa fa-edit"></i> Chỉnh sửa mức lương cơ bản');
    },
};