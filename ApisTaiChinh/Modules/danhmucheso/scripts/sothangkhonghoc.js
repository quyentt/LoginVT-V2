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
function SoThangKhongHoc() { };
SoThangKhongHoc.prototype = {
    dtCot: [],
    dtSoThangKhongHoc: [],
    strSoThangKhongHoc_Id: [],

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
            me.getList_ThoiGian_DoiTuong_Mien();
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $('#dropHeDaoTao_STKH').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_STKH");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_LopQuanLy("", "");
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_STKH').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_STKH");
            me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
            me.getList_LopQuanLy(strKhoaHoc_Id, "");
        });
        $('#dropChuongTrinhDaoTao_STKH').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_STKH");
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_STKH");
            me.getList_LopQuanLy(strKhoaHoc_Id, strChuongTrinh_Id);
        });
        $('#dropLopQuanLy_STKH').on('select2:select', function () {
            me.getList_ThoiGian_DoiTuong_Mien();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblSoThangKhongHoc";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
                var arrSave = [];
                for (var i = 0; i < arrElement.length; i++) {
                    var temp = $(arrElement[i]).attr("title");
                    if (temp == undefined) temp = "";
                    if (arrElement[i].value != temp) {
                        var strSinhVien_Id = arrElement[i].id.substring(5, 37);
                        var obj = {
                            strId: $(arrElement[i]).attr("name"),
                            strDaoTao_ToChucCT_Id: $(arrElement[i]).attr("chuongtrinh_id"),
                            strQLSV_NguoiHoc_Id: strSinhVien_Id,
                            strQLSV_DoiTuong_Id: $(arrElement[i]).attr("doituong_id"),
                            strDaoTao_ThoiGianDaoTao_Id: arrElement[i].id.substring(38),
                            dPhanTramMienGiam: $(arrElement[i]).val(),
                            strDiem_KieuHoc_Id: $("#dropKieuHoc_STKH").val(),
                            strTaiChinh_CacKhoanThu_Id: $("#dropKhoanThu_STKH").val()
                        }
                        if (temp == "") {
                            obj.strDaoTao_ToChucCT_Id = $("#dropChuongTrinhDaoTao_STKH").val();
                        }
                        arrSave.push(obj);
                    }
                }
                if (arrSave.length == 0) {
                    $("#myModalAlert #alert_content").html("Chưa có hế số mới nào cần lưu");
                    return;
                }
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_SoThangKhongHoc(arrSave[i]);
                }
            });
        });
        $("#btnSave_STKH").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
                { "MA": "dropNew_KhoanThu", "THONGTIN1": "1" },
                { "MA": "dropNew_ThoiGianDaoTao", "THONGTIN1": "1" },
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }

            edu.system.confirm("Bạn có chắc chắn muốn lưu không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tbldata_SinhVien_Selected";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input[type='checkbox']");
                var arrSave = [];
                for (var i = 0; i < arrElement.length; i++) {
                    //var temp = $(arrElement[i]).attr("title");
                    //if (temp == undefined) temp = "";
                    //if (arrElement[i].value != temp) {
                    //    arrSave.push(arrElement[i]);
                    //}
                    var checked_status = $(arrElement[i]).is(':checked');
                    if (checked_status) {
                        var strSinhVien_Id = arrElement[i].id.replace(/checkX/g, '');
                        var obj = {
                            strId: "",
                            strDaoTao_ToChucCT_Id: $("#dropNew_ChuongTrinh_" + strSinhVien_Id).val(),
                            strQLSV_NguoiHoc_Id: strSinhVien_Id,
                            strQLSV_DoiTuong_Id: $("#dropNew_DoiTuong_" + strSinhVien_Id).val(),
                            strDaoTao_ThoiGianDaoTao_Id: $("#dropNew_ThoiGianDaoTao").val(),
                            dPhanTramMienGiam: $("#txtNew_PhanTramMien_" + strSinhVien_Id).val(),
                            strDiem_KieuHoc_Id: $("#dropNew_KieuHoc").val(),
                            strTaiChinh_CacKhoanThu_Id: $("#dropNew_KhoanThu").val()
                        }
                        arrSave.push(obj);
                    }
                }
                if (arrSave.length == 0) {
                    $("#myModalAlert #alert_content").html("Chưa có hế số mới nào cần lưu");
                    return;
                }
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_SoThangKhongHoc(arrSave[i]);
                }
            });
        });
        $("#btnSave").click(function () {
            me.save_SoThangKhongHoc_One();
        });
        $("#btnDelete").click(function () {
            me.delete_SoThangKhongHoc(me.strSoThangKhongHoc_Id);
        });
        $("#btnAddNew").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_STKH");
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_STKH");
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_STKH");
            var strLop_Id = edu.util.getValById("dropLopQuanLy_STKH");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "" || strChuongTrinh_Id == "" || strLop_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa - Chương trình - Lớp trước!", "w");
                return;
            }
            me.resetPopup();
            me.toggle_detail();
            me.getList_SinhVien();
        });
        $("#tblSoThangKhongHoc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strSoThangKhongHoc_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtSoThangKhongHoc, "ID");
            me.viewForm_SoThangKhongHoc(data[0]);
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.DTMG", "dropEdit_DoiTuong");
        $("#tbldata_SinhVien_Selected").delegate(".checkOne", "click", function () {
            var strId = this.id.replace(/checkX/g, "");
            edu.util.setOne_BgRow(strId, "tbldata_SinhVien_Selected");
        });
        $("#txtTuKhoaSinhVien_Search").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tbldata_SinhVien_Selected tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $("[id$=chkSelectAll_STKH]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbldata_SinhVien_Selected" });
        });
        $("#btnSoTienDienMienTuDong").click(function () {
            var value = $("#txtSoTienMienMacDinh").val();
            $("#tbldata_SinhVien_Selected tbody tr").each(function () {
                var pointValue = this.cells[7].getElementsByTagName('input')[0];
                if (pointValue.value == "") {
                    pointValue.value = value;
                }
            });
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
        edu.util.viewValById("dropEdit_ChuongTrinh", "");
        edu.util.viewValById("dropEdit_KieuHoc", "");
        edu.util.viewValById("dropEdit_LoaiKhoan", "");
        edu.util.viewValById("dropEdit_ThoiGian", "");
        edu.util.viewValById("txtEdit_MucMien", "");
        edu.util.viewValById("dropEdit_DoiTuong", "");
        me.strSoThangKhongHoc_Id = "";
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_input");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_list");
    },
    /*------------------------------------------
    --Discription: Danh mục KhoanThu
    -------------------------------------------*/
    getList_TaiChinh_NguoiHoc_Mien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc_SoThang/LayDSTaiChinh_NH_SoThang',

            'strTuKhoa': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_STKH'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_STKH'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_STKH'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy_STKH'),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_STKH'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STKH'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_STKH'),
            'strNguoiThucHien_Id': "",
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_SoThangKhongHoc(data.Data);
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

    /*------------------------------------------
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_SoThangKhongHoc: function (data) {
        var me = main_doc.SoThangKhongHoc;
        var jsonForm = {
            strTable_Id: "tblSoThangKhongHoc",
            aaData: data,
            colPos: {
                center: [0, 1, 3],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "DAOTAO_HOCPHAN_TEN",
                    "mRender": function (nrow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
                , {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_LOP"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Mã học viên</th >';
        rowth += '<th class="td-center">Họ tên</th>';
        rowth += '<th class="td-center">Ngày sinh</th>';
        rowth += '<th class="td-center">Chương trình</th>';
        rowth += '<th class="td-center">Lớp</th>';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        $("#tblSoThangKhongHoc thead tr").html(rowth);
        edu.system.arrId = [];
        for (var i = 0; i < me.dtCot.length; i++) {
            edu.system.arrId.push(me.dtCot[i].ID);
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<div>';
                    html += '<input type="text"  id="input' + aData.QLSV_NGUOIHOC_ID + '_' + edu.system.arrId[edu.system.icolumn++] + '" class="form-control" />';
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
        me.getList_SoThangKhongHoc();
        edu.system.move_ThroughInTable("tblSoThangKhongHoc");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB SoThangKhongHoc
	--ULR:  
	-------------------------------------------*/
    save_SoThangKhongHoc_One: function () {
        me = this;
        console.log($("#dropEdit_DoiTuong").val());

        var data = edu.util.objGetDataInData(me.strSoThangKhongHoc_Id, me.dtSoThangKhongHoc, "ID")[0];

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_NguoiHoc_SoThang/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': data.ID,
            'strDaoTao_ToChucCT_Id': data.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': data.QLSV_NGUOIHOC_ID,
            'strQLSV_DoiTuong_Id': $("#dropEdit_DoiTuong").val(),
            'strDaoTao_ThoiGianDaoTao_Id': $("#dropEdit_ThoiGian").val(),
            'dSoThang': $("#txtEdit_MucMien").val(),
            'strDiem_KieuHoc_Id': $("#dropEdit_KieuHoc").val(),
            'strTaiChinh_CacKhoanThu_Id': $("#dropEdit_LoaiKhoan").val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "" && obj_save.strId != undefined) {
            obj_save.action = "TC_NguoiHoc_SoThang/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strHocPhanSoTien_Id == "") {
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

                    me.getList_ThoiGian_DoiTuong_Mien();
                }
                else {
                    objNotify = {
                        content: "QLTC_HocPhan_SoTien.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alertOnModal();
                }
            },
            error: function (er) {
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
    save_SoThangKhongHoc: function (obj) {
        me = this;

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_NguoiHoc_SoThang/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': obj.strId,
            'strDaoTao_ToChucCT_Id': obj.strDaoTao_ToChucCT_Id,
            'strQLSV_NguoiHoc_Id': obj.strQLSV_NguoiHoc_Id,
            'strQLSV_DoiTuong_Id': obj.strQLSV_DoiTuong_Id,
            'strDaoTao_ThoiGianDaoTao_Id': obj.strDaoTao_ThoiGianDaoTao_Id,
            'dSoThang': obj.dPhanTramMienGiam,
            'strDiem_KieuHoc_Id': obj.strDiem_KieuHoc_Id,
            'strTaiChinh_CacKhoanThu_Id': obj.strTaiChinh_CacKhoanThu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj.strId != "" && obj.strId != undefined) {
            obj_save.action = "TC_NguoiHoc_SoThang/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_SoThangKhongHoc();
                }
                else {
                    edu.system.alert("QLTC_NguoiHoc_SoThang.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("QLTC_NguoiHoc_SoThang.ThemMoi (er): " + JSON.stringify(er));
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
        var me = main_doc.SoThangKhongHoc;
        objNotify = {
            content: "Cập nhật thành công",
            type: "w",
            prePos: "#alertprogessbar"
        }
        edu.system.alertOnModal(objNotify);
        me.getList_ThoiGian_DoiTuong_Mien();
        me.toggle_form();
    },
    delete_SoThangKhongHoc: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_NguoiHoc_SoThang/Xoa',
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
                    me.getList_ThoiGian_DoiTuong_Mien();
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
    getList_ThoiGian_DoiTuong_Mien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc_SoThang/LayDSThoiGian_DT_SoThang',

            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_STKH'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_STKH'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_STKH'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy_STKH'),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_STKH'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STKH'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_STKH'),
            'strNguoiThucHien_Id': "",
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.getList_TaiChinh_NguoiHoc_Mien();
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
    getList_SoThangKhongHoc: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_NguoiHoc_SoThang/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_STKH'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_STKH'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_STKH'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy_STKH'),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_STKH'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_STKH'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_STKH'),
            'strQLSV_NguoiHoc_Id': "",
            'strQLSV_DoiTuong_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,
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
                    me.dtSoThangKhongHoc = dtResult;
                    me.genData_SoThangKhongHoc(dtResult);
                }
                else {
                    edu.system.alert("QLTC_NguoiHoc_SoThang.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_NguoiHoc_SoThang.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    genData_SoThangKhongHoc: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].QLSV_NGUOIHOC_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(data[i].SOTHANG);
            point.attr("title", data[i].SOTHANG);
            point.attr("doituong_id", data[i].QLSV_DOITUONG_ID);
            point.attr("chuongtrinh_id", data[i].DAOTAO_TOCHUCCHUONGTRINH_ID);
            var html = '';
            html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            html += '<i class="fa fa-edit"></i>';
            html += '</span>';
            point.parent().append(html);
            point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_SoThangKhongHoc: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropEdit_ChuongTrinh", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("dropEdit_KieuHoc", data.KIEUHOC_ID);
        edu.util.viewValById("dropEdit_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropEdit_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtEdit_MucMien", data.SOTHANG);
        edu.util.viewValById("dropEdit_DoiTuong", data.QLSV_DOITUONG_ID);
        $("#lblEdit_ChuongTrinh").html(data.DAOTAO_TOCHUCCHUONGTRINH_TEN);
        $("#lblEdit_SinhVien").html(data.QLSV_NGUOIHOC_MASO + " - " + data.QLSV_NGUOIHOC_HODEM + " " + data.QLSV_NGUOIHOC_TEN);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.SoThangKhongHoc;
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
        var me = main_doc.SoThangKhongHoc;
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
        var me = main_doc.SoThangKhongHoc;

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
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strChuongTrinhDaoTao_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_LopQuanLy(obj_LopQL, "", "", me.cbGenCombo_LopQuanLy);
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
            renderPlace: ["dropHeDaoTao_STKH"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.SoThangKhongHoc;
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
            renderPlace: ["dropKhoaDaoTao_STKH"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.SoThangKhongHoc;
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
            renderPlace: ["dropChuongTrinhDaoTao_STKH", "dropChuongTrinhDaoTao_Form_STKH", "dropEdit_ChuongTrinh"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.SoThangKhongHoc;
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
            renderPlace: ["dropLopQuanLy_STKH"],
            type: "",
            title: "Chọn lớp quản lý",
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
    //        strTuKhoa: $("#txtKeyword_STKH").val(),
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
            renderPlace: ["dropNew_ThoiGianDaoTao", "dropThoiGianDaoTao_STKH", "dropEdit_ThoiGian"],
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
            renderPlace: ["dropKieuHoc_STKH", "dropNew_KieuHoc", "dropEdit_KieuHoc"],
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
            renderPlace: ["dropKhoanThu_STKH", "dropNew_KhoanThu", "dropEdit_LoaiKhoan"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;
        var obj_SV = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: "",
            strNganh_Id: "",
            strLopQuanLy_Id: edu.util.getValById("dropLopQuanLy_STKH"),
            iTrangThai: -1,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000
        }
        edu.system.getList_SinhVien(obj_SV, "", "", me.cbGenTable_SinhVien);
    },
    cbGenTable_SinhVien: function (data, iPager) {
        var me = main_doc.SoThangKhongHoc;//global variable

        var jsonForm = {
            strTable_Id: "tbldata_SinhVien_Selected",
            aaData: data,
            colPos: {
                left: [1, 2],
                center: [0, 8],
                fix: [0, 3]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        return strHoTen;
                    }
                }
                , {
                    "mData": "NGAYSINH",
                    "mRender": function (nRow, aData) {
                        var strNgaySinh = edu.util.returnEmpty(aData.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(aData.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(aData.NGAYSINH_NAM);
                        return strNgaySinh;
                    }
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<select class="select-opt" id="dropNew_ChuongTrinh_' + aData.ID + '"></select>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<select class="select-opt" id="dropNew_DoiTuong_' + aData.ID + '"</select>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtNew_PhanTramMien_' + aData.ID + '"</select>';
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
        for (var i = 0; i < data.length; i++) {
            $("#dropNew_DoiTuong_" + data[i].ID).html($("#dropEdit_DoiTuong").html());

            $("#dropNew_DoiTuong_" + data[i].ID).select2();
            me.getList_ChuongTrinh_SinhVien(data[i].ID, "dropNew_ChuongTrinh_" + data[i].ID);
        }
    },

    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    getList_ChuongTrinh_SinhVien: function (strSinhVien_Id, strDropId) {
        var me = this;

        var obj_list = {
            'action': 'SV_ChuongTrinhCuaHocVien/LayDanhSach',
            'versionAPI': 'v1.0',

            'strQLSV_NguoiHoc_Id': strSinhVien_Id
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
                    me.loadToCombo_ChuongTrinh_SinhVien(dtResult, strDropId);
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
    loadToCombo_ChuongTrinh_SinhVien: function (data, strDropId) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.DAOTAO_CHUONGTRINH_MA + " " + aData.DAOTAO_CHUONGTRINH_TEN;
                },
                selectOne: true
            },
            renderPlace: [strDropId],
            type: "",
            title: "Chọn chương trình",
            selectOne: true
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDropId).select2();
    },
};