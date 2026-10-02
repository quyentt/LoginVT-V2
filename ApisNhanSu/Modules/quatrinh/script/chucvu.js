function ChucVu() { }
ChucVu.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    dtNhanSu:[],
    dtChucVu: [],
    strChucVu_Id: '',
    strNhanSu_Id: '',
    tab_item_actived: [],
    tab_actived: [],
    do_table: '',
    strCommon_Id: '',
    arrValid_QuaTrinhChucVu: [],

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
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearch_ChucVu_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#txtSearch_ChucVu_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        $("#tblChucVu_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.toggle_form();
            me.reset_HS();
            $("#zoneEdit").slideDown();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblChucVu_NhanSu");
            me.getList_ChucVu();
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });
        $("#btnViewChucVu_DuBao").click(function () {
            me.toggle_list();
            me.getList_HetHanChucVu();
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
        $("#tbl_ChucVu").delegate(".btnDownLoad", "click", function () {
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
        $("#btnSave_ChucVu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhChucVu);
            if (valid) {
                me.save_ChucVu();
            }
        });
        $("#btnReWrite_ChucVu").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhChucVu);
            if (valid) {
                me.save_ChucVu();
                setTimeout(function () {
                    me.resetPopup_ChucVu();
                }, 1000);
            }
        });
        $("#tbl_ChucVu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_ChucVu");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_ChucVu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_ChucVu").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_ChucVu");
                $("#btnYes").click(function (e) {
                    me.delete_ChucVu(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_ChucVu").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_CHUVU");
                setTimeout(function () {
                    me.getList_ChucVu();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        me.arrValid_QuaTrinhChucVu = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtSoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "dropChucVu", "THONGTIN1": "EM" },
            { "MA": "txtNgayBatDau", "THONGTIN1": "EM" },
            { "MA": "txtNgayHieuLuc", "THONGTIN1": "EM" },
            { "MA": "txtNgayKy", "THONGTIN1": "EM" },
        ];
        edu.system.uploadFiles(["txtThongTinDinhKem"]);
        $("#btnViewChucVu_DuBao").click(function () {
            me.toggle_list();
            me.getList_HetHanChucVu();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        
        edu.system.getList_MauImport("zonebtnChucVu");
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMCV, "dropChucVuMoi,dropChucVuCu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh");
        me.getList_HS();
        me.getList_CoCauToChuc();
        me.getList_HetHanChucVu();
        me.open_Collapse("key_quatrinhchucvu");       
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HetHanChucVu");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_HetHanChucVu");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_ChucVu");
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.ChucVu;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.ChucVu;
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
            renderPlace: ["dropNS_CoCauToChuc", "dropDonViCu", "dropDonViMoi"],
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
            case "key_quatrinhchucvu":
                me.resetPopup_ChucVu();
                me.popup_ChucVu();
                break;
        }
    },
    switch_GetData: function (key) {
        console.log(1111);
        var me = this;
        switch (key) {
            case "key_quatrinhchucvu":
                me.getList_ChucVu();
                break;
        }
    },
    getList_HS: function () {
        var me = main_doc.ChucVu;        
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_ChucVu_TuKhoa"),
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
        var me = main_doc.ChucVu;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblChucVu_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChucVu_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChucVu.getList_HS()",
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
    save_ChucVu: function () {
        var me = main_doc.ChucVu;
        var obj_notify = {};
        // kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
        var strNgayBatDau = edu.util.getValById("txtNgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtNgayKetThuc");
        var check = edu.util.dateCompare(strNgayBatDau, strNgayKetThuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_ChucVu/ThemMoi',            

            'strId': '',
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropQuyetDinh"),
            'strNgayHieuLuc': edu.util.getValById("txtNgayBatDau"),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strChucVu_Id': edu.util.getValById("dropChucVuMoi"),
            'strChucVu_Cu_Id': edu.util.getValById("dropChucVuCu"),
            'dHeSo': edu.util.getValById("txtHeSo"),
            'strNgayBatDauApDung': edu.util.getValById("txtNgayBatDau"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("txtQuyetDinh_ID"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropDonViMoi'),
            'strDaoTao_CoCauToChuc_Cu_Id': edu.util.getValById('dropDonViCu'),
            'strThongTinDinhKem': "",
            'strNgayKetThucNhiemKy': edu.util.getValById("txtNgayKetThucNhiemKy"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ChucVu/CapNhat';
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
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_CHUVU");
                        setTimeout(function () {
                            edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files");
                        }, 100)
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        setTimeout(function () {
                            edu.system.saveFiles("txtThongTinDinhKem", obj_save.strId, "NS_Files");
                        }, 100)
                    }
                    me.getList_ChucVu();
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
    getList_ChucVu: function () {
        var me = main_doc.ChucVu;
        var obj_list = {
            'action': 'NS_QT_ChucVu/LayDanhSach',
            
            'iTrangThai': 1,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_ChucVu(data.Data);
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
    getDetail_ChucVu: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ChucVu/LayChiTiet',
            
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
                        me.viewForm_ChucVu(data.Data[0]);
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
    delete_ChucVu: function (Ids) {
        var me = main_doc.ChucVu;
        var obj_delete = {
            'action': 'NS_QT_ChucVu/Xoa',
            
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
                    me.getList_ChucVu();
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
    popup_ChucVu:function () {
        $("#zone_input").slideDown();
    },
    resetPopup_ChucVu: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtQuyetDinh_ID");
        edu.util.resetValById("dropQuyetDinh");
        edu.util.resetValById("dropChucVuCu");
        edu.util.resetValById("dropChucVuMoi");
        edu.util.resetValById("txtSoQuyetDinh");
        edu.util.resetValById("txtNgayQuyetDinh");
        edu.util.resetValById("txtNgayBatDau");
        edu.util.resetValById("txtNgayKetThucNhiemKy");
        edu.util.resetValById("txtHeSo");
        edu.util.resetValById("dropDonViCu");
        edu.util.resetValById("dropDonViMoi");
        edu.util.resetValById("txtGhiChu");
        edu.system.viewFiles("txtThongTinDinhKem", "");
    },
    genTable_ChucVu: function (data, iPager) {
        var me = main_doc.ChucVu;
        var jsonForm = {
            strTable_Id: "tbl_ChucVu",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            },
            aoColumns: [
            {
                "mDataProp": "CHUCVU_TEN"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
            {
                "mDataProp": "HESO"
            },
            {
                "mDataProp": "NHANSU_TTQUYETDINH_SOQD"
            },
            {
                "mDataProp": "NHANSU_TTQUYETDINH_NGAYQD"
            },
            {
                "mDataProp": "NHANSU_TTQUYETDINH_NGAYAD"
            },
            {
                "mDataProp": "NHANSU_TTQUYETDINH_NGAYHHL"
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
    viewForm_ChucVu: function (data) {
        var me = main_doc.ChucVu;
        me.popup_ChucVu();
        edu.util.viewValById("txtQuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("dropQuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("dropChucVuCu", data.CHUCVU_CU_ID);
        edu.util.viewValById("dropChucVuMoi", data.CHUCVU_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtNgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtNgayBatDau", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtNgayKetThucNhiemKy", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.util.viewValById("txtHeSo", data.HESO);
        edu.util.viewValById("dropDonViCu", data.DAOTAO_COCAUTOCHUC_CU_ID);
        edu.util.viewValById("dropDonViMoi", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
        $("#myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình chức vụ');
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.ChucVu;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
    getList_HetHanChucVu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ChucVu/LocDSNhanSu_QT_ChucVu_DenHan',

            'strNguoiThucHien_Id': edu.system.userId,
            'dSoNgayQuyDinh': 90,
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
                    me.genTable_HetHanChucVu(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_QT_ChucVu/LocDSNhanSu_QT_ChucVu_DenHan: " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert("NS_QT_ChucVu/LocDSNhanSu_QT_ChucVu_DenHan (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HetHanChucVu: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblHetHanChucVu_DuKien_Tong", data.length);
        edu.util.viewHTMLById("lblCount_HetHanChucVu", data.length);
        var jsonForm = {
            strTable_Id: "tblHetHanChucVu_DuBao",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0],
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
                    "mDataProp": "NOIDAOTAO"
                },
                {
                    "mDataProp": "NGANHDAOTAO"
                },
                {
                    "mDataProp": "HINHTHUCDAOTAO_TEN"
                },
                {
                    "mDataProp": "BANGCAPCHUNGCHI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};
