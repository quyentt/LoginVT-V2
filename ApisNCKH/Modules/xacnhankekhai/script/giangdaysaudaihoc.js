/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function GiangDayDaiHoc() { }
GiangDayDaiHoc.prototype = {
    dtGDDH: [],
    dtVaiTro: [],
    strGDDH_Id: "",
    arrGiangVien_GD_Id: [],
    arrSinhVien_Id: [],
    strPhanLoai_Id: "",
    dtXacNhan: [],
    dtTinhTrang: [],

    init: function () {
        var me = this;
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.XNKK", "dropSearch_TinhTrang_GDDH", "", me.loadBtnXacNhan, "Tất cả tình trạng xác nhận", "HESO1");
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        //edu.system.page_load();
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
            me.getList_GDDH();
        });
        $("#btnSearchGDDH_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_GDDH();
            }
        });
        $("#btnSearch_HHD").click(function () {
            me.getList_GDDH();
        });
        /*------------------------------------------
        --Discription: [1] Action DeTai
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_GDDH").click(function () {
            me.getList_GDDH();
        });
        $("#btnSave_GDDH").click(function () {
            if (edu.util.checkValue(me.strGDDH_Id)) {
                me.update_GDDH();
            }
            else {
                me.save_GDDH();
            }
        });
        $("#tblGDDH").delegate(".btnEdit", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            edu.util.setOne_BgRow(strId, "tblGDDH");
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.rewrite();
                me.strGDDH_Id = strId;
                me.getDetail_GDDH(strId, constant.setting.ACTION.EDIT);
                me.getList_GiangVien_GD();
                me.getList_SinhVien();
                edu.system.viewFiles("txtGDDH_FileDinhKem", strId, "NCKH_Files");
                edu.util.setOne_BgRow(strId, "tblGDDH");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblGDDH").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GDDH(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblGDDH").delegate(".btnxacnhan_small", "click", function (e) {
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
                        me.getList_GDDH();
                    }, 500);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnXacNhan_GDSDH").click(function () {
            $("#modal_XacNhan").modal("show");
            var strTenSanPham = edu.util.objGetDataInData(me.strGDDH_Id, me.dtGDDH, "ID")[0]["TENDETAI_GIANGDAY"];
            $("#txtTenSanPham").html(strTenSanPham);
            $("#txtNoiDungXacNhanSanPham").val("");
            edu.extend.getList_XacNhanSanPham(me.strGDDH_Id, "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            edu.extend.save_XacNhanSanPham(me.strGDDH_Id, strTinhTrang, strMoTa);
            setTimeout(function () {
                me.toggle_notify();
                me.getList_GDDH();
            }, 500);
        });
        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $(".btnSearchGDDH_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_GDDH_GiangVien_GD").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiangVien_GD(strNhanSu_Id);
                });
            }
        });

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchGDDH_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_GDDH_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });
        
        edu.system.getList_MauImport("zonebtnBaoCao_GDSDH", function (addKeyValue) {
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_TuKhoa"));
            addKeyValue("strDonViCuaThanhVien_Id", edu.util.getValById("dropSearch_DonViThanhVien_GDDH"));
            addKeyValue("strThanhVien_Id", edu.util.getValById("dropSearch_ThanhVien_GDDH"));
            addKeyValue("strPhanLoai_Id", main_doc.GiangDayDaiHoc.strPhanLoai_Id);
            addKeyValue("strNguoiThucHien_Id", "");
            addKeyValue("strTinhTrangXacNhan_Id", edu.util.getValById("dropSearch_TinhTrang_GDDH"));
            addKeyValue("strDaoTao_CoCauToChuc_Id", edu.util.getValById("dropSearch_DonViThanhVien_GDDH"));
        });
        $("#dropSearch_DonViThanhVien_GDDH").on("select2:select", function () {
            me.getList_HS();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        edu.util.toggle("box-sub-search");
        var obj = {
            strMaBangDanhMuc: "NCKH.VTHDGD",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_PhanLoai);
        //edu.system.uploadFiles(["txtGDDH_FileDinhKem"]);
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/setTimeout(function () {
            me.getList_GDDH();
        }, 500);
        me.getList_CoCauToChuc();
        me.getList_HS();
    },

    toggle_GDDH: function () {
        edu.util.toggle_overide("zone-bus", "zone_GDDH");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_GDDH");
        $("#txtGDDH_Ten").focus();
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_GDDH");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.GiangDayDaiHoc;
        //
        me.strGDDH_Id = "";
        me.arrSinhVien_Id = [];
        me.arrGiangVien_GD_Id = [];
        var arrId = ["txtGDDH_TenDetai", "txtGDDH_TenLopDay","txtGDDH_DenThang", "txtGDDH_TuThang", "txtGDDH_NamNghiemThu", "txtGDDH_MoTa"];
        edu.util.resetValByArrId(arrId);
        edu.system.viewFiles("txtGDDH_FileDinhKem", "");
        $("#tblInput_GDDH_GiangVien_GD tbody").html("");
        $("#tblInput_GDDH_SinhVien tbody").html("");
        //table
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
        //

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
        main_doc.GiangDayDaiHoc.dtXacNhan = data;
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
    --Discription: [1] AcessDB GetList_GDDH
    -------------------------------------------*/
    save_GDDH: function () {
        var me = main_doc.GiangDayDaiHoc;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/ThemMoi',
            

            'strId': "",
            'strTenDeTai_GiangDay': edu.util.getValById("txtGDDH_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtGDDH_NamNghiemThu"),
            'strThoiGianBatDau': edu.util.getValById("txtGDDH_TuThang"),
            'strThoiGianKetThuc': edu.util.getValById("txtGDDH_DenThang"),
            'dSoTacGia_n': edu.util.getValById("txtGDDH_TenLopDay"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {

                        var strGDDH_Id = data.Id;

                        $("#tblInput_GDDH_GiangVien_GD tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_GiangVien_GD(strNhanSu_Id, strGDDH_Id);
                        });
                        $("#tblInput_GDDH_SinhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_SinhVien(strNhanSu_Id, strGDDH_Id);
                        });
                        edu.system.saveFiles("txtGDDH_FileDinhKem", strGDDH_Id, "NCKH_Files");
                    }
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                    });
                    setTimeout(function () {
                        me.getList_GDDH();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_GDDH: function () {
        var me = main_doc.GiangDayDaiHoc;
        //--3. --> save
        var obj_save = {
            'action': 'NCKH_SP_HuongDan_GiangDay/CapNhat',
            

            'strId': me.strGDDH_Id,
            'strTenDeTai_GiangDay': edu.util.getValById("txtGDDH_TenDetai"),
            'strNamNghiemThu': edu.util.getValById("txtGDDH_NamNghiemThu"),
            'strThoiGianBatDau': edu.util.getValById("txtGDDH_TuThang"),
            'strThoiGianKetThuc': edu.util.getValById("txtGDDH_DenThang"),
            'dSoTacGia_n': edu.util.getValById("txtGDDH_TenLopDay"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strGDDH_Id = me.strGDDH_Id;
                    me.getList_GDDH();

                    $("#tblInput_GDDH_GiangVien_GD tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_GiangVien_GD(strNhanSu_Id, strGDDH_Id);
                    });
                    $("#tblInput_GDDH_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_SinhVien(strNhanSu_Id, strGDDH_Id);
                    });
                    edu.system.saveFiles("txtGDDH_FileDinhKem", strGDDH_Id, "NCKH_Files");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GDDH: function () {
        var me = main_doc.GiangDayDaiHoc;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HuongDan_GiangDay/LayDanhSach',
            

            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_GDDH"),
            'strThanhVien_Id': edu.util.getValById("dropSearch_ThanhVien_GDDH"),
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_GDDH"),
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strTinhTrangXacNhan_Id': edu.util.getValById("dropSearch_TinhTrang_GDDH"),
            'strPhanLoai_Id': me.strPhanLoai_Id,
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
                        iPager = data.Pager;
                        me.dtGDDH = dtResult;
                    }
                    me.genTable_GDDH(dtResult, iPager);
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
    getDetail_GDDH: function (strId, strAction) {
        var me = main_doc.GiangDayDaiHoc;
        edu.util.objGetDataInData(strId, me.dtGDDH, "ID", me.viewEdit_GDDH);
    },
    delete_GDDH: function (strId) {
        var me = main_doc.GiangDayDaiHoc;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HuongDan_GiangDay/Xoa',
            
            'strIds': strId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_GDDH();
                }
                else {
                    obj = {
                        content: "NCKH_SP_HuongDan_GiangDay/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_SP_HuongDan_GiangDay/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [1] AcessDB GenHTML_GDDH
    -------------------------------------------*/
    genTable_GDDH: function (data, iPager) {
        var me = main_doc.GiangDayDaiHoc;
        edu.util.viewHTMLById("lblGDDH_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblGDDH",
            aaData: data,
            colPos: {
                center: [2, 3],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {

                        return '<a class="btnEdit poiter" id="' + aData.ID + '">' + edu.util.returnEmpty(aData.TENDETAI_GIANGDAY) + '</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="italic">' + edu.util.returnEmpty(aData.THOIGIANBATDAU) + '-' + edu.util.returnEmpty(aData.THOIGIANKETTHUC) + '</span>';
                    }
                },
                {
                    "mDataProp": "NAMNGHIEMTHU"
                },
                {
                    "mDataProp": "GIANGVIEN_HD_GD"////
                },
                {
                    "mDataProp": "NOIDUNG_HD_GD"////
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="txtGDDH_FileDinhKem' + aData.ID + '"></div>';
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        var row = "";
                        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((me.dtXacNhan.length - 1) * 40) + 'px">';
                        for (var i = 0; i < me.dtXacNhan.length; i++) {
                            if (me.dtXacNhan[i].MA == "XNKKCHUAKHAI") continue;
                            row += '<div id="' + me.dtXacNhan[i].ID + '" name="' + aData.TENDETAI_GIANGDAY + '" sanpham_id="' + aData.ID + '" class="btn-large btnxacnhan_small">';
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
            edu.system.viewFiles("txtGDDH_FileDinhKem" + data[i].ID, data[i].ID, "NCKH_Files");
        }
        /*III. Callback*/
    },
    viewEdit_GDDH: function (data) {
        var me = main_doc.GiangDayDaiHoc;
        var dtGDDH = data[0];
        //View - Thong tin
        edu.util.viewValById("txtGDDH_TenDetai", dtGDDH.TENDETAI_GIANGDAY);
        edu.util.viewValById("strNamNghiemThu", dtGDDH.NAMNGHIEMTHU);
        edu.util.viewValById("txtGDDH_DenThang", dtGDDH.THOIGIANKETTHUC);
        edu.util.viewValById("txtGDDH_TuThang", dtGDDH.THOIGIANBATDAU);
        edu.util.viewValById("dropPhanLoai", dtGDDH.PHANLOAI_ID);
        edu.util.viewValById("txtGDDH_NamNghiemThu", dtGDDH.NAMNGHIEMTHU);
        edu.util.viewValById("txtGDDH_TenLopDay", dtGDDH.MOTA);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien_GD: function () {
        var me = main_doc.GiangDayDaiHoc;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strGDDH_Id
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + "(er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_GiangVien_GD: function (strNhanSu_Id, strGDDH_Id) {
        var me = main_doc.GiangDayDaiHoc;
        var strNoiDung = $("#thoigian_" + strNhanSu_Id).val();
        var strThoiGian = $("#noidung_" + strNhanSu_Id).val();
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': strGDDH_Id,
            'strGiangVien_Ids': strNhanSu_Id,
            'strNoiDung': strNoiDung,
            'strThoiGian': strThoiGian,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        //
        edu.system.makeRequest({
            success: function (data) {
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_GiangDayDaiHoc/ThemMoi: " + data.Message);
                //}
                //
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
    delete_GiangVien_GD: function (strIds) {
        var me = main_doc.GiangDayDaiHoc;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_GiangVien_GD/Xoa',
            
            'strIds': strIds,
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //Xóa đi để load lại ds
                    //me.arrGiangVien_GD_Id = [];
                    me.getList_GiangVien_GD(me.strId);
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrGiangVien_GD_Id = [];
        $("#tblInput_GDDH_GiangVien_GD tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].GIANGVIEN_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HODEM + " " + data[i].TEN + "</span> - <span>" + data[i].MASO + "</span></td>";
            html += "<td>" + data[i].THOIGIAN +"</input></td>";
            html += "<td>" + data[i].NOIDUNGGIANGDAY +"</td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_GDDH_GiangVien_GD tbody").append(html);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        //[1] add to arrGiangVien_GD_Id
        if (edu.util.arrEqualVal(me.arrGiangVien_GD_Id, strNhanSu_Id)) {
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
            me.arrGiangVien_GD_Id.push(strNhanSu_Id);
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
        html += "<td><input class='form-control' id='thoigian_" + strNhanSu_Id + "' value=''></input></td>";
        html += "<td><input class='form-control' id='noidung_" + strNhanSu_Id + "' value=''></input></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_GDDH_GiangVien_GD tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrGiangVien_GD_Id, strNhanSu_Id);
        if (me.arrGiangVien_GD_Id.length === 0) {
            $("#tblInput_GDDH_GiangVien_GD tbody").html("");
            $("#tblInput_GDDH_GiangVien_GD tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = main_doc.GiangDayDaiHoc;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HDGD_SinhVien/LayDanhSach',
            
            'strNCKH_SP_HD_GD_Id': me.strGDDH_Id
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult);
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
    save_SinhVien: function (strGDDH_Id) {
        var me = main_doc.GiangDayDaiHoc;
        if (me.arrSinhVien_Id.length == 0) return;
        //--Edit
        var obj_save = {
            'action': 'NCKH_SP_HDGD_SinhVien/ThemMoi',
            

            'strId': '',
            'strNCKH_SP_HD_GD_Id': strGDDH_Id,
            'strSinhVien_Ids': me.arrSinhVien_Id.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                //if (data.Success) {
                //    edu.system.alert("Thêm mới thành công!");
                //}
                //else {
                //    edu.system.alert("NCKH_GiangDayDaiHoc/ThemMoi: " + data.Message);
                //}
                
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
    delete_SinhVien: function (strIds) {
        var me = main_doc.GiangDayDaiHoc;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien',
            
            'strSinhVien_Ids': strIds,
            'strNCKH_SP_HD_GD_Id': me.strGDDH_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_SinhVien(me.strId);
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrGiangVien_GD_Id = [];
        $("#tblInput_GDDH_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].LATHANHVIENCUATRUONG == 0) continue;
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HODEM + " " + data[i].TEN + " - " + data[i].MASO; + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_GDDH_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].ID);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.GiangDayDaiHoc;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
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
        html += "<td class='td-center'><a id='rmnhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_GDDH_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.GiangDayDaiHoc;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_GDDH_SinhVien tbody").html("");
            $("#tblInput_GDDH_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML Combox
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_PhanLoai: function (data) {
        var me = main_doc.GiangDayDaiHoc;
        for (var i = 0; i < data.length; i++) {
            console.log(i);
            if (data[i].MA == "GIANGDAY") {
                me.strPhanLoai_Id = data[i].ID;
            }
        }
    },
    getList_CoCauToChuc: function () {
        var me = this;
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
            renderPlace: ["dropSearch_DonViThanhVien_GDDH"],
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
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_GDDH"),
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
            error: function (er) { },
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
            renderPlace: ["dropSearch_ThanhVien_GDDH"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
};