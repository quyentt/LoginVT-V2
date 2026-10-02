/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DeXuatHoSo() { };
DeXuatHoSo.prototype = {
    dtDeXuatHoSo: [],
    strDeXuatHoSo_Id: '',
    dtHocVan: [],
    strHocVan_Id: '',
    icheck: true,
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DeXuatHoSo();
        me.getList_LoaiLienHe();
        me.getList_LoaiDinhDanh();
        
        //edu.system.loadToCombo_DanhMucDuLieu("PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE", "dropSearch_LoaiDinhDanh", "", data => me["dtLoaiDinhDanh"] = data);
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_IDENTIFIER.IDENTIFIER_TYPE_CODE", "dropSearch_LoaiDinhDanh");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.DOB_PRECISION_LEVEL", "dropMucDoNgaySinh", "", data => {
            me["dtMucDoNgaySinh"] = data;
            
        });
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.GENDER_ID", "dropGioiTinh");
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "", "", data => me.dtTuyenXe = data);
        //me.getList_DMLKT();
        //$("#modal_sinhvien").modal("show");
        $("#btnSearch").click(function (e) {
            me.getList_DeXuatHoSo();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DeXuatHoSo();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#tblDeXuatHoSo").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDeXuatHoSo.find(e => e.ID == strId);

            me["strDeXuatHoSo_Id"] = data.ID;
            edu.util.viewValById("txtHo", data.LAST_NAME);
            edu.util.viewValById("txtTenDem", data.MIDDLE_NAME);
            edu.util.viewValById("txtTen", data.FIRST_NAME);
            $("#txtTen").trigger("input");
            edu.util.viewValById("dropMucDoNgaySinh", data.DOB_PRECISION_LEVEL);
            edu.util.viewValById("txtNgaySinh", data.BIRTH_DAY);
            edu.util.viewValById("txtThangSinh", data.BIRTH_MONTH);
            edu.util.viewValById("txtNamSinh", data.BIRTH_YEAR);
            edu.util.viewValById("dropGioiTinh", data.GENDER_ID);
            var strAnh = edu.system.getRootPathImg(data.PORTRAIT_FILE_ID);
            edu.util.viewValById("uploadPicture_SV", data.PORTRAIT_FILE_ID);////
            $("#srcuploadPicture_SV").attr("src", strAnh);////
            me.toggle_edit();
            me.getList_DinhDanh();
            me.getList_LienHe();
            $('#dropMucDoNgaySinh').val(strChinhXac_Id).trigger("change").trigger({ type: 'select2:select' });
        });
        $("#tblDeXuatHoSo").delegate(".btnXemChiTiet", "click", function () {
            var strId = this.id;
            var data = me.dtDeXuatHoSo.find(e => e.ID == strId);
            
            me["strDeXuatHoSo_Id"] = strId;
            me.toggle_ChiTietHoSo();
        });
        $("#btnAdd_DeXuatHoSo").click(function () {
            var data = {};
            me["strDeXuatHoSo_Id"] = data.ID;
            edu.util.viewValById("txtHo", data.LAST_NAME);
            edu.util.viewValById("txtTenDem", data.MIDDLE_NAME);
            edu.util.viewValById("txtTen", data.FIRST_NAME);
            $("#txtTen").trigger("input");
            edu.util.viewValById("dropMucDoNgaySinh", data.DOB_PRECISION_LEVEL);
            edu.util.viewValById("txtNgaySinh", data.BIRTH_DAY);
            edu.util.viewValById("txtThangSinh", data.BIRTH_MONTH);
            edu.util.viewValById("txtNamSinh", data.BIRTH_YEAR);
            edu.util.viewValById("dropGioiTinh", data.GENDER_ID);
            var strAnh = edu.system.getRootPathImg(data.PORTRAIT_FILE_ID);
            edu.util.viewValById("uploadPicture_SV", data.PORTRAIT_FILE_ID);////
            $("#srcuploadPicture_SV").attr("src", strAnh);////
            me.toggle_edit();
            var strChinhXac_Id = me["dtMucDoNgaySinh"].find(e => e.MA == "EXACT").ID;

            $('#dropMucDoNgaySinh').val(strChinhXac_Id).trigger("change").trigger({ type: 'select2:select' });
        });
        $("#btnSave_DeXuatHoSo").click(function () {
            me.icheck = true;
            let iSLCheck = me.dtLoaiDinhDanh.length + me.dtLoaiLienHe.length;
            if (iSLCheck > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", me.dtLoaiDinhDanh.length + me.dtLoaiLienHe.length);
                me.dtLoaiDinhDanh.forEach(e => me.save_KiemTraDinhDanh(e.ID));
                me.dtLoaiLienHe.forEach(e => me.save_KiemTraLienHe(e.ID));
            } else {
                edu.system.confirm("Chưa có thông tin định danh. Bạn có muốn lưu không?");
                $("#btnYes").click(function (e) {
                    me.save_DeXuatHoSo();
                });
            }
            
        });
        $("#btnDelete_DeXuatHoSo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDeXuatHoSo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DeXuatHoSo(arrChecked_Id[i]);
                }
            });
        });
        
        edu.system.getList_MauImport("zonebtnBaoCao_DeXuatHoSo", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDeXuatHoSo", "checkX");
            addKeyValue("dHieuLuc", edu.util.getValById("dropSearch_HieuLuc"));
            arrChecked_Id.forEach(e => addKeyValue("strDiem_DeXuatHoSoCongNhan_Id", e));
        });
        setTimeout(function () {
            edu.system.uploadAvatar(['uploadPicture_SV'], "");
        }, 100);


        $("#btnAdd_KiemTraDinhDanh").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneKiemTraDinhDanh");
        });
        
        $('#txtTen, #txtTenDem, #txtHo').on('input', function () {
            $('#txtHoVaTen').val(
                $('#txtHo').val() + ' ' +
                $('#txtTenDem').val() + ' ' +
                $('#txtTen').val()
            );
        });
        $("#btnSearch_KiemTra").click(function (e) {
            if (!edu.util.getValById("dropSearch_LoaiDinhDanh") && !edu.util.getValById("txtSoDinhDanh")) {
                edu.system.alert("Bạn cần điển đủ thông tin")
                return;
            }
            me.getList_KiemTraDinhDanh();
        });
        $("#txtSoDinhDanh").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KiemTraDinhDanh();
            }
        });

        $('#dropMucDoNgaySinh').on('select2:select', function () {
            var strMa = $('#dropMucDoNgaySinh option:selected').attr("name").trim();
            switch (strMa) {
                case "EXACT": {
                    $("#txtNgaySinh").parent().parent().parent().show();
                    $("#txtThangSinh").parent().parent().parent().show();
                    $("#txtNamSinh").parent().parent().parent().show();
                    break;
                };
                case "MONTH_ONLY": {
                    $("#txtNgaySinh").parent().parent().parent().hide();
                    $("#txtThangSinh").parent().parent().parent().show();
                    $("#txtNamSinh").parent().parent().parent().show();
                    break;
                };
                case "YEAR_ONLY": {
                    $("#txtNgaySinh").parent().parent().parent().hide();
                    $("#txtThangSinh").parent().parent().parent().hide();
                    $("#txtNamSinh").parent().parent().parent().show();
                    break;
                };
                case "UNKNOWN": {
                    $("#txtNgaySinh").parent().parent().parent().hide();
                    $("#txtThangSinh").parent().parent().parent().hide();
                    $("#txtNamSinh").parent().parent().parent().hide();
                    break;
                };
            }
        });

        // Tab 1: Địa chỉ
        $("#btnAdd_DiaChi").click(function () {
            me.strDiaChi_Id = "";
            me.toggle_FormDiaChi();
            $("#lblTitleDiaChi").text("Thêm địa chỉ");
            me.clearForm_DiaChi();
        });
        
        $("#tblDiaChi").delegate(".btnEdit_DiaChi", "click", function () {
            var strId = this.id;
            var data = me.dtDiaChi.find(e => e.ID == strId);
            me.strDiaChi_Id = strId;
            me.toggle_FormDiaChi();
            $("#lblTitleDiaChi").text("Sửa địa chỉ");
            me.loadForm_DiaChi(data);
        });
        
        $("#tblDiaChi").delegate(".btnDelete_DiaChi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa địa chỉ này không?");
            $("#btnYes").click(function (e) {
                me.delete_DiaChi(strId);
            });
        });
        
        $(".btnCloseDiaChi").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_DiaChi").click(function () {
            me.save_DiaChi();
        });
        
        // Auto generate địa chỉ đầy đủ
        $("#txtDiaChiChiTiet1, #txtDiaChiChiTiet2, #dropPhuong, #dropQuan, #dropTinh, #dropQuocGia").on('change input', function () {
            me.genDiaChiDayDu();
        });
        
        // Cascade dropdown
        $("#dropTinh").on('change', function () {
            var strTinh_Id = $(this).val();
            if (strTinh_Id) {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.DISTRICT_ID", "dropQuan", "PROVINCE_ID=" + strTinh_Id);
            }
        });
        
        $("#dropQuan").on('change', function () {
            var strQuan_Id = $(this).val();
            if (strQuan_Id) {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.WARD_ID", "dropPhuong", "DISTRICT_ID=" + strQuan_Id);
            }
        });

        // Tab 2: Gia đình
        $("#btnAdd_GiaDinh").click(function () {
            me.strGiaDinh_Id = "";
            me.toggle_FormGiaDinh();
            $("#lblTitleGiaDinh").text("Thêm thành viên gia đình");
            me.clearForm_GiaDinh();
        });
        
        $("#tblGiaDinh").delegate(".btnChiTiet_GiaDinh", "click", function () {
            var strId = this.id;
            var data = me.dtGiaDinh.find(e => e.ID == strId);
            me.show_ChiTietGiaDinh(data);
        });
        
        $("#tblGiaDinh").delegate(".btnEdit_GiaDinh", "click", function () {
            var strId = this.id;
            var data = me.dtGiaDinh.find(e => e.ID == strId);
            me.strGiaDinh_Id = strId;
            me.toggle_FormGiaDinh();
            $("#lblTitleGiaDinh").text("Sửa thành viên gia đình");
            me.loadForm_GiaDinh(data);
        });
        
        $("#tblGiaDinh").delegate(".btnDelete_GiaDinh", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa thành viên gia đình này không?");
            $("#btnYes").click(function (e) {
                me.delete_GiaDinh(strId);
            });
        });
        
        $(".btnCloseGiaDinh").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_GiaDinh").click(function () {
            me.save_GiaDinh();
        });
        
        // Auto generate họ tên đầy đủ
        $("#txtHoGD, #txtTenDemGD, #txtTenGD").on('input', function () {
            var strHo = edu.util.getValById("txtHoGD");
            var strTenDem = edu.util.getValById("txtTenDemGD");
            var strTen = edu.util.getValById("txtTenGD");
            $("#txtHoTenDayDuGD").val((strHo + " " + strTenDem + " " + strTen).trim());
        });
        
        // Xử lý mức độ chính xác ngày sinh
        $("#dropMucDoNgaySinhGD").on('change', function () {
            var strMa = $('#dropMucDoNgaySinhGD option:selected').attr("name");
            if (strMa) {
                strMa = strMa.trim();
                switch (strMa) {
                    case "EXACT":
                        $("#txtNgaySinhGD, #txtThangSinhGD, #txtNamSinhGD").parent().parent().parent().show();
                        break;
                    case "MONTH_ONLY":
                        $("#txtNgaySinhGD").parent().parent().parent().hide();
                        $("#txtThangSinhGD, #txtNamSinhGD").parent().parent().parent().show();
                        break;
                    case "YEAR_ONLY":
                        $("#txtNgaySinhGD, #txtThangSinhGD").parent().parent().parent().hide();
                        $("#txtNamSinhGD").parent().parent().parent().show();
                        break;
                    case "UNKNOWN":
                        $("#txtNgaySinhGD, #txtThangSinhGD, #txtNamSinhGD").parent().parent().parent().hide();
                        break;
                }
            }
        });

        // Tab 3: Tài khoản ngân hàng
        $("#btnAdd_TaiKhoanNH").click(function () {
            me.strTaiKhoanNH_Id = "";
            me.toggle_FormTaiKhoanNH();
            $("#lblTitleTaiKhoanNH").text("Thêm tài khoản ngân hàng");
            me.clearForm_TaiKhoanNH();
        });
        
        $("#tblTaiKhoanNH").delegate(".btnChiTiet_TaiKhoanNH", "click", function () {
            var strId = this.id;
            var data = me.dtTaiKhoanNH.find(e => e.ID == strId);
            me.show_ChiTietTaiKhoanNH(data);
        });
        
        $("#tblTaiKhoanNH").delegate(".btnEdit_TaiKhoanNH", "click", function () {
            var strId = this.id;
            var data = me.dtTaiKhoanNH.find(e => e.ID == strId);
            me.strTaiKhoanNH_Id = strId;
            me.toggle_FormTaiKhoanNH();
            $("#lblTitleTaiKhoanNH").text("Sửa tài khoản ngân hàng");
            me.loadForm_TaiKhoanNH(data);
        });
        
        $("#tblTaiKhoanNH").delegate(".btnDelete_TaiKhoanNH", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa tài khoản ngân hàng này không?");
            $("#btnYes").click(function (e) {
                me.delete_TaiKhoanNH(strId);
            });
        });
        
        $(".btnCloseTaiKhoanNH").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_TaiKhoanNH").click(function () {
            me.save_TaiKhoanNH();
        });
        
        // Cascade dropdown ngân hàng -> chi nhánh
        $("#dropNganHang").on('change', function () {
            var strNganHang_Id = $(this).val();
            if (strNganHang_Id) {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.BRANCH_ID", "dropChiNhanh", "BANK_ID=" + strNganHang_Id);
            }
        });

        // Tab 4: Học vấn
        $("#btnAdd_HocVan").click(function () {
            me.strHocVan_Id = "";
            me.toggle_FormHocVan();
            $("#lblTitleHocVan").text("Thêm học vấn");
            me.clearForm_HocVan();
        });
        
        $("#tblHocVan").delegate(".btnChiTiet_HocVan", "click", function () {
            var strId = this.id;
            var data = me.dtHocVan.find(e => e.ID == strId);
            me.show_ChiTietHocVan(data);
        });
        
        $("#tblHocVan").delegate(".btnEdit_HocVan", "click", function () {
            var strId = this.id;
            var data = me.dtHocVan.find(e => e.ID == strId);
            me.strHocVan_Id = strId;
            me.toggle_FormHocVan();
            $("#lblTitleHocVan").text("Sửa học vấn");
            me.loadForm_HocVan(data);
        });
        
        $("#tblHocVan").delegate(".btnDelete_HocVan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa học vấn này không?");
            $("#btnYes").click(function (e) {
                me.delete_HocVan(strId);
            });
        });
        
        $(".btnCloseHocVan").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_HocVan").click(function () {
            me.save_HocVan();
        });
        
        // Cascade dropdown nhóm ngành -> ngành -> chuyên ngành
        $("#dropNhomNganh").on('change', function () {
            var strNhomNganh_Id = $(this).val();
            if (strNhomNganh_Id) {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.MAJOR_ID", "dropNganh", "MAJOR_GROUP_ID=" + strNhomNganh_Id);
            }
        });
        
        $("#dropNganh").on('change', function () {
            var strNganh_Id = $(this).val();
            if (strNganh_Id) {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.SPECIALIZATION_ID", "dropChuyenNganh", "MAJOR_ID=" + strNganh_Id);
            }
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_DeXuatHoSo();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        this.genTable_LoaiDinhDanh();
        this.genTable_LoaiLienHe();
    },
    toggle_ChiTietHoSo: function () {
        edu.util.toggle_overide("zone-bus", "zoneChiTietHoSo");
        // Load dữ liệu địa chỉ cho Tab 1
        this.getList_DiaChi();
        // Load dữ liệu gia đình cho Tab 2
        this.getList_GiaDinh();
        // Load dữ liệu tài khoản ngân hàng cho Tab 3
        this.getList_TaiKhoanNH();
        // Load dữ liệu học vấn cho Tab 4
        this.getList_HocVan();
    },
    toggle_DeXuatHoSo: function () {
        edu.util.toggle_overide("zone-bus", "zoneDeXuatHoSo");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DeXuatHoSo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/BiQ1Ai4zJBEkMzIuLwM4DyY0LigVIC4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_05.GetCorePersonByNguoiTaoId',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDeXuatHoSo = dtReRult;
                    me.genTable_DeXuatHoSo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_DeXuatHoSo: function () {
        var me = this;
        if (!me["icheck"]) {
            return;
            //edu.system.alert("Lưu thành công");
        }
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CC8yJDM1Ai4zJBEkMzIuLwPP',
            'func': 'PKG_CORE_HOSONHANSU_05.InsertCorePerson',
            'iM': edu.system.iM,
            'strId': me.strDeXuatHoSo_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strFullName': edu.system.getValById('txtHoVaTen'),
            'strLastName': edu.system.getValById('txtHo'),
            'strMiddleName': edu.system.getValById('txtTenDem'),
            'strFirstName': edu.system.getValById('txtTen'),
            'strDateOfBirth': edu.system.getValById('txtNgaySinh') + "/" + edu.system.getValById('txtThangSinh') + "/" + edu.system.getValById('txtNamSinh'),
            'strDobPrecisionLevel': edu.system.getValById('dropMucDoNgaySinh'),
            'dBirthDay': edu.system.getValById('txtNgaySinh'),
            'dBirthMonth': edu.system.getValById('txtThangSinh'),
            'dBirthYear': edu.system.getValById('txtNamSinh'),
            'strGenderId': edu.system.getValById('dropGioiTinh'),
            'strProfileStatusId': edu.system.getValById('txtAAAA'),
            'strPortraitFileId': edu.system.getValById('uploadPicture_SV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu5_MH/FDElIDUkAi4zJBEkMzIuLwPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_05.UpdateCorePerson';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeXuatHoSo_Id = "";

                    if (!obj_save.strId) {
                        //edu.system.alert("Thêm mới thành công!");
                        strDeXuatHoSo_Id = data.Id;
                    }
                    else {
                        //edu.system.alert("Cập nhật thành công!");
                        strDeXuatHoSo_Id = obj_save.strId
                    }
                    me.strDeXuatHoSo_Id = strDeXuatHoSo_Id;
                    let iSLCheck = me.dtLoaiDinhDanh.length + me.dtLoaiLienHe.length;
                    if (iSLCheck > 0) {
                        edu.system.genHTML_Progress("zoneprocessXXXX", iSLCheck);
                        me.dtLoaiDinhDanh.forEach(e => me.save_DinhDanh(e.ID));
                        me.dtLoaiLienHe.forEach(e => me.save_LienHe(e.ID));
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DeXuatHoSo();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DeXuatHoSo: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_HoSoNhanSu5_MH/BSQtJDUkAi4zJBEkMzIuLwPP',
            'func': 'PKG_CORE_HOSONHANSU_05.DeleteCorePerson',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DeXuatHoSo();
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
    genTable_DeXuatHoSo: function (data, iPager) {
        var me = this;
        $("#lblDeXuatHoSo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeXuatHoSo",

            //bPaginate: {
            //    strFuntionName: "main_doc.DeXuatHoSo.getList_DeXuatHoSo()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
            aoColumns: [
                {
                    "mDataProp": "FULL_NAME",
                },
                {
                    "mDataProp": "DATE_OF_BIRTH"
                },
                {
                    "mDataProp": "GENDER_NAME"
                },
                {
                    "mDataProp": "PROFILE_STATUS_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btn-sm btnXemChiTiet" id="' + aData.ID + '" title="Xem chi tiết"><i class="fa fa-eye me-1"></i>Xem chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "IS_ACTIVE"
                },
                {
                    "mDataProp": "CREATED_AT_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "CREATED_BY_TAIKHOAN"
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

    save_KiemTraDinhDanh: function (strId) {
        var me = this;
        let check = $("#txtSoDinhDinh" + strId).attr("name");
        if (check && check.length == 32) {
            edu.system.start_Progress("zoneprocessXXXX", function () {
                me.save_DeXuatHoSo();
            });
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP',
            'func': 'PKG_CORE_HOSONHANSU_05.KiemTraThongTinDinhDanh',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIdentifier_Type_Code': strId,
            'strIdentifier_No': edu.system.getValById('txtSoDinhDinh' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeXuatHoSo_Id = "";
                    if (data.Data.length > 0) {
                        me["icheck"] = false;
                        edu.system.alert("Dữ liệu tồn tại: " + me.dtLoaiDinhDanh.find(e => e.ID == obj_save.strIdentifier_Type_Code).TEN);
                    }
                }
                else {
                    if (me["icheck"]) {
                        me["icheck"] = false;
                        edu.system.alert(data.Message);
                    }
                }
                
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.save_DeXuatHoSo();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_DinhDanh: function (strId) {
        var me = this;
        var strDinhDanh_Id = $("#txtSoDinhDinh" + strId).attr("name");
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CC8yJDM1ESQzMi4vCCUkLzUoJygkMwPP',
            'func': 'PKG_CORE_HOSONHANSU_05.InsertPersonIdentifier',
            'iM': edu.system.iM,
            'strId': strDinhDanh_Id,
            'strIdentifierTypeCode': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPersonId': me.strDeXuatHoSo_Id,
            'strIdentifierNo': edu.system.getValById('txtSoDinhDinh' + strId),
            'strIssueDate': edu.system.getValById('txtNgayCap' + strId),
            'strIssuePlace': edu.system.getValById('txtNoiCap' + strId),
            'dIsPrimary': $("#checkX" + strId).is(':checked')? 1: 0,
            'strEffectiveFrom': edu.system.getValById('txtAAAA'),
            'strEffectiveTo': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu5_MH/FDElIDUkESQzMi4vCCUkLzUoJygkMwPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_05.UpdatePersonIdentifier';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeXuatHoSo_Id = "";

                    if (obj_save.strId == "") {
                        //edu.system.alert("Thêm mới thành công!");
                        strDeXuatHoSo_Id = data.Id;
                    }
                    else {
                        //edu.system.alert("Cập nhật thành công!");
                        strDeXuatHoSo_Id = obj_save.strId
                    }

                }
                else {
                    if (me["icheck"]) {
                        me["icheck"] = false;
                        edu.system.alert(data.Message);
                    }
                }
                
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.save_ThanhCong();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DinhDanh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vCCUkLzUoJygkMwM4ESQzMi4vHggl',
            'func': 'PKG_CORE_HOSONHANSU_05.GetPersonIdentifierByPerson_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': me.strDeXuatHoSo_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDinhDanh"] = dtReRult;
                    me.genTable_DinhDanh(dtReRult, data.Pager);
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
    genTable_DinhDanh: function (data, iPager) {
        var me = this;

        data.forEach(aData => {
            let strId = aData.IDENTIFIER_TYPE_CODE;
            if (strId.length == 32) {
                $("#txtSoDinhDinh" + strId).attr("name", aData.ID);
                $("#txtSoDinhDinh" + strId).val(edu.util.returnEmpty(aData.IDENTIFIER_NO))
                $("#txtNgayCap" + strId).val(edu.util.returnEmpty(aData.ISSUE_DATE))
                $("#txtNoiCap" + strId).val(edu.util.returnEmpty(aData.ISSUE_PLACE))
                if (aData.IS_PRIMARY) {
                    $("#checkX" + strId).attr('checked', true);
                    $("#checkX" + strId).prop('checked', true);
                }
            }
        })
    },

    save_KiemTraLienHe: function (strId) {
        var me = this;
        let check = $("#txtLienHe" + strId).attr("name");
        if (check && check.length == 32) {
            edu.system.start_Progress("zoneprocessXXXX", function () {
                me.save_DeXuatHoSo();
            });
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CigkLBUzIBUpLi8mFSgvDSgkLwkk',
            'func': 'PKG_CORE_HOSONHANSU_05.KiemTraThongTinLienHe',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strContactTypeCode': strId,
            'strContactValue': edu.system.getValById('txtLienHe' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeXuatHoSo_Id = "";
                    if (data.Data.length > 0) {
                        me["icheck"] = false;
                        edu.system.alert("Dữ liệu tồn tại: " + me.dtLoaiLienHe.find(e => e.ID == obj_save.strContactTypeCode).TEN);
                    }
                }
                else {
                    if (me["icheck"]) {
                        me["icheck"] = false;
                        edu.system.alert(data.Message);
                    }
                }
                
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.save_DeXuatHoSo();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_LienHe: function (strId) {
        var me = this;
        var strLienHe_Id = $("#txtLienHe" + strId).attr("name");
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CC8yJDM1ESQzMi4vAi4vNSAiNQPP',
            'func': 'PKG_CORE_HOSONHANSU_05.InsertPersonContact',
            'iM': edu.system.iM,
            'strId': strLienHe_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPersonId': me.strDeXuatHoSo_Id,
            'strContactTypeCode': strId,
            'strContactValue': edu.system.getValById('txtLienHe' + strId),
            'dIsPrimary': $("#checkX" + strId).is(':checked') ? 1 : 0,
            'strEffectiveFrom': edu.system.getValById('txtAAAA'),
            'strEffectiveTo': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu5_MH/FDElIDUkESQzMi4vAi4vNSAiNQPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_05.UpdatePersonContact';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeXuatHoSo_Id = "";

                    if (obj_save.strId == "") {
                        //edu.system.alert("Thêm mới thành công!");
                        strDeXuatHoSo_Id = data.Id;
                    }
                    else {
                        //edu.system.alert("Cập nhật thành công!");
                        strDeXuatHoSo_Id = obj_save.strId
                    }

                }
                else {
                    if (me["icheck"]) {
                        me["icheck"] = false;
                        edu.system.alert(data.Message);
                    }
                }

            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.save_ThanhCong();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_LienHe: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
            'func': 'PKG_CORE_HOSONHANSU_05.GetPersonContactByPerson_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': me.strDeXuatHoSo_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLienHe"] = dtReRult;
                    me.genTable_LienHe(dtReRult, data.Pager);
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
    genTable_LienHe: function (data, iPager) {
        var me = this;
        /*III. Callback*/
        data.forEach(aData => {
            let strId = aData.CONTACT_TYPE_CODE_ID;
            if (strId.length == 32) {
                $("#txtLienHe" + strId).attr("name", aData.ID);
                $("#txtLienHe" + strId).val(edu.util.returnEmpty(aData.CONTACT_VALUE))
                if (aData.IS_PRIMARY) {
                    $("#checkX" + strId).attr('checked', true);
                    $("#checkX" + strId).prop('checked', true);
                }
            }
        })
    },

    getList_LoaiDinhDanh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/DSA4BRINLiAoBSgvKQUgLykDIDUDNC4i',
            'func': 'PKG_CORE_HOSONHANSU_05.LayDSLoaiDinhDanhBatBuoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLoaiDinhDanh"] = dtReRult;
                    me.genTable_LoaiDinhDanh(dtReRult, data.Pager);
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
    genTable_LoaiDinhDanh: function (data, iPager) {
        var me = this;
        $("#lblDinhDanh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDinhDanh",
            aaData: me.dtLoaiDinhDanh,
            //bPaginate: {
            //    strFuntionName: "main_doc.DinhDanh.getList_DinhDanh()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblMa' + aData.ID + '">"' + edu.util.returnEmpty(aData.TEN) + '"</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtSoDinhDinh' + aData.ID + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtNgayCap' + aData.ID + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtNoiCap' + aData.ID + '" />';
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

    getList_LoaiLienHe: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/DSA4BRINLiAoDSgkLwkkAyA1AzQuIgPP',
            'func': 'PKG_CORE_HOSONHANSU_05.LayDSLoaiLienHeBatBuoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLoaiLienHe"] = dtReRult;
                    me.genTable_LoaiLienHe(dtReRult, data.Pager);
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
    genTable_LoaiLienHe: function (data, iPager) {
        var me = this;
        $("#lblDinhDanh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLienHe",
            aaData: me.dtLoaiLienHe,
            //bPaginate: {
            //    strFuntionName: "main_doc.DinhDanh.getList_DinhDanh()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblMa' + aData.ID + '">"' + edu.util.returnEmpty(aData.TEN) + '"</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtLienHe' + aData.ID + '" />';
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

    getList_KiemTraDinhDanh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP',
            'func': 'PKG_CORE_HOSONHANSU_05.KiemTraThongTinDinhDanh',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIdentifier_Type_Code': edu.system.getValById('dropSearch_LoaiDinhDanh'),
            'strIdentifier_No': edu.system.getValById('txtSoDinhDanh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKiemTraDinhDanh"] = dtReRult;
                    me.genTable_KiemTraDinhDanh(dtReRult, data.Pager);
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
    genTable_KiemTraDinhDanh: function (data, iPager) {
        var me = this;
        $("#lblKiemTraDinhDanh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKiemTraDinhDanh",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DinhDanh.getList_DinhDanh()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "IDENTIFIER_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "IDENTIFIER_NO"
                },
                {
                    "mDataProp": "ISSUE_DATE"
                },
                {
                    "mDataProp": "ISSUE_PLACE"
                },
                {
                    "mDataProp": "FULL_NAME"
                },
                {
                    "mDataProp": "NOTE"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length > 0) {
            $("#lblKetQuaKiemTra").html('"Tồn tại nhân sự có thông tin định danh ' + $("#dropSearch_LoaiDinhDanh option:selected").text() + ' dữ liệu ' + $("#txtSoDinhDanh").val())
        } else {
            $("#lblKetQuaKiemTra").html('"Định danh ' + $("#dropSearch_LoaiDinhDanh option:selected").text() + ' dữ liệu ' + $("#txtSoDinhDanh").val() +'" --> Không tồn tại trong hệ thống và chưa được sử dụng')
        }
        /*III. Callback*/
    },

    save_ThanhCong: function () {
        var me = this;
        if (me["icheck"]) {
            edu.system.alert("Lưu thành công");
        }
    },

    getList_DiaChi: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AJSUzJDIy',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Address',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': me.strDeXuatHoSo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDiaChi"] = dtReRult;
                    me.genTable_DiaChi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_DiaChi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiaChi",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15, 16],
            },
            aoColumns: [
                {
                    "mDataProp": "ADDRESS_TYPE_NAME"
                },
                {
                    "mDataProp": "ADDRESS_STATUS_NAME"
                },
                {
                    "mDataProp": "COUNTRY_NAME"
                },
                {
                    "mDataProp": "PROVINCE_NAME"
                },
                {
                    "mDataProp": "DISTRICT_NAME"
                },
                {
                    "mDataProp": "WARD_NAME"
                },
                {
                    "mDataProp": "ADDRESS_LINE1"
                },
                {
                    "mDataProp": "ADDRESS_LINE2"
                },
                {
                    "mDataProp": "FULL_ADDRESS"
                },
                {
                    "mDataProp": "POSTAL_CODE"
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_PRIMARY == 1) {
                            return '<i class="fa fa-check text-success"></i>';
                        }
                        return '';
                    }
                },
                {
                    "mDataProp": "EFFECTIVE_FROM"
                },
                {
                    "mDataProp": "EFFECTIVE_TO"
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_ACTIVE == 1) {
                            return '<span class="badge bg-success">Có hiệu lực</span>';
                        }
                        return '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                {
                    "mDataProp": "NOTE"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btn-sm btnEdit_DiaChi" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-danger btn-sm btnDelete_DiaChi" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    toggle_FormDiaChi: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormDiaChi");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.ADDRESS_TYPE_CODE", "dropLoaiDiaChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.ADDRESS_STATUS_CODE", "dropTrangThaiDiaChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.COUNTRY_ID", "dropQuocGia");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.PROVINCE_ID", "dropTinh");
    },

    clearForm_DiaChi: function () {
        edu.util.viewValById("dropLoaiDiaChi", "");
        edu.util.viewValById("dropTrangThaiDiaChi", "");
        edu.util.viewValById("dropQuocGia", "");
        edu.util.viewValById("dropTinh", "");
        edu.util.viewValById("dropQuan", "");
        edu.util.viewValById("dropPhuong", "");
        edu.util.viewValById("txtDiaChiChiTiet1", "");
        edu.util.viewValById("txtDiaChiChiTiet2", "");
        edu.util.viewValById("txtDiaChiDayDu", "");
        edu.util.viewValById("txtMaBuuChinh", "");
        $("#chkDiaChiChinh").prop('checked', false);
        edu.util.viewValById("txtNgayHieuLuc", "");
        edu.util.viewValById("txtNgayHetHieuLuc", "");
        edu.util.viewValById("txtGhiChuDiaChi", "");
    },

    loadForm_DiaChi: function (data) {
        edu.util.viewValById("dropLoaiDiaChi", data.ADDRESS_TYPE_CODE);
        edu.util.viewValById("dropTrangThaiDiaChi", data.ADDRESS_STATUS_CODE);
        edu.util.viewValById("dropQuocGia", data.COUNTRY_ID);
        edu.util.viewValById("dropTinh", data.PROVINCE_ID);
        
        // Load cascade
        if (data.PROVINCE_ID) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.DISTRICT_ID", "dropQuan", "PROVINCE_ID=" + data.PROVINCE_ID, function() {
                edu.util.viewValById("dropQuan", data.DISTRICT_ID);
            });
        }
        if (data.DISTRICT_ID) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.WARD_ID", "dropPhuong", "DISTRICT_ID=" + data.DISTRICT_ID, function() {
                edu.util.viewValById("dropPhuong", data.WARD_ID);
            });
        }
        
        edu.util.viewValById("txtDiaChiChiTiet1", data.ADDRESS_LINE1);
        edu.util.viewValById("txtDiaChiChiTiet2", data.ADDRESS_LINE2);
        edu.util.viewValById("txtDiaChiDayDu", data.FULL_ADDRESS);
        edu.util.viewValById("txtMaBuuChinh", data.POSTAL_CODE);
        $("#chkDiaChiChinh").prop('checked', data.IS_PRIMARY == 1);
        edu.util.viewValById("txtNgayHieuLuc", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLuc", data.EFFECTIVE_TO);
        edu.util.viewValById("txtGhiChuDiaChi", data.NOTE);
    },

    genDiaChiDayDu: function () {
        var arrDiaChi = [];
        
        var strDC1 = edu.util.getValById("txtDiaChiChiTiet1");
        var strDC2 = edu.util.getValById("txtDiaChiChiTiet2");
        var strPhuong = $("#dropPhuong option:selected").text();
        var strQuan = $("#dropQuan option:selected").text();
        var strTinh = $("#dropTinh option:selected").text();
        var strQuocGia = $("#dropQuocGia option:selected").text();
        
        if (strDC1) arrDiaChi.push(strDC1);
        if (strDC2) arrDiaChi.push(strDC2);
        if (strPhuong && strPhuong != "-- Chọn --") arrDiaChi.push(strPhuong);
        if (strQuan && strQuan != "-- Chọn --") arrDiaChi.push(strQuan);
        if (strTinh && strTinh != "-- Chọn --") arrDiaChi.push(strTinh);
        if (strQuocGia && strQuocGia != "-- Chọn --") arrDiaChi.push(strQuocGia);
        
        $("#txtDiaChiDayDu").val(arrDiaChi.join(", "));
    },

    save_DiaChi: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropLoaiDiaChi")) {
            edu.system.alert("Vui lòng chọn loại địa chỉ!");
            return;
        }
        if (!edu.util.getValById("dropTinh")) {
            edu.system.alert("Vui lòng chọn tỉnh/thành phố!");
            return;
        }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Address',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strAddress_Type_Code': edu.system.getValById('dropLoaiDiaChi'),
            'strAddress_Status_Code': edu.system.getValById('dropTrangThaiDiaChi'),
            'strCountry_Id': edu.system.getValById('dropQuocGia'),
            'strProvince_Id': edu.system.getValById('dropTinh'),
            'strDistrict_Id': edu.system.getValById('dropQuan'),
            'strWard_Id': edu.system.getValById('dropPhuong'),
            'strAddress_Line1': edu.system.getValById('txtDiaChiChiTiet1'),
            'strAddress_Line2': edu.system.getValById('txtDiaChiChiTiet2'),
            'strFull_Address': edu.system.getValById('txtDiaChiDayDu'),
            'strPostal_Code': edu.system.getValById('txtMaBuuChinh'),
            'dIs_Primary': $("#chkDiaChiChinh").is(':checked') ? 1 : 0,
            'dIs_Verified': 0,
            'dIs_Active': 1,
            'strEffective_From': edu.system.getValById('txtNgayHieuLuc'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLuc'),
            'strNote': edu.system.getValById('txtGhiChuDiaChi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strDiaChi_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Address';
            obj_save.strId = me.strDiaChi_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strDiaChi_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_DiaChi();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    delete_DiaChi: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4AJSUzJDIy',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Address',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_DiaChi();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_delete.action,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    },

    getList_GiaDinh: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4HICwoLTgP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Family',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': me.strDeXuatHoSo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtGiaDinh"] = dtReRult;
                    me.genTable_GiaDinh(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_GiaDinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGiaDinh",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 19, 20],
            },
            aoColumns: [
                {
                    "mDataProp": "STT"
                },
                {
                    "mDataProp": "RELATION_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "RELATION_STATUS_CODE_NAME"
                },
                {
                    "mDataProp": "FULL_NAME"
                },
                {
                    "mDataProp": "LAST_NAME"
                },
                {
                    "mDataProp": "MIDDLE_NAME"
                },
                {
                    "mDataProp": "FIRST_NAME"
                },
                {
                    "mDataProp": "GENDER_NAME"
                },
                {
                    "mDataProp": "DOB_PRECISION_LEVEL_NAME"
                },
                {
                    "mDataProp": "DATE_OF_BIRTH"
                },
                {
                    "mDataProp": "BIRTH_DAY"
                },
                {
                    "mDataProp": "BIRTH_MONTH"
                },
                {
                    "mDataProp": "BIRTH_YEAR"
                },
                {
                    "mDataProp": "OCCUPATION"
                },
                {
                    "mDataProp": "EFFECTIVE_FROM"
                },
                {
                    "mDataProp": "EFFECTIVE_TO"
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_ACTIVE == 1) {
                            return '<span class="badge bg-success">Có hiệu lực</span>';
                        }
                        return '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                {
                    "mDataProp": "NOTE"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btn-sm btnChiTiet_GiaDinh" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btn-sm btnEdit_GiaDinh" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-danger btn-sm btnDelete_GiaDinh" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    show_ChiTietGiaDinh: function (data) {
        var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
        strHTML += '<div class="row">';
        strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-users me-2"></i>Thông tin chi tiết thành viên gia đình</h5></div>';
        
        // Thông tin quan hệ
        strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-link me-2"></i>Thông tin quan hệ</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Loại quan hệ:</strong> ' + edu.util.returnEmpty(data.RELATION_TYPE_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Mã trạng thái quan hệ:</strong> ' + edu.util.returnEmpty(data.RELATION_STATUS_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin cá nhân
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-user me-2"></i>Thông tin cá nhân</h6></div>';
        strHTML += '<div class="col-md-12 mb-2"><strong>Họ tên đầy đủ của thân nhân:</strong> ' + edu.util.returnEmpty(data.FULL_NAME) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Họ:</strong> ' + edu.util.returnEmpty(data.LAST_NAME) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Tên đệm:</strong> ' + edu.util.returnEmpty(data.MIDDLE_NAME) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Tên:</strong> ' + edu.util.returnEmpty(data.FIRST_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Giới tính:</strong> ' + edu.util.returnEmpty(data.GENDER_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Mức độ chính xác của ngày sinh:</strong> ' + edu.util.returnEmpty(data.DOB_PRECISION_LEVEL_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Ngày sinh đầy đủ:</strong> ' + edu.util.returnEmpty(data.DATE_OF_BIRTH) + '</div>';
        strHTML += '<div class="col-md-2 mb-2"><strong>Ngày sinh:</strong> ' + edu.util.returnEmpty(data.BIRTH_DAY) + '</div>';
        strHTML += '<div class="col-md-2 mb-2"><strong>Tháng sinh:</strong> ' + edu.util.returnEmpty(data.BIRTH_MONTH) + '</div>';
        strHTML += '<div class="col-md-2 mb-2"><strong>Năm sinh:</strong> ' + edu.util.returnEmpty(data.BIRTH_YEAR) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin công việc và liên hệ
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-briefcase me-2"></i>Thông tin công việc & liên hệ</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Nghề nghiệp:</strong> ' + edu.util.returnEmpty(data.OCCUPATION) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Nơi làm việc:</strong> ' + edu.util.returnEmpty(data.WORKPLACE) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Số điện thoại:</strong> ' + edu.util.returnEmpty(data.PHONE_NUMBER) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Email:</strong> ' + edu.util.returnEmpty(data.EMAIL) + '</div>';
        strHTML += '<div class="col-md-12 mb-2"><strong>Địa chỉ của thân nhân:</strong> ' + edu.util.returnEmpty(data.ADDRESS_TEXT) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin bổ sung
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-info-circle me-2"></i>Thông tin bổ sung</h6></div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Người phụ thuộc:</strong> ' + (data.IS_DEPENDENT == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Người liên hệ khẩn cấp:</strong> ' + (data.IS_EMERGENCY_CONTACT == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Quan hệ chính:</strong> ' + (data.IS_PRIMARY_CONTACT == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin hiệu lực
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-calendar me-2"></i>Thông tin hiệu lực</h6></div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Ngày hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_FROM) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Ngày hết hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_TO) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Hiệu lực:</strong> ' + (data.IS_ACTIVE == 1 ? '<span class="badge bg-success">Có hiệu lực</span>' : '<span class="badge bg-secondary">Hết hiệu lực</span>') + '</div>';
        strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';
        
        strHTML += '</div></div>';
        
        edu.system.alert(strHTML);
    },

    toggle_FormGiaDinh: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormGiaDinh");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.RELATION_TYPE_CODE", "dropLoaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.RELATION_STATUS_CODE", "dropTrangThaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.GENDER_ID", "dropGioiTinhGD");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.DOB_PRECISION_LEVEL", "dropMucDoNgaySinhGD");
    },

    clearForm_GiaDinh: function () {
        edu.util.viewValById("dropLoaiQuanHe", "");
        edu.util.viewValById("dropTrangThaiQuanHe", "");
        edu.util.viewValById("txtHoTenDayDuGD", "");
        edu.util.viewValById("txtHoGD", "");
        edu.util.viewValById("txtTenDemGD", "");
        edu.util.viewValById("txtTenGD", "");
        edu.util.viewValById("dropGioiTinhGD", "");
        edu.util.viewValById("dropMucDoNgaySinhGD", "");
        edu.util.viewValById("txtNgaySinhGD", "");
        edu.util.viewValById("txtThangSinhGD", "");
        edu.util.viewValById("txtNamSinhGD", "");
        edu.util.viewValById("txtNgheNghiep", "");
        edu.util.viewValById("txtNoiLamViec", "");
        edu.util.viewValById("txtSoDienThoaiGD", "");
        edu.util.viewValById("txtEmailGD", "");
        edu.util.viewValById("txtDiaChiGD", "");
        $("#chkNguoiPhuThuoc").prop('checked', false);
        $("#chkLienHeKhanCap").prop('checked', false);
        $("#chkQuanHeChinh").prop('checked', false);
        edu.util.viewValById("txtNgayHieuLucGD", "");
        edu.util.viewValById("txtNgayHetHieuLucGD", "");
        edu.util.viewValById("txtGhiChuGD", "");
    },

    save_GiaDinh: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropLoaiQuanHe")) {
            edu.system.alert("Vui lòng chọn loại quan hệ!");
            return;
        }
        if (!edu.util.getValById("txtHoGD")) {
            edu.system.alert("Vui lòng nhập họ!");
            return;
        }
        if (!edu.util.getValById("txtTenGD")) {
            edu.system.alert("Vui lòng nhập tên!");
            return;
        }
        
        var strNgaySinh = edu.util.getValById("txtNgaySinhGD") + "/" + 
                          edu.util.getValById("txtThangSinhGD") + "/" + 
                          edu.util.getValById("txtNamSinhGD");
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4HICwoLTgP',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Family',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strRelation_Type_Code': edu.system.getValById('dropLoaiQuanHe'),
            'strRelation_Status_Code': edu.system.getValById('dropTrangThaiQuanHe'),
            'strFull_Name': edu.system.getValById('txtHoTenDayDuGD'),
            'strLast_Name': edu.system.getValById('txtHoGD'),
            'strMiddle_Name': edu.system.getValById('txtTenDemGD'),
            'strFirst_Name': edu.system.getValById('txtTenGD'),
            'strGender_Id': edu.system.getValById('dropGioiTinhGD'),
            'strDate_Of_Birth': strNgaySinh,
            'strDob_Precision_Level': edu.system.getValById('dropMucDoNgaySinhGD'),
            'dBirth_Day': edu.system.getValById('txtNgaySinhGD'),
            'dBirth_Month': edu.system.getValById('txtThangSinhGD'),
            'dBirth_Year': edu.system.getValById('txtNamSinhGD'),
            'strOccupation': edu.system.getValById('txtNgheNghiep'),
            'strWorkplace': edu.system.getValById('txtNoiLamViec'),
            'strPhone_Number': edu.system.getValById('txtSoDienThoaiGD'),
            'strEmail': edu.system.getValById('txtEmailGD'),
            'strAddress_Text': edu.system.getValById('txtDiaChiGD'),
            'dIs_Dependent': $("#chkNguoiPhuThuoc").is(':checked') ? 1 : 0,
            'dIs_Emergency_Contact': $("#chkLienHeKhanCap").is(':checked') ? 1 : 0,
            'dIs_Primary_Contact': $("#chkQuanHeChinh").is(':checked') ? 1 : 0,
            'dIs_Active': 1,
            'strEffective_From': edu.system.getValById('txtNgayHieuLucGD'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLucGD'),
            'strNote': edu.system.getValById('txtGhiChuGD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strGiaDinh_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4HICwoLTgP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Family';
            obj_save.strId = me.strGiaDinh_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strGiaDinh_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_GiaDinh();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    
    loadForm_GiaDinh: function (data) {
        edu.util.viewValById("dropLoaiQuanHe", data.RELATION_TYPE_CODE);
        edu.util.viewValById("dropTrangThaiQuanHe", data.RELATION_STATUS_CODE);
        edu.util.viewValById("txtHoTenDayDuGD", data.FULL_NAME);
        edu.util.viewValById("txtHoGD", data.LAST_NAME);
        edu.util.viewValById("txtTenDemGD", data.MIDDLE_NAME);
        edu.util.viewValById("txtTenGD", data.FIRST_NAME);
        edu.util.viewValById("dropGioiTinhGD", data.GENDER_ID);
        edu.util.viewValById("dropMucDoNgaySinhGD", data.DOB_PRECISION_LEVEL);
        edu.util.viewValById("txtNgaySinhGD", data.BIRTH_DAY);
        edu.util.viewValById("txtThangSinhGD", data.BIRTH_MONTH);
        edu.util.viewValById("txtNamSinhGD", data.BIRTH_YEAR);
        edu.util.viewValById("txtNgheNghiep", data.OCCUPATION);
        edu.util.viewValById("txtNoiLamViec", data.WORKPLACE);
        edu.util.viewValById("txtSoDienThoaiGD", data.PHONE_NUMBER);
        edu.util.viewValById("txtEmailGD", data.EMAIL);
        edu.util.viewValById("txtDiaChiGD", data.ADDRESS_TEXT);
        $("#chkNguoiPhuThuoc").prop('checked', data.IS_DEPENDENT == 1);
        $("#chkLienHeKhanCap").prop('checked', data.IS_EMERGENCY_CONTACT == 1);
        $("#chkQuanHeChinh").prop('checked', data.IS_PRIMARY_CONTACT == 1);
        edu.util.viewValById("txtNgayHieuLucGD", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLucGD", data.EFFECTIVE_TO);
        edu.util.viewValById("txtGhiChuGD", data.NOTE);
        
        // Trigger DOB precision level change to show/hide date fields
        $("#dropMucDoNgaySinhGD").trigger('change');
    },
    
    delete_GiaDinh: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4HICwoLTgP',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Family',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_GiaDinh();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_delete.action,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    },

    // ==================== TAB 3: TÀI KHOẢN NGÂN HÀNG ====================
    
    getList_TaiKhoanNH: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Bank_Account',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': me.strDeXuatHoSo_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTaiKhoanNH"] = dtReRult;
                    me.genTable_TaiKhoanNH(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_TaiKhoanNH: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTaiKhoanNH",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19],
            },
            aoColumns: [
                {
                    "mDataProp": "STT"
                },
                {
                    "mDataProp": "ACCOUNT_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "ACCOUNT_STATUS_CODE_NAME"
                },
                {
                    "mDataProp": "BANK_NAME"
                },
                {
                    "mDataProp": "BANK_CODE"
                },
                {
                    "mDataProp": "BRANCH_NAME"
                },
                {
                    "mDataProp": "BRANCH_CODE"
                },
                {
                    "mDataProp": "ACCOUNT_NUMBER"
                },
                {
                    "mDataProp": "ACCOUNT_NAME"
                },
                {
                    "mDataProp": "ACCOUNT_CURRENCY_CODE_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_PRIMARY == 1) {
                            return '<i class="fa fa-check text-success"></i>';
                        }
                        return '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_PAYROLL_DEFAULT == 1) {
                            return '<i class="fa fa-check text-success"></i>';
                        }
                        return '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_VERIFIED == 1) {
                            return '<i class="fa fa-check text-success"></i>';
                        }
                        return '';
                    }
                },
                {
                    "mDataProp": "EFFECTIVE_FROM"
                },
                {
                    "mDataProp": "EFFECTIVE_TO"
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_ACTIVE == 1) {
                            return '<span class="badge bg-success">Có hiệu lực</span>';
                        }
                        return '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                {
                    "mDataProp": "NOTE"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btn-sm btnChiTiet_TaiKhoanNH" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btn-sm btnEdit_TaiKhoanNH" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-danger btn-sm btnDelete_TaiKhoanNH" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    show_ChiTietTaiKhoanNH: function (data) {
        var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
        strHTML += '<div class="row">';
        strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-university me-2"></i>Thông tin chi tiết tài khoản ngân hàng</h5></div>';
        
        // Thông tin tài khoản
        strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-credit-card me-2"></i>Thông tin tài khoản</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Loại tài khoản:</strong> ' + edu.util.returnEmpty(data.ACCOUNT_TYPE_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Trạng thái tài khoản:</strong> ' + edu.util.returnEmpty(data.ACCOUNT_STATUS_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Số tài khoản:</strong> <strong class="text-primary">' + edu.util.returnEmpty(data.ACCOUNT_NUMBER) + '</strong></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Tên chủ tài khoản:</strong> ' + edu.util.returnEmpty(data.ACCOUNT_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Loại tiền tệ:</strong> ' + edu.util.returnEmpty(data.ACCOUNT_CURRENCY_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin ngân hàng
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-building me-2"></i>Thông tin ngân hàng</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Tên ngân hàng:</strong> ' + edu.util.returnEmpty(data.BANK_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Mã ngân hàng:</strong> ' + edu.util.returnEmpty(data.BANK_CODE) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Tên chi nhánh:</strong> ' + edu.util.returnEmpty(data.BRANCH_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Mã chi nhánh:</strong> ' + edu.util.returnEmpty(data.BRANCH_CODE) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin bổ sung
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-info-circle me-2"></i>Thông tin bổ sung</h6></div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Tài khoản chính:</strong> ' + (data.IS_PRIMARY == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>TK mặc định chi trả:</strong> ' + (data.IS_PAYROLL_DEFAULT == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Đã xác thực:</strong> ' + (data.IS_VERIFIED == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin hiệu lực
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-calendar me-2"></i>Thông tin hiệu lực</h6></div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Ngày hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_FROM) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Ngày hết hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_TO) + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Hiệu lực:</strong> ' + (data.IS_ACTIVE == 1 ? '<span class="badge bg-success">Có hiệu lực</span>' : '<span class="badge bg-secondary">Hết hiệu lực</span>') + '</div>';
        strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';
        
        strHTML += '</div></div>';
        
        edu.system.alert(strHTML);
    },

    toggle_FormTaiKhoanNH: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormTaiKhoanNH");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE", "dropLoaiTaiKhoan");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_STATUS_CODE", "dropTrangThaiTaiKhoan");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.BANK_ID", "dropNganHang");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_CURRENCY_CODE", "dropLoaiTienTe");
    },

    clearForm_TaiKhoanNH: function () {
        edu.util.viewValById("dropLoaiTaiKhoan", "");
        edu.util.viewValById("dropTrangThaiTaiKhoan", "");
        edu.util.viewValById("dropNganHang", "");
        edu.util.viewValById("txtMaNganHang", "");
        edu.util.viewValById("txtTenNganHang", "");
        edu.util.viewValById("dropChiNhanh", "");
        edu.util.viewValById("txtMaChiNhanh", "");
        edu.util.viewValById("txtTenChiNhanh", "");
        edu.util.viewValById("txtSoTaiKhoan", "");
        edu.util.viewValById("txtTenChuTaiKhoan", "");
        edu.util.viewValById("dropLoaiTienTe", "");
        $("#chkTaiKhoanChinh").prop('checked', false);
        $("#chkTaiKhoanMacDinh").prop('checked', false);
        $("#chkDaXacThuc").prop('checked', false);
        edu.util.viewValById("txtNgayHieuLucTKNH", "");
        edu.util.viewValById("txtNgayHetHieuLucTKNH", "");
        edu.util.viewValById("txtGhiChuTKNH", "");
    },

    loadForm_TaiKhoanNH: function (data) {
        edu.util.viewValById("dropLoaiTaiKhoan", data.ACCOUNT_TYPE_CODE);
        edu.util.viewValById("dropTrangThaiTaiKhoan", data.ACCOUNT_STATUS_CODE);
        edu.util.viewValById("dropNganHang", data.BANK_ID);
        edu.util.viewValById("txtMaNganHang", data.BANK_CODE);
        edu.util.viewValById("txtTenNganHang", data.BANK_NAME);
        
        // Load cascade chi nhánh
        if (data.BANK_ID) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.BRANCH_ID", "dropChiNhanh", "BANK_ID=" + data.BANK_ID, function() {
                edu.util.viewValById("dropChiNhanh", data.BRANCH_ID);
            });
        }
        
        edu.util.viewValById("txtMaChiNhanh", data.BRANCH_CODE);
        edu.util.viewValById("txtTenChiNhanh", data.BRANCH_NAME);
        edu.util.viewValById("txtSoTaiKhoan", data.ACCOUNT_NUMBER);
        edu.util.viewValById("txtTenChuTaiKhoan", data.ACCOUNT_NAME);
        edu.util.viewValById("dropLoaiTienTe", data.ACCOUNT_CURRENCY_CODE);
        $("#chkTaiKhoanChinh").prop('checked', data.IS_PRIMARY == 1);
        $("#chkTaiKhoanMacDinh").prop('checked', data.IS_PAYROLL_DEFAULT == 1);
        $("#chkDaXacThuc").prop('checked', data.IS_VERIFIED == 1);
        edu.util.viewValById("txtNgayHieuLucTKNH", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLucTKNH", data.EFFECTIVE_TO);
        edu.util.viewValById("txtGhiChuTKNH", data.NOTE);
    },

    save_TaiKhoanNH: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropLoaiTaiKhoan")) {
            edu.system.alert("Vui lòng chọn loại tài khoản!");
            return;
        }
        if (!edu.util.getValById("dropNganHang")) {
            edu.system.alert("Vui lòng chọn ngân hàng!");
            return;
        }
        if (!edu.util.getValById("txtSoTaiKhoan")) {
            edu.system.alert("Vui lòng nhập số tài khoản!");
            return;
        }
        if (!edu.util.getValById("txtTenChuTaiKhoan")) {
            edu.system.alert("Vui lòng nhập tên chủ tài khoản!");
            return;
        }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Bank_Account',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strAccount_Type_Code': edu.system.getValById('dropLoaiTaiKhoan'),
            'strAccount_Status_Code': edu.system.getValById('dropTrangThaiTaiKhoan'),
            'strBank_Id': edu.system.getValById('dropNganHang'),
            'strBank_Code': edu.system.getValById('txtMaNganHang'),
            'strBank_Name': edu.system.getValById('txtTenNganHang'),
            'strBranch_Id': edu.system.getValById('dropChiNhanh'),
            'strBranch_Code': edu.system.getValById('txtMaChiNhanh'),
            'strBranch_Name': edu.system.getValById('txtTenChiNhanh'),
            'strAccount_Number': edu.system.getValById('txtSoTaiKhoan'),
            'strAccount_Name': edu.system.getValById('txtTenChuTaiKhoan'),
            'strAccount_Currency_Code': edu.system.getValById('dropLoaiTienTe'),
            'dIs_Primary': $("#chkTaiKhoanChinh").is(':checked') ? 1 : 0,
            'dIs_Payroll_Default': $("#chkTaiKhoanMacDinh").is(':checked') ? 1 : 0,
            'dIs_Verified': $("#chkDaXacThuc").is(':checked') ? 1 : 0,
            'dIs_Active': 1,
            'strEffective_From': edu.system.getValById('txtNgayHieuLucTKNH'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLucTKNH'),
            'strNote': edu.system.getValById('txtGhiChuTKNH'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strTaiKhoanNH_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4DIC8qHgAiIi40LzUP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Bank_Account';
            obj_save.strId = me.strTaiKhoanNH_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strTaiKhoanNH_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_TaiKhoanNH();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    delete_TaiKhoanNH: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4DIC8qHgAiIi40LzUP',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Bank_Account',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_TaiKhoanNH();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_delete.action,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Tab 4: Học vấn
    -------------------------------------------*/
    getList_HocVan: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoNhanSu6_MH/DSA4HhEkMzIuLx4FJDUiLzUoJygkMwPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Education',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHocVan = data.Data || [];
                    me.genTable_HocVan(me.dtHocVan);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_HocVan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocVan",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData, iDisplayIndex) {
                        return iDisplayIndex + 1;
                    }
                },
                {
                    "mDataProp": "EDUCATION_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "EDUCATION_LEVEL_CODE_NAME"
                },
                {
                    "mDataProp": "EDUCATION_STATUS_CODE_NAME"
                },
                {
                    "mDataProp": "DEGREE_TYPE_CODE"
                },
                {
                    "mDataProp": "DEGREE_NAME"
                },
                {
                    "mDataProp": "MAJOR_GROUP_NAME"
                },
                {
                    "mDataProp": "MAJOR_CODE"
                },
                {
                    "mDataProp": "MAJOR_NAME"
                },
                {
                    "mDataProp": "SPECIALIZATION_NAME"
                },
                {
                    "mDataProp": "SPECIALIZATION_CODE"
                },
                {
                    "mDataProp": "SPECIALIZATION_NAME_FULL"
                },
                {
                    "mDataProp": "INSTITUTION_NAME"
                },
                {
                    "mDataProp": "INSTITUTION_CODE"
                },
                {
                    "mDataProp": "INSTITUTION_NAME_FULL"
                },
                {
                    "mDataProp": "COUNTRY_NAME"
                },
                {
                    "mDataProp": "ENROLLMENT_YEAR"
                },
                {
                    "mDataProp": "START_DATE"
                },
                {
                    "mDataProp": "COMPLETION_DATE"
                },
                {
                    "mDataProp": "GRADUATION_YEAR"
                },
                {
                    "mDataProp": "CLASSIFICATION_CODE_NAME"
                },
                {
                    "mDataProp": "GPA"
                },
                {
                    "mDataProp": "DEGREE_ISSUE_DATE"
                },
                {
                    "mDataProp": "EFFECTIVE_FROM"
                },
                {
                    "mDataProp": "EFFECTIVE_TO"
                },
                {
                    "mRender": function (nRow, aData) {
                        if (aData.IS_ACTIVE == 1) {
                            return '<span class="badge bg-success">Có hiệu lực</span>';
                        }
                        return '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                {
                    "mDataProp": "NOTE"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btn-sm btnChiTiet_HocVan" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btn-sm btnEdit_HocVan" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-danger btn-sm btnDelete_HocVan" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    show_ChiTietHocVan: function (data) {
        var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
        strHTML += '<div class="row">';
        strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-graduation-cap me-2"></i>Thông tin chi tiết học vấn</h5></div>';
        
        // Thông tin chung
        strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-info-circle me-2"></i>Thông tin chung</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Loại hình học vấn:</strong> ' + edu.util.returnEmpty(data.EDUCATION_TYPE_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Bậc đào tạo:</strong> ' + edu.util.returnEmpty(data.EDUCATION_LEVEL_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Trạng thái học:</strong> ' + edu.util.returnEmpty(data.EDUCATION_STATUS_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Loại văn bằng:</strong> ' + edu.util.returnEmpty(data.DEGREE_TYPE_CODE) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin ngành học
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-book me-2"></i>Thông tin ngành học</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Nhóm ngành:</strong> ' + edu.util.returnEmpty(data.MAJOR_GROUP_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Mã ngành:</strong> ' + edu.util.returnEmpty(data.MAJOR_CODE) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Tên ngành:</strong> ' + edu.util.returnEmpty(data.MAJOR_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Chuyên ngành:</strong> ' + edu.util.returnEmpty(data.SPECIALIZATION_NAME) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Cơ sở đào tạo
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-university me-2"></i>Cơ sở đào tạo</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Tên cơ sở:</strong> ' + edu.util.returnEmpty(data.INSTITUTION_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Quốc gia:</strong> ' + edu.util.returnEmpty(data.COUNTRY_NAME) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thời gian học tập
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-calendar me-2"></i>Thời gian học tập</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Năm nhập học:</strong> ' + edu.util.returnEmpty(data.ENROLLMENT_YEAR) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Năm tốt nghiệp:</strong> ' + edu.util.returnEmpty(data.GRADUATION_YEAR) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Ngày bắt đầu:</strong> ' + edu.util.returnEmpty(data.START_DATE) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Ngày tốt nghiệp:</strong> ' + edu.util.returnEmpty(data.COMPLETION_DATE) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Kết quả học tập
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-trophy me-2"></i>Kết quả học tập</h6></div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Xếp loại:</strong> ' + edu.util.returnEmpty(data.CLASSIFICATION_CODE_NAME) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>GPA:</strong> ' + edu.util.returnEmpty(data.GPA) + ' / ' + edu.util.returnEmpty(data.GPA_SCALE) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Số hiệu văn bằng:</strong> ' + edu.util.returnEmpty(data.DEGREE_NUMBER) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Ngày cấp VB:</strong> ' + edu.util.returnEmpty(data.DEGREE_ISSUE_DATE) + '</div>';
        strHTML += '<div class="col-md-12"><hr></div>';
        
        // Thông tin khác
        strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-cog me-2"></i>Thông tin khác</h6></div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Trình độ cao nhất:</strong> ' + (data.IS_HIGHEST == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Chuyên môn chính:</strong> ' + (data.IS_PRIMARY_MAJOR == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-4 mb-2"><strong>Được công nhận:</strong> ' + (data.IS_RECOGNIZED == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_FROM) + '</div>';
        strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hết hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_TO) + '</div>';
        strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';
        
        strHTML += '</div></div>';
        
        edu.system.alert(strHTML);
    },

    toggle_FormHocVan: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormHocVan");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_TYPE_CODE", "dropLoaiHinhHocVan");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_LEVEL_CODE", "dropBacDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_STATUS_CODE", "dropTrangThaiHoc");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.MAJOR_ID", "dropNhomNganh");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.SPECIALIZATION_ID", "dropChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.INSTITUTION_ID", "dropCoSoDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.COUNTRY_ID", "dropQuocGiaHV");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.CLASSIFICATION_CODE", "dropXepLoai");
    },

    clearForm_HocVan: function () {
        edu.util.viewValById("dropLoaiHinhHocVan", "");
        edu.util.viewValById("dropBacDaoTao", "");
        edu.util.viewValById("dropTrangThaiHoc", "");
        edu.util.viewValById("txtMaLoaiVanBang", "");
        edu.util.viewValById("txtTenNganHangHV", "");
        edu.util.viewValById("dropNhomNganh", "");
        edu.util.viewValById("dropNganh", "");
        edu.util.viewValById("txtMaNganh", "");
        edu.util.viewValById("txtTenNganh", "");
        edu.util.viewValById("dropChuyenNganh", "");
        edu.util.viewValById("txtMaChuyenNganh", "");
        edu.util.viewValById("txtTenChuyenNganh", "");
        edu.util.viewValById("dropCoSoDaoTao", "");
        edu.util.viewValById("txtMaCoSoDaoTao", "");
        edu.util.viewValById("txtTenCoSoDaoTao", "");
        edu.util.viewValById("dropQuocGiaHV", "");
        edu.util.viewValById("txtNamNhapHoc", "");
        edu.util.viewValById("txtNgayBatDauHoc", "");
        edu.util.viewValById("txtNgayTotNghiep", "");
        edu.util.viewValById("txtNamTotNghiep", "");
        edu.util.viewValById("dropXepLoai", "");
        edu.util.viewValById("txtGPA", "");
        edu.util.viewValById("txtGPAScale", "");
        edu.util.viewValById("txtSoHieuVanBang", "");
        edu.util.viewValById("txtNgayCapVanBang", "");
        $("#chkLaTrinhDoCaoNhat").prop('checked', false);
        $("#chkChuyenMonChinh").prop('checked', false);
        $("#chkDuocCongNhan").prop('checked', false);
        edu.util.viewValById("txtNgayHieuLucHV", "");
        edu.util.viewValById("txtNgayHetHieuLucHV", "");
        $("#chkHieuLucHV").prop('checked', true);
        edu.util.viewValById("txtGhiChuHV", "");
    },

    loadForm_HocVan: function (data) {
        edu.util.viewValById("dropLoaiHinhHocVan", data.EDUCATION_TYPE_CODE);
        edu.util.viewValById("dropBacDaoTao", data.EDUCATION_LEVEL_CODE);
        edu.util.viewValById("dropTrangThaiHoc", data.EDUCATION_STATUS_CODE);
        edu.util.viewValById("txtMaLoaiVanBang", data.DEGREE_TYPE_CODE);
        edu.util.viewValById("txtTenNganHangHV", data.BANK_NAME);
        edu.util.viewValById("dropNhomNganh", data.MAJOR_GROUP_ID);
        
        // Load cascade ngành
        if (data.MAJOR_GROUP_ID) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.MAJOR_ID", "dropNganh", "MAJOR_GROUP_ID=" + data.MAJOR_GROUP_ID, function() {
                edu.util.viewValById("dropNganh", data.MAJOR_ID);
            });
        }
        
        edu.util.viewValById("txtMaNganh", data.MAJOR_CODE);
        edu.util.viewValById("txtTenNganh", data.MAJOR_NAME);
        
        // Load cascade chuyên ngành
        if (data.MAJOR_ID) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.SPECIALIZATION_ID", "dropChuyenNganh", "MAJOR_ID=" + data.MAJOR_ID, function() {
                edu.util.viewValById("dropChuyenNganh", data.SPECIALIZATION_ID);
            });
        }
        
        edu.util.viewValById("txtMaChuyenNganh", data.SPECIALIZATION_CODE);
        edu.util.viewValById("txtTenChuyenNganh", data.SPECIALIZATION_NAME);
        edu.util.viewValById("dropCoSoDaoTao", data.INSTITUTION_ID);
        edu.util.viewValById("txtMaCoSoDaoTao", data.INSTITUTION_CODE);
        edu.util.viewValById("txtTenCoSoDaoTao", data.INSTITUTION_NAME);
        edu.util.viewValById("dropQuocGiaHV", data.COUNTRY_ID);
        edu.util.viewValById("txtNamNhapHoc", data.ENROLLMENT_YEAR);
        edu.util.viewValById("txtNgayBatDauHoc", data.START_DATE);
        edu.util.viewValById("txtNgayTotNghiep", data.COMPLETION_DATE);
        edu.util.viewValById("txtNamTotNghiep", data.GRADUATION_YEAR);
        edu.util.viewValById("dropXepLoai", data.CLASSIFICATION_CODE);
        edu.util.viewValById("txtGPA", data.GPA);
        edu.util.viewValById("txtGPAScale", data.GPA_SCALE);
        edu.util.viewValById("txtSoHieuVanBang", data.DEGREE_NUMBER);
        edu.util.viewValById("txtNgayCapVanBang", data.DEGREE_ISSUE_DATE);
        $("#chkLaTrinhDoCaoNhat").prop('checked', data.IS_HIGHEST == 1);
        $("#chkChuyenMonChinh").prop('checked', data.IS_PRIMARY_MAJOR == 1);
        $("#chkDuocCongNhan").prop('checked', data.IS_RECOGNIZED == 1);
        edu.util.viewValById("txtNgayHieuLucHV", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLucHV", data.EFFECTIVE_TO);
        $("#chkHieuLucHV").prop('checked', data.IS_ACTIVE == 1);
        edu.util.viewValById("txtGhiChuHV", data.NOTE);
    },

    save_HocVan: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropLoaiHinhHocVan")) {
            edu.system.alert("Vui lòng chọn loại hình học vấn!");
            return;
        }
        if (!edu.util.getValById("dropBacDaoTao")) {
            edu.system.alert("Vui lòng chọn bậc đào tạo!");
            return;
        }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4FJDUiLzUoJygkMwPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Education',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strEducation_Type_Code': edu.system.getValById('dropLoaiHinhHocVan'),
            'strEducation_Level_Code': edu.system.getValById('dropBacDaoTao'),
            'strEducation_Status_Code': edu.system.getValById('dropTrangThaiHoc'),
            'strDegree_Type_Code': edu.system.getValById('txtMaLoaiVanBang'),
            'strBank_Name': edu.system.getValById('txtTenNganHangHV'),
            'strMajor_Id': edu.system.getValById('dropNganh'),
            'strMajor_Code': edu.system.getValById('txtMaNganh'),
            'strMajor_Name': edu.system.getValById('txtTenNganh'),
            'strSpecialization_Id': edu.system.getValById('dropChuyenNganh'),
            'strSpecialization_Code': edu.system.getValById('txtMaChuyenNganh'),
            'strSpecialization_Name': edu.system.getValById('txtTenChuyenNganh'),
            'strInstitution_Id': edu.system.getValById('dropCoSoDaoTao'),
            'strInstitution_Code': edu.system.getValById('txtMaCoSoDaoTao'),
            'strInstitution_Name': edu.system.getValById('txtTenCoSoDaoTao'),
            'strCountry_Id': edu.system.getValById('dropQuocGiaHV'),
            'dEnrollment_Year': edu.system.getValById('txtNamNhapHoc'),
            'strStart_Date': edu.system.getValById('txtNgayBatDauHoc'),
            'strCompletion_Date': edu.system.getValById('txtNgayTotNghiep'),
            'dGraduation_Year': edu.system.getValById('txtNamTotNghiep'),
            'strClassification_Code': edu.system.getValById('dropXepLoai'),
            'dGPA': edu.system.getValById('txtGPA'),
            'dGPA_Scale': edu.system.getValById('txtGPAScale'),
            'strDegree_Number': edu.system.getValById('txtSoHieuVanBang'),
            'strDegree_Issue_Date': edu.system.getValById('txtNgayCapVanBang'),
            'dIs_Highest': $("#chkLaTrinhDoCaoNhat").is(':checked') ? 1 : 0,
            'dIs_Primary_Major': $("#chkChuyenMonChinh").is(':checked') ? 1 : 0,
            'dIs_Recognized': $("#chkDuocCongNhan").is(':checked') ? 1 : 0,
            'strEffective_From': edu.system.getValById('txtNgayHieuLucHV'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLucHV'),
            'dIs_Active': $("#chkHieuLucHV").is(':checked') ? 1 : 0,
            'strNote': edu.system.getValById('txtGhiChuHV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strHocVan_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4FJDUiLzUoJygkMwPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Education';
            obj_save.strId = me.strHocVan_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strHocVan_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_HocVan();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    delete_HocVan: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4FJDUiLzUoJygkMwPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Education',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_HocVan();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_delete.action,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    }
}