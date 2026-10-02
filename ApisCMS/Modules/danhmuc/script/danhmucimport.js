/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL: TaiChinh/CMS_DanhMucImport
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DanhMucImport() { };
DanhMucImport.prototype = {
    objHTML_DMIP: {},
    arrValid_DMIP: [],
    dtDanhMucImport: [],
    dtUngDung: [],
    dtParam: '',
    strFunc_Id: '',
    strParam_id: '',
    
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial page DanhMucImport
        -------------------------------------------*/
        me.objHTML_DMIP = {
            table_id: "tbldata_DMIP",
            prefix_id: "chkSelectAll_DMIP",
            regexp: /chkSelectAll_DMIP/g,
            chkOne: "chkSelectOne_DMIP",
            btn_edit: "btnEdit_DMIP",
            btn_save_id: "btnSave_DMIP",
            btn_save_tl: "Lưu"
        };
        me.arrValid_DMIP = [
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtDMIP_Ma", "THONGTIN1": "EM" },
            { "MA": "txtDMIP_Ten", "THONGTIN1": "EM" }
        ];
        me.getList_Func_DMIP();
        /*------------------------------------------
        --Discription: Action_main DanhMucImport
        --Order: 
        -------------------------------------------*/
        $("#btnSaveFunc_DMIP").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DMIP);
            if (valid) {
                edu.system.updateModal(this, me.objHTML_DMIP);
                var strcheck = $("#txtSQLSoure").val().toLowerCase();
                if (strcheck != "" && strcheck.indexOf("create or replace package") == -1 || strcheck.indexOf("procedure") == -1) {
                    edu.system.alertOnModal("Bạn nhập thiếu!", "w");
                    $("#txtSQLSoure").val('');
                    return;
                }
                me.save_Func_DMIP();
                $("#myModalFunc").modal("hide");
            }
        });
        $("#btnAddFunc_DMIP").click(function () {
            me.resetPopup();
            $("#dropUngDung_DMIP").val($("#dropSearch_UngDung_DMIP").val()).trigger("change");
            me.popupFunc();
        });
        $("#zone_danhmuctenbang_DMIP").delegate('.btnEdit_Func', 'click', function () {
            var selected_id = this.parentNode.parentNode.parentNode.id;
            me.getDetai_Func_DMIP(selected_id);
        });
        $("#zone_danhmuctenbang_DMIP").delegate('.btnDownload_Func', 'click', function (event) {
            var strMaDanhMuc = this.parentNode.parentNode.parentNode.title;
            event.stopPropagation();
            me.getMauFileImport(strMaDanhMuc);
        });
        $("#zone_danhmuctenbang_DMIP").delegate('.btnDownload_DM', 'click', function (event) {
            var strMaDanhMuc = this.parentNode.parentNode.parentNode.title;
            event.stopPropagation();
            var url_report = edu.system.rootPathReport + "/Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=" + strMaDanhMuc;
            location.href = url_report;
        });
        $("#zone_danhmuctenbang_DMIP").delegate('.btnDelete_Func', 'click', function (event) {
            var selected_id = this.parentNode.parentNode.parentNode.id;
            me.delete_Func_DMIP(selected_id);
        });
        $("#zone_danhmuctenbang_DMIP").delegate('li', 'mouseenter', function (event) {
            $(this).find("b").show();
        }).delegate('li', 'mouseleave', function (event) {
            $(this).find("b").hide();
        });
        /*------------------------------------------
        --Discription: Action_search DanhMucImport
        -------------------------------------------*/
        $("#btnSaveParam_DMIP").click(function () {
            me.save_Param();
        });
        $("#tbldata_DMIP").delegate('.btnEdit_DMIP', 'click', function () {
            var selected_id = this.id;
            me.getDetai_Param(selected_id);
            
        });
        
        $("#btnAddParam_DMIP").click(function () {
            me.resetPopup();
            me.popupParam();
        });
        $("#tbldata_DMIP").delegate('.btnDelete_Param', 'click', function () {
            var selected_id = this.id;
            me.delete_Param_DMIP(selected_id);

        });
        /*------------------------------------------
        --Discription: Action_search DanhMucImport
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_Func_DMIP();
        });
        $('#dropDMIP_UngDung_Search').off('change').on('change', function () {
            me.getList_Func_DMIP();
            return false;
        });
        $("#txtSearch_TuKhoa_DMIP").keypress(function (e) {
            if (e.which === 13) {
                me.getList_Func_DMIP();
            }
        });

        $("#btnCall_Import_DMIP").click(function () {
            edu.system.showImportChung("");
        });
        /*------------------------------------------
        --Discription: Load Select DanhMucImport
        -------------------------------------------*/
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucImport
    -------------------------------------------*/
    popupFunc: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalFunc").modal("show");
        me.resetPopup();
    },
    popupParam: function () {
        $("#btnNotifyModal").remove();
        $("#myModalParam").modal("show");
    },
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    resetPopup: function () {
        var me = this;
        //me.strFunc_Id = "";
        me.strParam_id = "";
        //edu.util.viewValById("dropUngDung_DMIP", "");
        edu.util.viewValById("txtTenHamImport", "IMPORTWITHPROC_");
        edu.util.viewValById("txtMaHamImport", "IMPORTWITHPROC_");
        var strSQL = "create or replace package XXXXXXX is\n procedure "
        edu.util.viewValById("txtSQLSoure", strSQL);
        edu.util.viewHTMLById("txtSQLSoure", strSQL);
        //edu.util.viewValById("txtTenThamSo", "");
        //edu.util.viewValById("txtMaCotExcel", "");
        //edu.util.viewValById("txtMaDataBase", "");
        //edu.util.viewValById("txtDulieuMacDinh", "");
        //edu.util.viewValById("txtKeyChinh", "");
        //edu.util.viewValById("txtKieuDuLieu", "");
        //edu.util.viewValById("txtKieuDauVao", "");
        //edu.util.viewValById("txtTenGoi", "");
        //edu.util.viewValById("txtThuTu", "");
        //edu.util.viewValById("txtGetData", "");

        //edu.system.createModal(me.objHTML_DMIP);
    },
    /*------------------------------------------
    --Discription: Func
    -------------------------------------------*/
    save_Func_DMIP: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
			'action': 'CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi',
			'func': 'pkg_chung_danhmuc.ThemBangDanhMuc',
			'iM' : edu.system.iM,
            'strId': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strMaDanhMuc': edu.util.getValById("txtMaHamImport"),
            'strTenDanhMuc': edu.util.getValById("txtTenHamImport"),
            'strNhomDanhMuc_Id': edu.util.getValById("dropUngDung_DMIP"),
            'strMoTa': edu.util.getValById("txtSQLSoure"),
            'dThuTu': 1,
            'dTrangThai': 995,
            'strPhanCapDanhMuc_Id': "",
            'strChung_TenDanhMuc_Cha_Id': "",
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strFunc_Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        me.strFunc_Id = data.Id;
                        if (edu.util.getValById("txtSQLSoure") != "") {
                            me.preSave_Func_DMIP();
                        }
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_Func_DMIP();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "CMS_DanhMucImport.ThemMoi (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: "CMS_DanhMucImport.ThemMoi (er): " + er,
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
    getList_Func_DMIP: function () {
        var me = this;

        //--Edit
        var obj_list = {
			'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
			'func': 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
			'iM' : edu.system.iM,
            'strPhanCapDanhMuc_Id' : edu.util.getValById(""),
            'strChung_TenDanhMuc_Cha_Id'     : edu.util.getValById(""),
            'strNhomDanhMuc_Id' : edu.util.getValById("dropSearch_UngDung_DMIP"),
            'strTuKhoa'     : edu.util.getValById("txtSearch_TuKhoa_DMIP"),
            'pageIndex'     : 1,
            'pageSize': 1000000,
            'dTrangThai': 995,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
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
                    else {
                        dtResult = [];
                        iPager = 0;
                    }
                    me.dtDanhMucImport = dtResult;
                    me.loadToTree_DMTB(dtResult, iPager);
                    if (!edu.util.checkValue(me.dtUngDung)) {
                        me.getList_UngDung();
                    }
                    
                }
                else {
                    edu.system.alert("CMS_DanhMucImport.LayDanhSachHam (er): " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucImport.LayDanhSachHam (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetai_Func_DMIP: function (selectId) {
        var me = this;
        for (var i = 0; i < me.dtDanhMucImport.length; i++) {
            if (selectId == me.dtDanhMucImport[i].ID) {
                me.viewForm_Func(me.dtDanhMucImport[i]);
            }
        }
    },
    delete_Func_DMIP: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP',
            'func': 'pkg_chung_danhmuc.XoaDanhMuc',
            'iM' : edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'dTrangThai': 995,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_Func_DMIP();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucImport.Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucImport.Xoa: " + JSON.stringify(er),
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
	--Discription: [1] Gen HTML ==> Func
	--Author: 
	-------------------------------------------*/
    preSave_Func_DMIP: function () {
        var me = this;
        var strSQLSoure = $("#txtSQLSoure").val().replace(/PACKAGE/g, 'package').replace(/PROCEDURE/g, 'procedure');
        var obj = SeaGate_BackEnd(strSQLSoure);
        console.log(obj);
        //
        var strpackage = obj.strPackage;
        var strFuncs = obj.strFunctionName;
        var arrThamSo = obj.arrThamSo;
        var i = 0;
        for (i; i < arrThamSo.length; i++) {
            save(arrThamSo[i], i);
        }
        //setTimeout(function () {
        //    me.getMauFileImport(edu.util.getValById("txtMaHamImport"));
        //}, i * 300);

        function save(arrTemp, iThuTu) {
            setTimeout(function () {
                arrTemp = arrTemp.replace(/ /g, '').split(',');
                var strKeyExcel = arrTemp[1].trim();
                if (strKeyExcel == "UngDung_Id" || strKeyExcel == "ChucNang_Id" || strKeyExcel == "NguoiThucHien_Id" || strKeyExcel == "Id") strKeyExcel = "";
                me.save_Param({
                    'strMa': arrTemp[0],
                    'strTen': "",
                    'strQuanHeCha_Id': "",
                    'strChung_TenDanhMuc_Id': me.strFunc_Id,
                    'dHeSo1': iThuTu,
                    'dHeSo2': arrTemp[3],
                    'dHeSo3': arrTemp[4],
                    'strThongTin1': strKeyExcel,
                    'strThongTin2': arrTemp[2],
                    'strThongTin3': strpackage + "." + strFuncs,
                    'strThongTin4': "",
                    'strThongTin5': "",
                    'strThongTin6': "",
                    'strThongTin7': "",
                    'strThongTin8': "",
                    'strMoTa': edu.util.getValById("txtTenHamExport"),
                    'strId': "",
                    'dTrangThai': 995,
                    'strNguoiThucHien_Id': edu.system.userId,
                });
            }, iThuTu*300 + 100);
        }
    },
    loadToTree_DMTB: function (data, iPager) {
        var me = this;
        $("#lblDanhMucTenBang_Tong").html(data.length);
        var node = "";
        node += '<ul>';
        for (var i = 0; i < data.length; i++) {
            node += '<li class="btnEvent jstree-open" id="' + data[i].ID + '" title="' + data[i].MADANHMUC + '">' + data[i].MADANHMUC.replace(/IMPORTWITHPROC_/g, '') + "_" + data[i].TENDANHMUC + '<b style="display: none"><p class="fa fa-download btnDownload_Func" style="margin-left: 10px"></p><p class="fa fa-remove btnDelete_Func" style="margin-left: 10px"></p><p class="fa fa-download btnDownload_DM" style="margin-left: 10px"></p></b>';
            node += '</li>';
        }
        node += '</ul>';
        $('#zone_danhmuctenbang_DMIP').html(node);
        configTreejs();
        //2. Action
        $('#zone_danhmuctenbang_DMIP').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            //var strNameNode_full = data.node.li_attr.title;
            //
            //$("#DropDuLieuCha_Search").val("").trigger("change");
            me.strFunc_Id = strNameNode;
            me.getList_Param();
        });

        function configTreejs() {
            //1. check
            $('#zone_danhmuctenbang_DMIP').jstree();//default user
            //$('#zone_danhmuctenbang_DMIP').jstree(true).refresh();
            //$('#zone_danhmuctenbang_DMIP').one("refresh.jstree").jstree(true).refresh();
        }
    },
    viewForm_Func: function (data) {
        var me = this;
        //call popup --Edit
        me.popupFunc();
        //view data --Edit
        me.strFunc_Id = data.ID;
        edu.util.viewValById("dropUngDung_DMIP", data.NHOMDANHMUC_ID);
        edu.util.viewValById("txtTenHamImport", data.TENDANHMUC);
        edu.util.viewValById("txtMaHamImport", data.MADANHMUC);
        edu.util.viewValById("txtSQLSoure", data.MOTA);
    },
    /*------------------------------------------
	--Discription: [2] ACESS DB ==> Param
	--Author: nnthuong
	-------------------------------------------*/
    save_Param: function (objAuto) {
        var me = this;
        if (me.strFunc_Id == "") {
            edu.system.alert("Hãy chọn hàm bên tay trái", "w");
            return;
        }
        var strId = me.strParam_id;
        var obj;
        if (objAuto != undefined) obj = objAuto;
        else {
            obj = {
                'strMa': edu.util.getValById("txtMaDataBase"),
                'strTen': edu.util.getValById("txtTenThamSo"),
                'strQuanHeCha_Id': "",
                'strChung_TenDanhMuc_Id': me.strFunc_Id,
                'dHeSo1': edu.util.getValById("txtThuTu"),
                'dHeSo2': edu.util.getValById("txtKieuDuLieu"),
                'dHeSo3': edu.util.getValById("txtKieuDauVao"),
                'strThongTin1': edu.util.getValById("txtMaCotExcel"),
                'strThongTin2': edu.util.getValById("txtDulieuMacDinh"),
                'strThongTin3': edu.util.getValById("txtTenGoi"),
                'strThongTin4': edu.util.getValById("txtKeyChinh"),
                'strThongTin5': edu.util.getValById("txtGetData"),
                'strThongTin6': "",
                'strThongTin7': "",
                'strThongTin8': "",
                'strMoTa': "",
                'strId': me.strParam_id,
                'dTrangThai': 995,
                'strNguoiThucHien_Id': edu.system.userId,
            };
        }

        
        //if (edu.util.checkValue(me.strParam_id)) {
        //    strId = me.strParam_id;
        //}
        //2. save --> call db
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        obj = {
                            type: "s",
                            title: "Thông báo",
                            content: "Thêm mới thành công!"
                        };
                        edu.system.alertOnModal(obj);
                    }
                    else {
                        obj = {
                            type: "s",
                            title: "Thông báo",
                            content: "Cập nhật thành công!"
                        };
                        edu.system.alertOnModal(obj);
                    }
                    me.getList_Param();
                }
                else {
                    obj = {
                        type: "w",
                        title: "Thông báo",
                        content: "CMS_DanhMucDuLieu.ThemMoi: " + data.Message,
                    }
                    edu.system.alertOnModal(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    type: "w",
                    title: "Thông báo",
                    content: "CMS_DanhMucDuLieu.ThemMoi: " + JSON.stringify(er),
                }
                edu.system.alertOnModal(obj);
            },
            type: 'POST',
            action: obj.strId ? 'CMS_DanhMucDuLieu/CapNhat': 'CMS_DanhMucDuLieu/ThemMoi',
            
            contentType: true,
            
            data: obj,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Param: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_DanhMucDuLieu/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strCHUNG_TENDANHMUC_Id': me.strFunc_Id,
            'strTieuChiSapXep': 'HESO1',
            'strQUANHECHA_Id': edu.util.getValById('dropAAAA'),
            'dTrangThai': 995,
            'pageIndex': 1,
            'pageSize': 100000,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtParam = data.Data;
                    me.genTable_Param(data.Data);
                }
                else {
                    edu.system.alert("CMS_DanhMucImport.LayDanhSachHam (er): " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucImport.LayDanhSachHam (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetai_Param: function (selectId) {
        var me = this;
        for (var i = 0; i < me.dtParam.length; i++) {
            if (selectId == me.dtParam[i].ID) {
                me.viewForm_Param(me.dtParam[i]);
            }
        }
    },
    delete_Param_DMIP: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_DanhMucDuLieu/Xoa',
            'strId': Ids,
            'dTrangThai': 995,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_Param();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucImport/XoaThamSo: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucImport/XoaThamSo: " + JSON.stringify(er),
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
	--Discription: [4]  ACESS DB ==> UngDung
    --Author: nnthuong
	-------------------------------------------*/
    getList_UngDung: function () {
        var me = main_doc.DanhMucImport;
        var obj = {
            iTrangThai: 1,
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.extend.getList_UngDung(obj, "", "", me.cbGenCombo_UngDung);
    },

    /*------------------------------------------
	--Discription: [4] Gen HTML ==> UngDung
	--Author: nnthuong
	-------------------------------------------*/
    cbGenCombo_UngDung: function (data) {
        var me = main_doc.DanhMucImport;
        me.dtUngDung = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_UngDung_DMIP", "dropUngDung_DMIP"],
            type: "",
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: Generating html on interface DanhMucImport
    --ULR: Modules
    -------------------------------------------*/
    genTable_Param: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_DMIP",
            aaData: data,
            colPos: {
                center: [0, 1, 6, 7],
                fix: [0, 7, 6]
            },
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mDataProp": "HESO1"
                },{
                "mDataProp": "TEN"
            },
            {
                "mDataProp": "THONGTIN1"
            }, {
                "mDataProp": "MA"
            }, {
                "mDataProp": "THONGTIN2"
            }, {
                "mDataProp": "THONGTIN4"
            }, {
                "mDataProp": "HESO2"
            },
            {
                "mDataProp": "HESO3"
                },
                {
                    "mDataProp": "THONGTIN5"
                }
                , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="btn btn-default btn-circle color-active btnEdit ' + me.objHTML_DMIP.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
                , {
                "mRender": function (nRow, aData) {
                    return '<a type="checkbox" class="btnDelete_Param" id="' + aData.ID + '">Xóa</a>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_Param: function (data) {
        var me = this;
        //call popup --Edit
        me.popupParam();
        //view data --Edit
        me.strParam_id = data.ID;
        edu.util.viewValById("txtTenThamSo", data.TEN);
        edu.util.viewValById("txtMaCotExcel", data.THONGTIN1);
        edu.util.viewValById("txtMaDataBase", data.MA);
        edu.util.viewValById("txtDulieuMacDinh", data.THONGTIN2);
        edu.util.viewValById("txtKeyChinh", data.THONGTIN4);
        edu.util.viewValById("txtKieuDuLieu", data.HESO2);
        edu.util.viewValById("txtKieuDauVao", data.HESO3);
        edu.util.viewValById("txtTenGoi", data.THONGTIN3);
        edu.util.viewValById("txtThuTu", data.HESO1);
        edu.util.viewValById("txtGetData", data.THONGTIN5);
    },
    //
    getMauFileImport: function (strMaDanhMuc) {
        location.href = edu.system.rootPathReport + "/Modules/Common/MauImport.aspx?Ma=" + strMaDanhMuc;
    },
    import_DMIP: function (a, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Import/Import',
            

            'strPath': strPath,
            'strApp_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data = data.Data;
                    if (data.length > 0) {
                        var row = '<table class="table table-hover table-bordered">';
                        row += '<tr>';
                        for (var x in data[0]) {
                            row += '<td>' + edu.util.returnEmpty(x) + '</td>';
                        }
                        row += '</tr>';
                        for (var i = 0; i < data.length; i++) {
                            row += '<tr>';
                            for (var x in data[0]) {
                                row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
                            }
                            row += '</tr>';
                        }
                        row += '</table>';
                        edu.system.alert(row);
                    }
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_SVQT/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
};