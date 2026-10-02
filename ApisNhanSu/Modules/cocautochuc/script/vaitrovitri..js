/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ViTriCongViec() { };
ViTriCongViec.prototype = {
    strCoCauToChuc_Id: '',
    dtCoCauToChuc: [],
    _suggestTimer: null,
    _suggestLastKeyword: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#txtSearch_NgayXem").val(edu.util.dateToday());
        me.getList_CoCauToChuc();
        me.getList_NgheNghiep();
        edu.system.loadToCombo_DanhMucDuLieu("CORE.DONVI.LOAIQUANHE", "dropSearch_LoaiDonVi");
        edu.system.loadToCombo_DanhMucDuLieu("CORE.DONVI.LOAIVITRI", "dropPhanLoai");
        me.loadCombo_LoaiQHLD();

        $('li[data-bs-target="#tab_2"]').on('click', function () {
            var $drop = $("#dropSearch_LoaiQHLD");
            if ($drop.find("option").length <= 1) {
                me.loadCombo_LoaiQHLD();
            }
        });
        me.loadCombo_LoaiPCLD();
        $('li[data-bs-target="#tab_3"]').on('click', function () {
            var $drop = $("#dropSearch_LoaiPCLD");
            if ($drop.find("option").length <= 1) {
                me.loadCombo_LoaiPCLD();
            }
        });
        $("#btnXem_PCLD").click(function () {
            me.getList_AssignTypeRoleMap();
        });
        $("#dropSearch_LoaiPCLD").on("change select2:select", function () {
            if (edu.system.getValById('dropSearch_LoaiPCLD')) {
                me.getList_AssignTypeRoleMap();
            }
        });
        $("#btnAdd_AssignRole").click(function () {
            var strLoai = edu.system.getValById('dropSearch_LoaiPCLD');
            if (!strLoai) {
                edu.system.alert("Vui lòng chọn Loại phân công lao động trước!", "w");
                return;
            }
            var strLoaiText = ($("#dropSearch_LoaiPCLD option[value='" + strLoai + "']").text() || "").trim();
            edu.util.viewValById("txtAssignRole_LoaiPCLD", strLoaiText);
            edu.util.viewValById("dropAssignRole", "");
            edu.util.viewValById("txtAssignRole_NgayHieuLuc", "");
            edu.util.viewValById("txtAssignRole_NgayHetHieuLuc", "");
            edu.util.viewValById("dropAssignRole_TrangThai", 1);
            edu.util.viewValById("txtAssignRole_GhiChu", "");
            me._strAssignType_Code_Selected = strLoai;
            me.getList_VaiTro_ForAssignRole();
            $("#modalAddAssignRole").modal("show");
        });
        $("#btnSave_AssignRole").click(function () {
            me.save_AssignRole();
        });
        $("#btnDelete_AssignRole").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblAssignRole", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").off("click.assignRoleDel").on("click.assignRoleDel", function () {
                me._assignRole_DeleteQueue = {
                    total: arrChecked_Id.length,
                    done: 0,
                    errors: []
                };
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_AssignRole(arrChecked_Id[i]);
                }
            });
        });
        $("#btnXem_QHLD").click(function () {
            me.getList_EmployTypeRoleMap();
        });
        $("#dropSearch_LoaiQHLD").on("change select2:select", function () {
            if (edu.system.getValById('dropSearch_LoaiQHLD')) {
                me.getList_EmployTypeRoleMap();
            }
        });
        $("#btnAdd_EmployRole").click(function () {
            var strLoai = edu.system.getValById('dropSearch_LoaiQHLD');
            if (!strLoai) {
                edu.system.alert("Vui lòng chọn Loại quan hệ lao động trước!", "w");
                return;
            }
            var strLoaiText = ($("#dropSearch_LoaiQHLD option[value='" + strLoai + "']").text() || "").trim();
            edu.util.viewValById("txtEmployRole_LoaiQHLD", strLoaiText);
            edu.util.viewValById("dropEmployRole", "");
            edu.util.viewValById("txtEmployRole_NgayHieuLuc", "");
            edu.util.viewValById("txtEmployRole_NgayHetHieuLuc", "");
            edu.util.viewValById("dropEmployRole_TrangThai", 1);
            edu.util.viewValById("txtEmployRole_GhiChu", "");
            me._strEmployType_Code_Selected = strLoai;
            me.getList_VaiTro_ForEmployRole();
            $("#modalAddEmployRole").modal("show");
        });
        $("#btnSave_EmployRole").click(function () {
            me.save_EmployRole();
        });
        $("#btnDelete_EmployRole").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblEmployRole", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").off("click.employRoleDel").on("click.employRoleDel", function () {
                me._employRole_DeleteQueue = {
                    total: arrChecked_Id.length,
                    done: 0,
                    errors: []
                };
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_EmployRole(arrChecked_Id[i]);
                }
            });
        });


        $("#btnSearch").click(function () {
            me.hideSuggest_CoCauToChuc();
            me.getList_CoCauToChuc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.hideSuggest_CoCauToChuc();
                me.getList_CoCauToChuc();
            }
        });
        // Gợi ý tìm kiếm (autocomplete) – giới hạn dữ liệu trong API Org Unit của màn này
        $("#txtSearch_TuKhoa").on("input", function () {
            var keyword = (this.value || "").trim();
            me.debounceSuggest_CoCauToChuc(keyword);
        });
        // Ẩn gợi ý khi click ra ngoài
        $(document).on("click", function (e) {
            var $target = $(e.target);
            if ($target.closest("#txtSearch_TuKhoa").length) return;
            if ($target.closest("#txtSearch_TuKhoa_Suggest").length) return;
            me.hideSuggest_CoCauToChuc();
        });
        // Click chọn gợi ý
        $("#txtSearch_TuKhoa_Suggest").on("click", ".js-suggest-item", function () {
            var name = $(this).data("name") || $(this).text();
            edu.util.viewValById("txtSearch_TuKhoa", name);
            me.hideSuggest_CoCauToChuc();
            me.getList_CoCauToChuc();
        });
        $('#dropSearch_LoaiDonVi').on('select2:select', function () {
            me.hideSuggest_CoCauToChuc();
            me.getList_CoCauToChuc();
        });
        
        $("#tblCongViec").delegate(".btnDieuChinhRole", "click", function () {
            var strId = this.id;
            me.strCongViec_Id = strId;
            var data = me.dtCongViec.find(function (x) { return x.ID == strId; });
            me.strPosition_Name = data ? (data.POSITION_NAME || "") : "";
            $("#lblRole_ViTri").html(me.strPosition_Name);
            $("#modalDieuChinhRole").modal("show");
            me.getList_Role();
        });
        $("#btnAdd_Role").click(function () {
            edu.util.viewValById("dropRole", "");
            edu.util.viewValById("txtRole_NgayHieuLuc", "");
            edu.util.viewValById("txtRole_NgayHetHieuLuc", "");
            edu.util.viewValById("dropRole_TrangThai", 1);
            edu.util.viewValById("txtRole_GhiChu", "");
            me.getList_VaiTro();
            $("#modalAddRole").modal("show");
        });
        $("#btnSave_Role").click(function () {
            me.save_Role();
        });
        $("#btnDelete_Role").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblRole", "checkR");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn vai trò cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa vai trò đã chọn không?");
        });
        $("#tblCongViec").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtCongViec.find(e => e.ID == strId);
            me["strCongViec_Id"] = data.ID;
            var strChucDanh = [data.JOB_ID];
            if (data.JOB_ID && data.JOB_ID.indexOf(",") != -1) strChucDanh = data.JOB_ID.split(',');
            edu.util.viewValById("txtMa", data.POSITION_CODE);
            edu.util.viewValById("txtTen", data.POSITION_NAME);
            edu.util.viewValById("txtTenVietTat", data.POSITION_SHORT_NAME);
            edu.util.viewValById("dropPhanLoai", data.POSITION_TYPE_CODE);
            edu.util.viewValById("dropChuChot", data.IS_KEY_POSITION);
            edu.util.viewValById("dropChucDanh", strChucDanh);
            edu.util.viewValById("txtHeadCount", data.MAX_HEADCOUNT);
            edu.util.viewValById("txtNgayHieuLuc", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc", data.END_DATE);
            edu.util.viewValById("txtMoTa", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa", data.DESCRIPTION);
            edu.util.viewValById("dropTrangThai", data.IS_ACTIVE);
            $("#modalAddCongViec").modal("show");
        });
        $("#btnAdd_CongViec").click(function () {
            var data = {};
            me["strCongViec_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.POSITION_CODE);
            edu.util.viewValById("txtTen", data.POSITION_NAME);
            edu.util.viewValById("txtTenVietTat", data.POSITION_SHORT_NAME);
            edu.util.viewValById("dropPhanLoai", data.RELATION_TYPE_CODE_ID);
            edu.util.viewValById("dropChuChot", data.IS_KEY_POSITION);
            edu.util.viewValById("dropChucDanh", data.JOB_ID);
            edu.util.viewValById("txtHeadCount", data.MAX_HEADCOUNT);
            edu.util.viewValById("txtNgayHieuLuc", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc", data.END_DATE);
            edu.util.viewValById("txtMoTa", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa", data.DESCRIPTION);
            edu.util.viewValById("dropTrangThai", data.IS_ACTIVE);
            $("#modalAddCongViec").modal("show");
        });
        $("#btnSave_CongViec").click(function () {
            me.save_CongViec();
        });
        $("#btnDelete_CongViec").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCongViec", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CongViec(arrChecked_Id[i]);
                }
            });
        });
    },

    debounceSuggest_CoCauToChuc: function (keyword) {
        var me = this;
        clearTimeout(me._suggestTimer);

        // Bắt gợi ý từ 1 ký tự
        if (!keyword || keyword.length < 1) {
            me._suggestLastKeyword = keyword || '';
            me.hideSuggest_CoCauToChuc();
            return;
        }

        me._suggestTimer = setTimeout(function () {
            // Tránh bắn lại nếu không đổi keyword
            if (me._suggestLastKeyword === keyword) return;
            me._suggestLastKeyword = keyword;
            me.getSuggest_CoCauToChuc(keyword);
        }, 80);
    },

    getSuggest_CoCauToChuc: function (keyword) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHg4zJh4ULyg1',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Unit',
            'iM': edu.system.iM,
            'strTuKhoa': keyword,
            'strOrg_Type_Code': edu.system.getValById('dropSearch_LoaiDonVi'),
            'dIs_Offcial': edu.system.getValById('txtAAAA'),
            'dIs_Active': edu.system.getValById('dropSearch_TrangThai'),
            'strNgayXem': edu.system.getValById('txtSearch_NgayXem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.renderSuggest_CoCauToChuc((data.Data || []).slice(0, 10));
                }
                else {
                    me.hideSuggest_CoCauToChuc();
                }
            },
            error: function () {
                me.hideSuggest_CoCauToChuc();
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    renderSuggest_CoCauToChuc: function (items) {
        var $box = $("#txtSearch_TuKhoa_Suggest");
        if (!items || items.length === 0) {
            $box.addClass("d-none").empty();
            return;
        }

        var html = "";
        for (var i = 0; i < items.length; i++) {
            var it = items[i] || {};
            var name = it.NAME || "";
            var code = it.CODE ? (" (" + it.CODE + ")") : "";
            html += '<button type="button" class="list-group-item list-group-item-action js-suggest-item"'
                + ' data-id="' + (it.ID || "") + '"'
                + ' data-name="' + (name.replace(/"/g, '&quot;')) + '"'
                + '>'
                + '<span>' + name + '</span>'
                + (code ? '<small class="text-muted">' + code + '</small>' : '')
                + '</button>';
        }

        $box.html(html).removeClass("d-none");
    },

    hideSuggest_CoCauToChuc: function () {
        $("#txtSearch_TuKhoa_Suggest").addClass("d-none").empty();
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CoCauToChuc: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'NS_CoCauToChuc/LayDanhSach',
            'dTrangThai': edu.system.getValById('dropSearch_TrangThai') || 1,
            'strLoaiCoCauToChuc_Id': edu.util.getValById("dropSearch_LoaiDonVi"),
            'strCoCauToChucCha_Id': ""
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
                    me.dtCoCauToChuc = dtResult;
                    me.genTable_CoCauToChuc(dtResult, iPager);
                }
                else {
                    $("#lblCoCauToChuc_Tong").text('0');
                    edu.system.alert("NS_CoCauToChuc/LayDanhSach: " + data.Message);
                }
            },
            error: function (er) {
                $("#lblCoCauToChuc_Tong").text('0');
                edu.system.alert("NS_CoCauToChuc/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CoCauToChuc: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblCoCauToChuc_Tong", dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["treesjs_cocautochuc"],
            style: "fa fa-institution color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#treesjs_cocautochuc').off("select_node.jstree").on("select_node.jstree", function (e, data) {
            var strId = data.node.id;
            var item = me.dtCoCauToChuc.find(function (x) { return x.ID == strId; });
            if (!item) return;
            me.strCoCauToChuc_Id = item.ID;
            $("#lblCongViec").html(item.TEN);
            $("#modalCongViec").modal("show");
            me.getList_CongViec();
        });
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CongViec: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHhEuMig1KC4v',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Position',
            'iM': edu.system.iM,
            'strId': me.strCongViec_Id,

            'strPosition_Code': edu.system.getValById('txtMa'),
            'strPosition_Name': edu.system.getValById('txtTen'),
            'strPosition_Short_Name': edu.system.getValById('txtTenVietTat'),
            'strPosition_Type_Code': edu.system.getValById('dropPhanLoai'),
            'strOrg_Unit_Id': me.strCoCauToChuc_Id,
            'dMax_HeadCount': edu.system.getValById('txtHeadCount'),
            'dIs_Key_Position': edu.system.getValById('dropChuChot'),
            'dIs_Active': edu.system.getValById('dropTrangThai'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc'),
            'strDescription': edu.system.getValById('txtMoTa'),
            'strJob_Ids': edu.system.getValById('dropChucDanh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeES4yKDUoLi8P';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Position'
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
                    me.getList_CongViec();
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
    getList_CongViec: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHhEuMig1KC4vAzgULyg1',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_PositionByUnit',
            'iM': edu.system.iM,
            'strOrg_Unit_Id': me.strCoCauToChuc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtCongViec"] = data.Data;
                    me.genTable_CongViec(data.Data);
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
    delete_CongViec: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeES4yKDUoLi8P',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Position',
            'iM': edu.system.iM,
            'strId': Ids,
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
                    me.getList_CongViec();
                });
            },
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
    genTable_CongViec: function (data, iPager) {
        var me = this;
        $("#lblCongViec_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCongViec",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.CoCauToChuc.getList_CongViec()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "POSITION_CODE"
                },
                {
                    "mDataProp": "POSITION_NAME"
                },
                {
                    "mDataProp": "POSITION_SHORT_NAME"
                },
                {
                    "mDataProp": "POSITION_TYPE_CODE_NAME"
                },
                {
                    "mDataProp": "IS_KEY_POSITION"
                },
                {
                    "mDataProp": "JOB"
                },
                {
                    "mDataProp": "MAX_HEADCOUNT"
                },
                {
                    "mDataProp": "START_DATE"
                },
                {
                    "mDataProp": "END_DATE"
                },
                {
                    "mDataProp": "DESCRIPTION"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE == 1
                            ? '<span class="badge bg-success">Hiệu lực</span>'
                            : '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="text-center">'
                            + '<div id="cellRole_' + aData.ID + '" class="cellRole"></div>'
                            + '<a class="btn btn-default btnDieuChinhRole" id="' + aData.ID + '" title="Điều chỉnh">'
                            + '<i class="fa fa-edit color-active"></i> Điều chỉnh</a>'
                            + '</div>';
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
        // Gọi API lấy vai trò đã gán cho từng vị trí
        if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] && data[i].ID) {
                    me.getRoles_ByPosition(data[i].ID);
                }
            }
        }
        /*III. Callback*/
    },

    getList_Role: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4RLjIoNSguLx4TLi0kHgwgMR4GJDUy',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Position_Role_Map_Gets',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strPosition_Id': me.strCongViec_Id,
            'strRole_Id': '',
            'dIs_Active': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtRole = data.Data || [];
                    me.genTable_Role(me.dtRole);
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

    genTable_Role: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblRole",
            aaData: data || [],
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.POSITION_NAME || me.strPosition_Name || "";
                    }
                },
                {
                    "mDataProp": "ROLE_NAME"
                },
                {
                    "mDataProp": "START_DATE"
                },
                {
                    "mDataProp": "END_DATE"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE == 1
                            ? '<span class="badge bg-success">Hiệu lực</span>'
                            : '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                {
                    "mDataProp": "NOTE"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkR' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_EmployTypeRoleMap: function () {
        var me = this;
        var strLoai = edu.system.getValById('dropSearch_LoaiQHLD');
        if (!strLoai) {
            edu.system.alert("Vui lòng chọn Loại quan hệ lao động trước khi xem!", "w");
            return;
        }
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4ELDEtLjgeFTgxJB4THgwgMR4GJDUy',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Employ_Type_R_Map_Gets',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strEmployment_Type_Code': strLoai,
            'strRole_Id': '',
            'dIs_Active': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var rows = (data.Data || []).filter(function (x) { return x.IS_ACTIVE == 1; });
                    me.dtEmployRole = rows;
                    me.genTable_EmployRole(me.dtEmployRole);
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

    genTable_EmployRole: function (data) {
        $("#lblEmployRole_Tong").text((data || []).length);
        var jsonForm = {
            strTable_Id: "tblEmployRole",
            aaData: data || [],
            colPos: { center: [0, 1, 2, 3, 4, 5, 6] },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.EMPLOYMENT_TYPE_CODE_NAME || aData.EMPLOYMENT_TYPE_CODE || '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.ROLE_NAME || aData.TENVAITRO || aData.TEN || '';
                    }
                },
                { "mDataProp": "START_DATE" },
                { "mDataProp": "END_DATE" },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE == 1
                            ? '<span class="badge bg-success">Hiệu lực</span>'
                            : '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                { "mDataProp": "NOTE" },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_VaiTro_ForEmployRole: function () {
        var obj_list = {
            'action': 'CMS_VaiTro/LayDanhSach',
            'strLoaiVaiTro_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var raw = [];
                    if (Array.isArray(data.Data)) raw = data.Data;
                    else if (data.Data && Array.isArray(data.Data.rs)) raw = data.Data.rs;
                    edu.system.loadToCombo_data({
                        data: raw,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENVAITRO",
                            code: "MA"
                        },
                        renderPlace: ["dropEmployRole"],
                        type: "",
                        title: "Chọn vai trò",
                    });
                }
                else {
                    edu.system.alert("CMS_VaiTro/LayDanhSach: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTro/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    delete_EmployRole: function (Ids) {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4ELDEtLjgeFTgxJB4THgwgMR4FJAPP',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Employ_Type_R_Map_De',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        console.log('[EmployRole Delete] ==> Gửi request xóa:', obj_save);
        edu.system.makeRequest({
            success: function (data) {
                console.log('[EmployRole Delete] <== Response cho strId=' + Ids + ':', data);
                if (!data.Success) {
                    if (me._employRole_DeleteQueue) {
                        me._employRole_DeleteQueue.errors.push(data.Message || ("ID " + Ids));
                    }
                }
            },
            error: function (er) {
                if (me._employRole_DeleteQueue) {
                    me._employRole_DeleteQueue.errors.push(JSON.stringify(er));
                }
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                if (!me._employRole_DeleteQueue) {
                    me.getList_EmployTypeRoleMap();
                    return;
                }
                me._employRole_DeleteQueue.done++;
                if (me._employRole_DeleteQueue.done >= me._employRole_DeleteQueue.total) {
                    var errs = me._employRole_DeleteQueue.errors;
                    me._employRole_DeleteQueue = null;
                    if (errs.length === 0) {
                        edu.system.alert("Xóa dữ liệu thành công!");
                    } else {
                        edu.system.alert("Xóa thất bại: " + errs.join("; "), "w");
                    }
                    me.getList_EmployTypeRoleMap();
                }
            },
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    save_EmployRole: function () {
        var me = this;
        var strLoai = me._strEmployType_Code_Selected || edu.system.getValById('dropSearch_LoaiQHLD');
        if (!strLoai) {
            edu.system.alert("Thiếu Loại quan hệ lao động!", "w");
            return;
        }
        if (!edu.system.getValById('dropEmployRole')) {
            edu.system.alert("Vui lòng chọn vai trò!", "w");
            return;
        }
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4ELDEtLjgeFTgxJB4THgwgMR4ILwPP',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Employ_Type_R_Map_In',
            'iM': edu.system.iM,
            'strEmployment_Type_Code': strLoai,
            'strRole_Id': edu.system.getValById('dropEmployRole'),
            'strStart_Date': edu.system.getValById('txtEmployRole_NgayHieuLuc'),
            'strEnd_Date': edu.system.getValById('txtEmployRole_NgayHetHieuLuc'),
            'dIs_Active': edu.system.getValById('dropEmployRole_TrangThai'),
            'strNote': edu.system.getValById('txtEmployRole_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    $("#modalAddEmployRole").modal("hide");
                    me.getList_EmployTypeRoleMap();
                }
                else {
                    var msg = data.Message || "";
                    if (/ORA-20021/.test(msg) || /Đã tồn tại/.test(msg)) {
                        msg = "Cấu hình này đã tồn tại (có thể đang ở trạng thái Hết hiệu lực). Vui lòng kích hoạt lại bản ghi cũ thay vì thêm mới.";
                    }
                    edu.system.alert(msg, "w");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    loadCombo_LoaiPCLD: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE",
            "dropSearch_LoaiPCLD",
            "",
            function () {
                try {
                    var $el = $("#dropSearch_LoaiPCLD");
                    if ($el.hasClass("select2-hidden-accessible")) {
                        $el.select2("destroy");
                    }
                    $el.select2({ width: '100%' });
                    $el.trigger("change");
                } catch (e) { }
            }
        );
    },

    getList_AssignTypeRoleMap: function () {
        var me = this;
        var strLoai = edu.system.getValById('dropSearch_LoaiPCLD');
        if (!strLoai) {
            edu.system.alert("Vui lòng chọn Loại phân công lao động trước khi xem!", "w");
            return;
        }
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4AMjIoJi8eFTgxJB4THgwgMR4GJDUy',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Assign_Type_R_Map_Gets',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strAssignment_Type_Code': strLoai,
            'strRole_Id': '',
            'dIs_Active': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var rows = (data.Data || []).filter(function (x) { return x.IS_ACTIVE == 1; });
                    me.dtAssignRole = rows;
                    me.genTable_AssignRole(me.dtAssignRole);
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

    genTable_AssignRole: function (data) {
        $("#lblAssignRole_Tong").text((data || []).length);
        var jsonForm = {
            strTable_Id: "tblAssignRole",
            aaData: data || [],
            colPos: { center: [0, 1, 2, 3, 4, 5, 6] },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return aData.ASSIGNMENT_TYPE_CODE_NAME || aData.ASSIGNMENT_TYPE_CODE || '';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.ROLE_NAME || aData.TENVAITRO || aData.TEN || '';
                    }
                },
                { "mDataProp": "START_DATE" },
                { "mDataProp": "END_DATE" },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE == 1
                            ? '<span class="badge bg-success">Hiệu lực</span>'
                            : '<span class="badge bg-secondary">Hết hiệu lực</span>';
                    }
                },
                { "mDataProp": "NOTE" },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_VaiTro_ForAssignRole: function () {
        var obj_list = {
            'action': 'CMS_VaiTro/LayDanhSach',
            'strLoaiVaiTro_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var raw = [];
                    if (Array.isArray(data.Data)) raw = data.Data;
                    else if (data.Data && Array.isArray(data.Data.rs)) raw = data.Data.rs;
                    edu.system.loadToCombo_data({
                        data: raw,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENVAITRO",
                            code: "MA"
                        },
                        renderPlace: ["dropAssignRole"],
                        type: "",
                        title: "Chọn vai trò",
                    });
                }
                else {
                    edu.system.alert("CMS_VaiTro/LayDanhSach: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTro/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    save_AssignRole: function () {
        var me = this;
        var strLoai = me._strAssignType_Code_Selected || edu.system.getValById('dropSearch_LoaiPCLD');
        if (!strLoai) {
            edu.system.alert("Thiếu Loại phân công lao động!", "w");
            return;
        }
        if (!edu.system.getValById('dropAssignRole')) {
            edu.system.alert("Vui lòng chọn vai trò!", "w");
            return;
        }
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4AMjIoJi8eFTgxJB4THgwgMR4ILwPP',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Assign_Type_R_Map_In',
            'iM': edu.system.iM,
            'strAssignment_Type_Code': strLoai,
            'strRole_Id': edu.system.getValById('dropAssignRole'),
            'strStart_Date': edu.system.getValById('txtAssignRole_NgayHieuLuc'),
            'strEnd_Date': edu.system.getValById('txtAssignRole_NgayHetHieuLuc'),
            'dIs_Active': edu.system.getValById('dropAssignRole_TrangThai'),
            'strNote': edu.system.getValById('txtAssignRole_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    $("#modalAddAssignRole").modal("hide");
                    me.getList_AssignTypeRoleMap();
                }
                else {
                    var msg = data.Message || "";
                    if (/ORA-\d+/.test(msg) || /Đã tồn tại/.test(msg)) {
                        msg = "Cấu hình này đã tồn tại. Vui lòng kiểm tra lại!";
                    }
                    edu.system.alert(msg, "w");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    delete_AssignRole: function (Ids) {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4AMjIoJi8eFTgxJB4THgwgMR4FJAPP',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Assign_Type_R_Map_De',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    if (me._assignRole_DeleteQueue) {
                        me._assignRole_DeleteQueue.errors.push(data.Message || ("ID " + Ids));
                    }
                }
            },
            error: function (er) {
                if (me._assignRole_DeleteQueue) {
                    me._assignRole_DeleteQueue.errors.push(JSON.stringify(er));
                }
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                if (!me._assignRole_DeleteQueue) {
                    me.getList_AssignTypeRoleMap();
                    return;
                }
                me._assignRole_DeleteQueue.done++;
                if (me._assignRole_DeleteQueue.done >= me._assignRole_DeleteQueue.total) {
                    var errs = me._assignRole_DeleteQueue.errors;
                    me._assignRole_DeleteQueue = null;
                    if (errs.length === 0) {
                        edu.system.alert("Xóa dữ liệu thành công!");
                    } else {
                        edu.system.alert("Xóa thất bại: " + errs.join("; "), "w");
                    }
                    me.getList_AssignTypeRoleMap();
                }
            },
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    loadCombo_LoaiQHLD: function () {
        edu.system.loadToCombo_DanhMucDuLieu(
            "CORE.QUANHELAODONG.LOAI",
            "dropSearch_LoaiQHLD",
            "",
            function () {
                try {
                    var $el = $("#dropSearch_LoaiQHLD");
                    if ($el.hasClass("select2-hidden-accessible")) {
                        $el.select2("destroy");
                    }
                    $el.select2({ width: '100%' });
                    $el.trigger("change");
                } catch (e) { }
            }
        );
    },

    getList_VaiTro: function () {
        var obj_list = {
            'action': 'CMS_VaiTro/LayDanhSach',
            'strLoaiVaiTro_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var raw = [];
                    if (Array.isArray(data.Data)) raw = data.Data;
                    else if (data.Data && Array.isArray(data.Data.rs)) raw = data.Data.rs;
                    edu.system.loadToCombo_data({
                        data: raw,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENVAITRO",
                            code: "MA"
                        },
                        renderPlace: ["dropRole"],
                        type: "",
                        title: "Chọn vai trò",
                    });
                }
                else {
                    edu.system.alert("CMS_VaiTro/LayDanhSach: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTro/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },

    save_Role: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4RLjIoNSguLx4TLi0kHgwgMR4ILwPP',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Position_Role_Map_In',
            'iM': edu.system.iM,
            'strPosition_Id': me.strCongViec_Id,
            'strRole_Id': edu.system.getValById('dropRole'),
            'strStart_Date': edu.system.getValById('txtRole_NgayHieuLuc'),
            'strEnd_Date': edu.system.getValById('txtRole_NgayHetHieuLuc'),
            'dIs_Active': edu.system.getValById('dropRole_TrangThai'),
            'strNote': edu.system.getValById('txtRole_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm vai trò thành công!");
                    $("#modalAddRole").modal("hide");
                    me.getList_Role();
                    me.getRoles_ByPosition(me.strCongViec_Id);
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
            fakedb: []
        }, false, false, false, null);
    },

    getRoles_ByPosition: function (strPosition_Id) {
        var obj_save = {
            'action': 'CMS_QuanTri03_MH/ETMeAi4zJB4RLjIoNSguLx4TLi0kHgwgMR4GJDUy',
            'func': 'PKG_CORE_QUANTRI_03.Pr_Core_Position_Role_Map_Gets',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strPosition_Id': strPosition_Id,
            'strRole_Id': '',
            'dIs_Active': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': '',
            'strChucNangHeThong_Id': '',
            'strHanhDong_Code': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var list = data.Data || [];
                    var names = list.map(function (r) {
                        return r.ROLE_NAME || r.NAME || r.TEN || r.TEN_VAITRO || '';
                    }).filter(function (n) { return n; }).join(', ');
                    $('#cellRole_' + strPosition_Id).text(names);
                }
            },
            error: function () { },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    getList_NgheNghiep: function () {
        var me = this;

        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHgsuIwPP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Job',
            'iM': edu.system.iM,
            'strJob_Group_Id': edu.system.getValById('dropAAAA'),
            'strJob_Level_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "JOB_NAME",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropChucDanh"],
                        type: "",
                        title: "Chọn chức danh",
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
}