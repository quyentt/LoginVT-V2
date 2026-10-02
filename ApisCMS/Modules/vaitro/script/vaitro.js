/*----------------------------------------------
--Author: nnthuong  
--Phone: 
--Date of created: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function VaiTro() { }
VaiTro.prototype = {
    arrValid_VaiTro: [],
    dtVaiTro: '',
    strVaiTro_Id: '',
    dtCache: {},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial Page 
        -------------------------------------------*/
        //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
        me.arrValid_VaiTro = [
            { "MA": "txtVaiTro_Ten", "THONGTIN1": "EM" },
            { "MA": "txtVaiTro_Ma", "THONGTIN1": "EM" },
            { "MA": "txtVaiTro_ThuTuHienThi", "THONGTIN1": "EM#IN" },
            { "MA": "dropVaiTro_Loai", "THONGTIN1": "EM" }
        ];
        me.getList_VaiTro();

        $("#txtSearch_VaiTro_VT").on("input", function () {
            me.filterTree_VaiTro($(this).val());
        });
        /*------------------------------------------
        --Discription: Action_main DanhMucThuocTinh
        --Order: thêm/xóa/sửa/tìm kiếm/tải lại/khác
        -------------------------------------------*/
        $("#btnSave_VaiTro").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_VaiTro);
            if (valid) {
                me.save_VaiTro();
            }
        });
        $("#btnUndo_VaiTro").click(function () {
            me.viewForm_VaiTro(me.dtCache);
        });
        $("#btnDelete_VaiTro").click(function (e) {
            e.preventDefault();
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_VaiTro();
            });
            return false;
        });
        $("#btnRewrite_VaiTro").click(function () {
            me.rewrite();
        });
        $("#btnAddNew_VaiTro").click(function () {
            me.rewrite();
            $(".myModalLabel").html('<i class="fa-light fa-user-gear"></i> Thêm mới vai trò ');
            $(".btnOpenDelete").hide();
            $("#btnUndo_VaiTro").hide();
        });
        /*------------------------------------------
        --Discription: Action_extra 
        -------------------------------------------*/
        $("#btnAddnew").click(function () {
            me.resetPopup();
            me.popup();
        });
    },
    /*----------------------------------------------
    --Discription: function common
    ----------------------------------------------*/
    rewrite: function () {
        var me = this;
        edu.util.resetValById("txtVaiTro_Ten");
        edu.util.resetValById("txtVaiTro_Ma");
        edu.util.resetValById("txtVaiTro_ThuTuHienThi");
        edu.util.resetValById("txtVaiTro_MoTa");
        edu.util.resetValById("dropVaiTro_Loai");
        edu.util.resetValById("dropVaiTro_Cha");
        me.strVaiTro_Id = "";
    },
    /*----------------------------------------------
    --Discription: Danh mục vai trò
    --API:  Common/Controller/sysVaiTro
    ----------------------------------------------*/
    save_VaiTro: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var strChaId = edu.util.getValById("dropVaiTro_Cha");
        if (me.strVaiTro_Id != '' && strChaId == me.strVaiTro_Id) {
            edu.system.alert("Vai trò cha không được trùng với chính vai trò đang chỉnh sửa!", "w");
            return;
        }
        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung/ThemMoiVaiTro',
            'versionAPI'        : 'v1.0',
            'strMaVaiTro'             : edu.util.getValById("txtVaiTro_Ma"),
            'strTenVaiTro'            : edu.util.getValById("txtVaiTro_Ten"),
            'strMoTa'           : edu.util.getValById("txtVaiTro_MoTa"),
            'dThuTu'            : edu.util.getValById("txtVaiTro_ThuTuHienThi"),
            'dTrangThai'        : 1,
            'strLoaiVaiTro_Id'  : edu.util.getValById("dropVaiTro_Loai"),
            'strChung_VaiTro_Cha_Id'         : edu.util.getValById("dropVaiTro_Cha"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': me.strVaiTro_Id,
        };
        if (me.strVaiTro_Id != '')
            obj_save = {
                'action': 'CMS_QuanLyNguoiDung/SuaVaiTro',
                'versionAPI': 'v1.0',
                'strMaVaiTro': edu.util.getValById("txtVaiTro_Ma"),
                'strTenVaiTro': edu.util.getValById("txtVaiTro_Ten"),
                'strMoTa': edu.util.getValById("txtVaiTro_MoTa"),
                'dThuTu': edu.util.getValById("txtVaiTro_ThuTuHienThi"),
                'dTrangThai': 1,
                'strLoaiVaiTro_Id': edu.util.getValById("dropVaiTro_Loai"),
                'strChung_VaiTro_Cha_Id': edu.util.getValById("dropVaiTro_Cha"),
                'strNguoiThucHien_Id': edu.system.userId,
                'strId': me.strVaiTro_Id,
            };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strVaiTro_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        me.dtCache = edu.util.objGetDataInData(me.strVaiTro_Id, me.dtVaiTro, "ID");
                        $("#btnUndo_VaiTro").show();
                    }
                    me.getList_VaiTro();
                }
                else {
                    edu.system.alert("CMS_VaiTro/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTro/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
			'iM' : edu.system.iM,
            'versionAPI'        : 'v1.0',
            'strLoaiVaiTro_Id'  : "",
            'strTuKhoa'         : "",
            'pageIndex'         : 1,
            'pageSize'          : 1000,
            'dTrangThai': 1,
            'strChung_VaiTro_Cha_Id': edu.util.getValById('dropAAAA'),
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
                    me.dtVaiTro = dtResult;
                    me.genCombo_VaiTro();
                    me.genTreeJs_Vaitro(dtResult, iPager);
                    edu.system.loadToCombo_DanhMucDuLieu("QLTC.LOVT", "dropVaiTro_Loai", "Chọn loại vai trò");
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
    getDetail_VaiTro: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtVaiTro, "ID", me.viewForm_VaiTro);
    },
    delete_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_QuanLyNguoiDung/XoaVaiTro',
            'versionAPI'            : 'v1.0',
            'strIds'                 : me.strVaiTro_Id,
            'strNguoiThucHien_Id'   : edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_VaiTro();
                }
                else {
                    edu.system.alert("CMS_VaiTro/Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTro/Xoa (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: Generating html on interface
    --ULR:  Modules/VaiTro/Templates/VaiTro
    ----------------------------------------------*/
    filterTree_VaiTro: function (keyword) {
        var $tree = $("#zone_vaitro_treejs");
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
            renderPlaces: ["zone_vaitro_treejs"],
            style: "fa fa-user color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_vaitro_treejs').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
            $(".btnOpenDelete").show();
            me.strVaiTro_Id = strNameNode;
            me.getDetail_VaiTro(strNameNode);
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
    viewForm_VaiTro: function (data) {
        var me = this;
        //view data
        edu.util.viewValById("txtVaiTro_Ten", data[0].TENVAITRO);
        edu.util.viewValById("txtVaiTro_ThuTuHienThi", data[0].THUTU);
        edu.util.viewValById("txtVaiTro_Ma", data[0].MAVAITRO);
        edu.util.viewValById("txtVaiTro_MoTa", data[0].MOTA);
        edu.util.viewValById("dropVaiTro_Loai", data[0].LOAIVAITRO_ID);
        edu.util.viewValById("dropVaiTro_Cha", data[0].CHUNG_VAITRO_CHA_ID);
    },
    genCombo_VaiTro: function () {
        var me = this;
        //--Sanitize: phá vòng lặp cha-con (self-parent hoặc cycle) để tránh đệ quy vô hạn
        var dtSafe = [];
        if (me.dtVaiTro && me.dtVaiTro.length > 0) {
            var mapById = {};
            for (var i = 0; i < me.dtVaiTro.length; i++) {
                mapById[me.dtVaiTro[i].ID] = me.dtVaiTro[i];
            }
            for (var j = 0; j < me.dtVaiTro.length; j++) {
                var item = Object.assign({}, me.dtVaiTro[j]);
                var parentId = item.CHUNG_VAITRO_CHA_ID;
                var visited = {};
                visited[item.ID] = true;
                while (parentId && mapById[parentId]) {
                    if (visited[parentId]) {
                        item.CHUNG_VAITRO_CHA_ID = "";
                        break;
                    }
                    visited[parentId] = true;
                    parentId = mapById[parentId].CHUNG_VAITRO_CHA_ID;
                }
                dtSafe.push(item);
            }
        }
        var obj = {
            data: dtSafe,
            renderInfor: {
                id: "ID",
                parentId: "CHUNG_VAITRO_CHA_ID",
                name: "TENVAITRO",
                code: "MAVAITRO"
            },
            renderPlace: ["dropVaiTro_Cha"],
            type: "unorder",
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    }
};