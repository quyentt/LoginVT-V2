/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function BienDong() { };
BienDong.prototype = {
    dtDoiTuong: [],
    dtDoiTuong_View: [],
    dtBienDong: [],
    dtLop: [],
    dtTuKhoa: [],
    strHead: '',

    init: function () {
        var me = this;
        me.getList_CoCauToChuc();
        me.strHead = $("#tblBienDong thead").html();
        //me.getList_TuKhoa();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "dropLoaiBangLuong");
        
        $("#btnSearch").click(function (e) {
            
            me.getList_TuKhoa();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TuKhoa();
            }
        });

        $(".btnKeThua").click(function () {

            me.popup();
            me.resetPopup();
        });

        $(".btnAdd").click(function () {
            $('#myModalBienDong').modal('show');
            $("#btnNotifyModal").remove();
        });
        $("#btnSave_KeThua").click(function () {
            me.save_KeThua();
        });

        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });
        $("#dropDonVi").on("select2:select", function () {
            me.getList_HS2();
        });
        me.getList_TuKhoa2();
        $("#btnSaveBienDong").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblBienDong tbody input.doituongcheck");
            for (var i = 0; i < x.length; i++) {
                var point = $(x[i]);
                if (point.val() != point.attr("title")) {
                    if (point.val()) {
                        arrThem.push(x[i]);
                    } else {
                        arrXoa.push(point.attr("name"));
                    }
                }            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_KetQua(arrXoa[i]);
                    }
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_KetQua(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });
        $("#btnSave_BienDong").click(function () {
            me.save_KetQua2();
        });
        //$("#dropCanBo,#txtNam,#txtThang,#txtNgayApDung").blur(function () {
        //    me.getList_TuKhoa2();
        //});

        edu.system.getList_MauImport("zonebtnBaoCao_BD", function (addKeyValue) {
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
            addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy"));
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao"));
            addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao"));
            addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
            addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop"));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_HocKy"));
            addKeyValue("strTaiChinh_CacKhoanThu_Id", edu.util.getValCombo("dropSearch_KhoanThu"));
            addKeyValue("strDoiTuong_Id", edu.util.getValCombo("dropSearch_DoiTuong"));
            addKeyValue("strCheDoChinhSach_Id", edu.util.getValCombo("dropSearch_CheDo"));
        });
    },

    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        edu.util.viewValById("txtNamNguon", edu.util.getValById("txtSearch_Nam"));
        edu.util.viewValById("txtThangNguon", edu.util.getValById("txtSearch_Thang"));
    },

    getList_TuKhoa: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'L_TuKhoa_GiaTri/LayDSNhanSu_L_TuKhoa',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strThang': edu.util.getValById('txtSearch_Thang'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtTuKhoa = data.Data;
                    me.getList_BienDong();
                }
                else {
                    console.log(data.Message);
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
    getList_BienDong: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'L_TuKhoa_GiaTri/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strThang': edu.util.getValById('txtSearch_Thang'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtBienDong = data.Data;
                    me.genTable_BienDong(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
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
    genTable_BienDong: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblBienDong";
        $("#tblBienDong thead").html(me.strHead);
        me.dtTuKhoa.forEach(e => {
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center">' + e.TENTUKHOA +'</th>');
        });
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,

            colPos: {
                center: [0, 1, 2, 3, 4, 5],
            },
            "aoColumns": [
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "KHOADAOTAO",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                }
                , {
                    "mDataProp": "NGAYAPDUNG"
                }
            ]
        };
        me.dtTuKhoa.forEach(e => {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<input id="txtTuKhoa_' + aData.ID + '_' + main_doc.BienDong.dtTuKhoa[iThuTu].TUKHOA + '" class="doituongcheck form-control" />';
                    }
                }
            );
        });
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
        data.forEach(e => {
            //me.getList_KetQua(e.NHANSU_HOSOCANBO_ID);
            me.dtTuKhoa.forEach(ele => {
                console.log(e.NGAYAPDUNG);
                me.getList_KetQua(e.NHANSU_HOSOCANBO_ID, ele.TUKHOA, e.NGAYAPDUNG, e.ID);
            });
        });
    },
    getList_KetQua: function (strNhanSu_HoSoCanBo_Id, strTuKhoa, strNgayApDung, strId) {
        var me = this;
        var obj_list = {
            'action': 'L_TuKhoa_GiaTri/LayGiaTriNhanSu_L_TuKhoa',
            'type': 'GET',
            'strTuKhoa': strTuKhoa,
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strThang': edu.util.getValById('txtSearch_Thang'),
            'strNgayApDung': strNgayApDung,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data.Data.forEach(e => {
                        var point = $("#txtTuKhoa_" + strId + "_" + e.TUKHOA);
                        point.val(edu.util.returnEmpty(e.TUKHOA_GIATRI));
                        point.attr("name", e.ID);
                        point.attr("title", edu.util.returnEmpty(e.TUKHOA_GIATRI));
                    });
                    //for (var i = 0; i < data.Data.length; i++) {
                    //    var json = data.Data[i];
                    //    $("#txtSoThang_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).val(json.SOTHANG);
                    //    $("#txtSoThang_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).attr("title", json.SOTHANG);
                    //    $("#txtSoThang_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).attr("name", json.ID);
                    //    $("#txtPhanTram_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).val(json.PHANTRAMMIENGIAM);
                    //    $("#txtPhanTram_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).attr("title", json.PHANTRAMMIENGIAM);
                    //}
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_KetQua: function (point) {
        var me = this;
        var eId = point.id;
        var arrId = eId.split("_");
        var obj = me.dtBienDong.find(e => e.ID === arrId[1]);
        var obj_save = {
            'action': 'L_TuKhoa_GiaTri/ThemMoi',

            'strId': $(point).attr("name"),
            'strTuKhoa': arrId[2],
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': obj.NHANSU_HOSOCANBO_ID,
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strThang': edu.util.getValById('txtSearch_Thang'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strTuKhoa_GiaTri': $(point).val(),
            'strNgayApDung': obj.NGAYAPDUNG,
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'L_TuKhoa_GiaTri/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId) {
                        edu.system.alert("Cập nhật thành công");
                    } else {
                        edu.system.alert("Thêm mới thành công");
                    }             
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_BienDong();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KetQua: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'L_TuKhoa_GiaTri/Xoa',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_delete.action + JSON.stringify(er));
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_BienDong();
                });
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_KetQua2: function (point) {
        var me = this;
        var obj_save = {
            'action': 'L_TuKhoa_GiaTri/ThemMoi',

            'strId': "",
            'strTuKhoa': edu.util.getValById('dropThanhPhan'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropCanBo'),
            'strNam': edu.util.getValById('txtNam'),
            'strThang': edu.util.getValById('txtThang'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strTuKhoa_GiaTri': edu.util.getValById('txtGiaTri'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'L_TuKhoa_GiaTri/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_BienDong();
            //    });
            //},
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_TuKhoa2: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'L_TuKhoa_GiaTri/LayDSNhanSu_L_TuKhoa',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong11'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien1'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien1'),
            'strNam': edu.util.getValById('txtSearch_Nam1'),
            'strThang': edu.util.getValById('txtSearch_Thang1'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_TuKhoa(data.Data);
                }
                else {
                    console.log(data.Message);
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
    genComBo_TuKhoa: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "TUKHOA",
                parentId: "",
                name: "TENTUKHOA",
                code: "MA"
            },
            renderPlace: ["dropThanhPhan"],
            type: "",
            title: "Chọn thành phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien", "dropDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS2: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropDonVi"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS2(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS2: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropCanBo"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },

    save_KeThua: function () {
        var me = this;
        var obj_save = {
            'action': 'L_TuKhoa_GiaTri/KeThua',
            'type': 'POST',
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNam_Nguon': edu.util.getValById('txtNamNguon'),
            'strThang_Nguon': edu.util.getValById('txtThangNguon'),
            'strNam_Dich': edu.util.getValById('txtNamDich'),
            'strThang_Dich': edu.util.getValById('txtThangDich'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (obj_save.strId) {
                    //    edu.system.alert("Cập nhật thành công");
                    //} else {
                    //    edu.system.alert("Thêm mới thành công");
                    //}
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_BienDong();
            //    });
            //},
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}