function QuaTrinhCongTac() { };
QuaTrinhCongTac.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    strThuyenChuyen_Id:'',
    tab_actived: [],
    tab_item_actived: [],
    dtNhanSu: [],
    arrValid_QuaTrinhCongTac: [],
    arrValid_QuaTrinhDieuChuyen: [],

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
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });
        //$(".btnClose").click(function () {
        //    if (me.checkChange("zone_input_TTS")) {
        //        edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
        //        $("#btnYes").click(function (e) {
        //            me.toggle_form();
        //            $("#btnSave_TTS").trigger("click");
        //        });
        //    }
        //    me.toggle_notify();
        //});
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.reset_HS();
            $("#zoneEdit").slideDown();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            me.getList_TSBT();
            me.getList_ThuyenChuyen();
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
        $("#btnSaveRe_ThuyenChuyen").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_QuaTrinhDieuChuyen);
            //if (valid) {
            //    me.save_ThuyenChuyen();
            //    setTimeout(function () {
            //        me.resetPopup_ThuyenChuyen();
            //    }, 1000);
            //}         
            if (true) {
                if (edu.util.checkValue(me.strThuyenChuyen_Id)) {
                    me.update_ThuyenChuyen();
                }
                else {
                    me.save_ThuyenChuyen();
                }
                setTimeout(function () {
                    me.resetPopup_ThuyenChuyen();
                }, 1000);
            }
        });
        //$("#btnSave_ThuyenChuyen").click(function () {
        //   // var valid = edu.util.validInputForm(me.arrValid_QuaTrinhDieuChuyen);
        //    if (true) {
        //        if (edu.util.checkValue(me.strThuyenChuyen_Id)) {
        //            me.update_ThuyenChuyen();
        //        }
        //        else {
        //            me.save_ThuyenChuyen();
        //        }
        //    }
        //});
        $("#btnSave_ThuyenChuyen").click(function () {
            if (true) {
                if (edu.util.checkValue(me.strThuyenChuyen_Id)) {
                    me.update_ThuyenChuyen();
                }
                else {
                    me.save_ThuyenChuyen();
                }
            }
        });
        $("#tblThuyenChuyen").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);

            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            if (edu.util.checkValue(strId)) {
                me.strThuyenChuyen_Id = strId;
                me.getDetail_ThuyenChuyen(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThuyenChuyen");
                edu.system.viewFiles("txtThongTinDinhKem", strId, "NS_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThuyenChuyen").delegate(".btnDelete", "click", function () {
            //e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblThuyenChuyen");
                $("#btnYes").click(function (e) {
                    me.delete_ThuyenChuyen(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThuyenChuyen").delegate(".btnDownLoad", "click", function () {
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
        $("#tblThuyenChuyen").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_TCCB");
                setTimeout(function () {
                    me.getList_ThuyenChuyen();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $("#btnSaveRe_TSBT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhCongTac);
            if (valid) {
                me.save_TSBT();
                setTimeout(function () {
                    me.resetPopup_TSBT();
                }, 1000);
            }
        });
        $("#btnSave_TSBT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_QuaTrinhCongTac);
            if (valid) {
                me.save_TSBT();
            }
        });
        $("#tbl_TieuSuBanThan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_TieuSuBanThan");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_TSBT(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_TieuSuBanThan").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_TieuSuBanThan");
                $("#btnYes").click(function (e) {
                    me.delete_TSBT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        edu.system.getList_MauImport("zonebtnTCCB");
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NS.CDNN", "dropTSBT_ChucDanh");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "dropTSBT_ChucVu,dropChucVuCu,dropChucVuMoi");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMCV, "dropTSBT_ChucVu,dropChucVuCu,dropChucVuMoi");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LGV0", "dropTSBT_LoaiGiangVien");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDTH", "dropTH_TDTH");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDNN", "dropTDNN");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropHocVi");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.CNDT", "dropChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMNN, "dropTDNN_NgonNgu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TDCT, "dropTDCT_TrinhDo");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "drop_LoaiQuyetDinh,dropBB_QuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.HTDT", "dropHinhThuDaoTao,dropBB_HinhThuDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMHV", "dropBangCapChungChi,dropBB_BangCapChungChi", "", "", "Văn bằng/chứng chỉ");
        edu.system.uploadFiles(["txtThongTinDinhKem"]);
        me.getList_CoCauToChuc();
        me.arrValid_QuaTrinhCongTac = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTSBT_NgayBatDau", "THONGTIN1": "EM" },
        ];
        me.arrValid_QuaTrinhDieuChuyen = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "drop_LoaiQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtSoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtNgayApDung", "THONGTIN1": "EM" },
        ];
    },
    toggle_notify_DieuChuyen: function () {
        edu.util.toggle_overide("zone-bus", "zone_input");
    },
    toggle_form_DieuChuyen: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_main");
        setTimeout(function () {
            me.setCheckChange("zone_input_DieuChuyen");
        }, 1000);
    },
    setCheckChange: function (strZoneId) {
        var point = $("#" + strZoneId);
        var x = point.find("input, select, textarea");
        point.attr("checkchange", x.length);
        x.each(function () {
            var bVal = $(this).val();
            //if (bVal)
            $(this).attr("checkchange", bVal);
        });
    },
    checkChange: function (strZoneId) {
        var point = $("#" + strZoneId);
        var x = point.find("input, select, textarea");
        var bcheck = false;
        if (x.length != parseInt(point.attr("checkchange"))) return true;
        else {
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != $(x[i]).attr("checkchange")) {
                    console.log("OK");
                    return true;
                }
            }
        }
        return false;
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
        var me = main_doc.QuaTrinhCongTac;
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
                code: "MA",
            },
            renderPlace: ["dropDonViCu_TrongTruong", "dropDonViMoi_TrongTruong", "dropTSBT_DonViCongTac"],
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
            case "key_tieusubanthan":
                me.resetPopup_TSBT();
                me.popup_TSBT();
                break;
            case "key_thuyenchuyen":
                me.resetPopup_ThuyenChuyen();
                me.popup_ThuyenChuyen();
                break;
            case "key_trinhdotinhoc":
                me.resetPopup_TDTH();
                me.popup_TDTH();
                break;
            case "key_trinhdongoaingu":
                me.resetPopup_TDNN();
                me.popup_TDNN();
                break;
            case "key_hocham":
                me.resetPopup_HocHam();
                me.popup_HocHam();
                break;
            case "key_danhhieu":
                me.resetPopup_DanhHieu();
                me.popup_DanhHieu();
                break;
            case "key_hocvi":
                me.resetPopup_HocVi();
                me.popup_HocVi();
                break;
            case "key_daotao":
                me.resetPopup_DaoTao();
                me.popup_DaoTao();
                break;
            case "key_boiduong":
                me.resetPopup_BoiDuong();
                me.popup_BoiDuong();
                break;
        }
    },
    switch_GetData: function (key) {
        console.log(1111);
        var me = this;
        switch (key) {
            case "key_tieusubanthan":
                me.getList_TSBT();
                break;
            case "key_quanhegiadinh":
                me.getList_QHTT();
                break;
            case "key_thuyenchuyen":
                me.getList_ThuyenChuyen();
                break;
            case "key_doan":
                me.getList_Doan();
                break;
            case "key_congdoan":
                me.getList_CongDoan();
                break;
            case "key_trinhdochinhtri":
                me.getList_TDCT();
                break;
            case "key_trinhdotinhoc":
                me.getList_TDTH();
                break;
            case "key_trinhdongoaingu":
                me.getList_TDNN();
                break;
            case "key_hocham":
                me.getList_HocHam();
                break;
            case "key_danhhieu":
                me.getList_DanhHieu();
                break;
            case "key_hocvi":
                me.getList_HocVi();
                break;
            case "key_daotao":
                me.getList_DaoTao();
                break;
            case "key_boiduong":
                me.getList_BoiDuong();
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
        var me = main_doc.QuaTrinhCongTac;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhCongTac.getList_HS()",
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
    getList_TSBT: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TSBT(data.Data, data.Pager);
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
    save_TSBT: function () {
        var me = this;
        var obj_notify = {};
        var strTuNgay = edu.util.getValById("txtTSBT_TuNgay");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strTuNgay, strHomNay); console.log(check)
        if (check == 1) {
            objNotify = {
                content: "Ngày bắt đầu không được lớn hơn ngày hiện tại!",
                type: "w"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var strDenNgay = edu.util.getValById("txtTSBT_DenNgay");
        var check = edu.util.dateCompare(strDenNgay, strHomNay); console.log(check)
        if (check == 1) {
            objNotify = {
                content: "Ngày kết thúc không được lớn hơn ngày hiện tại!",
                type: "w"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var check = edu.util.dateCompare(strTuNgay, strDenNgay); console.log(check)
        if (check == 1) {
            objNotify = {
                content: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu!",
                type: "w"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/ThemMoi',            

            'strId': '',
            'strMoTa': edu.util.getValById("txtTSBT_MoTa"),
            'strTuNgay': edu.util.getValById("txtTSBT_NgayBatDau"),
            'strDenNgay': edu.util.getValById("txtTSBT_NgayKetThuc"),
            'strLoaiGiangVien_Id': edu.util.getValById('dropTSBT_LoaiGiangVien'),
            'strDonViCongTac_Id': edu.util.getValById("dropTSBT_DonViCongTac"),
            'strChucDanhNgheNghiep_Id': edu.util.getValById("dropTSBT_ChucDanh"),
            'strChucVu_Id': edu.util.getValById("dropTSBT_ChucVu"),
            'iTrangThai': 1,
            'iThuTu': 1,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_TieuSuBanThan_TruocTD/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TSTT");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TSBT();
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
    delete_TSBT: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/Xoa',
            
            'strIds': strIds,
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
                    me.getList_TSBT();
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
    getDetail_TSBT: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_TieuSuBanThan_TruocTD/LayChiTiet',
            
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
                        me.editForm_TSBT(data.Data[0]);
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
    popup_TSBT: function () {
        $("#zone_input").slideDown();
    },
    resetPopup_TSBT: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtTSBT_NgayBatDau");
        edu.util.resetValById("txtTSBT_NgayKetThuc");
        edu.util.resetValById("txtTSBT_MoTa");
        edu.util.resetValById("dropTSBT_DonViCongTac");
        edu.util.resetValById("dropTSBT_ChucDanh");
        edu.util.resetValById("dropTSBT_LoaiGiangVien");
        edu.util.resetValById("dropTSBT_ChucVu");
    },
    genTable_TSBT: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_TieuSuBanThan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_TSBT()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNGAY"
                }
                , {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "DONVICONGTAC_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "LOAIGIANGVIEN_TEN"
                },
                {
                    "mDataProp": "CHUCDANHNGHENGHIEP_TEN"
                },
                {
                    "mDataProp": "CHUCVU_TEN"
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
    editForm_TSBT: function (data) {
        var me = this;
        me.popup_TSBT();
        edu.util.viewValById("txtTSBT_NgayBatDau", data.TUNGAY);
        edu.util.viewValById("txtTSBT_NgayKetThuc", data.DENNGAY);
        edu.util.viewValById("txtTSBT_MoTa", data.MOTA);
        edu.util.viewValById("dropTSBT_DonViCongTac", data.DONVICONGTAC_ID);
        edu.util.viewValById("dropTSBT_ChucDanh", data.LOAICHUCDANHNGHENGHIEP_ID);
        edu.util.viewValById("dropTSBT_LoaiGiangVien", data.LOAIGIANGVIEN_ID);
        edu.util.viewValById("dropTSBT_ChucVu", data.CHUCVU_ID);
    },
    save_ThuyenChuyen: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        //var strHomNay = edu.util.dateToday();
        //kiểm tra ngày ký quyết định không được lớn hơn ngày hiện tại
        var strNgayHetHieuLuc = edu.util.getValById("txtNgayHetHieuLuc");
        var strNgayHieuLuc = edu.util.getValById("txtNgayHieuLuc");
        var check = edu.util.dateCompare(strNgayHieuLuc, strNgayHetHieuLuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!");
            return;
        }
        var strDonViCu_Id = edu.util.getValById("dropDonViCu_TrongTruong");
        var strDonViCu_NgoaiTruong = edu.util.getValById("txtDonViCu_NgoaiTruong");
        if (edu.util.checkValue(strDonViCu_Id) && edu.util.checkValue(strDonViCu_NgoaiTruong)) {
            strDonViCu_Id = strDonViCu_Id;
            strDonViCu_NgoaiTruong = "";
        }
        else {
            strDonViCu_Id = strDonViCu_Id;
            strDonViCu_NgoaiTruong = strDonViCu_NgoaiTruong;
        }
        var strDonViMoi_Id = edu.util.getValById("dropDonViMoi_TrongTruong");
        var strDonViMoi_NgoaiTruong = edu.util.getValById("txtDonViMoi_NgoaiTruong");
        if (edu.util.checkValue(strDonViMoi_Id) && edu.util.checkValue(strDonViMoi_NgoaiTruong)) {
            strDonViMoi_Id = strDonViMoi_Id;
            strDonViMoi_NgoaiTruong = "";
        }
        else {
            strDonViMoi_Id = strDonViMoi_Id;
            strDonViMoi_NgoaiTruong = strDonViMoi_NgoaiTruong;
        }
        var obj_save = {
            'action': 'NS_QT_ThuyenChuyenCanBo/ThemMoi',

            'strId': '',
            'strNhanSu_ThongTinQD_Id': edu.util.getValById('txtQuyetDinh_ID'),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': edu.util.getValById("txtNgayApDung"),
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': edu.util.getValById("drop_LoaiQuyetDinh"),
            'strNgayHetHieuLuc': edu.util.getValById("txtNgayHetHieuLuc"),
            'iTrangThai': 1,
            'strNoiDung': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNgayChuyen': edu.util.getValById("txtNgayApDung"),
            'strDonViCu_Id': strDonViCu_Id,
            'strDonViMoi_Id': strDonViMoi_Id,
            'strDonViCu_NgoaiTruong': strDonViCu_NgoaiTruong,
            'strDonViMoi_NgoaiTruong': strDonViMoi_NgoaiTruong,
            'strChucVuCu_Id': edu.util.getValById("dropChucVuCu"),
            'strChucVuMoi_Id': edu.util.getValById("dropChucVuMoi"),
            'strThongTinDinhKem': "",
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        var strThuyenChuyen_Id = data.Id;
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TCCB");
                        edu.system.saveFiles("txtThongTinDinhKem", strThuyenChuyen_Id, "NS_Files");
                        edu.system.alert("Tiến trình thực hiện thành công!");
                    }
                    setTimeout(function () {
                        me.getList_ThuyenChuyen();
                    }, 3050);
                    me.setCheckChange("zone_input_DieuChuyen");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + JSON.stringify(data.Message));
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_ThuyenChuyen: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        //var strHomNay = edu.util.dateToday();
        //kiểm tra ngày ký quyết định không được lớn hơn ngày hiện tại
        var strNgayHetHieuLuc = edu.util.getValById("txtNgayHetHieuLuc");
        var strNgayHieuLuc = edu.util.getValById("txtNgayHieuLuc");
        var check = edu.util.dateCompare(strNgayHieuLuc, strNgayHetHieuLuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!");
            return;
        }
        var strDonViCu_Id = edu.util.getValById("dropDonViCu_TrongTruong");
        var strDonViCu_NgoaiTruong = edu.util.getValById("txtDonViCu_NgoaiTruong");
        if (edu.util.checkValue(strDonViCu_Id) && edu.util.checkValue(strDonViCu_NgoaiTruong)) {
            strDonViCu_Id = strDonViCu_Id;
            strDonViCu_NgoaiTruong = "";
        }
        else {
            strDonViCu_Id = strDonViCu_Id;
            strDonViCu_NgoaiTruong = strDonViCu_NgoaiTruong;
        }
        var strDonViMoi_Id = edu.util.getValById("dropDonViMoi_TrongTruong");
        var strDonViMoi_NgoaiTruong = edu.util.getValById("txtDonViMoi_NgoaiTruong");
        if (edu.util.checkValue(strDonViMoi_Id) && edu.util.checkValue(strDonViMoi_NgoaiTruong)) {
            strDonViMoi_Id = strDonViMoi_Id;
            strDonViMoi_NgoaiTruong = "";
        }
        else {
            strDonViMoi_Id = strDonViMoi_Id;
            strDonViMoi_NgoaiTruong = strDonViMoi_NgoaiTruong;
        }
        var obj_save = {
            'action': 'NS_QT_ThuyenChuyenCanBo/CapNhat',

            'strId': me.strThuyenChuyen_Id,
            'strNhanSu_ThongTinQD_Id': edu.util.getValById('txtQuyetDinh_ID'),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayQuyetDinh"),
            'strNgayApDung': edu.util.getValById("txtNgayApDung"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': edu.util.getValById("txtNgayHieuLuc"),
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': edu.util.getValById("drop_LoaiQuyetDinh"),
            'strNgayHetHieuLuc': edu.util.getValById("txtNgayHetHieuLuc"),
            'iTrangThai': 1,
            'strNoiDung': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNgayChuyen': edu.util.getValById("txtNgayChuyen"),
            'strDonViCu_Id': strDonViCu_Id,
            'strDonViMoi_Id': strDonViMoi_Id,
            'strDonViCu_NgoaiTruong': strDonViCu_NgoaiTruong,
            'strDonViMoi_NgoaiTruong': strDonViMoi_NgoaiTruong,
            'strChucVuCu_Id': edu.util.getValById("dropChucVuCu"),
            'strChucVuMoi_Id': edu.util.getValById("dropChucVuMoi"),
            'strThongTinDinhKem': "",
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThuyenChuyen_Id = me.strThuyenChuyen_Id;
                    edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TCCB");                    
                    edu.system.saveFiles("txtThongTinDinhKem", strThuyenChuyen_Id, "NS_Files");
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    setTimeout(function () {
                        me.getList_ThuyenChuyen();
                    }, 3050);
                    me.setCheckChange("zone_input_DieuChuyen");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + JSON.stringify(data.Message));
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThuyenChuyen: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_ThuyenChuyenCanBo/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_ThuyenChuyen(data.Data);
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
    getDetail_ThuyenChuyen: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_ThuyenChuyenCanBo/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThuyenChuyen(data.Data[0]);
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
    delete_ThuyenChuyen: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_ThuyenChuyenCanBo/Xoa',
            
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
                    me.getList_ThuyenChuyen();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + JSON.stringify(data.Message),
                        code: "w",
                    };
                    edu.system.afterComfirm(obj);
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
    popup_ThuyenChuyen: function () {
        $("#zone_input_DieuChuyen").slideDown();
    },
    resetPopup_ThuyenChuyen: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("txtQuyetDinh_ID", "");
        edu.util.viewValById("drop_LoaiQuyetDinh", "");
        edu.util.viewValById("txtSoQuyetDinh", "");
        edu.util.viewValById("txtNgayQuyetDinh", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtNgayHieuLuc", "");
        edu.util.viewValById("txtNgayHetHieuLuc", "");
        edu.util.viewValById("txtNgayChuyen", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
        edu.util.viewValById("dropDonViCu_TrongTruong", "");
        edu.util.viewValById("txtDonViCu_NgoaiTruong", "");
        edu.util.viewValById("dropDonViMoi_TrongTruong", "");
        edu.util.viewValById("txtDonViMoi_NgoaiTruong", "");
        edu.util.viewValById("dropChucVuMoi", "");
        edu.util.viewValById("dropChucVuCu", "");
    },
    genTable_ThuyenChuyen: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThuyenChuyen",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 5, 6, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYCHUYEN"
                },
                {
                    "mDataProp": "DONVICU_TENDONVI"
                },
                {
                    "mDataProp": "DONVICU_NGOAITRUONG"
                },
                {
                    "mDataProp": "DONVIMOI_TENDONVI"
                },
                {
                    "mDataProp": "DONVIMOI_NGOAITRUONG"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mData": "LAQUATRINHHIENTAI",
                    "mRender": function (nRow, aData) {
                        if (aData.LAQUATRINHHIENTAI == "CUOICUNG") return '<span><a class="btn" id="' + aData.ID + '" title="Đây là trạng thái cuối của quá trình"><i style="font-size: 25px" class="fa fa-toggle-on color-active"></i></a></span>'
                        return '<span><a class="btn btnSetTrangThaiCuoi" id="' + aData.ID + '" title="Thiết lập trạng thái cuối cùng"><i style="font-size: 25px"  class="fa fa-toggle-off"></i></a></span>';
                    }
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
    viewForm_ThuyenChuyen: function (data) {
        var me = this;
        me.popup_ThuyenChuyen();
        me.strCommon_Id = data.ID;
        edu.util.viewValById("txtQuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("drop_LoaiQuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtNgayQuyetDinh", data.NGAYQUYETDINH);
        edu.util.viewValById("txtNgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtNgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtNgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.util.viewValById("dropDonViCu_TrongTruong", data.DONVICU_ID);
        edu.util.viewValById("txtDonViCu_NgoaiTruong", data.DONVICU_NGOAITRUONG);
        edu.util.viewValById("dropDonViMoi_TrongTruong", data.DONVIMOI_ID);
        edu.util.viewValById("txtDonViMoi_NgoaiTruong", data.DONVIMOI_NGOAITRUONG);
        edu.util.viewValById("txtNgayChuyen", data.NGAYCHUYEN);
        edu.util.viewValById("txtNgayKy", data.NHANSU_THONGTINQUYETDINH_NGAYKY);
        edu.util.viewValById("dropChucVuMoi", data.CHUCVUMOI_ID);
        edu.util.viewValById("dropChucVuCu", data.CHUCVUCU_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.QuaTrinhCongTac;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
}