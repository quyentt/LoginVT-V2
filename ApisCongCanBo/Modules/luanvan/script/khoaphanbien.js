/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KhoaPhanBien() { };
KhoaPhanBien.prototype = {
    dtKhoaPhanBien: [],
    strKhoaPhanBien_Id: '',
    arrNhanSu_Id:[],
    strDeTai_Id: '',
    checkView: true,

    init: function () {
        var me = this;
        if ($("#btnSave_KhoaPhanBien").length > 0) me.checkView = false;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_KhoaPhanBien();
        me.getList_KeHoach();
        me.getList_CanBo();
        edu.system.loadToCombo_DanhMucDuLieu("BV.TINHTRANG.XACNHANPHANBIENQUYEN", "dropTrangThaiXacNhan");
        //edu.system.loadToCombo_DanhMucDuLieu("HB.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai");
        //me.getList_LoaiDanhHieu();

        $("#btnSearch").click(function (e) {
            me.getList_KhoaPhanBien();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KhoaPhanBien();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        
        $("#tblKhoaPhanBien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strKhoaPhanBien_Id = strId;
            //me.toggle_edit()
            $("#khoadexuat_phanbien").modal("show");
            var aData = me.dtKhoaPhanBien.find(e => me.strKhoaPhanBien_Id == e.ID);
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
            me["strPhanLoai_Id"] = aData.PHANLOAI_ID;
            me.getList_VaiTro();
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        
        $(".btnSearch_NguoiHuongDan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhVien(id, "");
        });
        $("#tblNguoiHuongDan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblNguoiHuongDan tr[id='" + strRowId + "']").remove();
        });
        $("#tblNguoiHuongDan").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThanhVien(strId);
            });
        });;
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKhoaPhanBien_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        $("#btnSave_KhoaPhanBien").click(function (e) {
            var ISoLuong = $("#tblNguoiHuongDan tbody tr").length
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", ISoLuong);
            $("#tblNguoiHuongDan tbody tr").each(function () {
                me.save_ThanhVien(this.id, me.strKhoaPhanBien_Id);
            });
        });
        $("#khoadexuat_phanbien").delegate('.btnQuyetDinh', 'click', function (e) {
            var strId = this.id;
            //me["strDeTai_Id"] = strId;
            //me.toggle_edit()
            $("#modalQuyetDinh").modal("show");
            var aData = me.dtKhoaPhanBien.find(e => me.strKhoaPhanBien_Id == e.ID);
            $(".lblMaSo").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
            $(".lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            $(".lblLop").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_LOP));
            $(".lblChuongTrinh").html(edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN));
            $(".lblDeTaiTiengViet").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TEN));
            $(".lblDeTaiTiengAnh").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TENTA));
            $(".lblSoQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_SOQD));
            $(".lblNgayQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_NGAYQD));
            $(".lblNoiDung").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_LYDO));
            $(".lblTinhTrang").html(edu.util.returnEmpty(aData.BV_XACNHAN_GIAODETAI_TEN));

            edu.util.viewValById("txtSoQuyetDinh", aData.QLSV_QUYETDINH_NGAYQD);
            edu.util.viewValById("txtNgayQuyetDinh", aData.QLSV_QUYETDINH_NGAYQD);
            edu.util.viewValById("txtNoiDung", aData.QLSV_QUYETDINH_LYDO);
            edu.util.viewHTMLById("txtNoiDung", aData.QLSV_QUYETDINH_LYDO);
        });
        $("#khoadexuat_phanbien").delegate('.btnDuyet', 'click', function (e) {
            var strId = this.id;
            //me["strDeTai_Id"] = strId;
            //me.toggle_edit()
            $("#modalDuyet").modal("show");
            var aData = me.dtKhoaPhanBien.find(e => me.strKhoaPhanBien_Id == e.ID);
            $(".lblMaSo").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
            $(".lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            $(".lblLop").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_LOP));
            $(".lblChuongTrinh").html(edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN));
            $(".lblDeTaiTiengViet").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TEN));
            $(".lblDeTaiTiengAnh").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TENTA));
            $(".lblSoQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_SOQD));
            $(".lblNgayQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_NGAYQD));
            $(".lblNoiDung").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_LYDO));
            $(".lblTinhTrang").html(edu.util.returnEmpty(aData.BV_XACNHAN_GIAODETAI_TEN));
        });
        $("#tblKhoaPhanBien").delegate('.btnDuyet', 'click', function (e) {
            var strId = this.id;
            me["strKhoaPhanBien_Id"] = strId;
            //me.toggle_edit()
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            var aData = me.dtKhoaPhanBien.find(e => strId == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
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
            var aData = me.dtKhoaPhanBien.find(e => me.strKhoaPhanBien_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $(".btnSave_XacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropTrangThaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            var aData = me.dtKhoaPhanBien.find(e => me.strKhoaPhanBien_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
        });
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_KhoaPhanBien();
        });
    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KhoaPhanBien: function (strDanhSach_Id) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_Duyet',
            'type': 'GET',
            'strBV_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhoaPhanBien = dtReRult;
                    me.genTable_KhoaPhanBien(dtReRult, data.Pager);
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
    genTable_KhoaPhanBien: function (data, iPager) {
        var me = this;
        $("#lblKhoaPhanBien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoaPhanBien",

            bPaginate: {
                strFuntionName: "main_doc.KhoaPhanBien.getList_KhoaPhanBien()",
                iDataRow: iPager,
            },
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
                        return edu.util.returnEmpty(aData.BV_XACNHAN_HD_TEN) + ' <span><a class="btn btn-default btnDuyet color-active" id="' + aData.ID + '" title="Duyệt"><i class="fal fa-check-circle color-active"></i> Xác nhận</a></span>';
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
    
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strRowID, strKhoaPhanBien_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        var aData = me.dtKhoaPhanBien.find(e => e.ID == me.strKhoaPhanBien_Id);
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KeHoach_NH_GiaoDT_PB',
            'type': 'POST',
            'strId': strId,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strBV_Kehoach_NH_GiaoDT_Id': strKhoaPhanBien_Id,
            'strVaiTro_Id': edu.util.getValById('dropVaiTro' + strRowID),
            'strNguoiDung_Id': edu.util.getValById('dropCanBo' + strRowID),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_NH_GiaoDT_PB';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        strId = data.Id;
                        edu.system.alert("Thêm mới thành công");
                        if (edu.util.checkValue(strId)) edu.system.saveFiles("txtFileDinhKem" + strRowID, strId, "LVLA_Files");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThanhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        var aData = me.dtKhoaPhanBien.find(e => e.ID == me.strKhoaPhanBien_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_PB',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strKhoaPhanBien_Id,
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
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_KeHoach_NH_GiaoDT_PB',

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
                    me.getList_ThanhVien();
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
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_ThanhVien();
                });
            },
            contentType: true,

            data: obj_delete,
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
            row += '<td><select id="dropCanBo' + strKetQua_Id + '" class="select-opt"></select ></td>';
            row += '<td><select id="dropVaiTro' + strKetQua_Id + '" class="select-opt"></select ></td>';
            row += '<td class="txtFileDinhKem"><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblNguoiHuongDan tbody").append(row);
            me.genComBo_CanBo("dropCanBo" + strKetQua_Id, aData.NGUOIDUNG_ID);
            me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, aData.VAITRO_ID);
            edu.system.viewFiles("txtFileDinhKem" + strKetQua_Id, strKetQua_Id, "LVLA_Files");
        }
    },
    genHTML_ThanhVien: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblNguoiHuongDan").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropCanBo' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td><select id="dropVaiTro' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td class="txtFileDinhKem"><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblNguoiHuongDan tbody").append(row);
        me.genComBo_CanBo("dropCanBo" + strKetQua_Id, aData.NGUOIDUNG_ID);
        me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, aData.VAITRO_ID);
        edu.system.uploadFiles(["txtFileDinhKem" + strKetQua_Id]);
    },


    getList_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_LVLA_BV_Chung_MH/DSA4BRIDFx4XICgVMy4eESkgLw0uICgP',
            'func': 'pkg_bv_chung.LayDSBV_VaiTro_PhanLoai',
            'iM': edu.system.iM,
            'strPhanLoaiTinhChat': "PHANBIEN",
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhanLoai_Id': me.strPhanLoai_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtVaiTro"] = json;
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_VaiTro: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },    
    getList_CanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            'type': 'GET',
                'pageIndex': 1,
                'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtCanBo"] = json;
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
    genComBo_CanBo: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCanBo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
        $("#" + strTinhTrang_Id).select2({
            dropdownParent: $('#khoadexuat_phanbien .modal-content')
        });
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

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'LVLA_BV_Chung/Them_BV_XacNhan_PhanBienQ',
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_SinhVien();
            //    });
            //},
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
        main_doc.KhoaPhanBien.dtXacNhan = data;
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
            'action': 'LVLA_BV_Chung/LayDSBV_XacNhan_PhanBienQ',
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