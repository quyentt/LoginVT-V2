/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/11/2017
----------------------------------------------*/
function UngDungChucNang() { }
UngDungChucNang.prototype = {

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_UngDung();

        $("#txtSearch_UngDung_UDCN").on("input", function () {
            me.filterTree($(this).val(), "treesjs_ungdung_udcn");
        });
        $("#txtSearch_ChucNang_UDCN").on("input", function () {
            me.filterTree($(this).val(), "treesjs_ungdungchucnang_udcn");
        });
    },

    filterTree: function (keyword, treeId) {
        var $tree = $("#" + treeId);
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
    /*----------------------------------------------
    --Discription: [1] Access DB UngDung and ChucNang
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;
        var itrangThai = 1;
        var strTuKhoa = "";
        var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
			'iM' : edu.system.iM,

            'strTuKhoa': strTuKhoa,
            'pageIndex': 1,
            'pageSize': 10000,
            'dTrangThai': itrangThai
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
                    me.genTreeJs_UngDung(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_UngDung/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data:obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_UngDungChucNang: function (strUngDung_Id) {
        var me = this;

        //--Edit
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
			'iM' : edu.system.iM,
            'strTuKhoa': "",
            'strChung_UngDung_Id': strUngDung_Id,
            'strCha_Id': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'strPhamViTruyCap_Id': "",
            'dTrangThai': 1
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
                    me.genTreeJs_UngDungChucNang(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_ChucNang/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/LayDanhSach (ex): " + ex, "w");
                
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] GenHTML UngDung and ChucNang
    ----------------------------------------------*/
    genTreeJs_UngDung: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblUngDung_Tong_UDCN", iPager);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: ""
            },
            renderPlaces: ["treesjs_ungdung_udcn"],
            style: "fa fa-hdd-o color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#treesjs_ungdung_udcn').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strVaiTro_Id = strNameNode;
            me.getList_UngDungChucNang(strNameNode);
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
    genTreeJs_UngDungChucNang: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblChucNang_Tong_UDCN", iPager);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: ""
            },
            renderPlaces: ["treesjs_ungdungchucnang_udcn"],
            style: "fa fa-opera color-active"
        };
        edu.system.loadToTreejs_data(obj);
    }
};