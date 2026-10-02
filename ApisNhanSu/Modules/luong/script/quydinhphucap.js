/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 06/09/2019
----------------------------------------------*/
function QuyDinhPhuCap() { }
QuyDinhPhuCap.prototype = {
    dtQuyDinhPhuCap: [],
    dtTab: '',
    strQuyDinhPhuCap_Id: '',
    arrValid_QuyDinhPhuCap: [],

    init: function () {
        var me = main_doc.QuyDinhPhuCap;
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
            if (edu.util.checkValue(me.strQuyDinhPhuCap_Id)) {
                me.update_QuyDinhPhuCap();
            }
            else {
                me.save_QuyDinhPhuCap();
            }
            me.update_QuyDinhPhuCap();
            //me.rewrite();
            setTimeout(function () {
                me.rewrite();
            }, 1000);
        });
        $("#btnSearch").click(function () {
            me.getList_QuyDinhPhuCap();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuyDinhPhuCap();
            }
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_QuyDinhPhuCap").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuyDinhPhuCap);
            if (valid) {
                if (edu.util.checkValue(me.strQuyDinhPhuCap_Id)) {
                    me.update_QuyDinhPhuCap();
                }
                else {
                    me.save_QuyDinhPhuCap();
                }
            }
        });
        $("#tblQuyDinhPhuCap").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strQuyDinhPhuCap_Id = strId;
                me.getDetail_QuyDinhPhuCap(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblGT");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuyDinhPhuCap").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_QuyDinhPhuCap(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_tblQuyDinhPhuCap();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_tblQuyDinhPhuCap();
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
        me.getList_QuyDinhPhuCap();
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        //setTimeout(function () {
        //    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropSearch_DonViThanhVien_TTS");
        //}, 50);
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_QuyDinhPhuCap = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtThoiHanNhanPhuCap", "THONGTIN1": "EM" },
            { "MA": "dropQuyDinhLuong", "THONGTIN1": "EM" },
            { "MA": "dropLoai", "THONGTIN1": "EM" },
            { "MA": "dropNhom", "THONGTIN1": "EM" },
            { "MA": "dropLoaiPhuCap", "THONGTIN1": "EM" },
        ];
        me.getList_QuyDinhLuong();
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.LOAICONGCHUC", "dropLoai");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NHOMNGACH", "dropNhom");

        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NGACH", "", "", me.genCombo_Ngach);
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.LOAIPHUCAP", "dropLoaiPhuCap");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_QuyDinhPhuCap");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QuyDinhPhuCap");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QuyDinhPhuCap");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        $("#myModalLabel_QuyDinhPhuCap").html('<i class="fa fa-pencil"></i> Kê khai quy định phụ cấp');
        me.strQuyDinhPhuCap_Id = "";
        var arrId = ["txtThoiHanNhanPhuCap", "dropQuyDinhLuong", "dropLoai", "dropNhom", "dropNgach", "dropLoaiPhuCap", "txtGhiChu"];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_QuyDinhPhuCap: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_QuyDinhHuongPhuCap/LayDanhSach',
            

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
                        me.strQuyDinhPhuCap_Id = dtResult;
                    }
                    me.genTable_QuyDinhPhuCap(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_QuyDinhHuongPhuCap/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_QuyDinhHuongPhuCap/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QuyDinhPhuCap: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinhHuongPhuCap/ThemMoi',
            

            'strId': "",
            'dThoiHanNhanPhuCap': edu.util.getValById("txtThoiHanNhanPhuCap"),
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strLoai_Id': edu.util.getValById("dropLoai"),
            'strNhom_Id': edu.util.getValById("dropNhom"),
            'strNgach_Id': edu.util.getValById("dropNgach"),
            'strLoaiPhuCap_Id': edu.util.getValById("dropLoaiPhuCap"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_QuyDinhPhuCap();
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
    update_QuyDinhPhuCap: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'L_QuyDinhHuongPhuCap/CapNhat',
            

            'strId': me.strQuyDinhPhuCap_Id,
            'dThoiHanNhanPhuCap': edu.util.getValById("txtThoiHanNhanPhuCap"),
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropQuyDinhLuong"),
            'strLoai_Id': edu.util.getValById("dropLoai"),
            'strNhom_Id': edu.util.getValById("dropNhom"),
            'strNgach_Id': edu.util.getValById("dropNgach"),
            'strLoaiPhuCap_Id': edu.util.getValById("dropLoaiPhuCap"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_QuyDinhPhuCap();
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
    getDetail_QuyDinhPhuCap: function (strId, strAction) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_QuyDinhHuongPhuCap/LayChiTiet',
            
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
                        me.viewForm_QuyDinhPhuCap(data.Data[0]);
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
    delete_QuyDinhPhuCap: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_QuyDinhHuongPhuCap/Xoa',
            
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
                    me.getList_QuyDinhPhuCap();
                }
                else {
                    obj = {
                        content: "L_QuyDinhHuongPhuCap/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "L_QuyDinhHuongPhuCap/Xoa (er): " + JSON.stringify(er),
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
    genTable_QuyDinhPhuCap: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyDinhPhuCap_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQuyDinhPhuCap",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDinhPhuCap.getList_QuyDinhPhuCap()",
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
                        html += '<span>' + 'Ngạch hưởng phụ cấp: ' + edu.util.returnEmpty(aData.LOAI_TEN) + "</span><br />";
                        html += '<span>' + 'Loại phụ cấp: ' + edu.util.returnEmpty(aData.LOAIPHUCAP_TEN) +  "</span><br />";
                        html += '<span>' + 'Thời hạn nhận phụ cấp: ' + edu.util.returnEmpty(aData.THOIHANNHANPHUCAP) + "</span><br />";
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
    viewForm_QuyDinhPhuCap: function (data) {
        var me = this;
        //View - Thong tin
        var dt = data[0];
        edu.util.viewValById("txtThoiHanNhanPhuCap", data.THOIHANNHANPHUCAP);
        edu.util.viewValById("dropQuyDinhLuong", data.NHANSU_BANGQUYDINHLUONG_ID);
        edu.util.viewValById("dropLoai", data.LOAI_ID);
        edu.util.viewValById("dropNhom", data.NHOM_ID);
        edu.util.viewValById("dropNgach", data.NGACH_ID);
        edu.util.viewValById("dropLoaiPhuCap", data.LOAIPHUCAP_ID);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        $("#myModalLabel_QuyDinhPhuCap").html('<i class="fa fa-edit"></i> Chỉnh sửa quy định hưởng phụ cấp');
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