/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function PhanQuyenCBNHSSV() { };
PhanQuyenCBNHSSV.prototype = {
    arrHead_Id: [],
    dtNguoiDung: [],
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#dropSearch_ChucNangPhanQuyen").on("select2:select", function () {
            me.getList_HanhDongTheo();
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
        $("#tblViewCauTrucPhanQuyenCBNHSSV").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblViewCauTrucPhanQuyenCBNHSSV").delegate("#chkSelectAllTable", "click", function (e) {
            var checked_status = $(this).is(':checked');
            $("#tblViewCauTrucPhanQuyenCBNHSSV tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        $("#btnPhanQuyenCBNHSSV").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblViewCauTrucPhanQuyenCBNHSSV .checkPhanQuyenCBNHSSV");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push($(x[i]).attr("name"));
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy quyền " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.genHTML_Progress("divprogessPhanQuyenCBNHSSV", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_PhanQuyenCBNHSSV(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_PhanQuyenCBNHSSV(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi để phân quyền");
            }
        });

        $("#btnSave_PhanQuyenMoRong").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblViewCauTrucPhanQuyenCBNHSSV .checkPhanQuyenCBNHSSV");
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
                $("#myModalPhanQuyen").modal("hide");
                var arrHanhDong = $("#dropSearch_QuyenThietLapMoRong").val();
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanQuyenMoRong", "checkX");
                let iCountThem = arrHanhDong.length * arrChecked_Id.length * arrThem.length;
                let iCountXoa = arrHanhDong.length * arrChecked_Id.length * arrXoa.length;
                edu.system.confirm("Bạn có chắc chắn thêm " + iCountThem + " và hủy quyền " + iCountXoa + "?");
                $("#btnYes").click(function (e) {
                    edu.system.genHTML_Progress("divprogessPhanQuyenCBNHSSV", iCountThem + iCountXoa);
                    arrHanhDong.forEach(e => {
                        arrChecked_Id.forEach(ele => {
                            for (var i = 0; i < arrThem.length; i++) {
                                me.save_PhanQuyenCBNHSSVMoRong(arrThem[i], ele, e);
                            }
                            for (var i = 0; i < arrXoa.length; i++) {
                                me.delete_PhanQuyenCBNHSSVMoRong(arrXoa[i], ele, e);
                            }
                        })
                    })


                });
            }
            else {
                edu.system.alert("Không có thay đổi để phân quyền");
            }
        });

        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
            me.getList_TruongThongTin();
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.getList_TruongThongTin();
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

        $("#zonebatdau").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });

        $("#btnPhanQuyenMoRong").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblViewCauTrucPhanQuyenCBNHSSV .checkPhanQuyenCBNHSSV");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push($(x[i]).attr("name"));
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                $("#myModalPhanQuyen").modal("show");
            }
            else {
                edu.system.alert("Không có thay đổi để phân quyền");
            }
        });

    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ChucNangCanPhanQuyenCBNHSSV();
        me.getList_TruongThongTin();
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRUONGTHONGTIN", "dropSearch_TruongThongTin", "", data => {
        //    var jsonForm = {
        //        strTable_Id: "tblPhanQuyenMoRong",
        //        aaData: data,
        //        colPos: {
        //            center: [0, 2],
        //        },
        //        aoColumns: [
        //            {
        //                "mDataProp": "TEN",
        //            }
        //            , {
        //                "mRender": function (nRow, aData) {
        //                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
        //                }
        //            }
        //        ]
        //    };
        //    edu.system.loadToTable_data(jsonForm);
        //});
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
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
        main_doc.PhanQuyenCBNHSSV.dtNguoiDung = data;
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
    getList_HanhDongTheo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSHanhDongTheo',
            'strUngDung_Id': edu.system.appId,
            'strPhanQuyenCBNHSSV_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyen"),
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
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HANHDONG_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_QuyenThietLap", "dropSearch_QuyenThietLapMoRong"],
            title: "Chọn quyền cần thiết lập"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_ChucNangCanPhanQuyenCBNHSSV: function () {
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
                    me.genCombo_ChucNangCanPhanQuyenCBNHSSV(data.Data, data.Pager);

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
    genCombo_ChucNangCanPhanQuyenCBNHSSV: function (data) {
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
            renderPlace: ["dropSearch_ChucNangPhanQuyen"],
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
            'strPhanQuyen_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyen"),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDung = data.Data;
                    me.genData_NguoiDungTheoChucNang(data.Data, data.Pager);
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
        var me = main_doc.PhanQuyenCBNHSSV;
        var html = '<tr><th id="lblThongTinBang" class="td-center">Thông tin lớp được thiết lập quyền ' + $("#dropSearch_QuyenThietLap option:selected").text() + '</th>';

        for (var i = 0; i < data.length; i++) {
            html += '<th class="td-center">' + data[i].FULLNAME + " - " + data[i].NAME + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data[i].ID + '"></th>';
        }
        html += '<th class="td-center">Tất cả <input type="checkbox" id="chkSelectAllTable"></th>';
        html += '</tr>';
        $("#tblViewCauTrucPhanQuyenCBNHSSV thead").html(html);
        me.getList_CauTrucPhanQuyenCBNHSSV();
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/

    getList_CauTrucPhanQuyenCBNHSSV: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSCauTrucQuyenCBNhapHoSoSV',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyen'),
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_Lop_IHD"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrHead_Id = me.insertHeaderTable("tblViewCauTrucPhanQuyenCBNHSSV", dtReRult, null);
                    me.dtCauTrucPhanQuyenCBNHSSV = dtReRult;
                    me.genTable_CauTrucPhanQuyenCBNHSSV();
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
    genTable_CauTrucPhanQuyenCBNHSSV: function (data, iPager) {
        var me = this;
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            var x = $("#tblViewCauTrucPhanQuyenCBNHSSV tbody tr");
            for (var j = 0; j < me.dtNguoiDung.length; j++) {
                $(x[i]).append('<td style="text-align: center"><input type="checkbox" class="check' + me.dtNguoiDung[j].ID + ' check' + me.arrHead_Id[i] + ' checkPhanQuyenCBNHSSV poiter" id="chkSelect' + me.arrHead_Id[i] + '_' + me.dtNguoiDung[j].ID + '"></td>');
            }
            $(x[i]).append('<td style="text-align: center"><input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + me.arrHead_Id[i] + '"></td>');
        }
        edu.system.genHTML_Progress("divprogessPhanQuyenCBNHSSV", me.arrHead_Id.length);
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            me.getData_CauTrucPhanQuyenCBNHSSV(me.arrHead_Id[i]);
        }
    },

    getData_CauTrucPhanQuyenCBNHSSV: function (strDaoTaoLopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyenDuLieu/LayDSQuyenNhanSuNhapHoSoSV',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyen'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTaoLopQuanLy_Id': strDaoTaoLopQuanLy_Id,
            'strTruongThongTin_Id': edu.util.getValById('dropSearch_TruongThongTin'),
            'strHanhDong_Id': edu.util.getValById('dropSearch_QuyenThietLap'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].QUYEN == 1) {
                            var check = $("#chkSelect" + strDaoTaoLopQuanLy_Id + "_" + dtReRult[i].ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].QUYEN_ID);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV);
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    endGetPhanQuyenCBNHSSV: function () {
        var me = main_doc.PhanQuyenCBNHSSV;
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop hoc
    ----------------------------------------------*/
    save_PhanQuyenCBNHSSV: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strToHopBoDuLieuQuyen = arrId[0].substring(9);
        var strNguoiDung_Id = arrId[1];
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyenDuLieu/Them_PhanQuyen_DuLieu',
            'strId': '',
            'dHieuLuc': 1,
            'strLoaiQuyen_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyen'),
            'strNgayBatDau': edu.util.getValById('txtAAAA'),
            'strNgayKetThuc': edu.util.getValById('txtAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropSearch_QuyenThietLap'),
            'strUngDung_Id': edu.system.appId,
            'strToHopBoDuLieuQuyen': strToHopBoDuLieuQuyen + edu.util.getValById('dropSearch_TruongThongTin'),
            'strNguoiDung_Id': strNguoiDung_Id,
            'strMoTa': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
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

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_PhanQuyenCBNHSSVMoRong: function (point, strTruongThongTin, strHanhDong_Id) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strToHopBoDuLieuQuyen = arrId[0].substring(9);
        var strNguoiDung_Id = arrId[1];
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyenDuLieu/Them_PhanQuyen_DuLieu',
            'strId': '',
            'dHieuLuc': 1,
            'strLoaiQuyen_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyen'),
            'strNgayBatDau': edu.util.getValById('txtAAAA'),
            'strNgayKetThuc': edu.util.getValById('txtAAAA'),
            'strHanhDong_Id': strHanhDong_Id,
            'strUngDung_Id': edu.system.appId,
            'strToHopBoDuLieuQuyen': strToHopBoDuLieuQuyen + strTruongThongTin,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strMoTa': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
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

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanQuyenCBNHSSV: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'CMS_PhanQuyenDuLieu/Xoa_PhanQuyen_DuLieu1',
            'strIds': strId,
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

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_PhanQuyenCBNHSSVMoRong: function (point, strTruongThongTin, strHanhDong_Id) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strToHopBoDuLieuQuyen = arrId[0].substring(9);
        var strNguoiDung_Id = arrId[1];
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'CMS_PhanQuyenDuLieu_MH/GS4gHhEpIC8QNDgkLx4FNA0oJDQP',
            'func': 'pkg_chung_phanquyendulieu.Xoa_PhanQuyen_DuLieu',
            'iM': edu.system.iM,
            'strLoaiQuyen_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyen'),
            'strHanhDong_Id': strHanhDong_Id,
            'strToHopBoDuLieuQuyen': strToHopBoDuLieuQuyen + strTruongThongTin,
            'strNguoiDung_Id': strNguoiDung_Id,
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

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            error: function (er) {

                edu.system.start_Progress("divprogessPhanQuyenCBNHSSV", me.endGetPhanQuyenCBNHSSV2);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endGetPhanQuyenCBNHSSV2: function () {
        var me = main_doc.PhanQuyenCBNHSSV;
        me.getList_NguoiDungTheoChucNang();
    },


    getList_TruongThongTin: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/DSA4BRIVMzQuLyYVKS4vJhUoLxUpJC4RKSAsFygP',
            'func': 'pkg_hosohocvien_quyen.LayDSTruongThongTinTheoPhamVi',
            'iM': edu.system.iM,
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropSearch_HeDaoTao_IHD'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropSearch_KhoaDaoTao_IHD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_TruongThongTin(data);
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
    genCombo_TruongThongTin: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_TruongThongTin"],
            title: "Chọn trường thông tin"
        };
        edu.system.loadToCombo_data(obj);
        var jsonForm = {
            strTable_Id: "tblPhanQuyenMoRong",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [{
                "mDataProp": "NHOM",
            }
                ,
            {
                "mDataProp": "TEN",
            }
                , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.actionRowSpan(jsonForm.strTable_Id, [1]);
    },
};
