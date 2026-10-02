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
function TinhDiem() { };
TinhDiem.prototype = {
    strTinhDiem_Id: '',
    dtTinhDiem: [],
    init: function () {

        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        /*------------------------------------------
        --Discription: 
        --Order: 
        -------------------------------------------*/
        $(".btnSearch").click(function () {
            me.getList_TinhDiem();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TinhDiem();
            }
        });
        $("#btnSave").click(function () {
            me.save_TinhDiem();
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strTinhDiem_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_TinhDiem();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTinhDiem").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.strTinhDiem_Id = strId;
                edu.util.setOne_BgRow(strId, "tblTinhDiem");
                me.viewForm_TinhDiem(edu.util.objGetOneDataInData(strId, me.dtTinhDiem, "ID"));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('#dropSearch_TinhTrang').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_TinhDiem();
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_TinhDiem");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_TinhDiem");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strTinhDiem_Id = "";
        edu.util.viewValById("txtTenTinhDiem", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
    },
    getList_TinhDiem: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_TinhDiem_KeHoach/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
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
                    me.dtTinhDiem = dtResult;
                    me.genTable_TinhDiem(dtResult, iPager);
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
    save_TinhDiem: function () {
        var me = this;

        var obj_save = {
            'action': 'NCKH_TinhDiem_KeHoach/ThemMoi',

            'strId': me.strTinhDiem_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTuNgay': edu.util.getValById('txtNgayBatDau'),
            'strDenNgay': edu.util.getValById('txtNgayKetThuc'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (obj_save.strId !== "") {
            obj_save.action = 'NCKH_TinhDiem_KeHoach/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Id;
                    if (strId != undefined) {
                        edu.system.alert('Thêm mới thành công!');
                    } else {
                        edu.system.alert('Cập nhật thành công!');
                        strId = me.strTinhDiem_Id;
                    }
                    $("#tbl_HeKhoa tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))) {// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_TinhDiem_HeKhoa(strHeKhoa_Id, strId);
                        }
                    });
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))) {// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_TinhDiem_ThanhVien(strNhanSu_Id, strId);
                        }
                    });
                    me.getList_TinhDiem();
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

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TinhDiem: function () {
        var me = this;

        var obj_delete = {
            'action': 'NCKH_TinhDiem_KeHoach/Xoa',

            'strIds': me.strTinhDiem_Id,
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
                me.getList_TinhDiem();
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
    genTable_TinhDiem: function (data, iPager) {
        var me = this;
        $("#lblTinhDiem_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTinhDiem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TinhDiem.getList_TinhDiem()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 2, 3, 4],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
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
    viewForm_TinhDiem: function (data) {
        //view data --Edit
        edu.util.viewValById("txtTenTinhDiem", data.TEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtNgayBatDau", data.TUNGAY);
        edu.util.viewValById("txtNgayKetThuc", data.DENNGAY);
    },
};