/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function ThongTinSach() { }
ThongTinSach.prototype = {
    dtSach: [],
    dtSach_Full: [],
    strSach_Id:'',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    bcheckTimKiem: false,
    arrValid_TTS: [],

    init: function () {
        var me = main_doc.ThongTinSach;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            if (me.checkChange("zone_input_TTS")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_TTS").trigger("click");
                });
            }
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
            edu.extend.getDetail_HS(me.genHTML_NhanSu);
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_TTS();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TTS();
            }
        });
         /*------------------------------------------
        --Discription: [1] Action Sach
        --Order:
        -------------------------------------------*/
        $("#btnSave_TTS").click(function () {
            if (true) {
                if (edu.util.checkValue(me.strSach_Id)) {
                    me.update_Sach();
                }
                else {
                    me.save_Sach();
                }
            }
        });
        $("#tblTTS").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strSach_Id = strId;
                me.getDetail_TTS(strId, constant.setting.ACTION.EDIT);
                me.getList_DeTai_ThanhVien();
                edu.util.setOne_BgRow(strId, "tblTTS");
                edu.system.viewFiles("txtTTS_FileDinhKem", strId, "NCKH_Files");
                edu.system.getList_RangBuoc("NCKH_SP_SACH", strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTTS").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_TTS(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
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
        $("#modal_nhansu").delegate('.btnSelect_NgoaiTruong', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
        });
        $("#tblInput_TTS_ThanhVien, #tblInput_TTS_ThanhVien_NgoaiTruong").delegate('.btnDeletePoiter', 'click', function () {
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
        $(".btnSearchTTS_BaiBao").click(function () {
            $("#modal_TimBaiBao").modal("show");
            me.getList_TTS_Full();
            setTimeout(function () {
                $("#txtSearchModal_TTS_TuKhoa").focus();
            }, 500);
        });
        $("#btnSearch_Modal_TTS").click(function () {
            me.getList_TTS_Full();
        });
        $("#txtSearchModal_TTS_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TTS_Full();
            }
        });
        $("#modal_TimBaiBao").delegate(".btnChonTTS", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.getDetail_TTS_Full(strId);
                edu.system.viewFiles("txtTTS_FileDinhKem", strId, "NCKH_Files");
                me.bcheckTimKiem = true;
                edu.extend.getDetail_HS(me.genHTML_NhanSu);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearchTTS_NhanSu_NgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        $("#dropSearch_NamDanhGia_DT").on("select2:select", function () {
            me.rewrite();
            me.getList_TTS();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.ThongTinSach;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtTTS_FileDinhKem"]);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.TTS.LANXUATBAN", "dropTTS_LanXuatBan");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.VTVS", "dropSearch_VaiTro_TTS");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.PHLS", "dropSearch_PhanLoaiSach_TTS,dropTTS_LoaiSach");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LVNC", "dropSearch_LinhVuc_TTS, dropTTS_LinhVuc, dropSearchModal_TTS_LinhVuc");
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTVS,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        me.toggle_form();
        me.getList_DeTai();
        me.getList_CoCauToChuc();
        me.arrValid_TTS = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtTTS_Ten", "THONGTIN1": "EM" },
            { "MA": "txtTTS_NhaXuatBan", "THONGTIN1": "EM" },
            { "MA": "txtTTS_ThangXuatBan", "THONGTIN1": "EM" },
            { "MA": "txtTTS_NamXuatBan", "THONGTIN1": "EM" },
            { "MA": "dropTTS_LoaiSach", "THONGTIN1": "EM" },
            { "MA": "dropTTS_LanXuatBan", "THONGTIN1": "EM" },
            { "MA": "txtTTS_SoTacGia", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_TTS");
        setTimeout(function () {
            me.setCheckChange("zone_input_TTS");
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
        edu.util.toggle_overide("zone-bus", "zone_notify_TTS");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.ThongTinSach;
        //
        $("#myModalLabel_TTS").html('.. <i class="fa fa-pencil"></i> Kê khai sách');
        me.bcheckTimKiem = false;
        me.strSach_Id = "";
        me.arrNhanSu_Id = [];
        var arrId = ["txtTTS_Ten", "txtTTS_NhaXuatBan", "txtTTS_ISSN", "txtTTS_NamXuatBan", "txtTTS_ThangXuatBan", "dropTTS_LinhVuc", "dropTTS_LoaiSach", "txtTTS_SoTacGia", "txtTTS_SoTrangViet", "txtTTS_TongSoTrang", "txtTTS_TrichDanPubmed", "txtTTS_NoiDungMinhChung", "txtTTS_FileDinhKem", "tblInput_TTS_ThanhVien", "dropTTS_DeTai", "txtTTS_SoTacGiaTrongTruong"];
        edu.util.resetValByArrId(arrId);
        $("#tblInput_TTS_ThanhVien tbody").html("");
        $("#tblInput_TTS_ThanhVien_NgoaiTruong tbody").html("");
        edu.system.viewFiles("txtTTS_FileDinhKem", "");
        edu.util.viewValById("txtSach_NgoaiTruongKhac", "");
        edu.extend.getDetail_HS(me.genHTML_NhanSu);
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Sach
    -------------------------------------------*/
    getList_TTS: function () {
        var me = main_doc.ThongTinSach;

        //--Edit
        var obj_list = {
            'action': 'NCKH_Sach/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strThuocLinhVucNao_Id': "",
            'strNCKH_QuanLyDeTai_Id': '',
            'strPhanLoaiSach_Id': "",
            'strnckh_detai_thanhvien_id': edu.system.userId,
            'strVaiTro_Id': "",
            'strLoaiHocVi_Id': '',
            'strLoaiChucDanh_Id': '',
            'strTinhTrangXacNhan_Id': "",
            'strDonViCuaThanhVien_Id': '',
            'strLanXuatBan_Id': "",
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
                        me.dtSach = dtResult;
                    }
                    me.genTable_TTS(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_Sach/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_Sach/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TTS_Full: function () {
        var me = main_doc.ThongTinSach;
        var obj_list = {
            'action': 'NCKH_Sach/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearchModal_TTS_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': '',
            'strThuocLinhVucNao_Id': edu.util.getValById("dropSearchModal_TTS_LinhVuc"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strNCKH_QuanLyDeTai_Id': '',
            'strPhanLoaiSach_Id': "",
            'strnckh_detai_thanhvien_id': '',
            'strVaiTro_Id': "",
            'strLoaiHocVi_Id': '',
            'strLoaiChucDanh_Id': '',
            'strDonViCuaThanhVien_Id': '',
            'strLanXuatBan_Id': "",
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
                        me.dtSach_Full = dtResult;
                    }
                    me.genTable_TTS_Full(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_Sach/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_Sach/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Sach: function () {
        var me = main_doc.ThongTinSach;
        var obj_save = {
            'action': 'NCKH_Sach/ThemMoi',            
            
            'strId': '',
            'strTyLeThamGia': "",
            'strTenSach': edu.util.getValById("txtTTS_Ten"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTTS_LinhVuc"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strVaiTro_Id': "",
            'strNhaXuatBan': edu.util.getValById("txtTTS_NhaXuatBan"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropTTS_DeTai"),
            'strNamXuatBan': edu.util.getValById("txtTTS_NamXuatBan"),
            'dSoTacGia_n': edu.util.getValById("txtTTS_SoTacGia"),
            'dSoDongChuBien_n': "",
            'dSoTrangSach_n': edu.util.getValById("txtTTS_TongSoTrang"),
            'dSoTrangThamGiaViet_n': edu.util.getValById("txtTTS_SoTrangViet"),
            'strPhanLoaiSach_Id': edu.util.getValById("dropTTS_LoaiSach"),
            'strNamHoanThanh': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtTTS_NoiDungMinhChung"),
            'strMaSanPham': "",
            'strThangXuatBan': edu.util.getValById("txtTTS_ThangXuatBan"),
            'strChiSo_ISBN': edu.util.getValById("txtTTS_ISSN"),
            'dSoTinChi': edu.util.getValById("txtTTS_SoTinChi"),
            'strTap': "",
            'strLanXuatBan_Id': edu.util.getValById("dropTTS_LanXuatBan"),
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'iTrangThai': 1,
            'iThuTu': "",
            'strCanBoNhap_Id': edu.system.userId,
            'strDanhSachCacThanhVienNgoai': edu.util.getValById("txtSach_NgoaiTruongKhac"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById('txtTTS_SoTacGiaTrongTruong'),
            'strTenSachTrichDan': edu.util.getValById("txtTTS_TrichDanPubmed")
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        var strSach_Id = data.Id;
                        $("#tblInput_TTS_ThanhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_DeTai_ThanhVien(strNhanSu_Id, strSach_Id);
                        });
                        $("#tblInput_TTS_ThanhVien_NgoaiTruong tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_DeTai_ThanhVien(strNhanSu_Id, strSach_Id);
                        });
                        if (me.bcheckTimKiem) {
                            var x = $("#zoneFileDinhKemtxtTTS_FileDinhKem .btnDelUploadedFile");
                            for (var i = 0; i < x.length; i++) {
                                x[i].classList.remove("btnDelUploadedFile");
                                x[i].name = "";
                                x[i].classList.add("btnDeleteFileUptxtTTS_FileDinhKem");
                            }
                        }
                        edu.system.saveFiles("txtTTS_FileDinhKem", strSach_Id, "NCKH_Files");
                        edu.system.alert('Tiến trình thực hiện thành công!');
                    }
                    setTimeout(function () {
                        me.getList_TTS();
                    }, 3050);
                    me.setCheckChange("zone_input_TTS");
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
    update_Sach: function () {
        var me = main_doc.ThongTinSach;
        var obj_save = {
            'action': 'NCKH_Sach/CapNhat',
            
            'strId': me.strSach_Id,
            'strTyLeThamGia': "",
            'strTenSach': edu.util.getValById("txtTTS_Ten"),
            'strThuocLinhVucNao_Id': edu.util.getValById("dropTTS_LinhVuc"),
            'strNCKH_DeTai_ThanhVien_Id': "",
            'strVaiTro_Id': "",
            'strNhaXuatBan': edu.util.getValById("txtTTS_NhaXuatBan"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropTTS_DeTai"),
            'strNamXuatBan': edu.util.getValById("txtTTS_NamXuatBan"),
            'dSoTacGia_n': edu.util.getValById("txtTTS_SoTacGia"),
            'dSoDongChuBien_n': "",
            'dSoTrangSach_n': edu.util.getValById("txtTTS_TongSoTrang"),
            'dSoTrangThamGiaViet_n': edu.util.getValById("txtTTS_SoTrangViet"),
            'strPhanLoaiSach_Id': edu.util.getValById("dropTTS_LoaiSach"),
            'strNamHoanThanh': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtTTS_NoiDungMinhChung"),
            'strMaSanPham': "",
            'strThangXuatBan': edu.util.getValById("txtTTS_ThangXuatBan"),
            'strChiSo_ISBN': edu.util.getValById("txtTTS_ISSN"),
            'dSoTinChi': edu.util.getValById("txtTTS_SoTinChi"),
            'strTap': "",
            'strLanXuatBan_Id': edu.util.getValById("dropTTS_LanXuatBan"),
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'iTrangThai': 1,
            'iThuTu': "",
            'strCanBoNhap_Id': edu.system.userId,
            'strDanhSachCacThanhVienNgoai': edu.util.getValById("txtSach_NgoaiTruongKhac"),
            'dSoTacGiaTrongTruong_n': edu.util.getValById('txtTTS_SoTacGiaTrongTruong'),
            'strTenSachTrichDan': edu.util.getValById("txtTTS_TrichDanPubmed")
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    var strSach_Id = me.strSach_Id;
                    $("#tblInput_TTS_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strSach_Id);
                    });
                    $("#tblInput_TTS_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strSach_Id);
                    });
                    edu.system.saveFiles("txtTTS_FileDinhKem", strSach_Id, "NCKH_Files");
                    setTimeout(function () {
                        me.getList_TTS();
                    }, 3050);
                    me.setCheckChange("zone_input_TTS");
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
    getDetail_TTS: function (strId, strAction) {
        var me = main_doc.ThongTinSach;
        edu.util.objGetDataInData(strId, me.dtSach, "ID", me.viewEdit_TTS);
    },
    getDetail_TTS_Full: function (strId, strAction) {
        var me = main_doc.ThongTinSach;
        edu.util.objGetDataInData(strId, me.dtSach_Full, "ID", me.viewEdit_TTS);
    },
    delete_TTS: function (strIds) {
        var me = main_doc.ThongTinSach;
        var obj_delete = {
            'action': 'NCKH_Sach/Xoa',
            
            'strIds': strIds,
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
                    me.getList_TTS();
                }
                else {
                    obj = {
                        content: "NCKH_ThongTinSach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_ThongTinSach/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] GenHTML Sach
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TTS: function (data, iPager) {
        var me = main_doc.ThongTinSach;
        edu.util.viewHTMLById("lblTTS_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblTTS",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThongTinSach.getList_TTS()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENSACH) + "</span><br />";
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
        if (me.strSach_Id != '') {
            $("#" + jsonForm.strTable_Id + ' tr[id="' + me.strSach_Id + '"]').trigger("click");
        }
        /*III. Callback*/
    },
    genTable_TTS_Full: function (data, iPager) {
        var me = main_doc.ThongTinSach;
        var jsonForm = {
            strTable_Id: "tblModal_TTS",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThongTinSach.getList_TTS_Full()",
                iDataRow: iPager
            },
            aoColumns: [
                {
                    "mDataProp": "TENSACH"
                },
                {
                    "mDataProp": "PHANLOAISACH"
                },
                {
                    "mDataProp": "THUOCLINHVUCNAO"
                },
                {
                    "mDataProp": "DSTHANHVIEN_VAITRO"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btnChonTTS" data-dismiss="modal" id="' + aData.ID + '">Chọn sách</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_TTS: function (data) {
        var me = main_doc.ThongTinSach;
        var dt = data[0];
        edu.util.viewHTMLById("lblTTS_NguoiNhap", dt.CANBONHAP_Id);
        //View - Thong tin
        edu.util.viewValById("txtTTS_NhaXuatBan", dt.NHAXUATBAN);
        edu.util.viewValById("txtTTS_Ten", dt.TENSACH);
        edu.util.viewValById("txtTTS_ISSN", dt.CHISO_ISBN);
        edu.util.viewValById("txtTTS_NamXuatBan", dt.NAMXUATBAN);
        edu.util.viewValById("txtTTS_ThangXuatBan", dt.THANGXUATBAN);
        edu.util.viewValById("dropTTS_LinhVuc", dt.THUOCLINHVUCNAO_ID);
        edu.util.viewValById("dropTTS_LoaiSach", dt.PHANLOAISACH_ID);
        edu.util.viewValById("txtTTS_SoTacGia", dt.SOTACGIA_N);
        edu.util.viewValById("txtTTS_SoTrangViet", dt.SOTRANGTHAMGIAVIET_N);
        edu.util.viewValById("txtTTS_TongSoTrang", dt.SOTRANGSACH_N);
        edu.util.viewValById("txtTTS_TrichDanPubmed", dt.TENSACHTRICHDAN);
        edu.util.viewValById("dropTTS_LanXuatBan", dt.LANXUATBAN_ID);
        edu.util.viewValById("txtTTS_SoTinChi", dt.SOTINCHI);
        edu.util.viewValById("txtTTS_SoTacGiaTrongTruong", dt.SOTACGIATRONGTRUONG_N);
        //View - Noi dung minh chung
        edu.util.viewValById("txtTTS_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropTTS_DeTai", dt.NCKH_QUANLYDETAI_ID);

        $("#myModalLabel_TTS").html('<i class="fa fa-edit"></i> Chỉnh sửa sách');
    },
    viewDetail_TTS: function (data) {
        var me = main_doc.ThongTinSach;
        var dt = data[0];
        edu.util.viewHTMLById("lblTTS_NguoiNhap", dt.CANBONHAP_Id);
        //View - Thong tin
        edu.util.viewValById("txtTTS_NhaXuatBan", dt.NHAXUATBAN);
        edu.util.viewValById("txtTTS_Ten", dt.TENSACH);
        edu.util.viewValById("txtTTS_ISSN", dt.CHISO_ISBN);
        edu.util.viewValById("txtTTS_NamXuatBan", dt.NAMXUATBAN);
        edu.util.viewValById("txtTTS_ThangXuatBan", dt.THANGXUATBAN);
        edu.util.viewValById("dropTTS_LinhVuc", dt.THUOCLINHVUCNAO_ID);
        edu.util.viewValById("dropTTS_LoaiSach", dt.PHANLOAISACH_ID);
        edu.util.viewValById("txtTTS_SoTacGia", dt.SOTACGIA_N);
        edu.util.viewValById("txtTTS_SoTrangViet", dt.SOTRANGTHAMGIAVIET_N);
        edu.util.viewValById("txtTTS_TongSoTrang", dt.SOTRANGSACH_N);
        edu.util.viewValById("txtTTS_TrichDanPubmed", dt.TENSACHTRICHDAN);
        edu.util.viewValById("dropTTS_LanXuatBan", dt.LANXUATBAN_ID);
        edu.util.viewValById("txtTTS_SoTinChi", dt.SOTINCHI);
        edu.util.viewValById("txtTTS_SoTacGiaTrongTruong", dt.SOTACGIATRONGTRUONG_N);
        //View - Noi dung minh chung
        edu.util.viewValById("txtTTS_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropTTS_DeTai", dt.NCKH_QUANLYDETAI_ID);
        edu.util.viewValById("txtSach_NgoaiTruongKhac", dt.DANHSACHCACTHANHVIENNGOAI);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DeTai_ThanhVien: function (strNhanSu_Id, strSach_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var dTyLe = $("#tyle_" + strNhanSu_Id).val();
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strSach_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': dTyLe,
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
    getList_DeTai_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',            

            'strSanPham_Id': me.strSach_Id,
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
                    me.genTable_TTS_ThanhVien_NgoaiTruong(dtResult);
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
            
            'strSanPham_Id': me.strSach_Id,
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
        $("#tblInput_TTS_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 1) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "<td><select id='vaitro_" + data[i].ID + "'></select></td>";
            html += "<td><input class='form-control' id='tyle_" + data[i].ID + "' value='" + data[i].TYLETHAMGIA +"'></input></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_TTS_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.ThongTinSach;
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
        console.log(1111111);
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td><input class='form-control' id='tyle_" + strNhanSu_Id + "'></input></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_TTS_ThanhVien tbody").append(html);
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
            $("#tblInput_TTS_ThanhVien tbody").html("");
            $("#tblInput_TTS_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TTS_ThanhVien_NgoaiTruong: function (data) {
        var me = this;
        //3. create html
        $("#tblInput_TTS_ThanhVien_NgoaiTruong tbody").html("");
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
            $("#tblInput_TTS_ThanhVien_NgoaiTruong tbody").append(html);
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
        $("#tblInput_TTS_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.ThongTinSach;
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
            renderPlace: ["dropTTS_DeTai"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.ThongTinSach;
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
            renderPlace: ["dropSearchModal_TTS_DonVi"],
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
        me.getList_TTS();
    },
};