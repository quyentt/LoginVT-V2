/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function DeTai() { }
DeTai.prototype = {
    dtDeTai: [],
    dtDMDeTai: [],
    strDeTai_Id: "",
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrDVHT_Id: [],
    bcheckTimKiem: false,
    arrValid_DeTai: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_DeTai();
        });
        $("#btnSearchDeTai_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [1] Action DeTai
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_DeTai").click(function () {
            me.getList_DeTai();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DeTai();
            }
        });
        $("#btnSave_DeTai").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DeTai);
            if (edu.util.checkValue(me.strDeTai_Id)) {
                me.update_DeTai();
            }
            else {
                me.save_DeTai();
            }
        });
        $("#btnReWrite").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DeTai);
            if (edu.util.checkValue(me.strDeTai_Id)) {
                me.update_DeTai();
            }
            else {
                me.save_DeTai();
            }
            me.rewrite();
        });
        $("#tblDeTai").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.rewrite();
                me.strDeTai_Id = strId;
                me.getDetail_DeTai(strId);
                me.getList_KinhPhi();
                me.getList_DVHT();
                me.getList_DeTai_ThanhVien();
                me.getList_TDDT();
                me.getList_SPUD();
                me.getList_DeTai_KetQua();
                me.getList_SP_DeTai();
                edu.util.setOne_BgRow(strId, "tblDeTai");
                edu.system.viewFiles("txtDeTai_FileDinhKem", strId, "NCKH_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDeTai").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeTai(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_DeTai_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
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
        /*------------------------------------------
        --Discription: [2-2] Action DeTai_ThanhVien 
        --Order: 
        -------------------------------------------*/
        $("#tblInput_DeTai_ThanhVien").delegate('.btnDelete', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/del_detai_thanhvien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeTai_ThanhVien(strNhanSu_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [3-1] Action DonViHopTac html
        --Order: 
        -------------------------------------------*/
        $("#btnAdd_DeTai_DVHT").click(function () {
            var id = edu.util.randomString(30, "");
            var strDonVi = edu.util.getValById("txtDeTai_DVHT_Ten");
            var strQuocGia_Id = edu.util.getValById("dropDeTai_DVHT_QuocGia");
            var strQuocGia = $("#dropDeTai_DVHT_QuocGia option:selected").text();

            if (edu.util.checkValue(strDonVi) && edu.util.checkValue(strQuocGia_Id)) {
                me.genTable_DVHT(id, strDonVi, strQuocGia_Id, strQuocGia);

                edu.util.viewValById("txtDeTai_DVHT_Ten", "");
                edu.util.viewValById("dropDeTai_DVHT_QuocGia", "");
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DeTai_DVHT").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DVHT(strId);
                });
            }
        });
        /*------------------------------------------
       --Discription: [3-3] Action Sản phẩm ứng dụng
       --Order:
       -------------------------------------------*/
        $("#btnAdd_DeTai_TDDT").click(function () {
            var id = edu.util.randomString(30, "");
            var strThoiGian = edu.util.getValById("txtDeTai_TDDT_ThoiGian");
            var strSoTienThanhToan = edu.util.getValById("txtDeTai_TDDT_TienThanhToan");
            var strSoTienConLai = edu.util.getValById("txtDeTai_TDDT_TienConLai");

            if (edu.util.checkValue(strThoiGian) && edu.util.checkValue(strSoTienThanhToan)) {
                me.genTable_TDDT(id, strThoiGian, strSoTienThanhToan, strSoTienConLai);

                edu.util.viewValById("txtDeTai_TDDT_ThoiGian", "");
                edu.util.viewValById("txtDeTai_TDDT_TienThanhToan", "");
                edu.util.viewValById("txtDeTai_TDDT_TienConLai", "");
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DeTai_TDDT").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TDDT(strId);
                });
            }
        });
        $("#tblInput_DeTai_TDDT").delegate(".inputsotien", "keyup", function (e) {
            var strSoTien = $(this).val().replace(/,/g, '');
            if (strSoTien[0] == '0') strSoTien = strSoTien.substring(1);
            $(this).val(edu.util.formatCurrency(strSoTien));
        });
        /*------------------------------------------
       --Discription: [3-3] Action Nguon Kinh Phi
       --Order:
       -------------------------------------------*/
        $("#btnAdd_DeTai_KinhPhi").click(function () {
            var id = edu.util.randomString(30, "");
            var strNguon_Id = edu.util.getValById("dropDeTai_KinhPhi_Nguon");
            var strNguon = $("#dropDeTai_KinhPhi_Nguon option:selected").text();
            var strSoTien = edu.util.getValById("txtDeTai_KinhPhi_SoTien");
            var strDonVi_Id = edu.util.getValById("dropDeTai_KinhPhi_DonViTienTe");
            var strDonVi = $("#dropDeTai_KinhPhi_DonViTienTe option:selected").text();

            if (edu.util.checkValue(strNguon_Id) && edu.util.checkValue(strSoTien)) {
                me.genTable_KinhPhi(id, strNguon_Id, strNguon, strSoTien, strDonVi_Id, strDonVi);

                edu.util.viewValById("dropDeTai_KinhPhi_Nguon", "");
                edu.util.viewValById("txtDeTai_KinhPhi_SoTien", "");
                edu.util.viewValById("dropDeTai_KinhPhi_DonViTienTe", "");
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DeTai_KinhPhi").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KinhPhi(strId);
                });
            }
        });
        $("#tblInput_DeTai_KinhPhi").delegate(".inputsotien", "keyup", function (e) {
            var strSoTien = $(this).val().replace(/,/g, '');
            if (strSoTien[0] == '0') strSoTien = strSoTien.substring(1);
            $(this).val(edu.util.formatCurrency(strSoTien));
        });
        /*------------------------------------------
       --Discription: [4-1] Action TienDoDeTai_Detai
       --Order:
       -------------------------------------------*/
        $("#btnAdd_SanPhamUngDung").click(function () {
            var id = edu.util.randomString(30, "");
            var strLoai_Id = edu.util.getValById("dropDeTai_SP_Loai");
            var strLoai = $("#dropDeTai_SP_Loai option:selected").text();
            var strTen = edu.util.getValById("txtDeTai_SP_Ten");
            var strMoTa = edu.util.getValById("txtDeTai_SP_MoTa");
            if (edu.util.checkValue(strLoai_Id)) {
                edu.util.viewValById("dropDeTai_SP_Loai", "");
                edu.util.viewValById("txtDeTai_SP_Ten", "");
                edu.util.viewValById("txtDeTai_SP_MoTa", "");
                me.genTable_SPUD(id, strLoai_Id, strLoai, strTen, strMoTa);
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DeTai_SanPhamUngDung").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SPUD(strId);
                });
            }
        });

        $(".btnSearchDeTai_BaiBao").click(function () {
            $("#modal_TimBaiBao").modal("show");
            me.getList_DanhMucDeTai();
            setTimeout(function () {
                $("#txtSearchModal_DeTai_TuKhoa").focus();
            }, 500);
        });
        $("#btnSearch_Modal_DeTai").click(function () {
            me.getList_DanhMucDeTai();
        });
        $("#txtSearchModal_DeTai_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DanhMucDeTai();
            }
        });
        $("#modal_TimBaiBao").delegate(".btnChonDeTai", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.bcheckTimKiem = true;
                me.toggle_form();
                me.getDetail_DMDeTai(strId);
                me.getList_KinhPhi(strId);
                me.getList_DVHT(strId);
                me.getList_TDDT(strId);
                me.getList_SPUD(strId);
                edu.system.viewFiles("txtDeTai_FileDinhKem", strId, "NCKH_Files");
                edu.extend.getDetail_HS(me.genHTML_NhanSu);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_DonViThanhVien_DT").on("select2:select", function () {
            me.getList_HS();
            me.getList_DeTai();
        });
        $("#dropSearch_ThanhVienDangKy_DT").on("select2:select", function () {
            me.getList_DeTai();
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongMoiQDNT_DT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KetQua(id, "");
        });
        $("#zone_input_detai").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblQDNT_DT tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input_detai").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DeTai_KetQua(strId);
            });
        });
        $("#tblQDNT_DT tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.DeTai.genHTML_KetQua(id, "");
        }
        $("#btnAdd_SPKH").click(function () {
            var id = edu.util.randomString(30, "");
            var strSanPham_Id = edu.util.getValById("dropDeTai_SPKH");
            var strSanPham = $("#dropDeTai_SPKH option:selected").text();
            var strLoai = $("#dropDeTai_SPKH option:selected").attr("name");
            if (edu.util.checkValue(strSanPham_Id)) {
                edu.util.viewValById("dropDeTai_SPKH", "");
                me.genTable_SP_DeTai(strSanPham_Id, strSanPham, strLoai);
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DeTai_SPKH").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SP_DeTai(strId);
                });
            }
        });
        /*------------------------------------------
       --Discription: [4-1] Action TienDoDeTai_Detai
       --Order:
       -------------------------------------------*/
        $("#btnAdd_SPDT").click(function () {
            var id = edu.util.randomString(30, "");
            var strSanPham = edu.util.getValById("txtDeTai_SPDT");
            console.log(11111);
            var strLoai = "NCKH_SP_QUANLYDETAISINHVIEN";
            if (edu.util.checkValue(strSanPham)) {
                edu.util.viewValById("txtDeTai_SPDT", "");
                me.genTable_SP_DeTai(id, strSanPham, strLoai);
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_DeTai_SPDT").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SP_DeTai(strId);
                });
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.DETAI.XEPLOAI", "", "", data => me['dtXepLoai'] = data);
        me.toggle_notify();
        me.getList_HS();
        me.getList_NamDanhGia();
        me.getList_DanhMucDeTai();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        me.getList_DeTai();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.CAQL, "dropDeTai_CapQuanLy, dropSearch_DeTai_CapQuanLy");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LVNC, "dropDeTai_LinhVuc,dropSearchModal_DeTai_LinhVuc, dropSearch_DeTai_LinhVucNghienCuu");
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTDT,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.SPUD", "dropDeTai_SP_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.NGKP, "dropDeTai_KinhPhi_Nguon");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.DVTT, "dropDeTai_KinhPhi_DonViTienTe");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.PLDT, "dropDeTai_PhanLoai, dropSearchModal_DeTai_PhanLoai");
        var obj = {
            code: constant.setting.CATOR.NCKH.TTDT,
            renderPlace: "rdDeTai_TinhTrang",
            nameRadio: "rdDeTai_TinhTrang",
            title: ""
        };
        me.arrValid_DeTai = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDeTai_TenTiengViet", "THONGTIN1": "EM" },
            { "MA": "txtDeTai_Ma", "THONGTIN1": "EM" },
        ];
        edu.system.loadToRadio_DanhMucDuLieu(obj);
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropDeTai_DVHT_QuocGia");
        edu.system.uploadFiles(["txtDeTai_FileDinhKem"]);
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.rewrite();
        }, 300);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.TTDT", "", "", me.cbGetList_TTDT);
        me.getList_SP_ChuaThuocDeTai();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_detai");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_detai");
        $("#txtDeTai_Ten").focus();
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_detai");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.bcheckTimKiem = false;
        me.strDeTai_Id = "";
        me.arrNhanSu_Id = [];
        me.arrDVHT_Id = [];
        var arrId = ["txtDeTai_TenTiengViet", "txtDeTai_Ma", "txtDeTai_TenTiengAnh", "txtDeTai_ToChucCoDeTai", "dropDeTai_PhanLoai",
            "dropDeTai_CapQuanLy", "dropDeTai_LinhVuc", "txtDeTai_TuThang", "txtDeTai_DenThang", "dropDeTai_SanPhamUD",
            "txtTCQG_NoiDungMinhChung", "txtDeTai_SanPhamKhac", "txtDeTai_MucTieu", "txtDeTai_SP_MoTa", "dropDeTai_SP_Loai", "txtDeTai_SP_Ten", "dropDeTai_DVHT_QuocGia",
            "txtDeTai_DVHT_Ten", "dropDeTai_KinhPhi_DonViTienTe", "txtDeTai_KinhPhi_SoTien", "dropDeTai_KinhPhi_Nguon", "txtDeTai_TDDT_TienConLai", "txtDeTai_TDDT_TienThanhToan", "txtDeTai_TDDT_ThoiGian", "txtDeTai_TongSoTacGia"];
        edu.util.resetValByArrId(arrId);
        edu.util.resetRadio("name", "rdDeTai_TinhTrang");
        //table
        //don vi hop tac
        $("#tblInput_DeTai_DVHT tbody").html("");
        $("#tblInput_DeTai_KinhPhi tbody").html("");
        $("#tblInput_DeTai_TDDT tbody").html("");
        $("#tblInput_DeTai_ThanhVien tbody").html("");
        $("#tblInput_DeTai_SanPhamUngDung tbody").html("");
        edu.system.viewFiles("txtDeTai_FileDinhKem", "");
        $("#tblQDNT_DT tbody").html("");
        for (var i = 0; i < 4; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.DeTai.genHTML_KetQua(id, "");
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DeTai: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': "",
            'strTuKhoaText': edu.util.getValById("txtSearch_TuKhoa"),
            'dTuKhoaNumber': -1,
            'strNCKH_DeCuong_Id': "",
            'strCapQuanLy_Id': edu.util.getValById("dropSearch_DeTai_CapQuanLy"),
            'strLinhVucNghienCuu_Id': edu.util.getValById("dropSearch_DeTai_LinhVucNghienCuu"),
            'strNguonKinhPhi_Id': "",
            'strThietKeNghienCuu_Id': "",
            'strNCKH_ThanhVien_Id': edu.util.getValById("dropSearch_ThanhVienDangKy_DT"),
            'strDonVi_Id_CuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_DT"),
            'strDaoTao_CoCauToChuc_Id': "",
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strTinhTrang_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'strPhanLoaiDeTai_Id': edu.util.getValById("dropSearch_DeTai_Loai"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtDeTai = dtResult;
                    }
                    me.genTable_DeTai(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DeTai/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_DeTai/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DeTai_Full: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': "",
            'strTuKhoaText': edu.util.getValById("txtSearchModal_DeTai_TuKhoa"),
            'dTuKhoaNumber': -1,
            'strNCKH_DeCuong_Id': "",
            'strCapQuanLy_Id': "",
            'strLinhVucNghienCuu_Id': edu.util.getValById("dropSearchModal_DeTai_LinhVuc"),
            'strNguonKinhPhi_Id': "",
            'strThietKeNghienCuu_Id': "",
            'strNCKH_ThanhVien_Id': edu.system.userId,
            'strDonVi_Id_CuaThanhVien_Id': edu.util.getValById("dropSearchModal_DeTai_DonVi"),
            'strDaoTao_CoCauToChuc_Id': "",
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strTinhTrang_Id': "",
            'strPhanLoaiDeTai_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtDeTai_Full = dtResult;
                    }
                    me.genTable_DeTai_Full(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DeTai/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_DeTai/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DeTai: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblaiBaoTN_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblDeTai",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeTai.getList_DeTai()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDETAITIENGVIET) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_DanhMucDeTai: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblModal_DeTai",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeTai.getList_DanhMucDeTai()",
                iDataRow: iPager
            },
            aoColumns: [
                {
                    "mDataProp": "TENDETAI"
                },
                {
                    "mDataProp": "TENDETAITIENGANH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btnChonDeTai" data-dismiss="modal" id="' + aData.ID + '">Chọn đề tài</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_DeTai: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewEdit_DeTai);
    },
    getDetail_DMDeTai: function (strId, strAction) {
        var me = this;
        console.log(me.dtDMDeTai);
        edu.util.objGetDataInData(strId, me.dtDMDeTai, "ID", me.viewEdit_DeTai);
    },
    getList_DanhMucDeTai: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DanhMucDeTai/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearchModal_DeTai_TuKhoa"),
            'strPhanLoaiDeTai_Id': edu.util.getValById("txtSearchModal_DeTai_TuKhoa"),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genTable_DanhMucDeTai(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DanhMucDeTai/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_DanhMucDeTai/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_DanhMucDeTai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDETAI",
                code: "MADETAI",
                order: "unorder"
            },
            renderPlace: ["dropDeTai"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Save DeTai/DonViHopTac/ThanhVienThamGia
    -------------------------------------------*/
    save_DeTai: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_DeTai/ThemMoi',

            'strId': "",
            'strPhanLoaiDeTai_Id': edu.util.getValById("dropDeTai_PhanLoai"),
            'strSanPhamKhac': edu.util.getValById("txtDeTai_SanPhamKhac"),
            'strMucTieu': edu.util.getValById("txtDeTai_MucTieu"),
            'strDiaDiemThucHienDeTai': edu.util.getValById(""),
            'strDonViToChucCoDeTai': edu.util.getValById("txtDeTai_ToChucCoDeTai"),
            'strNCKH_DeCuong_Id': edu.util.getValById(""),
            'strMaDeTai': edu.util.getValById("txtDeTai_Ma"),
            'strTenDeTaiTiengViet': edu.util.getValById("txtDeTai_TenTiengViet"),
            'strTenDeTaiTiengAnh': edu.util.getValById("txtDeTai_TenTiengAnh"),
            'strCapQuanLy_Id': edu.util.getValById("dropDeTai_CapQuanLy"),
            'strQuyetDinhPheDuyetSo': edu.util.getValById(""),
            'strNgayPheDuyet': edu.util.getValById(""),
            'strThietKeNghienCuu_Id': edu.util.getValById(""),
            'strLinhVucNghienCuu_Id': edu.util.getValById("dropDeTai_LinhVuc"),
            'dKinhPhi_n': edu.util.getValById("txtDeTai_KinhPhi_SoTien"),
            'strNguonKinhPhi_Id': edu.util.getValById("dropDeTai_KinhPhi_Nguon"),
            'strDonViTinh_Id': edu.util.getValById("dropDeTai_DonViTienTe"),
            'strThoiGianBatDau': edu.util.getValById("txtDeTai_TuThang"),
            'dSoThangThucHien_n': edu.util.getValById(""),
            'strThoiGianKetThuc': edu.util.getValById("txtDeTai_DenThang"),
            'strThoiGianBaoCaoTienDo_Id': edu.util.getValById("txtDeTai_TDDT_ThoiGian"),
            'strCanBoNhapDeTai_Id': edu.system.userId,
            'strDeTaiTuVanSo': edu.util.getValById(""),
            'strNguoiKyDeTaiTuVan': edu.util.getValById(""),
            'strNgayKyDeTaiTuVan': edu.util.getValById(""),
            'strThongTinMinhChung': edu.util.getValById("txtDeTai_NoiDungMinhChung"),
            'strTinhTrang_Id': edu.util.getValRadio("name", "DropDeTai_TinhTrang"),
            'strFileMinhChung': edu.util.getValById(""),
            'dSoTacGia_n': edu.util.getValById("txtDeTai_TongSoTacGia"),
            'iTinhTrang': 1,
            'strNhaTaiTro': "",
            'strDoiTac_Id': "",
            'strQuocTich_Id': "",
            'strThanhVien_Id': "",
            'strVaiTro_Id': "",
            'iTrangThai': 1,
            'strTrangThai_ThanhVien': "",
            'strThuTu_ThanhVien': "",
            'strTyLeThamGia': ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeTai_Id = data.Id;
                    $("#tblInput_DeTai_KinhPhi tbody tr").each(function () {
                        var strNewKinhPhi_Id = this.id;
                        if (strNewKinhPhi_Id.length == 30 || me.bcheckTimKiem) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_KinhPhi(strNewKinhPhi_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_DVHT tbody tr").each(function () {
                        var strDonVi_Id = this.id;
                        if (strDonVi_Id.length == 30 || me.bcheckTimKiem) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_DVHT(strDonVi_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_TDDT tbody tr").each(function () {
                        var strTienDo_Id = this.id;
                        if (strTienDo_Id.length == 30 || me.bcheckTimKiem) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_TDDT(strTienDo_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_SanPhamUngDung tbody tr").each(function () {
                        var strSanPham_Id = this.id;
                        if (strSanPham_Id.length == 30 || me.bcheckTimKiem) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_SPUD(strSanPham_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_SPKH tbody tr").each(function () {
                        var strSanPham_Id = this.id;
                        me.save_SP_DeTai(strSanPham_Id, strDeTai_Id);
                    });
                    $("#tblInput_DeTai_SPDT tbody tr").each(function () {
                        var strId = this.id;
                        if (strId.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            var strSanPham = $("#lblSP" + strId).html();
                            me.save_DTSV(strSanPham, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strDeTai_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtDeTai_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtDeTai_FileDinhKem");
                        }
                    }
                    $("#tblQDNT_DT tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_KetQua(strKetQua_Id, strDeTai_Id);
                    });
                    edu.system.saveFiles("txtDeTai_FileDinhKem", strDeTai_Id, "NCKH_Files");
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                        $("#txtDeTai_TenTiengViet").focus();
                    });
                    setTimeout(function () {
                        me.getList_DeTai();
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_DeTai/ThemMoi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_DeTai/ThemMoi (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_DeTai: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_DeTai/CapNhat',

            'strId': me.strDeTai_Id,
            'strPhanLoaiDeTai_Id': edu.util.getValById("dropDeTai_PhanLoai"),
            'strSanPhamKhac': edu.util.getValById("txtDeTai_SanPhamKhac"),
            'strMucTieu': edu.util.getValById("txtDeTai_MucTieu"),
            'strDiaDiemThucHienDeTai': edu.util.getValById(""),
            'strDonViToChucCoDeTai': edu.util.getValById("txtDeTai_ToChucCoDeTai"),
            'strNCKH_DeCuong_Id': edu.util.getValById(""),
            'strMaDeTai': edu.util.getValById("txtDeTai_Ma"),
            'strTenDeTaiTiengViet': edu.util.getValById("txtDeTai_TenTiengViet"),
            'strTenDeTaiTiengAnh': edu.util.getValById("txtDeTai_TenTiengAnh"),
            'strCapQuanLy_Id': edu.util.getValById("dropDeTai_CapQuanLy"),
            'strQuyetDinhPheDuyetSo': edu.util.getValById(""),
            'strNgayPheDuyet': edu.util.getValById(""),
            'strThietKeNghienCuu_Id': edu.util.getValById(""),
            'strLinhVucNghienCuu_Id': edu.util.getValById("dropDeTai_LinhVuc"),
            'dKinhPhi_n': edu.util.getValById("txtDeTai_KinhPhi_SoTien"),
            'strNguonKinhPhi_Id': edu.util.getValById("dropDeTai_KinhPhi_Nguon"),
            'strDonViTinh_Id': edu.util.getValById("dropDeTai_DonViTienTe"),
            'strThoiGianBatDau': edu.util.getValById("txtDeTai_TuThang"),
            'dSoThangThucHien_n': edu.util.getValById(""),
            'strThoiGianKetThuc': edu.util.getValById("txtDeTai_DenThang"),
            'strThoiGianBaoCaoTienDo_Id': edu.util.getValById("txtDeTai_TDDT_ThoiGian"),
            'strCanBoNhapDeTai_Id': edu.system.userId,
            'strDeTaiTuVanSo': edu.util.getValById(""),
            'strNguoiKyDeTaiTuVan': edu.util.getValById(""),
            'strNgayKyDeTaiTuVan': edu.util.getValById(""),
            'strThongTinMinhChung': edu.util.getValById("txtDeTai_NoiDungMinhChung"),
            'strTinhTrang_Id': edu.util.getValRadio("name", "DropDeTai_TinhTrang"),
            'strFileMinhChung': edu.util.getValById(""),
            'dSoTacGia_n': edu.util.getValById("txtDeTai_TongSoTacGia"),
            'iTinhTrang': 1,
            'strNhaTaiTro': "",
            'strDoiTac_Id': "",
            'strQuocTich_Id': "",
            'strThanhVien_Id': "",
            'strVaiTro_Id': "",
            'iTrangThai': 1,
            'strTrangThai_ThanhVien': "",
            'strThuTu_ThanhVien': "",
            'strTyLeThamGia': ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeTai_Id = me.strDeTai_Id;
                    edu.system.alert("Cập nhật đề tài thành công!");
                    $("#tblInput_DeTai_KinhPhi tbody tr").each(function () {
                        var strNewKinhPhi_Id = this.id;
                        if (strNewKinhPhi_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_KinhPhi(strNewKinhPhi_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_DVHT tbody tr").each(function () {
                        var strDonVi_Id = this.id;
                        if (strDonVi_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_DVHT(strDonVi_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_TDDT tbody tr").each(function () {
                        var strTienDo_Id = this.id;
                        if (strTienDo_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_TDDT(strTienDo_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_SanPhamUngDung tbody tr").each(function () {
                        var strSanPham_Id = this.id;
                        if (strSanPham_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_SPUD(strSanPham_Id, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_SPKH tbody tr").each(function () {
                        var strSanPham_Id = this.id;
                        me.save_SP_DeTai(strSanPham_Id, strDeTai_Id);
                    });
                    $("#tblInput_DeTai_SPDT tbody tr").each(function () {
                        var strId = this.id;
                        if (strId.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            var strSanPham = $("#lblSP" + strId).html();
                            me.save_DTSV(strSanPham, strDeTai_Id);
                        }
                    });
                    $("#tblInput_DeTai_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strDeTai_Id);
                    });
                    $("#tblQDNT_DT tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_KetQua(strKetQua_Id, strDeTai_Id);
                    });
                    edu.system.saveFiles("txtDeTai_FileDinhKem", strDeTai_Id, "NCKH_Files");
                    me.getList_DeTai();
                }
                else {
                    edu.system.alert("NCKH_DeTai/CapNhat: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_DeTai/CapNhat (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Update_DeTai
    -------------------------------------------*/
    viewEdit_DeTai: function (data) {
        var me = this;
        console.log(data);
        var dtDeTai = data[0];
        //View - Thong tin
        edu.util.viewValById("txtDeTai_TenTiengViet", dtDeTai.TENDETAI);
        edu.util.viewValById("txtDeTai_Ma", dtDeTai.MADETAI);
        edu.util.viewValById("txtDeTai_TenTiengAnh", dtDeTai.TENDETAITIENGANH);

        edu.util.viewValById("txtDeTai_ToChucCoDeTai", dtDeTai.DONVITOCHUCCODETAI);
        edu.util.viewValById("dropDeTai_PhanLoai", dtDeTai.PHANLOAIDETAI_ID);
        edu.util.viewValById("dropDeTai_CapQuanLy", dtDeTai.CAPQUANLY_ID);
        edu.util.viewValById("dropDeTai_LinhVuc", dtDeTai.LINHVUCNGHIENCUU_ID);

        edu.util.viewValById("txtDeTai_TuThang", dtDeTai.THOIGIANBATDAU);
        edu.util.viewValById("txtDeTai_DenThang", dtDeTai.THOIGIANKETTHUC);
        edu.util.viewValById("dropDeTai_SanPhamUD", dtDeTai.SANPHAMUNGDUNG);
        edu.util.viewValById("txtDeTai_SanPhamKhac", dtDeTai.SANPHAMKHAC);
        edu.util.viewValById("txtDeTai_MucTieu", dtDeTai.MUCTIEU);
        edu.util.viewValById("txtDeTai_SoTien", dtDeTai.SOTIEN);
        edu.util.viewValById("txtDeTai_NoiDungMinhChung", dtDeTai.THONGTINMINHCHUNG);
        edu.util.viewValById("txtDeTai_TongSoTacGia", dtDeTai.SOTACGIA_N);
       
    },
    /*------------------------------------------
    --Discription: [1] AccessDB GetDetail DeTai/DonViHopTac/ThanhVienThamGia
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [1] AcessDB Delete_DeTai
    -------------------------------------------*/
    delete_DeTai: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_DeTai/Xoa',
            
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DeTai();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai/Xoa (er): " + JSON.stringify(er),
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

    getList_SP_ChuaThuocDeTai: function (strDeTai_Id) {
        var me = this;
        //--Edit
        if (strDeTai_Id == undefined) strDeTai_Id = me.strDeTai_Id;
        var obj_list = {
            'action': 'NCKH_DeTai_SanPham/LayDSSanPhamChuaThuocDeTai',
            'strLoaiSanPham': "",
            'strThanhVien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    var arrSPKH = [];
                    var arrSPDT = [];
                    for (var i = 0; i < dtResult.length; i++) {
                        if (dtResult[i].LOAI == "NCKH_SP_QUANLYDETAISINHVIEN") {
                            arrSPDT.push(dtResult[i]);
                        } else {
                            arrSPKH.push(dtResult[i]);
                        }
                    }
                    me.genComBo_SPKH(arrSPKH);
                    me.genComBo_SPDT(arrSPDT);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_SP_DeTai: function (strId, strDeTai_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_DeTai_SanPham/CapNhat',
            

            'strSanPham_Id': strId,
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SP_DeTai: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_DeTai_SanPham/Xoa',

            'strSanPham_Id': strId,
            'strNCKH_QuanLyDeTai_Id': me.strDeTai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_SP_DeTai();
                    me.getList_SP_ChuaThuocDeTai();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genComBo_SPKH: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA",
                Render: function (nrow, aData) {
                    return '<option id="' + aData.ID + '" name="' + aData.LOAI + '" value="' + aData.ID + '">' + aData.TENSANPHAM + '</option>';
                }
            },
            renderPlace: ["dropDeTai_SPKH"],
            type: "",
            title: "Chọn sản phẩm"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComBo_SPDT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA",
                Render: function (nrow, aData) {
                    return '<option id="' + aData.ID + '" name="' + aData.LOAI + '" value="' + aData.ID + '">' + aData.TENSANPHAM + '</option>';
                }
            },
            renderPlace: ["dropDeTai_SPDT"],
            type: "",
            title: "Chọn sản phẩm"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DeTai_ThanhVien: function (strNhanSu_Id, strDeTai_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',

            'strSanPham_Id': strDeTai_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    obj_notify = {
                        renderPlace: "slnhansu" + strNhanSu_Id,
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }
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
    getList_DeTai_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',

            'strSanPham_Id': me.strDeTai_Id,
            'pageIndex': 1,
            'pageSize': 100
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_DeTai_ThanhVien(dtResult);
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
    delete_DeTai_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strDeTai_Id,
            'strThanhVien_Id': strNhanSu_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DeTai_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DeTai_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_DeTai_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DeTai_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = main_doc.DeTai;
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
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DeTai_ThanhVien tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_DeTai_ThanhVien tbody").html("");
            $("#tblInput_DeTai_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.DeTai;
        me.dtVaiTro = data;
    },
    genCombo_VaiTro: function (place) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB DonViHopTac
    --ULR:  Modules
    -------------------------------------------*/
    save_DVHT: function (strId, strDeTai_Id) {
        var me = this;
        var strDoiTac = $("#tblInput_DeTai_DVHT #" + strId + " #lblDeTai_DVHT_DonVi").html();
        var strQuocTich_Id = $("#tblInput_DeTai_DVHT #" + strId + " #lblDeTai_DVHT_QuocGia").attr("name");
        var obj_save = {
            'action': 'NCKH_DeTai_DoiTac/ThemMoi',

            'strId': "",
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strQuocTich_Id': strQuocTich_Id,
            'strDoiTac': strDoiTac,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DVHT: function (strDeTai_Id) {
        var me = this;
        //--Edit
        if (strDeTai_Id == undefined) strDeTai_Id = me.strDeTai_Id;
        var obj_list = {
            'action': 'NCKH_DeTai_DoiTac/LayDanhSach',
            
            'strTuKhoa': '',
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strQuocTich_Id': "",
            'strDoiTac': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_DeTai_DVHT tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_DVHT(dtReRult[i].ID, dtReRult[i].DOITAC, dtReRult[i].QUOCTICH_ID, dtReRult[i].QUOCTICH_TEN);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DVHT: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_DeTai_DoiTac/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DVHT();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
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
    --Discription: [4] GenHTML Kinh phí
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DVHT: function (strRowId, strDonVi, strQuocGia_Id, strQuocGia) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td>';
        row += 'Đơn vị<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_DVHT_DonVi">' + strDonVi + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Quốc gia<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_DVHT_QuocGia" name="' + strQuocGia_Id + '">' + strQuocGia + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        $("#tblInput_DeTai_DVHT tbody").append(row);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB DonViHopTac
    --ULR:  Modules
    -------------------------------------------*/
    save_KinhPhi: function (strId, strDeTai_Id) {
        var me = this;
        var strNguon_Id = $("#tblInput_DeTai_KinhPhi #" + strId + " #lblDeTai_KinhPhi_Nguon").attr("name");
        var strSoTien = $("#tblInput_DeTai_KinhPhi #" + strId + " #lblDeTai_KinhPhi_SoTien").html();
        var strDonVi_Id = $("#tblInput_DeTai_KinhPhi #" + strId + " #lblDeTai_KinhPhi_DonViTienTe").attr("name");
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_NguonKinhPhi/ThemMoi',

            'strId': "",
            'strSanPham_Id': strDeTai_Id,
            'strNguonKinhPhi_Id': strNguon_Id,
            'strDonViTinh_Id': strDonVi_Id,
            'dSoTien': strSoTien.replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {;
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KinhPhi: function (strDeTai_Id) {
        var me = this;
        if (strDeTai_Id == undefined) strDeTai_Id = me.strDeTai_Id;
        var obj_list = {
            'action': 'NCKH_SP_NguonKinhPhi/LayDanhSach',

            'strSanPham_Id': strDeTai_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_DeTai_KinhPhi tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_KinhPhi(dtReRult[i].ID, dtReRult[i].NGUONKINHPHI_ID, dtReRult[i].NGUONKINHPHI_TEN, dtReRult[i].SOTIEN, dtReRult[i].DONVITINH_ID, dtReRult[i].DONVITINH_TEN);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KinhPhi: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_SP_NguonKinhPhi/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KinhPhi();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
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
    --Discription: [4] GenHTML Kinh phí
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KinhPhi: function (strRowId, strNguon_Id, strNguon, strSoTien, strDonVi_Id, strDonVi) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td>';
        row += 'Tên nguồn<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_KinhPhi_Nguon" name="' + strNguon_Id + '">' + strNguon + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Số tiền<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_KinhPhi_SoTien">' + edu.util.formatCurrency(strSoTien) + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Đơn vị<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_KinhPhi_DonViTienTe" name="' + strDonVi_Id + '">' + strDonVi + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        $("#tblInput_DeTai_KinhPhi tbody").append(row);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB TienDoDeTai
    --ULR:  Modules
    -------------------------------------------*/
    save_TDDT: function (strId, strDeTai_Id) {
        var me = this;
        var strThoiGian = $("#tblInput_DeTai_TDDT #" + strId + " #lblDeTai_TDDT_ThoiGian").html();
        var strTienThanhToan = $("#tblInput_DeTai_TDDT #" + strId + " #lblDeTai_TDDT_TienThanhToan").html();
        var strTienConLai = $("#tblInput_DeTai_TDDT #" + strId + " #lblDeTai_TDDT_TienConLai").html();
        var obj_save = {
            'action': 'NCKH_DeTai_TienDo/ThemMoi',

            'strId': "",
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strThoiGian': strThoiGian,
            'dSoTienThanhToan': strTienThanhToan.replace(/,/g, ''),
            'dSoTienConLai': strTienConLai.replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TDDT: function (strDeTai_Id) {
        var me = this;
        if (strDeTai_Id == undefined) strDeTai_Id = me.strDeTai_Id;
        var obj_list = {
            'action': 'NCKH_DeTai_TienDo/LayDanhSach',
            
            'strTuKhoa': '',
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_DeTai_TDDT tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_TDDT(dtReRult[i].ID, dtReRult[i].THOIGIAN, dtReRult[i].SOTIENTHANHTOAN, dtReRult[i].SOTIENCONLAI);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TDDT: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_DeTai_TienDo/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_TDDT();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TDDT: function (strRowId, strThoiGian, strTienThanhToan, strTienConLai) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td>';
        row += 'Thời gian<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_TDDT_ThoiGian" name="' + strThoiGian + '">' + strThoiGian + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Tiền thanh toán<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_TDDT_TienThanhToan">' + edu.util.formatCurrency(strTienThanhToan) + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Tiền còn lại<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_TDDT_TienConLai">' + edu.util.formatCurrency(strTienConLai) + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        $("#tblInput_DeTai_TDDT tbody").append(row);
    },


    save_SPKH: function (strId, strDeTai_Id) {
        var me = this;
        var strSanPham_Id = $("#tblInput_DeTai_SPKH #" + strId + " #lblDeTai_SPKH_Ten").html();
        var obj_save = {
            'action': 'NCKH_DeTai_SanPham/ThemMoi',

            'strSanPham_Id': strId,
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB TienDoDeTai
    --ULR:  Modules
    -------------------------------------------*/
    save_SPUD: function (strId, strDeTai_Id) {
        var me = this;
        var strLoaiSanPham_Id = $("#tblInput_DeTai_SanPhamUngDung #" + strId + " #lblDeTai_SP_Loai").attr("name");
        var strTenSanPham = $("#tblInput_DeTai_SanPhamUngDung #" + strId + " #lblDeTai_SP_Ten").html();
        var strMoTa = $("#tblInput_DeTai_SanPhamUngDung #" + strId + " #lblDeTai_SP_MoTa").html();
        var obj_save = {
            'action': 'NCKH_SP_DeTai/ThemMoi',

            'strId': "",
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strLoaiSanPham_Id': strLoaiSanPham_Id,
            'strTenSanPham': strTenSanPham,
            'strMoTa': strMoTa,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_SPUD: function (strDeTai_Id) {
        var me = this;
        if (strDeTai_Id == undefined) strDeTai_Id = me.strDeTai_Id;
        var obj_list = {
            'action': 'NCKH_SP_DeTai/LayDanhSach',
            
            'strTuKhoa': '',
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strLoaiSanPham_Id': "",
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_DeTai_SanPhamUngDung tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_SPUD(dtReRult[i].ID, dtReRult[i].LOAISANPHAM_ID, dtReRult[i].LOAISANPHAM_TEN, dtReRult[i].TENSANPHAM, dtReRult[i].MOTA);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_SPUD: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_DeTai/Xoa',
            
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_SPUD();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SPUD: function (strRowId, strLoai_Id, strLoai, strTen, strMoTa) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td>';
        row += 'Loại<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_SP_Loai" name="' + strLoai_Id + '">' + strLoai + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Tên<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_SP_Ten">' + strTen + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Mô tả<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblDeTai_SP_MoTa">' + strMoTa + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        $("#tblInput_DeTai_SanPhamUngDung tbody").append(row);
    },

    getList_CoCauToChuc: function () {
        var me = main_doc.DeTai;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
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
            renderPlace: ["dropSearchModal_DeTai_DonVi","dropSearch_DonViThanhVien_DT"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DT"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVienDangKy_DT"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_NamDanhGia: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TinhDiem_KeHoach/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_NamDanhGia(dtReRult);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_NamDanhGia: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MOTA",
                code: "MA"
            },
            renderPlace: ["dropSearch_NamDanhGia_DT"],
            type: "",
            title: "Tất cả kế hoạch đánh giá"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_DeTai_KetQua: function (strKetQua_Id, strDeTai_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strSoQuyetDinh = edu.util.getValById('txtQuyetDinh' + strKetQua_Id);
        var strNgay = edu.util.getValById('txtNgay' + strKetQua_Id);
        var strThang = edu.util.getValById('txtThang' + strKetQua_Id);
        var strNam = edu.util.getValById('txtNam' + strKetQua_Id);
        var strMoTa = edu.util.getValById('txtMoTa' + strKetQua_Id);
        var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strKetQua_Id);
        if (!edu.util.checkValue(strSoQuyetDinh) || !edu.util.checkValue(strNam) || !edu.util.checkValue(strTinhTrang_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_DeTai_KetQua/ThemMoi',

            'strId': strId,
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
            'strFileMinhChung': '',
            'strThongTinMinhChung': '',
            'strTinhTrang_Id': strTinhTrang_Id,
            'strXepLoai_Id': edu.util.getValById('dropDeTai_XepLoai' + strKetQua_Id),
            'strMoTa': strMoTa,
            'strNgay': strNgay,
            'strThang': strThang,
            'dTongThoiGianQuyDinh': edu.util.getValById('txtTGQuyDinh' + strKetQua_Id),
            'dTongThoiGianDaThucHien': edu.util.getValById('txtTGThucHien' + strKetQua_Id),

            'strNam': strNam,
            'strSoQuyetDinh': strSoQuyetDinh,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NCKH_DeTai_KetQua/CapNhat';
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
                    edu.system.notifyLocal(obj_notify);
                }
                if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strKetQua_Id, strId, "NCKH_Files");
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
    getList_DeTai_KetQua: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DeTai_KetQua/LayDanhSach',

            'strTuKhoa': '',
            'strNCKH_QuanLyDeTai_Id': me.strDeTai_Id,
            'iTinhTrang': -1,
            'strTinhTrang_Id': '',
            'strNguoiThucHien_Id': '',
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
                        me.genHTML_KetQua_Data(dtResult);
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
    delete_DeTai_KetQua: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_DeTai_KetQua/Xoa',
            
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
                    me.getList_DeTai_KetQua();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_KetQua_Data: function (data) {
        var me = this;
        $("#tblQDNT_DT tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtQuyetDinh' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].SOQUYETDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].NGAY) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtThang' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].THANG) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNam' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].NAM) + '" class="form-control"/></td>';
            row += '<td><select id="dropDeTai_TinhTrang' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><select id="dropDeTai_XepLoai' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn Xếp loại--</option ></select ></td>';
            row += '<td><input type="text" id="txtTGQuyDinh' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].TONGTHOIGIANQUYDINH) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtTGThucHien' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].TONGTHOIGIANDATHUCHIEN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(data[i].MOTA) + '" class="form-control"/></td>';
            row += '<td><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblQDNT_DT tbody").append(row);
            edu.system.uploadFiles(["txtFileDinhKem" + strKetQua_Id]);
            me.genComBo_TTDT("dropDeTai_TinhTrang" + strKetQua_Id, data[i].TINHTRANG_ID);
            me.genComBo_XepLoai("dropDeTai_XepLoai" + strKetQua_Id, data[i].XEPLOAI_ID);
            edu.system.viewFiles("txtFileDinhKem" + strKetQua_Id, strKetQua_Id, "NCKH_Files");
        }
        for (var i = data.length; i < 2; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_KetQua(id, "");
        }
    },
    genHTML_KetQua: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblQDNT_DT").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtQuyetDinh' + strKetQua_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgay' + strKetQua_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtThang' + strKetQua_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNam' + strKetQua_Id + '" class="form-control"/></td>';
        row += '<td><select id="dropDeTai_TinhTrang' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><select id="dropDeTai_XepLoai' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn Xếp loại --</option ></select ></td>';
        row += '<td><input type="text" id="txtTGQuyDinh' + strKetQua_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtTGThucHien' + strKetQua_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" class="form-control"/></td>';
        row += '<td><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblQDNT_DT tbody").append(row);
        edu.system.uploadFiles(["txtFileDinhKem" + strKetQua_Id]);
        me.genComBo_TTDT("dropDeTai_TinhTrang" + strKetQua_Id, "");
        me.genComBo_XepLoai("dropDeTai_XepLoai" + strKetQua_Id, "");
    },
    cbGetList_TTDT: function (data) {
        main_doc.DeTai.dtTinhTrang = data;
    },
    genComBo_TTDT: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTinhTrang,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn tình trạng"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_XepLoai: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtXepLoai,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn xếp loại"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    
    getList_SP_DeTai: function (strDeTai_Id) {
        var me = this;
        if (strDeTai_Id == undefined) strDeTai_Id = me.strDeTai_Id;
        var obj_list = {
            'action': 'NCKH_DeTai_SanPham/LayDanhSach',
            'strLoaiSanPham': "",
            'strThanhVien_Id': edu.system.userId,
            'strNCKH_QuanLyDeTai_Id': strDeTai_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_DeTai_SPDT tbody").html("");
                    $("#tblInput_DeTai_SPKH tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_SP_DeTai(dtReRult[i].ID, dtReRult[i].TENSANPHAM, dtReRult[i].LOAI);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_SP_DeTai: function (strRowId, strSanPham, strLoai) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td style="width: 80px">';
        row += 'Tên<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblSP' + strRowId + '">' + strSanPham + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        if (strLoai == "NCKH_SP_QUANLYDETAISINHVIEN") {
            $("#tblInput_DeTai_SPDT tbody").append(row);
        } else {
            $("#tblInput_DeTai_SPKH tbody").append(row);
        }
    },
};