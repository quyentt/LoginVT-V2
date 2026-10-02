function QuaTrinhDaoTao() { };
QuaTrinhDaoTao.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    dtNhanSu: [],
    arrValid_DaoTao: [],
    arrValid_BoiDuong: [],
    arrValid_HocVi: [],
    arrValid_TDCT: [],
    arrValid_TDTH: [],
    arrValid_TDNN: [],

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
            edu.util.toggle_overide("zone-bus", "zone_input_DaoTao");
        });
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.reset_HS();
            me.toggle_form();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            me.getList_TDCT();
            me.getList_TDTH();
            me.getList_TDNN();
            me.getList_DaoTao();
            me.getList_BoiDuong();
            me.getList_HocVi();
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
        $("#btnSave_HocHam").click(function () {
            me.save_HocHam();
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
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
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
        $("#btnSave_DanhHieu").click(function () {
            me.save_DanhHieu();
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
            edu.util.setOne_BgRow(strId, "tbl_DaoTao");
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
        $("#zone_input").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDaoTao_GiaHan tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input").delegate(".deleteKetQua", "click", function () {
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
        $("#btnSearch_HetHanDaoTao").click(function () {
            me.toggle_list();
            me.getList_HetHanDaoTao();
        });
        $("#btnViewDaoTao_DuBao").click(function () {
            me.toggle_list();
            me.getList_HetHanDaoTao();
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_HS();
        me.toggle_notify();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropSearch_CapNhat_TinhTrangLamViec");
        me.getList_HS(); edu.system.loadToCombo_DanhMucDuLieu("NS.GIAHAN", "", "", me.cbGetList_DaoTao_GiaHan);
        edu.system.loadToCombo_DanhMucDuLieu("NS.TIENDOHOCTAP", "", "", me.cbGetList_DaoTao_TienDo);
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDTH", "dropTH_TDTH");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDNN", "dropTDNN");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropHocVi");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.CNDT", "dropChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMNN, "dropTDNN_NgonNgu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TDCT, "dropTDCT_TrinhDo");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropQuyetDinh,dropBD_QuyetDinh");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.HTDT", "dropHinhThuDaoTao,dropBD_HinhThucDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMHV", "dropBangCapChungChi,dropBB_BangCapChungChi", "", "", "Văn bằng/chứng chỉ");
        edu.system.uploadFiles(["txtThongTinDinhKem", "txtBD_ThongTinDinhKem"]);
        edu.system.switchLoaiKhac("dropTH_TDTH", "txt_TH_TrinhDokhac", true);
        edu.system.switchLoaiKhac("dropBD_HinhThucDaoTao", "txtBD_HinhThucDaoTaoKhac", true);
        edu.system.switchLoaiKhac("dropHinhThuDaoTao", "txtDT_HinhThuDaoTaoKhac", true);
        me.getList_CoCauToChuc();
        me.getList_HetHanDaoTao();
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
        me.open_Collapse("key_hocvi");
        me.open_Collapse("key_trinhdochinhtri");
        me.open_Collapse("key_trinhdotinhoc");
        me.open_Collapse("key_trinhdongoaingu");
        me.open_Collapse("key_daotao");
        me.open_Collapse("key_boiduong");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HetHanDaoTao");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_HetHanDaoTao");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_DaoTao");
    },
    getList_HetHanDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_BoiDuong/LocDSNhanSu_QT_DATO_DenHan',

            'strNguoiThucHien_Id': edu.system.userId,
            'dSoNgayQuyDinh': 30,
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
                    me.genTable_HetHanDaoTao(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_QT_BoiDuong/LocDSNhanSu_QT_DATO_DenHan: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NS_QT_BoiDuong/LocDSNhanSu_QT_DATO_DenHan (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HetHanDaoTao: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblHetHanDaoTao_DuKien_Tong", data.length);
        edu.util.viewHTMLById("lblCount_HetHanDaoTao", data.length);
        var jsonForm = {
            strTable_Id: "tblHetHanDaoTao_DuBao",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 4, 5],
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
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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
        var me = main_doc.QuaTrinhDaoTao;
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
            case "key_tieusubanthan":
                me.resetPopup_TSBT();
                me.popup_TSBT();
                break;
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
        var me = main_doc.QuaTrinhDaoTao;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_HS()",
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
    getList_DanToc: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropNS_DanToc", "", me.getList_TonGiao);
    },
    getList_TonGiao: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "dropNS_TonGiao", "", me.getList_GioiTinh);
    },
    getList_GioiTinh: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNS_GioiTinh", "", me.getList_QuocGia);
    },
    getList_QuocGia: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropNS_QuocTich", "", me.getList_TinhTrangHonNhan);
    },
    getList_TinhTrangHonNhan: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTHN, "dropNS_TinhTrangHonNhan", "", me.getList_ThuongBinhHang);
    },
    getList_ThuongBinhHang: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TBH0, "dropNS_HangThuongBinh", "", me.getList_GiaDinhChinhSach);
    },
    getList_GiaDinhChinhSach: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GDCS, "dropNS_GiaDinhChinhSach", "", me.getList_ThanhPhanXuatThan);
    },
    getList_ThanhPhanXuatThan: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TPXT, "dropNS_ThanhPhanXuatThan", "", me.getList_QuanHam);
    },
    getList_QuanHam: function () {
        var me = main_doc.QuaTrinhDaoTao;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUHA, "dropNS_QuanHam", "", me.getDetail_HS);
    },
    save_HS: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoV2/CapNhat',            

            'strId': edu.system.userId,
            'strMaSo': "#",// the character "#" --> it mean, we dont want to update this field
            'strHoDem': "#",
            'strTen': "#",
            'strTenGoiKhac': edu.util.getValById('txtNS_BiDanh'),
            'strNgaySinh': "#",
            'strThangSinh': "#",
            'strNamSinh': "#",
            'strGioiTinh_Id': "#",
            'strNoiSinh_DiaChi': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("name")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("xaId")),
            'strNoiSinh_Huyen_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("huyenId")),
            'strNoiSinh_Tinh_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("tinhId")),
            'strQueQuan_DiaChi': edu.util.returnEmpty($("#txtNS_QueQuan").attr("name")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("xaId")),
            'strQueQuan_Huyen_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("huyenId")),
            'strQueQuan_Tinh_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("tinhId")),
            'strHKTT_DiaChi': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("name")),
            'strHKTT_Xa_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("xaId")),
            'strHKTT_Huyen_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("huyenId")),
            'strHKTT_Tinh_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("tinhId")),
            'strNOHN_DiaChi': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("name")),
            'strNOHN_Xa_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("xaId")),
            'strNOHN_Huyen_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("huyenId")),
            'strNOHN_Tinh_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("tinhId")),
            'strQuocTich_Id': edu.util.getValById('dropNS_QuocTich'),
            'strDanToc_Id': edu.util.getValById('dropNS_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropNS_TonGiao'),
            'strTDPT_TotNghiepLop': edu.util.getValById('txtNS_TDPhoThong'),
            'strTDPT_He': edu.util.getValById('txtNS_He'),
            'strSoTruongCongTac': edu.util.getValById('txtNS_SoTruongCongTac'),
            'strThuongBinhHang_Id': edu.util.getValById('dropNS_HangThuongBinh'),
            'strGiaDinhChinhSach_Id': edu.util.getValById('dropNS_GiaDinhChinhSach'),
            'strThanhPhanXuatThan_Id': edu.util.getValById('dropNS_ThanhPhanXuatThan'),
            'strDang_NgayVao': edu.util.getValById('txtNS_Dang_NgayVao'),
            'strDang_NgayChinhThuc': edu.util.getValById('txtNS_Dang_NgayChinhThuc'),
            'strDang_NoiKetNap': edu.util.getValById('txtNS_Dang_NoiKetNap'),
            'strDoan_NgayVao': edu.util.getValById('txtNS_Doan_NgayVao'),
            'strDoan_NoiKetNap': edu.util.getValById('txtNS_Doan_NoiKetNap'),
            'strCongDoan_NgayVao': edu.util.getValById('txtNS_CongDoan_NgayVao'),
            'strNgu_NgayNhap': edu.util.getValById('txtNS_Ngu_NgayNhap'),
            'strNgu_NgayXuat': edu.util.getValById('txtNS_Ngu_NgayXuat'),
            'strNgu_QuanHam_Id': edu.util.getValById('dropNS_QuanHam'),
            'strCanCuoc_So': edu.util.getValById('txtNS_SCC_So'),
            'strCanCuoc_NgayCap': edu.util.getValById('txtNS_SCC_NgayCap'),
            'strCanCuoc_NoiCap': edu.util.getValById('txtNS_SCC_NoiCap'),
            'strNhanXet': "#",
            'strEmail': edu.util.getValById('txtNS_Email'),
            'strAnh': edu.util.getValById('uploadPicture_HS'),
            'strSDT_CaNhan': edu.util.getValById('txtNS_DienThoaiCaNhan'),
            'strSDT_CoQuan': edu.util.getValById('txtNS_DienThoaiCoQuan'),
            'strSDT_GiaDinh': edu.util.getValById('txtNS_DienThoaiGiaDinh'),
            'strNgayTGCachMang': edu.util.getValById('txtNS_NgayThamGiaCachMang'),
            'strNgayTGToChucChinhTriXH': edu.util.getValById('txtNS_NgayTGTCCTXH'),
            'strLoaiHopDongLaoDong_Id': "",
            'strLoaiDoiTuong_Id': edu.util.getValById('dropNS_LoaiDoiTuong'),
            'strLoaiGiangVien_Id': edu.util.getValById('dropNS_LoaiGiangVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropNS_CoCauToChuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoBaoHiem': edu.util.getValById('txtNS_SoBaoHiem'),
            'strTinhTrangHonNhan_Id': edu.util.getValById('dropNS_TinhTrangHonNhan'),
            'strTinhTrangNhanSu_Id': "#",
            'strTDPT_XepLoaiTotNghiep_Id': edu.util.getValById('dropNS_XepLoaiTotnhgiep'),
            'strCongViecChinhDuocGiao': edu.util.getValById('txtNS_CongViecChinhDuocGiao'),
            'strLaCanBoNgoaiTruong': "0",
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!", 'i');
                    me.getDetail_HS();
                    me.save_AnhHoSo();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HS: function () {
        var me = main_doc.QuaTrinhDaoTao;
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',
            
            'strId': edu.system.userId
        }        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HS(data.Data[0]);
                        me.viewForm_DaoTao(data.Data[0]);
                    }
                    else {
                        me.viewForm_HS([]);
                        me.viewForm_DaoTao([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);                    
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
                
            },
            type: "GET",
            action: obj_detail.action,            
            contentType: true,            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    viewForm_HS: function (data) {
        var me = main_doc.QuaTrinhDaoTao;
        edu.util.viewValById("txtNS_HoDem", data.HODEM);
        edu.util.viewValById("txtNS_Ten", data.TEN);
        edu.util.viewValById("txtNS_BiDanh", data.TENGOIKHAC);
        edu.util.viewValById("txtNS_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNS_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNS_NamSinh", data.NAMSINH);
        edu.util.viewValById("txtNS_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewValById("dropNS_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropNS_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropNS_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("dropNS_GiaDinhChinhSach", data.GIADINHCHINHSACH_ID);
        edu.util.viewValById("dropNS_ThanhPhanXuatThan", data.THANHPHANXUATTHAN_ID);
        edu.util.viewValById("dropNS_TinhTrangHonNhan", data.TINHTRANGHONNHAN_ID);
        edu.util.viewValById("uploadPicture_HS", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        edu.util.viewValById("txtNS_MaSo", data.MASO);
        edu.util.viewValById("txtNS_TinhTrangNhanSu", data.TINHTRANGNHANSU_TEN);
        edu.util.viewValById("dropNS_LoaiDoiTuong", data.LOAIDOITUONG_ID);
        edu.util.viewValById("dropNS_LoaiGiangVien", data.LOAIGIANGVIEN_ID);
        edu.util.viewValById("dropNS_CoCauToChuc", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txtNS_CongViecChinhDuocGiao", data.CONGVIECCHINHDUOCGIAO);
        edu.util.viewValById("txtNS_SCC_So", data.CANCUOC_SO);
        edu.util.viewValById("txtNS_SCC_NgayCap", data.CANCUOC_NGAYCAP);
        edu.util.viewValById("txtNS_SCC_NoiCap", data.CANCUOC_NOICAP);
        edu.util.viewValById("txtNS_SoBaoHiem", data.SOBAOHIEM);
        edu.util.viewValById("txtNS_Email", data.EMAIL);
        edu.util.viewValById("txtNS_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("txtNS_DienThoaiCoQuan", data.SDT_COQUAN);
        edu.util.viewValById("txtNS_DienThoaiGiaDinh", data.SDT_GIADINH);
        edu.extend.viewTinhThanhById("txtNS_NoiSinh", data.NOISINH_TINH_ID, data.NOISINH_HUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_QueQuan", data.QUEQUAN_TINH_ID, data.QUEQUAN_HUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_HoKhauThuongTru", data.HKTT_TINH_ID, data.HKTT_HUYEN_ID, data.HKTT_XA_ID, data.HKTT_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_NoiOHienNay", data.NOHN_TINH_ID, data.NOHN_HUYEN_ID, data.NOHN_XA_ID, data.NOHN_DIACHI);
        edu.util.viewValById("txtNS_Dang_NgayVao", data.DANG_NGAYVAO);
        edu.util.viewValById("txtNS_Dang_NgayChinhThuc", data.DANG_NGAYCHINHTHUC);
        edu.util.viewValById("txtNS_Dang_NoiKetNap", data.DANG_NOIKETNAP);
        edu.util.viewValById("txtNS_Doan_NgayVao", data.DOAN_NGAYVAO);
        edu.util.viewValById("txtNS_Doan_NoiKetNap", data.DOAN_NOIKETNAP);
        edu.util.viewValById("txtNS_CongDoan_NgayVao", data.CONGDOAN_NGAYVAO);
        edu.util.viewValById("txtNS_Ngu_NgayNhap", data.NGU_NGAYNHAP);
        edu.util.viewValById("txtNS_Ngu_NgayXuat", data.NGU_NGAYXUAT);
        edu.util.viewValById("dropNS_QuanHam", data.NGU_QUANHAM_ID);
        edu.util.viewValById("dropNS_HangThuongBinh", data.THUONGBINHHANG_ID);
        edu.util.viewValById("txtNS_NgayThamGiaCachMang", data.NGAYTGCACHMANG);
        edu.util.viewValById("txtNS_NgayTGTCCTXH", data.NGAYTGTOCHUCCHINHTRIXH);
        edu.util.viewValById("txtNS_TDPhoThong", data.TDPT_TOTNGHIEPLOP);
        edu.util.viewValById("txtNS_He", data.TDPT_HE);
        edu.util.viewValById("txtNS_SoTruongCongTac", data.SOTRUONGCONGTAC);
        edu.util.viewValById("dropNS_XepLoaiTotnhgiep", data.TDPT_XEPLOAITOTNGHIEP_ID);       
    },
    save_AnhHoSo: function () {
        var me = main_doc.QuaTrinhDaoTao;
        var obj_save = {
            'action': 'NS_HoSoV2/KeThua',            

            'strNhanSu_HoSo_v2_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("img[class='user-image']").attr("src", edu.system.rootPathUpload + "//" + edu.util.getValById('uploadPicture_HS'));
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");                
            },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
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
            'strTuNgay': edu.util.getValById("txtTSBT_TuNgay"),
            'strDenNgay': edu.util.getValById("txtTSBT_DenNgay"),
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
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TSTT");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_TSBT();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
    popup_TSBT: function () {
        $("#myModal_TSBT").modal("show");
    },
    resetPopup_TSBT: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtTSBT_TuNgay");
        edu.util.resetValById("txtTSBT_DenNgay");
        edu.util.resetValById("txtTSBT_MoTa");
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
                center: [0, 1, 2, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNGAY"
                }
                , {
                    "mDataProp": "DENNGAY"
                }
                , {
                    "mDataProp": "MOTA"
                }, {
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
        edu.util.viewValById("txtTSBT_TuNgay", data.TUNGAY);
        edu.util.viewValById("txtTSBT_DenNgay", data.DENNGAY);
        edu.util.viewValById("txtTSBT_MoTa", data.MOTA);
    },
    getList_QHTT: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_QuanHeThanToc/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_QHTT(data.Data);
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
    save_QHTT: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_QuanHeThanToc/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNhanSu_QuanHe_Id': edu.util.getValById("dropQuanHe"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtThuTu"),
            'strHoDem': edu.util.getValById("txtHoDem"),
            'strTen': edu.util.getValById("txtTen"),
            'strNgaySinh': "",
            'strThangSinh': "",
            'strNamSinh': edu.util.getValById("txtNamSinh"),
            'strQueQuan': "",
            'strNgheNghiep': "",
            'strChucDanh': "",
            'strChucVu': "",
            'strDonViCongTac': "",
            'strHocTap': "",
            'strNoiO': "",
            'strThanhVienCacToChucCT_XH': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_QuanHeThanToc/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
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
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_GD_QHTT");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_QHTT();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
    getDetail_QHTT: function (strId) {
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
                        me.viewForm_QHTT(data.Data[0]);
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
    delete_QHTT: function (Ids) {
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
                    me.getList_QHTT();
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
        $("#myModal_QHGD").modal("show");
    },
    resetPopup_QHGD: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropQuanHe");
        edu.util.resetValById("txtThuTu");
        edu.util.resetValById("txtHoDem");
        edu.util.resetValById("txtTen");
        edu.util.resetValById("txtNamSinh");
        edu.util.resetValById("txtMoTa");
    },
    genTable_QHTT: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_QuanHeGiaDinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_TSBT()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 3, 5],
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
                "mDataProp": "MOTA"
            },
            {
                "mDataProp": "NGAYTAO_DD_MM_YYYY"
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
    viewForm_QHTT: function (data) {
        var me = this;
        me.popup_QHGD();
        edu.util.viewValById("dropQuanHe", data.QUANHE_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtHoDem", data.HODEM);
        edu.util.viewValById("txtTen", data.TEN1);
        edu.util.viewValById("txtNamSinh", data.NAMSINH);
        edu.util.viewValById("txtMoTa", data.MOTA);
    },
    getList_Dang: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_Dang/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id ////
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_Dang(data.Data);
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
    save_Dang: function () {
        var me = this;
        var obj_notify = {};
        var strTuNgay = edu.util.getValById("txtDang_TuNgay");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strTuNgay, strHomNay);
        if (check == 1) {
            objNotify = {
                content: "Ngày bắt đầu không được lớn hơn ngày hiện tại!",
                type: "w",
                prePos: "#myModal_Dang #notify"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_Dang/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strTuNgay': edu.util.getValById("txtDang_TuNgay"),
            'strNoiSinhHoat': edu.util.getValById("txtDang_NoiSinhHoat"),
            'strChucVu_Id': edu.util.getValById("dropDang_ChucVu"),
            'strChucVuKhac': edu.util.getValById("txtDang_ChucVuKhac"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_Dang/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
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
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_Dang");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_Dang();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
    getDetail_Dang: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_Dang/LayChiTiet',
            
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
                        me.viewForm_Dang(data.Data[0]);
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
    delete_Dang: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_Dang/Xoa',
            
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
                    me.getList_Dang();
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
    popup_Dang: function () {
        $("#myModal_Dang").modal("show");
    },
    resetPopup_Dang: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtDang_TuNgay");
        edu.util.resetValById("txtDang_NoiSinhHoat");
        edu.util.resetValById("dropDang_ChucVu");
        edu.util.resetValById("txtDang_ChucVuKhac");
    },
    genTable_Dang: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_Dang",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_Dang()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNGAY"
                }
                , {
                    "mDataProp": "NOISINHHOAT"
                }
                , {
                    "mDataProp": "CHUCVU_TEN"
                }
                , {
                    "mDataProp": "CHUCVUKHAC"
                }
                , {
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
    viewForm_Dang: function (data) {
        var me = this;
        me.popup_Dang();
        edu.util.viewValById("txtDang_TuNgay", data.TUNGAY);
        edu.util.viewValById("txtDang_NoiSinhHoat", data.NOISINHHOAT);
        edu.util.viewValById("dropDang_ChucVu", data.CHUCVU_ID);
        edu.util.viewValById("txtDang_ChucVuKhac", data.CHUCVUKHAC);
    },
    getList_Doan: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_Doan/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_Doan(data.Data);
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
    save_Doan: function () {
        var me = this;
        var obj_notify = {};
        var strTuNgay = edu.util.getValById("txtDoan_TuNgay");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strTuNgay, strHomNay);
        if (check == 1) {
            objNotify = {
                content: "Ngày bắt đầu không được lớn hơn ngày hiện tại!",
                type: "w",
                prePos: "#myModal_Doan #notify"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_Doan/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strTuNgay': edu.util.getValById("txtDoan_TuNgay"),
            'strNoiSinhHoat': edu.util.getValById("txtDoan_NoiSinhHoat"),
            'strChucVu_Id': edu.util.getValById("dropDoan_ChucVu"),
            'strChucVuKhac': edu.util.getValById("txtDoan_ChucVuKhac"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_Doan/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }        
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
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_Doan");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_Doan();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
    getDetail_Doan: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_Doan/LayChiTiet',
            
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
                        me.viewForm_Doan(data.Data[0]);
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
    delete_Doan: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_Doan/Xoa',
            
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
                    me.getList_Doan();
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
    popup_Doan: function () {
        $("#myModal_Doan").modal("show");
    },
    resetPopup_Doan: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtDoan_TuNgay");
        edu.util.resetValById("txtDoan_NoiSinhHoat");
        edu.util.resetValById("dropDoan_ChucVu");
        edu.util.resetValById("txtDoan_ChucVuKhac");
    },
    genTable_Doan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_Doan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_Doan()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNGAY"
                }
                , {
                    "mDataProp": "NOISINHHOAT"
                }
                , {
                    "mDataProp": "CHUCVU_TEN"
                }
                , {
                    "mDataProp": "CHUCVUKHAC"
                }
                , {
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
    viewForm_Doan: function (data) {
        var me = this;
        me.popup_Doan();
        edu.util.viewValById("txtDoan_TuNgay", data.TUNGAY);
        edu.util.viewValById("txtDoan_NoiSinhHoat", data.NOISINHHOAT);
        edu.util.viewValById("dropDoan_ChucVu", data.CHUCVU_ID);
        edu.util.viewValById("txtDoan_ChucVuKhac", data.CHUCVUKHAC);
    },
    getList_CongDoan: function () {
        var me = this
        var obj_list = {
            'action': 'NS_QT_CDoan/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_CongDoan(data.Data);
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
    save_CongDoan: function () {
        var me = this;
        var obj_notify = {};
        var strTuNgay = edu.util.getValById("txtCongDoan_TuNgay");
        var strHomNay = edu.util.dateToday();
        var check = edu.util.dateCompare(strTuNgay, strHomNay);
        if (check == 1) {
            objNotify = {
                content: "Ngày bắt đầu không được lớn hơn ngày hiện tại!",
                type: "w",
                prePos: "#myModal_CongDoan #notify"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_CDoan/ThemMoi',            

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strTuNgay': edu.util.getValById("txtCongDoan_TuNgay"),
            'strNoiSinhHoat': edu.util.getValById("txtCongDoan_NoiSinhHoat"),
            'strChucVu_Id': edu.util.getValById("dropCongDoan_ChucVu"),
            'strChucVuKhac': edu.util.getValById("txtCongDoan_ChucVuKhac"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_CDoan/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
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
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_CDoan");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_CongDoan();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
    getDetail_CongDoan: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_CDoan/LayChiTiet',
            
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
                        me.viewForm_CongDoan(data.Data[0]);
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
    delete_CongDoan: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NS_QT_CDoan/Xoa',
            
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
                    me.getList_CongDoan();
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
    popup_CongDoan: function () {
        $("#myModal_CongDoan").modal("show");
    },
    resetPopup_CongDoan: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("txtCongDoan_TuNgay");
        edu.util.resetValById("txtCongDoan_NoiSinhHoat");
        edu.util.resetValById("dropCongDoan_ChucVu");
        edu.util.resetValById("txtCongDoan_ChucVuKhac");
    },
    genTable_CongDoan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_CongDoan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_CongDoan()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "TUNGAY"
                }
                , {
                    "mDataProp": "NOISINHHOAT"
                }
                , {
                    "mDataProp": "CHUCVU_TEN"
                }
                , {
                    "mDataProp": "CHUCVUKHAC"
                }
                , {
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
    viewForm_CongDoan: function (data) {
        var me = this;
        me.popup_CongDoan();
        edu.util.viewValById("txtCongDoan_TuNgay", data.TUNGAY);
        edu.util.viewValById("txtCongDoan_NoiSinhHoat", data.NOISINHHOAT);
        edu.util.viewValById("dropCongDoan_ChucVu", data.CHUCVU_ID);
        edu.util.viewValById("txtCongDoan_ChucVuKhac", data.CHUCVUKHAC);
    },
    getList_TDCT: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_TrinhDoLyLuan/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
        var strNamCongNhan = edu.util.getValById("txtTDCT_NgayCongNhan");
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

            'strId': '',
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strTrinhDoLyLuan_Id': edu.util.getValById("dropTDCT_TrinhDo"),
            'strMoTa': edu.util.getValById("txtTDCT_MoTa"),
            'strNamCongNhan': edu.util.getValById("txtTDCT_NamCongNhan"),
            'iTrangThai': 1,
            'iThuTu': 1,
            'strNguoiThucHien_Id': edu.system.userId
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
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_TDCT()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "TRINHDOLYLUAN_TEN"
                },
                {
                    "mDataProp": "NAMCONGNHAN"
                },
                {
                    "mDataProp": "MOTA"
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
    viewForm_TDCT: function (data) {
        var me = this;
        me.popup_TDCT();
        edu.util.viewValById("dropTDCT_TrinhDo", data.TRINHDOLYLUAN_ID);
        edu.util.viewValById("txtTDCT_NgayCongNhan", data.NAMCONGNHAN);
        edu.util.viewValById("txtTDCT_MoTa", data.MOTA);
        $("#myModalLabel_TrinhDoChinhTri").html('<i class="fa fa-pencil"></i> Chỉnh sửa trình độ chính trị');
    },
    save_TDTH: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_QT_TrinhDoTinHoc/ThemMoi',            

            'strId': '',
            'strTrinhDoTinHoc_Id': edu.util.getValById("dropTH_TDTH"),
            'strTrinhDoTinHoc_Khac': edu.util.getValById("txt_TH_TrinhDokhac"),
            'strMoTa': edu.util.getValById("txt_ThoiHan"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtTH_ThuTu"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
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
    getList_TDTH: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_TrinhDoTinHoc/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
    getDetail_TDTH: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_TrinhDoTinHoc/LayChiTiet',
            
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
    viewForm_TDTH: function (data) {
        var me = this;
        me.popup_TDTH();
        edu.util.viewValById("dropTH_TDTH", data.TRINHDOTINHOC_ID);
        edu.util.viewValById("txtTH_ThuTu", data.THUTU);
        edu.util.viewValById("txt_ThoiHan", data.MOTA);
        edu.util.viewValById("txt_TH_TrinhDokhac", data.TRINHDOTINHOC_KHAC);
        $("#myModalLabel_TrinhDoTinHoc").html('<i class="fa fa-pencil"></i> Chỉnh sửa trình độ tin học');
    },
    getList_TDNN: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_TrinhDoNgoaiNgu/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
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
        var me = this;
        var obj_detail = {
            'action': 'NS_QT_TrinhDoNgoaiNgu/LayChiTiet',
            
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
        var me = this;
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
        edu.util.resetValById("dropTDNN_NgonNgu");
        edu.util.resetValById("dropTDNN");
        edu.util.resetValById("txtTDNN_DiemSo");
        edu.util.resetValById("txtTDNN_DiemNghe");
        edu.util.resetValById("txtTDNN_DiemNoi");
        edu.util.resetValById("txtTDNN_DiemDoc");
        edu.util.resetValById("txtTDNN_DiemViet");
        edu.util.resetValById("txtTDNN_MoTa");
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
    viewForm_TDNN: function (data) {
        var me = this;
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
            objNotify = {
                content: "Ngày phong không được lớn hơn ngày hiện tại!",
                type: "w",
                prePos: "#myModal_HocHam #notify"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        var obj_save = {
            'action': 'NS_QT_ChucDanh/ThemMoi',            

            'strId': '',
            'strChucDanh_Id': edu.util.getValById("dropHocHam_ChucDanh"),
            'strMoTa': edu.util.getValById("txtHocHam_MoTa"),
            'strNamPhongChucDanh': edu.util.getValById("txtHocHam_NgayPhong"),
            'strNoiPhongChucDanh': edu.util.getValById("txtHocHam_NoiPhong"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtHocHam_ThuTu"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ChucDanh/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
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
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_CHUCDANH");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_HocHam();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
                    me.getDetail_HocHam();
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
        $("#myModal_HocHam").modal("show");
    },
    resetPopup_HocHam: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropHocHam_ChucDanh");
        edu.util.resetValById("txtHocHam_NgayPhong");
        edu.util.resetValById("txtHocHam_NoiPhong");
        edu.util.resetValById("txtHocHam_ThuTu");
        edu.util.resetValById("txtHocHam_MoTa");
    },
    genTable_HocHam: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_HocHam",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_HocHam()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 4],
            },
            aoColumns: [{
                "mDataProp": "CHUCDANH_TEN"
            },
            {
                "mDataProp": "NAMPHONGCHUCDANH"
            },
            {
                "mDataProp": "NOIPHONGCHUCDANH"
            },
            {
                "mDataProp": "NGAYTAO"
            }
                , {
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
    viewForm_HocHam: function (data) {
        var me = this;
        me.popup_HocHam();
        edu.util.viewValById("dropHocHam_ChucDanh", data.CHUCDANH_ID);
        edu.util.viewValById("txtHocHam_NgayPhong", data.NAMPHONGCHUCDANH);
        edu.util.viewValById("txtHocHam_NoiPhong", data.NOIPHONGCHUCDANH);
        edu.util.viewValById("txtHocHam_ThuTu", data.THUTU);
        edu.util.viewValById("txtHocHam_MoTa", data.MOTA);
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
            'strDanhHieu_Id': edu.util.getValById("dropDanhHieu_Loai"),
            'strMoTa': edu.util.getValById("txtDanhHieu_MoTa"),
            'iTrangThai': 1,
            'iThuTu': edu.util.getValById("txtDanhHieu_ThuTu"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_DanhHieu/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
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
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_DANHHIEU");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_DanhHieu();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
        $("#myModal_DanhHieu").modal("show");
    },
    resetPopup_DanhHieu: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.resetValById("dropDanhHieu_Loai");
        edu.util.resetValById("txtDanhHieu_ThuTu");
        edu.util.resetValById("txtDanhHieu_MoTa");
    },
    genTable_DanhHieu: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_DanhHieu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuaTrinhDaoTao.getList_DanhHieu()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "DANHHIEU_TEN"
                }
                , {
                    "mDataProp": "MOTA"
                }
                , {
                    "mDataProp": "NGAYTAO"
                }
                , {
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
        edu.util.viewValById("txtDanhHieu_ThuTu", data.THUTU);
        edu.util.viewValById("txtDanhHieu_MoTa", data.MOTA);
    },
    getList_HocVi: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_HocVi/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
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
                center: [0, 3, 4, 5, 6]
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
        edu.util.viewValById("dropHocVi", data.HOCVI_ID);
        edu.util.viewValById("dropChuyenNganh", data.CHUYENNGANH_ID);
        edu.util.viewValById("txtNamNhan", data.NAMNHANHOCVI);
        edu.util.viewValById("txtNoiNhan", data.NOINHANHOCVI);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtMoTa", data.MOTA);
        $("#myModalLabel_HocVi").html('<i class="fa fa-pencil"></i> Chỉnh sửa học vị');
    },
    getList_DaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DaoTao/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
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
                center: [0, 3, 4, 5, 6, 7],
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
        var obj_save = {
            'action': 'NS_QT_DaoTao_TienDo/ThemMoi',            

            'strId': strId,
            'strNhanSu_HoSoCanBo_Id':  me.strNhanSu_Id,
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
    getList_DaoTao_TienDo: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DaoTao_TienDo/LayDanhSach',            

            'strNhanSu_QT_DATO_Id': me.strDaoTao_Id,
            'strNhanSu_HoSoCanBo_Id':  me.strNhanSu_Id,
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
        var obj_save = {
            'action': 'NS_QT_DaoTao_GiaHan/ThemMoi',            

            'strId': strId,
            'strNhanSu_HoSoCanBo_Id':  me.strNhanSu_Id,
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
    getList_DaoTao_GiaHan: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_DaoTao_GiaHan/LayDanhSach',            

            'strNhanSu_QT_DATO_Id': me.strDaoTao_Id,
            'strNhanSu_HoSoCanBo_Id':  me.strNhanSu_Id,
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
            row += '<td><div id="txtGiaHan_FileDinhKem' + strGiaHan_Id + '"></div></td>';
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
        row += '<td><div id="txtGiaHan_FileDinhKem' + strGiaHan_Id + '"></div></td>';
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
    getList_BoiDuong: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_QT_BoiDuong/LayDanhSach',            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
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
        var strNgayHieuLuc = edu.util.getValById("txtBD_NgayHieuLuc");
        var strNgayHetHieuLuc = edu.util.getValById("txtBD_NgayHetHieuLuc");
        var check = edu.util.dateCompare(strNgayHieuLuc, strNgayHetHieuLuc); console.log(check)
        if (check == 1) {
            edu.system.alert("Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!");
            return;
        }
        var obj_save = {
            'action': 'NS_QT_BoiDuong/ThemMoi',            

            'strId': '',
            'strLoaiQuyetDinh_Id': edu.util.getValById("dropBD_QuyetDinh"),
            'strNgayApDung': edu.util.getValById("txtBD_NgayApDung"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNgayQuyetDinh': edu.util.getValById("txtBD_NgayQuyetDinh"),
            'strNgayHieuLuc': edu.util.getValById("txtBD_NgayHieuLuc"),
            'strNgayHetHieuLuc': edu.util.getValById("txtBD_NgayHetHieuLuc"),
            'strSoQuyetDinh': edu.util.getValById("txtBD_SoQuyetDinh"),
            'strNgayBatDau': edu.util.getValById("txtBD_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtBD_NgayKetThuc"),
            'strDiaDiemBoiDuong': edu.util.getValById("txtBD_DiaDiem"),
            'strNoiDungBoiDuong': edu.util.getValById("txtBD_NoiDung"),
            'strKetQuaDatDuoc': edu.util.getValById("txtBD_ChungChi"),
            'strThongTinDinhKem': "",
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("txtBD_QuyetDinh_ID"),
            'strHinhThucDaoTao_Id': edu.util.getValById("dropBD_HinhThucDaoTao"),
            'strHinhThucDaoTao_Khac': edu.util.getValById("txtBD_HinhThucDaoTaoKhac"),
            'strBangCapChungChi_Id': "",
            'iTrangThai': 1,
            'iThuTu': 0,
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
                        edu.system.saveFiles("txtBD_ThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        edu.system.saveFiles("txtBD_ThongTinDinhKem", me.strCommon_Id, "NS_Files");
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
        edu.util.resetValById("txtBD_DiaDiem");
        edu.util.resetValById("txtBD_NoiDung");
        edu.util.resetValById("txtBD_NgayBatDau");
        edu.util.resetValById("txtBD_NgayKetThuc");
        edu.util.resetValById("dropBD_HinhThucDaoTao");
        edu.util.resetValById("txtBD_HinhThucDaoTaoKhac");
        edu.util.resetValById("txtBD_ChungChi");
        edu.util.resetValById("txtBD_QuyetDinh_ID");
        edu.util.resetValById("dropBD_QuyetDinh");
        edu.util.resetValById("txtBD_SoQuyetDinh");
        edu.util.resetValById("txtBD_NgayApDung");
        edu.util.resetValById("txtBD_NgayHieuLuc");
        edu.util.resetValById("txtBD_NgayHetHieuLuc");
        edu.util.resetValById("txtBD_NgayQuyetDinh");
        edu.system.viewFiles("txtBD_ThongTinDinhKem", "");
    },
    genTable_BoiDuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbl_BoiDuong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
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
                        return '<span >' + edu.util.returnEmpty(aData.NGAYBATDAU) + '-' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</span>';
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
        me.popup_BoiDuong();
        edu.util.viewValById("txtBD_DiaDiem", data.DIADIEMBOIDUONG);
        edu.util.viewValById("txtBD_NoiDung", data.NOIDUNGBOIDUONG);
        edu.util.viewValById("txtBD_NgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtBD_NgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("dropBD_HinhThucDaoTao", data.HINHTHUCDAOTAO_ID);
        edu.util.viewValById("txtBD_HinhThucDaoTaoKhac", data.HINHTHUCDAOTAO_KHAC);
        edu.util.viewValById("txtBD_ChungChi", data.KETQUADATDUOC);
        edu.util.viewValById("txtBD_QuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("dropBD_QuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("txtBD_SoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtBD_NgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtBD_NgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtBD_NgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);
        edu.util.viewValById("txtBD_NgayHetHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.system.viewFiles("txtBD_ThongTinDinhKem", data.ID, "NS_Files");
        $('#dropBB_HinhThucDaoTao').trigger({ type: 'select2:select' });
        me.strCommon_Id = data.ID;
        $("#myModalLabel_BoiDuong").html('<i class="fa fa-pencil"></i> Chỉnh sửa quá trình bồi dưỡng');
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.QuaTrinhDaoTao;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
}