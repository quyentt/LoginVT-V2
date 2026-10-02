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
        // Call the CoCauToChuc list API (same as cocautochucv2.js)
        var obj_list = {
            action: 'NS_CoCauToChuc/LayDanhSach',
            dTrangThai: edu.system.getValById('dropSearch_TrangThai') || 1,
            strLoaiCoCauToChuc_Id: edu.system.getValById('dropSearch_LoaiDonVi'),
            strCoCauToChucCha_Id: ""
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var raw = data.Data || [];
                    // Map backend fields to the shape expected by this module (ID, NAME, PARENT_ORG_ID, CODE)
                    var dtResult = raw.map(function (item) {
                        if (!item) return item;
                        return {
                            // keep ID
                            ID: item.ID || item.Id || null,
                            // name used by this module
                            NAME: item.TEN || item.NAME || item.TEXT || "",
                            // tree parent id (normalize '#' or null -> null)
                            PARENT_ORG_ID: (item.PARENT === "#" || item.PARENT == null) ? null : item.PARENT,
                            // code
                            CODE: item.MA || item.CODE || "",
                            // store original raw object for other usages
                            __raw: item
                        };
                    });

                    me["dtCoCauToChuc"] = dtResult;

                    // Badge tổng số đơn vị (use Data.length fallback)
                    var total = 0;
                    if (data.Pager) {
                        total = data.Pager.TotalRecords || data.Pager.totalRecords || data.Pager.iTotalRecords
                            || data.Pager.Total || data.Pager.total || 0;
                    }
                    if (!total && dtResult && dtResult.length !== undefined) {
                        total = dtResult.length;
                    }
                    $("#lblCoCauToChuc_Tong").text(total);

                    me.genTable_CoCauToChuc(dtResult, data.Pager);
                }
                else {
                    $("#lblCoCauToChuc_Tong").text('0');
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {
                $("#lblCoCauToChuc_Tong").text('0');

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
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
    genTable_CoCauToChuc: function (data, iPager) {
        var me = this;

        // Khi filter theo từ khóa, DB có thể chỉ trả về node con mà không kèm node cha.
        // `edu.system.loadToTreejs_data` render root bằng điều kiện parentId == null.
        // Fix: coi các node có parent thiếu là root (set parentId = null).
        var orgIds = new Set((data || []).map(function (x) { return x && x.ID; }));
        var dataForTree = (data || []).map(function (x) {
            if (!x) return x;
            if (x.PARENT_ORG_ID && !orgIds.has(x.PARENT_ORG_ID)) {
                x.PARENT_ORG_ID = null;
            }
            return x;
        });

        var obj = {
            data: dataForTree,
            renderInfor: {
                id: "ID",
                parentId: "PARENT_ORG_ID",
                name: "NAME",
                code: ""
            },
            renderPlaces: ["treesjs_cocautochuc"],
            style: "fa fa-institution color-active",
            splitString: 1000,
        };
        edu.system.loadToTreejs_data(obj);

        // Tránh bind trùng sự kiện khi render lại tree
        $('#treesjs_cocautochuc').off("select_node.jstree").on("select_node.jstree", function (e, data) {
            var strId = data.node.id;
            var data = me.dtCoCauToChuc.find(e => e.ID == strId);
            me["strCoCauToChuc_Id"] = data.ID;
            $("#lblCongViec").html(data.NAME)
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
        $("#lblCongViec_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCongViec",
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
                        return aData.IS_ACTIVE ? "" : "Hết hiệu lực";
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