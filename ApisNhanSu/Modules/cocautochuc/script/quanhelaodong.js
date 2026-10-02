/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function QuanHeLaoDong() { };
QuanHeLaoDong.prototype = {
    strCoCauToChuc_Id: '',
    dtCoCauToChuc: [],
    version: '1.0.1.3',
    // Employment hiện đang chọn (cột trái) để biết mở form phân công theo QHLD nào
    currentEmploymentId: '',
    currentQuanHe: null,
    currentNhanSu: null,
    currentOrgUnitForPosition: '',
    strNhiemVu_Id: '',

    getVaiTroId: function () {
        // Backend thường lọc theo strVaiTro_Id (vai trò). Một số luồng UI lại dùng appId (ứng dụng).
        // Ưu tiên dùng edu.system.strVaiTro_Id nếu đã có; fallback sang appId/sessionStorage.
        try {
            if (edu && edu.system) {
                if (edu.system.strVaiTro_Id) return edu.system.strVaiTro_Id;
                if (edu.system.appId) return edu.system.appId;
            }
            var strChucNang = sessionStorage.getItem("strChucNang");
            if (strChucNang) {
                var objChucNang = JSON.parse(strChucNang);
                return objChucNang && objChucNang.appId ? objChucNang.appId : "";
            }
        } catch (e) {
        }
        return "";
    },

    buildQuanHeFromPersonList: function () {
        var me = this;
        var personId = me["strNhanSu_Id"];
        if (!personId || !Array.isArray(me.dtQuanHeLaoDong)) return [];

        // dtQuanHeLaoDong (tab danh sách) đã có các cột EMPLOYMENT_* và CORE_EMPLOYMENT_ID.
        // Dùng nó làm nguồn fallback để hiển thị trong modal khi API Get_Core_Employment trả rỗng.
        var rows = me.dtQuanHeLaoDong
            .filter(function (x) {
                var rowPersonId = x.PERSON_ID || x.ID;
                var employmentId = x.CORE_EMPLOYMENT_ID || x.EMPLOYMENT_ID || x.EMPLOYMENT_Id;
                if (!(rowPersonId == personId && employmentId)) return false;
                // Soft-delete: nếu nguồn list có cờ active thì bỏ các bản ghi đã xóa
                var isActive = (x.EMPLOYMENT_IS_ACTIVE != null) ? x.EMPLOYMENT_IS_ACTIVE : x.IS_ACTIVE;
                if (isActive === 0 || isActive === "0") return false;
                return true;
            })
            .map(function (x) {
                var employmentId = x.CORE_EMPLOYMENT_ID || x.EMPLOYMENT_ID || x.EMPLOYMENT_Id;
                return {
                    ID: employmentId,
                    EMPLOYMENT_TYPE_CODE: x.EMPLOYMENT_TYPE_CODE || x.EMPLOYMENT_TYPE_Code || "",
                    EMPLOYMENT_TYPE_CODE_NAME: x.EMPLOYMENT_TYPE_CODE_NAME || x.EMPLOYMENT_TYPE_CODE_Name || "",
                    EMPLOYMENT_STATUS_CODE: x.EMPLOYMENT_STATUS_CODE || x.EMPLOYMENT_STATUS_Code || "",
                    EMPLOYMENT_STATUS_CODE_NAME: x.EMPLOYMENT_STATUS_CODE_NAME || x.EMPLOYMENT_STATUS_CODE_Name || "",
                    LEGAL_ENTITY_ID: x.LEGAL_ENTITY_ID || "",
                    LEGAL_ENTITY_NAME: x.LEGAL_ENTITY_NAME || "",
                    EMPLOYER_ORG_ID: x.EMPLOYMENT_ORG_ID || x.EMPLOYER_ORG_ID || x.ORG_ID || x.ORG_UNIT_ID || "",
                    EFFECTIVE_FROM: x.EMPLOYMENT_EFFECTIVE_FROM || x.EFFECTIVE_FROM || "",
                    EFFECTIVE_TO: x.EMPLOYMENT_EFFECTIVE_TO || x.EFFECTIVE_TO || "",
                    IS_PRIMARY: x.EMPLOYMENT_IS_PRIMARY != null ? x.EMPLOYMENT_IS_PRIMARY : x.IS_PRIMARY
                };
            });

        // Loại trùng theo CORE_EMPLOYMENT_ID (vì tab danh sách có thể join ra nhiều dòng giống nhau)
        var seen = {};
        var unique = [];
        for (var i = 0; i < rows.length; i++) {
            var k = rows[i].ID;
            if (!k || seen[k]) continue;
            seen[k] = true;
            unique.push(rows[i]);
        }
        return unique;
    },

    normalizeEmploymentRows: function (rows) {
        var me = this;
        if (!Array.isArray(rows)) return [];

        var getOptionText = function (selectId, value) {
            try {
                if (value === null || value === undefined || value === "") return "";
                var $opt = $("#" + selectId + " option[value='" + value + "']");
                if ($opt && $opt.length) return ($opt.text() || "").trim();
            } catch (e) { }
            return "";
        };

        var lookupOrgName = function (orgId) {
            if (!orgId) return "";
            try {
                if (Array.isArray(me.dtDonVi) && me.dtDonVi.length) {
                    var found = me.dtDonVi.find(function (x) { return x && x.ID == orgId; });
                    if (found && found.NAME) return found.NAME;
                }
            } catch (e) { }
            // fallback: read from select options
            return getOptionText("dropPhapNhan", orgId) || getOptionText("dropDonViSuDung", orgId) || "";
        };

        return rows.map(function (r) {
            if (!r) return r;
            // Legal entity
            if (!r.LEGAL_ENTITY_NAME && r.LEGAL_ENTITY_ID) {
                r.LEGAL_ENTITY_NAME = lookupOrgName(r.LEGAL_ENTITY_ID);
            }
            // Status name
            if (!r.EMPLOYMENT_STATUS_CODE_NAME && r.EMPLOYMENT_STATUS_CODE) {
                r.EMPLOYMENT_STATUS_CODE_NAME = getOptionText("dropTrangThaiQuanHe", r.EMPLOYMENT_STATUS_CODE);
            }
            // Type name (just in case)
            if (!r.EMPLOYMENT_TYPE_CODE_NAME && r.EMPLOYMENT_TYPE_CODE) {
                r.EMPLOYMENT_TYPE_CODE_NAME = getOptionText("dropLoaiQuanHe", r.EMPLOYMENT_TYPE_CODE);
            }
            return r;
        });
    },

    normalizePersonListRows: function (rows) {
        var me = this;
        if (!Array.isArray(rows)) return [];

        var getOptionText = function (selectId, value) {
            try {
                if (value === null || value === undefined || value === "") return "";
                var $opt = $("#" + selectId + " option[value='" + value + "']");
                if ($opt && $opt.length) return ($opt.text() || "").trim();
            } catch (e) { }
            return "";
        };

        var lookupOrgName = function (orgId) {
            if (!orgId) return "";
            try {
                if (Array.isArray(me.dtDonVi) && me.dtDonVi.length) {
                    var found = me.dtDonVi.find(function (x) { return x && x.ID == orgId; });
                    if (found && found.NAME) return found.NAME;
                }
            } catch (e) { }
            return "";
        };

        var parseVNDate = function (s) {
            try {
                if (!s) return null;
                if (typeof s !== 'string') s = String(s);
                s = s.trim();
                var parts = s.split('/');
                if (parts.length !== 3) return null;
                var dd = parseInt(parts[0], 10);
                var mm = parseInt(parts[1], 10);
                var yy = parseInt(parts[2], 10);
                if (!dd || !mm || !yy) return null;
                var d = new Date(yy, mm - 1, dd);
                if (isNaN(d.getTime())) return null;
                return d;
            } catch (e) {
                return null;
            }
        };

        var computeEffectiveStatusName = function (fromStr, toStr) {
            var fromD = parseVNDate(fromStr);
            var toD = parseVNDate(toStr);
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            if (fromD && fromD.getTime() > today.getTime()) return "Chưa hiệu lực";
            if (toD && toD.getTime() < today.getTime()) return "Hết hiệu lực";
            if (fromD || toD) return "Còn hiệu lực";
            return "";
        };

        return rows.map(function (r) {
            if (!r) return r;

            // Đơn vị hiển thị
            if (!r.ORG_NAME && (r.ORG_ID || r.ORG_UNIT_ID)) {
                r.ORG_NAME = lookupOrgName(r.ORG_ID || r.ORG_UNIT_ID);
            }

            // Trạng thái QHLD (map code -> name)
            if (!r.EMPLOYMENT_STATUS_CODE_NAME && r.EMPLOYMENT_STATUS_CODE) {
                r.EMPLOYMENT_STATUS_CODE_NAME = getOptionText("dropTrangThaiQuanHe", r.EMPLOYMENT_STATUS_CODE);
            }
            // Fallback theo ngày hiệu lực (khi chưa map được tên)
            if (!r.EMPLOYMENT_STATUS_CODE_NAME) {
                var fromStr = r.EMPLOYMENT_EFFECTIVE_FROM || r.EFFECTIVE_FROM;
                var toStr = r.EMPLOYMENT_EFFECTIVE_TO || r.EFFECTIVE_TO;
                var computed = computeEffectiveStatusName(fromStr, toStr);
                if (computed) r.EMPLOYMENT_STATUS_CODE_NAME = computed;
            }

            // Loại QHLD (map code -> name)
            if (!r.EMPLOYMENT_TYPE_CODE_NAME && r.EMPLOYMENT_TYPE_CODE) {
                r.EMPLOYMENT_TYPE_CODE_NAME = getOptionText("dropLoaiQuanHe", r.EMPLOYMENT_TYPE_CODE);
            }

            return r;
        });
    },

    fetchEmploymentById: function (employmentId, callback) {
        var me = this;
        if (!employmentId) {
            if (typeof callback === "function") callback("missing employmentId");
            return;
        }

        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeBCwxLS44LCQvNR4DOB4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Employment_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': employmentId,
        };

        edu.system.makeRequest({
            success: function (data) {
                try {
                    if (data && data.Success) {
                        var detail = (data.Data && data.Data.length) ? data.Data[0] : null;
                        if (typeof callback === "function") callback(null, detail);
                        return;
                    }
                } catch (e) { }
                if (typeof callback === "function") callback((data && data.Message) ? data.Message : "error");
            },
            error: function (er) {
                if (typeof callback === "function") callback(JSON.stringify(er));
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    enrichEmploymentRowsFromDetails: function (rows, done) {
        var me = this;
        if (!Array.isArray(rows) || rows.length === 0) {
            if (typeof done === "function") done([]);
            return;
        }

        var enriched = [];
        var i = 0;
        var next = function () {
            if (i >= rows.length) {
                try { enriched = me.normalizeEmploymentRows(enriched); } catch (e) { }
                if (typeof done === "function") done(enriched);
                return;
            }

            var r = rows[i++];
            if (!r || !r.ID) {
                enriched.push(r);
                next();
                return;
            }

            me.fetchEmploymentById(r.ID, function (err, detail) {
                if (!err && detail) {
                    // Soft-delete: backend vẫn trả bản ghi nhưng IS_ACTIVE=0 => coi như đã xóa
                    if (detail.IS_ACTIVE === 0 || detail.IS_ACTIVE === "0") {
                        next();
                        return;
                    }
                    enriched.push({
                        ID: detail.ID,
                        EMPLOYMENT_TYPE_CODE: detail.EMPLOYMENT_TYPE_CODE,
                        EMPLOYMENT_TYPE_CODE_NAME: detail.EMPLOYMENT_TYPE_CODE_NAME,
                        EMPLOYMENT_STATUS_CODE: detail.EMPLOYMENT_STATUS_CODE,
                        EMPLOYMENT_STATUS_CODE_NAME: detail.EMPLOYMENT_STATUS_CODE_NAME,
                        LEGAL_ENTITY_ID: detail.LEGAL_ENTITY_ID,
                        LEGAL_ENTITY_NAME: detail.LEGAL_ENTITY_NAME,
                        EFFECTIVE_FROM: detail.EFFECTIVE_FROM,
                        EFFECTIVE_TO: detail.EFFECTIVE_TO,
                        IS_PRIMARY: detail.IS_PRIMARY
                    });
                } else if (!err && !detail) {
                    // Record was deleted or no longer visible; drop it from the list
                } else {
                    enriched.push(r);
                }
                next();
            });
        };

        next();
    },

    init: function () {
        var me = this;
        // Đồng bộ vai trò: core đang dùng edu.system.appId (vai trò/ứng dụng).
        // Một số module (cũ) lại đọc edu.system.strVaiTro_Id -> gán fallback ngay tại trang này.
        try {
            if (edu && edu.system) {
                if (!edu.system.strVaiTro_Id) {
                    edu.system.strVaiTro_Id = me.getVaiTroId();
                }
            }
        } catch (e) { }

        try {
            window.__QHLD_VERSION__ = me.version;
            console.log('[QHLD]', me.version, {
                appId: edu && edu.system ? edu.system.appId : undefined,
                strVaiTro_Id: edu && edu.system ? edu.system.strVaiTro_Id : undefined,
                resolvedVaiTroId: me.getVaiTroId()
            });
        } catch (e) { }
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        // Load tab đầu tiên
        me.getList_ChuaQH();
        
        // Load các danh mục
        edu.system.loadToCombo_DanhMucDuLieu("CORE.QUANHELAODONG.LOAI", "dropLoaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("CORE.QUANHELAODONG.TRANGTHAI", "dropTrangThaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_EMPLOYMENT.CONTRACT_TYPE_CODE", "dropLoaiHopDong");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_EMPLOYMENT.STAFF_CODE_STATUS_CODE", "dropTrangThaiNguonMaSo");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_EMPLOYMENT.WORKING_TIME_MODE_CODE", "dropCheDoThoiGian");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_EMPLOYMENT.WORK_ARRANGEMENT_CODE", "dropHinhThucBoTri");

        // Combo cho form Phân công nhiệm vụ
        edu.system.loadToCombo_DanhMucDuLieu("CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE", "dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_ASSIGNMENT.ASSIGNMENT_STATUS_CODE", "dropTrangThaiPhanCong");

        me.getList_DonVi();

        // Sự kiện khi click vào các tab
        $('li[data-bs-target="#tab_1"]').on('click', function () {
            me.getList_ChuaQH();
        });
        $('li[data-bs-target="#tab_2"]').on('click', function () {
            me.getList_CoQH();
        });
        $('li[data-bs-target="#tab_3"]').on('click', function () {
            me.getList_NghiViec();
        });

        $("#btnSearch").click(function () {
            me.getList_CoCauToChuc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CoCauToChuc();
            }
        });
        $('#dropSearch_LoaiDonVi').on('select2:select', function () {
            me.getList_CoCauToChuc();
        });

        $("#tblChuaQH,#tblCoQH,#tblNghiViec").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtQuanHeLaoDong.find(e => e.ID == strId);
            me["strNhanSu_Id"] = data.ID;
            me["currentNhanSu"] = data;
            me["currentEmploymentId"] = '';
            me["currentQuanHe"] = null;
            me["currentOrgUnitForPosition"] = '';
            $("#lblNguoiQH").html(data.FULL_NAME + " - " + data.CURRENT_EMPLOYEE_CODE);

            // Chỉ hiển thị cột Phân công nhiệm vụ khi mở từ tab "Có QHLD còn hiệu lực"
            var sourceTable = $(this).closest('table').attr('id');
            if (sourceTable === 'tblCoQH') {
                $("#colPhanCong").show();
                $("#colQuanHe").removeClass('col-lg-12').addClass('col-lg-6').css('border-right', '1px solid #eee');
            } else {
                $("#colPhanCong").hide();
                $("#colQuanHe").removeClass('col-lg-6').addClass('col-lg-12').css('border-right', 'none');
            }

            // reset cột phân công
            try { $("#lblQHLD_DaChon").text(" - (Chọn 1 quan hệ lao động bên trái)"); } catch (e) { }
            try {
                $("#tblNhiemVu tbody").empty();
                me.dtNhiemVu = [];
            } catch (e) { }
            me.getList_QuanHe();
            $("#modalQuanHe").modal("show");
        });
        $("#tblQuanHe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me["strQuanHe_Id"] = strId;
            me.getDetail_QuanHe(strId);
        });
        $("#btnAdd_QuanHe").click(function () {
            me["strQuanHe_Id"] = "";
            edu.util.viewValById("dropLoaiQuanHe", "");
            edu.util.viewValById("dropTrangThaiQuanHe", "");
            edu.util.viewValById("dropDonViSuDung", "");
            edu.util.viewValById("dropDonViQuanLy", "");
            edu.util.viewValById("dropPhapNhan", "");
            edu.util.viewValById("dropLoaiHopDong", "");
            edu.util.viewValById("dropTrangThaiNguonMaSo", "");
            edu.util.viewValById("txtMaSo", "");
            edu.util.viewValById("txtNgayCapMaNhanSu", "");
            edu.util.viewValById("txtLyDoBatDau", "");
            edu.util.viewValById("txtLyDoKetThuc", "");
            edu.util.viewValById("dropCheDoThoiGian", "");
            edu.util.viewValById("dropHinhThucBoTri", "");
            edu.util.viewValById("txtSoQuanHe", "");
            edu.util.viewValById("dropQuanHeChinh", "");
            edu.util.viewValById("txtNgayBatDau", "");
            edu.util.viewValById("txtNgayKetThuc", "");
            edu.util.viewValById("dropQuyetDinh", "");
            edu.util.viewValById("txtGhiChu", "");
            $("#modalAddQuanHe").modal("show");
        });
        $("#btnSave_QuanHe").click(function () {
            me.save_QuanHe();
        });
        $("#btnDelete_QuanHe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanHe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuanHe(arrChecked_Id[i]);
                }
            });
        });

        // Hàm chọn QHLD theo row <tr>
        var selectQHLDRow = function ($tr, opts) {
            if (!$tr || !$tr.length) return;
            opts = opts || {};
            var rowIdx = $tr.index();
            var data = (me.dtQuanHe || [])[rowIdx];
            if (!data) return;

            me["currentEmploymentId"] = data.ID;
            me["currentQuanHe"] = data;
            me["currentOrgUnitForPosition"] = data.EMPLOYER_ORG_ID || data.ORG_ID || data.ORG_UNIT_ID || '';

            $("#tblQuanHe tbody tr").removeClass("row-selected");
            $tr.addClass("row-selected");

            // Đồng bộ checkbox: tick đúng row đang chọn (bỏ tick row khác) để có feedback trực quan
            if (!opts.skipCheckSync) {
                $("#tblQuanHe tbody input[type='checkbox']").prop('checked', false);
                $tr.find("input[type='checkbox']").prop('checked', true);
            }

            var nameQH = data.EMPLOYMENT_TYPE_CODE_NAME || '';
            $("#lblQHLD_DaChon").text(nameQH ? (" - " + nameQH) : " - (đã chọn)");
            me.getList_NhiemVu();
        };

        // Click row tblQuanHe => chọn QHLD (trừ khi click vào nút Sửa)
        $("#tblQuanHe").delegate("tbody tr", "click", function (e) {
            if ($(e.target).closest('.btnEdit').length) return;
            var isCheckboxClick = $(e.target).is('input[type="checkbox"]');
            selectQHLDRow($(this), { skipCheckSync: isCheckboxClick });
        });

        // Thêm phân công
        $("#btnAdd_NhiemVu").click(function () {
            if (!me.currentEmploymentId) {
                edu.system.alert("Vui lòng chọn 1 quan hệ lao động bên trái trước!", "w");
                return;
            }
            me["strNhiemVu_Id"] = "";
            // Mặc định đơn vị phân công = đơn vị của QHLD đã chọn
            var defaultOrg = me.currentOrgUnitForPosition || '';
            $("#dropDonVi_NV").val(defaultOrg).trigger('change');
            try { $("#dropViTri").html('<option value="">Chọn vị trí</option>'); } catch (e) { }
            $("#dropViTri").val("").trigger('change');
            $("#dropPhanLoai").val("").trigger('change');
            $("#dropTrangThaiPhanCong").val("").trigger('change');
            edu.util.viewValById("txtNgayHieuLuc", "");
            edu.util.viewValById("txtNgayHetHieuLuc", "");
            try { $('#chkChinhThuc').prop('checked', true); } catch (e) { }
            edu.util.viewValById("txtNote", "");

            if (defaultOrg) me.getList_ViTri(defaultOrg);

            $("#modalAddNhiemVu .modal-header .title .myModalLabel_NV").html('<i class="fa fa-plus"></i>');
            $("#modalAddNhiemVu").modal("show");
        });

        // Đổi đơn vị trong form phân công => reload vị trí
        var onDonVi_NV_Changed = function () {
            try {
                $("#dropViTri").val("").trigger('change');
                try { $("#dropViTri").html('<option value="">Chọn vị trí</option>'); } catch (e2) { }
                var orgId = edu.system.getValById('dropDonVi_NV');
                if (orgId) me.getList_ViTri(orgId);
            } catch (e) { }
        };
        $('#dropDonVi_NV').on('change', onDonVi_NV_Changed);
        $('#dropDonVi_NV').on('select2:select', onDonVi_NV_Changed);

        // Lưu phân công
        $("#btnSave_NhiemVu").click(function () {
            me.save_NhiemVu();
        });

        // Sửa 1 dòng phân công
        $("#tblNhiemVu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me["strNhiemVu_Id"] = strId;
            me.getDetail_Assignment(strId);
        });

        // Xóa phân công
        $("#btnDelete_NhiemVu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhiemVu", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NhiemVu(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch_ChuaQH").click(function () {
            me.getList_ChuaQH();
        });
        $("#txtSearch_ChuaQH").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChuaQH();
            }
        });

        $("#btnSearch_CoQH").click(function () {
            me.getList_CoQH();
        });
        $("#txtSearch_CoQH").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CoQH();
            }
        });

        $("#btnSearch_NghiViec").click(function () {
            me.getList_NghiViec();
        });
        $("#txtSearch_NghiViec").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NghiViec();
            }
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ChuaQH: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HhEkMzIuLx4CKTQgHgIuHgQsMS0uOCwkLzUP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Person_Chua_Co_Employment',
            'iM': edu.system.iM,
            'strKeyword': edu.system.getValById('txtSearch_ChuaQH'),
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = me.normalizePersonListRows(data.Data || []);
                    me["dtQuanHeLaoDong"] = dtReRult;
                    me.genTable_QuanHeLaoDong(dtReRult, data.Pager, "tblChuaQH");

                    // Combo danh mục load async; rerender 1 nhịp để map tên trạng thái
                    setTimeout(function () {
                        try {
                            var re = me.normalizePersonListRows(me.dtQuanHeLaoDong || []);
                            me.dtQuanHeLaoDong = re;
                            me.genTable_QuanHeLaoDong(re, data.Pager, "tblChuaQH");
                        } catch (e) { }
                    }, 300);
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
    getList_CoQH: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HhEkMzIuLx4CLh4ELDEtLjgsJC81',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Person_Co_Employment',
            'iM': edu.system.iM,
            'strKeyword': edu.system.getValById('txtSearch_CoQH'),
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];

                    // Lọc lại để tránh trường hợp package list trả "Có QHLD" nhưng thực tế không có bản ghi hợp lệ
                    // (không có employment id hoặc đã soft-delete)
                    dtReRult = dtReRult.filter(function (x) {
                        if (!x) return false;
                        var employmentId = x.CORE_EMPLOYMENT_ID || x.EMPLOYMENT_ID || x.EMPLOYMENT_Id;
                        if (!employmentId) return false;
                        var isActive = (x.EMPLOYMENT_IS_ACTIVE != null) ? x.EMPLOYMENT_IS_ACTIVE : x.IS_ACTIVE;
                        if (isActive === 0 || isActive === "0") return false;
                        return true;
                    });

                    dtReRult = me.normalizePersonListRows(dtReRult);
                    me["dtQuanHeLaoDong"] = dtReRult;
                    me.genTable_QuanHeLaoDong(dtReRult, data.Pager, "tblCoQH");

                    // Combo danh mục load async; rerender 1 nhịp để map tên trạng thái
                    setTimeout(function () {
                        try {
                            var re = me.normalizePersonListRows(me.dtQuanHeLaoDong || []);
                            me.dtQuanHeLaoDong = re;
                            me.genTable_QuanHeLaoDong(re, data.Pager, "tblCoQH");
                        } catch (e) { }
                    }, 300);
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
    getList_NghiViec: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HhEkMzIuLx4FIB4PJikoHhcoJCIP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Person_Da_Nghi_Viec',
            'iM': edu.system.iM,
            'strKeyword': edu.system.getValById('txtSearch_NghiViec'),
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = me.normalizePersonListRows(data.Data || []);
                    me["dtQuanHeLaoDong"] = dtReRult;
                    me.genTable_QuanHeLaoDong(dtReRult, data.Pager, "tblNghiViec");

                    // Combo danh mục load async; rerender 1 nhịp để map tên trạng thái
                    setTimeout(function () {
                        try {
                            var re = me.normalizePersonListRows(me.dtQuanHeLaoDong || []);
                            me.dtQuanHeLaoDong = re;
                            me.genTable_QuanHeLaoDong(re, data.Pager, "tblNghiViec");
                        } catch (e) { }
                    }, 300);
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
    genTable_QuanHeLaoDong: function (data, iPager, strTable_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.CoCauToChuc.getList_CongViec()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CURRENT_EMPLOYEE_CODE"
                },
                {
                    "mDataProp": "FULL_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        var ngaySinh = '';
                        if (aData.DATE_OF_BIRTH) {
                            ngaySinh = aData.DATE_OF_BIRTH;
                        } else if (aData.BIRTH_DAY && aData.BIRTH_MONTH && aData.BIRTH_YEAR) {
                            ngaySinh = aData.BIRTH_DAY + '/' + aData.BIRTH_MONTH + '/' + aData.BIRTH_YEAR;
                        }
                        return ngaySinh;
                    }
                },
                {
                    "mDataProp": "GENDER_NAME"
                },
                {
                    "mDataProp": "CCCD"
                },
                {
                    "mDataProp": "ORG_NAME"
                },
                {
                    "mDataProp": "POSITION_NAME"
                },
                {
                    "mDataProp": "STATUS_CODE_NAME"
                },
                {
                    "mDataProp": "EMPLOYMENT_STATUS_CODE_NAME"
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
        
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_QuanHe: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/CC8yHgIuMyQeBCwxLS44LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Ins_Core_Employment',
            'iM': edu.system.iM,
            'strId': me.strQuanHe_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strPerson_Id': me["strNhanSu_Id"],
            'strEmployment_Type_Code': edu.system.getValById('dropLoaiQuanHe'),
            'strEmployment_Status_Code': edu.system.getValById('dropTrangThaiQuanHe'),
            'strWorking_Time_Mode_Code': edu.system.getValById('dropCheDoThoiGian'),
            'strStaff_Code': edu.system.getValById('txtMaSo'),
            'strStaff_Code_Status_Code': edu.system.getValById('dropTrangThaiNguonMaSo'),
            'strStaff_Code_Issued_At': edu.system.getValById('txtNgayCapMaNhanSu'),
            'strOrg_Id': edu.system.getValById('dropDonViSuDung'),
            // Optional: nếu backend có hỗ trợ lưu "đơn vị quản lý" thì nhận field này
            'strManaging_Org_Id': edu.system.getValById('dropDonViQuanLy'),
            'strLegal_Entity_Id': edu.system.getValById('dropPhapNhan'),
            'dIs_Primary': edu.system.getValById('dropQuanHeChinh'),
            'strEffective_From': edu.system.getValById('txtNgayBatDau'),
            'strEffective_To': edu.system.getValById('txtNgayKetThuc'),
            'strSource_Event_Id': edu.system.getValById('dropQuyetDinh'),
            'strNote': edu.system.getValById('txtGhiChu'),
            'dIs_Active': 1,
            'strCreated_By': edu.system.userId,
            'strDecision_Id': edu.system.getValById('dropQuyetDinh'),
            'strEmployment_No': edu.system.getValById('txtSoQuanHe'),
            'strStart_Reason_Code': edu.system.getValById('txtLyDoBatDau'),
            'strEnd_Reason_Code': edu.system.getValById('txtLyDoKetThuc'),
            'strContract_Type_Code': edu.system.getValById('dropLoaiHopDong'),
            'strWork_Arrangement_Code': edu.system.getValById('dropHinhThucBoTri'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu4_MH/FDElHgIuMyQeBCwxLS44LCQvNQPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_04.Upd_Core_Employment';
            obj_save.strUpdated_By = edu.system.userId;
            delete obj_save.strCreated_By;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    // Cache đơn vị quản lý theo employmentId (để mở lại không bị reset về default)
                    try {
                        var returnedId = obj_save.strId;
                        if (!returnedId) {
                            if (typeof data.Data === "string") returnedId = data.Data;
                            else if (typeof data.Data === "number") returnedId = data.Data.toString();
                            else if (data.Data && (data.Data.ID || data.Data.Id)) returnedId = data.Data.ID || data.Data.Id;
                            else if (data.Data && data.Data[0] && (data.Data[0].ID || data.Data[0].Id)) returnedId = data.Data[0].ID || data.Data[0].Id;
                        }
                        if (returnedId) {
                            var managingOrgVal = edu.system.getValById('dropDonViQuanLy');
                            if (managingOrgVal) {
                                localStorage.setItem("QHLD_MANAGING_ORG_" + returnedId, managingOrgVal);
                            }
                        }
                    } catch (e) { }

                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#modalAddQuanHe").modal("hide");
                    me.getList_QuanHe();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuanHe: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeBCwxLS44LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Employment',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': me["strNhanSu_Id"],
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var rows = data.Data;
                    var fromListApi = Array.isArray(rows) && rows.length > 0;

                    if (!fromListApi) {
                        rows = me.buildQuanHeFromPersonList();
                        // Khi list API trả rỗng, dùng By_Id để lấy chi tiết nhằm hiển thị đúng sau khi sửa/cập nhật.
                        me.enrichEmploymentRowsFromDetails(rows, function (enriched) {
                            enriched = me.normalizeEmploymentRows(enriched);
                            me["dtQuanHe"] = enriched;
                            me.genTable_QuanHe(enriched, enriched.length);
                        });
                        return;
                    }

                    rows = me.normalizeEmploymentRows(rows);
                    me["dtQuanHe"] = rows;
                    me.genTable_QuanHe(rows, rows.length);
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
    delete_QuanHe: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BSQtHgIuMyQeBCwxLS44LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Del_Core_Employment',
            'iM': edu.system.iM,
            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanHe();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_QuanHe: function (strId) {
        var me = this;
        me["strQuanHe_Id"] = strId;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeBCwxLS44LCQvNR4DOB4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Employment_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': strId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var detail = (data.Data && data.Data.length) ? data.Data[0] : null;
                    if (!detail) {
                        edu.system.alert("Không lấy được chi tiết quan hệ lao động!", "w");
                        return;
                    }

                    var setSelect = function (id, value) {
                        var v = (value === null || value === undefined) ? "" : value;
                        edu.util.viewValById(id, v);
                        try { $("#" + id).val(v).trigger('change'); } catch (e) { }
                    };
                    var setInput = function (id, value) {
                        var v = (value === null || value === undefined) ? "" : value;
                        edu.util.viewValById(id, v);
                    };

                    // API có thể trả theo 2 dạng tên cột khác nhau (module khác vs module này)
                    setSelect("dropLoaiQuanHe", detail.EMPLOYMENT_TYPE_CODE);
                    setSelect("dropTrangThaiQuanHe", detail.EMPLOYMENT_STATUS_CODE);

                    // Đơn vị ký HĐ
                    var employerOrgId = detail.EMPLOYER_ORG_ID || detail.ORG_ID || detail.ORG_UNIT_ID;
                    setSelect("dropDonViSuDung", employerOrgId);

                    // Đơn vị quản lý: chỉ set nếu backend có trả. Không ép = đơn vị ký HĐ.
                    var managingOrgId = detail.MANAGING_ORG_ID || detail.MANAGER_ORG_ID || detail.MANAGING_ORG_UNIT_ID || "";
                    if (managingOrgId) {
                        setSelect("dropDonViQuanLy", managingOrgId);
                    }
                    // Fallback theo cache (theo employment id) để tránh bị reset về mặc định
                    try {
                        var cacheKey = "QHLD_MANAGING_ORG_" + detail.ID;
                        var cachedManagingOrg = localStorage.getItem(cacheKey);
                        if (cachedManagingOrg) {
                            setSelect("dropDonViQuanLy", cachedManagingOrg);
                        }
                    } catch (e) { }

                    setSelect("dropPhapNhan", detail.LEGAL_ENTITY_ID);
                    setSelect("dropLoaiHopDong", detail.CONTRACT_TYPE_CODE);
                    setSelect("dropTrangThaiNguonMaSo", detail.STAFF_CODE_STATUS_CODE);
                    setInput("txtMaSo", detail.STAFF_CODE);

                    // Ngày cấp mã nhân sự
                    setInput("txtNgayCapMaNhanSu", detail.STAFF_CODE_ISSUED_AT || detail.STAFF_CODE_ISSUED_DATE);

                    // Lý do
                    setInput("txtLyDoBatDau", detail.START_REASON_CODE || detail.START_REASON);
                    setInput("txtLyDoKetThuc", detail.END_REASON_CODE || detail.END_REASON);

                    setSelect("dropCheDoThoiGian", detail.WORKING_TIME_MODE_CODE);
                    setSelect("dropHinhThucBoTri", detail.WORK_ARRANGEMENT_CODE);

                    // Số quan hệ
                    setInput("txtSoQuanHe", detail.EMPLOYMENT_NO || detail.EMPLOYMENT_NUMBER);

                    setSelect("dropQuanHeChinh", detail.IS_PRIMARY);
                    setInput("txtNgayBatDau", detail.EFFECTIVE_FROM);
                    setInput("txtNgayKetThuc", detail.EFFECTIVE_TO);

                    // Quyết định / nguồn sự kiện
                    setSelect("dropQuyetDinh", detail.DECISION_ID || detail.SOURCE_EVENT_ID);
                    setInput("txtGhiChu", detail.NOTE);

                    $("#modalAddQuanHe").modal("show");
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
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuanHe: function (data, iPager) {
        $("#lblQuanHe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanHe",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.CoCauToChuc.getList_QuanHe()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "EMPLOYMENT_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "LEGAL_ENTITY_NAME"
                },
                {
                    "mDataProp": "EMPLOYMENT_STATUS_CODE_NAME"
                },
                {
                    "mDataProp": "EFFECTIVE_FROM"
                },
                {
                    "mDataProp": "EFFECTIVE_TO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_PRIMARY == 1 ? 'Quan hệ chính' : '';
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

        /*III. Callback*/
    },

    getList_DonVi: function () {
        var me = this;
        // Lấy ngày hiện tại theo định dạng dd/mm/yyyy
        var today = new Date();
        var strNgayXem = ("0" + today.getDate()).slice(-2) + "/" + 
                         ("0" + (today.getMonth() + 1)).slice(-2) + "/" + 
                         today.getFullYear();

        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHg4zJh4ULyg1',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strOrg_Type_Code': '',
            'dIs_Offcial': 1,
            'dIs_Active': 1,
            'strNgayXem': strNgayXem,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDonVi = data.Data || [];

                    // IMPORTANT (page-only): load từng combo riêng để tránh core loadToCombo_data
                    // dùng default_val bị "lan" giữa các dropdown khiến 2 ô tự giống nhau.
                    var comboObj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "NAME",
                            code: "",
                            avatar: ""
                        },
                        type: "",
                        title: "Chọn đơn vị",
                    };
                    edu.system.loadToCombo_data($.extend({}, comboObj, { renderPlace: ["dropDonViSuDung"] }));
                    edu.system.loadToCombo_data($.extend({}, comboObj, { renderPlace: ["dropDonViQuanLy"] }));
                    edu.system.loadToCombo_data($.extend({}, comboObj, { renderPlace: ["dropPhapNhan"] }));
                    edu.system.loadToCombo_data($.extend({}, comboObj, { renderPlace: ["dropDonVi_NV"] }));
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
    --Discription: Assignment (Phân công nhiệm vụ)
    -------------------------------------------*/
    getList_ViTri: function (strOrg_Unit_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHhEuMig1KC4vAzgULyg1',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_PositionByUnit',
            'iM': edu.system.iM,
            'strOrg_Unit_Id': strOrg_Unit_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: { id: "ID", parentId: "", name: "POSITION_NAME", code: "", avatar: "" },
                        renderPlace: ["dropViTri"],
                        type: "",
                        title: "Chọn vị trí",
                    });
                } else {
                    edu.system.alert("Lỗi: " + data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert("Lỗi: " + JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    getList_NhiemVu: function () {
        var me = this;
        if (!me.currentEmploymentId) {
            me.dtNhiemVu = [];
            me.genTable_NhiemVu([]);
            return;
        }
        var strPersonId = (me.currentNhanSu && (me.currentNhanSu.PERSON_ID || me.currentNhanSu.ID)) || me.strNhanSu_Id || '';
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeADIyKCYvLCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Assignment',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': strPersonId,
            'strEmployment_Id': me.currentEmploymentId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var rows = data.Data || [];
                    rows = rows.filter(function (x) {
                        if (!x) return false;
                        return !(x.IS_ACTIVE === 0 || x.IS_ACTIVE === "0");
                    });
                    me["dtNhiemVu"] = rows;
                    me.genTable_NhiemVu(rows);
                } else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_NhiemVu: function (data) {
        var jsonForm = {
            strTable_Id: "tblNhiemVu",
            aaData: data,
            colPos: { center: [0] },
            aoColumns: [
                { "mDataProp": "POSITION_NAME" },
                { "mDataProp": "ASSIGNMENT_TYPE_CODE_NAME" },
                { "mDataProp": "EFFECTIVE_FROM" },
                { "mDataProp": "EFFECTIVE_TO" },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-edit color-active"></i></a></span>';
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

    save_NhiemVu: function () {
        var me = this;
        var aData = me.currentNhanSu;
        if (!aData || !me.currentEmploymentId) {
            edu.system.alert("Vui lòng chọn quan hệ lao động trước khi phân công!", "w");
            return;
        }
        if (!edu.system.getValById('dropViTri')) {
            edu.system.alert("Vui lòng chọn vị trí!");
            return;
        }
        if (!edu.system.getValById('dropPhanLoai')) {
            edu.system.alert("Vui lòng chọn loại phân công!");
            return;
        }
        if (!edu.system.getValById('txtNgayHieuLuc')) {
            edu.system.alert("Vui lòng nhập ngày bắt đầu hiệu lực!");
            return;
        }
        var strOrgId = edu.system.getValById('dropDonVi_NV');
        if (!strOrgId) {
            edu.system.alert("Vui lòng chọn đơn vị phân công!", "w");
            return;
        }
        var dIsPrimary = 0;
        try { dIsPrimary = $('#chkChinhThuc').is(':checked') ? 1 : 0; } catch (e) { dIsPrimary = 0; }

        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/CC8yHgIuMyQeADIyKCYvLCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Ins_Core_Assignment',
            'iM': edu.system.iM,
            'strId': me.strNhiemVu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strPerson_Id': aData.PERSON_ID || aData.ID,
            'strEmployment_Id': me.currentEmploymentId,
            'strAssignment_Type_Code': edu.system.getValById('dropPhanLoai'),
            'strAssignment_Status_Code': edu.system.getValById('dropTrangThaiPhanCong'),
            'strOrg_Id': strOrgId,
            'strPosition_Id': edu.system.getValById('dropViTri'),
            'dIs_Primary': dIsPrimary,
            'dFte_Ratio': 1,
            'strEffective_From': edu.system.getValById('txtNgayHieuLuc'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLuc'),
            'strDecision_Id': '',
            'strSource_Event_Id': '',
            'strNote': edu.system.getValById('txtNote') || '',
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu4_MH/FDElHgIuMyQeADIyKCYvLCQvNQPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_04.Upd_Core_Assignment';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(obj_save.strId ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    $("#modalAddNhiemVu").modal("hide");
                    me.getList_NhiemVu();
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er)); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    delete_NhiemVu: function (Ids) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BSQtHgIuMyQeADIyKCYvLCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Del_Core_Assignment',
            'iM': edu.system.iM,
            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                } else {
                    edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
                }
            },
            error: function (er) {
                edu.system.afterComfirm({ title: "", content: JSON.stringify(er), code: "w" });
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NhiemVu();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    getDetail_Assignment: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeADIyKCYvLCQvNR4DOB4IJQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Assignment_By_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Data && data.Data.length > 0) {
                    var detail = data.Data[0];
                    try {
                        var orgId = detail.ORG_ID || detail.ORG_UNIT_ID || detail.EMPLOYER_ORG_ID || '';
                        if (orgId) {
                            $("#dropDonVi_NV").val(orgId).trigger('change');
                            me.getList_ViTri(orgId);
                            setTimeout(function () {
                                $("#dropViTri").val(detail.POSITION_ID).trigger('change');
                            }, 350);
                        }
                    } catch (e) { }
                    if (!(detail.ORG_ID || detail.ORG_UNIT_ID || detail.EMPLOYER_ORG_ID)) {
                        $("#dropViTri").val(detail.POSITION_ID).trigger('change');
                    }
                    $("#dropPhanLoai").val(detail.ASSIGNMENT_TYPE_CODE).trigger('change');
                    $("#dropTrangThaiPhanCong").val(detail.ASSIGNMENT_STATUS_CODE).trigger('change');
                    edu.util.viewValById("txtNgayHieuLuc", detail.EFFECTIVE_FROM);
                    edu.util.viewValById("txtNgayHetHieuLuc", detail.EFFECTIVE_TO);
                    try {
                        var isPrimary = detail.IS_PRIMARY;
                        if (isPrimary == null) isPrimary = detail.D_IS_PRIMARY;
                        if (isPrimary == null) isPrimary = detail.IS_PRIMARY_ASSIGNMENT;
                        $('#chkChinhThuc').prop('checked', (isPrimary === 1 || isPrimary === '1' || isPrimary === true));
                    } catch (e) { }
                    try { edu.util.viewValById("txtNote", detail.NOTE || detail.NOTE_TEXT || detail.STR_NOTE || ""); } catch (e) { }
                    $("#modalAddNhiemVu .modal-header .title .myModalLabel_NV").html('<i class="fa fa-pencil"></i>');
                    $("#modalAddNhiemVu").modal("show");
                } else {
                    edu.system.alert("Không tìm thấy thông tin chi tiết!");
                }
            },
            error: function (er) { edu.system.alert("Lỗi: " + JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
}