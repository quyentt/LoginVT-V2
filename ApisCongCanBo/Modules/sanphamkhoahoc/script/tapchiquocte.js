/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function TapChiQuocTe() { }
TapChiQuocTe.prototype = {
    dtTapChiQT: [],
    dtTapChiQT_Full: [],
    strTapChiQuocTe_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    bcheckTimKiem: false,
    arrValid_TCQT: [],
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
            if (me.checkChange("zone_input_tcqt")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_TCQT").trigger("click");
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
            me.getList_TCQT();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TCQT();
            }
        });
        $("#btnSearchTCQT_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocTe
        --Order: 
        -------------------------------------------*/
        $("#btnSave_TCQT").click(function () {
            if (true) {
                if (edu.util.checkValue(me.strTapChiQuocTe_Id)) {
                    me.update_TCQT();
                }
                else {
                    me.save_TCQT();
                }
            }
        });
        $("#tblTCQT").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strTapChiQuocTe_Id = strId;
                me.getDetail_TCQT(strId);
                me.getList_TCQT_ThanhVien();
                edu.system.viewFiles("txtTCQT_FileDinhKem", strId, "NCKH_Files");
                edu.util.setOne_BgRow(strId, "tblTCQT");
                edu.system.getList_RangBuoc("NCKH_SP_TAPCHIQUOCTE", strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTCQT").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TCQT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearchTCQT_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnSearchTCQT_NhanSu_NgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_TCQT_ThanhVien,#tblInput_TCQT_ThanhVien_NgoaiTruong").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TCQT_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [4] Action TCQT_ThanhVien_NgoaiTruong
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect_NgoaiTruong', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
        });

        $(".btnSearchTCQT_BaiBao").click(function () {
            $("#modal_TimBaiBao").modal("show");
            me.getList_TCQT_Full();
            setTimeout(function () {
                $("#txtSearchModal_TCQT_TuKhoa").focus();
            }, 500);
        });
        $("#btnSearch_Modal_TCQT").click(function () {
            me.getList_TCQT_Full();
        });
        $("#txtSearchModal_TCQT_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TCQT_Full();
            }
        });
        $("#modal_TimBaiBao").delegate(".btnChonTCQT", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.bcheckTimKiem = true;
                me.getDetail_TCQT_Full(strId);
                edu.system.viewFiles("txtTCQT_FileDinhKem", strId, "NCKH_Files");
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
        $("#dropTCQT_DanhMuc").on("select2:select", function () {
            var obj = edu.util.objGetOneDataInData($("#dropTCQT_DanhMuc").val(), me.dtDanhMucTC, "ID");
            if (obj.MATAPCHIDANG == "ZLOAIKHAC") {
                $("#txtTCQT_TenTapChi").val("");
                $("#txtTCQT_ISSN").val("");
                $("#txtTCQT_HeSo").val("");
                $("#txtTCQT_Ma").val("");
                $("#txtTCQT_ISSN").prop("readonly", false);
                $("#txtTCQT_HeSo").prop("readonly", false);
                $("#txtTCQT_HeSoIF").prop("readonly", false);
                $("#dropTCQT_DanhMuc").parent().after('<div class="clear showclear"></div>');
            } else {
                $("#txtTCQT_TenTapChi").val(obj.TENTAPCHIDANG);
                $("#txtTCQT_ISSN").val(obj.CHISO_ISSN);
                $("#txtTCQT_Ma").val(edu.util.returnEmpty(obj.MATAPCHIDANG));
                $("#txtTCQT_HeSoIF").val(edu.util.returnEmpty(obj.DIEM));
                $("#txtTCQT_ISSN").prop("readonly", true);
                $("#txtTCQT_HeSo").prop("readonly", true);
                $("#txtTCQT_ISSN").prop("readonly", true);
            }
        });
        $("#dropSearch_NamDanhGia_DT").on("select2:select", function () {
            me.rewrite();
            me.getList_TCQT();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_DeTai();
        edu.util.toggle("box-sub-search");
        me.getList_DMTapChiQuocTe();
        me.toggle_form();
        edu.system.uploadFiles(["txtTCQT_FileDinhKem"]);
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTQT,
            strTenCotSapXep: "",
            dTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LBAO", "dropTCQT_LoaiBaiBao", "", "");
        setTimeout(function () {
            var obj = {
                strMaBangDanhMuc: constant.setting.CATOR.NCKH.LVNC,
                strTenCotSapXep: "",
                dTrangThai: 1
            };
            edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_LinhVucNghienCuu);
            setTimeout(function () {
                
                setTimeout(function () {
                    edu.system.getList_DLDM_Cache("VALID.NCKH.TCQT");
                }, 50);
            }, 50);
        }, 50);
        me.getList_CoCauToChuc();
        me.arrValid_TCQT = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTCQT_Ten", "THONGTIN1": "EM" },
            { "MA": "txtTCQT_TenTapChi", "THONGTIN1": "EM" },
            { "MA": "txtTCQT_TongSoTacGia", "THONGTIN1": "EM" },
            { "MA": "txtTCQT_ThangCongBo", "THONGTIN1": "EM" },
            { "MA": "txtTCQT_NamCongBo", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
        edu.system.switchLoaiKhac("dropTCQT_DanhMuc", "txtTCQT_TenTapChi", false);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_tcqt");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_tcqt");
        setTimeout(function () {
            me.setCheckChange("zone_input_tcqt");
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
        edu.util.toggle_overide("zone-bus", "zone_notify_tcqt");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.bcheckTimKiem = false;
        me.strTapChiQuocTe_Id = "";
        me.arrNhanSu_Id = [];
        $("#myModalLabel_TCQT").html('.. <i class="fa fa-pencil"></i> Kê khai bài báo quốc tế');
        var arrId = ["txtTCQT_Ten", "txtTCQT_TenTapChi", "txtTCQT_Ma", "dropTCQT_LinhVuc", "txtTCQT_NamCongBo", "txtTCQT_HeSoIF", "txtTCQT_Tap",
            "txtTCQT_So", "txtTCQT_Trang", "txtTCQT_TrichDanPubmed", "txtTCQT_NoiDungMinhChung", "dropTCQT_DeTai", "dropTCQT_LoaiBaiBao",
            "txtTCQT_ISSN", "txtTCQT_TongSoTacGia", "txtTCQT_SoTacGiaTrongTruong", "txtTCQT_ThangCongBo", "dropDM_ISI", "txtTCQT_NamHoanThanh", "txtTCQT_SoDOI"];
        edu.util.resetValByArrId(arrId);
        //table
        //reset file
        edu.system.viewFiles("txtTCQT_FileDinhKem", "");
        edu.util.viewValById("txtTCQT_NgoaiTruongKhac", "");
        $("#tblInput_TCQT_ThanhVien tbody").html("");
        $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").html("");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocTe
    -------------------------------------------*/
    getList_TCQT: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TapChiQuocTe/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'dTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': "",
            'strPhanLoaiTapChi_Id': edu.util.getValById("dropSearch_PhanLoai"),
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strDonViCuaThanhVien_Id': "",
            'strNCKH_SP_DMTapChiQT_Id': "",
            'strVaitro_Id': "",
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
                        me.dtTapChiQT = dtResult;
                    }
                    me.genTable_TCQT(dtResult, iPager);                    
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TCQT_Full: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TapChiQuocTe/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearchModal_TCQT_TuKhoa"),
            'dTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearchModal_TCQT_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': "",
            'strPhanLoaiTapChi_Id': '',
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearchModal_TCQT_DonVi"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strNCKH_SP_DMTapChiQT_Id': "",
            'strVaitro_Id': "",
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
                        me.dtTapChiQT_Full = dtResult;
                    }
                    me.genTable_TCQT_Full(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_TCQT: function () {
        var me = this;
        var dHeSoIF = edu.util.getValById("txtTCQT_HeSoIF");
        if (dHeSoIF.indexOf(',') != -1 && dHeSoIF.indexOf('.') == -1) {
            dHeSoIF = dHeSoIF.replace(/,/g, '.');
        }
        var obj_save = {
            'action': 'NCKH_TapChiQuocTe/ThemMoi',           

            'strId': "",
            'dTyLeThamGia': "",
            'strTenTacGia': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_SP_DMTapChiQT_Id': edu.util.getValById("dropTCQT_DanhMuc"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTCQT_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropTCQT_DeTai"),
            'strNamCongBo': edu.util.getValById("txtTCQT_NamCongBo"),
            'strTenTapChi': edu.util.getValById("txtTCQT_TenTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtTCQT_ISSN"),
            'strThangCongBo': edu.util.getValById("txtTCQT_ThangCongBo"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtTCQT_SoTacGiaTrongTruong"),
            'dTrongDanhMucISI_Scopus': edu.util.getValById("dropDM_ISI"),
            'strLoaiBao_Id': edu.util.getValById("dropTCQT_LoaiBaiBao"),
            'strDOI': edu.util.getValById("txtTCQT_SoDOI"),
            'dHeSoIF_n': dHeSoIF,
            'dSoTacGia_n': edu.util.getValById("txtTCQT_TongSoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtTCQT_NamHoanThanh"),
            'strTenBaiBao': edu.util.getValById("txtTCQT_Ten"),
            'strThongTinMinhChung': edu.util.getValById("txtTCQT_NoiDungMinhChung"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': "",
            'strVaitro_Id': "",
            'dTrangThai': 1,
            'dThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtTCQT_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtTCQT_Tap"),
            'strSoTapChi': edu.util.getValById("txtTCQT_So"),
            'strTrangTapChi': edu.util.getValById("txtTCQT_Trang"),
            'strDanhSachCacThanhVienNgoai': edu.util.getValById("txtTCQT_NgoaiTruongKhac"),
            'strMaSanPham': edu.util.getValById("txtTCQT_Ma")
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strTapChiQuocTe_Id = data.Id;
                    $("#tblInput_TCQT_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQT_ThanhVien(strNhanSu_Id, strTapChiQuocTe_Id);
                    });
                    $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQT_ThanhVien(strNhanSu_Id, strTapChiQuocTe_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtTCQT_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtTCQT_FileDinhKem");
                        }
                    }
                    edu.system.saveFiles("txtTCQT_FileDinhKem", strTapChiQuocTe_Id, "NCKH_Files");
                    edu.system.alert('Tiến trình thực hiện thành công!');
                    setTimeout(function () {
                        me.getList_TCQT();
                    }, 3050);
                    me.setCheckChange("zone_input_tcqt");
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe/ThemMoi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_TCQT: function () {
        var me = this;
        var dHeSoIF = edu.util.getValById("txtTCQT_HeSoIF");
        if (dHeSoIF.indexOf(',') != -1 && dHeSoIF.indexOf('.') == -1) {
            dHeSoIF = dHeSoIF.replace(/,/g, '.');
        }
        var obj_save = {
            'action': 'NCKH_TapChiQuocTe/CapNhat',            

            'strId': me.strTapChiQuocTe_Id,
            'dTyLeThamGia': "",
            'strTenTacGia': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_SP_DMTapChiQT_Id': edu.util.getValById("dropTCQT_DanhMuc"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTCQT_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropTCQT_DeTai"),
            'strNamCongBo': edu.util.getValById("txtTCQT_NamCongBo"),
            'strTenTapChi': edu.util.getValById("txtTCQT_TenTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtTCQT_ISSN"),
            'strThangCongBo': edu.util.getValById("txtTCQT_ThangCongBo"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtTCQT_SoTacGiaTrongTruong"),
            'dTrongDanhMucISI_Scopus': edu.util.getValById("dropDM_ISI"),
            'strLoaiBao_Id': edu.util.getValById("dropTCQT_LoaiBaiBao"),
            'strDOI': edu.util.getValById("txtTCQT_SoDOI"),
            'dHeSoIF_n': dHeSoIF,
            'dSoTacGia_n': edu.util.getValById("txtTCQT_TongSoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtTCQT_NamHoanThanh"),
            'strTenBaiBao': edu.util.getValById("txtTCQT_Ten"),
            'strThongTinMinhChung': edu.util.getValById("txtTCQT_NoiDungMinhChung"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': "",
            'strVaitro_Id': "",
            'dTrangThai': 1,
            'dThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtTCQT_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtTCQT_Tap"),
            'strSoTapChi': edu.util.getValById("txtTCQT_So"),
            'strTrangTapChi': edu.util.getValById("txtTCQT_Trang"),
            'strDanhSachCacThanhVienNgoai': edu.util.getValById("txtTCQT_NgoaiTruongKhac"),
            'strMaSanPham': edu.util.getValById("txtTCQT_Ma")
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    var strTapChiQuocTe_Id = me.strTapChiQuocTe_Id;
                    $("#tblInput_TCQT_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQT_ThanhVien(strNhanSu_Id, strTapChiQuocTe_Id);
                    });
                    $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_TCQT_ThanhVien(strNhanSu_Id, strTapChiQuocTe_Id);
                    });
                    edu.system.saveFiles("txtTCQT_FileDinhKem", strTapChiQuocTe_Id, "NCKH_Files");
                    setTimeout(function () {
                        me.getList_TCQT();
                    }, 3050);
                    me.setCheckChange("zone_input_tcqt");
                }
                else {
                    edu.system.alert("NCKH_TapChiQuocTe/CapNhat: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_TapChiQuocTe/CapNhat (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TCQT: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_TapChiQuocTe/Xoa',
            
            'strIds': strId,
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
                    me.getList_TCQT();
                }
                else {
                    obj = {
                        content: "NCKH_TapChiQuocTe/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_TapChiQuocTe/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML TapChiQuocTe
    --ULR:  Modules
    -------------------------------------------*/
    getDetail_TCQT: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtTapChiQT, "ID", me.viewEdit_TCQT);
    },
    getDetail_TCQT_Full: function (strId, strAction) {
        var me = this;
        console.log(me.dtTapChiQT_Full);
        edu.util.objGetDataInData(strId, me.dtTapChiQT_Full, "ID", me.viewEdit_TCQT);
    },
    genTable_TCQT: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblaiBaoQT_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblTCQT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TapChiQuocTe.getList_TCQT()",
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
        if (me.strTapChiQuocTe_Id != '') {
            $("#" + jsonForm.strTable_Id + ' tr[id="' + me.strTapChiQuocTe_Id + '"]').trigger("click");
        }
        /*III. Callback*/
    },
    genTable_TCQT_Full: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblModal_TCQT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TapChiQuocTe.getList_TCQT_Full()",
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
                        return '<span><a class="btn btn-primary btnChonTCQT" data-dismiss="modal" id="' + aData.ID + '">Chọn bài báo</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_TCQT: function (data) {
        var me = this;
        console.log(data);
        var dtTapChiQT = data[0];
        //View - Thong tin
        edu.util.viewValById("dropTCQT_DanhMuc", dtTapChiQT.NCKH_SP_DANHMUCTAPCHIQT_ID);
        $('#dropTCQT_DanhMuc').trigger({ type: 'select2:select' });
        edu.util.viewValById("txtTCQT_Ten", dtTapChiQT.TENBAIBAO);
        edu.util.viewValById("txtTCQT_TenTapChi", dtTapChiQT.TENTAPCHI);
        edu.util.viewValById("txtTCQT_Ma", dtTapChiQT.MASANPHAM);
        edu.util.viewValById("txtTCQT_ThoiGianPhanBo", dtTapChiQT.NAMCONGBO);
        edu.util.viewValById("dropTCQT_VaiTro", dtTapChiQT.VAITRO_ID);
        edu.util.viewValById("dropTCQT_LinhVuc", dtTapChiQT.THUOCLINHVUCNAO_ID);
        edu.util.viewValById("txtTCQT_NamHoanThanh", dtTapChiQT.NAMHOANTHANH);
        edu.util.viewValById("txtTCQT_NamCongBo", dtTapChiQT.NAMCONGBO);
        edu.util.viewValById("txtTCQT_ThangCongBo", dtTapChiQT.THANGCONGBO);
        edu.util.viewValById("dropTCQT_LoaiBaiBao", dtTapChiQT.LOAIBAO_ID);
        edu.util.viewValById("txtTCQT_HeSoIF", dtTapChiQT.HESOIF_N);
        edu.util.viewValById("txtTCQT_Tap", dtTapChiQT.TAPCUATAPCHI);
        edu.util.viewValById("txtTCQT_So", dtTapChiQT.SOTAPCHI);
        edu.util.viewValById("txtTCQT_ISSN", dtTapChiQT.CHISO_ISSN);
        edu.util.viewValById("txtTCQT_SoDOI", dtTapChiQT.DOI);
        edu.util.viewValById("txtTCQT_TongSoTacGia", dtTapChiQT.SOTACGIA_N);
        edu.util.viewValById("txtTCQT_SoTacGiaTrongTruong", dtTapChiQT.SOTACGIATRONGTRUONG_N);
        edu.util.viewValById("dropDM_ISI", dtTapChiQT.CONAMTRONGDANHMUCISI_SCOPUS);
        edu.util.viewValById("txtTCQT_Trang", dtTapChiQT.TRANGTAPCHI);
        edu.util.viewValById("txtTCQT_TrichDanPubmed", dtTapChiQT.TENBAIBAOTRICHDAN_PUBMED);
        edu.util.viewValById("dropTCQT_DeTai", dtTapChiQT.NCKH_QUANLYDETAI_ID);
        //View - Noi dung minh chung
        edu.util.viewValById("txtTCQT_NoiDungMinhChung", dtTapChiQT.THONGTINMINHCHUNG);
        edu.util.viewValById("txtTCQT_NgoaiTruongKhac", dtTapChiQT.DANHSACHCACTHANHVIENNGOAI);
        $("#myModalLabel_TCQT").html('<i class="fa fa-edit"></i> Chỉnh sửa bài báo quốc tế');
    },
    /*------------------------------------------
    --Discription: [2] AccessDB TCQT_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_TCQT_ThanhVien: function (strNhanSu_Id, strTapChiQuocTe_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strTapChiQuocTe_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strThanhVien_Id': strNhanSu_Id,
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
    getList_TCQT_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',
            
            'strSanPham_Id': me.strTapChiQuocTe_Id,
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
                    me.genTable_TCQT_ThanhVien(dtResult);
                    me.genTable_TCQT_ThanhVien_NgoaiTruong(dtResult);
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
    delete_TCQT_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strTapChiQuocTe_Id,
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
                    me.getList_TCQT_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_TCQT_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_TCQT_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_TCQT_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_TCQT_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
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
            $("#tblInput_TCQT_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.TapChiQuocTe;
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
        $("#tblInput_TCQT_ThanhVien tbody").append(html);
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
            $("#tblInput_TCQT_ThanhVien tbody").html("");
            $("#tblInput_TCQT_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TCQT_ThanhVien_NgoaiTruong: function (data) {
        var me = this;
        //3. create html
        $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").append(html);
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
        $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.TapChiQuocTe;
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
    --Discription: [4] LinhVucNghienCuu
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_LinhVucNghienCuu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THONGTIN1",
                code: "MA",
                type: "order",
            },
            renderPlace: ["dropSearch_LinhVuc", "dropTCQT_LinhVuc", "dropSearchModal_TCQT_LinhVuc"],
            title: 'Chọn lĩnh vực'
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongXetChucDanh
    -------------------------------------------*/
    getList_DMTCQT: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DMTapChiQuocTe/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_DMTCQT_TuKhoa"),
            'strTenTapChiDang_Id': "",
            'strLoaiTapChi_Id': "",
            'strCoQuanXuatBan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': 100000
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
                    me.genCombo_DMTCQT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DMTapChiQuocTe/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_DMTapChiQuocTe/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_DMTCQT: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENTAPCHIDANG_TEN",
                code: "MA"
            },
            renderPlace: ["dropTCQT_TenTapChi"],
            title: "Chọn tên danh mục tạp chí"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DeTai: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',            

            'iTinhTrang': -1,
            'dTrangThai': -1,
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
            renderPlace: ["dropTCQT_DeTai"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.TapChiQuocTe;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            dTrangThai: 1
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
            renderPlace: ["dropSearchModal_TCQT_DonVi"],
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
        me.getList_TCQT();
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    getList_DMTapChiQuocTe: function (data, iPager) {
        var me = this;
        var obj_list = {
            'action': 'NCKH_DMTapChiQuocTe/LayDanhSach',            

            'strTuKhoa': "",
            'strTenTapChiDang_Id': "",
            'strLoaiTapChi_Id': "",
            'strCoQuanXuatBan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000
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
                    me.genCombo_DMTapChiQuocTe(dtResult);
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
    genCombo_DMTapChiQuocTe: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENTAPCHIDANG",
                code: "MATAPCHIDANG"
            },
            renderPlace: ["dropTCQT_DanhMuc"],
            title: "Chọn danh mục tạp chí"
        };
        edu.system.loadToCombo_data(obj);
    },
};
