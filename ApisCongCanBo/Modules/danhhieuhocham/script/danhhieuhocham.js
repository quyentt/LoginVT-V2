/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function DanhHieuHocHam() { };
DanhHieuHocHam.prototype = {
    dtHocHam: [],
    dtLoaiQuyetDinh: [],
    strHocHam_Id: "",
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    arrValid_HocHam: [],
    arrValid_DanhHieu: [],
    
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
                    case "#tab_5"://Hoc ham, danh hieu
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOCD, "dropHocHam_ChucDanh");
                            setTimeout(function () {
                                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LODH, "dropDanhHieu_Loai");
                            }, 150);
                        }, 150);
                        me.open_Collapse("key_danhhieu");
                        me.open_Collapse("key_hocham");
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
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        /*------------------------------------------
        --Discription: [tab_5] Hoc ham
        -------------------------------------------*/
        $("#btnSaveRe_HocHam").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HocHam);
            if (valid) {
                me.save_HocHam();
                setTimeout(function () {
                    me.resetPopup_HocHam();
                }, 1000);
            }
        });
        $("#btnSave_HocHam").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HocHam);
            if (valid) {
                me.save_HocHam();
            }
        });
        $("#tbl_HocHam").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_HocHam");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_HocHam(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HocHam").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_HocHam");
                $("#btnYes").click(function (e) {
                    me.delete_HocHam(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HocHam").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển thành học hàm hiện tại không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_CHUCDANH");
                setTimeout(function () {
                    me.getList_HocHam();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $("#btnThemDongMoiQDNT_DT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_NhiemVu(id, "");
        });
        $("#zoneHocHam_input").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHocHam_QDGiaoNhhiemVu tr[id='" + strRowId + "']").remove();
        });
        $("#zoneHocHam_input").delegate(".deleteNhiemVu", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HocHam_NhiemVu(strId);
            });
        });
        /*------------------------------------------
        --Discription: [tab_5] Danh hieu
        -------------------------------------------*/
        $("#btnSaveRe_DanhHieu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DanhHieu);
            if (valid) {
                me.save_DanhHieu();
                setTimeout(function () {
                    me.resetPopup_DanhHieu();
                }, 1000);
            }
        });
        $("#btnSave_DanhHieu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DanhHieu);
            if (valid) {
                me.save_DanhHieu();
            }
        });
        $("#tbl_DanhHieu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_DanhHieu");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_DanhHieu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_DanhHieu").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_DanhHieu");
                $("#btnYes").click(function (e) {
                    me.delete_DanhHieu(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_DanhHieu").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển thành danh hiệu cao nhất không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_DANHHIEU");
                setTimeout(function () {
                    me.getList_DanhHieu();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $('a[href="#tab_5"]').trigger("shown.bs.tab");
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("NS.QUDI", "", "", me.cbGetList_LoaiQuyetDinh);
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.CNDT", "dropChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.CHUYENNGANH", "dropHocHam_ChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOCD, "dropHocHam_ChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LODH, "dropDanhHieu_Loai");
        edu.system.uploadFiles(["txtDanhHieu_ThongTinDinhKem"]);
        me.arrValid_HocHam = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtHocHam_ChuyenNganh", "THONGTIN1": "EM" },
            { "MA": "dropHocHam_ChucDanh", "THONGTIN1": "EM" },
            { "MA": "txtHocHam_NgayPhong", "THONGTIN1": "EM" },
        ];
        me.arrValid_DanhHieu = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropDanhHieu_Loai", "THONGTIN1": "EM" },
            { "MA": "txtDanhHieu_NgayPhong", "THONGTIN1": "EM" },
        ];
    },
    cbGetList_LoaiQuyetDinh: function (data) {
        main_doc.DanhHieuHocHam.dtLoaiQuyetDinh = data;
    },
    genComBo_LoaiQuyetDinh: function (strNhiemVu_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiQuyetDinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strNhiemVu_Id],
            type: "",
            title: "Chọn loại quyết định"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strNhiemVu_Id).select2();
    },    
    open_Collapse:function(strkey) {
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey +'"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_hocham":
                me.resetPopup_HocHam();
                me.popup_HocHam();
                break;
            case "key_danhhieu":
                me.resetPopup_DanhHieu();
                me.popup_DanhHieu();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_hocham":
                me.getList_HocHam();
                break;
            case "key_danhhieu":
                me.getList_DanhHieu();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_5] HocHam
    -------------------------------------------*/
    getList_HocHam: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ChucDanh/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_HocHam(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
    save_HocHam: function () {
        var me = this;
        var obj_notify = {};
        var strNgayPhongChucDanh = edu.util.getValById("txtHocHam_NgayPhong");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayPhongChucDanh, strHomNay);
        if (check == 1) {
            edu.system.alert("Ngày phong không được lớn hơn ngày hiện tại!");
            return;
        }
        var obj_save = {
            'action'                : 'NS_QT_ChucDanh/ThemMoi',
            'versionAPI'            : 'v1.0',

            'strId'                 : '',
            'strNhanSu_ThongTinQD_Id'       : "",
            'strSoQuyetDinh': "",
            'strNgayQuyetDinh': edu.util.getValById("txtHocHam_NgayKyQuyetDinhBoNhiem"),
            'strQuyetDinhBoNhiem': edu.util.getValById("txtHocHam_SoQDBoNhiem"),
            'strNguoiKyQuyetDinh'   : "",
            'strNgayHieuLuc': edu.util.getValById("txtHocHam_NgayKyQuyetDinhQDCongNhan"),
            'strQuyetDinhCongNhanDatChuan': edu.util.getValById("txtHocHam_SoQDCongNhan"),
            'strThongTinQuyetDinh'   : edu.util.getValById("txtHocHam_NoiPhong"),
            'strLoaiQuyetDinh_Id'   : "",
            'strNgayHetHieuLuc'   : "",
            'iTrangThai': 1,
            'strChuyenNganh': edu.util.getValById("txtHocHam_ChuyenNganh"),
            'strThoiHan': edu.util.getValById("txtHocHam_ThoiHan"),
            'strChucDanh_Id': edu.util.getValById("dropHocHam_ChucDanh"),
            'strMoTa': edu.util.getValById("txtHocHam_MoTa"),
            'strNamPhongChucDanh': edu.util.getValById("txtHocHam_NgayPhong"),
            'strNoiPhongChucDanh': edu.util.getValById("txtHocHam_NoiPhong"),
            'iThuTu': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ChucDanh/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = me.strCommon_Id;
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        strId = data.Id;
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_CHUCDANH");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#tblHocHam_QDGiaoNhhiemVu tbody tr").each(function () {
                        var strNhiemVu_Id = this.id.replace(/rm_row/g, '');
                        me.save_HocHam_NhiemVu(strNhiemVu_Id, strId);
                    });
                    me.getList_HocHam();
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
    getDetail_HocHam: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ChucDanh/LayChiTiet',
            
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
                        me.viewForm_HocHam(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + JSON.stringify(data.Message), "w");
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
    delete_HocHam: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_ChucDanh/Xoa',
            
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
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocHam();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + JSON.stringify(data.Message),
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
    popup_HocHam: function () {
        $("#zoneHocHam_input").slideDown();
    },
    resetPopup_HocHam: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropHocHam_ChucDanh");
        edu.util.resetValById("txtHocHam_NgayPhong");
        edu.util.resetValById("txtHocHam_NoiPhong");
        edu.util.resetValById("txtHocHam_ThuTu");
        edu.util.resetValById("txtHocHam_MoTa");
        edu.util.resetValById("txtHocHam_ChuyenNganh");
        edu.util.resetValById("txtHocHam_ThoiHan");
        $("#tblHocHam_QDGiaoNhhiemVu tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.DanhHieuHocHam.genHTML_NhiemVu(id, "");
        }
    },
    genTable_HocHam: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_HocHam",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DanhHieuHocHam.getList_HocHam()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 3, 4, 5],
            },
            aoColumns: [{
                "mDataProp": "CHUYENNGANH"
            },
            {
                "mDataProp": "CHUCDANH_TEN"
            },
            {
                "mDataProp": "NAMPHONGCHUCDANH"
            },
            {
                "mDataProp": "NOIPHONGCHUCDANH"
            },
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                }
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
    viewForm_HocHam: function (data) {
        var me = this;
        me.popup_HocHam();
        edu.util.viewValById("dropHocHam_ChucDanh", data.CHUCDANH_ID);
        edu.util.viewValById("txtHocHam_NgayPhong", data.NAMPHONGCHUCDANH);
        edu.util.viewValById("txtHocHam_NoiPhong", data.NOIPHONGCHUCDANH);
        edu.util.viewValById("txtHocHam_ThuTu", data.THUTU);
        edu.util.viewValById("txtHocHam_MoTa", data.MOTA);
        edu.util.viewValById("txtHocHam_ChuyenNganh", data.CHUYENNGANH);
        edu.util.viewValById("txtHocHam_ThoiHan", data.THOIHAN);
        edu.util.viewValById("txtHocHam_SoQDBoNhiem", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtHocHam_NgayKyQuyetDinhBoNhiem", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtHocHam_NgayKyQuyetDinhQDCongNhan", data.NHANSU_TTQUYETDINH_NGAYHL);
        me.getList_HocHam_NhiemVu();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_HocHam_NhiemVu: function (strNhiemVu_Id, strHocHam_Id) {
        var me = this;
        var strId = strNhiemVu_Id;
        var strLoaiQuyetDinh = edu.util.getValById('dropLoaiQuyetDinh' + strNhiemVu_Id);
        var strSoQuyetDinh = edu.util.getValById('txtSoQuyetDinh' + strNhiemVu_Id);
        var strNgayQuyetDinh = edu.util.getValById('txtNgayQuyetDinh' + strNhiemVu_Id);
        var strNamBatDau = edu.util.getValById('txtNamBatDau' + strNhiemVu_Id);
        var strNhiemVu = edu.util.getValById('txtNhiemVu' + strNhiemVu_Id);
        var strNamKetThuc = edu.util.getValById('txtNamKetThuc' + strNhiemVu_Id);
        if (!edu.util.checkValue(strSoQuyetDinh)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NS_ThongTinQuyetDinh/ThemMoi',            

            'strId': strId,
            'strNguonDuLieu_Id': strHocHam_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strSoQuyetDinh': strSoQuyetDinh,
            'strNgayQuyetDinh': strNgayQuyetDinh,
            'strNguoiKyQuyetDinh': '',
            'strNgayHieuLuc': strNamBatDau,
            'strThongTinQuyetDinh': strNhiemVu,
            'strThongTinDinhKem': '',
            'strLoaiQuyetDinh_Id': strLoaiQuyetDinh,
            'strNgayHetHieuLuc': strNamKetThuc,
            'iTrangThai': 1,
            'iThuTu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NS_ThongTinQuyetDinh/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + JSON.stringify(data.Message)
                    };
                    edu.system.alert(obj_save + ": " + JSON.stringify(data.Message));
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strNhiemVu_Id, strId, "NS_Files");                
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocHam_NhiemVu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_ThongTinQuyetDinh/LayDanhSach',            

            'strTuKhoa': '',
            'strNguonDuLieu_Id': me.strCommon_Id,
            'iTrangThai': 1,
            'strNgayHieuLuc_Tu': '',
            'strNgayHieuLuc_Den': '',
            'strLoaiQuyetDinh_Id': '',
            'strThanhVien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000000
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_NhiemVu_Data(dtResult);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + JSON.stringify(data.Message), "w");
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
    delete_HocHam_NhiemVu: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_ThongTinQuyetDinh/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocHam_NhiemVu();
                }
                else {
                    obj = {
                        content: "NS_ThongTinQuyetDinh/Xoa: " + JSON.stringify(data.Message),
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                                
            },
            error: function (er) {
                var obj = {
                    content: "NS_ThongTinQuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_NhiemVu_Data: function (data) {
        var me = this;
        $("#tblHocHam_QDGiaoNhhiemVu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strNhiemVu_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strNhiemVu_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strNhiemVu_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropLoaiQuyetDinh' + strNhiemVu_Id + '" class="select-opt"><option value=""> --- Chọn loại quyết định--</option ></select ></td>';
            row += '<td><input type="text" id="txtSoQuyetDinh' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].SOQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgayQuyetDinh' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYQUYETDINH) + '" class="form-control input-datepicker_X"/></td>';
            row += '<td><input type="text" id="txtNamBatDau' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHIEULUC) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNamKetThuc' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHETHIEULUC) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNhiemVu' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].THONGTINQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><div id="txtFileDinhKem' + strNhiemVu_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteNhiemVu" id="' + strNhiemVu_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHocHam_QDGiaoNhhiemVu tbody").append(row);
            edu.system.uploadFiles(["txtFileDinhKem" + strNhiemVu_Id]);
            me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strNhiemVu_Id, data[i].LOAIQUYETDINH_ID);
            edu.system.viewFiles("txtFileDinhKem" + strNhiemVu_Id, strNhiemVu_Id, "NS_Files");
        }
        for (var i = data.length; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_NhiemVu(id, "");
        }
        edu.system.pickerdate("input-datepicker_X");
    },
    genHTML_NhiemVu: function (strNhiemVu_Id) {
        var me = this;
        var iViTri = document.getElementById("tblHocHam_QDGiaoNhhiemVu").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strNhiemVu_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strNhiemVu_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropLoaiQuyetDinh' + strNhiemVu_Id + '" class="select-opt"><option value=""> --- Chọn loại quyết định--</option ></select ></td>';
        row += '<td><input type="text" id="txtSoQuyetDinh' + strNhiemVu_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgayQuyetDinh' + strNhiemVu_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><input type="text" id="txtNamBatDau' + strNhiemVu_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><input type="text" id="txtNamKetThuc' + strNhiemVu_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><input type="text" id="txtNhiemVu' + strNhiemVu_Id + '" class="form-control"/></td>';
        row += '<td><div id="txtFileDinhKem' + strNhiemVu_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strNhiemVu_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblHocHam_QDGiaoNhhiemVu tbody").append(row);
        edu.system.uploadFiles(["txtFileDinhKem" + strNhiemVu_Id]);
        edu.system.pickerdate("input-datepicker_X");
        edu.system.viewFiles("txtFileDinhKem" + strNhiemVu_Id, strNhiemVu_Id, "NS_Files");
        me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strNhiemVu_Id, "");
    },
    /*------------------------------------------
    --Discription: [Tab_5] DanhHieuNhaGiao
    -------------------------------------------*/
    getList_DanhHieu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DanhHieu/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_DanhHieu(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
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
    save_DanhHieu: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action'                : 'NS_QT_DanhHieu/ThemMoi',
            'versionAPI'            : 'v1.0',

            'strId'                 : '',
            'strNhanSu_ThongTinQD_Id'        : "",
            'strDanhHieu_Id': edu.util.getValById("dropDanhHieu_Loai"),
            'strSoQuyetDinh': edu.util.getValById("txtDanhHieu_SoQD"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': "",
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': "",
            'strNgayHetHieuLuc': "",
            'strNgayQuyetDinh'      : edu.util.getValById("txtDanhHieu_NgayKyQuyetDinh"),
            'strNamPhong'           : edu.util.getValById("txtDanhHieu_NgayPhong"),
            'strNoiPhong'           : edu.util.getValById("txtDanhHieu_NoiPhong"),
            'strMoTa'               : edu.util.getValById("txtDanhHieu_MoTa"),
            'iTrangThai'            : 1,
            'iThuTu'                : edu.util.getValById("txtDanhHieu_ThuTu"),
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_DanhHieu/CapNhat';
            obj_save.strId  = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_DANHHIEU");
                        edu.system.saveFiles("txtDanhHieu_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        setTimeout(function () {
                            edu.system.saveFiles("txtDanhHieu_ThongTinDinhKem", obj_save.strId, "NS_Files");
                        }, 100)
                    }
                    me.getList_DanhHieu();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
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
    getDetail_DanhHieu: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_DanhHieu/LayChiTiet',
            
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
                        me.viewForm_DanhHieu(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + JSON.stringify(data.Message), "w");
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
    delete_DanhHieu: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_DanhHieu/Xoa',
            
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
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DanhHieu();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + JSON.stringify(data.Message),
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
    popup_DanhHieu: function () {
        $("#zoneDanhHieu_input").slideDown();
    },
    resetPopup_DanhHieu: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropDanhHieu_Loai");
        edu.util.resetValById("txtDanhHieu_ThuTu");
        edu.util.resetValById("txtDanhHieu_NgayPhong");
        edu.util.resetValById("txtDanhHieu_NoiPhong");
        edu.util.resetValById("txtDanhHieu_MoTa");
        edu.util.resetValById("txtDanhHieu_SoQD");
        edu.util.resetValById("txtDanhHieu_NgayKyQuyetDinh");
        edu.system.viewFiles("txtDanhHieu_ThongTinDinhKem", "");
    },
    genTable_DanhHieu: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_DanhHieu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CapNhatHoSo.getList_DanhHieu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "DANHHIEU_TEN"
                },
                {
                    "mDataProp": "NAMPHONG"
                },
                {
                    "mDataProp": "NOIPHONG"
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
    viewForm_DanhHieu: function (data) {
        var me = this;
        me.popup_DanhHieu();
        //view data --Edit
        edu.util.viewValById("dropDanhHieu_Loai", data.DANHHIEU_ID);
        edu.util.viewValById("txtDanhHieu_MoTa", data.MOTA);
        edu.util.viewValById("txtDanhHieu_NgayPhong", data.NAMPHONG);
        edu.util.viewValById("txtDanhHieu_NoiPhong", data.NOIPHONG);
        edu.util.viewValById("txtDanhHieu_SoQD", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtDanhHieu_NgayKyQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.system.viewFiles("txtDanhHieu_ThongTinDinhKem", data.ID, "NS_Files");
    },
}