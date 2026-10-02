/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function MonHocGiangDay() { };
MonHocGiangDay.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    arrValid_MonHocGiangDay: [],

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
                        me.open_Collapse("key_monhocgiangday");
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
        $("#btnSaveRe").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MonHocGiangDay);
            if (valid) {
                me.save_MonHocGiangDay();
                setTimeout(function () {
                    me.resetPopup_MonHocGiangDay();
                }, 1000);
            }
        });
        $("#btnSave").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MonHocGiangDay);
            if (valid) {
                me.save_MonHocGiangDay();
            }
        });
        $("#tbl_MonHocGiangDay").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_MonHocGiangDay");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_MonHocGiangDay(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_MonHocGiangDay").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_MonHocGiangDay");
                $("#btnYes").click(function (e) {
                    me.delete_MonHocGiangDay(strId);
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
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.BACDAOTAO", "dropBacHoc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMNN, "dropNgonNguGiangDay");
        me.getList_CoCauToChuc();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.arrValid_MonHocGiangDay = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTenMonHoc", "THONGTIN1": "EM" },
            { "MA": "txtMaMonHoc", "THONGTIN1": "EM" },
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
            case "key_monhocgiangday":
                me.resetPopup_MonHocGiangDay();
                me.popup_MonHocGiangDay();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_monhocgiangday":
                me.getList_MonHocGiangDay();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.MonHocGiangDay;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
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
            renderPlace: ["dropDonViGiangDay"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.MonHocGiangDay;
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
    getList_MonHocGiangDay: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_QT_MonHoc/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_MonHocGiangDay(data.Data, data.Pager);
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
    save_MonHocGiangDay: function () {
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
            'action': 'NS_QT_MonHoc/ThemMoi',
            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strTenMon': edu.util.getValById("txtTenMonHoc"),
            'strMaMon': edu.util.getValById("txtMaMonHoc"),
            'dSoTC': edu.util.getValById("txtSoTinChi"),
            'strBacDaoTao_Id': edu.util.getValById("dropBacHoc"),
            'strDonViGiangDay_Id': edu.util.getValById("dropDonViGiangDay"),
            'strDonViGiangDay_Khac': edu.util.getValById("txtDonViKhac"),
            'strThoiGianBatDau': edu.util.getValById("txtNamBDGiangDay"),
            'strNgonNgu_Id': edu.util.getValById("dropNgonNguGiangDay"),
            
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_MonHoc/CapNhat';
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
                    me.getList_MonHocGiangDay();
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
    delete_MonHocGiangDay: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_QT_MonHoc/Xoa',
            
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
                    me.getList_MonHocGiangDay();
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
    getDetail_MonHocGiangDay: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_QT_MonHoc/LayChiTiet',
            
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
                        me.editForm_MonHocGiangDay(data.Data[0]);
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

    popup_MonHocGiangDay: function () {
        //edu.util.toggle_overide("zone-bus", "zoneMonHocGiangDay_input");
        $("#zoneMonHocGiangDay_input").slideDown();
    },
    resetPopup_MonHocGiangDay: function () {
        var me = this;
        $("#myModalLabel_MonHocGiangDay").html('<i class="fa fa-plus"></i> Thêm môn học đã giảng dạy');
        me.strCommon_Id = "";
        edu.util.viewValById("txtTenMonHoc", "");
        edu.util.viewValById("txtMaMonHoc", "");
        edu.util.viewValById("dropBacHoc", "");
        edu.util.viewValById("txtSoTinChi", "");
        edu.util.viewValById("dropDonViGiangDay", "");
        edu.util.viewValById("txtDonViKhac", "");
        edu.util.viewValById("txtNamBDGiangDay", "");
        edu.util.viewValById("dropNgonNguGiangDay", "");
    },
    genTable_MonHocGiangDay: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_MonHocGiangDay",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "TENMON"
                },
                {
                    "mDataProp": "BACDAOTAO_TEN"
                },
                {
                    "mDataProp": "DONVIGIANGDAY_TEN"
                },
                //{
                //    "mDataProp": "CANNANG"
                //},
                //{
                //    "mDataProp": "NHOMMAU_TEN"
                //},
                {
                    "mDataProp": "THOIGIANBATDAU"
                },
                //{
                //    "mDataProp": "NGAYTAO"
                //},
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
    editForm_MonHocGiangDay: function (data) {
        var me = this;
        me.popup_MonHocGiangDay();
        //view data --Edit
        edu.util.viewValById("txtTenMonHoc", data.TENMON);
        edu.util.viewValById("txtMaMonHoc", data.MAMON);
        edu.util.viewValById("dropBacHoc", data.BACDAOTAO_ID);
        edu.util.viewValById("txtSoTinChi", data.SOTC);
        edu.util.viewValById("dropDonViGiangDay", data.DONVIGIANGDAY_ID);
        edu.util.viewValById("txtDonViKhac", data.DONVIGIANGDAY_KHAC);
        edu.util.viewValById("txtNamBDGiangDay", data.THOIGIANBATDAU);
        edu.util.viewValById("dropNgonNguGiangDay", data.NGONNGU_ID);
        $("#myModalLabel_MonHocGiangDay").html('<i class="fa fa-pencil"></i> Chỉnh sửa môn học đã giảng dạy');
    },
}