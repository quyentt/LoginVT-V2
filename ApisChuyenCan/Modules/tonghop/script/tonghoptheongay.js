/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TongHopTheoNgay() { };
TongHopTheoNgay.prototype = {
    dtTrangThai: [],
    arrHead_Id: [],
    iMaxLength: 0,
    arrTrangThai_Id: [],
    arrTrangThai_Ten: [],
    strHead: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.strHead = $("#tblTongHopTheoNgay thead").html();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "dropSearch_KieuChuyenCan_IHD");
        $(".btnClose").click(function (e) {
            $("#zone_tonghoptheongay").slideUp();
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
        //me.getList_TongHopTheoNgay();

        $("#btnSearch").click(function (e) {
            $("#zone_tonghoptheongay").slideDown();
            me.getList_TongHopTheoNgay();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                $("#zone_tonghoptheongay").slideDown();
                me.getList_TongHopTheoNgay();
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
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {
           
            var checked_status = this.checked;
            $(".ckbLKT_IHD").each(function () {
                this.checked = checked_status;
            });
        });


        $("#tblTongHopTheoNgay").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this);
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_TongHopTheoNgay", function (addKeyValue) {
            main_doc.TongHopTheoNgay.arrTrangThai_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD');
            main_doc.TongHopTheoNgay.genHeader_TongHopTheoNgay();
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
            addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"));
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao_IHD"));
            addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"));
            addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"));
            addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop_IHD"));
            addKeyValue("strNamNhapHoc", edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"));
            addKeyValue("strTrangThaiNguoiHoc_Id", edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString());
            addKeyValue("strTuNgay", edu.util.getValById("txtSearch_TuNgay_IHD"));
            addKeyValue("strDenNgay", edu.util.getValById("txtSearch_DenNgay_IHD"));
            addKeyValue("strKieuChuyenCan_Id", edu.util.getValById("dropSearch_KieuChuyenCan_IHD"));
            addKeyValue("strDiem_DanhSachHoc_Id", edu.util.getValById("txtSearch_TuNgay_IHD"));
        });
        $("#btnSaveChuyenCan").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblTongHopTheoNgay .checkChuyenCan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    } else {
                        var inputcheck = $("#" + x[i].id.replace("chkSelect", "input_"));
                        if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_TongHopTheoNgay(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_TongHopTheoNgay(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });
        $("#btnKhoiTao").click(function () {
            me.khoiTao_TongHopTheoNgay();
        });


        $("#tblTongHopTheoNgay").delegate(".chkSelectAll", "click", function (e) {
           
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".checkNgay" + strClass).each(function () {
                this.checked = checked_status;
            });
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
            'action': 'KHCT_ThongTin/LayDSNamNhapHoc',
            
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
        main_doc.TongHopTheoNgay.dtTrangThai = data;
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
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TongHopTheoNgay: function (strDanhSach_Id) {
        var me = main_doc.TongHopTheoNgay;
        //--Edit
        var obj_list = {
            'action': 'XLHV_CC_ThongTin_MH/DSA4ChAQDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP',
            'func': 'PKG_CHUYENCAN_THONGTIN.LayKQQLSV_NguoiHoc_ChuyenCan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strDiem_DanhSachHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTongHopTheoNgay = dtReRult;
                    me.genTable_TongHopTheoNgay(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getData_TongHopTheoNgay: function (jsonSV, strNgay_ID, strNgay) {
        var me = main_doc.TongHopTheoNgay;
        //--Edit
        var obj_list = {
            'action': 'XLHV_CC_ThongTin_MH/DSA4CiQ1EDQgAik0OCQvAiAvFSkkLg8mIDgP',
            'func': 'PKG_CHUYENCAN_THONGTIN.LayKetQuaChuyenCanTheoNgay',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgay_Gio_Phut_Giay_Id': strNgay_ID,
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strQLSV_NguoiHoc_Id': jsonSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': jsonSV.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': jsonSV.DAOTAO_CHUONGTRINH_ID,
            'strDiem_DanhSachHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + jsonSV.ID + "_" + strNgay_ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].GIATRI);

                            var inputCheck = $("#input_" + jsonSV.ID + "_" + strNgay_ID);
                            inputCheck.val(dtReRult[i].SOLUONG);
                            inputCheck.attr("name", dtReRult[i].SOLUONG);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'POST',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_TongHopTheoNgay: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtTongHopTheoNgay.rs, "ID");
        var strNgay = $(point).attr("title");
        //--Edit
        var obj_save = {
            'action': 'XLHV_CC_ThongTin_MH/FSkkLB4QDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP',
            'func': 'PKG_CHUYENCAN_THONGTIN.Them_QLSV_NguoiHoc_ChuyenCan',
            'iM': edu.system.iM,
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': objSV.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_CHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strDiem_DanhSach_Id': me.strDanhSachHoc_Id,
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strNgayGhiNhan': strNgay,
            'dGio': edu.util.getValById('txtAAAA'),
            'dPhut': edu.util.getValById('txtAAAA'),
            'dGiay': edu.util.getValById('txtAAAA'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TongHopTheoNgay: function (point) {
        var me = this;
        //--Edit
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtTongHopTheoNgay.rs, "ID");
        var strNgay = $(point).attr("title");
        var obj_delete = {
            'action': 'XLHV_CC_ThongTin_MH/GS4gHhANEhceDyY0LigJLiIeAik0OCQvAiAvcAPP',
            'func': 'PKG_CHUYENCAN_THONGTIN.Xoa_QLSV_NguoiHoc_ChuyenCan1',
            'iM': edu.system.iM,
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': objSV.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_CHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strDiem_DanhSach_Id': edu.util.getValById('dropAAAA'),
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strNgay_Gio_Phut_Giay_Id': arrId[1],
            'strNgayGhiNhan': strNgay,
            'dGio': edu.util.getValById('txtAAAA'),
            'dPhut': edu.util.getValById('txtAAAA'),
            'dGiay': edu.util.getValById('txtAAAA'),


            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayGhiNhan': edu.system.getValById('txtAAAA'),
            'dGio': edu.system.getValById('txtAAAA'),
            'dPhut': edu.system.getValById('txtAAAA'),
            'dGiay': edu.system.getValById('txtAAAA'),
            'strKieuChuyenCan_Id': edu.system.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_LopQuanLy_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropAAAA'),
            'strDiem_DanhSachHoc_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
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

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    khoiTao_TongHopTheoNgay: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_CC_ThongTin_MH/CikuKBUgLh4PJiA4HgIpNDgkLwIgLwPP',
            'func': 'PKG_CHUYENCAN_THONGTIN.KhoiTao_Ngay_ChuyenCan',
            'iM': edu.system.iM,
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNgay': edu.util.getValById('txtSearch_TuNgay_KhoiTao'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strDiem_DanhSachHoc_Id': edu.util.getValById('dropAAAA'),

            'dGio': 0,
            'dPhut': 0,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Khởi tạo thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
;
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_TongHopTheoNgay: function (data, iPager) {
        var me = main_doc.TongHopTheoNgay;
        $("#tblTongHopTheoNgay thead").html(me.strHead);
        var row = '';
        for (var i = 0; i < data.rsNgay.length; i++) {
            row += '<th class="td-center">' + data.rsNgay[i].NGAYGHINHAN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data.rsNgay[i].ID + '"></th>';
        }
        row += '<th class="td-center td-fixed">Tổng</th>';
        $("#tblTongHopTheoNgay thead tr:eq(0)").append(row);

        var jsonForm = {
            strTable_Id: "tblTongHopTheoNgay",

            bPaginate: {
                strFuntionName: "main_doc.TongHopTheoNgay.getList_TongHopTheoNgay()",
                iDataRow: iPager,
            },
            aaData: data.rs,
            colPos: {
                center: [0, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOADAOTAO_TEN",
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
            ]
        };
        for (var i = 0; i < data.rsNgay.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.ID + ' checkNgay' + main_doc.TongHopTheoNgay.dtTongHopTheoNgay.rsNgay[iThuTu].ID + '" id="chkSelect' + aData.ID + '_' + main_doc.TongHopTheoNgay.dtTongHopTheoNgay.rsNgay[iThuTu].ID + '" title="' + main_doc.TongHopTheoNgay.dtTongHopTheoNgay.rsNgay[iThuTu].NGAYGHINHAN + '" />'
                        + '<input style="width: 60%; float: right" id="input_' + aData.ID + '_' + main_doc.TongHopTheoNgay.dtTongHopTheoNgay.rsNgay[iThuTu].ID + '" />';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<span id="lblSumSV' + aData.ID +'"></span>';
            }
        });
        jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        edu.system.loadToTable_data(jsonForm);
        edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        for (var i = 0; i < data.rs.length; i++) {
            for (var j = 0; j < data.rsNgay.length; j++) {
                me.getData_TongHopTheoNgay(data.rs[i], data.rsNgay[j].ID, data.rsNgay[j].NGAYGHINHAN);
            }
        }
    },
    endGetData: function () {
        var me = main_doc.TongHopTheoNgay;
        console.log("đã vào");
        var iSumTong = 0;
        for (var i = 0; i < me.dtTongHopTheoNgay.rs.length; i++) {
            if (me.dtTongHopTheoNgay.rs[i] != undefined) {
                var iSumSV = 0;
                var strSinhVien_Id = me.dtTongHopTheoNgay.rs[i].ID;
                var x = $(".checkSV" + strSinhVien_Id);
                for (var j = 0; j < x.length; j++) {
                    if ($(x[j]).is(':checked')) {
                        iSumSV++;
                    }
                }
                $("#lblSumSV" + strSinhVien_Id).html(iSumSV); iSumTong += iSumSV;
            }
        }
        var html ='<tr> <td colspan="9" style="text-align: center">Tổng</td>'
        for (var i = 0; i < me.dtTongHopTheoNgay.rsNgay.length; i++) {
            var iSumNgay = 0;
            var strNgay_Id = me.dtTongHopTheoNgay.rsNgay[i].ID;
            var x = $(".checkNgay" + strNgay_Id);
            for (var j = 0; j < x.length; j++) {
                if ($(x[j]).is(':checked')) {
                    iSumNgay++;
                }
            }
            html += '<td style="text-align: center">' + iSumNgay + '</td>';
        }
        html += '<td style="text-align: center">' + iSumTong + '</td></tr>';
        $("#tblTongHopTheoNgay tfoot").html(html);
    },
    endSetData: function () {
        var me = main_doc.TongHopTheoNgay;
        edu.system.alert("Thực hiện thành công", 'w');
        setTimeout(function () {
            me.getList_TongHopTheoNgay();
        }, 1000);
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
}