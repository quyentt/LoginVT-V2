
function ChuyenLopNhapHoc() { };
ChuyenLopNhapHoc.prototype = {
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
        

        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
            me.getList_HoSoGiayTo();
        });

        me.getList_KeHoach();
        //$("#zone_input_ChuyenLopNhapHoc").delegate('.btnDelete', 'click', function () {
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
        //$("#dropSearch_HeDaoTao").on("select2:select", function () {
        //    me.getList_KhoaDaoTao();
        //    me.getList_LopHoc();
        //    me.getList_HoSo();
        //});
        //$("#dropSearch_KhoaDaoTao").on("select2:select", function () {
        //    me.getList_HoSo();
        //    me.getList_LopHoc();
        //});
        //$("#dropSearch_LopQuanLy").on("select2:select", function () {
        //    me.getList_HoSo();
        //});

        $("#dropKeHoachTuyenSinh").on("select2:select", function () {
            me.getList_HeDaoTao_KeThua();
            me.getList_KhoaDaoTao_KeThua();
        });
        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropKhoaDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
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

        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChuyenLopNhapHoc" });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        
        $("#btnChuyenNguyenVong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuyenLopNhapHoc", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#myModalNguyenVong").modal("show");
        });
        $("#btnSave_NguyenVong").click(function () {
            $('#myModalNguyenVong').modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuyenLopNhapHoc", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.confirm("Bạn có muốn chuyển lớp cho <span style='color: red'>" + arrChecked_Id.length + "</span> không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ChuyenNguyenVong(arrChecked_Id[i]);
                }
                
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_CLNH", function (addKeyValue) {
            //var obj_list = {
            //    'strThuHoc': edu.extend.getCheckedCheckBoxByClassName('ckbDSTH').toString(),
            //    'strNhanSu_HoSoNhanSu_v2_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSGV').toString(),
            //    'dChiLayCacLopKhongTrung': $('#dLocTrung').is(":checked") ? 1 : 0,
            //    'strThuocTinhLop_Id': edu.util.getValById('dropAAAA'),
            //    'strMaNhomLop': edu.util.getValById('txtAAAA'),
            //    'dLaLopHocPhanChinh': 1,
            //    'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            //    'strDaoTao_ChuongTrinh_Id': me.getIdByZone("zoneChuongTrinh"),
            //    'strDangKy_KeHoachDangKy_Id': me.getIdByZone("zoneKeHoach"),
            //    'strDaoTao_HocPhan_Id': me.getIdByZone("zoneDSHocPhan"),
            //    'strNguoiThucHien_Id': edu.system.userId,
            //};
            //for (variable in obj_list) {
            //    addKeyValue(variable, obj_list[variable]);
            //}
        });
    },
    
    
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> ho so tuyen sinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HoSo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTaiChinh_KeHoach_Id': edu.util.getValById('dropSearch_KeHoachTuyenSinh'),
            'strNguoiThucHien_Id': edu.system.userId,
            'dDaNhapHoc': -1,
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
        $("#lblChuyenLopNhapHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChuyenLopNhapHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChuyenLopNhapHoc.getList_HoSo()",
                iDataRow: iPager,
                bFilter: true,
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            sort: true,
            colPos: {
                center: [0,5, 9],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_NGANHNHAPHOC"
                },
                {
                    "mDataProp": "DAOTAO_NGANHTRUNGTUYEN"
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
    

    save_ChuyenNguyenVong: function (strTS_HoSoDuTuyen_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_save = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/ChuyenLop',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLopQuanLy'),
            'strLyDoChuyen': edu.util.getValById('txtLyDoChuyen'),
            'strNguoiThucHien_Id': edu.system.userId,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HoSo();
                });
            },
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
    getList_KeHoach: function () {
        var me = this;
        // Chuyển sang PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (hàm mới BE mới cấp),
        // chỉ lấy kế hoạch đã phân quyền cho user đăng nhập.
        var obj_list = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genCombo_KeHoach(arr, data.Pager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA",
            },
            renderPlace: ["dropSearch_KeHoachTuyenSinh"],
            type: "",
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QLTB"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_QLTB"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
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
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_QLTB"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.QuanLyToanBo;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_QLTB"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_QLTB").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao_QLTB"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.QuanLyToanBo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_QLTB_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_QLTB" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_QLTB").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_QLTB"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QLTB").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaQuanLy_QLTB"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QLTB").val("").trigger("change");
    },
};