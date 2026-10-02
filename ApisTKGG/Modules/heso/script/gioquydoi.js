/*----------------------------------------------
--Author: nnthuong
--Phone:
--Date of created: 19/01/2019
----------------------------------------------*/
function GioQuyDoi() { };
GioQuyDoi.prototype = {
    Id: '',
    arrValid_GioQuyDoi: [],
    dtGioQuyDoi: '',

    str_YTCT_HeSo_val: '',
    str_selected_LoaiYTCT: '',
    str_YTCT_Id: '',
    arr_inserted_YTCT_Id: [],
    arr_inserted_LoaiYTCT: [],
    arr_inserted_LoaiYTCT_Parent: [],
    dtYTTT_byHoatDong: '',

    init: function () {
        var me = main_doc.GioQuyDoi;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: [0] GioQuyDoi
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        $('#btnAddnew_GioQuyDoi').click(function () {
            me.toggle_input();
        });
        $("#btnRefresh_GioQuyDoi").click(function () {
            me.getList_GioQuyDoi();
        });

        $("#btnSave_GioQuyDoi").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_GioQuyDoi);
            if (valid) {
                me.save_GioQuyDoi();
            }
        });
        $("#tblGioQuyDoi").delegate(".btnEdit", "click", function () {
            var id = this.id;
            var hoatdong_id = $(this).attr('idhoatdong');
            var idthoigian = $(this).attr('idthoigian');
            //me.resetchkSelect();
            me.Id = id;
            if (id != "") {
                $("#myModalLabel").html("Cập nhật giờ quy đổi hoạt động");
                document.getElementById("btnSave_GQD").innerHTML = '<i class="fa fa-edit"></i> Cập nhật';
                setTimeout(function () {
                    me.getDetail_GioQuyDoi(id);
                    setTimeout(function () {
                        me.getList_YeuToTangThem(hoatdong_id, idthoigian);
                    }, 50);
                }, 50);
            }
        });
        $("#tblGioQuyDoi").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            edu.util.setOne_BgRow(strId, "tblGioQuyDoi");
            $("#btnYes").click(function (e) {
                me.delete_GioQuyDoi(strId);
            });
            return false;
        });

        /*------------------------------------------
        --Author: nnThuong
        --Discription: Action select checked box to get id
        ------------------------------------------*/
        $(document).delegate('.chkSelectAll_HSDieuChinh', 'click', function () {
            console.log("me.arr_inserted_LoaiYTCT: " + me.arr_inserted_LoaiYTCT);
            console.log("me.arr_inserted_YTCT_Id: " + me.arr_inserted_YTCT_Id);
            var parent_id = this.id.replace(/chkSelectBox_/g, "");
            var checked_status = $(this).is(':checked');
            if (parent_id != "") {
                var zoneCheck = '.zoneChild_' + parent_id;
                var listCheck = $(zoneCheck);
                listCheck.find('input:checkbox').each(function () {
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                });
            }
            /*processing*/
            var ytct_id = "";
            var child_id = "";
            var checked_id = "";
            var heso_id = "";
            var heso_value = "";
            $('[id$=hesodieuchinh]').find(":checkbox[id^='chkSelectBoxChild']:checked").each(function () {
                child_id = this.id.replace(/chkSelectBoxChild_/g, "");
                checked_id += child_id + ',';
                heso_id = "#txtHeSo_" + child_id;
                heso_value += $(heso_id).html() + ',';
                ytct_id += "" + ',';
            });
            /*get ids that checked by user::get heso value for each id that checked*/
            checked_id = checked_id.substr(0, checked_id.lastIndexOf(","));
            heso_value = heso_value.substr(0, heso_value.lastIndexOf(","));
            me.str_YTCT_HeSo_val = heso_value;
            me.str_selected_LoaiYTCT = checked_id;
            me.str_YTCT_Id = ytct_id;
            // process deleting, adding for YTCT
            var arr_selected_LoaiYTCT_Id = [];
            arr_selected_LoaiYTCT_Id = me.str_selected_LoaiYTCT.split(",");
            if (arr_selected_LoaiYTCT_Id.length > 0) {
                me.check_befor_delete(me.arr_inserted_LoaiYTCT, arr_selected_LoaiYTCT_Id);
            }
            me.check_befor_save();//chua dung
            //log
            console.log("me.str_YTCT_HeSo_val: " + me.str_YTCT_HeSo_val);
            console.log("me.str_selected_LoaiYTCT: " + me.str_selected_LoaiYTCT);
            console.log("me.str_YTCT_Id: " + me.str_YTCT_Id);
            console.log("arr_selected_LoaiYTCT_Id: " + arr_selected_LoaiYTCT_Id);
        });
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_GQD");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_GQD");
    },
    /*------------------------------------------
    --Discription: [0] Common GioQuyDoi
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_list();
        //
        me.arrValid_GioQuyDoi = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtGioQuyDoi_Ten", "THONGTIN1": "EM" },
            { "MA": "txtGioQuyDoi_Ma", "THONGTIN1": "EM" },
            { "MA": "dropGioQuyDoi_Nhom", "THONGTIN1": "EM" }
        ];
        setTimeout(function () {
            me.getList_HeSoDieuChinh();
            setTimeout(function () {
                me.getList_GioQuyDoi();
                setTimeout(function () {
                    me.getList_ThoiGian();
                }, 150);
            }, 150);
        }, 150);
    },
    resetGioQuyDoi: function () {
        var me = main_doc.GioQuyDoi;
        $("#txtMa").val("");
        $("#txtTen").val("");
        $("#txtQuyDoiGioChuan").val("");
        $("#DropThoiGian").val($("#DropThoiGianTimKiem").val()).trigger("change");
        $("#DropPhanLoaiHoatDong").val("").trigger("change");
        me.Id = "";
        me.str_YTCT_HeSo_val = "";
        me.str_selected_LoaiYTCT = "";
        me.str_YTCT_Id = "";
        me.dtYTTT_byHoatDong = "";
        me.arr_inserted_YTCT_Id = [];
        me.arr_inserted_LoaiYTCT = [];
        me.arr_inserted_LoaiYTCT_Parent = [];
    },
    /*------------------------------------------
    --Discription: [0] AcessDB DuLieuDanhMuc
    -------------------------------------------*/
    getList_HeSoDieuChinh: function () {
        var me = main_doc.GioQuyDoi;
       var obj = {
           strMaBangDanhMuc: "TKGG.YTCT",
            strTenCotSapXep:"",
            iTrangThai:1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genHTML_HeSoDieuChinh);
    },
    genHTML_HeSoDieuChinh: function (data) {
        var me = main_doc.GioQuyDoi;
        var zoneGen = "#hesodieuchinh";
        $(zoneGen).html("");
        me.arr_inserted_LoaiYTCT = [];
        me.arr_inserted_LoaiYTCT_Parent = [];
        me.arr_inserted_YTCT_Id = [];
        var parent_id = "";
        var data_html = "";
        var str_LoaiYTCT_Id = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].QUANHECHA_ID == "" || data[i].QUANHECHA_ID == null) {
                parent_id = data[i].ID;
                data_html += '<div style="width:25%; float:left;">';
                data_html += '<input type="checkbox" id="chkSelectBox_' + parent_id + '" class="check-modal chkSelectAll_HSDieuChinh"/>';
                data_html += '<label for="chkSelectBox_' + parent_id + '"></label> ' + data[i].TEN;
                data_html += '</div>';
                data_html += '<div style="width:75%; float:left;" class="zoneChild_' + parent_id + '">';
                for (var j = 0; j < data.length; j++) {
                    if (data[j].QUANHECHA_ID == parent_id) {
                        str_LoaiYTCT_Id = data[j].ID;
                        me.check_inserted_YTCT_byHoatDong(str_LoaiYTCT_Id);
                        data_html += ' <input type="checkbox" id="chkSelectBoxChild_' + data[j].ID + '" class="check-modal"/>';
                        data_html += '<label for="chkSelectBoxChild_' + data[j].ID + '"></label> ' + data[j].TEN;
                        data_html += '( <span id="txtHeSo_' + data[j].ID + '">' + data[j].HESO1 + '</span> )';
                    }
                }
                data_html += '</div><div class="clear"></div>';
            }
            $(zoneGen).append(data_html);
            data_html = "";
            parent_id = "";
        }
        me.display_inserted_YTCT_onCheck();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GioQuyDoi
    -------------------------------------------*/
    getList_GioQuyDoi: function () {
        var me = main_doc.GioQuyDoi;

        //--Edit
        var obj_list = {
            'action': 'TKGG_GioQuyDoi/LayDanhSach',
            

            'strKLGD_DONVITINH_Id': "",
            'strDAOTAO_HEDAOTAO_Id': "",
            'strKLGD_HOATDONG_Id': "",
            'strKLGD_THOIGIAN_Id': "",
            'dTuKhoaNumber': -1,
            'strTuKhoaText': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_GioQuyDoi(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    save_GioQuyDoi: function () {
        var me = main_doc.GioQuyDoi;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TKGG_GioQuyDoi/ThemMoi',
            

            'strId': '',
            'strTen': edu.util.getValById("txtGioQuyDoi_Ten"),
            'strMa': edu.util.getValById("txtGioQuyDoi_Ma"),
            'iThuTu': edu.util.getValById("txtGioQuyDoi_ThuTu"),
            'strNhomCacGioQuyDoi_Id': edu.util.getValById("dropGioQuyDoi_Nhom"),
            'strMoTa': edu.util.getValById("txtGioQuyDoi_MoTa"),
            'dThutuUuTienGachNo': -1,
            'dTinhPhiTuDong': -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.hoatdong_id != "") {
            obj_save.action = 'TKGG_GioQuyDoi/CapNhat';
            obj_save.strId = me.hoatdong_id;
        }
        //default
        
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
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_GioQuyDoi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
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
    getDetail_GioQuyDoi: function (strId) {
        var me = main_doc.GioQuyDoi;
        //view data --Edit
        var obj_detail = {
            'action': 'TKGG_GioQuyDoi/LayChiTiet',
            
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
                        me.viewForm_GioQuyDoi(data.Data[0]);
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
    delete_GioQuyDoi: function (Ids) {
        var me = main_doc.GioQuyDoi;
        //--Edit
        var obj_delete = {
            'action': 'TKGG_GioQuyDoi/Xoa',
            
            'strIds': Ids,
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
                    me.getList_GioQuyDoi();
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
    /*------------------------------------------
	--Discription: [1]  GenHTML GioQuyDoi
    --Author: nnthuong
	-------------------------------------------*/
    genTable_GioQuyDoi: function (data, iPager) {
        var me = main_doc.GioQuyDoi;
        var jsonForm = {
            strTable_Id: "tblGioQuyDoi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GioQuyDoi.getList_GioQuyDoi()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 6, 7],
                right: [2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_HOATDONG_TEN"
                }
                , {
                    "mDataProp": "QUYDOIGIOCHUAN"
                }
                , {
                    "mDataProp": "KLGD_DONVITINH_TEN"
                }
                , {
                    "mDataProp": "SOGIOCHUAN"
                }
                , {
                    "mDataProp": "MOTA"
                }
                , {
                    "mDataProp": "KLGD_THOIGIAN_NAMHOC"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" idhoatdong="' + aData.KLGD_HOATDONG_ID + '" idthoigian="' + aData.KLGD_THOIGIAN_ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    viewForm_GioQuyDoi: function (data) {
        var me = main_doc.GioQuyDoi;
        me.toggle_input();  
        $("#dropGQD_LoaiHoatDong").val(data.KLGD_HOATDONG_ID).trigger("change");
        $("#txtGQD_Ma").val(data.MA);
        $("#txtGQD_Ten").val(data.TEN);
        $("#dropGQD_ThoiGian").val(data.KLGD_THOIGIAN_ID).trigger("change");
        $("#dropGQD_HeDaoTao").val(data.DAOTAO_HEDAOTAO_ID).trigger("change");
        $("#txtGQD_GioQuyDoi").val(data.QUYDOIGIOCHUAN);
        $("#dropGQD_DonViTinh").val(data.KLGD_DONVITINH_ID).trigger("change");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB Yeu to tang them
    -------------------------------------------*/
    getList_YeuToTangThem: function (strHoatDong_Id, strThoiGian_Id) {
        var me = this;
        var me = main_doc.GioQuyDoi;
        //view data --Edit
        var obj_detail = {
            'action': 'TKGG_GioQuyDoi/LayYeuToTangThemTheo',
            
            'strKLGD_HoatDong_Id': strHoatDong_Id,
            'strKLGD_ThoiGian_Id': strThoiGian_Id
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var jsonResult = $.parseJSON(mystring);
                    me.dtYTTT_byHoatDong = jsonResult;
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_YeuToTangThem: function (notify) {
        var me = this;
        var strHoatDong_Id = "";
        var strThoiGian_Id = "";
        var strLoaiYeuToCongThem_Id = 0;
        var strDaoTao_HeDaoTao_Id = 1;
        var strMa = "";
        var strTen = "";
        var dHeSo = "";
        var ParamTrangThai = 1;
        var strCanBoThucHien_Id = "";
        var strId = "";

        strHoatDong_Id = $("#DropPhanLoaiHoatDong").val();
        strThoiGian_Id = $("#DropThoiGian").val();
        strLoaiYeuToCongThem_Id = me.str_selected_LoaiYTCT;
        strDaoTao_HeDaoTao_Id = $("#DropHeDaoTao").val();
        strMa = $("#txtMa").val();
        strTen = $("#txtTen").val();
        dHeSo = me.str_YTCT_HeSo_val;
        strId = me.str_YTCT_Id;
        strCanBoThucHien_Id = edu.app.userId;

        edu.app.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (notify == "add") {
                        edu.app.alertOnModal("Thông báo", "Thêm mới thành công!", "alert-success", "#notify");
                    }
                    else if (notify == "update") {
                        edu.app.alertOnModal("Thông báo", "Cập nhật thành công!", "alert-info", "#notify");
                    }
                    //clear variable
                    me.str_selected_LoaiYTCT = "";
                    me.str_YTCT_HeSo_val = "";
                    me.str_YTCT_Id = "";
                    //me.getList_YeuToTangThem();
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'ChiTietYeuToCongThem/ThemMoi',
            data: {
                'strHoatDong_Id': strHoatDong_Id,
                'strThoiGian_Id': strThoiGian_Id,
                'strLoaiYeuToCongThem_Id': strLoaiYeuToCongThem_Id,
                'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
                'strMa': strMa,
                'strTen': strTen,
                'dHeSo': dHeSo,
                'ParamTrangThai': ParamTrangThai,
                'strCanBoThucHien_Id': strCanBoThucHien_Id,
                'strId': strId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_YeuToCongThem: function (ids) {
        var me = this;
        var strCanBoThucHien_Id = edu.app.userId;

        edu.app.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_GioQuyDoi();
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'GET',
            action: 'ChiTietYeuToCongThem/Xoa',
            data: {
                'Ids': ids,
                'strCanBoThucHien_Id': strCanBoThucHien_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //
    check_inserted_YTCT_byHoatDong: function (str_LoaiYTCT_Id) {
        var me = this;
        if (me.dtYTTT_byHoatDong.length > 0) {
            for (var i = 0; i < me.dtYTTT_byHoatDong.length; i++) {
                if (str_LoaiYTCT_Id == me.dtYTTT_byHoatDong[i].KLGD_LOAIYEUTOCONGTHEM_ID) {
                    me.arr_inserted_LoaiYTCT.push(str_LoaiYTCT_Id);
                    me.arr_inserted_LoaiYTCT_Parent.push(me.dtYTTT_byHoatDong[i].KLGD_LOAIYEUTOCONGTHEM_ID_CHA);
                    me.arr_inserted_YTCT_Id.push(me.dtYTTT_byHoatDong[i].ID);
                }
            }
        }

    },
    display_inserted_YTCT_onCheck: function () {
        var me = this;
        var checked_id = "";
        //fill
        for (var i = 0; i < me.arr_inserted_LoaiYTCT.length; i++) {
            checked_id = '#chkSelectBoxChild_' + me.arr_inserted_LoaiYTCT[i];
            $(checked_id).attr('checked', 'checked');
            $(checked_id).prop('checked', 'checked');
        }
        //fill parent
        for (var j = 0; j < me.arr_inserted_LoaiYTCT_Parent.length; j++) {
            checked_id = '#chkSelectBox_' + me.arr_inserted_LoaiYTCT_Parent[j];
            $(checked_id).attr('checked', 'checked');
            $(checked_id).prop('checked', 'checked');
        }
    },
    check_befor_save: function () {

    },
    check_befor_delete: function (arr_inserted_LoaiYTCT, arr_selected_LoaiYTCT_Id) {
        var me = this;
        var count = 0;
        var checkDelete = false;
        var flag = true;
        var str_delete = "";

        for (var i = 0; i < arr_inserted_LoaiYTCT.length; i++) {
            for (var j = 0; j < arr_selected_LoaiYTCT_Id.length; j++) {
                if (arr_inserted_LoaiYTCT[i] == arr_selected_LoaiYTCT_Id[j]) {
                    flag = false;
                }
                else {
                    checkDelete = true;
                }
            }
            if (flag == false) {
                flag = true;
            }
            else {
                if (checkDelete == true) {
                    count++;
                    str_delete += me.arr_inserted_YTCT_Id[i] + ",";
                    checkDelete = false;
                }
            }
        }
        if (count > 0) {
            str_delete = str_delete.substr(0, str_delete.lastIndexOf(","));
            console.log("str_delete: " + str_delete);
            me.delete_YeuToCongThem(str_delete);
            return false;
        }
    },
    /*------------------------------------------
   --Discription: [3] AcessDB ThoiGian
   -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = main_doc.GioQuyDoi;

        //--Edit
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            

            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genCombo_ThoiGian(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    genCombo_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropGQD_ThoiGian"],
            type: "",
            title: "Thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
};