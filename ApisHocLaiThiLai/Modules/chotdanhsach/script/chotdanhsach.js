/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChotDanhSach() { };
ChotDanhSach.prototype = {
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
        edu.system.loadToCombo_DanhMucDuLieu("QLHLTL.TINHTRANGDANGKY", "dropSearch_TrangThaiDangKy");

        $("#btnSearch").click(function (e) {
            
            me.getList_TongHop();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TongHop();
            }
        });
        $(".btnClose").click(function (e) {
            $("#zone_nhap").slideUp();
        });
        $("#btnSearchXemHocPhan").click(function (e) {

            me.getList_HocPhan();
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
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            
            
            me.resetCombobox(this);
        });

        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });

        $("[id$=chkSelectAll_DK]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKetQua" });
        });
        $("#tblKetQua").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblKetQua", regexp: /checkX/g, });
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
        var obj_list = {
            'action': 'KHCT_KhoaQuanLy/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaQuanLy(json);
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
            'strTuKhoa': edu.util.getValById('txtAAAA'),
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
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_HocPhan(data.Data, data.Pager);
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
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOITUONG_TEN",
                code: "",
                avatar: "",
                mRender: function (row, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
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
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtSinhVien = data.Data.rs;
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

        var strTableId = "tblKetQua";
        var jsonForm = {
            strTable_Id: strTableId,
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 10],
            },

            bPaginate: {
                strFuntionName: "main_doc.ChotDanhSach.getList_TongHop()",
                iDataRow: iPager
            },
            aoColumns: [
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
                , {
                    "mDataProp": "TINHTRANGTAICHINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
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
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strDanhGia_Id': edu.util.getValById('dropSearch_DanhGia'),
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        $("#lblDiem_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.DIEM);
                        $("#lbl_LanHoc_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.LANHOC);
                        $("#lblLanThi_" + strQLSV_NguoiHoc_Id + "_" + strDoiTuong_Id).html(json.LANTHI);
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
        var me = main_doc.ChotDanhSach;
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
        var me = main_doc.ChotDanhSach;
        //me.getList_KetQua();
    },
}