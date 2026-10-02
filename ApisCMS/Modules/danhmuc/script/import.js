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
function Import() { };
Import.prototype = {
    objHTML_DMIP: {},
    arrValid_DMIP: [],
    dtDanhMucImport: [],
    dtUngDung: [],
    dtParam: '',
    strFunc_Id: '',
    strParam_id: '',
    strFilePath: '',
    
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
            { "MA": "txtDMIP_Ten", "THONGTIN1": "EM" },
            { "MA": "dropDMIP_UngDung", "THONGTIN1": "EM" }
        ];
        me.getList_Func_DMIP();
        /*------------------------------------------
        --Discription: Action_main DanhMucImport
        --Order: 
        -------------------------------------------*/
        $("#btnAddFunc_DMIP").click(function () {
            me.resetPopup();
            $("#dropUngDung_DMIP").val($("#dropSearch_UngDung_DMIP").val()).trigger("change");
            me.popupFunc();
        });
        $("#zone_danhmuctenbang_IP").delegate('.btnDownload_Func', 'click', function (event) {
            var strMaDanhMuc = this.title;
            event.stopPropagation();
            me.getMauFileImport(strMaDanhMuc);
        });
        $("#zone_danhmuctenbang_IP").delegate('li', 'mouseenter', function (event) {
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
        /*------------------------------------------
        --Discription: Action_search DanhMucImport
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_Func_DMIP();
        });
        $("#btnCall_Import_DMIP").click(function () {
            $("#zone_view").slideUp();
            $("#zone_import").slideDown();
            $("#zoneImportDuLieu").show();
            $("#zoneViewImport").hide();
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
        $(".btnClose").click(function () {
            $("#zone_view").slideDown();
            $("#zone_import").slideUp();
        });
        edu.system.uploadImport(["txtFile_DMIP"], me.import_DMIP);
        /*------------------------------------------
        --Discription: Load Select DanhMucImport
        -------------------------------------------*/
        $("#SheetContent").delegate('.btnCall_Import_DMIP', 'click', function (event) {
            var strSheet = $(this).attr("name");
            event.stopPropagation();
            location.href = edu.system.rootPath + "/Handler/Import.aspx?fileName=" + me.strFilePath.replace(/\\\\/g, '\\') + "&sheetName=" + strSheet;
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucImport
    -------------------------------------------*/
    popupFunc: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalFunc").modal("show");
        me.resetPopup();
        //$("#txtSQLSoure").val("create or replace package pkg_nhansu_quatrinh is\n procedure LayThongTinChiTietNCKH_SP_HNHT(ParamId varchar2, rs out refcur, ParamErr out varchar2)isbeginParamErr:=null;open rs forselecta.ID,--                 VARCHAR2(100) not null,a.masanpham,a.NCKH_DeTai_ThanhVien_Id,(select nhansu_hosocanbo.ho||' '||nhansu_hosocanbo.ten from nhansu_hosocanbo where Id = a.nckh_detai_thanhvien_id) as nckh_detai_thanhvien_Ten,(select nhansu_hosocanbo.masocanbo from nhansu_hosocanbo where Id = a.nckh_detai_thanhvien_id) as nckh_detai_thanhvien_Ma,a.VaiTro_Id,(select ten from chung_dulieudanhmuc where Id  = a.VaiTro_Id)as VaiTro_Ten,a.TenHoiNghiHoiThao,--  varchar2(1000),a.TenBaoCao,--  VARCHAR2(1000),a.SoTacGia_n,--  number,a.NamBaoCao,--  varchar2(100),a.ThuocLinhVucNao_Id,--  varchar2(32),(Select chung_dulieudanhmuc.ten from chung_dulieudanhmuc where Id = a.ThuocLinhVucNao_Id) as ThuocLinhVucNao_Ten,(Select chung_dulieudanhmuc.Ma from chung_dulieudanhmuc where Id = a.ThuocLinhVucNao_Id) as ThuocLinhVucNao_Ma,a.PhamViHoiNghiHoiThao_Id,--  varchar2(32),(Select chung_dulieudanhmuc.ten from chung_dulieudanhmuc where Id = a.PhamViHoiNghiHoiThao_Id) as PhamViHoiNghiHoiThao_Ten,(Select chung_dulieudanhmuc.Ma from chung_dulieudanhmuc where Id = a.PhamViHoiNghiHoiThao_Id) as PhamViHoiNghiHoiThao_Ma,a.NCKH_QuanLyDeTai_Id,--  varchar2(100),a.NamHoanThanh,--  varchar2(100),a.FileMinhChung,--  varchar2(4000),a.ThongTinMinhChung,--  varchar2(1000),a.TrangThai,--  number,a.CanBoNhap_Id,(select name from tbl_stu_user where Id = a.canbonhap_id) as CanBoNhap_Ten,(select fullname from tbl_stu_user where Id = a.canbonhap_id) as CanBoNhap_TenDayDu,pkg_chung.HienThiKieu_dd_mm_yyyy(a.NgayTao,'/') as NgayTao,(select chung_dulieudanhmuc.ten from chung_dulieudanhmuc where Id =(select LoaiChucDanh_Id from nhansu_hosocanbo where Id = a.nckh_detai_thanhvien_id)) as LoaiChucDanh,(select chung_dulieudanhmuc.ma from chung_dulieudanhmuc where Id =(select LoaiChucDanh_Id from nhansu_hosocanbo where Id = a.nckh_detai_thanhvien_id)) as LoaiChucDanh_Ma,(select chung_dulieudanhmuc.ten from chung_dulieudanhmuc where Id =(select LoaiHocVi_Id from nhansu_hosocanbo where Id = a.nckh_detai_thanhvien_id)) as LoaiHocVi,(select chung_dulieudanhmuc.ma from chung_dulieudanhmuc where Id =(select LoaiHocVi_Id from nhansu_hosocanbo where Id = a.nckh_detai_thanhvien_id)) as LoaiHocVi_Ma,(select daotao_cocautochuc.ten from daotao_cocautochucwhere Id =(select nhansu_hosocanbo.daotao_cocautochuc_id from nhansu_hosocanbowhere Id = a.nckh_detai_thanhvien_id)) as DonViCuaThanhVien,(select NCKH_SP_PHANBO.KLGD_THOIGIAN_ID from NCKH_SP_PHANBOwhere NCKH_SP_PHANBO.SANPHAM_ID = a.Id and rownum = 1) as ThoiGian_Id,a.ThuTu-- numberfrom NCKH_SP_HoiNghiHoiThao a where a.Id = ParamId;exception when others thenParamErr:=sqlerrm;end;");
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
        me.strFunc_Id = "";
        me.strParam_id = "";
        edu.util.viewValById("dropUngDung_DMIP", "");
        edu.util.viewValById("txtTenHamImport", "");
        edu.util.viewValById("txtMaHamImport", "");
        edu.util.viewValById("txtSQLSoure", "");
        edu.util.viewValById("txtTenThamSo", "");
        edu.util.viewValById("txtMaCotExcel", "");
        edu.util.viewValById("txtMaDataBase", "");
        edu.util.viewValById("txtDulieuMacDinh", "");
        edu.util.viewValById("txtKeyChinh", "");
        edu.util.viewValById("txtKieuDuLieu", "");
        edu.util.viewValById("txtKieuDauVao", "");
        edu.util.viewValById("txtTenGoi", "");

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
            'action': 'CMS_DanhMucImport/ThemMoiHam',
            

            'strId': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strMa': edu.util.getValById("txtMaHamImport"),
            'strTen': edu.util.getValById("txtTenHamImport"),
            'strUngDung_Id': edu.util.getValById("dropUngDung_DMIP"),
            'strMoTa': edu.util.getValById("txtSQLSoure"),
            'iThuTu': "",
            'iTrangThai': "",
            'strPhanCap_Id': "",
            'strCha_Id': "",
            'strNgayThucHien': ""
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
                        me.strFunc_Id = data.Message;
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
            'action': 'CMS_DanhMucImport/LayDanhSachHam',

            'strPhanCap_Id' : edu.util.getValById(""),
            'strCha_Id'     : edu.util.getValById(""),
            'strUngDung_Id' : edu.util.getValById("dropSearch_UngDung_DMIP"),
            'strTuKhoa'     : edu.util.getValById("txtSearch_TuKhoa_DMIP"),
            'pageIndex'     : 1,
            'pageSize'      : 1000000,
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
            type: "GET",
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
            'action': 'CMS_DanhMucImport/XoaHam',
            'strId': Ids,
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
        var strSQLSoure = $("#txtSQLSoure").val();
        var obj = SeaGate_BackEnd(strSQLSoure);
        //
        var strpackage = obj.strPackage;
        var strFuncs = obj.strFunctionName;
        var arrThamSo = obj.arrThamSo;
        var i = 0
        for (i; i < arrThamSo.length; i++) {
            save(arrThamSo[i], i * 300);
        }
        setTimeout(function () {
            me.getMauFileImport(edu.util.getValById("txtMaHamImport"));
        }, i * 300);

        function save(arrTemp, itime) {
            setTimeout(function () {
                arrTemp = arrTemp.replace(/ /g, '').split(',');
                me.save_Param({
                    'strMa': arrTemp[0],
                    'strTen': "",
                    'strCha_Id': "",
                    'strDanhMucTenBang_Id': me.strFunc_Id,
                    'iHeSo1': "",
                    'iHeSo2': arrTemp[3],
                    'iHeSo3': arrTemp[4],
                    'strThongTin1': arrTemp[1],
                    'strThongTin2': arrTemp[2],
                    'strThongTin3': strpackage + "." + strFuncs,
                    'strThongTin4': "",
                    'strThongTin5': "",
                    'strThongTin6': "",
                    'strThongTin7': "",
                    'strThongTin8': "",
                    'strMoTa': edu.util.getValById("txtTenHamImport"),
                    'strId': "",
                    'strNguoiThucHien_Id': edu.system.userId
                });
            }, itime + 100)
        }
    },
    loadToTree_DMTB: function (data, iPager) {
        var me = this;
        $("#lblDanhMucTenBang_Tong").html(data.length);
        var node = "";
        node += '<ul>';
        for (var i = 0; i < data.length; i++) {
            node += '<li class="jstree-open btnDownload_Func" id="' + data[i].ID + '" title="' + data[i].MADANHMUC + '">' + edu.util.splitString(data[i].TENDANHMUC, 20) + '<b style="display: none"><p class="fa fa-download" style="margin-left: 10px"></b>';
            node += '</li>';
        }
        node += '</ul>';
        $('#zone_danhmuctenbang_IP').html(node);
        configTreejs();
        //2. Action
        $('#zone_danhmuctenbang_IP').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            //var strNameNode_full = data.node.li_attr.title;
            //
            //$("#DropDuLieuCha_Search").val("").trigger("change");
            me.strFunc_Id = strNameNode;
        });

        function configTreejs() {
            //1. check
            $('#zone_danhmuctenbang_IP').jstree();//default user
            $('#zone_danhmuctenbang_IP').jstree(true).refresh();
            $('#zone_danhmuctenbang_IP').one("refresh.jstree").jstree(true).refresh();
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
                'strCha_Id': "",
                'strDanhMucTenBang_Id': me.strFunc_Id,
                'iHeSo1': edu.util.getValById("txtKeyChinh"),
                'iHeSo2': edu.util.getValById("txtKieuDuLieu"),
                'iHeSo3': edu.util.getValById("txtKieuDauVao"),
                'strThongTin1': edu.util.getValById("txtMaCotExcel"),
                'strThongTin2': edu.util.getValById("txtDulieuMacDinh"),
                'strThongTin3': edu.util.getValById("txtTenGoi"),
                'strThongTin4': "",
                'strThongTin5': "",
                'strThongTin6': "",
                'strThongTin7': "",
                'strThongTin8': "",
                'strMoTa': "",
                'strId': me.strParam_id,
                'strNguoiThucHien_Id': edu.system.userId
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
            action: 'CMS_DanhMucImport/ThemMoiThamSo',
            
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
            'action': 'CMS_DanhMucImport/LayDanhSachThamSo',

            'strDanhMucTenBang_Id': me.strFunc_Id,
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
            'action': 'CMS_DanhMucImport/XoaThamSo',
            'strId': Ids,
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
        var me = main_doc.Import;
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
        var me = main_doc.Import;
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
                center: [0, 4, 5],
                fix: [0, 4, 5]
            },
            aoColumns: [{
                "mDataProp": "TEN"
            },
            {
                "mDataProp": "THONGTIN1"
            }, {
                "mDataProp": "MA"
            }, {
                "mDataProp": "THONGTIN2"
            }, {
                "mDataProp": "HESO1"
            }, {
                "mDataProp": "HESO2"
            },
            {
                "mDataProp": "HESO3"
            }
                , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="btn btn-default btn-circle color-active ' + me.objHTML_DMIP.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
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
        edu.util.viewValById("txtKeyChinh", data.HESO1);
        edu.util.viewValById("txtKieuDuLieu", data.HESO2);
        edu.util.viewValById("txtKieuDauVao", data.HESO3);
        edu.util.viewValById("txtTenGoi", data.THONGTIN3);
    },
    //
    getMauFileImport: function (strMaDanhMuc) {
        location.href = edu.system.rootPathReport + "/Modules/Common/MauImport.aspx?Ma=" + strMaDanhMuc;
    },
    import_DMIP: function (a, strPath) {
        var me = main_doc.Import;
        me.strFilePath = strPath;
        //--Edit
        var obj_list = {
            'action': 'SYS_Import/getDataFormFileImport',
            
            'strPath': strPath
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                $("#zoneImportDuLieu").hide();
                $("#zoneViewImport").show();
                
                me.viewDataImport(data);
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
    viewDataImport: function (data) {
        var strSheetName = data.Id;
        var dt = data.Data;
        var arrSheet = strSheetName.replace(/'/g, "").replace(/"/g, "").split("$");
        if (arrSheet.length < 1) return;
        var row = '<ul class="nav nav-tabs">';
        for (var i = 0; i < arrSheet.length - 1; i++) {
            var classActive = "";
            if (i == 0) classActive = ' class="active"'
            row += '<li' + classActive + '><a href="#tab_' + arrSheet[i] + '" data-toggle="tab" aria-expanded="true"><span style="float: left" class="lang" key=""> ' + (i + 1) + '. ' + arrSheet[i] + '</span> <span style="float: left" class="btn btn-primary btnCall_Import_DMIP" name="' + arrSheet[i] + '"> <i class="fa fa-upload"></i> Import</span></a></li>';
        }
        row += '</ul>';
        row += '<div class="tab-content">';
        for (var i = 0; i < arrSheet.length -1; i++) {
            var json = eval('data.Data.Table' + (i + 1));
            if (json == undefined) continue;
            var classActive = "";
            if (i == 0) classActive ="active"
            row += '<div class="tab-pane ' + classActive + '" id="tab_' + arrSheet[i] + '">';
            row += '<div class="row row-tab row-align" >';
            row += '<table class="table table-hover">';
            row += '<thead>';
            row += '<tr>';
            for (var x in json[0]) {
                row += '<th class="td-center">'+ x +'</th>';
            }
            row += '</tr>';
            row += '</thead>';
            row += '<tbody>';
            for (var j = 0; j < json.length; j++) {
                row += '<tr>';
                for (var x in json[0]) {
                    row += '<td class="td-center">' + json[j][x] + '</td>';
                }
                row += '</tr>';
            }
            row += '</tbody>';
            row += '</table>';
            row += '</div >';
            row += '</div >';
        }
        row += '</div >';
        $("#SheetContent").html(row);
    }
};