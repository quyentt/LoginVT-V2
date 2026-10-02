/*----------------------------------------------
--Author:
--Date of created: 06/07/2026
--Note: Mở kế hoạch nhập học từ Kế hoạch tuyển sinh + Đợt tuyển sinh
--     Bước 1: Bộ lọc (KH tuyển sinh, Đợt tuyển sinh, Thông tin, Hiệu lực)
----------------------------------------------*/
function KeHoachTuyenSinhNew() { };
KeHoachTuyenSinhNew.prototype = {
    dtKeHoachTuyenSinh: [],
    dtDotTuyenSinh: [],
    dtKeHoachNhapHoc: [],
    strKeHoachTuyenSinh_Id: '',
    strDot_Id: '',
    strKHNH_EditId: '',
    strKHNH_Id_ForView: '',
    dtKHNH_EditRecord: null,   // cache record để re-apply value sau khi combo load async
    dtNS_Picker: [],       // DS nhân sự trả từ picker (raw từ API)
    dtNS_DaChon: [],       // DS nhân sự đã chọn (đã confirm từ picker, ở form thêm) — mỗi item có flag _checked
    _nsDaChon_page: 1,     // Trang hiện tại của bảng NS đã chọn
    _nsDaChon_pageSize: 20,// Số dòng mỗi trang
    strNS_EditId: '',      // ID phân công nhân sự đang xem-sửa
    dtNS_EditRecord: null, // Bản ghi phân công đang xem-sửa (để giữ strDonVi_Id...)

    init: function () {
        var me = this;
        edu.system.page_load();

        // ============ Fix stacked modal z-index (BS5 không auto adjust) ============
        // Copy pattern từ khaimucphinhaphoc.js:85-110 (đã prove chạy tốt).
        // Modal con mở trên modal cha → force z-index cao hơn + backdrop tương ứng
        // Alert/confirm luôn trên cùng (z=20000)
        $(document).off('shown.bs.modal.KHTSN').on('shown.bs.modal.KHTSN', '.modal', function () {
            var $this = $(this);
            var isAlert = $this.attr('id') === 'myModalAlert'
                       || $this.hasClass('modal-alert')
                       || $this.hasClass('modal-confirm');
            var $modals = $('.modal.show');
            var count = $modals.length;
            var zIndex;
            if (isAlert) {
                zIndex = 20000;
            } else if (count <= 1) {
                return;
            } else {
                zIndex = 1055 + 30 * (count - 1);
            }
            $this[0].style.setProperty('z-index', zIndex, 'important');
            var $backdrops = $('.modal-backdrop');
            var $lastBackdrop = $backdrops.last();
            if ($lastBackdrop.length) {
                $lastBackdrop[0].style.setProperty('z-index', zIndex - 5, 'important');
            }
        });
        // Khi 1 modal con đóng: re-add class 'modal-open' nếu còn modal cha đang show
        $(document).off('hidden.bs.modal.KHTSN').on('hidden.bs.modal.KHTSN', '.modal', function () {
            if ($('.modal.show').length) {
                $('body').addClass('modal-open');
            }
        });

        /*------------------------------------------
        -- Load combo Kế hoạch tuyển sinh
        -------------------------------------------*/
        me.getList_KeHoachTuyenSinh();

        /*------------------------------------------
        -- Cascade: đổi Kế hoạch => load lại Đợt
        -------------------------------------------*/
        $("#dropKeHoachTuyenSinh_KHTSN").on("change", function () {
            me.strKeHoachTuyenSinh_Id = $(this).val();
            $("#dropDotTuyenSinh_KHTSN").html('<option value="">Chọn đợt tuyển sinh</option>');
            me.dtDotTuyenSinh = [];
            if (edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
                me.getList_DotTuyenSinh();
            }
        });

        $("#dropDotTuyenSinh_KHTSN").on("change", function () {
            me.strDot_Id = $(this).val();
        });

        /*------------------------------------------
        -- Đổi Hiệu lực => refresh combo KH
        -------------------------------------------*/
        $("#dropHieuLuc_KHTSN").on("change", function () {
            me.getList_KeHoachTuyenSinh();
        });

        /*------------------------------------------
        -- Nút "Danh sách" => nạp danh sách kế hoạch nhập học
        -------------------------------------------*/
        $("#btnSearch_KHTSN").click(function () {
            me.getList_KeHoachNhapHoc();
        });
        $("#btnRefresh_KHNH_KHTSN").click(function () {
            me.getList_KeHoachNhapHoc();
        });
        $("#txtThongTin_KHTSN").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoachNhapHoc();
            }
        });

        /*------------------------------------------
        -- Modal form KH nhập học: dual mode (Thêm mới / Xem-sửa)
        -------------------------------------------*/
        $("#modal-Them-KHTSN").on("show.bs.modal", function (event) {
            var strId = $(event.relatedTarget).attr("data-id") || '';
            me.strKHNH_EditId = strId;
            me.rewrite_AddKHNH();
            me.loadCombos_AddKHNH();
            if (edu.util.checkValue(strId)) {
                me.switchMode_Form(true);
                me.getDetail_KHNH_ForEdit(strId);
            } else {
                me.switchMode_Form(false);
            }
        });
        $("#dropKeHoachTS_AddKHNH").on("change", function () {
            var strKH_Id = $(this).val();
            $("#dropDotTS_AddKHNH").html('<option value="">Chọn đợt tuyển sinh</option>');
            if (edu.util.checkValue(strKH_Id)) {
                me.getList_DotTS_ForAdd(strKH_Id);
            }
        });
        $("#btnRewrite_AddKHNH").click(function () {
            me.rewrite_AddKHNH();
        });
        $("#btnSave_AddKHNH").click(function () {
            if (me.validate_AddKHNH()) {
                if (edu.util.checkValue(me.strKHNH_EditId)) {
                    me.update_KHNH();
                } else {
                    me.save_KHNH();
                }
            }
        });
        $("#btnDelete_AddKHNH").click(function () {
            if (!edu.util.checkValue(me.strKHNH_EditId)) return;
            edu.system.confirm("Bạn có chắc chắn muốn xóa kế hoạch nhập học này?");
            $("#btnYes").off("click.delKHNH").on("click.delKHNH", function () {
                me.delete_KHNH();
            });
        });

        /*------------------------------------------
        -- Modal show.bs.modal => load nội dung theo data-id
        -------------------------------------------*/
        $("#modal-KHDauRa-KHTSN").on("show.bs.modal", function (event) {
            var strId = $(event.relatedTarget).attr("data-id") || '';
            if (strId) {
                me.strKHNH_Id_ForView = strId;
                me.getList_KHDauRa(strId);
            }
        });
        $("#btnReload_KHDauRa").click(function () {
            if (edu.util.checkValue(me.strKHNH_Id_ForView)) {
                me.getList_KHDauRa(me.strKHNH_Id_ForView);
            }
        });
        $("#btnKhoiTao_KHDauRa").click(function () {
            if (!edu.util.checkValue(me.strKHNH_Id_ForView)) return;
            edu.system.confirm("Khởi tạo Kế hoạch đầu ra từ tuyển sinh?");
            $("#btnYes").off("click.khoitaoDauRa").on("click.khoitaoDauRa", function () {
                me.khoiTao_KHDauRa_TuTuyenSinh();
            });
        });

        /*------------------------------------------
        -- Bulk update "Yêu cầu xác nhận CSĐT" cho các đầu ra
        -- Header checkbox toggle all + row checkbox sync header
        -- Nút áp cờ theo state hiện tại (tick=1, không=0) cho MỌI dòng
        -------------------------------------------*/
        $("#chkAll_KHDauRa").on("change", function () {
            var checked = $(this).is(":checked");
            $("#tblKHDauRa_KHTSN tbody .chk-daura-row").prop('checked', checked);
            $(this).prop('indeterminate', false);
        });
        $("#tblKHDauRa_KHTSN").on("change", ".chk-daura-row", function () {
            me._syncHeaderChk_KHDauRa();
        });
        $("#btnYeuCauXacNhanCoSo_KHDauRa").click(function () {
            var $rows = $("#tblKHDauRa_KHTSN tbody tr[data-id]");
            if ($rows.length === 0) {
                edu.system.alert("Không có dữ liệu để cập nhật", "w");
                return;
            }
            var soTick = $("#tblKHDauRa_KHTSN tbody .chk-daura-row:checked").length;
            var soTong = $rows.length;
            edu.system.confirm(
                "Sẽ cập nhật 'Yêu cầu xác nhận CSĐT' cho " + soTong + " đầu ra:\n"
                + "- " + soTick + " dòng đã tick → gán = 1\n"
                + "- " + (soTong - soTick) + " dòng chưa tick → gán = 0\n"
                + "Tiếp tục?"
            );
            $("#btnYes").off("click.updXNCoSo").on("click.updXNCoSo", function () {
                me.capNhat_XacNhanCoSo_Bulk();
            });
        });
        $("#modal-NhanSu-KHTSN").on("show.bs.modal", function (event) {
            var strId = $(event.relatedTarget).attr("data-id") || '';
            if (strId) {
                me.strKHNH_Id_ForView = strId;
                me.getList_NhanSu(strId);
            }
        });
        $("#modal-NhanSu-ChiTiet-KHTSN").on("show.bs.modal", function (event) {
            var strId = $(event.relatedTarget).attr("data-id") || '';
            if (strId) {
                me.strNS_EditId = strId;
                me.dtNS_EditRecord = null;
                me.rewrite_EditNS();
                me.loadCombos_EditNS();
                me.getDetail_NhanSu(strId);
            }
        });
        $("#btnSave_EditNS").click(function () {
            me.update_NhanSu();
        });
        $("#btnDelete_EditNS").click(function () {
            if (!edu.util.checkValue(me.strNS_EditId)) return;
            edu.system.confirm("Bạn có chắc chắn muốn xóa phân công nhân sự này?");
            $("#btnYes").off("click.delNS").on("click.delNS", function () {
                me.delete_NhanSu();
            });
        });

        /*------------------------------------------
        -- Modal Bố trí NS: nút Tải lại + Thêm mới
        -------------------------------------------*/
        $("#btnReload_NhanSu").click(function () {
            if (edu.util.checkValue(me.strKHNH_Id_ForView)) {
                me.getList_NhanSu(me.strKHNH_Id_ForView);
            }
        });

        /*------------------------------------------
        -- Modal Thêm mới NS
        -- RESET chỉ khi user CHỦ ĐỘNG click "Thêm mới nhân sự" (btnAdd_NhanSu).
        -- edu.system.alert dùng BS4 jQuery API trộn BS5 khiến show/hidden.bs.modal
        -- fire spurious → nếu reset trong modal event sẽ mất dtNS_DaChon.
        -------------------------------------------*/
        $("#btnAdd_NhanSu").on("click", function () {
            me.rewrite_ThemNS();
            me.loadCombos_ThemNS();
        });
        $("#btnRewrite_ThemNS").click(function () {
            me.rewrite_ThemNS();
        });
        $("#btnSave_ThemNS").click(function () {
            me.save_ThemNhanSu();
        });
        // Header checkbox: toggle ALL items across all pages (không chỉ trang hiện tại)
        $("#chkAll_NSDaChon").on("change", function () {
            var checked = $(this).is(":checked");
            (me.dtNS_DaChon || []).forEach(function (x) { x._checked = checked; });
            me.genTable_NSDaChon();
        });
        // Row checkbox: update _checked trong model
        $("#tblNSDaChon_ThemNS").on("change", ".chk-ns-row", function () {
            var id = $(this).attr("data-id");
            var checked = $(this).is(":checked");
            var ns = (me.dtNS_DaChon || []).filter(function (x) { return x.ID === id; })[0];
            if (ns) ns._checked = checked;
            $("#pgChecked_NSDaChon").text((me.dtNS_DaChon || []).filter(function (x) { return x._checked !== false; }).length);
            me._syncHeaderChk_NSDaChon();
        });
        // Xóa 1 dòng khỏi model + re-render (giữ page hợp lệ)
        $("#tblNSDaChon_ThemNS").on("click", ".btn-remove-ns", function () {
            var id = $(this).attr("data-id");
            me.dtNS_DaChon = me.dtNS_DaChon.filter(function (x) { return x.ID !== id; });
            me.genTable_NSDaChon();
        });
        // Pagination: click số trang
        $("#paging_NSDaChon_ThemNS").on("click", ".page-link", function (e) {
            e.preventDefault();
            var target = parseInt($(this).attr("data-page"), 10);
            if (isNaN(target)) return;
            me._nsDaChon_page = target;
            me.genTable_NSDaChon();
        });
        // Đổi page size
        $("#pgSize_NSDaChon").on("change", function () {
            me._nsDaChon_pageSize = parseInt($(this).val(), 10) || 20;
            me._nsDaChon_page = 1;
            me.genTable_NSDaChon();
        });

        /*------------------------------------------
        -- Modal Picker chọn nhân sự
        -------------------------------------------*/
        $("#modal-PickNS-KHTSN").on("show.bs.modal", function () {
            me.loadCombo_CCTC_PickNS();
            $("#tblNS_PickNS tbody").html('<tr><td colspan="5" class="td-center text-muted py-3">Chọn đơn vị & bấm "Tìm nhân sự"</td></tr>');
        });
        $("#btnLoadNS_PickNS").click(function () {
            me.getList_NhanSu_PickNS();
        });
        $("#txtSearchNS_PickNS").keypress(function (e) {
            if (e.which === 13) { e.preventDefault(); me.getList_NhanSu_PickNS(); }
        });
        $("#chkAll_PickNS").on("change", function () {
            var checked = $(this).is(":checked");
            $("#tblNS_PickNS tbody .chk-ns-pick").prop("checked", checked);
        });
        $("#btnConfirm_PickNS").click(function () {
            me.confirmPick_NS();
        });
        /*------------------------------------------
        -- Khai mức phí & Kết quả nhập học (placeholder)
        -------------------------------------------*/
        // Click nút "Xem" cột Khai mức phí → navigate sang trang Khai mức phí thu nhập học
        // (chức năng CRUD đầy đủ, có phân quyền riêng — user click từ đây phải có quyền menu đó)
        $("#tblKHNH_KHTSN").on("click", ".btn-view-muc-phi", function (e) {
            e.preventDefault();
            var khnhId = $(this).attr("data-id");
            if (!khnhId) return;
            sessionStorage.setItem('KHTSN_preselect_KHNH_Id', khnhId);
            // sys là biến local ở index.aspx — global là edu.system
            var list = (edu.system && edu.system.dtChucNang) || [];
            var target = null;
            for (var i = 0; i < list.length; i++) {
                var f = list[i] && list[i].DUONGDANFILE;
                if (f && f.toLowerCase().indexOf('khaimucphinhaphoc') >= 0) {
                    target = list[i]; break;
                }
            }
            if (target && typeof edu.system.initMain === 'function') {
                try {
                    edu.system.initMain(target.DUONGDANHIENTHI, target.DUONGDANFILE, target.ID);
                } catch (ex) {
                    edu.system.alert("Không mở được trang Khai mức phí: " + ex.message, "w");
                }
            } else {
                edu.system.alert("Bạn chưa được phân quyền menu 'Khai mức phí thu nhập học' — liên hệ admin để bổ sung quyền.", "w");
            }
        });
        $("#tblKHNH_KHTSN").on("click", ".btn-view-ket-qua", function () {
            edu.system.alert("Chức năng 'Kết quả nhập học' sẽ bổ sung sau", "i");
        });
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_GetDs
    -- Lấy danh sách Kế hoạch nhập học theo bộ lọc
    -------------------------------------------*/
    getList_KeHoachNhapHoc: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/ETMeDykeCikPKSAxCS4iHgYkNQUy',
            'func': 'PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_GetDs',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtThongTin_KHTSN'),
            'strTS_KeHoach_TuyenSinh_Id': edu.system.getValById('dropKeHoachTuyenSinh_KHTSN'),
            'strTS_KeHoach_TS_Dot_Id': edu.system.getValById('dropDotTuyenSinh_KHTSN'),
            'strNhapHoc_Type_Code': '',
            'strStatus_Code': '',
            'strOwner_Org_Id': '',
            'strManage_Org_Id': '',
            'strReceive_Org_Id': '',
            'dIs_Active': edu.system.getValById('dropHieuLuc_KHTSN') || 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKeHoachNhapHoc = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genTable_KeHoachNhapHoc(me.dtKeHoachNhapHoc);
                }
                else {
                    edu.system.alert("Pr_Nh_KhNhapHoc_GetDs: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Nh_KhNhapHoc_GetDs (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_KeHoachNhapHoc: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        $("#lblTongKHNH_KHTSN").text(data ? data.length : 0);
        var $tbody = $("#tblKHNH_KHTSN tbody");
        $tbody.html("");
        if (!data || data.length === 0) {
            $tbody.append(
                '<tr><td colspan="12">'
                + '<div class="empty-state">'
                + '<i class="fa-solid fa-inbox"></i>'
                + '<p>Chưa có dữ liệu — chọn <b>Kế hoạch tuyển sinh</b>, <b>Đợt tuyển sinh</b> rồi bấm <b>Danh sách</b></p>'
                + '</div>'
                + '</td></tr>'
            );
            return;
        }
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var sMa = d.MA || d.MA_KEHOACH || d.Ma || '';
            var sTen = d.TEN || d.TEN_KEHOACH || d.Ten || '';
            var sBd = me._fmtDate(d.NGAY_BATDAU || d.NGAYBATDAU || d.NGAY_BAT_DAU || '');
            var sKt = me._fmtDate(d.NGAY_KETTHUC || d.NGAYKETTHUC || d.NGAY_KET_THUC || '');
            var sNgayTao = me._fmtDateTime(d.NGAYTAO || d.NGAY_TAO || '');
            var sNguoiTao = d.NGUOITAO_TEN || d.NGUOITAO || d.NGUOI_TAO || d.NGUOITAO_TenDayDu || '';
            rows += '<tr id="row_khnh_' + strId + '">'
                +  '<td class="td-center">' + (i + 1) + '</td>'
                +  '<td class="td-left">' + sMa + '</td>'
                +  '<td class="td-left">' + sTen + '</td>'
                +  '<td class="td-center">' + sBd + '</td>'
                +  '<td class="td-center">' + sKt + '</td>'
                +  '<td class="td-center"><a class="btn btn-default btn-view-kh-dau-ra" data-id="' + strId + '" data-bs-toggle="modal" data-bs-target="#modal-KHDauRa-KHTSN"><i class="fa fa-eye"></i> Xem</a></td>'
                +  '<td class="td-center"><a class="btn btn-default btn-view-nhan-su" data-id="' + strId + '" data-bs-toggle="modal" data-bs-target="#modal-NhanSu-KHTSN"><i class="fa fa-eye"></i> Xem</a></td>'
                +  '<td class="td-center"><a class="btn btn-default btn-view-muc-phi" data-id="' + strId + '"><i class="fa fa-eye"></i> Xem</a></td>'
                +  '<td class="td-center"><a class="btn btn-default btn-view-ket-qua" data-id="' + strId + '"><i class="fa fa-eye"></i> Xem</a></td>'
                +  '<td class="td-center">' + sNgayTao + '</td>'
                +  '<td class="td-left">' + sNguoiTao + '</td>'
                +  '<td class="td-center"><a class="btn btn-primary btn-view-chi-tiet" data-id="' + strId + '" data-bs-toggle="modal" data-bs-target="#modal-Them-KHTSN"><i class="fa-solid fa-pen-to-square"></i> Xem/Sửa</a></td>'
                +  '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List
    -- Dùng cho combo Kế hoạch tuyển sinh
    -------------------------------------------*/
    getList_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4NKDI1',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strLoai_TuyenSinh_Id': '',
            'strTs_PhuongAn_TuyenSinh_Id': '',
            'strNam_TuyenSinh': '',
            'strNam_Hoc': '',
            'strHoc_Ky': '',
            'strPlan_Status_Code': '',
            'dIs_Active': edu.system.getValById('dropHieuLuc_KHTSN') || 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKeHoachTuyenSinh = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genCombo_KeHoachTuyenSinh('dropKeHoachTuyenSinh_KHTSN', '');
                }
                else {
                    edu.system.alert("Pr_Ts_KH_TuyenSinh_Get_List: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_KH_TuyenSinh_Get_List (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_KeHoachTuyenSinh: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKeHoachTuyenSinh,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "" },
            renderPlace: [strDrop_Id],
            title: "Kế hoạch tuyển sinh",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds
    -- Dùng cho combo Đợt tuyển sinh (cascade theo Kế hoạch)
    -------------------------------------------*/
    getList_DotTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            return;
        }
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_KeHoach_TuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strDot_Status_Code': '',
            'dIs_Active': edu.system.getValById('dropHieuLuc_KHTSN') || 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDotTuyenSinh = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genCombo_DotTuyenSinh('dropDotTuyenSinh_KHTSN', '');
                }
                else {
                    edu.system.alert("Pr_Ts_Kh_Ts_Dot_Get_Ds: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ts_Dot_Get_Ds (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_DotTuyenSinh: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtDotTuyenSinh,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "" },
            renderPlace: [strDrop_Id],
            title: "Đợt tuyển sinh",
            default_val: default_val
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_DauRa
    -- Xem "Kế hoạch đầu ra" theo KH nhập học đang chọn
    -------------------------------------------*/
    getList_KHDauRa: function (strKHNH_Id, cb) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDwkeCiQJLiAiKR4FIDQTIAPP',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_DauRa',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNH_KeHoach_NhapHoc_Id': strKHNH_Id,
            'strDaoTao_HeDaoTao_Id': '',
            'strDaoTao_KhoaDaoTao_Id': '',
            'strDaoTao_KhoaQuanLy_Id': '',
            'strDaoTao_Nganh_DT_Id': '',
            'strDaoTao_Nganh_TS_Id': '',
            'strDauRa_Status_Code': '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genTable_KHDauRa(dtResult);
                    if (typeof cb === 'function') cb(dtResult);
                } else {
                    edu.system.alert("LayDS_NH_KeHoach_DauRa: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("LayDS_NH_KeHoach_DauRa (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    genTable_KHDauRa: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $("#tblKHDauRa_KHTSN tbody");
        $tbody.html("");
        $("#lblTong_KHDauRa").text(data ? data.length : 0);
        $("#chkAll_KHDauRa").prop('checked', false).prop('indeterminate', false);
        if (!data || data.length === 0) {
            $tbody.append('<tr><td colspan="19" class="td-center text-muted py-3">Không có dữ liệu — bấm "Khởi tạo từ tuyển sinh" để tạo từ Kế hoạch tuyển sinh</td></tr>');
            return;
        }
        var iconCheck = '<i class="fa-solid fa-check text-success"></i>';
        var iconX = '<i class="fa-solid fa-xmark text-danger"></i>';
        var mergeTenMa = function (ten, ma) {
            ten = ten || ''; ma = ma || '';
            if (ten && ma) return ten + ' (' + ma + ')';
            return ten || ma;
        };
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var iXacNhanCoSo = Number(d.REQUIRE_XACNHAN_COSO || 0);
            var strXacNhanText = iXacNhanCoSo === 1
                ? '<span class="badge bg-primary">Yêu cầu xác nhận CSĐT</span>'
                : '';
            rows += '<tr data-id="' + strId + '">'
                + '<td class="td-center">'
                +   '<input type="checkbox" class="chk-daura-row" data-id="' + strId + '"'
                +     (iXacNhanCoSo === 1 ? ' checked' : '') + ' />'
                + '</td>'
                + '<td class="td-center">' + (i + 1) + '</td>'
                + '<td class="td-left">' + (d.MA_DAU_RA || d.MA || '') + '</td>'
                + '<td class="td-left">' + (d.TEN_DAU_RA || d.TEN || '') + '</td>'
                + '<td class="td-left">' + (d.HEDAOTAO_TEN || d.HE_DAOTAO_TEN || '') + '</td>'
                + '<td class="td-left">' + (d.KHOADAOTAO_TEN || d.KHOA_DAOTAO_TEN || '') + '</td>'
                + '<td class="td-left">' + mergeTenMa(d.CHUONGTRINH_TEN, d.CHUONGTRINH_MA) + '</td>'
                + '<td class="td-left">' + mergeTenMa(d.NGANH_DT_TEN || d.NGANHDAOTAO_TEN, d.NGANH_DT_MA) + '</td>'
                + '<td class="td-left">' + mergeTenMa(d.NGANH_TS_TEN || d.NGANHTUYENSINH_TEN, d.NGANH_TS_MA) + '</td>'
                + '<td class="td-left">' + (d.KHOAQUANLY_TEN || d.KHOA_QUANLY_TEN || '') + '</td>'
                + '<td class="td-center">' + (d.CHI_TIEU_NHAPHOC || d.CHITIEU || d.CHI_TIEU || 0) + '</td>'
                + '<td class="td-center">' + (d.SO_DA_GAN || 0) + '</td>'
                + '<td class="td-center">' + (d.SO_DA_XACNHAN || 0) + '</td>'
                + '<td class="td-center">' + (d.SO_DA_TAO_STUDY || 0) + '</td>'
                + '<td class="td-center">' + strXacNhanText + '</td>'
                + '<td class="td-left">' + (d.DAURA_STATUS_TEN || d.DAU_RA_STATUS_TEN || d.STATUS_TEN || d.DAU_RA_STATUS_CODE || '') + '</td>'
                + '<td class="td-center">' + (d.IS_ACTIVE == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + me._fmtDateTime(d.NGAYTAO || d.NGAY_TAO || '') + '</td>'
                + '<td class="td-left">' + (d.NGUOITAO_TEN || d.NGUOITAO || '') + '</td>'
                + '</tr>';
        }
        $tbody.append(rows);
        me._syncHeaderChk_KHDauRa();
    },

    /* Đồng bộ header checkbox theo state các row checkbox */
    _syncHeaderChk_KHDauRa: function () {
        var $chks = $("#tblKHDauRa_KHTSN tbody .chk-daura-row");
        var total = $chks.length;
        if (total === 0) {
            $("#chkAll_KHDauRa").prop('checked', false).prop('indeterminate', false);
            return;
        }
        var checked = $chks.filter(':checked').length;
        $("#chkAll_KHDauRa")
            .prop('checked', checked === total)
            .prop('indeterminate', checked > 0 && checked < total);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Chuyen_KH_DauRa_TuTuyenSinh
    -- Copy TS_KEHOACH_DAU_RA -> NH_KEHOACH_DAU_RA cho kế hoạch nhập học đang xem
    -------------------------------------------*/
    khoiTao_KHDauRa_TuTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKHNH_Id_ForView)) return;
        var beforeCount = parseInt($("#lblTong_KHDauRa").text(), 10) || 0;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/Aik0OCQvHgoJHgUgNBMgHhU0FTQ4JC8SKC8p',
            'func': 'PKG_CORE_NHAPHOC.Chuyen_KH_DauRa_TuTuyenSinh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'THEM',
            'strNH_KH_NhapHoc_Id': me.strKHNH_Id_ForView
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert("Chuyen_KH_DauRa_TuTuyenSinh: " + data.Message, "w");
                    return;
                }
                me.getList_KHDauRa(me.strKHNH_Id_ForView, function (dt) {
                    var afterCount = (dt && dt.length) || 0;
                    var added = afterCount - beforeCount;
                    if (added > 0) {
                        edu.system.alert("Đã tạo mới " + added + " kế hoạch đầu ra từ tuyển sinh", "s");
                    } else if (afterCount === 0) {
                        edu.system.alert(
                            "API chạy thành công nhưng không có bản ghi nào được tạo.\n"
                            + "Nguyên nhân thường gặp: Kế hoạch tuyển sinh chưa khai báo Đầu ra.\n"
                            + "Vui lòng vào màn 'Kế hoạch tuyển sinh' → khai đầu ra cho kế hoạch tương ứng, rồi thử lại.",
                            "w"
                        );
                    } else {
                        edu.system.alert(
                            "Không có bản ghi mới được tạo — có thể tất cả đầu ra của tuyển sinh đã được copy sang trước đây.",
                            "i"
                        );
                    }
                });
            },
            error: function (er) {
                edu.system.alert("Chuyen_KH_DauRa_TuTuyenSinh (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Sua_KeHoachDauRa_XacNhanCoSo
    -- Duyệt tuần tự từng dòng, tick → gán 1, không tick → gán 0
    -- Sequential (giữ thứ tự log + tránh spam backend nếu KH có nhiều đầu ra)
    -------------------------------------------*/
    capNhat_XacNhanCoSo_Bulk: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $rows = $("#tblKHDauRa_KHTSN tbody tr[data-id]");
        var arr = [];
        $rows.each(function () {
            var strId = $(this).attr('data-id');
            var checked = $(this).find('.chk-daura-row').is(':checked');
            if (strId) arr.push({ id: strId, val: checked ? 1 : 0 });
        });
        if (arr.length === 0) return;

        var idx = 0, ok = 0, fail = 0;
        var failMsgs = [];
        var doNext = function () {
            if (idx >= arr.length) {
                var msg = "Đã cập nhật " + ok + "/" + arr.length + " đầu ra";
                if (fail > 0) {
                    msg += ". Lỗi: " + fail + " dòng";
                    console.warn("Sua_KeHoachDauRa_XacNhanCoSo — chi tiết lỗi:", failMsgs);
                }
                edu.system.alert(msg, fail > 0 ? "w" : "s");
                if (edu.util.checkValue(me.strKHNH_Id_ForView)) {
                    me.getList_KHDauRa(me.strKHNH_Id_ForView);
                }
                return;
            }
            var item = arr[idx++];
            var obj_save = {
                'action': 'SV_CORE_NhapHoc_MH/EjQgHgokCS4gIikFIDQTIB4ZICIPKSAvAi4SLgPP',
                'func': 'PKG_CORE_NHAPHOC.Sua_KeHoachDauRa_XacNhanCoSo',
                'iM': edu.system.iM,
                'strNh_KeHoach_Dau_Ra_Id': item.id,
                'dGiaTri': item.val,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'SUA'
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) ok++;
                    else { fail++; failMsgs.push(item.id + ': ' + (data.Message || '')); }
                    doNext();
                },
                error: function (er) {
                    fail++;
                    failMsgs.push(item.id + ': ex ' + JSON.stringify(er));
                    doNext();
                },
                type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
            }, false, false, false, null);
        };
        doNext();
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhanSu
    -- Xem "Bố trí nhân sự" theo KH nhập học đang chọn
    -------------------------------------------*/
    getList_NhanSu: function (strKHNH_Id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/DSA4BRIeDwkeCiQJLiAiKR4PKSAvEjQP',
            'func': 'PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM',
            'strNH_KeHoach_NhapHoc_Id': strKHNH_Id,
            'strPerson_Id': '',
            'strDonVi_Id': '',
            'strVaiTro_NhapHoc_Code': '',
            'dIs_Primary': '',
            'dIs_Manager': '',
            'dIs_Approver': ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.dtNS_List = dtResult;
                    me._enrichNhanSu_FromPicker(dtResult, function () {
                        me.genTable_NhanSu(me.dtNS_List);
                    });
                } else {
                    edu.system.alert("LayDS_NH_KeHoach_NhanSu: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("LayDS_NH_KeHoach_NhanSu (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- BE proc PKG_CORE_NHAPHOC.LayDS_NH_KeHoach_NhanSu JOIN sai bảng
    -- → PERSON_HOTEN/PERSON_MA/DONVI_TEN luôn rỗng.
    -- Workaround: query pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2 (nguồn picker)
    -- → build map by ID → enrich record trước khi render.
    -------------------------------------------*/
    _mapNS_Cache: null,
    _enrichNhanSu_FromPicker: function (list, done) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!list || list.length === 0) { done(); return; }
        var missingIds = [];
        for (var i = 0; i < list.length; i++) {
            var pid = list[i].CORE_PERSON_ID;
            if (!pid) continue;
            var hoten = (list[i].PERSON_HOTEN || '').trim();
            var mac = list[i].PERSON_MA;
            if (!hoten || !mac) missingIds.push(pid);
        }
        if (missingIds.length === 0) { done(); return; }
        if (me._mapNS_Cache) {
            me._applyEnrich(list, me._mapNS_Cache);
            done();
            return;
        }
        var obj_req = {
            action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP',
            func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
            iM: edu.system.iM,
            strTuKhoa: '',
            strDaoTao_CoCauToChuc_Id: '',
            strChucVu_Id: '',
            strTinhTrangNhanSu_Id: '',
            dLaCanBoNgoaiTruong: 0,
            pageIndex: 1,
            pageSize: 100000,
            strNguoiThucHien_Id: edu.system.userId,
            strVaiTroDangNhap_Id: edu.system.strVaiTro_Id || '',
            strChucNangHeThong_Id: edu.system.strChucNang_Id || ''
        };
        edu.system.makeRequest({
            success: function (data) {
                var arr = (data && data.Success && edu.util.checkValue(data.Data)) ? data.Data : [];
                var map = {};
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] && arr[i].ID) map[arr[i].ID] = arr[i];
                }
                me._mapNS_Cache = map;
                me._applyEnrich(list, map);
                done();
            },
            error: function () { done(); },
            type: 'POST', contentType: true, action: obj_req.action, data: obj_req, fakedb: []
        }, false, false, false, null);
    },
    _applyEnrich: function (list, map) {
        for (var i = 0; i < list.length; i++) {
            var d = list[i];
            var pid = d.CORE_PERSON_ID;
            if (!pid || !map[pid]) continue;
            var ns = map[pid];
            if (!(d.PERSON_HOTEN || '').trim()) d.PERSON_HOTEN = ns.HOTEN || '';
            if (!d.PERSON_MA) d.PERSON_MA = ns.MASO || '';
            if (!d.DONVI_TEN) d.DONVI_TEN = ns.DAOTAO_COCAUTOCHUC_TEN || '';
        }
    },

    genTable_NhanSu: function (data) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var $tbody = $("#tblNhanSu_KHTSN tbody");
        $tbody.html("");
        $("#lblTong_NhanSu").text(data ? data.length : 0);
        if (!data || data.length === 0) {
            $tbody.append('<tr><td colspan="14" class="td-center text-muted py-3">Không có dữ liệu</td></tr>');
            return;
        }
        var iconCheck = '<i class="fa-solid fa-check text-success"></i>';
        var iconX = '<i class="fa-solid fa-xmark text-danger"></i>';
        var mergeTenMa = function (ten, ma) {
            ten = ten || ''; ma = ma || '';
            if (ten && ma) return ten + ' (' + ma + ')';
            return ten || ma;
        };
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = d.ID || d.Id || d.id || '';
            var sTenRaw = (d.PERSON_HOTEN || d.PERSON_TEN || d.NHANSU_TEN || '').trim();
            var sMaRaw = d.PERSON_MA || d.NHANSU_MA || '';
            var sNhanSu = mergeTenMa(sTenRaw, sMaRaw);
            if (!sNhanSu && d.CORE_PERSON_ID) {
                sNhanSu = '<span class="text-muted" title="BE chưa JOIN được thông tin nhân sự">(ID: ' + d.CORE_PERSON_ID.substring(0, 8) + '…)</span>';
            }
            rows += '<tr>'
                + '<td class="td-center">' + (i + 1) + '</td>'
                + '<td class="td-left">' + sNhanSu + '</td>'
                + '<td class="td-left">' + (d.NH_KEHOACH_NHAPHOC_TEN || d.KHNHAPHOC_TEN || '') + '</td>'
                + '<td class="td-left">' + (d.VAITRO_TEN || d.VAITRO_NHAPHOC_TEN || d.VAITRO_NHAPHOC_CODE || '') + '</td>'
                + '<td class="td-center">' + me._fmtDate(d.NGAY_BATDAU || d.NGAYBATDAU || '') + '</td>'
                + '<td class="td-center">' + me._fmtDate(d.NGAY_KETTHUC || d.NGAYKETTHUC || '') + '</td>'
                + '<td class="td-center">' + (d.IS_PRIMARY == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.IS_MANAGER == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-center">' + (d.IS_APPROVER == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-left">' + (d.PHANCONG_STATUS_TEN || d.PHANCONG_STATUS_CODE_TEN || d.STATUS_TEN || d.PHANCONG_STATUS_CODE || '') + '</td>'
                + '<td class="td-center">' + (d.IS_ACTIVE == 1 ? iconCheck : iconX) + '</td>'
                + '<td class="td-left">' + (d.NGUOITAO_TAIKHOAN || d.NGUOITAO_TEN || d.NGUOITAO || '') + '</td>'
                + '<td class="td-center">' + me._fmtDateTime(d.NGAYTAO || d.NGAY_TAO || '') + '</td>'
                + '<td class="td-center"><a class="btn btn-primary btn-view-nhansu-chitiet" data-id="' + strId + '" data-bs-toggle="modal" data-bs-target="#modal-NhanSu-ChiTiet-KHTSN"><i class="fa fa-info-circle"></i> Chi tiết</a></td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Chi tiết phân công nhân sự theo ID
    -- BE PKG_CORE_NHAPHOC KHÔNG có proc Get_By_Id riêng, chỉ có
    -- LayDS_NH_KeHoach_NhanSu (đã lưu cache vào me.dtNS_List ở list flow).
    -- → Lookup trực tiếp trong cache thay vì gọi API detail sai package.
    -------------------------------------------*/
    getDetail_NhanSu: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var list = me.dtNS_List || [];
        var dt = null;
        for (var i = 0; i < list.length; i++) {
            var recId = list[i].ID || list[i].Id || list[i].id;
            if (recId === strId) { dt = list[i]; break; }
        }
        me.genDetail_NhanSu(dt);
        return;
        // === legacy call, giữ lại reference ===
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeDzIeESkgLwIuLyYeBiQ1HgM4Hggl',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ns_PhanCong_Get_By_Id',
            'iM': edu.system.iM,
            'strId': strId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = null;
                    if (edu.util.checkValue(data.Data)) {
                        dt = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    me.genDetail_NhanSu(dt);
                } else {
                    edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Get_By_Id: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Ts_Kh_Ns_PhanCong_Get_By_Id (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Reset form Xem-sửa
    -------------------------------------------*/
    rewrite_EditNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        $("#lblThongTinNS_EditNS").html('<span class="text-muted">—</span>');
        $("#txtNgayBD_EditNS, #txtNgayKT_EditNS, #txtGhiChu_EditNS").val('');
        me._setSelectVal('dropVaiTro_EditNS', '');
        me._setSelectVal('dropTrangThai_EditNS', '');
        me._setSelectVal('dropHieuLuc_EditNS', '1');
        $("#chkPrimary_EditNS, #chkManager_EditNS, #chkApprover_EditNS").prop('checked', false);
    },

    /*------------------------------------------
    -- Load combo Vai trò + Trạng thái cho form Xem-sửa
    -- Reuse chung 2 danh mục với form Thêm mới
    -------------------------------------------*/
    loadCombos_EditNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) {
                var dt = data || [];
                if (!dt.length) dt = me._fallback_VaiTroNS();
                edu.system.loadToCombo_data({
                    data: dt,
                    renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                    renderPlace: ["dropVaiTro_EditNS"],
                    title: "Vai trò tham gia",
                    default_val: ''
                });
                // Re-apply value sau khi combo load xong (edit mode)
                if (me.dtNS_EditRecord) {
                    me._setSelectVal('dropVaiTro_EditNS', me.dtNS_EditRecord.VAITRO_NHAPHOC_CODE || me.dtNS_EditRecord.VAITRO_CODE || '');
                }
            }
        );
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) {
                var dt = data || [];
                if (!dt.length) dt = me._fallback_TrangThaiPhanCong();
                edu.system.loadToCombo_data({
                    data: dt,
                    renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                    renderPlace: ["dropTrangThai_EditNS"],
                    title: "Trạng thái phân công",
                    default_val: ''
                });
                if (me.dtNS_EditRecord) {
                    me._setSelectVal('dropTrangThai_EditNS', me.dtNS_EditRecord.PHANCONG_STATUS_CODE || me.dtNS_EditRecord.STATUS_CODE || '');
                }
            }
        );
    },

    /*------------------------------------------
    -- Đổ dữ liệu chi tiết vào form Xem-sửa
    -------------------------------------------*/
    genDetail_NhanSu: function (d) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!d) {
            $("#lblThongTinNS_EditNS").html('<span class="text-muted">Không có dữ liệu</span>');
            return;
        }
        me.dtNS_EditRecord = d;
        var mergeTenMa = function (ten, ma) {
            ten = ten || ''; ma = ma || '';
            if (ten && ma) return ten + ' (' + ma + ')';
            return ten || ma;
        };
        var sTen = (d.PERSON_HOTEN || d.PERSON_TEN || d.HOTEN || d.HO_TEN
            || d.NHANSU_HOTEN || d.NHANSU_TEN || d.NS_HOTEN || d.NS_TEN || '').trim();
        var sMa = d.PERSON_MA || d.NHANSU_MA || d.MASO || d.MA_NS || d.MA || '';
        var sDonVi = d.DONVI_TEN || d.DON_VI_TEN || d.TEN_DONVI
            || d.DAOTAO_COCAUTOCHUC_TEN || d.COCAUTOCHUC_TEN || '';
        var mergedNS = mergeTenMa(sTen, sMa);
        var infoHtml;
        if (mergedNS) {
            infoHtml = '<span>' + mergedNS + '</span>';
        } else if (d.CORE_PERSON_ID) {
            infoHtml = '<span class="text-warning"><i class="fa fa-exclamation-triangle"></i> BE chưa trả về tên nhân sự (CORE_PERSON_ID: <code>' + d.CORE_PERSON_ID + '</code>)</span>';
        } else {
            infoHtml = '<span class="text-muted">(không có thông tin nhân sự)</span>';
        }
        if (sDonVi) infoHtml += '&nbsp;<span class="lbl-k">·</span>&nbsp;<span class="lbl-k">Đơn vị:</span>' + sDonVi;
        else if (d.DONVI_ID) infoHtml += '&nbsp;<span class="text-muted">· Đơn vị ID: ' + d.DONVI_ID.substring(0, 8) + '…</span>';
        $("#lblThongTinNS_EditNS").html(infoHtml);

        $("#txtNgayBD_EditNS").val(me._fmtDate(d.NGAY_BATDAU || d.NGAYBATDAU || ''));
        $("#txtNgayKT_EditNS").val(me._fmtDate(d.NGAY_KETTHUC || d.NGAYKETTHUC || ''));
        $("#txtGhiChu_EditNS").val(d.GHICHU || d.GHI_CHU || '');
        me._setSelectVal('dropVaiTro_EditNS', d.VAITRO_NHAPHOC_CODE || d.VAITRO_CODE || '');
        me._setSelectVal('dropTrangThai_EditNS', d.PHANCONG_STATUS_CODE || d.STATUS_CODE || '');
        me._setSelectVal('dropHieuLuc_EditNS', String(d.IS_ACTIVE == null ? 1 : d.IS_ACTIVE));
        $("#chkPrimary_EditNS").prop('checked', d.IS_PRIMARY == 1);
        $("#chkManager_EditNS").prop('checked', d.IS_MANAGER == 1);
        $("#chkApprover_EditNS").prop('checked', d.IS_APPROVER == 1);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Sua_NH_KeHoach_NhanSu
    -- Note: API Sửa KHÔNG có dIs_Active (dùng nút Xóa để bỏ hiệu lực)
    -- Giữ nguyên strDonVi_Id, strSource_Type_Code, strSource_Ref_Id, strDecision_Id từ record gốc
    -------------------------------------------*/
    update_NhanSu: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strNS_EditId)) return;
        // Không validate Vai trò — form optional theo yêu cầu
        var sVaiTro = edu.system.getValById('dropVaiTro_EditNS');
        var rec = me.dtNS_EditRecord || {};
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/EjQgHg8JHgokCS4gIikeDykgLxI0',
            'func': 'PKG_CORE_NHAPHOC.Sua_NH_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strId': me.strNS_EditId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'SUA',
            'strDonVi_Id': rec.DONVI_ID || rec.DON_VI_ID || '',
            'strVaiTro_NhapHoc_Code': sVaiTro,
            'strNgay_BatDau': edu.system.getValById('txtNgayBD_EditNS'),
            'strNgay_KetThuc': edu.system.getValById('txtNgayKT_EditNS'),
            'dIs_Primary': $("#chkPrimary_EditNS").is(":checked") ? 1 : 0,
            'dIs_Manager': $("#chkManager_EditNS").is(":checked") ? 1 : 0,
            'dIs_Approver': $("#chkApprover_EditNS").is(":checked") ? 1 : 0,
            'strSource_Type_Code': rec.SOURCE_TYPE_CODE || '',
            'strSource_Ref_Id': rec.SOURCE_REF_ID || '',
            'strDecision_Id': rec.DECISION_ID || '',
            'strGhiChu': edu.system.getValById('txtGhiChu_EditNS')
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật phân công nhân sự thành công", "s");
                    me._closeEditNS_ReloadList();
                } else {
                    edu.system.alert("Sua_NH_KeHoach_NhanSu: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Sua_NH_KeHoach_NhanSu (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Xoa_NH_KeHoach_NhanSu
    -------------------------------------------*/
    delete_NhanSu: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strNS_EditId)) return;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/GS4gHg8JHgokCS4gIikeDykgLxI0',
            'func': 'PKG_CORE_NHAPHOC.Xoa_NH_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strId': me.strNS_EditId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đã xóa phân công nhân sự", "s");
                    me._closeEditNS_ReloadList();
                } else {
                    edu.system.alert("Xoa_NH_KeHoach_NhanSu: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Xoa_NH_KeHoach_NhanSu (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    _closeEditNS_ReloadList: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Dùng jQuery API để match với edu.system.alert. Re-show modal cha NhanSu
        // vì BS5 5.3.2 quirk auto-hide parent khi mở child.
        var $edit = $('#modal-NhanSu-ChiTiet-KHTSN');
        $edit.one('hidden.bs.modal', function () {
            var $nhansu = $('#modal-NhanSu-KHTSN');
            if (!$nhansu.hasClass('show')) $nhansu.modal('show');
            $('body').addClass('modal-open');
        });
        $edit.modal('hide');
        me.strNS_EditId = '';
        me.dtNS_EditRecord = null;
        if (edu.util.checkValue(me.strKHNH_Id_ForView)) {
            me.getList_NhanSu(me.strKHNH_Id_ForView);
        }
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_GetById
    -- Lấy chi tiết KH nhập học, đổ vào form Xem-sửa
    -------------------------------------------*/
    getDetail_KHNH_ForEdit: function (strId) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/ETMeDykeCikPKSAxCS4iHgYkNQM4CCUP',
            'func': 'PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_GetById',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = null;
                    if (edu.util.checkValue(data.Data)) {
                        dt = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    }
                    me.populateForm_KHNH(dt);
                } else {
                    edu.system.alert("Pr_Nh_KhNhapHoc_GetById: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Nh_KhNhapHoc_GetById (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Đổ dữ liệu chi tiết vào các control form
    -- Combo đợt phụ thuộc combo KH TS → sau khi set KH TS thì load đợt rồi set giá trị
    -------------------------------------------*/
    populateForm_KHNH: function (d) {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!d) return;
        me.dtKHNH_EditRecord = d;
        $("#txtMa_AddKHNH").val(d.MA || d.MA_KEHOACH || '');
        $("#txtTen_AddKHNH").val(d.TEN || d.TEN_KEHOACH || '');
        $("#txtNgayBD_AddKHNH").val(me._fmtDate(d.NGAY_BATDAU || d.NGAYBATDAU || ''));
        $("#txtNgayKT_AddKHNH").val(me._fmtDate(d.NGAY_KETTHUC || d.NGAYKETTHUC || ''));
        $("#txtGhiChu_AddKHNH").val(d.GHICHU || d.GHI_CHU || '');

        me._setSelectVal('dropLoaiKHNH_AddKHNH', d.NHAPHOC_TYPE_CODE || '');
        me._setSelectVal('dropTrangThai_AddKHNH', d.STATUS_CODE || '');
        me._setSelectVal('dropOwnerOrg_AddKHNH', d.OWNER_ORG_ID || '');
        me._setSelectVal('dropManageOrg_AddKHNH', d.MANAGE_ORG_ID || '');
        me._setSelectVal('dropReceiveOrg_AddKHNH', d.RECEIVE_ORG_ID || '');
        me._setSelectVal('dropIsActive_AddKHNH', String(d.IS_ACTIVE == null ? 1 : d.IS_ACTIVE));

        // Cascade KH TS → Đợt: set KH TS, cascade handler ở init sẽ trigger getList_DotTS_ForAdd
        // getList_DotTS_ForAdd đọc cache dtKHNH_EditRecord để set Đợt value đúng
        var sKHTS = d.TS_KEHOACH_TUYENSINH_ID || '';
        if (sKHTS) {
            me._setSelectVal('dropKeHoachTS_AddKHNH', sKHTS);
            // Nếu cascade change event chưa fire (setVal trước init select2 chẳng hạn),
            // gọi trực tiếp getList_DotTS_ForAdd để đảm bảo Đợt được load
            if (!$("#dropDotTS_AddKHNH option[value]:not([value=''])").length) {
                me.getList_DotTS_ForAdd(sKHTS);
            }
        }

        // Checkbox flags
        $("#chkReqXacNhan_AddKHNH").prop('checked', d.REQUIRE_XACNHAN == 1);
        $("#chkReqHoSo_AddKHNH").prop('checked', d.REQUIRE_HOSO == 1);
        $("#chkReqTaiChinh_AddKHNH").prop('checked', d.REQUIRE_TAICHINH == 1);
        $("#chkReqPhanLop_AddKHNH").prop('checked', d.REQUIRE_PHANLOP == 1);
        $("#chkReqTaiKhoan_AddKHNH").prop('checked', d.REQUIRE_TAIKHOAN == 1);
        $("#chkAutoStudy_AddKHNH").prop('checked', d.IS_AUTO_STUDY == 1);
        $("#chkAutoClass_AddKHNH").prop('checked', d.IS_AUTO_CLASS_ASSIGN == 1);
        $("#chkAutoAccount_AddKHNH").prop('checked', d.IS_AUTO_ACCOUNT_CREATE == 1);
        $("#chkAutoComplete_AddKHNH").prop('checked', d.IS_AUTO_COMPLETE == 1);
    },

    _setSelectVal: function (id, val) {
        var $el = $("#" + id);
        if (!$el.length) return;
        $el.val(val);
        try { $el.trigger('change.select2'); } catch (e) {}
    },

    /*------------------------------------------
    -- Format ngày:
    --   20260706102656 (YYYYMMDDHHMMSS) => 06/07/2026 10:26:56
    --   20260706 (YYYYMMDD) => 06/07/2026
    --   Chuỗi khác (đã format sẵn dd/mm/yyyy ...) => giữ nguyên
    -------------------------------------------*/
    _fmtDateTime: function (v) {
        if (v === null || v === undefined || v === '') return '';
        var s = String(v).trim();
        if (/^\d{14}$/.test(s)) {
            return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4) + ' '
                 + s.substr(8, 2) + ':' + s.substr(10, 2) + ':' + s.substr(12, 2);
        }
        if (/^\d{8}$/.test(s)) {
            return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4);
        }
        return s;
    },
    /*------------------------------------------
    -- Re-apply giá trị vào các combo sau khi combo load xong async
    -- Gọi từ cuối callback của mỗi getList combo trong form Thêm/Sửa
    -------------------------------------------*/
    _reapplyEditKHNH: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var d = me.dtKHNH_EditRecord;
        if (!me.strKHNH_EditId || !d) return;
        if (d.NHAPHOC_TYPE_CODE) me._setSelectVal('dropLoaiKHNH_AddKHNH', d.NHAPHOC_TYPE_CODE);
        if (d.STATUS_CODE) me._setSelectVal('dropTrangThai_AddKHNH', d.STATUS_CODE);
        if (d.OWNER_ORG_ID) me._setSelectVal('dropOwnerOrg_AddKHNH', d.OWNER_ORG_ID);
        if (d.MANAGE_ORG_ID) me._setSelectVal('dropManageOrg_AddKHNH', d.MANAGE_ORG_ID);
        if (d.RECEIVE_ORG_ID) me._setSelectVal('dropReceiveOrg_AddKHNH', d.RECEIVE_ORG_ID);
        if (d.TS_KEHOACH_TUYENSINH_ID) me._setSelectVal('dropKeHoachTS_AddKHNH', d.TS_KEHOACH_TUYENSINH_ID);
        if (d.IS_ACTIVE != null) me._setSelectVal('dropIsActive_AddKHNH', String(d.IS_ACTIVE));
    },

    _fmtDate: function (v) {
        if (v === null || v === undefined || v === '') return '';
        var s = String(v).trim();
        if (/^\d{14}$/.test(s) || /^\d{8}$/.test(s)) {
            return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4);
        }
        // Nếu có thêm giờ (dd/mm/yyyy hh:mm:ss), lấy phần ngày
        var m = s.match(/^(\d{2}\/\d{2}\/\d{4})/);
        if (m) return m[1];
        return s;
    },

    /*------------------------------------------
    -- Chuyển mode form: create <-> edit
    -------------------------------------------*/
    switchMode_Form: function (isEdit) {
        var $title = $("#titleForm_KHTSN");
        if (isEdit) {
            $title.find('.ico-add').addClass('d-none');
            $title.find('.ico-edit').removeClass('d-none');
            $title.find('.txt').html('&nbsp;Xem - sửa kế hoạch nhập học');
            $("#btnDelete_AddKHNH").removeClass('d-none');
        } else {
            $title.find('.ico-add').removeClass('d-none');
            $title.find('.ico-edit').addClass('d-none');
            $title.find('.txt').html('&nbsp;Thêm mới kế hoạch nhập học');
            $("#btnDelete_AddKHNH").addClass('d-none');
        }
    },

    /*==========================================================
     ===   FORM THÊM MỚI KẾ HOẠCH NHẬP HỌC
     ==========================================================*/

    /*------------------------------------------
    -- Reset form về mặc định
    -------------------------------------------*/
    rewrite_AddKHNH: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtKHNH_EditRecord = null;
        $("#txtMa_AddKHNH, #txtTen_AddKHNH, #txtNgayBD_AddKHNH, #txtNgayKT_AddKHNH, #txtGhiChu_AddKHNH").val('');
        $("#dropKeHoachTS_AddKHNH").val('').trigger('change.select2');
        $("#dropDotTS_AddKHNH").html('<option value="">Chọn đợt tuyển sinh</option>');
        $("#dropLoaiKHNH_AddKHNH").val('').trigger('change.select2');
        $("#dropTrangThai_AddKHNH").val('').trigger('change.select2');
        $("#dropOwnerOrg_AddKHNH, #dropManageOrg_AddKHNH, #dropReceiveOrg_AddKHNH").val('').trigger('change.select2');
        $("#dropIsActive_AddKHNH").val('1').trigger('change.select2');
        // Default checkboxes
        $("#chkReqXacNhan_AddKHNH, #chkReqHoSo_AddKHNH, #chkReqTaiChinh_AddKHNH").prop('checked', true);
        $("#chkReqPhanLop_AddKHNH, #chkReqTaiKhoan_AddKHNH").prop('checked', false);
        $("#chkAutoStudy_AddKHNH, #chkAutoClass_AddKHNH, #chkAutoAccount_AddKHNH, #chkAutoComplete_AddKHNH").prop('checked', false);
    },

    /*------------------------------------------
    -- Load 6 combo cho form Thêm mới
    -------------------------------------------*/
    loadCombos_AddKHNH: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.getList_KeHoachTS_ForAdd();
        me.getList_LoaiKHNH();
        me.getList_TrangThaiKHNH();
        me.getList_DonVi_ForAdd();
    },

    /*------------------------------------------
    -- Load KH tuyển sinh cho form Thêm mới (dùng lại API Pr_Ts_KH_TuyenSinh_Get_List)
    -------------------------------------------*/
    getList_KeHoachTS_ForAdd: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4NKDI1',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List',
            'iM': edu.system.iM,
            'strTuKhoa': '', 'strLoai_TuyenSinh_Id': '', 'strTs_PhuongAn_TuyenSinh_Id': '',
            'strNam_TuyenSinh': '', 'strNam_Hoc': '', 'strHoc_Ky': '', 'strPlan_Status_Code': '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = edu.util.checkValue(data.Data) ? data.Data : [];
                    edu.system.loadToCombo_data({
                        data: dt,
                        renderInfor: { id: "ID", parentId: "", name: "TEN", code: "" },
                        renderPlace: ["dropKeHoachTS_AddKHNH"],
                        title: "Kế hoạch tuyển sinh",
                        default_val: ''
                    });
                    me._reapplyEditKHNH();
                }
            },
            error: function () {},
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Load Đợt tuyển sinh cho form Thêm mới theo KH đã chọn
    -------------------------------------------*/
    getList_DotTS_ForAdd: function (strKH_Id) {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = {
            'action': 'TS_Core_KeHoach_MH/ETMeFTIeCikeFTIeBS41HgYkNR4FMgPP',
            'func': 'PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTs_KeHoach_TuyenSinh_Id': strKH_Id,
            'strDot_Status_Code': '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XEM'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = edu.util.checkValue(data.Data) ? data.Data : [];
                    // Trong edit mode: dùng Đợt ID từ cache làm default_val
                    var sDot = '';
                    if (me.strKHNH_EditId && me.dtKHNH_EditRecord) {
                        sDot = me.dtKHNH_EditRecord.TS_KEHOACH_TUYENSINH_DOT_ID
                            || me.dtKHNH_EditRecord.TS_KEHOACH_TS_DOT_ID
                            || '';
                    }
                    edu.system.loadToCombo_data({
                        data: dt,
                        renderInfor: { id: "ID", parentId: "", name: "TEN", code: "" },
                        renderPlace: ["dropDotTS_AddKHNH"],
                        title: "Chọn đợt tuyển sinh",
                        default_val: sDot
                    });
                    // Fallback: force set value sau khi loadToCombo_data đã build combo
                    // (Select2 đôi khi không apply default_val do race condition)
                    if (sDot) {
                        setTimeout(function () {
                            var $drop = $("#dropDotTS_AddKHNH");
                            if ($drop.find('option[value="' + sDot + '"]').length && $drop.val() !== sDot) {
                                $drop.val(sDot).trigger('change.select2');
                            }
                        }, 150);
                    }
                }
            },
            error: function () {},
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Load "Loại kế hoạch nhập học" từ danh mục
    -- TODO: xác nhận mã bảng danh mục chính xác
    -------------------------------------------*/
    getList_LoaiKHNH: function () {
        var obj = {
            strMaBangDanhMuc: "NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.getList_DanhMucDulieu(obj, "", "", function (data) {
            var dt = data || [];
            if (!dt.length) {
                console.warn('[KHTSN] DM "NH_KEHOACH_NHAPHOC.NHAPHOC_TYPE_CODE" chưa có dữ liệu. Vui lòng khai vào bảng Danh mục.');
            }
            edu.system.loadToCombo_data({
                data: dt,
                renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                renderPlace: ["dropLoaiKHNH_AddKHNH"],
                title: "Chọn loại kế hoạch nhập học",
                default_val: ''
            });
            me._reapplyEditKHNH();
        });
    },

    /*------------------------------------------
    -- Load "Trạng thái kế hoạch nhập học" từ danh mục
    -- TODO: xác nhận mã bảng danh mục
    -------------------------------------------*/
    getList_TrangThaiKHNH: function () {
        var obj = {
            strMaBangDanhMuc: "NH_KEHOACH_NHAPHOC.STA",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.getList_DanhMucDulieu(obj, "", "", function (data) {
            var dt = data || [];
            if (!dt.length) {
                // Fallback: hardcode danh sách trạng thái theo spec khi DM rỗng
                // DRAFT/CHO_DUYET/DA_DUYET/DANG_MO/TAM_DUNG/DA_DONG/HUY
                dt = [
                    { MA: 'DRAFT', TEN: 'Bản nháp' },
                    { MA: 'CHO_DUYET', TEN: 'Chờ duyệt' },
                    { MA: 'DA_DUYET', TEN: 'Đã duyệt' },
                    { MA: 'DANG_MO', TEN: 'Đang mở' },
                    { MA: 'TAM_DUNG', TEN: 'Tạm dừng' },
                    { MA: 'DA_DONG', TEN: 'Đã đóng' },
                    { MA: 'HUY', TEN: 'Hủy' }
                ];
            }
            edu.system.loadToCombo_data({
                data: dt,
                renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                renderPlace: ["dropTrangThai_AddKHNH"],
                title: "Trạng thái KH nhập học",
                default_val: 'DRAFT'
            });
            me._reapplyEditKHNH();
        });
    },

    /*------------------------------------------
    -- Origin: NS_CoCauToChuc/LayDanhSach
    -- Load danh sách đơn vị (Cơ cấu tổ chức) rồi đổ vào 3 combo đơn vị
    -------------------------------------------*/
    dtCoCauToChuc: [],
    getList_DonVi_ForAdd: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCoCauToChuc = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genCombo_DonVi('dropOwnerOrg_AddKHNH', '');
                    me.genCombo_DonVi('dropManageOrg_AddKHNH', '');
                    me.genCombo_DonVi('dropReceiveOrg_AddKHNH', '');
                    me._reapplyEditKHNH();
                }
            },
            error: function () {},
            type: 'GET',
            action: 'NS_CoCauToChuc/LayDanhSach',
            contentType: true,
            data: {
                'dTrangThai': 1,
                'strLoaiCoCauToChuc_Id': '',
                'strCoCauToChucCha_Id': ''
            },
            fakedb: []
        }, false, false, false, null);
    },

    genCombo_DonVi: function (strDrop_Id, default_val) {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.loadToCombo_data({
            data: me.dtCoCauToChuc,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "MA" },
            renderPlace: [strDrop_Id],
            title: "Chọn đơn vị",
            default_val: default_val
        });
    },

    /*------------------------------------------
    -- Validate form
    -------------------------------------------*/
    validate_AddKHNH: function () {
        var sMa = edu.system.getValById('txtMa_AddKHNH');
        var sTen = edu.system.getValById('txtTen_AddKHNH');
        var sKH_TS = edu.system.getValById('dropKeHoachTS_AddKHNH');
        var sDot = edu.system.getValById('dropDotTS_AddKHNH');
        if (!edu.util.checkValue(sMa)) { edu.system.alert("Vui lòng nhập Mã", "w"); return false; }
        if (!edu.util.checkValue(sTen)) { edu.system.alert("Vui lòng nhập Tên", "w"); return false; }
        if (!edu.util.checkValue(sKH_TS)) { edu.system.alert("Vui lòng chọn Kế hoạch tuyển sinh", "w"); return false; }
        if (!edu.util.checkValue(sDot)) { edu.system.alert("Vui lòng chọn Đợt tuyển sinh", "w"); return false; }
        return true;
    },

    /*------------------------------------------
    -- Build payload chung cho Them / Sua
    -------------------------------------------*/
    _buildFormPayload: function (action, func, hanhDong) {
        var boolTo01 = function (id) { return $("#" + id).is(":checked") ? 1 : 0; };
        return {
            'action': action,
            'func': func,
            'iM': edu.system.iM,
            'strMa_KeHoach': edu.system.getValById('txtMa_AddKHNH'),
            'strTen_KeHoach': edu.system.getValById('txtTen_AddKHNH'),
            'strTS_KeHoach_TuyenSinh_Id': edu.system.getValById('dropKeHoachTS_AddKHNH'),
            'strTS_KeHoach_TS_Dot_Id': edu.system.getValById('dropDotTS_AddKHNH'),
            'strNgay_BatDau': edu.system.getValById('txtNgayBD_AddKHNH'),
            'strNgay_KetThuc': edu.system.getValById('txtNgayKT_AddKHNH'),
            'strNhapHoc_Type_Code': edu.system.getValById('dropLoaiKHNH_AddKHNH'),
            'dRequire_XacNhan': boolTo01('chkReqXacNhan_AddKHNH'),
            'dRequire_HoSo': boolTo01('chkReqHoSo_AddKHNH'),
            'dRequire_TaiChinh': boolTo01('chkReqTaiChinh_AddKHNH'),
            'dRequire_PhanLop': boolTo01('chkReqPhanLop_AddKHNH'),
            'dRequire_TaiKhoan': boolTo01('chkReqTaiKhoan_AddKHNH'),
            'dIs_Auto_Study': boolTo01('chkAutoStudy_AddKHNH'),
            'dIs_Auto_Class_Assign': boolTo01('chkAutoClass_AddKHNH'),
            'dIs_Auto_Account_Create': boolTo01('chkAutoAccount_AddKHNH'),
            'dIs_Auto_Complete': boolTo01('chkAutoComplete_AddKHNH'),
            'strStatus_Code': edu.system.getValById('dropTrangThai_AddKHNH'),
            'strOwner_Org_Id': edu.system.getValById('dropOwnerOrg_AddKHNH'),
            'strManage_Org_Id': edu.system.getValById('dropManageOrg_AddKHNH'),
            'strReceive_Org_Id': edu.system.getValById('dropReceiveOrg_AddKHNH'),
            'dIs_Active': edu.system.getValById('dropIsActive_AddKHNH') || 1,
            'strGhiChu': edu.system.getValById('txtGhiChu_AddKHNH'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': hanhDong
        };
    },

    _closeFormModal_ReloadList: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Top-level modal, không có parent để re-show
        $('#modal-Them-KHTSN').modal('hide');
        me.strKHNH_EditId = '';
        me.getList_KeHoachNhapHoc();
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_Them
    -------------------------------------------*/
    save_KHNH: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = me._buildFormPayload(
            'SV_Core_NhapHoc_MH/ETMeDykeCikPKSAxCS4iHhUpJCwP',
            'PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_Them',
            'THEM'
        );
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới kế hoạch nhập học thành công", "s");
                    me._closeFormModal_ReloadList();
                } else {
                    edu.system.alert("Pr_Nh_KhNhapHoc_Them: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Nh_KhNhapHoc_Them (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_Sua
    -------------------------------------------*/
    update_KHNH: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var obj_save = me._buildFormPayload(
            'SV_Core_NhapHoc_MH/ETMeDykeCikPKSAxCS4iHhI0IAPP',
            'PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_Sua',
            'SUA'
        );
        obj_save.strId = me.strKHNH_EditId;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật kế hoạch nhập học thành công", "s");
                    me._closeFormModal_ReloadList();
                } else {
                    edu.system.alert("Pr_Nh_KhNhapHoc_Sua: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Nh_KhNhapHoc_Sua (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*==========================================================
     ===   THÊM MỚI BỐ TRÍ NHÂN SỰ
     ==========================================================*/

    rewrite_ThemNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        me.dtNS_DaChon = [];
        me.dtNS_Picker = [];
        me._nsDaChon_page = 1;
        me._nsDaChon_pageSize = parseInt($("#pgSize_NSDaChon").val(), 10) || 20;
        me.genTable_NSDaChon();
        $("#txtNgayBD_ThemNS, #txtNgayKT_ThemNS, #txtGhiChu_ThemNS").val('');
        me._setSelectVal('dropVaiTro_ThemNS', '');
        me._setSelectVal('dropTrangThai_ThemNS', '');
        me._setSelectVal('dropHieuLuc_ThemNS', '1');
        $("#chkPrimary_ThemNS, #chkManager_ThemNS, #chkApprover_ThemNS").prop('checked', false);
    },

    loadCombos_ThemNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) {
                var dt = data || [];
                if (!dt.length) dt = me._fallback_VaiTroNS();
                edu.system.loadToCombo_data({
                    data: dt,
                    renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                    renderPlace: ["dropVaiTro_ThemNS"],
                    title: "Vai trò tham gia",
                    default_val: ''
                });
            }
        );
        edu.system.getList_DanhMucDulieu(
            { strMaBangDanhMuc: "NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE", strTenCotSapXep: "", iTrangThai: 1 },
            "", "",
            function (data) {
                var dt = data || [];
                if (!dt.length) dt = me._fallback_TrangThaiPhanCong();
                edu.system.loadToCombo_data({
                    data: dt,
                    renderInfor: { id: "MA", parentId: "", name: "TEN", code: "MA" },
                    renderPlace: ["dropTrangThai_ThemNS"],
                    title: "Trạng thái phân công",
                    default_val: ''
                });
            }
        );
    },

    // Fallback khi bảng danh mục NH_KEHOACH_NHANSU.VAITRO_NHAPHOC_CODE chưa được khai
    _fallback_VaiTroNS: function () {
        return [
            { MA: 'CHU_TICH',    TEN: 'Chủ tịch hội đồng' },
            { MA: 'PHO_CHU_TICH',TEN: 'Phó chủ tịch hội đồng' },
            { MA: 'THU_KY',      TEN: 'Thư ký' },
            { MA: 'UY_VIEN',     TEN: 'Ủy viên' },
            { MA: 'CAN_BO_TN',   TEN: 'Cán bộ tiếp nhận' },
            { MA: 'CAN_BO_HT',   TEN: 'Cán bộ hỗ trợ' }
        ];
    },
    // Fallback khi bảng danh mục NH_KEHOACH_NHANSU.PHANCONG_STATUS_CODE chưa được khai
    _fallback_TrangThaiPhanCong: function () {
        return [
            { MA: 'CHUA_BAT_DAU', TEN: 'Chưa bắt đầu' },
            { MA: 'DANG_LAM',     TEN: 'Đang làm' },
            { MA: 'HOAN_THANH',   TEN: 'Hoàn thành' },
            { MA: 'TAM_DUNG',     TEN: 'Tạm dừng' },
            { MA: 'HUY',          TEN: 'Hủy' }
        ];
    },

    /*------------------------------------------
    -- Render bảng "Nhân sự đã chọn" trong form Thêm mới NS (có phân trang client-side)
    -- Nguồn dữ liệu: me.dtNS_DaChon; mỗi item có flag _checked (default true).
    -- Save iterate qua model (không phải DOM) → không mất row ở trang khác.
    -------------------------------------------*/
    genTable_NSDaChon: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var arr = me.dtNS_DaChon || [];
        var $tbody = $("#tblNSDaChon_ThemNS tbody");
        var $paging = $("#paging_NSDaChon_ThemNS");
        $tbody.html("");
        $("#lblCount_NSDaChon").text(arr.length);

        if (arr.length === 0) {
            $tbody.append('<tr><td colspan="5" class="td-center text-muted py-3">Chưa chọn nhân sự — bấm "Chọn nhân sự"</td></tr>');
            $paging.hide();
            me._syncHeaderChk_NSDaChon();
            return;
        }

        var pageSize = me._nsDaChon_pageSize || 20;
        var totalPages = Math.max(1, Math.ceil(arr.length / pageSize));
        if (!me._nsDaChon_page || me._nsDaChon_page > totalPages) me._nsDaChon_page = totalPages;
        if (me._nsDaChon_page < 1) me._nsDaChon_page = 1;
        var page = me._nsDaChon_page;
        var startIdx = (page - 1) * pageSize;
        var endIdx = Math.min(startIdx + pageSize, arr.length);

        var rows = '';
        for (var i = startIdx; i < endIdx; i++) {
            var ns = arr[i];
            var sTen = ns.HOTEN || ns.PERSON_TEN || '';
            var sMa = ns.MASO || ns.PERSON_MA || '';
            var sDonVi = ns.DONVI_TEN || ns.DAOTAO_COCAUTOCHUC_TEN || '';
            var checked = ns._checked !== false;
            rows += '<tr data-person-id="' + ns.ID + '">'
                + '<td class="td-center">' + (i + 1) + '</td>'
                + '<td class="td-left">' + sTen + (sMa ? ' <span class="text-muted">(' + sMa + ')</span>' : '') + '</td>'
                + '<td class="td-left">' + sDonVi + '</td>'
                + '<td class="td-center"><input type="checkbox" class="chk-ns-row" data-id="' + ns.ID + '"' + (checked ? ' checked' : '') + ' /></td>'
                + '<td class="td-center"><a class="btn btn-sm btn-danger btn-remove-ns" data-id="' + ns.ID + '"><i class="fa fa-trash"></i></a></td>'
                + '</tr>';
        }
        $tbody.append(rows);

        $("#pgCur_NSDaChon").text(page);
        $("#pgTotal_NSDaChon").text(totalPages);
        $("#pgSum_NSDaChon").text(arr.length);
        $("#pgChecked_NSDaChon").text(arr.filter(function (x) { return x._checked !== false; }).length);
        $paging.css('display', 'flex');
        me._renderPagingBtns_NSDaChon(page, totalPages);
        me._syncHeaderChk_NSDaChon();
    },

    // Render các nút phân trang « ‹ 1 2 3 ... N › »
    _renderPagingBtns_NSDaChon: function (page, totalPages) {
        var $ul = $("#pgList_NSDaChon");
        $ul.html('');
        var add = function (label, target, disabled, active) {
            var cls = 'page-item';
            if (disabled) cls += ' disabled';
            if (active) cls += ' active';
            $ul.append('<li class="' + cls + '"><a class="page-link" href="javascript:;" data-page="' + target + '">' + label + '</a></li>');
        };
        add('«', 1, page === 1, false);
        add('‹', Math.max(1, page - 1), page === 1, false);
        var winSize = 5;
        var startP = Math.max(1, page - Math.floor(winSize / 2));
        var endP = Math.min(totalPages, startP + winSize - 1);
        startP = Math.max(1, endP - winSize + 1);
        for (var p = startP; p <= endP; p++) {
            add(String(p), p, false, p === page);
        }
        add('›', Math.min(totalPages, page + 1), page === totalPages, false);
        add('»', totalPages, page === totalPages, false);
    },

    // Đồng bộ header checkbox (all / none / indeterminate) theo state model
    _syncHeaderChk_NSDaChon: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var arr = me.dtNS_DaChon || [];
        var $chk = $("#chkAll_NSDaChon");
        if (arr.length === 0) {
            $chk.prop('checked', true).prop('indeterminate', false);
            return;
        }
        var checkedCount = arr.filter(function (x) { return x._checked !== false; }).length;
        $chk.prop('checked', checkedCount === arr.length);
        $chk.prop('indeterminate', checkedCount > 0 && checkedCount < arr.length);
    },

    /*==========================================================
     ===   PICKER CHỌN NHÂN SỰ
     ==========================================================*/

    loadCombo_CCTC_PickNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        // Nếu đã có sẵn CCTC từ form KH nhập học, reuse; nếu không → gọi lại
        if (me.dtCoCauToChuc && me.dtCoCauToChuc.length) {
            me._renderCCTC_PickNS();
            return;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCoCauToChuc = edu.util.checkValue(data.Data) ? data.Data : [];
                    me._renderCCTC_PickNS();
                }
            },
            error: function () {},
            type: 'GET', action: 'NS_CoCauToChuc/LayDanhSach', contentType: true,
            data: { 'dTrangThai': 1, 'strLoaiCoCauToChuc_Id': '', 'strCoCauToChucCha_Id': '' },
            fakedb: []
        }, false, false, false, null);
    },

    _renderCCTC_PickNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        edu.system.loadToCombo_data({
            data: me.dtCoCauToChuc,
            renderInfor: { id: "ID", parentId: "", name: "TEN", code: "MA" },
            renderPlace: ["dropCCTC_PickNS"],
            title: "Đơn vị",
            default_val: ''
        });
    },

    /*------------------------------------------
    -- Load DS nhân sự theo CCTC + từ khóa
    -------------------------------------------*/
    getList_NhanSu_PickNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var arrCCTC = $("#dropCCTC_PickNS").val() || [];
        var sTuKhoa = edu.system.getValById('txtSearchNS_PickNS');
        if ((!arrCCTC || !arrCCTC.length) && !sTuKhoa) {
            edu.system.alert("Vui lòng chọn đơn vị hoặc nhập từ khóa", "w");
            return;
        }
        var obj_req = {
            action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP',
            func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
            iM: edu.system.iM,
            strTuKhoa: sTuKhoa || '',
            strDaoTao_CoCauToChuc_Id: (arrCCTC && arrCCTC.length) ? arrCCTC.join(',') : '',
            strChucVu_Id: '',
            strTinhTrangNhanSu_Id: '',
            dLaCanBoNgoaiTruong: 0,
            pageIndex: 1,
            pageSize: 5000,
            strNguoiThucHien_Id: edu.system.userId,
            strVaiTroDangNhap_Id: edu.system.strVaiTro_Id || '',
            strChucNangHeThong_Id: edu.system.strChucNang_Id || ''
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(data.Message || "Lỗi khi lấy DS nhân sự", "w");
                    return;
                }
                me.dtNS_Picker = edu.util.checkValue(data.Data) ? data.Data : [];
                var map = me._mapNS_Cache || {};
                for (var i = 0; i < me.dtNS_Picker.length; i++) {
                    if (me.dtNS_Picker[i] && me.dtNS_Picker[i].ID) map[me.dtNS_Picker[i].ID] = me.dtNS_Picker[i];
                }
                me._mapNS_Cache = map;
                me.genTable_NS_PickNS();
            },
            error: function (er) {
                edu.system.alert("LayDSNhanSu_HoSo_v2 (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_req.action, data: obj_req, fakedb: []
        }, false, false, false, null);
    },

    genTable_NS_PickNS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var arr = me.dtNS_Picker || [];
        var $tbody = $("#tblNS_PickNS tbody");
        $tbody.html("");
        if (arr.length === 0) {
            $tbody.append('<tr><td colspan="5" class="td-center text-muted py-3">Không có nhân sự phù hợp</td></tr>');
            return;
        }
        // Loại nhân sự đã có trong danh sách đã chọn (parent)
        var pickedIds = {};
        (me.dtNS_DaChon || []).forEach(function (x) { pickedIds[x.ID] = true; });
        var rows = '';
        for (var i = 0; i < arr.length; i++) {
            var ns = arr[i];
            if (!ns || !ns.ID) continue;
            var already = pickedIds[ns.ID];
            var sTen = ns.HOTEN || '';
            var sMa = ns.MASO || '';
            var sDonVi = ns.DAOTAO_COCAUTOCHUC_TEN || ns.DONVI_TEN || '';
            rows += '<tr' + (already ? ' class="table-secondary"' : '') + '>'
                + '<td class="td-center">' + (i + 1) + '</td>'
                + '<td class="td-left">' + sTen + '</td>'
                + '<td class="td-left">' + sMa + '</td>'
                + '<td class="td-left">' + sDonVi + '</td>'
                + '<td class="td-center">'
                +   (already
                        ? '<span class="badge bg-secondary">Đã chọn</span>'
                        : '<input type="checkbox" class="chk-ns-pick" data-idx="' + i + '" />')
                + '</td>'
                + '</tr>';
        }
        $tbody.append(rows);
    },

    /*------------------------------------------
    -- Xác nhận nhân sự đã chọn ở picker → thêm vào bảng parent
    -------------------------------------------*/
    confirmPick_NS: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        var pickedIds = {};
        (me.dtNS_DaChon || []).forEach(function (x) { pickedIds[x.ID] = true; });
        var $chks = $("#tblNS_PickNS tbody .chk-ns-pick:checked");
        if ($chks.length === 0) {
            edu.system.alert("Vui lòng tích chọn ít nhất một nhân sự", "w");
            return;
        }
        var added = 0;
        $chks.each(function () {
            var idx = parseInt($(this).attr('data-idx'), 10);
            var ns = me.dtNS_Picker[idx];
            if (!ns || !ns.ID || pickedIds[ns.ID]) return;
            pickedIds[ns.ID] = true;
            me.dtNS_DaChon.push({
                ID: ns.ID,
                HOTEN: ns.HOTEN || '',
                MASO: ns.MASO || '',
                DONVI_ID: ns.DAOTAO_COCAUTOCHUC_ID || ns.DONVI_ID || '',
                DONVI_TEN: ns.DAOTAO_COCAUTOCHUC_TEN || ns.DONVI_TEN || '',
                _checked: true
            });
            added++;
        });
        me.genTable_NSDaChon();
        // BS5 5.3.2 quirk: mở picker qua data-bs-toggle từ ThemNS → BS5 auto-hide ThemNS.
        // Khi đóng picker, BS5 không tự re-show ThemNS → cần chủ động show lại.
        // KHÔNG dùng edu.system.alert ở đây: alert là BS3 modal, khi close sẽ gỡ
        // body.modal-open → modal ThemNS còn show nhưng bị kẹt backdrop/click.
        // Thay bằng badge count + flash tạm ở section title.
        var $picker = $('#modal-PickNS-KHTSN');
        $picker.one('hidden.bs.modal', function () {
            var $them = $('#modal-ThemNS-KHTSN');
            if (!$them.hasClass('show')) {
                $them.modal('show');
            }
            $('body').addClass('modal-open');
            if (added > 0) {
                var $badge = $('#lblCount_NSDaChon');
                $badge.removeClass('bg-primary').addClass('bg-success')
                    .text(me.dtNS_DaChon.length + ' (+' + added + ')');
                setTimeout(function () {
                    $badge.removeClass('bg-success').addClass('bg-primary')
                        .text(me.dtNS_DaChon.length);
                }, 2000);
            }
        });
        $picker.modal('hide');
    },

    /*------------------------------------------
    -- Save: lặp qua từng nhân sự đã tick → gọi Them_NH_KeHoach_NhanSu
    -- Origin: PKG_CORE_NHAPHOC.Them_NH_KeHoach_NhanSu
    -------------------------------------------*/
    save_ThemNhanSu: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKHNH_Id_ForView)) {
            edu.system.alert("Chưa xác định Kế hoạch nhập học", "w");
            return;
        }
        // Lưu tất cả nhân sự có _checked !== false (đọc từ MODEL, không DOM
        // → không mất row ở trang khác khi có phân trang)
        var arr = (me.dtNS_DaChon || []).filter(function (x) { return x._checked !== false; });
        if (arr.length === 0) {
            edu.system.alert("Vui lòng tích chọn ít nhất một nhân sự để lưu", "w");
            return;
        }
        // Section "Thông tin gán chung" tất cả optional — không validate.
        // Vai trò rỗng → gửi '' để backend tự xử lý (nếu có default).
        var sVaiTro = edu.system.getValById('dropVaiTro_ThemNS');
        var commonData = {
            'strVaiTro_NhapHoc_Code': sVaiTro,
            'strNgay_BatDau': edu.system.getValById('txtNgayBD_ThemNS'),
            'strNgay_KetThuc': edu.system.getValById('txtNgayKT_ThemNS'),
            'dIs_Primary': $("#chkPrimary_ThemNS").is(":checked") ? 1 : 0,
            'dIs_Manager': $("#chkManager_ThemNS").is(":checked") ? 1 : 0,
            'dIs_Approver': $("#chkApprover_ThemNS").is(":checked") ? 1 : 0,
            'strSource_Type_Code': 'MANUAL',
            'strSource_Ref_Id': '',
            'strDecision_Id': '',
            'strGhiChu': edu.system.getValById('txtGhiChu_ThemNS')
        };
        // Serialize lần lượt để dễ báo lỗi từng người
        var idx = 0;
        var success = 0;
        var failed = [];
        var doNext = function () {
            if (idx >= arr.length) {
                var msg = "Đã lưu " + success + "/" + arr.length + " nhân sự";
                if (failed.length) msg += ". Lỗi: " + failed.join('; ');
                edu.system.alert(msg, failed.length ? "w" : "s");
                if (success > 0) {
                    // Đóng ThemNS + re-show NhanSu (parent) do BS5 5.3.2 quirk
                    var $them = $('#modal-ThemNS-KHTSN');
                    $them.one('hidden.bs.modal', function () {
                        var $nhansu = $('#modal-NhanSu-KHTSN');
                        if (!$nhansu.hasClass('show')) $nhansu.modal('show');
                        $('body').addClass('modal-open');
                    });
                    $them.modal('hide');
                    me.getList_NhanSu(me.strKHNH_Id_ForView);
                }
                return;
            }
            var ns = arr[idx++];
            var obj_save = {
                'action': 'SV_Core_NhapHoc_MH/FSkkLB4PCR4KJAkuICIpHg8pIC8SNAPP',
                'func': 'PKG_CORE_NHAPHOC.Them_NH_KeHoach_NhanSu',
                'iM': edu.system.iM,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
                'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
                'strHanhDong_Code': 'THEM',
                'strNH_KeHoach_NhapHoc_Id': me.strKHNH_Id_ForView,
                'strPerson_Id': ns.ID,
                'strDonVi_Id': ns.DONVI_ID || ''
            };
            for (var k in commonData) obj_save[k] = commonData[k];
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) success++;
                    else failed.push((ns.HOTEN || ns.ID) + ': ' + (data.Message || 'lỗi'));
                    doNext();
                },
                error: function (er) {
                    failed.push((ns.HOTEN || ns.ID) + ': ex ' + JSON.stringify(er));
                    doNext();
                },
                type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
            }, false, false, false, null);
        };
        doNext();
    },

    /*------------------------------------------
    -- Origin: PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_Xoa
    -------------------------------------------*/
    delete_KHNH: function () {
        var me = main_doc.KeHoachTuyenSinhNew;
        if (!edu.util.checkValue(me.strKHNH_EditId)) return;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_MH/ETMeDykeCikPKSAxCS4iHhkuIAPP',
            'func': 'PKG_CORE_NHAPHOC.Pr_Nh_KhNhapHoc_Xoa',
            'iM': edu.system.iM,
            'strId': me.strKHNH_EditId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.strVaiTro_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id || '',
            'strHanhDong_Code': 'XOA'
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đã xóa kế hoạch nhập học", "s");
                    me._closeFormModal_ReloadList();
                } else {
                    edu.system.alert("Pr_Nh_KhNhapHoc_Xoa: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Pr_Nh_KhNhapHoc_Xoa (ex): " + JSON.stringify(er), "w");
            },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    }
};
