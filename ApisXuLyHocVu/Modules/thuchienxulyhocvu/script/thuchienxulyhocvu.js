/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function XuLyHocVu() { };
XuLyHocVu.prototype = {
    dtTrangThai: [],
    strHead: '',
    dtXuLyHocVu: [],
    objHangDoi: {},

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.strHead = $("#tblXuLyHocVu thead").html();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("XLHV.LOAIXULY", "dropSearch_LoaiXuLy");
        edu.system.loadToCombo_DanhMucDuLieu("XLHV.MUCXULY", "dropSearch_MucXuLy");
        $(".btnClose").click(function (e) {
            $("#zone_quanso").slideUp();
        });
        $("#btnPrintQuanSo").click(function (e) {
            edu.util.printHTML_Table("tblQuanSoLop");
        });
        $("#MainContent").delegate("#zonetabkhoanthu", "click", function (e) {
            e.preventDefault();
            me.activeTabFun();
        });

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();

        $("#btnSearch").click(function (e) {
            $("#zone_quanso").slideDown();
            me.arrTrangThai_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            me.getList_XuLyHocVu();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                $("#zone_quanso").slideDown();
                me.arrTrangThai_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
                me.getList_XuLyHocVu();
            }
        });

        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        
        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblXuLyHocVu").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this);
        });
        $("#tblXuLyHocVu").delegate('#chkSelectAll_XuLyHocVu', 'click', function (e) {
            edu.util.checkedAll_BgRow(this, { table_id: "tblXuLyHocVu" });
        });
        $("[id$=chkSelectAll_XuLyHocVu]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblXuLyHocVu" });
        });

        me.objHangDoi = {
            strLoaiNhiemVu: "XET_XULYHOCVU",
            strName: "ThucHienXuLy",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        $("#btnThucHienXuLy").click(function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>thực hiện xử lý</span> không?");
            $("#btnYes").click(function (e) {
                me.TaoHangDoi_ThucHienXuLy();
            });
        });

        $('#dropSearch_SoLuong').on('select2:select', function (e) {
            var iSoLuong = $("#dropSearch_SoLuong").val();
            edu.system.iGioiHanLuong = iSoLuong;
        });

        edu.system.getList_MauImport("zonebtnXLHV", function (addKeyValue) {
            var arrTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            arrTrangThaiNguoiHoc_Id.forEach(e => addKeyValue("strTrangThaiNguoiHoc_Id", e))
            var obj_list = {
                'action': 'XLHV_HangDoi/TaoHangDoi_XLHV_TuDong',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
                'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
                'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
                'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
                'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
                'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
                'strNguoiThucHien_Id': edu.system.userId,
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
                'strXLHV_KeHoachXuLy_Id': edu.util.getValById('dropKeHoachXuLy'),
                'strLoaiXuLy_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    --ULR: Modules
    -------------------------------------------*/
    
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
            'action': 'KHCT_NamNhapHoc/LayDanhSach',
            
            'strNguoiThucHien_Id' : '',
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
        main_doc.XuLyHocVu.dtTrangThai = data;
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MauImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CM_Import_PhanQuyen/LayDanhSach',
            

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.strApp_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
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
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<li><a class="btnBaoCao_LHD" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
        }
        $("#zonebtnBaoCao_LHD").html(row);
        //var obj = {
        //    data: data,
        //    renderInfor: {
        //        id: "MA",
        //        parentId: "",
        //        name: "TEN",
        //        code: "",
        //        avatar: "",
        //        Render: function (nRow, aData) {
        //            return "<option id='" + aData.ID + "' value='" + aData.MAUIMPORT_MA + "' name='" + aData.MAUIMPORT_DUONGDANFILEMAU + "' title='" + aData.CHISODONGDOCDULIEUTUFILE + "'>" + aData.MAUIMPORT_TENFILEMAU + "</option>";
        //        }
        //    },
        //    renderPlace: ["dropMauImport"],
        //    type: "",
        //    title: "Chọn mẫu import",
        //}
        //edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/

    getList_XuLyHocVu: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_KetQuaXuLy/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strXLHV_KeHoachXuLy_Id': edu.util.getValById('dropKeHoachXuLy'),
            'strLoaiXuLy_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            'strMucXuLy_Id': edu.util.getValById('dropSearch_MucXuLy'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtXuLyHocVu = dtReRult;
                    me.genTable_XuLyHocVu(dtReRult, data.Pager);
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
    getData_XuLyHocVu: function (jsonSV, strTuKhoaXuLy) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_KetQuaXuLy/LayDuLieuTuKhoaKetQuaXuLy',
            'strTuKhoa': strTuKhoaXuLy,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': jsonSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': jsonSV.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_ChuongTrinh_Id': jsonSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_ThoiGianDaoTao_Id': jsonSV.DAOTAO_THOIGIANDAOTAO_ID,
            'strXLHV_KeHoachXuLy_Id': jsonSV.XLHV_KEHOACHXULY_ID,
            'strLoaiXuLy_Id': jsonSV.LOAIXULY_ID,
            'strMucXuLy_Id': jsonSV.MUCXULY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        $("#lbl" + jsonSV.ID + "_" + strTuKhoaXuLy).html(dtReRult[i].KETQUA);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
                //edu.system.start_Progress("divprogessquanso", me.endGetQuanSo);
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetQuanSo);
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_KeHoachXuLy/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_KeHoachXuLy(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genCombo_KeHoachXuLy: function (data) {
        var me = this;
        console.log(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKeHoachXuLy"],
            title: "Chọn kế hoạch xử lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_XuLyHocVu: function (data, iPager) {
        var me = this;
        $("#tblXuLyHocVu thead").html(me.strHead);
        var row = '';
        for (var i = 0; i < data.rsCotThongSoXuLy.length; i++) {
            row += '<th class="td-center">' + data.rsCotThongSoXuLy[i].TENTUKHOA +'</th>';
        }
        //$("#lblThongSo").attr("colspan", data.rsCotThongSoXuLy.length);
        if (data.rsCotThongSoXuLy.length == 0) {
            $("#lblThongSo").hide();
        } else {
            $("#lblThongSo").attr("colspan", data.rsCotThongSoXuLy.length);
        }
        $("#tblXuLyHocVu thead tr:eq(1)").append(row);
        $("#tblXuLyHocVu thead tr:eq(0)").append('<th rowspan="2" class="td-center td-fixed" > <input type="checkbox" id="chkSelectAll_XuLyHocVu"></th>');

        var jsonForm = {
            strTable_Id: "tblXuLyHocVu",

            bPaginate: {
                strFuntionName: "main_doc.XuLyHocVu.getList_XuLyHocVu()",
                iDataRow: iPager,
            },
            aaData: data.rsThongTinNguoiHoc,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "QLSV_NGUOIHOC_MASO",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",
                },
                {
                    "mDataProp": "MUCXULY_TEN"
                },
                {
                    "mDataProp": "XLHV_KEHOACHXULY_TEN",
                }
            ]
        };
        for (var i = 0; i < data.rsCotThongSoXuLy.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    return '<span id="lbl' + aData.ID + '_' + main_doc.XuLyHocVu.dtXuLyHocVu.rsCotThongSoXuLy[edu.system.icolumn++].TUKHOA + '"> </span>';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
            }
        });
        jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.rsThongTinNguoiHoc.length; i++) {
            for (var j = 0; j < data.rsCotThongSoXuLy.length; j++) {
                me.getData_XuLyHocVu(data.rsThongTinNguoiHoc[i], data.rsCotThongSoXuLy[j].TUKHOA);
            }
        }
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> 
    --Author: vanhiep
	-------------------------------------------*/
    report: function (strLoaiBaoCao) {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        //

        addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
        addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"));
        addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao_IHD"));
        addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"));
        addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"));
        addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop_IHD"));
        addKeyValue("strNamNhapHoc", edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"));
        addKeyValue("strTrangThaiNguoiHoc_Id", me.arrTrangThai_Id.toString());
        addKeyValue("strTrangThaiNguoiHoc_Ten", me.arrTrangThai_Ten.toString());
        addKeyValue("strTinhDenNgay", edu.util.getValById("txtSearch_TuNgay_IHD"));

        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiThucHien_Id", edu.system.userId);


        var obj_save = {
            'arrTuKhoa': arrTuKhoa,
            'arrDuLieu': arrDuLieu,
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi_ThucHienXuLy: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_HangDoi/TaoHangDoi_XLHV_TuDong',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strXLHV_KeHoachXuLy_Id': edu.util.getValById('dropKeHoachXuLy'),
            'strLoaiXuLy_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: obj_save.action + ": " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                var obj = {
                    content: obj_save.action + " (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
        var me = main_doc.XuLyHocVu;
        //me.getList_KetQua();
    },
}