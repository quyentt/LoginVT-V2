/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function KhenThuongKyLuat() { };
KhenThuongKyLuat.prototype = {
    strCommon_Id: '',
    dtKhenThuong: [],
    tab_actived: [],
    tab_item_actived: [],
    arrValid_QuyetDinh: [],
    arrValid_KhenThuong: [],
    arrValid_KyLuat: [],
    strQuyetDinh_Id: '',
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
                    case "#tab_4":
                        me.open_Collapse("key_khenthuong");
                        me.open_Collapse("key_kyluat");
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
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        $(".btnCloseQuyetDinh").click(function () {
            edu.util.toggle_overide("zonecontent", "zoneKhenThuong_input");
        });
        $("#btnAddQuyetDinh").click(function () {
            me.rewrite_QuyetDinh();
            me.toggle_form();
        });        
        /*------------------------------------------
        --Discription: [tab_6] Tui ho so
        -------------------------------------------*/
        $('a[href="#tab_4"]').trigger("shown.bs.tab");
        /*------------------------------------------
        --Discription: [tab_5] DaoTao
        -------------------------------------------*/
        $("#btnSaveRe_KhenThuong").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KhenThuong);
            if (valid) {
                me.save_KhenThuong();
                setTimeout(function () {
                    me.resetPopup_KhenThuong();
                }, 1000);
            }
        });
        $("#btnSave_KhenThuong").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KhenThuong);
            if (valid) {
                me.save_KhenThuong();
            }
        });
        $("#tbl_KhenThuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tbl_KhenThuong");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.strQuyetDinh_Id = "";
                me.viewForm_KhenThuong(me.dtKhenThuong.find(e => e.ID === strId));
                //me.getDetail_KhenThuong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_KhenThuong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_KhenThuong");
                $("#btnYes").click(function (e) {
                    me.delete_KhenThuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_KhenThuong").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_KHTT");
                setTimeout(function () {
                    me.getList_KhenThuong();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $("#tbl_KhenThuong").delegate(".btnDownLoad", "click", function () {
            var strFiles = this.name;
            var arrFile = [strFiles];
            if (strFiles.indexOf(',') != -1) {
                arrFile = strFiles.split(',');
            }
            for (var i = 0; i < arrFile.length; i++) {
                console.log(edu.system.rootPathUpload + "/" + arrFile[i]);
                window.open(edu.system.rootPathUpload + "/" + arrFile[i], "_blank")
            }
        });
        /*------------------------------------------
        --Discription: [tab_5] BoiDuong
        -------------------------------------------*/
        $("#btnSaveRe_KyLuat").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KyLuat);
            if (valid) {
                me.save_KyLuat();
                setTimeout(function () {
                    me.resetPopup_KyLuat();
                }, 1000);
            }
        });
        $("#btnSave_KyLuat").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_KyLuat);
            if (valid) {
                me.save_KyLuat();
            }
        });
        $("#tbl_KyLuat").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tbl_KyLuat");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_KyLuat(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_KyLuat").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_KyLuat");
                $("#btnYes").click(function (e) {
                    me.delete_KyLuat(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_KyLuat").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_KYLU");
                setTimeout(function () {
                    me.getList_KyLuat();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $("#tbl_KyLuat").delegate(".btnDownLoad", "click", function () {
            var strFiles = this.name;
            var arrFile = [strFiles];
            if (strFiles.indexOf(',') != -1) {
                arrFile = strFiles.split(',');
            }
            for (var i = 0; i < arrFile.length; i++) {
                console.log(edu.system.rootPathUpload + "/" + arrFile[i]);
                window.open(edu.system.rootPathUpload + "/" + arrFile[i], "_blank")
            }
        });
        $("#btnSave_QuyetDinh").click(function () {
            me.save_QuyetDinh();
        });              
    },
    toggle_notify: function () {
        var me = this;
        edu.util.toggle_overide("zonecontent", "zoneKhenThuong_input");
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropKL_QuyetDinh,dropKT_QuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropTTQD_LoaiQuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.HINHTHUCKHENTHUONG", "dropKT_HinhThuc");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropKT_Cap");
        edu.system.loadToCombo_DanhMucDuLieu("NS.HINHTHUCKYLUAT", "dropKyLuat_HinhThucKyLuat");
        edu.system.uploadFiles(["txtThongTinDinhKem", "txtKL_ThongTinDinhKem"]);
        edu.system.switchLoaiKhac("dropKT_HinhThuc", "txtHinhThucKhenThuong_Khac", true);
        edu.system.switchLoaiKhac("dropKyLuat_HinhThucKyLuat", "txtKL_HinhThucKyLuat", true);
        me.arrValid_QuyetDinh = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTTQD_SoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtTTQD_NgayQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtTTQD_NguoiKyQD", "THONGTIN1": "EM" },
            { "MA": "dropTTQD_LoaiQuyetDinh", "THONGTIN1": "EM" }
        ];
        me.arrValid_KhenThuong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtCoQuanKhenThuong", "THONGTIN1": "EM" },
            { "MA": "txtThanhTichKhenThuong", "THONGTIN1": "EM" },
            { "MA": "dropKT_HinhThuc", "THONGTIN1": "EM" },
            { "MA": "dropKT_Cap", "THONGTIN1": "EM" },
            { "MA": "txtKT_SoQD", "THONGTIN1": "EM" },
            { "MA": "txtKT_NgayQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtKT_NgayQuyetDinh", "THONGTIN1": "EM" },
        ];
        me.arrValid_KyLuat = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKL_CoQuanKyLuat", "THONGTIN1": "EM" },
            { "MA": "txtKL_LyDoKyLuat", "THONGTIN1": "EM" },
            { "MA": "txtKL_SoQD", "THONGTIN1": "EM" },
            { "MA": "txtKL_NgayKyQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "dropKyLuat_HinhThucKyLuat", "THONGTIN1": "EM" }
        ];
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zoneQuyetDinh_input");
        $("#txtTTQD_SoQuyetDinh").focus();
    },
    rewrite_QuyetDinh: function () {
        //reset id
        var me = this;
        me.arrValid_QuyetDinh = [];
        var arrId = ["txtTTQD_SoQuyetDinh", "txtTTQD_NgayQuyetDinh", "txtTTQD_NguoiKyQD", "dropTTQD_LoaiQuyetDinh", "txtTTQD_NgayHieuLuc", "txtTTQD_NgayHetHieuLuc", "txtTTQD_ThongTinQuyetDinh"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtDeTai_FileDinhKem", "");
    },
    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_khenthuong":
                me.resetPopup_KhenThuong();
                me.popup_KhenThuong();
                break;
            case "key_kyluat":
                me.resetPopup_KyLuat();
                me.popup_KyLuat();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_khenthuong":
                me.getList_KhenThuong();
                break;
            case "key_kyluat":
                me.getList_KyLuat();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_5] DaoTao
    -------------------------------------------*/
    getList_KhenThuong: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_KhenThuong/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                me.dtKhenThuong = data.Data;
                if (data.Success) {
                    me.genTable_KhenThuong(data.Data);
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
            fakedb: [],
            fakedb: []
        }, false, false, false, null);
    },
    save_KhenThuong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_QT_KhenThuong/ThemMoi',            


            'strId': '',
            'strSoQuyetDinh': edu.util.getValById("txtKT_SoQD"),
            'strNgayQuyetDinh': edu.util.getValById("txtKT_NgayQuyetDinh"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': edu.util.getValById("txtKT_NgayHieuLuc"),
            //'strNgayHetHieuLuc': edu.util.getValById("txtKT_NgayHetHieuLuc"),
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropKT_QuyetDinh"),
            'iTrangThai': 1,
            'strHinhThucKhenThuong_Id': edu.util.getValById("dropKT_HinhThuc"),
            'strCapKhenThuong_Id': edu.util.getValById("dropKT_Cap"),
            'strThanhTichKhenThuong_Khac': edu.util.getValById("txtThanhTichKhenThuong"),
            'strNgayApDung': edu.util.getValById("txtKT_NgayApDung"),
            'strHinhThucKhenThuong': edu.util.getValById("txtHinhThucKhenThuong_Khac"),
            'strCoQuanKhenThuong': edu.util.getValById("txtCoQuanKhenThuong"),
            'strThongTinDinhKem': "",
            'strNhanSu_ThongTinQD_Id': me.strQuyetDinh_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
            'iThuTu': ""
        };
        if (me.strCommon_Id != "") {
            obj_save.action = 'NS_QT_KhenThuong/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHTT");
                        edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txtThongTinDinhKem", me.strCommon_Id, "NS_Files");
                    }
                    me.getList_KhenThuong();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_KhenThuong: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_KhenThuong/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_KhenThuong(data.Data[0]);
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
    delete_KhenThuong: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_KhenThuong/Xoa',
            
            'strIds': Ids,
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
                        code: "",
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KhenThuong();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w",
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
    popup_KhenThuong: function () {
        $("#zoneKhenThuong_input").slideDown();
    },
    resetPopup_KhenThuong: function () {
        var me = this;
        me.strCommon_Id = "";
        me.me.strQuyetDinh_Id = "";

        edu.util.viewValById("txtNamKhenThuong", "");
        edu.util.viewValById("txtCoQuanKhenThuong", "");
        edu.util.viewValById("dropKT_HinhThuc", "");
        edu.util.viewValById("txtHinhThucKhenThuong_Khac", "");
        edu.util.viewValById("txtThanhTichKhenThuong", "");
        edu.util.viewValById("dropKT_Cap", "");
        edu.util.viewValById("txtKT_SoQD", "");
        edu.util.viewValById("txtKT_NgayQuyetDinh", "");
        edu.util.viewValById("txtKT_NgayQuyetDinh", "");
        edu.util.viewValById("dropKT_QuyetDinh", "");
        edu.util.viewValById("txtKT_NgayApDung", "");
        edu.util.viewValById("txtKT_NgayHieuLuc", "");
        edu.util.viewValById("txtKT_NgayHetHieuLuc", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
        $("#tblKhenThuong_QuyetDinh tbody").html("");
    },
    genTable_KhenThuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_KhenThuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "COQUANKHENTHUONG"
                },
                {
                    "mDataProp": "CAPKHENTHUONG_TEN"
                },
                {
                    "mDataProp": "HINHTHUCKHENTHUONG_TEN"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_SOQD"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYQD"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        //edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KhenThuong: function (data) {
        var me = this;
        me.popup_KhenThuong();
        edu.util.viewValById("txtNamKhenThuong", data.NAMKHENTHUONG);
        edu.util.viewValById("txtCoQuanKhenThuong", data.COQUANKHENTHUONG);
        edu.util.viewValById("dropKT_HinhThuc", data.HINHTHUCKHENTHUONG_ID);
        $('#dropKT_HinhThuc').trigger({ type: 'select2:select' });
        edu.util.viewValById("txtHinhThucKhenThuong_Khac", data.HINHTHUCKHENTHUONG);
        edu.util.viewValById("txtThanhTichKhenThuong", data.THANHTICHKHENTHUONG_KHAC);
        edu.util.viewValById("dropKT_Cap", data.CAPKHENTHUONG_ID);        
        edu.util.viewValById("txtKT_SoQD", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtKT_NgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("dropKT_QuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtKT_NgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtKT_NgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtKT_NgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
        me.strQuyetDinh_Id = data.NHANSU_THONGTINQUYETDINH_ID;
        me.strCommon_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [Tab_5] Boi Duong
    -------------------------------------------*/
    getList_KyLuat: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_KyLuat/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_KyLuat(data.Data);
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
            fakedb: [],
            fakedb: []
        }, false, false, false, null);
    },
    save_KyLuat: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_QT_KyLuat/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayQuyetDinh': edu.util.getValById("txtKL_NgayKyQuyetDinh"),
            'strSoQuyetDinh': edu.util.getValById("txtKL_SoQD"),
            'strNguoiKyQuyetDinh':'',
            'strNgayHieuLuc':'',
            'strThongTinQuyetDinh':'',
            'strLoaiQuyetDinh_Id':'',
            'strNgayHetHieuLuc':'',
            'strLyDo': edu.util.getValById("txtKL_LyDoKyLuat"),
            'strHinhThucKyLuat_Id': edu.util.getValById("dropKyLuat_HinhThucKyLuat"),
            'strHinhThucKyLuat': edu.util.getValById("txtKL_HinhThucKyLuat"),
            'strNamKyLuat': '',
            'strCoQuanKyLuat': edu.util.getValById("txtKL_CoQuanKyLuat"),
            'strThongTinDinhKem': "",
            'strNhanSu_ThongTinQD_Id': '',
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strCommon_Id != "") {
            obj_save.action = 'NS_QT_KyLuat/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KYLU");
                        edu.system.saveFiles("txtKL_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txtKL_ThongTinDinhKem", me.strCommon_Id, "NS_Files");
                    }
                    me.getList_KyLuat();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_KyLuat: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_KyLuat/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_KyLuat(data.Data[0]);
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
    delete_KyLuat: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_KyLuat/Xoa',
            
            'strIds': Ids,
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
                        code: "",
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KyLuat();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w",
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
    popup_KyLuat: function () {
        $("#zoneKyLuat_input").slideDown();
    },
    resetPopup_KyLuat: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("txtKL_CoQuanKyLuat", "");
        edu.util.viewValById("txtKL_NgayKyLuat", "");
        edu.util.viewValById("txtKL_HinhThucKyLuat", "");
        edu.util.viewValById("txtKL_SoQD", "");
        edu.util.viewValById("dropKyLuat_HinhThucKyLuat", "");
        edu.util.viewValById("txtKL_NgayKyQuyetDinh", "");
        edu.util.viewValById("txtKL_LyDoKyLuat", "");
        edu.system.viewFiles("txtKL_ThongTinDinhKem", "");
        $("#myModalLabel_KyLuat").html('<i class="fa fa-plus"></i> Thêm mới quá trình kỷ luật');
    },
    genTable_KyLuat: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_KyLuat",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "COQUANKYLUAT"
                },
                {
                    "mDataProp": "HINHTHUCKYLUAT_TEN"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_SOQD"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYQD"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    viewForm_KyLuat: function (data) {
        var me = this;
        me.popup_KyLuat();
        edu.util.viewValById("txtKL_CoQuanKyLuat", data.COQUANKYLUAT);
        edu.util.viewValById("dropKyLuat_HinhThucKyLuat", data.HINHTHUCKYLUAT_ID);
        $('#dropKyLuat_HinhThucKyLuat').trigger({ type: 'select2:select' });
        edu.util.viewValById("txtKL_HinhThucKyLuat", data.HINHTHUCKYLUAT);
        edu.util.viewValById("txtKL_LyDoKyLuat", data.LYDO);///
        edu.util.viewValById("txtKL_SoQD", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtKL_NgayKyQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.system.viewFiles("txtKL_ThongTinDinhKem", data.ID, "NS_Files");
        me.strCommon_Id = data.ID;
        $("#myModalLabel_KyLuat").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình kỷ luật');
    },    
} 
