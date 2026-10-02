/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function QuaTrinhDaoTao() { };
QuaTrinhDaoTao.prototype = {
    do_table: '',
    strCommon_Id: '',
    strDaoTao_Id: "",
    tab_actived: [],
    tab_item_actived: [],
    arrValid_DaoTao: [],
    arrValid_BoiDuong: [],
    arrValid_HocVi: [],
    arrValid_TDCT: [],
    arrValid_TDTH: [],
    arrValid_TDNN: [],

    dtDaoTao: [],
    dtDaoTao_Full: [],
    dtTienDo: [],
    dtGiaHan: [],
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
        --Discription: [tab_4] Trinh do chinh tri
        -------------------------------------------*/
        $("#btnSaveRe_TDCT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TDCT);
            if (valid) {
                me.save_TDCT();
                setTimeout(function () {
                    me.resetPopup_TDCT();
                }, 1000);
            }
        });
        $("#btnSave_TDCT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TDCT);
            if (valid) {
                me.save_TDCT();
            }
        });
        $("#tbl_TrinhDoChinhTri").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_TrinhDoChinhTri");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_TDCT(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_TrinhDoChinhTri").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_TrinhDoChinhTri");
                $("#btnYes").click(function (e) {
                    me.delete_TDCT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_TrinhDoChinhTri").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_TDLL");
                setTimeout(function () {
                    me.getList_TDCT();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        /*------------------------------------------
        --Discription: [tab_4] Trinh do tin hoc
        -------------------------------------------*/
        $("#btnSaveRe_TDTH").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TDTH);
            if (valid) {
                me.save_TDTH();
                setTimeout(function () {
                    me.resetPopup_TDTH();
                }, 1000);
            }
        });
        $("#btnSave_TDTH").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TDTH);
            if (valid) {
                me.save_TDTH();
            }
        });
        $("#tblTDTH").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tblTDTH");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_TDTH(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTDTH").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblTDTH");
                $("#btnYes").click(function (e) {
                    me.delete_TDTH(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTDTH").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_TDTH");
                setTimeout(function () {
                    me.getList_TDTH();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        /*------------------------------------------
        --Discription: [tab_4] Trinh do ngoai ngu
        -------------------------------------------*/
        $("#btnSaveRe_TDNN").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TDNN);
            if (valid) {
                me.save_TDNN();
                setTimeout(function () {
                    me.resetPopup_TDNN();
                }, 1000);
            }
        });
        $("#btnSave_TDNN").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_TDNN);
            if (valid) {
                me.save_TDNN();
            }
        });
        $("#tbl_TrinhDoNgoaiNgu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_TrinhDoNgoaiNgu");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_TDNN(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_TrinhDoNgoaiNgu").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_TrinhDoNgoaiNgu");
                $("#btnYes").click(function (e) {
                    me.delete_TDNN(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_TrinhDoNgoaiNgu").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_TDNN");
                setTimeout(function () {
                    me.getList_TDNN();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });

        /*------------------------------------------
        --Discription: [tab_5] Hoc ham
        -------------------------------------------*/
        $("#btnSave_HocVi").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HocVi);
            if (valid) {
                me.save_HocVi();
            }
        });
        $("#btnSaveRe_HocVi").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HocVi);
            if (valid) {
                me.save_HocVi();
                setTimeout(function () {
                    me.resetPopup_HocVi();
                }, 1000);
            }
        });

        $("#tbl_HocVi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tbl_HocVi");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_HocVi(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
     
        $("#tbl_HocVi").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_HocVi");
                $("#btnYes").click(function (e) {
                    me.delete_HocVi(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HocVi").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_HOCVI");
                setTimeout(function () {
                    me.getList_HocVi();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        //$('a[href="#tab_1"]').trigger("shown.bs.tab");
        //$("#zoneEdit").slideDown();
        /*------------------------------------------
        --Discription: [tab_5] DaoTao
        -------------------------------------------*/
        $("#btnSaveRe_DaoTao").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DaoTao);
            if (valid) {
                me.save_DaoTao();
                setTimeout(function () {
                    me.resetPopup_DaoTao();
                }, 1000);
            }
        });
        $("#btnSave_DaoTao").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DaoTao);
            if (valid) {
                me.save_DaoTao();
            }
        });
        $("#tbl_DaoTao").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            if (edu.util.checkValue(strId)) {
                me.popup_DaoTao();
                me.resetPopup_DaoTao();
                me.strDaoTao_Id = strId;
                me.getDetail_DaoTao(strId);
                me.getList_DaoTao_TienDo();
                me.getList_DaoTao_GiaHan();
                edu.util.setOne_BgRow(strId, "tbl_DaoTao");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_DaoTao").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_DaoTao");
                $("#btnYes").click(function (e) {
                    me.delete_DaoTao(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_DaoTao").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_DATO");
                setTimeout(function () {
                    me.getList_DaoTao();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $("#tbl_DaoTao").delegate(".btnDownLoad", "click", function () {
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
        $("#zone_input").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDaoTao_TienDo tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DaoTao_TienDo(strId);
            });
        });
        $("#tblThanhVien").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDaoTao_GiaHan tr[id='" + strRowId + "']").remove();
        });
        $("#tblThanhVien").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DaoTao_GiaHan(strId);
            });
        });
        $("#btnThemDong_GiaHan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_GiaHan(id, "");
        });
        $("#btnThemDong_TienDoHocTap").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_TienDo(id, "");
        });
        /*------------------------------------------
        --Discription: [tab_5] BoiDuong
        -------------------------------------------*/
        $("#btnSaveRe_BoiDuong").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_BoiDuong);
            if (valid) {
                me.save_BoiDuong();
                setTimeout(function () {
                    me.resetPopup_BoiDuong();
                }, 1000);
            }
        });
        $("#btnSave_BoiDuong").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_BoiDuong);
            if (valid) {
                me.save_BoiDuong();
            }
        });
        $("#tbl_BoiDuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tbl_BoiDuong");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_BoiDuong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_BoiDuong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_BoiDuong");
                $("#btnYes").click(function (e) {
                    me.delete_BoiDuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_BoiDuong").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_BODU");
                setTimeout(function () {
                    me.getList_BoiDuong();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        $("#tbl_BoiDuong").delegate(".btnDownLoad", "click", function () {
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
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        //end_load: getDetail_HS
        edu.system.loadToCombo_DanhMucDuLieu("NS.GIAHAN", "", "", me.cbGetList_DaoTao_GiaHan);
        edu.system.loadToCombo_DanhMucDuLieu("NS.TIENDOHOCTAP", "", "", me.cbGetList_DaoTao_TienDo);
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDTH", "dropTH_TDTH");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDNN", "dropTDNN");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMNN", "dropTDNN_NgonNgu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropHocVi");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.CNDT", "dropChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.HTDT", "dropHinhThuDaoTao,dropBB_HinhThuDaoTao");
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMNN, "dropTDNN_NgonNgu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TDCT, "dropTDCT_TrinhDo");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh,dropBB_QuyetDinh");
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.QLCB.HTDT, "dropHinhThuDaoTao,dropBB_HinhThuDaoTao");
        //edu.system.loadToCombo_DanhMucDuLieu("QLCB.HTDT", "dropHinhThuDaoTao,dropBB_HinhThuDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMHV", "dropBangCapChungChi,dropBB_BangCapChungChi", "", "", "Văn bằng/chứng chỉ");
        edu.system.uploadFiles(["txtThongTinDinhKem", "txtBB_ThongTinDinhKem"]);
        edu.system.switchLoaiKhac("dropTH_TDTH", "txt_TH_TrinhDokhac", true);
        edu.system.switchLoaiKhac("dropBB_HinhThuDaoTao", "txtBB_HinhThuDaoTaoKhac", true);
        //$("#zoneEdit").slideDown();
        me.arrValid_DaoTao = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtNoiDaoTao", "THONGTIN1": "EM" },
            { "MA": "txtNganhDaoTao", "THONGTIN1": "EM" },
        ];
        me.arrValid_BoiDuong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtBB_DiaDiem", "THONGTIN1": "EM" },
            { "MA": "txtBB_NoiDung", "THONGTIN1": "EM" },
        ];
        me.arrValid_HocVi = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropHocVi", "THONGTIN1": "EM" },
            { "MA": "dropChuyenNganh", "THONGTIN1": "EM" },
            { "MA": "dropChuyenNganh", "THONGTIN1": "EM" },
        ];
        me.arrValid_TDCT = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropTDCT_TrinhDo", "THONGTIN1": "EM" },
            { "MA": "txtTDCT_NamCongNhan", "THONGTIN1": "EM" },
        ];
        me.arrValid_TDTH = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropTH_TDTH", "THONGTIN1": "EM" },
            { "MA": "txt_ThoiHan", "THONGTIN1": "EM" },
        ];
        me.arrValid_TDNN = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "dropTDNN_NgonNgu", "THONGTIN1": "EM" },
            { "MA": "dropTDNN", "THONGTIN1": "EM" },
            { "MA": "txtTDNN_DiemSo", "THONGTIN1": "EM" },
        ];

        me.getList_TDCT();
        me.getList_TDTH();
        me.getList_TDNN();
        me.getList_DaoTao();
        me.getList_BoiDuong();
        me.getList_HocVi();
        //
        me.open_Collapse("key_hocvi");
        me.open_Collapse("key_trinhdochinhtri");
        me.open_Collapse("key_trinhdotinhoc");
        me.open_Collapse("key_trinhdongoaingu");
        me.open_Collapse("key_daotao");
        me.open_Collapse("key_boiduong");
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
            case "key_trinhdochinhtri":
                me.resetPopup_TDCT();
                me.popup_TDCT();
                break;
            case "key_trinhdotinhoc":
                me.resetPopup_TDTH();
                me.popup_TDTH();
                break;
            case "key_trinhdongoaingu":
                me.resetPopup_TDNN();
                me.popup_TDNN();
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
        var me = this;
        switch (key) {
            case "key_trinhdochinhtri":
                me.getList_TDCT();
                break;
            case "key_trinhdotinhoc":
                me.getList_TDTH();
                break;
            case "key_trinhdongoaingu":
                me.getList_TDNN();
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
    /*------------------------------------------
    --Discription: [Tab_4] TrinhDoChinhTri
    -------------------------------------------*/
    getList_TDCT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QT_TrinhDoLyLuan/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TDCT(data.Data);
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
    save_TDCT: function () {
        var me = this;
        var obj_notify = {};
        var strNamCongNhan = edu.util.getValById("txtTDCT_NamCongNhan");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNamCongNhan, strHomNay);
        if (check == 1) {
            objNotify = {
                content: "Ngày công nhận không được lớn hơn ngày hiện tại!",
                type: "w",
                prePos: "#myModal_TDCT #notify"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_TrinhDoLyLuan/ThemMoi',
            
            'strId'                 : '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strTrinhDoLyLuan_Id'   : edu.util.getValById("dropTDCT_TrinhDo"),
            'strMoTa'               : edu.util.getValById("txtTDCT_MoTa"),
            'strNamCongNhan'        : edu.util.getValById("txtTDCT_NamCongNhan"),
            'iTrangThai'            : 1,
            'iThuTu'                : 1,
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_TrinhDoLyLuan/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TDLL");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TDCT();
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
    getDetail_TDCT: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_TrinhDoLyLuan/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {                
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_TDCT(data.Data[0]);
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
    delete_TDCT: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_TrinhDoLyLuan/Xoa',
            
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
                    me.getList_TDCT();
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
    popup_TDCT: function () {
        $("#zoneTDCT_input").slideDown();
    },
    resetPopup_TDCT: function () {
        var me = this;
        $("#myModalLabel_TrinhDoChinhTri").html('<i class="fa fa-plus"></i> Thêm trình độ chính trị');
        me.strCommon_Id = "";
        edu.util.resetValById("dropTDCT_TrinhDo");
        edu.util.resetValById("txtTDCT_NamCongNhan");
        edu.util.resetValById("txtTDCT_MoTa");
    },
    genTable_TDCT: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_TrinhDoChinhTri",
            aaData: data,
            sort: true,
            colPos: {
                center: [2, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mDataProp": "TRINHDOLYLUAN_TEN"
                }
                , {
                    "mDataProp": "NAMCONGNHAN"
                }
                , {
                    "mDataProp": "MOTA"
                },
                {
                    "mData": "LAQUATRINHHIENTAI",
                    "mRender": function (nRow, aData) {
                        if (aData.LAQUATRINHHIENTAI == "CUOICUNG") return '<span><a class="btn" id="' + aData.ID + '" title="Đây là trạng thái cuối của quá trình"><i style="font-size: 25px" class="fa fa-toggle-on color-active"></i></a></span>'
                        return '<span><a class="btn btnSetTrangThaiCuoi" id="' + aData.ID + '" title="Thiết lập trạng thái cuối cùng"><i style="font-size: 25px"  class="fa fa-toggle-off"></i></a></span>';
                    }
                }
                ,{
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
    viewForm_TDCT: function (data) {
        var me = this;
        me.popup_TDCT();
        //view data --Edit
        edu.util.viewValById("dropTDCT_TrinhDo", data.TRINHDOLYLUAN_ID);
        edu.util.viewValById("txtTDCT_NamCongNhan", data.NAMCONGNHAN);
        edu.util.viewValById("txtTDCT_MoTa", data.MOTA);
        $("#myModalLabel_TrinhDoChinhTri").html('<i class="fa fa-pencil"></i> Chỉnh sửa trình độ chính trị');
    },
    /*------------------------------------------
    --Discription: [Tab_4] TrinhDoTinHoc
    -------------------------------------------*/
    getList_TDTH: function () {
        var me = this;      
        var obj_list = {
            'action': 'NS_QT_TrinhDoTinHoc/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TDTH(data.Data);
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
    save_TDTH: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_TrinhDoTinHoc/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strTrinhDoTinHoc_Id': edu.util.getValById("dropTH_TDTH"),
            'strTrinhDoTinHoc_Khac': edu.util.getValById("txt_TH_TrinhDokhac"),
            'strMoTa': edu.util.getValById("txt_ThoiHan"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtTH_ThuTu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_TrinhDoTinHoc/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TDTH");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TDTH();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModal_TDTH #notify"
                    }
                    edu.system.alertOnModal(obj_notify);
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
    getDetail_TDTH: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_TrinhDoTinHoc/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_TDTH(data.Data[0]);
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
    delete_TDTH: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_TrinhDoTinHoc/Xoa',
            
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
                    me.getList_TDTH();
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
    popup_TDTH: function () {
        $("#zoneTDTH_input").slideDown();
    },
    resetPopup_TDTH: function () {
        var me = this;
        $("#myModalLabel_TrinhDoTinHoc").html('<i class="fa fa-plus"></i> Thêm trình độ tin học');
        me.strCommon_Id = "";
        edu.util.resetValById("dropTH_TDTH");
        edu.util.resetValById("txt_ThoiHan");
        edu.util.resetValById("txt_TH_TrinhDokhac");
    },
    genTable_TDTH: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTDTH",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_TDTH()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "TRINHDOTINHOC_TEN"
                },
                {
                    "mDataProp": "MOTA"
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
    viewForm_TDTH: function (data) {
        var me = this;
        me.popup_TDTH();
        edu.util.viewValById("dropTH_TDTH", data.TRINHDOTINHOC_ID);
        $('#dropTH_TDTH').trigger({ type: 'select2:select' });
        edu.util.viewValById("txtTH_ThuTu", data.THUTU);
        edu.util.viewValById("txt_ThoiHan", data.MOTA);
        edu.util.viewValById("txt_TH_TrinhDokhac", data.TRINHDOTINHOC_KHAC);
        $("#myModalLabel_TrinhDoTinHoc").html('<i class="fa fa-pencil"></i> Chỉnh sửa trình độ tin học');
    },
    /*------------------------------------------
    --Discription: [Tab_4] TrinhDoNgoaiNgu
    -------------------------------------------*/
    getList_TDNN: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_TrinhDoNgoaiNgu/LayDanhSach',
            
            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_TDNN(data.Data);
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
    save_TDNN: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_TrinhDoNgoaiNgu/ThemMoi',            

            'strId': '',
            'strTrinhDoNgoaiNgu_Id': edu.util.getValById("dropTDNN"),
            'strNgonNgu_Id': edu.util.getValById("dropTDNN_NgonNgu"),
            'strDiemSo': edu.util.getValById("txtTDNN_DiemSo"),
            'strDiem_KyNangNghe': edu.util.getValById("txtTDNN_DiemNghe"),
            'strDiem_KyNangNoi': edu.util.getValById("txtTDNN_DiemNoi"),
            'strDiem_KyNangDoc': edu.util.getValById("txtTDNN_DiemDoc"),
            'strDiem_KyNangViet': edu.util.getValById("txtTDNN_DiemViet"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtTDNN_ThuTu"),
            'strMoTa': edu.util.getValById("txtTDNN_MoTa"),
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_TrinhDoNgoaiNgu/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TDNN");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TDNN();
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
    getDetail_TDNN: function (strId) {
        var me = main_doc.QuaTrinhDaoTao;
        var obj_detail = {
            'action': 'NS_QT_TrinhDoNgoaiNgu/LayChiTiet',
            
            'strId': strId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_TDNN(data.Data[0]);
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
    delete_TDNN: function (Ids) {
        var me = main_doc.QuaTrinhDaoTao;
        var obj_delete = {
            'action': 'NS_QT_TrinhDoNgoaiNgu/Xoa',
            
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
                    me.getList_TDNN();
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
    popup_TDNN: function () {
        $("#zoneTDNN_input").slideDown();
    },
    resetPopup_TDNN: function () {
        var me = this;
        $("#myModalLabel_TrinhDoNgoaiNgu").html('<i class="fa fa-plus"></i> Thêm trình độ ngoại ngữ');
        me.strCommon_Id = "";
        edu.util.viewValById("dropTDNN", "");
        edu.util.viewValById("dropTDNN_NgonNgu", "");
        edu.util.viewValById("txtTDNN_DiemSo", "");
        edu.util.viewValById("txtTDNN_MoTa", "");
        edu.util.viewValById("txtTDNN_DiemNghe", "");
        edu.util.viewValById("txtTDNN_DiemNoi", "");
        edu.util.viewValById("txtTDNN_DiemDoc", "");
        edu.util.viewValById("txtTDNN_DiemViet", "");
    },
    genTable_TDNN: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_TrinhDoNgoaiNgu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_TDNN()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "NGONNGU_TEN"
                },
                {
                    "mDataProp": "TRINHDONGOAINGU_TEN"
                },
                {
                    "mDataProp": "DIEMSO"
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
    viewForm_TDNN: function (data) {
        var me = main_doc.QuaTrinhDaoTao;
        me.popup_TDNN();
        edu.util.viewValById("dropTDNN", data.TRINHDONGOAINGU_ID);
        edu.util.viewValById("dropTDNN_NgonNgu", data.NGONNGU_ID);
        edu.util.viewValById("txtTDNN_DiemSo", data.DIEMSO);
        edu.util.viewValById("txtTDNN_MoTa", data.MOTA);
        edu.util.viewValById("txtTDNN_DiemNghe", data.DIEM_KYNANGNGHE);
        edu.util.viewValById("txtTDNN_DiemNoi", data.DIEM_KYNANGNOI);
        edu.util.viewValById("txtTDNN_DiemDoc", data.DIEM_KYNANGDOC);
        edu.util.viewValById("txtTDNN_DiemViet", data.DIEM_KYNANGVIET);
        $("#myModalLabel_TrinhDoNgoaiNgu").html('<i class="fa fa-pencil"></i> Chỉnh sửa trình độ ngoại ngữ');
    },
    /*------------------------------------------
    --Discription: [Tab_5] HocVi
    -------------------------------------------*/
    getList_HocVi: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_HocVi/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_HocVi(data.Data);
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
    save_HocVi: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_HocVi/ThemMoi',            

            'strId': '',
            'strHocVi_Id': edu.util.getValById("dropHocVi"),
            'strChuyenNganh_Id': edu.util.getValById("dropChuyenNganh"),
            'strNamNhanHocVi': edu.util.getValById("txtNamNhan"),
            'strNoiNhanHocVi': edu.util.getValById("txtNoiNhan"),
            'iTrangThai': 1,
            'iThuTu': "",
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strCommon_Id != "") {
            obj_save.action = 'NS_QT_HocVi/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_HOCVI");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_HocVi();
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
    getDetail_HocVi: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_HocVi/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                        prePos: "#myModal_HocVi #notify"
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HocVi(data.Data[0]);
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
    delete_HocVi: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_HocVi/Xoa',
            
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
                    me.getList_HocVi();
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
    popup_HocVi: function () {
        $("#zoneHocVi_input").slideDown();
    },
    resetPopup_HocVi: function () {
        var me = this;
        $("#myModalLabel_HocVi").html('<i class="fa fa-plus"></i> Thêm học  vị');
        me.strCommon_Id = "";
        edu.util.resetValById("dropHocVi");
        edu.util.resetValById("dropChuyenNganh");
        edu.util.resetValById("txtNamNhan");
        edu.util.resetValById("txtNoiNhan");
        edu.util.resetValById("txtThuTu");
        edu.util.resetValById("txtMoTa");
    },
    genTable_HocVi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_HocVi",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 5, 6]
            },
            aoColumns: [{
                "mDataProp": "HOCVI_TEN"
            },
            {
                "mDataProp": "CHUYENNGANH_TEN"
            },
            {
                "mDataProp": "NAMNHANHOCVI"
            },
            {
                "mDataProp": "NOINHANHOCVI"
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
    viewForm_HocVi: function (data) {
        var me = this;
        me.popup_HocVi();
        //view data --Edit
        edu.util.viewValById("dropHocVi", data.HOCVI_ID);
        edu.util.viewValById("dropChuyenNganh", data.CHUYENNGANH_ID);
        edu.util.viewValById("txtNamNhan", data.NAMNHANHOCVI);
        edu.util.viewValById("txtNoiNhan", data.NOINHANHOCVI);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtMoTa", data.MOTA);
    },
    /*------------------------------------------
    --Discription: [Tab_5] DaoTao
    -------------------------------------------*/
    getList_DaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DaoTao/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtDaoTao = dtResult;
                    }
                    me.genTable_DaoTao(dtResult, iPager);
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
            fakedb: [],
            fakedb: []
        }, false, false, false, null);
    },
    save_DaoTao: function () {
        var me = this;
        var strNgayQuyetDinh = edu.util.getValById("txtNgayKy");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayQuyetDinh, strHomNay); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày ký quyết định không được lớn hơn ngày hiện tại!");
            return;
        }
        // kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
        var strNgayBatDau = edu.util.getValById("txtNgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtNgayKetThuc");
        check = edu.util.dateCompare(strNgayBatDau, strNgayKetThuc);
        if (check == 1) {
            edu.system.alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_DaoTao/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayQuyetDinh': edu.util.getValById("txtNgayKy"),
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNgayKetThuc"),
            'strNoiDaoTao': edu.util.getValById("txtNoiDaoTao"),
            'strNganhDaoTao': edu.util.getValById("txtNganhDaoTao"),
            'strHinhThucDaoTao_Id': edu.util.getValById("dropHinhThuDaoTao"),
            'strBangCapChungChi_Id': edu.util.getValById("dropBangCapChungChi"),
            'strThongTinDinhKem': edu.util.getValById("txtThongTinDinhKem"),
            'strNgayBaoVeCoSo': edu.util.getValById("txtMocBaoVeCoSo"),
            'strNgayBaoVeChinhThuc': edu.util.getValById("txtMocBaoVeChinhThuc"),
            'iTrangThai': 1,
            'iThuTu': "",
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("dropQuyetDinh"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strDaoTao_Id != "") {
            obj_save.action = 'NS_QT_DaoTao/CapNhat';
            obj_save.strId = me.strDaoTao_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDaoTao_Id = data.Id;
                    if (me.strDaoTao_Id == "") {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.resetPopup_DaoTao();
                            $('#myModalAlert').modal('hide');
                            $("#txtNoiDaoTao").focus();
                        });
                    }
                    else {
                        edu.system.alert('Cập nhật thành công');
                        strDaoTao_Id = me.strDaoTao_Id;
                    }
                    $("#tblDaoTao_TienDo tbody tr").each(function () {
                        var strTienDo_Id = this.id.replace(/rm_row/g, '');
                        me.save_DaoTao_TienDo(strTienDo_Id, strDaoTao_Id);
                    });
                    $("#tblDaoTao_GiaHan tbody tr").each(function () {
                        var strGiaHan_Id = this.id.replace(/rm_row/g, '');
                        me.save_DaoTao_GiaHan(strGiaHan_Id, strDaoTao_Id);
                    });
                    edu.system.saveFiles("txtThongTinDinhKem", strDaoTao_Id, "NS_Files");
                    
                    me.getList_DaoTao();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    getDetail_DaoTao: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtDaoTao, "ID");
        me.viewForm_DaoTao(data);
    },
    delete_DaoTao: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_DaoTao/Xoa',
            
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
                    me.getList_DaoTao();
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
    popup_DaoTao: function () {
        $("#zone_input").slideDown();
    },
    resetPopup_DaoTao: function () {
        var me = this;
        
        me.strCommon_Id = "";
        me.strDaoTao_Id = "";
        edu.util.viewValById("dropBangCapChungChi", "");
        edu.util.viewValById("dropHinhThuDaoTao", "");
        edu.util.viewValById("txtNganhDaoTao", "");
        edu.util.viewValById("txtNoiDaoTao", "");
        edu.util.viewValById("txtMocBaoVeCoSo", "");
        edu.util.viewValById("txtMocBaoVeChinhThuc", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("dropQuyetDinh", "");
        edu.util.viewValById("txtSoQuyetDinh", "");
        edu.util.viewValById("txtNgayKy", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
        edu.util.viewValById("txtThuTu", 0);
        edu.system.viewFiles("txt_TienDo_FileDinhKem", "");
        $("#tblDaoTao_TienDo tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.QuaTrinhDaoTao.genHTML_TienDo(id, "");
        }
        $("#tblDaoTao_GiaHan tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.QuaTrinhDaoTao.genHTML_GiaHan(id, "");
        }
    },
    //class="italic"
    genTable_DaoTao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_DaoTao",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "NOIDAOTAO"
                },
                {
                    "mDataProp": "NGANHDAOTAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span >' + edu.util.returnEmpty(aData.NGAYBATDAU) + '-' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</span>';
                    }
                },
                {
                    "mDataProp": "BANGCAPCHUNGCHI_TEN"
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
    viewForm_DaoTao: function (data) {
        var me = this;
        var dtDaoTao = data[0];
        edu.util.viewValById("dropBangCapChungChi", dtDaoTao.BANGCAPCHUNGCHI_ID);
        edu.util.viewValById("dropHinhThuDaoTao", dtDaoTao.HINHTHUCDAOTAO_ID);
        edu.util.viewValById("txtNganhDaoTao", dtDaoTao.NGANHDAOTAO);
        edu.util.viewValById("txtNoiDaoTao", dtDaoTao.NOIDAOTAO);
        edu.util.viewValById("txtNgayBatDau", dtDaoTao.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", dtDaoTao.NGAYKETTHUC);
        edu.util.viewValById("dropQuyetDinh", dtDaoTao.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("txtSoQuyetDinh", dtDaoTao.SOQUYETDINH);
        edu.util.viewValById("txtNgayKy", dtDaoTao.NGAYQUYETDINH);
        edu.util.viewValById("txtMocBaoVeCoSo", dtDaoTao.NGAYBAOVECOSO);
        edu.util.viewValById("txtMocBaoVeChinhThuc", dtDaoTao.NGAYBAOVECHINHTHUC);
        edu.system.viewFiles("txtThongTinDinhKem", dtDaoTao.ID, "NS_Files");
        edu.util.viewValById("txtThuTu", dtDaoTao.THUTU);
        me.strDaoTao_Id = dtDaoTao.ID;
        me.getList_DaoTao_GiaHan();
        me.getList_DaoTao_TienDo();
    },
    save_DaoTao_TienDo: function (strTienDo_Id, strDaoTao_Id) {
        var me = this;
        var strId = strTienDo_Id;
        var strNgayBaoCao = edu.util.getValById('txtTienDo_Ngay' + strTienDo_Id);
        var strTienDoId = edu.util.getValById('dropTienDo_TinhTrang' + strTienDo_Id);
        var strMoTa = edu.util.getValById('txtTienDo_MoTa' + strTienDo_Id);
        if (!edu.util.checkValue(strTienDoId)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NS_QT_DaoTao_TienDo/ThemMoi',            

            'strId': strId,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayBaoCao': strNgayBaoCao,
            'strTienDo_Id': strTienDoId,
            'strNhanSu_QT_DATO_Id': strDaoTao_Id,
            'strMoTa': strMoTa,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NS_QT_DaoTao_TienDo/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    edu.system.alert(obj_save + ": " + data.Message);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txt_TienDo_FileDinhKem" + strTienDo_Id, strId, "NS_Files");                
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
    getList_DaoTao_TienDo: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DaoTao_TienDo/LayDanhSach',            

            'strNhanSu_QT_DATO_Id': me.strDaoTao_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_DaoTao_TienDo(dtResult);
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
    delete_DaoTao_TienDo: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_QT_DaoTao_TienDo/Xoa',
            
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
                    me.getList_DaoTao_TienDo();
                }
                else {
                    obj = {
                        content: "NS_QT_DaoTao_TienDo/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QT_DaoTao_TienDo/Xoa (er): " + JSON.stringify(er),
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
    genHTML_DaoTao_TienDo: function (data) {
        var me = this;
        $("#tblDaoTao_TienDo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strTienDo_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strTienDo_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strTienDo_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtTienDo_Ngay' + strTienDo_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYBAOCAO) + '" class="form-control input-datepicker_TienDo"/></td>';
            row += '<td><select id="dropTienDo_TinhTrang' + strTienDo_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><input type="text" id="txtTienDo_MoTa' + strTienDo_Id + '" value="' + edu.util.returnEmpty(data[i].MOTA) + '" class="form-control"/></td>';
            row += '<td><div id="txt_TienDo_FileDinhKem' + strTienDo_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteTienDo" id="' + strTienDo_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblDaoTao_TienDo tbody").append(row);
            edu.system.uploadFiles(["txt_TienDo_FileDinhKem" + strTienDo_Id]);
            me.genComBo_TienDo("dropTienDo_TinhTrang" + strTienDo_Id, data[i].TIENDO_ID);
            edu.system.viewFiles("txt_TienDo_FileDinhKem" + strTienDo_Id, strTienDo_Id, "NS_Files");
        }
        for (var i = data.length; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_TienDo(id, "");
        }
        edu.system.pickerdate("input-datepicker_TienDo");
    },
    genHTML_TienDo: function (strTienDo_Id) {
        var me = this;
        var iViTri = document.getElementById("tblDaoTao_TienDo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strTienDo_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strTienDo_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtTienDo_Ngay' + strTienDo_Id + '"  class="form-control input-datepicker_TienDo"/></td>';
        row += '<td><select id="dropTienDo_TinhTrang' + strTienDo_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><input type="text" id="txtTienDo_MoTa' + strTienDo_Id + '" class="form-control"/></td>';
        row += '<td><div id="txt_TienDo_FileDinhKem' + strTienDo_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strTienDo_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblDaoTao_TienDo tbody").append(row);
        edu.system.uploadFiles(["txt_TienDo_FileDinhKem" + strTienDo_Id]);
        me.genComBo_TienDo("dropTienDo_TinhTrang" + strTienDo_Id, "");
        edu.system.pickerdate("input-datepicker_TienDo");
    },
    cbGetList_DaoTao_TienDo: function (data) {
        main_doc.QuaTrinhDaoTao.dtTienDo = data;
    },
    genComBo_TienDo: function (strTienDo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTienDo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTienDo_Id],
            type: "",
            title: "Chọn tình trạng"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTienDo_Id).select2();
    },
    save_DaoTao_GiaHan: function (strGiaHan_Id, strDaoTao_Id) {
        var me = this;
        var strId = strGiaHan_Id;
        var strNgayKy = edu.util.getValById('txtGiaHan_Ngay' + strGiaHan_Id);
        var strGiaHanDenNgay = edu.util.getValById('txtGiaHanDen_Ngay' + strGiaHan_Id);
        var strLoaiQuyetDinh_Id = edu.util.getValById('dropGiaHan_Lan' + strGiaHan_Id);
        var strSoQuyetDinh = edu.util.getValById('txtGiaHan_SoQD' + strGiaHan_Id);
        if (!edu.util.checkValue(strSoQuyetDinh) || !edu.util.checkValue(strLoaiQuyetDinh_Id) || !edu.util.checkValue(strNgayKy)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NS_QT_DaoTao_GiaHan/ThemMoi',            

            'strId': strId,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayKy': strNgayKy,
            'strGiaHanDenNgay': strGiaHanDenNgay,
            'strLoaiQuyetDinh_Id': strLoaiQuyetDinh_Id, 
            'strSoQuyetDinh': strSoQuyetDinh,
            'strNhanSu_QT_DATO_Id': strDaoTao_Id,
            'strMoTa': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NS_QT_DaoTao_GiaHan/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    edu.system.alert(obj_save + ": " + data.Message);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtGiaHan_FileDinhKem" + strGiaHan_Id, strId, "NS_Files");                
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
    getList_DaoTao_GiaHan: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DaoTao_GiaHan/LayDanhSach',            

            'strNhanSu_QT_DATO_Id': me.strDaoTao_Id,
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_DaoTao_GiaHan(dtResult);
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
    delete_DaoTao_GiaHan: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_QT_DaoTao_GiaHan/Xoa',
            
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
                    me.getList_DaoTao_GiaHan();
                }
                else {
                    obj = {
                        content: "NS_QT_DaoTao_GiaHan/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QT_DaoTao_GiaHan/Xoa (er): " + JSON.stringify(er),
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
    genHTML_DaoTao_GiaHan: function (data) {
        var me = this;
        $("#tblDaoTao_GiaHan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strGiaHan_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strGiaHan_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strGiaHan_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropGiaHan_Lan' + strGiaHan_Id + '" class="select-opt"><option value=""> --- Chọn quyết định gia hạn--</option ></select ></td>';
            row += '<td><input type="text" id="txtGiaHan_SoQD' + strGiaHan_Id + '" value="' + edu.util.returnEmpty(data[i].SOQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtGiaHan_Ngay' + strGiaHan_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYKY) + '" class="form-control input-datepicker_GiaHan"/></td>';
            row += '<td><input type="text" id="txtGiaHanDen_Ngay' + strGiaHan_Id + '" value="' + edu.util.returnEmpty(data[i].GIAHANDENNGAY) + '" class="form-control input-datepicker_GiaHan"/></td>';
            row += '<td><div class="txtGiaHan_FileDinhKem" id="txtGiaHan_FileDinhKem' + strGiaHan_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteTienDo" id="' + strGiaHan_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblDaoTao_GiaHan tbody").append(row);
            edu.system.uploadFiles(["txtGiaHan_FileDinhKem" + strGiaHan_Id]);
            me.genComBo_GiaHan("dropGiaHan_Lan" + strGiaHan_Id, data[i].LOAIQUYETDINH_ID);
            edu.system.viewFiles("txtGiaHan_FileDinhKem" + strGiaHan_Id, strGiaHan_Id, "NS_Files");
        }
        for (var i = data.length; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_GiaHan(id, "");
        }
        edu.system.pickerdate("input-datepicker_GiaHan");
    },
    genHTML_GiaHan: function (strGiaHan_Id) {
        var me = this;
        var iViTri = document.getElementById("tblDaoTao_GiaHan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strGiaHan_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strGiaHan_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropGiaHan_Lan' + strGiaHan_Id + '" class="select-opt"><option value=""> --- Chọn quyết định gia hạn--</option ></select ></td>';
        row += '<td><input type="text" id="txtGiaHan_SoQD' + strGiaHan_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtGiaHan_Ngay' + strGiaHan_Id + '"  class="form-control input-datepicker_GiaHan"/></td>';
        row += '<td><input type="text" id="txtGiaHanDen_Ngay' + strGiaHan_Id + '"  class="form-control input-datepicker_GiaHan"/></td>';
        row += '<td><div class="txtGiaHan_FileDinhKem" id="txtGiaHan_FileDinhKem' + strGiaHan_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strGiaHan_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblDaoTao_GiaHan tbody").append(row);
        edu.system.uploadFiles(["txtGiaHan_FileDinhKem" + strGiaHan_Id]);
        me.genComBo_GiaHan("dropGiaHan_Lan" + strGiaHan_Id, "");
        edu.system.pickerdate("input-datepicker_GiaHan");
    },
    cbGetList_DaoTao_GiaHan: function (data) {
        main_doc.QuaTrinhDaoTao.dtGiaHan = data;
    },
    genComBo_GiaHan: function (strGiaHan_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtGiaHan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strGiaHan_Id],
            type: "",
            title: "Chọn quyết định gia hạn"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strGiaHan_Id).select2();
    },
    /*------------------------------------------
    --Discription: [Tab_5] Boi Duong
    -------------------------------------------*/
    getList_BoiDuong: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_BoiDuong/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_BoiDuong(data.Data);
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
    save_BoiDuong: function () {
        var me = this;
        var strNgayQuyetDinh = edu.util.getValById("txtBB_NgayKy");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strNgayQuyetDinh, strHomNay); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày ký quyết định không được lớn hơn ngày hiện tại!");
            return;
        }
        // kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
        var strNgayBatDau = edu.util.getValById("txtBB_NgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtBB_NgayKetThuc");
        var check = edu.util.dateCompare(strNgayBatDau, strNgayKetThuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_BoiDuong/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNgayQuyetDinh': edu.util.getValById("txtBB_NgayKy"),
            'strSoQuyetDinh': edu.util.getValById("txtBB_SoQuyetDinh"),
            'strNgayBatDau': edu.util.getValById("txtBB_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtBB_NgayKetThuc"),
            'strDiaDiemBoiDuong': edu.util.getValById("txtBB_DiaDiem"),
            'strHinhThucDaoTao_Khac': edu.util.getValById("txtBB_HinhThuDaoTaoKhac"),
            'strKetQuaDatDuoc': edu.util.getValById("txtBB_ChungChi"),
            'strNoiDungBoiDuong': edu.util.getValById("txtBB_NoiDung"),
            'strThongTinDinhKem': edu.util.getValById("txtBB_ThongTinDinhKem"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("dropBB_QuyetDinh"),
            'strHinhThucDaoTao_Id': edu.util.getValById("dropBB_HinhThuDaoTao"),
            'strBangCapChungChi_Id': "",
            'iTrangThai': 1,
            'iThuTu': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strCommon_Id != "") {
            obj_save.action = 'NS_QT_BoiDuong/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_BODU");
                        edu.system.saveFiles("txtBB_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txtBB_ThongTinDinhKem", me.strCommon_Id, "NS_Files");
                    }
                    me.getList_BoiDuong();
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
    getDetail_BoiDuong: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_BoiDuong/LayChiTiet',
            
            'strId': strId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_BoiDuong(data.Data[0]);
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
    delete_BoiDuong: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_BoiDuong/Xoa',
            
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
                    me.getList_BoiDuong();
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
    popup_BoiDuong: function () {
        $("#zoneBB_input").slideDown();
    },
    resetPopup_BoiDuong: function () {
        var me = this;
        $("#myModalLabel_BoiDuong").html('<i class="fa fa-plus"></i> Thêm mới quá trình bồi dưỡng');
        me.strCommon_Id = "";
        edu.util.viewValById("dropBB_QuyetDinh", "");
        edu.util.viewValById("dropBB_HinhThuDaoTao", "");
        edu.util.viewValById("txtBB_SoQuyetDinh", "");
        edu.util.viewValById("txtBB_NgayKy", "");
        edu.util.viewValById("txtBB_NoiDung", "");
        edu.util.viewValById("txtBB_NgayBatDau", "");
        edu.util.viewValById("txtBB_NgayKetThuc", "");
        edu.util.viewValById("txtBB_DiaDiem", "");
        edu.util.viewValById("txtBB_KetQua", "");
        edu.util.viewValById("txtBB_KetQua", "");
        edu.system.viewFiles("txtBB_ThongTinDinhKem", "");
        edu.util.viewValById("dropBB_BangCapChungChi", "");
        edu.util.viewValById("dropBB_HinhThucDaoTao", "");
        edu.util.viewValById("txtBB_HinhThuDaoTaoKhac", "");
        edu.util.viewValById("txtBB_ChungChi", "");
    },
    genTable_BoiDuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_BoiDuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "DIADIEMBOIDUONG"
                },
                {
                    "mDataProp": "NOIDUNGBOIDUONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + edu.util.returnEmpty(aData.NGAYBATDAU) + '-' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</span>';
                    }
                },
                {
                    "mDataProp": "KETQUADATDUOC"
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
    viewForm_BoiDuong: function (data) {
        var me = this;
        //call popup --Edit
        me.popup_BoiDuong();
        edu.util.viewValById("dropBB-QuyetDinh", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("txtBB_SoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtBB_NgayKy", data.NGAYQUYETDINH);
        edu.util.viewValById("txtBB_NoiDung", data.NOIDUNGBOIDUONG);
        edu.util.viewValById("txtBB_NgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtBB_NgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("txtBB_DiaDiem", data.DIADIEMBOIDUONG);
        edu.util.viewValById("txtBB_KetQua", data.KETQUADATDUOC);
        edu.util.viewValById("txtBB_HinhThuDaoTaoKhac", data.HINHTHUCDAOTAO_KHAC);
        edu.util.viewValById("dropBB_QuyetDinh", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.system.viewFiles("txtBB_ThongTinDinhKem", data.ID, "NS_Files");
        edu.util.viewValById("txtBB_ThuTu", data.THUTU);
        edu.util.viewValById("txtBB_ChungChi", data.KETQUADATDUOC);
        edu.util.viewValById("dropBB_HinhThuDaoTao", data.HINHTHUCDAOTAO_ID);
        $('#dropBB_HinhThucDaoTao').trigger({ type: 'select2:select' });
        me.strCommon_Id = data.ID;
        $("#myModalLabel_BoiDuong").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình bồi dưỡng');
    },
}

