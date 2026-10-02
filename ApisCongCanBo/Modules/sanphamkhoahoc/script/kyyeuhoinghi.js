/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function KyYeuHoiNghi() { }
KyYeuHoiNghi.prototype = {
    dtKyYeu: [],
    dtKyYeu_Full: [],
    strKyYeu_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrISSN: [],
    bcheckTimKiem: false,
    arrValid_KYHN: [],

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
            if (me.checkChange("zone_input_hnht")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_KYHN").trigger("click");
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
            me.getList_KYHN();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KYHN();
            }
        });
        $(".btnSearchKYHN_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnSearchKYHN_NhanSu_NgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        /*------------------------------------------
        --Discription: [1] Action TapChiQuocGia
        --Order: 
        -------------------------------------------*/
        $("#btnSave_KYHN").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_KYHN);
            if (true) {
                if (edu.util.checkValue(me.strKyYeu_Id)) {
                    me.update_KYHN();
                }
                else {
                    me.save_KYHN();
                }
            }
        });
        $("#tblKYHN").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strKyYeu_Id = strId;
                me.getDetail_KYHN(strId);
                me.getList_KYHN_ThanhVien();
                edu.system.viewFiles("txtKYHN_FileDinhKem", strId, "NCKH_Files");
                edu.util.setOne_BgRow(strId, "tblKYHN");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKYHN").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KYHN(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [3] Action KYHN_ThanhVien input
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        /*------------------------------------------
        --Discription: [4] Action KYHN_ThanhVien_NgoaiTruong
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect_NgoaiTruong', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
        });
        $("#tblInput_KYHN_ThanhVien,#tblInput_KYHN_ThanhVien_NgoaiTruong").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
                me.removeHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KYHN_ThanhVien(strNhanSu_Id);
                });
            }
        });
        $(".btnSearchKYHN_BaiBao").click(function () {
            $("#modal_TimBaiBao").modal("show");
            me.getList_KYHN_Full();
            setTimeout(function () {
                $("#txtSearchModal_KYHN_TuKhoa").focus();
            }, 500);
        });
        $("#btnSearch_Modal_KYHN").click(function () {
            me.getList_KYHN_Full();
        });
        $("#txtSearchModal_KYHN_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KYHN_Full();
            }
        });
        $("#modal_TimBaiBao").delegate(".btnChonKYHN", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                $("#modal_TimBaiBao").hide();
                me.rewrite();
                me.toggle_form();
                me.getDetail_KYHN_Full(strId);
                me.bcheckTimKiem = true;
                edu.system.viewFiles("txtKYHN_FileDinhKem", strId, "NCKH_Files");
                edu.extend.getDetail_HS(me.genHTML_NhanSu);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_NamDanhGia_DT").on("select2:select", function () {
            me.rewrite();
            me.getList_KYHN();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_form();
        edu.system.uploadFiles(["txtKYHN_FileDinhKem"]);
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTQG,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        //me.getList_KYHN();
        me.getList_DeTai();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LVNC, "dropKYHN_LinhVuc,dropSearchModal_KYHN_LinhVuc");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKY", "dropKYHN_LoaiKyYeu");
        $("#dropSearch_LinhVuc").val("").trigger("change");
        
        me.getList_CoCauToChuc();
        me.arrValid_KYHN = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKYHN_TenBaiBao", "THONGTIN1": "EM" },
            { "MA": "txtKYHN_TenTapChi", "THONGTIN1": "EM" },
            { "MA": "txtKYHN_Ma", "THONGTIN1": "EM" },
            { "MA": "txtKYHN_TongSoTacGia", "THONGTIN1": "EM" },
            { "MA": "txtKYHN_NamCongBo", "THONGTIN1": "EM" },
            { "MA": "txtKYHN_ThangCongBo", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_KYHN");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_KYHN");
        setTimeout(function () {
            me.setCheckChange("zone_input_hnht");
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
        edu.util.toggle_overide("zone-bus", "zone_notify_KYHN");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.bcheckTimKiem = false;
        $("#myModalLabel_KYHN").html('.. <i class="fa fa-pencil"></i> Kê khai kỷ yếu/hội nghị');
        me.strKyYeu_Id = "";
        me.arrNhanSu_Id = [];
        var arrId = ["txtKYHN_TenBaiBao", "txtKYHN_TenTapChi", "txtKYHN_ISSN", "dropKYHN_LinhVuc", "dropKYHN_LoaiKyYeu", "txtKYHN_Ma", "txtKYHN_TongSoTacGia", "txtKYHN_SoTacGiaTrongTruong", "txtKYHN_Tap", "txtKYHN_So", "txtKYHN_Trang",
            "txtKYHN_NamHoanThanh", "txtKYHN_NamCongBo", "txtKYHN_ThangCongBo", "txtKYHN_TrichDanPubmed", "txtKYHN_NoiDungMinhChung", "dropKYHN_DeTai"];
        edu.util.resetValByArrId(arrId);
        $("#tblInput_KYHN_ThanhVien tbody").html("");
        $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").html("");
        //table
        //reset file
        edu.system.viewFiles("txtKYHN_FileDinhKem", "");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TapChiQuocGia
    -------------------------------------------*/
    getList_KYHN: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_KyYeu/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThuocLinhVucNao_Id': "",
            'strNCKH_QuanLyDeTai_Id': "",
            'strLoaiKyYeu_Id': '',
            'strTinhTrangXacNhan_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaitro_Id': "",
            'strDonViCuaThanhVien_Id': "",
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
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
                        me.dtKyYeu = dtResult;
                    }
                    me.genTable_KYHN(dtResult, iPager);
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
    getList_KYHN_Full: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_KyYeu/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearchModal_KYHN_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearchModal_KYHN_LinhVuc"),
            'strNCKH_QuanLyDeTai_Id': "",
            'strLoaiKyYeu_Id': '',
            'strNCKH_DeTai_ThanhVien_Id': '',
            'strVaitro_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearchModal_KYHN_DonVi"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
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
                        me.dtKyYeu_Full = dtResult;
                    }
                    me.genTable_KYHN_Full(dtResult, iPager);
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
    save_KYHN: function () {
        var me = this;

        var obj_save = {
            'action': 'NCKH_KyYeu/ThemMoi',
            

            'strId': "",
            'strTyLeThamGia': "",
            'strTenBaiBao': edu.util.getValById("txtKYHN_TenBaiBao"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropKYHN_LinhVuc"),
            'strNCKH_QUANLYDETAI_ID': edu.util.getValById("dropKYHN_DeTai"),
            'strVaitro_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': edu.util.getValById("tblInput_KYHN_ThanhVien"),
            'strNamCongBo': edu.util.getValById("txtKYHN_NamCongBo"),
            'strThangCongBo': edu.util.getValById("txtKYHN_ThangCongBo"),
            'strTenTapChi': edu.util.getValById("txtKYHN_TenTapChi"),
            'strChiSo_ISBN': edu.util.getValById("txtKYHN_ISSN"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtKYHN_SoTacGiaTrongTruong"),
            'strPhanLoaiTapChi_Id': edu.util.getValById("dropKYHN_LoaiKyYeu"),
            'dSoTacGia_n': edu.util.getValById("txtKYHN_TongSoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtKYHN_NamHoanThanh"),
            //'strFileMinhChung'      : edu.util.getValById("txtKYHN_FileDinhKem"),
            'strThongTinMinhChung': edu.util.getValById("txtKYHN_NoiDungMinhChung"),
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtKYHN_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtKYHN_Tap"),
            'strSoTapChi': edu.util.getValById("txtKYHN_So"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTrangTapChi': edu.util.getValById("txtKYHN_Trang"),
            'strMaSanPham': edu.util.getValById("txtKYHN_Ma"),
            'iTrangThai': 1
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKyYeu_Id = data.Id;
                    $("#tblInput_KYHN_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_KYHN_ThanhVien(strNhanSu_Id, strKyYeu_Id);
                    });
                    $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_KYHN_ThanhVien(strNhanSu_Id, strKyYeu_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtKYHN_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtKYHN_FileDinhKem");
                        }
                    }
                    edu.system.saveFiles("txtKYHN_FileDinhKem", strKyYeu_Id, "NCKH_Files");
                    setTimeout(function () {
                        me.getList_KYHN();
                    }, 3050);
                    me.setCheckChange("zone_input_hnht");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                edu.system.alert('Tiến trình thực hiện thành công!');
                //$("#btnYes").click(function (e) {
                //    me.rewrite();
                //    $('#myModalAlert').modal('hide');
                //});
                
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
    update_KYHN: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_KyYeu/CapNhat',
            

            'strId': me.strKyYeu_Id,
            'strTyLeThamGia': "",
            'strTenBaiBao': edu.util.getValById("txtKYHN_TenBaiBao"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropKYHN_LinhVuc"),
            'strNCKH_QUANLYDETAI_ID': edu.util.getValById("dropKYHN_DeTai"),
            'strVaitro_Id': "",
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strLaThanhVienCuaTruong': edu.util.getValById("tblInput_KYHN_ThanhVien"),
            'strNamCongBo': edu.util.getValById("txtKYHN_NamCongBo"),
            'strThangCongBo': edu.util.getValById("txtKYHN_ThangCongBo"),
            'strTenTapChi': edu.util.getValById("txtKYHN_TenTapChi"),
            'strChiSo_ISBN': edu.util.getValById("txtKYHN_ISSN"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById("txtKYHN_SoTacGiaTrongTruong"),
            'strPhanLoaiTapChi_Id': edu.util.getValById("dropKYHN_LoaiKyYeu"),
            'dSoTacGia_n': edu.util.getValById("txtKYHN_TongSoTacGia"),
            'strNamHoanThanh': edu.util.getValById("txtKYHN_NamHoanThanh"),
            //'strFileMinhChung'      : edu.util.getValById("txtKYHN_FileDinhKem"),
            'strThongTinMinhChung': edu.util.getValById("txtKYHN_NoiDungMinhChung"),
            'iThuTu': 1,
            'strCanBoNhap_Id': edu.system.userId,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTenBaiBaoTrichDan_Pubmed': edu.util.getValById("txtKYHN_TrichDanPubmed"),
            'strTapCuaTapChi': edu.util.getValById("txtKYHN_Tap"),
            'strSoTapChi': edu.util.getValById("txtKYHN_So"),
            'strTrangTapChi': edu.util.getValById("txtKYHN_Trang"),
            'strMaSanPham': edu.util.getValById("txtKYHN_Ma"),
            'iTrangThai': 1
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    var strKyYeu_Id = me.strKyYeu_Id;
                    $("#tblInput_KYHN_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_KYHN_ThanhVien(strNhanSu_Id, strKyYeu_Id);
                    });
                    $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_KYHN_ThanhVien(strNhanSu_Id, strKyYeu_Id);
                    });
                    edu.system.saveFiles("txtKYHN_FileDinhKem", strKyYeu_Id, "NCKH_Files");

                    setTimeout(function () {
                        me.getList_KYHN();
                    }, 3050);
                    me.setCheckChange("zone_input_hnht");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    delete_KYHN: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_KyYeu/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KYHN();
                }
                else {
                    obj = {
                        content: "NCKH_KyYeu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_KyYeu/Xoa (er): " + JSON.stringify(er),
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
    genTable_KYHN: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblKYHN_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblKYHN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KyYeuHoiNghi.getList_KYHN()",
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
        /*III. Callback*/
    },
    genTable_KYHN_Full: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblModal_KYHN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KyYeuHoiNghi.getList_KYHN_Full()",
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
                        return '<span><a class="btn btn-primary btnChonKYHN" data-dismiss="modal" id="' + aData.ID + '">Chọn bài báo</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getDetail_KYHN: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtKyYeu, "ID", me.viewEdit_KYHN);
    },
    getDetail_KYHN_Full: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtKyYeu_Full, "ID", me.viewEdit_KYHN);
    },
    //
    viewEdit_KYHN: function (data) {
        var me = this;
        var dtKyYeu = data[0];
        //View - Thong tin
        edu.util.viewValById("txtKYHN_TenTapChi", dtKyYeu.TENTAPCHI);
        edu.util.viewValById("txtKYHN_TenBaiBao", dtKyYeu.TENBAIBAO);
        edu.util.viewValById("txtKYHN_ISSN", dtKyYeu.CHISO_ISBN);
        edu.util.viewValById("dropKYHN_DMTapChi", dtKyYeu.NCKH_SP_DANHMUCTAPCHIQG_ID);
        edu.util.viewValById("txtKYHN_Ma", dtKyYeu.MASANPHAM);
        edu.util.viewValById("txtKYHN_ThangCongBo", dtKyYeu.THANGCONGBO);
        edu.util.viewValById("dropKYHN_VaiTro", dtKyYeu.VAITRO_ID);
        edu.util.viewValById("dropKYHN_LinhVuc", dtKyYeu.THUOCLINHVUCNAO_ID);
        edu.util.viewValById("dropKYHN_LoaiKyYeu", dtKyYeu.PHANLOAITAPCHI_ID);
        edu.util.viewValById("txtKYHN_TongSoTacGia", dtKyYeu.SOTACGIA_N);
        edu.util.viewValById("txtKYHN_SoTacGiaTrongTruong", dtKyYeu.SOTACGIATRONGTRUONG_N);
        edu.util.viewValById("txtKYHN_Tap", dtKyYeu.TAPCUATAPCHI);
        edu.util.viewValById("txtKYHN_So", dtKyYeu.SOTAPCHI);
        edu.util.viewValById("txtKYHN_Trang", dtKyYeu.TRANGTAPCHI);
        edu.util.viewValById("dropKYHN_DeTai", dtKyYeu.NCKH_QUANLYDETAI_ID);
        edu.util.viewValById("txtKYHN_NamCongBo", dtKyYeu.NAMCONGBO);
        edu.util.viewValById("txtKYHN_NamHoanThanh", dtKyYeu.NAMHOANTHANH);
        edu.util.viewValById("txtKYHN_TrichDanPubmed", dtKyYeu.TENBAIBAOTRICHDAN_PUBMED);
        //View - Noi dung minh chung
        edu.util.viewValById("txtKYHN_NoiDungMinhChung", dtKyYeu.THONGTINMINHCHUNG);
        $("#myModalLabel_KYHN").html('<i class="fa fa-edit"></i> Chỉnh sửa kỷ yếu/hội nghị');
        //View - Thanh vien tham gia
    },
    /*------------------------------------------
    --Discription: [2] AccessDB KYHN_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_KYHN_ThanhVien: function (strNhanSu_Id, strKyYeu_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',
            

            'strSanPham_Id': strKyYeu_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
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
    getList_KYHN_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',
            

            'strSanPham_Id': me.strKyYeu_Id,
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
                    me.genTable_KYHN_ThanhVien(dtResult);
                    me.genTable_KYHN_ThanhVien_NgoaiTruong(dtResult);
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
    delete_KYHN_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strKyYeu_Id,
            'strThanhVien_Id': strNhanSu_Id
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KYHN_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_KYHN_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_KYHN_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_KYHN_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_KYHN_ThanhVien tbody").html("");
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
            $("#tblInput_KYHN_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.KyYeuHoiNghi;
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
        $("#tblInput_KYHN_ThanhVien tbody").append(html);
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
            $("#tblInput_KYHN_ThanhVien tbody").html("");
            $("#tblInput_KYHN_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KYHN_ThanhVien_NgoaiTruong: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").html("");
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
            $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").append(html);
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
        $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender, "");
    },
    removeHTML_NhanSu_NgoaiTruong: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").html("");
            $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.KyYeuHoiNghi;
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

        //--Edit
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
            renderPlace: ["dropKYHN_DeTai"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.KyYeuHoiNghi;
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
            renderPlace: ["dropSearchModal_KYHN_DonVi"],
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
        //
        
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
        me.getList_KYHN();
    },
};