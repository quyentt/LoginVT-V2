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
function MucPhiNienChe() { };
MucPhiNienChe.prototype = {
    dtCot: [],
    dtMucPhi: [],
    strMucPhi_Id: '',

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
            me.getList_ThoiGian_MucPhi_SoTien();
        });
        $('#dropHeDaoTao_MPL').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_MPL");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_ChuongTrinhDaoTao_ComBo();
        });
        $('#dropKhoaDaoTao_MPL').on('select2:select', function () {
            me.getList_ChuongTrinhDaoTao_ComBo();
        });
        $('#dropChuongTrinhDaoTao_MPL').on('select2:select', function () {
            me.getList_ThoiGian_MucPhi_SoTien();
            me.getList_LopQuanLy();
        });
        $('#dropDonViTinh_MPL').on('select2:select', function () {
            if ($('#dropDonViTinh_MPL').val() == "") return;
            me.getList_ThoiGianDaoTao();
            me.getList_ThoiGian_MucPhi_SoTien();
        });
        $('#dropNew_Lop').on('select2:select', function () {
            if ($('#dropDonViTinh_MPL').val() == "") return;
            me.getList_SinhVienMD();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblMucPhiNienChe";
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
                    me.save_MucPhiSoTien(arrSave[i]);
                }
            });
        });
        $("#btnCapNhatAll").click(function () {
            var strTable_Id = "tblMucPhiNienChe";
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
                me.save_MucPhiSoTien(arrSave[i]);
            }
        });
        $("#btnSave").click(function () {
            me.save_MucPhiSoTien_One();
        });
        $("#btnDelete").click(function () {
            me.delete_MucPhiSoTien(me.strMucPhi_Id);
        });
        $("#btnAddNew").click(function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_MPL");
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_MPL");
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_MPL");
            var strDonViPhi_Id = edu.util.getValById("dropDonViTinh_MPL");
            if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "" || strDonViPhi_Id == "" || strChuongTrinh_Id == "") {
                edu.system.alert("Hãy chọn Hệ - Khóa trước - Chương trình - Đơn vị tính !", "w");
                return;
            }
            me.resetPopup();
            me.popup();
        });
        $("#tblMucPhiNienChe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strMucPhi_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtMucPhi, "ID");
            me.viewForm_MucPhiSoTien(data[0]);
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.NVAP", "dropNghiepVu_MPL,dropNew_NghiepVu", "Chọn nghiệp vụ áp dụng");
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
        edu.util.viewValById("dropNew_Lop", "");
        edu.util.viewValById("dropNew_SinhVien", "");
        edu.util.viewValById("dropNew_LoaiKhoan", "");
        edu.util.viewValById("dropNew_ThoiGian", "");
        edu.util.viewValById("dropNew_DonViTinh", "");
        edu.util.viewValById("dropNew_NghiepVu", "");
        edu.util.viewValById("txtNew_NgayApDung", "");
        edu.util.viewValById("txtNew_MucPhi", "");
        me.strMucPhi_Id = "";
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    save_MucPhiSoTien_One: function () {
        me = this;
        var strPhamViApDung_Id = edu.util.getValById('dropNew_SinhVien');
        var aDataSV = me.dtSinhVien.find(e => e.ID == strPhamViApDung_Id);
        strPhamViApDung_Id = aDataSV.QLSV_NGUOIHOC_ID + aDataSV.DAOTAO_TOCHUCCHUONGTRINH_ID;
        
        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_MucPhi_SoTien/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': me.strMucPhi_Id,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': edu.util.getValById('txtNew_NgayApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropNew_ThoiGian'),
            'dTongSoTien': edu.util.getValById('txtNew_MucPhi').replace(/,/g, ""),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropNew_LoaiKhoan'),
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu': "",
        };
        if (me.strMucPhi_Id != "" && me.strMucPhi_Id != undefined) {
            obj_save.action = "TC_MucPhi_SoTien/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strMucPhi_Id == "") {
                        objNotify = {
                            content: "Thêm mới thành công",
                            type: "s"
                        }
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        objNotify = {
                            content: "Cập nhật thành công",
                            type: "w"
                        }
                        edu.system.alert("Cập nhật thành công");
                    }

                    me.getList_ThoiGian_MucPhi_SoTien();
                }
                else {
                    objNotify = {
                        content: "QLTC_MucPhi_SoTien.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("QLTC_MucPhi_SoTien.ThemMoi (er): " + JSON.stringify(er));
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
    save_MucPhiSoTien: function (point) {
        me = this;

        var strHocKy_Ids = point.id.substring(70);
        var dHeSo = $(point).val();
        var strHocPhan_Ids = point.id.substring(5, 69);
        var strId = $(point).attr("name");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_MucPhi_SoTien/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': strId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
            'strPhamViApDung_Id': strHocPhan_Ids,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dTongSoTien': dHeSo.replace(/,/g, ""),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
            'dKeThua': edu.util.getValById('dropNew_KeThua_All'),
            'strGhiChu': "",
        };
        if (strId != "" && strId != undefined) {
            obj_save.action = "TC_MucPhi_SoTien/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_MucPhiSoTien();
                }
                else {
                    edu.system.alert("QLTC_MucPhi_SoTien.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("QLTC_MucPhi_SoTien.ThemMoi (er): " + JSON.stringify(er));
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
        var me = main_doc.MucPhiNienChe;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_MucPhi_SoTien();
    },
    delete_MucPhiSoTien: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_MucPhi_SoTien/Xoa',
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
                    me.getList_ThoiGian_MucPhi_SoTien();
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
    getList_ThoiGian_MucPhi_SoTien: function () {
        var me = this;

        //--Edit
        //var obj_list = {
        //    'action': 'TC_MucPhi_Lop/LayDSThoiGian_MucPhi_Lop_Tien',

        //    'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_MPL'),
        //    'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MPL'),
        //    'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MPL'),
        //    'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
        //    'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
        //    'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
        //    'strNguoiThucHien_Id': "",
        //    'strTuKhoa': "",
        //    'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MPL'),
            
        //}
        var obj_save = {
            'action': 'TC_ThuChi3_MH/DSA4BRIVKS4oBiggLx4MNCIRKSgeEhceFSgkLwPP',
            'func': 'PKG_TAICHINH_THUCHI3.LayDSThoiGian_MucPhi_SV_Tien',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_MPL'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MPL'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MPL'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MPL'),
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.getList_ChuongTrinhDaoTao(edu.util.getValById('dropKhoaDaoTao_MPL'));
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
            },
            type: "POST",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_MucPhiSoTien: function () {
        var me = this;

        //var obj_list = {
        //    'action': 'TC_MucPhi_Lop/LayDanhSach',
        //    'versionAPI': 'v1.0',

        //    'strTuKhoa': "",
        //    'strPhamViApDung_Id': "",
        //    'strPhanCapApDung_Id': "",
        //    'strNgayApDung': "",
        //    'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
        //    'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
        //    'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_MPL'),
        //    'strNguoiThucHien_Id': "",
        //    'pageIndex': 1,
        //    'pageSize': 100000,

        //    'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MPL'),
        //    'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MPL'),
        //    'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MPL'),
        //    'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
        //}
        var obj_save = {
            'action': 'TC_ThuChi3_MH/DSA4BRIVAh4MNCIRKSgeEhceBTQNKCQ0',
            'func': 'PKG_TAICHINH_THUCHI3.LayDSTC_MucPhi_SV_DuLieu',
            'iM': edu.system.iM,
            'strTuKhoa': "",
            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_MPL'),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,

            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MPL'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MPL'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MPL'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
        };

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
                    me.dtMucPhi = dtResult;
                    me.genTable_MucPhiSoTien(dtResult);
                }
                else {
                    edu.system.alert("QLTC_MucPhi_SoTien.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_MucPhi_SoTien.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_MucPhiSoTien: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].PHAMVIAPDUNG_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(edu.util.formatCurrency(data[i].TONGSOTIEN));
            point.attr("title", data[i].TONGSOTIEN);
            //var html = '';
            //html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            //html += '<i class="fa fa-edit"></i>';
            //html += '</span>';
            //point.parent().append(html);
            //point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_MucPhiSoTien: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropNew_Lop", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNew_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropNew_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropNew_DonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropNew_NghiepVu", data.NGHIEPVUAPDUNG_ID);
        edu.util.viewValById("txtNew_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtNew_MucPhi", edu.util.formatCurrency(data.TONGSOTIEN));
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.MucPhiNienChe;
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
        var me = main_doc.MucPhiNienChe;
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
        var me = main_doc.MucPhiNienChe;
        
        //var obj_list = {
        //    'action': 'TC_MucPhi_Lop/LayDSTaiChinh_LopQL_SoTien',
        //    'versionAPI': 'v1.0',

        //    'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_MPL'),
        //    'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MPL'),
        //    'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MPL'),
        //    'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
        //    'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
        //    'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
        //    'strNguoiThucHien_Id': "",
        //    'strTuKhoa': "",
        //    'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MPL'),
        //}
        var obj_save = {
            'action': 'TC_ThuChi3_MH/DSA4BRIVICgCKSgvKR4SFx4SLhUoJC8P',
            'func': 'PKG_TAICHINH_THUCHI3.LayDSTaiChinh_SV_SoTien',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_MPL'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MPL'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MPL'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_MPL'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_MPL'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_MPL'),
            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_MPL'),
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
                    me.genTable_ChuongTrinhDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
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
    getList_ChuongTrinhDaoTao_ComBo: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.MucPhiNienChe;

        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: $("#dropKhoaDaoTao_MPL").val(),
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
            strKhoaDaoTao_Id: $("#dropKhoaDaoTao_MPL").val(),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: $("#dropChuongTrinhDaoTao_MPL").val(),
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
            renderPlace: ["dropHeDaoTao_MPL"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.MucPhiNienChe;
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
            renderPlace: ["dropKhoaDaoTao_MPL"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.MucPhiNienChe;
        var jsonForm = {
            strTable_Id: "tblMucPhiNienChe",
            aaData: data,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    //"mDataProp": "DAOTAO_LOPQUANLY_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) +" - " +  edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM)+" " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) +" - " + edu.util.returnEmpty(aData.DAOTAO_LOPQUANLY_TEN) + " - " +  edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN);
                    }
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Lớp</th >';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        $("#tblMucPhiNienChe thead tr").html(rowth);
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
        me.getList_MucPhiSoTien();
        edu.system.move_ThroughInTable("tblMucPhiNienChe");
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
            renderPlace: ["dropNew_ChuongTrinh", "dropChuongTrinhDaoTao_MPL"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.MucPhiNienChe;
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
            renderPlace: ["dropNew_Lop"],
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


        var obj_list = {
            'action': 'TC_ThoiGianTheoDonViTinh/LayThoiGianTheoDonViTinh',
            'versionAPI': 'v1.0',

            'strDonViTinh_Id': $("#dropDonViTinh_MPL option:selected").attr("id")
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
    //        strTuKhoa: $("#txtKeyword_MPL").val(),
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
            renderPlace: ["dropNew_ThoiGian", "dropThoiGianDaoTao_MPL"],
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
            renderPlace: ["dropKieuHoc_MPL", "dropNew_KieuHoc"],
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
            renderPlace: ["dropKhoanThu_MPL", "dropNew_LoaiKhoan"],
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
            renderPlace: ["dropDonViTinh_MPL", "dropNew_DonViTinh"],
            type: "",
            title: "Chọn đơn vị tính",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_SinhVienMD: function (type, palce) {
        //--Edit
        var me = this;

        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNamNhapHoc': '',
            'strKhoaQuanLy_Id': '',
            'strHeDaoTao_Id': '',
            'strKhoaDaoTao_Id': '',
            'strChuongTrinh_Id': '',
            'strLopQuanLy_Id': edu.util.getValById('dropNew_Lop'),
            'strTrangThaiNguoiHoc_Id': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    me["dtSinhVien"] = data.Data;
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "MA",
                            avatar: "MA",
                            mRender: function (nRow, aData) {
                                return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN)
                            }
                        },
                        renderPlace: ["dropNew_SinhVien"],
                        type: "",
                        title: "Chọn sinh viên",
                    }
                    edu.system.loadToCombo_data(obj);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
        //
    },
};