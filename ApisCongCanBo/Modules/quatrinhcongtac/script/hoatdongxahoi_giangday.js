/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function HoatDongXaHoi() { };
HoatDongXaHoi.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    arrValid_HoatDongXaHoi: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [do_table] Action Common
        -------------------------------------------*/
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href"); //activated tab
            var check = edu.util.arrEqualVal(me.tab_actived, target);
            if (!check) {
                me.tab_actived.push(target);
                switch (target) {
                    case "#tab_1": //Tieu su ban than
                        me.open_Collapse("key_hoatdongxahoi");
                        break;

                }
            }
        });
        $(".btnGetData").click(function () {
            var item = this.id;
            var check = edu.util.arrEqualVal(me.tab_item_actived, item);
            if (!check) {
                me.tab_item_actived.push(item);
                me.switch_GetData(item);
            }
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe_HDXH").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HoatDongXaHoi);
            if (valid) {
                me.save_HoatDongXaHoi();
                setTimeout(function () {
                    me.resetPopup_HoatDongXaHoi();
                }, 1000);
            }
        });
        $("#btnSave_HDXH").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HoatDongXaHoi);
            if (valid) {
                me.save_HoatDongXaHoi();
            }
        });
        $("#tbl_HDXH").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_HDXH");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_HoatDongXaHoi(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HDXH").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_HDXH");
                $("#btnYes").click(function (e) {
                    me.delete_HoatDongXaHoi(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('a[href="#tab_1"]').trigger("shown.bs.tab");
    },
    page_load: function () {
        var me = this;
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.BACDAOTAO", "dropBacHoc");
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMNN, "dropNgonNguGiangDay");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.arrValid_HoatDongXaHoi= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtHDXH", "THONGTIN1": "EM" },
            { "MA": "txtVaiTro", "THONGTIN1": "EM" },
            { "MA": "txtNamBatDau", "THONGTIN1": "EM" },
        ];
    },

    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_hoatdongxahoi":
                me.resetPopup_HoatDongXaHoi();
                me.popup_HoatDongXaHoi();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_hoatdongxahoi":
                me.getList_HoatDongXaHoi();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_HoatDongXaHoi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_QT_HoatDongXaHoi/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_HoatDongXaHoi(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_HoatDongXaHoi: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        //var strNgayKiemTra = edu.util.getValById("txtNgayKiemTra");
        //var strHomNay = edu.util.dateToday();
        //var check = edu.util.dateCompare(strNgayKiemTra, strHomNay);
        //if (check == 1) {
        //    objNotify = {
        //        content: "Ngày khám sức khỏe không được lớn hơn ngày hiện tại!",
        //        type: "w",
        //        prePos: "#myModal #notify"
        //    }
        //    edu.system.alertOnModal(objNotify);
        //    return;
        //}
        var obj_save = {
            'action': 'NS_QT_HoatDongXaHoi/ThemMoi',
            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strThongTinThamGia': edu.util.getValById("txtHDXH"),
            'strVaiTro_Khac': edu.util.getValById("txtVaiTro"),
            'strThoiGianBatDau': edu.util.getValById("txtNamBatDau"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_HoatDongXaHoi/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        //edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_HoatDongXaHoi();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HoatDongXaHoi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_QT_HoatDongXaHoi/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HoatDongXaHoi();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HoatDongXaHoi: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_QT_HoatDongXaHoi/LayChiTiet',
            
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
                        me.editForm_HoatDongXaHoi(data.Data[0]);
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

    popup_HoatDongXaHoi: function () {
        //show
        //edu.util.toggle_overide("zone-bus", "zoneHDXH_input");
        $("#zoneHDXH_input").slideDown();
        //event
        //$('#myModal_QTSK').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_HoatDongXaHoi: function () {
        var me = this;
        $("#myModalLabel_HDXH").html('<i class="fa fa-plus"></i> Thêm hoạt động xã hội');
        me.strCommon_Id = "";
        edu.util.viewValById("txtHDXH", "");
        edu.util.viewValById("txtNamBatDau", "");
        edu.util.viewValById("txtVaiTro", "");
    },
    genTable_HoatDongXaHoi: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_HDXH",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "THONGTINTHAMGIA"
                },
                {
                    "mDataProp": "THOIGIANBATDAU"
                },
                {
                    "mDataProp": "VAITRO_KHAC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_HoatDongXaHoi: function (data) {
        var me = this;
        me.popup_HoatDongXaHoi();
        //view data --Edit
        edu.util.viewValById("txtHDXH", data.THONGTINTHAMGIA);
        edu.util.viewValById("txtNamBatDau", data.THOIGIANBATDAU);
        edu.util.viewValById("txtVaiTro", data.VAITRO_KHAC);
        $("#myModalLabel_HDXH").html('<i class="fa fa-pencil"></i> Chỉnh sửa hoạt động xã hội');
    },
}