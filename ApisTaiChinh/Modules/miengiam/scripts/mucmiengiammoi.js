/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 14/09/2017
--Input: 
--Output:
--API URL: TaiChinh/TC_ThietLapThamSo_DanhMucLoaiKhoanThu
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function MucMienGiamMoi() { };
MucMienGiamMoi.prototype = {
    dtCot: [],
    dtMucMienGiam: [],
    strMucMienGiam_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        //me.getList_ChuongTrinhDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();
        /*------------------------------------------
        --Discription: Initial page KhoanThu
        -------------------------------------------*/

        $("#btnSearch").click(function () {
            me.getList_ThoiGian_MucMienGiam();
        });
        $('#dropHeDaoTao_MMG').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_MMG");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_MMG').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_MMG");
            me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
        });
        $('#dropChuongTrinhDaoTao_MMG').on('select2:select', function () {
            me.getList_ThoiGian_MucMienGiam();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblMucMienGiam";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
                var arrSave = [];
                for (var i = 0; i < arrElement.length; i++) {
                    var temp = $(arrElement[i]).attr("title");
                    if (temp == undefined) temp = "";
                    if (arrElement[i].value != temp) {
                        arrSave.push(arrElement[i]);
                    }
                }
                if (arrSave.length == 0) {
                    $("#myModalAlert #alert_content").html("Chưa có hế số mới nào cần lưu");
                    return;
                }
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_MucMienGiam(arrSave[i]);
                }
            });
        });
        $("#btnSave").click(function () {
            me.save_MucMienGiam_One();
        });
        $("#btnDelete").click(function () {
            me.delete_MucMienGiam(me.strMucMienGiam_Id);
        });
        $("#btnAddNew").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_MMG");
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_MMG");
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_MMG");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "" || strChuongTrinh_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa - Chương trình trước!", "w");
                return;
            }
            me.resetPopup();
            me.popup();
        });
        $("#tblMucMienGiam").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strMucMienGiam_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtMucMienGiam, "ID");
            me.viewForm_MucMienGiam(data[0]);
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung KhoanThu
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = this;
        edu.util.viewValById("dropNew_DoiTuong", "");
        edu.util.viewValById("dropNew_KieuHoc", "");
        edu.util.viewValById("dropNew_LoaiKhoan", "");
        edu.util.viewValById("dropNew_ThoiGian", "");
        edu.util.viewValById("txtNew_HeSo", "");
        me.strMucMienGiam_Id = "";
    },
    /*------------------------------------------
    --Discription: Danh mục KhoanThu
    -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;
        var obj = {
            strMaBangDanhMuc: "QLTC.DTMG"
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genTable_DoiTuong);
    },

    /*------------------------------------------
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_DoiTuong: function (data) {
        var me = main_doc.MucMienGiamMoi;
        me.genComBo_DoiTuong(data);
        var jsonForm = {
            strTable_Id: "tblMucMienGiam",
            aaData: data,
            colPos: {
                center: [0, 1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                }
                , {
                    "mDataProp": "TEN"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Mã đối tượng</th >';
        rowth += '<th class="td-center">Tên đối tượng</th>';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        console.log(rowth);
        $("#tblMucMienGiam thead tr").html(rowth);
        edu.system.arrId = [];
        for (var i = 0; i < me.dtCot.length; i++) {
            edu.system.arrId.push(me.dtCot[i].ID);
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<div>';
                    html += '<input type="text"  id="input' + aData.ID + '_' + edu.system.arrId[edu.system.icolumn++] + '" class="form-control" />';
                    html += '</div>';
                    return html;
                }
            });
        }
        edu.system.loadToTable_data(jsonForm);
        //for (var i = 0; i < me.dtHeSoLuong.length; i++) {
        //    var point = $("#div" + me.dtHeSoLuong[i].NGACH_ID + "_" + me.dtHeSoLuong[i].BAC).html('<input id="input' + me.dtHeSoLuong[i].NGACH_ID + "_" + me.dtHeSoLuong[i].NGACH_ID + '" value="' + me.dtHeSoLuong[i].HESOLUONG + '" title="' + me.dtHeSoLuong[i].HESOLUONG + '" name="' + me.dtHeSoLuong[i].ID + '" style="width: 100%"/>');
        //}
        //me.move_ThroughInTable("tblQuyDinhHeSoLuong");
        me.getList_MucMienGiam();
        edu.system.move_ThroughInTable("tblMucMienGiam");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB MucMienGiam
	--ULR:  
	-------------------------------------------*/
    save_MucMienGiam_One: function () {
        me = this;

        var strDoiTuong_Ids = edu.util.getValById("dropNew_DoiTuong");
        var dHeSo = edu.util.getValById("txtNew_HeSo");
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropNew_LoaiKhoan");
        var strKieHoc_Ids = edu.util.getValCombo("dropNew_KieuHoc");
        var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_MMG");
        var strHocKy_Ids = edu.util.getValById("dropNew_ThoiGian");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_MucMienGiam/ThemMoi',
            'versionAPI': 'v1.0',
            

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strDoiTuong_Ids.toString(),
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dPhanTramMienGiam': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'strGhiChu': "",
            'strId': me.strMucMienGiam_Id
        };
        if (me.strMucMienGiam_Id != "" && me.strMucMienGiam_Id != undefined) {
            obj_save.action = "TC_MucMienGiam/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strMucMienGiam_Id == "") {
                        objNotify = {
                            content: "Thêm mới thành công",
                            type: "s"
                        }
                        edu.system.alertOnModal(objNotify);
                    } else {
                        objNotify = {
                            content: "Cập nhật thành công",
                            type: "w"
                        }
                        edu.system.alertOnModal(objNotify);
                    }
                    
                    me.getList_ThoiGian_MucMienGiam();
                }
                else {
                    objNotify = {
                        content: "QLTC_MucMienGiam.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alertOnModal();
                }
            },
            error: function (er) {
                edu.system.alert("QLTC_MucMienGiam.ThemMoi (er): " + JSON.stringify(er));
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
    save_MucMienGiam: function (point) {
        me = this;

        var strHocKy_Ids = point.id.substring(38);
        var dHeSo = $(point).val();
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropKhoanThu_MMG");
        var strKieHoc_Ids = edu.util.getValCombo("dropKieuHoc_MMG");
        var strDoiTuong_Ids = point.id.substring(5, 37);
        var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_MMG");
        var strId = $(point).attr("name");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_MucMienGiam/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strDoiTuong_Ids.toString(),
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dPhanTramMienGiam': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'strGhiChu': "",
            'strId': strId
        };
        if (strId != "" && strId != undefined) {
            obj_save.action = "TC_MucMienGiam/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_MucMienGiam();
                }
                else {
                    edu.system.alert("QLTC_MucMienGiam.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("QLTC_MucMienGiam.ThemMoi (er): " + JSON.stringify(er));
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
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
        var me = main_doc.MucMienGiamMoi;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_MucMienGiam();
    },
    delete_MucMienGiam: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_MucMienGiam/Xoa',
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
                    me.getList_ThoiGian_MucMienGiam();
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
    getList_ThoiGian_MucMienGiam: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_MucMienGiam/LayDSThoiGian_MucMienGiam',
            

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGian_MMG"),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MMG'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MMG'),
            'strChuongTrinh_Id': edu.util.getValById("dropChuongTrinhDaoTao_MMG"),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropKieuHoc_MMG"),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MMG'),
            'strNguoiThucHien_Id': "",
        }
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.getList_DoiTuong();
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
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
    getList_MucMienGiam: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strPhamViApDung_Id = edu.util.getValById("dropChuongTrinhDaoTao_MMG");
        var strQLSV_DoiTuong_Id = "";
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById("dropThoiGian_MMG");
        var strCanBoCapNhat_Id = "";
        var strDiem_KieuHoc_Id = edu.util.getValById("dropKieuHoc_MMG");
        var strTaiChinh_CacKhoanThu_Id = edu.util.getValById("dropKhoanThu_MMG");
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
                    me.genTable_MucMienGiam(dtResult);
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
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_MucMienGiam: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].QLSV_DOITUONG_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(data[i].PHANTRAMMIENGIAM);
            point.attr("title", data[i].PHANTRAMMIENGIAM);
            var html = '';
            html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            html += '<i class="fa fa-edit"></i>';
            html += '</span>';
            point.parent().append(html);
            point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_MucMienGiam: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropNew_DoiTuong", data.QLSV_DOITUONG_ID);
        edu.util.viewValById("dropNew_KieuHoc", data.KIEUHOC_ID);
        edu.util.viewValById("dropNew_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropNew_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtNew_HeSo", data.PHANTRAMMIENGIAM);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.MucMienGiamMoi;
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
        var me = main_doc.MucMienGiamMoi;
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
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.MucMienGiamMoi;

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
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
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
            renderPlace: ["dropHeDaoTao_MMG"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.MucMienGiamMoi;
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
            renderPlace: ["dropKhoaDaoTao_MMG"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.MucMienGiamMoi;
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
            renderPlace: ["dropChuongTrinhDaoTao_MMG", "dropChuongTrinhDaoTao_Form_MMG"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
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
    --Discription: [4] ACESS DB HocPhan
    --ULR:  
    -------------------------------------------*/
    //getList_HocPhan: function (strChuongTrinh_Id) {
    //    var me = this;
    //    var obj = {
    //        strChuongTrinh_Id: strChuongTrinh_Id,
    //        strNguoiThucHien_Id: "",
    //        strTuKhoa: $("#txtKeyword_MMG").val(),
    //        pageIndex: 1,
    //        pageSize: 200,
    //    };
    //    edu.system.getList_HocPhan(obj, "", "", me.cbGenTreejs_HocPhan);
    //},
    //getList_HocPhan_OnModal: function (strChuongTrinh_Id) {
    //    var me = this;
    //    var obj = {
    //        strChuongTrinh_Id: strChuongTrinh_Id,
    //        strNguoiThucHien_Id: "",
    //        strTuKhoa: "",
    //        pageIndex: 1,
    //        pageSize: 200,
    //    };
    //    edu.system.getList_HocPhan(obj, "", "", me.cbGenTable_HocPhan);
    //},
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    genComBo_DoiTuong: function (data) {
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
            renderPlace: ["dropNew_DoiTuong"],
            type: "",
            title: "Chọn đối tượng",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropNew_ThoiGian", "dropThoiGian_MMG"],
            type: "",
            title: "Chọn học kỳ",
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
            renderPlace: ["dropKieuHoc_MMG", "dropNew_KieuHoc"],
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
            renderPlace: ["dropKhoanThu_MMG", "dropNew_LoaiKhoan"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
};