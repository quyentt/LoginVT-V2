/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HeSoChucDanh() { };
HeSoChucDanh.prototype = {
    strHeSoChucDanh_Id: '',
    dtHeSoChucDanh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeSoChucDanh();

        edu.system.loadToCombo_DanhMucDuLieu("NS.CDNN", "dropSearch_ChucDanh,dropChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NGACH", "dropSearch_Ngach,dropNgach");
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOCD", "dropSearch_HocHam,dropHocHam");
        $("#tblHeSoChucDanh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_HeSoChucDanh(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_HeSoChucDanh").click(function () {
            me.save_HeSoChucDanh();
        });
        $("#btnDelete_HeSoChucDanh").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HeSoChucDanh(me.strHeSoChucDanh_Id);
            });
        });
        $("#btnXoaHeSoChucDanh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeSoChucDanh", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HeSoChucDanh(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_HeSoChucDanh();
            }, arrChecked_Id.length * 50);
        });

        $("#btnSearch").click(function () {
            me.getList_HeSoChucDanh();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeSoChucDanh();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHeSoChucDanh" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strHeSoChucDanh_Id = "";
        edu.util.viewValById("dropChucDanh", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtHeSo", "");
        edu.util.viewValById("txtHeSoTapSu", "");
        edu.util.viewValById("dropHocHam", "");
        edu.util.viewValById("dropNgach", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HeSoChucDanh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_ChucDanh/ThemMoi',

            'strId': me.strHeSoChucDanh_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strChucDanhNgheNghiep_Id': edu.util.getValById('dropChucDanh'),
            'strNgach_Id': edu.util.getValById('dropNgach'),
            'strHocHam_Id': edu.util.getValById('dropHocHam'),
            'dHeSoTapSu': edu.util.getValById('txtHeSoTapSu'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dHeSo': edu.util.getValById('txtHeSo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_ChucDanh/CapNhat';
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
                    me.getList_HeSoChucDanh();
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
    getList_HeSoChucDanh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HeSo_ChucDanh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strNgach_Id': edu.util.getValById('dropSearch_Ngach'),
            'strHocHam_Id': edu.util.getValById('dropSearch_HocHam'),
            'strChucDanhNgheNghiep_Id': edu.util.getValById('dropSearch_ChucDanh'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHeSoChucDanh = dtReRult;
                    me.genTable_HeSoChucDanh(dtReRult, data.Pager);
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
    delete_HeSoChucDanh: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_ChucDanh/Xoa',
            
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
                    me.getList_HeSoChucDanh();
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
    genTable_HeSoChucDanh: function (data, iPager) {
        $("#lblHeSoChucDanh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeSoChucDanh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeSoChucDanh.getList_HeSoChucDanh()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 10,11],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CHUCDANHNGHENGHIEP_MA"
                },
                {
                    "mDataProp": "CHUCDANHNGHENGHIEP_TEN"
                },
                {
                    "mDataProp": "NGACH_MA"
                },
                {
                    "mDataProp": "NGACH_TEN"
                },
                {
                    "mDataProp": "HOCHAM_MA"
                },
                {
                    "mDataProp": "HOCHAM_TEN"
                },
                {
                    "mDataProp": "HESO"
                },
                {
                    "mDataProp": "HESOTAPSU"
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
    viewForm_HeSoChucDanh: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtHeSoChucDanh, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropChucDanh", data.CHUCDANHNGHENGHIEP_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtHeSo", data.HESO);
        edu.util.viewValById("txtHeSoTapSu", data.HESOTAPSU);
        edu.util.viewValById("dropHocHam", data.HOCHAM_ID);
        edu.util.viewValById("dropNgach", data.NGACH_ID);
        me.strHeSoChucDanh_Id = data.ID;
    },
}