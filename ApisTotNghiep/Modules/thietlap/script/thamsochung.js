/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ThamSoChung() { };
ThamSoChung.prototype = {
    dtDieuKienChung: [],
    strDieuKienChung_Id: '',
    strPhanCapApDung: '',

    dtDieuKienRieng: [],
    strDieuKienRieng_Id: '',

    dtPhanLoai: [],
    dtXepLoai: [],
    dtNguoiDung: [],
    dtTinhTrang: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_DieuKienChung();
        me.getList_DieuKienRieng();
        
        me.getList_NguoiDung();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_KhoaQuanLy();
        edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai,dropSearch_PhanLoaiRieng", "", function (data) { main_doc.ThamSoChung.dtPhanLoai = data; });
        edu.system.loadToCombo_DanhMucDuLieu("VANBANG.XEPLOAI", "", "", function (data) { main_doc.ThamSoChung.dtXepLoai = data; });
        edu.system.loadToCombo_DanhMucDuLieu("TN.XACNHAN", "", "", function (data) { main_doc.ThamSoChung.dtTinhTrang = data; });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAILOP", "dropMoHinh");

        edu.system.loadToCombo_DanhMucDuLieu("KHCT.TTHP", "dropThuocTinhKiemTra");
        edu.system.loadToCombo_DanhMucDuLieu("TN.MUCVIPHAMKYLUAT", "dropMucKyLuat");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DANHGIA", "dropMucDanhGia");
        edu.system.loadToCombo_DanhMucDuLieu("TN.KIEUXETHOANTHANHCHUONGTRINH", "dropMoHinhKiemTra");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.TTHP", "dropThuocTinhMonThi");

        $("#btnSearch").click(function (e) {
            me.getList_DieuKienChung();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DieuKienChung();
            }
        });

        $("#btnSearchRieng").click(function (e) {
            me.getList_DieuKienRieng();
        });
        $("#txtSearchRieng").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DieuKienRieng();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $(".btnKhaiBaoThamSo").click(function () {
            me.toggle_danhmuc();
        });
        
        $("#btnSave_DanhMuc").click(function (e) {
            $("#tblPhanLoaiXepLoai tbody tr").each(function () {
                var strElementId = this.id.replace(/rm_row/g, '');
                me.save_PhanLoaiXepLoai(strElementId, strKetQua_Id);
            });
            $("#tblLoaiXetTinhTrang tbody tr").each(function () {
                var strElementId = this.id.replace(/rm_row/g, '');
                me.save_LoaiXetTinhTrang(strElementId, strKetQua_Id);
            });
            $("#tblNguoiDungTinhTrang tbody tr").each(function () {
                var strElementId = this.id.replace(/rm_row/g, '');
                me.save_NguoiDungTinhTrang(strElementId, strKetQua_Id);
            });
        });
        $("#btnSave_ThamSoChung").click(function (e) {
            switch (me.strPhanCapApDung) {
                case "":
                    me.save_DieuKienChung();
                    break;
                case "HSSV":
                    me.save_DieuKienRieng($("#dropHocVien").val());
                    break;
                case "KEHOACHXETTOTNGHIEP":
                    me.save_DieuKienRieng($("#dropKeHoach").val());
                    break;
                case "LOPQUANLY":
                    me.save_DieuKienRieng($("#dropLop").val());
                    break;
                case "CHUONGTRINH":
                    me.save_DieuKienRieng($("#dropChuongTrinh").val());
                    break;
                case "KHOAHOC":
                    me.save_DieuKienRieng($("#dropKhoaDaoTao").val());
                    break;
                case "KHOAQUANLY":
                    me.save_DieuKienRieng($("#dropKhoaQuanLy").val());
                    break;
                case "HEDAOTAO":
                    me.save_DieuKienRieng($("#dropHeDaoTao").val());
                    break;
                case "MOHINHNIENCHE_TINCHI":
                    me.save_DieuKienRieng($("#dropMoHinh").val());
                    break;
            }
        });
        $("#btnDelete_ThamSoChung").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                if (me.strPhanCapApDung === "") {
                    me.delete_DieuKienChung(me.strDieuKienChung_Id);
                } else {
                    me.delete_DieuKienRieng(me.strDieuKienRieng_Id);
                }
            });
        });
        $("#tblDieuKienChung").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            edu.util.setOne_BgRow(strId, "tblDieuKienChung");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDieuKienChung, "ID")[0];
                me.viewEdit_DieuKienChung(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDieuKienRieng").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            edu.util.setOne_BgRow(strId, "tblDieuKienRieng");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDieuKienRieng, "ID")[0];
                me.viewEdit_DieuKienRieng(data);
                me.toggle_edit();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSaveTuKhoa").click(function (e) {
            $("#tblTuKhoa tbody tr").each(function () {
                me.save_TuKhoa(this.id);
            });
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $('#dropHeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao(this.value);
        });
        $('#dropKhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao(this.value);
            me.getList_LopQuanLy(this.value, "");
        });
        $('#dropChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy("", this.value);
        });
        $('#dropLop').on('select2:select', function (e) {
            var x = $(this).val();
            me.getList_SinhVien(this.value);
        });
        $('#dropSearch_PhanCapApDung_AD').on('select2:select', function (e) {
            me.getList_DieuKienRieng();
        });
        $('#dropSearch_PhanLoaiRieng').on('select2:select', function (e) {
            me.getList_PhanCapApDung();
        });
        /*------------------------------------------
      --Discription: [4-1] Action KetQua_Detai
      --Order:
      -------------------------------------------*/
        $("#btnAdd_PhanLoaiXepLoai").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_PhanLoaiXepLoai(id, "");
        });
        $("#tblPhanLoaiXepLoai").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblPhanLoaiXepLoai tr[id='" + strRowId + "']").remove();
        });
        $("#tblPhanLoaiXepLoai").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_PhanLoaiXepLoai(strId);
            });
        });
        /*------------------------------------------
      --Discription: [4-1] Action KetQua_Detai
      --Order:
      -------------------------------------------*/
        $("#btnAdd_LoaiXetTinhTrang").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_LoaiXetTinhTrang(id, "");
        });
        $("#tblLoaiXetTinhTrang").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblLoaiXetTinhTrang tr[id='" + strRowId + "']").remove();
        });
        $("#tblLoaiXetTinhTrang").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_LoaiXetTinhTrang(strId);
            });
        });
        /*------------------------------------------
      --Discription: [4-1] Action KetQua_Detai
      --Order:
      -------------------------------------------*/
        $("#btnAdd_NguoiDungTinhTrang").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_NguoiDungTinhTrang(id, "");
        });
        $("#tblNguoiDungTinhTrang").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblNguoiDungTinhTrang tr[id='" + strRowId + "']").remove();
        });
        $("#tblNguoiDungTinhTrang").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_NguoiDungTinhTrang(strId);
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDieuKienChung_Id = "";
        me.strDieuKienRieng_Id = "";

        if ($("#tab_1").hasClass("active")) {
            edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        } else {
            edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoaiRieng"));
        }
        //edu.util.viewValById("dropPhanLoai", "");
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLop", "");
        edu.util.viewValById("dropKeHoach", "");
        edu.util.viewValById("dropKhoaQuanLy", "");
        edu.util.viewValById("dropMoHinh", "");
        edu.util.viewValById("txtXauDieuKien", "");
        edu.util.viewValById("txtMoTa", "");

        edu.util.viewValById("dropThuocTinhKiemTra", "");
        edu.util.viewValById("dropHocPhanTinhDiem", 1);
        edu.util.viewValById("dropMucKyLuat", "");
        edu.util.viewValById("dropMucDanhGia", "");
        edu.util.viewValById("dropMoHinhKiemTra", "");
        edu.util.viewValById("dropThuocTinhMonThi", "");
        edu.util.viewValById("dropMonHocTuongDuong", 1);
        edu.util.viewValById("dropApDungTuDong", 1);
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        if ($("#tab_1").hasClass("active")) {
            me.strPhanCapApDung = "";
        } else {
            if ($("#dropSearch_PhanCapApDung_AD").val() == "") {
                edu.system.alert("Hãy chọn phân cấp áp dụng");
                return;
            }
            me.strPhanCapApDung = $("#dropSearch_PhanCapApDung_AD option:selected").attr("name");
        }
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        switch (me.strPhanCapApDung) {
            case "":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "HSSV":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().show();
                $("#dropLop").parent().parent().show();
                $("#dropHocVien").parent().parent().show();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "KEHOACHXETTOTNGHIEP":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().show();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "LOPQUANLY":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().show();
                $("#dropLop").parent().parent().show();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "CHUONGTRINH":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().show();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "KHOAHOC":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().show();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "KHOAQUANLY":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().show();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "HEDAOTAO":
                $("#dropHeDaoTao").parent().parent().show();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().hide();
                break;
            case "MOHINHNIENCHE_TINCHI":
                $("#dropHeDaoTao").parent().parent().hide();
                $("#dropKhoaDaoTao").parent().parent().hide();
                $("#dropChuongTrinh").parent().parent().hide();
                $("#dropLop").parent().parent().hide();
                $("#dropHocVien").parent().parent().hide();
                $("#dropKeHoach").parent().parent().hide();
                $("#dropKhoaQuanLy").parent().parent().hide();
                $("#dropMoHinh").parent().parent().show();
                break;
        }
    },
    toggle_danhmuc: function () {
        var me = this;
        //($("#tab_1").hasClass("active")) ? me.strPhanLoai = $("#dropSearch_PhanLoai").val() : me.strPhanLoai = $("#dropSearch_PhanLoaiRieng").val();
        //if (me.strPhanLoai == "") {
        //    edu.system.alert("Hãy chọn phân loại xét");
        //    return;
        //}
        edu.util.toggle_overide("zone-bus", "zonedanhmuc");
        me.getList_PhanLoaiXepLoai();
        me.getList_PhanCapApDung();
        me.getList_NguoiDungTinhTrang();
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienChung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XetDuyet_ThamSo/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDieuKienChung = dtReRult;
                    me.genTable_DieuKienChung(dtReRult, data.Pager);
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
    save_DieuKienChung: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_XetDuyet_ThamSo/ThemMoi',

            'strId': me.strDieuKienChung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHT_ThuocTinhHocPhan_Id': edu.util.getValCombo('dropThuocTinhKiemTra'),
            'strHT_HocPhanTinhDiem': edu.util.getValCombo('dropHocPhanTinhDiem'),
            'strHT_MucKyLuat_Id': edu.util.getValCombo('dropMucKyLuat'),
            'strHT_DanhGia_Id': edu.util.getValCombo('dropMucDanhGia'),
            'strHT_KieuXet_Id': edu.util.getValCombo('dropMoHinhKiemTra'),
            'strHT_ThuocTinh_MonThi_Id': edu.util.getValCombo('dropThuocTinhMonThi'),
            'strHT_XetMonTuongDuong': edu.util.getValCombo('dropMonHocTuongDuong'),
            'strHT_ChoXetTuDong': edu.util.getValCombo('dropApDungTuDong'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'iThuTu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_XetDuyet_ThamSo/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienChung_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DieuKienChung();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThamSoChung/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienChung: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_XetDuyet_ThamSo/Xoa',


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
                    me.getList_DieuKienChung();
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DieuKienChung: function (data, iPager) {
        var me = this;
        $("#lblDieuKienChung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDieuKienChung",

            bPaginate: {
                strFuntionName: "main_doc.ThamSoChung.getList_DieuKienChung()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "HOANTHANH_THUOCTINHHOCPHAN_TEN",
                },
                {
                    "mDataProp": "HOANTHANH_HOCPHANTINHDIEM_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_MUCKYLUAT_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_DANHGIA_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_KIEUXET_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_THUOCTINH_MONTHI_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_XETMONTUONGDUONG_TEN"
                },
                {
                    "mDataProp": "HETHONG_CHOXETTUDONG_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditDieuKienChung" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_DieuKienChung: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        

        edu.util.viewValById("dropThuocTinhKiemTra", toArr(data.HOANTHANH_THUOCTINHHOCPHAN_ID));
        edu.util.viewValById("dropHocPhanTinhDiem", data.HOANTHANH_HOCPHANTINHDIEM);
        edu.util.viewValById("dropMucKyLuat", toArr(data.HOANTHANH_MUCKYLUAT_ID));
        edu.util.viewValById("dropMucDanhGia", toArr(data.HOANTHANH_DANHGIA_ID));
        edu.util.viewValById("dropMoHinhKiemTra", data.HOANTHANH_KIEUXET_ID);
        edu.util.viewValById("dropThuocTinhMonThi", toArr(data.HOANTHANH_THUOCTINH_MONTHI_ID));
        edu.util.viewValById("dropMonHocTuongDuong", data.HOANTHANH_XETMONTUONGDUONG);
        edu.util.viewValById("dropApDungTuDong", data.HETHONG_CHOXETTUDONG);
        me.strDieuKienChung_Id = data.ID;

        function toArr(strInput) {
            if (strInput == null) return [""];
            var x = [strInput];
            if (strInput.indexOf(',') != -1) x = strInput.split(',');
            return x;
        }
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienRieng: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XetDuyet_ThamSo_Ad/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearchRieng'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoaiRieng'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_PhamViApDung_AD'),
            'strPhanCapApDung_Id': edu.util.getValById('dropSearch_PhanCapApDung_AD'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian_AD'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDieuKienRieng = dtReRult;
                    me.genTable_DieuKienRieng(dtReRult, data.Pager);
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
    save_DieuKienRieng: function (strPhamViApDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_XetDuyet_ThamSo_Ad/ThemMoi',

            'strId': me.strDieuKienRieng_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtXauDieuKien'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'iThuTu': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_XetDuyet_ThamSo_Ad/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienChung_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DieuKienRieng();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThamSoChung/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienRieng: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_XetDuyet_ThamSo_Ad/Xoa',


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
                    me.getList_DieuKienRieng();
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DieuKienRieng: function (data, iPager) {
        var me = this;
        $("#lblDieuKienRieng_Tong").html(iPager);
        $("#lblPhamVi_Ten").html($("#dropSearch_PhanCapApDung_AD option:selected").text());
        var jsonForm = {
            strTable_Id: "tblDieuKienRieng",

            bPaginate: {
                strFuntionName: "main_doc.ThamSoChung.getList_DieuKienRieng()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_THUOCTINHHOCPHAN_TEN",
                },
                {
                    "mDataProp": "HOANTHANH_HOCPHANTINHDIEM_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_MUCKYLUAT_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_DANHGIA_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_KIEUXET_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_THUOCTINH_MONTHI_TEN"
                },
                {
                    "mDataProp": "HOANTHANH_XETMONTUONGDUONG_TEN"
                },
                {
                    "mDataProp": "HETHONG_CHOXETTUDONG_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditDieuKienRieng" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_DieuKienRieng: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropSearch_PhanCapApDung_AD", data.PHANCAPAPDUNG_ID);
        edu.util.viewValById("dropHeDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropKhoaDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropChuongTrinh", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropLop", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropKeHoach", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropKhoaQuanLy", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropMoHinh", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("txtXauDieuKien", data.XAUDIEUKIEN);
        edu.util.viewValById("txtMoTa", data.MOTA);

        edu.util.viewValById("dropThuocTinhKiemTra", toArr(data.HOANTHANH_THUOCTINHHOCPHAN_ID));
        edu.util.viewValById("dropHocPhanTinhDiem", data.HOANTHANH_HOCPHANTINHDIEM);
        edu.util.viewValById("dropMucKyLuat", toArr(data.HOANTHANH_MUCKYLUAT_ID));
        edu.util.viewValById("dropMucDanhGia", toArr(data.HOANTHANH_DANHGIA_ID));
        edu.util.viewValById("dropMoHinhKiemTra", data.HOANTHANH_KIEUXET_ID);
        edu.util.viewValById("dropThuocTinhMonThi", toArr(data.HOANTHANH_THUOCTINH_MONTHI_ID));
        edu.util.viewValById("dropMonHocTuongDuong", data.HOANTHANH_XETMONTUONGDUONG);
        edu.util.viewValById("dropApDungTuDong", data.HETHONG_CHOXETTUDONG);
        me.strDieuKienRieng_Id = data.ID;

        function toArr(strInput) {
            if (strInput == null) return [""];
            var x = [strInput];
            if (strInput.indexOf(',') != -1) x = strInput.split(',');
            return x;
        }
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
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var objList = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
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
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
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
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'strTuKhoa': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropLop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGenCombo_HocVien(dtResult);
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
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.ThamSoChung;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: "",
                default_val: me.strChuongTrinh_Id
            },
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình",
        };
        edu.system.loadToCombo_data(obj);
        if (me.strChuongTrinh_Id != "") {
            me.getList_LopQuanLy("", me.strChuongTrinh_Id);
        }
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.ThamSoChung;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                default_val: me.strLop_Id
            },
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (me.strLop_Id != "") {
            me.getList_SinhVien();
        }
    },
    cbGenCombo_HocVien: function (data) {
        var me = main_doc.ThamSoChung;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: me.strHocVien_Id
            },
            renderPlace: ["dropHocVien"],
            type: "",
            title: "Chọn học viên",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.ThamSoChung;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian_AD", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        };
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
        main_doc.ThamSoChung.dtTrangThai = data;
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
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
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
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_NguoiDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_NguoiDung/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': '',
            'pageIndex':1,
            'pageSize': 1000000,
            'iTrangThai': 1,
            'strChung_DonVi_Id': "",
            'strVaiTro_Id': "",
            'strPhanLoaiDoiTuong': '',
            'strCapXuLy_Id': "",
            'strTinhThanh_Id': ""
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDung = data.Data;
                }
                else {
                    edu.system.alert("CMS_NguoiDung/LayDanhSach: " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert("CMS_NguoiDung/LayDanhSach (er): " + JSON.stringify(er), "w");
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
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_PhanCapApDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_PhanCapApDung/LayDanhSach',
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoaiRieng'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtPhanCap"] = json;
                    me.cbGenCombo_PhanCapApDung(json);
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
    cbGenCombo_PhanCapApDung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropSearch_PhanCapApDung_AD"],
            type: "",
            title: "Chọn phân cấp áp dụng",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_PhanCapApDung_AD", data[0].ID);
            me.getList_DieuKienRieng();
        } 
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TuKhoa: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XetDuyet_TuKhoa/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TuKhoa(dtReRult, data.Pager);
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
    save_TuKhoa: function (strId) {
        var me = this;
        var pTenTuKhoa = $("#txtTuKhoa_" + strId);
        var pMoTa = $("#txtMoTa_" + strId);
        if (pTenTuKhoa.val() === pTenTuKhoa.attr("title") && pMoTa.val() === pMoTa.attr("title")) return;
        //--Edit
        var obj_save = {
            'action': 'TN_XetDuyet_TuKhoa/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTenTuKhoa': pTenTuKhoa.val(),
            'strMoTa': pMoTa.val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TN_XetDuyet_TuKhoa/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienChung_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                //me.getList_DieuKienChung();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThamSoChung/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_TuKhoa: function (data, iPager) {
        var me = this;
        $("#lblTuKhoa_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTuKhoa",

            bPaginate: {
                strFuntionName: "main_doc.ThamSoChung.getList_TuKhoa()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA",
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtTuKhoa_' + aData.ID + '" title="' + edu.util.returnEmpty(aData.TENTUKHOA) + '" value="' + edu.util.returnEmpty(aData.TENTUKHOA) + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtMoTa_' + aData.ID + '" title="' + edu.util.returnEmpty(aData.MOTA) + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
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
            'pageIndex':1,
            'pageSize': 10000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KeHoach(dtReRult, data.Pager);
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
    cbGenCombo_KeHoach: function (data) {
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
            renderPlace: ["dropKeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/

    genComBo_PhanLoai: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtPhanLoai,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn phân loại"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_XepLoai: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtXepLoai,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn xếp loại"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_NguoiDung: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtNguoiDung,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDAYDU",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn người dùng"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_TinhTrang: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTinhTrang,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn tình trạng"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_PhanLoaiXepLoai: function (strElement_Id, strTN_XepLoai_DieuKien_Id) {
        var me = this;
        var strId = strElement_Id;
        var strPhanLoai_Id = edu.util.getValById('dropPhanLoai' + strElement_Id);
        var strXepLoai_Id = edu.util.getValById('dropXepLoai' + strElement_Id);

        if (strPhanLoai_Id === $('#dropPhanLoai' + strElement_Id).attr("name") && strXepLoai_Id === $('#dropXepLoai' + strElement_Id).attr("name")) return;

        if (strId.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_PhanLoai_XepLoai/ThemMoi',


            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanLoai_Id': strPhanLoai_Id,
            'strXepLoai_Id': strXepLoai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'TN_PhanLoai_XepLoai/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
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
    getList_PhanLoaiXepLoai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_PhanLoai_XepLoai/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_PhanLoaiXepLoai_Data(dtResult);
                    }
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
    delete_PhanLoaiXepLoai: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_PhanLoai_XepLoai/Xoa',

            'strIds': strIds,
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
                    me.getList_PhanLoaiXepLoai();
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_PhanLoaiXepLoai_Data: function (data) {
        var me = this;
        $("#tblPhanLoaiXepLoai tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strElement_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strElement_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strElement_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropPhanLoai' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].PHANLOAI_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><select id="dropXepLoai' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].XEPLOAI_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strElement_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblPhanLoaiXepLoai tbody").append(row);
            me.genComBo_PhanLoai("dropPhanLoai" + strElement_Id, data[i].PHANLOAI_ID);
            me.genComBo_XepLoai("dropXepLoai" + strElement_Id, data[i].XEPLOAI_ID);
        }
    },
    genHTML_PhanLoaiXepLoai: function (strElement_Id) {
        var me = this;
        var iViTri = document.getElementById("tblPhanLoaiXepLoai").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strElement_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strElement_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropPhanLoai' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><select id="dropXepLoai' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strElement_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblPhanLoaiXepLoai tbody").append(row);
        me.genComBo_PhanLoai("dropPhanLoai" + strElement_Id, "");
        me.genComBo_XepLoai("dropXepLoai" + strElement_Id, "");
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_NguoiDungTinhTrang: function (strElement_Id, strTN_XepLoai_DieuKien_Id) {
        var me = this;
        var strId = strElement_Id;
        var strPhanLoai_Id = edu.util.getValById('dropPhanLoai' + strElement_Id);
        var strNguoiDung_Id = edu.util.getValById('dropNguoiDung' + strElement_Id);
        var strTinhTrang_Id = edu.util.getValById('dropTinhTrang' + strElement_Id);

        if (strPhanLoai_Id === $('#dropPhanLoai' + strElement_Id).attr("name") && strNguoiDung_Id === $('#dropNguoiDung' + strElement_Id).attr("name") && strTinhTrang_Id === $('#dropTinhTrang' + strElement_Id).attr("name")) return;

        if (strId.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_NguoiDung_TinhTrang/ThemMoi',


            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanLoai_Id': strPhanLoai_Id,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'TN_NguoiDung_TinhTrang/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
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
    getList_NguoiDungTinhTrang: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_NguoiDung_TinhTrang/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_NguoiDungTinhTrang_Data(dtResult);
                    }
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
    delete_NguoiDungTinhTrang: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_NguoiDung_TinhTrang/Xoa',

            'strIds': strIds,
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
                    me.getList_NguoiDungTinhTrang();
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_NguoiDungTinhTrang_Data: function (data) {
        var me = this;
        $("#tblNguoiDungTinhTrang tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strElement_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strElement_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strElement_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropPhanLoai' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].PHANLOAI_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><select id="dropNguoiDung' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].NGUOIDUNG_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><select id="dropTinhTrang' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].TINHTRANG_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strElement_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblNguoiDungTinhTrang tbody").append(row);
            me.genComBo_PhanLoai("dropPhanLoai" + strElement_Id, data[i].PHANLOAI_ID);
            me.genComBo_NguoiDung("dropNguoiDung" + strElement_Id, data[i].NGUOIDUNG_ID);
            me.genComBo_TinhTrang("dropTinhTrang" + strElement_Id, data[i].TINHTRANG_ID);
        }
    },
    genHTML_NguoiDungTinhTrang: function (strElement_Id) {
        var me = this;
        var iViTri = document.getElementById("tblNguoiDungTinhTrang").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strElement_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strElement_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropPhanLoai' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><select id="dropNguoiDung' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><select id="dropTinhTrang' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strElement_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblNguoiDungTinhTrang tbody").append(row);
        me.genComBo_PhanLoai("dropPhanLoai" + strElement_Id, "");
        me.genComBo_NguoiDung("dropNguoiDung" + strElement_Id, "");
        me.genComBo_TinhTrang("dropTinhTrang" + strElement_Id, "");
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_LoaiXetTinhTrang: function (strElement_Id, strTN_XepLoai_DieuKien_Id) {
        var me = this;
        var strId = strElement_Id;
        var strPhanLoai_Id = edu.util.getValById('dropPhanLoai' + strElement_Id);
        var strTinhTrang_Id = edu.util.getValById('dropTinhTrang' + strElement_Id);

        if (strPhanLoai_Id === $('#dropPhanLoai' + strElement_Id).attr("name") && strTinhTrang_Id === $('#dropTinhTrang' + strElement_Id).attr("name")) return;

        if (strId.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_XacNhan_TinhTrang/ThemMoi',


            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanLoai_Id': strPhanLoai_Id,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'TN_XacNhan_TinhTrang/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
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
    getList_LoaiXetTinhTrang: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_XacNhan_TinhTrang/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_LoaiXetTinhTrang_Data(dtResult);
                    }
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
    delete_LoaiXetTinhTrang: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_XacNhan_TinhTrang/Xoa',

            'strIds': strIds,
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
                    me.getList_LoaiXetTinhTrang();
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_LoaiXetTinhTrang_Data: function (data) {
        var me = this;
        $("#tblLoaiXetTinhTrang tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strElement_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strElement_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strElement_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropPhanLoai' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].PHANLOAI_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><select id="dropTinhTrang' + strElement_Id + '" name="' + edu.util.returnEmpty(data[i].TINHTRANG_ID) + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strElement_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblLoaiXetTinhTrang tbody").append(row);
            me.genComBo_PhanLoai("dropPhanLoai" + strElement_Id, data[i].PHANLOAI_ID);
            me.genComBo_TinhTrang("dropTinhTrang" + strElement_Id, data[i].TINHTRANG_ID);
        }
    },
    genHTML_LoaiXetTinhTrang: function (strElement_Id) {
        var me = this;
        var iViTri = document.getElementById("tblLoaiXetTinhTrang").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strElement_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strElement_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropPhanLoai' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><select id="dropTinhTrang' + strElement_Id + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strElement_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblLoaiXetTinhTrang tbody").append(row);
        me.genComBo_PhanLoai("dropPhanLoai" + strElement_Id, "");
        me.genComBo_TinhTrang("dropTinhTrang" + strElement_Id, "");
    },
}