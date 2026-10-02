/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function GiaiThuong() { }
GiaiThuong.prototype = {
    dtGiaiTuong: [],
    strGiaiThuong_Id:'',
    dtVaiTro: [],
    arrValid_GiaiThuong: [],

    init: function () {
        var me = main_doc.GiaiThuong;
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            if (me.checkChange("zone_input_GT")) {
                edu.system.confirm("Bạn có muốn lưu lại dữ liệu vừa nhập không?");
                $("#btnYes").click(function (e) {
                    me.toggle_form();
                    $("#btnSave_GT").trigger("click");
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
            me.getList_GT();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GT();
            }
        });
        $("#btnSave_GT").click(function () {
            //var valid = edu.util.validInputForm(me.arrValid_GiaiThuong);
            if (true) {
                if (edu.util.checkValue(me.strGiaiThuong_Id)) {
                    me.update_GT();
                }
                else {
                    me.save_GT();
                }
            }
        });
        $("#tblGT").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strGiaiThuong_Id = strId;
                me.getDetail_GT(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblGT");
                edu.system.getList_RangBuoc("NCKH_SP_GIAITHUONG", strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblGT").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GT(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_GT();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_GT();
        });
        $("#dropSearch_NamDanhGia_DT").on("select2:select", function () {
            me.rewrite();
            me.getList_GT();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.GiaiThuong;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        edu.system.uploadFiles(["txtGT_FileDinhKem"]);
        me.toggle_form();
        me.getList_DeTai();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong");
        setTimeout(function () {
            me.rewrite();
        }, 300);
        me.arrValid_GiaiThuong = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtGT_NoiDung", "THONGTIN1": "EM" },
            { "MA": "txtGT_SoQuyetDinh", "THONGTIN1": "EM" },
            { "MA": "txtGT_SoNguoi", "THONGTIN1": "EM" },
            { "MA": "txtGT_Nam", "THONGTIN1": "EM" },
            { "MA": "txtGT_Thang", "THONGTIN1": "EM" },
            { "MA": "txtGT_Thang", "THONGTIN1": "EM" },
            { "MA": "txtGT_HinhThuc", "THONGTIN1": "EM" },
            { "MA": "dropSearch_GT_CapKhenThuong", "THONGTIN1": "EM" }
        ];
        me.getList_NamDanhGia();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_GT");
    },
    toggle_form: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_GT");
        setTimeout(function () {
            me.setCheckChange("zone_input_GT");
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
        edu.util.toggle_overide("zone-bus", "zone_notify_GT");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.GiaiThuong;
        $("#myModalLabel_GiaiThuong").html('.. <i class="fa fa-pencil"></i> Kê khai giải thưởng');
        me.strGiaiThuong_Id = "";
        var arrId = ["txtGT_HinhThuc", "txtGT_NoiDung", "txtGT_Nam","txtGT_Thang", "txtGT_SoNguoi", "txtGT_NoiDungMinhChung", "dropGT_DeTai", "txtGT_SoQuyetDinh", "dropSearch_GT_CapKhenThuong"];
        edu.system.viewFiles("txtGT_FileDinhKem", "");
        edu.util.resetValByArrId(arrId);
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });

        $(".comment_lydo").remove();
    },
    getList_GT: function () {
        var me = main_doc.GiaiThuong;
        var obj_list = {
            'action': 'NCKH_GiaiThuong/LayDanhSach',            

            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_QuanLyDeTai_Id': "",
            'strnckh_detai_thanhvien_id': edu.system.userId,
            'strVaiTro_Id': "",
            'strDonViCuaThanhVien_Id': "",
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strCapKhenThuong_Id': "",
            'strTinhTrangXacNhan_Id': "",
            'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
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
                        iPager = data.Pager;
                        me.dtGiaiTuong = dtResult;
                    }
                    me.genTable_GT(dtResult, iPager);
                }
                else {
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_GiaiThuong/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GT_Full: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TapChiQuocGia/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_QuanLyDeTai_Id': "",
            'strnckh_detai_thanhvien_id': "",
            'strVaiTro_Id': "",
            'strDonViCuaThanhVien_Id': "",
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strCapKhenThuong_Id': "",
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
                    edu.system.alert("NCKH_GiaiThuong/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NCKH_GiaiThuong/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_GT: function () {
        var me = main_doc.GiaiThuong;
        var obj_save = {
            'action': 'NCKH_GiaiThuong/ThemMoi',            

            'strId': "",
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropGT_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': "",
            'strHinhThuc': edu.util.getValById("txtGT_HinhThuc"),
            'strNoiDungGiaiThuong': edu.util.getValById("txtGT_NoiDung"),
            'strNamTangThuong': edu.util.getValById("txtGT_Nam"),
            'strThangTangThuong': edu.util.getValById("txtGT_Thang"),
            'dSoGioQuyDoiDuocTinh_n': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtGT_NoiDungMinhChung"),
            'strMaSanPham': "",
            'dSoNguoiThamGia_n': edu.util.getValById("txtGT_SoNguoi"),
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_GT_CapKhenThuong"),
            'strSoQuyetDinh': edu.util.getValById("txtGT_SoQuyetDinh"),
            'strLoaiDoiTuong_Id': "",
            'dTrangThai': 1,
            'dThuTu': 0,
            'strCanBoNhap_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_GT();
                    edu.system.saveFiles("txtGT_FileDinhKem", data.Id, "NCKH_Files");
                    me.save_GT_ThanhVien(edu.system.userId, data.Id);
                    edu.system.alert('Tiến trình thực hiện thành công!');
                    setTimeout(function () {
                        me.getList_GT();
                    }, 3050);
                    me.setCheckChange("zone_input_GT");
                }
                else {
                    edu.system.alert( obj_save.action + ": " + data.Message);
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
    update_GT: function () {
        var me = main_doc.GiaiThuong;
        var obj_save = {
            'action': 'NCKH_GiaiThuong/CapNhat',            

            'strId': me.strGiaiThuong_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropGT_DeTai"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaiTro_Id': "",
            'strHinhThuc': edu.util.getValById("txtGT_HinhThuc"),
            'strNoiDungGiaiThuong': edu.util.getValById("txtGT_NoiDung"),
            'strNamTangThuong': edu.util.getValById("txtGT_Nam"),
            'strThangTangThuong': edu.util.getValById("txtGT_Thang"),
            'dSoGioQuyDoiDuocTinh_n': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtGT_NoiDungMinhChung"),
            'strMaSanPham': "",
            'dSoNguoiThamGia_n': edu.util.getValById("txtGT_SoNguoi"),
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_GT_CapKhenThuong"),
            'strSoQuyetDinh': edu.util.getValById("txtGT_SoQuyetDinh"),
            'strLoaiDoiTuong_Id': "",
            'dTrangThai': 1,
            'dThuTu': 0,
            'strCanBoNhap_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    edu.system.saveFiles("txtGT_FileDinhKem", me.strGiaiThuong_Id, "NCKH_Files");
                    setTimeout(function () {
                        me.getList_GT();
                    }, 3050);
                    me.setCheckChange("zone_input_GT");
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
    getDetail_GT: function (strId, strAction) {
        var me = main_doc.GiaiThuong;
        edu.util.objGetDataInData(strId, me.dtGiaiTuong, "ID", me.viewEdit_GT);
    },
    delete_GT: function (strIds) {
        var me = main_doc.GiaiThuong;
        var obj_delete = {
            'action': 'NCKH_GiaiThuong/Xoa',
            
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
                    me.getList_GT();
                }
                else {
                    obj = {
                        content: "NCKH_GiaiThuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_GiaiThuong/Xoa (er): " + JSON.stringify(er),
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
    genTable_GT: function (data, iPager) {
        var me = main_doc.GiaiThuong;
        edu.util.viewHTMLById("lblGT_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblGT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiaiThuong.getList_GT()",
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
                        html += '<span>' + edu.util.returnEmpty(aData.NOIDUNGGIAITHUONG) + "</span><br />";
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
        if (me.strGiaiThuong_Id != '') {
            $("#" + jsonForm.strTable_Id + ' tr[id="' + me.strGiaiThuong_Id + '"]').trigger("click");
        }
        /*III. Callback*/
    },
    viewEdit_GT: function (data) {
        var me = main_doc.GiaiThuong;
        //View - Thong tin
        var dt = data[0];
        edu.util.viewHTMLById("lblGT_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        edu.util.viewValById("txtGT_HinhThuc", dt.HINHTHUC);
        edu.util.viewValById("txtGT_NoiDung", dt.NOIDUNGGIAITHUONG);
        edu.util.viewValById("txtGT_Nam", dt.NAMTANGTHUONG);
        edu.util.viewValById("txtGT_Thang", dt.THANGTANGTHUONG);
        edu.util.viewValById("txtGT_DoiTuongKhen", "");
        edu.util.viewValById("txtGT_SoNguoi", dt.SONGUOITHAMGIAVAOCONGTRINH_N);
        edu.util.viewValById("txtGT_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropSearch_GT_CapKhenThuong", dt.CAPKHENTHUONG_ID);
        edu.system.viewFiles("txtGT_FileDinhKem", dt.ID, "NCKH_Files");
        edu.util.viewValById("txtGT_SoQuyetDinh", dt.SOQUYETDINH);//chưa có số quyết định trả về
        edu.util.viewValById("dropGT_DeTai", dt.NCKH_QUANLYDETAI_ID);
        $("#myModalLabel_GiaiThuong").html('<i class="fa fa-edit"></i> Chỉnh sửa giải thưởng');
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
            'strTinhTrangXacNhan_Id': "",
            'strPhanLoaiDeTai_Id': "",
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
            renderPlace: ["dropGT_DeTai"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_GT_ThanhVien: function (strNhanSu_Id, strGiaiThuong_Id) {
        var me = this;
        var obj_notify;
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',            

            'strSanPham_Id': strGiaiThuong_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_NamDanhGia_DT'),
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
        me.getList_GT();
    },
};