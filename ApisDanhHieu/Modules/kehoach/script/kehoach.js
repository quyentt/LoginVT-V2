/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',
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

        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();
        //edu.system.loadToCombo_DanhMucDuLieu("HB.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai");
        me.getList_LoaiDanhHieu();

        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
        });
        $("[id$=chkSelectAll_KeHoachXuLy]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKeHoachXuLy" });
        });
        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachXuLy(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_KeHoachXuLy();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });

        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (me.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $("#ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            if (me.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $("#ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearchDTSV_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblKeHoachXuLy").delegate('.btnDSDoiTuong', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this.id);
        });

        $("#tblKeHoachXuLy").delegate('.btnDieuKien', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zoneDieuKien");
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            me.getList_DieuKien();
        });
        $("#chkSelectAll_DieuKien").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#btnSave_DieuKien").click(function () {
            var arrThem = [];
            $(".inputxau").each(function () {
                var point = this;
                if ($(point).val() != $(point).attr("name")) {
                    console.log($(point).attr("name"))
                    arrThem.push(point.id);
                }
            });
            if (!arrThem.length) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
                arrThem.forEach(e => {
                    me.save_DieuKien(e);
                });
            });
        });
        $("#btnDelete_DieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDieuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DieuKien(arrChecked_Id[i]);
                }
            });
        });


        $("#tblKeHoachXuLy").delegate('.btnKetQua', 'click', function (e) {
            $('#myModalKetQua').modal('show');
            me.getList_NhanHocBong(this.id);
        });

        edu.system.getList_MauImport("zonebtnBaoCao_KH", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strPhanLoai_Id': edu.util.getValById('dropSearch_LoaiDanhHieu'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strXLDH_KeHoach_Id', e));
        });
        $(".btnDeleteDTSV_SinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";
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
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_LoaiDanhHieu'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
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
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach',
            'type': 'POST',

            'strId': me.strKeHoachXuLy_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById('txtTen'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strNgayBatDau': edu.util.getValById('txtTuNgay'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgay'),
            'strPhanLoai_Id': edu.util.getValById('dropLoaiDanhHieu'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'dHieuLuc': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'HB_XepLoaiDanhHieu/Sua_XLDH_KeHoach';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new") {
                            me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                        }
                    });
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    });

                    for (var i = 0; i < me.arrKhoa.length; i++) {
                        me.save_Khoa(strKeHoachXuLy_Id, me.arrKhoa[i]);
                    }
                    for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                        me.save_ChuongTrinh(strKeHoachXuLy_Id, me.arrChuongTrinh[i]);
                    }
                    for (var i = 0; i < me.arrLop.length; i++) {
                        me.save_Lop(strKeHoachXuLy_Id, me.arrLop[i]);
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachXuLy: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'HB_XepLoaiDanhHieu/Xoa_XLDH_TieuChuan_AD',
            
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
                    me.getList_KeHoachXuLy();
                }
                else {
                    obj = {
                        content: "KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "HB_KeHoach/Xoa (er): " + JSON.stringify(er),
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

    save_Lop: function (strXLDH_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViLop',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
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
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strXLDH_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViCT',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
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
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strXLDH_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {

            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViKhoa',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
        //}
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
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

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
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default" id="DSPhanCong' + aData.ID + '" title="Chi tiết"></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDieuKien" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
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
        for (var i = 0; i < data.length; i++) {
            me.getList_PhanCong(data[i].ID);
        }
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        //edu.util.viewValById("dropHieuLuc", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropLoaiDanhHieu", data.PHANLOAI_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        me.strKeHoachXuLy_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_ThanhVien();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_PhanCong: function (strHB_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_NhanSu',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strXLDH_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhanSu = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strNhanSu += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strNhanSu != "") strNhanSu = strNhanSu.substring(1);
                    $("#DSPhanCong").html(strNhanSu);
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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strHB_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDoiTuong = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strDoiTuong += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strDoiTuong != "") strDoiTuong = strDoiTuong.substring(1);
                    $("#DSDoiTuong").html(strDoiTuong);
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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_PhamVi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strXLDH_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.genTable_SinhVien(dtResult, iPager);
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_KeHoachXuLy_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamVi',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strQLSV_KeHoachXuLy_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_PhamVi',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVien",
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVien()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO1"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
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
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.QLSV_NGUOIHOC_ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVien: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Lop_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tùy chọn thêm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Khoa"><i class="fa fa-plus fa-customer"></i> Thêm từng khóa</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_ChuongTrinh"><i class="fa fa-plus fa-customer"></i> Thêm từng chương trình</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Lop"><i class="fa fa-plus fa-customer"></i> Thêm từng lớp</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien").html("");
        $("#modal_sinhvien").append(html);
        $("#modal_sinhvien").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienMD("SEARCH");
            }
        });
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        edu.extend.getList_HeDaoTao();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMD("SEARCH");
        });
        $('#dropSearchModal_He_SV').on('select2:select', function (e) {
            edu.extend.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });
        $('#dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            edu.extend.getList_LopQuanLy();
        });

        $('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
            me.getList_SinhVienMD();
        });
    },
    getList_SinhVienMD: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoNhieuNganh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_SV'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearchModal_Lop_SV'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.cbGetListModal_SinhVien(dtResult, iPager);
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
    cbGetListModal_SinhVien: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVienMD('SEARCH')",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
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
        };

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
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
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
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
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
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strRowID, strKeHoachXuLy_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_NhanSu',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strKeHoachXuLy_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,

            'type': 'POST',
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'HB_KeHoach_NhanSu/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
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

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_NhanSu',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strXLDH_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
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
            'action': 'HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_NhanSu',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
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
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "' name='" + data[i].NGUOIDUNG_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TAIKHOAN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TENDAYDU) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        edu.system.pickerdate();
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID");
        //3. create html
        var html = "";
        var strRowID = edu.util.uuid().substr(2);
        html += "<tr id='" + strRowID + "' name='" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strRowID + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html); edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_QuanSoTheoLop: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_PhamVi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strXLDH_KeHoach_Id': strHB_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager, strHB_KeHoach_Id);
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
    genTable_QuanSoTheoLop: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_QuanSoTheoLop('" + strHB_KeHoach_Id + "')",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
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
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_LoaiDanhHieu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_NguoiDung_PhanLoai',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiDanhHieu(json);
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
    cbGenCombo_LoaiDanhHieu: function (data) {
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
            renderPlace: ["dropSearch_LoaiDanhHieu", "dropLoaiDanhHieu"],
            type: "",
            title: "Chọn loại danh hiệu",
        }
        edu.system.loadToCombo_data(obj);
    },


    getList_DieuKien: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_TieuChuan_Ad',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strDanhHieu_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': me.strKeHoachXuLy_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DieuKien(dtReRult, data.Pager, strHB_KeHoach_Id);
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
    genTable_DieuKien: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDieuKien",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_QuanSoTheoLop('" + strHB_KeHoach_Id + "')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 1, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "XEPLOAI_TEN"
                },

                {
                    "mRender": function (nRow, aData) {
                        return '<textarea id="inputxau' + aData.ID + '" style="height: 300px" class="form-control inputxau" name="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '">' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '</textarea>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_DieuKien: function (strId, strThanhPhan_GiaTri) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Sua_XLDH_TieuChuan_AD',
            'type': 'POST',
            'strId': strId,
            'strXauDieuKien': edu.util.getValById('inputxau' + strId),
            'strNguoiThucHien_Id': edu.system.userId,

        };
        //default
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
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DieuKien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKien: function (strId, strThanhPhan_GiaTri) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Xoa_XLDH_TieuChuan_AD',
            'type': 'POST',
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
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
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DieuKien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_NhanHocBong: function (strHB_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strXLDH_KeHoach_Id': strHB_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_NhanHocBong(dtReRult, data.Pager, strHB_KeHoach_Id);
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
    genTable_NhanHocBong: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhanHocBong",
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: 1,
                bFilter: true,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
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
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_THAYDOI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}