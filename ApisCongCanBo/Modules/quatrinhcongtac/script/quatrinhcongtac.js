/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function QuaTrinhCongTac() { };
QuaTrinhCongTac.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    arrValid_QuaTrinhCongTac: [],

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
                        me.open_Collapse("key_tieusubanthan");
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
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
        $("#btnSaveRe_TSBT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhCongTac);
            if (valid) {
                me.save_TSBT();
                setTimeout(function () {
                    me.resetPopup_TSBT();
                }, 1000);
            }
        });
        $("#btnSave_TSBT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhCongTac);
            if (valid) {
                me.save_TSBT();
            }
        });
        $("#tbl_TieuSuBanThan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_TieuSuBanThan");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_TSBT(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_TieuSuBanThan").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_TieuSuBanThan");
                $("#btnYes").click(function (e) {
                    me.delete_TSBT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = main_doc.QuaTrinhCongTac;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //me.getList_CoCauToChuc();           
        setTimeout(function () {
            me.getList_CoCauToChuc();
        }, 2500);
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "drop_ChucVu");
        edu.system.loadToCombo_DanhMucDuLieu("NS.CDNN", "dropTSBT_ChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LGV0", "dropTSBT_LoaiGiangVien");
        edu.system.uploadFiles(["txt_ThongTinDinhKem"]);
        me.arrValid_QuaTrinhCongTac = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTSBT_TuNgay", "THONGTIN1": "EM" },
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
        var me = main_doc.QuaTrinhCongTac;
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
                code: "MA",
            },
            renderPlace: ["dropTSBT_DonViCongTac"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    open_Collapse:function(strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey +'"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_tieusubanthan":
                me.resetPopup_TSBT();
                me.popup_TSBT();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_tieusubanthan":
                me.getList_TSBT();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] TieuSuBanThan
    -------------------------------------------*/
    getList_TSBT: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TSBT(data.Data, data.Pager);
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
    save_TSBT: function ()    {
        var me = this;
        var obj_notify = {};
        var strTuNgay = edu.util.getValById("txtTSBT_TuNgay");
        var strDenNgay = edu.util.getValById("txtTSBT_DenNgay");
        var check = edu.util.dateCompare(strTuNgay, strDenNgay);
        if (check == 1) {
            edu.system.alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/ThemMoi',            

            'strId'                 : '',
            'strMoTa'               : edu.util.getValById("txtTSBT_MoTa"),
            'strTuNgay'             : edu.util.getValById("txtTSBT_TuNgay"),
            'strDenNgay': edu.util.getValById("txtTSBT_DenNgay"),
            'strDonViCongTac_Id': edu.util.getValById("dropTSBT_DonViCongTac"),
            'strChucDanhNgheNghiep_Id': edu.util.getValById("dropTSBT_ChucDanh"),
            'strChucVu_Id': edu.util.getValById("drop_ChucVu"),
            'strLoaiGiangVien_Id': edu.util.getValById('dropTSBT_LoaiGiangVien'),
            'iTrangThai'            : 1,
            'iThuTu'                : 1,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_TieuSuBanThan_TruocTD/CapNhat';
            obj_save.strId  = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TSTT");
                        edu.system.saveFiles("txt_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txt_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    me.getList_TSBT();
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
    delete_TSBT: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/Xoa',
            
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
                    me.getList_TSBT();
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
    getDetail_TSBT: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/LayChiTiet',
            
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
                        me.editForm_TSBT(data.Data[0]);
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
    popup_TSBT: function () {
        $("#zoneTSBT_input").slideDown();
    },
    resetPopup_TSBT: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtTSBT_TuNgay");
        edu.util.resetValById("txtTSBT_DenNgay");
        edu.util.resetValById("txtTSBT_MoTa");
        edu.util.resetValById("dropTSBT_DonViCongTac");
        edu.util.resetValById("dropTSBT_ChucDanh");
        edu.util.resetValById("dropTSBT_LoaiGiangVien");
        edu.util.resetValById("drop_ChucVu");
        edu.system.viewFiles("txt_ThongTinDinhKem", "");
    },
    genTable_TSBT: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_TieuSuBanThan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhCongTac.getList_TSBT()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNGAY"
                }
                , {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "DONVICONGTAC_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                //{
                //    "mDataProp": "LOAIGIANGVIEN_TEN"
                //},
                {
                    "mDataProp": "CHUCDANHNGHENGHIEP_TEN"
                },
                {
                    "mDataProp": "CHUCVU_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="edit' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_TSBT: function (data) {
        var me = this;
        me.popup_TSBT();
        edu.util.viewValById("txtTSBT_TuNgay", data.TUNGAY);
        edu.util.viewValById("txtTSBT_DenNgay", data.DENNGAY);
        edu.util.viewValById("dropTSBT_DonViCongTac", data.DONVICONGTAC_ID);
        edu.util.viewValById("dropTSBT_ChucDanh", data.LOAICHUCDANHNGHENGHIEP_ID);
        edu.util.viewValById("drop_ChucVu", data.CHUCVU_ID);
        edu.util.viewValById("txtTSBT_MoTa", data.MOTA);
        edu.system.viewFiles("txt_ThongTinDinhKem", data.ID, "NS_Files");
        $("#myModalLabel_QuaTrinhCongTac").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình công tác');
    },
}