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
    strHocPhan_Id: '',
    bcheck: true,

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
            me.getList_TTChungChi();
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
            me.getList_ThongTin();
            edu.system.viewFiles("txtFileDinhKem", "ChungChi" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + $("#dropSearch_CapDo").val(), "SV_Files");
        });
        $("#dropSearch_CoSoDaoTao").on("select2:select", function () {
            edu.system.viewFiles("txtFileDinhKemBangDiem", "BangDiem" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + edu.util.getValById('dropSearch_CoSoDaoTao'), "SV_Files")
        });

        $("#btnSearch").click(function () {
            me.getList_CongNhanDiem();
        });
        $("#btnSearch_ChungChi").click(function () {
            me.getList_DauDiem();
            me.getList_TTChungChi();
            me.getList_ChuaDangKy();
            me.getList_DaDangKy();
            me.getList_ThongTin();
            edu.system.viewFiles("txtFileDinhKem", "ChungChi" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + $("#dropSearch_CapDo").val(), "SV_Files");
        });
        $("#tblCongNhanDiem").delegate('.btnChungChi', 'click', function (e) {
            var strId = this.id;
            $("#tblDauDiem tr").each(function () {
                var strId = this.id;
                $("#lblDauDiem" + strId).val("");
                $("#lblGhiChu" + strId).val(""); 
            })
            me.strCongNhanDiem_Id = strId;
            me.strHocPhan_Id = $(this).attr("name");
            $("#modalChungChi").modal("show");
            var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);
            (aData.TINHTRANGCONGNHAN) ? $(".btnOpenDelete").show() : $(".btnOpenDelete").hide();
            edu.system.viewFiles("txtFileDinhKem", "ChungChi" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + strId, "SV_Files")
            me.getList_CapDo();

            //edu.util.toggle_overide("zone-bus", "zonedangky");
        });

        edu.system.uploadFiles(["txtFileDinhKem", "txtFileDinhKemBangDiem"]);
        $("#btnSave_ChungChi").click(function () {
            me["bThanhCong"] = 1;
            if ($("#txtFileDinhKem").val()) {
                me.save_ChungChi();
                edu.system.saveFiles("txtFileDinhKem", "ChungChi" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + $("#dropSearch_CapDo").val(), "SV_Files");
            } else {
                edu.system.alert("Bạn cần chọn file minh chứng!");
            }
            var bcheckBatBuoc = false;
            //if (edu.util.getValById("uploadPicture_SV") != $("#uploadPicture_SV").attr("name"))
            //    me.save_Anh();
            var dtBatBuoc = me.dtTuNhapHoSo.filter(e => e.BATBUOC == 1);
            var arrBatBuoc = [];
            var arrThem = [];
            dtBatBuoc.forEach(e => {
                if ($("#m" + e.ID).val() == "") {
                    bcheckBatBuoc = true;
                    arrBatBuoc.push(e);
                    //edu.system.alert("Hãy nhập: <span style='color: red'>" + e.TEN + "</span>");
                }
            });
            if (bcheckBatBuoc) {
                $("#tblThongBaoRangBuoc").remove();
                edu.system.alert('<table id="tblThongBaoRangBuoc"><tbody></tbody></table>');
                arrBatBuoc.forEach(e => {
                    $("#tblThongBaoRangBuoc tbody").append("<tr><td>Trường thông tin bắt buộc: </td><td style='text-align: left'><span style='color: red'>" + e.TEN + "</span></td></tr>");
                })

                return;
            }
            me.dtTuNhapHoSo.forEach(e => {
                let tpoint = $("#m" + e.ID); 
                if (edu.util.returnEmpty(tpoint.val()) != tpoint.attr("name")) {
                    arrThem.push(e);
                }
            })
            if (arrThem.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX1"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX1", arrThem.length);
                for (var i = 0; i < arrThem.length; i++) {
                    me.save_TuNhapHoSo(arrThem[i]);
                }
            } else {
                edu.system.alert("Cập nhật thành công");
            }

        });

        $("#btnSave_XacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn đăng ký không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_HocPhan(arrChecked_Id[i]);
                }
            });
        });
        $("#btnDelete_XacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HocPhan(arrChecked_Id[i]);
                }
            });
        });


        $("#tblCongNhanDiem").delegate('.btnBangDiem', 'click', function (e) {
            var strId = this.id;
            
            me.strCongNhanDiem_Id = strId;
            me.strHocPhan_Id = $(this).attr("name");
            $("#modalBangDiem").modal("show");
            var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);
            (aData.TINHTRANGCONGNHAN) ? $(".btnOpenDelete").show() : $(".btnOpenDelete").hide();
            me.getList_BangDiem();
            me.getList_TTCongNhan();
            //me.getList_CapDo();

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
            if ($("#txtFileDinhKemBangDiem").val()) {
                me.save_BangDiem();
            } else {
                edu.system.alert("Bạn cần chọn file minh chứng!");
            }
        });
        $("#btnDelete_XacNhanBangDiem").click(function () {
            me.delete_BangDiem();
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

        $("#btnKetQua").click(function () {
            me.getList_KetQuaCongNhan();
            $(".lblTenKeHoach").html($("#dropSearch_KeHoach option:selected").text());

        });

        edu.system.getList_MauImport("zonebtnBaoCao_CongNhanDiem", function (addKeyValue) {
            addKeyValue("strDiem_TT_CC_CapDo_Id", edu.util.getValById("dropSearch_CapDo"));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValById("dropSearch_ChuongTrinh"));
            addKeyValue("strDiem_KeHoachCongNhan_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strDaoTao_HocPhan_Id", main_doc.CongNhanDiem.strHocPhan_Id);
            addKeyValue("strQLSV_NguoiHoc_Id", main_doc.CongNhanDiem.strSinhVien_Id);
        });
        setTimeout(function () {
            $("#zonebtnBaoCao_CongNhanDiem button").html('<i class="fas fa-file-chart-line me-2"></i> In đơn');

        }, 1000);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChungChi: function (strId) {
        var me = this;
        var obj_notify = {};
        //var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);
        
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAgIP',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_Diem_CC',
            'iM': edu.system.iM,
            'strLoai': "CC",
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
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
                    console.log(me.dtTuNhapHoSo.length);
                    if (me.dtTuNhapHoSo.length == 0) {
                        edu.system.alert("Thêm mới chứng chỉ thành công!");
                    }
                    setTimeout(function () {
                        if (me.dtDauDiem && me.dtDauDiem.length) me.dtDauDiem.forEach(e => me.save_ChungChiDauDiem(e.ID, e.DIEM_THANHPHANDIEM_ID)); 

                        me.getList_DauDiem();
                        me.getList_TTChungChi();
                        me.getList_ChuaDangKy();
                        me.getList_DaDangKy();
                        edu.system.viewFiles("txtFileDinhKem", "ChungChi" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + $("#dropSearch_CapDo").val(), "SV_Files");
                    },1000)
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
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8JHgUoJCweAgIeBTQNKCQ0',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NH_Diem_CC_DuLieu',
            'iM': edu.system.iM,
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNoiCap_Id': edu.util.getValById('dropSearch_NoiCap'),
            'strDiem_ThanhPhanDiem_Id': strDiem_ThanhPhanDiem_Id,
            'dDiem': edu.util.getValById('lblDauDiem' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.saveFiles("txtFileDinhKem", "ChungChi" + me.strSinhVien_Id + aData.ID, "SV_Files")
                    //edu.system.alert("Thêm mới thành công!");
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
            'strLoai': "CC",
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


    getList_TTChungChi: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4FRUFKCQsHg8mNC4oCS4iHgUoJCweAgIP',
            'func': 'pkg_congthongtin_congnhandiem.LayTTDiem_NguoiHoc_Diem_CC',
            'iM': edu.system.iM,
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data; var aData = {};
                    if (data.length) {
                        aData = data[0];
                    } 
                    edu.util.viewValById("dropSearch_NoiCap", aData.DIEM_COSODAOTAOCONGNHANDIEM_ID);
                    edu.util.viewValById("txtNgayCap", aData.NGAYCAP);
                    edu.util.viewValById("txtNgayHetHan", aData.NGAYHETHAN);
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
                //, {
                //    "mRender": function (nRow, aData) {
                //        return '<a href="#tuchungchi" class="btnChungChi" id="' + aData.ID + '" name="' + aData.DAOTAO_HOCPHAN_ID + '" >Từ chứng chỉ</a>';
                //    }
                //}
                , {
                    "mRender": function (nRow, aData) {
                        return '<a href="#" class="btnBangDiem" id="' + aData.ID + '" name="' + aData.DAOTAO_HOCPHAN_ID + '" >Từ bảng điểm</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_TTCongNhan: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4FRUCLi8mDykgLxU0AyAvJgUoJCwP',
            'func': 'pkg_congthongtin_congnhandiem.LayTTCongNhanTuBangDiem',
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
                    var data = data.Data;
                    var strDiemQuyDoi = "";
                    if (data.length) strDiemQuyDoi = data[0].DIEM_COSODAOTAOCONGNHANDIEM_ID;
                    edu.util.viewValById("dropSearch_CoSoDaoTao", strDiemQuyDoi);
                    edu.system.viewFiles("txtFileDinhKemBangDiem", "BangDiem" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + edu.util.getValById('dropSearch_CoSoDaoTao'), "SV_Files")
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
    },
    getList_DauDiem: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIFIDQFKCQsHgICHgIgMQUuHhA0OAUuKAPP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSDauDiem_CC_CapDo_QuyDoi',
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
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "THANGDIEM_TEN"
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
        data.forEach(e => me.getList_KetQua(e.ID, e.DIEM_THANHPHANDIEM_ID));
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
            'strLoai': "DIEM",
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
                    edu.system.saveFiles("txtFileDinhKemBangDiem", "BangDiem" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + edu.util.getValById('dropSearch_CoSoDaoTao'), "SV_Files")
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_CongNhanDiem();
                    setTimeout(function () {
                        me.getList_BangDiem();
                    },2000)
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
            'strLoai': "DIEM",
            'strDiem_TT_CC_CapDo_Id': aData.ID,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNoiCap_Id': edu.util.getValById('dropSearch_CoSoDaoTao'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNguoiThucHien_Id': edu.system.userId,

        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    me.getList_CongNhanDiem();
                    $("#modalBangDiem").modal("hide");
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
            'action': 'SV_CongNhanDiem_MH/GS4gHgUoJCweDyY0LigJLiIeBSgkLB4CDx4JEQPP',
            'func': 'pkg_congthongtin_congnhandiem.Xoa_Diem_NguoiHoc_Diem_CN_HP',
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
                    var json = data.Data;
                    me["dtBangDiem"] = json;
                    me.genHTML_BangDiem_Data(json);
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
        var strDiemQuyDoi = "";
        if (data.length) strDiemQuyDoi = data[0].DIEMCONGNHAN;
        $("#lblDiemQuyDoi").html(strDiemQuyDoi);
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
    getList_KetQua: function (strCC_CapDo_QuyDoi_DK_Id, strDiem_ThanhPhanDiem_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BiggFTMoDyY0LigJLiIeBSgkLB4CAgPP',
            'func': 'pkg_congthongtin_congnhandiem.LayGiaTriNguoiHoc_Diem_CC',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDiem_ThongTin_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strDiem_ThanhPhanDiem_Id': strDiem_ThanhPhanDiem_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    json.forEach(aData => {
                        $("#lblDauDiem" + strCC_CapDo_QuyDoi_DK_Id).val(edu.util.returnEmpty(aData.DIEM))
                        $("#lblGhiChu" + strCC_CapDo_QuyDoi_DK_Id).val(edu.util.returnEmpty(aData.GHICHU))
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
            'iM': edu.system.iM,
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
            'strDaoTao_HocPhan_Id': "",
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
        //$("#dropSearch_NoiCap").select2({//Search on modal
        //    dropdownParent: $('#modalChungChi .modal-content')
        //});
        $("#dropSearch_CoSoDaoTao").select2({//Search on modal
            dropdownParent: $('#modalBangDiem .modal-content')
        });
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        //    //me.getList_KetQuaHocTap();
        //    //me.getList_TichLuyTheoKhoi();
        //}
    },


    save_HocPhan: function (strId) {
        var me = this;
        var obj_notify = {};
        //var aData = me.dtCongNhanDiem.find(e => e.ID == me.strCongNhanDiem_Id);

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgUoJCweAg8P',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_Diem_CN',
            'iM': edu.system.iM,
            'strLoai': "CC",
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': strId,
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
    delete_HocPhan: function (Ids, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/GS4gHgUoJCweDyY0LigJLiIeBSgkLB4CDwPP',
            'func': 'pkg_congthongtin_congnhandiem.Xoa_Diem_NguoiHoc_Diem_CN',
            'iM': edu.system.iM,
            'strLoai': "CC",
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': Ids,
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
    getList_ChuaDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIJLiIRKSAvBTQuIhA0OAUuKBUpJC4CAgPP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSHocPhanDuocQuyDoiTheoCC',
            'iM': edu.system.iM,
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                center: [0, 4, 5, 3],
                right: [4]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.DAOTAO_HOCPHAN_ID + '"/>';
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
            'action': 'SV_CongNhanDiem_MH/DSA4BRIJLiIRKSAvBSAZICIPKSAvFSkkLgIC',
            'func': 'pkg_congthongtin_congnhandiem.LayDSHocPhanDaXacNhanTheoCC',
            'iM': edu.system.iM,
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropSearch_CapDo'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
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
    genTable_DaDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDaDangKy",
            aaData: data,

            colPos: {
                center: [0, 4, 5, 3],
                right: [4]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.DAOTAO_HOCPHAN_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },
    
    getList_KetQuaCongNhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIKJDUQNCACLi8mDykgLxU0AyAvJgUoJCwP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSKetQuaCongNhanTuBangDiem',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KetQuaCongNhan(dtReRult.rsBangDiem, "tblKetQuaBangDiem");
                    me.genTable_KetQuaCongNhan(dtReRult.rsCC, "tblKetQuaChungChi");
                    var arrHocPhan = [];
                    dtReRult.rsBangDiem.forEach(e => {
                        if (e.DAOTAO_HOCPHAN_ID && arrHocPhan.indexOf(e.DAOTAO_HOCPHAN_ID) == -1) arrHocPhan.push(e.DAOTAO_HOCPHAN_ID);
                    })
                    var row = '';
                    arrHocPhan.forEach(e => row += '<div id="txtViewFileBangDiem' + e + '"></div>');
                    $("#txtViewFileBangDiem").html(row);
                    arrHocPhan.forEach(e => edu.system.viewFiles("txtViewFileBangDiem" + e, "BangDiem" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id + edu.util.getValById('dropSearch_KeHoach') + e, "SV_Files"));


                    var arrHocPhan = [];
                    dtReRult.rsCC.forEach(e => {
                        if (e.DIEM_THONGTIN_CC_CAPDO_ID && arrHocPhan.indexOf(e.DIEM_THONGTIN_CC_CAPDO_ID) == -1) arrHocPhan.push(e.DIEM_THONGTIN_CC_CAPDO_ID);
                    })
                    var row = '';
                    arrHocPhan.forEach(e => row += '<div id="txtViewFileChungChi' + e + '"></div>');
                    $("#txtViewFileChungChi").html(row);
                    arrHocPhan.forEach(e => edu.system.viewFiles("txtViewFileChungChi" + e, "ChungChi" + $("#dropSearch_KeHoach").val() + me.strSinhVien_Id  + e, "SV_Files"));
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

    genTable_KetQuaCongNhan: function (data, strTable_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,

            colPos: {
                center: [0, 9, 3, 4],
                right: [6]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mDataProp": "THONGTINCONGNHAN"
                },
                {
                    //"mDataProp": "PHICONGNHAN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.PHICONGNHAN);
                    }
                },
                {
                    "mDataProp": "KHOAXACNHAN"
                },
                {
                    "mDataProp": "DAOTAOXACNHAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.DAOTAO_HOCPHAN_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var iTong = 0.0;
        data.forEach(e => {
            if (e.PHICONGNHAN) iTong += e.PHICONGNHAN;
        });
        $("#" + strTable_Id + " #lblTongPhi").html(iTong)
        //data.forEach(e => me.getList_Thang(e.LOAIVE_ID));
        /*III. Callback*/
    },


    getList_ThongTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/DSA4BRIVFQICDC4TLi8m',
            'func': 'PKG_CONGTHONGTIN_CND_THONGTIN.LayDSTTCCMoRong',
            'iM': edu.system.iM,
            'strDiem_KeHoachCongNhan_Id': edu.system.getValById('dropSearch_KeHoach'),
            'strDiem_ThongTin_ChungChi_Id': edu.system.getValById('dropSearch_ChungChi'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThongTin"] = dtReRult;
                    me["dtTuNhapHoSo"] = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
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
    genTable_ThongTin: function (data, iPager) {
        var me = this;
        var html = '';
        data.forEach((aData, nRow) => {
            html += '<tr>';
            html += '<td class="td-fixed td-center">' + (nRow + 1) + '</td>';
            //html += '<td class="">' + edu.util.returnEmpty(aData.THUOCNHOM) + '</td>';
            html += '<td class="">' + edu.util.returnEmpty(aData.TEN);
            html += aData.BATBUOC == 1 ? '<span style="color: red"> *</span>' : '';
            html += '</td>';
            html += '<td class="">' + geninput(aData) + '</td>';
            html += '</tr>';
        })
        $("#tblNhapHoSo tbody").html(html);
        //if (data.length) edu.system.actionRowSpan("tblNhapHoSo", [1]);

        var arrFile = [];
        data.forEach(aData => {
            if (aData.KIEUDULIEU) {
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "LIST": {
                        if (aData.MABANGDANHMUC) {
                            edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "m" + aData.ID);
                            $("#m" + aData.ID).select2();
                        }
                    }; break;
                    case "FILE": edu.system.uploadFiles(["m" + aData.ID]); break;
                    case "TINH": {
                        var objHuyen = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "HUYEN"));
                        var objXa = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "XA"));

                        var strTinh_Id = "m" + aData.ID;
                        var strHuyen_Id = objHuyen ? "m" + objHuyen.ID : "";
                        var strXa_Id = objXa ? "m" + objXa.ID : "";
                        $("#" + strTinh_Id).select2();
                        if (strHuyen_Id) $("#" + strHuyen_Id).select2();
                        if (strXa_Id) $("#" + strXa_Id).select2();

                        var strTinh = me.getGiaTri(aData);
                        var strHuyen = objHuyen ? me.getGiaTri(objHuyen) : "";
                        var strXa = strXa_Id ? me.getGiaTri(objXa) : "";

                        edu.extend.genDropTinhThanh(strTinh_Id, strHuyen_Id, strXa_Id, strTinh, strHuyen, strXa);
                    }; break;
                }
            }
            arrFile.push("txtFileDinhKem" + aData.ID);
        });

        //edu.system.uploadFiles(arrFile);
        setTimeout(function () {
            data.forEach(aData => {
                if (aData.KIEUDULIEU) {

                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "LIST": {
                            $("#m" + aData.ID).val(me.getGiaTri(aData)).trigger("change");
                        }; break;
                        case "FILE": edu.system.viewFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files"); break;
                    }
                }
                //edu.system.viewFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
            });
        }, 1000);
        edu.system.pickerdate();
        edu.system.pickerNumber();

        function geninput(aData) {
            if (aData.KIEUDULIEU) {
                var strLoai = 'input';
                var strDuocSua = (aData.DUOCSUA === 0 ? 'readonly="readonly"' : '');
                var strDoDai = (aData.DORONG) ? 'height: ' + aData.DORONG + 'px' : '';
                if (aData.DORONG) strLoai = "textarea";
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "TEXT": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' name="' + me.getGiaTri(aData) + '"/>';
                    case "NUMBER": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control input-number" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' name="' + me.getGiaTri(aData) + '"/>';
                    case "DATE": return '<input id="m' + aData.ID + '"  class="form-control input-datepicker" value="' + me.getGiaTri(aData) + '" ' + strDuocSua + ' name="' + me.getGiaTri(aData) + '" />';
                    case "TINH":
                    case "HUYEN":
                    case "XA":
                    case "LIST":
                        return '<select id="m' + aData.ID + '" class="form-select select-opt" name="' + me.getGiaTri(aData) + '"></select>';
                    case "FILE": return '<div id="m' + aData.ID + '" name="' + me.getGiaTri(aData) + '"></div>';
                    //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
                }
            }
        }
    },
    getGiaTri: function (aData) {
        var me = this;
        return edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI);
        //return edu.util.returnEmpty(aData.THONGTINXACMINH);
    },

    save_TuNhapHoSo: function (aData) {
        var me = this;
        var obj_notify = {};
        var strTruongThongTin_GiaTri = aData.TRUONGTHONGTIN_GIATRI;
        var strThongTinXacMinh = aData.THONGTINXACMINH;
        if (me.bcheck) strTruongThongTin_GiaTri = $("#m" + aData.ID).val();
        else strThongTinXacMinh = $("#m" + aData.ID).val();
        if (aData.KIEUDULIEU.toUpperCase() == "FILE") {
            edu.system.saveFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files");
        }

        //--Edit
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/FSkkLB4QDRIXHgokCS4gIikeBTQNKCQ0',
            'func': 'pkg_hosohocvien_quyen.Them_QLSV_KeHoach_DuLieu',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTruongThongTin_Id': aData.ID,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'strThongTinXacMinh': strThongTinXacMinh,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj_save = {
            'action': 'SV_CND_ThongTin_MH/FSkkLB4FKCQsHgICHhUVHgwuEy4vJh4FNA0oJDQP',
            'func': 'PKG_CONGTHONGTIN_CND_THONGTIN.Them_Diem_CC_TT_MoRong_DuLieu',
            'iM': edu.system.iM,
            'strDiem_KeHoachCongNhan_Id': edu.system.getValById('dropSearch_KeHoach'),
            'strDiem_ThongTin_ChungChi_Id': edu.system.getValById('dropSearch_ChungChi'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strTruongThongTin_Id': aData.ID,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Cập nhật thành công");

                    //edu.system.saveFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
                }
                else {
                    me["bThanhCong"] = 0;
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX1", function () {
                    console.log(me["bThanhCong"]);
                    if (me["bThanhCong"]) edu.system.alert("Cập nhật thành công");
                    me.getList_ThongTin();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}