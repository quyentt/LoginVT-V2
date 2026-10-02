/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TieuChiXepLoai() { };
TieuChiXepLoai.prototype = {
    strTieuChiXepLoai_Id: '',
    dtTieuChiXepLoai: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_TieuChiXepLoai();
        me.getList_TieuChiRenLuyen();

        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropSeacrch_DoiTuong,dropDoiTuongApDung");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.HINHTHUCKYLUAT", "dropKyLuatCaoNhat");
        edu.system.loadToCombo_DanhMucDuLieu("DRL.XEPLOAI", "dropXepLoai");
        $("#tblTieuChiXepLoai").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_TieuChiXepLoai(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_TieuChi").click(function () {
            me.save_TieuChiXepLoai();
        });
        $("#btnDelete_TieuChi").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_TieuChiXepLoai(me.strTieuChiXepLoai_Id);
            });
        });
        $("#btnXoaXepLoai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTieuChiXepLoai", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TieuChiXepLoai(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_TieuChiXepLoai();
            }, arrChecked_Id.length * 50);
        });

        $("#btnSearch").click(function () {
            me.getList_TieuChiXepLoai();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TieuChiXepLoai();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTieuChiXepLoai" });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strTieuChiXepLoai_Id = "";
        edu.util.viewValById("dropKyLuatCaoNhat", "");
        edu.util.viewValById("txtMucCaoNhat", "");
        edu.util.viewValById("txtMucThapNhat", "");
        edu.util.viewValById("dropXepLoai", "");
        edu.util.viewValById("txtMucDiem", "");
        edu.util.viewValById("dropDoiTuongApDung", "");
        edu.util.viewValById("txtDiemQuyDoi", "");
        edu.util.viewValById("dropTieuChiRenLuyen", "");
        edu.util.viewValById("txtGhiChu", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TieuChiXepLoai: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TieuChuanXepLoai/ThemMoi',

            'strId': me.strTieuChiXepLoai_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMucKyLuatCaoNhat_Id': edu.util.getValById('dropKyLuatCaoNhat'),
            'dDiemCanTren': edu.util.getValById('txtMucCaoNhat'),
            'dDiemCanDuoi': edu.util.getValById('txtMucThapNhat'),
            'strXepLoai_Id': edu.util.getValById('dropXepLoai'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'dDiemQuyDoi': edu.util.getValById('txtDiemQuyDoi'),
            'strDRL_TieuChiDanhGia_Id': edu.util.getValById('dropTieuChiRenLuyen'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'RL_TieuChuanXepLoai/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
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
                    me.getList_TieuChiXepLoai();
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
    getList_TieuChiXepLoai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChuanXepLoai/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSeacrch_DoiTuong'),
            'strDRL_TieuChiDanhGia_Id': edu.util.getValById('dropSearch_TieuChi'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTieuChiXepLoai = dtReRult;
                    me.genTable_TieuChiXepLoai(dtReRult, data.Pager);
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
    delete_TieuChiXepLoai: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TieuChuanXepLoai/Xoa',
            
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
                    me.getList_TieuChiXepLoai();
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
    genTable_TieuChiXepLoai: function (data, iPager) {
        $("#lblTieuChiXepLoai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTieuChiXepLoai",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TieuChiXepLoai.getList_TieuChiXepLoai()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DIEMCANDUOI"
                },
                {
                    "mDataProp": "DIEMCANTREN"
                },
                {
                    "mDataProp": "MUCKYLUATCAONHAT_TEN",
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
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
    viewForm_TieuChiXepLoai: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtTieuChiXepLoai, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropKyLuatCaoNhat", data.MUCKYLUATCAONHAT_ID);
        edu.util.viewValById("txtMucCaoNhat", data.DIEMCANTREN);
        edu.util.viewValById("txtMucThapNhat", data.DIEMCANDUOI);
        edu.util.viewValById("dropXepLoai", data.XEPLOAI_ID);
        edu.util.viewValById("txtMucDiem", data.DIEMQUYDOI);
        edu.util.viewValById("dropDoiTuongApDung", data.DOITUONGAPDUNG_ID);
        edu.util.viewValById("txtDiemQuyDoi", data.DIEMQUYDOI);
        edu.util.viewValById("dropTieuChiRenLuyen", data.DRL_TIEUCHIDANHGIA_ID);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        me.strTieuChiXepLoai_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/

    getList_TieuChiRenLuyen: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChiDanhGia/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDRL_TieuChiDanhGia_Cha_id': edu.util.getValById('dropSeacrch_DoiTuong'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNhomTieuChi_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_TieuChiRenLuyen(dtReRult, data.Pager);
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
    genCombo_TieuChiRenLuyen: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_TieuChi", "dropTieuChiRenLuyen"],
            title: "Chọn danh mục tiêu chí"
        };
        edu.system.loadToCombo_data(obj);
    }
}