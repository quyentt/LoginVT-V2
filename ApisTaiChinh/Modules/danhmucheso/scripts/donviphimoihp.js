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
function DonViPhi() { };
DonViPhi.prototype = {
    dtCot: [],
    dtDonViPhi: [],
    dtNganhTheoKhoa: '',
    strDonViPhi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        

        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();
        me.getList_ThoiGian_DVP();
        me.getList_CoCauToChuc();
        me.getList_HocPhan();
        /*------------------------------------------
        --Discription: Initial page KhoanThu
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnKhaiNhanh").click(function () {
            me.toggle_edit();
        });
        $("#btnSearch").click(function () {
            me.getList_ThoiGian_DVP();
        });
        $('#dropHeDaoTao_DVP').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_DVP");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
        });
        $('#dropKhoaDaoTao_DVP').on('select2:select', function () {
            me.getList_ThoiGian_DonViPhi_SoTien();
            me.getList_ChuongTrinhDaoTao_ComBo();
        });

        $('#dropHeDaoTao_DVP_Edit').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_DVP_Edit");
            me.getList_KhoaDaoTao_Edit(strHeHaoTao_Id);
        });

        $('#dropKhoaDaoTao_DVP_Edit').on('select2:select', function () {
            me.getList_NganhTheoKhoa();
            me.resetCombobox(this);
        });

        $("#btnSearch_Edit").click(function () {
            me.getList_NganhTheoKhoa();
        });

        $('#dropHeDaoTao_KT').on('select2:select', function () {
            me.getList_ThoiGian_DVP();
        });
        $('#dropKhoaDaoTao_KT').on('select2:select', function () {
            me.getList_ThoiGian_DVP();
        });

        $('#dropNew_DonVi').on('select2:select', function () {
            me.getList_HocPhan();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblDonViPhi";
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
            var strTable_Id = "tblDonViPhi";
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
        $("#btnDelete").click(function () {
            me.delete_DonViPhiSoTien(me.strDonViPhi_Id);
        });
        $("#btnAddNew").click(function () {
            //var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao_DVP");
            //var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_DVP");
            //if (strHeDaoTao_Id == "" || strKhoaDaoTao_Id == "") {
            //    edu.system.alert("Hãy chọn Hệ - Khóa - Chương trình trước!", "w");
            //    return;
            //}
            me.resetPopup();
            me.popup();
        });
        $("#tblDonViPhi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strDonViPhi_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtDonViPhi, "ID");
            me.viewForm_DonViPhiSoTien(data[0]);
        });


        $("[id$=chkSelectAll_KhaiNhanh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhaiNhanh" });
        });

        $("#tblKhaiNhanh").delegate(".inputMucPhi", "keyup", function (e) {
            var strVal = $(this).val();
            var x = "#checkX" + this.id.replace(/input_/g, "");
            if (strVal) {
                $(x).attr('checked', true);
                $(x).prop('checked', true);
            } else {
                $(x).attr('checked', false);
                $(x).prop('checked', false);
            }
        });

        $("#btnSave_KhaiNhanh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhaiNhanh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                arrChecked_Id.forEach(e => {
                    me.save_KhaiNhanh(e);
                });
            });
        });

        $("#btnSearch_ThemNhanhMucPhi").click(function () {
            var strMucPhi = edu.util.getValById("txtMucPhiThemNhanh_Edit");
            $("#tblKhaiNhanh .inputMucPhi").each(function () {
                $(this).val(strMucPhi)
            })
        });

        edu.system.getList_KhoaQuanLy({}, "", "", data => {
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropKhoaQuanLy_DVP_Edit", "dropKhoaQuanLy_DVP"],
                type: "",
                title: "Chọn khoa quản lý",
            }
            edu.system.loadToCombo_data(obj);
        });
        edu.extend.genBoLoc_HeKhoa("_KT");
        $("#btnKeThua").click(function () {
            $("#myModalKeThua").modal("show");

            edu.util.viewValById("dropKhoanThu_KT", edu.util.getValById("dropKhoanThu_HPST"));
            edu.util.viewValById("dropKieuHoc_KT", edu.util.getValById("dropKieuHoc_HPST"));
            //edu.util.viewValById("dropThoiGianDaoTao_KT", edu.util.getValById("dropThoiGianDaoTao_DVP"));
            edu.util.viewValById("dropHeDaoTao_KT", edu.util.getValById("dropHeDaoTao_HPST"));
        })
        $("#btnSave_KeThua").click(function () {
            $("#myModalKeThua").modal("hide");
            me.save_KeThua();
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
        edu.util.viewValById("dropNew_LoaiKhoan", $("#dropKhoanThu_DVP").val());
        edu.util.viewValById("dropNew_ThoiGian", $("#dropThoiGianDaoTao_DVP").val());
        edu.util.viewValById("dropNew_DonViTinh", "");
        edu.util.viewValById("dropNew_NghiepVu", "");
        edu.util.viewValById("txtNew_NgayApDung", "");
        edu.util.viewValById("dropNew_KieuHoc", $("#dropKieuHoc_DVP").val());
        edu.util.viewValById("txtNew_MucPhi", "");
        me.strDonViPhi_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
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

            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_DVP'),
            'strId': me.strDonViPhi_Id,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNew_NghiepVu'),
            'strDonViTinh_Id': edu.util.getValById('dropNew_DonViTinh'),
            'strPhamViApDung_Id': edu.util.getValById('dropNew_HocPhan'),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': edu.util.getValById('txtNew_NgayApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropNew_ThoiGian'),
            'dTongSoTien': edu.util.getValById('txtNew_MucPhi').replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropNew_LoaiKhoan'),
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
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

                    me.getList_ThoiGian_DVP();
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
            
            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_DVP'),

            'strId': strId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_DVP'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_DVP'),
            'strPhamViApDung_Id': strHocPhan_Ids,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dTongSoTien': dHeSo.replace(/,/g, ''),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_DVP'),
            'dKeThua': edu.util.getValById('dropNew_KeThua_All'),
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
    endLuuHeSo: function () {
        var me = main_doc.DonViPhi;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_DVP();
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
                    me.getList_ThoiGian_DVP();
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
            'action': 'TC_ThuChi/LayDSThoiGian_DonViPhi_SoTien',
            
            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_DVP'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropKhoaQuanLy_DVP'),

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_DVP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_DVP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_DVP'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_DVP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_DVP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_DVP'),
            'strNguoiThucHien_Id': "",
        }
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    //me.getList_ChuongTrinhDaoTao(edu.util.getValById('dropKhoaDaoTao_DVP'));
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
    getList_DonViPhiSoTien: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_DonViPhi_SoTien/LayDanhSach',
            'versionAPI': 'v1.0',

            'strDiem_KieuHoc_Id': edu.util.getValById('dropKieuHoc_DVP'),

            'strTuKhoa': "",
            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_DVP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_DVP'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_DVP'),
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

    getList_NganhTheoKhoa: function () {
        var me = this;

        //var obj_list = {
        //    'action': 'KHCT_ToChucChuongTrinh/LayDSNganhTheoKhoa',
        //    'type': 'GET',
        //    'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo("dropKhoaDaoTao_DVP_Edit"),
        //    'strNguoiThucHien_Id': edu.system.userId,
        //};
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSNganhTheoKhoa',
            'type': 'GET',
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_DVP_Edit'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropKhoaQuanLy_DVP_Edit'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtNganhTheoKhoa = dtResult;
                    me.genTable_NganhTheoKhoa(dtResult);
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
        edu.util.viewValById("dropNew_HocPhan", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNew_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropNew_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropNew_DonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropNew_KieuHoc", data.KIEUHOC_ID);
        edu.util.viewValById("dropNew_NghiepVu", data.NGHIEPVUAPDUNG_ID);
        edu.util.viewValById("txtNew_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtNew_MucPhi", edu.util.formatCurrency(data.TONGSOTIEN));
    },

    genTable_NganhTheoKhoa: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKhaiNhanh",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN "
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" class="inputMucPhi form-control"  id="input_' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.DonViPhi;
        //var obj_HeDT = {
        //    strHinhThucDaoTao_Id: "",
        //    strBacDaoTao_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 1000
        //};
        //edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_DVP_Edit'),
            'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_BacDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HeDaoTao(json);
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
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = main_doc.DonViPhi;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            var obj_list = {
                'action': 'KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaDaoTao_DVP_Edit'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_DVP_Edit'),
                'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        me.cbGenCombo_KhoaDaoTao(json);
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
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_Dong: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.DonViPhi;

        var obj_save = {
            'action': 'TC_ThuChi2_MH/DSA4BRIJLiIRKSAvCikgKAUuLxcoESko',
            'func': 'pkg_taichinh_thuchi2.LayDSHocPhanKhaiDonViPhi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    
                    me.genTable_Dong(dtResult);
                    me.cbGenCombo_Dong(dtResult)
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert( JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ChuongTrinhDaoTao_ComBo: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.DonViPhi;

        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: $("#dropKhoaDaoTao_DVP").val(),
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
    getList_KhoaDaoTao_Edit: function (strHeDaoTao_Id) {
        var me = main_doc.DonViPhi;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao_Edit);
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
            renderPlace: ["dropHeDaoTao_DVP", "dropHeDaoTao_DVP_Edit"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.DonViPhi;
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
            renderPlace: ["dropKhoaDaoTao_DVP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao_Edit: function (data) {
        var me = main_doc.DonViPhi;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao_DVP_Edit"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_Dong: function (data) {
        var me = main_doc.DonViPhi;
        var jsonForm = {
            strTable_Id: "tblDonViPhi",
            aaData: data,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Mã học phần</th >';
        rowth += '<th class="td-center">Tên học phần</th >';
        rowth += '<th class="td-center">Học trình</th >';
        rowth += '<th class="td-center">Đơn vị</th >';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        $("#tblDonViPhi thead tr").html(rowth);
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
        me.getList_DonViPhiSoTien();
        edu.system.move_ThroughInTable("tblDonViPhi");
    },
    cbGenCombo_Dong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN)
                }
            },
            renderPlace: ["dropNew_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        //edu.system.loadToCombo_data(obj);
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
    //        strTuKhoa: $("#txtKeyword_DVP").val(),
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

    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropNew_DonVi", "dropSearch_BoMon"],
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HocPhan: function (strKhoaDaoTao_Id, position) {
        var me = main_doc.DonViPhi;

        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById("txtSearchModal_TuKhoa_HP"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropSearch_MonHocsadas"),
            'strThuocBoMon_Id': edu.util.getValById("dropNew_DonVi") ,
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropSearch_ThuocTinhHocPhanaaaa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    
                    me.genComBo_HocPhan(dtResult)
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (row, aData) {
                    return aData.MA + " - " + aData.TEN;
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
            renderPlace: ["dropNew_ThoiGian", "dropThoiGianDaoTao_DVP", "dropThoiGianDaoTao_DVP_Edit", "dropThoiGianDich_KT"],
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
            renderPlace: ["dropKieuHoc_DVP", "dropNew_KieuHoc", "dropKieuHoc_DVP_Edit", "dropKieuHoc_KT"],
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
            renderPlace: ["dropKhoanThu_DVP", "dropNew_LoaiKhoan", "dropKhoanThu_DVP_Edit", "dropKhoanThu_KT"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    save_KhaiNhanh: function (strNganhDaoTao_Id) {
        me = this;
        //var arrMucPhi = [];
        //for (var i = 0; i < arrNganhDaoTao_Id.length; i++) {
        //    arrMucPhi.push($("#input_" + arrNganhDaoTao_Id[i]).val());
        //}

        var dChoPheoSua = $('#ckhChoSua').is(':checkbox') ? 1 : 0;
        var obj_save = {
            'action': 'TC_DonViPhi_Nganh/ThemMoi',
            'type': 'POST',
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo("dropKhoaDaoTao_DVP_Edit").replace(/,/g, "#"),
            'strNganhDaoTao_Id': strNganhDaoTao_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_DVP_Edit'),
            'strKieuHoc_Id': edu.util.getValCombo("dropKieuHoc_DVP_Edit").replace(/,/g, "#"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_DVP_Edit'),
            'strMucPhi': $("#input_" + strNganhDaoTao_Id).val(),
            'dChoPheoSua': dChoPheoSua,
            'strNgayApDung': edu.util.getValById('txtNgayApDung_Edit'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_DonViPhiSoTien();
                    edu.system.alert("Thêm thành công");
                }
                else {
                    edu.system.alert("QLTC_DonViPhi_SoTien.ThemMoi: " + data.Message);
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
    
    getList_ThoiGian_DVP: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2_MH/DSA4BRIVKS4oBiggLx4FLi8XKBEpKB4JLiIRKSAv',
            'func': 'pkg_taichinh_thuchi2.LayDSThoiGian_DonViPhi_HocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDiem_KieuHoc_Id': edu.system.getValById('dropAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.genComBo_DVP(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
                me.getList_Dong();
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
    genComBo_DVP: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao_KT"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },

    save_KeThua: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2/KeThua_TaiChinh_DonViPhi_ST',
            'type': 'POST',
            'strDaoTao_HeDaoTao_N_Id': edu.util.getValById('dropHeDaoTao_KT'),
            'strDaoTao_KhoaDaoTao_N_Id': edu.util.getValById('dropKhoaDaoTao_KT'),
            'strDaoTao_ThoiGian_N_Id': edu.util.getValById('dropThoiGianDaoTao_KT'),
            'strTaiChinh_CacKhoanThu_N_Id': edu.util.getValById('dropKhoanThu_KT'),
            'strTaiChinh_KieuHoc_N_Id': edu.util.getValById('dropKieuHoc_KT'),
            'strDaoTao_ThoiGian_D_Id': edu.util.getValById('dropThoiGianDich_KT'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_HocPhanCT();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
};