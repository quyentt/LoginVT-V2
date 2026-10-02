function HopDongCanBo() { };
HopDongCanBo.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    dtNhanSu: [],
    tab_actived: [],
    tab_item_actived: [],
    arrValid_HopDong: [],

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
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href"); //activated tab
            var check = edu.util.arrEqualVal(me.tab_actived, target);
            if (!check) {
                me.tab_actived.push(target);
                switch (target) {
                    case "#tab_1":
                        //me.open_Collapse("key_hopdongcanbo");
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
        $('a[href="#tab_1"]').trigger("shown.bs.tab");
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.reset_HS();
            me.toggle_form();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            $("#zoneEdit").slideDown();
            me.getList_HopDongCanBo();
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearchCapNhat_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#txtSearch_CapNhat_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
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
        $("#btnSaveRe").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HopDong);
            if (valid) {
                me.save_HopDongCanBo();
                setTimeout(function () {
                    me.resetPopup_HopDongCanBo();
                }, 1000);
            }
        });
        $("#btnSave").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HopDong);
            if (valid) {
                me.save_HopDongCanBo();
            }
        });
        $("#tbl_HopDongCanBo").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_HopDongCanBo");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_HopDongCanBo(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HopDongCanBo").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_HopDongCanBo");
                $("#btnYes").click(function (e) {
                    me.delete_HopDongCanBo(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnViewHopDong_DuBao").click(function () {
            me.toggle_list();
            me.getList_HetHanHopDong();
        });
    },
    page_load: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOAIHOPDONG", "drop_LoaiHopDong");
        edu.system.loadToCombo_DanhMucDuLieu("NS.HINHTHUCTUYENDUNG", "drop_HinhThucTuyenDung");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.page_load();
        me.toggle_notify();
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.getList_HS();
        }, 150);
        me.arrValid_HopDong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txt_SoHopDong", "THONGTIN1": "EM" },
            { "MA": "txt_NgayBDHieuLuc", "THONGTIN1": "EM" },
            { "MA": "txt_NgayKyHD", "THONGTIN1": "EM" },
            { "MA": "drop_LoaiHopDong", "THONGTIN1": "EM" },
            { "MA": "drop_DonViTuyenDung", "THONGTIN1": "EM" },
        ];
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HetHanHopDong");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_HetHanHopDong");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_HopDong");
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
        var me = main_doc.HopDongCanBo;
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
            renderPlace: ["dropNS_CoCauToChuc", "drop_DonViTuyenDung"],
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
            case "key_hopdongcanbo":
                me.resetPopup_HopDongCanBo();
                me.popup_HopDongCanBo();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        switch (key) {
            case "key_hopdongcanbo":
                me.getList_HopDongCanBo();
                break;
        }
    },
    getList_HS: function () {
        var me = main_doc.HopDongCanBo;        
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
        var me = main_doc.HopDongCanBo;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HopDongCanBo.getList_HS()",
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
    getList_HopDongCanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinHopDong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_HopDongCanBo(data.Data, data.Pager);
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
    save_HopDongCanBo: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_ThongTinHopDong/ThemMoi',            

            'strId': '',
            'strTinhTrang_Id': "",
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("drop_DonViTuyenDung"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strDieu1_HinhThucTuyen_Id': edu.util.getValById("drop_HinhThucTuyenDung"),
            'strNgayTuyenDung': "",
            'strNgayHieuLucHopDong': edu.util.getValById("txt_NgayBDHieuLuc"),
            'strNgayHetHieuLucHopDong': edu.util.getValById("txt_NgayHetHieuLuc"),
            'strNgayKyHopDong': edu.util.getValById("txt_NgayKyHD"),
            'strSoHopDong': edu.util.getValById("txt_SoHopDong"),
            'strDieu3_DongBaoHiem_Id': "",
            'strDieu3_CheDoPhucLoi_Id': "",
            'strDieu3_HinhThucTra_Id': "",
            'strDieu3_BangQuyDinhLuong_Id': "",
            'strDieu3_HeSoLuong': "",
            'strDieu3_Bac': "",
            'strDieu3_Ngach_Id': "",
            'strDieu3_PhuongTienDiLai_Id': "",
            'strDieu2_ThoiGianLamViec_Id': "",
            'strDieu1_CongViecPhaiLam': edu.util.getValById("txtCongViecDamNhan"),
            'strDieu1_ChucDanhCM_Id': "",
            'strDieu1_DiaDiemLamViec': edu.util.getValById("txt_DiaDiemLamViec"),
            'strDieu1_DenNgay': "",
            'strDieu1_TuNgay': "",
            'strDieu1_LoaiHopDong_Id': edu.util.getValById("drop_LoaiHopDong"),
            'strBenB_NoiCapCMTND': "",
            'strBenB_NgayCapCMTND': "",
            'strBenB_SoCMTND': "",
            'strBenB_DiaChi': "",
            'strBenB_TrinhDoChuyenMon_Id': "",
            'strBenB_NamSinh': "",
            'strBenB_NgaySinh': "",
            'strBenB_ThangSinh': "",
            'strBenB_QuocTich_Id': "",
            'strBenB_Ten': "",
            'strBenB_HoDem': "",
            'strBenA_DienThoai': "",
            'strBenA_DiaChi': "",
            'strBenA_DonVi_Id': "",
            'strBenA_ChucVu_Id': "",
            'strBenA_QuocTich_Id': "",
            'strBenA_NguoiKy_Id': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_ThongTinHopDong/CapNhat';
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
                    me.getList_HopDongCanBo();
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
    delete_HopDongCanBo: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'NS_ThongTinHopDong/Xoa',
            
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
                    me.getList_HopDongCanBo();
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
    getDetail_HopDongCanBo: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_ThongTinHopDong/LayChiTiet',
            
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
                        me.editForm_HopDongCanBo(data.Data[0]);
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
    popup_HopDongCanBo: function () {
        $("#zoneHopDongCanBo_input").slideDown();
    },
    resetPopup_HopDongCanBo: function () {
        var me = this;
        me.strCommon_Id = "";
        me.strCommon_Id = "";
        edu.util.viewValById("txt_SoHopDong", "");
        edu.util.viewValById("txt_NgayKyHD", "");
        edu.util.viewValById("drop_LoaiHopDong", "");
        edu.util.viewValById("drop_HinhThucTuyenDung", "");
        edu.util.viewValById("drop_DonViTuyenDung", "");
        edu.util.viewValById("txt_NgayBDHieuLuc", "");
        edu.util.viewValById("txt_NgayHetHieuLuc", "");
        edu.util.viewValById("txt_DiaDiemLamViec", "");
        edu.util.viewValById("txtCongViecDamNhan", "");
    },
    genTable_HopDongCanBo: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tbl_HopDongCanBo",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "SOHOPDONG"
                },
                {
                    "mDataProp": "DIEU1_LOAIHOPDONG_TEN"
                },
                {
                    "mDataProp": "NGAYHIEULUCHOPDONG"
                },
                {
                    "mDataProp": "NGAYHETHIEULUCHOPDONG"
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
    editForm_HopDongCanBo: function (data) {
        var me = this;
        me.popup_HopDongCanBo();
        edu.util.viewValById("txt_SoHopDong", data.SOHOPDONG);
        edu.util.viewValById("txt_NgayKyHD", data.NGAYKYHOPDONG);
        edu.util.viewValById("drop_LoaiHopDong", data.DIEU1_LOAIHOPDONG_ID);
        edu.util.viewValById("drop_HinhThucTuyenDung", data.DIEU1_HINHTHUCTUYENDUNG_ID);
        edu.util.viewValById("drop_DonViTuyenDung", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txt_NgayBDHieuLuc", data.NGAYHIEULUCHOPDONG);
        edu.util.viewValById("txt_NgayHetHieuLuc", data.NGAYHETHIEULUCHOPDONG);
        edu.util.viewValById("txt_DiaDiemLamViec", data.DIEU1_DIADIEMLAMVIEC);
        edu.util.viewValById("txtCongViecDamNhan", data.DIEU1_CONGVIECPHAILAM);
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.HopDongCanBo;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
    getList_HetHanHopDong: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_SapHetHanHopDong/LapDSSapHetHanHD',

            'strNguoiThucHien_Id': edu.system.userId,
            'dSoThangDuBaoTruoc': 20,
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
                    edu.system.alert("NS_SapHetHanHopDong/LapDSSapHetHanHD: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NS_SapHetHanHopDong/LapDSSapHetHanHD (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HetHanHopDong: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblHetHanHopDong_DuKien_Tong", data.length);
        edu.util.viewHTMLById("lblCount_HetHanHopDong", data.length);
        var jsonForm = {
            strTable_Id: "tblHetHanHopDong_DuBao",
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
                    "mDataProp": "NGAYHIEULUCHOPDONG"
                },
                {
                    "mDataProp": "NGAYHETHIEULUCHOPDONG"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}