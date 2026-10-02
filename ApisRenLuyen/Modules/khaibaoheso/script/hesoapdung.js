/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HeSoApDung() { };
HeSoApDung.prototype = {
    strHeSoHocKy_Id: '',
    dtHeSoHocKy: [],
    strHeSoNamHoc_Id: '',
    dtHeSoNamHoc: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeSoHocKy();
        me.getList_HeSoNamHoc();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_NamNhapHoc();
        me.getList_ThoiGianDaoTao();
        
        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropSeacrch_DoiTuong,dropDoiTuongApDung,dropDoiTuongApDung_Nam");

        $("#tblHeSoHocKy").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_HeSoHocKy(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddHeSoHocKy").click(function () {
            me.popup_HocKy();
            me.resetPopup_HocKy();
        });
        $("#btnSave_HeSoHocKy").click(function () {
            me.save_HeSoHocKy();
        });
        $("#btnDelete_HeSoHocKy").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HeSoHocKy(me.strHeSoHocKy_Id);
            });
        });
        $("#btnDeleteHeSoHocKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeSoHocKy", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HeSoHocKy(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_HeSoHocKy();
            }, arrChecked_Id.length * 50);
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHeSoHocKy" });
        });

        $("#tblHeSoNamHoc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_HeSoNamHoc(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddHeSoNamHoc").click(function () {
            me.popup_NamHoc();
            me.resetPopup_NamHoc();
        });
        $("#btnSave_HeSoNamHoc").click(function () {
            me.save_HeSoNamHoc();
        });
        $("#btnDelete_HeSoNamHoc").click(function () {
            $('#myModal_NamHoc').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HeSoNamHoc(me.strHeSoNamHoc_Id);
            });
        });
        $("#btnDeleteHeSoNamHoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeSoNamHoc", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HeSoNamHoc(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_HeSoNamHoc();
            }, arrChecked_Id.length * 50);
        });
        $("#chkSelectAll_NamHoc").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHeSoNamHoc" });
        });

        $("#btnSearch").click(function () {
            me.getList_HeSoHocKy();
            me.getList_HeSoNamHoc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeSoHocKy();
                me.getList_HeSoNamHoc();
            }
        });
        $("#dropSearch_HeDaoTao,#dropHeDaoTao,#dropHeDaoTao_Nam").on("select2:select", function () {
            me.getList_KhoaDaoTao(this.value);
        });
    },
    popup_HocKy: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_HocKy: function () {
        var me = this;
        me.strHeSoApDung_Id = "";
        edu.util.viewValById("dropDoiTuongApDung", edu.util.getValById('dropSeacrch_DoiTuong'));
        edu.util.viewValById("dropHeDaoTao", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("dropKhoaDaoTao", edu.util.getValById('dropSearch_KhoaDaoTao'));
        edu.util.viewValById("dropNamHoc", edu.util.getValById('dropSearch_NamHoc'));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
        edu.util.viewValById("txtTrongSo", "");
        edu.util.viewValById("txtMoTa", "");
    },
    popup_NamHoc: function () {
        //show
        $('#myModal_NamHoc').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_NamHoc: function () {
        var me = this;
        me.strHeSoApDung_Id = "";
        edu.util.viewValById("dropDoiTuongApDung_Nam", edu.util.getValById('dropSeacrch_DoiTuong'));
        edu.util.viewValById("dropHeDaoTao_Nam", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("dropKhoaDaoTao_Nam", edu.util.getValById('dropSearch_KhoaDaoTao'));
        edu.util.viewValById("dropNamHoc_Nam", edu.util.getValById('dropSearch_NamHoc'));
        edu.util.viewValById("dropThoiGianDaoTao_Nam", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
        edu.util.viewValById("txtTrongSo_Nam", "");
        edu.util.viewValById("txtMoTa_Nam", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HeSoHocKy: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TrongSoDiem_AD/ThemMoi',

            'strId': me.strHeSoHocKy_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strPhanCapApDung_Id': edu.util.getValById('dropSAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strPhamViApDung_Id': edu.util.getValById('dropKhoaDaoTao'),
            'dTrongSo': edu.util.getValById('txtTrongSo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'RL_TrongSoDiem_AD/CapNhat';
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
                    me.getList_HeSoHocKy();
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
    getList_HeSoHocKy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TrongSoDiem_AD/LayDSDRL_TrongSoDiem_AD_Ky',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSeacrch_DoiTuong'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHeSoHocKy = dtReRult;
                    me.genTable_HeSoHocKy(dtReRult, data.Pager);
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
    delete_HeSoHocKy: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TrongSoDiem_AD/Xoa',

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
                    me.getList_HeSoHocKy();
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
    genTable_HeSoHocKy: function (data, iPager) {
        $("#lblHeSoHocKy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeSoHocKy",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeSoApDung.getList_HeSoHocKy()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_KY"
                },
                {
                    "mDataProp": "TRONGSO"
                },
                {
                    "mDataProp": "MOTA",
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
    viewForm_HeSoHocKy: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtHeSoHocKy, "ID")[0];
        me.popup_HocKy();
        //view data --Edit
        edu.util.viewValById("dropDoiTuongApDung", data.DOITUONGAPDUNG_ID);
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNamHoc", data.DAOTAO_THOIGIANDAOTAO_NAM_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_KY_ID);
        edu.util.viewValById("txtTrongSo", data.TRONGSO);
        edu.util.viewValById("txtMoTa", data.MOTA);
        me.strHeSoHocKy_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HeSoNamHoc: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TrongSoDiem_AD/ThemMoi',

            'strId': me.strHeSoNamHoc_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanCapApDung_Id': '',
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung_Nam'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropNamHoc_Nam'),
            'strMoTa': edu.util.getValById('txtMoTa_Nam'),
            'strPhamViApDung_Id': edu.util.getValById('dropKhoaDaoTao_Nam'),
            'dTrongSo': edu.util.getValById('txtTrongSo_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'RL_TrongSoDiem_AD/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModal_NamHoc #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModal_NamHoc #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_HeSoNamHoc();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModal_NamHoc #notify"
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
    getList_HeSoNamHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TrongSoDiem_AD/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropSeacrch_DoiTuong'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHeSoNamHoc = dtReRult;
                    me.genTable_HeSoNamHoc(dtReRult, data.Pager);
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
    delete_HeSoNamHoc: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TrongSoDiem_AD/Xoa',

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
                    me.getList_HeSoNamHoc();
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
    genTable_HeSoNamHoc: function (data, iPager) {
        $("#lblHeSoNamHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeSoNamHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HeSoApDung.getList_HeSoNamHoc()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_KY"
                },
                {
                    "mDataProp": "TRONGSO"
                },
                {
                    "mDataProp": "MOTA",
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
    viewForm_HeSoNamHoc: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtHeSoNamHoc, "ID")[0];
        me.popup_NamHoc();
        //view data --Edit
        edu.util.viewValById("dropDoiTuongApDung_Nam", data.DOITUONGAPDUNG_ID);
        edu.util.viewValById("dropHeDaoTao_Nam", "");
        edu.util.viewValById("dropKhoaDaoTao_Nam", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNamHoc_Nam", data.DAOTAO_THOIGIANDAOTAO_NAM_ID);
        edu.util.viewValById("dropThoiGianDaoTao_Nam", data.DAOTAO_THOIGIANDAOTAO_KY_ID);
        edu.util.viewValById("txtTrongSo_Nam", data.TRONGSO);
        edu.util.viewValById("txtMoTa_Nam", data.MOTA);
        me.strHeSoNamHoc_Id = data.ID;
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValById("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao", "dropHeDaoTao_Nam"],
            type: "",
            title: "Chọn hệ đào tạo",
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao", "dropKhoaDaoTao", "dropKhoaDaoTao_Nam"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropPhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMNHAPHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc", "dropNamHoc_Nam"],
            type: "",
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
}