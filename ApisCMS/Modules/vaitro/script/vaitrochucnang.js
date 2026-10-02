/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/11/2017
----------------------------------------------*/
function VaiTroChucNang() { };
VaiTroChucNang.prototype = {
    dtUngDung: [],
    dtChucNang: [],
    dtVaiTroChucNang: [],
    arrChucNang_Id: [],
    strVaiTro_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        edu.system.page_load();
        me.toggle_list();
        me.getList_VaiTro();

        $("#txtSearch_VaiTro_VTCN").on("input", function () {
            me.filterTree_VaiTro($(this).val());
        });
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        edu.system.loadToCombo_DanhMucDuLieu("CHUNG.HANHDONG", "dropQuyen_VTCN");
        /*------------------------------------------
        --Discription: [1] Action ChucNang
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            if (edu.util.checkValue(me.strVaiTro_Id)) {
                me.toggle_input();
                if (me.strUngDung_Id) {
                    $("#dropUngDung_VTCN").val(me.strUngDung_Id).trigger("change").trigger({ type: 'select2:select' });
                }
            }
            else {
                edu.system.alert("Vui lòng chọn Vai trò cần phân Chức năng!");
            }
        });
        $("#tblChucNang_VTCN").delegate(".btnAdd_ChucNang", "click", function (e) {
            var strChucNang_Id = this.id;
            e.preventDefault();
            strChucNang_Id = edu.util.cutPrefixId(/add_chucnang/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                me.save_VaiTroChucNang(strChucNang_Id, 0);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tableVTCN").delegate(".btnSuaQuyen", "click", function (e) {
            var strChucNang_Id = this.id;
            me.strChucNang_Id = strChucNang_Id;
            me.getList_SuaQuyen();
            $("#modalSuaQuyen").modal("show");

        });
        $("#treesjs_ungdungchucnang_vtcn").delegate(".btnAdd_ChucNang", "click", function (e) {
            var strChucNang_Id = this.id;
            e.preventDefault();
            strChucNang_Id = edu.util.cutPrefixId(/add_chucnang/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                me.save_VaiTroChucNang(strChucNang_Id, 0);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSync_VTCN").click(function () {
            for (var i = 0; i < me.dtVaiTroChucNang.length; i++) {
                if (me.dtVaiTroChucNang[i].TINHTRANGDONGBO == 0) {
                    me.save_VaiTroChucNang(me.dtVaiTroChucNang[i].ID, 1);
                }
            }
        });
        $("#btnChucNangV2").click(function (e) {
            if (this.classList.contains("btn-default")) {
                this.classList.remove("btn-default");
                this.classList.add("btn-primary");
                edu.util.toggle_overide("zone-bus-vtcn", "zone_list_vtcnv2");
            }
            else {
                this.classList.add("btn-default");
                this.classList.remove("btn-primary");
                edu.util.toggle_overide("zone-bus-vtcn", "zone_list_vtcn");
            }
        });
        //if (this.classList.contains("btn-default")) {
        //    this.classList.remove("btn-default");
        //    this.classList.add("btn-primary");
        //    edu.util.toggle_overide("zone-bus-vtcn", "zone_list_vtcnv2");
        //}
        //else {
        //    this.classList.add("btn-default");
        //    this.classList.remove("btn-primary");
        //    edu.util.toggle_overide("zone-bus-vtcn", "zone_list_vtcn");
        //}
        /*------------------------------------------
       --Discription: [2] Action VaiTro_ChucNang
       -------------------------------------------*/
        $("#tableVaiTroChucNang_VTCN").delegate(".btnDelete_VaiTroChucNang", "click", function () {
            var strChucNang_Id = this.id;
            strChucNang_Id = edu.util.cutPrefixId(/delete_vaitrochucnang/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                console.log("strChucNang_Id: " + strChucNang_Id);
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_VaiTroChucNang(strChucNang_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#treesjs_ungdungchucnang_vtcn").delegate(".btnDelete_VaiTroChucNang", "click", function () {
            var strChucNang_Id = this.id;
            strChucNang_Id = edu.util.cutPrefixId(/delete_vaitrochucnang/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_VaiTroChucNang(strChucNang_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tableVaiTroChucNang_VTCN").delegate(".btnSync", "click", function () {
            var strChucNang_Id = this.id;
            strChucNang_Id = edu.util.cutPrefixId(/sync_/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                me.save_VaiTroChucNang(strChucNang_Id, 1);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#treesjs_ungdungchucnang_vtcn").delegate(".btnSync", "click", function () {
            var strChucNang_Id = this.id;
            strChucNang_Id = edu.util.cutPrefixId(/sync_/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                me.save_VaiTroChucNang(strChucNang_Id, 1);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action UngDung
        -------------------------------------------*/
        $("#dropUngDung_VTCN").on("select2:select", function () {
            me.getList_ChucNang();
        });
        $('.rdLoaiVaiTro_ChucNang').on('change', function (e) {
            e.stopImmediatePropagation();
            me.findChucNang();
        });
        /*------------------------------------------
        --Discription: [2] Tính năng dành riêng cho GM Azz
        -------------------------------------------*/
        //if (edu.system.userId == "4038E6FD0FFA4D339FA991E740348F01") {
        //    $("#btnChucNangV2").trigger("click");
        //}

        $("#btnAdd_QuyenCN").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyenCN", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng ?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_QuyenCN(arrChecked_Id[i]);
                }
            });

        });
        $("#btnDelete_QuyenCN").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyenCN", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyenCN(arrChecked_Id[i]);
                }
            });
        });
        $("#btnAdd_SuaQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSuaQuyen", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng ?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_QuyenCN(arrChecked_Id[i]);
                }
            });

        });
        $("#btnDelete_SuaQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSuaQuyen", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyenCN(arrChecked_Id[i]);
                }
            });
        });

        $("#chkSelectAll").on("click", function () {
            var checked_status = $("#chkSelectAll").is(':checked');
            $("#treesjs_ungdungchucnang_vtcn .jstree-anchor").each(function () {
                if (checked_status) {
                    this.classList.add("jstree-clicked");
                } else {
                    this.classList.remove("jstree-clicked");
                }
            });
        });
        $("#btnDelete_VTCN").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_VaiTroChucNang(me.strChucNang_Id);
            });
        });
        $("#btnSave_VaiTro_ChucNang").click(function () {
            if (!me.strUngDung_Id) me.strUngDung_Id = $("#dropUngDung_VTCN").val();

            var arrThem = [];
            var arrDelete = [];
            var arrChecked = [];
            //var tree = $('#treesjs_ungdungchucnang_vtcn').jstree(true);
            //tree.get_checked(true).forEach(function (node) {
            //    arrChecked.push(node.id);
            //});
            var x = $("#treesjs_ungdungchucnang_vtcn .jstree-anchor");
            for (var i = 0; i < x.length; i++) {
                var strId = x[i].id.replace(/_anchor/g, '');
                if (x[i].classList.contains("jstree-clicked")) arrChecked.push(strId);
            }
            console.log(arrChecked)
            $('#treesjs_ungdungchucnang_vtcn li').each(function () {
                if ($(this).find('.jstree-undetermined').length > 0) {
                    console.log('UNDETERMINED:', this.id, $(this).attr('title'));
                    arrChecked.push(this.id);
                }
            });
            console.log(arrChecked)
            me.dtVaiTroChucNang2.forEach(e => {
                if ($('#treesjs_ungdungchucnang_vtcn #' + e.ID).attr("name") == "1") {
                    if (arrChecked.indexOf(e.ID) == -1) arrDelete.push(e.ID);
                } else {
                    if (arrChecked.indexOf(e.ID) != -1) arrThem.push(e.ID);
                }
            })
            console.log(arrThem);
            console.log(arrDelete);
            //var x = $("#treesjs_ungdungchucnang_vtcn .jstree-anchor");
            //for (var i = 0; i < x.length; i++) {
            //    if (x[i].name == "1") {
            //        if (!x[i].classList.contains("jstree-clicked")) arrDelete.push(x[i].id.replace(/_anchor/g, ''));
            //    } else {
            //        if (x[i].classList.contains("jstree-clicked")) arrThem.push(x[i].id.replace(/_anchor/g, ''));
            //    }
            //}


            //var arrChecked_Id = edu.util.getArrCheckedIds("tblChucNang_NDCN", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
            //    return;
            //}
            if (arrDelete.length + arrThem.length == 0) {
                edu.system.alert("Chưa có thay đổi");
                return;
            }
            if (!edu.util.getValById("dropQuyen_VTCN") && arrThem.length) {
                edu.system.alert("Khi thêm cần chọn quyền");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và xóa " + arrDelete.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                //edu.system.alert('<div id="zoneprocessDanhMucTuKhoa"></div>');
                //edu.system.genHTML_Progress("zoneprocessDanhMucTuKhoa", arrThem.length + arrDelete.length);
                for (var i = 0; i < arrThem.length; i++) {
                    me.save_VaiTroChucNang(arrThem[i], 1);
                }
                for (var i = 0; i < arrDelete.length; i++) {
                    me.delete_VaiTroChucNang(arrDelete[i]);
                }
            });
        });
    },
    filterTree_VaiTro: function (keyword) {
        var $tree = $("#treesjs_vaitro_vtcn");
        var kw = (keyword || "").toString().trim().toLowerCase();
        var $anchors = $tree.find("a.jstree-anchor");
        if (!kw) {
            $tree.find("li").show();
            $anchors.each(function () {
                $(this).html($(this).text());
            });
            return;
        }
        $tree.find("li").hide();
        $anchors.each(function () {
            var $a = $(this);
            var text = $a.text();
            var lower = text.toLowerCase();
            var idx = lower.indexOf(kw);
            var icon = $a.find("i").prop("outerHTML") || "";
            if (idx >= 0) {
                var $li = $a.closest("li");
                $li.show();
                $li.parents("li").show();
                var before = text.substring(0, idx);
                var match = text.substring(idx, idx + kw.length);
                var after = text.substring(idx + kw.length);
                $a.html(icon + " " + before + '<mark style="background:#ffe066;padding:0 2px">' + match + '</mark>' + after);
            } else {
                $a.html(icon + " " + text);
            }
        });
    },

    popup_ChucNang: function () {
        $("#btnNotifyModal").remove();
        $("#myModalChucNang_VTCN").modal("show");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-vtcn1", "zone_list_vtcnv4");
        this.getList_VaiTroChucNang();
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-vtcn1", "zone_input_vtcn");
    },
    /*----------------------------------------------
    --Discription: [1] Access DB VaiTro
    --API: 
    ----------------------------------------------*/
    getList_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
			'iM' : edu.system.iM,

            'strLoaiVaiTro_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
        };
        //

        edu.system.makeRequest({
            success: function (data) { 
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTreeJs_Vaitro(dtResult, iPager);
                    me.getList_UngDung();
                }
                else {
                    edu.system.alert("CMS_VaiTro/LayDanhSach: " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert("CMS_VaiTro/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTreeJs_Vaitro: function (dtResult, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUNG_VAITRO_CHA_ID",
                name: "TENVAITRO",
                code: ""
            },
            renderPlaces: ["treesjs_vaitro_vtcn"],
            style: "fa fa-user color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#treesjs_vaitro_vtcn').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strVaiTro_Id = strNameNode;
            //me.getList_VaiTroChucNang();
            //me.getList_QuyenCN();
            me.getList_UngDungVT();
            //----------------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //---------------------------------------------------------------------------------------------------------
        });
    },
    /*----------------------------------------------
    --Discription: [1] Access DB VaiTro_ChucNang 
    --API:  
    ----------------------------------------------*/
    save_VaiTroChucNang: function (strChucNang_Id, iTinhTrangDongBo) {
        var me = this;

        var obj_save = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHhA0OCQv',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Quyen',
            'iM': edu.system.iM,
            'strChucNang_Id': strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (!dtReRult || dtReRult.length == 0) {
                        edu.system.alert("Chức năng này chưa được tạo quyền. Vui lòng vào trang Chức năng để thêm quyền (thêm, sửa, xóa...) trước khi gán cho vai trò!");
                        return;
                    }
                    var arrQuyenKhiChon = $("#dropQuyen_VTCN").val();
                    var iDaGan = 0;
                    dtReRult.forEach(e => {
                        if (arrQuyenKhiChon.indexOf(e.HANHDONG_ID) != -1) {
                            me.save_QuyenCN(e.ID);
                            iDaGan++;
                        }
                    })
                    if (iDaGan == 0) {
                        edu.system.alert("Không có quyền nào phù hợp để gán. Vui lòng kiểm tra lại quyền đã tạo cho chức năng này!");
                    }
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
    getList_VaiTroChucNang: function () {
        var me = this;
        console.log(me.strUngDung_Id);
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJhUpJC4UBRcgKBUzLgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro',
            'iM': edu.system.iM,
            'strUngDung_Id': me.strUngDung_Id,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.dtVaiTroChucNang = dtResult;
                    //me.checkExist_VaiTroChucNang(dtResult);
                    me.loadToTree_VaiTroUngDung(dtResult, iPager);
                    //me.findChucNang();
                    //me.getList_ChucNang();
                }
                else {
                    edu.system.alert(data.Message);
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
    delete_VaiTroChucNang: function (strChucNang_Id) {
        var me = this;
        var obj = {};
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeFyAoFTMuHhA0OCQvcwPP',
            'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen2',
            'iM': edu.system.iM,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strChucNang_Id': strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    $("#modalSuaQuyen").modal("hide");
                    me.getList_VaiTroChucNang();
                }
                else {
                    obj = {
                        content: "CMS_VaiTroChucNang/XoaChucNang: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                obj = {
                    content: "CMS_VaiTroChucNang/XoaChucNang (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_VaiTroChucNang: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblTong_VTCN", data.length);
        var html = "";
        var jsonForm = {
            strTable_Id: "tableVaiTroChucNang_VTCN",
            aaData: data,
            colPos: {
                left: [1, 2],
                fix: [0],
                center: [0, 3]
            },
            sort: true,
            aoColumns: [
                {
                    "mData": "tinhtrangdongbo",
                    "mRender": function (nRow, aData) {
                        var strHienThi = aData.TENCHUCNANG;
                        if (edu.util.checkValue(aData.CHUCNANGCHA_ID)) {
                            strHienThi += " (" + aData.CHUCNANGCHA + ")";
                        }
                        return strHienThi;
                    }
                }
                , {
                    "mData": "tinhtrangdongbo",
                    "mRender": function (nRow, aData) {
                        html = "";
                        if (aData.TINHTRANGDONGBO == 0) {
                            html += '<span class="color-warning">Chưa đồng bộ</span>';
                            html += ' <a id="sync_' + aData.ID + '" class="btn btn-default btn-circle poiter btnSync" title="Đồng bộ"><i class="fa fa-recycle color-active"></i></a>';
                        } else {
                            html += '<span class="color-active">Đã đồng bộ</span>';
                        }
                        return html;
                    }
                }
                , {
                    "mData": "Delete",
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btn-circle color-active btnDelete_VaiTroChucNang" id="delete_vaitrochucnang' + aData.ID + '" title="Xóa" ><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback */
    },
    /*----------------------------------------------
    --Discription: Load danh sách Ứng dụng/ChucNang
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRIULyYFNC8mFSkkLhcgKBUzLgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSUngDungTheoVaiTro',
            'iM': edu.system.iM,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
			'iM' : edu.system.iM,
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 10000,
            'dTrangThai': 1,
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
                    me.dtUngDung = dtResult;
                    me.genCombo_UngDung(dtResult);
                }
                else {
                    edu.system.alert(data.Message);

                }
            },
            error: function (er) {
                edu.system.alert(er);

            },
            type: "POST",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_UngDung: function (data) {
        var me = this;
        var obj = {
            data: me.dtUngDung,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "MAUNGDUNG"
            },
            renderPlace: ["dropUngDung_VTCN"],
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_UngDungVT: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRIULyYFNC8mFSkkLhcgKBUzLgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSUngDungTheoVaiTro',
            'iM': edu.system.iM,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me["dtUngDung2"] = dtResult;
                    $("#tableVTCN tbody").html("");
                    me.genTreeJs_VaiTroUngDung(dtResult);
                }
                else {
                    edu.system.alert(data.Message);

                }
            },
            error: function (er) {
                edu.system.alert(er);

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_ChucNang: function () {
        var me = this;
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
			'iM' : edu.system.iM,
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strChung_UngDung_Id': $("#dropUngDung_VTCN").val(),
            'strCha_Id': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'strPhamViTruyCap_Id': "",
            'dTrangThai': 1
        };
        //var obj_save = {
        //    'action': 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJhUpJC4UBRcgKBUzLgPP',
        //    'func': 'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro',
        //    'iM': edu.system.iM,
        //    'strUngDung_Id': me.strUngDung_Id,
        //    'strVaiTro_Id': me.strVaiTro_Id,
        //    'strNguoiThucHien_Id': edu.system.userId,
        //};


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me["dtVaiTroChucNang2"] = dtResult;
                    me.loadToTree_VaiTroUngDung2(dtResult, iPager);
                }
                else {
                    objNotify = {
                        content: "CMS_ChucNang/LayDanhSach: " + data.Message,
                        type: "i"
                    };
                    edu.system.alertOnModal(objNotify);
                }

            },
            error: function (er) {

                objNotify = {
                    content: "CMS_ChucNang/LayDanhSach (er): " + er,
                    type: "w"
                };
                edu.system.alertOnModal(objNotify);
            },
            type: "POST",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChucNang: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblChucNang_Tong_VTCN", iPager);
        var jsonForm = {
            strTable_Id: "tblChucNang_VTCN",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0],
                center: [0, 2]
            },
            sort: true,
            aoColumns: [
                {
                    "mData": "tinhtrangdongbo",
                    "mRender": function (nRow, aData) {
                        var strHienThi = aData.TENCHUCNANG;
                        if (edu.util.checkValue(aData.CHUCNANGCHA_ID)) {
                            strHienThi += " (" + aData.CHUCNANGCHA + ")";
                        }
                        return strHienThi;
                    }
                }
                , {
                    "mData": "Delete",
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btn-circle color-active btnAdd_ChucNang" id="add_chucnang' + aData.ID + '" title="Thêm" ><i class="fa fa-plus"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback */
    },
    findChucNang: function () {
        var strKey = $('input[name="rdLoaiVaiTro_ChucNang"]:checked').val();
        $("#tblChucNang_VTCN tr").filter(function () {
            $(this).toggle($(this).html().indexOf(strKey) > -1);
        }).css("color", "red");
    },

    checkExist_VaiTroChucNang: function (dtChucNang) {
        //check dtVaiTroChucNang is existed in dtChucNang yet?
        var me = this;
        for (var i = 0; i < dtChucNang.length; i++) {
            if (edu.util.objEqualVal(me.dtVaiTroChucNang, "ID", dtChucNang[i].ID)) {
                //1. remove action
                var render = "add_chucnang" + dtChucNang[i].ID;
                $("#" + render).removeClass("btnAdd_ChucNang");
                //2. notify
                var obj_notify = {
                    renderPlace: render
                };
                edu.system.notifyLocal(obj_notify);
            }
        }
    },
    /*----------------------------------------------
    --Discription: [4] Gen HTML - VaiTro_UngDung
    --API:  
    ----------------------------------------------*/
    process_VaiTroUngDung: function (dtVaiTroChucNang) {
        var me = this;
        var dtVaiTroUngDung = [];
        for (var ud = 0; ud < me.dtUngDung.length; ud++) {
            for (var cn = 0; cn < dtVaiTroChucNang.length; cn++) {
                if (me.dtUngDung[ud].ID === dtVaiTroChucNang[cn].CHUNG_UNGDUNG_ID) {
                    if (!edu.util.objEqualVal(dtVaiTroUngDung, "ID", me.dtUngDung[ud].ID)) {
                        dtVaiTroUngDung.push(me.dtUngDung[ud]);
                    }
                }
            }
        }
        //me.genTreeJs_VaiTroUngDung(dtVaiTroUngDung);
    },
    genTreeJs_VaiTroUngDung: function (dtResult) {
        var me = this;
        edu.util.viewHTMLById("lblVaiTroUngDung_Tong_VTCN", dtResult.length);
        if ($("#zone_input_vtcn").is(':visible')) {
            me.toggle_list();
        }
        //if (dtResult.length > 0) {
        //    $("#dropUngDung_VTCN").val(dtResult[0].ID).trigger("change");
        //    me.getList_ChucNang();
        //}
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: ""
            },
            renderPlaces: ["zone_vaitroungdung"],
            style: "fa fa-hdd-o color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_vaitroungdung').on("select_node.jstree", function (e, data) {
            var strUngDung_Id = data.node.id;
            me.strUngDung_Id = strUngDung_Id;
            me.getList_VaiTroChucNang();
            //me.process_UngDung_ChucNang(strUngDung_Id);
            //----------------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //---------------------------------------------------------------------------------------------------------
        });
        if (dtResult.length > 0) {
            //$('#zone_vaitroungdung #' + dtResult[0].ID).trigger("click");
            var strUngDung_Id = dtResult[0].ID;
            me.strUngDung_Id = strUngDung_Id;
            me.getList_VaiTroChucNang();

        }
    },
    /*----------------------------------------------
    --Discription: [5] Access DB/GenHTML - UngDung_ChucNang
    --API:  
    ----------------------------------------------*/
    process_UngDung_ChucNang: function (strUngDung_Id) {
        var me = this;
        edu.util.objGetDataInData(strUngDung_Id, me.dtVaiTroChucNang, "CHUNG_UNGDUNG_ID", me.genTable_VaiTroChucNang);
    },

    loadToTree_VaiTroUngDung: function (dtResult, iPager) {
        var me = this;
        if (dtResult.length > 0) {

            me.insertHeaderTable("tableVTCN", dtResult, null);
        }
        me.getList_QuyenCN();
        return;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: "",
                //mRender: function (nRow, aData) {
                //    return '<span>' + aData.TENCHUCNANG +'</span> <span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_701380FF6CB4407A80E754DF7905A415"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
                //}
            },
            renderPlaces: ["treesjs_ungdungchucnang_vtcn"],
            style: "fa fa-opera color-active",
            splitString: 10000
        };
        me.loadToTreejs_data(obj);
        for (var i = 0; i < dtResult.length; i++) {
            var strThemMoi = "";
            var strSync = "";
            var strDelete = "";
            if (edu.util.objGetOneDataInData(dtResult[i].ID, dtResult, "CHUCNANGCHA_ID").length == 0) {
                var dtCheck = edu.util.objGetOneDataInData(dtResult[i].ID, me.dtVaiTroChucNang, "ID");
                if (dtCheck.length == 0) strThemMoi = '<i class="fa fa-plus color-active poiter btnAdd_ChucNang" id="add_chucnang' + dtResult[i].ID + '"></i>';
                else {
                    strDelete = '<i class="fa fa-trash color-active poiter btnDelete_VaiTroChucNang" id="delete_vaitrochucnang' + dtResult[i].ID + '" ></i>';
                    if (dtCheck.TINHTRANGDONGBO == 0) strSync = '<i class="fa fa-recycle color-active poiter btnSync" id="sync_' + dtResult[i].ID + '"></i>';
                }
                $($("#treesjs_ungdungchucnang_vtcn #" + dtResult[i].ID)[0]).append('<span class="pull-right zoneChucNang"><span style="padding-right: 20px"><i class="fa fa-eye color-active poiter btnSuaQuyen" id="' + dtResult[i].ID + '"></i></span><span style="padding-right: 20px">' + strThemMoi + '</span><span style="padding-right: 20px;">' + strSync + '</span><span>' + strDelete + '</span></span>');

            } else {
                $("#treesjs_ungdungchucnang_vtcn #" + dtResult[i].ID + "_anchor").append('<span class="pull-right zoneChucNang"><span style="padding-right: 20px"><i class="fa fa-eye color-active poiter btnSuaQuyen" id="' + dtResult[i].ID + '"></i></span>');
            }
            //$($("#treesjs_ungdungchucnang_vtcn #" + dtResult[i].ID)[0]).append('<span class="pull-right zoneChucNang"><span style="padding-right: 20px"><i class="fa fa-eye color-active poiter btnSuaQuyen" id="' + dtResult[i].ID + '"></i></span>');
        }
    },

    loadToTreejs_data: function (obj) {
        var me = this;
        console.log("loadToTreejs_data")
        var data = obj.data;
        var render = obj.renderInfor;
        var render_places = obj.renderPlaces;
        var iStringSplit = obj.splitString;

        if (iStringSplit == undefined) iStringSplit = 30;
        if (render == undefined) render = {
            id: "ID",
            parentId: "CHUCNANGCHA_ID",
            name: "TENCHUCNANG",
            code: ""
        };

        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;

        var place = "";
        for (var p = 0; p < render_places.length; p++) {
            var node = "";
            node += '<ul>';
            if (edu.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
                $(place).jstree('destroy');
            }
            if (data.length > 0) {
                node += userRender(data, null);
            }
            else {
                node += '<li>Không tìm thấy dữ liệu!</li>';
            }
            node += '</ul>';
            $(place).append(node);
            configTreejs();
        }
        //processing functions
        function userRender(obj, parentId) {
            var row = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][parent_id] == parentId) {
                    if (render.Render == undefined) {
                        var strName = "";
                        if (render != undefined && render.mRender != undefined) {
                            strName = render.mRender(i, obj[i]);
                        } else {
                            strName = obj[i][name];
                        }
                        row += '<li class="btnEvent jstree-open" id="' + obj[i][id] + '" title="' + obj[i][name] + '">' + edu.util.splitString(strName, iStringSplit);
                    } else {
                        if (render.Render != undefined) {
                            row += render.Render(i, obj[i]);
                        }
                    }
                    row += '<ul>';
                    row += userRender(obj, obj[i][id]);
                    row += '</ul>';
                    row += '</li>';
                }
            }
            return row;
        }

        function configTreejs() {
            console.log("goconfig");
            //1. check
            if (edu.util.checkValue(obj.check)) {
                var arr_checked = obj.arrChecked;
                console.log(obj.arrChecked)
                //1. config to allow check in treejs
                $(place).jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"]
                });
                //2.the way to refresh treejs --> when update something new
                var temp = $(place).one("refresh.jstree", function (e, data) {
                    if (edu.util.checkValue(arr_checked)) {
                        for (var i = 0; i < arr_checked.length; i++) {
                            data.instance.select_node(arr_checked[i]);
                        }
                    }
                }).jstree(true).refresh();
                console.log("checkbox");
                console.log(temp);
            }
            //2. style user
            else {
                if (edu.util.checkValue(obj.style)) {//user style-user
                    $(place).jstree({
                        "types": {
                            "default": {
                                "icon": obj.style
                            }
                        },
                        "plugins": ["types"]
                    });
                }
                else {
                    $(place).jstree();//default user
                }
                var temp1 = $(place).jstree(true).refresh();
                $(place).one("refresh.jstree").jstree(true).refresh();
                console.log("user")
            }
        }
    },

    save_QuyenCN: function (strCore_Quyen_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhcgKBUzLh4QNDgkLwPP',
            'func': 'PKG_CORE_QUANTRI_02.Them_Core_VaiTro_Quyen',
            'iM': edu.system.iM,
            'strCore_Quyen_Id': strCore_Quyen_Id,
            'strVaiTro_Id': me.strVaiTro_Id,
            'dHieuLuc': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuyenCN();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuyenCN: function (strDanhSach_Id) {
        var me = this;//--Edit
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRIQNDgkLxUpJC4ULyYFNC8m',
            'func': 'PKG_CORE_QUANTRI_01.LayDSQuyenTheoUngDung',
            'iM': edu.system.iM,
            'strUngDung_Id': me.strUngDung_Id,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuyenCN"] = dtReRult;
                    me.genTable_QuyenCN(dtReRult, data.Pager);
                    me.dtVaiTroChucNang.forEach(e => {
                        var arrQuyen = [];
                        var dtQuyen = dtReRult.filter(ele => e.ID == ele.CHUCNANG_ID);
                        dtQuyen.forEach(ele => arrQuyen.push(ele.HANHDONG_TEN));
                        $("#tableVTCN #" + e.ID).html(e.TENCHUCNANG + "<br/> <span style='font-size: 8px'>(" + arrQuyen.toString(", ") + ")");
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
    delete_QuyenCN: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeFyAoFTMuHhA0OCQv',
            'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_VaiTro_Quyen',
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
                    me.getList_QuyenCN();
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
    genTable_QuyenCN: function (data, iPager) {
        $("#lblQuyenCN_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyenCN",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.QuyenCN.getList_QuyenCN()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CHUCNANG_MA"
                },
                {
                    "mDataProp": "CHUCNANG_TEN"
                },
                {
                    "mDataProp": "HANHDONG_TEN"
                },
                {
                    "mDataProp": "DAPHAN"
                },
                {
                    "mDataProp": "MOTA"
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


    getList_SuaQuyen: function (strDanhSach_Id) {
        var me = this;//--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHhA0OCQv',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Quyen',
            'iM': edu.system.iM,
            'strChucNang_Id': me.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtSuaQuyen"] = dtReRult;
                    me.genTable_SuaQuyen(dtReRult, data.Pager);

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

    genTable_SuaQuyen: function (data, iPager) {
        var me = this;
        $("#lblQuyenCN_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblSuaQuyen",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.QuyenCN.getList_QuyenCN()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CHUCNANG_TEN"
                }
                ,
                {
                    "mDataProp": "HANHDONG_TEN"
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            var ocheck = me.dtQuyenCN.find(ele => ele.ID == e.ID);
            if (ocheck && ocheck.DAPHAN == 1) {
                var poit = $("#tblSuaQuyen #checkX" + ocheck.ID);
                $(poit).attr('checked', true);
                $(poit).prop('checked', true);
            }
        })
        /*III. Callback*/
    },

    insertHeaderTable: function (strTable_Id, objTotal, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        //for (var k = 0; k < me.dtNguoiDungUngDung.length; k++) {
        //    var obj = edu.util.objGetDataInData(me.dtNguoiDungUngDung[k].ID, objTotal, "CHUNG_UNGDUNG_ID");
        //    if (obj.length > 0) {
        //        $("#" + strTable_Id + " tbody").append('<tr><td rowspan="' + (obj.length + 1) + '">' + me.dtNguoiDungUngDung[k].TENUNGDUNG + '</td></tr>');
        //    }
        //}
        for (var k = 0; k < me.dtUngDung2.length; k++) {
            var obj = objTotal.filter(e => e.CHUNG_UNGDUNG_ID == me.dtUngDung2[k].ID);
            //var obj = edu.util.objGetDataInData(me.dtUngDung2[k].ID, objTotal, "CHUNG_UNGDUNG_ID");
            var iDemCha = 0;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].CHUCNANGCHA_ID == strQuanHeCha) {
                    var tempCheck = recuseHeader(obj, obj[i], 0);
                    if (tempCheck == 0) {
                        iDemCha += 1;
                    } else {
                        iDemCha += tempCheck;
                    }
                }
            }
            if (obj.length > 0) {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - iDemCha]).prepend('<td rowspan="' + iDemCha + '" name="1">' + me.dtUngDung2[k].TENUNGDUNG + '</td>');
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        //document.getElementById("lblThongTinBang").colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && $(x[i].cells[j]).attr("name") != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }
        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            var strTenChucNang = objHead.TENCHUCNANG;
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            if (colspan == 0) {
                arrHeaderId.push(objHead.ID);
                $("#" + strTable_Id + " tbody").append('<tr><td id="' + objHead.ID + '" class="pointer btnSuaQuyen" colspan="' + (iThuTu + 1) + '">' + strTenChucNang + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                if (colspan == 1) {
                    $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td  id="' + objHead.ID + '" class="pointer btnSuaQuyen" rowspan="' + colspan + '" name="1">' + strTenChucNang + '</td>');
                } else
                    $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td  id="' + objHead.ID + '" class="pointer btnSuaQuyen" rowspan="' + colspan + '" >' + strTenChucNang + '</td>');
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].CHUCNANGCHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },

    loadToTree_VaiTroUngDung2: function (dtResult, iPager) {
        var me = this;
        var arrCheck = [];
        for (var i = 0; i < dtResult.length; i++) {
            var dtCheck = me.dtVaiTroChucNang.filter(e => e.ID == dtResult[i].ID);// edu.util.objGetOneDataInData(dtResult[i].ID, , "ID");
            if (dtCheck.length != 0) {
                if (me.dtVaiTroChucNang.filter(e => e.CHUCNANGCHA_ID == dtResult[i].ID).length > 0) continue;
                arrCheck.push(dtResult[i].ID);
                $("#treesjs_ungdungchucnang_vtcn #" + dtResult[i].ID).attr("name", "1");
            }
        }
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: "",
                //check: true
                //mRender: function (nRow, aData) {
                //    return '<span>' + aData.TENCHUCNANG +'</span> <span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_701380FF6CB4407A80E754DF7905A415"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
                //}
            },
            renderPlaces: ["treesjs_ungdungchucnang_vtcn"],
            style: "fa fa-opera color-active",
            splitString: 10000,
            check: true,
            arrChecked: arrCheck
        };
        edu.system.loadToTreejs_data(obj);
        //for (var i = 0; i < dtResult.length; i++) {
        //    var dtCheck = me.dtVaiTroChucNang.filter(e => e.ID == dtResult[i].ID);// edu.util.objGetOneDataInData(dtResult[i].ID, , "ID");
        //    if (dtCheck.length != 0) {
        //        //
        //        //if (me.dtVaiTroChucNang.filter(e => e.CHUCNANGCHA_ID == dtResult[i].ID).length > 0) continue;
        //        var xpoint = document.getElementById(dtResult[i].ID + "_anchor");
        //        if (xpoint != null && xpoint != undefined) {
        //            //tree.activate_node(dtResult[i].ID);
        //            document.getElementById(dtResult[i].ID + "_anchor").classList.add("jstree-clicked");
        //            document.getElementById(dtResult[i].ID + "_anchor").name = 1;
        //        }
        //    }
        //}
        for (var i = 0; i < dtResult.length; i++) {
            var dtCheck = me.dtVaiTroChucNang.filter(e => e.ID == dtResult[i].ID);// edu.util.objGetOneDataInData(dtResult[i].ID, , "ID");
            if (dtCheck.length != 0) {
                $("#treesjs_ungdungchucnang_vtcn #" + dtResult[i].ID).attr("name", "1");
            }
        }
    },

    loadToTreejs_data2: function (obj) {
        var me = this;
        var data = obj.data;
        var render = obj.renderInfor;
        var render_places = obj.renderPlaces;
        var iStringSplit = obj.splitString;

        if (iStringSplit == undefined) iStringSplit = 30;
        if (render == undefined) render = {
            id: "ID",
            parentId: "CHUCNANGCHA_ID",
            name: "TENCHUCNANG",
            code: ""
        };

        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;

        var place = "";
        for (var p = 0; p < render_places.length; p++) {
            var node = "";
            node += '<ul>';
            if (edu.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
                $(place).jstree('destroy');
            }
            if (data.length > 0) {
                node += userRender(data, null);
            }
            else {
                node += '<li>Không tìm thấy dữ liệu!</li>';
            }
            node += '</ul>';
            $(place).append(node);
            configTreejs();
        }
        //processing functions
        function userRender(obj, parentId) {
            var row = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][parent_id] == parentId) {
                    if (render.Render == undefined) {
                        var strName = "";
                        if (render != undefined && render.mRender != undefined) {
                            strName = render.mRender(i, obj[i]);
                        } else {
                            strName = obj[i][name];
                        }
                        row += '<li class="btnEvent jstree-open" id="' + obj[i][id] + '" title="' + obj[i][name] + '">' + edu.util.splitString(strName, iStringSplit);
                    } else {
                        if (render.Render != undefined) {
                            row += render.Render(i, obj[i]);
                        }
                    }
                    row += '<ul>';
                    row += userRender(obj, obj[i][id]);
                    row += '</ul>';
                    row += '</li>';
                }
            }
            return row;
        }

        function configTreejs() {
            //1. check
            if (edu.util.checkValue(obj.check)) {
                var arr_checked = obj.arrChecked;
                //1. config to allow check in treejs
                $(place).jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"]
                });
                //2.the way to refresh treejs --> when update something new
                var temp = $(place).one("refresh.jstree", function (e, data) {
                    if (edu.util.checkValue(arr_checked)) {
                        for (var i = 0; i < arr_checked.length; i++) {
                            data.instance.select_node(arr_checked[i]);
                        }
                    }
                }).jstree(true).refresh();
            }
            //2. style user
            else {
                if (edu.util.checkValue(obj.style)) {//user style-user
                    $(place).jstree({
                        "types": {
                            "default": {
                                "icon": obj.style
                            }
                        },
                        "plugins": ["checkbox"],
                    });
                }
                else {
                    $(place).jstree();//default user
                }
                $(place).jstree(true).refresh();
                $(place).one("refresh.jstree").jstree(true).refresh();

            }
        }
    },
};