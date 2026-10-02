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
    strDinhHuong_Id: '',
    strChuongTrinh_Id: '',
    dtDinhHuong: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        edu.extend.genBoLoc_HeKhoa("_DH")
        me.getList_DinhHuong();
        edu.system.loadToCombo_DanhMucDuLieu("DAOTAO.CTDT.DINHHUONG.CHEDO", "dropCheDoDinhHuong");

        $("#tblDinhHuong").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zone_input_dinhhuong");
            me.strDinhHuong_Id = strId;
            var aData = me.dtDinhHuong.find(e => e.ID == me.strDinhHuong_Id);
            me.strChuongTrinh_Id = aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
            me.viewEdit_DinhHuong(me.dtDinhHuong.find(e => e.ID == strId));
        });
        $("#tblDinhHuong").delegate('.btnSinhVien', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneSinhVien");
            me.strDinhHuong_Id = strId;
            var aData = me.dtDinhHuong.find(e => e.ID == me.strDinhHuong_Id);
            me.strChuongTrinh_Id = aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
            me.getList_SinhVien();
            me.getList_SVChuaThem();
        });

        $("#tblNhom").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strNhom_Id = strId;
            $("#myModal").modal("show")
            me.viewEdit_Nhom(me.dtNhom.find(e => e.ID == strId));
        });

        $("#tblDinhHuong").delegate('.btnNhom', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneChiaNhom");
            me.strDinhHuong_Id = strId;
            var aData = me.dtDinhHuong.find(e => e.ID == me.strDinhHuong_Id);
            me.strChuongTrinh_Id = aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
            me.getList_Nhom();
        });

        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#tblNhom").delegate('.btnChuaThem', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneSVNhom");
            me["strNhom_Id"] = strId;
            var aData = me.dtNhom.find(e => e.ID == me.strNhom_Id);
            $("#lblTenNhom").html(aData.TEN + " - " + aData.MA);
            me.getList_ChuaThem();
            me.getList_DaThem();
        });
        $("#btnSearchChiaNhom").click(function () {
            me.popup();
            me.resetPopup();
            me.strNhom_Id = "";
        });
        $("#btnSave_Nhom").click(function () {
            me.save_Nhom();
        });
        $("#btnDeleteChiaNhom").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhom", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Nhom(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_DinhHuong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DinhHuong();
            }
        });


        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_SinhVien(e);
                })
            });
            edu.extend.getList_SinhVien();
        });

        $("#modal_sinhvien").delegate('#btnAdd_KhoaKhoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_KhoaQL_SV").val();
            var arrChecked_Id2 = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0 && arrChecked_Id2.length) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length * arrChecked_Id2.length);
                arrChecked_Id.forEach(e => {
                    arrChecked_Id2.forEach(ele => me.save_SinhVien(ele + e, "", true))
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_He_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_SinhVien(e, "", true);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_SinhVien(e, "", true);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_SinhVien(e, "", true);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Lop_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_SinhVien(e, "", true);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $(".btnDeleteDTSV_SinhVien").click(function () {
            console.log(11111);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            console.log(222222);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });
        $("#btnAdd_SinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVienChuaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_SinhVien(arrChecked_Id[i]);
            }
        });

        $("#btnChuaThem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_ChiaNhom(arrChecked_Id[i]);
            }
        });
        $("#btnDeleteDaThem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChiaNhom(arrChecked_Id[i]);
                }
            });
        });

        $("#btnAdd_DinhHuong").click(function () {
            me.toggle_dinhhuong();
            $("#tblGanKhoiKienThuc tbody").html("");
            $("#tblGanHocPhan tbody").html("");
            $("#tblGanSinhVien tbody").html("");
            $("#delete_DinhHuong").hide();
        });
        $("#btnSave_DinhHuong").click(function () {
            me.save_DinhHuong('');
        });
        $("#delete_DinhHuong").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {

                me.delete_DinhHuong(me.strDinhHuong_Id);
            });
        });
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        edu.util.viewValById("txtMaNhom", "");
        edu.util.viewValById("txtTenNhom", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
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
            renderPlace: ["dropSearch_KhoanThu", "dropKhoanThu"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DoiTac: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_KeToan_MH/DSA4BQw0IgARCB4FLigVICIP',
            'func': 'pkg_taichinh_ketoan.LayDMucAPI_DoiTac',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_DoiTac(data);
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
    genCombo_DoiTac: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDOITAC",
            },
            renderPlace: ["dropSearch_DoiTac", "dropDoiTac"],
            title: "Chọn đối tác"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DinhHuong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8m',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_DH'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_DH'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_DH'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDinhHuong = dtReRult;
                    me.genTable_DinhHuong(dtReRult, data.Pager);
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
    genTable_DinhHuong: function (data, iPager) {
        $("#lblDinhHuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDinhHuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhHuong.getList_DinhHuong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    //"mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA);
                    }
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "CHEDODANGKYDINHHUONG_TEN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnSinhVien" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNhom" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    save_DinhHuong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_CT_DinhHuong',
            'type': 'POST',
            'strId': me.strDinhHuong_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strTen': edu.util.getValById('txtTenDinhHuong'),
            'strMa': edu.util.getValById('txtMaDinhHuong'),
            'strCheDoDangKyDinhHuong_Id': edu.util.getValById('dropCheDoDinhHuong'),
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KHCT_ThongTin/Sua_DaoTao_CT_DinhHuong';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        obj_save.strId = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DinhHuong: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ThongTin/Xoa_DaoTao_CT_DinhHuong',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_DinhHuong();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    viewEdit_DinhHuong: function (data) {
        var me = this;
        me.strDinhHuong_Id = data.ID;
        edu.util.viewValById("txtMaDinhHuong", data.MA);
        edu.util.viewValById("txtTenDinhHuong", data.TEN);
        edu.util.viewValById("dropCheDoDinhHuong", data.CHEDODANGKYDINHHUONG_ID);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8mHg8J',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong_NH',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me["dtKetQuaXuLy"] = dtResult;
                    me.genTable_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_SinhVien: function (strNhanSu_Id, strQLSV_KeHoachXuLy_Id, bKhongPhaiSinhVien) {
        var me = this;
        var aData = me.dtSVChuaThem.find(eSV => eSV.ID == strNhanSu_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_ThongTin/Them_XLHV_DSKhongXuLy_PhamVi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLHV_KeHoachXuLy_Id': me.strKeHoachXuLy_Id,
            'strPhamViApDung_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_TrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eAhUeBSgvKQk0Li8mHg8J',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_CT_DinhHuong_NH',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strSoQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNgayQuyetDinh': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                    me.getList_SVChuaThem();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ThongTin_MH/GS4gHgUgLhUgLh4CFR4FKC8pCTQuLyYeDwkP',
            'func': 'pkg_kehoach_thongtin.Xoa_DaoTao_CT_DinhHuong_NH',
            'iM': edu.system.iM,
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    //me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                    me.getList_SVChuaThem();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_SVChuaThem: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIPJjQuKAkuIgIpNCARKSAvBSgvKQk0Li8m',
            'func': 'pkg_kehoach_thongtin2.LayDSNguoiHocChuaPhanDinhHuong',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtSVChuaThem"] = dtReRult;
                    me.genTable_SVChuaThem(dtReRult, data.Pager);
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
    genTable_SVChuaThem: function (data, iPager) {
       
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVienChuaThem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhHuong.getList_SVChuaThem()",
                iDataRow: 1,
                bFilter: true
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",

                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",

                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",

                },

                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        //3. create html
        //me.arrSinhVien_Id = [];
        //$("#tblInput_DTSV_SinhVien tbody").html("");
        //for (var i = 0; i < data.length; i++) {
        //    var html = "";
        //    html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
        //    html += "<td class='td-center'>" + (i + 1) + "</td>";
        //    html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_MASO + "</span></td>";
        //    html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_HODEM  + "</span></td>";
        //    html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_TEN + "</span></td>";
        //    html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
        //    html += "</tr>";
        //    //4. fill into tblNhanSu
        //    $("#tblInput_DTSV_SinhVien tbody").append(html);
        //    //5. create data danhmucvaitro
        //    me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
        //    me.arrSinhVien.push(data[i]);
        //}
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhHuong.getList_SinhVien()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",

                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",

                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",

                },

                {
                    "mDataProp": "DAOTAO_CT_DINHHUONG_TENDAYDU",

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_Nhom: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/FSkkLB4FIC4VIC4eAhUeBQkeDykuLAPP',
            'func': 'pkg_kehoach_thongtin2.Them_DaoTao_CT_DH_Nhom',
            'iM': edu.system.iM,
            'strId': me.strNhom_Id,
            'strTen': edu.util.getValById('txtTenNhom'),
            'strMa': edu.util.getValById('txtMaNhom'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KHCT_ThongTin2_MH/EjQgHgUgLhUgLh4CFR4FCR4PKS4s';
            obj_save.func = 'pkg_kehoach_thongtin2.Sua_DaoTao_CT_DH_Nhom'
        }
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
                    me.getList_Nhom();
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
    getList_Nhom: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeDykuLAPP',
            'func': 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtNhom"] = dtReRult;
                    me.genTable_Nhom(dtReRult, data.Pager);
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
    genTable_Nhom: function (data, iPager) {
        $("#lblDinhHuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhom",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhHuong.getList_Nhom()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4,5 ],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DAOTAO_CT_DINHHUONG_TEN",
                    
                },
                
                {
                    "mRender": function (nRow, aData) {
                        var x = aData.SOSVTHUOCNHOM;
                        if (!x) x = "Xem";
                        return '<span><a class="btn btn-default btnChuaThem" id="' + aData.ID + '" title="Sửa">' + x +'</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        /*III. Callback*/
    },
    delete_Nhom: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/GS4gHgUgLhUgLh4CFR4FCR4PKS4s',
            'func': 'pkg_kehoach_thongtin2.Xoa_DaoTao_CT_DH_Nhom',
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
                    me.getList_Nhom();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    viewEdit_Nhom: function (data) {
        var me = this;
        edu.util.viewValById("txtMaNhom", data.MA);
        edu.util.viewValById("txtTenNhom", data.TEN);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChiaNhom: function (strId) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtChuaThem.find(e => e.ID == strId)
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/FSkkLB4FIC4VIC4eAhUeBQkeDykuLB4PCQPP',
            'func': 'pkg_kehoach_thongtin2.Them_DaoTao_CT_DH_Nhom_NH',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_CT_DH_Nhom_Id': me.strNhom_Id,
            'strDaoTao_CT_DinhHuong_Id': aData.DAOTAO_CT_DINHHUONG_ID,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChuaThem();
                    me.getList_DaThem();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChuaThem: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeAik0IA8pLiweDwkP',
            'func': 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_ChuaNhom_NH',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChuaThem"] = dtReRult;
                    me.genTable_ChuaThem(dtReRult, data.Pager);
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
    genTable_ChuaThem: function (data, iPager) {
        $("#lblDinhHuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChuaThem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhHuong.getList_ChuaThem()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",

                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",

                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",

                },
                
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_DaThem: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeDykuLB4PCQPP',
            'func': 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom_NH',
            'iM': edu.system.iM,
            'strDaoTao_CT_DH_Nhom_Id': me.strNhom_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDaThem"] = dtReRult;
                    me.genTable_DaThem(dtReRult, data.Pager);
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
    genTable_DaThem: function (data, iPager) {
        $("#lblDinhHuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDaThem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhHuong.getList_DaThem()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",

                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",

                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",

                },

                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    delete_ChiaNhom: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/GS4gHgUgLhUgLh4CFR4FCR4PKS4sHg8J',
            'func': 'pkg_kehoach_thongtin2.Xoa_DaoTao_CT_DH_Nhom_NH',
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
                    me.getList_ChuaThem();
                    me.getList_DaThem();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

}