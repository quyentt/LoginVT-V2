/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function TapChiQuocGia() { }
TapChiQuocGia.prototype = {
    dtTapChiDG: [],
    dtTapChiDG_Full: [],
    strTapChiQuocGia_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrISSN: [],
    bcheckTimKiem: false,
    arrValid_TCQG: [],
    dtDanhMucTC: [],

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
            if (me.checkChange("zone_input_tcqg")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_TCQG").trigger("click");
                });
            }
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_TCQG();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TCQG();
            }
        });
        $(".btnSearchTCQG_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnSearchTCQG_NhanSu_NgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocGia
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_TCQG").click(function () {
            me.getList_TCQG();
        });
        $("#btnSave_TCQG").click(function () {
            if (true) {
                if (edu.util.checkValue(me.strTapChiQuocGia_Id)) {
                    me.update_TCQG();
                }
                else {
                    me.save_TCQG();
                }
            }
        });
        $("#tblTCQG").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strTapChiQuocGia_Id = strId;
                me.getDetail_TCQG(strId);
                me.getList_TCQG_ThanhVien();
                edu.system.viewFiles("txtTCQG_FileDinhKem", strId, "NCKH_Files");
                edu.util.setOne_BgRow(strId, "tblTCQG");
                edu.system.getList_RangBuoc("NCKH_SP_TAPCHIQUOCGIA", strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTCQG").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TCQG(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_TCQG_ThanhVien_TrongTruong,#tblInput_TCQG_ThanhVien_NgoaiTruong").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TCQG_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [4] Action TCQG_ThanhVien_NgoaiTruong
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect_NgoaiTruong', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
        });
       
        $(".btnSearchTCQG_BaiBao").click(function () {
            $("#modal_TimBaiBao").modal("show");
            me.getList_TCQG_Full();
            setTimeout(function () {
                $("#txtSearchModal_TCQG_TuKhoa").focus();
            }, 500);
        });
        $("#btnSearch_Modal_TCQG").click(function () {
            me.getList_TCQG_Full();
        });
        $("#txtSearchModal_TCQG_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TCQG_Full();
            }
        });
        $("#modal_TimBaiBao").delegate(".btnChonTCQG", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                $("#modal_TimBaiBao").hide();
                me.rewrite();
                me.toggle_form();
                me.getDetail_TCQG_Full(strId);
                me.bcheckTimKiem = true;
                edu.system.viewFiles("txtTCQG_FileDinhKem", strId, "NCKH_Files");
                edu.extend.getDetail_HS(me.genHTML_NhanSu);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [4] Action TCQG_ThanhVien_NgoaiTruong
        --Order: 
        -------------------------------------------*/
        $("#dropTCQG_DanhMuc").on("select2:select", function () {
            var obj = edu.util.objGetOneDataInData($("#dropTCQG_DanhMuc").val(), me.dtDanhMucTC, "ID");
            if (obj.MATAPCHIDANG == "ZLOAIKHAC") {
                $("#txtTCQG_TenTapChi").val("");
                $("#txtTCQG_ISSN").val("");
                $("#txtTCQG_HeSo").val("");
                $("#txtTCQG_Ma").val("");
                $("#txtTCQG_ISSN").prop("readonly", false);
                $("#txtTCQG_HeSo").prop("readonly", false);
                $("#dropTCQG_DanhMuc").parent().after('<div class="clear showclear"></div>');
            } else {
                $("#txtTCQG_TenTapChi").val(obj.TENTAPCHIDANG);
                $("#txtTCQG_ISSN").val(obj.CHISO_ISSN);
                $("#txtTCQG_HeSo").val(edu.util.returnEmpty(obj.DIEM));
                $("#txtTCQG_Ma").val(edu.util.returnEmpty(obj.MATAPCHIDANG));
                $("#txtTCQG_ISSN").prop("readonly", true);
                $("#txtTCQG_HeSo").prop("readonly", true);
            }
        });
        $("#dropSearch_NamDanhGia_DT").on("select2:select", function () {
            me.rewrite();
            me.getList_TCQG();
        });
        edu.system.switchLoaiKhac("dropTCQG_DanhMuc", "txtTCQG_TenTapChi", false);
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.getList_DMTapChiQuocGia();
        me.toggle_form();
        edu.system.uploadFiles(["txtTCQG_FileDinhKem"]);
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTQG,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        //me.getList_TCQG();
        me.getList_DeTai();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LBAO", "dropTCQG_LoaiBaiBao");
        setTimeout(function () {
            edu.system.getList_DLDM_Cache("VALID.NCKH.TCQG");
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LVNC, "dropTCQG_LinhVuc,dropSearchModal_TCQG_LinhVuc");
                $("#dropSearch_LinhVuc").val("").trigger("change");
            }, 50);
        }, 50);
        me.getList_CoCauToChuc();
        me.arrValid_TCQG = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTCQG_Ten", "THONGTIN1": "EM" },
            { "MA": "txtTCQG_SoTacGia", "THONGTIN1": "EM" },
            { "MA": "txtTCQG_NamCongBo", "THONGTIN1": "EM" },
            { "MA": "txtTCQG_ThangCongBo", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_tcqg");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_tcqg");
        setTimeout(function () {
            me.setCheckChange("zone_input_tcqg");
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
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_tcqg");
    },
    rewrite: function () {
        //reset id
        var me = this;
        $("#myModalLabel_TCQG").html('.. <i class="fa fa-pencil"></i> Kê khai bài báo trong nước');
        me.strTapChiQuocGia_Id = "";
        me.arrNhanSu_Id = [];
        me.bcheckTimKiem = false;
        var arrId = ["txtTCQG_Ten", "txtTCQG_TenTapChi", "dropTCQG_DMTapChi", "txtTCQG_Ma", "dropTCQG_LinhVuc", "txtTCQG_NgayCongBo", "txtTCQG_Tap", "txtTCQG_So", "txtTCQG_Trang", "txtTCQG_TrichDanPubmed", "txtTCQG_NoiDungMinhChung", "txtTCQG_SoTacGia",
            "dropTCQG_DeTai", "txtTCQG_ISSN", "txtTCQG_HeSo", "txtTCQG_ThangCongBo", "txtTCQG_NamCongBo", "txtTCQG_TrangTapChi", "dropTCQG_LoaiBaiBao", "txtTCQG_NamHoanThanh", "txtTCQG_SoTacGiaTrongTruong", "dropTCQG_DanhMuc"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtTCQG_FileDinhKem", "");
        edu.util.viewValById("txtTCQG_NgoaiTruongKhac", "");
        $("#tblInput_TCQG_ThanhVien_TrongTruong tbody").html("");
        $("#tblInput_TCQG_ThanhVien_NgoaiTruong tbody").html("");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocGia
    -------------------------------------------*/
    getList_TCQG: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TapChiQuocGia/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': "",
            'strPhanLoaiTapChi_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaitro_Id': "",
            'strDonViCuaThanhVien_Id': "",
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strNCKH_SP_DMTapChiQG_Id': edu.util.getValById("dropSearch_DanhMucTCQG"),
            'strLoaiBao_Id': '',
            'strTinhTrangXacNhan_Id': "",
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
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
                        me.dtTapChiDG = dtResult;
                    }
                    me.genTable_TCQG(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TCQG_Full: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TapChiQuocGia/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearchModal_TCQG_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearchModal_TCQG_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': "",
            'strPhanLoaiTapChi_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': '',
            'strVaitro_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearchModal_TCQG_DonVi"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strNCKH_SP_DMTapChiQG_Id': '',
            'strLoaiBao_Id': '',
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
                        me.dtTapChiDG_Full = dtResult;
                    }
                    me.genTable_TCQG_Full(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_TCQG: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_TapChiQuocGia/ThemMoi',            

            'strId': "",
            'strTyLeThamGia': "",
            'strNCKH_SP_DMTapChiQG_Id': edu.util.getValById("dropTCQG_DanhMuc"),
            'strTenBaiBao': edu.util.getValById("txtTCQG_Ten"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTCQG_LinhVuc"),
            'strNCKH_QUANLYDETAI_ID': edu.util.getValById("dropTCQG_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': edu.util.getValById("tblInput_TCQG_ThanhVien_TrongTruong"),
            'strVaitro_Id': "",
            'strNamCongBo': edu.util.getValById("txtTCQG_NamCongBo"),
            'strTenTapChi': edu.util.getValById("txtTCQG_TenTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtTCQG_ISSN"),
            'dDiem_ISSN': edu.util.getValById("txtTCQG_HeSo"),
            'strThangCongBo': edu.util.getValById("txtTCQG_ThangCongBo"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtTCQG_SoTacGiaTrongTruong"),
            'dSoTacGia_n': edu.util.getValById("txtTCQG_SoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtTCQG_NamHoanThanh"),
            'strPhanLoaiTapChi_Id': "",
            'strThongTinMinhChung': edu.util.getValById("txtTCQG_NoiDungMinhChung"),
            'iTrangThai': 1,
            "strCanBoNhap_Id": edu.system.userId,
            'iThuTu': 1,
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtTCQG_TrichDanPubmed"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'strTapCuaTapChi': edu.util.getValById("txtTCQG_Tap"),
            'strSoTapChi': edu.util.getValById("txtTCQG_So"),
            'strTrangTapChi': edu.util.getValById("txtTCQG_TrangTapChi"),
            'strMaSanPham': edu.util.getValById("txtTCQG_Ma"),
            'strLoaiBao_Id': edu.util.getValById('dropTCQG_LoaiBaiBao'),
            'strDanhSachCacThanhVienNgoai': edu.util.getValById("txtTCQG_NgoaiTruongKhac"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dHeSoIF_n': ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTapChiQuocGia_Id = data.Id;
                    $("#tblInput_TCQG_ThanhVien_TrongTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQG_ThanhVien(strNhanSu_Id, strTapChiQuocGia_Id);
                    });
                    $("#tblInput_TCQG_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQG_ThanhVien(strNhanSu_Id, strTapChiQuocGia_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtTCQG_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtTCQG_FileDinhKem");
                        }
                    }
                    edu.system.saveFiles("txtTCQG_FileDinhKem", strTapChiQuocGia_Id, "NCKH_Files");
                    edu.system.alert('Tiến trình thực hiện thành công!');
                    setTimeout(function () {
                        me.getList_TCQG();
                    }, 3050);
                    me.setCheckChange("zone_input_tcqg");
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocGia/ThemMoi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_TCQG: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_TapChiQuocGia/CapNhat',            

            'strId': me.strTapChiQuocGia_Id,
            'strTyLeThamGia': "",
            'strTenBaiBao': edu.util.getValById("txtTCQG_Ten"),
            'strNCKH_SP_DMTapChiQG_Id': edu.util.getValById("dropTCQG_DanhMuc"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTCQG_LinhVuc"),
            'strNCKH_QUANLYDETAI_ID': edu.util.getValById("dropTCQG_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': edu.util.getValById("tblInput_TCQG_ThanhVien_TrongTruong"),
            'strVaitro_Id': "",
            'strNamCongBo': edu.util.getValById("txtTCQG_NamCongBo"),
            'strTenTapChi': edu.util.getValById("txtTCQG_TenTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtTCQG_ISSN"),
            'dDiem_ISSN': edu.util.getValById("txtTCQG_HeSo"),
            'strThangCongBo': edu.util.getValById("txtTCQG_ThangCongBo"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtTCQG_SoTacGiaTrongTruong"),
            'dSoTacGia_n': edu.util.getValById("txtTCQG_SoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtTCQG_NamHoanThanh"),
            'strPhanLoaiTapChi_Id': "",
            'strThongTinMinhChung': edu.util.getValById("txtTCQG_NoiDungMinhChung"),
            'iTrangThai': 1,
            "strCanBoNhap_Id": edu.system.userId,
            'iThuTu': 1,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtTCQG_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtTCQG_Tap"),
            'strSoTapChi': edu.util.getValById("txtTCQG_So"),
            'strTrangTapChi': edu.util.getValById("txtTCQG_TrangTapChi"),
            'strDanhSachCacThanhVienNgoai': edu.util.getValById("txtTCQG_NgoaiTruongKhac"),
            'strMaSanPham': edu.util.getValById("txtTCQG_Ma"),
            'strLoaiBao_Id': edu.util.getValById('dropTCQG_LoaiBaiBao'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dHeSoIF_n': ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    var strTapChiQuocGia_Id = me.strTapChiQuocGia_Id;
                    $("#tblInput_TCQG_ThanhVien_TrongTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQG_ThanhVien(strNhanSu_Id, strTapChiQuocGia_Id);
                    });
                    $("#tblInput_TCQG_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQG_ThanhVien(strNhanSu_Id, strTapChiQuocGia_Id);
                    });
                    edu.system.saveFiles("txtTCQG_FileDinhKem", strTapChiQuocGia_Id, "NCKH_Files");
                    setTimeout(function () {
                        me.getList_TCQG();
                    }, 3050);
                    me.setCheckChange("zone_input_tcqg");
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocGia/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocGia/CapNhat (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TCQG: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_TapChiQuocGia/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_TCQG();
                }
                else {
                    obj = {
                        content: "NCKH_TapChiQuocGia/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_TapChiQuocGia/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML TapChiQuocGia
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TCQG: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblaiBaoTN_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblTCQG",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TapChiQuocGia.getList_TCQG()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENBAIBAO) + "</span><br />";
                        if (edu.util.checkValue(aData.KETQUAXACNHAN_TEN)) {
                            html += '<span class="pull-right lbTinhTrang" style="' + aData.KETQUAXACNHAN_THONGTIN2 + '" title="' + aData.KETQUAXACNHAN_NOIDUNG + '">';
                            html += aData.KETQUAXACNHAN_TEN;
                            html += '</span>';
                        }
                        if (aData.HOANTHANHNHAPDULIEU == 0) {
                            html += '<span class="pull-right lbTinhTrang" style="color: orange" title="' + aData.HOANTHANHNHAPDULIEU_LYDO + '">';
                            html += "Chưa hoàn thành";
                            html += '</span>';
                        } else {
                            if (aData.HOANTHANHNHAPDULIEU == 1) {
                                html += '<span class="pull-right lbTinhTrang" style="color: green">';
                                html += "Hoàn thành";
                                html += '</span>';
                            }
                        }
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };    
        edu.system.loadToTable_data(jsonForm);
        if (me.strTapChiQuocGia_Id != '') {
            $("#" + jsonForm.strTable_Id + ' tr[id="' + me.strTapChiQuocGia_Id + '"]').trigger("click");
        }
        /*III. Callback*/
    },
    genTable_TCQG_Full: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblModal_TCQG",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TapChiQuocGia.getList_TCQG_Full()",
                iDataRow: iPager
            },
            aoColumns: [
            {
                "mDataProp": "TENBAIBAO"
            },
            {
                "mDataProp": "TENTAPCHI"
                },
                {
                    "mDataProp": "THUOCLINHVUCNAO"
                },
                {
                    "mDataProp": "DSTHANHVIEN_VAITRO"
                }
                , {
                "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btnChonTCQG" data-dismiss="modal" id="' + aData.ID + '">Chọn bài báo</span>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_TCQG: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtTapChiDG, "ID", me.viewEdit_TCQG);
    },
    getDetail_TCQG_Full: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtTapChiDG_Full, "ID", me.viewEdit_TCQG);
    },
    viewEdit_TCQG: function (data) {
        var me = this;
        var dtTapChiDG = data[0];
        //View - Thong tin
        edu.util.viewValById("dropTCQG_DanhMuc", dtTapChiDG.NCKH_SP_DANHMUCTAPCHIQG_ID);
        $('#dropTCQG_DanhMuc').trigger({ type: 'select2:select' });
        edu.util.viewValById("txtTCQG_Ten", dtTapChiDG.TENBAIBAO);
        edu.util.viewValById("txtTCQG_TenTapChi", dtTapChiDG.TENTAPCHI);
        edu.util.viewValById("dropTCQG_DeTai", dtTapChiDG.NCKH_QUANLYDETAI_ID);
        edu.util.viewValById("dropTCQG_LinhVuc", dtTapChiDG.THUOCLINHVUCNAO_ID);
        edu.util.viewValById("txtTCQG_ISSN", dtTapChiDG.CHISO_ISSN);
        edu.util.viewValById("txtTCQG_HeSo", dtTapChiDG.DIEM_ISSN);
        edu.util.viewValById("txtTCQG_Ma", dtTapChiDG.MASANPHAM);
        edu.util.viewValById("txtTCQG_ThangCongBo", dtTapChiDG.THANGCONGBO);
        edu.util.viewValById("txtTCQG_NamCongBo", dtTapChiDG.NAMCONGBO);
        edu.util.viewValById("txtTCQG_SoTacGia", dtTapChiDG.SOTACGIA_N);
        edu.util.viewValById("txtTCQG_SoTacGiaTrongTruong", dtTapChiDG.SOTACGIATRONGTRUONG_N);
        edu.util.viewValById("txtTCQG_Tap", dtTapChiDG.TAPCUATAPCHI);
        edu.util.viewValById("txtTCQG_So", dtTapChiDG.SOTAPCHI);
        edu.util.viewValById("txtTCQG_TrangTapChi", dtTapChiDG.TRANGTAPCHI);
        edu.util.viewValById("txtTCQG_TrichDanPubmed", dtTapChiDG.TENBAIBAOTRICHDAN_PUBMED);
        edu.util.viewValById("dropTCQG_LoaiBaiBao", dtTapChiDG.LOAIBAO_ID);
        edu.util.viewValById("txtTCQG_NamHoanThanh", dtTapChiDG.NAMHOANTHANH);
        edu.util.viewValById("txtTCQG_NgoaiTruongKhac", dtTapChiDG.DANHSACHCACTHANHVIENNGOAI);
        edu.util.viewValById("txtTCQG_NoiDungMinhChung", dtTapChiDG.THONGTINMINHCHUNG);
        $("#myModalLabel_TCQG").html('<i class="fa fa-edit"></i> Chỉnh sửa bài báo trong nước');
    },
    //
    /*------------------------------------------
    --Discription: [2] AccessDB TCQG_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_TCQG_ThanhVien: function (strNhanSu_Id, strTapChiQuocGia_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strTapChiQuocGia_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));                
            },
            type: 'POST',
            async: false,
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TCQG_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',            

            'strSanPham_Id': me.strTapChiQuocGia_Id,
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
                    me.genTable_TCQG_ThanhVien(dtResult);
                    me.genTable_TCQG_ThanhVien_NgoaiTruong(dtResult);
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
    delete_TCQG_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strTapChiQuocGia_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_TCQG_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_TCQG_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_TCQG_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_TCQG_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_TCQG_ThanhVien_TrongTruong tbody").html("");
        for (var i = 0; i < data.length; i++) {
            me.arrNhanSu_Id.push(data[i].ID);
            if (data[i].LATHANHVIENCUATRUONG == 1) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TCQG_ThanhVien_TrongTruong tbody").append(html);
            //5. create data danhmucvaitro
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.TapChiQuocGia;
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
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_TCQG_ThanhVien_TrongTruong tbody").append(html);
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
            $("#tblInput_TCQG_ThanhVien_TrongTruong tbody").html("");
            $("#tblInput_TCQG_ThanhVien_TrongTruong tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TCQG_ThanhVien_NgoaiTruong: function (data) {
        var me = this;
        //3. create html
        $("#tblInput_TCQG_ThanhVien_NgoaiTruong tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            console.log(data[i]);
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TCQG_ThanhVien_NgoaiTruong tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu_NgoaiTruong: function (strNhanSu_Id) {
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
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + edu.util.getHTMLById("sl_hoten" + strNhanSu_Id) + "</span></td>";
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_TCQG_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.TapChiQuocGia;
        me.dtVaiTro = data;
        me.rewrite();
    },
    genCombo_VaiTro: function (place, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + place).select2();
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
            'strThanhVien_Id': edu.system.userId,
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
            renderPlace: ["dropTCQG_DeTai"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.TapChiQuocGia;
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
            renderPlace: ["dropSearchModal_TCQG_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
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
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }                
            },
            error: function (er) {                
                edu.system.alert(obj_list.action + " " + JSON.stringify(er), "w");
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
        var me = this;
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

        if (data.length > 0) {
            edu.util.viewValById("dropSearch_NamDanhGia_DT", data[0].ID);
        }
        me.getList_TCQG();
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    getList_DMTapChiQuocGia: function (data, iPager) {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DMTapChiQuocGia/LayDanhSach',            

            'strTuKhoa': "",
            'strTenTapChiDang_Id': "",
            'strLoaiTapChi_Id': "",
            'strCoQuanXuatBan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtDanhMucTC = dtResult;
                    me.genCombo_DMTapChiQuocGia(dtResult);
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
    genCombo_DMTapChiQuocGia: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENTAPCHIDANG",
                code: "MATAPCHIDANG"
            },
            renderPlace: ["dropTCQG_DanhMuc"],
            title: "Chọn danh mục tạp chí"
        };
        edu.system.loadToCombo_data(obj);
    },
};
