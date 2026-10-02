/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function SuKien() { };
SuKien.prototype = {
    strSinhVien_Id: '',
    strXeBus_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_KeHoach();
        $("#btnSearch").click(function () {
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
            me.getList_DaThamGia();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
            me.getList_DaThamGia();
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
                    me.save_SuKien(arrChecked_Id[i]);
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
                    me.delete_SuKien(arrChecked_Id[i]);
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
            'action': 'SV_SuKien_MH/DSA4BRIKJAkuICIpEjQKKCQv',
            'func': 'pkg_hososinhvien_sukien.LayDSKeHoachSuKien',
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
            'action': 'SV_SuKien_MH/DSA4BRISNAooJC8eCS4gNQUuLyYP',
            'func': 'pkg_hososinhvien_sukien.LayDSSuKien_HoatDong',
            'iM': edu.system.iM,
            'strQLSV_SuKien_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                center: [0, 4, 2, 3, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblThoiGian' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDienGia' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTuLieu' + aData.ID + '"></span>';
                    }
                },
                {
                    //"mDataProp": "HINHANHSUKIEN"
                    "mRender": function (nRow, aData) {
                        return '<img style="max-height: 100px" src="' + edu.system.getRootPathImg(aData.HINHANHSUKIEN) + '"></img>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            me.getList_ThoiGian(e.ID);
            me.getList_DienGia(e.ID);
            edu.system.viewFiles("lblTuLieu" + e.ID, e.ID, "SV_Files");
        });
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
                center: [0, 4, 2, 3, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblThoiGian' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDienGia' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTuLieu' + aData.ID + '"></span>';
                    }
                },
                {
                    //"mDataProp": "HINHANHSUKIEN"
                    "mRender": function (nRow, aData) {
                        return '<img style="max-height: 100px" src="' + edu.system.getRootPathImg(aData.HINHANHSUKIEN) + '"></img>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            me.getList_ThoiGian(e.ID);
            me.getList_DienGia(e.ID);
            edu.system.viewFiles("lblTuLieu" + e.ID, e.ID, "SV_Files");
        });
        /*III. Callback*/
    },
   
    save_SuKien: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_SuKien_MH/FSkkLB4SNAooJC8eCiQJLiAiKR4FIC8mCjgP',
            'func': 'pkg_hososinhvien_sukien.Them_SuKien_KeHoach_DangKy',
            'iM': edu.system.iM,
            'strQLSV_SuKien_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_SuKien_HoatDong_Id': strQLSV_SuKien_HoatDong_Id,
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
    delete_SuKien: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_SuKien_MH/GS4gHhI0CigkLx4KJAkuICIpHgUgLyYKOAPP',
            'func': 'pkg_hososinhvien_sukien.Xoa_SuKien_KeHoach_DangKy',
            'iM': edu.system.iM,
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


    getList_DaThamGia: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_SuKien_MH/DSA4BRISNAooJC8eCiQJLiAiKR4VKSAsBiggHhIX',
            'func': 'pkg_hososinhvien_sukien.LayDSSuKien_KeHoach_ThamGia_SV',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDaThamGia"] = dtReRult;
                    me.genTable_DaThamGia(dtReRult);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
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
    genTable_DaThamGia: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDaThamGia",
            aaData: data,

            colPos: {
                center: [0, 4, 2, 3, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblThoiGian' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDienGia' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblTuLieu' + aData.ID + '"></span>';
                    }
                },
                {
                    //"mDataProp": "HINHANHSUKIEN"
                    "mRender": function (nRow, aData) {
                        return '<img style="max-height: 100px" src="' + edu.system.getRootPathImg(aData.HINHANHSUKIEN) + '"></img>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDiem' + aData.ID + '"></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            me.getList_ThoiGian(e.ID);
            me.getList_DienGia(e.ID);
            edu.system.viewFiles("lblTuLieu" + e.ID, e.ID, "SV_Files");
        });
        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },
    getList_ThoiGian: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_SuKien_MH/DSA4BRISNAooJC8eCS4gNQUuLyYeFSkuKAYoIC8P',
            'func': 'pkg_hososinhvien_sukien.LayDSSuKien_HoatDong_ThoiGian',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_HoatDong_Id': strQLSV_SuKien_HoatDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        var html = "";
                        dtResult.forEach(aData => {
                            html += aData.DIADIEM + '(' + aData.TUNGAY + ' ' + aData.GIOBATDAU + "h" + aData.PHUTBATDAU + " - " + aData.DENNGAY + ' ' + aData.GIOKETTHUC + "h" + aData.PHUTKETTHUC + ")<br/>";
                        })
                        $("#lblThoiGian" + strQLSV_SuKien_HoatDong_Id).html(html);
                    }
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DienGia: function (strQLSV_SuKien_HoatDong_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_SuKien_MH/DSA4BRISNAooJC8eCS4gNQUuLyYeBSgkLwYoIAPP',
            'func': 'pkg_hososinhvien_sukien.LayDSSuKien_HoatDong_DienGia',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_SuKien_HoatDong_Id': strQLSV_SuKien_HoatDong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        var html = "";
                        dtResult.forEach(aData => {
                            html += '<b>' + aData.DIENGIA + '</b> (' + aData.MOTA + ")<br/>";
                        })
                        $("#lblDienGia" + strQLSV_SuKien_HoatDong_Id).html(html);
                    }
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
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
