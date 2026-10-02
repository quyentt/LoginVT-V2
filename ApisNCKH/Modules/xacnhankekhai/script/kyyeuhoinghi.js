/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function KyYeuHoiNghi() { }
KyYeuHoiNghi.prototype = {
    dtKyYeu: [],
    strKyYeu_Id: "",
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrISSN: [],
    dtXacNhan: [],
    dtTinhTrang: [],

    init: function () {
        var me = this;
        //edu.system.loadToCombo_DanhMucDuLieu("NCKH.XNKK", "dropSearch_TinhTrang_KYHN", "", me.loadBtnXacNhan, "Tất cả tình trạng xác nhận", "HESO1");
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
            if (edu.util.checkValue(me.strKyYeu_Id)) {
                me.update_KYHN();
            }
            else {
                me.save_KYHN();
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
        $("#tblKYHN").delegate(".btnxacnhan_small", "click", function (e) {
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
                        me.getList_KYHN();
                    }, 500);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnXacNhan_KYHN").click(function () {
            $("#modal_XacNhan").modal("show");
            var strTenSanPham = edu.util.objGetDataInData(me.strKyYeu_Id, me.dtKyYeu, "ID")[0]["TENBAIBAO"];
            $("#txtTenSanPham").html(strTenSanPham);
            $("#txtNoiDungXacNhanSanPham").val("");
            edu.extend.getList_XacNhanSanPham(me.strKyYeu_Id, "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            edu.extend.save_XacNhanSanPham(me.strKyYeu_Id, strTinhTrang, strMoTa);
            setTimeout(function () {
                me.toggle_notify();
                me.getList_KYHN();
            }, 500);
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
        /*------------------------------------------
        --Discription: [2] Action Report
        --Order: 
        -------------------------------------------*/
        edu.system.getList_MauImport("zonebtnBaoCao_KYHN", function (addKeyValue) {
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_TuKhoa"));
            addKeyValue("iTrangThai", 1);
            addKeyValue("strCanBoNhap_Id", "");
            addKeyValue("strThuocLinhVucNao_Id", "");
            addKeyValue("strNCKH_QuanLyDeTai_Id", "");
            addKeyValue("strLoaiKyYeu_Id", "");
            addKeyValue("strNCKH_DeTai_ThanhVien_Id", edu.util.getValById("dropSearch_ThanhVien_KYHN"));
            addKeyValue("strVaitro_Id", "");
            addKeyValue("strDonViCuaThanhVien_Id", edu.util.getValById("dropSearch_DonViThanhVien_KYHN"));
            addKeyValue("strLoaiHocVi_Id", "");
            addKeyValue("strLoaiChucDanh_Id", "");
            addKeyValue("strTinhTrangXacNhan_Id", edu.util.getValById("dropSearch_TinhTrang_KYHN"));
            addKeyValue("strDaoTao_CoCauToChuc_Id", edu.util.getValById("dropSearch_DonViThanhVien_KYHN"));
        });
        $("#dropSearch_DonViThanhVien_KYHN").on("select2:select", function () {
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
        //edu.system.uploadFiles(["txtKYHN_FileDinhKem"]);
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        me.getList_KYHN();
        me.getList_DeTai();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.LVNC, "dropKYHN_LinhVuc");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LKY", "dropKYHN_LoaiKyYeu");
        $("#dropSearch_LinhVuc").val("").trigger("change");
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTQG,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        me.getList_CoCauToChuc();
        me.getList_HS();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_KYHN");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KYHN");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KYHN");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_KYHN"),
            'strNCKH_DeTai_ThanhVien_Id': edu.util.getValById("dropSearch_ThanhVien_KYHN"),
            'strVaitro_Id': "",
            'strDonViCuaThanhVien_Id': edu.util.getValById("dropSearch_DonViThanhVien_KYHN"),
            'strLoaiHocVi_Id': "",
            'strLoaiChucDanh_Id': "",
            'strTinhTrangXacNhan_Id': edu.util.getValById("dropSearch_TinhTrang_KYHN"),
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
                        me.save_KYHN_ThanhVien(strNhanSu_Id);
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
                    }, 50);
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
                    edu.system.alert("Cập nhật thành công!");
                    var strKyYeu_Id = me.strKyYeu_Id;
                    me.getList_KYHN();
                    $("#tblInput_KYHN_ThanhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_KYHN_ThanhVien(strNhanSu_Id, strKyYeu_Id);
                    });
                    $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_KYHN_ThanhVien(strNhanSu_Id, strKyYeu_Id);
                    });
                    edu.system.saveFiles("txtKYHN_FileDinhKem", strKyYeu_Id, "NCKH_Files");
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
            
            'strIds': strId
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
            colPos: {
                center: [2, 4],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {

                        return '<a class="btnEdit poiter" id="' + aData.ID + '">' + edu.util.returnEmpty(aData.TENBAIBAO) + '</a>';
                    }
                },
                {
                    "mDataProp": "CHISO_ISBN"
                },
                {
                    "mDataProp": "THUOCLINHVUCNAO"
                },
                {
                    "mDataProp": "NAMCONGBO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="txtGT_FileDinhKem' + aData.ID + '"></div>';
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
            edu.system.viewFiles("txtGT_FileDinhKem" + data[i].ID, data[i].ID, "NCKH_Files");
        }
        /*III. Callback*/
    },
    getDetail_KYHN: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtKyYeu, "ID", me.viewEdit_KYHN);
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
        //View - Thanh vien tham gia
    },
    /*------------------------------------------
    --Discription: [2] AccessDB KYHN_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_KYHN_ThanhVien: function (strNhanSu_Id, strKyYeu_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',
            

            'strSanPham_Id': strKyYeu_Id,
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'dTyLeThamGia': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
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
        $("#tblInput_KYHN_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
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
            'strTuKhoaText': "",
            'dTuKhoaNumber': -1,
            'strNCKH_DeCuong_Id': "",
            'strCapQuanLy_Id': "",
            'strDaoTao_CoCauToChuc_Id': "",
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
        main_doc.KyYeuHoiNghi.dtXacNhan = data;
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
            renderPlace: ["dropSearch_DonViThanhVien_KYHN"],
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_KYHN"),
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
            renderPlace: ["dropSearch_ThanhVien_KYHN"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
};