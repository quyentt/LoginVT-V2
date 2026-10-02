/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhanCongPhamVi() { };
PhanCongPhamVi.prototype = { 
    dtPhanCongPhamVi: [], 
    dtPhanCap: [],
    oQuanSo: {},
    strPhanCongPhamVi_Id: '',
    arrPhamVi: [],
    dtPhamVi: [],
    dtSinhVien: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.PHANCAP", "", "", function (data) {
            me.dtPhanCap = data;
            me.getList_PhanCongPhamVi();
        });
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachDangKy();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KhoaQuanLy();
        me.getList_HocPhan();

        $("#btnSearch").click(function (e) {
            me.getList_PhanCongPhamVi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_PhanCongPhamVi();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            if (edu.util.getValById('dropSearch_KeHoach') == "") {
                edu.system.alert("Bạn cần chọn kế hoạch trước!");
                return;
            }
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_PhanCongPhamVi").click(function (e) {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (me.arrPhamVi.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn lưu " + (me.arrPhamVi.length) + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", (me.arrPhamVi.length));
                for (var j = 0; j < me.arrPhamVi.length; j++) {
                    me.save_PhanCongPhamVi(me.arrPhamVi[j].id);
                }
            });
        });
        $("[id$=chkSelectAll_PhanCongPhamVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhanCongPhamVi" });
        });
        $("#btnXoaPhanCongPhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("zonePhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanCongPhamVi(arrChecked_Id[i]);
                }
            });
        });
        $("#tblPhanCongPhamVi").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblPhanCongPhamVi");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtPhanCongPhamVi, "ID")[0];
                me.viewEdit_PhanCongPhamVi(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_PhanCongPhamVi();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $("#zonePhanCong").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            var strId = this.id;
            me.oQuanSo = {
                id: this.id,
                name: this.name
            };
            var dataX = me.dtPhanCongPhamVi.find(e => e.PHAMVIAPDUNG_ID === strId);
            if (dataX != undefined) {
                me.viewForm_PhanCongPhamVi(dataX);
            } else me.viewForm_PhanCongPhamVi([]);
            me.strPhanCongPhamVi_Id = this.id;
            me.getList_QuanSoTheoLop();
        });
        $("#btnSave_QuanSo").click(function () {
            $("#myModal").modal("hide");
            me.save_PhanCongPhamVi(me.strPhanCongPhamVi_Id);
        });
        $("#zonePhanCong").delegate('.checkAllTable', 'click', function (e) {
            var strTable_Id = this.id.replace("chkSelectAll_", "tblPhanCong");
            edu.util.checkedAll_BgRow(this, { table_id: strTable_Id });
        });
        $("[id$=chkSelectAll_QuanSo]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanSoLop" });
        });
        $("#btnDelete_LopHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanSoLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            $("#myModal").modal("hide");
            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuanSoTheoLop(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $("#zoneEdit").delegate('.addPhamVi', 'click', function (e) {
            var strDropId = this.id.replace("add", "drop");
            var val = $("#" + strDropId).val();
            if (val !== "" && me.arrPhamVi.find(e => e.id === val) === undefined) {
                me.arrPhamVi.push({ id: $("#" + strDropId).val(), name: $("#" + strDropId + " option:selected").text() });
                var strPhamVi = "";
                me.arrPhamVi.forEach(ele => strPhamVi += " ," + ele.name);
                if (strPhamVi != "") strPhamVi = strPhamVi.substr(2);
                $("#lblPhamVi").html(strPhamVi);
            }
        });

        $("#addKhoaQuanKyKhoaHoc").click(function () {
            var valKQL = $("#dropKhoaQuanLy").val();
            var valKDT = $("#dropKhoaDaoTao").val();

            if (valKQL !== "" && valKDT != "") {
                me.arrPhamVi.push({ id: valKQL + valKDT, name: $("#dropKhoaQuanLy option:selected").text() + " - " + $("#dropKhoaDaoTao option:selected").text() });
                var strPhamVi = "";
                me.arrPhamVi.forEach(ele => strPhamVi += " ," + ele.name);
                if (strPhamVi != "") strPhamVi = strPhamVi.substr(2);
                $("#lblPhamVi").html(strPhamVi);
            }
        });

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $("#tblLopHocPhan").delegate('.btnDetail', 'click', function (e) {
            $('#myModalPhamVi').modal('show');
            me.getList_PhamVi(this.id);
        });
        $("[id$=chkSelectAll_LopHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhan" });
        });

        $("[id$=chkSelectAll_PhamVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhamVi" });
        });
        $("#btnDelete_PhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhamVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhamVi(arrChecked_Id[i]);
                }
            });
        });
        //
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


        $('#dropThoiGianDaoTao').on('select2:select', function (e) {
            me.getList_HocPhan();
            me.getList_LopHocPhan();
        });
        $('#dropHocPhan').on('select2:select', function (e) {
            me.getList_LopHocPhan();
        });


        $("#btnTinhToan").click(function () {
            if (edu.util.getValById('dropSearch_KeHoach') == "") {
                edu.system.alert("Bạn cần chọn kế hoạch trước!");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("zonePhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bắt đầu tính toán dữ liệu cho " + arrChecked_Id.length + " phạm vi đã chọn?");
            $("#btnYes").off("click").on("click", function (e) {
                $("#alert_content").html("");
                $("#btnYes").hide();
                me.dtSinhVien = [];
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.startHideOverlay();
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.getList_DSSinhVien(arrChecked_Id[i]);
                }
            });
        });

        $("#btnTaoLichTuan").click(function () {
            if (edu.util.getValById('dropSearch_KeHoach') == "") {
                edu.system.alert("Bạn cần chọn kế hoạch trước!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn tạo dữ liệu thời khóa biểu theo lớp học phần?");
            $("#btnYes").off("click").on("click", function (e) {
                $("#alert_content").html("");
                $("#btnYes").hide();
                $('#alert>#myModalAlert').modal('hide');
                me.save_TaoLichTuan();
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        me.strPhanCongPhamVi_Id = "";
        me.arrPhamVi = [];
        $("#lblPhamVi").html("");
        edu.util.viewValById("dropKhoaQuanLy", "");
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLop", "");
        edu.util.viewValById("dropHocVien", "");
        //
        edu.util.viewValById("txtSoTinToiThieu", "");
        edu.util.viewValById("txtNgayBDRutHP", "");
        edu.util.viewValById("txtSoTinToiDa", "");
        edu.util.viewValById("txtNgayKetThuc_Phut", "");
        edu.util.viewValById("txtNgayKetThuc_Gio", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("txtNgayBatDau_Phut", "");
        edu.util.viewValById("txtNgayBatDau_Gio", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtSiSoToiDa", "");
        edu.util.viewValById("txtSiSoToiThieu", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_PhanCongPhamVi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_PhamVi/LayDanhSach',
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhanCongPhamVi = dtReRult;
                    me.genTable_PhanCongPhamVi(dtReRult, data.Pager);
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
    save_PhanCongPhamVi: function (strPhamViApDung_Id, strDangKy_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin/Them_DangKy_PhanCong_PhamVi',

            'strId': me.strPhanCongPhamVi_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc'),
            'dSoTinChiToiDa': edu.util.getValById('txtSoTinToiDa'),
            'dSoTinChiToiThieu': edu.util.getValById('txtSoTinToiThieu'),
            'dSoTinChiToiDaN2': edu.util.getValById('txtSoTinToiDaN2'),
            'dSoTinChiToiThieuN2': edu.util.getValById('txtSoTinToiThieuN2'),
            'strNgayBatDauTinhRutHocPhan': edu.util.getValById('txtNgayBDRutHP'),
            'dGioDangKyTrongNgayDau': edu.util.getValById('txtNgayBatDau_Gio'),
            'dGioKetThucTrongNgayCuoi': edu.util.getValById('txtNgayKetThuc_Gio'),
            'dPhutDangKyTrongNgayDau': edu.util.getValById('txtNgayBatDau_Phut'),
            'dPhutKetThucTrongNgayCuoi': edu.util.getValById('txtNgayKetThuc_Phut'),
            'dSiSoToiDa': edu.util.getValById('txtSiSoToiDa'),
            'dSiSoToiThieu': edu.util.getValById('txtSiSoToiThieu'),
        };
        if (obj_save.strId != "") {
            temp = me.dtPhanCongPhamVi.find(ele => ele.PHAMVIAPDUNG_ID === me.strPhanCongPhamVi_Id);
            obj_save = {
                'action': 'DKH_ThongTin/Sua_DangKy_PhanCong_PhamVi',

                'strId': temp.ID,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strDangKy_KeHoachDangKy_Id': temp.DANGKY_KEHOACHDANGKY_ID,
                'strPhamViApDung_Id': me.strPhanCongPhamVi_Id,
                'strNguoiThucHien_Id': edu.system.userId,
                'strNgayBatDau': edu.util.getValById('txtNgayBatDau_Edit'),
                'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc_Edit'),
                'dSoTinChiToiDa': edu.util.getValById('txtSoTinToiDa_Edit'),
                'dSoTinChiToiThieu': edu.util.getValById('txtSoTinToiThieu_Edit'),
                'dSoTinChiToiDaN2': edu.util.getValById('txtSoTinToiDa_EditN2'),
                'dSoTinChiToiThieuN2': edu.util.getValById('txtSoTinToiThieu_EditN2'),
                'strNgayBatDauTinhRutHocPhan': edu.util.getValById('txtNgayBDRutHP'),
                'dGioDangKyTrongNgayDau': edu.util.getValById('txtNgayBatDau_Gio_Edit'),
                'dGioKetThucTrongNgayCuoi': edu.util.getValById('txtNgayKetThuc_Gio_Edit'),
                'dPhutDangKyTrongNgayDau': edu.util.getValById('txtNgayBatDau_Phut_Edit'),
                'dPhutKetThucTrongNgayCuoi': edu.util.getValById('txtNgayKetThuc_Phut_Edit'),
                'dSiSoToiDa': edu.util.getValById('txtSiSoToiDa_Edit'),
                'dSiSoToiThieu': edu.util.getValById('txtSiSoToiThieu_Edit'),
            };
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strPhanCongPhamVi_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strPhanCongPhamVi_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strPhanCongPhamVi_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_PhanCongPhamVi();
            },
            error: function (er) {
                edu.system.alert("XLHV_PhanCongPhamVi/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCongPhamVi();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanCongPhamVi: function (strId) {
        var me = this;
        //var temp = me.dtPhanCongPhamVi.find(ele => ele.PHAMVIAPDUNG_ID === strId);
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_PhanCong_PhamVi/Xoa',

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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCongPhamVi();
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
    genTable_PhanCongPhamVi: function (data, iPager) {
        var me = this;
        $("#zonePhanCong").html("");
        me.dtPhanCap.forEach(ele => {
            console.log(ele.ID);
            var tempData = data.filter(element => element.PHANCAPAPDUNG_ID === ele.ID);
            console.log(tempData);
            if (tempData != undefined && tempData.length > 0) {
                var rowHead = '<table id="tblPhanCong' + ele.ID + '" class="table table-hover table-bordered" style="width: 300px; float: left">';
                rowHead += '<thead>';
                rowHead += '<tr>';
                rowHead += '<th class="td-center td-fixed">';
                rowHead += '<input type="checkbox" id="chkSelectAll_' + ele.ID + '" class="checkAllTable">';
                rowHead += '</th>';
                rowHead += '<th class="td-center">' + edu.util.returnEmpty(ele.TEN) + '</th>';
                rowHead += '<th class="td-center" style="width: 93px">Số lượng</th>';
                rowHead += '</tr>';
                rowHead += '</thead>';
                rowHead += '<tbody>';
                rowHead += '</tbody>';
                rowHead += '</table>';
                console.log(rowHead);
                $("#zonePhanCong").append(rowHead);

                var jsonForm = {
                    strTable_Id: "tblPhanCong" + ele.ID,

                    aaData: tempData,
                    colPos: {
                        center: [1, 3],
                    },
                    bHiddenOrder: true,
                    aoColumns: [
                        {
                            "mRender": function (nRow, aData) {
                                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                            }
                        },
                        {
                            "mData": "PHAMVIAPDUNG_TEN",
                            "mRender": function (nRow, aData) {
                                return '<span><a class="btn btn-default btnDetail" id="' + aData.PHAMVIAPDUNG_ID + '" name="' + ele.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.PHAMVIAPDUNG_TEN) + '</a></span>';
                            }
                        },
                        {
                            "mDataProp": "SOLUONG"
                        }
                    ]
                };
                edu.system.loadToTable_data(jsonForm);
            }
        });

    },
    viewForm_PhanCongPhamVi: function (data) {
        //view data --Edit
        edu.util.viewValById("txtSoTinToiThieu_Edit", data.SOTINCHITOITHIEU);
        edu.util.viewValById("txtSoTinToiDa_Edit", data.SOTINCHITOIDA);
        edu.util.viewValById("txtSoTinToiThieu_EditN2", data.SOTINCHITOITHIEUN2);
        edu.util.viewValById("txtNgayBDRutHP", data.NGAYBATDAUTINHRUTHOCPHAN);
        edu.util.viewValById("txtSoTinToiDa_EditN2", data.SOTINCHITOIDAN2);
        edu.util.viewValById("txtNgayKetThuc_Phut_Edit", data.PHUTKETTHUCTRONGNGAYCUOI);
        edu.util.viewValById("txtNgayKetThuc_Gio_Edit", data.GIOKETTHUCTRONGNGAYCUOI);
        edu.util.viewValById("txtNgayKetThuc_Edit", data.NGAYKETTHUC);
        edu.util.viewValById("txtNgayBatDau_Phut_Edit", data.PHUTDANGKYTRONGNGAYDAU);
        edu.util.viewValById("txtNgayBatDau_Gio_Edit", data.GIODANGKYTRONGNGAYDAU);
        edu.util.viewValById("txtNgayBatDau_Edit", data.NGAYBATDAU);
        edu.util.viewValById("txtSiSoToiDa_Edit", data.SISOTOIDA);
        edu.util.viewValById("txtSiSoToiThieu_Edit", data.SISOTOITHIEU);
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
            strHeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropChuongTrinh"),
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
            title: "Chọn hệ đào tạo",
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
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
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình đào tạo",
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
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.PhanCongPhamVi;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },

    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.PhanCongPhamVi.dtTrangThai = data;
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
            title: "Chọn năm nhập học",
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
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    cbGenCombo_HocVien: function (data) {
        //var me = main_doc.DangKyDeCuong;
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
                //default_val: me.strHocVien_Id
            },
            renderPlace: ["dropHocVien"],
            type: "",
            title: "Chọn người học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_QuanSoTheoLop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_PhamVi/LayDSNguoiHoc_PhanCong_PhamVi',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strPhanCapApDung_Id': me.oQuanSo.name,
            'strPhamViApDung_Id': me.oQuanSo.id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager);
                    
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
    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.PhanCongPhamVi.getList_QuanSoTheoLop()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mData": "DANGKY_LOPHOCPHAN_MA",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "MASO"
                }
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                //    }
                //}
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    delete_QuanSoTheoLop: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_PhanCong_LopHP/Xoa',
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCongPhamVi();
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
    getList_KeHoachDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKeHoachDangKy = dtResult;
                    me.cbGenCombo_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGenCombo_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropHocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSLopHocPhan',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_LopHocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LopHocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.PhanCongPhamVi.getList_LopHocPhan()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" name="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_PhamVi: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhamVi = dtReRult;
                    me.genTable_PhamVi(dtReRult, data.Pager);
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
    genTable_PhamVi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhamVi",

            //bPaginate: {
            //    strFuntionName: "main_doc.PhanCongPhamVi.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "PHANCAPAPDUNG_TEN"
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
    delete_PhamVi: function (strId) {
        var me = this;
        //--Edit
        var temp = me.dtPhamVi.find(ele => ele.ID === strId);
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_PhanCong_LopHP/Xoa_DangKy_PhanCong_LopHP',

            'strDangKy_KeHoachDangKy_Id': '',
            'strPhamViApDung_Id': temp.PHAMVIAPDUNG_ID,
            'strDangKy_LopHocPhan_Id': temp.DANGKY_LOPHOCPHAN_ID,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamVi();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_DSSinhVien: function (strId) {
        var me = this;
        var aData = me.dtPhanCongPhamVi.find(e => e.ID == strId);
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_PhamVi/LayDSNguoiHoc_PhanCong_PhamVi',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strPhanCapApDung_Id': aData.PHANCAPAPDUNG_ID,
            'strPhamViApDung_Id': aData.PHAMVIAPDUNG_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = me.dtSinhVien.concat(dtReRult);
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.stopHideOverlay();
                    var seen = {};
                    me.dtSinhVien = me.dtSinhVien.filter(function (sv) {
                        var key = sv.QLSV_NGUOIHOC_ID;
                        if (!key || seen[key]) return false;
                        seen[key] = true;
                        return true;
                    });
                    $("#alert_content").html("");
                    if (me.dtSinhVien.length == 0) {
                        edu.system.alert("Không có sinh viên nào trong phạm vi đã chọn!");
                        return;
                    }
                    edu.system.confirm("Bắt đầu tính toán dữ liệu cho " + me.dtSinhVien.length + " sinh viên?");
                    $("#btnYes").show();
                    $("#btnYes").off("click").on("click", function (e) {
                        $("#alert_content").html("");
                        $("#btnYes").hide();
                        edu.system.alert('<div id="zoneprocessXXXX1"></div>');
                        edu.system.genHTML_Progress("zoneprocessXXXX1", me.dtSinhVien.length);
                        me.startHideOverlay();
                        for (var i = 0; i < me.dtSinhVien.length; i++) {
                            me.save_TinhToan(me.dtSinhVien[i].QLSV_NGUOIHOC_ID);
                        }
                    });
                });
            },
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_TinhToan: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_DKH_Chung5_MH/FSAuBTQNKCQ0CS4iESkgLxUgLAPP',
            'func': 'PKG_DANGKYHOC_CHUNG5.TaoDuLieuTamTheoNguoiHoc',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    console.log("TaoDuLieuTamTheoNguoiHoc lỗi (" + strQLSV_NguoiHoc_Id + "): " + data.Message);
                }
            },
            error: function (er) {
                console.log("TaoDuLieuTamTheoNguoiHoc (er): " + JSON.stringify(er));
            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX1", function () {
                    me.stopHideOverlay();
                    $("#alert_content").html("");
                    $('#alert>#myModalAlert').modal('hide');
                    setTimeout(function () {
                        edu.system.alert("Đã thực hiện xong!");
                    }, 300);
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_TaoLichTuan: function () {
        var me = this;
        var obj_save = {
            'action': 'TS_DKH_Chung5_MH/FSAuBTQNKCQ0DSgiKRU0IC8VICwP',
            'func': 'PKG_DANGKYHOC_CHUNG5.TaoDuLieuLichTuanTam',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đã thực hiện xong!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("TaoDuLieuLichTuanTam (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    startHideOverlay: function () {
        var me = this;
        me.stopHideOverlay();
        me._overlayHideInterval = setInterval(function () {
            $("#overlay").hide();
        }, 50);
    },
    stopHideOverlay: function () {
        var me = this;
        if (me._overlayHideInterval) {
            clearInterval(me._overlayHideInterval);
            me._overlayHideInterval = null;
        }
    },
}