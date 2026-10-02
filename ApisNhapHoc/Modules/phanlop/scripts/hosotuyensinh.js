
function HoSoTuyenSinh() { };
HoSoTuyenSinh.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    strHoSoDuTuyen_Id: '',
    str_HSDT_Lop9_Id: '',
    str_HSDT_Lop10_Id: '',
    str_HSDT_Lop12_Id: '',
    strTruongTHPT_Id: '',
    tab_item_actived: [],
    arrValid_HS: [],
    dtKeHoachTuyenSinh: [],
    dtDoiTacTuyenSinh: [],
    dtHSDT_Lop9: [],
    dtHSDT_Lop10: [],
    dtHSDT_Lop12: [],
    dtHoSo: [],
    dtHocLuc: [],

    init: function () {
        var me = this;

        me.page_load();

        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
            me.getList_HoSoGiayTo();
        });
        $("#zone_input_HoSoTuyenSinh").delegate("#btnUpDate", "click", function (e) {
            me.save_HoSo();
        });
        $("#zone_input_HoSoTuyenSinh").delegate("#btnKhoiTao_Save", "click", function (e) {
            me.save_HoSo();
        });


        //$("#zone_input_HoSoTuyenSinh").delegate('.btnDelete', 'click', function () {
        //    if (edu.util.checkValue(me.strHoSoDuTuyen_Id)) {
        //        edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
        //        $("#btnYes").click(function (e) {
        //            me.delete_HS(me.strHoSoDuTuyen_Id);
        //        });
        //        return false;
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});

        $("#dropSearch_KeHoachTuyenSinh").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            me.getList_HoSo();
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_LopHoc();
            me.getList_HoSo();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_HoSo();
            me.getList_LopHoc();
        });
        $("#dropSearch_LopQuanLy").on("select2:select", function () {
            me.getList_HoSo();
        });

        $("#dropKeHoachTuyenSinh").on("select2:select", function () {
            me.getList_HeDaoTao_KeThua();
            me.getList_KhoaDaoTao_KeThua();
        });
        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao_KeThua();
        });
        $("#dropKhoaDaoTao").on("select2:select", function () {
            me.getList_LopHoc_KeThua();
        });
        $(".btnSearch").click(function () {
            me.getList_HoSo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HoSo();

            }
        });

        $("#btnLuuHoSo").click(function () {
            me.save_HoSoGiayTo();
        });
        $("#tblHoSoTuyenSinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.viewForm_HoSo(edu.util.objGetOneDataInData(strId, me.dtHoSo, "ID"));
                me.strHoSoDuTuyen_Id = edu.util.cutPrefixId(/view_/g, strId);
                me.getList_HSDT_Lop9(me.strHoSoDuTuyen_Id);
                me.getList_HSDT_Lop10(me.strHoSoDuTuyen_Id);
                me.getList_HSDT_Lop12(me.strHoSoDuTuyen_Id);
                me.getList_HSDT_THPT(me.strHoSoDuTuyen_Id);
                me.getList_HoSoGiayTo(me.strHoSoDuTuyen_Id);
                edu.util.setOne_BgRow(strId, "tblHoSoTuyenSinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHoSoTuyenSinh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HS(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblHoSoTuyenSinh").delegate('.btnLichSu', 'click', function (e) {
            $('#myModalLichSu').modal('show');
            me.getList_ChuyenLop(this.id);
        });

        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHoSoTuyenSinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HS(arrChecked_Id.toString());
            });
        });
        $("#tblHoSoTuyenSinh").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblHoSoTuyenSinh", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHoSoTuyenSinh" });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongMoi_THPT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_HSDT_THPT(id, "");
        });
        $("#tbl_HoSoDuTuyen_TruongTHPT").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HoSoDuTuyen_TruongTHPT tr[id='" + strRowId + "']").remove();
        });
        $("#tbl_HoSoDuTuyen_TruongTHPT").delegate(".deleteHSDT_THPT", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HSDT_THPT(strId);
            });
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongMoi_GiayTo").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_HoSoGiayTo(id, "");
        });
        $("#tbl_HoSoGiayTo").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HoSoGiayTo tr[id='" + strRowId + "']").remove();
        });
        $("#tbl_HoSoGiayTo").delegate(".deleteHoSo", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HoSoGiayTo(strId);
            });
        });

        edu.extend.genDropTinhThanh("dropSearch_TinhThanh", "dropSearch_Huyen", "dropSearch_PhuongXa");
        /*------------------------------------------
        --Discription: KeThua
        --Discription:
        -------------------------------------------*/
        $("#btnChuyenNguyenVong").click(function () {
            $("#myModalNguyenVong").modal("show");
        });
        $("#btnSave_NguyenVong").click(function () {
            $('#myModalNguyenVong').modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHoSoTuyenSinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.confirm("Bạn có muốn chuyển lớp cho <span style='color: red'>" + arrChecked_Id.length + "</span> không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ChuyenNguyenVong(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_HoSo();
                }, 500 + arrChecked_Id.length * 80);
            });
        });
    },

    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_KeHoachTuyenSinh();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_HoSo();
        me.getList_NguonTuyenSinh();
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "", "", me.cbGetList_LoaiHoSo);
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.HOCLUC", "drop_9_HocLuc,drop_12_HocLuc",);
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.HANHKIEM", "drop_9_HanhKiem,drop_12_HanhKiem",);
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TRUONGHOC", "", "", me.cbGetList_THPT);
        edu.extend.setTinhThanh(["txt_NoiSinh", "txt_QueQuan", "txt_HoKhauThuongTru"], 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHTRANGHOSO", "drop_TinhTrangHoSo");
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TRUONGHOC", "dropSearch_TruongHoc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "drop_DanToc,drop_input_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "drop_TonGiao,drop_input_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.NGANHNGHE", "drop_NganhNghe,drop_input_NganhNghe,dropSearch_NganhNghe");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "drop_GioiTinh,drop_input_GioiTinh");
        edu.system.uploadAvatar(['uploadPicture_HS'], "");
        edu.system.uploadFiles(["txt_ThongTinDinhKem"]);
    },
    
    rewrite: function () {
        var me = this;
        me.strId = "";
        var arrId = ["txt_HoDem", "txt_Ten", "txt_NgaySinh", "txt_ThangSinh",
            "txt_CMND", "txt_SDT",
            "txt_HoTenBo", "txt_HoTenMe", "txt_SDTBo", "txt_SDTMe", "txt_MaSoDuTuyen"];
        edu.util.resetValByArrId(arrId);
        me.str_HSDT_Lop10_Id = "";
        me.str_HSDT_Lop12_Id = "";
        me.str_HSDT_Lop9_Id = "";
        $("#tbl_HoSoDuTuyen_TruongTHPT tbody").html("");
        $("#tbl_HoSoGiayTo tbody").html("");
        for (var i = 0; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_HSDT_THPT(id, "");
        }
        for (var i = 0; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_HoSoGiayTo(id, "");
        }
        
        edu.util.viewValById("txtUuTien", "");
        edu.util.viewValById("txtTong", "");
        edu.util.viewValById("txtDiemMon1", "");
        //edu.util.viewValById("txtTenMon1", "");
        edu.util.viewValById("txtDiemMon2", "");
        //edu.util.viewValById("txtTenMon2", "");
        edu.util.viewValById("txtDiemMon3", "");
        //edu.util.viewValById("txtTenMon3", "");
        edu.util.viewValById("txtDiemMon4", "");
        //edu.util.viewValById("txtTenMon4", "");
        edu.util.viewValById("txtDiemMon5", "");
        //edu.util.viewValById("txtTenMon5", "");
        edu.util.viewValById("txt_12_TBCN", "");
        edu.util.viewValById("txt_12_NamTN", "");
        edu.util.viewValById("drop_12_HocLuc", "");
        edu.util.viewValById("drop_12_HanhKiem", "");
        edu.util.viewValById("txt_9_TBCN", "");
        edu.util.viewValById("txt_9_NamTN", "");
        edu.util.viewValById("drop_9_HocLuc", "");
        edu.util.viewValById("drop_9_HanhKiem", "");
        edu.system.viewFiles("txt_ThongTinDinhKem", "");
        edu.util.viewValById("uploadPicture_HS", "");
        var strAnh = edu.system.getRootPathImg("");
        me.strHoSoDuTuyen_Id = "";
        $("#srcuploadPicture_HS").attr("src", strAnh);
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HoSoTuyenSinh");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_HoSoTuyenSinh");
    },
    toggle_form_update: function () {
        edu.util.toggle_overide("zone-bus", "zone_update_HoSoTuyenSinh");
    },

    getList_KeHoachTuyenSinh: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoach_NguoiDung/LayDanhSach',


            'strTuKhoa': "",
            'strNguoiDung_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000000
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtKeHoachTuyenSinh = dtResult;
                    me.genCombo_KeHoachTuyenSinh(dtResult);
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
    genCombo_KeHoachTuyenSinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoachTuyenSinh", "dropKeHoachTuyenSinh"],
            title: "Chọn kế hoạch tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_NguonTuyenSinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_DoiTacTuyenSinh/LayDanhSach',

            'strTuKhoa': "",
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000000
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
                    me.genCombo_NguonTuyenSinh(dtResult, iPager);
                }
                else {
                    edu.system.alert("TS_DoiTacTuyenSinh/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("TS_DoiTacTuyenSinh/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_NguonTuyenSinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THONGTINHIENTHI",
            },
            renderPlace: ["drop_NguonTuyenSinh", "dropSearch_DoiTacTuyenSinh"],
            title: "Chọn nguồn tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("TS_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'TS_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strTS_KeHoachTuyenSinh_Id': edu.util.getValById("dropSearch_KeHoachTuyenSinh"),
                'strNguoiThucHien_Id': edu.system.userId,
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (data) {
        var me = main_doc.HoSoTuyenSinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HeDaoTao_KeThua: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao_KeThua(dtResult);
                }
                else {
                    edu.system.alert("TS_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'TS_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strTS_KeHoachTuyenSinh_Id': edu.util.getValById("dropKeHoachTuyenSinh"),
                'strNguoiThucHien_Id': edu.system.userId,
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao_KeThua: function (data) {
        var me = main_doc.HoSoTuyenSinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropHeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KhoaDaoTao/LayDanhSach',
            
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoachTuyenSinh'),
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
                    me.genCombo_KhoaDaoTao(dtResult, iPager);
                }
                else {
                    edu.system.alert("TS_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("TS_KhoaDaoTao/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = main_doc.HoSoTuyenSinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KhoaDaoTao_KeThua: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KhoaDaoTao/LayDanhSach',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropKeHoachTuyenSinh'),
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
                    me.genCombo_KhoaDaoTao_KeThua(dtResult, iPager);
                }
                else {
                    edu.system.alert("TS_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("TS_KhoaDaoTao/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao_KeThua: function (data) {
        var me = main_doc.HoSoTuyenSinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropKhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    }
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/,
    getList_LopHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_LopQuanLy/LayDanhSach',


            'strTuKhoa': "",
            'strDaoTao_CoSoDaoTao_Id': "",
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strDaoTao_Nganh_Id': "",
            'strDaoTao_LoaiLop_Id': "",
            'strDaoTao_ToChucCT_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.genCombo_LopHoc(dtResult, iPager);
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
    genCombo_LopHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_LopHoc_KeThua: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_LopQuanLy/LayDanhSach',


            'strTuKhoa': "",
            'strDaoTao_CoSoDaoTao_Id': "",
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropKhoaDaoTao"),
            'strDaoTao_Nganh_Id': "",
            'strDaoTao_LoaiLop_Id': "",
            'strDaoTao_ToChucCT_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.genCombo_LopHoc_KeThua(dtResult, iPager);
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
    genCombo_LopHoc_KeThua: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MAKHOA",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.TEN + "(" + aData.SOLUONGTHUCTE + ")";
                }
            },
            renderPlace: ["dropLopQuanLy"],
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> ho so tuyen sinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HoSo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_HoSoDuTuyen/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById("dropSearch_KeHoachTuyenSinh"),
            'strTS_DoiTacTuyenSinh_Id': edu.util.getValById('dropSearch_DoiTacTuyenSinh'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strThuongTru_TinhThanh_Id': edu.util.getValById('dropSearch_TinhThanh'),
            'strThuongTru_QuanHuyen_Id': edu.util.getValById('dropSearch_Huyen'),
            'strThuongTru_PhuongXa_Id': edu.util.getValById('dropSearch_PhuongXa'),
            'strNganhNghe_Id': edu.util.getValById("dropSearch_NganhNghe"),
            'strTruongPTTH_Id': edu.util.getValById('dropSearch_TruongHoc'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strTS_XacNhanDuyetHoSo_Id': "",
            'strTS_XacNhanDuyetTT_Id': "",
            'strNguoiTao_Id': edu.system.userId,
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
                    me.dtHoSo = dtResult;
                    me.genTable_HoSo(dtResult, iPager);
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
    genTable_HoSo: function (data, iPager) {
        var me = this;
        $("#lblHoSoTuyenSinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHoSoTuyenSinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoTuyenSinh.getList_HoSo()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            sort: true,
            colPos: {
                center: [0, 3, 9, 7, 10],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH) + '/' + edu.util.returnEmpty(aData.THANGSINH) + '/' + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        html += '</span>';
                        return html;
                    }

                },
                {
                    "mDataProp": "NGANHNGHE_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "TTCN_DIENTHOAI"
                }
                , {
                    "mRender": function (nRow, aData) {
                        if (edu.util.checkValue(aData.DAOTAO_LOPQUANLY_MA)) {
                            return '<span><a class="btn btn-default btnLichSu" id="' + aData.ID + '" title="Chuyển lớp">' + aData.DAOTAO_LOPQUANLY_MA + ' - Xem lịch sử</a></span>';
                        } else {
                            return "";
                        }
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    getDetail_HoSo: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TS_HoSoDuTuyen/LayChiTiet',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HoSo(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_HoSo: function () {
        var me = main_doc.HoSoTuyenSinh;
        //--Edit
        var obj_save = {
            'action': 'TS_HoSoDuTuyen/ThemMoi',

            'strId': me.strHoSoDuTuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMaSo': "",
            'strNganhNghe_Id': edu.util.getValById("drop_NganhNghe"),
            'strNganh_Nghe_Truoc': edu.util.getValById("txtNganhNgheTruoc"),
            'strHoDem': edu.util.getValById("txt_HoDem"),
            'strTen': edu.util.getValById("txt_Ten"),
            'strNgaySinh': edu.util.getValById("txt_NgaySinh"),
            'strThangSinh': edu.util.getValById("txt_ThangSinh"),
            'strNamSinh': edu.util.getValById("txt_NamSinh"),
            'strGioiTinh_Id': edu.util.getValById("drop_GioiTinh"),
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txt_NoiSinh").attr("tinhId")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txt_NoiSinh").attr("huyenId")),
            'strNoiSinh_PhuongXa_Id': edu.util.returnEmpty($("#txt_NoiSinh").attr("xaId")),
            'strNoiSinh_DiaChi': edu.util.returnEmpty($("#txt_NoiSinh").attr("name")),
            'strDanToc_Id': edu.util.getValById("drop_DanToc"),
            'strTonGiao_Id': edu.util.getValById("drop_TonGiao"),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txt_QueQuan").attr("tinhId")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txt_QueQuan").attr("huyenId")),
            'strQueQuan_PhuongXa_Id': edu.util.returnEmpty($("#txt_QueQuan").attr("xaId")),
            'strQueQuan_DiaChi': edu.util.returnEmpty($("#txt_QueQuan").attr("name")),
            'strThuongTru_TinhThanh_Id': edu.util.returnEmpty($("#txt_HoKhauThuongTru").attr("tinhId")),
            'strThuongTru_QuanHuyen_Id': edu.util.returnEmpty($("#txt_HoKhauThuongTru").attr("huyenId")),
            'strThuongTru_PhuongXa_Id': edu.util.returnEmpty($("#txt_HoKhauThuongTru").attr("xaId")),
            'strThuongTru_DiaChi': edu.util.returnEmpty($("#txt_HoKhauThuongTru").attr("name")),
            'strCMT_So': edu.util.getValById("txt_CMND"),
            'strCMT_NgayCap': "",
            'strCMT_NoiCap': "",
            'strGiaDinh_HoTenBo': edu.util.getValById("txt_HoTenBo"),
            'strGiaDinh_HoTenMe': edu.util.getValById("txt_HoTenMe"),
            'strGiaDinh_NguoiBaoTin': edu.util.getValById("txt_NguoibaoTin"),
            'strGiaDinh_DiaChiBaoTin': edu.util.getValById("txt_DiaChiBaoTin"),
            //'strGiaDinh_DiaChiBaoTin': edu.util.returnEmpty($("#txt_DiaChiBaoTin").attr("name")),
            'strDoan_NgayVao': edu.util.getValById("txt_NgayVaoDoan"),
            'strDang_NgayVao': edu.util.getValById("txt_NgayVaoDang"),
            'strTTCN_DienThoai': edu.util.getValById("txt_SDT"),
            'strTTCN_Email': "",
            'strGhiChu': edu.util.getValById("txt_GhiChu"),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById("dropSearch_KeHoachTuyenSinh"),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strXacNhanTinhTrangNopHS_Id': edu.util.getValById("drop_TinhTrangHoSo"),
            'strAnhCaNhan': edu.system.getImage('uploadPicture_HS', me.strHoSoDuTuyen_Id),
            'strTS_DoiTacTuyenSinh_id': edu.util.getValById("drop_NguonTuyenSinh"),
            'strTS_DoiTacTuyenSinh_Khac': edu.util.getValById("txt_NguonTuyenSinhKhac"),
            'strGiaDinh_SoDienThoaiBo': edu.util.getValById("txt_SDTBo"),
            'strGiaDinh_SoDienThoaiMe': edu.util.getValById("txt_SDTMe"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_HoSoDuTuyen/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHoSoDuTuyen_Id = data.Id;
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        strHoSoDuTuyen_Id = me.strHoSoDuTuyen_Id;
                        edu.system.alert("Cập nhật thành công!");
                    }
                    edu.system.saveFiles("txt_ThongTinDinhKem", strHoSoDuTuyen_Id, "TS_Files");
                    me.save_HSDT_Lop9("", strHoSoDuTuyen_Id);
                    me.save_HSDT_Lop12("", strHoSoDuTuyen_Id);
                    me.save_HSDT_Lop10("", strHoSoDuTuyen_Id);
                    $("#tbl_HoSoDuTuyen_TruongTHPT tbody tr").each(function () {
                        var str_HSDT_THPT_Id = this.id.replace(/rm_row/g, '');
                        me.save_HSDT_THPT(str_HSDT_THPT_Id, strHoSoDuTuyen_Id);
                    });
                    $("#tbl_HoSoGiayTo tbody tr").each(function () {
                        var strHoSoGiayTo_Id = this.id.replace(/rm_row/g, '');
                        me.save_HoSoGiayTo(strHoSoGiayTo_Id, strHoSoDuTuyen_Id);
                    });
                    setTimeout(function () {
                        me.getList_HoSo();
                    }, 50);
                    setTimeout(function () {
                        me.strHoSoDuTuyen_Id = strHoSoDuTuyen_Id;
                        $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
                        me.getDetail_HoSo(strHoSoDuTuyen_Id);
                        me.getList_HSDT_Lop9();
                        me.getList_HSDT_Lop10();
                        me.getList_HSDT_Lop12();
                        me.getList_HSDT_THPT();
                        me.getList_HoSoGiayTo();
                    }, 1000);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    viewForm_HoSo: function (data) {
        var me = this;
        //$("#lblHoSo").html(edu.util.returnEmpty(data.HODEM) + " " + edu.util.returnEmpty(data.TEN) + " - Mã số: " + edu.util.returnEmpty(data.MASO)); 
        //view data --Edit
        me.str_HSDT_Lop10_Id = "";
        me.str_HSDT_Lop12_Id = "";
        me.str_HSDT_Lop9_Id = "";
        edu.util.viewValById("uploadPicture_HS", data.ANHCANHAN);
        var strAnh = edu.system.getRootPathImg(data.ANHCANHAN);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        edu.util.viewValById("txt_HoDem", data.HODEM);
        edu.util.viewValById("txt_MaSoDuTuyen", data.MASO);
        edu.util.viewValById("txt_Ten", data.TEN);
        edu.util.viewValById("txt_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txt_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txt_NamSinh", data.NAMSINH);
        edu.util.viewValById("drop_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("drop_DanToc", data.DANTOC_ID);
        edu.util.viewValById("drop_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("txt_CMND", data.CMT_SO);
        edu.util.viewValById("txt_SDT", data.TTCN_DIENTHOAI);
        edu.util.viewValById("drop_NganhNghe", data.NGANHNGHE_ID);
        edu.util.viewValById("txtNganhNgheTruoc", data.NGANH_NGHE_TRUOC);

        edu.extend.viewTinhThanhById("txt_QueQuan", data.QUEQUAN_TINHTHANH_ID, data.QUEQUAN_QUANHUYEN_ID, data.QUEQUAN_PHUONGXA_ID, data.QUEQUAN_DIACHI);
        edu.extend.viewTinhThanhById("txt_NoiSinh", data.NOISINH_TINHTHANH_ID, data.NOISINH_QUANHUYEN_ID, data.NOISINH_PHUONGXA_ID, data.NOISINH_DIACHI);
        edu.extend.viewTinhThanhById("txt_HoKhauThuongTru", data.THUONGTRU_TINHTHANH_ID, data.THUONGTRU_QUANHUYEN_ID, data.THUONGTRU_PHUONGXA_ID, data.THUONGTRU_DIACHI);

        edu.util.viewValById("txt_HoTenBo", data.GIADINH_HOTENBO);
        edu.util.viewValById("txt_HoTenMe", data.GIADINH_HOTENME);
        edu.util.viewValById("txt_SDTBo", data.GIADINH_SODIENTHOAIBO);
        edu.util.viewValById("txt_SDTMe", data.GIADINH_SODIENTHOAIME);
        edu.util.viewValById("txt_NguoibaoTin", data.GIADINH_NGUOIBAOTIN);
        edu.util.viewValById("txt_DiaChiBaoTin", data.GIADINH_DIACHIBAOTIN);

        edu.util.viewValById("txt_NgayVaoDoan", data.DOAN_NGAYVAO);
        edu.util.viewValById("txt_NgayVaoDang", data.DANG_NGAYVAO);

        edu.util.viewValById("drop_NguonTuyenSinh", data.TS_DOITACTUYENSINH_ID);
        edu.util.viewValById("txt_NguonTuyenSinhKhac", data.TS_DOITACTUYENSINH_KHAC);

        edu.util.viewValById("drop_TinhTrangHoSo", data.XACNHANTINHTRANGNOPHOSO_ID);
        edu.util.viewValById("txt_GhiChu", data.GHICHU);
        //edu.util.viewValById("txt_GhiChu", data.GHICHU);
        edu.system.viewFiles("txt_ThongTinDinhKem", data.ID, "TS_Files");
        me.strHoSoDuTuyen_Id = data.ID;
    },
    delete_HS: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_HoSoDuTuyen/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HoSo();
                    me.toggle_notify();
                    $(window).scrollTop(1);
                }
                else {
                    edu.system.alert("TS_HoSoDuTuyen/Xoa: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("TS_HoSoDuTuyen/Xoa (er): " + JSON.stringify(er), "w");

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
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/

    save_HSDT_THPT: function (str_HSDT_THPT_Id, strHoSoDuTuyen_Id) {
        var me = main_doc.HoSoTuyenSinh;
        var strId = str_HSDT_THPT_Id;
        var strTruong_Id = edu.util.getValById('dropTHPT_TenTruong' + str_HSDT_THPT_Id);
        var strTruong_Khac = edu.util.getValById('txt_THPT_TenTruongKhac' + str_HSDT_THPT_Id);
        var strGhiChu = edu.util.getValById('txt_THPT_DiaChi' + str_HSDT_THPT_Id);
        if (!edu.util.checkValue(strTruong_Id) && !edu.util.checkValue(strTruong_Khac)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";

        var obj_save = {
            'action': 'TS_HoSoDuTuyen_Truong/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTruong_Id': strTruong_Id,
            'strTruong_Khac': strTruong_Khac,
            'strGhiChu': strGhiChu,
            'strTS_HoSoDuTuyen_Id': strHoSoDuTuyen_Id,
            'strTinhThanh_Id': '',
            'strQuanHuyen_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'TS_HoSoDuTuyen_Truong/CapNhat';
        //}
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_HSDT_THPT();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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
    getList_HSDT_THPT: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_HoSoDuTuyen_Truong/LayDanhSach',

            'strTuKhoa': '',
            'strTS_HoSoDuTuyen_Id': me.strHoSoDuTuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;

                    dtResult = data.Data;
                    me.genHTML_HSDT_THPT_Data(dtResult);
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
    delete_HSDT_THPT: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TS_HoSoDuTuyen_Truong/Xoa',

            'strIds': strIds,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HSDT_THPT();
                }
                else {
                    obj = {
                        content: "TS_HoSoDuTuyen_Truong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_HoSoDuTuyen_Lop9/Xoa (er): " + JSON.stringify(er),
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

    genHTML_HSDT_THPT_Data: function (data) {
        var me = this;
        $("#tbl_HoSoDuTuyen_TruongTHPT tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var str_HSDT_THPT_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + str_HSDT_THPT_Id + '">';
            row += '<td><select id="dropTHPT_TenTruong' + str_HSDT_THPT_Id + '" class="select-opt"><option value=""> --- Chọn trường THPT--</option ></select ></td>';
            row += '<td><input type="text" id="txt_THPT_TenTruongKhac' + str_HSDT_THPT_Id + '" value="' + edu.util.returnEmpty(data[i].TRUONG_KHAC) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txt_THPT_DiaChi' + str_HSDT_THPT_Id + '" value="' + edu.util.returnEmpty(data[i].GHICHU) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHSDT_THPT" id="' + str_HSDT_THPT_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_HoSoDuTuyen_TruongTHPT tbody").append(row);
            me.genCombo_THPT("dropTHPT_TenTruong" + str_HSDT_THPT_Id, data[i].TRUONG_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_HSDT_THPT(id, "");
        }

    },
    genHTML_HSDT_THPT: function (str_HSDT_THPT_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_HoSoDuTuyen_TruongTHPT").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + str_HSDT_THPT_Id + '">';
        row += '<td><select id="dropTHPT_TenTruong' + str_HSDT_THPT_Id + '" class="select-opt" readonly><option value=""> --- Chọn trường THPT--</option ></select ></td>';
        row += '<td><input type="text" id="txt_THPT_TenTruongKhac' + str_HSDT_THPT_Id + '"  class="form-control" /></td>';
        row += '<td><input type="text" id="txt_THPT_DiaChi' + str_HSDT_THPT_Id + '"  class="form-control" /></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + str_HSDT_THPT_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_HoSoDuTuyen_TruongTHPT tbody").append(row);
        me.genCombo_THPT("dropTHPT_TenTruong" + str_HSDT_THPT_Id, "");
    },
    cbGetList_THPT: function (data) {
        main_doc.HoSoTuyenSinh.dtTHPT = data;
    },
    genCombo_THPT: function (dropHSDT_THPT_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTHPT,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [dropHSDT_THPT_Id],
            type: "",
            title: "Chọn trường THPT"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + dropHSDT_THPT_Id).select2();
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    //-------------------------------------------*/
    save_HSDT_Lop9: function (str_HSDT_Lop9_Id, strHoSoDuTuyen_Id) {
        var me = this;
        var obj_save = {
            'action': 'TS_HoSoDuTuyen_Lop9/ThemMoi',

            'strId': me.str_HSDT_Lop9_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamTN': edu.util.getValById('txt_9_NamTN'),
            'strDIEMTBCN': edu.util.getValById('txt_9_TBCN'),
            'strTS_HoSoDuTuyen_Id': strHoSoDuTuyen_Id,
            'strHocLuc_Id': edu.util.getValById('drop_9_HocLuc'),
            'strHanhKiem_Id': edu.util.getValById('drop_9_HanhKiem'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_HoSoDuTuyen_Lop9/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
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
    getList_HSDT_Lop9: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_HoSoDuTuyen_Lop9/LayDanhSach',

            'strTuKhoa': '',
            'strTS_HoSoDuTuyen_Id': me.strHoSoDuTuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (dtResult.length > 0) {
                            me.viewForm_Lop9(dtResult[dtResult.length -1]);

                        }
                    }
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
    viewForm_Lop9: function (data) {
        var me = this;
        edu.util.viewValById("txt_9_TBCN", data.DIEMTBCN);
        edu.util.viewValById("txt_9_NamTN", data.NAMTN);
        edu.util.viewValById("drop_9_HocLuc", data.HOCLUC_ID);
        edu.util.viewValById("drop_9_HanhKiem", data.HANHKIEM_ID);
        me.str_HSDT_Lop9_Id = data.ID;
    },

    save_HSDT_Lop12: function (str_HSDT_Lop12_Id, strHoSoDuTuyen_Id) {
        var me = this;

        var obj_save = {
            'action': 'TS_HoSoDuTuyen_Lop12/ThemMoi',
            
            'strId': me.str_HSDT_Lop12_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamTN': edu.util.getValById('txt_12_NamTN'),
            'strDIEMTBCN': edu.util.getValById('txt_12_TBCN'),
            'strTS_HoSoDuTuyen_Id': strHoSoDuTuyen_Id,
            'strHocLuc_Id': edu.util.getValById('drop_12_HocLuc'),
            'strHanhKiem_Id': edu.util.getValById('drop_12_HanhKiem'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_HoSoDuTuyen_Lop12/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_HSDT_Lop12();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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
    getList_HSDT_Lop12: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_HoSoDuTuyen_Lop12/LayDanhSach',

            'strTuKhoa': '',
            'strTS_HoSoDuTuyen_Id': me.strHoSoDuTuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (dtResult.length > 0) {
                            me.viewForm_Lop12(dtResult[dtResult.length - 1]);

                        }
                    }
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
    viewForm_Lop12: function (data) {
        var me = this;
        edu.util.viewValById("txt_12_TBCN", data.DIEMTBCN);
        edu.util.viewValById("txt_12_NamTN", data.NAMTN);
        edu.util.viewValById("drop_12_HocLuc", data.HOCLUC_ID);
        edu.util.viewValById("drop_12_HanhKiem", data.HANHKIEM_ID);
        me.str_HSDT_Lop12_Id = data.ID;
    },

    save_HSDT_Lop10: function (str_HSDT_Lop10_Id, strHoSoDuTuyen_Id) {
        var me = this;
        var obj_save = {
            'action': 'TS_HoSoDuTuyen_Lop10/ThemMoi',

            'strId': me.str_HSDT_Lop10_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_HoSoDuTuyen_Id': strHoSoDuTuyen_Id,
            'dDiemUuTien': edu.util.getValById('txtUuTien'),
            'dTongDiem': edu.util.getValById('txtTong'),
            'dMon1': edu.util.getValById('txtDiemMon1'),
            'strMon1_Ten': edu.util.getValById('txtTenMon1'),
            'dMon2': edu.util.getValById('txtDiemMon2'),
            'strMon2_Ten': edu.util.getValById('txtTenMon2'),
            'dMon3': edu.util.getValById('txtDiemMon3'),
            'strMon3_Ten': edu.util.getValById('txtTenMon3'),
            'dMon4': edu.util.getValById('txtDiemMon4'),
            'strMon4_Ten': edu.util.getValById('txtTenMon4'),
            'dMon5': edu.util.getValById('txtDiemMon5'),
            'strMon5_Ten': edu.util.getValById('txtTenMon5'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_HoSoDuTuyen_Lop10/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_HSDT_Lop10();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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
    getList_HSDT_Lop10: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_HoSoDuTuyen_Lop10/LayDanhSach',

            'strTuKhoa': '',
            'strTS_HoSoDuTuyen_Id': me.strHoSoDuTuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (dtResult.length > 0) {
                            me.viewForm_Lop10(dtResult[dtResult.length - 1]);

                        }
                    }
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
    delete_HSDT_Lop10: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TS_HoSoDuTuyen_Lop10/Xoa',

            'strIds': strIds,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HSDT_Lop10();
                }
                else {
                    obj = {
                        content: "TS_HoSoDuTuyen_Lop10/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_HoSoDuTuyen_Lop9/Xoa (er): " + JSON.stringify(er),
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

    viewForm_Lop10: function (data) {
        var me = this;
        edu.util.viewValById("txtUuTien", data.DIEMUUTIEN);
        edu.util.viewValById("txtTong", data.TONGDIEM);
        edu.util.viewValById("txtDiemMon1", data.MON1);
        edu.util.viewValById("txtTenMon1", data.MON1_TEN);
        edu.util.viewValById("txtDiemMon2", data.MON2);
        edu.util.viewValById("txtTenMon2", data.MON2_TEN);
        edu.util.viewValById("txtDiemMon3", data.MON3);
        edu.util.viewValById("txtTenMon3", data.MON3_TEN);
        edu.util.viewValById("txtDiemMon4", data.MON4);
        edu.util.viewValById("txtTenMon4", data.MON4_TEN);
        edu.util.viewValById("txtDiemMon5", data.MON5);
        edu.util.viewValById("txtTenMon5", data.MON5_TEN);
        me.str_HSDT_Lop10_Id = data.ID;
    },
    
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> tổ hợp môn
    --Author: duyentt
    -------------------------------------------*/
    getList_HoSoGiayTo: function () {
        var me = main_doc.HoSoTuyenSinh;

        //--Edit
        var obj_list = {
            'action': 'TS_HoSo/LayDanhSach',

            'strTuKhoa': "",
            'strTS_HoSoDuTuyen_Id': me.strHoSoDuTuyen_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiHoSo_Id': "",
            //'strTS_KeHoachTuyenSinh_Id':"",
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoachTuyenSinh'),
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize':100000000
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;

                    dtResult = data.Data;
                    me.genHTML_HoSoGiayTo_Data(dtResult);
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
    save_HoSoGiayTo: function (strHoSoGiayTo_Id, strHoSoDuTuyen_Id) {
        var me = this;
        var strId = strHoSoGiayTo_Id;
        //var strTS_KeHoachTuyenSinh_Id = me.strTS_KeHoachTuyenSinh_Id;
        var strLoaiHoSo_Id = edu.util.getValById('drop_LoaiHoSo' + strHoSoGiayTo_Id);
        //var dSoLuongCanNop = edu.util.getValById('txtSoLuongCanNop' + strHoSoGiayTo_Id);
        var dSoLuong = edu.util.getValById('txtSoLuong' + strHoSoGiayTo_Id);
        var strMoTa = edu.util.getValById('txtMoTa' + strHoSoGiayTo_Id);
        var obj_notify = {};
        if (!edu.util.checkValue(strLoaiHoSo_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";

        var obj_save = {
            'action': 'TS_HoSo/ThemMoi',
            
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_HoSoDuTuyen_Id': strHoSoDuTuyen_Id,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById("dropSearch_KeHoachTuyenSinh"),
            'strLoaiHoSo_Id': strLoaiHoSo_Id,
            'dSoLuongCanNop': '',
            'dSoLuong': dSoLuong,
            'strMoTa': strMoTa,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'TS_HoSo/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_HoSoGiayTo();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    genHTML_HoSoGiayTo_Data: function (data) {
        var me = this;
        $("#tbl_HoSoGiayTo tbody").html("");
        var strReadOnlySelect = "";
        for (var i = 0; i < data.length; i++) {
            var strHoSoGiayTo_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHoSoGiayTo_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strHoSoGiayTo_Id + '">' + (i + 1) + '</label></td>';
            //row += '<td><select id="drop_LoaiHoSo' + strHoSoGiayTo_Id + '" class="select-opt readonly"><option value=""> --- Chọn loại hồ sơ--</option ></select ></td>';
            row += '<td><select id="drop_LoaiHoSo' + strHoSoGiayTo_Id + '" class="select-opt"><option value=""> --- Chọn loại hồ sơ--</option ></select ></td>';
            row += '<td><input type="text" id="txtSoLuongCanNop' + strHoSoGiayTo_Id + '" value="' + edu.util.returnEmpty(data[i].SOLUONGCANNOP) + '" class="form-control" readonly/></td>';
            row += '<td><input type="text" id="txtSoLuong' + strHoSoGiayTo_Id + '" value="' + edu.util.returnEmpty(data[i].SOLUONG) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtMoTa' + strHoSoGiayTo_Id + '" value="' + edu.util.returnEmpty(data[i].MOTA) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHoSo" id="' + strHoSoGiayTo_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_HoSoGiayTo tbody").append(row);
            me.genCombo_LoaiHoSo("drop_LoaiHoSo" + strHoSoGiayTo_Id, data[i].LOAIHOSO_ID);
            strReadOnlySelect += ",#drop_LoaiHoSo" + strHoSoGiayTo_Id;
        }
        if (strReadOnlySelect != "") strReadOnlySelect = strReadOnlySelect.substring(1);
        edu.system.hiddenElement('{"readonlyselect2": "' + strReadOnlySelect +'"}');
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_HoSoGiayTo(id, "");
        }
    },
    genHTML_HoSoGiayTo: function (strHoSoGiayTo_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_HoSoGiayTo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHoSoGiayTo_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHoSoGiayTo_Id + '">' + iViTri + '</label></td>';
        //row += '<td><select id="drop_LoaiHoSo' + strHoSoGiayTo_Id + '" class="select-opt readonly" ><option value=""> --- Chọn loại hồ sơ--</option ></select ></td>';
        row += '<td><select id="drop_LoaiHoSo' + strHoSoGiayTo_Id + '" class="select-opt"><option value=""> --- Chọn loại hồ sơ--</option ></select ></td>';
        row += '<td><input type="text" id="txtSoLuongCanNop' + strHoSoGiayTo_Id + '"  class="form-control" /></td>';
        row += '<td><input type="text" id="txtSoLuong' + strHoSoGiayTo_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtMoTa' + strHoSoGiayTo_Id + '"  class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHoSoGiayTo_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_HoSoGiayTo tbody").append(row);
        me.genCombo_LoaiHoSo("drop_LoaiHoSo" + strHoSoGiayTo_Id, "");
    },
    cbGetList_LoaiHoSo: function (data) {
        main_doc.HoSoTuyenSinh.dtLoaiHoSo = data;
    },
    genCombo_LoaiHoSo: function (strLoaiHoSo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiHoSo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strLoaiHoSo_Id],
            type: "",
            title: "Chọn loại hồ sơ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strLoaiHoSo_Id).select2();
    },
    delete_HoSoGiayTo: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TS_HoSo/Xoa',

            'strIds': strIds,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HoSoGiayTo();
                }
                else {
                    obj = {
                        content: "TS_HoSoDuTuyen_Lop10/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_HoSoDuTuyen_Lop9/Xoa (er): " + JSON.stringify(er),
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

    save_ChuyenNguyenVong: function (strTS_HoSoDuTuyen_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_save = {
            'action': 'TS_HoSoDuTuyen/ChuyenLop',
            
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById("dropKeHoachTuyenSinh"),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropHeDaoTao"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropKhoaDaoTao"),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById("dropLopQuanLy"),
            'strLyDoChuyen': edu.util.getValById('txtLyDoChuyen'),
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Chuyển nguyện vọng thành công",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    //me.getList_HoSoGiayTo();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_HoSoDuTuyen_Lop9/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> tổ hợp môn
    --Author: duyentt
    -------------------------------------------*/
    getList_ChuyenLop: function (strTS_HoSoDuTuyen_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_HoSoDuTuyen/LayDSLichSuChuyenLop',
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichSuChuyenLop(dtReRult);
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

    genTable_LichSuChuyenLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSuChuyenLop",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mData": "qlsv_nguoihoc_hodem",
                    "mRender": function (nRow, aData) {
                        return aData.HODEM + " " + aData.TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "TRUOC_DAOTAO_LOPQUANLY_MA"
                },
                {
                    "mDataProp": "SAU_DAOTAO_LOPQUANLY_MA"
                },
                {
                    "mDataProp": "GHICHU_LS"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTHUCHIEN_DD_MM_YYYY_HHMMSS"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};