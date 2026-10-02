/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function QuaTrinhChucVu() { };
QuaTrinhChucVu.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    strChucVu_Id: [],
    arrValid_QuaTrinhChucVu: [],

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
                    case "#tab_2": //Tieu su ban than
                        me.open_Collapse("key_quatrinhchucvu");
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
        $('a[href="#tab_2"]').trigger("shown.bs.tab");

        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnReWrite_ChucVu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhChucVu);
            if (valid) {
                me.save_ChucVu();
                setTimeout(function () {
                    me.resetPopup_ChucVu();
                }, 1000);
            }
        });
        $("#btnSave_ChucVu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhChucVu);
            if (valid) {
                me.save_ChucVu();
            }
        });
        $("#tbl_ChucVu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_ChucVu");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_ChucVu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_ChucVu").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_ChucVu");
                $("#btnYes").click(function (e) {
                    me.delete_ChucVu(strId);
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
        edu.util.toggle("box-sub-search");
        edu.system.page_load();
        me.getList_CoCauToChuc();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMCV, "dropChucVuMoi,dropChucVuCu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.CHUCDANHNGHENGHIEP", "dropTSBT_ChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "dropTSBT_ChucVu");
        edu.system.uploadFiles(["txtThongTinDinhKem"]);
        me.arrValid_QuaTrinhChucVu = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtSoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "dropChucVu", "THONGTIN1": "EM" },
            { "MA": "txtNgayBatDau", "THONGTIN1": "EM" },
            { "MA": "txtNgayKy", "THONGTIN1": "EM" },
            { "MA": "txtNgayHieuLuc", "THONGTIN1": "EM" },
        ]
    },
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    }, /*------------------------------------------
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.QuaTrinhChucVu;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }
        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genComBo_CCTC(data);
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_CCTC"],
            type: "",
            title: "Chọn Khoa/Viện/Phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropNS_CoCauToChuc", "dropDonViCu", "dropDonViMoi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_quatrinhchucvu":
                me.resetPopup_ChucVu();
                me.popup_ChucVu();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_quatrinhchucvu":
                me.getList_ChucVu();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_ChucVu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ChucVu/LayDanhSach',

            'iTrangThai': 1,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_ChucVu(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
    save_ChucVu: function () {
        var me = this;
        var obj_notify = {};
        // kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
        var strNgayBatDau = edu.util.getValById("txtNgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtNgayKetThuc");
        var check = edu.util.dateCompare(strNgayBatDau, strNgayKetThuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_ChucVu/ThemMoi',

            'strId': '',
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropQuyetDinh"),
            'strNgayHieuLuc': edu.util.getValById("txtNgayBatDau"),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strChucVu_Id': edu.util.getValById("dropChucVuMoi"),
            'strChucVu_Cu_Id': edu.util.getValById("dropChucVuCu"),
            'dHeSo': edu.util.getValById("txtHeSo"),
            'strNgayBatDauApDung': edu.util.getValById("txtNgayBatDau"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("txtQuyetDinh_ID"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropDonViMoi'),
            'strDaoTao_CoCauToChuc_Cu_Id': edu.util.getValById('dropDonViCu'),
            'strThongTinDinhKem': "",
            'strNgayKetThucNhiemKy': edu.util.getValById("txtNgayKetThucNhiemKy"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ChucVu/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_CHUVU");
                        edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files");
                    }
                    me.getList_ChucVu();
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
    delete_ChucVu: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_ChucVu/Xoa',

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
                    me.getList_ChucVu();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + JSON.stringify(data.Message),
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
    getDetail_ChucVu: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ChucVu/LayChiTiet',

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
                        me.viewForm_ChucVu(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + JSON.stringify(data.Message), "w");
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

    popup_ChucVu: function () {
        $("#zone_input_ChucVu").slideDown();
    },
    resetPopup_ChucVu: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtQuyetDinh_ID");
        edu.util.resetValById("dropQuyetDinh");
        edu.util.resetValById("dropChucVuCu");
        edu.util.resetValById("dropChucVuMoi");
        edu.util.resetValById("txtSoQuyetDinh");
        edu.util.resetValById("txtNgayQuyetDinh");
        edu.util.resetValById("txtNgayBatDau");
        edu.util.resetValById("txtNgayKetThucNhiemKy");
        edu.util.resetValById("dropDonViCu");
        edu.util.resetValById("dropDonViMoi");
        edu.util.resetValById("txtHeSo");
        edu.util.resetValById("txtGhiChu");
        edu.system.viewFiles("txtThongTinDinhKem", "");
    },
    genTable_ChucVu: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_ChucVu",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "CHUCVU_TEN"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "HESO"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_SOQD"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYQD"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYAD"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYHHL"
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
    viewForm_ChucVu: function (data) {
        var me = this;
        me.popup_ChucVu();
        edu.util.viewValById("txtQuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("dropQuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("dropChucVuCu", data.CHUCVU_CU_ID);
        edu.util.viewValById("dropChucVuMoi", data.CHUCVU_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtNgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtNgayBatDau", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtNgayKetThucNhiemKy", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.util.viewValById("txtHeSo", data.HESO);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        edu.util.viewValById("dropDonViCu", data.DAOTAO_COCAUTOCHUC_CU_ID);
        edu.util.viewValById("dropDonViMoi", data.DAOTAO_COCAUTOCHUC_ID);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
        $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình chức vụ');
    },
}