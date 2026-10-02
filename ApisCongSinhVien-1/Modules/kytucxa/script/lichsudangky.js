/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 11/05/2019
----------------------------------------------*/
function LichSuDangKy() { };
LichSuDangKy.prototype = {
    dtToaNha: [],
    dtPhong: [],
    dtPhong_DaDangKy: [],

    init: function () {
        var me = main_doc.LichSuDangKy;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_toanha();
        });
        $("#zoneBox_ToaNha").delegate(".btnView", "click", function () {
            var strId = this.id;
            strToaNha_Id = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strToaNha_Id)) {
                me.toggle_phong();
                edu.util.objGetDataInData(strToaNha_Id, me.dtToaNha, "KTX_TOANHA_ID", me.getList_PhongDangKy);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Action: DangKy phong
        -------------------------------------------*/
        $("#zoneDangKy_Phong").delegate(".box-room", "mouseenter", function () {
            var strPhong_Ma = this.id;
            $("#view_phong" + strPhong_Ma).addClass("hide");
            $("#select_phong" + strPhong_Ma).removeClass("hide");
        });
        $("#zoneDangKy_Phong").delegate(".box-room", "mouseleave", function () {
            var strPhong_Ma = this.id;
            $("#view_phong" + strPhong_Ma).removeClass("hide");
            $("#select_phong" + strPhong_Ma).addClass("hide");
        });
        $("#zoneDangKy_Phong").delegate(".btnRegister", "click", function () {
            var strId = this.id;
            strPhong_Ma = edu.util.cutPrefixId(/register/g, strId);
            if (edu.util.checkValue(strPhong_Ma)) {
                edu.util.objGetDataInData(strPhong_Ma, me.dtPhong, "KTX_PHONG_MA", me.confirm_Register);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Action: Huy phong
        -------------------------------------------*/
        $("#zoneBox_PhongDaDangKy").delegate(".box-room", "mouseenter", function () {
            var strPhong_Ma = this.id;
            $("#registered_phong" + strPhong_Ma).addClass("hide");
            $("#cancel_phong" + strPhong_Ma).removeClass("hide");
        });
        $("#zoneBox_PhongDaDangKy").delegate(".box-room", "mouseleave", function () {
            var strPhong_Ma = this.id;
            $("#registered_phong" + strPhong_Ma).removeClass("hide");
            $("#cancel_phong" + strPhong_Ma).addClass("hide");
        });
        $("#tblPhongDaDangKy").delegate(".btnCancel", "click", function () {
            var strId = this.id;
            strPhong_Ma = edu.util.cutPrefixId(/cancel/g, strId);

            if (edu.util.checkValue(strPhong_Ma)) {
                edu.util.objGetDataInData(strPhong_Ma, me.dtPhong_DaDangKy, "KTX_PHONG_MA", me.confirm_Cancel);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_toanha();

        setTimeout(function () {
            me.getList_ToaNhaDangKy();
            setTimeout(function () {
                me.getList_DangKy();
            }, 50);
        }, 50);
    },
    toggle_toanha: function () {
        edu.util.toggle_overide("zone-dangky", "zone_dangky_toanha");
    },
    toggle_phong: function () {
        edu.util.toggle_overide("zone-dangky", "zone_dangky_phong");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB DangKy
    -------------------------------------------*/
    save_DangKy: function (strPhong_Id) {
        var me = main_doc.LichSuDangKy;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_DangKyPhong/ThemMoi',
            

            'strId': '',
            'strKTX_KeHoachDangKy_Id': "",
            'strKTX_Phong_Id': strPhong_Id,
            'strKTX_DoiTuongOKyTucXa_Id': edu.system.userId,
            'strNgayVao': edu.util.dateToday(),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Đăng ký thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DangKy();
                }
                else {
                    edu.system.alert("KTX_DangKyPhong/ThemMoi: " + data.Message, "w");
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
    getList_DangKy: function () {
        var me = main_doc.LichSuDangKy;
        //--Edit
        var obj_list = {
            'action': 'KTX_DangKyPhong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_KeHoachDangKy_Id': "",
            'strKTX_Phong_Id': "",
            'strKTX_DoiTuongOKyTucXa_Id': edu.system.userId,
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
                        me.dtPhong_DaDangKy = dtResult;
                    }
                    me.genTable_DangKy(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_DangKyPhong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_DangKyPhong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_DangKy: function (Ids) {
        var me = main_doc.LichSuDangKy;
        //--Edit
        var obj_delete = {
            'action': 'KTX_DangKyPhong/Xoa',
            
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
                        content: "Hủy phòng thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DangKy();
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
	--Discription: [1]  GenHTML ==> DangKy
    --Author: 
	-------------------------------------------*/
    viewForm_DangKy: function (data) {
        var me = main_doc.LichSuDangKy;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropDangKy_KhoanThu", data.DangKy_ID);
        edu.util.viewValById("txtDangKy_NgayApDung", data.NAMPHONGDangKy);
        edu.util.viewValById("dropDangKy_DonViTinh", data.NOIPHONGDangKy);
        edu.util.viewValById("txtDangKy_DonGia", data.THUTU);
        edu.util.viewValById("dropDangKy_LuyKe", data.MOTA);
    },
    genTable_DangKy: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDangKy_PhongDaDangKy", iPager);
        var iTinhTrang = "";
        var jsonForm = {
            strTable_Id: "tblPhongDaDangKy",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DangKy.getList_DangKy()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            //bHiddenOrder: true,
            colPos: {
                left: [],
                right: [],
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_PHONG_MA"
                }
                , {
                    "mRender": function (nRow, aData) {
                        iTinhTrang = "";
                        return iTinhTrang;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> ToaNhaPhanCongDangKy
    --Author: 
	-------------------------------------------*/
    getList_ToaNhaDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_PhanCongToaNhaDangKy/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_KeHoachDangKy_Id': "",
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
                    me.dtToaNha = dtResult;
                    me.genBox_ToaNhaDangKy(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genBox_ToaNhaDangKy: function (data, iPager) {
        var me = this;
        var html = '';
        var strToaNha_Id = "";
        var strToaNha_Ten = "";
        var iToaNha_SoPhong = "";

        $("#zoneBox_ToaNha").html(html);
        //
        for (var i = 0; i < data.length; i++) {
            strToaNha_Id = data[i].KTX_TOANHA_ID;
            strToaNha_Ten = data[i].KTX_TOANHA_TEN;
            iToaNha_SoPhong = data[i].SOPHONG;

            html += '<div class="col-sm-3 col-xs-6">';
            html += '<div class="small-box">';
            html += '<div class="inner">';
            html += '<h4>' + strToaNha_Ten + '</h4>';
            html += '<p>Số phòng: ' + iToaNha_SoPhong + '</p>';
            html += '</div>';
            html += '<div class="icon">';
            html += '<i class="fa fa-building cl-rosybrown"></i>';
            html += '</div>';
            html += '<div class="small-box-footer">';
            html += '<a id="view_' + strToaNha_Id + '" class="btnView cl-active poiter">Xem phòng</a>';
            html += '</div>';
            html += '</div>';
            html += '</div >';
        }
        //
        $("#zoneBox_ToaNha").html(html);
    },
    /*------------------------------------------
	--Discription: [2]  AcessDB and GenHTML ==> PhanCongPhongDangKy
    --Author: 
	-------------------------------------------*/
    getList_PhongDangKy: function (dtToaNha) {
        var me = main_doc.LichSuDangKy;

        var strToaNha_Id = dtToaNha[0].KTX_TOANHA_ID;
        var strToaNha_Tang = dtToaNha[0].SOTANGCUATOA;
        //--Edit
        var obj_list = {
            'action': 'KTX_PhanCongPhongDangKy/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_KeHoachDangKy_Id': "",
            'strKTX_ToaNha_Id': strToaNha_Id,
            'strKTX_Phong_Id': "",
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
                    me.dtPhong = dtResult;
                    me.genBox_PhongDangKy(strToaNha_Tang, dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    confirm_Register: function (data) {
        var me = main_doc.LichSuDangKy;
        var strPhong_Ma = data[0].KTX_PHONG_MA;
        var strPhong_Id = data[0].KTX_PHONG_ID;
        edu.system.confirm('Bạn có chắc chắn muốn đăng ký phòng <i class="cl-danger">' + strPhong_Ma + '</i> không?', "q");
        $("#btnYes").click(function (e) {
            me.save_DangKy(strPhong_Id);
        });
    },
    confirm_Cancel: function (data) {
        var me = main_doc.LichSuDangKy;
        var strPhongDaDangKy_Id = data[0].ID;
        edu.system.confirm('Bạn có chắc chắn muốn hủy phòng không?', "q");
        $("#btnYes").click(function (e) {
            me.delete_DangKy(strPhongDaDangKy_Id);
        });
    },
    genBox_PhongDangKy: function (strSoTang, dtPhong, iSoPhong) {
        var me = this;
        var html = '';
        var html_total = '';
        $("#lblDangKy_Phong_Tong").html(iSoPhong);
        $("#zoneDangKy_Phong").html(html);
        //gen
        for (var f = 1; f <= strSoTang; f++) {
            html = '';
            html += '<div class="row">';

            html += '<div class="pull-left box-floor">';
            html += '<a class="poiter" >';
            html += '<div class="floor">';
            html += '<span>Tầng ' + f + '</span>';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            for (var r = 0; r < dtPhong.length; r++) {
                if (dtPhong[r].TANGTHU_TEN == f) {
                    html += '<div id="' + dtPhong[r].KTX_PHONG_MA + '" class="pull-left box-room">';

                    html += '<a id="view_phong' + dtPhong[r].KTX_PHONG_MA + '" class="poiter">';
                    html += '<div class="room bg-default">';
                    html += '<i class="fa fa-road"> ' + dtPhong[r].KTX_PHONG_TEN + '</i><br />';
                    html += '<i class="fa fa-street-view"> ' + 1 + '</i>';
                    html += '</div>';
                    html += '</a>';

                    html += '<a id="select_phong' + dtPhong[r].KTX_PHONG_MA + '" class="poiter hide">';
                    html += '<div class="room bg-default">';
                    html += '<span id="register' + dtPhong[r].KTX_PHONG_MA + '" class="btnRegister"><i><u class="cl-lightcoral">Đăng ký</u></i></span><br />';
                    html += '<i class="fa fa-street-view"> ' + 1 + '</i>';
                    html += '</div>';
                    html += '</a>';

                    html += '</div>';
                }
            }
            html += '</div>';
            html_total += html;
        }
        //bind
        $("#zoneDangKy_Phong").html(html_total);
    },
};