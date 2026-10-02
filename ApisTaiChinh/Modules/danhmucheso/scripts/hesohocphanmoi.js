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
function HeSoHocPhanMoi() { };
HeSoHocPhanMoi.prototype = {
    dtCot: [],
    dtHeSoHocPhan: [],
    strHocPhanHeSo_Id: [],

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
            me.getList_ThoiGian_HocPhan_HeSo();
        });
        $('#dropHeDaoTao_HSHP').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_HSHP");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_HSHP').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_HSHP");
            me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
        });
        $('#dropChuongTrinhDaoTao_HSHP').on('select2:select', function () {
            me.getList_ThoiGian_HocPhan_HeSo();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblHeSoHocPhan";
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
                    me.save_HeSoHocPhan(arrSave[i]);
                }
            });
        });
        $("#btnCapNhatAll").click(function () {
            var strTable_Id = "tblHeSoHocPhan";
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
                me.save_HeSoHocPhan(arrSave[i]);
            }
        });
        $("#btnSave").click(function () {
            me.save_HeSoHocPhan_One();
        });
        $("#btnDelete").click(function () {
            me.delete_HeSoHocPhan(me.strHocPhanHeSo_Id);
        });
        $("#btnAddNew").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_HSHP");
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_HSHP");
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSHP");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "" || strChuongTrinh_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa - Chương trình trước!", "w");
                return;
            }
            me.resetPopup();
            me.popup();
        });
        $("#tblHeSoHocPhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strHocPhanHeSo_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtHeSoHocPhan, "ID");
            me.viewForm_HeSoHocPhan(data[0]);
        });
        edu.system.getList_MauImport("zonebtnBaoCao_HSHPM", function (addKeyValue) {

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
        edu.util.viewValById("dropNew_HocPhan", "");
        edu.util.viewValById("dropNew_KieuHoc", "");
        edu.util.viewValById("dropNew_LoaiKhoan", "");
        edu.util.viewValById("dropNew_ThoiGian", "");
        edu.util.viewValById("txtNew_HeSo", "");
        me.strHocPhanHeSo_Id = "";
    },
    /*------------------------------------------
    --Discription: Danh mục KhoanThu
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        var obj = {
            strChuongTrinh_Id: edu.util.getValById("dropChuongTrinhDaoTao_HSHP"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 200,
        };
        edu.system.getList_HocPhan(obj, "", "", me.genTable_HocPhan);
    },

    /*------------------------------------------
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_HocPhan: function (data) {
        var me = main_doc.HeSoHocPhanMoi;
        me.genComBo_HocPhan(data);
        var jsonForm = {
            strTable_Id: "tblHeSoHocPhan",
            aaData: data,
            colPos: {
                center: [0, 1, 3],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                }
                , {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTC"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Mã học phần</th >';
        rowth += '<th class="td-center">Tên học phần</th>';
        rowth += '<th class="td-center">Số tín chỉ</th>';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        console.log(rowth);
        $("#tblHeSoHocPhan thead tr").html(rowth);
        edu.system.arrId = [];
        for (var i = 0; i < me.dtCot.length; i++) {
            edu.system.arrId.push(me.dtCot[i].ID);
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<div>';
                    html += '<input type="text"  id="input' + aData.DAOTAO_HOCPHAN_ID + '_' + edu.system.arrId[edu.system.icolumn++] + '" class="form-control" />';
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
        me.getList_HeSoHocPhan();
        edu.system.move_ThroughInTable("tblHeSoHocPhan");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    save_HeSoHocPhan_One: function () {
        me = this;

        var strHocKy_Ids = edu.util.getValById("dropNew_ThoiGian");
        var dHeSo = edu.util.getValById("txtNew_HeSo");
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropNew_LoaiKhoan");
        var strKieHoc_Ids = edu.util.getValCombo("dropNew_KieuHoc");
        var strHocPhan_Ids = edu.util.getValCombo("dropNew_HocPhan");
        var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSHP");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_HocPhan_HeSo/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id': strHocPhan_Ids.toString(),
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dHeSo': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu': "",
            'strId': me.strHocPhanHeSo_Id
        };
        if (me.strHocPhanHeSo_Id != "" && me.strHocPhanHeSo_Id != undefined) {
            obj_save.action = "TC_HocPhan_HeSo/Sua_TaiChinh_HocPhan_HeSo";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strHocPhanHeSo_Id == "") {
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

                    me.getList_ThoiGian_HocPhan_HeSo();
                }
                else {
                    objNotify = {
                        content: "QLTC_HocPhan_HeSo.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alertOnModal();
                }
            },
            error: function (er) {
                edu.system.alert("QLTC_HocPhan_HeSo.ThemMoi (er): " + JSON.stringify(er));
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
    save_HeSoHocPhan: function (point) {
        me = this;

        var strHocKy_Ids = point.id.substring(38);
        var dHeSo = $(point).val();
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropKhoanThu_HSHP");
        var strKieHoc_Ids = edu.util.getValCombo("dropKieuHoc_HSHP");
        var strHocPhan_Ids = point.id.substring(5, 37);
        var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSHP");
        var strId = $(point).attr("name");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_HocPhan_HeSo/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id': strHocPhan_Ids.toString(),
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dHeSo': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'dKeThua': edu.util.getValById('dropNew_KeThua_All'),
            'strGhiChu': "",
            'strId': strId
        };
        if (strId != "" && strId != undefined) {
            obj_save.action = "TC_HocPhan_HeSo/Sua_TaiChinh_HocPhan_HeSo";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_HeSoHocPhan();
                }
                else {
                    edu.system.alert("QLTC_HocPhan_HeSo.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("QLTC_HocPhan_HeSo.ThemMoi (er): " + JSON.stringify(er));
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
        var me = main_doc.HeSoHocPhanMoi;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_HocPhan_HeSo();
    },
    delete_HeSoHocPhan: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_HocPhan_HeSo/Xoa',
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
                    me.getList_ThoiGian_HocPhan_HeSo();
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
    getList_ThoiGian_HocPhan_HeSo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_HocPhan_HeSo/LayDSThoiGian_HocPhan_HeSo',

            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhamViApDung_Id': edu.util.getValById("dropChuongTrinhDaoTao_HSHP"),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropKieuHoc_HSHP"),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_HSHP'),
            'strNguoiThucHien_Id': "",
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.getList_HocPhan();
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
    getList_HeSoHocPhan: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strPhamViApDung_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSHP");
        var strDaoTao_HocPhan_Id = "";
        var strDaoTao_ThoiGianDaoTao_Id = "";
        var strCanBoCapNhat_Id = "";
        var strDiem_KieuHoc_Id = edu.util.getValById("dropKieuHoc_HSHP");
        var strTaiChinh_CacKhoanThu_Id = "";
        var strDangKy_DotDangKyHoc_Id = "";

        var obj_list = {
            'action': 'TC_HocPhan_HeSo/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
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
                    me.dtHeSoHocPhan = dtResult;
                    me.genTable_HeSoHocPhan(dtResult);
                }
                else {
                    edu.system.alert("QLTC_HocPhan_HeSo.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_HocPhan_HeSo.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    genTable_HeSoHocPhan: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].DAOTAO_HOCPHAN_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(data[i].HESO);
            point.attr("title", data[i].HESO);
            var html = '';
            html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            html += '<i class="fa fa-edit"></i>';
            html += '</span>';
            point.parent().append(html);
            point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_HeSoHocPhan: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        console.log(data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropNew_HocPhan", data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropNew_KieuHoc", data.KIEUHOC_ID);
        edu.util.viewValById("dropNew_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropNew_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtNew_HeSo", data.HESO);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.HeSoHocPhanMoi;
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
        var me = main_doc.HeSoHocPhanMoi;
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
        var me = main_doc.HeSoHocPhanMoi;

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
            renderPlace: ["dropHeDaoTao_HSHP"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.HeSoHocPhanMoi;
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
            renderPlace: ["dropKhoaDaoTao_HSHP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.HeSoHocPhanMoi;
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
            renderPlace: ["dropChuongTrinhDaoTao_HSHP", "dropChuongTrinhDaoTao_Form_HSHP"],
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
    //        strTuKhoa: $("#txtKeyword_HSHP").val(),
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
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropNew_ThoiGian"],
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
            renderPlace: ["dropKieuHoc_HSHP", "dropNew_KieuHoc"],
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
            renderPlace: ["dropKhoanThu_HSHP", "dropNew_LoaiKhoan"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
};