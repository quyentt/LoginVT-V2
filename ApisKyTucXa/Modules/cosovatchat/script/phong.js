/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function Phong() { }
Phong.prototype = {
    dtToaNha: [],
    strToaNha_Id: '',
    dtPhong: [],
    strPhong_Id: '',
    strCongToDien: '',
    dtCongToDien: [],
    strCongToNuoc: '',
    dtCongToNuoc: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action Common
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnClose").click(function () {
            me.toggle_list_Phong();
        });
        $(".btnCloseInput").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        /*------------------------------------------
        --Discription: [1] Action TimKiem Phong
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_Phong_ToaNha").on("select2:select", function () {
            var strToaNha_Id = edu.util.getValById("dropSearch_Phong_ToaNha");
            $("#dropPhong_ToaNha").val(strToaNha_Id).trigger("change");
            me.getList_Phong(strToaNha_Id);
        });
        $("#dropPhong_ToaNha").on("select2:select", function () {
            var strToaNha_Id = edu.util.getValById("dropPhong_ToaNha");
            $("#dropSearch_Phong_ToaNha").val(strToaNha_Id).trigger("change");
            me.getList_Phong();
        });
        $("#txtSearch_Phong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Phong();
            }
        });
        $(".btnSearch_Phong").click(function () {
            me.getList_Phong();
        });
        /*------------------------------------------
        --Discription: [2] Action CongToDien/Nuoc_Phong
        --Order: 
        -------------------------------------------*/

        $("#tbl_CongToDien").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_CongToDien");
                $("#btnYes").click(function (e) {
                    me.delete_CongToDien_Phong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblCongToNuoc").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblCongToNuoc");
                $("#btnYes").click(function (e) {
                    me.delete_CongToNuoc_Phong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblPhong").delegate('.btnView', 'click', function (e) {
            var strId = this.id;
            event.stopImmediatePropagation();
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            $("#zoneEdit").slideDown();
            me.strPhong_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strPhong_Id, "tblPhong");
            var data = edu.util.objGetDataInData(strId, me.dtPhong, "ID");
            me.viewEdit_Phong(data);
        });

        /*------------------------------------------
        --Discription: [3-4] Action CongToDien/Nuoc
        --Order: 
        -------------------------------------------*/

        $("#btnSave_CongToDien_Phong").click(function () {
            me.save_CongToDien_Phong();
        });
        $("#btnSave_CongToNuoc_phong").click(function () {
            me.save_CongToNuoc_Phong();
        });
        /*------------------------------------------
        --Discription: [3] Action CongToDien
        --Order: 
        -------------------------------------------*/
        $("#zoneBox_CongToDien").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_ctd/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_CongToDien_Phong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [4] Action CongToNuoc
        --Order: 
        -------------------------------------------*/
        $("#zoneBox_CongToNuoc").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_ctn/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_CongToNuoc_Phong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*----------------------------------------------
    --Discription: [0] Common
    --API:  
    ----------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_list();
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_Phong = [
            { "MA": "dropPhong_Phong", "THONGTIN1": "EM" }
        ];
        me.getList_ToaNha();
        me.getList_Phong();
        me.getList_CongToDien();
        me.getList_CongToNuoc();

    },
    rewrite: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewValById("txtChucNang_Ten", "");
        edu.util.viewValById("txtChucNang_Ma", "");
        edu.util.viewValById("txtChucNang_Icon", "");
        edu.util.viewValById("txtChucNang_ThuTuHienThi", "");
        edu.util.viewValById("txtChucNang_DuongDanThuMuc", "");
        edu.util.viewValById("dropChucNang_TrangThai", "");
        edu.util.viewValById("txtChucNang_DuongDanHienThi", "");
        //edu.util.viewValById("dropChucNang_Cha", "");
        //edu.util.viewValById("dropChucNang_UngDung", "");
        edu.util.viewValById("dropChucNang_PhamViTruyCap", "");
        edu.util.viewValById("txtChucNang_MoTa", "");
    },
    /*------------------------------------------
    --Discription: [1] Form input
    -------------------------------------------*/
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus-Phong", "zone_detail_Phong");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-Phong", "zone_input_CongToDien");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-Phong", "zone_list_CongToDien");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_congtodien":
                me.resetPopup_CongToDien_Phong();
                me.popup_CongToDien_Phong();
                break;
            case "key_congtonuoc":
                me.resetPopup_CongToNuoc_Phong();
                me.popup_CongToNuoc_Phong();
                break;
        }
    },
    /*----------------------------------------------
    --Discription: [1] AccessDB ToaNha/Phong
    --API:  
    ----------------------------------------------*/
    getList_ToaNha: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.dtToaNha = dtResult;
                    me.genCombo_ToaNha(dtResult);
                }
                else {
                    edu.system.alert("KTX_ToaNha/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_Phong_TuKhoa"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_Phong_ToaNha"),
            'strPhanLoaiDoiTuong_Id': '',
            'strTangThu_Id': "",
            'strLoaiPhong_Id': '',
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default

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
                    me.genTable_Phong(dtResult, iPager);
                    me.genCombo_Phong(dtResult);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genCombo_ToaNha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: ["dropSearch_Phong_ToaNha", "dropPhong_ToaNha"],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_Phong: function (data, iPager) {
        var me = this;
        var html = "";

        $("#lblPhong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Phong.getList_Phong()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnView"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.LOAIPHONG_TEN) + " - " + edu.util.returnEmpty(aData.TINHCHAT_TEN) + "</span>";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genCombo_Phong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: ["dropPhong_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },

    viewEdit_Phong: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblPhong", data.KTX_PHONG_TEN);
        me.getList_CongToDien_Phong();
        me.getList_CongToNuoc_Phong();
    },
    /*----------------------------------------------
    --Discription: [3] AccessDB CongToDien_Phong
    --API:  
    ----------------------------------------------*/
    save_CongToDien_Phong: function () {
        var me = this;
        //var strPhong_Id = edu.util.getValById("dropPhong_Phong");
        //--Edit
        var obj_save = {
            'action': 'KTX_CongToDien_Phong/ThemMoi',
            

            'strId': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_CongToDien_Id': edu.util.getValById("dropCongToDien_Phong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (typeof callback === "function") {
                        me.getList_CongToDien_Phong();
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        me.getList_CongToDien_Phong();
                    }
                }
                else {
                    edu.system.alert("KTX_CongToDien_Phong/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToDien_Phong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CongToDien_Phong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_CongToDien_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_CongToDien_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_CongToDien_Phong(data.Data, data.Pager);
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
    delete_CongToDien_Phong: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_CongToDien_Phong/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CongToDien_Phong(me.strPhong_Id);
                }
                else {
                    $("#notify_cn").html("KTX_CongToDien_Phong.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_CongToDien_Phong.Xoa: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    popup_CongToDien_Phong: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_CongToDien_Phong");
        //event
        //$('#myModal_TSBT').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_CongToDien_Phong: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropCongToDien_Phong");
    },
    genTable_CongToDien_Phong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_CongToDien",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_CONGTODIEN_TEN"
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
    

    save_CongToNuoc_Phong: function () {
        var me = this;
        //var strPhong_Id = edu.util.getValById("dropPhong_Phong");
        //--Edit
        var obj_save = {
            'action': 'KTX_CongToNuoc_Phong/ThemMoi',
            

            'strId': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_CongToNuoc_Id': edu.util.getValById("dropCongToNuoc_Phong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (typeof callback === "function") {
                        me.getList_CongToNuoc_Phong();
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        me.getList_CongToNuoc_Phong();
                    }
                }
                else {
                    edu.system.alert("KTX_CongToNuoc_Phong/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToNuoc_Phong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CongToNuoc_Phong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_CongToNuoc_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strKTX_CongToNuoc_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_CongToNuoc_Phong(data.Data, data.Pager);
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
    delete_CongToNuoc_Phong: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_CongToNuoc_Phong/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CongToNuoc_Phong(me.strPhong_Id);
                }
                else {
                    $("#notify_cn").html("KTX_CongToNuoc_Phong.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_CongToNuoc_Phong.Xoa: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    popup_CongToNuoc_Phong: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_CongToNuoc_Phong");
        //event
        //$('#myModal_TSBT').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_CongToNuoc_Phong: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropCongToNuoc_Phong");
    },
    genTable_CongToNuoc_Phong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCongToNuoc",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_CONGTONUOC_TEN"
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

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Cong to dien
    --Author: duyentt
	-------------------------------------------*/

    getList_CongToDien: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_CongToDien(dtResult);
                }
                else {
                    edu.system.alert("KTX_CongToDien/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToDien/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KTX_CongToDien/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strHangSanXuat_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_CongToDien: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                //code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropCongToDien_Phong"],
            title: "Chọn công tơ điện"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Cong to nuoc
    --Author: duyentt
	-------------------------------------------*/

    getList_CongToNuoc: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_CongToNuoc(dtResult);
                }
                else {
                    edu.system.alert("KTX_CongToNuoc/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToNuoc/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KTX_CongToNuoc/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strHangSanXuat_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_CongToNuoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MA",
                //code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropCongToNuoc_Phong"],
            title: "Chọn công tơ nước"
        };
        edu.system.loadToCombo_data(obj);
    },
};