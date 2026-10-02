/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function QuaTrinhLuong() { };
QuaTrinhLuong.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],

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
                    case "#tab_2":
                        me.open_Collapse("key_quatrinhluong");
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
        $("#btnSaveRe_QTSK").click(function () {
            me.save_QTSK();
            setTimeout(function () {
                me.resetPopup_QTSK();
            }, 1000);
        });
        $("#btnSave_QTSK").click(function () {
            me.save_QTSK();
        });
        $("#tbl_QTSK").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_QTSK");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_QTSK(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_QTSK").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_QTSK");
                $("#btnYes").click(function (e) {
                    me.delete_QTSK(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('a[href="#tab_2"]').trigger("shown.bs.tab");
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_QuaTrinhLuong();
    },
    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_quatrinhluong":
                me.resetPopup_QuaTrinhLuong();
                me.popup_QuaTrinhLuong();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_quatrinhluong":
                me.getList_QuaTrinhLuong();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_QuaTrinhLuong: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_Luong/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_QuaTrinhLuong(data.Data, data.Pager);
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
    genTable_QuaTrinhLuong: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_QuaTrinhLuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "NGACH_MA"
                },
                {
                    "mDataProp": "BAC"
                },
                {
                    "mDataProp": "HESOLUONG"
                },
                {
                    "mDataProp": "NGAYHUONG"
                },
                {
                    "mDataProp": "PHANTRAMHUONG"
                },
                {
                    "mDataProp": "LYDO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    save_QTSK: function () {
        var me = this;
        var obj_notify = {};
        var strNgayKiemTra = edu.util.getValById("txtNgayKiemTra");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayKiemTra, strHomNay);
        if (check == 1) {
            objNotify = {
                content: "Ngày khám sức khỏe không được lớn hơn ngày hiện tại!",
                type: "w",
                prePos: "#myModal #notify"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_KhamSucKhoe/ThemMoi',            

            'strId': '',
            'strNhomMau_Khac': edu.util.getValById("txtNhomMau"),
            'strNgayKiemTra': edu.util.getValById("txtNgayKiemTra"),
            'strDiaChi': edu.util.getValById("txtDiaChi"),
            'strChieuCao': edu.util.getValById("txtChieuCao"),
            'strCanNang': edu.util.getValById("txtCanNang"),
            'iThuTu': "",
            'strNhomMau_Id': "",
            'strMoTa': edu.util.getValById("txtMoTa"),
            'iTrangThai': 1,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_KhamSucKhoe/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QTSK();
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
    delete_QTSK: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_KhamSucKhoe/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
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
                    me.getList_QTSK();
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
    getDetail_QTSK: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_KhamSucKhoe/LayChiTiet',
            
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
                        me.editForm_QTSK(data.Data[0]);
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
    popup_QTSK: function () {
        edu.util.toggle_overide("zone-bus", "zoneQTSK_input");
    },
    resetPopup_QTSK: function () {
        var me = this;
        $("#myModalLabel_QTSK").html('<i class="fa fa-plus"></i> Thêm quá trình sức khỏe');
        me.strCommon_Id = "";
        edu.util.viewValById("txtNhomMau", "");
        edu.util.viewValById("txtChieuCao", "");
        edu.util.viewValById("txtCanNang", "");
        edu.util.viewValById("txtDiaChi", "");
        edu.util.viewValById("txtNgayKiemTra", "");
        edu.util.viewValById("txtThuTu", "");
        edu.util.viewValById("txtMoTa", "");
    },
    editForm_QTSK: function (data) {
        var me = this;
        me.popup_QTSK();
        edu.util.viewValById("txtNhomMau", data.NHOMMAU_KHAC);
        edu.util.viewValById("txtChieuCao", data.CHIEUCAO);
        edu.util.viewValById("txtCanNang", data.CANNANG);
        edu.util.viewValById("txtDiaChi", data.DIACHI);
        edu.util.viewValById("txtNgayKiemTra", data.NGAYKIEMTRA);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtMoTa", data.MOTA);
        $("#myModalLabel_QTSK").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình sức khỏe');
    },
}