function DanhHieuHocHam() { };
DanhHieuHocHam.prototype = {
    strCommon_Id: '',
    strNhanSu_Id: '',
    dtNhanSu: [],
    tab_actived: [],
    tab_item_actived: [],
    arrValid_HocHam: [],
    arrValid_DanhHieu: [],

    init: function () {
        var me = this;
        me.page_load();
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_DanhHieu();
            me.getList_HocHam();
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
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropDanhHieu_LoaiQuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QUDI", "", "", me.cbGetList_LoaiQuyetDinh);
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOCD", "dropHocHam_ChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LODH", "dropDanhHieu_Loai");
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
        var me = main_doc.DanhHieuHocHam;
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
        var me = main_doc.DanhHieuHocHam;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DanhHieuHocHam.getList_HS()",
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
    getList_HocHam: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ChucDanh/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
            'action': 'NS_QT_ChucDanh/ThemMoi',            

            'strId': '',
            'strNhanSu_ThongTinQD_Id': "",
            'strSoQuyetDinh': "",
            'strNgayQuyetDinh': edu.util.getValById("txtHocHam_NgayKyQuyetDinhBoNhiem"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': edu.util.getValById("txtHocHam_NgayKyQuyetDinhQDBoNhiem"),
            'strThongTinQuyetDinh': edu.util.getValById("txtHocHam_NoiPhong"),
            'strLoaiQuyetDinh_Id': "",
            'strNgayHetHieuLuc': "",
            'iTrangThai': 1,
            'strChuyenNganh': edu.util.getValById("txtHocHam_ChuyenNganh"),
            'strThoiHan': edu.util.getValById("txtHocHam_ThoiHan"),
            'strQuyetDinhBoNhiem': edu.util.getValById("txtHocHam_SoQDBoNhiem"),
            'strQuyetDinhCongNhanDatChuan': edu.util.getValById("txtHocHam_SoQDCongNhan"),
            'strChucDanh_Id': edu.util.getValById("dropHocHam_ChucDanh"),
            'strMoTa': edu.util.getValById("txtHocHam_MoTa"),
            'strNamPhongChucDanh': edu.util.getValById("txtHocHam_NgayPhong"),
            'strNoiPhongChucDanh': edu.util.getValById("txtHocHam_NoiPhong"),
            'iThuTu': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
    popup_HocHam: function () {
    $("#zoneHocHam_input").slideDown();
    },
    resetPopup_HocHam: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtHocHam_ChuyenNganh");
        edu.util.resetValById("dropHocHam_ChucDanh");
        edu.util.resetValById("txtHocHam_NgayPhong");
        edu.util.resetValById("txtHocHam_NoiPhong");
        edu.util.resetValById("txtHocHam_ThuTu");
        edu.util.resetValById("txtHocHam_MoTa");
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
            sort: true,
            colPos: {
                center: [0, 2, 4, 5],
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
        me.getList_HocHam_NhiemVu();
    },
    save_HocHam_NhiemVu: function (strNhiemVu_Id, strHocHam_Id) {
        var me = this;
        var strId = strNhiemVu_Id;
        var strNgayApDung = edu.util.getValById('txtNgayApDung' + strNhiemVu_Id);
        var strLoaiQuyetDinh = edu.util.getValById('dropLoaiQuyetDinh' + strNhiemVu_Id);
        var strSoQuyetDinh = edu.util.getValById('txtSoQuyetDinh' + strNhiemVu_Id);
        var strNgayQuyetDinh = edu.util.getValById('txtNgayQuyetDinh' + strNhiemVu_Id);
        var strNgayHieuLuc = edu.util.getValById('txtNgayHieuLuc' + strNhiemVu_Id);
        var strThongTinQuyetDinh = edu.util.getValById('txtNhiemVu' + strNhiemVu_Id);
        var strNgayHetHieuLuc = edu.util.getValById('txtNgayHetHieuLuc' + strNhiemVu_Id);
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
            'strNgayApDung': strNgayApDung,
            'strNguonDuLieu_Id': strHocHam_Id,
            'strNhanSu_HoSoCanBo_Id':  me.strNhanSu_Id,
            'strSoQuyetDinh': strSoQuyetDinh,
            'strNgayQuyetDinh': strNgayQuyetDinh,
            'strNguoiKyQuyetDinh': '',
            'strNgayHieuLuc': strNgayHieuLuc,
            'strThongTinQuyetDinh': strThongTinQuyetDinh,
            'strThongTinDinhKem': '',
            'strLoaiQuyetDinh_Id': strLoaiQuyetDinh,
            'strNgayHetHieuLuc': strNgayHetHieuLuc,
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
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(obj_save + ": " + data.Message);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strNhiemVu_Id, strId, "NS_Files");                
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);                
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
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
                        content: "NS_ThongTinQuyetDinh/Xoa: " + data.Message,
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
            row += '<td><input type="text" id="txtNgayApDung' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYQUYETDINH) + '" class="form-control input-datepicker_X"/></td>';
            row += '<td><input type="text" id="txtNgayHieuLuc' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHIEULUC) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgayHetHieuLuc' + strNhiemVu_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYHETHIEULUC) + '" class="form-control"/></td>';
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
        row += '<td><input type="text" id="txtNgayApDung' + strNhiemVu_Id + '" class="form-control input-datepicker_X"/></td>';
        row += '<td><input type="text" id="txtNgayHieuLuc' + strNhiemVu_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgayHetHieuLuc' + strNhiemVu_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNhiemVu' + strNhiemVu_Id + '" class="form-control"/></td>';
        row += '<td><div id="txtFileDinhKem' + strNhiemVu_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strNhiemVu_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblHocHam_QDGiaoNhhiemVu tbody").append(row);
        edu.system.uploadFiles(["txtFileDinhKem" + strNhiemVu_Id]);
        edu.system.pickerdate("input-datepicker_X");
        me.genComBo_LoaiQuyetDinh("dropLoaiQuyetDinh" + strNhiemVu_Id, "");
        edu.system.viewFiles("txtFileDinhKem" + strNhiemVu_Id, strNhiemVu_Id, "NS_Files");
    },
    getList_DanhHieu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DanhHieu/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
    save_DanhHieu: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_DanhHieu/ThemMoi',            

            'strId': '',
            'strNgayApDung': edu.util.getValById("txtDanhHieu_NgayApDung"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("txtDanhHieu_QuyetDinh_ID"),
            'strSoQuyetDinh': edu.util.getValById("txtDanhHieu_SoQD"),
            'strNgayQuyetDinh': edu.util.getValById("txtDanhHieu_NgayQuyetDinh"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': edu.util.getValById("txtDanhHieu_NgayHieuLuc"),
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropDanhHieu_LoaiQuyetDinh"),
            'strNgayHetHieuLuc': edu.util.getValById("txtDanhHieu_NgayHetHieuLuc"),
            'strDanhHieu_Id': edu.util.getValById("dropDanhHieu_Loai"),
            'strNamPhong': edu.util.getValById("txtDanhHieu_NgayPhong"),
            'strNoiPhong': edu.util.getValById("txtDanhHieu_NoiPhong"),
            'strMoTa': edu.util.getValById("txtDanhHieu_MoTa"),
            'iTrangThai': 1,
            'iThuTu': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_DanhHieu/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_DANHHIEU");
                        setTimeout(function () {
                            edu.system.saveFiles("txtDanhHieu_ThongTinDinhKem", data.Id, "NS_Files");
                        }, 100)
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
    popup_DanhHieu: function () {
        $("#zoneDanhHieu_input").slideDown();
    },
    resetPopup_DanhHieu: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropDanhHieu_Loai");
        edu.util.resetValById("txtDanhHieu_NgayPhong");
        edu.util.resetValById("txtDanhHieu_NoiPhong");
        edu.util.resetValById("txtDanhHieu_QuyetDinh_ID");
        edu.util.resetValById("dropDanhHieu_LoaiQuyetDinh");
        edu.util.resetValById("txtDanhHieu_SoQD");
        edu.util.resetValById("txtDanhHieu_NgayQuyetDinh");
        edu.util.resetValById("txtDanhHieu_NgayApDung");
        edu.util.resetValById("txtDanhHieu_NgayHieuLuc");
        edu.util.resetValById("txtDanhHieu_NgayHetHieuLuc");
        edu.util.resetValById("txtDanhHieu_MoTa");
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
        edu.util.viewValById("dropDanhHieu_Loai", data.DANHHIEU_ID);
        edu.util.viewValById("txtDanhHieu_NgayPhong", data.NAMPHONG);
        edu.util.viewValById("txtDanhHieu_NoiPhong", data.NOIPHONG);
        edu.util.viewValById("txtDanhHieu_QuyetDinh_ID", data.NOIPHONG);
        edu.util.viewValById("txtDanhHieu_SoQD", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtDanhHieu_NgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtDanhHieu_NgayApDung", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtDanhHieu_NgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtDanhHieu_NgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtDanhHieu_MoTa", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.system.viewFiles("txtDanhHieu_ThongTinDinhKem", data.ID, "NS_Files");
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.QuaTrinhSucKhoe;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
}