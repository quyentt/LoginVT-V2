/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LapDanhSach() { };
LapDanhSach.prototype = {
    dtDoiTuong: [],
    dtSinhVien: [],
    strHead: '',
    objHangDoi: {},

    init: function () {
        var me = this;

        me.strHead = $("#tblKetQua thead").html();
        me.getList_NguoiThu();
        me.getList_TrangThaiSV();

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_KhoaQuanLy();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DANHGIA", "dropSearch_DanhGia");

        $("#btnSearch").click(function (e) {
            
            me.getList_TongHop();
        });

        $("#btnSearchHocPhan").click(function (e) {

            me.getList_HocPhan();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TongHop();
            }
        });
        $(".btnClose").click(function (e) {
            $("#zone_nhap").slideUp();
        });

        $('#dropSearch_HeDaoTao').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_HocKy').on('select2:select', function (e) {
            
            var strValue = $('#dropSearch_HocKy').val();
            if (!(strValue.length > 1 || strValue[0] != "")) {
                $("#dropSearch_KyThucHien").parent().hide();
            } else {
                $("#dropSearch_KyThucHien").parent().show();
            }
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_DMHocPhan();
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_CheDo').on('select2:select', function () {
            me.getList_DoiTuong_CheDo(this);
        });

        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbLKT").each(function () {
                this.checked = checked_status;
            });
        });

        $("#btnSaveChinhSach_PhanTram").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblKetQua tbody input.doituongcheck");
            for (var i = 0; i < x.length; i++) {
                var arrId = x[i].id.split("_");
                var point_PT = $("#txtPhanTram_" + arrId[1] + "_" + arrId[2]);
                if ($(x[i]).val() != edu.util.returnEmpty($(x[i]).attr("title")) || point_PT.val() != edu.util.returnEmpty(point_PT.attr("title"))) {
                    if ($(x[i]).val() == "" && point_PT.val() == "") {
                        if (edu.util.checkValue($(x[i]).attr("name"))) arrXoa.push($(x[i]).attr("name"));
                    }
                    else {
                        arrThem.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="divprogessdata"></div>');
                    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_KetQua(arrXoa[i]);
                    }
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_KetQua(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });


        me.objHangDoi = {
            strLoaiNhiemVu: "LAPDSHLTL",
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
        edu.system.getList_MauImport("zonebtnBaoCao_LDS", function (addKeyValue) {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblHoSoTuyenSinh", "checkX");
            //if (arrChecked_Id.length > 100) {
            //    edu.system.alert("Số được chọn không quá 100?");
            //    return false;
            //}
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_DT'),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strDanhGia_Id': edu.util.getValById('dropSearch_DanhGia'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
                'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
                'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
                'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
                'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
                'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
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
    getList_NguoiThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiDungDaThuTien/LayDanhSach',
            'versionAPI': 'v1.0',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NguoiThu(json);
                } else {
                    console.log(data.Message);
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',
            'versionAPI': 'v1.0',
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        //--Edit
        //var obj_list = {
        //    'action': 'KHCT_KhoaQuanLy/LayDanhSach',
        //    'versionAPI': 'v1.0',
        //    'strNguoiThucHien_Id': '',
        //}

        //edu.system.makeRequest({
        //    success: function (data) {
        //        if (data.Success) {
        //            var json = data.Data;
        //            me.cbGenCombo_KhoaQuanLy(json);
        //        } else {
        //            edu.system.alert("Lỗi: " + data.Message);
        //        }
        //    },
        //    error: function (er) {
        //        edu.system.alert("Lỗi: " + JSON.stringify(er));
        //    },
        //    type: "GET",
        //    action: obj_list.action,
        //    versionAPI: obj_list.versionAPI,
        //    contentType: true,
        //    data: obj_list,
        //    fakedb: [

        //    ]
        //}, false, false, false, null);
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.cbGenCombo_KhoaQuanLy);
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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
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
            renderPlace: ["dropSearch_HocKy"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy").val("").trigger("change");
    },
    cbGenCombo_NguoiThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NguoiThu"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-2 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-2 checkbox-inline user-check-print">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
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
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DMLKT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': '',
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': "",
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genList_DMLKT(data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_DMLKT: function (data) {
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
            renderPlace: ["dropSearch_KhoanThu"],
            type: "",
            title: "Tất cả khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HLTL_ThongTinChung/LayDSHocPhanHocLaiThiLai',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,

            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDanhGia_Id': edu.util.getValById('dropSearch_DanhGia'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_DMHocPhan'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genList_HocPhan(data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_HocPhan: function (data) {
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
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DoiTuong_CheDo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_ChinhSach/LayDS_DoiTuong_CheDo',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDoiTuong = data.Data;
                    me.genList_DoiTuong_CheDo(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_DoiTuong_CheDo: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOITUONG_TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DoiTuong"],
            type: "",
            title: "Chọn đối tượng chính sách",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TongHop: function (strTuKhoa) {
        var me = this;
        $("#zone_nhap").slideDown();
        var obj_list = {
            'action': 'HLTL_ThongTinChung/LayDSNguoiHocHocLaiThiLai',
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDanhGia_Id': edu.util.getValById('dropSearch_DanhGia'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtSinhVien = data.Data.rs;
                    me.dtDoiTuong = data.Data.rsHocPhan;
                    me.genTable_TongHop(data.Data.rs, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TongHop: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblKetQua";
        $("#tblKetQua thead").html(me.strHead);
        var strDanhGia = $("#dropSearch_DanhGia option:selected").text();
        for (var j = 0; j < me.dtDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Đánh giá</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Điểm</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Lần học</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="td-center">Lần thi</th>');
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="4" class="td-center">' + me.dtDoiTuong[j].TEN + " - " + edu.util.returnEmpty(me.dtDoiTuong[j].MA) + " - " + edu.util.returnEmpty(me.dtDoiTuong[j].HOCTRINH) + '</th>');
        }
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,

            //bPaginate: {
            //    strFuntionName: "main_doc.LapDanhSach.getList_TongHop()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 1, 2, 3, 4, 5],
            },
            "aoColumns": [
                {
                    "mDataProp": "HEDAOTAO"
                },
                {
                    "mDataProp": "KHOADAOTAO"
                },
                {
                    "mDataProp": "CHUONGTRINH"
                }
                , {
                    "mDataProp": "KHOAQUANLY"
                }
                , {
                    "mDataProp": "LOP"
                }
                , {
                    "mDataProp": "MASO"
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
            ]
        };

        for (var j = 0; j < me.dtDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblDanhGia_' + aData.ID + '_' + main_doc.LapDanhSach.dtDoiTuong[iThuTu].ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblDiem_' + aData.ID + '_' + main_doc.LapDanhSach.dtDoiTuong[iThuTu].ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lbl_LanHoc_' + aData.ID + '_' + main_doc.LapDanhSach.dtDoiTuong[iThuTu].ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="lblLanThi_' + aData.ID + '_' + main_doc.LapDanhSach.dtDoiTuong[iThuTu].ID + '"></span>';
                    }
                }
            );
            jsonForm.colPos.center.push(10 + j, 11 + j, 12 + j);
        }
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < me.dtDoiTuong.length; j++) {
                me.getList_KetQua(data[i].ID, me.dtDoiTuong[j].ID);
            }
        }
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KetQua: function (strQLSV_NguoiHoc_Id, strDoiTuong_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'HLTL_ThongTinChung/LayKQNguoiHocHocLaiThiLai',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_id': strQLSV_NguoiHoc_Id,
            'strDaoTao_HocPhan_Id': strDoiTuong_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strDanhGia_Id': edu.util.getValById('dropSearch_DanhGia'),
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length > 0) {
                        for (var i = 0; i < data.Data.length; i++) {
                            var json = data.Data[i];
                            $("#lblDiem_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.DIEM);
                            $("#lbl_LanHoc_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.LANHOC);
                            $("#lblLanThi_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.LANTHI);
                            $("#lblDanhGia_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.DANHGIA_TEN);
                        }
                    } else {
                        $("#tblKetQua tbody tr[id=" + strQLSV_NguoiHoc_Id + "]").hide();
                    }
                    
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_KetQua: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var objSV = edu.util.objGetOneDataInData(arrId[1], me.dtSinhVien, "ID");

        //--Edit
        var obj_save = {
            'action': 'TC_DoiTuong_MienGiam/ThemMoi',

            'strId': $(point).attr("name"),
            'strDaoTao_LopQuanLy_Id': objSV.LOP_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strDaoTao_ToChucCT_Id': objSV.CHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': objSV.ID,
            'strQLSV_DoiTuong_Id': arrId[2],
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'dPhanTramMienGiam': $("#txtPhanTram_" + arrId[1] + "_" + arrId[2]).val(),
            'dSoThang': $(point).val(),
            'strDiem_KieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_KhoanThu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'TC_DoiTuong_MienGiam/CapNhat';
        //}
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyetDinh_Id = "";
                    
                }
                else {
                    edu.system.alert(data.Message);
                }
                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessdata", me.endSetData);

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KetQua: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_DoiTuong_MienGiam/Xoa',


            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                edu.system.start_Progress("divprogessdata", me.endSetData);

            },
            error: function (er) {
                edu.system.alert(obj_delete.action + JSON.stringify(er));
                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    endSetData: function () {
        var me = main_doc.LapDanhSach;
        edu.system.alert("Thực hiện thành công", 'w');
        setTimeout(function () {
            me.getList_TongHop();
        }, 1000);
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

            'action': 'D_HangDoi/TaoHangDoi_LapDSHLTL_TuDong',
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDanhGia_Id': edu.util.getValById('dropSearch_DanhGia'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_DMHocPhan'),
            'strDiem_DanhSach_Id': edu.util.getValById('dropAAAA'),
        };

        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!",
                        code: "",
                    };
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                var obj = {
                    content: JSON.stringify(er),
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
        var me = main_doc.LapDanhSach;
        //me.getList_KetQua();
    },

    getList_DMHocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropAAAA'),
            'strThuocBoMon_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                    me.cbGenCombo_DMHocPhan(dtResult, iPager);
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
    cbGenCombo_DMHocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_DMHocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
}