/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 10/01/2019
----------------------------------------------*/
function ThietBi() { }
ThietBi.prototype = {
    dtToaNha: [],
    strToaNha_Id: '',
    dtPhong: [],
    strPhong_Id: '',
    dtThietBi: [],
    arrValid_ThietBi:[],
    strThietBi_Id: '',
    dtAllPhong: [],

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
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        /*------------------------------------------
        --Discription: [1] Action Phong
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_ThietBi_ToaNha").on("select2:select", function () {
            me.getList_Phong();
            me.getList_Phong_All();
        });
        $("#tblThietBi_Phong").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(strId, "tblThietBi_Phong");
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.strPhong_Id = strId;
                edu.util.viewValById("dropThietBi_Phong", strId);
                me.getList_ThietBi();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThietBi_Phong").delegate(".btnAdd", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/add_/g, strId);
            edu.util.setOne_BgRow(strId, "tblThietBi_Phong");
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.strPhong_Id = strId;
                $("#dropSearch_ThietBi_ToaNha").val(strId).trigger("change");
                me.toggle_input();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#txtSearch_ThietBi_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Phong();
            }
        });
        $(".btnSearch_ThietBi_Phong").click(function () {
            me.getListCombo_Phong();
        });

        $("#tblThietBi_Phong").delegate(".btnAction", "mouseover", function () {
            $("#zoneAction" + this.id).removeClass("hide"); 
        });
        $("#tblThietBi_Phong").delegate(".btnAction", "mouseout", function () {
            $("#zoneAction" + this.id).addClass("hide");
        });
        /*------------------------------------------
        --Discription: [2] Action Phong
        --Order: 
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_input();
            me.genCheck_Phong(me.dtAllPhong);
        });
        $("#btnSave_ThietBi").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_ThietBi);
            if (valid) {
                if (edu.util.checkValue(me.strThietBi_Id)) {
                    me.update_ThietBi();
                }
                else {
                    var arrCheck = edu.extend.getCheckedCheckBoxByClassName("ckbDSPhong_ThietBi");
                    for (var i = 0; i < arrCheck.length; i++) {
                        me.save_ThietBi(arrCheck[i]);
                    }
                }
            }
        });
        $("#main-content-wrapper").delegate(".ckbDSPhong_ThietBi_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSPhong_ThietBi").each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblThietBi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                edu.util.objGetDataInData(strId, me.dtThietBi, "ID", me.viewEdit_ThietBi);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThietBi").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThietBi(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropThietBi_ToaNha_Phong").on("select2:select", function () {
            me.getListCombo_Phong();
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
        me.getList_ToaNha;
        me.getListCombo_Phong();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LTB0, "dropThietBi_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.TTTB, "dropThietBi_TinhTrang");
        me.getList_Phong();
        me.getList_Phong_All();
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_ThietBi = [
            { "MA": "txtThietBi_Ten", "THONGTIN1": "EM" },
            { "MA": "txtThietBi_Ma", "THONGTIN1": "EM" },
            { "MA": "dropThietBi_Phong", "THONGTIN1": "EM" },
            { "MA": "txtThietBi_SoLuong", "THONGTIN1": "EM#IN" },
            { "MA": "dropThietBi_Loai", "THONGTIN1": "EM" },
            { "MA": "dropThietBi_TinhTrang", "THONGTIN1": "EM" }
        ];
    },
    rewrite: function () {
        var me = this;
        me.strThietBi_Id = "";
        edu.util.viewValById("txtThietBi_Ten", "");
        edu.util.viewValById("txtThietBi_Ma", "");
        edu.util.viewValById("dropThietBi_Phong", "");
        edu.util.viewValById("txtThietBi_SoLuong", "");
        edu.util.viewValById("dropThietBi_Loai", "");
        edu.util.viewValById("dropThietBi_TinhTrang", "");
        edu.util.viewValById("txtThietBi_MoTa", "");
        $("#DSPhong_ThietBi").html("");
    },
    reset: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewHTMLById("lblChucNang_Ten", "");
        edu.util.viewHTMLById("lblChucNang_Ma", "");
        edu.util.viewHTMLById("lblChucNang_Icon", "");
        edu.util.viewHTMLById("lblChucNang_ThuTuHienThi", "");
        edu.util.viewHTMLById("lblChucNang_DuongDanHienThi", "");
        edu.util.viewHTMLById("lblChucNang_Cha", "");
        edu.util.viewHTMLById("lblChucNang_DuongDanThuMuc", "");
        edu.util.viewHTMLById("lblChucNang_UngDung", "");
        edu.util.viewHTMLById("lblChucNang_PhamViTruyCap", "");
        edu.util.viewHTMLById("lblChucNang_MoTa", "");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus-thietbi", "zone_detail_thietbi");
    },
    toggle_input: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus-thietbi", "zone_input_thietbi");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-thietbi", "zone_list_thietbi");
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
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_ThietBi_ToaNha"),
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
    getList_Phong_All: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_ThietBi_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000

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
                    me.dtAllPhong = dtResult;
                    //me.genCheck_Phong(dtResult, iPager);
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
            renderPlace: ["dropSearch_ThietBi_ToaNha", "dropThietBi_ToaNha_Phong"],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_Phong: function (data, iPager) {
        var me = this;
        var html = "";

        $("#lblThietBi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThietBi_Phong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThietBi.getList_Phong()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.KTX_TOANHA_TEN) + " - " + edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.LOAIPHONG_TEN) + " - " + edu.util.returnEmpty(aData.TINHCHAT_TEN) + "</span>";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
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
            renderPlace: ["dropThietBi_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    /*----------------------------------------------
    --Discription: [2] AccessDB ThietBi
    --API:  
    ----------------------------------------------*/
    getList_ThietBi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_TrangThietBi/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_Phong_Id': me.strPhong_Id,
            'strLoaiTrangThietBi_Id': "",
            'strTinhTrangSuDung_Id': '',
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000

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
                    me.genTable_ThietBi(dtResult, iPager);
                    me.dtThietBi = dtResult;
                }
                else {
                    edu.system.alert("KTX_TrangThietBi/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_TrangThietBi/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_ThietBi: function (strPhong_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_TrangThietBi/ThemMoi',
            

            'strId'                 : "",
            'strTen': edu.util.getValById("txtThietBi_Ten"),
            'strMa': edu.util.getValById("txtThietBi_Ma"),
            'strKTX_Phong_Id': strPhong_Id,
            'strLoaiTrangThietBi_Id': edu.util.getValById("dropThietBi_Loai"),
            'strTinhTrangSuDung_Id' : edu.util.getValById("dropThietBi_TinhTrang"),
            'strMoTa'               : edu.util.getValById("txtThietBi_MoTa"),
            'dSoLuong'              : edu.util.getValById("txtThietBi_SoLuong"),
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_ThietBi();
                }
                else {
                    edu.system.alert("KTX_TrangThietBi/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_TrangThietBi/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_ThietBi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_TrangThietBi/CapNhat',
            

            'strId': me.strThietBi_Id,
            'strTen': edu.util.getValById("txtThietBi_Ten"),
            'strMa': edu.util.getValById("txtThietBi_Ma"),
            'strKTX_Phong_Id': edu.util.getValById("dropThietBi_Phong"),
            'strLoaiTrangThietBi_Id': edu.util.getValById("dropThietBi_Loai"),
            'strTinhTrangSuDung_Id': edu.util.getValById("dropThietBi_TinhTrang"),
            'strMoTa': edu.util.getValById("txtThietBi_MoTa"),
            'dSoLuong': edu.util.getValById("txtThietBi_SoLuong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Cập nhật thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_ThietBi();
                }
                else {
                    edu.system.alert("KTX_TrangThietBi/CapNhat: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_TrangThietBi/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThietBi: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_TrangThietBi/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#notify_cn").html("Xóa thành công!");
                    me.getList_ThietBi();
                }
                else {
                    $("#notify_cn").html("KTX_TrangThietBi.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_TrangThietBi.Xoa: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    viewEdit_ThietBi: function (data) {
        var me              = main_doc.ThietBi;
        var dtThietBi       = data[0];
        me.strThietBi_Id    = dtThietBi.ID;
        //View - Thong tin
        edu.util.viewValById("txtThietBi_Ten", dtThietBi.TEN);
        edu.util.viewValById("txtThietBi_Ma", dtThietBi.MA);
        edu.util.viewValById("dropThietBi_Phong", dtThietBi.KTX_PHONG_ID);
        edu.util.viewValById("txtThietBi_SoLuong", dtThietBi.SOLUONG);
        edu.util.viewValById("dropThietBi_Loai", dtThietBi.LOAITRANGTHIETBI_ID);
        edu.util.viewValById("dropThietBi_TinhTrang", dtThietBi.TINHTRANGSUDUNG_ID);
        edu.util.viewValById("txtThietBi_MoTa", dtThietBi.MOTA);
        var point = $("#DSPhong_ThietBi #" + dtThietBi.KTX_PHONG_ID);
        point.attr('checked', true);
        point.prop('checked', true);
    },
    genTable_ThietBi: function (data, iPager, strThietBi_Id) {
        var me = this;
        edu.util.viewHTMLById("", iPager);

        var jsonForm = {
            strTable_Id: "tblThietBi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Phong.getList_ThietBi('" + strThietBi_Id + "')",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            //bHiddenOrder: true,
            colPos: {
                left: [1, 2],
                right: [3, 4],
                center: [0, 5, 6],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                }
                , {
                    "mDataProp": "TEN"
                }
                , {
                    "mDataProp": "SOLUONG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strTinhTrang = aData.TINHTRANGSUDUNG_MA;
                        var html = '';
                        if (strTinhTrang == "KTX.TTTB.01") {
                            html = '<span class="label label-success">' + aData.TINHTRANGSUDUNG_TEN + '</span>';
                        }
                        else {
                            html = '<span class="label label-danger">' + edu.util.returnEmpty(aData.TINHTRANGSUDUNG_TEN) + '</span>';
                        }
                        return html;
                    }
                }
                , {
                    "mData": "edit",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btn btn-default color-active btnEdit" id="edit_' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                    }
                }
                , {
                    "mData": "delete",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btn btn-default color-active btnDelete" id="delete_' + aData.ID + '" href="#"><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_ToaNha
    -------------------------------------------*/
    getListCombo_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropThietBi_ToaNha_Phong"),
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
    --Discription: [1] AcessDB GetList_ToaNha
    -------------------------------------------*/
    genCheck_Phong: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-2">';
        row += '<input type="checkbox" style="float: left; margin-right: 5px" class="ckbDSPhong_ThietBi_ALL"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-2">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSPhong_ThietBi" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSPhong_ThietBi").html(row);
        //me.getList_KhoanThu();
    },
};