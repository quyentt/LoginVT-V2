/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuanLyToanBo() { };
QuanLyToanBo.prototype = {
    dtQuanLyToanBo: [],
    strQuanLyToanBo_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    dt_HS: [],
    strId: '',
    strSinhVien_Id: '',
    dtQuanHe: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.extend.setTinhThanh(["txtSV_NoiSinh", "txtSV_QueQuan", "txtSV_HoKhauThuongTru"], 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        edu.system.uploadAvatar(['uploadPicture_SV'], "");
        edu.system.loadToCombo_DanhMucDuLieu("NS.GITI", "dropSV_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropSV_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropSV_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropSV_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TPXT", "dropSV_HoanCanhXuatThan");
        edu.system.loadToCombo_DanhMucDuLieu("SV.DOITUONGUUTIEN", "dropSV_DoiTuongUuTien");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropSV_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QHGD", "", "", me.cbGetList_QuanHe, "", "HESO1");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "drop_TrangThaiSV");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TNH", "drop_TKNH_ThuocNganHang");
        me.getList_QuanLyToanBo();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        $("#btnSearch").click(function (e) {
            me.getList_QuanLyToanBo();
        });
        $("#txtSearch_QLTB").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuanLyToanBo();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("[id$=chkSelectAll_QuanLyToanBo]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanLyToanBo" });
        });
        $("#btnDeleteQuanLyToanBo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyToanBo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessQuanLyToanBo"></div>');
                edu.system.genHTML_Progress("zoneprocessQuanLyToanBo", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var objD = edu.util.objGetOneDataInData(arrChecked_Id[i], me.dtQuanLyToanBo, "ID");
                    if (objD.length != 0)
                        me.delete_HSSV(objD.QLSV_NGUOIHOC_ID);
                    else edu.system.alert("Không tìm được sinh viên");
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        $('#dropSearch_HeDaoTao_QLTB').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_QLTB').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QLTB').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QLTB').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });

        $("#zonebatdau").delegate(".ckbDSTrangThaiSV_QLTB_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QLTB").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_QLTB", function (addKeyValue) {
            var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblQuanLyToanBo", "checkX");
            var obj_save = {
                'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
                'strNguoiHoc_ThanhPhan_01': "",
                'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
                'strNguoiHoc_ThanhPhan_02': "",
                'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
                'strNguoiHoc_ThanhPhan_03': "",
                'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
                'strNguoiHoc_ThanhPhan_04': "",
                'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
                'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
                'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
                'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
                'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
                'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
                'strThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_ThoiGianDaoTao_QLTB'),
                'strNguoiDangNhap_Id': edu.system.userId,
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
            };

            for (var x in obj_save) {
                addKeyValue(x, obj_save[x]);
            }
            arrNguoiHoc_ThanhPhan_Ids.forEach(e => addKeyValue("strNguoiHoc_Id",e))
        });
        $("#txtSearch_QLTB").click(function () {
            me.getList_QuanLyToanBo();
        });
        $("#btnHSSV_Save").click(function () {
            me.save_HS();
        });
        $("#delete_HSSV").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HSSV(me.strSinhVien_Id);
            });
        });
        $("#tblQuanLyToanBo").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strSinhVien_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strSinhVien_Id, "tblQuanLyToanBo");
            me.getDetail_HSSV(me.strSinhVien_Id);
            me.getList_ThanhVien(me.strSinhVien_Id);
            me.toggle_edit();
        });
        $("#tblQuanLyToanBo").delegate('.btnDetailQuyetDinh', 'click', function (e) {
            $('#myModalQuyetDinh').modal('show');
            var obj = edu.util.objGetOneDataInData(this.id, me.dtQuanLyToanBo, "QLSV_NGUOIHOC_ID");
            $(".SinhVienDaChon").html(obj.QLSV_NGUOIHOC_HODEM + " " + obj.QLSV_NGUOIHOC_TEN + " - " + obj.QLSV_NGUOIHOC_MASO); 
            me.getList_QuaTrinhQuyetDinh(this);
        });
        $("#tblQuanLyToanBo").delegate('.btnDetailChuyenLop', 'click', function (e) {
            $('#myModalQuaTrinh').modal('show');
            var obj = edu.util.objGetOneDataInData(this.id, me.dtQuanLyToanBo, "QLSV_NGUOIHOC_ID");
            $(".SinhVienDaChon").html(obj.QLSV_NGUOIHOC_HODEM + " " + obj.QLSV_NGUOIHOC_TEN + " - " + obj.QLSV_NGUOIHOC_MASO); 
            me.getList_QuaTrinhChuyenLop(this);
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strQuanLyToanBo_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_QuanLyToanBo();
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QLTB"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QLTB"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QLTB"),
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
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao(dtReRult);
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
            renderPlace: ["dropSearch_HeDaoTao_QLTB"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_QLTB").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_QLTB"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_QLTB").val("").trigger("change");
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
        if (data.length != 1) $("#dropSearch_ChuongTrinh_QLTB").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_QLTB"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_QLTB").val("").trigger("change");
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
    getList_QuanLyToanBo: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoNhieuNganh/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
            'strNguoiDangNhap_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuanLyToanBo = dtReRult;
                    me.genTable_QuanLyToanBo(dtReRult, data.Pager);
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
    genTable_QuanLyToanBo: function (data, iPager) {
        var me = this;
        $("#lblQuanLyToanBo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanLyToanBo",
            bPaginate: {
                strFuntionName: "main_doc.QuanLyToanBo.getList_QuanLyToanBo()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 12 ,13],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                    //"mRender": function (nRow, aData) {
                    //    return '<span><a class="btn btn-default" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa">' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</a></span>';
                    //}
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                    //"mRender": function (nRow, aData) {
                    //    return '<span><a class="btn btn-default" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa">' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + '</a></span>';
                    //}
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",
                    //"mRender": function (nRow, aData) {
                    //    return '<span><a class="btn btn-default" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa">' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + '</a></span>';
                    //}
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }, 
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                }, 
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
                //{
                //    "mDataProp": "TTLL_KHICANBAOTINCHOAI_ODAU"
                //},
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnDetailChuyenLop" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Xem quá trình"><i class="fa fa-eye color-active"></i>Xem</a></span>';
                //    }
                //},
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnDetailQuyetDinh" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Xem quyết định"><i class="fa fa-eye color-active"></i>Xem</a></span>';
                //    }
                //},
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnEdit" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                //    }
                //}
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    TaoHangDoi: function () {
        var me = this;
        var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblQuanLyToanBo", "checkX");
        var obj_save = {
            'action': 'SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong',

            'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
            'strNguoiHoc_ThanhPhan_01': strNguoiHoc_ThanhPhan_01,
            'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
            'strNguoiHoc_ThanhPhan_02': strNguoiHoc_ThanhPhan_02,
            'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
            'strNguoiHoc_ThanhPhan_03': strNguoiHoc_ThanhPhan_03,
            'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
            'strNguoiHoc_ThanhPhan_04': strNguoiHoc_ThanhPhan_04,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
            'strNguoiDangNhap_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
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
    save_HS: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_HoSo/Capnhat',

            'strId': me.strSinhVien_Id,
            'strHoDem': edu.util.getValById('txtSV_HoDem'),
            'strTen': edu.util.getValById('txtSV_Ten'),
            'strMaSo': edu.util.getValById('txt_MaSoSV'),
            'strNgaySinh_Nam': edu.util.getValById('txtSV_NamSinh'),
            'strNgaySinh_Thang': edu.util.getValById('txtSV_ThangSinh'),
            'strNgaySinh_Ngay': edu.util.getValById('txtSV_NgaySinh'),
            'strBiDanh': "",
            'strTenGoiKhac': "",
            'strSoHoChieu': "",
            'strGioiTinh_Id': edu.util.getValById('dropSV_GioiTinh'),
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("tinhid")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("huyenid")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("xaId")),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("name")),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("tinhid")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("huyenid")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("xaId")),
            'strQueQuan_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_QueQuan").attr("name")),
            'strDanToc_Id': edu.util.getValById('dropSV_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropSV_TonGiao'),
            'strCMTND_So': edu.util.getValById('txtSV_SCC_So'),
            'strCMTND_NgayCap': edu.util.getValById('txtSV_SCC_NgayCap'),
            'strCMTND_NoiCap': edu.util.getValById('txtSV_SCC_NoiCap'),
            'strNoiOHienNay': edu.util.getValById('txtSV_NoiOHienNay'),
            'strNgayVaoTruong': edu.util.getValById('txt_NgayVaoTruong'),
            'strDangDoan_NgayVaoDoan': edu.util.getValById('txtSV_NgayVaoDoan'),
            'strDangDoan_NgayVaoDang': edu.util.getValById('txtSV_NgayVaoDang'),
            'strDangDoan_NgayChinhThuc': edu.util.getValById('txtSV_NgayVaoDangChinhThuc'),
            'strNganHang_SoTaiKhoan': edu.util.getValById('txtSV_TaiKhoanNganHang'),
            'strNganHang_ThuocNganHang_Id': edu.util.getValById('drop_TKNH_ThuocNganHang'),
            'strNganHang_ThongTinChiNhanh': edu.util.getValById('txtSV_ChiNhanhNganHang'),
            'strHoKhau_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("tinhid")),
            'strHoKhau_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("huyenid")),
            'strHoKhau_Xa_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("xaId")),
            'strHoKhau_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("name")),
            'strQuocTich_Id': edu.util.getValById('dropSV_QuocTich'),
            'strThanhPhanGiaDinh_Id': edu.util.getValById('dropSV_HoanCanhXuatThan'),
            'strDoiTuongDaoTao_Id': edu.util.getValById('dropSV_DoiTuongUuTien'),
            'strTTLL_DienThoaiCaNhan': edu.util.getValById('txtSV_DienThoaiCaNhan'),
            'strTTLL_DienThoaiGiaDinh': "",
            'strTTLL_DienThoaiCoQuan': "",
            'strTTLL_EmailCaNhan': edu.util.getValById('txtSV_Email'),
            'strTTLL_KhiCanBaoTinChoAi': edu.util.getValById('txtSV_DiaChiBaoTin'),
            'strNgayRaTruong': edu.util.getValById('txtNgayRaTruong'),
            'strThongTinTruoc_NgheNghiep': "",
            'strThongTinTruoc_KhenThuong': "",
            'strThongTinTruoc_KyLuat': "",
            'strThongTinTruoc_GhiChu': "",
            'strAnh': edu.util.getValById('uploadPicture_SV'),
            'strCoQuanCongTac': edu.util.getValById('txtCoQuanCongTac'),
            'strMaSoThueCaNhan': edu.util.getValById('txtMaSoThue'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('drop_TrangThaiSV'),
            'strLopQuanLy_Id': "#",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Lưu thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!", 'i');
                    }
                    $("#tblThanhVien tbody tr").each(function () {
                        var strThanhVien_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThanhVien(strThanhVien_Id, me.strSinhVien_Id);
                    });
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) { },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HSSV: function () {
        var me = main_doc.QuanLyToanBo
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.dt_HS = dtResult;
                    me.genTable_HSSV(dtResult, iPager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HSSV: function () {
        var me = main_doc.QuanLyToanBo;
        var obj_detail = {
            'action': 'SV_HoSo/LayChiTiet',

            'strId': me.strSinhVien_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HS(data.Data[0]);
                    }
                    else {
                        me.viewForm_HS([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_detail.action,
            contentType: true,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    delete_HSSV: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_HoSo/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#zoneEdit").slideUp();
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessQuanLyToanBo", function () {
                    me.getList_QuanLyToanBo();
                });
            },
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: Generating html on interface HoSoSinhVien
	--ULR:  Modules
	-------------------------------------------*/
    genTable_HSSV: function (data, iPager) {
        var me = main_doc.QuanLyToanBo;
        edu.util.viewHTMLById("lblDSSV_NhanSu_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDSSV_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyToanBo.getList_HSSV()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            colPos: {
                left: [1],
                fix: [0]
            },
            arrClassName: ["btnEdit"],
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(aData.ANH), constant.setting.EnumImageType.ACCOUNT);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(aData.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(aData.NGAYSINH_NAM) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_HS: function (data) {
        var me = main_doc.CapNhatHoSo;
        //Thong tin co ban
        edu.util.viewValById("uploadPicture_SV", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_SV").attr("src", strAnh);
        edu.util.viewValById("txtSV_HoDem", data.HODEM);
        edu.util.viewValById("txtSV_Ten", data.TEN);
        edu.util.viewValById("txtSV_NgaySinh", data.NGAYSINH_NGAY);
        edu.util.viewValById("txtSV_ThangSinh", data.NGAYSINH_THANG);
        edu.util.viewValById("txtSV_NamSinh", data.NGAYSINH_NAM);
        edu.util.viewValById("txtSV_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewValById("txtSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_TEN);
        edu.util.viewValById("txtSV_DanToc", data.DANTOC_TEN);
        edu.util.viewValById("txtSV_TonGiao", data.TONGIAO_TEN);
        edu.util.viewValById("txtSV_QuocTich", data.QUOCTICH_TEN);
        edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_TEN);
        edu.util.viewValById("dropSV_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("dropSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_ID);
        edu.util.viewValById("dropSV_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropSV_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("dropSV_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_ID);

        edu.util.viewValById("txt_NgayVaoTruong", data.NGAYVAOTRUONG);
        edu.util.viewValById("txtNgayRaTruong", data.NGAYRATRUONG);
        edu.util.viewValById("txt_MaSoSV", data.MASO);
        edu.util.viewValById("drop_TrangThaiSV", data.QLSV_NGUOIHOC_TRANGTHAI_ID);
        edu.util.viewValById("txtSV_HeDaoTao", data.HEDAOTAO);
        edu.util.viewValById("txtSV_KhoaDaoTao", data.KHOADAOTAO);
        edu.util.viewValById("txtSV_KhoaQuanLy", data.KHOAQUANLY);
        edu.util.viewValById("txtSV_NganhHoc", data.NGANH);
        edu.util.viewValById("txtSV_Lop", data.LOP);
        edu.util.viewValById("txtSV_TruongTHPT", data.DAOTAO_COCAUTOCHUC_ID);//////
        edu.util.viewValById("txtSV_TaiKhoanNganHang", data.NGANHANG_SOTAIKHOAN);
        edu.util.viewValById("drop_TKNH_ThuocNganHang", data.NGANHANG_THUOCNGANHANG_ID);
        edu.util.viewValById("txtSV_ChiNhanhNganHang", data.NGANHANG_THONGTINCHINHANH);
        edu.extend.viewTinhThanhById("txtSV_NoiSinh", data.NOISINH_TINHTHANH_ID, data.NOISINH_QUANHUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_PHUONGXAKHOIXOM);
        edu.extend.viewTinhThanhById("txtSV_QueQuan", data.QUEQUAN_TINHTHANH_ID, data.QUEQUAN_QUANHUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_PHUONGXAKHOIXOM);
        edu.extend.viewTinhThanhById("txtSV_HoKhauThuongTru", data.HOKHAU_TINHTHANH_ID, data.HOKHAU_QUANHUYEN_ID, data.HOKHAU_XA_ID, data.HOKHAU_PHUONGXAKHOIXOM);
        edu.util.viewValById("txtSV_NoiOHienNay", data.NOIOHIENNAY);
        edu.util.viewValById("txtSV_DiaChiBaoTin", data.TTLL_KHICANBAOTINCHOAI_ODAU);
        edu.util.viewValById("txtSV_Email", data.TTLL_EMAILCANHAN);
        edu.util.viewValById("txtSV_DienThoaiCaNhan", data.TTLL_DIENTHOAICANHAN);
        edu.util.viewValById("txtSV_LinkFB", data.DANG_NGAYVAO);
        edu.util.viewValById("txtSV_SCC_So", data.CMTND_SO);
        edu.util.viewValById("txtSV_SCC_NgayCap", data.CMTND_NGAYCAP);
        edu.util.viewValById("txtSV_SCC_NoiCap", data.CMTND_NOICAP);
        edu.util.viewValById("txtSV_NgayVaoDoan", data.DANGDOAN_NGAYVAODOAN);
        edu.util.viewValById("txtSV_NgayVaoDang", data.DANGDOAN_NGAYVAODANG);
        edu.util.viewValById("txtSV_NgayVaoDangChinhThuc", data.DANGDOAN_NGAYCHINHTHUCVAODANG);
        edu.util.viewValById("txtCoQuanCongTac", data.COQUANCONGTAC);
        edu.util.viewValById("txtMaSoThue", data.MASOTHUECANHAN);
    },
    save_ThanhVien: function (strThanhVien_Id, strSinhVien_Id) {
        var me = this;
        var strId = strThanhVien_Id;
        var strTPGD_Ten = edu.util.getValById('txtHoTen' + strThanhVien_Id);
        var strQuanHe_Id = edu.util.getValById('dropQuanHe' + strThanhVien_Id);
        var strTPGD_NamSinh = edu.util.getValById('txtNamSinh' + strThanhVien_Id);
        var strTPGD_NgheNghiep = edu.util.getValById('txtNgheNghiep' + strThanhVien_Id);
        var strTPGD_DienThoaiCaNhan = edu.util.getValById('txtSoDienThoai' + strThanhVien_Id);
        var strTPGD_NoiOHienNay = edu.util.getValById('txtNoiOHienNay' + strThanhVien_Id);
        if (!edu.util.checkValue(strTPGD_Ten) || !edu.util.checkValue(strQuanHe_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'SV_ThanhPhanGiaDinh/ThemMoi',

            'strId': strThanhVien_Id,
            'strQLSV_NguoiHoc_Id': strSinhVien_Id,
            'strQuanHe_Id': strQuanHe_Id,
            'strHoDem': "",
            'strTen': strTPGD_Ten,
            'strQuocTich_Id': "",
            'strDanToc_Id': "",
            'strTonGiao_Id': "",
            'strHoKhau_TinhThanh_Id': "",
            'strHoKhau_QuanHuyen_Id': "",
            'strHoKhau_Xa_Id': "",
            'strHoKhau_PhuongXaKhoiXom': strTPGD_NoiOHienNay,
            'strNgaySinh_Ngay': "",
            'strNgaySinh_Thang': "",
            'strNgaySinh_Nam': strTPGD_NamSinh,
            'strNgheNghiep': strTPGD_NgheNghiep,
            'strDienThoaiCaNhan': strTPGD_DienThoaiCaNhan,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'SV_ThanhPhanGiaDinh/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    edu.system.alert(obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_ThanhPhanGiaDinh/LayDanhSach',

            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strQuanHe_Id': '',
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThanhVien(dtResult);
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
    delete_ThanhVien: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_ThanhPhanGiaDinh/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThanhVien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHTML_ThanhVien: function (data) {
        var me = this;
        $("#tblThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThanhVien_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThanhVien_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThanhVien_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropQuanHe' + strThanhVien_Id + '" class="select-opt"></select ></td>';
            row += '<td><input type="text" id="txtHoTen' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].TEN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNamSinh' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYSINH_NAM) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgheNghiep' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].NGHENGHIEP) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtSoDienThoai' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].DIENTHOAICANHAN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNoiOHienNay' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].HOKHAU_PHUONGXAKHOIXOM) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteTienDo" id="' + strThanhVien_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblThanhVien tbody").append(row);
            me.genComBo_QuanHe("dropQuanHe" + strThanhVien_Id, data[i].QUANHE_ID);
        }
        for (var i = data.length; i < 6; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhVienNew(id, "");
        }
    },
    genHTML_ThanhVienNew: function (strThanhVien_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThanhVien").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThanhVien_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThanhVien_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropQuanHe' + strThanhVien_Id + '" class="select-opt"></select ></td>';
        row += '<td><input type="text" id="txtHoTen' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNamSinh' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgheNghiep' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtSoDienThoai' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNoiOHienNay' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThanhVien_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblThanhVien tbody").append(row);
        me.genComBo_QuanHe("dropQuanHe" + strThanhVien_Id, "");
    },
    cbGetList_QuanHe: function (data) {
        main_doc.QuanLyToanBo.dtQuanHe = data;
    },
    genComBo_QuanHe: function (strDropId, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuanHe,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strDropId],
            type: "",
            title: "Chọn quan hệ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDropId).select2();
    },    
    getList_QuaTrinhQuyetDinh: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var obj_list = {
            'action': 'SV_QuyetDinh_ThucThi/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': point.id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuaTrinhQuyetDinh(dtReRult);
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
    genTable_QuaTrinhQuyetDinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                },
                {
                    "mDataProp": "NGUYENNHAN_LYDO"
                },
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_QuaTrinhChuyenLop: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var obj_list = {
            'action': 'SV_HoatDong_ThayDoi/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': point.id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuaTrinhChuyenLop(dtReRult);
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
    genTable_QuaTrinhChuyenLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuaTrinh",
            aaData: data,
            colPos: {
                center: [0,2, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_LOPCU_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPMOI_TEN"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}