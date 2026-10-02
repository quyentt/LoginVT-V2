/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: DangKyHoc/DKH_KeHoachDangKyNV
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KeHoach() { };
KeHoach.prototype = {
    strKeHoach_Id: '',
    dtKeHoach: '',

    init: function () {
        var me = this;
        //me.getList_DMHocPhan();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: 
        -------------------------------------------*/
        //me.toggle_detail("zonebatdau");
        $("#btnAddnew").click(function () {
            me.cbGetList_KieuHoc();
            me.rewrite();
            me.toggle_detail("zoneEdit");
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-bus", "zonebatdau");
        });
        $("#btnSave").click(function () {
            me.save_KeHoach();
        });
        
        me.arrValid_KeHoach = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropKhenThuong", "THONGTIN1": "EM" }
        ];
        $("#tblTangThem").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_TangThem(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKHDK").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            me.cbGetList_KieuHoc();
            if (edu.util.checkValue(strId)) {
                me.getDetail_KeHoach(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete_KeHoach").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            me.toggle_detail("zonebatdau");
            $("#btnYes").click(function (e) {
                me.delete_KeHoach(me.strKeHoach_Id);
            });
        });
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.getList_KeHoach();
        me.getList_ThoiGianDaoTao();
        $(".btnSearch_KHDK").click(function () {
            me.getList_KeHoach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoach();
            }
        });
        //load
        edu.system.loadToCheckBox_DMDL("KHDT.DIEM.KIEUHOC", "divKieuDangKy", 12);
        edu.system.loadToRadio_DMDL("DANGKY.CHEDO", "divCheDoDangKy", 12);
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DIEMCHU", "", "", data => me["dtDiem"] = data);
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.NGUYENVONG.QUYMO", "", "", data => me["dtQuyMoLop"] = data);
        $("#dropThoiGian_Nam").on("select2:select", function () {
            me.getList_ThoiGianDaoTao();
        });
        $("#dropThoiGian_Ky").on("select2:select", function () {
            me.getList_DotHoc();
        });
        $("#zoneEdit").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
                $(this).prop('checked', checked_status);
            });
        });

        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        });
        $(".btnDelete_KieuHoc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKieuHoc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?", "w");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                var arrServerIds = [];
                arrChecked_Id.forEach(function (id) {
                    if (id.length == 30) {
                        $("#tblKieuHoc tr[id='" + id + "']").remove();
                    } else {
                        arrServerIds.push(id);
                    }
                });
                $("#tblKieuHoc tbody tr").each(function (idx) {
                    $(this).find("label[id^='txtStt']").text(idx + 1);
                });
                if (arrServerIds.length > 0) {
                    me.delete_ThongTin(arrServerIds.join(','));
                }
                $("#chkSelectAll_KieuHoc").prop("checked", false);
            });
        });


        $(".btnSearch_QuyMoLop").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_QuyMoLop(id, "");
        });
        $("#tblQuyMoLop").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblQuyMoLop tr[id='" + strRowId + "']").remove();
        });
        $("#tblQuyMoLop").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_QuyMoLop(strId);
            });
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        //$(".btnSearch_HocPhan").click(function () {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_HocPhan(id, "");
        //});
        //$("#tblHocPhan").delegate(".deleteRowButton", "click", function () {
        //    var strRowId = this.id;
        //    $("#tblHocPhan tr[id='" + strRowId + "']").remove();
        //});
        //$("#tblHocPhan").delegate(".deleteKetQua", "click", function () {
        //    var strId = this.id;
        //    edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
        //    $("#btnYes").click(function (e) {
        //        me.delete_HocPhan(strId);
        //    });
        //});

        $(".btnSearch_HocPhan").click(function () {
            edu.extend.genModal_HocPhan(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                    arrChecked_Id.forEach(strSinhVien_Id => {
                        me.save_HocPhan(strSinhVien_Id);
                    })
                }
            });
            edu.extend.getList_HocPhan("SEARCH");
        });
        $(".btnDelete_HocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
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
    },
    toggle_detail: function (strZone) {
        edu.util.toggle_overide("zone-bus", strZone);
    },
    rewrite: function () {
        var me = this;
        me.strKeHoach_Id = "";
        edu.util.resetValById("txtTenKeHoach");
        edu.util.resetValById("txtMaKeHoach");
        edu.util.resetValById("txtTinChiToiDa");
        edu.util.resetValById("dropThoiGian");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.resetValById("txtBD_Ngay");
        edu.util.resetValById("txtBD_Gio");
        edu.util.resetValById("txtBD_Phut");
        edu.util.resetValById("txtKT_Ngay");
        edu.util.resetValById("txtKT_Gio");
        edu.util.resetValById("txtKT_Phut");
        edu.util.resetValById("txtNoToiDa");
        edu.util.resetValById("txtSoNgayRutHP");
        edu.util.resetValById("txtSoGiayCho");
        edu.util.resetValById("txtSoTCToiDa");
        edu.util.resetValById("txtSoTCToiThieu");
        edu.util.resetValById("txtSoTCToiDaN2");
        edu.util.resetValById("txtSoTCToiThieuN2");
        edu.util.resetValById("txtTyLeVuot");
        edu.util.resetValById("dropMucDiem");
        edu.util.resetValById("divMoHinh");
        edu.util.resetValById("divDenHan");
        edu.util.resetValById("divTrangThaiSinhVien");
        edu.util.resetValById("divKieuDangKy");
        edu.util.resetValById("divCheDoDangKy");
        edu.util.resetValById("divHienThiThongTinGiangVien");
        edu.util.resetValById("divKiemTraTinhTrangTaiChinh");
        edu.util.resetValById("divQDHuyHocPhan");
        edu.util.resetValById("divQDCoVanDangKyChoSV");
        edu.util.resetValById("divKTTCTD");
        edu.util.resetValById("divKTTCTT");
        edu.util.resetValById("divCachTinhTinChiToiDa");
        edu.util.resetValById("divKiemTraTrungLich");
        edu.util.resetValById("divKiemTraTrungLop");
        edu.util.resetValById("divKiemTranTrungThoiGian");
        edu.util.resetValById("divDKTheoToHopQuyDinh");
        edu.util.resetValById("divDKMR");
        edu.util.resetValById("divDKHPTD");
        edu.util.resetValById("divDoiHocPhan");
        edu.util.resetValById("divDKMotLanTrongKy");
        edu.util.resetValById("divKRDKTQ");
        //edu.util.resetValById("divDangKyNhieuLanTrongDot");
        edu.util.resetValById("divQuyDinhNangDiem");
        edu.util.resetValById("divQuyDinhKiemTraTaiChinh");
        $("#tblKieuHoc tbody").html("");
        $("#tblHocPhan tbody").html("");
        $("#tblQuyMoLop tbody").html("");
        var id = edu.util.randomString(30, "");
        me.genHTML_ThongTin(id, "");
        $("#DSTrangThaiSV input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        $("#divKieuDangKy input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        $("#divMoHinh input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
    },
    
    save_KeHoach: function () {
        var me = this;
        if (!edu.util.checkValue(edu.util.getValById('txtTenKeHoach'))) {
            edu.system.alert("Vui lòng nhập Tên kế hoạch", "w"); return;
        }
        if (!edu.util.checkValue(edu.util.getValById('txtMaKeHoach'))) {
            edu.system.alert("Vui lòng nhập Mã kế hoạch", "w"); return;
        }
        if (!edu.util.checkValue(edu.util.getValById('dropThoiGian'))) {
            edu.system.alert("Vui lòng chọn Đợt (Thời gian đăng ký)", "w"); return;
        }
        if (!edu.util.checkValue(edu.util.getValById('txtBD_Ngay')) ||
            !edu.util.checkValue(edu.util.getValById('txtKT_Ngay'))) {
            edu.system.alert("Vui lòng nhập Ngày bắt đầu và Ngày kết thúc", "w"); return;
        }
        if (!edu.util.getValCheckBoxByDiv("divKieuDangKy")) {
            edu.system.alert("Vui lòng chọn ít nhất một Kiểu đăng ký", "w"); return;
        }
        if (!edu.util.getValCheckBoxByDiv("divCheDoDangKy")) {
            edu.system.alert("Vui lòng chọn Chế độ đăng ký", "w"); return;
        }
        var KDK_val = edu.util.getValCheckBoxByDiv("divKieuDangKy");//Kiểu check box
        var CheDoDangKy_val = edu.util.getValCheckBoxByDiv("divCheDoDangKy");//Kiểu radio
        var TrangThaiSinhVien_val = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString();//Kiểu check box
        
        //--Edit
        var obj_save = {
            'action': 'DKH_KeHoachDangKyNV/ThemMoi',
            
            'strId': edu.util.getValById('txtAAAA'),
            'strTenKeHoach': edu.util.getValById('txtTenKeHoach'),
            'strMaKeHoach': edu.util.getValById('txtMaKeHoach'),
            //'dSoTinChiToiDa': edu.util.getValById('txtTinChiToiDa'),
            'strKieuHoc_Ids': KDK_val,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'strNgayBatDau': edu.util.getValById('txtBD_Ngay'),
            'strNgayKetThuc': edu.util.getValById('txtKT_Ngay'),
            'strTrangThaiSinhVien_Ids': TrangThaiSinhVien_val,
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'dSoTinChiToiDa': edu.util.getValById('txtTinChiToiDa'),
            'strTrangThai_Id': CheDoDangKy_val,
            'dGioDangKyTrongNgayDau': edu.util.getValById('txtBD_Gio'),
            'dGioKetThucTrongNgayCuoi': edu.util.getValById('txtKT_Gio'),
            'dPhutDangKyTrongNgayDau': edu.util.getValById('txtBD_Phut'),
            'dPhutKetThucTrongNgayCuoi': edu.util.getValById('txtKT_Phut'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (me.strKeHoach_Id) {
            obj_save.action = 'DKH_KeHoachDangKyNV/CapNhat';
            obj_save.strId = me.strKeHoach_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alert("Thêm mới thành công!");

                        obj_save.strId = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_KeHoach();
                    $("#tblKieuHoc tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThongTin(strKetQua_Id, obj_save.strId);
                    });
                    $("#tblQuyMoLop tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_QuyMoLop(strKetQua_Id, obj_save.strId);
                    });
                    //$("#tblHocPhan tbody tr").each(function () {
                    //    var strKetQua_Id = this.id.replace(/rm_row/g, '');
                    //    me.save_HocPhan(strKetQua_Id, obj_save.strId);
                    //});
                }
                else {
                    edu.system.alert("Lưu kế hoạch không thành công: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("Lưu kế hoạch không thành công: " + (er && er.statusText ? er.statusText : JSON.stringify(er)), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKyNV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.dtKeHoach = dtResult;
                    me.genTable_KeHoach(dtResult, iPager);
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
    getDetail_KeHoach: function (strId) {
        var me = this;
        $("#DSTrangThaiSV input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        $("#divKieuDangKy input").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        });
        setTimeout(function () {
            me.viewForm_KeHoach(me.dtKeHoach.find(element => element.ID === strId));
        },200)
    },
    delete_KeHoach: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'DKH_KeHoachDangKyNV/Xoa',
            
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_KeHoach();
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

    /*----------------------------------------------
    --Date of created: 2
    --Discription: genCombo NamHoc
    ----------------------------------------------*/
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKHDK",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            },
            aoColumns: [{
                "mDataProp": "MAKEHOACH"
            },
            {
                "mDataProp": "TENKEHOACH"
            },
            {
                "mDataProp": "NGAYBATDAU"
            },
            {
                "mDataProp": "GIODANGKYTRONGNGAYDAU"
            },
            {
                "mDataProp": "PHUTDANGKYTRONGNGAYDAU"
            },
            {
                "mDataProp": "NGAYKETTHUC"
            },
            {
                "mDataProp": "GIOKETTHUCTRONGNGAYCUOI"
            },
            {
                "mDataProp": "PHUTKETTHUCTRONGNGAYCUOI"
            },
            {
                "mDataProp": "SOLUONGDUKIEN"
            },
            {
                "mData": "SOLUONGDADANGKY",
                "mRender": function (nRow, aData) {
                    return aData.SOLUONGDADANGKY + '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye"></i></a></span>';
                }
            },
            {
                "mDataProp": "TYLE"
            },
            {
                "mDataProp": "HIEULUC"
            },
            {
                "mDataProp": "KIEUHOC_TEN"
            },
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-edit"></i></a></span>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_KeHoach: function (data) {
        var me = this;
        //call popup --Edit
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        //view data --Edit
        edu.util.viewValById("txtTenKeHoach", data.TENKEHOACH);
        edu.util.viewValById("txtMaKeHoach", data.MAKEHOACH);
        edu.util.viewValById("txtTinChiToiDa", data.SOTINCHITOIDA);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtBD_Ngay", data.NGAYBATDAU);
        edu.util.viewValById("txtBD_Gio", data.GIODANGKYTRONGNGAYDAU);
        edu.util.viewValById("txtBD_Phut", data.PHUTDANGKYTRONGNGAYDAU);
        edu.util.viewValById("txtKT_Ngay", data.NGAYKETTHUC);
        edu.util.viewValById("txtKT_Gio", data.GIOKETTHUCTRONGNGAYCUOI);
        edu.util.viewValById("txtKT_Phut", data.PHUTKETTHUCTRONGNGAYCUOI);
        edu.util.viewValById("txtNoToiDa", data.SOHOCPHINOTOIDACHOPHEP);
        edu.util.viewValById("txtSoNgayRutHP", data.SONGAYDUOCPHEPRUTHOCPHAN);
        edu.util.viewValById("txtSoTCToiDa", data.SOTINCHITOIDA);
        edu.util.viewValById("txtSoTCToiThieu", data.SOTINCHITOITHIEU);
        edu.util.viewValById("txtSoTCToiDaN2", data.SOTINCHITOIDAN2);
        edu.util.viewValById("txtSoTCToiThieuN2", data.SOTINCHITOITHIEUN2);
        edu.util.viewValById("txtTyLeVuot", data.PHANTRAMDANGKYVUOTQUYDINH);
        edu.util.viewValById("txtSoGiayCho", data.SOGIAYCHO);
        edu.util.viewValById("dropMucDiem", data.MUCDIEMCHUHE4_NANGDIEM);
        edu.util.viewValById("divMoHinh", data.MOHINHDANGKY_ID);
        
        $("#divMoHinh #" + data.MOHINHDANGKY_ID).attr("checked", "checked");
        $("#divDenHan #" + data.HIEULUC).attr("checked", "checked");
        //$("#strTrangThaiSinhVien_Ids #" + data.TRANGTHAISINHVIEN_IDS).attr("checked", "checked");
        $("#divHienThiThongTinGiangVien #QDGV_" + data.HIENTHITHONGTINGIANGVIEN).attr("checked", "checked");
        $("#divCachTinhTinChiToiDa #" + data.QUYDINHTINCHITOIDA_ID).attr("checked", "checked");
        //$("#divKTdivCachTinhTinChiToiDaTCTD #" + data.QUYDINHTINCHITOIDA_ID).attr("checked", "checked");
        $("#divQuyDinhNangDiem #" + data.QUYDINHDANGKYNANGDIEM_ID).attr("checked", "checked");
        $("#divDKTheoToHopQuyDinh #" + data.DANGKYTHEOTOHOPQUYDINH_ID).attr("checked", "checked");
        $("#divKiemTranTrungThoiGian #" + data.KIEMTRATRUNGTHOIGIAN_ID).attr("checked", "checked");
        $("#divCheDoDangKy #" + data.TRANGTHAI_ID).attr("checked", "checked");
        $("#divKiemTraTinhTrangTaiChinh #KTTC_" + data.KIEMTRATAICHINH).attr("checked", "checked");
        if (data.KIEUHOC_IDS !== null) $("#divKieuDangKy #" + data.KIEUHOC_IDS.replace(/,/g, ",#")).attr("checked", "checked");
        if (data.KIEUHOC_IDS !== null) $("#divKieuDangKy #" + data.KIEUHOC_IDS.replace(/,/g, ",#")).prop("checked", true);
        if (data.TRANGTHAISINHVIEN_IDS !== null) {
            if (data.TRANGTHAISINHVIEN_IDS.length > 100) {
                data.TRANGTHAISINHVIEN_IDS.split(',').forEach(e => {
                    console.log(("#DSTrangThaiSV #" + e))
                    $("#DSTrangThaiSV #" + e).attr("checked", "checked");
                    $("#DSTrangThaiSV #" + e).prop("checked", "checked");
                });
            } else {
                $("#DSTrangThaiSV #" + data.TRANGTHAISINHVIEN_IDS.replace(/,/g, ",#")).attr("checked", "checked");
                $("#DSTrangThaiSV #" + data.TRANGTHAISINHVIEN_IDS.replace(/,/g, ",#")).prop("checked", true);
            }
        }
        $("#divQDHuyHocPhan #QDHuyHocPhan_" + data.CHOPHEPNGUOCHOCHUYHOCPHAN).attr("checked", "checked");
        $("#divQDCoVanDangKyChoSV #CoVanDangKy_" + data.KHONGCHOPHEPCOVANDANGKY).attr("checked", "checked");
        $("#divKTTCTD #TCTD_" + data.KIEMTRASOTINCHITOIDA).attr("checked", "checked");
        $("#divKTTCTT #TCTT_" + data.KIEMTRASOTINCHITOITHIEU).attr("checked", "checked");
        $("#divKiemTraTrungLich #KTTrungLich_" + data.KIEMTRATRUNGLICH).attr("checked", "checked");
        $("#divKiemTraTrungLop #KTTrungLop_" + data.KIEMTRATRUNGLOPKHONGXEP).attr("checked", "checked");
        $("#divDKMR #DKMR_" + data.CHOPHEPDANGKYNGOAICHUONGTRINH).attr("checked", "checked");
        $("#divDKHPTD #DKHPTD_" + data.CHOPHEPDANGKYHPTUONGDUONG).attr("checked", "checked");
        $("#divDoiHocPhan #DoiHocPhan_" + data.KHONGCHOPHEPDOILOPHOCPHAN).attr("checked", "checked");
        $("#divDKMotLanTrongKy #DKMotLanTrongKy_" + data.CHIDANGKYMOTLANTRONGKY).attr("checked", "checked");
        //$("#divDangKyNhieuLanTrongDot #DKMotLanTrongKyDangKyNhieuLanTrongDot_" + data.CHIDANGKYMOTLANTRONGKY).attr("checked", "checked");
        $("#divKRDKTQ #KRDKTQ_" + data.KIEMTRARANGBUOCHOCPHAN).attr("checked", "checked");
        $("#divQuyDinhKiemTraTaiChinh #" + data.QUYDINHKIEMTRAHOCPHI_ID).attr("checked", "checked");

        me.getList_ThongTin();
        me.getList_HocPhan();
        me.getList_QuyMoLop();
    },
    
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo HocKy
    ----------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachDangKy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo DotHoc
    ----------------------------------------------*/
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.KeHoach.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-4 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;" />';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-4 checkbox-inline user-check-print">';
            row += '<input type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo DotHoc
    ----------------------------------------------*/

    /*------------------------------------------
    --Discription: [2] AccessDB ThongTin
    --ULR:  Modules
    -------------------------------------------*/
    save_ThongTin: function (strKetQua_Id, strKeHoachNguyenVong_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strKieuHoc_Id = edu.util.getValById('dropKieuHoc' + strKetQua_Id);
        if (!edu.util.checkValue(strKieuHoc_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'DKH_GioiHan_KieuHoc/ThemMoi',
            'type': 'POST',
            'strId': strId,
            'strKeHoachNguyenVong_Id': strKeHoachNguyenVong_Id,
            'strKieuHoc_Id': strKieuHoc_Id,
            'strDiemQuyDoi_Id': edu.util.getValById('dropDiem' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'DKH_GioiHan_KieuHoc/CapNhat';
        }
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
    getList_ThongTin: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_GioiHan_KieuHoc/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': me.strKeHoach_Id,
            'strKieuHoc_Id': edu.util.getValById('dropAAAA'),
            'strDiemQuyDoi_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 20000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThongTin_Data(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_ThongTin: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'DKH_GioiHan_KieuHoc/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    strIds.split(',').forEach(function (id) {
                        $("#tblKieuHoc tr[id='" + id + "']").remove();
                    });
                    $("#tblKieuHoc tbody tr").each(function (idx) {
                        $(this).find("label[id^='txtStt']").text(idx + 1);
                    });
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + " (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_ThongTin_Data: function (data) {
        var me = this;
        $("#tblKieuHoc tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropKieuHoc' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
            row += '<td><select id="dropDiem' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
            row += '<td style="text-align: center"><input type="checkbox" id="checkX' + strKetQua_Id + '" /></td>';
            row += '</tr>';
            $("#tblKieuHoc tbody").append(row);
            me.genComBo_KieuHoc("dropKieuHoc" + strKetQua_Id, aData.KIEUHOC_ID);
            me.genComBo_Diem("dropDiem" + strKetQua_Id, aData.DIEMQUYDOI_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        }
    },
    genHTML_ThongTin: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblKieuHoc").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKieuHoc' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
        row += '<td><select id="dropDiem' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
        row += '<td style="text-align: center"><input type="checkbox" id="checkX' + strKetQua_Id + '" /></td>';
        row += '</tr>';
        $("#tblKieuHoc tbody").append(row);
        me.genComBo_KieuHoc("dropKieuHoc" + strKetQua_Id, aData.KIEUHOC_ID);
        me.genComBo_Diem("dropDiem" + strKetQua_Id, aData.DIEMQUYDOI_ID);
    },
    cbGetList_KieuHoc: function (data) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach',
            'type': 'GET',
            'strKeHoachNguyenVong_Id': me.strKeHoach_Id,
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
                    me["dtKieuHoc"] = dtResult;
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
            async: false,
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_KieuHoc: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKieuHoc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn kiểu học"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_Diem: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan: function (strKetQua_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'DKH_NguyenVong/Them_DangKy_NV_PC_HocPhan',
            'type': 'POST',
            'strDangKy_KeHoachDangKy_Id': me.strKeHoach_Id,
            'strDaoTao_HocPhan_Id': strKetQua_Id,
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (strId) {
        //    obj_save.action = 'SV_VeThang/Sua_KeHoach_DichVu_Phi';
        //}
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_HocPhan();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_NguyenVong/LayDSDangKy_NV_PC_HocPhan',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': me.strKeHoach_Id,
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_HocPhan_Data(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_HocPhan: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'DKH_NguyenVong/Xoa_DangKy_NV_PC_HocPhan',
            'type': 'POST',
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
                    me.getList_HocPhan();
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
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_HocPhan_Data: function (data) {
        var me = this;
        //$("#tblHocPhan tbody").html("");
        //for (var i = 0; i < data.length; i++) {
        //    var strKetQua_Id = data[i].ID;
        //    var aData = data[i];
        //    var row = '';
        //    row += '<tr id="' + strKetQua_Id + '">';
        //    row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
        //    row += '<td><select id="dropHocPhan' + strKetQua_Id + '" class="select-opt"></select ></td>';
        //    row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
        //    row += '</tr>';
        //    $("#tblHocPhan tbody").append(row);
        //    me.genComBo_HocPhan("dropHocPhan" + strKetQua_Id, aData.DAOTAO_HOCPHAN_ID);
        //}
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            colPos: {
                center: [0, 3, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genHTML_HocPhan: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblHocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHocPhan' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblHocPhan tbody").append(row);
        me.genComBo_HocPhan("dropHocPhan" + strKetQua_Id, aData.DAOTAO_HOCPHAN_ID);
    },
    genComBo_HocPhan: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHocPhan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (row, aData) {
                    return aData.MA + " - " + aData.TEN;
                },
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    getList_DMHocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_MonHoc_Id': '',
            'strThuocBoMon_Id': '',
            'strThuocTinhHocPhan_Id': '',
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    me["dtHocPhan"] = data.Data;
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


    /*------------------------------------------
    --Discription: [2] AccessDB ThongTin
    --ULR:  Modules
    -------------------------------------------*/
    save_QuyMoLop: function (strKetQua_Id, strKeHoachNguyenVong_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strKieuHoc_Id = edu.util.getValById('dropQuyMo' + strKetQua_Id);
        if (!edu.util.checkValue(strKieuHoc_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'DKH_NguyenVong/Them_DK_NguyenVong_QuyMoLop',
            'type': 'POST',
            'strId': strId,
            'strDangKy_KeHoach_Id': strKeHoachNguyenVong_Id,
            'strQuyMoLop_Id': edu.util.getValById('dropQuyMo' + strKetQua_Id),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'DKH_NguyenVong/Them_DK_NguyenVong_QuyMoLop';
        }
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
    getList_QuyMoLop: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_NguyenVong/LayDSQuyMoLopDangKy',
            'type': 'POST',
            'strDangKy_NguyenVong_Id': me.strKeHoach_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'iM': edu.system.iM,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_QuyMoLop_Data(dtResult);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyMoLop: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'DKH_NguyenVong/Xoa_DK_NguyenVong_QuyMoLop',

            'strDangKy_KeHoach_Id': me.strKeHoach_Id,
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.genHTML_ThongTin_Data(data.Data);
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_QuyMoLop_Data: function (data) {
        var me = this;
        $("#tblQuyMoLop tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropQuyMo' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblQuyMoLop tbody").append(row);
            me.genComBo_QuyMoLop("dropQuyMo" + strKetQua_Id, aData.ID);
        }
    },
    genHTML_QuyMoLop: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblKieuHoc").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropQuyMo' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblQuyMoLop tbody").append(row);
        me.genComBo_QuyMoLop("dropQuyMo" + strKetQua_Id, aData.ID);
    },
    genComBo_QuyMoLop: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyMoLop,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn quy mô"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
};