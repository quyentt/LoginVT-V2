/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ChucVuDoanDang() { };
ChucVuDoanDang.prototype = {
    strChucVuDoanDang_Id: '',
    dtChucVuDoanDang: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //var strTemp = str.toUpperCase();
        //var strA = "Toi di choi nhe";
        //var strB = "Toi di choi nhe, Toi di choi khong, toi di nhau khong";

        //var arrA = strA.split(/[\s,]+/);
        //var arrB = strB.split(/[\s,]+/);

        //for (var i = 0; i < arrB.length - arrA.length; i++) {
        //    for (var j = 0; j < arrA.length; j++) {
        //        if (arrA[j].toUpperCase() == arrB[i].toUpperCase()) {
        //            i++;
        //            continue;
        //        }
        //        else {
        //            bcheck = false;
        //            break;
        //        }
        //    }
        //    alert(i - arrA.length);
        //}


        me.getList_ChucVuDoanDang();
        
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMCV", "", "", function (data) {
            data = edu.util.objGetDataInData("DOANDANG", data, "THONGTIN1");
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "MA"
                },
                renderPlace: ["dropSeacrch_ChucVuDoanDang","dropChucVuDoanDang"],
                type: "",
                title: "Chọn chức vụ"
            };
            edu.system.loadToCombo_data(obj);
        });
        $("#tblChucVuDoanDang").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_ChucVuDoanDang(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_ChucVuDoanDang").click(function () {
            me.save_ChucVuDoanDang();
        });
        $("#btnDelete_ChucVuDoanDang").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ChucVuDoanDang(me.strChucVuDoanDang_Id);
            });
        });
        $("#btnXoaChucVuDoanDang").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChucVuDoanDang", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChucVuDoanDang(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_ChucVuDoanDang();
            }, arrChecked_Id.length * 50);
        });

        $("#btnSearch").click(function () {
            me.getList_ChucVuDoanDang();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChucVuDoanDang();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChucVuDoanDang" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strChucVuDoanDang_Id = "";
        edu.util.viewValById("dropChucVuDoanDang", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtHeSo", "");
        edu.util.viewValById("txtHeSo2", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChucVuDoanDang: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_ChucVuDangDoan/ThemMoi',

            'strId': me.strChucVuDoanDang_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strChucVu_Id': edu.util.getValById('dropChucVuDoanDang'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dHeSo1': edu.util.getValById('txtHeSo'),
            'dHeSo2': edu.util.getValById('txtHeSo2'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_ChucVuDangDoan/CapNhat';
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
                    me.getList_ChucVuDoanDang();
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
    getList_ChucVuDoanDang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HeSo_ChucVuDangDoan/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNgayApDung': edu.util.getValById('txtSearch_NgayApDung'),
            'strChucVu_Id': edu.util.getValById('dropSeacrch_ChucVuDoanDang'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChucVuDoanDang = dtReRult;
                    me.genTable_ChucVuDoanDang(dtReRult, data.Pager);
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
    delete_ChucVuDoanDang: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_ChucVuDangDoan/Xoa',
            
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
                    me.getList_ChucVuDoanDang();
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
    genTable_ChucVuDoanDang: function (data, iPager) {
        $("#lblChucVuDoanDang_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChucVuDoanDang",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChucVuDoanDang.getList_ChucVuDoanDang()",
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
    viewForm_ChucVuDoanDang: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtChucVuDoanDang, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropChucVuDoanDang", data.CHUCVU_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtHeSo", data.HESO1);
        edu.util.viewValById("txtHeSo2", data.HESO2);
        me.strChucVuDoanDang_Id = data.ID;
    },
}