/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function DienNuoc() { }
DienNuoc.prototype = {
    dtToaNha: [],
    strToaNha_Id: '',
    dtPhong: [],
    strPhong_Id: '',
    dtCongToDien: [],
    strCongToDien_Id: '',
    arrValid_Dien: [],
    dtCongToNuoc: [],
    strCongToNuoc_Id: '',
    arrValid_Nuoc: [],
    strCommon_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        /*------------------------------------------
        --Discription: [0] Action Common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        /*------------------------------------------
        --Discription: [1] Action TimKiem Phong
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_DienNuoc_ToaNha").on("select2:select", function () {
            me.getList_Phong();
        });
        $("#btnThemSoDien").click(function () {
            me.resetPopup_ChotSoDien();
            me.popup_ChotSoDien();
        });
        $("#tblTChotSoDien").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(strId, "tblTChotSoDien");
            if (edu.util.checkValue(strId)) {
                me.rewrite();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#txtSearch_Phong_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Phong();
            }
        });
        $("#btnSearch_DienNuoc_ToaNha").click(function () {
            me.getListCombo_Phong();
        });

        $("#tblDienNuoc_Phong").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.strPhong_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strPhong_Id, "tblDienNuoc_Phong");
            edu.util.toggle_overide("zonecontent", "zone_main");
            me.getList_ChotSoDien();
            me.getList_ChotSoNuoc();
            me.getDetail_Phong(me.strPhong_Id);
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        /*------------------------------------------
        --Discription: [3-4] Action CongToDien/Nuoc
        --Order: 
        -------------------------------------------*/
        $("#btnThemSoNuoc").click(function () {
            me.resetPopup_ChotSoNuoc();
            me.popup_ChotSoNuoc();
        });
        $("#tblChotSoDien").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tblChotSoDien");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_ChotSoDien(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblChotSoDien").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblChotSoDien");
                $("#btnYes").click(function (e) {
                    me.delete_ChotSoDien(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_ChotSoDien").click(function () {
            me.save_ChotSoDien();
        });

        $("#btnSaveRe_ChotSoDien").click(function () {
            me.save_ChotSoDien();
            setTimeout(function () {
                me.resetPopup_ChotSoDien();
            }, 1000);
        });
        $("#tblTChotSoNuoc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tblTChotSoNuoc");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_ChotSoNuoc(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTChotSoNuoc").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblTChotSoNuoc");
                $("#btnYes").click(function (e) {
                    me.delete_ChotSoNuoc(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_ChotSoNuoc").click(function () {
            me.save_ChotSoNuoc();
        });
        $("#btnSaveRe_ChotSoNuoc").click(function () {
            me.save_ChotSoNuoc();
            setTimeout(function () {
                me.resetPopup_ChotSoNuoc();
            }, 1000);
        });
    },
    /*----------------------------------------------
    --Discription: [0] Common
    --API:  
    ----------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        //me.toggle_list();
        //me.toggle_list();
        me.getList_ToaNha();
        me.getList_Phong();
        me.getListCombo_Phong();
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_Dien = [
            { "MA": "dropDien_CongTo", "THONGTIN1": "EM" },
            { "MA": "txtDien_ChiSo", "THONGTIN1": "EM" },
            { "MA": "txtDien_NgayChot", "THONGTIN1": "EM" },
            { "MA": "txtDien_NguoiChot", "THONGTIN1": "EM" }
        ];
        me.arrValid_Nuoc = [
            { "MA": "dropNuoc_CongTo", "THONGTIN1": "EM" },
            { "MA": "txtNuoc_ChiSo", "THONGTIN1": "EM" },
            { "MA": "txtNuoc_NgayChot", "THONGTIN1": "EM" },
            { "MA": "txtNuoc_NguoiChot", "THONGTIN1": "EM" }
        ];
        edu.system.getList_MauImport("zonebtnDN");
    },
    rewriteDien: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewValById("dropDien_CongTo", "");
        edu.util.viewValById("txtDien_ChiSo", "");
        edu.util.viewValById("txtDien_NgayChot", "");
        edu.util.viewValById("txtNuoc_NguoiChot", "");
    },
    rewriteNuoc: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewValById("dropNuoc_CongTo", "");
        edu.util.viewValById("txtNuoc_ChiSo", "");
        edu.util.viewValById("txtNuoc_NgayChot", "");
        edu.util.viewValById("txtNuoc_NguoiChot", "");
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
            'strKTX_ToaNha_Id': "",
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
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_DienNuoc_ToaNha"),
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
                    me.dtPhong = dtResult;
                    me.genTable_Phong(dtResult, iPager);
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
            renderPlace: ["dropSearch_DienNuoc_ToaNha"],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_Phong: function (data, iPager) {
        var me = this;
        var html = "";

        $("#lblDienNuoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDienNuoc_Phong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DienNuoc.getList_Phong()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnDetail"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.KTX_TOANHA_TEN) + " - " + edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.LOAIPHONG_TEN) + " - " + edu.util.returnEmpty(aData.TINHCHAT_TEN) + "</span>";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle " id="view_' + aData.ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    getDetail_Phong: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtPhong, "ID");
        var json = data[0];
        $("#lblPhong").html(edu.util.returnEmpty(json.KTX_TOANHA_TEN) + " - " + edu.util.returnEmpty(json.TEN) + " - " + edu.util.returnEmpty(json.LOAIPHONG_TEN) + " - " + edu.util.returnEmpty(json.TINHCHAT_TEN));
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
            renderPlace: ["dropDienNuoc_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_ToaNha
    -------------------------------------------*/
    getListCombo_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_Phong_TuKhoa"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_DienNuoc_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000,

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
                    me.genCombo_Phong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    
    /*------------------------------------------
    --Discription: [Tab_2] ChotSoDien
    -------------------------------------------*/
    getList_ChotSoDien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_TrangThietBi_ChiSoDien/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_CongToDien_Id': '',
            'strKTX_Phong_Id': me.strPhong_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                me.dtCongToDien = data.Data;
                me.genTable_ChotSoDien(data.Data, data.Pager);
                
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
    save_ChotSoDien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        //var strTuNgay = edu.util.getValById("txtTSBT_TuNgay");
        //var strHomNay = edu.util.dateToday();
        //var check = edu..dateCompautilre(strTuNgay, strHomNay); console.log(check)
        //if (check == 1) {
        //    objNotify = {
        //        content: "Ngày bắt đầu không được lớn hơn ngày hiện tại!",
        //        type: "w"
        //    }
        //    edu.system.alertOnModal(objNotify);
        //    return;
        //}
        
        var obj_save = {
            'action': 'KTX_TrangThietBi_ChiSoDien/ThemMoi',
            

            'strId': '',
            'strNgayLayThongTin': edu.util.getValById("txtDien_NgayChot"),
            'dChiSoDau': edu.util.getValById("txtDien_ChiSoDau"),
            'dChiSoGhiNhan': edu.util.getValById("txtDien_ChiSoChot"),
            'strKTX_CongToDien_Id': me.strPhong_Id,
            'strKTX_Phong_Id': me.strPhong_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'KTX_TrangThietBi_ChiSoDien/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ChotSoDien();
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
    delete_ChotSoDien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_TrangThietBi_ChiSoDien/Xoa',
            
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
                    me.getList_ChotSoDien();
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
    getDetail_ChotSoDien: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtCongToDien, "ID");
        me.editForm_ChotSoDien(data[0]);
    },

    popup_ChotSoDien: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_ChotSoDien");
    },
    resetPopup_ChotSoDien: function () {
        var me = this;
        $("#myModalLabel_ChotSoDien").html('<i class="fa fa-plus"></i> Thêm chốt số điện');
        me.strCommon_Id = "";
        edu.util.resetValById("txtDien_NgayChot");
        edu.util.resetValById("txtDien_ChiSoChot");
        edu.util.resetValById("txtDien_ChiSoDau");
    },
    genTable_ChotSoDien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblChotSoDien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DienNuoc.getList_ChotSoDien()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_CONGTODIEN_MA"
                },
                {
                    "mDataProp": "NGAYLAYTHONGTIN"
                },
                {
                    "mDataProp": "CHISODAU"
                },
                {
                    "mDataProp": "CHISOGHINHAN"
                },
                {
                    "mDataProp": "SODIENSUDUNG"
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
    editForm_ChotSoDien: function (data) {
        var me = this;
        me.popup_ChotSoDien();
        //view data --Edit
        edu.util.viewValById("txtCongToDien_Phong", data.KTX_CONGTODIEN_MA);
        edu.util.viewValById("txtDien_NgayChot", data.NGAYLAYTHONGTIN);
        edu.util.viewValById("txtDien_ChiSoChot", data.CHISOGHINHAN);
        edu.util.viewValById("txtDien_ChiSoDau", data.CHISODAU);
        me.strCongToDien_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [Tab_2] ChotSoNuoc
    -------------------------------------------*/
    getList_ChotSoNuoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_TrangThietBi_ChiSoNuoc/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_CongToNuoc_Id': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
                me.dtCongToNuoc = data.Data;
                me.genTable_ChotSoNuoc(data.Data, data.Pager);
                
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
    save_ChotSoNuoc: function () {
        var me = this;
        var obj_notify = {};
        

        var obj_save = {
            'action': 'KTX_TrangThietBi_ChiSoNuoc/ThemMoi',
            

            'strId': '',
            'strNgayLayThongTin': edu.util.getValById("txtNuoc_NgayChot"),
            'dChiSoGhiNhan': edu.util.getValById("txtNuoc_ChiSoChot"),
            'dChiSoDau': edu.util.getValById("txtNuoc_ChiSoDau"),
            'strKTX_CongToNuoc_Id': me.strPhong_Id,
            'strKTX_Phong_Id': me.strPhong_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'KTX_TrangThietBi_ChiSoNuoc/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ChotSoNuoc();
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
    delete_ChotSoNuoc: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_TrangThietBi_ChiSoNuoc/Xoa',
            
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
                    me.getList_ChotSoNuoc();
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
    getDetail_ChotSoNuoc: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtCongToNuoc, "ID");
        me.editForm_ChotSoNuoc(data[0]);
    },

    popup_ChotSoNuoc: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_ChoSoNuoc");
    },
    resetPopup_ChotSoNuoc: function () {
        var me = this;
        $("#myModalLabel_ChotSoNuoc").html('<i class="fa fa-plus"></i> Thêm chốt số nước');
        me.strCommon_Id = "";
        edu.util.resetValById("txtNuoc_NgayChot");
        edu.util.resetValById("txtNuoc_ChiSoChot");
        edu.util.resetValById("txtDien_ChiSoDau");
    },
    genTable_ChotSoNuoc: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblTChotSoNuoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DienNuoc.getList_ChotSoNuoc()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_CONGTONUOC_MA"
                },
                {
                    "mDataProp": "NGAYLAYTHONGTIN"
                },
                {
                    "mDataProp": "CHISODAU"
                },
                {
                    "mDataProp": "CHISOGHINHAN"
                },
                {
                    "mDataProp": "SONUOCSUDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="edit' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_ChotSoNuoc: function (data) {
        var me = this;
        me.popup_ChotSoNuoc();
        //view data --Edit
        edu.util.viewValById("txtCongToNuoc_Phong", data.KTX_CONGTONUOC_MA);
        edu.util.viewValById("txtNuoc_NgayChot", data.NGAYLAYTHONGTIN);
        edu.util.viewValById("txtNuoc_ChiSoChot", data.CHISOGHINHAN);
        edu.util.viewValById("txtDien_ChiSoDau", data.CHISODAU);
        me.strCongToNuoc_Id = data.ID;
    },
};