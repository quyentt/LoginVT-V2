/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function QuanHeHocPhan() { }
QuanHeHocPhan.prototype = {
    strId: '',
    treenode: '',
    dtTab: '',
    dtQuanHeHocPhan: '',//danh sách Quan hệ học phần

    init: function () {
        var me = this;

        me.page_load();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnAdd").click(function () {
            me.resetPopup();
            me.toggle_form();
            me.getList_ChuongTrinh();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            me.save_QuanHeHocPhan();
        });
        $(".btnReWrite").click(function () {
            me.save_QuanHeHocPhan();
            me.resetPopup();
        });
        $("#btnRefresh").click(function () {
            me.getList_QuanHeHocPhan();
        });
        $("#tblQuanHeHocPhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strId = strId;
            me.toggle_form();
            me.getDetail_QuanHeHocPhan(strId);
            return false;
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanHeHocPhan", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_QuanHeHocPhan(arrChecked_Id.toString());
            });
        });
        $("#tblQuanHeHocPhan").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblQuanHeHocPhan", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanHeHocPhan" });
        });
        $("#btnSearch").click(function () {
            me.getList_QuanHeHocPhan();
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuanHeHocPhan();
            }
        });
        me.arrValid_QuanHeHocPhan = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropDaoTao_HocPhan", "THONGTIN1": "EM" },
            { "MA": "dropLoaiQuanHe", "THONGTIN1": "EM" },
            { "MA": "dropDaoTao_HocPhan_QuanHe", "THONGTIN1": "EM" },
        ];
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LQH", "dropLoaiQuanHe");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.BACDAOTAO", "dropBacDaoTao");
        $("#dropDaoTao_ToChucCT").on("select2:select", function () {
            me.getList_HocPhan();
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_QuanHeHocPhan();
        me.getList_ChuongTrinh();
        me.getList_HocPhan();
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LQH", "dropLoaiQuanHe");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_QuanHeHocPhan");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_QuanHeHocPhan");
    },
    resetPopup: function () {
        var me = main_doc.QuanHeHocPhan;
        me.strId = "";
        edu.util.resetValById("dropDaoTao_ToChucCT");
        edu.util.resetValById("dropDaoTao_HocPhan");
        edu.util.resetValById("dropLoaiQuanHe");
        edu.util.resetValById("dropDaoTao_HocPhan_QuanHe");
        edu.util.resetValById("txtXauDieuKien");
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: middleware
    ----------------------------------------------*/
    save_QuanHeHocPhan: function () {
        var me = main_doc.QuanHeHocPhan;
        var obj_notify = {};

        //--Edit
        var obj_save = {
            'action': 'KHCT_QuanHeHocPhan/ThemMoi',


            'strId': '',
            'strLoaiQuanHe_Id': edu.util.getValById("dropLoaiQuanHe"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropDaoTao_HocPhan"),
            'strDaoTao_HocPhan_QuanHe_Id': edu.util.getValById("dropDaoTao_HocPhan_QuanHe"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropDaoTao_ToChucCT"),
            'strXauDieuKien': edu.util.getValById("txtXauDieuKien"),
            'iThuTu': 1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strId != "") {
            obj_save.action = 'KHCT_QuanHeHocPhan/CapNhat';
            obj_save.strId = me.strId;
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QuanHeHocPhan();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    getList_QuanHeHocPhan: function () {
        var me = main_doc.QuanHeHocPhan;

        //--Edit
        var obj_list = {
            'action': 'KHCT_QuanHeHocPhan/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strLoaiQuanHe_Id': "",
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_HocPhan_QuanHe_Id': "",
            'strDaoTao_ToChucCT_Id': "",
            'strNguoiThucHien_Id': "",
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
                    me.genTable_QuanHeHocPhan(dtResult, iPager);
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
    getDetail_QuanHeHocPhan: function (strId) {
        var me = main_doc.QuanHeHocPhan;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_QuanHeHocPhan/LayChiTiet',

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
                        me.viewForm_QuanHeHocPhan(data.Data[0]);
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
    delete_QuanHeHocPhan: function (Ids) {
        var me = main_doc.QuanHeHocPhan;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_QuanHeHocPhan/Xoa',

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
                    me.getList_QuanHeHocPhan();
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
    genTable_QuanHeHocPhan: function (data, iPager) {
        var me = main_doc.QuanHeHocPhan;
        var jsonForm = {
            strTable_Id: "tblQuanHeHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanHeHocPhan.getList_QuanHeHocPhan()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "LOAIQUANHE_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_QUANHE_TEN"
                },
                {
                    "mDataProp": "GIATRIDIEUKIEN"
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

    },
    viewForm_QuanHeHocPhan: function (data) {
        var me = main_doc.QuanHeHocPhan;
        //call popup --Edit
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropDaoTao_ToChucCT", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("dropDaoTao_HocPhan", data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropLoaiQuanHe", data.LOAIQUANHE_ID);
        edu.util.viewValById("dropDaoTao_HocPhan_QuanHe", data.DAOTAO_HOCPHAN_QUANHE_ID);
        edu.util.viewValById("txtXauDieuKien", data.GIATRIDIEUKIEN);
    },

    getList_ChuongTrinh: function () {
        var me = main_doc.QuanHeHocPhan;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': "",
                'strDaoTao_HeDaoTao_Id': "",
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh: function (data) {
        var me = main_doc.QuanHeHocPhan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropDaoTao_ToChucCT"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan: function () {
        var me = main_doc.QuanHeHocPhan;
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhan(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HocPhan_ChuongTrinh/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HocPhan_ChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_ThoiGian_KH_Id': "",
                'strDaoTao_ThoiGian_TT_Id': "",
                'strThuocTinhHocPhan_Id': "",
                'strPhanCongPhamViDamNhiem_Id': "",
                'strDaoTao_HocPhan_Id': "",
                'strDaoTao_ChuongTrinh_Id': edu.util.getValById("dropDaoTao_ToChucCT"),
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var me = main_doc.QuanHeHocPhan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropDaoTao_HocPhan", "dropDaoTao_HocPhan_QuanHe"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
};