/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function HangChucDanh() { }
HangChucDanh.prototype = {
    dtHangChucDanh: [],
    strNhomNgach_Id: '',
    strHangChucDanh_Id: '',

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
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HangChucDanh_NhanSu").click(function () {
            me.getList_HangChucDanh();
        });
        $("#txtSearch_HangChucDanh_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HangChucDanh();
            }
        });

        $("#btnSave_HCD").click(function () {
            if (edu.util.checkValue(me.strHangChucDanh_Id)) {
                me.update_HangChucDanh();
            }
            else {
                me.save_HangChucDanh();
            }
        });
        $("#tblHangChucDanh").delegate(".btnDetail", "click", function () {
            if (edu.util.checkValue(me.strNhomNgach_Id)) {
                me.rewrite();
                me.toggle_detail();
                me.getList_NhomNgachBac();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHangChucDanh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strHangChucDanh_Id = strId;
                me.getDetail_HangChucDanh(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHangChucDanh").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_HangChucDanh(strId);
                });
                return false;
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
        edu.util.focus("txtSearch_HangChucDanh_TuKhoa");
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        me.getList_HangChucDanh("xxx");
        setTimeout(function () {
            var obj = {
                strMaBangDanhMuc: constant.setting.CATOR.NS.NHNG,
                strTenCotSapXep: "",
                iTrangThai: 1
            };
            edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenCombo_DanhMuc_NhomNgach);
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.CDNN, "dropHCD_ChucDanhNgheNghiep");
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.HACD, "dropHCD_Hang");
                    setTimeout(function () {
                        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.NGLU, "dropHCD_Ngach");
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strHangChucDanh_Id = "";
        var arrId = ["dropHCD_ChucDanhNgheNghiep", "dropHCD_Hang", "dropHCD_Ngach","txtHCD_GhiChu"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneHangChucDanh", "zone_detail_HangChucDanh");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneHangChucDanh", "zone_input_HangChucDanh");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneHangChucDanh", "zone_notify_HangChucDanh");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB HangChucDanh
    -------------------------------------------*/
    getList_HangChucDanh: function (strNhomNgach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_HangChucDanh/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiChucDanhNgheNghiep_Id': "",
            'strNgach_Id': "",
            'strNhomNgach_Id': strNhomNgach_Id,
            'strHang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtHangChucDanh = dtResult;
                    me.genTable_HangChucDanh(dtResult);
                }
                else {
                    edu.system.alert("NS_HangChucDanh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_HangChucDanh/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_HangChucDanh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HangChucDanh/ThemMoi',
            

            'strId': "",
            'strLoaiChucDanhNgheNghiep_Id': edu.util.getValById("dropHCD_ChucDanhNgheNghiep"),
            'strHang_Id': edu.util.getValById("dropHCD_Hang"),
            'strNhomNgach_Id': edu.util.getValById("dropHCD_NhomNgach"),
            'dThoiHanNangLuong': "",
            'strThoiGianApDung': "",
            'strNgach_Id': edu.util.getValById("dropHCD_Ngach"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strGhiChu': edu.util.getValById("txtHCD_GhiChu")
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_HangChucDanh(me.strNhomNgach_Id);
                }
                else {
                    edu.system.alert("NS_HangChucDanh/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_HangChucDanh/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HangChucDanh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HangChucDanh/CapNhat',
            

            'strId': me.strHangChucDanh_Id,
            'strLoaiChucDanhNgheNghiep_Id': edu.util.getValById("dropHCD_ChucDanhNgheNghiep"),
            'strHang_Id': edu.util.getValById("dropHCD_Hang"),
            'strNhomNgach_Id': edu.util.getValById("dropHCD_NhomNgach"),
            'dThoiHanNangLuong': "",
            'strThoiGianApDung': "",
            'strNgach_Id': edu.util.getValById("dropHCD_Ngach"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strGhiChu': edu.util.getValById("txtHCD_GhiChu")
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_HangChucDanh(me.strNhomNgach_Id);
                }
                else {
                    edu.system.alert("NS_HangChucDanh/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_HangChucDanh/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HangChucDanh: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtHangChucDanh, "ID", me.viewEdit_HangChucDanh);
    },
    delete_HangChucDanh: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_HangChucDanh/Xoa',
            

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
                    me.getList_HangChucDanh(me.strNhomNgach_Id);
                }
                else {
                    obj = {
                        content: "NS_HangChucDanh/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_HangChucDanh/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML HangChucDanh
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HangChucDanh: function (data) {
        var me = this;
        var strChucDanhNgheNghiep = "";
        var strHang = "";
        var strNgachCongChuc = "";

        var jsonForm = {
            strTable_Id: "tblHangChucDanh",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 4],
                left: [1, 2],
                fix: [0, 4]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNgach = aData.NHOMNGACH_TEN;
                        return strNgach;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        strChucDanhNgheNghiep   = edu.util.returnEmpty(aData.LOAICHUCDANHNGHENGHIEP_TEN);
                        strHang                 = edu.util.returnEmpty(aData.HANG_TEN);
                        if (edu.util.checkValue(strHang)) {
                            strNgachCongChuc    = strChucDanhNgheNghiep + " - " + strHang;
                        }
                        else {
                            strNgachCongChuc    = strChucDanhNgheNghiep;
                        }
                        return strNgachCongChuc;
                    }
                }
                , {
                    "mDataProp": "NGACH_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnDetail" id="detail_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-info color-active"></i></a>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnEdit" id="edit_' + aData.ID + '" href="#" title="Edit"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_HangChucDanh: function (data) {
        var me = main_doc.HangChucDanh;

        var dt = data[0];
        //View - Nguoi nhap
        edu.util.viewValById("lblQuyetDinh_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        //View - Thong tin
        edu.util.viewValById("dropHCD_ChucDanhNgheNghiep", dt.LOAICHUCDANHNGHENGHIEP_ID);
        edu.util.viewValById("dropHCD_Hang", dt.HANG_ID);
        edu.util.viewValById("dropHCD_Ngach", dt.NGACH_ID);
        edu.util.viewValById("dropHCD_NhomNgach", dt.NHOMNGACH_ID);
        edu.util.viewValById("txtHCD_GhiChu", dt.GHICHU);
    },
    /*------------------------------------------
   --Discription: [2] GenHTML Treejs DanhMuc HangChucDanh
   --ULR:  Modules
   -------------------------------------------*/
    cbGenCombo_DanhMuc_NhomNgach: function (data) {
        var me = main_doc.HangChucDanh;
        me.cbGenTreeJs_DanhMuc_NhomNgach(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "QUANHECHA_ID",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropHCD_NhomNgach"],
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenTreeJs_DanhMuc_NhomNgach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "QUANHECHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_HCD_treejs"],
            style: "fa fa-folder-open-o color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_HCD_treejs').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            //
            me.toggle_notify();
            //
            me.strNhomNgach_Id = strNameNode;
            $("#dropHCD_NhomNgach").val(strNameNode).trigger("change");
            //
            me.getList_HangChucDanh(strNameNode);
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
    --Discription: [3] AcessDB NhomNgachBac
    -------------------------------------------*/
    getList_NhomNgachBac: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_NhomNgachBac/LayDanhSach',
            
            'strTuKhoa': "",
            'strBac_Id': "",
            'strNhomNgach_Id': me.strNhomNgach_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtNhomNgachBac = dtResult;
                    me.genTable_NhomNgachBac(dtResult);
                }
                else {
                    edu.system.alert("NS_NhomNgachBac/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NhomNgachBac/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_NhomNgachBac: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHCD_NhomNgachBac",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0],
                left: [1, 2],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNgach = aData.NHOMNGACH_TEN;
                        return strNgach;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strBac = aData.BAC_TEN;
                        return strBac;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return "";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};