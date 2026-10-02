/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function canbodangkynganh2() { };
canbodangkynganh2.prototype = {
    strSinhVien_Id: '',
    dtNganh2: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
      
        
        $("#btnSearch").click(function () {
            
            if (edu.util.getValById("txtSearch_TuKhoa") == "") {
                edu.system.alert("Bạn chưa nhập mã sinh viên");
                return;
            }
            me.getList_HSSV();
             
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
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSChuongTrinhNguoiHoc',
            'type': 'GET',
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
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
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
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSKeHoachTheoNguoiHoc',
            'type': 'GET',
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
            type: 'GET',
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
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSNganhMoDangKy',
            'type': 'GET',
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
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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

    getList_DaDangKy: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_Nganh2/LayDSQLSV_KeHoach_Ve_DangKy',
            'type': 'GET',
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
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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
            'action': 'DKH_Nganh2/Them_DangKy_Nganh_Tiep_KetQua',
            'type': 'POST',
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
            'action': 'DKH_Nganh2/Xoa_DangKy_Nganh_Tiep_KetQua',
            'type': 'POST',
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
    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_Lop"),
            
            'strQLSV_TrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000

        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.strSinhVien_Id = "";
                    $("#lblHoTen").html("");
                    $("#lblLop").html("");
                    $("#lblTrangThai").html("");
                    $("#lblNganhChuyenNganh").html("");
                    $("#lblKhoa").html("");
                    $("#lblHeDaoTao").html("");
                    if (dtResult.length == 1) {
                        me.strSinhVien_Id = dtResult[0].ID;
                        $("#lblHoTen").html(dtResult[0].HODEM + " " + dtResult[0].TEN);
                        $("#lblLop").html(dtResult[0].LOP);
                        $("#lblTrangThai").html(dtResult[0].QLSV_NGUOIHOC_TRANGTHAI);
                        $("#lblNganhChuyenNganh").html(dtResult[0].NGANH);
                        $("#lblKhoa").html(dtResult[0].KHOADAOTAO);
                        $("#lblHeDaoTao").html(dtResult[0].HEDAOTAO	);
                       
                    }
                    me.getList_ChuongTrinh();
                    me.getList_KeHoach();
                    me.getList_ChuaDangKy();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
     

}
