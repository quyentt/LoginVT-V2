/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function PhanQuyenDiemLQL() { };
PhanQuyenDiemLQL.prototype = {
    arrHead_Id: [],
    dtNguoiDung: [],
    dtHanhDongTheo: [],
    dtThanhPhanDiem: [],
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDANHSACH", "dropSearch_LoaiDanhSach");
        $("#dropSearch_ChucNangPhanQuyenDiemLQL").on("select2:select", function () {
            me.getList_HanhDongTheo();
            me.getList_HS();
        });
        $("#btnSearch").click(function () {
            me.getList_NguoiDungTheoChucNang();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDungTheoChucNang();
            }
        });
        $("#tblViewCauTrucPhanQuyenDiemLQL").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            console.log(strClass);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblViewCauTrucPhanQuyenDiemLQL").delegate("#chkSelectAllTable", "click", function (e) {
            var checked_status = $(this).is(':checked');
            $("#tblViewCauTrucPhanQuyenDiemLQL tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        $("#btnPhanQuyenDiemLQL").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblViewCauTrucPhanQuyenDiemLQL .checkPhanQuyenDiemLQL");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm x * " + arrThem.length + " và hủy quyền x * " + arrXoa.length + "?");
                var html = '';
                html += '<div class="col-sm-12">';
                html += '<div class="col-sm-4" style="overflow: hidden; height: 30px">Quyền</div><div class="col-sm-8"><select multiple="multiple" id="dropQuyenThietLap" class="select-opt"></select></div>';
                html += '<div class="col-sm-4" style="overflow: hidden; height: 30px">Thành phần</div><div class="col-sm-8"><select multiple="multiple" id="dropThanhPhanDiem" class="select-opt"></select></div>';
                html += '</div>';
                edu.system.alert(html);
                me.genComboById_HanhDongTheo("dropQuyenThietLap", edu.util.getValById("dropSearch_QuyenThietLap"));
                me.genComboById_ThanhPhanDiem("dropThanhPhanDiem", edu.util.getValById("dropSearch_ThanhPhanDiem"));
                $("#btnYes").click(function (e) {
                    var arrQuyen_Id = $("#dropQuyenThietLap").val();
                    var arrHanhDong_Id = $("#dropThanhPhanDiem").val();
                    edu.system.genHTML_Progress("divprogessPhanQuyenDiemLQL", arrQuyen_Id.length * arrHanhDong_Id.length * (arrThem.length + arrXoa.length));
                    for (var i = 0; i < arrThem.length; i++) {
                        for (var j = 0; j < arrQuyen_Id.length; j++) {
                            for (var k = 0; k < arrHanhDong_Id.length; k++) {
                                me.save_PhanQuyenDiemLQL(arrThem[i], arrQuyen_Id[j], arrHanhDong_Id[k]);
                            }
                        }
                        
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        for (var j = 0; j < arrQuyen_Id.length; j++) {
                            for (var k = 0; k < arrHanhDong_Id.length; k++) {
                                me.delete_PhanQuyenDiemLQL(arrXoa[i], arrQuyen_Id[j], arrHanhDong_Id[k]);
                            }
                        }

                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi để phân quyền");
            }
        });

        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_HocPhan();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
            me.getList_HocPhan();
        });
        $('#dropSearch_NguoiThu_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
            me.getList_HocPhan();
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {
            
            me.getList_HocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_HocKy_IHD').on('select2:select', function (e) {
            me.getList_HocPhan();
        });
        $("#zonebatdau").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });

        $("#btnTaoTuDong").click(function () {
            me.save_TaoTuDong();
        });

        $("#dropSearch_DonVi").on("select2:select", function () {
            me.getList_HS();
            me.getList_HocPhan();
        });

        $("#btnTaoCache").click(function () {
            if (edu.util.getValById("dropSearch_ThanhVien") != "")
                me.save_TaoCache(edu.util.getValById("dropSearch_ThanhVien"));
            else {
                me.getList_TaoCache_NguoiDung();
            }
        });
    },
    page_load: function () {
        var me = this;
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_ChucNangCanPhanQuyenDiemLQL();
        me.getList_ThanhPhanDiem();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDANHSACH", "dropSearch_LoaiDanhSach");
        me.getList_CCTC();
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
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
        //--Edit
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSNamNhapHoc',

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
            renderPlace: ["dropSearch_HeDaoTao_IHD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_IHD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_IHD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_IHD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_IHD").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.PhanQuyenDiemLQL.dtNguoiDung = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSHocPhanCauTrucDiemTheoLQL',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropAAAA'),
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_HocPhan(data.Data, data.Pager);

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
    genCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_ThanhPhanDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_ThongTin/LayDSDiem_ThanhPhanDiem',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strThangDiem_Id': edu.util.getValById('dropAAAA'),
            'dLaThanhPhanDiemCuoi': -1,
            'strQuyTacLamTron_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_ThanhPhanDiem(data.Data, data.Pager);

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
    genCombo_ThanhPhanDiem: function (data) {
        var me = this;
        me.dtThanhPhanDiem = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DIEM_THAMSOHOCTAPCHUNG_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_ThanhPhanDiem"],
            title: "Chọn thành phần điểm"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComboById_ThanhPhanDiem: function (strId, default_val) {
        var me = this;
        var obj = {
            data: me.dtThanhPhanDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MA",
                code: "MA",
                order: "unorder",
                default_val: default_val
            },
            renderPlace: [strId],
            title: "Chọn thành phần điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strId).select2();
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_HanhDongTheo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSHanhDongTheo',
            'strUngDung_Id': edu.system.appId,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenDiemLQL"),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_HanhDongTheo(data.Data, data.Pager);

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
    genCombo_HanhDongTheo: function (data) {
        var me = this;
        me.dtHanhDongTheo = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HANHDONG_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_QuyenThietLap"],
            title: "Chọn quyền cần thiết lập"
        };
        edu.system.loadToCombo_data(obj);
    },
    genComboById_HanhDongTheo: function (strId, default_val) {
        var me = this;
        var obj = {
            data: me.dtHanhDongTheo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HANHDONG_TEN",
                code: "MA",
                order: "unorder",
                default_val: default_val
            },
            renderPlace: [strId],
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strId).select2();
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_ChucNangCanPhanQuyenDiemLQL: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSChucNangCanPhanQuyen',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.appId,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_ChucNangCanPhanQuyenDiemLQL(data.Data, data.Pager);

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
    genCombo_ChucNangCanPhanQuyenDiemLQL: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "PHANQUYEN_CHUCNANG_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_ChucNangPhanQuyenDiemLQL"],
            title: "Chọn chức năng phân quyền"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_NguoiDungTheoChucNang: function () {
        var me = this;
        //--Edit\
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenDiemLQL"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strNguoiDung_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDung = data.Data;
                    me.genData_NguoiDungTheoChucNang(data.Data, data.Pager);
                    //me.genComBo_HS();
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
    genData_NguoiDungTheoChucNang: function (data) {
        var me = this;
        var html = '<tr><th id="lblThongTinBang" class="td-center">Thông tin lớp học phần được thiết lập quyền ' + $("#dropSearch_QuyenThietLap option:selected").text() + '</th>';
        
        for (var i = 0; i < data.length; i++) {
            html += '<th class="td-center">' + data[i].FULLNAME + " - " + data[i].NAME + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data[i].ID + '"></th>';
        }
        html += '<th class="td-center">Tất cả <input type="checkbox" id="chkSelectAllTable"></th>';
        html += '</tr>';
        $("#tblViewCauTrucPhanQuyenDiemLQL thead").html(html);
        me.getList_CauTrucPhanQuyenDiemLQL();
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/

    getList_CauTrucPhanQuyenDiemLQL: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSCauTrucDiemTheoLQL',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenDiemLQL'),
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy_IHD'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrHead_Id = me.insertHeaderTable("tblViewCauTrucPhanQuyenDiemLQL", dtReRult, null);
                    me.dtCauTrucPhanQuyenDiemLQL = dtReRult;
                    me.genTable_CauTrucPhanQuyenDiemLQL();
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THANHPHAN_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        document.getElementById("lblThongTinBang").colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        //rowspan = rowTheadOfTable - colspan
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && x[i].cells[j].colSpan != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.THANHPHAN_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].THANHPHAN_ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }

        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            if (colspan == 0) {
                arrHeaderId.push(objHead.THANHPHAN_ID);
                $("#" + strTable_Id + " tbody").append('<tr><td colspan="' + (iThuTu + 1) + '">' + objHead.THANHPHAN_TEN + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td rowspan="' + colspan + '" >' + objHead.THANHPHAN_TEN + '</td>');
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THANHPHAN_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    genTable_CauTrucPhanQuyenDiemLQL: function (data, iPager) {
        var me = this;
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            var x = $("#tblViewCauTrucPhanQuyenDiemLQL tbody tr");
            for (var j = 0; j < me.dtNguoiDung.length; j++) {
                $(x[i]).append('<td style="text-align: center"><input type="checkbox" class="check' + me.dtNguoiDung[j].ID + ' check' + me.arrHead_Id[i] + ' checkPhanQuyenDiemLQL poiter" id="chkSelect' + me.arrHead_Id[i] + '_' + me.dtNguoiDung[j].ID +'"></td>');
            }
            $(x[i]).append('<td style="text-align: center"><input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + me.arrHead_Id[i] + '"></td>');
        }
        edu.system.genHTML_Progress("divprogessPhanQuyenDiemLQL", me.arrHead_Id.length);
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            me.getData_CauTrucPhanQuyenDiemLQL(me.arrHead_Id[i]);
        }
    },

    getData_CauTrucPhanQuyenDiemLQL: function (strDiem_DanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSQuyenDiemTheoLQL',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenDiemLQL'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSach_Id': strDiem_DanhSach_Id,
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_ThanhPhanDiem'),
            'strHanhDong_Id': edu.util.getValById('dropSearch_QuyenThietLap'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].QUYEN == 1) {
                            var check = $("#chkSelect" + strDiem_DanhSach_Id + "_" + dtReRult[i].ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].QUYEN_ID);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
                edu.system.start_Progress("divprogessPhanQuyenDiemLQL", me.endGetPhanQuyenDiemLQL);
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessPhanQuyenDiemLQL", me.endGetPhanQuyenDiemLQL);
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    endGetPhanQuyenDiemLQL: function () {
        var me = main_doc.PhanQuyenDiemLQL;
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop hoc
    ----------------------------------------------*/
    save_PhanQuyenDiemLQL: function (point, strQuyen_Id, strHanhDong_Id) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strToHopBoDuLieuQuyen = arrId[0].substring(9) + strHanhDong_Id;
        var strNguoiDung_Id = arrId[1];
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyenDuLieu/Them_PhanQuyen_DuLieu',
            'strId': '',
            'dHieuLuc': 1,
            'strLoaiQuyen_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenDiemLQL'),
            'strNgayBatDau': edu.util.getValById('txtAAAA'),
            'strNgayKetThuc': edu.util.getValById('txtAAAA'),
            'strHanhDong_Id': strQuyen_Id,
            'strUngDung_Id': edu.system.appId,
            'strToHopBoDuLieuQuyen': strToHopBoDuLieuQuyen,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strMoTa': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân quyền thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
                edu.system.start_Progress("divprogessPhanQuyenDiemLQL", me.endGetPhanQuyenDiemLQL2);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
                edu.system.start_Progress("divprogessPhanQuyenDiemLQL", me.endGetPhanQuyenDiemLQL2);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanQuyenDiemLQL: function (point, strQuyen_Id, strHanhDong_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strToHopBoDuLieuQuyen = arrId[0].substring(9) + strHanhDong_Id;
        var strNguoiDung_Id = arrId[1];
        var obj_delete = {
            'action': 'CMS_PhanQuyenDuLieu/Xoa_PhanQuyen_DuLieu',
            'strLoaiQuyen_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenDiemLQL'),
            'strHanhDong_Id': strQuyen_Id,
            'strUngDung_Id': edu.system.appId,
            'strToHopBoDuLieuQuyen': strToHopBoDuLieuQuyen,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa quyền thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                edu.system.start_Progress("divprogessPhanQuyenDiemLQL", me.endGetPhanQuyenDiemLQL2);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
                edu.system.start_Progress("divprogessPhanQuyenDiemLQL", me.endGetPhanQuyenDiemLQL2);
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endGetPhanQuyenDiemLQL2: function () {
        var me = main_doc.PhanQuyenDiemLQL;
        me.getList_NguoiDungTheoChucNang();
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop hoc
    ----------------------------------------------*/
    save_TaoTuDong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyenDuLieu/TaoTuDongDSLopHocPhanLanDau',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy_IHD'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strCachLayChuongTrinh': edu.util.getValById('dropSearch_CachLayChuongTrinh'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenDiemLQL'),
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tạo tự động thành công");
                }
                else{
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CCTC: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function (strDefaultVal) {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenDiemLQL"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, strDefaultVal);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data, default_val) {
        if (default_val === undefined) default_val = "";
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.HINHDAIDIEN) + "'class='table-img' value='" + aData.ID + "'>" + aData.FULLNAME + " - " + edu.util.returnEmpty(aData.NAME) + "</option>";
                },
                default_val: default_val
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop hoc
    ----------------------------------------------*/
    save_TaoCache: function (strNguoiDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_Cache/TaoCache_NhapDiemTheoDanhSach',
            'type': 'POST',
            'strChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenDiemLQL"),
            'strNguoiDung_Id': strNguoiDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tạo cache thành công");
                }
                else {
                    edu.system.alert(data.Message);
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
    getList_TaoCache_NguoiDung: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'D_Cache/LayDanhSach',
            'type': 'GET',
            'strChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenDiemLQL"),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data.Data.forEach(e => me.save_TaoCache(e.NGUOIDUNG_ID));
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
};
