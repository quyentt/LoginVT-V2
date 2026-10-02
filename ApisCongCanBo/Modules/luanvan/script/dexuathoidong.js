/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DeXuatHoiDong() { };
DeXuatHoiDong.prototype = {
    dtDeXuatHoiDong: [],
    strDeXuatHoiDong_Id: '',
    arrNhanSu_Id:[],
    strDeTai_Id: '',
    checkView: false,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        if ($("#btnSave_DeXuatHoiDong").length > 0) me.checkView = false;
        //me.getList_ThoiGianDaoTao();
        me.getList_DeXuatHoiDong();
        me.getList_KeHoach();
        me.getList_LoaiHoiDong();
        me.getList_DonVi();
        me.getList_CanBo();
        //me.getList_VaiTro();
        //me.getList_CanBo();
        edu.system.loadToCombo_DanhMucDuLieu("BV.DANHGIA", "dropDanhGia", "", data => me["dtDanhGia"] = data);
        edu.system.loadToCombo_DanhMucDuLieu("BV.TINHTRANG.XACNHANBAOVE", "dropTrangThaiXacNhan");
        //me.getList_LoaiDanhHieu();

        $("#btnSearch").click(function (e) {
            me.getList_DeXuatHoiDong();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DeXuatHoiDong();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        
        $("#tblDeXuatHoiDong").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strDeXuatHoiDong_Id = strId;
            //me.toggle_edit()
            $("#deXuatHoiDongBaoVe_chitiet").modal("show");
            var aData = me.dtDeXuatHoiDong.find(e => me.strDeXuatHoiDong_Id == e.ID);
            $("#lblMaSo").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
            $("#lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            $("#lblLop").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_LOP));
            $("#lblChuongTrinh").html(edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN));
            $("#lblDeTaiTiengViet").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TEN));
            $("#lblDeTaiTiengAnh").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TENTA));
            $("#lblSoQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_SOQD));
            $("#lblNgayQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_NGAYQD));
            $("#lblNoiDung").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_LYDO));
            $("#lblTinhTrang").html(edu.util.returnEmpty(aData.BV_XACNHAN_GIAODETAI_TEN));
            me.getList_ThanhVien();
            me.getList_HoiDong();
            me["strPhanLoai_Id"] = aData.PHANLOAI_ID;
            me.getList_VaiTro();
        });
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDeXuatHoiDong_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_DeXuatHoiDong();
        });
        $('#dropDonVi').on('select2:select', function (e) {
            me.getList_CanBo();
        });
        $('#dropSearch_HoiDongBaoVe').on('select2:select', function (e) {
            me.getList_HDThanhVien();
            me.getList_LichBaoVe();
            me.getList_KetQua();
        });

        edu.system.uploadFiles(["txtFileDinhKem"]);

        $(".btnAddHoiDong").click(function () {
            $("#deXuatHoiDongBaoVe_chitiet_lapHDmoi").modal("show");
            var aData = {};
            me["strHoiDong_Id"] = "";
            edu.util.viewValById("txtTenHoiDong", aData.BV_KEHOACH_DETAI_ID);
            edu.util.viewValById("dropLoaiHoiDongBaoVe", aData.BV_KEHOACH_DETAI_ID);
        });
        $(".btnDelete_HoiDong").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_HoiDong();
            });
        });
        $("#btnSave_HoiDong").click(function () {
            me.save_HoiDong();
        });

        $(".btnSearch_HDThanhVien").click(function () {
            $("#modalHDThanhVien").modal("show");
            var aData = {};
            me["strHDThanhVien_Id"] = "";
            edu.util.viewValById("dropDonVi", aData.BV_KEHOACH_DETAI_ID);
            me.getList_ThanhVien();
            me["strThanhVien_Id"] = aData.NGUOIDUNG_ID;
            edu.util.viewValById("dropThanhVien", aData.NGUOIDUNG_ID);
            edu.util.viewValById("dropVaiTro", aData.VAITRO_ID);
            edu.util.viewValById("dropDanhGia", aData.DANHGIA_ID);
            edu.util.viewValById("txtDiem", aData.DIEM);
            edu.util.viewValById("txtNhanXet", aData.NHANXET);
            edu.system.viewFiles("txtFileDinhKem", [])
        });
        $("#tblHDThanhVien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            $("#modalHDThanhVien").modal("show");
            me["strHDThanhVien_Id"] = strId;
            var aData = me.dtHDThanhVien.find(e => e.ID == strId);
            edu.util.viewValById("dropDonVi", aData.BV_KEHOACH_DETAI_ID);
            me.getList_ThanhVien();
            me["strThanhVien_Id"] = aData.NGUOIDUNG_ID;
            edu.util.viewValById("dropThanhVien", aData.NGUOIDUNG_ID);
            edu.util.viewValById("dropVaiTro", aData.VAITRO_ID);
            edu.util.viewValById("dropDanhGia", aData.DANHGIA_ID);
            edu.util.viewValById("txtDiem", aData.DIEM);
            edu.util.viewValById("txtNhanXet", aData.NHANXET);
            edu.system.viewFiles("txtFileDinhKem", aData.ID, "LVLA_Files")
        });
        $(".btnDelete_HDThanhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHDThanhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HDThanhVien(arrChecked_Id[i]);
                }
            });
        });
        $("#btnSave_HDThanhVien").click(function () {
            me.save_HDThanhVien();
        });

        $(".btnSearch_LichBaoVe").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_LichBaoVe(id, "");
        });
        $("#tblLichBaoVe").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblLichBaoVe tr[id='" + strRowId + "']").remove();
        });
        $("#tblLichBaoVe").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_LichBaoVe(strId);
            });
        });


        $("#btnSave_DeXuatHoiDong").click(function () {
            var ISoLuong = $("#tblLichBaoVe tbody tr").length + $("#tblKetQua tbody tr").length
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", ISoLuong);
            $("#tblLichBaoVe tbody tr").each(function () {
                me.save_LichBaoVe(this.id);
            });
            $("#tblKetQua tbody tr").each(function () {
                me.save_KetQua(this.id);
            });
        });

        $(".btnXacNhan").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            var aData = me.dtDeXuatHoiDong.find(e => me.strDeXuatHoiDong_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $(".btnSave_XacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropTrangThaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            var aData = me.dtDeXuatHoiDong.find(e => me.strDeXuatHoiDong_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDeXuatHoiDong_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_DeXuatHoiDong();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DeXuatHoiDong: function (strDanhSach_Id) {
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
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDeXuatHoiDong = dtReRult;
                    me.genTable_DeXuatHoiDong(dtReRult, data.Pager);
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
    genTable_DeXuatHoiDong: function (data, iPager) {
        var me = this;
        $("#lblDeXuatHoiDong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeXuatHoiDong",

            //bPaginate: {
            //    strFuntionName: "main_doc.DeXuatHoiDong.getList_DeXuatHoiDong()",
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
                    "mDataProp": "BV_XACNHAN_GIAODETAI_TEN"
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

        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_HD',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
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

    getList_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_Chung/LayDSBV_VaiTro_PhanLoai',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhanLoai_Id': me.strPhanLoai_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtVaiTro"] = json;
                    me.genComBo_VaiTro(json)
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
    genComBo_VaiTro: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: ["dropVaiTro"],
            type: "",
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KeHoach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'dHieuLuc': -1,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
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

    getList_HoiDong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_HoiDong',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHoiDong"] = dtReRult;
                    me.genTable_HoiDong(dtReRult, data.Pager);
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
    save_HoiDong: function () {
        var me = this;
        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_HoiDong',
            'type': 'POST',
            'strTenHoiDong': edu.util.getValById('txtTenHoiDong'),
            'strLoaiHoiDong_Id': edu.util.getValById('dropLoaiHoiDongBaoVe'),
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_DeTai';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId) {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    if ($(this).attr("name") == "new") {
                    //        me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                    //    }
                    //});
                    //$("#tblNguoiHuongDan tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    //});

                    //for (var i = 0; i < me.arrKhoa.length; i++) {
                    //    me.save_Khoa(strKeHoachXuLy_Id, me.arrKhoa[i]);
                    //}
                    //for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                    //    me.save_ChuongTrinh(strKeHoachXuLy_Id, me.arrChuongTrinh[i]);
                    //}
                    //for (var i = 0; i < me.arrLop.length; i++) {
                    //    me.save_Lop(strKeHoachXuLy_Id, me.arrLop[i]);
                    //}
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_HoiDong();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HoiDong: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_HoiDong',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': $("#dropSearch_HoiDongBaoVe").val(),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HoiDong();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HoiDong();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_HoiDong: function (data, iPager) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHOIDONG",
                code: "MA",
                selectOne: true
            },
            renderPlace: ["dropSearch_HoiDongBaoVe"],
            type: "",
            title: "Chọn hội đồng"
        };
        edu.system.loadToCombo_data(obj);
        me.getList_HDThanhVien();
        me.getList_LichBaoVe();
        me.getList_KetQua();
    },
    
    getList_LoaiHoiDong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_Chung/LayDSBV_NguoiDung_LoaiHoiDong',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtLoaiHoiDong"] = json;
                    me.genComBo_LoaiHoiDong(json);
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
    genComBo_LoaiHoiDong: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: ["dropLoaiHoiDongBaoVe"],
            type: "",
            title: "Chọn loại hội đồng"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_HDThanhVien: function (strDanhSach_Id) {
        var me = this;
        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KeHoach_NH_GiaoDT_BV',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strBV_HoiDong_Id': edu.util.getValById('dropSearch_HoiDongBaoVe'),
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHDThanhVien"] = dtReRult;
                    me.genTable_HDThanhVien(dtReRult, data.Pager);
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
    save_HDThanhVien: function () {
        var me = this;
        //--Edit
        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KeHoach_NH_GiaoDT_BV',
            'type': 'POST',
            'strId': me.strHDThanhVien_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strVaiTro_Id': edu.util.getValById('dropVaiTro'),
            'strBV_HoiDong_Id': edu.util.getValById('dropSearch_HoiDongBaoVe'),
            'strDanhGia_Id': edu.util.getValById('dropDanhGia'),
            'dDiem': edu.util.getValById('txtDiem'),
            'strNhanXet': edu.util.getValById('txtNhanXet'),
            'strNguoiDung_Id': edu.util.getValById('dropThanhVien'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_NH_GiaoDT_BV';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId) {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId;
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                       
                    }
                    if (strKeHoachXuLy_Id) edu.system.saveFiles("txtFileDinhKem", strKeHoachXuLy_Id, "LVLA_Files");
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    if ($(this).attr("name") == "new") {
                    //        me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                    //    }
                    //});
                    //$("#tblNguoiHuongDan tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    //});

                    //for (var i = 0; i < me.arrKhoa.length; i++) {
                    //    me.save_Khoa(strKeHoachXuLy_Id, me.arrKhoa[i]);
                    //}
                    //for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                    //    me.save_ChuongTrinh(strKeHoachXuLy_Id, me.arrChuongTrinh[i]);
                    //}
                    //for (var i = 0; i < me.arrLop.length; i++) {
                    //    me.save_Lop(strKeHoachXuLy_Id, me.arrLop[i]);
                    //}
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_HDThanhVien();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HDThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_KeHoach_NH_GiaoDT_BV',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.getList_DeTai();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HDThanhVien();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_HDThanhVien: function (data, iPager) {
        var me = this;
        $("#lblGiaoDeTai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHDThanhVien",

            //bPaginate: {
            //    strFuntionName: "main_doc.GiaoDeTai.getList_DeTai()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN);
                    }
                },
                {
                    "mDataProp": "VAITRO_TEN",
                },
                {
                    "mDataProp": "LOAIHOIDONG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblFileDinhKem' + aData.ID + '"></span>';
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        data.forEach(e => edu.system.viewFiles("lblFileDinhKem" + e.ID, e.ID, "LVLA_Files"))
    },
    
    getList_DonVi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_CoCauToChuc/LayDanhSach',
            'type': 'GET',
            'strCoCauToChucCha_Id': '',
            'dTrangThai': -1,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genComBo_DonVi(json);
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
    genComBo_DonVi: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_CanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            'type': 'GET',
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropDonVi"),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genComBo_CanBo(json);
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
    genComBo_CanBo: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: me.strThanhVien_Id
            },
            renderPlace: ["dropThanhVien"],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropThanhVien").select2({//Search on modal
            dropdownParent: $('#modalHDThanhVien .modal-content')
        });
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_LichBaoVe: function (strKetQua_Id, strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strLichBaoVe_Id = edu.util.getValById('txtNgay' + strKetQua_Id);
        //if (!edu.util.checkValue(strLichBaoVe_Id)) {
        //    return;
        //}
        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_BaoVe_Lich',
            'type': 'POST',
            'strId': strId,
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strBV_HoiDong_Id': edu.util.getValById('dropSearch_HoiDongBaoVe'),
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strMoTa': edu.util.getValById('txtMoTa' + strKetQua_Id),
            'strNgay': edu.util.getValById('txtNgay' + strKetQua_Id),
            'strGio': edu.util.getValById('txtGio' + strKetQua_Id),
            'strDiaDiem': edu.util.getValById('txtDiaDiem' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_BaoVe_Lich';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
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
                    me.getList_LichBaoVe();
                    me.getList_KetQua();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_LichBaoVe: function () {
        var me = this;
        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_BaoVe_Lich',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strBV_HoiDong_Id': edu.util.getValById('dropSearch_HoiDongBaoVe'),
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
                    me.genHTML_LichBaoVe_Data(dtResult);
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
    delete_LichBaoVe: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_BaoVe_Lich',
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
                    me.getList_LichBaoVe();
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
    genHTML_LichBaoVe_Data: function (data) {
        var me = this;
        $("#tblLichBaoVe tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAY) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtGio' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.GIO) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtDiaDiem' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DIADIEM) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblLichBaoVe tbody").append(row);
        }

    },
    genHTML_LichBaoVe: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblLichBaoVe").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtNgay' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NGAY) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtGio' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.GIO) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtDiaDiem' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DIADIEM) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblLichBaoVe tbody").append(row);
    },


    getList_KetQua: function (strDanhSach_Id) {
        var me = this;
        var aData = me.dtDeXuatHoiDong.find(e => e.ID == me.strDeXuatHoiDong_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KeHoach_NH_GiaoDT_BV',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeXuatHoiDong_Id,
            'strBV_HoiDong_Id': edu.util.getValById('dropSearch_HoiDongBaoVe'),
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKetQua"] = dtReRult;
                    me.genTable_KetQua(dtReRult, data.Pager);
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

    save_KetQua: function (strKetQua_Id, strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var strId = strKetQua_Id;
        //var strLichBaoVe_Id = edu.util.getValById('txtNgay' + strKetQua_Id);
        //if (!edu.util.checkValue(strLichBaoVe_Id)) {
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Sua_BV_KeHoach_NH_GiaoDT_BV',
            'type': 'POST',
            'strId': strId,
            'strVaiTro_Id': edu.util.getValById('dropVaiTro' + strKetQua_Id),
            'strDanhGia_Id': edu.util.getValById('dropDanhGia' + strKetQua_Id),
            'dDiem': edu.util.getValById('txtDiem' + strKetQua_Id),
            'strNhanXet': edu.util.getValById('txtNhanXet' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_NH_GiaoDT_BV';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
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
                    me.getList_KetQua();
                    me.getList_LichBaoVe();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_KetQua: function (data, iPager) {
        var me = this;
        $("#lblDeXuatHoiDong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKetQua",

            //bPaginate: {
            //    strFuntionName: "main_doc.DeXuatHoiDong.getList_DeXuatHoiDong()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN);
                    }
                },
                {
                    "mDataProp": "VAITRO_TEN",
                },
                {
                    "mDataProp": "LOAIHOIDONG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropDanhGia' + aData.ID + '" class="select-opt"></select >';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtNhanXet' + aData.ID + '" value="' + edu.util.returnEmpty(aData.NHANXET) + '" class="form-control" style="padding-left: 10px" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtDiem' + aData.ID + '" value="' + edu.util.returnEmpty(aData.DIEM) + '" class="form-control" style="padding-left: 10px" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.genComBo_DanhGia("dropDanhGia" + e.ID, e.DANHGIA_ID))
    },
    genComBo_DanhGia: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtDanhGia,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn đánh giá"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'LVLA_BV_Chung/Them_BV_XacNhan_GiaoDeTai',
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
            'action': 'LVLA_BV_Chung/LayDSBV_XacNhan_GiaoDeTai',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strsanpham_Id': strSanPham_Id,
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