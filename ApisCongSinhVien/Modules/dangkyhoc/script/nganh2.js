/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function Nganh2() { };
Nganh2.prototype = {
    strSinhVien_Id: '',
    dtNganh2: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ChuongTrinh();
        me.getList_KeHoach();
        me.getList_ChuaDangKy();
        $("#btnSearch").click(function () {
            me.getList_ChuaDangKy();
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_KeHoach();
            me.getList_ChuaDangKy();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_ChuaDangKy();
        });
        $("#chkSelectAll_ChuaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#chkSelectAll_DaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });

        $("#btnDangKy").click(function () {
            var strVal = $("input[type='radio'][name='inputChuaDangKy']:checked").val();
            console.log(strVal)
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaDangKy", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            edu.system.confirm("Bạn có chắc chắn đăng ký không?");
            $("#btnYes").click(function (e) {
                me.save_Nganh2(strVal);
            });
        });
        $("#btnDelele_DangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Nganh2(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_Nganh2_MH/DSA4BRICKTQuLyYVMygvKQ8mNC4oCS4i',
            'func': 'pkg_dangkyhoc_nganh2.LayDSChuongTrinhNguoiHoc',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genCombo_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_CHUONGTRINH_TEN",
                selectFirst: true
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_Nganh2_MH/DSA4BRIKJAkuICIpFSkkLg8mNC4oCS4i',
            'func': 'pkg_dangkyhoc_nganh2.LayDSKeHoachTheoNguoiHoc',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
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
                name: "TENKEHOACH",
                selectFirst: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ChuaDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/DSA4BRIPJiAvKQwuBSAvJgo4',
            'func': 'pkg_dangkyhoc_nganh2.LayDSNganhMoDangKy',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQLSV_DangKy_Nganh_Tiep_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtNganh2"] = dtReRult;
                    me.genTable_ChuaDangKy(dtReRult.rsNganhMo);
                    me.genTable_DaDangKy(dtReRult.rsKetQua);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChuaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChuaDangKy",
            aaData: data,

            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "TINHTRANGDUDIEUKIEN"
                },
                {
                    "mDataProp": "KETQUADUYET"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="radio" value="' + aData.ID + '" name="inputChuaDangKy"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },
    
    genTable_DaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDaDangKy",
            aaData: data,

            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "TINHTRANGDUDIEUKIEN"
                },
                {
                    "mDataProp": "KETQUADUYET"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },

    save_Nganh2: function (strId) {
        var me = this;
        var aData = me.dtNganh2.rsNganhMo.find(e => e.ID == strId);

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/FSkkLB4FIC8mCjgeDyYgLykeFSgkMR4KJDUQNCAP',
            'func': 'pkg_dangkyhoc_nganh2.Them_DangKy_Nganh_Tiep_KetQua',
            'iM': edu.system.iM,
            'strQLSV_DangKy_Nganh_Tiep_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strQLSV_NguoiHoc_DK_Id': me.strSinhVien_Id,
            'strDaoTao_KhoaDaoTao_DK_Id': aData.DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_ChuongTrinh_DK_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_LopQuanLy_DK_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
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
    delete_Nganh2: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2_MH/GS4gHgUgLyYKOB4PJiAvKR4VKCQxHgokNRA0IAPP',
            'func': 'pkg_dangkyhoc_nganh2.Xoa_DangKy_Nganh_Tiep_KetQua',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Xóa thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
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
}
