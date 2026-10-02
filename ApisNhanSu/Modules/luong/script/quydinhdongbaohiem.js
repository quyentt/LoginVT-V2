/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 06/09/2019
----------------------------------------------*/
function QuyDinhDongBaoHiem() { }
QuyDinhDongBaoHiem.prototype = {
    dtQuyDinhDongBaoHiem: [],
    dtTab: '',
    strQuyDinhDongBaoHiem_Id: '',
    arrValid_QuyDinhDongBaoHiem: [],
    arrId: [],


    init: function () {
        var me = main_doc.QuyDinhDongBaoHiem;
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
            if (edu.util.checkValue(me.strQuyDinhDongBaoHiem_Id)) {
                me.update_QuyDinhDongBaoHiem();
            }
            else {
                me.save_QuyDinhDongBaoHiem();
            }
            setTimeout(function () {
                me.rewrite();
            }, 1000);
        });
        $(".btnExtend_Search").click(function () {
            me.getList_QuyDinhDongBaoHiem();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuyDinhDongBaoHiem();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_QuyDinhDongBaoHiem").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuyDinhDongBaoHiem);
            console.log(me.strQuyDinhDongBaoHiem_Id)
            if (valid) {
                if (edu.util.checkValue(me.strQuyDinhDongBaoHiem_Id)) {
                    me.update_QuyDinhDongBaoHiem();
                }
                else {
                    me.save_QuyDinhDongBaoHiem();
                }
            }
        });
        $("#tblQuyDinhDongBaoHiem").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strQuyDinhDongBaoHiem_Id = strId;
                me.getDetaiL_QuyDinhBaoHiem(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblQuyDinhDongBaoHiem");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuyDinhDongBaoHiem").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuyDinhDongBaoHiem(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_tblQuyDinhDongBaoHiem();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_tblQuyDinhDongBaoHiem();
        });

        edu.system.loadToCheckBox_DMDL("DKH.TTSV", "divLoaiKhoanTinhBaoHiem", 6);
        edu.system.loadToCheckBox_DMDL("DKH.TTSV", "divLoaiPhuCapTinhBaoHiem", 6);
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        me.getList_QuyDinhDongBaoHiem();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_QuyDinhDongBaoHiem = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtThoiHanNangLuong", "THONGTIN1": "EM" },
            { "MA": "dropQuyDinhLuong", "THONGTIN1": "EM" },
            { "MA": "dropLoai", "THONGTIN1": "EM" },
            { "MA": "dropLoaiPhuCap", "THONGTIN1": "EM" },
        ];
        me.getList_QuyDinhLuong();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIKHOAN", "dropLoaiKhoan");
        //edu.system.loadToCombo_DanhMucDuLieu("LUONG.BAOHIEM.LOAIKHOANTINHBAOHIEM", "dropLoaiKhoanTinhBaoHiem");
        //edu.system.loadToCombo_DanhMucDuLieu("LUONG.BAOHIEM.LOAIPHUCAPTINHBAOHIEM", "dropLoaiPhuCapTinhBaoHiem");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.BAOHIEM.DOITUONGAPDUNG", "dropDoiTuongApDung");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIKHOAN", "", "", me.loadLoaiKhoan);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detaiL_QuyDinhBaoHiem");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QuyDinhDongBaoHiem");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QuyDinhDongBaoHiem");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strQuyDinhDongBaoHiem_Id = "";
        $("#divLoaiKhoanTinhBaoHiem").find('input:checkbox').each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        }); $("#divLoaiPhuCapTinhBaoHiem").find('input:checkbox').each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        });
        edu.util.resetValById("dropQuyDinhLuong");
        edu.util.resetValById("dropLoaiKhoan");
        edu.util.resetValById("txtPhanTram");
        edu.util.resetValById("divLoaiKhoanTinhBaoHiem");
        edu.util.resetValById("divLoaiPhuCapTinhBaoHiem");
        edu.util.resetValById("dropDoiTuongApDung");
        $("#myModalLabeL_QuyDinhBaoHiem").html('<i class="fa fa-pencil"></i>Chỉnh sửa quy định đóng bảo hiểm');
        //me.strQuyDinhDongBaoHiem_Id = "";
        //var arrId = [ "dropQuyDinhLuong", "dropLoai", "dropNhom", "dropNgach", "dropLoaiPhuCap", "txtGhiChu", "divLoaiKhoanTinhBaoHiem", "divLoaiPhuCapTinhBaoHiem"];
        //edu.util.resetValByArrId(arrLOAIKHOANTINHBAOHIEM_checked);
        //edu.util.resetValByArrId(arrLOAIPHUCAPTINHBAOHIEM_checked);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_QuyDinhDongBaoHiem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_QuyDinhBaoHiem/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'strNhanSu_QuyDinhLuong_Id': "",
            'strLoaiKhoan_Id': "",
            'strDoiTuongApDung_Id': "",
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
                        me.dtQuyDinhDongBaoHiem = dtResult;
                    }
                    me.genTable_QuyDinhDongBaoHiem(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_QuyDinhBaoHiem/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_QuyDinhBaoHiem/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QuyDinhDongBaoHiem: function () {
        var me = this;
        var LoaiKhoanTinhBaoHiem_val = edu.util.getValCheckBoxByDiv("divLoaiKhoanTinhBaoHiem");//Kiểu check box
        var LoaiPhuCapTinhBaoHiem_val = edu.util.getValCheckBoxByDiv("divLoaiPhuCapTinhBaoHiem");//Kiểu check box
        //Kiểm tra loại khoản tính bảo hiểm 
        if (LoaiKhoanTinhBaoHiem_val == "") {
            edu.system.alert("Chọn 1 trong các loại khoản tính bảo hiểm");
            return;
        }//Kiểm tra loại phụ cấp tính bảo hiểm
        if (LoaiPhuCapTinhBaoHiem_val == "") {
            edu.system.alert("Chọn 1 trong các loại phụ cấp tính bảo hiểm");
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinhBaoHiem/ThemMoi',
            

            'strId': "",
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strLoaiKhoan_Id': edu.util.getValById("dropLoaiKhoan"),
            'dPhanTram': edu.util.getValById("txtPhanTram"),
            'strLoaiKhoanTinhBaoHiem_Ids': LoaiKhoanTinhBaoHiem_val,
            'strLoaiPhuCapTinhBaoHiem_Ids': LoaiPhuCapTinhBaoHiem_val,
            'strDoiTuongApDung_Id': edu.util.getValById("dropDoiTuongApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_QuyDinhDongBaoHiem();
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
    update_QuyDinhDongBaoHiem: function () {
        var me = this;
        var LoaiKhoanTinhBaoHiem_val = edu.util.getValCheckBoxByDiv("divLoaiKhoanTinhBaoHiem");//Kiểu check box
        var LoaiPhuCapTinhBaoHiem_val = edu.util.getValCheckBoxByDiv("divLoaiPhuCapTinhBaoHiem");//Kiểu check box
        //Kiểm tra loại khoản tính bảo hiểm 
        if (LoaiKhoanTinhBaoHiem_val == "") {
            edu.system.alert("Chọn 1 trong các loại khoản tính bảo hiểm");
            return;
        }//Kiểm tra loại phụ cấp tính bảo hiểm
        if (LoaiPhuCapTinhBaoHiem_val == "") {
            edu.system.alert("Chọn 1 trong các loại phụ cấp tính bảo hiểm");
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinhBaoHiem/CapNhat',
            

            'strId': me.strQuyDinhDongBaoHiem_Id,
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strLoaiKhoan_Id': edu.util.getValById("dropLoaiKhoan"),
            'dPhanTram': edu.util.getValById("txtPhanTram"),
            'strLoaiKhoanTinhBaoHiem_Ids': LoaiKhoanTinhBaoHiem_val,
            'strLoaiPhuCapTinhBaoHiem_Ids': LoaiPhuCapTinhBaoHiem_val,
            'strDoiTuongApDung_Id': edu.util.getValById("dropDoiTuongApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QuyDinhDongBaoHiem();
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
    getDetaiL_QuyDinhBaoHiem: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_QuyDinhBaoHiem/LayChiTiet',
            
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
                        me.viewForm_QuyDinhDongBaoHiem(data.Data[0]);
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
    delete_QuyDinhDongBaoHiem: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_QuyDinhBaoHiem/Xoa',
            
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
                    me.getList_QuyDinhDongBaoHiem();
                }
                else {
                    obj = {
                        content: "L_QuyDinhBaoHiem/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_QuyDinhBaoHiem/Xoa (er): " + JSON.stringify(er),
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
    genTable_QuyDinhDongBaoHiem: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyDinhDongBaoHiem_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQuyDinhDongBaoHiem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDinhDongBaoHiem.getList_QuyDinhDongBaoHiem()",
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
                        html += '<span>' + 'Quy định lương: ' + edu.util.returnEmpty(aData.NHANSU_BANGQUYDINHLUONG_TEN) + "</span><br />";
                        html += '<span>' + 'Loại khoản: ' + edu.util.returnEmpty(aData.LOAIKHOAN_TEN) + "</span><br />";
                        html += '<span>' + 'Phần trăm: ' + edu.util.returnEmpty(aData.PHANTRAM) + "</span><br />";
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
    viewForm_QuyDinhDongBaoHiem: function (data) {
        var me = this;
        //View - Thong tin
        console.log(111);
        me.rewrite();
        var dt = data[0];
        me.strQuyDinhDongBaoHiem_Id = data.ID;
        edu.util.viewValById("dropQuyDinhLuong", data.NHANSU_BANGQUYDINHLUONG_ID);
        edu.util.viewValById("dropLoaiKhoan", data.LOAIKHOAN_ID);
        edu.util.viewValById("txtPhanTram", data.PHANTRAM);
        console.log(data.LOAIKHOANTINHBAOHIEM_IDS.replace(/,/g, ",#"));
        $("#divLoaiKhoanTinhBaoHiem #" + (data.LOAIKHOANTINHBAOHIEM_IDS.replace(/,/g, ",#"))).attr("checked", true);
        $("#divLoaiKhoanTinhBaoHiem #" + (data.LOAIKHOANTINHBAOHIEM_IDS.replace(/,/g, ",#"))).prop("checked", true);


        console.log(data.LOAIPHUCAPTINHBAOHIEM_IDS.replace(/,/g, ",#"));
        $("#divLoaiPhuCapTinhBaoHiem #" + (data.LOAIPHUCAPTINHBAOHIEM_IDS.replace(/,/g, ",#"))).attr("checked", true);
        $("#divLoaiPhuCapTinhBaoHiem #" + (data.LOAIPHUCAPTINHBAOHIEM_IDS.replace(/,/g, ",#"))).prop("checked", true);

        //var arrLOAIKHOANTINHBAOHIEM_checked = data.LOAIKHOANTINHBAOHIEM_IDS;
        //if (arrLOAIKHOANTINHBAOHIEM_checked.indexOf(",") !=-1) {
        //    arrLOAIKHOANTINHBAOHIEM_checked = arrLOAIKHOANTINHBAOHIEM_checked.split(",")
        //}
        //else {
        //    arrLOAIKHOANTINHBAOHIEM_checked = { arrLOAIKHOANTINHBAOHIEM_checked };
        //}
        //for (var i = 0; i < arrLOAIKHOANTINHBAOHIEM_checked.length; i++) {
        //    $("#divLoaiKhoanTinhBaoHiem #" + arrLOAIKHOANTINHBAOHIEM_checked[i]).attr("checked", "checked");
        //}

        //var arrLOAIPHUCAPTINHBAOHIEM_checked = data.LOAIPHUCAPTINHBAOHIEM_IDS;
        //if (arrLOAIPHUCAPTINHBAOHIEM_checked.indexOf(",") != -1) {
        //    arrLOAIPHUCAPTINHBAOHIEM_checked = arrLOAIPHUCAPTINHBAOHIEM_checked.split(",")
        //}
        //else {
        //    arrLOAIPHUCAPTINHBAOHIEM_checked = { arrLOAIPHUCAPTINHBAOHIEM_checked };
        //}
        //for (var i = 0; i < arrLOAIPHUCAPTINHBAOHIEM_checked.length; i++) {
        //    $("#divLoaiPhuCapTinhBaoHiem #" + arrLOAIPHUCAPTINHBAOHIEM_checked[i]).attr("checked", "checked");
        //}
        //$("#divLoaiPhuCapTinhBaoHiem #" + data.LOAIPHUCAPTINHBAOHIEM_IDS).attr("checked", "checked");
        edu.util.viewValById("dropDoiTuongApDung", data.DOITUONG_ID);
        $("#myModalLabeL_QuyDinhBaoHiem").html('<i class="fa fa-edit"></i> Chỉnh sửa quy định đóng bảo hiểm');
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
    --Discription: [1] AcessDB GetList_BangQuyDinhLuong
    -------------------------------------------*/
    loadLoaiKhoan: function (data) {
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-sm-2">';
            row += '<input id="' + data[i].ID + '" type="checkbox" name="checkbox_LoaiPhuCapTinhBaoHiem" value="1" >';
            row += '<label for="LPCTBH_1">' + data[i].TEN + '</label>';
            row += '</div >';
        }
        $("#divLoaiPhuCapTinhBaoHiem").html(row);
        $("#divLoaiKhoanTinhBaoHiem").html(row);
    }
};