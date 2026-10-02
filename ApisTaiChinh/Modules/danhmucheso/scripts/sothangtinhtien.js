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
function SoThangTinhTien() { };
SoThangTinhTien.prototype = {
    dtCot: [],
    dtSoThangTinhTien: [],
    strSoThangTinhTien_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        //me.getList_ThoiGianDaoTao();
        //me.getList_ChuongTrinhDaoTao_ComBo();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();
        /*------------------------------------------
        --Discription: Initial page KhoanThu
        -------------------------------------------*/

        $("#btnSearch").click(function () {
            me.getList_ThoiGian_SoThangTinhTien();
        });
        $('#dropHeDaoTao_STTT').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_STTT");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
        });
        $('#dropKhoaDaoTao_STTT').on('select2:select', function () {
            me.getList_ThoiGian_SoThangTinhTien();
            me.getList_ChuongTrinhDaoTao_ComBo();
        });
        $('#dropDonViTinh_STTT').on('select2:select', function () {
            if ($('#dropDonViTinh_STTT').val() == "") return;
            me.getList_ThoiGianDaoTao();
            me.getList_ThoiGian_SoThangTinhTien();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblSoThangTinhTien";
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
                    me.save_SoThangTinhTien(arrSave[i]);
                }
            });
        });
        $("#btnCapNhatAll").click(function () {
            var strTable_Id = "tblSoThangTinhTien";
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
                me.save_SoThangTinhTien(arrSave[i]);
            }
        });
        $("#btnSave").click(function () {
            me.save_SoThangTinhTien_One();
        });
        $("#btnDelete").click(function () {
            me.delete_SoThangTinhTien(me.strSoThangTinhTien_Id);
        });
        $("#btnAddNew").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_STTT");
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_STTT");
            var strDonViPhi_Id = edu.util.getValById("dropDonViTinh_STTT");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "" || strDonViPhi_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa trước - Đơn vị tính !", "w");
                return;
            }
            me.resetPopup();
            me.popup();
        });
        $("#tblSoThangTinhTien").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strSoThangTinhTien_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtSoThangTinhTien, "ID");
            me.viewForm_SoThangTinhTien(data[0]);
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.NVAP", "dropNghiepVu_STTT,dropNew_NghiepVu", "Chọn nghiệp vụ áp dụng");
        edu.system.getList_DanhMucDulieu({ strMaBangDanhMuc: "QLTC.DVT" }, me.genComBo_DonViTinh);
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
        edu.util.viewValById("dropNew_ChuongTrinh", "");
        edu.util.viewValById("dropNew_LoaiKhoan", "");
        edu.util.viewValById("dropNew_ThoiGian", "");
        edu.util.viewValById("dropNew_DonViTinh", "");
        edu.util.viewValById("dropNew_NghiepVu", "");
        edu.util.viewValById("txtNew_NgayApDung", "");
        edu.util.viewValById("txtNew_MucPhi", "");
        me.strSoThangTinhTien_Id = "";
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    save_SoThangTinhTien_One: function () {
        me = this;
        
        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_SoThang_TinhTien/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': me.strSoThangTinhTien_Id,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_STTT'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_STTT'),
            'strPhamViApDung_Id': edu.util.getValById('dropNew_ChuongTrinh'),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': edu.util.getValById('txtNew_NgayApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropNew_ThoiGian'),
            'dSoThang': edu.util.getValById('txtNew_MucPhi'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropNew_LoaiKhoan'),
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu': "",
        };
        if (me.strSoThangTinhTien_Id != "" && me.strSoThangTinhTien_Id != undefined) {
            obj_save.action = "TC_SoThang_TinhTien/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strSoThangTinhTien_Id == "") {
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

                    me.getList_ThoiGian_SoThangTinhTien();
                }
                else {
                    objNotify = {
                        content: "QLTC_SoThang_TinhTien.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alertOnModal();
                }
            },
            error: function (er) {
                edu.system.alert("QLTC_SoThang_TinhTien.ThemMoi (er): " + JSON.stringify(er));
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
    save_SoThangTinhTien: function (point) {
        me = this;

        var strHocKy_Ids = point.id.substring(38);
        var dHeSo = $(point).val();
        var strHocPhan_Ids = point.id.substring(5, 37);
        var strId = $(point).attr("name");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_SoThang_TinhTien/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': strId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_STTT'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_STTT'),
            'strPhamViApDung_Id': strHocPhan_Ids,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dSoThang': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STTT'),
            'dKeThua': edu.util.getValById('dropNew_KeThua_All'),
            'strGhiChu': "",
        };
        if (strId != "" && strId != undefined) {
            obj_save.action = "TC_SoThang_TinhTien/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_SoThangTinhTien();
                }
                else {
                    edu.system.alert("QLTC_SoThang_TinhTien.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("QLTC_SoThang_TinhTien.ThemMoi (er): " + JSON.stringify(er));
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
        var me = main_doc.SoThangTinhTien;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_SoThangTinhTien();
    },
    delete_SoThangTinhTien: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_SoThang_TinhTien/Xoa',
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
                    me.getList_ThoiGian_SoThangTinhTien();
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
    getList_ThoiGian_SoThangTinhTien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_SoThang_TinhTien/LayDSThoiGian_SoThang_TinhTien',

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_STTT'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_STTT'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_STTT'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_STTT'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STTT'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_STTT'),
            'strNguoiThucHien_Id': "",
        }
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.getList_ChuongTrinhDaoTao(edu.util.getValById('dropKhoaDaoTao_STTT'));
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
    getList_SoThangTinhTien: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_SoThang_TinhTien/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_STTT'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STTT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_STTT'),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,
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
                    me.dtSoThangTinhTien = dtResult;
                    me.genTable_SoThangTinhTien(dtResult);
                }
                else {
                    edu.system.alert("QLTC_SoThang_TinhTien.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_SoThang_TinhTien.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    genTable_SoThangTinhTien: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].PHAMVIAPDUNG_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(data[i].SOTHANG);
            point.attr("title", data[i].SOTHANG);
            var html = '';
            html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            html += '<i class="fa fa-edit"></i>';
            html += '</span>';
            point.parent().append(html);
            point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_SoThangTinhTien: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropNew_ChuongTrinh", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNew_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropNew_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropNew_DonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropNew_NghiepVu", data.NGHIEPVUAPDUNG_ID);
        edu.util.viewValById("txtNew_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtNew_MucPhi", data.SOTHANG);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.SoThangTinhTien;
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
        var me = main_doc.SoThangTinhTien;
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
        var me = main_doc.SoThangTinhTien;
        
        var obj_list = {
            'action': 'TC_SoThang_TinhTien/LayDSTaiChinh_CT_SoThang',
            'versionAPI': 'v1.0',

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_STTT'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_STTT'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_STTT'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_STTT'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STTT'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_STTT'),

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
        }
        
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
                    me.genTable_ChuongTrinhDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
            },
            error: function (er) {
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
    getList_ChuongTrinhDaoTao_ComBo: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.SoThangTinhTien;

        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: $("#dropKhoaDaoTao_STTT").val(),
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
            renderPlace: ["dropHeDaoTao_STTT"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.SoThangTinhTien;
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
            renderPlace: ["dropKhoaDaoTao_STTT"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.SoThangTinhTien;
        var jsonForm = {
            strTable_Id: "tblSoThangTinhTien",
            aaData: data,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Chương trình</th >';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        $("#tblSoThangTinhTien thead tr").html(rowth);
        edu.system.arrId = [];
        for (var i = 0; i < me.dtCot.length; i++) {
            edu.system.arrId.push(me.dtCot[i].ID);
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<div>';
                    html += '<input type="text"  id="input' + aData.PHAMVIAPDUNG_ID + '_' + edu.system.arrId[edu.system.icolumn++] + '" class="form-control" />';
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
        me.getList_SoThangTinhTien();
        edu.system.move_ThroughInTable("tblSoThangTinhTien");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropNew_ChuongTrinh"],
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


        var obj_list = {
            'action': 'TC_ThoiGianTheoDonViTinh/LayThoiGianTheoDonViTinh',
            'versionAPI': 'v1.0',

            'strDonViTinh_Id': $("#dropDonViTinh_STTT option:selected").attr("id")
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
    //        strTuKhoa: $("#txtKeyword_STTT").val(),
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
    genComBo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (row, aData) {
                    return aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN;
                }
            },
            renderPlace: ["dropNew_HocPhan"],
            type: "",
            title: "Chọn học phần",
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
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropNew_ThoiGian", "dropThoiGianDaoTao_STTT"],
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
            renderPlace: ["dropKieuHoc_STTT", "dropNew_KieuHoc"],
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
            renderPlace: ["dropKhoanThu_STTT", "dropNew_LoaiKhoan"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },

    genComBo_DonViTinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA",
            },
            renderPlace: ["dropDonViTinh_STTT", "dropNew_DonViTinh"],
            type: "",
            title: "Chọn đơn vị tính",
        }
        edu.system.loadToCombo_data(obj);
    },
};