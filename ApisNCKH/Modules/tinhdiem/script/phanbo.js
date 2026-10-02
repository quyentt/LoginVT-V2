/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function PhanBo() { };
PhanBo.prototype = {
    strPhanBo_Id: '',
    dtPhanBo: [],
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
            me.getList_ChuaPhanBo();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        /*------------------------------------------
        --Discription: 
        --Order: 
        -------------------------------------------*/
        $(".btnSearch").click(function () {
            me.getList_PhanBo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhanBo();
            }
        });
        $("#btnSave").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaPhanBo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thêm?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessPhanBo"></div>');
                edu.system.genHTML_Progress("zoneprocessPhanBo", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhanBo(arrChecked_Id[i]);
                }
            });
        });
        $("#btnXoaPhanBo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanBo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessPhanBo"></div>');
                edu.system.genHTML_Progress("zoneprocessPhanBo", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanBo(arrChecked_Id[i]);
                }
            });
        });
        $("#chkSelectAll").on("click", function () {
            var checked_status = $(this).is(':checked');
            $("#tblPhanBo tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        $("#chkSelectChuaPhanBoAll").on("click", function () {
            var checked_status = $(this).is(':checked');
            $("#tblChuaPhanBo tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        $("#dropSearch_LoaiSanPham").on("select2:select", function () {
            me.getList_ChuaPhanBo();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_PhanBo();
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_PhanBo();
        me.getList_TinhDiem();
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.LOAISANPHAM", "dropSearch_LoaiSanPham");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_PhanBo");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_PhanBo");
    },
    rewrite: function () {
        var me = this;
        me.strPhanBo_Id = "";
        edu.util.viewValById("txtTenPhanBo", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_PhanBo: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_PhanBoTinhDiem/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtPhanBo = dtResult;
                    me.genTable_PhanBo(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanBo: function (strNCKH_SP_ThanhVien_Id) {
        var me = this;

        var obj_save = {
            'action': 'NCKH_PhanBoTinhDiem/ThemMoi',

            'strId': me.strPhanBo_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNCKH_SP_ThanhVien_Id': strNCKH_SP_ThanhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (obj_save.strId !== "") {
            obj_save.action = 'NCKH_PhanBoTinhDiem/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert('Thêm mới thành công!');
                    } else {
                        edu.system.alert('Cập nhật thành công!');
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessPhanBo", function () {
                    me.getList_PhanBo();
                    me.getList_ChuaPhanBo();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanBo: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'NCKH_PhanBoTinhDiem/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
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

            complete: function () {
                edu.system.start_Progress("zoneprocessPhanBo", function () {
                    me.getList_PhanBo();
                });
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_PhanBo: function (data, iPager) {
        var me = this;
        $("#lblPhanBo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhanBo",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhanBo.getList_PhanBo()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 5, 6, 4],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "THONGTINSANPHAM"
                },
                {
                    "mDataProp": "THONGTINTHANHVIEN"
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "GIOCHUAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_PhanBo: function (data) {
        edu.util.viewValById("txtTenPhanBo", data.TEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtNgayBatDau", data.TUNGAY);
        edu.util.viewValById("txtNgayKetThuc", data.DENNGAY);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    getList_TinhDiem: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TinhDiem_KeHoach/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MOTA",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ChuaPhanBo: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_PhanBoTinhDiem/LayDSNCKH_SP_ChuaPhanBo',

            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strLoaiSanPham_Id': edu.util.getValById('dropSearch_LoaiSanPham'),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_ChuaPhanBo(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_ChuaPhanBo: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChuaPhanBo",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhanBo.getList_ChuaPhanBo()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 4],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "THONGTINSANPHAM"
                },
                {
                    "mDataProp": "THONGTINTHANHVIEN"
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};