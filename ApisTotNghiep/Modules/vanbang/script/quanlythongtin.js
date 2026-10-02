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
    strQLSV_NguoiHoc_Id: '',
    strChuongTrinhHoc_Id: '',

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
        me.getList_QuyetDinh();
        //me.getList_LopQuanLy();
        //me.getList_NamNhapHoc();
        //me.getList_KhoaQuanLy();
        me.getList_PhanLoai();
        //edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("VANBANG.XEPLOAI", "dropXepLoai");
        me.getList_MauPhoiIn();
        me.getList_MauPhoiInBanSao();
        me.getList_XepLoai();
        edu.system.loadToCombo_DanhMucDuLieu("TN.THONGTINVANBANG.SAPXEP", "dropSearch_TieuChiSapXep", "", "", "Chọn tiêu chí sắp xếp");

        $("#btnSearch").click(function (e) {
            me.getList_QuanLyThongTin();
        });
        $("#btnSearchSinhVien").click(function (e) {
            me.getList_TimSinhVien();
        });
        $("#btnXemThongTin").click(function (e) {
            me.getList_ThongTinSinhVien();
        });
        $("#btnKeThuaThongTin").click(function (e) {
            me.getList_KeThuaSinhVien();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuanLyThongTin();
            }
        });
        $("#txtSV_MaTimKiem").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TimSinhVien();
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

            me.save_QuanLyThongTin();
            $("#tblCauHinhThongTin tbody tr").each(function () {
                var strKetQua_Id = this.id.replace(/rm_row/g, '');
                me.save_ThongTin(strKetQua_Id);
            });
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
                //edu.system.iGioiHanLuong = 1;
                //me.save_SinhTuDongSoHieu(arrChecked_Id[i]);
                me.save_SinhTuDongSoHieu(arrChecked_Id, 0);
                //for (var i = 0; i < arrChecked_Id.length; i++) {
                //    me.save_SinhTuDongSoHieu(arrChecked_Id[i]);
                //}
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
                me.save_SinhSoVaoSo(arrChecked_Id, 0);
                //edu.system.iGioiHanLuong = 1;
                //for (var i = 0; i < arrChecked_Id.length; i++) {
                //    me.save_SinhSoVaoSo(arrChecked_Id[i]);
                //}
            });
        });

        $("#btnSinhQuyetDinh").off('click').on('click', function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần tạo QĐ?");
                return;
            }
            // Reset form và mở modal
            edu.util.viewValById("txtSinhQD_SoQD", "");
            edu.util.viewValById("txtSinhQD_NgayQD", "");
            edu.util.viewValById("txtSinhQD_NgayHieuLuc", "");
            edu.util.viewValById("txtSinhQD_NoiDung", "");
            $("#modal_SinhQuyetDinh").modal("show");
            if (typeof edu.system.pickerdate === "function") edu.system.pickerdate();
        });
        $("#btnSave_SinhQuyetDinh").off('click').on('click', function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            var objForm = {
                strSoQD: edu.util.getValById('txtSinhQD_SoQD'),
                strNgayQD: edu.util.getValById('txtSinhQD_NgayQD'),
                strNgayHieuLuc: edu.util.getValById('txtSinhQD_NgayHieuLuc'),
                strNoiDung: edu.util.getValById('txtSinhQD_NoiDung')
            };
            $("#modal_SinhQuyetDinh").modal('hide');
            edu.system.alert('<div id="zoneprocessQuanLyThongTin"></div>');
            edu.system.genHTML_Progress("zoneprocessQuanLyThongTin", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_SinhQuyetDinh(arrChecked_Id[i], objForm);
            }
        });
        $("#tblQuanLyThongTin").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                $("#zoneTimSinhVien").hide();
                var data = me.dtQuanLyThongTin.find(element => element.ID === strId);
                me.viewEdit_QuanLyThongTin(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_QuanLyThongTin").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_QuanLyThongTin(me.strQuanLyThongTin_Id);
            });
        });

        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_LopQuanLy();
            me.getList_QuyetDinh();
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.getList_QuyetDinh();
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy();
            me.getList_QuyetDinh();
        });
        $('#dropSearch_ChuongTrinhHoc').on('select2:select', function (e) {
            me.getList_ThongTinSinhVien();
        });
        $('#dropSearch_Lop,#dropSearch_DoiTuong').on('select2:select', function (e) {
            me.getList_QuyetDinh();
        });
        //$('#dropSearch_PhanLoai').on('select2:select', function (e) {
        //    me.getList_BtnQuanLyThongTin();
        //});

        $('#dropSearch_PhanLoai').on('select2:select', function (e) {
            me.getList_QuyetDinh();
            me.getList_KeHoachXuLy();
        });
        $('#dropPhanLoai').on('select2:select', function (e) {
            me.getList_XepLoai();
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
        edu.system.getList_MauImport("zonebtnQLTT", function (addKeyValue) {
            var strSoQuyetDinh = edu.util.getValById('dropSearch_QuyetDinh');
            if (strSoQuyetDinh) strSoQuyetDinh = $("#dropSearch_QuyetDinh option:selected").text();
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
                'strSoQuyetDinh': strSoQuyetDinh,
                'dDoiTuongBenNgoai': edu.util.getValById('dropSearch_DoiTuong'),
                'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
        edu.system.uploadAvatar(['uploadPicture_SV'], "");

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        });
        $("#tblCauHinhThongTin").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblCauHinhThongTin tr[id='" + strRowId + "']").remove();
        });
        $("#tblCauHinhThongTin").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThongTin(strId);
            });
        });
        $("#btnDelete_ThongTin").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuanLyThongTinAll(arrChecked_Id[i]);
                }
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        //me.strQuanLyThongTin_Id = "";
        //me.arrSinhVien_Id = [];
        //me.arrSinhVien = [];
        //me.arrNhanSu_Id = [];
        //me.arrLop = [];
        //me.arrKhoa = [];
        //me.arrChuongTrinh = [];
        //$("#ApDungChoLop").html("");
        //$("#ApDungChoKhoa").html("");
        //$("#ApDungChoChuongTrinh").html("");

        //edu.util.viewValById("txtMa", "");
        //edu.util.viewValById("txtTen", "");
        //edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        //edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        //edu.util.viewValById("txtTuNgay", "");
        //edu.util.viewValById("txtDenNgay", "");
        //$("#tblInput_DTSV_SinhVien tbody").html("");
        //$("#tblInputDanhSachNhanSu tbody").html("");
        $("#zoneTimSinhVien").show();
        me.strQLSV_NguoiHoc_Id = "";
        $("#lblSinhVien").html("");
        $("#lblKhoaHoc").html("");
        $("#tblCauHinhThongTin tbody").html("");
        var data = {};
        me.strChuongTrinhHoc_Id = "";

        edu.util.viewValById("uploadPicture_SV", data.DUONGDANANHCANHAN);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.DUONGDANANHCANHAN));
        $("#srcuploadPicture_SV").attr("src", strAnh);
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        me.getList_XepLoai();



        edu.util.viewValById("txtSV_MaSo", data.QLSV_NGUOIHOC_MASO);
        edu.util.viewValById("txtSV_HoDem", data.QLSV_NGUOIHOC_HODEM);
        edu.util.viewValById("txtSV_Ten", data.QLSV_NGUOIHOC_TEN);
        edu.util.viewValById("txtSV_HoDem_TA", data.QLSV_NGUOIHOC_HODEM_TA);
        edu.util.viewValById("txtSV_Ten_TA", data.QLSV_NGUOIHOC_TEN_TA);

        edu.util.viewValById("dropXepLoai", data.XEPLOAI_ID);
        edu.util.viewValById("txtSV_XepLoai_TA", data.QLSV_NGUOIHOC_XEPLOAI_TA);
        edu.util.viewValById("dropMauPhoi", data.PHOI_NGUOIHOC_NHAPTRUCTIEP_ID);
        edu.util.viewValById("dropMauPhoi_BanSao", data.PHOI_NGUOIHOC_NHAP_BANSAO_ID);
        edu.util.viewValById("dropSearch_ChuongTrinhHoc", data.DAOTAO_TOCHUCCHUONGTRINH_ID);

        edu.util.viewValById("txtSV_NgaySinhDD", data.NGAYSINHDAYDU);
        edu.util.viewValById("txtSV_NgaySinhDD_TA", data.NGAYSINHDAYDU_TA);

        edu.util.viewValById("txtSV_NgaySinh", data.QLSV_NGUOIHOC_NGAYSINH);
        edu.util.viewValById("txtSV_ThangSinh", data.QLSV_NGUOIHOC_THANGSINH);
        edu.util.viewValById("txtSV_NamSinh", data.QLSV_NGUOIHOC_NAMSINH);

        edu.util.viewValById("txtSV_NgaySinh_TA", data.QLSV_NGUOIHOC_NGAYSINH_TA);
        edu.util.viewValById("txtSV_ThangSinh_TA", data.QLSV_NGUOIHOC_THANGSINH_TA);
        edu.util.viewValById("txtSV_NamSinh_TA", data.QLSV_NGUOIHOC_NAMSINH_TA);

        edu.util.viewValById("txtSV_GioiTinh", data.QLSV_NGUOIHOC_GIOITINH);
        edu.util.viewValById("txtSV_GioiTinh_TA", data.QLSV_NGUOIHOC_GIOITINH_TA);

        edu.util.viewValById("txtSV_DanToc", data.QLSV_NGUOIHOC_DANTOC);
        edu.util.viewValById("txtSV_DanToc_TA", data.QLSV_NGUOIHOC_DANTOC_TA);

        edu.util.viewValById("txtSV_NoiSinh", data.QLSV_NGUOIHOC_NOISINH);
        edu.util.viewValById("txtSV_NoiSinh_TA", data.QLSV_NGUOIHOC_NOISINH_TA);

        edu.util.viewValById("txtSV_NganhNghe", data.QLSV_NGUOIHOC_NGANHNGHE);
        edu.util.viewValById("txtSV_NganhNghe_TA", data.QLSV_NGUOIHOC_NGANHNGHE_TA);

        edu.util.viewValById("txtSV_NgayKyBang", data.NGAYKYBANG);
        edu.util.viewValById("txtSV_SoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtSV_NgayQuyetDinh", data.NGAYQUYETDINH);
        edu.util.viewValById("txtSV_NgayVaoSo", data.NGAYVAOSOCAPBANG);
        edu.util.viewValById("txtSV_SoHieuBang", data.SOHIEUBANG);
        edu.util.viewValById("txtSV_SoVaoSo", data.SOVAOSOCAPBANG);
        edu.util.viewValById("txtSV_NgayCapBanGoc", data.NGAYCAPBANGOC);
        edu.util.viewValById("txtSV_HoiDongChungChi", data.THONGTINHOIDONGTHICHUNGCHI);

    },
    toggle_form: function () {
        var me = this;
        me.getList_QuanLyThongTin();
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
            'action': 'TN_VanBang_XacNhanIn/ThemMoi',
            'strId': "",
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
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
        var strSoQuyetDinh = edu.util.getValById('dropSearch_QuyetDinh');
        if (strSoQuyetDinh) strSoQuyetDinh = $("#dropSearch_QuyetDinh option:selected").text();
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
            'strSoQuyetDinh': strSoQuyetDinh,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dDoiTuongBenNgoai': edu.util.getValById('dropSearch_DoiTuong'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
        };
        var obj_save = {
            'action': 'TN_VanBang_ChungChi/LayDSTN_KetQua_CongNhan_VB',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValCombo('dropSearch_PhanLoai'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strSoQuyetDinh': strSoQuyetDinh,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dDoiTuongBenNgoai': edu.util.getValById('dropSearch_DoiTuong'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strPhoi_MauPhoiIn_Id': edu.util.getValById('dropAAAA'),
            'strPhoi_MauPhoiIn_BanSao_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTieuChiSapXep': edu.util.getValById('dropSearch_TieuChiSapXep'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
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
                    edu.system.alert(obj_save + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_save + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
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
            'strQLSV_NguoiHoc_Id': me.strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinhHoc'),
            'strXepLoai_Id': edu.util.getValById('dropXepLoai'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strPhoi_MauPhoiIn_Id': edu.util.getValById('dropMauPhoi'),
            'strPhoi_MauPhoiIn_BanSao_Id': edu.util.getValById('dropMauPhoi_BanSao'),
            'strQLSV_NguoiHoc_MaSo': edu.util.getValById('txtSV_MaSo'),
            'strQLSV_NguoiHoc_HoDem': edu.util.getValById('txtSV_HoDem'),
            'strQLSV_NguoiHoc_HoDem_TA': edu.util.getValById('txtSV_HoDem_TA'),
            'strQLSV_NguoiHoc_Ten': edu.util.getValById('txtSV_Ten'),
            'strQLSV_NguoiHoc_Ten_TA': edu.util.getValById('txtSV_Ten_TA'),
            'strQLSV_NguoiHoc_NgaySinh': edu.util.getValById('txtSV_NgaySinh'),
            'strQLSV_NguoiHoc_NgaySinh_TA': edu.util.getValById('txtSV_NgaySinh_TA'),
            'strQLSV_NguoiHoc_Thang': edu.util.getValById('txtSV_ThangSinh'),
            'strQLSV_NguoiHoc_Thang_TA': edu.util.getValById('txtSV_ThangSinh_TA'),
            'strQLSV_NguoiHoc_NamSinh': edu.util.getValById('txtSV_NamSinh'),
            'strQLSV_NguoiHoc_NamSinh_TA': edu.util.getValById('txtSV_NamSinh_TA'),
            'strQLSV_NguoiHoc_GioiTinh': edu.util.getValById('txtSV_GioiTinh'),
            'strQLSV_NguoiHoc_GioiTinh_TA': edu.util.getValById('txtSV_GioiTinh_TA'),
            'strQLSV_NguoiHoc_DanToc': edu.util.getValById('txtSV_DanToc'),
            'strQLSV_NguoiHoc_DanToc_TA': edu.util.getValById('txtSV_DanToc_TA'),
            'strQLSV_NguoiHoc_NoiSinh': edu.util.getValById('txtSV_NoiSinh'),
            'strQLSV_NguoiHoc_NoiSinh_TA': edu.util.getValById('txtSV_NoiSinh_TA'),
            'strQLSV_NguoiHoc_Nganh': edu.util.getValById('txtSV_NganhNghe'),
            'strQLSV_NguoiHoc_Nganh_TA': edu.util.getValById('txtSV_NganhNghe_TA'),
            'strQLSV_NguoiHoc_OngBa': edu.util.getValById('txtSV_OngBa'),
            'strQLSV_NguoiHoc_OngBa_TA': edu.util.getValById('txtSV_OngBa_TA'),
            'strNgayKyBang': edu.util.getValById('txtSV_NgayKyBang'),
            'strSoQuyetDinh': edu.util.getValById('txtSV_SoQuyetDinh'),
            'strNgayQuyetDinh': edu.util.getValById('txtSV_NgayQuyetDinh'),
            'strSoHieuBang': edu.util.getValById('txtSV_SoHieuBang'),
            'strSoVaoSoCapBang': edu.util.getValById('txtSV_SoVaoSo'),
            'strDuongDanAnh': edu.util.getValById('uploadPicture_SV'),
            'strNgayCapBanGoc': edu.util.getValById('txtSV_NgayCapBanGoc'),
            'strHoiDongThiChungChi': edu.util.getValById('txtSV_HoiDongChungChi'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_KetQua_CongNhan_VB/CapNhat';
            var objTT = me.dtQuanLyThongTin.find(e => e.ID == me.strQuanLyThongTin_Id);
            obj_save.strDaoTao_ChuongTrinh_Id = objTT.DAOTAO_TOCHUCCHUONGTRINH_ID;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuanLyThongTin_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strQuanLyThongTin_Id = data.Id;
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
            'action': 'TN_KetQua_CongNhan_VB/Xoa',
            

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
                    me.toggle_form();
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
    delete_QuanLyThongTinAll: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KetQua_CongNhan_VB/Xoa',


            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "(er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanLyThongTin();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_SinhTuDongSoHieu: function (arrChecked_Id, iThuTu) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KetQua_CongNhan_VB/SinhSoHieuVanBang',
            'strNgayThucHien': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strTN_KetQua_CongNhan_VB_Id': arrChecked_Id[iThuTu],
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
                if (arrChecked_Id.length > ++iThuTu)
                me.save_SinhTuDongSoHieu(arrChecked_Id, iThuTu);
                edu.system.start_Progress("zoneprocessQuanLyThongTin", function () {
                    //edu.system.iGioiHanLuong = 10;
                    me.getList_QuanLyThongTin();
                });
            },
            //async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_SinhSoVaoSo: function (arrChecked_Id, iThuTu) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KetQua_CongNhan_VB/SinhSoVaoSo',
            'strNgayThucHien': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strTN_KetQua_CongNhan_VB_Id': arrChecked_Id[iThuTu],
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        //console.log(obj_save);
        //return;
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
                if (arrChecked_Id.length > ++iThuTu)
                me.save_SinhSoVaoSo(arrChecked_Id, iThuTu);
                edu.system.start_Progress("zoneprocessQuanLyThongTin", function () {
                    //edu.system.iGioiHanLuong = 10;
                    me.getList_QuanLyThongTin();
                });
            },
            //async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_SinhQuyetDinh: function (strTN_KetQua_CongNhan_VB_Id, objForm) {
        var me = this;
        objForm = objForm || {};
        var obj_save = {
            'action': 'TN_VanBang_ChungChi_MH/EigvKRA0OCQ1BSgvKQPP',
            'func': 'PKG_VANBANG_CHUNGCHI.SinhQuyetDinh',
            'iM': edu.system.iM,
            'strTN_KetQua_CongNhan_VB_Id': strTN_KetQua_CongNhan_VB_Id,
            'strSoQD': edu.util.returnEmpty(objForm.strSoQD),
            'strNgayQD': edu.util.returnEmpty(objForm.strNgayQD),
            'strNgayHieuLuc': edu.util.returnEmpty(objForm.strNgayHieuLuc),
            'strNoiDung': edu.util.returnEmpty(objForm.strNoiDung),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessQuanLyThongTin", function () {
                    me.getList_QuanLyThongTin();
                });
            },
            async: false,
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
                center: [0, 4, 5, 6, 7, 8, 9, 10, 11],
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
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
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
                    "mDataProp": "TONGNOPHI"
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
    viewEdit_QuanLyThongTin: function (data) {
        var me = this;
        //View - Thong tin
        
        me.toggle_edit();
        me.strQLSV_NguoiHoc_Id = data.QLSV_NGUOIHOC_ID;

        edu.util.viewValById("uploadPicture_SV", data.DUONGDANANHCANHAN);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.DUONGDANANHCANHAN));
        $("#srcuploadPicture_SV").attr("src", strAnh);

        edu.util.viewValById("txtSV_MaSo", data.QLSV_NGUOIHOC_MASO);
        edu.util.viewValById("txtSV_HoDem", data.QLSV_NGUOIHOC_HODEM);
        edu.util.viewValById("txtSV_Ten", data.QLSV_NGUOIHOC_TEN);
        edu.util.viewValById("txtSV_HoDem_TA", data.QLSV_NGUOIHOC_HODEM_TA);
        edu.util.viewValById("txtSV_Ten_TA", data.QLSV_NGUOIHOC_TEN_TA);

        edu.util.viewValById("dropXepLoai", data.XEPLOAI_ID);
        edu.util.viewValById("txtSV_XepLoai_TA", data.QLSV_NGUOIHOC_XEPLOAI_TA);
        edu.util.viewValById("dropMauPhoi", data.PHOI_NGUOIHOC_NHAPTRUCTIEP_ID);
        edu.util.viewValById("dropMauPhoi_BanSao", data.PHOI_NGUOIHOC_NHAP_BANSAO_ID);
        edu.util.viewValById("dropSearch_ChuongTrinhHoc", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        me.getList_XepLoai(data.XEPLOAI_ID);

        edu.util.viewValById("txtSV_NgaySinhDD", data.NGAYSINHDAYDU);
        edu.util.viewValById("txtSV_NgaySinhDD_TA", data.NGAYSINHDAYDU_TA);

        edu.util.viewValById("txtSV_NgaySinh", data.QLSV_NGUOIHOC_NGAYSINH);
        edu.util.viewValById("txtSV_ThangSinh", data.QLSV_NGUOIHOC_THANGSINH);
        edu.util.viewValById("txtSV_NamSinh", data.QLSV_NGUOIHOC_NAMSINH);

        edu.util.viewValById("txtSV_NgaySinh_TA", data.QLSV_NGUOIHOC_NGAYSINH_TA);
        edu.util.viewValById("txtSV_ThangSinh_TA", data.QLSV_NGUOIHOC_THANGSINH_TA);
        edu.util.viewValById("txtSV_NamSinh_TA", data.QLSV_NGUOIHOC_NAMSINH_TA);

        edu.util.viewValById("txtSV_GioiTinh", data.QLSV_NGUOIHOC_GIOITINH);
        edu.util.viewValById("txtSV_GioiTinh_TA", data.QLSV_NGUOIHOC_GIOITINH_TA);

        edu.util.viewValById("txtSV_DanToc", data.QLSV_NGUOIHOC_DANTOC);
        edu.util.viewValById("txtSV_DanToc_TA", data.QLSV_NGUOIHOC_DANTOC_TA);

        edu.util.viewValById("txtSV_NoiSinh", data.QLSV_NGUOIHOC_NOISINH);
        edu.util.viewValById("txtSV_NoiSinh_TA", data.QLSV_NGUOIHOC_NOISINH_TA);

        edu.util.viewValById("txtSV_NganhNghe", data.QLSV_NGUOIHOC_NGANHNGHE);
        edu.util.viewValById("txtSV_NganhNghe_TA", data.QLSV_NGUOIHOC_NGANHNGHE_TA);

        edu.util.viewValById("txtSV_OngBa", data.QLSV_NGUOIHOC_ONGBA);
        edu.util.viewValById("txtSV_OngBa_TA", data.QLSV_NGUOIHOC_ONGBA_TA);

        edu.util.viewValById("txtSV_NgayKyBang", data.NGAYKYBANG);
        edu.util.viewValById("txtSV_SoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtSV_NgayQuyetDinh", data.NGAYQUYETDINH);
        edu.util.viewValById("txtSV_NgayVaoSo", data.NGAYVAOSOCAPBANG);
        edu.util.viewValById("txtSV_SoHieuBang", data.SOHIEUBANG);
        edu.util.viewValById("txtSV_SoVaoSo", data.SOVAOSOCAPBANG);
        edu.util.viewValById("txtSV_NgayCapBanGoc", data.NGAYCAPBANGOC);
        edu.util.viewValById("txtSV_HoiDongChungChi", data.THONGTINHOIDONGTHICHUNGCHI);
        me.strQuanLyThongTin_Id = data.ID;
        me.strChuongTrinhHoc_Id = data.DAOTAO_TOCHUCCHUONGTRINH_ID;
        me.getList_ThongTin();
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
    getList_PhanLoai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_Chung/LayDSPhanLoaiTheoNguoiDung',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_PhanLoai(dtReRult, data.Pager);
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

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_PhanLoai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_PhanLoai", "dropPhanLoai"],
            type: "",
            title: "Chọn phân loại"
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropSearch_PhanLoai", "dropPhanLoai"],
            type: "",
            title: "Chọn phân loại",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_QuyetDinh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua_CongNhan_VB/LayDSQD_KetQua_CongNhan_VB',
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
                    me.cbGenCombo_QuyetDinh(dtReRult, data.Pager);
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
    cbGenCombo_QuyetDinh: function (data) {
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
            renderPlace: ["dropSearch_QuyetDinh"],
            type: "",
            title: "Chọn quyết định",
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_TimSinhVien: function () {
        var me = this;

        $(".btnOpenDelete").hide();
        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayChiTiet',
            'type': 'GET',
            'strId': edu.util.getValById('txtSV_MaTimKiem'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length == 1) {
                        me.strQLSV_NguoiHoc_Id = dtReRult[0].ID;
                        $('#lblSinhVien').html(dtReRult[0].MASO + ' - ' + dtReRult[0].HODEM + " " + dtReRult[0].TEN);
                        me.getList_ChuongTrinh();
                    }
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
    getList_ChuongTrinh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_Chung/LayDSChuongTrinh',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinh(dtReRult);
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
    cbGenCombo_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_ChuongTrinhHoc"],
            type: "",
            title: "Chọn chương trình",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length == 1) {
            $("#dropSearch_ChuongTrinhHoc").trigger({ type: 'select2:select' });

        }
    },

    getList_ThongTinSinhVien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua_CongNhan_VB/LayTTTN_KetQua_CongNhan_VB',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinhHoc'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        me.dtQuanLyThongTin = dtReRult;
                        me.viewEdit_QuanLyThongTin(dtReRult[0]);
                    }
                    else {
                        edu.system.alert("Sinh viên không có dữ liệu in!");
                        //me.getList_KeThuaSinhVien();
                    }
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

    getList_KeThuaSinhVien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua_CongNhan_VB/KeThuaTTTN_KetQua_CongNhan_VB',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinhHoc'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        me.viewEdit_QuanLyThongTin(dtReRult[0]);
                        me.strQuanLyThongTin_Id = "";
                    }
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
    getList_MauPhoiIn: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_PhoiIn/LayDS_MauPhoiIn_BanChinh',
            'strId': edu.util.getValById('txtAAAA')
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_MauPhoiIn(dtReRult, data.Pager);
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
    genCombo_MauPhoiIn: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAPHOI",
                //selectOne: true
            },
            renderPlace: ["dropMauPhoi"],
            title: "Chọn mẫu phôi"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_MauPhoiInBanSao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_PhoiIn/LayDS_MauPhoiIn_BanSao',
            'strId': edu.util.getValById('txtAAAA')
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_MauPhoiInBanSao(dtReRult, data.Pager);
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
    genCombo_MauPhoiInBanSao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAPHOI",
                //selectOne: true
            },
            renderPlace: ["dropMauPhoi_BanSao"],
            title: "Chọn mẫu phôi"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_XepLoai: function (strXepLoai) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_VanBang_ChungChi_Chung/LayDSXepLoaiTheoPhanLoai',
            'type': 'GET',
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_XepLoai(dtReRult, data.Pager, strXepLoai);
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
    genCombo_XepLoai: function (data, iPage, strXepLoai) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                //selectOne: true
                default_val: strXepLoai
            },
            default_val: strXepLoai,
            renderPlace: ["dropXepLoai"],
            title: "Chọn xếp loại"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThongTin
    --ULR:  Modules
    -------------------------------------------*/
    save_ThongTin: function (strKetQua_Id, strPhoi_MauPhoiIn_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strTruongThongTin_Id = edu.util.getValById('txtSoVaoSo' + strKetQua_Id);
        if (!edu.util.checkValue(strTruongThongTin_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TN_VanBang_BanSao/ThemMoi',

            'strId': strId,
            'strQLSV_NguoiHoc_Id': me.strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinhHoc_Id,
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strPhoi_MauPhoiIn_Id': edu.util.getValById('dropMauPhoi_BanSao'),
            'strSoVaoSoBanSao': edu.util.getValById('txtSoVaoSo' + strKetQua_Id),
            'dDaIn': edu.util.getValById('dropDaIn' + strKetQua_Id),
            'iThuTu': edu.util.getValById('txtThuTu' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'TN_VanBang_BanSao/CapNhat';
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

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThongTin: function () {
        var me = this;
        var strDaoTao_ChuongTrinh_Id = (me.strChuongTrinhHoc_Id == "") ? edu.util.getValById('dropSearch_ChuongTrinhHoc') : me.strChuongTrinhHoc_Id;
        var obj_list = {
            'action': 'TN_VanBang_BanSao/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strPhoi_MauPhoiIn_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 200000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThongTin_Data(dtResult);
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
    delete_ThongTin: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'TN_VanBang_BanSao/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThongTin(data.Data);
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
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
    genHTML_ThongTin_Data: function (data) {
        var me = this;
        $("#tblCauHinhThongTin tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td><input type="text" id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control"/></td>';
            row += '<td><select id="dropDaIn' + strKetQua_Id + '" class="select-opt"><option value="0">Chưa In</option ><option value="1">Đã In</option ></select ></td>';
            row += '<td><input type="text" id="txtSoVaoSo' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOVAOSOCAPBANSAO) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblCauHinhThongTin tbody").append(row);
            //me.genComBo_TruongTT("dropDaIn" + strKetQua_Id, data[i].DAIN);
            $("#dropDaIn" + strKetQua_Id).select2();
            $("#dropDaIn" + strKetQua_Id).val(aData.DAIN).trigger("change");
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        }
    },
    genHTML_ThongTin: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblCauHinhThongTin").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td><input type="text" id="txtThuTu' + strKetQua_Id + '" value="' + iViTri + '" class="form-control"/></td>';
        row += '<td><select id="dropDaIn' + strKetQua_Id + '" class="select-opt"><option value="0">Chưa In</option ></select ></td>';
        row += '<td><input type="text" id="txtSoVaoSo' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOVAOSOCAPBANSAO) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblCauHinhThongTin tbody").append(row);
        $("#dropDaIn" + strKetQua_Id).select2();
    },


    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KeHoachXuLy(dtReRult)
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
    cbGenCombo_KeHoachXuLy: function (data) {
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
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    
}