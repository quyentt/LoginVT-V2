/*----------------------------------------------
--Author: TLinh
--Phone:
--Date of created: 10/06/2026
--Input:
--Output:
--Note: Danh sách quan hệ học tập (DAQHHT) - Quản lý sinh viên tổng quát
----------------------------------------------*/
function DaQHHT() { };
DaQHHT.prototype = {
    strSinhVien_Id: '',
    strQHHT_Id: '',
    strTrangThai: '',
    dtSinhVien: [],
    dtQHHT: [],
    aSinhVien: null,
    aQHHT: null,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "dropSearch_TrangThai", "", data => me["dtTrangThai"] = data);
        // Danh mục cho form khởi tạo định danh + tab "Hồ sơ - chính sách"
        edu.system.loadToCombo_DanhMucDuLieu("NS.GITI", "", "", function (data) { me.dtGioiTinh = data; });
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "", "", function (data) { me.dtTonGiao = data; });
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "", "", function (data) { me.dtDanToc = data; });
        edu.system.loadToCombo_DanhMucDuLieu("NS.THANHPHANGIADINH", "", "", function (data) { me.dtHoanCanh = data; });
        edu.system.loadToCombo_DanhMucDuLieu("NS.TINHTRANGHONNHAN", "", "", function (data) { me.dtHonNhan = data; });
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.DOITUONG", "", "", function (data) { me.dtDoiTuongCS = data; });
        // Danh mục cho form "Phân ngành lớp chính"
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.HTDT", "", "", function (data) { me.dtHinhThucHoc = data; });
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON_STUDY_TRACK.STUDY_RELATION_TYPE", "", "", function (data) { me.dtDienHoc = data; });
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON_STUDY_TRACK.SOURCE_TYPE", "", "", function (data) { me.dtLoaiNguon = data; });
        edu.system.loadToCombo_DanhMucDuLieu("CORE_PERSON_STUDY.CHANGE_TYPE", "", "", function (data) { me.dtLoaiTiepNhan = data; });

        // Load 5 bộ lọc theo API KHCT_BIND_DIMENSION_MH
        me.getList_HeDaoTao();
        me.getList_KhoaQuanLy();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinh();
        me.getList_LopQuanLy();

        // Dọn placeholder "" của combo Trạng thái (do loadToCombo_DanhMucDuLieu nạp)
        me.cleanupPlaceholderMulti();

        // Cascade dùng delegated event để sống sót khi select2 destroy/reinit
        // Hệ -> Khóa, CT, Lớp (KhoaQuanLy độc lập, không phụ thuộc Hệ)
        $(document).on("select2:select select2:unselect", "#dropHeDaoTao_CB", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
            me.getList_LopQuanLy();
            me.getList_SinhVien();
        });
        // Khoa quản lý -> CT, Lớp
        $(document).on("select2:select select2:unselect", "#dropKhoaQuanLy_CB", function () {
            me.getList_ChuongTrinh();
            me.getList_LopQuanLy();
            me.getList_SinhVien();
        });
        // Khóa -> CT, Lớp
        $(document).on("select2:select select2:unselect", "#dropKhoaDaoTao_CB", function () {
            me.getList_ChuongTrinh();
            me.getList_LopQuanLy();
            me.getList_SinhVien();
        });
        // Chương trình -> Lớp
        $(document).on("select2:select select2:unselect", "#dropChuongTrinh_CB", function () {
            me.getList_LopQuanLy();
            me.getList_SinhVien();
        });
        $(document).on("select2:select select2:unselect", "#dropSearch_Lop", function () {
            me.getList_SinhVien();
        });
        $(document).on("select2:select select2:unselect", "#dropSearch_TrangThai", function () {
            me.getList_SinhVien();
        });

        // Filter "Ngành chính/Phụ" cho thống kê (KHÔNG ảnh hưởng danh sách SV)
        $(document).on("change", 'input[name="filterIsPrimary"]', function () {
            me.getList_ThongKe();
        });

        $("#btnSearch").click(function () {
            me.dispatchTab();
        });

        $("#btnRefresh").click(function () {
            me.dispatchTab();
        });

        $("#btnResetFilter").click(function () {
            $("#dropHeDaoTao_CB,#dropKhoaDaoTao_CB,#dropKhoaQuanLy_CB,#dropChuongTrinh_CB,#dropSearch_Lop,#dropSearch_TrangThai").val(null).trigger("change");
            $("#txtSearch_TuKhoa").val("");
            me.strTrangThai = "";
            $(".btnFilterTab").removeClass("active");
            $(".btnFilterTab[data-status='']").addClass("active");
            me.dispatchTab();
        });

        $("#btnXuatExcel_DSSV").click(function () {
            me.exportExcel_DSSinhVien();
        });

        // Ctrl+G shortcut → xuất Excel theo dữ liệu đang hiển thị
        // (User cần chọn "Hiển thị Tất cả" trước để export full dữ liệu match filter)
        $(document).off('keydown.daqhht_export').on('keydown.daqhht_export', function (e) {
            // Chỉ kích hoạt khi modal Hồ sơ KHÔNG mở (tránh xung đột) và đang ở trang DaQHHT
            if ($("#modal_HoSoSinhVien").hasClass('show')) return;
            if (!$("#tblSinhVien").length) return;
            // Ctrl+G (Windows/Linux) hoặc Cmd+G (Mac)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G' || e.which === 71)) {
                e.preventDefault();
                e.stopPropagation();
                me.exportExcel_DSSinhVien();
            }
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.dispatchTab();
            }
        });

        // Tab phân loại sinh viên
        $(".btnFilterTab").click(function (e) {
            e.preventDefault();
            $(".btnFilterTab").removeClass("active");
            $(this).addClass("active");
            me.strTrangThai = $(this).attr("data-status");
            me.dispatchTab();
        });

        // Click "Xem/Sửa" trong bảng Khởi tạo định danh -> đổ thông tin sang form bên phải
        $(document).on("click", "#tblKhoiTaoDinhDanh .btnViewKTDD", function () {
            var strId = $(this).attr("id");
            strId = edu.util.cutPrefixId(/viewKTDD_/g, strId);
            var aData = (me.dtKhoiTaoDinhDanh || []).find(function (e) {
                return (e.CORE_PERSON_ID || e.PERSON_ID || e.ID || e.IDENTIFIER_NO) == strId;
            });
            if (aData) {
                me.aKhoiTaoDinhDanh = aData;
                me.isThemMoi = false;
                me.renderForm_DinhDanh(aData);
            }
        });

        // Click "Thêm mới" -> reset form để khai hồ sơ mới
        $(document).on("click", "#btnKTDD_ThemMoi", function () {
            me.aKhoiTaoDinhDanh = {};
            me.isThemMoi = true;
            me.renderForm_DinhDanh({});
        });

        // ===== Tab Phân ngành lớp chính =====
        // Click "Xem" trong bảng phân ngành -> mở form bên phải
        $(document).on("click", "#tblPhanNganhLopChinh .btnPhanNganh", function () {
            var strId = $(this).attr("id");
            strId = edu.util.cutPrefixId(/phanNganh_/g, strId);
            var aData = (me.dtPhanNganhLopChinh || []).find(function (e) {
                return (e.CORE_PERSON_ID || e.PERSON_ID || e.ID || e.IDENTIFIER_NO) == strId;
            });
            if (aData) {
                me.aPhanNganh = aData;
                me.renderForm_PhanNganh(aData);
            }
        });

        // Cascade Hệ → Khóa (đồng thời reset CT, Lớp)
        $(document).on("change", "#dropPN_HeDaoTao", function () {
            me.loadCombo_PN_KhoaDaoTao();
            $("#dropPN_ChuongTrinh").html('<option value=""></option>');
            $("#dropPN_Lop").html('<option value=""></option>');
            me._initSelect2_PN("#dropPN_ChuongTrinh", "Chọn chương trình");
            me._initSelect2_PN("#dropPN_Lop", "Chọn lớp");
        });
        // Cascade Khóa → Chương trình (đồng thời reset Lớp)
        $(document).on("change", "#dropPN_KhoaDaoTao", function () {
            me.loadCombo_PN_ChuongTrinh();
            $("#dropPN_Lop").html('<option value=""></option>');
            me._initSelect2_PN("#dropPN_Lop", "Chọn lớp");
        });
        // Cascade Chương trình → Lớp
        $(document).on("change", "#dropPN_ChuongTrinh", function () {
            me.loadCombo_PN_LopQuanLy();
        });

        // Nút "Thực hiện" - confirm trước khi gọi API
        $(document).on("click", "#btnPN_ThucHien", function () {
            me.confirm_PhanNganh();
        });

        // Nút Hủy trong form định danh
        $(document).on("click", "#btnKTDD_Cancel", function () {
            me.aKhoiTaoDinhDanh = null;
            me.isThemMoi = false;
            me.resetForm_DinhDanh();
        });

        // Nút Lưu thông tin cơ bản (InsertCorePerson)
        $(document).on("click", "#btnKTDD_SaveBasic", function () {
            me.save_CorePerson();
        });

        // Nút Lưu định danh (PersonIdentifier - chờ wire API)
        $(document).on("click", "#btnKTDD_Save", function () {
            me.save_DinhDanh();
        });

        // Tab "Hồ sơ - chính sách": Lưu (auto Thêm/Sửa) + Xóa
        $(document).on("click", "#btnHSCS_Save", function () {
            me.save_HoSoChinhSach();
        });
        $(document).on("click", "#btnHSCS_Xoa", function () {
            me.delete_HoSoChinhSach();
        });

        // ===== Person Process tabs (7 tabs CRUD + 1 tab Hồ sơ-chính sách) =====
        // Auto-load tab khi user click vào tab
        $(document).on("shown.bs.tab", '#tabMdl_QuaTrinh button[data-bs-toggle="tab"]', function () {
            var targetId = $(this).attr('data-bs-target') || '';  // VD: "#qtm_diachi"

            // Tab "Thông tin hồ sơ - chính sách" → render lại form policy vào zone trong tab
            if (targetId === '#qtm_hosochinhsach') {
                if (me.aModalProfile) {
                    me.renderModal_HoSoChinhSach_ToTab(me.aModalProfile);
                }
                return;
            }

            // 7 tabs còn lại: dùng generic person process CRUD
            var entityKey = null;
            Object.keys(me._processConfig).forEach(function (k) {
                if ('#' + me._processConfig[k].tabZoneId === targetId) entityKey = k;
            });
            if (entityKey && me.strProcessPerson_Id) {
                me.loadPersonProcessTab(entityKey);
            }
        });

        // Click "Thêm mới"
        $(document).on("click", ".btnAddPP", function () {
            var entityKey = $(this).attr('data-entity');
            me.openPersonProcessForm(entityKey, null);
        });
        // Click "Sửa"
        $(document).on("click", ".btnEditPP", function () {
            var entityKey = $(this).attr('data-entity');
            var rowId = $(this).attr('data-id');
            me.openPersonProcessForm(entityKey, rowId);
        });
        // Click "Xóa"
        $(document).on("click", ".btnDelPP", function () {
            var entityKey = $(this).attr('data-entity');
            var rowId = $(this).attr('data-id');
            me.deletePersonProcess(entityKey, rowId);
        });
        // Click "Hủy" (đóng form, quay về table)
        $(document).on("click", ".btnCancelPP", function () {
            var entityKey = $(this).attr('data-entity');
            me.renderPersonProcessTable(entityKey, me['_dt_PP_' + entityKey] || []);
        });
        // Click "Lưu" form
        $(document).on("click", ".btnSavePP", function () {
            var entityKey = $(this).attr('data-entity');
            var rowId = $(this).attr('data-id');
            me.savePersonProcessForm(entityKey, rowId);
        });

        // Xem chi tiết hồ sơ sinh viên (mở modal toàn diện)
        $("#tblSinhVien").delegate(".btnViewSV", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/viewSV_/g, strId);
            me.strSinhVien_Id = strId;
            me.aSinhVien = me.dtSinhVien.find(e => (e.STUDY_ID || e.ID) == strId);
            $("#modal_HoSoSinhVien").modal("show");
            me.loadHoSo_SinhVien();
            // [Bộ hàm 2] Load tổng quan QHHT (mới)
            var strPersonId = (me.aSinhVien || {}).CORE_PERSON_ID || (me.aSinhVien || {}).PERSON_ID;
            if (strPersonId) me.getList_HoSoTongQuan(strPersonId);
            // [Bộ hàm 1] Render thông tin để xem/sửa (đã có)
            me.renderModal_FullProfile(me.aSinhVien);
            // [Bộ hàm 3] Bê block "Bảng điểm" từ cổng SV vào modal
            me.embedDiemHoc(me.aSinhVien);
        });

        // Event handlers cho form chỉnh sửa trong modal (prefix Mdl_)
        $(document).on("click", "#btnMdl_SaveBasic", function () {
            me.save_Modal_CorePerson();
        });
        $(document).on("click", "#btnMdlHSCS_Save", function () {
            me.save_Modal_HoSoChinhSach();
        });
        $(document).on("click", "#btnMdlHSCS_Xoa", function () {
            me.delete_Modal_HoSoChinhSach();
        });

        // Chọn QHHT trong modal -> filter chi tiết theo STUDY_ID
        $("#zoneListQHHT").delegate(".rdQHHT", "change", function () {
            var strStudyId = $(this).val();
            me.strQHHT_Id = strStudyId;
            me.selectQHHT_ShowChiTiet(strStudyId);
        });

        edu.system.getList_MauImport("zonebtnBaoCao_SinhVien", function (addKeyValue) {
            var obj_list = {
                'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_CB'),
                'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropKhoaDaoTao_CB'),
                'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropKhoaQuanLy_CB'),
                'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_CB'),
                'strDaoTao_Lop_Id': edu.system.getValById('dropSearch_Lop'),
                'strTrangThai': me.strTrangThai,
                'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            };
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
        });
    },

    /*------------------------------------------
    --Discription: Helper: lấy giá trị multi-select dạng "id1,id2,..."
    -------------------------------------------*/
    getMultiVal: function (strId) {
        var val = $('#' + strId).val();
        if (Array.isArray(val)) return val.filter(v => v !== "" && v != null).join(',');
        return val || '';
    },

    /*------------------------------------------
    --Discription: Dispatch theo tab đang chọn
    --(Tab Khởi tạo định danh dùng API khác + bảng khác)
    -------------------------------------------*/
    dispatchTab: function () {
        var me = this;
        // 3 mode: bảng SV chính / bảng Khởi tạo định danh / bảng Phân ngành lớp chính
        $("#zoneTblSinhVien").hide();
        $("#zoneTblKhoiTaoDinhDanh").hide();
        $("#zoneTblPhanNganhLopChinh").hide();

        if (me.strTrangThai === "KHOITAODINHDANH") {
            $("#zoneTblKhoiTaoDinhDanh").show();
            me.getList_NguoiHocChuaCoCauTruc();
        } else if (me.strTrangThai === "PHANNGANHLOPCHINH") {
            $("#zoneTblPhanNganhLopChinh").show();
            me.getList_PhanNganhLopChinh();
        } else {
            $("#zoneTblSinhVien").show();
            me.getList_SinhVien();
        }
    },

    /*------------------------------------------
    --Discription: [8] Danh sách học viên chưa có cấu trúc (chưa khởi tạo định danh)
    --Origin: PKG_CORE_NGUOIHOC_01.LayDSNguoiHocChuaCoCauTruc
    -------------------------------------------*/
    getList_NguoiHocChuaCoCauTruc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgIpNCACLgIgNBUzNCIP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHocChuaCoCauTruc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoiTaoDinhDanh = data.Data;
                    me.genTable_NguoiHocChuaCoCauTruc(data.Data);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    genTable_NguoiHocChuaCoCauTruc: function (data) {
        var LEFT = 'style="display:block;text-align:left;width:100%;"';
        var jsonForm = {
            strTable_Id: "tblKhoiTaoDinhDanh",
            aaData: data,
            colPos: {
                left: [1, 2, 3],
                center: [0, 4]
            },
            aoColumns: [
                // [col 1] CCCD
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.IDENTIFIER_NO) || edu.util.returnEmpty(aData.DINHDANH_CHINH_SO);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 2] Họ và tên
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.HO_TEN) || edu.util.returnEmpty(aData.FULL_NAME);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 3] Ghi chú
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.GhiChu) || edu.util.returnEmpty(aData.GHICHU) || edu.util.returnEmpty(aData.NOTE);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 4] Chọn (Xem)
                {
                    "mRender": function (nRow, aData) {
                        var strId = aData.CORE_PERSON_ID || aData.PERSON_ID || aData.ID || aData.IDENTIFIER_NO;
                        return '<a class="btn btn-default btnViewKTDD" id="viewKTDD_' + strId + '">Xem</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [9] Danh sách học viên cần phân ngành lớp chính
    --Origin: PKG_CORE_NGUOIHOC_01.LayDSNguoiHocChuaCoCauTruc
    --(Dùng chung API với tab "Khởi tạo định danh mới" - cùng danh sách
    -- học viên chưa có cấu trúc, khác nhau ở action "Xem" sau đó)
    -------------------------------------------*/
    getList_PhanNganhLopChinh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgIpNCACLgIgNBUzNCIP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHocChuaCoCauTruc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhanNganhLopChinh = data.Data;
                    me.genTable_PhanNganhLopChinh(data.Data);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    genTable_PhanNganhLopChinh: function (data) {
        var LEFT = 'style="display:block;text-align:left;width:100%;"';
        var jsonForm = {
            strTable_Id: "tblPhanNganhLopChinh",
            aaData: data,
            colPos: {
                left: [1, 2, 3],
                center: [0, 4]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.IDENTIFIER_NO) || edu.util.returnEmpty(aData.DINHDANH_CHINH_SO);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.HO_TEN) || edu.util.returnEmpty(aData.FULL_NAME);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.GhiChu) || edu.util.returnEmpty(aData.GHICHU) || edu.util.returnEmpty(aData.NOTE);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var strId = aData.CORE_PERSON_ID || aData.PERSON_ID || aData.ID || aData.IDENTIFIER_NO;
                        return '<a class="btn btn-view btn-sm btnPhanNganh" id="phanNganh_' + strId + '">Xem</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: Render form Phân ngành lớp chính
    -------------------------------------------*/
    renderForm_PhanNganh: function (aData) {
        var me = this;
        function buildOptions(arr, selectedId, placeholder) {
            var html = '<option value="">-- ' + placeholder + ' --</option>';
            (arr || []).forEach(function (item) {
                var selected = (item.ID == selectedId) ? 'selected' : '';
                html += '<option value="' + item.ID + '" ' + selected + '>' + edu.util.returnEmpty(item.TEN) + '</option>';
            });
            return html;
        }

        var html = '';
        // View header (chỉ đọc) - hiện toàn bộ thông tin tổng quan SV
        html += me._buildViewHeader(aData);

        // ===== Section 1: Khai tuyến học chính =====
        html += '<div class="aps-form mb-15">';
        html += '  <p class="group-group-title-name mb-10"><span class="badge bg-blue fz14">Khai tuyến học chính</span></p>';
        html += '  <div class="row">';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Hình thức học</label>';
        html += '      <select class="form-select select-opt" id="dropPN_HinhThucHoc">' + buildOptions(me.dtHinhThucHoc, '', 'Chọn hình thức học') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Diện học</label>';
        html += '      <select class="form-select select-opt" id="dropPN_DienHoc">' + buildOptions(me.dtDienHoc, '', 'Chọn diện học') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Loại nguồn</label>';
        html += '      <select class="form-select select-opt" id="dropPN_LoaiNguon">' + buildOptions(me.dtLoaiNguon, '', 'Chọn loại nguồn') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10 d-flex align-items-end">';
        html += '      <div class="form-check">';
        html += '        <input type="checkbox" class="form-check-input" id="chkPN_TuyenChinh" checked>';
        html += '        <label class="form-check-label fz14" for="chkPN_TuyenChinh">Tuyến học chính</label>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày bắt đầu</label>';
        html += '      <input type="text" class="form-control" id="txtPN_NgayBatDau" placeholder="dd/mm/yyyy">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày kết thúc</label>';
        html += '      <input type="text" class="form-control" id="txtPN_NgayKetThuc" placeholder="dd/mm/yyyy">';
        html += '    </div>';
        html += '    <div class="col-12 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ghi chú</label>';
        html += '      <textarea class="form-control" id="txtPN_GhiChu" rows="2"></textarea>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ===== Section 2: Xếp vào chương trình học =====
        html += '<div class="aps-form mb-15" style="border-top:1px dashed #ccc;padding-top:15px;">';
        html += '  <p class="group-group-title-name mb-10"><span class="badge bg-green fz14">Xếp vào chương trình học</span></p>';
        html += '  <div class="row">';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Hệ đào tạo</label>';
        html += '      <select class="form-select select-opt" id="dropPN_HeDaoTao"><option value="">-- Chọn hệ --</option></select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Khóa đào tạo</label>';
        html += '      <select class="form-select select-opt" id="dropPN_KhoaDaoTao"><option value="">-- Chọn khóa --</option></select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Chương trình</label>';
        html += '      <select class="form-select select-opt" id="dropPN_ChuongTrinh"><option value="">-- Chọn chương trình --</option></select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Trạng thái học</label>';
        html += '      <select class="form-select select-opt" id="dropPN_TrangThaiHoc">' + buildOptions(me.dtTrangThai, '', 'Chọn trạng thái') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Loại tiếp nhận</label>';
        html += '      <select class="form-select select-opt" id="dropPN_LoaiTiepNhan">' + buildOptions(me.dtLoaiTiepNhan, '', 'Chọn loại tiếp nhận') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Mã số</label>';
        html += '      <input type="text" class="form-control" id="txtPN_MaSo">';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ===== Section 3: Xếp vào lớp =====
        html += '<div class="aps-form mb-15" style="border-top:1px dashed #ccc;padding-top:15px;">';
        html += '  <p class="group-group-title-name mb-10"><span class="badge bg-orange fz14">Xếp vào lớp</span></p>';
        html += '  <div class="row">';
        html += '    <div class="col-12 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Lớp học</label>';
        html += '      <select class="form-select select-opt" id="dropPN_Lop"><option value="">-- Chọn lớp --</option></select>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // Nút Thực hiện
        html += '<div class="d-flex justify-content-end gap-2 mt-15">';
        html += '  <button class="btn btn-view" id="btnPN_ThucHien"><i class="fal fa-check-circle me-1"></i> Thực hiện</button>';
        html += '</div>';

        $("#zoneFormPhanNganh").html(html);
        var hoTenTitle = edu.util.returnEmpty(aData.HO_TEN) || edu.util.returnEmpty(aData.FULL_NAME);
        $("#lblPN_FormTitle").html("Phân ngành lớp chính - " + hoTenTitle);

        // Bật select2 (có tìm kiếm) cho tất cả dropdown trong form
        me._initSelect2_PN("#dropPN_HinhThucHoc", "Chọn hình thức học");
        me._initSelect2_PN("#dropPN_DienHoc", "Chọn diện học");
        me._initSelect2_PN("#dropPN_LoaiNguon", "Chọn loại nguồn");
        me._initSelect2_PN("#dropPN_TrangThaiHoc", "Chọn trạng thái");
        me._initSelect2_PN("#dropPN_LoaiTiepNhan", "Chọn loại tiếp nhận");
        me._initSelect2_PN("#dropPN_HeDaoTao", "Chọn hệ");
        me._initSelect2_PN("#dropPN_KhoaDaoTao", "Chọn khóa");
        me._initSelect2_PN("#dropPN_ChuongTrinh", "Chọn chương trình");
        me._initSelect2_PN("#dropPN_Lop", "Chọn lớp");

        // Load cascade dropdown đầu tiên (Hệ đào tạo)
        me.loadCombo_PN_HeDaoTao();
    },

    /*------------------------------------------
    --Discription: Helper init/reinit select2 cho dropdown trong form Phân ngành
    -------------------------------------------*/
    _initSelect2_PN: function (selector, placeholder) {
        var $sel = $(selector);
        if ($sel.length === 0) return;
        if ($sel.hasClass('select2-hidden-accessible')) {
            try { $sel.select2('destroy'); } catch (e) { }
        }
        $sel.select2({
            placeholder: placeholder || '',
            width: '100%',
            // Ép hiện ô search luôn (mặc định select2 ẩn khi ít option, hoặc theo global config)
            minimumResultsForSearch: 0
        });
    },

    /*------------------------------------------
    --Discription: Cascade dropdowns dùng KHCT_BIND_DIMENSION_MH
    --(load vào dropdown của form phân ngành, dropPN_*)
    -------------------------------------------*/
    loadCombo_PN_HeDaoTao: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRIJJAUgLhUgLgPP',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSHeDaoTao',
        });
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._renderComboPN("dropPN_HeDaoTao", data.Data, "Chọn hệ", "TENHEDAOTAO");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    loadCombo_PN_KhoaDaoTao: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRIKKS4gBSAuFSAu',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSKhoaDaoTao',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropPN_HeDaoTao'),
        });
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._renderComboPN("dropPN_KhoaDaoTao", data.Data, "Chọn khóa", "TENKHOA");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    loadCombo_PN_ChuongTrinh: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSChuongTrinh',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropPN_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropPN_KhoaDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': '',
        });
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._renderComboPN("dropPN_ChuongTrinh", data.Data, "Chọn chương trình", "TENCHUONGTRINH");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    loadCombo_PN_LopQuanLy: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRINLjEQNCAvDTgP',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSLopQuanLy',
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropPN_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropPN_KhoaDaoTao'),
            'strDaoTao_KhoaQuanLy_Id': '',
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropPN_ChuongTrinh'),
        });
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._renderComboPN("dropPN_Lop", data.Data, "Chọn lớp", "TENLOP");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    _renderComboPN: function (targetId, data, placeholder, primaryNameField) {
        var html = '<option value=""></option>';
        (data || []).forEach(function (item) {
            var ten = item[primaryNameField] || item.TEN || item.NAME || item.TENKHOA || '';
            var ma = item.MAKHOA || item.MACHUONGTRINH || item.MALOP || item.MA || item.CODE || '';
            var display = ma ? (ten + ' (' + ma + ')') : ten;
            html += '<option value="' + item.ID + '">' + display + '</option>';
        });
        $('#' + targetId).html(html);
        // Re-init select2 để options mới có ô tìm kiếm
        this._initSelect2_PN('#' + targetId, placeholder);
    },

    /*------------------------------------------
    --Discription: TEMPLATE: Confirm Modal hoành tráng - DÙNG CHUNG
    --
    --options = {
    --   title: string,            // Tiêu đề chính trên header
    --   subTitle: string,          // Phụ đề dưới header (optional)
    --   icon: string,              // FA icon class (default: fa-shield-check)
    --   warningText: string,       // Text cảnh báo (optional)
    --   subject: {                 // Đối tượng tác động (hiển thị nổi bật ở box xanh)
    --       name: string,            // VD: tên người, mã đối tượng
    --       extra: [{label, value}]  // Mảng các field bổ sung
    --   },
    --   sections: [                // Mảng nhóm thông tin
    --       {
    --           title: string,       // Tiêu đề nhóm
    --           color: 'blue'|'green'|'orange'|'red',
    --           items: [{label, value}] // Các cặp key-value
    --       }
    --   ],
    --   actionLabel: string,       // Text nút xác nhận
    --   requireCheckbox: boolean,  // true = bắt buộc tick checkbox mới enable nút (default: true)
    --   onConfirm: function        // Callback khi user xác nhận
    --}
    -------------------------------------------*/
    showFancyConfirm: function (options) {
        options = options || {};
        var requireChk = options.requireCheckbox !== false; // mặc định true

        // Header
        $("#lblConfirm_Title").text(options.title || 'Xác nhận thực hiện');
        $("#lblConfirm_SubTitle").text(options.subTitle || 'Vui lòng xem kỹ thông tin trước khi xác nhận');
        $("#iconConfirm_Header").attr('class', 'fa-light ' + (options.icon || 'fa-shield-check'));
        if (options.warningText) $("#lblConfirm_WarningText").html(options.warningText);

        // Subject - đối tượng tác động
        var subjectHtml = '';
        if (options.subject) {
            subjectHtml += '<div class="d-flex align-items-center">';
            subjectHtml += '  <i class="fa-light fa-user-tag me-2" style="color:#3380db;font-size:18px;"></i>';
            subjectHtml += '  <div>';
            if (options.subject.name) {
                subjectHtml += '<div class="fw-bold fz15" style="color:#1d3a8a;">' + options.subject.name + '</div>';
            }
            if (options.subject.extra && options.subject.extra.length) {
                subjectHtml += '<div class="fz13 mt-1" style="color:#555;">';
                options.subject.extra.forEach(function (e, idx) {
                    if (idx > 0) subjectHtml += ' <span style="color:#bbb;">•</span> ';
                    subjectHtml += '<span class="color-888">' + e.label + ':</span> <b>' + (e.value || '<i class="color-888">trống</i>') + '</b>';
                });
                subjectHtml += '</div>';
            }
            subjectHtml += '  </div>';
            subjectHtml += '</div>';
        }
        $("#zoneConfirm_Subject").html(subjectHtml);

        // Sections - các nhóm thông tin
        var colorMap = {
            'blue':   { border: '#3380db', bg: '#e8f0fe', badge: 'bg-blue' },
            'green':  { border: '#22b06a', bg: '#e6f7ee', badge: 'bg-green' },
            'orange': { border: '#ff8c00', bg: '#fff5e6', badge: 'bg-orange' },
            'red':    { border: '#dc3545', bg: '#fbe9eb', badge: 'bg-danger' }
        };
        var sectionsHtml = '';
        (options.sections || []).forEach(function (section) {
            var c = colorMap[section.color] || colorMap.blue;
            sectionsHtml += '<div class="mb-15" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">';
            sectionsHtml += '  <div class="pd10 fw-bold" style="background:' + c.bg + ';color:' + c.border + ';border-bottom:1px solid #e5e5e5;">';
            sectionsHtml += '    <i class="fa-light fa-square-list me-2"></i>' + (section.title || '');
            sectionsHtml += '  </div>';
            sectionsHtml += '  <table class="table table-sm mb-0">';
            sectionsHtml += '    <tbody>';
            (section.items || []).forEach(function (item) {
                var val = (item.value === null || item.value === undefined || item.value === '')
                    ? '<i class="color-888">— chưa nhập —</i>'
                    : '<b>' + item.value + '</b>';
                sectionsHtml += '<tr>';
                sectionsHtml += '  <td style="width:40%;color:#666;padding:8px 12px;">' + item.label + '</td>';
                sectionsHtml += '  <td style="padding:8px 12px;">' + val + '</td>';
                sectionsHtml += '</tr>';
            });
            sectionsHtml += '    </tbody>';
            sectionsHtml += '  </table>';
            sectionsHtml += '</div>';
        });
        $("#zoneConfirm_Details").html(sectionsHtml);

        // Action button
        $("#lblConfirm_ActionLabel").text(options.actionLabel || 'Xác nhận thực hiện');
        $("#btnConfirm_DoIt").prop('disabled', requireChk);

        // Reset checkbox
        $("#chkConfirm_Agreement").prop('checked', false);
        var $chkWrap = $("#chkConfirm_Agreement").closest('.form-check');
        $chkWrap.toggle(requireChk);

        // Re-bind checkbox change
        $("#chkConfirm_Agreement").off("change.confirmfancy").on("change.confirmfancy", function () {
            $("#btnConfirm_DoIt").prop('disabled', !this.checked);
        });

        // Re-bind confirm button (off trước để tránh duplicate handler)
        $("#btnConfirm_DoIt").off("click.confirmfancy").on("click.confirmfancy", function () {
            $("#modal_ConfirmFancy").modal('hide');
            if (typeof options.onConfirm === 'function') options.onConfirm();
        });

        // Show modal
        $("#modal_ConfirmFancy").modal('show');
    },

    /*------------------------------------------
    --Discription: Confirm + Thực hiện phân ngành (gọi Them_StudyTrack_Full)
    --Origin: PKG_CORE_NGUOIHOC_01.Them_StudyTrack_Full
    -------------------------------------------*/
    confirm_PhanNganh: function () {
        var me = this;
        var aData = me.aPhanNganh;
        if (!aData) {
            edu.system.alert("Chưa chọn học viên", "w");
            return;
        }
        // Validate cơ bản
        if (!edu.util.getValById('dropPN_ChuongTrinh')) {
            edu.system.alert("Vui lòng chọn Chương trình", "w");
            return;
        }
        if (!edu.util.getValById('dropPN_Lop')) {
            edu.system.alert("Vui lòng chọn Lớp", "w");
            return;
        }

        // Lấy tất cả thông tin user đã chọn để hiển thị trong confirm
        var hoTen = edu.util.returnEmpty(aData.HO_TEN) || edu.util.returnEmpty(aData.FULL_NAME);
        var maNH = edu.util.returnEmpty(aData.MA_NGUOI_HOC);
        var cccd = edu.util.returnEmpty(aData.IDENTIFIER_NO) || edu.util.returnEmpty(aData.DINHDANH_CHINH_SO);
        // Lấy text hiển thị (không phải id) từ option đang được chọn
        var txt = function (id) { return $('#' + id + ' option:selected').text(); };

        me.showFancyConfirm({
            title: 'Xác nhận phân ngành lớp chính',
            subTitle: 'Hành động này sẽ thiết lập tuyến học chính và xếp lớp cho học viên',
            icon: 'fa-sitemap',
            warningText: 'Sau khi xác nhận, hệ thống sẽ tạo bản ghi quá trình học cho học viên. Việc thu hồi có thể cần thực hiện thủ công.',
            subject: {
                name: hoTen,
                extra: [
                    { label: 'CCCD', value: cccd },
                    { label: 'Mã người học', value: maNH }
                ]
            },
            sections: [
                {
                    title: 'Khai tuyến học chính',
                    color: 'blue',
                    items: [
                        { label: 'Hình thức học',  value: txt('dropPN_HinhThucHoc') },
                        { label: 'Diện học',       value: txt('dropPN_DienHoc') },
                        { label: 'Loại nguồn',     value: txt('dropPN_LoaiNguon') },
                        { label: 'Tuyến học chính', value: $('#chkPN_TuyenChinh').is(':checked') ? '✓ Chính' : 'Phụ' },
                        { label: 'Ngày bắt đầu',   value: edu.util.getValById('txtPN_NgayBatDau') },
                        { label: 'Ngày kết thúc',  value: edu.util.getValById('txtPN_NgayKetThuc') },
                        { label: 'Ghi chú',        value: edu.util.getValById('txtPN_GhiChu') }
                    ]
                },
                {
                    title: 'Xếp vào chương trình học',
                    color: 'green',
                    items: [
                        { label: 'Hệ đào tạo',     value: txt('dropPN_HeDaoTao') },
                        { label: 'Khóa đào tạo',   value: txt('dropPN_KhoaDaoTao') },
                        { label: 'Chương trình',   value: txt('dropPN_ChuongTrinh') },
                        { label: 'Trạng thái học', value: txt('dropPN_TrangThaiHoc') },
                        { label: 'Loại tiếp nhận', value: txt('dropPN_LoaiTiepNhan') },
                        { label: 'Mã số',          value: edu.util.getValById('txtPN_MaSo') }
                    ]
                },
                {
                    title: 'Xếp vào lớp',
                    color: 'orange',
                    items: [
                        { label: 'Lớp học', value: txt('dropPN_Lop') }
                    ]
                }
            ],
            actionLabel: 'Thực hiện phân ngành',
            requireCheckbox: true,
            onConfirm: function () {
                me.save_PhanNganh();
            }
        });
    },

    save_PhanNganh: function () {
        var me = this;
        var aData = me.aPhanNganh;
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/FSkkLB4SNTQlOBUzICIq',
            'func': 'PKG_CORE_NGUOIHOC_01.Them_StudyTrack_Full',
            'iM': edu.system.iM,
            // Mapping theo PROCEDURE Them_StudyTrack_Full
            'strCorePerson_Id': aData.CORE_PERSON_ID || aData.PERSON_ID || '',
            'strCorePersonIntake_Id': '',
            'strDaoTaoToChucCT_Id': edu.util.getValById('dropPN_ChuongTrinh'),
            'strDaoTaoLopQuanLy_Id': edu.util.getValById('dropPN_Lop'),
            'strChangeType_Id': edu.util.getValById('dropPN_LoaiTiepNhan'),
            'strStudyStatus_Id': edu.util.getValById('dropPN_TrangThaiHoc'),
            'strStudyKind_Id': edu.util.getValById('dropPN_HinhThucHoc'),
            'strStudyRelationType_Id': edu.util.getValById('dropPN_DienHoc'),
            'dIsPrimary': $('#chkPN_TuyenChinh').is(':checked') ? 1 : 0,
            'strNgayBatDau': edu.util.getValById('txtPN_NgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtPN_NgayKetThuc'),
            'strSourceType_Id': edu.util.getValById('dropPN_LoaiNguon'),
            'strSourceRef_Id': '',
            'strDecision_Id': '',
            'strGhiChu': edu.util.getValById('txtPN_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân ngành lớp chính thành công", "s");
                    me.getList_PhanNganhLopChinh();
                    me.resetForm_PhanNganh();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    resetForm_PhanNganh: function () {
        this.aPhanNganh = null;
        var emptyHtml = '<div class="text-center color-888 pt-30 pb-30">' +
            '<i class="fa-light fa-hand-pointer fz30 d-block mb-10"></i>' +
            'Chọn một học viên ở bảng bên trái để khai tuyến học chính và xếp lớp' +
            '</div>';
        $("#zoneFormPhanNganh").html(emptyHtml);
        $("#lblPN_FormTitle").html("Phân ngành lớp chính");
    },

    /*------------------------------------------
    --Discription: Render form khởi tạo định danh ở panel bên phải
    --Section 1: Thông tin cơ bản (editable) -> InsertCorePerson
    --Section 2: Thông tin định danh (editable) -> chờ wire API
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: Helper build "View header" - hiển thị tổng quan SV (chỉ đọc)
    --Dùng đầu các form chỉnh sửa (cả KTĐD tab và Modal)
    -------------------------------------------*/
    _buildViewHeader: function (aData) {
        aData = aData || {};
        var v = function (val) { return edu.util.returnEmpty(val) || '<i class="color-888">—</i>'; };
        var hoTen = edu.util.returnEmpty(aData.FULL_NAME) || edu.util.returnEmpty(aData.HO_TEN) || edu.util.returnEmpty(aData.SINHVIEN_TENDAYDU);
        var maNH = edu.util.returnEmpty(aData.MA_NGUOIHOC_CHINH) || edu.util.returnEmpty(aData.MA_NGUOIHOC_PHU) || edu.util.returnEmpty(aData.MA_NGUOI_HOC);
        var cccd = edu.util.returnEmpty(aData.DINHDANH_CHINH_SO) || edu.util.returnEmpty(aData.IDENTIFIER_NO) || edu.util.returnEmpty(aData.CCCD);
        var ngaySinh = edu.util.returnEmpty(aData.NGAYSINH_DD_MM_YYYY) || edu.util.returnEmpty(aData.NGAY_SINH) || edu.util.returnEmpty(aData.DATE_OF_BIRTH);
        var gioiTinh = edu.util.returnEmpty(aData.GIOITINH_TEN) || edu.util.returnEmpty(aData.GIOI_TINH_TEN);
        var lop = edu.util.returnEmpty(aData.LOPQUANLY_TEN) || edu.util.returnEmpty(aData.LOPQUANLY_MA);
        var khoa = edu.util.returnEmpty(aData.KHOAQUANLY_TEN);
        var chuongTrinh = edu.util.returnEmpty(aData.TENCHUONGTRINH);
        var heDaoTao = edu.util.returnEmpty(aData.TENHEDAOTAO);
        var khoaHoc = edu.util.returnEmpty(aData.TENKHOA);
        var trangThai = edu.util.returnEmpty(aData.STUDY_STATUS_TEN) || edu.util.returnEmpty(aData.TRANGTHAI_TEN);
        var email = edu.util.returnEmpty(aData.EMAIL);

        var html = '';
        html += '<div class="aps-view-header mb-15 pd10" style="background:linear-gradient(135deg,#f0f6ff 0%,#fff 100%);border:1px solid #d4e3f9;border-radius:8px;">';
        // Bỏ avatar, chỉ giữ thông tin - icon graduate đứng trước tên đã đủ visual
        html += '  <div class="fz18 fw-bold mb-2" style="color:#1d3a8a;"><i class="fa-light fa-user-graduate me-2"></i>' + (hoTen || '<i class="color-888">Chưa có tên</i>') + '</div>';
        html += '  <div class="row fz13">';
        html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Mã NH:</span> <b>' + v(maNH) + '</b></div>';
        html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">CCCD:</span> <b>' + v(cccd) + '</b></div>';
        html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Ngày sinh:</span> <b>' + v(ngaySinh) + '</b></div>';
        html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Giới tính:</span> <b>' + v(gioiTinh) + '</b></div>';
        if (lop || khoa) {
            html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Lớp:</span> <b>' + v(lop) + '</b></div>';
            html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Khoa quản lý:</span> <b>' + v(khoa) + '</b></div>';
        }
        if (chuongTrinh || heDaoTao) {
            html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Chương trình:</span> <b>' + v(chuongTrinh) + '</b></div>';
            html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Hệ đào tạo:</span> <b>' + v(heDaoTao) + '</b></div>';
        }
        if (khoaHoc) {
            html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Khóa học:</span> <b>' + v(khoaHoc) + '</b></div>';
        }
        if (email) {
            html += '    <div class="col-12 col-md-6 mb-1"><span class="color-888">Email:</span> <b>' + v(email) + '</b></div>';
        }
        if (trangThai) {
            html += '    <div class="col-12 mt-2 d-flex align-items-center flex-wrap" style="gap:6px;">'
                  +    '<span class="color-888">Trạng thái:</span>'
                  +    '<span class="badge bg-primary-subtle text-primary fw-semibold" style="padding:4px 10px;border-radius:4px;font-size:12px;line-height:1.4;">' + trangThai + '</span>'
                  +  '</div>';
        }
        html += '  </div>';
        html += '</div>';
        return html;
    },

    renderForm_DinhDanh: function (aData) {
        var me = this;
        var html = '';

        // ===== View header (chỉ đọc) - hiện toàn bộ thông tin tổng quan SV =====
        html += me._buildViewHeader(aData);

        // Build options Giới tính từ danh mục NS.GITI
        var genderOptions = '<option value="">-- Chọn giới tính --</option>';
        (me.dtGioiTinh || []).forEach(function (g) {
            var selected = (g.ID === aData.GIOI_TINH_ID) ? 'selected' : '';
            genderOptions += '<option value="' + g.ID + '" ' + selected + '>' + edu.util.returnEmpty(g.TEN) + '</option>';
        });

        // ===== Thông tin cơ bản (editable - InsertCorePerson) =====
        html += '<div class="aps-form mb-15">';
        html += '  <p class="group-group-title-name mb-10"><span class="badge bg-blue fz14">Thông tin cơ bản</span></p>';
        html += '  <div class="row">';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Mã người học</label>';
        html += '      <input type="text" class="form-control" value="' + edu.util.returnEmpty(aData.MA_NGUOI_HOC) + '" readonly>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Họ và tên đầy đủ <span class="text-danger">*</span></label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_FullName" placeholder="VD: Nguyễn Văn An" value="' + edu.util.returnEmpty(aData.HO_TEN) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-4 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Họ</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_LastName" value="' + edu.util.returnEmpty(aData.LAST_NAME) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-4 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Tên đệm</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_MiddleName" value="' + edu.util.returnEmpty(aData.MIDDLE_NAME) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-4 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Tên</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_FirstName" value="' + edu.util.returnEmpty(aData.FIRST_NAME) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày sinh (dd/mm/yyyy)</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_DateOfBirth" placeholder="dd/mm/yyyy" value="' + edu.util.returnEmpty(aData.NGAY_SINH) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Giới tính</label>';
        html += '      <select class="form-select" id="dropKTDD_Gender">' + genderOptions + '</select>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="d-flex justify-content-end gap-2 mt-10">';
        html += '    <button class="btn btn-default" id="btnKTDD_Cancel"><i class="fal fa-times me-1"></i> Hủy</button>';
        html += '    <button class="btn btn-view" id="btnKTDD_SaveBasic"><i class="fal fa-save me-1"></i> Lưu thông tin cơ bản</button>';
        html += '  </div>';
        html += '</div>';

        // ===== Thông tin định danh (editable - sẽ wire API sau) =====
        html += '<div class="aps-form mt-20" style="border-top:1px dashed #ccc;padding-top:15px;">';
        html += '  <p class="group-group-title-name mb-10"><span class="badge bg-green fz14">Thông tin định danh</span> <span class="fz12 color-888 ms-2">Bước 2 — chờ tích hợp API</span></p>';
        html += '  <div class="row">';
        html += '    <div class="col-12 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Số CCCD / Định danh</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_IdentifierNo" placeholder="Nhập số CCCD" value="' + edu.util.returnEmpty(aData.IDENTIFIER_NO) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày cấp</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_IssueDate" placeholder="dd/mm/yyyy" value="' + edu.util.returnEmpty(aData.ISSUE_DATE) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Nơi cấp</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_IssuePlace" value="' + edu.util.returnEmpty(aData.ISSUE_PLACE) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Hiệu lực từ</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_EffectiveFrom" placeholder="dd/mm/yyyy" value="' + edu.util.returnEmpty(aData.IDENTIFIER_EFFECTIVE_FROM) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Hiệu lực đến</label>';
        html += '      <input type="text" class="form-control" id="txtKTDD_EffectiveTo" placeholder="dd/mm/yyyy" value="' + edu.util.returnEmpty(aData.IDENTIFIER_EFFECTIVE_TO) + '">';
        html += '    </div>';
        html += '    <div class="col-12 mb-10">';
        html += '      <div class="form-check">';
        html += '        <input type="checkbox" class="form-check-input" id="chkKTDD_IsPrimary" ' + (aData.IDENTIFIER_IS_PRIMARY == 1 ? 'checked' : '') + '>';
        html += '        <label class="form-check-label fz14" for="chkKTDD_IsPrimary">Là định danh chính</label>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="col-12 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ghi chú</label>';
        html += '      <textarea class="form-control" id="txtKTDD_GhiChu" rows="2">' + edu.util.returnEmpty(aData.GHICHU) + '</textarea>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="d-flex justify-content-end gap-2 mt-10">';
        html += '    <button class="btn btn-outline-save" id="btnKTDD_Save"><i class="fal fa-save me-1"></i> Lưu định danh</button>';
        html += '  </div>';
        html += '</div>';

        $("#zoneFormDinhDanh").html(html);
        // Đổi title theo mode: Thêm mới vs Xem/Sửa
        if (me.isThemMoi) {
            $("#lblFormTitle").html('<i class="fa-light fa-plus mr-5"></i> Thêm mới hồ sơ');
        } else {
            $("#lblFormTitle").html("Xem / Sửa hồ sơ - " + edu.util.returnEmpty(aData.HO_TEN));
        }
        // Hiện box "Khai thông tin các quá trình" + render tab "Hồ sơ - chính sách" với data hiện có
        $("#boxQuaTrinh").show();
        me.renderTab_HoSoChinhSach(aData);
        // Nếu đang Xem/Sửa và có CORE_PERSON_ID -> fetch profile thật từ server để hiển thị đầy đủ
        var strPersonId = aData.CORE_PERSON_ID || aData.PERSON_ID;
        if (!me.isThemMoi && strPersonId) {
            me.getInfo_HoSoChinhSach(strPersonId);
        }
    },

    /*------------------------------------------
    --Discription: Lưu thông tin cơ bản (InsertCorePerson)
    --Origin: PKG_CORE_HOSONHANSU_05.InsertCorePerson
    --Dùng chung hàm với module nhân sự, gắn ngữ cảnh STUDENT
    -------------------------------------------*/
    save_CorePerson: function () {
        var me = this;
        var aData = me.aKhoiTaoDinhDanh;
        if (!aData) {
            edu.system.alert("Chưa chọn người học", "w");
            return;
        }
        var strFullName = edu.util.getValById('txtKTDD_FullName');
        if (!strFullName) {
            edu.system.alert("Vui lòng nhập Họ và tên đầy đủ", "w");
            return;
        }

        // Parse ngày sinh dd/mm/yyyy -> day/month/year (để truyền cả số riêng và string)
        var strDob = edu.util.getValById('txtKTDD_DateOfBirth');
        var dDay = '', dMonth = '', dYear = '';
        if (strDob) {
            var parts = strDob.split('/');
            if (parts.length >= 3) {
                dDay = parseInt(parts[0], 10) || '';
                dMonth = parseInt(parts[1], 10) || '';
                dYear = parseInt(parts[2], 10) || '';
            }
        }

        var obj_save = {
            'action': 'NS_HoSoNhanSu5_MH/CC8yJDM1Ai4zJBEkMzIuLwPP',
            'func': 'PKG_CORE_HOSONHANSU_05.InsertCorePerson',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id || edu.system.chucNangHeThong_Id || '',
            'strFullName': strFullName,
            'strLastName': edu.util.getValById('txtKTDD_LastName'),
            'strMiddleName': edu.util.getValById('txtKTDD_MiddleName'),
            'strFirstName': edu.util.getValById('txtKTDD_FirstName'),
            'strDateOfBirth': strDob,
            'strDobPrecisionLevel': '',
            'dBirthDay': dDay,
            'dBirthMonth': dMonth,
            'dBirthYear': dYear,
            'strGenderId': edu.util.getValById('dropKTDD_Gender'),
            'strProfileStatusId': '',
            'strPortraitFileId': '',
            // ===== 3 tham số cố định ngữ cảnh STUDENT =====
            'strContext_Code': 'STUDENT',
            'strInitial_ConText_Code': 'STUDENT',
            'strCreated_Source_Code': 'INTERNAL_FORM',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Khởi tạo thông tin cơ bản thành công", "s");
                    // Reload danh sách
                    me.getList_NguoiHocChuaCoCauTruc();
                    me.resetForm_DinhDanh();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    /*------------------------------------------
    --Discription: Tab "Thông tin hồ sơ - chính sách"
    --Origin: PKG_CORE_NGUOIHOC_01.Them/Sua/Xoa_Person_Profile
    -------------------------------------------*/
    renderTab_HoSoChinhSach: function (aData) {
        var me = this;
        aData = aData || {};

        function buildOptions(arr, selectedId, placeholder) {
            var html = '<option value="">-- ' + placeholder + ' --</option>';
            (arr || []).forEach(function (item) {
                var selected = (item.ID == selectedId) ? 'selected' : '';
                html += '<option value="' + item.ID + '" ' + selected + '>' + edu.util.returnEmpty(item.TEN) + '</option>';
            });
            return html;
        }

        var profileId = aData.PERSON_PROFILE_ID || aData.PROFILE_ID || '';
        var isEdit = !!profileId;

        var html = '';
        html += '<div class="aps-form">';
        html += '  <div class="row">';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Tôn giáo</label>';
        html += '      <select class="form-select" id="dropHSCS_Religion">' + buildOptions(me.dtTonGiao, aData.RELIGION_ID, 'Chọn tôn giáo') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Dân tộc</label>';
        html += '      <select class="form-select" id="dropHSCS_Ethnicity">' + buildOptions(me.dtDanToc, aData.ETHNICITY_ID, 'Chọn dân tộc') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Hoàn cảnh gia đình</label>';
        html += '      <select class="form-select" id="dropHSCS_FamilyBackground">' + buildOptions(me.dtHoanCanh, aData.FAMILY_BACKGROUND_ID, 'Chọn hoàn cảnh') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Tình trạng hôn nhân</label>';
        html += '      <select class="form-select" id="dropHSCS_MaritalStatus">' + buildOptions(me.dtHonNhan, aData.MARITAL_STATUS_ID, 'Chọn tình trạng') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Đối tượng chính sách</label>';
        html += '      <select class="form-select" id="dropHSCS_PolicyObject">' + buildOptions(me.dtDoiTuongCS, aData.POLICY_OBJECT_ID, 'Chọn đối tượng') + '</select>';
        html += '    </div>';
        html += '    <div class="col-12 col-md-6 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Nhóm máu</label>';
        html += '      <input type="text" class="form-control" id="txtHSCS_BloodType" placeholder="VD: A, B, AB, O+" value="' + edu.util.returnEmpty(aData.BLOOD_TYPE_CODE) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-4 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày vào Đoàn</label>';
        html += '      <input type="text" class="form-control" id="txtHSCS_UnionJoin" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.UNION_JOIN_DATE) || edu.util.returnEmpty(aData.union_join_date)) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-4 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày vào Đảng</label>';
        html += '      <input type="text" class="form-control" id="txtHSCS_PartyJoin" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.PARTY_JOIN_DATE) || edu.util.returnEmpty(aData.party_join_date)) + '">';
        html += '    </div>';
        html += '    <div class="col-12 col-md-4 mb-10">';
        html += '      <label class="form-label fz14 color-888 mb-1">Ngày chính thức Đảng</label>';
        html += '      <input type="text" class="form-control" id="txtHSCS_PartyOfficial" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.PARTY_OFFICIAL_DATE) || edu.util.returnEmpty(aData.party_official_date)) + '">';
        html += '    </div>';
        // Hiệu lực: checkbox 1|0. Mặc định 1 (active) khi Thêm mới
        var isActive = (aData.IS_ACTIVE !== undefined) ? aData.IS_ACTIVE
                     : ((aData.is_active !== undefined) ? aData.is_active : 1);
        var checkedAttr = (isActive == 1 || isActive == '1' || isActive === true) ? 'checked' : '';
        html += '    <div class="col-12 mb-10">';
        html += '      <div class="form-check">';
        html += '        <input type="checkbox" class="form-check-input" id="chkHSCS_IsActive" ' + checkedAttr + '>';
        html += '        <label class="form-check-label fz14" for="chkHSCS_IsActive">Hiệu lực</label>';
        html += '      </div>';
        html += '    </div>';
        html += '  </div>';
        // ID ẩn để biết Thêm vs Sửa
        html += '  <input type="hidden" id="txtHSCS_Id" value="' + profileId + '">';
        html += '  <div class="d-flex justify-content-end gap-2 mt-10">';
        if (isEdit) {
            html += '    <button class="btn btn-delete" id="btnHSCS_Xoa"><i class="fal fa-trash me-1"></i> Xóa</button>';
        }
        html += '    <button class="btn btn-view" id="btnHSCS_Save">';
        html += '      <i class="fal fa-save me-1"></i> ' + (isEdit ? 'Cập nhật' : 'Lưu hồ sơ - chính sách');
        html += '    </button>';
        html += '  </div>';
        html += '</div>';

        $("#zoneHoSoChinhSach").html(html);
    },

    save_HoSoChinhSach: function () {
        var me = this;
        var aData = me.aKhoiTaoDinhDanh;
        if (!aData) {
            edu.system.alert("Chưa chọn người học", "w");
            return;
        }
        var strPersonId = aData.CORE_PERSON_ID || aData.PERSON_ID;
        if (!strPersonId) {
            edu.system.alert("Chưa có Person ID. Vui lòng lưu Thông tin cơ bản trước.", "w");
            return;
        }

        var strProfileId = edu.util.getValById('txtHSCS_Id');
        var isEdit = !!strProfileId;

        var common = {
            'iM': edu.system.iM,
            'strReligion_Id': edu.util.getValById('dropHSCS_Religion'),
            'strEthnicity_Id': edu.util.getValById('dropHSCS_Ethnicity'),
            'strFamilyBackground_Id': edu.util.getValById('dropHSCS_FamilyBackground'),
            'strMaritalStatus_Id': edu.util.getValById('dropHSCS_MaritalStatus'),
            'strPolicyObject_Id': edu.util.getValById('dropHSCS_PolicyObject'),
            'strBloodType_Code': edu.util.getValById('txtHSCS_BloodType'),
            'strUnionJoinDate': edu.util.getValById('txtHSCS_UnionJoin'),
            'strPartyJoinDate': edu.util.getValById('txtHSCS_PartyJoin'),
            'strPartyOfficialDate': edu.util.getValById('txtHSCS_PartyOfficial'),
            'dIsActive': $('#chkHSCS_IsActive').is(':checked') ? 1 : 0,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        var obj_save;
        if (isEdit) {
            obj_save = Object.assign(common, {
                'action': 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLx4RMy4nKC0k',
                'func': 'PKG_CORE_NGUOIHOC_01.Sua_Person_Profile',
                'strId': strProfileId,
            });
        } else {
            obj_save = Object.assign(common, {
                'action': 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8eETMuJygtJAPP',
                'func': 'PKG_CORE_NGUOIHOC_01.Them_Person_Profile',
                'strPerson_Id': strPersonId,
            });
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(isEdit ? "Cập nhật hồ sơ - chính sách thành công" : "Thêm hồ sơ - chính sách thành công", "s");
                    if (!isEdit && data.Id) {
                        aData.PERSON_PROFILE_ID = data.Id;
                        // Re-render để hiện nút Cập nhật + Xóa
                        me.renderTab_HoSoChinhSach(aData);
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    delete_HoSoChinhSach: function () {
        var me = this;
        var aData = me.aKhoiTaoDinhDanh;
        var strProfileId = edu.util.getValById('txtHSCS_Id');
        if (!strProfileId) {
            edu.system.alert("Chưa có hồ sơ - chính sách để xóa", "w");
            return;
        }

        edu.system.confirm("Bạn có chắc chắn muốn xóa hồ sơ - chính sách này?");
        $("#btnYes").off("click").on("click", function () {
            var obj_save = {
                'action': 'SV_NGUOIHOC_01_MH/GS4gHhEkMzIuLx4RMy4nKC0k',
                'func': 'PKG_CORE_NGUOIHOC_01.Xoa_Person_Profile',
                'iM': edu.system.iM,
                'strId': strProfileId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
                'strHanhDong_Code': '',
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        edu.system.alert("Xóa hồ sơ - chính sách thành công", "s");
                        if (aData) {
                            aData.PERSON_PROFILE_ID = null;
                            aData.RELIGION_ID = null;
                            aData.ETHNICITY_ID = null;
                            aData.FAMILY_BACKGROUND_ID = null;
                            aData.MARITAL_STATUS_ID = null;
                            aData.POLICY_OBJECT_ID = null;
                            aData.BLOOD_TYPE_CODE = null;
                            aData.UNION_JOIN_DATE = null;
                            aData.PARTY_JOIN_DATE = null;
                            aData.PARTY_OFFICIAL_DATE = null;
                            me.renderTab_HoSoChinhSach(aData);
                        }
                    }
                    else {
                        edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
        });
    },

    /*------------------------------------------
    --Discription: Lấy thông tin Person Profile theo Id hoặc Person_Id
    --Origin: PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile
    --(Ưu tiên strId; nếu rỗng thì tìm theo strPerson_Id)
    -------------------------------------------*/
    getInfo_HoSoChinhSach: function (strPersonId, strProfileId) {
        var me = this;
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4FRURJDMyLi8eETMuJygtJAPP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile',
            'iM': edu.system.iM,
            'strId': strProfileId || '',
            'strPerson_Id': strPersonId || '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data || [];
                    var profileData = (dt.length > 0) ? dt[0] : null;
                    if (profileData && me.aKhoiTaoDinhDanh) {
                        // Merge profile vào record đang chọn để re-render với data đầy đủ
                        Object.assign(me.aKhoiTaoDinhDanh, profileData);
                        me.renderTab_HoSoChinhSach(me.aKhoiTaoDinhDanh);
                    }
                    // else: chưa có profile -> giữ form rỗng để Thêm mới
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    /*------------------------------------------
    --Discription: Lấy danh sách Person Profile theo bộ lọc
    --Origin: PKG_CORE_NGUOIHOC_01.LayDSPerson_Profile
    --(Có thể dùng cho query/báo cáo. Truyền callback để xử lý kết quả)
    -------------------------------------------*/
    getList_HoSoChinhSach: function (filters, callback) {
        var me = this;
        filters = filters || {};
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIRJDMyLi8eETMuJygtJAPP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSPerson_Profile',
            'iM': edu.system.iM,
            'strPerson_Ids': filters.strPerson_Ids || '',
            'strEthnicity_Id': filters.strEthnicity_Id || '',
            'strReligion_Id': filters.strReligion_Id || '',
            'strPolicyObject_Id': filters.strPolicyObject_Id || '',
            'dIsActive': (filters.dIsActive !== undefined) ? filters.dIsActive : 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHoSoChinhSachList = data.Data;
                    if (typeof callback === 'function') callback(data.Data);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    resetForm_DinhDanh: function () {
        var emptyHtml = '<div class="text-center color-888 pt-30 pb-30">' +
            '<i class="fa-light fa-hand-pointer fz30 d-block mb-10"></i>' +
            'Chọn một học viên ở bảng bên trái để xem chi tiết, hoặc bấm <b class="text-primary">Thêm mới</b> để khai hồ sơ mới' +
            '</div>';
        $("#zoneFormDinhDanh").html(emptyHtml);
        $("#lblFormTitle").html("Khởi tạo định danh");
        // Ẩn box "Khai thông tin các quá trình" khi không có ai được chọn
        $("#boxQuaTrinh").hide();
    },

    save_DinhDanh: function () {
        var me = this;
        var aData = me.aKhoiTaoDinhDanh;
        if (!aData) {
            edu.system.alert("Chưa chọn người học để khởi tạo định danh", "w");
            return;
        }
        var strCCCD = edu.util.getValById('txtKTDD_IdentifierNo');
        if (!strCCCD) {
            edu.system.alert("Vui lòng nhập số CCCD / Định danh", "w");
            return;
        }
        // TODO: chờ backend cung cấp API lưu định danh
        var obj = {
            strCorePerson_Id: aData.CORE_PERSON_ID,
            strIdentifierNo: strCCCD,
            strIssueDate: edu.util.getValById('txtKTDD_IssueDate'),
            strIssuePlace: edu.util.getValById('txtKTDD_IssuePlace'),
            strEffectiveFrom: edu.util.getValById('txtKTDD_EffectiveFrom'),
            strEffectiveTo: edu.util.getValById('txtKTDD_EffectiveTo'),
            iIsPrimary: $('#chkKTDD_IsPrimary').is(':checked') ? 1 : 0,
            strGhiChu: edu.util.getValById('txtKTDD_GhiChu'),
        };
        console.log("[KTDD] Sẽ gửi lên API lưu định danh:", obj);
        edu.system.alert("Đã sẵn sàng dữ liệu, chờ wire API backend lưu định danh", "i");
    },

    placeholderMap: {
        'dropHeDaoTao_CB': 'Chọn hệ đào tạo',
        'dropKhoaDaoTao_CB': 'Chọn khóa đào tạo',
        'dropKhoaQuanLy_CB': 'Chọn khoa quản lý',
        'dropChuongTrinh_CB': 'Chọn chương trình',
        'dropSearch_Lop': 'Chọn lớp',
        'dropSearch_TrangThai': 'Chọn trạng thái'
    },

    /*------------------------------------------
    --Discription: Fix 1 combo multi-select select2 sau khi loadToCombo_data:
    --xoá option value="" giả, destroy + re-init với placeholder đúng.
    -------------------------------------------*/
    applyMultiSelectPlaceholder: function (id) {
        var me = this;
        var placeholderText = me.placeholderMap[id] || 'Chọn...';
        // Đợi loadToCombo_data update xong DOM
        setTimeout(function () {
            var $sel = $('#' + id);
            if ($sel.length === 0) return;
            $sel.find('option[value=""]').remove();
            $sel.attr('data-placeholder', placeholderText);

            // Detect empty state để hiển thị message thân thiện
            var hasData = $sel.find('option').length > 0;
            var emptyMsg = hasData ? null : ('Chưa có dữ liệu cho "' + placeholderText.replace('Chọn ', '') + '"');

            if ($sel.hasClass('select2-hidden-accessible')) {
                try { $sel.select2('destroy'); } catch (e) { }
            }
            $sel.select2({
                placeholder: placeholderText,
                width: '100%',
                multiple: true,
                allowClear: true,
                language: {
                    noResults: function () { return emptyMsg || 'Không tìm thấy kết quả phù hợp'; },
                    searching: function () { return 'Đang tìm...'; },
                    inputTooShort: function () { return 'Nhập thêm để tìm...'; },
                    errorLoading: function () { return 'Không tải được dữ liệu'; }
                }
            });
            $sel.val(null).trigger('change.select2');
        }, 80);
    },

    /*------------------------------------------
    --Discription: Cleanup ban đầu cho các combo do helper ngoài
    --(genBoLoc_HeKhoa) nạp - dùng polling vì không có callback.
    -------------------------------------------*/
    cleanupPlaceholderMulti: function () {
        var me = this;
        var done = {};
        var attempts = 0;
        var iv = setInterval(function () {
            attempts++;
            var allDone = true;
            Object.keys(me.placeholderMap).forEach(function (id) {
                if (done[id]) return;
                var $sel = $('#' + id);
                if ($sel.length === 0) { allDone = false; return; }
                var $emptyOpts = $sel.find('option[value=""]');
                var $realOpts = $sel.find('option').filter(function () { return $(this).val() !== ''; });
                var emptyText = $emptyOpts.first().text() || '';
                var shouldCleanup = $realOpts.length > 0 || emptyText.indexOf('Không tìm thấy') >= 0;
                if (!shouldCleanup) { allDone = false; return; }

                me.applyMultiSelectPlaceholder(id);
                done[id] = true;
            });
            if (allDone || attempts > 27) clearInterval(iv); // ~8s
        }, 300);
    },

    /*------------------------------------------
    --Discription: [1] Danh sách sinh viên
    --Origin: PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;
        // Trạng thái: ưu tiên tab phân loại nếu có, kèm với dropdown multi-select
        var strStudyStatus = me.getMultiVal('dropSearch_TrangThai');
        if (me.strTrangThai) {
            strStudyStatus = strStudyStatus ? (strStudyStatus + ',' + me.strTrangThai) : me.strTrangThai;
        }
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
            'strDaoTao_HeDaoTao_Id': me.getMultiVal('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': me.getMultiVal('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': me.getMultiVal('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': me.getMultiVal('dropKhoaQuanLy_CB'),
            'strDaoTao_LopQuanLy_Id': me.getMultiVal('dropSearch_Lop'),
            'strStudyStatus_Ids': strStudyStatus,
            'dIsPrimary': '',
            'dBoQuaPhamVi': 0,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
                    // Thống kê dùng API riêng (LayThongKe_TrangThaiNguoiHoc)
                    me.getList_ThongKe();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    /*------------------------------------------
    --Discription: Xuất Excel theo dữ liệu danh sách SV hiện hành
    --Nguồn: me.dtSinhVien (đã gen từ getList_SinhVien — đã apply bộ lọc + tab)
    --Lib: XLSX (SheetJS) load lazy từ CDN trong DaQHHT.html
    -------------------------------------------*/
    exportExcel_DSSinhVien: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert('Thư viện Excel chưa load xong. Vui lòng thử lại sau vài giây.', 'w');
            return;
        }
        var data = me.dtSinhVien || [];
        if (!data.length) {
            edu.system.alert('Không có dữ liệu để xuất. Vui lòng tìm kiếm trước.', 'w');
            return;
        }
        // Nếu data > 5000 dòng → cảnh báo + xác nhận để tránh treo browser
        if (data.length > 5000) {
            if (!confirm('Bạn sắp xuất ' + data.length.toLocaleString('vi-VN') + ' dòng dữ liệu. Quá trình có thể mất vài giây và sử dụng nhiều RAM. Tiếp tục?')) {
                return;
            }
        }
        var v = edu.util.returnEmpty;
        // Map sang flat object theo đúng cột bảng đang hiển thị
        var rows = data.map(function (e, i) {
            var maSV = v(e.MA_NGUOIHOC_CHINH) || v(e.MA_NGUOIHOC_PHU);
            var cccd = v(e.DINHDANH_CHINH_SO) || v(e.CCCD);
            var hoTen = v(e.FULL_NAME) || v(e.SINHVIEN_TENDAYDU);
            var sdtCaNhan = v(e.SODIENTHOAI_CANHAN) || v(e.sodienthoai_canhan) || v(e.PHONE_PERSONAL) || v(e.DIENTHOAI_CANHAN) || v(e.SODIENTHOAI);
            var emailCaNhan = v(e.EMAIL_CANHAN) || v(e.email_canhan) || v(e.EMAIL_PERSONAL) || v(e.EMAIL);
            var trangThai = v(e.STUDY_STATUS_TEN) || v(e.TRANGTHAI_TEN);
            var gioiTinh = v(e.GIOITINH_TEN) || v(e.GIOI_TINH_TEN);
            var ngaySinh = v(e.NGAYSINH_DD_MM_YYYY) || v(e.NGAY_SINH) || v(e.DATE_OF_BIRTH);
            var danToc = v(e.DANTOC_TEN) || v(e.DAN_TOC_TEN);
            var tonGiao = v(e.TONGIAO_TEN) || v(e.TON_GIAO_TEN);
            var khoaHoc = v(e.KHOADAOTAO_TEN) || v(e.TENKHOA);
            var khoaQL = v(e.KHOAQUANLY_TEN);
            var lop = v(e.LOPQUANLY_TEN) || v(e.LOPQUANLY_MA);
            var ct = v(e.TENCHUONGTRINH) || v(e.CHUONGTRINH_TEN);
            var isPrimary = (e.IS_PRIMARY === 1 || e.IS_PRIMARY === '1') ? 'Chính' : ((e.IS_PRIMARY === 0 || e.IS_PRIMARY === '0') ? 'Phụ' : '');
            var gpa = v(e.GPA) || v(e.DIEM_TRUNG_BINH);
            var congNo = v(e.CONGNO) || v(e.SO_TIEN_CONGNO) || 0;
            var coVan = v(e.COVAN_HOTEN) || v(e.COVAN_TEN);
            return {
                'STT': i + 1,
                'CCCD': cccd,
                'Mã SV': maSV,
                'Họ và tên': hoTen,
                'Điện thoại cá nhân': sdtCaNhan,
                'Email cá nhân': emailCaNhan,
                'Trạng thái': trangThai,
                'Giới tính': gioiTinh,
                'Ngày sinh': ngaySinh,
                'Dân tộc': danToc,
                'Tôn giáo': tonGiao,
                'Khóa học': khoaHoc,
                'Khoa quản lý': khoaQL,
                'Lớp': lop,
                'Chương trình': ct,
                'Ngành chính/phụ': isPrimary,
                'GPA': gpa,
                'Công nợ': congNo,
                'Cố vấn': coVan
            };
        });

        var ws = XLSX.utils.json_to_sheet(rows);
        // Set column width tự động dựa trên độ dài header + 2
        var headers = Object.keys(rows[0]);
        ws['!cols'] = headers.map(function (h) {
            var maxLen = h.length;
            rows.forEach(function (r) {
                var l = String(r[h] || '').length;
                if (l > maxLen) maxLen = l;
            });
            return { wch: Math.min(maxLen + 2, 40) };
        });

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách sinh viên');

        // Tên file: DSSV_<filter tag>_<yyyymmdd_hhmm>.xlsx
        var now = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
                    + '_' + pad(now.getHours()) + pad(now.getMinutes());
        var tag = me.strTrangThai ? '_' + me.strTrangThai : '';
        var fileName = 'DSSV' + tag + '_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fileName);
    },

    genTable_SinhVien: function (data, iPager) {
        var LEFT = 'style="display:block;text-align:left;width:100%;"';
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DaQHHT.getList_SinhVien()",
                iDataRow: iPager
            },
            colPos: {
                // index theo cột table (đã tính STT là col 0)
                // 1=CCCD, 2=MãSV, 3=HọTên, 4=Điện thoại cá nhân, 5=Email cá nhân,
                // 6=Trạng thái, 7=Xem hồ sơ, 8=Giới tính, 9=Ngày sinh,
                // 10=Dân tộc, 11=Tôn giáo, 12=Khóa học, 13=Khoa quản lý,
                // 14=Lớp, 15=Chương trình, 16=Ngành chính/phụ,
                // 17=GPA, 18=Công nợ, 19=Cố vấn, 20=Checkbox
                left:   [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 19],
                center: [0, 6, 7, 8, 9, 16, 17, 18, 20]
            },
            aoColumns: [
                // [col 1] CCCD
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.DINHDANH_CHINH_SO) || edu.util.returnEmpty(aData.CCCD);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 2] Mã SV
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.MA_NGUOIHOC_CHINH) || edu.util.returnEmpty(aData.MA_NGUOIHOC_PHU);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 3] Họ và tên
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.FULL_NAME) || edu.util.returnEmpty(aData.SINHVIEN_TENDAYDU);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 4] Điện thoại cá nhân
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.SODIENTHOAI_CANHAN)
                             || edu.util.returnEmpty(aData.sodienthoai_canhan)
                             || edu.util.returnEmpty(aData.PHONE_PERSONAL)
                             || edu.util.returnEmpty(aData.DIENTHOAI_CANHAN)
                             || edu.util.returnEmpty(aData.SODIENTHOAI);
                        if (!v) return '<span ' + LEFT + ' class="color-888">—</span>';
                        return '<span ' + LEFT + '><a href="tel:' + v + '" style="color:#3380db;text-decoration:none;">' + v + '</a></span>';
                    }
                },
                // [col 5] Email cá nhân
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.EMAIL_CANHAN)
                             || edu.util.returnEmpty(aData.email_canhan)
                             || edu.util.returnEmpty(aData.EMAIL_PERSONAL)
                             || edu.util.returnEmpty(aData.EMAIL);
                        if (!v) return '<span ' + LEFT + ' class="color-888">—</span>';
                        return '<span ' + LEFT + '><a href="mailto:' + v + '" style="color:#3380db;text-decoration:none;" title="' + v + '">' + v + '</a></span>';
                    }
                },
                // [col 6] Trạng thái — đẩy lên đầu để luôn nhìn thấy
                {
                    "mRender": function (nRow, aData) {
                        var strTT = edu.util.returnEmpty(aData.STUDY_STATUS_MA) || edu.util.returnEmpty(aData.TRANGTHAI);
                        var strTen = edu.util.returnEmpty(aData.STUDY_STATUS_TEN) || edu.util.returnEmpty(aData.TRANGTHAI_TEN);
                        if (!strTen) return '<span class="color-888">-</span>';
                        var strClass = "btn-soft-primary";
                        if (strTT == "CANHBAO" || strTT == "CANHBAOHOCVU") strClass = "btn-soft-orange";
                        else if (strTT == "TOTNGHIEP" || strTT == "DATOTNGHIEP") strClass = "btn-soft-success";
                        else if (strTT == "BAOLUU" || strTT == "TAMDUNG") strClass = "btn-soft-warning";
                        return '<span class="btn ' + strClass + '">' + strTen + '</span>';
                    }
                },
                // [col 5] Xem hồ sơ — mở modal hồ sơ + quá trình
                {
                    "mRender": function (nRow, aData) {
                        var strId = aData.STUDY_ID || aData.ID;
                        return '<a class="btn btn-view btn-sm btnViewSV" id="viewSV_' + strId + '"><i class="fal fa-folder-open me-1"></i>Xem hồ sơ</a>';
                    }
                },
                // [col 6] Giới tính
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIOITINH_TEN);
                    }
                },
                // [col 7] Ngày sinh
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DATE_OF_BIRTH) || edu.util.returnEmpty(aData.NGAYSINH_DD_MM_YYYY);
                    }
                },
                // [col 8] Dân tộc
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.DANTOC_TEN);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 9] Tôn giáo
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.TONGIAO_TEN);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 10] Khóa học
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.TENKHOA) || edu.util.returnEmpty(aData.MAKHOA);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 11] Khoa quản lý
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.KHOAQUANLY_TEN) || edu.util.returnEmpty(aData.KHOAQUANLY_MA);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 12] Lớp
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.LOPQUANLY_TEN) || edu.util.returnEmpty(aData.LOPQUANLY_MA);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 13] Chương trình
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.TENCHUONGTRINH) || edu.util.returnEmpty(aData.MACHUONGTRINH);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 14] Ngành chính / phụ
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.NganhChinhPhu) || edu.util.returnEmpty(aData.NGANHCHINHPHU);
                        if (!v) {
                            var isPrimary = aData.IS_PRIMARY;
                            if (isPrimary === 1 || isPrimary === '1') v = 'Chính';
                            else if (isPrimary === 0 || isPrimary === '0') v = 'Phụ';
                            else if (aData.MA_NGUOIHOC_CHINH && aData.MA_NGUOIHOC_PHU
                                && aData.MA_NGUOIHOC_CHINH === aData.MA_NGUOIHOC_PHU) v = 'Chính';
                        }
                        var strClass = (v === 'Chính') ? 'btn-soft-success' : (v === 'Phụ' ? 'btn-soft-primary' : '');
                        return strClass ? '<span class="btn ' + strClass + '">' + v + '</span>' : v;
                    }
                },
                // [col 15] GPA
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GPA);
                    }
                },
                // [col 16] Công nợ
                {
                    "mRender": function (nRow, aData) {
                        var iCongNo = Number(edu.util.returnEmpty(aData.CONGNO)) || 0;
                        if (iCongNo > 0) {
                            return '<span class="color-red">' + edu.util.formatCurrency(iCongNo) + 'đ</span>';
                        }
                        return '<span class="color-222">0</span>';
                    }
                },
                // [col 17] Cố vấn
                {
                    "mRender": function (nRow, aData) {
                        var v = edu.util.returnEmpty(aData.COVAN_TENDAYDU);
                        return '<span ' + LEFT + '>' + v + '</span>';
                    }
                },
                // [col 18] Checkbox
                {
                    "mRender": function (nRow, aData) {
                        var strId = aData.STUDY_ID || aData.ID;
                        return '<input type="checkbox" id="checkX' + strId + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [Stats] Lấy thống kê trạng thái người học
    --Origin: PKG_CORE_NGUOIHOC_01.LayThongKe_TrangThaiNguoiHoc
    --Filter ParamIsPrimary lấy từ radio button "Ngành chính/Phụ"
    -------------------------------------------*/
    getList_ThongKe: function () {
        var me = this;
        var strIsPrimary = $('input[name="filterIsPrimary"]:checked').val() || '';

        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4FSkuLyYKJB4VMyAvJhUpICgPJjQuKAkuIgPP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayThongKe_TrangThaiNguoiHoc',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
            'strDaoTao_HeDaoTao_Id': me.getMultiVal('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': me.getMultiVal('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': me.getMultiVal('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': me.getMultiVal('dropKhoaQuanLy_CB'),
            'strDaoTao_LopQuanLy_Id': me.getMultiVal('dropSearch_Lop'),
            'dIsPrimary': strIsPrimary,
            'dBoQuaPhamVi': 0,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtThongKe = data.Data || [];
                    me.genStatic_SinhVien(me.dtThongKe);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST", action: obj_save.action,
            contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Render các thẻ thống kê
    --1. Tổng sinh viên (sum của tất cả SoNguoi - tính client side)
    --2. N thẻ trạng thái từ rs API
    --3. Công nợ tài chính (placeholder cố định - gán data sau)
    --4. Cảnh báo học vụ (placeholder cố định - gán data sau)
    -------------------------------------------*/
    genStatic_SinhVien: function (data) {
        data = data || [];
        // Sum tổng SV
        var tongSV = 0;
        data.forEach(function (item) {
            tongSV += Number(item.SoNguoi || item.SONGUOI || 0) || 0;
        });

        // Helper format số
        var fmt = function (n) {
            n = Number(n) || 0;
            return n.toLocaleString('vi-VN');
        };

        // Helper render 1 info-box card
        var renderCard = function (opts) {
            var modulClass = opts.modulClass || '';
            var iconStyle = opts.iconStyle || '';
            var unitHtml = opts.unit || '';
            var html = '';
            html += '<div class="col-6 col-md-4 col-xxl-2 mb-15 ' + modulClass + '">';
            html += '  <div class="info-box">';
            html += '    <div class="icon"' + (iconStyle ? ' style="' + iconStyle + '"' : '') + '>';
            html += '      <i class="' + (opts.icon || 'fa-duotone fa-solid fa-circle') + '"></i>';
            html += '    </div>';
            html += '    <div>';
            html += '      <div class="name">' + opts.name + '</div>';
            html += '      <div class="static">' + unitHtml + '</div>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
            return html;
        };

        // Map mã trạng thái -> icon + màu
        // (tự đoán theo TEN nếu không có MA, fallback default)
        var pickIconStyle = function (item) {
            var ma = (item.MA || item.STATUS_CODE || '').toUpperCase();
            var ten = (item.TEN || item.NAME || '').toLowerCase();
            // Theo mã
            if (ma === 'DANGHOC' || ten.indexOf('đang học') >= 0)
                return { icon: 'fa-duotone fa-solid fa-screen-users', modul: 'modul-item-3' };
            if (ma === 'TOTNGHIEP' || ma === 'DATOTNGHIEP' || ten.indexOf('tốt nghiệp') >= 0)
                return { icon: 'fa-duotone fa-solid fa-graduation-cap', iconStyle: 'color:#22b06a;background:rgba(34,176,106,.18)' };
            if (ma === 'BAOLUU' || ma === 'TAMDUNG' || ten.indexOf('bảo lưu') >= 0 || ten.indexOf('tạm dừng') >= 0)
                return { icon: 'fa-duotone fa-solid fa-user-clock', modul: 'modul-item-2' };
            if (ma === 'THOIHOC' || ten.indexOf('thôi học') >= 0 || ten.indexOf('buộc thôi') >= 0)
                return { icon: 'fa-duotone fa-solid fa-user-xmark', modul: 'modul-item-4' };
            if (ma === 'CANHBAO' || ten.indexOf('cảnh báo') >= 0)
                return { icon: 'fa-duotone fa-solid fa-triangle-exclamation', modul: 'modul-item-4' };
            // Default
            return { icon: 'fa-duotone fa-solid fa-user-tag', iconStyle: 'color:#3380db;background:rgba(51,128,219,.18)' };
        };

        var html = '';

        // Card 1: TỔNG SINH VIÊN (luôn đầu, sum client side)
        html += renderCard({
            icon: 'fa-duotone fa-solid fa-users',
            name: fmt(tongSV),
            unit: '100% tổng số'
        });

        // Cards N: từng trạng thái trong rs
        data.forEach(function (item) {
            var soNguoi = Number(item.SoNguoi || item.SONGUOI || 0) || 0;
            var ten = item.TEN || item.NAME || 'Trạng thái';
            var pt = tongSV > 0 ? ((soNguoi * 100 / tongSV).toFixed(1) + '%') : '0%';
            var iconInfo = pickIconStyle(item);
            html += renderCard({
                icon: iconInfo.icon,
                modulClass: iconInfo.modul || '',
                iconStyle: iconInfo.iconStyle || '',
                name: fmt(soNguoi),
                unit: '<span>' + pt + '</span> · ' + ten
            });
        });

        // Card cố định: CÔNG NỢ TÀI CHÍNH (placeholder, data gán sau)
        html += renderCard({
            icon: 'fa-duotone fa-solid fa-circle-dollar',
            iconStyle: 'color:#e6a700;background:rgba(230,167,0,.18)',
            name: '<span id="lblCongNo">0</span><u>đ</u>',
            unit: '<span id="lblCongNo_SV">0 sinh viên</span>'
        });

        // Card cố định: CẢNH BÁO HỌC VỤ (placeholder, data gán sau)
        html += renderCard({
            icon: 'fa-duotone fa-solid fa-triangle-exclamation',
            modulClass: 'modul-item-4',
            name: '<span id="lblCanhBao">0</span>',
            unit: '<span id="lblCanhBao_PT">0%</span> · Cảnh báo học vụ'
        });

        $("#zoneStatistic").html(html);
    },

    /*------------------------------------------
    --Discription: [2] Hồ sơ sinh viên
    -------------------------------------------*/
    loadHoSo_SinhVien: function () {
        var me = this;
        var aData = me.aSinhVien || {};
        var dash = '<span class="color-888">—</span>';
        // Avatar: chỉ thay icon bằng ảnh thật nếu backend trả về URL hợp lệ
        var avatarUrl = edu.util.returnEmpty(aData.ANHTHE) || edu.util.returnEmpty(aData.AVATAR_URL) || edu.util.returnEmpty(aData.PORTRAIT_URL);
        if (avatarUrl && avatarUrl.length > 5) {
            $("#zoneSV_Avatar").html('<img src="' + avatarUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">');
        } else {
            $("#zoneSV_Avatar").html('<i class="fa-light fa-user-graduate"></i>');
        }
        var v = function (val) { return edu.util.returnEmpty(val) || dash; };
        $("#lblSV_HoTen").html(v(aData.FULL_NAME || aData.SINHVIEN_TENDAYDU || aData.HO_TEN));
        $("#lblSV_Lop").html(v(aData.LOPQUANLY_TEN || aData.LOPQUANLY_MA));
        $("#lblSV_Khoa").html(v(aData.KHOAQUANLY_TEN));
        $("#lblSV_NgaySinh").html(v(aData.NGAYSINH_DD_MM_YYYY || aData.DATE_OF_BIRTH || aData.NGAY_SINH));
        $("#lblSV_CCCD").html(v(aData.DINHDANH_CHINH_SO || aData.CCCD || aData.IDENTIFIER_NO));
        $("#lblSV_Email").html(v(aData.EMAIL));
    },

    /*------------------------------------------
    --Discription: Bê block "Bảng điểm" từ cổng SV (modules/hoctap/html/diemhoc.html)
    --vào section trong modal "Xem hồ sơ".
    --Cơ chế:
    -- 1) Set me.strSinhVien_QLSV_Id để diemhoc.js (đã sửa resolveNguoiHocId) nhận biết
    -- 2) Fetch HTML diemhoc.html, inject vào #zoneDiemHoc_Embed
    -- 3) Load diemhoc.js (1 lần, cache lại), gọi init() trên instance mới
    -------------------------------------------*/
    embedDiemHoc: function (aData) {
        var me = this;
        if (typeof DiemHoc !== 'function') {
            $("#zoneDiemHoc_Embed").prepend('<div class="alert alert-warning">Class DiemHoc chưa được tải.</div>');
            return;
        }
        // BƯỚC 1: Lookup QLSV_NGUOIHOC_ID từ MA_NGUOIHOC (schema cũ)
        // Vì các API diemhoc (pkg_congthongtin_hssv_thongtin) dùng schema cũ
        // với UUID QLSV_NGUOIHOC.ID khác CORE_PERSON_ID/STUDY_ID của schema mới
        var maNH = (aData || {}).MA_NGUOIHOC_CHINH || (aData || {}).MA_NGUOIHOC_PHU || '';
        if (!maNH) {
            $("#zoneDiemHoc_Embed").prepend('<div class="alert alert-warning">Không có Mã NH để lookup QLSV_NGUOIHOC_ID</div>');
            return;
        }

        me.lookupQLSVId(maNH, function (qlsvId, matchedRecord) {
            if (!qlsvId) {
                $("#zoneDiemHoc_Embed").prepend('<div class="alert alert-warning">Không tìm thấy QLSV_NGUOIHOC_ID cho mã ' + maNH + ' — SV này có thể chưa có dữ liệu trong schema cũ</div>');
                return;
            }
            if (window.main_doc && main_doc.DaQHHT) {
                main_doc.DaQHHT.strSinhVien_QLSV_Id = qlsvId;
            }
            console.log('[embedDiemHoc] Resolved QLSV_NGUOIHOC_ID =', qlsvId, 'cho MA =', maNH);

            try {
                if (typeof window.main_beta === 'undefined') window.main_beta = {};
                main_beta.DiemHoc = new DiemHoc();
                main_beta.DiemHoc.init();
            } catch (e) {
                console.error('[embedDiemHoc] init error:', e);
            }
        });
    },

    /*------------------------------------------
    --Discription: Lookup QLSV_NGUOIHOC_ID (schema cũ) từ Mã sinh viên
    --Origin: pkg_hosohocvien.LayDanhSachHoSoNhieuNganh
    --(Đây là API chuẩn của hệ thống dùng để tìm SV theo mã)
    -------------------------------------------*/
    lookupQLSVId: function (maNH, callback) {
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': maNH,
            'strNamNhapHoc': '',
            'strKhoaQuanLy_Id': '',
            'strHeDaoTao_Id': '',
            'strKhoaDaoTao_Id': '',
            'strChuongTrinh_Id': '',
            'strLopQuanLy_Id': '',
            'strTrangThaiNguoiHoc_Id': '',
            'strChucNang_Id': edu.system.strChucNang_Id || '',
            'strNguoiTao_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 5,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Data && data.Data.length > 0) {
                    // Tìm bản ghi khớp đúng MA (ưu tiên), fallback record đầu
                    var match = data.Data.find(function (e) {
                        return (e.QLSV_NGUOIHOC_MASO || '').toString().trim() === maNH.toString().trim();
                    }) || data.Data[0];
                    console.log('[lookupQLSVId] matched record =', match);
                    console.log('[lookupQLSVId] keys =', Object.keys(match));
                    // Ưu tiên QLSV_NGUOIHOC_ID (schema cũ thực sự), fallback ID
                    var qlsvId = match.QLSV_NGUOIHOC_ID || match.ID;
                    console.log('[lookupQLSVId] chosen ID =', qlsvId,
                        '| ID=', match.ID,
                        '| QLSV_NGUOIHOC_ID=', match.QLSV_NGUOIHOC_ID,
                        '| CORE_PERSON_ID=', match.CORE_PERSON_ID);
                    callback(qlsvId, match);
                } else {
                    callback(null, null);
                }
            },
            error: function (er) {
                console.error('[lookupQLSVId] error:', er);
                callback(null, null);
            },
            type: "POST", action: obj_save.action,
            contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: SECTION CHỈNH SỬA HỒ SƠ TRONG MODAL (XEM HỒ SƠ)
    --Render 2 phần editable: Thông tin cơ bản + Hồ sơ-chính sách
    --Sử dụng prefix Mdl_ cho IDs để không xung đột với form ở tab KTĐD
    -------------------------------------------*/
    renderModal_FullProfile: function (aData) {
        var me = this;
        // Lưu vào biến riêng (giống aKhoiTaoDinhDanh nhưng cho modal context)
        me.aModalProfile = aData ? Object.assign({}, aData) : {};
        me.renderModal_ThongTinCoBan(me.aModalProfile);
        me.renderModal_HoSoChinhSach(me.aModalProfile);
        // Fetch profile thật từ server để cập nhật form hồ sơ-chính sách
        var strPersonId = me.aModalProfile.CORE_PERSON_ID || me.aModalProfile.PERSON_ID;
        if (strPersonId) {
            me.getInfo_HoSoChinhSach_Modal(strPersonId);
        }

        // Set person_id cho các tab Quá trình
        me.strProcessPerson_Id = strPersonId || '';
        // Auto-load tab đang active (mặc định là tab "Địa chỉ")
        me.loadPersonProcessTab('DiaChi');
    },

    /*============================================================
    ===== PERSON PROCESS - CRUD 7 TAB QUÁ TRÌNH (config-driven) =====
    --Reuse cùng PKG_CORE_HOSONHANSU_06 như module nhân sự
    --Cấu trúc: 1 config + 4 hàm generic phục vụ tất cả 7 entities
    ============================================================*/
    _processConfig: {
        'DiaChi': {
            title: 'Địa chỉ', icon: 'fa-map-marker-alt', tabZoneId: 'qtm_diachi',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Address' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Address' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Address' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4AJSUzJDIy', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Address' }
            },
            columns: [
                { key: 'ADDRESS_TYPE_CODE_NAME', label: 'Loại', fallback: ['ADDRESS_TYPE_NAME', 'ADDRESS_TYPE_CODE'] },
                { key: 'FULL_ADDRESS', label: 'Địa chỉ đầy đủ', fallback: ['ADDRESS_LINE1'] },
                { key: 'IS_PRIMARY', label: 'Chính', center: true, render: function (v) { return v == 1 ? '<i class="fal fa-star color-yellow"></i>' : ''; } }
            ],
            fields: [
                { name: 'strAddress_Type_Code', label: 'Loại địa chỉ (Code)', type: 'text', from: 'ADDRESS_TYPE_CODE', col: 6 },
                { name: 'strAddress_Status_Code', label: 'Trạng thái (Code)', type: 'text', from: 'ADDRESS_STATUS_CODE', col: 6 },
                { name: 'strCountry_Id', label: 'Quốc gia ID', type: 'text', from: 'COUNTRY_ID', col: 4 },
                { name: 'strProvince_Id', label: 'Tỉnh ID', type: 'text', from: 'PROVINCE_ID', col: 4 },
                { name: 'strWard_Id', label: 'Phường/Xã ID', type: 'text', from: 'WARD_ID', col: 4 },
                { name: 'strAddress_Line1', label: 'Dòng 1', type: 'text', from: 'ADDRESS_LINE1', col: 6 },
                { name: 'strAddress_Line2', label: 'Dòng 2', type: 'text', from: 'ADDRESS_LINE2', col: 6 },
                { name: 'strFull_Address', label: 'Địa chỉ đầy đủ', type: 'text', from: 'FULL_ADDRESS', col: 12 },
                { name: 'strPostal_Code', label: 'Mã bưu chính', type: 'text', from: 'POSTAL_CODE', col: 6 },
                { name: 'dIs_Primary', label: 'Là địa chỉ chính', type: 'checkbox', from: 'IS_PRIMARY', col: 6 },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 6, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 6, placeholder: 'dd/mm/yyyy' },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'GiaDinh': {
            title: 'Gia đình', icon: 'fa-users', tabZoneId: 'qtm_giadinh',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Family' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Family' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Family' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4HICwoLTgP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Family' }
            },
            columns: [
                { key: 'RELATIONSHIP_NAME', label: 'Quan hệ', fallback: ['RELATIONSHIP_CODE'] },
                { key: 'FULL_NAME', label: 'Họ và tên' },
                { key: 'PHONE_NUMBER', label: 'SĐT' },
                { key: 'OCCUPATION', label: 'Nghề nghiệp' }
            ],
            fields: [
                { name: 'strRelationship_Code', label: 'Mã quan hệ', type: 'text', from: 'RELATIONSHIP_CODE', col: 6 },
                { name: 'strFull_Name', label: 'Họ và tên', type: 'text', from: 'FULL_NAME', col: 6, required: true },
                { name: 'strGender_Code', label: 'Giới tính (Code)', type: 'text', from: 'GENDER_CODE', col: 4 },
                { name: 'strDate_Of_Birth', label: 'Ngày sinh', type: 'text', from: 'DATE_OF_BIRTH', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strOccupation', label: 'Nghề nghiệp', type: 'text', from: 'OCCUPATION', col: 4 },
                { name: 'strPhone_Number', label: 'Số điện thoại', type: 'text', from: 'PHONE_NUMBER', col: 6 },
                { name: 'strEmail', label: 'Email', type: 'text', from: 'EMAIL', col: 6 },
                { name: 'strIdentity_Number', label: 'Số CCCD', type: 'text', from: 'IDENTITY_NUMBER', col: 6 },
                { name: 'strWorkplace', label: 'Nơi làm việc', type: 'text', from: 'WORKPLACE', col: 6 },
                { name: 'strAddress', label: 'Địa chỉ', type: 'text', from: 'ADDRESS', col: 12 },
                { name: 'dIs_Emergency_Contact', label: 'Liên hệ khẩn cấp', type: 'checkbox', from: 'IS_EMERGENCY_CONTACT', col: 6 },
                { name: 'dIs_Dependent', label: 'Người phụ thuộc', type: 'checkbox', from: 'IS_DEPENDENT', col: 6 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'TKNH': {
            title: 'Tài khoản ngân hàng', icon: 'fa-university', tabZoneId: 'qtm_tknh',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Bank_Account' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Bank_Account' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Bank_Account' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4DIC8qHgAiIi40LzUP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Bank_Account' }
            },
            columns: [
                { key: 'BANK_NAME', label: 'Ngân hàng', fallback: ['BANK_CODE'] },
                { key: 'ACCOUNT_NUMBER', label: 'Số tài khoản' },
                { key: 'ACCOUNT_HOLDER', label: 'Chủ TK' },
                { key: 'IS_PRIMARY', label: 'Chính', center: true, render: function (v) { return v == 1 ? '<i class="fal fa-star color-yellow"></i>' : ''; } }
            ],
            fields: [
                { name: 'strBank_Code', label: 'Mã ngân hàng', type: 'text', from: 'BANK_CODE', col: 6 },
                { name: 'strBank_Name', label: 'Tên ngân hàng', type: 'text', from: 'BANK_NAME', col: 6, required: true },
                { name: 'strAccount_Number', label: 'Số tài khoản', type: 'text', from: 'ACCOUNT_NUMBER', col: 6, required: true },
                { name: 'strAccount_Holder', label: 'Chủ tài khoản', type: 'text', from: 'ACCOUNT_HOLDER', col: 6 },
                { name: 'strBranch_Name', label: 'Chi nhánh', type: 'text', from: 'BRANCH_NAME', col: 6 },
                { name: 'strSwift_Code', label: 'SWIFT/BIC', type: 'text', from: 'SWIFT_CODE', col: 6 },
                { name: 'strCurrency_Code', label: 'Loại tiền', type: 'text', from: 'CURRENCY_CODE', col: 4, placeholder: 'VND' },
                { name: 'strAccount_Type_Code', label: 'Loại TK', type: 'text', from: 'ACCOUNT_TYPE_CODE', col: 4 },
                { name: 'dIs_Primary', label: 'TK chính', type: 'checkbox', from: 'IS_PRIMARY', col: 4 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'HocVan': {
            title: 'Học vấn', icon: 'fa-graduation-cap', tabZoneId: 'qtm_hocvan',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Education' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Education' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Education' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4EJTQiIDUoLi8P', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Education' }
            },
            columns: [
                { key: 'EDUCATION_LEVEL_NAME', label: 'Trình độ', fallback: ['EDUCATION_LEVEL_CODE'] },
                { key: 'SCHOOL_NAME', label: 'Trường' },
                { key: 'MAJOR', label: 'Ngành' },
                { key: 'GRADUATION_YEAR', label: 'Năm TN' }
            ],
            fields: [
                { name: 'strEducation_Level_Code', label: 'Trình độ (Code)', type: 'text', from: 'EDUCATION_LEVEL_CODE', col: 6 },
                { name: 'strSchool_Name', label: 'Tên trường', type: 'text', from: 'SCHOOL_NAME', col: 6, required: true },
                { name: 'strMajor', label: 'Ngành học', type: 'text', from: 'MAJOR', col: 6 },
                { name: 'strDegree_Type_Code', label: 'Loại bằng (Code)', type: 'text', from: 'DEGREE_TYPE_CODE', col: 6 },
                { name: 'strGraduation_Year', label: 'Năm tốt nghiệp', type: 'text', from: 'GRADUATION_YEAR', col: 4 },
                { name: 'strStart_Year', label: 'Năm bắt đầu', type: 'text', from: 'START_YEAR', col: 4 },
                { name: 'strGpa', label: 'GPA', type: 'text', from: 'GPA', col: 4 },
                { name: 'strClassification_Code', label: 'Xếp loại (Code)', type: 'text', from: 'CLASSIFICATION_CODE', col: 6 },
                { name: 'strTraining_Form_Code', label: 'Hình thức ĐT (Code)', type: 'text', from: 'TRAINING_FORM_CODE', col: 6 },
                { name: 'strThesis_Title', label: 'Đề tài LV/LA', type: 'text', from: 'THESIS_TITLE', col: 12 },
                { name: 'dIs_Primary', label: 'Chính', type: 'checkbox', from: 'IS_PRIMARY', col: 6 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'ChungChi': {
            title: 'Chứng chỉ', icon: 'fa-certificate', tabZoneId: 'qtm_chungchi',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Certificate' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Certificate' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Certificate' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4CJDM1KCcoIiA1JAPP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Certificate' }
            },
            columns: [
                { key: 'CERTIFICATE_NAME', label: 'Tên chứng chỉ' },
                { key: 'CERTIFICATE_TYPE_NAME', label: 'Loại', fallback: ['CERTIFICATE_TYPE_CODE'] },
                { key: 'ISSUE_DATE', label: 'Ngày cấp' },
                { key: 'ISSUE_ORG', label: 'Đơn vị cấp' }
            ],
            fields: [
                { name: 'strCertificate_Type_Code', label: 'Loại CC (Code)', type: 'text', from: 'CERTIFICATE_TYPE_CODE', col: 6 },
                { name: 'strCertificate_Name', label: 'Tên chứng chỉ', type: 'text', from: 'CERTIFICATE_NAME', col: 6, required: true },
                { name: 'strCertificate_No', label: 'Số chứng chỉ', type: 'text', from: 'CERTIFICATE_NO', col: 6 },
                { name: 'strIssue_Org', label: 'Đơn vị cấp', type: 'text', from: 'ISSUE_ORG', col: 6 },
                { name: 'strIssue_Date', label: 'Ngày cấp', type: 'text', from: 'ISSUE_DATE', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strLevel_Code', label: 'Mức độ (Code)', type: 'text', from: 'LEVEL_CODE', col: 4 },
                { name: 'strScore', label: 'Điểm', type: 'text', from: 'SCORE', col: 4 },
                { name: 'strFile_Id', label: 'File ID', type: 'text', from: 'FILE_ID', col: 4 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'TaiLieu': {
            title: 'Tài liệu', icon: 'fa-file-alt', tabZoneId: 'qtm_tailieu',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Document' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Document' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Document' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4FLiI0LCQvNQPP', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Document' }
            },
            columns: [
                { key: 'DOCUMENT_TYPE_NAME', label: 'Loại', fallback: ['DOCUMENT_TYPE_CODE'] },
                { key: 'DOCUMENT_NAME', label: 'Tên tài liệu' },
                { key: 'DOCUMENT_NO', label: 'Số' },
                { key: 'ISSUE_DATE', label: 'Ngày cấp' }
            ],
            fields: [
                { name: 'strDocument_Type_Code', label: 'Loại TL (Code)', type: 'text', from: 'DOCUMENT_TYPE_CODE', col: 6 },
                { name: 'strDocument_Name', label: 'Tên tài liệu', type: 'text', from: 'DOCUMENT_NAME', col: 6, required: true },
                { name: 'strDocument_No', label: 'Số tài liệu', type: 'text', from: 'DOCUMENT_NO', col: 6 },
                { name: 'strIssue_Org', label: 'Đơn vị cấp', type: 'text', from: 'ISSUE_ORG', col: 6 },
                { name: 'strIssue_Date', label: 'Ngày cấp', type: 'text', from: 'ISSUE_DATE', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strFile_Id', label: 'File ID', type: 'text', from: 'FILE_ID', col: 6 },
                { name: 'strDescription', label: 'Mô tả', type: 'textarea', from: 'DESCRIPTION', col: 12 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        },
        'HocHam': {
            title: 'Học hàm', icon: 'fa-award', tabZoneId: 'qtm_hocham',
            ep: {
                list: { a: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Get_Person_Academic_Rank' },
                ins:  { a: 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Ins_Person_Academic_Rank' },
                upd:  { a: 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Upd_Person_Academic_Rank' },
                del:  { a: 'NS_HoSoNhanSu6_MH/BSQtHhEkMzIuLx4AIiAlJCwoIh4TIC8q', f: 'PKG_CORE_HOSONHANSU_06.Del_Person_Academic_Rank' }
            },
            columns: [
                { key: 'ACADEMIC_RANK_NAME', label: 'Học hàm', fallback: ['ACADEMIC_RANK_CODE'] },
                { key: 'DECISION_NO', label: 'Số QĐ' },
                { key: 'DECISION_DATE', label: 'Ngày QĐ' },
                { key: 'ISSUE_ORG', label: 'Đơn vị cấp' }
            ],
            fields: [
                { name: 'strAcademic_Rank_Code', label: 'Học hàm (Code)', type: 'text', from: 'ACADEMIC_RANK_CODE', col: 6 },
                { name: 'strDecision_No', label: 'Số quyết định', type: 'text', from: 'DECISION_NO', col: 6 },
                { name: 'strDecision_Date', label: 'Ngày QĐ', type: 'text', from: 'DECISION_DATE', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_From', label: 'Hiệu lực từ', type: 'text', from: 'EFFECTIVE_FROM', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strEffective_To', label: 'Hiệu lực đến', type: 'text', from: 'EFFECTIVE_TO', col: 4, placeholder: 'dd/mm/yyyy' },
                { name: 'strIssue_Org', label: 'Đơn vị cấp', type: 'text', from: 'ISSUE_ORG', col: 12 },
                { name: 'strNote', label: 'Ghi chú', type: 'textarea', from: 'NOTE', col: 12 }
            ]
        }
    },

    /*--- Load 1 tab quá trình: gọi API, lọc theo person_id, render table ---*/
    loadPersonProcessTab: function (entityKey) {
        var me = this;
        var cfg = me._processConfig[entityKey];
        if (!cfg) return;
        var personId = me.strProcessPerson_Id;
        var $zone = $('#' + cfg.tabZoneId);
        if (!personId) {
            $zone.html('<div class="color-888 text-center pt-20 pb-20">Chưa xác định người học</div>');
            return;
        }
        $zone.html('<div class="text-center color-888 pt-20 pb-20"><i class="fa-light fa-spinner fa-spin me-1"></i> Đang tải ' + cfg.title.toLowerCase() + '...</div>');

        var obj_save = {
            'action': cfg.ep.list.a,
            'func': cfg.ep.list.f,
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id || edu.system.chucNangHeThong_Id || '',
            'strVaiTro_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': personId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    $zone.html('<div class="alert alert-warning">Lỗi: ' + edu.util.returnEmpty(data.Message) + '</div>');
                    return;
                }
                var rows = (data.Data || []).filter(function (r) {
                    var okPerson = (r.PERSON_ID == personId) || !r.PERSON_ID;
                    var okActive = (r.IS_ACTIVE === undefined) || (r.IS_ACTIVE == 1);
                    return okPerson && okActive;
                });
                me['_dt_PP_' + entityKey] = rows;
                me.renderPersonProcessTable(entityKey, rows);
            },
            error: function (er) {
                $zone.html('<div class="alert alert-danger fz13">Không tải được dữ liệu: ' + JSON.stringify(er).slice(0, 200) + '</div>');
            },
            type: 'POST', action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    /*--- Render bảng (table view) + nút Thêm mới ---*/
    renderPersonProcessTable: function (entityKey, rows) {
        var me = this;
        var cfg = me._processConfig[entityKey];
        var html = '';
        html += '<div class="d-flex justify-content-between align-items-center mb-10 flex-wrap gap-2" style="padding-right:8px;">';
        html += '  <h5 class="fz14 color-blue mb-0"><i class="fa-light ' + cfg.icon + ' me-1"></i> Danh sách ' + cfg.title + ' <span class="color-888 fz12">(' + (rows ? rows.length : 0) + ')</span></h5>';
        html += '  <button type="button" class="btn btn-primary btnAddPP" data-entity="' + entityKey + '" style="white-space:nowrap; padding:6px 14px; font-size:13px; box-shadow:0 2px 4px rgba(51,128,219,.25);">';
        html += '    <i class="fal fa-plus me-1"></i> Thêm ' + cfg.title.toLowerCase();
        html += '  </button>';
        html += '</div>';

        if (!rows || rows.length === 0) {
            html += '<div class="text-center color-888 pt-15 pb-15" style="background:#fafafa;border-radius:8px;border:1px dashed #ddd;">';
            html += '  <i class="fa-light ' + cfg.icon + ' fz24 d-block mb-2"></i>';
            html += '  <div>Chưa có ' + cfg.title.toLowerCase() + '. Bấm <b>"Thêm ' + cfg.title.toLowerCase() + '"</b> để bắt đầu.</div>';
            html += '</div>';
        } else {
            html += '<div class="table-responsive"><table class="table table-bordered table-sm fz13">';
            html += '<thead><tr style="background:#f0f6ff;"><th class="text-center" style="width:40px;">#</th>';
            cfg.columns.forEach(function (c) {
                html += '<th' + (c.center ? ' class="text-center"' : '') + '>' + c.label + '</th>';
            });
            html += '<th class="text-center" style="width:100px;">Hành động</th></tr></thead>';
            html += '<tbody>';
            rows.forEach(function (r, idx) {
                var rowId = r.ID || r.id;
                html += '<tr>';
                html += '<td class="text-center">' + (idx + 1) + '</td>';
                cfg.columns.forEach(function (c) {
                    var v = r[c.key];
                    if ((v === undefined || v === null || v === '') && c.fallback) {
                        for (var i = 0; i < c.fallback.length; i++) {
                            if (r[c.fallback[i]] !== undefined && r[c.fallback[i]] !== null && r[c.fallback[i]] !== '') {
                                v = r[c.fallback[i]];
                                break;
                            }
                        }
                    }
                    if (c.render) v = c.render(v);
                    html += '<td' + (c.center ? ' class="text-center"' : '') + '>' + edu.util.returnEmpty(v) + '</td>';
                });
                html += '<td class="text-center">';
                html += '<button class="btn btn-default btn-sm btnEditPP me-1" data-entity="' + entityKey + '" data-id="' + rowId + '" title="Sửa"><i class="fal fa-pen"></i></button>';
                html += '<button class="btn btn-delete btn-sm btnDelPP" data-entity="' + entityKey + '" data-id="' + rowId + '" title="Xóa"><i class="fal fa-trash"></i></button>';
                html += '</td></tr>';
            });
            html += '</tbody></table></div>';
        }
        $('#' + cfg.tabZoneId).html(html);
    },

    /*--- Mở form Thêm/Sửa (inline) ---*/
    openPersonProcessForm: function (entityKey, rowId) {
        var me = this;
        var cfg = me._processConfig[entityKey];
        var rowData = null;
        if (rowId) {
            rowData = (me['_dt_PP_' + entityKey] || []).find(function (r) {
                return (r.ID || r.id) == rowId;
            });
        }
        var isEdit = !!rowData;

        var html = '';
        html += '<div class="box box-solid pd10" style="background:#fafbfd;border:1px solid #d4e3f9;border-radius:8px;">';
        html += '  <div class="d-flex justify-content-between align-items-center mb-10">';
        html += '    <h5 class="fz15 color-blue mb-0"><i class="fa-light ' + (isEdit ? 'fa-pen' : 'fa-plus') + ' me-1"></i> ' + (isEdit ? 'Sửa' : 'Thêm') + ' ' + cfg.title.toLowerCase() + '</h5>';
        html += '    <button type="button" class="btn btn-default btn-sm btnCancelPP" data-entity="' + entityKey + '"><i class="fal fa-times me-1"></i> Hủy</button>';
        html += '  </div>';
        html += '  <div class="row">';
        cfg.fields.forEach(function (f) {
            var v = rowData ? edu.util.returnEmpty(rowData[f.from]) : '';
            var inputId = 'ppfld_' + entityKey + '_' + f.name;
            var col = f.col || 12;
            html += '<div class="col-12 col-md-' + col + ' mb-10">';
            html += '  <label class="form-label fz13 color-888 mb-1">' + f.label + (f.required ? ' <span class="text-danger">*</span>' : '') + '</label>';
            if (f.type === 'textarea') {
                html += '  <textarea class="form-control" id="' + inputId + '" rows="2">' + v + '</textarea>';
            } else if (f.type === 'checkbox') {
                var checked = (v == 1 || v == '1' || v === true) ? 'checked' : '';
                html += '  <div class="form-check mt-1"><input type="checkbox" class="form-check-input" id="' + inputId + '" ' + checked + '><label class="form-check-label fz13" for="' + inputId + '">Có</label></div>';
            } else {
                html += '  <input type="text" class="form-control" id="' + inputId + '" value="' + v + '"' + (f.placeholder ? ' placeholder="' + f.placeholder + '"' : '') + '>';
            }
            html += '</div>';
        });
        html += '  </div>';
        html += '  <div class="d-flex justify-content-end gap-2 mt-10">';
        html += '    <button type="button" class="btn btn-default btnCancelPP" data-entity="' + entityKey + '">Hủy</button>';
        html += '    <button type="button" class="btn btn-primary btnSavePP" data-entity="' + entityKey + '" data-id="' + (rowId || '') + '"><i class="fal fa-save me-1"></i> ' + (isEdit ? 'Cập nhật' : 'Lưu') + '</button>';
        html += '  </div>';
        html += '</div>';
        $('#' + cfg.tabZoneId).html(html);
    },

    /*--- Lưu form (Insert/Update) ---*/
    savePersonProcessForm: function (entityKey, rowId) {
        var me = this;
        var cfg = me._processConfig[entityKey];
        var isEdit = !!rowId;

        // Validate required
        for (var i = 0; i < cfg.fields.length; i++) {
            var f = cfg.fields[i];
            if (f.required) {
                var v = edu.util.getValById('ppfld_' + entityKey + '_' + f.name);
                if (!v) {
                    edu.system.alert('Vui lòng nhập "' + f.label + '"', 'w');
                    return;
                }
            }
        }

        // Build payload
        var obj_save = {
            'action': isEdit ? cfg.ep.upd.a : cfg.ep.ins.a,
            'func': isEdit ? cfg.ep.upd.f : cfg.ep.ins.f,
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id || edu.system.chucNangHeThong_Id || '',
            'strVaiTro_Id': '',
            'strPerson_Id': me.strProcessPerson_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dIs_Active': 1
        };
        if (isEdit) {
            obj_save.Id = (rowId + '').toUpperCase();
            obj_save.strId = (rowId + '').toUpperCase();
        }
        cfg.fields.forEach(function (f) {
            var inputId = 'ppfld_' + entityKey + '_' + f.name;
            if (f.type === 'checkbox') {
                obj_save[f.name] = $('#' + inputId).is(':checked') ? 1 : 0;
            } else {
                obj_save[f.name] = edu.util.returnEmpty(edu.util.getValById(inputId));
            }
        });

        // Confirm trước khi gọi API (dùng template hoành tráng)
        var summaryItems = cfg.fields.filter(function (f) { return f.type !== 'checkbox'; }).map(function (f) {
            return { label: f.label, value: obj_save[f.name] };
        });
        me.showFancyConfirm({
            title: (isEdit ? 'Cập nhật' : 'Thêm mới') + ' ' + cfg.title.toLowerCase(),
            icon: cfg.icon,
            subject: {
                name: (me.aSinhVien || me.aModalProfile || {}).FULL_NAME || (me.aSinhVien || me.aModalProfile || {}).HO_TEN || 'Người học',
                extra: [{ label: 'Mã NH', value: (me.aSinhVien || me.aModalProfile || {}).MA_NGUOIHOC_CHINH || (me.aSinhVien || me.aModalProfile || {}).MA_NGUOI_HOC || '' }]
            },
            sections: [{
                title: cfg.title,
                color: isEdit ? 'green' : 'blue',
                items: summaryItems
            }],
            actionLabel: (isEdit ? 'Cập nhật' : 'Thêm mới') + ' ' + cfg.title.toLowerCase(),
            requireCheckbox: false,
            onConfirm: function () {
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            edu.system.alert((isEdit ? 'Cập nhật' : 'Thêm') + ' ' + cfg.title.toLowerCase() + ' thành công', 's');
                            me.loadPersonProcessTab(entityKey);
                        } else {
                            edu.system.alert(obj_save.action + ' : ' + data.Message, 's');
                        }
                    },
                    error: function (er) { edu.system.alert(obj_save.action + ' (er): ' + JSON.stringify(er), 'w'); },
                    type: 'POST', action: obj_save.action, contentType: true, data: obj_save, fakedb: []
                }, false, false, false, null);
            }
        });
    },

    /*--- Xóa (soft delete) ---*/
    deletePersonProcess: function (entityKey, rowId) {
        var me = this;
        var cfg = me._processConfig[entityKey];
        var rowData = (me['_dt_PP_' + entityKey] || []).find(function (r) { return (r.ID || r.id) == rowId; });
        var firstColValue = rowData && cfg.columns[0] ? rowData[cfg.columns[0].key] : '';

        me.showFancyConfirm({
            title: 'Xóa ' + cfg.title.toLowerCase(),
            icon: 'fa-trash',
            warningText: 'Bản ghi sẽ bị ẩn khỏi danh sách (soft delete). Hành động này có thể được hệ thống ghi log.',
            subject: {
                name: edu.util.returnEmpty(firstColValue) || 'Bản ghi #' + rowId
            },
            sections: [{
                title: 'Thông tin sẽ xóa',
                color: 'red',
                items: [
                    { label: 'Loại', value: cfg.title },
                    { label: 'ID', value: rowId }
                ]
            }],
            actionLabel: 'Xóa bản ghi',
            requireCheckbox: true,
            onConfirm: function () {
                var obj_save = {
                    'action': cfg.ep.del.a,
                    'func': cfg.ep.del.f,
                    'iM': edu.system.iM,
                    'Id': (rowId + '').toUpperCase(),
                    'strId': (rowId + '').toUpperCase(),
                    'strChucNang_Id': edu.system.strChucNang_Id || '',
                    'strVaiTro_Id': '',
                    'strNguoiThucHien_Id': edu.system.userId
                };
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            edu.system.alert('Xóa thành công', 's');
                            me.loadPersonProcessTab(entityKey);
                        } else edu.system.alert(obj_save.action + ' : ' + data.Message, 's');
                    },
                    error: function (er) { edu.system.alert(obj_save.action + ' (er): ' + JSON.stringify(er), 'w'); },
                    type: 'POST', action: obj_save.action, contentType: true, data: obj_save, fakedb: []
                }, false, false, false, null);
            }
        });
    },

    renderModal_ThongTinCoBan: function (aData) {
        var me = this;
        var genderOptions = '<option value="">-- Chọn giới tính --</option>';
        (me.dtGioiTinh || []).forEach(function (g) {
            var selected = (g.ID === aData.GIOI_TINH_ID || g.ID === aData.GENDER_ID) ? 'selected' : '';
            genderOptions += '<option value="' + g.ID + '" ' + selected + '>' + edu.util.returnEmpty(g.TEN) + '</option>';
        });

        var html = '';
        // View header (chỉ đọc) - hiện toàn bộ thông tin tổng quan SV
        html += me._buildViewHeader(aData);
        html += '<div class="row">';
        html += '  <div class="col-12 col-md-6 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Mã người học</label>';
        html += '    <input type="text" class="form-control" value="' + (edu.util.returnEmpty(aData.MA_NGUOI_HOC) || edu.util.returnEmpty(aData.MA_NGUOIHOC_CHINH)) + '" readonly>';
        html += '  </div>';
        html += '  <div class="col-12 col-md-6 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Họ và tên đầy đủ <span class="text-danger">*</span></label>';
        html += '    <input type="text" class="form-control" id="txtMdl_FullName" value="' + (edu.util.returnEmpty(aData.FULL_NAME) || edu.util.returnEmpty(aData.HO_TEN)) + '">';
        html += '  </div>';
        html += '  <div class="col-12 col-md-4 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Họ</label>';
        html += '    <input type="text" class="form-control" id="txtMdl_LastName" value="' + edu.util.returnEmpty(aData.LAST_NAME) + '">';
        html += '  </div>';
        html += '  <div class="col-12 col-md-4 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Tên đệm</label>';
        html += '    <input type="text" class="form-control" id="txtMdl_MiddleName" value="' + edu.util.returnEmpty(aData.MIDDLE_NAME) + '">';
        html += '  </div>';
        html += '  <div class="col-12 col-md-4 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Tên</label>';
        html += '    <input type="text" class="form-control" id="txtMdl_FirstName" value="' + edu.util.returnEmpty(aData.FIRST_NAME) + '">';
        html += '  </div>';
        html += '  <div class="col-12 col-md-6 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Ngày sinh (dd/mm/yyyy)</label>';
        html += '    <input type="text" class="form-control" id="txtMdl_DateOfBirth" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.NGAYSINH_DD_MM_YYYY) || edu.util.returnEmpty(aData.NGAY_SINH) || edu.util.returnEmpty(aData.DATE_OF_BIRTH)) + '">';
        html += '  </div>';
        html += '  <div class="col-12 col-md-6 mb-10">';
        html += '    <label class="form-label fz14 color-888 mb-1">Giới tính</label>';
        html += '    <select class="form-select" id="dropMdl_Gender">' + genderOptions + '</select>';
        html += '  </div>';
        html += '</div>';
        html += '<div class="d-flex justify-content-end gap-2 mt-10">';
        html += '  <button class="btn btn-primary" id="btnMdl_SaveBasic" style="white-space:nowrap;">';
        html += '    <i class="fal fa-save me-1"></i> Lưu thông tin cơ bản';
        html += '  </button>';
        html += '</div>';
        $("#zoneMdl_ThongTinCoBan").html(html);
    },

    renderModal_HoSoChinhSach_ToTab: function (aData) {
        this.renderModal_HoSoChinhSach(aData, 'zoneMdl_HoSoChinhSach_Tab');
    },

    renderModal_HoSoChinhSach: function (aData, zoneIdOverride) {
        var me = this;
        function buildOptions(arr, selectedId, placeholder) {
            var html = '<option value="">-- ' + placeholder + ' --</option>';
            (arr || []).forEach(function (item) {
                var selected = (item.ID == selectedId) ? 'selected' : '';
                html += '<option value="' + item.ID + '" ' + selected + '>' + edu.util.returnEmpty(item.TEN) + '</option>';
            });
            return html;
        }

        var profileId = aData.PERSON_PROFILE_ID || aData.PROFILE_ID || '';
        var isEdit = !!profileId;
        var isActive = (aData.IS_ACTIVE !== undefined) ? aData.IS_ACTIVE
                     : ((aData.is_active !== undefined) ? aData.is_active : 1);
        var checkedAttr = (isActive == 1 || isActive == '1' || isActive === true) ? 'checked' : '';

        var html = '';
        html += '<div class="row">';
        html += '  <div class="col-12 col-md-6 mb-10"><label class="form-label fz14 color-888 mb-1">Tôn giáo</label>';
        html += '    <select class="form-select" id="dropMdlHSCS_Religion">' + buildOptions(me.dtTonGiao, aData.RELIGION_ID, 'Chọn tôn giáo') + '</select></div>';
        html += '  <div class="col-12 col-md-6 mb-10"><label class="form-label fz14 color-888 mb-1">Dân tộc</label>';
        html += '    <select class="form-select" id="dropMdlHSCS_Ethnicity">' + buildOptions(me.dtDanToc, aData.ETHNICITY_ID, 'Chọn dân tộc') + '</select></div>';
        html += '  <div class="col-12 col-md-6 mb-10"><label class="form-label fz14 color-888 mb-1">Thành phần gia đình</label>';
        html += '    <select class="form-select" id="dropMdlHSCS_FamilyBackground">' + buildOptions(me.dtHoanCanh, aData.FAMILY_BACKGROUND_ID, 'Chọn TPGĐ') + '</select></div>';
        html += '  <div class="col-12 col-md-6 mb-10"><label class="form-label fz14 color-888 mb-1">Tình trạng hôn nhân</label>';
        html += '    <select class="form-select" id="dropMdlHSCS_MaritalStatus">' + buildOptions(me.dtHonNhan, aData.MARITAL_STATUS_ID, 'Chọn tình trạng') + '</select></div>';
        html += '  <div class="col-12 col-md-6 mb-10"><label class="form-label fz14 color-888 mb-1">Đối tượng chính sách</label>';
        html += '    <select class="form-select" id="dropMdlHSCS_PolicyObject">' + buildOptions(me.dtDoiTuongCS, aData.POLICY_OBJECT_ID, 'Chọn đối tượng') + '</select></div>';
        html += '  <div class="col-12 col-md-6 mb-10"><label class="form-label fz14 color-888 mb-1">Nhóm máu</label>';
        html += '    <input type="text" class="form-control" id="txtMdlHSCS_BloodType" placeholder="VD: A, B, AB, O+" value="' + edu.util.returnEmpty(aData.BLOOD_TYPE_CODE) + '"></div>';
        html += '  <div class="col-12 col-md-4 mb-10"><label class="form-label fz14 color-888 mb-1">Ngày vào Đoàn</label>';
        html += '    <input type="text" class="form-control" id="txtMdlHSCS_UnionJoin" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.UNION_JOIN_DATE) || edu.util.returnEmpty(aData.union_join_date)) + '"></div>';
        html += '  <div class="col-12 col-md-4 mb-10"><label class="form-label fz14 color-888 mb-1">Ngày vào Đảng</label>';
        html += '    <input type="text" class="form-control" id="txtMdlHSCS_PartyJoin" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.PARTY_JOIN_DATE) || edu.util.returnEmpty(aData.party_join_date)) + '"></div>';
        html += '  <div class="col-12 col-md-4 mb-10"><label class="form-label fz14 color-888 mb-1">Ngày chính thức Đảng</label>';
        html += '    <input type="text" class="form-control" id="txtMdlHSCS_PartyOfficial" placeholder="dd/mm/yyyy" value="' + (edu.util.returnEmpty(aData.PARTY_OFFICIAL_DATE) || edu.util.returnEmpty(aData.party_official_date)) + '"></div>';
        html += '  <div class="col-12 mb-10"><div class="form-check">';
        html += '    <input type="checkbox" class="form-check-input" id="chkMdlHSCS_IsActive" ' + checkedAttr + '>';
        html += '    <label class="form-check-label fz14" for="chkMdlHSCS_IsActive">Hiệu lực</label></div></div>';
        html += '</div>';
        html += '<input type="hidden" id="txtMdlHSCS_Id" value="' + profileId + '">';
        html += '<div class="d-flex justify-content-end gap-2 mt-10">';
        if (isEdit) {
            html += '  <button class="btn btn-delete" id="btnMdlHSCS_Xoa"><i class="fal fa-trash me-1"></i> Xóa</button>';
        }
        html += '  <button class="btn btn-primary" id="btnMdlHSCS_Save" style="white-space:nowrap;">';
        html += '    <i class="fal fa-save me-1"></i> ' + (isEdit ? 'Cập nhật hồ sơ - chính sách' : 'Lưu hồ sơ - chính sách');
        html += '  </button>';
        html += '</div>';
        $("#" + (zoneIdOverride || "zoneMdl_HoSoChinhSach")).html(html);
    },

    getInfo_HoSoChinhSach_Modal: function (strPersonId) {
        var me = this;
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4FRURJDMyLi8eETMuJygtJAPP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile',
            'iM': edu.system.iM,
            'strId': '',
            'strPerson_Id': strPersonId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Data && data.Data.length > 0 && me.aModalProfile) {
                    Object.assign(me.aModalProfile, data.Data[0]);
                    me.renderModal_HoSoChinhSach(me.aModalProfile);
                }
            },
            error: function (er) {
                console.log("[Modal HSCS get info err]", er);
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    save_Modal_CorePerson: function () {
        var me = this;
        var aData = me.aModalProfile;
        if (!aData) {
            edu.system.alert("Chưa chọn sinh viên", "w");
            return;
        }
        var strFullName = edu.util.getValById('txtMdl_FullName');
        if (!strFullName) {
            edu.system.alert("Vui lòng nhập Họ và tên đầy đủ", "w");
            return;
        }
        var strDob = edu.util.getValById('txtMdl_DateOfBirth');
        var dDay = '', dMonth = '', dYear = '';
        if (strDob) {
            var parts = strDob.split('/');
            if (parts.length >= 3) {
                dDay = parseInt(parts[0], 10) || '';
                dMonth = parseInt(parts[1], 10) || '';
                dYear = parseInt(parts[2], 10) || '';
            }
        }

        // Dùng template confirm
        me.showFancyConfirm({
            title: 'Cập nhật Thông tin cơ bản',
            subTitle: 'Lưu thông tin cá nhân của sinh viên',
            icon: 'fa-user-pen',
            subject: {
                name: strFullName,
                extra: [
                    { label: 'Mã NH', value: aData.MA_NGUOI_HOC || aData.MA_NGUOIHOC_CHINH || '' }
                ]
            },
            sections: [{
                title: 'Thông tin sẽ lưu',
                color: 'blue',
                items: [
                    { label: 'Họ và tên', value: strFullName },
                    { label: 'Họ', value: edu.util.getValById('txtMdl_LastName') },
                    { label: 'Tên đệm', value: edu.util.getValById('txtMdl_MiddleName') },
                    { label: 'Tên', value: edu.util.getValById('txtMdl_FirstName') },
                    { label: 'Ngày sinh', value: strDob },
                    { label: 'Giới tính', value: $('#dropMdl_Gender option:selected').text() }
                ]
            }],
            actionLabel: 'Lưu thông tin cơ bản',
            onConfirm: function () {
                var obj_save = {
                    'action': 'NS_HoSoNhanSu5_MH/FDElIDUkAi4zJBEkMzIuLwPP',
                    'func': 'PKG_CORE_HOSONHANSU_05.UpdateCorePerson',
                    'iM': edu.system.iM,
                    'strChucNang_Id': edu.system.strChucNang_Id || edu.system.chucNangHeThong_Id || '',
                    'strId': aData.CORE_PERSON_ID || aData.PERSON_ID || '',
                    'strPerson_Id': aData.CORE_PERSON_ID || aData.PERSON_ID || '',
                    'strFullName': strFullName,
                    'strLastName': edu.util.getValById('txtMdl_LastName'),
                    'strMiddleName': edu.util.getValById('txtMdl_MiddleName'),
                    'strFirstName': edu.util.getValById('txtMdl_FirstName'),
                    'strDateOfBirth': strDob,
                    'strDobPrecisionLevel': '',
                    'dBirthDay': dDay,
                    'dBirthMonth': dMonth,
                    'dBirthYear': dYear,
                    'strGenderId': edu.util.getValById('dropMdl_Gender'),
                    'strProfileStatusId': '',
                    'strPortraitFileId': '',
                    'strContext_Code': 'STUDENT',
                    'strInitial_ConText_Code': 'STUDENT',
                    'strCreated_Source_Code': 'INTERNAL_FORM',
                    'strNguoiThucHien_Id': edu.system.userId,
                };
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) edu.system.alert("Cập nhật thông tin cơ bản thành công", "s");
                        else edu.system.alert(obj_save.action + " : " + data.Message, "s");
                    },
                    error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
                    type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
                }, false, false, false, null);
            }
        });
    },

    save_Modal_HoSoChinhSach: function () {
        var me = this;
        var aData = me.aModalProfile;
        if (!aData) { edu.system.alert("Chưa chọn sinh viên", "w"); return; }
        var strPersonId = aData.CORE_PERSON_ID || aData.PERSON_ID;
        if (!strPersonId) { edu.system.alert("Chưa có Person ID", "w"); return; }

        var strProfileId = edu.util.getValById('txtMdlHSCS_Id');
        var isEdit = !!strProfileId;

        var common = {
            'iM': edu.system.iM,
            'strReligion_Id': edu.util.getValById('dropMdlHSCS_Religion'),
            'strEthnicity_Id': edu.util.getValById('dropMdlHSCS_Ethnicity'),
            'strFamilyBackground_Id': edu.util.getValById('dropMdlHSCS_FamilyBackground'),
            'strMaritalStatus_Id': edu.util.getValById('dropMdlHSCS_MaritalStatus'),
            'strPolicyObject_Id': edu.util.getValById('dropMdlHSCS_PolicyObject'),
            'strBloodType_Code': edu.util.getValById('txtMdlHSCS_BloodType'),
            'strUnionJoinDate': edu.util.getValById('txtMdlHSCS_UnionJoin'),
            'strPartyJoinDate': edu.util.getValById('txtMdlHSCS_PartyJoin'),
            'strPartyOfficialDate': edu.util.getValById('txtMdlHSCS_PartyOfficial'),
            'dIsActive': $('#chkMdlHSCS_IsActive').is(':checked') ? 1 : 0,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };
        var obj_save = isEdit
            ? Object.assign(common, { action: 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLx4RMy4nKC0k', func: 'PKG_CORE_NGUOIHOC_01.Sua_Person_Profile', strId: strProfileId })
            : Object.assign(common, { action: 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8eETMuJygtJAPP', func: 'PKG_CORE_NGUOIHOC_01.Them_Person_Profile', strPerson_Id: strPersonId });

        me.showFancyConfirm({
            title: isEdit ? 'Cập nhật Hồ sơ - chính sách' : 'Lưu Hồ sơ - chính sách',
            icon: 'fa-file-shield',
            subject: { name: edu.util.returnEmpty(aData.FULL_NAME) || edu.util.returnEmpty(aData.HO_TEN) },
            sections: [{
                title: 'Thông tin hồ sơ - chính sách',
                color: 'green',
                items: [
                    { label: 'Tôn giáo', value: $('#dropMdlHSCS_Religion option:selected').text() },
                    { label: 'Dân tộc', value: $('#dropMdlHSCS_Ethnicity option:selected').text() },
                    { label: 'Thành phần gia đình', value: $('#dropMdlHSCS_FamilyBackground option:selected').text() },
                    { label: 'Tình trạng hôn nhân', value: $('#dropMdlHSCS_MaritalStatus option:selected').text() },
                    { label: 'Đối tượng chính sách', value: $('#dropMdlHSCS_PolicyObject option:selected').text() },
                    { label: 'Nhóm máu', value: common.strBloodType_Code },
                    { label: 'Ngày vào Đoàn', value: common.strUnionJoinDate },
                    { label: 'Ngày vào Đảng', value: common.strPartyJoinDate },
                    { label: 'Ngày chính thức Đảng', value: common.strPartyOfficialDate },
                    { label: 'Hiệu lực', value: common.dIsActive == 1 ? '✓ Có' : 'Không' }
                ]
            }],
            actionLabel: isEdit ? 'Cập nhật' : 'Lưu hồ sơ',
            onConfirm: function () {
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            edu.system.alert(isEdit ? "Cập nhật thành công" : "Thêm thành công", "s");
                            if (!isEdit && data.Id) {
                                aData.PERSON_PROFILE_ID = data.Id;
                                me.renderModal_HoSoChinhSach(aData);
                            }
                        } else edu.system.alert(obj_save.action + " : " + data.Message, "s");
                    },
                    error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
                    type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
                }, false, false, false, null);
            }
        });
    },

    delete_Modal_HoSoChinhSach: function () {
        var me = this;
        var aData = me.aModalProfile;
        var strProfileId = edu.util.getValById('txtMdlHSCS_Id');
        if (!strProfileId) { edu.system.alert("Chưa có hồ sơ - chính sách để xóa", "w"); return; }

        me.showFancyConfirm({
            title: 'Xóa Hồ sơ - chính sách',
            icon: 'fa-trash',
            warningText: 'Hành động xóa không thể hoàn tác. Bản ghi sẽ bị loại bỏ khỏi hệ thống.',
            subject: { name: edu.util.returnEmpty(aData.FULL_NAME) || edu.util.returnEmpty(aData.HO_TEN) },
            sections: [{
                title: 'Xác nhận xóa',
                color: 'red',
                items: [
                    { label: 'ID hồ sơ', value: strProfileId }
                ]
            }],
            actionLabel: 'Xóa hồ sơ - chính sách',
            requireCheckbox: true,
            onConfirm: function () {
                var obj_save = {
                    'action': 'SV_NGUOIHOC_01_MH/GS4gHhEkMzIuLx4RMy4nKC0k',
                    'func': 'PKG_CORE_NGUOIHOC_01.Xoa_Person_Profile',
                    'iM': edu.system.iM,
                    'strId': strProfileId,
                    'strNguoiThucHien_Id': edu.system.userId,
                    'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                    'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
                    'strHanhDong_Code': '',
                };
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            edu.system.alert("Xóa thành công", "s");
                            aData.PERSON_PROFILE_ID = null;
                            aData.RELIGION_ID = null; aData.ETHNICITY_ID = null;
                            aData.FAMILY_BACKGROUND_ID = null; aData.MARITAL_STATUS_ID = null;
                            aData.POLICY_OBJECT_ID = null; aData.BLOOD_TYPE_CODE = null;
                            aData.UNION_JOIN_DATE = null; aData.PARTY_JOIN_DATE = null;
                            aData.PARTY_OFFICIAL_DATE = null;
                            me.renderModal_HoSoChinhSach(aData);
                        } else edu.system.alert(obj_save.action + " : " + data.Message, "s");
                    },
                    error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
                    type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
                }, false, false, false, null);
            }
        });
    },

    /*------------------------------------------
    --Discription: [3] Hồ sơ tổng quan QHHT (NEW: 3 blocks + 3 counts)
    --Origin: PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan
    --Response gồm:
    --  ParamTongQHHT / ParamSoDangHoc / ParamSoHoanThanh
    --  rsThongTinCoBan (block 1) - thông tin cơ bản người học
    --  rsDanhSachQHHT (block 2) - danh sách QHHT
    --  rsChiTietQHHT (block 3) - chi tiết tất cả QHHT (filter theo study_id)
    -------------------------------------------*/
    getList_HoSoTongQuan: function (strPersonId, strPersonStudyId) {
        var me = this;
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4CS4SLg8mNC4oCS4iHhUuLyYQNCAv',
            'func': 'PKG_CORE_NGUOIHOC_01.LayHoSoNguoiHoc_TongQuan',
            'iM': edu.system.iM,
            'strCorePerson_Id': strPersonId,
            'strCorePersonStudy_Id': strPersonStudyId || '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                    return;
                }
                var d = data.Data || {};

                // Helper: lookup field theo nhiều tên (case-insensitive convention)
                var pick = function (obj, keys) {
                    for (var i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] !== undefined && obj[keys[i]] !== null) return obj[keys[i]];
                    }
                    return null;
                };

                // ===== 3 số tổng quan =====
                var tongQHHT = pick(d, ['ParamTongQHHT', 'TongQHHT', 'TONGQHHT', 'TongQhht']);
                var soDangHoc = pick(d, ['ParamSoDangHoc', 'SoDangHoc', 'SODANGHOC']);
                var soHoanThanh = pick(d, ['ParamSoHoanThanh', 'SoHoanThanh', 'SOHOANTHANH']);
                $("#lblTongQHHT").html(edu.util.returnEmpty(tongQHHT) || 0);
                $("#lblQHHT_DangHoc").html(edu.util.returnEmpty(soDangHoc) || 0);
                $("#lblQHHT_HoanThanh").html(edu.util.returnEmpty(soHoanThanh) || 0);

                // ===== 3 khối rs (handle nhiều convention naming) =====
                var thongTinCoBan = pick(d, ['rsThongTinCoBan', 'ThongTinCoBan', 'Block1', 'Data1', 'ds1']) || [];
                var dsQHHT       = pick(d, ['rsDanhSachQHHT', 'DanhSachQHHT', 'Block2', 'Data2', 'ds2']) || [];
                var chiTietQHHT  = pick(d, ['rsChiTietQHHT', 'ChiTietQHHT', 'Block3', 'Data3', 'ds3']) || [];

                // Cache lại để filter chi tiết khi user chọn QHHT
                me.dtQHHT = dsQHHT;
                me.dtAllChiTietQHHT = chiTietQHHT;

                // Block 1: cập nhật thông tin cơ bản
                if (thongTinCoBan.length > 0 && me.aSinhVien) {
                    Object.assign(me.aSinhVien, thongTinCoBan[0]);
                    me.loadHoSo_SinhVien();
                }

                // Block 2: render danh sách QHHT
                me.genHTML_DanhSachQHHT(dsQHHT);

                // Default: hiện chi tiết của QHHT đầu tiên (radio đầu tiên đã checked)
                if (dsQHHT.length > 0) {
                    var firstStudyId = dsQHHT[0].STUDY_ID || dsQHHT[0].study_id || dsQHHT[0].ID;
                    me.strQHHT_Id = firstStudyId;
                    me.selectQHHT_ShowChiTiet(firstStudyId);
                } else {
                    $("#zoneChiTietQHHT").html('<div class="text-center color-888 pd20">Chưa có QHHT</div>');
                    $("#lblQHHT_Ma").html('');
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

    /*------------------------------------------
    --Discription: User chọn 1 QHHT trong danh sách (block 2)
    --→ filter block 3 (rsChiTietQHHT) theo study_id để hiện chi tiết tương ứng
    -------------------------------------------*/
    selectQHHT_ShowChiTiet: function (strStudyId) {
        var me = this;
        var aChiTiet = (me.dtAllChiTietQHHT || []).find(function (item) {
            return (item.STUDY_ID || item.study_id || item.ID) == strStudyId;
        });
        if (aChiTiet) {
            me.aQHHT = aChiTiet;
            me.genHTML_ChiTietQHHT();
        } else {
            $("#zoneChiTietQHHT").html('<div class="text-center color-888 pd10">Không tìm thấy chi tiết QHHT cho study_id = ' + strStudyId + '</div>');
            $("#lblQHHT_Ma").html('');
        }
    },

    genHTML_DanhSachQHHT: function (data) {
        var html = '';
        if (!data || data.length === 0) {
            html = '<div class="text-center color-888 pd20">Chưa có QHHT</div>';
            $("#zoneListQHHT").html(html);
            return;
        }
        data.forEach(function (aData, idx) {
            var studyId = aData.STUDY_ID || aData.study_id || aData.ID;
            var strChecked = (idx === 0) ? 'checked' : '';
            var maQHHT = edu.util.returnEmpty(aData.QHHT_MA) || edu.util.returnEmpty(aData.MA) || edu.util.returnEmpty(aData.MA_QHHT) || edu.util.returnEmpty(aData.STUDY_CODE);
            var donVi = edu.util.returnEmpty(aData.DONVI_QUANLY_TEN) || edu.util.returnEmpty(aData.KHOAQUANLY_TEN);
            var nganh = edu.util.returnEmpty(aData.NGANH_TEN) || edu.util.returnEmpty(aData.TENCHUONGTRINH);
            var heDaoTao = edu.util.returnEmpty(aData.HEDAOTAO_TEN) || edu.util.returnEmpty(aData.TENHEDAOTAO);
            var khoa = edu.util.returnEmpty(aData.KHOA) || edu.util.returnEmpty(aData.TENKHOA) || edu.util.returnEmpty(aData.NAMNHAPHOC);
            var lop = edu.util.returnEmpty(aData.LOP_TEN) || edu.util.returnEmpty(aData.LOPQUANLY_TEN);
            var trangThai = edu.util.returnEmpty(aData.TRANGTHAI_TEN) || edu.util.returnEmpty(aData.STUDY_STATUS_TEN);
            var isPrimary = aData.IS_PRIMARY === 1 || aData.IS_PRIMARY === '1';

            html += '<div class="swiper-qhht-box mb-10">';
            html += '  <div class="radio">';
            html += '    <input type="radio" name="rdQHHT" class="rdQHHT" id="rdQHHT_' + studyId + '" value="' + studyId + '" ' + strChecked + '>';
            html += '    <label for="rdQHHT_' + studyId + '"></label>';
            html += '  </div>';
            html += '  <div class="form-content">';
            html += '    <div class="top">';
            html += '      <div class="title">' + maQHHT + (isPrimary ? ' <i class="fal fa-star color-yellow" title="Ngành chính"></i>' : '') + '</div>';
            html += '      <div class="ct"><div class="btn btn-soft-primary no-link">' + donVi + '</div></div>';
            html += '    </div>';
            html += '    <div class="f-content">';
            html += '      <div class="line-text w-100"><div class="label">Ngành:</div><div class="text">' + nganh + '</div></div>';
            html += '      <div class="line-text w-100"><div class="label">Hệ đào tạo:</div><div class="text">' + heDaoTao + '</div></div>';
            html += '      <div class="d-flex justify-content-between">';
            html += '        <div class="line-text"><div class="label">Khóa</div><div class="text">' + khoa + '</div></div>';
            html += '        <div class="line-text"><div class="label">Lớp</div><div class="text">' + lop + '</div></div>';
            html += '      </div>';
            html += '      <div class="line-text"><div class="label mt-5">Trạng thái</div><div class="text"><div class="btn btn-soft-success no-link">' + trangThai + '</div></div></div>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
        });
        $("#zoneListQHHT").html(html);
    },

    genHTML_ChiTietQHHT: function () {
        var me = this;
        var aData = me.aQHHT || {};
        // Helper get field theo nhiều tên fallback
        var p = function (keys) {
            for (var i = 0; i < keys.length; i++) {
                var v = aData[keys[i]];
                if (v !== undefined && v !== null && v !== '') return v;
            }
            return '';
        };
        var maQHHT = p(['QHHT_MA', 'STUDY_CODE', 'MA_QHHT', 'MA']);
        $("#lblQHHT_Ma").html(edu.util.returnEmpty(maQHHT));

        var trangThaiTen = p(['TRANGTHAI_TEN', 'STUDY_STATUS_TEN']);
        var html = '';
        var arrField = [
            { label: 'Loại QHHT', value: p(['LOAIQHHT_TEN', 'STUDY_RELATION_TYPE_TEN', 'STUDY_KIND_TEN']) },
            { label: 'Ngày bắt đầu', value: p(['NGAYBATDAU_DD_MM_YYYY', 'NGAY_BAT_DAU', 'START_DATE']) },
            { label: 'Ngành / Chương trình', value: p(['NGANH_TEN', 'TENCHUONGTRINH', 'TENNGANH']) },
            { label: 'Dự kiến tốt nghiệp', value: p(['NGAYDUKIEN_TN', 'EXPECTED_GRADUATION_DATE', 'NGAYKETTHUC']) },
            { label: 'Khóa', value: p(['KHOA', 'TENKHOA', 'KHOA_DAOTAO']) },
            { label: 'GPA hiện tại', value: p(['GPA', 'GPA_HIENTAI', 'CURRENT_GPA']) },
            { label: 'Hệ đào tạo', value: p(['HEDAOTAO_TEN', 'TENHEDAOTAO']) },
            { label: 'Số tín chỉ tích lũy', value: p(['SOTINCHI_TICHLUY', 'TIN_CHI_TICHLUY', 'TOTAL_CREDIT']) },
            { label: 'Lớp hiện tại', value: p(['LOP_TEN', 'LOPQUANLY_TEN', 'CLASS_NAME']) },
            { label: 'Trạng thái', value: trangThaiTen ? '<div class="btn btn-soft-success no-link">' + trangThaiTen + '</div>' : '' },
            { label: 'Cố vấn học tập', value: p(['COVAN_TENDAYDU', 'COVAN_TEN', 'ADVISOR_NAME']) },
            { label: 'Ngành chính/phụ', value: (aData.IS_PRIMARY == 1 || aData.IS_PRIMARY == '1') ? '<span class="btn btn-soft-success no-link"><i class="fal fa-star me-1"></i>Chính</span>' : ((aData.IS_PRIMARY == 0 || aData.IS_PRIMARY == '0') ? '<span class="btn btn-soft-primary no-link">Phụ</span>' : '') },
        ];
        arrField.forEach(function (f) {
            html += '<div class="col-12 col-md-6 mb-10">';
            html += '  <div class="line-text"><div class="label"><i class="fa-duotone fa-solid fa-circle-check mr-5"></i>' + f.label + ':</div>';
            html += '  <div class="text">' + edu.util.returnEmpty(f.value) + '</div></div>';
            html += '</div>';
        });
        $("#zoneChiTietQHHT").html(html);
    },

    genTongQuan_QHHT: function (oSummary) {
        $("#lblTongQHHT").html(edu.util.returnEmpty(oSummary.TONGQHHT) || 0);
        $("#lblQHHT_DangHoc").html(edu.util.returnEmpty(oSummary.DANGHOC) || 0);
        $("#lblQHHT_HoanThanh").html(edu.util.returnEmpty(oSummary.HOANTHANH) || 0);
    },

    /*------------------------------------------
    --Discription: [4] Tổng quan QHHT (học kỳ hiện tại, tín chỉ, GPA, xếp loại)
    -------------------------------------------*/
    getList_TongQuanQHHT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_SinhVien_MH/DSA4BRIKCR4RKSAvFygkLh4VCQPP',
            'func': 'PKG_KEHOACH_HOATDONG_SINHVIEN.LayTongQuan_QHHT',
            'iM': edu.system.iM,
            'strSinhVien_Id': me.strSinhVien_Id,
            'strQHHT_Id': me.strQHHT_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var aData = (dtReRult && dtReRult.length > 0) ? dtReRult[0] : {};
                    $("#lblHocKyHienTai").html(edu.util.returnEmpty(aData.HOCKY_HIENTAI));
                    var iTichLuy = edu.util.returnEmpty(aData.SOTINCHI_TICHLUY) || 0;
                    var iTongTC = edu.util.returnEmpty(aData.SOTINCHI_TONG) || 0;
                    var iPercent = iTongTC > 0 ? Math.round((iTichLuy / iTongTC) * 100) : 0;
                    $("#lblTinChiTichLuy").html(iTichLuy + '/' + iTongTC + ' (' + iPercent + '%)');
                    $("#lblTinChiTichLuy_Bar").css("width", iPercent + "%");
                    $("#lblGPA_HienTai").html(edu.util.returnEmpty(aData.GPA) + '/4');
                    $("#lblXepLoai").html('<span class="text-green">' + edu.util.returnEmpty(aData.XEPLOAI) + '</span>');
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    /*------------------------------------------
    --Discription: Common params cho 5 endpoint KHCT_BIND_DIMENSION_MH
    -------------------------------------------*/
    _bindDimCommon: function () {
        return {
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || '',
            'strHanhDong_Code': '',
            'dBoQuaPhamVi': 0,
        };
    },

    /*------------------------------------------
    --Discription: [5a] Bộ lọc Hệ đào tạo
    --Origin: PKG_CORE_GET_BIND_DIMENSION.LayDSHeDaoTao
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRIJJAUgLhUgLgPP',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSHeDaoTao',
        });

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me.genCombo_HeDaoTao(data.Data);
                else edu.system.alert(obj_save.action + " : " + data.Message, "s");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    genCombo_HeDaoTao: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                mRender: function (nRow, aData) {
                    return aData.TENHEDAOTAO || aData.NAME || aData.TEN || aData.TENKHOA || '';
                }
            },
            renderPlace: ["dropHeDaoTao_CB"],
            title: "Chọn hệ đào tạo"
        });
        this.applyMultiSelectPlaceholder("dropHeDaoTao_CB");
    },

    /*------------------------------------------
    --Discription: [5b] Bộ lọc Khoa quản lý
    --Origin: PKG_CORE_GET_BIND_DIMENSION.LayDSKhoaQuanLy
    -------------------------------------------*/
    getList_KhoaQuanLy: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRIKKS4gEDQgLw04',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSKhoaQuanLy',
            'strOrgTypeCode': '',
        });

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me.genCombo_KhoaQuanLy(data.Data);
                else edu.system.alert(obj_save.action + " : " + data.Message, "s");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    genCombo_KhoaQuanLy: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                mRender: function (nRow, aData) {
                    var ten = aData.NAME || aData.TEN || aData.TENKHOA || '';
                    var ma = aData.CODE || aData.MA || aData.MAKHOA || '';
                    return ma ? (ten + ' (' + ma + ')') : ten;
                }
            },
            renderPlace: ["dropKhoaQuanLy_CB"],
            title: "Chọn khoa quản lý"
        });
        this.applyMultiSelectPlaceholder("dropKhoaQuanLy_CB");
    },

    /*------------------------------------------
    --Discription: [5c] Bộ lọc Khóa đào tạo
    --Origin: PKG_CORE_GET_BIND_DIMENSION.LayDSKhoaDaoTao
    -------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRIKKS4gBSAuFSAu',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSKhoaDaoTao',
            'strDaoTao_HeDaoTao_Id': me.getMultiVal('dropHeDaoTao_CB'),
        });

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me.genCombo_KhoaDaoTao(data.Data);
                else edu.system.alert(obj_save.action + " : " + data.Message, "s");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    genCombo_KhoaDaoTao: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                mRender: function (nRow, aData) {
                    var ten = aData.TENKHOA || aData.TEN || aData.NAME || '';
                    var ma = aData.MAKHOA || aData.MA || aData.CODE || '';
                    return ma ? (ten + ' (' + ma + ')') : ten;
                }
            },
            renderPlace: ["dropKhoaDaoTao_CB"],
            title: "Chọn khóa đào tạo"
        });
        this.applyMultiSelectPlaceholder("dropKhoaDaoTao_CB");
    },

    /*------------------------------------------
    --Discription: [6] Bộ lọc Chương trình
    --Origin: PKG_CORE_GET_BIND_DIMENSION.LayDSChuongTrinh
    -------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSChuongTrinh',
            'strDaoTao_KhoaDaoTao_Id': me.getMultiVal('dropKhoaDaoTao_CB'),
            'strDaoTao_KhoaQuanLy_Id': me.getMultiVal('dropKhoaQuanLy_CB'),
            'strDaoTao_HeDaoTao_Id': me.getMultiVal('dropHeDaoTao_CB'),
        });

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me.genCombo_ChuongTrinh(data.Data);
                else edu.system.alert(obj_save.action + " : " + data.Message, "s");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    genCombo_ChuongTrinh: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                mRender: function (nRow, aData) {
                    var ten = aData.TENCHUONGTRINH || aData.TEN || aData.NAME || '';
                    var ma = aData.MACHUONGTRINH || aData.MA || aData.CODE || '';
                    return ma ? (ten + ' (' + ma + ')') : ten;
                }
            },
            renderPlace: ["dropChuongTrinh_CB"],
            title: "Chọn chương trình"
        });
        this.applyMultiSelectPlaceholder("dropChuongTrinh_CB");
    },

    /*------------------------------------------
    --Discription: [7] Bộ lọc Lớp quản lý
    --Origin: PKG_CORE_GET_BIND_DIMENSION.LayDSLopQuanLy
    -------------------------------------------*/
    getList_LopQuanLy: function () {
        var me = this;
        var obj_save = Object.assign(me._bindDimCommon(), {
            'action': 'KHCT_BIND_DIMENSION_MH/DSA4BRINLjEQNCAvDTgP',
            'func': 'PKG_CORE_GET_BIND_DIMENSION.LayDSLopQuanLy',
            'strDaoTao_HeDaoTao_Id': me.getMultiVal('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': me.getMultiVal('dropKhoaDaoTao_CB'),
            'strDaoTao_KhoaQuanLy_Id': me.getMultiVal('dropKhoaQuanLy_CB'),
            'strDaoTao_ChuongTrinh_Id': me.getMultiVal('dropChuongTrinh_CB'),
        });

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me.genCombo_LopQuanLy(data.Data);
                else edu.system.alert(obj_save.action + " : " + data.Message, "s");
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST", action: obj_save.action, contentType: true, data: obj_save, fakedb: []
        }, false, false, false, null);
    },

    genCombo_LopQuanLy: function (data) {
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENLOP",
                mRender: function (nRow, aData) {
                    var ten = aData.TENLOP || aData.TEN || aData.NAME || '';
                    var ma = aData.MALOP || aData.MA || aData.CODE || '';
                    return ma ? (ten + ' (' + ma + ')') : ten;
                }
            },
            renderPlace: ["dropSearch_Lop"],
            title: "Chọn lớp"
        });
        this.applyMultiSelectPlaceholder("dropSearch_Lop");
    },
}
