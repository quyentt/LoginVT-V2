/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TimKiemSinhVien() { };
TimKiemSinhVien.prototype = {
    dtTimKiemSinhVien: [],
    strTimKiemSinhVien_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    iDem : 1,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);

        me.getList_TimKiemSinhVien();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();

        $("#btnSearch").click(function (e) {
            me.getList_TimKiemSinhVien();
        });
        $("#txtSearch_TKSV").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TimKiemSinhVien();
            }
        });
        $("[id$=chkSelectAll_TimKiemSinhVien]").on("click", function () {
            var checked_status = $(this).is(':checked');
            var tbl_id = "[id$=tblTimKiemSinhVien]";
            var listData = $(tbl_id);
            listData.find('input:checkbox').each(function () {
                var strId = this.id.replace(/checkX/g, '');
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
                if ($(this).is(":checked")) {
                    $("#txtThuTu" + strId).val(me.iDem++);
                } else {
                    $("#txtThuTu" + strId).val("");
                }
            });
        });
        $("#tblTimKiemSinhVien").delegate('.ithutu', 'click', function (e) {
            var strId = this.id.replace(/checkX/g, '');
            if ($(this).is(":checked")) {
                $("#txtThuTu" + strId).val(me.iDem++);
            } else {
                $("#txtThuTu" + strId).val("");
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        $('#dropSearch_HeDaoTao_TKSV').on('select2:select', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_TKSV').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_TKSV').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_TKSV').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_TKSV').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_TKSV').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_TKSV').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });

        $("#zonebatdau").delegate(".ckbDSTrangThaiSV_TKSV_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_TKSV").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_TKSV", function (addKeyValue) {
            var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblTimKiemSinhVien", "checkX");
            var obj_save = {
                'strTuKhoa': edu.util.getValById('txtSearch_TKSV'),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
                'strNguoiHoc_ThanhPhan_01': "",
                'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
                'strNguoiHoc_ThanhPhan_02': "",
                'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
                'strNguoiHoc_ThanhPhan_03': "",
                'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
                'strNguoiHoc_ThanhPhan_04': "",
                'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_TKSV'),
                'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_TKSV'),
                'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_TKSV'),
                'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_TKSV'),
                'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_TKSV'),
                'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_TKSV'),
                'strNguoiDangNhap_Id': edu.system.userId,
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_TKSV').toString(),
            };
            for (var x in obj_save) {
                addKeyValue(x, obj_save[x]);
            }
        });
        me.objHangDoi = {
            strLoaiNhiemVu: "TIMKIEMSINHVIEN",
            strName: "TimKiemSinhVien",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        $("#btnSearchThucHien").click(function () {
            me.TaoHangDoi();
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strTimKiemSinhVien_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_TimKiemSinhVien();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_TKSV"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_TKSV"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_TKSV"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_TKSV"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_TKSV"),
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
            renderPlace: ["dropSearch_HeDaoTao_TKSV"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_TKSV").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_TKSV"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_TKSV").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_TKSV"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_TKSV").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_TKSV"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_TKSV").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.TimKiemSinhVien;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_TKSV"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_TKSV").val("").trigger("change");
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
            renderPlace: ["dropThoiGianDaoTao_TKSV"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TimKiemSinhVien.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_TKSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_TKSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_TKSV").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc_TKSV"],
            type: "",
            title: "Tất cả năm nhập học",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_TKSV").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy_TKSV"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_TKSV").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TimKiemSinhVien: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_TP_NguoiDung/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.system.userId,
            'strNguoiHoc_ThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTimKiemSinhVien = dtReRult;
                    me.genTable_TimKiemSinhVien(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_TimKiemSinhVien: function (data, iPager) {
        var me = this;
        $("#lblTimKiemSinhVien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTimKiemSinhVien",
            bPaginate: {
                strFuntionName: "main_doc.TimKiemSinhVien.getList_TimKiemSinhVien()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,3],
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIHOC_THANHPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThuTu' + aData.ID + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control"/>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="ithutu"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    TaoHangDoi: function () {
        var me = this;
        var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblTimKiemSinhVien", "checkX");
        var arrNguoiHoc_ThanhPhan_ThuTu = [];
        arrNguoiHoc_ThanhPhan_Ids.forEach(e => { arrNguoiHoc_ThanhPhan_ThuTu.push($("#txtThuTu" + e).val()); });
        var obj_save = {
            'action': 'SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong',
            'strTuKhoa': edu.util.getValById('txtSearch_TKSV'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
            'strNguoiHoc_ThanhPhan_01': arrNguoiHoc_ThanhPhan_ThuTu.slice(0, 120).toString(),
            'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
            'strNguoiHoc_ThanhPhan_02': arrNguoiHoc_ThanhPhan_ThuTu.slice(120, 240).toString(),
            'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
            'strNguoiHoc_ThanhPhan_03': arrNguoiHoc_ThanhPhan_ThuTu.slice(240, 360).toString(),
            'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
            'strNguoiHoc_ThanhPhan_04': arrNguoiHoc_ThanhPhan_ThuTu.slice(360, 480).toString(),
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_TKSV'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_TKSV'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_TKSV'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_TKSV'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_TKSV'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_TKSV'),
            'strNguoiDangNhap_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_TKSV').toString(),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, !",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "QLTC_HangDoi.TaoHangDoi_TinhHocPhi_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "QLTC_HangDoi.TaoHangDoi_TinhHocPhi_TuDong (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
    },
}