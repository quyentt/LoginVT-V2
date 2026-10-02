/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KeHoach() { };
KeHoach.prototype = {
    strKeHoach_Id: '',
    dtKeHoach: [],
    strPhanQuyen_Id: '',
    dtPhanQuyen: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KeHoach();
        me.getList_CoSoDaoTao();
        me.getList_BaoCao();
        edu.system.loadToCombo_DanhMucDuLieu("THBC.KEHOACH.TRANGTHAI", "dropSeacrch_TrangThai");

        $("#tblKeHoach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KeHoach(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoach").delegate(".btnPhanQuyen", "click", function () {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            me.toggle_edit();
            $("#zoneAdd").slideUp();
            var aData = me.dtKeHoach.find(e => e.ID === strId);
            edu.util.viewValById("txtTen_View", aData.TEN);
            edu.util.viewValById("txtTuNgay_View", aData.TUNGAY);
            edu.util.viewValById("txtDenNgay_View", aData.DENNGAY);
            me.getList_PhanQuyen();
        });

        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnKeHoach").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KeHoach").click(function () {
            me.save_KeHoach();
        });
        $("#btnDelete_KeHoach").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KeHoach(me.strKeHoach_Id);
            });
        });
        $("#btnSearch").click(function () {
            me.getList_KeHoach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoach();
            }
        });
        
        $(".btnAddPhanQuyen").click(function () {
            $("#zoneAdd").slideDown();
        });
        $("#btnSave_PhanQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoSo", "checkX");
            var arrCheckedBaoCao_Id = edu.util.getArrCheckedIds("tblBaoCao", "checkX");
            if (arrChecked_Id.length == 0 || arrCheckedBaoCao_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length + arrCheckedBaoCao_Id.length);
            arrChecked_Id.forEach(e => {
                arrCheckedBaoCao_Id.forEach(ele => {
                    me.save_PhanQuyen(e, ele);
                });
            });
        });
        $("#tblKetQuaPhanQuyen").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strPhanQuyen_Id = strId;
            if (edu.util.checkValue(strId)) {
                me.viewForm_PhanQuyen(me.dtPhanQuyen.find(e => e.ID === strId));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_PhanQuyen_Edit").click(function () {
            $('#myModalPhanQuyen').modal('hide');
            var strCoSo_Id = edu.util.getValById('dropCoSo');
            var strBaoCao_Id = edu.util.getValById('dropBaoCao');
            me.save_PhanQuyen(strCoSo_Id, strBaoCao_Id);
            setTimeout(function () {
                me.getList_PhanQuyen();
            },300)
        });
        $("#btnDelete_PhanQuyen").click(function () {
            $('#myModalPhanQuyen').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_PhanQuyen(me.strPhanQuyen_Id);
            });
        });


        $("#chkSelectAll_BaoCao").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblBaoCao" });
        });
        $("#chkSelectAll_CoSo").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCoSo" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKeHoach_Id = "";
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
    },
    popup_PhanQuyen: function () {
        //show
        $('#myModalPhanQuyen').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_PhanQuyen: function () {
        var me = this;
        me.strCauTruc_Id = "";
        edu.util.viewValById("txtThuTu_Phu", "");
        edu.util.viewValById("dropThanhPhan_Phu", "");
        edu.util.viewValById("dropThanhPhanCha_Phu", me.strCha_Id);
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_KeHoachBaoCao/ThemMoi',
            'type': 'POST',
            'strId': me.strKeHoach_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMa': edu.util.getValById('txtMa'),
            'strTen': edu.util.getValById('txtTen'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strTrangThai_Id': edu.util.getValById('dropSeacrch_TrangThai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_KeHoachBaoCao/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_KeHoach();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
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
    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
		var obj_save = {
			'action': 'CMS_BaoCao_XuLy_MH/DSA4BRIVCQMCHgokCS4gIikDIC4CIC4P',
			'func': 'pkg_thbc_xuly.LayDSTHBC_KeHoachBaoCao',
			'iM' : edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTrangThai_Id': edu.util.getValById('dropSeacrch_TrangThai'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoach = dtReRult;
                    me.genTable_KeHoach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
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
    delete_KeHoach: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_KeHoachBaoCao/Xoa',
            
            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoach();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KeHoach: function (data, iPager) {
        $("#lblKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
                iDataRow: iPager
            },
            colPos: {
                center: [0,3,4,5, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "TRANGTHAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnPhanQuyen" id="' + aData.ID + '" title="Sửa"><i class="fa fa-eye color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KeHoach: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtKeHoach, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        me.strKeHoach_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_PhanQuyen: function (strTHBC_CoSoDaoTao_Id, strTHBC_HeThongBaoCao_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_BaoCao_CoSo/ThemMoi',
            'type': 'POST',
            'strId': me.strPhanQuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTHBC_HeThongBaoCao_Id': strTHBC_HeThongBaoCao_Id,
            'strTHBC_CoSoDaoTao_Id': strTHBC_CoSoDaoTao_Id,
            'strTHBC_KeHoachBaoCao_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_BaoCao_CoSo/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalPhanQuyen #notify"
                        }
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalPhanQuyen #notify"
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_PhanQuyen();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXXX", function () {
                    me.getList_PhanQuyen();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhanQuyen: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_BaoCao_CoSo/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTHBC_KeHoachBaoCao_Id': me.strKeHoach_Id,
            'strThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhanQuyen = dtReRult;
                    me.genTable_PhanQuyen(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanQuyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_BaoCao_CoSo/Xoa',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_PhanQuyen();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    viewForm_PhanQuyen: function (data) {
        var me = this;
        console.log(data);
        //call popup --Edit
        me.popup_PhanQuyen();
        //view data --Edit
        edu.util.viewValById("dropBaoCao", data.THBC_HETHONGBAOCAO_ID);
        edu.util.viewValById("dropTruong", data.THBC_NHATRUONG_ID);
        edu.util.viewValById("dropCoSo", data.THBC_COSODAOTAO_ID);
        me.strPhanQuyen_Id = data.ID;
    },
    genTable_PhanQuyen: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaPhanQuyen",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_PhanQuyen()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "THBC_NHATRUONG_TEN"
                },
                {
                    "mDataProp": "THBC_COSODAOTAO_TEN"
                },
                {
                    "mDataProp": "THBC_HETHONGBAOCAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CoSoDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_BaoCao_Chung/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CoSoDaoTao(dtReRult);
                    me.genCombo_CoSoDaoTao(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CoSoDaoTao: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblCoSo",
            aaData: data,
            colPos: {
                center: [0, 3],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COSODAOTAO_CHA_TEN"
                },
                {
                    "mDataProp": "TEN"
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

    genCombo_CoSoDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropCoSo"],
            title: "Chọn cơ sở"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_BaoCao: function () {
        var me = this;
        var obj_list = {
            'action': 'CMS_HeThongBaoCao/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_BaoCao(dtReRult);
                    me.genCombo_BaoCao(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_BaoCao: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblBaoCao",
            aaData: data,
            colPos: {
                center: [0, 2],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
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
    genCombo_BaoCao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropBaoCao"],
            title: "Chọn báo cáo"
        };
        edu.system.loadToCombo_data(obj);
    },
}