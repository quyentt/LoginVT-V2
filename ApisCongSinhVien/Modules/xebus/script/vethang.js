/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function VeThang() { };
VeThang.prototype = {
    strSinhVien_Id: '',
    strXeBus_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_KeHoach();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAIXE", "", "", data => me["dtLoaiXe"] = data);
        $("#btnSearch").click(function () {
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
        });
        $("#chkSelectAll_ChuaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#chkSelectAll_DaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        
        $("#btnDangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn đăng ký không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_VeThang(arrChecked_Id[i]);
                }
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
                    me.delete_VeThang(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_VeThang_MH/DSA4BRIKJAkuICIpFyQVKSAvJgPP',
            'func': 'pkg_hososinhvien_vethang.LayDSKeHoachVeThang',
            'iM': edu.system.iM,
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
            'action': 'SV_VeThang_MH/DSA4BRIKJAkuICIpHgUoIikXNB4RKSgeAik0IAUK',
            'func': 'pkg_hososinhvien_vethang.LayDSKeHoach_DichVu_Phi_ChuaDK',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_DichVu_Ve_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChuaDangKy"] = dtReRult;
                    me.genTable_ChuaDangKy(dtReRult);
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
                center: [0,1,2,3,5,6],
                right: [4]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIVE_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" style="padding-left: 10px" id="txtBienSo' + aData.LOAIVE_ID + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropLoaiXe' + aData.LOAIVE_ID + '" class="select-opt"></select >';
                    }
                }, 
                {
                    "mDataProp": "SOTIEN"
                }, {
                    "mDataProp": "DSTHANG"
                    //"mRender": function (nRow, aData) {
                    //    return '<span id="lbl' + aData.ID + '"></span>';
                    //}
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.LOAIVE_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            me.genComBo_LoaiXe("dropLoaiXe" + aData.LOAIVE_ID, "");
        })
        
        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },

    getList_DaDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang_MH/DSA4BRIQDRIXHgokCS4gIikeFyQeBSAvJgo4',
            'func': 'pkg_hososinhvien_vethang.LayDSQLSV_KeHoach_Ve_DangKy',
            'iM': edu.system.iM,
            'strQLSV_KeHoach_DichVu_Ve_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDaDangKy"] = dtReRult;
                    me.genTable_DaDangKy(dtReRult);
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
    genTable_DaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDaDangKy",
            aaData: data,

            colPos: {
                center: [0, 1, 2, 3, 5, 6],
                right: [4]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIVE_TEN"
                }, {
                    "mDataProp": "BIENSO"
                }, {
                    "mDataProp": "LOAIXE"
                },
                {
                    "mDataProp": "SOTIEN"
                }, {
                    "mDataProp": "DSTHANG"
                    //"mRender": function (nRow, aData) {
                    //    return '<span id="lbl' + aData.ID + '"></span>';
                    //}
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
    getList_Thang: function (strLoaiVe_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang_MH/DSA4BRIKJAkuICIpHgUoIikXNB4NLiAoFyQP',
            'func': 'pkg_hososinhvien_vethang.LayDSKeHoach_DichVu_LoaiVe',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_DichVu_Ve_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiVe_Id': strLoaiVe_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var htmlThang = "";
                    dtReRult.forEach(aData => {
                        htmlThang += ' ;T' + aData.THANG + "/" + aData.NAM; 
                    })
                    if (htmlThang) htmlThang.substring(2);
                    $("#lbl" + strLoaiVe_Id).html(htmlThang);
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
   
    save_VeThang: function (strLoaiVe_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang_MH/FSkkLB4QDRIXHgokCS4gIikeFyQeBSAvJgo4',
            'func': 'pkg_hososinhvien_vethang.Them_QLSV_KeHoach_Ve_DangKy',
            'iM': edu.system.iM,
            'strQLSV_KeHoach_DichVu_Ve_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiVe_Id': strLoaiVe_Id,
            'strBienSoXe': edu.util.getValById('txtBienSo' + strLoaiVe_Id),
            'strLoaiXe_Id': edu.util.getValById('dropLoaiXe' + strLoaiVe_Id),
            'strQLSV_NguoiHoc_Id': edu.system.userId,
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
                    me.getList_DaDangKy();
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
    delete_VeThang: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang_MH/GS4gHhANEhceCiQJLiAiKR4XJB4FIC8mCjgP',
            'func': 'pkg_hososinhvien_vethang.Xoa_QLSV_KeHoach_Ve_DangKy',
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
                    me.getList_DaDangKy();
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

    genComBo_LoaiXe: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiXe,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn loại xe"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
}
