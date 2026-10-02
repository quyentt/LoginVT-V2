function QuanHeGiaDinh() { };
QuanHeGiaDinh.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    arrValid_QHGD: [],
    arrValid_QHVC: [],
    arrValid_TNNN: [],

    init: function () {
        var me = this;
        me.page_load();
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_QHGD();
            me.getList_QHVC();
            me.getList_TNNN();
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            edu.system.viewFiles("txtThongTinDinhKem", me.strNhanSu_Id, "NS_Files");
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_CapNhat_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        $("#btnSearchCapNhat_NhanSu").click(function () {
            me.getList_HS();
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
        $("#btnSave_QHGD").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QHGD);
            if (valid) {
                me.save_QHGD();
            }
        });
        $("#btnSaveRe_QHGD").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QHGD);
            if (valid) {
                me.save_QHGD();
                setTimeout(function () {
                    me.resetPopup_QHGD();
                }, 1000);
            }
        });
        $("#tbl_QuanHeGiaDinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_QuanHeGiaDinh");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_QHGD(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_QuanHeGiaDinh").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_QuanHeGiaDinh");
                $("#btnYes").click(function (e) {
                    me.delete_QHGD(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_QHVC").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QHVC);
            if (valid) {
                me.save_QHVC();
            }
        });
        $("#btnSaveRe_QHVC").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QHVC);
            if (valid) {
                me.save_QHVC();
                setTimeout(function () {
                    me.resetPopup_QHVC();
                }, 1000);
            }
        });
        $("#tbl_QuanHeVoChong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_QuanHeVoChong");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_QHVC(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_QuanHeVoChong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_QuanHeVoChong");
                $("#btnYes").click(function (e) {
                    me.delete_QHVC(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_TNNN").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TNNN);
            if (valid) {
                me.save_TNNN();
            }
        });
        $("#btnSaveRe_TNNN").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TNNN);
            if (valid) {
                me.save_TNNN();
                setTimeout(function () {
                    me.resetPopup_TNNN();
                }, 1000);
            }
        });
        $("#tbl_ThanNhanNuocNgoai").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_ThanNhanNuocNgoai");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_TNNN(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_ThanNhanNuocNgoai").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_ThanNhanNuocNgoai");
                $("#btnYes").click(function (e) {
                    me.delete_TNNN(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.system.buttonLoading();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QHGD.CVHT", "dropCongViecHienTai_QHGD, dropCongViecHienTai_QHVC, dropCongViecHienTai_TNNN");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QHGD, "dropQuanHe_QHGD, dropQHVC_QuanHe, dropTNNN_QuanHe, dropQuanHe", "Chọn quan hệ");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropQGDangSong_QHGD", "", "", "Chọn quốc gia đang sống");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropQGDangSong_QHVC", "", "Chọn quốc gia đang sống");
        setTimeout(function () {
            me.getList_HS();
        }, 150);
        me.getList_CoCauToChuc();
        me.arrValid_QHGD = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtHoDem", "THONGTIN1": "EM" },
            { "MA": "dropQuanHe", "THONGTIN1": "EM" },
            { "MA": "txtTen", "THONGTIN1": "EM" },
        ];
        me.arrValid_QHVC = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtQHVC_HoDem", "THONGTIN1": "EM" },
            { "MA": "dropQHVC_QuanHe", "THONGTIN1": "EM" },
            { "MA": "txtQHVC_Ten", "THONGTIN1": "EM" },
        ];
        me.arrValid_TNNN = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTNNN_HoVaTen", "THONGTIN1": "EM" },
            { "MA": "dropTNNN_QuanHe", "THONGTIN1": "EM" },
        ];
    },
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.QuanHeGiaDinh;
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
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_quanhegiadinh":
                me.resetPopup_QHGD();
                me.popup_QHGD();
                break;
            case "key_quanhevochong":
                me.resetPopup_QHVC();
                me.popup_QHVC();
                break;
            case "key_thannhannuocngoai":
                me.resetPopup_TNNN();
                me.popup_TNNN();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_quanhegiadinh":
                me.resetPopup_QHGD();
                me.popup_QHGD();
                break;
            case "key_quanhevochong":
                me.resetPopup_QHVC();
                me.popup_QHVC();
                break;
            case "key_thannhannuocngoai":
                me.resetPopup_TNNN();
                me.popup_TNNN();
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
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
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
        var me = main_doc.QuanHeGiaDinh;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanHeGiaDinh.getList_HS()",
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
    getList_QHGD: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_QuanHeThanToc/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_QHGD(data.Data);
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
    save_QHGD: function () {
        var me = this;
        var obj_notify = {};
        var strQuanHe_Id = edu.util.getValById("dropQuanHe");
        if (strQuanHe_Id == "") {
            obj_notify = {
                type: "w",
                content: "Hãy nhập chọn quan hệ!",
            }
            edu.system.alertOnModal(obj_notify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_QuanHeThanToc/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNhanSu_QuanHe_Id': edu.util.getValById("dropQuanHe"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'iTrangThai': 1,
            'iThuTu': "",
            'strHoDem': edu.util.getValById("txtHoDem"),
            'strTen': edu.util.getValById("txtTen"),
            'strNgaySinh': "",
            'strThangSinh': "",
            'strNamSinh': edu.util.getValById("txtNamSinh"),
            'strQueQuan': edu.util.getValById("txtDiaChiThuongTru_QHGD"),
            'strChucDanh': "",
            'strChucVu': "",
            'strDonViCongTac': edu.util.getValById("txtDonViCongTac_QHGD"),
            'strQuocGia_Id': edu.util.getValById("dropQGDangSong_QHGD"),
            'strNgheNghiep': edu.util.getValById("txtCongViecHienTai_QHGD"),
            'strHocTap': "",
            'strNoiO': edu.util.getValById("txtQHGD_ThuTu"),
            'strCongViecHienTai_Id': "",
            'strThanhVienCacToChucCT_XH': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_QuanHeThanToc/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_GD_QHGD");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QHGD();
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
    getDetail_QHGD: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_QuanHeThanToc/LayChiTiet',
            
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
                        me.viewForm_QHGD(data.Data[0]);
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
    delete_QHGD: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_QuanHeThanToc/Xoa',
            
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
                    me.getList_QHGD();
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
    popup_QHGD: function () {
        $("#zoneQHGD_input").slideDown();
    },
    resetPopup_QHGD: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropQuanHe_QHGD");
        edu.util.resetValById("txtHoDem_QHGD");
        edu.util.resetValById("txtTen_QHGD");
        edu.util.resetValById("txtNamSinh_QHGD");
        edu.util.resetValById("txtMoTa_QHGD");
        edu.util.resetValById("txtDiaChiThuongTru_QHGD");
        edu.util.resetValById("txtDonViCongTac_QHGD");
        edu.util.resetValById("dropCongViecHienTai_QHGD");
    },
    genTable_QHGD: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_QuanHeGiaDinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanHeGiaDinh.getList_QHGD()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6],
            },
            aoColumns: [{
                "mDataProp": "QUANHE_TEN"
            },
            {
                "mRender": function (nRow, aData) {
                    return edu.util.returnEmpty(aData.HODEM) + ' ' + edu.util.returnEmpty(aData.TEN1);
                }
            },
            {
                "mDataProp": "NAMSINH"
            },
            {
                "mDataProp": "NGHENGHIEP"
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
    viewForm_QHGD: function (data) {
        var me = this;
        me.popup_QHGD();
        edu.util.viewValById("dropQuanHe", data.QUANHE_ID);
        edu.util.viewValById("txtQHGD_ThuTu", data.NOIO);
        edu.util.viewValById("txtHoDem", data.HODEM);
        edu.util.viewValById("txtTen", data.TEN1);
        edu.util.viewValById("txtNamSinh", data.NAMSINH);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtDiaChiThuongTru_QHGD", data.QUEQUAN);
        edu.util.viewValById("txtDonViCongTac_QHGD", data.DONVICONGTAC);
        edu.util.viewValById("txtCongViecHienTai_QHGD", data.NGHENGHIEP);
        edu.util.viewValById("dropQGDangSong_QHGD", data.QUOCGIA_ID);
        $("#myModalLabel_QHGD").html('<i class="fa fa-edit"></i> Chỉnh sửa quan hệ gia đình (Về bản thân)');
    },
    getList_QHVC: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_QuanHeVoChong/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_QHVC(data.Data);
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
    save_QHVC: function () {
        var me = this;
        var obj_notify = {};
        var strQuanHe_Id = edu.util.getValById("dropQHVC_QuanHe");
        if (strQuanHe_Id == "") {
            obj_notify = {
                type: "w",
                content: "Hãy nhập chọn quan hệ!",
                prePos: "#myModal_QHVC #notify"
            }
            edu.system.alertOnModal(obj_notify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_QuanHeVoChong/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNhanSu_QuanHe_Id': edu.util.getValById("dropQHVC_QuanHe"),
            'strMoTa': edu.util.getValById("txtQHVC_MoTa"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtQHVC_ThuTu"),
            'strHoDem': edu.util.getValById("txtQHVC_HoDem"),
            'strTen': edu.util.getValById("txtQHVC_Ten"),
            'strNgaySinh': "",
            'strThangSinh': "",
            'strNamSinh': edu.util.getValById("txtQHVC_NamSinh"),
            'strQueQuan': edu.util.getValById("txtDiaChiThuongTru_QHVC"),
            'strNgheNghiep': edu.util.getValById("txtCongViecHienTai_QHVC"),
            'strQuocGia_Id': edu.util.getValById("dropQGDangSong_QHVC"),
            'strChucDanh': "",
            'strChucVu': "",
            'strDonViCongTac': edu.util.getValById("txtDonViCongTac_QHVC"),
            'strCongViecHienTai_Id': "",
            'strHocTap': "",
            'strNoiO': "",
            'strThanhVienCacToChucCT_XH': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strCommon_Id != "") {
            obj_save.action = 'NS_QT_QuanHeVoChong/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");                       
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QHVC();
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
    getDetail_QHVC: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_QuanHeVoChong/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                        prePos: "#myModal_QHVC #notify"
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_QHVC(data.Data[0]);
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
    delete_QHVC: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_QuanHeVoChong/Xoa',
            
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
                    me.getList_QHVC();
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
    popup_QHVC: function () {
        $("#zoneQHVC_input").slideDown();
    },
    resetPopup_QHVC: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropQHVC_QuanHe");
        edu.util.resetValById("txtQHVC_ThuTu");
        edu.util.resetValById("txtQHVC_HoDem");
        edu.util.resetValById("txtQHVC_Ten");
        edu.util.resetValById("txtQHVC_NamSinh");
        edu.util.resetValById("txtQHVC_MoTa");
        edu.util.resetValById("txtDiaChiThuongTru_QHVC");
        edu.util.resetValById("txtDonViCongTac_QHVC");
        edu.util.resetValById("dropCongViecHienTai_QHVC");
    },
    genTable_QHVC: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_QuanHeVoChong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanHeGiaDinh.getList_QHVC()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5],
            },
            aoColumns: [{
                "mDataProp": "QUANHE_TEN"
            },
            {
                "mRender": function (nRow, aData) {
                    return edu.util.returnEmpty(aData.HODEM) + ' ' + edu.util.returnEmpty(aData.TEN1);
                }
            },
            {
                "mDataProp": "NAMSINH"
            },
            {
                "mDataProp": "NGHENGHIEP"
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
    viewForm_QHVC: function (data) {
        var me = this;
        me.popup_QHVC();
        edu.util.viewValById("dropQHVC_QuanHe", data.QUANHE_ID);
        edu.util.viewValById("txtQHVC_ThuTu", data.THUTU);
        edu.util.viewValById("txtQHVC_HoDem", data.HODEM);
        edu.util.viewValById("txtQHVC_Ten", data.TEN1);
        edu.util.viewValById("txtQHVC_NamSinh", data.NAMSINH);
        edu.util.viewValById("txtQHVC_MoTa", data.MOTA);
        edu.util.viewValById("txtDiaChiThuongTru_QHVC", data.QUEQUAN);
        edu.util.viewValById("txtDonViCongTac_QHVC", data.DONVICONGTAC);
        edu.util.viewValById("txtCongViecHienTai_QHVC", data.NGHENGHIEP);
        edu.util.viewValById("dropQGDangSong_QHVC", data.QUOCGIA_ID);
        $("#myModalLabel_QHVC").html('<i class="fa fa-pencil"></i> Chỉnh sửa quan hệ gia đình (Về bên vợ hoặc chồng)');
    },
    getList_TNNN: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_ThanNhanNuocNgoai/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TNNN(data.Data);
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
    save_TNNN: function () {
        var me = this;
        var obj_notify = {};
        var strQuanHe_Id = edu.util.getValById("dropTNNN_QuanHe");
        if (strQuanHe_Id == "") {
            obj_notify = {
                type: "w",
                content: "Hãy nhập chọn quan hệ!",
                prePos: "#myModal_TNNN #notify"
            }
            edu.system.alertOnModal(obj_notify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_ThanNhanNuocNgoai/ThemMoi',            

            'strId': '',
            'strQuanHe_Id': edu.util.getValById("dropTNNN_QuanHe"),
            'strHoVaTen': edu.util.getValById("txtTNNN_HoVaTen"),
            'strNamSinh': edu.util.getValById("txtTNNN_NamSinh"),
            'strNgheNghiep': edu.util.getValById("txtCongViecHienTai_TNNN"),
            'strNuocDinhCu': edu.util.getValById("txtTNNN_NuocDinhCu"),
            'strQuocTich': edu.util.getValById("txtTNNN_QuocTich"),
            'strNamDinhCu': edu.util.getValById("txtTNNN_NamDinhCu"),
            'strCongViecHienTai_Id': '',
            'strMoTa': edu.util.getValById("txtTNNN_MoTa"),
            'iThuTu': edu.util.getValById("txtTNNN_ThuTu"),
            'iTrangThai': 1,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ThanNhanNuocNgoai/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");               
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TNNN();
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
    getDetail_TNNN: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ThanNhanNuocNgoai/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_TNNN(data.Data[0]);
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
    delete_TNNN: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_ThanNhanNuocNgoai/Xoa',
            
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
                    me.getList_TNNN();
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
    popup_TNNN: function () {
        $("#zoneTNNN_input").slideDown();
    },
    resetPopup_TNNN: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropTNNN_QuanHe");
        edu.util.resetValById("txtTNNN_HoVaTen");
        edu.util.resetValById("txtTNNN_NamSinh");
        edu.util.resetValById("txtTNNN_NgheNghiep");
        edu.util.resetValById("txtTNNN_NuocDinhCu");
        edu.util.resetValById("txtTNNN_QuocTich");
        edu.util.resetValById("txtTNNN_NamDinhCu");
        edu.util.resetValById("txtTNNN_ThuTu");
        edu.util.resetValById("txtTNNN_MoTa");
    },
    genTable_TNNN: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_ThanNhanNuocNgoai",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [{
                "mDataProp": "QUANHE_TEN"
            },
            {
                "mDataProp": "HOVATEN"
            },
            {
                "mDataProp": "NAMSINH"
            },
            {
                "mDataProp": "NGHENGHIEP"
            },
            {
                "mDataProp": "NUOCDINHCU"
            },
            {
                "mDataProp": "NAMDINHCU"
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
    viewForm_TNNN: function (data) {
        var me = this;
        me.popup_TNNN();
        edu.util.viewValById("txtTNNN_ThuTu", data.THUTU);
        edu.util.viewValById("dropTNNN_QuanHe", data.QUANHE_ID);
        edu.util.viewValById("txtTNNN_HoVaTen", data.HOVATEN);
        edu.util.viewValById("txtTNNN_NamSinh", data.NAMSINH);
        edu.util.viewValById("txtCongViecHienTai_TNNN", data.NGHENGHIEP);
        edu.util.viewValById("txtTNNN_NuocDinhCu", data.NUOCDINHCU);
        edu.util.viewValById("txtTNNN_NamDinhCu", data.NAMDINHCU);
        edu.util.viewValById("txtTNNN_MoTa", data.MOTA);
        edu.util.viewValById("txtTNNN_QuocTich", data.QUOCTICH);
        edu.util.viewValById("dropCongViecHienTai_TNNN", data.CONGVIECHIENTAI_ID);
        edu.util.viewValById("txtDonViCongTac_TNNN", data.DONVICONGTAC);
        $("#myModalLabel_TNNN").html('<i class="fa fa-pencil"></i> Chỉnh sửa thân nhân nước ngoài');
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.QuanHeGiaDinh;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
}