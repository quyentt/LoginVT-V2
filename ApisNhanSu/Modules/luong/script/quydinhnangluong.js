/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 06/09/2019
----------------------------------------------*/
function QuyDinhNangLuong() { }
QuyDinhNangLuong.prototype = {
    dtQuyDinhNangLuong: [],
    dtTab: '',
    strQuyDinhNangLuong_Id: '',
    arrValid_QuyDinhNangLuong: [],

    init: function () {
        var me = main_doc.QuyDinhNangLuong;
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
            var valid = edu.util.validInputForm(me.arrValid_QuyDinhNangLuong);
            if (valid) {
                if (edu.util.checkValue(me.strQuyDinhNangLuong_Id)) {
                    me.update_QuyDinhNangLuong();
                }
                else {
                    me.save_QuyDinhNangLuong();
                }
            }
            me.rewrite();
            setTimeout(function () {
                me.rewrite();
            }, 1000);
        });
        $(".btnExtend_Search").click(function () {
            me.getList_QuyDinhNangLuong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuyDinhNangLuong();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_QuyDinhNangLuong").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuyDinhNangLuong);
            if (valid) {
                if (edu.util.checkValue(me.strQuyDinhNangLuong_Id)) {
                    me.update_QuyDinhNangLuong();
                }
                else {
                    me.save_QuyDinhNangLuong();
                }
            }
        });
        $("#tblQuyDinhNangLuong").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strQuyDinhNangLuong_Id = strId;
                me.getDetail_QuyDinhNangLuong(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblGT");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuyDinhNangLuong").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuyDinhNangLuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_tblQuyDinhNangLuong();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_tblQuyDinhNangLuong();
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
        me.getList_QuyDinhNangLuong();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_QuyDinhNangLuong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtThoiHanNangLuong", "THONGTIN1": "EM" },
            { "MA": "dropQuyDinhLuong", "THONGTIN1": "EM" },
            { "MA": "dropLoai", "THONGTIN1": "EM" },
            { "MA": "dropLoaiPhuCap", "THONGTIN1": "EM" },
        ];
        me.getList_QuyDinhLuong();
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.LOAICONGCHUC", "dropLoai");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NHOMNGACH", "dropNhom");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NGACH", "", "", me.genCombo_Ngach);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_QuyDinhNangLuong");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QuyDinhNangLuong");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QuyDinhNangLuong");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        $("#myModalLabel_QuyDinhNangLuong").html('<i class="fa fa-pencil"></i> Kê khai quy định phụ cấp');
        me.strQuyDinhNangLuong_Id = "";
        var arrId = ["txtThoiHanNhanPhuCap", "dropQuyDinhLuong", "dropLoai", "dropNhom", "dropNgach", "dropLoaiPhuCap", "txtGhiChu", "txtThoiHanNangLuong"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_QuyDinhNangLuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_QuyDinhNangLuong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': "",
            'strNhanSu_QuyDinhLuong_Id': "",
            'strLoaiPhuCap_Id': edu.util.getValById("dropLoaiPhuCap"),
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
                        me.strQuyDinhNangLuong_Id = dtResult;
                    }
                    me.genTable_QuyDinhNangLuong(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_QuyDinhNangLuong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_QuyDinhNangLuong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QuyDinhNangLuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinhNangLuong/ThemMoi',
            

            'strId': "",
            'dThoiHanNangLuong': edu.util.getValById("txtThoiHanNangLuong"),
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strLoai_Id': edu.util.getValById("dropLoai"),
            'strNhom_Id': edu.util.getValById("dropNhom"),
            'strNgach_Id': edu.util.getValById("dropNgach"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_QuyDinhNangLuong();
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
    update_QuyDinhNangLuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinhNangLuong/CapNhat',
            

            'strId': me.strQuyDinhNangLuong_Id,
            'dThoiHanNangLuong': edu.util.getValById("txtThoiHanNangLuong"),
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strLoai_Id': edu.util.getValById("dropLoai"),
            'strNhom_Id': edu.util.getValById("dropNhom"),
            'strNgach_Id': edu.util.getValById("dropNgach"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QuyDinhNangLuong();
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
    getDetail_QuyDinhNangLuong: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_QuyDinhNangLuong/LayChiTiet',
            
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
                        me.viewForm_QuyDinhNangLuong(data.Data[0]);
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
    delete_QuyDinhNangLuong: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_QuyDinhNangLuong/Xoa',
            
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
                    me.getList_QuyDinhNangLuong();
                }
                else {
                    obj = {
                        content: "L_QuyDinhNangLuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_QuyDinhNangLuong/Xoa (er): " + JSON.stringify(er),
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
    genTable_QuyDinhNangLuong: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyDinhNangLuong_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQuyDinhNangLuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDinhNangLuong.getList_QuyDinhNangLuong()",
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
                        html += '<span>' + 'Ngạch: ' + edu.util.returnEmpty(aData.NGACH_TEN) + "</span><br />";
                        html += '<span>' + 'Thời hạn nâng lương: ' + edu.util.returnEmpty(aData.THOIHANNANGLUONG) + "</span><br />";
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
    viewForm_QuyDinhNangLuong: function (data) {
        var me = this;
        //View - Thong tin
        var dt = data[0];
        edu.util.viewValById("txtThoiHanNangLuong", data.THOIHANNANGLUONG);
        edu.util.viewValById("dropQuyDinhLuong", data.NHANSU_BANGQUYDINHLUONG_ID);
        edu.util.viewValById("dropLoai", data.LOAI_ID);
        edu.util.viewValById("dropNhom", data.NHOM_ID);
        edu.util.viewValById("dropNgach", data.NGACH_ID);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        $("#myModalLabel_QuyDinhNangLuong").html('<i class="fa fa-edit"></i> Chỉnh sửa quy định nâng lương');
    },

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_BangQuyDinhLuong
    -------------------------------------------*/
    getList_QuyDinhLuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
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
                    me.genCombo_QuyDinhLuong(dtResult, iPager);
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
    genCombo_QuyDinhLuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MUCLUONGCOBAN",
                code: "MUCLUONGCOBAN",
                order: "unorder"
            },
            renderPlace: ["dropQuyDinhLuong"],
            title: "Chọn quy định lương"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Ngach
    --Author: vanhiep
	-------------------------------------------*/
    genCombo_Ngach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (nrow, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropNgach"],
            title: "Chọn ngạch"
        };
        edu.system.loadToCombo_data(obj);
    }
};