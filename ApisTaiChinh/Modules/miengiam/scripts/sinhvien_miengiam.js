/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 30/08/2018
--API URL: TC_SinhVienMienGiam
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function SinhVienMienGiam() { };
SinhVienMienGiam.prototype = {
    valid_SVMG: [],
    html_SVMG: {},
    input_SVMG: {},
    dtKhoanThu: [],
    dtKieuHoc: [],
    dtSinhVienMienGiam: [],
    dtKhoaDaoTao: [],
    dtChuongTrinhDaoTao: [],
    strDoiTuong_Id: '',
    dtLopQuanLy: [],
    dtMucMienGiam: [],

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: [0] Initial system
		-------------------------------------------*/
        
        /*------------------------------------------
        --Discription: [0] Initial local 
        -------------------------------------------*/
        me.page_load();

        /*------------------------------------------
        --Discription: [0] Action common
        -------------------------------------------*/
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-hsph", "zone_list_hshp");
        });
        $("#txtKeyword_SVMG").focus();
        /*------------------------------------------
		--Discription: [1] Action TimKiem SinhVienMienGiam
		-------------------------------------------*/
        $('#dropHeDaoTao_SVMG').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_SVMG");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_SVMG').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_SVMG");
            me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
            me.getList_LopQuanLy();
            me.getList_DoiTuongMienGiam();
        });
        $('#dropChuongTrinhDaoTao_SVMG').on('select2:select', function () {
            me.getList_MucMien();
            me.getList_LopQuanLy();
            me.getList_DoiTuongMienGiam();
        });
        $('#dropLopQuanLy_SVMG').on('select2:select', function () {
            me.getList_DoiTuongMienGiam();
        });
        /*------------------------------------------
		--Discription: [1] Action main  SinhVienMienGiam
		-------------------------------------------*/
        $("#btnLapDanhSach").click(function () {
            //check HocKy, dHeSo, KhoanThu, TinhChat, arrHocPhan_Id,....
            var valid = edu.util.validInputForm(me.valid_SVMG);
            if (valid == true) {
                me.setList_DoiTuongMienGiam();
            }

        });
        /*------------------------------------------
		--Discription: [1] Action main 
		-------------------------------------------*/
        $("[id$=chkSelectAll_SVMG]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDaDuyet_SVMG" });
        });
        $("#tblDaDuyet_SVMG").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblDaDuyet_SVMG", regexp: /checkX/g, });
        });
        $("#tblDoiTuong_SVMG").delegate(".btnDetail", "click", function () {
            me.strDoiTuong_Id = this.id;
            me.getList_DoiTuongMienGiam();
        });
        $("#btnDelete_SVMG").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaDuyet_SVMG", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVienMienGiam(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DoiTuongMienGiam();
            }, 2000);
        });
        $("#btnSave_Duyet").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaDuyet_SVMG", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn duyệt dữ liệu không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhVienMienGiam(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/
    page_load: function () {
        var me = this;

        me.getList_ThoiGianDaoTao();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        me.getList_ChuongTrinhDaoTao("");
        
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();

        me.valid_SVMG = [
            { "MA": "dropThoiGianDaoTao_SVMG", "THONGTIN1": "1" },
            { "MA": "dropKieuHoc_SVMG", "THONGTIN1": "1" },
            { "MA": "dropKhoanThu_SVMG", "THONGTIN1": "1" }
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB ==> DoiTuong_MienGiam
    --Author:
	-------------------------------------------*/
    getList_MucMien: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strPhamViApDung_Id = edu.util.getValById("dropChuongTrinhDaoTao_SVMG");
        var strQLSV_DoiTuong_Id = "";
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById("dropThoiGianDaoTao_SVMG");
        var strCanBoCapNhat_Id = "";
        var strDiem_KieuHoc_Id = edu.util.getValById("dropKieuHoc_SVMG");
        var strTaiChinh_CacKhoanThu_Id = edu.util.getValById("dropKhoanThu_SVMG");
        var strDangKy_DotDangKyHoc_Id = "";

        var obj_list = {
            'action': 'TC_MucMienGiam/LayDanhSach',
            'versionAPI': 'v1.0',

            'dTuKhoa_number': -1,

            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strQLSV_DoiTuong_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNguoiThucHien_Id': strCanBoCapNhat_Id,
            'strDiem_KieuHoc_Id': strDiem_KieuHoc_Id,
            'strTaiChinh_CacKhoanThu_Id': strTaiChinh_CacKhoanThu_Id,
            'strDangKy_DotDangKyHoc_Id': strDangKy_DotDangKyHoc_Id
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
                    me.dtMucMienGiam = dtResult;
                    me.genTable_MucMien(dtResult, data.Pager);
                }
                else {
                    edu.system.alert("QLTC_MucMienGiam.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MucMienGiam.LayDanhSach (er): " + JSON.stringify(er), "w");
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
	--Discription: [1] GEN HTML ==> SinhVienMienGiam
	--Author:
	-------------------------------------------*/
    genTable_MucMien: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDoiTuong_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDoiTuong_SVMG",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.SinhVienMienGiam.getList_MucMien()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + 'Tên đối tượng: ' + edu.util.returnEmpty(aData.QLSV_DOITUONG_TEN) + "</span><br />";
                        html += '<span>' + 'Mức miễn: ' + edu.util.returnEmpty(aData.PHANTRAMMIENGIAM) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB ==> DoiTuong_MienGiam
    --Author:
	-------------------------------------------*/
    setList_DoiTuongMienGiam: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_DoiTuong_MienGiam/LapDSNguocHocDuocMienGiam',
            'versionAPI': 'v1.0',
            
            'strNguoiThucHien_Id': "",
            'strHeDaoTao_Id': edu.util.getValById("dropHeDaoTao_SVMG"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropKhoaDaoTao_SVMG"),
            'strChuongTrinh_Id': edu.util.getValById("dropChuongTrinhDaoTao_SVMG"),
            'strLopQuanLy_Id': edu.util.getValById("dropLopQuanLy_SVMG"),
            'strTrangThaiNguoiHoc_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoTao_SVMG"),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropKhoanThu_SVMG"),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropKieuHoc_SVMG"),

        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lập dữ liệu danh sách sinh viên miễn giảm thành công!");
                    me.getList_DoiTuongMienGiam();
                }
                else {
                    edu.system.alert("QLTC_DoiTuong_MienGiam.LapDanhSach_DuocMienGiam: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_DoiTuong_MienGiam.LapDanhSach_DuocMienGiam (er): " + JSON.stringify(er), "w");
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
    getList_DoiTuongMienGiam: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_DoiTuong_MienGiam/LayDanhSach',
            'versionAPI': 'v1.0',
            
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_SVMG'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_SVMG'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_SVMG'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy_SVMG'),
            'strNguoiThucHien_Id': "",

            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_NguoiHoc_Id': "",
            'strQLSV_DoiTuong_Id': me.strDoiTuong_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_SVMG'),
            'dTuKhoa_number': -1,
            'strCanBoLapDuLieuMien_Id': "",
            'strDiem_KieuHoc_Id': edu.util.getValById("dropKieuHoc_SVMG"),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropKhoanThu_SVMG"),
            'strDangKy_DotDangKy_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,

        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDoiTuongMienGiam = data.Data;
                    me.genTable_DoiTuongMienGiam(data.Data, data.Pager);
                }
                else {
                    edu.system.alert("QLTC_DoiTuong_MienGiam.LapDanhSach_DuocMienGiam: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_DoiTuong_MienGiam.LapDanhSach_DuocMienGiam (er): " + JSON.stringify(er), "w");
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
    save_SinhVienMienGiam: function (strId) {
        var me = this;

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_DoiTuong_MienGiam/PheDuyetDoiTuong_MienGiam',
            'versionAPI': 'v1.0',

            'strIds': strId,
            'dPhanTramMienGiamDuyet': $("#input" + strId).val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (me.strHocPhanSoTien_Id == "") {
                    //    objNotify = {
                    //        content: "Thêm mới thành công",
                    //        type: "s"
                    //    }
                    //    edu.system.alertOnModal(objNotify);
                    //} else {
                    //    objNotify = {
                    //        content: "Cập nhật thành công",
                    //        type: "w"
                    //    }
                    //    edu.system.alertOnModal(objNotify);
                    //}
                }
                else {
                    objNotify = {
                        content: "QLTC_HocPhan_SoTien.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alert("QLTC_HocPhan_SoTien.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
                edu.system.alert("QLTC_HocPhan_SoTien.ThemMoi (er): " + JSON.stringify(er));
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
    endLuuHeSo: function () {
        var me = main_doc.SinhVienMienGiam;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_DoiTuongMienGiam();
    },
    delete_SinhVienMienGiam: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_DoiTuong_MienGiam/Xoa',
            'versionAPI': 'v1.0',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    var obj = {
                        content: "Xóa thành công!",
                        code: "",
                    }
                    edu.system.alertOnModal(obj);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er));
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
    /*------------------------------------------
	--Discription: [1] GEN HTML ==> SinhVienMienGiam
	--Author:
	-------------------------------------------*/
    genTable_DoiTuongMienGiam: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDaDuyet_SVMG",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.SinhVienMienGiam.getList_DoiTuongMienGiam()",
            //    iDataRow: iPager,
            //},
            //sort: true,
            colPos: {
                left: [1, 2, 3],
                center: [0, 11],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "NGUOIDUNG_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_TINHTRANG"
                }
                , {
                    "mDataProp": "QLSV_DOITUONG_TEN"
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_LOP"
                }
                , {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "PHANTRAMMIENGIAM"
                }
                , {
                    "mData": "PHANTRAMMIENGIAM",
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="input' + aData.ID + '" value="' + aData.PHANTRAMMIENGIAM + '" />'
                    }
                }
                , {
                    "mData": "PHANTRAMMIENGIAM",
                    "mRender": function (nRow, aData) {
                        if (edu.util.checkValue(aData.CANBODUYET_ID)) return "Đã duyệt";
                        return "";
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = main_doc.SinhVienMienGiam;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_HeDaoTao: function () {
        var me = main_doc.SinhVienMienGiam;
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
        var me = main_doc.SinhVienMienGiam;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = main_doc.SinhVienMienGiam;

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

        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//call only one time
            edu.system.getList_ChuongTrinhDaoTao(obj_ChuongTrinhDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
        }
        else {
            edu.util.objGetDataInData(strKhoaDaoTao_Id, me.dtChuongTrinhDaoTao, "DAOTAO_KHOADAOTAO_ID", me.cbGenCombo_ChuongTrinhDaoTao);
        }
    },
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strChuongTrinhDaoTao_Id) {
        var me = this;
        var obj_LopQL = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: $('#dropKhoaDaoTao_SVMG').val(),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: $('#dropChuongTrinhDaoTao_SVMG').val(),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_LopQuanLy(obj_LopQL, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_LoaiKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
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
                    me.genComBo_KhoanThu(dtResult);
                    me.dtKhoanThu = dtResult;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    getList_KieuHoc: function (resolve, reject) {
        var me = this;
        var strMaBangDanhMuc = "KHDT.DIEM.KIEUHOC";

        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': strMaBangDanhMuc
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
                    me.genComBo_KieuHoc(data.Data);
                    me.dtKieuHoc = data.Data;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
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
            renderPlace: ["dropThoiGianDaoTao_SVMG"],
            type: "",
            title: "Chọn thời gia đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
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
            renderPlace: ["dropHeDaoTao_SVMG"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.SinhVienMienGiam;
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//attch only one time
            me.dtKhoaDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao_SVMG"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.SinhVienMienGiam;
        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//attch only one time
            me.dtChuongTrinhDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao_SVMG"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.SinhVienMienGiam;
        if (!edu.util.checkValue(me.dtLopQuanLy)) {//attch only one time
            me.dtLopQuanLy = data;
        }

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
            renderPlace: ["dropLopQuanLy_SVMG"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KieuHoc: function (data) {
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
            renderPlace: ["dropKieuHoc_SVMG"],
            type: "",
            title: "Chọn kiểu học",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KhoanThu: function (data) {
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
            renderPlace: ["dropKhoanThu_SVMG"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
}