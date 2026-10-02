/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function GiaiThuong() { }
GiaiThuong.prototype = {
    dtGiaiTuong: [],
    strGiaiThuong_Id: '',
    dtVaiTro: [],
    arrNhanSu_Id: [],
    dtXacNhan: [],

    init: function () {
        var me = main_doc.GiaiThuong;
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
            me.getList_GT();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GT();
            }
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
       --Discription: [1] Action TapChiQuocTe
       --Order:
       -------------------------------------------*/
        $("#btnSave_GT").click(function () {
            if (edu.util.checkValue(me.strGiaiThuong_Id)) {
                me.update_GT();
            }
            else {
                me.save_GT();
            }
        });
        $("#tblGT").delegate(".btnEdit", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strGiaiThuong_Id = strId;
                me.getList_GiaiThuong_ThanhVien();
                me.getDetail_GT(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblGT");
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
        $("#tblGT").delegate(".btnxacnhan_small", "click", function (e) {
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
                        me.getList_GT();
                    }, 500);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnXacNhan_GT").click(function () {
            $("#modal_XacNhan").modal("show");
            var strTenSanPham = edu.util.objGetDataInData(me.strGiaiThuong_Id, me.dtGiaiTuong, "ID")[0]["HINHTHUC"];
            $("#txtTenSanPham").html(strTenSanPham);
            $("#txtNoiDungXacNhanSanPham").val("");
            edu.extend.getList_XacNhanSanPham(me.strGiaiThuong_Id, "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            edu.extend.save_XacNhanSanPham(me.strGiaiThuong_Id, strTinhTrang, strMoTa);
            setTimeout(function () {
                me.toggle_notify();
                me.getList_GT();
            }, 500);
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_GT();
            }
        });
        $("#btnSearch_GT").click(function () {
            me.getList_GT();
        });
        $("#dropSearch_DonViThanhVien_GiaiThuong").on("select2:select", function () {
            me.getList_HS();
        });
        $(".btnSearch_GiaiThuong_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_GiaiThuong_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GiaiThuong_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2] Action Report
        --Order: 
        -------------------------------------------*/
        edu.system.getList_MauImport("zonebtnBaoCao_GT", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'iTrangThai': 1,
                'strCanBoNhap_Id': "",
                'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropSearch_DeTai_GiaiThuong"),
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
                'strnckh_detai_thanhvien_id': edu.util.getValById("dropSearch_ThanhVien_GiaiThuong"),
                'strVaiTro_Id': "",
                'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
                'strLoaiHocVi_Id': "",
                'strLoaiChucDanh_Id': "",
                'strCapKhenThuong_Id': edu.util.getValById("dropSearch_CapQuanLy_GiaiThuong"),
                'strTinhTrangXacNhan_Id': edu.util.getValById("dropSearch_TinhTrang_GiaiThuong"),
                'strNhanSu_TDKT_KeHoach_Id': edu.util.getValById("dropSearch_NamDanhGia_DT"),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
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
        var me = main_doc.GiaiThuong;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        me.getList_HS();
        me.getList_DeTai();
        me.getList_CoCauToChuc();
        me.getList_NamDanhGia();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKT", "dropSearch_GT_CapKhenThuong, dropSearch_CapQuanLy_GiaiThuong");
        setTimeout(function () {
            me.rewrite();
        }, 300);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_GT");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_GT");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_GT");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.GiaiThuong;
        //
        me.strGiaiThuong_Id = "";
        var arrId = ["txtGT_HinhThuc", "txtGT_NoiDung", "txtGT_Nam", "txtGT_SoNguoi", "txtGT_NoiDungMinhChung", "dropGT_DeTai", "txtGT_SoQuyetDinh", "dropSearch_GT_CapKhenThuong"];
        edu.system.viewFiles("txtGT_FileDinhKem", "");
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_GT: function () {
        var me = main_doc.GiaiThuong;
        var obj_list = {
            'action': 'NCKH_GiaiThuong/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'iTrangThai': 1,
            'strCanBoNhap_Id': "",
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropSearch_DeTai_GiaiThuong"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
            'strnckh_detai_thanhvien_id': edu.util.getValById("dropSearch_ThanhVien_GiaiThuong"),
            'strVaiTro_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_CapQuanLy_GiaiThuong"),
            'strTinhTrangXacNhan_Id': edu.util.getValById("dropSearch_TinhTrang_GiaiThuong"),
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
                        me.dtGiaiTuong = dtResult;
                    }
                    me.genTable_GT(dtResult, iPager);
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
        //--Edit
        var obj_save = {
            'action': 'NCKH_GiaiThuong/ThemMoi',

            'strId': "",
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropGT_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaiTro_Id': "",
            'strHinhThuc': edu.util.getValById("txtGT_HinhThuc"),
            'strNoiDungGiaiThuong': edu.util.getValById("txtGT_NoiDung"),
            'strNamTangThuong': edu.util.getValById("txtGT_Nam"),
            'dSoGioQuyDoiDuocTinh_n': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtGT_NoiDungMinhChung"),
            'strMaSanPham': "",
            'dSoNguoiThamGia_n': edu.util.getValById("txtGT_SoNguoi"),
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_GT_CapKhenThuong"),
            'strSoQuyetDinh': edu.util.getValById("txtGT_SoQuyetDinh"),
            'strLoaiDoiTuong_Id': "",
            'iTrangThai': 1,
            'iThuTu': 0,
            'strCanBoNhap_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        var strGiaiThuong_Id = data.Id;
                        $("#tblInput_GiaiThuong_ThanhVien tbody tr").each(function () {
                            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                            me.save_GiaiThuong_ThanhVien(strNhanSu_Id, strGiaiThuong_Id);
                        });
                        if (me.bcheckTimKiem) {
                            var x = $("#zoneFileDinhKemtxtGT_FileDinhKem .btnDelUploadedFile");
                            for (var i = 0; i < x.length; i++) {
                                x[i].classList.remove("btnDelUploadedFile");
                                x[i].name = "";
                                x[i].classList.add("btnDeleteFileUptxtGT_FileDinhKem");
                            }
                        }
                        edu.system.saveFiles("txtGT_FileDinhKem", strGiaiThuong_Id, "NCKH_Files");
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                    }

                    setTimeout(function () {
                        me.getList_VBSC();
                        edu.extend.getDetail_HS(me.genHTML_NhanSu);
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("NCKH_GiaiThuong/ThemMoi (er): " + JSON.stringify(er), "w");
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
        //--Edit
        var obj_save = {
            'action': 'NCKH_GiaiThuong/CapNhat',

            'strId': me.strGiaiThuong_Id,
            'strNCKH_QuanLyDeTai_Id': edu.util.getValById("dropGT_DeTai"),
            'strNCKH_DeTai_ThanhVien_Id': edu.system.userId,
            'strVaiTro_Id': "",
            'strHinhThuc': edu.util.getValById("txtGT_HinhThuc"),
            'strNoiDungGiaiThuong': edu.util.getValById("txtGT_NoiDung"),
            'strNamTangThuong': edu.util.getValById("txtGT_Nam"),
            'dSoGioQuyDoiDuocTinh_n': "",
            'strFileMinhChung': "",
            'strThongTinMinhChung': edu.util.getValById("txtGT_NoiDungMinhChung"),
            'strMaSanPham': "",
            'dSoNguoiThamGia_n': edu.util.getValById("txtGT_SoNguoi"),
            'strCapKhenThuong_Id': edu.util.getValById("dropSearch_GT_CapKhenThuong"),
            'strSoQuyetDinh': edu.util.getValById("txtGT_SoQuyetDinh"),
            'strLoaiDoiTuong_Id': "",
            'iTrangThai': 1,
            'iThuTu': 0,
            'strCanBoNhap_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    $("#tblInput_GiaiThuong_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_GiaiThuong_ThanhVien(strNhanSu_Id);
                    });
                    me.getList_GT();
                    setTimeout(function () {
                        edu.system.saveFiles("txtGT_FileDinhKem", me.strGiaiThuong_Id, "NCKH_Files");
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_GiaiThuong/CapNhat: " + data.Message);
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
        //--Edit
        var obj_delete = {
            'action': 'NCKH_GiaiThuong/Xoa',
            
            'strIds': strIds
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
    /*------------------------------------------
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_GT: function (data, iPager) {
        var me = main_doc.GiaiThuong;
        edu.util.viewHTMLById("lblGT_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblGT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiaiThuong.getList_GT()",
                iDataRow: iPager
            },
            colPos: {
                fix: [0],
                center: [0, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {

                        return '<a class="btnEdit poiter" id="' + aData.ID + '">' + edu.util.returnEmpty(aData.NOIDUNGGIAITHUONG) + '</a>';
                    }
                },
                {
                    "mDataProp": "HINHTHUC"
                },
                {
                    "mDataProp": "CAPKHENTHUONG_TEN"
                },
                {
                    "mDataProp": "NAMTANGTHUONG"
                },
                {
                    "mDataProp": "SONGUOITHAMGIAVAOCONGTRINH_N"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="txtGT_FileDinhKem' + aData.ID + '"></div>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var row = "";
                        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((me.dtXacNhan.length -1) * 40) + 'px">';
                        for (var i = 0; i < me.dtXacNhan.length; i++) {
                            if (me.dtXacNhan[i].MA == "XNKKCHUAKHAI") continue;
                            row += '<div id="' + me.dtXacNhan[i].ID + '" name="' + aData.HINHTHUC + '" sanpham_id="' + aData.ID +'" class="btn-large btnxacnhan_small">';
                            row += '<a class="btn" title="' + me.dtXacNhan[i].TEN +'"><i style="' + me.dtXacNhan[i].THONGTIN2 + '" class="' + me.dtXacNhan[i].THONGTIN1 + '"></i></a>';
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
                },
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].ID);
            edu.system.viewFiles("txtGT_FileDinhKem" + data[i].ID, data[i].ID, "NCKH_Files");
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
        edu.util.viewValById("txtGT_DoiTuongKhen", "");
        edu.util.viewValById("txtGT_SoNguoi", dt.SONGUOITHAMGIAVAOCONGTRINH_N);
        edu.util.viewValById("txtGT_NoiDungMinhChung", dt.THONGTINMINHCHUNG);
        edu.util.viewValById("dropSearch_GT_CapKhenThuong", dt.CAPKHENTHUONG_ID);
        edu.system.viewFiles("txtGT_FileDinhKem", dt.ID, "NCKH_Files");
        edu.util.viewValById("txtGT_SoQuyetDinh", dt.SOQUYETDINH);
        edu.util.viewValById("dropGT_DeTai", dt.NCKH_QUANLYDETAI_ID);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_GiaiThuong_ThanhVien: function (strNhanSu_Id, strGiaiThuong_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var dTyLe = $("#tyle_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',

            'strSanPham_Id': strGiaiThuong_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': dTyLe,
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
    getList_GiaiThuong_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',

            'strSanPham_Id': me.strGiaiThuong_Id,
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
                    me.genTable_GiaiThuong_ThanhVien(dtResult);
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
    delete_GiaiThuong_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',
            
            'strSanPham_Id': me.strGiaiThuong_Id,
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
                    me.getList_GiaiThuong_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_GiaiThuong_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_GiaiThuong_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_GiaiThuong_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_GiaiThuong_ThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].HOTEN + "</span> - <span>" + data[i].MACANBO + "</span></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_GiaiThuong_ThanhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender);
            edu.util.viewValById(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id) {
        var me = main_doc.GiaiThuong;
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
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_GiaiThuong_ThanhVien tbody").append(html);
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
            $("#tblInput_GiaiThuong_ThanhVien tbody").html("");
            $("#tblInput_GiaiThuong_ThanhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
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
            'strNhanSu_TDKT_KeHoach_Id': '',
            'strDaoTao_CoCauToChuc_Id': "",
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
            renderPlace: ["dropGT_DeTai", "dropSearch_DeTai_GiaiThuong"],
            title: "Chọn đề tài"
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropSearchModal_TTS_DonVi", "dropSearch_DonViThanhVien_GiaiThuong"],
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
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_GiaiThuong"),
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
            renderPlace: ["dropSearch_ThanhVien_GiaiThuong"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = thish;
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
        main_doc.GiaiThuong.dtXacNhan = data;
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
        this.getList_GT();
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