/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 14/08/2017
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DanhMucDuLieu() { };
DanhMucDuLieu.prototype = {
    objHTML_DMDL: {},
    arrValid_DMDL: [],
    dtUngDung:[],
    dtDanhMucThuocTinh: [],
    dtDanhMucDuLieu: [],
    strDanhMucDuLieu_Id: '',
    strDanhMucTenBang_Id: '',
    iColspan: 0,
    
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription:  [1] Action DanhMucDuLieu
        --Order: 
        -------------------------------------------*/
        $("#btnAddnew_DMDL").click(function () {
            me.resetPopup();
            me.popup();
        });
        $("#btnSave_DMDL").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DMDL);
            if (valid) {
                me.save_DMDL();
            }
        });

        $("#txtSearch_Keyword_DMTB_DMDL").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_danhmuctenbang_dmdl li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#tbldata_DMDL").delegate('.btnEdit', 'click', function () {
            var selected_id = edu.system.updateModal(this, me.objHTML_DMDL);
            if (edu.util.checkValue(selected_id)) {
                me.strDanhMucDuLieu_Id = selected_id;
                me.getDetail_DMDL(me.strDanhMucDuLieu_Id);
                me.genInputForm_DMDL();
            }
        });
        $("#btnDelete_DMDL").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.objHTML_DMDL);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
                $("#btnYes").click(function (e) {
                    me.delete_DMDL(selected_id);
                });
                return false;
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu trước khi xóa!");
            }
        });
        $("#tbldata_DMDL").delegate('[id$=chkSelectAll]', 'click', function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_DMDL);
        });
        $(document).delegate('.chkSelectOne', 'click', function () {
            edu.util.checkedOne_BgRow(this, me.objHTML_DMDL);
        });
        
        $("#txtKeyWord_DMDL").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tbldata_DMDL tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
    },
    /*----------------------------------------------
    --Discription: Hàm phụ trợ (call popup, call aside, reset popup, gen html, ..)
    ----------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial Page
        -------------------------------------------*/
        me.getList_DMTB();
        me.objHTML_DMDL = {
            table_id: "tbldata_DMDL",
            prefix_id: "chkSelect_DMDL",
            regexp: /chkSelect_DMDL/g,
            btn_save_id: "btnSave_DMDL",
            btn_save_tl: "Lưu"
        };
        me.arrValid_DMDL = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtMa", "THONGTIN1": "EM" },
            { "MA": "txtTen", "THONGTIN1": "EM" }
        ];
    },
    popup: function () {
        $("#btnNotifyModal").remove();
        $('#myModal').modal('show');
    },
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    resetPopup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html("Thêm mới danh mục dữ liệu");
        $("#DropDuLieuCha").val("").trigger("change");
        $("#txtMoTa").val("");
        me.strDanhMucDuLieu_Id = "";
        edu.system.createModal(me.objHTML_DMDL);
    },
    /*------------------------------------------
	--Discription: [1]  ACESS DB ==> DanhMucTenBang
    --Author: nnthuong
	-------------------------------------------*/
    getList_DMTB: function () {
        var me = this;
        var strUngDung_Id = edu.system.appId;
        
        var obj_list = {
            'action': 'CMS_DanhMucTenBang/LayDanhSach',

            'strPhanCap_Id' : "",
            'strChung_TenDanhMuc_Cha_Id'     : "",
            'strNhomDanhMuc_Id': strUngDung_Id,
            'strTuKhoa':    "",
            'pageIndex'     : 1,
            'pageSize'      : 100000,
            'dTrangThai'    : 1
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
                    }
                    me.loadToTree_DMTB(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_DanhMucTenBang/LayDanhSach',
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2]  ACESS DB ==> DanhMucThuocTinh
    --Author: nnthuong
	-------------------------------------------*/
    getList_DMTT: function (strId) {
        var me = this;
        var strDanhMucTenBang_Id = strId;
        var strTuKhoa = "";
        var iTrangThai = 1;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.dtDanhMucThuocTinh = dtResult;
                        me.genTheadTable_DMTT(dtResult);
                    }
                    else {
                        $("#main_right").hide();
                        $("#lbThongBao").html('Bảng chưa được khai báo tham số thuộc tính!');
                        $("#tbldata_DMDL tbody").html("");
                        $("#tbldata_DMDL tbody").append("<tr><td colspan='" + me.iColspan + "' style='text-align:center'>Không tìm thấy dữ liệu!</td></tr>");
                    }
                }
                else {
                    edu.system.alert("CMS_DanhMucThuocTinh.LayDanhSach: " + data.Message);
                    
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucThuocTinh.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            async: false,
            action: 'CMS_DanhMucThuocTinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': strTuKhoa,
                'strCHUNG_TENDANHMUC_Id': strDanhMucTenBang_Id,
                'pageIndex': 1,
                'pageSize': 100,
                'dTrangThai': iTrangThai
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [3]  ACESS DB ==> DanhMucDuLieu
    --Author: nnthuong
	-------------------------------------------*/
    save_DMDL: function () {
        var me = this;
        var strMa = "";
        var strTen = "";
        var strCha_Id = "";
        var strDanhMucTenBang_Id = me.strDanhMucTenBang_Id;
        var dHeSo1 = 0;
        var dHeSo2 = 0;
        var dHeSo3 = 0;
        var strThongTin1 = "";
        var strThongTin2 = "";
        var strThongTin3 = "";
        var strThongTin4 = "";
        var strThongTin5 = "";
        var strThongTin6 = "";
        var strMoTa = "";
        var strId = "";
        var iTrangThai = 1;
        var obj = {};

        
        //1. get val
        for (var i = 0; i < me.dtDanhMucThuocTinh.length; i++) {
            switch (me.dtDanhMucThuocTinh[i].TENTRUONGDULIEU) {
                case "Ten":
                    strTen = edu.util.getValById("txtTen");
                    break;
                case "Ma":
                    strMa = edu.util.getValById("txtMa");
                    break;
                case "HeSo1":
                    dHeSo1 = edu.util.returnZero(edu.util.getValById("txtHeSo1"));
                    break;
                case "HeSo2":
                    dHeSo2 = edu.util.returnZero(edu.util.getValById("txtHeSo2"));
                    break;
                case "HeSo3":
                    dHeSo3 = edu.util.returnZero(edu.util.getValById("txtHeSo3"));
                    break;
                case "ThongTin1":
                    strThongTin1 = edu.util.getValById("txtThongTin1");
                    break;
                case "ThongTin2":
                    strThongTin2 = edu.util.getValById("txtThongTin2");
                    break;
                case "ThongTin3":
                    strThongTin3 = edu.util.getValById("txtThongTin3");
                    break;
                case "ThongTin4":
                    strThongTin4 = edu.util.getValById("txtThongTin4");
                    break;
                case "ThongTin5":
                    strThongTin5 = edu.util.getValById("txtThongTin5");
                    break;
                case "ThongTin6":
                    strThongTin6 = edu.util.getValById("txtThongTin6");
                    break;
                default:
            }
        }
        strMoTa = edu.util.getValById("txtMoTa");
        strTenDanhMuc_Id = me.strDanhMucTenBang_Id;
        strCha_Id = edu.util.getValById("DropDuLieuCha");

        if (edu.util.checkValue(me.strDanhMucDuLieu_Id)) {
            strId = me.strDanhMucDuLieu_Id;
            iTrangThai = edu.util.getValById("dropTrangThai_DMDL");
        }
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
                    me.getList_DMDL();
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
            action: strId ? 'CMS_DanhMucDuLieu/CapNhat' :'CMS_DanhMucDuLieu/ThemMoi',
            
            contentType: true,
            
            data: {
                'strMa': strMa,
                'strTen': strTen,
                'strChung_TenDanhMuc_Cha_Id': strCha_Id,
                'strCHUNG_TENDANHMUC_Id': strDanhMucTenBang_Id,
                'dHeSo1': dHeSo1,
                'dHeSo2': dHeSo2,
                'dHeSo3': dHeSo3,
                'strThongTin1': strThongTin1,
                'strThongTin2': strThongTin2,
                'strThongTin3': strThongTin3,
                'strThongTin4': strThongTin4,
                'strThongTin5': strThongTin5,
                'strThongTin6': strThongTin6,
                'strMoTa': strMoTa,
                'strId': strId,
                'dTrangThai': 1,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DMDL: function () {
        var me = this;
        var strCha_Id = "";
        var strTuKhoa = "";
        var strDanhMucTenBang_Id = me.strDanhMucTenBang_Id;
        var strTenCotSapXep = "";
        var pageIndex = 1;
        var pageSize = 100000;
        var iTrangThai = 1;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_DMDL(dtResult, iPager);
                    me.dtDanhMucDuLieu = dtResult;
                }
                else {
                    edu.system.alert("CMS_DanhMucDuLieu.LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucDuLieu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_DanhMucDuLieu/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strChung_TenDanhMuc_Cha_Id': strCha_Id,
                'strTuKhoa': strTuKhoa,
                'strCHUNG_TENDANHMUC_Id': strDanhMucTenBang_Id,
                'strTieuChiSapXep': strTenCotSapXep,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'dTrangThai': iTrangThai
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DMDL: function (strDanhMucDuLieu_Id) {
        var me = this;
        var strId = strDanhMucDuLieu_Id;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    if (mlen > 0) {
                        $("#txtTen").val(json[0].TEN);
                        $("#txtMa").val(json[0].MA);
                        $("#txtHeSo1").val(json[0].HESO1);
                        $("#txtHeSo2").val(json[0].HESO2);
                        $("#txtHeSo3").val(json[0].HESO3);
                        $("#txtThongTin1").val(json[0].THONGTIN1);
                        $("#txtThongTin2").val(json[0].THONGTIN2);
                        $("#txtThongTin3").val(json[0].THONGTIN3);
                        $("#txtMoTa").val(json[0].MOTA);
                        $("#DropDuLieuCha").val(json[0].QUANHECHA_ID).trigger("change");
                        me.popup();
                    }
                }
                else {
                    edu.system.alert("CMS_DanhMucDuLieu.LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucDuLieu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_DanhMucDuLieu/LayChiTiet',
            
            contentType: true,
            
            data: {
                'strId': strId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    updateStatus_DMDL: function (Ids, TrangThai) {
        var me = this;
        var strIds = Ids;
        var iTrangThai = TrangThai;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#tbldataKemTheo").html("<p style='color:green'>Bạn đã xóa dữ vào liệu thùng rác! <i class='fa fa-trash-o fa-customer'></i></p>");
                    $("#btnYes").hide();
                    $("#tbldata_DMDL tbody").html("");
                    me.loadDatasysDanhMucDuLieu();
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: 'POST',
            action: 'CMS_DanhMucDuLieu/CapNhatTrangThai',
            
            contentType: true,
            
            data: JSON.stringify({
                'strIds': strIds,
                'dTrangThai': iTrangThai
            }),
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMDL: function (Ids) {
        var me = this;
        var strIds = Ids;
        var obj = {};

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DMDL();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucDuLieu.Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucDuLieu.Xoa: " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: 'CMS_DanhMucDuLieu/Xoa',
            
            contentType: true,
            
            data: {
                'strId': strIds,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1] Gen HTML ==> DanhMucTenBang
	--Author: nnthuong
	-------------------------------------------*/
    loadToTree_DMTB: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUNG_TENDANHMUC_CHA_ID",
                name: "TENDANHMUC",
                code: ""
            },
            renderPlaces: ["zone_danhmuctenbang_dmdl"]
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_danhmuctenbang_dmdl').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            //
            $("#DropDuLieuCha_Search").val("").trigger("change");
            me.strDanhMucTenBang_Id = strNameNode;
            me.getList_DMTT(me.strDanhMucTenBang_Id);
            //----------------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //---------------------------------------------------------------------------------------------------------
        });
    },
    /*------------------------------------------
	--Discription: [2] Gen HTML ==> DanhMucThuocTinh
	--Author: nnthuong
	-------------------------------------------*/
    genTheadTable_DMTT: function (dtResult) {
        var me = this;

        $("#tbldata_DMDL thead").html('');
        var tHead = "";
        var strMoTa = "";
        var strTenTruongDuLieu = "";
        me.iColspan = 2;//default for edit and check column
        /*III. processing*/
        tHead += "<tr>";
        tHead += "<th class='td-center td-fixed'>Stt</th>";
        for (var i = 0; i < dtResult.length; i++) {
            strMoTa = edu.util.returnEmpty(dtResult[i].MOTA);
            strTenTruongDuLieu = edu.util.returnEmpty(dtResult[i].TENTRUONGDULIEU);
            if (!edu.util.checkValue(strMoTa)) {
                strMoTa = strTenTruongDuLieu;
            }
            tHead += me.getFieldName_DMTT(strTenTruongDuLieu, strMoTa);

            me.iColspan += i;
        }
        tHead += "<th class='td-center td-fixed'>Sửa</th>";
        tHead += "<th class='td-center td-fixed'><input type='checkbox' name='chkSelectAll' id='chkSelectAll' /></th>";
        tHead += "</tr>";
        /*3. Bind to table tbldata_DMDL*/
        $("#tbldata_DMDL thead").append(tHead);
        /*4. Reset thead row*/
        tHead = "";
        me.getList_DMDL();
        me.genInputForm_DMDL();
    },
    getFieldName_DMTT: function (strTruongDuLieu, strMoTa) {
        var createTheadRow = "";

        switch (strTruongDuLieu) {
            case "Ten":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "Ma":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "HeSo1":
                createTheadRow = "<th class='td-center'>" + strMoTa + "</th>";
                break;
            case "HeSo2":
                createTheadRow = "<th class='td-center'>" + strMoTa + "</th>";
                break;
            case "HeSo3":
                createTheadRow = "<th class='td-center'>" + strMoTa + "</th>";
                break;
            case "ThongTin1":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "ThongTin2":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "ThongTin3":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "ThongTin4":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "ThongTin5":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            case "ThongTin6":
                createTheadRow = "<th class='td-left'>" + strMoTa + "</th>";
                break;
            default:
        }
        return createTheadRow;
    },
    /*------------------------------------------
	--Discription: [3] Gen HTML ==> DanhMucDuLieu
	--Author: nnthuong
	-------------------------------------------*/
    genInputForm_DMDL: function () {
        var me = this;
        var modalBody = "";
        var strMoTa = "";
        var strMa = "";
        $("#modal_body").html("");
        for (var i = 0; i < me.dtDanhMucThuocTinh.length; i++) {
            strMoTa = edu.util.returnEmpty(me.dtDanhMucThuocTinh[i].MOTA);
            if (!edu.util.checkValue(strMoTa)) {
                strMoTa = edu.util.returnEmpty(me.dtDanhMucThuocTinh[i].TENTRUONGDULIEU);
            }
            switch (me.dtDanhMucThuocTinh[i].TENTRUONGDULIEU) {
                case "Ten":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + " (*)</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtTen' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "Ma":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + " (*)</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtMa' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "HeSo1":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtHeSo1' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "HeSo2":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtHeSo2' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "HeSo3":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtHeSo3' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "ThongTin1":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtThongTin1' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "ThongTin2":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtThongTin2' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "ThongTin3":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtThongTin3' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "ThongTin4":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtThongTin4' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "ThongTin5":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtThongTin5' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                case "ThongTin6":
                    modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>" + strMoTa + "</label></div>";
                    modalBody += "<div style='width:80%; float:left'><input type='text' id='txtThongTin6' class='form-control'/></div></div>";
                    modalBody += "<div class='clear'></div>";
                    break;
                default:
            }
        }
        modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>Mô tả</label></div>";
        modalBody += "<div style='width:80%; float:left'><input type='text' id='txtMoTa' class='form-control'/></div></div>";
        modalBody += "<div class='clear'></div>";
        modalBody += "<div style='width:100%'><div style='width:20%; float:left'><label style='font-weight:normal'>Dữ liệu cha</label></div>";
        modalBody += "<div style='width:80%; float:left'><select id='DropDuLieuCha' class='select-opt'></select></div>";
        modalBody += "<div class='clear'></div>";
        $("#modal_body").append(modalBody);
        
        me.genCombo_DMDL();
    },
    genTable_DMDL: function (data, iPager) {
        var me = this;
        
        /*II. variable temp*/
        $("#tbldata_DMDL tbody").html('');
        var tBody = "";
        var iStt = 0;
        var strId = "";
        var strMa = "";
        var strTen = "";
        var strHeSo1 = 0;
        var strHeSo2 = 0;
        var strHeSo3 = 0;
        var strThongTin1 = "";
        var strThongTin2 = "";
        var strThongTin3 = "";
        var strThongTin4 = "";
        var strThongTin5 = "";
        var strThongTin6 = "";
        for (var i = 0; i < data.length; i++) {
            /*1. Xử lý nghiệp vụ*/
            iStt = (i + 1);
            strId = data[i].ID;
            strMa = edu.util.returnEmpty(data[i].MA);
            strTen = edu.util.returnEmpty(data[i].TEN);
            strHeSo1 = edu.util.returnZero(data[i].HESO1);
            strHeSo2 = edu.util.returnZero(data[i].HESO2);
            strHeSo3 = edu.util.returnZero(data[i].HESO3);
            strThongTin1 = edu.util.returnEmpty(data[i].THONGTIN1);
            strThongTin2 = edu.util.returnEmpty(data[i].THONGTIN2);
            strThongTin3 = edu.util.returnEmpty(data[i].THONGTIN3);
            strThongTin4 = edu.util.returnEmpty(data[i].THONGTIN4);
            strThongTin5 = edu.util.returnEmpty(data[i].THONGTIN5);
            strThongTin6 = edu.util.returnEmpty(data[i].THONGTIN6);
            /*2. Create rows to fill data table*/
            tBody += "<tr id='" + strId + "'>";
            tBody += "<td class='td-center td-fixed'>" + iStt + "</td>";

            for (var j = 0; j < me.dtDanhMucThuocTinh.length; j++) {

                switch (me.dtDanhMucThuocTinh[j].TENTRUONGDULIEU) {
                    case "Ten":
                        tBody += "<td class='td-left'>" + strTen + "</td>";
                        break;
                    case "Ma":
                        tBody += "<td class='td-left'>" + strMa + "</td>";
                        break;
                    case "HeSo1":
                        tBody += "<td class='td-center'>" + strHeSo1 + "</td>";
                        break;
                    case "HeSo2":
                        tBody += "<td class='td-center'>" + strHeSo2 + "</a></td>";
                        break;
                    case "HeSo3":
                        tBody += "<td class='td-center'>" + strHeSo3 + "</a></td>";
                        break;
                    case "ThongTin1":
                        tBody += "<td class='td-left'>" + strThongTin1 + "</a></td>";
                        break;
                    case "ThongTin2":
                        tBody += "<td class='td-left'>" + strThongTin2 + "</a></td>";
                        break;
                    case "ThongTin3":
                        tBody += "<td class='td-left'>" + strThongTin3 + "</a></td>";
                        break;
                    case "ThongTin4":
                        tBody += "<td class='td-left'>" + strThongTin4 + "</a></td>";
                        break;
                    case "ThongTin5":
                        tBody += "<td class='td-left'>" + strThongTin5 + "</a></td>";
                        break;
                    case "ThongTin6":
                        tBody += "<td class='td-left'>" + strThongTin6 + "</a></td>";
                        break;
                    default:
                }
            }
            tBody += "<td class='td-center td-fixed'><a class='btn btn-default btn-circle color-active btnEdit' id='" + strId + "' title='Chỉnh sửa'><i class='fa fa-edit fa-customer'></i></a></td>";
            tBody += "<td class='td-center td-fixed'><input type='checkbox' id='chkSelect_DMDL" + strId + "' name='chkSelect_DMDL" + strId + "' class='chkSelectOne'></td>";
            tBody += "</tr>";
            /*3. Bind to table tbldata_DMDL*/
            $("#tbldata_DMDL tbody").append(tBody);
            /*4. Reset tbody row*/
            tBody = "";
        }
    },
    genCombo_DMDL: function () {
        var me = this;
        var dropDuLieuCha = $("#DropDuLieuCha");
        var dropDuLieuCha_Search = $("#DropDuLieuCha_Search");
        dropDuLieuCha.html('');
        dropDuLieuCha_Search.html('');

        if (me.dtDanhMucDuLieu.length > 0) {
            var getList = "";
            getList += "<option value=''>-- Chọn dữ liệu cha--</option>";
            for (var i = 0; i < me.dtDanhMucDuLieu.length; i++) {
                getList += "<option value='" + me.dtDanhMucDuLieu[i].ID + "'>" + me.dtDanhMucDuLieu[i].TEN + "</option>";
            }
            dropDuLieuCha.html(getList);
            dropDuLieuCha_Search.html(getList);
        }
        dropDuLieuCha.val('').trigger("change");
        dropDuLieuCha_Search.val('').trigger("change");
    },
};