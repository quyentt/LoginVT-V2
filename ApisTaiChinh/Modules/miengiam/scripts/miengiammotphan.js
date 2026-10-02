/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 24/08/2018
--API URL: TC_MienGiamMotPhan <==> TC_MienGiamMotPhan
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function MienGiamMotPhan() { };
MienGiamMotPhan.prototype = {
    valid_MGMP: [],
    html_MGMP: {},
    strMienBanToanPhan_Id: '',
    arrSinhVien_Id: [],
    obj_SV: {},

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
		--Discription: [0] Common
		--Author:
		-------------------------------------------*/
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus-mtp", "zone_list_mgmp");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-mtp", "zone_input_mgmp");
        });
        /*------------------------------------------
        --Discription: [1] Action TIMKIEM
        --Author:
        -------------------------------------------*/
        $('#dropHeDaoTao_MGMP').on('select2:select', function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_MGMP");
            me.getList_KhoaDaoTao(strHeDaoTao_Id);
            me.getList_LopQuanLy("", "");
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_MGMP').on('select2:select', function () {
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_MGMP");
            me.getList_ChuongTrinhDaoTao(strKhoaDaoTao_Id);
            me.getList_LopQuanLy(strKhoaHoc_Id, "");
        });

        $('#dropChuongTrinhDaoTao_MGMP').on('select2:select', function () {
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_MGMP");
            var strChuongTrinhDaoTao_Id = edu.util.getValById("dropChuongTrinhDaoTao_MGMP");
            me.getList_LopQuanLy(strKhoaDaoTao_Id, strChuongTrinhDaoTao_Id);
        });
        //modal
        $("#txtSearch_ChuongTrinh_MGMP").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tbldata_ChuongTrinhDT_MGMP tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        /*------------------------------------------
		--Discription: [1] Action MienGiamMotPhan
		--Author:
		-------------------------------------------*/
        $("#tbldata_MGMP").delegate("." + me.html_MGMP.btn_edit, "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.strMienBanToanPhan_Id = selected_id;
                me.getDetail_MGMP(selected_id);
            }
        });
        $("#tbldata_MGMP").delegate("." + me.html_MGMP.chkOne, "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_MGMP);
        });
        $("[id$=chkSelectAll_MGMP]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_MGMP);
        });
        $("#btnDelete_MGMP").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_MGMP);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $("#myModalAlert").delegate("#btnYes", "click", function (e) {
                me.delete_MGMP(selected_id);
            });
            return false;
        });
        $("#btnRefresh_MGMP").click(function () {
            me.getList_MGMP();
        });
        $("#btnRewrite_MGMP").click(function () {
            me.rewrite();
        });
        $("#btnSave_MGMP").click(function () {
            var valid = edu.util.validInputForm(me.valid_MGMP);
            var count = 0;
            if (valid == true) {
                //Chec SinhVien
                if (edu.util.checkValue(me.arrSinhVien_Id)) {
                    count++;
                }
                else {
                    $("#tbldata_SinhVien_Selected tbody").html('<tr><td class="td-center color-danger" colspan="4">Vui lòng chọn Sinh Viên!</td></tr>');
                }
                //check ChuongTrinhDaoTao
                if (edu.util.checkValue(edu.util.getValById("dropChuongTrinhDaoTao_Input_MGMP"))) {
                    count++;
                }
                else {
                    edu.system.alert("Vui chương trình đào tạo!");
                }
                //call save
                if (count == 2) {
                    me.save_MGMP();
                }
            }

        });

        $("#btnSearch_MGMP").click(function () {
            me.getList_MGMP();
        });
        $('#dropKeHoachNhapHoc_MGMP').on('select2:select', function () {
            me.getList_MGMP();
        });
        $("#txtKeyword_MGMP").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_MGMP();
            }
        });
        /*------------------------------------------
		--Discription: [2] Action ChuongTrinhDaoTao
        --Author:
		-------------------------------------------*/

        /*------------------------------------------
		--Discription: [3] Action SinhVien
        --Author:
		-------------------------------------------*/
        $("#btnCallModal_SinhVien_MGMP").click(function () {
            me.popup_SinhVien();
            edu.system.beginLoading();
            $("#txtSearch_SinhVien_MGMP").val('');
            var obj_SV = {
                strCoSoDaoTao_Id: "",
                strKhoaDaoTao_Id: $("#dropKhoaDaoTao_MGMP").val(),
                strNganh_Id: $("#dropChuongTrinhDaoTao_Input_MGMP").val(),
                strLopQuanLy_Id: $("#dropLopQuanLy_MGMP").val(),
                iTrangThai: -1,
                strNguoiThucHien_Id: "",
                strTuKhoa: "",
                pageIndex: edu.system.pageIndex_default,
                pageSize: edu.system.pageSize_default
            }
            edu.system.getList_SinhVien(obj_SV, "", "", me.cbGenTable_SinhVien);
        });
        $("#tbldata_SinhVien_MGMP").delegate(".select_sinhvien", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/sinhvien_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_SinhVien(selected_id);
            }
        });
        $("#tbldata_SinhVien_Selected").delegate(".remove_sinhvien", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/selected_sinhvien_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.remove_SinhVien(selected_id);
            }
        });
        $("#btnSearch_SinhVien_MGMP").click(function () {
            edu.system.beginLoading();
            var obj_SV = {
                strCoSoDaoTao_Id: "",
                strKhoaDaoTao_Id: $("#dropKhoaDaoTao_MGMP").val(),
                strNganh_Id: $("#dropChuongTrinhDaoTao_Input_MGMP").val(),
                strLopQuanLy_Id: $("#dropLopQuanLy_MGMP").val(),
                iTrangThai: -1,
                strNguoiThucHien_Id: "",
                strTuKhoa: $("#txtSearch_SinhVien_MGMP").val(),
                pageIndex: edu.system.pageIndex_default,
                pageSize: edu.system.pageSize_default
            }
            edu.system.getList_SinhVien(obj_SV, "", "", me.cbGenTable_SinhVien);
        });
        $("#txtSearch_SinhVien_MGMP").keypress(function (e) {
            edu.system.beginLoading();
            var obj_SV = {
                strCoSoDaoTao_Id: "",
                strKhoaDaoTao_Id: "",
                strNganh_Id: "",
                strLopQuanLy_Id: "",
                iTrangThai: -1,
                strNguoiThucHien_Id: "",
                strTuKhoa: $("#txtSearch_SinhVien_MGMP").val(),
                pageIndex: edu.system.pageIndex_default,
                pageSize: edu.system.pageSize_default
            }
            edu.system.getList_SinhVien(obj_SV, "", "", me.cbGenTable_SinhVien);
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-mtp", "zone_list_mgmp");
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropKieuHoc_Input_MGMP", "Chọn kiểu học");
        /*------------------------------------------
		--Discription: config MienGiamMotPhan
		-------------------------------------------*/
        me.html_MGMP = {
            table_id: "tbldata_MGMP",
            prefix_id: "chkSelect_MGMP",
            regexp: /chkSelect_MGMP/g,
            chkOne: "chkSelectOne_MGMP",
            btn_edit: "btnEditRole_MGMP",
        };
        me.valid_MGMP = [
			{ "MA": "dropChuongTrinhDaoTao_Input_MGMP", "THONGTIN1": "1" },
            { "MA": "dropKieuHoc_Input_MGMP", "THONGTIN1": "1" },
			//1-empty, 2-float, 3-int, 4-date, seperated by "#" character... 
        ];
        me.getList_MGMP();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strMienBanToanPhan_Id = "";
        me.arrSinhVien_Id = [];
        $("#tbldata_SinhVien_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
        //
        var arrId = ["txtKeHoach_MGMP", "dropNgayApDung_MGMP", "dropNgayHetHan_MGMP"];
        edu.util.resetValByArrId(arrId);
    },
    popup_SinhVien: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalSinhVien_MGMP").modal("show");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB ==> MienGiamMotPhan
    --Author:
	-------------------------------------------*/
    save_MGMP: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_MienMotPhan/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': edu.util.getValById("dropChuongTrinhDaoTao_Input_MGMP"),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': edu.util.getValById("dropNgayApDung_MGMP"),
            'strNgayHetHan': edu.util.getValById("dropNgayHetHan_MGMP"),
            'strQLSV_NguoiHoc_Id': me.arrSinhVien_Id.toString(),
            'dPhanTramMienGiam': edu.util.getValById("txtPhanTramMienGiam_MGMP").replace(/%/g, ""),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropKieuHoc_Input_MGMP"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': me.strMienBanToanPhan_Id
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strMienBanToanPhan_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_MGMP();
                }
                else {
                    edu.system.alert("QLTC_MienMotPhan.ThemMoi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MienMotPhan.ThemMoi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_MGMP: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_MienMotPhan/LayDanhSach',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MGMP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MGMP'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MGMP'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy_MGMP'),
            'strQLSV_NguoiHoc_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_MGMP"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,

        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_MGMP = data.Data;
                    me.genTable_MGMP(data.Data, data.Pager);
                }
                else {
                    edu.system.alert("QLTC_MienMotPhan.LayDanhSach: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MienMotPhan.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    getDetail_MGMP: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TC_MienMotPhan/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.strMienBanToanPhan_Id
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_MGMP = data.Data;
                        me.viewForm_MGMP(data.Data[0]);
                    }
                    else {
                        me.viewForm_MGMP([]);
                    }
                }
                else {
                    edu.system.alert("QLTC_MienMotPhan.LayChiTiet: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MienMotPhan.LayChiTiet (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            versionAPI: obj_detail.versionAPI,
            contentType: true,
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_MGMP: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_MienMotPhan/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_MGMP);
                    me.getList_MGMP();
                }
                else {
                    var obj = {
                        content: "QLTC_MienMotPhan.Xoa" + data.Message,
                        code: "w"
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "QLTC_MienMotPhan.Xoa (er)" + JSON.stringify(er),
                    code: "w"
                }
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_ChuongTrinhDaoTao(obj_ChuongTrinhDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var obj_LopQL = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_LopQuanLy(obj_LopQL, "", "", me.cbGenCombo_LopQuanLy);
    },
    /*------------------------------------------
	--Discription: [1] GEN HTML ==> MienGiamMotPhan
	--Author:
	-------------------------------------------*/
    genTable_MGMP: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_MGMP.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.MienGiamMotPhan.getList_MGMP()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [1, 2, 3, 4],
                center: [0, 5, 6],
                fix: [0, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        return '<span>' + strHoTen + '</span>';
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
                , {
                    "mDataProp": "CHUONGTRINH"
                }
                , {
                    "mDataProp": "QUOCTICH_TEN"
                }
                , {
                    "mDataProp": "PHANTRAMMIENGIAM"
                }
                , {
                    "mDataProp": "NGAYAPDUNG"
                }
                , {
                    "mDataProp": "NGAYHETHAN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="' + me.html_MGMP.prefix_id + aData.ID + '" class="' + me.html_MGMP.chkOne + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_MGMP: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("", data.strTAICHINH_KeHoach_Id);
        edu.util.viewValById("", data.strNguoiDung_Id);
        edu.util.viewValById("", data.strNguoiThucHien_Id);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao/LopQuanLy/QuocTich
	--ULR:  
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
            renderPlace: ["dropHeDaoTao_MGMP", "dropHeDaoTao_Modal_MGMP"],
            type: "",
            title: "Chọn hệ đào tạo",
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
            renderPlace: ["dropKhoaDaoTao_MGMP", "dropKhoaDaoTao_Modal_MGMP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.MienGiamMotPhan;//global variable
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao_MGMP", "dropChuongTrinhDaoTao_Input_MGMP"],
            type: "",
            title: "Chọn chương trình đào tạo",
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
            renderPlace: ["dropLopQuanLy_MGMP"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_QuocTich: function (data) {
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
            renderPlace: ["dropQuocTich_MGMP"],
            type: "",
            title: "Chọn quốc tịch",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [3] GEN/ACTION HTML SinhVien
	--ULR:  
	-------------------------------------------*/
    cbGenTable_SinhVien: function (data, iPager) {
        var me = main_doc.MienGiamMotPhan;//global variable

        me.obj_SV = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: $("#dropKhoaDaoTao_MGMP").val(),
            strNganh_Id: $("#dropChuongTrinhDaoTao_Input_MGMP").val(),
            strLopQuanLy_Id: $("#dropLopQuanLy_MGMP").val(),
            iTrangThai: 1,
            strNguoiThucHien_Id: "",
            strTuKhoa: $("#txtSearch_SinhVien_MGMP").val(),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default
        }

        var jsonForm = {
            strTable_Id: "tbldata_SinhVien_MGMP",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.system.getList_SinhVien(main_doc.MienGiamMotPhan.obj_SV, '', '', main_doc.MienGiamMotPhan.cbGenTable_SinhVien)",
                iDataRow: iPager,
            },
            arrClassName: [""],
            "sort": true,
            colPos: {
                left: [1, 2],
                center: [0, 3],
                fix: [0, 3]
            },
            aoColumns: [
            {
                "mRender": function (nRow, aData) {
                    var strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    return '<span id="sinhvien_ten' + aData.ID + '">' + strHoTen + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    var strMaSo = edu.util.returnEmpty(aData.MASONGUOIHOC);
                    return '<span id="sinhvien_tk' + aData.ID + '">' + strMaSo + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    return '<a href="#" id="sinhvien_id' + aData.ID + '" class="select_sinhvien">Chọn</a>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
    },
    select_SinhVien: function (id) {
        var me = this;
        var html = '';
        var obj_notify = {};
        //[1] add to arr
        if (edu.util.arrCheckExist(me.arrSinhVien_Id, id)) {
            obj_notify = {
                renderPlace: "sinhvien_id" + id,
                type: "w",
                title: "Dữ liệu đã tồn tại!",
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "sinhvien_id" + id,
                type: "i",
                title: "Chọn thành công!",
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(id);
        }
        //[2] add html to table
        var $sinhvien_ten = "sinhvien_ten" + id;
        var $sinhvien_tk = "sinhvien_tk" + id;
        var strSinhVien_Ten = edu.util.getTextById($sinhvien_ten);
        var strSinhVien_TK = edu.util.getTextById($sinhvien_tk);

        html += '<tr id="zone_sinhvien' + id + '">';
        html += '<td class="td-fixed td-center">-</td>';
        html += '<td class="td-left">' + strSinhVien_Ten + '</td>';
        html += '<td class="td-left">' + strSinhVien_TK + '</td>';
        html += '<td class="td-fixed td-center"><a id="selected_sinhvien_id' + id + '" class="btn remove_sinhvien" href="#">Hủy</a></td>';
        html += '</tr>';

        //[3] fill into table 
        var renderPlace = "#tbldata_SinhVien_Selected tbody";
        $(renderPlace).append(html);
    },
    remove_SinhVien: function (id) {
        var me = this;
        //[1] remove from arr
        edu.util.arrExcludeVal(me.arrSinhVien_Id, id);
        console.log("me.arrSinhVien_Id: " + me.arrSinhVien_Id);
        //[2] remove html from table
        var removePlace = "#zone_sinhvien" + id;
        $(removePlace).remove();
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var strDAOTAO_Nam_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.loadToCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
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
    loadToCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropNgayApDung_MGMP", "dropNgayHetHan_MGMP"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
}