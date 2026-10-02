/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DoiTacTuyenSinh() { };
DoiTacTuyenSinh.prototype = {
    treenode: '',
    strDoiTacTuyenSinh_Id: '',
    dtTab: '',
    dtDoiTacTuyenSinh: [],
    arrValiD_DoiTacTuyenSinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_DoiTacTuyenSinh();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_DoiTacTuyenSinh();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strDoiTacTuyenSinh_Id)) {
                me.update_DoiTacTuyenSinh();
            }
            else {
                me.save_DoiTacTuyenSinh();
            }
        });
        $("#btnReWrite").click(function () {
            if (edu.util.checkValue(me.strDoiTacTuyenSinh_Id)) {
                me.update_DoiTacTuyenSinh();
            }
            else {
                me.save_DoiTacTuyenSinh();
            }
            me.rewrite();
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DoiTacTuyenSinh();
            }
        });

        $("#tblDoiTacTuyenSinh").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strDoiTacTuyenSinh_Id = strId;
                me.getDetail_DoiTacTuyenSinh(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblDoiTacTuyenSinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        //$(".btnDelete").click(function () {
        //    me.delete_DoiTacTuyenSinh();
        //});
        $("#tblDoiTacTuyenSinh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DoiTacTuyenSinh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_DoiTacTuyenSinh("", edu.util.getValById("txtSearch_TuKhoa"));
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDoiTacTuyenSinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_DoiTacTuyenSinh(arrChecked_Id.toString());
            });
        });
        $("#tblDoiTacTuyenSinh").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblDoiTacTuyenSinh", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDoiTacTuyenSinh" });
        });

        me.arrValiD_DoiTacTuyenSinh = [
            { "MA": "txtHoDem", "THONGTIN1": "EM" },
            { "MA": "txtTen", "THONGTIN1": "EM" },
        ];

        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropCT_DaoTao_N_CN");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.NTS", "dropNganhTuyenSinh");
    },
    page_load: function () {
        var me = this;
        me.getList_DoiTacTuyenSinh();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc

        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_DoiTacTuyenSinh");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_DoiTacTuyenSinh");
    },
    //toggle_detail: function () {
    //    edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    //},

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDoiTacTuyenSinh_Id = "";
        var arrId = ["txtHoDem", "txtTen", "txtDiaChi", "txtEmail", "txtSDT", "txtCMT", "txtGhiChu"];
        edu.util.resetValByArrId(arrId);
    },

    save_DoiTacTuyenSinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_DoiTacTuyenSinh/ThemMoi',


            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCMT_HoChieu': edu.util.getValById("txtCMT"),
            'strHoDem': edu.util.getValById("txtHoDem"),
            'strTen': edu.util.getValById("txtTen"),
            'strSoDienThoai': edu.util.getValById("txtSDT"),
            'strEmail': edu.util.getValById("txtEmail"),
            'strDiaChi': edu.util.getValById("txtDiaChi"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                    }

                    setTimeout(function () {
                        me.getList_DoiTacTuyenSinh();
                    }, 50);
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
    update_DoiTacTuyenSinh: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_DoiTacTuyenSinh/CapNhat',


            'strId': me.strDoiTacTuyenSinh_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCMT_HoChieu': edu.util.getValById("txtCMT"),
            'strHoDem': edu.util.getValById("txtHoDem"),
            'strTen': edu.util.getValById("txtTen"),
            'strSoDienThoai': edu.util.getValById("txtSDT"),
            'strEmail': edu.util.getValById("txtEmail"),
            'strDiaChi': edu.util.getValById("txtDiaChi"),
            'strGhiChu': edu.util.getValById("txtGhiChu"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strDoiTacTuyenSinh_Id = me.strDoiTacTuyenSinh_Id;
                    me.getList_DoiTacTuyenSinh();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DoiTacTuyenSinh: function () {
        var me = main_doc.DoiTacTuyenSinh;

        //--Edit
        var obj_list = {
            'action': 'TS_DoiTacTuyenSinh/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genTable_DoiTacTuyenSinh(dtResult, iPager);
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
    getDetail_DoiTacTuyenSinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TS_DoiTacTuyenSinh/LayChiTiet',

            'strId': strId
        };


        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_DoiTacTuyenSinh(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //getDetail_ChuongTrinh_Full: function (strId, strAction) {
    //    var me = this;
    //    edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID", me.viewEdit_ChuongTrinh);
    //},
    delete_DoiTacTuyenSinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_DoiTacTuyenSinh/Xoa',

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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

                me.getList_DoiTacTuyenSinh();
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
    genTable_DoiTacTuyenSinh: function (data, iPager) {
        var me = this;
        $("#lblDoiTacTuyenSinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDoiTacTuyenSinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DoiTacTuyenSinh.getList_DoiTacTuyenSinh()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            sort: true,
            colPos: {
                center: [0, 3, 8, 9],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "SODIENTHOAI"
                },
                {
                    "mDataProp": "EMAIL"
                },
                {
                    "mDataProp": "CMT_HOCHIEU"
                },
                {
                    "mDataProp": "DIACHI"
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_DoiTacTuyenSinh: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtHoDem", data.HODEM);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtDiaChi", data.DIACHI);
        edu.util.viewValById("txtEmail", data.EMAIL);
        edu.util.viewValById("txtSDT", data.SODIENTHOAI);
        edu.util.viewValById("txtCMT", data.CMT_HOCHIEU);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
    },

};