/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function GioLamViec() { }
GioLamViec.prototype = {
    dtGioLamViec: [],
    strGioLamViec_Id: '',

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
        $(".btnSearchGioLamViec_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSaveGioLamViec").click(function () {
            if (edu.util.checkValue(me.strGioLamViec_Id)) {
                me.update_GioLamViec();
            }
            else {
                me.save_GioLamViec();
            }
            
        });
        $("#btnRefreshGioLamViec").click(function () {
            me.getList_GioLamViec();
        });
        $("#tblGioLamViec").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strGioLamViec_Id = strId;
                me.getDetail_GioLamViec(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblGioLamViec").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_GioLamViec(strId);
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
        edu.system.dateYearToCombo("1993", "dropNamApDung", "Chọn năm áp dụng")
        edu.util.roundClock();
        edu.util.digitalClock();
        
        me.getList_GioLamViec();
        setTimeout(function () {
            var obj = {
                strMaBangDanhMuc: constant.setting.CATOR.NS.TGLV,
                strTenCotSapXep: "",
                iTrangThai: 1
            };
            edu.system.getList_DanhMucDulieu(obj, "", "", me.getList_NhomGio);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strGioLamViec_Id = "";
        var arrId = ["dropGioLamViec_NhomThoiGian", "txtGioLamViec_NgayApDung", "txtGioLamViec_BDBS_Gio",
            "txtGioLamViec_BDBS_Phut", "txtGioLamViec_KTBS_Gio", "txtGioLamViec_KTBS_Phut", "txtGioLamViec_BDBC_Gio",
            "txtGioLamViec_BDBC_Phut", "txtGioLamViec_KTBC_Gio", "txtGioLamViec_KTBC_Phut"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_list: function () {
        edu.util.toggle_overide("zoneGioLamViec", "zone_detail_GioLamViec");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneGioLamViec", "zone_input_GioLamViec");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneGioLamViec", "zone_notify_GioLamViec");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB GioLamViec
    -------------------------------------------*/
    getList_GioLamViec: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QuyDinhGioLamViec/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhomThoiGian_Id':'',
            'strNguoiThucHien_Id': "",
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
                    }
                    me.dtGioLamViec = dtResult;
                    me.genTable_GioLamViec(dtResult);
                }
                else {
                    edu.system.alert("NS_QuyDinhGioLamViec/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhGioLamViec/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_GioLamViec: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhGioLamViec/ThemMoi',
            

            'strId'                 : "",
            'strNhomThoiGian_Id'    : edu.util.getValById("dropGioLamViec_NhomThoiGian"),
            'strNgayApDung'         : edu.util.getValById("txtGioLamViec_NgayApDung"),
            'dGioBatDauBuoiSang'    : edu.util.getValById("txtGioLamViec_BDBS_Gio"),
            'dPhutBatDauBuoiSang'   : edu.util.getValById("txtGioLamViec_BDBS_Phut"),
            'dGioKetThucBuoiSang'   : edu.util.getValById("txtGioLamViec_KTBS_Gio"),
            'dPhutKetThucBuoiSang'  : edu.util.getValById("txtGioLamViec_KTBS_Phut"),
            'dGioBatDauBuoiChieu'   : edu.util.getValById("txtGioLamViec_BDBC_Gio"),
            'dPhutBatDauBuoiChieu'  : edu.util.getValById("txtGioLamViec_BDBC_Phut"),
            'dGioKetThucBuoiChieu'  : edu.util.getValById("txtGioLamViec_KTBC_Gio"),
            'dPhutKetThucBuoiChieu' : edu.util.getValById("txtGioLamViec_KTBC_Phut"),
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_GioLamViec();
                }
                else {
                    edu.system.alert("NS_QuyDinhGioLamViec/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhGioLamViec/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_GioLamViec: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_QuyDinhGioLamViec/CapNhat',
            

            'strId'                 : me.strGioLamViec_Id,
            'strNhomThoiGian_Id'    : edu.util.getValById("dropGioLamViec_NhomThoiGian"),
            'strNgayApDung'         : edu.util.getValById("txtGioLamViec_NgayApDung"),
            'dGioBatDauBuoiSang'    : edu.util.getValById("txtGioLamViec_BDBS_Gio"),
            'dPhutBatDauBuoiSang'   : edu.util.getValById("txtGioLamViec_BDBS_Phut"),
            'dGioKetThucBuoiSang'   : edu.util.getValById("txtGioLamViec_KTBS_Gio"),
            'dPhutKetThucBuoiSang'  : edu.util.getValById("txtGioLamViec_KTBS_Phut"),
            'dGioBatDauBuoiChieu'   : edu.util.getValById("txtGioLamViec_BDBC_Gio"),
            'dPhutBatDauBuoiChieu'  : edu.util.getValById("txtGioLamViec_BDBC_Phut"),
            'dGioKetThucBuoiChieu'  : edu.util.getValById("txtGioLamViec_KTBC_Gio"),
            'dPhutKetThucBuoiChieu' : edu.util.getValById("txtGioLamViec_KTBC_Phut"),
            'strNguoiThucHien_Id'   : edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_GioLamViec();
                }
                else {
                    edu.system.alert("NS_QuyDinhGioLamViec/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_QuyDinhGioLamViec/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_GioLamViec: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtGioLamViec, "ID", me.viewEdit_GioLamViec);
    },
    delete_GioLamViec: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_QuyDinhGioLamViec/Xoa',
            

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
                    me.getList_GioLamViec();
                }
                else {
                    obj = {
                        content: "NS_QuyDinhGioLamViec/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_QuyDinhGioLamViec/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML GioLamViec
    --ULR:  Modules
    -------------------------------------------*/
    genTable_GioLamViec: function (data) {
        var me = this;
        var iGioBatDau = "";
        var strThoiGian = "";
        var iGioKetThuc = "";

        var jsonForm = {
            strTable_Id: "tblGioLamViec",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7, 8],
                left: [1, 2],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYAPDUNG",
                }
                , {
                    "mDataProp": "NHOMTHOIGIAN_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        iGioBatDau = edu.util.returnEmpty(aData.GIOBATDAUBUOISANG, "NUM");
                        iGioKetThuc = edu.util.returnEmpty(aData.PHUTBATDAUBUOISANG, "NUM")
                        strThoiGian = '<span class="italic">' + iGioBatDau + ":" + iGioKetThuc + '</span>';
                        return strThoiGian;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        iGioBatDau = edu.util.returnEmpty(aData.GIOKETTHUCBUOISANG, "NUM");
                        iGioKetThuc = edu.util.returnEmpty(aData.PHUTKETTHUCBUOISANG, "NUM")
                        strThoiGian = '<span class="italic">' + iGioBatDau + ":" + iGioKetThuc + '</span>';
                        return strThoiGian;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        iGioBatDau = edu.util.returnEmpty(aData.GIOBATDAUBUOICHIEU, "NUM");
                        iGioKetThuc = edu.util.returnEmpty(aData.PHUTBATDAUBUOICHIEU, "NUM")
                        strThoiGian = '<span class="italic">' + iGioBatDau + ":" + iGioKetThuc + '</span>';
                        return strThoiGian;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        iGioBatDau = edu.util.returnEmpty(aData.GIOKETTHUCBUOICHIEU, "NUM");
                        iGioKetThuc = edu.util.returnEmpty(aData.PHUTKETTHUCBUOICHIEU, "NUM")
                        strThoiGian = '<span class="italic">' + iGioBatDau + ":" + iGioKetThuc + '</span>';
                        return strThoiGian;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="edit_' + aData.ID + '" title="' + aData.NGUOITHUCHIEN_TENDAYDU + '"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete_' + aData.ID + '" title="' + aData.NGUOITHUCHIEN_TENDAYDU + '"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_GioLamViec: function (data) {
        var me = main_doc.GioLamViec;
        var dt = data[0];
        edu.util.viewValById("dropGioLamViec_NhomThoiGian", dt.NHOMTHOIGIAN_ID);
        edu.util.viewValById("txtGioLamViec_NgayApDung",    dt.NGAYAPDUNG);
        edu.util.viewValById("txtGioLamViec_BDBS_Gio",      dt.GIOBATDAUBUOISANG);
        edu.util.viewValById("txtGioLamViec_BDBS_Phut",     dt.PHUTBATDAUBUOISANG);
        edu.util.viewValById("txtGioLamViec_KTBS_Gio",      dt.GIOKETTHUCBUOISANG);
        edu.util.viewValById("txtGioLamViec_KTBS_Phut",     dt.PHUTKETTHUCBUOISANG);
        edu.util.viewValById("txtGioLamViec_BDBC_Gio",      dt.GIOBATDAUBUOICHIEU);
        edu.util.viewValById("txtGioLamViec_BDBC_Phut",     dt.PHUTBATDAUBUOICHIEU);
        edu.util.viewValById("txtGioLamViec_KTBC_Gio",      dt.GIOKETTHUCBUOICHIEU);
        edu.util.viewValById("txtGioLamViec_KTBC_Phut",     dt.PHUTKETTHUCBUOICHIEU);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML DanhMucNghiLe
    --ULR:  Modules
    -------------------------------------------*/
    getList_NhomGio: function (data) {
        var me = main_doc.GioLamViec;
        me.genCombo_NhomGio(data);
        me.genTable_NhomGio(data);
    },
    genCombo_NhomGio: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropGioLamViec_NhomThoiGian"],
            type: ""
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_NhomGio: function (data) {
        var jsonForm = {
            strTable_Id: "tblGioLamViec_NhomGio",
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
    },
    /*------------------------------------------
    --Discription: [3] GenHTML Clock
    --ULR:  Modules
    -------------------------------------------*/
};