/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ThiLai() { };
ThiLai.prototype = {
    strSinhVien_Id: '',
    dtThiLai: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ChuongTrinh();
        me.getList_KeHoach();
        //me.getList_ChuaDangKy();
        $("#btnSearch").click(function () {
            me.getList_ChuaDangKy();
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_KeHoach();
            //me.getList_ChuaDangKy();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_ChuaDangKy();
            var aData = me.dtKeHoach.find(e => e.ID == $("#dropSearch_KeHoach").val());
            $("#txtTuNgay").val(edu.util.returnEmpty(aData.TUNGAY))
            $("#txtDenNgay").val(edu.util.returnEmpty(aData.DENNGAY))
            $("#txtLoaiDangKy").val(edu.util.returnEmpty(aData.MOHINHDANGKY_TEN))
        });
       

        $("#btnDangKy").click(function () {
            //var strVal = $("input[type='radio'][name='inputChuaDangKy']:checked").val();
            //console.log(strVal)
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn đăng ký không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThiLai(arrChecked_Id[i]);
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
                    me.delete_ThiLai(arrChecked_Id[i]);
                }
            });
        });

        $("#tblChuaDangKy").delegate('.btnEdit', 'click', function (e) {
            $('#modalChiTietDiem').modal('show');
            var strId = this.id;
            var aData = me.dtThiLai.rsHocPhanDuDK.find(e => e.ID == strId);
            me.getList_QuanSoTheoLop(aData.QLSV_NGUOIHOC_ID, aData.DIEM_DANHSACHHOC_ID);
        });
        $("#tblDaDangKy").delegate('.btnEdit', 'click', function (e) {
            $('#modalChiTietDiem').modal('show');
            var strId = this.id;
            var aData = me.dtThiLai.rsKetQua.find(e => e.ID == strId);
            me.getList_QuanSoTheoLop(aData.QLSV_NGUOIHOC_ID, aData.DIEM_DANHSACHHOC_ID);
        });
        $("#tblChuaDangKy").delegate('input', 'click', function (e) {
            var checked_status = $(this).is(':checked');
            var strClass = $(this).attr("class")
            var arrcheck = $("#tblChuaDangKy").find('.' + strClass);
            arrcheck.each(function () {
                if ($(this).is(":hidden")) return;
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        $("#tblDaDangKy").delegate('input', 'click', function (e) {
            var checked_status = $(this).is(':checked');
            var strClass = $(this).attr("class");
            var arrcheck = $("#tblDaDangKy").find('.' + strClass);
            arrcheck.each(function () {
                if ($(this).is(":hidden")) return;
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
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
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRICKTQuLyYVMygvKQ8mNC4oCS4i',
            'func': 'pkg_dangkythi_monthi_chung.LayDSChuongTrinhNguoiHoc',
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
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIKJAkuICIpFSkkLg8mNC4oCS4i',
            'func': 'pkg_dangkythi_monthi_chung.LayDSKeHoachTheoNguoiHoc',
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
                    me["dtKeHoach"] = dtResult;
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
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/DSA4BRIJLiIRKSAvBSAvJgo4',
            'func': 'pkg_dangkythi_monthi_thongtin.LayDSHocPhanDangKy',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDangKy_Thi_HP_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThiLai"] = dtReRult;
                    me.genTable_ChuaDangKy(dtReRult.rsHocPhanDuDK);
                    me.genTable_DaDangKy(dtReRult.rsKetQua);
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
    genTable_ChuaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChuaDangKy",
            aaData: data,

            colPos: {
                center: [0 ,1, 8, 5, 4, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Điểm:</em><span class="fw-bold me-2">' + edu.util.returnEmpty(aData.DIEM) + '</span><a title="Chi tiết điểm"  class="text-decoration-underline btnEdit" id="' + aData.ID + '" href="#" >Xem chi tiết</a>';
                    }
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_ID) + ' " id="checkX' + aData.ID + '"/>';
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
                center: [0, 1, 9, 4, 5, 7, 8, 10],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Điểm:</em><span class="fw-bold me-2">' + edu.util.returnEmpty(aData.DIEM) + '</span><a title="Chi tiết điểm"  class="text-decoration-underline btnEdit" id="' + aData.ID + '" href="#" >Xem chi tiết</a>';
                    }
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mức phí phải nộp:</em><span class="fw-bold color-orange">' + edu.util.formatCurrency(aData.SOTIEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Đã nộp:</em><span class="fw-bold color-orange">' + edu.util.formatCurrency(aData.SOTIENDANOP) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_ID) + '" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },

    save_ThiLai: function (strId) {
        var me = this;
        var aData = me.dtThiLai.rsHocPhanDuDK.find(e => e.ID == strId);

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/FSk0IgkoJC8FIC8mCjgP',
            'func': 'pkg_dangkythi_monthi_thongtin.ThucHienDangKy',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': aData.DANGKY_THI_HP_KEHOACH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLHLTL_NguoiHoc_Id': aData.ID,
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
    delete_ThiLai: function (strId) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtThiLai.rsKetQua.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/FSk0IgkoJC8JNDgFIC8mCjgP',
            'func': 'pkg_dangkythi_monthi_thongtin.ThucHienHuyDangKy',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_Thi_HP_KeHoach_Id': aData.DANGKY_THI_HP_KEHOACH_ID,
            'strDangKy_Thi_HocPhan_KQ_Id': aData.ID,
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


    getList_QuanSoTheoLop: function (strQLSV_NguoiHoc_Id, strDaoTao_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAIgDykgLxUpJC4NLjEP',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemCaNhanTheoLop',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var json = dtReRult.rsTP.concat(dtReRult.rsTKHP);
                    me.genTable_QuanSoTheoLop(json);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
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
    genTable_QuanSoTheoLop: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChiTietDiem",
            
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 2, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI_SO"
                },
                {
                    "mDataProp": "DIEMQUYDOI_CHU"
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}
