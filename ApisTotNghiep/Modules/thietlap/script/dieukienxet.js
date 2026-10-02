/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DieuKienXet() { };
DieuKienXet.prototype = {
    dtDieuKienChung: [],
    strDieuKienChung_Id: '',
    strPhanCapApDung: '',

    dtDieuKienRieng: [],
    strDieuKienRieng_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_DieuKienChung();
        me.getList_DieuKienRieng();
        
        me.getList_TuKhoa();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_KhoaQuanLy();
        edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai,dropSearch_PhanLoaiRieng");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAILOP", "dropMoHinh");

        $("#btnSearch").click(function (e) {
            me.getList_DieuKienChung();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DieuKienChung();
            }
        });

        $("#btnSearchRieng").click(function (e) {
            me.getList_DieuKienRieng();
        });
        $("#txtSearchRieng").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DieuKienRieng();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_DieuKienXet").click(function (e) {
            switch (me.strPhanCapApDung) {
                case "":
                    me.save_DieuKienChung();
                    break;
                case "HSSV":
                    me.save_DieuKienRieng($("#dropHocVien").val());
                    break;
                case "KEHOACHXETTOTNGHIEP":
                    me.save_DieuKienRieng($("#dropKeHoach").val());
                    break;
                case "LOPQUANLY":
                    me.save_DieuKienRieng($("#dropLop").val());
                    break;
                case "CHUONGTRINH":
                    me.save_DieuKienRieng($("#dropChuongTrinh").val());
                    break;
                case "KHOAHOC":
                    me.save_DieuKienRieng($("#dropKhoaDaoTao").val());
                    break;
                case "KHOAQUANLY":
                    me.save_DieuKienRieng($("#dropKhoaQuanLy").val());
                    break;
                case "HEDAOTAO":
                    me.save_DieuKienRieng($("#dropHeDaoTao").val());
                    break;
                case "MOHINHNIENCHE_TINCHI":
                    me.save_DieuKienRieng($("#dropMoHinh").val());
                    break;
            }
        });
        $("#btnDelete_DieuKienXet").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                if (me.strPhanCapApDung === "") {
                    me.delete_DieuKienChung(me.strDieuKienChung_Id);
                } else {
                    me.delete_DieuKienRieng(me.strDieuKienRieng_Id);
                }
            });
        });
        $("#tblDieuKienChung").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            edu.util.setOne_BgRow(strId, "tblDieuKienChung");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDieuKienChung, "ID")[0];
                me.viewEdit_DieuKienChung(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDieuKienRieng").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            edu.util.setOne_BgRow(strId, "tblDieuKienRieng");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDieuKienRieng, "ID")[0];
                me.viewEdit_DieuKienRieng(data);
                me.toggle_edit();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSaveTuKhoa").click(function (e) {
            $("#tblTuKhoa tbody tr").each(function () {
                me.save_TuKhoa(this.id);
            });
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $('#dropHeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao(this.value);
        });
        $('#dropKhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao(this.value);
            me.getList_LopQuanLy(this.value, "");
        });
        $('#dropChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy("", this.value);
        });
        $('#dropLop').on('select2:select', function (e) {
            var x = $(this).val();
            me.getList_SinhVien(this.value);
        });
        $('#dropSearch_PhanCapApDung_AD').on('select2:select', function (e) {
            me.getList_DieuKienRieng();
        });
        $('#dropSearch_PhanLoaiRieng').on('select2:select', function (e) {
            me.getList_PhanCapApDung();
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDieuKienChung_Id = "";
        me.strDieuKienRieng_Id = "";

        if ($("#tab_1").hasClass("active")) {
            edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        } else {
            edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoaiRieng"));
        }
        //edu.util.viewValById("dropPhanLoai", "");
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLop", "");
        edu.util.viewValById("dropKeHoach", "");
        edu.util.viewValById("dropKhoaQuanLy", "");
        edu.util.viewValById("dropMoHinh", "");
        edu.util.viewValById("txtXauDieuKien", "");
        edu.util.viewValById("txtMoTa", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        if ($("#tab_1").hasClass("active")) {
            me.strPhanCapApDung = "";
        } else {
            if ($("#dropSearch_PhanCapApDung_AD").val() == "") {
                edu.system.alert("Hãy chọn phân cấp áp dụng");
                return;
            }
            me.strPhanCapApDung = $("#dropSearch_PhanCapApDung_AD option:selected").attr("name");
        }
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        switch (me.strPhanCapApDung) {
            case "":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "HSSV":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().show();
                $("#dropLop").parent().parent().show();
                $("#dropHocVien").parent().parent().show();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "KEHOACHXETTOTNGHIEP":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().show();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "LOPQUANLY":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().show();
                $("#dropLop").parent().parent().show();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "CHUONGTRINH":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().show();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "KHOAHOC":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "KHOAQUANLY":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().show();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "HEDAOTAO":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "MOHINHNIENCHE_TINCHI":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().show();
                break;
        }
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienChung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XepLoai_DieuKien/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDieuKienChung = dtReRult;
                    me.genTable_DieuKienChung(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DieuKienChung: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_XepLoai_DieuKien/ThemMoi',

            'strId': me.strDieuKienChung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtXauDieuKien'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'iThuTu': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_XepLoai_DieuKien/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienChung_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DieuKienChung();
            },
            error: function (er) {
                edu.system.alert("XLHV_DieuKienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienChung: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_XepLoai_DieuKien/Xoa',


            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_DieuKienChung();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DieuKienChung: function (data, iPager) {
        var me = this;
        $("#lblDieuKienChung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDieuKienChung",

            bPaginate: {
                strFuntionName: "main_doc.DieuKienXet.getList_DieuKienChung()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "XAUDIEUKIEN",
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditDieuKienChung" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_DieuKienChung: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtXauDieuKien", data.XAUDIEUKIEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        me.strDieuKienChung_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XetDuyet_DieuKien_Ad/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearchRieng'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoaiRieng'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_PhamViApDung_AD'),
            'strPhanCapApDung_Id': edu.util.getValById('dropSearch_PhanCapApDung_AD'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_AD'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDieuKienRieng = dtReRult;
                    me.genTable_DieuKienRieng(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DieuKienRieng: function (strPhamViApDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_XetDuyet_DieuKien_Ad/ThemMoi',

            'strId': me.strDieuKienRieng_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtXauDieuKien'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'iThuTu': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_XetDuyet_DieuKien_Ad/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienChung_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DieuKienRieng();
            },
            error: function (er) {
                edu.system.alert("XLHV_DieuKienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienRieng: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_XetDuyet_DieuKien_Ad/Xoa',


            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_DieuKienRieng();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DieuKienRieng: function (data, iPager) {
        var me = this;
        $("#lblDieuKienRieng_Tong").html(iPager);
        $("#lblPhamVi_Ten").html($("#dropSearch_PhanCapApDung_AD option:selected").text());
        var jsonForm = {
            strTable_Id: "tblDieuKienRieng",

            bPaginate: {
                strFuntionName: "main_doc.DieuKienXet.getList_DieuKienRieng()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditDieuKienRieng" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_DieuKienRieng: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropSearch_PhanCapApDung_AD", data.PHANCAPAPDUNG_ID);
        edu.util.viewValById("dropHeDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropKhoaDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropChuongTrinh", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropLop", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropKeHoach", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropKhoaQuanLy", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropMoHinh", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("txtXauDieuKien", data.XAUDIEUKIEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        me.strDieuKienRieng_Id = data.ID;
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
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var objList = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
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
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
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
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'strTuKhoa': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropLop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
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
                    me.cbGenCombo_HocVien(dtResult);
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
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.DieuKienXet;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: "",
                default_val: me.strChuongTrinh_Id
            },
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình",
        };
        edu.system.loadToCombo_data(obj);
        if (me.strChuongTrinh_Id != "") {
            me.getList_LopQuanLy("", me.strChuongTrinh_Id);
        }
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.DieuKienXet;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                default_val: me.strLop_Id
            },
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (me.strLop_Id != "") {
            me.getList_SinhVien();
        }
    },
    cbGenCombo_HocVien: function (data) {
        var me = main_doc.DieuKienXet;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: me.strHocVien_Id
            },
            renderPlace: ["dropHocVien"],
            type: "",
            title: "Chọn học viên",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.DieuKienXet;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian_AD", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.DieuKienXet.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
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
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_PhanCapApDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_PhanCapApDung/LayDanhSach',
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoaiRieng'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtPhanCap"] = json;
                    me.cbGenCombo_PhanCapApDung(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_PhanCapApDung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropSearch_PhanCapApDung_AD"],
            type: "",
            title: "Chọn phân cấp áp dụng",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_PhanCapApDung_AD", data[0].ID);
            me.getList_DieuKienRieng();
        } 
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TuKhoa: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XetDuyet_TuKhoa/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TuKhoa(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_TuKhoa: function (strId) {
        var me = this;
        var pTenTuKhoa = $("#txtTuKhoa_" + strId);
        var pMoTa = $("#txtMoTa_" + strId);
        if (pTenTuKhoa.val() === pTenTuKhoa.attr("title") && pMoTa.val() === pMoTa.attr("title")) return;
        //--Edit
        var obj_save = {
            'action': 'TN_XetDuyet_TuKhoa/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTenTuKhoa': pTenTuKhoa.val(),
            'strMoTa': pMoTa.val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_XetDuyet_TuKhoa/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienChung_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                //me.getList_DieuKienChung();
            },
            error: function (er) {
                edu.system.alert("XLHV_DieuKienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_TuKhoa: function (data, iPager) {
        var me = this;
        $("#lblTuKhoa_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTuKhoa",

            //bPaginate: {
            //    strFuntionName: "main_doc.DieuKienXet.getList_TuKhoa()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA",
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtTuKhoa_' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENTUKHOA) + '" value="' + edu.util.returnEmpty(aData.TENTUKHOA) + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtMoTa_' + aData.ID + '" title="' + edu.util.returnEmpty(aData.MOTA) + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex':1,
            'pageSize': 10000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KeHoach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_KeHoach: function (data) {
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
            renderPlace: ["dropKeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        };
        edu.system.loadToCombo_data(obj);
    },
}