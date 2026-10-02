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
function DonViPhiKhoa() { };
DonViPhiKhoa.prototype = {
    dtCot: [],
    dtDonViPhi: [],
    strDonViPhi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();
        /*------------------------------------------
        --Discription: Initial page KhoanThu
        -------------------------------------------*/

        $("#btnSearch").click(function () {
            me.getList_ThoiGian_DonViPhi_SoTien();
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function () {
            me.getList_ThoiGian_DonViPhi_SoTien();
            me.getList_KhoaDaoTao();
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function () {
            me.getList_ChuongTrinhDaoTao();
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function () {
            me.getList_ThoiGian_DonViPhi_SoTien();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/

        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblDonViPhiKhoa";
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
                    me.save_DonViPhiSoTien(arrSave[i]);
                }
            });
        });
        $("#btnCapNhatAll").click(function () {
            var strTable_Id = "tblDonViPhiKhoa";
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
                me.save_DonViPhiSoTien(arrSave[i]);
            }
        });
        $("#btnSave").click(function () {
            me.save_DonViPhiSoTien_One();
        });
        $("#btnKeThua").click(function () {
            $("#myModal").modal("hide");
            edu.system.confirm('Bạn có chắc chắn muốn kế thừa cho toàn bộ chương trình <span class="bold active">' + $("#dropSearch_ChuongTrinh option:selected").text() + '</span> - khóa <span class="bold active">' + $("#dropSearch_KhoaDaoTao option:selected").text() + '</span>');
            $("#btnYes").click(function (e) {

            });
        });
        $("#btnDelete").click(function () {
            me.delete_DonViPhiSoTien(me.strDonViPhi_Id);
        });
        $("#btnAddNew").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropSearch_HeDaoTao");
            var strKhoaDaoTao_Id = edu.util.getValById("dropSearch_KhoaDaoTao");
            var strChuongTrinh_Id = edu.util.getValById("dropSearch_ChuongTrinh");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "" || strChuongTrinh_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa - Chương trình trước!", "w");
                return;
            }
            me.resetPopup();
            me.popup();
        });
        $("#tblDonViPhiKhoa").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strDonViPhi_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtDonViPhi, "ID");
            me.viewForm_DonViPhiSoTien(data[0]);
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
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropDonViPhi", "");
        edu.util.viewValById("dropLoaiKhoan", "");
        edu.util.viewValById("dropThoiGianDaoTao", "");
        edu.util.viewValById("dropDonViTinh", "");
        edu.util.viewValById("dropNghiepVu", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtMucPhi", "");
        me.strDonViPhi_Id = "";
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    save_DonViPhiSoTien_One: function () {
        me = this;
        
        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/ThemMoi',
            'versionAPI': 'v1.0',

            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc'),
            'strId': me.strDonViPhi_Id,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': edu.util.getValById('dropDonViPhi'),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'dTongSoTien': edu.util.getValById('txtMucPhi').replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan'),
            'dKeThua': edu.util.getValById('dropKeThua'),
            'strGhiChu': "",
        };
        if (me.strDonViPhi_Id != "" && me.strDonViPhi_Id != undefined) {
            obj_save.action = "TC_DonViPhi_SoTien/Sua_TaiChinh_DonViPhi_SoTien";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strDonViPhi_Id == "") {
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

                    me.getList_ThoiGian_DonViPhi_SoTien();
                }
                else {
                    objNotify = {
                        content: "QLTC_DonViPhi_SoTien.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alertOnModal();
                }
            },
            error: function (er) {
                edu.system.alert("QLTC_DonViPhi_SoTien.ThemMoi (er): " + JSON.stringify(er));
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
    save_DonViPhiSoTien: function (point) {
        me = this;

        var strHocKy_Ids = point.id.substring(38);
        var dHeSo = $(point).val();
        var strHocPhan_Ids = point.id.substring(5, 37);
        var strId = $(point).attr("name");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/ThemMoi',
            'versionAPI': 'v1.0',
            
            'strDiem_KieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),

            'strId': strId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': strHocPhan_Ids,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dTongSoTien': dHeSo.replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'dKeThua': edu.util.getValById('dropKeThua_All'),
            'strGhiChu': "",
        };
        if (strId != "" && strId != undefined) {
            obj_save.action = "TC_DonViPhi_SoTien/Sua_TaiChinh_DonViPhi_SoTien";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_DonViPhiSoTien();
                }
                else {
                    edu.system.alert("QLTC_DonViPhi_SoTien.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("QLTC_DonViPhi_SoTien.ThemMoi (er): " + JSON.stringify(er));
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
    save_KeThua: function () {
        me = this;

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/KeThua',
            'versionAPI': 'v1.0',

            'strDaoTao_KhoaDaoTao_Goc_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strChuongTrinh_Goc_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công");
                    me.getList_ThoiGian_DonViPhi_SoTien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(er);
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
        var me = main_doc.DonViPhiKhoa;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_DonViPhi_SoTien();
    },
    delete_DonViPhiSoTien: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/Xoa',
            'versionAPI': 'v1.0',

            'strId': strId,
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
                    me.getList_ThoiGian_DonViPhi_SoTien();
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
    getList_ThoiGian_DonViPhi_SoTien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien',

            'strDiem_KieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu'),
            'strNguoiThucHien_Id': "",
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.getList_ChuongTrinhDaoTao(edu.util.getValById('dropKhoaDaoTao'));
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
    getList_DonViPhi: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_DonViPhi_SoTien/LayDSTaiChinh_Lop_DonViPhi',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

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
                    me.dtDonViPhi = dtResult;
                    me.genTable_DonViPhiSoTien(dtResult);
                    me.cbGenCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(er.Message, "w");
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
    getList_DonViPhiSoTien: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_DonViPhi_SoTien/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDiem_KieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),

            'strTuKhoa': "",
            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
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
                    me.dtDonViPhi = dtResult;
                    me.genTable_DonViPhiSoTien(dtResult);
                }
                else {
                    edu.system.alert("QLTC_DonViPhi_SoTien.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_DonViPhi_SoTien.LayDanhSach (er): " + JSON.stringify(er), "w");
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

    genTable_DonViPhi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDonViPhiKhoa",
            aaData: data,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Hệ</th >';
        rowth += '<th class="td-center">Khóa</th >';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        $("#tblDonViPhiKhoa thead tr").html(rowth);
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
        me.getList_DonViPhiSoTien();
        edu.system.move_ThroughInTable("tblDonViPhiKhoa");
    },
    genTable_DonViPhiSoTien: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].PHAMVIAPDUNG_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(edu.util.formatCurrency(data[i].TONGSOTIEN));
            point.attr("title", edu.util.formatCurrency(data[i].TONGSOTIEN));
            var html = '';
            html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            html += '<i class="fa fa-edit"></i>';
            html += '</span>';
            point.parent().append(html);
            point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_DonViPhiSoTien: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropDonViPhi", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropLoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropNghiepVu", data.NGHIEPVUAPDUNG_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtMucPhi", edu.util.formatCurrency(data.TONGSOTIEN));
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
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
    getList_KieuHoc: function () {
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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh"],
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachXuLy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropKeHoachXuLy_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
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
        main_doc.KeHoachXuLy.dtTrangThai = data;
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
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
            renderPlace: ["dropSearch_KieuHoc", "dropKieuHoc"],
            type: "",
            title: "Chọn kiểu học",
        };
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
            renderPlace: ["dropKhoanThu", "dropLoaiKhoan"],
            type: "",
            title: "Chọn khoản thu",
        };
        edu.system.loadToCombo_data(obj);
    },
};