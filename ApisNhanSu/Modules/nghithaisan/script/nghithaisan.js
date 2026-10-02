function NghiThaiSan() { }
NghiThaiSan.prototype = {
    do_table: '',
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu: [],
    dtNghiThaiSan: [],
    strNghiThaiSan_Id: '',
    strNhanSu_Id: '',
    tab_item_actived: [],
    tab_actived: [],
    strCommon_Id: '',
    arrValid_NghiThaiSan: [],

    init: function () {
        var me = this;
        me.page_load();
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_input_NghiThaiSan");
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearch_NghiThaiSan_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#txtSearch_NghiThaiSan_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        $("#tblNghiThaiSan_NhanSu").delegate('.btnView', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var obj = this;
            var strId = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.extend.popover_NhanSu(strNhanSu_Id, me.dtNghiThaiSan, obj);
        });
        $("#tblNghiThaiSan_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            me.toggle_form();
            me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblNghiThaiSan_NhanSu");
            me.getList_NghiThaiSan();
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });
        $("#btnViewChucVu_DuBao").click(function () {
            me.toggle_list();
            me.getList_HetHanNghiThaiSan();
        });
        $("#dropSearch_CapNhat_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_BoMon").on("select2:select", function () {
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_TinhTrangLamViec").on("select2:select", function () {
            me.getList_HS();
        });
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnCloseInput").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        $("#tbl_NghiThaiSan").delegate(".btnDownLoad", "click", function () {
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
        $("#btnReWrite_NghiThaiSan").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_NghiThaiSan);
            if (valid) {
                me.save_NghiThaiSan();
                setTimeout(function () {
                    me.resetPopup_NghiThaiSan();
                }, 1000);
            }
        });
        $("#btnSave_NghiThaiSan").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_NghiThaiSan);
            if (valid) {
                me.save_NghiThaiSan();
            }
        });
        $("#tbl_NghiThaiSan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_NghiThaiSan");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_NghiThaiSan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_NghiThaiSan").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_NghiThaiSan");
                $("#btnYes").click(function (e) {
                    me.delete_NghiThaiSan(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnViewNghiThaiSan_DuBao").click(function () {
            me.toggle_list();
            me.getList_HetHanNghiThaiSan();
        });       
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh");
        me.getList_HS();
        me.getList_CoCauToChuc();
        me.getList_HetHanNghiThaiSan();
        me.open_Collapse("key_nghithaisan");
        edu.system.uploadFiles(["txt_ThongTinDinhKem"]);
        me.arrValid_NghiThaiSan = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtSoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtNgayKy", "THONGTIN1": "EM" },
            { "MA": "txtNgayHieuLuc", "THONGTIN1": "EM" },
            { "MA": "txtNgayHetHieuLuc", "THONGTIN1": "EM" },
        ]
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HetHanNghiThaiSan");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_HetHanNghiThaiSan");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_NghiThaiSan");
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.NghiThaiSan;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.NghiThaiSan;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }
        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genComBo_CCTC(data);
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_CCTC"],
            type: "",
            title: "Chọn Khoa/Viện/Phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropNS_CoCauToChuc"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    open_Collapse: function (strkey) {
        this.tab_item_actived.push(strkey);//
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_nghithaisan":
                me.resetPopup_NghiThaiSan();
                me.popup_NghiThaiSan();
                break;
        }
    },
    switch_GetData: function (key) {
        console.log(1111);
        var me = this;
        switch (key) {
            case "key_nghithaisan":
                me.getList_NghiThaiSan();
                break;
        }
    },
    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_NghiThaiSan_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strTinhTrangNhanSu_Id: strTinhTrangNhanSu_Id,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);
    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.NghiThaiSan;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblNghiThaiSan_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNghiThaiSan_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NghiThaiSan.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnDetail"],
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + "Mã cán bộ: " + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + "Ngày sinh: " + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    reset_HS: function () {
        var me = this;
        $("#tbl_TieuSuBanThan tbody").html("");
        $("#tbl_QuanHeGiaDinh tbody").html("");
        $("#tbl_Dang tbody").html("");
        $("#tbl_Doan tbody").html("");
        $("#tbl_CongDoan tbody").html("");
        $("#tbl_TrinhDoChinhTri tbody").html("");
        $("#tbl_TrinhDoTinHoc tbody").html("");
        $("#tbl_TrinhDoNgoaiNgu tbody").html("");
    },
    save_NghiThaiSan: function () {
        var me = this;
        var obj_notify = {};
        //kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
        var strNgayHieuLuc = edu.util.getValById("txtNgayHieuLuc");
        var strNgayKetThuc = edu.util.getValById("txtNgayHetHieuLuc");
        var check = edu.util.dateCompare(strNgayHieuLuc, strNgayKetThuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_ThaiSan/ThemMoi',

            'strId': '',
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropQuyetDinh"),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strNgayKetThuc': edu.util.getValById("txtNgayHetHieuLuc"),
            'strNgayHieuLuc': edu.util.getValById("txtNgayHieuLuc"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNgayKyQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strThoiGianBatDauNghi': edu.util.getValById("txtNgayHieuLuc"),
            'strThongTinDinhKem': edu.util.getValById("txt_ThongTinDinhKem"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("txtQuyetDinh_ID"),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ThaiSan/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (obj_save.strId == "" && edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        setTimeout(function () {
                            edu.system.saveFiles("txt_ThongTinDinhKem", data.Id, "NS_Files");
                        }, 50)
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        setTimeout(function () {
                            edu.system.saveFiles("txt_ThongTinDinhKem", obj_save.strId, "NS_Files");
                        }, 50)
                    }
                    me.getList_NghiThaiSan();
                }
                else {
                    edu.system.alert("Cập nhật thành công!");
                }
            },
            error: function (er) {
                edu.system.alert(er);
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NghiThaiSan: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ThaiSan/LayDanhSach',
            
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_NghiThaiSan(data.Data);
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
    getDetail_NghiThaiSan: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ThaiSan/LayChiTiet',

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
                        me.viewForm_NghiThaiSan(data.Data[0]);
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
    delete_NghiThaiSan: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_ThaiSan/Xoa',

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
                    edu.system.afterComfirm("Xóa dữ liệu thành công!");
                    me.getList_NghiThaiSan();
                }
                else {
                    edu.system.afterComfirm(data.Message);
                }
            },
            error: function (er) {
                edu.system.afterComfirm(er);
            },
            type: "POST",
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    popup_NghiThaiSan: function () {
        $("#zone_input").slideDown();
    },
    resetPopup_NghiThaiSan: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropQuyetDinh");
        edu.util.resetValById("txtSoQuyetDinh");
        edu.util.resetValById("txtNgayQuyetDinh");
        edu.util.resetValById("txtNgayHetHieuLuc");
        edu.util.resetValById("txtNgayBatDau");
        edu.util.resetValById("txtNgayHieuLuc");
        edu.util.resetValById("txtNgayApDung");
        edu.util.resetValById("txtNgayKy");
        edu.util.resetValById("txtQuyetDinh_ID");
        edu.system.viewFiles("txt_ThongTinDinhKem", "");
    },
    genTable_NghiThaiSan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_NghiThaiSan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 2, 3, 4, 5, 6,],
            },
            aoColumns: [
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYKYQUYETDINH"
                },
                {
                    "mDataProp": "THOIGIANBATDAUNGHI"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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
    viewForm_NghiThaiSan: function (data) {
        var me = main_doc.NghiThaiSan;
        me.popup_NghiThaiSan();        
        edu.util.viewValById("dropQuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtNgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtNgayKy", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtNgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtNgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtNgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.util.viewValById("txtQuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.system.viewFiles("txt_ThongTinDinhKem", data.ID, "NS_Files");        
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.NghiThaiSan;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
    getList_HetHanNghiThaiSan: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ThaiSan/LocDSNhanSu_QT_THSA_DenHan',

            'strNguoiThucHien_Id': edu.system.userId,
            'dSoNgayQuyDinh': 10,
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
                    me.genTable_HetHanNghiThaiSan(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_QT_ThaiSan/LocDSNhanSu_QT_THSA_DenHan: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NS_QT_ThaiSan/LocDSNhanSu_QT_THSA_DenHan (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HetHanNghiThaiSan: function (data) {
        var me = main_doc.NghiThaiSan;
        edu.util.viewHTMLById("lblHetHanNghiThaiSan_DuKien_Tong", data.length);
        edu.util.viewHTMLById("lblCount_HetHanNghiThaiSan", data.length);
        var jsonForm = {
            strTable_Id: "tblHetHanNghiThaiSan_DuBao",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 3, 4],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span >' + edu.util.returnEmpty(aData.HO) + ' ' + edu.util.returnEmpty(aData.TEN) + '</span>';
                    }
                },
                {
                    "mDataProp": "MACANBO"
                },
                {
                    "mDataProp": "THOIGIANBATDAUNGHI"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};
