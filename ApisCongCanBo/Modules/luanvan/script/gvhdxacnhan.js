/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function GVXacNhan() { };
GVXacNhan.prototype = {
    dtGVXacNhan: [],
    strGVXacNhan_Id: '',
    arrNhanSu_Id: [],
    strDeTai_Id: '',
    checkView: false,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //if ($("#btnSave_GVXacNhan").length > 0) me.checkView = false;
        //me.getList_ThoiGianDaoTao();
        me.getList_GVXacNhan();
        me.getList_KeHoach();
        edu.system.loadToCombo_DanhMucDuLieu("HD.TINHTRANG.XACNHANHUONGDAN", "dropTrangThaiXacNhan");
        
        $("#btnSearch").click(function (e) {
            me.getList_GVXacNhan();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_GVXacNhan();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#tblGVXacNhan").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strGVXacNhan_Id = strId;
            //me.toggle_edit()
            $("#GVHD_capnhattiendo_chitiet").modal("show");
            var aData = me.dtGVXacNhan.find(e => me.strGVXacNhan_Id == e.ID);
            $("#lblMaSo").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
            $("#lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            $("#lblLop").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_LOP));
            $("#lblChuongTrinh").html(edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN));
            $("#lblDeTaiTiengViet").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TEN));
            $("#lblDeTaiTiengAnh").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TENTA));
            $("#lblSoQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_SOQD));
            $("#lblNgayQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_NGAYQD));
            $("#lblNoiDung").html(edu.util.returnEmpty(aData.LYDODIEUCHINH));
            $("#lblTinhTrang").html(edu.util.returnEmpty(aData.BV_XACNHAN_HD_TEN));
            me.getList_ThanhVien();
            me.getList_TienDo();
            me["strPhanLoai_Id"] = aData.PHANLOAI_ID;
        });

        $("#tblGVXacNhan").delegate('.btnDuyet', 'click', function (e) {
            var strId = this.id;
            me["strGVXacNhan_Id"] = strId;
            //me.toggle_edit()
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            var aData = me.dtGVXacNhan.find(e => strId == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $(".btnSave_XacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropTrangThaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            var aData = me.dtGVXacNhan.find(e => me.strGVXacNhan_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtGVXacNhan_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_GVXacNhan();
        });


        $(".btnSearch_TienDo").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_TienDo(id, "");
        });
        $("#tblTienDo").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblTienDo tr[id='" + strRowId + "']").remove();
        });
        $("#tblTienDo").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_TienDo(strId);
            });
        });

        $("#btnSave_GVXacNhan").click(function (e) {
            var ISoLuong = $("#tblTienDo tbody tr").length
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", ISoLuong);
            $("#tblTienDo tbody tr").each(function () {
                me.save_TienDo(this.id);
            });
        });

    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_GVXacNhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_Duyet',
            'type': 'GET',
            'strBV_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //var obj_list = {
        //    'action': 'LVLA_BV_KeHoach/LayDSBV_Kehoach_NguoiHoc',
        //    'type': 'GET',
        //    'strTuKhoa': edu.util.getValById('txtSearch'),
        //    'strBV_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
        //    'strNguoiThucHien_Id': edu.system.userId,
        //    'pageIndex': edu.system.pageIndex_default,
        //    'pageSize': edu.system.pageSize_default,
        //};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGVXacNhan = dtReRult;
                    me.genTable_GVXacNhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

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
    genTable_GVXacNhan: function (data, iPager) {
        var me = this;
        $("#lblGVXacNhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGVXacNhan",

            //bPaginate: {
            //    strFuntionName: "main_doc.GVXacNhan.getList_GVXacNhan()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "BV_KEHOACH_DETAI_TEN"
                },
                {
                    "mDataProp": "QLSV_QUYETDINH_SOQD"
                },
                {
                    "mDataProp": "LYDODIEUCHINH"
                },
                {
                    //"mDataProp": "BV_XACNHAN_HD_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.BV_XACNHAN_HD_TEN) + ' <span><a class="btn btn-default btnDuyet" id="' + aData.ID + '" title="Duyệt"><i class="fal fa-check-circle color-active"></i> Xác nhận</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_ThanhVien: function () {
        var me = this;

        var aData = me.dtGVXacNhan.find(e => e.ID == me.strGVXacNhan_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_HD',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strGVXacNhan_Id,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        $("#tblNguoiHuongDan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(aData.VAITRO_TEN) + '</td>';
            row += '<td class="txtFileDinhKem"><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
            row += '<td style="text-align: center"></td>';
            row += '</tr>';
            $("#tblNguoiHuongDan tbody").append(row);
            edu.system.viewFiles("txtFileDinhKem" + strKetQua_Id, strKetQua_Id, "LVLA_Files");
            //me.genComBo_CanBo("dropCanBo" + strKetQua_Id, aData.NGUOIDUNG_ID);
            //me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, aData.VAITRO_ID);
        }
    },
    getList_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSKeHoachTheoNguoiDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KeHoach(json);
                } else {
                    edu.system.alert(data.Message);
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
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                selectOne: true,
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_TienDo: function (strKetQua_Id, strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strTienDo_Id = edu.util.getValById('txtNoiDung' + strKetQua_Id);
        if (!edu.util.checkValue(strTienDo_Id)) {
            return;
        }
        var aData = me.dtGVXacNhan.find(e => e.ID == me.strGVXacNhan_Id);
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KeHoach_NH_GiaoDT_TD',
            'type': 'POST',
            'strId': strId,
            'strNguoiDung_Id': edu.system.userId,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strBV_Kehoach_NH_GiaoDT_Id': me.strGVXacNhan_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strTuNgay': edu.util.getValById('txtTuNgay' + strKetQua_Id),
            'strDenNgay': edu.util.getValById('txtDenNgay' + strKetQua_Id),
            'strNoiDung': edu.util.getValById('txtNoiDung' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_NH_GiaoDT_TD';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                    if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strKetQua_Id, strId, "LVLA_Files");
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TienDo();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TienDo: function () {
        var me = this;
        var aData = me.dtGVXacNhan.find(e => e.ID == me.strGVXacNhan_Id);
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KeHoach_NH_GiaoDT_TD',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strGVXacNhan_Id,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;

                    dtResult = data.Data;
                    me.genHTML_TienDo_Data(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TienDo: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_KeHoach_NH_GiaoDT_TD',
            'type': 'POST',
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_TienDo();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_TienDo_Data: function (data) {
        var me = this;
        $("#tblTienDo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtNoiDung' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtTuNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TUNGAY) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtDenNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DENNGAY) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY_HHMMSS) + '</td>';
            row += '<td>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</td>';
            row += '<td class="txtFileDinhKem"><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblTienDo tbody").append(row);
            edu.system.viewFiles("txtFileDinhKem" + strKetQua_Id, strKetQua_Id, "LVLA_Files");
        }

    },
    genHTML_TienDo: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblTienDo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtNoiDung' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtTuNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TUNGAY) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtDenNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DENNGAY) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY_HHMMSS) + '</td>';
        row += '<td>' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</td>';
        row += '<td class="txtFileDinhKem"><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblTienDo tbody").append(row);
        edu.system.uploadFiles(["txtFileDinhKem" + strKetQua_Id]);
    },
    
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'LVLA_BV_Chung/Them_BV_XacNhan_HD',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    loadBtnXacNhan: function (data) {
        main_doc.KeHoachXuLy.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'LVLA_BV_Chung/LayDSBV_XacNhan_HD',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strSanPham_Id': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}