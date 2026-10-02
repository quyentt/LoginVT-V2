/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 17/12/2018
----------------------------------------------*/
function NghiLe() { }
NghiLe.prototype = {
    dtNghiLe: [],
    strNghiLe_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });

        $("#dropSearch_LoaiNghiLe,#dropSearch_NamApDung").on("select2:select", function () {
            me.getList_NghiLe();
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveNghiLe").click(function () {
            if (edu.util.checkValue(me.strNghiLe_Id)) {
                me.update_NghiLe();
            }
            else {
                me.save_NghiLe();
            }
        });
        $("#btnRefresh").click(function () {
            me.getList_NghiLe();
        });
        $("#tblNghiLe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strNghiLe_Id = strId;
                me.getDetail_NghiLe(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNghiLe").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_NghiLe(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        me.toggle_list();
        $("#dpNghiLe").datepicker({
            todayHighlight: true,
        });
        edu.system.dateYearToCombo("1993", "dropNghiLe_NamApDung,dropSearch_NamApDung", "Chọn năm áp dụng");
        edu.system.lunarCalendar("listSuggess_NghiLe");
        me.getList_NghiLe();
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.NS.NNL0,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.getList_DanhMucNghiLe);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strNghiLe_Id = "";
        var arrId = ["dropNghiLe_NgayLe", "txtNghiLe_NgayNghi", "dropNghiLe_NamApDung","txtNghiLe_NoiDung"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_list: function () {
        edu.util.toggle_overide("zoneNghiLe", "zone_detail_NghiLe");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneNghiLe", "zone_input_NghiLe");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneNghiLe", "zone_notify_NghiLe");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NghiLe
    -------------------------------------------*/
    getList_NghiLe: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QuyDinhNghiLe/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'strDanhMucNghiLe_Id': edu.util.getValById('dropSearch_LoaiNghiLe'),
            'strNamApDung': edu.util.getValById('dropSearch_NamApDung'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.dtNghiLe = dtResult;
                    me.genTable_NghiLe(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_QuyDinhNghiLe/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNghiLe/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NghiLe: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhNghiLe/ThemMoi',
            

            'strId': "",
            'strDanhMucNghiLe_Id': edu.util.getValById("dropNghiLe_NgayLe"),
            'strNgayNghi': edu.util.getValById("txtNghiLe_NgayNghi"),
            'strNamApDung': edu.util.getValById("dropNghiLe_NamApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_NghiLe();
                }
                else {
                    edu.system.alert("NS_QuyDinhNghiLe/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNghiLe/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_NghiLe: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhNghiLe/CapNhat',
            

            'strId': me.strNghiLe_Id,
            'strDanhMucNghiLe_Id': edu.util.getValById("dropNghiLe_NgayLe"),
            'strNgayNghi': edu.util.getValById("txtNghiLe_NgayNghi"),
            'strNamApDung': edu.util.getValById("dropNghiLe_NamApDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_NghiLe();
                }
                else {
                    edu.system.alert("NS_QuyDinhNghiLe/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhNghiLe/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_NghiLe: function (strId) {
        var me = this;
        console.log(strId);
        console.log(me.dtNghiLe);
        edu.util.objGetDataInData(strId, me.dtNghiLe, "ID", me.viewEdit_NghiLe);
    },
    delete_NghiLe: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyDinhNghiLe/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NghiLe();
                }
                else {
                    obj = {
                        content: "NS_QuyDinhNghiLe/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QuyDinhNghiLe/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NghiLe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NghiLe: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblNghiLe",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NghiLe.getList_NghiLe()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                center: [0, 2, 3, 5, 6],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DANHMUCNGHILE_TEN",
                }
                , {
                    "mDataProp": "NGAYNGHI",
                }
                , {
                    "mDataProp": "NAMAPDUNG",
                }
                , {
                    "mDataProp": "NGUOITHUCHIEN_TENDAYDU",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="edit_' + aData.ID + '"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete_' + aData.ID + '"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_NghiLe: function (data) {
        var me = main_doc.NghiLe;

        var dt = data[0];
        edu.util.viewValById("dropNghiLe_NgayLe", dt.DANHMUCNGHILE_ID);
        edu.util.viewValById("txtNghiLe_NgayNghi", dt.NGAYNGHI);
        edu.util.viewValById("dropNghiLe_NamApDung", dt.NAMAPDUNG);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML DanhMucNghiLe
    --ULR:  Modules
    -------------------------------------------*/
    getList_DanhMucNghiLe: function (data) {
        var me = main_doc.NghiLe;
        me.genCombo_DanhMucNghiLe(data);
        me.genTable_DanhMucNghiLe(data);
    },
    genCombo_DanhMucNghiLe: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropNghiLe_NgayLe", "dropSearch_LoaiNghiLe"],
            type: ""
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_DanhMucNghiLe: function (data) {
        var jsonForm = {
            strTable_Id: "tblNghiLe_NgayLe",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0],
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN",
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    }
};