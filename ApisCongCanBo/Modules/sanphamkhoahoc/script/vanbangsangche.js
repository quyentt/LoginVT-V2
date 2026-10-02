/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function VanBangSangChe() { }
VanBangSangChe.prototype = {
    dtVanBangSC: [],
    strVanBangSC_Id:'',
    dtVaiTro: [],
    arrValid_VBSC: [],

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
            if (me.checkChange("zone_input_vbsc")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_VBSC").trigger("click");
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
            me.getList_VBSC();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_VBSC();
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
        $("#btnSave_VBSC").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_VBSC);
            if (true) {
                if (edu.util.checkValue(me.strVanBangSC_Id)) {
                    me.update_VBSC();
                }
                else {
                    me.save_VBSC();
                }
            }
        });
        $("#tblVBSC").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblVBSC");
                me.toggle_form();
                me.strVanBangSC_Id = strId;
                me.getDetail_VBSC(strId, constant.setting.ACTION.EDIT);
                edu.system.viewFiles("txtVBSC_FileDinhKem", strId, "NCKH_Files");
                edu.system.viewFiles("txtVBSC_ThongTinDinhKemQD", strId + "_QD", "NCKH_Files");
                edu.system.getList_RangBuoc("NCKH_SP_VBSC", strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblVBSC").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.util.setOne_BgRow(strId, "tblVBSC");
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_VBSC(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_NamDanhGia_DT").on("select2:select", function () {
            me.rewrite();
            me.getList_VBSC();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtVBSC_FileDinhKem"]);
        edu.system.uploadFiles(["txtVBSC_ThongTinDinhKemQD"]);
        me.toggle_form();
        me.getList_DeTai();
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_VBSC = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtVBSC_TenVanBang", "THONGTIN1": "EM" },
            { "MA": "txtVBSC_NamCapVanBang", "THONGTIN1": "EM" },
            { "MA": "txtVBSC_ThangCapVanBang", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_vbsc");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_vbsc");
        setTimeout(function () {
            me.setCheckChange("zone_input_vbsc");
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
        edu.util.toggle_overide("zone-bus", "zone_notify_vbsc");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strVanBangSC_Id = "";
        $("#myModalLabel_VBSC").html('.. <i class="fa fa-pencil"></i> Kê khai văn bằng sáng chế');
        var arrId = ["txtVBSC_SoQD", "txtBVSC_NgayKyQuyetDinh", "txtVBSC_DonViCap", "txtBVSC_NoiCap", "txtVBSC_NoiDungMinhChung", "dropVBSC_DeTai", "txtVBSC_TenVanBang", "txtVBSC_NoiDungVanBang", "txtVBSC_NamCapVanBang", "txtVBSC_Ma"];
        edu.system.viewFiles("txtVBSC_FileDinhKem");
        edu.system.viewFiles("txtVBSC_ThongTinDinhKemQD");
        edu.util.resetValByArrId(arrId);
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
    },
    getList_Impoet: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'Sys_Import/Import',            

            'strPath': strPath,
            'strMa': "CHUN.IMDM",
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(data.Message, "s");
                }
                else {
                    edu.system.alert(data.Message, "s");
                }                
            },
            error: function (er) {                
                edu.system.alert("CMS_SVQT/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_VBSC: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_VanBangSangChe/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strNCKH_QuanLyDeTai_Id': "",
            'strNCKH_DETAI_THANHVIEN_Id': edu.system.userId,
            'strCanboNhap_Id': "",
            'strVaitro_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
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
                        me.dtVanBangSC = dtResult;
                    }
                    me.genTable_VBSC(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_VBSC: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_VanBangSangChe/ThemMoi',            

            'strId': "",
            'strNhanSu_ThongTinQD_Id': "",
            'strSoQuyetDinh': edu.util.getValById("txtVBSC_SoQD"),
            'strNgayQuyetDinh': edu.util.getValById("txtBVSC_NgayKyQuyetDinh"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': "",
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': "",
            'strNgayHetHieuLuc': "",
            'iTrangThai': 1,
            'iThuTu': 1,
            'strDonViCap': edu.util.getValById("txtVBSC_DonViCap"),
            'strNoiCap': edu.util.getValById("txtBVSC_NoiCap"),
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtVBSC_NoiDungMinhChung"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropVBSC_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaiTro_Id': "",
            'strTenVanBang': edu.util.getValById("txtVBSC_TenVanBang"),
            'strNoiDungVanBang': edu.util.getValById("txtVBSC_NoiDungVanBang"),
            'strNamCapVanBang': edu.util.getValById("txtVBSC_NamCapVanBang"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strThangCapVanBang': "",
            'strCANBONHAP_Id': edu.system.userId,
            'strMaSanPham': edu.util.getValById("txtVBSC_Ma"),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.confirm('Tiến trình thực hiện thành công!');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                    });
                    edu.system.saveFiles("txtVBSC_FileDinhKem", data.Id, "NCKH_Files");
                    edu.system.saveFiles("txtVBSC_ThongTinDinhKemQD", data.Id + "_QD", "NCKH_Files");
                    me.save_DeTai_ThanhVien(data.Id);                    
                    setTimeout(function () {
                        me.getList_VBSC();
                    }, 3050);
                    me.setCheckChange("zone_input_vbsc");
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_VBSC: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_VanBangSangChe/CapNhat',            

            'strId': me.strVanBangSC_Id,
            'strNhanSu_ThongTinQD_Id': "",
            'strSoQuyetDinh': edu.util.getValById("txtVBSC_SoQD"),
            'strNgayQuyetDinh': edu.util.getValById("txtBVSC_NgayKyQuyetDinh"),
            'strNguoiKyQuyetDinh': "",
            'strNgayHieuLuc': "",
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': "",
            'strNgayHetHieuLuc': "",
            'iTrangThai': 1,
            'iThuTu': 1,
            'strDonViCap': edu.util.getValById("txtVBSC_DonViCap"),
            'strNoiCap': edu.util.getValById("txtBVSC_NoiCap"),
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtVBSC_NoiDungMinhChung"),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropVBSC_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaiTro_Id': "",
            'strTenVanBang': edu.util.getValById("txtVBSC_TenVanBang"),
            'strNoiDungVanBang': edu.util.getValById("txtVBSC_NoiDungVanBang"),
            'strNamCapVanBang': edu.util.getValById("txtVBSC_NamCapVanBang"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strThangCapVanBang': "",
            'strCANBONHAP_Id': edu.system.userId,
            'strMaSanPham': edu.util.getValById("txtVBSC_Ma"),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    edu.system.saveFiles("txtVBSC_FileDinhKem", me.strVanBangSC_Id, "NCKH_Files");
                    edu.system.saveFiles("txtVBSC_ThongTinDinhKemQD", me.strVanBangSC_Id + "_QD", "NCKH_Files");
                    setTimeout(function () {
                        me.getList_VBSC();
                    }, 3050);
                    me.setCheckChange("zone_input_vbsc");
                }
                else {
                    edu.system.alert("NCKH_VanBangSangChe/CapNhat: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_VanBangSangChe/CapNhat (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_VBSC: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtVanBangSC, "ID", me.viewEdit_VBSC);
    },
    delete_VBSC: function (strIds) {
        var me = this;
        var obj_delete = {
            'action': 'NCKH_VanBangSangChe/Xoa',
            
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
                    me.getList_VBSC();
                }
                else {
                    obj = {
                        content: "NCKH_VanBangSangChe/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_VanBangSangChe/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DeTai_ThanhVien: function (strVanBangSC_Id) {
        var me = this;
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strVanBangSC_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strThanhVien_Id': edu.system.userId,
            'strVaiTro_Id': '',
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
    /*------------------------------------------
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_VBSC: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblVBSC_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblVBSC",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.VanBangSangChe.getList_VBSC()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.TENVANBANG) + "</span><br />";
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
        if (me.strVanBangSC_Id != '') {
            $("#" + jsonForm.strTable_Id + ' tr[id="' + me.strVanBangSC_Id + '"]').trigger("click");
        }
        /*III. Callback*/
    },
    viewEdit_VBSC: function (data) {
        var me = this;
        var dt = data[0];
        //View - Thong tin
        edu.util.viewValById("txtVBSC_TenVanBang", dt.TENVANBANG);
        edu.util.viewValById("txtVBSC_DonViCap", dt.DONVICAP);
        edu.util.viewValById("txtBVSC_NoiCap", dt.NOICAP);
        edu.util.viewValById("txtVBSC_Ma", dt.MASANPHAM);
        edu.util.viewValById("txtVBSC_SoQD", dt.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtBVSC_NgayKyQuyetDinh", dt.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtVBSC_NamCapVanBang", dt.NAMCAPVANBANG);
        edu.util.viewValById("txtVBSC_ThangCapVanBang", dt.THANGCAPVANBANG);
        edu.util.viewValById("txtVBSC_NoiDungVanBang", dt.NOIDUNGVANBANG);
        //View - Noi dung minh chung
        edu.util.viewValById("txtVBSC_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropVBSC_DeTai", dt.NCKH_QUANLYDETAI_ID);
        $("#myModalLabel_VBSC").html('<i class="fa fa-edit"></i> Chỉnh sửa văn bằng sáng chế');
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
            renderPlace: ["dropVBSC_DeTai"],
            title: "Chọn đề tài"
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
        me.getList_VBSC();
    },
};