/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CongNhanDiem() { };
CongNhanDiem.prototype = {
    strSinhVien_Id: '',
    strCongNhanDiem_Id: '',
    strHocPhan_Id:'',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_ChuongTrinhHoc();
        me.getList_KeHoachCongNhan();
        me.getList_NoiCap();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.CHUNGCHI.PHANLOAI", "dropSearch_LoaiChungChi");
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_CongNhanDiem();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_CongNhanDiem();
        });

        $("#dropSearch_LoaiChungChi").on("select2:select", function () {
            me.getList_ChungChi();
        });
        $("#dropSearch_ChungChi").on("select2:select", function () {
            me.getList_CapDo();
        });
        $("#dropSearch_CapDo").on("select2:select", function () {
            me.getList_DauDiem();
        });

        $("#btnSearch").click(function () {
            me.getList_CongNhanDiem();
        });
        $("#tblCongNhanDiem").delegate('.btnChungChi', 'click', function (e) {
            var strId = this.id;
            $("#tblDauDiem tr").each(function () {
                var strId = this.id;
                $("#lblDauDiem" + strId).html("");
                $("#lblGhiChu" + strId).html(""); 
            })
            me.strCongNhanDiem_Id = strId;
            me.strHocPhan_Id = $(this).attr("name");
            $("#modalChungChi").modal("show");
            var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);
            (aData.TINHTRANGCONGNHAN) ? $(".btnOpenDelete").show() : $(".btnOpenDelete").hide();
            edu.system.viewFiles("txtFileDinhKem", "ChungChi" + me.strSinhVien_Id + strId, "SV_Files")
            me.getList_CapDo();

            //edu.util.toggle_overide("zone-bus", "zonedangky");
        });

        edu.system.uploadFiles(["txtFileDinhKem","txtFileDinhKemBangDiem"]);
        $("#btnSave_XacNhan").click(function () {
            me.save_ChungChiDauDiem();
            
        });
        $("#btnDelete_XacNhan").click(function () {
            me.delete_ChungChi();
        });


        $("#tblCongNhanDiem").delegate('.btnBangDiem', 'click', function (e) {
            var strId = this.id;
            
            me.strCongNhanDiem_Id = strId;
            me.strHocPhan_Id = $(this).attr("name");
            $("#modalBangDiem").modal("show");
            var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);
            (aData.TINHTRANGCONGNHAN) ? $(".btnOpenDelete").show() : $(".btnOpenDelete").hide();
            edu.system.viewFiles("txtFileDinhKem", "BangDiem" + me.strSinhVien_Id + strId, "SV_Files")
            me.getList_CapDo();

            //edu.util.toggle_overide("zone-bus", "zonedangky");
        });
        $(".btnAdd_BangDiem").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_BangDiem(id, "");
        });
        $("#tblBangDiem").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblBangDiem tr[id='" + strRowId + "']").remove();
        });
        $("#tblBangDiem").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_BangDiemDauDiem(strId);
            });
        });
        $("#btnSave_XacNhanBangDiem").click(function () {
            me.save_BangDiem();
        });
        $("#btnDelete_XacNhanBangDiem").click(function () {
            me.delete_ChungChi();
        });
        //$("#zonekehoach").delegate('.btnKetQua', 'click', function (e) {
        //    var strId = this.id;
        //    me.strKeHoach_Id = strId;
        //    me.getList_KetQua();
        //});

        //$("#zonedangky").delegate('.btnDangKyHocPhan', 'click', function (e) {
        //    var strId = this.id;
        //    edu.system.confirm("Bạn có chắc chắn không?");
        //    $("#btnYes").click(function (e) {
        //        me.save_DangKyHocPhan(strId);
        //    });
        //});

        //$("#zoneketqua").delegate('.btnHuyDangKy', 'click', function (e) {
        //    var strId = this.id;
        //    var strHPId = $(this).attr("name");
        //    edu.system.confirm("Bạn có chắc chắn không?");
        //    $("#btnYes").click(function (e) {
        //        me.delete_HuyDangKy(strId, strHPId);
        //    });
        //});
        //$("#onedoor").delegate('.btnQuayLai', 'click', function (e) {
        //    edu.util.toggle_overide("zone-bus", "zonekehoach");
        //});
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChungChi: function (strId) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);
        
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8P',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_Diem_CN',
            'iM': edu.system.iM,
            'strLoai': edu.util.getValById('txtAAAA'),
            'strDiem_TT_CC_CapDo_Id': aData.ID,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNoiCap_Id': edu.util.getValById('dropSearch_NoiCap'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Id;
                    me.dtDauDiem.forEach(e => me.save_ChungChiDauDiem(strId, e.ID));
                    edu.system.saveFiles("txtFileDinhKem", "ChungChi" + me.strSinhVien_Id + aData.ID, "SV_Files")
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("Thất bại: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChungChiDauDiem: function (strId, strDiem_ThanhPhanDiem_Id) {
        var me = this;
        var obj_notify = {};
        //var aData = me.dtDauDiem.find(e => e.ID == me.strCongNhanDiem_Id);

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8eAgIP',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_Diem_CN_CC',
            'iM': edu.system.iM,
            'strDiem_NguoiHoc_Diem_CN_Id': strId,
            'strDiem_ThanhPhanDiem_Id': strDiem_ThanhPhanDiem_Id,
            'dDiem': edu.util.getValById('lblDauDiem' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.saveFiles("txtFileDinhKem", "ChungChi" + me.strSinhVien_Id + aData.ID, "SV_Files")
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("Thất bại: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChuaDangKy();
                    me.getList_DaDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ChungChi: function (Ids, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;
        var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/GS4gHgUoJCweDyY0LigJLiIeBSgkLB4CDwPP',
            'func': 'pkg_congthongtin_congnhandiem.Xoa_Diem_NguoiHoc_Diem_CN',
            'iM': edu.system.iM,
            'strLoai': edu.util.getValById('txtAAAA'),
            'strDiem_TT_CC_CapDo_Id': aData.ID,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNoiCap_Id': edu.util.getValById('dropSearch_NoiCap'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNguoiThucHien_Id': edu.system.userId,
            
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert("Thực hiện thất bại: " + data.Message);
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
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    
    getList_CongNhanDiem: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRICKTQuLyYVMygvKQkuIgPP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSChuongTrinhHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtCongNhanDiem"] = json;
                    me.genTable_CongNhanDiem(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_CongNhanDiem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCongNhanDiem",
            aaData: data,

            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "KETQUA"
                },
                {
                    "mDataProp": "KETQUAMOI"
                },
                {
                    "mDataProp": "TINHTRANGCONGNHAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a href="#tuchungchi" class="btnChungChi" id="' + aData.ID + '" name="' + aData.DAOTAO_HOCPHAN_ID + '" >Từ chứng chỉ</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a href="#tubangdiem" class="btnBangDiem" id="' + aData.ID + '" name="' + aData.DAOTAO_HOCPHAN_ID + '" >Từ bảng điểm</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_DauDiem: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIFKCQsHgICHgIgMQUuHhA0OAUuKB4FCgPP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSDiem_CC_CapDo_QuyDoi_DK',
            'iM': edu.system.iM,
            'strDiem_ThongTin_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtDauDiem"] = json;
                    me.genTable_DauDiem(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DauDiem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDauDiem",
            aaData: data,

            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" class="form-control in-table text-start px-3" style="width: 100%;" id="lblDauDiem' + aData.ID + '">';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" class="form-control in-table text-start px-3" style="width: 100%;" id="lblGhiChu' + aData.ID + '">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    save_BangDiem: function (strId) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8P',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_Diem_CN',
            'iM': edu.system.iM,
            'strLoai': edu.util.getValById('txtAAAA'),
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNgayCap': edu.util.getValById('txtAAAA'),
            'strNoiCap_Id': edu.util.getValById('dropSearch_CoSoDaoTao'),
            'strNgayHetHan': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Id;
                    $("#tblBangDiem tbody tr").each(function () {
                        me.save_BangDiemDauDiem(this.id, strId);
                    });
                    //me.dtDauDiem.forEach(e => me.save_BangDiemDauDiem(strId, e.ID));
                    edu.system.saveFiles("txtFileDinhKem", "BangDiem" + me.strSinhVien_Id + aData.ID, "SV_Files")
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("Thất bại: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_BangDiem: function (Ids, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;
        var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/GS4gHgUoJCweDyY0LigJLiIeBSgkLB4CDwPP',
            'func': 'pkg_congthongtin_congnhandiem.Xoa_Diem_NguoiHoc_Diem_CN',
            'iM': edu.system.iM,
            'strLoai': edu.util.getValById('txtAAAA'),
            'strDiem_TT_CC_CapDo_Id': aData.ID,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNoiCap_Id': edu.util.getValById('dropSearch_NoiCap'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNguoiThucHien_Id': edu.system.userId,

        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert("Thực hiện thất bại: " + data.Message);
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
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_ChuaDangKy();
                    //me.getList_DaDangKy();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_BangDiemDauDiem: function (strKetQua_Id, strThangDiem_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strThoiGian_Id = edu.util.getValById('txtTenHocPhan' + strKetQua_Id);
        if (!edu.util.checkValue(strThoiGian_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8eCREP',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_Diem_CN_HP',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strThangDiem_Id': strThangDiem_Id,
            'strTenHocPhan': edu.util.getValById('txtTenHocPhan' + strKetQua_Id),
            'dSoTinChi': edu.util.getValById('txtSoTinChi' + strKetQua_Id),
            'dDiem': edu.util.getValById('txtDiem' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (strId) {
        //    obj_save.action = 'SV_SuKien/Sua_SuKien_HoatDong_ThoiGian';
        //}
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_BangDiemDauDiem: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_SuKien_MH/GS4gHhI0CigkLx4JLiA1BS4vJh4VKS4oBiggLwPP',
            'func': 'pkg_hososinhvien_sukien.Xoa_SuKien_HoatDong_ThoiGian',
            'iM': edu.system.iM,
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_BangDiem();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: " (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BangDiem: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIFKCQsHg8mNC4oCS4iHgUoJCweAg8eCREP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSDiem_NguoiHoc_Diem_CN_HP',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data.rsHocPhanDuDK;
                    me["dtBangDiem"] = json;
                    me.genTable_BangDiem(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHTML_BangDiem_Data: function (data) {
        var me = this;
        $("#tblBangDiem tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtTenHocPhan' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TENHOCPHAN) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtSoTinChi' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOTINCHI) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtDiem' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DIEM) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblBangDiem tbody").append(row);
        }

    },
    genHTML_BangDiem: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblBangDiem").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtTenHocPhan' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TENHOCPHAN) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtSoTinChi' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOTINCHI) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtDiem' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DIEM) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblBangDiem tbody").append(row);
    },
    getList_KetQua: function (strCC_CapDo_QuyDoi_DK_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BiggFTMoDyY0LigJLiIeBSgkLB4CDx4CAgPP',
            'func': 'pkg_congthongtin_congnhandiem.LayGiaTriNguoiHoc_Diem_CN_CC',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strCC_CapDo_QuyDoi_DK_Id': strCC_CapDo_QuyDoi_DK_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    json.forEach(aData => {
                        $("#lblDauDiem" + strCC_CapDo_QuyDoi_DK_Id).html(edu.util.returnEmpty(aData.DIEM))
                        $("#lblGhiChu" + strCC_CapDo_QuyDoi_DK_Id).html(edu.util.returnEmpty(aData.GHICHU))
                    })
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_KetQua: function (data) {
        var me = this;

        
        
    },
    
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinhHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'pkg_dangkyhoc_chung.LayDSChuongTrinh',
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
                    me.genCombo_ChuongTrinhHoc(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_ChuongTrinhHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoachCongNhan: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIKJAkuICIpAi4vJg8pIC8P',
            'func': 'pkg_congthongtin_congnhandiem.LayDSKeHoachCongNhan',
            'strNguoiThucHien_Id': me.strSinhVien_Id,
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
                    me.genCombo_KeHoachCongNhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_KeHoachCongNhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ChungChi: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIFKCQsHhUpLi8mFSgvHgIpNC8mAiko',
            'func': 'pkg_congthongtin_congnhandiem.LayDSDiem_ThongTin_ChungChi',
            'iM': edu.system.iM,
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_LoaiChungChi'),
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
                    me.genCombo_ChungChi(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_ChungChi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUNGCHI",
            },
            renderPlace: ["dropSearch_ChungChi"],
            //selectFirst: true,
            title: "Chọn chứng chỉ"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_CapDo: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSAYBRIFKCQsHhUVHgICHgIgMQUu',
            'func': 'pkg_congthongtin_congnhandiem.LaYDSDiem_TT_CC_CapDo',
            'iM': edu.system.iM,
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_LoaiChungChi'),
            'strDiem_ThongTin_ChungChi_Id': edu.util.getValById('dropSearch_ChungChi'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
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
                    me.genCombo_CapDo(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_CapDo: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCAPDO",
            },
            renderPlace: ["dropSearch_CapDo"],
            //selectFirst: true,
            title: "Chọn cấp độ"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_NoiCap: function () {
        var me = this;
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4BRIFKCQsHgIuEi4CLi8mDykgLwUoJCwP',
            'func': 'pkg_diem_thongtin.LayDSDiem_CoSoCongNhanDiem',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
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
                    me.genCombo_NoiCap(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genCombo_NoiCap: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_NoiCap", "dropSearch_CoSoDaoTao"],
            //selectFirst: true,
            title: "Chọn nơi cấp"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_NoiCap").select2({//Search on modal
            dropdownParent: $('#modalChungChi .modal-content')
        });
        $("#dropSearch_CoSoDaoTao").select2({//Search on modal
            dropdownParent: $('#modalBangDiem .modal-content')
        });
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },
}