/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ChucVuChinhQuyen() { };
ChucVuChinhQuyen.prototype = {
    strChucVuChinhQuyen_Id: '',
    dtChucVuChinhQuyen: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ChucVuChinhQuyen();

        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "", "", function (data) {
            data = edu.util.objGetDataInData("CHINHQUYEN", data, "THONGTIN1");
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "MA"
                },
                renderPlace: ["dropSeacrch_ChucVuChinhQuyen","dropChucVuChinhQuyen"],
                type: "",
                title: "Chọn chức vụ"
            };
            edu.system.loadToCombo_data(obj);
        });
        $("#tblChucVuChinhQuyen").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_ChucVuChinhQuyen(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_ChucVuChinhQuyen").click(function () {
            me.save_ChucVuChinhQuyen();
        });
        $("#btnDelete_ChucVuChinhQuyen").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ChucVuChinhQuyen(me.strChucVuChinhQuyen_Id);
            });
        });
        $("#btnXoaChucVuChinhQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChucVuChinhQuyen", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChucVuChinhQuyen(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_ChucVuChinhQuyen();
            }, arrChecked_Id.length * 50);
        });

        $("#btnSearch").click(function () {
            me.getList_ChucVuChinhQuyen();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChucVuChinhQuyen();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChucVuChinhQuyen" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strChucVuChinhQuyen_Id = "";
        edu.util.viewValById("dropChucVuChinhQuyen", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtHeSo", "");
        edu.util.viewValById("txtHeSo2", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChucVuChinhQuyen: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_ChucVuChinhQuyen/ThemMoi',

            'strId': me.strChucVuChinhQuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strChucVu_Id': edu.util.getValById('dropChucVuChinhQuyen'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dHeSo1': edu.util.getValById('txtHeSo'),
            'dHeSo2': edu.util.getValById('txtHeSo2'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_ChucVuChinhQuyen/CapNhat';
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
                    me.getList_ChucVuChinhQuyen();
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
    getList_ChucVuChinhQuyen: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HeSo_ChucVuChinhQuyen/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strChucVu_Id': edu.util.getValById('dropSeacrch_ChucVuChinhQuyen'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChucVuChinhQuyen = dtReRult;
                    me.genTable_ChucVuChinhQuyen(dtReRult, data.Pager);
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
    delete_ChucVuChinhQuyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_ChucVuChinhQuyen/Xoa',
            
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
                    me.getList_ChucVuChinhQuyen();
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
    genTable_ChucVuChinhQuyen: function (data, iPager) {
        $("#lblChucVuChinhQuyen_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChucVuChinhQuyen",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChucVuChinhQuyen.getList_ChucVuChinhQuyen()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CHUCVU_MA"
                },
                {
                    "mDataProp": "CHUCVU_TEN"
                },
                {
                    "mDataProp": "HESO1"
                },
                {
                    "mDataProp": "HESO2"
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
    viewForm_ChucVuChinhQuyen: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtChucVuChinhQuyen, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropChucVuChinhQuyen", data.CHUCVU_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtHeSo", data.HESO1);
        edu.util.viewValById("txtHeSo2", data.HESO2);
        me.strChucVuChinhQuyen_Id = data.ID;
    },
}