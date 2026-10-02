/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 11/10/2018
----------------------------------------------*/
function DeTai() { }
DeTai.prototype = {
    dtDeTai: [],
    dtDeTai_Full: [],
    strDeTai_Id: "",
    dtVaiTro: [],
    arrNhanSu_Id: [],
    arrDVHT_Id: [],
    bcheckTimKiem: false,
    arrValid_DeTai: [],

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
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_DeTai();
        });
        $("#btnSearchDeTai_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [1] Action DeTai
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_DeTai").click(function () {
            me.getList_DeTai();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DeTai();
            }
        });
        $("#btnSave_DeTai").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DeTai);
            if (edu.util.checkValue(me.strDeTai_Id)) {
                me.update_DeTai();
            }
            else {
                me.save_DeTai();
            }
        });
        $("#btnReWrite").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DeTai);
            if (edu.util.checkValue(me.strDeTai_Id)) {
                me.update_DeTai();
            }
            else {
                me.save_DeTai();
            }
            me.rewrite();

        });
        $("#tblDeTai").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.rewrite();
                me.strDeTai_Id = strId;
                me.getDetail_DeTai(strId);
                me.getList_DeTai_ThanhVien();
                edu.util.setOne_BgRow(strId, "tblDeTai");
                edu.system.viewFiles("txtDeTai_FileDinhKem", strId, "NCKH_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDeTai").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeTai(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
       --Discription: [3-3] Action Nguon Kinh Phi
       --Order:
       -------------------------------------------*/
        
        $("#txtSearchModal_DeTai_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DeTai_Full();
            }
        });
        $("#dropSearch_DonViThanhVien_DT").on("select2:select", function () {
            me.getList_HS();
        });

        $(".btnSearch_NhanSuTrongTruong").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
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
        $("#tblInput_DMDeTai_ThanhVienTrongTruong,#tblInput_DMDeTai_ThanhVien_NgoaiTruong").delegate('.btnDeletePoiter', 'click', function () {
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
        /*------------------------------------------
        --Discription: [4] Action TCQT_ThanhVien_NgoaiTruong
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect_NgoaiTruong', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu_NgoaiTruong(strNhanSu_Id);
        });
        $(".btnSearchDMDeTai_NhanSu_NgoaiTruong").click(function () {
            edu.extend.genModal_NhanSu_NgoaiTruong();
            edu.extend.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        $(".btnCapMaDeTai").click(function () {
            me.CapMaDeTai();
        });
       
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        me.getList_HS();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        me.getList_DeTai();
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NCKH.VTDT,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGetList_VaiTro);
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NCKH.PLDT, "dropDeTai_PhanLoai, dropSearch_DeTai_Loai");
        var obj = {
            code: constant.setting.CATOR.NCKH.TTDT,
            renderPlace: "rdDeTai_TinhTrang",
            nameRadio: "rdDeTai_TinhTrang",
            title: ""
        };
        me.arrValid_DeTai = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDeTai_TenTiengViet", "THONGTIN1": "EM" },
            { "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" },
           // { "MA": "txtDeTai_Ma", "THONGTIN1": "EM" },
        ];
        edu.system.loadToRadio_DanhMucDuLieu(obj);
        edu.system.uploadFiles(["txtDeTai_FileDinhKem"]);
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.rewrite();
        }, 300);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.TTDT", "", "", me.cbGetList_TTDT);
       
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_detai");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_detai");
        $("#txtDeTai_Ten").focus();
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_detai");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.bcheckTimKiem = false;
        me.strDeTai_Id = "";
        me.arrNhanSu_Id = [];
        me.arrDVHT_Id = [];
        var arrId = ["txtDeTai_TenTiengViet", "txtDeTai_Ma", "txtDeTai_TenTiengAnh", "txtDeTai_ToChucCoDeTai", "dropDeTai_PhanLoai",
            "dropDeTai_CapQuanLy", "dropDeTai_LinhVuc", "txtDeTai_TuThang", "txtDeTai_DenThang", "dropDeTai_SanPhamUD",
            "txtTCQG_NoiDungMinhChung", "txtDeTai_SanPhamKhac", "txtDeTai_MucTieu", "txtDeTai_SP_MoTa", "dropDeTai_SP_Loai", "txtDeTai_SP_Ten", "dropDeTai_DVHT_QuocGia",
            "txtDeTai_DVHT_Ten", "dropDeTai_KinhPhi_DonViTienTe", "txtDeTai_KinhPhi_SoTien", "dropDeTai_KinhPhi_Nguon", "txtDeTai_TDDT_TienConLai", "txtDeTai_TDDT_TienThanhToan", "txtDeTai_TDDT_ThoiGian", "txtDeTai_TongSoTacGia"];
        edu.util.resetValByArrId(arrId);
        edu.util.resetRadio("name", "rdDeTai_TinhTrang");
        //table
        //don vi hop tac
        $("#tblInput_DeTai_DVHT tbody").html("");
        $("#tblInput_DeTai_KinhPhi tbody").html("");
        $("#tblInput_DeTai_TDDT tbody").html("");
        $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody").html("");
        $("#tblInput_DMDeTai_ThanhVien_NgoaiTruong tbody").html("");
        $("#tblInput_DeTai_SanPhamUngDung tbody").html("");
        edu.system.viewFiles("txtDeTai_FileDinhKem", "");
        $("#tblQDNT_DT tbody").html("");
        
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DeTai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_DanhMucDeTai/LayDanhSach',

            
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strPhanLoaiDeTai_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
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
                        me.dtDeTai = dtResult;
                    }
                    me.genTable_DeTai(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_DanhMucDeTai/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("NCKH_DanhMucDeTai/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DeTai: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lbDMDeTai_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblDeTai",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeTai.getList_DeTai()",
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
                        html += '<span>' + "Tên đề tài: "+ edu.util.returnEmpty(aData.TENDETAI) + "</span><br />";
                        html += '<span>' + "Mã đề tài: " + edu.util.returnEmpty(aData.MADETAI) + "</span><br />";
                        html += '<span>' + "Phân loại: " + edu.util.returnEmpty(aData.PHANLOAIDETAI_TEN) + "</span><br />";
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
    getDetail_DeTai: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtDeTai, "ID", me.viewEdit_DeTai);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Save DeTai/DonViHopTac/ThanhVienThamGia
    -------------------------------------------*/
    CapMaDeTai: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_DanhMucDeTai/CapMa_NCKH_SP_DanhMucDeTai',


            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_SP_DanhMucDeTai_Id': me.strDeTai_Id,
            'strNguoiThucHien_Id': edu.system.userId
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

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_DeTai: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_DanhMucDeTai/ThemMoi',


            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMaDeTai': "",
            'strTenDeTai': edu.util.getValById("txtDeTai_TenTiengViet"),
            'strTenDeTaiTiengAnh': edu.util.getValById("txtDeTai_TenTiengAnh"),
            'strPhanLoaiDeTai_Id': edu.util.getValById("dropDeTai_PhanLoai"),
            'strMoTa': edu.util.getValById("txtDeTai_MoTa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeTai_Id = data.Id;
                    $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strDeTai_Id);
                    });
                    $("#tblInput_DMDeTai_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DMDetai_ThanhVienNgoaiTruong(strNhanSu_Id, strDeTai_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtDeTai_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtDeTai_FileDinhKem");
                        }
                    }
                    edu.system.saveFiles("txtDeTai_FileDinhKem", strDeTai_Id, "NCKH_Files");
                    edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                        $("#txtDeTai_TenTiengViet").focus();
                    });
                    setTimeout(function () {
                        me.getList_DeTai();
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_DanhMucDeTai/ThemMoi: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("NCKH_DanhMucDeTai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_DeTai: function () {
        var me = this;
        var obj_save = {
            'action': 'NCKH_DanhMucDeTai/CapNhat',


            'strId': me.strDeTai_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMaDeTai': "",
            'strTenDeTai': edu.util.getValById("txtDeTai_TenTiengViet"),
            'strTenDeTaiTiengAnh': edu.util.getValById("txtDeTai_TenTiengAnh"),
            'strPhanLoaiDeTai_Id': edu.util.getValById("dropDeTai_PhanLoai"),
            'strMoTa': edu.util.getValById("txtDeTai_MoTa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strDeTai_Id = me.strDeTai_Id;
                    $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeTai_ThanhVien(strNhanSu_Id, strDeTai_Id);
                    });
                    $("#tblInput_DMDeTai_ThanhVien_NgoaiTruong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DMDetai_ThanhVienNgoaiTruong(strNhanSu_Id, strDeTai_Id);
                    });
                    if (me.bcheckTimKiem) {
                        var x = $("#zoneFileDinhKemtxtDeTai_FileDinhKem .btnDelUploadedFile");
                        for (var i = 0; i < x.length; i++) {
                            x[i].classList.remove("btnDelUploadedFile");
                            x[i].name = "";
                            x[i].classList.add("btnDeleteFileUptxtDeTai_FileDinhKem");
                        }
                    }
                    edu.system.saveFiles("txtDeTai_FileDinhKem", strDeTai_Id, "NCKH_Files");
                    $("#btnYes").click(function (e) {
                        me.rewrite();
                        $('#myModalAlert').modal('hide');
                        $("#txtDeTai_TenTiengViet").focus();
                    });
                    setTimeout(function () {
                        me.getList_DeTai();
                    }, 50);
                }
                else {
                    edu.system.alert("NCKH_DanhMucDeTai/CapNhat: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("NCKH_DanhMucDeTai/CapNhat (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB Update_DeTai
    -------------------------------------------*/
    viewEdit_DeTai: function (data) {
        var me = this;
        var dtDeTai = data[0];
        //View - Thong tin
        edu.util.viewValById("txtDeTai_Ma", dtDeTai.MADETAI);
        edu.util.viewValById("txtDeTai_TenTiengViet", dtDeTai.TENDETAI);
        edu.util.viewValById("txtDeTai_TenTiengAnh", dtDeTai.TENDETAITIENGANH);

        edu.util.viewValById("dropDeTai_PhanLoai", dtDeTai.PHANLOAIDETAI_ID);
        edu.util.viewValById("txtDeTai_MoTa", dtDeTai.MOTA);
        

    },
    /*------------------------------------------
    --Discription: [1] AccessDB GetDetail DeTai/DonViHopTac/ThanhVienThamGia
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [1] AcessDB Delete_DeTai
    -------------------------------------------*/
    delete_DeTai: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_DanhMucDeTai/Xoa',

            'strIds': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                    me.getList_DeTai();
                }
                else {
                    obj = {
                        content: "NCKH_DanhMucDeTai/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DanhMucDeTai/Xoa (er): " + JSON.stringify(er),
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
    save_DeTai_ThanhVien: function (strNhanSu_Id, strDeTai_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',


            'strSanPham_Id': strDeTai_Id,
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
    getList_DeTai_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',


            'strSanPham_Id': me.strDeTai_Id,
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
                    me.genTable_DMDetai_ThanhVien(dtResult);
                    me.genTable_DMDetai_ThanhVienNgoaiTruong(dtResult);
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
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',

            'strSanPham_Id': me.strDeTai_Id,
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

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DMDetai_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody").html("");
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
            $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
            var placeRender = "vaitro_" + data[i].ID;
            me.genCombo_VaiTro(placeRender, data[i].VAITRO_ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.DeTai;
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
        $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody").append(html);
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
            $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody").html("");
            $("#tblInput_DMDeTai_ThanhVienTrongTruong tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [2] AccessDB TCQT_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DMDetai_ThanhVienNgoaiTruong: function (strNhanSu_Id, strDeTai_Id) {
        var me = this;
        var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NCKH_ThanhVien/ThemMoi',


            'strSanPham_Id': strDeTai_Id,
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
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DMDetai_ThanhVienNgoaiTruong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_ThanhVien/LayDanhSach',


            'strSanPham_Id': me.strDeTai_Id,
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
                    me.genTable_DMDetai_ThanhVien(dtResult);
                    me.genTable_DMDetai_ThanhVienNgoaiTruong(dtResult);
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
    delete_DMDetai_ThanhVienNgoaiTruong: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NCKH_ThanhVien/Xoa',

            'strSanPham_Id': me.strDeTai_Id,
            'strThanhVien_Id': strNhanSu_Id,
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
                    me.getList_DeTai_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "NCKH_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    genTable_DMDetai_ThanhVienNgoaiTruong: function (data) {
        var me = this;
        //3. create html
        $("#tblInput_DMDeTai_ThanhVien_NgoaiTruong tbody").html("");
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
            $("#tblInput_DMDeTai_ThanhVien_NgoaiTruong tbody").append(html);
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
        $("#tblInput_DMDeTai_ThanhVien_NgoaiTruong tbody").append(html);
        //5. create data danhmucvaitro
        var placeRender = "vaitro_" + strNhanSu_Id;
        me.genCombo_VaiTro(placeRender);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    cbGetList_VaiTro: function (data, iPager) {
        var me = main_doc.DeTai;
        me.dtVaiTro = data;
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
                order: "unorder",
                default_val: default_val
            },
            renderPlace: [place],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + place).select2();
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/

    getList_CoCauToChuc: function () {
        var me = main_doc.DeTai;
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
            renderPlace: ["dropSearchModal_DeTai_DonVi", "dropSearch_DonViThanhVien_DT"],
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
            'pageSize': 1000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DT"),
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
            renderPlace: ["dropSearch_ThanhVienDangKy_DT"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
};