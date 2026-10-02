/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HeSoNgach() { };
HeSoNgach.prototype = {
    strHeSoNgach_Id: '',
    dtHeSoNgach: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeSoNgach();

        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NGACH", "dropSeacrch_Ngach,dropNgach");
        $("#tblHeSoNgach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_HeSoNgach(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_HeSoNgach").click(function () {
            me.save_HeSoNgach();
        });
        $("#btnDelete_HeSoNgach").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HeSoNgach(me.strHeSoNgach_Id);
            });
        });
        $("#btnXoaHeSoNgach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeSoNgach", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HeSoNgach(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_HeSoNgach();
            }, arrChecked_Id.length * 50);
        });

        $("#btnSearch").click(function () {
            me.getList_HeSoNgach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeSoNgach();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHeSoNgach" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strHeSoNgach_Id = "";
        edu.util.viewValById("dropNgach", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtHeSo", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HeSoNgach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_Ngach/ThemMoi',

            'strId': me.strHeSoNgach_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgach_Id': edu.util.getValById('dropNgach'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dHeSo': edu.util.getValById('txtHeSo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_Ngach/CapNhat';
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
                    me.getList_HeSoNgach();
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
    getList_HeSoNgach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HeSo_Ngach/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strNgach_Id': edu.util.getValById('dropSeacrch_Ngach'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHeSoNgach = dtReRult;
                    me.genTable_HeSoNgach(dtReRult, data.Pager);
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
    delete_HeSoNgach: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_Ngach/Xoa',
            
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
                    me.getList_HeSoNgach();
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
    genTable_HeSoNgach: function (data, iPager) {
        $("#lblHeSoNgach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeSoNgach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeSoNgach.getList_HeSoNgach()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGACH_MA"
                },
                {
                    "mDataProp": "NGACH_TEN"
                },
                {
                    "mDataProp": "HESO"
                },
                {
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_HeSoNgach: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtHeSoNgach, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropNgach", data.NGACH_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtHeSo", data.HESO);
        me.strHeSoNgach_Id = data.ID;
    },
}