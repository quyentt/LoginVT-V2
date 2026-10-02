/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function PhanCongLaoDong() { };
PhanCongLaoDong.prototype = {
    strCoCauToChuc_Id: '',
    dtCoCauToChuc: [],
    version: '1.0.0.5',

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

    ensureMappingCombos: function () {
        // Tạo combo ẩn để map tên trạng thái quan hệ lao động khi API chỉ trả CODE
        try {
            if ($("#dropHiddenTrangThaiQHLD").length === 0) {
                $("body").append('<select id="dropHiddenTrangThaiQHLD" style="display:none"></select>');
            }
            edu.system.loadToCombo_DanhMucDuLieu("CORE.QUANHELAODONG.TRANGTHAI", "dropHiddenTrangThaiQHLD");
        } catch (e) {
        }
    },

    normalizeEmploymentRows: function (rows) {
        var me = this;
        if (!Array.isArray(rows)) return [];

        var parseVNDate = function (s) {
            try {
                if (!s) return null;
                if (typeof s !== 'string') s = String(s);
                s = s.trim();
                // Expect dd/mm/yyyy
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
            // Nếu không có toD hoặc nằm trong khoảng
            if (fromD || toD) return "Còn hiệu lực";
            return "";
        };

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

        return rows.map(function (r) {
            if (!r) return r;
            // Soft-delete: nếu API có cờ active thì bỏ các bản ghi đã xóa
            if (r.IS_ACTIVE === 0 || r.IS_ACTIVE === "0") return null;
            // Legal entity
            if (!r.LEGAL_ENTITY_NAME && r.LEGAL_ENTITY_ID) {
                r.LEGAL_ENTITY_NAME = lookupOrgName(r.LEGAL_ENTITY_ID);
            }
            // Status name
            if (!r.EMPLOYMENT_STATUS_CODE_NAME && r.EMPLOYMENT_STATUS_CODE) {
                r.EMPLOYMENT_STATUS_CODE_NAME = getOptionText("dropHiddenTrangThaiQHLD", r.EMPLOYMENT_STATUS_CODE);
            }
            // Fallback theo ngày hiệu lực nếu vẫn chưa map được tên
            if (!r.EMPLOYMENT_STATUS_CODE_NAME) {
                var fromStr = r.EMPLOYMENT_EFFECTIVE_FROM || r.EFFECTIVE_FROM;
                var toStr = r.EMPLOYMENT_EFFECTIVE_TO || r.EFFECTIVE_TO;
                var computed = computeEffectiveStatusName(fromStr, toStr);
                if (computed) r.EMPLOYMENT_STATUS_CODE_NAME = computed;
            }
            // Type name (page đã có combo CORE.QUANHELAODONG.LOAI)
            if (!r.EMPLOYMENT_TYPE_CODE_NAME && r.EMPLOYMENT_TYPE_CODE) {
                r.EMPLOYMENT_TYPE_CODE_NAME = getOptionText("dropSearch_QuanHe", r.EMPLOYMENT_TYPE_CODE);
            }
            return r;
        }).filter(function (x) { return !!x; });
    },

    buildQuanHeFromPersonList: function (personId) {
        var me = this;
        var pid = personId || (me.currentNhanSu && (me.currentNhanSu.PERSON_ID || me.currentNhanSu.ID)) || "";
        if (!pid) return [];

        // Nguồn ưu tiên: row đang chọn -> danh sách phân công
        var source = (me.currentNhanSu && (me.currentNhanSu.PERSON_ID || me.currentNhanSu.ID) == pid) ? me.currentNhanSu : null;
        if (!source && Array.isArray(me.dtPhanCongLaoDong)) {
            source = me.dtPhanCongLaoDong.find(function (x) {
                return x && ((x.PERSON_ID || x.ID) == pid);
            });
        }
        if (!source) return [];

        // Person list trả CORE_EMPLOYMENT_ID/EMPLOYMENT_ID + EMPLOYMENT_* (join)
        var employmentId = source.CORE_EMPLOYMENT_ID || source.EMPLOYMENT_ID || source.EMPLOYMENT_Id;
        if (!employmentId) return [];

        // Soft-delete: nếu nguồn list có cờ active thì bỏ các bản ghi đã xóa
        var isActive = (source.EMPLOYMENT_IS_ACTIVE != null) ? source.EMPLOYMENT_IS_ACTIVE : source.IS_ACTIVE;
        if (isActive === 0 || isActive === "0") return [];

        var employerOrgId = source.EMPLOYMENT_ORG_ID || source.ORG_ID || source.EMPLOYER_ORG_ID;
        return [
            {
                ID: employmentId,
                PERSON_ID: pid,
                EMPLOYMENT_TYPE_CODE: source.EMPLOYMENT_TYPE_CODE,
                EMPLOYMENT_TYPE_CODE_NAME: source.EMPLOYMENT_TYPE_CODE_NAME,
                EMPLOYMENT_STATUS_CODE: source.EMPLOYMENT_STATUS_CODE,
                EMPLOYMENT_STATUS_CODE_NAME: source.EMPLOYMENT_STATUS_CODE_NAME,
                LEGAL_ENTITY_ID: source.LEGAL_ENTITY_ID,
                LEGAL_ENTITY_NAME: source.LEGAL_ENTITY_NAME,
                EMPLOYER_ORG_ID: employerOrgId,
                EFFECTIVE_FROM: source.EMPLOYMENT_EFFECTIVE_FROM || source.EFFECTIVE_FROM,
                EFFECTIVE_TO: source.EMPLOYMENT_EFFECTIVE_TO || source.EFFECTIVE_TO,
                IS_PRIMARY: source.EMPLOYMENT_IS_PRIMARY != null ? source.EMPLOYMENT_IS_PRIMARY : source.IS_PRIMARY
            }
        ];
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
                    if (typeof callback === "function") callback((data && data.Message) ? data.Message : "fetch failed");
                } catch (e) {
                    if (typeof callback === "function") callback(e);
                }
            },
            error: function (er) {
                if (typeof callback === "function") callback(er);
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
                if (typeof done === "function") done(enriched);
                return;
            }

            var baseRow = rows[i++] || {};
            var id = baseRow.ID;
            if (!id) {
                enriched.push(baseRow);
                next();
                return;
            }

            me.fetchEmploymentById(id, function (err, detail) {
                if (!err && detail) {
                    // Merge: ưu tiên detail, fallback baseRow cho các field hiển thị
                    var merged = $.extend({}, baseRow, detail);
                    merged.ID = detail.ID || detail.Id || baseRow.ID;
                    merged.EFFECTIVE_FROM = merged.EFFECTIVE_FROM || baseRow.EFFECTIVE_FROM;
                    merged.EFFECTIVE_TO = merged.EFFECTIVE_TO || baseRow.EFFECTIVE_TO;
                    merged.EMPLOYMENT_TYPE_CODE_NAME = merged.EMPLOYMENT_TYPE_CODE_NAME || baseRow.EMPLOYMENT_TYPE_CODE_NAME;
                    merged.EMPLOYMENT_STATUS_CODE_NAME = merged.EMPLOYMENT_STATUS_CODE_NAME || baseRow.EMPLOYMENT_STATUS_CODE_NAME;
                    merged.LEGAL_ENTITY_NAME = merged.LEGAL_ENTITY_NAME || baseRow.LEGAL_ENTITY_NAME;
                    merged.EMPLOYER_ORG_ID = merged.EMPLOYER_ORG_ID || merged.ORG_ID || baseRow.EMPLOYER_ORG_ID;
                    enriched.push(merged);
                } else {
                    enriched.push(baseRow);
                }
                next();
            });
        };

        next();
    },

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        // Đồng bộ vai trò: hệ thống đang dùng edu.system.appId (vai trò/ứng dụng).
        try {
            if (edu && edu.system && !edu.system.strVaiTro_Id) {
                edu.system.strVaiTro_Id = me.getVaiTroId();
            }
            window.__PCLD_VERSION__ = me.version;
            console.log('[PCLD]', me.version, {
                appId: edu && edu.system ? edu.system.appId : undefined,
                strVaiTro_Id: edu && edu.system ? edu.system.strVaiTro_Id : undefined,
                resolvedVaiTroId: me.getVaiTroId()
            });
        } catch (e) { }

        me.ensureMappingCombos();
        me.getList_PhanCongLaoDong();
        me.getList_DonVi_Search();
        edu.system.loadToCombo_DanhMucDuLieu("CORE.QUANHELAODONG.LOAI", "dropSearch_QuanHe,dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE", "dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("CORE_ASSIGNMENT.ASSIGNMENT_STATUS_CODE", "dropTrangThaiPhanCong");

        $("#btnSearch").click(function () {
            me.getList_PhanCongLaoDong();
        });
        $("#txtTuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhanCongLaoDong();
            }
        });
        $('#dropSearch_QuanHe').on('select2:select', function () {
            me.getList_PhanCongLaoDong();
        });
        $('#dropSearch_DonVi').on('select2:select', function () {
            me.getList_PhanCongLaoDong();
        });

        // Khi đổi đơn vị phân công thì reload danh sách vị trí theo đơn vị đó
        var onDonViPhanCongChanged = function () {
            try {
                // clear vị trí đang chọn để tránh lệch đơn vị
                $("#dropViTri").val("").trigger('change');
                // clear option cũ (nếu có) để tránh hiển thị vị trí của đơn vị khác
                try {
                    $("#dropViTri").html('<option value="">Chọn vị trí</option>');
                } catch (e2) { }
                var orgId = edu.system.getValById('dropDonVi');
                if (orgId) me.getList_ViTri(orgId);
            } catch (e) { }
        };
        $('#dropDonVi').on('change', onDonViPhanCongChanged);
        // nếu select được enhance bằng select2 thì bắt thêm event này
        $('#dropDonVi').on('select2:select', onDonViPhanCongChanged);

        $("#tblPhanCong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtPhanCongLaoDong.find(e => e.ID == strId);
            if (!data) {
                edu.system.alert("Không tìm thấy thông tin nhân sự!", "w");
                return;
            }

            var strPersonId = data.PERSON_ID || data.ID || strId;
            me["strNhanSu_Id"] = strPersonId;
            me["currentNhanSu"] = data;
            me["currentNhanSu"]["PERSON_ID"] = me["currentNhanSu"]["PERSON_ID"] || strPersonId;
            me["dtQuanHeLaoDong"] = [];
            
            // Hiển thị modal chọn quan hệ lao động
            var strTitle = data.FULL_NAME + " - " + data.CURRENT_EMPLOYEE_CODE;
            $("#modalChonQuanHe .modal-header .title").html('<i class="fa-solid fa-user"></i> Chọn quan hệ lao động - ' + strTitle);
            me.getList_QuanHeLaoDong(strPersonId);
            $("#modalChonQuanHe").modal("show");
        });
        
        $("#tblQuanHeLaoDong").delegate(".btnChon", "click", function () {
            var strEmploymentId = this.id;
            var dataQH = me.dtQuanHeLaoDong.find(e => e.ID == strEmploymentId);
            me["currentNhanSu"]["EMPLOYMENT_ID"] = strEmploymentId;
            me["currentNhanSu"]["EMPLOYMENT_TYPE_CODE_NAME"] = dataQH.EMPLOYMENT_TYPE_CODE_NAME;
            // Lưu đơn vị của quan hệ lao động đã chọn để dùng khi insert assignment (ORG_ID thường NOT NULL)
            me["currentNhanSu"]["EMPLOYER_ORG_ID"] = dataQH.EMPLOYER_ORG_ID || dataQH.ORG_ID || dataQH.ORG_UNIT_ID || me["currentNhanSu"]["EMPLOYER_ORG_ID"];
            me["currentOrgUnitForPosition"] = dataQH.EMPLOYER_ORG_ID || dataQH.ORG_ID || dataQH.ORG_UNIT_ID || me["currentOrgUnitForPosition"];
            
            // Đóng modal chọn quan hệ và mở modal nhiệm vụ
            $("#modalChonQuanHe").modal("hide");
            
            var strTitle = me.currentNhanSu.FULL_NAME + " - " + me.currentNhanSu.CURRENT_EMPLOYEE_CODE + " - " + dataQH.EMPLOYMENT_TYPE_CODE_NAME;
            $("#modalNhiemVu .modal-header .title").html('<i class="fa-solid fa-user"></i> ' + strTitle);
            me.getList_ViTri(dataQH.EMPLOYER_ORG_ID);
            me.getList_NhiemVu();
            $("#modalNhiemVu").modal("show");
        });
        $("#tblNhiemVu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me["strNhiemVu_Id"] = strId;
            me.getDetail_Assignment(strId);
        });
        $("#btnAdd_NhiemVu").click(function () {
            me["strNhiemVu_Id"] = "";
            $("#dropDonVi").val("").trigger('change');
            // reset vị trí cho tới khi chọn đơn vị
            try { $("#dropViTri").html('<option value="">Chọn vị trí</option>'); } catch (e) { }
            $("#dropViTri").val("").trigger('change');
            $("#dropPhanLoai").val("").trigger('change');
            $("#dropTrangThaiPhanCong").val("").trigger('change');
            edu.util.viewValById("txtNgayHieuLuc", "");
            edu.util.viewValById("txtNgayHetHieuLuc", "");

            // Mặc định: chính thức
            try { $('#chkChinhThuc').prop('checked', true); } catch (e) { }
            edu.util.viewValById("txtNote", "");

            $("#modalAddNhiemVu .modal-header .title .myModalLabel").html('<i class="fa fa-plus"></i>');
            $("#modalAddNhiemVu").modal("show");
        });
        $("#btnSave_NhiemVu").click(function () {
            me.save_NhiemVu();
        });
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
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_PhanCongLaoDong: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HhEkMzIuLx4CLh4ELDEtLjgsJC81',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Person_Co_Employment',
            'iM': edu.system.iM,
            'strKeyword': edu.system.getValById('txtTuKhoa'),
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];

                    var selectedEmploymentType = edu.system.getValById('dropSearch_QuanHe');
                    var selectedOrgId = edu.system.getValById('dropSearch_DonVi');

                    // Đồng bộ với trang Quan hệ lao động: chỉ hiển thị người thực sự có QHLD hợp lệ
                    // (có employment id và chưa soft-delete)
                    dtReRult = dtReRult.filter(function (x) {
                        if (!x) return false;
                        var employmentId = x.CORE_EMPLOYMENT_ID || x.EMPLOYMENT_ID || x.EMPLOYMENT_Id;
                        if (!employmentId) return false;
                        var isActive = (x.EMPLOYMENT_IS_ACTIVE != null) ? x.EMPLOYMENT_IS_ACTIVE : x.IS_ACTIVE;
                        if (isActive === 0 || isActive === "0") return false;

                        // Bộ lọc loại quan hệ lao động
                        if (selectedEmploymentType) {
                            var typeCode = x.EMPLOYMENT_TYPE_CODE || x.EMPLOYMENT_TYPE_Code || '';
                            var typeName = x.EMPLOYMENT_TYPE_CODE_NAME || x.EMPLOYMENT_TYPE_CODE_Name || '';
                            if (typeCode) {
                                if (typeCode != selectedEmploymentType) return false;
                            } else {
                                // fallback theo tên nếu backend chỉ trả name
                                var selectedText = '';
                                try { selectedText = ($('#dropSearch_QuanHe option:selected').text() || '').trim(); } catch (e) { }
                                if (selectedText && typeName && (typeName || '').trim() !== selectedText) return false;
                            }
                        }

                        // Bộ lọc đơn vị
                        if (selectedOrgId) {
                            var orgId = x.ORG_ID || x.ORG_UNIT_ID || x.EMPLOYMENT_ORG_ID || x.EMPLOYER_ORG_ID || '';
                            if (orgId) {
                                if (orgId != selectedOrgId) return false;
                            } else {
                                // fallback theo tên nếu backend chỉ trả ORG_NAME
                                var selectedOrgText = '';
                                try { selectedOrgText = ($('#dropSearch_DonVi option:selected').text() || '').trim(); } catch (e) { }
                                var orgName = (x.ORG_NAME || '').trim();
                                if (selectedOrgText && orgName && orgName !== selectedOrgText) return false;
                            }
                        }
                        return true;
                    });

                    dtReRult = me.normalizeEmploymentRows(dtReRult);
                    me["dtPhanCongLaoDong"] = dtReRult;
                    me.genTable_PhanCongLaoDong(dtReRult, data.Pager, "tblPhanCong");

                    // Combo trạng thái QHLD load async; rerender 1 nhịp để map tên trạng thái
                    setTimeout(function () {
                        try {
                            var re = me.normalizeEmploymentRows(me.dtPhanCongLaoDong || []);
                            me.dtPhanCongLaoDong = re;
                            me.genTable_PhanCongLaoDong(re, data.Pager, "tblPhanCong");
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
    genTable_PhanCongLaoDong: function (data, iPager, strTable_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                center: [0],
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
                    "mDataProp": "EMPLOYMENT_TYPE_CODE_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chọn"><i class="fa fa-hand-pointer color-active"></i> Chọn</a></span>';
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
    save_NhiemVu: function () {
        var me = this;
        // Lấy thông tin nhân viên và quan hệ lao động đã chọn
        var aData = me.currentNhanSu;

        if (!aData || !(aData.EMPLOYMENT_ID || aData.EMPLOYMENT_ID === 0)) {
            edu.system.alert("Vui lòng chọn quan hệ lao động trước khi phân công!", "w");
            return;
        }
        
        // Validate
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
        
        // Đơn vị phân công (bắt buộc khi insert assignment)
        var strPositionId = edu.system.getValById('dropViTri');
        var selectedOrgId = edu.system.getValById('dropDonVi');
        if (!selectedOrgId) {
            edu.system.alert("Vui lòng chọn đơn vị phân công!", "w");
            return;
        }
        var strOrgId = selectedOrgId;

        var dIsPrimary = 0;
        try { dIsPrimary = $('#chkChinhThuc').is(':checked') ? 1 : 0; } catch (e) { dIsPrimary = 0; }
        var strNote = edu.system.getValById('txtNote') || '';
        
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/CC8yHgIuMyQeADIyKCYvLCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Ins_Core_Assignment',
            'iM': edu.system.iM,
            'strId': me.strNhiemVu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strPerson_Id': aData.PERSON_ID || aData.ID,
            'strEmployment_Id': aData.EMPLOYMENT_ID,
            'strAssignment_Type_Code': edu.system.getValById('dropPhanLoai'),
            'strAssignment_Status_Code': edu.system.getValById('dropTrangThaiPhanCong'),
            'strOrg_Id': strOrgId,
            'strPosition_Id': strPositionId,
            'dIs_Primary': dIsPrimary,
            'dFte_Ratio': 1,
            'strEffective_From': edu.system.getValById('txtNgayHieuLuc'),
            'strEffective_To': edu.system.getValById('txtNgayHetHieuLuc'),
            'strDecision_Id': '',
            'strSource_Event_Id': '',
            'strNote': strNote,
            'dIs_Active': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu4_MH/FDElHgIuMyQeADIyKCYvLCQvNQPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_04.Upd_Core_Assignment'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#modalAddNhiemVu").modal("hide");
                    me.getList_NhiemVu();
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
    getList_NhiemVu: function () {
        var me = this;
        var aData = me.currentNhanSu;
        var strPersonId = (aData && (aData.PERSON_ID || aData.ID)) || '';
        var strEmploymentId = (aData && aData.EMPLOYMENT_ID) || '';
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeADIyKCYvLCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Assignment',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,

            'strPerson_Id': strPersonId,
            'strEmployment_Id': strEmploymentId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var rows = data.Data || [];
                    // Soft-delete: backend set IS_ACTIVE=0 => không hiển thị như đã xóa
                    rows = rows.filter(function (x) {
                        if (!x) return false;
                        return !(x.IS_ACTIVE === 0 || x.IS_ACTIVE === "0");
                    });
                    me["dtNhiemVu"] = rows;
                    me.genTable_NhiemVu(rows);
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
    delete_NhiemVu: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BSQtHgIuMyQeADIyKCYvLCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Del_Core_Assignment',
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
                    me.getList_NhiemVu();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
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
                    // Đơn vị phân công
                    try {
                        var orgId = detail.ORG_ID || detail.ORG_UNIT_ID || detail.EMPLOYER_ORG_ID || '';
                        if (orgId) {
                            $("#dropDonVi").val(orgId).trigger('change');
                            // chủ động load vị trí theo đơn vị
                            me.getList_ViTri(orgId);
                            // đợi combo vị trí load xong rồi set POSITION_ID
                            setTimeout(function () {
                                $("#dropViTri").val(detail.POSITION_ID).trigger('change');
                            }, 350);
                        }
                    } catch (e) { }
                    // fallback: nếu không có orgId thì vẫn set vị trí (trường hợp backend không trả org)
                    if (!(detail.ORG_ID || detail.ORG_UNIT_ID || detail.EMPLOYER_ORG_ID)) {
                        $("#dropViTri").val(detail.POSITION_ID).trigger('change');
                    }
                    $("#dropPhanLoai").val(detail.ASSIGNMENT_TYPE_CODE).trigger('change');
                    $("#dropTrangThaiPhanCong").val(detail.ASSIGNMENT_STATUS_CODE).trigger('change');
                    edu.util.viewValById("txtNgayHieuLuc", detail.EFFECTIVE_FROM);
                    edu.util.viewValById("txtNgayHetHieuLuc", detail.EFFECTIVE_TO);
                    // Chính thức
                    try {
                        var isPrimary = detail.IS_PRIMARY;
                        if (isPrimary == null) isPrimary = detail.D_IS_PRIMARY;
                        if (isPrimary == null) isPrimary = detail.IS_PRIMARY_ASSIGNMENT;
                        $('#chkChinhThuc').prop('checked', (isPrimary === 1 || isPrimary === '1' || isPrimary === true));
                    } catch (e) { }
                    // Note
                    try { edu.util.viewValById("txtNote", detail.NOTE || detail.NOTE_TEXT || detail.STR_NOTE || ""); } catch (e) { }
                    $("#modalAddNhiemVu .modal-header .title .myModalLabel").html('<i class="fa fa-pencil"></i>');
                    $("#modalAddNhiemVu").modal("show");
                }
                else {
                    edu.system.alert("Không tìm thấy thông tin chi tiết!");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
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
    genTable_NhiemVu: function (data, iPager) {
        $("#lblNhiemVu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhiemVu",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.CoCauToChuc.getList_NhiemVu()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "POSITION_NAME"
                },
                {
                    "mDataProp": "ASSIGNMENT_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "EFFECTIVE_FROM"
                },
                {
                    "mDataProp": "EFFECTIVE_TO"
                },
                {
                    "mDataProp": "EMPLOYMENT_TYPE_CODE_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-edit color-active"></i> Chi tiết</a></span>';
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

    getList_DonVi_Search: function () {
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
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "NAME",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_DonVi", "dropDonVi"],
                        type: "",
                        title: "Chọn đơn vị",
                    })
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
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "POSITION_NAME",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropViTri"],
                        type: "",
                        title: "Chọn vị trí",
                    })
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    
    getList_QuanHeLaoDong: function (strPersonId) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu4_MH/BiQ1HgIuMyQeBCwxLS44LCQvNQPP',
            'func': 'PKG_CORE_HOSONHANSU_04.Get_Core_Employment',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': me.getVaiTroId(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': strPersonId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var rows = data.Data;
                    var fromListApi = Array.isArray(rows) && rows.length > 0;

                    if (!fromListApi) {
                        rows = me.buildQuanHeFromPersonList(strPersonId);
                        me.enrichEmploymentRowsFromDetails(rows, function (enriched) {
                            enriched = me.normalizeEmploymentRows(enriched);
                            me["dtQuanHeLaoDong"] = enriched;
                            me.genTable_QuanHeLaoDong(enriched);
                        });
                        return;
                    }

                    rows = me.normalizeEmploymentRows(rows);
                    me["dtQuanHeLaoDong"] = rows;
                    me.genTable_QuanHeLaoDong(rows);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    
    genTable_QuanHeLaoDong: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanHeLaoDong",
            aaData: data,
            colPos: {
                center: [0],
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
                        return '<span><a class="btn btn-primary btnChon" id="' + aData.ID + '" title="Chọn phân nhiệm vụ"><i class="fa fa-check"></i> Chọn phân nhiệm vụ</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}