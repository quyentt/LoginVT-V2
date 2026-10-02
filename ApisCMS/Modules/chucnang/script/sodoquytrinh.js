/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/11/2017
----------------------------------------------*/
function SoDoQuyTrinh() { }
SoDoQuyTrinh.prototype = {
    dtChucNang: [],
    dtVaiTroChucNang: [],
    dtNguoiDungChucNang: [],
    strUngDung_Id: '',
    strChucNang_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_UngDung();
        /*------------------------------------------
        --Discription: [0] Action Common
        --Order: 
        -------------------------------------------*/
        //$(".btnClose").click(function () {
        //    me.toggle_detail();
        //});
        /*------------------------------------------
        --Discription: [1] Action UngDung
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_UngDung_CN").on("select2:select", function () {
            var strUngDung_Id = edu.util.getValById("dropSearch_UngDung_CN");
            if (edu.util.checkValue(strUngDung_Id)) {
                me.getList_ChucNang();
                $("#dropChucNang_UngDung").val(strUngDung_Id).trigger("change");
            }
            else {
                edu.system.alert("Vui lòng chọn ứng dụng!");
            }
        });
    },
    /*----------------------------------------------
    --Discription: [1] Access DB UngDung
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_UngDung(dtResult);
                }
                else {
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_UngDung/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'CMS_UngDung/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'pageIndex': 1,
                'pageSize': 1000,
                'dTrangThai': 1,
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] GenHTML UngDung
    --API:  
    ----------------------------------------------*/
    genCombo_UngDung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "MAUNGDUNG"
            },
            renderPlace: ["dropSearch_UngDung_CN", "dropChucNang_UngDung"],
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Discription: [2] Access DB ChucNang
    --API:  
    ----------------------------------------------*/
    getList_ChucNang: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action'            : 'CMS_ChucNang/LayDanhSach',
            'versionAPI'        : 'v1.0',
            'strTuKhoa'         : "",
            'strChung_UngDung_Id'     : edu.util.getValById("dropSearch_UngDung_CN"),
            'strCha_Id'         : "",
            'pageIndex'         : 1,
            'pageSize'          : 1000,
            'strPhamViTruyCap_Id': "",
            'dTrangThai'        : 1
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
                    me.dtChucNang = dtResult;
                    me.genTreeJs_ChucNang(dtResult, iPager);
                    me.genCombo_ChucNang(dtResult);
                }
                else {
                    edu.system.alert("CMS_ChucNang/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_ChucNang: function (strId, action) {
        var me = this;
        switch (action) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtChucNang, "ID", me.viewEdit_ChucNang);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtChucNang, "ID", me.viewForm_ChucNang);
                break;
        }
        
    },
    /*----------------------------------------------
    --Discription: [2] GenHTML ChucNang
    --API:  
    ----------------------------------------------*/
    genCombo_ChucNang: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: ""
            },
            renderPlace: ["dropChucNang_Cha"],
            title: "Chọn chức năng cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTreeJs_ChucNang: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblChucNang_Tong_CN", iPager);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: ""
            },
            renderPlaces: ["treesjs_chucnang_cn"],
            style: "fa fa-opera color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#treesjs_chucnang_cn').on("select_node.jstree", function (e, data) {
            me.strChucNang_Id = data.node.id;
            me.getDetail_ChucNang(me.strChucNang_Id, constant.setting.ACTION.VIEW);
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
    }
};