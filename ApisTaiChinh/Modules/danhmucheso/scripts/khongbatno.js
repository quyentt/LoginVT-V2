/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function KhongBatNo() { };
KhongBatNo.prototype = {
    strKhongBatNo_Id: '',
    dtKhongBatNo: [],
    dtKeHoach: [],
    dBatNo: true,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGian();
        me.getList_KhoanThu();
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.QUYDINHKIEMTRAHOCPHI", "", "", data => me["dtKiemTra"] = data);
        $("#btnXoaKhongBatNo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhongBatNo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhongBatNo(arrChecked_Id[i]);
                }
            });
        });

        $("#btnXoaBatNo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBatNo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_BatNo(arrChecked_Id[i]);
                }
            });
        });

        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
            me.getList_KeHoach();
        });
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_KhongBatNo();
            me.getList_BatNo();
        });
        $("#btnSearch").click(function () {
            me.getList_KhongBatNo();
            me.getList_BatNo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhongBatNo();
                me.getList_BatNo();
            }
        });

        $("#btnAdd_KhongBatNo").click(function () {
            if (!edu.util.getValById("dropSearch_KeHoach")) {
                edu.system.alert("Bạn hãy chọn kế hoạch");
                return;
            }
            if (!edu.util.getValById("dropThoiGian")) {
                edu.system.alert("Bạn hãy chọn thời gian");
                return;
            }
            me.dBatNo = false;
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_PhamVi(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
                })
            });
            //edu.extend.getList_SinhVien();
        });
        $("#btnAdd_BatNo").click(function () {
            if (!edu.util.getValById("dropSearch_KeHoach")) {
                edu.system.alert("Bạn hãy chọn kế hoạch");
                return;
            }
            if (!edu.util.getValById("dropLoaiKhoan")) {
                edu.system.alert("Bạn hãy chọn khoản thu");
                return;
            }
            me.dBatNo = true;
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_PhamVi(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
                })
            });
            //edu.extend.getList_SinhVien();
        });

        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_PhamVi(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
                })
            });
            //edu.extend.getList_SinhVien();
        });

        $("#modal_sinhvien").delegate('#btnAdd_KhoaKhoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_KhoaQL_SV").val();
            var arrChecked_Id2 = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0 && arrChecked_Id2.length) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length * arrChecked_Id2.length);
                arrChecked_Id.forEach(e => {
                    arrChecked_Id2.forEach(ele => me.save_PhamVi(ele + e))
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_He_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Lop_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });

        $("#btnAdd_KeHoach").click(function () {

            me.dtKeHoach.forEach(e => me.save_KeHoach(e.ID))
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strKhongBatNo_Id = "";
        edu.util.viewValById("dropKhoanThu", edu.util.getValById("dropSearch_KhoanThu"));
        edu.util.viewValById("dropDoiTac", edu.util.getValById("dropSearch_DoiTac"));
        edu.util.viewValById("dropHinhThuc", edu.util.getValById("dropSearch_HinhThuc"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtTKNo", "");
        edu.util.viewValById("txtTKCo", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/

    getList_QuyDinhKiemTraHocPhi: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/DSA4BRIVKS4oBiggLwPP',
            'func': 'pkg_taichinh_kehoachthu_giahan.LayDSThoiGian',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_QuyDinhKiemTraHocPhi(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_KhoanThu: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
            'func': 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNhomCacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strcanboquanly_id': edu.util.getValById('txtAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KhoanThu(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KhoanThu", "dropLoaiKhoan"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/DSA4BRIVKS4oBiggLwPP',
            'func': 'pkg_taichinh_kehoachthu_giahan.LayDSThoiGian',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_ThoiGian(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    save_KeHoach: function (strDangKy_KeHoach_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/EjQgHgUgLyYKOB4KJAkuICIpBSAvJgo4',
            'func': 'pkg_taichinh_kehoachthu_giahan.Sua_DangKy_KeHoachDangKy',
            'iM': edu.system.iM,
            'strDangKy_KeHoach_Id': strDangKy_KeHoach_Id,
            'dKiemTraTaiChinh': edu.system.getValById('dropTaiChinh_' + strDangKy_KeHoach_Id),
            'dHienThiDonGiaHocPhi': edu.system.getValById('dropDonGia_' + strDangKy_KeHoach_Id),
            'dTinhPhiTuDong': edu.system.getValById('dropTinhPhi_' + strDangKy_KeHoach_Id),
            'strQuyDinhKiemTraHocPhi_Id': edu.system.getValById('dropKiemTra_' + strDangKy_KeHoach_Id),
            'dSoHocPhiNoToiDaChoPhep': edu.system.getValById('txtSoNo_' + strDangKy_KeHoach_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                    me.getList_KeHoach();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KeHoach();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/DSA4BRIKJAkuICIpBSAvJgo4CS4i',
            'func': 'pkg_taichinh_kehoachthu_giahan.LayDSKeHoachDangKyHoc',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me["dtKeHoach"] = data;
                    me.genCombo_KeHoach(data);
                    me.genTable_KeHoach(data)
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        $("#lblKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KhongBatNo.getList_KhongBatNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MAKEHOACH"
                },
                {
                    "mDataProp": "TENKEHOACH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropTaiChinh_' + aData.ID + '" class="select-opt"><option value="">Không</option><option value="1">Có</option></select>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropDonGia_' + aData.ID + '" class="select-opt"><option value="">Không</option><option value="1">Có</option></select>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropTinhPhi_' + aData.ID + '" class="select-opt"><option value="">Không</option><option value="1">Có</option></select>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropKiemTra_' + aData.ID + '" class="select-opt"></select>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoNo_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.SOHOCPHINOTOIDACHOPHEP) + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NGAYBATDAU) + " -> " + edu.util.returnEmpty(aData.NGAYKETTHUC);
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        $(".select-opt").select2();
        data.forEach(aData => {
            edu.util.viewValById("dropTaiChinh_" + aData.ID, aData.KIEMTRATAICHINH ? aData.KIEMTRATAICHINH : "");
            edu.util.viewValById("dropDonGia_" + aData.ID, aData.HIENTHIDONGIAHOCPHI ? aData.HIENTHIDONGIAHOCPHI : "");
            edu.util.viewValById("dropTinhPhi_" + aData.ID, aData.TINHPHITUDONG ? aData.TINHPHITUDONG : "");
            var obj = {
                data: me.dtKiemTra,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    default_val: aData.QUYDINHKIEMTRAHOCPHI_ID
                },
                renderPlace: ["dropKiemTra_" + aData.ID],
                title: "Chọn quy định kiểm tra học phí"
            };
            edu.system.loadToCombo_data(obj);
        })
        /*III. Callback*/
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_PhamVi: function (strPhamViApDung_Id) {
        var me = this;
        if (me.dBatNo) {
            var arrLoai = $("#dropLoaiKhoan").val();
            arrLoai.forEach(e => me.save_BatNo(e))
            //me.save_BatNo(strPhamViApDung_Id);
        } else {
            me.save_KhongBatNo(strPhamViApDung_Id);
        }
    },
    save_KhongBatNo: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/FSkkLB4FIC8mCjgeFSAoAikoLykeFSkuKAYoIC8P',
            'func': 'pkg_taichinh_kehoachthu_giahan.Them_DangKy_TaiChinh_ThoiGian',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_KhongBatNo();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhongBatNo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/DSA4BRIFIC8mCjgeFSAoAikoLykeFSkuKAYoIC8P',
            'func': 'pkg_taichinh_kehoachthu_giahan.LayDSDangKy_TaiChinh_ThoiGian',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhongBatNo = dtReRult;
                    me.genTable_KhongBatNo(dtReRult, data.Pager);
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
    delete_KhongBatNo: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/GS4gHgUgLyYKOB4VICgCKSgvKR4VKS4oBiggLwPP',
            'func': 'pkg_taichinh_kehoachthu_giahan.Xoa_DangKy_TaiChinh_ThoiGian',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content:  JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhongBatNo();
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
    genTable_KhongBatNo: function (data, iPager) {
        $("#lblKhongBatNo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhongBatNo",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KhongBatNo.getList_KhongBatNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_KEHOACHDANGKY_MA"
                },
                {
                    "mDataProp": "DANGKY_KEHOACHDANGKY_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_BatNo: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/FSkkLB4FIC8mCjgeCikuIC8eCigkLBUzIA8u',
            'func': 'pkg_taichinh_kehoachthu_giahan.Them_DangKy_Khoan_KiemTraNo',
            'iM': edu.system.iM,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_BatNo();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BatNo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/DSA4BRIFIC8mCjgeCikuIC8eCigkLBUzIA8u',
            'func': 'pkg_taichinh_kehoachthu_giahan.LayDSDangKy_Khoan_KiemTraNo',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhongBatNo = dtReRult;
                    me.genTable_BatNo(dtReRult, data.Pager);
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
    delete_BatNo: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/GS4gHgUgLyYKOB4KKS4gLx4KKCQsFTMgDy4P',
            'func': 'pkg_taichinh_kehoachthu_giahan.Xoa_DangKy_Khoan_KiemTraNo',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_BatNo();
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
    genTable_BatNo: function (data, iPager) {
        $("#lblBatNo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblBatNo",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KhongBatNo.getList_KhongBatNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_KEHOACHDANGKY_MA"
                },
                {
                    "mDataProp": "DANGKY_KEHOACHDANGKY_TEN"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

}