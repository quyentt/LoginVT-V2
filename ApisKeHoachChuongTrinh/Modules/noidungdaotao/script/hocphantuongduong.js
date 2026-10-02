/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KeHoachToChuc/hocphantuongduong
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HocPhanTuongDuong() { };
HocPhanTuongDuong.prototype = {
    strId: '',
    treenode: '',
    dtTab: '',
    dtHocPhanTuongDuong: '',//danh sach hoc phan tuong duong

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HocPhanTuongDuong();
        //me.getList_HocPhanTuongDuong_Input();
        //me.getList_HocPhan();
        me.getList_ChuongTrinh();
        me.getList_HeDaoTao();
        me.getList_ChuongTrinhDrop();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhTuongDuong();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_HocPhanTuongDuong();
        });
        $("#btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();

        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            me.save_HocPhanTuongDuong();
        });
        $(".btnReWrite").click(function () {
            me.save_HocPhanTuongDuong();
            me.rewrite();
        });
        $("#tblHocPhanTuongDuong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strId = strId;
            me.toggle_form();
            me.getDetail_HocPhanTuongDuong(strId);
            return false;
        });
        $("#tblHocPhanTuongDuong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HocPhanTuongDuong(strId);
            });
            return false;
        });
        $("#btnSearch").click(function () {
            me.getList_HocPhanTuongDuong();
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhanTuongDuong();
            }
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDrop();
            me.getList_HocPhanTuongDuong();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDrop();
            me.getList_HocPhanTuongDuong();
            
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_HocPhanTuongDuong();
            
        });
        $("#dropChuongTrinh").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropChuongTrinhTuongDuong").on("select2:select", function () {
            me.getList_HocPhanTuongDuong_Input();
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanTuongDuong", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HocPhanTuongDuong(arrChecked_Id.toString());
            });
        });
        $("#tblHocPhanTuongDuong").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblHocPhanTuongDuong", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhanTuongDuong" });
        });

        $("#btnChuyenDiem").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn thực hiện?");
            $("#btnYes").click(function (e) {
                me.save_ChuyenDiem();
            });
            
        });
        //
        //me.arrValid_HocPhanTuongDuong = [
        //    { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        //];
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.KTCĐ.LLC", "dropLoaiLuaChon");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.KTCĐ.ĐVLC", "dropDonViLuaChon");
    },
    page_load: function () {
        var me = this;
        me.getList_HocPhanTuongDuong();
        me.getList_ChuongTrinh();
        me.getList_HocPhan();
        me.getList_HocPhanTuongDuong_Input();
        me.toggle_notify();
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_TuKhoa");
        /*------------------------------------------
        --Discription: [1] Load KhoaDaoTao
        //-------------------------------------------*/
        //setTimeout(function () {
        //    me.getList_KhoaDaoTao();
        //}, 50);
    },

    rewrite: function () {
        var me = this;
        me.strId = "";
        edu.util.resetValById("dropHocPhan");
        edu.util.resetValById("dropChuongTrinh");
        edu.util.resetValById("dropHocPhanTuongDuong");
        edu.util.resetValById("dropChuongTrinhTuongDuong");
        edu.util.resetValById("txtNhom");
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_HocPhanTuongDuong");
    },

    save_HocPhanTuongDuong: function () {
        var me = main_doc.HocPhanTuongDuong;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_HocPhanTuongDuong',


            'strId': '',
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropChuongTrinh"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropHocPhan"),
            'strDaoTao_HocPhan_TD_Id': edu.util.getValById("dropHocPhanTuongDuong"),
            'strDaoTao_ToChucCT_TD_Id': edu.util.getValById("dropChuongTrinhTuongDuong"),
            'strNhom': edu.util.getValById('txtNhom'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strId != "") {
            me.action = 'KHCT_ThongTin/Sua_DaoTao_HocPhanTuongDuong';
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
                    me.getList_HocPhanTuongDuong();
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
    getList_HocPhanTuongDuong: function () {
        var me = main_doc.HocPhanTuongDuong;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ToChucCT_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDaoTao_HocPhan_TD_Id': "",
            'strDaoTao_ToChucCT_TD_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
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
                    me.genTable_HocPhanTuongDuong(dtResult, iPager);
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
    getDetail_HocPhanTuongDuong: function (strId) {
        var me = main_doc.HocPhanTuongDuong;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_ThongTin/LayTTDaoTao_HocPhanTuongDuong',

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
                        me.viewForm_HocPhanTuongDuong(data.Data[0]);
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
    delete_HocPhanTuongDuong: function (Ids) {
        var me = main_doc.HocPhanTuongDuong;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ThongTin/Xoa_DaoTao_HocPhanTuongDuong',

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
                    me.getList_HocPhanTuongDuong();
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
    genTable_HocPhanTuongDuong: function (data, iPager) {
        var me = main_doc.HocPhanTuongDuong;
        $("#lblHocPhanTuongDuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhanTuongDuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhanTuongDuong.getList_HocPhanTuongDuong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 7, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TD_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TD_TEN"
                },
                {
                    "mDataProp": "NHOM"
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
    viewForm_HocPhanTuongDuong: function (data) {
        var me = this;
        //call popup --Edit
        var dt = data[0];
        //view data --Edit
        me.strHocPhan_Save_Id = data.DAOTAO_HOCPHAN_ID;
        me.strHocPhan_SaveTD_Id = data.DAOTAO_HOCPHAN_TD_ID;
        edu.util.viewValById("dropHocPhan", data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropChuongTrinh", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("dropHocPhanTuongDuong", data.DAOTAO_HOCPHAN_TD_ID);
        edu.util.viewValById("dropChuongTrinhTuongDuong", data.DAOTAO_TOCHUCCHUONGTRINH_TD_ID);
        edu.util.viewValById("txtNhom", data.NHOM);
        me.getList_HocPhan();
        me.getList_HocPhanTuongDuong_Input();
    },

    getList_HocPhan: function () {
        var me = main_doc.HocPhanTuongDuong
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
                'strDaoTao_ChuongTrinh_Id': edu.util.getValById("dropChuongTrinh"),
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var me = main_doc.HocPhanTuongDuong;
        console.log(me.strHocPhan_Save_Id);
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: "MA",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN;
                },
                default_val: me.strHocPhan_Save_Id
            },
            renderPlace: ["dropHocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ChuongTrinh: function () {
        var me = main_doc.HocPhanTuongDuong;
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
        var me = main_doc.HocPhanTuongDuong;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.MACHUONGTRINH + " - " + aData.TENCHUONGTRINH;
                }
            },
            renderPlace: ["dropChuongTrinh", "dropChuongTrinhTuongDuong"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhanTuongDuong_Input: function () {
        var me = main_doc.HocPhanTuongDuong;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhanTuongDuong_Input(dtResult);
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
                'strDaoTao_ChuongTrinh_Id': edu.util.getValById("dropChuongTrinhTuongDuong"),
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhanTuongDuong_Input: function (data) {
        var me = main_doc.HocPhanTuongDuong;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: "MA",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN;
                },
                default_val: me.strHocPhan_SaveTD_Id
            },
            renderPlace: ["dropHocPhanTuongDuong"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ChuongTrinhTuongDuong: function () {
        var me = main_doc.HocPhanTuongDuong;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinhTuongDuong(dtResult);
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
    genCombo_ChuongTrinhTuongDuong: function (data) {
        var me = main_doc.HocPhanTuongDuong;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.MACHUONGTRINH + " - " + aData.TENCHUONGTRINH;
                }
            },
            renderPlace: ["dropChuongTrinhTuongDuong"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: [ "dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinhDrop: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinhDrop(dtResult);
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
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
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
    genCombo_ChuongTrinhDrop: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },


    save_ChuyenDiem: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_XuLyDiem/Tinh_HocPhan_TuongDuong_PhamVi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQuyTacTinhTuongDuong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
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
}