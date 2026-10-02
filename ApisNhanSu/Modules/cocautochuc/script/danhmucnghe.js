/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DanhMucNghe() { };
DanhMucNghe.prototype = {
    strDanhMucNghe_Id: '',
    dtDanhMucNghe: [],

    // Master (unfiltered) lists for filter dropdowns
    dtLoaiNgheAll: [],
    dtNhomNgheAll: [],
    dtChucDanhAll: [],
    dtBacNgheAll: [],
    _filterTimers: {},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        if ($('#tblLoaiNghe').length > 0) {
            me.loadFilterCombos();
        }
        me.getList_BacNghe();
        me.getList_NgheNghiep();
        me.getList_NhomNghe();
        me.getList_LoaiNghe();
        me.getList_ChucDanh();
        $("#tblDanhMucNghe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDanhMucNghe.find(e => e.ID == strId);
            var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? $("#dropSearch_KeHoachChiTiet option:seleted").text() : $("#dropSearch_KeHoachTongHop option:seleted").text();
            me["strDanhMucNghe_Id"] = data.ID;
            edu.util.viewValById("dropBacNghe", data.KLGD_DANHMUCAPDanhMucNghe_ID);
            edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
            edu.util.viewValById("txtDanhMucNghe", data.DanhMucNghe);
            edu.util.viewValById("txtMoTa", data.MOTA);
            $("#lblPhamViApDung").html(strPhamViApDung_Id);
            $("#myModal_DanhMucNghe").modal("show");
        });
        $("#btnAdd_DanhMucNghe").click(function () {
            var data = {};
            me["strDanhMucNghe_Id"] = data.ID;
            $("#myModal_DanhMucNghe").modal("show");
            me["strDanhMucNghe_Id"] = data.ID;
            edu.util.viewValById("dropBacNghe", data.KLGD_DANHMUCAPDanhMucNghe_ID);
            edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
            edu.util.viewValById("txtDanhMucNghe", data.DanhMucNghe);
            edu.util.viewValById("txtMoTa", data.MOTA);
            var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? $("#dropSearch_KeHoachChiTiet option:seleted").text() : $("#dropSearch_KeHoachTongHop option:seleted").text();
            $("#lblPhamViApDung").html(strPhamViApDung_Id);
        });
        $("#btnSave_DanhMucNghe").click(function () {
            me.save_DanhMucNghe();
        });
        $("#btnDelete_DanhMucNghe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucNghe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DanhMucNghe(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_DanhMucNghe();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DanhMucNghe();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_KeHoachTongHop();
        });
        $('#dropSearch_KeHoachTongHop').on('select2:select', function () {
            me.getList_KeHoachChiTiet();
        });
        $('#dropSearch_KeHoachChiTiet').on('select2:select', function () {
            me.getList_DanhMucNghe();
        });
        
        $("#tblBacNghe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtBacNghe.find(e => e.ID == strId);
            me["strBacNghe_Id"] = data.ID;
            edu.util.viewValById("txtMa_BN", data.CODE);
            edu.util.viewValById("txtTen_BN", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_BN", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_BN", data.END_DATE);
            edu.util.viewValById("txtMoTa_BN", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_BN", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_BN", data.SORT_ORDER);
            $("#modalBacNghe").modal("show");
        });
        $("#btnAdd_BacNghe").click(function () {
            var data = {};
            me["strBacNghe_Id"] = data.ID;
            edu.util.viewValById("txtMa_BN", data.CODE);
            edu.util.viewValById("txtTen_BN", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_BN", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_BN", data.END_DATE);
            edu.util.viewValById("txtMoTa_BN", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_BN", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_BN", data.SORT_ORDER);
            $("#modalBacNghe").modal("show");
        });
        $("#btnSave_BacNghe").click(function () {
            me.save_BacNghe();
        });
        $("#btnDelete_BacNghe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBacNghe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_BacNghe(arrChecked_Id[i]);
                }
            });
        });
        
        $("#tblChucDanh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtChucDanh.find(e => e.ID == strId);
            me["strChucDanh_Id"] = data.ID;
            edu.util.viewValById("dropNhomNghe_CD", data.FAMILY_ID);
            edu.util.viewValById("txtMa_CD", data.CODE);
            edu.util.viewValById("txtTen_CD", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_CD", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_CD", data.END_DATE);
            edu.util.viewValById("txtMoTa_CD", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_CD", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_CD", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_CD", data.SORT_ORDER);
            $("#modalChucDanh").modal("show");
        });
        $("#btnAdd_ChucDanh").click(function () {
            var data = {};
            me["strChucDanh_Id"] = data.ID;
            edu.util.viewValById("dropNhomNghe_CD", data.CORE_JOB_FAMILY_ID);
            edu.util.viewValById("txtMa_CD", data.CODE);
            edu.util.viewValById("txtTen_CD", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_CD", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_CD", data.END_DATE);
            edu.util.viewValById("txtMoTa_CD", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_CD", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_CD", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_CD", data.SORT_ORDER);
            $("#modalChucDanh").modal("show");
        });
        $("#btnSave_ChucDanh").click(function () {
            me.save_ChucDanh();
        });
        $("#btnDelete_ChucDanh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChucDanh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChucDanh(arrChecked_Id[i]);
                }
            });
        });

        $("#tblNhomNghe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtNhomNghe.find(e => e.ID == strId);
            me["strNhomNghe_Id"] = data.ID;
            edu.util.viewValById("dropNhomNghe_NN", data.CATEGORY_ID);
            edu.util.viewValById("txtMa_NN", data.CODE);
            edu.util.viewValById("txtTen_NN", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_NN", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_NN", data.END_DATE);
            edu.util.viewValById("txtMoTa_NN", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_NN", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_NN", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_NN", data.SORT_ORDER);
            $("#modalNhomNghe").modal("show");
        });
        $("#btnAdd_NhomNghe").click(function () {
            var data = {};
            me["strNhomNghe_Id"] = data.ID;
            edu.util.viewValById("dropNhomNghe_NN", data.CATEGORY_ID);
            edu.util.viewValById("txtMa_NN", data.CODE);
            edu.util.viewValById("txtTen_NN", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_NN", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_NN", data.END_DATE);
            edu.util.viewValById("txtMoTa_NN", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_NN", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_NN", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_NN", data.SORT_ORDER);
            $("#modalNhomNghe").modal("show");
        });
        $("#btnSave_NhomNghe").click(function () {
            me.save_NhomNghe();
        });
        $("#btnDelete_NhomNghe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhomNghe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NhomNghe(arrChecked_Id[i]);
                }
            });
        });

        $("#tblLoaiNghe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtLoaiNghe.find(e => e.ID == strId);
            me["strLoaiNghe_Id"] = data.ID;
            edu.util.viewValById("txtMa_LN", data.CODE);
            edu.util.viewValById("txtTen_LN", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_LN", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_LN", data.END_DATE);
            edu.util.viewValById("txtMoTa_LN", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_LN", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_LN", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_LN", data.SORT_ORDER);
            $("#modalLoaiNghe").modal("show");
        });
        $("#btnAdd_LoaiNghe").click(function () {
            var data = {};
            me["strLoaiNghe_Id"] = data.ID;
            edu.util.viewValById("txtMa_LN", data.CODE);
            edu.util.viewValById("txtTen_LN", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_LN", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_LN", data.END_DATE);
            edu.util.viewValById("txtMoTa_LN", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_LN", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_LN", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_LN", data.SORT_ORDER);
            $("#modalLoaiNghe").modal("show");
        });
        $("#btnSave_LoaiNghe").click(function () {
            me.save_LoaiNghe();
        });
        $("#btnDelete_LoaiNghe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLoaiNghe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LoaiNghe(arrChecked_Id[i]);
                }
            });
        });
        
        $("#tblNgheNghiep").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtNgheNghiep.find(e => e.ID == strId);
            me["strNgheNghiep_Id"] = data.ID;
            edu.util.viewValById("dropChucDanh_DM", data.JOB_GROUP_ID);
            edu.util.viewValById("dropCapBac_DM", data.JOB_LEVEL_ID);
            edu.util.viewValById("txtMa_DM", data.JOB_CODE);
            edu.util.viewValById("txtTen_DM", data.JOB_NAME);
            edu.util.viewValById("txtNgayHieuLuc_DM", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_DM", data.END_DATE);
            edu.util.viewValById("txtMoTa_DM", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_DM", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_DM", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_DM", data.SORT_ORDER);
            $("#modalNgheNghiep").modal("show");
        });
        $("#btnAdd_NgheNghiep").click(function () {
            var data = {};
            me["strNgheNghiep_Id"] = data.ID;
            edu.util.viewValById("dropChucDanh_DM", data.CORE_JOB_GROUP_ID);
            edu.util.viewValById("dropCapBac_DM", data.CORE_JOB_LEVEL_ID);
            edu.util.viewValById("txtMa_DM", data.CODE);
            edu.util.viewValById("txtTen_DM", data.NAME);
            edu.util.viewValById("txtNgayHieuLuc_DM", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_DM", data.END_DATE);
            edu.util.viewValById("txtMoTa_DM", data.DESCRIPTION);
            edu.util.viewHTMLById("txtMoTa_DM", data.DESCRIPTION);
            edu.util.viewValById("dropTinhTrang_DM", data.IS_ACTIVE);
            edu.util.viewValById("txtThuTu_DM", data.SORT_ORDER);
            $("#modalNgheNghiep").modal("show");
        });
        $("#btnSave_NgheNghiep").click(function () {
            me.save_NgheNghiep();
        });
        $("#btnDelete_NgheNghiep").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNgheNghiep", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NgheNghiep(arrChecked_Id[i]);
                }
            });
        });

        if ($('#tblLoaiNghe').length > 0) {
            me.bindFilters();
        }
    },

    getValSafe: function (id) {
        try {
            var v = edu.system.getValById(id);
            if (v === null || v === undefined) return '';
            return v;
        }
        catch (e) {
            return '';
        }
    },

    debounce: function (key, fn, delayMs) {
        var me = this;
        if (!delayMs) delayMs = 250;
        if (me._filterTimers[key]) {
            clearTimeout(me._filterTimers[key]);
        }
        me._filterTimers[key] = setTimeout(function () {
            fn();
        }, delayMs);
    },

    sortBySortOrder: function (rows) {
        if (!rows || rows.length === 0) return rows;
        return rows.sort(function (a, b) {
            var ax = (a && a.SORT_ORDER !== undefined && a.SORT_ORDER !== null && a.SORT_ORDER !== '') ? parseInt(a.SORT_ORDER, 10) : 999999999;
            var bx = (b && b.SORT_ORDER !== undefined && b.SORT_ORDER !== null && b.SORT_ORDER !== '') ? parseInt(b.SORT_ORDER, 10) : 999999999;
            if (isNaN(ax)) ax = 999999999;
            if (isNaN(bx)) bx = 999999999;
            if (ax !== bx) return ax - bx;
            var an = (a && a.NAME) ? (a.NAME + '') : '';
            var bn = (b && b.NAME) ? (b.NAME + '') : '';
            return an.localeCompare(bn);
        });
    },

    // For Job Family (Nhóm nghề) when loading ALL categories (strCateGory_Id = ''),
    // sort by Category first, then by Family SORT_ORDER.
    sortNhomNgheByCategoryAndSortOrder: function (rows) {
        var me = this;
        if (!rows || rows.length === 0) return rows;

        var catMeta = {};
        var cats = me.dtLoaiNgheAll || me.dtLoaiNghe || [];
        for (var i = 0; i < cats.length; i++) {
            var c = cats[i];
            if (!c || !c.ID) continue;
            var cso = me._parseSortOrder(c.SORT_ORDER);
            catMeta[c.ID] = {
                so: (cso === null ? 999999999 : cso),
                name: (c.NAME || '').toString()
            };
        }

        return rows.sort(function (a, b) {
            var aCatId = a ? a.CATEGORY_ID : null;
            var bCatId = b ? b.CATEGORY_ID : null;

            var aMeta = (aCatId && catMeta[aCatId]) ? catMeta[aCatId] : null;
            var bMeta = (bCatId && catMeta[bCatId]) ? catMeta[bCatId] : null;

            var aCatSo = aMeta ? aMeta.so : 999999999;
            var bCatSo = bMeta ? bMeta.so : 999999999;
            if (aCatSo !== bCatSo) return aCatSo - bCatSo;

            var aCatName = aMeta ? aMeta.name : ((a && a.CORE_JOB_CATEGORY_NAME) ? (a.CORE_JOB_CATEGORY_NAME + '') : '');
            var bCatName = bMeta ? bMeta.name : ((b && b.CORE_JOB_CATEGORY_NAME) ? (b.CORE_JOB_CATEGORY_NAME + '') : '');
            var cmpCatName = aCatName.localeCompare(bCatName);
            if (cmpCatName !== 0) return cmpCatName;

            var ax = me._parseSortOrder(a ? a.SORT_ORDER : null);
            var bx = me._parseSortOrder(b ? b.SORT_ORDER : null);
            if (ax === null) ax = 999999999;
            if (bx === null) bx = 999999999;
            if (ax !== bx) return ax - bx;

            var an = (a && a.NAME) ? (a.NAME + '') : '';
            var bn = (b && b.NAME) ? (b.NAME + '') : '';
            return an.localeCompare(bn);
        });
    },

    _parseSortOrder: function (val) {
        if (val === null || val === undefined || val === '') return null;
        var n = parseInt(val, 10);
        return isNaN(n) ? null : n;
    },

    _updateSortOrderRow: function (entity, row, newSort, done) {
        var me = this;
        var obj_save = {
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (entity === 'BacNghe') {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHg0kNyQt';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_Level';
            obj_save.strId = row.ID;
            obj_save.strCode = row.CODE;
            obj_save.strName = row.NAME;
            obj_save.dSort_Order = newSort;
            obj_save.strStart_Date = row.START_DATE;
            obj_save.strEnd_Date = row.END_DATE;
            obj_save.dIs_Active = row.IS_ACTIVE;
            obj_save.strDescription = row.DESCRIPTION;
        }
        else if (entity === 'LoaiNghe') {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHgIgNSQGLjM4';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_CateGory';
            obj_save.strId = row.ID;
            obj_save.strCode = row.CODE;
            obj_save.strName = row.NAME;
            obj_save.dSort_Order = newSort;
            obj_save.strStart_Date = row.START_DATE;
            obj_save.strEnd_Date = row.END_DATE;
            obj_save.dIs_Active = row.IS_ACTIVE;
            obj_save.strDescription = row.DESCRIPTION;
        }
        else if (entity === 'NhomNghe') {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHgcgLCgtOAPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_Family';
            obj_save.strId = row.ID;
            obj_save.strCateGory_Id = row.CATEGORY_ID;
            obj_save.strCode = row.CODE;
            obj_save.strName = row.NAME;
            obj_save.dSort_Order = newSort;
            obj_save.strStart_Date = row.START_DATE;
            obj_save.strEnd_Date = row.END_DATE;
            obj_save.dIs_Active = row.IS_ACTIVE;
            obj_save.strDescription = row.DESCRIPTION;
        }
        else if (entity === 'ChucDanh') {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHgYzLjQx';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_Group';
            obj_save.strId = row.ID;
            obj_save.strFamily_Id = row.FAMILY_ID;
            obj_save.strCode = row.CODE;
            obj_save.strName = row.NAME;
            obj_save.dSort_Order = newSort;
            obj_save.strStart_Date = row.START_DATE;
            obj_save.strEnd_Date = row.END_DATE;
            obj_save.dIs_Active = row.IS_ACTIVE;
            obj_save.strDescription = row.DESCRIPTION;
        }
        else if (entity === 'NgheNghiep') {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4j';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job';
            obj_save.strId = row.ID;
            obj_save.strJob_Group_Id = row.JOB_GROUP_ID;
            obj_save.strJob_Level_Id = row.JOB_LEVEL_ID;
            obj_save.strJob_Code = row.JOB_CODE;
            obj_save.strJob_Name = row.JOB_NAME;
            obj_save.dSort_Order = newSort;
            obj_save.strStart_Date = row.START_DATE;
            obj_save.strEnd_Date = row.END_DATE;
            obj_save.dIs_Active = row.IS_ACTIVE;
            obj_save.strDescription = row.DESCRIPTION;
        }
        else {
            if (done) done();
            return;
        }

        edu.system.makeRequest({
            success: function (data) {
                if (done) done(data && data.Success);
            },
            error: function () {
                if (done) done(false);
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    _shiftSortOrdersIfNeeded: function (entity, desiredSortVal, currentId, scopeFn, done) {
        var me = this;
        var desired = me._parseSortOrder(desiredSortVal);
        if (desired === null) {
            if (done) done();
            return;
        }

        var source = [];
        if (entity === 'BacNghe') source = me.dtBacNgheAll || me.dtBacNghe || [];
        else if (entity === 'LoaiNghe') source = me.dtLoaiNgheAll || me.dtLoaiNghe || [];
        else if (entity === 'NhomNghe') source = me.dtNhomNgheAll || me.dtNhomNghe || [];
        else if (entity === 'ChucDanh') source = me.dtChucDanhAll || me.dtChucDanh || [];
        else if (entity === 'NgheNghiep') source = me.dtNgheNghiep || [];

        if (!scopeFn) scopeFn = function () { return true; };

        var affected = $.grep(source, function (x) {
            if (!x || !x.ID) return false;
            if (currentId && x.ID == currentId) return false;
            if (!scopeFn(x)) return false;
            var so = me._parseSortOrder(x.SORT_ORDER);
            return (so !== null && so >= desired);
        });

        if (!affected || affected.length === 0) {
            if (done) done();
            return;
        }

        affected.sort(function (a, b) {
            var ax = me._parseSortOrder(a.SORT_ORDER);
            var bx = me._parseSortOrder(b.SORT_ORDER);
            if (ax === null) ax = -999999999;
            if (bx === null) bx = -999999999;
            if (ax !== bx) return bx - ax; // desc
            var an = (a.NAME || '').toString();
            var bn = (b.NAME || '').toString();
            return bn.localeCompare(an);
        });

        // Assign unique target sort orders while shifting upward
        var assigned = {};
        for (var i = 0; i < affected.length; i++) {
            var oldSo = me._parseSortOrder(affected[i].SORT_ORDER);
            if (oldSo === null) continue;
            var target = oldSo + 1;
            while (assigned[target]) target++;
            affected[i].__newSort = target;
            assigned[target] = true;
        }

        var idx = 0;
        function next() {
            if (idx >= affected.length) {
                if (done) done();
                return;
            }
            var row = affected[idx++];
            if (!row || row.__newSort === undefined || row.__newSort === null) {
                next();
                return;
            }
            var oldSo2 = me._parseSortOrder(row.SORT_ORDER);
            if (oldSo2 === null || oldSo2 == row.__newSort) {
                next();
                return;
            }

            me._updateSortOrderRow(entity, row, row.__newSort, function (ok) {
                // continue regardless; avoid blocking save
                next();
            });
        }
        next();
    },

    bindFilters: function () {
        var me = this;

        // Loại nghề
        $('#txtSearch_TuKhoa_LN').on('input', function () {
            me.debounce('LN', function () { me.getList_LoaiNghe(); });
        });
        $('#dropSearch_TrangThai_LN').on('change select2:select', function () {
            me.getList_LoaiNghe();
        });

        // Nhóm nghề
        $('#txtSearch_TuKhoa_NN').on('input', function () {
            me.debounce('NN', function () { me.getList_NhomNghe(); });
        });
        $('#dropSearch_TrangThai_NN').on('change select2:select', function () {
            me.getList_NhomNghe();
        });
        $('#dropSearch_LoaiNghe_NN').on('change select2:select', function () {
            me.getList_NhomNghe();
        });

        // Nhóm chức danh
        $('#txtSearch_TuKhoa_CD').on('input', function () {
            me.debounce('CD', function () { me.getList_ChucDanh(); });
        });
        $('#dropSearch_TrangThai_CD').on('change select2:select', function () {
            me.getList_ChucDanh();
        });
        $('#dropSearch_LoaiNghe_CD').on('change select2:select', function () {
            edu.util.viewValById('dropSearch_NhomNghe_CD', '');
            me.applyFilter_NhomNghe_ForChucDanh();
            me.getList_ChucDanh();
        });
        $('#dropSearch_NhomNghe_CD').on('change select2:select', function () {
            me.getList_ChucDanh();
        });

        // Cấp bậc nghề
        $('#txtSearch_TuKhoa_BN').on('input', function () {
            me.debounce('BN', function () { me.getList_BacNghe(); });
        });
        $('#dropSearch_TrangThai_BN').on('change select2:select', function () {
            me.getList_BacNghe();
        });

        // Nghề nghiệp
        $('#txtSearch_TuKhoa_DM').on('input', function () {
            me.debounce('DM', function () { me.getList_NgheNghiep(); });
        });
        $('#dropSearch_TrangThai_DM').on('change select2:select', function () {
            me.getList_NgheNghiep();
        });
        $('#dropSearch_LoaiNghe_DM').on('change select2:select', function () {
            edu.util.viewValById('dropSearch_NhomNghe_DM', '');
            edu.util.viewValById('dropSearch_ChucDanh_DM', '');
            me.applyFilter_NhomNghe_ForNgheNghiep();
            me.applyFilter_ChucDanh_ForNgheNghiep();
            me.getList_NgheNghiep();
        });
        $('#dropSearch_NhomNghe_DM').on('change select2:select', function () {
            edu.util.viewValById('dropSearch_ChucDanh_DM', '');
            me.applyFilter_ChucDanh_ForNgheNghiep();
            me.getList_NgheNghiep();
        });
        $('#dropSearch_ChucDanh_DM').on('change select2:select', function () {
            me.getList_NgheNghiep();
        });
        $('#dropSearch_BacNghe_DM').on('change select2:select', function () {
            me.getList_NgheNghiep();
        });
    },

    loadFilterCombos: function () {
        var me = this;
        me.getList_LoaiNghe({ forCombo: true });
        me.getList_NhomNghe({ forCombo: true });
        me.getList_ChucDanh({ forCombo: true });
        me.getList_BacNghe({ forCombo: true });
    },

    applyFilter_NhomNghe_ForChucDanh: function () {
        var me = this;
        var cateId = me.getValSafe('dropSearch_LoaiNghe_CD');
        var data = me.dtNhomNgheAll || [];
        if (cateId) {
            data = $.grep(data, function (x) { return (x.CATEGORY_ID == cateId); });
        }
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
            renderPlace: ["dropSearch_NhomNghe_CD"],
            type: "",
            title: "Chọn nhóm nghề",
        });
    },

    applyFilter_NhomNghe_ForNgheNghiep: function () {
        var me = this;
        var cateId = me.getValSafe('dropSearch_LoaiNghe_DM');
        var data = me.dtNhomNgheAll || [];
        if (cateId) {
            data = $.grep(data, function (x) { return (x.CATEGORY_ID == cateId); });
        }
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
            renderPlace: ["dropSearch_NhomNghe_DM"],
            type: "",
            title: "Chọn nhóm nghề",
        });
    },

    applyFilter_ChucDanh_ForNgheNghiep: function () {
        var me = this;
        var familyId = me.getValSafe('dropSearch_NhomNghe_DM');
        var data = me.dtChucDanhAll || [];
        if (familyId) {
            data = $.grep(data, function (x) { return (x.FAMILY_ID == familyId); });
        }
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
            renderPlace: ["dropSearch_ChucDanh_DM"],
            type: "",
            title: "Chọn chức danh",
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIVKS4oBiggLxUuLyYJLjEKDQPP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL',
            'iM': edu.system.iM,
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
                            name: "THOIGIAN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropThoiGian", "dropSearch_ThoiGian"],
                        type: "",
                        title: "Chọn thời gian",
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
    getList_KeHoachTongHop: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHhUuLyYJLjEKKS4oDTQuLyYP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKhoiLuong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'dHieuLuc': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
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
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KeHoachTongHop"],
                        type: "",
                        title: "Chọn kế hoạch tổng hợp",
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
    getList_KeHoachChiTiet: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgokCS4gIikCKSgVKCQ1',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_KeHoachChiTiet',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strKLGD_TongHopKhoiLuong_Id': edu.system.getValById('dropSearch_KeHoachTongHop'),
            'strCheDoApDung_Id': edu.system.getValById('dropAAAA'),
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'strTuNgay': edu.system.getValById('txtAAAA'),
            'strDenNgay': edu.system.getValById('txtAAAA'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
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
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KeHoachChiTiet"],
                        type: "",
                        title: "Chọn kế hoạch chi tiết",
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DanhMucNghe: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? edu.system.getValById('dropSearch_KeHoachChiTiet'): edu.system.getValById('dropSearch_KeHoachTongHop');
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.Them_KLGD_DanhMucApDanhMucNghe_Ad',
            'iM': edu.system.iM,
            'strId': me.strDanhMucNghe_Id,
            'strKLGD_DanhMucApDanhMucNghe_Id': edu.system.getValById('dropBacNghe'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strDonViTinh_Id': edu.system.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'dDanhMucNghe': edu.system.getValById('txtDanhMucNghe'),
            'dHieuLuc': 1,
            'strMoTa': edu.system.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl';
            obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApDanhMucNghe_Ad'
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
                    me.getList_DanhMucNghe();
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
    getList_DanhMucNghe: function (strDanhSach_Id) {
        var me = this;
        var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? edu.system.getValById('dropSearch_KeHoachChiTiet'): edu.system.getValById('dropSearch_KeHoachTongHop');
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDanhMucNghe_Ad',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strKLGD_DanhMucApDanhMucNghe_Id': edu.system.getValById('dropSearch_BacNghe'),
            'strDonViTinh_Id': edu.system.getValById('dropSearch_DonViTinh'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDanhMucNghe"] = dtReRult;
                    me.genTable_DanhMucNghe(dtReRult, data.Pager);
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
    delete_DanhMucNghe: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl',
            'func': 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDanhMucNghe_Ad',
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
                    content:  JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DanhMucNghe();
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
    genTable_DanhMucNghe: function (data, iPager) {
        $("#lblDanhMucNghe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucNghe",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNghe.getList_DanhMucNghe()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "JOB_CODE"
                },
                {
                    "mDataProp": "JOB_NAME"
                },
                {
                    "mDataProp": "DONVITINH_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "HIEULUC"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
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
    save_BacNghe: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHgsuIx4NJDckLQPP',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Job_Level',
            'iM': edu.system.iM,
            'strId': me.strBacNghe_Id,

            'strCode': edu.system.getValById('txtMa_BN'),
            'strName': edu.system.getValById('txtTen_BN'),
            'dSort_Order': edu.system.getValById('txtThuTu_BN'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc_BN'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc_BN'),
            'dIs_Active': edu.system.getValById('dropTinhTrang_BN'),
            'strDescription': edu.system.getValById('txtMoTa_BN'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHg0kNyQt';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_Level'
        }

        me._shiftSortOrdersIfNeeded('BacNghe', obj_save.dSort_Order, obj_save.strId, null, function () {
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
                        me.getList_BacNghe({ forCombo: true });
                        me.getList_BacNghe();
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
        });
    },
    getList_BacNghe: function (options) {
        var me = this;
        options = options || {};
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHgsuIx4NJDckLQPP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Job_Level',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var rows = data.Data || [];
                    if (options.forCombo) {
                        me.dtBacNgheAll = me.sortBySortOrder(rows);
                        edu.system.loadToCombo_data({
                            data: me.dtBacNgheAll,
                            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
                            renderPlace: ["dropCapBac_DM", "dropSearch_BacNghe_DM"],
                            type: "",
                            title: "Chọn bậc nghề",
                        });
                        return;
                    }

                    var tuKhoa = (me.getValSafe('txtSearch_TuKhoa_BN') || '').toLowerCase();
                    var trangThai = me.getValSafe('dropSearch_TrangThai_BN');
                    if (trangThai === null || trangThai === undefined) trangThai = '';
                    if (tuKhoa) {
                        rows = $.grep(rows, function (x) {
                            return ((x.CODE || '').toLowerCase().indexOf(tuKhoa) >= 0)
                                || ((x.NAME || '').toLowerCase().indexOf(tuKhoa) >= 0);
                        });
                    }
                    if (trangThai !== '') {
                        var isActive = (trangThai == '1');
                        rows = $.grep(rows, function (x) {
                            return (!!x.IS_ACTIVE) === isActive;
                        });
                    }

                    rows = me.sortBySortOrder(rows);

                    me["dtBacNghe"] = rows;
                    me.genTable_BacNghe(rows);
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
    delete_BacNghe: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeCy4jHg0kNyQt',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Job_Level',
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
                    me.getList_BacNghe({ forCombo: true });
                    me.getList_BacNghe();
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
    genTable_BacNghe: function (data, iPager) {
        $("#lblBacNghe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblBacNghe",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNghe.getList_BacNghe()",
            //    iDataRow: iPager
            //},
            colPos: {
                // 0: STT (auto), 7: Edit, 8: Checkbox
                center: [0, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
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
                        return aData.IS_ACTIVE? "": "Hết hiệu lực";
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChucDanh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHgsuIx4GMy40MQPP',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Job_Group',
            'iM': edu.system.iM,
            'strId': me.strChucDanh_Id,

            'strFamily_Id': edu.system.getValById('dropNhomNghe_CD'),
            'strCode': edu.system.getValById('txtMa_CD'),
            'strName': edu.system.getValById('txtTen_CD'),
            'dSort_Order': edu.system.getValById('txtThuTu_CD'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc_CD'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc_CD'),
            'dIs_Active': edu.system.getValById('dropTinhTrang_CD'),
            'strDescription': edu.system.getValById('txtMoTa_CD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHgYzLjQx';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_Group'
        }

        me._shiftSortOrdersIfNeeded(
            'ChucDanh',
            obj_save.dSort_Order,
            obj_save.strId,
            function (x) { return x.FAMILY_ID == obj_save.strFamily_Id; },
            function () {
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
                            me.getList_ChucDanh({ forCombo: true });
                            me.getList_ChucDanh();
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
            }
        );
    },
    getList_ChucDanh: function (options) {
        var me = this;
        options = options || {};

        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHgsuIx4GMy40MQPP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Job_Group',
            'iM': edu.system.iM,
            'strFamily_Id': options.forCombo ? me.getValSafe('dropAAAA') : (me.getValSafe('dropSearch_NhomNghe_CD') || me.getValSafe('dropAAAA')),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var rows = data.Data || [];
                    if (options.forCombo) {
                        me.dtChucDanhAll = me.sortBySortOrder(rows);
                        edu.system.loadToCombo_data({
                            data: me.dtChucDanhAll,
                            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
                            renderPlace: ["dropChucDanh_DM", "dropSearch_ChucDanh_DM"],
                            type: "",
                            title: "Chọn chức danh",
                        });
                        me.applyFilter_ChucDanh_ForNgheNghiep();
                        return;
                    }

                    var tuKhoa = (me.getValSafe('txtSearch_TuKhoa_CD') || '').toLowerCase();
                    var trangThai = me.getValSafe('dropSearch_TrangThai_CD');
                    if (trangThai === null || trangThai === undefined) trangThai = '';
                    if (tuKhoa) {
                        rows = $.grep(rows, function (x) {
                            return ((x.CODE || '').toLowerCase().indexOf(tuKhoa) >= 0)
                                || ((x.NAME || '').toLowerCase().indexOf(tuKhoa) >= 0);
                        });
                    }
                    if (trangThai !== '') {
                        var isActive = (trangThai == '1');
                        rows = $.grep(rows, function (x) {
                            return (!!x.IS_ACTIVE) === isActive;
                        });
                    }

                    rows = me.sortBySortOrder(rows);

                    me["dtChucDanh"] = rows;
                    me.genTable_ChucDanh(rows);
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
    delete_ChucDanh: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeCy4jHgYzLjQx',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Job_Group',
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
                    me.getList_ChucDanh({ forCombo: true });
                    me.getList_ChucDanh();
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
    genTable_ChucDanh: function (data, iPager) {
        $("#lblChucDanh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChucDanh",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNghe.getList_ChucDanh()",
            //    iDataRow: iPager
            //},
            colPos: {
                // 0: STT (auto), 8: Edit, 9: Checkbox
                center: [0, 8, 9],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
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
                    "mDataProp": "CORE_JOB_FAMILY_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE ? "Hiệu lực" : "Hết hiệu lực";
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NhomNghe: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHgsuIx4HICwoLTgP',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Job_Family',
            'iM': edu.system.iM,
            'strId': me.strNhomNghe_Id,

            'strCateGory_Id': edu.system.getValById('dropNhomNghe_NN'),
            'strCode': edu.system.getValById('txtMa_NN'),
            'strName': edu.system.getValById('txtTen_NN'),
            'dSort_Order': edu.system.getValById('txtThuTu_NN'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc_NN'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc_NN'),
            'dIs_Active': edu.system.getValById('dropTinhTrang_NN'),
            'strDescription': edu.system.getValById('txtMoTa_NN'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHgcgLCgtOAPP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_Family'
        }

        me._shiftSortOrdersIfNeeded(
            'NhomNghe',
            obj_save.dSort_Order,
            obj_save.strId,
            function (x) { return x.CATEGORY_ID == obj_save.strCateGory_Id; },
            function () {
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
                            me.getList_NhomNghe({ forCombo: true });
                            me.getList_NhomNghe();
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
            }
        );
    },
    getList_NhomNghe: function (options) {
        var me = this;
        options = options || {};

        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHgsuIx4HICwoLTgP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Job_Family',
            'iM': edu.system.iM,
            'strCateGory_Id': options.forCombo ? me.getValSafe('dropAAAA') : (me.getValSafe('dropSearch_LoaiNghe_NN') || me.getValSafe('dropAAAA')),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var rows = data.Data || [];
                    if (options.forCombo) {
                        // When loading all categories (common for combos), keep grouping by category stable
                        me.dtNhomNgheAll = me.sortNhomNgheByCategoryAndSortOrder(rows);
                        edu.system.loadToCombo_data({
                            data: me.dtNhomNgheAll,
                            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
                            renderPlace: ["dropNhomNghe_CD", "dropSearch_NhomNghe_CD", "dropSearch_NhomNghe_DM"],
                            type: "",
                            title: "Chọn nhóm nghề",
                        });
                        me.applyFilter_NhomNghe_ForChucDanh();
                        me.applyFilter_NhomNghe_ForNgheNghiep();
                        return;
                    }

                    var tuKhoa = (me.getValSafe('txtSearch_TuKhoa_NN') || '').toLowerCase();
                    var trangThai = me.getValSafe('dropSearch_TrangThai_NN');
                    if (trangThai === null || trangThai === undefined) trangThai = '';
                    if (tuKhoa) {
                        rows = $.grep(rows, function (x) {
                            return ((x.CODE || '').toLowerCase().indexOf(tuKhoa) >= 0)
                                || ((x.NAME || '').toLowerCase().indexOf(tuKhoa) >= 0);
                        });
                    }
                    if (trangThai !== '') {
                        var isActive = (trangThai == '1');
                        rows = $.grep(rows, function (x) {
                            return (!!x.IS_ACTIVE) === isActive;
                        });
                    }

                    // If no specific category filter is selected, sort by Category first to avoid
                    // interleaving rows with same SORT_ORDER across different categories.
                    var catFilter = obj_save.strCateGory_Id;
                    if (catFilter === null || catFilter === undefined) catFilter = '';
                    if (catFilter === '') rows = me.sortNhomNgheByCategoryAndSortOrder(rows);
                    else rows = me.sortBySortOrder(rows);

                    me["dtNhomNghe"] = rows;
                    me.genTable_NhomNghe(rows);
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
    delete_NhomNghe: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeCy4jHgcgLCgtOAPP',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Job_Family',
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
                    me.getList_NhomNghe({ forCombo: true });
                    me.getList_NhomNghe();
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
    genTable_NhomNghe: function (data, iPager) {
        $("#lblNhomNghe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhomNghe",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNghe.getList_NhomNghe()",
            //    iDataRow: iPager
            //},
            colPos: {
                // 0: STT (auto), 8: Edit, 9: Checkbox
                center: [0, 8, 9],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
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
                    "mDataProp": "CORE_JOB_CATEGORY_NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE ? "Hiệu lực" : "Hết hiệu lực";
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_LoaiNghe: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHgsuIx4CIDUkBi4zOAPP',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Job_CateGory',
            'iM': edu.system.iM,
            'strId': me.strLoaiNghe_Id,

            'strCode': edu.system.getValById('txtMa_LN'),
            'strName': edu.system.getValById('txtTen_LN'),
            'dSort_Order': edu.system.getValById('txtThuTu_LN'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc_LN'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc_LN'),
            'dIs_Active': edu.system.getValById('dropTinhTrang_LN'),
            'strDescription': edu.system.getValById('txtMoTa_LN'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4jHgIgNSQGLjM4';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job_CateGory'
        }

        me._shiftSortOrdersIfNeeded('LoaiNghe', obj_save.dSort_Order, obj_save.strId, null, function () {
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
                        me.getList_LoaiNghe({ forCombo: true });
                        me.getList_LoaiNghe();
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
        });
    },
    getList_LoaiNghe: function (options) {
        var me = this;
        options = options || {};
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHgsuIx4CIDUkBi4zOAPP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Job_CateGory',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var rows = data.Data || [];
                    if (options.forCombo) {
                        me.dtLoaiNgheAll = me.sortBySortOrder(rows);
                        edu.system.loadToCombo_data({
                            data: me.dtLoaiNgheAll,
                            renderInfor: { id: "ID", parentId: "", name: "NAME", code: "", avatar: "" },
                            renderPlace: ["dropNhomNghe_NN", "dropSearch_LoaiNghe_NN", "dropSearch_LoaiNghe_CD", "dropSearch_LoaiNghe_DM"],
                            type: "",
                            title: "Chọn loại nghề",
                        });
                        me.applyFilter_NhomNghe_ForChucDanh();
                        me.applyFilter_NhomNghe_ForNgheNghiep();
                        return;
                    }

                    var tuKhoa = (me.getValSafe('txtSearch_TuKhoa_LN') || '').toLowerCase();
                    var trangThai = me.getValSafe('dropSearch_TrangThai_LN');
                    if (trangThai === null || trangThai === undefined) trangThai = '';
                    if (tuKhoa) {
                        rows = $.grep(rows, function (x) {
                            return ((x.CODE || '').toLowerCase().indexOf(tuKhoa) >= 0)
                                || ((x.NAME || '').toLowerCase().indexOf(tuKhoa) >= 0);
                        });
                    }
                    if (trangThai !== '') {
                        var isActive = (trangThai == '1');
                        rows = $.grep(rows, function (x) {
                            return (!!x.IS_ACTIVE) === isActive;
                        });
                    }

                    rows = me.sortBySortOrder(rows);

                    me["dtLoaiNghe"] = rows;
                    me.genTable_LoaiNghe(rows);
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
    delete_LoaiNghe: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeCy4jHgIgNSQGLjM4',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Job_CateGory',
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
                    me.getList_LoaiNghe({ forCombo: true });
                    me.getList_LoaiNghe();
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
    genTable_LoaiNghe: function (data, iPager) {
        $("#lblLoaiNghe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLoaiNghe",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNghe.getList_LoaiNghe()",
            //    iDataRow: iPager
            //},
            colPos: {
                // 0: STT (auto), 7: Edit, 8: Checkbox
                center: [0, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
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
                        return aData.IS_ACTIVE ? "Hiệu lực" : "Hết hiệu lực";
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NgheNghiep: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHgsuIwPP',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Job',
            'iM': edu.system.iM,
            'strId': me.strNgheNghiep_Id,

            'strJob_Group_Id': edu.system.getValById('dropChucDanh_DM'),
            'strJob_Level_Id': edu.system.getValById('dropCapBac_DM'),
            'strJob_Code': edu.system.getValById('txtMa_DM'),
            'strJob_Name': edu.system.getValById('txtTen_DM'),
            'dSort_Order': edu.system.getValById('txtThuTu_DM'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc_DM'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc_DM'),
            'dIs_Active': edu.system.getValById('dropTinhTrang_DM'),
            'strDescription': edu.system.getValById('txtMoTa_DM'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeCy4j';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Job'
        }

        me._shiftSortOrdersIfNeeded(
            'NgheNghiep',
            obj_save.dSort_Order,
            obj_save.strId,
            function (x) { return x.JOB_GROUP_ID == obj_save.strJob_Group_Id && x.JOB_LEVEL_ID == obj_save.strJob_Level_Id; },
            function () {
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
                            me.getList_NgheNghiep();
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
            }
        );
    },
    getList_NgheNghiep: function () {
        var me = this;

        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHgsuIwPP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Job',
            'iM': edu.system.iM,
            'strJob_Group_Id': me.getValSafe('dropSearch_ChucDanh_DM') || me.getValSafe('dropAAAA'),
            'strJob_Level_Id': me.getValSafe('dropSearch_BacNghe_DM') || me.getValSafe('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    var rows = data.Data || [];
                    var tuKhoa = (me.getValSafe('txtSearch_TuKhoa_DM') || '').toLowerCase();
                    var trangThai = me.getValSafe('dropSearch_TrangThai_DM');
                    if (trangThai === null || trangThai === undefined) trangThai = '';
                    if (tuKhoa) {
                        rows = $.grep(rows, function (x) {
                            return ((x.JOB_CODE || '').toLowerCase().indexOf(tuKhoa) >= 0)
                                || ((x.JOB_NAME || '').toLowerCase().indexOf(tuKhoa) >= 0);
                        });
                    }
                    if (trangThai !== '') {
                        var isActive = (trangThai == '1');
                        rows = $.grep(rows, function (x) {
                            return (!!x.IS_ACTIVE) === isActive;
                        });
                    }

                    rows = me.sortBySortOrder(rows);

                    me["dtNgheNghiep"] = rows;
                    me.genTable_NgheNghiep(rows);
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
    delete_NgheNghiep: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeCy4j',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Job',
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
                    me.getList_NgheNghiep();
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
    genTable_NgheNghiep: function (data, iPager) {
        $("#lblNgheNghiep_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNgheNghiep",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DanhMucNghe.getList_NgheNghiep()",
            //    iDataRow: iPager
            //},
            colPos: {
                // 0: STT (auto), 9: Edit, 10: Checkbox
                center: [0, 9, 10],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "JOB_CODE"
                },
                {
                    "mDataProp": "JOB_NAME"
                },
                {
                    "mDataProp": "CORE_JOB_GROUP_NAME"
                },
                {
                    "mDataProp": "CORE_JOB_LEVEL_NAME"
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
                        return aData.IS_ACTIVE ? "Hiệu lực" : "Hết hiệu lực";
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
}