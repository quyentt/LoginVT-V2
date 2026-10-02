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
    // Cache danh mục Ngành/Nhóm ngành (DMDL PERSON_EDUCATION.MAJOR_ID)
    dtDmMajorAll: [],
    dtDmMajorGroups: [],
    _dmMajorLoaded: false,
    _isLoadingHocVanForm: false,
    _hocVanMajorWanted: '',
    dtDmMajorGroupOnly: [],
    _dmMajorGroupOnlyLoaded: false,
    dtChungChi: [],
    strChungChi_Id: '',
    dtTaiLieu: [],
    strTaiLieu_Id: '',
    dtHocHam: [],
    strHocHam_Id: '',
    _isSyncingGiaDinhName: false,
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
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.GENDER_ID", "dropSearch_GioiTinh");
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "", "", data => me.dtTuyenXe = data);
        //me.getList_DMLKT();
        //$("#modal_sinhvien").modal("show");
        $("#btnSearch").click(function (e) {
            me.genTable_DeXuatHoSo(me.dtDeXuatHoSo, me.dtDeXuatHoSo.length);
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.genTable_DeXuatHoSo(me.dtDeXuatHoSo, me.dtDeXuatHoSo.length);
            }
        });
        
        // Tìm kiếm realtime
        $("#txtSearch").on('input', function () {
            me.genTable_DeXuatHoSo(me.dtDeXuatHoSo, me.dtDeXuatHoSo.length);
        });
        
        $("#dropSearch_GioiTinh").on('change', function () {
            me.genTable_DeXuatHoSo(me.dtDeXuatHoSo, me.dtDeXuatHoSo.length);
        });
        
        // Checkbox chọn tất cả - dùng event delegation
        $(document).on("change", "#checkAll_DeXuatHoSo", function () {
            var isChecked = $(this).prop("checked");
            $("#tblDeXuatHoSo .checkX").prop("checked", isChecked);
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
        
        // Xóa từng dòng
        $("#tblDeXuatHoSo").delegate(".btnDelete_Row", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_DeXuatHoSo(strId);
            });
        });
        
        // Thùng rác
        $("#btnThungRac").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneThungRac");
            me.getList_ThungRac();
        });
        
        $(".btnCloseThungRac").click(function () {
            $("#zoneThungRac").hide();
            $("#zonebatdau").show();
        });
        
        // Checkbox chọn tất cả trong thùng rác
        $(document).on("change", "#checkAll_ThungRac", function () {
            var isChecked = $(this).prop("checked");
            $("#tblThungRac .checkXThungRac").prop("checked", isChecked);
        });
        
        // Khôi phục
        $("#btnKhoiPhuc").click(function () {
            var arrChecked_Id = [];
            $("#tblThungRac .checkXThungRac:checked").each(function () {
                arrChecked_Id.push(this.id.replace("checkXThungRac", ""));
            });
            
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần khôi phục!");
                return;
            }
            
            edu.system.confirm("Bạn có chắc chắn khôi phục dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.restore_DeXuatHoSo(arrChecked_Id[i]);
                }
            });
        });
        
        // Xóa vĩnh viễn
        $("#btnXoaVinhVien").click(function () {
            var arrChecked_Id = [];
            $("#tblThungRac .checkXThungRac:checked").each(function () {
                arrChecked_Id.push(this.id.replace("checkXThungRac", ""));
            });
            
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa!");
                return;
            }
            
            edu.system.confirm("Bạn có chắc chắn xóa vĩnh viễn? Dữ liệu sẽ không thể khôi phục!");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.permanentDelete_DeXuatHoSo(arrChecked_Id[i]);
                }
            });
        });
        
        // Xóa vĩnh viễn từng dòng
        $("#tblThungRac").delegate(".btnDeletePermanent", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa vĩnh viễn? Dữ liệu sẽ không thể khôi phục!");
            $("#btnYes").click(function (e) {
                me.permanentDelete_DeXuatHoSo(strId);
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
        $("#txtDiaChiChiTiet1, #txtDiaChiChiTiet2, #dropPhuong, #dropTinh, #dropQuocGia").on('change input', function () {
            me.genDiaChiDayDu();
        });
        
        // Cascade dropdown
        $("#dropTinh").on('change', function () {
            var strTinh_Id = $(this).val();
            var strTinh_Ma = $("#dropTinh option:selected").attr("name");
            me.loadTinhThanh_PhuongXa(strTinh_Id, strTinh_Ma);
        });

        // Tab 2: Gia đình
        $("#btnAdd_GiaDinh").click(function () {
            me.strGiaDinh_Id = "";
            me.toggle_FormGiaDinh();
            $("#lblTitleGiaDinh").text("Thêm thành viên gia đình");
            me.clearForm_GiaDinh();
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
        function normalizeFullName(raw) {
            return (raw || '').toString().replace(/\s+/g, ' ').trim();
        }

        function splitFullNameToParts(fullName) {
            var normalized = normalizeFullName(fullName);
            if (!normalized) return null;
            var parts = normalized.split(' ').filter(Boolean);
            if (parts.length < 2) return null;
            var lastName = parts[0];
            var firstName = parts[parts.length - 1];
            var middleName = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
            return {
                fullName: normalized,
                lastName: lastName,
                middleName: middleName,
                firstName: firstName
            };
        }

        $("#txtHoGD, #txtTenDemGD, #txtTenGD").on('input', function () {
            if (me._isSyncingGiaDinhName) return;
            var strHo = edu.util.getValById("txtHoGD");
            var strTenDem = edu.util.getValById("txtTenDemGD");
            var strTen = edu.util.getValById("txtTenGD");
            $("#txtHoTenDayDuGD").val(normalizeFullName((strHo + " " + strTenDem + " " + strTen)));
        });

        function applyFullNameToPartsAndFocus() {
            if (me._isSyncingGiaDinhName) return;
            var raw = $("#txtHoTenDayDuGD").val();
            var parsed = splitFullNameToParts(raw);
            if (!parsed) return;

            me._isSyncingGiaDinhName = true;
            try {
                // Chỉ auto-fill khi đúng định dạng có >= 2 từ
                edu.util.viewValById("txtHoGD", parsed.lastName);
                edu.util.viewValById("txtTenDemGD", parsed.middleName);
                edu.util.viewValById("txtTenGD", parsed.firstName);
                $("#txtHoTenDayDuGD").val(parsed.fullName);
            } finally {
                me._isSyncingGiaDinhName = false;
            }

            // Tự nhảy xuống ô tiếp theo để người dùng chỉnh
            if (parsed.middleName) {
                $("#txtTenDemGD").focus();
            } else {
                $("#txtTenGD").focus();
            }
        }

        // Khi nhập họ tên đầy đủ -> tự tách xuống Họ/Tên đệm/Tên
        $("#txtHoTenDayDuGD").on('blur', function () {
            applyFullNameToPartsAndFocus();
        });
        $("#txtHoTenDayDuGD").on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                applyFullNameToPartsAndFocus();
            }
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
            // Tránh bị bind chồng nhiều lần khi xóa liên tiếp
            $("#btnYes").off("click").on("click", function () {
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
            var opt = $(this).find('option:selected');
            // Fill bank code/name from selected option
            edu.util.viewValById("txtMaNganHang", opt.attr('name') || "");
            edu.util.viewValById("txtTenNganHang", (strNganHang_Id ? (opt.text() || "") : ""));

            // Khi đang load dữ liệu form Sửa (set value programmatically) thì không chạy cascade để tránh bị clear sai
            if (me.isLoadingFormTaiKhoanNH === true) {
                return;
            }

            // Clear branch fields when bank changes
            edu.util.viewValById("dropChiNhanh", "");
            edu.util.viewValById("txtMaChiNhanh", "");
            edu.util.viewValById("txtTenChiNhanh", "");

            if (strNganHang_Id) {
                me.loadChiNhanh_ByNganHang(strNganHang_Id, "", "", "");
            }
        });

        $("#dropChiNhanh").on('change', function () {
            var branchId = $(this).val();
            var opt = $(this).find('option:selected');
            edu.util.viewValById("txtMaChiNhanh", opt.attr('name') || "");
            edu.util.viewValById("txtTenChiNhanh", (branchId ? (opt.text() || "") : ""));
        });

        // Tab 4: Học vấn
        $("#btnAdd_HocVan").click(function () {
            me.strHocVan_Id = "";
            me.toggle_FormHocVan();
            $("#lblTitleHocVan").text("Thêm học vấn");
            me.loadDanhMuc_HocVan();
            me.clearForm_HocVan();
        });
        
        $("#tblHocVan").delegate(".btnEdit_HocVan", "click", function () {
            var strId = this.id;
            me.strHocVan_Id = strId;
            me.toggle_FormHocVan();
            $("#lblTitleHocVan").text("Sửa học vấn");
            var data = me.dtHocVan.find(e => e.ID == strId);
            if (data) {
                // Quay lại như flow cũ: dùng dữ liệu ngay trên dòng (list) để fill form,
                // tránh phụ thuộc API Get_Person_Education_By_Id (hiện trả DUMMY).
                me.loadForm_HocVan(data);
            }
            else {
                edu.system.alert("Không tìm thấy dữ liệu học vấn để sửa!");
            }
        });
        
        $("#tblHocVan").delegate(".btnDelete_HocVan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa học vấn này không?");
            // Tránh bị bind chồng nhiều lần khi xóa liên tiếp
            $("#btnYes").off("click").on("click", function () {
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
        // Lưu ý: Mã/Tên ngành do người dùng tự nhập (không auto-fill).
        $("#dropNhomNganh").on('change', function () {
            var strNhomNganh_Id = $(this).val();
            var isSync = (me._isLoadingHocVanForm === true);

            // Khi đang sync form sửa: nếu value rỗng thì bỏ qua để tránh clear nhầm
            if (isSync && !strNhomNganh_Id) {
                me._isLoadingHocVanForm = false;
                me._hocVanMajorWanted = '';
                return;
            }

            var majorWanted = isSync ? (me._hocVanMajorWanted || '') : '';

            // Render ngành theo nhóm (client-side) dựa trên QUANHECHA_ID
            me.fillCombo_Nganh_ByNhom(strNhomNganh_Id, majorWanted);

            // Fallback legacy: nếu danh mục không có quan hệ cha-con theo QUANHECHA_ID
            // thì dropdown Ngành sẽ trống -> load toàn bộ ngành như trước để người dùng vẫn chọn được.
            if ($("#dropNganh option").length <= 1) {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.MAJOR_ID", "dropNganh", "", function () {
                    // Loại bỏ các node "Nhóm ngành" khỏi dropdown Ngành để tránh chọn nhầm
                    me.removeMajorGroupOptionsFromSelect('dropNganh');
                    if (isSync && (majorWanted + '').trim()) {
                        // Try set by value (ID) then by option[name] (MA/code)
                        $("#dropNganh").val(majorWanted).trigger('change');
                        if (!$("#dropNganh").val()) {
                            var opt = $("#dropNganh option").filter(function () {
                                return (($(this).attr('name') || '').trim() === (majorWanted + '').trim());
                            }).first();
                            if (opt && opt.length) {
                                $("#dropNganh").val(opt.val()).trigger('change');
                            }
                        }
                    }

                    // Kết thúc sync sau khi combo ngành đã sẵn sàng
                    if (isSync) {
                        me._isLoadingHocVanForm = false;
                        me._hocVanMajorWanted = '';
                    }
                });
            }
            else {
                // Kết thúc sync (nếu có) khi đã render xong ngành theo nhóm
                if (isSync) {
                    me._isLoadingHocVanForm = false;
                    me._hocVanMajorWanted = '';
                }
            }

            // Chỉ clear chuyên ngành khi người dùng đổi nhóm ngành thật sự (không phải sync khi sửa)
            if (!isSync) {
                edu.util.viewValById("dropChuyenNganh", "");
                edu.util.viewValById("txtMaChuyenNganh", "");
                edu.util.viewValById("txtTenChuyenNganh", "");
            }
        });
        
        $("#dropNganh").on('change', function () {
            // Auto-fill Mã/Tên ngành để tránh trường hợp người dùng chỉ chọn dropdown nhưng không nhập ô text
            // -> khi Thêm mới sẽ lưu rỗng và bảng không hiển thị.
            var majorId = $(this).val();
            var opt = $(this).find('option:selected');
            edu.util.viewValById("txtMaNganh", opt.attr('name') || "");
            edu.util.viewValById("txtTenNganh", (majorId ? (opt.text() || "") : ""));

            // Khi đổi ngành, reset chuyên ngành (chưa cascade server-side ở đây)
            edu.util.viewValById("dropChuyenNganh", "");
            edu.util.viewValById("txtMaChuyenNganh", "");
            edu.util.viewValById("txtTenChuyenNganh", "");
        });

        // Auto-fill chuyên ngành
        $("#dropChuyenNganh").on('change', function () {
            var specializationId = $(this).val();
            var opt = $(this).find('option:selected');
            edu.util.viewValById("txtMaChuyenNganh", opt.attr('name') || "");
            edu.util.viewValById("txtTenChuyenNganh", (specializationId ? (opt.text() || "") : ""));
        });

        // Auto-fill cơ sở đào tạo
        $("#dropCoSoDaoTao").on('change', function () {
            var institutionId = $(this).val();
            var opt = $(this).find('option:selected');
            edu.util.viewValById("txtMaCoSoDaoTao", opt.attr('name') || "");
            edu.util.viewValById("txtTenCoSoDaoTao", (institutionId ? (opt.text() || "") : ""));
        });

        // Tab 5: Chứng chỉ
        $("#btnAdd_ChungChi").click(function () {
            me.strChungChi_Id = "";
            me.toggle_FormChungChi();
            $("#lblTitleChungChi").text("Thêm chứng chỉ");
            me.clearForm_ChungChi();
        });
        
        $("#tblChungChi").delegate(".btnEdit_ChungChi", "click", function () {
            var strId = this.id;
            me.strChungChi_Id = strId;

            // Dùng dữ liệu từ list cache thay vì gọi API Get_Person_Certificate_By_Id
            // vì API đó hiện trả DUMMY (chưa implement ở backend).
            var data = me.dtChungChi.find(function (e) { return e.ID == strId; });
            if (data) {
                // Chỉ chuyển zone, không gọi toggle_FormChungChi() để tránh race condition
                // (toggle load combo không callback → về sau ghi đè value vừa set).
                edu.util.toggle_overide("zone-bus", "zoneFormChungChi");
                $("#lblTitleChungChi").text("Sửa chứng chỉ");
                me.loadForm_ChungChi(data);
            } else {
                edu.system.alert("Không tìm thấy dữ liệu chứng chỉ để sửa!");
            }
        });

        $("#tblChungChi").delegate(".btnDelete_ChungChi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa chứng chỉ này không?");
            // Tránh bị bind chồng nhiều lần khi xóa liên tiếp
            $("#btnYes").off("click").on("click", function () {
                me.delete_ChungChi(strId);
            });
        });
        
        $(".btnCloseChungChi").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_ChungChi").click(function () {
            me.save_ChungChi();
        });
        
        // Tab 6: Tài liệu
        $("#btnAdd_TaiLieu").click(function () {
            me.clearForm_TaiLieu();
            me.strTaiLieu_Id = "";
            me.toggle_FormTaiLieu();
            $("#lblTitleTaiLieu").text("Thêm tài liệu");
        });
        
        $("#tblTaiLieu").delegate(".btnEdit_TaiLieu", "click", function () {
            var strId = this.id;
            me.strTaiLieu_Id = strId;
            
            // Gọi API lấy chi tiết để load vào form
            var obj_detail = {
                'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4FLiI0LCQvNR4DOB4IJQPP',
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Document_By_Id',
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strId': strId,
                'strNguoiThucHien_Id': edu.system.userId,
            };

            edu.system.makeRequest({
                success: function (response) {
                    if (response.Success && response.Data && response.Data.length > 0) {
                        var data = response.Data[0];
                        me.toggle_FormTaiLieu();
                        $("#lblTitleTaiLieu").text("Sửa tài liệu");
                        me.loadForm_TaiLieu(data);
                    }
                    else {
                        edu.system.alert("Không tìm thấy thông tin chi tiết!");
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
                },
                type: 'POST',
                contentType: true,
                action: obj_detail.action,
                data: obj_detail,
                fakedb: []
            }, false, false, false, null);
        });
        
        $("#tblTaiLieu").delegate(".btnDelete_TaiLieu", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa tài liệu này không?");
            $("#btnYes").click(function (e) {
                me.delete_TaiLieu(strId);
            });
        });
        
        $(".btnCloseTaiLieu").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_TaiLieu").click(function () {
            me.save_TaiLieu();
        });
        
        // Tab 7: Học hàm
        $("#btnAdd_HocHam").click(function () {
            me.clearForm_HocHam();
            me.strHocHam_Id = "";
            me.toggle_FormHocHam();
            $("#lblTitleHocHam").text("Thêm học hàm");
        });
        
        $("#tblHocHam").delegate(".btnEdit_HocHam", "click", function () {
            var strId = this.id;
            me.strHocHam_Id = strId;
            
            // Gọi API lấy chi tiết để load vào form
            var obj_detail = {
                'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8qHgM4Hggl',
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Academic_Rank_By_Id',
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strId': strId,
                'strNguoiThucHien_Id': edu.system.userId,
            };

            edu.system.makeRequest({
                success: function (response) {
                    if (response.Success && response.Data && response.Data.length > 0) {
                        var data = response.Data[0];
                        me.toggle_FormHocHam();
                        $("#lblTitleHocHam").text("Sửa học hàm");
                        me.loadForm_HocHam(data);
                    }
                    else {
                        edu.system.alert("Không tìm thấy thông tin chi tiết!");
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
                },
                type: 'POST',
                contentType: true,
                action: obj_detail.action,
                data: obj_detail,
                fakedb: []
            }, false, false, false, null);
        });
        
        $("#tblHocHam").delegate(".btnDelete_HocHam", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn xóa học hàm này không?");
            // Tránh bị bind chồng nhiều lần khi xóa liên tiếp
            $("#btnYes").off("click").on("click", function () {
                me.delete_HocHam(strId);
            });
        });
        
        $(".btnCloseHocHam").click(function () {
            me.toggle_ChiTietHoSo();
        });
        
        $("#btnSave_HocHam").click(function () {
            me.save_HocHam();
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
        
        // Hiển thị tên người được chọn
        var selectedPerson = this.dtDeXuatHoSo.find(e => e.ID == this.strDeXuatHoSo_Id);
        if (selectedPerson) {
            $("#lblTenNguoiDuocChon").text(selectedPerson.FULL_NAME || "");
        }
        
        // Load dữ liệu địa chỉ cho Tab 1
        this.getList_DiaChi();
        // Load dữ liệu gia đình cho Tab 2
        this.getList_GiaDinh();
        // Load dữ liệu tài khoản ngân hàng cho Tab 3
        this.getList_TaiKhoanNH();
        // Load dữ liệu học vấn cho Tab 4
        this.getList_HocVan();
        // Load dữ liệu chứng chỉ cho Tab 5
        this.getList_ChungChi();
        // Load dữ liệu tài liệu cho Tab 6
        this.getList_TaiLieu();
        // Load dữ liệu học hàm cho Tab 7
        this.getList_HocHam();
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
                    var dtReRult = data.Data || [];
                    
                    // Đếm số người đã xóa để hiển thị badge
                    var countDeleted = 0;
                    if (dtReRult && dtReRult.length > 0) {
                        countDeleted = dtReRult.filter(function(item) {
                            return item.IS_ACTIVE == 0;
                        }).length;
                        
                        // Lọc chỉ lấy người chưa bị xóa (IS_ACTIVE = 1)
                        dtReRult = dtReRult.filter(function(item) {
                            return item.IS_ACTIVE == 1;
                        });
                    }
                    
                    // Cập nhật badge thùng rác
                    if (countDeleted > 0) {
                        $("#badgeThungRac").text(countDeleted).show();
                    } else {
                        $("#badgeThungRac").hide();
                    }
                    
                    me.dtDeXuatHoSo = dtReRult;
                    me.genTable_DeXuatHoSo(dtReRult, dtReRult.length);
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
        me.dtDeXuatHoSo = data || [];
        
        // Lọc theo từ khóa tìm kiếm
        var strSearch = $("#txtSearch").val().toLowerCase().trim();
        var strGioiTinh = $("#dropSearch_GioiTinh").val();
        
        var filteredData = me.dtDeXuatHoSo;
        
        if (strSearch) {
            filteredData = filteredData.filter(function(item) {
                var fullName = (item.FULL_NAME || '').toLowerCase();
                var dateOfBirth = (item.DATE_OF_BIRTH || '').toLowerCase();
                var employeeCode = (item.CURRENT_EMPLOYEE_CODE || '').toLowerCase();
                return fullName.indexOf(strSearch) >= 0 || 
                       dateOfBirth.indexOf(strSearch) >= 0 || 
                       employeeCode.indexOf(strSearch) >= 0;
            });
        }
        
        if (strGioiTinh) {
            filteredData = filteredData.filter(function(item) {
                return item.GENDER_ID == strGioiTinh;
            });
        }
        
        var htmlBody = '';
        
        if (filteredData.length > 0) {
            for (var i = 0; i < filteredData.length; i++) {
                var item = filteredData[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (item.CURRENT_EMPLOYEE_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.FULL_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.DATE_OF_BIRTH || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.GENDER_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.PROFILE_STATUS_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">';
                htmlBody += '<a class="btn btn-primary btn-sm btnXemChiTiet" id="' + item.ID + '" title="Xem chi tiết">';
                htmlBody += '<i class="fa fa-eye me-1"></i>Xem chi tiết</a>';
                htmlBody += '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Không hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td class="text-center">' + (item.CREATED_AT_DD_MM_YYYY_HHMMSS || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.CREATED_BY_TAIKHOAN || '') + '</td>';
                htmlBody += '<td class="text-center">';
                htmlBody += '<a class="btn btn-default btn-sm btnEdit" id="' + item.ID + '" title="Sửa">';
                htmlBody += '<i class="fa fa-edit color-active"></i></a>';
                htmlBody += '</td>';
                htmlBody += '<td class="text-center">';
                htmlBody += '<a class="btn btn-danger btn-sm btnDelete_Row" id="' + item.ID + '" title="Xóa">';
                htmlBody += '<i class="fa fa-trash"></i></a>';
                htmlBody += '</td>';
                htmlBody += '<td class="text-center">';
                htmlBody += '<input type="checkbox" class="checkX" id="checkX' + item.ID + '" />';
                htmlBody += '</td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="13" class="text-center" style="padding: 40px;">';
            htmlBody += '<i class="fa-solid fa-inbox fa-3x"></i>';
            htmlBody += '<div>Không tìm thấy dữ liệu</div>';
            htmlBody += '</td></tr>';
        }
        
        $("#tblDeXuatHoSo tbody").html(htmlBody);
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

    /*-------------------------------------------
    --Danh mục Tỉnh/Quận/Phường (CHUN.DMTT2)
    --Gắn cho combo: dropTinh -> dropPhuong
    -------------------------------------------*/
    dtDMTT2: null,
    dtDMTT2_TopLevel: null,
    strDMTT2_CountryId: null,

    ensureDMTT2Loaded: function (callback) {
        var me = this;
        if (me.dtDMTT2 && me.dtDMTT2.length > 0) {
            if (typeof callback === "function") callback(me.dtDMTT2);
            return;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDMTT2 = data.Data || [];
                    me.dtDMTT2_TopLevel = me.getDMTT2TopLevel(me.dtDMTT2);
                    me.strDMTT2_CountryId = me.detectDMTT2CountryId(me.dtDMTT2, me.dtDMTT2_TopLevel);
                    if (typeof callback === "function") callback(me.dtDMTT2);
                } else {
                    edu.system.alert("CHUN.DMTT2: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("CHUN.DMTT2 (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            contentType: true,
            data: {
                'strMaBangDanhMuc': 'CHUN.DMTT2',
                'strTieuChiSapXep': '',
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    getDMTT2TopLevel: function (data) {
        // Top-level = node không có cha, hoặc cha không nằm trong dataset.
        if (!data || data.length === 0) return [];
        var idSet = {};
        for (var i = 0; i < data.length; i++) {
            idSet[data[i].ID] = true;
        }
        return data.filter(function (x) {
            return !x.QUANHECHA_ID || !idSet[x.QUANHECHA_ID];
        });
    },

    looksLikeWardName: function (name) {
        if (!name) return false;
        name = ("" + name).trim().toLowerCase();
        return name.indexOf("phường") === 0 || name.indexOf("xã") === 0 || name.indexOf("thị trấn") === 0;
    },

    looksLikeProvinceName: function (name) {
        if (!name) return false;
        name = ("" + name).trim().toLowerCase();
        // Nhiều tỉnh/thành có tiền tố Tỉnh/Thành phố, nhưng không phải luôn luôn.
        // Dùng heuristic nhẹ để nhận biết country node (con của nó thường là tỉnh/thành).
        return name.indexOf("tỉnh") === 0 || name.indexOf("thành phố") === 0;
    },

    getDMTT2NodeById: function (id) {
        var me = this;
        if (!me.dtDMTT2 || me.dtDMTT2.length === 0 || !id) return null;
        for (var i = 0; i < me.dtDMTT2.length; i++) {
            if (me.dtDMTT2[i].ID == id) return me.dtDMTT2[i];
        }
        return null;
    },

    getDMTT2ByParentKeys: function (parentKeys) {
        var me = this;
        if (!me.dtDMTT2 || me.dtDMTT2.length === 0 || !parentKeys || parentKeys.length === 0) return [];

        var keySet = {};
        parentKeys.forEach(function (k) {
            if (k !== undefined && k !== null && ("" + k).trim() !== "") {
                keySet[("" + k).trim()] = true;
            }
        });
        var keys = Object.keys(keySet);
        if (keys.length === 0) return [];

        return me.dtDMTT2.filter(function (x) {
            var p = x.QUANHECHA_ID;
            // fallback theo các cột THONGTIN phổ biến (nếu DMTT2 lưu quan hệ ở đây)
            var t1 = x.THONGTIN1;
            var t2 = x.THONGTIN2;
            var t3 = x.THONGTIN3;
            var t4 = x.THONGTIN4;
            return (p && keySet[("" + p).trim()]) ||
                   (t1 && keySet[("" + t1).trim()]) ||
                   (t2 && keySet[("" + t2).trim()]) ||
                   (t3 && keySet[("" + t3).trim()]) ||
                   (t4 && keySet[("" + t4).trim()]);
        });
    },

    detectDMTT2CountryId: function (data, topLevel) {
        // Nếu có node cấp quốc gia (VD "Việt Nam"), thì con của nó sẽ là tỉnh/thành.
        // Nếu không có, sẽ trả null để dùng trực tiếp topLevel làm tỉnh.
        var me = this;
        if (!data || data.length === 0 || !topLevel || topLevel.length === 0) return null;

        // Ưu tiên tìm theo tên.
        var vietnam = topLevel.find(function (x) {
            var n = (x.TEN || "").toLowerCase().trim();
            return n === "việt nam" || n === "viet nam";
        });
        if (vietnam) return vietnam.ID;

        // Heuristic: chọn top-level nào mà children của nó "trông giống" tỉnh/thành nhiều hơn phường/xã.
        var bestId = null;
        var bestScore = 0;
        for (var i = 0; i < topLevel.length; i++) {
            var cand = topLevel[i];
            var children = me.getDMTT2Children(cand.ID);
            if (!children || children.length === 0) continue;

            var provinceLike = 0;
            var wardLike = 0;
            for (var j = 0; j < Math.min(children.length, 30); j++) {
                var childName = children[j].TEN;
                if (me.looksLikeProvinceName(childName)) provinceLike++;
                if (me.looksLikeWardName(childName)) wardLike++;
            }
            var score = provinceLike - wardLike;
            if (score > bestScore) {
                bestScore = score;
                bestId = cand.ID;
            }
        }

        // Chỉ nhận nếu có tín hiệu rõ (score > 0)
        return bestScore > 0 ? bestId : null;
    },

    getDMTT2Children: function (parentId) {
        var me = this;
        if (!me.dtDMTT2 || me.dtDMTT2.length === 0) return [];
        if (!parentId) return [];
        return me.dtDMTT2.filter(function (x) {
            return x.QUANHECHA_ID == parentId;
        });
    },

    loadTinhThanh: function (selectedTinhId) {
        var me = this;
        me.ensureDMTT2Loaded(function () {
            // Reset cascade
            edu.util.viewValById("dropPhuong", "");

            var dataTinh = [];
            if (me.strDMTT2_CountryId) {
                dataTinh = me.getDMTT2Children(me.strDMTT2_CountryId);
            } else {
                // Không có country node => top-level chính là tỉnh/thành
                dataTinh = me.dtDMTT2_TopLevel || [];
            }

            edu.system.loadToCombo_data({
                data: dataTinh,
                renderPlace: ["dropTinh"],
                type: "",
                title: "-- Chọn tỉnh/thành phố --"
            });

            if (selectedTinhId) {
                edu.util.viewValById("dropTinh", selectedTinhId);
            }
        });
    },

    loadTinhThanh_PhuongXa: function (tinhId, tinhMa, selectedPhuongId) {
        var me = this;
        me.ensureDMTT2Loaded(function () {
            var dataPhuong = [];

            if (tinhId) {
                // Case chuẩn: con theo QUANHECHA_ID = ID tỉnh
                dataPhuong = me.getDMTT2Children(tinhId);
            }

            if ((!dataPhuong || dataPhuong.length === 0) && (tinhId || tinhMa)) {
                // Fallback: một số dataset lưu quan hệ theo MA hoặc THONGTIN*
                var nodeTinh = me.getDMTT2NodeById(tinhId);
                var ma = tinhMa || (nodeTinh ? nodeTinh.MA : null);
                dataPhuong = me.getDMTT2ByParentKeys([tinhId, ma]);
            }

            // Nếu children có lẫn cấp khác, ưu tiên lọc phường/xã/thị trấn
            if (dataPhuong && dataPhuong.length > 0) {
                var onlyWard = dataPhuong.filter(function (x) { return me.looksLikeWardName(x.TEN); });
                if (onlyWard.length > 0) dataPhuong = onlyWard;
            }

            edu.system.loadToCombo_data({
                data: dataPhuong,
                renderPlace: ["dropPhuong"],
                type: "",
                title: "-- Chọn phường/xã --"
            });

            if (selectedPhuongId) edu.util.viewValById("dropPhuong", selectedPhuongId);
        });
    },

    ensureDiaChiDanhMucLoaded: function (callback) {
        var me = this;

        var loadDm = function (strCode, assignProp, next) {
            if (me[assignProp] && me[assignProp].length > 0) {
                next();
                return;
            }

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        me[assignProp] = data.Data || [];
                    } else {
                        me[assignProp] = [];
                    }
                    next();
                },
                error: function () {
                    me[assignProp] = [];
                    next();
                },
                type: 'GET',
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                contentType: true,
                data: {
                    'strMaBangDanhMuc': strCode,
                    'strTieuChiSapXep': '',
                    'dTrangThai': 1
                },
                fakedb: []
            }, false, false, false, null);
        };

        loadDm('PERSON_ADDRESS.ADDRESS_TYPE_CODE', 'dtDM_AddressType', function () {
            loadDm('PERSON_ADDRESS.COUNTRY_ID', 'dtDM_Country', function () {
                if (typeof callback === 'function') callback();
            });
        });
    },

    getDmTenById: function (dt, id) {
        if (!dt || dt.length === 0 || !id) return '';
        var found = dt.find(function (x) { return x && x.ID == id; });
        return found ? (found.TEN || '') : '';
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
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function(item) {
                            var okPerson = item.PERSON_ID == me.strDeXuatHoSo_Id;
                            // Xóa thành công thường là set IS_ACTIVE = 0 (soft delete) -> ẩn khỏi danh sách
                            var okActive = (item.IS_ACTIVE === undefined) || (item.IS_ACTIVE == 1);
                            return okPerson && okActive;
                        });
                    }

                    me["dtDiaChi"] = dtReRult;
                    me.ensureDiaChiDanhMucLoaded(function () {
                        me.genTable_DiaChi(dtReRult, data.Pager);
                    });
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
        me.dtDiaChi = data || [];
        
        var htmlBody = '';
        
        if (me.dtDiaChi.length > 0) {
            for (var i = 0; i < me.dtDiaChi.length; i++) {
                var item = me.dtDiaChi[i];
                var stt = i + 1;

                var addressTypeName = (item.ADDRESS_TYPE_NAME || '')
                    || (item.ADDRESS_TYPE_CODE_NAME || '')
                    || me.getDmTenById(me.dtDM_AddressType, item.ADDRESS_TYPE_CODE);

                var countryIdOrCode = item.COUNTRY_ID || item.COUNTRY_CODE || item.COUNTRY || item.COUNTRYID;
                var countryName = (item.COUNTRY_NAME || '')
                    || (item.COUNTRY_ID_NAME || '')
                    || (item.COUNTRY_CODE_NAME || '')
                    || (typeof item.COUNTRY === 'string' ? item.COUNTRY : '');
                if (!countryName && countryIdOrCode) {
                    countryName = me.getDmTenById(me.dtDM_Country, countryIdOrCode);
                }

                if (edu.system && edu.system.iShk && i === 0) {
                    console.log('DiaChi first row sample:', item);
                    console.log('DiaChi computed country:', { countryIdOrCode: countryIdOrCode, countryName: countryName });
                }
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (addressTypeName || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.ADDRESS_STATUS_CODE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (countryName || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.PROVINCE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.WARD_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.ADDRESS_LINE1 || '') + '</td>';
                htmlBody += '<td>' + (item.ADDRESS_LINE2 || '') + '</td>';
                htmlBody += '<td>' + (item.FULL_ADDRESS || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.POSTAL_CODE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_PRIMARY == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_FROM || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_TO || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_DiaChi" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_DiaChi" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="17" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblDiaChi tbody").html(htmlBody);
    },

    toggle_FormDiaChi: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormDiaChi");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.ADDRESS_TYPE_CODE", "dropLoaiDiaChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.ADDRESS_STATUS_CODE", "dropTrangThaiDiaChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.COUNTRY_ID", "dropQuocGia");

        // Gắn danh mục Tỉnh/Quận/Phường theo CHUN.DMTT2
        me.loadTinhThanh();
    },

    clearForm_DiaChi: function () {
        edu.util.viewValById("dropLoaiDiaChi", "");
        edu.util.viewValById("dropTrangThaiDiaChi", "");
        edu.util.viewValById("dropQuocGia", "");
        edu.util.viewValById("dropTinh", "");
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
        var addressTypeCode = data.ADDRESS_TYPE_CODE || data.ADDRESS_TYPE || data.ADDRESS_TYPE_ID;
        var addressStatusCode = data.ADDRESS_STATUS_CODE || data.ADDRESS_STATUS || data.ADDRESS_STATUS_ID;
        var countryIdOrCode = data.COUNTRY_ID || data.COUNTRY_CODE || data.COUNTRY || data.COUNTRYID;

        // Combo danh mục load async -> set value trong callback để không bị lệch khi mở form Sửa
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.ADDRESS_TYPE_CODE", "dropLoaiDiaChi", "", function () {
            edu.util.viewValById("dropLoaiDiaChi", addressTypeCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.ADDRESS_STATUS_CODE", "dropTrangThaiDiaChi", "", function () {
            edu.util.viewValById("dropTrangThaiDiaChi", addressStatusCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.COUNTRY_ID", "dropQuocGia", "", function () {
            edu.util.viewValById("dropQuocGia", countryIdOrCode || "");
        });

        // Load cascade theo CHUN.DMTT2
        var me = this;
        me.loadTinhThanh(data.PROVINCE_ID);
        me.loadTinhThanh_PhuongXa(data.PROVINCE_ID, null, data.WARD_ID);
        
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
        var strTinh = $("#dropTinh option:selected").text();
        var strQuocGia = $("#dropQuocGia option:selected").text();
        
        if (strDC1) arrDiaChi.push(strDC1);
        if (strDC2) arrDiaChi.push(strDC2);
        if (strPhuong && strPhuong != "-- Chọn --") arrDiaChi.push(strPhuong);
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
        
        var newId = (me.strDiaChi_Id || edu.util.uuid());
        if (newId) newId = (newId + '').toUpperCase();

        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Address',
            'iM': edu.system.iM,
            'Id': newId,
            'strId': newId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strAddress_Type_Code': edu.system.getValById('dropLoaiDiaChi'),
            'strAddress_Status_Code': edu.system.getValById('dropTrangThaiDiaChi'),
            'strCountry_Id': edu.system.getValById('dropQuocGia'),
            'strProvince_Id': edu.system.getValById('dropTinh'),
            'strDistrict_Id': '',
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
            'strNote': edu.util.returnEmpty(edu.system.getValById('txtGhiChuDiaChi')),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strDiaChi_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Address';
            obj_save.Id = (me.strDiaChi_Id + '').toUpperCase();
            obj_save.strId = (me.strDiaChi_Id + '').toUpperCase();
        }

        if (edu.system && edu.system.iShk) {
            console.log('save_DiaChi payload (pre-encrypt):', obj_save);
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
                    // Update UI ngay (tránh cảm giác "xóa rồi mà vẫn còn")
                    if (me.dtDiaChi && me.dtDiaChi.length > 0) {
                        me.dtDiaChi = me.dtDiaChi.filter(function (x) { return x && x.ID != strId; });
                        me.genTable_DiaChi(me.dtDiaChi, null);
                    }
                    // Đồng bộ lại từ server
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
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function(item) {
                            var okPerson = item.PERSON_ID == me.strDeXuatHoSo_Id;
                            // Xóa thành công thường là set IS_ACTIVE = 0 (soft delete) -> ẩn khỏi danh sách
                            var okActive = (item.IS_ACTIVE === undefined) || (item.IS_ACTIVE == 1);
                            return okPerson && okActive;
                        });
                    }
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
        me.dtGiaDinh = data || [];
        
        var htmlBody = '';
        
        if (me.dtGiaDinh.length > 0) {
            for (var i = 0; i < me.dtGiaDinh.length; i++) {
                var item = me.dtGiaDinh[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (item.RELATION_TYPE_CODE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.RELATION_STATUS_CODE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.FULL_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.LAST_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.MIDDLE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.FIRST_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.GENDER_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.DOB_PRECISION_LEVEL_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.DATE_OF_BIRTH || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.BIRTH_DAY || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.BIRTH_MONTH || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.BIRTH_YEAR || '') + '</td>';
                htmlBody += '<td>' + (item.OCCUPATION || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_FROM || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_TO || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_GiaDinh" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_GiaDinh" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="20" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblGiaDinh tbody").html(htmlBody);
    },

    toggle_FormGiaDinh: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormGiaDinh");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.RELATION_TYPE_CODE", "dropLoaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.RELATION_STATUS_CODE", "dropTrangThaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.GENDER_ID", "dropGioiTinhGD");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.DOB_PRECISION_LEVEL", "dropMucDoNgaySinhGD");
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
        function setSelectFlex(selectId, desired) {
            if (!desired) {
                edu.util.viewValById(selectId, "");
                return;
            }

            // Try set by value (usually ID)
            edu.util.viewValById(selectId, desired);
            if ($("#" + selectId).val() == desired) return;

            // Fallback: backend may return MA/code stored in option[name]
            var $optByName = $("#" + selectId + " option[name='" + desired + "']");
            if ($optByName && $optByName.length > 0) {
                $("#" + selectId)
                    .val($optByName.val())
                    .trigger('change')
                    .trigger({ type: 'select2:select' });
            }
        }

        // Combo loại quan hệ / trạng thái quan hệ load async -> set lại sau khi load xong để tránh blank khi bấm Sửa
        setSelectFlex("dropLoaiQuanHe", data.RELATION_TYPE_CODE);
        if (data.RELATION_TYPE_CODE && $("#dropLoaiQuanHe").val() != data.RELATION_TYPE_CODE) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.RELATION_TYPE_CODE", "dropLoaiQuanHe", "", function () {
                setSelectFlex("dropLoaiQuanHe", data.RELATION_TYPE_CODE);
            });
        }

        setSelectFlex("dropTrangThaiQuanHe", data.RELATION_STATUS_CODE);
        if (data.RELATION_STATUS_CODE && $("#dropTrangThaiQuanHe").val() != data.RELATION_STATUS_CODE) {
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_FAMILY.RELATION_STATUS_CODE", "dropTrangThaiQuanHe", "", function () {
                setSelectFlex("dropTrangThaiQuanHe", data.RELATION_STATUS_CODE);
            });
        }

        edu.util.viewValById("txtHoTenDayDuGD", data.FULL_NAME);
        edu.util.viewValById("txtHoGD", data.LAST_NAME);
        edu.util.viewValById("txtTenDemGD", data.MIDDLE_NAME);
        edu.util.viewValById("txtTenGD", data.FIRST_NAME);
        // Combo giới tính load async -> set lại sau khi load xong để tránh lệch/blank khi bấm Sửa
        edu.util.viewValById("dropGioiTinhGD", data.GENDER_ID);
        if (data.GENDER_ID && $("#dropGioiTinhGD").val() != data.GENDER_ID) {
            edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.GENDER_ID", "dropGioiTinhGD", "", function () {
                edu.util.viewValById("dropGioiTinhGD", data.GENDER_ID);
            });
        }
        // Combo mức độ chính xác ngày sinh load async -> set lại sau khi load xong để tránh lệch/blank khi bấm Sửa
        edu.util.viewValById("dropMucDoNgaySinhGD", data.DOB_PRECISION_LEVEL);
        if (data.DOB_PRECISION_LEVEL && $("#dropMucDoNgaySinhGD").val() != data.DOB_PRECISION_LEVEL) {
            edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON.DOB_PRECISION_LEVEL", "dropMucDoNgaySinhGD", "", function () {
                edu.util.viewValById("dropMucDoNgaySinhGD", data.DOB_PRECISION_LEVEL);
                $("#dropMucDoNgaySinhGD").trigger('change');
            });
        } else {
            $("#dropMucDoNgaySinhGD").trigger('change');
        }
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
        
        // Trigger change handled above (after setting selected value)
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
                    // Update UI ngay (tránh cảm giác "xóa rồi mà vẫn còn")
                    if (me.dtGiaDinh && me.dtGiaDinh.length > 0) {
                        me.dtGiaDinh = me.dtGiaDinh.filter(function (x) { return x && x.ID != strId; });
                        me.genTable_GiaDinh(me.dtGiaDinh, null);
                    }
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
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function(item) {
                            var okPerson = item.PERSON_ID == me.strDeXuatHoSo_Id;
                            // Xóa thành công thường là set IS_ACTIVE = 0 (soft delete) -> ẩn khỏi danh sách
                            var okActive = (item.IS_ACTIVE === undefined) || (item.IS_ACTIVE == 1);
                            return okPerson && okActive;
                        });
                    }
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
        me.dtTaiKhoanNH = data || [];
        
        var htmlBody = '';
        
        if (me.dtTaiKhoanNH.length > 0) {
            for (var i = 0; i < me.dtTaiKhoanNH.length; i++) {
                var item = me.dtTaiKhoanNH[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (item.ACCOUNT_TYPE_CODE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.ACCOUNT_STATUS_CODE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.BANK_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.BANK_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.BRANCH_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.BRANCH_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.ACCOUNT_NUMBER || '') + '</td>';
                htmlBody += '<td>' + (item.ACCOUNT_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.ACCOUNT_CURRENCY_CODE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_PRIMARY == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_PAYROLL_DEFAULT == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_VERIFIED == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_FROM || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_TO || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_TaiKhoanNH" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_TaiKhoanNH" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="19" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblTaiKhoanNH tbody").html(htmlBody);
    },

    toggle_FormTaiKhoanNH: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormTaiKhoanNH");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE", "dropLoaiTaiKhoan");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_STATUS_CODE", "dropTrangThaiTaiKhoan");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.BANK_ID", "dropNganHang");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_CURRENCY_CODE", "dropLoaiTienTe");

        // Branch will be loaded after selecting bank
        edu.util.viewValById("dropChiNhanh", "");
    },

    loadChiNhanh_ByNganHang: function (strNganHang_Id, selectedBranchId, selectedBranchCode, selectedBranchName) {
        var me = this;
        var obj = {
            strCha_Id: strNganHang_Id,
            strTuKhoa: "",
            strDanhMucTenBang_Id: "PERSON_BANK_ACCOUNT.BRANCH_ID",
            strTenCotSapXep: "",
            pageIndex: 1,
            pageSize: 100000
        };

        // Prefer hierarchical danh muc by parent (bank). If empty, fallback to loading full danh muc.
        edu.system.getList_DMDL_TheoCha(obj, "", "", function (rows) {
            if (edu.util.checkValue(rows) && rows.length > 0) {
                edu.system.loadToCombo_data({
                    data: rows,
                    renderPlace: ["dropChiNhanh"],
                    type: "",
                    title: "Chọn chi nhánh"
                });
                // chọn theo ID, nếu không có thì fallback theo CODE (attr name)
                var branchIdToSelect = selectedBranchId || "";
                if (!edu.util.checkValue(branchIdToSelect) && edu.util.checkValue(selectedBranchCode)) {
                    var optByCode = $("#dropChiNhanh option[name='" + selectedBranchCode + "']");
                    if (optByCode.length > 0) {
                        branchIdToSelect = optByCode.val();
                    }
                }
                edu.util.viewValById("dropChiNhanh", branchIdToSelect);
                $("#dropChiNhanh").trigger('change');

                // nếu vẫn chưa match option thì vẫn show theo dữ liệu trả về
                if (!edu.util.checkValue($("#dropChiNhanh").val())) {
                    edu.util.viewValById("txtMaChiNhanh", selectedBranchCode || "");
                    edu.util.viewValById("txtTenChiNhanh", selectedBranchName || "");
                }

                me.isLoadingFormTaiKhoanNH = false;
            }
            else {
                edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.BRANCH_ID", "dropChiNhanh", "", function () {
                    var branchIdToSelect = selectedBranchId || "";
                    if (!edu.util.checkValue(branchIdToSelect) && edu.util.checkValue(selectedBranchCode)) {
                        var optByCode = $("#dropChiNhanh option[name='" + selectedBranchCode + "']");
                        if (optByCode.length > 0) {
                            branchIdToSelect = optByCode.val();
                        }
                    }
                    edu.util.viewValById("dropChiNhanh", branchIdToSelect);
                    $("#dropChiNhanh").trigger('change');

                    if (!edu.util.checkValue($("#dropChiNhanh").val())) {
                        edu.util.viewValById("txtMaChiNhanh", selectedBranchCode || "");
                        edu.util.viewValById("txtTenChiNhanh", selectedBranchName || "");
                    }

                    me.isLoadingFormTaiKhoanNH = false;
                }, "Chọn chi nhánh");
            }
        });
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
        var me = this;
        me.isLoadingFormTaiKhoanNH = true;
        var accountTypeCode = data.ACCOUNT_TYPE_CODE;
        var accountStatusCode = data.ACCOUNT_STATUS_CODE;
        var bankId = data.BANK_ID;
        var currencyCode = data.ACCOUNT_CURRENCY_CODE;
        var branchId = data.BRANCH_ID;
        var branchCode = data.BRANCH_CODE;
        var branchName = data.BRANCH_NAME;

        // Combo danh mục load async -> set value trong callback để không bị lệch khi mở form Sửa
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE", "dropLoaiTaiKhoan", "", function () {
            edu.util.viewValById("dropLoaiTaiKhoan", accountTypeCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_STATUS_CODE", "dropTrangThaiTaiKhoan", "", function () {
            edu.util.viewValById("dropTrangThaiTaiKhoan", accountStatusCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_CURRENCY_CODE", "dropLoaiTienTe", "", function () {
            edu.util.viewValById("dropLoaiTienTe", currencyCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.BANK_ID", "dropNganHang", "", function () {
            edu.util.viewValById("dropNganHang", bankId || "");

            // Load cascade chi nhánh sau khi đã set BANK_ID
            if (bankId) {
                me.loadChiNhanh_ByNganHang(bankId, branchId || "", branchCode || "", branchName || "");
            } else {
                edu.util.viewValById("dropChiNhanh", "");
                edu.util.viewValById("txtMaChiNhanh", branchCode || "");
                edu.util.viewValById("txtTenChiNhanh", branchName || "");
                me.isLoadingFormTaiKhoanNH = false;
            }
        });
        edu.util.viewValById("txtMaNganHang", data.BANK_CODE);
        edu.util.viewValById("txtTenNganHang", data.BANK_NAME);

        edu.util.viewValById("txtMaChiNhanh", data.BRANCH_CODE);
        edu.util.viewValById("txtTenChiNhanh", data.BRANCH_NAME);
        edu.util.viewValById("txtSoTaiKhoan", data.ACCOUNT_NUMBER);
        edu.util.viewValById("txtTenChuTaiKhoan", data.ACCOUNT_NAME);
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
                    // Update UI ngay (tránh cảm giác "xóa rồi mà vẫn còn")
                    if (me.dtTaiKhoanNH && me.dtTaiKhoanNH.length > 0) {
                        me.dtTaiKhoanNH = me.dtTaiKhoanNH.filter(function (x) { return x && x.ID != strId; });
                        me.genTable_TaiKhoanNH(me.dtTaiKhoanNH, null);
                    }
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
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4EJTQiIDUoLi8P',
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
                    var dtReRult = data.Data || [];
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function(item) {
                            var okPerson = item.PERSON_ID == me.strDeXuatHoSo_Id;
                            // Xóa thành công thường là set IS_ACTIVE = 0 (soft delete) -> ẩn khỏi danh sách
                            var okActive = (item.IS_ACTIVE === undefined) || (item.IS_ACTIVE == 1);
                            return okPerson && okActive;
                        });
                    }
                    me.dtHocVan = dtReRult;
                    // Đảm bảo đã có cache danh mục nhóm/ngành để hiển thị nhóm ngành
                    me.ensureDmMajor(function () {
                        me.ensureDmMajorGroupOnly(function () {
                            me.genTable_HocVan(me.dtHocVan);
                        });
                    });
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
        me.dtHocVan = data || [];

        var firstText = function (obj, keys) {
            if (!obj) return '';
            for (var k = 0; k < keys.length; k++) {
                var v = obj[keys[k]];
                if (v !== undefined && v !== null) {
                    v = (v + '').trim();
                    if (v) return v;
                }
            }
            return '';
        };

        var isTruthy1 = function (obj, keys) {
            if (!obj) return false;
            for (var k = 0; k < keys.length; k++) {
                var v = obj[keys[k]];
                if (v === undefined || v === null) continue;
                if (typeof v === 'boolean') return v;
                v = (v + '').trim().toLowerCase();
                if (v === '1' || v === 'true' || v === 'y' || v === 'yes') return true;
                if (v === '0' || v === 'false' || v === 'n' || v === 'no') return false;
            }
            return false;
        };
        
        var htmlBody = '';
        
        if (me.dtHocVan.length > 0) {
            for (var i = 0; i < me.dtHocVan.length; i++) {
                var item = me.dtHocVan[i];
                var stt = i + 1;

                var educationType = firstText(item, ['EDUCATION_TYPE_CODE_NAME', 'EDUCATION_TYPE_NAME']);
                var educationLevel = firstText(item, ['EDUCATION_LEVEL_CODE_NAME', 'EDUCATION_LEVEL_NAME']);
                var educationStatus = firstText(item, ['EDUCATION_STATUS_CODE_NAME', 'EDUCATION_STATUS_NAME']);

                // Loại văn bằng: ưu tiên tên danh mục; fallback sang code/id
                var degreeType = firstText(item, [
                    'DEGREE_CODE_NAME',
                    'DEGREE_TYPE_CODE_NAME',
                    'DEGREE_TYPE_NAME',
                    'DEGREE_CODE',
                    'DEGREE_TYPE_CODE'
                ]);

                // Tên văn bằng: backend hiện có thể trả về DEGREE_NAME hoặc BANK_NAME
                var degreeName = firstText(item, ['DEGREE_NAME', 'BANK_NAME', 'DEGREE_NAME_FULL']);

                var majorGroupName = firstText(item, ['MAJOR_GROUP_NAME', 'MAJOR_GROUP_ID_NAME', 'MAJOR_GROUP_CODE']);
                if (!majorGroupName) {
                    var mgId = firstText(item, ['MAJOR_GROUP_ID', 'strMajor_Group_Id']);
                    majorGroupName = me.lookupMajorGroupName(mgId);
                }
                // Nếu API list không trả MAJOR_GROUP_* thì suy ra nhóm ngành từ ngành (cha của MAJOR_ID trong danh mục)
                if (!majorGroupName) {
                    var majorVal = firstText(item, ['MAJOR_ID', 'strMajor_Id', 'MAJOR_CODE']);
                    if (majorVal) {
                        var foundMajor = (me.dtDmMajorAll || []).find(function (x) {
                            if (!x) return false;
                            var idMatch = ((x.ID + '') === (majorVal + ''));
                            var maMatch = (((x.MA || '') + '').trim() === (majorVal + '').trim());
                            return idMatch || maMatch;
                        });
                        if (foundMajor && edu.util.checkValue(foundMajor.QUANHECHA_ID)) {
                            majorGroupName = me.lookupMajorGroupName(foundMajor.QUANHECHA_ID);
                        }
                    }
                }
                var specializationName = firstText(item, ['SPECIALIZATION_NAME', 'SPECIALIZATION_NAME_FULL']);
                var specializationNameFull = firstText(item, ['SPECIALIZATION_NAME_FULL', 'SPECIALIZATION_NAME']);
                var institutionName = firstText(item, ['INSTITUTION_NAME', 'INSTITUTION_NAME_FULL']);
                var institutionNameFull = firstText(item, ['INSTITUTION_NAME_FULL', 'INSTITUTION_NAME']);
                var countryName = firstText(item, ['COUNTRY_NAME', 'COUNTRY_ID_NAME', 'COUNTRY_CODE_NAME']);
                var classificationName = firstText(item, ['CLASSIFICATION_CODE_NAME', 'CLASSIFICATION_NAME']);

                var enrollmentYear = firstText(item, ['ENROLLMENT_YEAR', 'D_ENROLLMENT_YEAR', 'ENROLL_YEAR', 'dEnrollment_Year']);
                var startDate = firstText(item, ['START_DATE', 'STR_START_DATE', 'strStart_Date']);
                var completionDate = firstText(item, ['COMPLETION_DATE', 'COMPLETION_DATE_STR', 'STR_COMPLETION_DATE', 'strCompletion_Date']);
                var graduationYear = firstText(item, ['GRADUATION_YEAR', 'D_GRADUATION_YEAR', 'dGraduation_Year']);
                var gpa = firstText(item, ['GPA', 'D_GPA', 'dGPA']);
                var degreeNumber = firstText(item, ['DEGREE_NUMBER', 'DEGREE_NO', 'STR_DEGREE_NUMBER', 'strDegree_Number']);
                var degreeIssueDate = firstText(item, ['DEGREE_ISSUE_DATE', 'STR_DEGREE_ISSUE_DATE', 'strDegree_Issue_Date']);
                var effectiveFrom = firstText(item, ['EFFECTIVE_FROM', 'STR_EFFECTIVE_FROM', 'strEffective_From']);
                var effectiveTo = firstText(item, ['EFFECTIVE_TO', 'STR_EFFECTIVE_TO', 'strEffective_To']);

                var isHighest = isTruthy1(item, ['IS_HIGHEST', 'D_IS_HIGHEST', 'dIs_Highest']);
                var isRecognized = isTruthy1(item, ['IS_RECOGNIZED', 'D_IS_RECOGNIZED', 'dIs_Recognized']);
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (educationType || '') + '</td>';
                htmlBody += '<td class="text-center">' + (educationLevel || '') + '</td>';
                htmlBody += '<td class="text-center">' + (educationStatus || '') + '</td>';
                htmlBody += '<td class="text-center">' + (degreeType || '') + '</td>';
                htmlBody += '<td>' + (degreeName || '') + '</td>';
                htmlBody += '<td>' + (majorGroupName || '') + '</td>';
                htmlBody += '<td>' + (item.MAJOR_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.MAJOR_NAME || '') + '</td>';
                htmlBody += '<td>' + (specializationName || '') + '</td>';
                htmlBody += '<td>' + (item.SPECIALIZATION_CODE || '') + '</td>';
                htmlBody += '<td>' + (specializationNameFull || '') + '</td>';
                htmlBody += '<td>' + (institutionName || '') + '</td>';
                htmlBody += '<td>' + (item.INSTITUTION_CODE || '') + '</td>';
                htmlBody += '<td>' + (institutionNameFull || '') + '</td>';
                htmlBody += '<td class="text-center">' + (countryName || '') + '</td>';
                htmlBody += '<td class="text-center">' + (enrollmentYear || '') + '</td>';
                htmlBody += '<td class="text-center">' + (startDate || '') + '</td>';
                htmlBody += '<td class="text-center">' + (completionDate || '') + '</td>';
                htmlBody += '<td class="text-center">' + (graduationYear || '') + '</td>';
                htmlBody += '<td class="text-center">' + (classificationName || '') + '</td>';
                htmlBody += '<td class="text-center">' + (gpa || '') + '</td>';
                htmlBody += '<td class="text-center">' + (degreeNumber || '') + '</td>';
                htmlBody += '<td class="text-center">' + (degreeIssueDate || '') + '</td>';
                htmlBody += '<td class="text-center">' + (isHighest ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</td>';
                htmlBody += '<td class="text-center">' + (isRecognized ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</td>';
                htmlBody += '<td class="text-center">' + (effectiveFrom || '') + '</td>';
                htmlBody += '<td class="text-center">' + (effectiveTo || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-primary btn-sm btnChiTiet_HocVan" id="' + item.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_HocVan" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_HocVan" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="33" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblHocVan tbody").html(htmlBody);
    },

    show_ChiTietHocVan: function (strId) {
        var me = this;

        // Ưu tiên dùng dữ liệu đang có trên danh sách (để tránh trường hợp API By_Id trả {DUMMY:'X'})
        var dataLocal = null;
        if (me.dtHocVan && me.dtHocVan.length) {
            dataLocal = me.dtHocVan.find(function (e) { return e && e.ID == strId; });
        }

        var renderChiTiet = function (data) {
            // Chuẩn hoá hiển thị nhóm ngành nếu API không trả MAJOR_GROUP_NAME
            if (data && !data.MAJOR_GROUP_NAME) {
                var mgId = data.MAJOR_GROUP_ID || data.strMajor_Group_Id;
                var mgName = me.lookupMajorGroupName(mgId);
                if (!mgName) {
                    var majorVal = data.MAJOR_ID || data.strMajor_Id || data.MAJOR_CODE;
                    if (majorVal) {
                        var foundMajor = (me.dtDmMajorAll || []).find(function (x) {
                            if (!x) return false;
                            var idMatch = ((x.ID + '') === (majorVal + ''));
                            var maMatch = (((x.MA || '') + '').trim() === (majorVal + '').trim());
                            return idMatch || maMatch;
                        });
                        if (foundMajor && edu.util.checkValue(foundMajor.QUANHECHA_ID)) {
                            mgName = me.lookupMajorGroupName(foundMajor.QUANHECHA_ID);
                        }
                    }
                }
                if (mgName) data.MAJOR_GROUP_NAME = mgName;
            }

            var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
            strHTML += '<div class="row">';
            strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-graduation-cap me-2"></i>Thông tin chi tiết học vấn</h5></div>';

            // Thông tin chung
            strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-info-circle me-2"></i>Thông tin chung</h6></div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Loại hình học vấn:</strong> ' + edu.util.returnEmpty(data.EDUCATION_TYPE_CODE_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Bậc đào tạo:</strong> ' + edu.util.returnEmpty(data.EDUCATION_LEVEL_CODE_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Trạng thái học:</strong> ' + edu.util.returnEmpty(data.EDUCATION_STATUS_CODE_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Loại văn bằng:</strong> ' + edu.util.returnEmpty(data.DEGREE_CODE || data.DEGREE_TYPE_CODE) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Tên Loại văn bằng:</strong> ' + edu.util.returnEmpty(data.DEGREE_NAME || data.BANK_NAME) + '</div>';
            strHTML += '<div class="col-md-12"><hr></div>';

            // Thông tin ngành học
            strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-book me-2"></i>Thông tin ngành học</h6></div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Nhóm ngành:</strong> ' + edu.util.returnEmpty(data.MAJOR_GROUP_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Mã ngành:</strong> ' + edu.util.returnEmpty(data.MAJOR_CODE) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Tên ngành:</strong> ' + edu.util.returnEmpty(data.MAJOR_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Chuyên ngành:</strong> ' + edu.util.returnEmpty(data.SPECIALIZATION_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Mã chuyên ngành:</strong> ' + edu.util.returnEmpty(data.SPECIALIZATION_CODE) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Tên chuyên ngành:</strong> ' + edu.util.returnEmpty(data.SPECIALIZATION_NAME_FULL) + '</div>';
            strHTML += '<div class="col-md-12"><hr></div>';

            // Cơ sở đào tạo
            strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-university me-2"></i>Cơ sở đào tạo</h6></div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Tên cơ sở:</strong> ' + edu.util.returnEmpty(data.INSTITUTION_NAME) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Mã cơ sở:</strong> ' + edu.util.returnEmpty(data.INSTITUTION_CODE) + '</div>';
            strHTML += '<div class="col-md-6 mb-2"><strong>Tên đầy đủ:</strong> ' + edu.util.returnEmpty(data.INSTITUTION_NAME_FULL) + '</div>';
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
            strHTML += '<div class="col-md-6 mb-2"><strong>Hiệu lực:</strong> ' + (data.IS_ACTIVE == 1 ? '<span class="badge bg-success">Có hiệu lực</span>' : '<span class="badge bg-secondary">Hết hiệu lực</span>') + '</div>';
            strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';

            strHTML += '</div></div>';
            edu.system.alert(strHTML);
        };

        if (dataLocal) {
            renderChiTiet(dataLocal);
            return;
        }
        
        // Gọi API lấy chi tiết
        var obj_detail = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4EJTQiIDUoLi8eAzgeCCUP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Education_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (response) {
                if (response.Success && response.Data && response.Data.length > 0) {
                    var data = response.Data[0];

                    // Một số môi trường API trả placeholder {DUMMY:'X'} -> coi như không có dữ liệu
                    if (data && data.DUMMY && Object.keys(data).length <= 2) {
                        edu.system.alert("Không tìm thấy thông tin chi tiết!");
                        return;
                    }

                    renderChiTiet(data);
                    return;
                }

                edu.system.alert("Không tìm thấy thông tin chi tiết!");
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },

    toggle_FormHocVan: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormHocVan");
    },

    ensureDmMajor: function (callback) {
        var me = this;
        if (me._dmMajorLoaded && me.dtDmMajorAll && me.dtDmMajorAll.length) {
            if (typeof callback === 'function') callback();
            return;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    me.dtDmMajorAll = data.Data || [];
                    // Thực tế danh mục có thể phân cấp theo QUANHECHA_ID hoặc theo MAJOR_GROUP_ID.
                    // Nhóm ngành: node gốc (không có QUANHECHA_ID và cũng không có MAJOR_GROUP_ID).
                    me.dtDmMajorGroups = (me.dtDmMajorAll || []).filter(function (x) {
                        if (!x) return false;
                        var hasParent1 = edu.util.checkValue(x.QUANHECHA_ID);
                        var hasParent2 = edu.util.checkValue(x.MAJOR_GROUP_ID);
                        return !hasParent1 && !hasParent2;
                    });
                    me._dmMajorLoaded = true;
                }
                if (typeof callback === 'function') callback();
            },
            error: function () {
                if (typeof callback === 'function') callback();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            contentType: true,
            data: {
                'strMaBangDanhMuc': 'PERSON_EDUCATION.MAJOR_ID',
                'strTieuChiSapXep': '',
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    ensureDmMajorGroupOnly: function (callback) {
        var me = this;
        if (me._dmMajorGroupOnlyLoaded && me.dtDmMajorGroupOnly && me.dtDmMajorGroupOnly.length) {
            if (typeof callback === 'function') callback();
            return;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    me.dtDmMajorGroupOnly = data.Data || [];
                    me._dmMajorGroupOnlyLoaded = true;

                    // Nếu danh mục nhóm ngành riêng có dữ liệu thì ưu tiên dùng để lookup/hiển thị
                    if (me.dtDmMajorGroupOnly && me.dtDmMajorGroupOnly.length) {
                        me.dtDmMajorGroups = me.dtDmMajorGroupOnly;
                    }
                }
                if (typeof callback === 'function') callback();
            },
            error: function () {
                if (typeof callback === 'function') callback();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            contentType: true,
            data: {
                'strMaBangDanhMuc': 'PERSON_EDUCATION.MAJOR_GROUP_ID',
                'strTieuChiSapXep': '',
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    },

    renderComboSimple: function (selectId, list, title) {
        var $sel = $("#" + selectId);
        if (!$sel.length) return;

        var html = '';
        if (edu.util.checkValue(title)) {
            html += '<option value="">' + title + '</option>';
        }
        else {
            html += '<option value="">-- Chọn --</option>';
        }

        (list || []).forEach(function (e) {
            if (!e) return;
            html += '<option value="' + (e.ID || '') + '" name="' + (e.MA || '') + '">' + (e.TEN || '') + '</option>';
        });

        $sel.html(html);
        // Không trigger change ở đây để tránh side-effect (cascade/clear) khi chỉ render option
        if (!$sel.val()) $sel.val('');
    },

    removeMajorGroupOptionsFromSelect: function (selectId) {
        var me = this;
        var $sel = $("#" + selectId);
        if (!$sel.length) return;

        var groupIds = (me.dtDmMajorGroups || []).map(function (x) {
            return x ? (x.ID + '') : '';
        }).filter(function (x) { return !!x; });
        if (!groupIds.length) return;

        var groupSet = {};
        for (var i = 0; i < groupIds.length; i++) groupSet[groupIds[i]] = 1;

        $sel.find('option').each(function () {
            var v = (($(this).val() || '') + '').trim();
            if (!v) return; // giữ option rỗng
            if (groupSet[v]) {
                $(this).remove();
            }
        });
    },

    fillCombo_NhomNganh: function (selectedVal) {
        var me = this;
        me.renderComboSimple('dropNhomNganh', me.dtDmMajorGroups || [], 'Chọn nhóm ngành');

        // Chỉ set + trigger khi có value thật (không trigger cho chuỗi rỗng)
        if (selectedVal !== undefined && selectedVal !== null && (selectedVal + '').trim()) {
            $('#dropNhomNganh').val(selectedVal).trigger('change');
            // Nếu selectedVal là MA/code thay vì ID thì thử match theo option[name]
            if (!$('#dropNhomNganh').val()) {
                var opt = $('#dropNhomNganh option').filter(function () {
                    return (($(this).attr('name') || '').trim() === (selectedVal + '').trim());
                }).first();
                if (opt && opt.length) {
                    $('#dropNhomNganh').val(opt.val()).trigger('change');
                }
            }
        }
    },

    fillCombo_Nganh_ByNhom: function (nhomId, selectedMajorVal) {
        var me = this;
        var list = (me.dtDmMajorAll || []).filter(function (x) {
            if (!x) return false;
            var byQuanHeCha = edu.util.checkValue(x.QUANHECHA_ID) && (x.QUANHECHA_ID + '') == (nhomId + '');
            var byMajorGroup = edu.util.checkValue(x.MAJOR_GROUP_ID) && (x.MAJOR_GROUP_ID + '') == (nhomId + '');
            return byQuanHeCha || byMajorGroup;
        });
        me.renderComboSimple('dropNganh', list, 'Chọn ngành');

        // Chỉ set + trigger khi có value thật
        if (selectedMajorVal !== undefined && selectedMajorVal !== null && (selectedMajorVal + '').trim()) {
            $('#dropNganh').val(selectedMajorVal).trigger('change');
            if (!$('#dropNganh').val()) {
                var opt = $('#dropNganh option').filter(function () {
                    return (($(this).attr('name') || '').trim() === (selectedMajorVal + '').trim());
                }).first();
                if (opt && opt.length) {
                    $('#dropNganh').val(opt.val()).trigger('change');
                }
            }
        }
    },

    lookupMajorGroupName: function (val) {
        var me = this;
        if (val === undefined || val === null) return '';
        val = (val + '').trim();
        if (!val) return '';

        // Ưu tiên danh mục nhóm ngành riêng nếu có
        if (me.dtDmMajorGroupOnly && me.dtDmMajorGroupOnly.length) {
            var foundOnly = (me.dtDmMajorGroupOnly || []).find(function (x) {
                if (!x) return false;
                return ((x.ID + '') === val) || (((x.MA || '') + '').trim() === val);
            });
            if (foundOnly) return (foundOnly.TEN || '');
        }

        var found = (me.dtDmMajorGroups || []).find(function (x) {
            if (!x) return false;
            return ((x.ID + '') === val) || ((((x.MA || '') + '')).trim() === val);
        });
        if (found) return (found.TEN || '');

        // Fallback: nếu val không nằm trong list nhóm (do dữ liệu không tách nhóm rõ)
        // thì vẫn hiển thị TEN theo danh mục tổng.
        var foundAny = (me.dtDmMajorAll || []).find(function (x) {
            if (!x) return false;
            return ((x.ID + '') === val) || (((x.MA || '') + '').trim() === val);
        });
        return foundAny ? (foundAny.TEN || '') : '';
    },

    loadDanhMuc_HocVan: function () {
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_TYPE_CODE", "dropLoaiHinhHocVan");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_LEVEL_CODE", "dropBacDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_STATUS_CODE", "dropTrangThaiHoc");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.DEGREE_CODE", "txtMaLoaiVanBang");
        // Nhóm ngành: ưu tiên danh mục PERSON_EDUCATION.MAJOR_GROUP_ID (nếu có)
        var me = this;
        me.ensureDmMajor(function () {
            me.ensureDmMajorGroupOnly(function () {
                me.fillCombo_NhomNganh('');
                me.fillCombo_Nganh_ByNhom('', '');
            });
        });

        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.SPECIALIZATION_ID", "dropChuyenNganh");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.INSTITUTION_ID", "dropCoSoDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.COUNTRY_ID", "dropQuocGiaHV");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.CLASSIFICATION_CODE", "dropXepLoai");
    },

    loadForm_HocVan_ById: function (strId, fallbackData) {
        var me = this;
        var obj_detail = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4EJTQiIDUoLi8eAzgeCCUP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Education_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (response) {
                if (response.Success && response.Data && response.Data.length > 0) {
                    me.loadForm_HocVan(response.Data[0]);
                    return;
                }

                // Fallback: dùng data từ list nếu API detail không có
                if (fallbackData) {
                    me.loadForm_HocVan(fallbackData);
                }
                else {
                    edu.system.alert("Không tìm thấy thông tin chi tiết!");
                }
            },
            error: function (er) {
                // Fallback: dùng data từ list nếu API detail lỗi
                if (fallbackData) {
                    me.loadForm_HocVan(fallbackData);
                }
                else {
                    edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
                }
            },
            type: 'POST',
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
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
        var setComboSmart = function (selectId, desiredVal) {
            if (!selectId) return '';
            var idName = '#' + selectId;
            if (!$(idName).length) return '';

            var v = desiredVal;
            if (v === undefined || v === null) v = '';
            v = (v + '').trim();
            if (!v) {
                $(idName).val('').trigger('change');
                return '';
            }

            // 1) Try set by value (usually ID)
            $(idName).val(v).trigger('change');
            var current = $(idName).val();
            if (current && (current + '').trim() === v) {
                return current;
            }

            // 2) Try match by option[name] (usually MA/code)
            var opt = $(idName + " option").filter(function () {
                var nameAttr = ($(this).attr('name') || '').trim();
                return nameAttr && nameAttr === v;
            }).first();
            if (opt && opt.length) {
                var idVal = (opt.val() || '').trim();
                $(idName).val(idVal).trigger('change');
                return idVal;
            }

            // 3) No match
            $(idName).val('').trigger('change');
            return '';
        };

        var pickVal = function (obj, keys, defaultVal) {
            if (!obj) return defaultVal;
            for (var i = 0; i < keys.length; i++) {
                var v = obj[keys[i]];
                if (v !== undefined && v !== null) return v;
            }
            return defaultVal;
        };

        var pickText = function (obj, keys, defaultVal) {
            var v = pickVal(obj, keys, defaultVal);
            if (v === undefined || v === null) return defaultVal || '';
            v = (v + '').trim();
            return v ? v : (defaultVal || '');
        };

        var pickFlag1 = function (obj, keys) {
            var v = pickVal(obj, keys, undefined);
            if (v === undefined || v === null) return false;
            if (typeof v === 'boolean') return v;
            v = (v + '').trim().toLowerCase();
            return (v === '1' || v === 'true' || v === 'y' || v === 'yes');
        };

        var toInputDateValue = function (val) {
            if (!val) return "";
            val = (val + "").trim();

            // Already yyyy-mm-dd
            var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
            if (m) return m[1] + "-" + m[2] + "-" + m[3];

            // dd/mm/yyyy (optionally with time)
            m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(val);
            if (m) return m[3] + "-" + m[2] + "-" + m[1];

            // dd-mm-yyyy
            m = /^(\d{2})-(\d{2})-(\d{4})/.exec(val);
            if (m) return m[3] + "-" + m[2] + "-" + m[1];

            // yyyy/mm/dd
            m = /^(\d{4})\/(\d{2})\/(\d{2})/.exec(val);
            if (m) return m[1] + "-" + m[2] + "-" + m[3];

            return "";
        };

        var eduTypeCode = pickText(data, ['EDUCATION_TYPE_CODE', 'EDUCATION_TYPE_ID', 'strEducation_Type_Code']);
        var eduLevelCode = pickText(data, ['EDUCATION_LEVEL_CODE', 'EDUCATION_LEVEL_ID', 'strEducation_Level_Code']);
        var eduStatusCode = pickText(data, ['EDUCATION_STATUS_CODE', 'EDUCATION_STATUS_ID', 'strEducation_Status_Code']);
        var degreeCode = pickText(data, ['DEGREE_CODE', 'DEGREE_TYPE_CODE', 'strDegree_Code', 'strDegree_Type_Code']);
        var majorGroupId = pickText(data, ['MAJOR_GROUP_ID', 'strMajor_Group_Id']);
        var institutionId = pickText(data, ['INSTITUTION_ID', 'strInstitution_Id']);
        var countryId = pickText(data, ['COUNTRY_ID', 'strCountry_Id', 'COUNTRY_CODE']);
        var classificationCode = pickText(data, ['CLASSIFICATION_CODE', 'strClassification_Code']);
        var specializationWanted = pickText(data, ['SPECIALIZATION_ID', 'strSpecialization_Id', 'SPECIALIZATION_CODE', 'strSpecialization_Code']);

        var majorIdWanted = pickText(data, ['MAJOR_ID', 'strMajor_Id', 'MAJOR_CODE']);

        // Combo danh mục load async -> set value trong callback để không bị lệch khi mở form Sửa
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_TYPE_CODE", "dropLoaiHinhHocVan", "", function () {
            setComboSmart("dropLoaiHinhHocVan", eduTypeCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_LEVEL_CODE", "dropBacDaoTao", "", function () {
            setComboSmart("dropBacDaoTao", eduLevelCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.EDUCATION_STATUS_CODE", "dropTrangThaiHoc", "", function () {
            setComboSmart("dropTrangThaiHoc", eduStatusCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.DEGREE_CODE", "txtMaLoaiVanBang", "", function () {
            setComboSmart("txtMaLoaiVanBang", degreeCode || "");
        });

        // Chuyên ngành: load combo rồi set theo ID hoặc MA/code để không bị mất hiển thị khi sửa
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.SPECIALIZATION_ID", "dropChuyenNganh", "", function () {
            setComboSmart("dropChuyenNganh", specializationWanted || "");
        });

        // Nhóm ngành / Ngành: dùng cache DMDL PERSON_EDUCATION.MAJOR_ID (tách theo QUANHECHA_ID)
        var me = this;
        me._isLoadingHocVanForm = true;
        me._hocVanMajorWanted = majorIdWanted || '';
        me.ensureDmMajor(function () {
            // Render nhóm ngành (chỉ node cha) rồi set theo ID hoặc MA/code
            me.fillCombo_NhomNganh('');
            var majorGroupIdSelected = setComboSmart('dropNhomNganh', majorGroupId || '');

            // Render ngành theo nhóm đang chọn
            me.fillCombo_Nganh_ByNhom(majorGroupIdSelected || '', '');

            // Nếu không filter được theo nhóm (danh mục không theo QUANHECHA_ID) -> load toàn bộ ngành như trước
            if ($('#dropNganh option').length <= 1) {
                edu.system.loadToCombo_DanhMucDuLieu('PERSON_EDUCATION.MAJOR_ID', 'dropNganh', '', function () {
                    // Loại bỏ các node "Nhóm ngành" khỏi dropdown Ngành để tránh chọn nhầm
                    me.removeMajorGroupOptionsFromSelect('dropNganh');
                    setComboSmart('dropNganh', majorIdWanted || '');
                });
            }
            else {
                setComboSmart('dropNganh', majorIdWanted || '');
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.INSTITUTION_ID", "dropCoSoDaoTao", "", function () {
            setComboSmart("dropCoSoDaoTao", institutionId || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.COUNTRY_ID", "dropQuocGiaHV", "", function () {
            setComboSmart("dropQuocGiaHV", countryId || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_EDUCATION.CLASSIFICATION_CODE", "dropXepLoai", "", function () {
            setComboSmart("dropXepLoai", classificationCode || "");
        });

        // Tên văn bằng: ưu tiên field đúng, fallback field cũ
        edu.util.viewValById("txtTenNganHangHV", pickText(data, ['DEGREE_NAME', 'BANK_NAME', 'strDegree_Name', 'strBank_Name']));
        
        // Mã/Tên ngành: hiển thị theo dữ liệu đã lưu (người dùng tự nhập)
        edu.util.viewValById("txtMaNganh", data.MAJOR_CODE);
        edu.util.viewValById("txtTenNganh", data.MAJOR_NAME);

        
        edu.util.viewValById("txtMaChuyenNganh", data.SPECIALIZATION_CODE);
        edu.util.viewValById("txtTenChuyenNganh", data.SPECIALIZATION_NAME);
        edu.util.viewValById("txtMaCoSoDaoTao", pickText(data, ['INSTITUTION_CODE', 'strInstitution_Code']));
        edu.util.viewValById("txtTenCoSoDaoTao", pickText(data, ['INSTITUTION_NAME', 'strInstitution_Name']));
        edu.util.viewValById("txtNamNhapHoc", pickText(data, ['ENROLLMENT_YEAR', 'D_ENROLLMENT_YEAR', 'dEnrollment_Year']));
        edu.util.viewValById("txtNgayBatDauHoc", toInputDateValue(pickText(data, ['START_DATE', 'strStart_Date'])));
        edu.util.viewValById("txtNgayTotNghiep", toInputDateValue(pickText(data, ['COMPLETION_DATE', 'COMPLETION_DATE_STR', 'strCompletion_Date'])));
        edu.util.viewValById("txtNamTotNghiep", pickText(data, ['GRADUATION_YEAR', 'D_GRADUATION_YEAR', 'dGraduation_Year']));
        edu.util.viewValById("txtGPA", pickText(data, ['GPA', 'D_GPA', 'dGPA']));
        edu.util.viewValById("txtGPAScale", pickText(data, ['GPA_SCALE', 'D_GPA_SCALE', 'dGPA_Scale']));
        edu.util.viewValById("txtSoHieuVanBang", pickText(data, ['DEGREE_NUMBER', 'DEGREE_NO', 'strDegree_Number']));
        edu.util.viewValById("txtNgayCapVanBang", toInputDateValue(pickText(data, ['DEGREE_ISSUE_DATE', 'strDegree_Issue_Date'])));
        $("#chkLaTrinhDoCaoNhat").prop('checked', pickFlag1(data, ['IS_HIGHEST', 'dIs_Highest']));
        $("#chkChuyenMonChinh").prop('checked', pickFlag1(data, ['IS_PRIMARY_MAJOR', 'dIs_Primary_Major']));
        $("#chkDuocCongNhan").prop('checked', pickFlag1(data, ['IS_RECOGNIZED', 'dIs_Recognized']));
        edu.util.viewValById("txtNgayHieuLucHV", toInputDateValue(pickText(data, ['EFFECTIVE_FROM', 'strEffective_From'])));
        edu.util.viewValById("txtNgayHetHieuLucHV", toInputDateValue(pickText(data, ['EFFECTIVE_TO', 'strEffective_To'])));
        $("#chkHieuLucHV").prop('checked', pickFlag1(data, ['IS_ACTIVE', 'dIs_Active']));
        edu.util.viewValById("txtGhiChuHV", pickText(data, ['NOTE', 'strNote']));
    },

    save_HocVan: function () {
        var me = this;

        var normEmpty = function (v) {
            if (v === undefined || v === null) return '';
            return ((v + '')).trim();
        };

        // Đọc value an toàn: một số màn hình/phiên bản helper chỉ đọc đúng ở edu.util hoặc jquery
        var getValSafe = function (id) {
            try {
                var v1 = (edu && edu.util && typeof edu.util.getValById === 'function') ? edu.util.getValById(id) : '';
                if (normEmpty(v1)) return normEmpty(v1);
            } catch (e) { }
            try {
                var v2 = (edu && edu.system && typeof edu.system.getValById === 'function') ? edu.system.getValById(id) : '';
                if (normEmpty(v2)) return normEmpty(v2);
            } catch (e2) { }
            var $el = $('#' + id);
            if ($el && $el.length) return normEmpty($el.val());
            return '';
        };

        var deriveMajorGroupFromMajor = function (majorVal) {
            majorVal = normEmpty(majorVal);
            if (!majorVal) return '';
            var foundMajor = (me.dtDmMajorAll || []).find(function (x) {
                if (!x) return false;
                return ((x.ID + '') === (majorVal + '')) || (((x.MA || '') + '').trim() === majorVal);
            });
            if (foundMajor) {
                if (edu.util.checkValue(foundMajor.MAJOR_GROUP_ID)) return (foundMajor.MAJOR_GROUP_ID + '');
                if (edu.util.checkValue(foundMajor.QUANHECHA_ID)) return (foundMajor.QUANHECHA_ID + '');
            }
            return '';
        };

        // Khi dropdown Ngành (`dropNganh`) bị ẩn/không dùng (HTML đang display:none),
        // vẫn cần suy ra `strMajor_Id` từ Mã/Tên ngành để backend có FK và API list trả đủ dữ liệu.
        var tryDeriveMajorIdFromInputs = function (majorCode, majorName, majorGroupId) {
            majorCode = normEmpty(majorCode);
            majorName = normEmpty(majorName);
            majorGroupId = normEmpty(majorGroupId);

            var list = (me.dtDmMajorAll || []).filter(function (x) {
                if (!x) return false;
                // Bỏ qua node Nhóm ngành (thường không có cha)
                var hasParent = edu.util.checkValue(x.QUANHECHA_ID) || edu.util.checkValue(x.MAJOR_GROUP_ID);
                if (!hasParent) return false;

                // Nếu đang có majorGroupId thì ưu tiên match đúng nhóm để tránh trùng MA
                if (majorGroupId) {
                    var parentId = (x.QUANHECHA_ID || x.MAJOR_GROUP_ID || '') + '';
                    if (parentId !== (majorGroupId + '')) return false;
                }

                if (majorCode) {
                    return (((x.MA || '') + '').trim() === majorCode);
                }
                if (majorName) {
                    return (((x.TEN || '') + '').trim().toLowerCase() === majorName.toLowerCase());
                }
                return false;
            });

            if (!list.length) return '';
            return (list[0].ID || '');
        };

        // Oracle thường parse ngày theo DD/MM/YYYY; input type=date trả YYYY-MM-DD
        var normalizeDateForOracle = function (val) {
            if (!val) return "";
            val = (val + "").trim();
            if (!val) return "";

            // dd/mm/yyyy
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;

            // yyyy-mm-dd
            var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
            if (m) return m[3] + "/" + m[2] + "/" + m[1];

            // yyyy/mm/dd
            m = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(val);
            if (m) return m[3] + "/" + m[2] + "/" + m[1];

            // dd-mm-yyyy
            m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(val);
            if (m) return m[1] + "/" + m[2] + "/" + m[3];

            return val;
        };
        
        // Validation
        if (!edu.util.getValById("dropLoaiHinhHocVan")) {
            edu.system.alert("Vui lòng chọn loại hình học vấn!");
            return;
        }
        if (!edu.util.getValById("dropBacDaoTao")) {
            edu.system.alert("Vui lòng chọn bậc đào tạo!");
            return;
        }

        // Nếu dropdown ngành bị ẩn và người dùng nhập mã/tên ngành,
        // cần đảm bảo danh mục ngành đã load xong để suy ra `strMajor_Id` ổn định.
        try {
            var majorDropValNow = normEmpty(getValSafe('dropNganh'));
            var majorCodeNow = normEmpty(getValSafe('txtMaNganh'));
            var majorNameNow = normEmpty(getValSafe('txtTenNganh'));
            var $dropMajor = $('#dropNganh');
            var majorDropHidden = ($dropMajor && $dropMajor.length && !$dropMajor.is(':visible'));

            var needDeriveMajorId = (!majorDropValNow && (majorCodeNow || majorNameNow) && majorDropHidden);
            var dmMajorReady = (me._dmMajorLoaded === true) && (me.dtDmMajorAll && me.dtDmMajorAll.length);

            if (needDeriveMajorId && !dmMajorReady) {
                if (me._isSavingHocVan === true) return;
                me._isSavingHocVan = true;
                me.ensureDmMajor(function () {
                    me._isSavingHocVan = false;
                    me.save_HocVan();
                });
                return;
            }
        } catch (eWait) { }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4EJTQiIDUoLi8P',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Education',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strEducation_Type_Code': getValSafe('dropLoaiHinhHocVan'),
            'strEducation_Level_Code': getValSafe('dropBacDaoTao'),
            'strEducation_Status_Code': getValSafe('dropTrangThaiHoc'),
            // Backend legacy param names (đang dùng)
            'strDegree_Type_Code': getValSafe('txtMaLoaiVanBang'),
            'strBank_Name': getValSafe('txtTenNganHangHV'),
            // Aliases để đảm bảo DB lưu đúng các field mà API list đang trả về
            'strDegree_Code': getValSafe('txtMaLoaiVanBang'),
            'strDegree_Name': getValSafe('txtTenNganHangHV'),
            'strMajor_Group_Id': '',
            'strMajor_Id': '',
            'strMajor_Code': normEmpty(getValSafe('txtMaNganh')),
            'strMajor_Name': normEmpty(getValSafe('txtTenNganh')),
            'strSpecialization_Id': normEmpty(getValSafe('dropChuyenNganh')),
            'strSpecialization_Code': normEmpty(getValSafe('txtMaChuyenNganh')),
            'strSpecialization_Name': normEmpty(getValSafe('txtTenChuyenNganh')),
            'strInstitution_Id': normEmpty(getValSafe('dropCoSoDaoTao')),
            'strInstitution_Code': normEmpty(getValSafe('txtMaCoSoDaoTao')),
            'strInstitution_Name': normEmpty(getValSafe('txtTenCoSoDaoTao')),
            'strCountry_Id': normEmpty(getValSafe('dropQuocGiaHV')),
            'dEnrollment_Year': normEmpty(getValSafe('txtNamNhapHoc')),
            'strStart_Date': normalizeDateForOracle(normEmpty(getValSafe('txtNgayBatDauHoc'))),
            'strCompletion_Date': normalizeDateForOracle(normEmpty(getValSafe('txtNgayTotNghiep'))),
            'dGraduation_Year': normEmpty(getValSafe('txtNamTotNghiep')),
            'strClassification_Code': normEmpty(getValSafe('dropXepLoai')),
            'dGPA': normEmpty(getValSafe('txtGPA')),
            'dGPA_Scale': normEmpty(getValSafe('txtGPAScale')),
            'strDegree_Number': normEmpty(getValSafe('txtSoHieuVanBang')),
            'strDegree_Issue_Date': normalizeDateForOracle(normEmpty(getValSafe('txtNgayCapVanBang'))),
            'dIs_Highest': $("#chkLaTrinhDoCaoNhat").is(':checked') ? 1 : 0,
            'dIs_Primary_Major': $("#chkChuyenMonChinh").is(':checked') ? 1 : 0,
            'dIs_Recognized': $("#chkDuocCongNhan").is(':checked') ? 1 : 0,
            'strEffective_From': normalizeDateForOracle(getValSafe('txtNgayHieuLucHV')),
            'strEffective_To': normalizeDateForOracle(getValSafe('txtNgayHetHieuLucHV')),
            'dIs_Active': $("#chkHieuLucHV").is(':checked') ? 1 : 0,
            'strNote': getValSafe('txtGhiChuHV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        // Chuẩn hoá Major/Group: tránh majorId == majorGroupId (chọn nhầm node nhóm)
        var majorId = normEmpty(getValSafe('dropNganh'));
        var majorGroupId = normEmpty(getValSafe('dropNhomNganh'));

        // Nếu không chọn được ngành từ dropdown (thường do dropdown đang ẩn) -> suy ra từ mã/tên ngành
        if (!majorId) {
            var majorIdDerived = tryDeriveMajorIdFromInputs(
                getValSafe('txtMaNganh'),
                getValSafe('txtTenNganh'),
                majorGroupId
            );
            if (majorIdDerived) {
                majorId = normEmpty(majorIdDerived);
            }
        }

        if (majorId && majorGroupId && majorId === majorGroupId) {
            var derivedParent = deriveMajorGroupFromMajor(majorId);
            if (derivedParent) {
                majorGroupId = derivedParent;
            }
            else {
                // Nếu không suy ra được cha -> coi như chỉ chọn nhóm, bỏ ngành
                majorId = '';
            }
        }

        // Nếu có ngành nhưng không có nhóm -> suy ra nhóm
        if (majorId && !majorGroupId) {
            var derived = deriveMajorGroupFromMajor(majorId);
            if (derived) majorGroupId = derived;
        }

        obj_save.strMajor_Id = majorId;
        obj_save.strMajor_Group_Id = majorGroupId;
        
        if (me.strHocVan_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4EJTQiIDUoLi8P';
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
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4EJTQiIDUoLi8P',
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
    },

    /*------------------------------------------
    --Tab 5: Chứng chỉ
    -------------------------------------------*/
    getList_ChungChi: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4CJDM1KCcoIiA1JAPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Certificate',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function (item) {
                            var okPerson = item.PERSON_ID == me.strDeXuatHoSo_Id;
                            // Xóa thành công thường là set IS_ACTIVE = 0 (soft delete) -> ẩn khỏi danh sách
                            var okActive = (item.IS_ACTIVE === undefined) || (item.IS_ACTIVE == 1);
                            return okPerson && okActive;
                        });
                    }
                    me.dtChungChi = dtReRult;
                    me.genTable_ChungChi(me.dtChungChi);
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

    genTable_ChungChi: function (data) {
        var me = this;
        me.dtChungChi = data || [];
        
        var htmlBody = '';
        
        if (me.dtChungChi.length > 0) {
            for (var i = 0; i < me.dtChungChi.length; i++) {
                var item = me.dtChungChi[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (item.CERTIFICATE_TYPE_CODE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.CERTIFICATE_STATUS_CODE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.CERTIFICATE_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.CERTIFICATE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.CATEGORY_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.LEVEL_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.SCORE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.CLASSIFICATION_CODE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.CERTIFICATE_NO || '') + '</td>';
                htmlBody += '<td>' + (item.ISSUED_BY_ORG_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.COUNTRY_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.ISSUE_DATE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EXPIRE_DATE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_LIFETIME == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_MAIN_CERTIFICATE == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_VERIFIED == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_FROM || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_TO || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-primary btn-sm btnChiTiet_ChungChi" id="' + item.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_ChungChi" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_ChungChi" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="24" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblChungChi tbody").html(htmlBody);
    },

    show_ChiTietChungChi: function (strId) {
        var me = this;
        
        // Gọi API lấy chi tiết
        var obj_detail = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4CJDM1KCcoIiA1JB4DOB4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Certificate_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (response) {
                if (response.Success && response.Data && response.Data.length > 0) {
                    var data = response.Data[0];
                    
                    var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
                    strHTML += '<div class="row">';
                    strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-certificate me-2"></i>Thông tin chi tiết chứng chỉ</h5></div>';
                    
                    // Thông tin chung
                    strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-info-circle me-2"></i>Thông tin chung</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Loại chứng chỉ:</strong> ' + edu.util.returnEmpty(data.CERTIFICATE_TYPE_CODE_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Trạng thái:</strong> ' + edu.util.returnEmpty(data.CERTIFICATE_STATUS_CODE_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Mã chứng chỉ:</strong> ' + edu.util.returnEmpty(data.CERTIFICATE_CODE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên chứng chỉ:</strong> ' + edu.util.returnEmpty(data.CERTIFICATE_NAME) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Nhóm và cấp độ
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-layer-group me-2"></i>Nhóm và cấp độ</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Nhóm chứng chỉ:</strong> ' + edu.util.returnEmpty(data.CATEGORY_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Mã nhóm:</strong> ' + edu.util.returnEmpty(data.CATEGORY_CODE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Cấp độ:</strong> ' + edu.util.returnEmpty(data.LEVEL_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Mã cấp độ:</strong> ' + edu.util.returnEmpty(data.LEVEL_CODE) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Kết quả
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-trophy me-2"></i>Kết quả</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Điểm số:</strong> ' + edu.util.returnEmpty(data.SCORE) + ' / ' + edu.util.returnEmpty(data.SCORE_SCALE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Xếp loại:</strong> ' + edu.util.returnEmpty(data.CLASSIFICATION_CODE_NAME) + '</div>';
                    strHTML += '<div class="col-md-12 mb-2"><strong>Mô tả kết quả:</strong> ' + edu.util.returnEmpty(data.RESULT_TEXT) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thông tin chứng chỉ
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-id-card me-2"></i>Thông tin chứng chỉ</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Số chứng chỉ:</strong> ' + edu.util.returnEmpty(data.CERTIFICATE_NO) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Số seri:</strong> ' + edu.util.returnEmpty(data.SERIAL_NO) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Đơn vị cấp
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-building me-2"></i>Đơn vị cấp</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên đơn vị:</strong> ' + edu.util.returnEmpty(data.ISSUED_BY_ORG_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Mã đơn vị:</strong> ' + edu.util.returnEmpty(data.ISSUED_BY_ORG_CODE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Quốc gia:</strong> ' + edu.util.returnEmpty(data.COUNTRY_NAME) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thời gian
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-calendar me-2"></i>Thời gian</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày cấp:</strong> ' + edu.util.returnEmpty(data.ISSUE_DATE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hết hạn:</strong> ' + edu.util.returnEmpty(data.EXPIRE_DATE) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thông tin khác
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-cog me-2"></i>Thông tin khác</h6></div>';
                    strHTML += '<div class="col-md-4 mb-2"><strong>Vô thời hạn:</strong> ' + (data.IS_LIFETIME == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
                    strHTML += '<div class="col-md-4 mb-2"><strong>Chứng chỉ chính:</strong> ' + (data.IS_MAIN_CERTIFICATE == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
                    strHTML += '<div class="col-md-4 mb-2"><strong>Đã xác minh:</strong> ' + (data.IS_VERIFIED == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_FROM) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hết hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_TO) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Hiệu lực:</strong> ' + (data.IS_ACTIVE == 1 ? '<span class="badge bg-success">Có hiệu lực</span>' : '<span class="badge bg-secondary">Hết hiệu lực</span>') + '</div>';
                    strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';
                    
                    strHTML += '</div></div>';
                    
                    edu.system.alert(strHTML);
                }
                else {
                    edu.system.alert("Không tìm thấy thông tin chi tiết!");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },

    toggle_FormChungChi: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormChungChi");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CERTIFICATE_TYPE_CODE", "dropLoaiChungChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CERTIFICATE_STATUS_CODE", "dropTrangThaiChungChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CERTIFICATE_CODE", "dropMaChungChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CATEGORY_ID", "dropNhomChungChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.LEVEL_ID", "dropCapDoChungChi");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CLASSIFICATION_CODE", "dropXepLoaiCC");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.ISSUED_BY_ORG_ID", "dropDonViCap");
        // Quốc gia: một số môi trường chưa khai báo danh mục theo PERSON_CERTIFICATE.COUNTRY_ID
        // -> fallback sang PERSON_ADDRESS.COUNTRY_ID (đang dùng ổn ở Tab Địa chỉ).
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.COUNTRY_ID", "dropQuocGiaCC", "", function () {
            try {
                if ($('#dropQuocGiaCC option').length <= 1) {
                    edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.COUNTRY_ID", "dropQuocGiaCC");
                }
            } catch (e) { }
        });
    },

    clearForm_ChungChi: function () {
        edu.util.viewValById("dropLoaiChungChi", "");
        edu.util.viewValById("dropTrangThaiChungChi", "");
        edu.util.viewValById("dropMaChungChi", "");
        edu.util.viewValById("txtTenChungChi", "");
        edu.util.viewValById("dropNhomChungChi", "");
        edu.util.viewValById("txtMaNhomChungChi", "");
        edu.util.viewValById("txtTenNhomChungChi", "");
        edu.util.viewValById("dropCapDoChungChi", "");
        edu.util.viewValById("txtMaCapDo", "");
        edu.util.viewValById("txtTenCapDo", "");
        edu.util.viewValById("txtDiemSo", "");
        edu.util.viewValById("txtThangDiem", "");
        edu.util.viewValById("dropXepLoaiCC", "");
        edu.util.viewValById("txtMoTaKetQua", "");
        edu.util.viewValById("txtSoChungChi", "");
        edu.util.viewValById("txtSoSeri", "");
        edu.util.viewValById("dropDonViCap", "");
        edu.util.viewValById("txtMaDonViCap", "");
        edu.util.viewValById("txtTenDonViCap", "");
        edu.util.viewValById("dropQuocGiaCC", "");
        edu.util.viewValById("txtNgayCap", "");
        edu.util.viewValById("txtNgayHetHan", "");
        $("#chkVoThoiHan").prop('checked', false);
        $("#chkChungChiChinh").prop('checked', false);
        $("#chkDaXacMinh").prop('checked', false);
        edu.util.viewValById("txtNgayHieuLucCC", "");
        edu.util.viewValById("txtNgayHetHieuLucCC", "");
        $("#chkHieuLucCC").prop('checked', true);
        edu.util.viewValById("txtGhiChuCC", "");
    },

    loadForm_ChungChi: function (data) {
        var certTypeCode = data.CERTIFICATE_TYPE_CODE;
        var certStatusCode = data.CERTIFICATE_STATUS_CODE;
        var certCode = data.CERTIFICATE_CODE;
        var categoryId = data.CATEGORY_ID;
        var levelId = data.LEVEL_ID;
        var classificationCode = data.CLASSIFICATION_CODE;
        var issuedByOrgId = data.ISSUED_BY_ORG_ID;
        var countryId = data.COUNTRY_ID;

        // Combo danh mục load async -> set value trong callback để không bị lệch khi mở form Sửa
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CERTIFICATE_TYPE_CODE", "dropLoaiChungChi", "", function () {
            edu.util.viewValById("dropLoaiChungChi", certTypeCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CERTIFICATE_STATUS_CODE", "dropTrangThaiChungChi", "", function () {
            edu.util.viewValById("dropTrangThaiChungChi", certStatusCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CERTIFICATE_CODE", "dropMaChungChi", "", function () {
            edu.util.viewValById("dropMaChungChi", certCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CATEGORY_ID", "dropNhomChungChi", "", function () {
            edu.util.viewValById("dropNhomChungChi", categoryId || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.LEVEL_ID", "dropCapDoChungChi", "", function () {
            edu.util.viewValById("dropCapDoChungChi", levelId || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.CLASSIFICATION_CODE", "dropXepLoaiCC", "", function () {
            edu.util.viewValById("dropXepLoaiCC", classificationCode || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.ISSUED_BY_ORG_ID", "dropDonViCap", "", function () {
            edu.util.viewValById("dropDonViCap", issuedByOrgId || "");
        });
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.COUNTRY_ID", "dropQuocGiaCC", "", function () {
            // Fallback nếu danh mục chứng chỉ không có dữ liệu
            try {
                if ($('#dropQuocGiaCC option').length <= 1) {
                    edu.system.loadToCombo_DanhMucDuLieu("PERSON_ADDRESS.COUNTRY_ID", "dropQuocGiaCC", "", function () {
                        edu.util.viewValById("dropQuocGiaCC", countryId || "");
                    });
                    return;
                }
            } catch (e) { }
            edu.util.viewValById("dropQuocGiaCC", countryId || "");
        });

        edu.util.viewValById("txtTenChungChi", data.CERTIFICATE_NAME);
        edu.util.viewValById("txtMaNhomChungChi", data.CATEGORY_CODE);
        edu.util.viewValById("txtTenNhomChungChi", data.CATEGORY_NAME);
        edu.util.viewValById("txtMaCapDo", data.LEVEL_CODE);
        edu.util.viewValById("txtTenCapDo", data.LEVEL_NAME);
        edu.util.viewValById("txtDiemSo", data.SCORE);
        edu.util.viewValById("txtThangDiem", data.SCORE_SCALE);
        edu.util.viewValById("txtMoTaKetQua", data.RESULT_TEXT);
        edu.util.viewValById("txtSoChungChi", data.CERTIFICATE_NO);
        edu.util.viewValById("txtSoSeri", data.SERIAL_NO);
        edu.util.viewValById("txtMaDonViCap", data.ISSUED_BY_ORG_CODE);
        edu.util.viewValById("txtTenDonViCap", data.ISSUED_BY_ORG_NAME);
        edu.util.viewValById("txtNgayCap", data.ISSUE_DATE);
        edu.util.viewValById("txtNgayHetHan", data.EXPIRE_DATE);
        $("#chkVoThoiHan").prop('checked', data.IS_LIFETIME == 1);
        $("#chkChungChiChinh").prop('checked', data.IS_MAIN_CERTIFICATE == 1);
        $("#chkDaXacMinh").prop('checked', data.IS_VERIFIED == 1);
        edu.util.viewValById("txtNgayHieuLucCC", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLucCC", data.EFFECTIVE_TO);
        $("#chkHieuLucCC").prop('checked', data.IS_ACTIVE == 1);
        edu.util.viewValById("txtGhiChuCC", data.NOTE);
    },

    save_ChungChi: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropLoaiChungChi")) {
            edu.system.alert("Vui lòng chọn loại chứng chỉ!");
            return;
        }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4CJDM1KCcoIiA1JAPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Certificate',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strCertificate_Type_Code': edu.system.getValById('dropLoaiChungChi'),
            'strCertificate_Status_Code': edu.system.getValById('dropTrangThaiChungChi'),
            'strCertificate_Code': edu.system.getValById('dropMaChungChi'),
            'strCertificate_Name': edu.system.getValById('txtTenChungChi'),
            'strCategory_Id': edu.system.getValById('dropNhomChungChi'),
            'strCategory_Code': edu.system.getValById('txtMaNhomChungChi'),
            'strCategory_Name': edu.system.getValById('txtTenNhomChungChi'),
            'strLevel_Id': edu.system.getValById('dropCapDoChungChi'),
            'strLevel_Code': edu.system.getValById('txtMaCapDo'),
            'strLevel_Name': edu.system.getValById('txtTenCapDo'),
            'dScore': edu.system.getValById('txtDiemSo'),
            'dScore_Scale': edu.system.getValById('txtThangDiem'),
            'strClassification_Code': edu.system.getValById('dropXepLoaiCC'),
            'strResult_Text': edu.system.getValById('txtMoTaKetQua'),
            'strCertificate_No': edu.system.getValById('txtSoChungChi'),
            'strSerial_No': edu.system.getValById('txtSoSeri'),
            'strIssued_By_Org_Id': edu.system.getValById('dropDonViCap'),
            'strIssued_By_Org_Code': edu.system.getValById('txtMaDonViCap'),
            'strIssued_By_Org_Name': edu.system.getValById('txtTenDonViCap'),
            'strCountry_Id': edu.system.getValById('dropQuocGiaCC'),
            'strIssue_Date': edu.system.getValById('txtNgayCap'),
            'strExpire_Date': edu.system.getValById('txtNgayHetHan'),
            'dIs_Lifetime': $("#chkVoThoiHan").is(':checked') ? 1 : 0,
            'dIs_Main_Certificate': $("#chkChungChiChinh").is(':checked') ? 1 : 0,
            'dIs_Verified': $("#chkDaXacMinh").is(':checked') ? 1 : 0,
            'strFile_Id': edu.system.getValById('uploadFileChungChi'),
            'strEffective_From': edu.system.getValById('txtNgayHieuLucCC'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLucCC'),
            'dIs_Active': $("#chkHieuLucCC").is(':checked') ? 1 : 0,
            'strNote': edu.system.getValById('txtGhiChuCC'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strChungChi_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4CJDM1KCcoIiA1JAPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Certificate';
            obj_save.strId = me.strChungChi_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strChungChi_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_ChungChi();
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

    delete_ChungChi: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4CJDM1KCcoIiA1JAPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Certificate',
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
                    me.getList_ChungChi();
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

    /*-------------------------------------------
    --Tab 6: Tài liệu
    -------------------------------------------*/
    getList_TaiLieu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4FLiI0LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Document',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function(item) {
                            return item.PERSON_ID == me.strDeXuatHoSo_Id;
                        });
                    }
                    me.dtTaiLieu = dtReRult;
                    me.genTable_TaiLieu(me.dtTaiLieu);
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

    genTable_TaiLieu: function (data) {
        var me = this;
        me.dtTaiLieu = data || [];
        
        var htmlBody = '';
        
        if (me.dtTaiLieu.length > 0) {
            for (var i = 0; i < me.dtTaiLieu.length; i++) {
                var item = me.dtTaiLieu[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td class="text-center">' + (item.DOCUMENT_TYPE_CODE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.DOCUMENT_STATUS_CODE_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.DOCUMENT_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.DOCUMENT_NO || '') + '</td>';
                htmlBody += '<td>' + (item.DOCUMENT_TITLE || '') + '</td>';
                htmlBody += '<td>' + (item.FILE_ID || '') + '</td>';
                htmlBody += '<td>' + (item.FILE_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.FILE_EXT || '') + '</td>';
                htmlBody += '<td>' + (item.ISSUED_BY_ORG_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.ISSUED_BY_ORG_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.ISSUED_BY_ORG_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.ISSUE_DATE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EXPIRE_DATE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_FROM || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_TO || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-primary btn-sm btnChiTiet_TaiLieu" id="' + item.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_TaiLieu" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_TaiLieu" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="21" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblTaiLieu tbody").html(htmlBody);
    },

    show_ChiTietTaiLieu: function (strId) {
        var me = this;
        
        // Gọi API lấy chi tiết
        var obj_detail = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4FLiI0LCQvNR4DOB4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Document_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (response) {
                if (response.Success && response.Data && response.Data.length > 0) {
                    var data = response.Data[0];
                    
                    var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
                    strHTML += '<div class="row">';
                    strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-file-alt me-2"></i>Thông tin chi tiết tài liệu</h5></div>';
                    
                    // Thông tin chung
                    strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-info-circle me-2"></i>Thông tin chung</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Loại tài liệu:</strong> ' + edu.util.returnEmpty(data.DOCUMENT_TYPE_CODE_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Trạng thái:</strong> ' + edu.util.returnEmpty(data.DOCUMENT_STATUS_CODE_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên tài liệu:</strong> ' + edu.util.returnEmpty(data.DOCUMENT_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Số hiệu:</strong> ' + edu.util.returnEmpty(data.DOCUMENT_NO) + '</div>';
                    strHTML += '<div class="col-md-12 mb-2"><strong>Tiêu đề:</strong> ' + edu.util.returnEmpty(data.DOCUMENT_TITLE) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thông tin file
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-file me-2"></i>Thông tin file</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>File ID:</strong> ' + edu.util.returnEmpty(data.FILE_ID) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên file:</strong> ' + edu.util.returnEmpty(data.FILE_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Phần mở rộng:</strong> ' + edu.util.returnEmpty(data.FILE_EXT) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Đơn vị cấp
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-building me-2"></i>Đơn vị cấp</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên đơn vị:</strong> ' + edu.util.returnEmpty(data.ISSUED_BY_ORG_NAME) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Mã đơn vị:</strong> ' + edu.util.returnEmpty(data.ISSUED_BY_ORG_CODE) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thời gian
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-calendar me-2"></i>Thời gian</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày cấp:</strong> ' + edu.util.returnEmpty(data.ISSUE_DATE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hết hạn:</strong> ' + edu.util.returnEmpty(data.EXPIRE_DATE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_FROM) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hết hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_TO) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thông tin khác
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-cog me-2"></i>Thông tin khác</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Hiệu lực:</strong> ' + (data.IS_ACTIVE == 1 ? '<span class="badge bg-success">Có hiệu lực</span>' : '<span class="badge bg-secondary">Hết hiệu lực</span>') + '</div>';
                    strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';
                    
                    strHTML += '</div></div>';
                    
                    edu.system.alert(strHTML);
                }
                else {
                    edu.system.alert("Không tìm thấy thông tin chi tiết!");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },

    toggle_FormTaiLieu: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormTaiLieu");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_DOCUMENT.DOCUMENT_TYPE_CODE", "dropLoaiTaiLieu");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_DOCUMENT.DOCUMENT_STATUS_CODE", "dropTrangThaiTaiLieu");
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_DOCUMENT.ISSUED_BY_ORG_ID", "dropDonViCapTL");
    },

    clearForm_TaiLieu: function () {
        edu.util.viewValById("dropLoaiTaiLieu", "");
        edu.util.viewValById("dropTrangThaiTaiLieu", "");
        edu.util.viewValById("txtTenTaiLieu", "");
        edu.util.viewValById("txtSoHieu", "");
        edu.util.viewValById("txtTieuDe", "");
        edu.util.viewValById("uploadFileTaiLieu", "");
        edu.util.viewValById("txtTenFile", "");
        edu.util.viewValById("txtPhanMoRong", "");
        edu.util.viewValById("dropDonViCapTL", "");
        edu.util.viewValById("txtMaDonViCapTL", "");
        edu.util.viewValById("txtTenDonViCapTL", "");
        edu.util.viewValById("txtNgayCapTL", "");
        edu.util.viewValById("txtNgayHetHanTL", "");
        edu.util.viewValById("txtNgayHieuLucTL", "");
        edu.util.viewValById("txtNgayHetHieuLucTL", "");
        $("#chkHieuLucTL").prop('checked', true);
        edu.util.viewValById("txtGhiChuTL", "");
    },

    loadForm_TaiLieu: function (data) {
        edu.util.viewValById("dropLoaiTaiLieu", data.DOCUMENT_TYPE_CODE);
        edu.util.viewValById("dropTrangThaiTaiLieu", data.DOCUMENT_STATUS_CODE);
        edu.util.viewValById("txtTenTaiLieu", data.DOCUMENT_NAME);
        edu.util.viewValById("txtSoHieu", data.DOCUMENT_NO);
        edu.util.viewValById("txtTieuDe", data.DOCUMENT_TITLE);
        edu.util.viewValById("txtTenFile", data.FILE_NAME);
        edu.util.viewValById("txtPhanMoRong", data.FILE_EXT);
        edu.util.viewValById("dropDonViCapTL", data.ISSUED_BY_ORG_ID);
        edu.util.viewValById("txtMaDonViCapTL", data.ISSUED_BY_ORG_CODE);
        edu.util.viewValById("txtTenDonViCapTL", data.ISSUED_BY_ORG_NAME);
        edu.util.viewValById("txtNgayCapTL", data.ISSUE_DATE);
        edu.util.viewValById("txtNgayHetHanTL", data.EXPIRE_DATE);
        edu.util.viewValById("txtNgayHieuLucTL", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLucTL", data.EFFECTIVE_TO);
        $("#chkHieuLucTL").prop('checked', data.IS_ACTIVE == 1);
        edu.util.viewValById("txtGhiChuTL", data.NOTE);
    },

    save_TaiLieu: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropLoaiTaiLieu")) {
            edu.system.alert("Vui lòng chọn loại tài liệu!");
            return;
        }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4FLiI0LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Document',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strDocument_Type_Code': edu.system.getValById('dropLoaiTaiLieu'),
            'strDocument_Status_Code': edu.system.getValById('dropTrangThaiTaiLieu'),
            'strDocument_Name': edu.system.getValById('txtTenTaiLieu'),
            'strDocument_No': edu.system.getValById('txtSoHieu'),
            'strDocument_Title': edu.system.getValById('txtTieuDe'),
            'strFile_Id': edu.system.getValById('uploadFileTaiLieu'),
            'strFile_Name': edu.system.getValById('txtTenFile'),
            'strFile_Ext': edu.system.getValById('txtPhanMoRong'),
            'strMime_Type': '',
            'dFile_Size': 0,
            'strIssued_By_Org_Id': edu.system.getValById('dropDonViCapTL'),
            'strIssued_By_Org_Code': edu.system.getValById('txtMaDonViCapTL'),
            'strIssued_By_Org_Name': edu.system.getValById('txtTenDonViCapTL'),
            'strIssue_Date': edu.system.getValById('txtNgayCapTL'),
            'strEffective_From': edu.system.getValById('txtNgayHieuLucTL'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLucTL'),
            'strExpire_Date': edu.system.getValById('txtNgayHetHanTL'),
            'strRelated_Table_Name': '',
            'strRelated_Record_Id': '',
            'strRelated_Field_Code': '',
            'dVersion_No': 1,
            'dIs_Primary': 0,
            'dIs_Verified': 0,
            'dIs_Confidential': 0,
            'dIs_Active': $("#chkHieuLucTL").is(':checked') ? 1 : 0,
            'dSort_Order': 0,
            'strNote': edu.system.getValById('txtGhiChuTL'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strTaiLieu_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4FLiI0LCQvNQPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Document';
            obj_save.strId = me.strTaiLieu_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strTaiLieu_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_TaiLieu();
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

    delete_TaiLieu: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4FLiI0LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Document',
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
                    me.getList_TaiLieu();
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

    /*-------------------------------------------
    --Tab 7: Học hàm
    -------------------------------------------*/
    getList_HocHam: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8q',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Academic_Rank',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    // Lọc chỉ lấy dữ liệu của người được chọn
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function (item) {
                            var okPerson = item.PERSON_ID == me.strDeXuatHoSo_Id;
                            // Xóa thành công thường là set IS_ACTIVE = 0 (soft delete) -> ẩn khỏi danh sách
                            var okActive = (item.IS_ACTIVE === undefined) || (item.IS_ACTIVE == 1);
                            return okPerson && okActive;
                        });
                    }
                    me.dtHocHam = dtReRult;
                    me.genTable_HocHam(me.dtHocHam);
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

    genTable_HocHam: function (data) {
        var me = this;
        me.dtHocHam = data || [];
        
        var htmlBody = '';
        
        if (me.dtHocHam.length > 0) {
            for (var i = 0; i < me.dtHocHam.length; i++) {
                var item = me.dtHocHam[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td>' + (item.ACADEMIC_RANK_CODE || '') + '</td>';
                htmlBody += '<td>' + (item.ACADEMIC_RANK_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.DECISION_NO || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.DECISION_DATE || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.RECOGNITION_DATE || '') + '</td>';
                htmlBody += '<td>' + (item.ISSUED_BY_ORG_ID_NAME || '') + '</td>';
                htmlBody += '<td>' + (item.ISSUED_BY_ORG_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.IS_CURRENT == 1 ? '<i class="fa fa-check text-success"></i>' : '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_FROM || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.EFFECTIVE_TO || '') + '</td>';
                htmlBody += '<td class="text-center">';
                if (item.IS_ACTIVE == 1) {
                    htmlBody += '<span class="badge bg-success">Có hiệu lực</span>';
                } else {
                    htmlBody += '<span class="badge bg-secondary">Hết hiệu lực</span>';
                }
                htmlBody += '</td>';
                htmlBody += '<td>' + (item.NOTE || '') + '</td>';
                htmlBody += '<td class="text-center"><a class="btn btn-primary btn-sm btnChiTiet_HocHam" id="' + item.ID + '" title="Chi tiết"><i class="fa fa-eye me-1"></i>Chi tiết</a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-default btn-sm btnEdit_HocHam" id="' + item.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></td>';
                htmlBody += '<td class="text-center"><a class="btn btn-danger btn-sm btnDelete_HocHam" id="' + item.ID + '" title="Xóa"><i class="fa fa-trash"></i></a></td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="16" class="text-center" style="padding: 40px;"><i class="fa-solid fa-inbox fa-3x"></i><div>Chưa có dữ liệu</div></td></tr>';
        }
        
        $("#tblHocHam tbody").html(htmlBody);
    },

    show_ChiTietHocHam: function (strId) {
        var me = this;
        
        // Gọi API lấy chi tiết
        var obj_detail = {
            'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8qHgM4Hggl',
            'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Academic_Rank_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (response) {
                if (response.Success && response.Data && response.Data.length > 0) {
                    var data = response.Data[0];
                    
                    var strHTML = '<div class="container-fluid" style="max-height: 70vh; overflow-y: auto;">';
                    strHTML += '<div class="row">';
                    strHTML += '<div class="col-12"><h5 class="text-primary mb-3"><i class="fa fa-graduation-cap me-2"></i>Thông tin chi tiết học hàm</h5></div>';
                    
                    // Thông tin chung
                    strHTML += '<div class="col-12"><h6 class="text-success mt-2"><i class="fa fa-info-circle me-2"></i>Thông tin chung</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Mã học hàm:</strong> ' + edu.util.returnEmpty(data.ACADEMIC_RANK_CODE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên học hàm:</strong> ' + edu.util.returnEmpty(data.ACADEMIC_RANK_NAME) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Quyết định
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-file-alt me-2"></i>Quyết định công nhận</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Số quyết định:</strong> ' + edu.util.returnEmpty(data.DECISION_NO) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày quyết định:</strong> ' + edu.util.returnEmpty(data.DECISION_DATE) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày công nhận:</strong> ' + edu.util.returnEmpty(data.RECOGNITION_DATE) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Đơn vị cấp
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-building me-2"></i>Đơn vị cấp</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Tên đơn vị:</strong> ' + edu.util.returnEmpty(data.ISSUED_BY_ORG_NAME) + '</div>';
                    strHTML += '<div class="col-md-12"><hr></div>';
                    
                    // Thông tin khác
                    strHTML += '<div class="col-12"><h6 class="text-success"><i class="fa fa-cog me-2"></i>Thông tin khác</h6></div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Học hàm hiện tại:</strong> ' + (data.IS_CURRENT == 1 ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>') + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_FROM) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Ngày hết hiệu lực:</strong> ' + edu.util.returnEmpty(data.EFFECTIVE_TO) + '</div>';
                    strHTML += '<div class="col-md-6 mb-2"><strong>Hiệu lực:</strong> ' + (data.IS_ACTIVE == 1 ? '<span class="badge bg-success">Có hiệu lực</span>' : '<span class="badge bg-secondary">Hết hiệu lực</span>') + '</div>';
                    strHTML += '<div class="col-md-12 mb-2"><strong>Ghi chú:</strong> ' + edu.util.returnEmpty(data.NOTE) + '</div>';
                    
                    strHTML += '</div></div>';
                    
                    edu.system.alert(strHTML);
                }
                else {
                    edu.system.alert("Không tìm thấy thông tin chi tiết!");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },

    toggle_FormHocHam: function () {
        edu.util.toggle_overide("zone-bus", "zoneFormHocHam");
        
        // Load danh mục khi mở form
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ACADEMIC_RANK.ACADEMIC_RANK_CODE", "dropMaHocHam");
        // Đơn vị cấp: một số môi trường chưa khai báo danh mục theo PERSON_ACADEMIC_RANK.ISSUED_BY_ORG_ID
        // -> fallback sang danh mục đang dùng ổn ở Tab Chứng chỉ/Tài liệu.
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ACADEMIC_RANK.ISSUED_BY_ORG_ID", "dropDonViCapHH", "", function () {
            try {
                if ($('#dropDonViCapHH option').length <= 1) {
                    edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.ISSUED_BY_ORG_ID", "dropDonViCapHH", "", function () {
                        try {
                            if ($('#dropDonViCapHH option').length <= 1) {
                                edu.system.loadToCombo_DanhMucDuLieu("PERSON_DOCUMENT.ISSUED_BY_ORG_ID", "dropDonViCapHH");
                            }
                        } catch (e2) { }
                    });
                }
            } catch (e) { }
        });
    },

    clearForm_HocHam: function () {
        edu.util.viewValById("dropMaHocHam", "");
        edu.util.viewValById("txtTenHocHam", "");
        edu.util.viewValById("txtSoQuyetDinhHH", "");
        edu.util.viewValById("txtNgayQuyetDinhHH", "");
        edu.util.viewValById("txtNgayCongNhanHH", "");
        edu.util.viewValById("dropDonViCapHH", "");
        edu.util.viewValById("txtTenDonViCapHH", "");
        $("#chkHocHamHienTai").prop('checked', false);
        edu.util.viewValById("txtNgayHieuLucHH", "");
        edu.util.viewValById("txtNgayHetHieuLucHH", "");
        $("#chkHieuLucHH").prop('checked', true);
        edu.util.viewValById("txtGhiChuHH", "");
    },

    loadForm_HocHam: function (data) {
        var academicRankCode = data.ACADEMIC_RANK_CODE;
        var issuedByOrgId = data.ISSUED_BY_ORG_ID;

        // Combo danh mục load async -> set value trong callback để không bị lệch khi mở form Sửa
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ACADEMIC_RANK.ACADEMIC_RANK_CODE", "dropMaHocHam", "", function () {
            edu.util.viewValById("dropMaHocHam", academicRankCode || "");
        });

        // Đơn vị cấp: load theo danh mục học hàm, fallback sang chứng chỉ/tài liệu nếu rỗng
        edu.system.loadToCombo_DanhMucDuLieu("PERSON_ACADEMIC_RANK.ISSUED_BY_ORG_ID", "dropDonViCapHH", "", function () {
            try {
                if ($('#dropDonViCapHH option').length <= 1) {
                    edu.system.loadToCombo_DanhMucDuLieu("PERSON_CERTIFICATE.ISSUED_BY_ORG_ID", "dropDonViCapHH", "", function () {
                        try {
                            if ($('#dropDonViCapHH option').length <= 1) {
                                edu.system.loadToCombo_DanhMucDuLieu("PERSON_DOCUMENT.ISSUED_BY_ORG_ID", "dropDonViCapHH", "", function () {
                                    edu.util.viewValById("dropDonViCapHH", issuedByOrgId || "");
                                });
                                return;
                            }
                        } catch (e2) { }
                        edu.util.viewValById("dropDonViCapHH", issuedByOrgId || "");
                    });
                    return;
                }
            } catch (e) { }
            edu.util.viewValById("dropDonViCapHH", issuedByOrgId || "");
        });

        edu.util.viewValById("txtTenHocHam", data.ACADEMIC_RANK_NAME);
        edu.util.viewValById("txtSoQuyetDinhHH", data.DECISION_NO);
        edu.util.viewValById("txtNgayQuyetDinhHH", data.DECISION_DATE);
        edu.util.viewValById("txtNgayCongNhanHH", data.RECOGNITION_DATE);
        edu.util.viewValById("txtTenDonViCapHH", data.ISSUED_BY_ORG_NAME);
        $("#chkHocHamHienTai").prop('checked', data.IS_CURRENT == 1);
        edu.util.viewValById("txtNgayHieuLucHH", data.EFFECTIVE_FROM);
        edu.util.viewValById("txtNgayHetHieuLucHH", data.EFFECTIVE_TO);
        $("#chkHieuLucHH").prop('checked', data.IS_ACTIVE == 1);
        edu.util.viewValById("txtGhiChuHH", data.NOTE);
    },

    save_HocHam: function () {
        var me = this;
        
        // Validation
        if (!edu.util.getValById("dropMaHocHam")) {
            edu.system.alert("Vui lòng chọn mã học hàm!");
            return;
        }
        
        var obj_save = {
            'action': 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AIiAlJCwoIh4TIC8q',
            'func': 'PKG_CORE_HOSONHANSU_06.Ins_Person_Academic_Rank',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': me.strDeXuatHoSo_Id,
            'strAcademic_Rank_Code': edu.system.getValById('dropMaHocHam'),
            'strAcademic_Rank_Name': edu.system.getValById('txtTenHocHam'),
            'strDecision_No': edu.system.getValById('txtSoQuyetDinhHH'),
            'strDecision_Date': edu.system.getValById('txtNgayQuyetDinhHH'),
            'strRecognition_Date': edu.system.getValById('txtNgayCongNhanHH'),
            'strIssued_By_Org_Id': edu.system.getValById('dropDonViCapHH'),
            'strIssued_By_Org_Name': edu.system.getValById('txtTenDonViCapHH'),
            'dIs_Current': $("#chkHocHamHienTai").is(':checked') ? 1 : 0,
            'dIs_Active': $("#chkHieuLucHH").is(':checked') ? 1 : 0,
            'strEffective_From': edu.system.getValById('txtNgayHieuLucHH'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLucHH'),
            'strNote': edu.system.getValById('txtGhiChuHH'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (me.strHocHam_Id) {
            obj_save.action = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AIiAlJCwoIh4TIC8q';
            obj_save.func = 'PKG_CORE_HOSONHANSU_06.Upd_Person_Academic_Rank';
            obj_save.strId = me.strHocHam_Id;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(me.strHocHam_Id ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.toggle_ChiTietHoSo();
                    me.getList_HocHam();
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

    delete_HocHam: function (strId) {
        var me = this;
        var obj_delete = {
            'action': 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4AIiAlJCwoIh4TIC8q',
            'func': 'PKG_CORE_HOSONHANSU_06.Del_Person_Academic_Rank',
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
                    me.getList_HocHam();
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
    
    /*-------------------------------------------
    --Thùng rác
    -------------------------------------------*/
    toggle_ThungRac: function () {
        edu.util.toggle_overide("zone-bus", "zoneThungRac");
    },
    
    getList_ThungRac: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/BiQ1Ai4zJBEkMzIuLwM4DyY0LigVIC4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_05.GetCorePersonByNguoiTaoId',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    // Lọc chỉ lấy người đã xóa (IS_ACTIVE = 0)
                    if (dtReRult && dtReRult.length > 0) {
                        dtReRult = dtReRult.filter(function(item) {
                            return item.IS_ACTIVE == 0;
                        });
                    }
                    me.genTable_ThungRac(dtReRult);
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
            fakedb: []
        }, false, false, false, null);
    },
    
    genTable_ThungRac: function (data) {
        var me = this;
        var htmlBody = '';
        
        // Cập nhật tổng số
        $("#lblTongThungRac").text(data ? data.length : 0);
        
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var stt = i + 1;
                
                htmlBody += '<tr>';
                htmlBody += '<td class="text-center">' + stt + '</td>';
                htmlBody += '<td>' + (item.FULL_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.DATE_OF_BIRTH || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.GENDER_NAME || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.UPDATED_AT_DD_MM_YYYY_HHMMSS || item.CREATED_AT_DD_MM_YYYY_HHMMSS || '') + '</td>';
                htmlBody += '<td class="text-center">' + (item.UPDATED_BY_TAIKHOAN || item.CREATED_BY_TAIKHOAN || '') + '</td>';
                htmlBody += '<td class="text-center">';
                htmlBody += '<a class="btn btn-danger btn-sm btnDeletePermanent" id="' + item.ID + '" title="Xóa vĩnh viễn">';
                htmlBody += '<i class="fa fa-trash-alt"></i></a>';
                htmlBody += '</td>';
                htmlBody += '<td class="text-center">';
                htmlBody += '<input type="checkbox" class="checkXThungRac" id="checkXThungRac' + item.ID + '" />';
                htmlBody += '</td>';
                htmlBody += '</tr>';
            }
        } else {
            htmlBody += '<tr><td colspan="8" class="text-center" style="padding: 40px;">';
            htmlBody += '<i class="fa-solid fa-inbox fa-3x"></i>';
            htmlBody += '<div>Thùng rác trống</div>';
            htmlBody += '</td></tr>';
        }
        
        $("#tblThungRac tbody").html(htmlBody);
    },
    
    restore_DeXuatHoSo: function (strId) {
        var me = this;
        var obj_restore = {
            'action': 'NS_HoSoNhanSu5_MH/FDElIDUkAi4zJBEkMzIuLwPP',
            'func': 'PKG_CORE_HOSONHANSU_05.UpdateCorePerson',
            'iM': edu.system.iM,
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Khôi phục thành công!");
                    me.getList_ThungRac();
                    me.getList_DeXuatHoSo();
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
            action: obj_restore.action,
            data: obj_restore,
            fakedb: []
        }, false, false, false, null);
    },
    
    permanentDelete_DeXuatHoSo: function (strId) {
        var me = this;
        // Gọi API xóa vĩnh viễn - có thể cần API khác hoặc thêm tham số
        var obj_delete = {
            'action': 'NS_HoSoNhanSu5_MH/BSQtJDUkAi4zJBEkMzIuLwPP',
            'func': 'PKG_CORE_HOSONHANSU_05.DeleteCorePerson',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'bPermanent': true, // Thêm flag để backend biết xóa vĩnh viễn
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa vĩnh viễn thành công!");
                    me.getList_ThungRac();
                    me.getList_DeXuatHoSo();
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


};