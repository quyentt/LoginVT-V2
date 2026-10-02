/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 05/12/2018
----------------------------------------------*/
function NhomNgachBac() { }
NhomNgachBac.prototype = {
    dtNhomNgachBac: [],
    strNhomNgach_Id: '',
    strNhomNgachBac_Id: '',

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
        $("#btnSearch_NhomNgachBac_NhanSu").click(function () {
            me.getList_NhomNgachBac();
        });
        $("#txtSearch_NhomNgachBac_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhomNgachBac();
            }
        });

        $("#btnSave_NNB").click(function () {
            if (edu.util.checkValue(me.strNhomNgachBac_Id)) {
                me.update_NhomNgachBac();
            }
            else {
                me.save_NhomNgachBac();
            }
        });
        $("#tblNhomNgachBac").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_input();
                me.strNhomNgachBac_Id = strId;
                me.getDetail_NhomNgachBac(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNhomNgachBac").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_NhomNgachBac(strId);
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
        edu.util.focus("txtSearch_NhomNgachBac_TuKhoa");
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_NhomNgachBac("xxx");
            setTimeout(function () {
                var obj = {
                    strMaBangDanhMuc: constant.setting.CATOR.NS.NHNG,
                    strTenCotSapXep: "",
                    iTrangThai: 1
                };
                edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenCombo_DanhMuc_NhomNgach);
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.BALU, "dropNNB_Bac");
                }, 50);
            }, 50);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strNhomNgachBac_Id = "";
        var arrId = ["dropNNB_Bac", "txtNNB_HeSo", "txtNNB_ThoiHanNangBac", "txtNNB_ThoiGianApDung","txtNNB_GhiChu"];
        edu.util.resetValByArrId(arrId);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zoneNhomNgachBac", "zone_detail_NhomNgachBac");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zoneNhomNgachBac", "zone_input_NhomNgachBac");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zoneNhomNgachBac", "zone_notify_NhomNgachBac");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NhomNgachBac
    -------------------------------------------*/
    getList_NhomNgachBac: function (strNhomNgach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_NhomNgachBac/LayDanhSach',
            
            'strTuKhoa': "",
            'strBac_Id': "",
            'strNhomNgach_Id': strNhomNgach_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex':1,
            'pageSize':10
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
    save_NhomNgachBac: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_NhomNgachBac/ThemMoi',
            

            'strId': "",
            'strBac_Id': edu.util.getValById("dropNNB_Bac"),
            'strNhomNgach_Id': edu.util.getValById("dropNNB_NhomNgach"),
            'dThoiHanNangLuong': edu.util.getValById("txtNNB_ThoiHanNangBac"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strGhiChu': edu.util.getValById("txtNNB_GhiChu")
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_NhomNgachBac(me.strNhomNgach_Id);
                }
                else {
                    edu.system.alert("NS_NhomNgachBac/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NhomNgachBac/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_NhomNgachBac: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_NhomNgachBac/CapNhat',
            

            'strId': me.strNhomNgachBac_Id,
            'strBac_Id': edu.util.getValById("dropNNB_Bac"),
            'strNhomNgach_Id': edu.util.getValById("dropNNB_NhomNgach"),
            'dThoiHanNangLuong': edu.util.getValById("txtNNB_ThoiHanNangBac"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strGhiChu': edu.util.getValById("txtNNB_GhiChu")
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_NhomNgachBac(me.strNhomNgach_Id);
                }
                else {
                    edu.system.alert("NS_NhomNgachBac/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_NhomNgachBac/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_NhomNgachBac: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtNhomNgachBac, "ID", me.viewEdit_NhomNgachBac);
    },
    delete_NhomNgachBac: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'NS_NhomNgachBac/Xoa',
            

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
                    me.getList_NhomNgachBac(me.strNhomNgach_Id);
                }
                else {
                    obj = {
                        content: "NS_NhomNgachBac/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NS_NhomNgachBac/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML NhomNgachBac
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NhomNgachBac: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhomNgachBac",
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
                        var strBac = aData.BAC_TEN;
                        return strBac;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return "";
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btnEdit" id="edit_' + aData.ID + '" href="#" title="Edit"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_NhomNgachBac: function (data) {
        var me = main_doc.NhomNgachBac;

        var dt = data[0];
        //View - Nguoi nhap
        edu.util.viewValById("lblQuyetDinh_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        //View - Thong tin
        edu.util.viewValById("dropNNB_NhomNgach", dt.NHOMNGACH_ID);
        edu.util.viewValById("dropNNB_Bac", dt.BAC_ID);
        edu.util.viewValById("txtNNB_HeSo", "");
        edu.util.viewValById("txtNNB_ThoiHanNangBac", dt.THOIHANNANGLUONG);
        edu.util.viewValById("txtNNB_ThoiGianApDung", "");
        edu.util.viewValById("txtNNB_GhiChu", dt.GHICHU);
    },
     /*------------------------------------------
    --Discription: [2] GenHTML Treejs DanhMuc NhomNgachBac
    --ULR:  Modules
    -------------------------------------------*/
    cbGenCombo_DanhMuc_NhomNgach: function (data) {
        var me = main_doc.NhomNgachBac;
        me.cbGenTreeJs_DanhMuc_NhomNgach(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "QUANHECHA_ID",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropNNB_NhomNgach"],
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
            renderPlaces: ["zone_NNB_treejs"],
            style: "fa fa-folder-open-o color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_NNB_treejs').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            //
            me.strNhomNgach_Id = strNameNode;
            $("#dropNNB_NhomNgach").val(strNameNode).trigger("change");
            //
            me.getList_NhomNgachBac(strNameNode);
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
};