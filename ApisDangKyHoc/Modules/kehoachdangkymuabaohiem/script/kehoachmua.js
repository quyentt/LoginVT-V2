function KeHoachMua() {}
KeHoachMua.prototype = {
    dtKeHoachMua: [],
    dtLoaiKhoan_DonGia: [],
    dtPhamVi_DoiTuong: [],
    dtKetQua_DangKyMua: [],
    strKeHoachMua_Id_Selected: "",
    strLoaiKhoan_DonGia_Id_Selected: "",
    strPhamVi_DoiTuong_Id_Selected: "",
    arrPhamVi_PV: [],
    filter: {
        strTuKhoa: "",
        strLoaiKeHoach_Id: "",
        strTinhTrang_Id: "",
        dHieuLuc: "",
        strTuNgay: "",
        strDenNgay: ""
    },

    init: function () {
        var me = this;

        me.loadCombo_LoaiKeHoach();
        me.loadCombo_TinhTrang();
        me.loadCombo_LoaiKeHoach_Form();
        me.loadCombo_TinhTrang_Form();
        me.loadCombo_ThoiGianDaoTao_Form();
        me.loadCombo_KhoanThu_LK();
        me.loadCombo_PhanLoai_LK();
        me.loadCombo_DonViTinh_LK();

        me.toggle_detail("zonebatdau");

        $(document).off("click.btnMoKHM", "#btnMoKeHoachMoi").on("click.btnMoKHM", "#btnMoKeHoachMoi", function () {
            me.strKeHoachMua_Id_Selected = "";
            me.fillForm_KeHoachMua(null);
            me.setFormMode("add");
            me.toggle_detail("zoneEdit_KeHoach");
        });

        $(document).off("click.btnCloseToggle", ".btnCloseToggle").on("click.btnCloseToggle", ".btnCloseToggle", function () {
            me.toggle_detail("zonebatdau");
        });

        $(document).off("click.btnLuuKH", "#btnLuu_KeHoach").on("click.btnLuuKH", "#btnLuu_KeHoach", function () {
            me.save_KeHoachMua();
        });

        $(document).off("click.btnXoaKH", "#btnXoa_KeHoach").on("click.btnXoaKH", "#btnXoa_KeHoach", function () {
            if (!me.strKeHoachMua_Id_Selected) {
                edu.system.alert("Chưa chọn kế hoạch để xóa!", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa kế hoạch này không?");
            $("#btnYes").off("click.doXoaKH").on("click.doXoaKH", function () {
                me.delete_KeHoachMua();
            });
        });

        $(document).off("click.openAddLK", ".btnThemMoi_LoaiKhoan_DonGia").on("click.openAddLK", ".btnThemMoi_LoaiKhoan_DonGia", function () {
            me.resetForm_LoaiKhoan_DonGia();
            me.setFormMode_LoaiKhoan("add");
            me.showModal("add_loaikhoan_donGia");
        });

        $(document).off("click.dismissModal", '[data-bs-dismiss="modal"]').on("click.dismissModal", '[data-bs-dismiss="modal"]', function (e) {
            e.preventDefault();
            var $modal = $(this).closest(".modal");
            if ($modal.length) {
                me.hideModal($modal.attr("id"));
            }
        });

        $(document).off("click.detailLK", ".btnChiTiet_LoaiKhoan").on("click.detailLK", ".btnChiTiet_LoaiKhoan", function () {
            var strId = $(this).attr("id");
            me.strLoaiKhoan_DonGia_Id_Selected = strId;
            me.getDetail_LoaiKhoan_DonGia();
        });

        $(document).off("click.btnLuuLK", "#btnLuu_LoaiKhoan_DonGia").on("click.btnLuuLK", "#btnLuu_LoaiKhoan_DonGia", function () {
            me.save_LoaiKhoan_DonGia();
        });

        $(document).off("click.btnXoaLK", "#btnXoa_LoaiKhoan_DonGia").on("click.btnXoaLK", "#btnXoa_LoaiKhoan_DonGia", function () {
            if (!me.strLoaiKhoan_DonGia_Id_Selected) {
                edu.system.alert("Chưa chọn loại khoản để xóa!", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa loại khoản và đơn giá này không?");
            $("#btnYes").off("click.doXoaLK").on("click.doXoaLK", function () {
                me.delete_LoaiKhoan_DonGia();
            });
        });

        $(document).off("click.openAddPV", ".btnThemMoi_PhamVi_DoiTuong").on("click.openAddPV", ".btnThemMoi_PhamVi_DoiTuong", function () {
            me.resetForm_PhamVi_DoiTuong();
            me.loadCombo_PhamVi_All();
            me.showModal("add_phamVi_doiTuong");
        });

        $(document).off("shown.bs.modal.addPV", "#add_phamVi_doiTuong").on("shown.bs.modal.addPV", "#add_phamVi_doiTuong", function () {
            me.initSelect2_PhamViModal();
        });

        $(document).off("change.pvHe", "#dropPV_HeDaoTao").on("change.pvHe", "#dropPV_HeDaoTao", function () {
            me.getList_PV_KhoaDaoTao();
        });
        $(document).off("change.pvKhoa", "#dropPV_KhoaDaoTao").on("change.pvKhoa", "#dropPV_KhoaDaoTao", function () {
            me.getList_PV_ChuongTrinh();
            me.getList_PV_LopQuanLy();
        });
        $(document).off("change.pvCT", "#dropPV_ChuongTrinh").on("change.pvCT", "#dropPV_ChuongTrinh", function () {
            me.getList_PV_LopQuanLy();
        });
        $(document).off("change.pvLop", "#dropPV_Lop").on("change.pvLop", "#dropPV_Lop", function () {
            me.getList_PV_HocVien();
        });

        $(document).off("click.removeChipPV", ".pv-chip-remove").on("click.removeChipPV", ".pv-chip-remove", function () {
            var idx = parseInt($(this).attr("data-idx"), 10);
            if (!isNaN(idx) && idx >= 0 && idx < me.arrPhamVi_PV.length) {
                me.arrPhamVi_PV.splice(idx, 1);
                me.renderSelected_PhamVi_PV();
            }
        });

        $(document).off("click.addPV", ".addPhamVi_PV").on("click.addPV", ".addPhamVi_PV", function () {
            var loai = $(this).attr("data-loai");
            var dropId = $(this).attr("id").replace("add", "drop");
            var $sel = $("#" + dropId);
            var val = $sel.val();
            var name = $sel.find("option:selected").text();
            if (!val) {
                edu.system.alert("Vui lòng chọn giá trị trước khi thêm!", "w");
                return;
            }
            if (me.arrPhamVi_PV.find(function (e) { return e.id === val && e.loai === loai; })) return;
            me.arrPhamVi_PV.push({ id: val, loai: loai, name: loai + ": " + name });
            me.renderSelected_PhamVi_PV();
        });

        $(document).off("click.btnLuuPV", "#btnLuu_PhamVi_DoiTuong").on("click.btnLuuPV", "#btnLuu_PhamVi_DoiTuong", function () {
            me.save_PhamVi_DoiTuong_All();
        });

        $(document).off("change.chkPV", ".chkSelect_PhamVi").on("change.chkPV", ".chkSelect_PhamVi", function () {
            me.updateSelected_PhamVi();
        });

        $(document).off("change.chkAllPV", "#chkSelectAll_PhamVi").on("change.chkAllPV", "#chkSelectAll_PhamVi", function () {
            var checked = this.checked;
            $("#tblPhamVi_DoiTuong tbody .chkSelect_PhamVi").prop("checked", checked);
            me.updateSelected_PhamVi();
        });

        $(document).off("click.xoaPV", "#btnXoa_PhamVi_DoiTuong").on("click.xoaPV", "#btnXoa_PhamVi_DoiTuong", function () {
            var ids = me.getSelectedIds_PhamVi();
            if (ids.length === 0) {
                edu.system.alert("Chưa chọn phạm vi để xóa!", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa " + ids.length + " phạm vi đã chọn không?");
            $("#btnYes").off("click.doXoaPV").on("click.doXoaPV", function () {
                me.delete_PhamVi_DoiTuong_Multi(ids);
            });
        });

        $(document).off("click.btnSearch", "#btnSearch").on("click.btnSearch", "#btnSearch", function () {
            me.getList_KeHoachMua();
        });

        $(document).off("keypress.txtSearch", "#txtSearch_ThongTin").on("keypress.txtSearch", "#txtSearch_ThongTin", function (e) {
            if (e.which === 13) {
                me.getList_KeHoachMua();
            }
        });

        // Live search: gõ tới đâu lọc tới đó (debounce 300ms)
        $(document).off("input.txtSearchLive", "#txtSearch_ThongTin").on("input.txtSearchLive", "#txtSearch_ThongTin", function () {
            clearTimeout(me._txtSearchTimer);
            me._txtSearchTimer = setTimeout(function () {
                me.getList_KeHoachMua();
            }, 300);
        });

        $(document).off("change.dropSearchLoaiKH", "#dropSearch_LoaiKeHoach").on("change.dropSearchLoaiKH", "#dropSearch_LoaiKeHoach", function () {
            me.getList_KeHoachMua();
        });

        $(document).off("change.dropSearchTinhTrang", "#dropSearch_TinhTrang").on("change.dropSearchTinhTrang", "#dropSearch_TinhTrang", function () {
            me.getList_KeHoachMua();
        });

        $("#tblkehoach-dk-mua").off("click", ".btnXemChiTiet_LoaiKhoan").on("click", ".btnXemChiTiet_LoaiKhoan", function () {
            me.strKeHoachMua_Id_Selected = $(this).attr("id");
            me.getList_LoaiKhoan_DonGia();
        });

        $("#tblkehoach-dk-mua").off("click", ".btnXemChiTiet_PhamVi").on("click", ".btnXemChiTiet_PhamVi", function () {
            me.strKeHoachMua_Id_Selected = $(this).attr("id");
            me.getList_PhamVi_DoiTuong();
        });

        $("#tblkehoach-dk-mua").off("click", ".btnXemChiTiet_KetQua").on("click", ".btnXemChiTiet_KetQua", function () {
            me.strKeHoachMua_Id_Selected = $(this).attr("id");
            me.getList_KetQua_DangKyMua();
        });

        // Tìm kiếm & lọc trong modal Kết quả đăng ký mua (client-side)
        $(document).off("input.txtSearchKQ", "#txtSearch_KetQua").on("input.txtSearchKQ", "#txtSearch_KetQua", function () {
            clearTimeout(me._txtSearchKQTimer);
            me._txtSearchKQTimer = setTimeout(function () {
                me.filter_KetQua_DangKyMua();
            }, 300);
        });
        $(document).off("change.dropKQ_LK", "#dropSearch_KetQua_LoaiKhoan").on("change.dropKQ_LK", "#dropSearch_KetQua_LoaiKhoan", function () {
            me.filter_KetQua_DangKyMua();
        });
        $(document).off("change.dropKQ_TT", "#dropSearch_KetQua_TinhTrang").on("change.dropKQ_TT", "#dropSearch_KetQua_TinhTrang", function () {
            me.filter_KetQua_DangKyMua();
        });
        $(document).off("click.clearSearchKQ", "#btnClearSearch_KetQua").on("click.clearSearchKQ", "#btnClearSearch_KetQua", function () {
            me.resetSearch_KetQua();
            me.filter_KetQua_DangKyMua();
        });

        $("#tblkehoach-dk-mua").off("click", ".btnChiTiet_KeHoach").on("click", ".btnChiTiet_KeHoach", function () {
            me.strKeHoachMua_Id_Selected = $(this).attr("id");
            me.getDetail_KeHoachMua();
        });
    },

    toggle_detail: function (strZone) {
        edu.util.toggle_overide("zone-content", strZone);
    },

    showLoading: function () {
        var $o = $("#overlay_KHM");
        if ($o.length) {
            $o.stop(true, true).fadeIn(150);
        } else {
            $("#overlay").stop(true, true).fadeIn(150);
        }
    },

    hideLoading: function () {
        var $o = $("#overlay_KHM");
        if ($o.length) {
            $o.stop(true, true).fadeOut(150);
        } else {
            $("#overlay").stop(true, true).fadeOut(150);
        }
    },

    callApi: function (options) {
        var me = main_doc.KeHoachMua;
        me.showLoading();
        var origSuccess = options.success;
        var origError = options.error;
        options.success = function (data) {
            me.hideLoading();
            if (origSuccess) origSuccess(data);
        };
        options.error = function (er) {
            me.hideLoading();
            if (origError) origError(er);
        };
        edu.system.makeRequest(options, false, false, false, null);
    },

    showModal: function (strModalId) {
        var el = document.getElementById(strModalId);
        if (!el) return;
        if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
            var inst = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
            inst.show();
        } else if (window.jQuery && typeof $(el).modal === "function") {
            $(el).modal("show");
        }
    },

    hideModal: function (strModalId) {
        var el = document.getElementById(strModalId);
        if (!el) return;
        if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
            var inst = bootstrap.Modal.getInstance(el);
            if (inst) inst.hide();
        } else if (window.jQuery && typeof $(el).modal === "function") {
            $(el).modal("hide");
        }
        // safety cleanup if backdrop or modal-open class stuck
        $(el).removeClass("show").attr("aria-hidden", "true").css("display", "none");
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open").css({ "padding-right": "", "overflow": "" });
    },

    setFormMode: function (mode) {
        if (mode === "edit") {
            $("#lblFormTitle").html('<i class="fas fa-edit"></i> Sửa - ');
            $("#btnXoa_KeHoach").removeClass("d-none");
        } else {
            $("#lblFormTitle").html('<i class="fas fa-edit"></i> Mở kế hoạch mới - ');
            $("#btnXoa_KeHoach").addClass("d-none");
        }
    },

    loadCombo_LoaiKeHoach: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "TAICHINH.KEHOACH.MUAHANG.LOAI",
            "dropSearch_LoaiKeHoach"
        );
    },

    loadCombo_TinhTrang: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "TAICHINH.KEHOACH.MUAHANG.TINHTRANG",
            "dropSearch_TinhTrang"
        );
    },

    loadCombo_LoaiKeHoach_Form: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "TAICHINH.KEHOACH.MUAHANG.LOAI",
            "dropLoaiKeHoach"
        );
    },

    loadCombo_TinhTrang_Form: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "TAICHINH.KEHOACH.MUAHANG.TINHTRANG",
            "dropTinhTrang"
        );
    },

    loadCombo_ThoiGianDaoTao_Form: function () {
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: edu.system.userId,
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        if (typeof edu.system.getList_ThoiGianDaoTao !== "function") return;
        edu.system.getList_ThoiGianDaoTao(objList, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data || [],
                renderInfor: { id: "ID", parentId: "", name: "DAOTAO_THOIGIANDAOTAO", code: "", avatar: "" },
                renderPlace: ["dropThoiGianDaoTao"],
                type: "",
                title: "--Chọn thời gian đào tạo--"
            });
        });
    },

    loadCombo_KhoanThu_LK: function () {
        var me = main_doc.KeHoachMua;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': '',
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success && edu.util.checkValue(data.Data)) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                        renderPlace: ["dropLoaiKhoan_LK"],
                        type: "",
                        title: "Chọn loại khoản"
                    });
                }
            },
            error: function (er) {},
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    loadCombo_PhanLoai_LK: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "TAICHINH.KEHOACH.MUAHANG.PHANLOAIHANGHOA",
            "dropPhanLoai_LK"
        );
    },

    loadCombo_DonViTinh_LK: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "TAICHINH.KEHOACH.MUAHANG.DONVITINH",
            "dropDonViTinh_LK"
        );
    },

    setFormMode_LoaiKhoan: function (mode) {
        var $title = $("#add_loaikhoan_donGia .modal-header .title");
        if (mode === "edit") {
            $title.html('<i class="fas fa-edit"></i> Sửa loại khoản và đơn giá');
            $("#btnXoa_LoaiKhoan_DonGia").removeClass("d-none");
        } else {
            $title.html('<i class="fas fa-plus"></i> Thêm mới loại khoản và đơn giá');
            $("#btnXoa_LoaiKhoan_DonGia").addClass("d-none");
        }
    },

    getDetail_LoaiKhoan_DonGia: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeBQYeBiQ1HgM4Hggl',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Get_By_Id',
            'iM': edu.system.iM,
            'strId': me.strLoaiKhoan_DonGia_Id_Selected,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    var item = null;
                    if (edu.util.checkValue(data.Data)) {
                        item = Array.isArray(data.Data) ? (data.Data[0] || null) : data.Data;
                    }
                    me.fillForm_LoaiKhoan_DonGia(item);
                    me.setFormMode_LoaiKhoan("edit");
                    me.showModal("add_loaikhoan_donGia");
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
            fakedb: []
        }, false, false, false, null);
    },

    fillForm_LoaiKhoan_DonGia: function (item) {
        var me = main_doc.KeHoachMua;
        if (!item) {
            me.resetForm_LoaiKhoan_DonGia();
            return;
        }
        var pick = function () {
            for (var i = 0; i < arguments.length; i++) {
                var v = arguments[i];
                if (v !== undefined && v !== null && v !== "") return v;
            }
            return "";
        };
        var pickNum = function () {
            for (var i = 0; i < arguments.length; i++) {
                var v = arguments[i];
                if (v !== undefined && v !== null && v !== "") return v;
            }
            return "";
        };
        $("#hidLoaiKhoan_DonGia_Id").val(pick(item.ID, item.Id, item.id));
        $("#dropLoaiKhoan_LK").val(pick(item.TAICHINH_CACKHOANTHU_ID, item.TAICHINH_CACKHOANTHU_Id, item.TaiChinh_CacKhoanThu_Id, item.TAICHINHCACKHOANTHU_ID)).trigger("change");
        $("#txtDonGia_LK").val(pickNum(item.DONGIA, item.DonGia, item.dongia));
        $("#dropPhanLoai_LK").val(pick(item.PHANLOAIHANGHOA_ID, item.PHANLOAIHANGHOA_Id, item.PhanLoaiHangHoa_Id, item.PHANLOAI_ID)).trigger("change");
        $("#dropDonViTinh_LK").val(pick(item.DONVITINH_ID, item.DONVITINH_Id, item.DonViTinh_Id)).trigger("change");
        $("#txtSoToiThieu_LK").val(pickNum(item.SOLUONGTOITHIEU, item.SoLuongToiThieu, item.soluongtoithieu));
        $("#txtSoToiDa_LK").val(pickNum(item.SOLUONGTOIDA, item.SoLuongToiDa, item.soluongtoida));
        $("#txtThuTu_LK").val(pickNum(item.SAPXEP, item.SapXep, item.sapxep));
        var dKM  = pick(item.CHOPHEPKHONGMUA, item.ChoPhepKhongMua, item.chophepkhongmua);
        var dBB  = pick(item.BATBUOC, item.BatBuoc, item.batbuoc);
        var dNSL = pick(item.CONHAPSOLUONG, item.CoNhapSoLuong, item.conhapsoluong);
        var dHL  = pick(item.HIEULUC, item.HieuLuc, item.hieuluc);
        $('input[name="rdoChoPhepKhongMua_LK"][value="' + (dKM == 1 || dKM === "1" ? "1" : "0") + '"]').prop("checked", true);
        $('input[name="rdoBatBuoc_LK"][value="' + (dBB == 1 || dBB === "1" ? "1" : "0") + '"]').prop("checked", true);
        $('input[name="rdoChoNhapSoLuong_LK"][value="' + (dNSL == 1 || dNSL === "1" ? "1" : "0") + '"]').prop("checked", true);
        $('input[name="rdoHieuLuc_LK"][value="' + (dHL == 1 || dHL === "1" ? "1" : "0") + '"]').prop("checked", true);
    },


    resetForm_LoaiKhoan_DonGia: function () {
        $("#hidLoaiKhoan_DonGia_Id").val("");
        $("#dropLoaiKhoan_LK").val("").trigger("change");
        $("#txtDonGia_LK").val("");
        $("#dropPhanLoai_LK").val("").trigger("change");
        $("#dropDonViTinh_LK").val("").trigger("change");
        $("#txtSoToiThieu_LK").val("");
        $("#txtSoToiDa_LK").val("");
        $("#txtThuTu_LK").val("");
        $('input[name="rdoChoPhepKhongMua_LK"][value="0"]').prop("checked", true);
        $('input[name="rdoBatBuoc_LK"][value="0"]').prop("checked", true);
        $('input[name="rdoChoNhapSoLuong_LK"][value="1"]').prop("checked", true);
        $('input[name="rdoHieuLuc_LK"][value="1"]').prop("checked", true);
    },

    save_LoaiKhoan_DonGia: function () {
        var me = main_doc.KeHoachMua;

        if (!me.strKeHoachMua_Id_Selected) {
            edu.system.alert("Chưa chọn kế hoạch!", "w");
            return;
        }

        var strId = edu.util.getValById('hidLoaiKhoan_DonGia_Id');
        var isEdit = !!strId;

        var obj_save = {
            'action': isEdit
                ? 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeBQYeEjQg'
                : 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeBQYeFSkkLAPP',
            'func': isEdit
                ? 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Sua'
                : 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Them',
            'iM': edu.system.iM,
            'strId': strId,
            'strTaiChinh_KH_MuaHang_Id': me.strKeHoachMua_Id_Selected,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan_LK'),
            'strPhanLoaiHangHoa_Id': edu.util.getValById('dropPhanLoai_LK'),
            'dDonGia': edu.util.getValById('txtDonGia_LK'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_LK'),
            'dCoNhapSoLuong': $('input[name="rdoChoNhapSoLuong_LK"]:checked').val() || "0",
            'dSoLuongToiThieu': edu.util.getValById('txtSoToiThieu_LK'),
            'dSoLuongToiDa': edu.util.getValById('txtSoToiDa_LK'),
            'dBatBuoc': $('input[name="rdoBatBuoc_LK"]:checked').val() || "0",
            'dChoPhepKhongMua': $('input[name="rdoChoPhepKhongMua_LK"]:checked').val() || "0",
            'dHieuLuc': $('input[name="rdoHieuLuc_LK"]:checked').val() || "1",
            'dSapXep': edu.util.getValById('txtThuTu_LK'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu loại khoản và đơn giá thành công!");
                    var el = document.getElementById("add_loaikhoan_donGia");
                    if (el) {
                        if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
                            var inst = bootstrap.Modal.getInstance(el);
                            if (inst) inst.hide();
                        } else {
                            $(el).modal("hide");
                        }
                    }
                    me.getList_LoaiKhoan_DonGia();
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
            fakedb: []
        }, false, false, false, null);
    },

    getList_KeHoachMua: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4NIDgFEgPP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_LayDS',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_ThongTin'),
            'strLoaiKeHoach_Id': edu.util.getValById('dropSearch_LoaiKeHoach'),
            'strTinhTrang_Id': edu.util.getValById('dropSearch_TinhTrang'),
            'dHieuLuc': '',
            'strTuNgay': '',
            'strDenNgay': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKeHoachMua = dtResult;
                    me.genTable_KeHoachMua(dtResult, iPager);
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
            fakedb: []
        }, false, false, false, null);
    },

    genTable_KeHoachMua: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblkehoach-dk-mua",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachMua.getList_KeHoachMua()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4, 5, 8, 9, 10, 11, 13],
                left: [1, 2, 3, 6, 7, 12]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.TEN || aData.Ten || aData.ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.MA || aData.Ma || aData.ma || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.MOTA || aData.MoTa || aData.mota || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.TUNGAY || aData.TuNgay || aData.tungay || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DENNGAY || aData.DenNgay || aData.denngay || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.LOAIKEHOACH_TEN || aData.LOAIKEHOACH_Ten || aData.LoaiKeHoach_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.TINHTRANG_TEN || aData.TINHTRANG_Ten || aData.TinhTrang_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXemChiTiet_LoaiKhoan" id="' + aData.ID + '" title="Xem chi tiết">Xem chi tiết</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXemChiTiet_PhamVi" id="' + aData.ID + '" title="Xem chi tiết">Xem chi tiết</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXemChiTiet_KetQua" id="' + aData.ID + '" title="Xem chi tiết">Xem chi tiết</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGAYTAO_DD_MM_YYYY_HHMMSS || aData.NgayTao_dd_mm_yyyy_hhmmss || aData.NGAYTAO || aData.NgayTao || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGUOITAO_TAIKHOAN || aData.NGUOITAO_TaiKhoan || aData.NguoiTao_TaiKhoan || aData.NGUOITAO || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnChiTiet_KeHoach" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getDetail_KeHoachMua: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4GJDUeAzgeCCUP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Get_By_Id',
            'iM': edu.system.iM,
            'strId': me.strKeHoachMua_Id_Selected,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    var item = null;
                    if (edu.util.checkValue(data.Data)) {
                        item = Array.isArray(data.Data) ? (data.Data[0] || null) : data.Data;
                    }
                    me.fillForm_KeHoachMua(item);
                    me.setFormMode("edit");
                    me.toggle_detail("zoneEdit_KeHoach");
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
            fakedb: []
        }, false, false, false, null);
    },

    fillForm_KeHoachMua: function (item) {
        if (!item) {
            $("#hidKeHoachMua_Id").val("");
            $("#txtTenKeHoach").val("");
            $("#txtMaKeHoach").val("");
            $("#txtMoTa").val("");
            $("#txtTuNgay").val("");
            $("#txtDenNgay").val("");
            $("#dropLoaiKeHoach").val("").trigger("change");
            $("#dropTinhTrang").val("").trigger("change");
            $("#dropThoiGianDaoTao").val("").trigger("change");
            $('input[name="rdoChoPhepSuaSoLuong"][value="1"]').prop("checked", true);
            $('input[name="rdoChoPhepHuyTruocThanhToan"][value="1"]').prop("checked", true);
            $('input[name="rdoYeuCauThanhToanNgay"][value="0"]').prop("checked", true);
            return;
        }
        var pick = function () {
            for (var i = 0; i < arguments.length; i++) {
                var v = arguments[i];
                if (v !== undefined && v !== null && v !== "") return v;
            }
            return "";
        };
        $("#hidKeHoachMua_Id").val(pick(item.ID, item.Id, item.id));
        $("#txtTenKeHoach").val(pick(item.TEN, item.Ten, item.ten));
        $("#txtMaKeHoach").val(pick(item.MA, item.Ma, item.ma));
        $("#txtMoTa").val(pick(item.MOTA, item.MoTa, item.mota));
        $("#txtTuNgay").val(pick(item.TUNGAY, item.TuNgay, item.tungay));
        $("#txtDenNgay").val(pick(item.DENNGAY, item.DenNgay, item.denngay));
        $("#dropLoaiKeHoach").val(pick(item.LOAIKEHOACH_ID, item.LOAIKEHOACH_Id, item.LoaiKeHoach_Id, item.LOAIKEHOACH_id)).trigger("change");
        $("#dropTinhTrang").val(pick(item.TINHTRANG_ID, item.TINHTRANG_Id, item.TinhTrang_Id, item.TINHTRANG_id)).trigger("change");
        $("#dropThoiGianDaoTao").val(pick(item.DAOTAO_THOIGIANDAOTAO_ID, item.DAOTAO_THOIGIANDAOTAO_Id, item.DaoTao_ThoiGianDaoTao_Id)).trigger("change");
        var dCpSua  = pick(item.CHOPHEPSUASOLUONG, item.ChoPhepSuaSoLuong, item.chophepsuasoluong);
        var dCpHuy  = pick(item.CHOPHEPHUYTRUOCTHANHTOAN, item.ChoPhepHuyTruocThanhToan, item.chophephuytruocthanhtoan);
        var dTtNgay = pick(item.YEUCAUTHANHTOANNGAY, item.YeuCauThanhToanNgay, item.yeucauthanhtoanngay);
        $('input[name="rdoChoPhepSuaSoLuong"][value="' + (dCpSua == 1 || dCpSua === "1" ? "1" : "0") + '"]').prop("checked", true);
        $('input[name="rdoChoPhepHuyTruocThanhToan"][value="' + (dCpHuy == 1 || dCpHuy === "1" ? "1" : "0") + '"]').prop("checked", true);
        $('input[name="rdoYeuCauThanhToanNgay"][value="' + (dTtNgay == 1 || dTtNgay === "1" ? "1" : "0") + '"]').prop("checked", true);
    },

    save_KeHoachMua: function () {
        var me = main_doc.KeHoachMua;

        var strId = edu.util.getValById('hidKeHoachMua_Id');
        var isEdit = !!strId;

        var obj_save = {
            'action': isEdit
                ? 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4SNCAP'
                : 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4VKSQs',
            'func': isEdit
                ? 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Sua'
                : 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Them',
            'iM': edu.system.iM,
            'strId': strId,
            'strMa': edu.util.getValById('txtMaKeHoach'),
            'strTen': edu.util.getValById('txtTenKeHoach'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strLoaiKeHoach_Id': edu.util.getValById('dropLoaiKeHoach'),
            'strTinhTrang_Id': edu.util.getValById('dropTinhTrang'),
            'strDAOTAO_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'dChoPhepHuyTruocThanhToan': $('input[name="rdoChoPhepHuyTruocThanhToan"]:checked').val() || "0",
            'dChoPhepSuaSoLuong': $('input[name="rdoChoPhepSuaSoLuong"]:checked').val() || "0",
            'dYeuCauThanhToanNgay': $('input[name="rdoYeuCauThanhToanNgay"]:checked').val() || "0",
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu kế hoạch thành công!");
                    me.toggle_detail("zonebatdau");
                    me.getList_KeHoachMua();
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
            fakedb: []
        }, false, false, false, null);
    },

    getList_LoaiKhoan_DonGia: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeBQYeDSA4BRIP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_LayDS',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': me.strKeHoachMua_Id_Selected,
            'strTaiChinh_CacKhoanThu_Id': '',
            'strPhanLoaiHangHoa_Id': '',
            'dHieuLuc': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtLoaiKhoan_DonGia = dtResult;
                    me.genTable_LoaiKhoan_DonGia(dtResult, iPager);
                    me.showModal("Loaikhoan_donGia");
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
            fakedb: []
        }, false, false, false, null);
    },

    genTable_LoaiKhoan_DonGia: function (data, iPager) {
        var fmtBool = function (v) {
            if (v === 1 || v === "1" || v === true) return "Có";
            if (v === 0 || v === "0" || v === false) return "Không";
            return "";
        };
        var jsonForm = {
            strTable_Id: "tblLoaiKhoan_DonGia",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachMua.getList_LoaiKhoan_DonGia()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 2, 5, 6, 7, 8, 9, 10, 12],
                left: [1, 3, 4, 11]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.TEN_KHOANTHU || aData.LOAIKHOAN_TEN || aData.LOAIKHOAN_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DONGIA != null ? aData.DONGIA : "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.PHANLOAIHANGHOA_TEN || aData.PHANLOAIHANGHOA_Ten || aData.PHANLOAI_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.TEN_DONVITINH || aData.DONVITINH_TEN || aData.DONVITINH_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return fmtBool(aData.CHOPHEPKHONGMUA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return fmtBool(aData.BATBUOC);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return fmtBool(aData.CONHAPSOLUONG);
                    }
                },
                {
                    "mDataProp": "SOLUONGTOITHIEU"
                },
                {
                    "mDataProp": "SOLUONGTOIDA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGAYTAO_DD_MM_YYYY_HHMMSS || aData.NgayTao_dd_mm_yyyy_hhmmss || aData.NGAYTAO || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGUOITAO_TAIKHOAN || aData.NGUOITAO_TaiKhoan || aData.NGUOITAO || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnChiTiet_LoaiKhoan" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_PhamVi_DoiTuong: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeERceDSA4BRIP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_PV_LayDS',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': me.strKeHoachMua_Id_Selected,
            'strPhamViLoai_Code': '',
            'strPhamViApDung_Id': '',
            'dHieuLuc': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    // Lọc client-side: chỉ giữ bản ghi còn hiệu lực (HIEULUC = 1)
                    dtResult = dtResult.filter(function (e) {
                        var v = e.HIEULUC;
                        return v === 1 || v === "1" || v === true || v == null || v === undefined;
                    });
                    me.dtPhamVi_DoiTuong = dtResult;
                    me.genTable_PhamVi_DoiTuong(dtResult, iPager);
                    me.showModal("phamViDoiTuong");
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
            fakedb: []
        }, false, false, false, null);
    },

    resetForm_PhamVi_DoiTuong: function () {
        var me = main_doc.KeHoachMua;
        me.arrPhamVi_PV = [];
        $("#add_phamVi_doiTuong select").val("");
        $("#lblPhamVi_PV_Selected").html("");
    },

    LOAI_LABELS: {
        KHOAQUANLY: "Khoa quản lý",
        HEDAOTAO: "Hệ đào tạo",
        KHOADAOTAO: "Khóa",
        CHUONGTRINH: "Chương trình",
        LOP: "Lớp",
        NGUOIHOC: "Người học"
    },

    renderSelected_PhamVi_PV: function () {
        var me = main_doc.KeHoachMua;
        var $box = $("#lblPhamVi_PV_Selected");
        if (!me.arrPhamVi_PV || me.arrPhamVi_PV.length === 0) {
            $box.html('<span class="pv-empty">Chưa chọn phạm vi nào</span>');
            return;
        }
        var esc = function (s) {
            return $("<div>").text(s == null ? "" : String(s)).html();
        };
        var html = me.arrPhamVi_PV.map(function (e, idx) {
            var loaiLabel = me.LOAI_LABELS[e.loai] || e.loai;
            var nameOnly = e.name.indexOf(e.loai + ": ") === 0 ? e.name.substring(e.loai.length + 2) : e.name;
            return (
                '<span class="pv-chip" data-idx="' + idx + '">' +
                '<span class="pv-chip-loai">' + esc(loaiLabel) + '</span>' +
                '<span class="pv-chip-name">' + esc(nameOnly) + '</span>' +
                '<button type="button" class="pv-chip-remove" title="Bỏ chọn" data-idx="' + idx + '"><i class="fa fa-times"></i></button>' +
                '</span>'
            );
        }).join("");
        $box.html(html);
    },

    loadCombo_PhamVi_All: function () {
        var me = main_doc.KeHoachMua;
        me.getList_PV_KhoaQuanLy();
        me.getList_PV_HeDaoTao();
        me.getList_PV_LopQuanLy();
        me.getList_PV_HocVien();
    },

    initSelect2_PhamViModal: function () {
        var $modal = $("#add_phamVi_doiTuong");
        if (!$modal.length || typeof $.fn.select2 !== "function") return;
        $modal.find(".select-opt").each(function () {
            var $el = $(this);
            if ($el.data("select2")) {
                $el.select2("destroy");
            }
            $el.select2({
                width: "100%",
                dropdownParent: $modal.find(".modal-content")
            });
        });
    },

    getList_PV_KhoaQuanLy: function () {
        if (typeof edu.system.getList_KhoaQuanLy !== "function") return;
        var objList = {
            strHeDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_KhoaQuanLy(objList, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data || [],
                renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                renderPlace: ["dropPV_KhoaQuanLy"],
                type: "",
                title: "--Chọn khoa quản lý--"
            });
        });
    },

    getList_PV_HeDaoTao: function () {
        if (typeof edu.system.getList_HeDaoTao !== "function") return;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_HeDaoTao(objList, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data || [],
                renderInfor: { id: "ID", parentId: "", name: "TENHEDAOTAO", code: "", avatar: "" },
                renderPlace: ["dropPV_HeDaoTao"],
                type: "",
                title: "--Chọn hệ đào tạo--"
            });
        });
    },

    getList_PV_KhoaDaoTao: function () {
        if (typeof edu.system.getList_KhoaDaoTao !== "function") return;
        var objList = {
            strHeDaoTao_Id: edu.util.getValById("dropPV_HeDaoTao") || "",
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_KhoaDaoTao(objList, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data || [],
                renderInfor: { id: "ID", parentId: "", name: "TENKHOA", code: "", avatar: "" },
                renderPlace: ["dropPV_KhoaDaoTao"],
                type: "",
                title: "--Chọn khóa đào tạo--"
            });
        });
    },

    getList_PV_ChuongTrinh: function () {
        if (typeof edu.system.getList_ChuongTrinhDaoTao !== "function") return;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValById("dropPV_KhoaDaoTao") || "",
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data || [],
                renderInfor: { id: "ID", parentId: "", name: "TENCHUONGTRINH", code: "", avatar: "" },
                renderPlace: ["dropPV_ChuongTrinh"],
                type: "",
                title: "--Chọn chương trình--"
            });
        });
    },

    getList_PV_LopQuanLy: function () {
        if (typeof edu.system.getList_LopQuanLy !== "function") return;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValById("dropPV_HeDaoTao") || "",
            strKhoaDaoTao_Id: edu.util.getValById("dropPV_KhoaDaoTao") || "",
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropPV_ChuongTrinh") || "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_LopQuanLy(objList, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data || [],
                renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                renderPlace: ["dropPV_Lop"],
                type: "",
                title: "--Chọn lớp--"
            });
        });
    },

    getList_PV_HocVien: function () {
        var me = main_doc.KeHoachMua;
        var strLopQuanLy_Id = edu.util.getValById("dropPV_Lop") || "";
        if (!strLopQuanLy_Id) {
            edu.system.loadToCombo_data({
                data: [],
                renderInfor: { id: "ID", parentId: "", name: "TEN", code: "", avatar: "" },
                renderPlace: ["dropPV_HocVien"],
                type: "",
                title: "--Chọn người học--"
            });
            return;
        }
        var objList = {
            action: 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu',
            func: 'pkg_hosohocvien.LayDanhSachHoSo',
            iM: edu.system.iM,
            strHeDaoTao_Id: edu.util.getValById("dropPV_HeDaoTao") || "",
            strKhoaDaoTao_Id: edu.util.getValById("dropPV_KhoaDaoTao") || "",
            strChuongTrinh_Id: edu.util.getValById("dropPV_ChuongTrinh") || "",
            strLopQuanLy_Id: strLopQuanLy_Id,
            strQLSV_TrangThaiNguoiHoc_Id: "",
            dLocTheoDuLieuImport: -1,
            strNguoiThucHien_Id: edu.system.userId,
            strChucNang_Id: edu.system.strChucNang_Id,
            strTuNgay: edu.util.getValById('txtAAAA'),
            strDenNgay: edu.util.getValById('txtAAAA'),
            pageIndex: 1,
            pageSize: 1000000
        };
        me.callApi({
            success: function (data) {
                var list = [];
                if (data.Success && edu.util.checkValue(data.Data)) {
                    list = Array.isArray(data.Data) ? data.Data : [data.Data];
                }
                edu.system.loadToCombo_data({
                    data: list,
                    renderInfor: {
                        id: "ID",
                        parentId: "",
                        name: "TEN",
                        code: "",
                        avatar: "",
                        mRender: function (nRow, aData) {
                            return (aData.MASO || "") + " - " + (aData.HODEM || "") + " " + (aData.TEN || "");
                        }
                    },
                    renderPlace: ["dropPV_HocVien"],
                    type: "",
                    title: "--Chọn người học--"
                });
            },
            error: function (er) {
                edu.system.alert("Không tải được danh sách sinh viên: " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: objList.action,
            contentType: true,
            data: objList,
            fakedb: []
        }, false, false, false, null);
    },

    save_PhamVi_DoiTuong_All: function () {
        var me = main_doc.KeHoachMua;
        if (!me.strKeHoachMua_Id_Selected) {
            edu.system.alert("Chưa chọn kế hoạch!", "w");
            return;
        }
        if (me.arrPhamVi_PV.length === 0) {
            edu.system.alert("Vui lòng chọn ít nhất 1 phạm vi!", "w");
            return;
        }
        var total = me.arrPhamVi_PV.length;
        var done = 0;
        me.arrPhamVi_PV.forEach(function (item) {
            me.save_PhamVi_DoiTuong_Single(item.loai, item.id, function () {
                done++;
                if (done === total) {
                    edu.system.alert("Lưu " + total + " phạm vi thành công!");
                    me.hideModal("add_phamVi_doiTuong");
                    me.getList_PhamVi_DoiTuong();
                }
            });
        });
    },

    save_PhamVi_DoiTuong_Single: function (strLoaiCode, strApDungId, cb) {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeERceFSkkLAPP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_PV_Them',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': me.strKeHoachMua_Id_Selected,
            'strPhamViApDung_Id': strApDungId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (cb) cb(data);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_PhamVi_DoiTuong: function (data, iPager) {
        var fmtBool = function (v) {
            if (v === 1 || v === "1" || v === true) return "Có";
            if (v === 0 || v === "0" || v === false) return "Không";
            return "";
        };
        var jsonForm = {
            strTable_Id: "tblPhamVi_DoiTuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachMua.getList_PhamVi_DoiTuong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 2, 3, 5],
                left: [1, 4]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.PHAMVIAPDUNG_TEN || aData.PHAMVIAPDUNG_Ten || aData.PHAMVI_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return fmtBool(aData.HIEULUC);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGAYTAO_DD_MM_YYYY_HHMMSS || aData.NgayTao_dd_mm_yyyy_hhmmss || aData.NGAYTAO || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGUOITAO_TAIKHOAN || aData.NGUOITAO_TaiKhoan || aData.NGUOITAO || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="chkSelect_PhamVi" data-id="' + aData.ID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_KetQua_DangKyMua: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeChAeDSA4BRIP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_LayDS',
            'iM': edu.system.iM,
            'strTaiChinh_KH_MuaHang_Id': me.strKeHoachMua_Id_Selected,
            'strQLSV_NguoiHoc_Id': '',
            'strTaiChinh_CacKhoanThu_Id': '',
            'strTinhTrangDangKy_Code': '',
            'dHieuLuc': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKetQua_DangKyMua = dtResult;
                    me.resetSearch_KetQua();
                    me.buildFilterOptions_KetQua();
                    me.genTable_KetQua_DangKyMua(dtResult, dtResult.length);
                    me.showModal("ketQua_dangKy_mua");
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
            fakedb: []
        }, false, false, false, null);
    },

    genTable_KetQua_DangKyMua: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblKetQua_DK_mua",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachMua.getList_KetQua_DangKyMua()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 8, 9, 10, 11, 12, 14],
                left: [1, 2, 4, 5, 6, 7, 13]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.MASO || aData.MaSo || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var hodem = aData.HODEM || aData.HoDem || "";
                        var ten = aData.TEN || aData.Ten || "";
                        return (hodem + " " + ten).trim();
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGAYMUA_DD_MM_YYYY_HHMMSS || aData.NgayMua_dd_mm_yyyy_hhmmss || aData.NGAYMUA || aData.NgayMua || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.TEN_KHOANTHU || aData.LOAIKHOAN_TEN || aData.LOAIKHOAN_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.TINHTRANGDANGKY_CODE_NAME || aData.TINHTRANGDANGKY_Code_Name || aData.TINHTRANGDANGKY_TEN || aData.TINHTRANG_Ten || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.LYDOKHONGMUA || aData.LyDoKhongMua || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var mc = aData.MINHCHUNG || aData.MinhChung || "";
                        if (!mc) return "";
                        return '<a href="' + mc + '" target="_blank">Xem minh chứng</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.SOLUONG != null ? aData.SOLUONG : (aData.SoLuong != null ? aData.SoLuong : "");
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DONGIA != null ? aData.DONGIA : (aData.DonGia != null ? aData.DonGia : "");
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.SOTIEN_PHAINOP != null ? aData.SOTIEN_PHAINOP : (aData.SoTienPhaiNop != null ? aData.SoTienPhaiNop : "");
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.SOTIEN_DANOP != null ? aData.SOTIEN_DANOP : (aData.SoTienDaNop != null ? aData.SoTienDaNop : "");
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGAYTAO_DD_MM_YYYY_HHMMSS || aData.NgayTao_dd_mm_yyyy_hhmmss || aData.NGAYTAO || aData.NgayTao || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.NGUOITAO_TAIKHOAN || aData.NGUOITAO_TaiKhoan || aData.NguoiTao_TaiKhoan || aData.NGUOITAO || "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="chkSelect_KetQua" id="' + aData.ID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    resetSearch_KetQua: function () {
        $("#txtSearch_KetQua").val("");
        $("#dropSearch_KetQua_LoaiKhoan").val("");
        $("#dropSearch_KetQua_TinhTrang").val("");
    },

    buildFilterOptions_KetQua: function () {
        var me = main_doc.KeHoachMua;
        var data = me.dtKetQua_DangKyMua || [];
        var mapLK = {};
        var mapTT = {};
        data.forEach(function (row) {
            var lk = row.TEN_KHOANTHU || row.LOAIKHOAN_TEN || row.LOAIKHOAN_Ten || "";
            var tt = row.TINHTRANGDANGKY_CODE_NAME || row.TINHTRANGDANGKY_Code_Name || row.TINHTRANGDANGKY_TEN || row.TINHTRANG_Ten || "";
            if (lk) mapLK[lk] = true;
            if (tt) mapTT[tt] = true;
        });
        var esc = function (s) { return $("<div>").text(s == null ? "" : String(s)).html(); };
        var htmlLK = '<option value="">-- Tất cả loại khoản --</option>';
        Object.keys(mapLK).sort().forEach(function (k) {
            htmlLK += '<option value="' + esc(k) + '">' + esc(k) + '</option>';
        });
        $("#dropSearch_KetQua_LoaiKhoan").html(htmlLK);
        var htmlTT = '<option value="">-- Tất cả tình trạng --</option>';
        Object.keys(mapTT).sort().forEach(function (k) {
            htmlTT += '<option value="' + esc(k) + '">' + esc(k) + '</option>';
        });
        $("#dropSearch_KetQua_TinhTrang").html(htmlTT);
    },

    filter_KetQua_DangKyMua: function () {
        var me = main_doc.KeHoachMua;
        var keyword = (edu.util.getValById('txtSearch_KetQua') || "").toString().toLowerCase().trim();
        var lkFilter = edu.util.getValById('dropSearch_KetQua_LoaiKhoan') || "";
        var ttFilter = edu.util.getValById('dropSearch_KetQua_TinhTrang') || "";
        var full = me.dtKetQua_DangKyMua || [];
        var filtered = full.filter(function (row) {
            if (lkFilter) {
                var lk = row.TEN_KHOANTHU || row.LOAIKHOAN_TEN || row.LOAIKHOAN_Ten || "";
                if (lk !== lkFilter) return false;
            }
            if (ttFilter) {
                var tt = row.TINHTRANGDANGKY_CODE_NAME || row.TINHTRANGDANGKY_Code_Name || row.TINHTRANGDANGKY_TEN || row.TINHTRANG_Ten || "";
                if (tt !== ttFilter) return false;
            }
            if (keyword) {
                var maso = (row.MASO || row.MaSo || "").toString().toLowerCase();
                var hodem = (row.HODEM || row.HoDem || "").toString().toLowerCase();
                var ten = (row.TEN || row.Ten || "").toString().toLowerCase();
                var lk2 = (row.TEN_KHOANTHU || row.LOAIKHOAN_TEN || row.LOAIKHOAN_Ten || "").toString().toLowerCase();
                var tt2 = (row.TINHTRANGDANGKY_CODE_NAME || row.TINHTRANGDANGKY_Code_Name || row.TINHTRANGDANGKY_TEN || row.TINHTRANG_Ten || "").toString().toLowerCase();
                var lydo = (row.LYDOKHONGMUA || row.LyDoKhongMua || "").toString().toLowerCase();
                var fullName = (hodem + " " + ten).trim();
                if (maso.indexOf(keyword) === -1
                    && fullName.indexOf(keyword) === -1
                    && ten.indexOf(keyword) === -1
                    && lk2.indexOf(keyword) === -1
                    && tt2.indexOf(keyword) === -1
                    && lydo.indexOf(keyword) === -1) {
                    return false;
                }
            }
            return true;
        });
        me.genTable_KetQua_DangKyMua(filtered, filtered.length);
    },

    delete_KeHoachMua: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDDQgCSAvJh4ZLiAP',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Xoa',
            'iM': edu.system.iM,
            'strId': me.strKeHoachMua_Id_Selected,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa kế hoạch thành công!");
                    me.toggle_detail("zonebatdau");
                    me.getList_KeHoachMua();
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
            fakedb: []
        }, false, false, false, null);
    },

    delete_LoaiKhoan_DonGia: function () {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeBQYeGS4g',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Xoa',
            'iM': edu.system.iM,
            'strId': me.strLoaiKhoan_DonGia_Id_Selected,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa loại khoản và đơn giá thành công!");
                    var el = document.getElementById("add_loaikhoan_donGia");
                    if (el) {
                        if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
                            var inst = bootstrap.Modal.getInstance(el);
                            if (inst) inst.hide();
                        } else {
                            $(el).modal("hide");
                        }
                    }
                    me.getList_LoaiKhoan_DonGia();
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
            fakedb: []
        }, false, false, false, null);
    },

    getSelectedIds_PhamVi: function () {
        var ids = [];
        $("#tblPhamVi_DoiTuong tbody .chkSelect_PhamVi:checked").each(function () {
            var id = $(this).attr("data-id");
            if (id) ids.push(id);
        });
        return ids;
    },

    updateSelected_PhamVi: function () {
        var me = main_doc.KeHoachMua;
        var total = $("#tblPhamVi_DoiTuong tbody .chkSelect_PhamVi").length;
        var checked = $("#tblPhamVi_DoiTuong tbody .chkSelect_PhamVi:checked").length;
        $("#chkSelectAll_PhamVi").prop("checked", total > 0 && checked === total);
        if (checked > 0) {
            $("#btnXoa_PhamVi_DoiTuong").removeClass("d-none");
        } else {
            $("#btnXoa_PhamVi_DoiTuong").addClass("d-none");
        }
    },

    delete_PhamVi_DoiTuong_Multi: function (ids) {
        var me = main_doc.KeHoachMua;
        if (!ids || ids.length === 0) return;
        var total = ids.length;
        var done = 0;
        var failed = 0;
        ids.forEach(function (strId) {
            me.delete_PhamVi_DoiTuong_Single(strId, function (ok) {
                done++;
                if (!ok) failed++;
                if (done === total) {
                    if (failed === 0) {
                        edu.system.alert("Xóa thành công " + total + " phạm vi!");
                    } else {
                        edu.system.alert("Xóa xong: " + (total - failed) + "/" + total + " thành công, " + failed + " lỗi.", "w");
                    }
                    $("#chkSelectAll_PhamVi").prop("checked", false);
                    $("#btnXoa_PhamVi_DoiTuong").addClass("d-none");
                    me.getList_PhamVi_DoiTuong();
                }
            });
        });
    },

    delete_PhamVi_DoiTuong_Single: function (strId, cb) {
        var me = main_doc.KeHoachMua;

        var obj_save = {
            'action': 'TC_DangKyMua_MH/ETMeFQIeCgkeDAkeERceGS4g',
            'func': 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_PV_Xoa',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': ''
        };

        me.callApi({
            success: function (data) {
                if (cb) cb(!!data.Success);
            },
            error: function () {
                if (cb) cb(false);
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    }
};