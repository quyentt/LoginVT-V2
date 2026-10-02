/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/08/2019
----------------------------------------------*/
function KeHoachXetNangLuong() { }
KeHoachXetNangLuong.prototype = {
    dtKeHoachXetNangLuong: [],
    dtTab: '',
    strKeHoachXetNangLuong_Id: '',
    arrValid_KeHoachXetNangLuong: [],

    init: function () {
        var me = main_doc.KeHoachXetNangLuong;
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

            if (edu.util.checkValue(me.strKeHoachXetNangLuong_Id)) {
                me.update_KeHoachXetNangLuong();
            }
            else {
                me.save_KeHoachXetNangLuong();
            }

            setTimeout(function () {
                me.rewrite();
            }, 1000);
        });
        $("#btnExtend_Search").click(function () {
            me.getList_KeHoachXetNangLuong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoachXetNangLuong();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_KeHoachXetNangLuong").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KeHoachXetNangLuong);
                if (valid) {
                    if (edu.util.checkValue(me.strKeHoachXetNangLuong_Id)) {
                        me.update_KeHoachXetNangLuong();
                    }
                    else {
                        me.save_KeHoachXetNangLuong();
                    }
                }
        });
        $("#tblKeHoachXetNangLuong").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strKeHoachXetNangLuong_Id = strId;
                me.getDetail_KeHoachXetNangLuong(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblKeHoachXetNangLuong");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoachXetNangLuong").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachXetNangLuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        

        $("#dropSearch_LoaiXetNangLuong").keypress(function (e) {
            if (e.which == 13) {
                me.getList_KeHoachXetNangLuong();
            }
        });
        $("#btnExtend_Search").click(function () {
            me.getList_KeHoachXetNangLuong();
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
        me.getList_KeHoachXetNangLuong();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);

        edu.system.loadToCombo_DanhMucDuLieu("LUONG.LOAIXETNANGLUONG", "dropLoaiXetNangLuong, dropSearch_LoaiXetNangLuong");
        me.arrValid_KeHoachXetNangLuong= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropLoaiXetNangLuong", "THONGTIN1": "EM" },
            //{ "MA": "txtPhanTramThue", "THONGTIN1": "EM" },
            //{ "MA": "txtMucCanTren", "THONGTIN1": "EM" },
        ];
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KeHoachXetNangLuong");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KeHoachXetNangLuong");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KeHoachXetNangLuong");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        $("#myModalLabel_KeHoachXetNangLuong").html('.. <i class="fa fa-pencil"></i> Kê khai kế hoạch xét nâng lương');
        me.strKeHoachXetNangLuong_Id = "";
        var arrId = ["dropLoaiXetNangLuong", "txtNgayBatDau", "txtNgayKetThuc", "txtGhiChu"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/

   
    getList_KeHoachXetNangLuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_KeHoachXetLuong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strLoaiXetLuong_Id': edu.util.getValById("dropSearch_LoaiXetNangLuong"),
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
                        me.strLoaiXetLuong_Id = dtResult;
                    }
                    me.genTable_KeHoachXetNangLuong(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_KeHoachXetLuong/LayDanhSach: " + data.Message, "w");
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

    save_KeHoachXetNangLuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_KeHoachXetLuong/ThemMoi',
            

            'strId': '',
            'strLoaiXetLuong_Id': edu.util.getValById("dropLoaiXetNangLuong"),
            'strNgayBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNgayKetThuc"),

            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_KeHoachXetNangLuong();
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
    update_KeHoachXetNangLuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_KeHoachXetLuong/CapNhat',
            

            'strId': me.strKeHoachXetNangLuong_Id,
            'strLoaiXetLuong_Id': edu.util.getValById("dropLoaiXetNangLuong"),
            'strNgayBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNgayKetThuc"),

            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_KeHoachXetNangLuong();
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
   
    getDetail_KeHoachXetNangLuong: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_KeHoachXetLuong/LayChiTiet',
            
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
                        me.viewForm_KeHoachXetNangLuong(data.Data[0]);
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

    delete_KeHoachXetNangLuong: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_KeHoachXetLuong/Xoa',
            
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
                    me.getList_KeHoachXetNangLuong();
                }
                else {
                    obj = {
                        content: "L_KeHoachXetLuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_KeHoachXetLuong/Xoa (er): " + JSON.stringify(er),
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
    genTable_KeHoachXetNangLuong: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblKeHoachXetNangLuong_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblKeHoachXetNangLuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXetNangLuong.tblKeHoachXetNangLuong()",
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
                        html += '<span>' + 'Kế hoạch xét nâng lương: ' + edu.util.returnEmpty(aData.LOAIXETLUONG_TEN) + "</span><br />";
                        html += '<span>' + 'Thời gian: ' + edu.util.returnEmpty(aData.NGAYBATDAU) + '-' + edu.util.returnEmpty(aData.NGAYKETTHUC) +"</span><br />";
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
    viewForm_KeHoachXetNangLuong: function (data) {
        var me = this;
        //View - Thong tin
        //var dt = data[0];
        edu.util.viewValById("dropLoaiXetNangLuong", data.LOAIXETLUONG_ID);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        $("#myModalLabel_KeHoachXetNangLuong").html('<i class="fa fa-edit"></i> Chỉnh sửa kế hoạch nâng lương');
    },
};