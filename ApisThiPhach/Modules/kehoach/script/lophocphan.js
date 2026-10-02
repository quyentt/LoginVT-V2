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
        me.getList_HinhThucHoc();
        console.log(123342342342342342);

        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HeDaoTao();
            //me.getList_KhoaToChuc();
            me.getList_HocPhan();
            //me.getList_LopHocPhan();
            me.getList_KeHoach();
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
            //me.getList_LopHocPhan();
        });
        $("#btnSearch").click(function (e) {
            me.getList_LopHocPhan();
        });
        $("#btnSearchChiTiet").click(function (e) {
            me.getList_LopHocPhanChiTiet();
        });

        $("#btnSearchCanBoDangKy").click(function (e) {
            me.getList_CanBoChiTiet();
        });
        $("#btnSearchChiTietRut").click(function (e) {
            me.getList_LopHocPhanRut();
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
            var strHocPhan_Id = me.dtLopHocPhan.find(e => e.ID == strId).DAOTAO_HOCPHAN_ID
            var strTenDanhSach = $(this).attr("name");
            me.getList_DangKyHoc(strId);
            me.getList_LopHocPhan(strId);
            me.cbGenCombo_LopHocPhan(me.dtLopHocPhan.filter(e => e.ID != strId && e.DAOTAO_HOCPHAN_ID == strHocPhan_Id));
            $(".lblTenDanhSach").html(strTenDanhSach);
        });

        $("#tblLopHocPhan").delegate('.btnDonNhomLop', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zoneEditNhom");
            var strId = this.id;
            me.strLopHocPhan_Id = strId;
            //var strHocPhan_Id = me.dtLopHocPhan.find(e => e.ID == strId).DAOTAO_HOCPHAN_ID
            var strTenDanhSach = $(this).attr("name");
            me.getList_DangKyHoc(strId);
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
            html += '<input id="ThietLapLopRieng_1" type="radio" name="ThietLapLopRieng" value="1">';
            html += '<label for="ThietLapLopRieng_1"> Là lớp riêng</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_0" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapLopRieng_0"> Không phải lớp riêng</label>';
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
        $("#btnThietLapKhongTinhPhi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            html += '<div class="radio" id="divMoHinh" style="padding-left: 20px;padding-bottom: 40px">';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapKhongTinhPhi_0" type="radio" name="ThietLapKhongTinhPhi" value="1">';
            html += '<label for="ThietLapKhongTinhPhi_0"> Lớp không tính phí</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapLopRieng_1" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapLopRieng_1"> Lớp tính phí</label>';
            html += '</div>';
            html += '</div>';
            edu.system.confirm("Chọn Thiết đặt lớp không tín phí? <br/>" + html);
            $("#btnYes").click(function (e) {
                var dLopRieng = $('input[name="ThietLapLopRieng"]:checked').val()
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThietLapKhongTinhPhi(arrChecked_Id[i], dLopRieng);
                }
            });
        });
        $("#btnThietLapKhongToChucThi").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var html = '';
            html += '<div class="radio" id="divMoHinh" style="padding-left: 20px;padding-bottom: 40px">';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapKhongToChucThi_1" type="radio" name="ThietLapLopRieng" value="1">';
            html += '<label for="ThietLapKhongToChucThi_1"> Lớp không tổ chức thi</label>';
            html += '</div>';
            html += '<div class="col-sm-12">';
            html += '<input id="ThietLapKhongToChucThi_0" type="radio" name="ThietLapLopRieng" value="0">';
            html += '<label for="ThietLapKhongToChucThi_0"> Lớp tổ chức thi</label>';
            html += '</div>';
            html += '</div>';
            edu.system.confirm("Thiết đặt lớp không tổ chức thi? <br/>" + html);
            $("#btnYes").click(function (e) {
                var dLopRieng = $('input[name="ThietLapLopRieng"]:checked').val()
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThietLapKhongToChucThi(arrChecked_Id[i], dLopRieng);
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
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropSearch_KieuHoc");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.XACNHAN.KETQUA", "dropSearch_HanhDong");
        edu.system.getList_MauImport("zonebtnBaoCao_LopHocPhan", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
            addKeyValue("strDaoTao_KhoaDaoTao_Id", edu.util.getValById("dropSearch_KhoaDaoTao"));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValById("dropSearch_ChuongTrinh"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValById("dropSearch_HocPhan"));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValById("dropSearch_HeDaoTao"));
            addKeyValue("strDaoTao_KhoaQuanLy_Id", edu.util.getValById("dropSearch_KhoaQuanLy"));
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strTKB_HinhThucHoc_Id", edu.util.getValById("dropSearch_HinhThucHoc"));
            addKeyValue("strKieuHoc_Id", edu.util.getValById("dropSearch_KieuHoc"));
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch"));
            addKeyValue("dChiLayCacLopChuaPhanCong", $('#dChuaPhanCong').is(":checked") ? 1 : 0);
            addKeyValue("dSoDaDangTuSo", edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1);
            addKeyValue("dSoDaDangDenSo", edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strDangKy_LopHocPhan_Id", arrChecked_Id[i]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanChiTiet2", "checkX");
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
        $("#btnDeleteLopHocPhanDangChon").click(function (e) {
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
                    me.delete_LopHocPhanDangChon(arrChecked_Id[i]);
                }
            });

        });

        $("#btnThucHienDonNhom").click(function (e) {
            e.preventDefault();
            console.log(11111);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVienNhom", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }

            console.log(arrChecked_Id);
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            var strNguonDuLieu_Id = edu.util.uuid();
            me["strNguonDuLieu_Id"] = strNguonDuLieu_Id;
            arrChecked_Id.forEach(e => me.save_DonLopNhom(e, strNguonDuLieu_Id));
        });
        $("#btnChonLopNhom").click(function (e) {
            me.dtDonNhomLop.rsLopBanDau.forEach(e => me.getList_DonLopNhom_LopMoi(e));
        });
        $("#btnDSSinhVienNhom").click(function (e) {
            $('#myModalNhom').modal('show');
            me.getList_DonLopNhom_SV();
        });
        $("#btnSave_DonLopNhom").click(function (e) {
            var arrChecked_Id = [];
            var strLopCu_Id = [];
            var strLopMoi_Id = [];
            var check = true;
            me.dtDonNhomLop.rsLopBanDau.forEach(e => {
                var temp = edu.util.getValById("dropLopMoi" + e.ID);
                if (!temp) {
                    check = false;
                    return;
                } else {
                    strLopCu_Id.push(e.ID);
                    strLopMoi_Id.push(temp);
                }
            })
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            if (check) {
                edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.save_DonLopNhom_DuLieu(strLopCu_Id.toString(), strLopMoi_Id.toString());
                });
            }
            
        });
        $("#btnTaoDSNhapDiem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            arrChecked_Id.forEach(e => me.saveTaoDanhSachNhapDiem(e));

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
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
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
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex':1,
            'pageSize': 10000,
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
                avatar: "",
                //mRender: function (nRow, aData) {
                //    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                //}
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
    getList_LopHocPhan: function () {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhan").parent().show();

        //--Edit
        var obj_save = {
            'action': 'DKH_BaoCao_MH/DSA4BRINLjEJLiIRKSAvESkgLxUzIC8m',
            'func': 'pkg_dangkyhoc_baocao.LayDSLopHocPhanPhanTrang',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropSearch_HinhThucHoc'),


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')): -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,
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
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhan()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
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
                        return edu.util.returnEmpty(aData.THOIGIANCHITIET);
                        //return '<p>Từ ' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' đến ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p><p>Thứ ' + edu.util.returnEmpty(aData.THUHOC) + ', ' + edu.util.returnEmpty(aData.PHONGHOC) + '</p>';
                    }
                },
                {
                    "mDataProp": "HINHTHUCHOC_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HINHTHUCHOC_TEN) + ' - ' + edu.util.returnEmpty(aData.HINHTHUCHOC_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
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
                        return aData.HOCPHITINHRIENG ? 'Lớp riêng': '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KHONGTINHPHI ? 'Không tính phí' : '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KHONGTOCHUCTHI ? 'Không tổ chức thi' : '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDonLop" id="' + aData.ID + '" name="' + aData.TENLOP  +'" title="Dồn lớp">Dồn lớp</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDonNhomLop" id="' + aData.ID + '" name="' + aData.TENLOP + '" title="Dồn">Dồn nhóm</a></span>';
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
    getList_LopHocPhanChiTiet: function () {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhanChiTiet").parent().show();
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP',
            'func': 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropSearch_HinhThucHoc'),
            'strHanhDong_XacNhan_Id': edu.system.getValById('dropSearch_HanhDong'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,
            
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
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
                    me.genTable_LopHocPhanChiTiet(dtResult, iPager);
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

    getList_CanBoChiTiet: function () {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhanChiTiet").parent().show();
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIFLgIgLwMu',
            'func': 'PKG_DANGKYHOC_THONGTIN2.LayDSDangKyHocDoCanBo',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropSearch_HinhThucHoc'),


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,

            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
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
                    me.genTable_LopHocPhanChiTiet(dtResult, iPager);
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
    genTable_LopHocPhanChiTiet: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhanChiTiet",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhanChiTiet()",
                iDataRow: iPager
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
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + ' (' + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA) + ')';
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "LOPRIENG"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + ' (' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + ')';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HINHTHUCHOC_TEN) + ' - ' + edu.util.returnEmpty(aData.HINHTHUCHOC_MA);
                    }
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_TEN) + ' (' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_MA) + ')';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DACHUYENKETOAN ? "Đã chuyển": 0 ;
                    }
                },

                {
                    "mDataProp": "HANHDONG_XACNHAN_TEN"
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
    getList_LopHocPhanRut: function () {
        var me = this;
        $(".tblHidden").hide();
        $("#tblLopHocPhanChiTiet2").parent().show();
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/DSA4BRITNDUFIC8mCjgJLiIP',
            'func': 'pkg_dangkyhoc_thongtin2.LayDSRutDangKyHoc',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,


            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'dSoDaDangTuSo': edu.util.getValById('txtSearch_TuSo') ? parseInt(edu.util.getValById('txtSearch_TuSo')) : -1,
            'dSoDaDangDenSo': edu.util.getValById('txtSearch_DenSo') ? parseInt(edu.util.getValById('txtSearch_DenSo')) : -1,

            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
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
                    me.genTable_LopHocPhanRut(dtResult, iPager);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genTable_LopHocPhanRut: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhanChiTiet2",
            bPaginate: {
                strFuntionName: "main_doc.LopHocPhan.getList_LopHocPhanRut()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [

                {
                    "mDataProp": "NGUOIRUT_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYRUT_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "PHANTRAMPHITINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + ' (' + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA) + ')';
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "LOPRIENG"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + ' (' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + ')';
                    }
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_TEN) + ' (' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINHDK_MA) + ')';
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

        var jsonForm = {
            strTable_Id: "tblSinhVienNhom",

            //bPaginate: {
            //    strFuntionName: "main_doc.LopHocPhan.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
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
    delete_LopHocPhanDangChon: function (strId) {
        var me = this;
        var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'DKH_TrucTiep_MH/FSk0IgkoJC8JNDgFIC8mCjgJLiINLjECKS4v',
            'func': 'pkg_dangkyhoc_tructiep.ThucHienHuyDangKyHocLopChon',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': obj.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strDaoTao_HocPhan_Id': obj.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoachDangKy_Id': obj.DANGKY_KEHOACHDANGKY_ID,
            'strDangKy_LopHocPhan_Chon_Id': me.strLopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                //me.getList_DangKyHoc();
                //me.getList_DangKyHocKQ();
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
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

    save_ThietLapKhongTinhPhi: function (strDaoTao_LopHocPhan_Id, dKhongTinhPhi) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/FSkoJDUFIDUKKS4vJhUoLykRKSgP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.ThietDatKhongTinhPhi',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dKhongTinhPhi': dKhongTinhPhi,
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

    save_ThietLapKhongToChucThi: function (strDaoTao_LopHocPhan_Id, dKhongToChucThi) {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin2_MH/FSkoJDUFIDUKKS4vJhUuAik0IhUpKAPP',
            'func': 'PKG_DANGKYHOC_THONGTIN2.ThietDatKhongToChucThi',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dKhongToChucThi': dKhongToChucThi,
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
    
    save_DonLopNhom: function (strId, strNguonDuLieu_Id) {
        var me = this;
        var aData = me.dtSinhVien.find(e => e.ID == strId)
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/Them_DangKy_DonLop_LichSu',
            'type': 'POST',
            'strDangKy_LopHocPhan_Id': aData.DANGKY_LOPHOCPHAN_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguonDuLieu_Id': strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DonLopNhom(strNguonDuLieu_Id);
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DonLopNhom: function (strNguonDuLieu_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/LayThongTinChuanBiDonLop',
            'type': 'POST',
            'strNguonDuLieu_Id': strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDonNhomLop"] = dtReRult;
                    me.genTable_DonNhomLop(dtReRult.rsLopBanDau, data.Pager);
                    me.genCombo_DonNhomLop(dtReRult.rsLopMoi);
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
    genTable_DonNhomLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThongTinDonLop",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "HINHTHUC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropLopMoi' + aData.ID + '" class="select-opt" style="width:100% !important"></select>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        $(".select-opt").select2();
        /*III. Callback*/
    },
    genCombo_DonNhomLop: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENLOP",
            },
            renderPlace: ["dropLopCuoiNhom"],
            title: "Chọn lớp"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DonLopNhom_LopMoi: function (aData) {
        var me = this;
        var strId = edu.util.getValById("dropLopCuoiNhom")
        //var aData = me.dtDonNhomLop.rsLopMoi.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/LayDSLopMoiTheo',
            'type': 'POST',
            'strDangKy_LopHocPhan_Moi_Id': strId,
            'strIdHinhThucHoc': aData.IDHINHTHUCHOC,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //var arrPlace = [];
                    //me.dtDonNhomLop.rsLopBanDau.forEach(e => arrPlace.push("dropLopMoi" + e.ID));
                    var obj = {
                        data: dtReRult,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENLOP",
                            selectFirst: true
                        },
                        renderPlace: ["dropLopMoi" + aData.ID],
                        title: "Chọn lớp"
                    };
                    edu.system.loadToCombo_data(obj);
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
    getList_DonLopNhom_SV: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_ThongTin2/LayDSDuLieuDonLop',
            'type': 'POST',
            'strNguonDuLieu_Id': me.strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DonLopNhom_SV(dtReRult, data.Pager);
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
    genTable_DonLopNhom_SV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLopNhom",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
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
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_DonLopNhom_DuLieu: function (strId, strDangKy_LopHocPhan_Moi_Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_TrucTiep/ThucHienDonLopDangKyHocNhom',
            'type': 'POST',
            'strNguonDuLieu_Id': me.strNguonDuLieu_Id,
            'strDangKy_LopHocPhan_Cu_Ids': strId,
            'strDangKy_LopHocPhan_Moi_Ids': strDangKy_LopHocPhan_Moi_Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
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
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    //me.getList_DonLopNhom(strNguonDuLieu_Id);
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    saveTaoDanhSachNhapDiem: function (strDaoTao_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'D_PhanQuyen_MH/FSAuBTQNKCQ0DykgMQUoJCwP',
            'func': 'pkg_diem_phanquyen.TaoDuLieuNhapDiem',
            'iM': edu.system.iM,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Thực hiện thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
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