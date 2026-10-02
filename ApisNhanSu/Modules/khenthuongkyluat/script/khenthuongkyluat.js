function KhenThuongKyLuat() { };
KhenThuongKyLuat.prototype = {
    strCommon_Id: '',
    dtNhanSu: [],
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    arrValid_KhenThuong: [],
    arrValid_KyLuat: [],
    arrNhanSu_Id: [],
    strQuyetDinh_Id: '',

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
            edu.util.toggle_overide("zonecontent", "zone_main");
        });
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            me.getList_KhenThuong();
            me.getList_KyLuat();
            $("#zoneEdit").slideDown();
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            edu.system.viewFiles("txtThongTinDinhKem", me.strNhanSu_Id, "NS_Files");
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];           
            me.viewForm_NhanSu(data);
            edu.util.toggle_overide("zonecontent", "zone_main");
            $("#tblInput_TTS_ThanhVien tbody").html("");
            me.arrNhanSu_Id = [];
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
                me.getDetail_KhenThuong(strId);
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

        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $(".btnSearchTTS_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_TTS_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeTai_ThanhVien(strNhanSu_Id);
                });
            }
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        setTimeout(function () {
            me.getList_HS();
        }, 150);
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropKL_QuyetDinh,dropKT_QuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTKT, "dropKT_ThanhTich");
        edu.system.loadToCombo_DanhMucDuLieu("NS.HINHTHUCKHENTHUONG", "dropKT_HinhThuc");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropKT_Cap");
        edu.system.loadToCombo_DanhMucDuLieu("NS.HINHTHUCKYLUAT", "dropKyLuat_HinhThucKyLuat");
        edu.system.switchLoaiKhac("dropKT_HinhThuc", "txtHinhThucKhenThuong_Khac", true);
        edu.system.switchLoaiKhac("dropKyLuat_HinhThucKyLuat", "txtKL_HinhThucKyLuat", true);
        me.getList_QuyetDinh();
        edu.system.uploadFiles(["txtThongTinDinhKem", "txtKL_ThongTinDinhKem"]);
        me.getList_CoCauToChuc();
        me.arrValid_KhenThuong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtCoQuanKhenThuong", "THONGTIN1": "EM" },
            { "MA": "txtThanhTichKhenThuong", "THONGTIN1": "EM" },
            { "MA": "dropKT_HinhThuc", "THONGTIN1": "EM" },
            { "MA": "dropKT_Cap", "THONGTIN1": "EM" },
            { "MA": "txtKT_SoQD", "THONGTIN1": "EM" },
            { "MA": "txtKT_NgayKyQD", "THONGTIN1": "EM" },
            { "MA": "txtKT_NgayKyQD", "THONGTIN1": "EM" },
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
        var me = main_doc.KhenThuongKyLuat;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhenThuongKyLuat.getList_HS()",
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
        var me = main_doc.KhenThuongKyLuat;
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
    getList_KhenThuong: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_KhenThuong/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
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
        var strNgayQuyetDinh = edu.util.getValById("txtNgayKy");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayQuyetDinh, strHomNay); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày ký quyết định không được lớn hơn ngày hiện tại!");
            return;
        }
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
            'strHinhThucKhenThuong': "",
            'strCoQuanKhenThuong': edu.util.getValById("txtCoQuanKhenThuong"),
            'strThongTinDinhKem': "",
            'strNhanSu_ThongTinQD_Id': me.strQuyetDinh_Id,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strCommon_Id != "") {
            obj_save.action = 'NS_QT_KhenThuong/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        if (!obj_save.strId) {
            me.arrNhanSu_Id.forEach(e => {
                var obj_clone = { ...obj_save };
                obj_clone.strNhanSu_HoSoCanBo_Id = e;
                edu.system.makeRequest({
                    success: function (data) {
                        edu.system.alert("Thêm mới thành công");
                        edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files"); me.getList_KhenThuong();
                    },
                    error: function (er) {
                    },
                    type: "POST",
                    action: obj_clone.action,
                    contentType: true,
                    data: obj_clone,
                    fakedb: [
                    ]
                }, false, false, false, null);
                
            });
        }
        return;
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
        edu.util.viewValById("txtNamKhenThuong", "");
        edu.util.viewValById("txtCoQuanKhenThuong", "");
        edu.util.viewValById("dropKT_HinhThuc", "");
        edu.util.viewValById("txtThanhTichKhenThuong", "");
        edu.util.viewValById("dropKT_Cap", "");
        edu.util.viewValById("dropKhenThuong_QuyetDinh", "");
        edu.util.viewValById("txtKT_SoQD", "");
        edu.util.viewValById("txtKT_NgayKyQD", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
        edu.util.viewValById("txtThuTu", 0);
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
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KhenThuong: function (data) {
        var me = this;
        me.popup_KhenThuong();
        edu.util.viewValById("txtThanhTichKhenThuong", data.THANHTICHKHENTHUONG_KHAC);
        //edu.util.viewValById("txtNamKhenThuong", data.NAMKHENTHUONG);
        edu.util.viewValById("txtCoQuanKhenThuong", data.COQUANKHENTHUONG);
        edu.util.viewValById("dropKT_HinhThuc", data.HINHTHUCKHENTHUONG_ID);
        $('#dropKT_HinhThuc').trigger({ type: 'select2:select' });
        edu.util.viewValById("txtHinhThucKhenThuong_Khac", data.HINHTHUCKHENTHUONG);
        edu.util.viewValById("dropKT_Cap", data.CAPKHENTHUONG_ID);
        //edu.util.viewValById("dropKT_QuyetDinh", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("txtKT_SoQD", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtKT_NgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        //edu.util.viewValById("txtKT_NgayApDung", data.NAMKHENTHUONG);
        //edu.util.viewValById("txtKT_NgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("dropKT_QuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtKT_NgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtKT_NgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtKT_NgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHHL);
        //edu.util.viewValById("txtKT_NgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
        me.strCommon_Id = data.ID;
        me.strQuyetDinh_Id = data.NHANSU_THONGTINQUYETDINH_ID;
        $("#myModalLabel_KhenThuong").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình khen thưởng');
    },
    getList_KyLuat: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_KyLuat/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
        var strNgayQuyetDinh = edu.util.getValById("txtKL_NgayKy");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayQuyetDinh, strHomNay); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày ký quyết định không được lớn hơn ngày hiện tại!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_KyLuat/ThemMoi',            

            'strId': '',
            'strNgayQuyetDinh': edu.util.getValById("txtKL_NgayKyQuyetDinh"),
            'strSoQuyetDinh': edu.util.getValById("txtKL_SoQD"),
            'strNguoiKyQuyetDinh': '',
            'strNgayHieuLuc': '',
            'strThongTinQuyetDinh': '',
            'strLoaiQuyetDinh_Id': '',
            'strNgayHetHieuLuc': '',
            'strLyDo': edu.util.getValById("txtKL_LyDoKyLuat"),
            'strHinhThucKyLuat_Id': edu.util.getValById("dropKyLuat_HinhThucKyLuat"),
            'strHinhThucKyLuat': edu.util.getValById("txtKL_HinhThucKyLuat"),
            'strNamKyLuat': '',
            'strCoQuanKyLuat': edu.util.getValById("txtKL_CoQuanKyLuat"),
            'strThongTinDinhKem': "",
            'strNhanSu_ThongTinQD_Id': '',
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
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
        edu.util.viewValById("txtKL_NamKyLuat", "");
        edu.util.viewValById("txtKL_NganhKyLuat", "");
        edu.util.viewValById("txtKL_HinhThucKyLuat", "");
        edu.util.viewValById("dropKyLuat_QuyetDinh", "");
        edu.util.viewValById("txtKL_SoQuyetDinh", "");
        edu.util.viewValById("txtKL_NgayKy", "");
        edu.system.viewFiles("txtKL_ThongTinDinhKem", "");
        edu.util.viewValById("txtKL_ThuTu", 0);
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
        edu.util.viewValById("txtKL_HinhThucKyLuat", data.HINHTHUCKYLUAT);
        edu.util.viewValById("txtKL_LyDoKyLuat", data.LYDO);///
        edu.util.viewValById("txtKL_SoQD", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtKL_NgayKyQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.system.viewFiles("txtKL_ThongTinDinhKem", data.ID, "NS_Files");
        me.strCommon_Id = data.ID;
        $("#myModalLabel_KyLuat").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình kỷ luật');
    },
    getList_QuyetDinh: function () {
        var me = this;        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genComBo_QuyetDinh(dtResult);
                }
                else {
                    edu.system.alert("NS_ThongTinQuyetDinh/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_ThongTinQuyetDinh/LayDanhSach (ex): " + JSON.stringify(er), "w");                
            },
            type: 'GET',
            action: 'NS_ThongTinQuyetDinh/LayDanhSach',            
            contentType: true,            
            data: {
                'strTuKhoa': "",
                'iTrangThai': 1,
                'strNgayHieuLuc_Tu': "",
                'strNgayHieuLuc_Den': "",
                'strLoaiQuyetDinh_Id': "",
                'strThanhVien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genComBo_QuyetDinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "SOQUYETDINH",
                code: "MA"
            },
            renderPlace: ["dropKhenThuong_QuyetDinh", "dropKyLuat_QuyetDinh"],
            type: "",
            title: "Chọn quyết định"
        };
        edu.system.loadToCombo_data(obj);
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.QuaTrinhSucKhoe;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
    
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.KhenThuongKyLuat;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_TTS_ThanhVien tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_TTS_ThanhVien tbody").html("");
            $("#tblInput_TTS_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
}