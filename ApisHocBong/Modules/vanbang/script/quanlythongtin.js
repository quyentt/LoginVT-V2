/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuanLyThongTin() { };
QuanLyThongTin.prototype = {
    dtQuanLyThongTin: [],
    strQuanLyThongTin_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        edu.system.loadToCombo_DanhMucDuLieu("TN.XACNHANVANBANG", "", "", me.loadBtnQuanLyThongTin, "Tất cả tình trạng duyệt", "HESO1");
        //me.getList_ThoiGianDaoTao();
        me.getList_QuanLyThongTin();
        //me.getList_BtnQuanLyThongTin();

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_LopQuanLy();
        //me.getList_NamNhapHoc();
        //me.getList_KhoaQuanLy();
        //me.getList_PhanLoai();
        edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai");

        $("#btnSearch").click(function (e) {
            me.getList_QuanLyThongTin();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuanLyThongTin();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_QuanLyThongTin").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_QuanLyThongTin();
            }
        });
        $("[id$=chkSelectAll_QuanLyThongTin]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanLyThongTin" });
        });
        $("#btnSinhSoHieu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessQuanLyThongTin"></div>');
                edu.system.genHTML_Progress("zoneprocessQuanLyThongTin", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhTuDongSoHieu(arrChecked_Id[i]);
                }
            });
        });
        $("#btnSinhSoVaoSo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessQuanLyThongTin"></div>');
                edu.system.genHTML_Progress("zoneprocessQuanLyThongTin", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhSoVaoSo(arrChecked_Id[i]);
                }
            });
        });
        $("#tblQuanLyThongTin").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewEdit_QuanLyThongTin(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy();
        });

        $('#dropSearch_PhanLoai').on('select2:select', function (e) {
            me.getList_BtnQuanLyThongTin();
        });

        $("#zoneBtnQuanLyThongTin").delegate('.btnQuanLyThongTin', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungQuanLyThongTin");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_QuanLyThongTinTN(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnQuanLyThongTin").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_QuanLyThongTin").modal("show");
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strQuanLyThongTin_Id = "";
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
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    loadBtnQuanLyThongTin: function (data) {
        main_doc.QuanLyThongTin.dtQuanLyThongTin = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnQuanLyThongTin">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnQuanLyThongTin").html(row);
    },

    getList_BtnQuanLyThongTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_QuanLyThongTin/LayDSTinhTrangQuanLyThongTin',
            'strNguoiDung_Id': edu.system.userId,
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadBtnQuanLyThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_QuanLyThongTinTN: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'TS_QuanLyThongTinQuanLyThongTin/ThemMoi',
            'strId': "",
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiQuanLyThongTin_Id': edu.system.userId,
        };
        $("#modal_QuanLyThongTin").modal('hide');
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

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuanLyThongTinTN: function (strsanpham_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TN_VanBang_XacNhanIn/LayDanhSach',
            'strTuKhoa': "",
            'strsanpham_Id': strsanpham_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
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
                    me.genTable_QuanLyThongTin(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_QuanLyThongTinTN: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIQuanLyThongTin_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_QuanLyThongTin: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua_CongNhan_VB/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValCombo('dropSearch_PhanLoai'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dDoiTuongBenNgoai': edu.util.getValById('dropSearch_DoiTuong'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuanLyThongTin = dtReRult;
                    me.genTable_QuanLyThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_QuanLyThongTin: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KetQua_CongNhan_VB/ThemMoi',

            'strId': me.strQuanLyThongTin_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayKyBang': edu.util.getValById('txtSV_NgayKyBang'),
            'strNgayVaoSoCapBang': edu.util.getValById('txtSV_NgayVaoSo'),
            'strSoQuyetDinh': edu.util.getValById('txtSV_SoQuyetDinh'),
            'strNgayQuyetDinh': edu.util.getValById('txtSV_NgayQuyetDinh'),
            'strNguoiHoc_HoDem': edu.util.getValById('txtSV_HoDem'),
            'strNguoiHoc_Ten': edu.util.getValById('txtSV_Ten'),
            'strNguoiHoc_MaSo': edu.util.getValById('txtSV_MaSo'),
            'strNguoiHoc_HoDem_TA': edu.util.getValById('txtSV_HoDem_TA'),
            'strNguoiHoc_Ten_TA': edu.util.getValById('txtSV_Ten_TA'),
            'strNguoiHoc_NgaySinh': edu.util.getValById('txtSV_NgaySinh'),
            'strNguoiHoc_ThangSinh': edu.util.getValById('txtSV_ThangSinh'),
            'strNguoiHoc_NamSinh': edu.util.getValById('txtSV_NamSinh'),
            'strNguoiHoc_NamSinh_TA': edu.util.getValById('txtSV_NamSinh_TA'),
            'strNguoiHoc_ThangSinh_TA': edu.util.getValById('txtSV_ThangSinh_TA'),
            'strNguoiHoc_NgaySinh_TA': edu.util.getValById('txtSV_NgaySinh_TA'),
            'strNguoiHoc_GioiTinh': edu.util.getValById('txtSV_GioiTinh'),
            'strNguoiHoc_GioiTinh_TA': edu.util.getValById('txtSV_GioiTinh_TA'),
            'strNguoiHoc_XepLoai_TA': edu.util.getValById('txtSV_XepLoai_TA'),
            'strNguoiHoc_XepLoai': edu.util.getValById('txtSV_XepLoai'),
            'strNguoiHoc_NoiSinh': edu.util.getValById('txtSV_NoiSinh'),
            'strNguoiHoc_DanToc': edu.util.getValById('txtSV_DanToc'),
            'strNguoiHoc_NganhNghe': edu.util.getValById('txtSV_NganhNghe'),
            'strNguoiHoc_NganhNghe_TA': edu.util.getValById('txtSV_NganhNghe_TA'),
            'strDuongDanCaNhan': edu.util.getValById('uploadPicture_SV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_KetQua_CongNhan_VB/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuanLyThongTin_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strQuanLyThongTin_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_QuanLyThongTin();
            },
            error: function (er) {
                edu.system.alert("XLHV_QuanLyThongTin/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuanLyThongTin: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach/Xoa',
            

            'strIds': strId,
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
                    me.getList_QuanLyThongTin();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
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
    save_SinhTuDongSoHieu: function (strTN_KetQua_CongNhan_VB_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KetQua_CongNhan_VB/SinhSoHieuVanBang',
            'strNgayThucHien': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strTN_KetQua_CongNhan_VB_Id': strTN_KetQua_CongNhan_VB_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'GET',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessQuanLyThongTin", function () {
                    me.getList_QuanLyThongTin();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_SinhSoVaoSo: function (strTN_KetQua_CongNhan_VB_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KetQua_CongNhan_VB/SinhSoVaoSo',
            'strNgayThucHien': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strTN_KetQua_CongNhan_VB_Id': strTN_KetQua_CongNhan_VB_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'GET',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessQuanLyThongTin", function () {
                    me.getList_QuanLyThongTin();
                });
            },
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
    genTable_QuanLyThongTin: function (data, iPager) {
        var me = this;
        $("#lblQuanLyThongTin_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanLyThongTin",

            bPaginate: {
                strFuntionName: "main_doc.QuanLyThongTin.getList_QuanLyThongTin()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.DUONGDANANHCANHAN);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOVATEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {

                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_NGAYSINH) + "/" + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_THANGSINH) + "/" + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_NAMSINH);
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_GIOITINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_DANTOC"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NOISINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGANHNGHE"
                },
                {
                    "mDataProp": "SOHIEUBANG"
                },
                {
                    "mDataProp": "SOVAOSOCAPBANG"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mDataProp": "NGAYKYBANG"
                },
                {
                    "mDataProp": "NGAYVAOSOCAPBANG"
                },
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
    },
    viewEdit_QuanLyThongTin: function (strId) {
        var me = this;
        //View - Thong tin
        var temp = me.dtQuanLyThongTin.find(element => element.ID === strId);
        if (temp === undefined) {
            edu.system.alert("Code sai rồi má");
            return;
        }
        me.toggle_edit();
        edu.util.viewValById("uploadPicture_SV", data.DUONGDANANHCANHAN);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.DUONGDANANHCANHAN));
        $("#srcuploadPicture_SV").attr("src", strAnh);

        edu.util.viewValById("txtSV_MaSo", data.QLSV_NGUOIHOC_MASO);
        edu.util.viewValById("txtSV_HoDem", data.QLSV_NGUOIHOC_HODEM);
        edu.util.viewValById("txtSV_Ten", data.QLSV_NGUOIHOC_TEN);
        edu.util.viewValById("txtSV_NgaySinh", data.QLSV_NGUOIHOC_NGAYSINH);
        edu.util.viewValById("txtSV_ThangSinh", data.QLSV_NGUOIHOC_THANGSINH);
        edu.util.viewValById("txtSV_NamSinh", data.QLSV_NGUOIHOC_NAMSINH);
        edu.util.viewValById("txtSV_GioiTinh", data.QLSV_NGUOIHOC_GIOITINH);
        edu.util.viewValById("txtSV_DanToc", data.QLSV_NGUOIHOC_DANTOC);
        edu.util.viewValById("txtSV_NoiSinh", data.QLSV_NGUOIHOC_NOISINH);
        edu.util.viewValById("txtSV_NganhNghe", data.QLSV_NGUOIHOC_NGANHNGHE);
        me.strQuanLyThongTin_Id = data.ID;
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
    getList_PhanLoai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach/LayDSPhanLoaiXetTheoND2',
            'strNguoiDung_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_PhanLoai(json);
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
        var me = main_doc.QuanLyThongTin;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropQuanLyThongTin_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.QuanLyThongTin.dtTrangThai = data;
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

    cbGenCombo_PhanLoai: function (data) {
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
            renderPlace: ["dropSearch_PhanLoai"],
            type: "",
            title: "Chọn phân loại",
        };
        edu.system.loadToCombo_data(obj);
    },

}