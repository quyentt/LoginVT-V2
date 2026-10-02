/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhoanChucVu() { };
KhoanChucVu.prototype = {
    strKhoanChucVu_Id: '',
    dtKhoanChucVu: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KhoanChucVu();
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "dropSearch_ChucVu,dropChucVu");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIKHOAN", "dropSearch_LoaiKhoan,dropLoaiKhoan");
        $("#tblKhoanChucVu").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KhoanChucVu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_KhoanChucVu").click(function () {
            me.save_KhoanChucVu();
        });
        $("#btnXoaKhoanChucVu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoanChucVu", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessKhoanChucVu"></div>');
                edu.system.genHTML_Progress("zoneprocessKhoanChucVu", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhoanChucVu(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_KhoanChucVu();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhoanChucVu();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhoanChucVu" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKhoanChucVu_Id = "";
        edu.util.viewValById("dropLoaiKhoan", edu.util.getValById("dropSearch_LoaiKhoan"));
        edu.util.viewValById("dropChucVu", edu.util.getValById("dropSearch_ChucVu"));
        edu.util.viewValById("txtNgayApDung", edu.util.getValById("txtSearch_NgayApDung"));
        edu.util.viewValById("dropDonViTinh","");
        edu.util.viewValById("txtSoTien", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_KhoanChucVu: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_Tien_Khoan_ChucVu/ThemMoi',

            'strId': me.strKhoanChucVu_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strLoaiKhoan_Id': edu.util.getValById('dropLoaiKhoan'),
            'strChucVu_Id': edu.util.getValById('dropChucVu'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dSoTien': edu.util.getValById('txtSoTien'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_Tien_Khoan_ChucVu/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_KhoanChucVu();
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
    getList_KhoanChucVu: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_Tien_Khoan_ChucVu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strChucVu_Id': edu.util.getValById('dropSearch_ChucVu'),
            'strLoaiKhoan_Id': edu.util.getValById('dropSearch_LoaiKhoan'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhoanChucVu = dtReRult;
                    me.genTable_KhoanChucVu(dtReRult, data.Pager);
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
    delete_KhoanChucVu: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_Tien_Khoan_ChucVu/Xoa',
            
            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
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

            complete: function () {
                edu.system.start_Progress("zoneprocessKhoanChucVu", function () {
                    me.getList_KhoanChucVu();
                });
            },
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
    genTable_KhoanChucVu: function (data, iPager) {
        $("#lblKhoanChucVu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoanChucVu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhoanChucVu.getList_KhoanChucVu()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6,7,8],
                right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "CHUCVU_MA"
                },
                {
                    "mDataProp": "CHUCVU_TEN"
                },
                {
                    "mDataProp": "LOAIKHOAN_MA"
                },
                {
                    "mDataProp": "LOAIKHOAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
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
    viewForm_KhoanChucVu: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtKhoanChucVu, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropLoaiKhoan", data.LOAIKHOAN_ID);
        edu.util.viewValById("dropChucVu", data.CHUCVU_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtSoTien", data.SOTIEN);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        me.strKhoanChucVu_Id = data.ID;
    },
}