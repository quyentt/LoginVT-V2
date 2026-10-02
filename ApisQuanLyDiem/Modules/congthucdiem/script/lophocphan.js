/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LopHocPhan() { };
LopHocPhan.prototype = {
    dtLopHocPhan: [],
    strLopHocPhan_Id: '',
    dtSinhVien: [],
    arrSinhVien_Id: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.pageSize_default = 10;
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_ThanhPhanDiem();
        me.getList_HeDaoTao_V2("");
        me.getList_HinhThucHoc();

        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            me.getList_HocPhan();
            me.getList_LopHocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            ////me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            //me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {

            //me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop').on('select2:select', function (e) {

            var x = $(this).val();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $("#dropLopCuoi").on("select2:select", function () {
            me.getList_DangKyHocKQ();
        });

        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            me.getList_LopHocPhan();
        });
        $("#btnSearch").click(function (e) {
            me.getList_LopHocPhan();
        });

        $("#tblLopHocPhan").delegate('.btnDetail', 'click', function (e) {
            $('#myModalPhamVi').modal('show');
            me.getList_PhamVi(this.id);
        });
        $("#tblLopHocPhan").delegate('.btnSinhVien', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this.id);
        });

        $("#tblLopHocPhan").delegate('.btnDonLop', 'click', function (e) {
            me.toggle_edit();
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            var strTenDanhSach = $(this).attr("name");
            me.getList_DangKyHoc(strId);
            me.getList_LopHocPhan(strId);
            //var arrLopDon = [];
            //me.dtLopHocPhan.forEach(e => {
            //    if (e.ID != strId) arrLopDon.push(e);
            //});
            //me.cbGenCombo_LopHocPhan(arrLopDon);
            $(".lblTenDanhSach").html(strTenDanhSach);
        });
        $("[id$=chkSelectAll_LopHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhan" });
        });

        $("[id$=chkSelectAll_PhamVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhamVi" });
        });
        $("[id$=chkSelectAll_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });

        $("#btnSave_LopHocPhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrSinhVien_Id = arrChecked_Id;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhVien(arrChecked_Id[i]);
                }
            });
        });
        $("#btnThietLapLopRieng").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            html += '<div class="radio" id="divMoHinh" style="padding-left: 20px;padding-bottom: 40px">';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_0" type="radio" name="ThietLapLopRieng" value="1">';
            html += '<label for="ThietLapLopRieng_0"> Là lớp riêng</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_1" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapLopRieng_1"> Không phải lớp riêng</label>';
            html += '</div>';
            html += '</div>';
            edu.system.confirm("Chọn thiết lập lớp riêng? <br/>" + html);
            $("#btnYes").click(function (e) {
                var dLopRieng = $('input[name="ThietLapLopRieng"]:checked').val()
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThietLapLopRieng(arrChecked_Id[i], dLopRieng);
                }
            });
        });

        $("#btnSave_CongThucDiem").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_CongThucDiem(arrChecked_Id[i]);
                }
            });
        });

        $("#DSTrangThaiSV").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.getList_MauImport("zonebtnBaoCao_LopHocPhan", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
            addKeyValue("strDaoTao_KhoaDaoTao_Id", edu.util.getValById("dropSearch_KhoaDaoTao"));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValById("dropSearch_ChuongTrinh"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValById("dropSearch_HocPhan"));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValById("dropSearch_HeDaoTao"));
            addKeyValue("strDaoTao_KhoaQuanLy_Id", edu.util.getValById("dropSearch_KhoaQuanLy"));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrTrangThai = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV');
            arrTrangThai.forEach(e => addKeyValue("strTrangThaiNguoiHoc_Id", e));
        });


        $("#btnDeleteLopHocPhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrSinhVien_Id = arrChecked_Id;
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopHocPhan(arrChecked_Id[i]);
                }
            });
        });

        //$("#dLocCongThuc").click(function (e) {
        //    me.genTable_LopHocPhan(me.dtLopHocPhan, me.iPager);
        //});

        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            var strName = "";
            me.getList_HeDaoTao_V2(strName);
            me.getList_KhoaDaoTao_V2(strName);
            me.getList_HocPhan_V2(strName);
        });
        $('.dropHeDaoTao').on('select2:select', function (e) {
            var strName = "";
            var strId = this.id;
            if (strId.indexOf('_') != -1) strName = strId.substring(strId.indexOf('_'));
            console.log(strName);
            me.getList_KhoaDaoTao_V2(strName);
            me.getList_ChuongTrinhDaoTao_V2(strName);
            //////me.getList_LopQuanLy();
            me.getList_HocPhan_V2(strName);
        });
        $('.dropKhoaDaoTao').on('select2:select', function (e) {
            var strName = "";
            var strId = this.id;
            if (strId.indexOf('_') != -1) strName = strId.substring(strId.indexOf('_'));
            console.log(strName);
            me.getList_ChuongTrinhDaoTao_V2(strName);
            //me.getList_LopQuanLy();
            me.getList_HocPhan_V2(strName);
            //me.resetCombobox(this);
        });
        $('.dropChuongTrinh').on('select2:select', function (e) {
            var strName = "";
            var strId = this.id;
            if (strId.indexOf('_') != -1) strName = strId.substring(strId.indexOf('_'));
            //me.getList_LopQuanLy();
            me.getList_HocPhan_V2(strName);
        });
        $("#btnAdd_KeThua").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModalKeThua").modal("show");
        });
        $("#btnSave_KeThua").click(function () {
            //$('#myModalKeThua').modal('hide');
            edu.system.confirm("Bạn có muốn kế thừa không?");
            $("#btnYes").click(function (e) {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.keThua_ChuongTrinh(arrChecked_Id[i]);
                }
            });
        });
        $("#tblLopHocPhan").delegate('.btnMoKhoaSua', 'click', function (e) {
            $('#myModalMoKhoaSua').modal('show');
            me.strLopHocPhan_Id = this.id;
            me.getList_MoKhoaSua(this.id);
        });
        $("#btnSave_MoKhoaSua").click(function (e) {
            var html = '<div style="width: 100%">';
            html += '<div style="width: 40%; float: left">';
            html += '<label style="font-weight: normal"><span class="lang" key="">Lý do</span></label>';
            html += '</div>';
            html += '<div style="width: 60%; float: left">';
            html += '<input id="txtLyMoKhoa" class="form-control" />';
            html += '</div>';
            html += '<div class="clear"></div>';
            html +='</div>';
            edu.system.confirm(html);
            $("#btnYes").click(function (e) {
                me.save_MoKhoaSua(me.strLopHocPhan_Id);
            });
        });
        $("#btnAdd_MoKhoa").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '<div style="width: 100%">';
            html += '<div style="width: 40%; float: left">';
            html += '<label style="font-weight: normal"><span class="lang" key="">Lý do</span></label>';
            html += '</div>';
            html += '<div style="width: 60%; float: left">';
            html += '<input id="txtLyMoKhoa" class="form-control" />';
            html += '</div>';
            html += '<div class="clear"></div>';
            html += '</div>';
            edu.system.confirm(html);
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_MoKhoaSua(arrChecked_Id[i]);
                }
            });
        });
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_LopHocPhan();
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

    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao(dtReRult);
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGian"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
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
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaDaoTao(dtReRult);
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
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(dtReRult);
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
    getList_NamNhapHoc: function () {
        var me = this;
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
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
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
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThanhPhanDiem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThanhPhanDiem/LayDSThanhPhanTKHP',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.cbGenCombo_ThanhPhanDiem(dtResult, iPager);
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
    cbGenCombo_ThanhPhanDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
               
            },
            renderPlace: ["dropLoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
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
        var obj_save = {
            'action': 'DKH_ThongTin_MH/DSA4BRINLjEJLiIRKSAv',
            'func': 'pkg_dangkyhoc_thongtin.LayDSLopHocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'dLocGanTheoCTDT': $('#dLocCTDT').is(":checked") ? 1 : 0,


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strTKB_HinhThucHoc_Id': edu.util.getValById('dropSearch_HinhThucHoc'),
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
                    me["iPager"] = iPager;
                    me.dtLopHocPhan = dtResult;
                    me.genTable_LopHocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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
    genTable_LopHocPhan: function (data, iPager) {
        var me = this;
        if ($('#dLocCongThuc').is(":checked")) {
            data = data.filter(e => e.CONGTHUCAPDUNGTHEOLOPHP  == 0);
        }
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhan()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 8, 4, 5, 6, 7],
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
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + '(' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA) + ')';
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THOIGIANCHITIET);
                        //return '<p>Từ ' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' đến ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p><p>Thứ ' + edu.util.returnEmpty(aData.THUHOC) + ', ' + edu.util.returnEmpty(aData.PHONGHOC) + '</p>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.SOSVDADANGKY) return '<span><a class="btn btn-default btnSinhVien" id="' + aData.ID + '"  title="Số sinh viên đã đăng ký">' + aData.SOSVDADANGKY + '</a></span>';
                        return "";
                    }
                },
                {
                    "mDataProp": "SOLUONGDUKIENHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.CONGTHUCAPDUNGTHEOLOPHP ? 'Đã khai': '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DACODIEMTKHP ? 'Đã có điểm' : '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnMoKhoaSua" id="' + aData.ID + '" title="Chi tiết">Mở khóa</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<textarea type="text" style="min-height: 400px" id="txtXauCongThuc' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.XAUCONGTHUCDIEM) + '" >' + edu.util.returnEmpty(aData.XAUCONGTHUCDIEM) + '</textarea>';
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
            //    strFuntionName: "main_doc.PhanCongLop.getList_QuanSoTheoLop()",
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_QuanSoTheoLop: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
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

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
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

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    save_SinhVien: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'DKH_DangKy/ThucHienDonLopDangKyHoc',
            'type': 'POST',
            'strDaoTao_ChuongTrinh_Id': obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'strDangKy_LopHocPhan_Cu_Ids': obj.DANGKY_LOPHOCPHAN_ID,
            'strDangKy_LopHocPhan_Moi_Ids': edu.util.getValById("dropLopCuoi"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    $("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    $("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKyHoc();
                    me.getList_DangKyHocKQ();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DangKyHoc: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize':1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_DangKyHoc(dtReRult, data.Pager);
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
    genTable_DangKyHoc: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVien",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0,8],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "SOLUONGDUKIENHOC"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_DangKyHocKQ: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKyHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': edu.util.getValById("dropLopCuoi"),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DangKyHocKQ(dtReRult, data.Pager);
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
    genTable_DangKyHocKQ: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVienKQ",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.arrSinhVien_Id.forEach(e => {
            $("#tblSinhVienKQ #" + e).attr("style", "background-color: pink");
        });
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_LopHocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENLOP",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopCuoi"],
            type: "",
            title: "Chọn lớp cuối",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.LopHocPhan.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },

    delete_LopHocPhan: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'DKH_DangKy/ThucHienHuyDangKyHocHocPhan',
            'type': 'POST',
            'strDaoTao_ChuongTrinh_Id': obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoachDangKy_Id': obj.DANGKY_KEHOACHDANGKY_ID,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                    //$("#lblKetQua" + obj.ID).html("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                    //$("#lblKetQua" + obj.ID).html(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DangKyHoc();
                    me.getList_DangKyHocKQ();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    save_ThietLapLopRieng: function (strDaoTao_LopHocPhan_Id, dLopRieng) {
        var me = this;
        var obj_save = {
            'action': 'DKH_PhanCong_LopHP/ThietDatThuocTinhLopRieng',
            'type': 'POST',
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dLopRieng': dLopRieng,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                me.getList_LopHocPhan();
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_DangKyHoc();
                //});
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_CongThucDiem: function (strId) {
        var me = this;
        var objLopHocPhan = me.dtLopHocPhan.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'D_CongThucDiem_ApDung/ThemMoi',


            'strId': '',
            'strPhanCapApDung_Id': '',
            'strPhamViApDung_Id': strId,
            'strDiem_CongThucDiem_Id': "",
            'strXauCongThuc': edu.util.getValById("txtXauCongThuc" + strId),
            'strMa': edu.util.getValById("txtXauCongThuc" + strId),
            'strTen': edu.util.getValById("txtXauCongThuc" + strId),
            'dThuTu': 0,
            'dSoThanhPhanToiThieu': 0,
            'dTongHopKhiDuDiem': 0,
            'strDaoTao_ThoiGianDaoTao_Id': objLopHocPhan.DAOTAO_THOIGIANDAOTAO_ID,
            'strNgayApDung': "",
            'strNguoiThucHien_Id': edu.system.userId,
            
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropLoaiDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        edu.system.alert("Thêm mới thành công")
                    } else {
                        edu.system.alert("Cập nhật thành công")
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhan();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


   
    getList_HeDaoTao_V2: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_HeDaoTao/LayDanhSach',


            'strDAOTAO_HinhThucDaoTao_Id': "",
            'strDaoTao_BacDaoTao_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_HeDaoTao_V2(dtReRult, strId);
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
    getList_KhoaDaoTao_V2: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao' + strId),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian' + strId),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaDaoTao_V2(dtReRult, strId);
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
    getList_ChuongTrinhDaoTao_V2: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian' + strId),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao' + strId),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao' + strId),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy' + strId),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao_V2(dtReRult, strId);
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
    getList_LopQuanLy_V2: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian' + strId),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao' + strId),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao' + strId),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy' + strId),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao_V2(dtReRult);
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
    getList_NamNhapHoc_V2: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc_V2(json);
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
    getList_KhoaQuanLy_V2: function (strId) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_KhoaQuanLy/LayDanhSach',

            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KhoaQuanLy_V2(dtReRult, strId);
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
    getList_HocPhan_V2: function (strId) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian' + strId),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao' + strId),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao' + strId),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh' + strId),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy' + strId),
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
                    me.cbGenCombo_HocPhan_V2(dtResult, strId);
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao_V2: function (data, strId) {
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
            renderPlace: ["dropHeDaoTao" + strId],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao_V2: function (data, strId) {
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
            renderPlace: ["dropKhoaDaoTao" + strId],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao_V2: function (data, strId) {
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
            renderPlace: ["dropChuongTrinh" + strId],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy_V2: function (data, strId) {
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
            renderPlace: ["dropLop" + strId],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV_V2: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc_V2: function (data, strId) {
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
            renderPlace: ["dropNamHoc" + strId],
            type: "",
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaQuanLy_V2: function (data, strId) {
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
            renderPlace: ["dropKhoaQuanLy" + strId],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_HocPhan_V2: function (data, strId) {
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
            renderPlace: ["dropHocPhan" + strId],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    keThua_ChuongTrinh: function (strDaoTao_LopHocPhan_Goc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin/KeThucCongThucDiemTheoLopHP',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Goc_Id': strDaoTao_LopHocPhan_Goc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công", "w");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_HocPhan_ChuongTrinh();
                    //me.getList_KhoiBatBuoc();
                    //me.getList_KhoiTuChonDon();
                    //me.getList_QuanHeHocPhan();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    save_MoKhoaSua: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin2_MH/FSkkLB4FKCQsHgIVBR4MLgIpIC8SNCAP',
            'func': 'pkg_diem_thongtin2.Them_Diem_CTD_MoChanSua',
            'iM': edu.system.iM,
            'strPhamViApDung_Id': strId,
            'strLyDo': edu.system.getValById('txtLyMoKhoa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
                }
                me.getList_MoKhoaSua();
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_MoKhoaSua();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_MoKhoaSua: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin2_MH/DSA4BRIFKCQsHgIVBR4MLgIpIC8SNCAP',
            'func': 'pkg_diem_thongtin2.LayDSDiem_CTD_MoChanSua',
            'iM': edu.system.iM,
            'strPhamViApDung_Id': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtMoKhoaSua"] = dtReRult;
                    me.genTable_MoKhoaSua(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_MoKhoaSua: function (data, iPager) {
        $("#lblSoTinKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblMoKhoaSua",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.SoTinKeHoach.getList_SoTinKeHoach()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "NGAY_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "LYDOMOCHANSUA",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtLyDo_' + aData.ID + '" class="form-control inputxau" value="' + edu.util.returnEmpty(aData.SOQUYDINH) + '" name="' + edu.util.returnEmpty(aData.SOQUYDINH) + '"/>';
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
        /*III. Callback*/
    },


    getList_HinhThucHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP',
            'func': 'pkg_dangkyhoc_chung.LayDSHinhThucHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HinhThucHoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HinhThucHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAHINHTHUCHOC",
                code: "MA",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TENHINHTHUCHOC) + " - " + edu.util.returnEmpty(aData.MAHINHTHUCHOC)
                }
            },
            renderPlace: ["dropSearch_HinhThucHoc"],
            title: "Chọn hình thức học"
        };
        edu.system.loadToCombo_data(obj);
    },
}