/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 22/10/2018
----------------------------------------------*/
function HoiNghiHoiThao() { }
HoiNghiHoiThao.prototype = {
    dtHNHT: [],
    strHoiNghiHT_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrValid_HNHT: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
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
        $(".btnReWrite").click(function () {
            me.rewrite();
        });

        $(".btnExtend_Search").click(function () {
            me.getList_HNHT();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HNHT();
            }
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [1] Action HoiNghiHoiThao
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HNHT").click(function () {
            me.getList_HNHT();
        });
        $("#txtSearch_HNHT_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HNHT();
            }
        });
        $("#btnSave_HNHT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_HNHT);
            if (valid) {
                if (edu.util.checkValue(me.strHoiNghiHT_Id)) {
                    me.update_HNHT();
                }
                else {
                    me.save_HNHT();
                }
            }

        });
        $("#tblHNHT").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblHNHT");
                me.rewrite();
                me.toggle_form();
                me.strHoiNghiHT_Id = strId; console.log(1111);
                me.getDetail_HNHT(strId, constant.setting.ACTION.EDIT);
                me.getList_HNHT_ThanhVien(constant.setting.ACTION.EDIT);
                me.getList_KinhPhi();
                edu.system.viewFiles("txtHNHT_FileDinhKem", strId, "NCKH_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHNHT").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HNHT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [3] Action HNHT_ThanhVien input
        --Order: 
        -------------------------------------------*/
        $(".btnSearchHNHT_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_HNHT_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HNHT_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
       --Discription: [3-3] Action Nguon Kinh Phi
       --Order:
       -------------------------------------------*/
        $("#btnAdd_HNHT_KinhPhi").click(function () {
            var id = edu.util.randomString(30, "");
            var strNguon_Id = edu.util.getValById("dropHNHT_KinhPhi_Nguon");
            var strNguon = $("#dropHNHT_KinhPhi_Nguon option:selected").text();
            var strSoTien = edu.util.getValById("txtHNHT_KinhPhi_SoTien");
            var strDonVi_Id = edu.util.getValById("dropHNHT_KinhPhi_DonViTienTe");
            var strDonVi = $("#dropHNHT_KinhPhi_DonViTienTe option:selected").text();

            if (edu.util.checkValue(strNguon_Id) && edu.util.checkValue(strSoTien)) {
                me.genTable_KinhPhi(id, strNguon_Id, strNguon, strSoTien, strDonVi_Id, strDonVi);

                edu.util.viewValById("dropHNHT_KinhPhi_Nguon", "");
                edu.util.viewValById("txtHNHT_KinhPhi_SoTien", "");
                edu.util.viewValById("dropHNHT_KinhPhi_DonViTienTe", "");
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_HNHT_KinhPhi").delegate(".btnDeletePoiter", "click", function (e) {
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
        $("#tblInput_HNHT_KinhPhi").delegate(".inputsotien", "keyup", function (e) {
            var strSoTien = $(this).val().replace(/,/g, '');
            if (strSoTien[0] == '0') strSoTien = strSoTien.substring(1);
            $(this).val(edu.util.formatCurrency(strSoTien));
        });
        $("#dropSearch_DonViThanhVien_HNHT").on("select2:select", function () {
            me.getList_HS();
            me.getList_HNHT();
        });
        $("#dropSearch_ThanhVienDangKy_HNHT").on("select2:select", function () {
            me.getList_HNHT();
        });
        $("#dropSearch_PhamVi_HNHT").on("select2:select", function () {
            me.getList_HNHT();
        });
        $("#dropSearch_LinhVuc_HNHT").on("select2:select", function () {
            me.getList_HNHT();
        });
        $("#dropSearch_DonViToChuc_HNHT").on("select2:select", function () {
            me.getList_HNHT();
        });
        $("#dropSearch_DeTai_HNHT").on("select2:select", function () {
            me.getList_HNHT();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtHNHT_FileDinhKem"]);
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load TapChiQuocTe
        -------------------------------------------*/
        me.getList_HNHT();
        me.getList_DeTai();
        me.getList_HS();
        me.getList_NamDanhGia();
        var obj = {
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
            strCoCauToChuc_Id: "",
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: 0
        };
        me.arrValid_HNHT = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtHNHT_TenHoiNghiHoiThao", "THONGTIN1": "EM" },
            { "MA": "txtHNHT_TenBaoCao", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        edu.system.getList_NhanSu(obj, "", "", me.genCombo_NhanSu);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.PVHT", "dropHNHT_PhamVi,dropSearch_PhamVi_HNHT", "Tất cả phạm vi");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LVNC", "dropHNHT_LinhVuc_Nganh,dropSearch_LinhVuc_HNHT", "Tất cả lĩnh vực");
        var obj = {
            strMaBangDanhMuc: "NCKH.VTHT",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        me.getList_CoCauToChuc();
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.DTHT", "dropHNHT_DonViToChuc,dropSearch_DonViToChuc_HNHT");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.NGKP, "dropHNHT_KinhPhi_Nguon");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.DVTT, "dropHNHT_KinhPhi_DonViTienTe");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.PLDT, "dropDeTaiHNHT_PhanLoai");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_hnht");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_hnht");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_hnht");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strHoiNghiHT_Id = "";
        me.arrNhanSu_Id = [];
        //
        var arrId = ["txtHNHT_Ten", "txtHNHT_TenBaoCao", "txtHNHT_MucTieu", "txtHNHT_NoiDung", "txtHNHT_NoiDung", "txtHNHT_NamBaoCao", "dropHNHT_PhamVi", "txtHNHT_MaSanPham", "dropHNHT_LinhVuc_Nganh", "dropHNHT_DonViToChuc", "txtHNHT_SoDaiBieuQuocTe", "txtHNHT_SoDaiBieuTrongNuoc", "txtHNHT_SoLuongBaoCao", "txtHNHT_SoLuongNguoiBaoCao", "txtHNHT_ThanhPhanThamGia", "txtHNHT_NoiDungMinhChung", "dropHNHT_DeTai"
            , "txtHNHT_TenHoiNghiHoiThao", "dropHNHT_KinhPhi_DonViTienTe", "txtHNHT_KinhPhi_SoTien", "dropHNHT_KinhPhi_Nguon", "txtHNHT_NamHoanThanh", "txtHNHT_ISBN"];
        edu.util.resetValByArrId(arrId);
        $("#tblInput_HNHT_KinhPhi tbody").html("");
        $("#tblInput_HNHT_ThanhVien tbody").html("");
        //
        //reset file
        edu.system.viewFiles("txtHNHT_FileDinhKem", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiNghiHoiThao
    -------------------------------------------*/
    getList_HNHT: function () {
        var me = this;
        
        var obj_list = {
            'action': 'NCKH_HoiNghiHoiThao/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_LinhVuc_HNHT"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropSearch_DeTai_HNHT"),
            'strPhamViHoiNghiHoiThao_Id': edu.util.getValById("dropSearch_PhamVi_HNHT"),
            'strNCKH_DeTai_ThanhVien_Id': edu.util.getValById("dropSearch_ThanhVienDangKy_HNHT"),
            'strVaitro_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_HNHT"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strDonViToChuc_Id': edu.util.getValById("dropSearch_DonViToChuc_HNHT"),
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
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
                        me.dtHNHT = dtResult;
                    }
                    me.genTable_HNHT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_HoiNghiHoiThao/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiNghiHoiThao/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HNHT: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtHNHT, "ID", me.viewEdit_HNHT);
    },
    save_HNHT: function () {
        var me = this;
        
        var obj_save = {
            'action': 'NCKH_HoiNghiHoiThao/ThemMoi',            

            'strId': "",
            'strGhiChu': "",
            'strDiaDiem': edu.util.getValById("txtHNHT_DiaDiem"),
            'strThoiGianToChuc': edu.util.getValById("txtHNHT_ThoiGianToChuc"),
            'dTyLeThamGia': 0,
            'dSoDaiBieuTrongNuoc': edu.util.getValById("txtHNHT_SoDaiBieuTrongNuoc"),
            'dSoDaiBieuQuocTe': edu.util.getValById("txtHNHT_SoDaiBieuQuocTe"),
            'strDonViToChuc_Id': edu.util.getValById("dropHNHT_DonViToChuc"),
            'strTenHoiNghiHoiThao': edu.util.getValById("txtHNHT_TenHoiNghiHoiThao"),
            'strTenBaoCao': edu.util.getValById("txtHNHT_TenBaoCao"),
            'dSoTacGia_n': edu.util.getValById("txtHNHT_SoLuongNguoiBaoCao"),
            'strNamBaoCao': edu.util.getValById("txtHNHT_NamBaoCao"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropHNHT_LinhVuc_Nganh"),
            'strPhamViHoiNghiHoiThao_Id': edu.util.getValById("dropHNHT_PhamVi"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strVaitro_Id': "",
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropHNHT_DeTai"),
            'strNamHoanThanh': edu.util.getValById("txtHNHT_NamHoanThanh"),
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtHNHT_NoiDungMinhChung"),
            'strMaSanPham': edu.util.getValById("txtHNHT_MaSanPham"),
            'strChiSo_ISBN': edu.util.getValById("txtHNHT_ISBN"),
            'strMucTieu': edu.util.getValById("txtHNHT_MucTieu"),
            'strNoiDung': edu.util.getValById("txtHNHT_NoiDung"),
            'dSoLuongBaoCao': edu.util.getValById("txtHNHT_SoLuongBaoCao"),
            'dSoLuongNguoiBaoCao': edu.util.getValById("txtHNHT_SoLuongNguoiBaoCao"),
            'strThanhPhanThamGia': edu.util.getValById("txtHNHT_ThanhPhanThamGia"),
            'iTrangThai': 1,
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHoiNghiHT_Id = data.Id;
                    $("#tblInput_HNHT_KinhPhi tbody tr").each(function () {
                        var strNewKinhPhi_Id = this.id;
                        if (strNewKinhPhi_Id.length == 30 || me.bcheckTimKiem) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_KinhPhi(strNewKinhPhi_Id, strHoiNghiHT_Id);
                        }
                    });
                    $("#tblInput_HNHT_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_HNHT_ThanhVien(strNhanSu_Id, strHoiNghiHT_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtHNHT_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtHNHT_FileDinhKem");
                        }
                    }
                    edu.system.saveFiles("txtHNHT_FileDinhKem", strHoiNghiHT_Id, "NCKH_Files");
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                    });
                    setTimeout(function () {
                        me.getList_HNHT();
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_HoiNghiHoiThao/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiNghiHoiThao/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HNHT: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_HoiNghiHoiThao/CapNhat',            

            'strId': me.strHoiNghiHT_Id,
            'strGhiChu': "",
            'strDiaDiem': edu.util.getValById("txtHNHT_DiaDiem"),
            'strThoiGianToChuc': edu.util.getValById("txtHNHT_ThoiGianToChuc"),
            'dTyLeThamGia': 0,
            'dSoDaiBieuTrongNuoc': edu.util.getValById("txtHNHT_SoDaiBieuTrongNuoc"),
            'dSoDaiBieuQuocTe': edu.util.getValById("txtHNHT_SoDaiBieuQuocTe"),
            'strDonViToChuc_Id': edu.util.getValById("dropHNHT_DonViToChuc"),
            'strTenHoiNghiHoiThao': edu.util.getValById("txtHNHT_TenHoiNghiHoiThao"),
            'strTenBaoCao': edu.util.getValById("txtHNHT_TenBaoCao"),
            'dSoTacGia_n': edu.util.getValById("txtHNHT_SoLuongNguoiBaoCao"),
            'strNamBaoCao': edu.util.getValById("txtHNHT_NamBaoCao"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropHNHT_LinhVuc_Nganh"),
            'strPhamViHoiNghiHoiThao_Id': edu.util.getValById("dropHNHT_PhamVi"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strVaitro_Id': "",
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropHNHT_DeTai"),
            'strNamHoanThanh': edu.util.getValById("txtHNHT_NamHoanThanh"),
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtHNHT_NoiDungMinhChung"),
            'strMaSanPham': edu.util.getValById("txtHNHT_MaSanPham"),
            'strChiSo_ISBN': edu.util.getValById("txtHNHT_ISBN"),
            'strMucTieu': edu.util.getValById("txtHNHT_MucTieu"),
            'strNoiDung': edu.util.getValById("txtHNHT_NoiDung"),
            'dSoLuongBaoCao': edu.util.getValById("txtHNHT_SoLuongBaoCao"),
            'dSoLuongNguoiBaoCao': edu.util.getValById("txtHNHT_SoLuongNguoiBaoCao"),
            'strThanhPhanThamGia': edu.util.getValById("txtHNHT_ThanhPhanThamGia"),
            'iTrangThai': 1,
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strHoiNghiHT_Id = me.strHoiNghiHT_Id
                    $("#tblInput_HNHT_KinhPhi tbody tr").each(function () {
                        var strNewKinhPhi_Id = this.id;
                        if (strNewKinhPhi_Id.length == 30) {//id.length 30 là trường hợp id tự tạo dành cho thêm mới
                            me.save_KinhPhi(strNewKinhPhi_Id, strHoiNghiHT_Id);
                        }
                    });
                    $("#tblInput_HNHT_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_HNHT_ThanhVien(strNhanSu_Id, strHoiNghiHT_Id);
                    });
                    edu.system.saveFiles("txtHNHT_FileDinhKem", strHoiNghiHT_Id, "NCKH_Files");
                    me.getList_HNHT();
                }
                else {
                    edu.system.alert("NCKH_HoiNghiHoiThao/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiNghiHoiThao/CapNhat  (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HNHT: function (strId) {
        var me = this;

        var obj_delete = {
            'action': 'NCKH_HoiNghiHoiThao/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_HNHT();
                }
                else {
                    obj = {
                        content: "NCKH_HoiNghiHoiThao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_HoiNghiHoiThao/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML HoiNghiHoiThao
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HNHT: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblHNHT_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHNHT", aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiNghiHoiThao.getList_HNHT()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENHOINGHIHOITHAO) + "</span><br />";
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
    /*------------------------------------------
    --Discription: [1] AcessDB Update_HNHT
    -------------------------------------------*/
    viewEdit_HNHT: function (data) {
        var me = this;
        var dtHNHT = data[0]; console.log(dtHNHT)
        //View - Thong tin
        edu.util.viewValById("txtHNHT_TenHoiNghiHoiThao", dtHNHT.TENHOINGHIHOITHAO);
        edu.util.viewValById("txtHNHT_TenBaoCao", dtHNHT.TENBAOCAO);
        edu.util.viewValById("txtHNHT_MucTieu", dtHNHT.MUCTIEU);
        edu.util.viewValById("txtHNHT_NoiDung", dtHNHT.NOIDUNG);
        edu.util.viewValById("txtHNHT_NamHoanThanh", dtHNHT.NAMHOANTHANH);
        edu.util.viewValById("txtHNHT_NamBaoCao", dtHNHT.NAMBAOCAO);
        edu.util.viewValById("dropHNHT_PhamVi", dtHNHT.PHAMVIHOINGHIHOITHAO_ID);
        edu.util.viewValById("txtHNHT_MaSanPham", dtHNHT.MASANPHAM);
        edu.util.viewValById("txtHNHT_ISBN", dtHNHT.CHISO_ISBN);
        edu.util.viewValById("dropHNHT_LinhVuc_Nganh", dtHNHT.THUOCLINHVUCNAO_ID);
        edu.util.viewValById("dropHNHT_DonViToChuc", dtHNHT.DONVITOCHUC_ID);
        edu.util.viewValById("txtHNHT_SoDaiBieuTrongNuoc", dtHNHT.SODAIBIEUTRONGNUOC);
        edu.util.viewValById("txtHNHT_SoDaiBieuQuocTe", dtHNHT.SODAIBIEUQUOCTE);
        edu.util.viewValById("txtHNHT_SoDaiBieuTrongNuoc", dtHNHT.SODAIBIEUTRONGNUOC);
        edu.util.viewValById("txtHNHT_SoLuongBaoCao", dtHNHT.SOLUONGBAOCAO);
        edu.util.viewValById("txtHNHT_SoLuongNguoiBaoCao", dtHNHT.SOLUONGNGUOIBAOCAO);
        edu.util.viewValById("txtHNHT_ThanhPhanThamGia", dtHNHT.THANHPHANTHAMGIA);
        edu.util.viewValById("dropHNHT_DeTai", dtHNHT.NCKH_QUANLYDETAI_ID);
        edu.util.viewValById("txtHNHT_DiaDiem", dtHNHT.DIADIEM);
        edu.util.viewValById("txtHNHT_ThoiGianToChuc", dtHNHT.THOIGIANTOCHUC);
        edu.util.viewValById("txtHNHT_NoiDungMinhChung", dtHNHT.THONGTINMINHCHUNG);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_HNHT_ThanhVien: function (strNhanSu_Id, strHoiNghiHT_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;

        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strHoiNghiHT_Id,
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
    getList_HNHT_ThanhVien: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',            

            'strSanPham_Id': me.strHoiNghiHT_Id,
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
                    me.genTable_HNHT_ThanhVien(dtResult);
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
    delete_HNHT_ThanhVien: function (strNhanSu_Id) {
        var me = this;

        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strHoiNghiHT_Id,
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
                    me.getList_HNHT_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_HNHT_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_HNHT_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_HNHT_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_HNHT_ThanhVien tbody").html("");
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
            $("#tblInput_HNHT_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
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
        $("#tblInput_HNHT_ThanhVien tbody").append(html);
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
            $("#tblInput_HNHT_ThanhVien tbody").html("");
            $("#tblInput_HNHT_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.HoiNghiHoiThao;
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
                code: "MA"
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
    save_KinhPhi: function (strIds, strHoiNghiHT_Id) {
        var me = this;
        var strNguon_Id = $("#tblInput_HNHT_KinhPhi #" + strIds + " #lblDeTai_KinhPhi_Nguon").attr("name");
        var strSoTien = $("#tblInput_HNHT_KinhPhi #" + strIds + " #lblDeTai_KinhPhi_SoTien").html();
        var strDonVi_Id = $("#tblInput_HNHT_KinhPhi #" + strIds + " #lblDeTai_KinhPhi_DonViTienTe").attr("name");
        var obj_save = {
            'action': 'NCKH_SP_NguonKinhPhi/ThemMoi',
            
            'strIds': "",
            'strSanPham_Id': strHoiNghiHT_Id,
            'strNguonKinhPhi_Id': strNguon_Id,
            'strDonViTinh_Id': strDonVi_Id,
            'dSoTien': strSoTien.replace(/,/g, ''),
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
    getList_KinhPhi: function () {
        var me = this;

        var obj_list = {
            'action': 'NCKH_SP_NguonKinhPhi/LayDanhSach',            

            'strSanPham_Id': me.strHoiNghiHT_Id,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_HNHT_KinhPhi tbody").html("");
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
    delete_KinhPhi: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'NCKH_SP_NguonKinhPhi/Xoa',
            
            'strIds': strIds,
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
        $("#tblInput_HNHT_KinhPhi tbody").append(row);
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
            'strTuKhoaText': "",
            'dTuKhoaNumber': -1,
            'strNCKH_DeCuong_Id': "",
            'strCapQuanLy_Id': "",
            'strLinhVucNghienCuu_Id': "",
            'strNguonKinhPhi_Id': "",
            'strThietKeNghienCuu_Id': "",
            'strNCKH_ThanhVien_Id': "",
            'strDonVi_Id_CuaThanhVien_Id': "",
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strTinhTrang_Id': "",
            'strPhanLoaiDeTai_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': "",
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
                        iPager = data.Pager;
                    }
                    me.genCombo_DeTai(dtResult, iPager);
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
    genCombo_DeTai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDETAITIENGVIET",
                code: "MADETAI",
                order: "unorder"
            },
            renderPlace: ["dropHNHT_DeTai", "dropSearch_DeTai_HNHT"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.HoiNghiHoiThao;
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
            renderPlace: ["dropSearchModal_TTS_DonVi", "dropSearch_DonViThanhVien_HNHT"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HS: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_HNHT"),
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
            renderPlace: ["dropSearch_ThanhVienDangKy_HNHT"],
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
};