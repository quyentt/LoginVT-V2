/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function XeBus() { };
XeBus.prototype = {
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
            me.getList_VeThang();
            me.getList_Tuyen();
            me.getList_CaNhan();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_VeThang();
            me.getList_Tuyen();
            me.getList_CaNhan();
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#zoneThangDangKy").delegate('.month-item', 'click', function (e) {
            var point = this; e.preventDefault();
            if ($(point).hasClass("active")) {
                point.classList.remove("active");
            } else {
                point.classList.add("active");
            }
        });
        $("#btnSave_XeBus").click(function () {
            me.save_XeBus();
            $("#zoneThangDangKy .month-item").each(function () {
                var strThang = $(this).attr("title");
                strThang = strThang.split("/");
                var strId = $(this).attr("name");
                var bActive = $(this).hasClass("active");
                if (!strId && bActive) {
                    me.save_Thang(strThang[0], strThang[1])
                } 
                if (strId && !bActive) {
                    me.delete_Thang(strThang[0], strThang[1])
                }
            })
            $("#tblXeBus .tuyenbus").each(function () {
                var strTuyen_Id = this.id;
                var strId = $(this).attr("name");
                var bActive = $(this).is(":checked");
                if (!strId && bActive) {
                    me.save_Tuyen(strTuyen_Id)
                }
                if (strId && !bActive) {
                    me.delete_Tuyen(strTuyen_Id)
                }
            })
        });
        $("#btnDelete_XeBus").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_XeBus();
            });
        });
        edu.system.uploadAvatar(['uploadPicture_SV'], "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_XeBus_MH/DSA4BRIKJAkuICIpHgUoIikXNB4ZJAM0MgPP',
            'func': 'pkg_hososinhvien_xebus.LayDSKeHoach_DichVu_XeBus',
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
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_VeThang: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/DSA4BRIVKSAvJgUgLyYKOBUpJC4KJAkuICIp',
            'func': 'pkg_hososinhvien_xebus.LayDSThangDangKyTheoKeHoach',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVeThang"] = dtReRult;
                    me.genTab_VeThang(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTab_VeThang: function (data) {
        var me = this;
        var html = '';
        data.rs.forEach((aData, nRow) => {
            html += '<div class="month-item" id="' + aData.THANG + aData.NAM + '" title="' + aData.THANG + '/' + aData.NAM + '">';
            html += '<i class="fal fa-check"></i> <span>T' + aData.THANG + '/' + aData.NAM + '</span>';
            html += '</div>';
        });
        $("#zoneThangDangKy").html(html);
        data.rsKetQuaCaNhan.forEach(aData => {
            $("#zoneThangDangKy #" + aData.THANG + aData.NAM).addClass("active");
            $("#zoneThangDangKy #" + aData.THANG + aData.NAM).attr("name", aData.ID);
        })
    },
    
    getList_Tuyen: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/DSA4BRIQDRIXHhkkAzQyHhU0OCQvGSQeCgkP',
            'func': 'pkg_hososinhvien_xebus.LayDSQLSV_XeBus_TuyenXe_KH',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTuyen"] = dtReRult;
                    me.genTab_Tuyen(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTab_Tuyen: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblXeBus",
            aaData: data.rs,
            colPos: {
                center: [0,3],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MOTA"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="tuyenbus" id="' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.rsKetQuaCaNhan.forEach(aData => {
            var x = $("#tblXeBus #" + aData.QLSV_XEBUS_TUYENXE_ID);
            var checked_status = true; 
            $(x).attr('checked', checked_status);
            $(x).prop('checked', checked_status);
            x.attr("name", aData.ID)
        })
    },
    
    getList_CaNhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/DSA4BRIKJAkuICIpHhkkAzQyHgUgLyYKOAPP',
            'func': 'pkg_hososinhvien_xebus.LayDSKeHoach_XeBus_DangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        me.viewForm_CaNhan(dtReRult[0]);
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    viewForm_CaNhan: function (aData) {
        var me = this;
        //call popup --Edit
        //view data --Edit
        edu.util.viewValById("txtSoDienThoai", aData.DIENTHOAILIENHE);
        edu.util.viewValById("txtDiaChiNhanThe", aData.NOINOPDONVANHANTHE);
        edu.util.viewValById("uploadPicture_SV", aData.ANHCANHAN);
        var strAnh = edu.system.getRootPathImg(aData.ANHCANHAN);
        edu.util.viewValById("uploadPicture_SV", aData.ANHCANHAN);////
        $("#srcuploadPicture_SV").attr("src", strAnh);////
        me.strXeBus_Id = aData.ID;
        $("#btnSave_XeBus").html('<i class="fal fa-times-circle me-2"></i> Cập nhật');
        $("#btnDelete_XeBus").show();
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_XeBus: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/FSkkLB4KJAkuICIpHhkkAzQyHgUgLyYKOAPP',
            'func': 'pkg_hososinhvien_xebus.Them_KeHoach_XeBus_DangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strAnhCaNhan': edu.util.getValById('uploadPicture_SV'),
            'strDienThoaiLienHe': edu.util.getValById('txtSoDienThoai'),
            'strNoiNopDonVaNhanThe': edu.util.getValById('txtDiaChiNhanThe'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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
                    $("#btnDelete_XeBus").show();
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
    save_Thang: function (dThang, dNam) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/FSkkLB4ZJAM0Mh4VKSAvJgUgLyYKOAPP',
            'func': 'pkg_hososinhvien_xebus.Them_XeBus_ThangDangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dThang': dThang,
            'dNam': dNam,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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
    save_Tuyen: function (strQLSV_XeBus_TuyenXe_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/FSkkLB4ZJAM0Mh4VNDgkLwUgLyYKOAPP',
            'func': 'pkg_hososinhvien_xebus.Them_XeBus_TuyenDangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_XeBus_TuyenXe_Id': strQLSV_XeBus_TuyenXe_Id,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    delete_XeBus: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/CTQ4BSAvJgo4',
            'func': 'pkg_hososinhvien_xebus.HuyDangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strAnhCaNhan': edu.util.getValById('uploadPicture_SV'),
            'strDienThoaiLienHe': edu.util.getValById('txtSoDienThoai'),
            'strNoiNopDonVaNhanThe': edu.util.getValById('txtDiaChiNhanThe'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Xóa thành công!",
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
                    location.reload(); 
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
    delete_Thang: function (dThang, dNam) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/GS4gHhkkAzQyHhUpIC8mBSAvJgo4',
            'func': 'pkg_hososinhvien_xebus.Xoa_XeBus_ThangDangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
            'dThang': dThang,
            'dNam': dNam,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Xóa thành công!",
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
    delete_Tuyen: function (strQLSV_XeBus_TuyenXe_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus_MH/GS4gHhkkAzQyHhU0OCQvBSAvJgo4',
            'func': 'pkg_hososinhvien_xebus.Xoa_XeBus_TuyenDangKy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_XeBus_TuyenXe_Id': strQLSV_XeBus_TuyenXe_Id,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Xóa thành công!",
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
