/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
/*
1. getList_KhoanThu -> genTable_KhoanThu
2. alertLuu_KhoanThu -> save_TaoSo_HoaDon -> alertLuuThanhCong_KhoanThu -> getList_HoaDon_ChuaIn
3. save_TaoLo_HoaDon -> getList_LoHoaDon -> genTable_LoHoaDon
4. getTemplatePhieu -> getList_HoaDonTheoLo -> fixThreading -> genMauHoaDon_DT -> getData_HoaDon_DT -> genData_HoaDon_DT -> printf_LoHoaDon -> save_TinhTrangHoaDon
*/
function SinhVienNoTien() {};
SinhVienNoTien.prototype = {

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        edu.system.pageSize_default = 10;
        edu.extend.addNotify();
        me.getList_DMLKT();
        me.getList_TrangThaiSV();
        //me.getList_KhoanThu_ChuaXuat();

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();

        //me.genHTML_NoiDung_BienLai();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();

        $("#btnSearch_NT").click(function (e) {
            e.stopImmediatePropagation();
            me.bSelectAllPages = false;
            me.getList_KhoanThu_ChuaXuat(edu.util.getValById('txtSearch_NT'));
        });
        $("#txtSearch_NT").keypress(function (e) {
            if (e.which === 13) {
                e.stopImmediatePropagation();
                me.bSelectAllPages = false;
                me.getList_KhoanThu_ChuaXuat(edu.util.getValById('txtSearch_NT'));
            }
        });

        $('#dropSearch_HeDaoTao_NT').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_KhoaDaoTao_NT').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_ChuongTrinh_NT').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_HocKy_NT').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            var strValue = this.value;
            if (!edu.util.checkValue(strValue)) {
                $("#dropSearch_KyThucHien_NT").parent().hide();
            } else {
                $("#dropSearch_KyThucHien_NT").parent().show();
            }
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {
            e.stopImmediatePropagation();
            me.resetCombobox(this);
        });
        $('#dropSearch_SoLuong_NT').on('select2:select', function (e) {
            var iSoLuong = $("#dropSearch_SoLuong_NT").val();
            edu.system.iGioiHanLuong = iSoLuong;
        });
        
        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_NT_All", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbLKT_NT").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate("#chkSelectAll_RutTien", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            console.log(checked_status);
            $("#tbldata_KhoanThu_ChuaXuat_NT input").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate("#chkSelectAll_GuiEmail_NT", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            me.bSelectAllPages = checked_status;
            $("#tbldata_KhoanThu_ChuaXuat_NT tbody .ckbGuiEmail_NT").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbGuiEmail_NT", "click", function (e) {
            e.stopImmediatePropagation();
            if (!this.checked) {
                me.bSelectAllPages = false;
                $("#chkSelectAll_GuiEmail_NT").prop('checked', false);
            }
        });
        $("#btnGuiEmail_NT").click(function (e) {
            e.stopImmediatePropagation();
            me.openModal_ChonPhamVi();
        });
        $("#btnPhamVi_DaChon_NT").click(function (e) {
            e.stopImmediatePropagation();
            $("#myModalChonPhamVi_NT").modal('hide');
            me.openModal_GuiEmail('daChon');
        });
        $("#btnPhamVi_TatCa_NT").click(function (e) {
            e.stopImmediatePropagation();
            $("#myModalChonPhamVi_NT").modal('hide');
            me.openModal_GuiEmail('tatCa');
        });
        $("#btnConfirmGuiEmail_NT").click(function (e) {
            e.stopImmediatePropagation();
            me.send_Email_BaoNo();
        });
        $("#btnXoaNo_NT").click(function (e) {
            e.stopImmediatePropagation();
            me.openModal_ChonPhamVi_XoaNo();
        });
        $("#btnPhamVi_DaChon_XoaNo_NT").click(function (e) {
            e.stopImmediatePropagation();
            $("#myModalChonPhamVi_XoaNo_NT").modal('hide');
            me.startXoaNo('daChon');
        });
        $("#btnPhamVi_TatCa_XoaNo_NT").click(function (e) {
            e.stopImmediatePropagation();
            $("#myModalChonPhamVi_XoaNo_NT").modal('hide');
            me.startXoaNo('tatCa');
        });
        $(document).delegate(".btnPrevPagePreview_NT", "click", function (e) {
            e.stopImmediatePropagation();
            if ($(this).prop('disabled')) return;
            var iPage = parseInt($(this).attr('data-page'), 10);
            if (!isNaN(iPage)) {
                me.iCurrentPagePreview = iPage;
                me.renderPreviewPage();
            }
        });
        $(document).delegate("#dropPageSize_GuiEmail_NT", "change", function (e) {
            e.stopImmediatePropagation();
            me.iPageSizePreview = parseInt(this.value, 10) || 100;
            me.iCurrentPagePreview = 1;
            me.renderPreviewPage();
        });

        //Xuất báo cáo//Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_SVNT", function (addKeyValue) {
            var strNguoiDangNhap_Id = edu.system.userId;
            var strMaTruong = "KCNTTTN";
            var strNguoiThucHien_Id = edu.util.getValCombo("dropSearch_NguoiThu_NT");
            var strDAOTAO_HeDaoTao_Id = edu.util.getValById("dropSearch_HeDaoTao_NT");
            var strKhoaDaoTao_Id = edu.util.getValById("dropSearch_KhoaDaoTao_NT");
            var strDaoTao_ToChucCT_Id = edu.util.getValById("dropSearch_ChuongTrinh_NT");
            var strLopHoc_Id = edu.util.getValById("dropSearch_Lop_NT");
            var strDAOTAO_ThoiGianDaoTao = edu.util.getValById("dropSearch_HocKy_NT");
            var strPhamViApDung = (edu.util.getValById("dropSearch_HocKy_NT") == "") ? "" : edu.util.getValById("dropSearch_KyThucHien_NT");
            var strKhoaQuanLy_Id = edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD");
            var strNamNhapHoc = edu.util.getValCombo("dropSearch_NamNhapHoc_IHD");
            var strTuNgay = edu.util.getValById("txtSearch_TuNgay_NT");
            var strDenNgay = edu.util.getValById("txtSearch_DenNgay_NT");
            var strTuKhoa = edu.util.getValById("txtSearch_NT");
            var strTAICHINH_CacKhoanThu_Ids = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_NT');
            var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
            if (strTAICHINH_CacKhoanThu_Ids.length == 0) {
                edu.system.alert('Vui lòng chọn khoản thu!', 'w');
                return false;
            }
            if (strTrangThaiNguoiHoc_Id === '') {
                edu.system.alert('Vui lòng chọn trạng thái!', 'w');
                return false;
            }
            //
            addKeyValue("strNguoiDangNhap_Id", strNguoiDangNhap_Id);
            addKeyValue("strMaTruong", strMaTruong);
            addKeyValue("strHeDaoTao_Id", strDAOTAO_HeDaoTao_Id);
            addKeyValue("strKhoaDaoTao_Id", strKhoaDaoTao_Id);
            addKeyValue("strChuongTrinh_Id", strDaoTao_ToChucCT_Id);
            addKeyValue("strLopQuanLy_Id", strLopHoc_Id);
            addKeyValue("strThoiGianDaoTao_Id", strDAOTAO_ThoiGianDaoTao);
            addKeyValue("strPhamViApDung", strPhamViApDung);
            addKeyValue("strTuNgay", strTuNgay);
            addKeyValue("strDenNgay", strDenNgay);
            addKeyValue("strTuKhoa", strTuKhoa);
            addKeyValue("strKhoaQuanLy_Id", strKhoaQuanLy_Id);
            addKeyValue("strNamNhapHoc", strNamNhapHoc);
            for (var i = 0; i < strTAICHINH_CacKhoanThu_Ids.length; i++) {
                addKeyValue("strTAICHINH_CacKhoanThu_Ids", strTAICHINH_CacKhoanThu_Ids[i]);
            }
            addKeyValue("strTrangThaiNguoiHoc_Id", strTrangThaiNguoiHoc_Id);
        });
        $("#MainContent").delegate("#btnSearch_TongHopDuLieu", "click", function (e) {
            edu.system.confirm("Bạn có chắc chắn muốn tổng hợp dữ liệu không ?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                $('#myModalAlert #alert_content').html('');
                me.getList_SV()
            });
        });
        //me.getList_MauImport();
    },
    /*------------------------------------------
    --Discription: [0] Common
    --ULR: Modules
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();

    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao_NT"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_NT"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_NT"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao_NT"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropSearch_ChuongTrinh_NT"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_NguoiThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiDungDaThuTien/LayDanhSach',
            'versionAPI': 'v1.0',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NguoiThu(json);
                } else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                } else {
                    console.log(data.Message);
                }
            },
            error: function (er) {},
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_MauBaoCao_SVNT: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                } else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoaQuanLy/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaQuanLy(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MauImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import_PhanQuyen/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<li><a class="btnBaoCao_SVNT" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
        }
        $("#zonebtnBaoCao_SVNT").html(row);
        //var obj = {
        //    data: data,
        //    renderInfor: {
        //        id: "MA",
        //        parentId: "",
        //        name: "TEN",
        //        code: "",
        //        avatar: "",
        //        Render: function (nRow, aData) {
        //            return "<option id='" + aData.ID + "' value='" + aData.MAUIMPORT_MA + "' name='" + aData.MAUIMPORT_DUONGDANFILEMAU + "' title='" + aData.CHISODONGDOCDULIEUTUFILE + "'>" + aData.MAUIMPORT_TENFILEMAU + "</option>";
        //        }
        //    },
        //    renderPlace: ["dropMauImport"],
        //    type: "",
        //    title: "Chọn mẫu import",
        //}
        //edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao_NT"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao_NT"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_NT"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Lop_NT"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocKy_NT"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_NguoiThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NguoiThu_NT"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print pull-left">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print; pull-left">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
        //me.getList_KhoanThu();

        //me.getList_KhoanThu_ChuaXuat();
    },
    genList_MauBaoCao_SVNT: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<li><a class="btnBaoCao_SVNT" name="ThongKe_TongHopNoHocPhi" href="#"> Xuất DS sinh viên còn nợ</a></li >';
        }
        $("#zonebtnBaoCao_SVNT").html(row);
        //me.getList_KhoanThu();
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DMLKT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': '',
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_DMLKT(json);
                } else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoanThu_ChuaXuat: function (strTuKhoa) {
        var me = this;
        strTuKhoa = edu.util.getValById('btnSearch_NT');
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_NT').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu === '') {
            edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var obj_list = {
            'action': 'TC_NguoiHoc/LayDSNguoiHocConNoTien',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
            'strTaiChinh_KhoanKhac_Ids': edu.util.getValById('dropAAAA'),
            //'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_NT'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_NT'),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao_NT"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao_NT"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinh_NT"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_Lop_NT"),
            'strTuKhoa': edu.util.getValById("txtSearch_NT"),
            'strNguoiDung_Id': edu.util.getValById("dropSearch_NguoiThu_NT"),
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_KhoanThu_ChuaXuat(json, data.Pager);
                } else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null)
    },
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> Khoan Thu
    --ULR: Modules
    -------------------------------------------*/
    genList_DMLKT: function (dataKhoanThu) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-4 checkbox-inline user-check-print pull-left">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbLKT_NT_All" checked="checked"/>';
        row += '<span><b>Tất cả</b></span>';
        row += '</div>';
        for (var i = 0; i < dataKhoanThu.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-4 checkbox-inline user-check-print; pull-left">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + dataKhoanThu[i].ID + '" class="ckbLKT_NT" title="' + dataKhoanThu[i].TEN + '"' + strcheck + ' checked="checked"/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanPhi").replaceWith(row);
        //me.getList_KhoanThu_ChuaXuat();
    },
    genTable_KhoanThu_ChuaXuat: function (data, iPager) {
        var me = this;
        me.dtNoTien = data || [];
        var strTable_Id = "tbldata_KhoanThu_ChuaXuat_NT";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.SinhVienNoTien.getList_KhoanThu_ChuaXuat()",
                iDataRow: iPager,
            },
            colPos: {
                left: [2],
                center: [0, 1, 5],
                right: [8]
            },
            "aoColumns": [
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="ckbGuiEmail_NT" data-idx="' + nRow + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span name="' + aData.QLSV_NGUOIHOC_ID + '">' + aData.MASONGUOIHOC + '</span>';
                    }
                },
                {
                    "mDataProp": "HOTENNGUOIHOC"
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }, {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }, {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }, {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data !== undefined && data.length > 0) {
            var rowsSwap = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
            var iPageIndex = (iPager && iPager.pageIndex) ? iPager.pageIndex : (edu.system.pageIndex_default || 1);
            var iPageSize = (iPager && iPager.pageSize) ? iPager.pageSize : (edu.system.pageSize_default || 10);
            var iSttStart = (iPageIndex - 1) * iPageSize;
            for (var iSw = 0; iSw < rowsSwap.length; iSw++) {
                if (rowsSwap[iSw].cells.length >= 2) {
                    var checkboxHtml = rowsSwap[iSw].cells[1].innerHTML;
                    rowsSwap[iSw].cells[0].innerHTML = checkboxHtml;
                    rowsSwap[iSw].cells[1].innerHTML = (iSttStart + iSw + 1);
                }
            }
            if (me.bSelectAllPages) {
                $("#chkSelectAll_GuiEmail_NT").prop("checked", true);
                $("#tbldata_KhoanThu_ChuaXuat_NT tbody .ckbGuiEmail_NT").prop('checked', true);
            } else {
                $("#chkSelectAll_GuiEmail_NT").prop("checked", false);
            }
            edu.system.insertSumAfterTable(strTable_Id, [8]);
            $("#" + strTable_Id + " tfoot tr td:eq(8)").attr("style", "text-align: right;");
            var x = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
            for (var i = 0; i < x.length; i++) {
                x[i].id = '';
            }
            edu.system.collageInTable({
                strTable_Id: strTable_Id,
                iBatDau: 1,
                iKetThuc: 1,
                arrStr: [3, 4, 5, 6, 7],
                arrFloat: [8],
            });
        } else {
            $("#chkSelectAll_GuiEmail_NT").prop("checked", false);
            $("#" + strTable_Id + " tfoot").html('');
        }
    },
    /*------------------------------------------
    --Discription: [2] Gửi Email báo nợ
    -------------------------------------------*/
    getEmail_NguoiHoc: function (aData) {
        return aData.EMAIL || aData.Email || aData.TTLL_EMAILCANHAN || '';
    },
    validateEmail: function (email) {
        if (!email) return false;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    openModal_ChonPhamVi: function () {
        var me = this;
        var iSoLuongDaChon = $("#tbldata_KhoanThu_ChuaXuat_NT tbody .ckbGuiEmail_NT:checked").length;
        $("#lblSoLuongDaChon_NT").text(iSoLuongDaChon);
        if (iSoLuongDaChon === 0) {
            $("#btnPhamVi_DaChon_NT").addClass('disabled').css('opacity', '0.5').css('pointer-events', 'none');
        } else {
            $("#btnPhamVi_DaChon_NT").removeClass('disabled').css('opacity', '').css('pointer-events', '');
        }
        $("#myModalChonPhamVi_NT").modal('show');
    },
    openModal_GuiEmail: function (strMode) {
        var me = this;
        function afterFetchDebt(arrAll) {
            if (!arrAll || arrAll.length === 0) {
                edu.system.alert('Không có sinh viên nào khớp bộ lọc!', 'w');
                return;
            }
            $("#myModalAlert").modal("hide");
            $("#hideOverlay_NT").remove();
            me.arrEmailQueue = arrAll;
            me.genPreview_GuiEmail(arrAll);
            $("#zonePercent_GuiEmail_NT").html('');
            $("#myModalGuiEmail_NT").modal('show');
        }
        if (strMode === 'tatCa') {
            me.getAll_KhoanThu_ForEmail(afterFetchDebt);
            return;
        }
        var arrSelected = [];
        $("#tbldata_KhoanThu_ChuaXuat_NT tbody .ckbGuiEmail_NT:checked").each(function () {
            var idx = parseInt($(this).attr('data-idx'));
            if (!isNaN(idx) && me.dtNoTien && me.dtNoTien[idx]) {
                arrSelected.push(me.dtNoTien[idx]);
            }
        });
        if (arrSelected.length === 0) {
            edu.system.alert('Vui lòng chọn ít nhất 1 sinh viên để gửi email!', 'w');
            return;
        }
        afterFetchDebt(arrSelected);
    },
    getAll_KhoanThu_ForEmail: function (callback) {
        var me = this;
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_NT').toString();
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu === '') {
            edu.system.alert('Vui lòng chọn khoản thu!', 'w');
            callback([]);
            return;
        }
        var CHUNK_SIZE = 1000;
        var arrAll = [];
        var iTotalPage = 1;
        var iTotalRow = 0;

        function buildParams(pageIndex) {
            return {
                'action': 'TC_NguoiHoc/LayDSNguoiHocConNoTien',
                'versionAPI': 'v1.0',
                'pageIndex': pageIndex,
                'pageSize': CHUNK_SIZE,
                'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
                'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu,
                'strTaiChinh_KhoanKhac_Ids': edu.util.getValById('dropAAAA'),
                'strTuNgay': edu.util.getValById('txtSearch_TuNgay_NT'),
                'strDenNgay': edu.util.getValById('txtSearch_DenNgay_NT'),
                'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao_NT"),
                'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao_NT"),
                'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinh_NT"),
                'strLopQuanLy_Id': edu.util.getValById("dropSearch_Lop_NT"),
                'strTuKhoa': edu.util.getValById("txtSearch_NT"),
                'strNguoiDung_Id': edu.util.getValById("dropSearch_NguoiThu_NT"),
                'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
                'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            };
        }
        function closeProgress() {
            $("#myModalAlert").modal("hide");
            $("#hideOverlay_NT").remove();
        }
        function fetchChunk(pageIndex) {
            var obj_list = buildParams(pageIndex);
            edu.system.makeRequest({
                success: function (data) {
                    if (!data.Success) {
                        closeProgress();
                        edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                        callback([]);
                        return;
                    }
                    if (data.Data && data.Data.length > 0) {
                        arrAll = arrAll.concat(data.Data);
                    }
                    if (pageIndex === 1) {
                        var pgRaw = data.Pager;
                        var iParsed = parseInt(pgRaw, 10);
                        if (!isNaN(iParsed) && iParsed > 0) {
                            iTotalRow = iParsed;
                        } else if (pgRaw && typeof pgRaw === 'object') {
                            iTotalRow = parseInt(pgRaw.iTotalRow || pgRaw.TotalRow || pgRaw.total || pgRaw.iTotalRecord || pgRaw.TOTAL || pgRaw.TongSo || 0, 10) || arrAll.length;
                        } else {
                            iTotalRow = arrAll.length;
                        }
                        iTotalPage = Math.max(1, Math.ceil(iTotalRow / CHUNK_SIZE));
                        edu.system.alert('<div style="text-align:left"><div id="zoneUnifiedProgress_NT_label" style="margin-bottom:8px"><i class="fa fa-download"></i> Đang tải danh sách sinh viên nợ tiền (<b>' + iTotalRow.toLocaleString('vi-VN') + '</b>)...</div><div id="zoneUnifiedProgress_NT_bar"></div></div>');
                        edu.system.genHTML_Progress("zoneUnifiedProgress_NT_bar", iTotalPage);
                        if ($("#hideOverlay_NT").length === 0) {
                            $("head").append('<style id="hideOverlay_NT">#overlay{display:none !important;}</style>');
                        }
                    }
                    edu.system.start_Progress("zoneUnifiedProgress_NT_bar");
                    if (pageIndex < iTotalPage && data.Data && data.Data.length > 0) {
                        fetchChunk(pageIndex + 1);
                    } else {
                        setTimeout(function () {
                            callback(arrAll);
                        }, 300);
                    }
                },
                error: function (er) {
                    closeProgress();
                    edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er), "w");
                    callback([]);
                },
                type: "POST",
                action: obj_list.action,
                versionAPI: obj_list.versionAPI,
                contentType: true,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }
        fetchChunk(1);
    },
    genPreview_GuiEmail: function (arrData) {
        var me = this;
        me.arrPreviewData = arrData || [];
        var iSoLuongGui = 0;
        for (var i = 0; i < me.arrPreviewData.length; i++) {
            if (me.validateEmail(me.getEmail_NguoiHoc(me.arrPreviewData[i]))) iSoLuongGui++;
        }
        $("#lblSoLuongGuiEmail_NT").text(iSoLuongGui + '/' + me.arrPreviewData.length);
        me.iCurrentPagePreview = 1;
        me.iPageSizePreview = parseInt($("#dropPageSize_GuiEmail_NT").val(), 10) || 100;
        me.renderPreviewPage();
    },
    renderPreviewPage: function () {
        var me = this;
        var arrData = me.arrPreviewData || [];
        var iPageSize = me.iPageSizePreview || 100;
        var iTotalPage = Math.max(1, Math.ceil(arrData.length / iPageSize));
        if (me.iCurrentPagePreview > iTotalPage) me.iCurrentPagePreview = iTotalPage;
        if (me.iCurrentPagePreview < 1) me.iCurrentPagePreview = 1;
        var iStart = (me.iCurrentPagePreview - 1) * iPageSize;
        var iEnd = Math.min(iStart + iPageSize, arrData.length);
        var arrBuf = [];
        for (var i = iStart; i < iEnd; i++) {
            var d = arrData[i];
            var email = me.getEmail_NguoiHoc(d);
            var isValid = me.validateEmail(email);
            var strTrangThai = isValid
                ? '<span class="label label-success">Sẵn sàng</span>'
                : '<span class="label label-danger" title="Thiếu email hoặc email không hợp lệ">Thiếu email</span>';
            arrBuf.push('<tr>'
                + '<td class="td-center">' + (i + 1) + '</td>'
                + '<td>' + (d.MASONGUOIHOC || '') + '</td>'
                + '<td>' + (d.HOTENNGUOIHOC || '') + '</td>'
                + '<td>' + (d.LOP || '') + '</td>'
                + '<td>' + (email || '<i class="text-muted">(chưa có)</i>') + '</td>'
                + '<td>' + (d.TAICHINH_CACKHOANTHU_TEN || '') + '</td>'
                + '<td style="font-size:12px; line-height:1.4;">' + me.createEmailPreview_Text(d) + '</td>'
                + '<td class="td-right">' + edu.util.formatCurrency(d.SOTIEN || 0) + '</td>'
                + '<td class="td-center">' + strTrangThai + '</td>'
                + '</tr>');
        }
        $("#tblPreviewGuiEmail_NT tbody").html(arrBuf.join(''));
        me.renderPreviewPagination(iTotalPage, arrData.length, iStart, iEnd);
    },
    renderPreviewPagination: function (iTotalPage, iTotalRow, iStart, iEnd) {
        var me = this;
        var iCur = me.iCurrentPagePreview;
        function btn(page, label, disabled, active) {
            var cls = 'btn btn-default btn-sm';
            if (active) cls += ' btn-primary';
            if (disabled) cls += ' disabled';
            return '<button class="' + cls + ' btnPrevPagePreview_NT" data-page="' + page + '"' + (disabled ? ' disabled' : '') + '>' + label + '</button>';
        }
        var html = '<div><i>' + (iTotalRow === 0 ? '0' : (iStart + 1) + ' đến ' + iEnd) + ' trong ' + iTotalRow.toLocaleString('vi-VN') + ' sinh viên</i></div>';
        html += '<div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap">';
        html += btn(1, '<i class="fa fa-angle-double-left"></i>', iCur === 1);
        html += btn(iCur - 1, '<i class="fa fa-angle-left"></i>', iCur === 1);
        var iRange = 2;
        var pages = [];
        for (var p = 1; p <= iTotalPage; p++) {
            if (p === 1 || p === iTotalPage || (p >= iCur - iRange && p <= iCur + iRange)) {
                pages.push(p);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        for (var k = 0; k < pages.length; k++) {
            if (pages[k] === '...') {
                html += '<span style="padding:0 4px">...</span>';
            } else {
                html += btn(pages[k], String(pages[k]), false, pages[k] === iCur);
            }
        }
        html += btn(iCur + 1, '<i class="fa fa-angle-right"></i>', iCur === iTotalPage);
        html += btn(iTotalPage, '<i class="fa fa-angle-double-right"></i>', iCur === iTotalPage);
        html += '</div>';
        $("#zonePagination_GuiEmail_NT").html(html);
    },
    createEmailPreview_Text: function (aData) {
        var strTen = (aData.HOTENNGUOIHOC || '');
        var strMaSV = (aData.MASONGUOIHOC || '');
        var strHocKy = (aData.DAOTAO_THOIGIANDAOTAO || '');
        var strKhoanThu = (aData.TAICHINH_CACKHOANTHU_TEN || '');
        var strSoTien = edu.util.formatCurrency(aData.SOTIEN || 0);
        return 'Kính gửi <b>' + strTen + '</b> (MSSV: ' + strMaSV + '). Bạn hiện đang còn nợ khoản <b>' + strKhoanThu + '</b> học kỳ ' + strHocKy + ': <b style="color:#c0392b">' + strSoTien + ' đ</b>. Đề nghị hoàn tất nghĩa vụ nộp phí.';
    },
    createEmailTemplate_BaoNo: function (aData) {
        var strTen = (aData.HOTENNGUOIHOC || '');
        var strMaSV = (aData.MASONGUOIHOC || '');
        var strLop = (aData.LOP || '');
        var strHocKy = (aData.DAOTAO_THOIGIANDAOTAO || '');
        var strKhoanThu = (aData.TAICHINH_CACKHOANTHU_TEN || '');
        var strSoTien = edu.util.formatCurrency(aData.SOTIEN || 0);

        var html = '';
        html += '<html><head><style>';
        html += 'body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }';
        html += '.email-container { max-width: 640px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }';
        html += '.email-header { background-color: #c0392b; color: white; padding: 15px; text-align: center; }';
        html += '.email-body { padding: 20px; background-color: #f9f9f9; }';
        html += '.tbl-no { width: 100%; border-collapse: collapse; margin-top: 10px; }';
        html += '.tbl-no th, .tbl-no td { border: 1px solid #ccc; padding: 8px; }';
        html += '.tbl-no th { background: #eee; }';
        html += '.money { color: #c0392b; font-weight: bold; }';
        html += '.email-footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }';
        html += '</style></head><body>';
        html += '<div class="email-container">';
        html += '<div class="email-header"><h2>THÔNG BÁO NHẮC NỘP HỌC PHÍ</h2></div>';
        html += '<div class="email-body">';
        html += '<p>Kính gửi: <strong>' + strTen + '</strong></p>';
        html += '<p>Mã sinh viên: <strong>' + strMaSV + '</strong> — Lớp: <strong>' + strLop + '</strong></p>';
        html += '<p>Nhà trường xin thông báo, hiện tại bạn đang còn nợ khoản phí sau:</p>';
        html += '<table class="tbl-no">';
        html += '<tr><th>Học kỳ</th><th>Khoản thu</th><th>Số tiền còn nợ</th></tr>';
        html += '<tr><td>' + strHocKy + '</td><td>' + strKhoanThu + '</td><td class="money" style="text-align:right">' + strSoTien + ' đ</td></tr>';
        html += '</table>';
        html += '<p style="margin-top:15px">Đề nghị bạn hoàn tất nghĩa vụ nộp phí để đảm bảo quyền lợi học tập.</p>';
        html += '<p>Trân trọng.</p>';
        html += '</div>';
        html += '<div class="email-footer">';
        html += '<p>Email này được gửi tự động từ hệ thống quản lý tài chính.</p>';
        html += '<p>Vui lòng không trả lời email này.</p>';
        html += '</div>';
        html += '</div>';
        html += '</body></html>';
        return html;
    },
    send_Email_BaoNo: function () {
        var me = this;
        var strTieuDe = ($("#txtTieuDeEmail_NT").val() || '').replace(/\s*[\r\n]+\s*/g, ' ').trim();
        if (!edu.util.checkValue(strTieuDe)) {
            edu.system.alert('Vui lòng nhập tiêu đề email!', 'w');
            return;
        }
        var arrQueue = me.arrEmailQueue || [];
        var arrValid = [];
        for (var i = 0; i < arrQueue.length; i++) {
            var email = me.getEmail_NguoiHoc(arrQueue[i]);
            if (me.validateEmail(email)) {
                arrQueue[i].__EMAIL_GUI = email;
                arrValid.push(arrQueue[i]);
            }
        }
        if (arrValid.length === 0) {
            edu.system.alert('Không có sinh viên nào có email hợp lệ để gửi!', 'w');
            return;
        }
        me.iSendSuccess = 0;
        me.iSendFailed = 0;
        me.arrSendFailedLog = [];
        $("#btnConfirmGuiEmail_NT").prop('disabled', true);
        $("#zonePercent_GuiEmail_NT").html('<div id="zoneSendProgressWrap_NT" style="text-align:left"><div id="lblSendProgress_NT" style="margin-bottom:6px"><i class="fa fa-paper-plane"></i> Đang gửi email... (0/' + arrValid.length + ')</div><div id="zoneSendBar_NT"></div></div>');
        edu.system.genHTML_Progress("zoneSendBar_NT", arrValid.length);
        console.log('[GuiEmail][Send] Bắt đầu gửi ' + arrValid.length + ' email tuần tự...');
        me.sendEmail_Sequential(arrValid, 0, strTieuDe);
    },
    sendEmail_Sequential: function (arrValid, index, strTieuDe) {
        var me = this;
        if (index >= arrValid.length) {
            $("#btnConfirmGuiEmail_NT").prop('disabled', false);
            var strMsg = '<b>Kết quả gửi email:</b><br/>'
                + '<span style="color:green">✓ Thành công: ' + me.iSendSuccess + '</span><br/>'
                + '<span style="color:red">✗ Thất bại: ' + me.iSendFailed + '</span>';
            if (me.arrSendFailedLog.length > 0) {
                strMsg += '<br/><br/><b>Chi tiết lỗi (tối đa 5):</b><br/>';
                for (var k = 0; k < Math.min(5, me.arrSendFailedLog.length); k++) {
                    strMsg += '- ' + me.arrSendFailedLog[k] + '<br/>';
                }
            }
            console.log('[GuiEmail][Send] Hoàn tất. Success=' + me.iSendSuccess + ' Failed=' + me.iSendFailed);
            console.log('[GuiEmail][Send] Failed details:', me.arrSendFailedLog);
            edu.system.alert(strMsg);
            return;
        }
        var aData = arrValid[index];
        var strBody = me.createEmailTemplate_BaoNo(aData);
        var obj_list = {
            'action': 'CMS_NguoiDung/SendEmail',
            'type': 'POST',
            'mailTo': aData.__EMAIL_GUI,
            'mailSubject': strTieuDe,
            'strBody': strBody,
            'arrFileDinhKem': [],
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    me.iSendSuccess++;
                    console.log('[GuiEmail][Send] ✓ ' + aData.__EMAIL_GUI);
                } else {
                    me.iSendFailed++;
                    var strErr = (data && data.Message) ? data.Message : 'Không xác định';
                    me.arrSendFailedLog.push(aData.__EMAIL_GUI + ' → ' + strErr);
                    console.log('[GuiEmail][Send] ✗ ' + aData.__EMAIL_GUI + ' | ' + strErr, data);
                }
            },
            error: function (er) {
                me.iSendFailed++;
                me.arrSendFailedLog.push(aData.__EMAIL_GUI + ' → (network) ' + JSON.stringify(er));
                console.log('[GuiEmail][Send] ✗ ' + aData.__EMAIL_GUI + ' | network error', er);
            },
            complete: function () {
                var iDone = me.iSendSuccess + me.iSendFailed;
                $("#lblSendProgress_NT").html('<i class="fa fa-paper-plane"></i> Đang gửi email... (' + iDone + '/' + arrValid.length + ') · ✓ ' + me.iSendSuccess + ' · ✗ ' + me.iSendFailed);
                edu.system.start_Progress("zoneSendBar_NT");
                me.sendEmail_Sequential(arrValid, index + 1, strTieuDe);
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] Xóa nợ (Không hạch toán công nợ)
    -------------------------------------------*/
    openModal_ChonPhamVi_XoaNo: function () {
        var me = this;
        var iSoLuongDaChon = $("#tbldata_KhoanThu_ChuaXuat_NT tbody .ckbGuiEmail_NT:checked").length;
        $("#lblSoLuongDaChon_XoaNo_NT").text(iSoLuongDaChon);
        if (iSoLuongDaChon === 0) {
            $("#btnPhamVi_DaChon_XoaNo_NT").addClass('disabled').css('opacity', '0.5').css('pointer-events', 'none');
        } else {
            $("#btnPhamVi_DaChon_XoaNo_NT").removeClass('disabled').css('opacity', '').css('pointer-events', '');
        }
        $("#myModalChonPhamVi_XoaNo_NT").modal('show');
    },
    startXoaNo: function (strMode) {
        var me = this;
        function afterFetch(arrAll) {
            $("#myModalAlert").modal("hide");
            $("#hideOverlay_NT").remove();
            if (!arrAll || arrAll.length === 0) {
                setTimeout(function () {
                    edu.system.alert('Không có bản ghi nào khớp bộ lọc!', 'w');
                }, 400);
                return;
            }
            setTimeout(function () {
                me.confirm_XoaNo(arrAll, strMode);
            }, 400);
        }
        if (strMode === 'tatCa') {
            me.getAll_KhoanThu_ForEmail(afterFetch);
            return;
        }
        var arrSelected = [];
        $("#tbldata_KhoanThu_ChuaXuat_NT tbody .ckbGuiEmail_NT:checked").each(function () {
            var idx = parseInt($(this).attr('data-idx'));
            if (!isNaN(idx) && me.dtNoTien && me.dtNoTien[idx]) {
                arrSelected.push(me.dtNoTien[idx]);
            }
        });
        if (arrSelected.length === 0) {
            edu.system.alert('Vui lòng chọn ít nhất 1 bản ghi để xóa nợ!', 'w');
            return;
        }
        me.confirm_XoaNo(arrSelected, strMode);
    },
    confirm_XoaNo: function (arrSelected, strMode) {
        var me = this;
        if (!arrSelected || arrSelected.length === 0) {
            edu.system.alert('Không có bản ghi nào để xóa nợ!', 'w');
            return;
        }
        var strCanhBaoToanBo = '';
        if (strMode === 'tatCa') {
            strCanhBaoToanBo = '<div class="alert alert-danger" style="margin: 10px 0; text-align: left"><i class="fa fa-exclamation-triangle"></i> <b>XÁC NHẬN LẠI:</b> Bạn đang xóa nợ <b>TOÀN BỘ ' + arrSelected.length + ' bản ghi</b> khớp bộ lọc (tất cả các trang).</div>';
        }
        edu.system.confirm(strCanhBaoToanBo + 'Bạn có chắc chắn muốn <b>xóa nợ</b> cho <b>' + arrSelected.length + '</b> bản ghi không? <br/><span style="color:#c0392b">Thao tác này không thể hoàn tác.</span>');
        $("#btnYes").off('click.xoaNo').on('click.xoaNo', function (e) {
            e.stopImmediatePropagation();
            $("#btnYes").hide();
            $('#myModalAlert #alert_content').html('<div id="lblXoaNoProgress_NT" style="margin-bottom:6px; text-align:left"><i class="fa fa-trash"></i> Đang xóa nợ... (0/' + arrSelected.length + ')</div><div id="zoneXoaNoBar_NT"></div>');
            edu.system.genHTML_Progress("zoneXoaNoBar_NT", arrSelected.length);
            me.iXoaNoSuccess = 0;
            me.iXoaNoFailed = 0;
            me.arrXoaNoFailedLog = [];
            console.log('[XoaNo] Bắt đầu xóa nợ ' + arrSelected.length + ' bản ghi... (mode=' + strMode + ')');
            me.xoaNo_Sequential(arrSelected, 0);
        });
    },
    xoaNo_Sequential: function (arrSelected, index) {
        var me = this;
        if (index >= arrSelected.length) {
            var strMsg = '<div style="text-align:left"><b>Kết quả xóa nợ:</b><br/>'
                + '<span style="color:green">✓ Thành công: ' + me.iXoaNoSuccess + '</span><br/>'
                + '<span style="color:red">✗ Thất bại: ' + me.iXoaNoFailed + '</span>';
            if (me.arrXoaNoFailedLog.length > 0) {
                strMsg += '<br/><br/><b>Chi tiết lỗi (tối đa 5):</b><br/>';
                for (var k = 0; k < Math.min(5, me.arrXoaNoFailedLog.length); k++) {
                    strMsg += '- ' + me.arrXoaNoFailedLog[k] + '<br/>';
                }
            }
            strMsg += '</div>';
            console.log('[XoaNo] Hoàn tất. Success=' + me.iXoaNoSuccess + ' Failed=' + me.iXoaNoFailed);
            console.log('[XoaNo] Failed details:', me.arrXoaNoFailedLog);
            edu.system.alert(strMsg);
            me.bSelectAllPages = false;
            me.getList_KhoanThu_ChuaXuat(edu.util.getValById('txtSearch_NT'));
            return;
        }
        var aData = arrSelected[index];
        var strId = aData.ID || aData.TAICHINH_TONGHOPNOCHUNG_ID || '';
        var strLabel = (aData.MASONGUOIHOC || '') + ' - ' + (aData.HOTENNGUOIHOC || '') + ' [' + (aData.TAICHINH_CACKHOANTHU_TEN || '') + ']';
        if (!strId) {
            me.iXoaNoFailed++;
            me.arrXoaNoFailedLog.push(strLabel + ' → thiếu Id bản ghi');
            var iDone = me.iXoaNoSuccess + me.iXoaNoFailed;
            $("#lblXoaNoProgress_NT").html('<i class="fa fa-trash"></i> Đang xóa nợ... (' + iDone + '/' + arrSelected.length + ') · ✓ ' + me.iXoaNoSuccess + ' · ✗ ' + me.iXoaNoFailed);
            edu.system.start_Progress("zoneXoaNoBar_NT");
            me.xoaNo_Sequential(arrSelected, index + 1);
            return;
        }
        var obj_list = {
            'action': 'TC_NGUOIHOC2_MH/FSk0IgkoJC8KKS4vJgkgIikVLiAvAi4vJg8u',
            'func': 'PKG_TAICHINH_NGUOIHOC2.ThucHienKhongHachToanCongNo',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    me.iXoaNoSuccess++;
                    console.log('[XoaNo] ✓ ' + strLabel);
                } else {
                    me.iXoaNoFailed++;
                    var strErr = (data && data.Message) ? data.Message : 'Không xác định';
                    me.arrXoaNoFailedLog.push(strLabel + ' → ' + strErr);
                    console.log('[XoaNo] ✗ ' + strLabel + ' | ' + strErr, data);
                }
            },
            error: function (er) {
                me.iXoaNoFailed++;
                me.arrXoaNoFailedLog.push(strLabel + ' → (network) ' + JSON.stringify(er));
                console.log('[XoaNo] ✗ ' + strLabel + ' | network error', er);
            },
            complete: function () {
                var iDone = me.iXoaNoSuccess + me.iXoaNoFailed;
                $("#lblXoaNoProgress_NT").html('<i class="fa fa-trash"></i> Đang xóa nợ... (' + iDone + '/' + arrSelected.length + ') · ✓ ' + me.iXoaNoSuccess + ' · ✗ ' + me.iXoaNoFailed);
                edu.system.start_Progress("zoneXoaNoBar_NT");
                me.xoaNo_Sequential(arrSelected, index + 1);
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [1] GEN HTML ==> Khoan Thu
    --ULR: Modules
    -------------------------------------------*/
    getList_SV: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc/LayDSNguoiHoc',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_NT'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_NT'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_NT'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_NT'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('txtSearch_NT'),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    edu.system.genHTML_Progress("myModalAlert #alert_content", json.length);
                    for (var i = 0; i < json.length - 1; i++) {
                        me.TongHopDuLieu(json[i], false);
                    }
                    me.TongHopDuLieu(json[json.length -1], true);
                } else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    TongHopDuLieu: function (aData, bcheck) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc/TongHopDuNoSinhVien',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': aData.ID,
        }

        if (edu.util.getValById('txtSearch_TuNgay_NT') || edu.util.getValById('txtSearch_DenNgay_NT'))
            var obj_list = {
                'action': 'TC_NguoiHoc/TongHopDuNoSinhVien_UT',
                'type': 'POST',
                'strNguoiThucHien_Id': edu.system.userId,
                'strNguoiHoc_Id': aData.ID,
                'strNgayBatDau': edu.util.getValById('txtSearch_TuNgay_NT'),
                'strNgayKetThuc': edu.util.getValById('txtSearch_DenNgay_NT'),
                'strPhamViThongKe': edu.util.getValById('txtAAAA'),
                'strThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy_NT'),
            };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                } else {
                    console.log(data.Message);
                }
                if (bcheck == true) {
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            error: function (er) {
                edu.system.endLoading();
                if (bcheck == true) {
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            type: "POST",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
}