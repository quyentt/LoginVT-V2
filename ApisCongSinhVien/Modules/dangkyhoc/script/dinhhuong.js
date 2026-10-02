/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DinhHuong() { };
DinhHuong.prototype = {
    strSinhVien_Id: '',
    dtDinhHuong: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ChuongTrinh();
        $("#btnSearch").click(function () {
            me.getList_ChuaDangKy();
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_ChuaDangKy();
        });
        $("#chkSelectAll_ChuaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#chkSelectAll_DaDangKy").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });

        $("#btnDangKy").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaDangKy", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            var strVal = $("input[type='radio'][name='tblChuaDangKy1']:checked").val();
            console.log(strVal);
            if (!strVal) {
                edu.system.alert("Vui lòng chọn định hướng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn đăng ký không?");
            $("#btnYes").click(function (e) {
                //for (var i = 0; i < arrChecked_Id.length; i++) {
                //    me.save_DinhHuong(arrChecked_Id[i]);
                //}
                me.save_DinhHuong(strVal);
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
                    me.delete_DinhHuong(arrChecked_Id[i]);
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
            'action': 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,//edu.util.getValById('dropAAAA'),
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

    getList_ChuaDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFKC8pCTQuLyYCIA8pIC8P',
            'func': 'pkg_kehoach_thongtin.LayDSDinhHuongCaNhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDinhHuong"] = dtReRult;
                    me.genTable_ChuaDangKy(dtReRult.rsDSChung);
                    me.genTable_DaDangKy(dtReRult.rsKetQuaCaNhan);
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
                center: [0, 4, 2, 3]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NGAYBATDAU) + " -> " + edu.util.returnEmpty(aData.NGAYKETTHUC);
                    }
                },
                {
                    "mDataProp": "CHEDODANGKYDINHHUONG_TEN"
                    //"mRender": function (nRow, aData) {
                    //    return '<span id="lbl' + aData.ID + '"></span>';
                    //}
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="radio" value="' + aData.ID + '" name="tblChuaDangKy1"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

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

                edu.system.alert( " (er): " + JSON.stringify(er), "w");
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
                center: [0, 3, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_CT_DINHHUONG_TEN"
                }, {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
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

    save_DinhHuong: function (strId) {
        var me = this;
        var aData = me.dtDinhHuong.rsDSChung.find(e => e.ID == strId);

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eAhUeBSgvKQk0Li8mHg8J',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong_NH',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_CT_DinhHuong_Id': aData.ID,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strSoQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNgayQuyetDinh': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
                }
                else {
                    edu.system.alert(data.Message);
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
    delete_DinhHuong: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/GS4gHgUgLhUgLh4CFR4FKC8pCTQuLyYeDwkP',
            'func': 'pkg_kehoach_thongtin.Xoa_DaoTao_CT_DinhHuong_NH',
            'iM': edu.system.iM,
            'strIds': strId,
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
                        content: " (er): " + data.Message,
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
