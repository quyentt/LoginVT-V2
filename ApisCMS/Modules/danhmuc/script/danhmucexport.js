/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL: TaiChinh/CMS_DanhMucExport
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DanhMucExport() { };
DanhMucExport.prototype = {
    objHTML_DMEP: {},
    arrValid_DMEP: [],
    dtDanhMucExport: [],
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
        --Discription: Initial page DanhMucExport
        -------------------------------------------*/
        me.objHTML_DMEP = {
            table_id: "tbldata_DMEP",
            prefix_id: "chkSelectAll_DMEP",
            regexp: /chkSelectAll_DMEP/g,
            chkOne: "chkSelectOne_DMEP",
            btn_edit: "btnEdit",
            btn_save_id: "btnSave_DMEP",
            btn_save_tl: "Lưu"
        };
        me.arrValid_DMEP = [
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtDMEP_Ma", "THONGTIN1": "EM" },
            { "MA": "txtDMEP_Ten", "THONGTIN1": "EM" },
            { "MA": "dropDMEP_UngDung", "THONGTIN1": "EM" }
        ];
        me.getList_Func_DMEP();
        /*------------------------------------------
        --Discription: Action_main DanhMucExport
        --Order: 
        -------------------------------------------*/
        $("#btnSaveFunc_DMEP").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DMEP);
            if (valid) {
                edu.system.updateModal(this, me.objHTML_DMEP);
                var strcheck = $("#txtSQLSoure").val();
                if (strcheck != "" && strcheck.indexOf("create or replace package") == -1 || strcheck.indexOf("procedure") == -1) {
                    edu.system.alertOnModal("Bạn nhập thiếu!", "w");
                    $("#txtSQLSoure").val('');
                    return;
                }
                me.save_Func_DMEP();
                $("#myModalFunc").modal("hide");
            }
        });
        $("#btnAddFunc_DMEP").click(function () {
            me.resetPopup();
            $("#dropUngDung_DMEP").val($("#dropSearch_UngDung_DMEP").val()).trigger("change");
            me.popupFunc();
        });
        $("#zone_danhmuctenbang_DMEP").delegate('.btnEdit_Func', 'click', function () {
            var selected_id = this.parentNode.parentNode.parentNode.id;
            me.getDetai_Func_DMEP(selected_id);
        });
        $("#zone_danhmuctenbang_DMEP").delegate('.btnDownload_Func', 'click', function (event) {
            var strMaDanhMuc = this.parentNode.parentNode.parentNode.title;
            event.stopPropagation();
            me.getMauFileExport(strMaDanhMuc);
        });
        $("#zone_danhmuctenbang_DMEP").delegate('.btnDelete_Func', 'click', function (event) {
            var selected_id = this.parentNode.parentNode.parentNode.id;
            event.stopPropagation();
            me.delete_Func_DMEP(selected_id);
        });
        $("#zone_danhmuctenbang_DMEP").delegate('li', 'mouseenter', function (event) {
            $(this).find("b").show();
        }).delegate('li', 'mouseleave', function (event) {
            $(this).find("b").hide();
        });
        /*------------------------------------------
        --Discription: Action_search DanhMucExport
        -------------------------------------------*/
        $("#btnSaveParam_DMEP").click(function () {
            me.save_Param();
        });
        $("#tbldata_DMEP").delegate('.btnEdit', 'click', function () {
            var selected_id = this.id;
            me.getDetai_Param(selected_id);
            
        });
        
        $("#btnAddParam_DMEP").click(function () {
            me.resetPopup();
            me.popupParam();
        });
        $("#tbldata_DMEP").delegate('.btnDelete_Param', 'click', function () {
            var selected_id = this.id;
            me.delete_Param_DMEP(selected_id);

        });
        /*------------------------------------------
        --Discription: Action_search DanhMucExport
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_Func_DMEP();
        });
        $('#dropDMEP_UngDung_Search').off('change').on('change', function () {
            me.getList_Func_DMEP();
            return false;
        });
        $("#txtSearch_TuKhoa_DMEP").keypress(function (e) {
            if (e.which === 13) {
                me.getList_Func_DMEP();
            }
        });
        /*------------------------------------------
        --Discription: Load Select DanhMucExport
        -------------------------------------------*/
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucExport
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
    resetPopup: function () {
        var me = this;
        me.strFunc_Id = "";
        me.strParam_id = "";
        edu.util.viewValById("dropUngDung_DMEP", "");
        edu.util.viewValById("txtTenHamExport", "");
        edu.util.viewValById("txtMaHamExport", "");
        edu.util.viewValById("txtSQLSoure", "");
        edu.util.viewValById("txtTenThamSo", "");
        edu.util.viewValById("txtMaCotExcel", "");
        edu.util.viewValById("txtMaDataBase", "");
        edu.util.viewValById("txtDulieuMacDinh", "");
        edu.util.viewValById("txtKeyChinh", "");
        edu.util.viewValById("txtKieuDuLieu", "");
        edu.util.viewValById("txtKieuDauVao", "");
        edu.util.viewValById("txtTenGoi", "");

        //edu.system.createModal(me.objHTML_DMEP);
    },
    /*------------------------------------------
    --Discription: Func
    -------------------------------------------*/
    save_Func_DMEP: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
			'action': 'CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi',
			'func': 'pkg_chung_danhmuc.ThemBangDanhMuc',
			'iM' : edu.system.iM,
            'strId': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strMaDanhMuc': edu.util.getValById("txtMaHamExport"),
            'strTenDanhMuc': edu.util.getValById("txtTenHamExport"),
            'strNhomDanhMuc_Id': edu.util.getValById("dropUngDung_DMEP"),
            'strMoTa': edu.util.getValById("txtSQLSoure"),
            'dThuTu': "",
            'dTrangThai': 985,
            'strPhanCapDanhMuc_Id': "",
            'strChung_TenDanhMuc_Cha_Id': ""
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
                            me.preSave_Func_DMEP();
                        }
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //me.getList_Func_DMEP();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "CMS_DanhMucExport.ThemMoi (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: "CMS_DanhMucExport.ThemMoi (er): " + er,
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
    getList_Func_DMEP: function () {
        var me = this;

        //--Edit
        var obj_list = {
			'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
			'func': 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
			'iM' : edu.system.iM,
            'strPhanCapDanhMuc_Id' : edu.util.getValById(""),
            'strChung_TenDanhMuc_Cha_Id'     : edu.util.getValById(""),
            'strNhomDanhMuc_Id' : edu.util.getValById("dropSearch_UngDung_DMEP"),
            'strTuKhoa'     : edu.util.getValById("txtSearch_TuKhoa_DMEP"),
            'pageIndex'     : 1,
            'pageSize': 1000000,
            'dTrangThai': 985,
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
                    me.dtDanhMucExport = dtResult;
                    me.loadToTree_DMTB(dtResult, iPager);
                    if (!edu.util.checkValue(me.dtUngDung)) {
                        me.getList_UngDung();
                    }
                    
                }
                else {
                    edu.system.alert("CMS_DanhMucExport.LayDanhSachHam (er): " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucExport.LayDanhSachHam (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetai_Func_DMEP: function (selectId) {
        var me = this;
        for (var i = 0; i < me.dtDanhMucExport.length; i++) {
            if (selectId == me.dtDanhMucExport[i].ID) {
                me.viewForm_Func(me.dtDanhMucExport[i]);
            }
        }
    },
    delete_Func_DMEP: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
			'action': 'CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP',
			'func': 'pkg_chung_danhmuc.XoaDanhMuc',
			'iM' : edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'dTrangThai': 985,
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
                    me.getList_Func_DMEP();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucExport.Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucExport.Xoa: " + JSON.stringify(er),
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
    preSave_Func_DMEP: function () {
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
            me.getMauFileExport(edu.util.getValById("txtMaHamExport"));
        }, i * 300);

        function save(arrTemp, itime) {
            setTimeout(function () {
                arrTemp = arrTemp.replace(/ /g, '').split(',');
                me.save_Param({
                    'strMa': arrTemp[0],
                    'strTen': "",
                    'strQuanHeCha_Id': "",
                    'strChung_TenDanhMuc_Id': me.strFunc_Id,
                    'dHeSo1': "",
                    'dHeSo2': arrTemp[3],
                    'dHeSo3': arrTemp[4],
                    'strThongTin1': arrTemp[1],
                    'strThongTin2': arrTemp[2],
                    'strThongTin3': strpackage + "." + strFuncs,
                    'strThongTin4': "",
                    'strThongTin5': "",
                    'strThongTin6': "",
                    'strThongTin7': "",
                    'strThongTin8': "",
                    'strMoTa': edu.util.getValById("txtTenHamExport"),
                    'strId': "",
                    'dTrangThai': 985,
                    'strNguoiThucHien_Id': edu.system.userId,
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
            node += '<li class="btnEvent jstree-open" id="' + data[i].ID + '" title="' + data[i].MADANHMUC + '">' + edu.util.splitString(data[i].TENDANHMUC, 20) + '<b style="display: none"><p class="fa fa-edit btnEdit_Func" style="margin-left: 10px"></p><p class="fa fa-download btnDownload_Func" style="margin-left: 10px"></p><p class="fa fa-remove btnDelete_Func" style="margin-left: 10px"></p></b>';
            node += '</li>';
        }
        node += '</ul>';
        $('#zone_danhmuctenbang_DMEP').html(node);
        configTreejs();
        //2. Action
        $('#zone_danhmuctenbang_DMEP').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            //var strNameNode_full = data.node.li_attr.title;
            //
            //$("#DropDuLieuCha_Search").val("").trigger("change");
            me.strFunc_Id = strNameNode;
            me.getList_Param();
        });

        function configTreejs() {
            //1. check
            $('#zone_danhmuctenbang_DMEP').jstree();//default user
            $('#zone_danhmuctenbang_DMEP').jstree(true).refresh();
            $('#zone_danhmuctenbang_DMEP').one("refresh.jstree").jstree(true).refresh();
        }
    },
    viewForm_Func: function (data) {
        var me = this;
        //call popup --Edit
        me.popupFunc();
        //view data --Edit
        me.strFunc_Id = data.ID;
        edu.util.viewValById("dropUngDung_DMEP", data.NHOMDANHMUC_ID);
        edu.util.viewValById("txtTenHamExport", data.TENDANHMUC);
        edu.util.viewValById("txtMaHamExport", data.MADANHMUC);
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
                'dHeSo1': edu.util.getValById("txtKeyChinh"),
                'dHeSo2': edu.util.getValById("txtKieuDuLieu"),
                'dHeSo3': edu.util.getValById("txtKieuDauVao"),
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
                'dTrangThai': 985,
                'strNguoiThucHien_Id': edu.system.userId,
            };
        }

        
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
            action: 'CMS_DanhMucExport/ThemMoiThamSo',
            
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
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
            'strQUANHECHA_Id': edu.util.getValById('dropAAAA'),
            'dTrangThai': 985,
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
                    edu.system.alert("CMS_DanhMucExport.LayDanhSachHam (er): " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucExport.LayDanhSachHam (er): " + JSON.stringify(er), "w");
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
    delete_Param_DMEP: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_DanhMucDuLieu/Xoa',
            'strId': Ids,
            'dTrangThai': 985,
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
                        content: "CMS_DanhMucExport/XoaThamSo: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucExport/XoaThamSo: " + JSON.stringify(er),
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
        var me = main_doc.DanhMucExport;
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
        var me = main_doc.DanhMucExport;
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
            renderPlace: ["dropSearch_UngDung_DMEP", "dropUngDung_DMEP"],
            type: "",
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: Generating html on interface DanhMucExport
    --ULR: Modules
    -------------------------------------------*/
    genTable_Param: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_DMEP",
            aaData: data,
            colPos: {
                center: [0, 4, 5],
                fix: [0, 4, 5]
            },
            aoColumns: [{
                "mDataProp": "TEN"
            }, {
                "mDataProp": "MA"
            }, {
                "mDataProp": "THONGTIN2"
            }, {
                "mDataProp": "HESO2"
            },
            {
                "mDataProp": "HESO3"
            }
                , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="btn btn-default btn-circle color-active ' + me.objHTML_DMEP.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
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
    getMauFileExport: function (strMaDanhMuc) {
        location.href = edu.system.rootPathReport + "/Modules/Common/ExportDataInFunction.aspx?Ma=" + strMaDanhMuc;
    }
};