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
    dtXacNhan: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.getList_XacNhan();
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
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnXacNhan_TCQT").click(function () {
            $("#modal_XacNhan").modal("show");
            var strTenSanPham = edu.util.objGetDataInData(me.strTapChiQuocTe_Id, me.dtTapChiQT, "ID")[0]["TENBAIBAO"];
            $("#txtTenSanPham").html(strTenSanPham);
            $("#txtNoiDungXacNhanSanPham").val("");
            edu.extend.getList_XacNhanSanPham(me.strTapChiQuocTe_Id, "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            edu.extend.save_XacNhanSanPham(me.strTapChiQuocTe_Id, strTinhTrang, strMoTa);
            setTimeout(function () {
                me.toggle_notify();
                me.getList_TCQT();
            }, 500);
        });
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocTe
        --Order: 
        -------------------------------------------*/
        $("#btnSave_TCQT").click(function () {
            if (edu.util.checkValue(me.strTapChiQuocTe_Id)) {
                me.update_TCQT();
            }
            else {
                me.save_TCQT();
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
        $("#tblTCQT").delegate(".btnxacnhan_small", "click", function (e) {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                var strSanPham = $(this).attr("name");
                var strSanPham_Id = $(this).attr("sanpham_id");
                var strXacNhan = $(this).find("a").attr("title");
                var confirm = 'Xác nhận <i class="cl-danger">' + strXacNhan + '</i> cho sản phẩm <i class="cl-danger">' + strSanPham + '</i> !';
                confirm += '<div class="clear"></div>';
                confirm += '<input id="txtMota_XacNhan_small" class="form-control" placeholder="Mô tả xác nhận"/>';
                edu.system.confirm(confirm, "q");
                $("#btnYes").click(function (e) {
                    edu.extend.save_XacNhanSanPham(strSanPham_Id, strId, edu.util.getValById("txtMota_XacNhan_small"));
                    setTimeout(function () {
                        me.getList_TCQT();
                    }, 500);
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
            me.getList_TCQG_Full();
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


        $("#dropSearch_DonViThanhVien_TCQT").on("select2:select", function () {
            me.getList_HS();
            me.getList_TCQT();
        });
        $("#dropSearch_ThanhVienDangKy_TCQT").on("select2:select", function () {
            me.getList_TCQT();
        });
        $("#dropSearch_LinhVuc_TCQT").on("select2:select", function () {
            me.getList_TCQT();
        });
        $("#dropSearch_DeTai_TCQT").on("select2:select", function () {
            me.getList_TCQT();
        });
        $("#dropSearch_PhanLoai_TCQT").on("select2:select", function () {
            me.getList_TCQT();
        });
        $("#dropSearch_TinhTrang_TCQT").on("select2:select", function () {
            me.getList_TCQT();
        });
        /*------------------------------------------
        --Discription: [2] Action Report
        --Order: 
        -------------------------------------------*/
        edu.system.getList_MauImport("zonebtnBaoCao_TCQT", function (addKeyValue) {
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_TuKhoa"));
            addKeyValue("iTrangThai", 1);
            addKeyValue("strCanBoNhap_Id", "");
            addKeyValue("strThuocLinhVucNao_Id", edu.util.getValById("dropSearch_LinhVuc_TCQT"));
            addKeyValue("strNCKH_QuanLyDeTai_Id", edu.util.getValById("dropSearch_DeTai_TCQT"));
            addKeyValue("strPhanLoaiTapChi_Id", edu.util.getValById("dropSearch_PhanLoai_TCQT"));
            addKeyValue("strNCKH_DeTai_ThanhVien_Id", edu.util.getValById("dropSearch_ThanhVienDangKy_TCQT"));
            addKeyValue("strVaitro_Id", "");
            addKeyValue("strDonViCuaThanhVien_Id", edu.util.getValById("dropSearch_DonViThanhVien_TCQT"));
            addKeyValue("strLoaiHocVi_Id", "");
            addKeyValue("strLoaiChucDanh_Id", "");
            addKeyValue("strNCKH_SP_DMTapChiQT_Id", "");
            addKeyValue("strLoaiBao_Id", "");
            addKeyValue("strTinhTrangXacNhan_Id", edu.util.getValById("dropSearch_TinhTrang_TCQT"));
            addKeyValue("strNhanSu_TDKT_KeHoach_Id", edu.util.getValById("dropSearch_NamDanhGia_DT"));
            addKeyValue("strDaoTao_CoCauToChuc_Id", edu.util.getValById("dropSearch_DonViThanhVien_TCQT"));
        });
        $(".btnDownloadAllFile").click(function () {
            var arrFile = [];
            var arrFileName = [];
            $(".upload-file").each(function () {
                var url = $(this).attr("name");
                arrFile.push(url);
                arrFileName.push($(this).attr("title"));
            });
            $(".upload-img").each(function () {
                var url = $(this).attr("name");
                arrFile.push(url);
                arrFileName.push("");
            });
            me.save_GopFile(arrFile, arrFileName);
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_DeTai();
        me.getList_HS();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        var obj = {
            code: constant.setting.CATOR.NCKH.TTDT,
            renderPlace: "rdTCQT_TinhTrang",
            nameRadio: "rdTCQT_TinhTrang",
            title: ""
        };
        //me.getList_TCQT();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LBAO", "dropTCQT_LoaiBaiBao, dropSearch_PhanLoai_TCQT");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LVNC, "dropSearch_LinhVuc_TCQT");
        setTimeout(function () {
            var obj = {
                strMaBangDanhMuc: constant.setting.CATOR.NCKH.LVNC,
                strTenCotSapXep: "",
                iTrangThai: 1
            };
            edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_LinhVucNghienCuu);
            setTimeout(function () {
                var obj = {
                    strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTQT,
                    strTenCotSapXep: "",
                    iTrangThai: 1
                };
                edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
                setTimeout(function () {
                    edu.system.getList_DLDM_Cache("VALID.NCKH.TCQT");
                }, 50);
            }, 50);
        }, 50);
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_tcqt");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_tcqt");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_tcqt");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.bcheckTimKiem = false;
        me.strTapChiQuocTe_Id = "";
        me.arrNhanSu_Id = [];
        var arrId = ["txtTCQT_Ten", "txtTCQT_TenTapChi", "txtTCQT_Ma", "dropTCQT_LinhVuc", "txtTCQT_NamCongBo", "txtTCQT_HeSoIF", "txtTCQT_Tap",
            "txtTCQT_So", "txtTCQT_Trang", "txtTCQT_TrichDanPubmed", "txtTCQT_NoiDungMinhChung", "dropTCQT_DeTai", "dropTCQT_LoaiBaiBao",
            "txtTCQT_ISSN", "txtTCQT_TongSoTacGia", "txtTCQT_SoTacGiaTrongTruong", "txtTCQT_ThangCongBo", "txtTCQT_NamHoanThanh", "txtTCQT_SoDOI"];
        edu.util.resetValByArrId(arrId);
        edu.util.resetRadio("name", "rdTCQT_TinhTrang");
        //table
        //reset file
        edu.system.viewFiles("txtTCQT_FileDinhKem", "");
        $("#tblInput_TCQT_ThanhVien tbody").html("");
        $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").html("");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocTe
    -------------------------------------------*/
    getList_TCQT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_TapChiQuocTe/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_TCQT"),
            'strNCKH_DeTai_ThanhVien_Id': edu.util.getValById("dropSearch_ThanhVienDangKy_TCQT"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearch_LinhVuc_TCQT"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropSearch_DeTai_TCQT"),
            'strPhanLoaiTapChi_Id': edu.util.getValById("dropSearch_PhanLoai_TCQT"),
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_TCQT"),
            'strNCKH_SP_DMTapChiQT_Id': "",
            'strVaitro_Id': "",
            'strTinhTrangXacNhan_Id': edu.util.getValById("dropSearch_TinhTrang_TCQT"),
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
        //--Edit
        var obj_list = {
            'action': 'NCKH_TapChiQuocTe/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearchModal_TCQT_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearchModal_TCQT_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': "",
            'strPhanLoaiTapChi_Id': '',
            'strLoaiChucDanh_Id': "",
            'strLoaiHocVi_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearchModal_TCQT_DonVi"),
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
        //--Edit
        var obj_save = {
            'action': 'NCKH_TapChiQuocTe/ThemMoi',

            'strId': "",
            'dTyLeThamGia': "",
            'strTenTacGia': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTCQT_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropTCQT_DeTai"),
            'strNamCongBo': edu.util.getValById("txtTCQT_NamCongBo"),
            'strTenTapChi': edu.util.getValById("txtTCQT_TenTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtTCQT_ISSN"),
            'strThangCongBo': edu.util.getValById("txtTCQT_ThangCongBo"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtTCQT_SoTacGiaTrongTruong"),
            'strLoaiBao_Id': edu.util.getValById("dropTCQT_LoaiBaiBao"),
            'strDOI': edu.util.getValById("txtTCQT_SoDOI"),
            'dHeSoIF_n': edu.util.getValById("txtTCQT_HeSoIF"),
            'dSoTacGia_n': edu.util.getValById("txtTCQT_TongSoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtTCQT_NamHoanThanh"),
            'strTenBaiBao': edu.util.getValById("txtTCQT_Ten"),
            'strThongTinMinhChung': edu.util.getValById("txtTCQT_NoiDungMinhChung"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': "",
            'strVaitro_Id': "",
            'iTrangThai': 1,
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtTCQT_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtTCQT_Tap"),
            'strSoTapChi': edu.util.getValById("txtTCQT_So"),
            'strTrangTapChi': edu.util.getValById("txtTCQT_Trang"),
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
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm mới không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                    });
                    
                    setTimeout(function () {
                        me.getList_TCQT();
                    }, 50);
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
        //--Edit
        var obj_save = {
            'action': 'NCKH_TapChiQuocTe/CapNhat',

            'strId': me.strTapChiQuocTe_Id,
            'dTyLeThamGia': "",
            'strTenTacGia': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTCQT_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropTCQT_DeTai"),
            'strNamCongBo': edu.util.getValById("txtTCQT_NamCongBo"),
            'strTenTapChi': edu.util.getValById("txtTCQT_TenTapChi"),
            'strChiSo_ISSN': edu.util.getValById("txtTCQT_ISSN"),
            'strThangCongBo': edu.util.getValById("txtTCQT_ThangCongBo"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtTCQT_SoTacGiaTrongTruong"),
            'strLoaiBao_Id': edu.util.getValById("dropTCQT_LoaiBaiBao"),
            'strDOI': edu.util.getValById("txtTCQT_SoDOI"),
            'dHeSoIF_n': edu.util.getValById("txtTCQT_HeSoIF"),
            'dSoTacGia_n': edu.util.getValById("txtTCQT_TongSoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtTCQT_NamHoanThanh"),
            'strTenBaiBao': edu.util.getValById("txtTCQT_Ten"),
            'strThongTinMinhChung': edu.util.getValById("txtTCQT_NoiDungMinhChung"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': "",
            'strVaitro_Id': "",
            'iTrangThai': 1,
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtTCQT_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtTCQT_Tap"),
            'strSoTapChi': edu.util.getValById("txtTCQT_So"),
            'strTrangTapChi': edu.util.getValById("txtTCQT_Trang"),
            'strMaSanPham': edu.util.getValById("txtTCQT_Ma")
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_TCQT();
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
        //--Edit
        var obj_delete = {
            'action': 'NCKH_TapChiQuocTe/Xoa',
            
            'strIds': strId
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
            colPos: {
                center: [0, 3, 4, 5, 6, 9, 10],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {

                        return '<a class="btnEdit poiter" id="' + aData.ID + '">' + edu.util.returnEmpty(aData.TENBAIBAO) + '</a>';
                    }
                },
                {
                    "mDataProp": "TENTAPCHI"
                },
                {
                    "mDataProp": "SOTACGIA_N"
                },
                {
                    "mDataProp": "NAMCONGBO"
                },
                {
                    "mDataProp": "THANGCONGBO"
                },
                {
                    "mDataProp": "HESOIF_N"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a href="' + edu.util.returnEmpty(aData.TENBAIBAOTRICHDAN_PUBMED) + '" target="_blank">' + edu.util.returnEmpty(aData.TENBAIBAOTRICHDAN_PUBMED).replace(/\+/g, " ").replace(/\_/g, " ") + '</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="txtTCQT_FileDinhKem' + aData.ID + '"></div>';
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        var row = "";
                        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((me.dtXacNhan.length - 1) * 40) + 'px">';
                        for (var i = 0; i < me.dtXacNhan.length; i++) {
                            if (me.dtXacNhan[i].MA == "XNKKCHUAKHAI") continue;
                            row += '<div id="' + me.dtXacNhan[i].ID + '" name="' + aData.TENBAIBAO + '" sanpham_id="' + aData.ID + '" class="btn-large btnxacnhan_small">';
                            row += '<a class="btn" title="' + me.dtXacNhan[i].TEN + '"><i style="' + me.dtXacNhan[i].THONGTIN2 + '" class="' + me.dtXacNhan[i].THONGTIN1 + '"></i></a>';
                            row += '</div>';
                        }
                        return row;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var row = "";
                        if (edu.util.checkValue(aData.KETQUAXACNHAN_TEN)) {
                            row += '<div style="margin-left: auto; margin-right: auto; width: 100px">';
                            row += '<div class="btn-large" style="width: 100px">';
                            row += '<a title="' + aData.KETQUAXACNHAN_TEN + '"><i style="' + aData.KETQUAXACNHAN_THONGTIN2 + '" class="' + aData.KETQUAXACNHAN_THONGTIN1 + '"></i> ' + aData.KETQUAXACNHAN_TEN + '</a>';
                            row += '</div>';
                            row += '</div>';
                        }
                        return row;
                    }
                },
                {
                    "mDataProp": "KETQUAXACNHAN_NOIDUNG"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].ID);
            edu.system.viewFiles("txtTCQT_FileDinhKem" + data[i].ID, data[i].ID, "NCKH_Files");
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
        edu.util.viewValById("txtTCQT_Trang", dtTapChiQT.TRANGTAPCHI);
        edu.util.viewValById("txtTCQT_TrichDanPubmed", dtTapChiQT.TENBAIBAOTRICHDAN_PUBMED);
        edu.util.viewValById("dropTCQT_DeTai", dtTapChiQT.NCKH_QUANLYDETAI_ID);
        //View - Noi dung minh chung
        edu.util.viewValById("txtTCQT_NoiDungMinhChung", dtTapChiQT.THONGTINMINHCHUNG);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB TCQT_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_TCQT_ThanhVien: function (strNhanSu_Id, strTapChiQuocTe_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',

            'strSanPham_Id': strTapChiQuocTe_Id,
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
    getList_TCQT_ThanhVien: function () {
        var me = this;
        //--Edit
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
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strTapChiQuocTe_Id,
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
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TCQT_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = main_doc.TapChiQuocTe;
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
        me.arrNhanSu_Id = [];
        $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TCQT_ThanhVien_NgoaiTruong tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
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
        //--Edit
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

        //--Edit
        var obj_list = {
            'action': 'NCKH_DeTai/LayDanhSach',

            'iTinhTrang': -1,
            'iTrangThai': -1,
            'strCanBoNhapDeTai_Id': "",
            'strThanhVien_Id': "",
            'strDaoTao_CoCauToChuc_Id': "",
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
            renderPlace: ["dropTCQT_DeTai", "dropSearch_DeTai_TCQT"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.TapChiQuocTe;
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
            renderPlace: ["dropSearchModal_TCQT_DonVi", "dropSearch_DonViThanhVien_TCQT"],
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_TCQT"),
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
            renderPlace: ["dropSearch_ThanhVienDangKy_TCQT"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    getList_XacNhan: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadBtnXacNhan(dtReRult);
                    me.page_load();
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
    loadBtnXacNhan: function (data) {
        main_doc.TapChiQuocTe.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length - 1) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            if (data[i].MA == "XNKKCHUAKHAI") continue;
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
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
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_NamDanhGia_DT", data[0].ID);
        }
        this.getList_TCQT();
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_GopFile: function (arrUrl, arrFileName) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_Files/GopFile',

            'arrTuKhoa': arrUrl,
            'arrDuLieu': arrFileName,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data) {
                        window.open(edu.system.rootPathUpload + "/" + data.Data);
                    }
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
};