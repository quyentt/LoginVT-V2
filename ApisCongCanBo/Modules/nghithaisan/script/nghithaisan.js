/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function NghiThaiSan() { };
NghiThaiSan.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    strNghiThaiSan_Id: [],

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
                    case "#tab_1": //NGHITHAISAN
                        me.open_Collapse("key_nghithaisan");
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
        $('a[href="#tab_1"]').trigger("shown.bs.tab");
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnReWrite_NghiThaiSan").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_NghiThaiSan);
            if (valid) {
                me.save_NghiThaiSan();
                setTimeout(function () {
                    me.resetPopup_NghiThaiSan();
                }, 1000);
            }
        });
        $("#btnSave_NghiThaiSan").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_NghiThaiSan);
            if (valid) {
                me.save_NghiThaiSan();
            }
        });
        $("#tbl_NghiThaiSan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_NghiThaiSan");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_NghiThaiSan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_NghiThaiSan").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_NghiThaiSan");
                $("#btnYes").click(function (e) {
                    me.delete_NghiThaiSan(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.toggle_form();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh");
        edu.system.uploadFiles(["txt_ThongTinDinhKem"]);
        me.arrValid_NghiThaiSan = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtNgayKy", "THONGTIN1": "EM" },
            { "MA": "txtSoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtNgayKetThuc", "THONGTIN1": "EM" },
            { "MA": "txtNgayBatDau", "THONGTIN1": "EM" },
        ]
    },
    toggle_form: function () {
        edu.util.toggle_overide("zonecontent", "zone_main");
    },
    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_nghithaisan":
                me.resetPopup_NghiThaiSan();
                me.popup_NghiThaiSan();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_nghithaisan":
                me.getList_NghiThaiSan();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_NghiThaiSan: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ThaiSan/LayDanhSach',

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_NghiThaiSan(data.Data, data.Pager);
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
    save_NghiThaiSan: function () {
        var me = this;
        var obj_notify = {};
        var strThoiGianBatDauNghi = edu.util.getValById("txtNgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtNgayKetThuc");
        var check = edu.util.dateCompare(strThoiGianBatDauNghi, strNgayKetThuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_ThaiSan/ThemMoi',

            'strId': '',
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropQuyetDinh"),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strNgayKetThuc': edu.util.getValById("txtNgayHetHieuLuc"),
            'strNgayHieuLuc': edu.util.getValById("txtNgayHieuLuc"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNgayKyQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strThoiGianBatDauNghi': edu.util.getValById("txtNgayHieuLuc"),
            'strThongTinDinhKem': edu.util.getValById("txt_ThongTinDinhKem"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("txtQuyetDinh_ID"),
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ThaiSan/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.system.saveFiles("txt_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txt_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    me.getList_NghiThaiSan();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",

            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NghiThaiSan: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_ThaiSan/Xoa',

            'strIds': Ids,
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
                    me.getList_NghiThaiSan();
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
    getDetail_NghiThaiSan: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ThaiSan/LayChiTiet',

            'strId': strId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_NghiThaiSan(data.Data[0]);
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

    popup_NghiThaiSan: function () {
        $("#zone_input_NghiThaiSan").slideDown();
    },
    resetPopup_NghiThaiSan: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropQuyetDinh");
        edu.util.resetValById("txtSoQuyetDinh");
        edu.util.resetValById("txtNgayQuyetDinh");
        edu.util.resetValById("txtNgayHetHieuLuc");
        edu.util.resetValById("txtNgayBatDau");
        edu.util.resetValById("txtNgayHieuLuc");
        edu.util.resetValById("txtNgayApDung");
        edu.util.resetValById("txtNgayKy");
        edu.util.resetValById("txtQuyetDinh_ID");
        edu.system.viewFiles("txt_ThongTinDinhKem", "");
    },
    genTable_NghiThaiSan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_NghiThaiSan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYKYQUYETDINH"
                },
                {
                    "mDataProp": "THOIGIANBATDAUNGHI"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_NghiThaiSan: function (data) {
        var me = this;
        me.popup_NghiThaiSan();
        edu.util.viewValById("dropQuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtNgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtNgayKy", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtNgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtNgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtNgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.util.viewValById("txtQuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.system.viewFiles("txt_ThongTinDinhKem", data.ID, "NS_Files");       
    },
}