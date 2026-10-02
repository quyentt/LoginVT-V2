/*----------------------------------------------
--Author: nnthuong
--Phone:
--Date of created:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DanhMucThuocTinh() { }
DanhMucThuocTinh.prototype = {
    objHTML_DMTT: {},
    arrValid_DMTT: [],
    dtUngDung:[],
    strDanhMucThuocTinh_Id: '',
    strDanhMucTenBang_Id: '',

    init: function () {
        var me = this;

        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial page
        -------------------------------------------*/
        me.objHTML_DMTT = {
            table_id: "tbldata_DMTT",
            prefix_id: "chkSelectAll_DMTT",
            regexp: /chkSelectAll_DMTT/g,
            chkOne: "chkSelectOne_DMTT",
            btn_edit: "btnEdit",
            btn_save_id: "btnSave_DMTT",
            btn_save_tl: "Lưu",
        };
        me.arrValid_DMTT = [
            { "MA": "dropTenTruong", "THONGTIN1": "1" },
            { "MA": "txtMoTa", "THONGTIN1": "1" }
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        me.getList_DMTB();
        /*------------------------------------------
        --Discription: [1] Action DanhMucThuocTinh
        --Order: 
        -------------------------------------------*/
        $("#btnSave_DMTT").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DMTT);
            if (valid) {
                var selected_id = edu.system.updateModal(this, me.objHTML_DMTT);
                me.save_DMTT();
            }
        });
        $("#btnDelete_DMTT").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.objHTML_DMTT);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
                $("#btnYes").click(function (e) {
                    me.delete_DMTT(selected_id);
                });
                return false;
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu trước khi xóa!");
            }
        });
        $("#tbldata_DMTT").delegate(".btnEdit", "click", function () {
            var selected_id = edu.system.updateModal(this, me.objHTML_DMTT);
            if (edu.util.checkValue(selected_id)) {
                me.resetPopup();
                me.strDanhMucThuocTinh_Id = selected_id;
                me.getDetail_DMTT(selected_id);
            }
            else {
                edu.system.alert("Không lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $("#btnRefresh_DMTT").click(function () {
            me.getList_DMTT(me.strDanhMucTenBang_Id);
        });
        $(".btnExtend_Search").click(function () {
            me.getList_DMTB();
        });
        $("#btnAddnew_DMTT").click(function () {
            me.resetPopup();
            me.popup();
        });
        $("[id$= " + me.objHTML_DMTT.prefix_id + "]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_DMTT);
        });
        $(document).delegate("." + me.objHTML_DMTT.chkOne, "click", function () {
            edu.util.checkedOne_BgRow(this, me.objHTML_DMTT);
        });
        /*------------------------------------------
        --Discription: [2] Action DanhMucTenBang
        -------------------------------------------*/
        $("#txtSearch_Keyword_DMTB_DMTT").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DMTB();
            }
        });
        /*------------------------------------------
        --Discription: [3] Action UngDung
        -------------------------------------------*/
        $('#dropSearch_UngDung_DMTT').on('select2:select', function () {
            me.getList_DMTB();
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucThuocTinh
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = this;
        me.strDanhMucThuocTinh_Id = "";

        edu.util.resetValById("dropTenTruong");
        edu.util.resetValById("txtMoTa");

        edu.system.createModal(me.objHTML_DMTT);
    },
    /*------------------------------------------
	--Discription: [1]  ACESS DB ==> DanhMucTenBang
    --Author: nnthuong
	-------------------------------------------*/
    getList_DMTB: function () {
        var me = this;
        var pageSize = edu.system.pageSize_default;
        var strUngDung_Id = edu.util.getValById("dropSearch_UngDung_DMTT");

        if (edu.util.checkValue(strUngDung_Id)) {
            pageSize = 100000;
        }

        var obj_list = {
            'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
            'func': 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
            'iM': edu.system.iM,
            'versionAPI'    : 'v1.0',

            'strPhanCapDanhMuc_Id' : "",
            'strChung_TenDanhMuc_Cha_Id'     : "",
            'strNhomDanhMuc_Id' : strUngDung_Id,
            'strTuKhoa'     : edu.util.getValById("txtSearch_Keyword_DMTB_DMTT"),
            'pageIndex'     : edu.system.pageIndex_default,
            'pageSize'      : pageSize,
            'dTrangThai': 1,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA')
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
                    me.LoadToTree_DMTB(dtResult, iPager);
                    if (!edu.util.checkValue(me.dtUngDung)) {
                        me.getList_UngDung();
                    }
                   
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach: " + JSON.stringify(data.Message));
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucTenBang.LayDanhSach: " + JSON.stringify(er));
            },
            type: 'POST',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2]  ACESS DB ==> DanhMucThuocTinh
    --Author: nnthuong
	-------------------------------------------*/
    save_DMTT: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
			'action': 'CMS_DanhMuc_MH/FSkkLBUpNC4iFSgvKQUgLykMNCIP',
			'func': 'pkg_chung_danhmuc.ThemThuocTinhDanhMuc',
			'iM' : edu.system.iM,

            'strId': me.strDanhMucThuocTinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTenTruongDuLieu': edu.util.getValById("dropTenTruong"),
            'strChung_TenDanhMuc_Id': me.strDanhMucTenBang_Id,
            'strMoTa': edu.util.getValById("txtMoTa"),
            'dThuTu': 0,
            'dTrangThai': 1,
            'strNgayThucHien': "",
        };
        if (obj_save.strId) obj_save.action = 'CMS_DanhMuc_MH/EjQgFSk0LiIVKC8pBSAvKQw0IgPP';
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strDanhMucThuocTinh_Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!"
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!"
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_DMTT(me.strDanhMucTenBang_Id);
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "CMS_DanhMucThuocTinh/ThemMoi" + data.Message
                    };
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "w",
                    content: "CMS_DanhMucThuocTinh/ThemMoi" + JSON.stringify(er)
                };
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DMTT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikVKTQuIhUoLykFIC8pDDQi',
            'func': 'pkg_chung_danhmuc.LayDanhSachThuocTinhDanhMuc',
            'iM': edu.system.iM,
            'strTuKhoa': "",
            'strCHUNG_TENDANHMUC_Id': me.strDanhMucTenBang_Id,
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
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
                    else {
                        dtResult = [];
                        iPager = 0;
                    }
                    me.genTable_DMTT(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_DanhMucThuocTinh.LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucThuocTinh.LayDanhSach: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DMTT: function (strDanhMucThuocTinh_Id) {
        var me = this;
        //view data --Edit
        var obj_detail = {
			'action': 'CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FIC8pDDQiFSkkLggl',
			'func': 'pkg_chung_danhmuc.LayThongTinDanhMucTheoId',
			'iM' : edu.system.iM,
            'strId': strDanhMucThuocTinh_Id,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data[0];
                    }
                    else {
                        dtResult = [];
                    }
                    me.viewForm_DMTT(dtResult);
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "CMS_DanhMucThuocTinh/LayChiTiet" + data.Message
                    };
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "w",
                    content: "CMS_DanhMucThuocTinh/LayChiTiet" + JSON.stringify(er)
                };
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMTT: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_DanhMuc_MH/GS4gFSk0LiIVKC8pBSAvKQw0IgPP',
            'func': 'pkg_chung_danhmuc.XoaThuocTinhDanhMuc',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_DMTT();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucThuocTinh.Xoa: " + JSON.stringify(data.Message),
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucThuocTinh.Xoa: " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [3]  ACESS DB ==> UngDung
    --Author: nnthuong
	-------------------------------------------*/
    getList_UngDung: function () {
        var me = main_doc.DanhMucThuocTinh;
        var obj = {
            iTrangThai: 1,
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.extend.getList_UngDung(obj, "", "", me.cbGenCombo_UngDung);
    },
    /*------------------------------------------
     --Discription: [1] Gen HTML ==> DanhMucTenBang
     --Author: nnthuong
     -------------------------------------------*/
    LoadToTree_DMTB: function (dtResult, iPager) {
        var me = this;
        if (edu.util.checkValue(edu.util.getValById("dropSearch_UngDung_DMTT"))) {
            iPager = 0;//khongphantrang
        }
        edu.system.loadPagination(
            "zone_danhmuctenbang_dmtt",
            "main_doc.DanhMucThuocTinh.getList_DMTB()",
            iPager,
            {
                bChange: false,
                bLeft: false
            }
        );
        edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUNG_TENDANHMUC_CHA_ID",
                name: "TENDANHMUC",
                code: ""
            },
            renderPlaces: ["zone_danhmuctenbang_dmtt"]
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_danhmuctenbang_dmtt').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            //
            me.strDanhMucTenBang_Id = strNameNode;
            me.getList_DMTT();
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
    /*------------------------------------------
	--Discription: [2] Gen HTML ==> DanhMucThuocTinh
	--Author: nnthuong
	-------------------------------------------*/
    genTable_DMTT: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.objHTML_DMTT.table_id,
            aaData: data,
            colPos: {
                center: [0, 3, 4],
                fix: [0, 3, 4]
            },
            sort: true,
            aoColumns: [{
                "mDataProp": "TENTRUONGDULIEU"
            }
                ,
            {
                "mDataProp": "MOTA"
            }
                , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a class="btn btn-default btn-circle color-active btnEdit" id="' + aData.ID + '" href="#" title="Sửa" ><i class="fa fa-edit"></i></a>';
                }
            }
                , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.objHTML_DMTT.prefix_id + aData.ID + '" class="' + me.objHTML_DMTT.chkOne + '"/>';
                }

            }

            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_DMTT: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropTenTruong", data.TENTRUONGDULIEU);
        edu.util.viewValById("txtMoTa", data.MOTA);
    },
    /*------------------------------------------
	--Discription: [4] Gen HTML ==> UngDung
	--Author: nnthuong
	-------------------------------------------*/
    cbGenCombo_UngDung: function (data) {
        var me = main_doc.DanhMucThuocTinh;
        me.dtUngDung = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_UngDung_DMTT"],
            type: "",
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    }
};
